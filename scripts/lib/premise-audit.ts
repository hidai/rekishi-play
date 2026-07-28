// ★前提知識の機械検査。tests/known-premise.test.ts（ゲート）と
// scripts/premise-audit.ts（CLI）が共用する。
//
// The rule (docs/WRITING.md 11): a work may only overturn what it made the reader
// believe inside the work. Leaning on 「有名な」「世にいう」「教科書」 assumes a reader who
// already knows the person — the 10-14 year old meeting them for the first time gets a
// lecture from outside the story instead (docs/design/known-premise.md).
//
// Markers are a PROXY, not the defect: they are the cheap, total-scan shadow of it.
// Prose that quotes the received story without a marker is invisible here — the audit's
// floor is the gate, the ceiling stays with /eval-work personas. Surfaces reviewed and
// deliberately kept move to ALLOW in the test, with a one-line reason each.
//
// Surfaces come from ruby-audit (the same "one screen a reader meets" model), plus the
// spine — riddle / title copy — which has no furigana surface of its own but is where a
// premise does the most damage: it is the first thing read and it frames all 7 chapters.
import type { Work } from '../../src/engine/types';
import { plainText } from './content-stats';
import { workSurfaces, bucketOf, type Surface } from './ruby-audit';

/** Phrases that hand the reader a received story instead of building one. */
export const PREMISE_MARKERS = [
  '有名',
  '名高い',
  '世にいう',
  'だれもが',
  '誰もが',
  'よく言われ',
  'よくいわれ',
  'と思うかも',
  '教科書',
  'おなじみ',
  '語られてきた',
];

export interface PremiseHit {
  surface: string;
  marker: string;
  /** Surrounding plain text, so the author can find the spot. */
  excerpt: string;
}

/** Title-screen copy and the riddle: the frame every chapter is read through. */
export function spineSurface(work: Work): Surface {
  const s = work.strings;
  return {
    id: 'spine',
    parts: [work.riddle, s.titleSub, s.riddleLead, s.riddleHeart, s.titleHeroTease, s.titleFacesLead, s.titleNote]
      .filter(Boolean) as string[],
  };
}

export function premiseSurfaces(work: Work): Surface[] {
  return [spineSurface(work), ...workSurfaces(work)];
}

export function auditSurface(surface: Surface): PremiseHit[] {
  const hits: PremiseHit[] = [];
  for (const part of surface.parts) {
    const t = plainText(part);
    for (const marker of PREMISE_MARKERS)
      for (let i = t.indexOf(marker); i >= 0; i = t.indexOf(marker, i + marker.length))
        hits.push({
          surface: surface.id,
          marker,
          excerpt: t.slice(Math.max(0, i - 10), i + marker.length + 10),
        });
  }
  return hits;
}

export function auditWork(work: Work): PremiseHit[] {
  return premiseSurfaces(work).flatMap(auditSurface);
}

export function auditBuckets(work: Work): Record<string, number> {
  const out: Record<string, number> = {};
  for (const h of auditWork(work)) out[bucketOf(h.surface)] = (out[bucketOf(h.surface)] ?? 0) + 1;
  return out;
}

/**
 * A-type sparks (docs/design/known-premise.md §4): 「え！？」 panels that overturn a
 * received story. Not gated — a reversal is legitimate once the work has dressed the
 * reader in the belief — but this is the worklist for the per-work triage slices.
 */
export function reversalSparks(work: Work): { scene: string; excerpt: string }[] {
  const out: { scene: string; excerpt: string }[] = [];
  for (const ch of work.story.chapters)
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      const t = plainText(sc.spark ?? '');
      if (/じつは|実は|ちがう|違う/.test(t)) out.push({ scene: `ch${ch.id}/${sid}`, excerpt: t });
    }
  return out;
}
export function sparkCount(work: Work): number {
  return work.story.chapters.flatMap((ch) => Object.values(ch.scenes)).filter((sc) => sc.spark).length;
}
