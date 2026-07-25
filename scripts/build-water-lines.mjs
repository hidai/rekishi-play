// Build a stage's WATER layer (rivers + lakes) as real [lon,lat] data, the same way
// build-overseas-coastline.mjs builds the land silhouette: output is real degrees, projected at
// render by Geo.proj, so one engine path draws Japan, the Pacific band and Europe alike.
//
// Why water: a silhouette-only overseas stage is flat land + flat sea and reads as "no information"
// (family play 2026-07-22, davinci のイタリア地図). Japan gets its texture from 令制国 overlays, but
// Renaissance Italy has no honest province layer to draw (its borders moved yearly — WRITING 地図
// 書法2「地図はヘッジできない」). Rivers and lakes carry no political claim, are stable over the
// centuries the works cover, and for davinci they are the subject itself (水の観察・アルノ川の運河案).
//
// Rivers are OPEN polylines, so they are clipped per segment (not Sutherland-Hodgman, which closes
// a ring): points outside the bbox are dropped and each surviving run becomes its own polyline.
// Lakes are closed rings and reuse the polygon path.
//
// Data source (public domain): Natural Earth vector geojson —
//   ne_10m_rivers_lake_centerlines.geojson / ne_10m_rivers_europe.geojson / ne_10m_lakes.geojson
//
// Usage:
//   node scripts/build-water-lines.mjs <W,E,S,N> <eps-deg> <rivers:name,name,...> <files...>
// Example (davinci = GEO_EUROPE):
//   node scripts/build-water-lines.mjs -1,15,40,49 0.02 \
//     'Po,Ticino,Adda,Adige,Arno,Tevere,Loire,Rhône' /tmp/rivers10.json /tmp/rivers_eu.json /tmp/lakes10.json
/* eslint-disable */
import { readFileSync } from 'node:fs';

const [W, E, S, N] = (process.argv[2] || '').split(',').map(Number);
const EPS = Number(process.argv[3] || 0.02);
const WANT = new Set((process.argv[4] || '').split(',').map((s) => s.trim()).filter(Boolean));
const FILES = process.argv.slice(5);

const inBox = (p) => p[0] >= W && p[0] <= E && p[1] >= S && p[1] <= N;
const named = (f) => f.properties?.name ?? f.properties?.name_en ?? '';

/** Douglas-Peucker in degrees (same tolerance model as the coastline builder). */
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  const d2 = (p, a, b) => {
    const [x, y] = p, [x1, y1] = a, [x2, y2] = b;
    const dx = x2 - x1, dy = y2 - y1;
    const t = dx || dy ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy))) : 0;
    const px = x1 + t * dx, py = y1 + t * dy;
    return (x - px) ** 2 + (y - py) ** 2;
  };
  let maxD = 0, idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = d2(pts[i], pts[0], pts[pts.length - 1]);
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD <= eps * eps) return [pts[0], pts[pts.length - 1]];
  return [...simplify(pts.slice(0, idx + 1), eps).slice(0, -1), ...simplify(pts.slice(idx), eps)];
}

/** Runs of consecutive in-bbox points (an open line may leave and re-enter the frame). */
function clipLine(line) {
  const runs = [];
  let cur = [];
  for (const p of line) {
    if (inBox(p)) cur.push(p);
    else if (cur.length) { runs.push(cur); cur = []; }
  }
  if (cur.length) runs.push(cur);
  return runs.filter((r) => r.length >= 2);
}

const r4 = (n) => Math.round(n * 1e4) / 1e4;
const flat = (pts) => pts.flatMap(([x, y]) => [r4(x), r4(y)]);

const rivers = [];
const lakes = [];
for (const file of FILES) {
  const gj = JSON.parse(readFileSync(file, 'utf8'));
  for (const f of gj.features ?? []) {
    const g = f.geometry;
    if (!g) continue;
    if (g.type === 'LineString' || g.type === 'MultiLineString') {
      if (!WANT.has(named(f))) continue;
      const lines = g.type === 'LineString' ? [g.coordinates] : g.coordinates;
      for (const ln of lines) {
        for (const run of clipLine(ln)) {
          const s = simplify(run, EPS);
          if (s.length >= 2) rivers.push({ name: named(f), pts: s });
        }
      }
    } else if (g.type === 'Polygon' || g.type === 'MultiPolygon') {
      const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
      for (const poly of polys) {
        const ring = poly[0];
        if (!ring.some(inBox)) continue;
        const s = simplify(ring, EPS / 2);
        if (s.length >= 4) lakes.push({ name: named(f) || '(unnamed)', pts: s });
      }
    }
  }
}

const emit = (label, rows) => {
  console.log(`// ${label}`);
  for (const r of rows) console.log(`  [${flat(r.pts).join(',')}], // ${r.name} (${r.pts.length}pt)`);
  const bytes = rows.reduce((n, r) => n + flat(r.pts).join(',').length, 0);
  console.log(`// ${rows.length} rings, ~${bytes} bytes\n`);
};
emit('rivers', rivers);
emit('lakes', lakes);
