// ★前提知識のゲート。規則は docs/WRITING.md 11「前提は作品の中で着せる」
// （検査の実装と面の定義は scripts/lib/premise-audit.ts のヘッダ、設計は docs/design/known-premise.md）。
//
// なぜ要るか: 大人のフィードバックが「すでにその人物を知っている読者を前提にしている」を突き、
// 実測すると既知前提マーカーは7作で 63 件あった。一方、新しい2作（masako/shibusawa）の反転型 spark は
// 30本中1本＝**執筆はすでに正しい方へ着いていたのに、どの文書もそれを名前で呼ばなかった**。
// 名前を持たない規律は次作で必ず再発する。ここで名前と帳簿を与える。
//
// ラチェット式（ruby-furigana.test.ts と同じ idiom）: BASELINE は棚卸し待ちの帳簿で、増やせない。
//  ・登録の無いバケツ（新しい章・新しい作品）は 0 でなければ落ちる＝これから書くものは最初から守る。
//  ・直したら数が減って落ちる＝同じサイクルで帳簿を下げさせる（リストは減る一方）。
// マーカーは proxy＝**床**であって、通説をマーカー無しで語る本文は見えない（天井は /eval-work のペルソナ）。
// **0 件は「前提依存 0」ではない**: kiyomori 5-a はマーカーを消したら、裏返す相手（告発）まで本文から
// 消えて deep へ潜り、初見の読者が通説を外から補うしかない形に悪化した（2026-07-28（5）・eval が捕捉）。
// 語句の置換ではなく「だれが着せたか」を書き直すこと。作中世界の群衆描写（「だれもが 目を うたがう」）は
// そもそも規則の対象外＝直す必要はない（残すなら ALLOWED_PREMISE へ理由つきで）。
// 審査して「残す」と決めた面は `ALLOWED_PREMISE`（scripts/lib/premise-audit.ts）へ理由1行つきで移す
// ＝この BASELINE は「未修正の帳簿」だけを持つ。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import {
  ALLOWED_PREMISE,
  allowKeyCounts,
  auditBuckets,
  auditSurface,
  auditWork,
  spineSurface,
} from '../scripts/lib/premise-audit';
import { bucketOf } from '../scripts/lib/ruby-audit';

/**
 * 既知の既知前提マーカー（棚卸し待ち）。キーは `作品:章` と `作品:spine` / `:card` / `:clue` …。
 * **未登録のキーは 0 が要求される**（新章・新作品はここに追加せず、書くときに守る）。
 * 現物は `npx vite-node scripts/premise-audit.ts <作品slug>` で面ごとに列挙できる。
 */
const BASELINE: Record<string, number> = {
  // hidenaga: 6 件（背骨は掃き出し済み＝謎は「信長や 秀吉の 名は のこり、秀長の 名は のこらなかった」へ。
  // 残りは A 型 spark（ch2/ch4/ch6）とカード）
  'hidenaga:ch2': 2, 'hidenaga:ch4': 1, 'hidenaga:ch6': 1, 'hidenaga:card': 2,
  // kiyomori: 0 件（③ A型仕分けで章の面は掃き出し済み。7-b#deep の潮流説は学説史ゆえ ALLOWED_PREMISE へ）
  // katsu: 3 件（海舟本人が語った話を後で相対化する＝作中人物の口に載った型が多い）
  'katsu:ch1': 2, 'katsu:ch5': 1,
  // ieyasu: 2 件（③ A型仕分けで章の面と clue は掃き出し済み＝残りはカードの面だけ。
  // 「語られてきた」5件は違反でなく帰属ヘッジ＝ALLOWED_PREMISE へ移した）
  'ieyasu:card': 2,
  // davinci: 8 件
  'davinci:ch2': 1, 'davinci:ch6': 2, 'davinci:ch7': 1, 'davinci:card': 4,
  // masako: 7 件（1-b は未プレイ章の山場を先食いしている＝D 型）
  'masako:ch1': 2, 'masako:ch6': 2, 'masako:card': 1, 'masako:clue': 2,
  // shibusawa: 1 件
  'shibusawa:clue': 1,
};

describe('known-premise: 通説は作品の中で着せてから裏返す', () => {
  for (const work of ALL_WORKS) {
    const found = auditBuckets(work);
    const byBucket = new Map<string, ReturnType<typeof auditWork>>();
    for (const h of auditWork(work).filter((h) => !h.allowed)) {
      const key = `${work.id}:${bucketOf(h.surface)}`;
      byBucket.set(key, [...(byBucket.get(key) ?? []), h]);
    }
    const keys = [
      ...new Set([
        ...Object.keys(found).map((b) => `${work.id}:${b}`),
        ...Object.keys(BASELINE).filter((k) => k.startsWith(`${work.id}:`)),
      ]),
    ].sort();
    for (const key of keys) {
      const allowed = BASELINE[key] ?? 0;
      it(`${key}: 既知前提マーカー ${allowed} 件のまま（増やさない・直したら帳簿を下げる）`, () => {
        const hits = byBucket.get(key) ?? [];
        expect(
          hits.length,
          allowed === 0
            ? `作品の外の知識に寄りかかっている:\n${hits.map((h) => `  ${h.surface} 「${h.marker}」 …${h.excerpt}…`).join('\n')}`
            : `BASELINE['${key}'] を ${hits.length} に直す（npx vite-node scripts/premise-audit.ts ${work.id}）`,
        ).toBe(allowed);
      });
    }
  }

  // 許可表も帳簿と同じく腐る: 面を書き直してマーカーが消えたのに理由だけ残ると、次に同じ語を
  // 書いたとき無審査で通る（許可の意味が「審査したその1件」から「その語ぜんぶ」へ静かに広がる）。
  // ゆえに件数まで突き合わせる＝過不足どちらも赤にする。
  it('ALLOWED_PREMISE が実データと1件ずつ合う（消えた許可も、無審査で増えた1件も赤にする）', () => {
    const live = allowKeyCounts(ALL_WORKS);
    expect(Object.fromEntries(Object.entries(ALLOWED_PREMISE).map(([k, v]) => [k, v.n]))).toEqual(
      live,
    );
  });

  it('BASELINE に死んだ登録が無い（作品・章が消えたら掃除する・キーの名前空間ずれの検知）', () => {
    const live = new Set(
      ALL_WORKS.flatMap((w) => Object.keys(auditBuckets(w)).map((b) => `${w.id}:${b}`)),
    );
    expect(Object.keys(BASELINE).filter((k) => !live.has(k))).toEqual([]);
  });

  // 空回りの防止（ruby ゲートは初版がキーの prefix 欠落で green のまま何も守っていなかった）:
  // マーカーを注入した面が実際に赤くなること、背骨の面が走査に載っていることを直に確かめる。
  it('注入した既知前提を検出する（マーカー・背骨・ルビ越し）', () => {
    expect(
      auditSurface({ id: 'ch9/9-z', parts: ['<ruby>有名<rt>ゆうめい</rt></ruby>な 話だ'] }),
    ).toHaveLength(1);
    expect(auditSurface({ id: 'ch9/9-z', parts: ['だれも 知らない 話だ'] })).toEqual([]);
    for (const work of ALL_WORKS)
      expect(spineSurface(work).parts.join('').length, `${work.id} の背骨が空`).toBeGreaterThan(20);
    expect(bucketOf(spineSurface(ALL_WORKS[0]).id)).toBe('spine');
  });
});
