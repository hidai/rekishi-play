// Assembles the "katsu" (勝海舟) Work object (skeleton).
// Registered in src/works/index.ts (WORKS) as work 3, behind the work-select flow.
// Story scenes are still placeholders; per-chapter authoring (pilot = ch3) comes next.
// The modern face vocabulary (①: 洋装/散切り/軍服 heads) is still placeholder — those heads
// need raster visual-check, so their real implementation is deferred to an attended run.
import type { Work } from '../../engine/types';
import { GEO } from '../../shared/geoJapan';
import { STORY } from './story/index';
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
  GEOS,
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

export const katsu: Work = {
  id: 'katsu',
  faceHintKey: FACE_HINT_KEY,
  // flagPrefix omitted → defaults to id ('katsu'); no collision with hidenaga's 'hd'.
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  // 勝家 crest (丸に剣花菱); the monKenhanabishi icon now lives in engine/art/icons.ts.
  // Geometry is SVG self-checked (4-fold symmetric, within bounds); raster目視 pending (attended).
  mon: 'kenhanabishi',
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
  // figures (人の図: crew / credit — design §7-4) omitted; those Figure variants need engine
  // support and land in the 演出 phase.
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
