// ★型9 の計器（診断のみ。ゲートではない）。scripts/agency-audit.ts と
// tests/agency-calibration.test.ts が共用する。
//
// What it measures: does a screen contain **人が人に向かって何かをする** —— a directed act
// between two people. Origin: docs/design/engagement.md §17。『渋沢』の読み通しで小5 は章六の頭で
// やめ（load 387＝作品でいちばん軽い部類＝〈用量〉では説明できない）、両ペルソナが独立に挙げた
// 最上位の画面は 1-c2（従兄と斬り合う夜）と 7-b（日本じゅうの子どもによびかける）だった。
//
// ⚠️ この計器は較正して作った（顔エンジンと同じ empirical loop）。**初版は「きみが主語の行為」だけを
// 数え、較正元の秀長が7作の最下位に落ちた**（子どもの実反応で検証済みの唯一のコーパスが最下位＝
// 物差しの側の誤り）。露出した見落としが2つ:
//   ・**行為には向きが二つある** — 母がきみの手をにぎる／兄がきみの肩をつかむ／敵がきみの前で頭を
//     下げる。§14 が「いちばん心に残った画面」に挙げた親子の場面は**すべて相手→きみ**だった。
//   ・**声は1つで足りる** — 母の一言（「そばに いてやって おくれ」）は応酬でなくても場を作る。
//
// ゆえに判定は加算で、しきい値は 2:
//   score = 向きのある行為（きみを含む文の中の ACT_VERBS）＋ 他者の声（`class="speak"`）
//   engaged = score >= 2
// これで較正点が両側そろう（1-c2＝声2・7-b＝行為3・秀長 1-d＝行為1＋声1／渋沢 6-a＝1 で非）。
//
// 見ているのは主線の本文だけ（deep・カード・手帳は読者が開かない面＝型3 と同じ線引き）。
// hist を入れないのは、選択の後に開く面＝「この画面をやめるか」の判断がもう済んでいるから。
// **岐路そのものは数えない**——ほぼ全画面が岐路を持つ作品があり、足すと解像度が消える
// （岐路の数と間隔は scripts/engagement-audit.ts の担当）。
//
// ⚠️ 限界（silent cap にしないため明記する）: これは床でも天井でもない診断。日本語の主語省略を
// 追えないので「きみ」を書かずに続く行為の文は数え落とす（＝過少報告に倒す）。逆に、30年前の
// 行為の回想も現在の行為と区別できない。使い方は個別画面の合否でなく、**章の中の「空白のラン」の
// 長さを作品どうしで比べること**。
import type { Scene, Work } from '../../src/engine/types';
import { plainText } from './content-stats';

/**
 * 人に向かう／人から向かう動きの語（人が育てるリスト＝INSTITUTION_TERMS・PREMISE_MARKERS と
 * 同じ作り）。活用形を substring で持つ。**状態・変化の語は入れない**——「なった」「生まれた」
 * 「いる」「死んだ」は行為ではなく、そこを数えると「きみは 53さい」の画面まで engaged になる。
 */
export const ACT_VERBS: string[] = [
  // 体で触れる・向き合う（相手→きみ が多い層。§14 の「いちばん心に残った画面」はここ）
  // ⚠️ 同じ接触を指す語を二重に置かない（「肩を」＋「つかん」で1つの行為が2点になった）。
  'にぎ', 'つかん', 'つかみ', 'つかむ', '抱い', 'だきしめ', '手をとっ', '下げ', 'ひざまず',
  'すがり', 'すがっ', '見つめ', 'にらん', 'ふりむい', 'なで', 'ゆすっ',
  // 声を向ける
  '呼び', 'よびかけ', 'たずね', '問い', '言っ', '言い返', '答え', '告げ', 'ささやい', 'さけん',
  'どなっ', 'うなずい', 'ほめ', '責め', 'しかっ', '叱っ', 'なだめ', 'なぐさめ', 'さそっ', 'すすめ',
  '説い', '教え', '見せ', '約束', 'しらせ', '申し上げ', 'ちらつかせ',
  // わたす・うけとる
  'わたし', '渡し', '差し出', '受け', 'もらっ', 'もらう', 'あずけ', 'まかせ', 'ゆず', '迎え',
  '嫁が', 'つかわ', 'つれ', 'ことわ', '断っ', 'たのみ', 'たのん', '願っ', '命じ', 'ゆるし', '許し',
  'せまっ', 'とりなし',
  // 争う・守る（⚠️ 「兵を」「刀を」のような目的語だけの印は置かない＝動詞と二重に当たる）
  '斬っ', '斬る', '斬れ', '討っ', '討つ', '刺し', '破っ', '攻め', '戦っ', 'たたか', 'おそっ',
  'うちこわ', 'ほろぼ', 'かこ', 'とじこめ', 'ひきずり', '助け', 'たすけ', 'かば', '守っ', '支え',
  '従っ', 'つかえ', '仕え', '救っ', '裏切', 'だまし', 'だまさ',
  // 自分の手で動かす（きみ→世界。7-b の層）
  // ⚠️ 「立っ」「立ち」は入れない——「武門の頂に立った」は地位に達した**状態**で、この層の意図ではない
  //（ヘッダの「状態・変化の語は入れない」に自分で違反していた。code review 2026-08-04）。
  '行き', '行っ', '向かっ', '帰っ', '出し', '入れ', '乗っ', 'のっ', 'わたっ', '走っ', 'すわ',
  'ひらい', '書い', '書く', '写し', '描い', '読ん', '売っ', '買い', '買っ',
  'あつめ', '集め', 'つくら', 'つくり', 'つくっ', 'きずい', 'すえ', 'ならべ', '決め', 'やめ',
  'えらん', 'かくし', '待っ',
];

/**
 * ACT_VERBS に部分一致するが行為ではない言い方（**長い一致が勝つ**＝institution-audit の termAt と同じ作り）。
 * 裸のかな2文字は慣用句を高い率で拾う——「手に入れる」は城を得た**結果**、「手を入れる」は絵の手直し、
 * 「入れかえ」は順序の話。⚠️ この表が無かったあいだ、較正テストの「秀長に空白の章が無い」は
 * **誤検出1件だけで支えられていた**（`hidenaga 3-a` の「手に入れ」。code review 2026-08-04）。
 */
export const NOT_ACTS: string[] = ['手に入れ', '手を入れ', '入れかえ', '荷に入れ'];

/** 行為の語の直後に来る打ち消し（「入れなかった」「答えない」を「した」と数えないため）。 */
const NEGATION = /^(?:ない|なかっ|なく|ぬ|ず)/;

export interface SceneAgency {
  id: string;
  /** Other people's voices in the main line (`class="speak"` paragraphs). */
  voices: number;
  /** ACT_VERBS matched in sentences that name きみ (either direction). */
  acts: string[];
  /** acts + voices. */
  score: number;
  /** score >= 2. */
  engaged: boolean;
  /**
   * ミニゲーム・観察ビューのある画面。**相手のいる行為ではない**が、死んだ画面でもない
   * （§14＝ダビンチ 1-b の観察ビューは「いちばん楽しかった」）。報告で混同しないよう持つ。
   */
  hands: boolean;
}

export interface ChapterAgency {
  chapterId: number;
  title: string;
  scenes: SceneAgency[];
  engaged: number;
  /** Longest run of consecutive non-engaged scenes anywhere in the chapter. */
  longestGap: number;
  /** Non-engaged scenes at the head of the chapter (where the reader decides to quit). */
  headGap: number;
}

/** Sentences that name the protagonist — any particle, so both directions are seen. */
function youSentences(body: string): string[] {
  return plainText(body)
    .split(/(?=[「])|(?<=[。！？」])/)
    .filter((s) => s.includes('きみ'));
}

/** その位置の一致が行為か＝より長い NOT_ACTS がその位置を覆っていない、かつ直後が打ち消しでない。 */
function actAt(text: string, i: number, verb: string): boolean {
  for (const n of NOT_ACTS)
    for (let k = text.indexOf(n); k >= 0; k = text.indexOf(n, k + 1))
      if (k <= i && i < k + n.length) return false;
  return !NEGATION.test(text.slice(i + verb.length));
}

export function sceneAgency(id: string, sc: Scene): SceneAgency {
  const raw = sc.text ?? '';
  const voices = (raw.match(/class="speak"/g) ?? []).length;
  const acts: string[] = [];
  for (const s of youSentences(raw))
    for (const v of ACT_VERBS) {
      if (acts.includes(v)) continue;
      for (let i = s.indexOf(v); i >= 0; i = s.indexOf(v, i + 1))
        if (actAt(s, i, v)) {
          acts.push(v);
          break;
        }
    }
  const score = acts.length + voices;
  return { id, voices, acts, score, engaged: score >= 2, hands: !!(sc.minigame || sc.observe) };
}

export function auditWork(work: Work): ChapterAgency[] {
  return work.story.chapters.map((ch) => {
    const scenes = Object.entries(ch.scenes).map(([id, sc]) => sceneAgency(id, sc));
    let longestGap = 0,
      run = 0,
      headGap = -1;
    for (const s of scenes) {
      if (s.engaged) {
        if (headGap < 0) headGap = run;
        run = 0;
      } else {
        run++;
        longestGap = Math.max(longestGap, run);
      }
    }
    return {
      chapterId: ch.id,
      title: plainText(ch.title),
      scenes,
      engaged: scenes.filter((s) => s.engaged).length,
      longestGap,
      // A chapter with no engaged scene at all: the whole chapter is the head gap.
      headGap: headGap < 0 ? scenes.length : headGap,
    };
  });
}
