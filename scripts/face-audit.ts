// Face duplication audit across all works (registered + skeleton) — CLI report.
//
// Motivation (observation memo 2026-07-16): "similar/identical faces are already reused
// across works" — this turns that observation into numbers, per docs/design/face-engine.md.
// The distance model (discrete parts + nose + quantized morph, tone excluded) lives in
// scripts/lib/face-audit.ts; tests/face-distinct.test.ts enforces distance >= 2 as a gate.
//
// Usage: npx vite-node scripts/face-audit.ts
import { ALL_WORKS } from './lib/works';
import {
  collectEntries, crossPersonCollisions, crossWorkInconsistencies, histogram, FEATURE_KEYS,
  weightedDistance, type Entry,
} from './lib/face-audit';

const label = (e: Entry) => `${e.work}/${e.pid}`;

const entries = collectEntries();
const people = new Set(entries.map((e) => `${e.work}/${e.base}`));
console.log(`entries: ${entries.length} specs, ${people.size} work-persons, ${ALL_WORKS.length} works\n`);

console.log('== Same-person cross-work feature drift (should be empty by design) ==');
const drift = crossWorkInconsistencies(entries);
for (const c of drift) console.log(`  ${label(c.a)} vs ${label(c.b)}: ${c.fields.join(', ')}`);
if (!drift.length) console.log('  (none)');

for (const d of [0, 1, 2]) {
  const cols = crossPersonCollisions(entries, d).filter((c) => c.fields.length === d);
  console.log(`\n== Different people, feature distance ${d} (${cols.length} pairs) ==`);
  for (const c of cols) {
    const detail = c.fields.map((f) => `${f}: ${c.a.vec[f]}/${c.b.vec[f]}`).join(', ');
    console.log(`  ${label(c.a)} vs ${label(c.b)}${detail ? ` — ${detail}` : ''}`);
  }
  if (!cols.length) console.log('  (none)');
}

// Perceptual ranking: the flat >= 3 floor can hide "clears 3 parts but all three are tiny"
// pairs (design §2). Rank the closest pairs by WEIGHTED distance to see them.
console.log('\n== Perceptually closest different-people pairs (weighted, lowest first) ==');
const pairs: { a: Entry; b: Entry; w: number; fields: string[] }[] = [];
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const a = entries[i], b = entries[j];
    if (a.base === b.base) continue;
    const fields = Object.keys(a.vec).filter((f) => a.vec[f] !== b.vec[f]);
    pairs.push({ a, b, w: weightedDistance(a, b), fields });
  }
}
pairs.sort((x, y) => x.w - y.w);
for (const p of pairs.slice(0, 12)) {
  console.log(`  ${p.w.toFixed(1)}  ${label(p.a)} vs ${label(p.b)} — ${p.fields.join(', ')}`);
}

console.log('\n== Feature usage (corpus-wide) ==');
for (const f of FEATURE_KEYS) {
  const h = histogram(entries, f);
  const row = [...h.entries()].map(([v, n]) => `${v}:${n}`).join('  ');
  console.log(`  ${f.padEnd(15)} ${row}`);
}
