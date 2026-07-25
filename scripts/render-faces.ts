// 似顔絵のコンタクトシートを SVG で書き出す開発用スクリプト。
// Usage: npx vite-node scripts/render-faces.ts <outdir> [work-slug=hidenaga]
// 各人物を「大170px円（鑑賞品質）/ 52px円 / 52px正方形（カード実寸の判別性）」の3態で並べる。
import { faceArt } from '../src/engine/art/face';
import { writeFileSync } from 'node:fs';
import { resolveWork } from './lib/works';

const SP = process.argv[2];
if (!SP) throw new Error('usage: vite-node scripts/render-faces.ts <outdir> [slug]');
const slug = process.argv[3] ?? 'hidenaga';
const FACE_SPEC = resolveWork(slug).faces;

const ids = Object.keys(FACE_SPEC).filter((k) => k !== '_default');
const cols = 5;
const cell = 190;
const label = 26;
const rowH = cell + 64 + label; // 大円 + 小円/正方形の段 + ラベル
const rows = Math.ceil(ids.length / cols);
const W = cols * cell;
const H = rows * rowH + 8;

function inner(id: string): string {
  return faceArt(id, FACE_SPEC)
    .replace(/^<svg[^>]*>/, '')
    .replace(/<\/svg>$/, '');
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="#efe9dc"/>`;
let clip = 0;
/** 顔を直径 d の円で切り抜いて (x,y) に置く（faceSvg と同じ cover 配置）。 */
function circleFace(id: string, x: number, y: number, d: number): string {
  const cid = `c${clip++}`;
  const rr = d / 2;
  const k = d / 84;
  return (
    `<circle cx="${x + rr}" cy="${y + rr}" r="${rr}" fill="#fff" stroke="#c9bfa8"/>` +
    `<clipPath id="${cid}"><circle cx="${x + rr}" cy="${y + rr}" r="${rr}"/></clipPath>` +
    `<g clip-path="url(#${cid})"><g transform="translate(${x + rr},${y + rr}) scale(${k}) translate(-50,-51)">${inner(id)}</g></g>`
  );
}
/** カード実寸の正方形（GCard 52px 相当）。 */
function squareFace(id: string, x: number, y: number, d: number): string {
  return (
    `<rect x="${x}" y="${y}" width="${d}" height="${d}" fill="#fff" stroke="#c9bfa8"/>` +
    `<svg x="${x}" y="${y}" width="${d}" height="${d}" viewBox="0 0 100 100">${inner(id)}</svg>`
  );
}

ids.forEach((id, i) => {
  const x = (i % cols) * cell;
  const y = Math.floor(i / cols) * rowH + 8;
  svg += circleFace(id, x + (cell - 158) / 2, y, 158);
  svg += circleFace(id, x + cell / 2 - 56, y + 162, 52);
  svg += squareFace(id, x + cell / 2 + 6, y + 162, 52);
  svg += `<text x="${x + cell / 2}" y="${y + cell + 58}" font-family="sans-serif" font-size="15" text-anchor="middle" fill="#333">${id.replace('p-', '')}</text>`;
});
svg += `</svg>`;
writeFileSync(`${SP}/faces.svg`, svg);
console.log('wrote', `${SP}/faces.svg`);
