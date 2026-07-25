// ★P 「人の図」データ（表示専用・章進行）。エンジン: src/engine/map/figure.ts。
// 席の図（court）＝公卿の席が章で藍に染まる／血の縁の図（bloodline）＝婚姻の線が皇統へ。
// 色は literal（テーマ非依存＝render-scene で忠実に出る）。手書き管理。
/* eslint-disable */

import type { Figure } from '../../engine/types';

const HEIKE = '#31608c'; // 藍：平家一門
const COURT = '#b6ab93'; // 石：藤原・その他の公卿
const IMPERIAL = '#8a5a86'; // 紫：帝・院（不変）

export const FIGURES: Record<string, Figure> = {
  // 装置1：朝廷の席の図。帝（紫）は不変、公卿の席だけが章で藍に染まる。
  // 3-d（ch3 むすび）=5席、5-a（ch5 栄華）=11席。席は象徴として14。
  court: {
    kind: 'assembly',
    title: '朝廷の 席の 図',
    caption: '席は、国を 動かす えらい人の いす',
    tally: 'heike',
    vb: [1000, 340],
    base: 'court',
    factions: [
      { key: 'heike', label: '平家一門', color: HEIKE },
      { key: 'court', label: '藤原・その他', color: COURT },
      { key: 'imperial', label: '帝・院', color: IMPERIAL },
    ],
    // Landscape "hall before the throne": 帝 (dais) at top center, 14 seats in two rows of
    // seven below. Seat ids (L0-L6 top row, R0-R6 bottom row) are unchanged so the章-progressed
    // fills still resolve; only the coordinates moved to the wide map-scale space.
    dais: { x: 500, y: 56, label: '帝', faction: 'imperial' },
    seats: [
      { id: 'L0', x: 90, y: 170 }, { id: 'L1', x: 227, y: 170 }, { id: 'L2', x: 363, y: 170 },
      { id: 'L3', x: 500, y: 170 }, { id: 'L4', x: 637, y: 170 }, { id: 'L5', x: 773, y: 170 },
      { id: 'L6', x: 910, y: 170 },
      { id: 'R0', x: 90, y: 290 }, { id: 'R1', x: 227, y: 290 }, { id: 'R2', x: 363, y: 290 },
      { id: 'R3', x: 500, y: 290 }, { id: 'R4', x: 637, y: 290 }, { id: 'R5', x: 773, y: 290 },
      { id: 'R6', x: 910, y: 290 },
    ],
    fills: [
      // ch3（1167 太政大臣）：清盛が最上席、嫡男・重盛、一門3席 = 5席が藍。
      { seat: 'L0', fromCh: 3, faction: 'heike', pid: 'p-kiyomori', label: '清盛' },
      { seat: 'L1', fromCh: 3, faction: 'heike', pid: 'p-shigemori', label: '重盛' },
      { seat: 'L2', fromCh: 3, faction: 'heike' },
      { seat: 'R0', fromCh: 3, faction: 'heike' },
      { seat: 'R1', fromCh: 3, faction: 'heike' },
      // ch5（1180 栄華）：一門がさらに席を占め = 11席が藍。知盛の顔が新たに現れる。
      { seat: 'R0', fromCh: 5, faction: 'heike', pid: 'p-tomomori', label: '知盛' },
      { seat: 'L3', fromCh: 5, faction: 'heike' },
      { seat: 'L4', fromCh: 5, faction: 'heike' },
      { seat: 'R2', fromCh: 5, faction: 'heike' },
      { seat: 'R3', fromCh: 5, faction: 'heike' },
      { seat: 'R4', fromCh: 5, faction: 'heike' },
      { seat: 'R5', fromCh: 5, faction: 'heike' },
    ],
  },
  // 装置2：血の縁の図。平家（左）が皇統（右）へ、徳子入内(ch3)で婚姻線、外孫・安徳の即位(ch6)で接ぐ。
  bloodline: {
    kind: 'lineage',
    title: '血の 縁の 図',
    caption: '金の 二本線は 夫婦の しるし',
    vb: [1000, 480],
    factions: [
      { key: 'heike', label: '平家の 血', color: HEIKE },
      { key: 'imperial', label: '皇統', color: IMPERIAL },
    ],
    // 系図の文法＝「父×母→子」（観察メモ 2026-07-13）。子の線は夫婦の婚姻線の中点から降りる。
    // Landscape: three generations spread wide (grandparents y=95, parents y=250, child y=405).
    nodes: [
      { id: 'kiyomori', x: 155, y: 95, pid: 'p-kiyomori', house: 'heike' },
      { id: 'tokiko', x: 395, y: 95, pid: 'p-tokiko', house: 'heike' },
      // 滋子（建春門院）＝時子の妹・高倉の母。顔・カードなしの名前ノードで足りる（観察メモ）。
      { id: 'shigeko', x: 620, y: 95, house: 'heike', label: '滋子' },
      { id: 'goshirakawa', x: 850, y: 95, pid: 'p-goshirakawa', house: 'imperial' },
      { id: 'tokuko', x: 280, y: 250, pid: 'p-tokuko', house: 'heike' },
      // 高倉＝帝（紫）に母・滋子の平家の血（藍のふち）＝安徳と同じ文法で一貫させる。
      { id: 'takakura', x: 720, y: 250, pid: 'p-takakura', house: 'imperial', ring: 'heike' },
      // 安徳＝帝（紫）に平家の血（藍のふち）。章6で現れる。
      { id: 'antoku', x: 500, y: 405, pid: 'p-antoku', house: 'imperial', ring: 'heike', fromCh: 6 },
    ],
    edges: [
      { from: 'kiyomori', to: 'tokiko', kind: 'marriage', fromCh: 1 },
      { from: 'shigeko', to: 'goshirakawa', kind: 'marriage', fromCh: 1 },
      { from: 'kiyomori', from2: 'tokiko', to: 'tokuko', kind: 'descent', fromCh: 1 },
      { from: 'goshirakawa', from2: 'shigeko', to: 'takakura', kind: 'descent', fromCh: 1 },
      { from: 'tokuko', to: 'takakura', kind: 'marriage', fromCh: 3 },
      { from: 'tokuko', from2: 'takakura', to: 'antoku', kind: 'descent', fromCh: 6 },
    ],
  },
};
