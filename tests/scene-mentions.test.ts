// Guards Scene.mentions data integrity across all WORKS: every mentioned pid must
// resolve to both a face spec and a card, or the face chip silently renders nothing
// (see the guard in SceneScreen.svelte) and the memory-aid intent is lost.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';

for (const work of WORKS) {
  describe(`scene mentions: ${work.id}`, () => {
    const entries: Array<[string, string[]]> = [];
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        if (sc.mentions?.length) entries.push([sid, sc.mentions]);
      }
    }

    it('every mentioned person id resolves to a face and a card', () => {
      for (const [sid, mentions] of entries) {
        for (const pid of mentions) {
          expect(work.faces[pid], `${sid} mentions ${pid}: face`).toBeTruthy();
          expect(work.cards[pid], `${sid} mentions ${pid}: card`).toBeTruthy();
        }
      }
    });
  });
}
