// ★P 「人の図」データ（ieyasu）: ch5 の主装置「関ヶ原の 戦場」。エンジン: src/engine/map/figure.ts
// （装置3・戦場の図 = kind:'battlefield'）。色は literal（テーマ非依存＝render-scene で忠実に出る。
// kiyomori/figures.ts と同じ流儀）。手書き管理。
/* eslint-disable */

import type { Figure } from '../../engine/types';

// Why a FIGURE and not a scene map: the scene map's floor zoom is a 392-unit (~380km) frame, and
// the whole Sekigahara theater — 関ヶ原→松尾山 ~3km, →南宮山 ~7km, →大垣 ~14km — sits inside the
// ~40-unit face disc around きみ (the ch2/ch4 measurement). The one chapter whose climax IS a
// 15km basin needs the one main-visual device with no projection floor: figure coordinates.
// design §2 named ch5's device 「布陣＋論争 reveal」; the reveal (今も 論争中) is the body's
// spark/deep, and this board is the 布陣 half.
//
// Why 'battlefield' and not the earlier 'assembly' roster: the family playtest reported the
// original board (six colored rects in two rows) read as a name-list, not a battle — "何を伝え
// たいのか / 伝わっているか" (観察メモ 2026-07-18). A roster has no terrain, no facing, no high
// ground, so 関ヶ原's whole shape (two armies meeting in a valley, two forces poised on the hills
// that decided it) collapsed into color-coded tiles. The battlefield grammar restores the three
// things a battle IS: a valley the two lines face across, a front seam where they clash, and
// hills the two undecided forces look DOWN from (見おろす — the elevation a flat roster cannot show).
//
// ★What this board must NOT draw (WRITING 地図書法2): the CLOCK of the betrayal. When 小早川
// turned is a live scholarly fight (research §3-10, 白峰 vs 笠谷) — so the seam is a dashed line,
// never an arrow off 松尾山, and nothing stamps a time onto the turn. The board freezes DAWN and
// states only what both camps agree held then:
//   - two armies face across the valley (西軍 out of 大垣, 東軍 in — the 5-b hist body);
//   - 毛利 sits on 南宮山 behind 家康's rear under a pre-battle non-move pledge (誓紙 survives = ◎, §3-15);
//   - 小早川's 一万五千 sits on 松尾山, nominally west.「西軍の はず」is the body's own shipped
//     register, and his OWN faction color — between きみの gold and 三成の 朱, plain-west refused
//     — is 3-d's evidence-not-verdict register in paint: both camps agree he was not simply west
//     that morning, and WHICH hour he stopped being west is what the board declines to say.
// The legend doubles as the note system: 「毛利＝動かぬ 約束」/「小早川＝西軍の はず」are what a
// first-look reader needs to see why the body's 天下分け目 ends before the afternoon is out.
//
// Geometry is compass-true (west=left). 松尾山 (left) overlooks 西軍's own flank; 南宮山 (right)
// sits behind きみ's line = the encirclement the pledge defused. The board stops at west / east /
// two named hills: the classic unit-by-unit 布陣図 (笹尾山・天満山…) descends from the Meiji
// 参謀本部 reconstruction and is itself under re-examination, so two lines and two named hills is
// the resolution the record holds across every school of the dispute.
// Fit-gate (tests/scene-figure.test.ts): a leader name beside a face fits at ≤3 glyphs (三成・
// 家康・小早川 place the name clear of the troops), a faceless block label at ≤2 glyphs (毛利),
// and the 4-item legend totals ≈921u of the 1000 frame.

const EAST = '#9a7a28'; // きみの 側 — the work's gold family, darkened so the isYou gold ring reads
const WEST = '#b23a2e'; // 三成の 側 — same 朱 as relations.ts「戦った 相手」
const MOURI = '#ab8b80'; // 西軍の柱、ただし動かぬ約束 — 朱 with the saturation drained (west, but out of the fight)
const HIDEAKI = '#b5642f'; // 西軍の はず — between the gold and the 朱 (a color that refuses to pick a side)

export const FIGURES: Record<string, Figure> = {
  sekigahara: {
    kind: 'battlefield',
    title: '関ヶ原の 朝',
    caption: '谷で 向かいあう 東西の 大軍。山の 上には、まだ 動かぬ 二つ',
    vb: [1000, 340],
    seam: { x: 500, label: 'ぶつかる ところ' },
    factions: [
      { key: 'east', label: 'きみの 側', color: EAST },
      { key: 'west', label: '三成の 側', color: WEST },
      { key: 'mouri', label: '毛利＝動かぬ 約束', color: MOURI },
      { key: 'hideaki', label: '小早川＝西軍の はず', color: HIDEAKI },
    ],
    // Valley line (y=95): 三成 leads the west line facing east, 家康 the east line facing west,
    // their troops fanning toward the 500-seam between them. Hills (y=240, hill:true) below:
    // 松尾山 left over 西軍's flank, 南宮山 right behind きみ's rear = the encirclement defused.
    units: [
      { id: 'mitsunari', x: 180, y: 95, faction: 'west', pid: 'p-mitsunari', troops: 3, facing: 1 },
      { id: 'ieyasu', x: 820, y: 95, faction: 'east', pid: 'p-ieyasu', troops: 3, facing: -1 },
      { id: 'hideaki', x: 290, y: 240, faction: 'hideaki', pid: 'p-hideaki', role: '松尾山', hill: true },
      { id: 'mouri', x: 710, y: 240, faction: 'mouri', label: '毛利', role: '南宮山', hill: true },
    ],
  },
};
