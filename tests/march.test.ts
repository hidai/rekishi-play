// march ミニゲーム（「数字が反撃してくる」行軍）の純粋ロジック検証。
// §4.4 の解決順序を reducer の正として固定し、§4.5 のゴールデンラインを回帰テストに刻む。
import { describe, it, expect } from 'vitest';
import { initMarch, togglePrep, startRun, playDay, retryMarch, type MarchState } from '../src/engine/minigame';
import type { MarchMinigame } from '../src/engine/types';
import { hidenaga } from '../src/works/hidenaga/index';

// テスト専用の小さな定義（作品の実数値とは独立に順序・境界を検証する）。
const D: MarchMinigame = {
  type: 'march',
  title: 't',
  goalKm: 100,
  days: 5,
  rainDay: 2,
  foodStart: 2,
  foodMax: 3,
  troopsStart: 100,
  minTroops: 80,
  collapseAt: 50,
  fatigueCap: 60,
  collapseTroopLoss: 10,
  hungryTroopLoss: 5,
  hungryFatigueMul: 2,
  prepPicks: 2,
  preps: [
    { id: 'depotA', label: '', fx: { depotAt: 40 } },
    { id: 'shield', label: '', fx: { rainShield: true } },
    { id: 'torch', label: '', fx: { paceFatigueDelta: { hard: -10 } } },
    { id: 'fure', label: '', fx: { dailyFatigueDelta: -3 } },
  ],
  paces: [
    { id: 'slow', label: '', km: 15, fatigue: 5 },
    { id: 'normal', label: '', km: 20, fatigue: 20 },
    { id: 'hard', label: '', km: 30, fatigue: 40 },
    { id: 'rest', label: '', km: 0, fatigue: -30 },
  ],
};

/** Build a run-phase state with sane defaults, overridable per test. */
function run(over: Partial<MarchState> = {}): MarchState {
  return { phase: 'run', picked: [], day: 1, km: 0, fatigue: 0, food: 3, troops: 100, collapsed: false, lastEvents: [], ...over };
}

describe('initMarch / togglePrep / startRun', () => {
  it('initMarch は prep 状態・兵糧/兵力が初期値', () => {
    const s = initMarch(D);
    expect(s.phase).toBe('prep');
    expect(s.picked).toEqual([]);
    expect(s.food).toBe(D.foodStart);
    expect(s.troops).toBe(D.troopsStart);
    expect(s.day).toBe(1);
  });

  it('togglePrep は prepPicks 超を無視し、再タップで解除する', () => {
    let s = initMarch(D);
    s = togglePrep(D, s, 'depotA');
    s = togglePrep(D, s, 'shield');
    expect(s.picked).toEqual(['depotA', 'shield']);
    s = togglePrep(D, s, 'torch'); // 上限（2）超 → 無視
    expect(s.picked).toEqual(['depotA', 'shield']);
    s = togglePrep(D, s, 'depotA'); // 再タップで解除
    expect(s.picked).toEqual(['shield']);
  });

  it('togglePrep は未知 id / prep 以外のフェーズで no-op', () => {
    const s0 = initMarch(D);
    expect(togglePrep(D, s0, 'nope')).toBe(s0);
    const running = run({ picked: ['depotA'] });
    expect(togglePrep(D, running, 'shield')).toBe(running);
  });

  it('startRun は prepPicks ちょうどでなければ no-op', () => {
    let s = togglePrep(D, initMarch(D), 'depotA');
    expect(startRun(D, s).phase).toBe('prep'); // 1枚 → no-op
    s = togglePrep(D, s, 'shield');
    const r = startRun(D, s);
    expect(r.phase).toBe('run');
    expect(r.food).toBe(D.foodStart);
    expect(r.troops).toBe(D.troopsStart);
  });
});

describe('playDay: 天気（雨）', () => {
  it('雨の日は距離半減（端数 floor）で rain イベント', () => {
    const s = playDay(D, run({ day: 2 }), 'slow'); // slow km15, rainDay=2
    expect(s.km).toBe(Math.floor(15 / 2)); // 7
    expect(s.lastEvents).toContain('rain');
  });
  it('rainShield があれば減速しない', () => {
    const s = playDay(D, run({ day: 2, picked: ['shield'] }), 'slow');
    expect(s.km).toBe(15);
    expect(s.lastEvents).toContain('rain'); // 天気自体は起きる（情報は隠さない）
  });
  it('雨でない日は満額', () => {
    const s = playDay(D, run({ day: 1 }), 'slow');
    expect(s.km).toBe(15);
    expect(s.lastEvents).not.toContain('rain');
  });
});

describe('playDay: 拠点補給（補給→消費の順）', () => {
  it('旧km < at <= 新km を跨ぐと満タンに補給してから1消費', () => {
    const s = playDay(D, run({ km: 25, food: 1, picked: ['depotA'] }), 'normal'); // 25->45, at40
    expect(s.km).toBe(45);
    expect(s.food).toBe(D.foodMax - 1); // 補給3→消費2
    expect(s.lastEvents).toContain('depot:depotA');
  });
  it('ちょうど at で止まっても補給される', () => {
    const s = playDay(D, run({ km: 20, food: 1, picked: ['depotA'] }), 'normal'); // 20->40 == at
    expect(s.food).toBe(D.foodMax - 1);
    expect(s.lastEvents).toContain('depot:depotA');
  });
  it('兵糧0で拠点到着なら補給が先＝腹ぺこにならない', () => {
    const s = playDay(D, run({ km: 25, food: 0, picked: ['depotA'] }), 'normal');
    expect(s.food).toBe(D.foodMax - 1);
    expect(s.troops).toBe(100); // hungry 損失なし
    expect(s.lastEvents).not.toContain('hungry');
  });
  it('at を跨がなければ補給しない', () => {
    const s = playDay(D, run({ km: 45, food: 2, picked: ['depotA'] }), 'normal'); // 45->65
    expect(s.lastEvents).not.toContain('depot:depotA');
    expect(s.food).toBe(1);
  });
  it('その拠点を準備していなければ補給しない', () => {
    const s = playDay(D, run({ km: 25, food: 2 }), 'normal'); // depotA 未選択
    expect(s.lastEvents).not.toContain('depot:depotA');
    expect(s.food).toBe(1);
  });
});

describe('playDay: 腹ぺこ（兵糧0）', () => {
  it('兵糧0の行軍日は疲労×倍率・兵力減、食料は0で下げ止まり', () => {
    const s = playDay(D, run({ food: 0 }), 'normal'); // normal fat20 ×2 = 40
    expect(s.food).toBe(0);
    expect(s.troops).toBe(100 - D.hungryTroopLoss); // 95
    expect(s.fatigue).toBe(40);
    expect(s.lastEvents).toContain('hungry');
  });
  it('腹ぺこ倍率は疲労の増加にのみ効く（休息の回復は速まらない）', () => {
    const s = playDay(D, run({ food: 0, fatigue: 40 }), 'rest'); // -30、倍率対象外
    expect(s.fatigue).toBe(10);
    expect(s.troops).toBe(95);
  });
});

describe('playDay: 転倒（collapse）', () => {
  it('閾値到達後の休息で兵力 −loss を1回だけ適用し、回復で解除', () => {
    const s = playDay(D, run({ fatigue: 50 }), 'rest'); // 50>=collapseAt
    expect(s.troops).toBe(100 - D.collapseTroopLoss); // 90
    expect(s.lastEvents).toContain('collapse');
    expect(s.collapsed).toBe(false); // 50-30=20 < 50 で回復
    expect(s.fatigue).toBe(20);
  });
  it('転倒中は rest 以外を弾く（km/day 不変・損失は1回だけ）', () => {
    const s1 = playDay(D, run({ fatigue: 55 }), 'normal');
    expect(s1.km).toBe(0); // 進まない
    expect(s1.day).toBe(1); // 日も進まない
    expect(s1.troops).toBe(90); // collapse 損失1回
    expect(s1.collapsed).toBe(true);
    const s2 = playDay(D, s1, 'hard'); // 再度 non-rest → さらなる損失なし
    expect(s2.troops).toBe(90);
    const s3 = playDay(D, s2, 'rest'); // 休めば回復（追加損失なし）
    expect(s3.troops).toBe(90);
    expect(s3.collapsed).toBe(false);
    expect(s3.day).toBe(2);
  });
  it('転倒損失で minTroops を割ると army 敗北', () => {
    const s = playDay(D, run({ fatigue: 55, troops: 85 }), 'normal'); // 85-10=75 < 80
    expect(s.phase).toBe('fail');
    expect(s.failReason).toBe('army');
  });
});

describe('playDay: 疲労クランプと準備 fx', () => {
  it('疲労は fatigueCap で上限クランプ', () => {
    const s = playDay(D, run({ fatigue: 45 }), 'hard'); // 45+40=85 -> cap60
    expect(s.fatigue).toBe(D.fatigueCap);
  });
  it('疲労は0で下限クランプ', () => {
    const s = playDay(D, run({ fatigue: 10 }), 'rest'); // 10-30 -> 0
    expect(s.fatigue).toBe(0);
  });
  it('paceFatigueDelta（松明）は該当ペースの疲労を減らす', () => {
    const s = playDay(D, run({ picked: ['torch'] }), 'hard'); // 40-10=30
    expect(s.fatigue).toBe(30);
  });
  it('dailyFatigueDelta（触れ）は行軍日のみ効く', () => {
    const marching = playDay(D, run({ picked: ['fure'] }), 'normal'); // 20-3=17
    expect(marching.fatigue).toBe(17);
    const resting = playDay(D, run({ picked: ['fure'], fatigue: 40 }), 'rest'); // km0 → fure 不適用、-30
    expect(resting.fatigue).toBe(10);
  });
});

describe('playDay: 勝敗判定', () => {
  it('最終日ちょうど到達で clear（clearDay は今日）', () => {
    const s = playDay(D, run({ day: 5, km: 85 }), 'hard'); // 85+30=115 >= 100
    expect(s.phase).toBe('clear');
    expect(s.clearDay).toBe(5);
    expect(s.lastEvents).toContain('clear');
  });
  it('troops === minTroops は生存（< で敗北）', () => {
    const alive = playDay(D, run({ day: 2, km: 20, troops: 85, food: 0 }), 'normal'); // 85-5=80
    expect(alive.phase).toBe('run');
    expect(alive.troops).toBe(80);
    const dead = playDay(D, run({ day: 2, km: 20, troops: 84, food: 0 }), 'normal'); // 84-5=79
    expect(dead.phase).toBe('fail');
    expect(dead.failReason).toBe('army');
  });
  it('日数超過で late 敗北', () => {
    const s = playDay(D, run({ day: 5, km: 50 }), 'normal'); // 70 < 100, day->6 > 5
    expect(s.phase).toBe('fail');
    expect(s.failReason).toBe('late');
  });
  it('phase が run 以外なら no-op', () => {
    const cleared = run({ phase: 'clear' });
    expect(playDay(D, cleared, 'normal')).toBe(cleared);
  });
});

describe('retryMarch', () => {
  it('phase を prep に戻し、picked は保持・他は初期化', () => {
    const failed = run({ phase: 'fail', failReason: 'late', picked: ['depotA', 'shield'], km: 50, troops: 60, fatigue: 40, day: 5 });
    const s = retryMarch(D, failed);
    expect(s.phase).toBe('prep');
    expect(s.picked).toEqual(['depotA', 'shield']);
    expect(s.km).toBe(0);
    expect(s.troops).toBe(D.troopsStart);
    expect(s.food).toBe(D.foodStart);
    expect(s.fatigue).toBe(0);
    expect(s.day).toBe(1);
    expect(s.failReason).toBeUndefined();
  });
});

// --- §4.5 ゴールデンライン（4-b の実データで固定。数値チューニング時は必ず更新）---
describe('ゴールデンライン（4-b 実データ）', () => {
  const def = hidenaga.story.chapters.find((c) => c.id === 4)!.scenes['4-b'].minigame as MarchMinigame;

  function play(picks: string[], paces: string[]): MarchState {
    let s = initMarch(def);
    for (const id of picks) s = togglePrep(def, s, id);
    s = startRun(def, s);
    for (const p of paces) s = playDay(def, s, p);
    return s;
  }

  it('史実プリセット（姫路+尼崎+触れ）×ふつう連打（d9のみ強制休息）→ 10日目クリア・兵90', () => {
    const paces = ['normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'normal', 'rest', 'normal'];
    const s = play(['himeji', 'amagasaki', 'fure'], paces);
    expect(s.phase).toBe('clear');
    expect(s.clearDay).toBe(10);
    expect(s.troops).toBe(90);
    expect(s.km).toBe(238);
  });

  it('無準備×ふつう連打 → 兵站が崩れて army 敗北（準備の有無が結果を分ける）', () => {
    // 無準備は UI 上不可能だが、準備の効果を測る基準線として reducer で回す。
    let s: MarchState = { ...initMarch(def), phase: 'run' };
    let guard = 0;
    while (s.phase === 'run' && guard++ < 50) s = playDay(def, s, s.fatigue >= def.collapseAt ? 'rest' : 'normal');
    expect(s.phase).toBe('fail');
    expect(s.failReason).toBe('army');
    expect(s.km).toBe(154);
    expect(s.troops).toBe(75);
  });
});
