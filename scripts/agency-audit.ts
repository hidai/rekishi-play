// ★型9 の棚卸し＝「人が人に向かって何かをする」画面が、章のどこに無いか（診断のみ・合否は出さない）。
//
// 使い方: npx vite-node scripts/agency-audit.ts [作品slug]
//
// 読み方は docs/design/engagement.md §17 ＋ scripts/lib/agency-audit.ts のヘッダ。
// 見るのは個別画面の◯×ではなく **章の中の「空白のラン」**——とくに章の頭のラン（読者が
// 「この章はもういいか」を決める位置）。
import { WORKS } from '../src/works/index';
import { resolveWork } from './lib/works';
import { auditWork } from './lib/agency-audit';

const only = process.argv[2];
const works = only ? [resolveWork(only)] : WORKS;

console.log('■ 相手のいる行為の棚卸し（診断のみ・合否は出さない）');
console.log('   ○＝向きのある行為＋声が合わせて2つ以上／・＝1つ以下の画面\n');

const worst: { at: string; head: number; gap: number; n: number }[] = [];
const spoken: { at: string; voices: number; addressed: number; n: number }[] = [];
for (const w of works) {
  console.log(`【${w.id}】`);
  for (const ch of auditWork(w)) {
    const marks = ch.scenes.map((s) => (s.engaged ? '○' : '・')).join('');
    console.log(
      // 全角の ○／・ は表示幅2＝`padEnd` の文字数基準では列がずれる（半角スペースで幅をそろえる）。
      `  章${ch.chapterId} ${marks}${' '.repeat(Math.max(0, 14 - marks.length * 2))} ${ch.engaged}/${ch.scenes.length}画面` +
        `　頭のラン ${ch.headGap}　最長ラン ${ch.longestGap}` +
        // ★型10 の列＝その章の声のうち、きみに宛てられたもの（宛先を見ない ○ と混ぜない）。
        // 頭＝きみが最初に話しかけられるまでの画面数。
        `　宛 ${ch.addressed}/${ch.voices}声(頭${ch.addressedHeadGap})　${ch.title}`,
    );
    for (const s of ch.scenes)
      if (!s.engaged)
        console.log(
          `        ・${s.id}  声${s.voices}　行為[${s.acts.join(' ')}]` +
            // 手が動く装置は「相手のいる行為」ではないが、死んだ画面でもない（§14 の
            // ダビンチ 1-b 観察ビュー＝「いちばん楽しかった」）。混同しないよう並べて出す。
            (s.hands ? '　✋手が動く' : ''),
        );
    for (const s of ch.scenes)
      if (s.addressed > 0) console.log(`        ◎${s.id}  きみに宛てた声 ${s.addressed}/${s.voices}`);
    worst.push({ at: `${w.id}:${ch.chapterId}`, head: ch.headGap, gap: ch.longestGap, n: ch.scenes.length });
    spoken.push({ at: `${w.id}:${ch.chapterId}`, voices: ch.voices, addressed: ch.addressed, n: ch.scenes.length });
  }
  console.log('');
}

if (works.length > 1) {
  console.log('■ 頭のランが長い章（＝読者が最初に「もういいか」と思う位置）');
  for (const r of worst.sort((a, b) => b.head - a.head || b.gap - a.gap).slice(0, 12))
    console.log(`  ${r.at.padEnd(12)} 頭 ${r.head}/${r.n}　最長 ${r.gap}`);

  console.log('\n■ ★型10 きみに宛てられた声（作品ごと）');
  for (const w of works) {
    const rows = spoken.filter((r) => r.at.startsWith(`${w.id}:`));
    const a = rows.reduce((n, r) => n + r.addressed, 0);
    const v = rows.reduce((n, r) => n + r.voices, 0);
    const n = rows.reduce((s, r) => s + r.n, 0);
    const zero = rows.filter((r) => r.addressed === 0).map((r) => r.at.split(':')[1]);
    console.log(
      `  ${w.id.padEnd(10)} 宛 ${String(a).padStart(2)}/${String(v).padStart(2)}声` +
        `（声の ${String(Math.round((a / Math.max(1, v)) * 100)).padStart(3)}%・全${n}画面）　` +
        `宛先ゼロの章 ${zero.length}/${rows.length} [${zero.join(' ')}]`,
    );
  }
}
