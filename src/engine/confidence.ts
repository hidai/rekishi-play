// ★"Sureness marks" (たしかさマーク ◎○△☆): legend + display labels (DOM/localStorage-free
// = testable). A work-agnostic device that grades how strongly records support a claim shown
// in spark/deep, putting source criticism in the child's hands — "not knowing (△・☆) is
// treasure, not shame" (VISION principle 6), restated by the mark every time it appears.
// Carries no work-specific names/constants (G4). Labels are UI copy, so Japanese.
//
// Redesigned 2026-07-16 after a family observation ("覚えられない。わかりにくい"): the device
// was dual-coded — grading marks ◎○△☆ PLUS weather emoji ☀️🌤️☁️🌫️ — and named 天気マーク,
// so the name pointed at the decorative channel while work texts pointed at the marks.
// Now ONE symbol system: the school grading marks children already rank (◎>○>△), each with a
// plain-kana label attached wherever the mark appears, so nothing needs memorizing.
import type { Confidence } from './types';

export interface ConfidenceInfo {
  mark: Confidence;
  /** Short child-facing label. Read together, the four labels rank themselves. */
  label: string;
  /** One-line meaning (legend copy). */
  blurb: string;
}

// Labels/blurbs are plain-text fields — they can never carry <ruby>. Every kanji here must be
// readable bare by a 5th grader; tests/confidence.test.ts enforces an explicit allowlist.
// Per-mark display info. Record<Confidence, ...> makes the compiler enforce coverage when a
// mark is added to the Confidence union (type-level exhaustiveness ahead of tests).
const INFO: Record<Confidence, Omit<ConfidenceInfo, 'mark'>> = {
  '◎': { label: 'たしか', blurb: 'しっかりした 記録が 残っている' },
  '○': { label: 'だいたい たしか', blurb: 'まず まちがい なさそう' },
  '△': { label: '説が わかれる', blurb: 'いろんな 説が あって、まだ 決まっていない' },
  '☆': { label: 'たしかめられない', blurb: '語りや 言いつたえだけで、たしかめる 記録が ない' },
};

/** Display order, sure (◎) → unverifiable (☆). Shared by the legend and every badge. */
const ORDER: Confidence[] = ['◎', '○', '△', '☆'];

/** Legend for the notebook (◎→☆ order). */
export const CONFIDENCE_LEGEND: ConfidenceInfo[] = ORDER.map((mark) => ({ mark, ...INFO[mark] }));

/** Resolve a mark (◎○△☆) to its display info. Absent/unknown marks yield undefined. */
export function confidenceInfo(mark: Confidence | undefined): ConfidenceInfo | undefined {
  const info = mark && INFO[mark];
  return info ? { mark: mark as Confidence, ...info } : undefined;
}
