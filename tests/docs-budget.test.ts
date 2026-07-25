// 可変ドキュメントのサイズ予算（無人ループのトークン規律の機械ゲート）。
// `/auto-dev` が毎サイクル読む BACKLOG/JOURNAL は書き換わる＝キャッシュに乗らず、
// バイト数がそのまま毎サイクルの再処理トークンになる。肥大したら掃き出す（超過＝赤）。
// 運用・掃き出し先は `/auto-dev` スキル step8。
// 体験予算（style-budget.test.ts）とは別のプロセス衛生予算＝ハード境界でないので、
// しきい値を下げる（厳しくする）のは自律で可。上げる前に「掃き出せないか」を先に疑う。
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// live で毎サイクル読むファイルのバイト上限。掃除直後の実サイズに現実的な伸びしろを足した値。
// - BACKLOG: アクティブなタスク＋1行スタブ＋人間が書き足す観察メモ。完了/park の逐語は archive/git へ。
// - JOURNAL: 直近の全文エントリ＋畳んだ 📁 スタブ塊。step8 はこの上限に収まるようバイトで
//   self-prune（件数でなくバイトが基準）＝超過前に最古の全文を archive へ移し、太ったスタブ塊は
//   古い群をグループ・スタブへ集約する（件数ゲートは無い＝スタブ塊が上限を破る前に畳ませるため）。
// - REVIEW: 人間が週1で読む唯一の面。step9 で毎サイクル上書き集約する live 面なのに予算が無く、
//   誰も append 化に気づかないまま 62KB まで肥大した（＝「1枚」の体を成さなくなった）。掃除の対象は
//   BACKLOG/JOURNAL だけではなかった。⚠️ REVIEW は archive を持たない（履歴は git・人間宛の逐語を
//   残さない）＝下の 📁 スタブ検査は適用外。2026-07-25 に 28KB→16KB へ**厳格化**——バイトが 28KB でも
//   「多すぎて何をしていいかわからない」（人間指摘）＝量でなく形の問題で、④報告の圧縮と③3件上限
//   （`tests/review-shape.test.ts`）で ≈12KB に収まった。上げる前に「掃き出せないか」を先に疑う。
const BUDGET = {
  'docs/BACKLOG.md': 24_000,
  'docs/JOURNAL.md': 30_000,
  'docs/REVIEW.md': 16_000,
};

describe('docs-budget: 可変ドキュメントのサイズ予算（トークン規律）', () => {
  for (const [rel, max] of Object.entries(BUDGET)) {
    it(`${rel} ≤ ${max} bytes（超過は archive/git へ掃き出す）`, () => {
      const path = fileURLToPath(new URL(`../${rel}`, import.meta.url));
      const bytes = readFileSync(path).byteLength;
      expect(bytes).toBeLessThanOrEqual(max);
    });
  }
});

// 規則面のバイト上限。上の BUDGET と違い理由はトークンでない（安定ファイル＝キャッシュに乗る）。
// 理由は「長い規則は守られない」。予算の無い規則面は太る——2026-07-16 に auto-dev SKILL.md が
// 12.4KB へ肥大し、憲法 VISION+CRITERIA の合計 8.4KB を超えていた（規則の全文コピー3面ぶんと、
// 規則本文に書かれた経緯）。規則は1か所にだけ書き（CLAUDE.md「規則の在り処」）、経緯は git/JOURNAL へ。
// VISION/CRITERIA は意図的に対象外——人間専用の文書に予算ゲートを張ると、人間の加筆で
// AI が自力で解除できない赤が生まれる（CLAUDE.md「AI が作る停止条件」の規則に反する）。
const RULES_BUDGET = {
  'CLAUDE.md': 10_000,
  'docs/WRITING.md': 8_000,
  '.claude/skills/auto-dev/SKILL.md': 10_000,
  '.claude/skills/eval-work/SKILL.md': 9_000,
  '.claude/skills/visual-check/SKILL.md': 6_000,
};

describe('docs-budget: 規則面のサイズ予算（ルールは短く）', () => {
  for (const [rel, max] of Object.entries(RULES_BUDGET)) {
    it(`${rel} ≤ ${max} bytes（経緯は git/JOURNAL へ・規則は1か所に）`, () => {
      const path = fileURLToPath(new URL(`../${rel}`, import.meta.url));
      const bytes = readFileSync(path).byteLength;
      expect(bytes).toBeLessThanOrEqual(max);
    });
  }
});

// self-prune は「live から本文を消す」と「archive に本文を足す」の2手からなり、上のサイズ予算は
// 前者しか報いない——後者を忘れても live は縮み、緑のまま申し送りが消える。実際 2件（c6da81a の
// 人の図 横長再デザイン・レオナルド設計探索）が、スタブに「archive へ退避（self-prune）」と
// 書かれたまま archive に本文が無い状態で見つかった（2026-07-15 に git から復元）。本文は git に
// 残るが、スタブの指す先が空＝次のセッションはポインタを追って何も見つけられない。
// 引用符の差（「」/『』）だけは正規化する（スタブが 本文の 見出しを 引用し直す ときに揺れる）。
const read = (rel: string) => readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)), 'utf8');
const unquote = (s: string) => s.replace(/[『』「」]/g, '');

describe('docs-budget: self-prune の掃き出し先（archive）が実在する', () => {
  it('JOURNAL live の 📁 スタブが指すエントリが JOURNAL-archive に存在する', () => {
    const archive = unquote(read('docs/JOURNAL-archive.md'));
    const stubs = read('docs/JOURNAL.md')
      .split('\n')
      .filter((l) => l.startsWith('> 📁') && l.includes('「'));
    expect(stubs.length, '📁 スタブが1つも無い＝この検査が空回りしている').toBeGreaterThan(0);
    const dangling = stubs
      .map((l) => /「(.+?)」/.exec(l)![1])
      .filter((title) => !archive.includes(unquote(title).slice(0, 12)));
    expect(dangling, 'スタブは archive へ退避したと言うが、archive に本文が無い').toEqual([]);
  });
});
