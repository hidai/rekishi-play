// head / garb vocabulary gate.
//
// faceArt falls back to the plain hairline (head) and the kimono collar (garb) for any value
// it does not know — SILENTLY. A typo'd head in a work's faces.ts therefore ships as "the
// default face" and no type check or visual diff names it (the same dangling-key bug class
// tests/face-distinct.test.ts pins for nose kinds). This gate keeps the drawn vocabulary
// (HEAD_KINDS / GARB_KINDS) and the switch statements in face.ts honest in both directions,
// and checks that every value used by a work is actually drawn.
import { describe, expect, it } from 'vitest';
import { faceArt, HEAD_KINDS, GARB_KINDS, BROW_WEIGHTS } from '../src/engine/art/face';
import { collectEntries } from '../scripts/lib/face-audit';
import type { FaceSpec } from '../src/engine/types';

const BASE: FaceSpec = {
  tone: 'ai', head: 'x', hair: 'dark', brow: 'calm', eye: 'calm', mouth: 'flat', beard: 'none',
};
const draw = (spec: Partial<FaceSpec>) => faceArt('t', { t: { ...BASE, ...spec } });

describe('face head/garb vocabulary', () => {
  const fallbackHead = draw({ head: '__unknown__' });
  const fallbackGarb = draw({ head: 'bozu', garb: '__unknown__' });

  it('every declared head kind is actually drawn', () => {
    for (const k of HEAD_KINDS) {
      expect(draw({ head: k }), `head:'${k}' differs from the default hairline`).not.toBe(
        fallbackHead,
      );
    }
  });

  it('every declared garb kind is actually drawn', () => {
    for (const k of GARB_KINDS) {
      expect(draw({ head: 'bozu', garb: k }), `garb:'${k}' differs from the kimono collar`).not.toBe(
        fallbackGarb,
      );
    }
  });

  it('every declared brow weight is actually drawn', () => {
    const fallbackBrow = draw({ browWeight: '__unknown__' });
    for (const w of BROW_WEIGHTS) {
      expect(draw({ browWeight: w }), `browWeight:'${w}' differs from the default brow`).not.toBe(
        fallbackBrow,
      );
    }
  });

  // Declaring a kind is not enough: two garments that render the same picture would pass the
  // "differs from the fallback" checks above and still leave the wearer indistinguishable.
  it('宣言した衣どうしも互いに違う絵になる', () => {
    const seen = new Map<string, string>();
    for (const k of GARB_KINDS) {
      const svg = draw({ head: 'bozu', garb: k });
      expect(seen.get(svg), `garb:'${k}' draws the same as '${seen.get(svg)}'`).toBeUndefined();
      seen.set(svg, k);
    }
  });

  it('an unknown kind is the silent fallback (why this gate exists)', () => {
    expect(draw({ head: 'ebosi' })).toBe(fallbackHead);
    expect(draw({ head: 'bozu', garb: 'houé' })).toBe(fallbackGarb);
    expect(draw({ browWeight: 'thin' })).toBe(draw({}));
  });

  it('every head/garb/browWeight used by a work is in the vocabulary', () => {
    // collectEntries normalizes an omitted field to its engine default ('plain' / 'kimono'),
    // which is the fallback branch itself and so is legitimately outside the drawn vocabulary.
    for (const e of collectEntries()) {
      if (e.vec.head !== 'plain')
        expect(HEAD_KINDS as readonly string[], `${e.work}/${e.pid} head`).toContain(e.vec.head);
      if (e.vec.garb !== 'kimono')
        expect(GARB_KINDS as readonly string[], `${e.work}/${e.pid} garb`).toContain(e.vec.garb);
      if (e.vec.browWeight !== 'bold')
        expect(BROW_WEIGHTS as readonly string[], `${e.work}/${e.pid} browWeight`).toContain(
          e.vec.browWeight,
        );
    }
  });

  it('尼形 reads as its own head, not as bozu or zukin or onna', () => {
    const ama = draw({ head: 'ama' });
    for (const k of ['bozu', 'zukin', 'onna', 'suberakashi']) expect(ama).not.toBe(draw({ head: k }));
    // The point of the 白い被り物: fixed white cloth, never the work's camp colour.
    expect(ama).toContain('#f4efe4');
  });
});
