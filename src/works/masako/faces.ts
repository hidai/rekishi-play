// Face specs (FACE_SPEC). Generator: src/engine/art/face.ts.
//
// 典拠3層（顔エンジン要件② / research §4B）:
//  ① 同時代の確実な肖像 — 本作は **1枚も無い**（5作でいちばん極端）。政子・実朝・義時・公暁・
//     泰時いずれも同時代の像が伝わらず、頼朝の神護寺像すら足利直義説が出て決着していない。
//  ② 様式の像 — 安養院ほかに伝わる政子の坐像は **いずれも尼形（剃髪・法衣）の坐像**で、「顔」
//     ではなく身分と信仰の様式を語る（ieyasu の東照大権現＝神像と同じ注意）。忠実性の根拠に
//     ならない。後鳥羽は水無瀬神宮蔵「伝後鳥羽天皇像」が通説（帰属は △）。
//  ③ 現在の一般イメージ — 教科書・学習まんがは「尼姿＋演説」が定型（○）。
// ゆえに faces.ts は「誰の顔か」でなく「**誰と誰が違うか**」に徹する（要件①＝距離フロア）。
//
// 尼形は本サイクル前に engine へ入れた語彙を使う（head:'ama' ＝白い被り物＋garb:'houe' ＝法衣）。
// 政子は ieyasu 型の2 variant——@wife（御台所・垂髪）と 基底＝尼形（1199 出家以降）。
//
// tone = camp color for THIS work（人物固有の属性ではない）:
//   ai=北条の家 / seal=源氏（夫と 子ら）/ gold=京・朝廷 / midori=鎌倉の 御家人.
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec> = {
  // You = 政子. Representative face = 尼形の後半生（1199 出家〜1225）。作品の顔ゆえ、被り物が
  // 顔の輪郭より確実に外へ出る 'ama' で「尼」と一目で読めることを最優先する。
  'p-masako': { tone:'ai', head:'ama', garb:'houe', hair:'grey', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none', skin:'#e9cba8', age:'old', nose:'thin', browWeight:'fine' },
  // ★A 御台所の政子（ch1-2 = 1177〜1199）。垂髪。北条の娘から 武家の 都の 頂点へ。
  // morph browY -1 ＝ 上がった眉＝据わった若さ（kiyomori/p-tokiko の suberakashi と分ける）。
  'p-masako@wife': { tone:'ai', head:'suberakashi', hair:'dark', shape:'long', brow:'stern', eye:'sharp', mouth:'soft', beard:'none', nose:'thin', garb:'uchiki', browWeight:'fine', morph:{browY:-1} },

  // 源氏 — 夫と 子ら (seal).
  // 頼朝は kiyomori にも出る（同一人物は作品をまたいで同じ特徴＝tests/face-distinct の契約）。
  'p-yoritomo': { tone:'seal', head:'eboshi', hair:'dark', shape:'oval', brow:'stern', eye:'narrow', mouth:'flat', beard:'beard', nose:'tall' },
  // 大姫＝婚約者を父に殺され、長く病んで死んだ娘。垂髪・伏し目（morph eyeY 1）。
  'p-ohime': { tone:'seal', head:'suberakashi', hair:'dark', shape:'oval', brow:'worried', eye:'gentle', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'round', garb:'uchiki', browWeight:'fine', morph:{eyeY:1} },
  // 三幡＝父の死の年に病没した次女（数え14）。子どもの垂髪。
  'p-sanman': { tone:'seal', head:'suberakashi', hair:'dark', shape:'oval', brow:'soft', eye:'calm', mouth:'flat', beard:'none', skin:'#f6d3ab', cheek:'blush', age:'child', nose:'thin', garb:'uchiki', browWeight:'fine' },
  // 頼家＝若く強い将軍。母に廃される息子。若武者の髪、押しつけた眉（morph browY 1）。
  'p-yoriie': { tone:'seal', head:'wakamusha', hair:'dark', shape:'square', brow:'angry', eye:'sharp', mouth:'frown', beard:'none', nose:'wide', morph:{browY:1} },
  // 実朝＝唯一「自分の言葉が残った子」（『金槐和歌集』）。京へ向いた歌人の顔。
  'p-sanetomo': { tone:'seal', head:'eboshi', hair:'dark', shape:'long', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'thin' },
  // 公暁＝鶴岡八幡宮の別当（僧形）。父を奪われた子。断罪しない＝怒りでなく思いつめた眉。
  'p-kugyo': { tone:'seal', head:'bozu', hair:'dark', shape:'gaunt', brow:'worried', eye:'sharp', mouth:'flat', beard:'none', iris:'#37465a', nose:'thin' },

  // 北条の 家 (ai).
  // 時政＝監視役から後見人へ、そして娘に追放される父。老いた四角い顔。
  'p-tokimasa': { tone:'ai', head:'eboshi', hair:'grey', shape:'square', brow:'stern', eye:'sharp', mouth:'frown', beard:'full', skin:'#e9cba8', age:'old', nose:'wide' },
  // 義時＝生涯の相棒にして、承久の乱で朝敵に名指しされた当人。読めない静けさ。
  'p-yoshitoki': { tone:'ai', head:'eboshi', hair:'dark', shape:'gaunt', brow:'calm', eye:'narrow', mouth:'flat', beard:'beard', nose:'thin' },
  // 泰時＝政子の死後に式目を作る次世代。まっすぐで穏やか。
  'p-yasutoki': { tone:'ai', head:'eboshi', hair:'dark', shape:'round', brow:'soft', eye:'calm', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'round' },

  // 京・朝廷 (gold).
  // 後鳥羽＝敵役。だが歌人・刀工の後援者・多芸の帝王。生きのいい目で「ただの悪役」にしない。
  'p-gotoba': { tone:'gold', head:'kanmuri', hair:'dark', shape:'long', brow:'stern', eye:'lively', mouth:'flat', beard:'mustache', skin:'#f2dcc6', nose:'tall' },
  // 卿二位兼子＝朝廷側の実力者。政子と正対する、もう一人の年かさの女性。
  'p-kaneko': { tone:'gold', head:'suberakashi', hair:'grey', shape:'round', brow:'calm', eye:'narrow', mouth:'soft', beard:'none', skin:'#e9cba8', age:'old', garb:'uchiki', browWeight:'fine', nose:'round' },

  // 鎌倉の 御家人 (midori).
  // 三浦義村＝揺れる有力御家人。弟は京方に付いた（兄弟が敵味方に分かれた実例）。
  'p-yoshimura': { tone:'midori', head:'kabuto', hair:'dark', shape:'square', brow:'calm', eye:'narrow', mouth:'flat', beard:'beard', nose:'round' },
  // 比企能員＝頼家の後ろ盾。1203年に討たれる。押しの強い大柄な武将。
  'p-yoshikazu': { tone:'midori', head:'eboshi', hair:'dark', shape:'round', brow:'angry', eye:'sharp', mouth:'flat', beard:'full', nose:'wide' },
  // 梶原景時＝頼朝の目と耳、そして「讒言の人」と語られた男。細くけずれた顔。
  'p-kagetoki': { tone:'midori', head:'eboshi', hair:'dark', shape:'gaunt', brow:'stern', eye:'sharp', mouth:'frown', beard:'mustache', iris:'#3a2417', nose:'thin' },
  // 安達景盛＝『吾妻鏡』が「政子の言葉を代読した」と読める書き方をする人（§3-1 の装置に要る）。
  'p-kagemori': { tone:'midori', head:'eboshi', hair:'dark', shape:'square', brow:'soft', eye:'calm', mouth:'soft', beard:'beard', nose:'round' },

  '_default': { tone:'ai', head:'eboshi', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none' },
};

// ★A Chapter → face-spec key for the map "you".
// 1-2 = 御台所（垂髪）/ 3-7 = 尼形（1199 の出家以降。ch3 は 1203）。
export const PROTAGONIST_FACE_BY_CH: Record<string, string> = {
  1: 'p-masako@wife', 2: 'p-masako@wife', 3: 'p-masako',
  4: 'p-masako', 5: 'p-masako', 6: 'p-masako', 7: 'p-masako',
};

// ★G Life-stage set pieces. Shown large at the head of a chapter whose face changes.
// 本作の背骨（design §1）: 走って選んだ娘 → 夫と子を見おくった尼 → 家を続けた人。
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }> = {
  'p-masako@wife': {
    title: 'きみは <ruby>伊豆<rt>いず</rt></ruby>の <ruby>北条<rt>ほうじょう</rt></ruby>の 娘、政子',
    caption: 'のちに「<ruby>尼将軍<rt>あましょうぐん</rt></ruby>」と 呼ばれる 人——でも いまは、都から 遠い 伊豆の、小さな <ruby>武士<rt>ぶし</rt></ruby>の 家の 娘。すぐ そばに、京から 流されて きた 男が 一人 いる。ここから、きみが この人の 一生を 生きて いく。',
  },
  'p-masako': {
    title: '<ruby>髪<rt>かみ</rt></ruby>を おろした 政子',
    caption: '夫が 死に、きみは <ruby>尼<rt>あま</rt></ruby>に なった。だが 手を 引いたのでは ない。ここから 26年、きみは 子を <ruby>廃<rt>はい</rt></ruby>し、父を <ruby>伊豆<rt>いず</rt></ruby>へ 返し、次の <ruby>鎌倉殿<rt>かまくらどの</rt></ruby>を 京から 迎える。母で ありながら、家を 続ける 人でも ある——その 二つを、きみは 一人で かかえて いく。',
  },
};
