// カード（CARDS）。もとは legacy/index.html からの逐語抽出だったが、抽出パイプライン
// （旧 scripts/extract-data.mjs）を廃し、faces/map/story と同じく手書き管理へ移行した。
/* eslint-disable */

import type { Card } from '../../engine/types';
// ★T 本物の写真（PD の複製のみ・data URI 同梱。出どころは photos.ts のヘッダ）。
import { HIDENAGA, HIDEYOSHI, RIKYU } from './photos';

export const CARDS: Record<string, Card> = {
  // 人物
  'p-hideyoshi':{ type:'person', ch:1, tone:'gold', name:'羽柴秀吉', read:'はしば ひでよし',
    text:'<ruby>秀長<rt>ひでなが</rt></ruby>の 兄。<ruby>針<rt>はり</rt></ruby>売りから 身を おこし、ついには <ruby>天下<rt>てんか</rt></ruby>を とった。明るく 人たらしで、大きな 夢を 語る。弟に「<ruby>侍<rt>さむらい</rt></ruby>に なれ」と 声を かけた <ruby>張本人<rt>ちょうほんにん</rt></ruby>。' , photo: HIDEYOSHI },
  'p-naka':{ type:'person', ch:1, tone:'midori', name:'なか（大政所）', read:'—— おおまんどころ',
    text:'<ruby>秀吉<rt>ひでよし</rt></ruby>と <ruby>秀長<rt>ひでなが</rt></ruby>の 母。<ruby>尾張中村<rt>おわりなかむら</rt></ruby>の ひと。<ruby>息子<rt>むすこ</rt></ruby>ふたりが 天下を とるとは、この ころ <ruby>誰<rt>だれ</rt></ruby>が 思っただろう。' },
  'p-nobunaga':{ type:'person', ch:2, tone:'seal', name:'織田信長', read:'おだ のぶなが',
    text:'<ruby>秀吉<rt>ひでよし</rt></ruby>が 仕えた あるじ。「<ruby>天下布武<rt>てんかふぶ</rt></ruby>」を かかげ、古い しきたりを 次々に こわした <ruby>革命児<rt>かくめいじ</rt></ruby>。<ruby>秀長<rt>ひでなが</rt></ruby>の <ruby>諱<rt>いみな</rt></ruby>「<ruby>長秀<rt>ながひで</rt></ruby>」の「長」は、信長から もらった 一字とも いわれる。' },
  'p-takatora':{ type:'person', ch:3, tone:'ai', name:'藤堂高虎', read:'とうどう たかとら',
    text:'<ruby>秀長<rt>ひでなが</rt></ruby>に 仕えた <ruby>名臣<rt>めいしん</rt></ruby>。のちに <ruby>築城<rt>ちくじょう</rt></ruby>の 名人として 知られる。秀長の <ruby>家中<rt>かちゅう</rt></ruby>で 力を つけ、その 死後は 各地を わたり歩いた。' },
  'p-motochika':{ type:'person', ch:5, tone:'ink', name:'長宗我部元親', read:'ちょうそかべ もとちか',
    text:'四国を ほぼ 統一した <ruby>猛将<rt>もうしょう</rt></ruby>。<ruby>秀長<rt>ひでなが</rt></ruby>らの 大軍に <ruby>攻<rt>せ</rt></ruby>められ <ruby>降伏<rt>こうふく</rt></ruby>。<ruby>土佐<rt>とさ</rt></ruby>一国を <ruby>安堵<rt>あんど</rt></ruby>された。' },
  'p-yoshihisa':{ type:'person', ch:5, tone:'ink', name:'島津義久', read:'しまづ よしひさ',
    text:'九州の 大半を のみこんだ <ruby>島津家<rt>しまづけ</rt></ruby>の 当主。<ruby>根白坂<rt>ねじろざか</rt></ruby>の 敗北ののち、<ruby>秀吉<rt>ひでよし</rt></ruby>に <ruby>降伏<rt>こうふく</rt></ruby>。<ruby>剃髪<rt>ていはつ</rt></ruby>して <ruby>龍伯<rt>りゅうはく</rt></ruby>と <ruby>号<rt>ごう</rt></ruby>した。' },
  'p-rikyu':{ type:'person', ch:6, tone:'midori', name:'千利休（宗易）', read:'せんの りきゅう（そうえき）',
    text:'茶の湯を 大成した 天下一の 茶人。<ruby>秀吉<rt>ひでよし</rt></ruby>の そば近くで 「<ruby>内々<rt>ないない</rt></ruby>の<ruby>儀<rt>ぎ</rt></ruby>（非公式のこと）」を とりしきった。<ruby>秀長<rt>ひでなが</rt></ruby>の 死の 直後、秀吉に <ruby>切腹<rt>せっぷく</rt></ruby>を 命じられる。' , photo: RIKYU },
  'p-sorin':{ type:'person', ch:6, tone:'gold', name:'大友宗麟', read:'おおとも そうりん',
    text:'<ruby>豊後<rt>ぶんご</rt></ruby>（大分）の <ruby>大名<rt>だいみょう</rt></ruby>。<ruby>島津<rt>しまづ</rt></ruby>に <ruby>押<rt>お</rt></ruby>されて <ruby>秀吉<rt>ひでよし</rt></ruby>を たより、<ruby>大坂城<rt>おおさかじょう</rt></ruby>を <ruby>訪<rt>おとず</rt></ruby>れた。その とき 会った <ruby>秀長<rt>ひでなが</rt></ruby>の ことばを、<ruby>国<rt>くに</rt></ruby>もとへ 書き送って いる。' },
  'p-hidetsugu':{ type:'person', ch:7, tone:'seal', name:'豊臣秀次', read:'とよとみ ひでつぐ',
    text:'<ruby>秀吉<rt>ひでよし</rt></ruby>の <ruby>甥<rt>おい</rt></ruby>で 後<ruby>継<rt>つ</rt></ruby>ぎ。<ruby>関白<rt>かんぱく</rt></ruby>の 座を つがされたが、秀吉に 実子・<ruby>秀頼<rt>ひでより</rt></ruby>が 生まれると 立場が 暗転。<ruby>秀長<rt>ひでなが</rt></ruby>の 死から 4年後、<ruby>切腹<rt>せっぷく</rt></ruby>を 命じられた。' },
  'p-hidenaga':{ type:'person', ch:7, tone:'ai', name:'豊臣秀長', read:'とよとみ ひでなが',
    text:'きみ 自身。<ruby>大和大納言<rt>やまとだいなごん</rt></ruby>・100<ruby>万石<rt>まんごく</rt></ruby>。兄を <ruby>生涯<rt>しょうがい</rt></ruby> 支えつづけ、<ruby>豊臣政権<rt>とよとみせいけん</rt></ruby>の かなめを 静かに <ruby>担<rt>にな</rt></ruby>った。<ruby>天正<rt>てんしょう</rt></ruby>19年（1591年）、兄より 先に 世を 去る。' , photo: HIDENAGA },
  // ことば
  'w-ichiya':{ type:'word', ch:2, name:'墨俣一夜城', read:'すのまた いちやじょう',
    text:'「一夜で 城を <ruby>築<rt>きず</rt></ruby>いた」と 語りつがれる 話。じつは <ruby>当時<rt>とうじ</rt></ruby>の 記録には 出て こず、後の 世の 物語かも しれない——それでも、<ruby>段<rt>だん</rt></ruby><ruby>取<rt>ど</rt></ruby>りと <ruby>裏方<rt>うらかた</rt></ruby>の 力を <ruby>象徴<rt>しょうちょう</rt></ruby>する 名場面として 語りつがれる。' },
  'w-jodai':{ type:'word', ch:3, name:'城代', read:'じょうだい',
    text:'城主に かわって 城を あずかり、まわりの 土地を 治める 役。<ruby>秀長<rt>ひでなが</rt></ruby>は <ruby>竹田城<rt>たけだじょう</rt></ruby>の 城代となり、<ruby>街道<rt>かいどう</rt></ruby>と <ruby>銀山<rt>ぎんざん</rt></ruby>を まもった。「治める 力」の 第一歩。' },
  'w-ikuno':{ type:'word', ch:3, name:'生野銀山', read:'いくの ぎんざん',
    text:'<ruby>但馬<rt>たじま</rt></ruby>に あった 大きな <ruby>銀山<rt>ぎんざん</rt></ruby>。銀は 戦国の 世の「力の もと」。<ruby>秀長<rt>ひでなが</rt></ruby>は この 銀山を おさえる 要所を まかされた。' },
  'w-ogaeshi':{ type:'word', ch:4, name:'中国大返し', read:'ちゅうごく おおがえし',
    text:'<ruby>本能寺<rt>ほんのうじ</rt></ruby>の変を 知った <ruby>秀吉軍<rt>ひでよしぐん</rt></ruby>が、<ruby>備中高松<rt>びっちゅうたかまつ</rt></ruby>から <ruby>山崎<rt>やまざき</rt></ruby>まで およそ 230km を <ruby>猛<rt>もう</rt></ruby>スピードで 引き返した 大移動。これを 支えたのは、道・食料・兵の <ruby>段<rt>だん</rt></ruby><ruby>取<rt>ど</rt></ruby>り——まさに <ruby>裏方<rt>うらかた</rt></ruby>の 力。' },
  'w-nejiro':{ type:'word', ch:5, name:'根白坂の戦い', read:'ねじろざか の たたかい',
    text:'九州<ruby>征伐<rt>せいばつ</rt></ruby>の <ruby>天王山<rt>てんのうざん</rt></ruby>。<ruby>秀長<rt>ひでなが</rt></ruby>が <ruby>総大将<rt>そうだいしょう</rt></ruby>として <ruby>島津<rt>しまづ</rt></ruby>の 大軍を 打ち破り、九州<ruby>平定<rt>へいてい</rt></ruby>を 決定づけた 戦い。兄の いない 戦場で、弟が 大将を つとめた。' },
  'w-uchiuchi':{ type:'word', ch:6, name:'内々の儀は宗易に、公儀の事は宰相に', read:'ないないのぎは そうえきに、こうぎのことは さいしょうに',
    text:'<ruby>秀長<rt>ひでなが</rt></ruby>が <ruby>大友<rt>おおとも</rt></ruby><ruby>宗麟<rt>そうりん</rt></ruby>に かけたと される 言葉。「非公式な ことは <ruby>利休<rt>りきゅう</rt></ruby>（<ruby>宗易<rt>そうえき</rt></ruby>）に、おおやけの 政治は この 私（<ruby>宰相<rt>さいしょう</rt></ruby>＝秀長）に 相談を」。<ruby>豊臣政権<rt>とよとみせいけん</rt></ruby>を 静かに 回していた 秀長の 役割を、いちばん よく あらわす 一句。' },
};
