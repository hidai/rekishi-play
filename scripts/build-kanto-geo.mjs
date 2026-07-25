// Regenerate the Kanto (+ Kai) GEO polygons in src/shared/geoJapan.ts from REAL
// prefecture-boundary coordinates, replacing the earlier hand-drawn shapes that a
// family playtest flagged as obviously fake ("一発でバレて気持ち悪い").
//
// Data source (real lat/lon prefecture boundaries, JIS-coded):
//   https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson
//   curl -sSL -o /tmp/japan.geojson <url>
// This source is projection-compatible with the legacy western-Japan polygons: projecting
// its Nagano(20)/Shizuoka(22) through the GEO formula lands on the existing legacy pixels
// (bbox match), so the projected Kanto seams naturally against the untouched western map.
//
// Projection (must match src/shared/geoJapan.ts GEO.proj):
//   x = (lon - lonmin) * s * k ,  y = (latmax - lat) * s
//
// Output: TS-ready pref entries printed to stdout. Paste them into geoJapan.ts (that file
// is hand-managed, not auto-regenerated — same policy as faces/story/map). We keep the old
// JIS keys, old-province name labels, and colors; only the geometry becomes real.
//
// Usage: node scripts/build-kanto-geo.mjs [path-to-japan.geojson] [epsilon]
/* eslint-disable */
import { readFileSync } from 'node:fs';

const SRC = process.argv[2] || '/tmp/japan.geojson';
const EPS = Number(process.argv[3] || 1.2); // Douglas-Peucker tolerance in projected px
const DELTA = Number(process.argv[4] || 1.6); // outward dilation px (closes inter-province gaps)

const proj = { lonmin: 128.5977, latmax: 37.03053, k: 0.828917, s: 114.3479 };
const px = (lon) => (lon - proj.lonmin) * proj.s * proj.k;
const py = (lat) => (proj.latmax - lat) * proj.s;

// Old-province label + land color kept identical to the previous hand-drawn entries.
const META = {
  8:  { n: '常陸', c: 1 },
  9:  { n: '下野', c: 1 },
  10: { n: '上野', c: 1 },
  11: { n: '武蔵', c: 1 },
  12: { n: '下総', c: 1 },
  13: { n: '武蔵', c: 1 },
  14: { n: '相模', c: 1 },
  19: { n: '甲斐', c: 1 },
};
const ORDER = [19, 14, 13, 11, 10, 9, 8, 12]; // same order as the current file block

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
// Douglas-Peucker on projected points [{x,y}].
function dp(pts, eps) {
  if (pts.length < 3) return pts;
  const keep = new Array(pts.length).fill(false);
  keep[0] = keep[pts.length - 1] = true;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    let dmax = 0, idx = -1;
    const [ax, ay] = [pts[s].x, pts[s].y];
    const [bx, by] = [pts[e].x, pts[e].y];
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy) || 1e-9;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs((pts[i].x - ax) * dy - (pts[i].y - ay) * dx) / len;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (dmax > eps && idx > 0) {
      keep[idx] = true;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}
// Closed-ring DP: pick pts[0] and its farthest point as anchors, simplify each half.
function simplifyRing(pts, eps) {
  // drop duplicate closing vertex if present
  const p = pts.slice();
  if (p.length > 1 && p[0].x === p[p.length - 1].x && p[0].y === p[p.length - 1].y) p.pop();
  if (p.length < 4) return p;
  let far = 1, fd = -1;
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i].x - p[0].x, p[i].y - p[0].y);
    if (d > fd) { fd = d; far = i; }
  }
  const first = dp(p.slice(0, far + 1), eps);
  const second = dp(p.slice(far), eps);
  // concat halves, dropping the shared joint vertex
  return first.concat(second.slice(1, -1));
}
// Dilate a ring outward from its centroid by delta px. Adjacent same-color provinces both
// grow toward their shared border and overlap, so simplification gaps (which show through as
// sea-colored cracks, since all Kanto share one land color) close. Overlap of equal fills is
// invisible; the coastline only nudges ~delta px into the sea. Also fattens the thin Miura tip.
function dilateFromCentroid(pts, delta) {
  const c = centroid(pts);
  return pts.map((p) => {
    const dx = p.x - c.x, dy = p.y - c.y;
    const r = Math.hypot(dx, dy) || 1e-9;
    return { x: p.x + (dx / r) * delta, y: p.y + (dy / r) * delta };
  });
}
function pathOf(pts) {
  let d = `M${Math.round(pts[0].x)} ${Math.round(pts[0].y)}`;
  for (let i = 1; i < pts.length; i++) d += `L${Math.round(pts[i].x)} ${Math.round(pts[i].y)}`;
  return d + 'Z';
}
function centroid(pts) {
  let x = 0, y = 0, a = 0;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const cross = pts[j].x * pts[i].y - pts[i].x * pts[j].y;
    a += cross;
    x += (pts[j].x + pts[i].x) * cross;
    y += (pts[j].y + pts[i].y) * cross;
  }
  a *= 0.5;
  if (Math.abs(a) < 1e-6) { // degenerate → bbox center
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  }
  return { x: x / (6 * a), y: y / (6 * a) };
}

const gj = JSON.parse(readFileSync(SRC, 'utf8'));
const byId = {};
for (const f of gj.features) byId[f.properties.id] = f;

const out = [];
for (const id of ORDER) {
  const f = byId[id];
  const rings = ringsOf(f.geometry);
  // Mainland only: the single largest-area outer ring (drops Izu/Ogasawara & islets).
  let best = rings[0], bestA = -1;
  for (const r of rings) { const a = areaLL(r); if (a > bestA) { bestA = a; best = r; } }
  let pts = best.map(([lon, lat]) => ({ x: px(lon), y: py(lat) }));
  const raw = pts.length;
  pts = simplifyRing(pts, EPS);
  pts = dilateFromCentroid(pts, DELTA);
  const c = centroid(pts);
  const m = META[id];
  out.push({ id, n: m.n, c: m.c, x: Math.round(c.x), y: Math.round(c.y), pts: pts.length, raw, d: pathOf(pts) });
}

// summary to stderr, TS entries to stdout
for (const e of out) console.error(`  ${e.id} ${e.n}: ${e.raw}->${e.pts} pts, label(${e.x},${e.y})`);
console.log(out.map((e) =>
  `"${e.id}":{n:"${e.n}",c:${e.c},x:${e.x},y:${e.y},d:"${e.d}"}`
).join(',\n'));
