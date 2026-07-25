// Face specs (FACE_SPEC). Generator: src/engine/art/face.ts.
//
// 典拠3層（顔エンジン要件② / research §4B）:
//  ① 同時代の確実な肖像 — 本作は **全員に写真が現存する**（5作＋masako でいちばん忠実性の心配が
//     要らない近代人）。渋沢は多数の写真、慶喜・岩崎・大隈・井上・大久保も写真が残る。
//  ② 様式の像 — 渋沢の支配的イメージは 2024年の新一万円札だが、図案は **古希（70歳）頃の写真**が基で、
//     白い口髭・和装（紋付）＝91歳の最晩年ではなく初老の顔（政府広報）。
//  ③ 現在の一般イメージ — 大河『青天を衝け』(2021) と新札で「白髭・和装の実業家」が定型。
// ゆえに faces.ts は「誰の顔か」（typ 忠実性）と「誰と誰が違うか」（要件①＝距離フロア ≥2.4）の
// **両方を初めて同時に問える**（research §4B）。距離フロアは faces 追加後に face-audit で再計測する。
//
// 近代の顔語彙は勝海舟（第3作）で既に導入済み＝engine 拡張ゼロ（design §4①）:
//   sangiri（ざんぎり・断髪）/ garb:'western'（洋装フロックコート）/ hair:'grey'+age:'old'（白髪老け）/
//   beard:'mustache'|'full'|'beard'。渋沢の3 variant は全て既存語彙で描ける。
//
// tone = camp color for THIS work（人物固有の属性ではない）:
//   ai=血洗島・渋沢の家（藍玉の家）/ seal=徳川・旧主 / gold=明治政府 / midori=実業・もう一つの道.
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec> = {
  // You = 渋沢栄一. Representative face = 晩年の白髭和装（一万円札の顔・§4B②）. The work's face,
  // so the most recognizable stage leads. The map "you" ages via the @ variants below.
  'p-eiichi': { tone:'ai', head:'sangiri', hair:'grey', shape:'oval', brow:'calm', eye:'calm', mouth:'soft', beard:'mustache', skin:'#e9cba8', age:'old', nose:'round' },
  // ★A 若き攘夷志士（ch1-2 = 1863〜66）。月代の侍。怒りを噛む口（frown）と据わった若さ（browY -1）
  // で 幕末侍の密帯（katsu/p-katsu・ieyasu/@young）から離す（face-audit の距離ループ）。
  'p-eiichi@young': { tone:'ai', head:'chonmage', hair:'dark', shape:'long', brow:'stern', eye:'sharp', mouth:'frown', beard:'none', nose:'round', morph:{browY:-1} },
  // ★A 壮年の実業家（ch3-5 = 1867〜78）。パリで髷を落とした ざんぎり＋洋装（p-katsu@old/p-fukuzawa と
  // 同型）。晩年（mustache/grey）と分けるため beard none・hair dark。narrow eye で ieyasu/@young から離す。
  'p-eiichi@prime': { tone:'ai', head:'sangiri', hair:'dark', shape:'long', brow:'stern', eye:'narrow', mouth:'flat', beard:'none', garb:'western', nose:'round' },

  // 血洗島・渋沢の家 (ai)。
  // 尾高惇忠＝従兄で 論語を 授けた 師（渋沢の「道徳」の源・§4）。のち富岡製糸場 初代場長。学者の穏やかさ。
  'p-junchu': { tone:'ai', head:'chonmage', hair:'dark', shape:'long', brow:'calm', eye:'calm', mouth:'soft', beard:'mustache', skin:'#f2dcc6', nose:'tall' },
  // 尾高長七郎＝横浜焼き討ちを止めた従兄。剣客。止めに入る、思いつめた鋭さ（worried＋frown）。
  // oval＋frown で masako/p-kugyo（僧形の gaunt）から離す。
  'p-choshichiro': { tone:'ai', head:'chonmage', hair:'dark', shape:'oval', brow:'worried', eye:'sharp', mouth:'frown', beard:'none', nose:'thin' },
  // 渋沢市郎右衛門＝父。藍の商いを 仕込んだ 豪農。老いた四角い顔（役割語でなくカード＝ch1 の要）。
  'p-ichiroemon': { tone:'ai', head:'chonmage', hair:'grey', shape:'square', brow:'stern', eye:'calm', mouth:'flat', beard:'full', skin:'#e9cba8', age:'old', nose:'wide' },

  // 徳川・旧主 (seal)。
  // 慶喜は katsu にも出る（同一人物は作品をまたいで同じ特徴＝tests/face-distinct の cross-work 契約）。
  // katsu の p-yoshinobu を tone だけ変えて写す（比較は tone を除いて行われる）。
  'p-yoshinobu': { tone:'seal', head:'chonmage', hair:'dark', shape:'long', brow:'soft', eye:'narrow', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'tall' },
  // 徳川昭武＝パリ万博の主君（慶喜の弟）。渡欧時は10代の若さ。やわらかな公達。
  'p-akitake': { tone:'seal', head:'chonmage', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', skin:'#f6d3ab', cheek:'blush', nose:'thin' },
  // 平岡円四郎＝一橋家の用人。渋沢を見いだし仕官させた（ch2 closeup）。切れ者。round＋narrow で
  // ieyasu/p-hanzo・katsu/p-tesshu（角面の武人）から離す。
  'p-hiraoka': { tone:'seal', head:'chonmage', hair:'dark', shape:'round', brow:'stern', eye:'narrow', mouth:'flat', beard:'beard', nose:'wide' },

  // 明治政府 (gold)。
  // 大隈重信＝渋沢を政府に引き入れた人。晩年は洋装・大髭の元勲。快活な目。
  'p-okuma': { tone:'gold', head:'sangiri', hair:'dark', shape:'round', brow:'soft', eye:'lively', mouth:'soft', beard:'beard', garb:'western', nose:'round' },
  // 井上馨＝大蔵省の上司、共に下野した相棒。長州。口髭・洋装。sharp eye＋wide nose で
  // katsu/p-shozan（narrow・tall の碩学）から離す。
  'p-inoue': { tone:'gold', head:'sangiri', hair:'dark', shape:'long', brow:'stern', eye:'sharp', mouth:'flat', beard:'mustache', garb:'western', nose:'wide' },
  // 大久保利通＝予算で対立した相手。冷徹な内務卿。頬髯と冷たい眼。
  'p-okubo': { tone:'gold', head:'sangiri', hair:'dark', shape:'gaunt', brow:'stern', eye:'sharp', mouth:'frown', beard:'full', garb:'western', iris:'#37465a', nose:'thin' },

  // 実業・もう一つの道 (midori)。
  // 岩崎弥太郎＝三菱。独占 vs 合本の「もう一つの正解」（敵役でなく声を与える・B2・§3-3）。
  // 土佐の 気迫、豊かな髭、押しの強い大柄。角面の武人群（yoshitomo/yoriie）と一代の豪胆さを分けるため、
  // round＋lively eye＋grin（自ら財閥を築いた自信）で masako/p-yoshikazu・kiyomori/p-yoshitomo から離す。
  'p-yataro': { tone:'midori', head:'chonmage', hair:'dark', shape:'round', brow:'angry', eye:'lively', mouth:'grin', beard:'full', nose:'wide', morph:{browY:1} },

  '_default': { tone:'ai', head:'chonmage', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none' },
};

// ★A Chapter → face-spec key for the map "you".
// 1-2 = 若き志士（月代）/ 3-5 = 壮年の実業家（ざんぎり洋装。パリで髷を落とす）/ 6-7 = 晩年（白髭和装）。
export const PROTAGONIST_FACE_BY_CH: Record<string, string> = {
  1: 'p-eiichi@young', 2: 'p-eiichi@young', 3: 'p-eiichi@prime',
  4: 'p-eiichi@prime', 5: 'p-eiichi@prime', 6: 'p-eiichi', 7: 'p-eiichi',
};

// ★G Life-stage set pieces. Shown large at the head of a chapter whose face changes.
// 本作の背骨（design §1）: 外国を焼こうとした志士 → 髷を落として世界を見た実業家 → 一万円札の顔。
// 月代→ざんぎり→白髭 の head 変化が「立場を変えつづけた」時代の turn を運ぶ（katsu の先例）。
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }> = {
  'p-eiichi@young': {
    title: 'きみは <ruby>血洗島<rt>ちあらいじま</rt></ruby>の <ruby>藍<rt>あい</rt></ruby>の 家の 子、<ruby>栄一<rt>えいいち</rt></ruby>',
    caption: 'のちに「<ruby>日本資本主義<rt>にほんしほんしゅぎ</rt></ruby>の 父」と 呼ばれる 男——でも いまは、<ruby>武蔵<rt>むさし</rt></ruby>の <ruby>百姓<rt>ひゃくしょう</rt></ruby>の 子。<ruby>藍玉<rt>あいだま</rt></ruby>を 売り、<ruby>論語<rt>ろんご</rt></ruby>を 学び——そして いま、外国人を 焼こうと している。ここから、きみが この人の 一生を 生きて いく。',
  },
  'p-eiichi@prime': {
    title: '<ruby>髷<rt>まげ</rt></ruby>を おとした 栄一',
    caption: 'パリで きみは 髷を 落とし、<ruby>洋服<rt>ようふく</rt></ruby>を 着た。外国を 焼こうと した きみが、外国の しくみ——<ruby>銀行<rt>ぎんこう</rt></ruby>・会社・鉄道——に 国を 動かす 答えを 見た。日本に 帰り、<ruby>役人<rt>やくにん</rt></ruby>の 椅子を おりて、みんなの お金で 大きな ことを する 世を つくって いく。',
  },
  'p-eiichi': {
    title: '<ruby>白髭<rt>しらひげ</rt></ruby>の 栄一',
    caption: '数えきれない 会社を 起こし、それでも 自分の <ruby>財閥<rt>ざいばつ</rt></ruby>は つくらなかった。<ruby>負<rt>ま</rt></ruby>けた 旧主・<ruby>慶喜<rt>よしのぶ</rt></ruby>の ために 紙を 積み、<ruby>晩年<rt>ばんねん</rt></ruby>は 海を こえて 平和を 説いた。——この 顔が やがて、一万円札に なる。',
  },
};
