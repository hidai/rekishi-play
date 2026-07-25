// ★P 「人の図」= 章進行する表示専用の主ビジュアル（席の図 / 血の縁の図）。純粋な文字列生成関数。
// closeup.ts と同じく、色は CSS 変数に依存しない固定パレット＋作品データの faction 色（literal）で
// 描く（テーマ非依存＝render-scene.ts の単体書き出しでもそのまま見える）。faceSvg / clip の作法は
// sceneMap.ts・relationMap.ts と同じ。章進行は FactionPhase/CampaignRoute と同じ「fromCh の last-wins」。
import type {
  Work,
  AssemblyFigure,
  LineageFigure,
  BattlefieldFigure,
  BattleUnit,
  FigureFill,
  FigureFaction,
} from '../types';
import { faceSvg } from './sceneMap';
import { esc, textW } from '../util';

// Fixed, theme-independent chrome palette (faction colors come from the work data).
const PAL = {
  ground: '#efe7d4',
  panel: '#f6efdf',
  line: '#cbbb98',
  ink: '#2a251c',
  gold: '#c9a23e',
};

// Every font size in the figure, in viewBox units. The figure viewBox is ~1000 wide and
// displays at the full column width (~680px), so 1 unit ≈ 0.68px: the labels below land at
// 17px against the 18.5px body size. The family playtest asked for "the same look, only
// slightly bigger text" (note 2026-07-15) after the landscape redesign settled the layout —
// hence a uniform ~18% lift over the first landscape pass rather than new proportions.
// Text at these sizes must still fit its container: `tests/scene-figure.test.ts` checks the
// estimated extents against the frame and the seat rects, so a further bump fails there
// instead of only in a manual visual-check.
export const FIG_FS = {
  title: 33, // ≈ 22px
  caption: 25, // ≈ 17px
  legend: 26, // ≈ 18px
  daisLabel: 30,
  seatName: 26, // name beside a seated face
  seatLabel: 25, // faceless seat, name centered in the rect
  seatRole: 22, // place/office of the seat itself, under the rect
  nodeLabel1: 34, // single-glyph label inside a lineage circle
  nodeLabel: 26, // multi-glyph label inside a lineage circle
  nodeName: 25, // name below a lineage circle
};

// The fixed shapes a label has to fit inside: the assembly seat rect, the dais circle,
// and the lineage node circle.
export const SEAT = { W: 120, H: 46 };
export const DAIS_R = 26;
export const NODE_R = 34;
// A faceless force block on the battlefield (e.g. 毛利 on 南宮山).
export const BLOCK = { W: 84, H: 40 };

// Baseline offset that vertically centers a CJK glyph on a point at this font size.
const midBase = (fs: number) => +(fs * 0.35).toFixed(1);

// The dais circle (r=26) is deliberately small — a single-glyph throne label (kiyomori's
// 帝) fits at the base font, but a two-glyph one (masako's 将軍) overflows it. Shrink the
// label to the circle's width instead of letting it spill. A label that already fits is
// returned unchanged, so single-glyph dais output stays byte-identical. Exported so the
// scene-figure fit test measures the same size (one source of truth).
export function daisFontSize(label: string): number {
  const cap = DAIS_R * 2 - 8; // matches the width gate in tests/scene-figure.test.ts
  const w = textW(label, FIG_FS.daisLabel);
  return w <= cap ? FIG_FS.daisLabel : Math.floor((FIG_FS.daisLabel * cap) / w);
}

const strip = (s: string) => s.replace(/<[^>]+>/g, '');
function nameOf(work: Work, pid: string): string {
  return work.shortNames[pid] || strip(work.cards[pid]?.name || work.peopleExtra[pid] || '');
}

// Title + caption band above the content and a color legend below it. A first-time
// reader must be able to tell WHAT the figure shows (title/caption) and WHO the colors
// are (legend) without the scene text — the playtest showed bare colored shapes read
// as noise. `tallies` appends a live "n/total" after a faction's legend label.
interface Chrome {
  headH: number;
  footH: number;
  parts: string[]; // drawn in svg root coordinates (content is translated down by headH)
}
function buildChrome(
  fig: { title?: string; caption?: string; factions: FigureFaction[] },
  VW: number,
  VH: number,
  tallies?: Record<string, string>,
): Chrome {
  // Landscape coordinate space: the figure viewBox is ~1000 wide (matching the scene map) and
  // displays at the full column width. The family playtest rejected both a full-width portrait
  // box (fonts 2-3x the body) and a shrunk one (fonts too small to read); a wide, map-scale
  // layout fixes both (note 2026-07-14). Font sizes live in FIG_FS; the bands below are sized
  // to clear them. Caption-only figures still get top padding so the caption clears the frame.
  const headH = (fig.title ? 58 : fig.caption ? 20 : 0) + (fig.caption ? 38 : 0);
  const footH = fig.factions.length ? 62 : 0;
  const parts: string[] = [];
  if (fig.title)
    parts.push(
      `<text x="${VW / 2}" y="46" text-anchor="middle" font-family="serif" font-size="${FIG_FS.title}" font-weight="700" fill="${PAL.ink}">${esc(fig.title)}</text>`,
    );
  if (fig.caption)
    parts.push(
      `<text x="${VW / 2}" y="${headH - 12}" text-anchor="middle" font-family="serif" font-size="${FIG_FS.caption}" font-weight="600" fill="${PAL.ink}" opacity="0.82">${esc(fig.caption)}</text>`,
    );
  if (headH)
    parts.push(
      `<line x1="34" y1="${headH + 2}" x2="${VW - 34}" y2="${headH + 2}" stroke="${PAL.line}" stroke-width="1.4"/>`,
    );
  if (footH) {
    const fs = FIG_FS.legend,
      chip = 26,
      pad = 8,
      gap = 26;
    const items = fig.factions.map((f) => {
      const label = f.label + (tallies?.[f.key] ? ` ${tallies[f.key]}` : '');
      return { color: f.color, label, w: chip + pad + textW(label, fs) };
    });
    const total = items.reduce((a, b) => a + b.w, 0) + gap * (items.length - 1);
    let x = (VW - total) / 2;
    const y = headH + VH + 38; // legend text baseline
    for (const it of items) {
      parts.push(
        `<rect x="${x.toFixed(1)}" y="${y - chip + 3}" width="${chip}" height="${chip}" rx="5" fill="${it.color}"/>` +
          `<text x="${(x + chip + pad).toFixed(1)}" y="${y}" font-family="serif" font-size="${fs}" font-weight="700" fill="${PAL.ink}">${esc(it.label)}</text>`,
      );
      x += it.w + gap;
    }
  }
  return { headH, footH, parts };
}

function wrapFigure(
  ariaLabel: string,
  VW: number,
  VH: number,
  chrome: Chrome,
  defs: string[],
  content: string[],
): string {
  const TH = chrome.headH + VH + chrome.footH;
  return (
    `<svg class="scene-map scene-figure" viewBox="0 0 ${VW} ${TH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(ariaLabel)}">` +
    `<defs>${defs.join('')}</defs>` +
    `<rect x="6" y="6" width="${VW - 12}" height="${TH - 12}" rx="14" fill="${PAL.ground}" stroke="${PAL.line}"/>` +
    chrome.parts.join('') +
    `<g transform="translate(0 ${chrome.headH})">${content.join('')}</g>` +
    `</svg>`
  );
}

export function buildFigure(work: Work, key: string, viewCh: number): string {
  const fig = work.figures?.[key];
  if (!fig) return '';
  if (fig.kind === 'lineage') return buildLineage(work, key, fig, viewCh);
  if (fig.kind === 'battlefield') return buildBattlefield(work, key, fig);
  return buildAssembly(work, key, fig, viewCh);
}

// Last-wins: the fill for this seat with the largest fromCh that is <= viewCh.
function activeFill(fills: FigureFill[], seatId: string, viewCh: number): FigureFill | null {
  let best: FigureFill | null = null;
  for (const f of fills) {
    if (f.seat === seatId && f.fromCh <= viewCh && (!best || f.fromCh >= best.fromCh)) best = f;
  }
  return best;
}

function buildAssembly(work: Work, key: string, fig: AssemblyFigure, viewCh: number): string {
  const [VW, VH] = fig.vb ?? [1000, 340];
  const colorOf = (fk: string) => fig.factions.find((f) => f.key === fk)?.color || PAL.line;
  const uid = `fg-${key}`;
  const defs: string[] = [];
  const body: string[] = [];
  if (fig.dais) {
    const dc = colorOf(fig.dais.faction || '');
    body.push(
      `<circle cx="${fig.dais.x}" cy="${fig.dais.y}" r="${DAIS_R}" fill="${dc}" stroke="${dc}" stroke-width="2.4"/>`,
    );
    if (fig.dais.label) {
      const dfs = daisFontSize(fig.dais.label);
      body.push(
        `<text x="${fig.dais.x}" y="${fig.dais.y + midBase(dfs)}" text-anchor="middle" font-family="serif" font-size="${dfs}" font-weight="700" fill="#fff">${esc(fig.dais.label)}</text>`,
      );
    }
  }
  const { W, H } = SEAT;
  fig.seats.forEach((s, i) => {
    const fill = activeFill(fig.fills, s.id, viewCh);
    const c = colorOf(fill?.faction || fig.base || '');
    // Life-stage variant (`p-x@young`): draw the variant FACE but open/name the base card,
    // like the lineage figure and inline <face> (inlineFaces.ts). A seat figure that tracks
    // one person across chapters (shibusawa ch2「きみの 座」) needs the young face, not the
    // portrait the base card carries.
    const cardId = fill?.pid?.split('@')[0];
    const isYou = !!cardId && cardId === work.protagonistId;
    body.push(
      `<rect x="${(s.x - W / 2).toFixed(1)}" y="${(s.y - H / 2).toFixed(1)}" width="${W}" height="${H}" rx="8" fill="${c}" opacity="${fill ? 0.95 : 0.5}" stroke="${isYou ? PAL.gold : fill ? c : PAL.line}" stroke-width="${isYou ? 3.6 : 1.6}"/>`,
    );
    // The seat's own place/office (who sits there is the fill's job). SVG text = no ruby,
    // so a role must be a name the scene body teaches.
    if (s.role)
      body.push(
        `<text x="${s.x}" y="${s.y + H / 2 + 24}" text-anchor="middle" font-family="serif" font-size="${FIG_FS.seatRole}" font-weight="600" fill="${PAL.ink}" opacity="0.72">${esc(s.role)}</text>`,
      );
    if (fill?.pid && cardId && work.cards[cardId] && work.faces[fill.pid]) {
      const r = 18,
        cx = s.x - W / 2 + 26,
        cy = s.y,
        cid = `${uid}-s${i}`;
      defs.push(`<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r - 2}"/></clipPath>`);
      // Name from the BASE id (like buildLineage): shortNames need not carry a variant key.
      const nm = fill.label || nameOf(work, cardId);
      const face =
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAL.panel}" stroke="${isYou ? PAL.gold : c}" stroke-width="2.2"/>` +
        faceSvg(fill.pid, cx - r, cy - r, r * 2, cid, work.faces) +
        (nm
          ? `<text x="${cx + 26}" y="${cy + midBase(FIG_FS.seatName)}" font-family="serif" font-size="${FIG_FS.seatName}" font-weight="700" fill="${PAL.ink}">${esc(nm)}</text>`
          : '');
      body.push(
        `<g class="mapface" data-pid="${esc(cardId)}" role="button" tabindex="0" aria-label="${esc(nameOf(work, cardId) || '人物')}の カードを ひらく">${face}</g>`,
      );
    } else if (fill?.label) {
      body.push(
        `<text x="${s.x}" y="${s.y + midBase(FIG_FS.seatLabel)}" text-anchor="middle" font-family="serif" font-size="${FIG_FS.seatLabel}" font-weight="700" fill="#fff">${esc(fill.label)}</text>`,
      );
    }
  });
  const tallies = fig.tally
    ? {
        [fig.tally]: `${fig.seats.filter((s) => activeFill(fig.fills, s.id, viewCh)?.faction === fig.tally).length}/${fig.seats.length}`,
      }
    : undefined;
  const chrome = buildChrome(fig, VW, VH, tallies);
  return wrapFigure(fig.title || '席の図', VW, VH, chrome, defs, body);
}

// A pennant cluster standing in for a body of troops (顔なし＝軍勢, the ch6 grammar). `dir`
// = +1 fans the banners east/right, -1 west/left, so two facing armies lean toward each other.
function pennantCluster(cx: number, cy: number, n: number, color: string, dir: number): string {
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = cx + i * 26 * dir;
    const y = cy + (i % 2) * 10 - 4;
    s +=
      `<line x1="${x}" y1="${y - 26}" x2="${x}" y2="${y + 10}" stroke="${PAL.ink}" stroke-width="2" opacity="0.7"/>` +
      `<path d="M${x} ${y - 26} L${x + 22 * dir} ${y - 20} L${x} ${y - 12} Z" fill="${color}"/>`;
  }
  return s;
}

// A rounded hill (high ground) centered at cx, rising from baseY up to peakY. A unit drawn on
// the hump reads as ON high ground looking down (見おろす) — the elevation a flat roster can't show.
function hillHump(cx: number, baseY: number, peakY: number, halfW: number): string {
  const p = `M${cx - halfW} ${baseY} Q${cx - halfW * 0.5} ${peakY} ${cx} ${peakY} Q${cx + halfW * 0.5} ${peakY} ${cx + halfW} ${baseY} Z`;
  return `<path d="${p}" fill="#d9cba6" stroke="${PAL.line}" stroke-width="1.4"/>`;
}

// 装置3・戦場の図: a valley where two armies face across a front seam, with poised units on the
// high ground to either side. Terrain (valley + hills) is drawn behind the units. The seam is a
// dashed line, never an arrow — the board states the standoff, not who won (WRITING 地図書法2).
function buildBattlefield(work: Work, key: string, fig: BattlefieldFigure): string {
  const [VW, VH] = fig.vb ?? [1000, 340];
  const colorOf = (fk: string) => fig.factions.find((f) => f.key === fk)?.color || PAL.line;
  const uid = `fg-${key}`;
  const defs: string[] = [];
  const terrain: string[] = []; // valley + hills, drawn behind the units
  const body: string[] = [];

  // The valley floor the facing lines stand in, so the two armies read as meeting IN a place.
  const bx0 = VW * 0.12,
    bx1 = VW * 0.88;
  terrain.push(
    `<path d="M${bx0} 40 Q${VW / 2} 10 ${bx1} 40 L${bx1} 150 Q${VW / 2} 180 ${bx0} 150 Z" fill="#e6dcc0" stroke="${PAL.line}" stroke-width="1.2" opacity="0.9"/>`,
  );
  if (fig.seam) {
    terrain.push(
      `<line x1="${fig.seam.x}" y1="48" x2="${fig.seam.x}" y2="142" stroke="${PAL.ink}" stroke-width="2" stroke-dasharray="6 7" opacity="0.5"/>`,
    );
    if (fig.seam.label)
      terrain.push(
        `<text x="${fig.seam.x}" y="30" text-anchor="middle" font-family="serif" font-size="${FIG_FS.seatRole}" font-weight="600" fill="${PAL.ink}" opacity="0.6">${esc(fig.seam.label)}</text>`,
      );
  }

  fig.units.forEach((u: BattleUnit, i) => {
    const c = colorOf(u.faction);
    const isYou = !!u.pid && u.pid === work.protagonistId;
    if (u.hill) terrain.push(hillHump(u.x, u.y + 60, u.y - 35, 130));
    // Troops fan FORWARD of the leader toward the seam (leader at the back edge, army pressing in).
    if (u.troops) body.push(pennantCluster(u.x + (u.facing ?? 1) * 120, u.y, u.troops, c, u.facing ?? 1));
    if (u.pid && work.cards[u.pid] && work.faces[u.pid]) {
      const r = 26,
        cx = u.x,
        cy = u.y,
        cid = `${uid}-u${i}`;
      defs.push(`<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r - 2}"/></clipPath>`);
      const nm = u.label || nameOf(work, u.pid);
      // The name sits opposite the troops (a right-fanning line puts its leader's name on the left).
      const nameLeft = !!u.troops && (u.facing ?? 1) > 0;
      const nx = nameLeft ? cx - r - 8 : cx + r + 8;
      const anchor = nameLeft ? 'end' : 'start';
      const chip =
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAL.panel}" stroke="${isYou ? PAL.gold : c}" stroke-width="${isYou ? 3.4 : 3}"/>` +
        faceSvg(u.pid, cx - r, cy - r, r * 2, cid, work.faces) +
        (nm
          ? `<text x="${nx}" y="${cy + midBase(FIG_FS.seatName)}" text-anchor="${anchor}" font-family="serif" font-size="${FIG_FS.seatName}" font-weight="700" fill="${PAL.ink}">${esc(nm)}</text>`
          : '');
      body.push(
        `<g class="mapface" data-pid="${esc(u.pid)}" role="button" tabindex="0" aria-label="${esc(nameOf(work, u.pid) || '人物')}の カードを ひらく">${chip}</g>`,
      );
    } else if (u.label) {
      const { W: w, H: h } = BLOCK;
      body.push(
        `<rect x="${u.x - w / 2}" y="${u.y - h / 2}" width="${w}" height="${h}" rx="8" fill="${c}" stroke="${c}" stroke-width="1.6"/>` +
          `<text x="${u.x}" y="${u.y + midBase(FIG_FS.seatLabel)}" text-anchor="middle" font-family="serif" font-size="${FIG_FS.seatLabel}" font-weight="700" fill="#fff">${esc(u.label)}</text>`,
      );
    }
    if (u.role)
      body.push(
        `<text x="${u.x}" y="${u.y + (u.hill ? 54 : 44)}" text-anchor="middle" font-family="serif" font-size="${FIG_FS.seatRole}" font-weight="600" fill="${PAL.ink}" opacity="0.72">${esc(u.role)}</text>`,
      );
  });

  const chrome = buildChrome(fig, VW, VH);
  return wrapFigure(fig.title || '戦場の図', VW, VH, chrome, defs, [...terrain, ...body]);
}

// A severed tie (LineageEdge.cutCh): the line stays but goes dashed and carries the
// genealogy convention for an ended relation — a double slash across it. Both people
// remain in the figure; a reader cannot notice someone who is simply gone.
function cutMark(x: number, y: number, vertical: boolean): string {
  const slash = (d: number) =>
    vertical
      ? `<line x1="${x - 11}" y1="${(y + d + 7).toFixed(1)}" x2="${x + 11}" y2="${(y + d - 7).toFixed(1)}" stroke="${PAL.ink}" stroke-width="3.2" stroke-linecap="round"/>`
      : `<line x1="${(x + d - 7).toFixed(1)}" y1="${y + 11}" x2="${(x + d + 7).toFixed(1)}" y2="${y - 11}" stroke="${PAL.ink}" stroke-width="3.2" stroke-linecap="round"/>`;
  return slash(-5) + slash(5);
}

function buildLineage(work: Work, key: string, fig: LineageFigure, viewCh: number): string {
  const [VW, VH] = fig.vb ?? [1000, 470];
  const colorOf = (fk: string) => fig.factions.find((f) => f.key === fk)?.color || PAL.line;
  const uid = `fg-${key}`;
  const byId: Record<string, LineageFigure['nodes'][number]> = {};
  fig.nodes.forEach((n) => (byId[n.id] = n));
  const vis = (n?: LineageFigure['nodes'][number]) => !!n && (n.fromCh ?? 1) <= viewCh;
  const defs: string[] = [];
  const edges: string[] = [];
  fig.edges.forEach((e) => {
    const a = byId[e.from],
      b = byId[e.to];
    if (!vis(a) || !vis(b) || e.fromCh > viewCh) return;
    const cut = e.cutCh !== undefined && e.cutCh <= viewCh;
    const broken = cut ? ` stroke-dasharray="9 11" opacity="0.5"` : '';
    if (e.kind === 'marriage') {
      const y = a.y;
      edges.push(
        `<line x1="${a.x + 34}" y1="${y - 5}" x2="${b.x - 34}" y2="${y - 5}" stroke="${PAL.gold}" stroke-width="4.2"${broken}/>` +
          `<line x1="${a.x + 34}" y1="${y + 5}" x2="${b.x - 34}" y2="${y + 5}" stroke="${PAL.gold}" stroke-width="4.2"${broken}/>`,
      );
      if (cut) edges.push(cutMark((a.x + b.x) / 2, y, false));
    } else {
      // Genealogy grammar: with both parents known (from2), the child's line drops
      // from the midpoint of the couple's marriage line, not from one parent's chin.
      const p2 = e.from2 ? byId[e.from2] : undefined;
      const useMid = !!p2 && vis(p2);
      const sx = useMid ? (a.x + p2.x) / 2 : a.x;
      const sy = useMid ? a.y + 8 : a.y + 34;
      const my = (a.y + b.y) / 2;
      edges.push(
        `<path d="M${sx} ${sy} L${sx} ${my} L${b.x} ${my} L${b.x} ${b.y - 34}" fill="none" stroke="${PAL.line}" stroke-width="4.2"${broken}/>`,
      );
      // Mark the longest of the elbow's three straight runs, so the slashes never land
      // on a corner (the horizontal run vanishes when the child sits under its parents).
      if (cut) {
        const runs: [number, () => string][] = [
          [Math.abs(b.x - sx), () => cutMark((sx + b.x) / 2, my, false)],
          [my - sy, () => cutMark(sx, (sy + my) / 2, true)],
          [b.y - 34 - my, () => cutMark(b.x, (my + b.y - 34) / 2, true)],
        ];
        edges.push(runs.sort((p, q) => q[0] - p[0])[0][1]());
      }
    }
  });
  const nodes: string[] = [];
  fig.nodes.forEach((n, i) => {
    if (!vis(n)) return;
    const fillC = colorOf(n.house);
    const strokeC = n.ring ? colorOf(n.ring) : fillC;
    const sw = n.ring ? 5 : 2.6;
    const r = NODE_R;
    // Life-stage variant (`p-x@wife`): draw the variant FACE but open/name the base card,
    // like inline <face>/closeup (inlineFaces.ts). The lineage figure was the only face
    // visual that ignored '@', so a protagonist shown young in one chapter and aged in
    // another could not stay clickable (figures.ts flagged this for masako's 御台所 node).
    const cardId = n.pid?.split('@')[0];
    const hasFace = !!(n.pid && work.faces[n.pid]);
    let g = '';
    if (hasFace) {
      const cid = `${uid}-n${i}`;
      defs.push(`<clipPath id="${cid}"><circle cx="${n.x}" cy="${n.y}" r="${r - 2.4}"/></clipPath>`);
      g +=
        `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fillC}" stroke="${strokeC}" stroke-width="${sw}"/>` +
        faceSvg(n.pid!, n.x - r, n.y - r, r * 2, cid, work.faces);
    } else {
      g += `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fillC}" stroke="${strokeC}" stroke-width="${sw}"/>`;
      if (n.label) {
        const lfs = n.label.length > 1 ? FIG_FS.nodeLabel : FIG_FS.nodeLabel1;
        g += `<text x="${n.x}" y="${n.y + midBase(lfs)}" text-anchor="middle" font-family="serif" font-size="${lfs}" font-weight="700" fill="#fff">${esc(n.label)}</text>`;
      }
    }
    // Face nodes get their name below; label-only nodes already carry it inside
    // the circle (a second copy below would read as another person).
    const nm = hasFace ? n.label || nameOf(work, cardId!) : '';
    if (nm)
      g += `<text x="${n.x}" y="${n.y + r + 26}" text-anchor="middle" font-family="serif" font-size="${FIG_FS.nodeName}" font-weight="700" fill="${PAL.ink}">${esc(nm)}</text>`;
    nodes.push(
      cardId && work.cards[cardId]
        ? `<g class="mapface" data-pid="${esc(cardId)}" role="button" tabindex="0" aria-label="${esc(nameOf(work, cardId) || '人物')}の カードを ひらく">${g}</g>`
        : `<g>${g}</g>`,
    );
  });
  const chrome = buildChrome(fig, VW, VH);
  return wrapFigure(fig.title || '血の縁の図', VW, VH, chrome, defs, [...edges, ...nodes]);
}
