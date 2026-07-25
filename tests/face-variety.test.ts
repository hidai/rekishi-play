// Expressive-range gate (face-engine slice 9, design §8-3-1).
//
// Observation memo 2026-07-25 ②「顔のバリエーションが少ない」. Slices 7-8 answered it on the engine
// side (new channels). The measurement that closed the loop found the rest was not missing
// vocabulary but AUTHOR HABIT: mouth 'flat' on 49% of the corpus and nose left unspecified on 47%
// — the two channels no era, rank or portrait constrains, defaulted by hand 117 times.
//
// The distance gates (tests/face-distinct.test.ts) keep people APART; they cannot see this. A cast
// can clear every distance floor and still read as one monotone crowd, because distance is pairwise
// and habit is distributional. Hence a second, distributional floor.
//
// Scope = only the two FREE channels. head/garb/hair/age/skin are pinned by era, rank and likeness
// (Heian court women are all 垂髪; old men are grey), so a share cap there would push against the
// history, not against the habit. Tightening these numbers is autonomous (CLAUDE.md); a corpus that
// cannot clear them is fixed by deciding more faces, never by raising the cap.
import { describe, expect, it } from 'vitest';
import { collectEntries, histogram } from '../scripts/lib/face-audit';

const entries = collectEntries();

// Ratchet: measured after the slice-9 redistribution (mouth flat 41/117 = 35%, nose round 36/117
// = 31%), set a few points above so ordinary authoring has room and habit does not.
const SHARE_CAP: Record<string, number> = { mouth: 0.38, nose: 0.34 };

// Per work, not just corpus-wide: variety concentrated in the newest work would still leave the
// first works monotone (and the reader plays one work at a time).
const MIN_KINDS_PER_WORK = 3;

describe('顔の表現域（作者の既定値バイアスの回帰ゲート）', () => {
  for (const [feature, cap] of Object.entries(SHARE_CAP)) {
    it(`${feature}: いちばん多い値でも corpus の ${Math.round(cap * 100)}% 未満`, () => {
      const h = histogram(entries, feature);
      const [value, n] = [...h.entries()].sort((a, b) => b[1] - a[1])[0];
      expect(
        n / entries.length,
        `${feature} '${value}' = ${n}/${entries.length} — 既定値に寄っている（語彙は足りている）`,
      ).toBeLessThan(cap);
    });
  }

  for (const feature of Object.keys(SHARE_CAP)) {
    it(`${feature}: どの作品も ${MIN_KINDS_PER_WORK} 種類以上つかう`, () => {
      const byWork = new Map<string, Set<string>>();
      for (const e of entries) {
        if (!byWork.has(e.work)) byWork.set(e.work, new Set());
        byWork.get(e.work)!.add(e.vec[feature]);
      }
      const thin = [...byWork.entries()]
        .filter(([, kinds]) => kinds.size < MIN_KINDS_PER_WORK)
        .map(([work, kinds]) => `${work}: ${[...kinds].join('/')}`);
      expect(thin).toEqual([]);
    });
  }
});
