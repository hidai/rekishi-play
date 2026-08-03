// 主ビジュアルの文字が、画面上で何 CSS px に着地するかを実測して並べる診断（fail はしない）。
// 「地図の文字が小さくて読めない」は型チェックにもテストにも映らない——単位が地図単位のままだから。
// ここは全シーンの font-size を CSS px に直して、本文（.scene-text 18.5px / 端末 17.5px）と並べる。
//
// 使い方: npx vite-node scripts/text-scale-audit.ts [作品slug] [表示幅=680,358]
//   例:   npx vite-node scripts/text-scale-audit.ts            # 全作・PC 幅と携帯幅
//         npx vite-node scripts/text-scale-audit.ts shibusawa 358
import { buildMainVisual } from '../src/engine/mainVisual';
import { DISPLAY_REF_W } from '../src/engine/map/sceneMap';
import { WORKS } from '../src/works';

const BODY_PX = 18.5; // .scene-text（本文）＝読者が「ふつうの大きさ」と感じる基準
const FLOOR_PX = 11; // これを下回る文字は、読める前提で置いてはいけない

const argv = process.argv.slice(2);
const slug = argv[0] && !/^\d/.test(argv[0]) ? argv[0] : undefined;
const widths = (argv.find((a) => /^\d/.test(a)) ?? `${DISPLAY_REF_W},358`).split(',').map(Number);
const works = WORKS.filter((w) => !slug || w.id === slug);

type Hit = { key: string; kind: string; cls: string; px: number; text: string };

function scan(svg: string, displayW: number, key: string, kind: string): Hit[] {
  const vb = /viewBox="([^"]+)"/.exec(svg);
  if (!vb) return [];
  const bw = Number(vb[1].split(/\s+/)[2]);
  const perUnit = displayW / bw; // 1 地図単位 = 何 CSS px
  const hits: Hit[] = [];
  for (const m of svg.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/g)) {
    const fs = Number(/font-size="([\d.]+)"/.exec(m[1])?.[1] ?? NaN);
    if (!isFinite(fs)) continue;
    hits.push({
      key,
      kind,
      cls: /class="([^"]+)"/.exec(m[1])?.[1] ?? '(無印)',
      px: Math.round(fs * perUnit * 10) / 10,
      text: m[2].replace(/<[^>]*>/g, '').trim().slice(0, 14),
    });
  }
  return hits;
}

for (const displayW of widths) {
  const hits: Hit[] = [];
  for (const w of works)
    for (const c of w.story.chapters)
      for (const [id, s] of Object.entries(c.scenes)) {
        const kind = s.closeup ? 'closeup' : s.figure ? 'figure' : s.study ? 'study' : 'map';
        hits.push(...scan(buildMainVisual(w, c.id, id, s, displayW), displayW, `${w.id}:${c.id}:${id}`, kind));
      }
  const byReg = new Map<string, Hit[]>();
  for (const h of hits) {
    const k = `${h.kind}/${h.cls}`;
    (byReg.get(k) ?? byReg.set(k, []).get(k)!).push(h);
  }
  console.log(`\n===== 表示幅 ${displayW}px（本文 ${BODY_PX}px を 1.00 とする） =====`);
  console.log('登録面'.padEnd(20) + '  件数   最小  中央  最大   床(11px)未満');
  for (const [k, v] of [...byReg].sort()) {
    const px = v.map((h) => h.px).sort((a, b) => a - b);
    const med = px[Math.floor(px.length / 2)];
    const under = px.filter((p) => p < FLOOR_PX).length;
    console.log(
      `${k.padEnd(22)} n=${String(v.length).padEnd(4)} ${px[0].toFixed(1).padStart(5)}` +
        `${med.toFixed(1).padStart(6)}${px[px.length - 1].toFixed(1).padStart(6)}   ` +
        `${under ? `${((under / px.length) * 100).toFixed(0)}% ⚠️` : '—'}  (中央の本文比 ${(med / BODY_PX).toFixed(2)})`,
    );
  }
  const under = hits.filter((h) => h.px < FLOOR_PX);
  if (under.length) {
    console.log(`\n-- ${FLOOR_PX}px 未満の実例（先頭10件）--`);
    for (const h of under.slice(0, 10))
      console.log(`  ${h.px.toFixed(1)}px  ${h.kind}/${h.cls}  ${h.key}  「${h.text}」`);
    console.log(`  … 計 ${under.length} 件`);
  }
}
