// Cards (CARDS). 9 people + 11 words. design §4 lists the people; WRITING「人は絞る」caps a work at
// 16 person cards (here: 9). Every fact traces to docs/research/davinci.md by §; △/☆ items (Vasari-
// only 逸話・諸説) avoid assertion with 「〜とされる／と 伝えられる／諸説」 (G5/G6), and the 伝記 items
// name WHO wrote the record and WHEN — the work's whole point (research §0, §3-1). Sensitive-topic
// policy (research §0): anatomy = 畏れと倫理の線画で可, sexual orientation = 一切扱わない.
// Hand-managed (davinci has no legacy extract source). tone = FACE_TONES camp: ink=レオナルド /
// midori=師 / gold=庇護者 / seal=好敵手 / ai=弟子. name/read stay ruby-free plain text (the card UI
// renders them as text; ruby lives in `text`). Confidence marks (◎○△☆) live in the たしかさ device,
// not in child-facing prose — the card text hedges in words instead.
import type { Card } from '../../engine/types';
// ★T 本物の写真（PD の複製のみ・data URI 同梱。出どころは photos.ts のヘッダ）。
import { FLIGHT_CODEX, IMOLA_MAP, LAST_SUPPER, MONA_LISA } from './photos';

export const CARDS: Record<string, Card> = {
  // ---- People ----
  'p-leonardo': { type: 'person', ch: 1, tone: 'ink', name: 'レオナルド・ダ・ヴィンチ', read: 'れおなるど・だ・ゔぃんち',
    text: 'きみ 自身。トスカーナの ヴィンチ<ruby>村<rt>むら</rt></ruby>で、<ruby>公証人<rt>こうしょうにん</rt></ruby>の 父と 身分の 低い 母の あいだに 生まれた <ruby>私生児<rt>しせいじ</rt></ruby>。<ruby>学校<rt>がっこう</rt></ruby>で ラテン語を 習えず、自分を「文字を 知らぬ 者」と 呼んだ。だからこそ 本より 自分の 目を 信じ、絵・<ruby>彫刻<rt>ちょうこく</rt></ruby>・機械・水・人体——見える もの すべてを <ruby>手記<rt>しゅき</rt></ruby>に 描きつづけた。だが その ほとんどを、"<ruby>完成<rt>かんせい</rt></ruby>"させないまま 世を 去った。' },
  'p-verrocchio': { type: 'person', ch: 2, tone: 'midori', name: 'ヴェロッキオ', read: 'ゔぇろっきお',
    text: 'フィレンツェの <ruby>彫刻家<rt>ちょうこくか</rt></ruby>・画家・<ruby>金細工師<rt>きんざいくし</rt></ruby>。14さいごろの きみが <ruby>弟子入<rt>でしい</rt></ruby>りした <ruby>工房<rt>こうぼう</rt></ruby>の <ruby>親方<rt>おやかた</rt></ruby>。<ruby>素描<rt>そびょう</rt></ruby>・<ruby>遠近法<rt>えんきんほう</rt></ruby>・金属の わざ、そして「よく 見る こと」を きみに 仕込んだ。『キリストの <ruby>洗礼<rt>せんれい</rt></ruby>』で 左の 天使を きみが 描いたと 現代の <ruby>研究<rt>けんきゅう</rt></ruby>も みとめる。師は その あとも <ruby>工房<rt>こうぼう</rt></ruby>を 続け、やがて 本業の <ruby>彫刻<rt>ちょうこく</rt></ruby>へ 力を 移した——ヴェネツィアの 大きな <ruby>騎馬像<rt>きばぞう</rt></ruby>を 手がけて いる <ruby>途中<rt>とちゅう</rt></ruby>の 1488年に、この 世を 去る。' },
  'p-ludovico': { type: 'person', ch: 3, tone: 'gold', name: 'ルドヴィコ・スフォルツァ', read: 'るどゔぃこ・すふぉるつぁ',
    text: 'ミラノ<ruby>公<rt>こう</rt></ruby>、あだ名は「イル・モーロ（<ruby>色黒<rt>いろぐろ</rt></ruby>）」。17年もの あいだ、きみの いちばん 大きな <ruby>庇護者<rt>ひごしゃ</rt></ruby>だった。『<ruby>最後<rt>さいご</rt></ruby>の <ruby>晩餐<rt>ばんさん</rt></ruby>』も 巨大な <ruby>騎馬像<rt>きばぞう</rt></ruby>も、この 人の <ruby>注文<rt>ちゅうもん</rt></ruby>。きみは この <ruby>宮廷<rt>きゅうてい</rt></ruby>へ、「絵が うまい」より 先に「戦の 道具が 作れる」と 売り込む 手紙を 書いて 入った。1499年、フランス<ruby>軍<rt>ぐん</rt></ruby>に 攻められ <ruby>失脚<rt>しっきゃく</rt></ruby>する。' },
  'p-cesare': { type: 'person', ch: 5, tone: 'gold', name: 'チェーザレ・ボルジア', read: 'ちぇーざれ・ぼるじあ',
    text: '<ruby>教皇<rt>きょうこう</rt></ruby>の 子で、ヴァレンティノ<ruby>公<rt>こう</rt></ruby>。マキャヴェッリ『<ruby>君主論<rt>くんしゅろん</rt></ruby>』の モデルに なった、こわいほど 冷たい <ruby>野心家<rt>やしんか</rt></ruby>。1502〜03年、きみは この 男の <ruby>軍事技師<rt>ぐんじぎし</rt></ruby>と して 各地を 回り、真上から 見た イモラの <ruby>精密<rt>せいみつ</rt></ruby>な 地図を 描いた。——平和を 願いながら、暴君の ために 戦の 道具を 作る。きみの 一生 いちばん 暗い 岐路。' },
  'p-giuliano': { type: 'person', ch: 6, tone: 'gold', name: 'ジュリアーノ・デ・メディチ', read: 'じゅりあーの・で・めでぃち',
    text: 'メディチ<ruby>家<rt>け</rt></ruby>の 人で、ローマ<ruby>教皇<rt>きょうこう</rt></ruby>レオ10<ruby>世<rt>せい</rt></ruby>の 弟。1513年、ローマへ きみを 招き、<ruby>宮殿<rt>きゅうでん</rt></ruby>に 住まわせた <ruby>庇護者<rt>ひごしゃ</rt></ruby>。大きな 絵の <ruby>注文<rt>ちゅうもん</rt></ruby>は なく、きみは その あいだ <ruby>解剖<rt>かいぼう</rt></ruby>・<ruby>光学<rt>こうがく</rt></ruby>・水の <ruby>研究<rt>けんきゅう</rt></ruby>に のめり込んだ。1516年に 死に、同じ 年、きみは アルプスを こえて フランスへ わたる。' },
  'p-francois': { type: 'person', ch: 7, tone: 'gold', name: 'フランソワ1世', read: 'ふらんそわ いっせい',
    text: 'フランス王。1516年、64さいの きみを 招き、「王 づきの <ruby>第一<rt>だいいち</rt></ruby>の 画家・技師・<ruby>建築家<rt>けんちくか</rt></ruby>」の <ruby>位<rt>くらい</rt></ruby>と、アンボワーズの クルー<ruby>館<rt>やかた</rt></ruby>を あたえた。<ruby>才<rt>さい</rt></ruby>を 敬い、ただ そこに いる ことを ゆるした 王。「王の うでの 中で きみが 息を 引きとった」という <ruby>最期<rt>さいご</rt></ruby>は、ヴァザーリの <ruby>伝記<rt>でんき</rt></ruby>が 足した 話。' },
  'p-michelangelo': { type: 'person', ch: 6, tone: 'seal', name: 'ミケランジェロ', read: 'みけらんじぇろ',
    text: '23さい 年下の <ruby>彫刻家<rt>ちょうこくか</rt></ruby>。1504年、フィレンツェの <ruby>市庁舎<rt>しちょうしゃ</rt></ruby>で、きみと 同時に <ruby>壁画<rt>へきが</rt></ruby>を 引き受け、競い合った（どちらも <ruby>未完<rt>みかん</rt></ruby>に 終わる）。<ruby>優雅<rt>ゆうが</rt></ruby>で 社交的な きみと、<ruby>無愛想<rt>ぶあいそう</rt></ruby>で <ruby>孤高<rt>ここう</rt></ruby>の この 男は、気性が 正反対だった。「<ruby>青銅像<rt>せいどうぞう</rt></ruby>も 鋳られず 放り出した 男が」と 街で 皮肉ったと 伝える 記録も 残る。' },
  'p-salai': { type: 'person', ch: 4, tone: 'ai', name: 'サライ', read: 'さらい',
    text: '10さいで きみの 家に 入った 弟子。きみ 自身が「<ruby>泥棒<rt>どろぼう</rt></ruby>・うそつき・<ruby>強情<rt>ごうじょう</rt></ruby>・大食い」と <ruby>手記<rt>しゅき</rt></ruby>に 書きながら、あだ名「サライ（<ruby>小悪魔<rt>こあくま</rt></ruby>）」を つけ、25年 以上 手もとに 置いた。困った 子を 手放さない——<ruby>英雄<rt>えいゆう</rt></ruby>でも <ruby>聖人<rt>せいじん</rt></ruby>でもない、人間レオナルドの 厚み。' },
  'p-melzi': { type: 'person', ch: 7, tone: 'ai', name: 'メルツィ', read: 'めるつぃ',
    text: 'ミラノ<ruby>貴族<rt>きぞく</rt></ruby>の 出の 弟子。15さいごろ <ruby>弟子入<rt>でしい</rt></ruby>りし、最も 信頼される 助手・友と なって ローマ、フランスまで 同行した。1519年の <ruby>遺言<rt>ゆいごん</rt></ruby>で、きみは 五千枚の <ruby>手記<rt>しゅき</rt></ruby>と 絵を、この 若者に 託した。——つなぎ<ruby>続<rt>つづ</rt></ruby>けた <ruby>網<rt>あみ</rt></ruby>を、次の だれかが 受けとる。作品の <ruby>主題<rt>しゅだい</rt></ruby>を 生きた 人。' },
  // リザ = モナ・リザの モデル（ch6 パイロット＝観察 closeup の対象）。research §3-4: 「あの ほほえみは
  // 誰か」は 2005年の 欄外書き込み（ヴェスプッチ 1503）でリザ・デル・ジョコンドと ほぼ確定（◎）。
  'p-lisa': { type: 'person', ch: 6, tone: 'gold', name: 'リザ・デル・ジョコンド', read: 'りざ・でる・じょこんど',
    text: 'きみが 描いた「モナ・リザ」の モデルと される 女の人。フィレンツェの <ruby>絹商人<rt>きぬしょうにん</rt></ruby>フランチェスコの 妻で、ふつうの <ruby>家<rt>いえ</rt></ruby>の おかみさんだった。「あの ほほえみの 人は だれか」は その後 500年 わからなかったが、2005年、ドイツの <ruby>図書館<rt>としょかん</rt></ruby>で 見つかった 1503年の 走り書き——「レオナルドは いま リザの 顔を 描いている」——で、この 人だと ほぼ 決まった。ありふれた 顔が、いま 世界じゅうから 人が 見に 来る 一枚に なった。' },

  // ---- Words ----
  'w-shiseiji': { type: 'word', ch: 1, name: '私生児', read: 'しせいじ',
    text: '<ruby>結婚<rt>けっこん</rt></ruby>して いない 親の あいだに 生まれた 子。きみは 父の 家に 引きとられ 大事に 育てられたが、<ruby>非嫡出<rt>ひちゃくしゅつ</rt></ruby>ゆえ 父の 仕事（<ruby>公証人<rt>こうしょうにん</rt></ruby>）は 継げず、正規の ラテン語の <ruby>教育<rt>きょういく</rt></ruby>も 受けられなかった。きみは 自分を「文字を 知らぬ 者」と 呼んだ。この「<ruby>独学<rt>どくがく</rt></ruby>の はみ出し者」性が、本より 自分の 目を 信じる 姿勢を 育てた。' },
  'w-kagamimoji': { type: 'word', ch: 1, name: '鏡文字', read: 'かがみもじ',
    text: 'きみは <ruby>手記<rt>しゅき</rt></ruby>の 大半を、右から 左へ、<ruby>鏡<rt>かがみ</rt></ruby>に うつすと 読める 向きの 文字で 書いた。これは まちがいの ない <ruby>事実<rt>じじつ</rt></ruby>。だが「なぜ？」には 決め手が なく、<ruby>諸説<rt>しょせつ</rt></ruby> ある——<ruby>左利<rt>ひだりき</rt></ruby>きゆえ インクを 汚さない ため（いちばん 広く 支持）／秘密を 守る ため（ただし 鏡文字は 解読が かんたんで、暗号としては 弱い）／ただの クセ。「よく わからない」も、りっぱな 答え。' },
  'w-tenshi': { type: 'word', ch: 2, name: 'キリストの洗礼の天使', read: 'きりすとの せんれいの てんし',
    text: '師ヴェロッキオの <ruby>工房作<rt>こうぼうさく</rt></ruby>『キリストの <ruby>洗礼<rt>せんれい</rt></ruby>』で、向かって 左の 天使と <ruby>背景<rt>はいけい</rt></ruby>の 一部を きみが 描いたと、現代の 研究も おおむね みとめる。だが「あまりの 出来に、師が 二度と <ruby>絵筆<rt>えふで</rt></ruby>を 執らなかった」という <ruby>劇的<rt>げきてき</rt></ruby>な 部分は、ずっと あとの 伝記だけが 語る <ruby>尾<rt>お</rt></ruby>ひれ。一つの 話を、事実の <ruby>核<rt>かく</rt></ruby>と、盛られた 尾ひれに 切り分ける れんしゅう。' },
  'w-jisenjo': { type: 'word', ch: 3, name: 'ミラノへの自薦状', read: 'みらのへの じせんじょう',
    text: 'きみが ミラノの スフォルツァ<ruby>公<rt>こう</rt></ruby>に あてた「売り込みの 手紙」。<ruby>橋<rt>はし</rt></ruby>・大砲・城を せめる 機械——戦の 役に 立つ わざを ずらりと 並べ、「絵や <ruby>彫刻<rt>ちょうこく</rt></ruby>も できます」は 最後に ひとこと 添えただけ。平和を 願った はずの 天才が、食べて いく ために まず 売ったのは、戦の 道具づくりの <ruby>腕<rt>うで</rt></ruby>だった。' },
  'w-uma': { type: 'word', ch: 3, name: 'スフォルツァの馬', read: 'すふぉるつぁの うま',
    text: 'きみが 作ろうと した、<ruby>実物大<rt>じつぶつだい</rt></ruby>の 巨大な <ruby>青銅<rt>せいどう</rt></ruby>の <ruby>騎馬像<rt>きばぞう</rt></ruby>。1493年に <ruby>粘土<rt>ねんど</rt></ruby>の <ruby>原型<rt>げんけい</rt></ruby>を 公開して 大<ruby>評判<rt>ひょうばん</rt></ruby>に なったが、青銅で 鋳る 前に フランス軍が 攻めて きて 中断。粘土の 馬は、<ruby>兵士<rt>へいし</rt></ruby>たちの 弓の <ruby>的<rt>まと</rt></ruby>に されて こわれたと 伝わる。完成しなかった きみの 仕事の、大きな ひとつ。' },
  'w-bansan': { type: 'word', ch: 4, name: '最後の晩餐', read: 'さいごの ばんさん',
    text: 'ミラノの <ruby>修道院<rt>しゅうどういん</rt></ruby>の 壁に 描いた、キリストと 弟子たちの 場面。ふつうの <ruby>壁画<rt>へきが</rt></ruby>（フレスコ）は 乾く 前に 一気に 描くが、きみは じっくり 直しながら 描きたくて、新しい やり方を ためした。だが その 絵の具は 壁と なじまず、きみが 生きて いる うちから もう 傷みはじめた。「ためす」ことと「仕上げる」ことが ぶつかった 一枚。',
    photo: LAST_SUPPER },
  'w-imola': { type: 'word', ch: 5, name: 'イモラ都市図', read: 'いもら としず',
    text: '1502年、ボルジアの ために きみが 描いた、真上から 見た イモラの 街の <ruby>精密<rt>せいみつ</rt></ruby>な 地図。街路を 自分の 足で 歩いて 測り、<ruby>広場<rt>ひろば</rt></ruby>の <ruby>塔<rt>とう</rt></ruby>から <ruby>方位<rt>ほうい</rt></ruby>を 取り、<ruby>幾何学<rt>きかがく</rt></ruby>で 街ぜんたいを 割り出した。ななめ <ruby>視点<rt>してん</rt></ruby>が ふつうだった 当時、「真上から 正確に 写す 地図」への <ruby>転換点<rt>てんかんてん</rt></ruby>と される。——めずらしく、きみが きちんと 仕上げた 仕事。',
    photo: IMOLA_MAP },
  'w-monalisa': { type: 'word', ch: 6, name: 'モナ・リザ', read: 'もな・りざ',
    text: 'きみが 描き、死ぬまで 手ばなさなかった <ruby>肖像画<rt>しょうぞうが</rt></ruby>。いまは パリの ルーヴル<ruby>美術館<rt>びじゅつかん</rt></ruby>に あり、この 一枚の 前だけ、いつも 人で いっぱいだ。「あの ほほえみの 人は だれか」は 500年 わからなかったが、2005年、ドイツの <ruby>図書館<rt>としょかん</rt></ruby>で 見つかった 1503年の 走り書き——「レオナルドは いま リザ・デル・ジョコンドの 顔を 描いている」——で、<ruby>絹商人<rt>きぬしょうにん</rt></ruby>の 妻リザだと ほぼ 決まった。一枚の メモが、長年の なぞを 解いた。',
    photo: MONA_LISA },
  'w-sfumato': { type: 'word', ch: 6, name: 'スフマート', read: 'すふまーと',
    text: 'イタリア語で「けむりの ように」。くっきりした <ruby>輪郭<rt>りんかく</rt></ruby>の 線を 引かず、明るさと かげを けむりの ように なめらかに とかして いく、きみが きわめた 描き方。モナ・リザの 口もとや 目の ふちに はっきりした 線が 無いのは、この ため。「笑って いるのか、いないのか」の あの とらえどころの なさは、線を 消した ところから 生まれた。——この <ruby>技<rt>わざ</rt></ruby>は、きみが「ほほえみ」と「まなざし」を 見くらべた ところから つながって できた。' },
  'w-kaibo': { type: 'word', ch: 6, name: '解剖と心臓の渦', read: 'かいぼうと しんぞうの うず',
    text: 'きみは <ruby>死体<rt>したい</rt></ruby>を 自分の 手で 切り開き、体の 中の しくみを 何百枚も <ruby>写生<rt>しゃせい</rt></ruby>した（<ruby>畏<rt>おそ</rt></ruby>れと <ruby>敬<rt>うやま</rt></ruby>いを もって）。<ruby>心臓<rt>しんぞう</rt></ruby>では、血が「うず（<ruby>渦<rt>うず</rt></ruby>）」を 巻いて <ruby>弁<rt>べん</rt></ruby>を 閉じるのを 助けると 考え、スケッチを 残した。約500年後の 2014年、<ruby>医師<rt>いし</rt></ruby>が 新しい MRIで 生きた 人の 心臓の 中を のぞくと、その うずは 本当に あった（まだ 少ない 人の しらべだが）。' },
  'w-shuki': { type: 'word', ch: 7, name: '手記（コーデックス）', read: 'しゅき（こーでっくす）',
    text: 'きみが 一生 書きつづけた ノート。いま 五千〜七千枚が 残る。<ruby>飛行<rt>ひこう</rt></ruby>・水・<ruby>解剖<rt>かいぼう</rt></ruby>・<ruby>幾何<rt>きか</rt></ruby>——すべてが たがいに つながり、どこまでも <ruby>枝分<rt>えだわ</rt></ruby>かれして、「これで <ruby>完成<rt>かんせい</rt></ruby>」が 来ない。きみは 生きて いる 間、これを 一冊の 本に まとめて 世に 出さなかった。「<ruby>未完<rt>みかん</rt></ruby>」は 失敗では なく、つなぎ続けた <ruby>証<rt>あかし</rt></ruby>なのかもしれない。',
    photo: FLIGHT_CODEX },
  'w-vasari': { type: 'word', ch: 7, name: 'ヴァザーリ美術家列伝', read: 'ゔぁざーり びじゅつかれつでん',
    text: '画家ジョルジョ・ヴァザーリが 書いた 画家たちの <ruby>伝記<rt>でんき</rt></ruby>（1550年）。きみが 死んで 30年 あまり、<ruby>直接<rt>ちょくせつ</rt></ruby> きみを 知らない 人が 書いた <ruby>賞賛<rt>しょうさん</rt></ruby>の 本で、きみが 死んだ ときの <ruby>年<rt>とし</rt></ruby>れいを まちがえる など 誤りも 多い。「師が 筆を 折った」「王の うでの 中で 死んだ」——子どもが 最初に 出会う"天才<ruby>伝説<rt>でんせつ</rt></ruby>"の 多くは、この 一冊が もと。だから、話は もとを たしかめる。' },
};
