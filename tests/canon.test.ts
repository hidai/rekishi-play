// ★L「きみの読み」（史実一致率）の純粋ロジック検証＋作品データの canon 整合。
import { describe, it, expect } from 'vitest';
import { canonStat, hasCanon, choiceKey } from '../src/engine/canon';
import { hidenaga } from '../src/works/hidenaga/index';

describe('hidenaga: canon データ整合', () => {
  // canon を意図的に持たない分かれ道：
  // - 7-c 終章の「きみの答え」（どれも正解のひとつ）
  // - 7-a2 兄弟の最後のことば（記録に残っていない＝史実ともいえず、もしもでもない）
  const NO_CANON = new Set(['7-c', '7-a2']);
  it('意図した例外以外の全分かれ道に canon が1つ以上ある', () => {
    for (const ch of hidenaga.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        if (!sc.choices?.length) continue;
        const hasC = sc.choices.some((c) => c.canon);
        if (NO_CANON.has(sid)) {
          expect(hasC, `${sid} は canon 対象外`).toBe(false);
        } else {
          expect(hasC, `ch${ch.id} ${sid} に canon がない`).toBe(true);
        }
      }
    }
  });
  it('hasCanon は true', () => {
    expect(hasCanon(hidenaga)).toBe(true);
  });
});

describe('canonStat', () => {
  it('履歴なしは 0/0', () => {
    expect(canonStat(hidenaga, {})).toEqual({ matched: 0, total: 0 });
    expect(canonStat(hidenaga, undefined)).toEqual({ matched: 0, total: 0 });
  });

  it('初回の選択（先頭）で判定する', () => {
    // 1-b: choice0 が canon。初回 canon → 一致。
    expect(canonStat(hidenaga, { [choiceKey(1, '1-b')]: [0] })).toEqual({ matched: 1, total: 1 });
    // 初回に非 canon → 不一致（あとで canon を選び直しても動かない）。
    expect(canonStat(hidenaga, { [choiceKey(1, '1-b')]: [1, 0] })).toEqual({ matched: 0, total: 1 });
  });

  it('canon を持たない分かれ道（終章の答え）は集計対象外', () => {
    expect(canonStat(hidenaga, { [choiceKey(7, '7-c')]: [0] })).toEqual({ matched: 0, total: 0 });
  });

  it('複数 canon の分かれ道（6-b）はどちらを選んでも一致', () => {
    expect(canonStat(hidenaga, { [choiceKey(6, '6-b')]: [0] }).matched).toBe(1);
    expect(canonStat(hidenaga, { [choiceKey(6, '6-b')]: [1] }).matched).toBe(1);
  });

  it('複数の分かれ道を合算する', () => {
    const choices = {
      [choiceKey(1, '1-b')]: [0], // 一致
      [choiceKey(1, '1-c')]: [0], // 不一致（canon は choice1）
      [choiceKey(2, '2-b')]: [1], // 一致
    };
    expect(canonStat(hidenaga, choices)).toEqual({ matched: 2, total: 3 });
  });
});
