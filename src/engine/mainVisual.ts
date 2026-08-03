// The one place that picks a scene's main visual, by the scene's subject (★O/★P/★S):
//   closeup (だれ・想い) → figure (人の図) → study (手記＝自然を観る) → 読み解き地図 (どこ).
// SceneScreen (runtime) and the render-scene / render-observe dev tools all route through here so a
// new kind lands in one edit, not three. The observe overlay (art/observe.ts) sits on TOP of whatever
// this returns — it reads the returned viewBox and never picks the visual itself.
import type { Scene, Work } from './types';
import { buildSceneMap } from './map/sceneMap';
import { buildCloseup } from './art/closeup';
import { buildFigure } from './map/figure';
import { buildStudyPage } from './art/study';

export function buildMainVisual(
  work: Work,
  ch: number,
  sceneId: string,
  sc: Scene,
  /** Width the visual is laid out in, in CSS px (see DISPLAY_REF_W). Omit for the reference width. */
  displayW?: number,
): string {
  if (sc.closeup) return buildCloseup(work, sceneId, sc.closeup);
  if (sc.figure) return buildFigure(work, sc.figure, ch);
  const study = sc.study ? work.studies?.[sc.study] : undefined;
  if (study) return buildStudyPage(sc.study!, study);
  return buildSceneMap(work, ch, sceneId, displayW);
}
