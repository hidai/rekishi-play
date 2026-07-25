// ★Q 観察ビューの純粋ロジック（DOM 非依存・イミュータブル・決定的＝テスト可能）。
// ミニゲーム（engine/minigame.ts）と同じ規律: 状態遷移はここに置き、Svelte 側は
// 座標の収集と描画だけを持つ。
//
// `found` は「その読者が作品全体で見つけた hotspot id」であって、シーン単位ではない。
// 観察ビューの再訪機構（davinci §6-2「昔の絵に戻ると、今の目で新しい発見が出る」）は
// 章をまたいだ gate で成り立つので、可視性の判定には作品全体の発見済み集合が要る。
//
// 座標を扱う純関数（hitTest・レンズ）は art/observe.ts 側にある。ここは
// 「どれが見えるか・どこまで進んだか」だけを持ち、絵の座標系を知らない。
import type { ObserveHotspot, ObserveSpec } from './types';

/**
 * いま見つけられる hotspot（gate が開いているもの。発見済みも含む）。
 * gate が閉じた hotspot は「まだ この目には見えない」＝存在ごと伏せる。ヒントも出さない——
 * 見えると「まだ何かある」が漏れ、後の章で戻ってくる驚き（§6-2）を先に食ってしまう。
 */
export function visibleHotspots(spec: ObserveSpec, found: readonly string[]): ObserveHotspot[] {
  return spec.hotspots.filter((h) => !h.gatedOn || found.includes(h.gatedOn));
}

/**
 * このシーンで見つけた hotspot を、拾った順に並べたもの（`found` は push 順＝発見順）。
 *
 * この順序が「絵の上の印」と「本文側に並ぶ説明」の両方の唯一の物差しで、両者は同じ番号で
 * 対応づく。データの並び順で説明を並べると、いま押した印の説明がどれか分からない
 * （家族の実プレイ 2026-07-22:「タップした順と説明の順が違って、どれが今の説明か分からない」）。
 */
export function foundInOrder(spec: ObserveSpec, found: readonly string[]): ObserveHotspot[] {
  return spec.hotspots
    .filter((h) => found.includes(h.id))
    .sort((a, b) => found.indexOf(a.id) - found.indexOf(b.id));
}

/** 絵の印と説明に振る通し番号（1 始まり）。見つけていない hotspot は 0。 */
export function foundNumbers(spec: ObserveSpec, found: readonly string[]): Map<string, number> {
  const m = new Map<string, number>();
  foundInOrder(spec, found).forEach((h, i) => m.set(h.id, i + 1));
  return m;
}

export interface ObserveProgress {
  /** 見つけた essential の数。 */
  got: number;
  /** このシーンの essential の総数。 */
  need: number;
  /** 「つづき」が解錠されたか。 */
  done: boolean;
}

/**
 * 「つづき」の gate＝essential な hotspot が揃ったか。
 * essential が 0 個のシーン（観察が任意の寄り道）は最初から done＝進行を止めない。
 */
export function observeProgress(spec: ObserveSpec, found: readonly string[]): ObserveProgress {
  const essential = spec.hotspots.filter((h) => h.essential);
  const got = essential.filter((h) => found.includes(h.id)).length;
  return { got, need: essential.length, done: got >= essential.length };
}

/**
 * hotspot を1つ拾う。すでに拾っていれば `isNew:false` で集合は不変
 * （save.grant と同じ契約＝呼び手は isNew で採集アニメ・効果音を鳴らすか決める）。
 */
export function collectHotspot(
  found: readonly string[],
  id: string,
): { found: string[]; isNew: boolean } {
  if (found.includes(id)) return { found: [...found], isNew: false };
  return { found: [...found, id], isNew: true };
}
