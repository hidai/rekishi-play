// Clues (CLUES, 7 total, design §4-2). They thread the sub-riddle — "how far can you trust the
// history a person told about himself?" — through one theme: how a self-told story gets made.
// Hand-managed (katsu has no legacy extract source).
import type { Clue } from '../../engine/types';

export const CLUES: Record<string, Clue> = {
  'clue-1': { ch: 1, text: '<ruby>海舟<rt>かいしゅう</rt></ruby>も、その 父も、自分の 一生を あとで たっぷり 語り<ruby>残<rt>のこ</rt></ruby>した 人。この <ruby>親子<rt>おやこ</rt></ruby>の 話は、まず「<ruby>本人<rt>ほんにん</rt></ruby>が 語った」もの——だから おもしろく、だから 少し うたがってみる。' },
  'clue-2': { ch: 2, text: '<ruby>海舟<rt>かいしゅう</rt></ruby>は「<ruby>黒船<rt>くろふね</rt></ruby>を 見て すぐ <ruby>海防<rt>かいぼう</rt></ruby>を 説いた」と 語る。だが <ruby>意見書<rt>いけんしょ</rt></ruby>を 出した 者は 大勢 いた。<b>始まりの 一歩ほど、あとから きれいに <ruby>整<rt>ととの</rt></ruby>えられる</b>。' },
  'clue-3': { ch: 3, text: '<ruby>咸臨丸<rt>かんりんまる</rt></ruby>の 話は、<ruby>本人<rt>ほんにん</rt></ruby>が いちばん 大きく 語った <ruby>手柄<rt>てがら</rt></ruby>。だが <ruby>記録<rt>きろく</rt></ruby>は ちがう 姿を 見せる。<b>"わが <ruby>偉業<rt>いぎょう</rt></ruby>"ほど、確かめる ねうちが ある</b>。' },
  'clue-4': { ch: 4, text: '<ruby>龍馬<rt>りょうま</rt></ruby>との <ruby>出会<rt>であ</rt></ruby>いは、<ruby>本人<rt>ほんにん</rt></ruby>が <ruby>劇的<rt>げきてき</rt></ruby>に 語った もの。<ruby>手柄<rt>てがら</rt></ruby>も 出会いも、語る うちに <ruby>物語<rt>ものがたり</rt></ruby>に なる。——それでも、龍馬が 慕った ことは、龍馬 自身の <ruby>手紙<rt>てがみ</rt></ruby>が 証している。' },
  'clue-5': { ch: 5, text: '<ruby>無血開城<rt>むけつかいじょう</rt></ruby>は、<ruby>海舟<rt>かいしゅう</rt></ruby>・<ruby>山岡<rt>やまおか</rt></ruby>・<ruby>西郷<rt>さいごう</rt></ruby>・大奥……<b>大勢の 手</b>で 成った。だが 語り<ruby>継<rt>つ</rt></ruby>がれる ときは、それぞれの <ruby>陣営<rt>じんえい</rt></ruby>が「自分の 手柄」として 語る。' },
  'clue-6': { ch: 6, text: '<ruby>海舟<rt>かいしゅう</rt></ruby>は「<ruby>裏切<rt>うらぎ</rt></ruby>り者」とも「<ruby>恩人<rt>おんじん</rt></ruby>」とも 呼ばれた。<b><ruby>評価<rt>ひょうか</rt></ruby>は、下す 人の 立場で 変わる</b>。<ruby>歴史<rt>れきし</rt></ruby>を 読む ときは、"だれが そう 言ったか"まで 見る。' },
  'clue-7': { ch: 7, text: '<ruby>本人<rt>ほんにん</rt></ruby>談は 大きく <ruby>盛<rt>も</rt></ruby>られている。だが、<ruby>江戸<rt>えど</rt></ruby>が 焼けなかったのは <ruby>事実<rt>じじつ</rt></ruby>。<b>盛りを 割り引いて なお 残る もの</b>——それを 確かめるのが、なりきりの ねうちだ。' },
};
