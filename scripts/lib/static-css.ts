// Dev-tool CSS resolver: turns the app theme (custom properties + color-mix())
// into literal colors so standalone SVG output renders correctly in static
// rasterizers. librsvg 2.58 paints both var() and color-mix() BLACK (verified
// empirically), so any dev-tool SVG that keeps them cannot be self-inspected
// as a raster image. The engine itself keeps emitting var()-based SVG for the
// browser, where the real stylesheet applies — this module is scripts/ only.
//
// Scope: the light theme (`:root` outside @media). Dark theme lives inside
// `@media (prefers-color-scheme: dark)` which is stripped along with all other
// at-rule blocks; visual self-checks calibrate against the light theme.

const COMMENT_RE = /\/\*[\s\S]*?\*\//g;

/** Remove at-rule blocks (@media, @keyframes, …) and comments. Brace-aware. */
export function stripAtBlocks(css: string): string {
  const src = css.replace(COMMENT_RE, '');
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '@') {
      let j = i;
      while (j < src.length && src[j] !== '{' && src[j] !== ';') j++;
      if (src[j] === ';' || j >= src.length) {
        i = j + 1; // statement at-rule (@import etc.)
        continue;
      }
      let depth = 0;
      do {
        if (src[j] === '{') depth++;
        else if (src[j] === '}') depth--;
        j++;
      } while (j < src.length && depth > 0);
      i = j;
    } else {
      out += src[i++];
    }
  }
  return out;
}

/**
 * Custom properties for the light theme: the bare `:root` block(s) (system
 * default) merged with `:root[data-theme="light"]` (what an explicit light
 * selection actually applies — the two are hand-duplicated in app.css, and
 * document order / later-wins keeps this tool honest if they ever diverge).
 * Double quotes in values (font stacks) are normalized to single quotes so a
 * substituted value never breaks a double-quoted SVG attribute.
 */
export function parseThemeVars(css: string): Record<string, string> {
  const flat = stripAtBlocks(css);
  const vars: Record<string, string> = {};
  const rootRe = /:root(\[data-theme=["']light["']\])?\s*\{([^}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = rootRe.exec(flat))) {
    const declRe = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let d: RegExpExecArray | null;
    while ((d = declRe.exec(m[2]))) {
      vars[d[1]] = d[2].trim().replace(/"/g, "'");
    }
  }
  return vars;
}

/** Substitute var(--x[, fallback]) recursively until none remain. */
export function resolveVars(text: string, vars: Record<string, string>): string {
  const VAR_RE = /var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*))?\)/g;
  let out = text;
  // Each pass replaces every occurrence; passes only stack up for var chains
  // (--gold → --kin), so the guard bounds chain depth, not occurrence count.
  for (let guard = 0; guard < 16; guard++) {
    if (!VAR_RE.test(out)) return out;
    out = out.replace(VAR_RE, (whole, name: string, fb?: string) => {
      const val = vars[name] ?? fb?.trim();
      if (val == null) throw new Error(`unknown CSS variable ${name} (no fallback)`);
      return val;
    });
  }
  throw new Error('var() resolution did not converge (circular reference?)');
}

type Rgba = [number, number, number, number];

function parseColor(s: string): Rgba {
  const c = s.trim().toLowerCase();
  if (c === 'transparent') return [0, 0, 0, 0];
  if (c === 'white') return [255, 255, 255, 1];
  if (c === 'black') return [0, 0, 0, 1];
  let m = /^#([0-9a-f]{3,8})$/.exec(c);
  if (m) {
    const h = m[1];
    if (h.length === 3 || h.length === 4) {
      const [r, g, b, a] = h.split('').map((x) => parseInt(x + x, 16));
      return [r, g, b, h.length === 4 ? a / 255 : 1];
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16),
        g = parseInt(h.slice(2, 4), 16),
        b = parseInt(h.slice(4, 6), 16);
      return [r, g, b, h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1];
    }
  }
  m = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(c);
  if (m) return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
  throw new Error(`unsupported color: ${s}`);
}

function fmtColor([r, g, b, a]: Rgba): string {
  const ri = Math.round(r),
    gi = Math.round(g),
    bi = Math.round(b);
  if (a >= 1) return `rgb(${ri}, ${gi}, ${bi})`;
  return `rgba(${ri}, ${gi}, ${bi}, ${+a.toFixed(3)})`;
}

/**
 * Evaluate one `color-mix(in srgb, C1 [p1%], C2 [p2%])` body (args after the
 * open paren, without the closing paren). Premultiplied-alpha interpolation
 * per CSS Color 5, so e.g. mixing 28% ink with transparent keeps ink's hue at
 * alpha 0.28 rather than darkening toward black.
 */
function evalMixBody(body: string): string {
  // Split on top-level commas only — resolved colors like rgb(1, 2, 3) contain commas.
  const parts: string[] = [];
  let depth = 0,
    cur = '';
  for (const c of body) {
    if (c === '(') depth++;
    else if (c === ')') depth--;
    if (c === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
    } else cur += c;
  }
  parts.push(cur.trim());
  if (parts.length !== 3 || !/^in\s+srgb$/i.test(parts[0]))
    throw new Error(`unsupported color-mix: color-mix(${body})`);
  const parseArg = (arg: string): { col: Rgba; pct: number | null } => {
    const m = /^(.*?)\s+([\d.]+)%$/.exec(arg);
    return m ? { col: parseColor(m[1]), pct: +m[2] } : { col: parseColor(arg), pct: null };
  };
  const a = parseArg(parts[1]),
    b = parseArg(parts[2]);
  let p1 = a.pct,
    p2 = b.pct;
  if (p1 == null && p2 == null) p1 = p2 = 50;
  else if (p1 == null) p1 = 100 - p2!;
  else if (p2 == null) p2 = 100 - p1;
  const total = p1! + p2!;
  if (total <= 0) throw new Error(`degenerate color-mix: color-mix(${body})`);
  const w1 = p1! / total,
    w2 = p2! / total;
  // Premultiplied-alpha interpolation; channels are normalized by the raw
  // mixed alpha. CSS Color 5: when explicit percentages sum below 100%, the
  // shortfall becomes transparency (alpha multiplier total/100) — it scales
  // the final alpha only, not the channels.
  const mixAlpha = w1 * a.col[3] + w2 * b.col[3];
  const ch = (i: number) =>
    mixAlpha === 0 ? 0 : (w1 * a.col[3] * a.col[i] + w2 * b.col[3] * b.col[i]) / mixAlpha;
  return fmtColor([ch(0), ch(1), ch(2), mixAlpha * (Math.min(total, 100) / 100)]);
}

/**
 * Replace every color-mix(...) in the text with its computed literal color.
 * Terminates because each pass removes exactly one occurrence (the LAST one,
 * which can never contain a nested color-mix) and emits only rgb()/rgba().
 */
export function evalColorMixes(text: string): string {
  let out = text;
  let start: number;
  while ((start = out.lastIndexOf('color-mix(')) >= 0) {
    let depth = 0,
      j = start + 'color-mix'.length;
    do {
      if (out[j] === '(') depth++;
      else if (out[j] === ')') depth--;
      j++;
    } while (j < out.length && depth > 0);
    const body = out.slice(start + 'color-mix('.length, j - 1);
    out = out.slice(0, start) + evalMixBody(body) + out.slice(j);
  }
  return out;
}

/** var() substitution + color-mix evaluation over arbitrary text (CSS or SVG). */
export function resolveCssColors(text: string, vars: Record<string, string>): string {
  return evalColorMixes(resolveVars(text, vars));
}

// SVG presentation properties worth keeping in a static render. Everything
// else (animation, transition, cursor, filter, layout, shadows) is dropped —
// librsvg either ignores them or they only matter in the live DOM.
const KEEP_PROPS = new Set([
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-opacity',
  'fill-opacity',
  'opacity',
  'paint-order',
  'font-family',
  'font-weight',
  'font-size',
  'text-anchor',
]);

// Animated elements pinned to their finished / representative state:
// route and journey lines fully drawn, the current-location pulse ring
// visible at mid-fade instead of its (invisible) animation end state.
const STATIC_OVERRIDES = `
.scene-map .sroute.anim{ stroke-dasharray:none; stroke-dashoffset:0; }
.scene-map .sjourney{ stroke-dasharray:none; stroke-dashoffset:0; }
.scene-map .scur-ring{ opacity:.45; }`;

/**
 * Extract one root class's rules (`.scene-map` or `.map-svg`) from the app
 * stylesheet, resolved to literal colors and filtered to static presentation
 * properties, plus any static end-state overrides. Auto-tracks app.css edits
 * (no hand-copied hex values to drift).
 */
export function mapStyle(css: string, cls = 'scene-map'): string {
  const vars = parseThemeVars(css);
  const flat = stripAtBlocks(css);
  const sel = '.' + cls;
  const rules: string[] = [];
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g;
  let m: RegExpExecArray | null;
  while ((m = ruleRe.exec(flat))) {
    const sels = m[1]
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.includes(sel) && !s.includes(':'));
    if (!sels.length) continue;
    const decls = m[2]
      .split(';')
      .map((d) => d.trim())
      .filter((d) => {
        const prop = d.slice(0, d.indexOf(':')).trim();
        return KEEP_PROPS.has(prop);
      });
    if (!decls.length) continue;
    rules.push(`${sels.join(', ')}{ ${resolveCssColors(decls.join('; '), vars)}; }`);
  }
  return rules.join('\n') + (cls === 'scene-map' ? STATIC_OVERRIDES : '');
}

/** Back-compat alias: the scene-map style block. */
export function sceneMapStyle(css: string): string {
  return mapStyle(css, 'scene-map');
}

/**
 * Make a dev-tool SVG self-contained: resolve var()/color-mix() to literals
 * and, for scene maps and campaign maps (root carries class="scene-map" or
 * "map-svg"), embed the class styles as a <style> block so rsvg renders
 * sea/land/labels/routes as the browser would (minus animation and dark theme).
 * The campaign map's fills are runtime-applied in the app; its static render
 * (campaignStaticSvg) bakes them inline so the same block still rasterizes.
 */
export function staticizeSvg(svg: string, css: string): string {
  const vars = parseThemeVars(css);
  let out = resolveCssColors(svg, vars);
  const cls = /^<svg[^>]*class="[^"]*\bscene-map\b/.test(out)
    ? 'scene-map'
    : /^<svg[^>]*class="[^"]*\bmap-svg\b/.test(out)
      ? 'map-svg'
      : null;
  if (cls) {
    out = out.replace(/^(<svg[^>]*>)/, `$1<style>${mapStyle(css, cls)}</style>`);
  }
  return out;
}
