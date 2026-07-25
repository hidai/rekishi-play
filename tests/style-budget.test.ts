// 体験予算の機械ゲート（docs/WRITING.md の予算表を全作品に強制する）。
// 対象は WORKS でなく ALL_WORKS＝登録済み＋**未登録の骨組み作品**（tests/helpers/all-works.ts）。
// 執筆は登録前の骨組み期間に進むので、WORKS だけを回すとその間ゲートが空振りする。
// 較正元は hidenaga＝子どもの実反応で「引き込まれる」ことが検証済みの唯一のコーパス
// （実測: シーン最長223字・章486〜793字・注釈≤6/章・主線ヘッジ≤1/章・deep≤168字・付与≤2人）。
// 予算超過は「本文が説明に堕ちている」教科書化ドリフトの機械シグナル（VISION 原則5「体感 > 情報」の機械の腕）。
//
// ⛔ ハード境界: BUDGET のしきい値を緩める・EXEMPT にエントリを足す変更は
// CRITERIA 改訂と同格で人間のみが行う（AI は提案まで）。厳しくする方向は AI が自律で行ってよい。
// 経緯は docs/WRITING.md「成立の経緯」（2026-07-12 観察メモ「教科書的で引き込まれない」）を参照。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import { chapterStats, personCardCount } from '../scripts/content-stats';

const BUDGET = {
  maxSceneText: 300, // 純テキスト字数/シーン
  chapterText: 1000, // 純テキスト字数/章
  glossesPerChapter: 8, // 本文の括弧注釈（…）/章
  hedgesPerChapter: 2, // 主線のヘッジ句（「と伝わる」等）/章
  maxDeepBody: 250, // deep 1枚の字数
  personGrantsPerScene: 2, // onEnter の人物カード付与/シーン
  personCardsPerWork: 16, // 人物カード総数/作品（design 目安）
};

// 既知の予算超過（リライト待ち）。体験化リライトで章ごとにここから消して green にする。
// このリストは減る一方であること（増やす＝緩和＝人間のみ）。
const EXEMPT = new Set<string>([]);

describe('style-budget: 体験予算（WRITING.md）', () => {
  for (const work of ALL_WORKS) {
    it(`${work.id}: 人物カード総数 ≤ ${BUDGET.personCardsPerWork}`, () => {
      expect(personCardCount(work)).toBeLessThanOrEqual(BUDGET.personCardsPerWork);
    });

    for (const st of chapterStats(work)) {
      const key = `${work.id}:${st.chapterId}`;
      if (EXEMPT.has(key)) continue;
      it(`${key}: 章の予算内（scene≤${BUDGET.maxSceneText} ch≤${BUDGET.chapterText} 注釈≤${BUDGET.glossesPerChapter} ヘッジ≤${BUDGET.hedgesPerChapter} deep≤${BUDGET.maxDeepBody} 付与≤${BUDGET.personGrantsPerScene}）`, () => {
        expect(st.maxSceneText, 'シーン本文の最長').toBeLessThanOrEqual(BUDGET.maxSceneText);
        expect(st.textTotal, '章の本文合計').toBeLessThanOrEqual(BUDGET.chapterText);
        expect(st.glosses, '括弧注釈の数').toBeLessThanOrEqual(BUDGET.glossesPerChapter);
        expect(st.hedges, '主線のヘッジ句').toBeLessThanOrEqual(BUDGET.hedgesPerChapter);
        expect(st.maxDeepBody, 'deep 1枚の最長').toBeLessThanOrEqual(BUDGET.maxDeepBody);
        expect(st.maxPersonGrants, '人物カード付与/シーン').toBeLessThanOrEqual(
          BUDGET.personGrantsPerScene,
        );
      });
    }
  }

  it('EXEMPT は実在する work:chapter のみ（タイポ・作品削除の検知）', () => {
    const valid = new Set(
      ALL_WORKS.flatMap((w) => w.story.chapters.map((ch) => `${w.id}:${ch.id}`)),
    );
    for (const key of EXEMPT) expect(valid.has(key), `EXEMPT の ${key} が実在しない`).toBe(true);
  });

  // 自己縮小: EXEMPT の章が予算内に入ったら、この登録を消させる（リストは減る一方を機械で強制）。
  it('EXEMPT に予算内の章が残っていない（リライト完了章は EXEMPT から外す）', () => {
    for (const work of ALL_WORKS) {
      for (const st of chapterStats(work)) {
        const key = `${work.id}:${st.chapterId}`;
        if (!EXEMPT.has(key)) continue;
        const withinBudget =
          st.maxSceneText <= BUDGET.maxSceneText &&
          st.textTotal <= BUDGET.chapterText &&
          st.glosses <= BUDGET.glossesPerChapter &&
          st.hedges <= BUDGET.hedgesPerChapter &&
          st.maxDeepBody <= BUDGET.maxDeepBody &&
          st.maxPersonGrants <= BUDGET.personGrantsPerScene;
        expect(withinBudget, `${key} は予算内なのに EXEMPT に残っている`).toBe(false);
      }
    }
  });
});
