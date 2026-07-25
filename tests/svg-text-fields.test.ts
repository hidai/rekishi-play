// SVG text の欄に HTML を書かせない機械ゲート。
// 対面の場の名札・人の図の題/説明/凡例/ラベルは <text> として描かれるので、<ruby> は
// タグのまま画面に出る（masako 3-a のラスタ自己点検で発見。骨組みの notebookLead と同型＝
// 「この欄は HTML か」を作品オーサーが取り違えられる欄が、engine の型注記だけでは守れない）。
// 地図ラベルの同族ゲートは tests/map-labels.test.ts。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';

/** 画面に <text> として出る欄 → その値。 */
function svgTextFields(work: (typeof ALL_WORKS)[number]): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const ch of work.story.chapters) {
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      for (const c of sc.closeup?.cast ?? []) {
        if (c.name) out.push([`${sid} closeup name`, c.name]);
      }
    }
  }
  for (const [key, fig] of Object.entries(work.figures ?? {})) {
    if (fig.title) out.push([`figure ${key} title`, fig.title]);
    if (fig.caption) out.push([`figure ${key} caption`, fig.caption]);
    for (const f of fig.factions) out.push([`figure ${key} faction ${f.key}`, f.label]);
    if (fig.kind === 'lineage') {
      for (const n of fig.nodes) if (n.label) out.push([`figure ${key} node ${n.id}`, n.label]);
    } else if (fig.kind === 'assembly') {
      if (fig.dais?.label) out.push([`figure ${key} dais`, fig.dais.label]);
      for (const f of fig.fills) if (f.label) out.push([`figure ${key} seat ${f.seat}`, f.label]);
    } else {
      for (const u of fig.units) {
        if (u.label) out.push([`figure ${key} unit ${u.id}`, u.label]);
        if (u.role) out.push([`figure ${key} role ${u.id}`, u.role]);
      }
    }
  }
  return out;
}

describe('svg-text-fields: SVG text の欄にタグを書かない', () => {
  for (const work of ALL_WORKS) {
    it(`${work.id}: 名札・図のラベルが プレーンテキスト`, () => {
      for (const [where, value] of svgTextFields(work)) {
        expect(value, `${work.id} ${where}: <ruby> 等はタグのまま出る`).not.toMatch(/[<>]/);
      }
    });
  }
});
