// ★型9 の棚卸し＝「人が人に向かって何かをする」画面が、章のどこに無いか（診断のみ・合否は出さない）。
//
// 使い方: npx vite-node scripts/agency-audit.ts [作品slug]
//
// 読み方は docs/design/engagement.md §17 ＋ scripts/lib/agency-audit.ts のヘッダ。
// 見るのは個別画面の◯×ではなく **章の中の「空白のラン」**——とくに章の頭のラン（読者が
// 「この章はもういいか」を決める位置）。
import { WORKS } from '../src/works/index';
import { resolveWork } from './lib/works';
import { auditWork, type AskVerdict } from './lib/agency-audit';

const ASK_LABEL: Record<AskVerdict, string> = {
  closed: '同じ画面で答えた',
  choice: 'この画面の岐路',
  carried: '★次の画面の岐路へ持ち越し',
  dropped: '答えなし・岐路なし',
};

const only = process.argv[2];
const works = only ? [resolveWork(only)] : WORKS;

console.log('■ 相手のいる行為の棚卸し（診断のみ・合否は出さない）');
console.log('   ○＝向きのある行為＋声が合わせて2つ以上／・＝1つ以下の画面\n');

const worst: { at: string; head: number; gap: number; n: number }[] = [];
const spoken: { at: string; voices: number; addressed: number; n: number }[] = [];
const asked: { at: string; title: string; asks: Record<AskVerdict, number> }[] = [];
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
      if (s.addressed > 0)
        console.log(
          `        ◎${s.id}  きみに宛てた声 ${s.addressed}/${s.voices}` +
            // ★型11＝その中で返事を要求する声が、どこで答えられるか。
            (s.askVerdict
              ? `　問い${s.demands}→${ASK_LABEL[s.askVerdict]}（問いのあと${s.tailAfterAsk}段落）`
              : ''),
        );
    worst.push({ at: `${w.id}:${ch.chapterId}`, head: ch.headGap, gap: ch.longestGap, n: ch.scenes.length });
    spoken.push({ at: `${w.id}:${ch.chapterId}`, voices: ch.voices, addressed: ch.addressed, n: ch.scenes.length });
    asked.push({ at: `${w.id}:${ch.chapterId}`, title: ch.title, asks: ch.asks });
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

  console.log('\n■ ★型11 きみへの問いは、どこで答えられるか（作品ごと）');
  for (const w of works) {
    const rows = asked.filter((r) => r.at.startsWith(`${w.id}:`));
    const sum = (k: AskVerdict) => rows.reduce((n, r) => n + r.asks[k], 0);
    const carried = rows.filter((r) => r.asks.carried > 0).map((r) => r.at.split(':')[1]);
    const all = sum('closed') + sum('choice') + sum('carried') + sum('dropped');
    // ★いちばん大きい穴は「問いの行き先」より前にある＝きみが一度も問われない章。
    const mute = rows.filter((r) => Object.values(r.asks).every((n) => n === 0));
    console.log(
      `  ${w.id.padEnd(10)} 問い ${String(all).padStart(2)}　同画面で答え ${sum('closed')}` +
        `　この画面の岐路 ${sum('choice')}　★持ち越し ${sum('carried')}　流れた ${sum('dropped')}` +
        `　問いゼロの章 ${mute.length}/${rows.length} [${mute.map((r) => r.at.split(':')[1]).join(' ')}]`,
    );
  }

  console.log('\n■ ★型11 きみへの問いがあるのに、一つも読者の手に渡らない章');
  for (const r of asked)
    if (r.asks.closed + r.asks.dropped > 0 && r.asks.carried + r.asks.choice === 0)
      console.log(
        `  ${r.at.padEnd(12)} 同画面で答え ${r.asks.closed}　流れた ${r.asks.dropped}　${r.title}`,
      );
}
