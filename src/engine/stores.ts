// アプリのストア束を Svelte context で配る。App がマウント時に生成・設定し、
// 各コンポーネントは useStores() で受け取る（モジュール読込時の副作用ゼロ）。
import { getContext, setContext } from 'svelte';
import type { Work, WorkCard } from './types';
import type { AccountStore, SaveStore } from './save.svelte';
import type { CrossWorkStore } from './crosswork.svelte';
import type { Session } from './session.svelte';
import type { DialogService } from './dialog.svelte';
import type { ToastService } from './toast.svelte';
import type { HistService } from './hist.svelte';

export interface AppStores {
  work: Work;
  /**
   * Every registered work's light card (no story bodies). The 年表 uses it to place
   * this work on one shared 西暦 axis; a single-work build gets a one-element list
   * and the band hides itself.
   */
  workCards: WorkCard[];
  /** Who is playing. Owned by App and shared by every work (name / furigana / theme). */
  accounts: AccountStore;
  /** This work's slice of the active account's save. */
  save: SaveStore;
  /** Same-person bridges to the other works. Owned by App (it holds the name table). */
  crosswork: CrossWorkStore;
  session: Session;
  dialog: DialogService;
  toast: ToastService;
  hist: HistService;
  /**
   * Return to the work-selection screen. Provided by App only when more than one
   * work is registered (WORK_ENTRIES.length > 1); undefined for a single-work build, so
   * UI can hide the "choose work" affordance and preserve the original flow.
   */
  exitToWorks?: () => void;
  /**
   * Return to the account screen (「だれで あそぶ？」). Single-work builds have no
   * work-selection screen to reach it from, so the title screen offers it instead.
   */
  exitToAccounts: () => void;
}

const KEY = Symbol('rekishi-play.stores');

export function setStores(stores: AppStores): void {
  setContext(KEY, stores);
}

export function useStores(): AppStores {
  return getContext(KEY) as AppStores;
}
