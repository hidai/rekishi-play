// 色ユーティリティ（似顔絵の派生色の土台）の検証。
import { describe, it, expect } from 'vitest';
import { mixHex } from '../src/engine/art/color';

describe('mixHex', () => {
  it('境界値: t=0 で a、t=1 で b を返す', () => {
    expect(mixHex('#f0c69f', '#96522f', 0)).toBe('#f0c69f');
    expect(mixHex('#f0c69f', '#96522f', 1)).toBe('#96522f');
  });
  it('中間値: チャンネルごとの線形補間（丸めは四捨五入）', () => {
    expect(mixHex('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(mixHex('#ff0000', '#0000ff', 0.5)).toBe('#800080');
  });
  it('決定的: 同じ入力は常に同じ出力（似顔絵の再現性の前提）', () => {
    expect(mixHex('#f2dcc6', '#42281c', 0.55)).toBe(mixHex('#f2dcc6', '#42281c', 0.55));
  });
  it('各チャンネルが2桁で桁落ちしない（#0? 系）', () => {
    expect(mixHex('#000000', '#0a0a0a', 0.5)).toBe('#050505');
  });
});
