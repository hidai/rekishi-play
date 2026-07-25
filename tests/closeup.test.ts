// ★O 対面の場（buildCloseup）の健全性と、作品データ（Scene.closeup）の整合。
import { describe, it, expect } from 'vitest';
import { hidenaga } from '../src/works/hidenaga/index';
import { buildCloseup, closeupPid } from '../src/engine/art/closeup';
import type { SceneCloseup } from '../src/engine/types';

/** 作品内の closeup を持つ全シーン [sceneId, closeup]。 */
function closeupScenes(): Array<[string, SceneCloseup]> {
  const out: Array<[string, SceneCloseup]> = [];
  for (const ch of hidenaga.story.chapters) {
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      if (sc.closeup) out.push([sid, sc.closeup]);
    }
  }
  return out;
}

describe('hidenaga: Scene.closeup データの整合', () => {
  const scenes = closeupScenes();

  it('対面の場が存在する（母の見送り・信長・降伏・茶室・見舞い）', () => {
    const ids = scenes.map(([sid]) => sid);
    expect(ids).toEqual(expect.arrayContaining(['1-d', '2-c', '5-b', '6-c', '7-a2']));
  });

  it('cast は 1〜2 人で、顔スペックが存在する', () => {
    for (const [sid, cu] of scenes) {
      expect(cu.cast.length, `${sid} cast数`).toBeGreaterThanOrEqual(1);
      expect(cu.cast.length, `${sid} cast数`).toBeLessThanOrEqual(2);
      for (const c of cu.cast) {
        expect(hidenaga.faces[c.face], `${sid} face ${c.face}`).toBeTruthy();
      }
    }
  });

  it('cast の名札が解決する（name 上書き or カード名 or peopleExtra）', () => {
    for (const [sid, cu] of scenes) {
      for (const c of cu.cast) {
        const pid = closeupPid(c.face);
        const name = c.name || hidenaga.cards[pid]?.name || hidenaga.peopleExtra[pid];
        expect(name, `${sid} ${c.face} の名前`).toBeTruthy();
      }
    }
  });
});

describe('buildCloseup の出力の健全性', () => {
  const scenes = closeupScenes();

  it.each(scenes.map(([sid]) => [sid] as [string]))('%s が単一の妥当な <svg>', (sid) => {
    const cu = scenes.find(([s]) => s === sid)![1];
    const svg = buildCloseup(hidenaga, sid, cu);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    // 転記された顔の中身を除き、外側の <svg> は 1 枚（faceArt の <svg> ラッパは剥がされる）
    expect(svg.match(/<svg/g)!.length).toBe(1);
    expect(svg).toContain('scene-closeup');
  });

  it('カードのある人物は .mapface[data-pid] でタップできる（地図と同じ契約）', () => {
    for (const [sid, cu] of scenes) {
      const svg = buildCloseup(hidenaga, sid, cu);
      for (const c of cu.cast) {
        const pid = closeupPid(c.face);
        if (hidenaga.cards[pid]) {
          expect(svg, `${sid} ${pid}`).toContain(`data-pid="${pid}"`);
        }
      }
    }
  });

  it('名札のテキストが刻まれる（人物像の名前の反復）', () => {
    for (const [sid, cu] of scenes) {
      const svg = buildCloseup(hidenaga, sid, cu);
      for (const c of cu.cast) {
        const pid = closeupPid(c.face);
        const name = c.name || hidenaga.cards[pid]?.name || hidenaga.peopleExtra[pid] || '';
        if (name) expect(svg, `${sid} ${name}`).toContain(`>${name}</text>`);
      }
    }
  });

  it('主人公の名札は「きみ」の金色（地図の smk-name.you と同じ約束）', () => {
    const cu = closeupScenes().find(([sid]) => sid === '7-a2')![1];
    const svg = buildCloseup(hidenaga, '7-a2', cu);
    expect(svg).toContain('cu-name you');
  });

  it('グラデーション id はシーン接頭辞つきで、シーン間で衝突しない', () => {
    // 属性としての id=（data-pid= を拾わないよう直前が空白のもの）
    const ids = (sid: string, cu: SceneCloseup) =>
      [...buildCloseup(hidenaga, sid, cu).matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    const a = ids('1-d', closeupScenes().find(([s]) => s === '1-d')![1]);
    const b = ids('7-a2', closeupScenes().find(([s]) => s === '7-a2')![1]);
    expect(a.length).toBeGreaterThan(0);
    for (const id of a) expect(id.startsWith('cu-1-d')).toBe(true);
    expect(a.filter((id) => b.includes(id))).toEqual([]);
  });

  it('未知の tone でも落ちない（solemn に代替）', () => {
    const svg = buildCloseup(hidenaga, 'x-test', {
      tone: 'nope',
      cast: [{ face: 'p-hideyoshi' }],
    });
    expect(svg).toContain('<svg');
    expect(svg).toContain('data-pid="p-hideyoshi"');
  });
});
