// The 朱印 stamped on every Hist panel (engine/art/icons.ts `seal`). Its glyphs are the only
// place a work's `Hist.seal` reaches the screen, and it is pure string building — so nothing else
// in the suite looks at it, and 「心実」 shipped (a one-glyph seal picked up the DEFAULT's second
// glyph through a per-character `txt[1] || '実'` fallback).
//
// Covers the real data AND the branches the real data does not walk (the 2026-07-15 lesson: a gate
// only guards the branches shipped data steps on). ALL_WORKS = registered + skeleton works.
import { describe, it, expect } from 'vitest';
import { seal } from '../src/engine/art/icons';
import { ALL_WORKS } from './helpers/all-works';

/** The glyphs the stamp actually paints, in order. */
function glyphs(svg: string): string[] {
  return [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
}

/** Every `Hist.seal` a work ships, with the scene it sits on (for the failure message). */
function shippedSeals(): { where: string; seal: string }[] {
  const out: { where: string; seal: string }[] = [];
  for (const work of ALL_WORKS)
    for (const ch of work.story.chapters)
      for (const [id, sc] of Object.entries(ch.scenes))
        for (const c of sc.choices ?? [])
          if (c.hist?.seal) out.push({ where: `${work.id}:${id}`, seal: c.hist.seal });
  return out;
}

describe('seal (朱印)', () => {
  it('a two-glyph seal paints both glyphs, stacked', () => {
    expect(glyphs(seal('史実'))).toEqual(['史', '実']);
    expect(glyphs(seal('もし'))).toEqual(['も', 'し']);
  });

  it('a ONE-glyph seal paints that glyph alone — no house filler underneath', () => {
    // The 「心実」 regression: hidenaga/kiyomori 終章 stamp seal:'心' over the unrecorded last words.
    expect(glyphs(seal('心'))).toEqual(['心']);
    // ieyasu ch3 stamps a confidence mark (△ = 諸説) as the verdict itself.
    expect(glyphs(seal('△'))).toEqual(['△']);
  });

  it('a one-glyph seal is centered and enlarged, not left in the top slot', () => {
    const one = seal('心');
    const two = seal('史実');
    const y = (svg: string) => [...svg.matchAll(/<text[^>]*\by="([\d.]+)"/g)].map((m) => +m[1]);
    const size = (svg: string) => [...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1]);
    // Between the two-line baselines (42, 76), i.e. optically centered in the 100-unit box.
    expect(y(one)).toHaveLength(1);
    expect(y(one)[0]).toBeGreaterThan(y(two)[0]);
    expect(y(one)[0]).toBeLessThan(y(two)[1]);
    expect(size(one)[0]).toBeGreaterThan(size(two)[0]);
  });

  it('falls back to 史実 only when there is no text at all', () => {
    expect(glyphs(seal(''))).toEqual(['史', '実']);
  });

  it('splits by code point, not UTF-16 unit (a surrogate pair is ONE glyph)', () => {
    // The mechanism behind the 「心実」 fix: `txt[0]`/`txt[1]` index UTF-16 units, so a
    // supplementary-plane character (𠮷 = 2 units) would be sawn in half and stamped as two
    // broken glyphs. No shipped seal uses one — this pins the contract, not the data.
    expect(glyphs(seal('𠮷'))).toEqual(['𠮷']);
    expect(glyphs(seal('𠮷野'))).toEqual(['𠮷', '野']);
  });

  it('paints at most two glyphs (a longer seal would overflow the stamp)', () => {
    expect(glyphs(seal('記録なし'))).toEqual(['記', '録']);
  });

  it('every shipped Hist.seal is 1〜2 glyphs (nothing silently truncated)', () => {
    const seals = shippedSeals();
    expect(seals.length, 'no work ships a Hist.seal — this gate would be vacuous').toBeGreaterThan(0);
    for (const { where, seal: s } of seals)
      expect([...s].length, `${where} の seal「${s}」が 2 文字を超える`).toBeLessThanOrEqual(2);
  });
});
