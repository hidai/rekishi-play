// Work "davinci" (レオナルド・ダ・ヴィンチ) constants. Hand-managed skeleton (no legacy extract
// source). Framing text (riddle / strings / hidden / title) derives from the GO'd design doc
// docs/design/davinci.md; every historical claim traces to docs/research/davinci.md by §.
// SHIPPED: all 7 chapters are written, so this Work is registered in src/works/index.ts (WORKS) and
// src/works/registry.ts (the app's lazy entry). The register was fixed by the ch6 pilot
// (design §7 / WRITING 10 パイロットシーン制) before the remaining chapters were mass-produced.
// FIRST OVERSEAS WORK: the map stages on GEO_EUROPE (Italy + southern France), not the shared
// Japan GEO — see ./map.ts.
import type { WorkStrings, Hidden } from '../../engine/types';

/** Face-hint shown flag. Namespaced so it never collides with other works. */
export const FACE_HINT_KEY = 'davinci_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-leonardo';

/**
 * The overarching riddle (design §3 / research §6). Strand A (drives the main line): why did the
 * man who could do anything finish almost nothing? Strand B (threads the clues): the "genius
 * Leonardo" we know was assembled AFTER his death by an admiring biographer (Vasari) — how far can
 * you trust it? Same 史料批判 器 as ieyasu's 神君 and katsu's 本人談.
 */
export const RIDDLE =
  '空を とぶ <ruby>機械<rt>きかい</rt></ruby>を 考えた。人の からだを 切りひらいて、中の しくみを <ruby>描<rt>えが</rt></ruby>いた。一枚の 絵を 十年 いじょう 持ち歩いて、それでも「できた」と 言わなかった。——ぜんぶ、同じ 人だ。<br>手がけた ものの ほとんどを、この 人は 仕上げなかった。なぜ？ そして、いま 語られる「<ruby>天才<rt>てんさい</rt></ruby>レオナルド」の 話は、だれが 作った ものなのだろう？';

/** Person id → short label used on the map / figures. */
export const SHORT_NAMES: Record<string, string> = {
  'p-leonardo': 'レオナルド',
  'p-verrocchio': '師ヴェロッキオ',
  'p-ludovico': 'スフォルツァ',
  'p-cesare': 'ボルジア',
  'p-giuliano': 'メディチ',
  'p-francois': 'フランス王',
  'p-michelangelo': 'ミケランジェロ',
  'p-salai': 'サライ',
  'p-melzi': 'メルツィ',
};

/**
 * Chapter → default current location (GAZ key). davinci's life has no 帰る円環 (unlike ieyasu's
 * 駿府): it is a one-way journey court to court, ending in France (design §2 / research §5-1). All
 * points are 係争に触れない都市中心 (WRITING 地図書法6): the era's borders were fluid city-states.
 */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'vinci',
  2: 'firenze',
  3: 'milano',
  4: 'milano',
  5: 'imola',
  6: 'firenze',
  7: 'amboise',
};

/** Chapter → world-map caption. Plain text (no ruby): rendered as a caption line. */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: 'トスカーナの ヴィンチ村に 生まれた 私生児。本で 習うより、自分の 目で 世界を じっと 見つめた。',
  2: 'フィレンツェの 工房で 学ぶ。師の 絵に 天使を ひとり 描き足した——と、あとの 世は 語る。',
  3: 'ミラノへ。「絵が うまい」でなく「戦の 道具が 作れる」と 売り込んだ 手紙が 残る。',
  4: 'ミラノの 壁に『最後の 晩餐』を 描く。だが 新しい やり方の せいで、すぐに 傷みはじめた。',
  5: '暴君チェーザレ・ボルジアの 軍師に。その 手で、真上から 見た イモラの 精密な 地図を 描いた。',
  6: '『モナ・リザ』を 描き、いっぽうで 死体を 切り開いて、体の 中の しくみを 写す。',
  7: 'アルプスを こえ、フランスの 王に 招かれて 死ぬ。あとに 残ったのは、五千枚の 手記。',
};

/** Work strings (design §3). */
export const STRINGS: WorkStrings = {
  topbarName: 'レオナルド',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: 'レオナルド・ダ・ヴィンチ',
  titleSub: '仕上げなかった 天才の なぞ',
  years: '1452〜1519',
  riddleLead: '物語をつらぬく謎',
  // ★ 入口のフック（engagement.md §14 型1）。学校に入れない子と、鏡文字のノート＝知識ゼロで
  //   刺さる具体（研究 §3・§3-5 の ◎ だけで組む）。
  titleHook:
    '学校には 入れて もらえなかった。父の 仕事も つげない 子どもだった。<br>かわりに、川の <ruby>流<rt>なが</rt></ruby>れと 鳥の <ruby>羽<rt>はね</rt></ruby>を、一日じゅう 見つめて いた。<br>——その ノートの 文字は、<ruby>鏡<rt>かがみ</rt></ruby>に うつした ように 左右 さかさまだ。',
  protagonistRuby: 'レオナルド',
  // The 小5 emotional thread beside the abstract riddle. Concrete and bodily: everything came from
  // one head that trusted its own eyes.
  riddleHeart:
    '—— 一枚の 絵も、空を とぶ 夢も、ぜんぶ ひとりの 頭と 手から 生まれた。<br>その 目で 世界を 見た 一生を、きみが 生きて いく。',
  titleNote: 'きみは レオナルド・ダ・ヴィンチ。<br>人生の 分かれ道で、きみなら どうする？',
  homeTitle: 'レオナルド 年代記',
  notebookName: 'レオナルド手記',
  notebookLead: 'あつめた ことば・人物、年表、確度の たしかさマーク。',
};

/** Hidden page (unlocked on clearing the final chapter; design §6 の反転 ＋ §7 隠しページ). */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「フランス、最期」を 見とどけると、ここが ひらく。',
  badge: '✦ もし ノートが ぜんぶ 実現していたら ✦',
  body: `<p><ruby>手記<rt>しゅき</rt></ruby>には、空を とぶ 機械、川を 変える <ruby>水路<rt>すいろ</rt></ruby>、体の 中の しくみ、真上から 見た <ruby>地図<rt>ちず</rt></ruby>——「まだ この 世に 無い もの」が 五千枚。もし その ぜんぶが、生きて いる うちに かたちに なって いたら？</p>
      <p>飛行機は 四百年 早く 空を とび、人体の <ruby>医学<rt>いがく</rt></ruby>は 何百年 進んで いた かもしれない。——でも、それは「もしも」。<ruby>歴史<rt>れきし</rt></ruby>に「if」は ない。<br>じっさいの きみは、その 多くを、途中で 止めた。</p>
      <p>それを「<ruby>失敗<rt>しっぱい</rt></ruby>」と 呼ぶ 人も いる。だが、きみの <ruby>手記<rt>しゅき</rt></ruby>は 一枚も 「これで <ruby>完成<rt>かんせい</rt></ruby>」で 終わって いない。飛ぶ ことは 水の <ruby>流<rt>なが</rt></ruby>れに つながり、水は 血の めぐりに つながり——どこまでも つながって、止まる 場所が 無かった。</p>
      <p class="speak" style="margin-top:14px"><ruby>完成<rt>かんせい</rt></ruby>させなかったんじゃない。つなぎ<ruby>続<rt>つづ</rt></ruby>けたんだ。<br>——それに 気づくのが、なりきって みる ねうちだ。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手記だ）',
  incompleteText: 'すべての カードを 集めると、この 手記は さらに 輝く。',
};
