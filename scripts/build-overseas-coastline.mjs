// Build an OVERSEAS land silhouette as a base layer, proving the map engine generalizes beyond
// Japan (observation memo 2026-07-14: "地図表示エンジンを大規模改修して、将来の海外表示にも対応
// できるように。沖縄や中国やヨーロッパなども"). Same model as build-japan-coastline.mjs: output is
// REAL [lon,lat] rings, projected at render via Geo.proj — so the identical engine path
// (engine/map/project.ts) draws it, just with different projection params.
//
// The one new step vs. Japan: an overseas region is a slice of a giant continent polygon, so each
// ring is clipped to the view bbox (Sutherland-Hodgman against the rectangle) before simplifying.
// The coast inside the bbox stays true; the bbox edges close the silhouette on the inland/off-frame
// sides (same idea as Japan's land extending past vb).
//
// "Variable projection" = the projection params are DERIVED from the bbox instead of hand-fit:
//   k = cos(centerLat)   — longitude→x compression at this latitude (Japan's hand-fit k=0.829 ≈
//                          cos(34°); an equator view gets k≈1, a European view k≈0.64).
//   s = targetH / latSpan — px per degree of latitude, sized so the view is targetH tall.
// This is what lets the same formula place Okinawa, California, or Europe correctly.
//
// Data source (real [lon,lat] land polygons, public domain):
//   https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_land.geojson
//   curl -sSL -o /tmp/ne_land.json <url>
//
// A view may cross the antimeridian (the Pacific crossing: Japan 139°E → San Francisco 122°W). Give
// such a bbox an EAST longitude past 180 (E=245 means 115°W) and every ring in the western
// hemisphere is unwrapped by +360 before clipping, so one continuous band spans the ocean. The
// unwrap is per RING (by its mean longitude), never per point: shifting single points would tear a
// ring straddling the bbox edge into a zigzag across the world. Views inside one hemisphere (E<=180)
// skip the unwrap entirely — Japan's geo needs Okinawa (127.6°E) to stay WEST of lonmin=128.6°E,
// i.e. at negative x, which normalizing into [lonmin,lonmin+360) would break. See Geo.proj.wrap.
//
// Usage: node scripts/build-overseas-coastline.mjs <ne_land.json> <W,E,S,N> [eps-deg] [targetH] [minArea-deg2]
// Example (US west coast, San Diego→Oregon incl. San Francisco):
//   node scripts/build-overseas-coastline.mjs /tmp/ne_land.json -125,-116,32,43 0.05 690
// Example (the Pacific band, Japan → North America, crossing the antimeridian):
//   node scripts/build-overseas-coastline.mjs /tmp/ne_land.json 128,245,25,50 0.15 262 0.35
/* eslint-disable */
import { readFileSync } from 'node:fs';

const SRC = process.argv[2];
const BBOX = (process.argv[3] || '').split(',').map(Number);
const EPS = Number(process.argv[4] || 0.05); // Douglas-Peucker tolerance in DEGREES
const TARGET_H = Number(process.argv[5] || 690); // output viewBox height in px (Japan parity)
// Drop clip slivers and specks below this area. The default suits a regional view; a whole-ocean
// band wants a bigger floor (an island under ~0.3 deg² is a sub-pixel dot there, all bytes no read).
const MIN_AREA = Number(process.argv[6] || 0.02);
if (!SRC || BBOX.length !== 4) {
  throw new Error('usage: build-overseas-coastline.mjs <ne_land.json> <W,E,S,N> [eps] [targetH] [minArea]');
}
const [W, E, S, N] = BBOX;
const WRAP = E > 180; // the bbox crosses the antimeridian → unwrap western-hemisphere rings by +360

// Sutherland-Hodgman polygon clip against one half-plane; `keep(p)` = inside, `isect` on the edge.
function clipEdge(pts, keep, isect) {
  const out = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[(i + pts.length - 1) % pts.length], b = pts[i];
    const ain = keep(a), bin = keep(b);
    if (bin) {
      if (!ain) out.push(isect(a, b));
      out.push(b);
    } else if (ain) {
      out.push(isect(a, b));
    }
  }
  return out;
}
function clipRect(ring) {
  let p = ring.map(([x, y]) => [x, y]);
  const lerpX = (a, b, x) => [x, a[1] + ((b[1] - a[1]) * (x - a[0])) / (b[0] - a[0])];
  const lerpY = (a, b, y) => [a[0] + ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]), y];
  p = clipEdge(p, (q) => q[0] >= W, (a, b) => lerpX(a, b, W));
  p = clipEdge(p, (q) => q[0] <= E, (a, b) => lerpX(a, b, E));
  p = clipEdge(p, (q) => q[1] >= S, (a, b) => lerpY(a, b, S));
  p = clipEdge(p, (q) => q[1] <= N, (a, b) => lerpY(a, b, N));
  return p;
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
    const [lo, hi] = stack.pop();
    let md = 0, mi = -1;
    const [x1, y1] = pts[lo], [x2, y2] = pts[hi];
    const dx = x2 - x1, dy = y2 - y1, den = Math.hypot(dx, dy) || 1;
    for (let i = lo + 1; i < hi; i++) {
      const [px, py] = pts[i];
      const d = Math.abs(dx * (y1 - py) - (x1 - px) * dy) / den;
      if (d > md) { md = d; mi = i; }
    }
    if (md > eps && mi > 0) { keep[mi] = true; stack.push([lo, mi], [mi, hi]); }
  }
  return pts.filter((_, i) => keep[i]);
}

// Douglas-Peucker anchors the two endpoints and drops points near the chord between them, so a
// CLOSED ring (first point == last) hands it a ZERO-LENGTH chord: every point measures distance 0
// from it, nothing is ever kept, and the ring collapses to 2 points and is dropped. A ring arrives
// closed only when the bbox clip left it untouched — i.e. it lies wholly inside the view (Honshu in
// the Pacific band). The first overseas build clipped every ring, so nothing was closed and the bug
// stayed invisible; the Pacific band silently lost all of Japan to it. Split a closed ring at its
// farthest point from the start and simplify the two open chains, then re-open it (first != last,
// the same convention clipRect emits — projRing closes the path with Z).
function dpRing(pts, eps) {
  const n = pts.length;
  const closed = n > 3 && pts[0][0] === pts[n - 1][0] && pts[0][1] === pts[n - 1][1];
  if (!closed) return dp(pts, eps);
  const p = pts.slice(0, -1);
  let far = 0, fd = -1;
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i][0] - p[0][0], p[i][1] - p[0][1]);
    if (d > fd) { fd = d; far = i; }
  }
  const a = dp(p.slice(0, far + 1), eps); // start → farthest
  const b = dp(p.slice(far).concat([p[0]]), eps); // farthest → back to start
  return a.concat(b.slice(1, -1)); // drop b's duplicated endpoints (farthest, start)
}

// Shift a whole ring into the bbox's longitude domain when the view crosses the antimeridian.
// Decided by the ring's mean longitude so the ring stays geometrically intact (see header).
function unwrap(ring) {
  if (!WRAP) return ring;
  const mean = ring.reduce((a, p) => a + p[0], 0) / ring.length;
  return mean < 0 ? ring.map(([x, y]) => [x + 360, y]) : ring;
}

const fc = JSON.parse(readFileSync(SRC, 'utf8'));
const rings = [];
for (const f of fc.features) {
  const g = f.geometry;
  const polys = g.type === 'Polygon' ? [g.coordinates] : g.coordinates;
  for (const poly of polys) {
    const clipped = clipRect(unwrap(poly[0]));
    if (clipped.length >= 3) rings.push(clipped);
  }
}
// Keep rings with meaningful area (drop clip slivers and sub-pixel specks).
const kept = rings.filter((r) => areaLL(r) > MIN_AREA).map((r) => dpRing(r, EPS)).filter((r) => r.length >= 3);
kept.sort((a, b) => areaLL(b) - areaLL(a));

const centerLat = (S + N) / 2;
const k = Math.cos((centerLat * Math.PI) / 180);
const s = TARGET_H / (N - S);
const vbW = Math.round((E - W) * s * k);
const vbH = Math.round((N - S) * s);
const proj = { lonmin: W, latmax: N, k: +k.toFixed(6), s: +s.toFixed(4) };

const flat = kept.map((r) => r.flatMap(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]));
const totalPts = flat.reduce((n, r) => n + r.length / 2, 0);

console.error(`rings=${kept.length} pts=${totalPts} vb=[${vbW},${vbH}] centerLat=${centerLat.toFixed(2)} k=${proj.k} s=${proj.s}`);
process.stdout.write(
  'proj = ' + JSON.stringify(proj) + '\nbounds = ' + JSON.stringify([W, E, S, N]) +
    '\nvb = ' + JSON.stringify([vbW, vbH]) + '\nrings =\n' +
    flat.map((r) => '  [' + r.join(',') + ']').join(',\n') + '\n',
);
