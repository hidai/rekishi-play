// 作品「ひでなが」固有の定数。旧 index.html でエンジンに散在していた秀長固有値を集約。
// 逐語移植した文字列に加え、エンジン汎用化で作品側へ降ろした新規文言
//（titleHook / protagonistRuby 等）も、ここで手書き管理する。
import type { WorkStrings, Hidden } from '../../engine/types';

// 貫通する謎。The riddle used to ask why 秀長 is missing from a textbook — an absence a
// 10-year-old cannot perceive (docs/design/known-premise.md) — and then leaned on 信長・秀吉
// being faces the reader already knows. 型1 (engagement.md §14) killed that assumption: the
// riddle now lays three ACTS of one life side by side before it asks anything.
export const RIDDLE =
  '<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子として、田を たがやして いた。何万の <ruby>兵<rt>へい</rt></ruby>の めしと 道を ととのえて、兄の いくさを ささえた。<ruby>大和<rt>やまと</rt></ruby>（今の 奈良）ぜんたいを あずかる 身に なった。——ぜんぶ、同じ 人だ。<br>その 兄は 天下を とり、名を のこした。すぐ そばに いた この 人の 名は、のこらなかった。なぜ？';

/** 顔があるがカードに無い人物の表示名（旧 PEOPLE_EXTRA, legacy 1241）。 */
export const PEOPLE_EXTRA: Record<string, string> = {
  'p-mitsuhide': '明智光秀',
  'p-katsuie': '柴田勝家',
};

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
  // ruby を置けない面（プレーン文字列）ゆえ、教育漢字だけで書く（ruby-audit ヘッダ）。
  // 「天下」はこの作品ぜんたいの背骨になる語なので、読者が最初に会うここで一句そえる
  //（WRITING 13。以後の章は裸で使える）。
  titleSub: '天下（日本 ぜんぶ）を とった 兄を、すぐ そばで ささえた 弟',
  years: '1540ごろ〜1591',
  riddleLead: '物語をつらぬく謎',
  // ★ 入口のフック（engagement.md §14 型1）。知ってる顔を並べる装置を廃した代わりに、
  //   知識ゼロで刺さる具体＝「兄が村に帰ってきた日」を入口の主役に置く。
  titleHook:
    'ある日、村を 出て いった 兄が 帰って きて、きみの <ruby>肩<rt>かた</rt></ruby>を つかんだ。<br>「おれと 来い。<ruby>侍<rt>さむらい</rt></ruby>に ならんか」<br>——<ruby>田<rt>た</rt></ruby>んぼの まん中で、きみは 返事を する。',
  protagonistRuby: '<ruby>秀長<rt>ひでなが</rt></ruby>',
  riddleHeart:
    '—— こんなに 兄を 支えた 弟のこと、ちゃんと 分かって もらえるのかな？<br>その 答えは、きみが いちばん 近くで 見つけて いく。',
  titleNote:
    'きみは <ruby>木下<rt>きのした</rt></ruby><ruby>小一郎<rt>こいちろう</rt></ruby>——のちの <ruby>豊臣秀長<rt>とよとみ ひでなが</rt></ruby>。<br>人生の 分かれ道で、きみなら どうする？',
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
