// ★D 人物相関図（表示専用）。秀長を中心に、既存カード16枚のうち人物どうしの
// 「関係の網」を描く。カードは一切足さない（セーブ互換に影響なし）。
// プレイでカードを集めるほど線がつながっていく（buildRelationMap が collected で解決）。
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  // 関係のカテゴリ（色分け＝関係の"種類"を子どもに見せる）。
  cats: [
    { key: 'family', label: '家族', color: '#4e7a5b' }, // 母
    { key: 'lord', label: 'あるじ・兄', color: '#b9862a' }, // brother and the lord he served
    { key: 'vassal', label: '家来・補佐', color: '#2f5981' }, // 支えてくれた人
    { key: 'foe', label: '降した敵', color: '#b23a2e' }, // 攻め従えた相手
    { key: 'ally', label: '支えた相手', color: '#5b5346' }, // 頼ってきた人・跡継ぎ
  ],
  // 秀長（中心）から見た関係。pid はカード id。
  edges: [
    { pid: 'p-hideyoshi', rel: '兄', cat: 'lord' },
    { pid: 'p-naka', rel: '母', cat: 'family' },
    { pid: 'p-nobunaga', rel: '兄の あるじ', cat: 'lord' },
    { pid: 'p-takatora', rel: '家来', cat: 'vassal' },
    { pid: 'p-rikyu', rel: 'もう一人の 補佐', cat: 'vassal' },
    { pid: 'p-motochika', rel: '降した 敵（四国）', cat: 'foe' },
    { pid: 'p-yoshihisa', rel: '降した 敵（九州）', cat: 'foe' },
    { pid: 'p-sorin', rel: '頼ってきた 大名', cat: 'ally' },
    { pid: 'p-hidetsugu', rel: '甥（兄の 跡継ぎ）', cat: 'ally' },
  ],
};
