// Work "katsu" (勝海舟) constants. Hand-managed skeleton (no legacy extract source).
// Framing text (riddle / strings / hidden / title faces) is derived from the vetted design
// doc docs/design/katsu.md; historical claims trace to docs/research/katsu.md.
// NOTE (skeleton): this Work is registered in src/works/index.ts (work 3), but story scenes are
// still placeholders — per-chapter authoring (pilot = ch3, design §9-5) comes next.
import type { WorkStrings, Hidden } from '../../engine/types';

/** Face-hint shown flag. Namespaced so it never collides with other works. */
export const FACE_HINT_KEY = 'katsu_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-katsu';

/**
 * The overarching riddle (design §1-1). ★型1 (engagement.md §14): acts first, question after.
 * 幕府 is glossed on the spot (型3) because the whole riddle turns on him serving it.
 */
export const RIDDLE =
  '<ruby>将軍<rt>しょうぐん</rt></ruby>の <ruby>政府<rt>せいふ</rt></ruby>（<ruby>幕府<rt>ばくふ</rt></ruby>）の 家来だった。日本の 船で <ruby>太平洋<rt>たいへいよう</rt></ruby>を わたる 旅に 出た。せめて きた <ruby>敵<rt>てき</rt></ruby>の <ruby>大将<rt>たいしょう</rt></ruby>と 会って、<ruby>江戸<rt>えど</rt></ruby>の 町を 戦わずに わたした。——ぜんぶ、同じ 人だ。<br>自分の あるじの 世を 終わらせた この 人は、なぜ そう したのだろう？ そして その 手がら話は、だれの 口から のこったのだろう？';

/** Person id → short label used on the map / figures. */
export const SHORT_NAMES: Record<string, string> = {
  'p-katsu': '海舟',
  'p-kokichi': '小吉',
  'p-saigo': '西郷',
  'p-ryoma': '龍馬',
  'p-tesshu': '鉄舟',
  'p-yoshinobu': '慶喜',
  'p-oguri': '小栗',
  'p-fukuzawa': '福澤',
  'p-manjiro': '万次郎',
  'p-shozan': '象山',
  'p-brooke': 'ブルック',
};

/** Chapter → default current location (GAZ key). */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'honjo',
  2: 'dejima',
  3: 'uraga',
  4: 'kobe',
  5: 'edojo',
  6: 'hikawa',
  7: 'hikawa',
};

/** Chapter → notebook world-map caption. */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: '江戸・本所。御目見えは 許されても、実収は 微禄の 貧乏旗本の 子。',
  2: '長崎・出島。世界に ひらく ただ 一つの 窓で、海を まなぶ。',
  3: '品川から 太平洋、サンフランシスコへ——日本の 船が、世界の 海を わたる。',
  4: '神戸・海軍操練所。身分を こえて、脱藩浪士まで 一つの 船に。',
  5: '江戸。戦えば 灰、明けわたせば「裏切り者」——町ぜんぶを かけた 分かれ道。',
  6: '東京・赤坂氷川。「裏切り者」と 呼ばれても、評価は 他人に あずける。',
  7: '氷川の 老人。敵将・西郷を 弔い、語り残した 一生を、きみが 確かめる。',
};

/** Work strings (design §3-4). */
export const STRINGS: WorkStrings = {
  topbarName: 'かつ',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: '<ruby>勝<rt>かつ</rt></ruby><ruby>海舟<rt>かいしゅう</rt></ruby>',
  // ruby を置けない面ゆえ「幕府・幕臣」を使わず、意味の分かる語で書く。
  titleSub: '将軍の 世を 終わらせた、将軍の 家来',
  years: '1823〜1899',
  riddleLead: '物語をつらぬく謎',
  // ★ 入口のフック（engagement.md §14 型1）。貧しい家と父、そして「その話はだれが語ったか」
  //   というこの作品の背骨を、注釈でなく具体の一行で先に見せる。
  titleHook:
    '父は けんかと <ruby>遊<rt>あそ</rt></ruby>びごとばかり。うちは いつも お金が なかった。<br>その 子は、オランダ<ruby>語<rt>ご</rt></ruby>の 分厚い <ruby>辞書<rt>じしょ</rt></ruby>を まる 一年 かけて 手で 書き<ruby>写<rt>うつ</rt></ruby>した——と、年を とって から 自分で 語った。',
  protagonistRuby: '<ruby>海舟<rt>かいしゅう</rt></ruby>',
  riddleHeart:
    '—— <ruby>江戸<rt>えど</rt></ruby>には 百万の 人が 住んで いた。その 町を 焼くか 焼かないかを、ひとりの 家来が 決めようと して いる。<br>きみなら、どうする。',
  titleNote:
    'きみは 勝海舟。<br>人生の 分かれ道で、きみなら どうする？',
  homeTitle: '海舟 年代記',
  notebookName: '海舟手帳',
  notebookLead: 'あつめた ことば・人物、年表、たしかさマーク。',
};

/** Hidden page (unlocked on clearing the final chapter; design §2 終). */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「氷川の 老人」を 見とどけると、ここが ひらく。',
  badge: '✦ もしも 海舟が 自分の 手がらを 一つも 語らなかったら ✦',
  body: `<p>海舟は 晩年、自分の 一生を たっぷり 語り残した。だから「わが 偉業」も 大きく 盛られた。——では もし、海舟が 手がらを 一つも 語らなかったら？</p>
      <p>語らなければ、<ruby>誇張<rt>こちょう</rt></ruby>も 生まれない。でも、生き生きした 幕末の 話も、ずいぶん 残らなかった だろう。<b>盛りと おもしろさは、うらはら</b>だ。</p>
      <p>もちろん、これは「もしも」。歴史に「if」は ない。<br>でも、語りを うたがっても なお 残る ものが ある——江戸が 焼けなかった、という 事実のように。</p>
      <p class="speak" style="margin-top:14px">手がら話は 盛られている。それでも、盛りを 割り引いて なお 残る もの。<br>——それを 確かめるのが、なりきって みる ねうちだ。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手帳だ）',
  incompleteText: 'すべての カードを 集めると、この 巻物は さらに 輝く。',
};
