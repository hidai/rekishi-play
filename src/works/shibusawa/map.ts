// Map data. shibusawa は「近代＝地図の文法が変わる」作品として設計されている
// (research §5 / design §0-4・§3): 力は 藩の 面（令制国ポリゴン）でなく、**会社・鉄道・港・銀行の
// 点のネットワーク**に宿る。ゆえに TERRITORY は塗らず（近代日本を令制国で塗らない）、地図が主装置に
// 立つのは 章三（欧州）・終章（会社の 散らばり／人形の 渡った 海）だけ＝7章中3章で「過半が 地図惰性」
// の 契約は 保たれる（design §3）。
//
// campaign-map の層（TERRITORY / MAPPOINTS / FACTION_PHASES）は最後まで空。会社/鉄道を別アイコンで
// 描き分けない——「約500社」を暗記させない（design §3-4）。会社の 点は 手帳の MapPoint でなく
// **終章の シーン地図**で 散らした: 章ごとに 増える 足あとでは なく、一度に 見わたす 総覧が
// 貫通の謎 B の 答えだから（design §2 円環）。
//
// ★note も label と同じ SVG <text>＝ruby は タグのまま 出る（tests/svg-text-fields が 見る）。
// 欧州は GEO_WEUROPE、太平洋は katsu の GEO_PACIFIC を scene map 側で借用する
// （design §9・engine 拡張ゼロ）。Hand-managed.
/* eslint-disable */

import type {
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
  Geo,
} from '../../engine/types';
import { GEO_WEUROPE, GEO_PACIFIC } from '../../shared/geoWorld';

// Stages other than the home geo (Japan). A scene picks one by key via SceneMapDef.geo.
// 章三の主題は「海の むこう」＝欧州そのものなので、その章の地図は日本の舞台に立てない
// (katsu ch3 の太平洋と同じ判断: 舞台はシーンの主題であって作品の属性ではない)。
// davinci の GEO_EUROPE ではなく GEO_WEUROPE を使う——前者は 49°N で切れており パリ(48.86N) が
// 焼き上げの上端に張りつく（顔と名前が枠外に切れる。geoWorld.ts の GEO_WEUROPE 冒頭に理由）。
// 終章 7-b は 太平洋を またぐ ので katsu の GEO_PACIFIC を借りる（design §9・engine 拡張ゼロ）。
export const GEOS: Record<string, Geo> = { europe: GEO_WEUROPE, pacific: GEO_PACIFIC };

// No campaign-map / territory layer in this work at all (see header).
export const TERRITORY: Record<string, number> = {};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};
export const ROUTES: Record<string, RouteDef> = {};
export const CAMPAIGN_ROUTES: CampaignRoute[] = [];
export const FACTION_PHASES: FactionPhase[] = [];
export const MAPLABELS: Record<string, string> = {};
export const MAPPOINTS: MapPoint[] = [];

/** 栄一の生涯の地点、実 [lon,lat]（research §5）。一人の百姓が世界（パリ）まで出て日本へ戻る円環。 */
export const GAZ: Record<string, GazPoint> = {
  // 血洗島（深谷）— 藍の 家。ここから すべてが 始まる (ch1)。
  chiharajima: { lon: 139.2814, lat: 36.1975 },
  // 横浜 — 攘夷の 標的、そして 開港場（渡欧の 出発港）(ch1 計画 / ch3 出発)。
  yokohama: { lon: 139.6425, lat: 35.4437 },
  // 京 — 一橋家への 仕官 (ch2)。
  kyoto: { lon: 135.7681, lat: 35.0116 },
  // 東京（兜町）— 第一国立銀行、実業の 拠点。作品後半の 中心 (ch4-7)。
  tokyo: { lon: 139.7767, lat: 35.6811 },
  // 静岡 — 帰国後、隠棲する 慶喜のもと・商法会所 (ch3 むすび)。
  shizuoka: { lon: 138.3831, lat: 34.9769 },
  // パリ — 1867年の 渡欧 (ch3)。scene map は GEOS.europe（GEO_WEUROPE）を借りて描く。
  paris: { lon: 2.3522, lat: 48.8566 },
  // マルセイユ — 一行が 船を おりた 港 (ch3)。ここから 陸を 北へ 上って パリへ 入る。
  marseille: { lon: 5.3698, lat: 43.2965 },
  // 大阪・札幌 — 終章の 点の 総覧 (ch7)。大阪紡績 (1882) と 札幌麦酒 (1887) ＝ 下野の あとに
  // 民の 側で 起こした 会社のうち、**東京から 遠い** もの。日本煉瓦 (深谷・上敷免) の 点は
  // 血洗島 (ch1 の gaz) が 引き受ける——上敷免は 生家から 数km で、この 縮尺では 同じ 点。
  osaka: { lon: 135.5023, lat: 34.6937 },
  sapporo: { lon: 141.3545, lat: 43.0618 },
  // 太平洋の 向こう (ch7 の 人形)。katsu と 同じく GEO_PACIFIC の proj.wrap が 負の経度を
  // 海の 向こう側へ 解決する（この 舞台に 立つ シーンだけが pin できる）。
  sf: { lon: -122.4194, lat: 37.7749 },
  // 海そのものの 名前が すわる 場所。子どもは 青い 面だけでは「太平洋」と 教われない（katsu ch3
  // の 判断）。両岸から 離れた 沖に 置く——note が 岸に 付くと 枠の 外へ はみ出す。
  taiheiyo: { lon: 185, lat: 36.7 },
};

// Per-scene maps are authored together with each chapter (see header).
// ラベルの 逃がし先は「フレームの どちら端に いるか」で決まる（tests/map-labels が 両方を 落とす）:
// 終章 7-a は 東京＝下端ぎわ・大阪＝南西の 角 ゆえ どちらも note を 上へ、7-b は 横浜が 西の 端
// ゆえ 東（海の 側）へ 逃がす。
export const SCENE_MAPS: Record<string, SceneMapDef> = {
  // 1-b 計画の 地図＝章一 唯一の 地図（本作で 地図が 主装置に 立つのは ch3/ch4 だけ・design §3）。
  // 開幕アンカー（WRITING 地図書法1）: 読者が 立つのは「きみの 村」で、まだ 見ぬ 標的が 南に ある。
  // 線は 引かない——鎌倉街道を 通る 道筋は 本人の 回想が 唯一の 出どころ（△）で、ルート線は
  // 係争を 解像する 断定に なる（地図書法2）。高崎城は 置けない: 血洗島から 約27km＝cur リングの
  // 遮蔽圏内（地図書法4）。城は 本文が 語り、地図は「村と 港」の 2点だけを 引き受ける。
  '1-b': {
    markers: [
      { at: 'chiharajima', cur: 1, kind: 'village', label: '血洗島', note: 'きみの 村' },
      { at: 'yokohama', kind: 'town', enemy: 1, label: '横浜', note: '焼く つもりの 港', lpos: 'left' },
    ],
  },

  // 2-a 京の 宿＝章二の 開幕アンカー（WRITING 地図書法1）。読者は 章一で 血洗島に 立って いたので、
  // 章二の 最初の 仕事は「どれだけ 遠くへ 来たか」を 見せる こと。線は 引かない——道筋の 出どころは
  // 本人の 回想だけ（地図書法2・1-b と同じ判断）。2点の 隔たりは 約320km＝cur リングの 遮蔽圏の
  // 外（地図書法4）。
  '2-a': {
    markers: [
      { at: 'kyoto', cur: 1, kind: 'town', label: '京', note: 'いま ここ' },
      { at: 'chiharajima', kind: 'village', label: '血洗島', note: '出て きた 村', lpos: 'right' },
    ],
  },

  // 3-b パリ＝章三の 開幕アンカー（WRITING 地図書法1）。章一は 血洗島、章二は 京——この 章で
  // 初めて 舞台が 日本を 出る。だから 地図の 仕事は「どれだけ 遠いか」で、そのために 舞台ごと
  // 別の 世界（GEOS.europe）へ 移す（katsu ch3 の太平洋と同じ。SceneMapDef.geo の注記）。
  // 2点だけ: 船を おりた 港と、いま 立って いる 町。線は 引かない——マルセイユから パリまでの
  // 道筋（リヨン回りの 汽車）は 断定に 足る 出どころを 踏んで いない（地図書法2）。
  // 血洗島・横浜は この 舞台の 外＝枠の 外の 矢印に しかならないので 置かない（katsu の
  // 「対岸は 矢印に しか ならない」の裏返し。遠さは 川と 海岸線が すでに 語る）。
  '3-b': {
    geo: 'europe',
    markers: [
      { at: 'paris', cur: 1, kind: 'town', label: 'パリ', note: 'いま ここ' },
      { at: 'marseille', kind: 'town', label: 'マルセイユ', note: '船を おりた 港', lpos: 'right' },
    ],
  },

  // 4-a 静岡＝章四の 開幕アンカー（WRITING 地図書法1）。章三の むすびで きみが 立った 静岡から、
  // 呼び出しの 紙が 来た 東京へ——読者が 立って いるのは まだ 静岡なので、cur は 静岡。線は
  // 引かない（船で 行ったか 陸を 行ったかは 踏んで いない＝地図書法2）。2点の 隔たりは 約150km＝
  // cur リングの 遮蔽圏の 外（地図書法4）。会社の 点の 散布は この 章では 置かない——1873年の
  // 時点で 立って いるのは 兜町の 一つだけで、散布は 終章の 総覧の 仕事（design §2）。
  '4-a': {
    markers: [
      { at: 'shizuoka', cur: 1, kind: 'town', label: '静岡', note: 'いま ここ' },
      { at: 'tokyo', kind: 'town', label: '東京', note: '呼ばれた 先', lpos: 'right' },
    ],
  },

  // 7-a 会社の 点の 総覧＝章四で 先送りした 仕事（4-a の 注記・design §2）。この 作品で 唯一
  // 「移動」でなく「散らばり」を 語る 地図で、貫通の謎 B（なぜ 財閥を つくらなかったか）の 答えを
  // 絵が 受け持つ——きみは 一つの 家に 富を 積まず、点を よそへ ばらまいた。
  // 線は 引かない: 会社どうしを 結ぶ 線は 実在しない 関係を 描く ことに なる（地図書法2）。
  // むすびでは ないが 終章の 総覧＝この シーン 自体が 見わたしを 主題に する（地図書法1 の 例外）。
  '7-a': {
    markers: [
      { at: 'tokyo', cur: 1, kind: 'town', label: '東京', note: 'きみが 立てた 銀行', lpos: 'above' },
      { at: 'osaka', kind: 'town', label: '大阪', note: 'わたを つむぐ 会社', lpos: 'above' },
      { at: 'sapporo', kind: 'town', label: '札幌', note: 'ビールの 会社', lpos: 'left' },
      { at: 'chiharajima', kind: 'village', label: '血洗島', note: 'となりは れんがの 村', lpos: 'left' },
    ],
  },

  // 7-b 人形が わたった 海。katsu ch3 と 同じ 太平洋の 舞台を 借りる。この 地図が 語るのは
  // 距離では なく **数の かたより**——12,739 と 58 が 向かい合う。
  // 長い note は 沖（taiheiyo）に 置く: 岸に 付けると 枠の 外へ はみ出し、対岸の ラベルとも
  // ぶつかる（katsu ch3 と 同じ 逃がし方。tests/map-labels がどちらも 落とす）。数の やりとりは
  // どちらの 岸でも なく 海の 上で 起きた こと でも ある。
  // 線は 引かない: 人形を 積んだ 船の 航路は 踏んで いない（地図書法2）。
  '7-b': {
    geo: 'pacific',
    markers: [
      { at: 'yokohama', cur: 1, kind: 'town', label: '日本・横浜', note: '58たいを 送りかえした', lpos: 'right' },
      { at: 'taiheiyo', kind: 'sea', label: '太平洋' },
      { at: 'sf', kind: 'town', label: 'アメリカ', note: '12,739たいが 来た' },
    ],
  },
};
