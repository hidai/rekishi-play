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
};
