// Face-distinctness audit library (shared by scripts/face-audit.ts CLI and
// tests/face-distinct.test.ts). See docs/design/face-engine.md.
//
// Distance model: normalized feature vectors over the discrete part keys PLUS the
// slice-2 identity channels (nose variant, quantized morph buckets). tone is excluded —
// it is the per-work camp ring color, not a facial feature. Omitted optional fields
// render as engine defaults, so they normalize to the default before comparing:
// an explicit default and an omission are the same picture.
import { ALL_WORKS } from './works';
import type { FaceMorph, FaceSpec } from '../../src/engine/types';

const DISCRETE = [
  'head', 'shape', 'eye', 'mouth', 'brow', 'beard', 'hair',
  'skin', 'iris', 'ears', 'cheek', 'age', 'garb', 'nose', 'browWeight',
] as const;

const DEFAULTS: Record<(typeof DISCRETE)[number], string> = {
  head: 'plain', shape: 'oval', eye: 'calm', mouth: 'flat', brow: 'calm',
  beard: 'none', hair: 'dark',
  skin: '#f0c69f', // face.ts default skin
  iris: '#5a3a22', // face.ts default iris (warm brown)
  ears: '-', cheek: '-', age: '-', garb: 'kimono', nose: 'std', browWeight: 'bold',
};

/** Morph channels count toward identity distance once they differ by a visible step.
 *  step = the quantization bucket width; documented ranges live in FaceMorph (types.ts). */
export const MORPH_CHANNELS: Record<keyof FaceMorph, { step: number; neutral: number; min: number; max: number }> = {
  eyeY: { step: 1, neutral: 0, min: -2, max: 2 },
  eyeScale: { step: 0.04, neutral: 1, min: 0.9, max: 1.12 },
  browY: { step: 1, neutral: 0, min: -2, max: 2 },
  mouthY: { step: 1, neutral: 0, min: -2, max: 2 },
  mouthScale: { step: 0.04, neutral: 1, min: 0.88, max: 1.12 },
  faceW: { step: 0.04, neutral: 1, min: 0.92, max: 1.08 },
};

/** Nose vocabulary accepted by face.ts noseArt (undefined = classic standard nose). */
export const NOSE_KINDS = ['tall', 'round', 'thin', 'wide'] as const;

/** Perceptual salience of each channel at a 52px card-dex thumbnail (design §2: the flat
 *  Hamming distance treats every field as equal, but "these are clearly two people" is
 *  carried mostly by the silhouette and the big features; ears/iris/garb barely read at
 *  thumbnail size). Weights are the WEIGHTED distance model that complements the unweighted
 *  >= 3 floor — a pair can clear 3 discrete parts yet still read as the same face if all
 *  three differences are low-salience. Grounded in thumbnail visibility, not taste:
 *   1.0  head/beard/shape/hair/eye/nose/mouth — outer shape, facial hair, big features.
 *   0.6  brow/browWeight/age/skin/cheek — visible but secondary at small size.
 *   0.3  garb/ears/iris — below the chin or tiny; barely register in a 52px dex chip.
 *   0.4/step  morph — deliberately fine geometric nudges; one quantized step is subtle. */
export const FEATURE_WEIGHTS: Record<string, number> = {
  head: 1, beard: 1, shape: 1, hair: 1, eye: 1, nose: 1, mouth: 1,
  brow: 0.6, age: 0.6, skin: 0.6, cheek: 0.6, browWeight: 0.6,
  garb: 0.3, ears: 0.3, iris: 0.3,
  'morph:eyeY': 0.4, 'morph:eyeScale': 0.4, 'morph:browY': 0.4,
  'morph:mouthY': 0.4, 'morph:mouthScale': 0.4, 'morph:faceW': 0.4,
};

/** Weighted perceptual distance between two faces (sum of the salience weights of the
 *  fields that differ). Complements the unweighted field count in Collision.fields. */
export function weightedDistance(a: Entry, b: Entry): number {
  return diff(a, b).reduce((s, f) => s + (FEATURE_WEIGHTS[f] ?? 1), 0);
}

export interface Entry {
  work: string;
  pid: string; // full key, e.g. 'p-hideyoshi@grief'
  base: string; // person identity, e.g. 'p-hideyoshi'
  vec: Record<string, string>;
}

export function normalize(spec: FaceSpec): Record<string, string> {
  const vec: Record<string, string> = {};
  for (const f of DISCRETE) {
    const raw = (spec as unknown as Record<string, unknown>)[f];
    vec[f] = typeof raw === 'string' && raw !== '' && raw !== 'none' ? raw : DEFAULTS[f];
  }
  for (const [ch, q] of Object.entries(MORPH_CHANNELS)) {
    const raw = spec.morph?.[ch as keyof FaceMorph] ?? q.neutral;
    vec[`morph:${ch}`] = String(Math.round((raw - q.neutral) / q.step));
  }
  return vec;
}

function diff(a: Entry, b: Entry): string[] {
  return Object.keys(a.vec).filter((f) => a.vec[f] !== b.vec[f]);
}

export function collectEntries(): Entry[] {
  const entries: Entry[] = [];
  for (const work of ALL_WORKS) {
    for (const [pid, spec] of Object.entries(work.faces)) {
      if (pid === '_default') continue;
      entries.push({ work: work.id, pid, base: pid.split('@')[0], vec: normalize(spec) });
    }
  }
  return entries;
}

export interface Collision {
  a: Entry;
  b: Entry;
  fields: string[];
}

/** Pairs of different people at feature distance <= maxDist (tone excluded).
 *  Aging/emotion variants of one person and the same person across works are excluded
 *  (see crossWorkInconsistencies for the latter). */
export function crossPersonCollisions(entries: Entry[], maxDist: number): Collision[] {
  const out: Collision[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j];
      if (a.base === b.base) continue;
      const fields = diff(a, b);
      if (fields.length <= maxDist) out.push({ a, b, fields });
    }
  }
  return out;
}

export interface WeightedCollision extends Collision {
  weight: number;
}

/** Pairs of different people whose WEIGHTED perceptual distance is below minDist (an epsilon
 *  guards float sums like 0.4+0.4+1.0). Complements crossPersonCollisions: a pair can clear
 *  the >= 3 field-count floor yet still land here if all its differences are low-salience or
 *  morph-only (design §2 — the flat count hides "reads as the same face at 52px"). */
export function weightedCollisions(entries: Entry[], minDist: number): WeightedCollision[] {
  const out: WeightedCollision[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j];
      if (a.base === b.base) continue;
      const weight = weightedDistance(a, b);
      if (weight < minDist - 1e-9) out.push({ a, b, fields: diff(a, b), weight });
    }
  }
  return out;
}

/** Same person appearing in two works with different features (tone excluded). */
export function crossWorkInconsistencies(entries: Entry[]): Collision[] {
  const out: Collision[] = [];
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i], b = entries[j];
      if (a.base !== b.base || a.work === b.work || a.pid !== b.pid) continue;
      const fields = diff(a, b);
      if (fields.length > 0) out.push({ a, b, fields });
    }
  }
  return out;
}

export function histogram(entries: Entry[], f: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of entries) m.set(e.vec[f], (m.get(e.vec[f]) ?? 0) + 1);
  return new Map([...m.entries()].sort((x, y) => y[1] - x[1]));
}

export const FEATURE_KEYS: readonly string[] = [
  ...DISCRETE,
  ...Object.keys(MORPH_CHANNELS).map((ch) => `morph:${ch}`),
];
