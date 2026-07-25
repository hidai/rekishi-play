// 読み解き地図の SVG ジェネレータ（旧 markIcon/geoFlat/buildLocator/faceSvg/buildSceneMap,
// index.html 1580-1755 逐語）を work パラメタ化。純粋な文字列生成関数群。
//
// ⚠️ faceSvg の clip-path 回避策（README 記載）:
//   ネストした <svg> に clip-path を掛けるとブラウザが clipPath 座標を内側 svg の
//   座標系で解釈し、顔が丸ごと切り取られる。そこで顔の中身だけを <g transform> で
//   親座標系に置き、同じ座標系の円でクリップする。逐語保持＋出力テストで回帰防止。
import type { Geo, Marker, Work } from '../types';
import { faceArt } from '../art/face';
import { esc, textW } from '../util';
import { activeFactionColor, ownsAt } from './territory';
import { geoBaseRings, geoWater, gazXY, emptyBBox, growBBox, growPoint, projX, projY } from './project';

// Ink box of each icon in its own (pre-scale) units, read off the paths below. Only a gate reads
// this — an icon buried under a neighbour's face disc is a defect no type check or raster-free test
// can see, and the boxes have to come from the same file as the paths to stay true.
export const ICON_BOX: Record<string, [number, number, number, number]> = {
  castle: [-17, -18, 17, 6],
  town: [-24, -16, 24, 6],
  siege: [-17, -18, 17, 10],
  battle: [-11, -10, 11, 9],
  mine: [-13, -12, 13, 7],
  crisis: [-10, -19, 12, 6],
  death: [-12, -18, 12, 3],
  flag: [-1, -17, 14, 8],
  sea: [-17, -9, 17, 9],
  shrine: [-18, -15.6, 18, 4.5],
  village: [-16, -16, 24, 6],
  person: [-8, 2, 8, 8],
};

export function markIcon(kind: string, enemy?: number | boolean): string {
  const stone = enemy ? '#9c3a2e' : '#4a4038',
    gold = '#c9a23e';
  switch (kind) {
    case 'castle':
      return `<path d="M-13 6 L-13 -6 L-17 -6 L0 -18 L17 -6 L13 -6 L13 6 Z" fill="${stone}"/><path d="M-8 -10 L0 -18 L8 -10 Z" fill="${gold}"/><rect x="-3.5" y="-2" width="7" height="8" fill="${gold}"/>`;
    case 'town':
      return `<g fill="#6f5638"><path d="M-24 6 L-24 -1 L-17 -7 L-10 -1 L-10 6 Z"/><path d="M10 6 L10 -1 L17 -7 L24 -1 L24 6 Z"/></g><path d="M-11 6 L-11 -5 L-15 -5 L0 -16 L15 -5 L11 -5 L11 6 Z" fill="#4a4038"/><path d="M-7 -9 L0 -16 L7 -9 Z" fill="${gold}"/><rect x="-3" y="0" width="6" height="6" fill="${gold}"/>`;
    case 'siege':
      return (
        markIcon('castle', enemy) +
        `<g stroke="#3d7aa8" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M-16 10 Q-11 6 -6 10 T4 10 T14 10"/></g>`
      );
    case 'battle':
      return `<g stroke-linecap="round"><path d="M-11 9 L9 -10" stroke="#7a3b2e" stroke-width="6"/><path d="M11 9 L-9 -10" stroke="#7a3b2e" stroke-width="6"/><path d="M-11 9 L9 -10" stroke="#c9433a" stroke-width="2.6"/><path d="M11 9 L-9 -10" stroke="#e0e3e8" stroke-width="2.6"/></g>`;
    case 'mine':
      return `<path d="M-13 7 L0 -12 L13 7 Z" fill="#7f858c"/><path d="M-4 7 L3 -4 L10 7 Z" fill="#a9afb6"/><circle cx="-1" cy="0" r="3" fill="#eef1f4"/>`;
    case 'crisis':
      return `<path d="M0 -19 C10 -11 12 -3 5 5 C9 0 3 -4 1 -10 C-1 -3 -8 -1 -6 6 C-13 -3 -10 -12 0 -19 Z" fill="#d24a2e"/><path d="M0 -9 C4 -5 5 -1 2 4 C4 1 1 -2 0 -6 C-1 -1 -4 1 -3 4 C-6 -1 -4 -6 0 -9 Z" fill="#f0b53e"/>`;
    case 'death':
      return `<circle cx="0" cy="-6" r="12" fill="none" stroke="#c9a23e" stroke-width="1.6" opacity=".55"/><path d="M0 3 C-7 -3 -7 -12 0 -17 C7 -12 7 -3 0 3 Z" fill="#cdd2da"/><path d="M0 3 L0 -15" stroke="#9aa0a8" stroke-width="1.2"/>`;
    case 'flag':
      return `<path d="M-1 8 L-1 -17" stroke="#8a6a3a" stroke-width="2.4" stroke-linecap="round"/><path d="M-1 -17 L14 -13.5 L-1 -8 Z" fill="${enemy ? '#b23a2e' : gold}"/>`;
    case 'sea':
      // Open water. Not a thing at a coordinate — the conventional mark that lets an ocean carry its
      // name (and, on a world-scale stage, the only place a long note fits: a marker on a coast sits
      // 92 units from the frame edge, so its text runs off, while mid-ocean has the whole width).
      return `<g stroke="#3d7aa8" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".8"><path d="M-16 -4 Q-11 -8 -6 -4 T4 -4 T14 -4"/><path d="M-16 4 Q-11 0 -6 4 T4 4 T14 4"/></g>`;
    case 'shrine':
      // Torii. The icon set had no shrine, so 神社・東照宮 had to borrow 'death' (a pale soul at
      // 55% opacity) — unreadable at scene-map scale for a mark whose whole job is「ここに 神として
      // まつられた」. Stone pillars + gold 笠木 follow the castle's own color grammar (a red torii
      // would read as an enemy mark, since red is this map's enemy color).
      return `<g fill="${stone}"><path d="M-10.5 -12 L-6.5 -12 L-5.6 4.5 L-11.4 4.5 Z"/><path d="M6.5 -12 L10.5 -12 L11.4 4.5 L5.6 4.5 Z"/><path d="M-12 -7.4 L12 -7.4 L12 -4.2 L-12 -4.2 Z"/></g><path d="M-18 -15.6 Q0 -11.4 18 -15.6 L18 -12 Q0 -7.8 -18 -12 Z" fill="${gold}"/>`;
    case 'village':
      return `<path d="M-13 6 L-13 -6 L-16 -6 L0 -16 L16 -6 L13 -6 L13 6 Z" fill="#7d5a34"/><path d="M-7 -9 L0 -16 L7 -9 Z" fill="#9a6f3d"/><rect x="-3.5" y="0" width="7" height="6" fill="#c9a23e"/><g stroke="#4e7a3b" stroke-width="2.6" stroke-linecap="round"><path d="M18 6 L18 -8"/><path d="M23 6 L23 -5"/></g>`;
    default:
      return `<ellipse cx="0" cy="5" rx="8" ry="2.8" fill="rgba(0,0,0,.2)"/>`; // person: 影だけ（顔が主役）
  }
}

// 全国ロケーター用：日本（東海〜九州の主戦場）の平坦シルエットを一度だけ組む
const _geoFlatCache = new WeakMap<Geo, string>();
export function geoFlat(geo: Geo): string {
  let s = _geoFlatCache.get(geo);
  if (s == null) {
    const fill = 'color-mix(in srgb, var(--ink) 26%, var(--panel-2))';
    // Base national silhouette first (full Japan incl. Tohoku/Okinawa), then province overlays.
    const base = geoBaseRings(geo)
      .map((d) => `<path d="${d}" fill="${fill}" stroke="${fill}" stroke-width="3" stroke-linejoin="round"/>`)
      .join('');
    s =
      base +
      Object.values(geo.pref)
        .map((o) => `<path d="${o.d}" fill="${fill}"/>`)
        .join('');
    _geoFlatCache.set(geo, s);
  }
  return s;
}

/**
 * The world a scene is drawn in: the stage it names (`SceneMapDef.geo` → `WorkMap.geos`), else the
 * work's home geo. Every consumer of a scene's geometry must go through here — a gaz place is stored
 * once in real [lon,lat] and means different pixels in different projections, so reading a marker
 * with the wrong geo silently misplaces it rather than raising anything.
 */
export function sceneGeo(work: Work, sceneId: string): Geo {
  const key = work.map.sceneMaps[sceneId]?.geo;
  return (key && work.map.geos?.[key]) || work.map.geo;
}

/**
 * Every place this work can pin as an on-map dot IN ONE GEO: the non-`off` markers of the scenes
 * staged there, plus (on the home geo) the chapter default markers used by scenes with no authored
 * map, plus the journey dots of `allDots` scenes.
 *
 * Off-map markers are excluded on purpose — their gaz entries only supply an edge arrow's direction
 * and sit far outside the frame (katsu's 西洋, out past the East China Sea), so framing them would
 * blow the window out into empty sea.
 *
 * Scenes staged elsewhere are excluded for the same reason in reverse: San Francisco is a real place
 * that a Pacific-staged scene pins for real, but projecting it through the Japan geo puts it ~24,000
 * units west of Kyushu. A window is only meaningful within one projection.
 */
function pinnedPoints(work: Work, geo: Geo): { x: number; y: number }[] {
  const map = work.map;
  const pts: { x: number; y: number }[] = [];
  const pin = (key: string) => {
    const g = map.gaz[key];
    if (g) pts.push(gazXY(geo, g));
  };
  let allDots = false;
  for (const [sid, def] of Object.entries(map.sceneMaps)) {
    if (sceneGeo(work, sid) !== geo) continue;
    if (def.allDots) allDots = true;
    for (const m of def.markers ?? []) if (!m.off) pin(m.at);
  }
  // Scenes with no authored map fall back to their chapter's default location, always on the home geo.
  if (geo === map.geo) for (const key of Object.values(map.chapterPoints)) pin(key);
  if (allDots) for (const p of map.mapPoints) pts.push(gazXY(geo, p));
  return pts;
}

/**
 * Content-fit window for the locator mini-map, replacing the legacy fixed `geo.vb` rectangle. That
 * rectangle framed western Japan only (it ends east of Shizuoka), so an eastern work overflowed it:
 * katsu's 江戸 projects to x≈1062 past the vb's 1000, and 15 of its 22 scene maps painted the gold
 * dot and the red view rect outside the white locator panel (family observation memo 2026-07-15).
 *
 * The window frames the geo's *mapped provinces* — the detailed silhouette a child reads as "the
 * country" — unioned with every place this work pins (`pinnedPoints`), so the dot is inside the box
 * by construction for any work, including one staged past the province data. It is derived per work,
 * never declared: an eastern or overseas story widens its own frame instead of overflowing a shared
 * constant. The base coastline (Hokkaido/Tohoku/Okinawa, reaching y≈-971..1252) stays outside the
 * window and is clipped, so the country reads as land running off the box edge rather than a hard
 * cut — the same honesty rule the campaign map's base coastline follows (see campaignViewBox).
 * A silhouette-only geo (no provinces, e.g. an overseas asset) frames its land instead; with
 * neither land nor pins, it falls back to the declared vb.
 *
 * `pad` keeps a strip of sea around the land and must exceed the dot's radius in window units
 * (4.6*sc / inner ≈ LW/65 ≈ 19px for Japan), so a pin at the extreme still draws fully inside.
 *
 * The window is per (work, geo): a scene staged in another world gets that world's window, so the
 * locator's "the whole country vs. the bit you are looking at" comparison stays inside one
 * projection. In practice a world-scale stage then draws no locator at all — the view already fills
 * its own window, which trips the `bw >= LW*0.62` guard below. That is the right answer rather than
 * an accident: a mini-map of the Pacific, shown next to a map of the Pacific, says nothing.
 */
const _locWinCache = new WeakMap<Work, WeakMap<Geo, [number, number, number, number]>>();
export function locatorWindow(work: Work, geo: Geo = work.map.geo): [number, number, number, number] {
  let byGeo = _locWinCache.get(work);
  if (!byGeo) _locWinCache.set(work, (byGeo = new WeakMap()));
  let win = byGeo.get(geo);
  if (win) return win;
  const b = emptyBBox();
  for (const o of Object.values(geo.pref)) growBBox(o.d, b);
  if (!isFinite(b.x0)) for (const d of geoBaseRings(geo)) growBBox(d, b);
  for (const p of pinnedPoints(work, geo)) growPoint(b, p.x, p.y);
  const pad = 24;
  win = isFinite(b.x0)
    ? [b.x0 - pad, b.y0 - pad, b.x1 - b.x0 + 2 * pad, b.y1 - b.y0 + 2 * pad]
    : [0, 0, geo.vb[0], geo.vb[1]];
  byGeo.set(geo, win);
  return win;
}

/* いま日本のどこを見ているかを 隅に示すミニ地図（子どもの地理の道しるべ）。
   マーカーから いちばん遠い隅に置き、赤枠＝いまの表示範囲、金の点＝現在地。
   窓は locatorWindow（作品ごとに内容から導く）で、レガシー固定窓 geo.vb ではない。*/
export function buildLocator(
  work: Work,
  geo: Geo,
  x0: number,
  y0: number,
  bw: number,
  bh: number,
  sc: number,
  onmap: Marker[],
  offPts: { x: number; y: number }[],
): string {
  const [LX, LY, LW, LH] = locatorWindow(work, geo);
  if (bw >= LW * 0.62) return ''; // すでに広域を見ている時は不要
  const pad = 7 * sc,
    m2 = 11 * sc;
  const iw = bw * 0.3,
    ih = iw * (LH / LW),
    inner = iw / LW;
  const boxW = iw + 2 * pad,
    boxH = ih + 2 * pad + 15 * sc; // 下に「いまここ」ラベルぶん
  const avoid = onmap.map((m) => ({ x: (m as any).x, y: (m as any).y }));
  offPts.forEach((p) => avoid.push(p));
  const corners = [
    { ax: x0 + m2, ay: y0 + m2 },
    { ax: x0 + bw - boxW - m2, ay: y0 + m2 },
    { ax: x0 + m2, ay: y0 + bh - boxH - m2 },
    { ax: x0 + bw - boxW - m2, ay: y0 + bh - boxH - m2 },
  ];
  let best = corners[2],
    bestD = -1;
  corners.forEach((c) => {
    const cx = c.ax + boxW / 2,
      cy = c.ay + boxH / 2;
    let d = Infinity;
    avoid.forEach((a) => {
      d = Math.min(d, Math.hypot(a.x - cx, a.y - cy));
    });
    if (!avoid.length) d = 1e9;
    if (d > bestD) {
      bestD = d;
      best = c;
    }
  });
  const px = best.ax,
    py = best.ay,
    gx = px + pad,
    gy = py + pad;
  // Window px → mini-map px.
  const mx = (x: number) => gx + (x - LX) * inner,
    my = (y: number) => gy + (y - LY) * inner;
  const cm = onmap.find((m) => m.cur);
  const curDot = cm
    ? `<circle cx="${mx((cm as any).x)}" cy="${my((cm as any).y)}" r="${4.6 * sc}" fill="var(--gold-deep)" stroke="var(--panel)" stroke-width="${1.5 * sc}"/>`
    : '';
  // The base coastline runs far past the window (Hokkaido, Okinawa) and the red view rect can
  // reach past the country when a scene looks out to sea, so both are clipped to the mini-map box:
  // the frame edge reads as "the map goes on", never as a shape floating outside the panel. The
  // gold dot is deliberately NOT clipped — locatorWindow contains every pinned place, so it always
  // lands inside, and clipping it would hide the one thing the child is looking for if that ever
  // broke (tests/scene-map-locator.test.ts asserts containment for every scene of every work).
  // The id is derived from the box geometry so two locators in one document never share a
  // clip rect unless their geometry is identical (in which case sharing is harmless).
  const cid = `locmap-${Math.round(px)}-${Math.round(py)}-${Math.round(iw)}`;
  return `<g class="loc" opacity="0.94">
    <rect x="${px}" y="${py}" width="${boxW}" height="${boxH}" rx="${6 * sc}" fill="var(--panel)" stroke="var(--sumi)" stroke-opacity="0.28" stroke-width="${1.1 * sc}"/>
    <rect x="${gx}" y="${gy}" width="${iw}" height="${ih}" rx="${2 * sc}" fill="color-mix(in srgb,var(--accent-soft) 22%,var(--panel-2))"/>
    <clipPath id="${cid}"><rect x="${gx}" y="${gy}" width="${iw}" height="${ih}" rx="${2 * sc}"/></clipPath>
    <g clip-path="url(#${cid})"><g transform="translate(${mx(0)},${my(0)}) scale(${inner})">${geoFlat(geo)}</g>
    <rect x="${mx(x0)}" y="${my(y0)}" width="${bw * inner}" height="${bh * inner}" fill="var(--seal)" fill-opacity="0.14" stroke="var(--seal)" stroke-width="${2.4 * sc}"/></g>
    ${curDot}
    <text x="${px + boxW / 2}" y="${gy + ih + 12 * sc}" text-anchor="middle" font-size="${11 * sc}" font-family="var(--serif)" font-weight="700" fill="var(--ink)">いま ここ</text>
  </g>`;
}

/* 似顔絵を 円に はめて 地図上に置く。clip-path 回避策はファイル冒頭のコメント参照。
   顔絵は 100×100 空間・可視域 viewBox[8 8 84 86] 相当（中心=50,51）を
   直径 d の円に cover 配置する。*/
export function faceSvg(
  pid: string,
  x: number,
  y: number,
  d: number,
  cid: string,
  faces: Work['faces'],
): string {
  const rr = d / 2,
    cx = x + rr,
    cy = y + rr,
    k = d / 84;
  const inner = faceArt(pid, faces)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');
  return `<g clip-path="url(#${cid})"><g transform="translate(${cx},${cy}) scale(${k}) translate(-50,-51)">${inner}</g></g>`;
}

export function personName(work: Work, id: string): string {
  return (work.cards[id] && work.cards[id].name) || work.peopleExtra[id] || '';
}

interface PlacedMarker extends Marker {
  x: number;
  y: number;
}

export function buildSceneMap(work: Work, chId: number, sceneId: string): string {
  const map = work.map;
  const geo = sceneGeo(work, sceneId);
  const [VW, VH] = geo.vb;
  const viewCh = chId;
  const def = map.sceneMaps[sceneId] || { markers: [{ at: map.chapterPoints[chId], cur: 1 }] };
  const mk = (def.markers || [])
    .map((m) => {
      const g = map.gaz[m.at];
      if (!g) return null;
      const { x, y } = gazXY(geo, g);
      return Object.assign({}, m, { x, y });
    })
    .filter(Boolean) as PlacedMarker[];
  const onmap = mk.filter((m) => !m.off),
    offmk = mk.filter((m) => m.off);

  // Territory up to this scene's chapter — faction color by phase, protagonist domains gold-bordered.
  // A scene-level `contested` list wins over everything: an invasion in progress must not be
  // painted as owned even though chapter-granularity territory already flipped (see SceneMapDef).
  const factionFill = activeFactionColor(map, viewCh);
  const contested = new Set((def.contested ?? []).map(String));
  const hset = new Set<string>();
  Object.keys(map.protagonistDomains).forEach((k) => {
    if (+k <= viewCh) map.protagonistDomains[k].forEach((id) => hset.add(String(id)));
  });
  const prefs = Object.entries(geo.pref)
    .map(([pid, o]) => {
      let fill;
      if (contested.has(pid)) {
        fill = 'var(--map-contested)';
      } else if (o.c) {
        fill = 'var(--map-ctx)';
      } else {
        fill = ownsAt(map, pid, viewCh) && factionFill ? factionFill : 'var(--map-land)';
      }
      // Matching stroke closes the hairline seams between independently-simplified province
      // rings, so borders never render as a sea-colored double-line (the base layer below fills
      // any wider gap with land anyway). Stroke is in user units — a fixed ~1.6px land edge.
      return `<path d="${o.d}" fill="${fill}" stroke="${fill}" stroke-width="1.6" stroke-linejoin="round"/>`;
    })
    .join('');

  const here = new Set(onmap.map((m) => m.at));
  // 進軍ルート
  const route =
    def.route && map.routes[def.route]
      ? `<path d="${map.routes[def.route].d}" class="sroute anim"/>`
      : '';

  // ---- 自動ズーム：マーカー群に合わせて表示範囲を決める ----
  let pts = onmap.map((m) => ({ x: m.x, y: m.y }));
  if (def.allDots) pts = pts.concat(map.mapPoints.map((p) => gazXY(geo, p)));
  let x0 = 0,
    y0 = 0,
    bw = VW,
    bh = VH;
  if (pts.length) {
    // ★F 顔を大きくした分、見切れないよう余白も広げる（顔・文字の画面上サイズはズーム非依存）。
    let minX = Math.min(...pts.map((p) => p.x)) - 92,
      maxX = Math.max(...pts.map((p) => p.x)) + 92;
    let minY = Math.min(...pts.map((p) => p.y)) - 150,
      maxY = Math.max(...pts.map((p) => p.y)) + 78; // 上に顔＋名前ぶんの余白
    bw = maxX - minX;
    bh = maxY - minY;
    const minW = geo.minFrameW ?? 392;
    if (bw < minW) {
      const c = (minX + maxX) / 2;
      minX = c - minW / 2;
      maxX = c + minW / 2;
      bw = minW;
    }
    const ratio = VW / VH;
    if (bw / bh < ratio) {
      const nb = bh * ratio;
      minX -= (nb - bw) / 2;
      bw = nb;
    } else {
      const nb = bw / ratio;
      minY -= (nb - bh) / 2;
      bh = nb;
    }
    x0 = minX;
    y0 = minY;

    // A clipped stage (an overseas asset baked from a bbox) has no coastline past its cut: a frame
    // that crosses one draws the cut as a dead-straight coast. The frame is derived from markers +
    // padding, so a marker near the corner of the bake (davinci ch7 = アンボワーズ) pushes it out
    // without anything else noticing. Slide it back inside the cut — shrinking, keeping the aspect,
    // only if the frame is larger than the bake itself.
    if (geo.bounds) {
      const [W, E, S, N] = geo.bounds;
      const [bx0, by0, bx1, by1] = [
        projX(geo.proj, W), projY(geo.proj, N), projX(geo.proj, E), projY(geo.proj, S),
      ];
      const k = Math.min(1, (bx1 - bx0) / bw, (by1 - by0) / bh);
      if (k < 1) {
        x0 += (bw - bw * k) / 2;
        y0 += (bh - bh * k) / 2;
        bw *= k;
        bh *= k;
      }
      x0 = Math.min(Math.max(x0, bx0), bx1 - bw);
      y0 = Math.min(Math.max(y0, by0), by1 - bh);
    }
  }
  const sc = bw / VW; // 表示スケール（画面上の見た目サイズをほぼ一定に保つ）
  const R = 34; // ★F 似顔絵の基準半径（実機で加齢・表情が読めるよう拡大。旧24）
  const NAME_FS = 18; // 顔の上の名前（pre-scale。行の間隔を名前幅から決めるので定数にする）

  // Base land silhouette (real coastlines, projected) under the province overlays, so Tohoku /
  // Hokkaido / Okinawa / Shikoku are land not sea, and province seams reveal land.
  //
  // It is drawn in the CONTEXT fill, with no outline of its own, because provinces are painted over
  // everything that matters and `.mland path` gives THEM the inked edge a coast is actually read by.
  // That reasoning needs provinces to exist. A silhouette-only geo (an overseas stage — there are no
  // 令制国 to overlay on California) has no such layer, so its base is the stage: it takes the land
  // fill and an inked coastline of its own. Without them the Pacific band's two shores sat within a
  // few percent of the sea's own value and unoutlined, and a child could only find Japan by its
  // label — on the one map whose whole subject is the shape of the water between two coasts.
  // Keyed on the geo's shape, never on a work.
  const bare = !Object.keys(geo.pref).length;
  const rings = geoBaseRings(geo);
  const baseFill = bare ? 'var(--map-land)' : 'var(--map-ctx)';
  const base =
    rings
      .map(
        (d) =>
          `<path d="${d}" fill="${baseFill}" stroke="${baseFill}" stroke-width="3" stroke-linejoin="round"/>`,
      )
      .join('') +
    // Scaled by sc so the coast holds one on-screen weight at any zoom, like every other mark here.
    (bare ? rings.map((d) => `<path class="mcoast" d="${d}" stroke-width="${1.6 * sc}"/>`).join('') : '');

  // Inland water over the land fill: what gives a silhouette-only stage something to read
  // (family play 2026-07-22「イタリアの地図は情報が無さすぎ」). Widths scale with sc like every
  // other mark, so a river holds one on-screen weight at any zoom.
  const wat = geoWater(geo);
  const water =
    wat.lakes.map((d) => `<path class="mlake" d="${d}" stroke-width="${1.2 * sc}"/>`).join('') +
    wat.rivers.map((d) => `<path class="mriver" d="${d}" stroke-width="${2.2 * sc}"/>`).join('');


  // 秀長 自身の 領国は「きみの 国」と はっきり 示す（塗りの上に 金のふちを 重ねる）。
  const domain = Object.entries(geo.pref)
    .filter(([pid]) => hset.has(pid))
    .map(
      ([, o]) =>
        `<path d="${o.d}" fill="none" stroke="var(--gold-deep)" stroke-width="${6 * sc}" stroke-linejoin="round"/>` +
        `<path d="${o.d}" fill="none" stroke="var(--gold)" stroke-width="${2.5 * sc}" stroke-linejoin="round"/>`,
    )
    .join('');

  // 旅の足あと（終章の回想）
  let dots = '';
  if (def.allDots) {
    const seq = map.mapPoints
      .slice()
      .sort((a, b) => a.n - b.n)
      .map((p) => Object.assign({}, p, gazXY(geo, p)));
    const jd = 'M' + seq.map((p) => `${p.x} ${p.y}`).join(' L');
    const stops = seq
      .map((p) =>
        here.has(p.id)
          ? ''
          : `<circle cx="${p.x}" cy="${p.y}" r="${9 * sc}" fill="var(--panel)" stroke="var(--seal)" stroke-width="${2 * sc}"/>` +
            `<text x="${p.x}" y="${p.y + 4 * sc}" text-anchor="middle" font-size="${12 * sc}" font-weight="700" font-family="var(--serif)" fill="var(--seal)">${p.n}</text>`,
      )
      .join('');
    dots = `<path d="${jd}" class="sjourney" pathLength="1" style="stroke-width:${5 * sc}"/>${stops}`;
  }
  const SHORT = work.shortNames;
  const you = work.protagonistId;

  // Ink box of every marker's icon, so a face disc can be kept off a NEIGHBOUR's icon. Two places
  // a morning's walk apart land a few pixels apart while the faces keep one on-screen size, and the
  // taller stack simply paints over the smaller mark (hidenaga 7-b: 郡山 の顔が 京都 の火を消す).
  const iconBoxes = onmap.map((m) => {
    const b = ICON_BOX[m.kind || 'person'] || ICON_BOX.person;
    return { x0: m.x + b[0] * sc, y0: m.y + b[1] * sc, x1: m.x + b[2] * sc, y1: m.y + b[3] * sc };
  });

  // ---- 地点マーカー：できごと（点）→ 登場人物の顔・名前（上）→ 地名・補足 ----
  const body = onmap
    .map((m, mi) => {
      const kind = m.kind || 'person';
      let s = `<g class="smk-icon" data-kind="${kind}" transform="translate(${m.x},${m.y}) scale(${sc})">`;
      if (m.cur) s += `<circle class="scur-ring" r="24"/>`;
      s += markIcon(kind, m.enemy) + `</g>`;
      // 登場人物の顔（アイコンの上に横並び。現在地には まず 主人公。名前は 顔の上）
      const faces: string[] = [];
      if (m.cur) faces.push(you);
      if (m.people) m.people.forEach((p) => faces.push(p));
      const names = faces.map((pid) => SHORT[pid] || personName(work, pid));
      const n = faces.length,
        fr = R * sc;
      // Row spacing is the disc pitch UNLESS the names need more: a name is centred over its own
      // face and is usually wider than the disc, so two long names (5 chars + 4 chars) at the disc
      // pitch paint over each other while the faces themselves sit clear (davinci 5-a, which the
      // author had to work around by dropping a face). Widen the row to what its widest adjacent
      // pair of names needs, so the engine avoids the collision instead of the author.
      const nameFs = NAME_FS * sc;
      let gap = (2 * R + 9) * sc;
      for (let i = 1; i < n; i++)
        gap = Math.max(gap, (textW(names[i - 1], nameFs) + textW(names[i], nameFs)) / 2 + 6 * sc);
      let facesTopY = m.y - 20 * sc; // 顔が無ければ アイコン上端
      // Slide the whole face row sideways by the least amount that frees the other markers' icons
      // (symbol displacement, like a label: the place stays put, the drawing of who is there moves).
      const rowY = (fi: number) => {
        const rr = fr * (faces[fi] === you && m.cur ? 1.12 : 1);
        return { rr, cy: m.y - 26 * sc - rr };
      };
      const clears = (dx: number) =>
        faces.every((_, fi) => {
          const { rr, cy } = rowY(fi);
          const cx = m.x + dx + (fi - (n - 1) / 2) * gap;
          if (cx - rr < x0 || cx + rr > x0 + bw) return false;
          return iconBoxes.every((b, bi) => {
            if (bi === mi) return true;
            const qx = Math.max(b.x0, Math.min(cx, b.x1)),
              qy = Math.max(b.y0, Math.min(cy, b.y1));
            return Math.hypot(cx - qx, cy - qy) >= rr + 3 * sc;
          });
        });
      let dodge = 0;
      if (n && !clears(0)) {
        for (let k = 1; k <= 48; k++) {
          const d = (k * gap) / 32; // up to 1.5 face slots aside, in steps a child cannot see
          if (clears(-d)) { dodge = -d; break; }
          if (clears(d)) { dodge = d; break; }
        }
      }
      faces.forEach((pid, fi) => {
        const isYou = pid === you && m.cur;
        const rr = fr * (isYou ? 1.12 : 1);
        const cx = m.x + dodge + (fi - (n - 1) / 2) * gap,
          cy = m.y - 26 * sc - rr;
        const cid = `fc-${sceneId}-${mi}-${fi}`;
        const nm = names[fi];
        // カードが ある人物は タップで「人物カード」を開ける
        const tap = work.cards[pid]
          ? ` class="mapface" data-pid="${pid}" role="button" tabindex="0" aria-label="${esc(personName(work, pid) || nm || '人物')}の カードを ひらく"`
          : '';
        // 顔の見た目キーを解決（名前・カードは pid のまま）：
        //   ★B 山場のシーン別"感情"上書き ＞ ★A 主人公の章別"加齢" ＞ 既定の pid。
        const faceKey =
          work.sceneFaceOverrides?.[sceneId]?.[pid] ||
          (isYou ? work.protagonistFacesByChapter?.[chId] || pid : pid);
        let fg =
          `<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${rr - 1.4 * sc}"/></clipPath>` +
          `<circle class="smk-face" cx="${cx}" cy="${cy}" r="${rr}" fill="var(--panel)" stroke="${isYou ? 'var(--gold)' : '#fff'}" stroke-width="${(isYou ? 3.2 : 2.2) * sc}"/>` +
          faceSvg(faceKey, cx - rr, cy - rr, rr * 2, cid, work.faces);
        if (nm)
          fg += `<text class="smk-name${isYou ? ' you' : ''}" x="${cx}" y="${cy - rr - 5 * sc}" text-anchor="middle" font-size="${nameFs}" stroke-width="${3.2 * sc}">${esc(nm)}</text>`;
        s += `<g${tap}>${fg}</g>`;
        facesTopY = Math.min(facesTopY, cy - rr - (nm ? 23 * sc : 2 * sc));
      });
      // 地名・補足：既定は アイコンの下、lpos:'above' なら顔の上、'left'/'right' なら横へ逃がす。
      // 横逃がしは、近い2地点（中村と清洲城、賤ヶ岳と大垣）が縦のラベルの列を共有してしまうとき
      // の受け皿——どちらの名前がどちらの点かを読者が復元できる。
      if (m.lpos === 'left' || m.lpos === 'right') {
        const dir = m.lpos === 'left' ? -1 : 1;
        const lx = m.x + dir * 26 * sc;
        const anchor = m.lpos === 'left' ? 'end' : 'start';
        const ly = m.y + 4 * sc;
        if (m.label) {
          s += `<text class="smk-lb" x="${lx}" y="${ly}" text-anchor="${anchor}" font-size="${26 * sc}" stroke-width="${5 * sc}">${esc(m.label)}</text>`;
        }
        if (m.note) {
          s += `<text class="smk-note" x="${lx}" y="${ly + 21 * sc}" text-anchor="${anchor}" font-size="${19.5 * sc}" stroke-width="${4 * sc}">${esc(m.note)}</text>`;
        }
      } else if (m.lpos === 'above') {
        let ly = facesTopY - 6 * sc;
        if (m.note) {
          s += `<text class="smk-note" x="${m.x}" y="${ly}" text-anchor="middle" font-size="${19.5 * sc}" stroke-width="${4 * sc}">${esc(m.note)}</text>`;
          ly -= 21 * sc;
        }
        if (m.label) {
          s += `<text class="smk-lb" x="${m.x}" y="${ly}" text-anchor="middle" font-size="${26 * sc}" stroke-width="${5 * sc}">${esc(m.label)}</text>`;
        }
      } else {
        let ly = m.y;
        if (m.label) {
          s += `<text class="smk-lb" x="${m.x}" y="${m.y + 24 * sc}" text-anchor="middle" font-size="${26 * sc}" stroke-width="${5 * sc}">${esc(m.label)}</text>`;
          ly = m.y + 24 * sc;
        }
        if (m.note) {
          s += `<text class="smk-note" x="${m.x}" y="${ly + 21 * sc}" text-anchor="middle" font-size="${19.5 * sc}" stroke-width="${4 * sc}">${esc(m.note)}</text>`;
        }
      }
      return s;
    })
    .join('');

  // ---- Off-map destinations (小田原 to the east, 宋 / Song to the southwest, …) are shown as an
  //      arrow on the frame edge that points toward the real, out-of-view location. Direction and
  //      edge come from the marker's true gaz coordinate relative to the view center, so a place
  //      past the west of Kyushu points southwest rather than always east. ----
  const cxv = x0 + bw / 2,
    cyv = y0 + bh / 2;
  const offPts: { x: number; y: number }[] = [];
  const offs = offmk
    .map((m) => {
      let dx = m.x - cxv,
        dy = m.y - cyv;
      if (!dx && !dy) dx = 1; // degenerate (marker at the center): default to east
      const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
      // Where the ray from the center leaves the frame, inset so the arrowhead stays visible.
      const mgn = 40 * sc;
      const t = Math.min((bw / 2 - mgn) / Math.abs(dx || 1e-6), (bh / 2 - mgn) / Math.abs(dy || 1e-6));
      const ex = cxv + dx * t,
        ey = cyv + dy * t;
      offPts.push({ x: ex, y: ey });
      let s = `<g transform="translate(${ex},${ey}) rotate(${ang.toFixed(1)}) scale(${sc})"><path d="M-4 -13 L20 0 L-4 13 L3 0 Z" fill="var(--seal)"/></g>`;
      // Label + note go on the vertical side of the arrow facing the view center (below the
      // arrow when it sits in the top half, above otherwise), centered on the arrow and clamped
      // into the frame by their own text width. Pulling the text inward along the ray (old
      // behavior, fixed 30*sc) let wide labels paint their stroke outline over the arrowhead —
      // text is drawn after the arrow (raster self-check finding). The vertical side is always
      // safe because the arrow points away from it. Half-widths follow the font sizes below
      // (24*sc label / 19*sc note, full-width glyphs).
      const halfW = Math.max((m.label?.length ?? 0) * 12, (m.note?.length ?? 0) * 9.5) * sc;
      const lx = Math.max(x0 + halfW + 8 * sc, Math.min(x0 + bw - halfW - 8 * sc, ex));
      const ly = ey < cyv ? ey + 40 * sc : ey - 40 * sc - (m.note ? 21 * sc : 0);
      if (m.label)
        s += `<text class="smk-lb" x="${lx}" y="${ly}" text-anchor="middle" font-size="${24 * sc}" stroke-width="${4.4 * sc}">${esc(m.label)}</text>`;
      if (m.note)
        s += `<text class="smk-note" x="${lx}" y="${ly + 21 * sc}" text-anchor="middle" font-size="${19 * sc}" stroke-width="${4 * sc}">${esc(m.note)}</text>`;
      return s;
    })
    .join('');

  const locator = buildLocator(work, geo, x0, y0, bw, bh, sc, onmap, offPts);
  return `<svg class="scene-map" viewBox="${x0} ${y0} ${bw} ${bh}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="いまの 場所・登場人物・できごとの 地図">
    <rect class="msea" x="${x0 - 40}" y="${y0 - 40}" width="${bw + 80}" height="${bh + 80}"/>
    <g class="mland-base">${base}</g><g class="mland">${prefs}</g><g class="mwater">${water}</g>${domain}${route}${dots}${body}${offs}${locator}</svg>`;
}
