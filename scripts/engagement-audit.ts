// 引き込みの棚卸し（診断レポート。ゲートではない＝しきい値も fail も無い）。
//
// 背景: 観察メモ 2026-07-28「全体的に、あまり引き込まれない」。既存の機械ゲートは
// 衛生（字数・ルビ・前提語・到達可能性）しか測っておらず、主導権・起伏・動機は
// 一つも測っていない（docs/design/engagement.md §7）。この棚卸しは「測っていなかった量」を
// 数字にして、要因の深掘りをセッションをまたいで再現可能にするためのもの。
//
// 使い方: npx vite-node scripts/engagement-audit.ts [作品slug]
import { WORKS } from '../src/works/index';
import { resolveWork } from './lib/works';
import type { Work } from '../src/engine/types';

const chars = (s: unknown) =>
  String(s ?? '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '').replace(/\s/g, '').length;

interface Row {
  id: string;
  scenes: number;
  body: number;
  appar: number;
  choicePts: number;
  diverge: number;
  blocks: number;
  hands: number;
  closeups: number;
  exprScenes: number;
  toFirstText: number;
  toFirstChoice: number;
}

function audit(w: Work): Row {
  let scenes = 0, body = 0, appar = 0, choicePts = 0, diverge = 0, blocks = 0, hands = 0, closeups = 0;
  let exprScenes = 0;
  for (const ch of w.story.chapters) {
    for (const id of Object.keys(ch.scenes)) {
      const s = ch.scenes[id] as Record<string, any>;
      scenes++;
      body += chars(s.text) + chars(s.monologue);
      appar += chars(s.spark) + chars(s.deep?.q) + chars(s.deep?.body) + chars(s.deep?.cite);
      appar += chars(s.creed?.line) + chars(s.creed?.act);
      let b = 1;
      if (s.spark) b++;
      if (s.deep) b++;
      if (s.creed) b++;
      if (s.closeup) {
        b++;
        closeups++;
        if (s.closeup.cast?.some((c: any) => c.expr)) exprScenes++;
      }
      if (s.minigame || s.observe) hands++;
      if (s.choices) {
        b++;
        choicePts++;
        if (new Set(s.choices.map((c: any) => c.to)).size > 1) diverge++;
        for (const c of s.choices) appar += chars(c.hist?.match) + chars(c.hist?.body) + chars(c.hist?.source?.note);
      }
      blocks += b;
    }
  }
  // 章一で、最初の「選ぶ」に着くまでに読む画面数。
  const ch1 = w.story.chapters[0];
  let id: string | undefined = ch1.start, n = 0, toFirstChoice = 0;
  const seen = new Set<string>();
  while (id && !seen.has(id)) {
    seen.add(id);
    n++;
    const s = ch1.scenes[id] as Record<string, any>;
    if (s.choices) { toFirstChoice = n; break; }
    id = s.next;
  }
  return {
    id: w.id, scenes, body, appar, choicePts, diverge, blocks, hands, closeups, exprScenes,
    // 作品えらび → タイトル →（はじめる）→ 第1章。初見は年代記（7章の目次）を通らない
    // （engagement.md §2 A-3 で外した。再訪は年代記のまま）。engine 固定なので定数。
    toFirstText: 2,
    toFirstChoice,
  };
}

const only = process.argv[2];
const works = only ? [resolveWork(only)] : WORKS;

console.log('■ 引き込みの棚卸し（診断のみ・合否は出さない）\n');
for (const w of works) {
  const r = audit(w);
  const total = r.body + r.appar;
  console.log(`【${r.id}】 ${r.scenes}画面`);
  console.log(`  主導権 : 岐路 ${r.choicePts}個 / 実際に道が分かれる岐路 ${r.diverge}個` +
    `（${r.diverge === 0 ? '★どれを選んでも同じ画面へ合流' : ''}）`);
  console.log(`  読む量 : 本文 ${r.body} ＋ 装置 ${r.appar} ＝ ${total}字（装置 ${Math.round((r.appar / total) * 100)}%）` +
    `／体験予算が数えているのは本文だけ`);
  console.log(`  画面   : 1画面あたりの要素 ${(r.blocks / r.scenes).toFixed(1)}個`);
  console.log(`  手を動かす場面 : ${r.hands}/${r.scenes}画面`);
  console.log(`  対面の絵 : ${r.closeups}枚／うち場面ごとの表情指定 ${r.exprScenes}枚`);
  console.log(`  入口   : 物語の1文目まで ${r.toFirstText}画面、最初の「選ぶ」まで ${r.toFirstText + r.toFirstChoice}画面\n`);
}
