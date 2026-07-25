// Story data (STORY) — skeleton. Stands up all 7 chapter containers from design §2
// (id/num/title/years/lead/start/teaser); each chapter body is a single 「準備中」 placeholder scene.
// Real text lands in the per-chapter writing phase (one task each + /eval-work), starting with the
// PILOT = 章五「舟の うえ」(design §8 / WRITING 10 パイロットシーン制): B の頂点（独占を 自分で 選ばない）
// ＋ 史料批判の 最良の実例（本人は 穏当に 語ったのに 伝記文学が 劇に した＝§3-1）＋ 敵に 声を 与える
// 最難所（岩崎＝もう一つの正解）＝register の 較正点。ここで register を 決めてから 章一→終章を 量産する。
// 執筆順は 章五 → 章一 → 章二 → 章三 → 章四 → 章六 → 終章。Hand-managed.
/* eslint-disable */

import type { Story, Scene } from '../../../engine/types';

// Placeholder scene. Scene ids are chapter-prefixed (e.g. '1-a') so they stay globally unique —
// sceneMaps / figures / closeup are keyed by scene id across the whole work.
function stub(id: string, place: string, chapterTitle: string): Record<string, Scene> {
  return {
    [id]: {
      place,
      text: `<p>この 章「${chapterTitle}」は これから 書きます。（骨組み）</p>`,
      end: true,
    },
  };
}

export const STORY: Story = {
  chapters: [
    {
      id: 1, num: '一', title: '焼く 夜', years: '1863',
      lead: '<ruby>血洗島<rt>ちあらいじま</rt></ruby>の <ruby>藍<rt>あい</rt></ruby>の 家の 子・栄一は、横浜の 外国人を 焼き討ちしようと している。決行するのか、<ruby>従兄<rt>いとこ</rt></ruby>・<ruby>長七郎<rt>ちょうしちろう</rt></ruby>の 説得に 従うのか。',
      start: '1-a',
      teaser: '<ruby>京<rt>きょう</rt></ruby>へ 出た きみは、思いがけず 一橋家の <ruby>殿<rt>との</rt></ruby>・<ruby>慶喜<rt>よしのぶ</rt></ruby>に つかえる ことに なる。',
      scenes: stub('1-a', '血洗島・渋沢の 家', '焼く 夜'),
    },
    {
      id: 2, num: '二', title: '敵の 家に つかえる', years: '1864〜1866',
      lead: '<ruby>攘夷<rt>じょうい</rt></ruby>を 貫くか、外国を 開いた 将軍の 家・一橋（<ruby>慶喜<rt>よしのぶ</rt></ruby>）に 仕えるか。外国を 焼こうと した 男が、その 外国を 相手に する 側へ。',
      start: '2-a',
      teaser: '慶喜が 将軍に なり、きみは <ruby>図<rt>はか</rt></ruby>らずも <ruby>幕臣<rt>ばくしん</rt></ruby>に。そして パリへ わたる ことに なる。',
      scenes: stub('2-a', '京', '敵の 家に つかえる'),
    },
    {
      id: 3, num: '三', title: '海の むこうの しくみ', years: '1867〜1868',
      lead: 'パリで きみは、<ruby>攘夷<rt>じょうい</rt></ruby>の 目で 外国を <ruby>拒<rt>こば</rt></ruby>むのか、それとも 銀行・会社・鉄道の しくみを 学ぶのか。焼こうと した 相手に、国を 動かす 答えが あった。',
      start: '3-a',
      teaser: '幕府が 消えた。きみは 帰国し、やがて 明治政府に 引き入れられる。',
      scenes: stub('3-a', 'パリ', '海の むこうの しくみ'),
    },
    {
      id: 4, num: '四', title: '官を すてる', years: '1869〜1873',
      lead: 'エリートの <ruby>役人<rt>やくにん</rt></ruby>として 大蔵省に 残るか、<ruby>民<rt>みん</rt></ruby>に 下って 日本で 最初の <ruby>銀行<rt>ぎんこう</rt></ruby>を つくるか。上から 命じる 側の 椅子を、自分で おりるのか。',
      start: '4-a',
      teaser: '<ruby>民間<rt>みんかん</rt></ruby>の 実業家に なった きみに、三菱の <ruby>岩崎<rt>いわさき</rt></ruby>が 声を かけて くる。',
      scenes: stub('4-a', '東京・兜町', '官を すてる'),
    },
    {
      id: 5, num: '五', title: '舟の うえ', years: '1878ごろ',
      lead: '<ruby>隅田川<rt>すみだがわ</rt></ruby>の 舟の 上。<ruby>岩崎<rt>いわさき</rt></ruby>は「二人で 手を 組んで <ruby>独占<rt>どくせん</rt></ruby>しよう」と さそう。受けて 大金持ちに なるか、「みんなで（<ruby>合本<rt>がっぽん</rt></ruby>）」を 貫くか。',
      start: '5-a',
      teaser: '明治の 世で、きみは <ruby>負<rt>ま</rt></ruby>けた 旧主・慶喜の ことを 思い出す。',
      scenes: stub('5-a', '隅田川の 舟の 上', '舟の うえ'),
    },
    {
      id: 6, num: '六', title: '負けた あるじの ための 紙', years: '1893〜1918ごろ',
      lead: '<ruby>勝<rt>か</rt></ruby>った 明治の 世で 生きるだけで よいのに、きみは <ruby>負<rt>ま</rt></ruby>けた 旧主・慶喜の <ruby>汚名<rt>おめい</rt></ruby>を そそぐため、長い 年月 <ruby>資料<rt>しりょう</rt></ruby>を 集める。尽くすのか、<ruby>忘<rt>わす</rt></ruby>れるのか。',
      start: '6-a',
      teaser: 'そして この 人の 顔は、やがて 一万円札に なる。——きみは、どう 思う？',
      scenes: stub('6-a', '東京・慶喜のもと', '負けた あるじの ための 紙'),
    },
    {
      id: 7, num: '終', title: '一万円札の 顔', years: '1931／2024',
      lead: '<ruby>約<rt>やく</rt></ruby>500の 会社に 関わり、それでも 自分の <ruby>財閥<rt>ざいばつ</rt></ruby>は つくらなかった 男が 死んだ。——そして その 顔は、一万円札に なる。この 人の「<ruby>像<rt>ぞう</rt></ruby>」を つくったのは、だれだろう。',
      start: '7-a',
      scenes: stub('7-a', '東京', '一万円札の 顔'),
    },
  ],
};
