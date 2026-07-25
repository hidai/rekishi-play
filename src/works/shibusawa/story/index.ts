// Story data (STORY). All 7 chapter containers come from design §2 (id/num/title/years/lead/
// start/teaser); chapters still unwritten hold a single 「準備中」 placeholder scene.
//
// WRITTEN: 章五「舟の うえ」= the PILOT (design §8 / WRITING 10 パイロットシーン制) — B の頂点
// （独占を 自分で 選ばない）＋ 史料批判の 最良の実例（本人は 穏当に 語ったのに 伝記文学が 劇に
// した＝§3-1）＋ 敵に 声を 与える 最難所（岩崎＝もう一つの正解）。ここで確定した register:
//   ① 装置は closeup 4枚（岩崎 単独 tense → 対面 warm → **同一人物の 二つの顔** solemn →
//      対面 grief）。舟の席を warm に置くのが 5-c の 史料批判の 下地になる（劇的な決裂は後世の脚色）。
//   ② 5-c の「38さいの きみ / 86さいの きみ」= 語り直しを 絵で運ぶ（engine 拡張ゼロ・cast 2枠に同一 pid）。
//   ③ 制度語（合本・株・国立銀行）は 本文に出さず word card と deep へ（design §0-5）。
//   ④ hist は canon 側も もしも側も「代償」を書く。canon の source は『伝記資料』＝ほめる側が
//      集めた資料集だと名指す（clue-7 への伏線）。
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
      lead: '<ruby>隅田川<rt>すみだがわ</rt></ruby>の 舟の 上。<ruby>岩崎<rt>いわさき</rt></ruby>は「二人で 手を 組んで <ruby>独占<rt>どくせん</rt></ruby>しよう」と さそう。受けて 大金持ちに なるか、ことわって 一人で いくか。',
      start: '5-a',
      teaser: '明治の 世で、きみは <ruby>負<rt>ま</rt></ruby>けた 旧主・慶喜の ことを 思い出す。',
      scenes: {
        '5-a': { place: '東京・<ruby>兜町<rt>かぶとちょう</rt></ruby>',
          monologue: '（会社を ふやすのは、たのしい。……ただ、海の 上だけは、どうにも ならぬ。）',
          closeup: { tone: 'tense', cast: [{ face: 'p-yataro', name: '岩崎弥太郎' }] },
          text: `<p><ruby>役人<rt>やくにん</rt></ruby>を やめて 五年。きみは 自分の 店を 太らせる かわりに、よその 人の 会社を 次から 次へと 起こす 手つだいを して いる。紙。よその 町の <ruby>銀行<rt>ぎんこう</rt></ruby>。<ruby>株<rt>かぶ</rt></ruby>を 売り買いする 所。船が しずんでも お金が もどる <ruby>保険<rt>ほけん</rt></ruby>。お金を 出す 人を 何十人も あつめ、みんなの 会社に する。</p>
            <p>ただ、海の 上だけは ちがった。船の 道は、<ruby>土佐<rt>とさ</rt></ruby>から 出て きた 男・<ruby>岩崎弥太郎<rt>いわさきやたろう</rt></ruby>の <ruby>三菱<rt>みつびし</rt></ruby>が ほとんど にぎって いる。運ぶ <ruby>値段<rt>ねだん</rt></ruby>も、岩崎の 一言で 動く。</p>
            <p>その 岩崎から、<ruby>使<rt>つか</rt></ruby>いが 来た。——<ruby>隅田川<rt>すみだがわ</rt></ruby>で <ruby>舟遊<rt>ふなあそ</rt></ruby>びを しよう、と。</p>`,
          spark: 'え！？ 三菱が 海を にぎれた その 後ろには、<ruby>政府<rt>せいふ</rt></ruby>が 自分の <ruby>汽船<rt>きせん</rt></ruby>を <b>ただで 岩崎に わたした</b> ことが ある。強い 会社は、国の 手で つくられる ことも ある。',
          deep: { q: '三菱は なぜ そんなに 強い？', confidence: '◎',
            body: `1874年、政府は <ruby>台湾<rt>たいわん</rt></ruby>へ 兵を 送る ため、船を 持って いた 岩崎に その 運びを 任せた。うまく やった ほうびに、<b>その <ruby>翌年<rt>よくねん</rt></ruby></b>、政府は 汽船を そのまま 岩崎に わたし、毎年の 助けの お金も 出した。三菱は 国の 後ろだてで 日本の <ruby>海運<rt>かいうん</rt></ruby>を にぎり、外国の 船会社まで 追い出して しまう。<br>——国が 一つの 家を えらんで、強く した ということだ。` },
          onEnter: { card: 'p-yataro' },
          next: '5-b' },

        '5-b': { place: '<ruby>隅田川<rt>すみだがわ</rt></ruby>の 舟の 上',
          monologue: '（……手を 組めば、わたしは 日本一の 金持ちに なれる。ほしくない と 言えば、うそに なる。）',
          // tone=warm（夕暮れの空＋遠山）。舟遊びの席は 和やかで、そこで とんでもない 話が 出る——
          // 5-c の 史料批判（劇的な決裂は 後世の脚色）の 下地を、絵の 側でも 張る。
          closeup: { tone: 'warm', cast: [{ face: 'p-eiichi@prime', name: '栄一（きみ）' }, { face: 'p-yataro', name: '岩崎弥太郎' }] },
          text: `<p>夏の 夕方。<ruby>向島<rt>むこうじま</rt></ruby>の あたりを、舟が ゆっくり 流れて いく。酒が 出て、<ruby>三味線<rt>しゃみせん</rt></ruby>が 鳴る。岩崎は よく 笑い、そして にこやかな まま、こう 言った。</p>
            <p class="speak">「渋沢さん。海の 道は、力を 一つに あつめた 者しか まもれん。外国の 船を 追い返せたのも、それが できたからだ。——あんたと わしが 手を 組めば、船も 金も 思いの ままだ。」</p>
            <p>受ければ、きみは たぶん 日本一の 金持ちに なる。断れば、海の <ruby>王者<rt>おうじゃ</rt></ruby>と 正面から 争う ことに なる。</p>`,
          q: '岩崎の さそいを、どう する？',
          choices: [
            { label: '手を 組む。二人で 船と お金を おさえる', to: '5-c', effect: { soroban: 2 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 手を 組んで いたら……',
                body: `<p>組めば、たしかに もうかった だろう。二人で <ruby>値段<rt>ねだん</rt></ruby>を 決められる 世は、大きな 会社を うんと 早く 生む。きみは <ruby>一族<rt>いちぞく</rt></ruby>の <ruby>財産<rt>ざいさん</rt></ruby>を 山の ように 積み、<ruby>三井<rt>みつい</rt></ruby>・三菱・<ruby>住友<rt>すみとも</rt></ruby>と ならぶ「渋沢<ruby>財閥<rt>ざいばつ</rt></ruby>」——一つの 家が <ruby>富<rt>とみ</rt></ruby>を にぎる 大会社の <ruby>群<rt>む</rt></ruby>れ——の <ruby>主<rt>あるじ</rt></ruby>に なって いた かもしれない。</p><p>だが その とき、あとに 続く 何百もの 会社は 生まれたか。おおぜいから 少しずつ お金を あつめて 会社を 起こす やり方を 日本に 広めたのは、きみだ。——史実の きみは、この 手を 取らなかった。</p>` } },
            { label: '断る。<ruby>株<rt>かぶ</rt></ruby>を 出し合う「みんなの 会社」で いく', to: '5-c', canon: true, effect: { rongo: 1, gappon: 2 },
              hist: { verdict: '史実では', match: '渋沢は 手を 組まず、海の 道で 正面から 競った',
                body: `<p>きみは その 手を 取らなかった。数年 のち、政府と <ruby>三井<rt>みつい</rt></ruby>などの 大<ruby>商人<rt>しょうにん</rt></ruby>も 力を 貸して、おおぜいが <ruby>株<rt>かぶ</rt></ruby>を 出し合う 船会社——<ruby>共同運輸<rt>きょうどううんゆ</rt></ruby>——が 生まれる。三菱と 同じ 海に、同じ <ruby>荷<rt>に</rt></ruby>を 運ぶ 船が 走りはじめた。</p><p>——三菱を 育てたのも 政府、それを くずす 側に ついたのも 政府だ。<b>きみの 側にも、国と 大きな 商家が いた</b>。そして この 争いの 終わり方は、どちらの 勝ちでも なかった。</p><p>（——ただし、いま 見た 舟の 上の やりとりが どこまで ほんとうかは、この あとで。）</p>`,
                source: { grade: 'later', name: '『<ruby>渋沢栄一伝記資料<rt>しぶさわえいいちでんきしりょう</rt></ruby>』',
                  note: '渋沢を <ruby>敬<rt>うやま</rt></ruby>う 人たちが、のちに 68<ruby>巻<rt>かん</rt></ruby>に まとめた <ruby>資料集<rt>しりょうしゅう</rt></ruby>。手紙も <ruby>帳簿<rt>ちょうぼ</rt></ruby>も 入って いる——わるい ことを かくした わけでは ないが、集めたのは ほめる 側の 人たちだ。' } } },
          ] },

        '5-c': { place: '東京・1926年——およそ50年 あとの きみ',
          closeup: { tone: 'solemn', cast: [{ face: 'p-eiichi@prime', name: '40さいごろの きみ' }, { face: 'p-eiichi', name: '86さいの きみ' }] },
          text: `<p>この 場面には、へんな ところが ある。</p>
            <p>広く 知られて いる 話では、きみは 岩崎に <ruby>腹<rt>はら</rt></ruby>を 立て、<ruby>芸者<rt>げいしゃ</rt></ruby>を つれて さっと <ruby>席<rt>せき</rt></ruby>を 立った ことに なって いる。まっぷたつの <ruby>決裂<rt>けつれつ</rt></ruby>だ。——だが、その 場面を 書いた 紙で いま たどれる いちばん 古い ものは、舟の 日から 80年 あとの 本だった。</p>
            <p>あの 場面の もとを たどると、86さいに なった きみの 思い出話に ゆきつく。そして 孫が 本人に たしかめた とき、きみは こう 答えて いる。</p>
            <p class="speak">「けんかに なったのでは ない。おたがい 考えが ちがう だけだ。それぞれ 得意な やり方で やろう、という くらいの ことだった。」</p>
            <p>——では、いま きみが 見て きた 舟の 上は？ 何を 話したのかも、その日が いつだったのかも、じつは はっきり しない。</p>`,
          spark: 'え！？ みんなが 知って いる「芸者を つれて 席を 立った」場面は、<b>本人が 語った ときには 無かった</b> かもしれない。話は、あとから おもしろく なる。',
          deep: { q: '「席を 立った」話は、どこから 来た？', confidence: '△',
            body: `<ruby>劇<rt>げき</rt></ruby>のような 場面を 広めた もとは、<ruby>四男<rt>よんなん</rt></ruby>・<ruby>渋沢秀雄<rt>しぶさわひでお</rt></ruby>が 1959年に 書いた <ruby>伝記<rt>でんき</rt></ruby>『父 渋沢栄一』。その もとに あるのが、1926年（栄一 86さい）の <ruby>談話<rt>だんわ</rt></ruby>の <ruby>筆記<rt>ひっき</rt></ruby>——出来ごとから 約50年 あとの 思い出だ。孫・<ruby>敬三<rt>けいぞう</rt></ruby>が たずねた ときの「<ruby>険悪<rt>けんあく</rt></ruby>に なったのでは ない」も、<ruby>身内<rt>みうち</rt></ruby>が 書きとめた もの。<br>舟の 日が 何年かも 割れて いる——『父 渋沢栄一』は 1878年、べつの <ruby>稿本<rt>こうほん</rt></ruby>は 1880年。どちらが 正しいかは、まだ 決まって いない。`,
            cite: '※ おもしろい 場面ほど、あとから 足されて いる ことが ある。だれが・いつ・なぜ 語ったかを 見る。' },
          onEnter: { card: 'w-gappon', clue: 'clue-5' },
          next: '5-d' },

        '5-d': { place: '第5章 むすび',
          monologue: '（……あの 舟の 上で、この 人は 何を 見て いたのだろう。）',
          closeup: { tone: 'grief', cast: [{ face: 'p-eiichi@prime', name: '栄一（きみ）' }, { face: 'p-yataro', name: '岩崎弥太郎' }] },
          text: `<p>1882年、おおぜいが <ruby>株<rt>かぶ</rt></ruby>を 出し合う <ruby>共同運輸<rt>きょうどううんゆ</rt></ruby>が 生まれ、あくる年、三菱と 同じ 海に 船を 出した。二つは 運び<ruby>賃<rt>ちん</rt></ruby>を 下げ合い、<ruby>値段<rt>ねだん</rt></ruby>は 半分より 下まで 落ちる。<ruby>客<rt>きゃく</rt></ruby>は よろこび、会社は どちらも <ruby>傷<rt>きず</rt></ruby>ついた。</p>
            <p>1885年2月、その 争いの まん中で 岩崎が <ruby>病<rt>やまい</rt></ruby>に たおれ、50さいで 死ぬ。同じ 年の 秋、二つの 会社は 一つに なった。今も 海を 走る <ruby>日本郵船<rt>にっぽんゆうせん</rt></ruby>だ。</p>
            <p><ruby>独占<rt>どくせん</rt></ruby>か、みんなでか。競い合った 二つは、最後に 同じ 船に 乗った。——独占を くずして できたのは、もっと 大きな 一つの 会社だった。</p>`,
          creed: { line: '「一つの 家が 大きく なっても、国は 大きく ならぬ。——わたしは、みんなで やる。」',
            act: '——日本一の 金持ちに なれる 手を 断った。かわりに <ruby>値<rt>ね</rt></ruby>くずしの 争いに なり、相手が 死んだ あと、その 会社と 一つに なった。' },
          end: true },
      },
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
