// ★D Character relation map (display-only, design §3-3). Draws the "web of relations" among
// existing cards, centered on Kiyomori. Adds no cards; edges connect as the player collects
// cards (buildRelationMap resolves against collected).
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  // Relation categories (color = the "kind" of tie). A signpost through the tangled
  // insei-era power structure (C3).
  cats: [
    { key: 'ichimon', label: '平家一門', color: '#31608c' }, // 藍
    { key: 'choutei', label: '院・天皇（朝廷）', color: '#8a5a86' }, // 紫
    { key: 'genji', label: '源氏（武の 敵味方）', color: '#b23a2e' }, // 朱
    { key: 'kingshin', label: '院近臣・その他', color: '#5b5346' }, // 灰
  ],
  // Relations seen from Kiyomori (center). pid is a card id.
  edges: [
    { pid: 'p-tadamori', rel: '父', cat: 'ichimon' },
    { pid: 'p-tokiko', rel: '妻', cat: 'ichimon' },
    { pid: 'p-shigemori', rel: '嫡男', cat: 'ichimon' },
    { pid: 'p-tokuko', rel: '娘', cat: 'ichimon' },
    { pid: 'p-tomomori', rel: '子（水軍の 将）', cat: 'ichimon' },
    { pid: 'p-goshirakawa', rel: '生涯の 好敵手', cat: 'choutei' },
    { pid: 'p-sutoku', rel: '破った もとの 天皇（保元）', cat: 'choutei' },
    { pid: 'p-takakura', rel: '娘婿の 天皇', cat: 'choutei' },
    { pid: 'p-antoku', rel: '孫（幼帝）', cat: 'choutei' },
    { pid: 'p-mochihito', rel: '挙兵した 皇子', cat: 'choutei' },
    { pid: 'p-yoshitomo', rel: '武の 宿敵（平治）', cat: 'genji' },
    { pid: 'p-yoritomo', rel: '助けた 敵の 子', cat: 'genji' },
    { pid: 'p-yoshitsune', rel: '平家を 滅ぼす 敵', cat: 'genji' },
    { pid: 'p-shunkan', rel: '流した 院近臣', cat: 'kingshin' },
  ],
};
