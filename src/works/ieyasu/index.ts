// Assembles the "ieyasu" (徳川家康) Work object (skeleton-2 = registered).
// Design: docs/design/ieyasu.md (human GO 2026-07-15); facts: docs/research/ieyasu.md.
//
// Registered in src/works/index.ts (WORKS) as work 4, behind the work-select flow. Story scenes
// are still placeholders; the pilot chapter (ch2 三方ヶ原, design §8) is authored next and fixes
// the work's register via /eval-work, then the rest are written one per cycle.
//
// Structural integrity and the experience budget run over this work via tests/helpers/all-works.ts
// (ALL_WORKS); ieyasu-specific contracts live in tests/ieyasu-skeleton.test.ts.
import type { Work } from '../../engine/types';
import { STORY } from './story/index';
import { CARDS } from './cards';
import { CLUES } from './clues';
import { TIMELINE } from './timeline';
import { FACE_SPEC, PROTAGONIST_FACE_BY_CH, PROTAGONIST_STAGES } from './faces';
import { METERS } from './meters';
import { RELATIONS } from './relations';
import { FIGURES } from './figures';
import {
  GEO_IEYASU,
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

export const ieyasu: Work = {
  id: 'ieyasu',
  faceHintKey: FACE_HINT_KEY,
  // flagPrefix omitted → defaults to id ('ieyasu'); no collision with hidenaga's 'hd'.
  totalChapters: TOTAL_CHAPTERS,
  protagonistId: PROTAGONIST_ID,
  protagonistFacesByChapter: PROTAGONIST_FACE_BY_CH,
  protagonistStages: PROTAGONIST_STAGES,
  titleKnownFaces: TITLE_KNOWN_FACES,
  // 徳川家の三つ葉葵; the monAoi icon now lives in engine/art/icons.ts (raster-checked at both
  // real sizes — 96px title / 22px topbar — via scripts/render-mon.ts).
  mon: 'aoi',
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
  // 人の図: ch5's 布陣 board (design §2「布陣＋論争 reveal」). ch4's planned 主君遍歴図 was
  // resolved by the relations map's shukun band + the 4-c2 closeup instead.
  figures: FIGURES,
  map: {
    geo: GEO_IEYASU,
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
