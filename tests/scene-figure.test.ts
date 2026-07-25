// Guards the 人の図 device across all WORKS: every figure references only resolvable
// pids / faction keys / seat ids / node ids, every Scene.figure points at a real figure,
// and buildFigure emits a clean, self-consistent svg (valid viewBox, no undefined/NaN,
// every rendered data-pid opens a real card) at every chapter. A low-effort authoring
// mistake (typo'd pid, wrong faction key, dangling seat/edge, bad figure key) fails here
// instead of only in a manual visual-check.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { buildFigure, FIG_FS, SEAT, DAIS_R, NODE_R, BLOCK, daisFontSize } from '../src/engine/map/figure';
import { textW } from '../src/engine/util';

// Estimated ink box of a <text>, in the coordinate space it is emitted in. Serif CJK sits
// almost entirely above the baseline; these ratios are deliberately generous so the gate
// errs toward failing a layout that is merely tight.
const ASCENT = 0.88,
  DESCENT = 0.22;
interface TextBox {
  s: string;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}
// wrapFigure emits the chrome (title/caption/legend) in root coordinates and the content
// inside `<g transform="translate(0 headH)">`; measure each in its own space.
function textBoxes(svg: string): TextBox[] {
  const out: TextBox[] = [];
  const g = svg.match(/<g transform="translate\(0 ([\d.]+)\)">/);
  const split = g ? svg.indexOf(g[0]) : svg.length;
  const re =
    /<text x="([-\d.]+)" y="([-\d.]+)"([^>]*?)font-size="([\d.]+)"[^>]*>([^<]*)<\/text>/g;
  for (const m of svg.matchAll(re)) {
    const [x, y, attrs, fs, s] = [+m[1], +m[2], m[3], +m[4], m[5]];
    const dy = m.index >= split ? +g![1] : 0;
    const w = textW(s, fs);
    const x0 = attrs.includes('text-anchor="middle"') ? x - w / 2 : x;
    out.push({ s, x0, x1: x0 + w, y0: y + dy - fs * ASCENT, y1: y + dy + fs * DESCENT });
  }
  return out;
}

// Text must fit its container. The family asked for bigger figure text (playtest
// 2026-07-15) and font sizes now live in one place (FIG_FS) — but "bigger" is only safe
// while every label still clears the frame, the head divider, and its neighbours, and
// none of that is visible to a type check. Raising FIG_FS past what the layout holds
// fails here instead of reaching a child's screen as clipped or overlapping text.
function expectLayoutSound(svg: string, at: string) {
  const INSET = 6; // the rounded frame rect drawn by wrapFigure
  const [VW, TH] = svg
    .match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!
    .slice(1)
    .map(Number);
  const boxes = textBoxes(svg);
  expect(boxes.length, `${at} has measurable text`).toBeGreaterThan(0);
  for (const b of boxes) {
    expect(
      b.x0 >= INSET && b.x1 <= VW - INSET && b.y0 >= INSET && b.y1 <= TH - INSET,
      `${at} "${b.s}" inside frame (x ${b.x0.toFixed(0)}-${b.x1.toFixed(0)} / ${VW}, y ${b.y0.toFixed(0)}-${b.y1.toFixed(0)} / ${TH})`,
    ).toBe(true);
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i],
        b = boxes[j];
      expect(
        a.x1 <= b.x0 || b.x1 <= a.x0 || a.y1 <= b.y0 || b.y1 <= a.y0,
        `${at} "${a.s}" and "${b.s}" do not overlap`,
      ).toBe(true);
    }
  }
  // The rules above only see <text>. The head divider is the one non-text edge the
  // title/caption can crowd, and the head band has to grow with the fonts to keep clear
  // of it — so hold the clearance explicitly rather than by eye.
  const div = svg.match(/<line x1="34" y1="([\d.]+)"/);
  if (div) {
    const dy = +div[1];
    for (const b of boxes) {
      expect(
        b.y1 <= dy - 4 || b.y0 >= dy + 4,
        `${at} "${b.s}" clears the head divider at y=${dy} (text y ${b.y0.toFixed(0)}-${b.y1.toFixed(0)})`,
      ).toBe(true);
    }
  }
}

// The frame check cannot see the fixed shapes a label sits inside — a seat rect or a
// circle. Those are what a font bump (or a longer name in new work data) breaches first,
// and the overflow reads as text spilling out of its box on the child's screen.
function expectShapesFit(work: any) {
  // Height of a label around its baseline, which midBase() puts at fs*0.35 below the
  // shape's center — checked alongside the width so a lift that stays narrow enough but
  // grows too tall for a seat or circle still fails.
  const vHalf = (fs: number) => Math.max(fs * ASCENT - fs * 0.35, fs * 0.35 + fs * DESCENT);
  const fitsCircle = (s: string, fs: number, r: number, what: string) => {
    expect(textW(s, fs), `${what} width fits the r=${r} circle`).toBeLessThanOrEqual(r * 2 - 8);
    expect(vHalf(fs), `${what} height fits the r=${r} circle`).toBeLessThanOrEqual(r - 4);
  };
  for (const [key, fig] of Object.entries<any>(work.figures)) {
    if (fig.kind === 'assembly') {
      if (fig.dais?.label) {
        // The engine shrinks an oversized dais label to the circle (daisFontSize); the fit
        // check measures that same size, and a floor keeps a too-long label from shrinking
        // below legibility (a 3-glyph throne label would, and should fail here instead).
        const dfs = daisFontSize(fig.dais.label);
        expect(dfs, `${key} dais "${fig.dais.label}" stays legible`).toBeGreaterThanOrEqual(20);
        fitsCircle(fig.dais.label, dfs, DAIS_R, `${key} dais "${fig.dais.label}"`);
      }
      for (const f of fig.fills) {
        // Same base-id resolution as the engine (`nameOf(work, cardId)`): a variant pid would
        // miss shortNames and silently skip this seat's fit check.
        const nm = f.label || (f.pid ? work.shortNames[f.pid.split('@')[0]] : '') || '';
        if (!nm) continue;
        const faced = !!(f.pid && work.faces[f.pid]);
        const fs = faced ? FIG_FS.seatName : FIG_FS.seatLabel;
        // A faced seat's name is left-anchored at seat left + face inset (26) + face
        // offset (26); a faceless seat centers its label in the rect.
        const w = textW(nm, fs) + (faced ? 52 : 0);
        expect(
          w,
          `${key} seat label "${nm}" width fits the ${SEAT.W}-wide seat`,
        ).toBeLessThanOrEqual(SEAT.W - (faced ? 4 : 8));
        expect(
          vHalf(fs),
          `${key} seat label "${nm}" height fits the ${SEAT.H}-tall seat`,
        ).toBeLessThanOrEqual(SEAT.H / 2 - 3);
      }
    } else if (fig.kind === 'battlefield') {
      // A faceless force block centers its label in the BLOCK rect (a leader's name sits
      // beside the face, so the frame/overlap gate covers those instead).
      for (const u of fig.units) {
        if ((u.pid && work.faces[u.pid]) || !u.label) continue;
        expect(
          textW(u.label, FIG_FS.seatLabel),
          `${key} block "${u.label}" width fits the ${BLOCK.W}-wide block`,
        ).toBeLessThanOrEqual(BLOCK.W - 8);
        expect(
          vHalf(FIG_FS.seatLabel),
          `${key} block "${u.label}" height fits the ${BLOCK.H}-tall block`,
        ).toBeLessThanOrEqual(BLOCK.H / 2 - 3);
      }
    } else {
      for (const n of fig.nodes) {
        if (!n.label || (n.pid && work.faces[n.pid])) continue; // face nodes name below
        const fs = n.label.length > 1 ? FIG_FS.nodeLabel : FIG_FS.nodeLabel1;
        fitsCircle(n.label, fs, NODE_R, `${key} node "${n.label}"`);
      }
    }
  }
}

for (const work of WORKS) {
  const figures = work.figures;
  if (!figures) continue;
  describe(`figures: ${work.id}`, () => {
    const keysOf = (fig: any) => new Set(fig.factions.map((x: any) => x.key));

    it('every figure references only resolvable pids / factions / seats / nodes', () => {
      for (const [key, fig] of Object.entries<any>(figures)) {
        const fk = keysOf(fig);
        if (fig.kind === 'assembly') {
          const seatIds = new Set(fig.seats.map((s: any) => s.id));
          if (fig.base) expect(fk.has(fig.base), `${key} base`).toBe(true);
          if (fig.dais?.faction) expect(fk.has(fig.dais.faction), `${key} dais.faction`).toBe(true);
          for (const f of fig.fills) {
            expect(seatIds.has(f.seat), `${key} fill.seat ${f.seat}`).toBe(true);
            expect(fk.has(f.faction), `${key} fill.faction ${f.faction}`).toBe(true);
            if (f.pid) {
              expect(work.faces[f.pid], `${key} fill.pid face ${f.pid}`).toBeTruthy();
              // `p-x@young` draws the variant face and opens the base card (lineage/inline rule).
              expect(work.cards[f.pid.split('@')[0]], `${key} fill.pid card ${f.pid}`).toBeTruthy();
            }
          }
        } else if (fig.kind === 'battlefield') {
          for (const u of fig.units) {
            expect(fk.has(u.faction), `${key} unit.faction ${u.faction}`).toBe(true);
            if (u.pid) {
              expect(work.faces[u.pid], `${key} unit.pid face ${u.pid}`).toBeTruthy();
              expect(work.cards[u.pid], `${key} unit.pid card ${u.pid}`).toBeTruthy();
            }
          }
        } else {
          const nodeIds = new Set(fig.nodes.map((n: any) => n.id));
          for (const n of fig.nodes) {
            expect(fk.has(n.house), `${key} node.house ${n.house}`).toBe(true);
            if (n.ring) expect(fk.has(n.ring), `${key} node.ring ${n.ring}`).toBe(true);
            if (n.pid) {
              // A life-stage variant (`p-x@wife`) draws the variant face but opens the
              // base card — mirror the engine's split when checking resolvability.
              expect(work.faces[n.pid], `${key} node.pid face ${n.pid}`).toBeTruthy();
              expect(work.cards[n.pid.split('@')[0]], `${key} node.pid card ${n.pid}`).toBeTruthy();
            }
          }
          for (const e of fig.edges) {
            expect(nodeIds.has(e.from), `${key} edge.from ${e.from}`).toBe(true);
            expect(nodeIds.has(e.to), `${key} edge.to ${e.to}`).toBe(true);
            if (e.from2) {
              expect(nodeIds.has(e.from2), `${key} edge.from2 ${e.from2}`).toBe(true);
              // The midpoint drop assumes a real, already-visible marriage line
              // between the two parents on the same row — enforce it as data
              // integrity so a forgotten/late marriage edge can't leave a child
              // line hanging in empty space.
              const byId: any = {};
              fig.nodes.forEach((n: any) => (byId[n.id] = n));
              const m = fig.edges.find(
                (x: any) =>
                  x.kind === 'marriage' &&
                  ((x.from === e.from && x.to === e.from2) ||
                    (x.from === e.from2 && x.to === e.from)),
              );
              expect(m, `${key} marriage edge ${e.from}×${e.from2}`).toBeTruthy();
              expect(m.fromCh <= e.fromCh, `${key} marriage before descent to ${e.to}`).toBe(true);
              expect(byId[e.from].y, `${key} couple ${e.from}×${e.from2} same row`).toBe(
                byId[e.from2].y,
              );
              for (const p of [e.from, e.from2]) {
                expect(
                  (byId[p].fromCh ?? 1) <= e.fromCh,
                  `${key} parent ${p} visible before descent to ${e.to}`,
                ).toBe(true);
              }
            }
          }
        }
      }
    });

    it('every Scene.figure references an existing figure key', () => {
      for (const ch of work.story.chapters) {
        for (const [sid, sc] of Object.entries<any>(ch.scenes)) {
          if (sc.figure) expect(figures[sc.figure], `scene ${sid} figure ${sc.figure}`).toBeTruthy();
        }
      }
    });

    it('buildFigure emits a valid, self-consistent svg at each chapter', () => {
      for (const key of Object.keys(figures)) {
        for (let ch = 1; ch <= work.totalChapters; ch++) {
          const svg = buildFigure(work, key, ch);
          expect(svg.startsWith('<svg'), `${key}@${ch} is svg`).toBe(true);
          expect(svg, `${key}@${ch} viewBox`).toMatch(/viewBox="0 0 [\d.]+ [\d.]+"/);
          expect(svg.includes('undefined') || svg.includes('NaN'), `${key}@${ch} clean`).toBe(false);
          for (const m of svg.matchAll(/data-pid="([^"]+)"/g)) {
            expect(work.cards[m[1]], `${key}@${ch} data-pid ${m[1]}`).toBeTruthy();
          }
        }
      }
    });

    // Genealogy grammar (playtest 2026-07-13): a child with both parents present
    // descends from the midpoint of the couple's marriage line, and a label-only
    // node prints its name exactly once (inside the circle, not again below).
    it('lineage: two-parent descent drops from the marriage midpoint', () => {
      for (const [key, fig] of Object.entries<any>(figures)) {
        if (fig.kind !== 'lineage') continue;
        const byId: any = {};
        fig.nodes.forEach((n: any) => (byId[n.id] = n));
        for (const e of fig.edges) {
          if (e.kind !== 'descent' || !e.from2) continue;
          const ch = Math.max(
            e.fromCh,
            byId[e.from].fromCh ?? 1,
            byId[e.from2].fromCh ?? 1,
            byId[e.to].fromCh ?? 1,
          );
          const svg = buildFigure(work, key, ch);
          const mx = (byId[e.from].x + byId[e.from2].x) / 2;
          expect(svg, `${key} descent to ${e.to} starts at couple midpoint`).toContain(
            `M${mx} ${byId[e.from].y + 8} `,
          );
        }
        for (const n of fig.nodes) {
          if (n.pid || !n.label) continue;
          const svg = buildFigure(work, key, work.totalChapters);
          const copies = svg.split(`>${n.label}<`).length - 1;
          expect(copies, `${key} label-only node ${n.id} printed once`).toBe(1);
        }
      }
    });

    // A first-time reader must get title/caption/legend from the figure alone
    // (playtest 2026-07-13: bare colored seats read as noise without them).
    it('renders title, caption, color legend, and a live tally', () => {
      for (const [key, fig] of Object.entries<any>(figures)) {
        for (let ch = 1; ch <= work.totalChapters; ch++) {
          const svg = buildFigure(work, key, ch);
          if (fig.title) expect(svg, `${key}@${ch} title`).toContain(`>${fig.title}<`);
          if (fig.caption) expect(svg, `${key}@${ch} caption`).toContain(`>${fig.caption}<`);
          for (const f of fig.factions) {
            expect(svg, `${key}@${ch} legend label ${f.key}`).toContain(f.label);
            expect(svg, `${key}@${ch} legend chip ${f.key}`).toContain(`fill="${f.color}"`);
          }
          if (fig.kind === 'assembly' && fig.tally) {
            // Independent recount (last-wins on fromCh) pins the rendered n/total.
            const n = fig.seats.filter((s: any) => {
              let best: any = null;
              for (const f of fig.fills) {
                if (f.seat === s.id && f.fromCh <= ch && (!best || f.fromCh >= best.fromCh)) best = f;
              }
              return best?.faction === fig.tally;
            }).length;
            expect(svg, `${key}@${ch} tally`).toContain(` ${n}/${fig.seats.length}<`);
          }
        }
      }
    });

    it('no text overflows the frame or collides with other text', () => {
      for (const key of Object.keys(figures)) {
        for (let ch = 1; ch <= work.totalChapters; ch++) {
          expectLayoutSound(buildFigure(work, key, ch), `${key}@${ch}`);
        }
      }
    });

    it('every label fits inside the shape that holds it', () => expectShapesFit(work));
  });
}

// The gates above only reach the shapes the shipped works happen to use, so they pass
// vacuously on the branches no author has written yet: kiyomori's two figures both carry
// title+caption and give every faceless seat no label, which leaves the title-only /
// caption-only head bands and the centered seat label untested. A synthetic figure covers
// them, the way tests/scene-map-locator.test.ts uses a synthetic east-leaning work to hold
// a rule no shipped work would exercise. Without this, the next author to write a
// caption-less figure inherits an untested layout.
describe('figures: layout branches no shipped work uses', () => {
  const F = [{ key: 'a', label: 'あお', color: '#31608c' }];
  const seats = [
    { id: 'S0', x: 200, y: 120 },
    // A seat role: the under-rect place label branch (ieyasu uses it, but keep it covered
    // here so a data edit there cannot silently retire the branch).
    { id: 'S1', x: 500, y: 120, role: 'やくしょ' },
    { id: 'S2', x: 800, y: 120 },
  ];
  const base = {
    kind: 'assembly' as const,
    factions: F,
    vb: [1000, 240] as [number, number],
    seats,
    // A faceless seat with a label: the centered-in-the-rect branch.
    fills: [{ seat: 'S0', fromCh: 1, faction: 'a', label: 'ろくはら' }],
  };
  const work: any = {
    ...WORKS[0],
    figures: {
      titleOnly: { ...base, title: '題だけの 図', dais: { x: 500, y: 40, label: '帝', faction: 'a' } },
      captionOnly: { ...base, caption: '説明だけの 図' },
      bare: { ...base }, // no title, no caption
    },
    totalChapters: 1,
  };

  it('every label fits inside the shape that holds it', () => expectShapesFit(work));

  it('no text overflows the frame or collides with other text', () => {
    for (const key of Object.keys(work.figures)) expectLayoutSound(buildFigure(work, key, 1), key);
  });

  // The layout gates above pass vacuously if role rendering is removed — pin its presence.
  it('renders a seat role under the rect', () => {
    expect(buildFigure(work, 'bare', 1)).toContain('>やくしょ<');
  });

  // Both gates only ever see data that already fits, so a refactor could quietly turn them
  // into no-ops and nothing would go red. Pin them to a layout that must be rejected: a
  // 3-glyph label needs 78u inside a 60u circle. (That limit predates the bigger fonts —
  // even the old 22u size overflowed at 3 glyphs; it just had no gate to say so. An author
  // who needs a longer node label has to widen the circle, not only shrink the text.)
  it('rejects a label too long for its shape (the gate is not vacuous)', () => {
    const overlong = {
      ...work,
      figures: {
        n: {
          kind: 'lineage',
          factions: F,
          vb: [1000, 200],
          nodes: [{ id: 'n0', x: 500, y: 100, house: 'a', label: '以仁王' }],
          edges: [],
        },
      },
    };
    expect(() => expectShapesFit(overlong)).toThrow(/fits the r=34 circle/);
  });
});

// A life-stage variant node (pid@variant) — masako shows the protagonist as 御台所
// (`p-masako@wife`) in the ch1 seed figure and as the aged 尼 (`p-masako`) later. The
// lineage figure was the only face visual that ignored '@' (inline <face>/closeup already
// split it), so a variant node lost its click-through to the base card. This pins the
// engine's split: full pid draws the FACE, base id opens/names the CARD.
describe('lineage: a life-stage variant node (pid@variant)', () => {
  const work: any = {
    ...WORKS[0],
    // Only the VARIANT has a face spec; the base id has none. If the engine looked the
    // face up by base id, no face would render — so a face proves the full pid resolved.
    faces: {
      ...WORKS[0].faces,
      'z@old': { tone: 'ai', head: 'ama', garb: 'houe', hair: 'grey', shape: 'oval', brow: 'calm', eye: 'calm', mouth: 'flat', beard: 'none' },
    },
    cards: { z: { type: 'person', ch: 1, tone: 'ai', name: 'ゼ 老', read: 'ぜ', text: 'テスト' } },
    shortNames: { z: 'ゼ' },
    figures: {
      v: {
        kind: 'lineage',
        title: '縁の 図',
        factions: [{ key: 'a', label: 'あお', color: '#31608c' }],
        vb: [1000, 220],
        nodes: [{ id: 'n', x: 500, y: 110, pid: 'z@old', house: 'a' }],
        edges: [],
      },
    },
    totalChapters: 1,
  };
  it('draws the variant face but opens/names the base card', () => {
    const svg = buildFigure(work, 'v', 1);
    expect(svg, 'a face group rendered (variant pid resolved)').toContain('<clipPath id="fg-v-n0">');
    expect(svg, 'click-through is the base card, not the variant key').toContain('data-pid="z"');
    expect(svg, 'never the variant key').not.toContain('data-pid="z@old"');
    expect(svg, 'name resolves from the base').toContain('>ゼ<');
  });
});

// The battlefield grammar (ieyasu ch5) exercises seam + hill-role + a hill-borne faceless
// block, but not: a battlefield with NO seam, a NON-hill unit carrying a role (the y+44
// branch), or a faceless block off a hill. A synthetic fixture treads them so a later data
// edit in ieyasu cannot silently retire those branches.
describe('figures: battlefield branches no shipped work uses', () => {
  const F = [
    { key: 'x', label: 'ひがし', color: '#9a7a28' },
    { key: 'y', label: 'にし', color: '#b23a2e' },
  ];
  const work: any = {
    ...WORKS[0],
    figures: {
      plain: {
        kind: 'battlefield',
        vb: [1000, 340],
        caption: '説明だけの 戦場',
        factions: F,
        units: [
          { id: 'a', x: 200, y: 95, faction: 'x', label: '本隊', role: '前', troops: 2, facing: 1 },
          { id: 'b', x: 800, y: 95, faction: 'y', label: '別動', facing: -1 },
          { id: 'c', x: 500, y: 240, faction: 'y', label: '山', role: 'とりで', hill: true },
        ],
      },
    },
    totalChapters: 1,
  };

  it('every label fits inside the shape that holds it', () => expectShapesFit(work));
  it('no text overflows the frame or collides with other text', () => {
    for (const key of Object.keys(work.figures)) expectLayoutSound(buildFigure(work, key, 1), key);
  });
  // No-seam + faceless-block branches: buildFigure must not require a seam or a leader face.
  it('renders without a seam and draws a faceless block off the hill', () => {
    const svg = buildFigure(work, 'plain', 1);
    expect(svg.includes('stroke-dasharray'), 'no seam line').toBe(false);
    expect(svg, 'faceless block label').toContain('>本隊<');
    expect(svg, 'non-hill role').toContain('>前<');
  });
});

// LineageEdge.cutCh — a tie that ends. No shipped work uses it yet (it exists for masako),
// so every gate above passes vacuously on it. The device's whole point is that the two
// people STAY in the figure and only the line changes, and that the double slash lands on
// a straight run rather than a corner; both are silent-failure shapes a data edit to the
// elbow geometry could break without any other test noticing.
describe('lineage: a severed tie (cutCh)', () => {
  const NODE = 34; // node radius the elbow starts/ends clear of (NODE_R)
  const base = {
    kind: 'lineage' as const,
    factions: [{ key: 'a', label: 'あお', color: '#31608c' }],
    nodes: [
      { id: 'p1', x: 200, y: 90, label: '父' },
      { id: 'p2', x: 500, y: 90, label: '母' },
      { id: 'k', x: 350, y: 380, label: '子' },
      { id: 'far', x: 850, y: 380, label: '弟' },
    ],
  };
  const work: any = {
    ...WORKS[0],
    figures: {
      wed: {
        ...base,
        title: '縁の 図',
        edges: [{ from: 'p1', to: 'p2', kind: 'marriage' as const, fromCh: 1, cutCh: 3 }],
      },
      // Child directly under the parents' midpoint: the horizontal run is ~0, so the mark
      // must fall on one of the vertical runs.
      under: {
        ...base,
        title: '縁の 図',
        edges: [
          { from: 'p1', to: 'p2', kind: 'marriage' as const, fromCh: 1 },
          { from: 'p1', from2: 'p2', to: 'k', kind: 'descent' as const, fromCh: 1, cutCh: 3 },
        ],
      },
      // Child far to the side: the horizontal run is the longest.
      aside: {
        ...base,
        title: '縁の 図',
        edges: [{ from: 'p1', to: 'far', kind: 'descent' as const, fromCh: 1, cutCh: 3 }],
      },
    },
    totalChapters: 3,
  };
  const slashes = (svg: string) => [...svg.matchAll(/stroke-width="3\.2"/g)].length;

  for (const key of Object.keys(work.figures)) {
    it(`${key}: the line goes dashed and gets a double slash only from cutCh on`, () => {
      const before = buildFigure(work, key, 2);
      const after = buildFigure(work, key, 3);
      expect(before, 'not yet cut').not.toContain('stroke-dasharray');
      expect(after, 'cut from this chapter').toContain('stroke-dasharray');
      expect(slashes(before), 'no mark before the cut').toBe(0);
      expect(slashes(after), 'the genealogy double slash').toBe(2);
    });

    it(`${key}: both people stay in the figure after the cut`, () => {
      const after = buildFigure(work, key, 3);
      expect(after, '父 stays').toContain('>父<');
      expect(after, 'the other end stays').toMatch(/>(母|子|弟)</);
    });

    it(`${key}: the slashes sit on a straight run, clear of the nodes`, () => {
      const svg = buildFigure(work, key, 3);
      const marks = [...svg.matchAll(/<line x1="([-\d.]+)" y1="([-\d.]+)" x2="([-\d.]+)" y2="([-\d.]+)" stroke="[^"]*" stroke-width="3\.2"/g)];
      expect(marks.length).toBe(2);
      const cx = marks.reduce((s, m) => s + (+m[1] + +m[3]) / 2, 0) / 2;
      const cy = marks.reduce((s, m) => s + (+m[2] + +m[4]) / 2, 0) / 2;
      for (const n of base.nodes) {
        const d = Math.hypot(cx - n.x, cy - n.y);
        expect(d, `mark overlaps node ${n.id}`).toBeGreaterThan(NODE + 12);
      }
    });
  }

  it('every label fits inside the shape that holds it', () => expectShapesFit(work));
});
