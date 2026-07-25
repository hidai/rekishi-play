// テーマ・ふりがなの適用/切替。設定はアカウント持ち（作品をまたいで1つ）。
// 切替ボタンはトップバー上にあり、トップバーは作品の中でだけ出る
// ＝切替時は常にアクティブなアカウントが存在する。
import type { AccountStore, Account } from './save.svelte';
import type { ToastService } from './toast.svelte';

/** アカウント切替時にテーマ・ふりがなを DOM へ反映。 */
export function applyAccountPrefs(active: Account | null): void {
  if (active && active.theme) document.documentElement.setAttribute('data-theme', active.theme);
  else document.documentElement.removeAttribute('data-theme'); // 未設定はシステム既定（前の子のテーマを継がない）
  document.body.classList.toggle('no-furigana', active ? !active.furigana : false);
}

export function toggleTheme(accounts: AccountStore, toast: ToastService): void {
  const cur = document.documentElement.getAttribute('data-theme');
  const mqDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
  const next = cur ? (cur === 'dark' ? 'light' : 'dark') : mqDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  accounts.setTheme(next);
  toast.show(next === 'dark' ? '夜（ダーク）' : '昼（ライト）');
}

export function toggleFurigana(accounts: AccountStore, toast: ToastService): void {
  if (!accounts.active) return;
  accounts.toggleFurigana();
  document.body.classList.toggle('no-furigana', !accounts.active.furigana);
  toast.show(accounts.active.furigana ? 'ふりがな ON' : 'ふりがな OFF');
}
