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
      lead: '<ruby>血洗島<rt>ちあらいじま</rt></ruby>の <ruby>藍<rt>あい</rt></ruby>の 家の 子・<ruby>栄一<rt>えいいち</rt></ruby>は、横浜の 外国人を 焼き討ちしようと している。決行するのか、<ruby>従兄<rt>いとこ</rt></ruby>・<ruby>長七郎<rt>ちょうしちろう</rt></ruby>の 説得に 従うのか。',
      start: '1-a',
      teaser: '<ruby>京<rt>きょう</rt></ruby>へ 出た きみは、思いがけず 一橋家の <ruby>殿<rt>との</rt></ruby>・<ruby>慶喜<rt>よしのぶ</rt></ruby>に つかえる ことに なる。',
      scenes: {
        '1-a': { place: '<ruby>血洗島<rt>ちあらいじま</rt></ruby>・<ruby>渋沢<rt>しぶさわ</rt></ruby>の 家',
          monologue: '（……<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子。それが、そんなに いけない ことか。）',
          closeup: { tone: 'solemn', cast: [{ face: 'p-ichiroemon', name: '父・市郎右衛門' }] },
          text: `<p>十七の とき、<ruby>代官所<rt>だいかんしょ</rt></ruby>に 呼ばれた。「五百<ruby>両<rt>りょう</rt></ruby> 出せ」。父の かわりに 出た きみが「持ち帰って 相談します」と 答えると、<ruby>役人<rt>やくにん</rt></ruby>は 笑った。「<ruby>百姓<rt>ひゃくしょう</rt></ruby>の くせに、返事も できぬのか」</p>
            <p>きみの 家は <ruby>藍<rt>あい</rt></ruby>の 家だ。<ruby>藍玉<rt>あいだま</rt></ruby>——布を あおく <ruby>染<rt>そ</rt></ruby>める もとを つくって 売る。十四の 年から 一人で 村々を まわり、<ruby>葉<rt>は</rt></ruby>を 手に とっては「これは よい」「これは 高すぎる」と 見わけて きた。朝は <ruby>従兄<rt>いとこ</rt></ruby>・<ruby>尾高惇忠<rt>おだかじゅんちゅう</rt></ruby>の 家で『<ruby>論語<rt>ろんご</rt></ruby>』を 読み、<ruby>昼<rt>ひる</rt></ruby>は そろばんを はじく。</p>
            <p>その きみが、返事の しかたで 笑われた。帰り道、父は しばらく だまって いた。</p>
            <p class="speak">「くやしいだろう。だが、それが 世の しくみだ。」</p>`,
          spark: 'え！？ いま きみが 見た この 場面、たどれる 出どころは <b>きみ 自身が 30年 あとに 語った 思い出</b>しか ない。',
          deep: { q: 'この 話は、だれが 語った？', confidence: '△',
            body: `<ruby>代官所<rt>だいかんしょ</rt></ruby>の この 場面が いま たどれるのは、きみ 自身の 語りだけだ。47さいごろ、<ruby>弟子<rt>でし</rt></ruby>たちに せがまれて 五つの 夜に わたって 話した 思い出——『<ruby>雨夜譚<rt>あまよがたり</rt></ruby>』に 出て くる。<ruby>役人<rt>やくにん</rt></ruby>の 言葉を その場で 書きとめた 紙は、見つかって いない。金も 五百両か もっとか、本に よって ちがう。<br>だから たしかさマークは △（出どころが 一つだけ）。◎＝たしか、○＝だいたい、△＝説が わかれる、☆＝あとの 世の 話。`,
            cite: '※ この 人は 自分の 一生を たくさん 語り残した。だから いつも 問う——だれが、いつ、なぜ そう 語ったか。' },
          onEnter: { cards: ['p-eiichi', 'p-ichiroemon'] },
          next: '1-b' },

        '1-b': { place: '<ruby>尾高<rt>おだか</rt></ruby>の 家の 二階',
          text: `<p>1863年。<ruby>黒船<rt>くろふね</rt></ruby>が 来て から 十年。<ruby>港<rt>みなと</rt></ruby>が ひらかれ、<ruby>生糸<rt>きいと</rt></ruby>も 米も <ruby>値<rt>ね</rt></ruby>が はねあがって いた。「外国を 追いはらえ」——その 声は、こんな 村にまで <ruby>届<rt>とど</rt></ruby>いて いる。</p>
            <p><ruby>惇忠<rt>じゅんちゅう</rt></ruby>の 家の 二階に、<ruby>刀<rt>かたな</rt></ruby>と <ruby>鎧<rt>よろい</rt></ruby>が 積まれて いく。<ruby>藍<rt>あい</rt></ruby>を 売った 金で 買い集めた ものだ。</p>
            <p class="speak">「<ruby>高崎<rt>たかさき</rt></ruby>の 城を のっとって 武器を 取る。それから <ruby>街道<rt>かいどう</rt></ruby>を 下って、<ruby>横浜<rt>よこはま</rt></ruby>を 焼く。」</p>
            <p>『論語』を 教えて くれた その 人が、そう 言った。集まった 仲間は およそ 69人。<ruby>決行<rt>けっこう</rt></ruby>は 冬の 夜——あと ひと月。</p>`,
          spark: 'え！？ のちに 一万円札の 顔に なる 人の <ruby>出発点<rt>しゅっぱつてん</rt></ruby>は、<b>外国人を 焼き、<ruby>斬<rt>き</rt></ruby>る 計画</b>だった。',
          deep: { q: 'なぜ 外国人を 焼こうと したの？', confidence: '◎',
            body: `<ruby>港<rt>みなと</rt></ruby>が ひらかれて 外国との <ruby>商<rt>あきな</rt></ruby>いが 始まると、<ruby>生糸<rt>きいと</rt></ruby>が どんどん 外へ 出て いき、国の 中の <ruby>値段<rt>ねだん</rt></ruby>が はね上がった。くらしが 苦しく なる。「<ruby>幕府<rt>ばくふ</rt></ruby>が 弱いから こうなる。外国を 追い出せ」——この 考えを <ruby>攘夷<rt>じょうい</rt></ruby>と いう。若い 者ほど 熱く なった。<br>計画が あった ことは たしか（◎）。ただし <ruby>決行<rt>けっこう</rt></ruby>の 日づけも 仲間の 数も、もとは やはり きみ 自身の 語りだ（△）。` },
          onEnter: { card: 'p-junchu' },
          next: '1-c' },

        '1-c': { place: '<ruby>尾高<rt>おだか</rt></ruby>の 家の 二階——<ruby>決行<rt>けっこう</rt></ruby>の 前',
          closeup: { tone: 'tense', cast: [{ face: 'p-choshichiro', name: '尾高長七郎' }, { face: 'p-eiichi@young', name: '栄一（きみ）' }] },
          text: `<p><ruby>京<rt>きょう</rt></ruby>から、男が 帰って きた。<ruby>惇忠<rt>じゅんちゅう</rt></ruby>の 弟・<ruby>長七郎<rt>ちょうしちろう</rt></ruby>。<ruby>剣<rt>けん</rt></ruby>の うでは 仲間の 中で いちばんだ。</p>
            <p>京では、同じ ことを 考えた 若者たちが、次から 次へと <ruby>斬<rt>き</rt></ruby>られて いた。長七郎は それを 見て きた。</p>
            <p class="speak">「やめろ。<ruby>犬死<rt>いぬじ</rt></ruby>にだ。……どうしても 行くと 言うなら、おれが ここで お前を <ruby>斬<rt>き</rt></ruby>る。」</p>
            <p>きみも 引かなかった。</p>
            <p class="speak">「——なら、<ruby>斬<rt>き</rt></ruby>れ。おれは お前を <ruby>刺<rt>さ</rt></ruby>しても 行く。」</p>
            <p>言い争いは 夜どおし 続いた。買い集めた 刀は もう <ruby>蔵<rt>くら</rt></ruby>に ある。仲間は 待って いる。</p>`,
          q: 'きみは どう する？',
          choices: [
            { label: '<ruby>決行<rt>けっこう</rt></ruby>する。ここで 引いては 仲間に 顔むけ できない', to: '1-d', effect: { rongo: 1, gappon: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし あの 夜、刀を 取って いたら……',
                body: `<p>69人で 小さな 城を おさえるだけなら、できた かも しれない。だが その 先が ある。<ruby>幕府<rt>ばくふ</rt></ruby>の 兵が 出て くる。同じ 年、同じ ことを 考えた 若者の <ruby>一団<rt>いちだん</rt></ruby>は、山の 中で ほろんで いる。</p><p>焼く つもりの 港にも、そこで <ruby>眠<rt>ねむ</rt></ruby>って いる 人が いる。外国の 船も だまって いない。村に 残した 父も 母も ただでは すまない。——きみの 話は、その 冬で 終わる。<b>史実の きみは、刀を おろした。</b></p>` } },
            { label: '長七郎に したがう。刀を おろす', to: '1-d', canon: true, effect: { rongo: 2 },
              hist: { verdict: '史実では', match: '<ruby>栄一<rt>えいいち</rt></ruby>は 折れ、計画は 消えた',
                body: `<p>言い争いの 末、きみは 折れた。買い集めた 武器は 売りはらわれ、69人は ちりぢりに なる。</p><p>——じつは その ひと月半ほど 前、きみは 父に 願い出て いた。「<ruby>勘当<rt>かんどう</rt></ruby>して ください」。国の ために 死ぬ かもしれない 者に、家は つげない から。父の 答えは こうだった。「出て しまってから、<ruby>勘当<rt>かんどう</rt></ruby>した ことに しよう」。<b>計画は 消えた。それでも、その 話だけが 残った。</b></p><p>村に いる ことも できなかった。<ruby>幕府<rt>ばくふ</rt></ruby>の 役人が、もう 動きを かぎつけて いた。</p><p>（この 夜の やりとりの もとに あるのも、やはり きみ 自身の 語りだ。）</p>`,
                source: { grade: 'later', name: '『<ruby>雨夜譚<rt>あまよがたり</rt></ruby>』',
                  note: '栄一が 47さいごろ、<ruby>弟子<rt>でし</rt></ruby>たちに 語った 若い日の 思い出を、弟子が 書きとめた 本。出来ごとから 20年 以上 あとの <ruby>回想<rt>かいそう</rt></ruby>だ。' } } },
          ] },

        '1-d': { place: '第1章 むすび',
          monologue: '（……この 家に、もう 帰らない。）',
          closeup: { tone: 'grief', cast: [{ face: 'p-eiichi@young', name: '栄一（きみ）' }, { face: 'p-ichiroemon', name: '父・市郎右衛門' }] },
          text: `<p>父は 長い あいだ だまって いた。それから 一言。</p>
            <p class="speak">「もう、お前の 心は 決まって いるのだろう。<ruby>好<rt>す</rt></ruby>きに しなさい。」</p>
            <p>その 冬、きみは 刀を いっしょに 買い集めた 二つ 年上の <ruby>従兄<rt>いとこ</rt></ruby>・<ruby>喜作<rt>きさく</rt></ruby>と 二人で 村を 出た。<ruby>藍<rt>あい</rt></ruby>の 家の 子でも なく、<ruby>侍<rt>さむらい</rt></ruby>でも なく、<ruby>何者<rt>なにもの</rt></ruby>でも ない まま、<ruby>京<rt>きょう</rt></ruby>へ 向かう。</p>
            <p>——外国人を 焼こうと して いた この 男が、十年 のち、その 外国から 来た しくみを 日本に 建てる ことに なる。この 夜は、まだ だれも 知らない。</p>`,
          creed: { line: '「<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子で 何が わるい。——だが、この 世の しくみは 変えて みせる。」',
            act: '——<ruby>従兄<rt>いとこ</rt></ruby>と <ruby>刺<rt>さ</rt></ruby>しちがえる 一歩 手前まで 行って、刀を おろした。父に 願って 家を 出された ことに して もらい、村にも 帰らない 道を えらんだ。' },
          onEnter: { card: 'p-choshichiro', clue: 'clue-1' },
          end: true },
      },
    },
    {
      id: 2, num: '二', title: '敵の 家に つかえる', years: '1864〜1866',
      lead: '<ruby>攘夷<rt>じょうい</rt></ruby>を <ruby>貫<rt>つらぬ</rt></ruby>くか、外国を 開いた <ruby>将軍<rt>しょうぐん</rt></ruby>の 家・<ruby>一橋<rt>ひとつばし</rt></ruby>（<ruby>慶喜<rt>よしのぶ</rt></ruby>）に 仕えるか。外国を 焼こうと した 男が、その 外国を 相手に する 側へ。',
      start: '2-a',
      teaser: '慶喜が <ruby>将軍<rt>しょうぐん</rt></ruby>に なり、きみは <ruby>図<rt>はか</rt></ruby>らずも <ruby>幕臣<rt>ばくしん</rt></ruby>に。そして パリへ わたる ことに なる。',
      scenes: {
        '2-a': { place: '<ruby>京<rt>きょう</rt></ruby>・<ruby>三条<rt>さんじょう</rt></ruby>の <ruby>宿<rt>やど</rt></ruby>',
          monologue: '（……村には 帰れない。帰らない ことに して、出て きたのだから。）',
          text: `<p>村を 出て、<ruby>京<rt>きょう</rt></ruby>。<ruby>攘夷<rt>じょうい</rt></ruby>を さけぶ <ruby>若者<rt>わかもの</rt></ruby>が、この 町には あふれて いた。きみと <ruby>喜作<rt>きさく</rt></ruby>も その 中に まじり、人に 会い、うわさを 集める。年が 明けた。ふところの 金は、もう ない。</p>
            <p class="speak">「なあ <ruby>栄一<rt>えいいち</rt></ruby>。おれたちは、何を しに 京へ 来たんだろうな。」</p>
            <p>そこへ 知らせが 来る。<ruby>長七郎<rt>ちょうしちろう</rt></ruby>が 人を あやめて とらえられた。その ふところには、きみが 書いた 手紙が あった。<ruby>幕府<rt>ばくふ</rt></ruby>は もう、きみの 名を 知って いる。</p>`,
          spark: 'え！？ その 京へ、きみは <b>「<ruby>一橋家<rt>ひとつばしけ</rt></ruby>の 家来」と 名のって</b> 入って いた。焼こうと して いた 側の 家の 名で、<ruby>関所<rt>せきしょ</rt></ruby>を 通ったのだ。',
          deep: { q: 'なぜ 敵の 家の 名を 借りたの？', confidence: '○',
            body: `<ruby>関所<rt>せきしょ</rt></ruby>は 通る 人の 身もとを 調べる。村を <ruby>捨<rt>す</rt></ruby>てた <ruby>百姓<rt>ひゃくしょう</rt></ruby>の ままでは、京まで たどりつけない。<ruby>江戸<rt>えど</rt></ruby>に 学びに 出て いた ころ、きみは 一橋家の <ruby>用人<rt>ようにん</rt></ruby>・<ruby>平岡円四郎<rt>ひらおかえんしろう</rt></ruby>に 目を かけられて いた。その 家来と いう ことに して もらい、二人は 西へ 向かった。<br><ruby>関所<rt>せきしょ</rt></ruby>の きびしさは、ほかの 紙にも 残って いる。だが 名を 借りた やりとりを 書いた ものは、——やはり きみ 自身の 語り しか ない。` },
          onEnter: { card: 'p-kisaku' },
          next: '2-b' },

        '2-b': { place: '京・一橋家の <ruby>屋敷<rt>やしき</rt></ruby>',
          closeup: { tone: 'tense', cast: [{ face: 'p-hiraoka', name: '平岡円四郎' }, { face: 'p-eiichi@young', name: '栄一（きみ）' }] },
          text: `<p><ruby>平岡円四郎<rt>ひらおかえんしろう</rt></ruby>。一橋家の <ruby>用人<rt>ようにん</rt></ruby>——<ruby>殿<rt>との</rt></ruby>の そばで 家の 仕事を まとめる 人だ。<ruby>呼<rt>よ</rt></ruby>びつけられた 二人に、その 人は いきなり こう 言った。</p>
            <p class="speak">「このままでは、おぬしら 半年も もたぬ。——うちへ 来い。<ruby>一橋<rt>ひとつばし</rt></ruby>の <ruby>家来<rt>けらい</rt></ruby>に なれ。」</p>
            <p>一橋の 殿・<ruby>慶喜<rt>よしのぶ</rt></ruby>は <ruby>将軍<rt>しょうぐん</rt></ruby>の 家の 人。<ruby>港<rt>みなと</rt></ruby>を ひらいた 側、きみが 焼こうと して いた 側だ。</p>
            <p>きみは 顔を 上げた。</p>
            <p class="speak">「ただ 使われる だけなら、おことわりします。思う ことを 言わせて いただけますか。」</p>`,
          q: 'きみは どう する？',
          choices: [
            { label: 'ことわる。<ruby>攘夷<rt>じょうい</rt></ruby>を つらぬく', to: '2-c', effect: { rongo: 2 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 敵の 家に 入らなかったら……',
                body: `<p>ことわれば、きみは <ruby>浪人<rt>ろうにん</rt></ruby>の まま 京に 残る。だれにも 頭を 下げず、言って きた ことを 曲げずに すむ。この まま 生きのびた 仲間の 中には、のちに 新しい 国を 動かす 側に なった 者も いる。</p><p>だが 1864年の 京は、<ruby>志士<rt>しし</rt></ruby>が いちばん 多く 死んだ 年だった。夏、<ruby>池田屋<rt>いけだや</rt></ruby>で 同じ こころざしの 者たちが <ruby>斬<rt>き</rt></ruby>られ、つづく <ruby>戦<rt>いくさ</rt></ruby>で 町の 大半が 焼ける。</p><p>金は なく、幕府は 手紙で きみの 名を 知って いる。——外から さけびつづけた 若者の 名は、いくつも 残って いない。一万円札の 顔も、べつの だれかに なる。<b>史実の きみは、<ruby>敵<rt>てき</rt></ruby>の 家に 入った。</b></p>` } },
            { label: '<ruby>仕<rt>つか</rt></ruby>える。ただし、ものが 言える ことを 条件に', to: '2-c', canon: true, effect: { rongo: 1, soroban: 1 },
              hist: { verdict: '史実では', match: '<ruby>栄一<rt>えいいち</rt></ruby>は 敵の 家に 入り、<ruby>意見<rt>いけん</rt></ruby>を 言う <ruby>約束<rt>やくそく</rt></ruby>を 取った',
                body: `<p>きみは 一橋家に 入った。外国人を 焼こうと して いた 男が、外国に 港を ひらいた 家の 家来に なる。</p><p>ただの 家来では なかった。<ruby>殿<rt>との</rt></ruby>が 馬で 出かける とき、その うしろに ついて 歩き、思う ことを 言う——そういう <ruby>立場<rt>たちば</rt></ruby>を 願い出て、通した。</p>`,
                source: { grade: 'later', name: '『<ruby>雨夜譚<rt>あまよがたり</rt></ruby>』',
                  note: 'また この 本だ。京へ 上った 道も、<ruby>仕官<rt>しかん</rt></ruby>の やりとりも、たどれる 紙は ほとんど これ しか ない。——きみの 若い 日は、年を とった きみの 語りに よりかかって いる。' } } },
          ],
          onEnter: { card: 'p-hiraoka' } },

        '2-c': { place: '京——その 年の 夏',
          closeup: { tone: 'grief', cast: [{ face: 'p-hiraoka', name: '平岡円四郎' }] },
          text: `<p>その 年の 夏。平岡は 京の 町なかで <ruby>斬<rt>き</rt></ruby>られた。斬ったのは <ruby>水戸<rt>みと</rt></ruby>の <ruby>攘夷<rt>じょうい</rt></ruby>の 男たち。「<ruby>殿<rt>との</rt></ruby>を 外国びいきに した 悪い 家来だ」と いう ことだった。</p>
            <p>去年の 秋まで、きみも 同じ ことを さけんで いた。<ruby>刀<rt>かたな</rt></ruby>を 買い集め、<ruby>港<rt>みなと</rt></ruby>を 焼くと 言って いた。</p>
            <p>その <ruby>刃<rt>やいば</rt></ruby>が、きみを ひろって くれた 人を <ruby>殺<rt>ころ</rt></ruby>した。</p>
            <p>きみは 一橋の 家に 残った。</p>`,
          deep: { q: '平岡円四郎は なぜ 殺された？', confidence: '◎',
            body: `一橋の <ruby>殿<rt>との</rt></ruby>・<ruby>慶喜<rt>よしのぶ</rt></ruby>は、外国を うちはらえと 言う 人たちの <ruby>期待<rt>きたい</rt></ruby>を 集めて いた。そばで 家を 動かして いた 平岡は、その 殿を「外国と 話を つける ほう」へ 向かわせて いる、と 見られた。慶喜の 生まれた <ruby>水戸<rt>みと</rt></ruby>の 中でも いちばん 熱い 人たちが、平岡を <ruby>邪魔者<rt>じゃまもの</rt></ruby>と 決め、1864年の 夏、京の 町で 斬った。<br>——<ruby>攘夷<rt>じょうい</rt></ruby>の <ruby>刃<rt>やいば</rt></ruby>は、外国人だけに 向いたのでは ない。同じ 日本人に、いちばん 多く 向いた。` },
          next: '2-d' },

        '2-d': { place: '一橋の <ruby>領地<rt>りょうち</rt></ruby>、そして 京',
          closeup: { tone: 'solemn', cast: [{ face: 'p-yoshinobu', name: '一橋慶喜' }, { face: 'p-eiichi@young', name: '栄一（きみ）' }] },
          text: `<p>きみに 回って きたのは、<ruby>戦<rt>いくさ</rt></ruby>の 仕事では なかった。一橋の <ruby>領地<rt>りょうち</rt></ruby>の 村を 一つずつ 回り、<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 家から 兵を 出して もらう こと。</p>
            <p><ruby>侍<rt>さむらい</rt></ruby>が 上から 命じても、村は 動かない。きみは <ruby>土間<rt>どま</rt></ruby>に すわりこみ、<ruby>藍<rt>あい</rt></ruby>の 葉を 買いつけて いた ころと 同じ 顔で 話した。兵は 集まった。つづけて <ruby>木綿<rt>もめん</rt></ruby>の 売り方を 変え、<ruby>火薬<rt>かやく</rt></ruby>の もとを つくらせる。一橋の <ruby>金蔵<rt>かなぐら</rt></ruby>が ふくらんだ。</p>
            <p><ruby>殿<rt>との</rt></ruby>の 前に 呼ばれた。<ruby>慶喜<rt>よしのぶ</rt></ruby>は 終わりまで 聞き、それから 一言だけ 言った。</p>
            <p class="speak">「——<ruby>聞<rt>き</rt></ruby>いて おく。」</p>
            <p>顔いろは 変わらない。何を 思ったかは、わからない。</p>`,
          spark: 'え！？ 外国人を <ruby>斬<rt>き</rt></ruby>る つもりで 村を 出た きみの 仕事は、<b>兵あつめと <ruby>商<rt>あきな</rt></ruby>い</b>だった。役に 立ったのは 刀では なく、そろばんの ほうだった。',
          deep: { q: '<ruby>慶喜<rt>よしのぶ</rt></ruby>は どんな 人？', confidence: '○',
            body: `<ruby>水戸<rt>みと</rt></ruby>の <ruby>徳川<rt>とくがわ</rt></ruby>の 家に 生まれ、一橋家を ついだ。頭の 切れる 人だと <ruby>評判<rt>ひょうばん</rt></ruby>で、外国を うちはらえと さけぶ 人にも、外国と 話を つけたい 人にも、期待されて いた。<br>——どちらからも 期待される 人は、どちらからも うらまれる。きみが 見た この 人の 顔いろは、家来にも 読めなかった。`,
            cite: '※ <ruby>殿<rt>との</rt></ruby>の そばで 何を 話したかを 書き残したのは、ほとんど 家来の 側だ。殿 自身の 言葉は、あまり 残って いない。' },
          onEnter: { card: 'p-yoshinobu' },
          next: '2-e' },

        '2-e': { place: '第2章 むすび',
          monologue: '（……たおす はずだった 家の、いちばん 内がわに いる。）',
          figure: 'seat',
          text: `<p>1866年。<ruby>将軍<rt>しょうぐん</rt></ruby>が <ruby>亡<rt>な</rt></ruby>くなった。あとを つぐ 人が いない。まわりは <ruby>慶喜<rt>よしのぶ</rt></ruby>を <ruby>押<rt>お</rt></ruby>した。慶喜は なんども ことわり、それでも その 年の <ruby>暮<rt>く</rt></ruby>れ、15代 将軍に なる。</p>
            <p>きみは よろこばなかった。一橋の <ruby>家来<rt>けらい</rt></ruby>だった きみは、その日から <ruby>幕臣<rt>ばくしん</rt></ruby>——将軍の 家来だ。<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子に 生まれ、外国人を 焼こうと して、いま きみは 日本で いちばん 古い 家の 中に すわって いる。</p>
            <p>きみは 一歩も 動いて いない。上の 人が 動いた。それだけで、きみの <ruby>座<rt>ざ</rt></ruby>も 動いた。</p>`,
          creed: { line: '「<ruby>敵<rt>てき</rt></ruby>の 家でも、中に 入って ものを 言う。——外から さけんで いる かぎり、何も 変わらぬ。」',
            act: '——ただ 使われる だけには なるまいと、口を きく ゆるしを もぎ取った。だが 言った さきから 返って きたのは「聞いて おく」の 一言だけ。中へ 入れて くれた 人は、もう いない。' },
          onEnter: { clue: 'clue-2' },
          end: true },
      },
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
                body: `<p>組めば、たしかに もうかった だろう。二人で <ruby>値段<rt>ねだん</rt></ruby>を 決められる 世は、大きな 会社を うんと 早く 生む。きみは <ruby>一族<rt>いちぞく</rt></ruby>の <ruby>財産<rt>ざいさん</rt></ruby>を 山の ように 積み、<ruby>三井<rt>みつい</rt></ruby>・三菱・<ruby>住友<rt>すみとも</rt></ruby>と ならぶ「渋沢<ruby>財閥<rt>ざいばつ</rt></ruby>」——一つの 家が <ruby>富<rt>とみ</rt></ruby>を にぎる 大会社の <ruby>群<rt>む</rt></ruby>れ——の <ruby>主<rt>あるじ</rt></ruby>に なって いた かもしれない。</p><p>だが その とき、あとに 続く 何百もの 会社は 生まれたか。おおぜいから 少しずつ お金を あつめて 会社を 起こす やり方を 日本に 広めたのは、きみだ。<b>史実の きみは、この 手を 取らなかった。</b></p>` } },
            { label: '断る。<ruby>株<rt>かぶ</rt></ruby>を 出し合う「みんなの 会社」で いく', to: '5-c', canon: true, effect: { rongo: 1, gappon: 2 },
              hist: { verdict: '史実では', match: '栄一は 手を 組まず、海の 道で 正面から 競った',
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
            cite: '※ 今度は 本人の 語りでは ない。おもしろい 場面ほど、あとから 足されて いる ことが ある——足したのは、身内の 手だ。' },
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
