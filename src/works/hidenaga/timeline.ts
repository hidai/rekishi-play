// 年表（TIMELINE）。もとは legacy/index.html からの逐語抽出だったが、抽出パイプライン
// （旧 scripts/extract-data.mjs）を廃し、faces/map/story と同じく手書き管理へ移行した。
/* eslint-disable */

import type { TimelineEntry } from '../../engine/types';

export const TIMELINE: TimelineEntry[] = [
  { y:'1540?', ch:1, key:true,  t:'<ruby>秀長<rt>ひでなが</rt></ruby> 生まれる', d:'<ruby>尾張中村<rt>おわりなかむら</rt></ruby>。<ruby>生年<rt>せいねん</rt></ruby>は <ruby>諸説<rt>しょせつ</rt></ruby>あり（1540年 有力）。' },
  { y:'1561?', ch:1,            t:'兄に <ruby>誘<rt>さそ</rt></ruby>われ <ruby>侍<rt>さむらい</rt></ruby>に', d:'<ruby>百姓<rt>ひゃくしょう</rt></ruby>から 侍へ。<ruby>木下小一郎<rt>きのしたこいちろう</rt></ruby>と 名のる。' },
  { y:'1566?', ch:2,            t:'<ruby>墨俣<rt>すのまた</rt></ruby> の 伝説', d:'<ruby>一夜城<rt>いちやじょう</rt></ruby>の <ruby>逸話<rt>いつわ</rt></ruby>。史実性は あやしいが、<ruby>裏方<rt>うらかた</rt></ruby>の 力の <ruby>象徴<rt>しょうちょう</rt></ruby>。' },
  { y:'1577', ch:3, key:true,  t:'<ruby>但馬<rt>たじま</rt></ruby>へ <ruby>侵攻<rt>しんこう</rt></ruby>', d:'<ruby>竹田城<rt>たけだじょう</rt></ruby>を おさえ、<ruby>城代<rt>じょうだい</rt></ruby>に。<ruby>生野銀山<rt>いくのぎんざん</rt></ruby>を まもる。' },
  { y:'1580', ch:3,            t:'<ruby>但馬<rt>たじま</rt></ruby> <ruby>平定<rt>へいてい</rt></ruby>', d:'<ruby>出石<rt>いずし</rt></ruby>（<ruby>有子山城<rt>ありこやまじょう</rt></ruby>）の 門が ひらく。はじめて まとまった 土地を 治める。' },
  { y:'1582', ch:4, key:true,  t:'<ruby>本能寺<rt>ほんのうじ</rt></ruby>の変／中国大<ruby>返<rt>がえ</rt></ruby>し', d:'兄を 支え、<ruby>驚異<rt>きょうい</rt></ruby>の 大移動で <ruby>山崎<rt>やまざき</rt></ruby>へ。' },
  { y:'1583', ch:4,            t:'<ruby>賤ヶ岳<rt>しずがたけ</rt></ruby>の戦い', d:'<ruby>柴田勝家<rt>しばたかついえ</rt></ruby>を 破る。<ruby>秀吉<rt>ひでよし</rt></ruby>の <ruby>天下<rt>てんか</rt></ruby>取りが 加速。' },
  { y:'1584', ch:4,            t:'「<ruby>長秀<rt>ながひで</rt></ruby>」→「<ruby>秀長<rt>ひでなが</rt></ruby>」に <ruby>改名<rt>かいめい</rt></ruby>', d:'名の 上下を 入れかえた。' },
  { y:'1585', ch:5, key:true,  t:'四国<ruby>征伐<rt>せいばつ</rt></ruby> の <ruby>総大将<rt>そうだいしょう</rt></ruby>', d:'<ruby>病<rt>やまい</rt></ruby>の 兄に かわり 大将を つとめ、<ruby>長宗我部<rt>ちょうそかべ</rt></ruby>を <ruby>降<rt>くだ</rt></ruby>す。' },
  { y:'1585', ch:6,            t:'<ruby>大和大納言<rt>やまとだいなごん</rt></ruby>・100<ruby>万石<rt>まんごく</rt></ruby>', d:'<ruby>郡山城<rt>こおりやまじょう</rt></ruby>を <ruby>居城<rt>きょじょう</rt></ruby>に。<ruby>大和<rt>やまと</rt></ruby>・<ruby>紀伊<rt>きい</rt></ruby>・<ruby>和泉<rt>いずみ</rt></ruby>で 約100万石を <ruby>領<rt>りょう</rt></ruby>する。' },
  { y:'1587', ch:5,            t:'九州<ruby>征伐<rt>せいばつ</rt></ruby>・<ruby>根白坂<rt>ねじろざか</rt></ruby>の戦い', d:'<ruby>島津<rt>しまづ</rt></ruby>の 大軍を 破り、九州<ruby>平定<rt>へいてい</rt></ruby>を 決定づける。この<ruby>功<rt>こう</rt></ruby>で <ruby>従二位<rt>じゅにい</rt></ruby>・<ruby>権大納言<rt>ごんだいなごん</rt></ruby>に。' },
  { y:'1591', ch:7, death:true,t:'<ruby>秀長<rt>ひでなが</rt></ruby>、死す', d:'<ruby>天正<rt>てんしょう</rt></ruby>19年1月。<ruby>大和郡山城<rt>やまとこおりやまじょう</rt></ruby>で <ruby>病没<rt>びょうぼつ</rt></ruby>。<ruby>享年<rt>きょうねん</rt></ruby> 数え52。' },
  { y:'1591-', ch:7, death:true,t:'<ruby>豊臣家<rt>とよとみけ</rt></ruby>の たそがれ', d:'直後に <ruby>利休<rt>りきゅう</rt></ruby><ruby>切腹<rt>せっぷく</rt></ruby>→<ruby>秀次<rt>ひでつぐ</rt></ruby>事件→<ruby>朝鮮出兵<rt>ちょうせんしゅっぺい</rt></ruby>→やがて 豊臣家 <ruby>滅亡<rt>めつぼう</rt></ruby>。' },
];
