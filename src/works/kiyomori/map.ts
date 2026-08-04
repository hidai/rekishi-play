// Map data (skeleton stage). Adds gaz for the sea-road and key Kyoto sites on top of the
// shared GEO. Coords are research §6 REAL [lon,lat]; the engine projects them at render via
// GEO.proj. Approximate (legend sites vary). ROUTES stay in px — a hand-curved sea road is a
// drawing, not a chain of places.
// ★Chapter 四 wires the sea-road grammar (design §7): the `sea-road` route (大輪田泊→厳島→
//   博多, cited by the ch4 scene maps and the campaign-map overlay) plus the off-map 宋 edge
//   arrow. territory/mapPoints stay empty (no territory coloring — focus is the sea road).
//   Hand-managed (kiyomori has no legacy extract source).
/* eslint-disable */

import type {
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
} from '../../engine/types';

// No territory coloring — focus is the sea road (design §7-1).
export const TERRITORY: Record<string, number> = {};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};
// The sea road, gently curved along the Inland Sea: 大輪田泊(623,271) → 厳島(353,313) → 博多(169,394).
// Cited by ch4 scene maps (SceneMapDef.route) and the campaign-map overlay (CAMPAIGN_ROUTES).
export const ROUTES: Record<string, RouteDef> = {
  'sea-road': { d: 'M623 271 Q490 300 353 313 Q250 345 169 394' },
};
// Campaign-map overlay: the sea road of Song trade, revealed once ch4 is reached. The shared
// animated runner ("宋への 船") sails it. color = indigo (--accent) reads as deep sea.
export const CAMPAIGN_ROUTES: CampaignRoute[] = [
  {
    key: 'sea-road',
    color: 'var(--accent)',
    revealCh: 4,
    legend: '<b>海の 道</b>（<ruby>日宋貿易<rt>にっそうぼうえき</rt></ruby>）<ruby>大輪田泊<rt>おおわだのとまり</rt></ruby>→<ruby>厳島<rt>いつくしま</rt></ruby>→<ruby>博多<rt>はかた</rt></ruby>、そして 宋へ',
    runnerLabel: '宋への 船',
  },
];
export const FACTION_PHASES: FactionPhase[] = [];
export const MAPLABELS: Record<string, string> = {};
export const MAPPOINTS: MapPoint[] = [];

// Sea road (heading west) + key Kyoto sites. 宋 (Song / Mingzhou = Ningbo) sits off the Japan map
// to the southwest; buildSceneMap renders a marker with `off:1` as an edge arrow pointing toward
// this true coordinate, so a scene can show "the sea beyond = Song" without a China silhouette.
export const GAZ: Record<string, GazPoint> = {
  ise: { lon: 136.447, lat: 34.757 },       // Ise (Tadamori's mound) = clan roots, eastern origin
  rokuhara: { lon: 135.772, lat: 34.993 },  // Rokuhara = the Heike base in Kyoto
  heiankyo: { lon: 135.740, lat: 35.010 },  // Heian-kyo = the emperor's / court's ground
  shishigatani: { lon: 135.793, lat: 35.010 }, // Shishigatani = site of the conspiracy
  fukuhara: { lon: 135.170, lat: 34.687 },  // Fukuhara = the relocation target, symbol of the sea turn
  owada: { lon: 135.170, lat: 34.661 },     // Owada-no-tomari = start of the sea road (proto Kobe port)
  ondo: { lon: 132.543, lat: 34.197 },      // Ondo strait = legend of the cut & sun-summoning (☆)
  itsukushima: { lon: 132.322, lat: 34.293 }, // Itsukushima = the sea shrine, star of the western sea road
  hakata: { lon: 130.381, lat: 33.585 },    // Hakata = the domestic front line of Song trade
  dannoura: { lon: 130.961, lat: 33.961 },  // Dannoura = where the Heike fell, west end of the sea road
  yashima: { lon: 134.126, lat: 34.346 },   // Yashima = the Heike naval camp (1185)
  izu: { lon: 138.930, lat: 35.030 },       // Izu (Hirugakojima) = Yoritomo's exile & uprising
  sanuki: { lon: 133.930, lat: 34.340 },    // Sanuki (Shiramine) = Sutoku's exile, in-polygon checked (讃岐)
  kumanoji: { lon: 135.380, lat: 33.730 },  // Kumano road (Kii Tanabe) = where the Heiji news reaches you (紀伊)
  // Off-map destinations. Projected via the GEO formula they land outside the frame; only the
  // direction is used (edge arrow), not an on-map dot.
  song: { lon: 121.550, lat: 29.870 },      // 宋 (明州) = the far end of the sea road, southwest
  kikaigashima: { lon: 130.310, lat: 30.790 }, // 鬼界ヶ島 (Satsuma Iōjima, 通説の比定地) = Shunkan's exile, far south
};

// Per-scene maps. Every scene whose main visual is the map (= no closeup / figure) has an
// authored entry — the calibrated hidenaga corpus never ships a scene on the bare one-face
// fallback, so neither does kiyomori (playtest note 2026-07-13 "mostly text"). Musubi / riddle
// scenes get a quiet 1-2 marker anchor whose note echoes the evaluated text (their star device
// is the creed / riddle UI). 宋 uses off:1 (southwest edge arrow).
export const SCENE_MAPS: Record<string, SceneMapDef> = {
  // 1-a: where you were born — the sea clan's ground at Ise, the capital a distant point.
  '1-a': { markers: [
    { at: 'ise', cur: 1, kind: 'town', label: '伊勢', note: '海の 近くで 育った', people: ['p-tadamori'] },
    { at: 'heiankyo', kind: 'town', label: '京' },
  ] },
  // 1-riddle: quiet anchor while the riddle takes the stage (hidenaga 1-riddle precedent).
  // 1-b: the view flips — now you stand in the capital, looked down on; Ise is home behind you.
  '1-b': { markers: [
    { at: 'heiankyo', cur: 1, kind: 'town', label: '京', note: '成り上がり、と 見くだされる' },
    { at: 'ise', kind: 'town', label: '伊勢' },
  ] },
  // 2-a: the Hōgen rebellion. The reader ENTERS on the capital splitting in two — 崇徳院 vs
  // 後白河天皇, you fighting on 後白河's side. Anchor the map to that opening standoff, NOT the
  // exile aftermath. 崇徳's 讃岐 exile is the text's closing beat and belongs to 2-d's payoff;
  // showing it here (map seen before the text) jumped ahead of the reader and jarred against the
  // opening paragraphs (playtest note 2026-07-14 — a scene map anchors to the entry situation,
  // not a downstream result). Both rival faces flank you at 京 = 都、まっぷたつに 割れる.
  '2-a': { markers: [
    { at: 'heiankyo', cur: 1, kind: 'battle', label: '京', note: '都、まっぷたつに 割れる', people: ['p-sutoku', 'p-goshirakawa'] },
  ] },
  // 2-b: the Heiji coup breaks while you are on the Kumano road with a handful of men —
  // the enemy flag holds the capital, you are far south. No route line: the gauntlet back
  // is the choice itself, not yet a traveled road (same pre-crossing tension as katsu 3-b).
  '2-b': { markers: [
    { at: 'heiankyo', kind: 'flag', enemy: 1, label: '京', note: '義朝ら、都を のっとる', people: ['p-yoshitomo'] },
    { at: 'kumanoji', cur: 1, label: '熊野への 道', note: 'わずかな お供だけ' },
  ] },
  // 2-d: victory chapter close — you hold the capital, yet the story belongs to the exiled
  // loser. 崇徳's face has moved 京 (the 2-a standoff) → 讃岐 here, so the exile-distance payoff
  // lands once, at the close, instead of pre-empting the 2-a opening.
  '2-d': { markers: [
    { at: 'rokuhara', cur: 1, kind: 'flag', label: '六波羅', note: '勝ったのは、きみ' },
    { at: 'sanuki', label: '讃岐', note: '語りつがれたのは、敗れた 側', people: ['p-sutoku'] },
  ] },
  // 3-a: the Heike base inside the capital — a warrior joins the court nobility for the
  // first time (公卿 itself can't render un-rubied; the chapter title's phrasing carries it).
  '3-a': { markers: [
    { at: 'rokuhara', cur: 1, kind: 'flag', label: '京・六波羅', note: '武士、貴族の てっぺんへ' },
  ] },
  // 5-b: the Shishigatani plot exposed in 京 — and the answer is exile beyond the frame.
  // Off-map edge arrow (Song mechanism) carries the one message: 鬼界ヶ島 is impossibly far,
  // and 俊寛 stays there alone.
  '5-b': { markers: [
    { at: 'shishigatani', cur: 1, label: '京・鹿ヶ谷', note: 'はむかう たくらみ、ばれる' },
    { at: 'kikaigashima', off: 1, label: '鬼界ヶ島', note: '俊寛、ひとり のこされる' },
  ] },
  // 5-d: chapter close on the storytellers — the "arrogant villain" tale takes shape only
  // after the fall (the scene's own thesis, echoed as the map's one line).
  '5-d': { markers: [
    { at: 'rokuhara', cur: 1, kind: 'flag', label: '京・六波羅', note: '物語は、ほろびの あとに' },
  ] },
  // 4-a: the port at 大輪田泊 — a tight local view (the sea turn begins).
  '4-a': { markers: [{ at: 'owada', cur: 1, kind: 'town', label: '大輪田泊', note: '港を 造りなおす' }] },
  // 4-b: the choice — how far to bring the Song ships. Full sea road + off-map 宋.
  // 博多's note goes above the icon: below it would cross 宋's off-arrow text block
  // (the arrow text sits above the arrow in this bottom-left corner).
  '4-b': { route: 'sea-road', markers: [
    // The note must not name 畿内 here: choice B *is* "bring them to 畿内", and the map is read
    // before the choice (2026-08-04「岐路の答えを先に見せる面」).
    { at: 'owada', cur: 1, kind: 'town', label: '大輪田泊', note: '造りかけの 港' },
    { at: 'itsukushima', kind: 'flag', label: '厳島' },
    { at: 'hakata', kind: 'town', label: '博多', note: 'これまでの 玄関口', lpos: 'above' },
    { at: 'song', off: 1, label: '宋', note: '海の むこう' },
  ] },
  // 4-c: building the road (minigame) + the sea shrine.
  '4-c': { markers: [
    { at: 'owada', cur: 1, kind: 'town', label: '大輪田泊', note: '経ヶ島を 築く' },
    { at: 'itsukushima', kind: 'flag', label: '厳島', note: '海の上の 社' },
  ] },
  // 4-c2: the retired emperor crosses the hills to the port. No closeup here — the two faces
  // together would show the meeting the reader has not chosen yet.
  // 福原 is only 3km from 大輪田泊 — inside the cur ring, so the two cannot both be marked
  // (WRITING 地図4). 京 carries the distance the 院 crossed instead.
  '4-c2': { markers: [
    { at: 'heiankyo', kind: 'town', label: '京', note: '院は ここから', lpos: 'above' },
    { at: 'owada', cur: 1, kind: 'town', label: '大輪田泊', note: '宋の 船が 入る 港' },
  ] },
  // 4-d: the road opened, recap toward 宋.
  '4-d': { route: 'sea-road', markers: [
    { at: 'owada', cur: 1, kind: 'town', label: '大輪田泊' },
    { at: 'itsukushima', kind: 'flag', label: '厳島' },
    { at: 'hakata', kind: 'town', label: '博多' },
    { at: 'song', off: 1, label: '宋', note: '海の むこう' },
  ] },
  // 6-b: the capital moves toward the sea — 京 (old capital) → 福原 (new, sea-side), the sea
  // road (and off-map 宋) showing why. Reuses the ch4 sea-road grammar. 京 label goes above to
  // clear 福原's note below (the two sit close, 京 just NE of 福原).
  '6-b': { route: 'sea-road', markers: [
    { at: 'heiankyo', kind: 'town', label: '京', note: 'これまでの 都', lpos: 'above' },
    { at: 'fukuhara', cur: 1, kind: 'flag', label: '福原', note: '海の そばへ 都を 移す' },
    { at: 'song', off: 1, label: '宋', note: '海の むこう' },
  ] },
  // 6-c: the Genji rise everywhere (reveal scene). Yoritomo's red banner in Izu — the boy
  // spared in 2-c — while the eastern provinces flood with the enemy fill and the capital
  // retreats 福原 → 京 (the return itself is the text's job; the map shows the geography).
  // `contested` here means "lands answering the call to arms", the same "not the
  // protagonist's ground" red as an invasion (scene-granular, ch-territory is empty).
  // No lpos:'above' on 京: raised text lands inside the locator box in this wide view.
  '6-c': { contested: [8, 9, 10, 11, 13, 14, 19, 20, 'shimosa', 'kazusa', 'awa', 'totomi', 'suruga', 'izu'], markers: [
    { at: 'izu', kind: 'flag', enemy: 1, label: '伊豆', note: '頼朝、兵を あげる', people: ['p-yoritomo'] },
    { at: 'fukuhara', cur: 1, kind: 'flag', label: '福原', note: '半年で ついえた 都' },
    { at: 'heiankyo', kind: 'town', label: '京' },
  ] },
  // 6-d: chapter close — the sea capital lasted half a year; the court is back in 京.
  // 京 label above like 6-b (the two sit close, 京 just NE of 福原).
  '6-d': { markers: [
    { at: 'heiankyo', kind: 'town', label: '京', note: '都、もどる', lpos: 'above' },
    { at: 'fukuhara', cur: 1, kind: 'flag', label: '福原', note: '半年で ついえた 夢' },
  ] },
  // 7-a: fever strikes in 京 — the man who moved capitals is pinned to one point
  // (the 7-a2 deathbed closeup follows immediately; this map stays a quiet anchor).
  '7-a': { markers: [{ at: 'heiankyo', cur: 1, kind: 'crisis', label: '京', note: '熱病に たおれる' }] },
  // 7-b: the end at Dannoura — the same sea road the clan opened (ch4 grammar, no off-map 宋:
  // the road no longer points beyond) now carries the fall at its western end. Faces of 時子
  // and 知盛 (both die here in the text) stand at the battle; no cur marker — Kiyomori is dead.
  '7-b': { route: 'sea-road', markers: [
    { at: 'owada', kind: 'town', label: '大輪田泊', note: '清盛が ひらいた 海の 道' },
    { at: 'dannoura', kind: 'battle', label: '壇ノ浦', note: '平家、海に 消える', people: ['p-tokiko@old', 'p-tomomori'] },
  ] },
  // 7-c: the riddle's answer — quiet anchor at the journey's end (hidenaga 7-c precedent;
  // no allDots: kiyomori keeps mapPoints empty).
  '7-c': { markers: [
    { at: 'heiankyo', cur: 1, kind: 'death', label: '旅の 終わり', note: '手がかりを 思いかえそう' },
  ] },
  // 7-d: the close — both of Kiyomori's faces are later constructions; the map's last line
  // hands the answer to the reader (both label and note verbatim from the evaluated text).
  '7-d': { markers: [
    { at: 'heiankyo', cur: 1, kind: 'death', label: 'ひとりの 大きな 男', note: '正解は、ひとつじゃ ない' },
  ] },
};
