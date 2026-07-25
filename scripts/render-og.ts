// 共有カード（OGP）の PNG を焼く開発用スクリプト。X/Facebook のクローラは SVG を扱えないので
// ラスタが要る＝生成物 public/og.png を commit する（ビルドにラスタライザを持ち込まない）。
// Usage: npx vite-node scripts/render-og.ts [出力先=public/og.png]
// 作品を1つ出荷したら焼き直す（忘れると tests/og-card.test.ts の snapshot が赤くなる）。
import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { ogCardSvg, OG_W, OG_H } from './lib/og-card';

const out = resolve(process.argv[2] ?? 'public/og.png');
const svgPath = join(mkdtempSync(join(tmpdir(), 'og-')), 'og.svg');
writeFileSync(svgPath, ogCardSvg());

try {
  execFileSync('rsvg-convert', ['-w', String(OG_W), '-h', String(OG_H), '-o', out, svgPath]);
} catch (e) {
  console.error(`rsvg-convert に失敗（未インストール？）。SVG は ${svgPath} に残してある。`);
  throw e;
}
console.log('wrote', out, `(svg: ${svgPath})`);
