// シーンのメインビジュアルを SVG で書き出す開発用スクリプト。
// シーンが closeup（★O 対面の場）を持てばそれを、なければ figure / 読み解き地図を書き出す
// （SceneScreen と同じ選択規則）。
// 出力は自己完結 SVG: テーマの var()/color-mix() をライトテーマの literal 色に解決し、
// 読み解き地図には .scene-map クラススタイルを <style> として埋め込む（scripts/lib/static-css.ts）。
// librsvg は var()/color-mix() を黒で塗るため、この解決なしではラスタ自己点検ができない。
// --raw を付けるとブラウザ向けと同一のエンジン出力（未解決）をそのまま書き出す。
// 使い方: npx vite-node scripts/render-scene.ts <出力ファイル.svg> [章] [シーンid] [work-slug=hidenaga] [--raw]
// 例:     npx vite-node scripts/render-scene.ts /tmp/scene.svg 7 7-a2
//         npx vite-node scripts/render-scene.ts /tmp/scene.svg 3 3-a katsu
import { writeFileSync, readFileSync } from 'node:fs';
import { buildMainVisual } from '../src/engine/mainVisual';
import { staticizeSvg } from './lib/static-css';
import { resolveWork } from './lib/works';

const raw = process.argv.includes('--raw');
const argv = process.argv.slice(2).filter((a) => a !== '--raw');
const out = argv[0];
if (!out) throw new Error('usage: vite-node scripts/render-scene.ts <out.svg> [ch] [sceneId] [slug] [--raw]');
const ch = parseInt(argv[1] ?? '1', 10);
const slug = argv[3] ?? 'hidenaga';
const work = resolveWork(slug);
const scene = argv[2] ?? work.story.chapters.find((c) => c.id === ch)!.start;

const s = work.story.chapters.find((c) => c.id === ch)?.scenes[scene];
if (!s) throw new Error(`no scene ${scene} in ${slug} ch${ch}`);
let svg = buildMainVisual(work, ch, scene, s);
if (!raw) svg = staticizeSvg(svg, readFileSync(new URL('../src/app.css', import.meta.url), 'utf8'));
writeFileSync(out, svg);
const kind = s.closeup ? ' closeup' : s.figure ? ' figure' : s.study ? ' study' : '';
console.log('wrote', out, `(${slug} ch${ch} ${scene}${kind}${raw ? ' raw' : ''}, ${svg.length} bytes)`);
