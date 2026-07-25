import { describe, it, expect } from 'vitest';
import { CONFIDENCE_LEGEND, confidenceInfo } from '../src/engine/confidence';
import type { Confidence } from '../src/engine/types';
import { collectedSparks } from '../src/engine/sparks';
import type { Work } from '../src/engine/types';
import { ALL_WORKS } from './helpers/all-works';

const MARKS: Confidence[] = ['◎', '○', '△', '☆'];

describe('confidence legend (◎○△☆ sureness marks)', () => {
  it('covers exactly the four marks, in confident→uncertain order, no dupes', () => {
    expect(CONFIDENCE_LEGEND.map((c) => c.mark)).toEqual(MARKS);
    const uniq = new Set(CONFIDENCE_LEGEND.map((c) => c.mark));
    expect(uniq.size).toBe(4);
  });

  it('every legend entry has a label and a blurb (child-facing)', () => {
    for (const c of CONFIDENCE_LEGEND) {
      expect(c.label.length).toBeGreaterThan(0);
      expect(c.blurb.length).toBeGreaterThan(0);
    }
  });

  // Labels/blurbs render as plain text — <ruby> can never be attached (unlike work-authored
  // {@html} fields). So every kanji must be bare-readable by a 5th grader. The old labels
  // broke this (諸説/本人談・伝説 — junior-high kanji, unreadable = part of the 2026-07-16
  // family observation 「わかりにくい」). Extending the allowlist is a deliberate act:
  // prefer kana; add a kanji only if a 小5 reads it bare without hesitation.
  it('labels/blurbs use only kana + explicitly allowed bare-readable kanji', () => {
    const BARE_KANJI_OK = new Set([...'説記録残決語言']);
    for (const c of CONFIDENCE_LEGEND) {
      const kanji = (c.label + c.blurb).match(/[一-鿿]/g) ?? [];
      for (const ch of kanji) {
        expect(BARE_KANJI_OK.has(ch), `kanji「${ch}」in "${c.label}／${c.blurb}" is not in the 小5 bare-readable allowlist`).toBe(true);
      }
    }
  });

  it('confidenceInfo resolves each mark and returns undefined for absent/unknown', () => {
    for (const m of MARKS) expect(confidenceInfo(m)?.mark).toBe(m);
    expect(confidenceInfo(undefined)).toBeUndefined();
    expect(confidenceInfo('×' as Confidence)).toBeUndefined();
  });

  // The device is named たしかさマーク (renamed from 天気マーク, 2026-07-16 — the old name
  // pointed at weather emoji the UI no longer shows). Work texts that still say 天気マーク
  // would reference a device the reader cannot find on screen — the exact name↔symbol
  // mismatch the family reported. Guard every work, including unregistered skeletons.
  it('no work data references the retired device name 天気マーク', () => {
    for (const w of ALL_WORKS) {
      expect(JSON.stringify(w).includes('天気マーク'), `work "${w.id}" still says 天気マーク (device is now たしかさマーク)`).toBe(false);
    }
  });
});

describe('collectedSparks surfaces deep.confidence', () => {
  const work = {
    totalChapters: 1,
    story: {
      chapters: [
        {
          id: 1,
          scenes: {
            a: { place: 'p', text: 't', spark: 'a spark', deep: { q: 'q', body: 'b', confidence: '☆' } },
            b: { place: 'p', text: 't', spark: 'no-deep spark' },
            c: { place: 'p', text: 't', spark: 'plain deep', deep: { q: 'q', body: 'b' } },
          },
        },
      ],
    },
  } as unknown as Work;

  it('carries confidence from the scene deep, undefined when absent', () => {
    const got = collectedSparks(work, { 1: 'done' });
    expect(got.map((e) => e.confidence)).toEqual(['☆', undefined, undefined]);
    expect(got.every((e) => e.unlocked)).toBe(true);
  });
});
