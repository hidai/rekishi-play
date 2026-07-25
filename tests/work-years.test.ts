// 作品カード／タイトルに出す生没年（WorkStrings.years）は、同じ作品の年表が語る年と
// 食い違ってはならない——読者はこの2つを同じ画面のうちに見る。
// 観察メモ 2026-07-25「西暦がわかるようにしたい。人物を選ぶときと、プレイ中。」
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';

/** '1519/5/2' や '1540?' から先頭の西暦4桁を取る。 */
function year(s: string): string | undefined {
  return s.match(/\d{4}/)?.[0];
}

describe('主人公の生没年（作品を選ぶ画面の西暦）', () => {
  for (const w of WORKS) {
    it(`${w.id}: 年表の「生まれる」「死す」と一致する`, () => {
      const digits = w.strings.years.match(/\d{4}/g);
      expect(digits, `${w.id} の years に西暦4桁が2つ必要`).toHaveLength(2);
      const [born, died] = digits!;
      // 年表は主人公が生まれる年から始まる。没年は年表のどこかに立っている
      // （death フラグは「死のトーン」の印で、主人公の死とは限らない）。
      expect(born).toBe(year(w.timeline[0].y));
      expect(w.timeline.map((t) => year(t.y))).toContain(died);
      expect(+died - +born).toBeGreaterThan(20);
      expect(+died - +born).toBeLessThan(100);
    });
  }

  it('章の years は全章そろっている（本編中の「西暦」表示の材料）', () => {
    for (const w of WORKS) {
      for (const ch of w.story.chapters) {
        expect(ch.years, `${w.id} 第${ch.id}章`).toMatch(/\d{4}/);
      }
    }
  });
});
