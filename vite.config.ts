import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// The build must stay base-path agnostic and load nothing external; a single file was one way to
// get there, never the requirement (tests/deploy-contract.test.ts, README「配信の形」).
//
// It is now CHUNKED, because the works carry real photographs (Card.photo, ~20-60KB each, data
// URIs): inlining everything made every reader download every work's pictures before the title
// screen. src/works/registry.ts already loads each work's body through a dynamic import(), so
// splitting turns that contract into actual bytes — the title screen ships the shell plus the
// lightweight cards, and 秀長's pictures arrive only when 秀長 is opened.
//
// `base: './'` keeps every emitted asset a RELATIVE path, so the same dist works on a GitHub Pages
// sub-path and at a domain root alike (the contract's first half).
// 共有カード（OGP）の絶対 URL。og:image はクローラが取りに来るので相対では解決できず、ここだけ
// 配信先を知る必要がある——アプリ本体は相対のままで、base path 非依存の契約は動かない。
// 既定は公開先（README「デプロイ」）。別の場所へ配るビルドは SITE_URL=... で上書きする。
// `||` は空文字も既定に落とす（SITE_URL= を渡すと og:image が相対になり、共有カードが死ぬ）。
const SITE_URL = (process.env.SITE_URL || 'https://hidai.github.io/rekishi-play/').replace(/\/*$/, '/');

export default defineConfig({
  base: './',
  plugins: [
    svelte(),
    {
      name: 'site-url',
      transformIndexHtml: (html: string) => html.replaceAll('%SITE_URL%', SITE_URL),
    },
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: false,
    // Keep small assets inlined (fonts/icons), but let the per-work photo modules stay chunks.
    assetsInlineLimit: 4096,
  },
  test: {
    // vitest: pure logic (passphrase, save compat, work integrity) with no DOM
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
