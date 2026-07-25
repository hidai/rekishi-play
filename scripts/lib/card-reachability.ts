// Which cards/clues a work defines vs. which a PLAYABLE path can grant. A grant counts only if it
// sits on a scene the reader can actually walk to — reachable from its chapter's `start` by
// `next` / `choices[].to`. A defined-but-ungrantable card makes Object.keys(work.cards) completion
// structurally unreachable (the 淀殿 class — a card no play can collect, and a permanent unflippable
// "？" in the relation wheel). A dangling grant points at an id that no longer exists.
// Shared by scripts/card-reachability.ts (report) and tests/card-reachability.test.ts (gate).
import type { Work, Chapter } from '../../src/engine/types';

/** Scenes the reader can walk to from the chapter's start. */
export function reachableScenes(ch: Chapter): Set<string> {
  const seen = new Set<string>();
  const stack = [ch.start];
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id) || !ch.scenes[id]) continue;
    seen.add(id);
    const sc = ch.scenes[id];
    if (sc.next) stack.push(sc.next);
    for (const c of sc.choices ?? []) if (c.to) stack.push(c.to);
  }
  return seen;
}

/** Scenes no path leads to — written but unplayable (and any grant on them is dead). */
export function orphanScenes(work: Work): string[] {
  const out: string[] = [];
  for (const ch of work.story.chapters) {
    const live = reachableScenes(ch);
    for (const sid of Object.keys(ch.scenes)) if (!live.has(sid)) out.push(`${ch.id}/${sid}`);
  }
  return out;
}

function collect(work: Work, kind: 'card' | 'clue'): Set<string> {
  const granted = new Set<string>();
  for (const ch of work.story.chapters) {
    const live = reachableScenes(ch);
    for (const sid of live) {
      const scene = ch.scenes[sid];
      const oe = scene.onEnter;
      const one = kind === 'card' ? oe?.card : oe?.clue;
      const many = kind === 'card' ? oe?.cards : oe?.clues;
      if (one) granted.add(one);
      for (const id of many ?? []) granted.add(id);
      for (const choice of scene.choices ?? []) {
        const direct = kind === 'card' ? choice.card : choice.clue;
        const viaHist = kind === 'card' ? choice.hist?.card : choice.hist?.clue;
        if (direct) granted.add(direct);
        if (viaHist) granted.add(viaHist);
      }
    }
  }
  if (kind === 'card') {
    // A graph node's card is born from the constellation device, not from a scene.
    for (const node of work.graph?.nodes ?? []) if (node.card) granted.add(node.card);
  }
  return granted;
}

export function grantedCardIds(work: Work): Set<string> {
  return collect(work, 'card');
}

export function grantedClueIds(work: Work): Set<string> {
  return collect(work, 'clue');
}

/** Defined cards that no reachable path grants (completion structurally unreachable). */
export function ungrantedCards(work: Work): string[] {
  const granted = grantedCardIds(work);
  return Object.keys(work.cards).filter((id) => !granted.has(id));
}

/** Same for 手がかり — the notebook shows 手がかり N/M beside カード N/M. */
export function ungrantedClues(work: Work): string[] {
  const granted = grantedClueIds(work);
  return Object.keys(work.clues).filter((id) => !granted.has(id));
}

/** Grants that reference a card id which does not exist in work.cards. */
export function danglingGrants(work: Work): string[] {
  const granted = grantedCardIds(work);
  return [...granted].filter((id) => !work.cards[id]);
}

/** Grants that reference a clue id which does not exist in work.clues. */
export function danglingClueGrants(work: Work): string[] {
  const granted = grantedClueIds(work);
  return [...granted].filter((id) => !work.clues[id]);
}
