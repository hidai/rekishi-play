// Assembles the "shibusawa" (渋沢栄一) Work object (skeleton = unregistered data layer).
// Design: docs/design/shibusawa.md; facts: docs/research/shibusawa.md.
//
// NOT in src/works/index.ts (WORKS) on purpose — it lives only in SKELETON_WORKS
// (scripts/lib/works.ts). The story is still placeholders; the kiyomori/katsu/ieyasu/davinci/masako
// precedent keeps an unfinished work out of the family's build until it has something to play.
// Registration lands when the chapters are written (pilot = 章五, design §8).
//
// 7th work, first modern-economy protagonist. Device grammar follows the person, not habit
// (design §3): power lives not in land but in 会社・人・港の点 (合本), so territory is never painted
// and the map is a main device in only two chapters (欧州 / 会社の点). The 論語と算盤 twin-emblem
// figure is deliberately NOT built yet — the pilot measures whether existing devices (cite / closeup
// / 「論語」「算盤」cards) carry it before any engine extension (design §4②, the 藍リング lesson).
//
// engine 拡張ゼロ (design §4): 近代の顔語彙は katsu で導入済み・地図は既存 MapPoint/geoWorld・
// territory は空。既存6作の出力を1バイトも変えない（snapshot / map-labels / face-vocab で pin）。
//
// figures (人の図) are authored WITH their chapters: 章二 = 席の 図（座が うつる）; the 終章 総覧 lands
// with that chapter. Structural integrity is covered by tests/shibusawa-skeleton.test.ts +
// the shared ALL_WORKS gates.
import type { Work } from '../../engine/types';
import { GEO } from '../../shared/geoJapan';
import { STORY } from './story/index';
import { CARDS } from './cards';
import { CLUES } from './clues';
import { TIMELINE } from './timeline';
import { FACE_SPEC, PROTAGONIST_FACE_BY_CH, PROTAGONIST_STAGES } from './faces';
import { METERS } from './meters';
import { RELATIONS } from './relations';
import { FIGURES } from './figures';
import {
  TERRITORY,
  PROTAGONIST_DOMAINS,
  ROUTES,
  CAMPAIGN_ROUTES,
  FACTION_PHASES,
  MAPLABELS,
  MAPPOINTS,
  GAZ,
  SCENE_MAPS,
  GEOS,
} from './map';
import {
  RIDDLE,
  TITLE_KNOWN_FACES,
  CHAPTER_POINTS,
  SHORT_NAMES,
  CHAPTER_CAPTIONS,
  FACE_HINT_KEY,
  TOTAL_CHAPTERS,
  PROTAGONIST_ID,
  STRINGS,
  HIDDEN,
} from './meta';

export const shibusawa: Work = {
  id: 'shibusawa',
  faceHintKey: FACE_HINT_KEY,
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  // 算盤 (abacus) = a thematic emblem, NOT a family crest — the Shibusawa crest is 要出典確認 and
  // encoding an unconfirmed crest into the topbar is the 藍リング trap. Follows davinci's `vinci`
  // (non-samurai → thematic mark). Added to the MON registry this cycle (engine/art/icons.ts).
  mon: 'soroban',
  riddle: RIDDLE,
  story: STORY,
  cards: CARDS,
  clues: CLUES,
  timeline: TIMELINE,
  faces: FACE_SPEC,
  shortNames: SHORT_NAMES,
  peopleExtra: { 'p-banker': '銀行の 人', 'p-officer': '軍の 人' },
  strings: STRINGS,
  hidden: HIDDEN,
  meters: METERS,
  relations: RELATIONS,
  figures: FIGURES,
  map: {
    geo: GEO,
    geos: GEOS,
    territory: TERRITORY,
    protagonistDomains: PROTAGONIST_DOMAINS,
    routes: ROUTES,
    campaignRoutes: CAMPAIGN_ROUTES,
    mapLabels: MAPLABELS,
    mapPoints: MAPPOINTS,
    gaz: GAZ,
    sceneMaps: SCENE_MAPS,
    chapterPoints: CHAPTER_POINTS,
    chapterCaptions: CHAPTER_CAPTIONS,
    factionPhases: FACTION_PHASES,
  },
};
