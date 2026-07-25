// Who is playing must be readable from inside a work (observation 2026-07-25: the
// name only lived on the work-select screen), and that name is the ONE reader-supplied
// string in the app — so it must never cross the {@html} trust boundary (CLAUDE.md).
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { accountAvatar } from '../src/engine/save.svelte';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

function svelteFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return svelteFiles(p);
    return f.endsWith('.svelte') ? [p] : [];
  });
}

describe('account avatar (the identity anchor shared by every screen)', () => {
  it('is stable per id and picks from one small set', () => {
    const glyphs = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'].map(accountAvatar);
    expect(new Set(glyphs).size).toBe(6); // six slots = six distinguishable children
    expect(accountAvatar('p3')).toBe(glyphs[2]);
    expect(accountAvatar('p7')).toBe(accountAvatar('p1')); // wraps, never undefined
  });

  it('still returns a glyph for an id the parser cannot read', () => {
    // Guard on NaN: the topbar renders this before an account exists (id '').
    for (const id of ['', 'p', 'zz', 'p-1']) {
      expect(typeof accountAvatar(id)).toBe('string');
      expect(accountAvatar(id).length).toBeGreaterThan(0);
    }
  });
});

describe('{@html} trust boundary', () => {
  const files = svelteFiles(SRC);

  it('scans every component (the gate is worthless if the walk finds nothing)', () => {
    expect(files.length).toBeGreaterThan(20);
  });

  it('never passes an account-derived expression to {@html}', () => {
    const bad: string[] = [];
    for (const p of files) {
      for (const m of readFileSync(p, 'utf8').matchAll(/\{@html([^}]*)\}/g)) {
        if (/account/i.test(m[1])) bad.push(`${p.slice(SRC.length + 1)}: {@html${m[1]}}`);
      }
    }
    expect(bad).toEqual([]);
  });
});
