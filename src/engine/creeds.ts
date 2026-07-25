// ★K 秀長の「信条」の純粋ヘルパー（DOM/localStorage 非依存＝テスト可能）。
// 物語は主人公を「記録に残らない裏方」＝"負の定義"で描く。その対に、各章の山場へ
// 一人称の決め台詞（Scene.creed）を1つ立て、集めると"正の定義"の肖像になる。
// 手がかり（なぜ記録に残らないか）と対をなす「秀長とはどんな人か」の答え。
import type { Work, Creed } from './types';

export interface CreedEntry {
  ch: number;
  creed: Creed;
  /** その章をクリア済みか（progress[ch]==='done'）。手帳での解錠条件。 */
  unlocked: boolean;
}

/** その章の「信条」を持つ最初のシーンの creed を返す（無ければ null）。 */
export function chapterCreed(work: Work, chId: number): Creed | null {
  const ch = work.story.chapters.find((c) => c.id === chId);
  if (!ch) return null;
  for (const sc of Object.values(ch.scenes)) {
    if (sc.creed) return sc.creed;
  }
  return null;
}

/**
 * 全章の「信条」を、進捗で解錠しながら章順に並べる（手帳「秀長のことば」用）。
 * creed 未定義の章は除外。unlocked は「その章をクリア済み（progress[ch]==='done'）」。
 */
export function collectedCreeds(
  work: Work,
  progress: Record<string, string> | null | undefined,
): CreedEntry[] {
  const out: CreedEntry[] = [];
  for (const ch of work.story.chapters) {
    const creed = chapterCreed(work, ch.id);
    if (!creed) continue;
    out.push({ ch: ch.id, creed, unlocked: progress?.[ch.id] === 'done' });
  }
  return out;
}

/** 解錠済みの信条の数（進捗バー用）。 */
export function creedsUnlockedCount(
  work: Work,
  progress: Record<string, string> | null | undefined,
): number {
  return collectedCreeds(work, progress).filter((e) => e.unlocked).length;
}
