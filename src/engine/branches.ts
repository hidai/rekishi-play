// ★L「分かれ道図鑑」の純粋ヘルパー（DOM/localStorage 非依存＝テスト可能）。
// 物語の分かれ道（choices を持つシーン）を集め、選択履歴（WorkSave.choices）で
// 「見た枝／まだ見ていない枝」を解決する。まだ見ていない枝は「えらぶと ひらく」
// ＝章の再プレイの動機になり、同じ史実をもう一度読む復習ループが自然に生まれる。
import type { Work } from './types';
import { choiceKey } from './canon';

export interface BranchOption {
  /** Scene.choices 内の元 index。 */
  idx: number;
  label: string;
  /** この枝を選んだことがあるか。 */
  seen: boolean;
  /** 史実の道か（Choice.canon）。 */
  canon: boolean;
  /** もしもルートか（hist.moshimo）。 */
  moshimo: boolean;
  /** 選んだ枝にだけ見せる「史実では」パネルの見出し（hist.match）。 */
  match?: string;
}

export interface BranchEntry {
  ch: number;
  sceneId: string;
  place?: string;
  /** 分かれ道の問い（Scene.q が無ければ既定文）。 */
  q: string;
  options: BranchOption[];
  /** 1つでも選んだことがあるか（無ければ図鑑では未発見＝？？？表示）。 */
  anySeen: boolean;
  /** すべての枝を見たか（コンプリート）。 */
  complete: boolean;
}

/** 分かれ道（choices を持つ全シーン）を章順・シーン定義順に集める。 */
export function collectedBranches(
  work: Work,
  choices: Record<string, number[]> | null | undefined,
): BranchEntry[] {
  const out: BranchEntry[] = [];
  for (const ch of work.story.chapters) {
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      if (!sc.choices?.length) continue;
      const hist = choices?.[choiceKey(ch.id, sid)] ?? [];
      const options: BranchOption[] = sc.choices.map((c, idx) => ({
        idx,
        label: c.label,
        seen: hist.includes(idx),
        canon: !!c.canon,
        moshimo: !!c.hist?.moshimo,
        match: hist.includes(idx) ? c.hist?.match : undefined,
      }));
      const anySeen = options.some((o) => o.seen);
      out.push({
        ch: ch.id,
        sceneId: sid,
        place: sc.place,
        q: sc.q || 'きみなら どうする？',
        options,
        anySeen,
        complete: options.every((o) => o.seen),
      });
    }
  }
  return out;
}

export interface BranchCount {
  /** 見た枝の総数。 */
  seen: number;
  /** 枝の総数。 */
  total: number;
}

/** 図鑑の進捗バー用（枝の単位で数える）。 */
export function branchesSeenCount(
  work: Work,
  choices: Record<string, number[]> | null | undefined,
): BranchCount {
  const entries = collectedBranches(work, choices);
  let seen = 0;
  let total = 0;
  for (const e of entries) {
    total += e.options.length;
    seen += e.options.filter((o) => o.seen).length;
  }
  return { seen, total };
}
