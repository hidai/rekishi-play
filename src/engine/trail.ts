// Topbar breadcrumb: the navigation hierarchy, made visible.
//
//   作品えらび ＞ タイトル ＞ 年代記 ＞ 第N章
//
// The 手帳 is not a fixed node of that tree — it is a child of wherever it was
// opened from, so closing it returns the reader to the scene they were reading.
// The last crumb is the current location and carries no target (not clickable);
// the one before it is "one level up".
import type { Work } from './types';
import type { Screen } from './session.svelte';

export type CrumbTarget =
  | { kind: 'works' }
  | { kind: 'title' }
  | { kind: 'home' }
  | { kind: 'scene'; ch: number; scene: string };

export interface Crumb {
  id: string;
  label: string;
  /** Leading glyph. The work crumb shows its 家紋 instead (see `mon`). */
  icon?: string;
  mon?: boolean;
  /** Absent on the current location. */
  to?: CrumbTarget;
}

export interface TrailState {
  screen: Screen;
  ch: number | null;
  scene: string | null;
  notebookFrom: { ch: number; scene: string } | null;
}

export function chapterLabel(work: Work, ch: number): string {
  return ch >= work.totalChapters ? '終章' : `第${ch}章`;
}

export function buildTrail(work: Work, st: TrailState, hasWorkSelect: boolean): Crumb[] {
  const t: Crumb[] = [];
  if (hasWorkSelect) t.push({ id: 'works', label: '作品', icon: '⇆', to: { kind: 'works' } });
  t.push({ id: 'work', label: work.strings.topbarName, mon: true, to: { kind: 'title' } });
  t.push({ id: 'home', label: '年代記', icon: '📖', to: { kind: 'home' } });

  if (st.screen === 'scene' && st.ch != null && st.scene) {
    t.push({ id: 'scene', label: chapterLabel(work, st.ch) });
  } else if (st.screen === 'clear' && st.ch != null) {
    t.push({ id: 'clear', label: `${chapterLabel(work, st.ch)} クリア` });
  } else if (st.screen === 'notebook') {
    const from = st.notebookFrom;
    if (from) {
      t.push({
        id: 'scene',
        label: chapterLabel(work, from.ch),
        to: { kind: 'scene', ch: from.ch, scene: from.scene },
      });
    }
    t.push({ id: 'notebook', label: '手帳', icon: '🗂' });
  }

  delete t[t.length - 1].to;
  return t;
}
