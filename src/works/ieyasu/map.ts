// Map data (skeleton stage). Adds a gaz of Ieyasu's sites on top of the shared GEO.
// All points are REAL [lon,lat] — the engine projects them via GEO.proj at render
// (engine/map/project.ts gazXY), so 江戸 (lon≈139.75) and 日光 (lon≈139.60, lat≈36.76) land at
// their true positions east/north of the legacy frame edge, and the scene-map auto-zoom + the
// content-derived locator window (locatorWindow, 2026-07-15) frame each scene around its own
// markers. Every site is domestic: research §5/§6 — this work needs NO overseas coastline art
// (none of katsu ch3's world-map fragility).
//
// The work's map signature (research §5 覚書 / design §6) is the CIRCLE: 駿府 carries both ch1
// (brought here at eight as a hostage) and ch7 (comes back as 天下人 and dies here), so the same
// gaz point returns with the person's standing inverted.
//
// SCENE_MAPS is authored WITH each chapter — the opening-anchor principle needs the scene's
// opening situation to exist first. Hand-managed (no legacy extract source).
//
// ★進軍の地図 (notebook campaign map) = FOOTPRINTS, not territory. The layer was deferred at
// skeleton time as「松平→徳川→天下 の色の移り」, and authoring it showed that the color arc is the
// one thing this work's life cannot honestly say in this data model:
//   (1) The province polygons are JIS PREFECTURES named after an old province, so 23 is 尾張 AND
//       三河 in one shape. Coloring it in ch1 would hand the boy 信長's home province; there is no
//       finer polygon to color, so the granularity itself makes the claim false (WRITING 地図書法2).
//   (2) `territory` was monotone (pref → the chapter it turns his, colored from then on), and the
//       hinge of this life is a HAND-BACK: in 1590 he gives up 三河・遠江・駿河・甲斐・信濃 and is
//       moved to 関東. A model that cannot un-color cannot draw 移封 — the very event ch4 is about.
//       (2) is SOLVED: `territory` now takes held spans `{from,to?}` (engine `ownsAt`).
//       (1) is SOLVED too: 愛知/静岡/千葉 are now real 令制国 polygons keyed by slug
//       (owari/mikawa, totomi/suruga/izu, shimosa/kazusa/awa — src/shared/geoJapan.ts).
// With both unblocked the color arc is authored below (TERRITORY): the 足あと are the line of a
// life, the color is the ground under it, and this life's ground MOVES.
/* eslint-disable */

import type {
  Geo,
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
  TerritorySpan,
} from '../../engine/types';
import { GEO } from '../../shared/geoJapan';

// ★This work's STAGE is the east. The shared GEO's ctx/non-ctx split was drawn for 秀長 (western
// and central Japan is the action; 関東 is greyed backdrop) — and it is the split the campaign map
// frames itself on (campaignViewBox) and both maps grey out. Ieyasu's world is the mirror image:
// he is born in 三河, is a hostage in 駿府, is moved to 江戸 and is enshrined at 日光, and never
// once campaigns west of 大坂. On the shared stage his whole life renders as backdrop grey and the
// notebook frame runs out to 薩摩. Geo is per work by design (engine/types.ts Geo), so the work
// ships its own — the same polygons, re-split: 摂津〜常陸 is the stage, everything west of 播磨
// (and 越前) is context that runs off the frame as land.
const STAGE_PREFS = new Set([
  '8', '9', '10', '11', '13', '14', '19', '20', '21', '24', '25', '26', '27',
  'shimosa', 'kazusa', 'awa', 'totomi', 'suruga', 'izu', 'owari', 'mikawa',
]);
export const GEO_IEYASU: Geo = {
  ...GEO,
  pref: Object.fromEntries(
    Object.entries(GEO.pref).map(([pid, o]) => [pid, { ...o, c: STAGE_PREFS.has(pid) ? 0 : 1 }]),
  ),
};

/**
 * ★色の arc — the one thing this map can say that the 足あと cannot: the ground moves.
 * Read chapter by chapter on the notebook map, the fill draws the life's shape:
 *   ch1 NOTHING — the hostage owns no land. 岡崎 is held by 今川 (1-b's own marker says so), so a
 *       colored 三河 here would hand the eight-year-old the castle the chapter is about not having.
 *       The work is the only one of the five that opens on an empty map, and that is the point.
 *   ch2 三河・遠江 — the 三方ヶ原 chapter's stake, drawn (2-b: 「ここも きみの 国」).
 *   ch3 ＋駿河 (1582, 武田 gone; given by 信長 months before 本能寺).
 *   ch4 ＋甲斐・信濃 = 東海5か国 150万石 — the figure card `w-kanto` and 4-d's body both name it.
 *   ch5 ALL FIVE GONE, 関東 instead. This is the whole reason the engine grew held spans: the
 *       west is not conquered away from him, he hands it back (返上) and is moved. A child who
 *       taps ch4→ch5 watches his country jump across the country.
 *   ch6 ＋駿河 again (1607, 大御所 として 駿府 へ): the work's 円環 in fill color — the province of
 *       the eleven hostage years, given up at ch4, is his to live in at the end.
 *
 * Granularity notes (WRITING 地図書法2 = a mark may not out-resolve what is known):
 * - The unit is the 令制国 polygon, so a province he held MOSTLY is colored whole. 信濃 is the
 *   loosest: 川中島4郡 stayed 上杉's after 天正壬午. It is colored because 東海5か国 is the framing
 *   the work's own card uses, and dropping it would make the map contradict「5か国」.
 * - 関東 is the conventional six (武蔵〔11・13〕・相模・伊豆・上総・下総・上野), NOT 関八州: 安房 is
 *   里見, 常陸 is 佐竹, and 下野 came to him only in part — all three stay uncolored, which is also
 *   what makes 240万石 look like a real, bounded grant rather than "the whole east".
 * - The swap lands BETWEEN ch4 and ch5 because territory is chapter-granular. So 4-d (the むすび
 *   where the order comes) still shows the west gold while its notes say 返上 — the map holds up
 *   what is being given away, and the next chapter opens with it gone.
 *
 * PROTAGONIST_DOMAINS stays empty: it exists for a work whose protagonist holds land INSIDE the
 * faction's (秀長's 大和・紀伊 inside 豊臣). Here the protagonist IS the house, so a gold border
 * would trace exactly the same outline the fill already draws.
 */
export const TERRITORY: Record<string, number | TerritorySpan[]> = {
  mikawa: [{ from: 2, to: 5 }],
  totomi: [{ from: 2, to: 5 }],
  suruga: [{ from: 3, to: 5 }, { from: 6 }],
  19: [{ from: 4, to: 5 }], // 甲斐
  20: [{ from: 4, to: 5 }], // 信濃
  13: 5, // 武蔵（東京）
  11: 5, // 武蔵（埼玉）
  14: 5, // 相模
  izu: 5,
  kazusa: 5,
  shimosa: 5,
  10: 5, // 上野
};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};

// ★No route line, and ch2 is the reason it stays that way. A drawn march for 信玄's 西上 was
// authored, rastered and then withdrawn on two independent counts (2026-07-16):
//
// (1) GEOMETRY. The leg that matters — 二俣 → 三方ヶ原 → past 浜松城 — runs 6〜20 map units from
//     きみ, i.e. INSIDE the ~37-unit face disc the engine floats above the current-location
//     marker. The raster showed the line vanishing behind 家康's head and re-emerging as a stub
//     across the 浜松 label, reading as「大軍が 家康に ぶつかった」= the opposite of 素通り. The
//     minimum scene frame is 392 units (~380km), so no zoom can separate a 6km gap; nothing
//     within ~40 units of きみ can be drawn at all (this is also why 長篠 never appears in 2-d).
// (2) G6. Moved to 2-a (the approach, where it cleared the face), the line then had to pick a
//     road — and the road is 諸説. 青崩峠越え is the long-standing 通説, but recent work (本多隆成
//     ほか) reconstructs 信玄's MAIN force as going south via 駿河・大井川, leaving 青崩峠 to
//     山県昌景's detachment. With 信玄's face and「二万人を こえる 兵」 standing at the line's head,
//     the map asserted the contested half. In the one chapter whose whole job is「ほめる話も
//     わらう話も、あとの世がつけ足す」, drawing an unhedged line through a live scholarly dispute
//     is the self-contradiction this work keeps having to catch itself in. A map cannot hedge —
//     it has no place for「と 伝わる」— so the honest move is to draw only what is not disputed:
//     the 二万 came out of 甲斐, and they are east of you. That is what 2-a's flag says.
//     (research §5 has no march route at all; the citation the withdrawn line carried was broken.)
export const ROUTES: Record<string, RouteDef> = {};
export const CAMPAIGN_ROUTES: CampaignRoute[] = [];

// ONE phase, not the 松平→徳川→天下 flip the skeleton sketched. Two reasons, and both are the
// legend: (a) the engine lists EVERY phase reached so far, while it paints only the last one — a
// second color would leave a swatch in the key for a color the map no longer draws anywhere;
// (b) this life's change is not whose colors he wears but WHERE the color sits, and one fill makes
// the 1590 jump read as the same house moving rather than a different house appearing.
// The 松平 era would have been ch1, and ch1 owns nothing.
export const FACTION_PHASES: FactionPhase[] = [
  { fromCh: 2, color: 'var(--map-faction-a)', legend: '徳川の 領地（その 章の ころ）' },
];

// Province names for the stage — the ring of country AROUND the footprints. A label is drawn at its
// polygon's fixed centroid, so a province whose centroid sits under a mark is left unlabeled rather
// than blotted (raster check 2026-07-23): 愛知 under 岡崎, 静岡 under 駿府, 栃木 under 日光, 大阪
// under 大坂城 — in every one of those the mark's own label already names that ground better than
// the prefecture could (愛知 = 尾張 AND 三河 in one shape, the ambiguity in the header). 埼玉 is
// dropped too: the shared geo names it 武蔵 as well, and the 武蔵 a reader needs is the one over
// 江戸. 千葉 is dropped for crowding — 江戸・武蔵・相模 already carry the Kanto plain.
export const MAPLABELS: Record<string, string> = {
  26: '山城', 25: '近江', 21: '美濃', 24: '伊勢', 19: '甲斐', 20: '信濃',
  14: '相模', 13: '武蔵', 10: '上野', 8: '常陸',
};

/** Sites of Ieyasu's life, REAL [lon,lat] (research §5). */
export const GAZ: Record<string, GazPoint> = {
  // 三河・尾張 — birth, hostage years, the break with 今川 (ch1).
  okazaki: { lon: 137.1594, lat: 34.9575 },      // 岡崎城 = 生誕地／桶狭間の後に入った城
  atsuta: { lon: 136.9075, lat: 35.1275 },       // 熱田(尾張) = うばわれて 過ごした 二年
  odaka: { lon: 136.9247, lat: 35.0631 },        // 大高城 = 桶狭間の日、きみが 兵糧を 入れて いた 場所
  okehazama: { lon: 136.9736, lat: 35.0578 },    // 桶狭間 = 義元 討死（きみは 本戦に いない）
  kiyosu: { lon: 136.8419, lat: 35.2003 },       // 清洲城 = 信長との 同盟の 名の 由来
  // 駿河 — the circle: hostage (ch1) → 大御所として死ぬ地 (ch7).
  sunpu: { lon: 138.3833, lat: 34.9758 },        // 駿府 = 十一年の 人質時代、そして 死の 地
  kunozan: { lon: 138.4681, lat: 34.9633 },      // 久能山東照宮 = 最初に まつられた 地
  // 遠江・甲斐 — the great defeat (ch2 = pilot).
  hamamatsu: { lon: 137.7256, lat: 34.7108 },    // 浜松城 = 出た 城／逃げ帰った 城
  mikatagahara: { lon: 137.7089, lat: 34.7625 }, // 三方ヶ原 = 生涯 最大の 大敗
  kai: { lon: 138.5747, lat: 35.6803 },          // 甲斐・躑躅ヶ崎館 = 武田の 本国（東の 極）
  nagashino: { lon: 137.5583, lat: 34.9186 },    // 長篠城 = 武田を 破りかえす 戦い
  // 上方 → 三河 — the escape (ch3).
  honnoji: { lon: 135.7517, lat: 35.0117 },      // 本能寺 = 信長 討たれる
  sakai: { lon: 135.4694, lat: 34.5733 },        // 堺 = 変を 知った とき きみが いた 場所
  koga: { lon: 136.1653, lat: 34.9661 },         // 甲賀 = 起請文が 残る 側（甲賀経由説・研究§3-11）
  iga: { lon: 136.2669, lat: 34.8397 },          // 伊賀 = 伝統の「伊賀越え」の 名の 地
  // 「山の 中」(3-c) = the 伊賀・甲賀 border massif: the one ground BOTH reconstructions of the escape
  // share. research §3-11 puts the 甲賀経由説 (藤田達生) through 甲賀郡 and out 「伊賀国境の柘植へ」,
  // and the traditional 伊賀越え over 御斎峠・桜峠 — which are passes ON that same border. Whichever
  // road he took, he crossed this ridge. The point is placed where the province boundary crosses the
  // 甲賀→伊賀 line in this repo's own polygons (~2km from 柘植), NOT by averaging the two districts:
  // an arithmetic mean of two hypotheses is a method that would assert a third road anywhere the
  // zoom could resolve it, and it also landed (measurably) inside 近江 = the 甲賀 side.
  //
  // ★Why a pin here asserts nothing, and the measurement that decides it. 伊賀 and 甲賀 project
  // 17.37 units apart. At 3-c's floor zoom (sc=0.392) the engine's own current-location ring
  // (`scur-ring` r=24, scaled) is 18.82 units ACROSS — きみ's ring is wider than the entire dispute,
  // and both districts fall inside it. A mark can only assert what it can resolve; this one covers
  // the whole disagreement, so the map is silent about which road, and silence is not assertion.
  // The note then states the dispute as the scene's content (「通った 道は、わかって いない」 — the
  // body's own 「じつは、よく わかって いない」), which is a fact, not a hedge on a claim the map makes.
  // This is the ch2 law (a map cannot hedge) stated properly: the bound variable is not line-vs-point
  // but RESOLUTION vs DISPUTE WIDTH. ch2's march was 100+ units and resolved, so it asserted; this
  // pin does not. Note that 3-b and 3-d DO draw 伊賀 and 甲賀 as separate markers at the same zoom —
  // they are only unnameable when きみ is standing on top of them, which is 3-c alone.
  yama: { lon: 136.2486, lat: 34.8625 },
  shirako: { lon: 136.5875, lat: 34.8461 },      // 伊勢・白子 = 海路で 三河へ わたった 港
  // 秀吉の時代 (ch4).
  nagakute: { lon: 137.0475, lat: 35.1836 },     // 長久手 = 秀吉と 渡り合った 戦場
  osaka: { lon: 135.5258, lat: 34.6873 },        // 大坂城 = 頭を 下げた 場所、のちに せめる 城
  odawara: { lon: 139.1531, lat: 35.2506 },      // 小田原城 = この 陣中で 関東への 移封が 決まる
  edo: { lon: 139.7528, lat: 35.6852 },          // 江戸城 = 移された 先（当時は 未開発）
  // 天下分け目 (ch5) と 主家の 終わり (ch6).
  sekigahara: { lon: 136.465, lat: 35.3661 },    // 関ヶ原 = 一日で 決した 戦場
  fushimi: { lon: 135.7781, lat: 34.9375 },      // 伏見城 = 秀吉が 死んだ 城／元忠が 守って 落ちた 城
  akasaka: { lon: 136.583, lat: 35.386 },        // 美濃・赤坂(岡山本陣) = 決戦 前夜の きみの 陣
  // 秀忠の 本隊 (5-b): the pin is mid-Kiso (木曽福島), and its granularity is the record's. His
  // 9/14 position is not documented to a town, but every account — both the 真田 tale the 5-d
  // deep marks as embellished AND the late-order reading it favors — has the 38,000 on the
  // 中山道 through the Kiso mountains, between 上田 (where the delayed order found him) and 大津
  // (reached 9/20). At 5-b's sc≈.48 the flag icon plus label covers the whole plausible day's
  // stretch of that road, so the mark resolves nothing finer than what is known (WRITING 地図
  // 書法2: a mark may not out-resolve the record). NOT pinned at 上田 on purpose: an 上田 pin
  // would re-draw the「真田に 足止めされた」story as the reason he is missing.
  kiso: { lon: 137.6947, lat: 35.8475 },
  houkouji: { lon: 135.7719, lat: 34.9911 },     // 方広寺(京) = 鐘の 四文字が 戦の 口実に
  // 死後の 地理（研究§5）— 生涯の 動線とは 別の、神格化の 地図.
  nikko: { lon: 139.5989, lat: 36.758 },         // 日光東照宮 = 神と して まつられた 地
};

/**
 * 足あと — the numbered marks the notebook map reveals chapter by chapter, ONE line of a life:
 * 岡崎に 生まれ → 駿府に 人質 → 三方ヶ原 → 白子から 船で 帰る → 江戸へ 移される → 関ヶ原 → 大坂 →
 * 日光. Coordinates come from GAZ so a site cannot drift between the scene maps and this one.
 *
 * Choices worth keeping (the frame is ~95 units per degree of longitude, and a mark is a r=14 dot
 * with a label above it, so two marks nearer than ~40 units collide into an unreadable blot):
 * - ch3 pins 白子 alone. 堺 (where he heard) sits 14 units from 大坂 = ch6's mark, and the road
 *   between them is the one this chapter refuses to draw (伊賀越えか 甲賀か = 諸説, gaz header).
 *   The port he sailed home from is undisputed, and「船で 帰った」is itself the surprise.
 * - ch4 pins 江戸 alone. 長久手 is 28 units from 岡崎 (ch1) — and the chapter's spine is the move
 *   east, not the battle it opens with.
 * - ch7 pins 日光, not 久能山 (8 units from 駿府) — and the work's 円環 (駿府 twice: hostage, then
 *   死の地) cannot be two dots on one point. The scene maps carry the ring (7-a); here 駿府 is
 *   mark 2 and the chapter caption says he came back to it.
 */
export const MAPPOINTS: MapPoint[] = [
  { n: 1, ch: 1, id: 'okazaki', ...GAZ.okazaki, label: '岡崎', sub: '生まれた 城' },
  // 「六さい」は岡崎を出た年（1-a）で、駿府に着いたのは織田に二年うばわれた後＝八さい。この点の
  // sub に 六さい＋十一年 を並べると引き算が合わない（/eval-work factcheck 2026-07-23）。
  { n: 2, ch: 1, id: 'sunpu', ...GAZ.sunpu, label: '駿府', sub: '八さいから 十九さいまで 人質' },
  { n: 3, ch: 2, id: 'mikatagahara', ...GAZ.mikatagahara, label: '三方ヶ原', sub: '生涯 最大の 大敗' },
  { n: 4, ch: 3, id: 'shirako', ...GAZ.shirako, label: '白子', sub: '船で 三河へ 帰った 港' },
  { n: 5, ch: 4, id: 'edo', ...GAZ.edo, label: '江戸', sub: '関東へ 移された 先' },
  { n: 6, ch: 5, id: 'sekigahara', ...GAZ.sekigahara, label: '関ヶ原', sub: '天下 分け目の 一日' },
  { n: 7, ch: 6, id: 'osaka', ...GAZ.osaka, label: '大坂城', sub: '主家が 終わった 城' },
  { n: 8, ch: 7, id: 'nikko', ...GAZ.nikko, label: '日光', sub: '神と して まつられた 地' },
];

// Per-scene maps are authored together with each chapter (see header). Chapters with no entry here
// fall back to their default location (= CHAPTER_POINTS).
//
// Chapter 一 (人質の 子) = the work's 往還 grammar (design §2 章カルテ: 「地図（三河⇔駿府の人質往還）」).
// Read in order, the five maps trace the round trip the boy does not choose: 岡崎を出る → 駿府 →
// 駿府で十一年 → 大高（桶狭間の日）→ 岡崎へ帰る. The chapter's 東(今川)/西(織田) poles and the
// occupation of 岡崎 are geography, so the map carries them — the body cannot (章一 spends 987/1000
// of its budget, and the /eval-work 小5 persona reported it could not follow "why was 今川's army in
// the castle he was born in" from the body alone). WRITING 書法7 = the chapter's load is carried by
// something other than prose.
//
// Opening-anchor principle (codified 2026-07-14): a scene map is an establishing shot read with the
// body, so it anchors to the scene's OPENING situation, never its ending (exception: riddle / reveal
// / むすび may voice the forward pull). So 1-a does NOT draw the 往還 as a route line — that the boy
// is seized on the road and goes WEST first is the scene's twist. Notes/labels stay ruby-free-readable
// (the map has no ruby): 兵糧・人質・城代 are delivered by the body with ruby, so the notes take the
// readable half of the same line (codified across katsu ch1「旗本→侍」/ ch2「格式→身分」/ ch4).
export const SCENE_MAPS: Record<string, SceneMapDef> = {
  // 1-a: the six-year-old leaves. The establishing shot IS the chapter's premise: 岡崎 is a small
  // castle wedged between two big houses (body: 「東に 今川、西に 織田。にらみ合う 大きな 二つに
  // はさまれ」). Poles are enemy flags (kiyomori's 勢力 grammar) — neither is きみの家, and the flag
  // reads as "a big house's power" rather than a town きみ might visit. They carry 2-char labels and
  // no notes; 駿府 (far east, isolated) can afford the note that names the opening premise.
  // 織田 is pinned at 清洲, NOT at 熱田 (where the seized boy was actually held): 熱田 sits ~24 map
  // units west of 岡崎, i.e. under the 家康 face that floats above the castle — the raster self-check
  // left its label 1 unit from the face circle. 清洲 is 30 units away and diagonal, so the flag and
  // label sit clear. It also reads truer here: the flag marks the HOUSE, and 清洲 was an 織田 castle
  // across the whole chapter (信長's own seat from 1555, hence 桶狭間 and the later 清洲同盟), whereas
  // 熱田's meaning — the two stolen years — is 1-a's twist and must not be pre-drawn.
  '1-a': { markers: [
    { at: 'okazaki', cur: 1, kind: 'castle', label: '三河・岡崎', note: '六さいで、この 城を 出る' },
    { at: 'kiyosu', enemy: 1, kind: 'flag', label: '織田' },
    { at: 'sunpu', enemy: 1, kind: 'flag', label: '今川', note: 'あずけられる 先' },
  ] },
  // 1-riddle: a bare quiet anchor at 駿府 — where 1-a has just deposited きみ (katsu 1-riddle
  // precedent: label only, no note). The riddle's question — a 律儀者 who destroys his lord's house,
  // 250 years of 神君 image — is the body's job; a map that voiced it would be showing an ending
  // (the 2-a failure codified 2026-07-14).
  '1-riddle': { markers: [
    { at: 'sunpu', cur: 1, kind: 'town', label: '駿府' },
  ] },
  // 1-b: the eleven years. 駿府 is a town, not a cage — the scene peels the 「悲惨な人質」 image, so
  // the map shows the bigger town (body verbatim) with 義元 standing in it (his card is granted here;
  // katsu 4-a's 龍馬 precedent = the person the scene turns on keeps his face on the map). 岡崎 is on
  // the map in the other side's color with the deep panel's line 「帰る 城は 今川の 家来が 使い」:
  // that single marker is what the 小5 persona needed to follow ch1's geography — きみ's own castle is
  // held by 今川 while he lives at their capital, which is why 今川's soldiers are in it at 桶狭間 and
  // why walking into it (1-c) is a break with 今川 rather than just coming home.
  '1-b': { markers: [
    { at: 'sunpu', cur: 1, kind: 'town', label: '駿河・駿府', note: '岡崎より ずっと 大きな 町', people: ['p-yoshimoto'] },
    { at: 'okazaki', enemy: 1, kind: 'castle', label: '三河・岡崎', note: '今川の 家来が 使って いる' },
  ] },
  // 1-c: the fork's stake triangle, all three points true at the scene's OPENING (no resolution:
  // 桶狭間 itself and the empty castle are the scene's ending, so neither is drawn — 2-b/3-b/4-b/5-b
  // precedent). きみ is at 大高 doing the most dangerous job; the castle he cannot enter is held by
  // 今川; his wife and son are at the far end of the map. That is the choice, drawn: 城 or 妻子 —
  // and it is the price tag the canon hist body puts on independence (「二年、妻子を 敵地に 残す」).
  // 大高's label goes 'above' (over the face): 大高 and 岡崎 are ~25 units apart, so its default
  // below-icon note would run straight through 岡崎's label. Note keeps the body's readable half
  // (「いちばん 危ない 役だ」) — 兵糧 needs ruby, which a map cannot give.
  '1-c': { markers: [
    { at: 'odaka', cur: 1, kind: 'castle', label: '大高城', note: 'いちばん 危ない 役', lpos: 'above' },
    { at: 'okazaki', enemy: 1, kind: 'castle', label: '岡崎', note: '今川の 兵が いる' },
    { at: 'sunpu', enemy: 1, kind: 'town', label: '駿府', note: '妻と 子が いる' },
  ] },
  // 1-d: むすび — an ending is allowed here (opening-anchor exception). The round trip closes where
  // 1-a opened, on the same castle icon with the ring now on it: 十三年ぶり. But 駿府 stays on the
  // map, and its note is the chapter's refusal to read as a hero's origin — the wife and son are
  // still there, and stay for two more years (the canon hist body). The map bookends 1-a's 「六さいで、
  // この 城を 出る」 with 「十三年ぶりに、帰った」, and hands 駿府 forward to 終章, where the same gaz
  // point returns with the man's standing inverted (design §6 の駿府の円環).
  '1-d': { markers: [
    { at: 'okazaki', cur: 1, kind: 'castle', label: '三河・岡崎', note: '十三年ぶりに、帰った' },
    { at: 'sunpu', enemy: 1, kind: 'town', label: '駿府', note: '妻と 子は、まだ そこに' },
  ] },

  // Chapter 二 (三方ヶ原の 大敗). The chapter's device is the closeup + the confidence marks (design
  // §2 章カルテ), NOT the map — so these three maps do one job only: hold the geography the fork
  // rests on. 2-c has no entry because it IS the closeup (対面の場).
  //
  // ★The scale constraint that shaped every choice here: 浜松城 and 三方ヶ原 are 6 map units apart
  // (5.7km) and the scene map's minimum frame is 392 units (~380km). The plateau the whole chapter
  // turns on CANNOT be a second marker — its icon and label land inside 家康's face circle. Nothing
  // within ~40 units of きみ can be drawn at all, which is also why 長篠 never appears. The chapter
  // that happens 6km from home is, on a national map, a chapter that happens in one place.
  //
  // 2-a: the opening paragraph, drawn — きみ in the middle, 織田 west, 二万 east. It also inverts
  // 1-a's shot: the same 織田 flag that stood red at 清洲 over the six-year-old's road is gold now
  // (the flag marks the HOUSE, so 清洲 is right across both chapters, and the child sees the enemy
  // of ch1 become the ally of ch2 without a word of body text). 信玄 keeps his face on the flag —
  // the person the scene turns on stands on the map (1-b's 義元, katsu 4-a's 龍馬), his card is
  // granted in this very scene, and a face makes「二万」 a man rather than a weather event
  // (VISION 原則4「敵にも声を」). 岡崎 is left off — the labels 三河・岡崎 (ch1) → 遠江・浜松城
  // (ch2) carry the move on their own, and 岡崎's note collides with 浜松's label at this zoom.
  // It returns in 2-b, where being きみの国 is what the march threatens.
  '2-a': { markers: [
    { at: 'hamamatsu', cur: 1, kind: 'castle', label: '遠江・浜松城', note: 'きみの 城' },
    { at: 'kiyosu', kind: 'flag', label: '織田', note: '手を 組んで いる' },
    { at: 'kai', enemy: 1, kind: 'flag', label: '武田', note: '二万人を こえる 兵', people: ['p-shingen'] },
  ] },
  // 2-b: the fork's premise. The 素通り cannot be drawn (see the ROUTES note), so the notes carry it
  // and the map's job is the stake: 岡崎 with 「ここも きみの 国」 is what gives the young 家臣's
  // anger its ground (「目の 前を ふみにじられて 出ぬ 主の ために、だれが 命を かけましょう」 — it is
  // きみの国 being walked through, and there is more of it ahead, in the direction they are walking).
  // The 武田 flag stays at 甲斐 — flags mark the house, not the army's position (1-a's grammar) — so
  // the map never claims 信玄 is home while the body has him outside the wall.
  //
  // ★Both notes name their subject, and that is a correction, not a style choice. The first draft
  // wrote 浜松's note as the body's own line minus its subject —「城を 見ずに、西へ 通りすぎて いく」—
  // and the /eval-work 小5 (image only, no body) read it as 家康 doing the walking:「家康が 自分の 国
  // から 出発して、浜松城の そばを 素通りして 西へ 進んで いる」= the scene inverted. A note sits under
  // きみ's face, and きみ is the only agent drawn, so an unsubjected verb attaches to きみ. On a map,
  // the body's economy is a trap: the sentence that reads fine under a paragraph reads backwards
  // under a portrait. 甲斐's note says where the 二万 came FROM, so the flag is not mistaken for
  // where they are now.
  '2-b': { markers: [
    { at: 'hamamatsu', cur: 1, kind: 'castle', label: '遠江・浜松城', note: '武田の 二万人が、城を 見ずに 西へ' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: 'ここも きみの 国' },
    { at: 'kai', enemy: 1, kind: 'flag', label: '武田', note: '二万人は、この 国から 来た' },
  ] },
  // 2-d: むすび — the forward pull is allowed here (opening-anchor exception), and the chapter's
  // irony needs it. The line is gone, the castle still stands with きみ in it, and the 武田 flag is
  // still east: what actually saved 遠江 was not the choice きみ made but 信玄's illness — which is
  // exactly what the もしも branch says (「待って さえ いれば、敵の ほうが 先に 消えた」). The note
  // says 「やがて 東へ 帰って いく」 and NOT 「信玄は ここで 死ぬ」: he died on the road in 信濃, and a
  // note under 甲斐 would put the death in the wrong place (the body's creed act carries it).
  // 長篠 is deliberately absent — 28 units from 浜松, its icon would sit inside 家康's face.
  '2-d': { markers: [
    { at: 'hamamatsu', cur: 1, kind: 'castle', label: '遠江・浜松城', note: '負けた。城は、まだ ある' },
    { at: 'kai', enemy: 1, kind: 'flag', label: '武田', note: 'やがて、東へ 帰って いく' },
  ] },

  // Chapter 三 (伊賀を こえて). design §2 names this chapter's device 「★ルート選択地図」 — and the
  // route line is the one thing it must not draw. Which road he took is the chapter's whole
  // argument (3-b carries no canon and stamps both branches 「△」), so a line would settle, in
  // gold, the dispute the fork exists to keep open. ch2 withdrew a march for the same reason; here
  // the constraint was known before a stroke was authored. What replaces the line is the thing a
  // fork can be drawn as WITHOUT choosing: the poles, with their price tags, and the shared goal.
  //
  // These four maps also pay off a debt the body cannot: both /eval-work personas reported picking
  // a road without knowing where 伊賀・甲賀・伊勢 were (the chapter spends 997/1000 of its budget,
  // so there is no room to say it in prose — WRITING 書法7, the same 「eval の宿題を地図が引き取る」
  // shape as ch1).
  //
  // ★The 17-unit problem, and why lpos is doing so much work here. 伊賀 (726.9,250.5) and 甲賀
  // (717.3,236.1) project 17.4 units apart — at the scene map's floor zoom (frame 392 units, note
  // glyphs ~7.7 units wide) a 7-character note is ~54 units wide, i.e. THREE TIMES the gap between
  // the two districts. Stacked by default (label at +9.5, note at +18) the upper marker's note
  // lands on the lower marker's label every time. So 甲賀 escapes upward (lpos 'above') in both
  // maps that name both roads, which buys ~24 units of clear air; 伊勢 (30 units due east of 伊賀,
  // same latitude) escapes upward too, and its label stays 2 characters so it clears 甲賀's note.
  // Geometry verified numerically against buildSceneMap's own layout constants, then rastered.
  //
  // 3-a: the premise, drawn — きみ at 堺 with no army, and the man who invited him 57 units away at
  // 京, ALIVE. That is the opening-anchor principle at its most load-bearing: the scene's ending is
  // 信長's death, and the reveal (p-nobunaga@fall) is what delivers it, so the map must show the
  // world as it stood that morning or it spoils its own crisis. 信長 keeps his face (1-b's 義元,
  // 2-a's 信玄: the person the scene turns on stands on the map) and his card is granted in ch1, so
  // the face is tappable. The note names the RELATIONSHIP rather than repeating what the face
  // already says — twenty years of alliance is the thing the reveal takes away.
  '3-a': { markers: [
    { at: 'sakai', cur: 1, kind: 'town', label: '和泉・堺', note: '旅の とちゅう。いくさの したくは ない' },
    { at: 'honnoji', kind: 'town', label: '京', note: '二十年、手を 組んで きた 人', people: ['p-nobunaga'], lpos: 'above' },
  ] },
  // 3-b: the fork, drawn as poles. 甲賀 is north and far, 伊賀 is straight east and near — which is
  // exactly what the two voices say (半蔵「まっすぐ 東…いちばん 近い」/ 年かさの家臣「北へ まわり…遠い」),
  // and the map is what makes those words mean anything to a child who has never seen these names.
  // Both roads end at the same port, so 伊勢 and 三河・岡崎 are the shared half of the picture: the
  // choice is which mountains, not where to.
  //
  // ★半蔵 is deliberately NOT on this map, though his card is granted in this very scene and every
  // precedent says the scene's pivotal person gets a face. Two reasons, and both are the chapter:
  // (1) he argues FOR 伊賀 while the counter-voice has no card, so a face at 伊賀 would put a
  // portrait's worth of weight on one arm of a fork whose whole design is that neither side is
  // canon (register rule 岐路は両側に声を立てる — the map would break the balance the body keeps);
  // (2) 服部半蔵 standing on 伊賀 is a picture of the 伊賀者 legend that 3-c exists to peel (the deep:
  // the tale was written by the 伊賀者 themselves, 140 years later, and 半蔵 was born in 三河). The
  // map would re-assert the myth one scene before the body debunks it.
  '3-b': { markers: [
    { at: 'sakai', cur: 1, kind: 'town', label: '和泉・堺' },
    { at: 'koga', kind: 'village', label: '甲賀', note: '北の 道。遠い', lpos: 'above' },
    { at: 'iga', kind: 'village', label: '伊賀', note: 'まっすぐ 東。近い' },
    { at: 'shirako', kind: 'town', label: '伊勢', note: '船で 三河へ', lpos: 'above' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: '帰る 先' },
  ] },
  // 3-c: the loneliest map in the work, and the only one whose subject is what is not known. きみ
  // sits at 山の 中 (the border massif both roads cross — see the gaz for the measurement that makes
  // this pin silent rather than assertive), and the note says the thing the scene says (「じつは、
  // よく わかって いない」). 伊賀 and 甲賀 are NOT drawn, and the occluder is NOT the face disc — the
  // face floats ABOVE the marker (m.y-40 … m.y-10) while 伊賀 sits at m.y+7.2 and 甲賀 at m.y-7.2,
  // i.e. clear of it. What actually swallows them is きみ's own current-location ring (r=9.41 > their
  // 8.68 offsets) and the label/note stack directly below the pin (m.y+9.4 / m.y+17.6). The ch2
  // constraint lands here as a gift either way: this scene's two roads are unnameable precisely
  // because きみ is standing on them, which is exactly the state of the record.
  // The note's missing subject attaches to きみ (ch2's 2-b law), and that is correct
  // here: it is HIS road that is unknown. 岡崎's note is 「まだ 遠い」 rather than 3-b's 「帰る 先」 —
  // the same marker, but this scene's feeling is the distance, not the destination (and verbatim
  // repetition across scenes is what the 通し離脱テスト calls the dullest thing in the work).
  '3-c': { markers: [
    { at: 'yama', cur: 1, label: '山の 中', note: '通った 道は、わかって いない' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: 'まだ 遠い' },
  ] },
  // 3-d: むすび — an ending is allowed (opening-anchor exception), and here the ending is a pair of
  // facts about paper. This is the chapter's best sentence, drawn: 「名前は 伊賀に つき、紙は 甲賀に
  // 残る。どちらが きみの 道かは、いまも わかって いない」. The two notes say what SURVIVED on each
  // road, which is exactly the register the /eval-work G6 round forced the body into — 「名前が
  // ついた 道」 and 「紙が 残った 道」 are claims about the record, not about きみ's route, so the map
  // can carry them at full confidence without settling anything. A map cannot hedge; it turns out
  // it does not have to, if what it states is the evidence rather than the conclusion.
  //
  // ★That is the general move, and it is worth naming because it is the only way this work has found
  // to put a live dispute on a map: 3-b/3-d resolve 伊賀 and 甲賀 as separate marks (unlike 3-c), so
  // here the map CAN assert — and would, if the notes named a road. Shifting the register from the
  // conclusion (which road) to the evidence (what each road's record holds) lets a mark that resolves
  // the dispute still decline to settle it. Where a map resolves a dispute, state the evidence, not
  // the verdict.
  // 岡崎 closes the chapter the way 1-d closed ch1: same castle, ring on it, one note.
  '3-d': { markers: [
    { at: 'okazaki', cur: 1, kind: 'castle', label: '三河・岡崎', note: '生きて 帰った' },
    { at: 'koga', kind: 'village', label: '甲賀', note: '紙が 残った 道', lpos: 'above' },
    { at: 'iga', kind: 'village', label: '伊賀', note: '名前が ついた 道' },
  ] },

  // Chapter 四 (頭を 下げる). The chapter's device is the 大広間 closeup (4-c2) plus the ☆ debunk
  // in the deep — so, as in ch2, the maps hold only the geography the drama rests on. That
  // geography IS the chapter's arc: きみ fights in the west (4-a), is squeezed at home by
  // departures and arrivals (4-b), stands alone in the other house's capital (4-c), and ends
  // furthest east the ring has ever stood (4-d). 4-c2 has no entry because it IS the closeup
  // (2-c precedent); its fallback pin is CHAPTER_POINTS[4] = osaka — exactly where the 大広間 is.
  //
  // ★What 4-a cannot draw: the 小牧・長久手 theater itself. 岡崎 (27.9u), 清洲 (19.6u), 大高/桶狭間
  // (16〜18u) all sit inside the ~40-unit face disc around きみ at 長久手 — 信雄's own seat, whose
  // takeover the body narrates, is under 家康's face. The 羽柴 flag at 大坂 carries the takeover
  // instead, which is also truer to scale: the opponent is not a neighboring castle but the machine
  // swallowing 信長's whole legacy.
  //
  // 4-a: opening = deployment, not victory. きみ stands on the 長久手 field (battle icon = the war
  // footing para 2's 「兵を 出した」 sets up; the win and 信雄's separate peace are the scene's
  // endings and stay off the map). 秀吉 keeps his face on the flag — his card is granted this scene
  // (1-b 義元 / 2-a 信玄 / 3-a 信長 precedent), and a face makes the takeover a person rather than
  // an event (VISION 原則4). 浜松 (84u, clear) anchors where きみ came from; its note varies 2-a's
  // 「きみの 城」 — verbatim repetition across scenes is the 通し離脱テスト's dullest thing. Both
  // long notes deliberately open with 信長の — everything on this map is the dead man's world
  // being carved up.
  '4-a': { markers: [
    { at: 'nagakute', cur: 1, kind: 'battle', label: '尾張・長久手', note: '信長の 子に たのまれ、兵を 出した' },
    { at: 'hamamatsu', kind: 'castle', label: '遠江・浜松城', note: '出て きた 城' },
    { at: 'osaka', enemy: 1, kind: 'flag', label: '羽柴', note: '信長の 城も 家来も、自分の ものに', people: ['p-hideyoshi'] },
  ] },
  // 4-b: the 包囲 drawn as a ledger — what left きみ and what was sent in, each fact anchored where
  // the body puts it: the son and the 家老 at the 羽柴 flag (走った = the body's own verb; WHY 数正
  // ran is 諸説, so the note states the departure, never a motive — a map cannot hedge), the
  // sister-wife at 浜松, the mother at 岡崎. The two 来た notes are the body's own escalation
  // ladder (妹が 来た → 母まで 来た), and both name 秀吉 as the possessor: the image-only 小5 read
  // 「四十四の 妹」 as possibly きみの妹 (the 2-b lesson one step out — under きみ's face even a
  // named subject attaches to きみ unless its owner is said), so the map carries WHOSE family is
  // arriving and leaves the age — the sting — to the body's 「四十四に なる 妹・朝日姫」. Notes
  // name their subjects (2-b law). 岡崎's note is capped at 8 glyphs + 2 spaces (68.9u): its lane
  // ends 4.4u short of 家康's face disc (x 845.9 vs 850.3 at sc .3925) — the same lane 2-b's
  // 「ここも きみの 国」 lived in. 秀吉's face is not repeated after 4-a (2-a→2-b precedent), and
  // the fork's two speak-voices are anonymous retainers with no cards — the split is the body's job.
  '4-b': { markers: [
    { at: 'hamamatsu', cur: 1, kind: 'castle', label: '遠江・浜松城', note: '秀吉の 妹が、妻に 来た' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: '秀吉の 母まで 来た' },
    { at: 'osaka', enemy: 1, kind: 'flag', label: '羽柴', note: '次男を あずけ、家老は 走った' },
  ] },
  // 4-c: きみ alone in the other house's capital, the night before the 大広間. Two markers, like
  // 3-a. The ring's note is the lodging (para 1 = the opening); the night visit is the scene's
  // event and 4-c2's closeup owns the 対面, so no 秀吉 face here and nothing of the visit is
  // pre-drawn. 岡崎 holds the counter-pledge — the mother stays east while きみ is west, and the
  // pair of notes lets a child read the deal (his safety against hers) without a word of
  // explanation. あずかって いる's unnamed keeper is the castle the note sits under, i.e. きみの家
  // — which is the fact. 家 not 屋敷 in the cur note: 敷 has no elementary reading and the map
  // cannot give ruby (notes take the readable half — katsu 旗本→侍 precedent).
  '4-c': { markers: [
    { at: 'osaka', cur: 1, kind: 'town', label: '大坂', note: 'とまるのは、秀吉の 弟の 家' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: '秀吉の 母を、あずかって いる' },
  ] },
  // 4-d: むすび — the ending is allowed (opening-anchor exception), and this ending is a trade at
  // map scale: two pale markers west (the ancestral country and the hostage town, both handed
  // back) and the ring standing at 江戸. 左遷か栄転か is a live dispute the deep holds open, so the
  // notes state evidence, not the verdict (3-d's register): what was given (返上), what was done
  // (言われた とおり、移った — the 律儀 thread; what obeying here was worth is the reader's call).
  // No 羽柴 flag: adding 大坂 stretches bw to ~585u and the grown glyphs (sc .585) close the 116u
  // 駿府—岡崎 gap, so the order-giver stays in the body. 小田原 (75u from 江戸) is likewise off —
  // the map's one job is the exchange, not the campaign that opened the vacancy. 駿府's note hands
  // the work's circle forward: the town of the eleven hostage years, given up here, returns in
  // 終章 as the place he comes back to die (gaz header / design §6).
  '4-d': { markers: [
    { at: 'edo', cur: 1, kind: 'town', label: '江戸', note: '言われた とおり、移った' },
    { at: 'sunpu', kind: 'town', label: '駿河・駿府', note: '十一年 いた 町も、返上' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: '先祖 代々の 国を、返上' },
  ] },

  // Chapter 五 (天下 分け目). The chapter's device is the 布陣 board on 5-c — this work's first
  // figure (figures.ts), NOT a map: at floor zoom the whole theater sits inside the face disc
  // (赤坂→大垣 3.9u, 関ヶ原→松尾山 ~3u, →南宮山 ~7u), so the climax picture lives in figure
  // coordinates, and these three maps hold the strategic geography instead — the dead man's
  // castle in the west, きみの国 a map-width east, and the missing 本隊 in the mountains between.
  //
  // 5-a: the opening premise, drawn — きみ stands in the castle where 秀吉 died, and his own
  // country is at the far edge of the frame. 大坂 CANNOT be drawn (37u from 伏見 = inside the
  // face disc), and leaving it off is also the record's grain at the scene's opening: in August
  // 1598 the boy heir was still AT 伏見, and moved to 大坂城 only that winter — a 大坂 pin would
  // paint the scene's later months over its first morning. 江戸's note names its possessor
  // (2-b/4-b law), and the two notes together are the political geometry the confrontation
  // rests on: the biggest 大老 runs the dead man's politics from the dead man's castle, a
  // country's width from home.
  '5-a': { markers: [
    { at: 'fushimi', cur: 1, kind: 'castle', label: '伏見城', note: '秀吉が 死んだ 城' },
    { at: 'edo', kind: 'town', label: '江戸', note: 'きみの 国' },
  ] },
  // 5-b: the squeeze at 赤坂, drawn as three distances. Ahead: 大垣城 is 3.9 units away — UNDER
  // きみ's face — so the cur note carries it (an in-disc fact carried by the note is the 2-b
  // pattern; 目の 前 is the body's own word, and under きみ's face that perspective correctly
  // attaches to きみ). The note NAMES 大垣城: with the referent unnamed (「目の 前の 城」), the
  // raster self-check read it against the only castle icon drawn — 伏見城, far southwest — so
  // the referent law is the 2-b/4-b subject law one step further: under きみ's face, even a
  // correct note attaches to the wrong THING if the thing is not named (the body rubies
  // 大垣城 twice, so the map takes the name). Behind-west: 伏見, fallen, its note naming who died
  // holding it (subject law). East: 秀忠's gold flag on the 中山道 (non-enemy flag = 味方, the
  // 2-a color code; the flag marks the HOUSE's own 本隊, and this map's whole subject is that
  // the house's army is not where the house's head stands). See the kiso gaz note for why the
  // pin resolves nothing finer than the record. 関ヶ原 itself is absent: the armies move there
  // in the night, which is the fork's resolution (hist body), not its opening.
  '5-b': { markers: [
    { at: 'akasaka', cur: 1, label: '美濃・赤坂', note: '目の 前の 大垣城に、西軍' },
    { at: 'fushimi', enemy: 1, kind: 'castle', label: '伏見城', note: '守った 元忠は、死んだ' },
    { at: 'kiso', kind: 'flag', label: '秀忠', note: '三万八千は、まだ 山の 中' },
  ] },
  // 5-c has no map entry: its main visual is the 布陣 figure (story 5-c figure: 'sekigahara' →
  // figures.ts, where the clock-of-the-betrayal constraint is documented).
  // 5-d: むすび — the ending is allowed (opening-anchor exception), and this ending is the
  // redrawn 天下. The ring at 江戸 on the same gaz point 4-d's ring reached under orders — the
  // note inverts the standing (言われた とおり、移った → 幕府を ひらいた) like 駿府's circle will
  // in 終章. 関ヶ原 carries the body's own line with its subject (一日で、天下が ぬりかわった).
  // At 大坂, the SAME house flag that stood enemy-red in 4-a/4-b is GOLD now: the war is over,
  // 豊臣 still stands, and きみ is still 律儀の 形の 中 (千姫 wed 秀頼 — the body). ch6's enmity
  // must not be pre-drawn; the note is the one forward pull a むすび may voice (秀頼は、まだ
  // この 城に), the same まだ the body's あと 十二年 hangs on.
  '5-d': { markers: [
    { at: 'edo', cur: 1, kind: 'town', label: '江戸', note: '幕府を ひらいた' },
    { at: 'osaka', kind: 'flag', label: '豊臣', note: '秀頼は、まだ この 城に' },
    { at: 'sekigahara', kind: 'battle', label: '関ヶ原', note: '一日で、天下が ぬりかわった' },
  ] },

  // Chapter 六 (主家を ほろぼす). The chapter's devices are the reveal (国家安康), the 6-c closeup
  // (老家康 × 淀殿) and the three-layer deep — so the maps hold the political geography those
  // devices stand on: the watching seat in the east, the 豊臣 house a country's width west. What
  // the three maps draw across the chapter is one thing: the 豊臣 flag at 大坂 goes GOLD (6-a,
  // the 縁組み world 5-d left standing) → RED (6-b, 話し合いは こわれた) → GONE (6-d, the house
  // ended, a battle mark where its castle burned). That is 1-a→2-a's 織田 flip run in reverse —
  // the child watches an ally's flag become an enemy's and then vanish, without a word of body.
  //
  // ★The 42-unit problem (ch5's face-disc law, non-cur edition): 京・方広寺 and 大坂 project
  // 41.8 units apart, and a single face chip on 大坂 (r≈15.5 at this sc, plus its name text)
  // fills exactly the band 方広寺 sits in — measured: the chip overlaps the town icon by 2.5u,
  // and EVERY text position for 方広寺 (default below, lpos above, label-only) lands on the
  // chip or its name. A non-cur face has its own ~16-unit exclusion disc, and 京 is inside
  // 大坂's. So 6-a, the one map that must draw the temple, is the one map that draws no face:
  // 秀頼's face debuts at 6-b — beside his mother's, on the red flag, which is truer anyway
  // (the pair the chapter will not let leave the castle). His card still grants at 6-a.
  //
  // 6-a: the opening register is めでたい — a celebration seen from very far away. きみ reads
  // the world from 駿府 (the body's 大御所 paragraph; the subjectless note attaches to きみ
  // under his face, 2-b law, and here that is the fact). The temple is named by its builder
  // (秀頼が…建て直した = para 1's own opening fact, subject named per 4-b law); the bell and
  // its four characters are the reveal's job, so no のろい, no 鐘 on the map — the map must
  // not spoil the twist the scene exists to spring. 豊臣 stays a GOLD flag (5-d's rule holds:
  // the enmity is not pre-drawn; 三年前に 会って いる is the standing relationship), and its
  // note does the one geographic job the body needs done: 秀頼 lives at 大坂, NOT at the 京
  // temple he rebuilt — two places 小5 readers merge without a map. The note NAMES 大坂: the
  // image-only 小5 could not connect the 豊臣 flag to 6-d's 「大坂城」 without the place name
  // appearing once under the flag (the 5-b referent law again — a house flag is not a place).
  '6-a': { markers: [
    { at: 'sunpu', cur: 1, kind: 'castle', label: '駿河・駿府城', note: 'ここから 天下を 見て いる' },
    { at: 'houkouji', kind: 'town', label: '京・方広寺', note: '秀頼が 建て直した、大仏の 寺', lpos: 'above' },
    { at: 'osaka', kind: 'flag', label: '豊臣', note: '秀頼が いる、大坂の 城' },
  ] },
  // 6-b: the break, drawn as the color flip. Same three-glyph flag label as 6-a, now enemy red —
  // and now carrying the two faces: 淀殿 (the scene's voice; the speak is hers) and 秀頼 (the
  // stake). Mother and son standing together on the red flag is the chapter's picture one scene
  // early in the honest sense: at THIS scene's opening they are already in the castle the 牢人
  // are filling, and 6-c's 「母子は、出なかった」 lands on an image the reader has already met.
  // The note states what the castle is doing (subject = the flag's house; 牢人 needs ruby the
  // map cannot give, so the note takes 侍 — the body's own gloss, katsu 旗本→侍 precedent).
  // The fork itself (ほろぼすか 生かすか) is the body's job and stays off the map: no army
  // marker, no march — nothing has moved yet at the scene's opening, the decision IS the scene.
  '6-b': { markers: [
    { at: 'sunpu', cur: 1, kind: 'castle', label: '駿河・駿府城', note: '話し合いは、こわれた' },
    { at: 'osaka', enemy: 1, kind: 'flag', label: '豊臣', note: '米を 買いこみ、侍を 集めて いる', people: ['p-yodo', 'p-hideyori'] },
  ] },
  // 6-c has no map entry: its main visual is the closeup (老家康 × 淀殿, tense) — 2-c/4-c2/5-c
  // precedent. Its fallback pin is CHAPTER_POINTS[6] = osaka, exactly where the scene stands.
  // 6-d: むすび — and the ending is the scene's own subject (城の 火が 消えた ころ), so WRITING
  // 地図書法1's exception applies twice over (むすび AND 滅びの山場). The flag is gone; what
  // remains at 大坂 is a battle mark and the chapter title's past tense (kiyomori 壇ノ浦
  // 「平家、海に 消える」 precedent = a house ends at a place). The flashback (築山殿・信康,
  // 三十六年 前) is deliberately NOT drawn: the wife died on a road the body leaves unnamed
  // (a pin would out-resolve it) and the son's castle is a proper noun no scene teaches —
  // half a wound-map reads as an errand list, so the old wound stays where the body carries
  // it. The ring returns east and the cur note is the creed act's own line (翌年、七十五で
  // 死ぬ → 死没地は 駿府城, research §1 ◎) in its grade-school reading — 次の 年, because 翌
  // is a grade-6 glyph the map cannot ruby and the 初見 小5 stumbled on it: the same gaz point
  // that opened the work as a hostage's town closes this chapter pointing at 終章, which opens
  // on it (design §6 の円環).
  '6-d': { markers: [
    { at: 'sunpu', cur: 1, kind: 'castle', label: '駿河・駿府城', note: '次の 年、この 城で 死ぬ' },
    { at: 'osaka', kind: 'battle', label: '大坂城', note: '豊臣の 家は、ここで 終わった' },
  ] },

  // 終章 (神に なった 男). The chapter's devices are the 神号 reveal (7-b), the ☆遺訓 debunk (7-c)
  // and the 答え合わせ (7-d) — but every one of its five scenes had fallen back to the default pin,
  // so these maps are also this work's last uncovered visuals. What they carry is the one thing the
  // body cannot draw: the work's map signature, the 駿府 CIRCLE (gaz header / design §6), and then
  // the map that only a dead man can have.
  //
  // ★The chapter's grammar is the RING LEAVING AND COMING BACK. きみ dies in 7-a, so 7-b/7-c carry
  // NO cur marker (kiyomori 7-b precedent: the protagonist is dead, the map goes on without him) —
  // and with no ring there is no face disc, which is what lets 7-b draw 京 and 大坂 at all. The ring
  // returns at 7-d/7-e, where the scenes belong to the READER (答え合わせ・むすび), on the same 駿府
  // point the work opened on (kiyomori 7-c/7-d precedent: a quiet anchor labelled by the scene, not
  // by the place).
  //
  // 7-a: the circle closed, drawn as a life in one shot — 岡崎 west (born), 駿府 center (brought here
  // at six, dies here), 江戸 east (the world he made). It is 4-d's exact trio with the ring moved:
  // there the ring stood at 江戸 and 駿府 was the town he had just handed back (「十一年 いた 町も、
  // 返上」); here the ring is back on 駿府 and 江戸 is where his son came FROM. The cur note states
  // the inversion rather than the death — 6-d's note already said 「次の 年、この 城で 死ぬ」, and
  // repeating it verbatim one scene later is what the 通し離脱テスト calls the dullest thing in the
  // work. Notes name their subjects (2-b/4-b law); 江戸's 「ここから」 is the marker it sits under.
  // 久能山 is NOT drawn anywhere in this scene or the next two's company: it is 8 map units from
  // 駿府 (ch2's face-disc law), so it can only appear on a map 駿府 is absent from — which is 7-c.
  '7-a': { markers: [
    { at: 'sunpu', cur: 1, kind: 'castle', label: '駿河・駿府城', note: '人質だった 町へ、天下人で 帰った' },
    { at: 'okazaki', kind: 'castle', label: '三河・岡崎', note: '生まれた 城' },
    { at: 'edo', kind: 'town', label: '江戸', note: 'ここから、秀忠が 来た' },
  ] },
  // 7-b: a map of a PRECEDENT. The scene's argument is that the winners chose the shape of their own
  // god by looking at the god of the house they destroyed (「勝った 側が、ほろぼした 側の 前例を 見て」),
  // and those are two places a child has already been to: 京, where 秀吉 was enshrined as
  // 豊国大明神, and 大坂, where 6-d left a battle mark. Drawn together with the dead man's castle,
  // the three marks ARE 天海's sentence. The 京 pin is the city, not the shrine — 豊国社 and 方広寺
  // stand a few hundred metres apart in 東山, far under this frame's resolution, so a mark here
  // resolves nothing finer than 「京」 and the note takes the city as its subject (WRITING 地図書法2).
  // 京 escapes upward for the same measured reason as 6-a: 京 and 大坂 project 41.8 units apart, so
  // their notes must sit in different lanes. No ring, no face: きみ is dead, and the map's subject is
  // what the living do with him.
  '7-b': { markers: [
    { at: 'sunpu', kind: 'castle', label: '駿河・駿府城', note: 'きみが 亡くなった 城' },
    { at: 'houkouji', kind: 'town', label: '京', note: '秀吉が 神に なった 町', lpos: 'above' },
    { at: 'osaka', kind: 'battle', label: '大坂城', note: '秀吉の 家は、ほろびた' },
  ] },
  // 7-c: 神格化の地図 — the one map in this work whose subject is not a life but an afterlife (the
  // gaz header names it: 死後の 地理は 生涯の 動線とは 別の 地図). It is also the only scene that can
  // hold 久能山, because 駿府 is not on it. The body says 「日光に 大きな 社が でき、各地に 東照宮が
  // 建つ」 — 各地 has no pin (a scattering cannot be resolved), so what the map draws is the move
  // that started it: the body goes up to the mountain by the town he died in, and then a shrine
  // rises 210 units north — beyond 江戸, past the edge of everywhere he ever campaigned. 江戸 is
  // drawn plain (幕府の 町) so the child can see that 日光 is north of it; the map does NOT say 北の
  // 守り, which is a later reading of the placement and is not in this work's research.
  // 久能山's note names きみ because the /eval-work blind reader asked the one question this map
  // must answer —「誰が まつられたのか」— and with the ring gone there is no face to attach an
  // unsubjected note to (the 2-b subject law inverted: on a map with no きみ ON it, a note about
  // きみ has to say so).
  // ★Both shrine marks needed an icon the set did not have. They first borrowed 'death' (a pale
  // soul at 55% opacity) and the raster showed why that fails: at scene-map scale two of the three
  // marks had no readable icon at all, on the one map whose whole subject is 「ここに 神と して
  // まつられた」. So markIcon gained a 'shrine' torii (stone pillars, gold 笠木 — the castle's own
  // color grammar; a red torii would read as this map's enemy color). Reusable: every work in this
  // repo has shrines and temples in it.
  '7-c': { markers: [
    { at: 'kunozan', kind: 'shrine', label: '久能山', note: 'きみが、はじめに まつられた 山' },
    { at: 'nikko', kind: 'shrine', label: '日光', note: '大きな 社が 建った' },
    { at: 'edo', kind: 'town', label: '江戸', note: '幕府の 町' },
  ] },
  // 7-d: 答え合わせ — the ring comes back, and the scene belongs to the reader, so the map goes
  // quiet (kiyomori 7-c precedent: one marker, labelled by the scene rather than the place). The
  // point is 駿府 all the same: the work started here at six and ends here, which is the answer to
  // half of what the riddle asks. 手がかり takes the readable half (the body rubies it).
  '7-d': { markers: [
    { at: 'sunpu', cur: 1, kind: 'death', label: '旅の 終わり', note: '七つの 手がかりを、思いかえそう' },
  ] },
  // 7-e: むすび — the last mark in the work, and its label and note are the creed's own words
  // (「……それだけの 男だ」/「決めるのは、なりきった きみだ」) in their grade-school reading. The
  // 250年 of 神君 stories end on a map that declines to call him a god: no shrine icon, no 東照宮,
  // just the point where a boy was sent at six, and the reader holding the verdict.
  '7-e': { markers: [
    { at: 'sunpu', cur: 1, kind: 'death', label: 'それだけの 男', note: '決めるのは、きみだ' },
  ] },
};
