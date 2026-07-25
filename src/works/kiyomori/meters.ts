// ★1 "Your Kiyomori" meters (design §5). Choices aren't right/wrong; they nudge the "color"
// of the portrait. Three axes — sea (umi) / court (miyako) / compassion (nasake) — keep the
// figure from collapsing into the single word "arrogant villain".
// ⚠️ Local save only.
import type { MetersConfig } from '../../engine/types';

export const METERS: MetersConfig = {
  title: 'きみの 清盛',
  defs: [
    {
      key: 'umi',
      icon: '🌊',
      label: '海への こころざし',
      summary: 'とりわけ 海の 道を ひらく ことに かけた、新しもの好きの 開拓者に 育った',
      progress: 'だんだん 海に 目を むける 人に なってきた',
    },
    {
      key: 'miyako',
      icon: '🏛️',
      label: 'みやこでの したたかさ',
      summary: 'とりわけ 貴族の 作法を 使いこなす、みやこ仕込みの したたかな 策士に 育った',
      progress: 'だんだん みやこで 立ち回るのが うまく なってきた',
    },
    {
      key: 'nasake',
      icon: '🕊️',
      label: '身内・情への あつさ',
      summary: 'とりわけ 身内や 敵にも 情けを かける、人思いの 棟梁に 育った',
      progress: 'だんだん 情に あつい 人に なってきた',
    },
  ],
  balanced:
    '海・みやこ・情を どれも あわせ持つ、"悪人"の ひと言では 片づかない 大きな 男に 育った',
  progressBalanced: '海・みやこ・情を バランスよく のばして きた',
};
