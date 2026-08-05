// Face specs (FACE_SPEC). Generator: src/engine/art/face.ts.
// Late-Heian headwear is approximated with work 1's (Sengoku) faceArt vocabulary (audit,
// design §3-2): court/retainer=eboshi, emperor/retired-emperor crown=kanmuri, cloistered
// emperor/monk=bozu, warrior=kabuto, young warrior=wakamusha, child=maegami. Young court
// women use `suberakashi` (long center-parted flowing hair, 垂髪); `onna` (an elderly
// woman's bun) stays reserved for old women. Hand-managed (kiyomori has no legacy extract
// source).
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec> = {
  // You = Kiyomori. Representative face of his Grand-Minister years (crown, gravitas, man of
  // the sea). The map "you" ages via the @ variants below.
  // Signature nose (face-engine slice 3): the dango nose the @child variant already wears
  // stays with the man for life — the boisterous sea-man's warmth under the stern power.
  // Also lifts the distance-2 pairs around @young (tomomori/yoritomo/hanzo).
  'p-kiyomori': { tone:'ai', head:'kanmuri', hair:'dark', shape:'square', brow:'stern', eye:'narrow', mouth:'flat', beard:'full', nose:'round' },
  // ★A Aging variants of Kiyomori (see PROTAGONIST_FACE_BY_CH).
  //  1) Ise-Heishi boy (ch1). Round face, bright skin, big eyes, blushing cheeks.
  //     nose 'round' (dango) = the boisterous boy; also breaks the cross-work child cluster
  //     with hidenaga's child face (face-audit 2026-07-17, distance was 1).
  //     mouth 'laugh' (slice 9) = the boisterous boy out loud — the split from hidenaga's smiling
  //     child (who now wears the same round family nose) and from davinci's grinning Salai.
  'p-kiyomori@child': { tone:'ai', head:'maegami', hair:'dark', shape:'round', brow:'soft', eye:'lively', mouth:'laugh', beard:'none', skin:'#f6d3ab', cheek:'blush', age:'child', nose:'round' },
  //  2) Young warrior of the Hogen/Heiji wars (ch2). Fierce, in a star helmet.
  //     browY 1 = brows pressed down onto the eyes, the war years' storm brow.
  'p-kiyomori@young': { tone:'ai', head:'kabuto', hair:'dark', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'beard', nose:'round', morph:{browY:1} },
  //  3) Grand Minister (ch3-6). Crown, gravitas, authority. Same as the representative face.
  'p-kiyomori@elder': { tone:'ai', head:'kanmuri', hair:'dark', shape:'square', brow:'stern', eye:'narrow', mouth:'flat', beard:'full', nose:'round' },
  //  4) Lay-priest chancellor, feverish (final ch). Shaved head, white hair, sunken cheeks,
  //     aged lines — but keeps his sharpness to the end.
  'p-kiyomori@old': { tone:'ai', head:'bozu', hair:'grey', shape:'gaunt', cheek:'sunken', brow:'stern', eye:'sharp', mouth:'flat', beard:'full', skin:'#e9cba8', age:'old', nose:'round' },

  // Heike clan (ai).
  // mouth 'soft' + nose 'tall' (slice 9) = the patient courtier-warrior who talked his way into
  // the palace, not another blank-mouthed retainer.
  'p-tadamori': { tone:'ai', head:'eboshi', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'soft', beard:'beard', nose:'tall' },
  // browY -1 = serene raised brows, the composed strength of the future 二位の尼 (slice 3).
  'p-tokiko': { tone:'ai', head:'suberakashi', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', garb:'uchiki', browWeight:'fine', nose:'tall', morph:{browY:-1} },
  // 二位尼 (finale: Kiyomori's deathbed 1181 / 壇ノ浦 1185). Req-② likeness fix (research §4B):
  // Tokiko took the tonsure WITH Kiyomori in 1168 and was ~60 at Dan-no-ura, so the 通説 image
  // everyone pictures for「二位尼」— and the emblem of 平家滅亡, clutching Antoku into the sea —
  // is an OLD NUN, not the young flowing-haired court lady of her ch3 court years. The base
  // `p-tokiko` (young suberakashi) stayed correct for ch3 but read wrong beside dying grey-haired
  // Kiyomori@old and at the drowning. head:'onna' (grey, aged) — the work's reserved old-woman
  // head — carries the age; a true 尼 head (剃髪/被り物) is an art gap deferred to attended
  // (engine has no nun headwear, same defer as Ryoma's sohatsu in katsu). shape oval + no blush
  // + browY -1 (the composed dignity the base comment already named) keep her off hidenaga's
  // p-naka (onna/round/white/blush, the only other onna).
  'p-tokiko@old': { tone:'ai', head:'onna', hair:'grey', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', age:'old', skin:'#e9cba8', garb:'uchiki', browWeight:'fine', nose:'tall', morph:{browY:-1} },
  'p-shigemori': { tone:'ai', head:'eboshi', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'beard', nose:'thin' },
  'p-tokuko': { tone:'ai', head:'suberakashi', hair:'dark', shape:'round', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', skin:'#f6d3ab', cheek:'blush', garb:'uchiki', browWeight:'fine', nose:'round' },
  // browY 1 = the last admiral's pressed brows (slice 3; was distance 2 from ieyasu/p-hanzo
  // and hidenaga/p-takatora).
  'p-tomomori': { tone:'ai', head:'kabuto', hair:'dark', shape:'square', brow:'stern', eye:'calm', mouth:'flat', beard:'beard', nose:'thin', morph:{browY:1} },
  // Kiyomori's uncle at 保元 (2-a2), the half of the Heike that went to the losing brother.
  // Card-less on purpose: the scene calls him 「叔父」 only, so the closeup name-override
  // carries the label and the work stays under the 16-card budget. Grey + gaunt + eboshi =
  // the older generation of the same house; `eye:'calm'` (not sharp) is the resignation he
  // meets the blade with, and keeps him off Kiyomori@young in the same frame.
  'p-tadamasa': { tone:'ai', head:'eboshi', hair:'grey', shape:'gaunt', brow:'angry', eye:'calm', mouth:'frown', beard:'full', skin:'#e6c49b', nose:'wide' },

  // Cloister / emperors (gold).
  // mouth 'soft' (slice 9): under the angry brow and narrow eyes a faint pleasant mouth reads as
  // the smiling manipulator 「日本一の大天狗」— unsettling, where a flat line read as blank.
  'p-goshirakawa': { tone:'gold', head:'bozu', hair:'grey', shape:'long', brow:'angry', eye:'narrow', mouth:'soft', beard:'full', skin:'#e6c49b', iris:'#3a2417', age:'old', nose:'tall' },
  'p-sutoku': { tone:'gold', head:'kanmuri', hair:'dark', shape:'long', brow:'worried', eye:'calm', mouth:'frown', beard:'mustache', iris:'#37465a', nose:'tall' },
  // eyeY 1 = lowered eyes, the frail young emperor (same reading as Antoku's; slice 3).
  'p-takakura': { tone:'gold', head:'kanmuri', hair:'dark', shape:'oval', brow:'soft', eye:'gentle', mouth:'soft', beard:'none', skin:'#f2dcc6', nose:'round', morph:{eyeY:1} },
  // 安徳＝lowered eyes (morph eyeY) for the frail child emperor — a longer forehead reads
  // younger and more fragile than kiyomori@child's mischief; also breaks the distance-1
  // pair with hidenaga's child face (2026-07-17). eyeScale is barred on child faces
  // (it would multiply the legacy 1.11 child boost — code-review catch, slice 2).
  // eye:calm = the preternaturally still, resigned child emperor drowned at Dan-no-ura (vs
  // hidenaga/p-hidenaga@child's warm gentle) — a high-salience split so the two maegami
  // children read apart at a 52px dex chip, not just clear the field-count floor by morph.
  'p-antoku': { tone:'gold', head:'maegami', hair:'dark', shape:'round', brow:'soft', eye:'calm', mouth:'soft', beard:'none', skin:'#f6d3ab', cheek:'blush', age:'child', morph:{eyeY:1} },
  // browY 1 = the cornered prince's resolve pressed into the brow (slice 3).
  'p-mochihito': { tone:'gold', head:'eboshi', hair:'dark', shape:'oval', brow:'stern', eye:'sharp', mouth:'flat', beard:'none', skin:'#f2dcc6', nose:'tall', morph:{browY:1} },

  // Genji (seal).
  // nose 'wide' = the rough field commander (slice 3; was distance 2 from hidenaga's
  // Motochika/Katsuie and ieyasu's Shingen — the fierce-bearded-warrior cluster).
  'p-yoshitomo': { tone:'seal', head:'kabuto', hair:'dark', shape:'square', brow:'angry', eye:'sharp', mouth:'frown', beard:'full', nose:'wide' },
  // nose 'tall' = the long straight bridge the famous (attribution-disputed) portrait shows.
  'p-yoritomo': { tone:'seal', head:'eboshi', hair:'dark', shape:'oval', brow:'stern', eye:'narrow', mouth:'flat', beard:'beard', nose:'tall' },
  // Captive boy of 13 at ch2's '2-c' (pre-genpuku forelock, no beard — the adult 'p-yoritomo' would misread as a grown man).
  'p-yoritomo@young': { tone:'seal', head:'maegami', hair:'dark', shape:'oval', brow:'worried', eye:'gentle', mouth:'flat', beard:'none' },
  // nose 'thin' + lively eyes = the fine-boned agile prodigy (slice 3 nose; slice 8 eye:sharp
  // ->lively splits him from ieyasu/p-ieyasu@young's watchful 'sharp'. nose keeps him off Mochihito/Hidetsugu).
  'p-yoshitsune': { tone:'seal', head:'wakamusha', hair:'dark', shape:'oval', brow:'soft', eye:'lively', mouth:'flat', beard:'none', skin:'#f2dcc6', nose:'thin' },

  // Cloister retainers (midori).
  'p-shunkan': { tone:'midori', head:'bozu', hair:'grey', shape:'gaunt', cheek:'sunken', brow:'worried', eye:'closed', mouth:'frown', beard:'none', skin:'#e6c49b', age:'old', nose:'thin' },

  '_default': { tone:'ai', head:'eboshi', hair:'dark', shape:'oval', brow:'calm', eye:'calm', mouth:'flat', beard:'none' },
};

// ★A Chapter → face-spec key for the map "you". 1=child / 2=young warrior / 3-6=Grand
// Minister / 7=lay priest, late years.
export const PROTAGONIST_FACE_BY_CH: Record<string, string> = {
  1: 'p-kiyomori@child', 2: 'p-kiyomori@young', 3: 'p-kiyomori@elder', 4: 'p-kiyomori@elder',
  5: 'p-kiyomori@elder', 6: 'p-kiyomori@elder', 7: 'p-kiyomori@old',
};

// ★G Life-stage set pieces. Shown large at the head of a chapter whose face changes from the
// previous one (child → young warrior → Grand Minister → late years).
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }> = {
  'p-kiyomori@child': {
    title: 'きみは <ruby>伊勢平氏<rt>いせへいし</rt></ruby>の 子、<ruby>清盛<rt>きよもり</rt></ruby>',
    caption: 'のちに 武士の 頂に 立つ 男——でも いまは、海で 富を 築く 一族の、ひとりの 子。ここから、きみが この人の 一生を 生きて いく。',
  },
  'p-kiyomori@young': {
    title: '<ruby>清盛<rt>きよもり</rt></ruby>、<ruby>若武者<rt>わかむしゃ</rt></ruby>として 乱を くぐる',
    caption: '<ruby>保元<rt>ほうげん</rt></ruby>・<ruby>平治<rt>へいじ</rt></ruby>の 乱を 勝ちぬき、武門の 第一人者に なった。刀を 手に、都の 争いの まん中に 立つ。',
  },
  'p-kiyomori@elder': {
    title: '<ruby>太政大臣<rt>だいじょうだいじん</rt></ruby>・<ruby>清盛<rt>きよもり</rt></ruby>',
    caption: '武士で はじめて、朝廷の 最高位・太政大臣に のぼった。貴族の 頂に 立ち、海の 道を ひらこうと する。',
  },
  'p-kiyomori@old': {
    title: '<ruby>入道相国<rt>にゅうどうしょうこく</rt></ruby>・晩年の 清盛',
    caption: '出家して なお、権勢の まん中に いる。だが その 体に、熱病の 影が しのびよる——。',
  },
};
