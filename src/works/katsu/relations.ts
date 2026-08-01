// ★D Character relation map (display-only, design §3-3). Draws the "web of relations" among
// existing cards, centered on Katsu. Adds no cards; edges connect as the player collects cards.
// The camps split left/right (幕府がわ ⇄ 新政府がわ) with the 海軍・弟子 line bridging them —
// so "why could a shogun's retainer end the shogunate?" reads at a glance (§3-3).
import type { WorkRelations } from '../../engine/types';

export const RELATIONS: WorkRelations = {
  cats: [
    { key: 'bakushin', label: '幕府がわ（幕臣）', color: '#31608c' }, // 藍
    { key: 'satsuma', label: '新政府がわ（薩長）', color: '#b23a2e' }, // 朱
    { key: 'kaigun', label: '海軍・弟子（垣根を こえた 海）', color: '#3f7a5a' }, // 緑
    { key: 'manabi', label: '学びと 声（師・批判者）', color: '#5b5346' }, // 灰
  ],
  // Relations seen from Katsu (center). pid is a card id.
  edges: [
    { pid: 'p-kokichi', rel: '父', cat: 'bakushin' },
    { pid: 'p-yoshinobu', rel: 'あるじ（最後の 将軍）', cat: 'bakushin' },
    { pid: 'p-oguri', rel: '主戦論の 同僚', cat: 'bakushin' },
    { pid: 'p-saigo', rel: '最も 信じた 敵将', cat: 'satsuma' },
    { pid: 'p-ryoma', rel: '弟子（脱藩浪士）', cat: 'kaigun' },
    { pid: 'p-tesshu', rel: '開城の 先行交渉者', cat: 'kaigun' },
    { pid: 'p-manjiro', rel: '世界を 知る 先例', cat: 'kaigun' },
    { pid: 'p-shozan', rel: '洋学の 師（縁つづき）', cat: 'manabi' },
    { pid: 'p-fukuzawa', rel: '「裏切り者」と 呼ぶ 声', cat: 'manabi' },
    { pid: 'p-brooke', rel: '咸臨丸を 動かした 士官', cat: 'manabi' },
  ],
};
