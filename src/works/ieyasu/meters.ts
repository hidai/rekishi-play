// ★1 "Your Ieyasu" meters. Choices aren't right/wrong; they nudge the "color" of the portrait.
// Three axes chosen so the portrait can NOT settle into either trap of design §0-4: 待つ力 alone
// would rebuild the「我慢強い神君」the research warned against (§6), so it runs beside 人を見る目
// (why he could use a former enemy) and ゆずらぬ心 (why the same man ended his own lord's house).
// The balanced landing says out loud that 「律儀者」does not cover him.
// ⚠️ Local save only.
import type { MetersConfig } from '../../engine/types';

export const METERS: MetersConfig = {
  title: 'きみの 家康',
  defs: [
    {
      key: 'matsu',
      icon: '🕰',
      label: '待つ 力',
      summary: 'とりわけ ころあいを 待ち、機が 熟してから 動く、しんぼう強い 人に 育った',
      progress: 'だんだん じっと 待てるように なってきた',
    },
    {
      key: 'hito',
      icon: '👁',
      label: '人を 見る 目',
      summary: 'とりわけ 人の 力を 見ぬき、かつて 敵だった 者まで 使いこなす 人に 育った',
      progress: 'だんだん 人の 力が 見えるように なってきた',
    },
    {
      key: 'yuzuranu',
      icon: '⛰',
      label: 'ゆずらぬ 心',
      summary: 'とりわけ 一度 決めたら、身内にも あるじにも ゆずらない、こわいほど 強い 人に 育った',
      progress: 'だんだん 決めたら ゆずらなく なってきた',
    },
  ],
  balanced:
    '待つ 力・人を 見る 目・ゆずらぬ 心を どれも あわせ持つ、「律儀者」の ひと言では 片づかない 大きな 男に 育った',
  progressBalanced: '待つ 力・人を 見る 目・ゆずらぬ 心を バランスよく のばして きた',
};
