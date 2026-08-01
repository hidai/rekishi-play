// Map data (skeleton stage). Adds gaz for Katsu's domestic sites on top of the shared GEO.
// Coords are research §5 lat/lon projected via the GEO projection
//   x=(lon-128.5977)*94.7855, y=(37.03053-lat)*114.3479  (verified: Kyoto → 677,231).
//
// EDO IS NOW PLACED AT ITS TRUE POSITION. gaz points below are REAL [lon,lat]; the engine
// projects them via GEO.proj at render (see engine/map/project.ts gazXY). 武蔵/東京 (lon≈139.8)
// projects to x≈1062 — east of the legacy frame edge (x=1000) — and the scene-map auto-zoom
// frames the view around the markers with no clamp, so the base national coastline + real Kanto
// province land at x>1000 render underneath. This fixed the observation memo 2026-07-14 (本所 was
// clamped to x≈996 and landed near the 東京/山梨 border).
//
// CHAPTER 三 IS NOT STAGED IN JAPAN. Its subject is an ocean, so its scenes name the Pacific band
// (GEOS.pacific → SceneMapDef.geo) and 品川・サンフランシスコ are both real on-map places there.
// Until 2026-07-16 the crossing was drawn on the Japan geo as an off-map edge arrow plus a route
// stub, which framed the auto-zoom on 品川 alone: the family saw a Tokyo map behind the whole
// chapter (observation memo 2026-07-15). Hand-managed (no legacy extract).
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
import { GEO_PACIFIC } from '../../shared/geoWorld';

// Stages other than the home geo (Japan). A scene picks one by key via SceneMapDef.geo.
export const GEOS: Record<string, Geo> = { pacific: GEO_PACIFIC };

// No territory coloring — Katsu is not a "land conqueror" (design §7-1).
export const TERRITORY: Record<string, number> = {};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};

// No routes. The ch3 crossing had one (a stub arc east of Boso, drawn in Japan px); the Pacific band
// retired it rather than redraw it at ocean scale, because at that scale a line asserts a TRACK.
// 咸臨丸's ports are documented and undisputed (品川/浦賀 → San Francisco); the course it steered
// across 37 days of storms is not something this project has a source for, and the ieyasu ch2/ch3
// rule applies — a map cannot hedge, so it may only draw what is not in dispute (JOURNAL 2026-07-16:
// 解像度 vs 係争幅). The crossing is told instead by where きみ STANDS: 品川 in 3-a/3-b, San Francisco
// in 3-d, with the whole ocean drawn to true scale between them.
export const ROUTES: Record<string, RouteDef> = {};
export const CAMPAIGN_ROUTES: CampaignRoute[] = [];
export const FACTION_PHASES: FactionPhase[] = [];
export const MAPLABELS: Record<string, string> = {};
export const MAPPOINTS: MapPoint[] = [];

// Places, written once in real [lon,lat] and projected by whichever geo the scene is staged in
// (engine/map/project.ts gazXY). That is what lets サンフランシスコ be a direction-only placeholder
// no longer: on the Pacific band it is a real dot at its real longitude, while 品川 is a real dot on
// both stages. 西洋 stays a px placeholder — it is not a place but a heading (ch2's window on the
// outside world), and only its direction is ever used.
export const GAZ: Record<string, GazPoint> = {
  // Edo area — REAL [lon,lat], projected at render (no longer clamped to the frame edge).
  honjo: { lon: 139.802, lat: 35.699 },     // 本所 = birthplace (poor hatamoto), Sumida
  akasaka: { lon: 139.737, lat: 35.673 },   // 赤坂 = private school
  hikawa: { lon: 139.738, lat: 35.671 },    // 赤坂氷川 = late-years residence
  edojo: { lon: 139.752, lat: 35.685 },     // 江戸城 = the no-blood surrender (皇居)
  tamachi: { lon: 139.747, lat: 35.645 },   // 田町薩摩藩邸 = the Katsu–Saigo talks
  senzoku: { lon: 139.692, lat: 35.606 },   // 洗足池 = grave / 西郷留魂詩碑 (大田)
  shinagawa: { lon: 139.739, lat: 35.622 }, // 品川 = ch3 departure (「品川の 沖から」)
  uraga: { lon: 139.717, lat: 35.25 },      // 浦賀 = last port before the crossing
  // Elsewhere — REAL [lon,lat] (these already sat at their true projected px in the old data).
  dejima: { lon: 129.873, lat: 32.744 },    // 出島(長崎) = the one window to the West
  kobe: { lon: 135.202, lat: 34.69 },       // 神戸 海軍操練所 (≈ old 大輪田泊 area)
  sunpu: { lon: 138.383, lat: 34.976 },     // 駿府 = the先行交渉 (Yamaoka → Saigo)
  // Across the Pacific — a REAL place, pinned on the pacific stage (ch3). Its negative longitude is
  // what GEO_PACIFIC's proj.wrap resolves to the far side of the ocean (-122.42 → 237.58); on the
  // Japan geo it would project ~24,000 units west of Kyushu, which is why only Pacific-staged scenes
  // may pin it (the engine keeps windows per geo — see sceneMap.ts pinnedPoints).
  sf: { lon: -122.4194, lat: 37.7749 }, // サンフランシスコ = the far end of the crossing
  // Open ocean, roughly midway between the two ports and clear of every island. Not a place: it is
  // where the ocean's NAME sits (a child cannot be told 「太平洋」 by blue alone), and where ch3's
  // long notes live, since a note on either coast runs off the frame edge. Its latitude is between
  // the two ports on purpose — north of them it would become the topmost marker and drag the frame's
  // 150-unit face margin up past the band's north edge, exposing the clip line as a straight coast.
  taiheiyo: { lon: 185, lat: 36.7 }, // 太平洋
  // Off-map (far east, out over the open Pacific). A heading, not a place — the eastern sea the
  // West's ships came out of, aimed at by ch1's 「異国の 船」 arrow. It must NOT be sf: on the Japan
  // geo, San Francisco's real -122.42°E is 251° WEST of lonmin (128.6°E) — the long way round the
  // globe — so the arrow that says 「海の むこうから」 swung to point due west at Kyushu. That is
  // what a real coordinate means to a projection that does not span the antimeridian, and it is why
  // a heading gets its own px placeholder instead of borrowing a place that now lives on another
  // stage. (`tests/helpers/work-structure.ts` now fails on a marker projected through the far side.)
  ikoku: { x: 10330, y: -85 }, // 異国 = the world out beyond the eastern sea
  // Off-map (far west-southwest, out over the East China Sea). Only its direction is used: from
  // 長崎/出島 (x≈121, near the left edge) the arrow points out to the open western sea — the
  // world the West's ships came from. Distinct from ch3's eastward SF arrow because the two ports
  // sit on opposite coasts (西洋 = west sea at 長崎, アメリカ = east across the Pacific at 品川).
  seiyo: { x: -9000, y: 2400 },  // 西洋 = the outside world beyond the western sea, off the frame
};

// Per-scene maps. Chapter 三 stands up the "sea that opens to the world" grammar
// (design §7-1/7-2 (a)): 品川 as the departure port (the place the text names, with
// ruby, seconds earlier), the off-map SF edge arrow due east, and the pacific route
// line arcing into the open sea. 3-c is a closeup (no map). Other chapters fall back
// to the default location (= CHAPTER_POINTS) until authored.
export const SCENE_MAPS: Record<string, SceneMapDef> = {
  // Chapter 一 quiet anchors. Design principle (established 2026-07-14): a scene map is an
  // establishing shot read before/with the body, so it anchors to the OPENING situation of
  // the scene, not its ending (exception: riddle/reveal/むすび may voice the future). Katsu
  // starts at the far-east edge of Japan (江戸, clamped to the frame edge) — the world is
  // still far away. These are "静かなアンカー" maps (1 marker + a note echoing the scene's
  // core line, body verbatim/反響), matching hidenaga's every-scene precedent.
  //
  // 1-a: birth — 貧乏旗本の子、江戸の本所に生まれる. 父・小吉's face sits at the birthplace
  // (parallels hidenaga 1-a's 母 at 中村). Note says 武士 not 旗本: on the map there is no
  // ruby, and a 小5 image-only read stumbled on 旗本 (the body delivers it with ruby).
  // 武士 (not 侍) because the mainline calls this one thing by one word (WRITING 13).
  '1-a': { markers: [
    { at: 'honjo', cur: 1, kind: 'town', label: '江戸・本所', note: '貧乏な 武士の 子、ここに 生まれる', people: ['p-kokichi'] },
  ] },
  // 1-riddle: a bare quiet anchor at 江戸 (きみ's starting point), matching hidenaga 1-riddle
  // (label only, no note). An earlier draft voiced the riddle's future event (「町を敵に
  // あずけた？」) on the map; a 小5 image-only read it as a past event and was jarred by the
  // jump from 1-a's birth — the very 2-a failure (a map must not show the ending) codified
  // last cycle. The riddle question stays in the body; the map just says きみは江戸にいる.
  // 1-b: the choice — きみ in 江戸 (a top swordsman) as foreign ships appear across the eastern
  // sea. No 蘭学 pole yet (長崎 is ch2); the off-map east arrow is the work's signature grammar
  // (sea opening to the world, ch3) showing the outside world pressing in — what tips the choice
  // toward Western learning. Aims at 異国, a heading placeholder (see GAZ) — never at a real place.
  '1-b': { markers: [
    { at: 'honjo', cur: 1, kind: 'town', label: '江戸' },
    { at: 'ikoku', off: 1, label: '異国の 船', note: '海の むこうから' },
  ] },
  // Chapter 二 (長崎, 海を まなぶ). One place (長崎/出島, on-frame at true coords near the west
  // edge) across four scenes; the note evolves 窓ひらく → 岐路 → 学ぶ → 海へ. Katsu's signature
  // "opens to the world" grammar aims OUTWARD from the first scene (design karte): 出島 is the one
  // window to the West, so an off-map arrow points west-southwest out over the open sea (西洋), the
  // mirror of ch3's eastward SF arrow. Notes stay ruby-free-readable (窓→まど, 小5 delivered with
  // ruby in the body); each note is a body reverberation, no new claim. Icons stay 'town' (a steady
  // learning arc at one port, unlike ch5's crisis→salvation icon flip).
  //
  // 2-a: opening — きみ arrives at 出島, the window to the West opens (establishing situation, not
  // an ending). 出島 note names the window; the 西洋 arrow gives the outward direction (3-a shape:
  // 品川「ここから 太平洋へ」+ sf「アメリカ／海の むこう」).
  '2-a': { markers: [
    { at: 'dejima', cur: 1, kind: 'town', label: '長崎・出島', note: '西洋へ ひらく 一つの まど' },
    { at: 'seiyo', off: 1, label: '西洋', note: '海の むこう' },
  ] },
  // 2-b: the fork — 身分(格式) or 実力 on the deck. Choice scenes anchor to the opening with no
  // resolution (3-b/5-b precedent): the port whose lesson is undecided, the balanced note posing
  // both paths. No arrow (focus on the human fork), face = きみ only (格式派 are 役割語, no card).
  // Note says 身分 not 格式: the map has no ruby and a 小5 image-only read stumbled on 格式's
  // reading+meaning (2026-07-14 visual-read persona); 身分 is the theme word the body repeats and
  // is 小5-readable (the body still delivers 格式 with ruby). Same rule as ch1's 旗本→武士.
  '2-b': { markers: [
    { at: 'dejima', cur: 1, kind: 'town', label: '長崎・出島', note: '身分か、実力か' },
  ] },
  // 2-c: the learning (minigame scene; the map is still the hero visual above the minigame panel).
  // きみ at 出島 about to work the iron ship with their own hands — the opening situation the
  // minigame plays out (body: 「きみの 手で、この 鉄の 船を 動かして みよう」).
  '2-c': { markers: [
    { at: 'dejima', cur: 1, kind: 'town', label: '長崎・出島', note: '鉄の 船を、この 手で' },
  ] },
  // 2-d: むすび — ending allowed (opening-anchor exception may voice the forward pull). きみ, now
  // recognized by skill, resolves to cross to the real world; the 西洋 arrow returns (bookends 2-a's
  // opened window) with the note evolved to 本物の 世界 (body: 「本物の 世界を この目で 確かめたく」).
  '2-d': { markers: [
    { at: 'dejima', cur: 1, kind: 'town', label: '長崎・出島', note: '海の むこうへ 出よう' },
    { at: 'seiyo', off: 1, label: '西洋', note: '本物の 世界' },
  ] },
  // Chapter 三 (咸臨丸, 1860) — THE ONLY CHAPTER STAGED OUTSIDE JAPAN. Its subject is the ocean, so
  // its three mapped scenes name the pacific band and both shores are real dots on it, drawn to one
  // true scale (see the file header + shared/geoWorld.ts). What the child could not see before was
  // the only thing that matters here: HOW FAR IT IS. The map now says that with geometry and spends
  // no words on it, which is the whole point of a scene map (VISION 設計原則5「体感 > 情報」).
  //
  // No route line, in any of the three. At band scale a line resolves a track — 10,000km across the
  // frame means a 5° error still paints 20% of the height — and the course 咸臨丸 actually steered
  // through 37 days of storms is not something this project has a source for. A map cannot hedge
  // (ieyasu ch2/ch3: 解像度 vs 係争幅), so it draws only what is not in dispute: the ports. きみ moves
  // 品川 → San Francisco across the sequence, and that IS the crossing.
  //
  // Labels name the country first (「日本・品川」, following 2-c's 「長崎・出島」): at ocean scale a
  // child cannot be assumed to read a 96-px silhouette as 日本. 「アメリカ」 labels the far dot and
  // 「サンフランシスコ」 rides in its note — the long name at label size would overrun the frame edge.
  //
  // WHERE THE WORDS GO IS DECIDED BY THE FRAME, not by taste. The auto-zoom pads only 92 units past
  // the outermost markers and the aspect fit spends its slack on height, so each port sits 92 units
  // from its edge: a note there is clipped past ~9 glyphs (on-map text is not clamped, unlike
  // off-map). Every sentence therefore rides 太平洋, mid-frame, which is also where it belongs —
  // both the stake (3-b) and the surviving fact (3-d) are statements about the ocean.
  //
  // 3-a: departure. Opening situation = a ship putting out from 品川 toward America (body: 「品川の
  // 沖から、一そうの 軍艦が 出て いく」), so the far shore is a place now, not an arrow. The ports keep
  // 'town' in all three scenes — a port is a port, and the ship is not a place. (This is why the
  // 蒸気船 marker of design §7-3 stayed unbuilt: on this stage a ship icon would have to claim a
  // position in the ocean, and the ship's whereabouts is exactly what 3-c makes the child weigh.)
  '3-a': { geo: 'pacific', markers: [
    { at: 'shinagawa', cur: 1, kind: 'town', label: '日本・品川', note: 'ここから 太平洋へ' },
    { at: 'taiheiyo', kind: 'sea', label: '太平洋' },
    { at: 'sf', kind: 'town', label: 'アメリカ', note: 'サンフランシスコ' },
  ] },
  // 3-b: the fork. Anchors to the opening with no resolution (2-b/5-b precedent). The map cannot draw
  // this fork — both choices end at the same dot, and what differs is which SHIP — so it draws what
  // is being wagered against: the width of the ocean, priced.
  //
  // The note is the body's claim (「日本人だけで 冬の 太平洋を こえた 例は、まだ 一度も ない」) and
  // must stay NO BROADER than it. This is the one line in the chapter where the map states a fact
  // about history rather than about geography, and a negative-existence claim at that — the very
  // kind that cannot be hedged here. Every word is load-bearing:
  //   ・「冬の」 — dropping it cost nothing visible and quietly widened the claim past the body's:
  //     督乗丸 (1813-15) was a Japanese-crewed ship that did cross, adrift, and was found off
  //     California. Without 「冬の」 the sentence leans entirely on reading 「こえた」 as "sailed",
  //     not "drifted" — a distinction a 10-year-old has no reason to make.
  //   ・「この 海を」 — a first-read 小5 could not tell whose ship the note meant, or whether it was
  //     past record or coming challenge; anchoring the sentence to the water it is written on says
  //     "this crossing, by anyone, ever".
  //   ・no counter word — 「一そうも」 made the same reader stop and guess at 艘. ieyasu's 「二万人」
  //     rule is about supplying the unit a NUMBER needs; here the number is zero and 船 carries it.
  '3-b': { geo: 'pacific', markers: [
    { at: 'shinagawa', cur: 1, kind: 'town', label: '日本・品川' },
    { at: 'taiheiyo', kind: 'sea', label: '太平洋', note: '冬の この 海を、日本人だけで こえた 船は まだ ない' },
    { at: 'sf', kind: 'town', label: 'アメリカ', note: 'サンフランシスコ' },
  ] },
  // 3-d: むすび — きみ stands on the far shore, and 品川 is a name a whole map away. むすび may voice
  // the ending (opening-anchor exception). The note states the ◎ fact that survives this chapter's own
  // debunking — 「日本の 船が こえた」 — never the ☆ boast 「日本人だけで」, which 3-c spends the scene
  // discounting: evidence, not conclusion (ieyasu ch3 3-d precedent).
  //
  // 「およそ 37日 かけて」 is the answer to the one thing a first-read 小5 asked of these maps and did
  // not get: きみ's face jumps 8,000km between two pictures, so the crossing reads as a teleport and
  // some of the distance the band works so hard to show is given back. A line would fix it and lie;
  // the DURATION is undisputed (3-b's canon hist: 「およそ 37日 かけて…サンフランシスコに ついた」),
  // costs no assertion about the track, and is the truer answer anyway — what a sailing ship spends
  // on an ocean is time. (The rest of that gap is the closeup's job: 3-c is 海舟 seasick in the hold,
  // which the child in the first-read check never saw. 地図が状況、closeup が体感 — design §7-1.)
  '3-d': { geo: 'pacific', markers: [
    { at: 'shinagawa', kind: 'town', label: '日本・品川', note: 'ここから 出た' },
    { at: 'taiheiyo', kind: 'sea', label: '太平洋', note: 'およそ 37日 かけて、日本の 船が こえた' },
    { at: 'sf', cur: 1, kind: 'town', label: 'アメリカ', note: 'サンフランシスコ' },
  ] },
  // Chapter 四 (神戸操練所, 身分を こえた 船). One place (神戸/kobe, on-frame at true coords, mid-west
  // Japan) across three scenes; 4-c is a closeup (no map). Katsu's ch4 device is "身分を越えて一つの
  // 船に乗せる" = the operations ground (design §7-4); the crew/人の図 (lines crossing status) is an
  // engine 変種 deferred to 演出フェーズ, so these stay clean establishing shots (1 place + a note
  // echoing the body, 4-a carrying 龍馬's face). Icon stays 'town' across all three (a steady training
  // place, like ch2's port — no crisis→salvation flip); the arc rides the notes: 場をひらく → 岐路 →
  // 芽が次の世へ. Notes stay ruby-free-readable (船/動/者/育/芽 are ≤小5 kanji; the body delivers
  // 操練所/幕臣/脱藩浪士 with ruby). No off-map arrow: ch4 is inland operations, not the outward-sea
  // grammar of ch2/ch3.
  //
  // 4-a: opening — きみ (海舟) opens the naval school; a place to raise ship-handlers regardless of
  // status. The 脱藩浪士 龍馬 has just arrived (the opening situation the scene poses, not an ending):
  // 龍馬's face sits at 神戸 (parallels 5-a's 慶喜 in the opening situation). Note is body-verbatim.
  '4-a': { markers: [
    { at: 'kobe', cur: 1, kind: 'town', label: '神戸', note: '船を 動かす 者を、ここで 育てる', people: ['p-ryoma'] },
  ] },
  // 4-b: the fork — take the outsider (龍馬) aboard or restrict to the 幕府. Choice scenes anchor to
  // the opening with no resolution (2-b/3-b/5-b precedent). 龍馬's face STAYS here (5-b's 小栗
  // precedent = a face at the fork): a visual-read persona (2026-07-14) found 龍馬 vanishing after
  // 4-a jarring ("どこ行ったの?"), and keeping him makes the fork concrete — the decision is literally
  // about THIS person. Note is near-verbatim the body q (「藩を ぬけた 者まで…船に 乗せるか？」): the
  // same persona could not parse an earlier abstract 「身分を こえて 乗せるか」 from the map alone
  // ("なにを こえる?"), so 「この 者も、船に 乗せるか」 — with 龍馬's face right there — reads clean and
  // ruby-free (者/船/乗せる are ≤小5). The theme word 身分/垣根 is delivered by the body with ruby.
  '4-b': { markers: [
    { at: 'kobe', cur: 1, kind: 'town', label: '神戸', note: 'この 者も、船に 乗せるか', people: ['p-ryoma'] },
  ] },
  // 4-d: むすび — ending allowed (opening-anchor exception may voice the forward pull; the persona's
  // "オチ先出し" concern does not apply — this is the closing scene, like 5-d/2-d). The gamble cost
  // きみ his post and the school was disbanded, but the note answers 4-a's 「育てる」: the ones raised
  // here go on to the next age. 龍馬 is absent now — he has dispersed into the wider world with the
  // other graduates, which the note voices. Note uses 者 not 芽 (body: 「ここで 育った 者たちは…」):
  // the persona found the bare 芽 metaphor too abstract on the map ("何の芽か絵にない"); 育った 者 is
  // concrete and body-verbatim. Icon stays 'town' (the place remains; its people moved on).
  '4-d': { markers: [
    { at: 'kobe', cur: 1, kind: 'town', label: '神戸', note: 'ここで 育った 者が、次の 世へ' },
  ] },
  // Chapter 五 (無血開城). One place (江戸, clamped to the frame's eastern edge) across three
  // scenes; the icon and note flip crisis → fork → salvation, an arc like kiyomori's 崇徳
  // 京→讃岐 (opening-anchor principle, 2026-07-14). Notes stay ruby-free-readable (火/海/町
  // are 小5 kanji; the body delivers 総攻撃/百万 with ruby). 5-c is a closeup (no map).
  //
  // 5-a: opening — the total attack looms; if war comes the million-person town burns. The
  // crisis flame literally reads 火の海; きみ (海舟, gold ring) and 慶喜 (who receded and handed
  // off the aftermath) stand in the endangered city. The 「なるか」 note is the opening question,
  // not the ending (which is 5-d).
  '5-a': { markers: [
    { at: 'edojo', cur: 1, kind: 'crisis', label: '江戸', note: '火の海に なるか、百万の 町', people: ['p-yoshinobu'] },
  ] },
  // 5-b: the fork — 迎え撃つ or 明けわたす. Choice scenes anchor to the opening with no
  // resolution (3-b precedent): the castle whose fate is undecided, きみ next to 小栗 (the
  // かげの対 who urges 主戦). The balanced note poses both paths, revealing neither outcome.
  '5-b': { markers: [
    { at: 'edojo', cur: 1, kind: 'castle', label: '江戸城', note: '戦うか、明けわたすか', people: ['p-oguri'] },
  ] },
  // 5-d: むすび — ending allowed (opening-anchor exception). The peaceful town icon (houses
  // standing) and note answer 5-a's flame: the city was handed over and not one house burned.
  '5-d': { markers: [
    { at: 'edojo', cur: 1, kind: 'town', label: '江戸', note: '町は 焼けずに 残った' },
  ] },
  // Chapter 六 (裏切り者と 呼ばれて). One place (東京・赤坂氷川, the late-years residence, clamped to
  // the frame's eastern edge, one dot away from 5's 江戸城) across three scenes; 6-b is a closeup
  // (no map). This is a static Meiji reflection chapter — no journey, no crisis→salvation flip — so
  // the icon stays 'town' throughout (like ch2/ch4). The cur marker shows 海舟@old
  // (protagonistFacesByChapter['6'] = p-katsu@old): a lone, white-haired old man, right for a scene
  // whose drama is being judged, not acting. The label reads 東京 not 江戸 for the first time — the
  // 江戸→東京 rename quietly signals the world has changed under him. No off-map arrow: ch6 is
  // inward-facing, not the outward-sea grammar of ch2/ch3. The note arc rides 告発 → 岐路 → 表裏.
  // Notes stay ruby-free-readable body reverberations: the chapter's abstract theme words
  // (英断/不忠/裏切り者〔裏 is a 6年 kanji〕) are dropped to concrete body-verbatim synonyms, the
  // ch1「旗本→武士」/ch2「格式→身分」/ch4「身分→者」 codify (a map has no ruby; the body delivers the
  // theme words with ruby and context).
  //
  // 6-a: opening — the old 海舟, called a traitor for surviving into the winners' world (the opening
  // situation, not an ending). Note drops 裏切り者 to the body-verbatim「見すてた 男」(body:「主家を
  // 見すてて、勝った側にすりよった男だ、と」): 見 is a 1年 kanji, the accusation reads clean.
  '6-a': { markers: [
    { at: 'hikawa', cur: 1, kind: 'town', label: '東京・氷川', note: '「見すてた 男」と 呼ばれて' },
  ] },
  // 6-c: the fork — 言い返すか、受け流すか. Choice scenes anchor to the opening with no resolution
  // (2-b/3-b/5-b precedent). 福澤's face STAYS here (5-b's 小栗 precedent = the opposing voice's
  // face at the fork): a visual-read persona (2026-07-14) read a bare-海舟 map as「一人で考えごと」
  // with no one to reply to, so keeping 福澤 makes 言い返す concrete — the reply is to THIS man — and
  // gives the 3-map chapter its one point of differentiation (solo 6-a → 対峙 6-c → solo-at-peace
  // 6-d, a face arc that mirrors the narrative). 福澤 is already revealed in 6-b, so no spoiler.
  // Note writes だまって in kana (黙 is a 中学 kanji, unreadable on a ruby-free map); the body's
  // place string delivers 黙って with ruby.
  '6-c': { markers: [
    { at: 'hikawa', cur: 1, kind: 'town', label: '東京・氷川', note: '言い返すか、だまって 受けるか', people: ['p-fukuzawa'] },
  ] },
  // 6-d: むすび — ending allowed (opening-anchor exception). 海舟 alone again (the resolution is
  // internal: he keeps it within himself and does not argue back — 5-d/4-d single-face precedent;
  // adding 福澤 would wrongly imply ongoing confrontation). The note answers the chapter's core —
  // one and the same act draws both praise and blame — as the concrete「ほめる 声と せめる 声」
  // (body:「正面から責めた」, creed:「ほめるも けなすも、他人のかってだ」), avoiding the abstract 英断/
  // 不忠 and the 6年-kanji 表と裏. せめる replaces an earlier けなす that the persona did not know
  // (責める is body-verbatim and 小5-known); 声 is a 2年 kanji; the fork of voices reads clean.
  '6-d': { markers: [
    { at: 'hikawa', cur: 1, kind: 'town', label: '東京・氷川', note: '同じ 行い、ほめる 声と せめる 声' },
  ] },
  // Chapter 終 (氷川の 老人). The payoff/recap chapter, same place as ch6 (東京・赤坂氷川) with the same
  // lone 海舟@old (protagonistFacesByChapter['7'] = p-katsu@old). 7-a is a closeup (老海舟×西郷, grief),
  // so only 7-b/7-c/7-d get maps. This is a quiet-anchor recap chapter (kiyomori 終章 7-c/7-d precedent):
  // no journey, no crisis→salvation, icon stays 'town', no off-map arrow (inward). Face stays solo across
  // all three — there is no one else at 氷川 for the recap (7-a already spent the 西郷 confrontation), and
  // a recap/むすび differentiates by note/label, not by a face arc (kiyomori 7-c/7-d were both solo at 京).
  // The label progresses place → thematic (7-b keeps the 氷川 place where he talked; 7-c/7-d go thematic
  // like kiyomori's 旅の 終わり / ひとりの 大きな 男). Notes stay concrete body-verbatim reverberations,
  // ruby-free-readable for 小5 (the 史料批判/むすび theme words 脚色/主家/信 are dropped to plain synonyms).
  //
  // 7-b: the 史料批判 climax — 『氷川清話』 is a talked, edited record and the same story differs by book.
  // Note is the concrete two-versions-differ core (body:「同じ 話が、本に よって 少し 違うのだ」); ちがう in
  // kana (違 is a 中学 kanji), 同/話/少 are 2年, 本 is 1年 — reads clean without ruby.
  '7-b': { markers: [
    { at: 'hikawa', cur: 1, kind: 'town', label: '東京・氷川', note: '同じ 話が、本で 少し ちがう' },
  ] },
  // 7-c: the riddle's answer-check — recall the clues and answer for yourself (kiyomori 7-c precedent
  // 「手がかりを 思いかえそう」). Label goes thematic (答え合わせ = the scene's own name). No resolution
  // shown; the four-choice payoff lives in the body.
  '7-c': { markers: [
    { at: 'hikawa', cur: 1, kind: 'town', label: '答え合わせ', note: '手がかりを 思いかえそう' },
  ] },
  // 7-d: むすび — ending allowed (opening-anchor exception). The chapter's landing: strip the padding from
  // his self-told tales and something real remains (note is body-verbatim「語りを うたがっても なお 残る、
  // ほんとうの 海舟」, naming 海舟 so a map-only read forms a concrete picture). The label is the chapter
  // title「氷川の 老人」— concrete (an old man at 氷川, matching the grey-haired face), where an earlier
  // 「信を 通した 一生」made a 小5 image-only read stumble on ruby-free 信 (misread as a name) and read as
  // too abstract (the codify: a map has no ruby/context, so drop idiom to a concrete body-verbatim). The
  // 敵将への信/縁組み strand is carried by 7-a's 西郷 closeup and the body, not the map.
  '7-d': { markers: [
    { at: 'hikawa', cur: 1, kind: 'town', label: '氷川の 老人', note: 'うたがっても、ほんとうの 海舟が 残る' },
  ] },
};
