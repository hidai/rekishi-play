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
