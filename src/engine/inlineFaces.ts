// Inline face chips inside scene body text (docs/BACKLOG「インライン顔チップ」/
// 観察メモ追記2「本文で名前が出てくるところに出てこないとダメ」). The end-of-scene
// mention chips are a post-read index; a child reading mid-sentence needs the face
// AT the name. Scene text may wrap a name in a `<face pid="p-xxx">…名前…</face>`
// element; this transform replaces it with a small tappable chip (face + the
// original name markup) carrying `data-face-pid`. Taps are wired by delegation in
// SceneScreen (a single listener on .scene-text), not per-element, because the text
// is injected via {@html} and Svelte handlers would not attach.
//
// Why an element (not a bare token): content-stats.plainText strips all tags via
// /<[^>]+>/, so the `<face>`/`</face>` wrapper adds ZERO characters to the
// experience-budget count — the name inside is still counted exactly once. The
// authoring markup is therefore budget-neutral (tests/style-budget stays green).
import type { FaceSpec } from './types';
import { faceArt } from './art/face';

const FACE_TAG = /<face pid="([^"]+)">([\s\S]*?)<\/face>/g;

/**
 * Expand `<face pid="…">inner</face>` authoring markup in scene HTML into inline
 * face chips. A pid that resolves in both `faces` and `cards` becomes a tappable
 * chip; an unresolved pid degrades gracefully to its inner markup (plain name), so
 * a stray id never renders a broken face or an un-openable card. Reference
 * integrity is enforced by tests/scene-inline-faces.test.ts.
 *
 * Life-stage variants: a `p-x@old` pid draws the aged FACE but opens the base
 * person's CARD (there is one card per person, keyed by the base id) — so a scene
 * can show, e.g., 二位尼 as an old nun at the drowning while its chip still opens
 * the 時子 card. The tap target (`data-face-pid`) is therefore the base id.
 */
export function inlineFaces(
  html: string,
  faces: Record<string, FaceSpec>,
  cards: Record<string, unknown>,
): string {
  return html.replace(FACE_TAG, (_m, pid: string, inner: string) => {
    const cardId = pid.split('@')[0];
    if (!faces[pid] || !cards[cardId]) return inner;
    return (
      `<button type="button" class="mface" data-face-pid="${cardId}">` +
      `<span class="mface-ic">${faceArt(pid, faces)}</span>` +
      `<span class="mface-nm">${inner}</span>` +
      `</button>`
    );
  });
}
