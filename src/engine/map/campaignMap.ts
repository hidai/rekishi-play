// 手帳「進軍の地図」の領土アニメ（旧 renderMap/setMapView/showRoute/renderMapLegend）。
// SVG の骨格は純粋関数で生成し、塗り替え・ルート（getTotalLength 依存）・凡例は
// マウント後に命令的に適用する（CampaignMap.svelte の $effect から呼ぶ）。
// The engine holds no route/faction proper nouns — routes, faction colors and
// legend text all come from WorkMap (campaignRoutes / factionPhases).
import type { Geo, MapPoint, Work } from '../types';
import type { WorkSave } from '../save.svelte';
import { esc } from '../util';
import { heroName } from '../hero';
import { activeFactionColor, ownsAt } from './territory';
import { geoBaseRings, emptyBBox, growBBox, growPoint, gazXY } from './project';

/**
 * Content-fit viewBox for the campaign map, replacing the legacy fixed geo.vb window. Frames the
 * geo's *active stage* — its non-context (`!o.c`) provinces, i.e. the colored region of interest,
 * distinct from the greyed context backdrop — plus this work's own marks and routes in case they
 * reach past the stage. So the frame is driven by the geo asset's ctx/non-ctx split (the Japan GEO's
 * stage is western/central Japan; a work needing a different stage ships its own geo), not a hardcoded
 * pixel window that clipped mid-province in the east. Context provinces and the base coastline extend
 * past the frame and are clipped by the viewBox, so the rest of Japan reads as land running off the
 * edge (honest coastline) rather than a hard province cut. Padding keeps roughly the legacy on-screen
 * scale so labels stay legible. A silhouette-only geo with no provinces (e.g. an overseas GEO whose
 * `pref` is empty) has no stage to frame, so we fall back to its declared geo.vb.
 */
export function campaignViewBox(work: Work): [number, number, number, number] {
  const map = work.map;
  const geo = map.geo;
  const b = emptyBBox();
  for (const o of Object.values(geo.pref)) if (!o.c) growBBox(o.d, b);
  for (const p of map.mapPoints) {
    const { x, y } = gazXY(geo, p);
    growPoint(b, x, y);
  }
  for (const r of map.campaignRoutes) growBBox(map.routes[r.key].d, b);
  if (!isFinite(b.x0)) return [0, 0, geo.vb[0], geo.vb[1]];
  const padX = 62,
    padTop = 62, // room for mark labels sitting above their dots
    padBottom = 48;
  return [b.x0 - padX, b.y0 - padTop, b.x1 - b.x0 + 2 * padX, b.y1 - b.y0 + padTop + padBottom];
}

/** A footprint's position as an SVG `translate()` argument (lon/lat projected, or legacy px). */
function xy(geo: Geo, p: MapPoint): string {
  const { x, y } = gazXY(geo, p);
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}

/** A footprint's own name, placed by its `lpos`. Shared by the live map and the static twin. */
function markLabel(p: MapPoint): string {
  const at =
    p.lpos === 'below'
      ? 'y="33" text-anchor="middle"'
      : p.lpos === 'left'
        ? 'x="-20" y="6" text-anchor="end"'
        : p.lpos === 'right'
          ? 'x="20" y="6" text-anchor="start"'
          : 'y="-19" text-anchor="middle"';
  return `<text class="mk-lb" ${at}>${p.label}</text>`;
}

/** Base national land silhouette (real coastlines, projected) as one `<g class="mland-base">`. */
function campaignBase(work: Work): string {
  const base = geoBaseRings(work.map.geo)
    .map(
      (d) =>
        `<path d="${d}" fill="var(--map-ctx)" stroke="var(--map-ctx)" stroke-width="3" stroke-linejoin="round"></path>`,
    )
    .join('');
  return `<g class="mland-base">${base}</g>`;
}

/** クリア済み章の最大値（旧 mapMaxCh）。 */
export function mapMaxCh(active: WorkSave | null): number {
  const done = active
    ? Object.keys(active.progress)
        .filter((k) => active.progress[k] === 'done')
        .map(Number)
    : [];
  return done.length ? Math.max(...done) : 0;
}

/** One colour key of the campaign legend: what a colour on the map means. */
export interface LegendKey {
  color: string;
  /** ruby HTML allowed (work data) — the static twin strips it to plain text. */
  label: string;
  kind: 'area' | 'domain' | 'route';
}

/**
 * The colour keys of the legend at view chapter `vc`. Shared by the live HTML pane and the
 * static twin so the raster self-check reads the same list the reader sees (note 2026-07-23).
 */
export function campaignLegendKeys(work: Work, vc: number): LegendKey[] {
  const map = work.map;
  if (vc < 1) return [];
  const keys: LegendKey[] = [];
  for (const ph of map.factionPhases) if (ph.fromCh <= vc) keys.push({ color: ph.color, label: ph.legend, kind: 'area' });
  // The gold-bordered 領国 line only if this work actually gold-borders something: a work whose map
  // is footprints-only (ieyasu) would otherwise print a key for a color the map never draws.
  if (Object.keys(map.protagonistDomains).length) {
    keys.push({ color: 'var(--gold)', label: `${esc(heroName(work))} 自身の 領国`, kind: 'domain' });
  }
  for (const r of map.campaignRoutes) {
    if (r.legend && vc >= r.revealCh) keys.push({ color: r.color, label: r.legend, kind: 'route' });
  }
  return keys;
}

/** Legend HTML for the campaign map at view chapter `vc` (pure — testable). */
export function campaignLegendHtml(work: Work, vc: number): string {
  const map = work.map;
  if (vc < 1) {
    return `<p class="muted">章を すすめると、${esc(heroName(work))}の 足あとと 領土が、この 地図に ひろがっていく。</p>`;
  }
  let html = '';
  for (const k of campaignLegendKeys(work, vc)) {
    const sw =
      k.kind === 'domain'
        ? `background:transparent;border:2.4px solid ${k.color}`
        : k.kind === 'route'
          ? `background:${k.color};height:4px;border-radius:2px;margin-top:8px`
          : `background:${k.color}`;
    html += `<div class="li"><span class="sw" style="${sw}"></span><span>${k.label}</span></div>`;
  }
  html += '<hr class="rule" style="margin:12px 0">';
  const pts = map.mapPoints.filter((p) => p.ch <= vc);
  html += pts.length
    ? pts
        .map(
          (p) => `<div class="li"><span class="sw num">${p.n}</span><span><b>${p.label}</b> — ${p.sub}</span></div>`,
        )
        .join('')
    : '<p class="muted">章を すすめると、足あとが 記されていく。</p>';
  return html;
}

/** 静的な地図 SVG（旧 renderMap の svg 部）。塗り/表示は applyMapView が切り替える。 */
export function campaignSvg(work: Work): string {
  const geo = work.map.geo;
  const [X, Y, W, H] = campaignViewBox(work);
  const prefPaths = Object.entries(geo.pref)
    .map(
      ([pid, o]) =>
        `<path id="pf-${pid}" class="pf${o.c ? ' ctx' : ''}" d="${o.d}"></path>`,
    )
    .join('');
  const labels = Object.entries(work.map.mapLabels)
    .map(([pid, nm]) => {
      const o = geo.pref[pid];
      if (!o) return '';
      return `<text class="mplabel" x="${o.x}" y="${o.y}" text-anchor="middle">${nm}</text>`;
    })
    .join('');
  const routePaths = work.map.campaignRoutes
    .map((r) => `<path id="rt-${r.key}" class="mroute" d="${work.map.routes[r.key].d}"></path>`)
    .join('');
  // One shared animated runner + label, driven along whichever route sets runnerLabel.
  const runner = work.map.campaignRoutes.some((r) => r.runnerLabel)
    ? `<g id="rt-runner" class="mrunner"><circle r="9"></circle></g>
    <text id="rt-lb" class="rlabel" text-anchor="middle"></text>`
    : '';
  const marks = work.map.mapPoints
    .map(
      (p) => `<g id="mk-${p.id}" class="mmark" data-ch="${p.ch}" transform="translate(${xy(geo, p)})">
      ${markLabel(p)}
      <circle class="mk-dot" r="14"></circle>
      <text class="mk-n" y="5" text-anchor="middle">${p.n}</text></g>`,
    )
    .join('');
  return `<svg class="map-svg" viewBox="${X} ${Y} ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(heroName(work))}の 進軍と 領土の 地図">
    <rect class="msea" x="${X - 40}" y="${Y - 40}" width="${W + 80}" height="${H + 80}"></rect>
    ${campaignBase(work)}
    <g class="mland">${prefPaths}</g>
    ${labels}
    ${routePaths}
    ${runner}
    ${marks}
  </svg>`;
}

/**
 * Static, rasterizable twin of `campaignSvg` + `applyMapView`: the live app paints
 * province fills / route reveals / mark visibility imperatively from the DOM (see
 * applyMapView, which needs getTotalLength & rAF and so only runs in a browser), which
 * left the campaign map — a surface every work ships — with no dev-loop raster self-check.
 * This bakes the same decisions inline at view chapter `vc` (default: everything revealed),
 * so scripts/render-campaign.ts can rasterize it exactly as sceneMap already does. The live
 * path is untouched; this is dev tooling only. Province/mark/route fill rules mirror applyMapView
 * verbatim (incl. ctx provinces never taking the domain border). The one thing not baked is the
 * shared runner dot + route-end label, which applyMapView positions via getPointAtLength — a
 * browser-only measurement — so that decorative overlay stays outside this static self-check.
 *
 * The colour keys of the legend ARE baked, below the frame: without them a raster shows that a
 * colour moved but not whose it is — a blind reader of the ch4→ch5 pair read 徳川's provinces as
 * 武田's (note 2026-07-23(9)). Only the colour keys; the numbered footprint list is left out
 * because every mark already carries its label on the map itself.
 */
export function campaignStaticSvg(work: Work, vc = 99): string {
  const map = work.map;
  const geo = map.geo;
  const [X, Y, W, H] = campaignViewBox(work);
  const fill = activeFactionColor(map, vc);
  const hset = new Set<string>();
  Object.keys(map.protagonistDomains).forEach((k) => {
    if (+k <= vc) map.protagonistDomains[k].forEach((id) => hset.add(String(id)));
  });
  const prefPaths = Object.entries(geo.pref)
    .map(([pid, o]) => {
      let f: string;
      if (o.c) {
        f = 'var(--map-ctx)';
      } else {
        f = ownsAt(map, pid, vc) && fill ? fill : 'var(--map-land)';
      }
      // ctx provinces early-return in applyMapView before the domain toggle, so they never take
      // the gold border even if listed in a domain — mirror that (guard on !o.c).
      const dom = !o.c && hset.has(pid) ? ' domain' : '';
      return `<path class="pf${o.c ? ' ctx' : ''}${dom}" style="fill:${f}" d="${o.d}"></path>`;
    })
    .join('');
  const labels = Object.entries(map.mapLabels)
    .map(([pid, nm]) => {
      const o = geo.pref[pid];
      return o ? `<text class="mplabel" x="${o.x}" y="${o.y}" text-anchor="middle">${nm}</text>` : '';
    })
    .join('');
  // Routes revealed by their revealCh, drawn fully (no dash animation in a static image).
  const routePaths = map.campaignRoutes
    .filter((r) => vc >= r.revealCh)
    .map(
      (r) =>
        `<path class="mroute" style="opacity:1;stroke:${r.color}" d="${map.routes[r.key].d}"></path>`,
    )
    .join('');
  const marks = map.mapPoints
    .filter((p) => p.ch <= vc)
    .map(
      (p) => `<g class="mmark show" transform="translate(${xy(geo, p)})">
      ${markLabel(p)}
      <circle class="mk-dot" r="14"></circle>
      <text class="mk-n" y="5" text-anchor="middle">${p.n}</text></g>`,
    )
    .join('');
  const keys = campaignLegendKeys(work, vc);
  const band = staticLegendBand(keys, X, Y + H, W);
  return `<svg class="map-svg" viewBox="${X} ${Y} ${W} ${H + band.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(heroName(work))}の 進軍と 領土の 地図">
    <rect class="msea" x="${X - 40}" y="${Y - 40}" width="${W + 80}" height="${H + 40}"></rect>
    ${campaignBase(work)}
    <g class="mland">${prefPaths}</g>
    ${labels}
    ${routePaths}
    ${marks}
    ${band.svg}
  </svg>`;
}

/** Plain text of a legend label: ruby readings dropped, then all tags stripped (SVG has no ruby). */
const legendText = (s: string) => s.replace(/<rt>[^<]*<\/rt>/g, '').replace(/<[^>]+>/g, '');

/** The baked legend band drawn under the map frame (static twin only). */
function staticLegendBand(keys: LegendKey[], x: number, top: number, w: number): { h: number; svg: string } {
  if (!keys.length) return { h: 0, svg: '' };
  const fs = 17,
    rowH = 26,
    padTop = 16,
    padBottom = 14,
    sw = 20;
  const h = padTop + keys.length * rowH + padBottom;
  const rows = keys.map((k, i) => {
    const cy = top + padTop + i * rowH + rowH / 2;
    const chip =
      k.kind === 'route'
        ? `<rect x="${x + 26}" y="${(cy - 2.5).toFixed(1)}" width="${sw}" height="5" rx="2.5" fill="${k.color}"></rect>`
        : k.kind === 'domain'
          ? `<rect x="${x + 26}" y="${(cy - sw / 2).toFixed(1)}" width="${sw}" height="${sw}" rx="4" fill="none" stroke="${k.color}" stroke-width="3"></rect>`
          : `<rect x="${x + 26}" y="${(cy - sw / 2).toFixed(1)}" width="${sw}" height="${sw}" rx="4" fill="${k.color}" stroke="color-mix(in srgb,var(--sumi) 30%,transparent)"></rect>`;
    return `${chip}<text x="${x + 26 + sw + 10}" y="${(cy + fs * 0.36).toFixed(1)}" font-family="var(--serif)" font-size="${fs}" font-weight="700" fill="var(--ink)">${esc(legendText(k.label))}</text>`;
  });
  return {
    h,
    svg: `<g class="map-legend-band"><rect x="${x}" y="${top}" width="${w}" height="${h}" fill="var(--panel)"></rect>
    <line x1="${x + 20}" y1="${top + 1}" x2="${x + w - 20}" y2="${top + 1}" stroke="var(--line)" stroke-width="1.4"></line>
    ${rows.join('')}</g>`,
  };
}

function showRoute(
  path: SVGPathElement | null,
  on: boolean,
  animate: boolean,
  color: string,
): void {
  if (!path) return;
  path.style.stroke = color;
  if (!on) {
    path.style.opacity = '0';
    return;
  }
  const len = path.getTotalLength();
  path.style.strokeDasharray = String(len);
  if (animate) {
    path.style.transition = 'none';
    path.style.strokeDashoffset = String(len);
    path.style.opacity = '1';
    requestAnimationFrame(() => {
      path.style.transition = 'stroke-dashoffset 1s ease';
      path.style.strokeDashoffset = '0';
    });
  } else {
    path.style.transition = 'none';
    path.style.strokeDashoffset = '0';
    path.style.opacity = '1';
  }
}

function renderMapLegend(root: HTMLElement, work: Work, vc: number): void {
  const leg = root.querySelector<HTMLElement>('.map-legend');
  if (leg) leg.innerHTML = campaignLegendHtml(work, vc);
}

/** 指定章までの領土・ルート・凡例・キャプションを地図へ適用（旧 setMapView）。root=手帳ペイン。 */
export function applyMapView(root: HTMLElement, work: Work, vc: number, animate: boolean): void {
  const svg = root.querySelector<SVGSVGElement>('.map-svg');
  if (!svg) return;
  const fill = activeFactionColor(work.map, vc);
  const hset = new Set<string>();
  Object.keys(work.map.protagonistDomains).forEach((k) => {
    if (+k <= vc) work.map.protagonistDomains[k].forEach((id) => hset.add(String(id)));
  });
  svg.querySelectorAll<SVGPathElement>('.pf').forEach((p) => {
    const pid = p.id.slice(3);
    if (p.classList.contains('ctx')) {
      p.style.fill = 'var(--map-ctx)';
      return;
    }
    // Ownership is asked of the work data, not of a baked data-era attribute: a span list
    // cannot be flattened into one number, and the static twin below reads the same source.
    p.style.fill = ownsAt(work.map, pid, vc) && fill ? fill : 'var(--map-land)';
    p.classList.toggle('domain', hset.has(pid));
  });
  svg.querySelectorAll<SVGGElement>('.mmark').forEach((m) => m.classList.toggle('show', +(m.dataset.ch || 0) <= vc));
  // Reveal each route once its revealCh is reached (color/reveal come from the work data).
  for (const r of work.map.campaignRoutes) {
    showRoute(svg.querySelector('#rt-' + r.key), vc >= r.revealCh, animate, r.color);
  }
  // Drive the shared runner + label along the one route that declares a runnerLabel.
  const runnerRoute = work.map.campaignRoutes.find((r) => r.runnerLabel);
  const rl = svg.querySelector<SVGTextElement>('#rt-lb');
  const run = svg.querySelector<SVGGElement>('#rt-runner');
  const rpath = runnerRoute ? svg.querySelector<SVGPathElement>('#rt-' + runnerRoute.key) : null;
  if (runnerRoute && rpath && rl && run && vc >= runnerRoute.revealCh) {
    try {
      const mid = rpath.getPointAtLength(rpath.getTotalLength() * 0.5);
      rl.setAttribute('x', String(mid.x));
      rl.setAttribute('y', String(mid.y - 16));
      rl.textContent = runnerRoute.runnerLabel!;
      rl.style.opacity = '1';
      const end = rpath.getPointAtLength(rpath.getTotalLength());
      run.setAttribute('transform', `translate(${end.x},${end.y})`);
      run.style.opacity = animate ? '0' : '1';
      if (animate) setTimeout(() => (run.style.opacity = '1'), 1000);
    } catch {
      /* noop */
    }
  } else {
    if (rl) rl.style.opacity = '0';
    if (run) run.style.opacity = '0';
  }
  const cap = root.querySelector<HTMLElement>('.map-caption');
  if (cap)
    cap.textContent =
      vc >= 1
        ? work.map.chapterCaptions[vc] || ''
        : 'まだ 旅は これから。章を すすめると、領土が ひろがっていく。';
  renderMapLegend(root, work, vc);
}
