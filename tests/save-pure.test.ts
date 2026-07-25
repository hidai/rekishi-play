// Pure save helpers (localStorage-free): parseDB fallback, round-trip, makeAccount.
import { describe, it, expect } from 'vitest';
import {
  parseDB,
  serializeDB,
  makeAccount,
  emptyWorkSave,
  accountSummary,
  doneChapters,
  type AccountDB,
} from '../src/engine/save.svelte';

describe('parseDB', () => {
  it('壊れた JSON / 形なしは初期 DB にフォールバック', () => {
    expect(parseDB('{壊れ')).toEqual({ accounts: [], activeId: null });
    expect(parseDB(null)).toEqual({ accounts: [], activeId: null });
    expect(parseDB('{"nope":1}')).toEqual({ accounts: [], activeId: null });
  });

  it('serialize→parse で往復不変', () => {
    const db: AccountDB = {
      accounts: [makeAccount({ accounts: [], activeId: null }, 'けん')],
      activeId: 'p1',
    };
    expect(parseDB(serializeDB(db))).toEqual(db);
  });
});

describe('makeAccount', () => {
  it('空 DB では p1、既存があれば最大 +1', () => {
    const empty: AccountDB = { accounts: [], activeId: null };
    expect(makeAccount(empty).id).toBe('p1');
    const p1 = makeAccount(empty);
    const p2 = makeAccount({ accounts: [p1], activeId: 'p1' });
    expect(makeAccount({ accounts: [p1, p2], activeId: 'p2' }).id).toBe('p3');
  });

  it('既定はふりがな ON・作品の枠ゼロ（枠は遊び始めた作品にだけ生える）', () => {
    const a = makeAccount({ accounts: [], activeId: null }, 'ぼく');
    expect(a.furigana).toBe(true);
    expect(a.name).toBe('ぼく');
    expect(a.theme).toBe(null);
    expect(a.works).toEqual({});
  });
});

describe('emptyWorkSave', () => {
  it('全フィールドが初期化される（欠けたら読み側が undefined を踏む）', () => {
    expect(emptyWorkSave()).toEqual({
      progress: {},
      scene: null,
      cards: [],
      clues: [],
      answer: null,
      meters: {},
      choices: {},
      observed: [],
      links: [],
    });
  });
});

describe('doneChapters / accountSummary（作品をまたいだ足し算はここだけ）', () => {
  const a = makeAccount({ accounts: [], activeId: null }, 'けん');
  a.works.hidenaga = { ...emptyWorkSave(), progress: { 1: 'done', 2: 'done' }, cards: ['c1'] };
  a.works.masako = { ...emptyWorkSave(), progress: { 1: 'done' }, cards: ['c2', 'c3'] };
  a.works.katsu = emptyWorkSave(); // 開いただけ＝まだ遊んでいない

  it('doneChapters は作品指定なら その作品だけ、無指定なら合計', () => {
    expect(doneChapters(a, 'hidenaga')).toBe(2);
    expect(doneChapters(a, 'masako')).toBe(1);
    expect(doneChapters(a, 'shibusawa')).toBe(0); // 枠が無い作品
    expect(doneChapters(a)).toBe(3);
  });

  it('サマリは「遊んだ作品」だけ数える（開いただけの枠は数に入れない）', () => {
    expect(accountSummary(a)).toEqual({ works: 2, chapters: 3, cards: 3 });
  });
});
