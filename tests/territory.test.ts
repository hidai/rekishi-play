// The held-span territory model: a province can be given back, not only gained. 移封・改易 are
// the era's normal course (ieyasu hands 5 provinces back in 1590 to be moved to 関東), and the
// old chapter-number model could only ever add color. Both renderers ask ownsAt, so this pins
// the semantics once for the campaign map and the scene maps together.
import { describe, it, expect } from 'vitest';
import { ownsAt } from '../src/engine/map/territory';
import { campaignStaticSvg } from '../src/engine/map/campaignMap';
import { buildSceneMap } from '../src/engine/map/sceneMap';
import { hidenaga } from '../src/works/hidenaga/index';
import { WORKS } from '../src/works/index';
import type { WorkMap } from '../src/engine/types';

const mapWith = (territory: WorkMap['territory']): WorkMap =>
  ({ ...hidenaga.map, territory }) as WorkMap;

describe('ownsAt: 数値 = その章から以後ずっと（旧モデル互換）', () => {
  const map = mapWith({ 23: 1, 25: 2 });

  it('章に達するまでは持っていない', () => {
    expect(ownsAt(map, 25, 1)).toBe(false);
  });

  it('達した章から先はずっと持っている', () => {
    expect(ownsAt(map, 25, 2)).toBe(true);
    expect(ownsAt(map, 25, 99)).toBe(true);
  });

  it('territory に無い pref は持っていない', () => {
    expect(ownsAt(map, 1, 99)).toBe(false);
  });
});

describe('ownsAt: 保有区間 = 返上できる', () => {
  const map = mapWith({
    23: [{ from: 1, to: 4 }], // 手放す（移封）
    13: [{ from: 4 }], // 移された先
    25: [{ from: 1, to: 3 }, { from: 6 }], // 一度手放し、後で取り返す
  });

  it('to の章から先は持っていない', () => {
    expect(ownsAt(map, 23, 3)).toBe(true);
    expect(ownsAt(map, 23, 4)).toBe(false);
    expect(ownsAt(map, 23, 99)).toBe(false);
  });

  it('to を書かない区間は開いたまま', () => {
    expect(ownsAt(map, 13, 3)).toBe(false);
    expect(ownsAt(map, 13, 4)).toBe(true);
    expect(ownsAt(map, 13, 99)).toBe(true);
  });

  it('区間が複数なら、間の章だけ空く', () => {
    expect(ownsAt(map, 25, 2)).toBe(true);
    expect(ownsAt(map, 25, 3)).toBe(false);
    expect(ownsAt(map, 25, 5)).toBe(false);
    expect(ownsAt(map, 25, 6)).toBe(true);
  });

  it('空の区間リストは「持っていない」', () => {
    expect(ownsAt(mapWith({ 23: [] }), 23, 99)).toBe(false);
  });
});

describe('両レンダラが区間モデルに従う（色が戻る）', () => {
  // owari = 尾張. Held through ch3, handed back at ch4 — the map must go back to land color.
  const work = { ...hidenaga, map: mapWith({ ...hidenaga.map.territory, owari: [{ from: 1, to: 4 }] }) };
  const faction = hidenaga.map.factionPhases[0].color;
  const d = hidenaga.map.geo.pref['owari'].d;

  it('進軍の地図: 返上した章では自領色を塗らない', () => {
    expect(campaignStaticSvg(work, 3)).toContain(`style="fill:${faction}" d="${d}"`);
    expect(campaignStaticSvg(work, 4)).not.toContain(`style="fill:${faction}" d="${d}"`);
  });

  it('シーン地図: 返上した章では自領色を塗らない', () => {
    const at = (vc: number) => buildSceneMap(work, vc, '1-a');
    expect(at(3)).toContain(`d="${d}" fill="${faction}"`);
    expect(at(4)).not.toContain(`d="${d}" fill="${faction}"`);
  });
});

describe('全作品の territory データが健全', () => {
  for (const w of WORKS) {
    it(`${w.id}: 章番号は 1 以上、区間は from < to`, () => {
      for (const [pid, v] of Object.entries(w.map.territory)) {
        if (typeof v === 'number') {
          expect(v, `${pid}`).toBeGreaterThan(0);
          continue;
        }
        for (const s of v) {
          expect(s.from, `${pid}`).toBeGreaterThan(0);
          if (s.to !== undefined) expect(s.to, `${pid}`).toBeGreaterThan(s.from);
        }
      }
    });
  }
});
