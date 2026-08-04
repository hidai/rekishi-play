// Build a national coastline silhouette (all 47 prefectures) as the BASE land layer that sits
// UNDER the legacy 令制国 (old-province) overlays used for territory coloring. This is what makes
// Tohoku / Hokkaido / Okinawa / Shikoku appear as land instead of sea, and — because a complete
// land layer now shows through the seams between mismatched old-province polygons — it also kills
// the sea-colored double-line at province borders (observation memo 2026-07-14).
//
// Output is stored in REAL LAT/LON (not pre-projected pixels): the engine projects at render time
// via Geo.proj, so the same asset works for any viewport, and the model generalizes to overseas
// landmasses (just swap source + projection). Rings are Douglas-Peucker-simplified in lon/lat.
// Adjacent prefectures share the coastline, so filling them all one color with a matching thin
// stroke (done at render) reads as a single dissolved silhouette.
//
// Per prefecture we keep its mainland (largest) ring PLUS every island ring at or above ISLAND_MIN.
// The first version kept only the largest ring, which silently deleted every offshore island in the
// country — Sado, Awaji, Oki, Itsukushima, Tsushima, Yakushima… — and a family playtest asked why
// Sado was missing (observation memo 2026-08-05). Islands are where exile, shrines and sea routes
// happen, so a work pins places on them; a named place over blank sea reads as "there is no island".
// ISLAND_MIN is a legibility floor, not a geographic one: below it a ring draws thinner than the
// coast stroke, so it would add ink without adding a place a child can point at.
//
// Data source (real lat/lon prefecture boundaries, JIS-coded), same as build-kanto-geo.mjs:
//   https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson
//   curl -sSL -o /tmp/japan.geojson <url>
//
// Usage: node scripts/build-japan-coastline.mjs [path-to-japan.geojson] [eps-deg]
/* eslint-disable */
import { readFileSync } from 'node:fs';

const SRC = process.argv[2] || '/tmp/japan.geojson';
// Douglas-Peucker tolerance in DEGREES (~2.2km). This is the value the shipped asset was built
// with, so a plain re-run reproduces its mainland rings byte for byte.
const EPS = Number(process.argv[3] || 0.02);
// Keep an island ring if its area reaches this many square degrees (~10 km²; at the base scale
// s=114.35 px/deg that is roughly 4x4 px, the smallest shape the 3px coast stroke still reads as
// land rather than a blot). 硫黄島 (鬼界ヶ島, kiyomori ch3) sits just above it.
const ISLAND_MIN = 0.001;

function ringsOf(geom) {
  if (geom.type === 'Polygon') return [geom.coordinates[0]];
  return geom.coordinates.map((poly) => poly[0]); // outer ring of each polygon
}
function areaLL(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(a) / 2;
}
// Douglas-Peucker on [lon,lat] pairs (planar in degrees — fine at this scale/tolerance).
function dp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let dmax = 0, idx = -1;
    const ax = pts[s][0], ay = pts[s][1], bx = pts[e][0], by = pts[e][1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1e-12;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs((pts[i][0] - ax) * dy - (pts[i][1] - ay) * dx) / len;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (dmax > eps && idx > 0) { keep[idx] = true; stack.push([s, idx], [idx, e]); }
  }
  return pts.filter((_, i) => keep[i]);
}
function simplifyRing(pts, eps) {
  const p = pts.slice();
  if (p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1]) p.pop();
  if (p.length < 4) return p;
  let far = 1, fd = -1;
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[0][0], p[i][1] - p[0][1]);
    if (d > fd) { fd = d; far = i; }
  }
  const first = dp(p.slice(0, far + 1), eps);
  const second = dp(p.slice(far), eps);
  return first.concat(second.slice(1, -1));
}

const gj = JSON.parse(readFileSync(SRC, 'utf8'));
const out = [];
let totalPts = 0;
for (const f of gj.features) {
  const id = f.properties.id;
  const rings = ringsOf(f.geometry).map((r) => ({ r, a: areaLL(r) })).sort((p, q) => q.a - p.a);
  // The mainland chunk (largest ring) plus every island big enough to read (see ISLAND_MIN).
  const keep = rings.filter((e, i) => i === 0 || e.a >= ISLAND_MIN);
  let islands = 0;
  for (const [i, e] of keep.entries()) {
    // The mainland tolerance (~1.3km) can eat a small island whole. Such an island draws only a few
    // pixels wide, so it does not need a finer tolerance — it needs to stay a closed blob: resample
    // the raw ring evenly instead, which costs a fixed handful of points.
    let pts = simplifyRing(e.r, EPS);
    if (pts.length < 8 && e.r.length >= 8) {
      const src = e.r.slice(0, e.r.length - 1);
      pts = Array.from({ length: 8 }, (_, k) => src[Math.round((k * src.length) / 8)]);
    }
    if (pts.length < 4) continue; // degenerate even unsimplified: not a shape
    const ll = pts.flatMap(([lon, lat]) => [Math.round(lon * 1e4) / 1e4, Math.round(lat * 1e4) / 1e4]);
    totalPts += pts.length;
    if (i > 0) islands++;
    out.push({ id, isle: i > 0, nl: f.properties.nam_ja || f.properties.nam || '', pts: pts.length, ll });
  }
  if (islands) console.error(`  ${String(id).padStart(2)} ${f.properties.nam_ja}: +${islands} islands`);
}
out.sort((a, b) => a.id - b.id || Number(a.isle) - Number(b.isle));

// summary → stderr, TS asset → stdout
console.error(`TOTAL: ${out.length} rings (${out.filter((e) => e.isle).length} islands), ${totalPts} pts`);
console.log('// Generated by scripts/build-japan-coastline.mjs from dataofjapan/land (real JIS coasts).');
console.log('// Base national land silhouette in [lon,lat]; projected at render via GEO.proj.');
console.log('export const JAPAN_COAST: number[][] = [');
console.log(out.map((e) => `  [${e.ll.join(',')}]`).join(',\n'));
console.log('];');
