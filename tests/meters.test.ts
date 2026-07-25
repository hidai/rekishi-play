// ★1「きみの秀長」メーターの検証。
// (1) 締めの1文ロジック（最も高いメーター→summary、引き分け/未加算→balanced）
// (2) 物語データの整合（effect のキーが必ず定義済み・両選択肢が必ず動く）
import { describe, it, expect } from 'vitest';
import { topMeter, meterSummary, meterProgress, metersActive } from '../src/engine/meters';
import { hidenaga } from '../src/works/hidenaga/index';
import type { WorkSave } from '../src/engine/save.svelte';

/** meters だけ持つ最小プロフィール。 */
function prof(meters?: Record<string, number>): WorkSave {
  return { meters } as unknown as WorkSave;
}

describe('meterSummary / topMeter（終章の締めが選択履歴で変わる）', () => {
  it('未加算・null プロフィールは balanced（引き分け扱い）', () => {
    expect(topMeter(hidenaga, prof())).toBeNull();
    expect(topMeter(hidenaga, null)).toBeNull();
    expect(meterSummary(hidenaga, prof({}))).toBe(hidenaga.meters!.balanced);
  });

  it('突出したメーターが締めの1文を決める', () => {
    for (const def of hidenaga.meters!.defs) {
      const p = prof({ [def.key]: 5 });
      expect(topMeter(hidenaga, p)?.key).toBe(def.key);
      expect(meterSummary(hidenaga, p)).toBe(def.summary);
    }
  });

  it('最大値が引き分けなら balanced', () => {
    const [a, b] = hidenaga.meters!.defs;
    const p = prof({ [a.key]: 4, [b.key]: 4 });
    expect(topMeter(hidenaga, p)).toBeNull();
    expect(meterSummary(hidenaga, p)).toBe(hidenaga.meters!.balanced);
  });

  it('僅差でも最大が1つなら勝者を返す', () => {
    const [a, b] = hidenaga.meters!.defs;
    const p = prof({ [a.key]: 5, [b.key]: 4 });
    expect(topMeter(hidenaga, p)?.key).toBe(a.key);
  });

  it('metersActive は加算があるときだけ true', () => {
    expect(metersActive(hidenaga, prof())).toBe(false);
    expect(metersActive(hidenaga, prof({ kizuna: 0 }))).toBe(false);
    expect(metersActive(hidenaga, prof({ kizuna: 1 }))).toBe(true);
  });
});

describe('meterProgress（★C 各章クリアの中間寸評）', () => {
  it('突出したメーターが中間寸評の1文を決める', () => {
    for (const def of hidenaga.meters!.defs) {
      const p = prof({ [def.key]: 3 });
      expect(meterProgress(hidenaga, p)).toBe(def.progress);
    }
  });

  it('引き分け/未加算は progressBalanced', () => {
    expect(meterProgress(hidenaga, prof({}))).toBe(hidenaga.meters!.progressBalanced);
    const [a, b] = hidenaga.meters!.defs;
    expect(meterProgress(hidenaga, prof({ [a.key]: 2, [b.key]: 2 }))).toBe(
      hidenaga.meters!.progressBalanced,
    );
  });

  it('全 def に progress、config に progressBalanced が定義済み（中間寸評が空にならない）', () => {
    for (const def of hidenaga.meters!.defs) expect(def.progress?.trim()).toBeTruthy();
    expect(hidenaga.meters!.progressBalanced?.trim()).toBeTruthy();
  });
});

describe('hidenaga: 選択肢 effect の整合', () => {
  const keys = new Set(hidenaga.meters!.defs.map((d) => d.key));

  it('effect のキーはすべて定義済みメーター・値は正の整数', () => {
    for (const ch of hidenaga.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        for (const c of sc.choices ?? []) {
          for (const [k, v] of Object.entries(c.effect ?? {})) {
            expect(keys.has(k), `${sid} effect key ${k}`).toBe(true);
            expect(Number.isInteger(v) && v > 0, `${sid} effect ${k}=${v}`).toBe(true);
          }
        }
      }
    }
  });

  it('物語本編（終章の答え以外）の2択は両方 effect を持つ＝押せば必ず数値が動く', () => {
    for (const ch of hidenaga.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        // 終章の「答え」選択肢（answer 付き）はメーター対象外。
        const meterChoices = (sc.choices ?? []).filter((c) => c.answer == null);
        if (meterChoices.length === 0) continue;
        for (const c of meterChoices) {
          const moved = Object.values(c.effect ?? {}).reduce((a, b) => a + b, 0);
          expect(moved > 0, `${sid} choice「${c.label}」が数値を動かさない`).toBe(true);
        }
      }
    }
  });

  it('選び方で終章の締めが変わる（前線ばかり／裏方ばかりで別の1文）', () => {
    // 各メーターシーンで index を固定して選び続けたときの累積を計算。
    const playWith = (pick: number) => {
      const meters: Record<string, number> = {};
      for (const ch of hidenaga.story.chapters) {
        for (const sc of Object.values(ch.scenes)) {
          const mc = (sc.choices ?? []).filter((c) => c.answer == null);
          if (mc.length === 0) continue;
          const c = mc[Math.min(pick, mc.length - 1)];
          for (const [k, v] of Object.entries(c.effect ?? {})) meters[k] = (meters[k] ?? 0) + v;
        }
      }
      return prof(meters);
    };
    const force = meterSummary(hidenaga, playWith(0)); // 前線・力押しを選び続ける
    const finesse = meterSummary(hidenaga, playWith(1)); // 裏方・調整を選び続ける
    expect(force).not.toBe(finesse); // 「どっち押しても同じ」を回避できている
    expect(force).toBe(hidenaga.meters!.defs.find((d) => d.key === 'kizuna')!.summary);
  });

  it('三メーターとも、片方の選択を選び続ければ最大になり得る（色が分かれる）', () => {
    // 全 effect を合算した到達可能上限で、各メーターが 0 より大きいことを確認。
    const totals: Record<string, number> = {};
    for (const ch of hidenaga.story.chapters) {
      for (const sc of Object.values(ch.scenes)) {
        for (const c of sc.choices ?? []) {
          for (const [k, v] of Object.entries(c.effect ?? {})) totals[k] = (totals[k] ?? 0) + v;
        }
      }
    }
    for (const def of hidenaga.meters!.defs) {
      expect(totals[def.key] ?? 0, `${def.key} は物語中で一度も動かない`).toBeGreaterThan(0);
    }
  });
});
