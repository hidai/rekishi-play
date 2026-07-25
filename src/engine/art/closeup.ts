// ★O 対面の場（クローズアップ）の SVG ジェネレータ。純粋な文字列生成関数。
//
// 「どこ」が主語のシーンは読み解き地図（buildSceneMap）が主役だが、「だれ・想い」が
// 主語のシーン（母の見送り・信長の値踏み・降伏・茶室・死の床）では、地図は情報量が
// ほぼゼロのまま情感だけを殺す。そこでシーンのメインビジュアルを、トーン別の背景
// ＋人物のバストアップ（1〜2人）＋名札 に差し替える。
//   - reveal（一度きりの全画面）と違い、シーンの間ずっと表示され、再訪でも出る。
//   - 顔（名札ごと）は .mapface[data-pid] でタップ可能＝人物カードが開く（地図と同じ文法）。
//   - 色は CSS 変数に依存しない固定パレット（似顔絵と同じ"絵"の扱い。テーマ非依存で、
//     render-scene.ts の単体書き出しでもそのまま見える）。
//   - グラデーションの id は `cu-<sceneId>-` で接頭し、シーン間で衝突しない
//     （シーン切替は {#key} で DOM ごと再生成される前提。faceArt 自体は id を含まない）。
import type { SceneCloseup, Work } from '../types';
import { faceArt } from './face';
import { esc } from '../util';

const W = 800;
const H = 500;

interface Palette {
  skyTop: string;
  skyBottom: string;
  ground: string;
  /** 空と人物の間に置くトーン別の情景（日輪・月・灯明・雪・遠山・丸窓）。 */
  deco: (uid: string) => string;
  /** deco が <defs> に足すグラデーション等。 */
  defs?: (uid: string) => string;
}

/** 遠山のシルエット（warm / solemn の屋外シーン用）。 */
function hills(fill: string, opacity: number): string {
  // 横は画面外まで延長（レイヤーをずらして重ねても端が切れない）。
  return (
    `<path d="M-80 392 L96 344 L208 384 L332 336 L470 388 L586 348 L700 384 L880 352 L880 500 L-80 500 Z"` +
    ` fill="${fill}" opacity="${opacity}"/>`
  );
}

/** 雪の粒（grief 用）。座標は決定的（テスト可能・再現可能）。 */
function snow(ox: number, oy: number): string {
  const pts: Array<[number, number, number, number]> = [
    [46, 40, 3.2, 0.75], [138, 208, 2.2, 0.5], [232, 96, 2.8, 0.65], [318, 300, 2.0, 0.45],
    [402, 64, 3.4, 0.8], [474, 232, 2.4, 0.55], [548, 132, 3.0, 0.7], [636, 320, 2.2, 0.5],
    [700, 76, 2.6, 0.6], [762, 220, 3.2, 0.75], [92, 372, 2.4, 0.5], [520, 404, 2.6, 0.55],
  ];
  return pts
    .map(([x, y, r, o]) => `<circle cx="${x + ox}" cy="${y + oy}" r="${r}" fill="#f2f0e8" opacity="${o}"/>`)
    .join('');
}

const PALETTES: Record<string, Palette> = {
  // 旅立ちの朝：藍の残る空 → 朝焼け。低い朝日と遠山。
  warm: {
    skyTop: '#31395f',
    skyBottom: '#d99a58',
    ground: '#4e3a28',
    deco: () =>
      `<circle cx="400" cy="336" r="62" fill="#ffe9a8" opacity="0.95"/>` +
      `<circle cx="400" cy="336" r="96" fill="#ffe9a8" opacity="0.22"/>` +
      `<g transform="translate(-52,-30)">${hills('#514463', 0.55)}</g>` +
      hills('#3a3147', 0.9),
  },
  // 威圧：冷えた闇に深紅の日輪。まぶしくて、こわい。
  tense: {
    skyTop: '#191a24',
    skyBottom: '#39262b',
    ground: '#201318',
    deco: () =>
      `<circle cx="400" cy="212" r="164" fill="#a1372c" opacity="0.9"/>` +
      `<circle cx="400" cy="212" r="196" fill="#a1372c" opacity="0.22"/>`,
  },
  // 降伏・静粛：暮れの陣。淡い月。
  solemn: {
    skyTop: '#2c3a3c',
    skyBottom: '#71806e',
    ground: '#2c3730',
    deco: () =>
      `<circle cx="648" cy="128" r="44" fill="#e9e5d3" opacity="0.85"/>` +
      hills('#3b473f', 0.85),
  },
  // 茶室：土壁の暖色。丸窓の淡い光。
  serene: {
    skyTop: '#3b3326',
    skyBottom: '#5d4e38',
    ground: '#6a5b3a',
    deco: () =>
      `<circle cx="400" cy="188" r="142" fill="#dcc694" opacity="0.42"/>` +
      `<circle cx="400" cy="188" r="142" fill="none" stroke="#2e2719" stroke-width="9" opacity="0.4"/>`,
  },
  // 死の床：雪の夜。ふたりの間に灯明のあかり。
  grief: {
    skyTop: '#12182b',
    skyBottom: '#28324e',
    ground: '#0e1322',
    defs: (uid) =>
      `<radialGradient id="${uid}-glow" cx="0.5" cy="0.5" r="0.5">` +
      `<stop offset="0" stop-color="#e0a751" stop-opacity="0.55"/>` +
      `<stop offset="0.55" stop-color="#e0a751" stop-opacity="0.22"/>` +
      `<stop offset="1" stop-color="#e0a751" stop-opacity="0"/>` +
      `</radialGradient>`,
    deco: (uid) =>
      `<ellipse class="cu-glow" cx="400" cy="330" rx="230" ry="190" fill="url(#${uid}-glow)"/>` +
      `<g class="cu-snow">${snow(0, 0)}${snow(0, -500)}</g>`,
  },
};

function nameOf(work: Work, pid: string): string {
  return work.cards[pid]?.name || work.peopleExtra[pid] || '';
}

/** 顔スペックキー（'p-hideyoshi@grief'）→ 人物 id（'p-hideyoshi'）。 */
export function closeupPid(faceKey: string): string {
  return faceKey.split('@')[0];
}

export function buildCloseup(work: Work, sceneId: string, cu: SceneCloseup): string {
  const uid = `cu-${sceneId}`;
  const pal = PALETTES[cu.tone] || PALETTES.solemn;
  const cast = cu.cast.slice(0, 2);
  const n = cast.length;

  const defs =
    `<defs><linearGradient id="${uid}-sky" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="${pal.skyTop}"/><stop offset="1" stop-color="${pal.skyBottom}"/>` +
    `</linearGradient>${pal.defs ? pal.defs(uid) : ''}</defs>`;

  // 人物：バストアップ（faceArt 100×100 の中身を拡大転記。下端＝画面下端で肩の切れ目を隠す）。
  const scale = n === 1 ? 4.1 : 3.4;
  const centers = n === 1 ? [W / 2] : [W * 0.27, W * 0.73];
  const labels: string[] = [];
  const busts = cast
    .map((c, i) => {
      const pid = closeupPid(c.face);
      const name = c.name || nameOf(work, pid);
      const you = pid === work.protagonistId;
      const cx = centers[i];
      const size = 100 * scale;
      const inner = faceArt(c.face, work.faces)
        .replace(/^<svg[^>]*>/, '')
        .replace(/<\/svg>\s*$/, '');
      let g = `<g transform="translate(${cx - size / 2},${H - size}) scale(${scale})">${inner}</g>`;
      // 名札：胸元の暗い帯＋名前（きみ＝金）。地図の smk-name と同じ「名前を刻む」役。
      if (name) {
        labels.push(name);
        const fs = 23;
        const pw = name.length * fs + 34;
        const py = H - 62;
        g +=
          `<rect x="${cx - pw / 2}" y="${py}" width="${pw}" height="38" rx="9" fill="#10131c" opacity="0.62"/>` +
          `<text class="cu-name${you ? ' you' : ''}" x="${cx}" y="${py + 27}" text-anchor="middle"` +
          ` font-size="${fs}" font-family="serif" font-weight="700" fill="${you ? '#e7c26a' : '#f3ead9'}">${esc(name)}</text>`;
      }
      // カードのある人物はタップでカードが開く（SceneMap のクリック委譲と同じ契約）。
      if (work.cards[pid]) {
        return `<g class="mapface" data-pid="${pid}" role="button" tabindex="0" aria-label="${esc(
          nameOf(work, pid) || name || '人物',
        )}の カードを ひらく">${g}</g>`;
      }
      return g;
    })
    .join('');

  return (
    `<svg class="scene-map scene-closeup" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" aria-label="対面の場：${esc(labels.join('、') || '人物')}">` +
    defs +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#${uid}-sky)"/>` +
    pal.deco(uid) +
    `<rect x="0" y="${H - 64}" width="${W}" height="64" fill="${pal.ground}"/>` +
    `<rect x="0" y="${H - 64}" width="${W}" height="3" fill="#ffffff" opacity="0.08"/>` +
    busts +
    `</svg>`
  );
}
