// 「えっ！？図鑑」（spark 収集）の純粋ヘルパー検証。
// creeds と同じく進捗から導出（セーブ形式不変）であること。
import { describe, it, expect } from 'vitest';
import { collectedSparks, sparksUnlockedCount } from '../src/engine/sparks';
import { hidenaga } from '../src/works/hidenaga/index';

describe('collectedSparks', () => {
  it('spark を持つ全シーンが章順に並ぶ', () => {
    const entries = collectedSparks(hidenaga, {});
    expect(entries.length).toBeGreaterThanOrEqual(hidenaga.totalChapters); // 各章に1つ以上
    const chs = entries.map((e) => e.ch);
    expect([...chs].sort((a, b) => a - b)).toEqual(chs); // 章順
    for (const e of entries) expect(e.text.trim()).toBeTruthy();
  });

  it('未プレイ（progress 空 / null）は全部 locked', () => {
    expect(collectedSparks(hidenaga, {}).every((e) => !e.unlocked)).toBe(true);
    expect(collectedSparks(hidenaga, null).every((e) => !e.unlocked)).toBe(true);
    expect(sparksUnlockedCount(hidenaga, {})).toBe(0);
  });

  it("progress[ch]==='done' の章の spark だけ unlocked", () => {
    const progress = { 1: 'done', 2: 'active' };
    const entries = collectedSparks(hidenaga, progress);
    for (const e of entries) {
      expect(e.unlocked, `ch${e.ch}`).toBe(e.ch === 1);
    }
    expect(sparksUnlockedCount(hidenaga, progress)).toBe(
      entries.filter((e) => e.ch === 1).length,
    );
  });

  it('全章 done なら全部 unlocked', () => {
    const progress: Record<string, string> = {};
    for (let i = 1; i <= hidenaga.totalChapters; i++) progress[i] = 'done';
    const entries = collectedSparks(hidenaga, progress);
    expect(entries.every((e) => e.unlocked)).toBe(true);
    expect(sparksUnlockedCount(hidenaga, progress)).toBe(entries.length);
  });
});
