// セーブ配線のスペック: 「だれで あそぶ」は作品をまたいで1つ（AccountStore）、
// 進みぐあいはその中の作品ごとの枠（SaveStore）——という二層が、
// (1) 同一参照で繋がっていること (2) 変更が persist され再ロードで復元されること
// (3) 作品どうしが互いの枠を踏まないこと を守る。
// 注意: 元の D16 不具合（active に生オブジェクトを代入 → $state プロキシと分岐して
// 進捗が保存されない）は Svelte のクライアントランタイム（ブラウザ）でのみ再現する。
// node の vitest では $state が生オブジェクトのままなので、この identity 検査は
// ブラウザ環境でこそ番人になる（ブラウザ実機検証で修正を確認済み）。
import { describe, it, expect, beforeEach } from 'vitest';
import { AccountStore, SaveStore, ACCOUNT_KEY } from '../src/engine/save.svelte';
import { hidenaga } from '../src/works/hidenaga/index';
import { masako } from '../src/works/masako/index';

// node 環境用 localStorage スタブ。
const mem = new Map<string, string>();
beforeEach(() => mem.clear());
globalThis.localStorage = {
  getItem: (k: string) => (mem.has(k) ? mem.get(k)! : null),
  setItem: (k: string, v: string) => void mem.set(k, String(v)),
  removeItem: (k: string) => void mem.delete(k),
  clear: () => mem.clear(),
  key: () => null,
  length: 0,
} as Storage;

function stored() {
  return JSON.parse(localStorage.getItem(ACCOUNT_KEY)!);
}
/** 新しい子を1人立てて、その子の秀長の枠を開く（よくある前置き）。 */
function fresh(name = 'けん') {
  const accounts = new AccountStore();
  accounts.newAccount(name);
  return { accounts, s: new SaveStore(accounts, hidenaga) };
}

describe('AccountStore: active と db.accounts[i] の同一性', () => {
  it('newAccount の active は配列要素そのもの', () => {
    const accounts = new AccountStore();
    const a = accounts.newAccount('けん');
    expect(accounts.active).toBe(accounts.db.accounts[accounts.db.accounts.length - 1]);
    expect(a).toBe(accounts.active);
  });
});

describe('SaveStore: 進捗が persist され再ロードで復元（D16 回帰）', () => {
  it('markDone/grant/saveScene が localStorage に反映', () => {
    const { s } = fresh();
    s.saveScene(1, '1-a');
    s.grant('card', 'p-naka');
    s.grant('clue', 'clue-1');
    s.markDone(1);

    const db = stored();
    expect(db.accounts).toHaveLength(1);
    expect(db.activeId).toBe(db.accounts[0].id);
    const w = db.accounts[0].works.hidenaga;
    expect(w.progress).toEqual({ 1: 'done' });
    expect(w.cards).toContain('p-naka');
    expect(w.clues).toContain('clue-1');
    expect(w.scene).toEqual({ ch: 1, scene: '1-a' });
  });

  it('別ストアで再ロードすると進捗が復元される', () => {
    const { s } = fresh();
    s.grant('card', 'p-hideyoshi');
    s.markDone(1);

    // リロード相当（同じ localStorage から立ち上げ直す）。
    const s2 = new SaveStore(new AccountStore(), hidenaga);
    expect(s2.active?.progress).toEqual({ 1: 'done' });
    expect(s2.active?.cards).toContain('p-hideyoshi');
  });

  it('grant は重複付与しない（既得なら false）', () => {
    const { s } = fresh();
    expect(s.grant('card', 'p-naka')).toBe(true);
    expect(s.grant('card', 'p-naka')).toBe(false);
    expect(s.active?.cards.filter((c) => c === 'p-naka')).toHaveLength(1);
  });
});

describe('作品をまたいで1つのアカウント', () => {
  it('名前・ふりがなは共通、進みぐあいは作品ごとに分かれる', () => {
    const { accounts, s } = fresh();
    const s2 = new SaveStore(accounts, masako);
    s.markDone(1);
    s.grant('card', 'p-naka');
    s2.markDone(1);
    s2.markDone(2);

    expect(s.active?.progress).toEqual({ 1: 'done' });
    expect(s2.active?.progress).toEqual({ 1: 'done', 2: 'done' });
    expect(s2.active?.cards).toEqual([]); // 秀長で取ったカードは政子に持ち込まれない

    accounts.toggleFurigana();
    const db = stored();
    expect(Object.keys(db.accounts[0].works).sort()).toEqual(['hidenaga', 'masako']);
    // 名前・設定はアカウントに1つだけ（作品の枠には無い）。
    expect(db.accounts[0].furigana).toBe(false);
    expect(db.accounts[0].name).toBe('けん');
    expect(db.accounts[0].works.hidenaga.name).toBeUndefined();
  });

  it('localStorage キーはアプリ全体で1つ（作品別キーを増やさない）', () => {
    const { accounts, s } = fresh();
    new SaveStore(accounts, masako).markDone(1);
    s.markDone(1);
    expect([...mem.keys()]).toEqual([ACCOUNT_KEY]);
  });

  it('子を切り替えると、同じ作品でも別の進みぐあいが見える', () => {
    const { accounts, s } = fresh('けん');
    s.markDone(1);
    const b = accounts.newAccount('みか');
    expect(b.id).toBe('p2');
    expect(s.active).toBe(null); // みかはまだ秀長の枠を持たない
    s.grant('card', 'p-naka'); // 触れた時点で枠が生える
    expect(s.active?.progress).toEqual({});
    expect(s.active?.cards).toEqual(['p-naka']);

    accounts.setActive('p1');
    expect(s.active?.progress).toEqual({ 1: 'done' });
    expect(s.active?.cards).toEqual([]);
  });

  it('アカウントを消すと、その子の全作品の記録が消える', () => {
    const { accounts, s } = fresh();
    const s2 = new SaveStore(accounts, masako);
    s.markDone(1);
    s2.markDone(1);
    accounts.deleteAccount('p1');
    expect(accounts.active).toBe(null);
    expect(stored().accounts).toEqual([]);
  });
});

describe('SaveStore: bumpMeters（★1 メーター累積・永続化）', () => {
  it('複数選択ぶんが累積して persist され、再ロードで復元', () => {
    const { s } = fresh();
    s.bumpMeters({ kizuna: 2 });
    s.bumpMeters({ shinrai: 1, kuni: 1 });
    s.bumpMeters({ kizuna: 2 });
    expect(s.active?.meters).toEqual({ kizuna: 4, shinrai: 1, kuni: 1 });

    const s2 = new SaveStore(new AccountStore(), hidenaga); // リロード相当
    expect(s2.active?.meters).toEqual({ kizuna: 4, shinrai: 1, kuni: 1 });
  });

  it('effect 未指定・空では何もしない', () => {
    const { s } = fresh();
    s.bumpMeters(undefined);
    s.bumpMeters({});
    expect(s.active?.meters).toEqual({});
  });
});

describe('SaveStore.observeFind（★Q 観察ビューの気づき）', () => {
  it('見つけた順に persist され、二度目は false（掃きと印タップの二重発火が無害）', () => {
    const { s } = fresh();
    expect(s.observeFind('ob-a')).toBe(true);
    expect(s.observeFind('ob-a')).toBe(false); // pointerup と click が両方届いた場合
    expect(s.observeFind('ob-b')).toBe(true);
    expect(stored().accounts[0].works.hidenaga.observed).toEqual(['ob-a', 'ob-b']);
  });

  it('アカウント未選択・空 id では何もしない', () => {
    const s = new SaveStore(new AccountStore(), hidenaga);
    expect(s.observeFind('ob-a')).toBe(false); // active なし
    const { s: s2 } = fresh();
    expect(s2.observeFind('')).toBe(false);
    expect(s2.active?.observed).toEqual([]);
  });

  it('章をまたいだ gate の材料になる（作品全体で1つの集合＝再ロードで復元）', () => {
    const { s } = fresh();
    s.observeFind('ch1-hand');
    const s2 = new SaveStore(new AccountStore(), hidenaga); // リロード相当
    expect(s2.active?.observed).toEqual(['ch1-hand']);
  });
});

describe('SaveStore.graphLink（★R つながり図鑑の辺）', () => {
  it('灯した順に persist され、二度目は false（誕生アニメ・音を鳴らさない）', () => {
    const { s } = fresh();
    expect(s.graphLink('l-1')).toBe(true);
    expect(s.graphLink('l-1')).toBe(false);
    expect(s.graphLink('l-2')).toBe(true);
    expect(stored().accounts[0].works.hidenaga.links).toEqual(['l-1', 'l-2']);
  });

  it('アカウント未選択・空 id では何もしない', () => {
    const s = new SaveStore(new AccountStore(), hidenaga);
    expect(s.graphLink('l-1')).toBe(false); // active なし
    const { s: s2 } = fresh();
    expect(s2.graphLink('')).toBe(false);
    expect(s2.active?.links).toEqual([]);
  });

  it('星は保存しない（気づきと辺から毎回 導出する＝同じ事実を2箇所に持たない）', () => {
    const { s } = fresh();
    s.observeFind('ob-a');
    s.graphLink('l-1');
    const w = stored().accounts[0].works.hidenaga;
    expect(Object.keys(w).filter((k) => /star|node/i.test(k))).toEqual([]);
  });

  it('灯した線が再ロードで復元される', () => {
    const { s } = fresh();
    s.graphLink('l-mizu-kami');
    const s2 = new SaveStore(new AccountStore(), hidenaga); // リロード相当
    expect(s2.active?.links).toEqual(['l-mizu-kami']);
  });
});

describe('SaveStore.recordChoice（★L 選択履歴）', () => {
  it('記録が persist され、重複は増えない', () => {
    const { s } = fresh();
    s.recordChoice(1, '1-b', 0);
    s.recordChoice(1, '1-b', 0); // 同じ枝の再選択は増えない
    s.recordChoice(1, '1-b', 1);
    s.recordChoice(2, '2-b', 1);
    const w = stored().accounts[0].works.hidenaga;
    expect(w.choices['1:1-b']).toEqual([0, 1]);
    expect(w.choices['2:2-b']).toEqual([1]);
  });
});
