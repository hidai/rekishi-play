// 物語ナビゲーション（旧 startChapter の遷移部）。onEnter のカード付与などの
// シーン副作用は SceneScreen が session.scene の変化に応じて適用する。
import type { AppStores } from './stores';

/** 章を開始（途中再開対応）。旧 startChapter + playScene の遷移部。 */
export function startChapter(stores: Pick<AppStores, 'work' | 'save' | 'session'>, id: number): void {
  const { work, save, session } = stores;
  const ch = work.story.chapters.find((c) => c.id === id);
  if (!ch) return;
  session.ch = id;
  const saved = save.active?.scene;
  const resume = saved && saved.ch === id ? saved.scene : ch.start;
  session.scene = ch.scenes[resume] ? resume : ch.start;
  session.show('scene');
}
