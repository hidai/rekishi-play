// Render any Geo's base land silhouette to a self-contained SVG — a general dev tool that proves
// the map engine's projection generalizes to overseas landmasses. It runs the SAME engine path as
// the scene map (geoBaseRings → projX/projY) on an arbitrary Geo, so a green US-west render is
// evidence the engine is not Japan-specific (Phase 2 of the map-engine generalization; see
// src/shared/geoWorld.ts). Theme var()/color-mix() are resolved to light-theme literals so librsvg
// can rasterize it (same staticizer as render-scene.ts).
// Usage: npx vite-node scripts/render-geo.ts <out.svg> [us-west|japan|europe|pacific]
import { writeFileSync, readFileSync } from 'node:fs';
import { GEO_US_WEST, GEO_PACIFIC, GEO_EUROPE } from '../src/shared/geoWorld';
import { GEO } from '../src/shared/geoJapan';
import { geoBaseRings, geoWater } from '../src/engine/map/project';
import { staticizeSvg } from './lib/static-css';
import type { Geo } from '../src/engine/types';

const GEOS: Record<string, Geo> = {
  'us-west': GEO_US_WEST,
  japan: GEO,
  europe: GEO_EUROPE,
  pacific: GEO_PACIFIC,
};

const out = process.argv[2];
const key = process.argv[3] ?? 'us-west';
if (!out) throw new Error('usage: vite-node scripts/render-geo.ts <out.svg> [us-west|japan]');
const geo = GEOS[key];
if (!geo) throw new Error(`unknown geo: ${key} (have: ${Object.keys(GEOS).join(', ')})`);

const [w, h] = geo.vb;
const base = geoBaseRings(geo)
  .map((d) => `<path d="${d}" fill="var(--map-ctx)" stroke="var(--map-ctx)" stroke-width="3" stroke-linejoin="round"/>`)
  .join('');
const wat = geoWater(geo);
const water =
  wat.lakes.map((d) => `<path class="mlake" d="${d}" stroke-width="1.2"/>`).join('') +
  wat.rivers.map((d) => `<path class="mriver" d="${d}" stroke-width="2.2"/>`).join('');
let svg =
  `<svg class="scene-map" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${key} coastline">` +
  `<rect class="msea" x="-40" y="-40" width="${w + 80}" height="${h + 80}"/>` +
  `<g class="mland-base">${base}</g><g class="mwater">${water}</g></svg>`;
svg = staticizeSvg(svg, readFileSync(new URL('../src/app.css', import.meta.url), 'utf8'));
writeFileSync(out, svg);
console.log('wrote', out, `(${key} geo, vb=[${w},${h}], ${geoBaseRings(geo).length} ring(s), ${svg.length} bytes)`);
