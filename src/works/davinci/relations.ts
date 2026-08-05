// ★D Character relation map (display-only). Draws the "web of relations" among existing cards,
// centered on Leonardo. Adds no cards; edges connect as the player collects cards.
// The axis is research §4-9 / design §2: NOT a 力の系図 (power genealogy) but the network of one head
// — 師 who grew his eye, the patrons he moved court to court between, the rival he raced, the pupils
// he kept. This mirrors the work's central metaphor (手記＝つながりの網) at the relation-map level.
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  cats: [
    { key: 'shi', label: '目を 育てた 師', color: '#4e7a5b' }, // 緑
    { key: 'patron', label: '渡り歩いた 宮廷・庇護者', color: '#bd8a28' }, // 金
    { key: 'raival', label: '競い合った 好敵手', color: '#b53d2e' }, // 朱
    { key: 'deshi', label: '手もとに 置いた 弟子', color: '#31608c' }, // 藍
  ],
  // Relations seen from Leonardo (center). pid is a card id.
  // rel labels stay short: they sit on a radial ring and long text overflows / collides
  // (tests/relation-map.test.ts) — and quotes escape to &quot;, which inflates the measured width.
  edges: [
    { pid: 'p-verrocchio', rel: '目を 育てた 師', cat: 'shi' },
    { pid: 'p-ludovico', rel: '17年 仕えた 庇護者', cat: 'patron' },
    { pid: 'p-cesare', rel: '仕えた「暴君」', cat: 'patron' },
    { pid: 'p-giuliano', rel: 'ローマの 庇護者', cat: 'patron' },
    { pid: 'p-francois', rel: '最期を 敬った 王', cat: 'patron' },
    { pid: 'p-michelangelo', rel: '壁を 競った 好敵手', cat: 'raival' },
    { pid: 'p-salai', rel: '手放さない 弟子', cat: 'deshi' },
    { pid: 'p-melzi', rel: '手記を 託した 弟子', cat: 'deshi' },
  ],
};
