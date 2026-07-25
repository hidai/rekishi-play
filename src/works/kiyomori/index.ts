// Assembles the "kiyomori" (Taira no Kiyomori) Work object (skeleton).
// Registered in src/works/index.ts (WORKS) as work 2, behind the work-select flow.
// Story scenes are still placeholders; per-chapter authoring comes next.
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

export const kiyomori: Work = {
  id: 'kiyomori',
  faceHintKey: FACE_HINT_KEY,
  // flagPrefix omitted → defaults to id ('kiyomori'); no collision with hidenaga's 'hd'.
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  mon: 'agehacho',
  finalMon: 'agehacho',
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
  figures: FIGURES,
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
