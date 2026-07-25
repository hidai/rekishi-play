// ★R つながり図鑑を SVG で書き出す開発用スクリプト。
//
// 星の居場所は正規化（0..1）＝図を見ながら決めるしかない。gaz の地点・observe の hotspot と
// 同じで、このスクリプトが唯一の物差しになる（重なり・はみ出しは graphErrors が数で守るが、
// 「星座に見えるか」は座標の数値では分からない）。
//
// 使い方: npx vite-node scripts/render-constellation.ts <出力.svg> [slug]
//           [--known a,b] [--made x,y] [--drag from,x,y] [--demo] [--raw]
// 例:     npx vite-node scripts/render-constellation.ts /tmp/c.svg --demo --known mizu,kami,shinzo --made l-mizu-kami
import { writeFileSync, readFileSync } from 'node:fs';
import { buildConstellation, VH, VW } from '../src/engine/art/constellation';
import { knownNodeIds } from '../src/engine/graph';
import type { WorkGraph } from '../src/engine/types';
import { staticizeSvg } from './lib/static-css';
import { resolveWork } from './lib/works';

/**
 * 出荷データにまだ graph が無い間、装置そのものを目で確かめるための合成データ
 * （dev ツール限定＝作品データを汚さない）。気づき3・発明1・分野2＝3種の星をすべて含む。
 */
const DEMO: WorkGraph = {
  fields: [
    { key: 'water', label: '水の こと', color: '#2A4A6B' },
    { key: 'body', label: 'からだの こと', color: '#B23A2E' },
  ],
  nodes: [
    { id: 'mizu', star: 'みずの うず', caption: '水は まわる', field: 'water', x: 0.19, y: 0.22 },
    { id: 'kami', star: 'かみの カール', caption: 'かみも まわる', field: 'body', x: 0.81, y: 0.22 },
    { id: 'shinzo', star: 'しんぞう', caption: '血も まわる', field: 'body', x: 0.5, y: 0.82 },
    { id: 'uzu', star: 'うずの ちから', caption: 'まわる ものは にている', field: 'water', bornOf: ['l1', 'l2'] },
  ],
  links: [
    { id: 'l1', a: 'mizu', b: 'kami', caption: 'にた かたち' },
    { id: 'l2', a: 'mizu', b: 'shinzo', caption: 'にた ながれ' },
  ],
};

const flag = (name: string) => process.argv.includes(name);
function opt(name: string): string | null {
  const i = process.argv.indexOf(name);
  return i >= 0 ? (process.argv[i + 1] ?? null) : null;
}

const OPTS = ['--known', '--made', '--drag'];
const argv = process.argv
  .slice(2)
  .filter((a, i, all) => !a.startsWith('--') && !OPTS.includes(all[i - 1]));
const out = argv[0];
if (!out) {
  throw new Error(
    'usage: vite-node scripts/render-constellation.ts <out.svg> [slug] [--known a,b] [--made x,y] [--drag from,x,y] [--demo] [--raw]',
  );
}

const graph = flag('--demo') ? DEMO : resolveWork(argv[1] ?? 'hidenaga').graph;
if (!graph) {
  throw new Error(`${argv[1] ?? 'hidenaga'} has no work.graph. Pass --demo to draw the synthetic demo graph.`);
}

const made = (opt('--made') ?? '').split(',').filter(Boolean);
// --known は「見つけた気づき」だけを書けばよい（発明は made から自分で生まれる）。
const known = knownNodeIds(graph, new Set((opt('--known') ?? '').split(',').filter(Boolean)), made);

const dragArg = opt('--drag');
let drag;
if (dragArg) {
  const [from, x, y] = dragArg.split(',');
  drag = { from, x: Number(x), y: Number(y) };
  if (!Number.isFinite(drag.x) || !Number.isFinite(drag.y)) {
    throw new Error(`--drag wants "from,x,y" in viewBox units (0..${VW} / 0..${VH}), got "${dragArg}"`);
  }
}

let svg = buildConstellation(graph, known, made, drag);
if (!flag('--raw')) {
  svg = staticizeSvg(svg, readFileSync(new URL('../src/app.css', import.meta.url), 'utf8'));
}
writeFileSync(out, svg);
console.log(
  'wrote',
  out,
  `(${flag('--demo') ? 'DEMO graph' : (argv[1] ?? 'hidenaga')}, ${graph.nodes.length} stars,` +
    ` known=[${[...known].join(' ')}], made=[${made.join(' ')}], drag=${dragArg ?? 'none'}, ${svg.length} bytes)`,
);
