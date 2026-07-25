// Runtime projection of real [lon,lat] geometry into the map's pixel space.
// Formula matches the frozen legacy pixels: x=(lon-lonmin)*s*k, y=(latmax-lat)*s.
// Keeping geometry in lon/lat (not pre-projected pixels) is what lets the same asset serve any
// viewport and generalizes the engine to overseas landmasses (swap the source + proj params).
import type { Geo, GazPoint } from '../types';

type Proj = Geo['proj'];

/** Mutable bbox accumulator shared by the content-fit frame builders (campaign map, scene locator). */
export interface BBox {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** An empty accumulator. `isFinite(b.x0)` is false until something has been grown into it. */
export function emptyBBox(): BBox {
  return { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
}

export function growPoint(b: BBox, x: number, y: number): void {
  if (x < b.x0) b.x0 = x;
  if (y < b.y0) b.y0 = y;
  if (x > b.x1) b.x1 = x;
  if (y > b.y1) b.y1 = y;
}

/**
 * Grow a bbox accumulator by every coordinate pair in a path `d`. Provinces are pure M/L polylines;
 * routes may add Q/C — their control points are counted too, which only ever enlarges the bbox (a
 * safe overestimate that still contains the drawn curve). Assumes every command carries coordinate
 * PAIRS (no H/V single-coord commands, which the map data does not use).
 */
export function growBBox(d: string, b: BBox): void {
  const nums = d.match(/-?\d+(?:\.\d+)?/g);
  if (!nums) return;
  for (let i = 0; i + 1 < nums.length; i += 2) growPoint(b, +nums[i], +nums[i + 1]);
}

/** Resolve a gaz place to px: project its [lon,lat] via the geo projection, else use its [x,y]. */
export function gazXY(geo: Geo, g: GazPoint): { x: number; y: number } {
  if (g.lon != null && g.lat != null) return { x: projX(geo.proj, g.lon), y: projY(geo.proj, g.lat) };
  return { x: g.x ?? 0, y: g.y ?? 0 };
}

export function projX(proj: Proj, lon: number): number {
  let d = lon - proj.lonmin;
  // A view spanning the antimeridian has a longitude domain of [lonmin, lonmin+360), so a place in
  // the western hemisphere lies EAST of lonmin, not 300-odd degrees west of it (San Francisco in the
  // Pacific band: -122.42 → +237.58). Only `wrap` views take this branch — an unwrapped geo must
  // keep negative x for places west of lonmin (Japan's Okinawa). See Geo.proj.wrap.
  if (proj.wrap && d < 0) d += 360;
  return d * proj.s * proj.k;
}
export function projY(proj: Proj, lat: number): number {
  return (proj.latmax - lat) * proj.s;
}

/** Project one flat [lon,lat,lon,lat,...] ring to an SVG path `d` (closed). */
export function projRing(proj: Proj, ll: number[]): string {
  let d = '';
  for (let i = 0; i < ll.length; i += 2) {
    d += (i === 0 ? 'M' : 'L') + projX(proj, ll[i]).toFixed(1) + ' ' + projY(proj, ll[i + 1]).toFixed(1);
  }
  return d + 'Z';
}

/** Project one flat [lon,lat,lon,lat,...] polyline to an SVG path `d` (open). */
export function projLine(proj: Proj, ll: number[]): string {
  let d = '';
  for (let i = 0; i < ll.length; i += 2) {
    d += (i === 0 ? 'M' : 'L') + projX(proj, ll[i]).toFixed(1) + ' ' + projY(proj, ll[i + 1]).toFixed(1);
  }
  return d;
}

// Base landmass silhouette as one projected `d` per ring (projected once per Geo, cached).
// Rings are simplified independently so they leave hairline gaps; the caller closes them by
// stroking each ring in its fill color (matching stroke = outward dilation), so overlapping
// same-color rings read as one continuous coastline with no sea-colored cracks.
const _baseCache = new WeakMap<Geo, string[]>();
/**
 * Inland water as SVG path `d`: lakes closed, rivers open (a river is a line, and closing it would
 * draw a phantom bank back to its source). Cached per geo like the base rings — the geometry is a
 * property of the stage, not of the scene.
 */
const _waterCache = new WeakMap<Geo, { rivers: string[]; lakes: string[] }>();
export function geoWater(geo: Geo): { rivers: string[]; lakes: string[] } {
  let w = _waterCache.get(geo);
  if (w == null) {
    w = {
      rivers: (geo.rivers ?? []).map((ll) => projLine(geo.proj, ll)),
      lakes: (geo.lakes ?? []).map((ll) => projRing(geo.proj, ll)),
    };
    _waterCache.set(geo, w);
  }
  return w;
}

export function geoBaseRings(geo: Geo): string[] {
  if (!geo.land) return [];
  let s = _baseCache.get(geo);
  if (s == null) {
    s = geo.land.map((ll) => projRing(geo.proj, ll));
    _baseCache.set(geo, s);
  }
  return s;
}
