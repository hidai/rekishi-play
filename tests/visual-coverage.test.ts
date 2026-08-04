// Playtest note 2026-07-13 root cause (B): 15 of 29 kiyomori scenes shipped as the bare
// one-face fallback map and nothing flagged it — "not broken" was invisible to every gate.
// This test hard-asserts that COMPLETED works never regress to unwritten main visuals.
// Works still being authored (katsu) are deliberately NOT asserted — they are surfaced
// without failing by `npx vite-node scripts/visual-coverage.ts` (run each /eval-work),
// so new-work authoring never blocks on visuals it hasn't written yet.
// When a work's chapters are all written and its visuals inventoried, add it to COMPLETED.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { visualCoverage, classifyScene, unreachableVisuals } from '../scripts/lib/visual-coverage';

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

// No ledger and no exemption: an unreferenced figure is invisible to readers in every
// work, finished or not. All works are at 0 as of 2026-08-04 (shibusawa's `seat` was the
// only one, and it is now placed at 2-e).
describe('visual coverage: 書いたのに読者に届かない主ビジュアルが無い', () => {
  for (const work of WORKS) {
    it(`${work.id}: 参照されない図・参照先の無い鍵・シーンの無い地図エントリが無い`, () => {
      const u = unreachableVisuals(work);
      expect(u.orphans, 'どのシーンも参照しない figure / study').toEqual([]);
      expect(u.dangling, 'シーンが名ざすのに未定義の鍵').toEqual([]);
      expect(u.orphanMaps, 'シーンの無い sceneMaps エントリ').toEqual([]);
    });
  }
});

describe('visual coverage: 到達性ゲートの較正（注入して赤くなることを確かめる）', () => {
  const shibusawa = WORKS.find((w) => w.id === 'shibusawa')!;

  it('どのシーンも参照しない figure を足すと orphan に出る', () => {
    const fake = { ...shibusawa, figures: { ...shibusawa.figures, ghost: shibusawa.figures!.seat } };
    expect(unreachableVisuals(fake).orphans).toEqual(['figure:ghost']);
  });

  it('figure レジストリから鍵を抜くと dangling に出る', () => {
    const figures = { ...shibusawa.figures };
    delete figures.seat;
    expect(unreachableVisuals({ ...shibusawa, figures }).dangling).toEqual(['figure:seat']);
  });

  it('シーンの無い sceneMaps エントリは orphanMaps に出る', () => {
    const sceneMaps = { ...shibusawa.map.sceneMaps, 'x-z': { markers: [] } };
    expect(unreachableVisuals({ ...shibusawa, map: { ...shibusawa.map, sceneMaps } }).orphanMaps).toEqual(['x-z']);
  });
});

describe('visual coverage: 分類の較正', () => {
  const hidenaga = WORKS.find((w) => w.id === 'hidenaga')!;

  it('SCENE_MAPS に無いシーンは map-fallback', () => {
    expect(classifyScene(hidenaga, 'no-such-scene').kind).toBe('map-fallback');
  });

  it('label 付きマーカーの静かなアンカー地図（hidenaga 1-a）は執筆済み扱い', () => {
    // The engine fallback marker has no label — one *labeled* marker is a deliberate
    // authored choice in the calibration corpus, not a placeholder.
    expect(classifyScene(hidenaga, '1-a').kind).toBe('map');
  });

  it('label も note も route も contested も無いエントリは map-bare', () => {
    const fake = {
      ...hidenaga,
      map: { ...hidenaga.map, sceneMaps: { 'x-a': { markers: [{ at: 'nakamura', cur: 1 }] } } },
    };
    expect(classifyScene(fake, 'x-a').kind).toBe('map-bare');
  });
});
