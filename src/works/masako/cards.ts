// Cards (CARDS). 16 people (= the WRITING「人は絞る」cap exactly; design §5). Word cards are
// authored WITH their chapters — a word card only earns its place once a scene needs it.
// Every fact traces to docs/research/masako.md by §; △/☆ items avoid assertion with
// 「〜とされる／と 伝えられる／諸説」(G5/G6), and 史料 items name WHO wrote the record and WHEN
// — this work's whole point (research §0). Hand-managed. name/read stay ruby-free plain text
// (the card UI renders them as text; ruby lives in `text`).
// tone = camp color for THIS work: ai=北条の家 / seal=源氏 / gold=京・朝廷 / midori=御家人.
import type { Card } from '../../engine/types';

export const CARDS: Record<string, Card> = {
  // ---- People ----
  'p-masako': { type: 'person', ch: 1, tone: 'ai', name: '北条政子', read: 'ほうじょう まさこ',
    text: 'きみ 自身。<ruby>伊豆<rt>いず</rt></ruby>の 小さな <ruby>武士<rt>ぶし</rt></ruby>の 家に 生まれ、流されて きた <ruby>源頼朝<rt>みなもとの よりとも</rt></ruby>と 結ばれた。夫の 死の あと 26年、子を <ruby>廃<rt>はい</rt></ruby>し、父を 追い、次の <ruby>鎌倉殿<rt>かまくらどの</rt></ruby>を 京から 迎えて、<ruby>武士<rt>ぶし</rt></ruby>の 世を 守りつづけた。——ただし、この 人が 書いた 文字は 一枚も 残っていない。' },
  'p-yoritomo': { type: 'person', ch: 1, tone: 'seal', name: '源頼朝', read: 'みなもとの よりとも',
    text: 'きみの 夫。13さいで 父を 失い、<ruby>平清盛<rt>たいらの きよもり</rt></ruby>に <ruby>伊豆<rt>いず</rt></ruby>へ 流された <ruby>流人<rt>るにん</rt></ruby>。1180年に 兵を 挙げ、<ruby>鎌倉<rt>かまくら</rt></ruby>に 武士の <ruby>政府<rt>せいふ</rt></ruby>を つくった——その とき、頼朝を 流した 清盛は、まだ 京に 生きて いた。1199年に 死ぬが、その 死の <ruby>前後<rt>ぜんご</rt></ruby>を 幕府の 正史『<ruby>吾妻鏡<rt>あづまかがみ</rt></ruby>』は 書いて いない——理由は わかって いない。' },
  'p-tokimasa': { type: 'person', ch: 1, tone: 'ai', name: '北条時政', read: 'ほうじょう ときまさ',
    text: 'きみの 父。はじめは <ruby>流人<rt>るにん</rt></ruby>の <ruby>見張<rt>みは</rt></ruby>り役、やがて 頼朝の <ruby>後<rt>うし</rt></ruby>ろだてに。1205年、きみと 弟・<ruby>義時<rt>よしとき</rt></ruby>に よって <ruby>伊豆<rt>いず</rt></ruby>へ 追われた。追った 理由を 書いているのは、追った 側の <ruby>子孫<rt>しそん</rt></ruby>が 作った 記録の ほうだ。' },
  'p-yoshitoki': { type: 'person', ch: 3, tone: 'ai', name: '北条義時', read: 'ほうじょう よしとき',
    text: 'きみの 弟。生涯の <ruby>相棒<rt>あいぼう</rt></ruby>で、鎌倉の <ruby>執権<rt>しっけん</rt></ruby>。1221年、<ruby>後鳥羽上皇<rt>ごとばじょうこう</rt></ruby>が 名指しで「この 男を 討て」と 命じた その 人。きみの 演説は、弟を 助ける 演説でも あった。1224年に <ruby>急<rt>きゅう</rt></ruby>に 死ぬ（<ruby>毒殺<rt>どくさつ</rt></ruby>の 話は 後の 世の うわさ）。' },
  'p-ohime': { type: 'person', ch: 2, tone: 'seal', name: '大姫', read: 'おおひめ',
    text: 'きみの 長女。幼くして <ruby>木曽義仲<rt>きそ よしなか</rt></ruby>の 子・<ruby>義高<rt>よしたか</rt></ruby>と <ruby>婚約<rt>こんやく</rt></ruby>したが、その 義高は 父・頼朝に 討たれた。以後 長く <ruby>病<rt>や</rt></ruby>み、1197年に 20歳ほどで 死ぬ。「母に <ruby>操<rt>あやつ</rt></ruby>られた 娘」という 強い 像は、後の 世の 小説が 作った ところが 大きい。' },
  'p-yoriie': { type: 'person', ch: 3, tone: 'seal', name: '源頼家', read: 'みなもとの よりいえ',
    text: 'きみの 長男、2代目の 鎌倉殿。父の 死の あと、家来 13人の <ruby>合議<rt>ごうぎ</rt></ruby>に 力を おさえられ、1203年に 将軍の 座を 追われて <ruby>修禅寺<rt>しゅぜんじ</rt></ruby>へ。翌年、23さいで 死ぬ。その 死を 幕府の 正史は 一行しか 書かず、京の <ruby>僧<rt>そう</rt></ruby>の 書いた 本は 生々しく 書いている。' },
  'p-sanetomo': { type: 'person', ch: 4, tone: 'seal', name: '源実朝', read: 'みなもとの さねとも',
    text: 'きみの 次男、3代目の 鎌倉殿。<ruby>和歌<rt>わか</rt></ruby>に 打ちこみ、歌集『<ruby>金槐和歌集<rt>きんかいわかしゅう</rt></ruby>』を 残した——<b>自分の 言葉が 残った、ただ 一人の 子</b>。1219年、<ruby>鶴岡八幡宮<rt>つるがおかはちまんぐう</rt></ruby>で <ruby>甥<rt>おい</rt></ruby>の 公暁に 討たれた。' },
  'p-sanman': { type: 'person', ch: 2, tone: 'seal', name: '三幡', read: 'さんまん',
    text: 'きみの 次女。父・頼朝が 死んだ その 年（1199年）、あとを 追うように 病で 死んだ。数え14。名前と、死んだ 年しか わからない——記録に 残らなかった 人の ほうが、ずっと 多い。' },
  'p-kugyo': { type: 'person', ch: 6, tone: 'seal', name: '公暁', read: 'くぎょう',
    text: 'きみの 孫。頼家の 子で、<ruby>鶴岡八幡宮<rt>つるがおかはちまんぐう</rt></ruby>の <ruby>別当<rt>べっとう</rt></ruby>（お寺の 長）に なった。1219年、叔父の 実朝を 討ち、その 日の うちに 討たれた。<ruby>黒幕<rt>くろまく</rt></ruby>が いたという 話は 長く 語られたが、近ごろは 一人の しわざと 見る 側が 強い。' },
  'p-kaneko': { type: 'person', ch: 5, tone: 'gold', name: '卿二位藤原兼子', read: 'きょうのにい ふじわらの かねこ',
    text: '後鳥羽上皇の <ruby>乳母<rt>めのと</rt></ruby>で、京で いちばん 力の ある 人の 一人。1218年、きみは 京へ のぼって この人と 会い、次の 鎌倉殿を だれに するかを 話し合った。——東の <ruby>頂点<rt>ちょうてん</rt></ruby>も、西の <ruby>実力者<rt>じつりょくしゃ</rt></ruby>も、どちらも 女性 だった。' },
  'p-gotoba': { type: 'person', ch: 5, tone: 'gold', name: '後鳥羽上皇', read: 'ごとば じょうこう',
    text: 'きみの 敵に なる 上皇。歌の 名人で、みずから 刀まで 打たせた <ruby>多芸<rt>たげい</rt></ruby>の 帝王。1221年、<ruby>義時<rt>よしとき</rt></ruby>を 討てと <ruby>命令<rt>めいれい</rt></ruby>を 出して 戦い（<ruby>承久<rt>じょうきゅう</rt></ruby>の 乱）、負けて <ruby>隠岐<rt>おき</rt></ruby>の 島へ 流された。' },
  'p-yoshimura': { type: 'person', ch: 6, tone: 'midori', name: '三浦義村', read: 'みうら よしむら',
    text: '鎌倉で いちばん 大きな 力を 持つ <ruby>御家人<rt>ごけにん</rt></ruby>の 一人。どちらに つくか、いつも 最後まで 読めない 男。承久の 乱では 幕府 側に つき、弟の <ruby>胤義<rt>たねよし</rt></ruby>は 京 側に ついた——兄弟が 敵と 味方に 分かれた。' },
  'p-yasutoki': { type: 'person', ch: 7, tone: 'ai', name: '北条泰時', read: 'ほうじょう やすとき',
    text: 'きみの <ruby>甥<rt>おい</rt></ruby>（義時の 子）。承久の 乱では 幕府軍を <ruby>率<rt>ひき</rt></ruby>いて 京へ のぼった。政子が 死んだ あと、武士の ための きまり『<ruby>御成敗式目<rt>ごせいばいしきもく</rt></ruby>』（1232年）を 作る。——政子が 作ったのは <ruby>制度<rt>せいど</rt></ruby>では なく、<ruby>続<rt>つづ</rt></ruby>いた ことの ほうだ。' },
  'p-kagemori': { type: 'person', ch: 6, tone: 'midori', name: '安達景盛', read: 'あだち かげもり',
    text: '政子に 近い 御家人。1221年、御家人を 集めた 場で、幕府の 正史『吾妻鏡』は「政子は <ruby>御簾<rt>みす</rt></ruby>の 内に いて、この 人が その 言葉を 読みあげた」と 読める 書き方を している。あの 場の、もう 一人の 主役かも しれない 人。' },
  'p-yoshikazu': { type: 'person', ch: 3, tone: 'midori', name: '比企能員', read: 'ひき よしかず',
    text: '頼家の <ruby>後<rt>うし</rt></ruby>ろだて。娘が 頼家の 子・<ruby>一幡<rt>いちまん</rt></ruby>を 生み、<ruby>比企<rt>ひき</rt></ruby>の 家は 次の 代を にぎる はずだった。1203年、北条の 側に 討たれる。この 事件を 書いた 記録も、勝った 北条の 側の ものだ。' },
  'p-kagetoki': { type: 'person', ch: 2, tone: 'midori', name: '梶原景時', read: 'かじわら かげとき',
    text: '頼朝の 目と 耳。石橋山の 戦いで 敗れた 頼朝を <ruby>見逃<rt>みのが</rt></ruby>したと 伝えられ、以後 いちばん 近くで 仕えた。人の <ruby>落<rt>お</rt></ruby>ち度を 主君に 告げる 役を 引き受けたため 嫌われ、頼朝の 死の 翌年（1200年）、御家人たちに <ruby>追<rt>お</rt></ruby>い出されて 討たれた。' },
};
