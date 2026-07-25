// Work "kiyomori" (平清盛) constants. Hand-managed skeleton (no legacy extract source).
// Framing text (riddle / strings / hidden / title faces) is derived from the vetted
// design doc docs/design/kiyomori.md; historical claims trace to docs/research/kiyomori.md.
import type { WorkStrings, Hidden } from '../../engine/types';

/** Face-hint shown flag. Namespaced so it never collides with hidenaga's 'hd_facehint'. */
export const FACE_HINT_KEY = 'kiyomori_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-kiyomori';

/** The overarching riddle (design §1-1). */
export const RIDDLE =
  'なぜ、<ruby>清盛<rt>きよもり</rt></ruby>は「おごれる 悪人」として 語りつがれたのだろう？——<ruby>武士<rt>ぶし</rt></ruby>で はじめて 天下の てっぺんに 立ち、海の 道まで ひらいた 男なのに。';

/**
 * ★6 Title "show, then ask": known faces → protagonist (design §3-4).
 * Kiyomori is a *known* protagonist, so we place the Genpei "winners" (Yoshitsune,
 * Yoritomo) as the known faces and ask "was he really an evil man?" over Kiyomori's own
 * face — inverting the device's meaning versus work 1's unknown hero.
 */
export const TITLE_KNOWN_FACES = ['p-yoshitsune', 'p-yoritomo'];

/** Person id → short label used on the map. */
export const SHORT_NAMES: Record<string, string> = {
  'p-kiyomori': '清盛',
  'p-tadamori': '忠盛',
  'p-tokiko': '時子',
  'p-tokiko@old': '時子',
  'p-shigemori': '重盛',
  'p-tokuko': '徳子',
  'p-goshirakawa': '後白河',
  'p-sutoku': '崇徳',
  'p-takakura': '高倉',
  'p-antoku': '安徳',
  'p-yoshitomo': '義朝',
  'p-yoritomo': '頼朝',
  'p-shunkan': '俊寛',
  'p-mochihito': '以仁王',
  'p-tomomori': '知盛',
  'p-yoshitsune': '義経',
};

/** Chapter → default current location (GAZ key). */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'ise',
  2: 'rokuhara',
  3: 'rokuhara',
  4: 'owada',
  5: 'rokuhara',
  6: 'fukuhara',
  7: 'rokuhara',
};

/** Chapter → notebook "sea-road map" caption. */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: '伊勢の 海から。「刀より 船」の 一族に 生まれた。',
  2: '京。保元・平治の 乱を 勝ちぬき、武門の 第一人者へ。',
  3: '六波羅。武士 はじめての 太政大臣。貴族の 頂へ のぼる。',
  4: '大輪田泊から 厳島・博多、そして 海の むこうの 宋へ——海の 道をひらく。',
  5: '京。「おごり」と 呼ばれ、後白河法皇との 対立が 深まる。',
  6: '福原。海の そばへ、都を 動かそうとする。',
  7: '熱病、そして 壇ノ浦——「海に 始まり 海に 終わる」平家。',
};

/** Work strings (design §3-4). */
export const STRINGS: WorkStrings = {
  topbarName: 'きよもり',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: '<ruby>清盛<rt>きよもり</rt></ruby>',
  titleSub: '海の 道を ひらいた「悪役」',
  years: '1118ごろ〜1181',
  riddleLead: '物語をつらぬく謎',
  titleHeroTease:
    'そう、平清盛。きみが よく 知ってる『おごれる 悪人』。本当に そうだったのか、なりきって 確かめよう → はじめて みよう',
  protagonistRuby: '<ruby>清盛<rt>きよもり</rt></ruby>',
  riddleHeart:
    '—— "悪い やつ"って、ほんとうに そうなのかな？<br>その 答えは、きみが いちばん 近くで 見つけて いく。',
  titleNote:
    'きみは 平清盛。<br>人生の 分かれ道で、きみなら どうする？',
  homeTitle: '清盛 年代記',
  notebookName: '清盛手帳',
  notebookLead: 'あつめた ことば・人物、年表、海の 道の 地図。',
};

/** Hidden page (unlocked on clearing the final chapter; design §2 終). */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「熱病、そして その後の 物語」を 見とどけると、ここが ひらく。',
  badge: '✦ もしも 清盛が あと 10年 生きて いたら ✦',
  body: `<p>清盛が あと 10年 生きて いたら、歴史は どう 変わって いた だろう。</p>
      <p>平家は 壇ノ浦で 滅びずに すんだかも しれない。海の 道は、もっと 続いて いたかも しれない。それとも、やはり 同じように 滅んで いった だろうか——。</p>
      <p>もちろん、これは「もしも」。歴史に「if」は ない。<br>でも、"悪役"の ひと言では 片づかない 男が いたことを、この「if」は 教えて くれる。</p>
      <p class="speak" style="margin-top:14px">悪役の 物語も、先駆者の 見直しも、どちらも 後の 世が 作った 像。<br>——本当の 清盛は、その 間で、いまも 揺れ 続けて いる。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手帳だ）',
  incompleteText: 'すべての カードを 集めると、この 巻物は さらに 輝く。',
};
