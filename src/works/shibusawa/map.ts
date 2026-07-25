// Map data (skeleton stage). shibusawa は「近代＝地図の文法が変わる」作品として設計されている
// (research §5 / design §0-4・§3): 力は 藩の 面（令制国ポリゴン）でなく、**会社・鉄道・港・銀行の
// 点のネットワーク**に宿る。ゆえに TERRITORY は塗らず（近代日本を令制国で塗らない）、地図が主装置に
// 立つのは章三（欧州＝davinci の GEO_EUROPE を借りる）と章四（会社の点＝MapPoint の散布）の2章だけ。
//
// campaign-map の層（TERRITORY / MAPPOINTS / FACTION_PHASES）は骨組みでは空。会社/鉄道を別アイコンで
// 描き分けない——「約500社」を暗記させない（design §3-4）。会社の点は MapPoint（revealCh で章ごと増加）で、
// 章四の執筆時に足す。territory は空のまま（近代は塗らない・既存機能。design §4②）。
//
// SKELETON SCOPE: SCENE_MAPS は空。シーン地図は各章と一緒に書く（開幕アンカーの原則は、その
// シーンの開幕状況が先に無いと決められない）。欧州は GEO_EUROPE、渡米西海岸は GEO_US_WEST/PACIFIC を
// scene map 側で借用する（design §9・engine 拡張ゼロ）。Hand-managed.
/* eslint-disable */

import type {
  MapPoint,
  GazPoint,
  RouteDef,
  SceneMapDef,
  CampaignRoute,
  FactionPhase,
} from '../../engine/types';

// No campaign-map / territory layer at skeleton stage (see header).
export const TERRITORY: Record<string, number> = {};
export const PROTAGONIST_DOMAINS: Record<string, number[]> = {};
export const ROUTES: Record<string, RouteDef> = {};
export const CAMPAIGN_ROUTES: CampaignRoute[] = [];
export const FACTION_PHASES: FactionPhase[] = [];
export const MAPLABELS: Record<string, string> = {};
export const MAPPOINTS: MapPoint[] = [];

/** 栄一の生涯の地点、実 [lon,lat]（research §5）。一人の百姓が世界（パリ）まで出て日本へ戻る円環。 */
export const GAZ: Record<string, GazPoint> = {
  // 血洗島（深谷）— 藍の 家。ここから すべてが 始まる (ch1)。
  chiharajima: { lon: 139.2814, lat: 36.1975 },
  // 横浜 — 攘夷の 標的、そして 開港場（渡欧の 出発港）(ch1 計画 / ch3 出発)。
  yokohama: { lon: 139.6425, lat: 35.4437 },
  // 京 — 一橋家への 仕官 (ch2)。
  kyoto: { lon: 135.7681, lat: 35.0116 },
  // 東京（兜町）— 第一国立銀行、実業の 拠点。作品後半の 中心 (ch4-7)。
  tokyo: { lon: 139.7767, lat: 35.6811 },
  // 静岡 — 帰国後、隠棲する 慶喜のもと・商法会所 (ch3 むすび)。
  shizuoka: { lon: 138.3831, lat: 34.9769 },
  // パリ — 1867年の 渡欧 (ch3)。scene map で GEO_EUROPE を借りて描く（bounds 内）。
  paris: { lon: 2.3522, lat: 48.8566 },
};

// Per-scene maps are authored together with each chapter (see header).
export const SCENE_MAPS: Record<string, SceneMapDef> = {};
