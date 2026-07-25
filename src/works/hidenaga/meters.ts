// ★1「きみの秀長」メーター。選択が正解/不正解ではなく、"人物像の色"を少しずつ変える。
// 各章の 2択に effect（key→増分）を付け、終章の締めを最も高いメーターで 1 文だけ変える。
// ⚠️ ローカル保存のみ。
import type { MetersConfig } from '../../engine/types';

export const METERS: MetersConfig = {
  title: 'きみの 秀長',
  defs: [
    {
      key: 'kizuna',
      icon: '🤝',
      label: '兄との 絆',
      summary: 'とりわけ 兄・秀吉との 絆を 何より 大切に する、兄思いの 弟に 育った',
      progress: 'だんだん 兄思いの 弟に なってきた',
    },
    {
      key: 'kuni',
      icon: '🌾',
      label: '国の ゆたかさ',
      summary: 'とりわけ 民の くらしを ゆたかに する、国づくりの 名手に 育った',
      progress: 'だんだん 民思いの 国づくり上手に なってきた',
    },
    {
      key: 'shinrai',
      icon: '🕊️',
      label: 'まわりの 信頼',
      summary: 'とりわけ 敵味方から たよりに される、天下一の 調停役に 育った',
      progress: 'だんだん たよりに される 調停役に なってきた',
    },
  ],
  balanced: '絆・国・信頼を どれも バランスよく そなえた、まさに 日本一の 補佐役に 育った',
  progressBalanced: '絆・国・信頼を バランスよく のばして きた',
};
