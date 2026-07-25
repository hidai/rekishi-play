// 「えっ！？」（Scene.spark）の収集の純粋ヘルパー（DOM/localStorage 非依存＝テスト可能）。
// spark＝「実は よく わかっていない」という歴史の目玉は、この教材の最も独創的な入口なのに、
// シーンで流れて消えていた。手がかり・カード・信条に並ぶ収集軸「えっ！？図鑑」として
// 手帳に積み上げ、"歴史＝謎とき"という主題そのものをコレクションにする。
// 解錠は creeds と同じく進捗から導出（progress[ch]==='done'）。セーブ形式は不変。
import type { Confidence, Work } from './types';

export interface SparkEntry {
  ch: number;
  /** 「えっ！？」の一文（Scene.spark）。 */
  text: string;
  /** そのシーンの「もっと深く」の問い（あれば。図鑑での読み返しの入口）。 */
  deepQ?: string;
  /** ★Sureness mark (deep.confidence) — shows how sure each えっ！？ is in the notebook. */
  confidence?: Confidence;
  /** シーンの場所ラベル（文脈の手がかり）。 */
  place?: string;
  /** その章をクリア済みか（progress[ch]==='done'）。手帳での解錠条件。 */
  unlocked: boolean;
}

/**
 * 全章の spark を、進捗で解錠しながら章順・シーン定義順に並べる（手帳「えっ！？図鑑」用）。
 * spark を持たない章は含まれない。
 */
export function collectedSparks(
  work: Work,
  progress: Record<string, string> | null | undefined,
): SparkEntry[] {
  const out: SparkEntry[] = [];
  for (const ch of work.story.chapters) {
    const unlocked = progress?.[ch.id] === 'done';
    for (const sc of Object.values(ch.scenes)) {
      if (!sc.spark) continue;
      out.push({
        ch: ch.id,
        text: sc.spark,
        deepQ: sc.deep?.q,
        confidence: sc.deep?.confidence,
        place: sc.place,
        unlocked,
      });
    }
  }
  return out;
}

/** 解錠済みの「えっ！？」の数（進捗バー用）。 */
export function sparksUnlockedCount(
  work: Work,
  progress: Record<string, string> | null | undefined,
): number {
  return collectedSparks(work, progress).filter((e) => e.unlocked).length;
}
