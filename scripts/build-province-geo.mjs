// Split the three JIS prefectures that hold more than one old province (令制国) into REAL
// province polygons, so a map can color 三河 without also coloring 信長's 尾張.
//
// Why: GEO.pref keys are JIS prefecture codes wearing an old-province name, so "23" is 尾張 AND
// 三河 in one shape, "22" is 遠江 + 駿河 + 伊豆, "12" is 下総 + 上総 + 安房. Coloring at that
// granularity makes the map assert things that are false (WRITING 地図書法2), which is why
// ieyasu ships no territory layer at all (src/works/ieyasu/map.ts header (1)).
//
// Method: old-province borders in these three prefectures still run along modern municipality
// borders (to within a village or two), so each province is the UNION of its municipalities.
// The union is exact, not approximate: N03 municipality rings share identical vertices along
// their common borders, so an internal edge appears twice with opposite direction and cancels.
// What survives is the province outline; the leftovers are stitched back into rings.
//
// Data source (real municipality boundaries, 国土数値情報 N03 derived, 1% simplified):
//   https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/geojson/s0010/N03-21_<pref>_210101.json
//   curl -sSL -o /tmp/pref23.json <url>
// Same projection family as dataofjapan/land (scripts/build-kanto-geo.mjs), so the new provinces
// seam against the untouched legacy neighbours.
//
// Projection (must match src/shared/geoJapan.ts GEO.proj):
//   x = (lon - lonmin) * s * k ,  y = (latmax - lat) * s
//
// Output: TS-ready pref entries printed to stdout. Paste them into geoJapan.ts (hand-managed,
// not auto-regenerated — same policy as faces/story/map).
//
// Usage: node scripts/build-province-geo.mjs [dir-with-pref<code>.json] [eps] [delta]
/* eslint-disable */
import { readFileSync } from 'node:fs';

const DIR = process.argv[2] || '/tmp';
const EPS = Number(process.argv[3] || 1.2); // Douglas-Peucker tolerance in projected px
const DELTA = Number(process.argv[4] || 1.2); // outward dilation px (closes simplification cracks)

const proj = { lonmin: 128.5977, latmax: 37.03053, k: 0.828917, s: 114.3479 };
const px = (lon) => (lon - proj.lonmin) * proj.s * proj.k;
const py = (lat) => (proj.latmax - lat) * proj.s;

// 令制国 → the JIS municipality codes that make it up. Hand-authored from the old district
// (郡) each municipality descends from, then fact-checked (2026-07-23: no misassignment).
// Four modern municipalities straddle a province border and are assigned whole to the side
// holding their larger, older half — 島田市 = 志太郡/駿河 + 旧金谷町/遠江, 横芝光町 = 山武郡/上総
// + 旧光町/下総, 沼津市 = 駿東郡/駿河 + 内浦・西浦/伊豆, 千葉市 = 千葉郡/下総 + 土気の一部/上総.
// The error is a village or two wide, well under what this map's simplification already draws.
const PROVINCES = [
  { id: 'owari', n: '尾張', pref: '23', c: 1, codes: [
    23101, 23102, 23103, 23104, 23105, 23106, 23107, 23108, 23109, 23110, 23111, 23112, 23113,
    23114, 23115, 23116, 23203, 23204, 23205, 23206, 23208, 23215, 23216, 23217, 23219, 23220,
    23222, 23223, 23224, 23226, 23228, 23229, 23230, 23232, 23233, 23234, 23235, 23237, 23238,
    23302, 23342, 23361, 23362, 23424, 23425, 23427, 23441, 23442, 23445, 23446, 23447] },
  { id: 'mikawa', n: '三河', pref: '23', c: 1, codes: [
    23201, 23202, 23207, 23209, 23210, 23211, 23212, 23213, 23214, 23221, 23225, 23227, 23231,
    23236, 23501, 23561, 23562, 23563] },
  { id: 'totomi', n: '遠江', pref: '22', c: 1, codes: [
    22131, 22132, 22133, 22134, 22135, 22136, 22137, 22211, 22213, 22216, 22221, 22223, 22224,
    22226, 22424, 22429, 22461] },
  { id: 'suruga', n: '駿河', pref: '22', c: 1, codes: [
    22101, 22102, 22103, 22203, 22207, 22209, 22210, 22212, 22214, 22215, 22220, 22341, 22342,
    22344] },
  { id: 'izu', n: '伊豆', pref: '22', c: 1, codes: [
    22205, 22206, 22208, 22219, 22222, 22225, 22301, 22302, 22304, 22305, 22306, 22325] },
  { id: 'shimosa', n: '下総', pref: '12', c: 1, codes: [
    12101, 12102, 12103, 12104, 12105, 12106, 12202, 12203, 12204, 12207, 12208, 12211, 12212,
    12215, 12216, 12217, 12220, 12221, 12222, 12224, 12227, 12228, 12230, 12231, 12232, 12233,
    12235, 12236, 12322, 12329, 12342, 12347, 12349] },
  { id: 'kazusa', n: '上総', pref: '12', c: 1, codes: [
    12206, 12210, 12213, 12218, 12219, 12225, 12226, 12229, 12237, 12238, 12239, 12403, 12409,
    12410, 12421, 12422, 12423, 12424, 12426, 12427, 12441, 12443] },
  { id: 'awa', n: '安房', pref: '12', c: 1, codes: [12205, 12223, 12234, 12463] },
];

function ringsOf(geom) {
  if (geom.type === 'Polygon') return [geom.coordinates[0]];
  return geom.coordinates.map((poly) => poly[0]); // outer ring of each polygon
}
function areaOf(ring) {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j].x * ring[i].y - ring[i].x * ring[j].y;
  }
  return a / 2;
}
const key = (p) => `${p[0].toFixed(7)},${p[1].toFixed(7)}`;

/**
 * Union of same-fill municipality rings: drop every edge that also appears reversed in another
 * ring (= an internal border between two municipalities of the same province), then walk the
 * surviving edges into closed rings. Returns rings in [lon,lat].
 */
function unionRings(rings) {
  const edges = new Map(); // "a|b" -> [a, b]
  for (const ring of rings) {
    const r = ring.slice();
    if (key(r[0]) === key(r[r.length - 1])) r.pop();
    for (let i = 0; i < r.length; i++) {
      const a = r[i], b = r[(i + 1) % r.length];
      const ka = key(a), kb = key(b);
      if (ka === kb) continue;
      if (edges.has(`${kb}|${ka}`)) edges.delete(`${kb}|${ka}`); // internal border: cancels
      else edges.set(`${ka}|${kb}`, [a, b]);
    }
  }
  const next = new Map(); // from-key -> list of edges leaving it
  for (const [, [a, b]] of edges) {
    const ka = key(a);
    if (!next.has(ka)) next.set(ka, []);
    next.get(ka).push([a, b]);
  }
  const out = [];
  for (const [, list] of next) {
    while (list.length) {
      let [a, b] = list.shift();
      const start = key(a);
      const ring = [a];
      let guard = 0;
      while (key(b) !== start && guard++ < 200000) {
        ring.push(b);
        const cand = next.get(key(b));
        if (!cand || !cand.length) break; // open chain (should not happen on clean data)
        [, b] = cand.shift();
      }
      if (ring.length > 3) out.push(ring);
    }
  }
  return out;
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
  const p = pts.slice();
  if (p.length > 1 && p[0].x === p[p.length - 1].x && p[0].y === p[p.length - 1].y) p.pop();
  if (p.length < 5) return p;
  let far = 1, fd = -1;
  for (let i = 1; i < p.length; i++) {
    const d = Math.hypot(p[i].x - p[0].x, p[i].y - p[0].y);
    if (d > fd) { fd = d; far = i; }
  }
  const first = dp(p.slice(0, far + 1), eps);
  const second = dp(p.slice(far), eps);
  return first.concat(second.slice(1, -1));
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
  if (Math.abs(a) < 1e-6) {
    const xs = pts.map((p) => p.x), ys = pts.map((p) => p.y);
    return { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
  }
  return { x: x / (6 * a), y: y / (6 * a) };
}
// Adjacent provinces both grow toward their shared border, so cracks left by independent
// simplification close instead of showing through as sea-colored hairlines.
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

const byPref = {};
for (const p of new Set(PROVINCES.map((v) => v.pref))) {
  byPref[p] = JSON.parse(readFileSync(`${DIR}/pref${p}.json`, 'utf8'));
}

const out = [];
for (const prov of PROVINCES) {
  const want = new Set(prov.codes.map(String));
  const feats = byPref[prov.pref].features.filter((f) => want.has(f.properties.N03_007));
  const missing = [...want].filter((c) => !feats.some((f) => f.properties.N03_007 === c));
  if (missing.length) console.error(`  !! ${prov.n}: no such municipality ${missing.join(',')}`);
  const rings = feats.flatMap((f) => ringsOf(f.geometry));
  const merged = unionRings(rings);
  // Projected rings, largest first; islets below a visible size are dropped.
  let parts = merged
    .map((r) => r.map(([lon, lat]) => ({ x: px(lon), y: py(lat) })))
    .map((pts) => ({ pts, a: Math.abs(areaOf(pts)) }))
    .sort((u, v) => v.a - u.a)
    .filter((u, i) => i === 0 || u.a > 12);
  const rawPts = parts.reduce((n, u) => n + u.pts.length, 0);
  parts = parts.map((u) => dilateFromCentroid(simplifyRing(u.pts, EPS), DELTA)).filter((p) => p.length > 3);
  const c = centroid(parts[0]);
  out.push({
    ...prov,
    x: Math.round(c.x), y: Math.round(c.y),
    rings: parts.length, raw: rawPts, pts: parts.reduce((n, p) => n + p.length, 0),
    d: parts.map(pathOf).join(''),
  });
}

for (const e of out) {
  console.error(`  ${e.id} ${e.n}: ${e.codes.length} muni, ${e.rings} ring(s), ${e.raw}->${e.pts} pts, label(${e.x},${e.y})`);
}
console.log(out.map((e) =>
  `"${e.id}":{n:"${e.n}",c:${e.c},x:${e.x},y:${e.y},d:"${e.d}"}`
).join(',\n'));
