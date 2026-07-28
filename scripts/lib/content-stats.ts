// Experience-budget metrics over work content (docs/WRITING.md). Shared by
// tests/style-budget.test.ts (the machine gate) and scripts/content-stats.ts (the CLI).
// Measures plain text (tags, <rt> ruby readings, whitespace stripped) so that
// budgets track what a child actually reads aloud, not markup size.
import type { Work } from '../../src/engine/types';

/** Strip ruby readings, all tags, and whitespace: the text a child reads. */
export function plainText(html: string): string {
  return html
    .replace(/<rt>[^<]*<\/rt>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, '');
}

// Hedge phrases that belong in spark/deep/cite/hist, not the main scene line
// (WRITING.md rule 4). Matched against whitespace-stripped text. The G7 fiction
// marker 「——気がした」 is deliberately NOT in this list.
export const HEDGE_PHRASES = [
  'と伝わる',
  'と伝えられ',
  'とされる',
  'といわれ',
  'とも語られ',
  'のちの世',
  '後の世',
  '後世',
];

export interface ChapterStats {
  chapterId: number;
  /** Sum of per-scene main text lengths (plain chars). */
  textTotal: number;
  /** Longest single scene main text (plain chars). */
  maxSceneText: number;
  /** Parenthetical glosses （…） in main text across the chapter. */
  glosses: number;
  /** Hedge-phrase occurrences in main text across the chapter. */
  hedges: number;
  /** Longest deep panel body (plain chars). */
  maxDeepBody: number;
  /** Highest number of person cards granted by a single scene's onEnter. */
  maxPersonGrants: number;
}

export function chapterStats(work: Work): ChapterStats[] {
  return work.story.chapters.map((ch) => {
    const st: ChapterStats = {
      chapterId: ch.id,
      textTotal: 0,
      maxSceneText: 0,
      glosses: 0,
      hedges: 0,
      maxDeepBody: 0,
      maxPersonGrants: 0,
    };
    for (const sc of Object.values(ch.scenes)) {
      const t = plainText(sc.text ?? '');
      st.textTotal += t.length;
      st.maxSceneText = Math.max(st.maxSceneText, t.length);
      st.glosses += (t.match(/（/g) ?? []).length;
      for (const h of HEDGE_PHRASES) st.hedges += t.split(h).length - 1;
      if (sc.deep) st.maxDeepBody = Math.max(st.maxDeepBody, plainText(sc.deep.body ?? '').length);
      const grants = [
        ...(sc.onEnter?.cards ?? []),
        ...(sc.onEnter?.card ? [sc.onEnter.card] : []),
      ].filter((id) => id.startsWith('p-')).length;
      st.maxPersonGrants = Math.max(st.maxPersonGrants, grants);
    }
    return st;
  });
}

export function personCardCount(work: Work): number {
  return Object.keys(work.cards).filter((id) => id.startsWith('p-')).length;
}
