// 勝海舟（第3作）の作品固有 assertion。
// 構造整合（遷移・参照・地図・章数・相関図・メーター等）は tests/work-integrity.test.ts が
// registerWorkStructure を全 WORKS に回して担保する。ここにはセーブの枠の分離（Account.works[id]）と、
// 海舟固有の設計上限（人物カード≤14＝design §3-1）だけを残す（汎用ヘルパーの守備範囲外）。
import { describe, it, expect } from 'vitest';
import { katsu } from '../src/works/katsu/index';
import { kiyomori } from '../src/works/kiyomori/index';
import { hidenaga } from '../src/works/hidenaga/index';

describe('katsu: セーブの枠の分離（Account.works[id]）', () => {
  it('新規 id で、既存 hidenaga/kiyomori の 枠に 触れない', () => {
    expect(katsu.faceHintKey).not.toBe(hidenaga.faceHintKey);
    expect(katsu.faceHintKey).not.toBe(kiyomori.faceHintKey);
  });
  it('id が既存作品と衝突しない', () => {
    expect(katsu.id).toBe('katsu');
    expect(katsu.id).not.toBe(hidenaga.id);
    expect(katsu.id).not.toBe(kiyomori.id);
  });
});

describe('katsu: 人物カードの設計上限（design §3-1）', () => {
  it('人物カードは 14 人以下（幕末の人物過密を先回りで抑制）', () => {
    const people = Object.values(katsu.cards).filter((c) => c.type === 'person');
    expect(people.length).toBeLessThanOrEqual(14);
  });
});
