// アプリが実行時に見る作品レジストリ。一覧に要る `card`（meta + faces）だけを即時 import し、
// 本体（story/map/cards＝作品あたり 100KB 超）は選ばれてから `load()` で取る。
// 作品追加はここと ./index.ts の両方に 1 件（tests/work-registry.test.ts が一致を pin する）。
import type { WorkEntry } from '../engine/types';

import { PROTAGONIST_ID as HIDENAGA_PID, STRINGS as HIDENAGA_STRINGS, TOTAL_CHAPTERS as HIDENAGA_CHAPTERS } from './hidenaga/meta';
import { FACE_SPEC as HIDENAGA_FACES } from './hidenaga/faces';
import { PROTAGONIST_ID as KIYOMORI_PID, STRINGS as KIYOMORI_STRINGS, TOTAL_CHAPTERS as KIYOMORI_CHAPTERS } from './kiyomori/meta';
import { FACE_SPEC as KIYOMORI_FACES } from './kiyomori/faces';
import { PROTAGONIST_ID as KATSU_PID, STRINGS as KATSU_STRINGS, TOTAL_CHAPTERS as KATSU_CHAPTERS } from './katsu/meta';
import { FACE_SPEC as KATSU_FACES } from './katsu/faces';
import { PROTAGONIST_ID as IEYASU_PID, STRINGS as IEYASU_STRINGS, TOTAL_CHAPTERS as IEYASU_CHAPTERS } from './ieyasu/meta';
import { FACE_SPEC as IEYASU_FACES } from './ieyasu/faces';
import { PROTAGONIST_ID as DAVINCI_PID, STRINGS as DAVINCI_STRINGS, TOTAL_CHAPTERS as DAVINCI_CHAPTERS } from './davinci/meta';
import { FACE_SPEC as DAVINCI_FACES } from './davinci/faces';
import { PROTAGONIST_ID as MASAKO_PID, STRINGS as MASAKO_STRINGS, TOTAL_CHAPTERS as MASAKO_CHAPTERS } from './masako/meta';
import { FACE_SPEC as MASAKO_FACES } from './masako/faces';
import { PROTAGONIST_ID as SHIBUSAWA_PID, STRINGS as SHIBUSAWA_STRINGS, TOTAL_CHAPTERS as SHIBUSAWA_CHAPTERS } from './shibusawa/meta';
import { FACE_SPEC as SHIBUSAWA_FACES } from './shibusawa/faces';

export const WORK_ENTRIES: WorkEntry[] = [
  {
    card: {
      id: 'hidenaga',
      protagonistId: HIDENAGA_PID,
      faces: HIDENAGA_FACES,
      titleMain: HIDENAGA_STRINGS.titleMain,
      titleSub: HIDENAGA_STRINGS.titleSub,
      years: HIDENAGA_STRINGS.years,
      totalChapters: HIDENAGA_CHAPTERS,
    },
    load: () => import('./hidenaga/index').then((m) => m.hidenaga),
  },
  {
    card: {
      id: 'kiyomori',
      protagonistId: KIYOMORI_PID,
      faces: KIYOMORI_FACES,
      titleMain: KIYOMORI_STRINGS.titleMain,
      titleSub: KIYOMORI_STRINGS.titleSub,
      years: KIYOMORI_STRINGS.years,
      totalChapters: KIYOMORI_CHAPTERS,
    },
    load: () => import('./kiyomori/index').then((m) => m.kiyomori),
  },
  {
    card: {
      id: 'katsu',
      protagonistId: KATSU_PID,
      faces: KATSU_FACES,
      titleMain: KATSU_STRINGS.titleMain,
      titleSub: KATSU_STRINGS.titleSub,
      years: KATSU_STRINGS.years,
      totalChapters: KATSU_CHAPTERS,
    },
    load: () => import('./katsu/index').then((m) => m.katsu),
  },
  {
    card: {
      id: 'ieyasu',
      protagonistId: IEYASU_PID,
      faces: IEYASU_FACES,
      titleMain: IEYASU_STRINGS.titleMain,
      titleSub: IEYASU_STRINGS.titleSub,
      years: IEYASU_STRINGS.years,
      totalChapters: IEYASU_CHAPTERS,
    },
    load: () => import('./ieyasu/index').then((m) => m.ieyasu),
  },
  {
    card: {
      id: 'davinci',
      protagonistId: DAVINCI_PID,
      faces: DAVINCI_FACES,
      titleMain: DAVINCI_STRINGS.titleMain,
      titleSub: DAVINCI_STRINGS.titleSub,
      years: DAVINCI_STRINGS.years,
      totalChapters: DAVINCI_CHAPTERS,
    },
    load: () => import('./davinci/index').then((m) => m.davinci),
  },
  {
    card: {
      id: 'masako',
      protagonistId: MASAKO_PID,
      faces: MASAKO_FACES,
      titleMain: MASAKO_STRINGS.titleMain,
      titleSub: MASAKO_STRINGS.titleSub,
      years: MASAKO_STRINGS.years,
      totalChapters: MASAKO_CHAPTERS,
    },
    load: () => import('./masako/index').then((m) => m.masako),
  },
  {
    card: {
      id: 'shibusawa',
      protagonistId: SHIBUSAWA_PID,
      faces: SHIBUSAWA_FACES,
      titleMain: SHIBUSAWA_STRINGS.titleMain,
      titleSub: SHIBUSAWA_STRINGS.titleSub,
      years: SHIBUSAWA_STRINGS.years,
      totalChapters: SHIBUSAWA_CHAPTERS,
    },
    load: () => import('./shibusawa/index').then((m) => m.shibusawa),
  },
];
