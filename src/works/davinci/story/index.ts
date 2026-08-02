// Story data (STORY). All 7 chapters written; the work is registered (src/works/index.ts) — so the
// ruby / budget / structure gates now cover it like any shipped work. The register was fixed by the
// ch6 PILOT (design §7 / WRITING 10) and each later chapter states, in its own header, which of its
// rules it inherits. Scene ids are chapter-prefixed and unique across the work (sceneMaps /
// sceneFaceOverrides / observe hotspots are keyed by scene id work-wide).
// Hand-managed (davinci has no legacy extract source).
/* eslint-disable */

import type { Story } from '../../../engine/types';

export const STORY: Story = {
  chapters: [
    {
      id: 1, num: '一', title: 'ヴィンチ村の 私生児', years: '1452〜',
      lead: 'けっこんして いない 親の あいだに 生まれ、学校にも 行けない ひとりの 子ども。すべては その 子が、川と 岩と 鳥を じっと 見つめる ところから はじまった。',
      start: '1-a',
      teaser: 'フィレンツェの <ruby>工房<rt>こうぼう</rt></ruby>に 弟子入りする。師の 絵を、きみは こえて しまうのか？',
      // First WRITTEN chapter to use the 4th main-visual kind = 習作ページ (Scene.study → work.studies).
      // Device = 観察ビュー (story 1-b): the reader drags a lens over レオナルドの手記 and finds 水の渦/
      // 鳥/光と球/葉; each found star seeds the つながり図鑑 (graph.ts n-water/n-flight/n-light), and the
      // within-chapter link 水×鳥 lights immediately while 水×髪(ch6 n-curl) waits — the §6 cross-domain
      // payoff. Facts are pinned to ◎/○ only (research §3・§3-5・§3-9): 私生児◎・独学=自分の目を信じる◎・
      // 鏡文字 fact◎/理由諸説△・水/鳥/光の観察. The famous「洞窟」boyhood passage is NOT in research → omitted.
      // Register (from ch2/3/5/6): 両側に魅力＋代償 (型どおり is a real other life; 自分の目 carries 出る杭
      // の代償)・二段確度◎/△・敵役でなく周囲に声を・むすび closer「動きはじめた」(隣接非重複 vs くわわった/
      // 落ちた/のぞいてみよう). 漢字ルビの plain 慣例: 目/絵/手/光/形/水/川.
      scenes: {
        '1-a': { place: 'トスカーナ・ヴィンチ村',
          monologue: '（学校には 入れない。でも、川も 鳥も 光も、みんな おれの 先生だ。）',
          text: `<p>1452年、きみは トスカーナの ヴィンチ村で 生まれた。父は 町の <ruby>公証人<rt>こうしょうにん</rt></ruby>（人と 人の やくそくを 紙に 残す 仕事）。だが 母とは 結ばれて おらず、きみは <ruby>私生児<rt>しせいじ</rt></ruby>だった。</p>
            <p>父の 仕事は、けっこんした 親から 生まれた 子しか つげない きまりだった。だから 父は、<ruby>学者<rt>がくしゃ</rt></ruby>に なる ための ラテン語の 学校にも きみを 入れなかった。かわりに きみは、丘を かけまわる。川の <ruby>流<rt>なが</rt></ruby>れ、鳥の <ruby>羽<rt>はね</rt></ruby>、光の 当たり方——本には ない ものを、この 目で 見つめた。</p>`,
          onEnter: { card: 'w-shiseiji' },
          next: '1-b' },

        '1-b': { place: 'ヴィンチ村の 丘',
          study: 'ch1',
          text: `<p>きみは、見た ものを 紙に 写しはじめた。渦を まく 水、かたむいて 飛ぶ 鳥、丸い ものに 落ちる 光と かげ、葉の すじ。だれに 習ったのでも ない。</p>
            <p>さあ、きみの <ruby>手記<rt>しゅき</rt></ruby>を のぞいて みよう。</p>`,
          observe: { prompt: '<ruby>手記<rt>しゅき</rt></ruby>を 指で なぞって みよう。きみは、何に 気づいた？',
            hotspots: [
              { id: 'ob1-water', nodeId: 'n-water', x: 0.30, y: 0.356, r: 0.085, essential: true,
                caption: '渦を まく 水。この 同じ 形が、あとで 思いがけない ところで また 出て くる。' },
              { id: 'ob1-flight', nodeId: 'n-flight', x: 0.719, y: 0.324, r: 0.085, essential: true,
                caption: 'かたむいて 飛ぶ 鳥。つばさで 空気を おして、体を うかせて いる。' },
              { id: 'ob1-light', nodeId: 'n-light', x: 0.319, y: 0.712, r: 0.085,
                caption: '丸い ものに あたる 光と かげ。かげの 濃さで、まるく ふくらんで 見える。' },
              { id: 'ob1-leaf', x: 0.706, y: 0.72, r: 0.085,
                caption: '葉の すじ。太い すじから 細い すじへ、川が 分かれて いく みたいに。' },
            ] },
          spark: 'え！？ きみの <ruby>手記<rt>しゅき</rt></ruby>の 文字は、ぜんぶ 右から 左への「<ruby>鏡文字<rt>かがみもじ</rt></ruby>」——鏡に 映さないと 読めない？',
          deep: { q: 'なぜ、逆さの 字で 書いたの？',
            body: `きみは <ruby>左利<rt>ひだりき</rt></ruby>きだった。右から 左へ 書けば、書いた ばかりの インクを 手で こすらずに すむ——これが 一番 広く 言われる わけだ。「<ruby>秘密<rt>ひみつ</rt></ruby>に する ため」とも 言うが、鏡文字は かんたんに 読めて しまうので、あやしむ 人も 多い。ほんとうの 理由は、いまも はっきり しない。`,
            cite: '※ 鏡文字で 書いたのは たしか（◎）。理由は 決め手が なく <ruby>諸説<rt>しょせつ</rt></ruby>（△）。',
            confidence: '◎' },
          onEnter: { card: 'w-kagamimoji' },
          next: '1-c' },

        '1-c': { place: 'ヴィンチ村',
          text: `<p>絵で 生きて いこうと する きみに、まわりの 大人が 言う。</p>
            <p class="speak">「よけいな ものばかり 見て いないで、上手な 人の <ruby>型<rt>かた</rt></ruby>を おぼえろ。みんなが ほめる 描き方が、ちゃんと ある んだ」</p>
            <p>型を なぞれば、まちがいは ない。でも きみの 目は、だれも 見て いない ものを、つい 見つけたく なる。</p>`,
          q: 'きみは、どちらを 信じる？',
          choices: [
            { label: '上手な 人の <ruby>型<rt>かた</rt></ruby>を おぼえる', to: '1-d', effect: { miru: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 型に したがって いたら……',
                body: `<p>きみは 早く、みんなに ほめられる 絵を 描けた かも しれない。仲間に なじみ、こまらず 生きられた かも しれない。</p><p>ただ——だれも 見た こと の ない ものを 見つける、あの 目は、育たなかった かも しれない。</p>` } },
            { label: '自分の 目で 見た ままを 描く', to: '1-d', canon: true, effect: { miru: 1, tamesu: 1 },
              hist: { verdict: '史実では', match: '自分の 目を 信じた',
                body: `<p>きみは <ruby>権威<rt>けんい</rt></ruby>ある 学者の 説より、自分が 見た ことを 信じた。のちに こう 書く——「知は <ruby>経験<rt>けいけん</rt></ruby>の むすめ」。</p><p>この 生き方が、だれも 気づかない ことに 気づく 目を つくった。だが 同時に、型に おさまらない きみは、この 先 ずっと「<ruby>出<rt>で</rt></ruby>る <ruby>杭<rt>くい</rt></ruby>」にも なる。</p>` } },
          ] },

        '1-d': { place: '第1章 むすび',
          text: `<p>本を 持たない ひとりの 子どもが、世界を 先生に して、見て、写しはじめた。</p>
            <p>この「よく 見る 目」を たずさえて、きみは いま、フィレンツェの 大きな <ruby>工房<rt>こうぼう</rt></ruby>の 戸を たたく。<ruby>親方<rt>おやかた</rt></ruby>と <ruby>弟子<rt>でし</rt></ruby>たちが、絵や <ruby>像<rt>ぞう</rt></ruby>を つくる ところだ。すべては、ここから 動きはじめた。</p>`,
          creed: { line: '「おれは 本で 習わなかった。だから、世界を まるごと 先生に した。」',
            act: '——工房の 戸を たたく その 手は、もう まよって いない。' },
          onEnter: { clues: ['clue-1'] },
          end: true },
      },
    },
    {
      // Device = CLOSEUP (design §7's draft「chiaroscuro ドラッグ minigame」needs an unbuilt drawing-
      // minigame engine — Minigame is only 'sort'|'march' — so it stays attended; NOT written here).
      // The confirmed skeleton points ch2's real spine elsewhere: clue-2 and the two ch2 cards
      // (p-verrocchio / w-tenshi) frame it as 史料批判 — the famous「師が二度と筆を執らなかった」story is
      // Vasari-only (research §3-2: 天使を描いた ○ / 師が筆を折った ☆). So the 山場 is a CLOSEUP of 師
      // beholding the pupil's angel (built device, POV convention = the OTHER face only, like ch6-b リザ)
      // + a two-stage-confidence spark/deep that splits 核(○) from 尾ひれ(☆). Fork「型どおり or 自分の目」
      // seeds the overarching riddle (why he never settled for 完成 = trusting his own eye over the taught
      // form) and grows 観る目 (the earlier works' canon all grew ためす手 — ch2 diversifies the portrait).
      // Register from ch3/ch5/ch6 applied in the FIRST draft (JOURNAL 2026-07-19): 両側に魅力＋代償 —
      // もしも(型どおり) is a REAL other life (belonging + a clean-finished panel), its cost only「かも」;
      // canon(自分の目) yields the first fame but carries a genuine 代償 (出る杭 + the legend's weight +
      // the start of never finishing like everyone else). むすび closer differs from ch3(「くわわった」)/
      // ch5(「落ちた」)/ch6(「のぞいてみよう」) per 隣接非重複. 敵役でなく師に声を (WRITING 原則4). No scene
      // map (ch2 is one city, no journey) and no observe/graph (deferred — would touch the pilot graph.ts).
      // 漢字ルビは ch3/ch5/ch6 と同じ plain-convention（絵/目/手/光/形 = plain）。
      id: 2, num: '二', title: 'フィレンツェの 工房', years: '1466〜1481',
      lead: '彫刻家ヴェロッキオの 工房で、素描・「よく 見る こと」を 学ぶ。師の 絵に、天使を ひとり 描き足す。',
      start: '2-a',
      teaser: 'ミラノを 動かす 人に 売り込む 手紙を 書く。きみは「画家」と 名のるか、「<ruby>軍事技師<rt>ぐんじぎし</rt></ruby>」と 名のるか？',
      scenes: {
        '2-a': { place: 'フィレンツェ・<ruby>工房<rt>こうぼう</rt></ruby>',
          monologue: '（<ruby>文字<rt>もじ</rt></ruby>は うまく 読めない。だが、見る ことなら、だれにも まけない 気が する。）',
          text: `<p>ヴィンチ<ruby>村<rt>むら</rt></ruby>を 出て、きみは 大きな 街 フィレンツェの <ruby>工房<rt>こうぼう</rt></ruby>に <ruby>弟子入<rt>でしい</rt></ruby>りした。まだ <ruby>十四<rt>じゅうよん</rt></ruby>さいごろだ。</p>
            <p><ruby>親方<rt>おやかた</rt></ruby>は <face pid="p-verrocchio">ヴェロッキオ</face>。<ruby>彫刻<rt>ちょうこく</rt></ruby>も、絵も、金の <ruby>細工<rt>ざいく</rt></ruby>も こなす <ruby>名人<rt>めいじん</rt></ruby>だ。きみは ここで、絵を 描く わざを、手を <ruby>動<rt>うご</rt></ruby>かして 一つずつ <ruby>覚<rt>おぼ</rt></ruby>えて いく。</p>
            <p>師が、口ぐせのように 言う。</p>
            <p class="speak">「よく 見ろ。目で 見た とおりに 描け。<ruby>頭<rt>あたま</rt></ruby>で 知って いる 形でなく、いま そこに ある 光を、だ」</p>`,
          onEnter: { card: 'p-verrocchio' },
          next: '2-b' },

        '2-b': { place: 'フィレンツェ・<ruby>工房<rt>こうぼう</rt></ruby>',
          monologue: '（左の <ruby>天使<rt>てんし</rt></ruby>、ひとり、おれが 描く。師の 型で 塗るか——それとも、おれの 目の とおりに か。）',
          text: `<p>ある 日、師は 大きな 絵『キリストの <ruby>洗礼<rt>せんれい</rt></ruby>』を 引き受け、その 左はしの <ruby>天使<rt>てんし</rt></ruby>を ひとり、きみに まかせた。<ruby>弟子<rt>でし</rt></ruby>が 師の 絵を 手つだうのは、ふつうの ことだ。</p>
            <p><ruby>筆<rt>ふで</rt></ruby>を 前に、きみは <ruby>考<rt>かんが</rt></ruby>える。<ruby>工房<rt>こうぼう</rt></ruby>の みんなと 手を そろえ、<ruby>教<rt>おそ</rt></ruby>わった <ruby>型<rt>かた</rt></ruby>どおりに <ruby>塗<rt>ぬ</rt></ruby>るか。それとも、きみの 目が ほんとうに 見た 光と かげの とおりに、描くか。</p>`,
          q: 'きみは、この <ruby>天使<rt>てんし</rt></ruby>を どう 描く？',
          choices: [
            { label: '<ruby>教<rt>おそ</rt></ruby>わった <ruby>型<rt>かた</rt></ruby>どおり、みんなと そろえて <ruby>塗<rt>ぬ</rt></ruby>る', to: '2-c', effect: { miru: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし <ruby>教<rt>おそ</rt></ruby>わった <ruby>型<rt>かた</rt></ruby>どおりに、目立たず <ruby>塗<rt>ぬ</rt></ruby>って いたら……',
                body: `<p>きみは <ruby>工房<rt>こうぼう</rt></ruby>の みんなと 手を そろえ、よい <ruby>弟子<rt>でし</rt></ruby>として、波風 立てずに とけこんだ ことに なる。師の 顔も つぶさず、絵は きれいに <ruby>仕上<rt>しあ</rt></ruby>がる。それは それで、一つの <ruby>幸<rt>しあわ</rt></ruby>せな 道だ。</p><p>ただ、きみの 目が ほんとうに 見た あの 光は、その 絵には 出ない。だれも、きみの 目に 気づかない。——けれど、いつ「きみらしさ」を 出すかは、きみが 決めて いい。</p>` } },
            { label: '<ruby>自分<rt>じぶん</rt></ruby>の 目が 見た 光の とおりに 描く', to: '2-c', canon: true, effect: { miru: 2 },
              hist: { verdict: '史実では', match: '<ruby>自分<rt>じぶん</rt></ruby>の 目で 見た 光で、天使を 描いた',
                body: `<p><ruby>史実<rt>じじつ</rt></ruby>の きみは、<ruby>教<rt>おそ</rt></ruby>わった <ruby>型<rt>かた</rt></ruby>でなく、自分の 目が 見た とおりに 光と かげを 置いた。その <ruby>天使<rt>てんし</rt></ruby>は <ruby>工房<rt>こうぼう</rt></ruby>の どの 手とも ちがい、生きて いるようだと 言われた。まだ 若い きみの 名が、はじめて 世に 知られる。</p><p>だが、<ruby>弟子<rt>でし</rt></ruby>が 師の 絵の 中で ひとり <ruby>際立<rt>きわだ</rt></ruby>つのは、たやすい ことでは ない。人と 同じに <ruby>仕上<rt>しあ</rt></ruby>げられない——その 生き方が、ここから 始まる。</p>` } },
          ] },

        '2-c': { place: 'フィレンツェ・<ruby>工房<rt>こうぼう</rt></ruby>',
          closeup: { tone: 'solemn', cast: [ { face: 'p-verrocchio', name: '師ヴェロッキオ' } ] },
          text: `<p>絵が <ruby>仕上<rt>しあ</rt></ruby>がった。きみの 描いた <ruby>天使<rt>てんし</rt></ruby>は、<ruby>工房<rt>こうぼう</rt></ruby>の だれの 手とも ちがって いた。やわらかな 光が <ruby>頬<rt>ほお</rt></ruby>を なで、いまにも <ruby>息<rt>いき</rt></ruby>を しそうだった。</p>
            <p>師ヴェロッキオが、その <ruby>天使<rt>てんし</rt></ruby>の 前に 立った。何も 言わず、長い あいだ、ただ じっと 見つめて いた。</p>
            <p>先に <ruby>弟子入<rt>でしい</rt></ruby>りして いた <ruby>兄弟子<rt>あにでし</rt></ruby>が、きみの 耳もとで ささやいた。</p>
            <p class="speak">「親方は もう、<ruby>絵筆<rt>えふで</rt></ruby>を とらないかもな。……あんな 天使を 見せられて は」</p>`,
          spark: 'え！？ 兄弟子の よそうは、はずれ。師は その あとも <ruby>工房<rt>こうぼう</rt></ruby>を 続け、やがて <ruby>彫刻<rt>ちょうこく</rt></ruby>を 本業に した。なのに「師は 二度と 絵筆を とらなかった」と 書いた 本が、きみが 死んで <ruby>三十<rt>さんじゅう</rt></ruby>年 あまり あとに 出る？',
          deep: { q: '師は、ほんとうに <ruby>筆<rt>ふで</rt></ruby>を 折ったの？',
            body: `きみが 左の <ruby>天使<rt>てんし</rt></ruby>を 描いたこと <ruby>自体<rt>じたい</rt></ruby>は、いまの <ruby>研究<rt>けんきゅう</rt></ruby>も おおむね みとめる（絵の <ruby>具<rt>ぐ</rt></ruby>の ちがいなどから）。だが「師が 二度と <ruby>筆<rt>ふで</rt></ruby>を とらなかった」の <ruby>部分<rt>ぶぶん</rt></ruby>は、きみが <ruby>死<rt>し</rt></ruby>んで <ruby>三十<rt>さんじゅう</rt></ruby>年 あまり あとに 書かれた ヴァザーリの <ruby>伝記<rt>でんき</rt></ruby>だけの <ruby>話<rt>はなし</rt></ruby>。<ruby>工房<rt>こうぼう</rt></ruby>で そんな うわさが 立ったという 紙も、当時の ものは 残って いない。じっさいの 師は、その あとも 工房を <ruby>続<rt>つづ</rt></ruby>けた。<ruby>本業<rt>ほんぎょう</rt></ruby>は もともと <ruby>彫刻<rt>ちょうこく</rt></ruby>で、だんだん そちらへ <ruby>移<rt>うつ</rt></ruby>った、というのが ほんとうらしい。うつくしい <ruby>天使<rt>てんし</rt></ruby>も、ふくらんだ うわさも、この 一枚から 生まれた。`,
            cite: '※ きみが <ruby>天使<rt>てんし</rt></ruby>を 描いた＝おおむね たしか（○）。「師が <ruby>筆<rt>ふで</rt></ruby>を 折った」＝ずっと あとの <ruby>伝記<rt>でんき</rt></ruby>だけ（☆）。<ruby>事実<rt>じじつ</rt></ruby>の <ruby>核<rt>かく</rt></ruby>と、<ruby>尾<rt>お</rt></ruby>ひれを 分ける。',
            confidence: '○' },
          onEnter: { card: 'w-tenshi' },
          next: '2-d' },

        '2-d': { place: '第2章 むすび',
          text: `<p>師の <ruby>型<rt>かた</rt></ruby>を まもるか、自分の 目を <ruby>信<rt>しん</rt></ruby>じるか——きみは、自分の 目を えらんだ。それが、この さきずっと、きみの 描き方に なる。師の <ruby>型<rt>かた</rt></ruby>を こえて 描いた その 絵で、きみは <ruby>若<rt>わか</rt></ruby>くして 名を 知られて いく。</p>
            <p>——<ruby>手<rt>て</rt></ruby>がかりが、また 一つ <ruby>手帳<rt>てちょう</rt></ruby>に <ruby>残<rt>のこ</rt></ruby>った。</p>`,
          creed: { line: '「おれは、<ruby>教<rt>おそ</rt></ruby>わった 形でなく、いま そこに ある 光を 描く。」',
            act: '——きみは、師の 手本を わきに 置き、自分の 目だけを たよりに <ruby>筆<rt>ふで</rt></ruby>を <ruby>動<rt>うご</rt></ruby>かした。その 一枚が、やがて <ruby>五千枚<rt>ごせんまい</rt></ruby>の <ruby>手記<rt>しゅき</rt></ruby>へと つづいて いく。' },
          onEnter: { clues: ['clue-2'] },
          end: true },
      },
    },
    {
      // Device = 選択「芸術か戦争か」＋社会相関マップ (design §7). No 観察ビュー here (the ch1/ch4
      // natural-observe view needs the unbuilt 習作ページ art), so ch3 is authored ahead of ch1: its
      // main visual is a SCENE MAP (firenze→milano journey + スフォルツァ公's face, engine already
      // ships it — see ../map.ts '3-a'). The fork「絵かき or 軍事技師」cashes 大目標2 (割り切れなさ:
      // 平和を願いつつ戦の道具を売る, research §4-2); canon = 軍事技師 (the 自薦状 led with weapons).
      // Riddle facet clue-3「手がけたものが仕上がる前に世の中が変わる」lands via the giant horse
      // (研究 §3-8): destroyed before it was ever cast in bronze.
      id: 3, num: '三', title: 'ミラノ 売り込み', years: '1482〜1494',
      lead: '「絵が うまい」より 先に「戦の 道具が 作れる」と 売り込んで、ミラノの あるじに やとわれる。',
      start: '3-a',
      teaser: '壁に『<ruby>最後<rt>さいご</rt></ruby>の <ruby>晩餐<rt>ばんさん</rt></ruby>』を 描く。<ruby>安全<rt>あんぜん</rt></ruby>な やり方か、新しい やり方か？',
      scenes: {
        '3-a': { place: 'ミラノへの <ruby>道<rt>みち</rt></ruby>',
          monologue: '（フィレンツェには、絵の うまい 者なら いくらでも いる。おれの 名を、まだ だれも 知らない。）',
          text: `<p><ruby>三十<rt>さんじゅう</rt></ruby>を こえた ころ、きみは 育った 街 フィレンツェを 出て、北の ミラノを めざした。</p>
            <p>フィレンツェは 絵の <ruby>才人<rt>さいじん</rt></ruby>で あふれ、きみは まだ「これ」という 大仕事を まかされて いなかった。ミラノを 動かして いる <face pid="p-ludovico">ルドヴィコ・スフォルツァ</face>は、戦に つよい 家来を、のどから 手が 出るほど ほしがって いる。<ruby>戦乱<rt>せんらん</rt></ruby>の 世だ。</p>
            <p>アルプスの ふもとの 大きな 街が、近づいて くる。——この あるじに、きみは 自分を どう 売り込むか。</p>`,
          onEnter: { card: 'p-ludovico' },
          next: '3-b' },

        '3-b': { place: 'ミラノ・スフォルツァ<ruby>城<rt>じょう</rt></ruby>',
          monologue: '（おれの ほんとうの 得意は、絵だ。だが、この あるじが いま いちばん ほしいのは——）',
          text: `<p>ミラノに 着いた きみは、あるじに わたす <ruby>手紙<rt>てがみ</rt></ruby>を 書こうと して いた。自分に 何が できるかを 並べ、<ruby>宮廷<rt>きゅうてい</rt></ruby>（あるじの そばで 働く 人たちの 集まり）に 入れて くれと たのむ「売り込みの 手紙」だ。</p>
            <p><ruby>羽<rt>は</rt></ruby>ペンを 前に、きみは 迷う。まっさきに 何と 名のるか——それで、あるじの 目の 色が 変わる。</p>`,
          q: 'きみは、この あるじに 自分を どう 売り込む？',
          // Fork rebalanced (eval round1: A2 below-3 — もしも was an all-downside 罰リスト, canon a pure
          // win; both personas read it as 正解当てクイズ and chose hidenaga). Pilot fix (両側に魅力＋代償,
          // JOURNAL 4acba3f): A (絵かき) now a REAL other life — clean hands, paint freely — its cost only
          // 「かも」; canon B carries a genuine 代償 (真の絵は後回し・平和願いつつ戦のねじれを一生かかえる),
          // no longer pure win. 有名度 hammer (「最後の晩餐も馬も生まれなかった」) dropped — 中1 said
          // 13歳には結果の有名度でなく生き方が響く. Judgment stays open (どちらの きみも うそでは ない).
          choices: [
            { label: '「わたしは <ruby>絵<rt>え</rt></ruby>かきです」——手を よごさず、絵で 立つ', to: '3-c', effect: { miru: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 絵かきとして 名のって いたら……',
                body: `<p>きみは 戦の 道具で 手を よごさず、絵かきとして 正面から 立った ことに なる。<ruby>描<rt>か</rt></ruby>く 絵は だれかの 戦の ためでなく、きみ 自身の もの——<ruby>筆<rt>ふで</rt></ruby>の 向かう 先を、きみが 決める。それが きみの 本当の のぞみだった はずだ。</p><p>ただ、この <ruby>戦乱<rt>せんらん</rt></ruby>の 世で、あるじが いちばん 求めたのは <ruby>兵器<rt>へいき</rt></ruby>。絵の <ruby>注文<rt>ちゅうもん</rt></ruby>を 待つ だけでは、<ruby>宮廷<rt>きゅうてい</rt></ruby>の ふところ深くには 入れなかったかも しれない。——それでも、<ruby>筆<rt>ふで</rt></ruby>は きみの ものだ。絵に 生きるか、力の そばで 生きるか。どちらの きみも、うそでは ない。</p>` } },
            { label: '「わたしは 戦の 道具が 作れます」——ほしい ものを 差し出す', to: '3-c', canon: true, effect: { tamesu: 2 },
              hist: { verdict: '史実では', match: '戦の 道具を、まっさきに 売り込んだ',
                body: `<p><ruby>史実<rt>じじつ</rt></ruby>の きみは、手紙の 頭に <ruby>橋<rt>はし</rt></ruby>・<ruby>大砲<rt>たいほう</rt></ruby>・城を せめる 機械を ずらりと 並べ、「絵や <ruby>彫刻<rt>ちょうこく</rt></ruby>も できます」は 最後に ひとこと 添えただけ。その 手紙で、きみは 17年 つづく <ruby>居場所<rt>いばしょ</rt></ruby>を 手に 入れる。</p><p>だが 代わりに、きみの 手は 何年も <ruby>兵器<rt>へいき</rt></ruby>の <ruby>図面<rt>ずめん</rt></ruby>を 引き、いちばん 描きたい 絵は いつも 後回し。平和を 願った はずの きみが、戦の ために 頭を 使う——その ねじれを、きみは 一生 かかえる。</p>` } },
          ] },

        '3-c': { place: 'ミラノ・スフォルツァ<ruby>城<rt>じょう</rt></ruby>',
          text: `<p><ruby>手紙<rt>てがみ</rt></ruby>は 実を むすび、きみは スフォルツァの <ruby>宮廷<rt>きゅうてい</rt></ruby>に 入った。以後 <ruby>十七<rt>じゅうしち</rt></ruby>年、絵も、祝いの <ruby>演出<rt>えんしゅつ</rt></ruby>も、<ruby>兵器<rt>へいき</rt></ruby>の <ruby>図面<rt>ずめん</rt></ruby>も——たのまれる まま、なんでも 手がけた。</p>
            <p>中でも あるじが 望んだのは、<ruby>亡<rt>な</rt></ruby>き 父を たたえる <ruby>実物大<rt>じつぶつだい</rt></ruby>の <ruby>巨大<rt>きょだい</rt></ruby>な <ruby>青銅<rt>せいどう</rt></ruby>の <ruby>騎馬像<rt>きばぞう</rt></ruby>。きみは <ruby>粘土<rt>ねんど</rt></ruby>で <ruby>原型<rt>げんけい</rt></ruby>を 作り、街の 広場に すえた。見上げる ほどの 馬に、ミラノじゅうが おどろいた。</p>`,
          spark: 'え！？ 大<ruby>評判<rt>ひょうばん</rt></ruby>を とった あの <ruby>巨大<rt>きょだい</rt></ruby>な 馬は、<ruby>青銅<rt>せいどう</rt></ruby>に なる 前に こわされ、<ruby>兵士<rt>へいし</rt></ruby>たちの 弓の <ruby>的<rt>まと</rt></ruby>に された？',
          deep: { q: 'あの 馬は、どう なったの?',
            body: `<ruby>粘土<rt>ねんど</rt></ruby>の 馬は 大<ruby>評判<rt>ひょうばん</rt></ruby>だった。だが <ruby>青銅<rt>せいどう</rt></ruby>で <ruby>鋳<rt>い</rt></ruby>る 前に、1499年、フランス<ruby>軍<rt>ぐん</rt></ruby>が ミラノに せめこんだ。あるじは <ruby>失脚<rt>しっきゃく</rt></ruby>し、きみは 街を 出る。のこされた 粘土の 馬は、せめて きた <ruby>兵士<rt>へいし</rt></ruby>たちの 弓の 的に されて こわれた、と 伝えられる。用意した <ruby>青銅<rt>せいどう</rt></ruby>は <ruby>大砲<rt>たいほう</rt></ruby>に 化けた、という 話も あるが、こちらは たしかめきれない。`,
            cite: '※ <ruby>粘土<rt>ねんど</rt></ruby>の <ruby>巨大<rt>きょだい</rt></ruby>馬と 大<ruby>評判<rt>ひょうばん</rt></ruby>は たしか（◎）。弓の 的は 伝わる 話（○）。<ruby>青銅<rt>せいどう</rt></ruby>が <ruby>大砲<rt>たいほう</rt></ruby>に、は はっきりしない（△）。',
            confidence: '○' },
          onEnter: { cards: ['w-jisenjo', 'w-uma'] },
          next: '3-d' },

        '3-d': { place: '第3章 むすび',
          text: `<p>売り込みの <ruby>手紙<rt>てがみ</rt></ruby>も、<ruby>十七<rt>じゅうしち</rt></ruby>年の <ruby>宮廷<rt>きゅうてい</rt></ruby>も、あの <ruby>巨大<rt>きょだい</rt></ruby>な 馬も——きみが 力を そそいだ ものの 多くは、"仕上がる" 前に、世の中の ほうが 先に 変わって しまった。</p>
            <p>それでも きみは、次の 街で また 新しい ことを 始める。——<ruby>手<rt>て</rt></ruby>がかりが 一つ、<ruby>手帳<rt>てちょう</rt></ruby>に くわわった。</p>`,
          creed: { line: '「まず、<ruby>門<rt>もん</rt></ruby>を たたく ための 顔が いる。——<ruby>本当<rt>ほんとう</rt></ruby>の 顔は、入ってから 見せれば いい。」',
            act: '——きみは 戦の 道具を 売り込んで、<ruby>宮廷<rt>きゅうてい</rt></ruby>の 門を くぐった。そして 中では、絵を 描き、馬を 作り、空を とぶ 夢の <ruby>図面<rt>ずめん</rt></ruby>を 引いた。' },
          onEnter: { clues: ['clue-3'] },
          end: true },
      },
    },
    {
      // Device = 観察ビュー on a NEW 習作ページ (design §7「観察＋えっ！？」). ch1 observes NATURE
      // (渦/鳥/球/葉); ch4 observes a MADE thing — the composition itself — so the engine gained the
      // 構図 vocabulary (perspective/table/person/figures, art/study.ts) rather than reusing the
      // nature primitives. The 剥落 is NOT drawn — three attempts all read as an object (葉/木/岩),
      // in eval and in family play alike; the decay is carried by spark/deep/本文 instead.
      //   The fork「安全なフレスコ or 新しいやり方」= the riddle facet clue-4 (ためす vs 仕上げる).
      // 両側に魅力＋代償: もしも(フレスコ) is a REAL other life (the picture would still be sharp
      // today) whose cost is only「かも」; canon(ためす) yields the ざわめき he could only catch by
      // standing and re-looking, and carries the genuine 代償 (it decayed in his own lifetime).
      // サライ carries the safe side's 声 (WRITING 原則4 — the other option is spoken by a person,
      // not listed as a downside), and grants the ch4 person card.
      //   史料批判 type differs from ch2(後世伝記 vs 現代研究)/ch6(同時代の走り書き)/ch7(通説の製造元):
      // here the EVIDENCE IS THE OBJECT — the painting's own decay, corroborated by a visitor's 1517
      // note (research §3-8). むすび closer「はさまった」differs from ch1 動きはじめた / ch2 残った /
      // ch3 くわわった / ch5 落ちた / ch6 のぞいてみよう (隣接非重複). もしも body avoids the ch3×ch5
      // 「だれの 戦の ためでもなく きみの もの」syntax (BACKLOG drift note). No scene map (one room).
      id: 4, num: '四', title: '最後の 晩餐', years: '1495〜1499',
      lead: 'じっくり 直しながら 描きたくて、きみは 新しい 技法を ためす。その ために、絵は すぐに 傷みはじめる。',
      start: '4-a',
      teaser: 'ミラノが 落ちる。きみは 旅に 出る。次に つかえる 相手は——<ruby>暴君<rt>ぼうくん</rt></ruby>チェーザレ・ボルジア。',
      scenes: {
        '4-a': { place: 'ミラノ・<ruby>修道院<rt>しゅうどういん</rt></ruby>の <ruby>食堂<rt>しょくどう</rt></ruby>',
          monologue: '（人の 心の うごきは、顔だけでは 出ない。手が、背中が、しゃべる。）',
          text: `<p><ruby>宮廷<rt>きゅうてい</rt></ruby>に 入って 十年あまり。ミラノ<ruby>公<rt>こう</rt></ruby>スフォルツァが、街の <ruby>修道院<rt>しゅうどういん</rt></ruby>（<ruby>祈<rt>いの</rt></ruby>る 人たちが 集まって 暮らす ところ）を 一族の 大切な 場に 作りかえて いた。その 食堂の 大きな 壁が、きみに まかされる。キリストと 十二人の <ruby>弟子<rt>でし</rt></ruby>が、さいごの 食事を する 場面だ。</p>
            <p>きみは 決めた。描くのは、しずかな 食事では ない。「この 中の ひとりが、わたしを うらぎる」——その ひとことが 落ちた、たった 一<ruby>瞬<rt>しゅん</rt></ruby>。おどろき、いかり、うたがい。十二人の 心が いっせいに うごく、その ざわめきを 壁の 上に 止める。</p>`,
          next: '4-b' },

        '4-b': { place: 'ミラノ・<ruby>修道院<rt>しゅうどういん</rt></ruby>の <ruby>食堂<rt>しょくどう</rt></ruby>',
          monologue: '（フレスコは、しっくいが かわく 前に 一気に 描く。……あとから 直せない。）',
          text: `<p>壁の 絵には、昔からの やり方が ある。フレスコ——壁に ぬった ばかりの しっくい（<ruby>白<rt>しろ</rt></ruby>い かべ土）が かわく 前に、その 日の ぶんを 一気に 描く。かわけば 色は 壁の 中に しみこみ、何百年も もつ。かわりに、あとから 手は 入れられない。</p>
            <p><ruby>弟子<rt>でし</rt></ruby>の <face pid="p-salai">サライ</face>が、こねた しっくいを かかえて 言う。</p>
            <p class="speak">「先生、いつもの フレスコで 行きましょうよ。みんな そう して います」</p>
            <p>だが きみは、何日でも この 壁の 前に 立ち、見て、直したい。——その ための <ruby>絵<rt>え</rt></ruby>の具の 使い方が、頭に ある。<ruby>板<rt>いた</rt></ruby>の 絵の やり方を、そのまま 壁に もちこむのだ。</p>`,
          q: 'きみは、どちらの やり方で 描く？',
          onEnter: { card: 'p-salai' },
          choices: [
            { label: 'いつもどおり フレスコで、一気に 仕上げる', to: '4-c', effect: { miru: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 昔からの やり方で 描いて いたら……',
                body: `<p>絵の具は しっくいの 中まで しみこんで 壁と ひとつに なり、この 一枚は 五百年 たっても はっきりした ままだった かも しれない。人は いま、きみが 見た とおりの 色を 見られたかも しれない。</p><p>ただ、その やり方では、かわく 前に 描ききるしか ない。何日も 立ちどまって、ひとりの 手を もう ひとなで する——あの <ruby>時間<rt>じかん</rt></ruby>は、きみの ものに ならなかった。</p>` } },
            { label: '新しい やり方を ためす。<ruby>直<rt>なお</rt></ruby>しながら 描く', to: '4-c', canon: true, effect: { tamesu: 2 },
              hist: { verdict: '史実では', match: 'かわいた 壁に、新しい <ruby>絵<rt>え</rt></ruby>の具を ためした',
                body: `<p><ruby>史実<rt>じじつ</rt></ruby>の きみは、かわいた 壁の 上に、<ruby>油<rt>あぶら</rt></ruby>を まぜた 絵の具を のせた。何日も 足場の 上で 立ちつくし、ひと筆 入れては また 見つめる。だからこそ、十二人の ざわめきが 壁の 上で 生きた。</p><p>だが その 絵の具は、壁と なじまなかった。きみが まだ 生きて いる うちに、絵は もう 傷みはじめる。よく 見る ための やり方が、絵の いのちを けずった。</p>` } },
          ] },

        '4-c': { place: 'ミラノ・<ruby>修道院<rt>しゅうどういん</rt></ruby>の <ruby>食堂<rt>しょくどう</rt></ruby>',
          study: 'ch4',
          text: `<p><ruby>足場<rt>あしば</rt></ruby>に のぼり、きみは 壁に 向かう。まず 引くのは、色では なく 線だ。天井、かべ、まどの ふち——すべての 線が、まん中の たった 一点に 集まるように。</p>
            <p>その 一点の 先に、しずかな 顔を ひとつ 置く。まわりでは 十二人が 手を あげ、体を ねじり、となりへ 顔を 向けて いる。</p>`,
          observe: { prompt: 'きみの 下絵を 指で なぞって みよう。きみは、何を 組み立てた？',
            hotspots: [
              { id: 'ob4-vanish', nodeId: 'n-okuyuki', x: 0.5, y: 0.472, r: 0.075, essential: true,
                caption: '線が すべて、たった 一点へ 集まる。見る 人の 目は、いやでも まん中へ 引きよせられる。' },
              { id: 'ob4-hands', x: 0.65, y: 0.6, r: 0.085, essential: true,
                caption: '手、手、手。だれも しゃべって いないのに、うでの うごきだけで「まさか」と 聞こえる。' },
              { id: 'ob4-left', x: 0.35, y: 0.6, r: 0.085,
                caption: 'こちらの 三人は、ふりむき、身を のり出す。同じ ひとことを 聞いた のに、うごき方が ひとりずつ ちがう。' },
            ] },
          spark: 'え！？ 世界じゅうが 見に くる この 壁の 絵、きみが まだ 生きて いる うちから、もう 傷みはじめて いた？',
          deep: { q: 'なぜ、そんなに 早く 傷んだの?',
            body: `ふつうの <ruby>壁画<rt>へきが</rt></ruby>（フレスコ）は、かわく 前の しっくいに 描くので、絵の具が 壁と ひとつに なる。きみは 直しながら 描きたくて、かわいた 壁の 上に <ruby>油<rt>あぶら</rt></ruby>まじりの 絵の具を のせた。それは 壁と くっつかず、しめり気に とても 弱い。きみが 死ぬ 一年半ほど 前、この 絵を 見に 来た 人が「もう 傷みはじめて いる」と 書き<ruby>残<rt>のこ</rt></ruby>した。`,
            cite: '※ 実験的な やり方で、きみの 生前から 傷みはじめた＝たしか（◎）。1517年の 見学者の <ruby>記録<rt>きろく</rt></ruby>が 残る（◎）。——この 話は <ruby>伝記<rt>でんき</rt></ruby>でなく、絵そのものが <ruby>証人<rt>しょうにん</rt></ruby>。',
            confidence: '◎' },
          onEnter: { card: 'w-bansan' },
          next: '4-d' },

        '4-d': { place: '第4章 むすび',
          text: `<p>ざわめきは、壁の 上に 止まった。この 一枚は たちまち 名高く なり、遠くから 人が 見に くる。だが 同じ ころ、絵の 表面では、絵の具が しずかに 浮きはじめて いた。</p>
            <p>ためした から 描けた。ためした から 傷んだ。——四つめの <ruby>手<rt>て</rt></ruby>がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に はさまった。</p>`,
          creed: { line: '「<ruby>安全<rt>あんぜん</rt></ruby>な やり方は、たしかに 長もちする。だが おれが 見た ものは、それでは <ruby>残<rt>のこ</rt></ruby>せない。」',
            act: '——きみは かわいた 壁に、<ruby>板<rt>いた</rt></ruby>の 絵に つかう 絵の具を のせた。その 一枚は 傷みながら、五百年 たった いまも、人を 呼び<ruby>続<rt>つづ</rt></ruby>けて いる。' },
          onEnter: { clues: ['clue-4'] },
          end: true },
      },
    },
    {
      // Device = SCENE MAP (design §7「ここで地図が主人公自身の作品として輝く＋矛盾の頂点」). Written
      // unattended (map-device chapter, like ch3; the 観察ビュー chapters ch1/ch4 stay blocked on the
      // unbuilt 習作ページ art). The イモラ都市図 can't be drawn as a street plan by the geo engine, so
      // the 山場 is carried by prose + w-imola card + spark/deep, while the scene map re-frames the SAME
      // geo point イモラ across the chapter: 5-a = 暴君ボルジアの陣 (fear), 5-c = きみが真上から描いた街
      // (the one thing he rarely finished). The fork「暴君に力を貸すか」= 作品最大の暗い岐路 = 大目標2
      // の頂点 (平和を願いつつ最も恐れられた男に目と手を貸す, research §4-3). Register from ch3/ch6 is
      // applied in the FIRST draft (JOURNAL 2026-07-19): 両側に魅力＋代償 — もしも(拒む) is a REAL other
      // life (clean hands + free eye), its cost only 「かも」; canon(仕える) yields a genuine achievement
      // (イモラ図 = 珍しく仕上げた ◎) but carries the darkest 代償 (serving a tyrant). Judgment stays open.
      // Cesare gets a 声 (research §4-6 / ch3 park の是正 = 敵役にも声を, WRITING 原則4). 恐怖・残酷は
      // 見世物化しない (VISION アンチゴール): 暴君性は「力で街を従える最も恐れられた男」水準に留め、処刑等の
      // 描写はしない.
      id: 5, num: '五', title: 'ボルジアの 軍師', years: '1502〜1503',
      lead: '平和を 願いながら、暴君の ために 戦の 道具を 作る。その 手で、真上から 見た イモラの 地図を 描く。',
      start: '5-a',
      teaser: 'フィレンツェへ 戻り、ひとりの 女性の <ruby>肖像<rt>しょうぞう</rt></ruby>を 描きはじめる。その 名は、モナ・リザ。',
      scenes: {
        '5-a': { place: 'ロマーニャ・イモラ',
          monologue: '（ミラノは 落ちた。ミラノ<ruby>公<rt>こう</rt></ruby>は とらわれ、おれには もう、絵を たのむ <ruby>主<rt>あるじ</rt></ruby>が いない。）',
          text: `<p>ミラノが フランス<ruby>軍<rt>ぐん</rt></ruby>に 落ちて、きみは <ruby>主<rt>あるじ</rt></ruby>を なくした。<ruby>戦乱<rt>せんらん</rt></ruby>の イタリアを、あても なく さまよう。</p>
            <p>そんな きみに、声が かかった。——イタリアで もっとも <ruby>恐<rt>おそ</rt></ruby>れられた 男、<face pid="p-cesare">チェーザレ・ボルジア</face>。<ruby>教皇<rt>きょうこう</rt></ruby>（キリスト<ruby>教<rt>きょう</rt></ruby>の いちばん えらい 人）の 子で、軍を ひきいて 次々と 街を したがえる、若い <ruby>大将<rt>たいしょう</rt></ruby>だ。ほしいのは 絵ではない。城を <ruby>攻<rt>せ</rt></ruby>め、守る ための「<ruby>軍事技師<rt>ぐんじぎし</rt></ruby>」。</p>
            <p>きみは、その <ruby>陣<rt>じん</rt></ruby>を たずねた。冷たい 目が、まっすぐ きみを 見た。</p>
            <p class="speak">「<ruby>天使<rt>てんし</rt></ruby>は いらぬ。おれに 要るのは、この 土地の すみずみを 知る 目だ」</p>`,
          onEnter: { card: 'p-cesare' },
          next: '5-b' },

        '5-b': { place: 'ロマーニャ・イモラ',
          monologue: '（この 男は、力で 人を したがえる。手を 貸せば、おれの 目と 手は、戦の ために つかわれる。）',
          text: `<p>ボルジアが 求めるのは、城を 攻め 落とす ための <ruby>図面<rt>ずめん</rt></ruby>と、土地の 正確な <ruby>地図<rt>ちず</rt></ruby>。引き受ければ、<ruby>宮廷<rt>きゅうてい</rt></ruby>のような 後ろだてと、思う ぞんぶん 歩いて 測れる 街が 手に 入る。</p>
            <p>だが 相手は、イタリアで いちばん 恐れられた 男。<ruby>平和<rt>へいわ</rt></ruby>を 願う はずの きみが、その 力に、目と 手を 貸すのか。</p>`,
          q: 'きみは、この <ruby>暴君<rt>ぼうくん</rt></ruby>に 力を 貸す？',
          choices: [
            { label: '「<ruby>暴君<rt>ぼうくん</rt></ruby>の 手つだいは しない」——<ruby>背<rt>せ</rt></ruby>を 向けて 立ち去る', to: '5-c', effect: { miru: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 暴君に 手を 貸さず、自由な まま 歩いて いたら……',
                body: `<p>きみの 目と 手は、だれの 戦の ためでもなく、きみ だけの もの。いちばん 恐ろしい 男の そばに 身を 置かずに すむ。何を 見るかを、きみ 自身が 決める。</p><p>ただ、<ruby>戦乱<rt>せんらん</rt></ruby>の イタリアで、<ruby>主<rt>あるじ</rt></ruby>を もたぬ まま。街ぜんたいを 歩いて 測る——あの、めずらしく 仕上がる 大仕事の <ruby>機会<rt>きかい</rt></ruby>も、来なかった かもしれない。手を よごさず に いれば、手に しない ものも ある。</p>` } },
            { label: '「その 力、お<ruby>貸<rt>か</rt></ruby>し しましょう」——最も 恐ろしい 男の <ruby>軍師<rt>ぐんし</rt></ruby>に なる', to: '5-c', canon: true, effect: { tamesu: 2 },
              hist: { verdict: '史実では', match: '<ruby>暴君<rt>ぼうくん</rt></ruby>の 軍師に なり、街の 地図を 描いた',
                body: `<p><ruby>史実<rt>じじつ</rt></ruby>の きみは 引き受けた。各地を 回り、イモラの 街を 自分の 足で 歩いて 測り、真上から 見た 正確な <ruby>地図<rt>ちず</rt></ruby>を 作りあげる——きみが、めずらしく きちんと 仕上げた 仕事だ。</p><p>だが その 目と 手は、いちばん 恐れられた 男の ものに なった。街を こわす その 力に、きみの するどい 目を 貸した。——この ことは、もう、なかった ことには できない。</p>` } },
          ] },

        '5-c': { place: 'ロマーニャ・イモラ',
          text: `<p>きみは ボルジアに <ruby>従<rt>したが</rt></ruby>い、ロマーニャの 各地を 回った。中でも イモラの 街で、きみは めずらしい ことを した。</p>
            <p>街路を 自分の 足で 歩いて 長さを 測り、<ruby>広場<rt>ひろば</rt></ruby>の <ruby>塔<rt>とう</rt></ruby>に のぼって <ruby>方位<rt>ほうい</rt></ruby>を 取る。そうして、まるで 空の 上から 見おろした ように、街ぜんたいを 正確な 円の 中に 描いた。</p>`,
          spark: 'え！？ <ruby>暴君<rt>ぼうくん</rt></ruby>の ための この 地図が、じつは「<ruby>地図<rt>ちず</rt></ruby>の 描き方」そのものを 変えた 一枚だった？',
          deep: { q: '真上から 見た 地図の、何が すごいの?',
            body: `それまでの 地図は、ななめから 見た 絵のようで、正確さより 見た目を 大事に して いた。きみの イモラ図は、歩いて 測った 長さと <ruby>方位<rt>ほうい</rt></ruby>だけで 街を <ruby>割<rt>わ</rt></ruby>り出した「真上からの 正確な <ruby>平面図<rt>へいめんず</rt></ruby>」。いまの 地図に つながる 描き方の、大きな <ruby>転換点<rt>てんかんてん</rt></ruby>の 一つと される。<ruby>皮肉<rt>ひにく</rt></ruby>にも それは、街を 攻め 守る ための 図だった。`,
            cite: '※ きみが 歩いて 測り、真上から 描いたのは たしか（◎）。「地図の <ruby>転換点<rt>てんかんてん</rt></ruby>」は、そう <ruby>評価<rt>ひょうか</rt></ruby>する <ruby>研究<rt>けんきゅう</rt></ruby>に よる（○）。',
            confidence: '◎' },
          onEnter: { card: 'w-imola' },
          next: '5-d' },

        '5-d': { place: '第5章 むすび',
          text: `<p><ruby>役<rt>やく</rt></ruby>に 立つ 地図は、きちんと 仕上がった。だが きみは もう、この 街の 水路を どう 変えれば ゆたかに なるか、体の 中の 血は どう めぐるか——次から 次へ、別の「なぜ？」へ 移って いく。</p>
            <p><ruby>暴君<rt>ぼうくん</rt></ruby>の 仕事には、はっきりと「終わり」が あった。けれど、きみの「知りたい」には、終わりが 来ない。——五つめの <ruby>手<rt>て</rt></ruby>がかりが、<ruby>手帳<rt>てちょう</rt></ruby>に 落ちた。</p>`,
          creed: { line: '「<ruby>役<rt>やく</rt></ruby>に 立つ ものには、終わりが ある。だが、<ruby>知<rt>し</rt></ruby>りたい ことには、終わりが ない。」',
            act: '——きみは、<ruby>暴君<rt>ぼうくん</rt></ruby>の ための 地図を 仕上げた その 手で、また 別の「なぜ？」の ほうへ、歩き出した。' },
          onEnter: { clues: ['clue-5'] },
          end: true },
      },
    },
    {
      // ★PILOT CHAPTER (design §7「一枚で見る 第六章」・WRITING 10). Written first, at final register, to
      // fix the work's tone AND exercise the full new device suite end-to-end: the 観察ビュー on a closeup
      // of リザ (6-b) seeds stars, the つながり図鑑 connects ほほえみ×まなざし into the invention スフマート,
      // and the 史料批判 gem (「モナ・リザは 誰か」= 2005 の欄外書き込み, research §3-4) lands in the むすび
      // — the ieyasu しかみ像 slot, two-stage confidence ☆→◎. The riddle-serving fork is 仕上げる vs 手を
      // 入れ続ける: canon is NOT finishing (he carried it to France, ◎), so the choice cashes the overarching
      // riddle「なぜ完成させなかったか」right here. 解剖 is touched with 畏れと倫理 only (spark/deep, no gore;
      // sexual orientation untouched — research §0). Other chapters stay stubs until their own writing cycle.
      id: 6, num: '六', title: 'モナ・リザと 解剖', years: '1503〜1516',
      lead: '<ruby>絹商人<rt>きぬしょうにん</rt></ruby>の 妻の ほほえみを 描きながら、きみは 死体を 切り開き、体の 中の うずを 写す。',
      start: '6-a',
      teaser: 'フランスの 王が、きみを 招く。アルプスを こえた 先に、きみの <ruby>最期<rt>さいご</rt></ruby>が ある。',
      scenes: {
        '6-a': { place: 'フィレンツェ',
          monologue: '（この 人の 口もと——笑って いるのか、いないのか。見れば 見るほど、分からなく なる。）',
          text: `<p>ミラノを 出て、きみは <ruby>故郷<rt>こきょう</rt></ruby>フィレンツェに 戻って いた。もう 五十を こえた、名の 知れた <ruby>巨匠<rt>きょしょう</rt></ruby>だ。</p>
            <p>ある <ruby>絹商人<rt>きぬしょうにん</rt></ruby>が、妻の <ruby>肖像<rt>しょうぞう</rt></ruby>を 注文して きた。名は <face pid="p-lisa">リザ</face>。ふつうなら、数か月で 仕上げる ただの 一枚だ。</p>
            <p>ところが きみは、その 顔を 前に、<ruby>筆<rt>ふで</rt></ruby>を とる より 先に、ただ じっと 見つめて しまう。——この 口もとは、どこを 見れば つかまえられるのか、分からない。</p>
            <p>リザが、ふと 顔を 上げた。</p>
            <p class="speak">「そんなに 見つめられては、こまります」</p>
            <p>きみは 答えない。まだ、この 顔から 目を はなせない。</p>`,
          onEnter: { card: 'p-lisa' },
          next: '6-b' },

        '6-b': { place: 'フィレンツェ・<ruby>工房<rt>こうぼう</rt></ruby>',
          closeup: { tone: 'serene', cast: [ { face: 'p-lisa', name: 'リザ' } ] },
          text: `<p>きみは、だれよりも 近くから、この 顔を 見る。口の はし。目の ふち。かみの ながれ。——一つ 一つを、写す 前に、まず つかまえる。</p>
            <p>生きて いる ように ほほえませる ため、きみは 死んだ 人の 顔の 皮の 下まで <ruby>見<rt>み</rt></ruby>た。どの <ruby>筋<rt>すじ</rt></ruby>が うごくと、口の はしが 上がるのか。<ruby>畏<rt>おそ</rt></ruby>れを もって、体の 中を のぞきこむ。</p>`,
          observe: { prompt: 'リザの 顔を、指で なぞって みよう。きみは、何を つかまえた？',
            hotspots: [
              { id: 'ob6-smile', nodeId: 'n-smile', x: 0.5, y: 0.735, r: 0.058, essential: true,
                caption: '口の はし——笑って いるのか いないのか、見る たびに 変わる。' },
              { id: 'ob6-eyes', nodeId: 'n-eyes', x: 0.565, y: 0.57, r: 0.058, essential: true,
                caption: '目——まるで 生きた 人のように、しっとりと うるんで 見える。' },
              { id: 'ob6-curl', nodeId: 'n-curl', x: 0.30, y: 0.52, r: 0.062,
                caption: 'かみの ながれ——ひとすじ ひとすじが、水の ように ながれて いる。' },
            ] },
          spark: 'え！？ この ほほえみ ひとつの ために、きみは <ruby>死体<rt>したい</rt></ruby>を 切り開いた？ しかも <ruby>心臓<rt>しんぞう</rt></ruby>の 中で「血の うず」を 見つけ、500年 あとの 医学が それを 確かめた？',
          deep: { q: 'ほほえみを 描く のに、なぜ 死体を?',
            body: `ほんとうだ。きみは 死んだ 人の 体を 自分の 手で 切り開き、<ruby>骨<rt>ほね</rt></ruby>や <ruby>筋肉<rt>きんにく</rt></ruby>を 何百枚も 写生した。「よく 見る」ためだ。<ruby>心臓<rt>しんぞう</rt></ruby>では、血が うずを 巻いて <ruby>弁<rt>べん</rt></ruby>を 閉じるのを 助けると 考え、スケッチに 残した。約500年 あとの 2014年、<ruby>医師<rt>いし</rt></ruby>が 新しい MRIで 生きた 人の 心臓を のぞくと、その うずは 本当に あった。まだ 少ない 人の しらべだが、きみの 目は 正しかった。`,
            cite: '※ 観察して スケッチしたのは たしか（◎）。近ごろ MRIで 確かめられたのは ほんの 少しの 人（○）。それでも、500年 ごしに 目が 合った。',
            confidence: '◎' },
          onEnter: { card: 'w-kaibo' },
          next: '6-b2' },

        // 1504 市庁舎の競作 (research §2 年表・§4-6). Grants p-michelangelo — the 好敵手 card was
        // defined with a face and a relation-wheel edge but NO scene granted it, so completion was
        // structurally unreachable (the 淀殿 class; tests/card-reachability.ts now gates davinci).
        // 1シーン＝1つの絵 (WRITING 1) = 向かいの壁と、街での 一言の 刺し傷. The ch4「実験ゆえに未完」
        // lesson is NOT re-taught here (絵具が流れ落ちた is one line): this beat's subject is the RIVAL.
        // The 皮肉 sits in the 主線 as a 声 (WRITING 2「感情は要約しない」) and its 出どころ goes to deep
        // (WRITING 4「留保は装置で」) — 同時代のメモ(○) vs ヴァザーリ伝記, the work's 史料批判 spine.
        '6-b2': { place: 'フィレンツェ・<ruby>市庁舎<rt>しちょうしゃ</rt></ruby>',
          text: `<p>その ころ、市庁舎に 大きな 壁が 二つ。一つは きみ、もう 一つは 23さい 年下の <face pid="p-michelangelo">ミケランジェロ</face>——石を 彫る 名人だ。</p>
            <p>きみは 馬と 人が もみ合う 戦を 描いた。<ruby>火鉢<rt>ひばち</rt></ruby>で 壁を あたためると、絵の具は とけて 流れ落ちた。</p>
            <p>広場で すれちがった とき、男は 言った。</p>
            <p class="speak">「青銅の 馬 ひとつ 作れず、放り出した 男が」</p>
            <p>ミラノに 置いてきた、粘土の ままの 馬。きみは 言い返さなかった。</p>`,
          deep: { q: 'この 皮肉、だれが 書き残したの？',
            body: `街で 二人が 言い合ったと 書き残したのは、同じ 時代を 生きた、名の わからない 人の メモ（だから「名なしの メモ」と 呼ばれる）。ずっと あとの <ruby>伝記<rt>でんき</rt></ruby>より 古い 記録だから、伝記だけの 話より 強い。でも、その 場で 聞いた 本人の ことばでは なく、人から 聞いた 話だ。だれが、いつ 書いたか——それが、話の 強さを 決める。`,
            cite: '※ 二人の 競作が どちらも 未完に 終わったのは たしか（◎）。街の 一言は、同じ 時代の メモに 残る 人づての 話（○）。',
            confidence: '○' },
          onEnter: { card: 'p-michelangelo' },
          next: '6-c' },

        '6-c': { place: 'フィレンツェ・<ruby>工房<rt>こうぼう</rt></ruby>',
          text: `<p>何年も 過ぎた。<ruby>絹商人<rt>きぬしょうにん</rt></ruby>は、とうに 出来上がった はずの 絵を 待って いる。だが きみは、まだ 口もとの ふちに 手を 入れて いる。</p>
            <p><ruby>弟子<rt>でし</rt></ruby>の <face pid="p-salai">サライ</face>が、あきれ顔で のぞきこんだ。</p>
            <p class="speak">「先生、絵は 手ばなして こそ 絵に なる。もう 十分 きれいだ——わたして、お金を もらいましょうよ」</p>
            <p>ここを もう ひとなで すれば、笑いが もっと <ruby>本物<rt>ほんもの</rt></ruby>に なる 気が する。——だが、<ruby>約束<rt>やくそく</rt></ruby>は 約束だ。</p>`,
          q: 'この 絵を、きみは どう する？',
          choices: [
            { label: '<ruby>約束<rt>やくそく</rt></ruby>どおり わたして、お金を もらう', to: '6-c2', effect: { tsunagu: 1 },
              hist: { verdict: 'もしもルート', moshimo: true, match: 'もし 早く わたして いたら……',
                body: `<p>きみは この 一枚に しばられず、<ruby>放<rt>ほう</rt></ruby>り出した ままの 何十枚もの 絵に、手を もどせたかも しれない。世界には いまより ずっと 多くの、"仕上がった レオナルド"が あった——かも しれない。</p><p>どちらが よかったかは、だれにも 言えない。<ruby>史実<rt>じじつ</rt></ruby>の きみは、この 一枚を えらんだ。</p>` } },
            { label: 'まだ 手を 入れたい。<ruby>手<rt>て</rt></ruby>ばなさない', to: '6-c2', canon: true, effect: { tamesu: 2 },
              hist: { verdict: '史実では', match: '手ばなさなかった。死ぬまで、そばに 置いた',
                body: `<p>きみは この 絵を 商人に わたさず、十年 あまり 持ち歩いた。<ruby>絹商人<rt>きぬしょうにん</rt></ruby>は、ついに 妻の 顔を 受けとれなかった。</p><p>最後は アルプスを こえて フランスまで 連れて いく。"<ruby>未完<rt>みかん</rt></ruby>"の まま なで続けた その 一枚を 見る ために、いまも 世界じゅうから 人が パリの <ruby>美術館<rt>びじゅつかん</rt></ruby>へ やって 来る——<ruby>放<rt>ほう</rt></ruby>り出した ままの、ほかの 絵たちを 置いて。</p>` } },
          ] },

        // 1513〜16 ローマ (research §2 年表・§4-4). Grants p-giuliano — the other card no path granted.
        // It is also the journey map's MISSING LEG: ローマ appears in GAZ but no scene ever staged it,
        // so 宮廷から宮廷への旅 (design §2) skipped a court. SCENE_MAPS['6-c2'] anchors it.
        // The beat answers the through-line from the patron's side: 完成させないことを ゆるした 人が いた
        // ——「注文が 来ない 三年」に 手記が いちばん ぶあつく なった (research §4-4 の 研究へ沈む). 庇護者に
        // 声を (WRITING 原則4). Ends by picking up あの一枚, handing ch7 the Alps crossing.
        '6-c2': { place: 'ローマ・<ruby>宮殿<rt>きゅうでん</rt></ruby>',
          text: `<p>やがて、ローマに 招かれた。<ruby>教皇<rt>きょうこう</rt></ruby>の 弟 <face pid="p-giuliano">ジュリアーノ</face>が、部屋と 毎月の お金を くれた。</p>
            <p>だが、大きな 絵の 注文は 来ない。「あの 男は 死んだ 人の 体を 切って いる」と 言いつけられ、<ruby>解剖<rt>かいぼう</rt></ruby>も 止まった。</p>
            <p class="speak">「急がなくて よい。好きな ものを 見て いなさい」</p>
            <p><ruby>鏡<rt>かがみ</rt></ruby>が 光を どう 曲げるか を しらべ、<ruby>沼<rt>ぬま</rt></ruby>の 水を ぬく 道を 考えた。注文の ない 三年。きみは 手を 止めなかった。</p>
            <p>1516年、ジュリアーノが 死ぬ。部屋を 出る とき、きみは あの 一枚を 荷に 入れた。</p>`,
          onEnter: { card: 'p-giuliano' },
          next: '6-d' },

        '6-d': { place: '第6章 むすび',
          text: `<p>あとの 世は、この 一枚に いくつもの 話を つけた。だれの 顔なのかさえ、長い あいだ わからず、たくさんの 説が 立った。</p>
            <p>それでも——<b>きみが この 絵を 死ぬまで 手ばなさず、なで続けた ことだけは、消えない</b>。なぜ、きみは 手ばなさなかったのか。——<ruby>手<rt>て</rt></ruby>がかりを ひとつ。<ruby>手帳<rt>てちょう</rt></ruby>を のぞいて みよう。</p>`,
          spark: 'え！？「あの ほほえみの 人は だれか」——500年 だれにも わからなかった なぞが、2005年、たった 一枚の 走り書きの <ruby>発見<rt>はっけん</rt></ruby>で、ほぼ 決まった？',
          deep: { q: '「モナ・リザは 誰か」は、どう わかったの？',
            body: `2005年より 前は、じつは <ruby>諸説<rt>しょせつ</rt></ruby>だらけだった——きみ 自身の 顔だ、どこかの 王女だ、べつの 美女だ……どれも 決め手を 欠いた（たしかさマーク ☆〜△）。決め手は、マキャヴェッリの <ruby>秘書<rt>ひしょ</rt></ruby>が 1503年に 本の はしへ 書いた 一行「レオナルドは 今 リザの 顔を 描いている」。同じ 時代の 人の メモだから 強い（◎）。500年 消えなかった なぞが、走り書き 一枚で ほどけた。`,
            cite: '※ 諸説（☆）から 決め手（◎）へ。——古くて、その 場に 近い 記録 一枚が、なぞを 変える。',
            confidence: '◎' },
          creed: { line: '「おれは、<ruby>仕上<rt>しあ</rt></ruby>げる ために 描くのでは ない。もっと よく 見る ために 描く。」',
            act: '——だから きみは、モナ・リザを 死ぬまで 手ばなさなかった。<ruby>手記<rt>しゅき</rt></ruby>には、こう ある。「<ruby>知<rt>ち</rt></ruby>は <ruby>経験<rt>けいけん</rt></ruby>の むすめだ」。<ruby>学校<rt>がっこう</rt></ruby>にも 行けなかった きみは、世界そのものを 先生に した。' },
          onEnter: { cards: ['w-monalisa'], clues: ['clue-6'] },
          end: true },
      },
    },
    {
      // ★FINALE (design §7「終 フランス、最期」). Devices = 対面の場(closeup) ＋ creed 総括 ＋ 未完の図鑑が
      // 完成 ＋ 隠しページ. The HIDDEN page (meta.ts) and clue-7 (clues.ts) were written at skeleton time
      // and unlock on this chapter's end:true — so ch7 is the KEY that opens them. Shape follows the house
      // 終章 grammar (ieyasu ch7): a 答え合わせ scene (showClues + every choice a valid answer / answer:N)
      // lets the CHILD answer the overarching riddle (VISION「判断は子どもに残す」/ design §3「答えは子どもが
      // 出す」), then むすび + creed. No 観察ビュー/graph here (would touch the pilot graph.ts + need the
      // unbuilt 習作ページ art) — so this finale is UNBLOCKED for unmanned writing, like ch3/ch5.
      //   Strand B (史料批判) CAPSTONE: the whole game the child checked where each tale came from; ch7 names
      // the single source behind many of them — ヴァザーリ『美術家列伝』(w-vasari). The 王の腕の中で死んだ
      // legend is Vasari's 脚色 (research: 王 was at another château that day). This is a DISTINCT 史料批判 type
      // from ch2/ch6's「後世の伝記 vs 同時代の記録」(BACKLOG drift note) = 通説の製造元を名指す.
      //   Register from ch2/3/5/6: 対面 closeup POV = the OTHER face only (フランソワ王, like 6-b リザ / 2-c
      // 師); 敵役でなく庇護者に声を (WRITING 原則4); the fork is 答え合わせ (answer:N, NOT a moshimo — so the
      // ch3×ch5 もしも統語テンプレ is not risked a third time, BACKLOG drift note). The riddle-reversal
      // 「完成しなかったんじゃない、つなぎ続けたんだ」is the thesis. Round-2 dedupe (eval: cumulative+VISION+両
      // ペルソナ all flagged a triple-verbatim of the exact punchline across 7-c ans2 body / clue-7 / HIDDEN):
      // the verbatim sentence now lives in only TWO surfaces — clue-7 (the collected 手帳 synthesis, all readers)
      // + HIDDEN (the full-card-completion bonus) — genuinely different collection moments. Each 7-c answer states
      // its facet in ITS OWN words (no shared punchline sentence), so the child ARRIVES at the idea rather than
      // being handed one canonical line; creed uses the show-not-tell「『これで完成』のページが一枚もない」form and
      // 7-d moves FORWARD (the notebook is handed to メルツィ and still read today) instead of re-arguing what 7-c
      // already said. メルツィ gets a 声 at the deathbed (B2 lift + the ieyasu「周囲の声が熱を運ぶ」lesson).
      //   漢字ルビの慣例（ch2-6 と共通）: 目/絵/手(alone)/水/空/体/血/世/名/声 = plain; 手記/手帳/
      // 天才/完成/伝記/弟子 = ruby. Grants all ch:7 cards (p-francois/p-melzi/w-shuki/w-vasari) so they are
      // reachable in the shipped work; p-leonardo (the protagonist card) is the 答え合わせ reward.
      id: 7, num: '終', title: 'フランス、最期', years: '1516〜1519',
      lead: 'アルプスを こえ、異国の 王に 敬われて 死ぬ。あとに 残るのは、どこまでも つながって「完」の 来ない、五千枚の 手記。',
      start: '7-a',
      scenes: {
        '7-a': { place: 'フランス・アンボワーズ',
          monologue: '（アルプスの 向こうに、絵を たのむ <ruby>主<rt>あるじ</rt></ruby>も、<ruby>競<rt>きそ</rt></ruby>い合う <ruby>好敵手<rt>こうてきしゅ</rt></ruby>も 置いて きた。ここには、ただ「見る 時間」だけが ある。）',
          closeup: { tone: 'solemn', cast: [ { face: 'p-francois', name: 'フランソワ1世' } ] },
          text: `<p>ローマで きみを 支えて くれた 人を なくした きみに、北の 国から 声が かかった。フランスの 若い <ruby>王<rt>おう</rt></ruby> <face pid="p-francois">フランソワ1世</face>だ。きみは <ruby>六十四<rt>ろくじゅうよん</rt></ruby>さい、アルプスを こえて、<ruby>異国<rt>いこく</rt></ruby>へ わたる。</p>
            <p><ruby>王<rt>おう</rt></ruby>は きみに、アンボワーズの クルー<ruby>館<rt>やかた</rt></ruby>と、「<ruby>王<rt>おう</rt></ruby>づきの <ruby>第一<rt>だいいち</rt></ruby>の <ruby>画家<rt>がか</rt></ruby>・<ruby>技師<rt>ぎし</rt></ruby>・<ruby>建築家<rt>けんちくか</rt></ruby>」の <ruby>位<rt>くらい</rt></ruby>を あたえた。大きな <ruby>注文<rt>ちゅうもん</rt></ruby>は しない。ただ、そばに いて ほしいと 言う。</p>
            <p class="speak">「あなたほど 物を 知る 人に、わたしは 会った ことが ない。何も <ruby>仕上<rt>しあ</rt></ruby>げなくて いい。ここで、好きな だけ 考えて ください」</p>`,
          onEnter: { card: 'p-francois' },
          next: '7-b' },

        '7-b': { place: 'フランス・アンボワーズ',
          monologue: '（この 手は、もう 思うように 動かない。だが、頭の 中の 絵は、まだ どこまでも つながって いく。）',
          text: `<p>クルー<ruby>館<rt>やかた</rt></ruby>で、きみは <ruby>三<rt>さん</rt></ruby>年を すごした。<ruby>右手<rt>みぎて</rt></ruby>は しびれて 思うように 動かなく なって いたが、それでも <ruby>手記<rt>しゅき</rt></ruby>の <ruby>線<rt>せん</rt></ruby>は、水から 空へ、空から 体の 中へと、つながる ことを やめなかった。</p>
            <p>1519年、きみは この <ruby>館<rt>やかた</rt></ruby>で <ruby>息<rt>いき</rt></ruby>を 引きとる。<ruby>六十七<rt>ろくじゅうしち</rt></ruby>さい。まくらもとには、いちばん 信じた <ruby>弟子<rt>でし</rt></ruby> <face pid="p-melzi">メルツィ</face>が いた。きみは <ruby>遺言<rt>ゆいごん</rt></ruby>で、五千枚の <ruby>手記<rt>しゅき</rt></ruby>を すべて、この 若者に <ruby>託<rt>たく</rt></ruby>した。</p>
            <p>メルツィは、その <ruby>手記<rt>しゅき</rt></ruby>の <ruby>束<rt>たば</rt></ruby>を 両手で 受けとり、しずかに 言った。</p>
            <p class="speak">「先生。……この 山ほどの「なぜ」を、かならず わたしが 守ります」</p>
            <p>——つなぎ<ruby>続<rt>つづ</rt></ruby>けた <ruby>網<rt>あみ</rt></ruby>を、次の 手へ。</p>`,
          onEnter: { cards: ['p-melzi', 'w-shuki', 'w-vasari'] },
          spark: 'え！？ きみの まくらもとに いたのは、<ruby>弟子<rt>でし</rt></ruby>の メルツィ。なのに <ruby>三十<rt>さんじゅう</rt></ruby>年 あまり あとの 本は、この 場面に フランス<ruby>王<rt>おう</rt></ruby>を 出した——「レオナルドは 王の うでの 中で <ruby>息<rt>いき</rt></ruby>を 引きとった」。その 日、王は 別の <ruby>城<rt>しろ</rt></ruby>に いたのに？',
          deep: { q: '王の うでの 中で 死んだ、って ほんとう?',
            body: `いかにも 美しい <ruby>話<rt>はなし</rt></ruby>だが、その 日の <ruby>王<rt>おう</rt></ruby>の <ruby>記録<rt>きろく</rt></ruby>を たどると、王は 遠く はなれた 別の <ruby>城<rt>しろ</rt></ruby>に いた。この 名場面を 広めたのも、あの ヴァザーリの <ruby>伝記<rt>でんき</rt></ruby>だ。「師が <ruby>筆<rt>ふで</rt></ruby>を 折った」も、この「<ruby>王<rt>おう</rt></ruby>の うで」も——きみが 死んで <ruby>三十<rt>さんじゅう</rt></ruby>年 あまり あと、<ruby>直接<rt>ちょくせつ</rt></ruby> きみを 知らない 人が 書いた、たった <ruby>一冊<rt>いっさつ</rt></ruby>の 本から 広まった。名場面ほど、もとを たしかめる。`,
            cite: '※ 王が その 日 別の <ruby>城<rt>しろ</rt></ruby>に いた <ruby>記録<rt>きろく</rt></ruby>は 残る（○）。「うでの 中で」は 後の <ruby>伝記<rt>でんき</rt></ruby>が 足した 話（☆）。',
            confidence: '○' },
          next: '7-c' },

        '7-c': { place: '<ruby>物語<rt>ものがたり</rt></ruby>を つらぬく <ruby>謎<rt>なぞ</rt></ruby> — <ruby>答<rt>こた</rt></ruby>え合わせ',
          text: `<p><ruby>旅<rt>たび</rt></ruby>の はじめ、<ruby>第一章<rt>だいいっしょう</rt></ruby>で あずけた <ruby>謎<rt>なぞ</rt></ruby>を、もう 一度。</p>
            <p class="speak">なぜ、なんでも できた この <ruby>天才<rt>てんさい</rt></ruby>は、手がけた ものの ほとんどを "<ruby>完成<rt>かんせい</rt></ruby>"させなかったのか？ そして、いま 知られる「天才レオナルド」は、どこまで ほんとうなのか？</p>
            <p>集めた <ruby>手<rt>て</rt></ruby>がかりを ひとつずつ 思いかえして——<br><em>きみは、どう 考える？</em></p>`,
          showClues: true,
          q: 'きみの <ruby>答<rt>こた</rt></ruby>えは？（どれを えらんでも、<ruby>正解<rt>せいかい</rt></ruby>の ひとつ）',
          choices: [
            { label: '「見る こと」が 仕事だった。だから 目は、次の「なぜ？」へ どこまでも 動く', to: '7-d', answer: 0,
              hist: { verdict: 'きみの 答え', match: 'それは、たしかな 答えの ひとつ',
                body: `<p>そのとおり かも しれない。きみに とって、絵を <ruby>仕上<rt>しあ</rt></ruby>げる ことより、水の うずや 鳥の はばたきを「見て、つなぐ」こと そのものが 仕事だった。一つ 見れば、次の「なぜ？」が 生まれる。だから、目は いつまでも 止まらない。</p>`,
                card: 'p-leonardo' } },
            { label: '一枚を <ruby>仕上<rt>しあ</rt></ruby>げる より、すべてが つながる ことの ほうが 大事だった', to: '7-d', answer: 1,
              hist: { verdict: 'きみの 答え', match: 'それも、まっすぐな 答えの ひとつ',
                body: `<p>それも 大事な 見方だ。飛ぶ ことは 水の <ruby>流<rt>なが</rt></ruby>れに つながり、水は 血の めぐりに つながる——どこかで 止めて「<ruby>完成<rt>かんせい</rt></ruby>」に して しまえば、その 先の つながりが 見えなく なる。だから きみは、手を 止めなかった。</p>`,
                card: 'p-leonardo' } },
            { label: '新しい やり方を ためし続けた。だから <ruby>傷<rt>いた</rt></ruby>んだり、間に合わなかったり した', to: '7-d', answer: 2,
              hist: { verdict: 'きみの 答え', match: 'それも、するどい 答えの ひとつ',
                body: `<p>そのとおり。<ruby>安全<rt>あんぜん</rt></ruby>な やり方を えらばず、いつも 新しい ことを ためした。だから『<ruby>最後<rt>さいご</rt></ruby>の <ruby>晩餐<rt>ばんさん</rt></ruby>』は 早く <ruby>傷<rt>いた</rt></ruby>み、<ruby>巨大<rt>きょだい</rt></ruby>な 馬は <ruby>青銅<rt>せいどう</rt></ruby>に なる 前に 世の中が 変わった。「ためす」人は、ときに「<ruby>仕上<rt>しあ</rt></ruby>げる」ことを あきらめる。</p>`,
                card: 'p-leonardo' } },
            { label: '「なんでも できた 天才」の <ruby>話<rt>はなし</rt></ruby>は、あとの 世が <ruby>盛<rt>も</rt></ruby>った もの', to: '7-d', answer: 3,
              hist: { verdict: 'きみの 答え', match: 'それこそ、いちばん 大人な 答えかも',
                body: `<p>それが、いちばん <ruby>正直<rt>しょうじき</rt></ruby>な 答えかも しれない。「師が <ruby>筆<rt>ふで</rt></ruby>を 折った」も「<ruby>王<rt>おう</rt></ruby>の うでの 中で 死んだ」も、あとの 世が 足した <ruby>尾<rt>お</rt></ruby>ひれ。それでも、<b><ruby>盛<rt>も</rt></ruby>った <ruby>話<rt>はなし</rt></ruby>を はぎ取った あとに、なお 残る もの</b>が ある——世界を じっと 見て、つなぎ<ruby>続<rt>つづ</rt></ruby>けた 一つの 頭だ。</p>`,
                card: 'p-leonardo' } },
          ] },

        '7-d': { place: '<ruby>終章<rt>しゅうしょう</rt></ruby> むすび',
          text: `<p>きみが 死んでも、五千枚の <ruby>手記<rt>しゅき</rt></ruby>は 終わらなかった。メルツィの 手から、また 次の だれかへ——四百年、五百年 かけて、いまも 世界じゅうで 読まれ<ruby>続<rt>つづ</rt></ruby>けて いる。</p>
            <p>あとの 世は、きみに「なんでも できた 天才」という 大きな <ruby>冠<rt>かんむり</rt></ruby>を のせた。だが、その <ruby>冠<rt>かんむり</rt></ruby>より、この 終わらない ノートの ほうが、ずっと きみらしい。七つの <ruby>手<rt>て</rt></ruby>がかりを そろえた きみの 手で、最後の ページが ひらく。</p>`,
          creed: { line: '「おれの <ruby>手記<rt>しゅき</rt></ruby>には、『これで <ruby>完成<rt>かんせい</rt></ruby>』の ページが、一枚も ない。」',
            act: '——きみは、何も <ruby>完成<rt>かんせい</rt></ruby>させなかったのでは ない。見て、つないで、また 見て——その 手を、死ぬ 日まで 止めなかった。五千枚は いまも、どこかの だれかの「なぜ？」に つながって いる。' },
          onEnter: { clues: ['clue-7'] },
          end: true },
      },
    },
  ],
};
