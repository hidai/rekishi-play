// Face specs (FACE_SPEC). Generator: src/engine/art/face.ts.
// Modern (幕末〜明治) head/garb vocabulary (design §3-2): Bakumatsu samurai wear `chonmage`
// (forward-folded Edo topknot; the Sengoku `chasen` queue stays with earlier works), the
// Meiji-era Katsu and Fukuzawa wear `sangiri` (cropped hair) + `garb:'western'`, Brooke wears
// `seibo` (naval officer's peaked cap) + `garb:'navy'`, and Saigo (government commander at the
// Edo talks) keeps his topknot over a `garb:'navy'` uniform. Hand-managed.
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec> = {
  // You = Katsu Kaishu. Representative face of his mid-life Bakushin years (topknot, world in
  // his eyes). The map "you" ages via the @ variants below.
  // nose 'tall' on the adult variants = the defined nose bridge his photographs show; also
  // separates him from same-work Oguri/Tesshu, which sat at distance 1 (face-audit 2026-07-17).
  // Signature morph (face-engine slice 3): eyeScale 1.08 on every life stage — the keen,
  // bright eyes the photographs agree on, there since boyhood.
  'p-katsu': { tone:'ai', head:'chonmage', hair:'dark', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'none', nose:'tall', morph:{eyeScale:1.08} },
  // ★A Aging variants of Katsu (see PROTAGONIST_FACE_BY_CH).
  //  1) Poor-hatamoto youth 麟太郎 (ch1). Lively eyes, bright skin, forelock. Keeps the child
  //     default nose — the bridge comes in with adulthood, as the drawing convention.
  'p-katsu@boy': { tone:'ai', head:'wakamusha', hair:'dark', shape:'oval', brow:'soft', eye:'lively', mouth:'smile', beard:'none', skin:'#f2dcc6', morph:{eyeScale:1.08} },
  //  2) Prime Bakushin (ch2-5): Nagasaki / Kanrin-maru / the man who negotiates Edo's surrender.
  'p-katsu@prime': { tone:'ai', head:'chonmage', hair:'dark', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'none', nose:'tall', morph:{eyeScale:1.08} },
  //  3) The Hikawa old man (ch6-7): Meiji — cropped hair (断髪) and a Western suit, grey, aged
  //     lines, but keeps his sharp gaze. The head change (topknot → cropped) tells the era turn.
  'p-katsu@old': { tone:'ai', head:'sangiri', hair:'grey', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'none', skin:'#e9cba8', age:'old', garb:'western', nose:'tall', morph:{eyeScale:1.08} },

  // 幕臣（Bakushin, ai）。
  'p-kokichi': { tone:'ai', head:'chonmage', hair:'dark', shape:'square', brow:'angry', eye:'lively', mouth:'grin', beard:'beard', nose:'wide' },
  // mouth 'soft' + nose 'tall' (slice 9) = the affable last shogun everyone found charming and no
  // one could read, on the long straight nose his photographs show. Mirrored in shibusawa.
  'p-yoshinobu': { tone:'ai', head:'chonmage', hair:'dark', shape:'long', brow:'soft', eye:'narrow', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'tall' },
  // nose 'thin' = the fine-boned hardline administrator (slice 3; was distance 2 from
  // same-work Katsu/Tesshu/Shozan).
  'p-oguri': { tone:'ai', head:'chonmage', hair:'dark', shape:'oval', brow:'stern', eye:'narrow', mouth:'flat', beard:'none', nose:'thin' },

  // 新政府がわ（Satsuma, seal）。
  // 典拠補正 (research §4B・要件②): 通説イメージ＝ひげなし（キヨッソーネ銅版画1883・上野銅像とも無ひげ・複数独立ソース一致）
  //   ゆえ beard full→none（あだ名でなく肖像の食い違い＝davinci ludovico と同型）。★確定写真は現存せず——流布する顔は
  //   キヨッソーネが弟・従道＋従弟・大山の顔を合成した復元像（☆帰属論争。本作 §3 の史料批判＝伝記の脚色と同型が肖像にも）。
  //   忠実な残余特徴＝round(恰幅)/eye wide(黒ダイヤの大きな目・アーネスト・サトウ)/stern brow(太眉)。navy＋blush＋wide で別人距離は維持（face-audit）。
  'p-saigo': { tone:'seal', head:'chonmage', hair:'dark', shape:'round', brow:'stern', eye:'wide', mouth:'soft', beard:'none', cheek:'blush', garb:'navy', nose:'wide' },

  // 海軍・弟子（垣根を こえた 海, midori）。
  // ⚠ 通説イメージ (research §4B): 上野彦馬の写真＝月代を剃らない「総髪」（長髪）。engine の head 語彙に総髪種別が
  //   無く chonmage は忠実性の妥協＝art gap（davinci `n-curl` と同じ・顔執筆フェーズで総髪 head を検討）。oval/lively/grin は豪放な通説と整合。
  'p-ryoma': { tone:'midori', head:'chonmage', hair:'dark', shape:'oval', brow:'soft', eye:'lively', mouth:'grin', beard:'none', nose:'wide' },
  // nose 'wide' + mouth 'frown' + eye 'calm' (slice 9) = the big-framed swordsman of 剣禅一如:
  // still eyes under a stern brow, with the ascetic's set mouth. He was the corpus's most generic
  // node (square-jawed, dark-haired, beardless, flat-mouthed) and collided with three other
  // warriors in turn; the calm eye is what finally makes him himself.
  'p-tesshu': { tone:'midori', head:'chonmage', hair:'dark', shape:'square', brow:'stern', eye:'calm', mouth:'frown', beard:'none', nose:'wide' },
  'p-manjiro': { tone:'midori', head:'chonmage', hair:'dark', shape:'oval', brow:'calm', eye:'gentle', mouth:'soft', beard:'none', skin:'#e6c49b', nose:'round' },

  // 学びと 声（師・批判者, ink / gold）。
  // nose tall = 高い鼻筋の威圧的な碩学（slice 8: 同一作品の慶喜 p-yoshinobu〔細面 long〕と鉄舟 p-tesshu〔角面 square〕の
  // 両方から鼻ひとつで離す。shape を square にすると tesshu と eye+beard だけの知覚 2.0 に落ちるので鼻で解く）。
  // mouth 'frown' (slice 9) = the imperious scholar who talked down to everyone (the trait the
  // work's ch1 leans on), not another flat line.
  'p-shozan': { tone:'ink', head:'chonmage', hair:'dark', shape:'long', brow:'stern', eye:'narrow', mouth:'frown', beard:'mustache', nose:'tall' },
  'p-fukuzawa': { tone:'ink', head:'sangiri', hair:'dark', shape:'oval', brow:'calm', eye:'sharp', mouth:'soft', beard:'none', garb:'western', nose:'thin' },
  // American naval officer — peaked cap + stand-collar uniform.
  'p-brooke': { tone:'gold', head:'seibo', hair:'dark', shape:'square', brow:'calm', eye:'calm', mouth:'soft', beard:'beard', skin:'#f0dcc8', garb:'navy', nose:'tall' },

  '_default': { tone:'ai', head:'chonmage', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none' },
};

// ★A Chapter → face-spec key for the map "you". 1=youth / 2-5=prime Bakushin / 6-7=Hikawa old man.
export const PROTAGONIST_FACE_BY_CH: Record<string, string> = {
  1: 'p-katsu@boy', 2: 'p-katsu@prime', 3: 'p-katsu@prime', 4: 'p-katsu@prime',
  5: 'p-katsu@prime', 6: 'p-katsu@old', 7: 'p-katsu@old',
};

// ★G Life-stage set pieces. Shown large at the head of a chapter whose face changes from the
// previous one (youth → prime Bakushin → Hikawa old man). The topknot → cropped-head change
// carries the era turn (design §3-2).
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }> = {
  'p-katsu@boy': {
    title: 'きみは <ruby>貧乏旗本<rt>びんぼうはたもと</rt></ruby>の 子、<ruby>勝麟太郎<rt>かつ りんたろう</rt></ruby>',
    caption: 'のちに 江戸を 戦火から 救う 男——でも いまは、幕府の 中でも 下の 下、微禄の 家の ひとりの 子。ここから、きみが この人の 一生を 生きて いく。',
  },
  'p-katsu@prime': {
    title: '<ruby>幕臣<rt>ばくしん</rt></ruby>・<ruby>勝海舟<rt>かつ かいしゅう</rt></ruby>',
    caption: '西洋の 海軍術を 身に つけ、日本の 船で 世界の 海を わたった。やがて 幕府の 全権を あずかり、江戸の 運命を にぎる。',
  },
  'p-katsu@old': {
    title: '<ruby>氷川<rt>ひかわ</rt></ruby>の 老人・晩年の 海舟',
    caption: '幕府は 終わり、髷を 落として 断髪の 世に。「裏切り者」と 呼ばれても、敵将・西郷を 生涯 弔い つづける——。',
  },
};
