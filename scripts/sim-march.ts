// march ミニゲームのバランス総当たり検証（設計書 §5）。
// 使い方: npx vite-node scripts/sim-march.ts
// reducer は純関数なので、全準備組合せ C(n,pick) × 全ペース列 (#paces)^days を数秒で回せる。
// 目標（外れたら 4-b の数値 or ペース表を調整する）:
//   1. クリア可能な準備組合せが 3 通り以上（一本道パズルにしない）
//   2. どの組合せでも「全日ふつう」「全日駆け足」の思考停止プレイはクリア不可
//      （例外: 史実プリセット×ふつう連打だけは通す —— 「正しい準備は素直な実行を許す」が主題）
//   3. クリア可能ペース列の割合は最良組合せでも 5% 未満（計画が要る）
import { initMarch, startRun, playDay, type MarchState } from '../src/engine/minigame';
import type { MarchMinigame } from '../src/engine/types';
import { hidenaga } from '../src/works/hidenaga/index';

const def = hidenaga.story.chapters.find((c) => c.id === 4)!.scenes['4-b'].minigame as MarchMinigame;
if (def.type !== 'march') throw new Error('4-b is not a march minigame');

const HISTORICAL_PRESET = ['himeji', 'amagasaki', 'fure']; // §4.5

/** All k-combinations of the prep ids. */
function combos<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > arr.length) return [];
  const [head, ...rest] = arr;
  return [...combos(rest, k - 1).map((c) => [head, ...c]), ...combos(rest, k)];
}

/** Run a full game for a fixed prep set and pace sequence. */
function run(picks: string[], paceSeq: string[]): MarchState {
  let s = initMarch(def);
  for (const id of picks) s = { ...s, picked: [...s.picked, id] };
  s = startRun(def, s);
  for (const pace of paceSeq) {
    if (s.phase !== 'run') break;
    s = playDay(def, s, pace);
  }
  return s;
}

const paceIds = def.paces.map((p) => p.id);
const prepIds = def.preps.map((p) => p.id);
const allCombos = combos(prepIds, def.prepPicks);

// Enumerate every pace sequence of length def.days over paceIds.
function* paceSeqs(): Generator<string[]> {
  const total = paceIds.length ** def.days;
  const idx = new Array(def.days).fill(0);
  for (let n = 0; n < total; n++) {
    yield idx.map((i) => paceIds[i]);
    for (let d = def.days - 1; d >= 0; d--) {
      if (++idx[d] < paceIds.length) break;
      idx[d] = 0;
    }
  }
}

interface ComboResult {
  picks: string[];
  clearable: boolean;
  bestDay: number | null;
  clearCount: number;
  total: number;
}

const results: ComboResult[] = [];
for (const picks of allCombos) {
  let clearCount = 0;
  let bestDay: number | null = null;
  let total = 0;
  for (const seq of paceSeqs()) {
    total++;
    const s = run(picks, seq);
    if (s.phase === 'clear') {
      clearCount++;
      if (bestDay == null || s.clearDay! < bestDay) bestDay = s.clearDay!;
    }
  }
  results.push({ picks, clearable: clearCount > 0, bestDay, clearCount, total });
}

const clearableCombos = results.filter((r) => r.clearable);
const bestRatio = Math.max(...results.map((r) => r.clearCount / r.total));

console.log('=== 準備組合せごとの結果 ===');
for (const r of results.sort((a, b) => (b.clearCount / b.total) - (a.clearCount / a.total))) {
  const pct = ((r.clearCount / r.total) * 100).toFixed(3);
  const tag = r.picks.slice().sort().join('+');
  console.log(
    `${r.clearable ? '✅' : '❌'} ${tag.padEnd(28)} best=${r.bestDay ?? '-'}日  clearable=${r.clearCount}/${r.total} (${pct}%)`,
  );
}

// --- 思考停止プレイの検証 ---
console.log('\n=== 思考停止プレイ（全日同一ペース）===');
function mono(pace: string) {
  const seq = new Array(def.days).fill(pace);
  const rows: string[] = [];
  let clearedNonHistorical = false;
  for (const picks of allCombos) {
    const s = run(picks, seq);
    const tag = picks.slice().sort().join('+');
    const isHist = HISTORICAL_PRESET.slice().sort().join('+') === tag;
    if (s.phase === 'clear') {
      rows.push(`  ✅ ${tag} → clear d${s.clearDay} 兵${s.troops}${isHist ? '（史実プリセット・例外OK）' : ' ← ⚠️目標違反'}`);
      if (!isHist) clearedNonHistorical = true;
    }
  }
  console.log(`[全日 ${pace}]`);
  if (rows.length === 0) console.log('  （どの準備でもクリア不可）');
  else rows.forEach((r) => console.log(r));
  return clearedNonHistorical;
}
const normalBad = mono('normal');
const hardBad = mono('hard');

// --- ゴールデンライン（§4.5 / テストに固定する値）---
console.log('\n=== ゴールデンライン ===');
// 史実プリセット×「ふつう連打」。ただし転倒で強制されたら休む（＝素直なプレイの実像）。
const histRun = (() => {
  let s = run(HISTORICAL_PRESET, []); // startRun 済みの run 状態
  const trace: string[] = [];
  let guard = 0;
  while (s.phase === 'run' && guard++ < 100) {
    const pace = s.fatigue >= def.collapseAt ? 'rest' : 'normal';
    s = playDay(def, s, pace);
    trace.push(`d${trace.length + 1}:${pace} km${s.km} fat${s.fatigue} food${s.food} troops${s.troops} [${s.lastEvents.join(',')}]`);
  }
  console.log('史実プリセット×ふつう（転倒時のみ休息）:');
  trace.forEach((t) => console.log('  ' + t));
  console.log(`  => phase=${s.phase} clearDay=${s.clearDay} troops=${s.troops} km=${s.km}`);
  return s;
})();
// 無準備×ふつう連打（UI 上不可能だが reducer 上の惜敗基準線）。
const noPrepRun = (() => {
  let s: MarchState = { ...initMarch(def), phase: 'run' };
  let guard = 0;
  while (s.phase === 'run' && guard++ < 100) s = playDay(def, s, s.fatigue >= def.collapseAt ? 'rest' : 'normal');
  return s;
})();
console.log(`無準備×ふつう（転倒時のみ休息）: phase=${noPrepRun.phase} failReason=${noPrepRun.failReason} km=${noPrepRun.km} troops=${noPrepRun.troops}`);

// --- 目標判定 ---
console.log('\n=== 目標判定 ===');
const g1 = clearableCombos.length >= 3;
const g2 = !normalBad && !hardBad;
const g3 = bestRatio < 0.05;
console.log(`目標1 クリア可能組合せ >= 3: ${g1 ? 'OK' : 'NG'}（${clearableCombos.length}通り）`);
console.log(`目標2 全日ふつう/駆け足はクリア不可（史実プリセット例外除く）: ${g2 ? 'OK' : 'NG'}`);
console.log(`目標3 最良組合せのクリア率 < 5%: ${g3 ? 'OK' : 'NG'}（最良 ${(bestRatio * 100).toFixed(3)}%）`);
console.log(g1 && g2 && g3 ? '\n🎉 すべての目標を満たす' : '\n⚠️ 目標未達 —— 数値調整が必要');
