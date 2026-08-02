// Cards (CARDS). 16 people + words. Kinship/years are fixed against research §2/§5; △/☆
// items avoid assertion with "〜とされる／伝えられる" (G5/G6). Hand-managed (kiyomori has no
// legacy extract source). tone uses FACE_TONES (ai/gold/seal/midori/ink) =
// clan=ai / court=gold / Genji=seal / cloister retainers=midori.
import type { Card } from '../../engine/types';
// ★T 本物の写真（PD の複製のみ・data URI 同梱。出どころは photos.ts のヘッダ）。
import { DANNOURA, ITSUKUSHIMA, KIYOMORI } from './photos';

export const CARDS: Record<string, Card> = {
  // ---- People ----
  'p-kiyomori': { type: 'person', ch: 1, tone: 'ai', name: '平清盛', read: 'たいらの きよもり',
    text: 'きみ 自身。伊勢平氏の 棟梁・忠盛の 子。武士で はじめて 太政大臣に のぼり、海の 道（日宋貿易）を ひらいた。世に「おごれる 悪人」と 語りつがれるが——本当に そうだったのか。' , photo: KIYOMORI },
  'p-tadamori': { type: 'person', ch: 1, tone: 'ai', name: '平忠盛', read: 'たいらの ただもり',
    text: '清盛の 父。院に 仕える 近臣として、瀬戸内の 海で 富を 築き、一門 台頭の 土台を つくった。「刀より 船」の 家。' },
  'p-tokiko': { type: 'person', ch: 3, tone: 'ai', name: '平時子（二位尼）', read: 'たいらの ときこ（にいのあま）',
    text: '清盛の 妻。宗盛・知盛・徳子らの 母。平家 滅亡の とき、幼い 安徳天皇を 抱いて 海に 入ったと 伝えられる。' },
  'p-shigemori': { type: 'person', ch: 3, tone: 'ai', name: '平重盛', read: 'たいらの しげもり',
    text: '清盛の 長男（母は 時子とは 別＝異母兄）。父と 後白河院の 対立を 和らげる 調整役。清盛より 早く 病死し、その 死が 対立の 歯止めを 失わせたと される。' },
  'p-tokuko': { type: 'person', ch: 3, tone: 'ai', name: '平徳子（建礼門院）', read: 'たいらの とくこ（けんれいもんいん）',
    text: '清盛の 娘。高倉天皇の 后と なり、皇子（安徳天皇）を 生んで 外戚政策の 要に。滅亡後は 生きのび、我が子と 一門を 弔った。' },
  'p-goshirakawa': { type: 'person', ch: 2, tone: 'gold', name: '後白河院', read: 'ごしらかわ いん',
    text: '清盛の 生涯の 好敵手。位を ゆずった あとも、天皇の 後ろで 国を 動かす 側に 立ちつづけた（院政）。その 34年には、力を にぎった 時期も、うばわれた 時期も あった。はじめは 協調、やがて 対立。頼朝に「日本一の 大天狗」と 評された、したたかな 人。※呼び名は 変わるが、同じ 一人。位に あった ころは 後白河天皇、位を ゆずって からは <ruby>上皇<rt>じょうこう</rt></ruby>、<ruby>髪<rt>かみ</rt></ruby>を おろして からは <ruby>法皇<rt>ほうおう</rt></ruby>——上皇も 法皇も まとめて『院』と 呼ぶので、この 本では ずっと 後白河院。' },
  'p-sutoku': { type: 'person', ch: 2, tone: 'gold', name: '崇徳院', read: 'すとく いん',
    text: 'もと 天皇。保元の乱で 清盛らに 敗れ、讃岐に 流された 院。後白河の 兄。※恨みを 抱いて 死んだという 怨霊の 話は、後の 世が 作った ものと される。' },
  'p-takakura': { type: 'person', ch: 3, tone: 'gold', name: '高倉天皇', read: 'たかくら てんのう',
    text: '徳子を 后に 迎えた 清盛の 娘婿、安徳天皇の 父。温和な 天皇と 伝わるが、21歳で 早世した。' },
  'p-antoku': { type: 'person', ch: 6, tone: 'gold', name: '安徳天皇', read: 'あんとく てんのう',
    text: '清盛の 孫（外孫）。数え3歳で 天皇に。平家 滅亡の とき、数え8歳で 祖母に 抱かれ 海に 入ったと 伝えられる 幼帝。平家の 悲劇の 象徴。' },
  'p-yoshitomo': { type: 'person', ch: 2, tone: 'seal', name: '源義朝', read: 'みなもとの よしとも',
    text: '源氏の 棟梁、頼朝・義経の 父。保元の乱では 清盛と 同じ 側、平治の乱で 清盛に 敗れた 最大の 武の 宿敵。敗走の 末に 討たれた。' },
  'p-yoritomo': { type: 'person', ch: 2, tone: 'seal', name: '源頼朝', read: 'みなもとの よりとも',
    text: '義朝の 子。平治の乱の あと、本来なら 死罪の ところを、清盛の 継母の 願いで 伊豆へ 流されて 生きのびた。のちに 平家を 滅ぼす 側の 総大将に。' },
  'p-shunkan': { type: 'person', ch: 5, tone: 'midori', name: '俊寛', read: 'しゅんかん',
    text: '鹿ヶ谷の 陰謀に 加わり、鬼界ヶ島へ 流された 僧。共に 流された 者が 赦されても、一人だけ 赦されず 島で 死んだと 伝わる＝孤独の 象徴。' },
  'p-mochihito': { type: 'person', ch: 6, tone: 'gold', name: '以仁王', read: 'もちひとおう',
    text: '後白河の 皇子。清盛の 専横に 反発し、諸国の 源氏に 平家追討の 令旨を 出して 挙兵。源平の 争乱の 口火を 切った。' },
  'p-tomomori': { type: 'person', ch: 7, tone: 'ai', name: '平知盛', read: 'たいらの とももり',
    text: '清盛の 子で 一門 随一の 武将。壇ノ浦で 水軍を 率いた。「見るべき ほどの ことは 見た」と 言い残して 最期を とげたと 伝わる。' },
  'p-yoshitsune': { type: 'person', ch: 7, tone: 'seal', name: '源義経', read: 'みなもとの よしつね',
    text: '頼朝の 弟。清盛の 死後に 活躍し、壇ノ浦（1185）で 平家を 滅ぼした。軍記や 伝説で 人気の、悲劇の 英雄。' },

  // ---- Words ----
  'w-nissou': { type: 'word', ch: 4, name: '日宋貿易', read: 'にっそう ぼうえき',
    text: '日本と 宋（中国）を むすぶ 交易。清盛が 一から 始めたわけでは ないが、港を 修築し 宋船を 畿内まで 引き入れて 本格化させたと される。宋銭・焼き物・書物が 流れこんだ。' },
  'w-owada': { type: 'word', ch: 4, name: '大輪田泊', read: 'おおわだの とまり',
    text: '清盛が 私財を 投じて 修築した 港。今の 神戸港の 前身で、日宋貿易の 国内拠点。「海の 道」の 起点。' },
  'w-itsukushima': { type: 'word', ch: 4, name: '厳島神社', read: 'いつくしま じんじゃ',
    text: '海の 上に 建つ 社殿。安芸守だった 清盛が 篤く 信仰し、今の 姿に 造営したと される。平家の 氏神＝海の 政権の しるし。' , photo: ITSUKUSHIMA },
  'w-daijodaijin': { type: 'word', ch: 3, name: '武士初の太政大臣', read: 'ぶしはつの だいじょうだいじん',
    text: '1167年、清盛は 武士として はじめて 朝廷の 最高位・太政大臣に のぼった（約3か月で 辞任）。武士が 貴族の てっぺんに 立った 前代未聞の 出来事。' },
  'w-shishigatani': { type: 'word', ch: 5, name: '鹿ヶ谷の陰謀', read: 'ししがたにの いんぼう',
    text: '1177年、後白河院の 近臣らが 京の 鹿ヶ谷（東山の 山ぶところ）で 練ったと される 反平氏の 謀議。多田行綱の 密告で 露見し、関係者は 罰せられ、遠くの 島などへ 流された。ただし 陰謀が 本当に あったのかは 諸説 ある。' },
  'w-jisho': { type: 'word', ch: 5, name: '治承三年の政変', read: 'じしょう さんねんの せいへん',
    text: '1179年、清盛が 兵を 率いて 京を おさえ、反平氏の 貴族の 官職を 奪い、後白河院を 鳥羽殿に 幽閉して 院政を 止めた クーデタ。平家の 独裁が 頂点に 達した 出来事。' },
  'w-heike': { type: 'word', ch: 5, name: '平家物語', read: 'へいけ ものがたり',
    text: '平家が 滅んだ あとに 作られた 語り物。琵琶法師が 節を つけて 語った。「おごれる 者も 久しからず」——清盛を 悪役に 描く この 物語が、悪人像の 大もと。' },
  'w-fukuhara': { type: 'word', ch: 6, name: '福原遷都', read: 'ふくはら せんと',
    text: '1180年、清盛が 都を 京から 海の そば・福原へ 移そうとした こと。だが 半年ほどで 京へ 戻った。暴挙とも、早すぎた 挑戦とも 言われ、評価は 割れている。' },
  'w-dannoura': { type: 'word', ch: 7, name: '壇ノ浦', read: 'だんのうら',
    text: '関門海峡。1185年、清盛の 死の 4年後、ここで 平家は 滅んだ。「海に 始まり 海に 終わる」平家の 終着点。' , photo: DANNOURA },
};
