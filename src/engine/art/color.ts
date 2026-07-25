// 色ユーティリティ。似顔絵(face.ts)が肌色・髪色から影色/ハイライト色を
// 決定的に導出するために使う(FaceSpec に色キーを増やさないための要)。

/** #rrggbb 2色をチャンネルごとに線形補間する(t=0 で a、t=1 で b)。 */
export function mixHex(a: string, b: string, t: number): string {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  let out = '#';
  for (const sh of [16, 8, 0]) {
    const ca = (pa >> sh) & 255;
    const cb = (pb >> sh) & 255;
    out += Math.round(ca + (cb - ca) * t)
      .toString(16)
      .padStart(2, '0');
  }
  return out;
}
