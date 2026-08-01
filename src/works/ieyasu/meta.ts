// Work "ieyasu" (徳川家康) constants. Hand-managed skeleton (no legacy extract source).
// Framing text (riddle / strings / hidden / title faces) is derived from the GO'd design doc
// docs/design/ieyasu.md; every historical claim traces to docs/research/ieyasu.md by §.
// NOTE (skeleton-2): this Work is registered in src/works/index.ts (work 4) and the 三つ葉葵 crest
// is drawn, but story scenes are still placeholders — the pilot chapter (ch2 三方ヶ原, design §8)
// is authored next and fixes the work's register, then the rest follow one per cycle.
import type { WorkStrings, Hidden } from '../../engine/types';

/** Face-hint shown flag. Namespaced so it never collides with other works. */
export const FACE_HINT_KEY = 'ieyasu_facehint';
export const TOTAL_CHAPTERS = 7;
export const PROTAGONIST_ID = 'p-ieyasu';

/**
 * The overarching riddle (design §1-1): research §6's A案+B案 connection — the 律儀者 who
 * destroyed the house he served longest (A = 人間理解), and who was then made a god by the
 * winners (B = 史料批判). B threads through the clues; A drives the main line.
 */
export const RIDDLE =
  '家来たちが 二つに 割れ、その 多くが きみに 弓を 引いた。いくさに 負けて、<ruby>命<rt>いのち</rt></ruby>からがら 城へ にげ帰った ことも ある。長い あいだ 頭を 下げて きた 家を、さいごは 自分の 手で ほろぼした。——ぜんぶ、同じ 人だ。<br>それなのに この 人は、死んだ あとに「<ruby>神<rt>かみ</rt></ruby>」として まつられた。その「<ruby>神君<rt>しんくん</rt></ruby>」の すがたを <ruby>描<rt>えが</rt></ruby>いたのは だれで、どこまで ほんとうなのだろう？';

/** Person id → short label used on the map / figures. */
export const SHORT_NAMES: Record<string, string> = {
  'p-ieyasu': '家康',
  'p-yoshimoto': '義元',
  'p-nobunaga': '信長',
  'p-shingen': '信玄',
  'p-hideyoshi': '秀吉',
  'p-hanzo': '半蔵',
  'p-masanobu': '正信',
  'p-mitsunari': '三成',
  'p-hideaki': '秀秋',
  'p-yodo': '淀殿',
  'p-hideyori': '秀頼',
  'p-tsukiyama': '築山殿',
  'p-nobuyasu': '信康',
  'p-tenkai': '天海',
};

/**
 * Chapter → default current location (GAZ key). ch1 and ch7 are both 駿府 on purpose: the
 * work's geographic circle (research §5 / design §6) — the boy came here as a hostage and the
 * 天下人 comes back to die here.
 *
 * The convention is the chapter's DEFINING place (ch2=三方ヶ原, ch5=関ヶ原 — the climax, not the
 * opening), and ch3 is the one deliberate exception. It was 'iga', after its title 「伊賀を こえて」,
 * until 2026-07-16: any ch3 scene without a scene map falls back to `{at: chapterPoints[3], cur:1}`
 * (engine/map/sceneMap.ts), i.e. a BARE pin — no label, no note — standing きみ on 伊賀. That is the
 * one claim this chapter refuses to make: which road he took is 諸説, both forks carry 「△」, and
 * 伊賀 is the road that has the NAME rather than the paper. Dormant today (all four ch3 scenes have
 * maps), but a defaults table should not hold a loaded assertion waiting for the next author. 堺 is
 * where the chapter opens, and nobody disputes he was there.
 */
export const CHAPTER_POINTS: Record<string, string> = {
  1: 'sunpu',
  2: 'mikatagahara',
  3: 'sakai',
  4: 'osaka',
  5: 'sekigahara',
  6: 'osaka',
  7: 'sunpu',
};

/** Chapter → notebook world-map caption. Plain text (no ruby): rendered as a caption line. */
export const CHAPTER_CAPTIONS: Record<string, string> = {
  1: '三河・岡崎に 生まれ、六さいで 人質に。駿府で 十一年——「苦しい 人質」だったのか？',
  2: '遠江・三方ヶ原。武田信玄に、生涯 最大の 大敗。逃げ帰った 顔だ という 絵が、いまも 残る。',
  3: '本能寺の 変。堺に いた きみは、敵地を こえて 三河へ——忍者に 守られて、ほんとうに？',
  4: '小牧・長久手で 渡り合った 相手に、頭を 下げる。そして 関東へ——左遷か、栄転か。',
  5: '美濃・関ヶ原。天下 分け目の 一日。あの 裏切りは、ほんとうに あの 時 だったのか。',
  6: '摂津・大坂。いちばん 長く 仕えた 主家を、自分の 手で 終わらせる。',
  7: '駿府で 死に、日光に 神と して まつられる。「神君」の すがたを、きみが 確かめる。',
};

/** Work strings (design §1-1・§3). */
export const STRINGS: WorkStrings = {
  topbarName: 'いえやす',
  eyebrow: 'なりきり歴史アドベンチャー',
  titleMain: '<ruby>徳川<rt>とくがわ</rt></ruby><ruby>家康<rt>いえやす</rt></ruby>',
  // ruby を置けない面ゆえ「主家」を使わず、riddle と同じ言い方に そろえる。
  titleSub: 'つかえた 家を ほろぼし、神に なった 男',
  years: '1543〜1616',
  riddleLead: '物語をつらぬく謎',
  // ★ 入口のフック（engagement.md §14 型1）。読者が知らなくても刺さる具体＝家を出される日。
  titleHook:
    '三つの とき、母が 家から 出された。<br>六つの とき、こんどは きみが 出される——「<ruby>約束<rt>やくそく</rt></ruby>の しるし」として、よその 家へ。<br>——その 子が つくった 世は、260年 つづいた。',
  protagonistRuby: '<ruby>家康<rt>いえやす</rt></ruby>',
  // ★F The 小5 emotional thread beside the abstract riddle. Concrete and bodily: the god was
  // once a man who ran away in terror (ch2 三方ヶ原 = the pilot).
  riddleHeart:
    '—— 「かみさま」に なった 人にも、こわくて にげた 日が あった。<br>その 日から、きみが この人の 一生を 生きて いく。',
  titleNote: 'きみは 徳川家康。<br>人生の 分かれ道で、きみなら どうする？',
  homeTitle: '家康 年代記',
  notebookName: '家康手帳',
  notebookLead: 'あつめた ことば・人物、年表、たしかさマーク。',
};

/** Hidden page (unlocked on clearing the final chapter; design §1-2 の着地). */
export const HIDDEN: Hidden = {
  lockedText: '最後の 章「神に なった 男」を 見とどけると、ここが ひらく。',
  badge: '✦ もしも 家康が 神に まつられなかったら ✦',
  body: `<p><ruby>家康<rt>いえやす</rt></ruby>は 死んだ あと、「<ruby>東照大権現<rt>とうしょうだいごんげん</rt></ruby>」という 神に なった。<ruby>幕府<rt>ばくふ</rt></ruby>は それから 250年 かけて、「<ruby>神君<rt>しんくん</rt></ruby>」の 話を 積み上げて いく。——では もし、家康が 神に まつられなかったら？</p>
      <p>神に ならなければ、しかみ<ruby>像<rt>ぞう</rt></ruby>も <ruby>遺訓<rt>いくん</rt></ruby>も、あれほど ありがたく 語られなかった かもしれない。でも、家康の 名も、いまほど 大きくは 残らなかった だろう。<b>盛りと 名だかさは、うらはら</b>だ。</p>
      <p>もちろん、これは「もしも」。<ruby>歴史<rt>れきし</rt></ruby>に「if」は ない。<br>でも、神君の 話を 割り引いても なお 残る ものが ある——150年 ちかく つづいた <ruby>戦<rt>いくさ</rt></ruby>の 世が、この 男で 終わった、という <ruby>事実<rt>じじつ</rt></ruby>の ように。</p>
      <p class="speak" style="margin-top:14px">神君の すがたは、勝った 側が 大きく 積み上げた。それでも、盛りを 割り引いて なお 残る もの。<br>——それを 確かめるのが、なりきって みる ねうちだ。</p>`,
  completeText: '（全カード コンプリート！ 見事な 手帳だ）',
  incompleteText: 'すべての カードを 集めると、この 巻物は さらに 輝く。',
};
