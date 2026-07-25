// 汎用ユーティリティ（旧 esc）。
export function esc(s: unknown): string {
  return String(s == null ? '' : s).replace(
    /[&<>"]/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string,
  );
}

// Rendered width of an SVG <text> in user units. CJK glyphs are full-width, latin roughly half.
// Lives here rather than in a drawing module because every layout that must not collide needs it
// (figure seats, scene-map names) and the drawing modules already depend on each other.
export function textW(s: string, fs: number): number {
  let w = 0;
  for (const ch of s) w += ch.charCodeAt(0) > 0xff ? fs : fs * 0.55;
  return w;
}
