// ★Q 観察ビューのオーバーレイ（純粋な文字列生成関数）。
//
// メインビジュアル（closeup / figure / 読み解き地図）の「上に重ねる」層。絵そのものは
// 描かない——エンジンは作品固有の絵の語彙を持たないので、observe は「すでにある絵の
// 中に、何が見つかるか」だけを足す。ゆえに主ビジュアルの選択規則にも触らない。
//   - レンズの外は古紙色の紗で霞み、レンズの下だけが素の絵として見える（＝「目を凝らす」の
//     視覚化）。暗幕でなく古紙色なのは、これが捜索でなく観察だから——手記を明かりに
//     透かす手ざわりに寄せる。
//   - 見つけた hotspot には印が残り、再訪で読み直せる（VISION 原則3「収集と再訪」）。
//   - キャプションは描かない。SVG の <text> は <ruby> を運べず、ふりがなが落ちる
//     （読み解き地図の note が置かれているのと同じ制約）。ふりがなが要る文字列は
//     UI 側が HTML で描く。ここは印とレンズだけを描く。
//   - 色は CSS 変数に依存しない固定パレット（closeup と同じ"絵"の扱い。テーマ非依存で、
//     render-observe.ts の単体書き出しでもそのまま見える）。
//   - mask / グラデーションの id は `ob-<sceneId>-` で接頭する（closeup と同じ規律。
//     シーン切替は {#key} で DOM ごと再生成される前提）。
import type { ObserveHotspot, ObserveSpec } from '../types';
import { foundNumbers, visibleHotspots } from '../observe';

/** 主ビジュアルの viewBox。オーバーレイは同じ座標系で描いて初めて絵と重なる。 */
export interface ObserveFrame {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** レンズの中心（正規化座標 0..1）。指に追従する＝はかない状態なので呼び手が持つ。 */
export interface ObserveLens {
  x: number;
  y: number;
}

/** レンズ半径（絵の幅に対する比）。なでれば当たる大きさ＝探索を作業にしない。 */
export const LENS_R = 0.14;

/** 見つけた印の半径（絵の幅に対する比）。 */
export const MARK_R = 0.021;

const PAL = {
  /** 紗（古紙）。レンズの外を霞ませる。 */
  veil: '#e8dcbe',
  /** レンズの環（インクの線）。 */
  ring: '#4a3a1e',
  ringInner: '#fdf6e3',
  /** レンズ下で灯る ✦。 */
  spark: '#e0a020',
  /** 見つけた印。 */
  mark: '#f4ecd6',
  markInk: '#4a3a1e',
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * `viewBox="a b c d"` を読む。主ビジュアルの座標系をオーバーレイに引き継ぐための唯一の入口
 * （closeup は固定 800x500 だが読み解き地図は content-fit ＝シーンごとに違う）。
 */
export function parseFrame(svg: string): ObserveFrame | null {
  const m = /viewBox="([-\d.eE+\s]+)"/.exec(svg);
  if (!m) return null;
  const v = m[1].trim().split(/\s+/).map(Number);
  if (v.length !== 4 || v.some((n) => !Number.isFinite(n)) || v[2] <= 0 || v[3] <= 0) return null;
  return { x: v[0], y: v[1], w: v[2], h: v[3] };
}

/**
 * 正規化座標 (nx, ny) の下にある hotspot。gate が閉じたものには当たらない。
 * 重なったら中心が近い方が勝つ＝データの並び順で結果が変わらない。
 * `aspect` は絵の 幅/高さ。r は幅に対する比なので、y 差をこれで補正して真円で判定する。
 */
export function hotspotAt(
  spec: ObserveSpec,
  found: readonly string[],
  nx: number,
  ny: number,
  aspect: number,
): ObserveHotspot | null {
  let best: ObserveHotspot | null = null;
  let bestD = Infinity;
  for (const h of visibleHotspots(spec, found)) {
    const dx = nx - h.x;
    const dy = (ny - h.y) / aspect;
    const d = dx * dx + dy * dy;
    if (d <= h.r * h.r && d < bestD) {
      best = h;
      bestD = d;
    }
  }
  return best;
}

/**
 * ✦ の輪郭（四芒星の `d`）。「気づき」の印はここでしか描かれない一つの形で、
 * つながり図鑑の星（art/constellation.ts）も同じ形を使う——レンズの下で灯った ✦ が、
 * そのまま図鑑の星になる（＝読者にとって同じ物である）。
 */
export function sparkStarPath(cx: number, cy: number, s: number): string {
  return (
    `M ${r2(cx)} ${r2(cy - s)}` +
    ` Q ${r2(cx + s * 0.17)} ${r2(cy - s * 0.17)} ${r2(cx + s)} ${r2(cy)}` +
    ` Q ${r2(cx + s * 0.17)} ${r2(cy + s * 0.17)} ${r2(cx)} ${r2(cy + s)}` +
    ` Q ${r2(cx - s * 0.17)} ${r2(cy + s * 0.17)} ${r2(cx - s)} ${r2(cy)}` +
    ` Q ${r2(cx - s * 0.17)} ${r2(cy - s * 0.17)} ${r2(cx)} ${r2(cy - s)} Z`
  );
}

/** ✦（レンズ下で「ここに何かある」と灯る四芒星）。 */
function sparkStar(cx: number, cy: number, s: number): string {
  return `<path class="ob-spark" d="${sparkStarPath(cx, cy, s)}" fill="${PAL.spark}"/>`;
}

/**
 * 観察ビューのオーバーレイ SVG。主ビジュアルと同じ viewBox で返すので、実行時は
 * 絶対配置で重ね、書き出し（render-observe.ts）では中身を絵に差し込むだけで座標が合う。
 * lens 省略＝指が触れていない状態（紗を敷かず、見つけた印だけを見せる）。
 */
export function buildObserveOverlay(
  sceneId: string,
  spec: ObserveSpec,
  found: readonly string[],
  frame: ObserveFrame,
  lens?: ObserveLens,
): string {
  const uid = `ob-${sceneId}`;
  const aspect = frame.w / frame.h;
  const X = (nx: number) => r2(frame.x + nx * frame.w);
  const Y = (ny: number) => r2(frame.y + ny * frame.h);
  const R = (nr: number) => r2(nr * frame.w);

  // 紗＋レンズの穴。中心は素通し、縁で紗に溶ける（硬い切り口＝「窓」に見せない）。
  let veil = '';
  if (lens) {
    veil =
      `<defs>` +
      `<radialGradient id="${uid}-fade">` +
      `<stop offset="0.68" stop-color="#000000"/>` +
      `<stop offset="1" stop-color="#ffffff"/>` +
      `</radialGradient>` +
      `<mask id="${uid}-hole">` +
      `<rect x="${r2(frame.x)}" y="${r2(frame.y)}" width="${r2(frame.w)}" height="${r2(frame.h)}" fill="#ffffff"/>` +
      `<circle cx="${X(lens.x)}" cy="${Y(lens.y)}" r="${R(LENS_R)}" fill="url(#${uid}-fade)"/>` +
      `</mask>` +
      `</defs>` +
      `<rect class="ob-veil" x="${r2(frame.x)}" y="${r2(frame.y)}" width="${r2(frame.w)}"` +
      ` height="${r2(frame.h)}" fill="${PAL.veil}" opacity="0.82" mask="url(#${uid}-hole)"/>` +
      `<circle class="ob-lens" cx="${X(lens.x)}" cy="${Y(lens.y)}" r="${R(LENS_R)}" fill="none"` +
      ` stroke="${PAL.ringInner}" stroke-width="${R(0.009)}" opacity="0.5"/>` +
      `<circle class="ob-lens" cx="${X(lens.x)}" cy="${Y(lens.y)}" r="${R(LENS_R)}" fill="none"` +
      ` stroke="${PAL.ring}" stroke-width="${R(0.005)}" opacity="0.85"/>`;
  }

  // 未発見でレンズ下に入ったものは ✦ が灯る。発見済みには印が残る（再訪で読み直せる）。
  const under = lens ? hotspotAt(spec, found, lens.x, lens.y, aspect) : null;
  const numbers = foundNumbers(spec, found);
  const marks = visibleHotspots(spec, found)
    .map((h) => {
      const got = found.includes(h.id);
      if (!got) {
        if (!under || under.id !== h.id) return '';
        // 灯りの円は hotspotAt の当たり半径と同一にする。これが DOM 上のタップ標的でもあるので、
        // 見た目だけ縮めると「なでれば灯るのにタップは外れる」になる（＝掃きと拾いの不一致）。
        return (
          `<g class="obspot" data-hid="${h.id}" role="button" tabindex="0" aria-label="気づきを ひろう">` +
          `<circle cx="${X(h.x)}" cy="${Y(h.y)}" r="${R(h.r)}" fill="${PAL.spark}" opacity="0.16"/>` +
          sparkStar(X(h.x), Y(h.y), R(MARK_R * 1.5)) +
          `</g>`
        );
      }
      // The mark carries the discovery NUMBER, and the caption list repeats it — that pairing is
      // what tells the reader which line belongs to the mark they just tapped (family play
      // 2026-07-22). Digits only: SVG <text> cannot carry <ruby>, which is why every other piece
      // of observe text lives in the HTML panel.
      const n = numbers.get(h.id) ?? 0;
      return (
        `<g class="obspot found" data-hid="${h.id}" role="button" tabindex="0" aria-label="${n}ばんめに 見つけた ものを 読む">` +
        `<circle cx="${X(h.x)}" cy="${Y(h.y)}" r="${R(MARK_R)}" fill="${PAL.mark}" stroke="${PAL.markInk}"` +
        ` stroke-width="${R(0.004)}" opacity="0.94"/>` +
        `<text x="${X(h.x)}" y="${Y(h.y)}" fill="${PAL.markInk}" font-size="${R(MARK_R * 1.5)}"` +
        ` font-family="system-ui,sans-serif" font-weight="700" text-anchor="middle"` +
        ` dominant-baseline="central">${n}</text>` +
        `</g>`
      );
    })
    .join('');

  return (
    `<svg class="scene-observe" viewBox="${r2(frame.x)} ${r2(frame.y)} ${r2(frame.w)} ${r2(frame.h)}"` +
    ` xmlns="http://www.w3.org/2000/svg" role="img" aria-label="よく 見る">` +
    veil +
    marks +
    `</svg>`
  );
}
