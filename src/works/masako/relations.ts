// ★D Character relation map (display-only). Draws the web of ties around Masako. Adds no cards;
// edges resolve as the player collects cards. 本作は「力が 縁と 家に 宿る」人物なので、この図は
// 添え物ではなく主装置の一つ（design §3）。
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  cats: [
    { key: 'hojo', label: '北条の 家', color: '#31608c' }, // 藍
    { key: 'genji', label: '源氏（夫と 子ら）', color: '#b23a2e' }, // 朱
    { key: 'kyo', label: '京の 側', color: '#8a5a86' }, // 紫
    { key: 'gokenin', label: '鎌倉の 御家人', color: '#5b5346' }, // 灰
  ],
  edges: [
    { pid: 'p-yoritomo', rel: '夫', cat: 'genji' },
    { pid: 'p-ohime', rel: '長女', cat: 'genji' },
    { pid: 'p-yoriie', rel: '長男（廃した 子）', cat: 'genji' },
    { pid: 'p-sanman', rel: '次女', cat: 'genji' },
    { pid: 'p-sanetomo', rel: '次男（歌を 残した 子）', cat: 'genji' },
    { pid: 'p-kugyo', rel: '孫', cat: 'genji' },
    { pid: 'p-tokimasa', rel: '父（追った 父）', cat: 'hojo' },
    { pid: 'p-yoshitoki', rel: '弟', cat: 'hojo' },
    { pid: 'p-yasutoki', rel: '甥', cat: 'hojo' },
    { pid: 'p-gotoba', rel: '戦った 上皇', cat: 'kyo' },
    { pid: 'p-kaneko', rel: '京の 交渉相手', cat: 'kyo' },
    { pid: 'p-yoshimura', rel: '読めない 御家人', cat: 'gokenin' },
    { pid: 'p-kagemori', rel: '言葉を 読みあげた 人', cat: 'gokenin' },
    { pid: 'p-yoshikazu', rel: '頼家の 後ろだて', cat: 'gokenin' },
    { pid: 'p-kagetoki', rel: '夫の 目と 耳', cat: 'gokenin' },
  ],
};
