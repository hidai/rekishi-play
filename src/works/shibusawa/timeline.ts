// Timeline (TIMELINE, from research §2). Kazoe (counted) age where noted. Uncertain (△/☆) items
// and 要出典確認 dates avoid assertion with 「諸説／〜とされる／ごろ」. Hand-managed.
//
// Furigana here goes beyond the machine gate (tests/ruby-furigana.test.ts) in two ways, because a
// 小5 persona read the pane and hit both:
//  1. The gate only sees 中学配当＋表外, but 熟字訓・地名・役職・書名（武蔵国・下野・頭取・昔夢会…）
//     are all 教育漢字 and pass it while a 10-year-old still cannot read them.
//  2. The gate models this pane as ONE surface (first occurrence only), but it is a long scroll —
//     a reading 20 entries above is out of sight, so recurring 慶喜・渋沢栄一・帝国・算盤 re-take ruby.
import type { TimelineEntry } from '../../engine/types';

export const TIMELINE: TimelineEntry[] = [
  { y: '1840', ch: 1, key: true, t: '栄一 生まれる', d: '<ruby>武蔵国<rt>むさしのくに</rt></ruby> <ruby>血洗島<rt>ちあらいじま</rt></ruby>（今の <ruby>深谷市<rt>ふかやし</rt></ruby>）の <ruby>藍玉<rt>あいだま</rt></ruby>と <ruby>養蚕<rt>ようさん</rt></ruby>の <ruby>豪農<rt>ごうのう</rt></ruby>・<ruby>渋沢市郎右衛門<rt>しぶさわいちろうえもん</rt></ruby>の 子。' },
  { y: '少年期', ch: 1, t: '<ruby>尾高惇忠<rt>おだかじゅんちゅう</rt></ruby>に <ruby>論語<rt>ろんご</rt></ruby>を 学ぶ', d: '<ruby>藍葉<rt>あいば</rt></ruby>の 買い付けで <ruby>商<rt>あきな</rt></ruby>いを 覚える。のちの「論語」と「<ruby>算盤<rt>そろばん</rt></ruby>」の <ruby>素地<rt>そじ</rt></ruby>。' },
  { y: '1863', ch: 1, key: true, t: '<ruby>高崎城<rt>たかさきじょう</rt></ruby>乗っ取り・<ruby>横浜<rt>よこはま</rt></ruby><ruby>焼<rt>や</rt></ruby>き<ruby>討<rt>う</rt></ruby>ち計画', d: '<ruby>従兄<rt>いとこ</rt></ruby>・<ruby>尾高長七郎<rt>おだかちょうしちろう</rt></ruby>の 説得で 直前に 中止。計画の 存在は 確か、細部は 諸説。' },
  { y: '1863〜64', ch: 2, key: true, t: '<ruby>一橋家<rt>ひとつばしけ</rt></ruby>（<ruby>徳川慶喜<rt>とくがわよしのぶ</rt></ruby>）に <ruby>仕官<rt>しかん</rt></ruby>', d: '<ruby>京<rt>きょう</rt></ruby>へ 出て、<ruby>平岡円四郎<rt>ひらおかえんしろう</rt></ruby>の <ruby>推挙<rt>すいきょ</rt></ruby>で <ruby>攘夷<rt>じょうい</rt></ruby>の <ruby>志士<rt>しし</rt></ruby>から 一橋家の 家来に。' },
  { y: '1866', ch: 2, key: true, t: '慶喜 <ruby>徳川<rt>とくがわ</rt></ruby>の 家を つぐ→栄一 <ruby>図<rt>はか</rt></ruby>らずも<ruby>幕臣<rt>ばくしん</rt></ruby>', d: '慶喜が 一橋家を 出て 徳川<ruby>宗家<rt>そうけ</rt></ruby>を ついだ ため、一橋家の 家来だった 栄一も 幕臣に <ruby>移<rt>うつ</rt></ruby>された（<ruby>慶応<rt>けいおう</rt></ruby>2年9月）。慶喜が 15代 将軍に なるのは その 年の 暮れ。本人は よろこばなかったと 語って いる。' },
  { y: '1867', ch: 3, key: true, t: 'パリ<ruby>万博<rt>ばんぱく</rt></ruby>へ <ruby>渡欧<rt>とおう</rt></ruby>', d: '<ruby>徳川昭武<rt>とくがわあきたけ</rt></ruby>に <ruby>随行<rt>ずいこう</rt></ruby>。フランスを <ruby>拠点<rt>きょてん</rt></ruby>に <ruby>銀行<rt>ぎんこう</rt></ruby>・<ruby>株式会社<rt>かぶしきがいしゃ</rt></ruby>・<ruby>鉄道<rt>てつどう</rt></ruby>・近代都市を 見る。パリで <ruby>髷<rt>まげ</rt></ruby>を 落とす。' },
  { y: '1868〜69', ch: 3, t: '<ruby>大政奉還<rt>たいせいほうかん</rt></ruby>・<ruby>戊辰戦争<rt>ぼしんせんそう</rt></ruby>→帰国', d: '<ruby>滞欧<rt>たいおう</rt></ruby>中に <ruby>幕府<rt>ばくふ</rt></ruby>が 消えた。帰国し、<ruby>静岡<rt>しずおか</rt></ruby>で <ruby>隠棲<rt>いんせい</rt></ruby>する 慶喜のもとへ。<ruby>商法会所<rt>しょうほうかいしょ</rt></ruby>を つくる。' },
  { y: '1869', ch: 4, key: true, t: '<ruby>大隈重信<rt>おおくましげのぶ</rt></ruby>の 説得で <ruby>大蔵省<rt>おおくらしょう</rt></ruby>へ', d: '民に 下ろうと したが、明治<ruby>政府<rt>せいふ</rt></ruby>に 引き入れられ、近代<ruby>経済<rt>けいざい</rt></ruby>の 骨組みづくりに 関わる。' },
  { y: '1872', ch: 4, t: '国立銀行<ruby>条例<rt>じょうれい</rt></ruby>・<ruby>富岡製糸場<rt>とみおかせいしじょう</rt></ruby>', d: '<ruby>度量衡<rt>どりょうこう</rt></ruby>・<ruby>税<rt>ぜい</rt></ruby>・銀行の しくみを 整える。' },
  { y: '1873', ch: 4, key: true, t: '<ruby>井上馨<rt>いのうえかおる</rt></ruby>と 共に <ruby>下野<rt>げや</rt></ruby>→第一国立銀行 <ruby>創立<rt>そうりつ</rt></ruby>', d: '<ruby>予算<rt>よさん</rt></ruby>方針で 対立し <ruby>官<rt>かん</rt></ruby>を <ruby>辞<rt>じ</rt></ruby>す。同じ 年、日本で 最初の 銀行を 立て、<ruby>総監役<rt>そうかんやく</rt></ruby>（のち <ruby>頭取<rt>とうどり</rt></ruby>）に。' },
  { y: '1873〜', ch: 5, t: '約500社の 設立・育成に 関わる', d: '王子<ruby>製紙<rt>せいし</rt></ruby>・大阪<ruby>紡績<rt>ぼうせき</rt></ruby>・東京海上・<ruby>日本郵船<rt>にっぽんゆうせん</rt></ruby>・<ruby>帝国<rt>ていこく</rt></ruby>ホテル…。ただし「約500」は 数え方で 動く（研究の <ruby>精査<rt>せいさ</rt></ruby>では もっと 少ない）。' },
  { y: '1878ごろ', ch: 5, key: true, t: '<ruby>岩崎弥太郎<rt>いわさきやたろう</rt></ruby>と 対立（<ruby>独占<rt>どくせん</rt></ruby> vs <ruby>合本<rt>がっぽん</rt></ruby>）', d: '<ruby>隅田川<rt>すみだがわ</rt></ruby>の <ruby>舟遊<rt>ふなあそ</rt></ruby>びで <ruby>決裂<rt>けつれつ</rt></ruby>したという 劇的な <ruby>逸話<rt>いつわ</rt></ruby>は <ruby>後世<rt>こうせい</rt></ruby>の <ruby>脚色<rt>きゃくしょく</rt></ruby>とされ、本人は「考えが ちがう だけ」と <ruby>穏<rt>おだ</rt></ruby>やかに 語ったと 伝わる。' },
  { y: '1893ごろ', ch: 6, key: true, t: '『<ruby>徳川慶喜公伝<rt>とくがわよしのぶこうでん</rt></ruby>』の 編さんを 思い立つ', d: '<ruby>旧主<rt>きゅうしゅ</rt></ruby>・<ruby>慶喜<rt>よしのぶ</rt></ruby>は「敵の 前から <ruby>逃<rt>に</rt></ruby>げた」と 責められた まま だまって いた。その 一生を 紙に 残そうと した。' },
  { y: '1907〜13', ch: 6, key: true, t: '<ruby>昔夢会<rt>せきむかい</rt></ruby>——慶喜 本人に たずねる', d: '集めた 紙の 食いちがいを 本人に たずねる 会を 17回、下書きを 読んで もらう 会を 8回。記録は『<ruby>昔夢会筆記<rt>せきむかいひっき</rt></ruby>』。' },
  { y: '1913', ch: 6, death: true, t: '<ruby>徳川慶喜<rt>とくがわよしのぶ</rt></ruby> <ruby>没<rt>ぼつ</rt></ruby>', d: '11月22日、76<ruby>歳<rt>さい</rt></ruby>。本の 完成を 見る ことは なかった。' },
  { y: '1916', ch: 6, t: '『<ruby>論語<rt>ろんご</rt></ruby>と<ruby>算盤<rt>そろばん</rt></ruby>』', d: '<ruby>道徳<rt>どうとく</rt></ruby>と <ruby>利益<rt>りえき</rt></ruby>は 両立する、という 考えを 語った 話を、人が 集めて 一冊に した 本。' },
  { y: '1918', ch: 6, key: true, t: '『<ruby>徳川慶喜公伝<rt>とくがわよしのぶこうでん</rt></ruby>』全8<ruby>巻<rt>かん</rt></ruby> なる', d: '思い立ってから 25年。勝った 世で、負けた 側の 記録が 本に なった。' },
  { y: '1920', ch: 7, t: '<ruby>子爵<rt>ししゃく</rt></ruby>に <ruby>昇<rt>のぼ</rt></ruby>る', d: '1900年の <ruby>男爵<rt>だんしゃく</rt></ruby>から 一つ 上がった。80歳。' },
  { y: '1924', ch: 7, key: true, t: '米・<ruby>排日移民法<rt>はいにちいみんほう</rt></ruby>→民間外交', d: '日米関係の 悪化を <ruby>憂<rt>うれ</rt></ruby>え、84歳で <ruby>帝国<rt>ていこく</rt></ruby>ホテルの 集まりに 立ち、法の <ruby>非<rt>ひ</rt></ruby>を 説いた（この 年に <ruby>渡米<rt>とべい</rt></ruby>は して いない）。1926年・1927年には ノーベル<ruby>平和賞<rt>へいわしょう</rt></ruby>に 推す 紙が 出されたと 伝えられる。' },
  { y: '1927', ch: 7, t: '青い目の 人形と <ruby>答礼人形<rt>とうれいにんぎょう</rt></ruby>', d: '栄一は 日本<ruby>国際児童親善会<rt>こくさいじどうしんぜんかい</rt></ruby>の 会長と なり、米国から とどいた 12,739<ruby>体<rt>たい</rt></ruby>を 受け入れた。答礼の <ruby>市松人形<rt>いちまつにんぎょう</rt></ruby> 58体は、日本じゅうの 子どもの 一<ruby>銭<rt>せん</rt></ruby><ruby>募金<rt>ぼきん</rt></ruby>で 新しく つくらせた もの。11月10日、横浜を <ruby>出港<rt>しゅっこう</rt></ruby>。' },
  { y: '1931', ch: 7, key: true, death: true, t: '<ruby>渋沢栄一<rt>しぶさわえいいち</rt></ruby> <ruby>没<rt>ぼつ</rt></ruby>', d: '11月11日、<ruby>飛鳥山<rt>あすかやま</rt></ruby>の 家で。数えで 92（<ruby>満<rt>まん</rt></ruby>91）。この 年の 二月、求めつづけた <ruby>救護法<rt>きゅうごほう</rt></ruby>の <ruby>実施<rt>じっし</rt></ruby>が 決まった——法が 始まったのは 没後 二か月の 1932年 正月。' },
  { y: '2024', ch: 7, t: '新一万円札の <ruby>肖像<rt>しょうぞう</rt></ruby>に', d: '国が <ruby>渋沢<rt>しぶさわ</rt></ruby>を「日本の 顔」に えらんだ。もとは <ruby>古希<rt>こき</rt></ruby>（70歳）ごろの 写真だが、より 力の ある 顔に 見えるよう 60歳代前半に <ruby>描<rt>えが</rt></ruby>き直した——と、札を つくった 側は 説明して いる。' },
];
