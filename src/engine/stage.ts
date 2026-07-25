// ★G 人生ステージの見せ場（純粋ロジック・DOM 非依存＝テスト可能）。
// 章の冒頭で、主人公の顔スペックが前章から変わっていれば「大きく1枚見せる」対象を返す。
// 地図上の小さな加齢に頼らず、成長を"felt moment"にするための判定だけを担う。
import type { Work } from './types';

export interface StageMoment {
  /** 顔スペックキー。空文字なら顔なし（テキストだけの見せ場）。 */
  faceKey: string;
  title: string;
  caption: string;
  /** ★N 見た目の変種。'crisis'=急報（暗く緊迫した演出）。省略時は ★G の金の見た目。 */
  tone?: string;
}

/**
 * (chId, sceneId) が「人生ステージが切り替わる章の冒頭」なら見せ場情報を返す。
 * 条件: sceneId が章の start、かつ前章と顔スペックキーが異なり、stages に文言がある。
 * 第1章（前章なし）も、stages に文言があれば発火する＝物語の入口で
 * 「きみ＝この子」を大きく1枚見せ、なりきりを初期化する。
 */
export function stageMoment(work: Work, chId: number, sceneId: string): StageMoment | null {
  const stages = work.protagonistStages;
  const byCh = work.protagonistFacesByChapter;
  if (!stages || !byCh) return null;
  const ch = work.story.chapters.find((c) => c.id === chId);
  if (!ch || ch.start !== sceneId) return null;
  const now = byCh[chId];
  const prev = byCh[chId - 1];
  if (!now || now === prev) return null;
  const s = stages[now];
  if (!s) return null;
  return { faceKey: now, title: s.title, caption: s.caption };
}
