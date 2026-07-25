// Clues (CLUES, 7 total, one per chapter — design §3). They thread the overarching riddle "why did
// he finish almost nothing?" through its facets (research §3-8): connecting breeds more questions,
// seeing WAS the work, experiment fights finishing — and the sub-riddle B (史料批判): the "genius
// story" was built AFTER his death, so check where each famous tale comes from (research §3-1).
// Hand-managed.
import type { Clue } from '../../engine/types';

export const CLUES: Record<string, Clue> = {
  'clue-1': { ch: 1, text: 'きみの <ruby>学<rt>まな</rt></ruby>びは 本でなく「見る こと」から 始まった。だから 一つの ことを じっと 見つめると、次の「なぜ？」が 生まれ、また 別の ことへ つながって いく。<b>つなぐ ほど、<ruby>問<rt>と</rt></ruby>いは かえって 増えて いく</b>。' },
  'clue-2': { ch: 2, text: '「師が 筆を 折った」——いかにも いい 話だ。だが、その 話を 語るのは ずっと あとの <ruby>伝記<rt>でんき</rt></ruby>だけ。<b>いい 話ほど、だれが いつ 言ったかを 見る</b>。<ruby>事実<rt>じじつ</rt></ruby>の <ruby>核<rt>かく</rt></ruby>と、盛られた <ruby>尾<rt>お</rt></ruby>ひれは、分けて 手に 持つ。' },
  'clue-3': { ch: 3, text: 'きみが 宮廷に 売り込んだのは、絵より 先に「戦の 道具づくり」。作りかけた 巨大な <ruby>馬<rt>うま</rt></ruby>は、<ruby>青銅<rt>せいどう</rt></ruby>に なる 前に こわれた。<b>手がけた ものが、仕上がる 前に、世の中の ほうが 変わって いく</b>。' },
  'clue-4': { ch: 4, text: 'きみは <ruby>安全<rt>あんぜん</rt></ruby>な やり方より、新しい やり方を ためした。だから『<ruby>最後<rt>さいご</rt></ruby>の <ruby>晩餐<rt>ばんさん</rt></ruby>』は、生きて いる うちから 傷みはじめた。<b>「ためす」ことと「仕上げる」ことは、ときに ぶつかる</b>。' },
  'clue-5': { ch: 5, text: '<ruby>暴君<rt>ぼうくん</rt></ruby>の ための 地図だけは、めずらしく きちんと 仕上げた。<ruby>役<rt>やく</rt></ruby>に 立つ 仕事には、はっきりと「終わり」が ある。<b>だが、きみが「知りたい」と 思った ことには、終わりが 来ない</b>。' },
  'clue-6': { ch: 6, text: '水の うず、鳥の はばたき、心の 中の 血の めぐり——ばらばらに 見た ものが、きみの 頭の 中で 一つに つながって いく。<b>きみにとって「見る こと」が、そのまま 仕事だった</b>。だから 目は、いつまでも 遊んで いられる。' },
  'clue-7': { ch: 7, text: '五千枚の <ruby>手記<rt>しゅき</rt></ruby>は、たがいに つながって「<ruby>完<rt>かん</rt></ruby>」が 来ない。あとの 世が 積み上げた「天才<ruby>伝説<rt>でんせつ</rt></ruby>」を 割り引いて、なお 残る もの——それは、つなぎ<ruby>続<rt>つづ</rt></ruby>けた 一つの 頭。<b>完成しなかったんじゃない。つなぎ続けたんだ</b>。' },
};
