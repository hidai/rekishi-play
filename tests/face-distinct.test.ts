// Face distinctness gate (face-engine slice 2, docs/design/face-engine.md C-3).
//
// Observation memo 2026-07-16: "similar/identical faces are already reused across works"
// — the audit found one pixel-identical pair and 15 pairs one part apart, some inside a
// single work. This gate keeps every pair of DIFFERENT people at feature distance >= 3
// (tone excluded — it is the per-work camp color, not a facial feature), across ALL works
// including skeletons, so the collision class cannot regrow as casts accumulate.
//
// Threshold history: slice 2 shipped the gate at >= 2. Slice 3 pushed the whole corpus to
// >= 3, and slice 5 (this cycle, davinci faces now written) raises the gate to >= 3 — the
// distance-2 band is where the design doc (§2) flagged card-dex thumbnails at 52px as "hard
// to tell apart", so barring it permanently is the machine guarantee behind observation
// memo #1 ("face variation must survive as works accumulate"). Tightening a gate is
// autonomous (CLAUDE.md); a future cast that cannot clear >= 3 is fixed by adding another
// distinguishing feature/morph, never by loosening this number.
//
// Slice 6 adds a second, complementary floor: a WEIGHTED perceptual distance (below), because
// the flat count is blind to salience — the former pixel-identical pair (takatora/tomomori) had
// been pushed to field-distance 3 by a nose swap + morph nudges, yet still summed to only 1.8
// weighted (design §2's "reads the same at 52px"). The weighted floor caught it and the two
// worst pairs were split on a big feature (takatora beard:full, antoku eye:calm).
//
// It also pins the two contracts the distance model relies on:
//  - the same person must keep identical features across works (camp tone may differ);
//  - nose kinds and morph values must stay inside the vocabulary/ranges face.ts draws
//    correctly — an unknown nose kind renders the default nose SILENTLY (the dangling-key
//    bug class), and out-of-range morphs distort the face geometry.
import { describe, expect, it } from 'vitest';
import {
  collectEntries, crossPersonCollisions, crossWorkInconsistencies, weightedCollisions,
  MORPH_CHANNELS, NOSE_KINDS,
} from '../scripts/lib/face-audit';
import { ALL_WORKS } from '../scripts/lib/works';

// Perceptual floor (slice 6): the unweighted >= 3 gate treats every field as equal, but a pair
// can clear 3 discrete parts and still read as the same face at a 52px card-dex chip if all
// three differences are low-salience or morph-only (design §2). weightedCollisions sums the
// per-channel thumbnail-salience weights (FEATURE_WEIGHTS); this floor bars pairs below the
// equivalent of two big-feature differences. Tightening is autonomous (CLAUDE.md) — a future
// cast that cannot clear this floor is fixed by adding a distinguishing feature, never by
// lowering this number.
//
// Slice 7 raised the floor 2.0 -> 2.2: the four pairs at 2.0 were split on a salient feature
// (michelangelo shape:gaunt, hideaki shape:long, hidetsugu eye:narrow).
//
// Slice 8 raises the floor 2.2 -> 2.4. Four pairs sat below 2.4: tokuko/tsukiyama (tsukiyama
// mouth:frown — the doomed consort's sunken mouth), yoshitsune/ieyasu@young (yoshitsune eye:lively
// — the agile prodigy, off the watchful heir's sharp), yoshinobu/shozan and (the empirical loop
// again) shozan/tesshu. The first shozan try (shape:square) split it from yoshinobu but collided
// with same-work tesshu (also square, weighted 2.0), so shozan took nose:tall instead — one salient
// feature that clears BOTH the long-faced Yoshinobu and the square-faced Tesshu. The pre-existing
// katsuie/yoshitomo pair (2.3, the fierce-general archetype) was split by katsuie age:'old' — the
// grey veteran "鬼柴田", off Yoshitomo's dark hair. The whole corpus now packs a dense band at
// exactly 2.4, so the next notch (2.6) would need many splits at once — raise it a smaller
// increment or a targeted band next time.
const PERCEPTUAL_FLOOR = 2.4;

const entries = collectEntries();
const label = (c: { a: { work: string; pid: string }; b: { work: string; pid: string }; fields: string[] }) =>
  `${c.a.work}/${c.a.pid} vs ${c.b.work}/${c.b.pid} (${c.fields.join(', ') || 'identical'})`;

describe('顔の識別性ゲート（別人は距離 ≥ 3）', () => {
  it('別人どうしの顔が距離 ≤ 2 のペアは無い（全作品横断・tone 除外）', () => {
    expect(crossPersonCollisions(entries, 2).map(label)).toEqual([]);
  });

  it('同一人物は作品間で造作が一致する（tone は作品ごとの陣営色なので除外）', () => {
    expect(crossWorkInconsistencies(entries).map(label)).toEqual([]);
  });

  it(`別人どうしの知覚重み付き距離は ≥ ${PERCEPTUAL_FLOOR}（低知覚チャネル・morph だけで距離を稼がない）`, () => {
    const thin = weightedCollisions(entries, PERCEPTUAL_FLOOR)
      .map((c) => `${label(c)} = ${c.weight.toFixed(1)}`);
    expect(thin).toEqual([]);
  });
});

describe('鼻・morph の語彙とレンジ（face.ts が正しく描ける値だけを許す）', () => {
  const noseKinds = new Set<string>(NOSE_KINDS);
  for (const work of ALL_WORKS) {
    it(`${work.id}: nose は既知の語彙・morph は文書化レンジ内`, () => {
      for (const [pid, spec] of Object.entries(work.faces)) {
        if (spec.nose !== undefined) {
          expect(noseKinds.has(spec.nose), `${work.id}/${pid}: unknown nose '${spec.nose}'`).toBe(true);
        }
        for (const [ch, raw] of Object.entries(spec.morph ?? {})) {
          const q = MORPH_CHANNELS[ch as keyof typeof MORPH_CHANNELS];
          expect(q, `${work.id}/${pid}: unknown morph channel '${ch}'`).toBeDefined();
          expect(
            raw >= q.min && raw <= q.max,
            `${work.id}/${pid}: morph.${ch}=${raw} outside [${q.min}, ${q.max}]`,
          ).toBe(true);
        }
        // eyeScale MULTIPLIES the legacy 1.11 child eye boost in faceArt — the composed
        // scale would leave the documented range, so bar the channel on child faces.
        expect(
          spec.age === 'child' && spec.morph?.eyeScale !== undefined,
          `${work.id}/${pid}: morph.eyeScale is not allowed on age:'child' faces`,
        ).toBe(false);
      }
    });
  }
});
