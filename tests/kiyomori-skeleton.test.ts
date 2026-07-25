// 平清盛（第2作）の作品固有 assertion。
// 構造整合（遷移・参照・地図・章数・相関図・メーター等）は tests/work-integrity.test.ts が
// registerWorkStructure を全 WORKS に回して担保する。ここにはセーブの枠の分離（Account.works[id]）
// と、名指しシーンの意図 pin（汎用ヘルパーの守備範囲外）を残す。
import { describe, it, expect } from 'vitest';
import { kiyomori } from '../src/works/kiyomori/index';
import { hidenaga } from '../src/works/hidenaga/index';

describe('kiyomori: セーブの枠の分離（Account.works[id]）', () => {
  it('新規 id で、既存 hidenaga の 枠に 触れない', () => {
    expect(kiyomori.faceHintKey).not.toBe(hidenaga.faceHintKey);
  });
  it('id が hidenaga と衝突しない', () => {
    expect(kiyomori.id).toBe('kiyomori');
    expect(kiyomori.id).not.toBe(hidenaga.id);
  });
});

// Playtest note 2026-07-13 "the Genji uprising is nowhere on the map" — the map, not the
// text, must carry these scenes (VISION principle 5). Pins the authored intent so a later
// edit can't silently drop the map back to the one-face fallback.
describe('kiyomori: 名指しシーンの地図', () => {
  it('源氏挙兵（6-c）：伊豆に頼朝の敵旗が立ち、東国が敵地色に染まる', () => {
    const def = kiyomori.map.sceneMaps['6-c'];
    const izu = def.markers?.find((m) => m.at === 'izu');
    expect(izu?.enemy, '頼朝の旗は敵色').toBeTruthy();
    expect(izu?.people).toContain('p-yoritomo');
    // Eastern provinces (Kanto extension + Kai/Shinano + 東海道 three) flood with the enemy fill.
    expect(def.contested).toEqual([8, 9, 10, 11, 13, 14, 19, 20, 'shimosa', 'kazusa', 'awa', 'totomi', 'suruga', 'izu']);
  });
  it('壇ノ浦（7-b）：清盛のひらいた海の道の西端で平家が終わる（cur なし＝清盛は故人）', () => {
    const def = kiyomori.map.sceneMaps['7-b'];
    expect(def.route).toBe('sea-road');
    const dan = def.markers?.find((m) => m.at === 'dannoura');
    expect(dan?.kind).toBe('battle');
    // 二位尼＝壇ノ浦で入水する老尼（research §4B・要件②）＝@old variant で描く。
    expect(dan?.people).toEqual(['p-tokiko@old', 'p-tomomori']);
    expect(def.markers?.some((m) => m.cur)).toBe(false);
  });
  it('保元の乱（2-a）：開幕の状況＝都が割れ崇徳と後白河がにらみ合う（末尾の讃岐配流は 2-d の payoff へ後置＝観察メモ 2026-07-14。地図は入口の状況にアンカーする）', () => {
    const def = kiyomori.map.sceneMaps['2-a'];
    const kyo = def.markers?.find((m) => m.at === 'heiankyo');
    expect(kyo?.kind).toBe('battle');
    expect(kyo?.people, '両陣営の顔で「まっぷたつ」を示す').toEqual(['p-sutoku', 'p-goshirakawa']);
    // The exile aftermath must NOT pre-empt the opening: no 讃岐 marker in 2-a (it lands in 2-d).
    expect(def.markers?.some((m) => m.at === 'sanuki'), '結末の讃岐配流は 2-a に出さない').toBe(false);
  });
  it('平治の乱（2-b）：敵旗の京と熊野道中のきみ（帰路はまだ引かない＝岐路の緊張）', () => {
    const def = kiyomori.map.sceneMaps['2-b'];
    const kyo = def.markers?.find((m) => m.at === 'heiankyo');
    expect(kyo?.enemy, '義朝らの旗は敵色').toBeTruthy();
    expect(kyo?.people).toContain('p-yoshitomo');
    expect(def.markers?.find((m) => m.cur)?.at).toBe('kumanoji');
    expect(def.route, '引き返す前＝ルート線なし').toBeUndefined();
  });
  it('鹿ヶ谷（5-b）：京のたくらみと、枠外はるか南の鬼界ヶ島（俊寛の遠島）', () => {
    const def = kiyomori.map.sceneMaps['5-b'];
    expect(def.markers?.find((m) => m.cur)?.at).toBe('shishigatani');
    const kikai = def.markers?.find((m) => m.at === 'kikaigashima');
    expect(kikai?.off, '鬼界ヶ島は枠外＝端矢印').toBeTruthy();
  });
  it('第2章むすび（2-d）：勝者の京と、物語に残った敗者の讃岐（崇徳が京→讃岐へ移り配流の距離が payoff として着地）', () => {
    const def = kiyomori.map.sceneMaps['2-d'];
    expect(def.markers?.find((m) => m.cur)?.at).toBe('rokuhara');
    expect(def.markers?.find((m) => m.at === 'sanuki')?.people).toContain('p-sutoku');
  });
});

// The fallback-map completeness guard (playtest 2026-07-13 root cause (B)) moved to
// tests/visual-coverage.test.ts, which asserts it for every COMPLETED work with a
// stricter "bare entry" definition and reports authoring-in-progress works via
// scripts/visual-coverage.ts without failing them.
