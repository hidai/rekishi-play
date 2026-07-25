// Render a work's campaign map (手帳「進軍の地図」) to a self-contained, rasterizable SVG.
// The live app fills this map imperatively (applyMapView needs a browser: getTotalLength/rAF),
// so it had no dev-loop raster self-check unlike scene maps / faces / figures. campaignStaticSvg
// bakes the same fills inline at a view chapter; this tool staticizes theme colors so librsvg
// can render it. See scripts/render-scene.ts / render-geo.ts for the sibling pattern.
// Usage: npx vite-node scripts/render-campaign.ts <out.svg> [slug=hidenaga] [vc=99]
import { writeFileSync, readFileSync } from 'node:fs';
import { campaignStaticSvg } from '../src/engine/map/campaignMap';
import { staticizeSvg } from './lib/static-css';
import { resolveWork } from './lib/works';

const out = process.argv[2];
if (!out) throw new Error('usage: vite-node scripts/render-campaign.ts <out.svg> [slug] [vc]');
const slug = process.argv[3] ?? 'hidenaga';
const vc = parseInt(process.argv[4] ?? '99', 10);
const work = resolveWork(slug);

let svg = campaignStaticSvg(work, vc);
svg = staticizeSvg(svg, readFileSync(new URL('../src/app.css', import.meta.url), 'utf8'));
writeFileSync(out, svg);
console.log('wrote', out, `(${slug} campaign map, vc=${vc}, ${svg.length} bytes)`);
