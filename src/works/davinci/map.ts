// Map data (skeleton stage). davinci is the FIRST work staged OVERSEAS: its home geo is GEO_EUROPE
// (Italy + southern France, baked from Natural Earth — src/shared/geoWorld.ts), NOT the shared Japan
// GEO. All points are REAL [lon,lat] and the engine projects them via GEO_EUROPE.proj at render
// (engine/map/project.ts). The map's role is DEMOTED from the earlier works (design §2): not 領土の
// 広がり (a 進軍の地図) but 宮廷から宮廷への旅 — a one-way journey court to court that ends in France,
// with no 帰る円環 (contrast ieyasu's 駿府). The campaign-map layer (TERRITORY/MAPPOINTS/FACTION_PHASES)
// stays empty on purpose: there are no 令制国-style provinces to color (GEO_EUROPE is silhouette-only —
// Renaissance Italy is a shifting patchwork of city-states, WRITING 地図書法2「地図はヘッジできない」),
// so `hasCampaignMap` is false and the notebook hides that tab.
//
// SKELETON SCOPE: SCENE_MAPS is empty — per-scene maps are authored WITH each chapter (the opening-
// anchor principle needs the scene's opening situation to exist first). The イモラ都市図 (design §5,
// the chapter where the map becomes the protagonist's OWN work) is authored with ch5. Hand-managed.
/* eslint-disable */

import type {
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
} from '../../engine/types';

// No campaign-map layer (see header): Europe has no province overlays to color.
export const TERRITORY: Record<string, number> = {};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};
export const ROUTES: Record<string, RouteDef> = {};
export const CAMPAIGN_ROUTES: CampaignRoute[] = [];
export const FACTION_PHASES: FactionPhase[] = [];
export const MAPLABELS: Record<string, string> = {};
export const MAPPOINTS: MapPoint[] = [];

/**
 * The courts of Leonardo's life, REAL [lon,lat] (research §5-1/§5-2). Every point falls inside
 * GEO_EUROPE.bounds = [-1, 15, 40, 49]. ヴェネツィア floats just off its own lagoon (the eps=0.05°
 * coastline can't enclose the lagoon — see geoWorld.ts); faithful, so it is left as-is. Inland cities
 * (ミラノ/フィレンツェ/ローマ) sit on land — pinned by tests/geo-projection.test.ts.
 */
export const GAZ: Record<string, GazPoint> = {
  // トスカーナ — birth and the Florence workshop (ch1-2), and the return that begins モナ・リザ (ch6).
  vinci: { lon: 10.925, lat: 43.783 },    // ヴィンチ村 = 生誕の地
  firenze: { lon: 11.256, lat: 43.770 },  // フィレンツェ = 修業の街、モナ・リザ着手
  // ロンバルディア — the Sforza court, ~17 years, and 『最後の晩餐』(ch3-4).
  milano: { lon: 9.190, lat: 45.464 },    // ミラノ = スフォルツァ宮廷、最後の晩餐、騎馬像
  // 旅の途中 — after Milan falls, before Florence (research §5-1).
  mantova: { lon: 10.792, lat: 45.157 },  // マントヴァ = イザベラ・デステの下絵（未完）
  venezia: { lon: 12.336, lat: 45.440 },  // ヴェネツィア = 防衛技術の提案
  // ロマーニャ — the Borgia campaign, where the イモラ都市図 is drawn (ch5).
  imola: { lon: 11.714, lat: 44.354 },    // イモラ = 主人公自身が描いた精密都市図
  // ラツィオ — the Rome years under Medici patronage (ch6, research §4-4).
  roma: { lon: 12.496, lat: 41.903 },     // ローマ = メディチの庇護、解剖・光学の研究
  napoli: { lon: 14.268, lat: 40.852 },   // ナポリ = イタリア5大国の一角（時代の背景）
  // フランス — over the Alps, the final court and death (ch7).
  amboise: { lon: 0.983, lat: 47.413 },   // アンボワーズ = クルー館、最期の地
};

// Per-scene maps are authored together with each chapter (see header). Every scene without an entry
// falls back to its chapter's default location (= CHAPTER_POINTS).
export const SCENE_MAPS: Record<string, SceneMapDef> = {
  // 3-a: leaving Florence for Milan. The establishing shot is the one-way journey to a new court
  // (design §2「宮廷から宮廷への旅」): cur = きみ at フィレンツェ (departure); the destination ミラノ
  // carries スフォルツァ公's face — this IS ch3's 社会相関マップ device (design §7 =「顔を場所に置く」
  // §8), the patron you are heading toward. No route line: the two city points + the face say "you
  // leave home for this man's court" without resolving a disputed path (WRITING 地図書法2). Both are
  // 係争に触れない都市中心 (地図書法6). The two poles sit far apart, so きみ's cur ring at フィレンツェ
  // never collides with ルドヴィコ's face at ミラノ (地図書法4).
  '3-a': { markers: [
    { at: 'firenze', cur: 3, kind: 'town', label: 'フィレンツェ' },
    { at: 'milano', kind: 'castle', label: 'ミラノ', note: 'スフォルツァの 宮廷', people: ['p-ludovico'] },
  ] },

  // ch5「ボルジアの 軍事技師」— the map device re-frames the SAME geo point イモラ across the chapter (design
  // §7). Both are SINGLE-anchor shots: firenze→imola is only ~80km (well under the 392-unit min frame,
  // WRITING 地図書法4) so a two-pole firenze→imola pair would collide きみ's cur ring with the far
  // marker's face+note stack. So each scene centers on イモラ alone — no second pole, no collision.
  // 5-a establishing shot (地図書法1): きみ has come to Borgia's Romagna camp. This IS ch5's 顔を場所に
  // 置く device (§8) — but the subject placed at the point is ボルジア, so his face sits here ALONE, no
  // cur. Co-locating きみ's cur face here made レオナルド(5字)+ボルジア(4字) labels collide (the engine
  // spaces two faces by a fixed gap sized for short names — hidenaga's 2字 names fit, these don't). A
  // cur-less establishing shot is a shipped pattern (kiyomori 7-b). It also sharpens the chapter's map
  // arc: 5-a = HIS place (the fear) → 5-c = きみ's place (the one thing he finished). castle (non-enemy:
  // patron, not target — same as ch3's milano). imola is a 係争に触れない都市中心 (地図書法6).
  '5-a': { markers: [
    { at: 'imola', kind: 'castle', label: 'イモラ', note: '暴君ボルジアの 陣', people: ['p-cesare'] },
  ] },
  // 5-c 山場: the SAME イモラ, now re-framed as きみ's OWN work — the precise top-down town plan he
  // rarely-for-him finished (design §5-4「地図が主人公の作品になる」). No face here: this beat is きみ's
  // map, not Borgia. town (a place he mapped, not a camp). The engine can't draw the street plan, so the
  // note names what the point BECAME; the plan itself is carried by prose + the w-imola card + spark/deep.
  '5-c': { markers: [
    { at: 'imola', cur: 3, kind: 'town', label: 'イモラ', note: '真上から 見て、きみが 描いた 街' },
  ] },

  // 6-c2 ローマ — the one court the journey map never staged (design §2「宮廷から宮廷への旅」): the
  // point existed in GAZ but no scene used it, so the reader's 「いま ここ」 jumped フィレンツェ→
  // アンボワーズ. Establishing shot (地図書法1): きみ arrives at the Medici court. Single anchor —
  // a second pole would put ジュリアーノ's face+note stack next to きみ's cur ring (地図書法4); his
  // face is carried inline in the text instead. castle = 庇護者の宮殿 (the ch3 milano / ch5 imola
  // reading, not an enemy). roma is a 係争に触れない都市中心 (地図書法6). note is SVG <text>: plain.
  '6-c2': { markers: [
    { at: 'roma', cur: 6, kind: 'castle', label: 'ローマ', note: 'メディチに まねかれて' },
  ] },
};
