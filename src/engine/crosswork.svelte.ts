// 同じ人物が別の作品にも出てくるとき、相手の作品でのカード本文をそのまま並べる装置。
// 説明はしない——並べるだけで「同じ人が、遊ぶ作品によって違う顔で現れる」が立つ
// （確定設計は docs/design/cross-work.md）。
//
// 名寄せの表そのものは works 層（src/works/bridges.ts）が持つ。engine は固有名詞を知らず、
// 「表を渡されたらこう振る舞う」だけを実装する。相手作品の本文は遅延 load で取りに行く
// ——表に本文を焼くと同じ事実が2箇所に増える。
import type { Card, WorkEntry } from './types';
import { hasPlayed, type AccountStore } from './save.svelte';

/** 名寄せ表の1行。works 層が手で書く allowlist（id の偶然一致を橋にしないため）。 */
export interface PersonBridge {
  /** 人物カードの id（＝顔の base pid）。橋の両側で同じ id であることが前提。 */
  pid: string;
  /** その人物の person カードを持つ作品 id（2つ以上）。 */
  works: string[];
}

/** 相手作品ひとつぶんの見せ方。`card` が null なら誘い一行だけ（未プレイ）。 */
export interface BridgePeer {
  workId: string;
  /** 相手作品のタイトル（ruby HTML allowed）。 */
  title: string;
  card: Card | null;
}

export class CrossWorkStore {
  private worksByPid = new Map<string, string[]>();
  private entries = new Map<string, WorkEntry>();
  private accounts: AccountStore;
  /** 作品 id → その作品のカード表（load 済みの作品だけ）。 */
  private loaded = $state<Record<string, Record<string, Card>>>({});
  private pending = new Set<string>();

  constructor(bridges: PersonBridge[], entries: WorkEntry[], accounts: AccountStore) {
    this.accounts = accounts;
    for (const e of entries) this.entries.set(e.card.id, e);
    for (const b of bridges) this.worksByPid.set(b.pid, b.works);
  }

  /**
   * いま開いているカードに架かる橋。読み込みを起こさないので `$derived` から呼べる
   * （本文が要る相手は prefetch が取り、届いた時点でこの結果が増える）。
   *
   * 相手作品を遊んでいて、まだそのカードを取っていない場合は何も返さない＝先食い防止。
   */
  peers(workId: string, cardId: string): BridgePeer[] {
    const works = this.worksByPid.get(cardId);
    if (!works?.includes(workId)) return [];
    const account = this.accounts.active;
    const out: BridgePeer[] = [];
    for (const wid of works) {
      if (wid === workId) continue;
      // 未登録（骨組み段階）の作品は読者のビルドに無い＝橋を架けない。
      const entry = this.entries.get(wid);
      if (!entry) continue;
      const slice = account?.works[wid];
      if (!slice || !hasPlayed(slice)) {
        out.push({ workId: wid, title: entry.card.titleMain, card: null });
      } else if (slice.cards.includes(cardId)) {
        const card = this.loaded[wid]?.[cardId];
        if (card) out.push({ workId: wid, title: entry.card.titleMain, card });
      }
    }
    return out;
  }

  /**
   * 並置に要る相手作品を取りに行く（誘い一行だけの相手は読まない＝ロードゼロ）。
   * UI は投げっぱなしでよい——届けば peers() の結果が増える。戻り値の Promise は検査用。
   */
  prefetch(workId: string, cardId: string): Promise<void> {
    const works = this.worksByPid.get(cardId);
    if (!works?.includes(workId)) return Promise.resolve();
    const account = this.accounts.active;
    const loads: Promise<unknown>[] = [];
    for (const wid of works) {
      if (wid === workId || this.loaded[wid] || this.pending.has(wid)) continue;
      if (!account?.works[wid]?.cards.includes(cardId)) continue;
      const entry = this.entries.get(wid);
      if (!entry) continue;
      this.pending.add(wid);
      loads.push(
        entry
          .load()
          .then((w) => {
            this.loaded[wid] = w.cards;
          })
          // 読めなければ橋が出ないだけ（次に開いたとき再試行される）。
          .catch(() => {})
          .finally(() => this.pending.delete(wid)),
      );
    }
    return Promise.all(loads).then(() => {});
  }
}
