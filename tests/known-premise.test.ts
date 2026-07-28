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
// 審査して「残す」と決めた面が出たら、そのときに理由1行つきの許可表をここに作る（いまは全件が未審査）。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import { auditBuckets, auditSurface, auditWork, spineSurface } from '../scripts/lib/premise-audit';
import { bucketOf } from '../scripts/lib/ruby-audit';

/**
 * 既知の既知前提マーカー（棚卸し待ち）。キーは `作品:章` と `作品:spine` / `:card` / `:clue` …。
 * **未登録のキーは 0 が要求される**（新章・新作品はここに追加せず、書くときに守る）。
 * 現物は `npx vite-node scripts/premise-audit.ts <作品slug>` で面ごとに列挙できる。
 */
const BASELINE: Record<string, number> = {
  // hidenaga: 13 件（riddle そのものが「読んだことのない教科書の不在」を驚けと言っている）
  'hidenaga:spine': 3, 'hidenaga:ch1': 1, 'hidenaga:ch2': 2, 'hidenaga:ch4': 1,
  'hidenaga:ch6': 1, 'hidenaga:ch7': 3, 'hidenaga:card': 2,
  // kiyomori: 13 件
  'kiyomori:ch1': 2, 'kiyomori:ch3': 1, 'kiyomori:ch4': 2, 'kiyomori:ch5': 4,
  'kiyomori:ch6': 3, 'kiyomori:ch7': 1,
  // katsu: 3 件（海舟本人が語った話を後で相対化する＝作中人物の口に載った型が多い）
  'katsu:ch1': 2, 'katsu:ch5': 1,
  // ieyasu: 16 件（最重。各章が「よく知られた家康像」を1枚ずつ剥がす設計の帰結）
  'ieyasu:ch2': 4, 'ieyasu:ch4': 1, 'ieyasu:ch5': 2, 'ieyasu:ch6': 1, 'ieyasu:ch7': 3,
  'ieyasu:card': 4, 'ieyasu:clue': 1,
  // davinci: 10 件
  'davinci:spine': 1, 'davinci:ch2': 1, 'davinci:ch6': 3, 'davinci:ch7': 1, 'davinci:card': 4,
  // masako: 7 件（1-b は未プレイ章の山場を先食いしている＝D 型）
  'masako:ch1': 2, 'masako:ch6': 2, 'masako:card': 1, 'masako:clue': 2,
  // shibusawa: 1 件
  'shibusawa:clue': 1,
};

describe('known-premise: 通説は作品の中で着せてから裏返す', () => {
  for (const work of ALL_WORKS) {
    const found = auditBuckets(work);
    const byBucket = new Map<string, ReturnType<typeof auditWork>>();
    for (const h of auditWork(work)) {
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
