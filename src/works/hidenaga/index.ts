// 作品「ひでなが」の Work オブジェクト組み立て。
// データ層（逐語抽出）＋ meta（作品固有定数）を Work / WorkMap 契約に束ねる。
import type { Work } from '../../engine/types';
import { GEO } from '../../shared/geoJapan';
import { STORY } from './story/index';
import { CARDS } from './cards';
import { CLUES } from './clues';
import { TIMELINE } from './timeline';
import { FACE_SPEC, PROTAGONIST_FACE_BY_CH, PROTAGONIST_STAGES, SCENE_FACE_OVERRIDES } from './faces';
import { METERS } from './meters';
import { RELATIONS } from './relations';
import {
  TERRITORY,
  HIDENAGA_DOMAIN,
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
  PEOPLE_EXTRA,
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

export const hidenaga: Work = {
  id: 'hidenaga',
  faceHintKey: FACE_HINT_KEY,
  // Keep the historical 'hd_*' one-time flag keys so family devices don't replay reveals.
  flagPrefix: 'hd',
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  sceneFaceOverrides: SCENE_FACE_OVERRIDES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  mon: 'omodaka',
  finalMon: 'kiri',
  riddle: RIDDLE,
  story: STORY,
  cards: CARDS,
  clues: CLUES,
  timeline: TIMELINE,
  faces: FACE_SPEC,
  shortNames: SHORT_NAMES,
  peopleExtra: PEOPLE_EXTRA,
  strings: STRINGS,
  hidden: HIDDEN,
  meters: METERS,
  relations: RELATIONS,
  map: {
    geo: GEO,
    territory: TERRITORY,
    protagonistDomains: HIDENAGA_DOMAIN,
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
