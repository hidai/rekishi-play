// 読み返しの導線（観察メモ 2026-07-28「文書戻れないのがつらい」）。
// シーンは長らく「つづき →」の一方向で、読み落としたと気づいた読者には
// ホームから章ごと入り直す道しかなかった。足あと（Session.backTrail）の契約:
//   ① 物語が1つ先へ進むとき（つづき・選択）だけ積む
//   ② 章に入り直したら まっさら（＝読み返しの起点は章の頭）
//   ③ 手帳から場面へ帰るのは「進む」ではない＝積まない
//   ④ 戻って同じ枝を選び直しても、メーターは二度加算しない
//   ⑤ 戻っても再開位置（＝どこまで読んだか）は後ろへ動かない
import { describe, it, expect, beforeEach } from 'vitest';
import { Session } from '../src/engine/session.svelte';
import { AccountStore, SaveStore, ACCOUNT_KEY } from '../src/engine/save.svelte';
import { HistService } from '../src/engine/hist.svelte';
import { startChapter } from '../src/engine/nav';
import { applySceneEnter, chooseNext, gotoScene } from '../src/engine/story';
import { ToastService } from '../src/engine/toast.svelte';
import { hidenaga } from '../src/works/hidenaga/index';

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

function fresh() {
  const accounts = new AccountStore();
  accounts.newAccount('けん');
  const save = new SaveStore(accounts, hidenaga);
  const stores = {
    work: hidenaga,
    save,
    session: new Session(),
    hist: new HistService(),
    toast: new ToastService(),
  };
  return stores;
}

/** SceneScreen の $effect が場面ごとに走らせる副作用ぶん（再開位置の保存を含む）。 */
function enterScene(stores: ReturnType<typeof fresh>): void {
  applySceneEnter(stores, stores.session.ch!, stores.session.scene!);
}

/** 選択して「史実では」パネルを閉じるところまで（UI の一連の操作ぶん）。 */
async function pick(
  stores: ReturnType<typeof fresh>,
  ch: number,
  scene: string,
  i: number,
): Promise<void> {
  const done = chooseNext(stores, ch, scene, i);
  stores.hist.settle();
  await done;
}

describe('読み返しの足あと（Session.backTrail）', () => {
  it('「つづき」で進むと積まれ、goBack が1つずつ戻す', () => {
    const { session } = fresh();
    session.enterChapter(1, '1-a');
    expect(session.canGoBack).toBe(false); // 章の頭では出さない

    gotoScene(session, '1-b');
    gotoScene(session, '1-c');
    expect(session.scene).toBe('1-c');
    expect(session.canGoBack).toBe(true);

    session.goBack();
    expect(session.scene).toBe('1-b');
    session.goBack();
    expect(session.scene).toBe('1-a');
    expect(session.canGoBack).toBe(false);
    session.goBack(); // 空でも壊れない
    expect(session.scene).toBe('1-a');
  });

  it('章に入り直すと足あとは消える（前の章の場面へ戻らない）', () => {
    const stores = fresh();
    const { session } = stores;
    startChapter(stores, 1);
    gotoScene(session, '1-b');
    expect(session.canGoBack).toBe(true);

    startChapter(stores, 2);
    expect(session.ch).toBe(2);
    expect(session.canGoBack).toBe(false);
  });

  it('手帳を開いて閉じても足あとは伸びない（進んでいないから）', () => {
    const { session } = fresh();
    session.enterChapter(1, '1-a');
    gotoScene(session, '1-b');

    session.openNotebook('cards');
    session.leaveNotebook();
    expect(session.scene).toBe('1-b');
    expect(session.backTrail).toHaveLength(1);
    session.goBack();
    expect(session.scene).toBe('1-a');
  });

  it('選択で進むときも積まれる（分かれ道の手前へ戻れる）', async () => {
    const stores = fresh();
    const { session } = stores;
    session.enterChapter(1, '1-a');
    gotoScene(session, '1-b');
    await pick(stores, 1, '1-b', 0);
    expect(session.scene).toBe('1-c');

    session.goBack();
    expect(session.scene).toBe('1-b');
  });
});

describe('再開位置（どこまで読んだか）は読み返しで後退しない', () => {
  it('戻ってから離れても、章の「つづき」はいちばん先まで読んだ場面から', () => {
    const stores = fresh();
    const { session, save } = stores;
    startChapter(stores, 1);
    enterScene(stores);
    gotoScene(session, '1-b');
    enterScene(stores);
    expect(save.active?.scene).toEqual({ ch: 1, scene: '1-b' });

    session.goBack();
    enterScene(stores);
    expect(session.scene).toBe('1-a');
    expect(save.active?.scene).toEqual({ ch: 1, scene: '1-b' }); // 巻き戻さない

    startChapter(stores, 1); // ホームから入り直す＝再開
    expect(session.scene).toBe('1-b');
  });

  it('戻ったあとに進み直せば、再開位置はまた動く', () => {
    const stores = fresh();
    const { session, save } = stores;
    startChapter(stores, 1);
    enterScene(stores);
    gotoScene(session, '1-b');
    enterScene(stores);
    session.goBack();
    enterScene(stores);

    gotoScene(session, '1-b');
    enterScene(stores);
    expect(save.active?.scene).toEqual({ ch: 1, scene: '1-b' });
  });
});

describe('戻って選び直したときの数え方', () => {
  it('同じ枝をもう一度選んでもメーターは二度加算しない', async () => {
    const stores = fresh();
    const { session, save } = stores;
    session.enterChapter(1, '1-a');
    gotoScene(session, '1-b');

    await pick(stores, 1, '1-b', 0);
    const after = { ...(save.active?.meters ?? {}) };
    expect(after).toEqual({ kizuna: 2 });

    session.goBack();
    await pick(stores, 1, '1-b', 0);
    expect(save.active?.meters).toEqual(after);
    expect(save.active?.choices['1:1-b']).toEqual([0]);
  });

  it('まだ見ていない枝を選べば、その枝ぶんは加算される（分かれ道図鑑の再訪は生きる）', async () => {
    const stores = fresh();
    const { session, save } = stores;
    session.enterChapter(1, '1-a');
    gotoScene(session, '1-b');

    await pick(stores, 1, '1-b', 0);
    session.goBack();
    await pick(stores, 1, '1-b', 1);
    expect(save.active?.meters).toEqual({ kizuna: 2, kuni: 1 });
    expect(save.active?.choices['1:1-b']).toEqual([0, 1]);
  });

  it('章ごと遊び直しても、同じ枝は二度数えない（もとからの二重計上も塞ぐ）', async () => {
    const stores = fresh();
    const { session, save } = stores;
    startChapter(stores, 1);
    gotoScene(session, '1-b');
    await pick(stores, 1, '1-b', 0);

    startChapter(stores, 1);
    await pick(stores, 1, '1-b', 0);
    expect(save.active?.meters).toEqual({ kizuna: 2 });
    expect(JSON.parse(mem.get(ACCOUNT_KEY)!).accounts[0].works.hidenaga.meters).toEqual({
      kizuna: 2,
    });
  });
});
