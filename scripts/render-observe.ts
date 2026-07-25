// ★Q 観察ビューを SVG で書き出す開発用スクリプト。
// シーンのメインビジュアル（SceneScreen と同じ選択規則）に observe のオーバーレイを
// 重ねた1枚を書き出す。実行時は2枚を絶対配置で重ねるが、どちらも主ビジュアルの
// viewBox で描くので座標は一致する（ここでは中身を絵に差し込んで1ファイルにする）。
//
// hotspot の座標は正規化（0..1）＝絵を見ながら決めるしかない。gaz の地点と同じで、
// このスクリプトが唯一の物差しになる。
//
// 使い方: npx vite-node scripts/render-observe.ts <出力.svg> [章] [シーンid] [slug] [--lens x,y] [--found a,b] [--demo] [--raw]
// 例:     npx vite-node scripts/render-observe.ts /tmp/ob.svg 1 1-a hidenaga --demo --lens 0.5,0.55
import { writeFileSync, readFileSync } from 'node:fs';
import { buildMainVisual } from '../src/engine/mainVisual';
import { buildObserveOverlay, parseFrame } from '../src/engine/art/observe';
import type { ObserveSpec } from '../src/engine/types';
import { staticizeSvg } from './lib/static-css';
import { resolveWork } from './lib/works';

/**
 * 出荷データにまだ observe が無い間、装置そのものを目で確かめるための合成スペック
 * （dev ツール限定＝作品データを汚さない）。gate・essential・任意の3種を1枚に含む。
 */
const DEMO: ObserveSpec = {
  prompt: 'この 絵の 中で、いま 気に なる ものは？',
  hotspots: [
    { id: 'demo-a', x: 0.27, y: 0.46, r: 0.075, caption: 'ひだり がわの もの', essential: true },
    { id: 'demo-b', x: 0.73, y: 0.44, r: 0.075, caption: 'みぎ がわの もの', essential: true },
    { id: 'demo-c', x: 0.5, y: 0.78, r: 0.06, caption: 'あとから 見えて くる もの', gatedOn: 'demo-a' },
  ],
};

const flag = (name: string) => process.argv.includes(name);
function opt(name: string): string | null {
  const i = process.argv.indexOf(name);
  return i >= 0 ? (process.argv[i + 1] ?? null) : null;
}

const raw = flag('--raw');
const demo = flag('--demo');
const argv = process.argv
  .slice(2)
  .filter((a, i, all) => !a.startsWith('--') && all[i - 1] !== '--lens' && all[i - 1] !== '--found');
const out = argv[0];
if (!out) {
  throw new Error(
    'usage: vite-node scripts/render-observe.ts <out.svg> [ch] [sceneId] [slug] [--lens x,y] [--found a,b] [--demo] [--raw]',
  );
}
const ch = parseInt(argv[1] ?? '1', 10);
const slug = argv[3] ?? 'hidenaga';
const work = resolveWork(slug);
const sceneId = argv[2] ?? work.story.chapters.find((c) => c.id === ch)!.start;
const sc = work.story.chapters.find((c) => c.id === ch)?.scenes[sceneId];
if (!sc) throw new Error(`no scene ${sceneId} in ${slug} ch${ch}`);

const spec = sc.observe ?? (demo ? DEMO : null);
if (!spec) {
  throw new Error(
    `${slug} ch${ch} ${sceneId} has no Scene.observe. Pass --demo to overlay the synthetic demo spec.`,
  );
}

const lensArg = opt('--lens');
const lens = lensArg
  ? { x: Number(lensArg.split(',')[0]), y: Number(lensArg.split(',')[1]) }
  : undefined;
if (lens && (!Number.isFinite(lens.x) || !Number.isFinite(lens.y))) {
  throw new Error(`--lens wants "x,y" in 0..1, got "${lensArg}"`);
}
const found = (opt('--found') ?? '').split(',').filter(Boolean);

// SceneScreen と同じ主ビジュアル選択規則（observe は絵を置き換えず、上に重なる）。
let svg = buildMainVisual(work, ch, sceneId, sc);

const frame = parseFrame(svg);
if (!frame) throw new Error('main visual has no readable viewBox');
const overlay = buildObserveOverlay(sceneId, spec, found, frame, lens);
const inner = overlay.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
svg = svg.replace(/<\/svg>\s*$/, `${inner}</svg>`);

if (!raw) svg = staticizeSvg(svg, readFileSync(new URL('../src/app.css', import.meta.url), 'utf8'));
writeFileSync(out, svg);
console.log(
  'wrote',
  out,
  `(${slug} ch${ch} ${sceneId}${spec === DEMO ? ' DEMO spec' : ''}, ${spec.hotspots.length} hotspots,` +
    ` lens=${lens ? `${lens.x},${lens.y}` : 'none'}, found=[${found.join(' ')}], ${svg.length} bytes)`,
);
