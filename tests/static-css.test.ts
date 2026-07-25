// Dev-tool CSS resolver (scripts/lib/static-css.ts): the self-inspection power
// of render-scene/render-relations depends on var()/color-mix() actually being
// resolved to literals — librsvg paints unresolved ones black, which would
// silently defeat every raster self-check. These tests pin the resolver to the
// real app.css so a theme refactor that breaks resolution fails loudly.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  parseThemeVars,
  resolveVars,
  evalColorMixes,
  resolveCssColors,
  sceneMapStyle,
  staticizeSvg,
} from '../scripts/lib/static-css';
import { buildSceneMap } from '../src/engine/map/sceneMap';
import { WORKS } from '../src/works/index';

const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

describe('theme variable parsing (app.css light theme)', () => {
  const vars = parseThemeVars(css);

  it('reads direct literals', () => {
    expect(vars['--kin']).toBe('#C6972F');
    expect(vars['--shu']).toBe('#B23A2E');
  });

  it('resolves chained variables to literals', () => {
    expect(resolveCssColors('var(--gold)', vars)).toBe('#C6972F'); // --gold → --kin
    expect(resolveCssColors('var(--ink)', vars)).toBe('#23201C'); // --ink → --sumi
  });

  it('does not pick up the dark theme overrides (inside @media)', () => {
    // dark theme sets --gold:#E4B84A; light must win
    expect(resolveCssColors('var(--gold)', vars)).not.toBe('#E4B84A');
  });

  it('normalizes double quotes in font stacks (attribute safety)', () => {
    expect(vars['--serif']).not.toContain('"');
    expect(vars['--serif']).toContain("'Yu Mincho'");
  });

  it('throws on unknown variables without fallback', () => {
    expect(() => resolveVars('var(--no-such-token)', vars)).toThrow(/--no-such-token/);
  });

  it('honors var() fallbacks', () => {
    expect(resolveVars('var(--no-such-token, #123456)', vars)).toBe('#123456');
  });

  it('lets an explicit :root[data-theme="light"] block override the bare :root', () => {
    // The app applies data-theme="light" when the user picks light explicitly
    // (src/engine/prefs.ts); app.css hand-duplicates the values across the two
    // blocks. Later-wins merging keeps this tool honest if they diverge.
    const synthetic = ':root{--x:#111111;}\n:root[data-theme="light"]{--x:#222222;}';
    expect(parseThemeVars(synthetic)['--x']).toBe('#222222');
  });
});

describe('color-mix evaluation', () => {
  it('mixes opaque colors by weight', () => {
    expect(evalColorMixes('color-mix(in srgb, #000000 50%, #ffffff)')).toBe('rgb(128, 128, 128)');
    expect(evalColorMixes('color-mix(in srgb, #ff0000 25%, #0000ff)')).toBe('rgb(64, 0, 191)');
  });

  it('defaults the second percentage to the complement', () => {
    expect(evalColorMixes('color-mix(in srgb, #000000 20%, #ffffff)')).toBe('rgb(204, 204, 204)');
  });

  it('turns a sub-100% percentage sum into transparency (CSS Color 5)', () => {
    expect(evalColorMixes('color-mix(in srgb, #ff0000 25%, #0000ff 25%)')).toBe(
      'rgba(128, 0, 128, 0.5)',
    );
  });

  it('keeps hue when mixing with transparent (premultiplied alpha)', () => {
    // .mland stroke: 28% ink over transparent → ink hue at alpha .28, not darkened
    expect(evalColorMixes('color-mix(in srgb, #23201C 28%, transparent)')).toBe(
      'rgba(35, 32, 28, 0.28)',
    );
  });

  it('evaluates nested color-mix innermost-first', () => {
    // inner: 127.5 → rounds to 128; outer: (128+255)/2 = 191.5 → 192.
    // Rounding at each step keeps the error under 1/255 — fine for a dev tool.
    const nested = 'color-mix(in srgb, color-mix(in srgb, #000000 50%, #ffffff) 50%, #ffffff)';
    expect(evalColorMixes(nested)).toBe('rgb(192, 192, 192)');
  });

  it('resolves the full var→color-mix chain of the map tokens', () => {
    const vars = parseThemeVars(css);
    const land = resolveCssColors('var(--map-land)', vars);
    expect(land).toMatch(/^rgb\(/);
    expect(land).not.toContain('var(');
    expect(land).not.toContain('color-mix(');
  });
});

describe('scene-map style extraction', () => {
  const style = sceneMapStyle(css);

  it('carries the sea/land/label/route rules with literal colors only', () => {
    expect(style).toContain('.msea');
    expect(style).toContain('.smk-lb');
    expect(style).toContain('.sroute');
    expect(style).not.toContain('var(');
    expect(style).not.toContain('color-mix(');
  });

  it('drops animation/layout declarations and pins static end states', () => {
    expect(style).not.toContain('animation');
    expect(style).not.toContain('transition');
    expect(style).not.toContain('cursor');
    // routes render fully drawn instead of dash-hidden at animation start
    expect(style).toContain('.sroute.anim{ stroke-dasharray:none');
  });
});

describe('staticizeSvg over real scene maps (all works)', () => {
  // staticizeSvg runs a headless CSS resolution per scene; the cost scales with the number of
  // shipped works, so the default 5s vitest timeout tightened as the corpus grew (masako = 6th).
  // Widen it here — this is test infrastructure headroom, not an experience budget.
  it('leaves no unresolved var()/color-mix() and embeds the style block', () => {
    for (const w of WORKS) {
      for (const chapter of w.story.chapters) {
        const svg = staticizeSvg(buildSceneMap(w, chapter.id, chapter.start), css);
        expect(svg, `${w.id} ch${chapter.id}`).not.toContain('var(');
        expect(svg, `${w.id} ch${chapter.id}`).not.toContain('color-mix(');
        expect(svg, `${w.id} ch${chapter.id}`).toContain('<style>');
      }
    }
  }, 20000);

  // Route coverage is FOUND, not named. This assertion used to hardcode katsu 3-a; when that scene
  // stopped drawing a route (the Pacific band retired it — a line at ocean scale asserts a track the
  // project has no source for), the test went on passing against a map with no route in it until the
  // string check failed. Deriving the subject means the gate follows the data instead of a memory of it.
  it('renders a route-bearing scene map with the route visible', () => {
    const found = WORKS.flatMap((w) =>
      w.story.chapters.flatMap((c) =>
        Object.keys(c.scenes)
          .filter((sid) => w.map.sceneMaps[sid]?.route)
          .map((sid) => ({ w, ch: c.id, sid })),
      ),
    );
    expect(found.length, 'どの作品もシーン地図に route を引いていない').toBeGreaterThan(0);
    for (const { w, ch, sid } of found) {
      const svg = staticizeSvg(buildSceneMap(w, ch, sid), css);
      expect(svg, `${w.id} ${sid}`).toContain('class="sroute anim"');
      expect(svg, `${w.id} ${sid}`).toContain('stroke-dasharray:none');
    }
  });
});
