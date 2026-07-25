// 作品をまたぐ「時代の ものさし」（engine/chrono.ts）。読者が見るのは帯の位置と間隔なので、
// 測れるのは比率の側——軸が全作品を含むか、帯がはみ出さないか、生まれた順に並ぶか。
// 観察メモ 2026-07-25「西暦がわかるようにしたい」の延長（BACKLOG 作品間の連携 2）。
import { describe, it, expect } from 'vitest';
import { eraBand, parseYears } from '../src/engine/chrono';
import { WORK_ENTRIES } from '../src/works/registry';
import type { WorkCard } from '../src/engine/types';

const CARDS = WORK_ENTRIES.map((e) => e.card);

function card(id: string, years: string): WorkCard {
  return { id, protagonistId: 'p', faces: {}, titleMain: id, titleSub: '', years, totalChapters: 7 };
}

describe('生没年の読み取り', () => {
  it('出荷中の全作品の years が読める（作品えらび画面と同じ文字列）', () => {
    for (const c of CARDS) {
      expect(parseYears(c.years), `${c.id}: ${c.years}`).not.toBeNull();
    }
  });

  it('「ごろ」はその側だけを不確かにする', () => {
    expect(parseYears('1118ごろ〜1181')).toEqual({
      born: 1118,
      died: 1181,
      approxBorn: true,
      approxDied: false,
    });
    expect(parseYears('1543〜1616')?.approxBorn).toBe(false);
  });

  it('読めない書式は null（帯に出さない＝軸を壊さない）', () => {
    expect(parseYears('1543')).toBeNull();
    expect(parseYears('生没年不詳')).toBeNull();
    expect(parseYears('1616〜1543'), '没年が先なら不正').toBeNull();
  });
});

describe('時代のものさし（軸と帯）', () => {
  const band = eraBand(CARDS)!;

  it('1作だけなら帯を出さない（比べる相手がいない）', () => {
    expect(eraBand([card('a', '1543〜1616')])).toBeNull();
    expect(eraBand([])).toBeNull();
  });

  it('軸は全作品の生没を含み、100年の切りのいい数で始まり終わる', () => {
    const born = CARDS.map((c) => parseYears(c.years)!.born);
    const died = CARDS.map((c) => parseYears(c.years)!.died);
    expect(band.from % 100).toBe(0);
    expect(band.to % 100).toBe(0);
    expect(band.from).toBeLessThanOrEqual(Math.min(...born));
    expect(band.to).toBeGreaterThanOrEqual(Math.max(...died));
  });

  it('帯は生まれた順（一覧の登録順ではなく年代順）', () => {
    const born = band.bars.map((b) => b.born);
    expect(born).toEqual([...born].sort((a, b) => a - b));
    expect(band.bars.length).toBe(CARDS.length);
  });

  it('どの帯も軸の内側に収まり、細くなりすぎない', () => {
    for (const b of band.bars) {
      expect(b.leftPct, b.id).toBeGreaterThanOrEqual(0);
      expect(b.leftPct + b.widthPct, b.id).toBeLessThanOrEqual(100.001);
      expect(b.widthPct, b.id).toBeGreaterThanOrEqual(2.2);
    }
  });

  it('軸の右端で死んだ短命の人でも帯がはみ出さない（将来のデータの境界）', () => {
    const edge = eraBand([card('long', '1100〜1890'), card('short', '1898〜1899')])!;
    expect(edge.to).toBe(1900);
    for (const b of edge.bars) {
      expect(b.leftPct + b.widthPct, b.id).toBeLessThanOrEqual(100.001);
      expect(b.widthPct, b.id).toBeGreaterThanOrEqual(2.2);
    }
  });

  it('名前は右半分の作品だけ右そろえ（軸の外へ出さない）', () => {
    for (const b of band.bars) {
      const center = b.leftPct + b.widthPct / 2;
      expect(b.capAlign, `${b.id} center=${center}`).toBe(center > 50 ? 'right' : 'left');
      expect(b.capPad).toBeGreaterThanOrEqual(0);
      expect(b.capPad).toBeLessThan(100);
    }
  });

  it('目盛りは軸の中に 2〜5 本', () => {
    expect(band.ticks.length).toBeGreaterThanOrEqual(2);
    expect(band.ticks.length).toBeLessThanOrEqual(6);
    for (const t of band.ticks) {
      expect(t).toBeGreaterThanOrEqual(band.from);
      expect(t).toBeLessThanOrEqual(band.to);
    }
  });

  it('同時代どうしは重なり、離れた時代は離れる（間隔が語る装置）', () => {
    const by = Object.fromEntries(band.bars.map((b) => [b.id, b]));
    const overlap = (a: string, b: string) =>
      by[a].leftPct < by[b].leftPct + by[b].widthPct && by[b].leftPct < by[a].leftPct + by[a].widthPct;
    expect(overlap('kiyomori', 'masako'), '清盛と政子は重なる').toBe(true);
    expect(overlap('hidenaga', 'ieyasu'), '秀長と家康は重なる').toBe(true);
    expect(overlap('masako', 'hidenaga'), '政子と秀長は離れている').toBe(false);
  });
});
