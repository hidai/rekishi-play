// ★R つながり図鑑の幾何と SVG（純粋な文字列生成関数）。
//
// engine/graph.ts が「何が灯るか」を持ち、ここは「どこに描くか」だけを持つ（観察ビューの
// observe.ts / art/observe.ts と同じ分け方）。ドラッグの綱は、はかない指の状態なので
// 呼び手（Svelte 層）が持ち、ここは受け取った1点を線にするだけ。
//
//   - 座標系は固定枠（VW×VH）。作品データは正規化（0..1）で星を置き、ここが枠に写す。
//     観察ビューが正規化を「絵ごとに viewBox が違う」ために選んだのに対し、図鑑は自前の
//     枠を持つので、実行時の当たり判定は枠の単位で素直に測れる。
//   - 見出しは SVG の <text>（＝ruby を運べない。GraphNode.star の契約）。ふりがなが要る
//     一言（caption）は UI が HTML で描く——観察ビューが引いたのと同じ分界線。
//   - 色は手帳のペイン（相関図）と同じく CSS 変数＋作品データの分野色。絵ではなく図なので、
//     テーマに追従してよい（closeup / observe オーバーレイの固定パレットとは扱いが違う）。
//   - defs / id を使わない。同じペインに複数の図鑑が立つことは無いが、id を持たなければ
//     衝突の可能性ごと消える。
import type { GraphNode, WorkGraph } from '../types';
import { sparkStarPath } from './observe';
import { esc } from '../util';

/** 固定枠。図（figure）・地図と同じ 1000 幅の物差しで書く。 */
export const VW = 1000;
export const VH = 700;

/**
 * 星の半径＝**タップ標的そのもの**（描く円と当たり円を同じ数にする）。
 * 見た目だけ縮めると「見えているのにタップは外れる」になる（観察ビューで実際にやった）。
 * 図と同じく、この枠はカラム幅（およそ 680px）に開く＝1 単位 ≈ 0.68px なので直径 82px。
 * 手帳がいちばん狭い実機（およそ 390px）まで縮んでも 47px ＝指の標的の下限を割らない。
 */
export const STAR_R = 60;

/** ✦ の大きさ（星の芯）。 */
export const STAR_S = 26;

/** 見出しの字。図（FIG_FS.caption ＝ 25u ≈ 17px）と同じ 1000 幅での可読の目安。 */
export const STAR_FS = 24;

/** 見出しのベースライン（星の中心からの下げ幅）。 */
const LABEL_DY = STAR_R + STAR_FS;

const r2 = (n: number) => Math.round(n * 100) / 100;

export interface StarPos {
  x: number;
  y: number;
}

/**
 * 見出しの墨の幅（枠の単位）。全角は 1 字ぶん、半角は半字ぶんで数える
 * （相関図の主人公ピルが `.length` で足りずに溢れたのと同じ計算＝字数でなく墨で測る）。
 */
export function starLabelWidth(star: string): number {
  return [...star].reduce((w, c) => w + (/[\x20-\x7E｡-ﾟ]/.test(c) ? 0.5 : 1) * STAR_FS, 0);
}

/** 星ひとつが占める面（当たり円と見出しの箱）。はみ出し・重なりはこれで測る。 */
export interface StarBox {
  cx: number;
  cy: number;
  r: number;
  label: { x0: number; x1: number; y0: number; y1: number };
}

export function starBox(star: string, p: StarPos): StarBox {
  const half = starLabelWidth(star) / 2;
  return {
    cx: p.x,
    cy: p.y,
    r: STAR_R,
    label: {
      x0: p.x - half,
      x1: p.x + half,
      y0: p.y + LABEL_DY - STAR_FS * 0.82,
      y1: p.y + LABEL_DY + STAR_FS * 0.22,
    },
  };
}

/**
 * 星の居場所（枠の単位）。**盤上に出ているかとは無関係に、星座の完成形を返す**——
 * 気づきの星は作品が置いた場所に、発明の星はそれを生んだ辺の端点の重心に立つ。
 *
 * 位置が状態に依らないので、検査は「完成した星座」を一度に測れる（重なり・はみ出し）。
 * 発明が発明から生まれる場合に備えて解決は不動点まで回し、解けない星（辺が無い・
 * 循環している）は**返さない**——描かれないより、検査で落ちる方が安全（graphErrors）。
 */
export function layoutStars(graph: WorkGraph): Map<string, StarPos> {
  const linkById = new Map(graph.links.map((l) => [l.id, l]));
  const pos = new Map<string, StarPos>();
  for (const n of graph.nodes) {
    if (!n.bornOf?.length && n.x != null && n.y != null) pos.set(n.id, { x: n.x * VW, y: n.y * VH });
  }
  for (let pass = 0; pass < graph.nodes.length; pass++) {
    let grew = false;
    for (const n of graph.nodes) {
      if (pos.has(n.id) || !n.bornOf?.length) continue;
      const ends = new Set<string>();
      for (const id of n.bornOf) {
        const l = linkById.get(id);
        if (!l) continue;
        ends.add(l.a);
        ends.add(l.b);
      }
      ends.delete(n.id);
      const ps = [...ends].map((e) => pos.get(e));
      if (!ps.length || ps.some((p) => !p)) continue;
      pos.set(n.id, {
        x: ps.reduce((s, p) => s + p!.x, 0) / ps.length,
        y: ps.reduce((s, p) => s + p!.y, 0) / ps.length,
      });
      grew = true;
    }
    if (!grew) break;
  }
  return pos;
}

/**
 * 指の下にある星（盤上のものだけ）。重なったら中心が近い方が勝つ＝データの並び順で
 * 結果が変わらない（観察ビューの hotspotAt と同じ契約）。
 */
export function hitStar(
  graph: WorkGraph,
  pos: Map<string, StarPos>,
  known: ReadonlySet<string>,
  x: number,
  y: number,
): string | null {
  let best: string | null = null;
  let bestD = Infinity;
  for (const n of graph.nodes) {
    if (!known.has(n.id)) continue;
    const p = pos.get(n.id);
    if (!p) continue;
    const d = (x - p.x) ** 2 + (y - p.y) ** 2;
    if (d <= STAR_R * STAR_R && d < bestD) {
      best = n.id;
      bestD = d;
    }
  }
  return best;
}

/** ドラッグ中の綱。指の位置は枠の単位（呼び手が実測から写す）。 */
export interface ConstellationDrag {
  from: string;
  x: number;
  y: number;
}

function fieldColor(graph: WorkGraph, node: GraphNode): string {
  return graph.fields.find((f) => f.key === node.field)?.color ?? 'var(--ink-soft)';
}

/**
 * つながり図鑑の SVG。
 * `known`＝盤上の星（graph.knownNodeIds）／`made`＝読者が灯した辺の id。
 * `coach`＝持ち上げている星に「いま重ねれば灯る相手」の id（graph.coachTargets）＝序盤だけ
 * 脈動で指す（davinci §5-3）。窓の外・持っていないときは呼び手が空集合を渡す。脈動は
 * `.lifted` の環とは別語彙にする（環は「持っている／指の下」・脈動は「ここに落とせば つながる」）。
 *
 * 未発見の**気づき**は伏せ札（空の環）で見せる——集める動機になり、どの絵にあるかは
 * 漏れない。**発明**は伏せ札を持たない（居場所を辺から導くので、そもそも置けない）。
 * これは実装の都合であると同時に設計そのもの: 生まれる前の発明の枠が見えていたら、
 * 「線を引いたら何かが生まれた」という驚きを先に食ってしまう。
 */
export function buildConstellation(
  graph: WorkGraph,
  known: ReadonlySet<string>,
  made: readonly string[],
  drag?: ConstellationDrag,
  coach?: ReadonlySet<string>,
): string {
  const pos = layoutStars(graph);
  const on = new Set(made);
  const over = drag ? hitStar(graph, pos, known, drag.x, drag.y) : null;
  const lifted = new Set<string>();
  if (drag) {
    lifted.add(drag.from);
    if (over && over !== drag.from) lifted.add(over);
  }

  // 灯った辺。星の環から環へ引き、白の下線で図の上でも読めるようにする。
  const edges = graph.links
    .filter((l) => on.has(l.id))
    .map((l) => {
      const a = pos.get(l.a);
      const b = pos.get(l.b);
      if (!a || !b) return '';
      const dx = b.x - a.x,
        dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len,
        uy = dy / len;
      const x1 = r2(a.x + ux * STAR_R),
        y1 = r2(a.y + uy * STAR_R);
      const x2 = r2(b.x - ux * STAR_R),
        y2 = r2(b.y - uy * STAR_R);
      // 辺は控え（記録）であって、押すものではない。一言（caption）は ruby を運ぶので
      // SVG には描けず、ペインが図の下に HTML で並べる——読む標的はそちらの一覧で、
      // 太さ 7単位（およそ 5px）の線ではない。role=button を持たせると、指では狙えず
      // キーボードでしか押せない偽のボタンが tab 順に並ぶ。
      return (
        `<g class="staredge" data-eid="${l.id}">` +
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--panel)" stroke-width="7" stroke-linecap="round"/>` +
        `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--ink)" stroke-width="3" stroke-linecap="round" opacity="0.78"/>` +
        `</g>`
      );
    })
    .join('');

  // 綱＝指を追う光。辺の上・星の下に置く（星をつかんでいる手ざわりを壊さない）。
  // 星をつかんだままの位置（＝二タップで持ち上げた a11y 代替は「指」が星そのもの）では
  // 引かない——綱は「星と指の離れ」を描くものなので、離れが無ければ何も描くものが無い。
  // これで二タップとドラッグは「浮く」だけを共有し、UI 側に分岐が要らなくなる。
  let tether = '';
  if (drag) {
    const a = pos.get(drag.from);
    if (a && Math.hypot(drag.x - a.x, drag.y - a.y) > STAR_R) {
      tether =
        `<line class="star-tether" x1="${r2(a.x)}" y1="${r2(a.y)}" x2="${r2(drag.x)}" y2="${r2(drag.y)}"` +
        ` stroke="var(--gold)" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="11 9" opacity="0.9"/>` +
        `<circle class="star-tether" cx="${r2(drag.x)}" cy="${r2(drag.y)}" r="9" fill="var(--gold)" opacity="0.8"/>`;
    }
  }

  const stars = graph.nodes
    .map((n) => {
      const p = pos.get(n.id);
      if (!p) return '';
      const cx = r2(p.x),
        cy = r2(p.y);
      if (!known.has(n.id)) {
        // 伏せ札は気づきの星だけ。発明の居場所は（盤上に出ているかと無関係に）辺から
        // 決まってしまうので、伏せ札の分岐は放っておくと発明にも当たる——「線を引いたら
        // 何かが生まれた」の驚きを、生まれる前に枠として見せてしまう。
        if (n.bornOf?.length) return '';
        // 「まだ ここに 何かある」と読めるだけの濃さが要る（var(--line) では紙に溶けて
        // 消えた——実寸のラスタでしか分からない）。ただし星より弱く、名も伏せる。
        return (
          `<circle class="star-slot" cx="${cx}" cy="${cy}" r="${r2(STAR_R * 0.56)}" fill="var(--panel-2)"` +
          ` stroke="var(--ink-faint)" stroke-width="2.4" stroke-dasharray="6 7" opacity="0.5"/>`
        );
      }
      const col = fieldColor(graph, n);
      const up = lifted.has(n.id);
      const cue = coach?.has(n.id) ?? false;
      const born = !!n.bornOf?.length;
      return (
        `<g class="starnode${born ? ' invention' : ''}${up ? ' lifted' : ''}${cue ? ' coach' : ''}" data-nid="${n.id}"` +
        ` role="button" tabindex="0" aria-label="${esc(n.star)}">` +
        // 脈動は環の外側に置く（星・見出しには触れない＝読む字がちらつかない）。CSS が
        // opacity だけを揺らす（実機不明のブラウザでも確実に動く＝transform を避ける）。
        (cue ? `<circle class="star-pulse" cx="${cx}" cy="${cy}" r="${r2(STAR_R + 6)}" fill="none" stroke="${col}" stroke-width="3.4"/>` : '') +
        // 環＝描く円と当たり円は同じ半径。ここが指の標的そのもの。
        `<circle cx="${cx}" cy="${cy}" r="${STAR_R}" fill="${col}" opacity="${up ? 0.24 : 0.12}"/>` +
        (up ? `<circle cx="${cx}" cy="${cy}" r="${STAR_R}" fill="none" stroke="${col}" stroke-width="2.6" opacity="0.9"/>` : '') +
        (born
          ? `<circle cx="${cx}" cy="${cy}" r="${r2(STAR_S * 1.16)}" fill="var(--panel)" stroke="${col}" stroke-width="2.6"/>`
          : '') +
        `<path d="${sparkStarPath(p.x, p.y, STAR_S)}" fill="${col}"/>` +
        `<text x="${cx}" y="${r2(p.y + LABEL_DY)}" text-anchor="middle" font-family="var(--serif)"` +
        ` font-size="${STAR_FS}" font-weight="700" fill="var(--ink)" stroke="var(--panel)" stroke-width="4"` +
        ` style="paint-order:stroke">${esc(n.star)}</text>` +
        `</g>`
      );
    })
    .join('');

  return (
    `<svg class="constellation" viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" aria-label="気づきの 星と、つないだ 線の 図">` +
    edges +
    tether +
    stars +
    `</svg>`
  );
}
