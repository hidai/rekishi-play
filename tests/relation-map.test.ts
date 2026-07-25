// Guards G9 (no visual breakage) for the relation map (手帳「相関図」) across all
// works — ALL_WORKS, not WORKS: relations are authored while a work is still an unregistered
// skeleton, so a WORKS-only sweep skips exactly the period the labels are being written
// (ieyasu shipped skeleton-1 with two overflowing labels and nothing said so).
// The radial layout packs one node per person card; at higher densities the
// bottom pair's labels used to collide and could overflow the viewBox (kiyomori has
// 15 people vs hidenaga's 9). buildRelationMap now scales the ring radius / canvas
// with node count — this test locks that every node and every text label stays
// inside the viewBox and no two labels overlap, so any future work that adds many
// people is caught here instead of only in a manual visual-check.
import { describe, it, expect } from 'vitest';
import { buildRelationMap } from '../src/engine/map/relationMap';
import { ALL_WORKS } from './helpers/all-works';

// Approx text extent: full-width glyph ~= font-size px, ASCII space ~= half.
function textWidth(t: string, fs: number): number {
  return [...t].reduce((w, c) => w + (c === ' ' ? 0.5 : 1) * fs, 0);
}

type Box = { l: number; t: number; r: number; b: number; s: string };

for (const work of ALL_WORKS) {
  if (!work.relations) continue;
  describe(`relation map layout: ${work.id}`, () => {
    // Fully-revealed map = every person card collected (densest layout).
    const collected = new Set(Object.keys(work.cards));
    const svg = buildRelationMap(work, collected);
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/)!;
    const VW = parseFloat(vb[1]);
    const VH = parseFloat(vb[2]);

    const labels: Box[] = [];
    const re = /<text x="([\-\d.]+)" y="([\-\d.]+)"[^>]*font-size="([\d.]+)"[^>]*>(.*?)<\/text>/g;
    for (let m = re.exec(svg); m; m = re.exec(svg)) {
      const x = parseFloat(m[1]);
      const y = parseFloat(m[2]);
      const fs = parseFloat(m[3]);
      const txt = m[4].replace(/<[^>]+>/g, '');
      const w = textWidth(txt, fs);
      // baseline y with a rough ascent/descent band.
      labels.push({ l: x - w / 2, t: y - 0.8 * fs, r: x + w / 2, b: y + 0.2 * fs, s: txt });
    }

    it('renders one label pair (name + relation) per collected edge, plus the center', () => {
      // name + rel per edge, plus the center hero pill = 2*n + 1 texts.
      expect(labels.length).toBe(work.relations!.edges.length * 2 + 1);
    });

    it('keeps every text label inside the viewBox', () => {
      const overflow = labels.filter((b) => b.l < 0 || b.r > VW || b.b > VH || b.t < 0);
      expect(overflow.map((b) => b.s)).toEqual([]);
    });

    it('keeps every node circle inside the viewBox', () => {
      const nre = /<circle cx="([\-\d.]+)" cy="([\-\d.]+)" r="27"/g;
      for (let m = nre.exec(svg); m; m = nre.exec(svg)) {
        const cx = parseFloat(m[1]);
        const cy = parseFloat(m[2]);
        expect(cx - 27).toBeGreaterThanOrEqual(0);
        expect(cx + 27).toBeLessThanOrEqual(VW);
        expect(cy - 27).toBeGreaterThanOrEqual(0);
        expect(cy + 27).toBeLessThanOrEqual(VH);
      }
    });

    it('keeps text labels off the face circles', () => {
      // G9「顔が消える・ラベル衝突」. Label-vs-label and label-vs-viewBox were gated; label-vs-FACE
      // was not, so a long rel label could run straight across a neighbour's portrait and every
      // check stayed green (ieyasu skeleton-1: 天海's label cut 24u into 半蔵's face — the raster
      // showed it at once, the suite said nothing).
      // TOLERANCE is calibrated on the shipped, playtested corpus, whose labels graze the rims:
      // hidenaga 0u / kiyomori 3.0u / katsu 8.2u. So this is a regression floor ("no label may
      // cross a face"), not the ideal (0u). New works should author to ~0 — a label that needs
      // more than a rim graze is a label that is too long for the ring, and the fix is the words.
      const TOLERANCE = 9;
      const nodes: { cx: number; cy: number; r: number }[] = [];
      const nre = /<circle cx="([\-\d.]+)" cy="([\-\d.]+)" r="27"/g;
      for (let m = nre.exec(svg); m; m = nre.exec(svg))
        nodes.push({ cx: parseFloat(m[1]), cy: parseFloat(m[2]), r: 27 });
      expect(nodes.length, 'ノード円が拾えていない＝この検査が空振りしている').toBeGreaterThan(0);

      const hits: string[] = [];
      for (const b of labels) {
        for (const n of nodes) {
          // Distance from the circle's center to the nearest point of the label box.
          const dx = Math.max(b.l - n.cx, 0, n.cx - b.r);
          const dy = Math.max(b.t - n.cy, 0, n.cy - b.b);
          const depth = n.r - Math.hypot(dx, dy);
          if (depth > TOLERANCE) hits.push(`${b.s}（顔に ${depth.toFixed(1)}u 食い込み）`);
        }
      }
      expect(hits).toEqual([]);
    });

    it('center hero pill is wide enough for its own label', () => {
      // The pill width used to be `11 * label.length` while the text rendered at font-size 11.5,
      // so every all-full-width hero name spilled out of its gold pill by a hair. Nothing measured
      // it; it was parked as "check by eye when a work is added". This checks it instead.
      const pill = svg.match(/<rect x="([\-\d.]+)"[^>]*width="([\d.]+)"[^>]*rx="9.5"/);
      expect(pill, '中心ピルの rect が拾えていない＝この検査が空振りしている').toBeTruthy();
      const pillL = parseFloat(pill![1]);
      const pillR = pillL + parseFloat(pill![2]);
      const label = labels.find((b) => b.s.includes('（きみ）'));
      expect(label, 'ヒーローのラベルが拾えていない').toBeTruthy();
      expect(label!.l, `"${label!.s}" が ピルの 左に はみ出す`).toBeGreaterThanOrEqual(pillL);
      expect(label!.r, `"${label!.s}" が ピルの 右に はみ出す`).toBeLessThanOrEqual(pillR);
    });

    it('has no overlapping text labels', () => {
      const collisions: string[] = [];
      for (let i = 0; i < labels.length; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          const a = labels[i];
          const b = labels[j];
          const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l);
          const oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
          if (ox > 1 && oy > 1) collisions.push(`${a.s} × ${b.s}`);
        }
      }
      expect(collisions).toEqual([]);
    });
  });
}
