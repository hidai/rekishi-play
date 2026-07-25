// Locks the scene-map locator (隅のミニ地図＝「いま ここ」) against the failure a family
// playtest found (observation memo 2026-07-15): katsu's gold current-position dot and red
// view rect painted OUTSIDE the white locator panel in 15 of 22 scenes. Root cause was a
// fixed window — the mini-map assumed "the country = the legacy geo.vb rectangle", which
// ends east of Shizuoka, so 江戸 (x≈1062 > vb's 1000) fell out of the box. The human asked
// for generalization, not a patch, so these tests assert the *derived* invariant rather than
// any pixel: whatever a work's stage is (west, east, or overseas), every place it pins must
// land inside its own locator box. A future work staged past the province data, or a return
// to any hardcoded window, fails here instead of on a child's screen.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { buildSceneMap, locatorWindow, sceneGeo } from '../src/engine/map/sceneMap';
import { gazXY } from '../src/engine/map/project';
import type { Work } from '../src/engine/types';

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
const inside = (b: Box, x: number, y: number, r = 0) =>
  x - r >= b.x && x + r <= b.x + b.w && y - r >= b.y && y + r <= b.y + b.h;

/** Pull the locator's panel box, mini-map box and gold dot out of a rendered scene map. */
function readLocator(svg: string) {
  const i = svg.indexOf('<g class="loc"');
  if (i < 0) return null;
  const frag = svg.slice(i);
  const rect = (re: RegExp): Box | null => {
    const m = re.exec(frag);
    return m ? { x: +m[1], y: +m[2], w: +m[3], h: +m[4] } : null;
  };
  const boxes = [...frag.matchAll(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)"/g)];
  const dot = /<circle cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)" fill="var\(--gold-deep\)"/.exec(frag);
  return {
    panel: { x: +boxes[0][1], y: +boxes[0][2], w: +boxes[0][3], h: +boxes[0][4] } as Box,
    mini: { x: +boxes[1][1], y: +boxes[1][2], w: +boxes[1][3], h: +boxes[1][4] } as Box,
    view: rect(/<rect x="([-\d.]+)" y="([-\d.]+)" width="([-\d.]+)" height="([-\d.]+)" fill="var\(--seal\)"/),
    dot: dot ? { x: +dot[1], y: +dot[2], r: +dot[3] } : null,
  };
}

/** Every scene the reader can reach, not just the ones with an authored map. */
function allScenes(work: Work): { ch: number; id: string }[] {
  return work.story.chapters.flatMap((c) => Object.keys(c.scenes).map((id) => ({ ch: c.id, id })));
}

describe('scene-map locator: 「いま ここ」がパネルからはみ出さない', () => {
  for (const work of WORKS) {
    it(`${work.id}: 全シーンで金の現在地ドットがミニ地図の中にある`, () => {
      const out: string[] = [];
      for (const { ch, id } of allScenes(work)) {
        const loc = readLocator(buildSceneMap(work, ch, id));
        if (!loc?.dot) continue; // closeup scenes / wide views draw no locator
        if (!inside(loc.mini, loc.dot.x, loc.dot.y, loc.dot.r)) {
          out.push(`${id} dot(${loc.dot.x.toFixed(0)},${loc.dot.y.toFixed(0)}) ∉ ${JSON.stringify(loc.mini)}`);
        }
      }
      expect(out, 'ドットがミニ地図の外に出たシーン').toEqual([]);
    });

    it(`${work.id}: ミニ地図パネルがシーン地図の表示範囲の中にある`, () => {
      const out: string[] = [];
      for (const { ch, id } of allScenes(work)) {
        const svg = buildSceneMap(work, ch, id);
        const loc = readLocator(svg);
        if (!loc) continue;
        const [x0, y0, bw, bh] = /viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/
          .exec(svg)!
          .slice(1)
          .map(Number);
        const view = { x: x0, y: y0, w: bw, h: bh };
        const p = loc.panel;
        if (!inside(view, p.x, p.y) || !inside(view, p.x + p.w, p.y + p.h)) out.push(id);
      }
      expect(out, 'パネルが画面外にはみ出したシーン').toEqual([]);
    });
  }

  it('赤い表示範囲わくとベース海岸線はミニ地図の箱にクリップされる（枠外に浮かない）', () => {
    // The view rect can reach past the country when a scene looks out to sea, and the base
    // coastline runs to Hokkaido/Okinawa — both must be inside the clipped group. The gold dot
    // must stay outside it (clipping it would hide the one thing the child looks for).
    const svg = buildSceneMap(WORKS[0], 1, WORKS[0].story.chapters[0].start);
    const frag = svg.slice(svg.indexOf('<g class="loc"'));
    const clipped =
      /<g clip-path="url\(#[^"]+\)"><g transform="[^"]*">[\s\S]*?<\/g>\s*<rect [^>]*fill="var\(--seal\)"[^>]*\/><\/g>/.exec(
        frag,
      );
    expect(clipped, 'ベース海岸線＋赤わくが1つのクリップ群に入っている').toBeTruthy();
    expect(clipped![0], '金のドットはクリップしない（消えるより はみ出しを検知させる）').not.toContain(
      'var(--gold-deep)',
    );
    expect(frag, '金のドットは描かれる').toContain('var(--gold-deep)');
  });
});

describe('locatorWindow: 窓は作品の内容から導く（固定窓に戻さない）', () => {
  for (const work of WORKS) {
    // Per STAGE, not per work: a scene may be staged in another geo (katsu ch3's Pacific band), and a
    // place means different pixels in each projection — San Francisco is a real dot on the ocean band
    // and ~24,000 units west of Kyushu on the Japan one. The invariant is unchanged, only sharpened:
    // whatever window a scene's locator draws, that scene's pins are inside it.
    it(`${work.id}: 窓がこの作品の pin する全地点を含む`, () => {
      const map = work.map;
      const out: string[] = [];
      for (const [sid, def] of Object.entries(map.sceneMaps)) {
        const geo = sceneGeo(work, sid);
        const [x, y, w, h] = locatorWindow(work, geo);
        const box = { x, y, w, h };
        for (const m of def.markers ?? []) {
          if (m.off || !map.gaz[m.at]) continue;
          const p = gazXY(geo, map.gaz[m.at]);
          if (!inside(box, p.x, p.y)) out.push(`${sid}/${m.at}(${p.x.toFixed(0)},${p.y.toFixed(0)})`);
        }
      }
      // Scenes with no authored map fall back to their chapter's default place, always on the home geo.
      const [hx, hy, hw, hh] = locatorWindow(work);
      for (const key of Object.values(map.chapterPoints)) {
        if (!map.gaz[key]) continue;
        const p = gazXY(map.geo, map.gaz[key]);
        if (!inside({ x: hx, y: hy, w: hw, h: hh }, p.x, p.y)) {
          out.push(`${key}(${p.x.toFixed(0)},${p.y.toFixed(0)})`);
        }
      }
      expect(out, '窓の外に出た地点').toEqual([]);
    });

    it(`${work.id}: レガシー固定窓 geo.vb をそのまま使っていない`, () => {
      expect(locatorWindow(work)).not.toEqual([0, 0, work.map.geo.vb[0], work.map.geo.vb[1]]);
    });
  }

  it('東に寄った作品は窓が自分で広がる（西日本固定に戻らない）', () => {
    // A synthetic work staged past the province data (常陸's x≈1165) — the case the legacy
    // fixed window silently broke. The window must grow to hold it, not clamp it away.
    const base = WORKS[0];
    const far = {
      ...base,
      map: {
        ...base.map,
        gaz: { ...base.map.gaz, faredge: { x: 1400, y: -300 } },
        chapterPoints: { ...base.map.chapterPoints },
        sceneMaps: { 'x-a': { markers: [{ at: 'faredge', cur: 1, label: 'はて' }] } },
      },
    } as unknown as Work;
    const [x, y, w, h] = locatorWindow(far);
    expect(inside({ x, y, w, h }, 1400, -300)).toBe(true);
    const loc = readLocator(buildSceneMap(far, 1, 'x-a'));
    expect(loc?.dot, 'ドットが描かれる').toBeTruthy();
    expect(inside(loc!.mini, loc!.dot!.x, loc!.dot!.y, loc!.dot!.r)).toBe(true);
  });

  it('枠外むけ（off）の方向だけの地点は窓を広げない', () => {
    // katsu's 西洋 is not a place but a heading: a px placeholder far out over the East China Sea,
    // registered purely to aim ch2's edge arrow at the world the West's ships came from. Framing it
    // would zoom the mini-map out into empty ocean. (サンフランシスコ used to be such a placeholder
    // too; on the Pacific band it became a real dot at its real longitude, which is the point.)
    const katsu = WORKS.find((w) => w.id === 'katsu');
    if (!katsu) return;
    expect(katsu.map.gaz.seiyo.x).toBeLessThan(-2000); // still a direction-only placeholder
    const [, , w] = locatorWindow(katsu);
    expect(w).toBeLessThan(2000);
  });

  it('州の無いシルエットだけの geo は陸を枠に取る / 陸も pin も無ければ vb に戻る', () => {
    const base = WORKS[0];
    const noPref = {
      ...base,
      map: { ...base.map, geo: { ...base.map.geo, pref: {} } },
    } as unknown as Work;
    const [, , w] = locatorWindow(noPref);
    expect(w).toBeGreaterThan(base.map.geo.vb[0]); // frames the real coastline (北海道〜沖縄)

    const empty = {
      ...base,
      map: {
        ...base.map,
        geo: { ...base.map.geo, pref: {}, land: undefined },
        gaz: {},
        sceneMaps: {},
        chapterPoints: {},
        mapPoints: [],
      },
    } as unknown as Work;
    expect(locatorWindow(empty)).toEqual([0, 0, base.map.geo.vb[0], base.map.geo.vb[1]]);
  });
});
