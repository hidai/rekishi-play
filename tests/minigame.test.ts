// ★M 段取りミニゲーム（sort型）の純粋ロジック検証＋作品データ整合。
import { describe, it, expect } from 'vitest';
import { sortDisplayOrder, initSort, pickSort } from '../src/engine/minigame';
import { hidenaga } from '../src/works/hidenaga/index';

function seq(vals: number[]): () => number {
  let i = 0;
  return () => vals[i++ % vals.length];
}

describe('sortDisplayOrder', () => {
  it('0..n-1 の並べ替え（全 index が1回ずつ）', () => {
    for (const n of [2, 3, 4, 6]) {
      const o = sortDisplayOrder(n, Math.random);
      expect([...o].sort((a, b) => a - b)).toEqual(Array.from({ length: n }, (_, i) => i));
    }
  });
  it('偶然「正しい順のまま」になったら崩す（識別順にならない）', () => {
    // rnd=0.999 は Fisher–Yates で identity を作る → 左回転で崩れる。
    expect(sortDisplayOrder(4, seq([0.999]))).toEqual([1, 2, 3, 0]);
    expect(sortDisplayOrder(2, seq([0.999]))).toEqual([1, 0]);
  });
});

describe('pickSort', () => {
  it('正しい順にタップすると placed が進み、最後で done', () => {
    let st = initSort();
    let r = pickSort(st, 0, 3);
    expect(r.correct).toBe(true);
    expect(r.state.placed).toBe(1);
    r = pickSort(r.state, 1, 3);
    expect(r.correct).toBe(true);
    r = pickSort(r.state, 2, 3);
    expect(r.correct).toBe(true);
    expect(r.state.done).toBe(true);
    expect(r.state.miss).toBe(0);
  });

  it('間違いタップは miss を増やし placed は進まない', () => {
    const r = pickSort(initSort(), 2, 3);
    expect(r.correct).toBe(false);
    expect(r.state.placed).toBe(0);
    expect(r.state.miss).toBe(1);
  });

  it('done 後のタップは無視', () => {
    const done = { placed: 3, miss: 0, done: true };
    const r = pickSort(done, 0, 3);
    expect(r.correct).toBe(false);
    expect(r.state).toBe(done);
  });
});

describe('hidenaga: ミニゲームデータ整合', () => {
  it('墨俣（2-a）に sort 型の段取りミニゲームがある', () => {
    const sc = hidenaga.story.chapters.find((c) => c.id === 2)!.scenes['2-a'];
    const mg = sc.minigame;
    expect(mg?.type).toBe('sort');
    if (mg?.type !== 'sort') throw new Error('expected sort');
    expect(mg.items.length).toBeGreaterThanOrEqual(3);
    expect(mg.title.trim()).toBeTruthy();
  });
  it('minigame を持つシーンはすべて next を持つ（ロック解除先がある）', () => {
    for (const ch of hidenaga.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        const mg = sc.minigame;
        if (!mg) continue;
        expect(sc.next, `ch${ch.id} ${sid}`).toBeTruthy();
        expect(mg.title.trim(), `ch${ch.id} ${sid}`).toBeTruthy();
        if (mg.type === 'sort') expect(mg.items.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
