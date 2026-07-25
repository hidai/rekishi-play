// 作品の入口は registry.ts と index.ts の2つあり、片方だけ直すと「一覧に出ない作品」
// または「どのゲートも通らない作品」が静かに生まれる。ここがその pin。
import { describe, it, expect } from 'vitest';
import { WORK_ENTRIES } from '../src/works/registry';
import { WORKS } from '../src/works/index';

describe('作品レジストリ（registry ⇄ WORKS）', () => {
  it('同じ作品を同じ順で持つ', () => {
    expect(WORK_ENTRIES.map((e) => e.card.id)).toEqual(WORKS.map((w) => w.id));
  });

  it('card は本体と同じ主人公・題名を指す', async () => {
    for (const entry of WORK_ENTRIES) {
      const work = await entry.load();
      expect(entry.card.id).toBe(work.id);
      expect(entry.card.protagonistId).toBe(work.protagonistId);
      expect(entry.card.titleMain).toBe(work.strings.titleMain);
      expect(entry.card.titleSub).toBe(work.strings.titleSub);
      expect(entry.card.years).toBe(work.strings.years);
      // 作品えらびが「3/7章」を出すのに使う。ずれると進みぐあいが嘘になる。
      expect(entry.card.totalChapters).toBe(work.totalChapters);
      expect(entry.card.faces[work.protagonistId]).toBeDefined();
    }
  });
});
