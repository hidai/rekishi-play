// Playtest 2026-07-18: kiyomori/katsu shipped their protagonist (and a side card)
// that NO path granted, so Object.keys(work.cards) completion was structurally
// unreachable — a card the player can never collect, and a permanent unflippable "？"
// in the relation wheel (the 淀殿 class). hidenaga/ieyasu already grant their
// protagonist via the finale answer-check hist.card. This gate hard-asserts COMPLETED
// works never regress to an ungrantable (or dangling) card.
// 2026-07-25 (human review「本当に全部集めることは可能？」): davinci shipped with p-giuliano /
// p-michelangelo defined (face + relation-wheel edge) but granted by no scene = カード 20/22 forever.
// The gate had missed it because COMPLETED still listed only the first four works. Two holes closed:
// every SHIPPED work is now asserted, and "granted" now means granted on a scene the reader can
// REACH (a grant on an orphan scene is dead), with 手がかり covered the same way.
// Works still being authored are deliberately NOT asserted — their cards may
// legitimately precede the scenes that grant them; surface those without failing via
// `npx vite-node scripts/card-reachability.ts`. Add a work to COMPLETED once all its
// chapters are written (mirrors tests/visual-coverage.test.ts).
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import {
  ungrantedCards,
  danglingGrants,
  ungrantedClues,
  danglingClueGrants,
  orphanScenes,
} from '../scripts/lib/card-reachability';

const COMPLETED = ['hidenaga', 'kiyomori', 'katsu', 'ieyasu', 'davinci', 'masako'];

describe('card reachability: 完成作品の全カードが何らかの経路で付与される', () => {
  it('COMPLETED が出荷済み作品を取りこぼしていない（WORKS ⊆ COMPLETED）', () => {
    // 出荷＝WORKS 登録＝全章書けた、なので登録した作品はこのゲートの対象になる。
    expect(WORKS.map((w) => w.id).filter((id) => !COMPLETED.includes(id))).toEqual([]);
  });

  for (const id of COMPLETED) {
    const work = WORKS.find((w) => w.id === id)!;

    it(`${id}: 全シーンが章の start から到達できる（書いたのに遊べないシーンが無い）`, () => {
      expect(work, `${id} が WORKS に無い`).toBeTruthy();
      expect(orphanScenes(work), '到達経路の無いシーン').toEqual([]);
    });

    it(`${id}: 定義した全カードが grantable（コンプリート到達可能）`, () => {
      expect(ungrantedCards(work), '付与経路の無いカード').toEqual([]);
    });

    it(`${id}: 定義した全手がかりが grantable`, () => {
      expect(ungrantedClues(work), '付与経路の無い手がかり').toEqual([]);
    });

    it(`${id}: 付与経路が実在しないカード/手がかりを指していない（dangling grant）`, () => {
      expect(danglingGrants(work), '実在しないカードを付与している経路').toEqual([]);
      expect(danglingClueGrants(work), '実在しない手がかりを付与している経路').toEqual([]);
    });
  }
});
