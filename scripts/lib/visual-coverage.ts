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

/**
 * Authored visuals no reader can reach, and scene references that resolve to nothing.
 *
 * `visualCoverage` walks scenes and asks "does this scene have a visual?" — it can never
 * see an asset that no scene points at. shibusawa's `seat`「きみの 座」shipped that way:
 * written, commented, and never placed, so ch4's「きみの 座（つづき）」was a reply to a
 * picture no one had seen (playtest note 2026-08-04). The mirror case is a scene naming a
 * key that isn't there — `buildFigure` returns '' and the screen falls back in silence.
 */
export interface Unreachable {
  /** `figures` / `studies` keys no scene references */
  orphans: string[];
  /** `sc.figure` / `sc.study` values with no entry in the work */
  dangling: string[];
  /** `sceneMaps` keys that match no scene id */
  orphanMaps: string[];
}

export function unreachableVisuals(work: Work): Unreachable {
  const usedFigures = new Set<string>();
  const usedStudies = new Set<string>();
  const sceneIds = new Set<string>();
  for (const ch of work.story.chapters)
    for (const [sceneId, sc] of Object.entries(ch.scenes)) {
      sceneIds.add(sceneId);
      if (sc.figure) usedFigures.add(sc.figure);
      if (sc.study) usedStudies.add(sc.study);
    }
  const figures = work.figures ?? {};
  const studies = work.studies ?? {};
  return {
    orphans: [
      ...Object.keys(figures).filter((k) => !usedFigures.has(k)).map((k) => `figure:${k}`),
      ...Object.keys(studies).filter((k) => !usedStudies.has(k)).map((k) => `study:${k}`),
    ],
    dangling: [
      ...[...usedFigures].filter((k) => !figures[k]).map((k) => `figure:${k}`),
      ...[...usedStudies].filter((k) => !studies[k]).map((k) => `study:${k}`),
    ],
    orphanMaps: Object.keys(work.map.sceneMaps).filter((k) => !sceneIds.has(k)),
  };
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
