// Human review 2026-07-25: 「docs/REVIEW.md の項目が多すぎて、何をどうしていいかわからない」.
// The size budget (docs-budget.test.ts) capped the bytes but not the SHAPE: decisions the human
// alone can make sat in the same visual register as ~40 lines of FYI, so the sheet read as a
// homework list instead of a menu. This gate fixes the shape the loop must rewrite into every
// cycle: four ordered sections, the actionable ones first, and a hard cap of 3 playtest asks
// (an unbounded list is how the drift happened — the loop kept appending observations it could
// not itself answer). Tightening a gate is autonomous; the sheet's own header states the rule.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const review = readFileSync(fileURLToPath(new URL('../docs/REVIEW.md', import.meta.url)), 'utf8');
const headings = review.split('\n').filter((l) => l.startsWith('## '));

// Section bodies are keyed by the ①..④ marker so the loop may reword the rest of the heading.
const section = (marker: string) => {
  const i = headings.findIndex((h) => h.startsWith(`## ${marker}`));
  const from = review.indexOf(headings[i]);
  const to = i + 1 < headings.length ? review.indexOf(headings[i + 1]) : review.length;
  return review.slice(from, to);
};

const MAX_ASKS = 3;

describe('review-shape: 人間面は4節・実機依頼は3件まで', () => {
  it('①判断 ②止めるなら今のうち ③実機で見てほしいこと ④報告 の4節がこの順に1つずつある', () => {
    expect(headings.map((h) => h.slice(3, 4))).toEqual(['①', '②', '③', '④']);
  });

  it('④報告 が最後＝読み飛ばせる位置にある（報告が判断を埋めない）', () => {
    expect(review.trimEnd().endsWith(section('④').trimEnd())).toBe(true);
  });

  it(`③の実機依頼が ${MAX_ASKS} 件以下（増やすなら古いものを落とす）`, () => {
    const asks = section('③')
      .split('\n')
      .filter((l) => /^\d+\. /.test(l));
    expect(asks.length, '観点を積むのでなく毎サイクル選び直す').toBeLessThanOrEqual(MAX_ASKS);
    expect(asks.length, '③が空＝人間に何を見てほしいか書けていない').toBeGreaterThan(0);
  });

  it('③が観察の書き戻し先（BACKLOG の観察メモ）を名指ししている', () => {
    expect(section('③')).toMatch(/BACKLOG\.md/);
    expect(section('③')).toMatch(/観察メモ/);
  });
});
