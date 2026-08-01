// Story data (STORY). All 7 chapters from design §2 are fully authored (pilot = ch3 「咸臨丸」,
// the confidence-mark core scene — design §9-5; written in order 一→三→五→二・四・六→終). Scene
// ids are chapter-prefixed ('1-a', '7-a') to stay globally unique. Hand-managed (katsu has no
// legacy extract source).
/* eslint-disable */

import type { Story } from '../../../engine/types';

export const STORY: Story = {
  chapters: [
    {
      id: 1, num: '一', title: '貧乏旗本の 子', years: '1823〜1853',
      lead: 'すべては、江戸の 貧乏旗本の 子から はじまった。',
      start: '1-a',
      teaser: 'まもなく <ruby>黒船<rt>くろふね</rt></ruby>が 来る。世界に ひらく ただ 一つの 窓・<ruby>長崎<rt>ながさき</rt></ruby>で、きみは 何を 学ぶ？',
      scenes: {
        '1-a': { place: '江戸・本所',
          monologue: '（うちは <ruby>貧乏<rt>びんぼう</rt></ruby>だ。<ruby>父上<rt>ちちうえ</rt></ruby>は けんかと <ruby>道楽<rt>どうらく</rt></ruby>ばかり。……それでも おれは、この <ruby>家<rt>いえ</rt></ruby>の 子で よかったと 思って いる。）',
          text: `<p>きみは <ruby>勝麟太郎<rt>かつ りんたろう</rt></ruby>、のちの <ruby>海舟<rt>かいしゅう</rt></ruby>。<ruby>将軍<rt>しょうぐん</rt></ruby>に お<ruby>目見<rt>めみ</rt></ruby>えできる <ruby>家<rt>いえ</rt></ruby>がらでも、<ruby>暮<rt>く</rt></ruby>らしは かつかつ——<ruby>幕府<rt>ばくふ</rt></ruby>の 中でも ずっと <ruby>下<rt>した</rt></ruby>の、<ruby>貧乏旗本<rt>びんぼうはたもと</rt></ruby>の 子だ。</p>
            <p><ruby>父<rt>ちち</rt></ruby>・<face pid="p-kokichi"><ruby>小吉<rt>こきち</rt></ruby></face>は、けんかと <ruby>道楽<rt>どうらく</rt></ruby>ばかりの、とんでもない 男。<ruby>出世<rt>しゅっせ</rt></ruby>とは まるで <ruby>縁<rt>えん</rt></ruby>が なかった。——なのに この <ruby>父<rt>ちち</rt></ruby>、のちに 自分の しくじりだらけの <ruby>一生<rt>いっしょう</rt></ruby>を、自分で <ruby>一冊<rt>いっさつ</rt></ruby>の <ruby>本<rt>ほん</rt></ruby>に 書いて しまう。<b>人が、自分で 自分を <ruby>語<rt>かた</rt></ruby>る</b>。この <ruby>物語<rt>ものがたり</rt></ruby>は、そういう <ruby>話<rt>はなし</rt></ruby>から <ruby>始<rt>はじ</rt></ruby>まる。</p>`,
          onEnter: { cards: ['p-kokichi', 'w-hatamoto'] },
          next: '1-b' },

        '1-b': { place: '<ruby>剣<rt>けん</rt></ruby>か、<ruby>蘭学<rt>らんがく</rt></ruby>か',
          text: `<p>きみは <ruby>剣<rt>けん</rt></ruby>の <ruby>道場<rt>どうじょう</rt></ruby>で めきめき 腕を 上げ、やがて <ruby>免許皆伝<rt>めんきょかいでん</rt></ruby>を ゆるされる ほどの 使い手に なった。</p>
            <p>だが、世は ゆれはじめて いた。<ruby>海<rt>うみ</rt></ruby>の むこうから、<ruby>異国<rt>いこく</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>が しきりに <ruby>姿<rt>すがた</rt></ruby>を 見せる。<ruby>剣<rt>けん</rt></ruby>で 名を 上げるか——それとも、まだ <face pid="p-shozan"><ruby>佐久間象山<rt>さくま しょうざん</rt></ruby></face>ら ひとにぎりの <ruby>者<rt>もの</rt></ruby>しか 見ない <ruby>蘭学<rt>らんがく</rt></ruby>、オランダ<ruby>語<rt>ご</rt></ruby>で <ruby>学<rt>まな</rt></ruby>ぶ <ruby>西洋<rt>せいよう</rt></ruby>の <ruby>学問<rt>がくもん</rt></ruby>に かけるか。</p>`,
          onEnter: { card: 'p-shozan' },
          q: '身分の 低い きみは、何に 賭ける？',
          choices: [
            { label: '<ruby>剣<rt>けん</rt></ruby>の 腕で、<ruby>武士<rt>ぶし</rt></ruby>として 名を 上げる', to: '1-c', effect: { kimo: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>剣<rt>けん</rt></ruby>ひとすじで 生きて いたら……',
                body: `<p><ruby>剣<rt>けん</rt></ruby>の 腕は 本物だ。その 道で 名を 上げる 生き方も、たしかに あった。</p><p>——だが まもなく、<ruby>黒船<rt>くろふね</rt></ruby>が 来る。<ruby>刀<rt>かたな</rt></ruby>では <ruby>蒸気<rt>じょうき</rt></ruby>の <ruby>軍艦<rt>ぐんかん</rt></ruby>に とどかない。剣 ひとすじなら、きみは 新しい 世に 取り残されて いたかも しれない。<ruby>史実<rt>じじつ</rt></ruby>の 海舟は 剣の 道を やめ、借りた <ruby>辞書<rt>じしょ</rt></ruby>を 一年で まるごと 二部 書き写す ほど、<ruby>蘭学<rt>らんがく</rt></ruby>に のめりこんだ。</p>` } },
            { label: 'だれも 見ない <ruby>蘭学<rt>らんがく</rt></ruby>に、将来を かける', to: '1-c', canon: true, effect: { sekai: 2 },
              hist: { verdict: '史実では', match: 'その <ruby>目<rt>め</rt></ruby>が、世界へ ひらいて いく',
                body: `<p>海舟は 剣の <ruby>免許<rt>めんきょ</rt></ruby>を 得た その 手で、だれも 見ない <ruby>学問<rt>がくもん</rt></ruby>を えらんだ。高い <ruby>辞書<rt>じしょ</rt></ruby>は 買えない。そこで 借りて、一年 かけて まるごと 二部 書き写し、一部を 売って 借り<ruby>賃<rt>ちん</rt></ruby>に あてた。その 一年で、きみの 目は 海の むこうを 向いた。</p>`,
                source: { grade: 'later', name: '<ruby>晩年<rt>ばんねん</rt></ruby>の <ruby>談話<rt>だんわ</rt></ruby>（『<ruby>氷川清話<rt>ひかわ せいわ</rt></ruby>』など）',
                  note: 'この 一年の ことを いちばん くわしく <ruby>語<rt>かた</rt></ruby>ったのは、のちの <ruby>海舟<rt>かいしゅう</rt></ruby> <ruby>自身<rt>じしん</rt></ruby>。' } } },
          ] },

        '1-c': { place: '第1章 むすび',
          closeup: { tone: 'warm', cast: [ { face: 'p-kokichi', name: '父・小吉' }, { face: 'p-katsu@boy', name: '麟太郎（きみ）' } ] },
          onEnter: { card: 'w-rangaku', clues: ['clue-1'] },
          text: `<p><ruby>父<rt>ちち</rt></ruby>・<ruby>小吉<rt>こきち</rt></ruby>は、<ruby>出世<rt>しゅっせ</rt></ruby>とは <ruby>縁<rt>えん</rt></ruby>が なかった。それでも、けんかも <ruby>道楽<rt>どうらく</rt></ruby>も <ruby>貧<rt>まず</rt></ruby>しさも、何ひとつ かくさず 自分の <ruby>本<rt>ほん</rt></ruby>に 書いた 男だ。その <ruby>父<rt>ちち</rt></ruby>が、<ruby>書<rt>か</rt></ruby>き<ruby>写<rt>うつ</rt></ruby>しかけの <ruby>辞書<rt>じしょ</rt></ruby>の <ruby>山<rt>やま</rt></ruby>に かじりつく きみを 見て、こう <ruby>言<rt>い</rt></ruby>った——気が した。</p>
            <p class="speak">「<ruby>麟太郎<rt>りんたろう</rt></ruby>。おれは しくじりだらけの <ruby>一生<rt>いっしょう</rt></ruby>よ。だがな、<ruby>人<rt>ひと</rt></ruby>の <ruby>目<rt>め</rt></ruby>を 気に して 生きるより、自分の 見たい ものを 見て 生きろ。……お<ruby>前<rt>まえ</rt></ruby>の <ruby>目<rt>め</rt></ruby>は、どこを 見て いる？」</p>
            <p>きみは、<ruby>海<rt>うみ</rt></ruby>の むこう——まだ 見ぬ <ruby>世界<rt>せかい</rt></ruby>の ほうを 見て いた。</p>
            <p><ruby>手<rt>て</rt></ruby>がかりを ひとつ <ruby>手<rt>て</rt></ruby>に 入れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          spark: 'え！？ 一年で 二部 <ruby>書<rt>か</rt></ruby>き<ruby>写<rt>うつ</rt></ruby>した——その <ruby>話<rt>はなし</rt></ruby>を さいしょに <ruby>語<rt>かた</rt></ruby>ったのは、<ruby>年<rt>とし</rt></ruby>を とった きみ <ruby>自身<rt>じしん</rt></ruby>？',
          deep: { q: '<ruby>辞書<rt>じしょ</rt></ruby>を 二部 写した、って ほんとう？',
            body: `きみが 借りた『ヅーフ・ハルマ』は、オランダ<ruby>語<rt>ご</rt></ruby>を <ruby>日本語<rt>にほんご</rt></ruby>で 引ける 分厚い <ruby>辞書<rt>じしょ</rt></ruby>。<ruby>刷<rt>す</rt></ruby>った <ruby>本<rt>ほん</rt></ruby>では なく、<ruby>写<rt>うつ</rt></ruby>して 伝わる ものだった——ほしければ、自分で 写すしか ない。<br>ただし、この 話を くわしく <b>語ったのは 海舟 本人</b>で、ほかに 書き<ruby>残<rt>のこ</rt></ruby>した 人が 見あたらない。どこまでが 事実で、どこからが あとの <ruby>誇張<rt>こちょう</rt></ruby>かは、はっきり しない。だから たしかさマークは △（<ruby>説<rt>せつ</rt></ruby>が わかれる）。それでも、辞書を 写す ほど 学びに かけた 熱は、たしかに あった。`,
            cite: '※ 苦労の 話ほど、あとで 大きく なりやすい。ほんとうは どうだったのか——それを 探して いくのが、たしかさマークだ。',
            confidence: '△' },
          creed: { line: '「上が つかえて いるなら、<ruby>下<rt>した</rt></ruby>から <ruby>学<rt>まな</rt></ruby>ぶ。——おれの 目は、この <ruby>国<rt>くに</rt></ruby>の <ruby>外<rt>そと</rt></ruby>を 見て いる。」',
            act: '——<ruby>身分<rt>みぶん</rt></ruby>の 低さを なげく より、だれも 見ない <ruby>学問<rt>がくもん</rt></ruby>に <ruby>賭<rt>か</rt></ruby>けた。<ruby>海舟<rt>かいしゅう</rt></ruby>の「<ruby>世界<rt>せかい</rt></ruby>を 見る 目」は、この <ruby>貧<rt>まず</rt></ruby>しい <ruby>家<rt>いえ</rt></ruby>から <ruby>始<rt>はじ</rt></ruby>まった。' },
          end: true },
      },
    },
    {
      id: 2, num: '二', title: '長崎、海を まなぶ', years: '1855〜1859',
      lead: '世界に ひらく ただ 一つの 窓・長崎で、海を まなぶ。',
      start: '2-a',
      teaser: 'つぎは <ruby>太平洋<rt>たいへいよう</rt></ruby>。日本の 船で 世界の 海を わたれるか？——そして、その 手がら話は どこまで ほんとう？',
      scenes: {
        '2-a': { place: '<ruby>長崎<rt>ながさき</rt></ruby>・<ruby>出島<rt>でじま</rt></ruby>',
          monologue: '（<ruby>黒船<rt>くろふね</rt></ruby>が <ruby>来<rt>き</rt></ruby>た あの <ruby>日<rt>ひ</rt></ruby>から、<ruby>世<rt>よ</rt></ruby>が ぐらりと <ruby>動<rt>うご</rt></ruby>きだした。……<ruby>身分<rt>みぶん</rt></ruby>の <ruby>低<rt>ひく</rt></ruby>い おれにも、<ruby>世界<rt>せかい</rt></ruby>を のぞく <ruby>窓<rt>まど</rt></ruby>が、ひとつ ひらいた。）',
          text: `<p>1853<ruby>年<rt>ねん</rt></ruby>、<ruby>浦賀<rt>うらが</rt></ruby>の <ruby>沖<rt>おき</rt></ruby>に <ruby>黒船<rt>くろふね</rt></ruby>が あらわれ、<ruby>国<rt>くに</rt></ruby>じゅうが ふるえた。<ruby>幕府<rt>ばくふ</rt></ruby>——250<ruby>年<rt>ねん</rt></ruby>ほど つづいた <ruby>将軍<rt>しょうぐん</rt></ruby>の <ruby>政府<rt>せいふ</rt></ruby>は、もう <ruby>力<rt>ちから</rt></ruby>が おとろえ、どう すべきか <ruby>広<rt>ひろ</rt></ruby>く <ruby>意見<rt>いけん</rt></ruby>を <ruby>求<rt>もと</rt></ruby>めた。</p>
            <p><ruby>身分<rt>みぶん</rt></ruby>の <ruby>低<rt>ひく</rt></ruby>い きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は、この <ruby>好機<rt>こうき</rt></ruby>に <ruby>海<rt>うみ</rt></ruby>の まもりの <ruby>大切<rt>たいせつ</rt></ruby>さを <ruby>説<rt>と</rt></ruby>く <ruby>意見書<rt>いけんしょ</rt></ruby>を さし<ruby>出<rt>だ</rt></ruby>す。それが <ruby>目<rt>め</rt></ruby>に とまり、えらばれて やって <ruby>来<rt>き</rt></ruby>たのが——<ruby>長崎<rt>ながさき</rt></ruby>。<ruby>出島<rt>でじま</rt></ruby>は、<ruby>西洋<rt>せいよう</rt></ruby>の <ruby>世界<rt>せかい</rt></ruby>へ ひらいた、ただ ひとつの <ruby>窓<rt>まど</rt></ruby>だ。</p>
            <p>ここに ひらかれた <ruby>海軍伝習所<rt>かいぐんでんしゅうじょ</rt></ruby>で、きみは オランダ<ruby>人<rt>じん</rt></ruby> <ruby>教官<rt>きょうかん</rt></ruby>に <ruby>就<rt>つ</rt></ruby>いて、<ruby>航海<rt>こうかい</rt></ruby>も <ruby>砲術<rt>ほうじゅつ</rt></ruby>も、いちから <ruby>学<rt>まな</rt></ruby>びはじめた。</p>`,
          spark: 'え！？ この とき <ruby>幕府<rt>ばくふ</rt></ruby>に とどいた <ruby>意見書<rt>いけんしょ</rt></ruby>は、<ruby>記録<rt>きろく</rt></ruby>に <ruby>残<rt>のこ</rt></ruby>る だけで 七<ruby>百<rt>ひゃく</rt></ruby><ruby>通<rt>つう</rt></ruby> あまり。きみの 一<ruby>通<rt>つう</rt></ruby>は、その <ruby>山<rt>やま</rt></ruby>の 中の 一まい？',
          deep: { q: '<ruby>海舟<rt>かいしゅう</rt></ruby> ひとりが、<ruby>海防<rt>かいぼう</rt></ruby>を <ruby>説<rt>と</rt></ruby>いた？',
            body: `<ruby>黒船<rt>くろふね</rt></ruby>の あと、<ruby>幕府<rt>ばくふ</rt></ruby>は <ruby>広<rt>ひろ</rt></ruby>く <ruby>意見<rt>いけん</rt></ruby>を <ruby>集<rt>あつ</rt></ruby>めた。<ruby>海舟<rt>かいしゅう</rt></ruby>の <ruby>建白書<rt>けんぱくしょ</rt></ruby>が <ruby>登用<rt>とうよう</rt></ruby>の <ruby>糸口<rt>いとぐち</rt></ruby>に なったのは、だいたい たしか（たしかさマーク ○）。<br>ただし、<ruby>意見書<rt>いけんしょ</rt></ruby>を さし<ruby>出<rt>だ</rt></ruby>した <ruby>者<rt>もの</rt></ruby>は ほかにも <ruby>大勢<rt>おおぜい</rt></ruby> いた。「おれ ひとりが いち<ruby>早<rt>はや</rt></ruby>く <ruby>気<rt>き</rt></ruby>づいた」という <ruby>語<rt>かた</rt></ruby>り<ruby>口<rt>ぐち</rt></ruby>は、<ruby>晩年<rt>ばんねん</rt></ruby>の <ruby>本人<rt>ほんにん</rt></ruby>の <ruby>話<rt>はなし</rt></ruby>で、<ruby>少<rt>すこ</rt></ruby>し <ruby>大<rt>おお</rt></ruby>きく なって いる。それでも、えらばれて <ruby>世界<rt>せかい</rt></ruby>を <ruby>学<rt>まな</rt></ruby>ぶ <ruby>側<rt>がわ</rt></ruby>に まわった <ruby>事実<rt>じじつ</rt></ruby>は、<ruby>消<rt>き</rt></ruby>えない。`,
            cite: '※ だれが <ruby>何<rt>なに</rt></ruby>を したか——<ruby>一<rt>ひと</rt></ruby>つずつ ほどいて いくのが、この <ruby>旅<rt>たび</rt></ruby>の いちばんの おもしろさだ。',
            confidence: '○' },
          onEnter: { cards: ['w-kurofune', 'w-denshujo'] },
          next: '2-b' },

        '2-b': { place: '<ruby>格式<rt>かくしき</rt></ruby>か、<ruby>実力<rt>じつりょく</rt></ruby>か',
          text: `<p><ruby>伝習所<rt>でんしゅうじょ</rt></ruby>には、<ruby>身分<rt>みぶん</rt></ruby>の <ruby>高<rt>たか</rt></ruby>い <ruby>武士<rt>ぶし</rt></ruby>も <ruby>大勢<rt>おおぜい</rt></ruby> いた。だが オランダ<ruby>人<rt>じん</rt></ruby> <ruby>教官<rt>きょうかん</rt></ruby>の <ruby>教<rt>おし</rt></ruby>えは、<ruby>日本<rt>にほん</rt></ruby>の しきたりと <ruby>正反対<rt>せいはんたい</rt></ruby>だった。</p>
            <p class="speak">「<ruby>船<rt>ふね</rt></ruby>の <ruby>上<rt>うえ</rt></ruby>では、<ruby>技<rt>わざ</rt></ruby>の できる <ruby>者<rt>もの</rt></ruby>が <ruby>指図<rt>さしず</rt></ruby>する。<ruby>身分<rt>みぶん</rt></ruby>は <ruby>関係<rt>かんけい</rt></ruby> ない」</p>
            <p><ruby>位<rt>くらい</rt></ruby>の <ruby>低<rt>ひく</rt></ruby>い きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）には、<ruby>願<rt>ねが</rt></ruby>っても ない <ruby>教<rt>おし</rt></ruby>えだ。だが、<ruby>格式<rt>かくしき</rt></ruby>を <ruby>重<rt>おも</rt></ruby>んじる <ruby>古<rt>ふる</rt></ruby>い <ruby>武士<rt>ぶし</rt></ruby>たちは、おもしろく ない。ある <ruby>一人<rt>ひとり</rt></ruby>が、<ruby>聞<rt>き</rt></ruby>こえよがしに <ruby>言<rt>い</rt></ruby>った。</p>
            <p class="speak">「<ruby>下<rt>した</rt></ruby>の <ruby>者<rt>もの</rt></ruby>が えらそうに。<ruby>戦<rt>いくさ</rt></ruby><ruby>船<rt>ぶね</rt></ruby>は、<ruby>上<rt>うえ</rt></ruby>の <ruby>一声<rt>ひとこえ</rt></ruby>で みなが <ruby>動<rt>うご</rt></ruby>いて こそ <ruby>勝<rt>か</rt></ruby>てる。<ruby>身分<rt>みぶん</rt></ruby>の <ruby>上下<rt>じょうげ</rt></ruby>は、その ための ものだ」</p>`,
          q: '<ruby>甲板<rt>かんぱん</rt></ruby>の <ruby>上<rt>うえ</rt></ruby>で、きみは どちらを <ruby>通<rt>とお</rt></ruby>す？',
          choices: [
            { label: '<ruby>格式<rt>かくしき</rt></ruby>——<ruby>身分<rt>みぶん</rt></ruby>の <ruby>上下<rt>じょうげ</rt></ruby>を <ruby>立<rt>た</rt></ruby>てる', to: '2-c', effect: { kimo: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>格式<rt>かくしき</rt></ruby>ばかりを <ruby>重<rt>おも</rt></ruby>んじて いたら……',
                body: `<p><ruby>身分<rt>みぶん</rt></ruby>の <ruby>上下<rt>じょうげ</rt></ruby>を <ruby>守<rt>まも</rt></ruby>って、その <ruby>場<rt>ば</rt></ruby>を うまく おさめる <ruby>道<rt>みち</rt></ruby>も あった。</p><p>——だが、<ruby>格式<rt>かくしき</rt></ruby>ばかり <ruby>気<rt>き</rt></ruby>に して いては、<ruby>蒸気<rt>じょうき</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>は <ruby>動<rt>うご</rt></ruby>かせない。<ruby>史実<rt>じじつ</rt></ruby>の <ruby>海舟<rt>かいしゅう</rt></ruby>は、<ruby>身分<rt>みぶん</rt></ruby>より <ruby>技<rt>わざ</rt></ruby>を えらび、<ruby>下<rt>した</rt></ruby>の <ruby>者<rt>もの</rt></ruby>からも <ruby>学<rt>まな</rt></ruby>んだ。</p>` } },
            { label: '<ruby>実力<rt>じつりょく</rt></ruby>——できる <ruby>者<rt>もの</rt></ruby>が <ruby>動<rt>うご</rt></ruby>かす', to: '2-c', canon: true, effect: { suji: 2 },
              hist: { verdict: '史実では', match: '<ruby>身分<rt>みぶん</rt></ruby>より <ruby>腕<rt>うで</rt></ruby>を——それが きみの <ruby>筋<rt>すじ</rt></ruby>',
                body: `<p><ruby>海舟<rt>かいしゅう</rt></ruby>は、<ruby>身分<rt>みぶん</rt></ruby>より <ruby>腕<rt>うで</rt></ruby>を <ruby>重<rt>おも</rt></ruby>んじた。この「できる <ruby>者<rt>もの</rt></ruby>が <ruby>動<rt>うご</rt></ruby>かす」という <ruby>考<rt>かんが</rt></ruby>えが、のちに <ruby>身分<rt>みぶん</rt></ruby>を こえて <ruby>人<rt>ひと</rt></ruby>を <ruby>育<rt>そだ</rt></ruby>てる <ruby>船<rt>ふね</rt></ruby>——<ruby>神戸<rt>こうべ</rt></ruby>の <ruby>操練所<rt>そうれんじょ</rt></ruby>に つながって いく。</p>` } },
          ] },

        '2-c': { place: '<ruby>蒸気船<rt>じょうきせん</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かす',
          text: `<p>オランダ<ruby>人<rt>じん</rt></ruby> <ruby>教官<rt>きょうかん</rt></ruby>が、<ruby>蒸気<rt>じょうき</rt></ruby>で <ruby>動<rt>うご</rt></ruby>く <ruby>船<rt>ふね</rt></ruby>の しくみを <ruby>教<rt>おし</rt></ruby>えて くれた。<ruby>刀<rt>かたな</rt></ruby>の <ruby>腕前<rt>うでまえ</rt></ruby>は、ここでは <ruby>何<rt>なん</rt></ruby>の <ruby>役<rt>やく</rt></ruby>にも <ruby>立<rt>た</rt></ruby>たない。ものを いうのは、<ruby>理屈<rt>りくつ</rt></ruby>と <ruby>順序<rt>じゅんじょ</rt></ruby>だ。</p>
            <p>さあ、きみの <ruby>手<rt>て</rt></ruby>で、この <ruby>鉄<rt>てつ</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かして みよう。</p>`,
          minigame: { type: 'sort', title: '<ruby>蒸気船<rt>じょうきせん</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かす',
            lead: 'ばらばらの <ruby>手順<rt>てじゅん</rt></ruby>を、<ruby>正<rt>ただ</rt></ruby>しい <ruby>順<rt>じゅん</rt></ruby>に タップ！ どうすれば、<ruby>鉄<rt>てつ</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>は <ruby>海<rt>うみ</rt></ruby>を <ruby>進<rt>すす</rt></ruby>む？',
            items: [
              '🔥 <ruby>石炭<rt>せきたん</rt></ruby>を くべて、かまどを <ruby>燃<rt>も</rt></ruby>やす',
              '💨 <ruby>湯<rt>ゆ</rt></ruby>を わかし、<ruby>力<rt>ちから</rt></ruby>の つよい <ruby>蒸気<rt>じょうき</rt></ruby>を ためる',
              '⚙️ <ruby>蒸気<rt>じょうき</rt></ruby>で <ruby>歯車<rt>はぐるま</rt></ruby>と <ruby>車輪<rt>しゃりん</rt></ruby>を まわす',
              '⛵ <ruby>風<rt>かぜ</rt></ruby>が よければ <ruby>帆<rt>ほ</rt></ruby>も <ruby>張<rt>は</rt></ruby>り、さらに <ruby>速<rt>はや</rt></ruby>く <ruby>進<rt>すす</rt></ruby>む',
            ],
            outro: '<ruby>身分<rt>みぶん</rt></ruby>の <ruby>高<rt>たか</rt></ruby>い <ruby>低<rt>ひく</rt></ruby>いは、<ruby>鉄<rt>てつ</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>には <ruby>関係<rt>かんけい</rt></ruby> ない。<ruby>石炭<rt>せきたん</rt></ruby>→<ruby>蒸気<rt>じょうき</rt></ruby>→<ruby>歯車<rt>はぐるま</rt></ruby>、この <b><ruby>順序<rt>じゅんじょ</rt></ruby>と <ruby>理屈<rt>りくつ</rt></ruby></b>を つかんだ <ruby>者<rt>もの</rt></ruby>が、<ruby>船<rt>ふね</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かす。' },
          next: '2-d' },

        '2-d': { place: '第2章 むすび',
          text: `<p><ruby>身分<rt>みぶん</rt></ruby>の <ruby>低<rt>ひく</rt></ruby>い きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は、<ruby>身分<rt>みぶん</rt></ruby>では なく <ruby>腕<rt>うで</rt></ruby>で、<ruby>少<rt>すこ</rt></ruby>しずつ みとめられて いった。オランダ<ruby>流<rt>りゅう</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>の <ruby>学<rt>まな</rt></ruby>びは、<ruby>日本<rt>にほん</rt></ruby>の <ruby>古<rt>ふる</rt></ruby>い しきたりを、<ruby>根<rt>ね</rt></ruby>っこから ゆさぶった。</p>
            <p>やがて きみは、この <ruby>目<rt>め</rt></ruby>で <ruby>確<rt>たし</rt></ruby>かめたく なる——<ruby>海<rt>うみ</rt></ruby>の むこうの <ruby>本物<rt>ほんもの</rt></ruby>の <ruby>世界<rt>せかい</rt></ruby>を。<ruby>手<rt>て</rt></ruby>がかりを ひとつ <ruby>手<rt>て</rt></ruby>に <ruby>入<rt>い</rt></ruby>れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          creed: { line: '「<ruby>船<rt>ふね</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かすのは <ruby>身分<rt>みぶん</rt></ruby>では ない。<ruby>理屈<rt>りくつ</rt></ruby>と <ruby>順序<rt>じゅんじょ</rt></ruby>、そして <ruby>度胸<rt>どきょう</rt></ruby>だ。」',
            act: '——<ruby>身分<rt>みぶん</rt></ruby>の <ruby>低<rt>ひく</rt></ruby>さを ばねに、<ruby>海舟<rt>かいしゅう</rt></ruby>は <ruby>実力<rt>じつりょく</rt></ruby>で <ruby>引<rt>ひ</rt></ruby>き<ruby>上<rt>あ</rt></ruby>げられて いった。この「できる <ruby>者<rt>もの</rt></ruby>が <ruby>動<rt>うご</rt></ruby>かす」<ruby>考<rt>かんが</rt></ruby>えが、やがて <ruby>敵味方<rt>てきみかた</rt></ruby>すら ひとつの <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>せる。' },
          onEnter: { clues: ['clue-2'] },
          end: true },
      },
    },
    {
      // ★PILOT CHAPTER (design §9-5): written first, at final register, to calibrate the
      // source-criticism tone (§0-4 cynicism trap — never belittle Katsu). The confidence-mark
      // core is 3-c (spark ☆ boast vs ◎ record); the ◎ fact that survives the discount is held
      // in the 3-c cite and the 3-d landing so the balance shows in one chapter. World-map view
      // (太平洋横断/off-map SF) is deferred to the 地図/演出 phase; the 山場 rides on closeup +
      // confidence, not text (WRITING 書法7).
      id: 3, num: '三', title: '咸臨丸、世界の 海へ', years: '1860',
      lead: '日本の 船で 太平洋を わたり、サンフランシスコへ。',
      start: '3-a',
      teaser: 'つぎは <ruby>神戸<rt>こうべ</rt></ruby>。<ruby>幕臣<rt>ばくしん</rt></ruby>なのに、幕府の 敵に なりうる 者まで 一つの 船に 乗せる——なぜ？',
      scenes: {
        '3-a': { place: '<ruby>品川<rt>しながわ</rt></ruby>、世界へ',
          monologue: '（<ruby>黒船<rt>くろふね</rt></ruby>に 国じゅうが おどろいた 日は、まだ 昨日の ことのようだ。……その 海の むこうへ、こんどは おれたちが、自分の 船で 行く。）',
          text: `<p>1860年、冬。<ruby>品川<rt>しながわ</rt></ruby>の 沖から、一そうの 軍艦が 出て いく。<ruby>咸臨丸<rt>かんりんまる</rt></ruby>——日本人の 手で 太平洋を わたり、アメリカへ 向かう 船だ。<ruby>日米<rt>にちべい</rt></ruby>で とりかわした 条約を とどける <ruby>使節<rt>しせつ</rt></ruby>に ついて いく 旅。きみ（海舟）は、その 船の <ruby>艦長<rt>かんちょう</rt></ruby>として 乗りこんだ。</p>
            <p>ゆく手は、冬の <ruby>荒海<rt>あらうみ</rt></ruby>。船は 木の葉のように ゆれ、いつ しずんでも おかしくない。乗組の ひとり・<face pid="p-manjiro"><ruby>中浜万次郎<rt>なかはま まんじろう</rt></ruby></face>だけは、この 海を 知って いた。漁に 出て 流され、アメリカで 学んで 帰った 男だ。その 横顔は、荒海を まえに しても 落ちついて いた。「海は、こわがる ほど 大きい。だが、わたれない 海では ない」——そう 言って いる ようだった。</p>`,
          onEnter: { cards: ['w-kanrinmaru', 'p-manjiro'] },
          next: '3-b' },

        '3-b': { place: '日本人の 船で、わたるか',
          text: `<p>そもそも、この 海わたりは 無理を して いた。条約の <ruby>使節<rt>しせつ</rt></ruby>は、アメリカの 大きな 軍艦・ポーハタン号に 乗って いく。<ruby>咸臨丸<rt>かんりんまる</rt></ruby>は、それに ついて いく ための、いわば おまけの 船だ。日本人だけで 冬の 太平洋を こえた 例は、まだ 一度も ない。</p>
            <p>むぼうな <ruby>賭<rt>か</rt></ruby>けかも しれない。それでも、きみ（海舟）なら——。</p>`,
          q: '日本人の 船で、太平洋を わたるか？',
          choices: [
            { label: 'ポーハタン号に まかせ、無理は しない', to: '3-c', effect: { suji: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし おまけの 船に 乗らなかったら……',
                body: `<p>無理を せず、大きな ポーハタン号に すべて まかせて いても、条約の 用は 足りた。かしこい えらび方だ。</p><p>——だが「日本人が 自分の 船で 太平洋を わたった」という 出来事は 生まれず、海舟の 名も、これほど 世に 出なかったかも しれない。<ruby>史実<rt>じじつ</rt></ruby>の 海舟は、あえて おまけの 船に 乗り、荒海へ こぎ出した。</p>` } },
            { label: '日本人の 船・咸臨丸でも、わたると 手を 挙げる', to: '3-c', canon: true, effect: { sekai: 2 },
              hist: { verdict: '史実では', match: '日本の 船は、初めて 太平洋を わたりきる',
                body: `<p><ruby>咸臨丸<rt>かんりんまる</rt></ruby>は およそ 37日 かけて、嵐の 太平洋を こえ、サンフランシスコに ついた。日本人の 船が 自力で 大洋を わたった、初めての 出来事だ。これは まぎれもない 本物の <ruby>手柄<rt>てがら</rt></ruby>——海舟の 名を 一気に 高めた。</p><p>……ただし、その「自力で」という ことばには、あとで 確かめる べき 話が つづく。</p>`,
                source: { grade: 'contemporary', name: 'ブルック<ruby>大尉<rt>たいい</rt></ruby>の 日記 ほか', note: '同乗した アメリカ士官が、航海中の ようすを その場で 書き残した。' } } },
          ] },

        '3-c': { place: '船底で、ゆれながら',
          closeup: { tone: 'tense', cast: [ { face: 'p-katsu@prime', name: '海舟（きみ）' }, { face: 'p-brooke', name: 'ブルック' } ] },
          text: `<p>船が サンフランシスコに 近づく ころ、きみ（海舟）は、ほとんど 船室から 出られずに いた。ひどい <ruby>船酔<rt>ふなよ</rt></ruby>いだ。あれ狂う 海で、じっさいに 船を もたせて いたのは、たすけに 乗りこんだ アメリカ海軍の <face pid="p-brooke">ブルック</face><ruby>大尉<rt>たいい</rt></ruby>たちだった。</p>
            <p>——なのに 海舟は、ずっと あとに なって、こう 語った。「あの 太平洋は、外国人の 手を 少しも 借りず、日本人だけで わたって みせた」。</p>`,
          spark: 'え！？ 海舟が 自慢した「外国人の 手を 借りず わたった」——記録を たどると、荒海で 船を 動かして いたのは、乗りこんだ アメリカ人 士官の ほうだった？',
          deep: { q: '<ruby>咸臨丸<rt>かんりんまる</rt></ruby>は、日本人だけで わたった？',
            body: `海舟は 晩年、談話『<ruby>氷川清話<rt>ひかわせいわ</rt></ruby>』などで「外国人の 手を 借りなかった」と くり返した。だが 同乗した ブルック<ruby>大尉<rt>たいい</rt></ruby>の 日記は、嵐の あいだ 船を もたせたのは ブルックたちだったと 記す。同じ 船に いた <ruby>福澤諭吉<rt>ふくざわ ゆきち</rt></ruby>も、海舟が 船室で 寝こんで いた ようすを 書き残した。<br>同じ 一つの 航海が、語り手に よって まるで ちがって 見える。だから この 話の たしかさマークは ☆（<ruby>本人<rt>ほんにん</rt></ruby><ruby>談<rt>だん</rt></ruby>だけ）。`,
            cite: '※ でも わすれては いけない。「日本の 船が 太平洋を わたった」こと 自体は、まぎれもない <ruby>事実<rt>じじつ</rt></ruby>（たしかさマーク ◎）。盛りを 割り引いても、その 芯は 消えない。',
            confidence: '☆' },
          onEnter: { cards: ['w-taiheiyo', 'p-brooke'] },
          next: '3-d' },

        '3-d': { place: '第3章 むすび',
          onEnter: { clues: ['clue-3'] },
          text: `<p><ruby>手柄<rt>てがら</rt></ruby>話は、年月と ともに 大きく ふくらんだ。嵐の 海で 船を もたせたのは、半分は アメリカ人。それでも 海舟は、胸を はって「日本人だけで わたった」と 語った。</p>
            <p>でも——木の葉のような 船で、冬の 太平洋を こえた。その <ruby>甲板<rt>かんぱん</rt></ruby>に、たしかに 日本人が 立って いた。<ruby>船酔<rt>ふなよ</rt></ruby>いで 青い 顔を して いても、きみは、世界の 大きさを この 目で 見た。<b>自慢は 大きくても、この 一歩は 本物だ。</b>どこまでが ほんとうかを 一つ ずつ 確かめる——それが、なりきって みる おもしろさだ。</p>`,
          creed: { line: '「<ruby>船酔<rt>ふなよ</rt></ruby>いで 寝て いても、世界は 見た。——行って みなければ、何も 始まらぬ。」',
            act: '——弱さを かくさず、それでも 海を こえた。海舟は、"できない こと"を 数えるより、"できた 一歩"を 選ぶ 男だった。' },
          end: true },
      },
    },
    {
      id: 4, num: '四', title: '神戸、身分を こえた 船', years: '1862〜1865',
      lead: '幕臣・諸藩士・脱藩浪士を、一つの 船に 乗せる。',
      start: '4-a',
      teaser: 'つぎは <ruby>江戸<rt>えど</rt></ruby>。戦えば 灰、明けわたせば「裏切り者」——町ぜんぶを かけた 分かれ道が やって くる。',
      scenes: {
        '4-a': { place: '<ruby>神戸<rt>こうべ</rt></ruby>・<ruby>海軍操練所<rt>かいぐんそうれんじょ</rt></ruby>',
          monologue: '（<ruby>身分<rt>みぶん</rt></ruby>の <ruby>低<rt>ひく</rt></ruby>い おれは、<ruby>腕<rt>うで</rt></ruby>ひとつで ここまで <ruby>来<rt>き</rt></ruby>た。……ならば こんどは、<ruby>身分<rt>みぶん</rt></ruby>など 問わぬ <ruby>場<rt>ば</rt></ruby>を、おれが つくって みせる。）',
          text: `<p>1864<ruby>年<rt>ねん</rt></ruby>、きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は <ruby>神戸<rt>こうべ</rt></ruby>に <ruby>海軍操練所<rt>かいぐんそうれんじょ</rt></ruby>を ひらいた。<ruby>船<rt>ふね</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かす <ruby>者<rt>もの</rt></ruby>を、ここで <ruby>育<rt>そだ</rt></ruby>てる。</p>
            <p>そこへ、<ruby>土佐<rt>とさ</rt></ruby>を ぬけ<ruby>出<rt>だ</rt></ruby>した <ruby>若者<rt>わかもの</rt></ruby>・<face pid="p-ryoma"><ruby>坂本龍馬<rt>さかもと りょうま</rt></ruby></face>が たずねて <ruby>来<rt>き</rt></ruby>た。<ruby>藩<rt>はん</rt></ruby>を ぬけた <ruby>脱藩浪士<rt>だっぱんろうし</rt></ruby>——<ruby>幕府<rt>ばくふ</rt></ruby>から <ruby>見<rt>み</rt></ruby>れば、いつ <ruby>敵<rt>てき</rt></ruby>に まわるか わからぬ <ruby>者<rt>もの</rt></ruby>だ。<ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>家来<rt>けらい</rt></ruby>である きみが、その <ruby>者<rt>もの</rt></ruby>まで、この <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>せるのか——。</p>`,
          onEnter: { cards: ['w-soren', 'w-datsuhan'] },
          next: '4-b' },

        '4-b': { place: '<ruby>垣根<rt>かきね</rt></ruby>の <ruby>外<rt>そと</rt></ruby>の <ruby>者<rt>もの</rt></ruby>まで、<ruby>育<rt>そだ</rt></ruby>てるか',
          text: `<p class="speak">「なぜ <ruby>幕臣<rt>ばくしん</rt></ruby>の おまえが、あんな <ruby>者<rt>もの</rt></ruby>まで かかえる」——まわりは あやしんだ。</p>
            <p><ruby>脱藩浪士<rt>だっぱんろうし</rt></ruby>を <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>せれば、きみ <ruby>自身<rt>じしん</rt></ruby>が <ruby>幕府<rt>ばくふ</rt></ruby>に にらまれる。<ruby>職<rt>しょく</rt></ruby>を <ruby>失<rt>うしな</rt></ruby>うかも しれない。それでも——<ruby>海<rt>うみ</rt></ruby>の <ruby>上<rt>うえ</rt></ruby>で <ruby>使<rt>つか</rt></ruby>える <ruby>者<rt>もの</rt></ruby>は、<ruby>身分<rt>みぶん</rt></ruby>で 決まる ものでは ない。</p>`,
          q: '<ruby>藩<rt>はん</rt></ruby>を ぬけた <ruby>者<rt>もの</rt></ruby>まで、<ruby>一<rt>ひと</rt></ruby>つの <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>せるか？',
          choices: [
            { label: '<ruby>幕府<rt>ばくふ</rt></ruby>の ためだけの <ruby>海軍<rt>かいぐん</rt></ruby>に、しぼる', to: '4-c', effect: { suji: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>垣根<rt>かきね</rt></ruby>を <ruby>守<rt>まも</rt></ruby>って いたら……',
                body: `<p><ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>家来<rt>けらい</rt></ruby>だけを <ruby>集<rt>あつ</rt></ruby>めれば、あやしまれる ことも なく、<ruby>身<rt>み</rt></ruby>も <ruby>安全<rt>あんぜん</rt></ruby>だ。かしこい <ruby>守<rt>まも</rt></ruby>り<ruby>方<rt>かた</rt></ruby>だった。</p><p>——だが それでは、<ruby>龍馬<rt>りょうま</rt></ruby>のような 型やぶりの <ruby>才<rt>さい</rt></ruby>は <ruby>育<rt>そだ</rt></ruby>たず、<ruby>日本<rt>にほん</rt></ruby>の <ruby>海軍<rt>かいぐん</rt></ruby>づくりも おくれて いたかも しれない。<ruby>史実<rt>じじつ</rt></ruby>の <ruby>海舟<rt>かいしゅう</rt></ruby>は、<ruby>垣根<rt>かきね</rt></ruby>の <ruby>外<rt>そと</rt></ruby>の <ruby>者<rt>もの</rt></ruby>まで、この <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>せた。</p>` } },
            { label: '<ruby>藩<rt>はん</rt></ruby>の <ruby>垣根<rt>かきね</rt></ruby>も <ruby>脱藩<rt>だっぱん</rt></ruby>も こえて、<ruby>海<rt>うみ</rt></ruby>の <ruby>人<rt>ひと</rt></ruby>を <ruby>育<rt>そだ</rt></ruby>てる', to: '4-c', canon: true, effect: { kimo: 2 },
              hist: { verdict: '史実では', match: '<ruby>身分<rt>みぶん</rt></ruby>より、<ruby>海<rt>うみ</rt></ruby>で <ruby>使<rt>つか</rt></ruby>える <ruby>者<rt>もの</rt></ruby>を',
                body: `<p><ruby>海舟<rt>かいしゅう</rt></ruby>は、<ruby>幕府<rt>ばくふ</rt></ruby>に にらまれる <ruby>危険<rt>きけん</rt></ruby>を <ruby>承知<rt>しょうち</rt></ruby>で、<ruby>脱藩浪士<rt>だっぱんろうし</rt></ruby>まで <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>せた。「<ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>でも、<ruby>藩<rt>はん</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>でも ない。<ruby>日本<rt>にほん</rt></ruby>の <ruby>海軍<rt>かいぐん</rt></ruby>を つくる」——この <ruby>度胸<rt>どきょう</rt></ruby>が、のちに <ruby>敵味方<rt>てきみかた</rt></ruby>を こえて <ruby>人<rt>ひと</rt></ruby>を つなぐ <ruby>力<rt>ちから</rt></ruby>に なって いく。</p>` } },
          ] },

        '4-c': { place: '<ruby>斬<rt>き</rt></ruby>りに <ruby>来<rt>き</rt></ruby>た <ruby>男<rt>おとこ</rt></ruby>',
          closeup: { tone: 'warm', cast: [ { face: 'p-katsu@prime', name: '海舟（きみ）' }, { face: 'p-ryoma', name: '坂本龍馬' } ] },
          text: `<p><ruby>操練所<rt>そうれんじょ</rt></ruby>に <ruby>集<rt>あつ</rt></ruby>まる <ruby>者<rt>もの</rt></ruby>の <ruby>中<rt>なか</rt></ruby>でも、<ruby>龍馬<rt>りょうま</rt></ruby>は とびきり 型やぶりだった。きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は、ずっと あとに なって、こう <ruby>語<rt>かた</rt></ruby>って いる——。</p>
            <p class="speak">「あいつは、おれを <ruby>斬<rt>き</rt></ruby>りに <ruby>来<rt>き</rt></ruby>た。だが <ruby>話<rt>はな</rt></ruby>して いる うちに、その<ruby>場<rt>ば</rt></ruby>で おれの <ruby>弟子<rt>でし</rt></ruby>に なって しまった」</p>
            <p><ruby>刀<rt>かたな</rt></ruby>を さげて あらわれた <ruby>男<rt>おとこ</rt></ruby>が、ひと<ruby>晩<rt>ばん</rt></ruby>で <ruby>心<rt>こころ</rt></ruby>を あずける。いかにも <ruby>龍馬<rt>りょうま</rt></ruby>らしい、<ruby>劇的<rt>げきてき</rt></ruby>な <ruby>出会<rt>であ</rt></ruby>い<ruby>話<rt>ばなし</rt></ruby>だ。</p>`,
          spark: 'え！？ じっさいは、<ruby>人<rt>ひと</rt></ruby>の <ruby>紹介<rt>しょうかい</rt></ruby>で きちんと たずねて <ruby>来<rt>き</rt></ruby>たらしい。——「<ruby>斬<rt>き</rt></ruby>りに <ruby>来<rt>き</rt></ruby>た」と <ruby>書<rt>か</rt></ruby>き<ruby>残<rt>のこ</rt></ruby>して いるのは、<ruby>海舟<rt>かいしゅう</rt></ruby> <ruby>一人<rt>ひとり</rt></ruby>きり だ。',
          deep: { q: '<ruby>龍馬<rt>りょうま</rt></ruby>は ほんとうに、<ruby>斬<rt>き</rt></ruby>りに <ruby>来<rt>き</rt></ruby>た？',
            body: `<ruby>海舟<rt>かいしゅう</rt></ruby>は <ruby>晩年<rt>ばんねん</rt></ruby>の <ruby>談話<rt>だんわ</rt></ruby>で、「<ruby>龍馬<rt>りょうま</rt></ruby>が <ruby>斬<rt>き</rt></ruby>りに <ruby>来<rt>き</rt></ruby>て、その<ruby>場<rt>ば</rt></ruby>で <ruby>弟子<rt>でし</rt></ruby>に なった」と くり<ruby>返<rt>かえ</rt></ruby>し <ruby>語<rt>かた</rt></ruby>った。だが じっさいは、<ruby>人<rt>ひと</rt></ruby>の <ruby>紹介<rt>しょうかい</rt></ruby>で、きちんと たずねて <ruby>来<rt>き</rt></ruby>たらしい。<ruby>劇的<rt>げきてき</rt></ruby>な <ruby>話<rt>はなし</rt></ruby>ほど、あとで きれいな <ruby>形<rt>かたち</rt></ruby>に ととのえられて いく。だから この <ruby>出会<rt>であ</rt></ruby>い<ruby>話<rt>ばなし</rt></ruby>の たしかさマークは ☆（<ruby>本人<rt>ほんにん</rt></ruby><ruby>談<rt>だん</rt></ruby>だけ）。`,
            cite: '※ でも、<ruby>龍馬<rt>りょうま</rt></ruby>が <ruby>海舟<rt>かいしゅう</rt></ruby>を「<ruby>日本<rt>にほん</rt></ruby><ruby>第一<rt>だいいち</rt></ruby>の <ruby>人物<rt>じんぶつ</rt></ruby>」と <ruby>心<rt>こころ</rt></ruby>から <ruby>慕<rt>した</rt></ruby>った ことは——<ruby>龍馬<rt>りょうま</rt></ruby> <ruby>自身<rt>じしん</rt></ruby>が <ruby>姉<rt>あね</rt></ruby>に あてて <ruby>書<rt>か</rt></ruby>いた <ruby>手紙<rt>てがみ</rt></ruby>が <ruby>証<rt>あか</rt></ruby>している（◎）。<ruby>本人<rt>ほんにん</rt></ruby>の <ruby>自慢話<rt>じまんばなし</rt></ruby>は あてに ならなくても、<ruby>他人<rt>たにん</rt></ruby>が <ruby>残<rt>のこ</rt></ruby>した <ruby>手紙<rt>てがみ</rt></ruby>は、ほんとうを <ruby>教<rt>おし</rt></ruby>えて くれる。',
            confidence: '☆' },
          onEnter: { card: 'p-ryoma' },
          next: '4-d' },

        '4-d': { place: '<ruby>第<rt>だい</rt></ruby>4<ruby>章<rt>しょう</rt></ruby> むすび',
          onEnter: { clues: ['clue-4'] },
          text: `<p>やがて、この <ruby>賭<rt>か</rt></ruby>けには <ruby>高<rt>たか</rt></ruby>い <ruby>代償<rt>だいしょう</rt></ruby>が ついた。<ruby>京<rt>きょう</rt></ruby>で <ruby>戦<rt>いくさ</rt></ruby>が おこると、<ruby>脱藩浪士<rt>だっぱんろうし</rt></ruby>を かかえる <ruby>操練所<rt>そうれんじょ</rt></ruby>は あやしまれ、きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は <ruby>軍艦奉行<rt>ぐんかんぶぎょう</rt></ruby>の <ruby>職<rt>しょく</rt></ruby>を <ruby>解<rt>と</rt></ruby>かれ、二<ruby>年<rt>ねん</rt></ruby>ちかく <ruby>家<rt>いえ</rt></ruby>に とじこめられた。</p>
            <p>それでも——ここで <ruby>育<rt>そだ</rt></ruby>った <ruby>者<rt>もの</rt></ruby>たちは、のちの <ruby>日本<rt>にほん</rt></ruby>の <ruby>海軍<rt>かいぐん</rt></ruby>の <ruby>芽<rt>め</rt></ruby>に なって いく。<ruby>龍馬<rt>りょうま</rt></ruby>も、その <ruby>一人<rt>ひとり</rt></ruby>だった。<ruby>手<rt>て</rt></ruby>がかりを ひとつ <ruby>手<rt>て</rt></ruby>に <ruby>入<rt>い</rt></ruby>れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          creed: { line: '「<ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>でも、<ruby>藩<rt>はん</rt></ruby>の <ruby>船<rt>ふね</rt></ruby>でも ない。——<ruby>日本<rt>にほん</rt></ruby>の <ruby>海軍<rt>かいぐん</rt></ruby>を つくる。<ruby>垣根<rt>かきね</rt></ruby>の <ruby>外<rt>そと</rt></ruby>の <ruby>者<rt>もの</rt></ruby>こそ、いる。」',
            act: '——<ruby>幕臣<rt>ばくしん</rt></ruby>で ありながら、<ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>敵<rt>てき</rt></ruby>に なりうる <ruby>者<rt>もの</rt></ruby>まで <ruby>育<rt>そだ</rt></ruby>てた。その <ruby>賭<rt>か</rt></ruby>けは <ruby>職<rt>しょく</rt></ruby>を <ruby>失<rt>うしな</rt></ruby>う <ruby>代償<rt>だいしょう</rt></ruby>を まねいたが、<ruby>身分<rt>みぶん</rt></ruby>を こえて <ruby>育<rt>そだ</rt></ruby>った <ruby>芽<rt>め</rt></ruby>が、<ruby>次<rt>つぎ</rt></ruby>の <ruby>世<rt>よ</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かして いく。' },
          end: true },
      },
    },
    {
      id: 5, num: '五', title: '江戸を まもれるか', years: '1868',
      lead: '戦えば 灰、畳めば 不忠——町ぜんぶを かけた 分かれ道。',
      start: '5-a',
      teaser: '<ruby>維新<rt>いしん</rt></ruby>の あと、幕臣なのに 新政府に 仕えた 海舟は「裏切り者」と 呼ばれる。きみなら、その 声に どう 応える？',
      scenes: {
        '5-a': { place: '<ruby>江戸<rt>えど</rt></ruby>、火の海に なるか',
          monologue: '（<ruby>鳥羽<rt>とば</rt></ruby>・<ruby>伏見<rt>ふしみ</rt></ruby>で、<ruby>味方<rt>みかた</rt></ruby>は 総くずれ。<ruby>将軍<rt>しょうぐん</rt></ruby>・<ruby>慶喜<rt>よしのぶ</rt></ruby>さまも、もう <ruby>戦<rt>たたか</rt></ruby>わぬと <ruby>心<rt>こころ</rt></ruby>を <ruby>決<rt>き</rt></ruby>めた。……この <ruby>江戸<rt>えど</rt></ruby>には、<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>人<rt>ひと</rt></ruby>が <ruby>住<rt>す</rt></ruby>んで いる。）',
          text: `<p>1868<ruby>年<rt>ねん</rt></ruby>、<ruby>旧幕府<rt>きゅうばくふ</rt></ruby>がわは <ruby>鳥羽<rt>とば</rt></ruby>・<ruby>伏見<rt>ふしみ</rt></ruby>の <ruby>戦<rt>たたか</rt></ruby>いに <ruby>敗<rt>やぶ</rt></ruby>れ、総くずれと なった。<ruby>最後<rt>さいご</rt></ruby>の <ruby>将軍<rt>しょうぐん</rt></ruby>・<face pid="p-yoshinobu"><ruby>徳川慶喜<rt>とくがわ よしのぶ</rt></ruby></face>は <ruby>江戸<rt>えど</rt></ruby>へ しりぞき、もう さからわぬと <ruby>心<rt>こころ</rt></ruby>を <ruby>決<rt>き</rt></ruby>める。その <ruby>後始末<rt>あとしまつ</rt></ruby>の いっさいを あずけられたのが、きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）だった。</p>
            <p>だが、<ruby>勝<rt>か</rt></ruby>ちに のった <ruby>新政府軍<rt>しんせいふぐん</rt></ruby>は、<ruby>東<rt>ひがし</rt></ruby>へ <ruby>東<rt>ひがし</rt></ruby>へと せまって くる。<ruby>三月<rt>さんがつ</rt></ruby><ruby>十五日<rt>じゅうごにち</rt></ruby>、<ruby>江戸城<rt>えどじょう</rt></ruby> <ruby>総攻撃<rt>そうこうげき</rt></ruby>——その <ruby>日<rt>ひ</rt></ruby>が、<ruby>刻々<rt>こくこく</rt></ruby>と <ruby>近<rt>ちか</rt></ruby>づいて いた。もし <ruby>戦<rt>いくさ</rt></ruby>に なれば、<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>人<rt>ひと</rt></ruby>が <ruby>暮<rt>く</rt></ruby>らす この <ruby>町<rt>まち</rt></ruby>は、<ruby>火<rt>ひ</rt></ruby>の <ruby>海<rt>うみ</rt></ruby>に なる。</p>`,
          onEnter: { cards: ['p-yoshinobu', 'w-boshin'] },
          next: '5-b' },

        '5-b': { place: '<ruby>迎<rt>むか</rt></ruby>え<ruby>撃<rt>う</rt></ruby>つか、<ruby>明<rt>あ</rt></ruby>けわたすか',
          text: `<p><ruby>同<rt>おな</rt></ruby>じ <ruby>幕臣<rt>ばくしん</rt></ruby>の 中にも、<ruby>徹底抗戦<rt>てっていこうせん</rt></ruby>を <ruby>説<rt>と</rt></ruby>く 者が いた。<face pid="p-oguri"><ruby>小栗忠順<rt>おぐり ただまさ</rt></ruby></face>——きみの かげの <ruby>対<rt>たい</rt></ruby>だ。</p>
            <p class="speak">「ここで <ruby>退<rt>ひ</rt></ruby>けば、<ruby>幕臣<rt>ばくしん</rt></ruby>の <ruby>名折<rt>なお</rt></ruby>れ。<ruby>江戸<rt>えど</rt></ruby>を <ruby>枕<rt>まくら</rt></ruby>に、<ruby>最後<rt>さいご</rt></ruby>まで <ruby>戦<rt>たたか</rt></ruby>うべきだ」——<ruby>小栗<rt>おぐり</rt></ruby>は、ゆずらなかった。<ruby>負<rt>ま</rt></ruby>けを <ruby>認<rt>みと</rt></ruby>めず <ruby>戦<rt>たたか</rt></ruby>う——それが、この <ruby>世<rt>よ</rt></ruby>の <ruby>武士<rt>ぶし</rt></ruby>の <ruby>誇<rt>ほこ</rt></ruby>りだった。</p>
            <p><ruby>江戸<rt>えど</rt></ruby>には、まだ <ruby>兵<rt>へい</rt></ruby>も <ruby>船<rt>ふね</rt></ruby>も <ruby>残<rt>のこ</rt></ruby>って いる。<ruby>戦<rt>たたか</rt></ruby>えば、<ruby>勝<rt>か</rt></ruby>てなくても、<ruby>意地<rt>いじ</rt></ruby>は <ruby>見<rt>み</rt></ruby>せられる。——だが そのぶん、<ruby>逃<rt>に</rt></ruby>げ<ruby>場<rt>ば</rt></ruby>の ない 人々が、まきぞえに なる。</p>`,
          q: 'せまる <ruby>新政府軍<rt>しんせいふぐん</rt></ruby>を、どう <ruby>迎<rt>むか</rt></ruby>える？',
          choices: [
            { label: '<ruby>江戸<rt>えど</rt></ruby>で <ruby>迎<rt>むか</rt></ruby>え<ruby>撃<rt>う</rt></ruby>ち、<ruby>幕臣<rt>ばくしん</rt></ruby>の <ruby>意地<rt>いじ</rt></ruby>を 見せる', to: '5-c', effect: { suji: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>迎<rt>むか</rt></ruby>え<ruby>撃<rt>う</rt></ruby>って いたら……',
                body: `<p><ruby>兵<rt>へい</rt></ruby>も <ruby>船<rt>ふね</rt></ruby>も 残って いた。<ruby>迎<rt>むか</rt></ruby>え<ruby>撃<rt>う</rt></ruby>てば、<ruby>勝<rt>か</rt></ruby>てぬまでも 一戦は できた。</p><p>——だが <ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>江戸<rt>えど</rt></ruby>は 焼け、<ruby>多<rt>おお</rt></ruby>くが 死んだ かも しれない。それを「<ruby>負<rt>ま</rt></ruby>けを 認めぬ <ruby>意地<rt>いじ</rt></ruby>」と たたえる <ruby>声<rt>こえ</rt></ruby>も、あとには ある。<ruby>史実<rt>じじつ</rt></ruby>の <ruby>海舟<rt>かいしゅう</rt></ruby>は、<ruby>戦<rt>たたか</rt></ruby>わずに <ruby>城<rt>しろ</rt></ruby>を 明けわたす 道を えらんだ。</p>` } },
            { label: '<ruby>戦<rt>たたか</rt></ruby>わずに、<ruby>江戸城<rt>えどじょう</rt></ruby>を <ruby>明<rt>あ</rt></ruby>けわたす', to: '5-c', canon: true, effect: { kimo: 2 },
              hist: { verdict: '史実では', match: '<ruby>刀<rt>かたな</rt></ruby>を <ruby>抜<rt>ぬ</rt></ruby>かずに、<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>町<rt>まち</rt></ruby>を まもる',
                body: `<p><ruby>海舟<rt>かいしゅう</rt></ruby>は、<ruby>戦<rt>たたか</rt></ruby>わぬ 道を えらんだ。これは にげでは ない——<ruby>攻<rt>せ</rt></ruby>める <ruby>相手<rt>あいて</rt></ruby>と <ruby>話<rt>はなし</rt></ruby>を つけ、<ruby>城<rt>しろ</rt></ruby>も <ruby>町<rt>まち</rt></ruby>も 焼かせずに <ruby>渡<rt>わた</rt></ruby>す。<ruby>刀<rt>かたな</rt></ruby>を <ruby>抜<rt>ぬ</rt></ruby>くより ずっと むずかしい、<ruby>命<rt>いのち</rt></ruby>がけの かけひきだ。</p>` } },
          ],
          onEnter: { card: 'p-oguri' } },

        '5-c': { place: '<ruby>西郷<rt>さいごう</rt></ruby>と、<ruby>差<rt>さ</rt></ruby>し<ruby>向<rt>む</rt></ruby>かい',
          closeup: { tone: 'tense', cast: [ { face: 'p-katsu@prime', name: '海舟（きみ）' }, { face: 'p-saigo', name: '西郷隆盛' } ] },
          text: `<p><ruby>三月<rt>さんがつ</rt></ruby>、<ruby>田町<rt>たまち</rt></ruby>の <ruby>薩摩<rt>さつま</rt></ruby><ruby>藩邸<rt>はんてい</rt></ruby>。きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は、<ruby>江戸<rt>えど</rt></ruby><ruby>方<rt>がた</rt></ruby>を せおって、<ruby>敵<rt>てき</rt></ruby>の <ruby>大将<rt>たいしょう</rt></ruby>・<face pid="p-saigo"><ruby>西郷隆盛<rt>さいごう たかもり</rt></ruby></face>と <ruby>向<rt>む</rt></ruby>きあった。もし <ruby>話<rt>はなし</rt></ruby>が こわれれば、<ruby>明日<rt>あす</rt></ruby>にも <ruby>江戸<rt>えど</rt></ruby>は 火の海だ。——いざと なれば <ruby>江戸<rt>えど</rt></ruby>を <ruby>焼<rt>や</rt></ruby>いてでも <ruby>迎<rt>むか</rt></ruby>え<ruby>撃<rt>う</rt></ruby>つ。きみは、その <ruby>覚悟<rt>かくご</rt></ruby>を <ruby>西郷<rt>さいごう</rt></ruby>に ちらつかせた。</p>
            <p>だが <ruby>西郷<rt>さいごう</rt></ruby>は、その すごみに 少しも <ruby>動<rt>どう</rt></ruby>じない。じっと きみを <ruby>見<rt>み</rt></ruby>すえ、<ruby>慶喜<rt>よしのぶ</rt></ruby>が いさぎよく <ruby>身<rt>み</rt></ruby>を ひくことを ひきかえに、<ruby>城<rt>しろ</rt></ruby>を 明けわたす <ruby>話<rt>はなし</rt></ruby>を、<ruby>静<rt>しず</rt></ruby>かに まとめて いった。<ruby>敵<rt>てき</rt></ruby>で ありながら、これほど <ruby>信<rt>しん</rt></ruby>の 置ける <ruby>相手<rt>あいて</rt></ruby>を、きみは ほかに 知らなかった。</p>`,
          spark: 'え！？ きみが <ruby>西郷<rt>さいごう</rt></ruby>あての <ruby>手紙<rt>てがみ</rt></ruby>を もたせた <ruby>男<rt>おとこ</rt></ruby>が、この <ruby>席<rt>せき</rt></ruby>の <ruby>前<rt>まえ</rt></ruby>に もう <ruby>敵陣<rt>てきじん</rt></ruby>の むこうへ <ruby>出<rt>で</rt></ruby>て いた。<ruby>話<rt>はなし</rt></ruby>は、そこで 半分 ついて いた？',
          deep: { q: '<ruby>無血開城<rt>むけつかいじょう</rt></ruby>は、<ruby>海舟<rt>かいしゅう</rt></ruby> ひとりの <ruby>手柄<rt>てがら</rt></ruby>？',
            body: `その <ruby>男<rt>おとこ</rt></ruby>の <ruby>名<rt>な</rt></ruby>は <ruby>山岡鉄舟<rt>やまおか てっしゅう</rt></ruby>。<ruby>案内<rt>あんない</rt></ruby>の <ruby>者<rt>もの</rt></ruby>を ひとり つれた だけで <ruby>敵<rt>てき</rt></ruby>の <ruby>陣<rt>じん</rt></ruby>を つっきり、<ruby>駿府<rt>すんぷ</rt></ruby>（いまの <ruby>静岡<rt>しずおか</rt></ruby>）の <ruby>西郷<rt>さいごう</rt></ruby>に <ruby>会<rt>あ</rt></ruby>って いた。<ruby>城<rt>しろ</rt></ruby>の 中では <ruby>大奥<rt>おおおく</rt></ruby>の <ruby>女性<rt>じょせい</rt></ruby>たちが <ruby>慶喜<rt>よしのぶ</rt></ruby>の <ruby>助命<rt>じょめい</rt></ruby>を <ruby>願<rt>ねが</rt></ruby>い、<ruby>外国<rt>がいこく</rt></ruby>の <ruby>公使<rt>こうし</rt></ruby>も <ruby>戦<rt>いくさ</rt></ruby>を いやがって <ruby>圧<rt>あつ</rt></ruby>を かけた。<ruby>大<rt>おお</rt></ruby>きな できごとほど、<ruby>大勢<rt>おおぜい</rt></ruby>の <ruby>手<rt>て</rt></ruby>が <ruby>動<rt>うご</rt></ruby>いて いる。だから「<ruby>勝<rt>かつ</rt></ruby> ひとりの <ruby>功<rt>こう</rt></ruby>」は △（<ruby>諸説<rt>しょせつ</rt></ruby>あり）。`,
            cite: '※ でも、<ruby>会談<rt>かいだん</rt></ruby>の <ruby>席<rt>せき</rt></ruby>で <ruby>西郷<rt>さいごう</rt></ruby>と <ruby>差<rt>さ</rt></ruby>し<ruby>向<rt>む</rt></ruby>かい、<ruby>話<rt>はなし</rt></ruby>を まとめあげたのは <ruby>海舟<rt>かいしゅう</rt></ruby>。いちばん <ruby>大事<rt>だいじ</rt></ruby>な ところは、たしかに <ruby>海舟<rt>かいしゅう</rt></ruby>が やりとげた（◎）。',
            confidence: '△' },
          onEnter: { cards: ['p-saigo', 'p-tesshu'] },
          next: '5-d' },

        '5-d': { place: '<ruby>第<rt>だい</rt></ruby>5<ruby>章<rt>しょう</rt></ruby> むすび',
          onEnter: { clues: ['clue-5'], card: 'w-muketsu' },
          text: `<p><ruby>三月<rt>さんがつ</rt></ruby><ruby>十五日<rt>じゅうごにち</rt></ruby>の <ruby>総攻撃<rt>そうこうげき</rt></ruby>は、ついに 来なかった。<ruby>城<rt>しろ</rt></ruby>は 明けわたされ、<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>江戸<rt>えど</rt></ruby>は、<ruby>一軒<rt>いっけん</rt></ruby>も 焼けずに <ruby>残<rt>のこ</rt></ruby>った。<ruby>刀<rt>かたな</rt></ruby>を <ruby>一度<rt>いちど</rt></ruby>も <ruby>抜<rt>ぬ</rt></ruby>かずに、きみは <ruby>町<rt>まち</rt></ruby>ぜんぶを まもったのだ。</p>
            <p>のちに この <ruby>手柄<rt>てがら</rt></ruby>は、「<ruby>勝海舟<rt>かつ かいしゅう</rt></ruby> ひとりの <ruby>働<rt>はたら</rt></ruby>き」として <ruby>語<rt>かた</rt></ruby>られて いく。——でも、きみは 知って いる。<ruby>山岡<rt>やまおか</rt></ruby>も、<ruby>西郷<rt>さいごう</rt></ruby>も、<ruby>大奥<rt>おおおく</rt></ruby>の 人々も、<ruby>名<rt>な</rt></ruby>の 残らぬ 多くの <ruby>手<rt>て</rt></ruby>も、みな それぞれに、<ruby>江戸<rt>えど</rt></ruby>を <ruby>救<rt>すく</rt></ruby>った。<b><ruby>手柄<rt>てがら</rt></ruby>は、<ruby>語<rt>かた</rt></ruby>り手の <ruby>数<rt>かず</rt></ruby>だけ ある。</b><ruby>手<rt>て</rt></ruby>がかりを ひとつ <ruby>手<rt>て</rt></ruby>に 入れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          creed: { line: '「<ruby>江戸<rt>えど</rt></ruby>を <ruby>焼<rt>や</rt></ruby>かせは せぬ。<ruby>刀<rt>かたな</rt></ruby>を <ruby>抜<rt>ぬ</rt></ruby>かずに <ruby>城<rt>しろ</rt></ruby>を <ruby>渡<rt>わた</rt></ruby>す——これも、<ruby>命<rt>いのち</rt></ruby>がけの <ruby>戦<rt>いくさ</rt></ruby>だ。」',
            act: '——きみは、<ruby>勝<rt>か</rt></ruby>てぬ <ruby>戦<rt>いくさ</rt></ruby>を むりに <ruby>続<rt>つづ</rt></ruby>けなかった。<ruby>攻<rt>せ</rt></ruby>める <ruby>相手<rt>あいて</rt></ruby>と <ruby>話<rt>はなし</rt></ruby>を つけ、<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>命<rt>いのち</rt></ruby>を まもった。"<ruby>戦<rt>たたか</rt></ruby>わない"ことにも、<ruby>命<rt>いのち</rt></ruby>を かけられる。' },
          end: true },
      },
    },
    {
      id: 6, num: '六', title: '裏切り者と 呼ばれて', years: '1868〜1890年代',
      lead: '「英断」と「不忠」は、同じ 一つの 行いの 表と 裏。',
      start: '6-a',
      teaser: '<ruby>敵将<rt>てきしょう</rt></ruby>・西郷への 信は、最後まで つづく。氷川の 老人と なった 海舟が、きみに 謎の 答えを あずける。',
      scenes: {
        '6-a': { place: '<ruby>東京<rt>とうきょう</rt></ruby>・<ruby>赤坂氷川<rt>あかさか ひかわ</rt></ruby>',
          monologue: '（<ruby>幕府<rt>ばくふ</rt></ruby>を <ruby>畳<rt>たた</rt></ruby>み、<ruby>勝<rt>か</rt></ruby>った <ruby>側<rt>がわ</rt></ruby>の <ruby>世<rt>よ</rt></ruby>に、おれは <ruby>生<rt>い</rt></ruby>き<ruby>残<rt>のこ</rt></ruby>った。……「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」と <ruby>言<rt>い</rt></ruby>いたい <ruby>者<rt>もの</rt></ruby>には、<ruby>言<rt>い</rt></ruby>わせて おけば いい。）',
          text: `<p>あれから 三十<ruby>年<rt>ねん</rt></ruby>あまり。きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は、<ruby>赤坂氷川<rt>あかさか ひかわ</rt></ruby>の <ruby>家<rt>いえ</rt></ruby>で、<ruby>白髪<rt>しらが</rt></ruby>の <ruby>老人<rt>ろうじん</rt></ruby>に なって いた。<ruby>髷<rt>まげ</rt></ruby>は とうに 落とし、<ruby>髪<rt>かみ</rt></ruby>は <ruby>短<rt>みじか</rt></ruby>く、<ruby>洋服<rt>ようふく</rt></ruby>の <ruby>襟<rt>えり</rt></ruby>を まとって いる。ちょんまげの <ruby>世<rt>よ</rt></ruby>は、もう <ruby>終<rt>お</rt></ruby>わった。</p>
            <p><ruby>江戸<rt>えど</rt></ruby>を <ruby>明<rt>あ</rt></ruby>けわたした あと、きみは <ruby>新<rt>あたら</rt></ruby>しい <ruby>世<rt>よ</rt></ruby>の <ruby>政府<rt>せいふ</rt></ruby>に まねかれ、<ruby>海軍<rt>かいぐん</rt></ruby>を あずかる <ruby>役<rt>やく</rt></ruby>にも ついた。ほろびた <ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>家来<rt>けらい</rt></ruby>たちが <ruby>暮<rt>く</rt></ruby>らしに <ruby>困<rt>こま</rt></ruby>れば、かげで <ruby>力<rt>ちから</rt></ruby>を つくして <ruby>助<rt>たす</rt></ruby>けた。</p>
            <p>——だが、その <ruby>生<rt>い</rt></ruby>き<ruby>方<rt>かた</rt></ruby>を、こう <ruby>呼<rt>よ</rt></ruby>ぶ <ruby>声<rt>こえ</rt></ruby>が あった。「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」——<ruby>主家<rt>しゅか</rt></ruby>を <ruby>見<rt>み</rt></ruby>すてて、<ruby>勝<rt>か</rt></ruby>った <ruby>側<rt>がわ</rt></ruby>に すりよった 男だ、と。</p>`,
          next: '6-b' },

        '6-b': { place: '<ruby>同<rt>おな</rt></ruby>じ <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>った <ruby>男<rt>おとこ</rt></ruby>',
          closeup: { tone: 'tense', cast: [ { face: 'p-katsu@old', name: '海舟（きみ）' }, { face: 'p-fukuzawa', name: '福澤諭吉' } ] },
          text: `<p>その <ruby>声<rt>こえ</rt></ruby>を、いちばん するどく <ruby>上<rt>あ</rt></ruby>げた <ruby>一人<rt>ひとり</rt></ruby>が——<face pid="p-fukuzawa"><ruby>福澤諭吉<rt>ふくざわ ゆきち</rt></ruby></face>だった。むかし <ruby>咸臨丸<rt>かんりんまる</rt></ruby>で、きみと <ruby>同<rt>おな</rt></ruby>じ <ruby>船<rt>ふね</rt></ruby>に <ruby>乗<rt>の</rt></ruby>って アメリカへ わたった 男。その <ruby>福澤<rt>ふくざわ</rt></ruby>が、<ruby>書<rt>か</rt></ruby>きものの <ruby>中<rt>なか</rt></ruby>で、きみの <ruby>生<rt>い</rt></ruby>き<ruby>方<rt>かた</rt></ruby>を <ruby>正面<rt>しょうめん</rt></ruby>から <ruby>責<rt>せ</rt></ruby>めた。</p>
            <p class="speak">「<ruby>一度<rt>いちど</rt></ruby> <ruby>仕<rt>つか</rt></ruby>えた <ruby>主君<rt>しゅくん</rt></ruby>を <ruby>見<rt>み</rt></ruby>かぎり、<ruby>勝<rt>か</rt></ruby>った <ruby>側<rt>がわ</rt></ruby>に すりよって また <ruby>仕<rt>つか</rt></ruby>える。<ruby>負<rt>ま</rt></ruby>けると 分かって いても、<ruby>意地<rt>いじ</rt></ruby>を <ruby>通<rt>とお</rt></ruby>して こそ <ruby>武士<rt>ぶし</rt></ruby>では ないか。あなたの したことは、<ruby>武士<rt>ぶし</rt></ruby>の <ruby>筋<rt>すじ</rt></ruby>に <ruby>反<rt>はん</rt></ruby>する」</p>
            <p>これは、ただの <ruby>悪口<rt>わるぐち</rt></ruby>では ない。<ruby>福澤<rt>ふくざわ</rt></ruby>もまた、<ruby>自分<rt>じぶん</rt></ruby>の <ruby>筋<rt>すじ</rt></ruby>を まっすぐ <ruby>通<rt>とお</rt></ruby>す 人。その <ruby>目<rt>め</rt></ruby>から <ruby>見<rt>み</rt></ruby>れば、<ruby>戦<rt>たたか</rt></ruby>わずに <ruby>主家<rt>しゅか</rt></ruby>を <ruby>畳<rt>たた</rt></ruby>んだ <ruby>海舟<rt>かいしゅう</rt></ruby>は、どうしても <ruby>許<rt>ゆる</rt></ruby>せなかったのだ。</p>`,
          spark: 'え！？ <ruby>江戸<rt>えど</rt></ruby>を <ruby>救<rt>すく</rt></ruby>った <ruby>英雄<rt>えいゆう</rt></ruby>・<ruby>海舟<rt>かいしゅう</rt></ruby>を、<ruby>面<rt>めん</rt></ruby>と むかって「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>んだ 人が いた？ ——しかも、むかし <ruby>同<rt>おな</rt></ruby>じ <ruby>船<rt>ふね</rt></ruby>で <ruby>海<rt>うみ</rt></ruby>を わたった、<ruby>福澤諭吉<rt>ふくざわ ゆきち</rt></ruby>だった？',
          deep: { q: '「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」か、「<ruby>恩人<rt>おんじん</rt></ruby>」か？',
            body: `<ruby>福澤<rt>ふくざわ</rt></ruby>は『<ruby>瘠我慢<rt>やせがまん</rt></ruby>の <ruby>説<rt>せつ</rt></ruby>』という <ruby>書<rt>か</rt></ruby>きもので、<ruby>海舟<rt>かいしゅう</rt></ruby>の <ruby>生<rt>い</rt></ruby>き<ruby>方<rt>かた</rt></ruby>を 痛烈に 批判した。これは たしかに あった こと——たしかさマークは ◎（<ruby>確<rt>たし</rt></ruby>かな こと）。<br>だが、<ruby>別<rt>べつ</rt></ruby>の 人は <ruby>同<rt>おな</rt></ruby>じ <ruby>海舟<rt>かいしゅう</rt></ruby>を「<ruby>江戸<rt>えど</rt></ruby>を <ruby>救<rt>すく</rt></ruby>った <ruby>恩人<rt>おんじん</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>ぶ。「<ruby>裏切<rt>うらぎ</rt></ruby>り者」か「<ruby>恩人<rt>おんじん</rt></ruby>」か——これは、◎○△☆の どれでも <ruby>決<rt>き</rt></ruby>められない。<b>その 人の <ruby>立場<rt>たちば</rt></ruby>で、まるで <ruby>変<rt>か</rt></ruby>わる</b>からだ。`,
            cite: '※ ◎は「<ruby>福澤<rt>ふくざわ</rt></ruby>が 批判したのは <ruby>確<rt>たし</rt></ruby>かだ」という <ruby>意味<rt>いみ</rt></ruby>。でも「<ruby>英断<rt>えいだん</rt></ruby>か <ruby>不忠<rt>ふちゅう</rt></ruby>か」の <ruby>答<rt>こた</rt></ruby>えは、たしかさマークの <ruby>外<rt>そと</rt></ruby>——それは、きみが <ruby>決<rt>き</rt></ruby>める。',
            confidence: '◎' },
          onEnter: { cards: ['p-fukuzawa', 'w-yasegaman'] },
          next: '6-c' },

        '6-c': { place: '<ruby>言<rt>い</rt></ruby>い<ruby>返<rt>かえ</rt></ruby>すか、<ruby>黙<rt>だま</rt></ruby>って <ruby>受<rt>う</rt></ruby>けるか',
          text: `<p>きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）には、<ruby>言<rt>い</rt></ruby>い<ruby>分<rt>ぶん</rt></ruby>が あった。あの とき <ruby>戦<rt>たたか</rt></ruby>って いれば、<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>江戸<rt>えど</rt></ruby>は <ruby>焼<rt>や</rt></ruby>けて いた。それを <ruby>畳<rt>たた</rt></ruby>んだのは、にげでは ない——<ruby>口<rt>くち</rt></ruby>を ひらけば、いくらでも <ruby>説<rt>と</rt></ruby>き<ruby>返<rt>かえ</rt></ruby>せる。</p>
            <p>だが、<ruby>言<rt>い</rt></ruby>い<ruby>返<rt>かえ</rt></ruby>せば、<ruby>相手<rt>あいて</rt></ruby>を <ruby>言<rt>い</rt></ruby>い<ruby>負<rt>ま</rt></ruby>かす <ruby>勝<rt>か</rt></ruby>ち<ruby>負<rt>ま</rt></ruby>けに なる。きみは、どうする？</p>`,
          q: '「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>ぶ <ruby>声<rt>こえ</rt></ruby>に、きみは どう <ruby>応<rt>こた</rt></ruby>える？',
          choices: [
            { label: '<ruby>言<rt>い</rt></ruby>い<ruby>返<rt>かえ</rt></ruby>して、<ruby>自分<rt>じぶん</rt></ruby>の <ruby>正<rt>ただ</rt></ruby>しさを <ruby>説<rt>と</rt></ruby>く', to: '6-d', effect: { kimo: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>言<rt>い</rt></ruby>い<ruby>返<rt>かえ</rt></ruby>して いたら……',
                body: `<p>ことばで <ruby>説<rt>と</rt></ruby>き<ruby>返<rt>かえ</rt></ruby>せば、<ruby>胸<rt>むね</rt></ruby>の つかえは <ruby>下<rt>お</rt></ruby>りたかも しれない。それも、まちがいでは ない。</p><p>——だが <ruby>海舟<rt>かいしゅう</rt></ruby>は、そう しなかった。ほめる <ruby>声<rt>こえ</rt></ruby>にも、けなす <ruby>声<rt>こえ</rt></ruby>にも いちいち さからわず、<ruby>評価<rt>ひょうか</rt></ruby>は <ruby>他人<rt>たにん</rt></ruby>に あずけた。<ruby>史実<rt>じじつ</rt></ruby>の <ruby>海舟<rt>かいしゅう</rt></ruby>は、ほとんど <ruby>言<rt>い</rt></ruby>い<ruby>返<rt>かえ</rt></ruby>さなかった。</p>` } },
            { label: '<ruby>黙<rt>だま</rt></ruby>って <ruby>引<rt>ひ</rt></ruby>き<ruby>受<rt>う</rt></ruby>け、<ruby>評価<rt>ひょうか</rt></ruby>は <ruby>他人<rt>たにん</rt></ruby>に まかせる', to: '6-d', canon: true, effect: { suji: 2 },
              hist: { verdict: '史実では', match: '<ruby>毀誉<rt>きよ</rt></ruby>は <ruby>他人<rt>たにん</rt></ruby>の もの——<ruby>海舟<rt>かいしゅう</rt></ruby>の <ruby>筋<rt>すじ</rt></ruby>',
                body: `<p><ruby>海舟<rt>かいしゅう</rt></ruby>は、ほとんど <ruby>言<rt>い</rt></ruby>い<ruby>返<rt>かえ</rt></ruby>さなかった。「わたしの したことは わたしが <ruby>決<rt>き</rt></ruby>める。ほめる・けなすは、<ruby>他人<rt>たにん</rt></ruby>の かってだ」——<ruby>昔風<rt>むかしふう</rt></ruby>に いえば「<ruby>行蔵<rt>こうぞう</rt></ruby>は <ruby>我<rt>われ</rt></ruby>に <ruby>存<rt>そん</rt></ruby>す」。そう <ruby>短<rt>みじか</rt></ruby>く <ruby>受<rt>う</rt></ruby>け<ruby>流<rt>なが</rt></ruby>した だけだった。</p><p><ruby>評価<rt>ひょうか</rt></ruby>を <ruby>他人<rt>たにん</rt></ruby>に あずける——それも、一つの <ruby>筋<rt>すじ</rt></ruby>の <ruby>通<rt>とお</rt></ruby>し<ruby>方<rt>かた</rt></ruby>だった。</p>` } },
          ] },

        '6-d': { place: '<ruby>第<rt>だい</rt></ruby>6<ruby>章<rt>しょう</rt></ruby> むすび',
          onEnter: { clues: ['clue-6'] },
          text: `<p><ruby>同<rt>おな</rt></ruby>じ 一つの <ruby>行<rt>おこな</rt></ruby>い——<ruby>戦<rt>たたか</rt></ruby>わずに <ruby>江戸<rt>えど</rt></ruby>を <ruby>畳<rt>たた</rt></ruby>んだ こと——が、ある 人には「<ruby>百万<rt>ひゃくまん</rt></ruby>の <ruby>町<rt>まち</rt></ruby>を <ruby>救<rt>すく</rt></ruby>った <ruby>英断<rt>えいだん</rt></ruby>」に、ある 人には「<ruby>主家<rt>しゅか</rt></ruby>を <ruby>見<rt>み</rt></ruby>すてた <ruby>不忠<rt>ふちゅう</rt></ruby>」に <ruby>見<rt>み</rt></ruby>える。<ruby>表<rt>おもて</rt></ruby>と <ruby>裏<rt>うら</rt></ruby>だ。</p>
            <p>だから、<ruby>歴史<rt>れきし</rt></ruby>を <ruby>読<rt>よ</rt></ruby>む ときは、"だれが そう <ruby>言<rt>い</rt></ruby>ったか"まで <ruby>見<rt>み</rt></ruby>る。「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」と <ruby>言<rt>い</rt></ruby>ったのは <ruby>福澤<rt>ふくざわ</rt></ruby>、「<ruby>恩人<rt>おんじん</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>ぶのは <ruby>別<rt>べつ</rt></ruby>の 人だ。<ruby>手<rt>て</rt></ruby>がかりを ひとつ <ruby>手<rt>て</rt></ruby>に <ruby>入<rt>い</rt></ruby>れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          creed: { line: '「わたしの した ことは、わたしの <ruby>中<rt>なか</rt></ruby>に ある。ほめるも けなすも、<ruby>他人<rt>たにん</rt></ruby>の かってだ。」',
            act: '——「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」とも「<ruby>恩人<rt>おんじん</rt></ruby>」とも <ruby>呼<rt>よ</rt></ruby>ばれながら、<ruby>海舟<rt>かいしゅう</rt></ruby>は どちらの <ruby>声<rt>こえ</rt></ruby>にも <ruby>言<rt>い</rt></ruby>いわけを しなかった。<ruby>自分<rt>じぶん</rt></ruby>の したことを、<ruby>自分<rt>じぶん</rt></ruby>の <ruby>中<rt>なか</rt></ruby>に <ruby>置<rt>お</rt></ruby>いた まま。' },
          end: true },
      },
    },
    {
      id: 7, num: '終', title: '氷川の 老人', years: '1890年代〜1899',
      lead: '語りを うたがっても なお 残る、ほんとうの 海舟。',
      start: '7-a',
      scenes: {
        '7-a': { place: '<ruby>東京<rt>とうきょう</rt></ruby>・<ruby>赤坂氷川<rt>あかさか ひかわ</rt></ruby>',
          monologue: '（<ruby>西郷<rt>さいごう</rt></ruby>……。<ruby>敵<rt>てき</rt></ruby>と <ruby>味方<rt>みかた</rt></ruby>に 分かれ、お前は <ruby>逆賊<rt>ぎゃくぞく</rt></ruby>と された。それでも、おれが <ruby>見<rt>み</rt></ruby>た いちばんの <ruby>男<rt>おとこ</rt></ruby>は、お前だった。）',
          closeup: { tone: 'grief', cast: [ { face: 'p-katsu@old', name: '海舟（きみ）' }, { face: 'p-saigo', name: '西郷隆盛' } ] },
          text: `<p>あれから 三十<ruby>年<rt>ねん</rt></ruby>あまり。きみ（<ruby>海舟<rt>かいしゅう</rt></ruby>）は、<ruby>白髪<rt>しらが</rt></ruby>の <ruby>老人<rt>ろうじん</rt></ruby>に なって いた。<ruby>幕府<rt>ばくふ</rt></ruby>は とうに なく、<ruby>江戸<rt>えど</rt></ruby>は「<ruby>東京<rt>とうきょう</rt></ruby>」と <ruby>名<rt>な</rt></ruby>を 変えた。</p>
            <p>かつて <ruby>江戸<rt>えど</rt></ruby>を かけて <ruby>向<rt>む</rt></ruby>きあった <ruby>敵将<rt>てきしょう</rt></ruby>・<face pid="p-saigo"><ruby>西郷<rt>さいごう</rt></ruby></face>は、のちに <ruby>新<rt>あたら</rt></ruby>しい <ruby>政府<rt>せいふ</rt></ruby>と <ruby>戦<rt>たたか</rt></ruby>い、<ruby>国<rt>くに</rt></ruby>に そむいた <ruby>者<rt>もの</rt></ruby>（<ruby>逆賊<rt>ぎゃくぞく</rt></ruby>）と されて <ruby>死<rt>し</rt></ruby>んだ。——だが きみは、その <ruby>西郷<rt>さいごう</rt></ruby>を わすれなかった。<ruby>自分<rt>じぶん</rt></ruby>の お<ruby>金<rt>かね</rt></ruby>で <ruby>西郷<rt>さいごう</rt></ruby>を まつる <ruby>石碑<rt>せきひ</rt></ruby>を <ruby>建<rt>た</rt></ruby>て、その <ruby>死<rt>し</rt></ruby>を <ruby>生涯<rt>しょうがい</rt></ruby> かなしみつづけた。</p>
            <p>「おれは <ruby>天下<rt>てんか</rt></ruby>で、<ruby>恐<rt>おそ</rt></ruby>ろしい ものを <ruby>二人<rt>ふたり</rt></ruby> <ruby>見<rt>み</rt></ruby>た。……その <ruby>一人<rt>ひとり</rt></ruby>が、<ruby>西郷<rt>さいごう</rt></ruby>だ」——<ruby>敵<rt>てき</rt></ruby>で ありながら、いちばん <ruby>信<rt>しん</rt></ruby>を <ruby>置<rt>お</rt></ruby>いた <ruby>相手<rt>あいて</rt></ruby>。その <ruby>想<rt>おも</rt></ruby>いは、<ruby>最後<rt>さいご</rt></ruby>まで 変わらなかった。</p>`,
          next: '7-b' },

        '7-b': { place: '<ruby>語<rt>かた</rt></ruby>り<ruby>残<rt>のこ</rt></ruby>した 一生',
          text: `<p><ruby>晩年<rt>ばんねん</rt></ruby>の きみは、<ruby>自分<rt>じぶん</rt></ruby>の 一生を たっぷりと <ruby>語<rt>かた</rt></ruby>った。<ruby>龍馬<rt>りょうま</rt></ruby>が <ruby>斬<rt>き</rt></ruby>りに <ruby>来<rt>き</rt></ruby>た <ruby>話<rt>はなし</rt></ruby>も、<ruby>西郷<rt>さいごう</rt></ruby>を「<ruby>恐<rt>おそ</rt></ruby>ろしい」と <ruby>言<rt>い</rt></ruby>った あの ひと<ruby>言<rt>こと</rt></ruby>も、その <ruby>語<rt>かた</rt></ruby>りの <ruby>中<rt>なか</rt></ruby>に ある。</p>
            <p>その <ruby>談話<rt>だんわ</rt></ruby>は、のちに『<ruby>氷川清話<rt>ひかわ せいわ</rt></ruby>』という <ruby>本<rt>ほん</rt></ruby>に なった。<ruby>海舟<rt>かいしゅう</rt></ruby>の <ruby>名<rt>な</rt></ruby>ゼリフが ならぶ <ruby>一冊<rt>いっさつ</rt></ruby>として、いまも <ruby>読<rt>よ</rt></ruby>まれて いる。</p>`,
          spark: 'え！？ その <ruby>一冊<rt>いっさつ</rt></ruby>を まとめたのは、きみ <ruby>自身<rt>じしん</rt></ruby>では ない。しかも <ruby>本<rt>ほん</rt></ruby>に よって、<ruby>同<rt>おな</rt></ruby>じ <ruby>話<rt>はなし</rt></ruby>の <ruby>中身<rt>なかみ</rt></ruby>が ちがう？',
          deep: { q: '『<ruby>氷川清話<rt>ひかわ せいわ</rt></ruby>』は、だれの ことば？',
            body: `この <ruby>本<rt>ほん</rt></ruby>は、<ruby>海舟<rt>かいしゅう</rt></ruby> <ruby>自身<rt>じしん</rt></ruby>が <ruby>書<rt>か</rt></ruby>いた ものでは ない。<ruby>記者<rt>きしゃ</rt></ruby>の <ruby>吉本襄<rt>よしもと こう</rt></ruby>が、あちこちに <ruby>残<rt>のこ</rt></ruby>った <ruby>海舟<rt>かいしゅう</rt></ruby>の <ruby>話<rt>はなし</rt></ruby>を <ruby>集<rt>あつ</rt></ruby>めて、一<ruby>冊<rt>さつ</rt></ruby>に まとめた ものだ。まず、<ruby>海舟<rt>かいしゅう</rt></ruby>が <ruby>自分<rt>じぶん</rt></ruby>の <ruby>手柄<rt>てがら</rt></ruby>を 大きく <ruby>語<rt>かた</rt></ruby>る。その <ruby>上<rt>うえ</rt></ruby>に、<ruby>本<rt>ほん</rt></ruby>に する 人が また <ruby>手<rt>て</rt></ruby>を くわえる——<ruby>海舟<rt>かいしゅう</rt></ruby>が <ruby>名<rt>な</rt></ruby>ざしで しかった <ruby>相手<rt>あいて</rt></ruby>の <ruby>名前<rt>なまえ</rt></ruby>を <ruby>消<rt>け</rt></ruby>して「<ruby>今<rt>いま</rt></ruby>の えらい人」と ぼかしたりも した。だから、<ruby>同<rt>おな</rt></ruby>じ <ruby>話<rt>はなし</rt></ruby>でも、<ruby>本<rt>ほん</rt></ruby>に よって <ruby>違<rt>ちが</rt></ruby>う。<b><ruby>海舟<rt>かいしゅう</rt></ruby>が <ruby>盛<rt>も</rt></ruby>り、まとめる 人も <ruby>盛<rt>も</rt></ruby>る——二重の <ruby>脚色<rt>きゃくしょく</rt></ruby></b>だ。たしかさマークは ○（だいたい たしか）。`,
            cite: '※ でも、<ruby>巌本善治<rt>いわもと よしはる</rt></ruby>が <ruby>直<rt>じか</rt></ruby>に <ruby>聞<rt>き</rt></ruby>いて 記録した『<ruby>海舟座談<rt>かいしゅう ざだん</rt></ruby>』は、<ruby>比較的<rt>ひかくてき</rt></ruby> <ruby>忠実<rt>ちゅうじつ</rt></ruby>と 言われる。すべてが <ruby>作<rt>つく</rt></ruby>り<ruby>話<rt>ばなし</rt></ruby>では ない——<ruby>確<rt>たし</rt></ruby>かめれば、<ruby>芯<rt>しん</rt></ruby>は <ruby>残<rt>のこ</rt></ruby>る。',
            confidence: '○' },
          onEnter: { clues: ['clue-7'], card: 'w-hikawaseiwa' },
          next: '7-c' },

        '7-c': { place: '物語をつらぬく謎 — 答え合わせ',
          text: `<p><ruby>旅<rt>たび</rt></ruby>の はじめ、<ruby>第一<rt>だいいち</rt></ruby><ruby>章<rt>しょう</rt></ruby>で あずけた <ruby>謎<rt>なぞ</rt></ruby>を、もう 一度。</p>
            <p class="speak">なぜ、<ruby>幕府<rt>ばくふ</rt></ruby>の <ruby>家来<rt>けらい</rt></ruby>だった <ruby>男<rt>おとこ</rt></ruby>が、その <ruby>幕府<rt>ばくふ</rt></ruby>を <ruby>終<rt>お</rt></ruby>わらせ、<ruby>敵<rt>てき</rt></ruby>の <ruby>大将<rt>たいしょう</rt></ruby>に <ruby>江戸<rt>えど</rt></ruby>を あずけて しまったのか？ ——しかも その <ruby>手<rt>て</rt></ruby>がら<ruby>話<rt>ばなし</rt></ruby>は、<ruby>本人<rt>ほんにん</rt></ruby>が <ruby>語<rt>かた</rt></ruby>った もの。</p>
            <p><ruby>集<rt>あつ</rt></ruby>めた <ruby>手<rt>て</rt></ruby>がかりを、ひとつずつ <ruby>思<rt>おも</rt></ruby>いかえして——<br><em>きみは、どう <ruby>考<rt>かんが</rt></ruby>える？</em></p>`,
          showClues: true,
          q: 'きみの <ruby>答<rt>こた</rt></ruby>えは？（どれを <ruby>選<rt>えら</rt></ruby>んでも、<ruby>正解<rt>せいかい</rt></ruby>の ひとつ）',
          choices: [
            { label: '<ruby>世界<rt>せかい</rt></ruby>を <ruby>見<rt>み</rt></ruby>る <ruby>目<rt>め</rt></ruby>が あったから。<ruby>幕府<rt>ばくふ</rt></ruby>より 大きな「日本」を <ruby>見<rt>み</rt></ruby>ていた', to: '7-d', answer: 0,
              hist: { verdict: 'きみの 答え', match: 'それは、<ruby>確<rt>たし</rt></ruby>かな <ruby>答<rt>こた</rt></ruby>えの ひとつ',
                body: `<p>そのとおり。<ruby>咸臨丸<rt>かんりんまる</rt></ruby>で <ruby>世界<rt>せかい</rt></ruby>の <ruby>海<rt>うみ</rt></ruby>を わたり、<ruby>外<rt>そと</rt></ruby>から 日本を <ruby>見<rt>み</rt></ruby>た きみは、「<ruby>幕府<rt>ばくふ</rt></ruby>を <ruby>守<rt>まも</rt></ruby>る」ことより「日本ぜんたいを <ruby>沈<rt>しず</rt></ruby>ませない」ことを 大きく <ruby>考<rt>かんが</rt></ruby>えた。だから、その <ruby>幕府<rt>ばくふ</rt></ruby>を <ruby>終<rt>お</rt></ruby>わらせる <ruby>側<rt>がわ</rt></ruby>にも <ruby>回<rt>まわ</rt></ruby>れたのだ。</p>`, card: 'p-katsu' } },
            { label: '<ruby>敵<rt>てき</rt></ruby>にも <ruby>信<rt>しん</rt></ruby>を <ruby>置<rt>お</rt></ruby>く <ruby>度胸<rt>どきょう</rt></ruby>が あったから。<ruby>西郷<rt>さいごう</rt></ruby>を <ruby>信<rt>しん</rt></ruby>じ、<ruby>垣根<rt>かきね</rt></ruby>を こえて <ruby>手<rt>て</rt></ruby>を つなげた', to: '7-d', answer: 1,
              hist: { verdict: 'きみの 答え', match: 'それも、<ruby>鋭<rt>するど</rt></ruby>い <ruby>答<rt>こた</rt></ruby>えの ひとつ',
                body: `<p>そのとおり かも しれない。<ruby>身分<rt>みぶん</rt></ruby>も <ruby>陣営<rt>じんえい</rt></ruby>も こえて 人と つながる <ruby>度胸<rt>どきょう</rt></ruby>——<ruby>脱藩浪士<rt>だっぱん ろうし</rt></ruby>の <ruby>龍馬<rt>りょうま</rt></ruby>を <ruby>育<rt>そだ</rt></ruby>て、<ruby>敵<rt>てき</rt></ruby>の <ruby>大将<rt>たいしょう</rt></ruby>・<ruby>西郷<rt>さいごう</rt></ruby>に <ruby>江戸<rt>えど</rt></ruby>を あずけた。<ruby>味方<rt>みかた</rt></ruby>か <ruby>敵<rt>てき</rt></ruby>かで 人を 分けない きみだから、<ruby>戦<rt>たたか</rt></ruby>わずに <ruby>町<rt>まち</rt></ruby>を <ruby>救<rt>すく</rt></ruby>えた。</p>`, card: 'p-katsu' } },
            { label: '<ruby>自分<rt>じぶん</rt></ruby>の <ruby>筋<rt>すじ</rt></ruby>を <ruby>通<rt>とお</rt></ruby>したから。「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>ばれても、<ruby>正<rt>ただ</rt></ruby>しいと <ruby>決<rt>き</rt></ruby>めた <ruby>道<rt>みち</rt></ruby>を <ruby>行<rt>い</rt></ruby>った', to: '7-d', answer: 2,
              hist: { verdict: 'きみの 答え', match: 'それも、<ruby>正直<rt>しょうじき</rt></ruby>な <ruby>答<rt>こた</rt></ruby>えの ひとつ',
                body: `<p>それも 大切な <ruby>見方<rt>みかた</rt></ruby>だ。ほめる <ruby>声<rt>こえ</rt></ruby>にも けなす <ruby>声<rt>こえ</rt></ruby>にも <ruby>流<rt>なが</rt></ruby>されず、「わたしの したことは わたしが <ruby>決<rt>き</rt></ruby>める」と、<ruby>自分<rt>じぶん</rt></ruby>で えらんだ <ruby>筋<rt>すじ</rt></ruby>を <ruby>通<rt>とお</rt></ruby>した。だから、まわりが なんと <ruby>言<rt>い</rt></ruby>おうと、<ruby>幕府<rt>ばくふ</rt></ruby>を <ruby>畳<rt>たた</rt></ruby>む <ruby>道<rt>みち</rt></ruby>を <ruby>選<rt>えら</rt></ruby>べたのだ。</p>`, card: 'p-katsu' } },
            { label: '……<ruby>語<rt>かた</rt></ruby>りは <ruby>盛<rt>も</rt></ruby>られている。でも、<ruby>江戸<rt>えど</rt></ruby>が <ruby>焼<rt>や</rt></ruby>けなかったのは <ruby>事実<rt>じじつ</rt></ruby>だ', to: '7-d', answer: 3,
              hist: { verdict: 'きみの 答え', match: 'それこそ、いちばん <ruby>大人<rt>おとな</rt></ruby>な <ruby>答<rt>こた</rt></ruby>えかも',
                body: `<p>それが、いちばん <ruby>正直<rt>しょうじき</rt></ruby>な <ruby>答<rt>こた</rt></ruby>えかも しれない。<ruby>咸臨丸<rt>かんりんまる</rt></ruby>も <ruby>無血開城<rt>むけつ かいじょう</rt></ruby>も、<ruby>本人<rt>ほんにん</rt></ruby>の <ruby>手柄<rt>てがら</rt></ruby><ruby>話<rt>ばなし</rt></ruby>は 大きく <ruby>盛<rt>も</rt></ruby>られて いる。それでも、<b><ruby>盛<rt>も</rt></ruby>りを <ruby>割<rt>わ</rt></ruby>り<ruby>引<rt>び</rt></ruby>いて なお <ruby>残<rt>のこ</rt></ruby>る <ruby>事実<rt>じじつ</rt></ruby></b>——<ruby>江戸<rt>えど</rt></ruby>が <ruby>焼<rt>や</rt></ruby>けなかった こと——は <ruby>消<rt>き</rt></ruby>えない。わからない ことを <ruby>楽<rt>たの</rt></ruby>しみ、<ruby>確<rt>たし</rt></ruby>かめて いく。それが、なりきりの ねうちだ。</p>`, card: 'p-katsu' } },
          ] },

        '7-d': { place: '終章 むすび',
          text: `<p><ruby>正解<rt>せいかい</rt></ruby>は、ひとつじゃない。<ruby>手<rt>て</rt></ruby>がかりを <ruby>集<rt>あつ</rt></ruby>めて、<ruby>自分<rt>じぶん</rt></ruby>なりの <ruby>答<rt>こた</rt></ruby>えを <ruby>組<rt>く</rt></ruby>み立てる——それが、<ruby>歴史<rt>れきし</rt></ruby>の <ruby>楽<rt>たの</rt></ruby>しみだ。</p>
            <p>「<ruby>英断<rt>えいだん</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>ぶ <ruby>声<rt>こえ</rt></ruby>も、「<ruby>不忠<rt>ふちゅう</rt></ruby>」と <ruby>呼<rt>よ</rt></ruby>ぶ <ruby>声<rt>こえ</rt></ruby>も あった。<ruby>海舟<rt>かいしゅう</rt></ruby>は、その どちらにも <ruby>言<rt>い</rt></ruby>いわけを しなかった。……そして <ruby>最後<rt>さいご</rt></ruby>には、<ruby>畳<rt>たた</rt></ruby>んだ <ruby>主家<rt>しゅか</rt></ruby>・<ruby>徳川<rt>とくがわ</rt></ruby>の <ruby>血筋<rt>ちすじ</rt></ruby>と、<ruby>勝<rt>かつ</rt></ruby>の <ruby>家<rt>いえ</rt></ruby>を、<ruby>縁組<rt>えんぐ</rt></ruby>みで <ruby>結<rt>むす</rt></ruby>んだ。<ruby>敵<rt>てき</rt></ruby>にも、<ruby>主家<rt>しゅか</rt></ruby>にも、<ruby>生涯<rt>しょうがい</rt></ruby> <ruby>信<rt>しん</rt></ruby>を <ruby>通<rt>とお</rt></ruby>した 一生だった。</p>
            <p><ruby>明治<rt>めいじ</rt></ruby> <ruby>三十二<rt>さんじゅうに</rt></ruby><ruby>年<rt>ねん</rt></ruby>（1899年）、きみは <ruby>静<rt>しず</rt></ruby>かに <ruby>世<rt>よ</rt></ruby>を <ruby>去<rt>さ</rt></ruby>る。——<ruby>語<rt>かた</rt></ruby>りを うたがっても なお <ruby>残<rt>のこ</rt></ruby>る、ほんとうの <ruby>海舟<rt>かいしゅう</rt></ruby>。それを <ruby>確<rt>たし</rt></ruby>かめたのは、ほかでも ない、きみ <ruby>自身<rt>じしん</rt></ruby>だ。</p>
            <p class="speak">よく ここまで、<ruby>海舟<rt>かいしゅう</rt></ruby>と いっしょに <ruby>旅<rt>たび</rt></ruby>を してくれた。<ruby>手帳<rt>てちょう</rt></ruby>の「？？？」が、ひらいたよ。</p>`,
          creed: { line: '「おれの <ruby>話<rt>はなし</rt></ruby>は、<ruby>半分<rt>はんぶん</rt></ruby>は <ruby>盛<rt>も</rt></ruby>りだ。だが、<ruby>江戸<rt>えど</rt></ruby>は <ruby>焼<rt>や</rt></ruby>けなかった。……<ruby>盛<rt>も</rt></ruby>りを <ruby>割<rt>わ</rt></ruby>り<ruby>引<rt>び</rt></ruby>いて なお <ruby>残<rt>のこ</rt></ruby>る もの——それを <ruby>見<rt>み</rt></ruby>つけるのが、お前の <ruby>仕事<rt>しごと</rt></ruby>よ。」',
            act: '——<ruby>世界<rt>せかい</rt></ruby>を <ruby>見<rt>み</rt></ruby>る <ruby>目<rt>め</rt></ruby>、<ruby>敵<rt>てき</rt></ruby>にも <ruby>信<rt>しん</rt></ruby>を <ruby>置<rt>お</rt></ruby>く <ruby>度胸<rt>どきょう</rt></ruby>、そして <ruby>自分<rt>じぶん</rt></ruby>の <ruby>筋<rt>すじ</rt></ruby>。「<ruby>裏切<rt>うらぎ</rt></ruby>り<ruby>者<rt>もの</rt></ruby>」の ひと<ruby>言<rt>こと</rt></ruby>では <ruby>片<rt>かた</rt></ruby>づかない、大きな <ruby>男<rt>おとこ</rt></ruby>。その <ruby>語<rt>かた</rt></ruby>りを <ruby>割<rt>わ</rt></ruby>り<ruby>引<rt>び</rt></ruby>いても なお <ruby>残<rt>のこ</rt></ruby>る <ruby>芯<rt>しん</rt></ruby>を、きみは <ruby>確<rt>たし</rt></ruby>かめた。' },
          end: true },
      },
    },
  ],
};
