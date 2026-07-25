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
export default defineConfig({
  base: './',
  plugins: [svelte()],
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
