// 同一人物の橋（docs/design/cross-work.md）の事故ゲート。
// 名寄せは allowlist（src/works/bridges.ts）ゆえ、表とデータのズレは静かに起きる——
// 表にあるのにカードが無ければ橋は出ず、表に無い同 id は「別人を同じ人として繋ぐ」事故か
// 起票漏れになる。両方向をここで pin する。
import { describe, it, expect, beforeEach } from 'vitest';
import { PERSON_BRIDGES } from '../src/works/bridges';
import { WORK_ENTRIES } from '../src/works/registry';
import { AccountStore, emptyWorkSave } from '../src/engine/save.svelte';
import { CrossWorkStore } from '../src/engine/crosswork.svelte';
import { ALL_WORKS } from './helpers/all-works';

const workById = new Map(ALL_WORKS.map((w) => [w.id, w]));

describe('作品をまたぐ同一人物の表', () => {
  it('1行1人・作品は2つ以上・作品 id は実在する', () => {
    const pids = PERSON_BRIDGES.map((b) => b.pid);
    expect(pids).toEqual([...new Set(pids)]);
    for (const b of PERSON_BRIDGES) {
      expect(new Set(b.works).size, `${b.pid} の作品に重複`).toBe(b.works.length);
      expect(b.works.length, `${b.pid} は2作品以上`).toBeGreaterThanOrEqual(2);
      for (const wid of b.works) expect(workById.has(wid), `未知の作品 ${wid}`).toBe(true);
    }
  });

  it('表の人物カードが両方の作品に実在する', () => {
    for (const b of PERSON_BRIDGES) {
      for (const wid of b.works) {
        const card = workById.get(wid)!.cards[b.pid];
        expect(card, `${wid} に ${b.pid} のカードが無い`).toBeDefined();
        expect(card.type, `${wid}:${b.pid} は person カードでない`).toBe('person');
      }
    }
  });

  it('複数作品にある同 id の人物カードは、すべて表に載っている', () => {
    const worksByPid = new Map<string, string[]>();
    for (const w of ALL_WORKS) {
      for (const [pid, c] of Object.entries(w.cards)) {
        if (c.type !== 'person') continue;
        worksByPid.set(pid, [...(worksByPid.get(pid) ?? []), w.id]);
      }
    }
    const listed = new Map(PERSON_BRIDGES.map((b) => [b.pid, [...b.works].sort()]));
    for (const [pid, works] of worksByPid) {
      if (works.length < 2) continue;
      expect(listed.get(pid), `${pid} が ${works.join('/')} に居るのに表に無い`).toEqual(
        [...works].sort(),
      );
    }
  });
});

// node 環境用 localStorage スタブ（tests/save-reactivity.test.ts と同じ理由）。
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
  return { accounts, xw: new CrossWorkStore(PERSON_BRIDGES, WORK_ENTRIES, accounts) };
}

describe('橋の3態（未プレイ＝誘い／未取得＝出さない／取得済み＝並置）', () => {
  it('相手作品が未プレイなら誘い一行だけ（本文は読み込まない）', () => {
    const { xw } = fresh();
    const peers = xw.peers('hidenaga', 'p-hideyoshi');
    expect(peers.map((p) => p.workId)).toEqual(['ieyasu']);
    expect(peers[0].card).toBe(null);
    expect(peers[0].title).toContain('家康');
  });

  it('相手作品を遊んでいて未取得なら何も出さない（先食い防止）', () => {
    const { accounts, xw } = fresh();
    accounts.active!.works.ieyasu = { ...emptyWorkSave(), cards: ['p-shingen'] };
    expect(xw.peers('hidenaga', 'p-hideyoshi')).toEqual([]);
  });

  it('相手作品でも取得済みなら、prefetch 後に相手の本文が並ぶ', async () => {
    const { accounts, xw } = fresh();
    accounts.active!.works.ieyasu = { ...emptyWorkSave(), cards: ['p-hideyoshi'] };
    // 読み込む前は出さない（本文は表に焼かず遅延 load で取る）。
    expect(xw.peers('hidenaga', 'p-hideyoshi')).toEqual([]);
    await xw.prefetch('hidenaga', 'p-hideyoshi');
    const peers = xw.peers('hidenaga', 'p-hideyoshi');
    expect(peers).toHaveLength(1);
    // 同じ id・違う名前（改姓）＝この装置が見せたい素材そのもの。
    expect(peers[0].card!.name).toBe('豊臣秀吉');
    expect(peers[0].card!.text).toContain('割り切れなさ');
  });

  it('橋の無いカードには何も出ない', () => {
    const { xw } = fresh();
    expect(xw.peers('hidenaga', 'p-takatora')).toEqual([]);
  });

  // 『栄一』の出荷で、この橋（慶喜）が骨組み期の「架からない」から「架かる」へ反転した。
  // 同じ人を別の側から見る対＝勝海舟の主君であり、渋沢の主君でもある人。
  it('出荷済みの相手作品へは橋が架かる（katsu ↔ shibusawa の慶喜）', () => {
    const { xw } = fresh();
    expect(xw.peers('katsu', 'p-yoshinobu').map((p) => p.workId)).toEqual(['shibusawa']);
    expect(xw.peers('shibusawa', 'p-yoshinobu').map((p) => p.workId)).toEqual(['katsu']);
  });

  // 未登録（骨組み）の作品へは橋を架けない、という契約そのもの。実データは全7作とも出荷済みに
  // なったので、契約は合成の表で pin する（作品を1つ足すたびに素通りする形にしない）。
  it('未登録（骨組み）の作品へは橋を架けない', () => {
    const accounts = new AccountStore();
    accounts.newAccount('けん');
    const xw = new CrossWorkStore(
      [{ pid: 'p-yoshinobu', works: ['katsu', 'mirai'] }],
      WORK_ENTRIES,
      accounts,
    );
    expect(xw.peers('katsu', 'p-yoshinobu')).toEqual([]);
  });
});

