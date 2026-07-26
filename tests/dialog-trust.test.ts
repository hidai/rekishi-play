// ダイアログの desc は `{@html}` で描かれる（DialogHost）＝**エンジンの固定文言専用**。
// 2026-07-26 のレビューで、記録を消す確認文が `` `「${accountLabel(a)}」の…` `` の形で
// 読者が打った名前を desc に流し込んでいた（アカウント UI の初版からの持ち越し）。
// 「読者由来の唯一の文字列はテキスト補間のまま」（CLAUDE.md の信頼境界）を、
// tests/ruby-render.test.ts が守れない経路——テンプレート文字列——で破っていた形。
//
// 直しは DialogOpts に subject（テキスト描画専用）を足すことだが、直しただけでは
// 次に確認文を書く人が同じ形を書く。ゲートはその形そのものを禁じる:
// **desc に渡せるのはリテラル文字列だけ**（補間があるなら可変＝subject へ回す）。
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const SRC = fileURLToPath(new URL('../src', import.meta.url));

function sources(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return sources(p);
    return /\.(svelte|ts)$/.test(f) ? [p] : [];
  });
}

describe('dialog の信頼境界: desc は固定文言・可変文字列は subject へ', () => {
  const files = sources(SRC);

  it('走査対象を実際に見つけている（空回りゲートの防止）', () => {
    expect(files.length).toBeGreaterThan(30);
    expect(files.some((p) => p.endsWith('dialog.svelte.ts'))).toBe(true);
  });

  it('desc: に補間つきテンプレート文字列を渡していない', () => {
    const bad: string[] = [];
    for (const p of files) {
      for (const m of readFileSync(p, 'utf8').matchAll(/\bdesc:\s*`([^`]*)`/g)) {
        if (m[1].includes('${')) bad.push(`${p.slice(SRC.length + 1)}: desc: \`${m[1]}\``);
      }
    }
    expect(bad, 'desc は {@html} で描かれる＝可変文字列は subject（テキスト描画）へ').toEqual([]);
  });

  it('DialogHost は subject をテキスト補間で描く（{@html} に載せない）', () => {
    const host = readFileSync(join(SRC, 'engine/ui/overlays/DialogHost.svelte'), 'utf8');
    expect(host).toContain('{dialog.current.subject}');
    for (const m of host.matchAll(/\{@html([^}]*)\}/g)) {
      expect(m[1]).not.toContain('subject');
    }
  });
});
