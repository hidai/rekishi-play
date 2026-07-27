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

import type { Story } from '../../../engine/types';

// Scene ids are chapter-prefixed (e.g. '1-a') so they stay globally unique — sceneMaps /
// figures / closeup are keyed by scene id across the whole work.
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
      lead: '<ruby>攘夷<rt>じょうい</rt></ruby>を <ruby>貫<rt>つらぬ</rt></ruby>くか、外国を 開いた <ruby>将軍<rt>しょうぐん</rt></ruby>の 家・<ruby>一橋<rt>ひとつばし</rt></ruby>（<ruby>慶喜<rt>よしのぶ</rt></ruby>）に 仕えるか。村を <ruby>捨<rt>す</rt></ruby>てて <ruby>京<rt>きょう</rt></ruby>へ 出た 二人を 待って いたのは、金の 切れ目と、<ruby>追<rt>お</rt></ruby>われる 身の 知らせだった。',
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
                body: `<p>きみは 一橋家に 入った。ただの 家来では なかった。</p><p><ruby>殿<rt>との</rt></ruby>が 馬で 出かける とき、その うしろに ついて 歩き、思う ことを 言う——そういう <ruby>立場<rt>たちば</rt></ruby>を 願い出て、通した。</p>`,
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
          spark: 'え！？ 一橋の 家には、<b><ruby>城<rt>しろ</rt></ruby>が 無い</b>。<ruby>殿<rt>との</rt></ruby>は <ruby>将軍<rt>しょうぐん</rt></ruby>に なれる ほどの 家の 人なのに、土地は 国じゅうに ちらばった 村の 集まりだ。——きみが <ruby>城下町<rt>じょうかまち</rt></ruby>では なく 村を 一つずつ 歩いたのは、その ためだ。',
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
      lead: 'パリで きみは、<ruby>攘夷<rt>じょうい</rt></ruby>の 目で 外国を <ruby>拒<rt>こば</rt></ruby>むのか、それとも <ruby>銀行<rt>ぎんこう</rt></ruby>・会社・<ruby>鉄道<rt>てつどう</rt></ruby>の しくみを 学ぶのか。ふところには、自分の ものでは ない 金が ある。',
      start: '3-a',
      teaser: '<ruby>幕府<rt>ばくふ</rt></ruby>が 消えた。きみは <ruby>帰国<rt>きこく</rt></ruby>し、やがて 明治<ruby>政府<rt>せいふ</rt></ruby>に 引き入れられる。',
      scenes: {
        '3-a': { place: '<ruby>横浜<rt>よこはま</rt></ruby>の <ruby>沖<rt>おき</rt></ruby>——フランスの 船',
          monologue: '（……四年前、この <ruby>港<rt>みなと</rt></ruby>を <ruby>焼<rt>や</rt></ruby>く つもりで いた。）',
          closeup: { tone: 'warm', cast: [{ face: 'p-akitake', name: '徳川昭武' }, { face: 'p-eiichi@young', name: '栄一（きみ）' }] },
          text: `<p>1867年。<ruby>将軍<rt>しょうぐん</rt></ruby>の 弟・<ruby>徳川昭武<rt>とくがわあきたけ</rt></ruby>が、将軍の <ruby>名代<rt>みょうだい</rt></ruby>として パリの <ruby>万国博覧会<rt>ばんこくはくらんかい</rt></ruby>へ 行く。きみより 十三も 年下の、まだ 少年の <ruby>殿<rt>との</rt></ruby>だ。その お<ruby>供<rt>とも</rt></ruby>の 一人に、きみが えらばれた。</p>
            <p>役目は <ruby>刀<rt>かたな</rt></ruby>では ない。<ruby>一行<rt>いっこう</rt></ruby>の お金の 出し入れ——<ruby>勘定<rt>かんじょう</rt></ruby>だ。</p>
            <p><ruby>上海<rt>シャンハイ</rt></ruby>。<ruby>香港<rt>ホンコン</rt></ruby>。サイゴン。船は 西へ 進み、エジプトで 一行は いったん 陸に 上がった。<ruby>砂<rt>すな</rt></ruby>の 中を、二本の <ruby>鉄<rt>てつ</rt></ruby>が まっすぐに のびて いる。</p>
            <p>きみが 生まれて 初めて 見た、<ruby>鉄道<rt>てつどう</rt></ruby>だった。</p>`,
          onEnter: { card: 'p-akitake' },
          next: '3-b' },

        '3-b': { place: 'パリ——<ruby>万国博覧会<rt>ばんこくはくらんかい</rt></ruby>の <ruby>会場<rt>かいじょう</rt></ruby>',
          text: `<p>春。パリ。石の 家が どこまでも ならび、大通りは 夜に なっても ガスの 火で 明るい。会場には 世界じゅうの <ruby>品<rt>しな</rt></ruby>と 人が あつまって いた。</p>
            <p>その 中に、日本の 店が あった。——二つ。</p>
            <p>一つは <ruby>幕府<rt>ばくふ</rt></ruby>の 店。もう 一つは <ruby>薩摩<rt>さつま</rt></ruby>の 店で、こちらは 幕府に ことわりも なく、べつの 国の 名を かかげて いた。この 国の 人の 目には、日本に <ruby>王<rt>おう</rt></ruby>が 二人 いるように 見えて いる——そんな 気が した。</p>`,
          spark: 'え！？ パリの 会場に、日本の 店が <b>二つ</b> あった。<ruby>幕府<rt>ばくふ</rt></ruby>は もう、日本の ぜんぶでは なかった。',
          deep: { q: 'なぜ 日本の 店が 二つ？', confidence: '◎',
            body: `<ruby>薩摩<rt>さつま</rt></ruby>は <ruby>幕府<rt>ばくふ</rt></ruby>とは べつに <ruby>品<rt>しな</rt></ruby>を 出し、「日本 薩摩 <ruby>琉球国<rt>りゅうきゅうこく</rt></ruby> <ruby>太守政府<rt>たいしゅせいふ</rt></ruby>」と 名のった。幕府の <ruby>使<rt>つか</rt></ruby>いは 強く <ruby>抗議<rt>こうぎ</rt></ruby>したが、<ruby>会場<rt>かいじょう</rt></ruby>には 二つの「日本」が ならんだ ままだった。<br>——外国から 見れば、どちらが 日本の <ruby>代表<rt>だいひょう</rt></ruby>かは わからない。きみが 海の むこうで 見たのは、しくみだけでは なかった。<b>自分の 国が くずれかけて いる ところ</b>を、外から 見て いたのだ。` },
          next: '3-c' },

        '3-c': { place: 'パリ・<ruby>一行<rt>いっこう</rt></ruby>の <ruby>宿<rt>やど</rt></ruby>',
          closeup: { tone: 'warm', cast: [{ face: 'p-banker', name: '銀行の 人' }, { face: 'p-officer', name: '軍の 人' }] },
          text: `<p><ruby>一行<rt>いっこう</rt></ruby>の 世話を する <ruby>銀行<rt>ぎんこう</rt></ruby>の 人と、つきそいの <ruby>軍<rt>ぐん</rt></ruby>の 人。二人は 同じ <ruby>机<rt>つくえ</rt></ruby>に つき、同じ 高さで 言い合い、そして 笑った。日本なら、<ruby>侍<rt>さむらい</rt></ruby>と <ruby>商人<rt>あきんど</rt></ruby>だ。</p>
            <p class="speak">「——あの お二人は、どちらが 上なのですか。」</p>
            <p>銀行の 人は、問いの 意味が わからない という 顔を した。そして 言った。「<ruby>殿<rt>との</rt></ruby>の 学びは 長く なる。<ruby>箱<rt>はこ</rt></ruby>の 中の 金は、使えば 減る だけだ。うちに あずけては どうか。」</p>
            <p class="speak">「——もし へったら、だれが つぐなうのですか。」</p>
            <p>「へった ことは ありません。」——笑って、そう 答えた。</p>
            <p>あずかって いるのは、きみの 金では ない。</p>`,
          deep: { q: 'なぜ 二人が 同じ 高さだと おどろくの？', confidence: '○',
            body: `日本では 生まれた 家で <ruby>身分<rt>みぶん</rt></ruby>が 決まり、<ruby>侍<rt>さむらい</rt></ruby>と <ruby>商人<rt>あきんど</rt></ruby>は 同じ <ruby>机<rt>つくえ</rt></ruby>に つかない。きみ 自身、<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子だと いう だけで <ruby>代官所<rt>だいかんしょ</rt></ruby>に 笑われて いる（第1章）。<br>その きみが、お金を 動かす 人と <ruby>戦<rt>いくさ</rt></ruby>の 人が <ruby>対等<rt>たいとう</rt></ruby>に しゃべる 国を 見た。<b>のちの きみの やり方は、ここで 見た ものに よく 似て いる</b>。`,
            cite: '※ この おどろきを 伝えて いるのは、年を とった きみの 語りだ。「あの 日 わたしは こう 思った」は、あとから いくらでも きれいに なる。' },
          q: 'あずかった 金を、どう する？',
          choices: [
            { label: 'ことわる。<ruby>殿<rt>との</rt></ruby>の 金を 外国の 紙に <ruby>換<rt>か</rt></ruby>えられない', to: '3-d', effect: { rongo: 2 },
              hist: { verdict: 'もしもルート', moshimo: true, match: '——<ruby>箱<rt>はこ</rt></ruby>の まま 守った 金は、どう なるか',
                body: `<p>あずけなければ、金は だれの 手にも わたらない。減る ときも 自分の 目の 前で 減る。<ruby>預<rt>あず</rt></ruby>かり物の 守り方として、これ以上 正しい やり方は ない。</p><p>だが 日本からの <ruby>送金<rt>そうきん</rt></ruby>は、この 先 ぱたりと 止まる。<ruby>幕府<rt>ばくふ</rt></ruby>そのものが 消えるからだ。<ruby>箱<rt>はこ</rt></ruby>の 底が 見えた とき、<ruby>一行<rt>いっこう</rt></ruby>に できるのは 帰りの <ruby>船賃<rt>ふなちん</rt></ruby>を どこかに 借りる ことだけ。パリの しくみは、ながめただけの <ruby>見世物<rt>みせもの</rt></ruby>で 終わる。</p><p>この 道を、パリの きみは えらばなかった。</p>` } },
            { label: 'あずける。<ruby>紙<rt>かみ</rt></ruby>に <ruby>換<rt>か</rt></ruby>えて、しくみの 中に 入って みる', to: '3-d', canon: true, effect: { soroban: 2, gappon: 1 },
              hist: { verdict: '史実では', match: '<ruby>栄一<rt>えいいち</rt></ruby>は 金を あずけ、<ruby>紙<rt>かみ</rt></ruby>に <ruby>換<rt>か</rt></ruby>えた',
                body: `<p>きみは <ruby>一行<rt>いっこう</rt></ruby>の 金を <ruby>銀行<rt>ぎんこう</rt></ruby>に あずけ、その 多くを <ruby>二種類<rt>にしゅるい</rt></ruby>の 紙に <ruby>換<rt>か</rt></ruby>えた。国が お金を 借りた しるしの 紙と、<ruby>鉄道<rt>てつどう</rt></ruby>の 会社が 借りた しるしの 紙。ねむって いた 金に、<ruby>利<rt>り</rt></ruby>が つきはじめる。</p><p>同じ ころ、きみは <ruby>髷<rt>まげ</rt></ruby>を 切り、<ruby>洋服<rt>ようふく</rt></ruby>を 着た。四年前に <ruby>焼<rt>や</rt></ruby>こうと して いた 国の <ruby>服<rt>ふく</rt></ruby>だ。</p>`,
                source: { grade: 'contemporary', name: 'パリで つけて いた <ruby>日記<rt>にっき</rt></ruby>（『<ruby>巴里御在館日記<rt>パリございかんにっき</rt></ruby>』）',
                  note: 'パリに いた あいだ、きみが 日ごとに つけて いた 役目の 日記。この 作品で 初めて 出て くる「その とき 書かれた 紙」だ。——本に なった『<ruby>航西日記<rt>こうせいにっき</rt></ruby>』は べつの <ruby>冊<rt>さつ</rt></ruby>で、行きの 船から <ruby>万国博覧会<rt>ばんこくはくらんかい</rt></ruby>までの 1867年の ぶん。しかも きみ 一人の 日記では なく、同じ 旅の <ruby>杉浦愛蔵<rt>すぎうらあいぞう</rt></ruby>の 日記と 合わせて <ruby>編<rt>あ</rt></ruby>まれたと 言われる。' } } },
          ] },

        '3-d': { place: 'パリ——1868年',
          monologue: '（……帰る ところが、ひとつずつ 消えて いく。）',
          closeup: { tone: 'grief', cast: [{ face: 'p-eiichi@prime', name: '栄一（きみ）' }, { face: 'p-akitake@paris', name: '徳川昭武' }] },
          text: `<p>日本からの <ruby>便<rt>たよ</rt></ruby>りは、来るたびに わるく なった。<ruby>将軍<rt>しょうぐん</rt></ruby>は <ruby>政<rt>まつりごと</rt></ruby>を 返した。<ruby>鳥羽<rt>とば</rt></ruby>・<ruby>伏見<rt>ふしみ</rt></ruby>で <ruby>幕府<rt>ばくふ</rt></ruby>がわが 負けた。</p>
            <p>そして 新しい <ruby>政府<rt>せいふ</rt></ruby>から <ruby>命令<rt>めいれい</rt></ruby>が 来る。——帰れ。</p>
            <p><ruby>殿<rt>との</rt></ruby>が、小さな 声で 言った。</p>
            <p class="speak">「——まだ、なにも 学んで いない。」</p>
            <p>学びは 半ばで 終わった。<ruby>送金<rt>そうきん</rt></ruby>は とうに 止まって いる。それでも <ruby>一行<rt>いっこう</rt></ruby>は 船に 乗れた。あずけた 金が、ねむらずに 働いて いた。</p>`,
          spark: 'え！？ 国が 消えても、あずけた お金は <b>減らずに ふえて いた</b>。きみが 日本へ 持ち帰った いちばん 大きな <ruby>品<rt>しな</rt></ruby>は、<ruby>品物<rt>しなもの</rt></ruby>では なく しくみだった。',
          deep: { q: 'あずけると、なぜ ふえるの？', confidence: '◎',
            body: `<ruby>銀行<rt>ぎんこう</rt></ruby>は、あずかった お金を <ruby>眠<rt>ねむ</rt></ruby>らせない。それを 必要な 人へ 貸し、<ruby>利<rt>り</rt></ruby>を つけて 返して もらう。国も 会社も、その 紙を 出して お金を 借りる——「かならず 返します」と 書いた 紙だ。買った 人には 利が つき、借りた 国や 会社は <ruby>鉄道<rt>てつどう</rt></ruby>を <ruby>敷<rt>し</rt></ruby>ける。<br>お金は <ruby>箱<rt>はこ</rt></ruby>の 中では 何も しないが、人の あいだを 回ると 仕事を する。<b>きみは 自分の 手で それを ためした 数少ない 日本人</b>に なった。`,
            cite: '※ もっとも、それは 人の 金だった。うまく いかなければ、<ruby>預<rt>あず</rt></ruby>かり物を 減らした 男に なって いた。——なお、この とき <ruby>殿<rt>との</rt></ruby>が 何と 言ったかを 書きとめた 紙は、<ruby>無<rt>な</rt></ruby>い。' },
          onEnter: { card: 'w-ginko' },
          next: '3-e' },

        '3-e': { place: '第3章 むすび——<ruby>静岡<rt>しずおか</rt></ruby>',
          monologue: '（……あの 人は、もう <ruby>殿<rt>との</rt></ruby>では ない。）',
          closeup: { tone: 'solemn', cast: [{ face: 'p-yoshinobu', name: '徳川慶喜' }, { face: 'p-eiichi@prime', name: '栄一（きみ）' }] },
          text: `<p>1868年の <ruby>暮<rt>く</rt></ruby>れ、<ruby>横浜<rt>よこはま</rt></ruby>に 着いた。二年ぶりの 国は、みやこの 名も、上に 立つ 人も 変わって いた。<ruby>江戸<rt>えど</rt></ruby>は <ruby>東京<rt>とうきょう</rt></ruby>に なって いた。</p>
            <p><ruby>慶喜<rt>よしのぶ</rt></ruby>は <ruby>静岡<rt>しずおか</rt></ruby>の 寺に いた。<ruby>将軍<rt>しょうぐん</rt></ruby>でも なく、<ruby>朝敵<rt>ちょうてき</rt></ruby>と <ruby>呼<rt>よ</rt></ruby>ばれ、人に 会わずに <ruby>暮<rt>く</rt></ruby>らして いる。きみは <ruby>洋服<rt>ようふく</rt></ruby>の まま その 前に すわり、あずかった 金の <ruby>帳<rt>ちょう</rt></ruby>を 出して、二年ぶんの <ruby>報告<rt>ほうこく</rt></ruby>を した。</p>
            <p>その 冬、きみは 静岡に <ruby>残<rt>のこ</rt></ruby>る。<ruby>藩<rt>はん</rt></ruby>の お金と、土地の <ruby>商人<rt>しょうにん</rt></ruby>たちの お金を 出し合わせて、米や お茶を 動かし、<ruby>貸<rt>か</rt></ruby>し付けも する ——<ruby>商法会所<rt>しょうほうかいしょ</rt></ruby>。パリで 見た あの しくみの、いちばん 小さな ものだ。</p>`,
          creed: { line: '「<ruby>焼<rt>や</rt></ruby>こうと した 国に、答えが あった。——見て しまった からには、<ruby>持<rt>も</rt></ruby>ち帰る。」',
            act: '——<ruby>髷<rt>まげ</rt></ruby>を 落とし、人から あずかった 金を 見たばかりの <ruby>紙<rt>かみ</rt></ruby>に <ruby>換<rt>か</rt></ruby>えた。<ruby>刀<rt>かたな</rt></ruby>を 買う ために 集めた 金で 始まった 道が、いまは 紙を 買う 手で 続いて いる。' },
          onEnter: { clue: 'clue-3' },
          end: true },
      },
    },
    {
      id: 4, num: '四', title: '官を すてる', years: '1869〜1873',
      lead: 'エリートの <ruby>役人<rt>やくにん</rt></ruby>として <ruby>大蔵省<rt>おおくらしょう</rt></ruby>に 残るか、<ruby>民<rt>みん</rt></ruby>に 下って 日本で 最初の <ruby>銀行<rt>ぎんこう</rt></ruby>を つくるか。上から 命じる 側の <ruby>椅子<rt>いす</rt></ruby>を、自分で おりるのか。',
      start: '4-a',
      teaser: '<ruby>民間<rt>みんかん</rt></ruby>の <ruby>実業家<rt>じつぎょうか</rt></ruby>に なった きみに、<ruby>三菱<rt>みつびし</rt></ruby>の <ruby>岩崎<rt>いわさき</rt></ruby>が 声を かけて くる。',
      scenes: {
        '4-a': { place: '<ruby>静岡<rt>しずおか</rt></ruby>——<ruby>商法会所<rt>しょうほうかいしょ</rt></ruby>',
          monologue: '（……<ruby>殿<rt>との</rt></ruby>を <ruby>朝敵<rt>ちょうてき</rt></ruby>と 呼んだ 側から、呼ばれて いる。）',
          text: `<p>1869年。<ruby>静岡<rt>しずおか</rt></ruby>で 始めた しくみは、少しずつ 回って いた。</p>
            <p>そこへ、<ruby>東京<rt>とうきょう</rt></ruby>の 新しい <ruby>政府<rt>せいふ</rt></ruby>から 紙が 一枚 来た。——出て きて、国の <ruby>役人<rt>やくにん</rt></ruby>に なれ。</p>
            <p>相談も、たのみも 無い。ただの <ruby>命令<rt>めいれい</rt></ruby>だった。</p>
            <p>きみは ことわる つもりで、東京へ 向かった。</p>`,
          next: '4-b' },

        '4-b': { place: '東京——<ruby>大隈<rt>おおくま</rt></ruby>の <ruby>屋敷<rt>やしき</rt></ruby>',
          closeup: { tone: 'warm', cast: [{ face: 'p-okuma', name: '大隈重信' }, { face: 'p-eiichi@prime', name: '栄一（きみ）' }] },
          text: `<p><ruby>大隈重信<rt>おおくましげのぶ</rt></ruby>。<ruby>肥前<rt>ひぜん</rt></ruby>から 出た、よく しゃべる 人だ。</p>
            <p class="speak">「この 国には 神さまが <ruby>八百万<rt>やおよろず</rt></ruby> いる。みんなで 集まって 相談し、国を つくった。新しい 国を つくるのも 同じ ことだ。——<ruby>渋沢<rt>しぶさわ</rt></ruby>さん、あんたも その 一<ruby>柱<rt>はしら</rt></ruby>だ。」</p>
            <p class="speak">「……わたしは <ruby>算盤<rt>そろばん</rt></ruby>より ほかに、何も 持って いません。」</p>
            <p class="speak">「その 算盤が、この 国に 無いのだ。」</p>
            <p>ことわる ために 入った 部屋を 出る とき、<ruby>栄一<rt>えいいち</rt></ruby>は もう 仕事の 話を して いた。</p>`,
          deep: { q: 'なぜ <ruby>敵<rt>てき</rt></ruby>だった 側の 人を <ruby>役人<rt>やくにん</rt></ruby>に したの？', confidence: '○',
            body: `新しい 政府は、人が 足りなかった。<ruby>薩摩<rt>さつま</rt></ruby>・<ruby>長州<rt>ちょうしゅう</rt></ruby>の <ruby>侍<rt>さむらい</rt></ruby>だけでは、国の お金も ますの 大きさも 動かせない。だから <ruby>徳川<rt>とくがわ</rt></ruby>の <ruby>家来<rt>けらい</rt></ruby>だった 者も 使った。海の むこうの しくみを 自分の 手で ためした 日本人は、この とき 数えるほどしか いない。<br>——なお、きみが 呼ばれた ときの 役所の 名は <ruby>民部省<rt>みんぶしょう</rt></ruby>。のちに <ruby>大蔵省<rt>おおくらしょう</rt></ruby>と 一つに なる。`,
            cite: '※ 「<ruby>八百万<rt>やおよろず</rt></ruby>の 神」の この 話が たどれるのは、45年ほど あとに きみが 語った 思い出だ。しかも のせたのは、きみを <ruby>敬<rt>うやま</rt></ruby>う 人たちが 出して いた <ruby>雑誌<rt>ざっし</rt></ruby>——『<ruby>竜門雑誌<rt>りゅうもんざっし</rt></ruby>』。' },
          onEnter: { card: 'p-okuma' },
          next: '4-c' },

        '4-c': { place: '東京・<ruby>改正掛<rt>かいせいがかり</rt></ruby>の 部屋',
          closeup: { tone: 'warm', cast: [{ face: 'p-junchu', name: '尾高惇忠' }, { face: 'p-eiichi@prime', name: '栄一（きみ）' }] },
          text: `<p>きみは 役所の 中に 部屋を 一つ つくらせた。<ruby>改正掛<rt>かいせいがかり</rt></ruby>——国じゅうの <ruby>物差<rt>ものさ</rt></ruby>しを 決める 部屋だ。ますの 大きさ。<ruby>郵便<rt>ゆうびん</rt></ruby>。<ruby>鉄道<rt>てつどう</rt></ruby>。パリで 見た ものが、紙に のって いく。</p>
            <p>その 一つが、<ruby>生糸<rt>きいと</rt></ruby>を <ruby>機械<rt>きかい</rt></ruby>で つくる 工場。<ruby>富岡<rt>とみおか</rt></ruby>——<ruby>血洗島<rt>ちあらいじま</rt></ruby>から 川を こえて 西へ 四十キロ。</p>
            <p>かしらに、きみは 一人の 名を 出した。朝ごとに『<ruby>論語<rt>ろんご</rt></ruby>』を 教え、<ruby>横浜<rt>よこはま</rt></ruby>を 焼こうと 言った、あの <ruby>従兄<rt>いとこ</rt></ruby>。</p>
            <p class="speak">「わしは 糸の 機械など 見た ことも 無い。」</p>
            <p class="speak">「わたしも、<ruby>銀行<rt>ぎんこう</rt></ruby>を 見たのは たった 一度きりでした。」</p>`,
          spark: 'え！？ 国で いちばん 新しい 工場の かしらに なったのは、<b>きみに『<ruby>論語<rt>ろんご</rt></ruby>』を 教えた 村の <ruby>従兄<rt>いとこ</rt></ruby></b>だった。',
          deep: { q: '<ruby>工女<rt>こうじょ</rt></ruby>は 集まったの？', confidence: '☆',
            body: `「あの 工場では フランス人が 生き血を 飲む」——赤い ぶどう酒を 見た 人の 話が うわさに なり、<ruby>娘<rt>むすめ</rt></ruby>を 出す 家が なかった。そこで <ruby>惇忠<rt>じゅんちゅう</rt></ruby>は 自分の 娘を 最初の 工女に した——と 語りつがれて いる。<br>ただし、この 話を その ころの 紙で たしかめる ことは、まだ できて いない。☆＝あとの 世の 語り。工場が 建ち、その 娘が そこで 働いた ことは たしかだ。`,
            cite: '※ たしかなのは、この 工場を まかされたのが 惇忠だった ことまで。二人の やりとりは、どちらの 側にも 書き残されて いない。' },
          next: '4-d' },

        // ★ 場面の 並びは 年代順（1871年8月 → 1872年正月 → 1873年夏）。大久保との 予算論争を 1873年春に
        // 置くと 岩倉使節団で 不在の 人物を 登場させる ことに なる（research §7-E）。
        '4-d': { place: '東京・<ruby>大蔵省<rt>おおくらしょう</rt></ruby>——1871年の 秋',
          closeup: { tone: 'tense', cast: [{ face: 'p-okubo', name: '大久保利通' }, { face: 'p-eiichi@prime', name: '栄一（きみ）' }] },
          text: `<p>広い 部屋で、<ruby>大久保利通<rt>おおくぼとしみち</rt></ruby>が 数を 出した。<ruby>陸軍<rt>りくぐん</rt></ruby>に 800万<ruby>円<rt>えん</rt></ruby>。<ruby>海軍<rt>かいぐん</rt></ruby>に 250万円。</p>
            <p class="speak">「弱い 国は、なめられる。——金は 出す。」</p>
            <p>きみは <ruby>帳<rt>ちょう</rt></ruby>を ひらいた。国に いくら 入って くるのかは、まだ だれも 数えて いない。</p>
            <p class="speak">「入る 金が いくらか 決まらぬ うちに 出る 金だけ 決める 家は、つぶれます。」</p>
            <p>数は 通った。きみは その 足で、上司の <ruby>井上馨<rt>いのうえかおる</rt></ruby>の 部屋へ 向かった。</p>`,
          deep: { q: 'この 数は たしかなの？', confidence: '△',
            body: `二人が その 場で 何と 言い合ったかを たどると、あとから きみが 語った 話に ゆきつく（△）。<br>——だが 数の ほうは ちがう。のちに 役所を やめる とき、きみと <ruby>井上<rt>いのうえ</rt></ruby>は 入る 金と 出る 金を ならべた 文を 書き、その 年の <ruby>新聞<rt>しんぶん</rt></ruby>に のせた。入る 4000万<ruby>円<rt>えん</rt></ruby>、出る 5000万円。足りない 1000万円を どこから 出すのか、と。`,
            cite: '※ 言葉の 出どころは 回想、数の 出どころは その 年の 紙。同じ 場面でも、たしかさは 一つずつ ちがう。' },
          onEnter: { cards: ['p-okubo', 'p-inoue'] },
          q: 'きみは どう する？',
          choices: [
            { label: '<ruby>役人<rt>やくにん</rt></ruby>で 残る。国じゅうの お金を 動かせる 席を 手ばなさない', to: '4-e', effect: { rongo: 1, soroban: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし あの 席に すわり つづけて いたら……',
                body: `<p>残れば、きみの 手には 国じゅうの お金が ある。ますも <ruby>税<rt>ぜい</rt></ruby>も <ruby>鉄道<rt>てつどう</rt></ruby>も、上から 決められる。位も 上がる。</p><p>二年 のちの 秋、<ruby>政府<rt>せいふ</rt></ruby>は <ruby>朝鮮<rt>ちょうせん</rt></ruby>を めぐって まっぷたつに 割れる。役所の 中に いる かぎり、きみも どちらかの 側に 数えられる。やがて <ruby>兜町<rt>かぶとちょう</rt></ruby>では <ruby>三井<rt>みつい</rt></ruby>と <ruby>小野<rt>おの</rt></ruby>の 二つの <ruby>商家<rt>しょうか</rt></ruby>が <ruby>銀行<rt>ぎんこう</rt></ruby>を 始める——あいだに 立つ 者が いなければ、それは 二つの 家の <ruby>金蔵<rt>かなぐら</rt></ruby>の ままだ。</p><p>——そして その 銀行に、きみの 名は 無い。</p>` } },
            { label: '<ruby>官<rt>かん</rt></ruby>を すてる。下から、みんなの お金で 会社を つくる', to: '4-e', canon: true, effect: { rongo: 1, gappon: 2 },
              hist: { verdict: '史実では', match: '——二人の <ruby>辞表<rt>じひょう</rt></ruby>と、新聞に 出た 国の <ruby>数字<rt>すうじ</rt></ruby>',
                body: `<p>きみは その 場で「やめます」と 言った。<ruby>井上<rt>いのうえ</rt></ruby>に 止められ、二年 ちかく 残る。</p><p>そして 1873年の 5月、こんどは 二人 そろって 辞表を 出した。入る 金と 出る 金を ならべた 文を 書き、<ruby>新聞<rt>しんぶん</rt></ruby>に のせる。国の <ruby>台所<rt>だいどころ</rt></ruby>の 中身が、はじめて 世間の 目に さらされた。</p><p><ruby>政府<rt>せいふ</rt></ruby>は 怒った。<ruby>役人<rt>やくにん</rt></ruby>が 中の ことを 外へ 出すのは 決まり<ruby>破<rt>やぶ</rt></ruby>りだ——きみには <ruby>罰金<rt>ばっきん</rt></ruby>が 科された。</p><p>この ころ、<ruby>官<rt>かん</rt></ruby>を 出る ことは「下がる」ことだった。上に 立つ 者が 役人で、<ruby>商<rt>あきな</rt></ruby>いを する 者は その 下。<b>きみは 自分から 下りた。</b></p>`,
                source: { grade: 'contemporary', name: '新聞に のった <ruby>建言書<rt>けんげんしょ</rt></ruby>（1873年5月）',
                  note: 'きみと 井上が 役所を やめる まぎわに 書き、その 年の 新聞に のった 文。年を とって から 思い出して 語った 話では なく、その とき 刷られて 世に 出た 紙だ。——だから、この 数字は きみの <ruby>記憶<rt>きおく</rt></ruby>に よりかかって いない。' } } },
          ] },

        '4-e': { place: '東京——<ruby>牢<rt>ろう</rt></ruby>の 戸が ひらいた 日',
          monologue: '（……この 人が 負けて いる あいだ、わたしは 海を 見て いた。）',
          closeup: { tone: 'grief', cast: [{ face: 'p-kisaku', name: '渋沢喜作' }, { face: 'p-eiichi@prime', name: '栄一（きみ）' }] },
          text: `<p>話は 少し もどる。1872年の 正月、<ruby>喜作<rt>きさく</rt></ruby>が 出て きた。</p>
            <p>同じ 夜に 刀を 買い、同じ 道を <ruby>京<rt>きょう</rt></ruby>へ 上った <ruby>従兄<rt>いとこ</rt></ruby>だ。<ruby>幕府<rt>ばくふ</rt></ruby>が たおれた あと、この 人は 最後まで 戦う 側に いた。<ruby>飯能<rt>はんのう</rt></ruby>で 敗れ、<ruby>箱館<rt>はこだて</rt></ruby>で 手を あげた。それから 二年半、<ruby>獄<rt>ごく</rt></ruby>の 中。</p>
            <p>きみは <ruby>洋服<rt>ようふく</rt></ruby>で、その 前に 立って いる。</p>
            <p class="speak">「……お前は、ずいぶん 遠くまで 行った ものだな。」</p>
            <p>きみは この 人を 役所に 入れた。<ruby>蚕<rt>かいこ</rt></ruby>と <ruby>生糸<rt>きいと</rt></ruby>の 役だ。やがて 喜作も 海を わたる——きみが 見た 国を、こんどは 自分の 目で 見る。</p>`,
          deep: { q: '<ruby>負<rt>ま</rt></ruby>けた 側の 人は、どう なったの？', confidence: '○',
            body: `<ruby>戊辰<rt>ぼしん</rt></ruby>の 戦に 負けた 側の 者は、罪を ゆるされた あとも 行き場が なかった。新しい 政府は <ruby>敵<rt>てき</rt></ruby>だった 者も 使ったが、それは 使える 力の ある 者に かぎられる。<ruby>喜作<rt>きさく</rt></ruby>は ゆるされ、きみの 世話で 役所に 入り、のちに 自分で <ruby>生糸<rt>きいと</rt></ruby>を 売る 商人に なった。<br>——同じ 家に 生まれ、同じ 夜に 刀を 買った 二人の 道は、九年 かかって もう 一度 交わった。`,
            cite: '※ この 日 二人が 何を 言い合ったかを 書きとめた 紙は 無い。分かって いるのは、<ruby>赦<rt>ゆる</rt></ruby>された 日づけと、そのあと 役所に 入った ことだけだ。' },
          next: '4-f' },

        '4-f': { place: '第4章 むすび——東京・<ruby>兜町<rt>かぶとちょう</rt></ruby>',
          monologue: '（……ここから 先は、だれの <ruby>命令<rt>めいれい</rt></ruby>でも ない。）',
          figure: 'seatDown',
          text: `<p>1873年の 夏、<ruby>兜町<rt>かぶとちょう</rt></ruby>に 銀行が ひらいた。<ruby>第一国立銀行<rt>だいいちこくりつぎんこう</rt></ruby>——国の 決まりで つくられた、日本で 最初の 銀行だ。</p>
            <p>お金を 出したのは 国では ない。<ruby>三井<rt>みつい</rt></ruby>と <ruby>小野<rt>おの</rt></ruby>——<ruby>江戸<rt>えど</rt></ruby>の 昔から つづく 二つの <ruby>商家<rt>しょうか</rt></ruby>だ。<ruby>頭取<rt>とうどり</rt></ruby>は その 二つの 家から 一人ずつ。きみは <ruby>総監役<rt>そうかんやく</rt></ruby>、あいだに 立つ 役だ。</p>
            <p>役所の <ruby>椅子<rt>いす</rt></ruby>には、命じる 力が あった。この 椅子に あるのは、人に 頭を 下げて お金を 出して もらう 手だけだ。</p>
            <p>やがて <ruby>喜作<rt>きさく</rt></ruby>も 役所を 出た。</p>`,
          creed: { line: '「<ruby>官<rt>かん</rt></ruby>が 上で、<ruby>商<rt>あきな</rt></ruby>いが 下か。——ならば わたしは、下から やる。」',
            act: '——<ruby>殿<rt>との</rt></ruby>に 呼ばれて 入った 役所を、こんどは 自分の 足で 出た。<ruby>静岡<rt>しずおか</rt></ruby>で ためした いちばん 小さな しくみを、いま 日本の まん中に 立てて いる。' },
          onEnter: { clue: 'clue-4' },
          end: true },
      },
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
          spark: 'え！？ <ruby>三菱<rt>みつびし</rt></ruby>が 海を にぎれた その 後ろには、<ruby>政府<rt>せいふ</rt></ruby>が 自分の <ruby>汽船<rt>きせん</rt></ruby>を <b>ただで 岩崎に わたした</b> ことが ある。強い 会社は、国の 手で つくられる ことも ある。',
          deep: { q: '<ruby>三菱<rt>みつびし</rt></ruby>は なぜ そんなに 強い？', confidence: '◎',
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
      lead: '<ruby>旧主<rt>きゅうしゅ</rt></ruby>・<ruby>慶喜<rt>よしのぶ</rt></ruby>は <ruby>静岡<rt>しずおか</rt></ruby>で だまった まま 二十年を すごし、世間は その 人を「<ruby>逃<rt>に</rt></ruby>げた <ruby>将軍<rt>しょうぐん</rt></ruby>」と 呼ぶ。きみは いま 動いて いる 世の ほうだけを 生きるのか。それとも、もう 何の 力も 持たない 人の ために 年月を つかうのか。',
      start: '6-a',
      teaser: 'そして この 人の 顔は、やがて 一万円札に なる。——きみは、どう 思う？',
      scenes: {
        // 章六の 装置は closeup／cite（design §2・§3）＋ ★M ミニゲーム。ミニゲームは この 章の
        // 主題（史料批判の 階段の 最上段＝「残って いる 紙を 読む」から「たずねて 紙を 作る」へ）を
        // 手で なぞらせる ためのもので、飾りでは ない（register ㉗＝手を動かす装置を 章六か終章に1つ）。
        // 地図は 置かない: 本作で 地図が 主装置に 立つのは ch3/ch4 の 2章だけ（design §3 の 契約）。
        '6-a': { place: '東京——1893年',
          monologue: '（……あの 人は、まだ 何も 言って いない。）',
          // 名札は まだ 名を 出さない: 本文が「きみに『聞いて おく』とだけ 答えた、あの 殿だ」で
          // 明かすのに、絵が 先に 名前を 言うと その 一拍が 空振りする（中1ペルソナ）。
          closeup: { tone: 'solemn', cast: [{ face: 'p-yoshinobu@old', name: 'だまって いる 人' }] },
          text: `<p>きみは 53さい。<ruby>会社<rt>かいしゃ</rt></ruby>は 数えきれぬ ほどに なり、<ruby>国<rt>くに</rt></ruby>から <ruby>位<rt>くらい</rt></ruby>も もらった。</p>
            <p>その ころ 出まわる 本や <ruby>新聞<rt>しんぶん</rt></ruby>に、一人の 男の ことが くりかえし 出て くる。<ruby>鳥羽<rt>とば</rt></ruby>・<ruby>伏見<rt>ふしみ</rt></ruby>の <ruby>戦<rt>いくさ</rt></ruby>の さいちゅうに、兵を 大坂に 残した まま 船で <ruby>江戸<rt>えど</rt></ruby>へ もどった 男。——<ruby>味方<rt>みかた</rt></ruby>からも <ruby>敵<rt>てき</rt></ruby>からも 責められた。</p>
            <p>その 人は <ruby>静岡<rt>しずおか</rt></ruby>に いた。人に ほとんど 会わず、二十年 あまり、ひとことも 言い返して いない。</p>
            <p>きみに「<ruby>聞<rt>き</rt></ruby>いて おく」とだけ 答えた、あの <ruby>殿<rt>との</rt></ruby>だ。</p>`,
          spark: 'え！？ だまって いた その あいだ、この 人が うちこんで いたのは <b><ruby>写真<rt>しゃしん</rt></ruby></b>だった。',
          deep: { q: 'なぜ そんなに 責められたの？', confidence: '○',
            body: `1868年の 正月、<ruby>鳥羽<rt>とば</rt></ruby>・<ruby>伏見<rt>ふしみ</rt></ruby>で <ruby>幕府<rt>ばくふ</rt></ruby>がわが 負けた。<ruby>慶喜<rt>よしのぶ</rt></ruby>は 兵を 大坂に 置いた まま、船で <ruby>江戸<rt>えど</rt></ruby>へ もどる。上に 立つ 人が 先に 下がった——これを「敵の 前から 逃げた」と、味方も 敵も 責めた。<br>やがて <ruby>江戸城<rt>えどじょう</rt></ruby>は 明けわたされ、大きな 町は 焼けずに すんだ。同じ 一つの 決めごとが、<ruby>臆病<rt>おくびょう</rt></ruby>とも、町を 守った とも 読める。`,
            cite: '※「<ruby>臆病者<rt>おくびょうもの</rt></ruby>」という 呼び方が その ころ どれだけ あったかを、当時の 紙で たしかめる ことは まだ できて いない。あとの 世の 本が くりかえす うちに 大きく なった 言い方かも しれない。' },
          next: '6-b' },

        // ★G7: 二人の やりとりは 創作。同じ 画面に 史料装置を 置く（register ㉑）——deep の cite が
        // 「断った ときの 言葉を 書きとめた 紙は 無い」と 名指す（4-c/3-d と同じ家の作法）。
        '6-b': { place: '<ruby>静岡<rt>しずおか</rt></ruby>——<ruby>旧主<rt>きゅうしゅ</rt></ruby>の まえ',
          closeup: { tone: 'tense', cast: [{ face: 'p-yoshinobu@old', name: '徳川慶喜' }, { face: 'p-eiichi', name: '栄一（きみ）' }] },
          text: `<p>きみは <ruby>静岡<rt>しずおか</rt></ruby>へ 行き、その 前に すわった。</p>
            <p class="speak">「<ruby>殿<rt>との</rt></ruby>の 一生を、書き<ruby>残<rt>のこ</rt></ruby>させて ください。あの 日、なぜ 大坂を 出られたのか。だれも 書かねば、<ruby>勝<rt>か</rt></ruby>った 側の 話だけが 残ります。」</p>
            <p>ながい あいだ、返事は なかった。</p>
            <p class="speak">「——よして くれ。わしの ことは、もう よい。」</p>
            <p><ruby>顔<rt>かお</rt></ruby>いろは 三十年 前と 同じで、やはり 読めない。</p>
            <p>この 人には もう、何の 力も ない。そして きみの 手もとには、生まれかけの 会社が いくつも ある。この 本に かける 年月は、そのぶん どこかの 会社を 起こせない 年月だ。</p>`,
          deep: { q: 'だれに 書いて もらうつもり だったの？', confidence: '○',
            body: `はじめに たのんだのは、<ruby>新聞<rt>しんぶん</rt></ruby>で 名の 知れた 書き手だった。だが その 人は 仕事に <ruby>追<rt>お</rt></ruby>われ、<ruby>病<rt>やまい</rt></ruby>を えて、書きあがらないまま 世を さる。<br>1907年、こんどは <ruby>大学<rt>だいがく</rt></ruby>の <ruby>学者<rt>がくしゃ</rt></ruby>たちが 引きついだ。集める 紙は <ruby>幕府<rt>ばくふ</rt></ruby>の 記録、<ruby>諸藩<rt>しょはん</rt></ruby>の 記録、外国の 書きもの——十年 かけても 終わらない。`,
            cite: '※ <ruby>慶喜<rt>よしのぶ</rt></ruby>が しぶった ことを 伝えて いるのは、あとから 書かれた 説明だ。この 日 二人が たがいに 何と 言ったのかを その場で 書きとめた 紙は、どちらの 側にも 見つかって いない。' },
          q: 'きみは どう する？',
          choices: [
            { label: '今の 世だけを 生きる。その 年月で、会社を もう いくつ 起こせる', to: '6-c', effect: { soroban: 2, gappon: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし あの 家の 戸を、二度と たたかなかったら……',
                body: `<p>だれが 困るだろう。<ruby>慶喜<rt>よしのぶ</rt></ruby>は 静かに 一生を 終える。きみの 会社は 一つも 減らない。</p><p>困る 人は、いない。——ただ、あの日 大坂で 何が あったかを 知って いる 人が、一人ずつ いなく なる。<ruby>幕府<rt>ばくふ</rt></ruby>の 側の 紙は <ruby>戦<rt>いくさ</rt></ruby>で ちらばり、残った ものも <ruby>蔵<rt>くら</rt></ruby>の 奥で ねむった ままだ。</p><p>五十年 たった とき、<ruby>読<rt>よ</rt></ruby>める 話は 一つ しか 残って いない。<b>勝った 側が 書いた ほうだ。</b></p>` } },
            { label: '書く。何年 かかっても、その ころの 紙を 集める', to: '6-c', canon: true, effect: { rongo: 2 },
              hist: { verdict: '史実では', match: '——<ruby>栄一<rt>えいいち</rt></ruby>は 引かず、二十五年を つかう ことに なる',
                body: `<p>きみは かよいつづけ、しぶる <ruby>旧主<rt>きゅうしゅ</rt></ruby>から とうとう「話す」という 返事を もらった。</p><p>紙は いくら 集めても 足りない。<ruby>幕府<rt>ばくふ</rt></ruby>の 記録は <ruby>戦<rt>いくさ</rt></ruby>で ちらばり、残った ものも 食いちがう。書き手は いなく なり、十年が すぎた。</p><p>そして きみは、どこの <ruby>蔵<rt>くら</rt></ruby>にも 無い ものが まだ 生きて いる ことに 気づく。<b>その場に いた 本人だ。</b></p>`,
                source: { grade: 'later', name: '<ruby>渋沢史料館<rt>しぶさわしりょうかん</rt></ruby>の <ruby>解説<rt>かいせつ</rt></ruby>',
                  note: '「1893年ごろ、<ruby>渋沢栄一<rt>しぶさわえいいち</rt></ruby>は 旧主の <ruby>伝記<rt>でんき</rt></ruby>づくりを 思い立った」と 伝えて いるのは、いまの 記念館の 説明だ。思い立った その日に 書かれた 紙が 出て きた わけでは ない。——本を つくらせた 側の 人たちが、あとから ならべ直した 話でも ある。' } } },
          ] },

        // ★訪問の向き（eval の G5・opus 反証が確定）: たずねる会 17回は **兜町の 渋沢事務所 or 飛鳥山の
        // 栄一邸に 慶喜を 迎えて** ひらかれた。編纂員が 小日向の 慶喜邸へ 出向いたのは、下書きを
        // 読んで もらう「批正会」8回の ほう。初稿は 逆に 書いて いた——しかも 史実の 向きの ほうが
        // 章の 主題（もう 力の 無い 旧主が、かつての 家来の 事務所へ 来て 語る）に 効く（research §7-F）。
        '6-c': { place: '東京・<ruby>兜町<rt>かぶとちょう</rt></ruby>——きみの <ruby>事務所<rt>じむしょ</rt></ruby>、1907年',
          // 名札に 役を 添える: ビジュアル読解ペルソナは この 絵から「向かい合って 話して いる」までは
          // 読めたが「どちらが たずねて いるか」は読めなかった。このシーンの核は そこなので、
          // 名前だけの 札を 役つきに する（SVG text＝ルビ不可ゆえ 漢字は 最小限に）。
          closeup: { tone: 'warm', cast: [{ face: 'p-eiichi', name: 'たずねる 栄一' }, { face: 'p-yoshinobu@old', name: '答える 慶喜' }] },
          text: `<p>ことわられてから、十四年。<ruby>旧主<rt>きゅうしゅ</rt></ruby>は 東京に 移り、とうとう「話そう」と うなずいた。何が あって 気が 変わったのかを 書き残した 人は、いない。</p>
            <p>その 日、<ruby>兜町<rt>かぶとちょう</rt></ruby>の きみの <ruby>事務所<rt>じむしょ</rt></ruby>へ 来たのは、<ruby>元将軍<rt>もとしょうぐん</rt></ruby>の ほうだった。<ruby>学者<rt>がくしゃ</rt></ruby>たちが 集めた 紙を ひろげ、食いちがう ところを 一つずつ たずねて いく。<ruby>昔夢会<rt>せきむかい</rt></ruby>——むかしの <ruby>夢<rt>ゆめ</rt></ruby>を 聞く 会、と 名が ついた。</p>
            <p class="speak">「——あの とき 大坂の <ruby>城<rt>しろ</rt></ruby>で、<ruby>殿<rt>との</rt></ruby>は 何を お考えでしたか。」</p>
            <p class="speak">「まわりが どれだけ さわいでも、わたしは 動かずに いる べきだった。……<ruby>戦<rt>いくさ</rt></ruby>に なったのは、わたしの しくじりだ。」</p>
            <p class="speak">「——いまの お言葉、そのまま 本に 書きます。」</p>`,
          spark: 'え！？ 話しはじめた <ruby>旧主<rt>きゅうしゅ</rt></ruby>は、<b><ruby>速記<rt>そっき</rt></ruby>（話を そのまま 書きとる 人）が そばに いるのを いやがった</b>。とちゅうから、また ふつうの 手書きに もどして いる。',
          // ★M 手を動かす装置（register ㉗）。並べ替えが「常識の順」だけだと 迷いが 生まれない
          // （両ペルソナの 指摘）。史実の 手順に ある **五つめ＝書いた 下書きを もう一度 本人に
          // 読んで もらう（批正会 8回）** が、いちばん 飛ばされやすい 一手＝この 装置の 山場。
          minigame: { type: 'sort', title: 'たしかめる <ruby>段取<rt>だんど</rt></ruby>り',
            lead: 'ばらばらの <ruby>手順<rt>てじゅん</rt></ruby>を、正しい 順に タップ！ 四十年 前の ことを、どうやって「たしか」に する？',
            items: [
              '📜 その ころ 書かれた 紙を、あちこちから あつめる',
              '❓ 紙どうしが 食いちがう ところを 書き出す',
              '🗣️ その場に いた 本人に 会って、たずねる',
              '✍️ 聞いた ことを 入れて、下書きを 書く',
              '👀 その 下書きを、もう一度 本人に 読んで もらう',
              '📚 だれでも 読める 本に して、世に 出す',
            ],
            outro: '書きとめたら 終わり、では ない。<b>もう一度 本人に 見せて、「ちがう」と 言われた ところを 直す</b>。この ひと手間の ある 紙と、ない 紙が ある。——きみが これまで 読んで きた 紙は、どちらだったろう。' },
          deep: { q: 'その 会の 紙は、いま 読めるの？', confidence: '○',
            body: `たずねる 会が 十七回。書けた 下書きを 読んで もらう 会が、さらに 八回。その 記録が『<ruby>昔夢会筆記<rt>せきむかいひっき</rt></ruby>』だ。ただし 1915年に <ruby>刷<rt>す</rt></ruby>られたのは たった 二十五<ruby>部<rt>ぶ</rt></ruby>——ごく わずかな 人の 手に わたる だけ。<br>だれでも 買えるように なったのは、そこから 五十年 あまり あと。<b>紙は 残っても、読める 人が いなければ 話は 広まらない。</b>`,
            cite: '※ この 場面で <b>たしかなのは 慶喜の 言葉だけ</b>だ。しかも よく 見ると 二重に なって いる——<b>四十年 前に 船の 上で 自分が 言った ことを、年を とった 慶喜が 思い出して 語り、そばの 人が 書きとめた</b>。きみの 問いかけの ほうは、書きとめられて いない。' },
          next: '6-d' },

        // ★年代: 惇忠の 死（1901年1月）は 昔夢会（1907〜13）より 6年 前。初稿は この 章を「会の
        // つづく あいだに」と 枠づけて 三人の 死を 並べ、惇忠だけ 6年 ずれて いた（G5・eval が検出）。
        // 枠を「本が できるまでの 二十五年」へ 広げ、年を 一人ずつ 明記する。あわせて 章一・章四の
        // 人物紹介文（「同じ 夜に 刀を 買い」「朝ごとに『論語』を 教え」）の 逐語 再利用も やめる。
        '6-d': { place: '東京——本が できるまでの 二十五年',
          monologue: '（……あの 夜の <ruby>二階<rt>にかい</rt></ruby>に いた 者は、もう わたし ひとりか。）',
          closeup: { tone: 'grief', cast: [{ face: 'p-kisaku', name: '渋沢喜作' }, { face: 'p-eiichi', name: '栄一（きみ）' }] },
          text: `<p>1901年の 正月、<ruby>惇忠<rt>じゅんちゅう</rt></ruby>。『<ruby>論語<rt>ろんご</rt></ruby>』を 教えた 人であり、<ruby>横浜<rt>よこはま</rt></ruby>を 焼こうと 言い出した 人でも あった。本の 話は まだ 始まったばかり、たずねる 会は 六年 先だ。</p>
            <p>1912年の 夏、<ruby>喜作<rt>きさく</rt></ruby>。<ruby>最後<rt>さいご</rt></ruby>まで 戦う 側に つき、<ruby>牢<rt>ろう</rt></ruby>を 出て、<ruby>生糸<rt>きいと</rt></ruby>を 売る 商人と して 世を 終えた。あの 冬 いっしょに 村を 出た 二人の、片方が 消えた。</p>
            <p>次の 年の 11月、<ruby>慶喜<rt>よしのぶ</rt></ruby>。<ruby>風邪<rt>かぜ</rt></ruby>から <ruby>胸<rt>むね</rt></ruby>を いためて、七十六。</p>
            <p>本は、まだ できて いない。</p>`,
          deep: { q: '<ruby>慶喜<rt>よしのぶ</rt></ruby>の <ruby>汚名<rt>おめい</rt></ruby>は、はれたの？', confidence: '◎',
            body: `本が できるより 先に、世の あつかいは 変わって いた。1898年、慶喜は <ruby>宮城<rt>きゅうじょう</rt></ruby>へ 上がり、<ruby>天皇<rt>てんのう</rt></ruby>に 会って いる。1902年には <ruby>公爵<rt>こうしゃく</rt></ruby>——いちばん 上の <ruby>爵位<rt>しゃくい</rt></ruby>を さずけられ、<ruby>徳川慶喜家<rt>とくがわよしのぶけ</rt></ruby>を 立てた。<br>それを 動かした 力が だれの ものかは、一つには 決められない。<b>それでも、あの日 大坂で 何が あったかは、白い ままだった。</b>`,
            cite: '※ ほうぼうへ <ruby>口<rt>くち</rt></ruby>を きいた 人の 名は いくつか 挙がる。どれも あとの 世の 説明で、いま から たしかめる すべが ない。' },
          next: '6-e' },

        '6-e': { place: '第6章 むすび——1918年',
          reveal: { title: '『<ruby>徳川慶喜公伝<rt>とくがわよしのぶこうでん</rt></ruby>』',
            caption: '二十五年、八<ruby>巻<rt>かん</rt></ruby>。もう 何の 力も 持たない 人の ための 本が、できた。' },
          closeup: { tone: 'solemn', cast: [{ face: 'p-eiichi', name: '77さいの きみ' }] },
          // 章の 最大の 手＝折り返し（きみが 旧主に した ことが、そのまま きみに される）。初稿は
          // これを 地の文で 説明し、creed と clue でも 言い直して 三度 種明かしして いた。読者が
          // 自分で 気づける よう、敬三に 口を ひらかせて 切る（第5章 5-c の「舟の うえ・86さい・
          // 孫が たしかめた」に 四つの 手がかりで つながる）。
          text: `<p>本が できたのは 1918年。思い立ってから 二十五年が たって いた。</p>
            <p>八年 のち。<ruby>飛鳥山<rt>あすかやま</rt></ruby>の きみの 家に、人が あつまって いる。言い出したのは <ruby>孫<rt>まご</rt></ruby>の <ruby>敬三<rt>けいぞう</rt></ruby>。</p>
            <p class="speak">「おじいさま。<ruby>岩崎<rt>いわさき</rt></ruby>さんと <ruby>舟<rt>ふね</rt></ruby>に 乗った 日の ことを、聞かせて ください。」</p>
            <p>すみで <ruby>筆<rt>ふで</rt></ruby>が 動きはじめた。きみは 86さい。会は 三十一回 つづく。</p>
            <p>——たずねる 側の <ruby>椅子<rt>いす</rt></ruby>に、きみは もう すわって いない。</p>`,
          creed: { line: '「<ruby>席<rt>せき</rt></ruby>や <ruby>位<rt>くらい</rt></ruby>は、<ruby>国<rt>くに</rt></ruby>が 返す ことも できる。——だが あの日 何が あったかは、紙が 無ければ、だれにも 返せぬ。」',
            act: '——<ruby>負<rt>ま</rt></ruby>けた 人の 一生に 二十五年を つかった。その あいだに 起こせた はずの 会社が いくつ あったかは、だれにも 数えられない。' },
          onEnter: { card: 'w-koden', clue: 'clue-6' },
          end: true },
      },
    },
    {
      id: 7, num: '終', title: '一万円札の 顔', years: '1920〜1931／2024',
      lead: '<ruby>数<rt>かぞ</rt></ruby>えきれない 会社を 起こし、それでも 自分の <ruby>財閥<rt>ざいばつ</rt></ruby>は つくらなかった 男が、<ruby>死<rt>し</rt></ruby>ぬ。——そして 百年 のち、その 顔は 一万円札に なる。この 人の「<ruby>像<rt>ぞう</rt></ruby>」を つくったのは、だれだろう。',
      start: '7-a',
      scenes: {
        // 終章が 引き受ける 宿題は 2つ（章六の 累積通し読みの 指摘）——①A（変えなかった もの／なぜ
        // 財閥を つくらなかったか）は 章六でも 動いて いない ②1873〜93 の 20年と 晩年の 民間外交が
        // 本文では 空白。①は 7-d の 答え合わせ＋7-e、②は 7-a（会社の 点の 総覧地図）と 7-b（人形）。
        //
        // 装置の 配り方: 地図2枚（日本／太平洋）→ closeup → 席の図 → reveal。本作は closeup 偏重
        // （23/30）で、累積通し読みが「closeup tone が 毎章 tense→warm→solemn→grief の 巡回」を
        // 挙げた。終章は そこから 出る（register ㉗ の 系）。会社の 点の 散布は 章四で 先送りした
        // 「終章の 総覧の 仕事」（map.ts 4-a の 注記）を ここで 果たす。
        '7-a': { place: '東京・<ruby>飛鳥山<rt>あすかやま</rt></ruby>——1920年',
          monologue: '（……この 点の 一つひとつに、だれかの 一生が ある。）',
          text: `<p>1920年。きみは 80さい。国から <ruby>子爵<rt>ししゃく</rt></ruby>の <ruby>位<rt>くらい</rt></ruby>を さずけられた。</p>
            <p>この 地図の 点は、みな きみが 起こす 手つだいを した 会社だ。大阪では <ruby>綿<rt>わた</rt></ruby>を つむぎ、<ruby>札幌<rt>さっぽろ</rt></ruby>では ビールを つくって いる。</p>
            <p><ruby>血洗島<rt>ちあらいじま</rt></ruby>の 点は、生まれた 村だ。その となりの 村で、田の まん中に <ruby>煙突<rt>えんとつ</rt></ruby>が 立ち、赤い <ruby>煉瓦<rt>れんが</rt></ruby>を 焼いて いる。</p>
            <p>点は 日本じゅうに ちらばった。そして どの 会社も、<ruby>渋沢<rt>しぶさわ</rt></ruby>の 家の ものには しなかった。</p>`,
          spark: 'え！？ <ruby>東京駅<rt>とうきょうえき</rt></ruby>に 使われた 赤い <ruby>煉瓦<rt>れんが</rt></ruby>は、<b>きみの 生まれた 村の となりで 焼かれた</b> ものだ。',
          deep: { q: '会社は ぜんぶで いくつ？', confidence: '△',
            body: `よく「<ruby>約<rt>やく</rt></ruby>500の 会社」と 言われる。ちゃんと 数えた 一覧では 481。ただし その 中には、<ruby>祝<rt>いわ</rt></ruby>いの 席に 出た だけ、<ruby>題字<rt>だいじ</rt></ruby>を 書いた だけ、という うすい かかわりも 入って いて、「多くて 470ぐらい」と 見る 人も いる。いまも 残って いる 会社は 167、という 調べも ある。<br><b>数は、数え方で 動く。</b>`,
            cite: '※ この 481という 数を 出したのは、いまの 商工<ruby>会議所<rt>かいぎしょ</rt></ruby>——きみが つくった 会の、あとの すがただ。' },
          next: '7-b' },

        // ★1924年に 渡米は して いない（research §7-G・財団の詳細年譜）。骨組みの timeline は
        // 「渡米を 重ねる」と 書いて いた——84さいの この 年に 動いたのは 船でなく 言葉の ほう。
        // ★人形を「きみ」の 行為に 戻した（eval round1・B2=2点／A1=2点 の 主因）。初稿は
        // 「子どもたちから 届いた／子どもたちが 送りかえした」と 全て 無主体で、なりきりの 主人公が
        // 自分の 章で 傍観者に なって いた。史実では 会長に なり、募金を よびかけたのは 本人。
        // あわせて 答礼人形は「えらんだ」のでは なく、一銭募金で **新しく つくらせた**（G5）。
        '7-b': { place: '<ruby>太平洋<rt>たいへいよう</rt></ruby>——1924年から 1927年',
          text: `<p>1924年。海の むこうの 国が、新しい <ruby>法律<rt>ほうりつ</rt></ruby>を つくった。——日本から 来る 人は、もう 入れない。</p>
            <p>きみは 84さい。<ruby>帝国<rt>ていこく</rt></ruby>ホテルの 集まりで 立ち、その 法の まちがいを 説いた。話しながら <ruby>涙<rt>なみだ</rt></ruby>を こぼしたと 伝えられる。会社を いくつ 起こしても、これだけは 動かせない。</p>
            <p>三年 のち、きみは 子どもの ための 会を つくり、その <ruby>会長<rt>かいちょう</rt></ruby>に なった。海の むこうから 12,739たいの 人形が 届く。</p>
            <p>きみは 日本じゅうの 子どもに よびかけた——一人 一<ruby>銭<rt>せん</rt></ruby>ずつ。その お金で 新しく つくらせた <ruby>市松<rt>いちまつ</rt></ruby>人形 58たいが、1927年11月10日、<ruby>横浜<rt>よこはま</rt></ruby>の 港を 出た。きみは 87さい。</p>`,
          spark: 'え！？ その 十四年 のち、二つの 国は <ruby>戦争<rt>せんそう</rt></ruby>を 始める。<b>とどいた 人形は「<ruby>敵<rt>てき</rt></ruby>の 人形」と <ruby>呼<rt>よ</rt></ruby>ばれ、こわされた</b>。',
          deep: { q: '人形は、その あと どう なったの？', confidence: '○',
            body: `<ruby>戦争<rt>せんそう</rt></ruby>の さなか、青い 目の 人形は「敵の もの」として 学校の <ruby>庭<rt>にわ</rt></ruby>で こわされ、焼かれた。新聞も それを あおった。<br>それでも、こっそり かくして 守った 先生たちが いた。いま 日本に 残るのは 300たい ぜんご——数える 人に よって 数は ちがう。<b>人形は 戦争を 止められなかった。止められなかった ものが、それでも 残って いる。</b>`,
            cite: '※ 1926年と 1927年、この 人を ノーベル<ruby>平和賞<rt>へいわしょう</rt></ruby>に 推す 紙が 出されたと 伝えられる。だれが 出したのかを 日本の 本は 書いて いるが、その もとの 紙を たしかめる ことは まだ できて いない。' },
          next: '7-c' },

        // ★終章 唯一の 岐路（eval round1・A1=2点 の 主因＝「死ぬ 場面ですら 選べない」）。
        // ★場面は 1930年11月8日（財団の詳細年譜・research §7-G）——委員が 飛鳥山邸に 栄一を
        // 訪ねて 出馬を 請い、栄一は 病を おして 内務大臣を 訪ねた。round2 の 初稿は これを
        // 1931年2月の 1,116名連署の 上奏と 混ぜ、**渋沢の 名が 連署の 筆頭**という 典拠の 無い
        // 断定まで 書いて いた（G5）。史実の 場面の ほうが 岐路として 強い＝きみが 自分の 足で
        // 行くか どうか。もしも枝は この 作品の 主題を 裏返す——**自分で 書き残す**。
        // closeup を 二人に 戻した: 章一〜六の closeup は すべて 二人組で、終章だけ 顔の ある
        // 他人が 一人も いなかった（eval round2 の 両ペルソナ）。
        '7-c': { place: '東京・<ruby>飛鳥山<rt>あすかやま</rt></ruby>——1930年11月',
          // 両側を 欲に する（round2 中1）。初稿の monologue は のこり時間の 話だけで、
          // もう 一方の 選択肢を その 場面で 誰も 動機づけて いなかった。
          monologue: '（……いずれ だれかが、わたしを 書くのだろう。どう 書くのだろう。）',
          closeup: { tone: 'grief', cast: [{ face: 'p-iin', name: 'たのみに 来た 人' }, { face: 'p-eiichi', name: '90さいの きみ' }] },
          text: `<p>90さい。きみは <ruby>病<rt>やまい</rt></ruby>の ねどこに いる。</p>
            <p>一つの きまりが 止まって いた。年おいた 人、はたらけない 人を 国の お金で 助ける <ruby>救護法<rt>きゅうごほう</rt></ruby>——<ruby>去年<rt>きょねん</rt></ruby>の 春に 決まったのに、「金が 無い」と 言われて 始まらない。</p>
            <p>まくらもとに、その きまりを 動かそうと して いる 人たちが 来た。</p>
            <p class="speak">「もう 一度、<ruby>大臣<rt>だいじん</rt></ruby>の ところへ 出て いただけませんか。あなたが 行けば、話は 動きます。」</p>
            <p>行けば 体が もたない。書くなら、いま しか ない。</p>`,
          deep: { q: 'なぜ この 人たちが たのみに 来るの？', confidence: '○',
            body: `まちの 中を まわって、こまって いる 家を さがす 役の 人たち（<ruby>方面委員<rt>ほうめんいん</rt></ruby>）だ。きまりが 始まらなければ、目の 前の 人を 助ける 手が 無い。<br>きみは その 人たちの <ruby>親分<rt>おやぶん</rt></ruby>では ない。ただ、**きみが 出て 行くと 話が 動く**——五十年 会社を 起こしつづけた 者の 名には、それだけの 重さが ついて いた。`,
            cite: '※ 「病を おして 大臣を たずねた」と 書いて いるのは、渋沢を <ruby>顕彰<rt>けんしょう</rt></ruby>する 側が 編んだ 資料集と、その 年譜だ。当時の 新聞も いっしょに 集められて いる——集めたのは、やはり ほめる 側の 人たちだが。' },
          q: 'のこりの 力を、何に つかう？',
          choices: [
            { label: '出て いく。<ruby>大臣<rt>だいじん</rt></ruby>に 会いに', to: '7-d', canon: true, effect: { rongo: 2, gappon: 1 },
              hist: { verdict: '史実では', match: '——きみは 病を おして、<ruby>内務大臣<rt>ないむだいじん</rt></ruby>の ところへ 出て いった',
                body: `<p>あくる 年の 二月、<ruby>方面委員<rt>ほうめんいん</rt></ruby>たち 1,116人が 名を つらねた 紙が 上へ さし出され、お金を あずかる 大臣と <ruby>内務大臣<rt>ないむだいじん</rt></ruby>の あいだで <ruby>実施<rt>じっし</rt></ruby>が 決まる。</p><p>十一月十一日、きみは 死ぬ。数えで 九十二。</p><p><b>きまりが 始まったのは、その 二か月 あと。</b></p>`,
                source: { grade: 'later', name: '<ruby>渋沢栄一伝記資料<rt>しぶさわえいいちでんきしりょう</rt></ruby>と その <ruby>年譜<rt>ねんぷ</rt></ruby>',
                  note: 'この 日の ことは 巻と <ruby>頁<rt>ページ</rt></ruby>まで たどれる。ただし 集めて 並べたのは、この 人を たたえる 側の 人たちだ。' } } },
            { label: '<ruby>筆<rt>ふで</rt></ruby>を とる。自分の 一生を、自分の 手で 書き残す', to: '7-d', effect: { soroban: 1, rongo: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 最後の 力を、自分の 本に つかって いたら……',
                body: `<p>きっと 読みごたえの ある 一冊に なった だろう。血洗島の 夜も、パリの 銀行も、舟の 上も、きみの 筆で 一本に つながる。</p><p>だが それは、この 旅で きみが 七つの 手がかりで <b>はがして きた もの</b>と 同じ 形の 紙だ。まっすぐに ならんだ 一生。都合の わるい ところの 見えない 一生。</p><p>そして そのあいだ、あの きまりは 止まった ままだ。まちを まわる 人たちは、目の 前の 家に 出せる ものを 持たない。<b>史実の きみは、最後の 力を 自分の 本には つかわなかった。</b></p>` } },
          ],
          onEnter: { clue: 'clue-7' } },

        // 答え合わせ。A（変えなかった もの）は 席の図が、B（財閥を つくらなかった）は 7-a の 点の
        // 地図が、それぞれ 絵で 受け持って いる——だから 本文は 問いだけで よい。
        '7-d': { place: '<ruby>物語<rt>ものがたり</rt></ruby>を つらぬく <ruby>謎<rt>なぞ</rt></ruby> — <ruby>答<rt>こた</rt></ruby>え合わせ',
          figure: 'seatAll',
          text: `<p><ruby>葬<rt>そう</rt></ruby>れつは <ruby>飛鳥山<rt>あすかやま</rt></ruby>の 家から <ruby>青山<rt>あおやま</rt></ruby>まで つづき、道の 両がわを 人が うめた。</p>
            <p><ruby>旅<rt>たび</rt></ruby>の はじめに あずけた 謎を、もう 一度。</p>
            <p class="speak"><ruby>百姓<rt>ひゃくしょう</rt></ruby>に 生まれ、外国人を 焼こうと し、<ruby>将軍<rt>しょうぐん</rt></ruby>に つかえ、その 将軍を たおした 国に つかえた 男。——変えなかった ものは、何だろう。そして なぜ、この 人は 自分の <ruby>財閥<rt>ざいばつ</rt></ruby>を つくらなかったのだろう。</p>
            <p>七つの <ruby>手<rt>て</rt></ruby>がかりと、七つの <ruby>座<rt>ざ</rt></ruby>を 見わたして——<br><em>きみは、どう 考える？</em></p>`,
          deep: { q: 'その 日、どれだけの 人が 見送ったの？', confidence: '△',
            body: `<ruby>沿道<rt>えんどう</rt></ruby>を「三万人が 見送った」という 数字が、いまも あちこちに 書かれて いる。だが その もとに ある はずの、その日の 新聞そのものを たしかめる ことは まだ できて いない。<br>——この 一生で きみが 何度も 見た ことが、最後にも 起きて いる。<b>だれかが 語り、数字が つき、それが くりかえされる。</b>`,
            cite: '※ <ruby>葬<rt>そう</rt></ruby>れつの 道すじと、大ぜいが 見送った ことは たしか。数だけが、あとの 本から 本へ うつる うちに 一人あるきして いる。' },
          showClues: true,
          q: 'きみの <ruby>答<rt>こた</rt></ruby>えは？（どれを えらんでも、<ruby>正解<rt>せいかい</rt></ruby>の ひとつ）',
          choices: [
            { label: '<ruby>論語<rt>ろんご</rt></ruby>を 変えなかった。だから 一人じめを しなかった', to: '7-e', answer: 0,
              hist: { verdict: 'きみの 答え', match: 'それは、この 人 自身が いちばん よく 語った 答え',
                body: `<p><ruby>朝<rt>あさ</rt></ruby>ごとに 読んだ 『<ruby>論語<rt>ろんご</rt></ruby>』が <ruby>芯<rt>しん</rt></ruby>に あった——<ruby>利益<rt>りえき</rt></ruby>は 一つの 家の ものでなく、広い 世の ものに する。そう 言いつづけたのは たしかだ。</p><p>ただし、その 言い方を いちばん たくさん 残したのも、この 人 自身だった。</p>` } },
            { label: '<ruby>欲<rt>よく</rt></ruby>は 変えなかった。<ruby>財閥<rt>ざいばつ</rt></ruby>より 大きい ものが ほしかった', to: '7-e', answer: 1,
              hist: { verdict: 'きみの 答え', match: 'それも、するどい 答えの ひとつ',
                body: `<p>一つの 家を 太らせるより、日本じゅうに 会社を 起こす ほうが、<ruby>器<rt>うつわ</rt></ruby>としては 大きい。<ruby>舟<rt>ふね</rt></ruby>の 上で「ほしくない と 言えば うそに なる」と 思った あの 人が、<ruby>欲<rt>よく</rt></ruby>を すてたと 決めつける <ruby>必要<rt>ひつよう</rt></ruby>は ない。</p>` } },
            { label: '<ruby>芯<rt>しん</rt></ruby>が 一つ だったと いうのが、あとから ならべ直した 話かも しれない', to: '7-e', answer: 2,
              hist: { verdict: 'きみの 答え', match: 'それは、この 旅で きみが 手に 入れた 目',
                body: `<p>人の 一生は、あとから 語る 人が まっすぐに ならべ直す——きみは それを 七つの 手がかりで 見て きた。</p><p>ただし、疑う 目を 片がわだけに 向けない こと。<b>「ぜんぶ ならべ直しだ」も また、一つの ならべ直しだ。</b></p>` } },
            { label: '一つに 決められない。どれも 少しずつ ほんとうだった', to: '7-e', answer: 3,
              hist: { verdict: 'きみの 答え', match: 'それも、いさぎよい 答えの ひとつ',
                body: `<p>刀を おろした 夜も、<ruby>椅子<rt>いす</rt></ruby>を おりた 日も、<ruby>舟<rt>ふね</rt></ruby>の 上も、<ruby>負<rt>ま</rt></ruby>けた あるじの ための 紙も——ぜんぶ、同じ 一人の 中に あった。</p><p>どれか 一つに まとめた とき、人は「<ruby>像<rt>ぞう</rt></ruby>」に なる。</p>` } },
          ] },

        '7-e': { place: '<ruby>終章<rt>しゅうしょう</rt></ruby> むすび——2024年',
          reveal: { title: '<ruby>一万円札<rt>いちまんえんさつ</rt></ruby>の 顔',
            caption: '国が「日本の 顔」に えらんだ。——では、この 顔を つくったのは だれだろう。' },
          closeup: { tone: 'solemn', cast: [{ face: 'p-eiichi', name: '札に なった 顔' }] },
          text: `<p><ruby>孫<rt>まご</rt></ruby>の <ruby>敬三<rt>けいぞう</rt></ruby>たちの 聞き書きは、まだ 続いて いた。きみが 死ぬと、こんどは 手紙を あつめ、<ruby>帳簿<rt>ちょうぼ</rt></ruby>を あつめ——きみの 一生は、やがて 68<ruby>巻<rt>かん</rt></ruby>の 紙に なる。</p>
            <p>きみが <ruby>旧主<rt>きゅうしゅ</rt></ruby>に した ことが、そのまま きみに された。</p>
            <p>そして 2024年。この 人の 顔が、一万円札に なる。</p>
            <p>もとに なったのは 七十さいごろの 写真だ。ただし 札を つくった 側の 説明に よると、もっと 力の ある 顔に 見えるよう、そこから 少し 若く 描き直したという。</p>
            <p>——札の 中の 顔は、この 人の どの 年の 顔でも ない。</p>`,
          deep: { q: 'なぜ 若く 描き直したの？', confidence: '○',
            body: `お札の 絵を つくるのは <ruby>国立印刷局<rt>こくりつ いんさつきょく</rt></ruby>の <ruby>工芸官<rt>こうげいかん</rt></ruby>という 人たち。<ruby>古希<rt>こき</rt></ruby>（七十さい）ごろの 写真を 何まいか 見ながら 原<ruby>版<rt>はん</rt></ruby>を ほり、「あちこちで はたらく 力づよさ・若々しさを 出す ため」に 六十さい 前半の 顔へ 直した——そう 説明されて いる。<br><b>だれかが「この 顔が いい」と 決めた</b>。写真の ままでは なかった。`,
            cite: '※ この 説明を して いるのは、札を つくった 側と、渋沢を <ruby>顕彰<rt>けんしょう</rt></ruby>する 記念館だ。えらんだ 側の 説明で ある ことは、頭の すみに 置いて おきたい。' },
          creed: { line: '「<ruby>立場<rt>たちば</rt></ruby>は 変えた。<ruby>芯<rt>しん</rt></ruby>は 変えなかった——と、わたしは 言って きた。それを 信じるかどうかは、そちらの しごとだ。」',
            act: '——<ruby>一族<rt>いちぞく</rt></ruby>の ものに できた 会社を、よその 人の 手に わたして 死んだ。のこったのは、<ruby>身内<rt>みうち</rt></ruby>が つくった 68巻と、自分では 一度も 見た ことの ない 顔だ。' },
          onEnter: { card: 'w-rongosoroban' },
          end: true },
      },
    },
  ],
};
