// 似顔絵スペック（FACE_SPEC）。
// もとは legacy/index.html からの逐語抽出だったが、「人物像を子どもに刷り込む」ため
// 一人ひとりが一目で見分けられる学習まんが・アニメ調の似顔絵へ手書きで作り直した
//（もはや抽出せず手書き管理）。
// 生成器は src/engine/art/face.ts（shape/ears/cheek/brow/eye/mouth/iris/age を解釈）。
/* eslint-disable */

import type { FaceSpec } from '../../engine/types';

export const FACE_SPEC: Record<string, FaceSpec>={
  // きみ＝秀長。烏帽子・やさしい丸みのある顔・柔らかな微笑み（温厚で公正な補佐役）。
  // カード図鑑・タイトルの代表の顔（据え置き）。地図の"きみ"は下の @ 派生で加齢する。
  // Signature morph (face-engine slice 3): mouthScale 1.08 on every life stage — the wide,
  // warm smile of the brother everyone could talk to. Also breaks the distance-2 band with
  // kiyomori's Tokiko/Shigemori and the cross-work child cluster (face-audit 2026-07-18).
  // Slice 9 (default-bias redistribution): nose 'round' on every life stage — the soft dango
  // nose the mother p-naka wears too, the family face of the farmer's sons.
  'p-hidenaga': {tone:'ai',    head:'eboshi',    hair:'dark', shape:'oval',   brow:'soft',    eye:'gentle', mouth:'smile', beard:'none', nose:'round', morph:{mouthScale:1.08}},
  // ★A 秀長を"加齢"させる派生スペック（地図の"きみ"だけ章別に差し替え。PROTAGONIST_FACE_BY_CH 参照）。
  // 温厚さ（tone:ai・やさしい目もと）を保ったまま、髪型・輪郭・白髪・しわで一生を見せる。
  //  ①小竹＝前髪の子ども（第1章）。まるい顔・明るい肌・大きな瞳・頬の赤み。
  'p-hidenaga@child':{tone:'ai', head:'maegami',  hair:'dark', shape:'round',  brow:'soft',    eye:'gentle', mouth:'smile', beard:'none', skin:'#f6d3ab', cheek:'blush', age:'child', nose:'round', morph:{mouthScale:1.08}},
  //  ②若武者（第2〜4章）。前髪立ちの青年。
  'p-hidenaga@young':{tone:'ai', head:'wakamusha',hair:'dark', shape:'oval',   brow:'soft',    eye:'gentle', mouth:'smile', beard:'none', nose:'round', morph:{mouthScale:1.08}},
  //  ③大和大納言（第5〜6章）。烏帽子・口ひげ・落ち着いた貫禄。
  'p-hidenaga@elder':{tone:'ai', head:'eboshi',   hair:'dark', shape:'oval',   brow:'calm',    eye:'calm',   mouth:'soft',  beard:'mustache', nose:'round', morph:{mouthScale:1.08}},
  //  ④晩年・病床（終章）。白髪・こけた頬・閉じた目・やつれのしわ。
  'p-hidenaga@old':  {tone:'ai', head:'eboshi',   hair:'grey', shape:'gaunt',  cheek:'sunken', brow:'soft',  eye:'closed', mouth:'soft',  beard:'none', skin:'#e9cba8', age:'old', nose:'round', morph:{mouthScale:1.08}},
  // 秀吉＝「猿」。丸く小さい顔・大きな耳・笑いじわ・大口の笑い・日焼け肌。一目で分かる人たらし。
  // nose 'wide' (slice 9) = the broad flat nose of the 猿 caricature the whole face is built on
  // — and the split from his brother's round family nose. Mirrored in ieyasu (same person).
  'p-hideyoshi':{tone:'gold',  head:'kanmuri',   hair:'dark', shape:'round',  ears:'big', cheek:'monkey', brow:'calm', eye:'lively', mouth:'laugh', beard:'mustache', skin:'#d99a5f', nose:'wide'},
  // なか＝母。丸くやさしい老女・白髪・柔らかな笑み・頬の赤み。
  'p-naka':     {tone:'midori',head:'onna',      hair:'white',shape:'round',  brow:'soft',    eye:'gentle', mouth:'soft',  beard:'none', skin:'#eabf98', cheek:'blush', garb:'kosode', browWeight:'fine', nose:'round'},
  // 信長＝冷徹な革命児。面長・茶筅髷・つり上がった眉・細く鋭い眼光・青白い肌・冷たい暗紫の瞳。
  // nose 'tall' (slice 9) = the long straight bridge the 長興寺本 portrait shows. Mirrored in ieyasu.
  'p-nobunaga': {tone:'seal',  head:'chasen',    hair:'dark', shape:'long',   brow:'angry',   eye:'narrow', mouth:'flat',  beard:'mustache', skin:'#f2dcc6', iris:'#43304a', nose:'tall'},
  // 高虎＝築城の名人・巨漢の武人。四角い顔・藍の兜・どっしり落ち着き・黒髭。
  // nose 'tall' + lowered eyes = the towering build the record claims (six shaku two sun);
  // face-audit 2026-07-17: was pixel-identical to kiyomori/p-tomomori before slice 2.
  // beard:full = the big, burly castle-builder — a high-salience split from the crowded
  // kabuto/square/stern warrior archetype (kiyomori/p-tomomori, ieyasu/p-hanzo both wear plain
  // beard) so this once-pixel-identical pair reads apart at 52px, not by morph alone.
  'p-takatora': {tone:'ai',    head:'kabuto',    hair:'dark', shape:'square', brow:'stern',   eye:'calm',   mouth:'flat',  beard:'full',  nose:'tall', morph:{eyeY:1}},
  // 元親＝四国の猛将「鬼若子」。面長・険しい眉・鋭い目・への字・ふさふさ髭。
  'p-motochika':{tone:'ink',   head:'eboshi',    hair:'dark', shape:'long',   brow:'angry',   eye:'sharp',  mouth:'frown', beard:'full', nose:'tall'},
  // 義久＝島津当主。敗れて剃髪・四角い顔・灰髭・閉じた目の諦観。
  // mouth 'soft' (slice 9) = the faint accepting mouth that makes the closed eyes read as
  // 諦観 rather than as a blank; nose 'wide' = the solid Kyushu lord.
  'p-yoshihisa':{tone:'ink',   head:'bozu',      hair:'grey', shape:'square', brow:'calm',    eye:'closed', mouth:'soft',  beard:'full', skin:'#e6c49b', nose:'wide'},
  // 利休＝枯淡の茶人。こけた頬・頭巾・閉じた目・細い灰髭・静かな微笑。
  'p-rikyu':    {tone:'midori',head:'zukin',     hair:'grey', shape:'gaunt',  cheek:'sunken', brow:'soft', eye:'closed', mouth:'soft', beard:'beard', nose:'thin'},
  // 宗麟＝剃髪した僧形の大名。丸顔・温和・細い灰の口ひげ。
  // Requirement-2 audit (2026-07-23): the only surviving portrait — 大徳寺瑞峰院蔵, inscribed
  // 天正15年(1587) = contemporaneous with this work's chapter 6 — shows a shaven head, black
  // robe and a *thin moustache*; every public statue in Oita repeats the shaven head. The old
  // `head:'nanban'` (southern-barbarian hat) had no pictorial source: he took the tonsure in
  // 1562, sixteen years before his baptism. His Christianity lives in the text, not the hat.
  'p-sorin':    {tone:'gold',  head:'bozu',      hair:'grey', shape:'round',  brow:'calm',    eye:'calm',   mouth:'soft',  beard:'mustache', nose:'round'},
  // 秀次＝悲劇の若き後継。若武者・すべすべの若顔・不安げな眉。
  // browY -1 = brows held high, the ever-anxious heir (slice 3; was distance 2 from ieyasu/p-yodo).
  // eye 'narrow' = 脇に追われた警戒的な後継者の細めた目。yodo(ieyasu・女)との知覚距離を 2.0→3.0 に（slice 7）。
  // mouth 'frown' + nose 'thin' (slice 9) = the cornered heir's pinched mouth and unhardened face.
  'p-hidetsugu':{tone:'seal',  head:'wakamusha', hair:'dark', shape:'oval',   brow:'worried', eye:'narrow', mouth:'frown', beard:'none', skin:'#f2dcc6', nose:'thin', morph:{browY:-1}},
  // 光秀＝理知的で冷たい謀反人。面長・水平の眉（理知）・細い眼光・整った髭・青灰の瞳。
  // mouth 'frown' + nose 'tall' (slice 9) = the swallowed resentment under the intellect, on a
  // cold aquiline face (the tall nose also keeps him off ieyasu's Mitsunari, the other 実務家 frown).
  'p-mitsuhide':{tone:'ink',   head:'eboshi',    hair:'dark', shape:'long',   brow:'stern',   eye:'narrow', mouth:'frown', beard:'beard', skin:'#f2dcc6', iris:'#37465a', nose:'tall'},
  // 勝家＝猛将「鬼柴田」。四角い顔・赤い兜・つり上がった眉・鋭い目・白髭・への字。
  // age old = 織田最古参の老将の刻まれた顔（slice 8: 同じ猛将アーキタイプの義朝 kiyomori/p-yoshitomo〔白髪でなく黒髪〕から
  // 知覚 2.3→2.9 に離す。白髪＋老いの皺で「鬼柴田」の年輪を出す＝史実に沿う）。
  'p-katsuie':  {tone:'seal',  head:'kabuto',    hair:'grey', shape:'square', brow:'angry',   eye:'sharp',  mouth:'frown', beard:'full', iris:'#3a2417', age:'old', nose:'round'},
  // ★B 山場の"感情"派生（特定シーンだけ差し替え。SCENE_FACE_OVERRIDES 参照）。
  //  本能寺で号泣・うろたえる秀吉（人たらしの兄が取り乱す）。猿相はそのままに、眉=worried・涙・への字。
  'p-hideyoshi@grief':{tone:'gold', head:'kanmuri', hair:'dark', shape:'round', ears:'big', cheek:'monkey', brow:'worried', eye:'cry', mouth:'frown', beard:'mustache', skin:'#d99a5f', nose:'wide'},
  //  第1章の秀吉＝針売りあがりの若き藤吉郎。冠もひげもまだ無い（兄も"育つ"ことを見せる）。
  'p-hideyoshi@young':{tone:'gold', head:'wakamusha', hair:'dark', shape:'round', ears:'big', cheek:'monkey', brow:'calm', eye:'lively', mouth:'laugh', beard:'none', skin:'#d99a5f', nose:'wide'},
  //  討たれる信長（見開いた目の衝撃）。冷徹な面長はそのまま、眉=worried・目=wide・への字。
  'p-nobunaga@fall':  {tone:'seal', head:'chasen',  hair:'dark', shape:'long',  brow:'worried', eye:'wide',  mouth:'frown', beard:'mustache', skin:'#f2dcc6', iris:'#43304a', nose:'tall'},
  '_default':   {tone:'ai',    head:'eboshi',    hair:'dark', shape:'oval',   brow:'calm',    eye:'calm',   mouth:'flat',  beard:'none'}
};

// ★A 章番号 → 地図の"きみ"の顔スペックキー。第1章=子ども / 2-4章=若武者 / 5-6章=大納言 / 終章=晩年。
// 名前・カードは常に p-hidenaga のまま、見た目だけを差し替える（Work.protagonistFacesByChapter）。
export const PROTAGONIST_FACE_BY_CH: Record<string, string>={
  1:'p-hidenaga@child', 2:'p-hidenaga@young', 3:'p-hidenaga@young', 4:'p-hidenaga@young',
  5:'p-hidenaga@elder', 6:'p-hidenaga@elder', 7:'p-hidenaga@old'
};

// ★G 人生ステージの見せ場。顔スペックキー → その姿になった瞬間の見出し・ひとこと。
// PROTAGONIST_FACE_BY_CH の顔が前章から変わる章（=子ども/若武者/大納言/晩年）の冒頭で、
// 地図の小さな加齢に頼らず大きく1枚見せる（Work.protagonistStages）。
// 第1章＝子どもは「きみ＝この子」の宣言＝なりきりの初期化として最初に見せる。
export const PROTAGONIST_STAGES: Record<string, { title: string; caption: string }>={
  'p-hidenaga@child': {
    title: 'きみは <ruby>尾張<rt>おわり</rt></ruby>の 村の 子、<ruby>小竹<rt>こちく</rt></ruby>',
    caption: 'のちの <ruby>豊臣秀長<rt>とよとみひでなが</rt></ruby>——でも いまは、田んぼしか 知らない 百姓の 子。ここから、きみが この子の 一生を 生きて いく。',
  },
  'p-hidenaga@young': {
    title: '<ruby>小竹<rt>こちく</rt></ruby>、<ruby>若武者<rt>わかむしゃ</rt></ruby>に なる',
    caption: '田んぼしか 知らなかった 村の 子が、刀を 差す <ruby>若武者<rt>わかむしゃ</rt></ruby>に 育った。兄・<ruby>藤吉郎<rt>とうきちろう</rt></ruby>の 右うでだ。',
  },
  'p-hidenaga@elder': {
    title: '<ruby>総大将<rt>そうだいしょう</rt></ruby>・<ruby>秀長<rt>ひでなが</rt></ruby>',
    caption: '「<ruby>長秀<rt>ながひで</rt></ruby>」から「<ruby>秀長<rt>ひでなが</rt></ruby>」へ。兄に かわり 大軍を ひきいる、<ruby>貫禄<rt>かんろく</rt></ruby>の 武将に なった。',
  },
  'p-hidenaga@old': {
    title: '<ruby>晩年<rt>ばんねん</rt></ruby>の <ruby>秀長<rt>ひでなが</rt></ruby>',
    caption: '天下統一の その年、体に 病の 影が しのびよる。まだ、やり残した ことが たくさん あるのに——。',
  },
};

// ★B シーン → 人物 → 顔スペックキー。感情の山場だけ地図の顔を差し替える（Work.sceneFaceOverrides）。
// 名前・カードは元の pid のまま、見た目だけを上書きする。
// - 第1章（1-b/1-d）：まだ冠もひげも無い若き藤吉郎（兄も"育つ"ことを見せる）。
// - 本能寺（4-a）：主君の横死に号泣する兄・秀吉／討たれ動揺する信長で、この一場の"山"を立てる。
// - 兄の見舞い（7-a2）：弟の死の床で涙ぐむ兄（物語の感情のクライマックス）。
export const SCENE_FACE_OVERRIDES: Record<string, Record<string, string>>={
  '1-b':{ 'p-hideyoshi':'p-hideyoshi@young' },
  '1-d':{ 'p-hideyoshi':'p-hideyoshi@young' },
  '4-a':{ 'p-hideyoshi':'p-hideyoshi@grief', 'p-nobunaga':'p-nobunaga@fall' },
  '7-a2':{ 'p-hideyoshi':'p-hideyoshi@grief' }
};
