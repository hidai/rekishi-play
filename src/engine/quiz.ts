// ★J クイズ（純粋ロジック・DOM 非依存＝テスト可能）。
// 顔↔名前の「顔あて」に加え、信条→章あて（creedToChapter）・関係あて（relationToPerson）で
// 「名前の記憶」だけでなく「人物像・関係の記憶」を能動的想起させる。
// 材料はすべて既存の汎用データ（cards / Scene.creed / Work.relations）——作品側の追加作業ゼロで、
// creeds や relations を持つ作品なら自動的に出題の幅が広がる。
// ⚠️ story/cards は不変更。セーブにも影響しない。
import type { Work } from './types';
import { chapterCreed } from './creeds';

export type QuizMode = 'faceToName' | 'nameToFace' | 'creedToChapter' | 'relationToPerson';

export interface QuizQuestion {
  mode: QuizMode;
  /** 人物 id（顔・関係あて）、または章 id の文字列（信条あて）。 */
  answerId: string;
  optionIds: string[]; // answerId を含み、シャッフル済み（最大4択）
  /** creedToChapter: 出題する決め台詞 / relationToPerson: 関係ラベル（例「兄」）。 */
  prompt?: string;
}

/** 集めた「人物」カードの id（クイズの答えプール）。 */
export function personPool(work: Work, collected: string[] | undefined): string[] {
  const set = new Set(collected ?? []);
  return Object.keys(work.cards).filter((id) => work.cards[id].type === 'person' && set.has(id));
}

/** 全「人物」カードの id（誤答の補充用）。 */
function allPersons(work: Work): string[] {
  return Object.keys(work.cards).filter((id) => work.cards[id].type === 'person');
}

/** creed を持つ章のうちクリア済み（＝子どもが信条に出会った）章の id。 */
function doneCreedChapters(work: Work, progress: Record<string, string> | undefined): number[] {
  return work.story.chapters
    .filter((c) => progress?.[c.id] === 'done' && !!chapterCreed(work, c.id))
    .map((c) => c.id);
}

/** creed を持つ全章の id（誤答の補充用）。 */
function allCreedChapters(work: Work): number[] {
  return work.story.chapters.filter((c) => !!chapterCreed(work, c.id)).map((c) => c.id);
}

function shuffleWith<T>(arr: T[], rnd: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** 「集めたもの優先＋全体から補充」で誤答を最大3つ選び、答えと混ぜて返す。 */
function buildOptions(
  answer: string,
  preferred: string[],
  others: string[],
  rnd: () => number,
): string[] {
  const p = shuffleWith(preferred.filter((x) => x !== answer), rnd);
  const o = shuffleWith(others.filter((x) => x !== answer && !preferred.includes(x)), rnd);
  const distractors = [...p, ...o].slice(0, 3);
  return shuffleWith([answer, ...distractors], rnd);
}

/**
 * 1問を組み立てる。出題できるモードが無ければ null（クイズ不可）。
 * - 顔↔名前: 集めた人物が2人以上。
 * - 信条→章あて: creed のある章を2つ以上クリア済み（progress が必要）。
 * - 関係あて: work.relations があり、集めた人物に相手がいる。
 * rnd は 0..1 を返す関数（テストで差し込み可）。avoidId で直前の答えの連続を避ける。
 */
export function buildQuestion(
  work: Work,
  collected: string[] | undefined,
  rnd: () => number = Math.random,
  avoidId?: string,
  progress?: Record<string, string>,
): QuizQuestion | null {
  const pool = personPool(work, collected);
  const doneCreeds = doneCreedChapters(work, progress);
  const relEdges = (work.relations?.edges ?? []).filter((e) => !!work.cards[e.pid]);
  const relCands = relEdges.filter((e) => pool.includes(e.pid));

  // 出せるモードを固定順で列挙し、rnd で1つ選ぶ（順序固定＝テスト決定性）。
  const modes: QuizMode[] = [];
  if (pool.length >= 2) modes.push('faceToName', 'nameToFace');
  if (doneCreeds.length >= 2) modes.push('creedToChapter');
  if (pool.length >= 2 && relCands.length >= 1) modes.push('relationToPerson');
  if (!modes.length) return null;
  const mode = modes[Math.floor(rnd() * modes.length)];

  if (mode === 'creedToChapter') {
    let candidates = doneCreeds.filter((ch) => String(ch) !== avoidId);
    if (!candidates.length) candidates = doneCreeds;
    const ch = candidates[Math.floor(rnd() * candidates.length)];
    const creed = chapterCreed(work, ch)!;
    const optionIds = buildOptions(
      String(ch),
      doneCreeds.map(String),
      allCreedChapters(work).map(String),
      rnd,
    );
    return { mode, answerId: String(ch), optionIds, prompt: creed.line };
  }

  if (mode === 'relationToPerson') {
    let candidates = relCands.filter((e) => e.pid !== avoidId);
    if (!candidates.length) candidates = relCands;
    const edge = candidates[Math.floor(rnd() * candidates.length)];
    // 同じ関係ラベルの別人物は「もうひとつの正解」になるため誤答から除外。
    const sameRel = new Set(relEdges.filter((e) => e.rel === edge.rel).map((e) => e.pid));
    const otherPids = [...new Set(relEdges.map((e) => e.pid))].filter((pid) => !sameRel.has(pid));
    const optionIds = buildOptions(
      edge.pid,
      otherPids.filter((pid) => pool.includes(pid)),
      otherPids,
      rnd,
    );
    return { mode, answerId: edge.pid, optionIds, prompt: edge.rel };
  }

  // 顔↔名前（従来）。答えは直前と同じを避ける（避けると空になる場合だけ妥協）。
  let candidates = pool.filter((id) => id !== avoidId);
  if (!candidates.length) candidates = pool;
  const answerId = candidates[Math.floor(rnd() * candidates.length)];
  const optionIds = buildOptions(answerId, pool, allPersons(work), rnd);
  return { mode, answerId, optionIds };
}
