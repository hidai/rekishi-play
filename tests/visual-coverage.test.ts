// Playtest note 2026-07-13 root cause (B): 15 of 29 kiyomori scenes shipped as the bare
// one-face fallback map and nothing flagged it — "not broken" was invisible to every gate.
// This test hard-asserts that COMPLETED works never regress to unwritten main visuals.
// Works still being authored (katsu) are deliberately NOT asserted — they are surfaced
// without failing by `npx vite-node scripts/visual-coverage.ts` (run each /eval-work),
// so new-work authoring never blocks on visuals it hasn't written yet.
// When a work's chapters are all written and its visuals inventoried, add it to COMPLETED.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { visualCoverage, classifyScene } from '../scripts/lib/visual-coverage';

const COMPLETED = ['hidenaga', 'kiyomori'];

describe('visual coverage: 完成作品の全シーンに執筆済み主ビジュアル', () => {
  for (const id of COMPLETED) {
    it(`${id}: closeup / figure / 執筆済み地図のいずれかが立っている`, () => {
      const work = WORKS.find((w) => w.id === id)!;
      expect(work, `${id} が WORKS に無い`).toBeTruthy();
      const unwritten = visualCoverage(work)
        .filter((r) => r.kind === 'map-bare' || r.kind === 'map-fallback')
        .map((r) => `${r.sceneId}(${r.kind})`);
      expect(unwritten, 'フォールバック地図のままのシーン').toEqual([]);
    });
  }
});

describe('visual coverage: 分類の較正', () => {
  const hidenaga = WORKS.find((w) => w.id === 'hidenaga')!;

  it('SCENE_MAPS に無いシーンは map-fallback', () => {
    expect(classifyScene(hidenaga, 'no-such-scene').kind).toBe('map-fallback');
  });

  it('label 付きマーカー1つの静かなアンカー地図（hidenaga 1-riddle）は執筆済み扱い', () => {
    // The engine fallback marker has no label — one *labeled* marker is a deliberate
    // authored choice in the calibration corpus, not a placeholder.
    expect(classifyScene(hidenaga, '1-riddle').kind).toBe('map');
  });

  it('label も note も route も contested も無いエントリは map-bare', () => {
    const fake = {
      ...hidenaga,
      map: { ...hidenaga.map, sceneMaps: { 'x-a': { markers: [{ at: 'nakamura', cur: 1 }] } } },
    };
    expect(classifyScene(fake, 'x-a').kind).toBe('map-bare');
  });
});
