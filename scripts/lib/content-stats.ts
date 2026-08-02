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
//
// A binding particle may sit between と and the stem (「とも いわれる」); the earlier
// literal list missed those. The stems stay narrow on purpose — 「と語られて」「と言われて」
// 「とされて」 also occur as plain narration or quoted speech (「ずっと 語られにくい」・
// 「『金が 無い』と 言われて」), and a false positive here demands a rewrite of good prose
// because the budget has no per-work escape hatch.
export const HEDGE_PATTERN =
  /と(?:も)?(?:伝わる|伝えられ|される|いわれ|語られる|みられ|見られ|考えられ)|のちの世|後の世|後世/g;

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
  /**
   * Longest run of prose one reader takes to get through a single scene: everything the
   * scene screen always renders (text + monologue + spark + q + creed) plus the ONE hist
   * (match + body) the branch they picked opens — hence a max over choices, not a sum.
   * Spans two surfaces (SceneScreen and the HistOverlay it opens), which is the point: the
   * reader crosses both without a break. Excludes deep (opt-in, has its own budget) and
   * minigame copy. textTotal/maxSceneText count `text` alone, so a scene can grow its hist
   * past the main line unmeasured — this is the metric that sees it.
   */
  maxSceneLoad: number;
  /** Scene id that set `maxSceneLoad` (where to cut when a chapter is over budget). */
  maxSceneLoadId: string;
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
      maxSceneLoad: 0,
      maxSceneLoadId: '',
    };
    for (const [id, sc] of Object.entries(ch.scenes)) {
      const t = plainText(sc.text ?? '');
      const histLengths = (sc.choices ?? []).map(
        (c) => plainText(c.hist?.match ?? '').length + plainText(c.hist?.body ?? '').length,
      );
      const always = [sc.monologue, sc.spark, sc.q, sc.creed?.line, sc.creed?.act];
      const load =
        t.length +
        always.reduce((n, s) => n + plainText(s ?? '').length, 0) +
        Math.max(0, ...histLengths);
      if (load > st.maxSceneLoad) {
        st.maxSceneLoad = load;
        st.maxSceneLoadId = id;
      }
      st.textTotal += t.length;
      st.maxSceneText = Math.max(st.maxSceneText, t.length);
      st.glosses += (t.match(/（/g) ?? []).length;
      st.hedges += (t.match(HEDGE_PATTERN) ?? []).length;
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
