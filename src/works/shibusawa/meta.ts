// Work "shibusawa" (渋沢栄一) constants. Hand-managed skeleton (no legacy extract source).
// Framing text (riddle / strings / hidden / title faces) comes from the design doc
// docs/design/shibusawa.md §1/§0; historical claims trace to docs/research/shibusawa.md by §.
import type { WorkStrings, Hidden } from '../../engine/types';

/** Face-hint shown flag. Namespaced per work. */
export const FACE_HINT_KEY = 'shibusawa_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-eiichi';

/**
 * The overarching riddle (design §1). A = the human contradiction (changed sides again and again
 * — what stayed the same?), carried in the main line; B = why he never built his own zaibatsu,
 * carried by the clues. The two knot together on 論語＝道徳 (design §1).
 */
/**
 * ★ 行為の並置型に書き換え（docs/design/engagement.md §2 A-1）。もとは「なぜ〜なのに〜？」
 * ＝評判の逆説型で、その人を既に知っている読者への問いだった。初見の小5には、まず**行為**を
 * 三つ並べて「ぜんぶ同じ人だ」と示してから問う。制度語（財閥）は主線から外し card / clue へ。
 */
export const RIDDLE =
  '<ruby>横浜<rt>よこはま</rt></ruby>の <ruby>外国人<rt>がいこくじん</rt></ruby>を 焼こうと した。<ruby>将軍<rt>しょうぐん</rt></ruby>に つかえた。その 将軍を たおした 国の <ruby>役人<rt>やくにん</rt></ruby>に なった。——ぜんぶ、同じ 人だ。<br>なんども <ruby>立場<rt>たちば</rt></ruby>を 変えた この 人が、変えなかった ものは 何だろう？ そして この 人は、<ruby>日本一<rt>にっぽんいち</rt></ruby>の <ruby>金持<rt>かねも</rt></ruby>ちに なれた はずなのに、そう しなかった。なぜ？';

/** Person id → short label used on the map / figures. */
export const SHORT_NAMES: Record<string, string> = {
  'p-eiichi': '栄一',
  'p-eiichi@young': '栄一',
  'p-eiichi@prime': '栄一',
  'p-junchu': '惇忠',
  'p-choshichiro': '長七郎',
  'p-ichiroemon': '父',
  'p-kisaku': '喜作',
  'p-yoshinobu': '慶喜',
  'p-akitake': '昭武',
  'p-hiraoka': '円四郎',
  'p-okuma': '大隈',
  'p-inoue': '井上',
  'p-okubo': '大久保',
  'p-yataro': '岩崎',
};

/**
 * Chapter → default current location (GAZ key). WRITING 地図書法6: no contested place here — the
 * bare cur pin falls back to these until each chapter's scene map lands. ch3 (Paris) points at
 * 横浜, the port he sailed from, because the notebook stage is Japan and Paris cannot be pinned on
 * it; the chapter's own map (3-b) stages itself on GEOS.europe instead (map.ts).
 */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'chiharajima',
  2: 'kyoto',
  3: 'yokohama',
  4: 'tokyo',
  5: 'tokyo',
  6: 'tokyo',
  7: 'tokyo',
};

/** Chapter → notebook map caption. */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: '<ruby>血洗島<rt>ちあらいじま</rt></ruby>。<ruby>藍<rt>あい</rt></ruby>の 家の 子が、横浜を 焼こうと している。',
  2: '<ruby>京<rt>きょう</rt></ruby>。<ruby>攘夷<rt>じょうい</rt></ruby>の 志士が、一橋の <ruby>殿<rt>との</rt></ruby>に つかえる ことに なる。',
  3: 'パリ。<ruby>銀行<rt>ぎんこう</rt></ruby>と <ruby>鉄道<rt>てつどう</rt></ruby>を 見て いる あいだに、帰る 国が 消える。',
  4: '<ruby>東京<rt>とうきょう</rt></ruby>。<ruby>役人<rt>やくにん</rt></ruby>の 椅子を、自分で おりる。',
  5: '<ruby>隅田川<rt>すみだがわ</rt></ruby>の 舟の 上。<ruby>独占<rt>どくせん</rt></ruby>か、みんなでか。',
  6: '東京。二十年 だまって いた 人が、やっと 口を ひらく。',
  7: '東京。この 人の 顔が、一万円札に なる。',
};

/** Work strings (design §1). */
export const STRINGS: WorkStrings = {
  topbarName: 'えいいち',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: '<ruby>栄一<rt>えいいち</rt></ruby>',
  titleSub: '一万円札に なった 男',
  years: '1840〜1931',
  riddleLead: '物語をつらぬく謎',
  // ★ 入口のフック（engagement.md §2 A-2）。いちばん強い具体が顔タップのトーストに
  //   埋まっていたので、タイトル画面の主役に引き上げた。
  titleHook:
    // 年齢は「十七」だけにする（代官所は数え、1863年は満＝二つ並べると数え方が混ざる）。
    '十七の とき、「<ruby>百姓<rt>ひゃくしょう</rt></ruby>の くせに」と 笑われた。<br>やがて、<ruby>横浜<rt>よこはま</rt></ruby>を 焼く 計画を 立てた。<br>——その 顔が いま、一万円札に なっている。',
  protagonistRuby: '<ruby>渋沢栄一<rt>しぶさわ えいいち</rt></ruby>',
  riddleHeart:
    '—— 立場は 何度も 変わった。<ruby>芯<rt>しん</rt></ruby>は、変わらなかったのか。<br>この 人が どんな 人だったかは、きみが 決める しかない。',
  titleNote:
    'きみは <ruby>渋沢栄一<rt>しぶさわ えいいち</rt></ruby>。<br>人生の 分かれ道で、きみなら どうする？',
  homeTitle: '栄一 年代記',
  notebookName: '栄一手帳',
  notebookLead: 'あつめた ことば・人物、年表、人の 図。',
};

/** Hidden page (unlocked on clearing the final chapter; design §1 終 / §3-6). */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「一万円札の 顔」を 見とどけると、ここが ひらく。',
  badge: '✦ 「日本資本主義の 父」という 呼び名に ついて ✦',
  body: `<p>「<ruby>日本資本主義<rt>にほんしほんしゅぎ</rt></ruby>の 父」——<ruby>渋沢栄一<rt>しぶさわえいいち</rt></ruby>を 語る とき、いつも つく この 言葉は、本人が 名のった ものでは ない。<ruby>亡<rt>な</rt></ruby>くなった あとに、この 人を <ruby>敬<rt>うやま</rt></ruby>う 人々が つけた <ruby>呼<rt>よ</rt></ruby>び名だ。</p>
      <p>「<ruby>約<rt>やく</rt></ruby>500の 会社」も、じつは 数え方で 大きく 動く。ちゃんと 調べると、はっきり 関わったと 言えるのは それより 少ない。「500」という 数字 じたいが、あとの 人が「父」に <ruby>積<rt>つ</rt></ruby>み上げた <ruby>顕彰<rt>けんしょう</rt></ruby>（ほめたたえ）でも あるのだ。</p>
      <p>そして 2024年、この 人の 顔は 一万円札に なった。<ruby>国<rt>くに</rt></ruby>が、渋沢栄一を「日本の 顔」に <ruby>選<rt>えら</rt></ruby>んだ ということだ。<br>——では、その「<ruby>像<rt>ぞう</rt></ruby>」を つくったのは、だれだろう。本人か。ほめる 人か。国か。</p>
      <p class="speak" style="margin-top:14px">この 人は 聖人でも 悪人でも ない。<br>——像を つくるのは、だれかが えらぶから。それを 見た きみが、どう 思うか だ。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手帳だ）',
  incompleteText: 'すべての カードを 集めると、この 巻物は さらに 輝く。',
};
