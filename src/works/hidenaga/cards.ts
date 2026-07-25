// カード（CARDS）。もとは legacy/index.html からの逐語抽出だったが、抽出パイプライン
// （旧 scripts/extract-data.mjs）を廃し、faces/map/story と同じく手書き管理へ移行した。
/* eslint-disable */

import type { Card } from '../../engine/types';
// ★T 本物の写真（PD の複製のみ・data URI 同梱。出どころは photos.ts のヘッダ）。
import { HIDENAGA, HIDEYOSHI, RIKYU } from './photos';

export const CARDS: Record<string, Card> = {
  // 人物
  'p-hideyoshi':{ type:'person', ch:1, tone:'gold', name:'羽柴秀吉', read:'はしば ひでよし',
    text:'秀長の 兄。針売りから 身を おこし、ついには 天下人に。明るく 人たらしで、大きな 夢を 語る。弟に「侍に なれ」と 声を かけた 張本人。' , photo: HIDEYOSHI },
  'p-naka':{ type:'person', ch:1, tone:'midori', name:'なか（大政所）', read:'—— おおまんどころ',
    text:'秀吉と 秀長の 母。尾張中村の ひと。息子ふたりが 天下を とるとは、この ころ 誰が 思っただろう。' },
  'p-nobunaga':{ type:'person', ch:2, tone:'seal', name:'織田信長', read:'おだ のぶなが',
    text:'秀吉が 仕えた 主君。「天下布武」を かかげ、古い しきたりを 次々に こわした 革命児。秀長の 諱「長秀」の「長」は、信長から もらった 一字とも いわれる。' },
  'p-takatora':{ type:'person', ch:3, tone:'ai', name:'藤堂高虎', read:'とうどう たかとら',
    text:'秀長に 仕えた 名臣。のちに 築城の 名人として 知られる。秀長の 家中で 力を つけ、その 死後は 各地を わたり歩いた。' },
  'p-motochika':{ type:'person', ch:5, tone:'ink', name:'長宗我部元親', read:'ちょうそかべ もとちか',
    text:'四国を ほぼ 統一した 猛将。秀長らの 大軍に 攻められ 降伏。土佐一国を 安堵された。' },
  'p-yoshihisa':{ type:'person', ch:5, tone:'ink', name:'島津義久', read:'しまづ よしひさ',
    text:'九州の 大半を のみこんだ 島津家の 当主。根白坂の 敗北ののち、秀吉に 降伏。剃髪して 龍伯と 号した。' },
  'p-rikyu':{ type:'person', ch:6, tone:'midori', name:'千利休（宗易）', read:'せんの りきゅう（そうえき）',
    text:'茶の湯を 大成した 天下一の 茶人。秀吉の そば近くで 「内々の儀（非公式のこと）」を とりしきった。秀長の 死の 直後、秀吉に 切腹を 命じられる。' , photo: RIKYU },
  'p-sorin':{ type:'person', ch:6, tone:'gold', name:'大友宗麟', read:'おおとも そうりん',
    text:'豊後（大分）の 大名。島津に 押されて 秀吉を たより、大坂城を 訪れた。その とき 秀長から 有名な 言葉を かけられた。' },
  'p-hidetsugu':{ type:'person', ch:7, tone:'seal', name:'豊臣秀次', read:'とよとみ ひでつぐ',
    text:'秀吉の 甥で 後継ぎ。関白の 座を つがされたが、秀吉に 実子・秀頼が 生まれると 立場が 暗転。秀長の 死から 4年後、切腹を 命じられた。' },
  'p-hidenaga':{ type:'person', ch:7, tone:'ai', name:'豊臣秀長', read:'とよとみ ひでなが',
    text:'きみ 自身。大和大納言・100万石。兄を 生涯 支えつづけ、豊臣政権の かなめを 静かに 担った。天正19年（1591年）、兄より 先に 世を 去る。' , photo: HIDENAGA },
  // ことば
  'w-ichiya':{ type:'word', ch:2, name:'墨俣一夜城', read:'すのまた いちやじょう',
    text:'「一夜で 城を 築いた」という 有名な 伝説。じつは 確かな 記録が なく、後の 世の 物語かも しれない——それでも、段取りと 裏方の 力を 象徴する 名場面として 語りつがれる。' },
  'w-jodai':{ type:'word', ch:3, name:'城代', read:'じょうだい',
    text:'城主に かわって 城を あずかり、まわりの 土地を 治める 役。秀長は 竹田城の 城代となり、街道と 銀山を まもった。「治める 力」の 第一歩。' },
  'w-ikuno':{ type:'word', ch:3, name:'生野銀山', read:'いくの ぎんざん',
    text:'但馬に あった 大きな 銀山。銀は 戦国の 世の「力の もと」。秀長は この 銀山を おさえる 要所を まかされた。' },
  'w-ogaeshi':{ type:'word', ch:4, name:'中国大返し', read:'ちゅうごく おおがえし',
    text:'本能寺の変を 知った 秀吉軍が、備中高松から 山崎まで およそ 230km を 猛スピードで 引き返した 大移動。これを 支えたのは、道・食料・兵の 段取り——まさに 裏方の 力。' },
  'w-nejiro':{ type:'word', ch:5, name:'根白坂の戦い', read:'ねじろざか の たたかい',
    text:'九州征伐の 天王山。秀長が 総大将として 島津の 大軍を 打ち破り、九州平定を 決定づけた 戦い。兄の いない 戦場で、弟が 大将を つとめた。' },
  'w-uchiuchi':{ type:'word', ch:6, name:'内々の儀は宗易に、公儀の事は宰相に', read:'うちうちのぎは そうえきに、こうぎのことは さいしょうに',
    text:'秀長が 大友宗麟に かけたと される 言葉。「非公式な ことは 利休（宗易）に、おおやけの 政治は この 私（宰相＝秀長）に 相談を」。豊臣政権を 静かに 回していた 秀長の 役割を、いちばん よく あらわす 一句。' },
};
