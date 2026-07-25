// 家紋（work.mon → MON レジストリ）のコンタクトシートを SVG で書き出す開発用スクリプト。
// Usage: npx vite-node scripts/render-mon.ts <out.svg>
//
// なぜ要るか: 家紋は art の中で唯一ラスタ自己点検の経路が無く、丸に剣花菱（katsu 骨組み-2）は
// 「SVG の数値は自己点検済み・目視は attended 待ち」のまま出荷された。家紋が実際に効くのは
// **実寸**（表題 96px / トップバー 22px）で、線の潰れ・葉の癒着・地紋の消失は座標では判らない。
// 各紋を「170px（鑑賞）/ 96px（.title-mon 実寸）/ 22px（.tb-logo .mon 実寸）」の3態で並べる。
// 背景は --bg（家紋が実際に載る面＝表題画面・トップバーはどちらも bg 系。--panel には載らない）。
import { readFileSync, writeFileSync } from 'node:fs';
import { MON } from '../src/engine/art/icons';
import { staticizeSvg } from './lib/static-css';

const out = process.argv[2];
if (!out) throw new Error('usage: vite-node scripts/render-mon.ts <out.svg>');

const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');
const BG = '#F5F1E6'; // light theme --bg (see scripts/lib/static-css.ts: light theme is the calibration)

const SIZES = [170, 96, 22];
const cellW = 170 + 96 + 22 + 4 * 28;
const rowH = 170 + 34;
const keys = Object.keys(MON);
const W = cellW;
const H = keys.length * rowH + 8;

/** One mon at `size`, placed with its top-left at (x, y). */
function placed(kind: string, size: number, x: number, y: number): string {
  // The generators emit leading whitespace before <svg>; trim so the strip anchors match.
  const inner = staticizeSvg(MON[kind]().trim(), css)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '');
  const k = size / 100;
  return `<g transform="translate(${x},${y}) scale(${k})">${inner}</g>`;
}

const rows = keys
  .map((kind, i) => {
    const y = i * rowH + 4;
    let x = 28;
    const cells = SIZES.map((s) => {
      // Bottom-align the three sizes so the small ones sit on the big one's baseline.
      const g = placed(kind, s, x, y + (170 - s));
      x += s + 28;
      return g;
    }).join('');
    return `<g>
      ${cells}
      <text x="${W - 12}" y="${y + 170 + 20}" text-anchor="end" font-family="sans-serif"
        font-size="14" fill="#23201C">${kind}  —  170 / 96(title) / 22(topbar) px</text>
      <line x1="0" y1="${y + rowH - 4}" x2="${W}" y2="${y + rowH - 4}" stroke="#23201C" stroke-opacity=".15"/>
    </g>`;
  })
  .join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background:${BG}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  ${rows}
</svg>`;

writeFileSync(out, svg);
console.log('wrote', out, `(${keys.length} crests: ${keys.join(', ')}, ${svg.length} bytes)`);
