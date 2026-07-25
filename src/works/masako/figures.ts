// ★P 「人の図」データ（masako）。エンジン: src/engine/map/figure.ts。色は literal
// （テーマ非依存＝render-scene で忠実に出る。kiyomori/ieyasu と同じ流儀）。手書き管理。
//
// 本作の主装置（design §3）。政子の力は 土地でなく 縁と 家に 宿り、鎌倉の 地理は 最小フレームに
// 2桁足りない——地図の代わりに、この図が 生涯の 形を 運ぶ。
//
// 一枚の図が 全章を 通して 育つ／欠けていく: 章が 進むと 子が 現れ（fromCh）、縁が 切れる（cutCh）。
// **人は 消さない**——図から 人を 消しても 読者は 消えた ことに 気づけない（davinci ch4 の剥落の学び）。
// 喪失は「無くなった物」でなく「残った物の変化」＝点線＋二重斜線が 運ぶ。
//
// 円の 色は 父方の 家（house）だけで 決める＝源氏の 朱に、政子ひとりが 北条の 藍。政子は 源氏の
// 一族に 嫁ぎ、その 縁を 一つずつ 見おくる 側に 立つ——藍が 朱の 中に 一つ、が その 立ち位置。
// ★血の ふち（藍リング）は やめた: 一幡の 父・頼家は 政子の 実子＝一幡も 北条の 血を 引く（政子は
// 祖母）。1203年に 争われたのは 血の 濃さでなく「どの 家が 将軍の 母方（外戚）に なるか」で、
// これは 円の 色では なく 3-b の deep（母方の 家＝一幡は 比企／実朝は 政子）が 運ぶ。
//
// title/caption/faction は SVG の <text>＝ルビを 付けられない（tests/svg-text-fields）。ゆえに
// 「縁の 図」でなく notebookLead と そろえて「人の 図」、係り先は 平仮名で 逃がす。
// 顔ノードの masako は 尼形（p-masako）で 出る＝この図は ch3 で 初登場（尼に なった後）。
// 章一・二で 出すなら 御台所の 顔に 差し替える 必要が ある（別 variant ノードか 図を分ける）。
/* eslint-disable */

import type { Figure } from '../../engine/types';

const GENJI = '#9c3b32'; // 朱：源氏の家（夫と子ら）
const HOJO = '#33608f'; // 藍：北条の家（政子）
const GONE = '#9a938a'; // 灰：席から 去った 人（ch4 の 時政＝伊豆へ）

export const FIGURES: Record<string, Figure> = {
  // 章一の むすび（1-d）＝人の図の「起点」。design §2: 縁の図が「北条の娘」1人から 生まれる。
  // まだ 子は いない——伊豆で 北条の 娘（御台所 variant）が、流された 男に 縁を むすぶ、その
  // 最初の 一本だけ。この 図が ch3 で `en` として 育ち、また 切れていく（円環＝design §2 円環）。
  // 政子ノードは 御台所の 顔（p-masako@wife）＝出家前。engine が @variant を 解決するので、
  // 顔は 御台所・カードと 名前は 基底 p-masako（クリックで 開く）。座標は `en` の 上段と そろえる。
  en1: {
    kind: 'lineage',
    title: '政子の 人の 図',
    caption: 'ここから、縁が むすばれて いく',
    vb: [1000, 300],
    factions: [
      { key: 'genji', label: '源氏（流された 男）', color: GENJI },
      { key: 'hojo', label: '北条（きみ）', color: HOJO },
    ],
    nodes: [
      { id: 'yoritomo', x: 380, y: 140, pid: 'p-yoritomo', house: 'genji' },
      { id: 'masako', x: 620, y: 140, pid: 'p-masako@wife', house: 'hojo' },
    ],
    edges: [{ from: 'yoritomo', to: 'masako', kind: 'marriage', fromCh: 1 }],
  },

  // 章三で初登場（3-d むすび）。以後の章で 線が 増え、また 切れていく。
  // cutCh は 出来事の 章に そろえる: 大姫 1197(ch2) / 頼朝・三幡 1199(ch3) /
  // 一幡 1203・頼家 1204(ch3) / 実朝 1219(ch6)。
  en: {
    kind: 'lineage',
    title: '政子の 人の 図',
    caption: '切れた 線は、二度と つながらない',
    vb: [1000, 480],
    factions: [
      { key: 'genji', label: '源氏（夫と 子ら）', color: GENJI },
      { key: 'hojo', label: '北条（政子）', color: HOJO },
    ],
    nodes: [
      { id: 'yoritomo', x: 380, y: 95, pid: 'p-yoritomo', house: 'genji' },
      { id: 'masako', x: 620, y: 95, pid: 'p-masako', house: 'hojo' },
      { id: 'ohime', x: 120, y: 250, pid: 'p-ohime', house: 'genji' },
      { id: 'yoriie', x: 350, y: 250, pid: 'p-yoriie', house: 'genji', fromCh: 2 },
      { id: 'sanman', x: 590, y: 250, pid: 'p-sanman', house: 'genji', fromCh: 2 },
      { id: 'sanetomo', x: 850, y: 250, pid: 'p-sanetomo', house: 'genji', fromCh: 2 },
      // 一幡＝役割語で流す人（design §5）。カードも顔も持たない名前ノード。
      { id: 'ichiman', x: 350, y: 425, house: 'genji', label: '一幡', fromCh: 3 },
    ],
    edges: [
      { from: 'yoritomo', to: 'masako', kind: 'marriage', fromCh: 1, cutCh: 3 },
      { from: 'yoritomo', from2: 'masako', to: 'ohime', kind: 'descent', fromCh: 1, cutCh: 2 },
      { from: 'yoritomo', from2: 'masako', to: 'yoriie', kind: 'descent', fromCh: 2, cutCh: 3 },
      { from: 'yoritomo', from2: 'masako', to: 'sanman', kind: 'descent', fromCh: 2, cutCh: 3 },
      { from: 'yoritomo', from2: 'masako', to: 'sanetomo', kind: 'descent', fromCh: 2, cutCh: 6 },
      { from: 'yoriie', to: 'ichiman', kind: 'descent', fromCh: 3, cutCh: 3 },
    ],
  },

  // 章四で初登場（4-d むすび）＝本作 唯一の「席の図」。ここは 血の 縁でなく **力の 席**を 描く。
  // ch3 の死は cutCh（点線＝二度と つながらぬ）で 運んだが、追放は 死では ない——時政は 伊豆で
  // 10年 生きた。ゆえに lineage の「切れる」でなく、席が 灰に 変わり 去る（gone）で 運ぶ。
  // 上座（dais）＝将軍・実朝＝変わらぬ 文脈（kiyomori の 帝と 同じ 使い方）。その 下の 三席が
  // 「父から 娘と 弟へ」の 力の 移りを 一枚で 見せる: 時政（灰・伊豆へ）／政子（藍・きみ＝金の
  // ふち）／義時（藍・執権）。政子を 中央＝将軍の 真下に 置くのが 主張——父を 退けてまで、きみは
  // この 席の そばに 立った。title/caption/label/role は SVG text＝ルビ不可（本文が 語を 教える）。
  seat: {
    kind: 'assembly',
    title: '鎌倉を 動かす 席',
    caption: '灰色の 席は、伊豆へ 去った 人',
    vb: [1000, 270],
    factions: [
      { key: 'genji', label: '将軍・実朝', color: GENJI },
      { key: 'hojo', label: '北条の きみと 弟', color: HOJO },
      { key: 'gone', label: '伊豆へ 去った 父', color: GONE },
    ],
    dais: { x: 500, y: 50, label: '将軍', faction: 'genji' },
    seats: [
      { id: 'tokimasa', x: 210, y: 190, role: '伊豆へ' },
      { id: 'masako', x: 500, y: 190 },
      { id: 'yoshitoki', x: 790, y: 190, role: '執権' },
    ],
    fills: [
      { seat: 'tokimasa', fromCh: 4, faction: 'gone', pid: 'p-tokimasa', label: '時政' },
      { seat: 'masako', fromCh: 4, faction: 'hojo', pid: 'p-masako', label: '政子' },
      { seat: 'yoshitoki', fromCh: 4, faction: 'hojo', pid: 'p-yoshitoki', label: '義時' },
    ],
  },

  // 終章 むすび（7-e）＝「残したのは 制度でも 書きものでも ない、鎌倉が 続いた こと」。seat の variant:
  // 席は 残り、座る 人が 世代を こえて 入れかわる。義時（執権）は 1224年に 世を さり、その 席は 子・
  // 泰時が 継ぐ——4-d/6-e の seat を そのまま 7-e で 使うと 実朝（1219没）・義時（1224没）の 席が
  // anachronism に なる（JOURNAL 2026-07-25(6)）。ゆえに 別キーの variant で: 将軍の 席は era-neutral
  // （藤原の 幼将軍＝顔なし「将軍」）／中央は きみ（政子）／執権の 席は 義時から 泰時へ 移った＝
  // 「席が 続いた」を 一枚で。既存 seat は 4-d/6-e で バイト不変（新キーゆえ 出荷済み出力を 変えない）。
  seatEnd: {
    kind: 'assembly',
    title: '続いた 鎌倉の 席',
    caption: '座る 人は 入れかわっても、席は のこった',
    vb: [1000, 270],
    factions: [
      { key: 'genji', label: '将軍の 席', color: GENJI },
      { key: 'hojo', label: '北条の 家', color: HOJO },
      { key: 'gone', label: '伊豆へ 去った 父', color: GONE },
    ],
    dais: { x: 500, y: 50, label: '将軍', faction: 'genji' },
    seats: [
      { id: 'tokimasa', x: 210, y: 190, role: '伊豆へ' },
      { id: 'masako', x: 500, y: 190 },
      { id: 'yoshitoki', x: 790, y: 190, role: '執権' },
    ],
    fills: [
      { seat: 'tokimasa', fromCh: 7, faction: 'gone', pid: 'p-tokimasa', label: '時政' },
      { seat: 'masako', fromCh: 7, faction: 'hojo', pid: 'p-masako', label: '政子' },
      { seat: 'yoshitoki', fromCh: 7, faction: 'hojo', pid: 'p-yasutoki', label: '泰時' },
    ],
  },
};
