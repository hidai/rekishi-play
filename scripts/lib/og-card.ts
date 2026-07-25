// 共有カード（OGP）の絵。X などに URL を貼ったときに出る1枚で、作品レジストリから組む
// ——作品が増えれば絵も変わる。変化は tests/og-card.test.ts のダイジェスト snapshot が
// 検知し、`npx vite-node scripts/render-og.ts` での焼き直しを促す（PNG は手で焼いて commit）。
//
// アプリ本体ではなく scripts/ に置いてあるのは、この絵がビルド成果物に載らないため
// （出荷されるのは焼いた public/og.png だけ）。
import { faceArt } from '../../src/engine/art/face';
import { textW, esc } from '../../src/engine/util';
import { WORK_ENTRIES } from '../../src/works/registry';

export const OG_W = 1200;
export const OG_H = 630;

/** titleMain は ruby つき HTML。ふりがなを落として地の名前だけにする。 */
function plainName(html: string): string {
  return html.replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');
}

const NAME_FS = 28;
const NAME_FS_MIN = 20;

function fitSize(s: string, max: number, cell: number): number {
  let fs = max;
  while (fs > NAME_FS_MIN && textW(s, fs) > cell) fs -= 1;
  return fs;
}

/**
 * 名前をセル幅に組む（名前は2字〜12字とばらつく）。一行で入らなければ「・」で折る——
 * 「レオナルド・ダ・ヴィンチ」を一行に収めると 14px まで落ちて隣の名前と別の要素に見え、
 * 下限で止めて はみ出させると 隣の名前と地つづきに読めた（どちらも顔と名前の対応が切れる）。
 * 「・」の無い長い名前は縮めるしかない＝下限 20 で止め、衝突は tests/og-card.test.ts が検査する。
 */
function nameLines(s: string, cell: number): { lines: string[]; fs: number } {
  if (textW(s, NAME_FS) <= cell) return { lines: [s], fs: NAME_FS };
  const parts = s.split('・');
  if (parts.length > 1) {
    // Split where the two lines come out most even ("レオナルド" / "ダ・ヴィンチ").
    const cut = (at: number) => [parts.slice(0, at).join('・'), parts.slice(at).join('・')];
    const at = [...parts.keys()]
      .slice(1)
      .reduce((best, i) => (Math.max(...cut(i).map((l) => l.length)) < Math.max(...cut(best).map((l) => l.length)) ? i : best));
    const lines = cut(at);
    const fs = Math.min(...lines.map((l) => fitSize(l, NAME_FS - 4, cell)));
    return { lines, fs };
  }
  return { lines: [s], fs: fitSize(s, NAME_FS, cell) };
}

function face(id: string, spec: Parameters<typeof faceArt>[1], cx: number, cy: number, d: number, i: number): string {
  const r = d / 2;
  const k = d / 84;
  const inner = faceArt(id, spec).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return (
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#FBF8F0" stroke="#C9BFA8" stroke-width="2"/>` +
    `<clipPath id="ogf${i}"><circle cx="${cx}" cy="${cy}" r="${r - 1}"/></clipPath>` +
    `<g clip-path="url(#ogf${i})"><g transform="translate(${cx},${cy}) scale(${k}) translate(-50,-51)">${inner}</g></g>`
  );
}

const FACE_D = 150;
const FACE_GAP = 36;
const FACE_CY = 306;

/** 顔の行のレイアウト（名前の実寸を含む）。SVG 組み立てと衝突検査の共通の出どころ。 */
export function ogFaceRow() {
  const cards = WORK_ENTRIES.map((e) => e.card);
  const rowW = cards.length * FACE_D + (cards.length - 1) * FACE_GAP;
  const x0 = (OG_W - rowW) / 2 + FACE_D / 2;
  return cards.map((c, i) => {
    const { lines, fs } = nameLines(plainName(c.titleMain), FACE_D + 20);
    return {
      card: c,
      lines,
      fs,
      nameW: Math.max(...lines.map((l) => textW(l, fs))),
      cx: x0 + i * (FACE_D + FACE_GAP),
    };
  });
}

/**
 * 1200×630 の共有カードを SVG で組む。文字は和文フォントに依存するので、焼くのは
 * Noto CJK のある環境で（render-og.ts が rsvg-convert へ渡す）。
 */
export function ogCardSvg(): string {
  const row = ogFaceRow();
  const cy = FACE_CY;

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">`;
  s += `<rect width="${OG_W}" height="${OG_H}" fill="#F5F1E6"/>`;
  s += `<rect width="${OG_W}" height="12" fill="#2A4A6B"/>`;
  s += `<text x="${OG_W / 2}" y="132" text-anchor="middle" font-family="Noto Serif CJK JP,serif" font-size="78" font-weight="700" fill="#23201C">歴史の 人に、なりきる。</text>`;
  s += `<text x="${OG_W / 2}" y="188" text-anchor="middle" font-family="Noto Sans CJK JP,sans-serif" font-size="30" fill="#4A453C">ひとりの 一生を 7章で 生きる、小5〜中1むけの ブラウザ教材</text>`;

  // 名前は下端をそろえる（1行の人は2行目の位置に置く）＝生没年の行が全員そろう。
  row.forEach(({ card, lines, fs, cx }, i) => {
    s += face(card.protagonistId, card.faces, cx, cy, FACE_D, i);
    lines.forEach((l, j) => {
      const y = 443 + (j - (lines.length - 1)) * (fs + 4);
      s += `<text x="${cx}" y="${y}" text-anchor="middle" font-family="Noto Sans CJK JP,sans-serif" font-size="${fs}" font-weight="700" fill="#23201C">${esc(l)}</text>`;
    });
    s += `<text x="${cx}" y="470" text-anchor="middle" font-family="Noto Sans CJK JP,sans-serif" font-size="19" fill="#7A7364">${esc(card.years)}</text>`;
  });

  s += `<line x1="60" y1="516" x2="${OG_W - 60}" y2="516" stroke="#E3DAC3" stroke-width="2"/>`;
  s += `<text x="60" y="570" font-family="Noto Sans CJK JP,sans-serif" font-size="28" fill="#2A4A6B">えらぶのは きみ。そのあとで「史実では…」が ひらく。</text>`;
  s += `<text x="${OG_W - 60}" y="570" text-anchor="end" font-family="Noto Sans CJK JP,sans-serif" font-size="24" fill="#7A7364">hidai.github.io/rekishi-play</text>`;
  s += `</svg>`;
  return s;
}
