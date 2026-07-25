// 共有カード（OGP）の検査。焼いた PNG は生成物なので、ズレは2方向で起きる:
// ①作品が増えたのに焼き直していない ②焼き直したが index.html の宣言（寸法・ファイル名）と合わない。
// ①は下の digest snapshot（作品名・年代・レイアウトが変われば必ず動く）、②は PNG 実寸との突き合わせ。
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ogCardSvg, ogFaceRow, OG_W, OG_H } from '../scripts/lib/og-card';

const read = (rel: string) => readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)));

describe('共有カード（OGP）', () => {
  it('作品の顔ぶれ・レイアウトが変わったら焼き直す（snapshot が動いたら scripts/render-og.ts）', () => {
    const svg = ogCardSvg();
    expect({
      works: ogFaceRow().map((r) => `${r.lines.join('／')} ${r.card.years}`),
      sha256: createHash('sha256').update(svg).digest('hex').slice(0, 16),
    }).toMatchSnapshot();
  });

  // 「重なっていない」では足りない——2文字ぶん近づくと隣の名前と地つづきに読め、顔と名前の
  // 対応が切れる（「レオナルド・ダ・ヴィンチ」を1行に押し込むと隣との間が 10 まで詰まった）。
  it('名前が隣の名前と地つづきに読めない（1字ぶんの空きがある）', () => {
    const row = ogFaceRow();
    const tight = row
      .slice(1)
      .map((r, i) => ({ pair: `${row[i].lines.join('')}|${r.lines.join('')}`, gap: r.cx - row[i].cx - (r.nameW + row[i].nameW) / 2 }))
      .filter((x) => x.gap < 24);
    expect(tight).toEqual([]);
  });

  it('public/og.png が 1200×630 の PNG（index.html の og:image:width/height と一致）', () => {
    const png = read('public/og.png');
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
    // IHDR: 8 バイトのシグネチャ + 長さ4 + "IHDR"4 のあとに width/height が big-endian で並ぶ。
    expect(png.readUInt32BE(16)).toBe(OG_W);
    expect(png.readUInt32BE(20)).toBe(OG_H);

    const html = read('index.html').toString('utf8');
    expect(html).toContain('content="%SITE_URL%og.png"');
    expect(html).toMatch(/og:image:width" content="1200"/);
    expect(html).toMatch(/og:image:height" content="630"/);
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });
});
