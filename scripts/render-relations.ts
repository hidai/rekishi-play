// Renders a Work's relation map (相関図) to a standalone SVG for visual-check.
// The relmap markup uses CSS vars (var(--panel) etc.); we resolve them to the
// light-theme literals from app.css via scripts/lib/static-css.ts. (Injecting
// custom properties on the root element is NOT enough: librsvg ignores var()
// and paints black.)
// Usage: npx vite-node scripts/render-relations.ts <out.svg> [work-slug=hidenaga] [collected=all]
//   collected: "all" (default), "none", or a comma-separated list of card ids.
import { writeFileSync, readFileSync } from 'node:fs';
import { buildRelationMap } from '../src/engine/map/relationMap';
import { esc } from '../src/engine/util';
import { staticizeSvg } from './lib/static-css';
import { resolveWork } from './lib/works';

const out = process.argv[2];
if (!out) throw new Error('usage: vite-node scripts/render-relations.ts <out.svg> [slug] [collected]');
const slug = process.argv[3] ?? 'hidenaga';
const work = resolveWork(slug);

const arg = process.argv[4] ?? 'all';
let collected: Set<string>;
if (arg === 'all') collected = new Set(Object.keys(work.cards));
else if (arg === 'none') collected = new Set();
else collected = new Set(arg.split(',').map((s) => s.trim()));

const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');
const inner = staticizeSvg(buildRelationMap(work, collected), css);

// The category legend (what each edge colour means) is DOM in RelationsPane, so it is
// absent from the bare buildRelationMap SVG — eval personas viewing this render then flag
// "colours have no meaning" as a false positive (the product always shows the legend).
// Draw the same chips into the SVG here so the visual-check sees what the player sees.
// Legend colours are literal hex from cats[].color and labels are plain text, so no CSS
// var resolution is needed. This lives in the dev script, not the engine: the product must
// stay byte-identical (its legend wraps responsively as DOM).
function withLegend(markup: string): string {
  const cats = work.relations?.cats;
  if (!cats || cats.length === 0) return markup;
  const vb = markup.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!vb) return markup;
  const VW = parseFloat(vb[1]);
  const VH = parseFloat(vb[2]);

  const FS = 14;
  const SQ = 13; // colour swatch side
  const SWATCH_GAP = 6; // swatch → label
  const CHIP_GAP = 22; // chip → chip
  const ROW_H = 26;
  const MARGIN_X = 20;
  const PAD_TOP = 20; // divider → first row
  const PAD_BOTTOM = 16;
  // Approx text extent, matching tests/relation-map.test.ts: full-width glyph ~= fs, space ~= half.
  const textW = (t: string) => [...t].reduce((w, c) => w + (c === ' ' ? 0.5 : 1) * FS, 0);

  const els: string[] = [];
  let x = MARGIN_X;
  let row = 0;
  for (const c of cats) {
    const chipW = SQ + SWATCH_GAP + textW(c.label);
    if (x > MARGIN_X && x + chipW > VW - MARGIN_X) {
      row += 1;
      x = MARGIN_X;
    }
    const y = VH + PAD_TOP + row * ROW_H;
    els.push(
      `<rect x="${x}" y="${y}" width="${SQ}" height="${SQ}" rx="2.5" fill="${c.color}"/>` +
        `<text x="${x + SQ + SWATCH_GAP}" y="${y + SQ - 2}" font-family="serif" font-size="${FS}" fill="#2b2b2b">${esc(c.label)}</text>`,
    );
    x += chipW + CHIP_GAP;
  }
  const newVH = VH + PAD_TOP + (row + 1) * ROW_H + PAD_BOTTOM;
  const legend =
    `<line x1="0" y1="${VH + 1}" x2="${VW}" y2="${VH + 1}" stroke="#d8d0bd" stroke-width="1"/>` +
    els.join('');
  return markup
    .replace(/viewBox="0 0 [\d.]+ [\d.]+"/, `viewBox="0 0 ${VW} ${newVH}"`)
    .replace(/<\/svg>\s*$/, `${legend}</svg>`);
}

// Add a paper background so labels with light strokes stay legible on their own.
const svg = withLegend(inner).replace(/^<svg /, `<svg style="background:#F5F1E6" `);
writeFileSync(out, svg);
console.log('wrote', out, `(${slug}, ${collected.size} collected, ${svg.length} bytes)`);
