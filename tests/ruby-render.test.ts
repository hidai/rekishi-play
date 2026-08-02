// ★ruby HTML の描画契約の機械検査。
// 作品データの本文欄は <ruby> ふりがな付き HTML で、エンジンは {@html} で描画する契約
// （src/engine/types.ts の TRUST BOUNDARY ヘッダ）。ところが1箇所でもテキスト補間 `{x.title}`
// で書くと、子どもの画面に「<ruby>蒸気船<rt>...」がタグごと生表示される。型チェックも
// 既存テストも DOM を持たないこの面を見ないため、家族のプレイで初めて露見した
// （2026-07-15 観察メモ「蒸気船を動かす のタイトルにタグが見えて壊れている」＝
//  SortPanel の見出しと SceneScreen のゲートボタンの2箇所）。
//
// ここでは同じクラスのバグを2方向から塞ぐ:
//  (1) データ側: 「エンジンがテキストとして描く」と決めた欄に <ruby> が混入していないか。
//  (2) 描画側: 実データが <ruby> を持つ欄名を、エンジンが {@html} なしで補間していないか。
//      新しい素通し箇所は EXEMPT に理由付きで登録しない限り落ちる。
//
// 注意: EXEMPT は「@html にすべき」の逆ではない。読者が打った文字列（セーブ枠の名前）は
// **テキスト補間のままでなければならない**（信頼境界＝作品データだけが信頼済み HTML）。
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { WORKS } from '../src/works/index';

const RUBY = '<ruby>';

/* --- (1) データ側: テキストとして描く欄は ruby を持てない --- */

describe('ruby 契約: エンジンがテキストで描く作品データ欄に <ruby> を混ぜない', () => {
  for (const work of WORKS) {
    it(`${work.id}: カードの name / read（GCard・CardModal・QuizPane がテキスト描画）`, () => {
      for (const [id, c] of Object.entries(work.cards)) {
        expect(c.name, `card ${id} name`).not.toContain(RUBY);
        expect(c.read ?? '', `card ${id} read`).not.toContain(RUBY);
      }
    });

    it(`${work.id}: 章の years（HomeScreen の年代がテキスト描画）`, () => {
      for (const ch of work.story.chapters) {
        expect(ch.years, `ch${ch.id} years`).not.toContain(RUBY);
      }
    });

    it(`${work.id}: meters.title と shortNames（メーター見出し・手帳のタブ名がテキスト描画）`, () => {
      expect(work.meters?.title ?? '', 'meters.title').not.toContain(RUBY);
      // heroName() feeds the 「〜のことば」 tab label; the ruby form is heroRubyHtml().
      for (const [id, n] of Object.entries(work.shortNames)) {
        expect(n, `shortName ${id}`).not.toContain(RUBY);
      }
    });

    it(`${work.id}: 相関図の rel（relationMap が SVG <text> で描画＝手帳のクイズも同じ欄を出す）`, () => {
      for (const r of work.relations?.edges ?? []) {
        expect(r.rel, `relation ${r.pid} rel`).not.toContain(RUBY);
      }
    });

    it(`${work.id}: march ミニゲームの landmarks[].label（進度バーがテキスト描画）`, () => {
      for (const ch of work.story.chapters) {
        for (const [sid, sc] of Object.entries(ch.scenes)) {
          if (sc.minigame?.type !== 'march') continue;
          for (const lm of sc.minigame.landmarks ?? []) {
            expect(lm.label, `${sid} landmark ${lm.at}`).not.toContain(RUBY);
          }
        }
      }
    });

    // 手帳「進軍の地図」の2欄は campaignMap.ts が textContent で書く＝タグのまま出る。
    // shibusawa は7章ぜんぶ ruby 入りで書かれていた（この作品は campaign-map 層が空なので
    // タブ自体が出ず、画面に露見しないまま残った）。タグは `[<>]` で見る——<b> も同じく出る。
    it(`${work.id}: 地図キャプション と runnerLabel（campaignMap が textContent で描画）`, () => {
      for (const [ch, cap] of Object.entries(work.map.chapterCaptions)) {
        expect(cap, `chapterCaptions ${ch}`).not.toMatch(/[<>]/);
      }
      for (const r of work.map.campaignRoutes) {
        expect(r.runnerLabel ?? '', `campaignRoute ${r.key} runnerLabel`).not.toMatch(/[<>]/);
      }
    });
  }
});

/* --- (2) 描画側: ruby を持つ欄名の素通し補間を許さない --- */

/**
 * Leaf field names the TYPE contract declares ruby-bearing ("ruby HTML allowed" in the
 * doc comment above the field), whether or not any shipped work fills them yet.
 *
 * Walking the data alone (below) only guards fields TODAY'S data happens to populate: a
 * brand-new device wires up its UI before any work authors data for it, so its ruby
 * fields would be invisible to this gate exactly while the code that must render them
 * is being written (`ObserveSpec.prompt` was the first — 2026-07-16). The declaration is
 * the earlier, truer source: it exists the moment the field does.
 */
function declaredRubyFields(): Set<string> {
  const src = readFileSync('src/engine/types.ts', 'utf8');
  const out = new Set<string>();
  for (const m of src.matchAll(/\/\*\*([\s\S]*?)\*\/\s*([a-zA-Z_$][\w$]*)\??\s*:/g)) {
    if (m[1].includes('ruby HTML allowed')) out.add(m[2]);
  }
  return out;
}

/** Leaf field names that carry <ruby> somewhere in real work data. */
function rubyFieldNames(): Set<string> {
  const names = new Set<string>();
  const seen = new Set<unknown>();
  const walk = (v: unknown, key: string): void => {
    if (typeof v === 'string') {
      if (v.includes(RUBY)) names.add(key);
      return;
    }
    if (!v || typeof v !== 'object' || seen.has(v)) return;
    seen.add(v);
    if (Array.isArray(v)) {
      for (const item of v) walk(item, key);
      return;
    }
    for (const [k, val] of Object.entries(v)) walk(val, k);
  };
  for (const w of WORKS) walk(w, 'root');
  return names;
}

function svelteFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...svelteFiles(p));
    else if (e.name.endsWith('.svelte')) out.push(p);
  }
  return out;
}

/**
 * Plain-text interpolation sites that are correct as-is, keyed `File.svelte:{expr}`.
 * A site belongs here only if it never renders work-authored ruby HTML.
 */
const EXEMPT: Record<string, string> = {
  // Reader-typed save-slot names. MUST stay text-interpolated — the trust boundary
  // covers work data only, never reader input.
  'AccountsScreen.svelte:{accountLabel(a)}': 'reader-typed account name (or the なまえ なし fallback)',
  'WorkSelectScreen.svelte:{account.name}': 'reader-typed account name',
  // Engine-owned strings (not work data): dialog copy and the confidence-mark legend.
  'DialogHost.svelte:{dialog.current.title}': 'engine dialog copy',
  'SparksPane.svelte:{c.label}': 'engine CONFIDENCE_LEGEND',
  'SparksPane.svelte:{info.label}': 'engine confidenceInfo',
  'SceneScreen.svelte:{info.label}': 'engine confidenceInfo',
  'NotebookScreen.svelte:{t.label}': 'engine tab names (hero part comes from heroName, not heroRubyHtml)',
  'Topbar.svelte:{c.label}':
    'engine breadcrumb labels (作品/年代記/第N章/手帳) + strings.topbarName, which is ruby-free by contract — the topbar is too small a surface to carry ruby',
  // Work data contractually kept ruby-free — guarded by the data-side tests above.
  'GCard.svelte:{c.name}': 'card name (ruby-free by contract)',
  'CardModal.svelte:{card.name}': 'card name (ruby-free by contract)',
  'CardModal.svelte:{peer.card.name}': 'card name of the same person in another work (ruby-free by contract)',
  'QuizPane.svelte:{answerCard.name}': 'card name (ruby-free by contract)',
  'HomeScreen.svelte:{ch.years}': 'chapter years (ruby-free by contract)',
  'MarchPanel.svelte:{lm.label}': 'march landmark label (ruby-free by contract)',
  'MeterBar.svelte:{work.meters.title}': 'meter heading (ruby-free by contract)',
  // Quiz.prompt is a union of two different strings: creedToChapter fills it with a creed
  // line (ruby HTML — drawn with {@html} on its own branch) and relationToPerson fills it
  // with Relation.rel, which cannot carry ruby (the graph draws it as SVG <text>).
  'QuizPane.svelte:{q.prompt}': 'relation label via Relation.rel (ruby-free by contract)',
  // Not a render site: the work id goes to EraBand as a prop to highlight this work's bar.
  'TimelinePane.svelte:{work.id}': 'work id passed as a prop, never drawn',
};

describe('ruby 契約: エンジンは ruby を持つ欄を {@html} で描く', () => {
  it('新しい素通し補間サイトが無い（あれば {@html} 化か EXEMPT 登録）', () => {
    const declared = declaredRubyFields();
    // Sanity: the type-comment parse actually sees a field no shipped work fills yet
    // (that gap is the whole reason this half exists).
    expect(declared).toContain('prompt');
    const rubyNames = new Set([...rubyFieldNames(), ...declared]);
    // Sanity: the walker actually found the fields we know carry ruby.
    expect(rubyNames).toContain('title');
    expect(rubyNames).toContain('body');

    const offenders: string[] = [];
    for (const file of svelteFiles('src/engine')) {
      const src = readFileSync(file, 'utf8');
      const base = file.split('/').pop()!;
      // `{a.b.c}` with no leading @html, no operators/calls inside.
      for (const m of src.matchAll(/\{([a-zA-Z_$][\w$]*(?:\.[a-zA-Z_$][\w$]*)+)\}/g)) {
        const expr = m[1];
        const leaf = expr.split('.').pop()!;
        if (!rubyNames.has(leaf)) continue;
        const key = `${base}:{${expr}}`;
        if (key in EXEMPT) continue;
        offenders.push(key);
      }
    }
    expect(
      [...new Set(offenders)].sort(),
      'ruby HTML がタグごと生表示される。{@html} で描くか、テキストが正しいなら EXEMPT に理由を添えて登録する',
    ).toEqual([]);
  });

  it('EXEMPT に死んだ登録が無い（サイトが消えたら掃除する）', () => {
    const srcs = svelteFiles('src/engine').map((f) => [f.split('/').pop()!, readFileSync(f, 'utf8')] as const);
    const stale = Object.keys(EXEMPT).filter((key) => {
      const [base, expr] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
      return !srcs.some(([b, s]) => b === base && s.includes(expr));
    });
    expect(stale, 'EXEMPT の登録がもう存在しない').toEqual([]);
  });
});

/* --- (3) 描画側その2: .svelte の外の DOM 直書き（textContent） --- */

/**
 * (2) は `.svelte` の補間しか見ない。だが地図は DOM を手で組み立てる `.ts` で、
 * `el.textContent = <作品データ>` は「タグのまま出る」面をもう一つ作る——shibusawa の章
 * キャプションは7章ぶん ruby を持ったまま残っていた（この作品は campaign-map 層が空で
 * タブが出ないため、画面にも露見しなかった）。sink を黙って増やせないよう登録制にする。
 * 新しい sink を足すときは、その欄のデータ側検査を (1) に足してからここへ登録する。
 */
const TEXT_SINKS: Record<string, string> = {
  'campaignMap.ts:cap': 'work.map.chapterCaptions —— (1) がプレーンを強制',
  'campaignMap.ts:rl': 'CampaignRoute.runnerLabel —— (1) がプレーンを強制',
};

function tsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...tsFiles(p));
    else if (e.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

describe('ruby 契約: textContent の sink は登録制', () => {
  it('未登録の textContent sink が無い', () => {
    const found = new Set<string>();
    for (const file of tsFiles('src/engine')) {
      const src = readFileSync(file, 'utf8');
      const base = file.split('/').pop()!;
      for (const m of src.matchAll(/([A-Za-z_$][\w$]*)\.textContent\s*=/g)) found.add(`${base}:${m[1]}`);
    }
    expect(
      [...found].filter((k) => !(k in TEXT_SINKS)).sort(),
      'textContent は HTML を描かない。作品データを流すなら (1) にプレーン検査を足して TEXT_SINKS へ登録する',
    ).toEqual([]);
    expect(
      Object.keys(TEXT_SINKS).filter((k) => !found.has(k)).sort(),
      'TEXT_SINKS の登録がもう存在しない',
    ).toEqual([]);
  });
});
