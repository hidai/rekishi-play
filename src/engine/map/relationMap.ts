// ★D 人物相関図（表示専用）の SVG ジェネレータ。純粋な文字列生成関数。
// 秀長を中心に、既存カードの人物を放射状に置き、関係を色分けの線でつなぐ。
// collected（取得済みカード id の集合）に入った人物だけ顔・名前・関係が現れ、
// まだの人物は「？」の伏せ札。プレイで"関係の網"がだんだん埋まっていく。
import type { Work } from '../types';
import { faceSvg, personName } from './sceneMap';
import { esc } from '../util';
import { heroName } from '../hero';

export function buildRelationMap(work: Work, collected: Set<string>): string {
  const rels = work.relations;
  if (!rels) return '';
  const you = work.protagonistId;
  const catColor: Record<string, string> = {};
  rels.cats.forEach((c) => (catColor[c.key] = c.color));

  const n = rels.edges.length;
  // Ring radius grows with node count so radial labels stay clear of one another
  // at higher densities (hidenaga has 9 people, kiyomori 15; a wheel of 15 packs
  // the bottom pair's labels into a collision at the fixed R=150). At n<=10 this
  // is a no-op (R=150, same viewBox); denser maps get a larger canvas that the
  // container scales down to fit. Keeps the layout work-agnostic (no per-work
  // constants) and hidenaga's output byte-identical.
  const nodeR = 27,
    cR = 37;
  const R = Math.round(150 * Math.max(1, n / 10.5));
  const cx = R + 60,
    cy = R + 55,
    VW = 2 * cx,
    VH = 2 * R + 130;
  const defs: string[] = [];
  const edges: string[] = [];
  const nodes: string[] = [];

  rels.edges.forEach((e, i) => {
    const ang = ((-90 + i * (360 / n)) * Math.PI) / 180;
    const co = Math.cos(ang),
      si = Math.sin(ang);
    const nx = cx + R * co,
      ny = cy + R * si;
    const col = catColor[e.cat] || '#5b5346';
    const on = collected.has(e.pid);
    // 線は中心リングの外縁からノードリングの外縁まで
    const ex = cx + cR * co,
      ey = cy + cR * si,
      tx = nx - nodeR * co,
      ty = ny - nodeR * si;
    edges.push(
      `<line x1="${ex.toFixed(1)}" y1="${ey.toFixed(1)}" x2="${tx.toFixed(1)}" y2="${ty.toFixed(1)}" stroke="${col}" stroke-width="${on ? 3 : 2}" stroke-linecap="round"${on ? '' : ' stroke-dasharray="4 5" opacity="0.4"'}/>`,
    );
    if (on) {
      // ノード（顔）＋ 名前 ＋ 関係ラベル（放射の外周に置くので中心付近で重ならない）。
      const cid = `rl-${i}`;
      defs.push(
        `<clipPath id="${cid}"><circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="${(nodeR - 1.4).toFixed(1)}"/></clipPath>`,
      );
      const nm = work.shortNames[e.pid] || personName(work, e.pid) || '';
      nodes.push(
        `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="${nodeR}" fill="var(--panel)" stroke="${col}" stroke-width="2.6"/>` +
          faceSvg(e.pid, nx - nodeR, ny - nodeR, nodeR * 2, cid, work.faces) +
          `<text x="${nx.toFixed(1)}" y="${(ny + nodeR + 13).toFixed(1)}" text-anchor="middle" font-family="var(--serif)" font-size="13.5" font-weight="700" fill="var(--ink)" stroke="var(--panel)" stroke-width="3" style="paint-order:stroke">${esc(nm)}</text>` +
          `<text x="${nx.toFixed(1)}" y="${(ny + nodeR + 27).toFixed(1)}" text-anchor="middle" font-family="var(--serif)" font-size="11" font-weight="700" fill="${col}" stroke="var(--panel)" stroke-width="2.6" style="paint-order:stroke">${esc(e.rel)}</text>`,
      );
    } else {
      // 伏せ札（？）
      nodes.push(
        `<circle cx="${nx.toFixed(1)}" cy="${ny.toFixed(1)}" r="${nodeR}" fill="var(--panel-2)" stroke="var(--line)" stroke-width="2" stroke-dasharray="4 4"/>` +
          `<text x="${nx.toFixed(1)}" y="${(ny + 8).toFixed(1)}" text-anchor="middle" font-family="var(--serif)" font-size="24" font-weight="700" fill="var(--ink-faint)">？</text>`,
      );
    }
  });

  // Center node = protagonist (always visible). Name comes from work data.
  const hero = heroName(work);
  const heroLabel = `${hero}（きみ）`;
  // Pill sized from the label's ink, not from `.length`: at font-size 11.5 a full-width glyph is
  // ~11.5px wide, so the old `11 * length` made the pill narrower than its own text and every
  // all-kanji hero name spilled out of it. Iterating code points also keeps surrogate pairs
  // (and half-width runs) honest. HERO_PAD leaves the rounded caps some room.
  const HERO_FS = 11.5;
  const HERO_PAD = 12;
  const heroInk = [...heroLabel].reduce(
    (w, c) => w + (/[\x20-\x7E｡-ﾟ]/.test(c) ? 0.5 : 1) * HERO_FS,
    0,
  );
  const pillW = heroInk + HERO_PAD;
  const ccid = 'rl-center';
  defs.push(
    `<clipPath id="${ccid}"><circle cx="${cx}" cy="${cy}" r="${(cR - 1.6).toFixed(1)}"/></clipPath>`,
  );
  const center =
    `<circle cx="${cx}" cy="${cy}" r="${cR}" fill="var(--panel)" stroke="var(--gold)" stroke-width="3.6"/>` +
    faceSvg(you, cx - cR, cy - cR, cR * 2, ccid, work.faces) +
    `<rect x="${cx - pillW / 2}" y="${cy + cR - 5}" width="${pillW}" height="19" rx="9.5" fill="var(--gold-deep)"/>` +
    `<text x="${cx}" y="${cy + cR + 8}" text-anchor="middle" font-family="var(--serif)" font-size="${HERO_FS}" font-weight="700" fill="#fff">${esc(heroLabel)}</text>`;

  return `<svg class="relmap" viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(hero)}を 中心と した 人物の 相関図">
    <defs>${defs.join('')}</defs>${edges.join('')}${nodes.join('')}${center}</svg>`;
}
