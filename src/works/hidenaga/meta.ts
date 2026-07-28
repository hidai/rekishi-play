// 作品「ひでなが」固有の定数。旧 index.html でエンジンに散在していた秀長固有値を集約。
// 逐語移植した文字列に加え、エンジン汎用化で作品側へ降ろした新規文言
//（titleKnownFaces / titleHeroTease / protagonistRuby 等）も、ここで手書き管理する。
import type { WorkStrings, Hidden } from '../../engine/types';

// 貫通する謎。The riddle used to ask why 秀長 is missing from a textbook — an absence a
// 10-year-old cannot perceive (docs/design/known-premise.md). It now points at the two faces
// the title screen just handed the reader (titleKnownFaces), so the premise is worn, not assumed.
export const RIDDLE =
  'なぜ、天下人の 実の 弟で、大和100万石の 大大名 だったのに——信長や 秀吉の 名は のこり、秀長の 名は のこらなかったのだろう？';

/** 顔があるがカードに無い人物の表示名（旧 PEOPLE_EXTRA, legacy 1241）。 */
export const PEOPLE_EXTRA: Record<string, string> = {
  'p-mitsuhide': '明智光秀',
  'p-katsuie': '柴田勝家',
};

/**
 * ★6 タイトル「見せてから問う」の顔ならべ：知ってる顔 → 主人公の順。
 * タップで人物カードが開く（エンジン汎用。Work.titleKnownFaces）。
 */
export const TITLE_KNOWN_FACES = ['p-nobunaga', 'p-hideyoshi'];

/** 章 → 既定の現在地 GAZ キー（旧 CH_PT, legacy 1578）。 */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'nakamura',
  2: 'sunomata',
  3: 'takeda',
  4: 'takamatsu',
  5: 'awa',
  6: 'koriyama',
  7: 'koriyama',
};

/** 人物 id → 地図用略称（旧 SHORT, legacy 1700）。 */
export const SHORT_NAMES: Record<string, string> = {
  'p-hideyoshi': '秀吉',
  'p-naka': 'なか',
  'p-nobunaga': '信長',
  'p-takatora': '高虎',
  'p-motochika': '元親',
  'p-yoshihisa': '義久',
  'p-rikyu': '利休',
  'p-sorin': '宗麟',
  'p-hidetsugu': '秀次',
  'p-hidenaga': '秀長',
  'p-mitsuhide': '光秀',
  'p-katsuie': '勝家',
};

/** 章 → 手帳「進軍の地図」キャプション（旧 capText, legacy 1991-1993）。 */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: '尾張 ひとつ から 始まった。',
  2: '美濃・近江へ——織田の 勢いが 広がる。',
  3: '但馬・播磨。秀長、はじめての 領国（金の ふち）。',
  4: '本能寺の変。金の 織田 から 藍の 羽柴 へ。中国大返しで 山崎へ！',
  5: '四国・九州を 平定。西日本が 一気に 豊臣色に。',
  6: '大和100万石。天下は ほぼ ひとつに。',
};

/** 顔ヒント表示済みフラグ。 */
export const FACE_HINT_KEY = 'hd_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-hidenaga';
// Faction phases (oda→toyo at ch4) and route reveals now live in map.ts
// (FACTION_PHASES / CAMPAIGN_ROUTES) as WorkMap data.

/** 作品文言（legacy body 603-680 より逐語）。 */
export const STRINGS: WorkStrings = {
  topbarName: 'ひでなが',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: '<ruby>秀長<rt>ひでなが</rt></ruby>',
  titleSub: '天下人の弟、日本一の補佐役',
  years: '1540ごろ〜1591',
  riddleLead: '物語をつらぬく謎',
  titleHeroTease:
    'そう、この人。豊臣秀長。いま ならんだ ふたりの すぐ そばに いたのに、この人の 名前だけ のこらなかった。なぜ？ → はじめて みよう',
  protagonistRuby: '<ruby>秀長<rt>ひでなが</rt></ruby>',
  riddleHeart:
    '—— こんなに 兄を 支えた 弟のこと、ちゃんと 分かって もらえるのかな？<br>その 答えは、きみが いちばん 近くで 見つけて いく。',
  titleNote:
    'きみは羽柴小一郎——のちの豊臣秀長。<br>人生の分かれ道で、きみならどうする？',
  homeTitle: 'ひでなが 年代記',
  notebookName: 'ひでなが手帳',
  notebookLead: 'あつめた ことば・人物、年表、進軍の地図。',
};

/** 隠しページ（旧 renderHidden, legacy body 2039-2050 より逐語）。 */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「兄より先に死んだ弟」を 見とどけると、ここが ひらく。',
  badge: '✦ もしも 秀長が 生きて いたら ✦',
  body: `<p><ruby>秀長<rt>ひでなが</rt></ruby>が あと 10年 生きて いたら、歴史は どう 変わって いた だろう。</p>
      <p><ruby>利休<rt>りきゅう</rt></ruby>は <ruby>切腹<rt>せっぷく</rt></ruby>せずに すんだかも しれない。<ruby>秀次<rt>ひでつぐ</rt></ruby>は 死なずに すんだかも しれない。<ruby>無謀<rt>むぼう</rt></ruby>な <ruby>朝鮮出兵<rt>ちょうせんしゅっぺい</rt></ruby>は、弟の ひと言で 止まったかも しれない。<ruby>関ヶ原<rt>せきがはら</rt></ruby>も、<ruby>大坂<rt>おおさか</rt></ruby>の<ruby>陣<rt>じん</rt></ruby>も——。</p>
      <p>もちろん、これは「もしも」。歴史に「if」は ない。<br>でも、ひとりの <ruby>補佐役<rt>ほさやく</rt></ruby>の 存在が どれほど 大きかったかを、この「if」は 教えて くれる。</p>
      <p class="speak" style="margin-top:14px">記録に 残らない 仕事こそ、世界を 静かに 支えて いる。<br>——それが、秀長が きみに <ruby>遺<rt>のこ</rt></ruby>した 答えだ。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手帳だ）',
  incompleteText: 'すべての カードを 集めると、この 巻物は さらに 輝く。',
};
