// ★J クイズ（純粋ロジック）検証。顔あてに加え、信条→章あて・関係あてを正しく組む。
import { describe, it, expect } from 'vitest';
import { buildQuestion, personPool } from '../src/engine/quiz';
import { chapterCreed } from '../src/engine/creeds';
import { hidenaga } from '../src/works/hidenaga/index';

// 決定的な擬似乱数（テスト用）。0..1 を順に返す。
function seq(vals: number[]): () => number {
  let i = 0;
  return () => vals[i++ % vals.length];
}

const THREE = ['p-hideyoshi', 'p-naka', 'p-nobunaga'];
// THREE 収集・progress 無しで出せるモードは [faceToName, nameToFace, relationToPerson] の3つ。
// 1つ目の rnd がモードを選ぶ（floor(r*3)）。

describe('personPool', () => {
  it('集めたカードのうち「人物」だけを返す', () => {
    const pool = personPool(hidenaga, ['p-hideyoshi', 'w-ichiya', 'p-naka']);
    expect(pool.sort()).toEqual(['p-hideyoshi', 'p-naka']);
  });
  it('未所持や未定義は空', () => {
    expect(personPool(hidenaga, [])).toEqual([]);
    expect(personPool(hidenaga, undefined)).toEqual([]);
  });
});

describe('buildQuestion: 顔あて（従来）', () => {
  it('集めた人物が2人未満（かつ信条も無い）なら null', () => {
    expect(buildQuestion(hidenaga, ['p-hideyoshi'], seq([0]))).toBeNull();
    expect(buildQuestion(hidenaga, [], seq([0]))).toBeNull();
  });

  it('2人以上なら問題を返し、選択肢に答えを含む', () => {
    const q = buildQuestion(hidenaga, THREE, seq([0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]));
    expect(q).not.toBeNull();
    expect(q!.mode).toBe('faceToName');
    expect(q!.optionIds).toContain(q!.answerId);
    // 選択肢に重複がない。
    expect(new Set(q!.optionIds).size).toBe(q!.optionIds.length);
    // すべて実在の人物カード。
    for (const id of q!.optionIds) expect(hidenaga.cards[id]?.type).toBe('person');
  });

  it('mode は 1つ目の rnd で切り替わる', () => {
    expect(buildQuestion(hidenaga, THREE, seq([0, 0, 0, 0, 0, 0]))!.mode).toBe('faceToName');
    expect(buildQuestion(hidenaga, THREE, seq([0.34, 0, 0, 0, 0, 0]))!.mode).toBe('nameToFace');
    expect(buildQuestion(hidenaga, THREE, seq([0.9, 0, 0, 0, 0, 0]))!.mode).toBe('relationToPerson');
  });

  it('選択肢は最大4択（答え＋誤答3）', () => {
    const all = Object.keys(hidenaga.cards).filter((id) => hidenaga.cards[id].type === 'person');
    const q = buildQuestion(hidenaga, all, seq([0.1, 0.2, 0.3, 0.4, 0.5]));
    expect(q!.optionIds.length).toBe(4);
  });

  it('avoidId は直前と同じ答えを避ける（可能なら）', () => {
    const c = ['p-hideyoshi', 'p-naka'];
    // 1つ目=モード選択（0→faceToName）、2つ目=答え選び。avoid を除くと1人 => その1人が答え。
    const q = buildQuestion(hidenaga, c, seq([0, 0, 0, 0]), 'p-hideyoshi');
    expect(q!.mode).toBe('faceToName');
    expect(q!.answerId).toBe('p-naka');
  });
});

describe('buildQuestion: 信条→章あて（creedToChapter）', () => {
  const done2 = { 1: 'done', 2: 'done' };

  it('creed 章を2つ以上クリア済みなら出題できる', () => {
    // THREE 収集＋done2 → モードは [face, name, creed, relation] の4つ。floor(0.6*4)=2 → creed。
    const q = buildQuestion(hidenaga, THREE, seq([0.6, 0, 0, 0, 0]), undefined, done2);
    expect(q!.mode).toBe('creedToChapter');
    // 答えはクリア済みの章、prompt はその章の信条の台詞。
    expect(['1', '2']).toContain(q!.answerId);
    expect(q!.prompt).toBe(chapterCreed(hidenaga, Number(q!.answerId))!.line);
    // 選択肢はすべて creed を持つ章の id 文字列で、答えを含み、重複なし。
    expect(q!.optionIds).toContain(q!.answerId);
    expect(new Set(q!.optionIds).size).toBe(q!.optionIds.length);
    for (const id of q!.optionIds) {
      expect(chapterCreed(hidenaga, Number(id))).not.toBeNull();
    }
  });

  it('人物カードが無くても信条だけで出題できる（収集ゼロでもクイズが回る）', () => {
    const q = buildQuestion(hidenaga, [], seq([0, 0, 0, 0]), undefined, done2);
    expect(q!.mode).toBe('creedToChapter');
  });

  it('クリア済みが1章だけなら出題しない', () => {
    expect(buildQuestion(hidenaga, [], seq([0]), undefined, { 1: 'done' })).toBeNull();
  });

  it('avoidId（章 id 文字列）で直前の答えを避ける', () => {
    const q = buildQuestion(hidenaga, [], seq([0, 0, 0, 0]), '1', done2);
    expect(q!.answerId).toBe('2');
  });
});

describe('buildQuestion: 関係あて（relationToPerson）', () => {
  it('答えは集めた人物で、prompt はその関係ラベル', () => {
    const q = buildQuestion(hidenaga, THREE, seq([0.9, 0, 0, 0, 0]));
    expect(q!.mode).toBe('relationToPerson');
    expect(THREE).toContain(q!.answerId);
    const edge = hidenaga.relations!.edges.find((e) => e.pid === q!.answerId)!;
    expect(q!.prompt).toBe(edge.rel);
    // 選択肢はすべて相関図に登場する実在人物。答えを含み、重複なし。
    expect(q!.optionIds).toContain(q!.answerId);
    expect(new Set(q!.optionIds).size).toBe(q!.optionIds.length);
    const relPids = new Set(hidenaga.relations!.edges.map((e) => e.pid));
    for (const id of q!.optionIds) {
      expect(relPids.has(id), id).toBe(true);
      expect(hidenaga.cards[id]?.type).toBe('person');
    }
    // 誤答に「同じ関係ラベルのもうひとつの正解」が混ざらない。
    for (const id of q!.optionIds) {
      if (id === q!.answerId) continue;
      const e = hidenaga.relations!.edges.find((x) => x.pid === id);
      expect(e?.rel).not.toBe(q!.prompt);
    }
  });
});
