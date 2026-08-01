// Face specs (FACE_SPEC). Generator: src/engine/art/face.ts.
// Sengoku head vocabulary is reused as-is from hidenaga (eboshi/kanmuri/chasen/kabuto/bozu/
// suberakashi/wakamusha/maegami) — research §5/§6 note that this era needs no new art.
//
// tone = camp color for THIS work (design §4's relation axis), not a fixed per-person property:
//   ai=徳川がわ / gold=渡り歩いた あるじ・同盟者（今川・織田・豊臣）/ seal=戦った 相手 /
//   midori=死なせた 家族 / ink=神君の 話を つくった 側.
// Nobunaga/Hideyoshi keep their hidenaga FEATURES verbatim (design §4: never contradict a person
// across works) but take this work's camp tone — in hidenaga, Nobunaga is 'seal' because he is the
// overlord seen from the Toyotomi; here he is a 20-year ally, so the ring color follows the camp.
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec> = {
  // You = 徳川家康. Representative face = the 神君 image everyone can name: a stout, calm,
  // unreadable old lord. The map "you" ages via the @ variants below.
  // nose 'round' on every adult variant (slice 2): the fleshy nose the portraits agree on —
  // the stout 通説 image lives in the face center, and it separates him from the era's cast.
  // Signature morph (slice 3): mouthScale 0.92 — the small, tight, unreadable mouth of the
  // portraits. Only on the closed-up faces (rep/@lord/@old): the mask arrives WITH the
  // 律儀者 years, the way Katsu's nose bridge arrives with adulthood.
  'p-ieyasu': { tone:'ai', head:'eboshi', hair:'dark', shape:'round', brow:'calm', eye:'narrow', mouth:'flat', beard:'mustache', nose:'round', morph:{mouthScale:0.92} },
  // ★A Aging variants (see PROTAGONIST_FACE_BY_CH).
  //  1) 竹千代 (ch1): the hostage boy. Watchful, not miserable — research §3-6 finds the
  //     "厚遇された人質" reading now dominant, so the face avoids the novelist's suffering child.
  'p-ieyasu@child': { tone:'ai', head:'maegami', hair:'dark', shape:'round', brow:'soft', eye:'wide', mouth:'flat', beard:'none', skin:'#f6d3ab', cheek:'blush', age:'child' },
  //  2) 若き当主 (ch2-3): 三方ヶ原 / 伊賀越え — the 30s warrior who loses badly and runs.
  'p-ieyasu@young': { tone:'ai', head:'wakamusha', hair:'dark', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'none', nose:'round' },
  //  2a) 三方ヶ原 (ch2 の closeup only — design §2 calls for「恐怖の顔」; the house grammar for an
  //     emotion variant in a closeup is hidenaga's 'p-hideyoshi@grief'). @young with the eyes
  //     blown wide and the skin drained: the moment he tops the plateau and finds the army that
  //     was supposed to have marched away turned around, waiting. brow stays 'stern' rather than
  //     'worried' — worried+wide would read as a whimper AND collide with p-hideaki's face.
  'p-ieyasu@fear': { tone:'ai', head:'wakamusha', hair:'dark', shape:'oval', brow:'stern', eye:'wide', mouth:'flat', beard:'none', skin:'#f2dcc6', nose:'round' },
  //  2b) しかみ像 (ch2 の reveal only — NOT in PROTAGONIST_FACE_BY_CH). The face the legend
  //     says he had painted to shame himself after 三方ヶ原. Same man as @young (head/shape held
  //     constant) wearing the grimace the 顰 in 顰像 names. The reveal erects the 神君 legend
  //     visually; the scene text then shows the record for it was never found (research §3-3) —
  //     the picture IS the 通説, so it needs its own face.
  //     brow:'worried'+eye:'narrow' (not angry+sharp): rastered side by side, angry+sharp reads as
  //     「怒っている家康」, which fights the reveal caption「情けない姿」. worried+narrow reads as the
  //     苦渋/憔悴 the legend describes — and 'narrow' keeps it from tipping into hideaki's whimper.
  'p-ieyasu@shikami': { tone:'ai', head:'wakamusha', hair:'dark', shape:'oval', brow:'worried', eye:'narrow', mouth:'frown', beard:'none', cheek:'sunken', skin:'#e9cba8', nose:'round' },
  //  3) 律儀者 (ch4-5): bows to Hideyoshi, wins 関ヶ原. Fills out; the face closes up (narrow
  //     eyes, flat mouth) — the "reads nothing on it" look the 律儀者 evaluation attaches to.
  'p-ieyasu@lord': { tone:'ai', head:'eboshi', hair:'dark', shape:'round', brow:'calm', eye:'narrow', mouth:'flat', beard:'mustache', nose:'round', morph:{mouthScale:0.92} },
  //  4) 大御所 (ch6-7): destroys the Toyotomi at 74 (数え, 夏の陣 1615), dies at 駿府 (享年75), becomes
  //     a god. Ages here are 数え, per research §1/§2 — say which, or the off-by-one comes back.
  'p-ieyasu@old': { tone:'ai', head:'eboshi', hair:'grey', shape:'round', brow:'calm', eye:'narrow', mouth:'flat', beard:'mustache', skin:'#e9cba8', age:'old', nose:'round', morph:{mouthScale:0.92} },

  // 渡り歩いた あるじ・同盟者（gold）— design §4's spine: 今川 → 織田 → 豊臣.
  // 義元＝名門今川の当主。公家風の冠・白い肌・落ち着き（研究では「軟弱な公家大名」像自体が俗説寄り）。
  'p-yoshimoto': { tone:'gold', head:'kanmuri', hair:'dark', shape:'round', brow:'calm', eye:'narrow', mouth:'soft', beard:'mustache', skin:'#f2dcc6', nose:'round' },
  // 信長＝hidenaga と同一の造作（面長・茶筅髷・つり眉・鋭い細目・青白い肌・冷たい暗紫の瞳）。
  'p-nobunaga': { tone:'gold', head:'chasen', hair:'dark', shape:'long', brow:'angry', eye:'narrow', mouth:'flat', beard:'mustache', skin:'#f2dcc6', iris:'#43304a', nose:'tall' },
  // 本能寺 (ch3 の crisis reveal only — NOT in PROTAGONIST_FACE_BY_CH). Same 造作 as above with the
  // brow/eye/mouth of the fall — and byte-for-byte the same variant hidenaga stamps on the same
  // event (hidenaga 4-a), minus the camp tone, which follows THIS work (design §4: never contradict
  // a person across works; the ring color is a per-work camp, not a property of the man).
  'p-nobunaga@fall': { tone:'gold', head:'chasen', hair:'dark', shape:'long', brow:'worried', eye:'wide', mouth:'frown', beard:'mustache', skin:'#f2dcc6', iris:'#43304a', nose:'tall' },
  // 秀吉＝hidenaga と同一の造作（丸く小さい顔・大きな耳・笑いじわ・大口・日焼け肌）。
  'p-hideyoshi': { tone:'gold', head:'kanmuri', hair:'dark', shape:'round', ears:'big', cheek:'monkey', brow:'calm', eye:'lively', mouth:'laugh', beard:'mustache', skin:'#d99a5f', nose:'wide' },
  // 秀長＝hidenaga の主人公が、こちらでは 4-c の宿の主として1枚だけ出る（cross-work §4）。造作は
  // hidenaga の代表顔とバイト一致（同一人物は作品をまたいで矛盾しない）。兄と並ぶ場面ゆえ、丸顔・
  // 大口・日焼けの兄に対して 面長・穏やかな目・控えめな笑みが「表に出ない弟」を担う。
  'p-hidenaga': { tone:'gold', head:'eboshi', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'smile', beard:'none', nose:'round', morph:{mouthScale:1.08} },

  // 戦った 相手（seal）。
  // 信玄＝出家した猛将。四角い顔・ふさふさ髭・険しい眉（有名な「信玄像」の帰属自体が今は諸説）。
  'p-shingen': { tone:'seal', head:'bozu', hair:'dark', shape:'square', brow:'angry', eye:'sharp', mouth:'flat', beard:'full', nose:'round' },
  // 三成＝実務家。面長・鋭い目・髭なしの若さ（関ヶ原時 40）。nose 'thin' = the fine-boned
  // administrator (was distance 1 from kiyomori/p-mochihito).
  // mouth 'frown' (slice 9) = the unbending administrator everyone found stiff — the trait the
  // work's ch5 turns on (the allies who would not follow him).
  'p-mitsunari': { tone:'seal', head:'eboshi', hair:'dark', shape:'long', brow:'stern', eye:'sharp', mouth:'frown', beard:'none', skin:'#f2dcc6', nose:'thin' },
  // 秀秋＝関ヶ原で数え19の若者（21は1602年の享年＝取り違え注意）。迷いを眉と見開いた目に
  // （「劇的な裏切り者」でなく、板ばさみの若者）。nose 'thin' = the unhardened youth.
  // eyeY 1 = eyes set low, the boyishness under the armor (slice 3; finishes the @fear pair).
  // shape long = 酒で身を持ち崩した薄命の若者の細面。yoshitsune(kiyomori) と @fear の両ペアを
  // 知覚距離 2.0→3.0 に離す（slice 7・二人と共有していた oval を割った・共有ノード一括解消）。
  'p-hideaki': { tone:'seal', head:'wakamusha', hair:'dark', shape:'long', brow:'worried', eye:'wide', mouth:'flat', beard:'none', skin:'#f2dcc6', nose:'thin', morph:{eyeY:1} },
  // 淀殿＝「悪女」ラベルを剥がす向き（design §4）。すべらかし・気高く静か（たくらむ顔にしない）。
  'p-yodo': { tone:'seal', head:'suberakashi', hair:'dark', shape:'oval', brow:'stern', eye:'calm', mouth:'flat', beard:'none', skin:'#f2dcc6', garb:'kosode', browWeight:'fine', nose:'tall' },
  // 秀頼＝大坂夏の陣で 23。若武者・柔らかい目もと。nose 'tall' = the imposing frame the
  // records describe — and the visual counter to round-nosed Ieyasu in the ch6-7 face-off.
  'p-hideyori': { tone:'seal', head:'wakamusha', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'tall' },

  // 死なせた 家族（midori）＝ design §4-6 の割り切れなさの中心。
  // 築山殿＝今川一門の娘。すべらかし・静かな目もと。淀殿と同じ髪型ゆえ、輪郭（round↔oval）と
  // 眉（soft↔stern）で差をつける——章六では二人とも登場しうる（襟の色 緑↔朱 だけに頼らない）。
  // mouth frown = 悲運の正室の沈んだ口もと（slice 8: kiyomori/p-tokuko の soft から離す。淀殿は
  // flat ゆえ frown なら淀殿とも離れたまま——flat にすると淀殿と輪郭・眉だけの 1.6 に落ちる）。
  'p-tsukiyama': { tone:'midori', head:'suberakashi', hair:'dark', shape:'round', brow:'soft', eye:'calm', mouth:'frown', beard:'none', skin:'#f2dcc6', garb:'kosode', browWeight:'fine', nose:'round' },
  // 信康＝21 で死んだ嫡男。若武者・生きのいい目（父に似た輪郭）。
  // brow 'soft' + mouth 'smile' (slice 9): the son the father is made to order dead should read as
  // a warm, living boy in ch2 — a stern flat face made his death cost nothing to look at.
  'p-nobuyasu': { tone:'midori', head:'wakamusha', hair:'dark', shape:'round', brow:'soft', eye:'lively', mouth:'smile', beard:'none', nose:'wide' },

  // 徳川がわ の 家来（ai）。
  // 半蔵＝「忍者の頭領」像を剥がす対象（研究 §3-11）。だからこそ顔は忍びでなく、兜の武辺者に描く。
  // nose 'wide' = the blunt fighting man「鬼半蔵」(was distance 1 from THREE faces across works:
  // hidenaga/p-takatora, kiyomori/p-kiyomori@young, kiyomori/p-tomomori — face-audit 2026-07-17).
  'p-hanzo': { tone:'ai', head:'kabuto', hair:'dark', shape:'square', brow:'stern', eye:'sharp', mouth:'flat', beard:'beard', nose:'wide' },
  // 正信＝一度は敵に回り、許されて最側近になった参謀。こけた頬・細い目の知恵者。
  'p-masanobu': { tone:'ai', head:'eboshi', hair:'grey', shape:'gaunt', cheek:'sunken', brow:'calm', eye:'narrow', mouth:'soft', beard:'mustache', skin:'#e9cba8', nose:'thin' },

  // 神君の 話を つくった 側（ink）。
  // 天海＝神号論争を制し、家康を「東照大権現」にした僧（研究 §3-1）。老僧・面長・こけた頬。
  // mouth 'soft' (slice 9) = the serene, knowing mouth of the monk who talks a dead man into a god.
  'p-tenkai': { tone:'ink', head:'bozu', hair:'grey', shape:'long', cheek:'sunken', brow:'calm', eye:'narrow', mouth:'soft', beard:'beard', skin:'#e9cba8', age:'old', nose:'tall' },

  '_default': { tone:'ai', head:'eboshi', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none' },
};

// ★A Chapter → face-spec key for the map "you".
// 1=竹千代 / 2-3=若き当主 / 4-5=律儀者 / 6-7=大御所.
export const PROTAGONIST_FACE_BY_CH: Record<string, string> = {
  1: 'p-ieyasu@child', 2: 'p-ieyasu@young', 3: 'p-ieyasu@young', 4: 'p-ieyasu@lord',
  5: 'p-ieyasu@lord', 6: 'p-ieyasu@old', 7: 'p-ieyasu@old',
};

// ★G Life-stage set pieces. Shown large at the head of a chapter whose face changes from the
// previous one. They carry the work's spine (design §1-1): a hostage child → a lord who runs
// from a battle → the man called 律儀者 → the man who ends the house he served, and becomes a god.
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }> = {
  'p-ieyasu@child': {
    title: 'きみは <ruby>人質<rt>ひとじち</rt></ruby>の 子、<ruby>竹千代<rt>たけちよ</rt></ruby>',
    caption: 'のちに 天下を とり、死んで 神に まつられる 男——でも いまは、よその 家に あずけられた ひとりの 子ども。ここから、きみが この人の 一生を 生きて いく。',
  },
  'p-ieyasu@young': {
    title: '<ruby>三河<rt>みかわ</rt></ruby>の <ruby>若<rt>わか</rt></ruby>い <ruby>当主<rt>とうしゅ</rt></ruby>・<ruby>徳川家康<rt>とくがわ いえやす</rt></ruby>',
    caption: '人質の 子は、自分の 国を 持つ 大名に なった。だが 東からは <ruby>武田<rt>たけだ</rt></ruby>の 大軍、西には <ruby>織田信長<rt>おだ のぶなが</rt></ruby>。生きのびる ことが、まず 仕事だ。',
  },
  'p-ieyasu@lord': {
    title: '「<ruby>律儀者<rt>りちぎもの</rt></ruby>」と 呼ばれた 男',
    caption: '渡り合った <ruby>秀吉<rt>ひでよし</rt></ruby>に 頭を 下げ、言われるまま <ruby>関東<rt>かんとう</rt></ruby>へ 移る。さからわず、約束を まもる——世間は その 姿を「律儀者」と 呼んだ。',
  },
  'p-ieyasu@old': {
    title: '<ruby>大御所<rt>おおごしょ</rt></ruby>・<ruby>晩年<rt>ばんねん</rt></ruby>の 家康',
    caption: '将軍の 位は 子に ゆずり、なお 実権を にぎる。そして 70を こえた この 手で、いちばん 長く 仕えた <ruby>主家<rt>しゅけ</rt></ruby>を 終わらせる ことに なる。',
  },
};
