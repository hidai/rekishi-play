// Story data (STORY). All 7 chapters from design §2 are fully authored
// (id/num/title/years/lead/start/teaser + scenes), one task each with /eval-work,
// authored in order 一→四→二・三・五・六→終 (design §9-5). Scene ids are chapter-prefixed
// (e.g. '1-a', '7-a') to stay globally unique — sceneMaps / sceneFaceOverrides are keyed by
// scene id across the whole work. Hand-managed (kiyomori has no legacy extract source).
/* eslint-disable */

import type { Story } from '../../../engine/types';

export const STORY: Story = {
  chapters: [
    {
      id: 1, num: '一', title: '伊勢平氏の子', years: '1118〜1146頃',
      lead: 'すべては、海で 富を 築く 一族の 子から はじまった。',
      start: '1-a',
      teaser: 'まもなく、都を ゆるがす 二つの 乱——<ruby>保元<rt>ほうげん</rt></ruby>・<ruby>平治<rt>へいじ</rt></ruby>。きみは、どの 主に ついて 戦う？',
      scenes: {
        '1-a': { place: '伊勢・京',
          text: `<p>きみの 名は <ruby>清盛<rt>きよもり</rt></ruby>。<ruby>伊勢<rt>いせ</rt></ruby>の 海の 近くで 育った 子どもだ。<ruby>港<rt>みなと</rt></ruby>には、見た ことも ない <ruby>品<rt>しな</rt></ruby>を 積んだ 船が 着く。<ruby>潮<rt>しお</rt></ruby>の においの 中で、きみは 大きく なった。</p>
            <p>きみの 家は、<em>平氏</em>。父は その <ruby>一族<rt>いちぞく</rt></ruby>の かしら・<face pid="p-tadamori"><ruby>平忠盛<rt>たいらの ただもり</rt></ruby></face>——刀の <ruby>手柄<rt>てがら</rt></ruby>で なく、<ruby>瀬戸内<rt>せとうち</rt></ruby>の 海を にぎり、海の むこうとの <ruby>交易<rt>こうえき</rt></ruby>で、<ruby>武士<rt>ぶし</rt></ruby>としては <ruby>異例<rt>いれい</rt></ruby>の <ruby>富<rt>とみ</rt></ruby>を きずいた 人だった。</p>
            <p><ruby>戦<rt>いくさ</rt></ruby>で なく、船で のし上がる 一族。——<em>1118年ごろ</em>、きみは その 家に 生まれた。</p>`,
          spark: 'え！？ のちに <ruby>天下<rt>てんか</rt></ruby>（国 ぜんたい）の てっぺんに のぼる この 男、じつは「母が だれか」さえ、はっきり しない——？',
          deep: { q: '清盛の 母は、だれ？',
            body: `清盛の <b><ruby>実母<rt>じつぼ</rt></ruby></b>が だれかは、じつは はっきり しない。母は <ruby>白河院<rt>しらかわいん</rt></ruby>（天皇の 位を ゆずった あと、当時 いちばん 力を もった 人）に 仕えた <ruby>女房<rt>にょうぼう</rt></ruby>（<ruby>宮仕<rt>みやづか</rt></ruby>えの 女性）だったと される。<br>ここから 生まれた 話が「<b><ruby>白河院落胤説<rt>しらかわいんらくいんせつ</rt></ruby></b>」——「清盛は 実は 白河院の 子で、忠盛が 承知で 育てた」という もの。でも これは、平家が <ruby>滅<rt>ほろ</rt></ruby>びた あとの 物語（『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』）を もとに した <ruby>俗説<rt>ぞくせつ</rt></ruby>だ。<br>近ごろは「実母は <ruby>祇園女御<rt>ぎおんにょうご</rt></ruby>の 妹」説も 有力と 見られる。でも その もとに なった <ruby>記録<rt>きろく</rt></ruby>も、ずっと 後の 世の もの。——<b>どちらも 決め手が ない</b>。それが、今の ところの 答えだ。`,
            cite: '※ 異例の 出世を、後の 世が「実は 特別な 血だから」と 説明したがった——とも いえる。' },
          onEnter: { card: 'p-tadamori' },
          next: '1-b' },

        '1-b': { place: '都の <ruby>侮<rt>あなど</rt></ruby>り',
          monologue: '（成り上がり、と 見くだされる。……父上なら、これを どう くぐって きた だろう。）',
          text: `<p>やがて きみは 都に 出て、<ruby>朝廷<rt>ちょうてい</rt></ruby>（天皇を 中心に 国を 動かす ところ）に 仕える。だが そこで 力を もつのは、<ruby>代々<rt>だいだい</rt></ruby> みやこに 住む <ruby>貴族<rt>きぞく</rt></ruby>たち。武士は その 下で 使われる「<em>さむらい ふぜい</em>」——<b>成り上がり</b>だ。まして 海で 富んだ 平氏は「<ruby>田舎<rt>いなか</rt></ruby>の 金もうけ 一族」と 見くだされた。</p>
            <p>父・忠盛にも、こんな 話が 伝わる。<ruby>殿上<rt>てんじょう</rt></ruby>で 貴族たちに <ruby>闇討<rt>やみう</rt></ruby>ちを たくらまれた とき、<ruby>木刀<rt>ぼくとう</rt></ruby>を 本物の <ruby>太刀<rt>たち</rt></ruby>のように 見せて 相手を ひるませ、<ruby>抜<rt>ぬ</rt></ruby>かずに その場を おさめた——と。刀は、<ruby>抜<rt>ぬ</rt></ruby>かぬ ほど こわい。</p>
            <p>さて。あからさまに 見くだされた とき、若い きみなら どうする？</p>`,
          deep: { q: 'なぜ、武士は 見くだされたの？',
            body: `この ころの 都は、<ruby>貴族<rt>きぞく</rt></ruby>が <ruby>政治<rt>せいじ</rt></ruby>を にぎる 世界だった。とくに、天皇の <ruby>位<rt>くらい</rt></ruby>を おりた 人——『<ruby>院<rt>いん</rt></ruby>』が、天皇の 後ろで 力を ふるう。この しくみを『<ruby>院政<rt>いんせい</rt></ruby>』と いう。<br>その 貴族たちに とって、武士は「<ruby>戦<rt>いくさ</rt></ruby>や <ruby>警備<rt>けいび</rt></ruby>を させる、下の 者」。まして 平氏は、地方の 海で 富を きずいた <b>新入り</b>だった。だから 見くだされた。<br>——でも 忠盛や 清盛は、力で ねじ<ruby>伏<rt>ふ</rt></ruby>せる のでは なく、<b>その 貴族の 世界の 中に 入りこんで</b>、いつのまにか てっぺんへ のぼって いく。そこが、この 一族の おもしろい ところだ。` },
          choices: [
            { label: '<ruby>怒<rt>おこ</rt></ruby>って、力で ねじ<ruby>伏<rt>ふ</rt></ruby>せ、武士の 強さを 見せつける', to: '1-c', effect: { nasake: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 力で ねじ<ruby>伏<rt>ふ</rt></ruby>せて いたら……',
                body: `<p><ruby>一族<rt>いちぞく</rt></ruby>を 見くだされて <ruby>黙<rt>だま</rt></ruby>って いられるか——その <ruby>熱<rt>あつ</rt></ruby>さは、よく わかる。だが「<b>乱暴な 成り上がり</b>」という 評判が 立てば、貴族の 世界では ますます <ruby>敬遠<rt>けいえん</rt></ruby>（けむたがられ、遠ざけられる こと）された かもしれない。武士が 力を ふるうほど、都の 人々は こわがり、そして <ruby>憎<rt>にく</rt></ruby>んだ。</p><p>——史実の 平氏が 力を つけた 道は、じつは 逆だった。力ずくで 貴族を ねじ<ruby>伏<rt>ふ</rt></ruby>せる のでは なく、<b>その 内側に そっと 入りこんで</b> いったのだ。清盛も、やがて その 道を 進む。</p>` } },
            { label: '父の <ruby>流儀<rt>りゅうぎ</rt></ruby>で、<ruby>機転<rt>きてん</rt></ruby>を きかせて さらりと かわす', to: '1-c', canon: true, effect: { miyako: 2 },
              hist: { verdict: '史実では', match: 'それが、平氏の 生き延び方だった',
                body: `<p><ruby>伊勢平氏<rt>いせへいし</rt></ruby>は、力ずくで 都を 従えた 一族では ない。<ruby>院<rt>いん</rt></ruby>（天皇の 位を おりた 人）に 仕え、海の 交易で 富み、<b>貴族の 作法を 使いこなして</b>、<ruby>朝廷<rt>ちょうてい</rt></ruby>の 内側へ 入りこんで いった。</p><p>のちに 清盛は、刀では なく <b>位（くらい）と <ruby>縁<rt>えん</rt></ruby>（人と 人の つながり）</b>で <ruby>天下<rt>てんか</rt></ruby>の ふところに 入る。その 芽は、この 一族の <ruby>流儀<rt>りゅうぎ</rt></ruby>の 中に あった。</p>`,
                source: { grade: 'tale',
                  name: '『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』の <ruby>殿上闇討<rt>てんじょうやみうち</rt></ruby>の 話',
                  note: '忠盛の この <ruby>逸話<rt>いつわ</rt></ruby>は、後の 物語が 伝える もの。清盛 自身が この場で どう ふるまったかを 書いた 当時の <ruby>記録<rt>きろく</rt></ruby>は ない。' } } },
          ] },

        '1-c': { place: '第1章 むすび',
          closeup: { tone: 'warm', cast: [ { face: 'p-tadamori', name: '父・忠盛' }, { face: 'p-kiyomori@child', name: '清盛（きみ）' } ] },
          onEnter: { cards: ['p-tadamori'], clues: ['clue-1'] },
          text: `<p>父・忠盛は、海の むこうから 運ばれて きた <ruby>宋<rt>そう</rt></ruby>（今の 中国）の 焼き物を 手に とって、きみに 言った——気が した。</p>
            <p class="speak">「清盛。刀で あげた <ruby>手柄<rt>てがら</rt></ruby>は、いつか 忘れられる。だが、船が はこぶ 富と <ruby>縁<rt>えん</rt></ruby>は、<ruby>一族<rt>いちぞく</rt></ruby>を 百年 生かす。……海の むこうには、まだ 見ぬ 富が ある。よく 見て おけ」</p>
            <p>その ことばは、まだ 子どもの きみには 大きすぎた。けれど、胸の おくに 残った。</p>
            <p>手がかりを ひとつ 手に 入れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          creed: { line: '「おれの 一族は、海で 生きて きた。刀の <ruby>手柄<rt>てがら</rt></ruby>より、船の ゆくえだ。」',
            act: '——<ruby>伊勢<rt>いせ</rt></ruby>に <ruby>興<rt>おこ</rt></ruby>り、海に 生きた 平氏。その 子・清盛は、そう 心に きざんだ。' },
          end: true },
      },
    },
    {
      id: 2, num: '二', title: '保元・平治の乱', years: '1156〜1160',
      lead: '保元・平治——都を ゆるがす 二つの 乱を、清盛は 勝ちぬく。',
      start: '2-a',
      teaser: '<ruby>武門<rt>ぶもん</rt></ruby>の <ruby>頂<rt>いただき</rt></ruby>に 立った 清盛。だが つぎは 刀では なく、<ruby>位<rt>くらい</rt></ruby>と <ruby>縁<rt>えん</rt></ruby>で <ruby>貴族<rt>きぞく</rt></ruby>の <ruby>頂<rt>いただき</rt></ruby>へ——なぜ、そんな ことが できたのか？',
      scenes: {
        '2-a': { place: '京',
          text: `<p>あれから 十年。きみは <ruby>平氏<rt>へいし</rt></ruby>の かしらと なって いた。</p>
            <p><em>1156年</em>、<ruby>鳥羽<rt>とば</rt></ruby><ruby>院<rt>いん</rt></ruby>（天皇の 位を おりた 人）が 亡くなると、とめる 人を なくし、みやこは まっぷたつに <ruby>割<rt>わ</rt></ruby>れた。その 子で、<ruby>位<rt>くらい</rt></ruby>を おろされて うらむ <face pid="p-sutoku"><ruby>崇徳<rt>すとく</rt></ruby></face><ruby>院<rt>いん</rt></ruby>と、弟の <face pid="p-goshirakawa"><ruby>後白河<rt>ごしらかわ</rt></ruby></face><ruby>天皇<rt>てんのう</rt></ruby>が、にらみ合う（<ruby>保元<rt>ほうげん</rt></ruby>の 乱）。</p>
            <p>きみは 後白河の 側に つき、<ruby>源氏<rt>げんじ</rt></ruby>の <face pid="p-yoshitomo"><ruby>源義朝<rt>みなもとの よしとも</rt></ruby></face>と ならんで 戦う。<ruby>夜討<rt>ようち</rt></ruby>ちで、いくさは 一夜で 決した。</p>
            <p>だが、勝った 側にも むごい しごとが。<ruby>崇徳<rt>すとく</rt></ruby>方に ついたのは、他人では ない。<ruby>義朝<rt>よしとも</rt></ruby>は <ruby>実<rt>じつ</rt></ruby>の 父を、きみは <ruby>叔父<rt>おじ</rt></ruby>を——その 手で <ruby>討<rt>う</rt></ruby>たねば ならなかった。</p>
            <p>——<ruby>敗<rt>やぶ</rt></ruby>れた <ruby>崇徳<rt>すとく</rt></ruby>は <ruby>讃岐<rt>さぬき</rt></ruby>（今の <ruby>香川<rt>かがわ</rt></ruby>）へ 流され、二度と 都を 見なかった。</p>
            <p class="speak">「わたしは ただ、<ruby>位<rt>くらい</rt></ruby>が ほしかった だけ。……なぜ、これほど 遠くへ。」——そう <ruby>嘆<rt>なげ</rt></ruby>いた かも しれない。</p>`,
          spark: 'え！？ この <ruby>崇徳<rt>すとく</rt></ruby>院、のちに「<ruby>日本一<rt>にほんいち</rt></ruby>の おそろしい <ruby>怨霊<rt>おんりょう</rt></ruby>（うらみを のこして 化けて 出る <ruby>霊<rt>れい</rt></ruby>）」に なった——と 語られる。でも、それって 本当？',
          deep: { q: '<ruby>崇徳<rt>すとく</rt></ruby>は、本当に <ruby>怨霊<rt>おんりょう</rt></ruby>に なったの？',
            body: `<ruby>讃岐<rt>さぬき</rt></ruby>で 亡くなった <ruby>崇徳<rt>すとく</rt></ruby>院は、のちに「<ruby>日本一<rt>にほんいち</rt></ruby>の <ruby>怨霊<rt>おんりょう</rt></ruby>」として おそれられた。だが、その 話には 二つの だんかいが ある。まず 崇徳の 死から しばらく して、勝った 側——<ruby>後白河<rt>ごしらかわ</rt></ruby>の <ruby>朝廷<rt>ちょうてい</rt></ruby>じしんが、あいつぐ <ruby>災<rt>わざわ</rt></ruby>いを「崇徳の たたりでは」と おそれ、その <ruby>霊<rt>れい</rt></ruby>を なぐさめようと した。そして ずっと あと、<ruby>江戸<rt>えど</rt></ruby>時代の <ruby>物語<rt>ものがたり</rt></ruby>が、その 話を さらに 大きく ふくらませた。崇徳が ほんとうに うらんで 死んだのか、たしかな <ruby>記録<rt>きろく</rt></ruby>には 書かれて いない。<br>——負けて、みじめに 死んだ 人 ほど、人は「きっと ひどく うらんだ だろう」と <ruby>想像<rt>そうぞう</rt></ruby>し、おそろしい 物語を つけ足して いく。` },
          onEnter: { cards: ['p-goshirakawa', 'p-sutoku'] },
          next: '2-b' },

        '2-b': { place: '<ruby>熊野<rt>くまの</rt></ruby>への 道',
          text: `<p>それから 三年（<ruby>平治<rt>へいじ</rt></ruby>の 乱・1159年）。あの <ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>天皇<rt>てんのう</rt></ruby>は、すでに <ruby>位<rt>くらい</rt></ruby>を 子の <ruby>二条<rt>にじょう</rt></ruby>天皇に ゆずり、いまは <face pid="p-goshirakawa"><ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby></face>——天皇の 後ろで 国を 動かす 側だ。</p>
            <p>勝ち組の 中で、味方どうしの <ruby>不満<rt>ふまん</rt></ruby>が くすぶる。手がらの わりに <ruby>恩賞<rt>おんしょう</rt></ruby>が 少ないと いきどおる <ruby>源義朝<rt>みなもとの よしとも</rt></ruby>。思うように <ruby>出世<rt>しゅっせ</rt></ruby>できぬ、<ruby>後白河<rt>ごしらかわ</rt></ruby>方の <ruby>藤原信頼<rt>ふじわらの のぶより</rt></ruby>。</p>
            <p>二人は 手を 組み、<ruby>兵<rt>へい</rt></ruby>を あげた。<ruby>院<rt>いん</rt></ruby>の <ruby>御所<rt>ごしょ</rt></ruby>を 焼き、その 親子を 手の内に——<ruby>都<rt>みやこ</rt></ruby>を のっとる <ruby>反乱<rt>はんらん</rt></ruby>だ。</p>
            <p>その とき きみは、<ruby>熊野<rt>くまの</rt></ruby>もうでの <ruby>途中<rt>とちゅう</rt></ruby>。連れは わずかな お供だけ。いくさの <ruby>支度<rt>したく</rt></ruby>も ない。都から <ruby>早馬<rt>はやうま</rt></ruby>が「すぐ お<ruby>戻<rt>もど</rt></ruby>りを！」と 次々に 走る。</p>
            <p>だが、引き返すのも <ruby>命<rt>いのち</rt></ruby>がけだ。この <ruby>手勢<rt>てぜい</rt></ruby>で 動けば、<ruby>討<rt>う</rt></ruby>たれかねない。さあ、きみなら どうする？</p>`,
          onEnter: { card: 'p-yoshitomo' },
          choices: [
            { label: 'すぐ <ruby>都<rt>みやこ</rt></ruby>へ 引き返し、<ruby>信頼<rt>のぶより</rt></ruby>・<ruby>義朝<rt>よしとも</rt></ruby>を <ruby>討<rt>う</rt></ruby>つ', to: '2-c', canon: true, effect: { miyako: 2 },
              hist: { verdict: '史実では', match: 'あぶない 橋を、思いきって わたった',
                body: `<p>清盛は まよわず 都へ 引き返し、<ruby>本拠<rt>ほんきょ</rt></ruby>・<ruby>六波羅<rt>ろくはら</rt></ruby>に かまえて <ruby>態勢<rt>たいせい</rt></ruby>を 立て直した。そして <ruby>計略<rt>けいりゃく</rt></ruby>で <ruby>二条<rt>にじょう</rt></ruby>天皇を 味方の <ruby>陣<rt>じん</rt></ruby>へ <ruby>迎<rt>むか</rt></ruby>え、「都を のっとった <ruby>賊<rt>ぞく</rt></ruby>」と なった <ruby>信頼<rt>のぶより</rt></ruby>・<ruby>義朝<rt>よしとも</rt></ruby>を <ruby>破<rt>やぶ</rt></ruby>った。義朝は <ruby>東国<rt>とうごく</rt></ruby>へ 落ちのびる <ruby>途中<rt>とちゅう</rt></ruby>で <ruby>討<rt>う</rt></ruby>たれる。</p><p>あぶない 橋を わたっても、機を のがさず さっと 動く——その 思いきりの よさが、平氏を <ruby>武門<rt>ぶもん</rt></ruby>の <ruby>第一人者<rt>だいいちにんしゃ</rt></ruby>に <ruby>押<rt>お</rt></ruby>し上げた。</p>`,
                source: { grade: 'later',
                  name: '『<ruby>平治物語<rt>へいじものがたり</rt></ruby>』',
                  note: '平治の 乱を 伝える <ruby>軍記<rt>ぐんき</rt></ruby>。合戦の こまかな 場面には 後の 世の <ruby>脚色<rt>きゃくしょく</rt></ruby>も まじるが、清盛の 勝利と 義朝の 敗死は 当時の 記録とも 合う。' } } },
            { label: '<ruby>態勢<rt>たいせい</rt></ruby>を 立て直すまで、わずかな お供を <ruby>危<rt>あぶ</rt></ruby>ない 目に あわせない', to: '2-c', effect: { nasake: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 動かずに いたら……',
                body: `<p>わずかな <ruby>手勢<rt>てぜい</rt></ruby>で とび込めば、みな <ruby>討<rt>う</rt></ruby>ち死にしかねない——お供を 案じる 気もちは、よく わかる。だが もし ぐずぐずして いたら、<ruby>義朝<rt>よしとも</rt></ruby>が <ruby>後白河<rt>ごしらかわ</rt></ruby>院と <ruby>二条<rt>にじょう</rt></ruby>天皇を にぎった まま 都を 固め、平氏は「<ruby>賊<rt>ぞく</rt></ruby>を <ruby>討<rt>う</rt></ruby>つ」という <ruby>大義名分<rt>たいぎめいぶん</rt></ruby>（<ruby>堂々<rt>どうどう</rt></ruby>と 名のれる 理由）を 失って いたかも しれない。</p><p>——<ruby>史実<rt>じじつ</rt></ruby>の 清盛は、あやうい 旅先から すばやく 動き、この 機を のがさなかった。</p>` } },
          ] },

        '2-c': { place: '<ruby>六波羅<rt>ろくはら</rt></ruby>',
          monologue: '（<ruby>敵<rt>てき</rt></ruby>の 子は、生かせば いつか <ruby>牙<rt>きば</rt></ruby>を むく。……それが、この 世の ならわし。だが——。）',
          text: `<p><ruby>平治<rt>へいじ</rt></ruby>の 乱に 勝ち、きみ（清盛）は <ruby>武士<rt>ぶし</rt></ruby>の <ruby>頂<rt>いただき</rt></ruby>に 立った。<ruby>敵<rt>てき</rt></ruby>の <ruby>大将<rt>たいしょう</rt></ruby>・<ruby>源義朝<rt>みなもとの よしとも</rt></ruby>は、<ruby>東国<rt>とうごく</rt></ruby>へ 落ちのびる 道で <ruby>討<rt>う</rt></ruby>たれた。</p>
            <p>その 義朝の 子——まだ <ruby>十三<rt>じゅうさん</rt></ruby>の 少年、<ruby>源頼朝<rt>みなもとの よりとも</rt></ruby>が、とらえられて きみの 前に 引き出された。</p>
            <p>負けた <ruby>大将<rt>たいしょう</rt></ruby>の 子は、<ruby>斬<rt>き</rt></ruby>る。それが この 世の <ruby>用心<rt>ようじん</rt></ruby>だ。げんに きみ 自身、<ruby>保元<rt>ほうげん</rt></ruby>の 乱では <ruby>叔父<rt>おじ</rt></ruby>を <ruby>討<rt>う</rt></ruby>った。</p>
            <p>ところが、きみの <ruby>継母<rt>ままはは</rt></ruby>・<ruby>池禅尼<rt>いけの ぜんに</rt></ruby>が、<ruby>涙<rt>なみだ</rt></ruby>ながらに すがりついた。「<ruby>亡<rt>な</rt></ruby>くした わが子に、<ruby>顔<rt>かお</rt></ruby>だちが よく 似て おります……どうか、<ruby>命<rt>いのち</rt></ruby>だけは。」</p>
            <p>さあ。きみなら、この 少年を どうする？</p>`,
          deep: { q: 'なぜ、<ruby>敵<rt>てき</rt></ruby>の 子を 生かさないの？',
            body: `この 時代、<ruby>戦<rt>いくさ</rt></ruby>に 負けた <ruby>大将<rt>たいしょう</rt></ruby>の 一族は、<ruby>根絶<rt>ねだ</rt></ruby>やしに される ことが 多かった。生きのこった 子が 大きく なり、<ruby>兵<rt>へい</rt></ruby>を 集めて <ruby>復讐<rt>ふくしゅう</rt></ruby>（仕返し）に 来る——それを 何より おそれたからだ。だから「<ruby>敵<rt>てき</rt></ruby>の 子を <ruby>斬<rt>き</rt></ruby>る」のは、むごい ようでいて、その 世では「あたりまえの <ruby>用心<rt>ようじん</rt></ruby>」だった。<br>その ならわしを、清盛は <ruby>継母<rt>ままはは</rt></ruby>の 願いに 折れて <ruby>破<rt>やぶ</rt></ruby>った。それが <ruby>吉<rt>きち</rt></ruby>と 出るか <ruby>凶<rt>きょう</rt></ruby>と 出るか——この ときは まだ、<ruby>誰<rt>だれ</rt></ruby>にも わからない。`,
            cite: '※ ここで 見せた <ruby>情<rt>なさ</rt></ruby>けが、のちの 平家に どう はねかえって くるか——それは、まだ <ruby>誰<rt>だれ</rt></ruby>にも 見えて いない。' },
          onEnter: { card: 'p-yoritomo' },
          closeup: { tone: 'tense', cast: [ { face: 'p-kiyomori@young', name: '清盛（きみ）' }, { face: 'p-yoritomo@young', name: '頼朝（13）' } ] },
          choices: [
            { label: 'ならわしに <ruby>従<rt>したが</rt></ruby>い、<ruby>心<rt>こころ</rt></ruby>を <ruby>鬼<rt>おに</rt></ruby>に して <ruby>斬<rt>き</rt></ruby>る', to: '2-d', effect: { miyako: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし ここで <ruby>斬<rt>き</rt></ruby>って いたら……',
                body: `<p>後の 世の うらみの <ruby>芽<rt>め</rt></ruby>を <ruby>断<rt>た</rt></ruby>つ——たしかに、それが この 世の「<ruby>用心<rt>ようじん</rt></ruby>」だった。もし ここで <ruby>頼朝<rt>よりとも</rt></ruby>を <ruby>斬<rt>き</rt></ruby>って いたら、<ruby>二十年<rt>にじゅうねん</rt></ruby>あまり のちに 平家を <ruby>滅<rt>ほろ</rt></ruby>ぼす <ruby>総大将<rt>そうだいしょう</rt></ruby>は、この世に いなかったかも しれない。<ruby>歴史<rt>れきし</rt></ruby>は、まるで <ruby>違<rt>ちが</rt></ruby>う ものに なって いた だろう。</p><p>——だが <ruby>史実<rt>じじつ</rt></ruby>の 清盛は、<ruby>斬<rt>き</rt></ruby>らなかった。<ruby>継母<rt>ままはは</rt></ruby>の 願いを きき入れ、頼朝を 生かして <ruby>伊豆<rt>いず</rt></ruby>へ 流したのだ。</p>` } },
            { label: '<ruby>継母<rt>ままはは</rt></ruby>の 願いを きき入れ、<ruby>命<rt>いのち</rt></ruby>を 助けて <ruby>伊豆<rt>いず</rt></ruby>へ 流す', to: '2-d', canon: true, effect: { nasake: 2 },
              hist: { verdict: '史実では', match: 'その <ruby>情<rt>なさ</rt></ruby>けが、二十年後に——',
                body: `<p>清盛は <ruby>継母<rt>ままはは</rt></ruby>・<ruby>池禅尼<rt>いけの ぜんに</rt></ruby>の たっての 願いに 折れ、<ruby>頼朝<rt>よりとも</rt></ruby>を <ruby>死罪<rt>しざい</rt></ruby>に せず、<ruby>伊豆<rt>いず</rt></ruby>（今の <ruby>静岡県<rt>しずおかけん</rt></ruby>）へ 流した。命を ひろった 頼朝は、それから <ruby>二十年<rt>にじゅうねん</rt></ruby>あまり、じっと 時を 待つ。</p><p>そして——清盛の 死の ころ、その 頼朝こそが、平家を <ruby>滅<rt>ほろ</rt></ruby>ぼす 側の <ruby>総大将<rt>そうだいしょう</rt></ruby>と なる。「<ruby>敵<rt>てき</rt></ruby>に かけた <ruby>情<rt>なさ</rt></ruby>けが、身を <ruby>滅<rt>ほろ</rt></ruby>ぼす」。後の 物語は、この 出来事を そう 語る。だが それは、あくまで <ruby>滅<rt>ほろ</rt></ruby>びを 知った 後の 世の 見方。この ときの 清盛には、まだ 何も 見えて いない。</p>`,
                source: { grade: 'later',
                  name: '『<ruby>愚管抄<rt>ぐかんしょう</rt></ruby>』・『<ruby>平治物語<rt>へいじものがたり</rt></ruby>』',
                  note: '頼朝が 助けられ <ruby>伊豆<rt>いず</rt></ruby>へ 流された ことは 複数の 記録が 伝える。ただし「亡き子に 似て いた」といった <ruby>逸話<rt>いつわ</rt></ruby>は、物語の いろどり。' } } },
          ] },

        '2-d': { place: '第2章 むすび',
          onEnter: { clues: ['clue-2'] },
          text: `<p>二つの 乱を 勝ちぬいて、きみ（清盛）は <ruby>武門<rt>ぶもん</rt></ruby>の <ruby>頂<rt>いただき</rt></ruby>に 立った。もう だれも、平氏の 力を <ruby>無視<rt>むし</rt></ruby>できない。</p>
            <p>——なのに、ふしぎな ことが ある。勝ったのは、きみだ。それなのに 後の 世が「<ruby>悲劇<rt>ひげき</rt></ruby>の 人」として 語りついだのは、<ruby>敗<rt>やぶ</rt></ruby>れた <ruby>源義朝<rt>みなもとの よしとも</rt></ruby>や、<ruby>讃岐<rt>さぬき</rt></ruby>で 死んだ <ruby>崇徳<rt>すとく</rt></ruby>の ほうだった。</p>
            <p class="speak">「<ruby>保元<rt>ほうげん</rt></ruby>では 味方、<ruby>平治<rt>へいじ</rt></ruby>では <ruby>敵<rt>てき</rt></ruby>。……<ruby>実<rt>じつ</rt></ruby>の 父まで この 手に かけて、それでも おれは、勝てなかった。」</p>
            <p>——<ruby>討<rt>う</rt></ruby>たれた <ruby>義朝<rt>よしとも</rt></ruby>の 声が、ふと 耳に よみがえる 気が した。</p>`,
          deep: { q: '<ruby>義朝<rt>よしとも</rt></ruby>は、ほんとうに <ruby>実<rt>じつ</rt></ruby>の 父を 手に かけたの？',
            body: `<ruby>保元<rt>ほうげん</rt></ruby>の 乱に 負けた <ruby>崇徳<rt>すとく</rt></ruby>方には、命ごいを した 者も 多い。<ruby>義朝<rt>よしとも</rt></ruby>の 父・<ruby>源為義<rt>みなもとの ためよし</rt></ruby>も、息子を 通じて 助けを 願い出た——と 伝わる。だが 後白河方の <ruby>実力者<rt>じつりょくしゃ</rt></ruby>・<ruby>信西<rt>しんぜい</rt></ruby>は ゆるさない。<ruby>都<rt>みやこ</rt></ruby>で <ruby>三百五十年<rt>さんびゃくごじゅうねん</rt></ruby> 近く 絶えて いた <ruby>死罪<rt>しざい</rt></ruby>を、この 乱を きっかけに よみがえらせた のだ。義朝は、その 父を <ruby>討<rt>う</rt></ruby>つ 役を、みずから 引き受けるしか なかった。<br><ruby>身内<rt>みうち</rt></ruby>を あやめてでも、勝つ 側に つく——それが、この 時代の 武士の さだめ。今の わたしたちの ものさしでは、はかりきれない 重さが そこに ある。`,
            cite: '※ 合戦の 詳しい やりとりは、後の『<ruby>保元物語<rt>ほうげんものがたり</rt></ruby>』が ふくらませた 部分も ある。だが <ruby>敗者<rt>はいしゃ</rt></ruby>が <ruby>処刑<rt>しょけい</rt></ruby>され、その 手を 勝者側の 身内が くだしたと いう すじは、うたがいの 薄い できごと。' },
          creed: { line: '「勝った 者の 名より、<ruby>敗<rt>やぶ</rt></ruby>れた 者の <ruby>物語<rt>ものがたり</rt></ruby>が のこる。……あの 子を <ruby>斬<rt>き</rt></ruby>らずに おいたのは、<ruby>継母<rt>ままはは</rt></ruby>の 願いに 折れた ゆえ。<ruby>吉<rt>きち</rt></ruby>と 出るか、<ruby>凶<rt>きょう</rt></ruby>と 出るか。」',
            act: '——その えらびが 後に どう ころぶか、この ときの 清盛は、まだ 知らない。' },
          end: true },
      },
    },
    {
      id: 3, num: '三', title: '武士、貴族の頂へ', years: '1160〜1172',
      lead: '武士なのに、貴族のように。清盛は 力ではなく 位と 縁で、天下の ふところに 入る。',
      start: '3-a',
      teaser: '<ruby>位<rt>くらい</rt></ruby>も <ruby>縁<rt>えん</rt></ruby>も 手に 入れた 清盛。だが その 目は、みやこの 外——海の むこうへ 向いて いた。',
      scenes: {
        '3-a': { place: '<ruby>六波羅<rt>ろくはら</rt></ruby>',
          monologue: '（刀で 天下は とれても、刀だけでは 天下は <ruby>治<rt>おさ</rt></ruby>まらぬ。……ならば、<ruby>貴族<rt>きぞく</rt></ruby>の 世界の 内へ、もっと 深く 入りこむ までよ。）',
          text: `<p><ruby>永暦<rt>えいりゃく</rt></ruby>元年（1160年）、きみ（清盛）は <ruby>武士<rt>ぶし</rt></ruby>として <b>はじめて <ruby>公卿<rt>くぎょう</rt></ruby></b>に くわわった。公卿とは、<ruby>朝廷<rt>ちょうてい</rt></ruby>を 動かす いちばん 上の <ruby>貴族<rt>きぞく</rt></ruby>の こと。<ruby>絹<rt>きぬ</rt></ruby>の <ruby>装束<rt>しょうぞく</rt></ruby>が ならぶ 中に、刀だこの ある 手が 一つ 混じった。</p>
            <p>ずらりと ならんだ 貴族たちが、いっせいに きみを 見た。その 目は つめたい。「<ruby>戦<rt>いくさ</rt></ruby>しか <ruby>能<rt>のう</rt></ruby>の ない 男が、なぜ われらと 同じ <ruby>席<rt>せき</rt></ruby>に」——声には 出さぬ ささやきが、はだで わかる。</p>
            <p class="speak">「父上、ここで <ruby>敵<rt>てき</rt></ruby>を 作っては、平家の ためには なりませぬ」——そっと ささやくのは、きみの <ruby>嫡男<rt>ちゃくなん</rt></ruby>・<face pid="p-shigemori"><ruby>平重盛<rt>たいらの しげもり</rt></ruby></face>。父の 荒い 気性を、いつも 静かに おさえる 子だった。</p>`,
          spark: 'え！？ 見くだされるのは、平氏が「<ruby>成<rt>な</rt></ruby>り上がり」だから——と 思って いた？ それだけでは ない。<ruby>貴族<rt>きぞく</rt></ruby>に とって <ruby>戦<rt>いくさ</rt></ruby>や 人<ruby>斬<rt>ぎ</rt></ruby>りは「けがれ」——ふれると 身が よごれる もの。武士は その けがれを 引き受ける <ruby>下働<rt>したばたら</rt></ruby>き——そう 見る 目が、貴族の あいだには あった。きみは いま、その 目の 前に すわって いる。',
          deep: { q: '<ruby>公卿<rt>くぎょう</rt></ruby>って、そんなに すごいの？',
            body: `この ころの <ruby>朝廷<rt>ちょうてい</rt></ruby>では、<ruby>位<rt>くらい</rt></ruby>（<ruby>身分<rt>みぶん</rt></ruby>の 高さ）が すべてだった。いちばん 上の <ruby>公卿<rt>くぎょう</rt></ruby>は、ぜんぶで 二十人 ほど。国の まつりごとを 動かす、えらばれた <ruby>貴族<rt>きぞく</rt></ruby>だ。その 席は 長い あいだ、<ruby>藤原氏<rt>ふじわらし</rt></ruby>ら 家がらの よい 貴族が <ruby>代々<rt>だいだい</rt></ruby>しめて きた。<br>だから、<ruby>戦<rt>いくさ</rt></ruby>を 仕事に する <ruby>武士<rt>ぶし</rt></ruby>が そこに すわるのは、天と 地が ひっくり返る ほどの こと。清盛は 力ずくでは なく、<ruby>乱<rt>らん</rt></ruby>の <ruby>手柄<rt>てがら</rt></ruby>と <ruby>院<rt>いん</rt></ruby>への <ruby>奉仕<rt>ほうし</rt></ruby>を つみ重ねて、「<ruby>作法<rt>さほう</rt></ruby>どおり」に 入りこんだ。`,
            cite: '※ 力ずくで なく「作法どおり」入りこむ。それが かえって、古い <ruby>貴族<rt>きぞく</rt></ruby>の <ruby>神経<rt>しんけい</rt></ruby>を さかなでした。' },
          onEnter: { card: 'p-shigemori' },
          next: '3-b' },

        '3-b': { place: '<ruby>娘<rt>むすめ</rt></ruby>を、<ruby>帝<rt>みかど</rt></ruby>に', figure: 'bloodline',
          text: `<p><ruby>公卿<rt>くぎょう</rt></ruby>に なった とて、まだ <ruby>頂上<rt>ちょうじょう</rt></ruby>では ない。平家を だれにも くつがえせない ところまで——きみ（清盛）は、その 一手を <ruby>思<rt>おも</rt></ruby>い えがいて いた。</p>
            <p>刀では なく、<b>血の <ruby>縁<rt>えん</rt></ruby></b>で <ruby>皇室<rt>こうしつ</rt></ruby>と むすぶ。きみと <ruby>妻<rt>つま</rt></ruby>・<face pid="p-tokiko"><ruby>時子<rt>ときこ</rt></ruby></face>の 娘・<face pid="p-tokuko"><ruby>徳子<rt>とくこ</rt></ruby></face>を、<ruby>帝<rt>みかど</rt></ruby>・<face pid="p-takakura"><ruby>高倉<rt>たかくら</rt></ruby></face>天皇に <ruby>嫁<rt>とつ</rt></ruby>がせる。生まれた 子が 次の 帝に なれば——きみは <b>天皇の おじいさん</b>だ。</p>
            <p>まだ <ruby>幼<rt>おさな</rt></ruby>い 徳子の 顔が うかぶ。わが子を、<ruby>天下<rt>てんか</rt></ruby>を とる ための <ruby>駒<rt>こま</rt></ruby>に する のか。</p>
            <p>さて。きみなら、どう 動く？</p>`,
          deep: { q: '<ruby>外戚<rt>がいせき</rt></ruby>って、なに？',
            body: `<b><ruby>外戚<rt>がいせき</rt></ruby></b>とは、<ruby>天皇<rt>てんのう</rt></ruby>の <ruby>母方<rt>ははかた</rt></ruby>の 親せき——とくに、天皇の <ruby>母方<rt>ははかた</rt></ruby>の おじいさん（<ruby>外祖父<rt>がいそふ</rt></ruby>）の こと。<br>むかしから 大きな <ruby>貴族<rt>きぞく</rt></ruby>は、娘を <ruby>帝<rt>みかど</rt></ruby>に 嫁がせた。生まれた 孫が 次の 帝に なると、その おじいさんは <ruby>摂政<rt>せっしょう</rt></ruby>・<ruby>関白<rt>かんぱく</rt></ruby>と なって、<b>帝の 後ろで 力を にぎった</b>。これを『<ruby>摂関政治<rt>せっかんせいじ</rt></ruby>』と いい、<ruby>藤原氏<rt>ふじわらし</rt></ruby>が <ruby>何百年<rt>なんびゃくねん</rt></ruby>も 続けて きた「みやこの 勝ち方」だった。<br>娘を <ruby>政略<rt>せいりゃく</rt></ruby>に 使うのは、この 世では 家の ため あたりまえの こと だった（今の わたしたちの 感じ方とは、ずいぶん ちがう）。清盛は、武士なのに この 貴族の やり方を 使いこなした。`,
          },
          onEnter: { cards: ['p-tokuko', 'p-takakura'] },
          choices: [
            { label: '娘を <ruby>政略<rt>せいりゃく</rt></ruby>には 使わず、武の 力で 平家の 世を 守る', to: '3-c', effect: { nasake: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>縁<rt>えん</rt></ruby>を むすばずに いたら……',
                body: `<p>わが娘を <ruby>政略<rt>せいりゃく</rt></ruby>の <ruby>具<rt>ぐ</rt></ruby>（道具）には したくない——その 気もちは、今の きみには よく わかる かもしれない。もし 武の 力だけで 平家を 守れば、<ruby>院<rt>いん</rt></ruby>に 飼いならされず、平家は 平家の ままで いられた かもしれない。</p><p>だが 武士が 刀の 力だけで にらみを きかせれば、都の <ruby>貴族<rt>きぞく</rt></ruby>は ますます こわがり、<ruby>憎<rt>にく</rt></ruby>んだ かもしれない。そして 平家は、<ruby>皇室<rt>こうしつ</rt></ruby>と 固く むすばれる ことも なかった。——<ruby>史実<rt>じじつ</rt></ruby>の 清盛は、刀では なく 血の <ruby>縁<rt>えん</rt></ruby>を えらんだ。それが、平家を いちばん 高い ところへ 押し上げる。物語は、その 道を 進もう。</p>` } },
            { label: '娘・<ruby>徳子<rt>とくこ</rt></ruby>を <ruby>帝<rt>みかど</rt></ruby>に 嫁がせ、血の <ruby>縁<rt>えん</rt></ruby>で <ruby>皇室<rt>こうしつ</rt></ruby>と むすぶ', to: '3-c', canon: true, effect: { miyako: 2 },
              hist: { verdict: '史実では', match: 'それが、平家を <ruby>頂上<rt>ちょうじょう</rt></ruby>へ 押し上げる',
                body: `<p>きみは 刀では なく、血の <ruby>縁<rt>えん</rt></ruby>を えらんだ。やがて <ruby>娘<rt>むすめ</rt></ruby>・<ruby>徳子<rt>とくこ</rt></ruby>は <ruby>帝<rt>みかど</rt></ruby>の きさきと なり、その <ruby>翌年<rt>よくねん</rt></ruby>には <b><ruby>中宮<rt>ちゅうぐう</rt></ruby></b>——きさきの 中で いちばん 上に 立つ。刀を もつ 家の 娘が、そこに すわった。</p><p>だが、その 日は まだ 先だ。娘を 送り出す 前に、きみは もう ひとつの <ruby>頂<rt>いただき</rt></ruby>へ のぼる。</p>` } },
          ] },

        '3-c': { place: '<ruby>頂<rt>いただき</rt></ruby>に 立つ',
          monologue: '（<ruby>地方<rt>ちほう</rt></ruby>の <ruby>役人<rt>やくにん</rt></ruby>の 家に 生まれた この おれが、ここまで 来た。……だが、まだだ。まだ 止まらぬ。）',
          text: `<p><ruby>仁安<rt>にんあん</rt></ruby>二年（1167年）、きみ（清盛）は ついに <b><ruby>太政大臣<rt>だいじょうだいじん</rt></ruby></b>——<ruby>朝廷<rt>ちょうてい</rt></ruby>で いちばん 高い 役に つく。</p>
            <p>その <ruby>頂<rt>いただき</rt></ruby>で、きみは <ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby>と 向かい合う。<ruby>位<rt>くらい</rt></ruby>を さずける 側の 院と、のぼった きみ。</p>
            <p class="speak">「よくぞ ここまで <ruby>昇<rt>のぼ</rt></ruby>った、清盛。……高く <ruby>昇<rt>のぼ</rt></ruby>った 者は、いつか 落ちる もの。それまでは、せいぜい 使わせて もらおう」——にこやかな 院の まなざしの <ruby>奥<rt>おく</rt></ruby>から、そんな 声が 聞こえた 気が した。</p>
            <p>——こちらも、使える うちは 使わせて もらう。<ruby>笑顔<rt>えがお</rt></ruby>の <ruby>裏<rt>うら</rt></ruby>で、きみの 目も また、笑っては いなかった。</p>`,
          deep: { q: 'なぜ、<ruby>武士<rt>ぶし</rt></ruby>が <ruby>太政大臣<rt>だいじょうだいじん</rt></ruby>で 大さわぎに？',
            body: `<ruby>太政大臣<rt>だいじょうだいじん</rt></ruby>は、<ruby>朝廷<rt>ちょうてい</rt></ruby>の 役の 中で いちばん 上。ふだんは 家がらの とびきり よい <ruby>貴族<rt>きぞく</rt></ruby>だけが すわれる、<ruby>雲<rt>くも</rt></ruby>の 上の 席だった。そこに、見くだされて きた <ruby>武士<rt>ぶし</rt></ruby>が すわる——<ruby>身分<rt>みぶん</rt></ruby>の 順が すべての 世では、天と 地が ひっくり返る 出来事だ。<br>もっとも 清盛は、この 役を わずか 3か月ほどで しりぞく。ねらいは <ruby>位<rt>くらい</rt></ruby>そのものより、<b>太政大臣まで 出せる 家に なった こと</b>だった のかも しれない。<ruby>役<rt>やく</rt></ruby>に つかずとも、<ruby>血<rt>ち</rt></ruby>の <ruby>縁<rt>えん</rt></ruby>で <ruby>天下<rt>てんか</rt></ruby>を 動かせる——清盛が 見て いたのは、その もっと 先の <ruby>頂<rt>いただき</rt></ruby>だった。`,
          },
          onEnter: { cards: ['w-daijodaijin', 'p-tokiko'] },
          closeup: { tone: 'tense', cast: [ { face: 'p-goshirakawa', name: '後白河院' }, { face: 'p-kiyomori@elder', name: '清盛（きみ）' } ] },
          next: '3-c2' },

        '3-c2': { place: '<ruby>娘<rt>むすめ</rt></ruby>を 送る 日',
          monologue: '（この 子を 手ばなす。それで <ruby>一族<rt>いちぞく</rt></ruby>が 生きるなら、安い ものだ。……安い ものの はずだ。）',
          closeup: { tone: 'solemn', cast: [
            { face: 'p-tokuko', name: '娘・徳子（17さい）', expr: { brow: 'worried', eye: 'gentle', mouth: 'flat' } },
            { face: 'p-kiyomori@elder', name: '清盛（きみ）', expr: { brow: 'worried', eye: 'narrow', mouth: 'flat' } } ] },
          text: `<p><ruby>承安<rt>じょうあん</rt></ruby>元年（1171年）の 冬。きみは <ruby>娘<rt>むすめ</rt></ruby>・<ruby>徳子<rt>とくこ</rt></ruby>を <ruby>帝<rt>みかど</rt></ruby>に <ruby>嫁<rt>とつ</rt></ruby>がせる。<ruby>牛車<rt>ぎっしゃ</rt></ruby>に 乗る 前、娘は きみの 前で 足を 止めた。</p>
            <p>きみは その 手を とった。小さかった はずの 手が、大人の 手に なって いた。徳子は 17さい。むこうで 待つ 帝・<ruby>高倉<rt>たかくら</rt></ruby>は、まだ 11さいの 子どもだ。</p>
            <p>娘は、こう 言った——気が した。</p>
            <p class="speak">「父上。……行って まいります」</p>
            <p>きみは 何か 言おうとして、言えなかった。車は 動きだす。きみは、見えなく なるまで そこに 立って いた。</p>`,
          spark: 'え！？ 11さいで 帝？ この ころ、帝は 幼い うちに 位に つく ことが 多かった。まわりの 大人が 後ろで 力を にぎるには、その ほうが 都合が よかったのだ。——きみが いま しようと して いるのも、それと 同じ ことだ。',
          deep: { q: '<ruby>徳子<rt>とくこ</rt></ruby>は、どうやって <ruby>帝<rt>みかど</rt></ruby>の きさきに なれたの？', confidence: '○',
            body: `<ruby>武士<rt>ぶし</rt></ruby>の <ruby>娘<rt>むすめ</rt></ruby>が、そのまま <ruby>帝<rt>みかど</rt></ruby>の <ruby>后<rt>きさき</rt></ruby>（帝の <ruby>妻<rt>つま</rt></ruby>）に なるのは むずかしい。<ruby>身分<rt>みぶん</rt></ruby>の 高さが すべての 世だからだ。<br>そこで 徳子は、<ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby>の <b>もらい子</b>という 形を とり、兄・<ruby>重盛<rt>しげもり</rt></ruby>の 子にも なって から、帝の もとへ 入った。<br>この 話を 後おししたのは、院の きさき——じつは きみの 妻・<ruby>時子<rt>ときこ</rt></ruby>の 妹だ。旅立ちの 日、徳子の <ruby>帯<rt>おび</rt></ruby>を むすんで 送り出したのも、その 人だった。`,
            cite: '※ この 日、父と 娘が 何を 言いかわしたかを 書きとめた 紙は 無い。二人の 場面は 想像だ。' },
          next: '3-d' },

        '3-d': { place: '第3章 むすび', figure: 'court',
          onEnter: { clues: ['clue-3'] },
          text: `<p>こうして きみ（清盛）は <ruby>朝廷<rt>ちょうてい</rt></ruby>の いちばん 上に すわり、<ruby>娘<rt>むすめ</rt></ruby>は <ruby>帝<rt>みかど</rt></ruby>の もとへ 行った。<ruby>武士<rt>ぶし</rt></ruby>の 家が、だれも 歩いた ことの ない 道を 歩いて いる。</p>
            <p>「<ruby>戦<rt>いくさ</rt></ruby>しか <ruby>能<rt>のう</rt></ruby>の ない 武士が、なぜ われらの 上に すわるのだ」——古い <ruby>貴族<rt>きぞく</rt></ruby>たちの うらやみと <ruby>憎<rt>にく</rt></ruby>しみが、<ruby>都<rt>みやこ</rt></ruby>の あちこちで、静かに ふくらんで いった。</p>
            <p>その ねたみは、やがて どんな 形に なって いくのだろう。——その 手がかりは、きみの 手帳の 中に。</p>`,
          creed: { line: '「刀では、この 国は <ruby>治<rt>おさ</rt></ruby>まらぬ。<ruby>位<rt>くらい</rt></ruby>と <ruby>縁<rt>えん</rt></ruby>で、<ruby>天下<rt>てんか</rt></ruby>の ふところに 入る。」',
            act: '——<ruby>武<rt>ぶ</rt></ruby>で のぼり、みやこの <ruby>作法<rt>さほう</rt></ruby>で てっぺんに 立つ。この <ruby>頂<rt>いただき</rt></ruby>へは、<ruby>刀<rt>かたな</rt></ruby>を <ruby>抜<rt>ぬ</rt></ruby>かずに のぼった。' },
          end: true },
      },
    },
    {
      id: 4, num: '四', title: '海の道をひらく', years: '1167〜1173頃',
      lead: 'みやこの 外、海に ひらく 都を。銭が、国を 動かす。',
      start: '4-a',
      teaser: '海の 道を ひらいた 清盛。だが やがて、その <ruby>栄華<rt>えいが</rt></ruby>は「おごり」と 呼ばれ 始める。',
      scenes: {
        '4-a': { place: '<ruby>福原<rt>ふくはら</rt></ruby>・<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>',
          monologue: '（みやこの <ruby>位<rt>くらい</rt></ruby>は、もう のぼりつめた。だが おれの ほんとうの 場所は、<ruby>御所<rt>ごしょ</rt></ruby>でも 山でも ない。……海だ。）',
          text: `<p>山を こえると、風が かわる。<ruby>潮<rt>しお</rt></ruby>の におい。目の 前に、<ruby>瀬戸内<rt>せとうち</rt></ruby>の 海が ひらけた。<ruby>太政大臣<rt>だいじょうだいじん</rt></ruby>に なって 3か月、きみは その <ruby>位<rt>くらい</rt></ruby>を すてた。ほんとうに 見て いたのは、この 海だ。</p>
            <p>都から 山を こえた 海べ・<ruby>福原<rt>ふくはら</rt></ruby>（今の <ruby>神戸<rt>こうべ</rt></ruby>あたり）。清盛は ここに <ruby>拠点<rt>きょてん</rt></ruby>を うつし、すぐ そばの 港・<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>を、自分の <ruby>財産<rt>ざいさん</rt></ruby>を つぎこんで 造りなおしに かかる。</p>
            <p>なぜ、港か。海の むこう・<ruby>宋<rt>そう</rt></ruby>（今の 中国）と つながれば、<ruby>銭<rt>ぜに</rt></ruby>・焼き物・<ruby>書物<rt>しょもつ</rt></ruby>が どっと 入って くる。<b>銭が 動けば、国も 動く</b>——清盛は、そう 見て いた。</p>`,
          spark: 'え！？ 清盛は 西の 海の <ruby>難所<rt>なんしょ</rt></ruby>——<ruby>安芸<rt>あき</rt></ruby>の <ruby>音戸<rt>おんど</rt></ruby>の <ruby>瀬戸<rt>せと</rt></ruby>も ひらいたと いう。いまも <ruby>地元<rt>じもと</rt></ruby>に、こんな 話が 伝わる。「<ruby>沈<rt>しず</rt></ruby>む 夕日を 金の <ruby>扇<rt>おうぎ</rt></ruby>で <ruby>招<rt>まね</rt></ruby>き返し、たった 一日で 切りひらいた」。でも <ruby>証拠<rt>しょうこ</rt></ruby>を さがすと……？',
          deep: { q: '<ruby>音戸<rt>おんど</rt></ruby>の <ruby>瀬戸<rt>せと</rt></ruby>を、一日で ひらいた？',
            body: `<ruby>安芸<rt>あき</rt></ruby>（今の <ruby>広島<rt>ひろしま</rt></ruby>）の <ruby>音戸<rt>おんど</rt></ruby>の <ruby>瀬戸<rt>せと</rt></ruby>は、船が とおる 海の <ruby>難所<rt>なんしょ</rt></ruby>。清盛が ここを ひらいた とき、日が <ruby>暮<rt>く</rt></ruby>れそうに なると 金の <ruby>扇<rt>おうぎ</rt></ruby>で 夕日を <ruby>招<rt>まね</rt></ruby>き返し、<b>一日で 工事を 終えた</b>——という「<ruby>日招<rt>ひまね</rt></ruby>き<ruby>伝説<rt>でんせつ</rt></ruby>」が、<ruby>地元<rt>じもと</rt></ruby>に 伝わる。<br>でも、この 話を 書いた 確かな 当時の <ruby>記録<rt>きろく</rt></ruby>は 見あたらない。工事が 本当に あったのかさえ、じつは はっきり しない。<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>を まもる <ruby>人工<rt>じんこう</rt></ruby>の 島・<ruby>経<rt>きょう</rt></ruby>ヶ<ruby>島<rt>しま</rt></ruby>にも、「<ruby>人柱<rt>ひとばしら</rt></ruby>の かわりに <ruby>経文<rt>きょうもん</rt></ruby>を 書いた 石を <ruby>沈<rt>しず</rt></ruby>めた」という 伝説が ある。島を 築いたのは 事実と 見られるが、<ruby>経石<rt>きょういし</rt></ruby>の 話は やはり 伝説だ。`,
            cite: '※ すごい 人には、後の 世が「すごい 伝説」を つけ足したく なる。それも また、物語の 作られ方だ。' },
          onEnter: { card: 'w-owada' },
          next: '4-b' },

        '4-b': { place: '<ruby>宋<rt>そう</rt></ruby>の 船を、どこまで',
          text: `<p>これまで、<ruby>宋<rt>そう</rt></ruby>の 大きな 船は <ruby>博多<rt>はかた</rt></ruby>どまりが ならわしだった。都から 遠い 西の <ruby>玄関<rt>げんかん</rt></ruby>で 止めるのが、みやこの しきたり。</p>
            <p>だが 清盛は、もっと 先を 見る。<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>を 造りなおし、<ruby>沖<rt>おき</rt></ruby>に <ruby>人工<rt>じんこう</rt></ruby>の 島・<ruby>経<rt>きょう</rt></ruby>ヶ<ruby>島<rt>しま</rt></ruby>を 築いて 波を ふせぐ。そのうえで、宋の 船を <ruby>瀬戸内<rt>せとうち</rt></ruby>の おく——都の すぐ そばまで 引き入れよう と いうのだ。<ruby>前例<rt>ぜんれい</rt></ruby>の ない <ruby>賭<rt>か</rt></ruby>けだった。港 ひとつに <ruby>一族<rt>いちぞく</rt></ruby>の <ruby>財産<rt>ざいさん</rt></ruby>を 注ぎこむ。しくじれば、<ruby>平家<rt>へいけ</rt></ruby>は 大金を うしない、みやこ じゅうの 笑いものに なる。</p>
            <p>さて。きみ（清盛）なら、宋の 船を どこまで 入れる？</p>`,
          deep: { q: '<ruby>日宋貿易<rt>にっそうぼうえき</rt></ruby>は、清盛が 始めた？',
            body: `気を つけたい ことが ある。宋との <ruby>交易<rt>こうえき</rt></ruby>は、清盛が 一から 始めた わけでは ない。父・<ruby>忠盛<rt>ただもり</rt></ruby>の ころから、<ruby>平氏<rt>へいし</rt></ruby>は 海の <ruby>商<rt>あきな</rt></ruby>いで 富を 築いて きた。宋の 商人も、前から 博多に 来て いた。<br>清盛が した のは、港を 大きく 造りなおし、宋船を <ruby>畿内<rt>きない</rt></ruby>の そばまで 引き入れて、<ruby>交易<rt>こうえき</rt></ruby>を いちだんと さかんに した こと。だから「海の 道を ぜんぶ ひとりで ひらいた、すごい 人」と 言いきるのは、じつは 言いすぎなのだ。`,
          },
          onEnter: { card: 'w-nissou' },
          choices: [
            { label: '<ruby>慣例<rt>かんれい</rt></ruby>どおり、宋船は <ruby>博多<rt>はかた</rt></ruby>どまりに して おく', to: '4-c', effect: { miyako: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 博多で 止めて いたら……',
                body: `<p>都の しきたりを 守る、かしこい えらび方だ。だが もし 博多で 止めて いたら、<ruby>宋銭<rt>そうせん</rt></ruby>や 焼き物や <ruby>書物<rt>しょもつ</rt></ruby>は、これほど 早く 大量には、<ruby>畿内<rt>きない</rt></ruby>まで 入って こなかったかも しれない。</p><p>——<ruby>史実<rt>じじつ</rt></ruby>の 清盛は、<ruby>慣例<rt>かんれい</rt></ruby>を こえて 港を 築き、宋船を 引き入れる 道を えらんだ。だからこそ 富と <ruby>文物<rt>ぶんぶつ</rt></ruby>（焼き物や 書物などの 品）が どっと 流れこんだ。もっとも、それが 世の中を どれほど 変えたのかは、今も <ruby>学者<rt>がくしゃ</rt></ruby>の あいだで <ruby>議論<rt>ぎろん</rt></ruby>が 続いている。</p>` } },
            { label: '<ruby>私財<rt>しざい</rt></ruby>を つぎこんで 港を 築き、宋船を <ruby>畿内<rt>きない</rt></ruby>まで 引き入れる', to: '4-c', canon: true, effect: { umi: 2 },
              hist: { verdict: '史実では', match: 'それが、清盛の いちばんの 大仕事に なる',
                body: `<p>清盛は、みやこの <ruby>慣例<rt>かんれい</rt></ruby>を こえて、宋船を <ruby>畿内<rt>きない</rt></ruby>の そばまで 引き入れる 道を えらんだ。<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>は <ruby>日宋貿易<rt>にっそうぼうえき</rt></ruby>の 国内の <ruby>拠点<rt>きょてん</rt></ruby>と なり、<ruby>宋銭<rt>そうせん</rt></ruby>が どっと 流れこむ。じつは 当時の 日本は、自分の 国の お金を 作って いなかった。だから この 宋銭が、そのまま お金の かわりに 使われる ように なって いく。</p><p>——ただし、それが「良い こと」ばかり だったか どうかは、また 別の 話。銭が どっと 入って くる ことが 世を どう 変えたのかは、今も いろんな 見方が ある。</p>` } },
          ] },

        '4-c': { place: '海の 道づくり',
          text: `<p>清盛は、<ruby>安芸<rt>あき</rt></ruby>（今の <ruby>広島<rt>ひろしま</rt></ruby>）の 海の 上に 建つ <ruby>厳島神社<rt>いつくしまじんじゃ</rt></ruby>を、あつく うやまった。海の 上の <ruby>社<rt>やしろ</rt></ruby>は、<ruby>平家<rt>へいけ</rt></ruby>の 守り神——海に 生きる <ruby>一族<rt>いちぞく</rt></ruby>の、心の よりどころ。今に のこる うつくしい <ruby>社殿<rt>しゃでん</rt></ruby>は、清盛が 定めた かたちを うけついで いる。</p>
            <p>だが、海の 道は ひと晩では できない。港を なおし、島を 築き、船を 招き、<ruby>銭<rt>ぜに</rt></ruby>を まわす——ばらばらの 大仕事を、正しい 順に 組み上げねば ならない。<b><ruby>裏方<rt>うらかた</rt></ruby>の <ruby>段取<rt>だんど</rt></ruby>り</b>だ。</p>`,
          onEnter: { card: 'w-itsukushima' },
          minigame: { type: 'sort', title: '海の 道づくりの <ruby>段取<rt>だんど</rt></ruby>り',
            lead: '海の 道を ひらくには、何から 手を つける？ 正しい 順に タップ！',
            items: [
              '🛠️ <ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>を、大きく 造りなおす',
              '🏝️ <ruby>沖<rt>おき</rt></ruby>に <ruby>経<rt>きょう</rt></ruby>ヶ<ruby>島<rt>しま</rt></ruby>を 築いて、波から 港を まもる',
              '⛵ <ruby>宋<rt>そう</rt></ruby>の 船を、<ruby>瀬戸内<rt>せとうち</rt></ruby>の おくへ 招き入れる',
              '🪙 <ruby>宋銭<rt>そうせん</rt></ruby>・焼き物・<ruby>書物<rt>しょもつ</rt></ruby>が、どっと 流れこむ',
            ],
            outro: '港を なおす → 島で 波を ふせぐ → 船を 招く → 銭が まわる。この 順番を 一つずつ 組み上げたのが、清盛の「海の 道づくり」だった。——もっとも、じっさいは きれいに 一つずつでは ない。港が できあがる 前から、宋の 船は もう 来はじめて いた。' },
          next: '4-c2' },

        '4-c2': { place: '<ruby>院<rt>いん</rt></ruby>が、海を 見に きた',
          monologue: '（<ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby>が、みずから 山を こえて きた。……この 海を、たっぷり 見せつけて やる。）',
          text: `<p><ruby>嘉応<rt>かおう</rt></ruby>二年（1170年）の 秋。造りかけの 港に、<ruby>宋<rt>そう</rt></ruby>の 船が 入りはじめた ころ。院が、この 海を 見に きた。</p>
            <p class="speak">「その 海とやら、見せて もらおうか」——院は そう 言った 気が した。</p>
            <p>きみは 院を <ruby>浜<rt>はま</rt></ruby>へ つれて 行った。すこし 先の 船着き場に、海の むこうから 来た 商人たちが 立って いる。</p>
            <p>みやこには、ずっと 守られて きた きまりが ある。<ruby>帝<rt>みかど</rt></ruby>も 院も、よその 国の 人とは 顔を 合わせない。やぶれば、何を 言われるか わからない。</p>
            <p>さて。きみなら、あの 人たちを 院に 引き合わせる？</p>`,
          deep: { q: '会わせるだけで、なぜ 大ごと？', confidence: '◎',
            body: `この ころの みやこの きまりでは、海の むこうとの やりとりは <ruby>九州<rt>きゅうしゅう</rt></ruby>の <ruby>役所<rt>やくしょ</rt></ruby>を 通す ことに なって いて、<ruby>位<rt>くらい</rt></ruby>の 高い 人は 出て こない。<br>そして この 世では、<b>前と 同じに する ことが、正しさの しるし</b>だった。だから きまりの 外の ことが 起きると、当時の 人は「この世の ものでは ない 力が 動いた」と 考えた。めずらしい だけでは 済まない、という わけだ。`,
            cite: '※ 会った ことは 記録に のこる。だが <ruby>浜<rt>はま</rt></ruby>で どう 立ち、何を 話したかを 書きとめた 紙は 無い。この 場面は <ruby>想像<rt>そうぞう</rt></ruby>だ。' },
          choices: [
            { label: '海と 港だけを 見せ、宋の 人には 会わせない', to: '4-d', effect: { miyako: 2 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 会わせずに いたら……',
                body: `<p>みやこの きまりを 守る、用心ぶかい えらび方だ。都の 人が おどろく ことも、日記に 書きとめられる ことも なかった かも しれない。</p><p>——<ruby>史実<rt>じじつ</rt></ruby>の きみは、引き合わせる ほうを えらんだ。都の <ruby>貴族<rt>きぞく</rt></ruby>・<ruby>九条兼実<rt>くじょうの かねざね</rt></ruby>は、その日の 日記に こう 書きつけた。「わが 国では 二百五十年、なかった こと。<ruby>天魔<rt>てんま</rt></ruby>（<ruby>悪<rt>わる</rt></ruby>い <ruby>魔物<rt>まもの</rt></ruby>）の しわざか」</p>` } },
            { label: '<ruby>浜<rt>はま</rt></ruby>で 引き合わせ、院に 海の むこうの 人を 会わせる', to: '4-d', canon: true, effect: { umi: 2 },
              hist: { verdict: '史実では', match: 'めでたい 日の はずが、こわがられた',
                body: `<p>院は <ruby>宋<rt>そう</rt></ruby>の 人と 向かい合い、その 目で 海の むこうを 見た。きみは、みやこの きまりの 外へ 出た。</p><p>この 日を、都の <ruby>貴族<rt>きぞく</rt></ruby>・<ruby>九条兼実<rt>くじょうの かねざね</rt></ruby>が 日記に 書きとめて いる。「わが 国では 二百五十年、なかった こと。<ruby>天魔<rt>てんま</rt></ruby>（<ruby>悪<rt>わる</rt></ruby>い <ruby>魔物<rt>まもの</rt></ruby>）の しわざか」——きみの 晴れの 日は、みやこには こわい 日だった。その 見方は やがて、ひとつの 言葉に 変わる。『おごり』と。</p>` } },
          ] },

        '4-d': { place: '第4章 むすび',
          onEnter: { clues: ['clue-4'] },
          text: `<p>こうして 清盛は、海の むこうまで つづく「道」を ひらいた。<ruby>宋銭<rt>そうせん</rt></ruby>が 流れこみ、焼き物や <ruby>書物<rt>しょもつ</rt></ruby>が 都に あふれる。刀では 手に 入らない 力だった。</p>
            <p>けれど、港を なおし、島を 築く 地道な 働きは、あまり 語られない。だから 都の 人も 後の 世も、清盛を「おごれる 悪人」か「すごい <ruby>先駆者<rt>せんくしゃ</rt></ruby>」か、わかりやすい ひと言に まとめたがる。——どちらが 本当かは、きみが これから、自分の 目で 確かめて いく。</p>`,
          creed: { line: '「みやこの 外に、海に ひらく 都を つくる。——<ruby>銭<rt>ぜに</rt></ruby>が、国を 動かす。」',
            act: '——刀では なく、船と <ruby>銭<rt>ぜに</rt></ruby>で。清盛は、<ruby>武士<rt>ぶし</rt></ruby>の 新しい 力の かたちを、海に もとめた。' },
          end: true },
      },
    },
    {
      id: 5, num: '五', title: 'おごり、と呼ばれて', years: '1177〜1179',
      lead: '栄華の 頂で、清盛は「おごれる 者」と 呼ばれ 始める。',
      start: '5-a',
      teaser: '<ruby>独裁<rt>どくさい</rt></ruby>の <ruby>頂<rt>いただき</rt></ruby>で、清盛は ついに 都そのものを 動かす——海の そばへ。だが その とき、<ruby>諸国<rt>しょこく</rt></ruby>の <ruby>源氏<rt>げんじ</rt></ruby>が いっせいに 立ち上がる。',
      scenes: {
        '5-a': { place: '京・<ruby>六波羅<rt>ろくはら</rt></ruby>', figure: 'court',
          monologue: '（高く <ruby>昇<rt>のぼ</rt></ruby>るほど、<ruby>風<rt>かぜ</rt></ruby>あたりは 強く なる。……だが、いまさら 降りられは せぬ。）',
          text: `<p>娘・<ruby>徳子<rt>とくこ</rt></ruby>を <ruby>帝<rt>みかど</rt></ruby>に <ruby>嫁<rt>とつ</rt></ruby>がせ、<ruby>平家<rt>へいけ</rt></ruby>は <ruby>天下<rt>てんか</rt></ruby>の <ruby>頂<rt>いただき</rt></ruby>に 立った。<ruby>一門<rt>いちもん</rt></ruby>（平家の 一族）から 何十人もの 者が 高い <ruby>位<rt>くらい</rt></ruby>に つき、多くの <ruby>国<rt>くに</rt></ruby>を おさめた。</p>
            <p><ruby>妻<rt>つま</rt></ruby>・<face pid="p-tokiko"><ruby>時子<rt>ときこ</rt></ruby></face>の 弟・<ruby>平時忠<rt>たいらの ときただ</rt></ruby>が こう 言い放ったと、物語は 伝える。「この <ruby>一門<rt>いちもん</rt></ruby>で ない 者は、人で ない」。おごり高ぶって いる——都は、そう ささやき 始めた。</p>
            <p>だが——七年ほど 前の こと。きみの <ruby>孫<rt>まご</rt></ruby>が 道で 車から 引きずり下ろされ、平家は 手ひどい <ruby>仕返<rt>しかえ</rt></ruby>しを した。「<ruby>清盛<rt>きよもり</rt></ruby>さまの ご<ruby>命令<rt>めいれい</rt></ruby>だ」と、みなが 言う。</p>`,
          spark: 'え！？ でも、同じ ころの <ruby>貴族<rt>きぞく</rt></ruby>の 日記を 読むと ちがう。あの <ruby>仕返<rt>しかえ</rt></ruby>しを 命じたのは、心やさしい はずの 息子・<ruby>重盛<rt>しげもり</rt></ruby>だった——そう 見る 学者の ほうが、いまは 多い？',
          deep: { q: '<ruby>殿下乗合<rt>てんかののりあい</rt></ruby>事件——だれが <ruby>仕返<rt>しかえ</rt></ruby>しを 命じた？',
            body: `<ruby>嘉応<rt>かおう</rt></ruby>二年（1170年）、清盛の 孫・<ruby>資盛<rt>すけもり</rt></ruby>の 一行が、道で <ruby>摂政<rt>せっしょう</rt></ruby>・<ruby>藤原基房<rt>ふじわらの もとふさ</rt></ruby>の 行列と 行き会った。<ruby>車<rt>くるま</rt></ruby>を 降りて <ruby>礼<rt>れい</rt></ruby>を しなかった として、資盛は 基房の <ruby>供<rt>とも</rt></ruby>の 者たちに 手ひどく はずかしめられる。のちに 平家は、これに <ruby>仕返<rt>しかえ</rt></ruby>しを した。<br>『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』は、この 乱暴な 仕返しを 命じたのは 清盛だ——と、清盛を <ruby>短気<rt>たんき</rt></ruby>で むごい <ruby>悪役<rt>あくやく</rt></ruby>に 描く。ところが 同じ ころの <ruby>貴族<rt>きぞく</rt></ruby>の 日記（『<ruby>玉葉<rt>ぎょくよう</rt></ruby>』）では、じっさいに 命じたのは 資盛の 父・<ruby>重盛<rt>しげもり</rt></ruby>だった、とする 説が 有力だ。` },
          next: '5-b' },

        '5-b': { place: '<ruby>鹿<rt>しし</rt></ruby>ヶ<ruby>谷<rt>たに</rt></ruby>',
          text: `<p><ruby>頂<rt>いただき</rt></ruby>に 立った <ruby>平家<rt>へいけ</rt></ruby>に、はむかう 動きが 生まれる。<ruby>治承<rt>じしょう</rt></ruby>元年（1177年）、<ruby>後白河<rt>ごしらかわ</rt></ruby>院に 近い 者たちが、京の <ruby>鹿<rt>しし</rt></ruby>ヶ<ruby>谷<rt>たに</rt></ruby>の <ruby>山荘<rt>さんそう</rt></ruby>に あつまり、ひそかに「平氏を <ruby>討<rt>う</rt></ruby>とう」と 語り合った——と される。だが この たくらみは、仲間の <ruby>告<rt>つ</rt></ruby>げ口で ばれる。清盛は 関係者を 次々 とらえ、遠い 島へ 流した。</p>
            <p>山荘の あるじの 僧・<face pid="p-shunkan"><ruby>俊寛<rt>しゅんかん</rt></ruby></face>も、南の 海の <ruby>鬼界<rt>きかい</rt></ruby>ヶ<ruby>島<rt>じま</rt></ruby>へ。やがて 都から「<ruby>赦<rt>ゆる</rt></ruby>し」が 届く。ところが 赦されたのは、共に 流された 二人だけ。俊寛 ひとりが、名を 呼ばれず、島に のこされた。</p>
            <p class="speak">「なぜ、わたし だけが。……<ruby>船<rt>ふね</rt></ruby>よ、行くな。わたしも 都へ、都へ——」浜べに とりのこされ、遠ざかる 船に 手を のばす 俊寛の <ruby>叫<rt>さけ</rt></ruby>びが、聞こえた 気が した。俊寛は 二度と、都を 見なかった。</p>`,
          deep: { q: '<ruby>鹿<rt>しし</rt></ruby>ヶ<ruby>谷<rt>たに</rt></ruby>の <ruby>陰謀<rt>いんぼう</rt></ruby>は、本当に あったの？',
            body: `じつは、<ruby>鹿<rt>しし</rt></ruby>ヶ<ruby>谷<rt>たに</rt></ruby>で ほんとうに「平氏を <ruby>討<rt>う</rt></ruby>つ」<ruby>謀議<rt>ぼうぎ</rt></ruby>が あったのか どうかは、今も はっきり しない。くわしい 話を 伝えるのは、やはり 後の 世の『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』が 中心だ。中には、「清盛が <ruby>反対<rt>はんたい</rt></ruby>する 者を まとめて つぶす ために、<ruby>陰謀<rt>いんぼう</rt></ruby>が あった ことに した」と 見る <ruby>学者<rt>がくしゃ</rt></ruby>も いる。<br>たしかなのは、この 一件で <ruby>後白河<rt>ごしらかわ</rt></ruby>院の <ruby>近臣<rt>きんしん</rt></ruby>が 大きく 力を そがれ、清盛と 院の <ruby>対立<rt>たいりつ</rt></ruby>が いっそう 深まった、という こと。事件の「かたち」は 物語が 作ったのかも しれないが、そこで 動いた 力は、たしかに あった。`,
            cite: '※ 物語は くわしく 語る。だが たしかな <ruby>記録<rt>きろく</rt></ruby>は 少ない——この 事件も、そうだった。' },
          onEnter: { cards: ['w-shishigatani', 'p-shunkan'] },
          next: '5-c' },

        '5-c': { place: '<ruby>小松殿<rt>こまつどの</rt></ruby>',
          monologue: '（<ruby>重盛<rt>しげもり</rt></ruby>……。あれは、おれと <ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby>の あいだに かかった、たった 一本の <ruby>橋<rt>はし</rt></ruby>だった。）',
          closeup: { tone: 'grief', cast: [ { face: 'p-shigemori', name: '息子・重盛', expr: { brow: 'calm', eye: 'closed', mouth: 'flat' } } ] },
          text: `<p><ruby>治承<rt>じしょう</rt></ruby>三年（1179年）、<ruby>嫡男<rt>ちゃくなん</rt></ruby>・<face pid="p-shigemori"><ruby>重盛<rt>しげもり</rt></ruby></face>が <ruby>病<rt>やまい</rt></ruby>で 世を 去った。まだ <ruby>四十二<rt>よんじゅうに</rt></ruby>。</p>
            <p class="speak">「父上、ここで <ruby>敵<rt>てき</rt></ruby>を 作っては、平家の ためには なりませぬ」——父と <ruby>後白河<rt>ごしらかわ</rt></ruby>院の あいだに 立ちつづけた 声が、もう しない。</p>
            <p class="speak">「……<ruby>重盛<rt>しげもり</rt></ruby>か」<br>それきり、きみは 何も 言えなかった——気が した。</p>`,
          next: '5-c2' },

        '5-c2': { place: '<ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby>と、<ruby>向<rt>む</rt></ruby>かい合う',
          closeup: { tone: 'tense', cast: [
            { face: 'p-goshirakawa', name: '後白河院', expr: { brow: 'stern', eye: 'sharp', mouth: 'grin' } },
            { face: 'p-kiyomori@elder', name: '清盛（きみ）', expr: { brow: 'angry', eye: 'narrow', mouth: 'frown' } } ] },
          text: `<p><ruby>橋<rt>はし</rt></ruby>が 落ちた。国を だれに まかせるか——それを 決めるのは <ruby>後白河<rt>ごしらかわ</rt></ruby>院だ。院は この すきに、重盛の 土地を とりあげた。きみを 見すえる 院の、ふてぶてしい 声が、聞こえた 気が した——</p>
            <p class="speak">「<ruby>武士<rt>ぶし</rt></ruby>ふぜいが、この わしの 上に 立とうと いうのか。……よかろう。高く <ruby>昇<rt>のぼ</rt></ruby>った 者ほど、落ちる ときは 深いぞ、清盛」</p>
            <p>きみ（清盛）なら、この <ruby>後白河<rt>ごしらかわ</rt></ruby>院を どう する？</p>`,
          deep: { q: '清盛を <ruby>憎<rt>にく</rt></ruby>んだ <ruby>貴族<rt>きぞく</rt></ruby>も、その 死を おそれた？',
            body: `清盛と 同じ ころを 生きた <ruby>貴族<rt>きぞく</rt></ruby>・<ruby>九条兼実<rt>くじょうの かねざね</rt></ruby>は、日記『<ruby>玉葉<rt>ぎょくよう</rt></ruby>』に、清盛の やり方を「<ruby>罰<rt>ばつ</rt></ruby>を あたえて ばかりで、思いやりが すたれた」と きびしく 書いた。<ruby>兼実<rt>かねざね</rt></ruby>は 清盛と <ruby>対立<rt>たいりつ</rt></ruby>した 側の 人だ。<br>ところが その 兼実が、清盛が 死んだ あとには「これで かえって 世が 乱れる のでは」と 心配 して いる。ただの <ruby>悪人<rt>あくにん</rt></ruby>なら、死ねば せいせいする はず。なのに、その 死を おそれる——。<br>いちばん 近くで 憎んだ 相手の <ruby>記録<rt>きろく</rt></ruby>でさえ、清盛は「ただの 悪人」では 片づいて いない。`,
            cite: '※ 憎んだ 相手の <ruby>筆<rt>ふで</rt></ruby>でも、清盛は「悪人」ひと色には ならなかった。' },
          onEnter: { card: 'w-jisho' },
          choices: [
            { label: 'たかぶる 心を おさえ、院と <ruby>和解<rt>わかい</rt></ruby>の 道を さぐる', to: '5-d', effect: { nasake: 2 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 歩みよって いたら……',
                body: `<p>力で ねじ<ruby>伏<rt>ふ</rt></ruby>せる かわりに、たがいに 一歩ずつ 引く。——ただし、<ruby>頭<rt>あたま</rt></ruby>を 下げても、とりあげられた 国は もどらない。<ruby>鹿<rt>しし</rt></ruby>ヶ<ruby>谷<rt>たに</rt></ruby>で 見た とおり、院の まわりの 者は、次の <ruby>機会<rt>きかい</rt></ruby>を 待つ ことも できる。</p><p>もし 清盛が 院と 手を にぎり直して いたら、平家に「院を とじこめた <ruby>悪人<rt>あくにん</rt></ruby>」の 悪評は つかず、<ruby>翌年<rt>よくねん</rt></ruby>、<ruby>諸国<rt>しょこく</rt></ruby>の <ruby>源氏<rt>げんじ</rt></ruby>が いっせいに 立ち上がる <ruby>口実<rt>こうじつ</rt></ruby>（もっともらしい 理由）も、生まれなかったかも しれない。海に ひらく 都は、もっと 長く 続いた だろうか——。</p><p>だが <ruby>史実<rt>じじつ</rt></ruby>の 清盛は、<ruby>和解<rt>わかい</rt></ruby>を えらばなかった。<ruby>橋<rt>はし</rt></ruby>を 失った あと えらんだのは、院を 力で おさえこむ 道だった。</p>` } },
            { label: '<ruby>兵<rt>へい</rt></ruby>を 都に 入れ、院を <ruby>幽閉<rt>ゆうへい</rt></ruby>し、国を 動かす 力を とりあげる', to: '5-d', canon: true, effect: { miyako: 2 },
              hist: { verdict: '史実では', match: 'それが、平家 <ruby>独裁<rt>どくさい</rt></ruby>の 頂——そして <ruby>破局<rt>はきょく</rt></ruby>の 入口',
                body: `<p>清盛は <ruby>兵<rt>へい</rt></ruby>を 率いて 京を おさえた。反平家の <ruby>貴族<rt>きぞく</rt></ruby> 四十人 ほどから <ruby>官職<rt>かんしょく</rt></ruby>を うばい、<ruby>後白河<rt>ごしらかわ</rt></ruby>院を <ruby>鳥羽殿<rt>とばどの</rt></ruby>に とじこめる。これが『<ruby>治承<rt>じしょう</rt></ruby>三年の <ruby>政変<rt>せいへん</rt></ruby>』（1179年）だ。<ruby>院<rt>いん</rt></ruby>は 力を うしない、平家に <ruby>逆<rt>さか</rt></ruby>らえる 者は、もう だれも いなく なった。平家の <ruby>独裁<rt>どくさい</rt></ruby>は、ここに 頂を きわめる。</p><p>だが、<ruby>天皇<rt>てんのう</rt></ruby>でも、その 上に 立つ <ruby>院<rt>いん</rt></ruby>でも ない ただの <ruby>武士<rt>ぶし</rt></ruby>が、その 院を とじこめて <ruby>政治<rt>せいじ</rt></ruby>を にぎる——これは あまりに <ruby>前代未聞<rt>ぜんだいみもん</rt></ruby>だった。この 一手が、<ruby>翌年<rt>よくねん</rt></ruby>の「平家を <ruby>討<rt>う</rt></ruby>て」という 声を、全国から 呼びおこす ことに なる。頂は、そのまま くだり坂の はじまりでも あった。</p>`,
                source: { grade: 'contemporary',
                  name: '『<ruby>玉葉<rt>ぎょくよう</rt></ruby>』',
                  note: '<ruby>幽閉<rt>ゆうへい</rt></ruby>と <ruby>官職<rt>かんしょく</rt></ruby>とり上げは、この 日記が 書きとめた 事実。ただし その 場の 清盛と 院の やりとりは、後の 物語の いろどり。' } } },
          ] },

        '5-d': { place: '第5章 むすび',
          onEnter: { cards: ['w-heike'], clues: ['clue-5'] },
          text: `<p>「おごれる <ruby>悪人<rt>あくにん</rt></ruby>・清盛」。その 物語は、こうして かたちを 整えて いった。だが——その 姿を いちばん 広く 伝えた『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』は、いつ、だれが 作ったのか。</p>
            <p>じつは『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』が 世に 広まったのは、平家が <ruby>壇<rt>だん</rt></ruby>ノ<ruby>浦<rt>うら</rt></ruby>で <ruby>滅<rt>ほろ</rt></ruby>んだ ずっと あと。目の 見えない <ruby>琵琶法師<rt>びわほうし</rt></ruby>たちが、<ruby>節<rt>ふし</rt></ruby>を つけて 語り 歩いた 語り物だ。その 大もとには、<ruby>滅<rt>ほろ</rt></ruby>んだ 平家を とむらう 願いが あった。</p>
            <p><ruby>魂<rt>たましい</rt></ruby>を とむらう には、なぜ <ruby>滅<rt>ほろ</rt></ruby>んだのかの「わけ」が いる。物語は、清盛を「おごって <ruby>滅<rt>ほろ</rt></ruby>んだ <ruby>悪人<rt>あくにん</rt></ruby>」に 仕立てた。おごる 者は かならず ほろびる——その 教えを 伝える うってつけの <ruby>悪役<rt>あくやく</rt></ruby>として。</p>`,
          creed: { line: '「"おごり"と 世間は 言う。……好きに 呼ぶが いい。おれは、おれの 見た 道を 歩いた——ただ それだけの 男だ。」',
            act: '——だが その「おごれる <ruby>悪人<rt>あくにん</rt></ruby>」の 物語もまた、後の 世が とむらいの ために えがいた 一つの 姿。ほんとうの 清盛は、まだ その <ruby>奥<rt>おく</rt></ruby>に いる。' },
          end: true },
      },
    },
    {
      id: 6, num: '六', title: '海へ都を動かす', years: '1180',
      lead: '海の そばへ、都を うごかす。だが、諸国の 源氏が いっせいに——。',
      start: '6-a',
      teaser: '<ruby>翌年<rt>よくねん</rt></ruby>、天下を にぎった 清盛を、思いも よらぬ ものが おそう——はげしい 熱。<ruby>平家<rt>へいけ</rt></ruby>の <ruby>滅<rt>ほろ</rt></ruby>びを 見ぬまま、その 命の <ruby>灯<rt>ひ</rt></ruby>は……。',
      scenes: {
        '6-a': { place: '<ruby>福原<rt>ふくはら</rt></ruby>', figure: 'bloodline',
          monologue: '（<ruby>血<rt>ち</rt></ruby>は、力だ。……わが <ruby>孫<rt>まご</rt></ruby>が、<ruby>帝<rt>みかど</rt></ruby>と なった。もう、だれにも うばえぬ。）',
          text: `<p><ruby>治承<rt>じしょう</rt></ruby>四年（1180年）、清盛の 夢が、ひとつ かなう。娘・<face pid="p-tokuko"><ruby>徳子<rt>とくこ</rt></ruby></face>が 生んだ <ruby>孫<rt>まご</rt></ruby>——わずか <ruby>三<rt>さん</rt></ruby><ruby>歳<rt>さい</rt></ruby>の <ruby>言仁<rt>ときひと</rt></ruby>親王が、<ruby>帝<rt>みかど</rt></ruby>の 位に つく。<em><face pid="p-antoku"><ruby>安徳<rt>あんとく</rt></ruby></face>天皇</em>だ。清盛は、天皇の <ruby>外祖父<rt>がいそふ</rt></ruby>（母がたの おじいさん）に なった。その 帝は、<ruby>玉座<rt>ぎょくざ</rt></ruby>の 重みも 知らず、ただ 大人に <ruby>抱<rt>だ</rt></ruby>かれて その 日を むかえた、幼い 子どもで しかない。</p>
            <p>その 年の 夏、清盛は <ruby>京<rt>きょう</rt></ruby>じゅうが 目を うたがう 一手を 打つ。<b>都を、京から <ruby>福原<rt>ふくはら</rt></ruby>（いまの <ruby>神戸<rt>こうべ</rt></ruby>）へ 移す</b>——<em><ruby>福原遷都<rt>ふくはらせんと</rt></ruby></em>だ。</p>
            <p>四百年 ちかく 続いた 京の 都を すてて、なぜ わざわざ 海の そばへ？ 都の 人々は、あきれ、いきどおった。</p>`,
          spark: 'え！？ その <ruby>福原<rt>ふくはら</rt></ruby>、じつは きみが <ruby>自分<rt>じぶん</rt></ruby>の <ruby>財産<rt>ざいさん</rt></ruby>を つぎこんだ あの <ruby>港<rt>みなと</rt></ruby>の すぐ そば。のちの 世は これを「おごりが 生んだ ばかげた <ruby>失敗<rt>しっぱい</rt></ruby>」と 書いた。でも 近ごろ、「じつは <ruby>先<rt>さき</rt></ruby>を 見た 一手」と 見る <ruby>学者<rt>がくしゃ</rt></ruby>も——？',
          deep: { q: '<ruby>福原遷都<rt>ふくはらせんと</rt></ruby>は、ただの <ruby>無謀<rt>むぼう</rt></ruby>な <ruby>暴走<rt>ぼうそう</rt></ruby>だった？',
            body: `<ruby>遷都<rt>せんと</rt></ruby>の とき、都の <ruby>貴族<rt>きぞく</rt></ruby>の 日記（『<ruby>玉葉<rt>ぎょくよう</rt></ruby>』）は、これを「<ruby>天狗<rt>てんぐ</rt></ruby>の しわざ」とまで 書いた。新しい 都づくりは 進まず、<ruby>福原遷都<rt>ふくはらせんと</rt></ruby>は 長く「おごった 清盛の とんだ <ruby>失態<rt>しったい</rt></ruby>」と されて きた。<br>だが 近ごろの <ruby>研究<rt>けんきゅう</rt></ruby>（<ruby>高橋昌明<rt>たかはし まさあき</rt></ruby>ら）は、ちがう 光を あてる。福原は 海の 道の <ruby>拠点<rt>きょてん</rt></ruby>・<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>の そば。ここに 都を 置けば、<ruby>日宋貿易<rt>にっそうぼうえき</rt></ruby>の <ruby>富<rt>とみ</rt></ruby>を 直に つかめる。京の 古い <ruby>貴族<rt>きぞく</rt></ruby>や 大<ruby>寺社<rt>じしゃ</rt></ruby>の 力から 離れる ねらいも あったろう、と いう。<br>おろかな <ruby>失敗<rt>しっぱい</rt></ruby>か、早すぎた <ruby>挑戦<rt>ちょうせん</rt></ruby>か。いまも、決着は ついて いない。` },
          onEnter: { cards: ['p-antoku', 'w-fukuhara'] },
          next: '6-b' },

        '6-b': { place: '<ruby>京<rt>きょう</rt></ruby>',
          text: `<p>だが、<ruby>遷都<rt>せんと</rt></ruby>への <ruby>反対<rt>はんたい</rt></ruby>は、清盛が 思った 以上に 根づよかった。住みなれた 都を 離れたくない <ruby>貴族<rt>きぞく</rt></ruby>たち。大きな 力を もつ 京の <ruby>寺社<rt>じしゃ</rt></ruby>。生まれ 育った 土地を うばわれる、と おびえる 人々。「四百年の 都を、いまさら すてられるか」——その 声は、やまなかった。</p>
            <p>新しい 都・福原の <ruby>造営<rt>ぞうえい</rt></ruby>は、はかどらない。<ruby>孫<rt>まご</rt></ruby>の <ruby>帝<rt>みかど</rt></ruby>・<ruby>安徳<rt>あんとく</rt></ruby>天皇も、その 父も、しぶしぶ 福原へ うつって きたが、みなの 心は、まだ 京に あった。</p>
            <p>さあ。これほどの <ruby>反対<rt>はんたい</rt></ruby>を、きみ（清盛）なら どう する？</p>`,
          q: '海の そばの 新しい 都——おし通すか、あきらめるか。',
          choices: [
            { label: '京の 都に とどまり、<ruby>遷都<rt>せんと</rt></ruby>を あきらめる', to: '6-c', effect: { miyako: 2 },
              hist: { verdict: 'もしもルート', moshimo: true, match: '「都は、やはり 京」——そう 折れて いたら……',
                body: `<p>もし 清盛が <ruby>貴族<rt>きぞく</rt></ruby>や <ruby>寺社<rt>じしゃ</rt></ruby>の <ruby>反対<rt>はんたい</rt></ruby>に 折れて いたら、「都を うばった <ruby>暴君<rt>ぼうくん</rt></ruby>」という 新しい 悪評は つかなかった だろう。この あと 全国に 広がる「<ruby>平家<rt>へいけ</rt></ruby>を <ruby>討<rt>う</rt></ruby>て」の 声も、少しは 弱まった かも しれない。</p><p>だが そのとき、<b>海の 道の 中心に 都を 置く</b>という、だれも 見た ことの ない 絵は、えがかれる ことなく 消えた。福原の 夢は、はじめから 無かった ことに なる。</p><p>——<ruby>史実<rt>じじつ</rt></ruby>の 清盛は、折れなかった。<ruby>反対<rt>はんたい</rt></ruby>の 声を おし切って、都を 海へ 動かす ほうを えらんだのだ。</p>` } },
            { label: '<ruby>反対<rt>はんたい</rt></ruby>を おし切り、海に ひらく 新しい 都・福原へ 移す', to: '6-c', canon: true, effect: { umi: 2 },
              hist: { verdict: '史実では', match: 'それが『<ruby>福原遷都<rt>ふくはらせんと</rt></ruby>』——四百年 続いた 都を、海へ',
                body: `<p>清盛は、みなの <ruby>反対<rt>はんたい</rt></ruby>を 力で おし切った。<ruby>治承<rt>じしょう</rt></ruby>四年（1180年）六月、都は 京から 福原へ 移された。海の そばに、新しい 都を ひらく——<ruby>平安京<rt>へいあんきょう</rt></ruby>が できて から、はじめての ことだった。</p><p>だが、これほど 大きな ことを、たった 一人の 力で おし通す。それは、<ruby>平家<rt>へいけ</rt></ruby>の 力が <ruby>頂<rt>いただき</rt></ruby>を きわめた しるしで あると 同時に、あまりに 多くの 敵を つくる 一手でも あった。この とき すでに、遠い 国ぐにで、<b>ある <ruby>火種<rt>ひだね</rt></ruby></b>が くすぶり 始めて いた——。</p>` } },
          ] },

        '6-c': { place: '<ruby>福原<rt>ふくはら</rt></ruby> → <ruby>京<rt>きょう</rt></ruby>',
          reveal: { face: 'p-yoritomo', tone: 'crisis',
            title: '<ruby>急報<rt>きゅうほう</rt></ruby>——<ruby>諸国<rt>しょこく</rt></ruby>の <ruby>源氏<rt>げんじ</rt></ruby>、いっせいに <ruby>挙兵<rt>きょへい</rt></ruby>',
            caption: '「<ruby>平家<rt>へいけ</rt></ruby>を <ruby>討<rt>う</rt></ruby>て」の 声が 全国を かけめぐる。<ruby>伊豆<rt>いず</rt></ruby>で 兵を あげたのは——かつて 清盛が <ruby>斬<rt>き</rt></ruby>らずに 生かした、あの 男。' },
          monologue: '（あの とき……あの 子どもを、<ruby>斬<rt>き</rt></ruby>って おけば。……いや。もう、おそい。）',
          text: `<p>都を 福原へ 移した、その 年の 秋。<ruby>平家<rt>へいけ</rt></ruby>を 根から ゆるがす 動きが 立ち上がった。きっかけは 春、<ruby>帝<rt>みかど</rt></ruby>に なれなかった <ruby>皇子<rt>おうじ</rt></ruby>・<face pid="p-mochihito"><ruby>以仁王<rt>もちひとおう</rt></ruby></face>が 放った、「<ruby>平家<rt>へいけ</rt></ruby>を <ruby>討<rt>う</rt></ruby>て」の 声だった。</p>
            <p class="speak">「<ruby>本来<rt>ほんらい</rt></ruby>、<ruby>帝<rt>みかど</rt></ruby>に なる はずだったのは、おれだ。<ruby>平家<rt>へいけ</rt></ruby>さえ、いなければ——」</p>
            <p><ruby>以仁王<rt>もちひとおう</rt></ruby> 自身は、まもなく 討たれた。だが 火は 消えず、秋、その 火を いちばん 大きく もやす 男が <ruby>伊豆<rt>いず</rt></ruby>で 立ち上がる。<ruby>源頼朝<rt>みなもとの よりとも</rt></ruby>だ。</p>
            <p>きみは 覚えて いるだろうか。二十年 前、まだ <ruby>十三<rt>じゅうさん</rt></ruby><ruby>歳<rt>さい</rt></ruby>だった この 少年を、清盛は <ruby>斬<rt>き</rt></ruby>らずに 伊豆へ 流した（第二章）。あの ときの「情け」が、いま <ruby>牙<rt>きば</rt></ruby>を むく——<ruby>平家物語<rt>へいけものがたり</rt></ruby>は、のちに そう 語る。</p>
            <p>清盛は 福原の 都を あきらめ、十一月、京へ もどした。海に ひらく 都は、わずか 半年で ついえた。</p>`,
          deep: { q: '「情けが、<ruby>滅<rt>ほろ</rt></ruby>びを まねいた」——本当に そう？',
            body: `『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』は、<ruby>頼朝<rt>よりとも</rt></ruby>を 生かした ことを「清盛 <ruby>最大<rt>さいだい</rt></ruby>の しくじり」と 語る。情けを かけた 相手に <ruby>滅<rt>ほろ</rt></ruby>ぼされる——物語として、よく できて いる。<br>でも、少し 立ち止まって みよう。「あの 情けが <ruby>滅<rt>ほろ</rt></ruby>びを まねいた」という 線は、<b><ruby>滅<rt>ほろ</rt></ruby>びた 後から ふりかえって、はじめて 引ける 線</b>だ。もし <ruby>頼朝<rt>よりとも</rt></ruby>を <ruby>斬<rt>き</rt></ruby>って いても、別の <ruby>源氏<rt>げんじ</rt></ruby>が 立ち上がった かも しれない。<br>ものごとの わけを、たった 一つの できごとに しぼると、話は すっきり する。でも 本当の <ruby>歴史<rt>れきし</rt></ruby>は、いつも それより こみ入って いる。` },
          onEnter: { card: 'p-mochihito' },
          next: '6-d' },

        '6-d': { place: '第6章 むすび',
          onEnter: { clues: ['clue-6'] },
          text: `<p>海に ひらく 都は、半年で 消えた。後の 世は これを、「おごった 清盛の、ばかげた <ruby>見込<rt>みこ</rt></ruby>みちがい」として 語り伝えて いく。</p>
            <p>でも——もし <ruby>諸国<rt>しょこく</rt></ruby>の <ruby>源氏<rt>げんじ</rt></ruby>の <ruby>挙兵<rt>きょへい</rt></ruby>が なければ。もし 都づくりに、あと 数年の 時が あれば。海の 道の 中心に 都を 置く この <ruby>前代未聞<rt>ぜんだいみもん</rt></ruby>の <ruby>試<rt>こころ</rt></ruby>みは、ちがう 実を 結んで いたかも しれない。</p>
            <p>では、この 半年の 都は、ただの "<ruby>失敗<rt>しっぱい</rt></ruby>"だったのか。——その 問いは、きみの 手帳に とっておこう。</p>`,
          creed: { line: '「"<ruby>天狗<rt>てんぐ</rt></ruby>の しわざ"と そしるが いい。海の そばに 都を——おれは、それが 見たかった。ただ、それだけの 男よ。」',
            act: '——<ruby>反対<rt>はんたい</rt></ruby>を おし切り、海に 都を ひらいた 男。その <ruby>夢<rt>ゆめ</rt></ruby>が 半年で ついえても、清盛は うつむかなかった。——だが その からだに <ruby>熱<rt>ねつ</rt></ruby>が しのびよって いる ことを、この ときの 清盛は まだ 知らない。' },
          end: true },
      },
    },
    {
      id: 7, num: '終', title: '熱病、そしてその後の物語', years: '1181〜1185',
      lead: '滅びを 見ずに、清盛は 逝く。そして 物語だけが 残る。',
      start: '7-a',
      scenes: {
        '7-a': { place: '<ruby>京<rt>きょう</rt></ruby>（死の <ruby>床<rt>とこ</rt></ruby>）',
          monologue: '（からだが、火のように 熱い。……<ruby>都<rt>みやこ</rt></ruby>を 海へ 動かした、その 冬に。まだ、見とどけて いない ことが、あるのに。）',
          text: `<p><ruby>治承<rt>じしょう</rt></ruby>五年（1181年）の 春。<ruby>天下<rt>てんか</rt></ruby>を にぎった きみを、はげしい <ruby>熱病<rt>ねつびょう</rt></ruby>が おそった。体は 燃えるように 熱く、口に する 水さえ うけつけない。<ruby>僧<rt>そう</rt></ruby>の <ruby>祈<rt>いの</rt></ruby>りも、熱を 引かせは しない。</p>
            <p>天下に <ruby>並<rt>なら</rt></ruby>ぶ 者の なかった 男が、<ruby>病<rt>やまい</rt></ruby>の 前では、なす すべも ない。そして きみは、まだ 知らない——この <ruby>病<rt>やまい</rt></ruby>が <ruby>命<rt>いのち</rt></ruby>を うばい、<b>自分は <ruby>平家<rt>へいけ</rt></ruby>の <ruby>滅<rt>ほろ</rt></ruby>びを、ついに 見ずに 終わる</b> ことを。</p>`,
          spark: 'え！？ これほど 名を のこした 男なのに、「<ruby>何<rt>なん</rt></ruby>の 病で 死んだのか」さえ、いまも はっきり しない——？',
          deep: { q: '清盛は、何の <ruby>病<rt>やまい</rt></ruby>で 亡くなったの？',
            body: `じつは、<b>くわしい <ruby>病名<rt>びょうめい</rt></ruby>は、今も わかって いない</b>。高い 熱に 苦しんだ、と 伝わる ばかりで、<ruby>当時<rt>とうじ</rt></ruby>の <ruby>記録<rt>きろく</rt></ruby>にも 書かれて いない。<br>その 死の ようすを いちばん くわしく のこしたのは、同じ ころを 生きた <ruby>貴族<rt>きぞく</rt></ruby>・<ruby>九条兼実<rt>くじょうの かねざね</rt></ruby>の 日記『<ruby>玉葉<rt>ぎょくよう</rt></ruby>』（この 本に 何度も 出て きた、あの 日記）だ。<br>清盛を「おごれる <ruby>悪人<rt>あくにん</rt></ruby>」と えがいた『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』は、<ruby>滅亡<rt>めつぼう</rt></ruby>の ずっと あとの 語り物。いっぽう『玉葉』は、<b>同じ 時代を 生きた 人が、その 日に 書いた 記録</b>だ。同じ 死でも、いつ・だれが 書いたかで、その 重みは まるで ちがう。`,
            cite: '※ 天下を とった 男の <ruby>死因<rt>しいん</rt></ruby>さえ、はっきり しない。「実は よく わかって いない」は、旅の 終わりにも、また 顔を 出す。' },
          onEnter: { clue: 'clue-7' },
          next: '7-a2' },

        '7-a2': { place: '<ruby>京<rt>きょう</rt></ruby> — <ruby>最期<rt>さいご</rt></ruby>の ことば',
          monologue: '（<ruby>時子<rt>ときこ</rt></ruby>の 手が、そばに ある。……もう、目も かすんで きた。言うて おくべき ことは、なんだ。）',
          closeup: { tone: 'grief', cast: [ { face: 'p-kiyomori@old', name: '清盛（きみ）' }, { face: 'p-tokiko@old', name: '妻・時子' } ] },
          text: `<p>まくらもとに、<ruby>長年<rt>ながねん</rt></ruby> つれそった <ruby>妻<rt>つま</rt></ruby>・<ruby>時子<rt>ときこ</rt></ruby>。やせ おとろえた きみの 手を、時子は だまって にぎって いた。</p>
            <p class="speak">「……<ruby>殿<rt>との</rt></ruby>。しっかり なさいませ」——時子の 声が、遠く 聞こえた <ruby>気<rt>き</rt></ruby>が した。</p>
            <p>『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』は、清盛の <ruby>最期<rt>さいご</rt></ruby>を こう 語る。「<ruby>墓<rt>はか</rt></ruby>の 前に、<ruby>頼朝<rt>よりとも</rt></ruby>の 首を かけよ」——<ruby>恨<rt>うら</rt></ruby>みに 燃えたまま 死ぬ <ruby>悪人<rt>あくにん</rt></ruby>。そう えがく ための <ruby>名場面<rt>めいばめん</rt></ruby>だ。</p>
            <p>だが、きみが ほんとうに 何を 言ったか、<ruby>記録<rt>きろく</rt></ruby>は どこにも ない。<b>「悪人」の 最期さえ、<ruby>物語<rt>ものがたり</rt></ruby>が 作った もの</b>。だから、いま きみが 言う それが、清盛 最期の ことばに なる。</p>`,
          q: 'かすむ 目で、きみ（清盛）は 最期に 何と 言う？',
          choices: [
            { label: '「海の……道を、<ruby>絶<rt>た</rt></ruby>やすな。あれが、平家の <ruby>命<rt>いのち</rt></ruby>だ」', to: '7-b', effect: { umi: 2 },
              hist: { verdict: '記録に ないこと', seal: '心', match: '清盛 <ruby>最期<rt>さいご</rt></ruby>の ことばは、記録に ない',
                body: `<p>清盛が 死の <ruby>床<rt>とこ</rt></ruby>で ほんとうに 何を 言ったか——それを 書きとめた <ruby>記録<rt>きろく</rt></ruby>は、残って いない。『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』が 語る <ruby>頼朝<rt>よりとも</rt></ruby>への 恨みつらみも、いま きみが 言った 海への ねがいも、どちらも のちの 世の <ruby>想像<rt>そうぞう</rt></ruby>だ。</p><p>だから、いま きみが 言った それが、清盛の 最期の ことば。海に 生き、海に 富を もとめ 続けた 男の 一生を、この 一言が しめくくった——そう 思えば、それが 答えだ。</p>` } },
            { label: '「<ruby>時子<rt>ときこ</rt></ruby>。あとの ことは……たのむ。すまぬ、な」', to: '7-b', effect: { nasake: 2 },
              hist: { verdict: '記録に ないこと', seal: '心', match: '清盛 <ruby>最期<rt>さいご</rt></ruby>の ことばは、記録に ない',
                body: `<p>清盛が 死の <ruby>床<rt>とこ</rt></ruby>で ほんとうに 何を 言ったか——それを 書きとめた <ruby>記録<rt>きろく</rt></ruby>は、残って いない。『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』が 語る <ruby>頼朝<rt>よりとも</rt></ruby>への 恨みつらみも、いま きみが 言った 家族への ことばも、どちらも のちの 世の <ruby>想像<rt>そうぞう</rt></ruby>だ。</p><p>だから、いま きみが 言った それが、清盛の 最期の ことば。<ruby>天下<rt>てんか</rt></ruby>を とった 男も、最期に のこしたのは、身内への 一言だった——そう 思えば、それが 答えだ。この あと 時子は、その たのみを、思いも よらぬ かたちで 引き受ける ことに なる。</p>` } },
          ] },

        '7-b': { place: '<ruby>壇<rt>だん</rt></ruby>ノ<ruby>浦<rt>うら</rt></ruby>',
          monologue: '（清盛の いない 平家は……。海に 生きた 一族が、海で、終わる。）',
          text: `<p>清盛の 死から 四年——<ruby>源氏<rt>げんじ</rt></ruby>に 追われた <ruby>平家<rt>へいけ</rt></ruby>は、<ruby>長門<rt>ながと</rt></ruby>の <ruby>壇<rt>だん</rt></ruby>ノ<ruby>浦<rt>うら</rt></ruby>で、<ruby>最後<rt>さいご</rt></ruby>の 戦いを むかえた。追いつめたのは、<ruby>頼朝<rt>よりとも</rt></ruby>の 弟・<face pid="p-yoshitsune"><ruby>義経<rt>よしつね</rt></ruby></face>。</p>
            <p><ruby>激<rt>はげ</rt></ruby>しい 戦いの すえ、平家は やぶれた。もはや これまで——その とき、清盛の <ruby>妻<rt>つま</rt></ruby>・<face pid="p-tokiko@old"><ruby>時子<rt>ときこ</rt></ruby></face>は、まだ 八つの <ruby>幼<rt>おさな</rt></ruby>い <ruby>帝<rt>みかど</rt></ruby>・<ruby>安徳<rt>あんとく</rt></ruby>天皇——清盛の <ruby>孫<rt>まご</rt></ruby>を、しっかりと <ruby>抱<rt>だ</rt></ruby>きあげた。</p>
            <p class="speak">「<ruby>波<rt>なみ</rt></ruby>の 下にも、<ruby>都<rt>みやこ</rt></ruby>は ございます」——おびえる 幼い 帝に そう 言い聞かせ、時子は 共に 海へ 身を しずめた……と、『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』は 語る。</p>
            <p>清盛の 子・<face pid="p-tomomori"><ruby>知盛<rt>とももり</rt></ruby></face>も、「見るべき ほどの ことは、見つ」と 言いのこして 海へ 消えた、と <ruby>物語<rt>ものがたり</rt></ruby>は 伝える。</p>
            <p>海に <ruby>興<rt>おこ</rt></ruby>り、海で <ruby>栄<rt>さか</rt></ruby>え、海に 消えた 一族。静まりかえった 海の うえに、平家の <ruby>世<rt>よ</rt></ruby>は、終わった。</p>`,
          deep: { q: '<ruby>潮<rt>しお</rt></ruby>の 流れが、勝ち負けを 決めた？',
            body: `長い あいだ、壇ノ浦の 戦いは「はじめ <ruby>潮<rt>しお</rt></ruby>の 流れに のった 平家が 有利だったが、<ruby>途中<rt>とちゅう</rt></ruby>で 流れが 逆に なり、源氏が 勝った」と 語られて きた。海の 上の 戦いを、<ruby>潮<rt>しお</rt></ruby>の 満ち引きで 説明する、わかりやすい 話だ。<br>だが 近ごろの <ruby>研究<rt>けんきゅう</rt></ruby>では、「本当に <ruby>潮<rt>しお</rt></ruby>の 流れが 勝敗を 分けたのか」に、<ruby>疑<rt>うたが</rt></ruby>いの 声も 上がって いる。当時の <ruby>潮<rt>しお</rt></ruby>の ようすを 正しく 知るのは むずかしく、これも また、後の 世が「きれいに 説明したく なって」つけ足した 一面かも しれない。<br>——大きな <ruby>出来事<rt>できごと</rt></ruby>ほど、人は「なぜ そう なったか」を、たった 一つの わかりやすい わけで しめくくりたがる。`,
            cite: '※「<ruby>潮<rt>しお</rt></ruby>の 流れが 決めた」——その わかりやすさを うたがって みる ことも、なぞときの ひとつだ。' },
          onEnter: { cards: ['p-tomomori', 'p-yoshitsune', 'w-dannoura'] },
          next: '7-c' },

        '7-c': { place: '物語をつらぬく謎 — 答え合わせ',
          text: `<p>旅の はじめ、第一章で あずけた <ruby>謎<rt>なぞ</rt></ruby>を、もう 一度。</p>
            <p class="speak">「なぜ、清盛は『おごれる 悪人』として 語りつがれたのか？ ——<ruby>武士<rt>ぶし</rt></ruby>で はじめて <ruby>天下<rt>てんか</rt></ruby>の てっぺんに 立ち、海の 道まで ひらいた 男なのに。」</p>
            <p>集めた 手がかりを、ひとつずつ 思いかえして——<br><em>きみは、どう 考える？</em></p>`,
          showClues: true,
          q: 'きみの 答えは？（どれを 選んでも、正解の ひとつ）',
          choices: [
            { label: '<ruby>勝<rt>か</rt></ruby>った 源氏と、<ruby>滅<rt>ほろ</rt></ruby>んだ 平家。その 物語を 書いたのは、清盛では ない 人たちだったから', to: '7-d', answer: 0,
              hist: { verdict: 'きみの 答え', match: 'それは、確かな 答えの ひとつ',
                body: `<p>そのとおり。物語を のこすのは、いつも「後の 世の 人」だ。<ruby>勝<rt>か</rt></ruby>った 源氏の 世に なり、<ruby>滅<rt>ほろ</rt></ruby>んだ 平家を とむらう 語り物『<ruby>平家物語<rt>へいけものがたり</rt></ruby>』が 生まれた。<b>「おごる 者は かならず ほろびる」——その 教えを 伝える ために、清盛は うってつけの <ruby>悪役<rt>あくやく</rt></ruby>に えらばれた</b>。書き手が ちがえば、同じ 男も、まるで ちがう 顔に なる。</p>`, card: 'p-kiyomori' } },
            { label: '<ruby>時代<rt>じだい</rt></ruby>の 先を、行きすぎたから。海の 道も <ruby>遷都<rt>せんと</rt></ruby>も、早すぎた <ruby>挑戦<rt>ちょうせん</rt></ruby>だった', to: '7-d', answer: 1,
              hist: { verdict: 'きみの 答え', match: 'それも、鋭い 答えの ひとつ',
                body: `<p>そのとおり かも しれない。<ruby>武士<rt>ぶし</rt></ruby>で はじめて 天下を にぎり、海に ひらく 都を 夢みた——だれも 見た ことの ない ことを した 男は、まわりから すれば「<ruby>常識<rt>じょうしき</rt></ruby>はずれの <ruby>暴走<rt>ぼうそう</rt></ruby>」に 見えた だろう。<b>早すぎる <ruby>挑戦<rt>ちょうせん</rt></ruby>は、うまく いかなければ、あとから「<ruby>見当<rt>けんとう</rt></ruby>ちがい」と <ruby>笑<rt>わら</rt></ruby>われる</b>。近ごろは、その 見方を 見直す <ruby>学者<rt>がくしゃ</rt></ruby>も ふえて いる。</p>`, card: 'p-kiyomori' } },
            { label: 'たしかに、力で <ruby>押<rt>お</rt></ruby>し通した ところも あった。清盛にも、"おごり"は あったから', to: '7-d', answer: 2,
              hist: { verdict: 'きみの 答え', match: 'それも、正直な 答えの ひとつ',
                body: `<p>それも、大切な 見方だ。<ruby>後白河<rt>ごしらかわ</rt></ruby><ruby>院<rt>いん</rt></ruby>を <ruby>幽閉<rt>ゆうへい</rt></ruby>し、<ruby>反対<rt>はんたい</rt></ruby>を 力で <ruby>押<rt>お</rt></ruby>し切って 都を 動かした——清盛の やり方には、たしかに <ruby>強引<rt>ごういん</rt></ruby>な ところが あった。物語は、その 一面を 大きく ふくらませた。<b>「ぜんぶ 作り話」でも ない</b>。だからこそ、悪役の 物語は、これほど 長く 信じられて きたのだ。</p>`, card: 'p-kiyomori' } },
            { label: '……わからない。でも、わからないから、面白い', to: '7-d', answer: 3,
              hist: { verdict: 'きみの 答え', match: 'それこそ、いちばん 大人な 答えかも',
                body: `<p>それが、いちばん 正直な 答えかも しれない。母が だれかも、<ruby>死因<rt>しいん</rt></ruby>も、最期の ことばも——清盛には「よく わからない」ことが たくさん ある。<b>わからない ことが 多いからこそ、人は 想像で 物語を うめ、いろいろな 顔を 作って きた</b>。だからこそ、清盛の 顔は、ひとつでは ない。いまも いくつも あるのだ。</p>`, card: 'p-kiyomori' } },
          ] },

        '7-d': { place: '終章 むすび',
          onEnter: { cards: ['p-antoku'] },
          text: `<p><ruby>正解<rt>せいかい</rt></ruby>は、ひとつじゃない。手がかりを 集めて、自分なりの 答えを 組み立てる——それが、<ruby>歴史<rt>れきし</rt></ruby>の 楽しみだ。</p>
            <p>「おごれる <ruby>悪人<rt>あくにん</rt></ruby>」も、「海の 道を ひらいた <ruby>先駆者<rt>せんくしゃ</rt></ruby>」も、清盛 自身が 名のった 顔では ない。<b>どちらを 信じるかは、もう、きみの <ruby>手帳<rt>てちょう</rt></ruby>の 手がかりに かかって いる。</b></p>
            <p>ほんとうの 清盛は、その 二つの あいだで、いまも ゆれて いる。<ruby>悪役<rt>あくやく</rt></ruby>でも <ruby>英雄<rt>えいゆう</rt></ruby>でも なく——<ruby>迷<rt>まよ</rt></ruby>い、<ruby>賭<rt>か</rt></ruby>け、力を ふるい、海を 見つめた、ひとりの 大きな 男として。</p>
            <p class="speak">よく ここまで、清盛と いっしょに 旅を してくれた。<ruby>手帳<rt>てちょう</rt></ruby>の「？？？」が、ひらいたよ。</p>`,
          creed: { line: '「"<ruby>悪人<rt>あくにん</rt></ruby>"と 呼ぶ 者が いる。"先を 見た 男"と 言う 者も いる。……どちらも、おれの <ruby>半分<rt>はんぶん</rt></ruby>よ。残りの 半分は——きみが、その 目で 決めろ。」',
            act: '——<ruby>保元<rt>ほうげん</rt></ruby>・<ruby>平治<rt>へいじ</rt></ruby>を 勝ちぬき、海の 道を ひらき、都を 動かした 男。その 顔は、<ruby>悪役<rt>あくやく</rt></ruby>にも <ruby>先駆者<rt>せんくしゃ</rt></ruby>にも 定まらぬまま、いまも きみの 手の中で ゆれて いる。' },
          end: true },
      },
    },
  ],
};
