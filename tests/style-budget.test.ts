// 体験予算の機械ゲート（docs/WRITING.md の予算表を全作品に強制する）。
// 対象は WORKS でなく ALL_WORKS＝登録済み＋**未登録の骨組み作品**（tests/helpers/all-works.ts）。
// 執筆は登録前の骨組み期間に進むので、WORKS だけを回すとその間ゲートが空振りする。
// 較正元は hidenaga＝子どもの実反応で「引き込まれる」ことが検証済みの唯一のコーパス
// （実測: シーン最長223字・章486〜793字・注釈≤6/章・主線ヘッジ≤1/章・deep≤168字・付与≤2人）。
// 予算超過は「本文が説明に堕ちている」教科書化ドリフトの機械シグナル（VISION 原則5「体感 > 情報」の機械の腕）。
//
// ⛔ ハード境界: BUDGET のしきい値を緩める・EXEMPT にエントリを足す・**LOAD_LEDGER の値を
// 引き上げる**（＝登録章の予算を実質ゆるめる）変更は CRITERIA 改訂と同格で人間のみが行う
// （AI は提案まで）。厳しくする方向は AI が自律で行ってよい。機械は「帳簿＝実測」しか見ないので、
// 本文を重くしてから帳簿を合わせる手は green のまま通る——止めているのはこの境界のほう。
// 経緯は docs/WRITING.md「成立の経緯」（2026-07-12 観察メモ「教科書的で引き込まれない」）を参照。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import { chapterStats, personCardCount } from '../scripts/lib/content-stats';

const BUDGET = {
  maxSceneText: 300, // 純テキスト字数/シーン
  chapterText: 1000, // 純テキスト字数/章
  glossesPerChapter: 8, // 本文の括弧注釈（…）/章
  hedgesPerChapter: 2, // 主線のヘッジ句（「と伝わる」等）/章
  maxDeepBody: 250, // deep 1枚の字数
  personGrantsPerScene: 2, // onEnter の人物カード付与/シーン
  personCardsPerWork: 16, // 人物カード総数/作品（design 目安）
  maxSceneLoad: 420, // 1シーンを抜けるのに読む最大量（本文＋内語＋spark＋問い＋信条＋hist）
};

// 既知の予算超過（リライト待ち）。体験化リライトで章ごとにここから消して green にする。
// このリストは減る一方であること（増やす＝緩和＝人間のみ）。
const EXEMPT = new Set<string>([]);

/**
 * maxSceneLoad の帳簿（ラチェット）。既存7作の実測値で、**増やせない**。
 *  ・登録の無い章（新章・新作品）は BUDGET.maxSceneLoad が要求される＝これから書くものは最初から守る。
 *  ・下げたら「帳簿も下げよ」で落ちる＝リライトと同じサイクルで数字が減る（下は下限つき）。
 * EXEMPT（免除）ではなく帳簿なので、しきい値の緩和ではない——登録章も現状より重くはできない。
 * 現物は `npx vite-node scripts/content-stats.ts <作品slug>`（重い章の scene id も出る）。
 *
 * なぜ 420 か: 較正元 hidenaga の実測上限（292〜420）そのままで、他の予算のような伸びしろを
 * 足していない。この指標は「引き込まれない」の一次要因として名指しされた〈用量〉の計器で
 * （design/engagement.md §10・秀長334字/画面 ⇄ 清盛566字/画面）、伸びしろを足すと計器が
 * その原因のほうを追認してしまう。
 */
const LOAD_LEDGER: Record<string, number> = {
  // kiyomori: 6章（最重 7-a2 489）。ch5 は 571→414 で削除（5-c を分割・2026-08-02）、
  //   呼び名を「院」に統一して 407 へ（2026-08-03。同じ回に ch2 も 466→450）。
  'kiyomori:1': 483, 'kiyomori:2': 450, 'kiyomori:3': 454, 'kiyomori:4': 431,
  'kiyomori:6': 444, 'kiyomori:7': 489,
  // ieyasu: 4章（最重 4-b 562）。ch1 は 528→364 で削除（1-c を分割・2026-08-02）。
  'ieyasu:3': 465, 'ieyasu:4': 562, 'ieyasu:5': 541, 'ieyasu:6': 510,
  // masako: 4章
  'masako:3': 468, 'masako:4': 426, 'masako:5': 481, 'masako:6': 472,
  // shibusawa: 4章
  'shibusawa:2': 441, 'shibusawa:3': 430, 'shibusawa:5': 459, 'shibusawa:7': 441,
  // davinci: 1章
  'davinci:4': 449,
  // hidenaga（較正元）・katsu は登録なし＝予算内。
};

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

      const ledger = LOAD_LEDGER[key];
      it(`${key}: 1シーンの読む量 ≤ ${ledger ?? BUDGET.maxSceneLoad}${ledger ? '（帳簿）' : ''}`, () => {
        expect(st.maxSceneLoad, `最重シーンは ${st.maxSceneLoadId}`).toBeLessThanOrEqual(
          ledger ?? BUDGET.maxSceneLoad,
        );
      });
    }
  }

  it('LOAD_LEDGER は実在の章のみ・予算超過のものだけ（下げ切った章は削除する）', () => {
    const stats = new Map(
      ALL_WORKS.flatMap((w) => chapterStats(w).map((st) => [`${w.id}:${st.chapterId}`, st])),
    );
    for (const [key, recorded] of Object.entries(LOAD_LEDGER)) {
      const st = stats.get(key);
      expect(st, `LOAD_LEDGER の ${key} が実在しない`).toBeDefined();
      expect(recorded, `${key} は予算内なので LOAD_LEDGER から消す`).toBeGreaterThan(
        BUDGET.maxSceneLoad,
      );
      expect(st!.maxSceneLoad, `${key} の帳簿が実測とズレている（下げたぶんだけ帳簿も下げる）`).toBe(
        recorded,
      );
    }
  });

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
