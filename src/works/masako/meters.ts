// ★1「きみの 政子」メーター。選択に 正解・不正解は なく、肖像の「色」だけが 動く。
// 三つの 軸——母（はは）/ 家（いえ）/ 声（こえ）——は design §1 の A（母で ありながら 家を
// 続ける 人）を、そのまま 目に 見える 形に した もの。どれかに 寄っても、寄らなくても よい。
// ⚠️ Local save only.
import type { MetersConfig } from '../../engine/types';

export const METERS: MetersConfig = {
  title: 'きみの 政子',
  defs: [
    {
      key: 'haha',
      icon: '🌾',
      label: '母としての 情',
      summary: 'とりわけ 子や 身内の そばに 立つ ことを 選びつづけた、情の 人に なった',
      progress: 'だんだん 身内の そばに 立つ 人に なってきた',
    },
    {
      key: 'ie',
      icon: '🏯',
      label: '家を 続ける つよさ',
      summary: 'とりわけ 家と 鎌倉を 続かせる ことを 選びつづけた、決める 人に なった',
      progress: 'だんだん 家を 続かせる ほうを 選ぶように なってきた',
    },
    {
      key: 'koe',
      icon: '🗣️',
      label: '自分の 声で 言う つよさ',
      summary: 'とりわけ 自分の 口で 言う ことを 選びつづけた、前に 出る 人に なった',
      progress: 'だんだん 自分の 口で 言う 人に なってきた',
    },
  ],
  balanced: '母の 情も、家を 続ける つよさも、自分の 声も——どれも 手ばなさない 人に なった',
  progressBalanced: '母・家・声を バランスよく のばして きた',
};
