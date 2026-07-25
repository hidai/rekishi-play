// Timeline (TIMELINE, from research §2). Western years. Uncertain (△/☆) items avoid assertion
// with "諸説／〜とされる". Listed chronologically; the ch tag groups an entry to its chapter (ch6
// and ch7 overlap in time, so the tag is not strictly monotonic). Hand-managed.
import type { TimelineEntry } from '../../engine/types';

export const TIMELINE: TimelineEntry[] = [
  { y: '1823', ch: 1, key: true, t: '海舟 生まれる', d: '江戸・本所で、貧乏旗本・勝小吉の 子に。幼名 麟太郎。' },
  { y: '1853', ch: 2, t: 'ペリー来航／海防を 建白', d: '黒船を 前に、幕府が 求めた 海防の 意見に 応じ、登用の 糸口に。' },
  { y: '1855', ch: 2, t: '長崎 海軍伝習所で 学ぶ', d: 'オランダ人 教官に 航海・砲術を まなぶ（〜1859）。' },
  { y: '1860', ch: 3, key: true, t: '咸臨丸で 太平洋を わたる', d: '日本の 船で 渡米。実際の 操船は 同乗の 米士官が 主導したと 記録に 残る。' },
  { y: '1862', ch: 4, t: '坂本龍馬が 入門', d: '脱藩浪士の 龍馬が 弟子に。海軍構想の 右腕へ。' },
  { y: '1864', ch: 4, key: true, t: '神戸 海軍操練所を ひらく', d: '諸藩士・脱藩浪士まで 一つの 船に。翌年 罷免され 蟄居。' },
  { y: '1868', ch: 5, key: true, t: '江戸 無血開城', d: '鳥羽・伏見の 敗戦後、西郷らとの 交渉で 総攻撃を 回避。江戸を 戦火から 救う。' },
  { y: '1872', ch: 6, t: '明治政府に 出仕', d: '海軍卿ほか。旧幕臣の 救済、慶喜らの 名誉回復に 動く。' },
  { y: '1879', ch: 7, t: '西郷留魂詩碑を 建てる', d: '西南戦争で 逆賊と された 旧知の 西郷を、私費で 弔う。' },
  { y: '1891', ch: 6, t: '福澤『瘠我慢の説』', d: '「二君に 仕えぬ のが 筋」と 海舟の 出処進退を 批判（公表は のち）。' },
  { y: '1899', ch: 7, death: true, t: '海舟、死す', d: '脳溢血で 急死。享年77。晩年の 談話は『氷川清話』などに 残る。' },
];
