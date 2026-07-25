// ★L「分かれ道図鑑」の純粋ロジック検証。
import { describe, it, expect } from 'vitest';
import { collectedBranches, branchesSeenCount } from '../src/engine/branches';
import { choiceKey } from '../src/engine/canon';
import { hidenaga } from '../src/works/hidenaga/index';

describe('collectedBranches', () => {
  it('choices を持つ全シーンが章順に並ぶ', () => {
    const entries = collectedBranches(hidenaga, {});
    expect(entries.length).toBeGreaterThanOrEqual(10);
    const chs = entries.map((e) => e.ch);
    expect([...chs].sort((a, b) => a - b)).toEqual(chs);
    for (const e of entries) {
      expect(e.options.length).toBeGreaterThanOrEqual(2);
      expect(e.q.trim()).toBeTruthy();
    }
  });

  it('履歴なしは全枝 unseen・未発見', () => {
    const entries = collectedBranches(hidenaga, null);
    expect(entries.every((e) => !e.anySeen && !e.complete)).toBe(true);
    expect(entries.every((e) => e.options.every((o) => !o.seen && o.match === undefined))).toBe(true);
  });

  it('選んだ枝だけ seen になり match が出る', () => {
    const entries = collectedBranches(hidenaga, { [choiceKey(1, '1-b')]: [0] });
    const e = entries.find((x) => x.ch === 1 && x.sceneId === '1-b')!;
    expect(e.anySeen).toBe(true);
    expect(e.complete).toBe(false);
    expect(e.options[0].seen).toBe(true);
    expect(e.options[0].match).toBeTruthy();
    expect(e.options[0].canon).toBe(true);
    expect(e.options[1].seen).toBe(false);
    expect(e.options[1].moshimo).toBe(true); // 1-b の枝1は もしもルート
  });

  it('全部の枝を選ぶと complete', () => {
    const entries = collectedBranches(hidenaga, { [choiceKey(1, '1-b')]: [0, 1] });
    const e = entries.find((x) => x.ch === 1 && x.sceneId === '1-b')!;
    expect(e.complete).toBe(true);
  });
});

describe('branchesSeenCount', () => {
  it('枝の単位で数える', () => {
    expect(branchesSeenCount(hidenaga, {}).seen).toBe(0);
    const c = branchesSeenCount(hidenaga, { [choiceKey(1, '1-b')]: [0, 1] });
    expect(c.seen).toBe(2);
    expect(c.total).toBeGreaterThanOrEqual(20); // 10+ 分かれ道 × 2枝以上
  });
});
