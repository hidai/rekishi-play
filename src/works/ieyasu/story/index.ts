// Story data (STORY). ch2 三方ヶ原 = the PILOT, authored at final register (design §8) and now the
// work's register baseline: the rest of the chapters were written against it, one per cycle.
// ALL SEVEN CHAPTERS ARE NOW AUTHORED (ch1〜ch6 + 終章 神に なった 男 = the 謎の回収, design §2) —
// the work is content-complete. Scene ids are chapter-prefixed ('2-a') to stay globally
// unique — sceneMaps / sceneFaceOverrides are keyed by scene id across the whole work.
// Hand-managed (ieyasu has no legacy extract source).
/* eslint-disable */

import type { Story } from '../../../engine/types';

export const STORY: Story = {
  chapters: [
    {
      // Written against the ch2 pilot's register (design §2 章一). The chapter the design charges
      // with two jobs: introduce the confidence marks, and peel the FIRST 神君 layer — the
      // 「かわいそうな人質」boy of the novels, whom the sources do not show (research §3-6, ○).
      // That peel runs OPPOSITE to ch2's: there the ☆/◎ pair debunked a tale that mocked him and
      // one that flattered him; here it debunks the SUFFERING that makes the 神君 admirable. The
      // fork is 桶狭間: canon (walk into the empty 岡崎城) wins the castle and leaves his wife and
      // son hostages in 駿府 for two years — the independence has a price in the hist body, so the
      // chapter cannot read as a hero's origin. Scene maps (三河⇔駿府 の人質往還) land with the map
      // slice, as with the pilot.
      id: 1, num: '一', title: '人質の 子', years: '1543〜1560',
      lead: 'すべては、六さいで よその 家に あずけられた 子どもから はじまった。',
      start: '1-a',
      teaser: '<ruby>武田信玄<rt>たけだ しんげん</rt></ruby>の 大軍が、西へ 動きだす。きみは 城を 出て 迎え撃つか、こもって 待つか？',
      scenes: {
        '1-a': { place: '<ruby>三河<rt>みかわ</rt></ruby>・<ruby>岡崎城<rt>おかざきじょう</rt></ruby>',
          monologue: '（<ruby>父上<rt>ちちうえ</rt></ruby>は、六さいの ぼくを よその 家へ やる。……ぼくが 行かねば、この 家は もたないと いう。）',
          text: `<p>きみは <ruby>竹千代<rt>たけちよ</rt></ruby>。<ruby>三河<rt>みかわ</rt></ruby>・<ruby>岡崎<rt>おかざき</rt></ruby>の <ruby>城主<rt>じょうしゅ</rt></ruby>の 子だ。六さい。</p>
            <p>三さいの とき、母が 家から 出された。そして いま、きみが 家を 出る。「<ruby>約束<rt>やくそく</rt></ruby>の しるし」——東の <ruby>今川<rt>いまがわ</rt></ruby>に あずける 子と して。</p>
            <p><ruby>松平<rt>まつだいら</rt></ruby>の 家は 小さい。東に 今川、西に <ruby>織田<rt>おだ</rt></ruby>。にらみ合う 大きな 二つに はさまれ、どちらかに 子を さし出さねば 生きて いけない。</p>
            <p>ところが 道中、味方の はずの 者に うらぎられ、きみは 西の 織田の 手に 落ちた。二年 後、父が 死ぬ。やがて 今川と 織田が <ruby>人質<rt>ひとじち</rt></ruby>を 取りかえ、きみは こんどこそ 東の <ruby>駿府<rt>すんぷ</rt></ruby>へ。</p>`,
          onEnter: { card: 'w-hitojichi' },
          next: '1-riddle' },

        '1-riddle': { place: '物語をつらぬく謎',
          text: `<p>ここで、この <ruby>旅<rt>たび</rt></ruby>を つらぬく <ruby>謎<rt>なぞ</rt></ruby>を、きみに あずけよう。</p>
            <p>いまの きみは「<ruby>約束<rt>やくそく</rt></ruby>の しるし」。大人に なった きみを、世の 人は こう 呼ぶ——<ruby>約束<rt>やくそく</rt></ruby>を まもる 男、「<ruby>律儀者<rt>りちぎもの</rt></ruby>」。</p>
            <p class="speak">なぜ その 男が、いちばん 長く 仕えた <ruby>主家<rt>しゅけ</rt></ruby>を、自分の 手で ほろぼしたのか？</p>
            <p>しかも きみは、死んだ あと「<ruby>神<rt>かみ</rt></ruby>さま」に される。その「<ruby>神君<rt>しんくん</rt></ruby>さま」の <ruby>話<rt>はなし</rt></ruby>は、<ruby>勝<rt>か</rt></ruby>った 側が 積み上げた もの。どこまでが ほんとうの 家康か——<ruby>手<rt>て</rt></ruby>がかりは 各章に ひとつ。最後の 章で、きみ 自身の 答えを。</p>`,
          next: '1-b' },

        '1-b': { place: '<ruby>駿河<rt>するが</rt></ruby>・<ruby>駿府<rt>すんぷ</rt></ruby>',
          text: `<p><ruby>駿府<rt>すんぷ</rt></ruby>は、岡崎より ずっと 大きな 町だった。きみは ここで 十一年を すごす。</p>
            <p>今川の <ruby>当主<rt>とうしゅ</rt></ruby> <face pid="p-yoshimoto"><ruby>今川義元<rt>いまがわ よしもと</rt></ruby></face>は、きみを 学問の 師に あずけた。大人の 仲間入りを する 日、あの 人は こう 言った——気が した。</p>
            <p class="speak">「わしの 名を 一字 やろう。……三河へ 帰りたいか。帰りたければ、ここで 学べ」</p>
            <p>名は <ruby>松平元康<rt>まつだいら もとやす</rt></ruby>。やがて 今川の <ruby>一族<rt>いちぞく</rt></ruby>の 娘を 妻に むかえた。</p>`,
          spark: 'え！？ ろうやに 入れられ、いじめられ、じっと たえた 少年時代——<ruby>家康<rt>いえやす</rt></ruby>と いえば 出て くる、あの かわいそうな 話。じつは、当時の 記録には 出て こない？',
          deep: { q: 'かわいそうな <ruby>人質<rt>ひとじち</rt></ruby>じゃ なかったの？',
            body: `「<ruby>悲惨<rt>ひさん</rt></ruby>な 人質」の 家康は、<ruby>昭和<rt>しょうわ</rt></ruby>の <ruby>小説<rt>しょうせつ</rt></ruby>や テレビが 広めた 姿だ。当時の 記録が 見せるのは、学問の 師に つき、主君の 名を もらい、今川の 一族の 娘を 妻に した 少年——いまの 研究者の 多くは「人質と いうより、<ruby>政治<rt>せいじ</rt></ruby>の 見習いに 出された」と 見る。たしかさマークは ○（だいたい たしか）。<br>もちろん 自由では ない。帰る 城は 今川の 家来が 使い、三河の 家臣は 遠い 主人を 待つ ばかり。楽では ないが、かわいそうでも ない。`,
            cite: '※ ○＝だいたい たしか。この 先、△（<ruby>説<rt>せつ</rt></ruby>が わかれる）や ☆（たしかめられない）も 出て くる。',
            confidence: '○' },
          onEnter: { card: 'p-yoshimoto' },
          next: '1-c' },

        '1-c': { place: '<ruby>桶狭間<rt>おけはざま</rt></ruby>の 日',
          monologue: '（<ruby>十三年<rt>じゅうさんねん</rt></ruby>。……あの 城に、帰れる。——だが <ruby>駿府<rt>すんぷ</rt></ruby>には、まだ。）',
          text: `<p>1560年5月。<ruby>義元<rt>よしもと</rt></ruby>が 大軍を ひきいて 西へ。きみの 役目は、敵の 目の 前の <ruby>大高城<rt>おおだかじょう</rt></ruby>へ <ruby>兵糧<rt>ひょうろう</rt></ruby>を 運びこむ こと。いちばん 危ない 役だ。やりとげた ところに、しらせが 来る。</p>
            <p>——義元、<ruby>討<rt>う</rt></ruby>ち死に。<face pid="p-nobunaga"><ruby>織田信長<rt>おだ のぶなが</rt></ruby></face>の 手勢が、<ruby>本陣<rt>ほんじん</rt></ruby>を 突いた。</p>
            <p><ruby>家臣<rt>かしん</rt></ruby>たちが いっせいに かけよった。</p>
            <p class="speak">「<ruby>殿<rt>との</rt></ruby>。今川の 兵は 岡崎から 逃げ去りました。——十三年 待った 城が、いま 目の 前に あいて おります」</p>
            <p>わく 声の 中、年かさの <ruby>家臣<rt>かしん</rt></ruby>が ひとり うつむいて いた。</p>
            <p class="speak">「……なりませぬ。今川は まだ 大国です。それに <ruby>奥方<rt>おくがた</rt></ruby>さまと <ruby>若君<rt>わかぎみ</rt></ruby>は、いまも 駿府に おいでです」</p>`,
          q: '<ruby>空<rt>あ</rt></ruby>いた 岡崎城を、きみは どうする？',
          choices: [
            { label: '<ruby>城<rt>しろ</rt></ruby>へ 入り、今川から はなれる', to: '1-d', canon: true, effect: { yuzuranu: 2 },
              hist: { verdict: '史実では', match: '入った。そして 二年、妻子を 敵地に 残す ことに なる',
                body: `<p>きみは 岡崎城へ 入り、二度と 駿府へ もどらなかった。まもなく 今川に そむき、<ruby>義元<rt>よしもと</rt></ruby>を 討った <ruby>信長<rt>のぶなが</rt></ruby>と 手を 組む。</p><p>妻と 子を 取りもどせたのは、二年 のち。今川方の 城を せめ落とし、そこで 生けどった 者たちと 取りかえたのだ。——<ruby>独立<rt>どくりつ</rt></ruby>とは、そういう ものだった。</p>` } },
            { label: '今川に したがい、妻子を まもる', to: '1-d', effect: { matsu: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 今川に ついて いたら……',
                body: `<p>妻と 子は、すぐに 帰って きた だろう。だが 今川は、いちばん 大事な <ruby>義元<rt>よしもと</rt></ruby>を 失って いた。あとを ついだ 子の 代で 家臣は はなれ、九年後、今川の 家は 国ごと 消える。</p><p>その とき <ruby>松平<rt>まつだいら</rt></ruby>の 家も、いっしょに 沈んで いたかも しれない。——だが その 先は、いまの きみには 見えない。<ruby>史実<rt>じじつ</rt></ruby>の きみは、城へ 入った。</p>` } },
          ],
          onEnter: { cards: ['w-okehazama', 'p-nobunaga'] } },

        '1-d': { place: '第1章 むすび',
          text: `<p>きみは 生まれた 城に、十三年ぶりに 帰った。</p>
            <p>あずけられ、うばわれ、また あずけられた 子ども。行き先は いつも、だれかが 決めて いた。——その きみが はじめて 自分で 決めたのは、世話に なった 家に そむく ことだった。</p>
            <p>「かわいそうな 人質の 子が、たえに たえて 天下を とった」。そう 語る 本は 多い。だが <ruby>記録<rt>きろく</rt></ruby>の 中の きみは、<b>かわいそうでも、りっぱでも ない</b>。大きな 家の やり方を 十一年 見て きた 十九さいだ。はじめての <ruby>手<rt>て</rt></ruby>がかりを 手に 入れた。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          creed: { line: '「<ruby>行<rt>い</rt></ruby>き先を 決められて 生きて きた。——ここから 先は、おれが 決める。」',
            act: '——今川から もらった 一字「元」も、やがて すてる。きみは 名を <ruby>家康<rt>いえやす</rt></ruby>と あらため、この 城へ 入った 六年後には、姓も <ruby>松平<rt>まつだいら</rt></ruby>から <ruby>徳川<rt>とくがわ</rt></ruby>へ 変える。' },
          onEnter: { clues: ['clue-1'] },
          end: true },
      },
    },
    {
      // ★PILOT CHAPTER (design §8): written first, at final register, to fix the work's tone.
      // It carries the register core in one chapter — the 外れ=大敗 fork (the canon choice is the
      // one that loses), a tense closeup, and BOTH confidence marks: ☆ on the 脱糞 tale that
      // MOCKS him (research §3-2) and ◎ on "no record was ever found" behind the しかみ像 legend
      // that FLATTERS him (§3-3). That pairing is the calibration this pilot exists for (design
      // §0-4): the work debunks in both directions, so it neither rebuilds the 神君 nor swings
      // into the mirror trap of a cold schemer. Scene maps land with the ch2 map slice (the
      // opening-anchor principle reads off the written scenes); katsu's pilot deferred the same.
      id: 2, num: '二', title: '三方ヶ原の 大敗', years: '1572〜1573',
      lead: '生涯 最大の 大敗。逃げ帰った その 顔を、家康は 絵に 描かせた——と、長く 語られて きた。',
      start: '2-a',
      teaser: '<ruby>本能寺<rt>ほんのうじ</rt></ruby>が 燃えた。<ruby>堺<rt>さかい</rt></ruby>に いる きみの まわりは、敵だらけだ。',
      scenes: {
        '2-a': { place: '<ruby>遠江<rt>とおとうみ</rt></ruby>・<ruby>浜松城<rt>はままつじょう</rt></ruby>',
          monologue: '（<ruby>人質<rt>ひとじち</rt></ruby>の 子が、二つの 国の <ruby>主<rt>あるじ</rt></ruby>に なった。……その <ruby>国<rt>くに</rt></ruby>へ、いちばん 会いたく ない 男が 来る。）',
          text: `<p>あれから 十二年。<ruby>人質<rt>ひとじち</rt></ruby>の 子は、<ruby>三河<rt>みかわ</rt></ruby>と <ruby>遠江<rt>とおとうみ</rt></ruby>、二つの 国を 持つ <ruby>大名<rt>だいみょう</rt></ruby>に なって いた。城は <ruby>浜松<rt>はままつ</rt></ruby>。西の <ruby>織田信長<rt>おだ のぶなが</rt></ruby>とは、手を 組んで いる。</p>
            <p>1572年の 暮れ。東の 山から、<face pid="p-shingen"><ruby>武田信玄<rt>たけだ しんげん</rt></ruby></face>の 大軍が 動きだした。<ruby>甲斐<rt>かい</rt></ruby>の <ruby>猛将<rt>もうしょう</rt></ruby>——<ruby>東国<rt>とうごく</rt></ruby>いちの <ruby>戦<rt>いくさ</rt></ruby>じょうずと おそれられる 男だ。その 数、二万を こえる。きみが 集められる 兵は、<ruby>信長<rt>のぶなが</rt></ruby>からの <ruby>援軍<rt>えんぐん</rt></ruby>を 足しても、その 半分に とどかない。</p>`,
          onEnter: { card: 'p-shingen' },
          next: '2-b' },

        '2-b': { place: '<ruby>城<rt>しろ</rt></ruby>の 前を、<ruby>素通<rt>すどお</rt></ruby>りして いく',
          text: `<p>ところが <ruby>信玄<rt>しんげん</rt></ruby>は、<ruby>浜松城<rt>はままつじょう</rt></ruby>を せめて こなかった。城の すぐ 北の 台地——<ruby>三方ヶ原<rt>みかたがはら</rt></ruby>を、西へ。きみの 城など 見えて いないかの ように、通りすぎて いく。</p>
            <p>若い <ruby>家臣<rt>かしん</rt></ruby>が、<ruby>床<rt>ゆか</rt></ruby>を たたいた。</p>
            <p class="speak">「<ruby>殿<rt>との</rt></ruby>。台地を 下る ところを うしろから 突けば、<ruby>大軍<rt>たいぐん</rt></ruby>でも くずせます。——目の 前を ふみにじられて 出ぬ <ruby>主<rt>あるじ</rt></ruby>の ために、だれが 命を かけましょう」</p>
            <p>年かさの <ruby>家臣<rt>かしん</rt></ruby>は、首を 横に ふった。</p>
            <p class="speak">「なりませぬ。あの <ruby>信玄<rt>しんげん</rt></ruby>が、やすやすと <ruby>背中<rt>せなか</rt></ruby>を 見せる はずが ない。——<ruby>城<rt>しろ</rt></ruby>さえ 残れば、<ruby>国<rt>くに</rt></ruby>は 残ります」</p>
            <p>どちらの 言い分も、正しい <ruby>気<rt>き</rt></ruby>が する。決めるのは、きみだ。</p>`,
          q: '<ruby>目<rt>め</rt></ruby>の 前を 通りすぎる 大軍を、きみは どうする？',
          choices: [
            { label: '<ruby>城<rt>しろ</rt></ruby>を 出て、うしろから 討つ', to: '2-c', canon: true, effect: { yuzuranu: 2 },
              hist: { verdict: '史実では', match: '出た。そして、<ruby>生涯<rt>しょうがい</rt></ruby> 最大の 負けを する',
                body: `<p>きみは 城を 出た。だが 台地に 着いた とき、<ruby>武田<rt>たけだ</rt></ruby>の 大軍は すでに 向きを 変え、こちらを 待って いた。<ruby>素通<rt>すどお</rt></ruby>りは、さそいだったのかも しれない。</p><p><ruby>戦<rt>いくさ</rt></ruby>は 二時間ほどで ついた。名の ある <ruby>家臣<rt>かしん</rt></ruby>が つぎつぎに 討たれ、きみは 命からがら 城へ 逃げ帰る ことに なる。</p>` } },
            { label: '<ruby>城<rt>しろ</rt></ruby>に こもって、やり過ごす', to: '2-c', effect: { matsu: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし こもって いたら……',
                body: `<p>こもって いれば、あの 大敗は 無かったかも しれない。じっさい <ruby>信玄<rt>しんげん</rt></ruby>は、この <ruby>戦<rt>いくさ</rt></ruby>の 数か月後に <ruby>病<rt>やまい</rt></ruby>で 死ぬ。待って さえ いれば、<ruby>敵<rt>てき</rt></ruby>の ほうが 先に 消えたのだ。</p><p>——だが その 先は、いまの きみには 見えない。目の 前を ふみにじられて 出ない <ruby>大名<rt>だいみょう</rt></ruby>を、<ruby>家臣<rt>かしん</rt></ruby>は どう 見るか。<ruby>信長<rt>のぶなが</rt></ruby>は どう 見るか。<ruby>史実<rt>じじつ</rt></ruby>の きみは、城を 出た。</p>` } },
          ] },

        '2-c': { place: '<ruby>三方ヶ原<rt>みかたがはら</rt></ruby>',
          closeup: { tone: 'tense', cast: [ { face: 'p-ieyasu@fear', name: '家康（きみ）' }, { face: 'p-shingen', name: '武田信玄' } ] },
          text: `<p>台地に 上がった とき、きみは 見た。西へ 去った はずの 大軍が、ずらりと こちらを 向いて ならんで いる。<ruby>信玄<rt>しんげん</rt></ruby>は、きみが 出て くるのを 知って いた。</p>
            <p>あの <ruby>陣<rt>じん</rt></ruby>の どこかで、あの 男は こう 言った——<ruby>気<rt>き</rt></ruby>が した。</p>
            <p class="speak">「出て くるであろうと 思うて おった。<ruby>国<rt>くに</rt></ruby>を ふみにじられて、じっと して おられる 若さでは あるまい」</p>
            <p>ぶつかって、二時間。<ruby>家臣<rt>かしん</rt></ruby>が つぎつぎに 討たれ、きみの <ruby>身<rt>み</rt></ruby>がわりと 名のって 死んだ 者も いた。日が 落ちる 中を、きみは わずかな 供と <ruby>浜松<rt>はままつ</rt></ruby>へ 走った。</p>
            <p>——生きて 帰った。それだけの <ruby>戦<rt>いくさ</rt></ruby>だった。</p>`,
          spark: 'え！？ にげる 馬の 上で、こわさの あまり もらして しまった——<ruby>家康<rt>いえやす</rt></ruby>と いえば 出て くる、あの 有名な 話。じつは、この <ruby>戦<rt>いくさ</rt></ruby>の 話じゃ ない？',
          deep: { q: 'あの「もらした」話、ほんとう？',
            body: `こわさの あまり もらした——<ruby>家康<rt>いえやす</rt></ruby>で いちばん 有名かも しれない 話だ。だが <ruby>当時<rt>とうじ</rt></ruby>の 記録には、どこにも 出て こない。いちばん 近い 形で 出て くるのは、1837年に できた <ruby>幕府<rt>ばくふ</rt></ruby>の 本『<ruby>改正三河後風土記<rt>かいせいみかわごふどき</rt></ruby>』——<ruby>戦<rt>いくさ</rt></ruby>から 265年 後。しかも その 話は、三方ヶ原では なく、二か月 前の べつの <ruby>戦<rt>いくさ</rt></ruby>の ものだ。それが <ruby>昭和<rt>しょうわ</rt></ruby>の <ruby>小説<rt>しょうせつ</rt></ruby>や テレビで 広まった。たしかさマークは ☆（あとの 世が つくった 話）。`,
            cite: '※ 記録を たどると、家康を わらう 話の ほうが、あとから 大きく なって いた。',
            confidence: '☆' },
          onEnter: { cards: ['w-mikatagahara'] },
          next: '2-d' },

        '2-d': { place: '第2章 むすび',
          reveal: { face: 'p-ieyasu@shikami',
            title: 'しかみ<ruby>像<rt>ぞう</rt></ruby>',
            caption: '<ruby>大敗<rt>たいはい</rt></ruby>の あと、家康は 自分の 情けない <ruby>姿<rt>すがた</rt></ruby>を 絵に <ruby>描<rt>えが</rt></ruby>かせ、<ruby>生涯<rt>しょうがい</rt></ruby> そばに 置いて 自分を <ruby>戒<rt>いまし</rt></ruby>めた——長く、そう 語られて きた 一枚。' },
          text: `<p>その 絵は、いまも <ruby>名古屋<rt>なごや</rt></ruby>の <ruby>美術館<rt>びじゅつかん</rt></ruby>に ある。負けを 忘れぬ ため、自分の いちばん 情けない 顔を そばに 置く。——いかにも <ruby>名将<rt>めいしょう</rt></ruby>らしい、いい 話だ。</p>
            <p>2015年、その 美術館の <ruby>学芸員<rt>がくげいいん</rt></ruby>が、古い <ruby>記録簿<rt>きろくぼ</rt></ruby>を 一から 調べなおした。——この 絵と 三方ヶ原を むすぶ 記録は、どこにも 無かった。書いて あったのは、絵の 名前 だけ。<ruby>戦<rt>いくさ</rt></ruby>の ことは、一言も 出て こない。</p>
            <p>ほめる 話も、わらう 話も、あとの 世が つけ足す。それでも——<b>きみが 大負けして 逃げ帰った ことだけは、消えない</b>。二つめの <ruby>手<rt>て</rt></ruby>がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に くわわった。</p>`,
          deep: { q: 'なぜ、<ruby>三方ヶ原<rt>みかたがはら</rt></ruby>の 絵に なったの？',
            body: `<ruby>記録簿<rt>きろくぼ</rt></ruby>に あったのは「<ruby>東照宮<rt>とうしょうぐう</rt></ruby>の お<ruby>姿<rt>すがた</rt></ruby>」の 一言だけ。この 絵が <ruby>美術館<rt>びじゅつかん</rt></ruby>へ 来たのは 1780年——べつの <ruby>徳川家<rt>とくがわけ</rt></ruby>から <ruby>姫<rt>ひめ</rt></ruby>が 嫁いで きた ときの 荷物に 入って いた と みられる。<ruby>戦<rt>いくさ</rt></ruby>から <ruby>約<rt>やく</rt></ruby>200年 あとの ことだ。「三方ヶ原の <ruby>戒<rt>いまし</rt></ruby>め」の 話が いつ ついたのかは、まだ わかって いない。<br>「<ruby>戦<rt>いくさ</rt></ruby>と むすぶ 記録が 見つからない」——これは はっきりした 事実だ（たしかさマーク ◎）。絵は たしかに ある。ただ、その 絵に くっついた 話が、あとから 来た。`,
            cite: '※ わらう 話は ☆、ほめる 話は 記録なし。——どちらの 向きにも、話は 盛られる。',
            confidence: '◎' },
          creed: { line: '「<ruby>負<rt>ま</rt></ruby>けた。だが、<ruby>城<rt>しろ</rt></ruby>は まだ ある。——<ruby>生<rt>い</rt></ruby>きて いれば、つぎが ある。」',
            act: '——<ruby>名誉<rt>めいよ</rt></ruby>の ために その場で 死ぬ 道も あった。きみは 逃げ、城に もどり、兵を 立てなおした。<ruby>信玄<rt>しんげん</rt></ruby>は 数か月後に <ruby>病<rt>やまい</rt></ruby>で 死に、三年後、きみは <ruby>信長<rt>のぶなが</rt></ruby>と ともに <ruby>長篠<rt>ながしの</rt></ruby>で <ruby>武田<rt>たけだ</rt></ruby>を 破る。' },
          onEnter: { cards: ['w-shikamizo'], clues: ['clue-2'] },
          end: true },
      },
    },
    {
      // design §2 章カルテ: peel the「忍者に守られた神君」image — katsu's「本人談を疑う」turned onto
      // 「家の歴史を疑う」(research §3-11). Three register decisions this chapter makes:
      //
      // 1) ★THE FORK HAS NO CANON, and that is the chapter. Which road he took is 諸説 — 甲賀経由説
      //    (藤田達生) vs the traditional 伊賀越え — so neither branch can be marked canon and the
      //    engine drops the fork from「きみの読み（史実一致）」 (engine/canon.ts skips forks with no
      //    canon flag anywhere). The child's route choice is graded exactly like the child's own
      //    answer in 終章, because the historians are in the same position. Both hist panels are
      //    stamped 「△」 — the work's own confidence mark AS the verdict seal, cashing the promise
      //    ch1's cite made (「この 先、△〔諸説 あり〕…も 出て くる」). They converge on one fact from
      //    opposite ends: the road that got the NAME (神君伊賀越え) is not the road that has the
      //    PAPER (the 起請文 in 『和田家文書』). ch2 learned a map cannot hedge; a fork can.
      // 2) ★THE FORK'S SHAPE CHANGES (BACKLOG: the 通し離脱テスト found ch1/ch2's forks the same
      //    shape). ch1/ch2 were 動く vs 動かない with a young retainer pushing and an old one
      //    restraining. Here BOTH voices push — nobody says stay, there is no staying — and they
      //    push in opposite compass directions. The counter is not caution but an accusation
      //    aimed at きみ: 伊賀 is dangerous BECAUSE OF きみ's own 20-year alliance (信長 burned
      //    伊賀 the year before, 天正伊賀の乱 1581). The register rule「岐路は両側に声を立てる」holds.
      // 3) ★ONE debunk, and the deep does it (BACKLOG: 1-b→2-c→2-d ran three in a row and the
      //    personas started predicting the beat). The 忍者 tale is the chapter's single peel; the
      //    route's uncertainty is carried by the fork itself, the source asymmetry by the creed.
      //
      // The 小5「入りやすさ」gap the eval keeps reporting (ch1「入り口が政治」/ ch2「笑えるところが
      // ない」) gets this work's best shot here: a manhunt through mountains, and 忍者 — the one
      // thing in 家康's life a 10-year-old already wants to know about. NINJAS are familiar; the
      // Hanzō-saved-Ieyasu LEGEND is not (観察メモ 2026-07-16: neither parents nor kids knew it).
      // So the spark quotes the legend first, says it spread later, THEN peels it — it must not
      // address the reader with おなじみの あの 話. Presume curiosity, never the reader's pop culture.
      //
      // Scene maps land with the next map slice, as with ch1/ch2 — the opening-anchor principle
      // reads off written scenes. ch3's map is the chapter's designed device (design §2:
      // ★ルート選択地図), so 3-b in particular is carrying its geography (伊賀/甲賀/伊勢) on the body
      // alone until then.
      id: 3, num: '三', title: '伊賀を こえて', years: '1582',
      lead: 'わずかな 供だけで、敵地を こえて 三河へ 帰る。——忍者が 守ってくれた、という 話が ある。',
      start: '3-a',
      teaser: '<ruby>秀吉<rt>ひでよし</rt></ruby>が 天下に 手を かける。きみは 頭を 下げるか、それとも 戦うか？',
      scenes: {
        '3-a': { place: '<ruby>和泉<rt>いずみ</rt></ruby>・<ruby>堺<rt>さかい</rt></ruby>',
          monologue: '（<ruby>物見<rt>ものみ</rt></ruby>の 旅の つもりだった。……よろいも、<ruby>兵<rt>へい</rt></ruby>も、ここには 無い。）',
          text: `<p>1582年6月、<ruby>堺<rt>さかい</rt></ruby>。日本 いちの <ruby>商<rt>あきな</rt></ruby>いの 町だ。</p>
            <p>二十年 手を 組んで きた <face pid="p-nobunaga"><ruby>織田信長<rt>おだ のぶなが</rt></ruby></face>に まねかれ、<ruby>京<rt>きょう</rt></ruby>と 堺を 見て まわる 旅の とちゅうだった。<ruby>供<rt>とも</rt></ruby>は 数十人。<ruby>戦<rt>いくさ</rt></ruby>の したくなど、だれも して いない。</p>
            <p>朝、馬が 一頭 かけこんで きた。乗って いた 男は、ころげ落ちる ように 言った。</p>
            <p class="speak">「<ruby>本能寺<rt>ほんのうじ</rt></ruby>が 燃えて ございます。<ruby>上様<rt>うえさま</rt></ruby>は——ご<ruby>家臣<rt>かしん</rt></ruby>の <ruby>明智光秀<rt>あけち みつひで</rt></ruby>に、討たれました」</p>
            <p><ruby>供<rt>とも</rt></ruby>の ひとりが、笑った。うそだろう、と 言いたかったのだ。だれも 続かなかった。だれかの 手から、<ruby>扇<rt>おうぎ</rt></ruby>が 落ちた。</p>
            <p>二十年、いつも そこに あった 大きな ものが、一夜で 消えた。その 信長と いちばん 長く 手を 組んで きた 男が、いま <ruby>京<rt>きょう</rt></ruby>の すぐ そばに いる。刀を さした 数十人 だけを つれて。</p>`,
          reveal: { face: 'p-nobunaga@fall', tone: 'crisis',
            title: '<ruby>急報<rt>きゅうほう</rt></ruby>——<ruby>本能寺<rt>ほんのうじ</rt></ruby>',
            caption: '<ruby>織田信長<rt>おだ のぶなが</rt></ruby>、<ruby>家臣<rt>かしん</rt></ruby>・<ruby>明智光秀<rt>あけち みつひで</rt></ruby>の むほんに より、<ruby>京<rt>きょう</rt></ruby>・<ruby>本能寺<rt>ほんのうじ</rt></ruby>に たおれる。——きみを まねいた 人が、きみを <ruby>敵地<rt>てきち</rt></ruby>の まん中に 残して 消えた。' },
          onEnter: { card: 'w-honnoji' },
          next: '3-b' },

        '3-b': { place: '<ruby>三河<rt>みかわ</rt></ruby>へ 帰る 道',
          text: `<p>三河までは、山ばかりの 道が 二百キロ あまり。<ruby>京<rt>きょう</rt></ruby>は もう <ruby>光秀<rt>みつひで</rt></ruby>の 手の 内だ。山には、<ruby>主<rt>あるじ</rt></ruby>を 失った 武士を おそって 刀や <ruby>銭<rt>ぜに</rt></ruby>を うばう 者が 出る。</p>
            <p>だれも「ここに いよう」とは 言わなかった。言い合ったのは、どの 山を こえるか だ。</p>
            <p><face pid="p-hanzo"><ruby>服部半蔵<rt>はっとり はんぞう</rt></ruby></face>が、地面に 線を 引いた。</p>
            <p class="speak">「まっすぐ 東——<ruby>伊賀<rt>いが</rt></ruby>の 山を こえれば、<ruby>伊勢<rt>いせ</rt></ruby>の 海に 出ます。船に 乗れば 三河は すぐ。いちばん 近い」</p>
            <p><ruby>年<rt>とし</rt></ruby>かさの <ruby>家臣<rt>かしん</rt></ruby>が、その 線を 手で 消した。</p>
            <p class="speak">「伊賀は なりませぬ。<ruby>去年<rt>きょねん</rt></ruby>、<ruby>信長<rt>のぶなが</rt></ruby>どのが あの 国を 焼きはらった。——その 信長どのと 二十年 手を 組んで きたのが、<ruby>殿<rt>との</rt></ruby>です」</p>
            <p class="speak">「北へ まわり、<ruby>甲賀<rt>こうが</rt></ruby>を 通りましょう。遠い。ですが、伊賀ほど うらまれて いない」</p>`,
          q: '<ruby>三河<rt>みかわ</rt></ruby>へ 帰る 道を、きみは どちらに とる？',
          choices: [
            { label: '<ruby>伊賀<rt>いが</rt></ruby>の 山を、まっすぐ こえる', to: '3-c', effect: { yuzuranu: 1 },
              hist: { verdict: '記録では', seal: '△', match: 'この 道の 名だけが、大きく 残った',
                body: `<p>まっすぐ 東へ。山を こえ、<ruby>伊勢<rt>いせ</rt></ruby>の 港から 船に 乗って 三河へ 帰りついた。生きて 帰った——それは たしかだ。</p><p>のちに この 逃げ道は「<ruby>神君伊賀越<rt>しんくん いがご</rt></ruby>え」と 呼ばれ、家康 いちばんの 危機と して 語られる ように なる。ところが、伊賀を 通ったと はっきり 書いた その ころの 紙は、見つかって いない。<b>名前だけが 大きく なった</b>のだ。</p>` } },
            { label: '北へ まわって、<ruby>甲賀<rt>こうが</rt></ruby>を 通る', to: '3-c', effect: { hito: 1 },
              hist: { verdict: '記録では', seal: '△', match: 'こちらには、紙が 残って いる',
                body: `<p>北へ まわって 数日。山を こえ、<ruby>伊勢<rt>いせ</rt></ruby>の 港から 船に 乗って 三河へ 帰りついた。生きて 帰った——それは たしかだ。</p><p>きみが <ruby>甲賀<rt>こうが</rt></ruby>の 武士に あてて 書いた <ruby>誓<rt>ちか</rt></ruby>いの 紙が、その 家に 今も 残る。伊賀の 側には、そういう 紙が ほとんど 無い。だから 近ごろは「伊賀は なるべく 避けて、甲賀を 通った」と する 説が 強い。——それでも、決まった わけでは ない。</p>` } },
          ],
          onEnter: { card: 'p-hanzo' } },

        '3-c': { place: '<ruby>山<rt>やま</rt></ruby>の 中',
          text: `<p>山は、静かでは なかった。木の 間から、人が 見て いる。竹やりを 持った 村の 者。名も 知らぬ 侍。</p>
            <p>きみと いっしょに 堺に いた もう ひとりの <ruby>武将<rt>ぶしょう</rt></ruby>は、べつの 道を 行き、二度と 帰らなかった。</p>
            <p>三日か 四日か。きみは <ruby>伊勢<rt>いせ</rt></ruby>の <ruby>港<rt>みなと</rt></ruby>に たどりつき、船に 乗った。——生きて いた。</p>
            <p>では その 数日、山の 中で 何が あったのか。——<b>じつは、よく わかって いない</b>。</p>`,
          spark: 'え！？ 「<ruby>服部半蔵<rt>はっとり はんぞう</rt></ruby>と <ruby>伊賀<rt>いが</rt></ruby>の <ruby>忍者<rt>にんじゃ</rt></ruby>が 家康を 守りぬいた」——そんな 話が ある。のちの 世で、マンガや ゲームにも なった。じつは、それを 最初に 書き残したのは……？',
          deep: { q: 'あの「<ruby>忍者<rt>にんじゃ</rt></ruby>が 守った」話、だれが 書いたの？',
            body: `その 話が 出て くる いちばん 古い 紙は『<ruby>伊賀者由緒書<rt>いがもの ゆいしょがき</rt></ruby>』。書いたのは <ruby>伊賀者<rt>いがもの</rt></ruby>たち 自身で、1726年ごろ——きみが 山を こえてから 140年 あとだ。しかも その ころ 伊賀者たちは、<ruby>幕府<rt>ばくふ</rt></ruby>に「うちの ご先祖が <ruby>神君<rt>しんくん</rt></ruby>を 助けた」と 申し出て、あつかいを よく して もらおうと して いた。<br>幕府の 公式の <ruby>記録<rt>きろく</rt></ruby>には、助けた 者と して 半蔵の 名が はっきりとは 出て こない。半蔵 自身、生まれは <ruby>三河<rt>みかわ</rt></ruby>だ。たしかさマークは ○（だいたい たしか）。`,
            cite: '※ 家に 伝わる 手がら話は、その 家の ために 書かれる。——だれが、いつ、なぜ 書いたか。',
            confidence: '○' },
          onEnter: { cards: ['w-igagoe'] },
          next: '3-d' },

        // ★The chapter's payoff lives HERE, not in a hist branch — and getting it here took two
        // /eval-work rounds, because the first fix MOVED the defect instead of removing it. Worth
        // recording, because the defect is this work's signature failure:
        //
        // r1: the line 「名前が 残った 道と、紙が 残った 道は…」 sat in the 甲賀 hist (so the 伊賀 player
        //   never saw the chapter's best sentence) and the creed said 「きみが 甲賀の 武士に あてて
        //   書いた…」 unconditionally — handing the 伊賀 player a fact from the road they did NOT
        //   take. 書法8「選択は分岐で報いる」, inverted: a two-way fork collapsing into one road.
        // r2: moving both to the むすび fixed the reach but not the assertion. 「名前が 残った 道と、
        //   紙が 残った 道は、べつだった」 reads as a claim about which road he WALKED — 「紙が 残った
        //   道」 only means "his road" if the paper proves the road, which is exactly 藤田's contested
        //   argument. The むすび was quietly settling the dispute the 3-b △ seals declare open, for
        //   every player regardless of their choice. Same failure as ch2's withdrawn march line,
        //   in prose instead of geometry.
        //
        // The fix is register, not wording: say what SURVIVED (名前は伊賀に / 紙は甲賀に) and leave the
        // road open in the same breath. That IS the chapter — 「わからない」 is the payoff, not a
        // hedge on it. The creed likewise speaks as 「記録の 中の きみ」 (ch1 1-d's move), so it reports
        // what the record holds rather than narrating an act on a road the player may not have
        // walked, and says 手がかりの ひとつ: the 甲賀 case rests on several documents plus terrain
        // arguments (research §3-11), and shrinking a composite argument to one sheet would undercut
        // clue-3's own lesson in the very line meant to land it.
        '3-d': { place: '第3章 むすび',
          text: `<p>三河に 着いた きみは、すぐに 兵を 集め、<ruby>光秀<rt>みつひで</rt></ruby>を 討ちに 西へ 向かった。——が、道の 途中で しらせが 来る。<ruby>羽柴秀吉<rt>はしば ひでよし</rt></ruby>が、もう 光秀を 討った。</p>
            <p>きみが 山を 走って いた 数日で、天下は べつの 男の 手に 動いて いた。</p>
            <p>この 逃げ道は、のちに「<ruby>神君伊賀越<rt>しんくん いがご</rt></ruby>え」と 呼ばれる。だが 四百年 たっても、伊賀を 通ったと 書いた その ころの 紙は 出て こない。出て きたのは、<ruby>甲賀<rt>こうが</rt></ruby>の 家に つたわる、きみの <ruby>誓<rt>ちか</rt></ruby>いの 紙 だった。——<b>名前は 伊賀に つき、紙は 甲賀に 残る。どちらが きみの 道かは、いまも わかって いない</b>。</p>
            <p><ruby>忍者<rt>にんじゃ</rt></ruby>は かっこいい。ただ、その 話を 書いたのは 忍者の 家 自身だった。それでも、<b>きみが 山を こえて 生きて 帰った ことだけは 消えない</b>。三つめの <ruby>手<rt>て</rt></ruby>がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に 入った。</p>`,
          creed: { line: '「<ruby>助<rt>たす</rt></ruby>けて もらったら、<ruby>紙<rt>かみ</rt></ruby>に 書いて わたす。——<ruby>約束<rt>やくそく</rt></ruby>は、まもる。」',
            act: '——口で 言うだけなら、あとに 何も 残らない。<ruby>記録<rt>きろく</rt></ruby>の 中の きみは、この 逃げ道の あいだにも <ruby>誓<rt>ちか</rt></ruby>いの 紙を 書き、名を 入れて わたして いる。それが「<ruby>律儀者<rt>りちぎもの</rt></ruby>」と 呼ばれる 男の やり方だ。そして 四百年 のち、その 紙が <ruby>研究者<rt>けんきゅうしゃ</rt></ruby>の <ruby>手<rt>て</rt></ruby>がかりの ひとつに なった。' },
          onEnter: { clues: ['clue-3'] },
          end: true },
      },
    },
    {
      // design §2 章カルテ: peel the「たえしのぶ律儀者」image by re-showing the submission as a
      // power transaction (research §3-13): he WON at 長久手, held out two years while Hideyoshi
      // escalated (son-as-hostage mirror of ch1 → sister → mother), and only then bowed. Register
      // decisions this chapter makes:
      //
      // 1) ★DEVICE: design §2 named「人の図（主君遍歴）」, but Figure has exactly two kinds
      //    (assembly/lineage) and a lord-by-lord timeline is neither; the RelationsPane's gold
      //    shukun band already carries 今川→信長→秀吉 as a shape. Per WRITING「新規装置は最小限」
      //    the chapter's device is instead the 謁見 closeup — the base faces already tell it
      //    (laughing 人たらし vs the unreadable @lord face the 律儀者 label sticks to) — plus the
      //    fork's 複眼 (the same event readable two ways), which is what clue-4 teaches anyway.
      // 2) ★FORK SHAPE (register ⑥): ch1/ch2 young-pushes-old-restrains, ch3 both-push. Here the
      //    axis is pride vs house — the YOUNG voice refuses (「なぜ 勝った 側が 下げるのです」), the
      //    OLD voice says go (義理) — and the real pressure is the enemy bowing FIRST, in escalating
      //    installments (sister, then mother). A1 tension: the child just won at 長久手 in 4-a.
      // 3) ★THE DEBUNK (one per chapter, register ⑥): the famous 前夜「頭を下げてくれ」dialogue.
      //    Two-layer split per research §3-14: the visit/hand-taking/sake are staged in the main
      //    line as fact (『家忠日記』, contemporary), the DIALOGUE is the ☆ spark/deep — and its
      //    source is 御実紀附録 §「秀吉権詐」, the shogunate's own hagiography: riddle B's machine
      //    (the 神君 image being built) caught in the act, foreshadowing ch7's w-jikki card.
      // 4) ★HEAT (BACKLOG 宿題: voices carry the heat): 秀吉 gets two voiced beats — the
      //    diary-backed night visit and the staged 妹むこ declaration (creative, —気がした). The
      //    wound is 数正's defection (the man beside him since the hostage years, gone with the
      //    army's insides). 朝日姫's cost (44, married off eastward) reads in one line; her
      //    divorce lore is △〜☆ (research §3-13) so the main line does not touch it.
      id: 4, num: '四', title: '頭を 下げる', years: '1584〜1590',
      lead: '渡り合った 相手に、頭を 下げる。そして、見も 知らぬ 関東へ 移れと 言われる。',
      start: '4-a',
      teaser: '<ruby>秀吉<rt>ひでよし</rt></ruby>が 死んだ。天下 分け目の 一日が、近づいて くる。',
      scenes: {
        '4-a': { place: '<ruby>尾張<rt>おわり</rt></ruby>・<ruby>長久手<rt>ながくて</rt></ruby>',
          monologue: '（<ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子と いう あの 男が……いま、天下の 顔を して いる。）',
          text: `<p>あれから 二年。<ruby>光秀<rt>みつひで</rt></ruby>を 討った <face pid="p-hideyoshi"><ruby>羽柴秀吉<rt>はしば ひでよし</rt></ruby></face>が、<ruby>信長<rt>のぶなが</rt></ruby>の 城も 家来も、つぎつぎ 自分の ものに して いた。</p>
            <p>信長の 子・<ruby>信雄<rt>のぶかつ</rt></ruby>が、助けを 求めて きた。父の 家来だった 男が、<ruby>織田<rt>おだ</rt></ruby>の 家を のっとろうと して いる、と。きみは 兵を 出した。</p>
            <p><ruby>長久手<rt>ながくて</rt></ruby>の 野で、きみは 秀吉方の 軍を 破る。名だたる 大将が <ruby>討<rt>う</rt></ruby>ち死にし、徳川の 名は 天下に ひびいた。</p>
            <p>ところが——当の 信雄が、きみに 何も 言わず 秀吉と <ruby>講和<rt>こうわ</rt></ruby>して しまう。戦う 理由だけが、ふいに 消えた。</p>`,
          onEnter: { cards: ['w-komaki', 'p-hideyoshi'] },
          next: '4-b' },

        '4-b': { place: '<ruby>遠江<rt>とおとうみ</rt></ruby>・<ruby>浜松城<rt>はままつじょう</rt></ruby>',
          monologue: '（……勝った はずだ。なのに なぜ、こちらが <ruby>削<rt>けず</rt></ruby>られて いく。）',
          text: `<p><ruby>秀吉<rt>ひでよし</rt></ruby>は、力ずくで つぶしに こなかった。かわりに、あの手この手が 伸びて くる。</p>
            <p><ruby>講和<rt>こうわ</rt></ruby>の しるしに、きみは 次男を 秀吉の <ruby>養子<rt>ようし</rt></ruby>に 出した。かつての きみと 同じ、しるしの 子だ。</p>
            <p>次の 年の 暮れ、<ruby>家老<rt>かろう</rt></ruby>の <ruby>石川数正<rt>いしかわ かずまさ</rt></ruby>が 消えた。<ruby>人質<rt>ひとじち</rt></ruby>の ころから きみの そばに いた 男が、軍の 中身ごと、秀吉の もとへ 走ったのだ。</p>
            <p>それでも きみが 動かないと、四十四に なる 妹・<ruby>朝日姫<rt>あさひひめ</rt></ruby>を 妻に よこし、母までを <ruby>岡崎<rt>おかざき</rt></ruby>へ 送って きた。家臣は、まっぷたつに 割れた。</p>
            <p class="speak">「母ぎみまで 出された 上は、行かねば こちらが <ruby>義<rt>ぎ</rt></ruby>を 欠きまする」</p>
            <p class="speak">「<ruby>長久手<rt>ながくて</rt></ruby>で 勝ったのは <ruby>殿<rt>との</rt></ruby>にて ござる！ なぜ 勝った 側が 下げるのです。大坂で 何か あれば、助けは 間に合いませぬ」</p>`,
          q: '<ruby>勝<rt>か</rt></ruby>った 相手に、きみは 頭を 下げられるか？',
          choices: [
            { label: '大坂へ 行き、頭を 下げる', to: '4-c', canon: true, effect: { matsu: 2 },
              hist: { verdict: '史実では', match: '行った。頭を 下げ、そして 生きて 帰った',
                body: `<p>きみは 大坂へ 向かった。この 旅が どんな <ruby>芝居<rt>しばい</rt></ruby>に なったかは、つぎの 場面で 見る ことに なる。</p><p>ひとつだけ 先に 言って おこう——きみは ぶじに 帰り、<ruby>母君<rt>ははぎみ</rt></ruby>も ぶじに 帰った。戦は 消えた。その かわり きみは、これから 頭を 下げた 相手の 天下で 生きて いく。</p>` } },
            { label: '行かず、<ruby>戦<rt>いくさ</rt></ruby>の <ruby>支度<rt>したく</rt></ruby>を つづける', to: '4-c', effect: { yuzuranu: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 戦って いたら……',
                body: `<p>この 年の はじめの 夜ふけ、<ruby>浜松<rt>はままつ</rt></ruby>の きみも、揺れで 目を さました はずだ。<ruby>大地震<rt>おおじしん</rt></ruby>だ。やがて 西から しらせが とどく——秀吉の 国々では <ruby>石垣<rt>いしがき</rt></ruby>が くずれ、まる焼けに なった 城さえ ある、と。「家康攻めの <ruby>支度<rt>したく</rt></ruby>は これで 止まった」と 見る 研究者も いる。戦うなら、いまが その ときだった かもしれない。</p><p>だが、くずれた 城は 建て直せる。銭も 米も 兵も、時が たつほど 向こうに 積み上がる。——<ruby>史実<rt>しじつ</rt></ruby>の きみは、行く ほうを えらんだ。ちなみに この 夜の 揺れを、きみの 家来・<ruby>松平家忠<rt>まつだいら いえただ</rt></ruby>が 日記に つけて いた。この 日記、すぐ また 出て くる。</p>` } },
          ] },

        '4-c': { place: '大坂・<ruby>秀長<rt>ひでなが</rt></ruby>の 屋敷',
          text: `<p>1586年10月、きみは 大坂に 入った。宿は、秀吉の 弟・<face pid="p-hidenaga"><ruby>秀長<rt>ひでなが</rt></ruby></face>の 屋敷だ。</p>
            <p>その 夜の ことを、<ruby>供<rt>とも</rt></ruby>の <ruby>松平家忠<rt>まつだいら いえただ</rt></ruby>が 日記に 残した。——秀吉は 待ちかねた ように みずから 現れ、きみの 手を 取って 奥の 間へ。酒に なり、うちとけた、と。</p>
            <p>頭を 下げさせる 側が、前の 夜に 自分から 来る。奥の 間で 何が 語られたのか、日記は そこまで 書いて いない。</p>`,
          spark: 'え！？ その 奥の 間で、天下人の ほうが 頭を 下げた——「明日は みなの 前で、わしに 頭を 下げて みせて くれ」と <ruby>頼<rt>たの</rt></ruby>んだ、という 話が ある。書き残したのは、だれ？',
          deep: { q: 'あの「前の 夜」の 話、ほんとう？',
            body: `秀吉が 来て、手を 取り、酒に なった。ここまでは たしかだ。その 場に <ruby>供<rt>とも</rt></ruby>を した <ruby>侍<rt>さむらい</rt></ruby>の 日記『<ruby>家忠日記<rt>いえただにっき</rt></ruby>』に あるからだ。だが「頭を 下げて くれ」と <ruby>頼<rt>たの</rt></ruby>んだ 話は、この 日記には 無い。出て くるのは、200年 以上 のち。<ruby>徳川<rt>とくがわ</rt></ruby>の <ruby>幕府<rt>ばくふ</rt></ruby> 自身が 編んだ 家康の 一代記、『<ruby>東照宮御実紀<rt>とうしょうぐう ごじっき</rt></ruby>』の おまけの 巻だ。題は ずばり「秀吉の はかりごと」。天下人さえ 家康には ひそかに 頭を 下げた——そう 語る、家康を 上げる 側の 本だ。たしかさマークは ☆（たしかめられない）。`,
            cite: '※ この 話で 得を するのは、だれだろう。——書いた 側を 見ると、話の 向きが 見えて くる。',
            confidence: '☆' },
          onEnter: { cards: ['p-hidenaga'] },
          next: '4-c2' },

        '4-c2': { place: '大坂城・<ruby>大広間<rt>おおひろま</rt></ruby>',
          closeup: { tone: 'tense', cast: [ { face: 'p-ieyasu@lord', name: '家康（きみ）' }, { face: 'p-hideyoshi', name: '豊臣秀吉' } ] },
          monologue: '（<ruby>両手<rt>りょうて</rt></ruby>の 下で、<ruby>床<rt>ゆか</rt></ruby>が 冷たい。……これは 負けか。それとも、勝ちの つづきか。）',
          text: `<p>あくる 日、<ruby>大広間<rt>おおひろま</rt></ruby>。居ならぶ 大名たちの まん中を 進み、きみは 両手を ついて、深く 頭を 下げた。——<ruby>長久手<rt>ながくて</rt></ruby>で 天下人の 軍を 破った、その 男が。</p>
            <p>静まりかえった 広間に、<ruby>秀吉<rt>ひでよし</rt></ruby>の 声が ひびいた——気が した。</p>
            <p class="speak">「徳川どのは わしの <ruby>妹<rt>いもうと</rt></ruby>むこ、もう 身内じゃ。のう みなの 衆、これで 東は かたづいたわい！」</p>`,
          next: '4-d' },

        '4-d': { place: '第4章 むすび',
          text: `<p>それから 四年。1590年、<ruby>小田原<rt>おだわら</rt></ruby>の <ruby>北条<rt>ほうじょう</rt></ruby>を たおした <ruby>秀吉<rt>ひでよし</rt></ruby>から、<ruby>陣中<rt>じんちゅう</rt></ruby>の きみに 命が 下る。——先祖 代々の <ruby>三河<rt>みかわ</rt></ruby>も <ruby>駿河<rt>するが</rt></ruby>も <ruby>返上<rt>へんじょう</rt></ruby>して、<ruby>関東<rt>かんとう</rt></ruby>へ 移れ、と。</p>
            <p>きみは、うけた。</p>
            <p>これを「体の いい 追い出し」と 書く 本が ある。「東国 まるごとの 大ばってき」と 書く 本も ある。——おなじ 出来事が、だ。</p>
            <p>のちの 世は、この きみを「たえしのぶ <ruby>律儀者<rt>りちぎもの</rt></ruby>」と 呼ぶ。だが ならべて みよ。<ruby>長久手<rt>ながくて</rt></ruby>で 勝ち、二年 ねばり、相手に 妹と 母まで 出させて から、下げた。<b>下げたのは 頭で、まもったのは 家だ</b>——そう 見るか、たえしのんだと 見るか。決めるのは きみだ。四つめの <ruby>手<rt>て</rt></ruby>がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に 入った。</p>`,
          deep: { q: '<ruby>江戸<rt>えど</rt></ruby>行きは、<ruby>罰<rt>ばつ</rt></ruby>だったの？',
            body: `<ruby>石高<rt>こくだか</rt></ruby>で 見れば、150万石から 240万石への 大きな <ruby>加増<rt>かぞう</rt></ruby>だ。ただし 都からは 遠く、<ruby>京<rt>きょう</rt></ruby>・大坂の <ruby>政治<rt>せいじ</rt></ruby>の 輪からは 外れる。長く「秀吉の 体の いい 追い出し」と 語られて きたが、近ごろは「東国 ぜんぶの おさえを、信用できる 家康に まかせた——ふたりとも 得を した 取引」と 見る 研究が 有力だ。「<ruby>江戸<rt>えど</rt></ruby>は 何も ない 村だった」と いう 話も 見直されて いる——海と 川の 交わる <ruby>湊<rt>みなと</rt></ruby>の 町で、じつは 関東の 要所だった、と。たしかさマークは ○（だいたい たしか）。`,
            cite: '※ <ruby>左遷<rt>させん</rt></ruby>か、<ruby>栄転<rt>えいてん</rt></ruby>か。——「どの 立場から 見た 話か」を たしかめると、両方が 見えて くる。',
            confidence: '○' },
          creed: { line: '「<ruby>約束<rt>やくそく</rt></ruby>は、たがえぬ。——たがえぬ まま、大きく なる。」',
            act: '——きみは 言われた とおり 関東へ 移り、<ruby>江戸<rt>えど</rt></ruby>の 町づくりを 始めた。新しい 国の 仕組みを まかせた 中には、若い ころ <ruby>一揆<rt>いっき</rt></ruby>で きみに そむき、ゆるされて もどった 男・<ruby>本多正信<rt>ほんだ まさのぶ</rt></ruby>も いた。そして きみは、秀吉が 生きて いる あいだ、一度も そむかなかった。——そむかない まま、徳川は 東で、豊臣より 大きく なって いく。' },
          onEnter: { cards: ['p-masanobu', 'w-kanto'], clues: ['clue-4'] },
          end: true },
      },
    },
    {
      // Written against the ch2 pilot register. Design §2 章五: the chapter must NOT run the
      // 「え！？→実は」debunk shape a fifth time (the read-through test caught players predicting
      // it) — the 小早川 turncoat is a LIVE scholarly fight (research §3-10, 白峰 vs 笠谷; assert
      // neither). So the main line narrates only what both camps agree on (he was nominally west
      // and attacked west; 毛利 sat still by a prior, surviving oath; the day was short) and never
      // puts a clock on the betrayal; spark/deep open the controversy AS a controversy (△). The
      // fork is the tempo gamble — strike without 秀忠's 38,000 — whose canon resolution pays off
      // the 5-b deep (the fight was half-won on paper: ~180 letters, the 毛利 non-move deal).
      id: 5, num: '五', title: '天下 分け目', years: '1600',
      lead: '関ヶ原。勝負は 一日で ついた。——ほんとうに、あの 裏切りの おかげで？',
      start: '5-a',
      teaser: 'いちばん 長く 仕えた <ruby>主家<rt>しゅけ</rt></ruby>が、まだ 大坂に ある。きみは どうする？',
      scenes: {
        '5-a': { place: '<ruby>山城<rt>やましろ</rt></ruby>・<ruby>伏見城<rt>ふしみじょう</rt></ruby>',
          monologue: '（六さいの <ruby>主君<rt>しゅくん</rt></ruby>に、この <ruby>乱世<rt>らんせい</rt></ruby>が おさめられるか。……「たのむ」と 言われた ものは、豊臣の 家か。それとも、天下の 静けさか。）',
          text: `<p><ruby>秀吉<rt>ひでよし</rt></ruby>が 死んだ。1598年。「<ruby>秀頼<rt>ひでより</rt></ruby>を たのむ」と、くり返し 書き残して。あとつぎの 秀頼は、まだ 六さいだった。</p>
            <p>きみは 五人の <ruby>大老<rt>たいろう</rt></ruby>——秀吉が あとの 世を たくした 大大名の、<ruby>筆頭<rt>ひっとう</rt></ruby>だ。その きみが、動く。大名どうしが <ruby>縁組<rt>えんぐみ</rt></ruby>で <ruby>勝手<rt>かって</rt></ruby>に 手を 組む ことを、秀吉は <ruby>禁<rt>きん</rt></ruby>じて いた。その 縁組を、きみは だれにも <ruby>断<rt>ことわ</rt></ruby>らず、次々と 進めたのだ。「お<ruby>定<rt>さだ</rt></ruby>めに そむく」と、とがめる 声が 上がる。</p>
            <p>その 声の まん中に、<face pid="p-mitsunari"><ruby>石田三成<rt>いしだ みつなり</rt></ruby></face>が いた。米と 銭と 書きもので、秀吉の 天下を 回して きた 男。きみを 見すえて 言った——気が した。</p>
            <p class="speak">「天下は、豊臣の もの。<ruby>秀頼<rt>ひでより</rt></ruby>さまの ものに ござる。——お忘れか」</p>`,
          onEnter: { cards: ['p-mitsunari'] },
          next: '5-b' },

        '5-b': { place: '<ruby>美濃<rt>みの</rt></ruby>・<ruby>赤坂<rt>あかさか</rt></ruby>の <ruby>陣<rt>じん</rt></ruby>',
          monologue: '（<ruby>元忠<rt>もとただ</rt></ruby>……。<ruby>伏見<rt>ふしみ</rt></ruby>を <ruby>捨<rt>す</rt></ruby>て<ruby>城<rt>じろ</rt></ruby>——落ちると わかって いて 残す 城に すると 決めたのは、この わしだ。この <ruby>戦<rt>いくさ</rt></ruby>に 負ければ、あれは <ruby>犬死<rt>いぬじ</rt></ruby>にに なる。）',
          text: `<p>二年後の 秋。きみは <ruby>美濃<rt>みの</rt></ruby>・<ruby>赤坂<rt>あかさか</rt></ruby>の <ruby>陣<rt>じん</rt></ruby>に いた。<ruby>会津<rt>あいづ</rt></ruby>の <ruby>上杉<rt>うえすぎ</rt></ruby>を 討ちに 東へ 向かった すきに、<ruby>三成<rt>みつなり</rt></ruby>が 西で 兵を 挙げた。きみは 軍を 返して きたのだ。</p>
            <p>るすを あずけた <ruby>伏見城<rt>ふしみじょう</rt></ruby>は、落ちた。守って 死んだのは <ruby>鳥居元忠<rt>とりい もとただ</rt></ruby>。<ruby>駿府<rt>すんぷ</rt></ruby>の <ruby>人質<rt>ひとじち</rt></ruby>の ころから、ずっと そばに いた 男だ。</p>
            <p>目の 前、<ruby>大垣城<rt>おおがきじょう</rt></ruby>には 西軍。だが、あとつぎの <ruby>秀忠<rt>ひでただ</rt></ruby>が ひきいる 徳川の <ruby>本隊<rt>ほんたい</rt></ruby> 三万八千は、別の 道で おくれ、まだ 着かない。</p>
            <p>家臣たちは、また 割れた。</p>
            <p class="speak">「<ruby>本隊<rt>ほんたい</rt></ruby> ぬきの <ruby>決戦<rt>けっせん</rt></ruby>なぞ。負ければ、徳川は 終わりですぞ」</p>
            <p class="speak">「日を おく ほうが こわい。<ruby>先手<rt>さきて</rt></ruby>の 大名がたは、みな 豊臣に <ruby>恩<rt>おん</rt></ruby>の ある 方々——心の 内までは、しばれませぬ」</p>`,
          q: '<ruby>秀忠<rt>ひでただ</rt></ruby>の 三万八千 ぬきで——きみは、しかけられるか？',
          choices: [
            { label: '待たずに、しかける', to: '5-c', canon: true, effect: { hito: 2 },
              hist: { verdict: '史実では', match: 'しかけた。天下 分け目は、一日で 終わる',
                body: `<p>きみは 待たなかった。夜、雨の 中を 軍は <ruby>関ヶ原<rt>せきがはら</rt></ruby>へ 進む。西軍も <ruby>大垣城<rt>おおがきじょう</rt></ruby>を 出て、おなじ <ruby>盆地<rt>ぼんち</rt></ruby>に <ruby>陣<rt>じん</rt></ruby>を しいた。</p><p><ruby>本隊<rt>ほんたい</rt></ruby> ぬきで、なぜ 勝てると 見たのか。——きみには、<ruby>戦場<rt>せんじょう</rt></ruby>の そとで 積み上げた「数」が あった。夜が 明ければ、それが 見えて くる。</p>` } },
            { label: '<ruby>秀忠<rt>ひでただ</rt></ruby>の <ruby>本隊<rt>ほんたい</rt></ruby>を 待つ', to: '5-c', effect: { matsu: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 待って いたら……',
                body: `<p>その 夜、<ruby>物見<rt>ものみ</rt></ruby>が 駆けこんで きた。「<ruby>松尾山<rt>まつおやま</rt></ruby>に あたらしい 軍！ <ruby>旗<rt>はた</rt></ruby>じるしは <ruby>小早川<rt>こばやかわ</rt></ruby>、およそ 一万五千」——どちらの 味方かと 問うても、だれも 答えられない。あの 山は、<ruby>戦場<rt>せんじょう</rt></ruby> ぜんたいを 見おろす 場所に ある。</p><p>待つ 一日ごとに、豊臣に <ruby>恩<rt>おん</rt></ruby>の ある 大名たちの 心は 読めなく なって いく。——<ruby>史実<rt>しじつ</rt></ruby>の きみは、待たなかった。夜の うちに 軍を 動かし、<ruby>決戦<rt>けっせん</rt></ruby>は あくる 9月15日に なる。松尾山の <ruby>旗<rt>はた</rt></ruby>の ぬしが 何を するかは、まだ だれも 知らない。</p>` } },
          ],
          deep: { q: 'なぜ「<ruby>本隊<rt>ほんたい</rt></ruby> ぬきでも 勝てる」と 思えたの？',
            body: `<ruby>会津<rt>あいづ</rt></ruby>から 引き返して からの 二か月、きみと 家来たちは、全国の 大名に 手紙を 書きまくって いた。きみの 名前の 手紙だけで、150通あまりが 今に 知られる。「味方すれば <ruby>領地<rt>りょうち</rt></ruby>は 守る」——<ruby>戦場<rt>せんじょう</rt></ruby>の そとで、味方の 数を 積み上げる 仕事だ。西軍の <ruby>大黒柱<rt>だいこくばしら</rt></ruby>・<ruby>毛利<rt>もうり</rt></ruby>からは「動かない」という 約束を、戦の 前に 取りつけて さえ いた。その <ruby>誓<rt>ちか</rt></ruby>いの 紙は、いまも 残って いる（たしかさマーク ◎＝<ruby>実物<rt>じつぶつ</rt></ruby>の 紙が 残る）。`,
            cite: '※ 天下 分け目の 勝負の 半分は、戦の 前に「紙の 上」で ついて いた。',
            confidence: '◎' } },

        '5-c': { place: '<ruby>美濃<rt>みの</rt></ruby>・<ruby>関ヶ原<rt>せきがはら</rt></ruby>',
          monologue: '（ふかい <ruby>霧<rt>きり</rt></ruby>だ。敵も 味方も、まだ 白の 中に いる。）',
          text: `<p>9月15日、明け方。<ruby>関ヶ原<rt>せきがはら</rt></ruby>の <ruby>盆地<rt>ぼんち</rt></ruby>は、ふかい <ruby>霧<rt>きり</rt></ruby>の 底に あった。霧が 引くと、<ruby>鉄砲<rt>てっぽう</rt></ruby>の 音が 走った。</p>
            <p>西軍の <ruby>大黒柱<rt>だいこくばしら</rt></ruby>・<ruby>毛利勢<rt>もうりぜい</rt></ruby>は、南の 山から 動かなかった。——戦の 前に、「動かぬ」約束が できて いたのだ。そして、西軍の はずの <face pid="p-hideaki"><ruby>小早川秀秋<rt>こばやかわ ひであき</rt></ruby></face>、およそ 一万五千が <ruby>松尾山<rt>まつおやま</rt></ruby>を 下り、西軍の よこ<ruby>腹<rt>ばら</rt></ruby>に 攻めかかる。</p>
            <p>——十九の 若者が、その 山の 上で 何を 思って いたのか。心の 内を 書きのこした 紙は、見つかって いない。</p>
            <p>昼すぎには、勝負は 見えて いた。天下 分け目と 呼ばれた 戦いは、ふたを 開ければ、あっけない ほど 早く——たった 一日で 終わった。</p>`,
          spark: 'え！？ 「<ruby>小早川<rt>こばやかわ</rt></ruby>は 昼まで まよい、<ruby>家康<rt>いえやす</rt></ruby>が <ruby>鉄砲<rt>てっぽう</rt></ruby>を 撃ちかけさせて、やっと <ruby>寝返<rt>ねがえ</rt></ruby>った」——だれもが 語って きた この 場面、じつは「いつ 寝返ったのか」を めぐって、<b>いま も</b> 学者どうしが <ruby>論文<rt>ろんぶん</rt></ruby>で たたかって いる。まだ、<ruby>決着<rt>けっちゃく</rt></ruby>して いない。',
          deep: { q: '「<ruby>寝返<rt>ねがえ</rt></ruby>りの 時こく」で、なぜ 今も もめて いるの？',
            body: `手がかりの 一つは、戦いの 二日 あとの 日づけで、徳川方の <ruby>家臣<rt>かしん</rt></ruby> 二人が 書いた 手紙（<ruby>写<rt>うつ</rt></ruby>しが 残る）。「戦いが 始まると すぐ、<ruby>小早川<rt>こばやかわ</rt></ruby>どのらは <ruby>寝返<rt>ねがえ</rt></ruby>った」と 読める。ここから「昼の <ruby>劇的<rt>げきてき</rt></ruby>な 寝返りも、<ruby>問<rt>と</rt></ruby>い<ruby>鉄砲<rt>てっぽう</rt></ruby>も、のちの <ruby>軍記<rt>ぐんき</rt></ruby>が もり上げた 場面では？」と となえる 学者が 現れ、「いや、撃ちかけは あった」と <ruby>反論<rt>はんろん</rt></ruby>する 学者も いて、<ruby>論争<rt>ろんそう</rt></ruby>は 今も つづく。きみの 教科書の この ページは、書きかわる <ruby>途中<rt>とちゅう</rt></ruby>かも しれない。たしかさマークは △（<ruby>説<rt>せつ</rt></ruby>が わかれる——それも、いま まさに）。`,
            cite: '※ 歴史は「決まった 話」の <ruby>倉庫<rt>そうこ</rt></ruby>では ない。紙 一枚で、いまも 動く。',
            confidence: '△' },
          // Main visual = the 布陣 board (works/ieyasu/figures.ts): the theater is smaller than
          // the scene map can resolve, and the board must not draw the betrayal's clock (△).
          figure: 'sekigahara',
          onEnter: { cards: ['w-sekigahara', 'p-hideaki'] },
          next: '5-d' },

        '5-d': { place: '第5章 むすび',
          monologue: '（<ruby>三成<rt>みつなり</rt></ruby>。おぬしは、わしを にくんで いたのか。それとも——まもりたい ものが、ちがって いた だけなのか。）',
          text: `<p><ruby>三成<rt>みつなり</rt></ruby>は とらえられ、京で <ruby>処刑<rt>しょけい</rt></ruby>された。西軍に ついた 家々の <ruby>領地<rt>りょうち</rt></ruby>は 取り上げられ、勝った 側に 配られる。天下の 地図が、一日の 戦で 塗りかわった。</p>
            <p>三年後、きみは <ruby>征夷大将軍<rt>せいい たいしょうぐん</rt></ruby>と なり、江戸に <ruby>幕府<rt>ばくふ</rt></ruby>を ひらく。</p>
            <p>では、豊臣は？ ——ほろぼされて いない。<ruby>秀頼<rt>ひでより</rt></ruby>は 六十五<ruby>万石<rt>まんごく</rt></ruby>の 大名として 大坂城に 残り、きみは 約束どおり、孫むすめの <ruby>千姫<rt>せんひめ</rt></ruby>を 秀頼に とつがせた。</p>
            <p>「<ruby>律儀者<rt>りちぎもの</rt></ruby>」は、まだ <ruby>律儀<rt>りちぎ</rt></ruby>の 形の 中に いる。この 男が <ruby>主家<rt>しゅけ</rt></ruby>に 手を かける 日まで、あと 十二年。——五つめの <ruby>手<rt>て</rt></ruby>がかり、「まだ <ruby>決着<rt>けっちゃく</rt></ruby>して いない」という 手がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に 入った。</p>`,
          creed: { line: '「<ruby>戦<rt>いくさ</rt></ruby>は、始まる 前に すんで いる。」',
            act: '——<ruby>関ヶ原<rt>せきがはら</rt></ruby>で 刀が ぬかれる 前に、きみの <ruby>筆<rt>ふで</rt></ruby>は もう、<ruby>戦<rt>いくさ</rt></ruby>を 半分 終わらせて いた。その 筆が 十二年 後、どこへ 向かうのか。——まだ、だれも 知らない。' },
          deep: { q: '<ruby>関ヶ原<rt>せきがはら</rt></ruby>に おくれた <ruby>秀忠<rt>ひでただ</rt></ruby>は、どう なったの？',
            body: `おくれの わけは、川の <ruby>増水<rt>ぞうすい</rt></ruby>で 出発の 命令じたいが おそく とどいた ことなど、運の わるさの 重なりだった。きみは 秀忠を あとつぎから 外さず、五年後には <ruby>将軍<rt>しょうぐん</rt></ruby>の <ruby>位<rt>くらい</rt></ruby>を ゆずって、自分は <ruby>大御所<rt>おおごしょ</rt></ruby>と して うしろに 立った。「おくれた まぬけな あとつぎ」と わらう 話は、あとの 世で 盛られた ものと みられる。たしかさマークは ○。`,
            cite: '※ 話を 盛られるのは、負けた 側だけでは ない。',
            confidence: '○' },
          onEnter: { clues: ['clue-5'] },
          end: true },
      },
    },
    {
      // Written against the ch2 pilot register. Design §2 章六: the peak of the A-mystery's
      // 割り切れなさ, and the work's maximum danger of assertion (方広寺の内心・信康事件の真因 are
      // both undecidable — research §3-9/§3-12/§3-16). The chapter therefore asserts EVENTS only
      // and houses every verdict in deeps marked △. The 多層 reveal of the design ships as
      // reveal (the four characters) + spark + a three-layer deep: 「言いがかり」通説 → 諱の非礼(○)
      // → 内心は紙に残らない(△). The fork (ほろぼすか 生かすか) runs on the clock: the man who
      // won by waiting has outlived waiting itself — the もしも is the road he had already
      // walked for 14 years. 6-d folds in 築山殿・信康 (1579, timeline rows exist) as the older
      // wound the fall of Osaka reopens; cause stays △ (信長命令説 vs 家康判断説, both held).
      // The 冬の陣 moat-filling deliberately stays at the bare treaty fact — the「だまし討ち」
      // framing is itself a later construct (research §3-16) and reproducing it would be a △
      // assertion. Heat (BACKLOG 宿題)=淀殿's defiance (気がした-marked), the split retainers,
      // 千姫, and the second-person knife 「つぶしたのは、きみだ」.
      id: 6, num: '六', title: '主家を ほろぼす', years: '1614〜1615',
      lead: '鐘に きざまれた 四つの 字から、戦国 最後の 大いくさが 始まる。',
      start: '6-a',
      teaser: 'やがて <ruby>家康<rt>いえやす</rt></ruby>は 死に、そして「<ruby>神<rt>かみ</rt></ruby>」に なる。その すがたを 描いたのは、だれ？',
      scenes: {
        '6-a': { place: '<ruby>山城<rt>やましろ</rt></ruby>・<ruby>方広寺<rt>ほうこうじ</rt></ruby>',
          monologue: '（七十三に なった。……<ruby>秀吉<rt>ひでよし</rt></ruby>どのが 死んだ <ruby>年<rt>とし</rt></ruby>を、もう こえて しまった。三年前に 会った <ruby>秀頼<rt>ひでより</rt></ruby>は、みごとな <ruby>若殿<rt>わかとの</rt></ruby>に 育って いた。——それを、わしは よろこべなかった。）',
          text: `<p><ruby>関ヶ原<rt>せきがはら</rt></ruby>から 十四年。大坂の <face pid="p-hideyori"><ruby>秀頼<rt>ひでより</rt></ruby></face>は 二十二に なり、父・<ruby>秀吉<rt>ひでよし</rt></ruby>の 建てた 京の <ruby>大仏<rt>だいぶつ</rt></ruby>を 建て直した。寺に 大きな <ruby>鐘<rt>かね</rt></ruby>が 上がり、いわいの 文が きざまれる。——めでたい 話の はずだった。</p>
            <p>その 文の 中の 四文字が、<ruby>駿府<rt>すんぷ</rt></ruby>の きみの もとで、問題に なる。「国家安康」。きみの 名前が、「安」の 字で 二つに 切って ある。——のろいでは ないか、と 言う。</p>
            <p>きみは <ruby>将軍<rt>しょうぐん</rt></ruby>の <ruby>位<rt>くらい</rt></ruby>を 二年で <ruby>秀忠<rt>ひでただ</rt></ruby>に ゆずり、<ruby>駿府<rt>すんぷ</rt></ruby>から 天下を 見て いる <ruby>大御所<rt>おおごしょ</rt></ruby>だ。三年前には 京で 一度、大人に なった 秀頼に 会って いる。</p>`,
          reveal: { title: '「<ruby>国家安康<rt>こっか あんこう</rt></ruby>」',
            caption: '<ruby>鐘<rt>かね</rt></ruby>に きざまれた 文の 中の 四文字。「家」と「康」の あいだに 「安」の 字が 入り——「<ruby>家康<rt>いえやす</rt></ruby>」の 名が、二つに 切られて いる。' },
          spark: 'え！？ 名前が 切れて いる——それだけの ことが、天下を ゆるがす <ruby>戦<rt>いくさ</rt></ruby>の きっかけに なるの？',
          deep: { q: 'この 四文字は、ほんとうに「のろい」なの？',
            body: `あとの 世では「言いがかりだ」と 語られる ことが 多い。だが 当時は、目上の 人の <ruby>実名<rt>じつめい</rt></ruby>を ことわりなく 文に 書きこむ こと自体が、大きな <ruby>非礼<rt>ひれい</rt></ruby>だった——えらい 人は 名前では なく、<ruby>役職<rt>やくしょく</rt></ruby>で 呼ぶのが <ruby>作法<rt>さほう</rt></ruby>だった。京の えらい <ruby>僧<rt>そう</rt></ruby>たちに 意見を 聞くと、答えは「書き方に 手落ちは ある。ただし、のろいとまでは 言えない」。では、きみ（家康）の 心は どうか。書き直させて すませる つもりだったのか、<ruby>戦<rt>いくさ</rt></ruby>の 口実に する つもりだったのか——やりとりの 記録は 残って いるのに、心の 内だけは、どの 紙にも 書いて ない。たしかさマークは △（記録は ある。心が ない）。`,
            cite: '※ 事件は 紙に 残る。心は、紙に 残らない。',
            confidence: '△' },
          onEnter: { cards: ['p-hideyori', 'w-houkouji'] },
          next: '6-b' },

        '6-b': { place: '<ruby>駿河<rt>するが</rt></ruby>・<ruby>駿府城<rt>すんぷじょう</rt></ruby>',
          monologue: '（わしは 生涯、「待つ」で 勝って きた。……その「待つ」が、はじめて わしの 敵に 回る。わしには もう、待つ ための 年月が ない。）',
          text: `<p>話し合いは、こわれた。大坂城は 米を 買いこみ、<ruby>牢人<rt>ろうにん</rt></ruby>——<ruby>主家<rt>しゅけ</rt></ruby>を 失った <ruby>侍<rt>さむらい</rt></ruby>たちを、城に 入れはじめる。<ruby>関ヶ原<rt>せきがはら</rt></ruby>で 家を つぶされた 者たちだ。……つぶしたのは、きみだ。</p>
            <p>城の 奥には、<ruby>秀頼<rt>ひでより</rt></ruby>の 母・<face pid="p-yodo"><ruby>淀殿<rt>よどどの</rt></ruby></face>が いる。遠い 大坂の 声が、聞こえた——<ruby>気<rt>き</rt></ruby>が した。</p>
            <p class="speak">「この 城は、<ruby>太閤<rt>たいこう</rt></ruby>さまの のこされた 城。秀頼は、太閤さまの 子。——だれに 頭を 下げよと 言うのです」</p>
            <p><ruby>駿府<rt>すんぷ</rt></ruby>の 家臣たちも、割れた。</p>
            <p class="speak">「いくさは 早い ほど 小さく すみます。時を おけば、<ruby>牢人<rt>ろうにん</rt></ruby>は なお ふえまするぞ」</p>
            <p class="speak">「相手は <ruby>秀吉<rt>ひでよし</rt></ruby>さまの わすれがたみ。討てば——『<ruby>律儀者<rt>りちぎもの</rt></ruby>』の 名が、泣きまする」</p>`,
          // 淀殿's card grants here — the scene her voice belongs to (and her map-face debut).
          // A 2026-07-18 audit found she was granted NOWHERE, which silently made card
          // completion unreachable (completion denominators count every card in work.cards).
          onEnter: { card: 'p-yodo' },
          q: '<ruby>豊臣<rt>とよとみ</rt></ruby>の 家を——ほろぼすか、生かすか。',
          choices: [
            { label: '兵を 出す', to: '6-c', canon: true, effect: { yuzuranu: 2 },
              hist: { verdict: '史実では', match: '出した。二十万で かこみ、それでも 力ぜめでは 落とせない',
                body: `<p>冬。きみは およそ 二十万の 軍で 大坂城を かこんだ。だが 城は 深い <ruby>堀<rt>ほり</rt></ruby>と 高い <ruby>石垣<rt>いしがき</rt></ruby>に 守られ、力ぜめでは 落ちない。きみは <ruby>大筒<rt>おおづつ</rt></ruby>を 昼も 夜も 城へ 撃ちこませ、<ruby>和議<rt>わぎ</rt></ruby>に 持ちこんだ。——大坂 冬の<ruby>陣<rt>じん</rt></ruby>。</p><p>和議の 条件には、堀を 埋める ことが 入って いた。年が 明けると 工事が 進み、天下一と うたわれた 大坂城の 堀が、消えた。</p>` } },
            { label: '大名として 生かす', to: '6-c', effect: { matsu: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 生かして いたら……',
                body: `<p>じつは きみは、それを 十四年間、して きた。<ruby>関ヶ原<rt>せきがはら</rt></ruby>の あとも 豊臣は 六十五<ruby>万石<rt>まんごく</rt></ruby>の 大名として 大坂に あり、きみは 孫むすめまで とつがせた。——この もしもは、きみが ずっと 歩いて きた 道の つづきだ。</p><p>だが この 道の 先で、きみは 二年後に <ruby>寿命<rt>じゅみょう</rt></ruby>で 死ぬ。その とき 天下を つぐのは <ruby>秀忠<rt>ひでただ</rt></ruby>。豊臣に <ruby>恩<rt>おん</rt></ruby>の ある 大名たちが その 代で どちらを 向くか——見とどける ことは、きみには できない。<ruby>史実<rt>しじつ</rt></ruby>の きみは、兵を 出した。</p>` } },
          ] },

        '6-c': { place: '<ruby>摂津<rt>せっつ</rt></ruby>・大坂城',
          closeup: { tone: 'tense', cast: [ { face: 'p-ieyasu@old', name: '家康（きみ）' }, { face: 'p-yodo', name: '淀殿' } ] },
          monologue: '（<ruby>秀吉<rt>ひでよし</rt></ruby>どの。妹御を わしに とつがせ、母御まで 人質に 出した、あなたの 家を——いま、わしが 終わらせる。）',
          text: `<p>夏、<ruby>戦<rt>いくさ</rt></ruby>は もう一度 起きた。<ruby>堀<rt>ほり</rt></ruby>を 埋められた 城は、もう、あの 城では ない。5月の 空へ、<ruby>天守<rt>てんしゅ</rt></ruby>が 燃え上がった。</p>
            <p><ruby>秀頼<rt>ひでより</rt></ruby>の 妻に なって いた きみの 孫むすめ・<ruby>千姫<rt>せんひめ</rt></ruby>は、城の 外へ 出された。母子は、出なかった。</p>
            <p>あくる日、秀頼と <ruby>淀殿<rt>よどどの</rt></ruby>は、城の 一角で みずから 命を 絶つ。秀頼、二十三。——きみが 頭を 下げ、いちばん 長く 仕えた <ruby>主家<rt>しゅけ</rt></ruby>は、この 日、絶えた。</p>
            <p><ruby>百五十年<rt>ひゃくごじゅうねん</rt></ruby> ちかく つづいた <ruby>戦国<rt>せんごく</rt></ruby>の 世の、これが 最後の 大いくさに なる。</p>`,
          deep: { q: 'なぜ <ruby>秀頼<rt>ひでより</rt></ruby>は、<ruby>戦<rt>いくさ</rt></ruby>の 場に 出て こなかったの？',
            body: `大坂方の 中には、「秀頼さま みずから 出て くだされば、まよって いる 大名も こちらに つく」と 願う 声が あったと される。だが 秀頼は、冬も 夏も、最後まで 城の 外へ 出て いない。「母の <ruby>淀殿<rt>よどどの</rt></ruby>が 出さなかったのだ」と、長く 語られて きた——だが それを たしかめられる 当時の 紙は とぼしく、だれの 判断だったのかは、じつは はっきり しない。「天下の <ruby>悪女<rt>あくじょ</rt></ruby>が 子を かかえこんで 家を ほろぼした」という 話の 形は、豊臣が ほろんだ あと、勝った 側の 世で できて いった ものだ。たしかさマークは △（だれの 判断か、紙が 足りない）。`,
            cite: '※ ほろんだ 家の 話は、ほろぼした 側の 世で 語りつがれる。',
            confidence: '△' },
          onEnter: { cards: ['w-osakanojin'] },
          next: '6-d' },

        '6-d': { place: '第6章 むすび',
          monologue: '（家の ためだ、と あの ときも 思った。……家の ためなら、どこまで ゆるされるのか。それを 決めて くれる 者は、もう わしの 上には おらん。）',
          text: `<p>城の 火が 消えた ころ、きみの 中で、古い <ruby>傷<rt>きず</rt></ruby>が 口を 開いた——はずだ。<ruby>身内<rt>みうち</rt></ruby>を 死なせたのは、これが はじめてでは ない。</p>
            <p>三十六年 前、まだ <ruby>信長<rt>のぶなが</rt></ruby>が 生きて いた ころ。きみの 妻・<face pid="p-tsukiyama"><ruby>築山殿<rt>つきやまどの</rt></ruby></face>と、二十一の 長男・<face pid="p-nobuyasu"><ruby>信康<rt>のぶやす</rt></ruby></face>は、死に 追いこまれた。妻は 道の 上で 殺され、子は あずけ先の 城で <ruby>腹<rt>はら</rt></ruby>を 切った。それを 止められる 場所に いた ただ 一人が、きみだ。</p>
            <p>妻を 死なせ、子を 死なせ、<ruby>主家<rt>しゅけ</rt></ruby>を ほろぼした。——その 男を、世間は「<ruby>律儀者<rt>りちぎもの</rt></ruby>」と 呼んで いる。この ずれは、いったい 何なのだ。</p>
            <p>六つめの <ruby>手<rt>て</rt></ruby>がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に 入った。——「わからない ことは、わからない ままで 持って おく」。</p>`,
          deep: { q: 'なぜ、妻と 長男は 死なねば ならなかったの？',
            body: `通説は こうだ——<ruby>信康<rt>のぶやす</rt></ruby>の 妻は <ruby>信長<rt>のぶなが</rt></ruby>の 娘・<ruby>五徳<rt>ごとく</rt></ruby>。その 五徳が 父への 手紙で「<ruby>築山殿<rt>つきやまどの</rt></ruby>は 武田に 通じて いる。夫にも うたがいが ある」と うったえ、信長が <ruby>処断<rt>しょだん</rt></ruby>を 命じた、と。だが 近年の 研究では、信長が 命じた ことを たしかめられる 当時の 紙は 見つからず、「徳川の 家の 中の 争いを、家康 自身の 判断で おさめた」と 見る 説が 有力に なりつつ ある。徳川の 世では 口に しにくい 出来事だった から、そもそも 残された 記録が 少ない。たしかさマークは △——四百年 たっても、この 話は まだ、うごく 途中だ。`,
            cite: '※ 語りにくい 出来事ほど、記録は うすく なる。',
            confidence: '△' },
          creed: { line: '「名は、けがれて かまわぬ。——静かな 世が、あとに 残るなら。」',
            act: '——<ruby>落城<rt>らくじょう</rt></ruby>から 二か月。きみは 大名たちの まもるべき おきてを 出させた。最後の <ruby>戦<rt>いくさ</rt></ruby>の あと、きみが 手に とったのは 刀では なく、また <ruby>筆<rt>ふで</rt></ruby>だった。——きみは その <ruby>翌年<rt>よくねん</rt></ruby>、七十五で 死ぬ。' },
          onEnter: { cards: ['p-tsukiyama', 'p-nobuyasu'], clues: ['clue-6'] },
          end: true },
      },
    },
    {
      // Written against the ch2 pilot register. Design §2 終章 = the 謎の回収: no fork, the reader
      // answers the through-line themselves. The chapter closes BOTH mysteries — A (why the 律儀者
      // ended his lord's house, human understanding) and B (how far the 神君 image is真, source
      // criticism) — and shuts the 駿府 CIRCLE the work opened with (design §6 / research §5: the
      // hostage boy comes back as 大御所 and dies in the same town, CHAPTER_POINTS[7]=sunpu=[1]).
      // The design's 神格化タイムライン reveal ships WITHOUT engine work (ch6 precedent): a reveal
      // (東照大権現) + the 神号論争 body + a spark/deep on the 遺訓. The 250年 buildup is carried by
      // the 手帳 timeline (1616/1617/1843 rows already authored) + cards, not a bespoke widget.
      // 神号論争: 天海 vs 崇伝 before 秀忠, 豊国大明神(=秀吉) as the 反面教師 (research §3-1 ◎ for
      // the process; the 天海 quote is anecdote-level △〜☆, so it stays 「と 伝わる」). Death cause is
      // UNRESEARCHED — 死の床 asserts none. 久能山→日光 sequence is not in research either → the
      // cards/body name them jointly. The 答え合わせ mirrors katsu's finale: showClues + choices with
      // NO canon (canonStat skips it) and answer:N recorded-not-scored; every choice 「きみの 答え」
      // affirms rather than corrects. 「戦の 世が この 男で 終わった」= the work's leitmotif
      // (clue-7 / HIDDEN / choice-3) — the thing that survives discounting the 盛り. Endpoint =
      // 大坂の陣 1615, so the war-age it ended runs 応仁の乱 1467→1615 ≈ 150年, NOT 100 (a
      // 2026-07-18 factcheck confirmed 「百年」understated with a 1615 endpoint) → 「百五十年 ちかく」.
      id: 7, num: '終', title: '神に なった 男', years: '1616〜（そして 250年）',
      lead: '人質として 来た 地で、天下人と して 死ぬ。そこから、「神君」の すがたが 積み上がって いく。',
      start: '7-a',
      scenes: {
        '7-a': { place: '<ruby>駿河<rt>するが</rt></ruby>・<ruby>駿府城<rt>すんぷじょう</rt></ruby>',
          monologue: '（六さいで、<ruby>人質<rt>ひとじち</rt></ruby>として 来た 町だ。……その 町へ、<ruby>天下<rt>てんか</rt></ruby>を とった 身で 帰って きて、いま わしは 死ぬ。行き先を 決められて いた あの 子が、いちばん 遠くまで 来た。）',
          text: `<p><ruby>大坂城<rt>おおさかじょう</rt></ruby>が 燃えて、一年 たらず。1616年、きみは <ruby>駿府城<rt>すんぷじょう</rt></ruby>で <ruby>死<rt>し</rt></ruby>の <ruby>床<rt>とこ</rt></ruby>に つく。七十五さい。</p>
            <p>ここは、六さいの きみが 人質として あずけられ、十一年を すごした 町だ。<ruby>将軍<rt>しょうぐん</rt></ruby>の <ruby>位<rt>くらい</rt></ruby>は とうに <ruby>秀忠<rt>ひでただ</rt></ruby>に ゆずり、きみは <ruby>大御所<rt>おおごしょ</rt></ruby>と して、この なつかしい 地から 天下を 見つめて いた。</p>
            <p>まくらもとに、<ruby>江戸<rt>えど</rt></ruby>から 駆けつけた 我が子が、座って いる。その <ruby>声<rt>こえ</rt></ruby>が、聞こえた——<ruby>気<rt>き</rt></ruby>が した。</p>
            <p class="speak">「<ruby>父上<rt>ちちうえ</rt></ruby>。……あとは、この <ruby>秀忠<rt>ひでただ</rt></ruby>が。<ruby>天下<rt>てんか</rt></ruby>は、もう しずかで ございます」</p>
            <p>——きみは この 町で、静かに 目を とじた。長い、長い <ruby>旅<rt>たび</rt></ruby>が 終わる。だが、きみの 物語は、ここで 終わらない。</p>`,
          next: '7-b' },

        '7-b': { place: '<ruby>神<rt>かみ</rt></ruby>の 名を、きめる',
          text: `<p>きみが 死ぬと、すぐに 話し合いが 始まった。——この 人を、どんな <ruby>神<rt>かみ</rt></ruby>として まつるか。</p>
            <p>二代<ruby>将軍<rt>しょうぐん</rt></ruby> <ruby>秀忠<rt>ひでただ</rt></ruby>の 前で、二人の <ruby>僧<rt>そう</rt></ruby>が 争った。かたや「<ruby>明神<rt>みょうじん</rt></ruby>」、かたや「<ruby>権現<rt>ごんげん</rt></ruby>」。<face pid="p-tenkai"><ruby>天海<rt>てんかい</rt></ruby></face>という 僧が、こう 言って 場を おさえた——と 伝わる。</p>
            <p class="speak">「『<ruby>明神<rt>みょうじん</rt></ruby>』は いけませぬ。<ruby>豊国大明神<rt>ほうこく だいみょうじん</rt></ruby>——<ruby>秀吉<rt>ひでよし</rt></ruby>どのの 神の 名を、ごらんなさい。あの ように まつられた <ruby>豊臣<rt>とよとみ</rt></ruby>の 家は、げんに ほろびました」</p>
            <p><ruby>勝<rt>か</rt></ruby>った 側が、ほろぼした 側の <ruby>前例<rt>ぜんれい</rt></ruby>を 見て、自分の 神の 形を えらぶ。決まった 名は「<ruby>東照大権現<rt>とうしょう だいごんげん</rt></ruby>」。</p>`,
          reveal: { title: '「<ruby>東照大権現<rt>とうしょう だいごんげん</rt></ruby>」',
            caption: '1617年、<ruby>朝廷<rt>ちょうてい</rt></ruby>から おくられた <ruby>神<rt>かみ</rt></ruby>の 名。<ruby>人質<rt>ひとじち</rt></ruby>の 子が、<ruby>神<rt>かみ</rt></ruby>に なった。' },
          onEnter: { cards: ['p-tenkai', 'w-toshogu'] },
          next: '7-c' },

        '7-c': { place: '「<ruby>神君<rt>しんくん</rt></ruby>」の <ruby>話<rt>はなし</rt></ruby>が、積み上がる',
          text: `<p>神に なった きみの まわりに、話は 少しずつ 積み上がって いく。<ruby>日光<rt>にっこう</rt></ruby>に 大きな <ruby>社<rt>やしろ</rt></ruby>が でき、各地に <ruby>東照宮<rt>とうしょうぐう</rt></ruby>が 建つ。きみが 死んで 200年 あまり たった ころ、<ruby>幕府<rt>ばくふ</rt></ruby>は きみ 一代を まとめた <ruby>正史<rt>せいし</rt></ruby>を 完成させた。</p>
            <p>そうして 積み上がった 話の 中で、いちばん 有名に なった ことばが ある——「人の 一生は <ruby>重荷<rt>おもに</rt></ruby>を <ruby>負<rt>お</rt></ruby>うて 遠き<ruby>道<rt>みち</rt></ruby>を ゆくが <ruby>如<rt>ごと</rt></ruby>し、<ruby>急<rt>いそ</rt></ruby>ぐべからず」（＝重い 荷物を せおって 遠い 道を 行く ように、あわてるな、と いう 意味だ）。<ruby>家康<rt>いえやす</rt></ruby>の <ruby>人生観<rt>じんせいかん</rt></ruby>と して、後の 世の <ruby>教科書<rt>きょうかしょ</rt></ruby>にも のった、名言だ。</p>`,
          spark: 'え！？ あの 有名な「<ruby>家康<rt>いえやす</rt></ruby>の ことば」、じつは 家康が 言った ものでは ない？',
          deep: { q: 'あの 名言は、家康の ことば じゃ ないの？',
            body: `近ごろの <ruby>研究<rt>けんきゅう</rt></ruby>では「家康の 言葉では ない」と する 説が 有力だ。もとは べつの 人——<ruby>水戸<rt>みと</rt></ruby>の <ruby>光圀<rt>みつくに</rt></ruby>の 教えと される 文らしい。それが 1835年の 本で「家康の ことば」と して 紹介され、<ruby>明治<rt>めいじ</rt></ruby>に なって、ある もと<ruby>幕臣<rt>ばくしん</rt></ruby>が 家康の <ruby>署名<rt>しょめい</rt></ruby>を 書き足した <ruby>巻物<rt>まきもの</rt></ruby>に 仕立て、<ruby>東照宮<rt>とうしょうぐう</rt></ruby>に おさめた——と 指摘されて いる。りっぱな <ruby>石碑<rt>せきひ</rt></ruby>まで 建った のに、だ。たしかさマークは ○。<br>「<ruby>神君<rt>しんくん</rt></ruby>の ことば」は、こうして 死んだ あとに 作られる ことも ある。`,
            cite: '※ わらう 話も、ほめる 話も、死んだ あとに 足して いける。',
            confidence: '○' },
          onEnter: { cards: ['w-jikki', 'w-yuikun'], clues: ['clue-7'] },
          next: '7-d' },

        '7-d': { place: '<ruby>物語<rt>ものがたり</rt></ruby>を つらぬく <ruby>謎<rt>なぞ</rt></ruby> — <ruby>答<rt>こた</rt></ruby>え合わせ',
          text: `<p><ruby>旅<rt>たび</rt></ruby>の はじめ、<ruby>第一章<rt>だいいっしょう</rt></ruby>で あずけた <ruby>謎<rt>なぞ</rt></ruby>を、もう 一度。</p>
            <p class="speak">なぜ、「<ruby>律儀者<rt>りちぎもの</rt></ruby>」と 呼ばれた 男が、いちばん 長く 仕えた <ruby>主家<rt>しゅけ</rt></ruby>を、自分の 手で ほろぼしたのか？ ——そして その 男の「<ruby>神君<rt>しんくん</rt></ruby>」の すがたは、どこまで ほんとうか。</p>
            <p>集めた <ruby>手<rt>て</rt></ruby>がかりを、ひとつずつ 思いかえして——<br><em>きみは、どう 考える？</em></p>`,
          showClues: true,
          q: 'きみの <ruby>答<rt>こた</rt></ruby>えは？（どれを えらんでも、<ruby>正解<rt>せいかい</rt></ruby>の ひとつ）',
          choices: [
            { label: '<ruby>乱世<rt>らんせ</rt></ruby>を 終わらせる ためだ。だれかが 終わらせねば、<ruby>戦<rt>いくさ</rt></ruby>は つづいた', to: '7-e', answer: 0,
              hist: { verdict: 'きみの 答え', match: 'それは、たしかな 答えの ひとつ',
                body: `<p>そのとおり かも しれない。<ruby>百五十年<rt>ひゃくごじゅうねん</rt></ruby> ちかく つづいた <ruby>戦<rt>いくさ</rt></ruby>の 世を 終わらせるには、だれかが 最後の <ruby>主家<rt>しゅけ</rt></ruby>を たたむ <ruby>悪役<rt>あくやく</rt></ruby>に ならねば ならなかった。きみは その 役を、自分で 引き受けた。</p>`,
                card: 'p-ieyasu' } },
            { label: '<ruby>恩<rt>おん</rt></ruby>を 受けた 家を つぶした。りっぱとは 言えない。それも <ruby>天下<rt>てんか</rt></ruby>取りだ', to: '7-e', answer: 1,
              hist: { verdict: 'きみの 答え', match: 'それも、まっすぐな 答えの ひとつ',
                body: `<p>それも 大事な 見方だ。頭を 下げ、<ruby>妹<rt>いもうと</rt></ruby>や 母まで あずかった 家を、きみは 最後に 終わらせた。「<ruby>律儀者<rt>りちぎもの</rt></ruby>」の ひと言では、とても おさまらない。目を そらさず そう 見るのも、ひとつの 答えだ。</p>`,
                card: 'p-ieyasu' } },
            { label: '<ruby>英断<rt>えいだん</rt></ruby>か <ruby>非情<rt>ひじょう</rt></ruby>か——見る <ruby>立場<rt>たちば</rt></ruby>で ちがう', to: '7-e', answer: 2,
              hist: { verdict: 'きみの 答え', match: 'それも、するどい 答えの ひとつ',
                body: `<p>そのとおり。<ruby>豊臣<rt>とよとみ</rt></ruby>の 側から 見れば <ruby>非情<rt>ひじょう</rt></ruby>、<ruby>戦<rt>いくさ</rt></ruby>に つかれた 世の 人から 見れば <ruby>英断<rt>えいだん</rt></ruby>。おなじ 出来事が、立つ <ruby>場所<rt>ばしょ</rt></ruby>で 意味を 変える——それは、きみが <ruby>手<rt>て</rt></ruby>がかりで 何度も 見て きた ことだ。</p>`,
                card: 'p-ieyasu' } },
            { label: '「<ruby>神君<rt>しんくん</rt></ruby>」の 話は 勝った 側が 盛った。でも、<ruby>戦<rt>いくさ</rt></ruby>の 世が この 男で 終わったのは <ruby>事実<rt>じじつ</rt></ruby>', to: '7-e', answer: 3,
              hist: { verdict: 'きみの 答え', match: 'それこそ、いちばん 大人な 答えかも',
                body: `<p>それが、いちばん <ruby>正直<rt>しょうじき</rt></ruby>な 答えかも しれない。しかみ<ruby>像<rt>ぞう</rt></ruby>も <ruby>遺訓<rt>いくん</rt></ruby>も、勝った 側が あとから 盛った もの。それでも、<b>盛りを 割り引いて なお 残る 事実</b>——<ruby>百五十年<rt>ひゃくごじゅうねん</rt></ruby> ちかく つづいた 戦の 世が この 男で 終わった こと——は、消えない。わからない ことを 楽しみ、確かめて いく。それが、なりきりの ねうちだ。</p>`,
                card: 'p-ieyasu' } },
          ] },

        '7-e': { place: '<ruby>終章<rt>しゅうしょう</rt></ruby> むすび',
          text: `<p>「<ruby>神君<rt>しんくん</rt></ruby>さま」の すがたは、勝った 側が 250年 かけて 積み上げた もの。しかみ<ruby>像<rt>ぞう</rt></ruby>も、<ruby>遺訓<rt>いくん</rt></ruby>も、<ruby>忍者<rt>にんじゃ</rt></ruby>の <ruby>手<rt>て</rt></ruby>がら話も——あとから 足された。</p>
            <p>それでも、<ruby>盛<rt>も</rt></ruby>りを 一枚ずつ はがした あとに、まだ 残る ものが ある。<b>行き先を 決められて いた <ruby>人質<rt>ひとじち</rt></ruby>の 子。その 男で、<ruby>百五十年<rt>ひゃくごじゅうねん</rt></ruby> ちかく つづいた <ruby>戦<rt>いくさ</rt></ruby>の 世が 終わった</b>——それは、だれにも 消せない。七つの <ruby>手<rt>て</rt></ruby>がかりを そろえた きみの 手で、最後の <ruby>巻物<rt>まきもの</rt></ruby>が ひらく。</p>`,
          creed: { line: '「<ruby>神<rt>かみ</rt></ruby>と 呼ぶな。——わしは、行き先を 決められた 子が、行き先を 決める 側に 回った、それだけの <ruby>男<rt>おとこ</rt></ruby>だ。」',
            act: '——<ruby>盛<rt>も</rt></ruby>りを 一枚ずつ はがした あとに 残る、その「それだけの <ruby>男<rt>おとこ</rt></ruby>」を、きみは 七つの <ruby>手<rt>て</rt></ruby>がかりで 確かめた。<ruby>神君<rt>しんくん</rt></ruby>だったか、ひとりの 人だったか——決めるのは、なりきった きみだ。' },
          end: true },
      },
    },
  ],
};
