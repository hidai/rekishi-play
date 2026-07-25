// ★G 人生ステージの見せ場（純粋ロジック）検証。
// 章冒頭で主人公の顔が前章と変わる変わり目だけ発火し、それ以外は null であること。
import { describe, it, expect } from 'vitest';
import { stageMoment } from '../src/engine/stage';
import { hidenaga } from '../src/works/hidenaga/index';

describe('stageMoment: 発火する変わり目', () => {
  it('第1章冒頭＝「きみ＝この子」の宣言で発火（なりきりの初期化）', () => {
    const m = stageMoment(hidenaga, 1, '1-a');
    expect(m?.faceKey).toBe('p-hidenaga@child');
    expect(m?.title).toBeTruthy();
    expect(m?.caption).toBeTruthy();
  });
  it('第2章冒頭＝子ども→若武者で発火', () => {
    const m = stageMoment(hidenaga, 2, '2-a');
    expect(m?.faceKey).toBe('p-hidenaga@young');
    expect(m?.title).toBeTruthy();
    expect(m?.caption).toBeTruthy();
  });
  it('第5章冒頭＝若武者→大納言(elder)で発火', () => {
    expect(stageMoment(hidenaga, 5, '5-a')?.faceKey).toBe('p-hidenaga@elder');
  });
  it('終章冒頭＝elder→晩年(old)で発火', () => {
    expect(stageMoment(hidenaga, 7, '7-a')?.faceKey).toBe('p-hidenaga@old');
  });
});

describe('stageMoment: 発火しない場面', () => {
  it('第3・4章は同じ若武者ステージなので発火しない', () => {
    expect(stageMoment(hidenaga, 3, '3-a')).toBeNull();
    expect(stageMoment(hidenaga, 4, '4-a')).toBeNull();
  });
  it('第6章は同じ大納言ステージなので発火しない', () => {
    expect(stageMoment(hidenaga, 6, '6-a')).toBeNull();
  });
  it('章の start でないシーンでは発火しない', () => {
    expect(stageMoment(hidenaga, 2, '2-b')).toBeNull();
  });
});

describe('stageMoment: すべての発火先に文言がある', () => {
  it('protagonistStages のキーが各ステージの顔キーを網羅', () => {
    // 変わり目の faceKey には必ず title/caption が定義されている。
    for (const [ch, scene] of [
      [1, '1-a'],
      [2, '2-a'],
      [5, '5-a'],
      [7, '7-a'],
    ] as const) {
      const m = stageMoment(hidenaga, ch, scene);
      expect(m).not.toBeNull();
      expect(hidenaga.protagonistStages?.[m!.faceKey]).toBeTruthy();
    }
  });
});
