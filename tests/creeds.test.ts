// ★K 秀長の「信条」ヘルパー（純粋ロジック）検証。
// 章ごとの決め台詞取得と、進捗による解錠の集約が正しいこと。
import { describe, it, expect } from 'vitest';
import { chapterCreed, collectedCreeds, creedsUnlockedCount } from '../src/engine/creeds';
import { hidenaga } from '../src/works/hidenaga/index';

describe('chapterCreed: 章ごとの信条', () => {
  it('全章に信条があり line/act を持つ', () => {
    for (let ch = 1; ch <= hidenaga.totalChapters; ch++) {
      const c = chapterCreed(hidenaga, ch);
      expect(c, `ch${ch}`).not.toBeNull();
      expect(c!.line.trim()).toBeTruthy();
      expect(c!.act.trim()).toBeTruthy();
    }
  });
  it('存在しない章は null', () => {
    expect(chapterCreed(hidenaga, 99)).toBeNull();
  });
});

describe('collectedCreeds: 進捗で解錠', () => {
  it('未プレイ（progress 空）は全章 locked', () => {
    const entries = collectedCreeds(hidenaga, {});
    expect(entries.length).toBe(hidenaga.totalChapters);
    expect(entries.every((e) => !e.unlocked)).toBe(true);
    expect(creedsUnlockedCount(hidenaga, {})).toBe(0);
  });
  it("progress[ch]==='done' の章だけ unlocked", () => {
    const progress = { 1: 'done', 2: 'done', 3: 'active' };
    const entries = collectedCreeds(hidenaga, progress);
    expect(entries.find((e) => e.ch === 1)?.unlocked).toBe(true);
    expect(entries.find((e) => e.ch === 2)?.unlocked).toBe(true);
    expect(entries.find((e) => e.ch === 3)?.unlocked).toBe(false);
    expect(creedsUnlockedCount(hidenaga, progress)).toBe(2);
  });
  it('progress 未指定でも落ちない（全 locked）', () => {
    expect(creedsUnlockedCount(hidenaga, undefined)).toBe(0);
    expect(creedsUnlockedCount(hidenaga, null)).toBe(0);
  });
  it('章順で並ぶ', () => {
    const chs = collectedCreeds(hidenaga, {}).map((e) => e.ch);
    expect(chs).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});
