// ★M 段取りミニゲーム（sort型）の純粋ロジック（DOM 非依存＝テスト可能）。
// 「つぎは どれ？」方式：残りの項目から"次の一手"をタップで選び、正しい順に積み上げる。
// ドラッグ不要でタッチに強く、間違えても即やり直せる（詰まない）。
import { choiceOrder } from './order';
import type { MarchMinigame } from './types';

/** 表示順（シャッフル）。偶然「正しい順のまま」になったら1つ回して崩す。 */
export function sortDisplayOrder(n: number, rnd: () => number = Math.random): number[] {
  const o = choiceOrder(n, rnd);
  if (n > 1 && o.every((v, i) => v === i)) {
    o.push(o.shift()!); // 左回転＝必ず並べ替えが必要になる
  }
  return o;
}

export interface SortState {
  /** 正しく置けた項目数（＝次に正解となる項目 index）。 */
  placed: number;
  /** 間違えた回数（結果の一言に使う）。 */
  miss: number;
  done: boolean;
}

export function initSort(): SortState {
  return { placed: 0, miss: 0, done: false };
}

/** 項目 idx をタップした結果。correct なら placed が進む。 */
export function pickSort(
  state: SortState,
  idx: number,
  totalItems: number,
): { state: SortState; correct: boolean } {
  if (state.done) return { state, correct: false };
  if (idx === state.placed) {
    const placed = state.placed + 1;
    return { state: { placed, miss: state.miss, done: placed >= totalItems }, correct: true };
  }
  return { state: { ...state, miss: state.miss + 1 }, correct: false };
}

// ---------------- march minigame ("the numbers fight back" forced march) ----------------
// DOM-free immutable reducers, same style as sort. Never uses Math.random
// (fixed rainDay = deterministic: both testable and free of "lost to luck" — a design goal).
// All numbers and proper nouns come from MarchMinigame (work data); here we implement only fx semantics.

export interface MarchState {
  phase: 'prep' | 'run' | 'clear' | 'fail';
  picked: string[]; // prep ids, length <= def.prepPicks
  day: number; // 1-based, next day to play
  km: number;
  fatigue: number;
  food: number;
  troops: number;
  collapsed: boolean; // true while a collapse loss has been applied and not yet recovered
  failReason?: 'late' | 'army';
  clearDay?: number;
  lastEvents: string[]; // event keys for the day just played: 'rain'|'depot:<id>'|'hungry'|'collapse'|'clear'
}

export function initMarch(def: MarchMinigame): MarchState {
  return {
    phase: 'prep',
    picked: [],
    day: 1,
    km: 0,
    fatigue: 0,
    food: def.foodStart,
    troops: def.troopsStart,
    collapsed: false,
    lastEvents: [],
  };
}

/** Toggle a prep card. Re-tapping removes it; adding past prepPicks is ignored. */
export function togglePrep(def: MarchMinigame, s: MarchState, id: string): MarchState {
  if (s.phase !== 'prep') return s;
  if (!def.preps.some((p) => p.id === id)) return s;
  if (s.picked.includes(id)) return { ...s, picked: s.picked.filter((x) => x !== id) };
  if (s.picked.length >= def.prepPicks) return s;
  return { ...s, picked: [...s.picked, id] };
}

/** Begin the run. No-op unless exactly prepPicks cards are chosen. */
export function startRun(def: MarchMinigame, s: MarchState): MarchState {
  if (s.phase !== 'prep' || s.picked.length !== def.prepPicks) return s;
  return { ...initMarch(def), phase: 'run', picked: [...s.picked] };
}

/** Return to prep, keeping the chosen cards (editable). */
export function retryMarch(def: MarchMinigame, s: MarchState): MarchState {
  return { ...initMarch(def), picked: [...s.picked] };
}

/** Sum of the fx of the picked prep cards (the ones that matter for a pace/day). */
function pickedFx(def: MarchMinigame, s: MarchState) {
  return def.preps.filter((p) => s.picked.includes(p.id)).map((p) => p.fx);
}

/**
 * Play one day at the given pace. Implements §4.4 of the design as the source of truth
 * for the tests. Returns a new state; never mutates.
 */
export function playDay(def: MarchMinigame, s: MarchState, paceId: string): MarchState {
  if (s.phase !== 'run') return s;
  const pace = def.paces.find((p) => p.id === paceId);
  if (!pace) return s;

  const fxs = pickedFx(def, s);
  const events: string[] = [];

  // 1. Collapse guard (based on fatigue carried from the previous day). The first time
  //    fatigue reaches collapseAt, apply the troop loss once; while collapsed only a
  //    recovery pace is allowed. "Recovery" is data-driven (fatigue < 0), not a hardcoded
  //    id — the same criterion the UI uses to disable the other buttons.
  const isRecovery = pace.fatigue < 0;
  let troops = s.troops;
  let collapsed = s.collapsed;
  if (s.fatigue >= def.collapseAt && !collapsed) {
    collapsed = true;
    troops -= def.collapseTroopLoss;
    events.push('collapse');
  }
  if (collapsed && !isRecovery) {
    // Defensive: UI disables non-recovery paces while collapsed. Persist the loss and re-check defeat.
    const next: MarchState = { ...s, troops, collapsed, lastEvents: events };
    if (troops < def.minTroops) return { ...next, phase: 'fail', failReason: 'army' };
    return next;
  }

  // 2. Distance. Rain halves the day's km unless a rainShield is prepared.
  let dist = pace.km;
  const raining = def.rainDay != null && s.day === def.rainDay;
  const shielded = fxs.some((f) => f.rainShield);
  if (raining && !shielded) {
    dist = Math.floor(dist / 2);
    events.push('rain');
  } else if (raining) {
    events.push('rain'); // shown in the log even when shielded (weather still happens)
  }
  const km = s.km + dist;

  // 3. Depot resupply (refill first), for every depotAt crossed by this day's move.
  let food = s.food;
  for (const p of def.preps) {
    if (!s.picked.includes(p.id) || p.fx.depotAt == null) continue;
    if (s.km < p.fx.depotAt && p.fx.depotAt <= km) {
      food = def.foodMax;
      events.push(`depot:${p.id}`);
    }
  }

  // 4. Food consumption (after resupply). No food to consume = hungry.
  let hungry = false;
  if (food > 0) {
    food -= 1;
  } else {
    hungry = true;
    troops -= def.hungryTroopLoss;
    events.push('hungry');
  }

  // 5. Fatigue. Sum pace + marching-day delta + per-pace delta, then apply the hungry
  //    multiplier to an *increase* only (starving never speeds recovery). Clamp to [0, cap].
  let dfat = pace.fatigue;
  if (pace.km > 0) {
    for (const f of fxs) if (f.dailyFatigueDelta) dfat += f.dailyFatigueDelta;
  }
  for (const f of fxs) if (f.paceFatigueDelta && f.paceFatigueDelta[paceId] != null) dfat += f.paceFatigueDelta[paceId];
  if (hungry && dfat > 0) dfat *= def.hungryFatigueMul;
  const fatigue = Math.max(0, Math.min(def.fatigueCap, s.fatigue + dfat));
  if (collapsed && fatigue < def.collapseAt) collapsed = false; // recovered

  // 6. Advance the day.
  const day = s.day + 1;

  // 7. Resolve: army defeat, then goal, then out of days.
  const base: MarchState = { ...s, km, fatigue, food, troops, collapsed, day, lastEvents: events };
  if (troops < def.minTroops) return { ...base, phase: 'fail', failReason: 'army' };
  if (km >= def.goalKm) return { ...base, phase: 'clear', clearDay: s.day, lastEvents: [...events, 'clear'] };
  if (day > def.days) return { ...base, phase: 'fail', failReason: 'late' };
  return base;
}
