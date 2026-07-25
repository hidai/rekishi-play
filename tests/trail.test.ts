// Topbar breadcrumb (engine/trail): the reader's two questions — "where am I"
// and "how do I go up one" — must be answerable from the trail alone, on every
// screen of every work. Observation note 2026-07-25 ③: the old topbar answered
// neither (hierarchy ran right-to-left, settings sat in the middle).
import { describe, it, expect } from 'vitest';
import { buildTrail, chapterLabel, type TrailState } from '../src/engine/trail';
import { WORKS } from '../src/works/index';

const work = WORKS[0];
const at = (st: Partial<TrailState>): TrailState => ({
  screen: 'home',
  ch: null,
  scene: null,
  notebookFrom: null,
  ...st,
});

describe('breadcrumb shape', () => {
  it('runs shallow → deep: 作品 › 人物 › 年代記', () => {
    expect(buildTrail(work, at({}), true).map((c) => c.label)).toEqual([
      '作品',
      work.strings.topbarName,
      '年代記',
    ]);
  });

  it('drops the 作品 crumb when there is no work-select to return to', () => {
    expect(buildTrail(work, at({}), false).map((c) => c.id)).toEqual(['work', 'home']);
  });

  it('a scene hangs under 年代記', () => {
    const t = buildTrail(work, at({ screen: 'scene', ch: 3, scene: '3-a' }), true);
    expect(t.map((c) => c.label)).toEqual(['作品', work.strings.topbarName, '年代記', '第3章']);
  });

  it('the 手帳 hangs under the scene it was opened from, and that scene is reachable', () => {
    const t = buildTrail(
      work,
      at({ screen: 'notebook', notebookFrom: { ch: 3, scene: '3-a' } }),
      true,
    );
    expect(t.map((c) => c.label)).toEqual([
      '作品',
      work.strings.topbarName,
      '年代記',
      '第3章',
      '手帳',
    ]);
    expect(t[3].to).toEqual({ kind: 'scene', ch: 3, scene: '3-a' });
  });

  it('the 手帳 opened elsewhere hangs under 年代記', () => {
    const t = buildTrail(work, at({ screen: 'notebook' }), true);
    expect(t.map((c) => c.id)).toEqual(['works', 'work', 'home', 'notebook']);
  });
});

describe('every crumb answers one of the two questions', () => {
  const states: TrailState[] = [
    at({}),
    at({ screen: 'scene', ch: 1, scene: 'x' }),
    at({ screen: 'scene', ch: work.totalChapters, scene: 'x' }),
    at({ screen: 'clear', ch: 2 }),
    at({ screen: 'notebook' }),
    at({ screen: 'notebook', notebookFrom: { ch: 2, scene: 'y' } }),
  ];

  for (const w of WORKS) {
    it(`${w.id}: 現在地は末尾ただ1つ・祖先はすべて押せる`, () => {
      for (const st of states) {
        for (const hasWorkSelect of [true, false]) {
          const t = buildTrail(w, st, hasWorkSelect);
          expect(t.length).toBeGreaterThanOrEqual(2); // 現在地 ＋ 一段上
          expect(t.filter((c) => !c.to)).toHaveLength(1);
          expect(t[t.length - 1].to).toBeUndefined();
          expect(new Set(t.map((c) => c.id)).size).toBe(t.length);
          expect(t.every((c) => c.label.length > 0)).toBe(true);
        }
      }
    });
  }
});

describe('chapter labels', () => {
  it('names the last chapter 終章 (matches the 年代記 rail)', () => {
    expect(chapterLabel(work, work.totalChapters)).toBe('終章');
    expect(chapterLabel(work, 1)).toBe('第1章');
  });
});
