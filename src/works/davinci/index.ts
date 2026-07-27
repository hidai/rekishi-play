// Assembles the "davinci" (レオナルド・ダ・ヴィンチ) Work object.
// Design: docs/design/davinci.md (human GO 2026-07-16); facts: docs/research/davinci.md.
//
// SHIPPED: all 7 chapters content-complete → registered in src/works/index.ts (WORKS) and
// src/works/registry.ts. (This header sat on the skeleton-1b text long after registration; the
// stale「NOT in WORKS」was found by the code review of the shibusawa ship, 2026-07-27.)
//
// FIRST OVERSEAS WORK: the home stage is GEO_EUROPE (Italy + southern France), not the shared Japan
// GEO — Leonardo's life is a journey court to court across Renaissance Italy and into France.
//
// Structural integrity is covered by tests/davinci-skeleton.test.ts, which runs the shared
// registerWorkStructure helper directly (work-integrity.test.ts only walks registered WORKS).
import type { Work } from '../../engine/types';
import { GEO_EUROPE } from '../../shared/geoWorld';
import { STORY } from './story/index';
import { GRAPH } from './graph';
import { STUDIES } from './studies';
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

export const davinci: Work = {
  id: 'davinci',
  faceHintKey: FACE_HINT_KEY,
  // flagPrefix omitted → defaults to id ('davinci'); no collision with hidenaga's 'hd'.
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  // Leonardo had no family crest (design/JOURNAL 骨組み-1: 個人エンブレム). `vinci` = his own
  // geometry — the Vitruvian "squared circle" (a bold ring + inscribed square), added to the MON
  // registry (engine/art/icons.ts) this cycle. Legible at the topbar's real 22px (no thin detail).
  mon: 'vinci',
  riddle: RIDDLE,
  story: STORY,
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
  // graph (つながり図鑑) seeded by the ch6 pilot (design §5/§9): the observe hotspots in story 6-b put
  // stars on this board, and the sfumato link births an invention card. See ./graph.ts.
  graph: GRAPH,
  // studies (習作ページ) = the 4th main-visual kind, for the 自然を観る chapters (ch1). The ch1 observe
  // hotspots (story 1-b) ride on top of this手記. See ./studies.ts.
  studies: STUDIES,
  // figures (人の図) omitted: davinci's grammar is the graph, not the 席/血の図.
  map: {
    geo: GEO_EUROPE,
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
