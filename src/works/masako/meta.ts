// Work "masako" (北条政子) constants. Hand-managed skeleton (no legacy extract source).
// Framing text (riddle / strings / hidden / title faces) comes from the design doc
// docs/design/masako.md §1/§2; historical claims trace to docs/research/masako.md by §.
import type { WorkStrings, Hidden } from '../../engine/types';

/** Face-hint shown flag. Namespaced per work. */
export const FACE_HINT_KEY = 'masako_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-masako';

/**
 * The overarching riddle (design §1). A = the human contradiction (mother vs house),
 * carried in the main line; B = whose brush kept her voice, carried by the clues.
 */
export const RIDDLE =
  'きみの 家は、都から 流された 男を <ruby>見張<rt>みは</rt></ruby>る 役だった。その 男を、きみは えらんだ。<ruby>夫<rt>おっと</rt></ruby>が 死に、4人の 子を つぎつぎ 見おくった。ばらばらだった 東の <ruby>武士<rt>ぶし</rt></ruby>たちを ひとつに して、都から 来た 軍を しりぞけた。——ぜんぶ、同じ 人だ。<br>それでも この 人は、父と 弟の 家と ならんで <ruby>鎌倉<rt>かまくら</rt></ruby>を 守りつづけた。なぜ？ そして その <ruby>声<rt>こえ</rt></ruby>は、だれの <ruby>筆<rt>ふで</rt></ruby>で のこったのだろう。';

/** Person id → short label used on the map / figures. */
export const SHORT_NAMES: Record<string, string> = {
  'p-masako': '政子',
  'p-masako@wife': '政子',
  'p-yoritomo': '頼朝',
  'p-tokimasa': '時政',
  'p-yoshitoki': '義時',
  'p-ohime': '大姫',
  'p-yoriie': '頼家',
  'p-sanetomo': '実朝',
  'p-sanman': '三幡',
  'p-kugyo': '公暁',
  'p-kaneko': '兼子',
  'p-gotoba': '後鳥羽',
  'p-yoshimura': '義村',
  'p-yasutoki': '泰時',
  'p-kagemori': '景盛',
  'p-yoshikazu': '能員',
  'p-kagetoki': '景時',
};

/**
 * Chapter → default current location (GAZ key). WRITING 地図書法6: no contested place here.
 * The whole work sits on two points (伊豆・鎌倉) plus 京 — Masako's life barely moves
 * (research §5), which is itself the reason the map is not this work's main device.
 */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'izu',
  2: 'kamakura',
  3: 'kamakura',
  4: 'kamakura',
  5: 'kyoto',
  6: 'kamakura',
  7: 'kamakura',
};

/** Chapter → notebook map caption. */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: '伊豆。流された 人の そばに、北条の 娘が いた。',
  2: '鎌倉。武士の 都が でき、きみは その 御台所に なる。',
  3: '鎌倉。長男・頼家を 将軍の 座から おろす。',
  4: '鎌倉。父・時政が 伊豆へ 去る。残るのは 弟・義時。',
  5: '京。次の 鎌倉殿を、女と 女が 話し合って 決める。',
  6: '鎌倉から 京へ。東の 武士が、西へ 攻めのぼった。',
  7: '鎌倉。政子の 死の あと、武士の 世は 続いていく。',
};

/** Work strings (design §1). */
export const STRINGS: WorkStrings = {
  topbarName: 'まさこ',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: '<ruby>政子<rt>まさこ</rt></ruby>',
  titleSub: '声の のこらなかった 人',
  years: '1157ごろ〜1225',
  riddleLead: '物語をつらぬく謎',
  // ★ 入口のフック（engagement.md §14 型1）。見張る側の家の娘という具体から入り、
  //   この作品の背骨（自筆が一枚も無い）を最後の一行で置く。
  titleHook:
    'この 人が 書いた 文字は、一枚も のこって いない。<br>たしかな <ruby>顔<rt>かお</rt></ruby>の 絵も、一枚も ない。<br>——それでも、<ruby>鎌倉<rt>かまくら</rt></ruby>の <ruby>武士<rt>ぶし</rt></ruby>たちを 動かした ひと声だけが、いまも 伝わって いる。',
  protagonistRuby: '<ruby>政子<rt>まさこ</rt></ruby>',
  riddleHeart:
    '—— 母で ありながら、家を 続ける 人でも あった。<br>その 人が どんな 人だったかは、きみが 決める しかない。',
  titleNote:
    'きみは 北条政子。<br>人生の 分かれ道で、きみなら どうする？',
  homeTitle: '政子 年代記',
  notebookName: '政子手帳',
  notebookLead: 'あつめた ことば・人物、年表、人の 図。',
};

/** Hidden page (unlocked on clearing the final chapter; design §2 終). */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「のこらなかった 声」を 見とどけると、ここが ひらく。',
  badge: '✦ 「北条政子」という 名前に ついて ✦',
  body: `<p>この 人は、生きている あいだ「北条政子」と 呼ばれた ことが 一度も ない。</p>
      <p>「政子」は 1218年、<ruby>位<rt>くらい</rt></ruby>を もらう ときに 記録の うえで 必要に なった 名前で、父・<ruby>時政<rt>ときまさ</rt></ruby>の 一字を もらって つけられた。それまでは「<ruby>御台所<rt>みだいどころ</rt></ruby>」「<ruby>尼御台<rt>あまみだい</rt></ruby>」などと 呼ばれていた。「<ruby>尼将軍<rt>あましょうぐん</rt></ruby>」の 呼び名が たしかめられるのは、ずっと あとの 室町時代の 書きもの からだと される。</p>
      <p>つまり、この 人の 名前は 二つとも、本人が 名のった のでも、そう 呼ばれた のでも ない——他の だれかの 筆で できている。<br>自分の 字を 一枚も 残さなかった 人は、名前まで、ほかの 手に あずけて いた。</p>
      <p class="speak" style="margin-top:14px">それでも、この 人が 動かした ものは 残った。<br>——名前を 決めるのは あとの 世。やった ことを 決めるのは、その 人 自身だ。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手帳だ）',
  incompleteText: 'すべての カードを 集めると、この 巻物は さらに 輝く。',
};
