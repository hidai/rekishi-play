// ★D Character relation map (display-only). Draws the "web of relations" among existing cards,
// centered on Ieyasu. Adds no cards; edges connect as the player collects cards.
// The axis is research §4-10 / design §4: 今川（庇護者）→ 信長（同盟20年）→ 秀吉（臣従、のち滅ぼす）
// — three lords walked through in one gold line, so riddle A ("why did the 律儀者 destroy the house
// he served longest?") reads at a glance. 死なせた家族 hangs off it as the counterweight.
// The 神に した 人 category holds exactly one person on purpose: the thing that made him a 神君
// happened AFTER he died, by someone else's hand — that is riddle B, stated as a shape.
//
// Keep `rel` labels to ~8 glyph-widths. The ring packs 13 nodes, so a longer label runs across a
// neighbour's portrait (tests/relation-map.test.ts gates it). Let the category colour carry the
// verdict instead of the words: 淀殿・秀頼 read as 「仕えた 家の 母 / 遺児」 under the red 戦った 相手
// band, which says "he destroyed the house he served" as a shape — riddle A, without saying it.
//
// 秀吉 is the one label that keeps an explicit object (「家を」), and it must: 11 of the 13 labels
// are noun phrases answering "who is this person to 家康", so a bare 「のち ほろぼす」 lets the
// reader take the default object from the face printed right above it — 秀吉 himself. He died of
// illness in 1598; the house fell in 1615. That 17-year gap IS riddle A, so the misreading does
// not just add an error, it collapses the question. 淀殿・秀頼's 「仕えた 家の」 does resolve it, but
// only by inference from the far side of the ring, long after the local misread has fired.
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  cats: [
    { key: 'shukun', label: '渡り歩いた あるじ・同盟者', color: '#bd8a28' }, // 金
    { key: 'kazoku', label: '死なせた 家族', color: '#8a5a86' }, // 紫
    { key: 'teki', label: '戦った 相手', color: '#b23a2e' }, // 朱
    { key: 'kashin', label: '見こんで 使った 家来', color: '#3f7a5a' }, // 緑
    { key: 'kami', label: '神に した 人', color: '#5b5346' }, // 灰
  ],
  // Relations seen from Ieyasu (center). pid is a card id.
  edges: [
    { pid: 'p-yoshimoto', rel: '八さいから あずけた 相手', cat: 'shukun' },
    { pid: 'p-nobunaga', rel: '20年の 同盟者', cat: 'shukun' },
    { pid: 'p-hideyoshi', rel: '頭を 下げ、のち 家を ほろぼす', cat: 'shukun' },
    { pid: 'p-tsukiyama', rel: '正室', cat: 'kazoku' },
    { pid: 'p-nobuyasu', rel: '嫡男', cat: 'kazoku' },
    { pid: 'p-shingen', rel: '大敗した 相手', cat: 'teki' },
    { pid: 'p-mitsunari', rel: '関ヶ原の 敵将', cat: 'teki' },
    { pid: 'p-hideaki', rel: '寝返った 若者', cat: 'teki' },
    { pid: 'p-yodo', rel: '仕えた 家の 母', cat: 'teki' },
    { pid: 'p-hideyori', rel: '仕えた 家の 遺児', cat: 'teki' },
    { pid: 'p-masanobu', rel: '許して 使った 元敵', cat: 'kashin' },
    { pid: 'p-hanzo', rel: '「忍者に 守られた」話の 主', cat: 'kashin' },
    { pid: 'p-tenkai', rel: '死後に 名づけた', cat: 'kami' },
  ],
};
