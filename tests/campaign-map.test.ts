// Locks the data-driven campaign map (手帳「進軍の地図」) after decoupling routes /
// faction colors / legend text from the engine into WorkMap data. Guards G4: the
// engine must render only from work data, and hidenaga's output must be unchanged.
// applyMapView is not covered here — it depends on SVGPathElement.getTotalLength /
// getPointAtLength, which jsdom does not implement (verified in a real browser).
import { describe, it, expect } from 'vitest';
import {
  campaignSvg,
  campaignStaticSvg,
  campaignLegendHtml,
  campaignViewBox,
} from '../src/engine/map/campaignMap';
import { activeFactionColor, ownsAt } from '../src/engine/map/territory';
import { hidenaga } from '../src/works/hidenaga/index';
import { ieyasu } from '../src/works/ieyasu/index';
import { kiyomori } from '../src/works/kiyomori/index';
import { gazXY } from '../src/engine/map/project';

describe('campaignSvg: routes render from data (no hardcoded keys)', () => {
  const svg = campaignSvg(hidenaga);

  it('draws every campaignRoute path by key with the plain .mroute class', () => {
    for (const r of hidenaga.map.campaignRoutes) {
      expect(svg).toContain(`<path id="rt-${r.key}" class="mroute" d="${hidenaga.map.routes[r.key].d}">`);
    }
  });

  it('keeps the array draw order (later route on top)', () => {
    const keys = hidenaga.map.campaignRoutes.map((r) => r.key);
    const positions = keys.map((k) => svg.indexOf(`id="rt-${k}"`));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    // hidenaga: mino under, ogaeshi (中国大返し) on top
    expect(keys).toEqual(['mino', 'ogaeshi']);
  });

  it('emits the shared runner + label because one route sets runnerLabel', () => {
    expect(svg).toContain('id="rt-runner"');
    expect(svg).toContain('id="rt-lb"');
  });

  it('aria-label uses the protagonist name from work data', () => {
    expect(svg).toContain('aria-label="秀長の 進軍と 領土の 地図"');
  });
});

// campaignStaticSvg is the rasterizable twin of campaignSvg + applyMapView: since applyMapView
// only runs in a browser (getTotalLength/rAF), the campaign map had no dev-loop raster self-check.
// This baked static form gives scripts/render-campaign.ts a check path and closes that coverage
// gap; the assertions below guard that the baked fills mirror the runtime decision rules.
describe('campaignStaticSvg: bakes runtime fills for the raster self-check path', () => {
  const svg = campaignStaticSvg(hidenaga, 99); // vc=99 → fully revealed
  const map = hidenaga.map;

  it('produces a map-svg root with finite coordinates (no NaN)', () => {
    expect(svg).toContain('class="map-svg"');
    expect(svg).not.toContain('NaN');
  });

  it('paints owned provinces with the active faction color, others with map-land', () => {
    const faction = activeFactionColor(map, 99); // var(--map-faction-b) at the last phase
    expect(svg).toContain(`style="fill:${faction}"`); // at least one owned province
    // every province whose territory era is reached must carry the faction fill, not map-land
    for (const [pid, o] of Object.entries(map.geo.pref)) {
      if (o.c) continue;
      if (ownsAt(map, pid, 99)) expect(svg).toContain(`style="fill:${faction}" d="${o.d}"`);
    }
  });

  it('marks the protagonist domains with the gold-bordered class', () => {
    const domains = new Set<string>();
    Object.values(map.protagonistDomains).forEach((ids) => ids.forEach((id) => domains.add(String(id))));
    expect(domains.size).toBeGreaterThan(0);
    expect(svg).toContain('class="pf domain"');
  });

  it('reveals every map point and route at vc=99 (nothing left hidden)', () => {
    expect((svg.match(/class="mmark show"/g) || []).length).toBe(map.mapPoints.length);
    for (const r of map.campaignRoutes) {
      expect(svg).toContain(`style="opacity:1;stroke:${r.color}" d="${map.routes[r.key].d}"`);
    }
  });

  it('reveals fewer points earlier: vc=1 shows only ch<=1 points', () => {
    const early = campaignStaticSvg(hidenaga, 1);
    const shown = (early.match(/class="mmark show"/g) || []).length;
    expect(shown).toBe(map.mapPoints.filter((p) => p.ch <= 1).length);
    expect(shown).toBeLessThan(map.mapPoints.length);
  });
});

describe('campaignViewBox: content-fit frame + base coastline (Phase 2 (a))', () => {
  const map = hidenaga.map;

  it('frames the action (non-ctx provinces), not the legacy fixed geo.vb window', () => {
    const [x, y, w, h] = campaignViewBox(hidenaga);
    expect([x, y, w, h].every(Number.isFinite)).toBe(true);
    // must differ from the hardcoded legacy window [0,0,vb]
    expect([x, y, w, h]).not.toEqual([0, 0, map.geo.vb[0], map.geo.vb[1]]);
    // the east ctx provinces (関東 reach x≈1165) are clipped: the frame ends well before them.
    expect(x + w).toBeLessThan(1100);
  });

  it('falls back to geo.vb for a silhouette-only geo (empty pref = no stage to frame)', () => {
    // e.g. an overseas GEO like GEO_US_WEST ships coastline rings but no province polygons.
    const silhouette = {
      ...hidenaga,
      map: { ...map, mapPoints: [], campaignRoutes: [], geo: { ...map.geo, pref: {} } },
    } as typeof hidenaga;
    expect(campaignViewBox(silhouette)).toEqual([0, 0, map.geo.vb[0], map.geo.vb[1]]);
  });

  it('both live and static maps lay the base national coastline under the provinces', () => {
    const [x, y, w, h] = campaignViewBox(hidenaga);
    for (const svg of [campaignSvg(hidenaga), campaignStaticSvg(hidenaga, 99)]) {
      const base = svg.indexOf('class="mland-base"');
      const land = svg.indexOf('class="mland"');
      expect(base).toBeGreaterThan(-1); // base coastline is present
      expect(base).toBeLessThan(land); // ...and drawn under the province layer
      // the map window matches campaignViewBox (no leftover "0 0 W H" legacy window); the
      // static twin only grows downward, by its baked legend band.
      const m = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/)!;
      expect([+m[1], +m[2], +m[3]]).toEqual([x, y, w]);
      expect(+m[4]).toBeGreaterThanOrEqual(h);
    }
  });
});

describe('campaignStaticSvg: bakes the legend colour keys (raster self-check reads colours)', () => {
  it('names the faction / domain / route colours at the viewed chapter, ruby stripped', () => {
    const svg = campaignStaticSvg(hidenaga, 4);
    expect(svg).toContain('class="map-legend-band"');
    expect(svg).toContain('織田方の 領地（本能寺の 前）');
    expect(svg).toContain('豊臣（羽柴）方の 領地');
    expect(svg).toContain('秀長 自身の 領国');
    expect(svg).toContain('中国大返し 備中高松→山崎（約230km）'); // <b> stripped, no tags in SVG text
    expect(svg).not.toContain('<b>');
  });

  it('shows only the keys reached by the viewed chapter, and none before chapter 1', () => {
    expect(campaignStaticSvg(hidenaga, 1)).not.toContain('豊臣（羽柴）方の 領地');
    const early = campaignStaticSvg(hidenaga, 0);
    expect(early).not.toContain('class="map-legend-band"');
    expect(early).not.toContain('織田方の 領地');
  });

  it('strips ruby readings from a route legend (kiyomori 海の 道)', () => {
    const svg = campaignStaticSvg(kiyomori, 99);
    expect(svg).toContain('大輪田泊');
    expect(svg).not.toContain('おおわだのとまり');
  });
});

describe('activeFactionColor: last phase whose fromCh <= vc', () => {
  const map = hidenaga.map;
  it('returns null before any phase, then phase colors by chapter', () => {
    expect(activeFactionColor(map, 0)).toBe(null);
    expect(activeFactionColor(map, 1)).toBe('var(--map-faction-a)');
    expect(activeFactionColor(map, 3)).toBe('var(--map-faction-a)');
    expect(activeFactionColor(map, 4)).toBe('var(--map-faction-b)');
    expect(activeFactionColor(map, 7)).toBe('var(--map-faction-b)');
  });
});

describe('campaignLegendHtml: faction / route / point text from data', () => {
  it('vc<1 shows the intro with the protagonist name and no faction swatch', () => {
    const h = campaignLegendHtml(hidenaga, 0);
    expect(h).toContain('章を すすめると');
    expect(h).toContain('秀長');
    expect(h).not.toContain('織田方');
  });

  it('early chapters show only the first faction phase (no toyo, no route)', () => {
    const h = campaignLegendHtml(hidenaga, 1);
    expect(h).toContain('織田方の 領地');
    expect(h).toContain('秀長 自身の 領国');
    expect(h).toContain('中村'); // ch1 map point
    expect(h).not.toContain('豊臣');
    expect(h).not.toContain('中国大返し');
  });

  it('from ch4 shows both faction phases and the ogaeshi route legend', () => {
    const h = campaignLegendHtml(hidenaga, 4);
    expect(h).toContain('織田方の 領地');
    expect(h).toContain('豊臣（羽柴）方の 領地');
    expect(h).toContain('中国大返し</b> 備中高松→山崎（約230km）');
    expect(h).toContain('賤ヶ岳'); // ch4 map point
  });

  it('the runnerless route (mino) never appears in the legend', () => {
    for (let vc = 1; vc <= hidenaga.totalChapters; vc++) {
      const h = campaignLegendHtml(hidenaga, vc);
      // mino has no legend field, so its label (賤ヶ岳の美濃大返し) must not surface
      expect(h).not.toContain('美濃大返し');
    }
  });
});

// ieyasu's footprints are written in REAL [lon,lat] (its gaz is), and its stage is the east — the
// two things a second campaign map needed the engine and the geo model to allow.
describe('ieyasu: lon/lat footprints on a work-owned stage', () => {
  const map = ieyasu.map;

  it('projects every lon/lat footprint into the frame (no raw degrees leaking into the SVG)', () => {
    const [X, Y, W, H] = campaignViewBox(ieyasu);
    const svg = campaignStaticSvg(ieyasu, 99);
    const marks = [...svg.matchAll(/class="mmark show" transform="translate\(([-\d.]+),([-\d.]+)\)"/g)];
    expect(marks.length).toBe(map.mapPoints.length);
    for (const [, sx, sy] of marks) {
      expect(+sx).toBeGreaterThan(X);
      expect(+sx).toBeLessThan(X + W);
      expect(+sy).toBeGreaterThan(Y);
      expect(+sy).toBeLessThan(Y + H);
    }
  });

  it('frames the east (江戸 is inside the frame, 薩摩 is not)', () => {
    const [X, , W] = campaignViewBox(ieyasu);
    const edo = gazXY(map.geo, map.gaz.edo);
    expect(edo.x).toBeGreaterThan(X);
    expect(edo.x).toBeLessThan(X + W);
    expect(X).toBeGreaterThan(400); // 九州 (x≈200) is context that runs off the west edge
  });

  it('prints no 領国 key, because a footprints-only map gold-borders nothing', () => {
    const h = campaignLegendHtml(ieyasu, 7);
    expect(map.protagonistDomains).toEqual({});
    expect(h).not.toContain('自身の 領国');
    expect(h).toContain('日光'); // ch7 footprint
  });

  // Blot guard, calibrated on the raster (2026-07-23): a mark is an r=14 dot with its own label
  // 19 units above it, so a province label at the same centroid is unreadable. 武蔵/江戸 at 30 is
  // the tightest pair that survived the raster (the label sits beside the dot, under 江戸's own
  // label); 愛知・静岡・栃木・大阪 were dropped from mapLabels because they sat right on a mark.
  it('leaves no province centroid label under a footprint (raster blot guard)', () => {
    for (const [pid, nm] of Object.entries(map.mapLabels)) {
      const o = map.geo.pref[pid];
      expect(o, `mapLabel ${nm} has no province`).toBeTruthy();
      for (const p of map.mapPoints) {
        const { x, y } = gazXY(map.geo, p);
        expect(Math.hypot(o.x - x, o.y - y), `${nm} collides with ${p.label}`).toBeGreaterThan(28);
      }
    }
  });
});

describe('WorkMap route/faction contract integrity (all works)', () => {
  // Runs over every registered work so a new work cannot ship a broken map.
  for (const w of [hidenaga, ieyasu]) {
    it(`${w.id}: every campaignRoute.key resolves in routes`, () => {
      for (const r of w.map.campaignRoutes) {
        expect(w.map.routes[r.key], `${w.id} route ${r.key}`).toBeTruthy();
      }
    });

    // The real invariant is not "a phase exists at ch1" (ieyasu opens as a hostage who owns
    // nothing, so his first phase starts at ch2) but that no province is ever OWNED before a
    // phase is active: activeFactionColor returns null then, and the renderers fall back to plain
    // land — territory that silently paints as unowned.
    it(`${w.id}: factionPhases are ordered and cover every owned chapter`, () => {
      const froms = w.map.factionPhases.map((p) => p.fromCh);
      expect(froms).toEqual([...froms].sort((a, b) => a - b));
      const firstOwned = Math.min(
        ...Object.values(w.map.territory).flatMap((v) =>
          typeof v === 'number' ? [v] : v.map((s) => s.from),
        ),
      );
      if (Number.isFinite(firstOwned)) {
        expect(froms.length, `${w.id} owns land but has no faction phase`).toBeGreaterThan(0);
        expect(froms[0]).toBeLessThanOrEqual(firstOwned);
      }
    });

    // MapPoint carries its coordinates the GazPoint way (lon/lat OR px), and both are optional —
    // a footprint that forgets to spread its gaz entry compiles fine and silently renders at (0,0).
    it(`${w.id}: every footprint carries a coordinate pair`, () => {
      for (const p of w.map.mapPoints) {
        expect(
          (p.lon != null && p.lat != null) || (p.x != null && p.y != null),
          `${w.id} footprint ${p.id} has no coordinates`,
        ).toBe(true);
      }
    });

    it(`${w.id}: at most one route drives the shared runner`, () => {
      const runners = w.map.campaignRoutes.filter((r) => r.runnerLabel);
      expect(runners.length).toBeLessThanOrEqual(1);
    });
  }
});
