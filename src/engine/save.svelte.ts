// セーブ層。純粋部（parseDB/serializeDB/makeAccount）と Svelte5 runes ストアに分離。
// $effect 自動保存はせず、明示的に persist() を呼ぶ（保存タイミングを制御するため）。
//
// 保存の単位は「その子」＝ Account 1つで、作品はその中の枠（Account.works）。
// 読者は名前を1回だけ選び、以後どの作品へ入っても同じ名前・同じ設定で続く
// （進みぐあい・カードは作品ごとに分かれたまま）。localStorage キーも1つ。
import type { Work, WorkCard } from './types';

/** アプリ全体で1つ。作品別キーは持たない（作品は Account.works の中の枠）。 */
export const ACCOUNT_KEY = 'rekishi_play_account_v1';

/** 1作品ぶんの進みぐあい。アカウントの中に作品 id をキーにして並ぶ。 */
export interface WorkSave {
  progress: Record<string, string>;
  scene: { ch: number; scene: string } | null;
  cards: string[];
  clues: string[];
  answer: number | null;
  /** ★1「きみの秀長」メーター（key → 累積値）。ローカル保存のみ。 */
  meters: Record<string, number>;
  /**
   * ★L 選択履歴。`"章:シーンid"` → 選んだ選択肢の元 index（選んだ順・重複なし）。
   * 先頭＝初回の選択（「きみの読み」の史実一致判定に使う）。全 index が揃うと
   * 「分かれ道図鑑」でその分かれ道がコンプリートになる（再プレイの動機）。ローカル保存のみ。
   */
  choices: Record<string, number[]>;
  /**
   * ★Q 観察ビューで見つけた hotspot の id（作品全体・見つけた順）。シーン単位でないのは、
   * gate（`ObserveHotspot.gatedOn`）が章をまたいで開くため——後の章で覚えた目で昔の絵に
   * 戻ると新しい細部が見える、が成立する条件（engine/observe.ts のヘッダ）。ローカル保存のみ。
   */
  observed: string[];
  /**
   * ★R つながり図鑑で灯した辺の id（灯した順）。星は保存しない——星は「見つけた気づき
   * （observed）」と「灯した辺（links）」から毎回 導出される（engine/graph.ts の
   * knownNodeIds）＝同じ事実を2箇所に持つと、いつか食い違う。ローカル保存のみ。
   */
  links: string[];
}

/** 遊ぶ子ひとり。名前と設定は作品を通じて1つ、進みぐあいだけ作品ごと。 */
export interface Account {
  id: string;
  name: string;
  furigana: boolean;
  theme: string | null;
  /** 作品 id → その作品の進みぐあい。遊んでいない作品は欄ごと無い。 */
  works: Record<string, WorkSave>;
}

export interface AccountDB {
  accounts: Account[];
  activeId: string | null;
}

/* ---------------- 純粋ヘルパー（テスト可能・localStorage 非依存） ---------------- */

/** localStorage の生文字列を DB に。壊れた JSON は初期 DB にフォールバック。 */
export function parseDB(raw: string | null | undefined): AccountDB {
  try {
    const d = JSON.parse(raw as string);
    if (d && d.accounts) return d as AccountDB;
  } catch {
    /* noop */
  }
  return { accounts: [], activeId: null };
}

export function serializeDB(db: AccountDB): string {
  return JSON.stringify(db);
}

/** 既存 id の最大値 +1。 */
export function nextUid(db: AccountDB): string {
  return 'p' + (db.accounts.reduce((m, a) => Math.max(m, +a.id.slice(1) || 0), 0) + 1);
}

export function emptyWorkSave(): WorkSave {
  return {
    progress: {},
    scene: null,
    cards: [],
    clues: [],
    answer: null,
    meters: {},
    choices: {},
    observed: [],
    links: [],
  };
}

/** アカウント生成部（純粋。DB への push はストア側）。 */
export function makeAccount(db: AccountDB, name?: string): Account {
  return {
    id: nextUid(db),
    name: name || 'なまえ',
    furigana: true,
    theme: null,
    works: {},
  };
}

/** クリアした章の数（作品を指定しなければ全作品の合計）。 */
export function doneChapters(a: Account, workId?: string): number {
  const slices = workId ? [a.works[workId]] : Object.values(a.works);
  return slices.reduce(
    (n, w) => n + (w ? Object.values(w.progress).filter((v) => v === 'done').length : 0),
    0,
  );
}

/**
 * その作品に足あとがあるか。枠の存在だけでは足りない——作品を開いた時点で空の枠ができるので、
 * 「一度のぞいた」と「遊んだ」を分けるにはこの述語が要る。
 */
export function hasPlayed(w: WorkSave): boolean {
  return Object.keys(w.progress).length > 0 || w.cards.length > 0;
}

/** 「だれで あそぶ？」の達成表の1行＝その子のその作品での立ち位置。 */
export interface WorkStanding {
  id: string;
  /** ruby HTML allowed */
  label: string;
  done: number;
  total: number;
  cards: number;
  played: boolean;
  complete: boolean;
}

export interface AccountStandings {
  rows: WorkStanding[];
  works: number;
  chapters: number;
  /** 登録されている作品の章の総数＝「10/42章」の分母。 */
  totalChapters: number;
  cards: number;
  complete: number;
}

/**
 * その子の達成を作品ごとに並べ、合計まで出す。作品をまたいだ足し算はここだけ。
 * 数えるのは登録されている作品（`cards`）だけ——外した作品のセーブ枠が残っていても
 * 「◯作の うち」の分母と食い違わないように。
 */
export function accountStandings(a: Account, cards: WorkCard[]): AccountStandings {
  const rows: WorkStanding[] = cards.map((c) => {
    const w = a.works[c.id];
    const done = Math.min(doneChapters(a, c.id), c.totalChapters);
    return {
      id: c.id,
      label: c.titleMain,
      done,
      total: c.totalChapters,
      cards: w?.cards.length ?? 0,
      played: !!w && hasPlayed(w),
      complete: c.totalChapters > 0 && done >= c.totalChapters,
    };
  });
  return {
    rows,
    works: rows.filter((r) => r.played).length,
    chapters: rows.reduce((n, r) => n + r.done, 0),
    totalChapters: rows.reduce((n, r) => n + r.total, 0),
    cards: rows.reduce((n, r) => n + r.cards, 0),
    complete: rows.filter((r) => r.complete).length,
  };
}

/* ---------------- Svelte 5 runes ストア ---------------- */

function readLS(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeLS(key: string, val: string): void {
  try {
    localStorage.setItem(key, val);
  } catch {
    /* noop */
  }
}

/** アプリ全体で1つ。App がマウント時に生成し、作品をまたいで生き続ける。 */
export class AccountStore {
  db = $state<AccountDB>({ accounts: [], activeId: null });
  /** いま遊んでいる子。 */
  active = $state<Account | null>(null);

  constructor() {
    this.db = parseDB(readLS(ACCOUNT_KEY));
    if (this.db.activeId) {
      this.active = this.db.accounts.find((a) => a.id === this.db.activeId) || null;
    }
  }

  /** 明示保存。$effect 自動保存はしない。 */
  persist(): void {
    writeLS(ACCOUNT_KEY, serializeDB(this.db));
  }

  newAccount(name?: string): Account {
    const a = makeAccount(this.db, name);
    this.db.accounts.push(a);
    this.db.activeId = a.id;
    // ⚠️ 生の a ではなく $state 配列の要素（リアクティブプロキシ）を参照する。
    // 生オブジェクトを代入すると active と db.accounts[i] が別物になり、
    // active への変更が db（＝persist 対象）に届かず進捗が保存されない。
    this.active = this.db.accounts[this.db.accounts.length - 1];
    this.persist();
    return this.active;
  }

  setActive(id: string): void {
    this.db.activeId = id;
    this.active = this.db.accounts.find((a) => a.id === id) || null;
    this.persist();
  }

  deleteAccount(id: string): void {
    this.db.accounts = this.db.accounts.filter((a) => a.id !== id);
    if (this.db.activeId === id) {
      this.db.activeId = this.db.accounts[0]?.id ?? null;
      this.active = this.db.accounts.find((a) => a.id === this.db.activeId) || null;
    }
    this.persist();
  }

  toggleFurigana(): void {
    if (!this.active) return;
    this.active.furigana = !this.active.furigana;
    this.persist();
  }

  setTheme(theme: string): void {
    if (this.active) {
      this.active.theme = theme;
      this.persist();
    }
  }
}

/**
 * 1作品ぶんのセーブ面。アクティブなアカウントの中の「その作品の枠」を読み書きする
 * 窓であって、自分では何も持たない（＝アカウントを切り替えれば見える中身も変わる）。
 * WorkRoot が作品ごとに生成する。
 */
export class SaveStore {
  work: Work;
  accounts: AccountStore;

  constructor(accounts: AccountStore, work: Work) {
    this.accounts = accounts;
    this.work = work;
    this.slice();
  }

  /** いま遊んでいる子の、この作品の枠（アカウント未選択なら null）。 */
  get active(): WorkSave | null {
    const a = this.accounts.active;
    return a ? (a.works[this.work.id] ?? null) : null;
  }

  /** 枠が無ければ作ってから返す。書き込み系はすべてここを通る。 */
  private slice(): WorkSave | null {
    const a = this.accounts.active;
    if (!a) return null;
    // ⚠️ 代入した"生"オブジェクトではなく、$state プロキシから読み直したものを返す
    // （生の側を書き換えても db に届かない。recordChoice のコメントも参照）。
    if (!a.works[this.work.id]) a.works[this.work.id] = emptyWorkSave();
    return a.works[this.work.id];
  }

  /** 明示保存。$effect 自動保存はしない。 */
  persist(): void {
    this.accounts.persist();
  }

  /** カード/手がかりを付与。新規に得たら true。 */
  grant(kind: 'card' | 'clue', id: string | undefined): boolean {
    const w = this.slice();
    if (!w || !id) return false;
    const arr = kind === 'card' ? w.cards : w.clues;
    if (arr.includes(id)) return false;
    arr.push(id);
    this.persist();
    return true;
  }

  saveScene(ch: number, scene: string): void {
    const w = this.slice();
    if (!w) return;
    w.scene = { ch, scene };
    this.persist();
  }

  markDone(ch: number): void {
    const w = this.slice();
    if (!w) return;
    w.progress[ch] = 'done';
    this.persist();
  }

  /** ★L: 分かれ道で選んだ選択肢を記録（ローカル保存のみ）。 */
  recordChoice(chId: number, sceneId: string, idx: number): void {
    const w = this.slice();
    if (!w) return;
    const key = chId + ':' + sceneId;
    // ⚠️ `(obj[key] ??= [])` は代入した"生"配列を式の値として返すが、$state プロキシは
    // 別のラップ済み配列を格納するため、生配列への push は状態に反映されない
    // （ブラウザでのみ再現。node の vitest では $state が生のままなので検知不能）。
    // 必ず代入後にプロキシから読み直して変更する。
    if (!w.choices[key]) w.choices[key] = [];
    const arr = w.choices[key];
    if (!arr.includes(idx)) {
      arr.push(idx);
      this.persist();
    }
  }

  /**
   * ★Q: 観察ビューの気づきを1つ記録（ローカル保存のみ）。新規に見つけたら true
   * （grant と同じ契約＝呼び手は戻り値で採集音・アニメを鳴らすか決める。掃きの pointerup と
   * 印の click が二重に届いても、二度目は false で無害）。
   */
  observeFind(id: string): boolean {
    const w = this.slice();
    if (!w || !id) return false;
    if (w.observed.includes(id)) return false;
    w.observed.push(id);
    this.persist();
    return true;
  }

  /**
   * ★R: つながり図鑑の辺を1つ灯す（ローカル保存のみ）。新しく灯ったら true
   * （observeFind と同じ契約＝呼び手は戻り値で誕生アニメ・音を鳴らすか決める）。
   * 「灯してよいか」は判定しない——それは engine/graph.ts の canLink の仕事で、ここは
   * 記録だけを持つ。
   */
  graphLink(id: string): boolean {
    const w = this.slice();
    if (!w || !id) return false;
    if (w.links.includes(id)) return false;
    w.links.push(id);
    this.persist();
    return true;
  }

  /** ★1: 選択のメーター増減を適用（ローカル保存のみ）。 */
  bumpMeters(effect: Record<string, number> | undefined): void {
    const w = this.slice();
    if (!w || !effect) return;
    for (const [k, v] of Object.entries(effect)) {
      w.meters[k] = (w.meters[k] ?? 0) + v;
    }
    this.persist();
  }
}
