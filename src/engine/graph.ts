// ★R つながり図鑑の純粋ロジック（DOM 非依存・イミュータブル・決定的＝テスト可能）。
// engine/observe.ts と同じ規律: 「何が盤上にあるか・何が灯るか」だけを持ち、座標は知らない
// （幾何と SVG は art/constellation.ts）。
//
// この装置が答える問いは1つ——**その2つは、ほんとうに つながっているか**。エンジンは
// 連関を生成しない。作品が書いた辺だけが灯り、書かれていない組み合わせは罰でなく
// 「まだ、つながらない…かも？」で返る（davinci §5-5）。ゆえにここには「正解の一覧を
// 読者に見せる」関数が無い（可能な辺を先に見せると、仮説を立てる遊びが穴埋めになる）。
import type { GraphLink, GraphNode, Work, WorkGraph } from './types';

/**
 * Stars the reader has noticed: the graph nodes named by the observe hotspots they found.
 *
 * `found` is hotspot ids from the whole work (engine/observe.ts's contract), and the two
 * id spaces are deliberately separate — a hotspot is a place in one picture, a star is an
 * idea — so the crossing is made here, once, by walking what the work actually wrote.
 */
export function observedNodeIds(work: Work, found: readonly string[]): Set<string> {
  const got = new Set(found);
  const out = new Set<string>();
  for (const ch of work.story.chapters) {
    for (const sc of Object.values(ch.scenes)) {
      for (const h of sc.observe?.hotspots ?? []) {
        if (h.nodeId && got.has(h.id)) out.add(h.nodeId);
      }
    }
  }
  return out;
}

/** The links the reader has made, resolved to the graph (ids that no longer exist drop out). */
export function litLinks(graph: WorkGraph, made: readonly string[]): GraphLink[] {
  const on = new Set(made);
  return graph.links.filter((l) => on.has(l.id));
}

/**
 * Invention stars that are born: every link in `bornOf` is lit.
 *
 * Deliberately independent of which nodes are known — a link can only be made between
 * known stars in the first place (`canLink`), so birth needs no fixpoint, and a save that
 * carries a link means its endpoints were once known.
 */
export function bornNodes(graph: WorkGraph, made: readonly string[]): GraphNode[] {
  const on = new Set(made);
  return graph.nodes.filter((n) => n.bornOf?.length && n.bornOf.every((id) => on.has(id)));
}

/**
 * Invention stars that this move called into being — what the caller flashes, sounds and
 * grants a card for.
 *
 * The diff lives here rather than in the pane because it is the same kind of fact as
 * `bornNodes`: which stars exist. The pane only asks it what to celebrate.
 */
export function newlyBorn(
  graph: WorkGraph,
  before: readonly string[],
  after: readonly string[],
): GraphNode[] {
  const was = new Set(bornNodes(graph, before).map((n) => n.id));
  return bornNodes(graph, after).filter((n) => !was.has(n.id));
}

/** Every star on the board: what was noticed, plus what the reader's links gave birth to. */
export function knownNodeIds(
  graph: WorkGraph,
  observed: ReadonlySet<string>,
  made: readonly string[],
): Set<string> {
  const out = new Set<string>();
  for (const n of graph.nodes) if (!n.bornOf?.length && observed.has(n.id)) out.add(n.id);
  for (const n of bornNodes(graph, made)) out.add(n.id);
  return out;
}

/** The authored link joining these two stars, in either direction. */
export function linkBetween(graph: WorkGraph, a: string, b: string): GraphLink | null {
  if (a === b) return null;
  return (
    graph.links.find((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a)) ?? null
  );
}

/**
 * Dropping star `a` onto star `b`: the link that lights, or null for「まだ、つながらない」.
 *
 * Null covers every miss with one answer — no link written, a star not on the board, the
 * same star twice — because the reader is owed the same gentle nothing for all of them
 * (davinci §5-5: カウンタ不変・罰なし). An already-lit link returns null too: it is not a
 * failure, it just has nothing left to give (the caller sees `isNew` from `makeLink`).
 */
export function canLink(
  graph: WorkGraph,
  known: ReadonlySet<string>,
  made: readonly string[],
  a: string,
  b: string,
): GraphLink | null {
  if (!known.has(a) || !known.has(b)) return null;
  const l = linkBetween(graph, a, b);
  if (!l || made.includes(l.id)) return null;
  return l;
}

/**
 * The chapter the reader is in for pacing calls like coaching — or null when there is no
 * live chapter (fresh save, home screen, or the whole work finished).
 *
 * Read from the save's resume point (`scene.ch` — the last scene entered while its chapter
 * was not yet done; engine/story.ts stops updating it once a chapter is marked done, and
 * clears it when the work is cleared), NOT from `session.ch`, which only exists when the
 * notebook was opened from a scene and is null or stale from the home screen. Coaching hands
 * out the answer, so the source has to be the one that goes quiet when the reader is no
 * longer mid-early-chapter: a reader who has reached chapter 5 and drops back to re-read
 * chapter 1 must NOT be coached again, and `session.ch` (=1 there) would do exactly that.
 */
export function readerChapter(scene: { ch: number } | null | undefined): number | null {
  return scene?.ch ?? null;
}

/**
 * Stars that would light if `from` were dropped on them — the coaching pulse of the early
 * chapters (davinci §5-3).
 *
 * This function hands out the answer, so the window that bounds it is a parameter rather
 * than a warning in a comment: outside `graph.coachUntilChapter` it returns nothing no
 * matter who calls it, a work that never sets that field is never coached at all, and a
 * null chapter (no live chapter — see `readerChapter`) is coached the same as past the
 * window. A caller cannot forget a rule it has no way to break.
 */
export function coachTargets(
  graph: WorkGraph,
  known: ReadonlySet<string>,
  made: readonly string[],
  from: string,
  chapter: number | null,
): string[] {
  if (chapter == null || chapter > (graph.coachUntilChapter ?? 0)) return [];
  return graph.nodes.filter((n) => canLink(graph, known, made, from, n.id)).map((n) => n.id);
}

/**
 * Light one link. Already lit → `isNew:false` and the set is unchanged (the same contract
 * as collectHotspot / save.grant: the caller reads `isNew` to decide whether to play the
 * birth animation).
 */
export function makeLink(made: readonly string[], id: string): { links: string[]; isNew: boolean } {
  if (made.includes(id)) return { links: [...made], isNew: false };
  return { links: [...made, id], isNew: true };
}

export interface GraphProgress {
  /** Stars on the board (noticed + born). */
  stars: number;
  /** Links the reader has lit. */
  links: number;
  /** Invention stars born. */
  inventions: number;
}

/**
 * What the header counts. Note what is NOT here: the total number of links.
 * 「つながり 4/?」 keeps the question open (davinci §5-1) — a denominator would turn the
 * reader's own hypotheses into a checklist someone else already finished.
 */
export function graphProgress(
  graph: WorkGraph,
  observed: ReadonlySet<string>,
  made: readonly string[],
): GraphProgress {
  return {
    stars: knownNodeIds(graph, observed, made).size,
    links: litLinks(graph, made).length,
    inventions: bornNodes(graph, made).length,
  };
}
