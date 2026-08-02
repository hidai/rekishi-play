// ★P 人の図（席の図）。design §2 の 章二の装置＝「席の 色替え（百姓→一橋家臣→図らず幕臣へ 座が
// 動く）」。この 作品の 主題 A（立場は 何度も 変わった。芯は？）は、本文で 説明するより
// **座が 横へ ずれて いく 一枚**の ほうが 早い。
//
// 図の 芯は むすび（2-e）の 一行——「きみは 一歩も 動いて いない。上の 人が 動いた」。だから 上座
// （dais）に 将軍を 据える: 動いたのは 慶喜が すわった 席の ほうで、栄一は 同じ 場所に いたまま
// 幕臣に なった。座の 色は 血洗島（藍）→ 浪士（灰）→ 徳川（朱）。
//
// 顔は「いまの 座」だけに 置く（4つ 並べると 同じ 顔が 4回 出て 時間が 読めない）。過去の 座は
// 色と role ラベルだけ——通って きた 席が 残る ことが、この 図の 語る ことだから。
// 章四以降で 座が また 動いたら、この 図を 増やさず **別キーの 図**を 起こす（masako seat/seatEnd の
// 先例）。空席を 先に 見せると、まだ 読んで いない 先を 見せる ことに なる（WRITING 地図書法1）。
import type { Figure } from '../../engine/types';

const AI = '#31608c'; // 血洗島・渋沢の 家（relations.ts と同じ literal）
const RONIN = '#6b6f76'; // 攘夷の 浪士＝どこにも 属さない 灰
const SEAL = '#b23a2e'; // 徳川（一橋も 幕府も 同じ 家）
const GOLD = '#a67c1a'; // 明治政府（relations.ts と同じ literal）
const MIDORI = '#4a7a5a'; // 実業・民の 側

export const FIGURES: Record<string, Figure> = {
  seat: {
    kind: 'assembly',
    title: 'きみの 座',
    caption: '三年で、四つめ。上の 人が うごくと、下の 座も うごく',
    vb: [1000, 250],
    factions: [
      { key: 'ai', label: '血洗島の 家', color: AI },
      { key: 'ronin', label: '攘夷の 浪士', color: RONIN },
      { key: 'seal', label: '徳川の 家', color: SEAL },
    ],
    dais: { x: 500, y: 46, label: '将軍', faction: 'seal' },
    seats: [
      { id: 'mura', x: 145, y: 170, role: '百姓の 子' },
      { id: 'roshi', x: 385, y: 170, role: '攘夷の 浪士' },
      { id: 'hito', x: 625, y: 170, role: '一橋の 家来' },
      { id: 'baku', x: 865, y: 170, role: '幕臣' },
    ],
    fills: [
      { seat: 'mura', fromCh: 2, faction: 'ai' },
      { seat: 'roshi', fromCh: 2, faction: 'ronin' },
      { seat: 'hito', fromCh: 2, faction: 'seal' },
      { seat: 'baku', fromCh: 2, faction: 'seal', pid: 'p-eiichi@young', label: '栄一' },
    ],
  },

  // ★P 章四の 装置＝seat の 対句（別キー。figures.ts 冒頭の 申し送りどおり 図は 増やさず 起こす）。
  // 章二の caption は「上の 人が うごくと、下の 座も うごく」——章四は その 逆を 一枚で 言う: 上座
  // （政府）は 動かず、動いたのは きみの ほう。だから 席は 章二と 同じ 高さの 一列で 右へ 進み、
  // 五つめだけが 列を 外れて 下がる（＝椅子を おりる。章題そのもの）。
  // 一列は 幕臣（章二の 最後の 座）から 継ぐ——四つ 全部を 並べ直すと 8席に なり、この 図の 主張
  // 「いま 下りた」より「これまで 動いた」が 前に 出る。
  seatDown: {
    kind: 'assembly',
    title: 'きみの 座（つづき）',
    // 章二の caption「上の 人が うごくと、下の 座も うごく」への 返し。数は 言わない——この 図は
    // 幕臣から 継ぐので「五つめ」と 書くと 読者が 数える 席（4つ）と 合わない。
    caption: '今度 うごいたのは、上の 人では なく きみ',
    vb: [1000, 300],
    factions: [
      { key: 'seal', label: '徳川の 家', color: SEAL },
      { key: 'gold', label: '明治の 政府', color: GOLD },
      { key: 'min', label: '民（商いの 側）', color: MIDORI },
    ],
    dais: { x: 500, y: 46, label: '政府', faction: 'gold' },
    seats: [
      { id: 'baku', x: 150, y: 150, role: '幕臣' },
      { id: 'shizu', x: 400, y: 150, role: '静岡の 家来' },
      { id: 'kan', x: 650, y: 150, role: '国の 役人' },
      { id: 'min', x: 820, y: 245, role: '一人の 商人' },
    ],
    fills: [
      { seat: 'baku', fromCh: 4, faction: 'seal' },
      { seat: 'shizu', fromCh: 4, faction: 'seal' },
      { seat: 'kan', fromCh: 4, faction: 'gold' },
      { seat: 'min', fromCh: 4, faction: 'min', pid: 'p-eiichi@prime', label: '栄一' },
    ],
  },

  // ★P 終章の 答え合わせ（7-d）。三枚目に して はじめて 七つを 一列に 並べる——章二・章四が
  // 「動いたのは 上か、きみか」を 一場面ずつ 問うたのに 対し、この 図は 貫通の謎 A そのもの
  // 「それだけ うつって、変わらなかったのは 何か」を 一枚で 差し出す。だから caption は
  // 答えでなく **問い**で 終わる（判断は 子どもに 残す＝VISION 原則・CRITERIA B3）。
  // 上座（dais）は 置かない: 章二は 将軍、章四は 政府が 上に いたが、七つを 通して 見ると
  // 上に すわる 人 じたいが 入れかわって いる。ここに 一つを 焼くと、それが 断定に なる。
  // 席は 1000 幅に 7つ＝中心 140 きざみ（SEAT.W=120 ゆえ 隙間 20）。役ラベルは いずれも
  // 140 未満（最長「一橋の 家来」≈122）で、隣と ぶつからない。
  seatAll: {
    kind: 'assembly',
    title: 'きみが すわった 座',
    caption: '七つ うつった。変わらなかったのは、何だろう',
    // 高さは 席1列ぶん（上座を 置かない ので 章二・章四の 250/300 では 上半分が 空く）。
    vb: [1000, 140],
    factions: [
      { key: 'ai', label: '血洗島', color: AI },
      { key: 'ronin', label: '攘夷の 浪士', color: RONIN },
      { key: 'seal', label: '徳川の 家', color: SEAL },
      { key: 'gold', label: '明治の 政府', color: GOLD },
      { key: 'min', label: '民の 側', color: MIDORI },
    ],
    seats: [
      { id: 's1', x: 80, y: 70, role: '百姓の 子' },
      { id: 's2', x: 220, y: 70, role: '攘夷の 浪士' },
      { id: 's3', x: 360, y: 70, role: '一橋の 家来' },
      { id: 's4', x: 500, y: 70, role: '幕臣' },
      { id: 's5', x: 640, y: 70, role: '静岡の 家来' },
      { id: 's6', x: 780, y: 70, role: '国の 役人' },
      { id: 's7', x: 920, y: 70, role: '一人の 商人' },
    ],
    fills: [
      { seat: 's1', fromCh: 7, faction: 'ai' },
      { seat: 's2', fromCh: 7, faction: 'ronin' },
      { seat: 's3', fromCh: 7, faction: 'seal' },
      { seat: 's4', fromCh: 7, faction: 'seal' },
      { seat: 's5', fromCh: 7, faction: 'seal' },
      { seat: 's6', fromCh: 7, faction: 'gold' },
      { seat: 's7', fromCh: 7, faction: 'min', pid: 'p-eiichi', label: '栄一' },
    ],
  },
};
