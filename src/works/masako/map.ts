// Map data (skeleton stage). masako は5作でいちばん**地図が働かない**作品として設計されている
// (research §5 / design §0-4): 生涯の主舞台は 伊豆と鎌倉で、鎌倉の中の主要地点は互いに 1〜2km
// ——WRITING 地図書法4 の最小フレーム（約392単位 ≈380km）に2桁足りず、**鎌倉市街の地図は原理的に
// 描けない**。ゆえに主装置は「人の図」で、**線を 引く 地図主装置は 章六（承久の乱の東海道）だけ**。
// 残る 地図は「顔アンカーを 持たない 記録スパインの シーン」の 静かな place アンカー（establishing）＝
// 5-d 鎌倉↔京の 対峙・7-a 配流3上皇・2-c 鎌倉（後妻打ちの 内省）・5-c 京（名が 記録に のる）。
//
// campaign-map の層（TERRITORY / MAPPOINTS / FACTION_PHASES）は空のまま＝手帳の進軍タブを出さない。
// 政子の力は 領地の 広がりでは なく 縁と 家に 宿る（design §3）。承久の 東海道進軍（ch6）は
// 手帳の 生涯タブでなく **その シーンだけの sceneMap**（design §2「地図が主装置に立つのは章六だけ」）。
//
// シーン地図は各章と一緒に書く。ch6 の 進軍地図（6-d）が本作 唯一の地図主装置＝5作でここだけ
// 「線を 引くのが 嘘に ならない」場面（東国→京 の 向きは ◎。三つの道の うち 主力の 東海道だけ
// 線に し、残る 二道は deep で 開示＝WRITING 地図書法3）。Hand-managed.
/* eslint-disable */

import type {
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
} from '../../engine/types';

// No campaign-map layer (see header).
export const TERRITORY: Record<string, number> = {};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};
// 承久の乱（1221）の 東海道＝主力の 進み（鎌倉→駿河の 海ぞい→尾張→近江→京）。実座標を GEO で
// 投影した px（proj: x=(lon-128.5977)*94.782, y=(37.03053-lat)*114.348）。ch6 6-d の sceneMap だけが引く。
export const ROUTES: Record<string, RouteDef> = {
  'tokaido': { d: 'M1038 196 Q928 235 865 265 Q790 218 680 231' },
};
export const CAMPAIGN_ROUTES: CampaignRoute[] = [];
export const FACTION_PHASES: FactionPhase[] = [];
export const MAPLABELS: Record<string, string> = {};
export const MAPPOINTS: MapPoint[] = [];

/** 政子の生涯の地点、実 [lon,lat]（research §5）。移動の総距離は5作で最小。 */
export const GAZ: Record<string, GazPoint> = {
  // 伊豆 — 流人の 地。北条の 館（韮山）。ここから すべてが 始まる (ch1)。
  izu: { lon: 138.9631, lat: 35.0353 },
  // 修禅寺 — 頼家が 幽閉され 死んだ 地 (ch3)。伊豆の 山あい。
  shuzenji: { lon: 138.9264, lat: 34.9694 },
  // 鎌倉 — 武家の 都。作品の 中心 (ch2, 4, 6, 7)。
  kamakura: { lon: 139.5500, lat: 35.3192 },
  // 京 — 1218年の 上洛 (ch5)、そして 1221年に 攻めのぼった 先 (ch6)。
  kyoto: { lon: 135.7681, lat: 35.0116 },
  // 配流の 三点 — 終章の reveal（朝廷が 武家に 敗れ、上皇が 流された）。
  oki: { lon: 133.3225, lat: 36.2050 },   // 隠岐 = 後鳥羽上皇
  sado: { lon: 138.3667, lat: 38.0333 },  // 佐渡 = 順徳上皇
  tosa: { lon: 133.5311, lat: 33.5597 },  // 土佐 = 土御門上皇（みずから 望んで）
};

// Per-scene maps are authored together with each chapter (see header). 本作 唯一の 地図主装置は
// ch6 6-d の 進軍地図——きみ（政子）は 鎌倉に 残り、軍だけが 西へ 攻め上る（cur=鎌倉、京=enemy）。
export const SCENE_MAPS: Record<string, SceneMapDef> = {
  '6-d': {
    route: 'tokaido',
    markers: [
      { at: 'kamakura', cur: 1, kind: 'castle', label: '鎌倉', note: 'ここから 西へ', lpos: 'above' },
      // note は 場の 名指しに とどめる。6-d の C型 spark（力の 向きが 西から 東へ 逆転した）を
      // ここへ 移そうとして 失敗した記録（2026-07-28）＝**地図の note は 命題を 運べない**。
      // 「命じて きた 都」→小5 は「京が 攻めて きた」と 誤読（来る/行くの 語が 進軍の 線と 向きを 争う）。
      // 「命じて いた 都」→誤読は 消えたが「誰が 誰に 何を？」が 絵に 無く「ふーん」で 流れる。
      // 「命じる 側 だった」→幅が 足りず 枠外（tests/map-labels.test.ts）。逆転は 既に monologue と
      // 6-e むすびが 内側から 言っている＝**抜いた 跡は 言い換えでなく 削除**（design/known-premise.md §4）。
      { at: 'kyoto', kind: 'town', enemy: 1, label: '京', note: 'せめのぼる 先', lpos: 'left' },
    ],
  },
  // 顔アンカーを 持たない 記録スパインの シーン（後妻打ち・改名）の 静かな place アンカー
  // ＝establishing shot（WRITING 地図書法1）。単一の labeled marker で gate 通過（hidenaga 1-riddle 較正）。
  // 新しい 史実主張は 足さない——note は 本文で 既に 立てた 場を 呼ぶ だけ。線は 引かない（対峙も 進軍も ない）。
  // 2-c 鎌倉＝後妻打ちの あと「同じ 行いに 名を つけるのは 書いた 側」を 内省する 場。
  '2-c': {
    markers: [
      { at: 'kamakura', cur: 1, kind: 'castle', label: '鎌倉', note: '御台所の 都' },
    ],
  },
  // 5-c 京＝60年 生きて はじめて 名「政子」が 記録に のった 場（父の 一字を もらう）。cur=京（上洛中）。
  '5-c': {
    markers: [
      { at: 'kyoto', cur: 1, kind: 'town', label: '京', note: '名が のった 都' },
    ],
  },
  // 7-c 鎌倉＝終章の 名の reveal（「尼将軍」「政子」は ほかの 筆が つけた 名）の 静かな 場。reveal は
  // gate 対象外ゆえ その 下に establishing を敷く。cur=鎌倉（最期の 年、この 人が 動かした 都）。
  // note は 本文既出「鎌倉を 動かした」を 呼ぶ だけ（新しい 史実主張は 足さない）。
  '7-c': {
    markers: [
      { at: 'kamakura', cur: 1, kind: 'castle', label: '鎌倉', note: '動かした 都' },
    ],
  },
  // 章五 5-d むすび の quiet map（design §2 候補 / JOURNAL 2026-07-25(3)）＝「東の 武士の 都と、
  // 西の 京。二人の 女が 向き合って 決めた」の 二極。cur=鎌倉（きみ＝政子）↔ 京（兼子）。route 線は
  // 引かない——ch5 は 話し合い（静的対峙）で、進軍（線）は ch6 6-d。同じ 鎌倉↔京 地理を「線なし＝
  // 対峙」「線あり＝進軍」で対にする（話し合いが 決裂して 戦に なる アークを 二枚で 語る）。むすび
  // ゆえ establishing で結末を出すのは WRITING 地図書法1 の許す例外。約347km は min frame 380 未満だが
  // 6-d が実証するとおり 両点は約373単位離れ cur リング(r=24)の遮蔽外。enemy 印は付けない（ch5 は敵で
  // なく交渉相手＝京が enemy に なるのは ch6）。
  '5-d': {
    markers: [
      { at: 'kamakura', cur: 1, kind: 'castle', label: '鎌倉', note: '鎌倉の 女', lpos: 'above' },
      { at: 'kyoto', kind: 'town', label: '京', note: '京の 女', lpos: 'left' },
    ],
  },
  // 終章 7-a の reveal（design §2「配流3上皇の地図」）＝力の逆転の完成。cur=鎌倉（きみ＝幼将軍を
  // 後見する政子）から見て、乱を起こした三上皇が三つの島へ流された＝朝廷が武家に敗れた結末を一枚で。
  // むすび／reveal 用途ゆえ establishing shot で結末を出すのは WRITING 地図書法1 の許す例外。
  // 4点は互いに数百km離れ cur 近傍の遮蔽なし。ラベルの向きは 4方に散らして衝突を避ける。
  '7-a': {
    markers: [
      { at: 'kamakura', cur: 1, kind: 'castle', label: '鎌倉', note: 'きみは ここに', lpos: 'right' },
      { at: 'oki', kind: 'town', label: '隠岐', note: '後鳥羽上皇', lpos: 'left' },
      { at: 'sado', kind: 'town', label: '佐渡', note: '順徳上皇', lpos: 'above' },
      { at: 'tosa', kind: 'town', label: '土佐', note: '土御門上皇' },
    ],
  },
};
