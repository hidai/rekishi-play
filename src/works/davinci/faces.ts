// Face specs (FACE_SPEC). Generator: src/engine/art/face.ts.
//
// FIRST NON-JAPANESE CAST: the Sengoku head vocabulary (eboshi/kabuto/…) does not fit Renaissance
// Italy, so every face here wears the new `beret` head (a soft flat cap worn by artists/scholars,
// added to face.ts this cycle). That single new head also does double duty for the distinctness
// gate (tests/face-distinct.test.ts, ALL_WORKS): `beret` exists on no other work's face, so every
// davinci face is already +1 from all 74 prior faces on `head` alone — the specs below then vary
// shape/beard/nose/eye so each pair clears feature-distance ≥ 2 (verified by scripts/face-audit).
//
// SKELETON SCOPE: garb is left at the default (kimono) — a Renaissance garment (doublet/gown) is a
// face.ts art task deferred to the face-authoring phase, together with any second head (bonnet) and
// hair-loose variants. The skeleton needs faces that RENDER and stay distinct, not final costume.
//
// tone = camp color for THIS work (design §4's relation axis), not a fixed per-person property:
//   ink=レオナルド自身（手記のセピア）/ midori=目を育てた師 / gold=渡り歩いた宮廷・庇護者 /
//   seal=競い合った好敵手 / ai=手もとに置いた弟子.
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec> = {
  // You = レオナルド. Representative face = the white-bearded sage popularly known from the Turin
  // "self-portrait" — but that drawing's attribution to Leonardo is DISPUTED (research §4B: ☆). We
  // adopt the familiar image as the public likeness without asserting it as fact (a 伝承像).
  // The map "you" ages via the @ variants below (PROTAGONIST_FACE_BY_CH).
  'p-leonardo': { tone:'ink', head:'beret', hair:'grey', shape:'long', brow:'calm', eye:'calm', mouth:'soft', beard:'full', nose:'tall', skin:'#e9cba8', age:'old' },
  //  1) 私生児の少年〜若い弟子 (ch1-2): Florence apprentice, watchful and eager.
  //  Sourced trait = long chest-length CURLS (Anonimo Gaddiano/Vasari, research §4B) — not yet an
  //  engine channel (hair is color-only); the curl art is the `n-curl` star's payoff, deferred to
  //  the attended face-authoring phase.
  'p-leonardo@young': { tone:'ink', head:'beret', hair:'dark', shape:'oval', brow:'soft', eye:'lively', mouth:'soft', beard:'none', nose:'tall' },
  //  2) ミラノの宮廷画家・技師 (ch3-5): the master who sells himself as a military engineer.
  'p-leonardo@master': { tone:'ink', head:'beret', hair:'dark', shape:'long', brow:'calm', eye:'calm', mouth:'flat', beard:'full', nose:'tall' },
  //  3) 晩年 (ch6-7) = the base 'p-leonardo' above (grey, age old).

  // 目を育てた 師 (midori).
  // ヴェロッキオ＝彫刻を本業とする老練の親方。四角い顔・険しい眉・白髪。
  // mouth 'frown' (slice 9) = the demanding master's set mouth (he judges everything he looks at).
  'p-verrocchio': { tone:'midori', head:'beret', hair:'grey', shape:'square', brow:'stern', eye:'narrow', mouth:'frown', beard:'beard', nose:'wide', skin:'#e9cba8', age:'old' },

  // 渡り歩いた 宮廷・庇護者 (gold).
  // ルドヴィコ・スフォルツァ「イル・モーロ」＝権力者。太い眉・鋭い目・口ひげ。
  // 典拠補正 (research §4B): あだ名「モーロ」＝浅黒い肌（同時代プラート年代記◎）ゆえ skin を色白 #f2dcc6→浅黒へ。
  // 輪郭も同時代証言は面長・長い鼻・突き出た顎（Ferrarini 1477）ゆえ shape round→long（丸顔は根拠が弱く史料と食い違う）。
  'p-ludovico': { tone:'gold', head:'beret', hair:'dark', shape:'long', brow:'angry', eye:'sharp', mouth:'flat', beard:'mustache', nose:'round', skin:'#c99a6e', morph:{ faceW:1.06 } },
  // チェーザレ・ボルジア＝冷たい野心家。面長・鋭い目・暗い虹彩・あごひげ（作品最大の暗い岐路）。
  // 通説イメージとして採用（research §4B）: 確定肖像は無い——メローネ「男の肖像」の同定は☆（伝承）。
  'p-cesare': { tone:'gold', head:'beret', hair:'dark', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'beard', nose:'thin', iris:'#43304a', skin:'#e8c9a0', morph:{ faceW:0.93 } },
  // ジュリアーノ・デ・メディチ＝洗練された優しい庇護者（ローマ期）。柔らかい目もと・あごひげ。
  'p-giuliano': { tone:'gold', head:'beret', hair:'dark', shape:'oval', brow:'calm', eye:'gentle', mouth:'soft', beard:'beard', nose:'tall', skin:'#f2dcc6' },
  // フランソワ1世＝若く華やかなフランス王。面長・生きのいい目・ほほえみ。
  // 典拠補正 (research §4B): あだ名「大鼻王」＝長い鼻筋が最確特徴（◎）ゆえ nose wide→tall。
  // ⚠ beard:full は 1519-20 金襴の陣由来の後年の特徴＝レオナルド招聘(1516/22歳)〜没(1519)期は薄い/無い
  //   可能性が高い。ch7 終章の対面 closeup と連動ゆえ顔執筆フェーズ(skeleton-2/attended)でひげ控えめを再検討。
  'p-francois': { tone:'gold', head:'beret', hair:'dark', shape:'long', brow:'calm', eye:'lively', mouth:'smile', beard:'full', nose:'tall', skin:'#f2dcc6' },

  // 競い合った 好敵手 (seal).
  // ミケランジェロ＝無愛想・孤高。やせた輪郭（晩年の禁欲的な肖像＝こけた頬）・怒り眉・への字口・つぶれ鼻（有名な折れた鼻）。
  // browY 下げ＝有名な「テリビリタ（凄み）」の重い眉。
  // shape gaunt = 義朝(kiyomori)との知覚距離を 2.0→3.0 に離す（slice 7・共有していた square を割った）。
  'p-michelangelo': { tone:'seal', head:'beret', hair:'dark', shape:'gaunt', brow:'angry', eye:'sharp', mouth:'frown', beard:'full', nose:'wide', skin:'#e0b892', morph:{ browY:1 } },

  // 手もとに 置いた 弟子 (ai).
  // サライ「小悪魔」＝いたずらっぽい若者。丸顔・生きのいい目・にやり口・赤み。
  // Sourced core trait = CURLS (Vasari, research §4B) — same engine gap as young-Leonardo (`n-curl`,
  // attended face phase); for now blush + grin carry the impishness.
  'p-salai': { tone:'ai', head:'beret', hair:'dark', shape:'round', brow:'soft', eye:'lively', mouth:'grin', beard:'none', nose:'round', cheek:'blush' },
  // メルツィ＝誠実な貴族出の若者。手記を託される相手。柔らかい目もと・細い鼻。
  // eyeScale＝手記を託される若者のまっすぐな目。秀頼(ieyasu)との距離を 2→3 に離す morph も兼ねる。
  'p-melzi': { tone:'ai', head:'beret', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', nose:'thin', skin:'#f2dcc6', morph:{ eyeScale:1.04 } },

  // リザ・デル・ジョコンド = モナ・リザの モデル（ch6 パイロットの 観察 closeup 対象）。davinci 唯一の
  // 女性顔＝ベレー帽でなく center-parted の長い髪（`suberakashi`）。ルネサンス女性の bonnet は face 執筆
  // フェーズ送り（faces.ts ヘッダ）。beret 一色の男性陣から head だけで +1、それ以外を kiyomori の
  // suberakashi 女性たちから振って 別人距離 ≥2 にする（scripts/face-audit で担保）。
  'p-lisa': { tone:'gold', head:'suberakashi', hair:'dark', shape:'oval', brow:'soft', eye:'calm', mouth:'soft', beard:'none', nose:'thin', skin:'#f0d9bf', garb:'gown', browWeight:'fine' },

  '_default': { tone:'ink', head:'beret', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none' },
};

// ★A Chapter → face-spec key for the map "you".
// 1-2=若い弟子 / 3-5=宮廷の巨匠 / 6-7=晩年（base）.
export const PROTAGONIST_FACE_BY_CH: Record<string, string> = {
  1: 'p-leonardo@young', 2: 'p-leonardo@young', 3: 'p-leonardo@master',
  4: 'p-leonardo@master', 5: 'p-leonardo@master', 6: 'p-leonardo', 7: 'p-leonardo',
};

// ★G Life-stage set pieces. Shown large at the head of a chapter whose face changes from the
// previous one. They carry the work's spine (design §2): a self-taught bastard boy who trusts his
// own eyes → a court master who sells war machines → an old man leaving five thousand pages behind.
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }> = {
  'p-leonardo@young': {
    title: 'きみは ヴィンチ<ruby>村<rt>むら</rt></ruby>の <ruby>私生児<rt>しせいじ</rt></ruby>、レオナルド',
    caption: 'のちに モナ・リザを 描き、空とぶ 機械を 考える 男——でも いまは、えらい <ruby>学校<rt>がっこう</rt></ruby>には 行けない ひとりの 子ども。むずかしい 本の かわりに、川や 岩や 鳥を、ただ じっと 見つめて いる。ここから、きみが この人の 一生を 生きて いく。',
  },
  'p-leonardo@master': {
    title: 'ミラノの <ruby>宮廷画家<rt>きゅうていがか</rt></ruby>・<ruby>技師<rt>ぎし</rt></ruby> レオナルド',
    caption: '村の 子は、ミラノの あるじに つかえる 巨匠に なった。だが 宮廷に 入る とき 売り込んだのは「絵」より 先に「戦の 道具」。平和を 願いながら 兵器を 設計する——その 矛盾を かかえて、きみは 描き、作り、また 別の ことへ 移って いく。',
  },
  'p-leonardo': {
    title: '<ruby>五千枚<rt>ごせんまい</rt></ruby>の <ruby>手記<rt>しゅき</rt></ruby>を かかえた <ruby>晩年<rt>ばんねん</rt></ruby>の レオナルド',
    caption: 'モナ・リザを 手ばなさず、死体を 切り開き、空を とぶ 夢を 描き続ける。やがて アルプスを こえ、異国の 王に 敬われて 死ぬ。あとに 残るのは、どこまでも つながって「完」の 来ない、五千枚の ノート。',
  },
};
