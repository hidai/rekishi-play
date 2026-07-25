// 似顔絵ジェネレータ（学習まんが・アニメ調）。
// フラットな簡易アバターだった旧版を全面刷新し、大きめの瞳（虹彩＋瞳孔＋ハイライト）・
// セル陰影（面で塗り分け）・太く均一な主線の「学習まんが」画風で描く。
// 100×100 座標・顔中心(50,51)で描く純粋な文字列生成関数（faceSvg が地図へ転記する前提）。
//
// 重要な制約: 出力に <defs>・id 属性・url(#...) を一切含めないこと。
// faceSvg が複数の顔をひとつの地図 SVG に転記し、カード図鑑も十数枚を同時に
// {@html} 描画するため、静的 id はどこかで必ず衝突する。グラデーションは使わず、
// セル影は「輪郭パスから派生した内側に閉じる不透明パス」で塗る（tests/engine-parity で固定）。
import type { FaceSpec } from '../types';
import { mixHex } from './color';

export const FACE_TONES: Record<string, string> = {
  ai: '#31608c',
  gold: '#bd8a28',
  seal: '#b53d2e',
  midori: '#4e7a5b',
  ink: '#5b5346',
};
export const FACE_HAIR: Record<string, string> = {
  dark: '#26211c',
  grey: '#8b8578',
  white: '#e4dfd3',
};

// アニメの均一主線。パーツ内部の柔らかい線は skinLine / hairLine（派生色）を使う。
const OUTLINE = '#26201a';
const INK = '#1c1a17'; // まつげ・黒髪パーツ
const LIP = '#a34632';
const IRIS_DEFAULT = '#5a3a22';

/** 左半分に描いた部品を y 軸対称で右へ複製する（ハイライト等の非対称要素は含めない）。 */
function mirror(inner: string): string {
  return `<g transform="translate(100 0) scale(-1 1)">${inner}</g>`;
}

/** Compact number for SVG transform attributes (strips float noise). */
function fmt(n: number): string {
  return String(+n.toFixed(3));
}

/** Scale by (kx, ky) about (cx, cy), then shift by (0, dy) — as one transform string. */
function about(cx: number, cy: number, kx: number, ky: number, dy: number): string {
  return `translate(${fmt(cx - cx * kx)} ${fmt(cy - cy * ky + dy)}) scale(${fmt(kx)} ${fmt(ky)})`;
}

// 輪郭シルエット。頭頂 y22-23・cx50 を揃え（かぶりものと整合）、頬〜あごで差別化。
// path=輪郭 / shade=右側面のセル影（輪郭の内側に閉じる三日月） / ear=[左耳x,右耳x] / chin=あご先y。
const SHAPES: Record<string, { path: string; shade: string; ear: [number, number]; chin: number }> = {
  oval: {
    path: 'M50 22 C64 22 73 33 73 49 C73 65.5 62.5 80 50 80 C37.5 80 27 65.5 27 49 C27 33 36 22 50 22 Z',
    shade:
      'M50 22 C64 22 73 33 73 49 C73 65.5 62.5 80 50 80 C59.5 75.5 68.2 62.5 68.2 48.5 C68.2 34.5 60.5 24.5 50 22 Z',
    ear: [27.5, 72.5],
    chin: 80,
  },
  round: {
    path: 'M50 23 C66 23 75 34.5 75 50 C75 64.5 63.5 78 50 78 C36.5 78 25 64.5 25 50 C25 34.5 34 23 50 23 Z',
    shade:
      'M50 23 C66 23 75 34.5 75 50 C75 64.5 63.5 78 50 78 C60.5 73.5 70 61.5 70 49.5 C70 36 62 25.5 50 23 Z',
    ear: [25.5, 74.5],
    chin: 78,
  },
  long: {
    path: 'M50 22 C62.5 22 70 32 70 47.5 C70 66 61 83 50 83 C39 83 30 66 30 47.5 C30 32 37.5 22 50 22 Z',
    shade:
      'M50 22 C62.5 22 70 32 70 47.5 C70 66 61 83 50 83 C58 77 65.5 63 65.5 47 C65.5 33.5 59 24.5 50 22 Z',
    ear: [30, 70],
    chin: 83,
  },
  square: {
    path: 'M50 23 C65 23 74 33 74 47 L74 60 C74 72.5 63 79 50 79 C37 79 26 72.5 26 60 L26 47 C26 33 35 23 50 23 Z',
    shade:
      'M50 23 C65 23 74 33 74 47 L74 60 C74 72.5 63 79 50 79 C60 75.5 69.3 68.5 69.3 59.5 L69.3 46.5 C69.3 34 61 25.5 50 23 Z',
    ear: [26, 74],
    chin: 79,
  },
  gaunt: {
    path: 'M50 22 C62 22 69.5 31.5 69.5 46.5 C69.5 57 66.5 69.5 60.5 76 Q55.5 81.5 50 81.5 Q44.5 81.5 39.5 76 C33.5 69.5 30.5 57 30.5 46.5 C30.5 31.5 38 22 50 22 Z',
    shade:
      'M50 22 C62 22 69.5 31.5 69.5 46.5 C69.5 57 66.5 69.5 60.5 76 Q55.5 81.5 50 81.5 C56 77.5 61.5 69 63.5 58 C65.5 46 62 28.5 50 22 Z',
    ear: [30.5, 69.5],
    chin: 81.5,
  },
};

/** 眉（左）。stroke でなく塗りのテーパー形状で描く（アニメの要）。 */
function browArt(kind: string, color: string, weight?: string): string {
  const d =
    {
      calm: 'M33 44.8 Q40 43.2 46.4 44.6 L46 46.8 Q40 45.2 33.6 46.8 Z',
      soft: 'M33.5 46.6 Q39.5 42 45.5 45.2 L44.8 47.2 Q39.5 44.4 34.3 48.2 Z',
      stern: 'M32.4 43.8 L46.6 44.4 L46.4 47.4 L32.2 46.6 Z',
      angry: 'M32 42.6 Q39 42.8 46.8 46.8 L45.8 49.2 Q38.6 45.4 32.4 45.2 Z',
      worried: 'M33.4 48 Q39.8 46.8 46.2 43.4 L47 45.6 Q40.4 48.8 34 50.2 Z',
    }[kind] || '';
  const one = `<path d="${d}" fill="${color}"/>`;
  const both = one + mirror(one);
  // 'fine' flattens the tapered bar about the brow band and lifts it: each kind keeps its
  // arc (calm/soft/…) but loses the heavy dark weight. The thick bar is the single strongest
  // "male" cue in this drawing grammar, so it must be a channel of its own, not baked into
  // the emotion kinds.
  return weight === 'fine' ? `<g transform="${about(50, 45.5, 1, 0.5, -1.6)}">${both}</g>` : both;
}

/** 虹彩＋下透け＋瞳孔（左右で呼ぶ）。まつげの前に描き、まつげが上まぶたの欠けを作る。 */
function irisStack(cx: number, cy: number, rx: number, ry: number, iris: string, pupilR?: number): string {
  const light = mixHex(iris, '#e8a860', 0.5);
  return (
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${iris}"/>` +
    `<ellipse cx="${cx}" cy="${cy + ry * 0.42}" rx="${rx * 0.62}" ry="${ry * 0.4}" fill="${light}"/>` +
    `<circle cx="${cx}" cy="${cy + 0.4}" r="${pupilR ?? rx * 0.48}" fill="#120a05"/>`
  );
}

/** ハイライト（両目とも光源＝左上に統一するため、ミラーせず絶対座標で置く）。 */
function eyeLights(cx: number, cy: number, big: boolean, dim: boolean): string {
  const r1 = big ? 1.25 : 1.05;
  let s = `<circle cx="${cx + 1.2}" cy="${cy - 1.7}" r="${r1}" fill="#fff"/>`;
  if (!dim) s += `<circle cx="${cx - 1.3}" cy="${cy + 1.5}" r="0.55" fill="#fff" opacity="0.75"/>`;
  if (big) s += `<circle cx="${cx + 2.3}" cy="${cy + 0.6}" r="0.45" fill="#fff" opacity="0.9"/>`;
  return s;
}

/** 目（両目まとめて）。白目→虹彩→まつげ→ハイライト→下ラインの順。 */
function eyeArt(kind: string, iris: string, skinShade: string): string {
  const L = 39.5; // 左目の虹彩中心 x（右は 100-L）
  const lower = `<path d="M34 57.2 Q39.5 58.6 45.2 56.8" stroke="${skinShade}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  switch (kind) {
    case 'closed': {
      const arc = `<path d="M33.5 51.5 Q39.5 55.5 45.5 51.5" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      return arc + mirror(arc);
    }
    case 'cry': {
      // 泣き＝ぎゅっと閉じた山なりの目＋滝の涙。
      const arc =
        `<path d="M33.5 54 Q39.5 49.4 45.5 54" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M37 55.5 Q35.2 62.5 37 70 Q39.2 62.5 37 55.5 Z" fill="#8fc4ea" opacity="0.92"/>` +
        `<path d="M37.3 58 Q36.6 62.5 37.3 66.5" stroke="#fff" stroke-width="0.7" fill="none" opacity="0.8"/>`;
      return arc + mirror(arc);
    }
    case 'wide': {
      // 衝撃＝白目を大きく・瞳孔を極小に収縮。
      const white = `<path d="M32.5 51 Q39.5 45 47 50.5 Q46.6 58.6 39.2 58.8 Q33 57.8 32.5 51 Z" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`;
      const lash = `<path d="M31.6 50.8 Q39.5 44.2 47.8 49.8 L47.2 51.8 Q39.5 46.6 32.4 52.8 Z" fill="${INK}"/>`;
      return (
        white +
        mirror(white) +
        irisStack(L, 52.4, 2.6, 3.1, iris, 0.8) +
        irisStack(100 - L, 52.4, 2.6, 3.1, iris, 0.8) +
        lash +
        mirror(lash) +
        `<circle cx="${L + 1}" cy="51.2" r="0.75" fill="#fff"/>` +
        `<circle cx="${100 - L + 1}" cy="51.2" r="0.75" fill="#fff"/>`
      );
    }
    case 'sharp': {
      // 三白眼＝角ばった白目・小さめ虹彩を上寄せ（下に白目が見える）。
      const white = `<path d="M32.6 51.6 L46.8 49.4 L45.8 55.8 Q38.5 57.4 34.2 55 Q33 53.4 32.6 51.6 Z" fill="#fff"/>`;
      const lash = `<path d="M31.6 51.8 Q39 46.6 47.6 48.6 L47.2 50.8 Q39 48.8 32.8 54 Z" fill="${INK}"/>`;
      return (
        white + mirror(white) +
        irisStack(L + 0.5, 51.8, 2.7, 3.3, iris) +
        irisStack(100 - L - 0.5, 51.8, 2.7, 3.3, iris) +
        lash + mirror(lash) +
        eyeLights(L + 0.5, 51.8, false, true) +
        eyeLights(100 - L - 0.5, 51.8, false, true) +
        lower + mirror(lower)
      );
    }
    case 'narrow': {
      // 細目＝縦幅を絞った切れ長。虹彩は上まぶた（まつげ）で欠ける。
      const white = `<path d="M33 51.4 Q40 48.6 46.8 50.6 Q45.8 54.8 39.4 55 Q34.2 54.4 33 51.4 Z" fill="#fff"/>`;
      const lash = `<path d="M32 51.2 Q40 47.2 47.8 49.6 L47.2 51.8 Q40 49.6 33.2 53.4 Z" fill="${INK}"/>`;
      return (
        white + mirror(white) +
        irisStack(L, 52, 2.7, 3.2, iris) +
        irisStack(100 - L, 52, 2.7, 3.2, iris) +
        lash + mirror(lash) +
        eyeLights(L, 52, false, true) +
        eyeLights(100 - L, 52, false, true) +
        lower + mirror(lower)
      );
    }
    case 'gentle': {
      // たれ目（秀長の同一性キュー）。目尻（外側）が下がる。
      const white = `<path d="M32 53.4 Q38.5 47.4 46.6 50.4 Q46.2 57 39.4 57.6 Q33 57 32 53.4 Z" fill="#fff"/>`;
      const lash = `<path d="M31.2 53.2 Q38.5 46.4 47.4 49.6 L46.8 51.8 Q38.7 48.6 32.4 54.8 Z" fill="${INK}"/>`;
      return (
        white + mirror(white) +
        irisStack(L, 52.8, 3.4, 4, iris) +
        irisStack(100 - L, 52.8, 3.4, 4, iris) +
        lash + mirror(lash) +
        eyeLights(L, 52.8, false, false) +
        eyeLights(100 - L, 52.8, false, false) +
        lower + mirror(lower)
      );
    }
    case 'lively': {
      // 大きな丸い目＋ハイライト3点（秀吉の人たらし）。
      const white = `<path d="M32.4 51.6 Q39.5 45.8 46.8 50.6 Q46.2 58.4 39 58.4 Q32.8 57 32.4 51.6 Z" fill="#fff"/>`;
      const lash = `<path d="M31.4 51.4 Q39.5 44.8 47.6 49.8 L47 52 Q39.5 47.6 32.6 53.4 Z" fill="${INK}"/>`;
      return (
        white + mirror(white) +
        irisStack(L, 52.6, 3.8, 4.5, iris) +
        irisStack(100 - L, 52.6, 3.8, 4.5, iris) +
        lash + mirror(lash) +
        eyeLights(L, 52.6, true, false) +
        eyeLights(100 - L, 52.6, true, false) +
        lower + mirror(lower)
      );
    }
    default: {
      // calm＝標準のアーモンド型。
      const white = `<path d="M32 52 Q39.5 47 47 51.2 Q45.8 58 39 58 Q33.4 57.2 32 52 Z" fill="#fff"/>`;
      const lash = `<path d="M31 51.8 Q39.5 45.6 47.8 50.4 L47.2 52.6 Q39.5 48.2 32.2 53.8 Z" fill="${INK}"/>`;
      return (
        white + mirror(white) +
        irisStack(L, 52.8, 3.3, 4.1, iris) +
        irisStack(100 - L, 52.8, 3.3, 4.1, iris) +
        lash + mirror(lash) +
        eyeLights(L, 52.8, false, false) +
        eyeLights(100 - L, 52.8, false, false) +
        lower + mirror(lower)
      );
    }
  }
}

/** Nose variants (face-engine slice 2). Every pre-slice-2 face shared one nose — the
 *  visual center of the face carried zero identity. Same soft-shading grammar as the
 *  classic nose (skin-derived strokes/fills, no hard outline). */
function noseArt(kind: string | undefined, skinShade: string, skinDeep: string): string {
  switch (kind) {
    case 'tall':
      // Long straight bridge from between the brows; reads as a high, prominent nose.
      return (
        `<path d="M50.9 54.5 Q51.5 58.5 50.2 62" stroke="${skinShade}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.85"/>` +
        `<path d="M48.2 62.9 Q50 64.3 51.8 62.9" stroke="${skinDeep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
        `<path d="M51.1 55.5 Q53 59.5 51 62.4 Q52.9 61.2 53.1 58.2 Z" fill="${skinShade}" opacity="0.55"/>`
      );
    case 'round':
      // Dango tip: a soft shaded ball over a wide base curve.
      return (
        `<path d="M50.5 56.5 L49.9 59.2" stroke="${skinShade}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.55"/>` +
        `<ellipse cx="50" cy="61.4" rx="2.6" ry="2" fill="${skinShade}" opacity="0.5"/>` +
        `<path d="M47.2 62.9 Q50 64.7 52.8 62.9" stroke="${skinDeep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`
      );
    case 'thin':
      // Fine, narrow: faint bridge, small base, sliver of a side plane.
      return (
        `<path d="M50.4 56 L49.9 61.2" stroke="${skinShade}" stroke-width="0.9" fill="none" stroke-linecap="round" opacity="0.6"/>` +
        `<path d="M48.9 62.7 Q50 63.6 51.1 62.7" stroke="${skinDeep}" stroke-width="1.3" fill="none" stroke-linecap="round"/>` +
        `<path d="M50.7 57.5 Q51.6 60 50.6 61.8 Q51.6 60.8 51.8 58.8 Z" fill="${skinShade}" opacity="0.45"/>`
      );
    case 'wide':
      // Broad base with nostril hooks on both sides.
      return (
        `<path d="M50.6 56.5 L49.8 60.3" stroke="${skinShade}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.6"/>` +
        `<path d="M46.6 61.8 Q46.9 63.5 48.4 63.6" stroke="${skinDeep}" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M53.4 61.8 Q53.1 63.5 51.6 63.6" stroke="${skinDeep}" stroke-width="1.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M48.4 63.7 Q50 64.4 51.6 63.7" stroke="${skinDeep}" stroke-width="1.4" fill="none" stroke-linecap="round"/>` +
        `<path d="M50.9 57.5 Q52.3 60.3 50.8 62 Q52.2 61 52.5 59 Z" fill="${skinShade}" opacity="0.5"/>`
      );
    default:
      // Classic standard nose: short bridge shadow + base + small side plane.
      return (
        `<path d="M50.6 56 L49.5 61" stroke="${skinShade}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.7"/>` +
        `<path d="M48 62.6 Q50 64 52 62.6" stroke="${skinDeep}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` +
        `<path d="M50.8 57.5 Q52.2 60.5 50.6 62 Q52 61 52.4 59 Z" fill="${skinShade}" opacity="0.5"/>`
      );
  }
}

/** 口。 */
function mouthArt(kind: string, skinDeep: string): string {
  switch (kind) {
    case 'laugh':
      // 歯と舌の見える大笑い（開口）。
      return (
        `<path d="M41 66.5 Q50 78.5 59 66.5 Q50 70.5 41 66.5 Z" fill="#6e2a1f" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
        `<path d="M43.6 67.6 Q50 70 56.4 67.6 L55.8 69.6 Q50 71.8 44.2 69.6 Z" fill="#fff"/>` +
        `<path d="M46 73.6 Q50 76.2 54 73.6 Q50 71.8 46 73.6 Z" fill="#d4705c"/>`
      );
    case 'grin':
      return (
        `<path d="M42.5 67 Q50 74.5 57.5 67 Q50 70.4 42.5 67 Z" fill="#6e2a1f" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>` +
        `<path d="M44.4 67.8 Q50 70.2 55.6 67.8 L55.2 69.4 Q50 71.2 44.8 69.4 Z" fill="#fff"/>`
      );
    case 'smile':
      return (
        `<path d="M43.5 68 Q50 72.6 56.5 68" stroke="${LIP}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M46.5 73.2 Q50 74.6 53.5 73.2" stroke="${skinDeep}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.55"/>`
      );
    case 'soft':
      return (
        `<path d="M45 68.6 Q50 71.6 55 68.6" stroke="${LIP}" stroke-width="2" fill="none" stroke-linecap="round"/>` +
        `<path d="M47 72.8 Q50 73.9 53 72.8" stroke="${skinDeep}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.5"/>`
      );
    case 'frown':
      return (
        `<path d="M44 70.6 Q50 66.6 56 70.6" stroke="${LIP}" stroke-width="2.2" fill="none" stroke-linecap="round"/>` +
        `<path d="M46.5 73.6 Q50 72.4 53.5 73.6" stroke="${skinDeep}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.5"/>`
      );
    default:
      // flat
      return (
        `<path d="M44.5 69.2 L55.5 69.2" stroke="${LIP}" stroke-width="2.2" stroke-linecap="round"/>` +
        `<path d="M46.5 72.8 Q50 74 53.5 72.8" stroke="${skinDeep}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity="0.5"/>`
      );
  }
}

/** あご髭・ほほ髭（口の下に描く。full は fill-rule=evenodd の「口の窓」で肌を見せる）。 */
function beardArt(kind: string, hair: string, hairLine: string, chin: number, earX: number): string {
  if (kind === 'beard') {
    const c = chin;
    return (
      `<path d="M43.5 ${c - 8.5} Q50 ${c - 3.5} 56.5 ${c - 8.5} Q58 ${c - 1} 50 ${c + 1.2} Q42 ${c - 1} 43.5 ${c - 8.5} Z" fill="${hair}" stroke="${OUTLINE}" stroke-width="1" stroke-linejoin="round"/>` +
      `<path d="M47 ${c - 4.5} Q50 ${c - 2} 53 ${c - 4.5}" stroke="${hairLine}" stroke-width="0.8" fill="none" opacity="0.7"/>`
    );
  }
  if (kind === 'full') {
    const c = chin;
    const ex = earX;
    const rx = 100 - ex;
    // もみあげ〜あご下を巡る髭の環（下端は波打たせて量感）＋ fill-rule=evenodd の「口の窓」。
    return (
      `<path fill-rule="evenodd" d="M${ex + 1.5} 58 Q${ex + 2.5} ${c - 5} 42.5 ${c} Q45.5 ${c + 3.5} 50 ${c + 3.5} Q54.5 ${c + 3.5} 57.5 ${c} Q${rx - 2.5} ${c - 5} ${rx - 1.5} 58 Q${rx - 6.5} 63 58.5 65.5 Q54.5 67 50 67 Q45.5 67 41.5 65.5 Q${ex + 6.5} 63 ${ex + 1.5} 58 Z M50 65.5 Q56.5 65.5 58.5 69 Q59.8 72.8 56.5 76 Q53.5 78.2 50 78.2 Q46.5 78.2 43.5 76 Q40.2 72.8 41.5 69 Q43.5 65.5 50 65.5 Z" fill="${hair}" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>` +
      `<path d="M44.5 ${c - 6} Q45.8 ${c - 3} 45 ${c - 0.5}" stroke="${hairLine}" stroke-width="0.9" fill="none" opacity="0.65"/>` +
      `<path d="M55.5 ${c - 6} Q54.2 ${c - 3} 55 ${c - 0.5}" stroke="${hairLine}" stroke-width="0.9" fill="none" opacity="0.65"/>`
    );
  }
  return '';
}

/** 口ひげ（口角へ向かって下がる武将ひげ。口の後に描く）。 */
function mustacheArt(hair: string): string {
  const one = `<path d="M49.8 66 Q45.5 64.2 42.5 67.4 Q45.5 69 49.8 67.4 Z" fill="${hair}"/>`;
  return one + mirror(one);
}

/** 耳。fill を左右で変える（右＝影側）ため単体を返す。x は耳の付け根。 */
function earArt(ex: number, fill: string, skinDeep: string, big: boolean): string {
  const k = big ? 1.45 : 1;
  return (
    `<path d="M${ex + 0.5} 47.5 C${ex - 4.5 * k} 46.2 ${ex - 5.6 * k} 52 ${ex - 2.8 * k} 56.8 C${ex - 0.8 * k} 60 ${ex + 2} 59 ${ex + 2.5} 55.8 Z" fill="${fill}" stroke="${OUTLINE}" stroke-width="1.6"/>` +
    `<path d="M${ex - 2.6 * k} 50.5 Q${ex - 1 * k} 53.5 ${ex - 1.6 * k} 55.6" stroke="${skinDeep}" stroke-width="1" fill="none" stroke-linecap="round"/>`
  );
}

/** Shoulders + collar garment. behind = painted before the neck / front = over the neck
 *  (cravat knot, stand collar). Kimono (default) keeps the original byte-identical output. */
function garbArt(kind: string, tone: string, skin: string): { behind: string; front: string } {
  const shoulders = `<path d="M13 100 L31 77 Q50 87 69 77 L87 100 Z" fill="${tone}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>`;
  const sheen = `<path d="M31 79.5 L42 100 L45 100 L34 78 Z" fill="#fff" opacity="0.12"/>`;
  // Narrow sloping shoulders (なで肩) — the men's straight wide trapezoid above is worn by
  // 92% of the corpus and is what makes a long-haired face still read as a man at any size.
  const shouldersF = `<path d="M18 100 Q22.5 84.5 34 79.5 Q50 88.5 66 79.5 Q77.5 84.5 82 100 Z" fill="${tone}" stroke="${OUTLINE}" stroke-width="2" stroke-linejoin="round"/>`;
  const sheenF = `<path d="M34.5 82 L43 100 L46 100 L37.5 81 Z" fill="#fff" opacity="0.12"/>`;
  const toneDark = mixHex(tone, '#000000', 0.32);
  switch (kind) {
    case 'western': {
      // 19th-century suit: white shirt in a V opening, dark folded lapels, small cravat knot.
      const lapelL = `<path d="M40.5 78 L50 90.5 L45 99 L50 100 L38 100 Q35.5 88 40.5 78 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>`;
      return {
        behind:
          shoulders +
          sheen +
          `<path d="M41 78.5 L50 90 L59 78.5 L61.5 100 L38.5 100 Z" fill="#f4eddc" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
          lapelL +
          mirror(lapelL),
        front:
          `<path d="M46.8 85.2 Q50 87.6 53.2 85.2 L54.4 89.6 Q50 92.2 45.6 89.6 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.1" stroke-linejoin="round"/>` +
          `<path d="M47.6 90.8 Q50 92 52.4 90.8 L53.4 100 L46.6 100 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.1" stroke-linejoin="round"/>`,
      };
    }
    case 'navy': {
      // Stand-collar uniform: closed dark front panel, gold button column, collar band over the neck.
      const gold = '#d8af3f';
      return {
        behind:
          shoulders +
          sheen +
          `<path d="M41 78.5 L50 87 L59 78.5 L61.5 100 L38.5 100 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
          `<path d="M31.5 78 Q37 82.5 42.5 83.5 L41.5 86.5 Q35.5 85.5 30 80.5 Z" fill="${gold}" opacity="0.85"/>` +
          `<path d="M68.5 78 Q63 82.5 57.5 83.5 L58.5 86.5 Q64.5 85.5 70 80.5 Z" fill="${gold}" opacity="0.85"/>`,
        front:
          `<path d="M43.5 79.5 L56.5 79.5 L56.5 85.5 Q50 88.5 43.5 85.5 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          `<path d="M44.8 84.6 L55.2 84.6" stroke="${gold}" stroke-width="1" opacity="0.9"/>` +
          `<circle cx="50" cy="91" r="1.3" fill="${gold}" stroke="#8a6413" stroke-width="0.5"/>` +
          `<circle cx="50" cy="96.5" r="1.3" fill="${gold}" stroke="#8a6413" stroke-width="0.5"/>`,
      };
    }
    case 'houe': {
      // 法衣＝出家した人の衣（head:'ama' / 'bozu' と対）。白い内襟の上に墨染めの衣を重ねる。
      // 着物の細い襟合わせでは尼形が「白い被り物をした女性」で止まるので、肩から下でも
      // 出家が読めるようにする。
      const robe = mixHex(tone, '#2b2620', 0.62);
      const lapelL = `<path d="M31.5 77.5 L50 96 L50 100 L36 100 Z" fill="${robe}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>`;
      return {
        behind:
          shoulders +
          sheen +
          `<path d="M39.5 78 L50 94 L60.5 78 L62.5 100 L37.5 100 Z" fill="#f2ece0" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          lapelL +
          mirror(lapelL),
        front: '',
      };
    }
    case 'kosode': {
      // 女性の小袖。なで肩＋衣紋を抜いた広く深い襟合わせ（男の着物の細い V より低い位置で
      // 交わる）。白い下襟の上に同色の襟が重なる。
      const bandL = `<path d="M33.5 79 L50 98.5 L50 93.5 L38 78 Z" fill="${tone}" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
      return {
        behind:
          shouldersF +
          sheenF +
          `<path d="M35.5 78 L50 96.5 L64.5 78 L69 100 L31 100 Z" fill="#f4eddc" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
          bandL +
          mirror(bandL),
        front: '',
      };
    }
    case 'uchiki': {
      // 袿（重ねの女房装束）。襲の色目＝襟が何枚も重なって見えることが、平安〜鎌倉の身分ある
      // 女性の一目の記号。小袖との差は「一枚か、何枚も重ねているか」。
      const layer = (w: number, dip: number, fill: string) =>
        `<path d="M${50 - w} 77.5 L50 ${dip} L${50 + w} 77.5 L${50 + w + 4} 100 L${50 - w - 4} 100 Z" fill="${fill}" stroke="${OUTLINE}" stroke-width="1.1" stroke-linejoin="round"/>`;
      return {
        behind:
          shouldersF +
          sheenF +
          layer(17, 99, mixHex(tone, '#000000', 0.22)) +
          layer(12.5, 93.5, mixHex(tone, '#ffffff', 0.5)) +
          layer(8, 88, '#f4eddc'),
        front: '',
      };
    }
    case 'gown': {
      // 16世紀イタリアの女性の衣（davinci のリザら）。四角い襟ぐりから胸元がのぞき、下は
      // 紐で締めた身頃。着物の V 襟で描くと「和装の女性」に見えてしまうため別語彙にする。
      const sleeveL = `<path d="M18 100 Q16.5 86.5 28.5 80 Q33.5 88 32 100 Z" fill="${mixHex(tone, '#000000', 0.18)}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>`;
      return {
        behind:
          shouldersF +
          sheenF +
          sleeveL +
          mirror(sleeveL) +
          `<path d="M36 79.5 Q50 84 64 79.5 L65 89 Q50 92.5 35 89 Z" fill="${skin}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          `<path d="M35 89 Q50 92.5 65 89 L66.5 100 L33.5 100 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          `<path d="M45 91.5 L55 95 M55 91.5 L45 95 M45 95.5 L55 99 M55 95.5 L45 99" stroke="${mixHex(tone, '#ffffff', 0.45)}" stroke-width="0.9" fill="none"/>`,
        front: '',
      };
    }
    default:
      // Kimono — identical to the original inline strings (earlier works must not change).
      return {
        behind:
          shoulders +
          sheen +
          `<path d="M41.5 78.5 L50 90.5 L58.5 78.5" fill="#f4eddc" stroke="${OUTLINE}" stroke-width="1.6" stroke-linejoin="round"/>`,
        front: '',
      };
  }
}

interface HeadColors {
  hair: string;
  hairHi: string;
  hairLine: string;
  tone: string;
  skin: string;
  skinShade: string;
}

/** headArt / garbArt が実際に描き分ける語彙。未知の値は既定（基本髪・着物）で黙って描かれる
 *  ので、作品データの綴り誤りは tests/face-vocab.test.ts がこの表と突き合わせて落とす。 */
export const HEAD_KINDS = [
  'eboshi', 'kanmuri', 'chasen', 'kabuto', 'bozu', 'zukin', 'ama', 'onna', 'suberakashi',
  'chonmage', 'sangiri', 'seibo', 'nanban', 'wakamusha', 'maegami', 'beret',
] as const;
/** 省略時＝着物（既定）。 */
export const GARB_KINDS = ['western', 'navy', 'houe', 'kosode', 'uchiki', 'gown'] as const;
/** 省略時＝太い塗りの眉（既定）。 */
export const BROW_WEIGHTS = ['fine'] as const;

/** 頭髪・かぶりもの。back=顔より後ろの層 / front=顔より前の層 / shadow=前髪の落ち影。 */
function headArt(kind: string, c: HeadColors, shp: { ear: [number, number] }): { back: string; front: string; shadow: string } {
  const ex = shp.ear[0];
  const rx = 100 - ex;
  // 生え際つきの基本の髪（月代を剃った武家風、こめかみに髪）。
  const cap =
    `<path d="M${ex} 45 C${ex - 1.5} 26 36 21 50 21 C64 21 ${rx + 1.5} 26 ${rx} 45 C${rx - 3} 31.5 61 28 50 28 C39 28 ${ex + 3} 31.5 ${ex} 45 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
    `<path d="M${ex + 4} 34.5 Q41 25 55 24.8 Q46 23.2 39.5 26.5 Q35.5 29.5 ${ex + 4} 34.5 Z" fill="${c.hairHi}" opacity="0.8"/>`;
  // 前髪の落ち影（額に、生え際を 3u 下げた帯）。
  const capShadow = `<path d="M${ex + 4} 38.5 Q50 30.5 ${rx - 4} 38.5 Q50 34.5 ${ex + 4} 38.5 Z" fill="${c.skinShade}" opacity="0.55"/>`;
  const toneDark = mixHex(c.tone, '#000000', 0.28);
  switch (kind) {
    case 'eboshi': {
      // 侍烏帽子＝黒漆の高い帽子。額に髪を見せず「肌→縁の帯→帽体」の構造にして
      // 髪の塊と見分けさせる。耳の前に小さなもみあげだけを残す。
      const burnL = `<path d="M${ex + 0.5} 48 Q${ex} 38.5 ${ex + 3.5} 33.5 L${ex + 6} 36.5 Q${ex + 3} 41 ${ex + 3.5} 48 Z" fill="${c.hair}"/>`;
      return {
        back: '',
        front:
          burnL +
          mirror(burnL) +
          `<path d="M37 31.5 Q35.5 24.5 38.8 17.5 Q42 10.3 51 10 Q59.5 10.3 61.3 18 Q63.5 25 62.5 30.5 Q49.5 26.5 37 31.5 Z" fill="#26221d" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<path d="M45 13 Q42 19 42.8 28.5" stroke="#4d453c" stroke-width="1.3" fill="none"/>` +
          `<path d="M53.5 11.5 Q57.5 14 58.8 21 Q59.5 15.5 57 12.8 Q55.3 11.8 53.5 11.5 Z" fill="#6b6154" opacity="0.55"/>` +
          `<path d="M35.5 33.3 Q49.5 26.8 64.5 32.5 L64.3 36 Q49.5 30.3 35.7 36.8 Z" fill="#3d362e" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>`,
        shadow: `<path d="M36.5 39 Q50 33 63.5 38.5 Q50 36 36.5 42 Z" fill="${c.skinShade}" opacity="0.55"/>`,
      };
    }
    case 'kanmuri':
      return {
        back: '',
        front:
          cap +
          `<rect x="48.2" y="9.8" width="4.2" height="9.5" rx="2.1" fill="#211d19" transform="rotate(7 50 14)"/>` +
          `<path d="M41.5 27.5 Q41 17.5 50 17 Q59 17.5 58.5 27.5 Q50 24.5 41.5 27.5 Z" fill="#211d19" stroke="${OUTLINE}" stroke-width="1.3"/>` +
          `<path d="M41.5 27.2 Q50 23.8 58.5 27.2 L58.5 29.8 Q50 26.4 41.5 29.8 Z" fill="#d8af3f" stroke="#8a6413" stroke-width="0.7"/>`,
        shadow: capShadow,
      };
    case 'chasen':
      return {
        back: '',
        front:
          cap +
          `<path d="M45 22.5 Q50 12.5 55 22.5 Q50 18.5 45 22.5 Z" fill="${c.hair}"/>` +
          `<rect x="47.3" y="9.6" width="5.4" height="11.4" rx="2.7" fill="${c.hair}"/>` +
          `<path d="M47.3 14 L52.7 14" stroke="${c.hairLine}" stroke-width="1.2"/>` +
          `<path d="M48.4 11 L48.4 19.5" stroke="${c.hairHi}" stroke-width="1" opacity="0.7"/>`,
        shadow: capShadow,
      };
    case 'kabuto': {
      // 鉢（ドーム）＋眉庇（額の水平の庇）＋吹返し＋しころ（背面）＋大きな前立。
      const flapL = `<path d="M26 36 Q17.5 37.5 16.5 46 Q22.5 44.5 27.5 40.5 Q26.5 38 26 36 Z" fill="${c.tone}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>`;
      const shikoroL = `<path d="M26 38 Q19.5 47.5 23 58 L34 50 Q27.5 45.5 28.5 38.5 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.2"/>`;
      return {
        back: shikoroL + mirror(shikoroL),
        front:
          `<path d="M27 37 Q25.5 15.5 50 14.5 Q74.5 15.5 73 37 Q71 30 50 29 Q29 30 27 37 Z" fill="${c.tone}" stroke="${OUTLINE}" stroke-width="1.8" stroke-linejoin="round"/>` +
          `<path d="M58 15.5 Q71.5 19.5 72.5 34.5 Q73.5 24 66 18.5 Q62 16 58 15.5 Z" fill="${toneDark}" opacity="0.8"/>` +
          `<path d="M33 18.5 Q40 15 47.5 14.7 Q40.5 13.8 36.5 16 Q34.5 17 33 18.5 Z" fill="${mixHex(c.tone, '#ffffff', 0.3)}" opacity="0.85"/>` +
          `<path d="M26.5 41 Q50 32 73.5 41 L73 36.5 Q50 28 27 36.5 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          flapL +
          mirror(flapL) +
          `<path d="M50 9.3 L45 28 Q50 25 55 28 Z" fill="#e3b83f" stroke="#8a6413" stroke-width="0.9" stroke-linejoin="round"/>` +
          `<circle cx="37" cy="23.5" r="0.9" fill="${toneDark}"/><circle cx="50" cy="20.5" r="0.9" fill="${toneDark}"/><circle cx="63" cy="23.5" r="0.9" fill="${toneDark}"/>`,
        shadow: `<path d="M28 44.5 Q50 35.5 72 44.5 Q50 39 28 44.5 Z" fill="${c.skinShade}" opacity="0.6"/>`,
      };
    }
    case 'bozu':
      return {
        back: '',
        front: '',
        // 剃り跡の青み＋頭頂のつや。
        shadow:
          `<path d="M31.5 35 Q50 24 68.5 35 Q59.5 29 50 29 Q40.5 29 31.5 35 Z" fill="${mixHex(c.skin, '#5b7286', 0.3)}" opacity="0.6"/>` +
          `<path d="M40 26.5 Q45 24 51 24.5 Q46 23 42 24.5 Q40.5 25.5 40 26.5 Z" fill="#fff" opacity="0.5"/>`,
      };
    case 'zukin': {
      const drapeL = `<path d="M${ex - 0.5} 34 Q${ex - 7} 46 ${ex - 5} 61 Q${ex - 1.5} 64.5 ${ex + 2.5} 59 L${ex + 3} 37 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
      return {
        back: drapeL + mirror(drapeL),
        front:
          `<path d="M28.5 43 Q27 20 50 19.5 Q73 20 71.5 43 Q66.5 27.5 50 27 Q33.5 27.5 28.5 43 Z" fill="${c.tone}" stroke="${OUTLINE}" stroke-width="1.6" stroke-linejoin="round"/>` +
          `<path d="M35.5 30.5 Q50 23.8 64.5 30.5" stroke="${toneDark}" stroke-width="1.3" fill="none" opacity="0.9"/>` +
          `<path d="M33.5 34 Q41 27 51.5 26.3 Q42.5 25.5 37.5 28.8 Q34.5 31 33.5 34 Z" fill="${mixHex(c.tone, '#ffffff', 0.25)}" opacity="0.8"/>`,
        shadow: capShadow,
      };
    }
    case 'onna': {
      // 老母の髪＝顔を包む髪の量感（背面層）＋額を覆う中分けの前髪＋頭頂の丸髷。
      // 背面層は顔輪郭（round でも）より確実に外へ出す：内側に隠れると「黒い縁線だけ」に
      // 見える（クローズアップ ★O で露呈）。前髪バンドは輪郭線なしで背面層と地続きにし、
      // 額の生え際まで覆って「地肌に帯を巻いた」ようには見せない。
      return {
        back:
          `<path d="M23 63 Q11.5 21 50 15.5 Q88.5 21 77 63 Q64 70 50 70 Q36 70 23 63 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<path d="M27 30 Q35 20.5 50 19.5 Q39 18.5 32.5 22.5 Q28.5 25.5 27 30 Z" fill="${c.hairHi}" opacity="0.8"/>`,
        front:
          `<path d="M27.5 44 Q28.5 21.5 50 21.5 Q71.5 21.5 72.5 44 Q60.5 32 50 32 Q39.5 32 27.5 44 Z" fill="${c.hair}"/>` +
          `<path d="M50 22 L50 32" stroke="${c.hairLine}" stroke-width="1" opacity="0.8"/>` +
          `<path d="M35.5 37 Q41 29 47.5 27.8" stroke="${c.hairLine}" stroke-width="0.9" fill="none" opacity="0.6"/>` +
          `<path d="M64.5 37 Q59 29 52.5 27.8" stroke="${c.hairLine}" stroke-width="0.9" fill="none" opacity="0.6"/>` +
          `<path d="M42 22.5 Q41.5 14 50 13.5 Q58.5 14 58 22.5 Q54 18.5 50 18.5 Q46 18.5 42 22.5 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          `<path d="M45 21 Q50 17.5 55 21" stroke="${c.hairLine}" stroke-width="1.1" fill="none" opacity="0.8"/>`,
        shadow: capShadow,
      };
    }
    case 'ama': {
      // 尼形（髪を下ろした女性）。剃った頭をそのまま描くと `bozu` と同じ絵になる——白い
      // 布が頭から肩まで一続きに顔を包む形にして「髪を下ろした人」を示す。布は `onna` の
      // 髪と同じく顔輪郭より確実に外へ出し（内側に隠れると縁線だけに見える）、側面も頭頂と
      // 同じ白で地続きにする（別色の房を垂らすと耳当てに見える）。色は陣営色でなく固定の
      // 白＝作品をまたいで同じ記号として読ませる（陣営色の `zukin` とはここで見分く）。
      const cloth = '#f4efe4',
        clothShade = '#d3cbb7';
      return {
        back:
          `<path d="M20.5 62 Q13 20 50 14.5 Q87 20 79.5 62 Q78 82 71 90 L29 90 Q22 82 20.5 62 Z" fill="${cloth}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<path d="M${ex - 3} 40 Q${ex - 6} 62 ${ex - 2} 82" stroke="${clothShade}" stroke-width="1.6" fill="none" opacity="0.9"/>` +
          mirror(`<path d="M${ex - 3} 40 Q${ex - 6} 62 ${ex - 2} 82" stroke="${clothShade}" stroke-width="1.6" fill="none" opacity="0.9"/>`),
        front:
          `<path d="M25.5 47 Q24.5 17.5 50 17 Q75.5 17.5 74.5 47 Q63 31.5 50 31 Q37 31.5 25.5 47 Z" fill="${cloth}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<path d="M26.5 44 Q50 29.5 73.5 44 Q50 34 26.5 44 Z" fill="${clothShade}" opacity="0.65"/>` +
          `<path d="M32.5 26 Q41 18.8 51 18 Q41 17 35 20.8 Q33.3 23 32.5 26 Z" fill="#ffffff" opacity="0.7"/>`,
        shadow: `<path d="M28 45 Q50 34 72 45 Q50 38 28 45 Z" fill="${c.skinShade}" opacity="0.5"/>`,
      };
    }
    case 'suberakashi': {
      // Young Heian court woman's flowing hair (垂髪/すべらかし): long, straight,
      // center-parted black hair that frames the face and falls in two curtains past
      // the shoulders. Distinguished from `onna` (an elderly woman) by having NO top
      // bun and long side falls. Back layer = crown + the two long curtains; front
      // layer = the center-parted forehead frame.
      return {
        back:
          `<path d="M18 89 Q11 52 15.5 27 Q24 13.5 50 13 Q76 13.5 84.5 27 Q89 52 82 89 Q73.5 81 70 63 Q64 71 50 70.5 Q36 71 30 63 Q26.5 81 18 89 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<path d="M25 33 Q33 19.5 49 18 Q37 17 30.5 21.5 Q26.5 26 25 33 Z" fill="${c.hairHi}" opacity="0.75"/>` +
          `<path d="M22 42 Q19.5 62 23.5 83" stroke="${c.hairHi}" stroke-width="1.1" fill="none" opacity="0.5"/>` +
          `<path d="M78 42 Q80.5 62 76.5 83" stroke="${c.hairLine}" stroke-width="1.2" fill="none" opacity="0.6"/>`,
        front:
          `<path d="M27.5 44 Q28.5 20.5 50 20.5 Q71.5 20.5 72.5 44 Q60.5 31 50 31 Q39.5 31 27.5 44 Z" fill="${c.hair}"/>` +
          `<path d="M50 21 L50 31" stroke="${c.hairLine}" stroke-width="1" opacity="0.8"/>` +
          `<path d="M35 37 Q40.5 29 47 27.6" stroke="${c.hairLine}" stroke-width="0.9" fill="none" opacity="0.55"/>` +
          `<path d="M65 37 Q59.5 29 53 27.6" stroke="${c.hairLine}" stroke-width="0.9" fill="none" opacity="0.55"/>`,
        shadow: capShadow,
      };
    }
    case 'chonmage': {
      // Edo-period samurai topknot: shaved sakayaki (base cap hairline) with the mage
      // folded FORWARD, lying low over the crown — vs `chasen`, whose Sengoku-style
      // queue stands straight up as a tall vertical bar.
      return {
        back: '',
        front:
          cap +
          `<path d="M42.5 20.8 Q42.5 15 50 14.8 Q57.5 15 57.5 20.8 Q54 18.6 50 18.6 Q46 18.6 42.5 20.8 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>` +
          `<ellipse cx="50" cy="15.7" rx="2.4" ry="1.2" fill="${c.hairHi}" opacity="0.6"/>` +
          `<path d="M45.6 16.2 L45.6 19.1" stroke="${c.hairLine}" stroke-width="0.9" opacity="0.7"/>` +
          `<path d="M54.4 16.2 L54.4 19.1" stroke="${c.hairLine}" stroke-width="0.9" opacity="0.7"/>`,
        shadow: capShadow,
      };
    }
    case 'sangiri': {
      // Meiji cropped hair (散切り/断髪): short natural hair covering the whole crown, no
      // shaved sakayaki, no topknot. The fringe falls onto the forehead in soft tufts —
      // clearly hair (vs `bozu`'s bare scalp) and clearly not a samurai hairline.
      const burnL = `<path d="M${ex + 0.5} 49 Q${ex - 0.5} 40 ${ex + 2.5} 34.5 L${ex + 6.5} 37.5 Q${ex + 3.5} 42 ${ex + 3.5} 49 Z" fill="${c.hair}"/>`;
      return {
        back: '',
        front:
          burnL +
          mirror(burnL) +
          `<path d="M${ex - 0.5} 46 C${ex - 2.5} 24.5 35 19 50 19 C65 19 ${rx + 2.5} 24.5 ${rx + 0.5} 46 Q${rx - 1.5} 39.5 ${rx - 4.5} 42 Q${rx - 8.5} 35.5 59.5 40 Q54.5 34.5 50 39 Q45.5 34.5 40.5 40 Q${ex + 8.5} 35.5 ${ex + 4.5} 42 Q${ex + 1.5} 39.5 ${ex - 0.5} 46 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
          `<path d="M${ex + 5} 30.5 Q40 21.5 53 21 Q43.5 19.8 37.5 23.5 Q35.5 26.5 ${ex + 5} 30.5 Z" fill="${c.hairHi}" opacity="0.8"/>`,
        shadow: `<path d="M38 43.5 Q50 39.5 62 43.5 Q50 41.5 38 43.5 Z" fill="${c.skinShade}" opacity="0.5"/>`,
      };
    }
    case 'seibo': {
      // 19th-century naval officer's peaked cap: low dark-navy crown, black band, glossy
      // front visor, gold badge. Side hair shows under the band (vs `nanban`, a tall
      // missionary hat with a full round brim).
      const sideL = `<path d="M${ex + 0.5} 48 Q${ex} 39 ${ex + 3.5} 34 L${ex + 7} 37 Q${ex + 3.5} 41.5 ${ex + 3.5} 48 Z" fill="${c.hair}"/>`;
      return {
        back: '',
        front:
          sideL +
          mirror(sideL) +
          `<path d="M33.5 31.5 Q31.8 17.5 50 17 Q68.2 17.5 66.5 31.5 Q50 27 33.5 31.5 Z" fill="#2c3a55" stroke="${OUTLINE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<path d="M38 21 Q43 18.2 49.5 18 Q42.5 17.2 39.6 19.1 Q38.6 20 38 21 Z" fill="#5a6c8c" opacity="0.85"/>` +
          `<path d="M56 18 Q63.5 20.5 65.5 29.5 Q66 22.5 61.5 19.5 Q58.8 18.2 56 18 Z" fill="#151b26" opacity="0.7"/>` +
          `<path d="M33 32 Q50 27.2 67 32 L67 36.8 Q50 32.4 33 36.8 Z" fill="#1d232e" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>` +
          `<circle cx="50" cy="23" r="2.5" fill="#d8af3f" stroke="#8a6413" stroke-width="0.8"/>` +
          `<path d="M38 36.6 Q50 33.4 62 36.6 Q56.5 42.4 50 42.4 Q43.5 42.4 38 36.6 Z" fill="#17191d" stroke="${OUTLINE}" stroke-width="1.3" stroke-linejoin="round"/>` +
          `<path d="M41.5 37.4 Q46 40.4 52.5 39.8 Q46.5 41.8 43 39.9 Z" fill="#3d4757" opacity="0.85"/>`,
        shadow: `<path d="M38.5 44.5 Q50 40.5 61.5 44.5 Q50 42.5 38.5 44.5 Z" fill="${c.skinShade}" opacity="0.55"/>`,
      };
    }
    case 'nanban':
      return {
        back: '',
        front:
          `<path d="M30.5 40 Q31 30.5 38 28 L38 33 Q33.5 34.5 30.5 40 Z" fill="${c.hair}"/>` +
          mirror(`<path d="M30.5 40 Q31 30.5 38 28 L38 33 Q33.5 34.5 30.5 40 Z" fill="${c.hair}"/>`) +
          `<path d="M39.5 26 Q39.5 10.5 50 10.5 Q60.5 10.5 60.5 26 Z" fill="#2e2823" stroke="${OUTLINE}" stroke-width="1.4"/>` +
          `<path d="M42 13.5 Q45.5 11 50 11 Q46 10.5 43.5 12 Q42.5 12.7 42 13.5 Z" fill="#5a534a" opacity="0.9"/>` +
          `<ellipse cx="50" cy="26" rx="24" ry="4.8" fill="#2e2823" stroke="${OUTLINE}" stroke-width="1.4"/>` +
          `<path d="M42 21.5 Q50 24 58 21.5 L58 25.5 Q50 28 42 25.5 Z" fill="#8a6f3a"/>` +
          `<rect x="47.8" y="20.8" width="4.4" height="4.4" fill="#d8af3f" stroke="#8a6413" stroke-width="0.7"/>`,
        shadow: capShadow,
      };
    case 'wakamusha':
      // 前髪立ちの若衆＝額の前髪の房＋後ろへ流す小さな髷。
      return {
        back: '',
        front:
          cap +
          `<path d="M42 29.5 Q44.5 19.5 50 19 Q55.5 19.5 58 29.5 Q54 23 50 23 Q46 23 42 29.5 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>` +
          `<path d="M47.5 19.5 Q48 13.5 52.5 12.5 Q56 12.5 55.5 15.5 Q54.5 18.5 51.5 19.8 Q49.5 20.3 47.5 19.5 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1"/>` +
          `<path d="M45 21.5 Q47.5 20.6 49 21.9" stroke="${c.hairHi}" stroke-width="1" fill="none" opacity="0.8"/>`,
        shadow: capShadow,
      };
    case 'maegami': {
      // Child (before the sakayaki shave): okappa bob — side locks plus ONE solid
      // fringe covering the whole forehead down to just above the brows, ending in
      // three rounded scallops. Must stay a single mass: separate tufts high on the
      // forehead read as a receding hairline, not a child's bangs.
      const lockL = `<path d="M${ex - 1.5} 41 Q${ex - 2.5} 52 ${ex + 0.5} 58 Q${ex + 5} 55 ${ex + 4.5} 44 L${ex + 2} 38 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.2" stroke-linejoin="round"/>`;
      return {
        back: '',
        front:
          lockL +
          mirror(lockL) +
          `<path d="M${ex - 1.5} 44 Q${ex - 3} 21.5 50 20.5 Q${rx + 3} 21.5 ${rx + 1.5} 44 Q${rx - 2} 41.5 68 38.8 Q62 45 56 38.8 Q50 45 44 38.8 Q38 45 32 38.8 Q${ex + 3.5} 41.5 ${ex - 1.5} 44 Z" fill="${c.hair}" stroke="${OUTLINE}" stroke-width="1.4" stroke-linejoin="round"/>` +
          `<path d="M44 38 Q43.5 33.5 44.6 29.8" stroke="${c.hairLine}" stroke-width="0.8" fill="none" opacity="0.5"/>` +
          `<path d="M56 38 Q56.5 33.5 55.4 29.8" stroke="${c.hairLine}" stroke-width="0.8" fill="none" opacity="0.5"/>` +
          `<path d="M33 30.5 Q40 24.5 51 24 Q42 22.8 37 25.5 Q34.5 27.5 33 30.5 Z" fill="${c.hairHi}" opacity="0.8"/>`,
        shadow: `<path d="M32 38.8 Q38 45 44 38.8 Q50 45 56 38.8 Q62 45 68 38.8 L68 40.6 Q62 47 56 40.6 Q50 47 44 40.6 Q38 47 32 40.6 Z" fill="${c.skinShade}" opacity="0.5"/>`,
      };
    }
    case 'beret': {
      // Renaissance flat cap / berretta worn by artists and scholars in Italy c.1500 (davinci's
      // cast). A soft wide dome overhanging a narrow band, with hair at the sides and peeking under
      // the brow. Reads distinct from the tall stiff Japanese eboshi/kanmuri at 96px and at the
      // contact-sheet size. Cap body takes the camp tone (like kabuto/zukin). Crown is fixed-width
      // (29–71) so it covers round/square heads as well as long/oval.
      const sideL = `<path d="M${ex + 1} 51 Q${ex - 2} 40 ${ex + 1.5} 32 L${ex + 6} 35 Q${ex + 2} 42 ${ex + 4.5} 51 Z" fill="${c.hair}"/>`;
      return {
        back: sideL + mirror(sideL),
        front:
          `<path d="M33 33 Q50 27.5 67 33 L66 37 Q50 31.5 34 37 Z" fill="${c.hair}"/>` +
          `<path d="M29 31 Q28 14 51 14 Q73 15 71 32 Q60 24 50 24 Q39 24 29 31 Z" fill="${c.tone}" stroke="${OUTLINE}" stroke-width="1.6" stroke-linejoin="round"/>` +
          `<path d="M29.5 31 Q50 24.5 70.5 32 L70 35 Q50 28 30 35 Z" fill="${toneDark}" stroke="${OUTLINE}" stroke-width="1.1" stroke-linejoin="round"/>` +
          `<path d="M37 19 Q45 15 54 16 Q45 14 39 16.5 Q37.5 18 37 19 Z" fill="${mixHex(c.tone, '#ffffff', 0.28)}" opacity="0.8"/>`,
        shadow: capShadow,
      };
    }
    default:
      return { back: '', front: cap, shadow: capShadow };
  }
}

/** 人物 id ごとの似顔絵 SVG。faces は work.faces（旧 FACE_SPEC）。 */
export function faceArt(id: string, faces: Record<string, FaceSpec>): string {
  const S = faces[id] || faces._default;
  const t = FACE_TONES[S.tone] || FACE_TONES.ai;
  const skin = S.skin || '#f0c69f';
  const hair = FACE_HAIR[S.hair] || FACE_HAIR.dark;
  const iris = S.iris || IRIS_DEFAULT;
  const shp = SHAPES[S.shape || 'oval'] || SHAPES.oval;

  // 派生色（すべて肌・髪から決定的に導出）。
  const skinShade = mixHex(skin, '#96522f', 0.24);
  const skinDeep = mixHex(skin, '#7a3c22', 0.42);
  const skinLine = mixHex(skin, '#42281c', 0.55);
  const blush = mixHex(skin, '#e2593c', 0.5);
  const hairHi = mixHex(hair, '#ffffff', 0.28);
  const hairLine = mixHex(hair, '#000000', 0.4);
  const browColor = S.hair === 'dark' ? INK : mixHex(hair, '#000000', 0.3);

  const head = headArt(S.head, { hair, hairHi, hairLine, tone: t, skin, skinShade }, shp);
  const garb = garbArt(S.garb || 'kimono', t, skin);
  const P: string[] = [];

  // 1) 肩・襟（garb: 着物/陣羽織〔既定〕・洋装・軍服 — 色の個性）
  P.push(garb.behind);
  // 2) 首（あご下の落ち影つき）
  P.push(`<path d="M44.5 66 L44.5 83 Q50 87.5 55.5 83 L55.5 66 Z" fill="${skin}"/>`);
  P.push(`<path d="M44.5 66 L44.5 75 Q50 79 55.5 75 L55.5 66 Z" fill="${skinShade}"/>`);
  // 2b) 首より前の襟要素（クラバット・詰襟）
  P.push(garb.front);
  // 3) かぶりもの背面層（垂髪・しころ・頭巾の垂れ）
  P.push(head.back);
  // 4) 顔輪郭
  P.push(`<path d="${shp.path}" fill="${skin}" stroke="${OUTLINE}" stroke-width="2.2" stroke-linejoin="round"/>`);
  // 5) 顔のセル影（光源＝左上、右側面の三日月）
  P.push(`<path d="${shp.shade}" fill="${skinShade}" opacity="0.85"/>`);
  // 6) 耳（右耳は影側の色）
  {
    const big = S.ears === 'big';
    P.push(earArt(shp.ear[0], skin, skinDeep, big));
    P.push(mirror(earArt(shp.ear[0], skinShade, skinDeep, big)));
  }
  // 7) 頬・しわ
  if (S.cheek === 'monkey' || S.cheek === 'blush') {
    const op = S.cheek === 'monkey' ? 0.55 : 0.45;
    P.push(
      `<ellipse cx="36.5" cy="60" rx="4.8" ry="2.7" fill="${blush}" opacity="${op}"/><ellipse cx="63.5" cy="60" rx="4.8" ry="2.7" fill="${blush}" opacity="${op}"/>`,
    );
  }
  if (S.cheek === 'monkey') {
    const line = `<path d="M34.5 53.5 Q31.5 59.5 35 65.5" stroke="${skinLine}" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    P.push(line + mirror(line));
  } else if (S.cheek === 'sunken') {
    const hollow = `<path d="M35 55.5 Q33.5 62 36.5 66.5 Q37.5 61 35 55.5 Z" fill="${skinShade}" opacity="0.8"/>`;
    P.push(hollow + mirror(hollow));
  }
  if (S.age === 'old') {
    P.push(
      `<path d="M42 40.5 Q50 39 58 40.5" stroke="${skinLine}" stroke-width="0.9" fill="none" opacity="0.55" stroke-linecap="round"/>` +
        `<path d="M43.5 37.5 Q50 36.2 56.5 37.5" stroke="${skinLine}" stroke-width="0.8" fill="none" opacity="0.4" stroke-linecap="round"/>`,
    );
    const naso = `<path d="M44.5 59 Q42.5 63.5 44.5 67.5" stroke="${skinLine}" stroke-width="0.9" fill="none" opacity="0.5" stroke-linecap="round"/>`;
    P.push(naso + mirror(naso));
  }
  // 8) あご髭・ほほ髭
  P.push(beardArt(S.beard, hair, hairLine, shp.chin, shp.ear[0]));
  // 9) 目 → 10) 眉 → 11) 鼻 → 12) 口
  // Continuous morph channels (face-engine slice 2) ride as group transforms so the
  // part art stays untouched; omitted morph = classic geometry. Children (age:'child')
  // keep the legacy 1.11 eye boost, composed with any morph scale.
  const m = S.morph ?? {};
  const eyeK = (S.age === 'child' ? 1.11 : 1) * (m.eyeScale ?? 1);
  const eyes = eyeArt(S.eye, iris, skinShade);
  P.push(
    eyeK !== 1 || (m.eyeY ?? 0) !== 0
      ? `<g transform="${about(50, 52.5, eyeK, eyeK, m.eyeY ?? 0)}">${eyes}</g>`
      : eyes,
  );
  const brows = browArt(S.brow, browColor, S.browWeight);
  P.push(m.browY ? `<g transform="translate(0 ${fmt(m.browY)})">${brows}</g>` : brows);
  P.push(noseArt(S.nose, skinShade, skinDeep));
  // Mouth and mustache share one transform so they never detach from each other.
  const mouthK = m.mouthScale ?? 1;
  let mouthZone = mouthArt(S.mouth, skinDeep);
  // 13) 口ひげ
  if (S.beard === 'mustache' || S.beard === 'full') mouthZone += mustacheArt(hair);
  P.push(
    mouthK !== 1 || (m.mouthY ?? 0) !== 0
      ? `<g transform="${about(50, 0, mouthK, 1, m.mouthY ?? 0)}">${mouthZone}</g>`
      : mouthZone,
  );
  // 14) 前髪の落ち影 → 15) 髪・かぶりもの前面層
  P.push(head.shadow);
  P.push(head.front);
  // Whole-face width morph (slice 4): scale the assembled face horizontally about x=50 so
  // outline/features/hair/shoulders stay proportional. Omitted = classic width. x=50 is fixed,
  // so map transcription (faceSvg strips the <svg> and re-wraps the inner group) stays centered.
  let body = P.join('');
  const faceW = m.faceW ?? 1;
  if (faceW !== 1) body = `<g transform="${about(50, 0, faceW, 1, 0)}">${body}</g>`;
  return `<svg viewBox="0 0 100 100" class="face" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${body}</svg>`;
}
