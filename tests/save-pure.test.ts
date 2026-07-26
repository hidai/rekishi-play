// Pure save helpers (localStorage-free): parseDB fallback, round-trip, makeAccount.
import { describe, it, expect } from 'vitest';
import {
  parseDB,
  serializeDB,
  makeAccount,
  normalizeName,
  accountLabel,
  NO_NAME,
  NAME_MAX,
  emptyWorkSave,
  accountStandings,
  doneChapters,
  type AccountDB,
} from '../src/engine/save.svelte';
import type { WorkCard } from '../src/engine/types';

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

// 名前は「もう一人あそびたくなった」ときに初めて要る（観察メモ 2026-07-26）＝
// 名前なしで始められること自体が要件で、空文字はその状態を表す正規の値。
describe('名前は後づけ', () => {
  it('名前を渡さずに作れる（＝最初の画面が入力フォームにならない）', () => {
    const a = makeAccount({ accounts: [], activeId: null });
    expect(a.name).toBe('');
    expect(a.id).toBe('p1');
  });

  it('前後の空白は落とし、長すぎる名前は切る', () => {
    expect(normalizeName('  たろう  ')).toBe('たろう');
    expect(normalizeName('あ'.repeat(30))).toHaveLength(NAME_MAX);
    expect(normalizeName(undefined)).toBe('');
    expect(normalizeName('   ')).toBe('');
  });

  it('呼び名は空欄にならない（名前なしでも画面に出る言葉がある）', () => {
    expect(accountLabel(makeAccount({ accounts: [], activeId: null }))).toBe(NO_NAME);
    expect(accountLabel(null)).toBe(NO_NAME);
    expect(accountLabel(makeAccount({ accounts: [], activeId: null }, 'けん'))).toBe('けん');
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

describe('doneChapters / accountStandings（作品をまたいだ足し算はここだけ）', () => {
  const a = makeAccount({ accounts: [], activeId: null }, 'けん');
  a.works.hidenaga = { ...emptyWorkSave(), progress: { 1: 'done', 2: 'done' }, cards: ['c1'] };
  a.works.masako = { ...emptyWorkSave(), progress: { 1: 'done' }, cards: ['c2', 'c3'] };
  a.works.katsu = emptyWorkSave(); // 開いただけ＝まだ遊んでいない

  const card = (id: string, totalChapters = 7): WorkCard => ({
    id,
    protagonistId: id,
    faces: {},
    titleMain: id,
    titleSub: '',
    years: '1000〜1050',
    totalChapters,
  });
  const CARDS = [card('hidenaga'), card('masako'), card('katsu'), card('ieyasu')];

  it('doneChapters は作品指定なら その作品だけ、無指定なら合計', () => {
    expect(doneChapters(a, 'hidenaga')).toBe(2);
    expect(doneChapters(a, 'masako')).toBe(1);
    expect(doneChapters(a, 'shibusawa')).toBe(0); // 枠が無い作品
    expect(doneChapters(a)).toBe(3);
  });

  it('達成表は登録された全作品ぶん並び、遊んでいない作品も行として残る', () => {
    const s = accountStandings(a, CARDS);
    expect(s.rows.map((r) => r.id)).toEqual(['hidenaga', 'masako', 'katsu', 'ieyasu']);
    expect(s.rows.map((r) => r.played)).toEqual([true, true, false, false]);
    expect(s.rows.map((r) => r.done)).toEqual([2, 1, 0, 0]);
    expect(s.rows.map((r) => r.cards)).toEqual([1, 2, 0, 0]);
  });

  it('合計は「遊んだ作品」だけ数える（開いただけの枠は数に入れない）', () => {
    const s = accountStandings(a, CARDS);
    expect(s.works).toBe(2);
    expect(s.chapters).toBe(3);
    expect(s.cards).toBe(3);
    expect(s.complete).toBe(0);
  });

  it('全章クリアで コンプリート印。章数は総章数を超えない', () => {
    const b = makeAccount({ accounts: [], activeId: null }, 'ゆい');
    b.works.hidenaga = {
      ...emptyWorkSave(),
      progress: { 1: 'done', 2: 'done', 3: 'done', 4: 'done', 5: 'done', 6: 'done', 7: 'done' },
      cards: ['c1'],
    };
    const s = accountStandings(b, CARDS);
    expect(s.rows[0]).toMatchObject({ done: 7, total: 7, complete: true });
    expect(s.complete).toBe(1);
    expect(s.chapters).toBe(7);
  });

  it('章が減った作品の古いセーブでも 章数は総章数を超えない', () => {
    const b = makeAccount({ accounts: [], activeId: null }, 'りく');
    // 7章時代のセーブ。作品が5章に減っても「7/5章」にはしない。
    b.works.hidenaga = {
      ...emptyWorkSave(),
      progress: { 1: 'done', 2: 'done', 3: 'done', 4: 'done', 5: 'done', 6: 'done', 7: 'done' },
    };
    const s = accountStandings(b, [card('hidenaga', 5)]);
    expect(s.rows[0]).toMatchObject({ done: 5, total: 5, complete: true });
    expect(s.chapters).toBe(5);
  });

  it('章がまだ 0 の作品（骨組み）に コンプリート印は付かない', () => {
    const b = makeAccount({ accounts: [], activeId: null }, 'あき');
    b.works.shibusawa = { ...emptyWorkSave(), cards: ['c1'] };
    const s = accountStandings(b, [card('shibusawa', 0)]);
    expect(s.rows[0]).toMatchObject({ done: 0, total: 0, played: true, complete: false });
    expect(s.complete).toBe(0);
  });

  it('登録から外れた作品のセーブ枠は合計に混ざらない（分母と食い違わせない）', () => {
    const c = makeAccount({ accounts: [], activeId: null }, 'そう');
    c.works.gone = { ...emptyWorkSave(), progress: { 1: 'done' }, cards: ['x'] };
    expect(accountStandings(c, CARDS)).toMatchObject({ works: 0, chapters: 0, cards: 0 });
  });
});
