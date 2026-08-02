// ★主人公の名の機械検査。tests/name-continuity.test.ts（ゲート）と
// scripts/name-audit.ts（CLI）が共用する。
//
// 検査する規則は docs/WRITING.md 13 の後半——**同じ人を、面ごとに別の名で呼ばない**。
// 読み通し検査（docs/design/engagement.md §14 型4）で2作に出た欠陥＝**主人公の名が変わるのに、
// 同一人物だと言わない**。逐語「名前が4つあって自信がない」「やっと同じ人だと分かったのは
// 最後の画面」。秀長＝小竹→小一郎→長秀→秀長（**一字違いの 長秀／秀長 まである**）、
// 家康＝竹千代→元康→家康。成功例はコーパスの中にある——勝海舟 1-a
// 「きみは 勝麟太郎、**のちの 海舟**」＝最初の一文で結んでいるので、以後どの面が
// 「海舟」と呼んでも読者は迷わない。
//
// 判定（1つだけ）: **名の初出の面に、すでに結ばれた名が、言葉をはさんで同じ面にあること**。
//   ・面は読者が出会う順（scripts/lib/ruby-audit.ts の workSurfaces）に歩く。
//   ・最初に出た名（ふつうは入口の titleMain）が種で、そこから共起で鎖をのばす。
//   ・鎖が切れた面＝読者が「別人かもしれない」と思う面。そこが hit。
//   ・「言葉をはさんで」＝二つの名のあいだに漢字以外の字が要る。**名を並べただけは結びでは
//     ない**——「木下小一郎長秀」は 小一郎 と 長秀 が地続きで、読者は一つの長い名を読んだだけ
//     （型4 の逐語「一字違いで取りちがえる」がここ）。「小竹あらため 木下小一郎」なら結び。
//
// ⚠️ 機械が見るのは**共起だけ**（institution-audit の「（…）」と同じ精度の割り切り）。
// 離れて共起していれば「別人の二人」としても書けてしまう＝結び方の質は書き手と
// /eval-work の読み通しペルソナの仕事。逆に言えばこの床は「結ぶ機会がその面にあった」しか
// 保証しない。
//
// ⚠️ 名は**手で選ぶリスト**（INSTITUTION_TERMS・PREMISE_MARKERS と同じ）。改名しない主人公は
// 空配列＝その作品は素通りする。新作品の主人公が改名するなら、ここに足してから書く。
import type { Work } from '../../src/engine/types';
import { plainText } from './content-stats';
import { isKanji } from './kanji-grades';
import { workSurfaces, type Surface } from './ruby-audit';

/**
 * 作中で名が変わる人ごとに、呼ばれる名の形をひと組。姓は入れない（姓は家の名で、同名の一族が
 * 本文に出る）。部分文字列で探すので、長い形に含まれる短い形（豊臣秀長→秀長・木下小一郎→
 * 小一郎）は短いほうだけを書く。主人公に限らない——**兄の名が本文と hist で違う**のも同じ型。
 */
export const RENAMED_PEOPLE: Record<string, string[][]> = {
  hidenaga: [
    ['小竹', '小一郎', '長秀', '秀長'],
    ['藤吉郎', '秀吉'], // 兄。本文は「藤吉郎」、hist は「秀吉」で呼んでいた
  ],
  ieyasu: [['竹千代', '元康', '家康']],
  katsu: [['麟太郎', '海舟']],
  // 作中で名が変わる人がいない作品。
  kiyomori: [],
  masako: [],
  davinci: [],
  shibusawa: [],
};

/** 審査して「結ばなくてよい」と決めた名、キーは `作品|名` → 理由。 */
export const ALLOWED_NAME_BREAK: Record<string, string> = {};

export interface NameBreak {
  surface: string;
  /** 前の名と結ばれずに初出した名。 */
  name: string;
  excerpt: string;
  /** その面までに結ばれていた名（読者が持っている名）。 */
  bound: string[];
  allowed?: string;
}

/** 語の出どころ（開始位置）をすべて。 */
function spans(text: string, name: string): number[] {
  const out: number[] = [];
  for (let i = text.indexOf(name); i >= 0; i = text.indexOf(name, i + 1)) out.push(i);
  return out;
}

/** 二つの名のあいだに漢字以外の字があるか＝並べただけでなく、言葉で結んであるか。 */
function linked(text: string, a: string, b: string): boolean {
  for (const i of spans(text, a))
    for (const j of spans(text, b)) {
      const [from, to] = i < j ? [i + a.length, j] : [j + b.length, i];
      if (to > from && [...text.slice(from, to)].some((c) => !isKanji(c))) return true;
    }
  return false;
}

/**
 * 名の鎖が切れた面。読む順に歩き、初出の名がその面に「すでに結ばれた名」を伴わなければ hit。
 * 一つの面で複数の名が同時に初出したときは互いに結ばれたと見る（種の面がこれ）。
 */
export function auditWork(work: Work): NameBreak[] {
  const surfaces = workSurfaces(work);
  return (RENAMED_PEOPLE[work.id] ?? []).flatMap((names) => auditPerson(work, surfaces, names));
}

function auditPerson(work: Work, surfaces: Surface[], names: string[]): NameBreak[] {
  const bound = new Set<string>();
  const breaks: NameBreak[] = [];
  for (const surface of surfaces) {
    const text = surface.parts.map(plainText).join('／');
    const present = names.filter((n) => text.includes(n));
    const fresh = present.filter((n) => !bound.has(n));
    if (fresh.length === 0) continue;
    const anchor = (n: string) => present.some((p) => bound.has(p) && linked(text, n, p));
    if (bound.size > 0)
      for (const name of fresh.filter((n) => !anchor(n))) {
        const at = text.indexOf(name);
        const why = ALLOWED_NAME_BREAK[`${work.id}|${name}`];
        breaks.push({
          surface: surface.id,
          name,
          excerpt: text.slice(Math.max(0, at - 14), at + name.length + 14),
          bound: [...bound],
          ...(why ? { allowed: why } : {}),
        });
      }
    for (const n of fresh) bound.add(n);
  }
  return breaks;
}

/** 使われていない ALLOWED は帳簿の腐り（ゲートが落とす）。 */
export function allowedKeysInUse(works: Work[]): string[] {
  return works.flatMap((w) =>
    auditWork(w)
      .filter((b) => b.allowed)
      .map((b) => `${w.id}|${b.name}`),
  );
}
