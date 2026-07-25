// 守るのは「単一ファイルであること」ではなく base path 非依存と外部依存ゼロの2点なので、
// 作品ごとにチャンクを分けても相対パス参照であれば通る。build 前（dist なし）はスキップ。
import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '../dist');
const distFile = resolve(distDir, 'index.html');
const hasDist = existsSync(distFile);

describe.skipIf(!hasDist)('配信の契約（base path 非依存・外部依存ゼロ）', () => {
  const html = hasDist ? readFileSync(distFile, 'utf8') : '';

  it('index.html が出ている', () => {
    expect(readdirSync(distDir)).toContain('index.html');
  });

  it('外部 URL の script/link 参照がない', () => {
    const ext = html.match(/<(script|link)[^>]*(src|href)\s*=\s*"(https?:|\/\/)[^"]*"/gi);
    expect(ext).toBeNull();
  });

  it('ルート絶対パスのアセット参照がない（サブパス配信で 404 になる形）', () => {
    const abs = html.match(/<(script|link)[^>]*(src|href)\s*=\s*"\/(?!\/)[^"]*"/gi);
    expect(abs).toBeNull();
  });

  it('先頭付近に <meta charset="utf-8"> を宣言している', () => {
    const head = html.slice(0, 400).toLowerCase();
    expect(head).toContain('<meta charset="utf-8">');
  });
});

// 「外部リソース読込ゼロ」は**実行時**の契約——アプリが動くために外を取りに行かない、の意味。
// 共有カード（OGP）は逆向きで、X などのクローラが**こちらへ取りに来る**ための宣言なので、
// og:image に絶対 URL が入るのは契約違反ではない。ただし指す先はリポジトリ同梱の静的ファイル
// （dist/og.png）に限る＝画像ホスティング等の外部依存は持ち込まない。絶対 URL は
// vite.config.ts の SITE_URL がビルド時に焼く（既定は公開先の GitHub Pages）。
describe.skipIf(!hasDist)('共有カード（OGP）はクローラ向け＝実行時の外部読込ではない', () => {
  const html = hasDist ? readFileSync(distFile, 'utf8') : '';
  const meta = (prop: string) =>
    new RegExp(`<meta[^>]*(?:property|name)="${prop}"[^>]*content="([^"]*)"`, 'i').exec(html)?.[1] ?? '';

  it('og:image が絶対 URL で、同梱の静的ファイルを指している', () => {
    const img = meta('og:image');
    expect(img).toMatch(/^https?:\/\//);
    expect(img.endsWith('/og.png')).toBe(true);
    expect(readdirSync(distDir)).toContain('og.png');
  });

  it('プレースホルダが焼き残っていない', () => {
    expect(html).not.toContain('%SITE_URL%');
    expect(meta('og:url')).toMatch(/^https?:\/\/.+\/$/);
  });
});
