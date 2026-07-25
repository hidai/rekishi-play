// ★L「きみの読み」（史実一致率）の純粋ヘルパー（DOM/localStorage 非依存＝テスト可能）。
// 分かれ道での"初回の"選択が、史実（Choice.canon）と一致した数を数える。
// 正解/不正解のテストではなく「きみの読みは歴史と合っていたか？」という読み比べの
// メタゲーム——外れたときこそ「史実では」のおどろき（＝学び）が待っている、という枠組み。
import type { Work } from './types';

/** WorkSave.choices のキー（章:シーンid。シーン id は章をまたいで重複しうるため章を含める）。 */
export function choiceKey(chId: number, sceneId: string): string {
  return chId + ':' + sceneId;
}

export interface CanonStat {
  /** 初回の選択が史実と一致した分かれ道の数。 */
  matched: number;
  /** これまでに選択した、canon 判定のある分かれ道の数。 */
  total: number;
}

/**
 * 選択履歴から史実一致を集計する。
 * - canon フラグを1つも持たない分かれ道（終章の「きみの答え」等）は対象外。
 * - 判定は各分かれ道の「初回の選択」（choices[key][0]）。周回で答えを知ってから
 *   選び直しても一致率は動かない＝最初の読みの記録として残る。
 */
export function canonStat(
  work: Work,
  choices: Record<string, number[]> | null | undefined,
): CanonStat {
  let matched = 0;
  let total = 0;
  for (const ch of work.story.chapters) {
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      if (!sc.choices?.some((c) => c.canon)) continue;
      const hist = choices?.[choiceKey(ch.id, sid)];
      if (!hist || !hist.length) continue;
      total++;
      if (sc.choices[hist[0]]?.canon) matched++;
    }
  }
  return { matched, total };
}

/** 作品が「きみの読み」を持つか（canon フラグ付きの分かれ道が1つでもあるか）。 */
export function hasCanon(work: Work): boolean {
  return work.story.chapters.some((ch) =>
    Object.values(ch.scenes).some((sc) => sc.choices?.some((c) => c.canon)),
  );
}
