// ★S 習作ページ（手記）データ — davinci ch1「ヴィンチ村の私生児」の自然観察。
// 顔でも地図でもない「自然を観る」章の下敷き。エンジンの buildStudyPage が渦・鳥・球・葉を描き、
// story 1-b の Scene.observe がこの絵の上に「気づき」hotspot を重ねる（座標は 800x500 の正規化）。
// 絵の語彙（渦/鳥/光と球/葉）はエンジン持ち＝ここは「どれを・どこに」だけ与える。
// ch1 の観察対象は検証済み史実（水の観察・鳥の飛翔・光と影・植物）に絞る（research §3・§6/§0）。
// Hand-managed（davinci に extract 元は無い）。
import type { StudyPage } from '../../engine/types';

export const STUDIES: Record<string, StudyPage> = {
  ch1: {
    title: 'きみの 手記',
    mirror: true, // the faint reversed scribble = 左利き・鏡文字 (found as a spark in 1-b)
    subjects: [
      { kind: 'eddy', x: 240, y: 178, scale: 1.15 }, // 水の渦  → ob1-water / n-water
      { kind: 'bird', x: 575, y: 162, scale: 1.15 }, // 鳥の飛翔 → ob1-flight / n-flight
      { kind: 'sphere', x: 255, y: 356, scale: 1.05 }, // 光と球 → ob1-light / n-light
      { kind: 'leaf', x: 565, y: 360, scale: 1.05 }, // 葉のすじ → ob1-leaf (no star)
    ],
  },

  // ch4「最後の晩餐」= 自然でなく「絵を 組み立てる」観察。描画順＝重なり順: 部屋 → 人 → 卓（人の裾を隠す）。
  // 傷み（剥落）は絵に描かない: 3案（葉状のめくれ／窓を食う欠損／卓の端を食う欠損＋欠片）とも
  // 読解ペルソナに「葉・木・岩」と読まれ、家族の実プレイでも伝わらなかった（2026-07-22）。
  // 物体は名指せても「無い」は名指せない——劣化は spark/deep/本文が語る。
  // No title: unlike ch1's near-empty notebook page, this one is a full-bleed 下絵 — the engine
  // draws the title UNDER the subjects, so the ceiling rail would cut straight through it.
  ch4: {
    subjects: [
      { kind: 'perspective', x: 400, y: 236, scale: 1.32 }, // 消失点 → ob4-vanish / n-okuyuki
      { kind: 'figures', x: 280, y: 306, scale: 0.82 }, // 左の 弟子たち → ob4-left
      { kind: 'person', x: 400, y: 300, scale: 0.9 }, // まん中の 人（線が集まる先）
      { kind: 'figures', x: 520, y: 306, scale: 0.82, flip: true }, // 右の 弟子たち → ob4-hands
      { kind: 'table', x: 400, y: 368, scale: 1.32 },
    ],
  },
};
