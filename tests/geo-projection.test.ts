// Mechanical generalization gate for the map projection (engine/map/project.ts). The engine keeps
// land geometry in real [lon,lat] and projects at render via Geo.proj, which is what lets the SAME
// path draw an overseas landmass (src/shared/geoWorld.ts) as it does Japan. This asserts the
// overseas proof asset projects to finite, in-viewBox pixels — i.e. the projection is not
// Japan-specific — and that Japan still projects sanely (no regression). Phase 2 of the map-engine
// generalization (observation memo 2026-07-14: overseas support).
import { describe, it, expect } from 'vitest';
import { GEO_US_WEST, GEO_PACIFIC, GEO_EUROPE } from '../src/shared/geoWorld';
import { GEO } from '../src/shared/geoJapan';
import { geoBaseRings, geoWater, projX, projY } from '../src/engine/map/project';
import { buildSceneMap, sceneGeo } from '../src/engine/map/sceneMap';
import { WORKS } from '../src/works/index';
import type { Geo } from '../src/engine/types';

function coords(geo: Geo): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (const ring of geo.land ?? []) {
    for (let i = 0; i < ring.length; i += 2) {
      out.push({ x: projX(geo.proj, ring[i]), y: projY(geo.proj, ring[i + 1]) });
    }
  }
  return out;
}

describe('geo projection generalizes to overseas', () => {
  it('US west coast projects to finite, in-viewBox pixels (variable projection)', () => {
    const [w, h] = GEO_US_WEST.vb;
    const pts = coords(GEO_US_WEST);
    expect(pts.length).toBeGreaterThan(30); // real coastline, not a stub
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      // Small epsilon: clipped bbox-edge points land exactly on 0 / vb.
      expect(p.x).toBeGreaterThanOrEqual(-0.5);
      expect(p.x).toBeLessThanOrEqual(w + 0.5);
      expect(p.y).toBeGreaterThanOrEqual(-0.5);
      expect(p.y).toBeLessThanOrEqual(h + 0.5);
    }
    // k = cos(centerLat) is the whole point of "variable projection": it must differ from Japan's.
    expect(GEO_US_WEST.proj.k).toBeCloseTo(Math.cos((37.5 * Math.PI) / 180), 2);
    expect(GEO_US_WEST.proj.k).not.toBeCloseTo(GEO.proj.k, 2);
  });

  it('US west coast renders one land ring via the shared engine path', () => {
    const rings = geoBaseRings(GEO_US_WEST);
    expect(rings.length).toBe(1);
    expect(rings[0]).toMatch(/^M-?\d/); // an SVG path starting with a moveto
    expect(rings[0]).not.toMatch(/NaN/);
  });

  it('Europe projects to finite, in-viewBox pixels (variable projection)', () => {
    const [w, h] = GEO_EUROPE.vb;
    const pts = coords(GEO_EUROPE);
    expect(pts.length).toBeGreaterThan(30); // real coastline, not a stub
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
      // Small epsilon: clipped bbox-edge points land exactly on 0 / vb.
      expect(p.x).toBeGreaterThanOrEqual(-0.5);
      expect(p.x).toBeLessThanOrEqual(w + 0.5);
      expect(p.y).toBeGreaterThanOrEqual(-0.5);
      expect(p.y).toBeLessThanOrEqual(h + 0.5);
    }
    // Same "variable projection" contract as US-west: k = cos(centerLat=44.5°), ≠ Japan's.
    expect(GEO_EUROPE.proj.k).toBeCloseTo(Math.cos((44.5 * Math.PI) / 180), 2);
    expect(GEO_EUROPE.proj.k).not.toBeCloseTo(GEO.proj.k, 2);
  });

  it('Japan still projects sanely (no regression)', () => {
    const pts = coords(GEO);
    expect(pts.length).toBeGreaterThan(100);
    for (const p of pts) {
      expect(Number.isFinite(p.x)).toBe(true);
      expect(Number.isFinite(p.y)).toBe(true);
    }
  });
});

describe('Europe (davinci の舞台)', () => {
  // Same generation-drift guard as the Pacific band: a byte/ring count would pass even if
  // Douglas-Peucker collapsed the mainland (davinci's whole stage) to nothing. Only asking whether
  // Leonardo's inland courts sit on actual land, and the seas between them stay sea, catches it.
  it('レオナルドの宮廷が陸、地中海は海のまま（生成の取りこぼしを捕まえる）', () => {
    expect(onLand(GEO_EUROPE, 9.19, 45.46), 'ミラノ（内陸ロンバルディア）が陸でない').toBe(true);
    expect(onLand(GEO_EUROPE, 11.25, 43.77), 'フィレンツェ（トスカーナ内陸）が陸でない').toBe(true);
    expect(onLand(GEO_EUROPE, 12.5, 41.9), 'ローマ（テヴェレ川沿い）が陸でない').toBe(true);
    expect(onLand(GEO_EUROPE, 0.98, 47.41), 'アンボワーズ（アルプスの北西）が陸でない').toBe(true);
    expect(onLand(GEO_EUROPE, 11.5, 41.0), 'ティレニア海のまん中が陸になっている').toBe(false);
  });

  it('欧州は wrap しない投影（半球内・lonmin より西を負の x に置く）', () => {
    // Europe stays inside one hemisphere (unlike the Pacific band): no antimeridian wrap.
    expect(GEO_EUROPE.proj.wrap).toBeFalsy();
    expect(projX(GEO_EUROPE.proj, -1.5)).toBeLessThan(0); // west of lonmin=-1 → negative x
  });
});

/**
 * Is [lon,lat] inside any land ring of this geo? Ray casting on the raw [lon,lat] rings (planar in
 * degrees — fine for a coarse "ocean or continent" question). Rings are stored open; the wrap-around
 * segment closes them, exactly as projRing's trailing Z does.
 */
function onLand(geo: Geo, lon: number, lat: number): boolean {
  for (const ring of geo.land ?? []) {
    let hit = false;
    const n = ring.length / 2;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = ring[i * 2], yi = ring[i * 2 + 1], xj = ring[j * 2], yj = ring[j * 2 + 1];
      if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
    }
    if (hit) return true;
  }
  return false;
}

describe('the Pacific band (katsu ch3 の舞台)', () => {
  // The band is generated, so its content is only as good as the builder — and the builder silently
  // deleted every landmass that lay WHOLLY inside the bbox (Douglas-Peucker collapses a closed ring:
  // its first and last point coincide, so the chord it measures against has zero length and nothing
  // survives). The first overseas build clipped every ring, so nothing was closed and it looked fine;
  // this band lost all of Japan to it. A byte-count or ring-count check would have passed. Only asking
  // whether the actual places are on actual land catches it.
  it('日本と北米が陸として実在し、太平洋は海のまま（生成の取りこぼしを捕まえる）', () => {
    expect(onLand(GEO_PACIFIC, 138.0, 36.2), '本州の内陸（信濃あたり）が陸でない').toBe(true);
    expect(onLand(GEO_PACIFIC, 240.0, 40.0), '北米の内陸（-120°E 付近）が陸でない').toBe(true);
    expect(onLand(GEO_PACIFIC, 185.0, 36.7), '太平洋のまん中が陸になっている').toBe(false);
  });

  it('日付変更線をまたぐ投影: 実座標のサンフランシスコが海のむこう側に落ちる', () => {
    // proj.wrap is the whole reason gaz can keep San Francisco as its REAL -122.42 (see Geo.proj.wrap).
    const sfx = projX(GEO_PACIFIC.proj, -122.4194);
    const shinagawa = projX(GEO_PACIFIC.proj, 139.7395);
    expect(sfx).toBeGreaterThan(shinagawa); // east of Japan, not 24,000 units west of it
    expect(sfx).toBeLessThan(GEO_PACIFIC.vb[0]); // and inside the band, not past its far edge
    expect(sfx).toBeCloseTo(projX(GEO_PACIFIC.proj, 237.5806), 3); // unwrapped and real agree
  });

  it('wrap の無い投影は lonmin より西の地点を負の x に置く（沖縄を東へ飛ばさない）', () => {
    // The rule that must NOT become global: Japan's geo needs Okinawa (127.6°E) west of its
    // lonmin (128.6°E). Normalizing every lon into [lonmin, lonmin+360) would fling it a turn east.
    expect(GEO.proj.wrap).toBeFalsy();
    expect(projX(GEO.proj, 127.6)).toBeLessThan(0);
  });
});

describe('内陸の水（川・湖）＝シルエットだけの舞台に読むものを与える層', () => {
  // 家族の実プレイ 2026-07-22:「イタリアの地図は情報が無さすぎ。のぺっとした陸地と海しか見えない」。
  // 日本は令制国の overlay が手ざわりを出すが、海外の舞台には塗る州が無い（当時の国境は毎年動く＝
  // WRITING 地図書法2 で描けない）。水は政治的な主張をせず、作品の年代スケールで動かない。
  it('欧州の川・湖が焼き込み bbox の内側に落ちる（stray な座標を持たない）', () => {
    const [W, E, S, N] = GEO_EUROPE.bounds!;
    for (const ring of [...(GEO_EUROPE.rivers ?? []), ...(GEO_EUROPE.lakes ?? [])]) {
      expect(ring.length % 2, '[lon,lat] の平坦配列').toBe(0);
      for (let i = 0; i < ring.length; i += 2) {
        expect(ring[i] >= W && ring[i] <= E, `lon=${ring[i]} が bbox 外`).toBe(true);
        expect(ring[i + 1] >= S && ring[i + 1] <= N, `lat=${ring[i + 1]} が bbox 外`).toBe(true);
      }
    }
  });

  it('川は開いた線・湖は閉じた環として描かれる（川を閉じると架空の岸が生える）', () => {
    const w = geoWater(GEO_EUROPE);
    expect(w.rivers.length, '川が1本も無い').toBeGreaterThan(0);
    expect(w.lakes.length, '湖が1つも無い').toBeGreaterThan(0);
    for (const d of w.rivers) expect(d.endsWith('Z'), '川が閉じている').toBe(false);
    for (const d of w.lakes) expect(d.endsWith('Z'), '湖が閉じていない').toBe(true);
  });

  it('davinci のシーン地図に水の層が乗る（描かれずに黙って消えない）', () => {
    const work = WORKS.find((w) => w.id === 'davinci')!;
    const svg = buildSceneMap(work, 3, '3-a');
    expect(svg).toContain('class="mriver"');
    expect(svg).toContain('class="mlake"');
  });

  it('シルエットだけの舞台は minFrameW より狭く寄らない（のぺっとした陸だけの画面を作らない）', () => {
    const work = WORKS.find((w) => w.id === 'davinci')!;
    const min = GEO_EUROPE.minFrameW!;
    for (const ch of work.story.chapters) {
      for (const sid of Object.keys(ch.scenes)) {
        const bw = Number(
          /viewBox="[-\d.]+ [-\d.]+ ([-\d.]+) [-\d.]+"/.exec(buildSceneMap(work, ch.id, sid))![1],
        );
        expect(bw, `${sid} の枠が狭すぎる`).toBeGreaterThanOrEqual(min - 0.5);
      }
    }
  });
});

describe('切り取った舞台は、どの視野よりも広く焼かれている', () => {
  // Along a clipped geo's bounds the rings are not coastline — they are the cut, and a frame that
  // crosses one draws a dead-straight coast through the picture. (Japan declares no bounds: its rings
  // are the real thing the whole way round, so a frame may run off into open sea harmlessly.)
  //
  // The frame is DERIVED — markers, +92/-150 padding, then grown to the vb aspect — so it moves
  // whenever a marker is added or moved, or the vb is retuned, none of which looks like a change to
  // the coastline. Nothing else would notice: the map still renders, still has every marker, and the
  // straight edge is only visible to an eye on the picture.
  //
  // NB the subject is the CUT, not the land's own extent: the Pacific band's southernmost land sits
  // 10 units north of its bounds because that is where Baja California really ends, and the open sea
  // below it is honest. An earlier draft of this gate measured the land bbox and failed on that.
  it('切り取った舞台を使うシーンの表示枠が、切り取り範囲の内側にある', () => {
    const out: string[] = [];
    let checked = 0;
    for (const work of WORKS) {
      for (const chapter of work.story.chapters) {
        for (const sid of Object.keys(chapter.scenes)) {
          const geo = sceneGeo(work, sid);
          if (!geo.bounds) continue;
          const [W, E, S, N] = geo.bounds;
          const [bx0, by0, bx1, by1] = [
            projX(geo.proj, W),
            projY(geo.proj, N),
            projX(geo.proj, E),
            projY(geo.proj, S),
          ];
          const [x0, y0, bw, bh] = /viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/
            .exec(buildSceneMap(work, chapter.id, sid))!
            .slice(1)
            .map(Number);
          checked++;
          if (x0 < bx0 || y0 < by0 || x0 + bw > bx1 || y0 + bh > by1) {
            out.push(
              `${work.id} ${sid}: 枠[${x0.toFixed(0)},${y0.toFixed(0)},${(x0 + bw).toFixed(0)},${(y0 + bh).toFixed(0)}]` +
                ` ⊄ 切り取り[${bx0.toFixed(0)},${by0.toFixed(0)},${bx1.toFixed(0)},${by1.toFixed(0)}]`,
            );
          }
        }
      }
    }
    expect(out, '切り取りの端が画面に入る（まっすぐな海岸線として描かれる）シーン').toEqual([]);
    expect(checked, '切り取った舞台のシーンが1つも無い＝この検査は空振りしている').toBeGreaterThan(0);
  });
});
