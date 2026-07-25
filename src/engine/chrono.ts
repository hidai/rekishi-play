// 作品をまたぐ「時代の ものさし」。作品ごとの主人公の生没を、1本の西暦軸に並べる。
//
// 描画から切り離した純関数にしてあるのは、位置と目盛りが「見た目」でなく比率の問題だから
// （engine/trail.ts と同じ方針）。engine は固有名詞を持たず、WorkCard.years の文字列だけを
// 読む——作品が増えれば軸のほうが伸びる。
import type { WorkCard } from './types';

/** 1作ぶんの帯。left/width は軸幅に対する % で、CSS がそのまま使える。 */
export interface EraBar {
  id: string;
  /** ruby HTML allowed（WorkCard.titleMain をそのまま運ぶ）。 */
  label: string;
  /** 作品が書いたままの生没年（「1118ごろ〜1181」）。 */
  years: string;
  born: number;
  died: number;
  /** 「ごろ」付き＝はっきりしない側。端をぼかして見せるため。 */
  approxBorn: boolean;
  approxDied: boolean;
  leftPct: number;
  widthPct: number;
  /** 名前を帯のどちら端にそろえるか（右端の作品は右そろえにしないと外へはみ出す）。 */
  capAlign: 'left' | 'right';
  /** その端からの余白（%）。 */
  capPad: number;
}

export interface EraBandLayout {
  from: number;
  to: number;
  ticks: number[];
  bars: EraBar[];
}

/** 帯が細くなりすぎて見えなくならない下限（%）。 */
const MIN_BAR = 2.2;
const TICK_STEPS = [50, 100, 200, 250, 500, 1000];

interface Life {
  born: number;
  died: number;
  approxBorn: boolean;
  approxDied: boolean;
}

/** 「1118ごろ〜1181」から生没年を取る。読めなければ null（帯に出さない）。 */
export function parseYears(years: string): Life | null {
  const parts = years.split(/[〜～~]/);
  if (parts.length !== 2) return null;
  const born = parts[0].match(/\d{4}/)?.[0];
  const died = parts[1].match(/\d{4}/)?.[0];
  if (!born || !died || +died <= +born) return null;
  const approx = (s: string) => /ごろ|頃|\?/.test(s);
  return { born: +born, died: +died, approxBorn: approx(parts[0]), approxDied: approx(parts[1]) };
}

function tickStep(span: number): number {
  return TICK_STEPS.find((s) => span / s <= 5) ?? TICK_STEPS[TICK_STEPS.length - 1];
}

/**
 * 作品カードの並びを1本の西暦軸へ。2作ぶん読めなければ null（1作だけのビルドでは出さない）。
 * 帯は生まれた順に並べる——一覧の並び順（登録順）と違ってよく、順番そのものが年代を教える。
 */
export function eraBand(cards: WorkCard[]): EraBandLayout | null {
  const lives = cards
    .map((c) => ({ card: c, life: parseYears(c.years) }))
    .filter((x): x is { card: WorkCard; life: Life } => !!x.life)
    .sort((a, b) => a.life.born - b.life.born || a.life.died - b.life.died);
  if (lives.length < 2) return null;

  const from = Math.floor(Math.min(...lives.map((x) => x.life.born)) / 100) * 100;
  const to = Math.ceil(Math.max(...lives.map((x) => x.life.died)) / 100) * 100;
  const span = to - from;
  const pct = (y: number) => ((y - from) / span) * 100;

  const step = tickStep(span);
  const ticks: number[] = [];
  for (let y = Math.ceil(from / step) * step; y <= to; y += step) ticks.push(y);

  const bars = lives.map(({ card, life }) => {
    // A very short life at the far right would stick out once widened to MIN_BAR,
    // so it slides left instead — the bar stays inside the axis whatever the data.
    const leftPct = Math.min(pct(life.born), 100 - MIN_BAR);
    const widthPct = Math.min(Math.max(MIN_BAR, pct(life.died) - leftPct), 100 - leftPct);
    const right = leftPct + widthPct;
    // 帯の中心が右半分にあるなら右そろえ＝名前は軸の内側へ伸びる。
    const capAlign = leftPct + widthPct / 2 > 50 ? 'right' : 'left';
    return {
      id: card.id,
      label: card.titleMain,
      years: card.years,
      born: life.born,
      died: life.died,
      approxBorn: life.approxBorn,
      approxDied: life.approxDied,
      leftPct,
      widthPct,
      capAlign,
      capPad: capAlign === 'left' ? leftPct : 100 - right,
    } satisfies EraBar;
  });

  return { from, to, ticks, bars };
}
