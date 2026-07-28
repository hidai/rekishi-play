// ★ふりがなの機械ゲート。規則は「まだ習っていない漢字は、面ごとに初出でルビを振る」
// （検査の実装と面の定義は scripts/lib/ruby-audit.ts のヘッダ）。
//
// なぜ要るか: G8（ルビ漏れ）は shibusawa 章三〜章六で**連続して評価の最大の指摘**だった。
// 人手（LLM 監査）は毎章ちがう漏れを拾い、毎章とりこぼす——面の数が多すぎるから
// （1作あたり 100〜120 面。deep・hist・creed・カード・手がかりはそれぞれ別の面で、
// 「その枝を選んだ人にしか見えない面」が最も漏れた）。ここは総当たりできる機械の仕事。
//
// ラチェット式: BASELINE は「棚卸し前の既知の未ルビ初出」の帳簿で、**増やせない**。
//  ・登録の無いバケツ（新しい章・新しい作品）は 0 でなければ落ちる＝これから書くものは最初から守る。
//  ・直したら数が減って落ちる＝同じサイクルで帳簿を下げさせる（リストは減る一方）。
// しきい値の緩和ではなく帳簿なので、下げるのは自律で可・上げるのは「書いたものを直す」まで不可。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import { auditBuckets, auditWork, bucketOf, unclosedRuby, type RubyMiss } from '../scripts/lib/ruby-audit';
import { KYOIKU_KANJI_BY_GRADE, kanjiGrade } from '../scripts/lib/kanji-grades';

/**
 * 既知の未ルビ初出（棚卸し待ち）。キーは `作品:章` と `作品:card` / `:clue` / `:star` / `:hidden`。
 * **未登録のキーは 0 が要求される**（新章・新作品はここに追加せず、書くときに守る）。
 * 現物は `npx vite-node scripts/ruby-audit.ts <作品slug>` で面ごとに列挙できる。
 */
const BASELINE: Record<string, number> = {
  // hidenaga: 183 件（第1作。非章面と ch1〜ch3 は棚卸し済み＝0 要求。ch4〜ch7 は
  // 下の UNCLOSED のぶんだけ実数より少なく見えている——閉じ忘れを直すと数が出てくる）
  'hidenaga:ch4': 45, 'hidenaga:ch5': 40, 'hidenaga:ch6': 34, 'hidenaga:ch7': 46,
  // kiyomori: 144 件
  'kiyomori:ch1': 3, 'kiyomori:ch2': 3, 'kiyomori:ch3': 11, 'kiyomori:ch4': 1,
  'kiyomori:ch5': 6, 'kiyomori:ch6': 3, 'kiyomori:ch7': 8, 'kiyomori:card': 73,
  'kiyomori:clue': 2, 'kiyomori:hidden': 5, 'kiyomori:timeline': 29,
  // katsu: 192 件
  'katsu:ch1': 19, 'katsu:ch3': 22, 'katsu:ch4': 3, 'katsu:ch5': 3, 'katsu:ch6': 3,
  'katsu:ch7': 2, 'katsu:card': 100, 'katsu:clue': 3, 'katsu:hidden': 3, 'katsu:timeline': 34,
  // ieyasu: 208 件
  'ieyasu:ch1': 11, 'ieyasu:ch2': 8, 'ieyasu:ch3': 9, 'ieyasu:ch4': 15, 'ieyasu:ch5': 6,
  'ieyasu:ch6': 10, 'ieyasu:ch7': 4, 'ieyasu:card': 104, 'ieyasu:clue': 1, 'ieyasu:timeline': 40,
  // davinci: 128 件
  'davinci:ch1': 8, 'davinci:ch2': 11, 'davinci:ch3': 12, 'davinci:ch4': 15,
  'davinci:ch5': 11, 'davinci:ch6': 12, 'davinci:card': 28, 'davinci:clue': 3,
  'davinci:hidden': 1, 'davinci:star': 4, 'davinci:timeline': 23,
  // masako: 197 件
  'masako:ch1': 25, 'masako:ch2': 11, 'masako:ch3': 25, 'masako:ch4': 15, 'masako:ch5': 17,
  'masako:ch6': 27, 'masako:ch7': 13, 'masako:card': 26, 'masako:clue': 3, 'masako:timeline': 35,
  // shibusawa: 棚卸し済み（0 件。2026-07-27）＝以後この作品は新章と同じ「登録なし＝0 要求」で守られる。
};

/**
 * 閉じ忘れた `</ruby>` の帳簿。閉じ忘れは以降の字を「ルビ済み」に見せるので、上の BASELINE を
 * その面のぶんだけ**過少に**する（＝ゲートが自分の目をふさぐ）。BASELINE と同じラチェット。
 */
const UNCLOSED: Record<string, number> = {
  'hidenaga:ch4': 6, 'hidenaga:ch5': 6, 'hidenaga:ch6': 8, 'hidenaga:ch7': 4,
};

describe('学年別漢字配当表（同梱データの検算）', () => {
  it('学年ごとの字数が告示どおり（80/160/200/202/193/191＝1,026字）', () => {
    expect(KYOIKU_KANJI_BY_GRADE.map((g) => [...g].length)).toEqual([80, 160, 200, 202, 193, 191]);
    const all = KYOIKU_KANJI_BY_GRADE.join('');
    expect(new Set([...all]).size, '学年をまたぐ重複がある').toBe(1026);
  });

  it('学年の引きが通る（習う字は 1〜6・中学配当と表外は 0）', () => {
    expect(kanjiGrade('一')).toBe(1);
    expect(kanjiGrade('城')).toBe(4); // 都道府県の20字を含む 2020 施行版であること
    expect(kanjiGrade('攘')).toBe(0); // 表外
    expect(kanjiGrade('慶')).toBe(0); // 中学配当
  });
});

describe('ruby-furigana: 習っていない漢字は面ごとに初出でルビ', () => {
  for (const work of ALL_WORKS) {
    const byBucket = new Map<string, RubyMiss[]>();
    for (const m of auditWork(work)) {
      const key = `${work.id}:${bucketOf(m.surface)}`;
      byBucket.set(key, [...(byBucket.get(key) ?? []), m]);
    }
    const keys = [
      ...new Set([...byBucket.keys(), ...Object.keys(BASELINE).filter((k) => k.startsWith(`${work.id}:`))]),
    ].sort();
    for (const key of keys) {
      const allowed = BASELINE[key] ?? 0;
      it(`${key}: 未ルビ初出 ${allowed} 件のまま（増やさない・直したら帳簿を下げる）`, () => {
        const misses = byBucket.get(key) ?? [];
        expect(
          misses.length,
          allowed === 0
            ? `ルビの無い初出:\n${misses.map((m) => `  ${m.surface} 「${m.char}」 …${m.excerpt}…`).join('\n')}`
            : `BASELINE['${key}'] を ${misses.length} に直す（増えていたら書いたものにルビを足す。npx vite-node scripts/ruby-audit.ts ${work.id}）`,
        ).toBe(allowed);
      });
    }
  }

  for (const work of ALL_WORKS) {
    const found = Object.fromEntries(
      Object.entries(unclosedRuby(work)).map(([b, n]) => [`${work.id}:${b}`, n]),
    );
    const keys = [
      ...new Set([...Object.keys(found), ...Object.keys(UNCLOSED).filter((k) => k.startsWith(`${work.id}:`))]),
    ].sort();
    for (const key of keys) {
      const allowed = UNCLOSED[key] ?? 0;
      it(`${key}: 閉じ忘れた <ruby> ${allowed} 件のまま（増やさない・直したら帳簿を下げる）`, () => {
        expect(found[key] ?? 0, `UNCLOSED['${key}'] を直す（閉じ忘れは未ルビ初出を隠す）`).toBe(allowed);
      });
    }
  }

  it('BASELINE に死んだ登録が無い（作品・章が消えたら掃除する）', () => {
    const live = new Set(ALL_WORKS.flatMap((w) => Object.keys(auditBuckets(w)).map((k) => `${w.id}:${k}`)));
    expect(Object.keys(BASELINE).filter((k) => !live.has(k))).toEqual([]);
  });
});
