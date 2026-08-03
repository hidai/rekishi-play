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
for (const w of works) {
  console.log(`【${w.id}】`);
  for (const ch of auditWork(w)) {
    const marks = ch.scenes.map((s) => (s.engaged ? '○' : '・')).join('');
    console.log(
      // 全角の ○／・ は表示幅2＝`padEnd` の文字数基準では列がずれる（半角スペースで幅をそろえる）。
      `  章${ch.chapterId} ${marks}${' '.repeat(Math.max(0, 14 - marks.length * 2))} ${ch.engaged}/${ch.scenes.length}画面` +
        `　頭のラン ${ch.headGap}　最長ラン ${ch.longestGap}　${ch.title}`,
    );
    for (const s of ch.scenes)
      if (!s.engaged)
        console.log(
          `        ・${s.id}  声${s.voices}　行為[${s.acts.join(' ')}]` +
            // 手が動く装置は「相手のいる行為」ではないが、死んだ画面でもない（§14 の
            // ダビンチ 1-b 観察ビュー＝「いちばん楽しかった」）。混同しないよう並べて出す。
            (s.hands ? '　✋手が動く' : ''),
        );
    worst.push({ at: `${w.id}:${ch.chapterId}`, head: ch.headGap, gap: ch.longestGap, n: ch.scenes.length });
  }
  console.log('');
}

if (works.length > 1) {
  console.log('■ 頭のランが長い章（＝読者が最初に「もういいか」と思う位置）');
  for (const r of worst.sort((a, b) => b.head - a.head || b.gap - a.gap).slice(0, 12))
    console.log(`  ${r.at.padEnd(12)} 頭 ${r.head}/${r.n}　最長 ${r.gap}`);
}
