// 手がかり（CLUES）。もとは legacy/index.html からの逐語抽出だったが、抽出パイプライン
// （旧 scripts/extract-data.mjs）を廃し、faces/map/story と同じく手書き管理へ移行した。
/* eslint-disable */

import type { Clue } from '../../engine/types';

export const CLUES: Record<string, Clue> = {
  'clue-1':{ ch:1, text:'<ruby>秀長<rt>ひでなが</rt></ruby>は、父が だれかも はっきり しない——最初から「<ruby>表<rt>おもて</rt></ruby>に 記録されにくい」場所に 立っていた。' },
  'clue-2':{ ch:2, text:'<ruby>手柄<rt>てがら</rt></ruby>は 前線の 武将のもの。<ruby>兵糧<rt>ひょうろう</rt></ruby>や <ruby>段<rt>だん</rt></ruby><ruby>取<rt>ど</rt></ruby>りといった <ruby>裏方<rt>うらかた</rt></ruby>の 働きは、物語や 記録に 残りにくい。' },
  'clue-3':{ ch:3, text:'土地を 治め、人を なだめる 地味な 仕事は、<ruby>派手<rt>はで</rt></ruby>な <ruby>合戦<rt>かっせん</rt></ruby>のように 「事件」として 語られない。' },
  'clue-4':{ ch:4, text:'勝利を 支えたのは 後方の <ruby>兵站<rt>へいたん</rt></ruby>。だが 名が 前に 出るのは、いつも <ruby>突撃<rt>とつげき</rt></ruby>する 者のほう。' },
  'clue-5':{ ch:5, text:'<ruby>総大将<rt>そうだいしょう</rt></ruby>でも、「戦わずに まとめた」<ruby>交渉<rt>こうしょう</rt></ruby>は、<ruby>劇的<rt>げきてき</rt></ruby>な <ruby>討死<rt>うちじに</rt></ruby>や <ruby>逆転劇<rt>ぎゃくてんげき</rt></ruby>より ずっと 語られにくい。' },
  'clue-6':{ ch:6, text:'<ruby>政権<rt>せいけん</rt></ruby>の かなめを 静かに <ruby>担<rt>にな</rt></ruby>うほど、<ruby>表<rt>おもて</rt></ruby>の 歴史からは こぼれ落ちる。「<ruby>内々<rt>ないない</rt></ruby>の<ruby>儀<rt>ぎ</rt></ruby>は<ruby>宗易<rt>そうえき</rt></ruby>に、<ruby>公儀<rt>こうぎ</rt></ruby>の事は<ruby>宰相<rt>さいしょう</rt></ruby>に」。' },
  'clue-7':{ ch:7, text:'兄より 先に 死んだ。<ruby>天下人<rt>てんかびと</rt></ruby>の 物語の「主役」に なる前に 退場し、死後に すべてが <ruby>崩<rt>くず</rt></ruby>れた。' },
};
