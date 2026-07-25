// Assembles the "masako" (北条政子) Work object.
// Design: docs/design/masako.md; facts: docs/research/masako.md.
//
// SHIPPED: all 7 chapters content-complete and every scene carries an authored main visual
// (30/30), so masako is registered in src/works/index.ts (WORKS) and registry.ts and no longer
// sits in SKELETON_WORKS (scripts/lib/works.ts).
//
// FIRST WOMAN PROTAGONIST. The device grammar follows from that and from the geography, not from
// habit: her power lives in 縁と家 (ties and house), not in land, and 鎌倉's landmarks sit 1〜2km
// apart — under the engine's minimum map frame — so 人の図 is the main device and the map is
// demoted to one chapter (design §3 / WRITING 企画フェーズのチェック).
//
// figures (人の図): the lineage figure `en` debuts in the pilot chapter (章三 むすび 3-d), where
// the first ties break — the figure's cut edges use `LineageEdge.cutCh` (added to the engine last
// cycle). It grows/severs across chapters via node `fromCh` / edge `cutCh` (see figures.ts).
//
// Structural integrity is covered by tests/masako-skeleton.test.ts + the shared ALL_WORKS gates.
import type { Work } from '../../engine/types';
import { GEO } from '../../shared/geoJapan';
import { STORY } from './story/index';
import { FIGURES } from './figures';
import { CARDS } from './cards';
import { CLUES } from './clues';
import { TIMELINE } from './timeline';
import { FACE_SPEC, PROTAGONIST_FACE_BY_CH, PROTAGONIST_STAGES } from './faces';
import { METERS } from './meters';
import { RELATIONS } from './relations';
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

export const masako: Work = {
  id: 'masako',
  faceHintKey: FACE_HINT_KEY,
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  // 三つ鱗 = the Hojo crest, added to the MON registry this cycle. Solid wedges (no thin detail)
  // so it survives the topbar's real 22px — the aoi lesson (engine/art/icons.ts).
  mon: 'mitsuuroko',
  riddle: RIDDLE,
  story: STORY,
  figures: FIGURES,
  cards: CARDS,
  clues: CLUES,
  timeline: TIMELINE,
  faces: FACE_SPEC,
  shortNames: SHORT_NAMES,
  peopleExtra: {},
  strings: STRINGS,
  hidden: HIDDEN,
  meters: METERS,
  relations: RELATIONS,
  map: {
    geo: GEO,
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
