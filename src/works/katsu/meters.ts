// ★1 "Your Katsu" meters (design §5). Choices aren't right/wrong; they nudge the "color" of the
// portrait. Three axes — world (sekai) / nerve (kimo) / one's own line (suji) — keep the figure
// from collapsing into the single word "traitor".
// ⚠️ Local save only.
import type { MetersConfig } from '../../engine/types';

export const METERS: MetersConfig = {
  title: 'きみの 海舟',
  defs: [
    {
      key: 'sekai',
      icon: '🌊',
      label: '世界を 見る 目',
      summary: 'とりわけ 国の 外へ 目を むけ、新しい ものを 学びとる、開国の 先を 行く 人に 育った',
      progress: 'だんだん 世界に 目が ひらいてきた',
    },
    {
      key: 'kimo',
      icon: '🤝',
      label: '度胸と かけひき',
      summary: 'とりわけ 度胸が すわり、敵にも 信を 置いて 話を つける、交渉の 名手に 育った',
      progress: 'だんだん 肝が すわってきた',
    },
    {
      key: 'suji',
      icon: '🧭',
      label: '自分の 筋',
      summary: 'とりわけ 人の 評価に 流されず、自分で 決めた 筋を 通す、反骨の 人に 育った',
      progress: 'だんだん 自分の 筋が 通ってきた',
    },
  ],
  balanced:
    '世界を 見る 目・度胸・自分の 筋を どれも あわせ持つ、"裏切り者"の ひと言では 片づかない 大きな 男に 育った',
  progressBalanced: '世界・度胸・筋を バランスよく のばして きた',
};
