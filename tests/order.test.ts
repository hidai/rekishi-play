// 選択肢の表示順シャッフル（純粋ロジック）検証。
// 順序は変わっても「全 index がちょうど1回ずつ」現れること（データ改変なし）が要。
import { describe, it, expect } from 'vitest';
import { choiceOrder } from '../src/engine/order';

function seq(vals: number[]): () => number {
  let i = 0;
  return () => vals[i++ % vals.length];
}

describe('choiceOrder', () => {
  it('0..n-1 の並べ替え（全 index が1回ずつ）', () => {
    for (const n of [0, 1, 2, 3, 4]) {
      const o = choiceOrder(n, Math.random);
      expect([...o].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });

  it('rnd 注入で決定的', () => {
    // Fisher–Yates で rnd()=0 は毎回 j=0 と交換する。
    expect(choiceOrder(2, seq([0]))).toEqual([1, 0]);
    expect(choiceOrder(4, seq([0]))).toEqual([1, 2, 3, 0]);
  });

  it('rnd が最大側なら元の順のまま（j===i）', () => {
    expect(choiceOrder(4, seq([0.999]))).toEqual([0, 1, 2, 3]);
  });

  it('二択が両方の順で出うる', () => {
    expect(choiceOrder(2, seq([0.9]))).toEqual([0, 1]);
    expect(choiceOrder(2, seq([0.1]))).toEqual([1, 0]);
  });
});
