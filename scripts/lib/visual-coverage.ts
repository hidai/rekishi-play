// Visual-coverage inventory: classify every scene's main visual (SceneScreen selection
// rule: closeup > figure > map) and flag scenes that would render as the bare fallback
// map. Playtest note 2026-07-13 root cause (B): 15 of 29 kiyomori scenes shipped as the
// one-face fallback map and nothing flagged it — "not broken" was invisible to every gate.
// Shared by scripts/visual-coverage.ts (report over all works, never fails — a work being
// authored may legitimately have unwritten visuals) and tests/visual-coverage.test.ts
// (hard assertion for completed works only).
import type { Work } from '../../src/engine/types';

export type VisualKind =
  | 'closeup' // 対面の場 (authored by definition)
  | 'figure' // 人の図 (authored by definition)
  | 'study' // 習作ページ (手記, authored by definition)
  | 'map' // authored scene map with something to say
  | 'map-bare' // SCENE_MAPS entry exists but is indistinguishable from the fallback
  | 'map-fallback'; // no SCENE_MAPS entry — engine draws the one-face default

export interface SceneVisual {
  ch: number;
  sceneId: string;
  kind: VisualKind;
  /** marker count (maps only) */
  markers: number;
  /** markers carrying a note (the one-line caption that lets the map speak) */
  notes: number;
}

/**
 * The engine fallback is `{ markers: [{ at: chapterPoints[ch], cur: 1 }] }` — one face,
 * no label, no note (sceneMap.ts). So an entry counts as "bare" when it shows nothing
 * beyond that: no route, no contested fill, and not a single marker carrying a label or
 * note. Calibration: hidenaga (the corpus verified by real child reactions) keeps quiet
 * riddle-scene anchors at exactly one *labeled* marker — a deliberate authored choice
 * that must pass, while an unlabeled placeholder must flag.
 */
export function classifyScene(work: Work, sceneId: string): Omit<SceneVisual, 'ch' | 'sceneId'> & { kind: VisualKind } {
  const def = work.map.sceneMaps[sceneId];
  if (!def) return { kind: 'map-fallback', markers: 0, notes: 0 };
  const markers = def.markers?.length ?? 0;
  const notes = def.markers?.filter((m) => m.note).length ?? 0;
  const labeled = def.markers?.filter((m) => m.label || m.note).length ?? 0;
  // contested must be length-checked ([] is truthy); allDots draws the numbered
  // journey-dots overlay, which is meaningful content beyond the fallback.
  const bare = labeled === 0 && !def.route && !def.contested?.length && !def.allDots;
  return { kind: bare ? 'map-bare' : 'map', markers, notes };
}

export function visualCoverage(work: Work): SceneVisual[] {
  const rows: SceneVisual[] = [];
  for (const ch of work.story.chapters) {
    for (const [sceneId, sc] of Object.entries(ch.scenes)) {
      if (sc.closeup) rows.push({ ch: ch.id, sceneId, kind: 'closeup', markers: 0, notes: 0 });
      else if (sc.figure) rows.push({ ch: ch.id, sceneId, kind: 'figure', markers: 0, notes: 0 });
      else if (sc.study) rows.push({ ch: ch.id, sceneId, kind: 'study', markers: 0, notes: 0 });
      else rows.push({ ch: ch.id, sceneId, ...classifyScene(work, sceneId) });
    }
  }
  return rows;
}

export interface CoverageSummary {
  workId: string;
  total: number;
  closeup: number;
  figure: number;
  study: number;
  map: number;
  /** scenes that would render as (or equal to) the bare fallback — the flagged list */
  unwritten: SceneVisual[];
}

export function summarize(work: Work): CoverageSummary {
  const rows = visualCoverage(work);
  return {
    workId: work.id,
    total: rows.length,
    closeup: rows.filter((r) => r.kind === 'closeup').length,
    figure: rows.filter((r) => r.kind === 'figure').length,
    study: rows.filter((r) => r.kind === 'study').length,
    map: rows.filter((r) => r.kind === 'map').length,
    unwritten: rows.filter((r) => r.kind === 'map-bare' || r.kind === 'map-fallback'),
  };
}
