// Guards inline `<face pid="…">名前</face>` markup in scene body text across all
// WORKS: every pid must resolve to both a face and a card, or inlineFaces() drops
// the chip (renders the plain name, un-openable) — the memory-aid intent is lost.
// Also pins the transform's contract: known pid → tappable chip, unknown pid →
// graceful plain name, and budget-neutrality (the wrapper adds no plain-text chars).
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { inlineFaces } from '../src/engine/inlineFaces';
import { plainText } from '../scripts/lib/content-stats';

const FACE_TAG = /<face pid="([^"]+)">([\s\S]*?)<\/face>/g;

for (const work of WORKS) {
  describe(`scene inline faces: ${work.id}`, () => {
    const uses: Array<[string, string]> = []; // [sceneId, pid]
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        for (const m of (sc.text ?? '').matchAll(FACE_TAG)) uses.push([sid, m[1]]);
      }
    }

    it('every inline face pid resolves to a face and a (base) card', () => {
      for (const [sid, pid] of uses) {
        // A `p-x@old` life-stage variant draws the aged face but opens the base
        // person's card (one card per person, keyed by the base id) — see inlineFaces().
        const cardId = pid.split('@')[0];
        expect(work.faces[pid], `${sid} <face> ${pid}: face`).toBeTruthy();
        expect(work.cards[cardId], `${sid} <face> ${pid}: card ${cardId}`).toBeTruthy();
      }
    });

    it('inlined names stay budget-neutral (wrapper strips to the bare name)', () => {
      for (const ch of work.story.chapters) {
        for (const [sid, sc] of Object.entries(ch.scenes)) {
          if (!sc.text || !FACE_TAG.test(sc.text)) continue;
          FACE_TAG.lastIndex = 0;
          const stripped = sc.text.replace(FACE_TAG, (_m, _pid, inner) => inner);
          expect(plainText(sc.text), `${sid}: plain text`).toBe(plainText(stripped));
        }
      }
    });
  });
}

describe('inlineFaces transform', () => {
  const faces = { 'p-x': {} } as never;
  const cards = { 'p-x': {} };

  it('wraps a resolvable pid into a tappable chip carrying data-face-pid', () => {
    const out = inlineFaces('<p>あ<face pid="p-x">名</face>い</p>', faces, cards);
    expect(out).toContain('data-face-pid="p-x"');
    expect(out).toContain('class="mface"');
    expect(out).toContain('<span class="mface-nm">名</span>');
    expect(out).toContain('<svg'); // face art embedded
  });

  it('degrades an unknown pid to its plain inner markup (no broken chip)', () => {
    const out = inlineFaces('<face pid="p-missing">名</face>', faces, cards);
    expect(out).toBe('名');
  });

  it('drops the chip when the face exists but the card does not', () => {
    const out = inlineFaces('<face pid="p-x">名</face>', faces, {});
    expect(out).toBe('名');
  });
});
