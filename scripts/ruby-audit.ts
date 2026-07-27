// ★ふりがな（<ruby>）の機械検査。tests/ruby-furigana.test.ts（ゲート）と共用し、CLI でも使う:
//   npx vite-node scripts/ruby-audit.ts [作品slug]
//
// 検査する規則は1つだけ——**「まだ習っていない漢字は、面ごとに初出でルビを振る」**。
//   ・まだ習っていない = 学年別漢字配当表（scripts/lib/kanji-grades.ts）の外＝中学配当＋表外字。
//   ・面（surface）= 読者が一度に目にする1画面。deep・hist・creed・カード・手がかりは
//     それぞれ別の面（「その枝を選んだ人にしか見えない面」が漏れの温床だった）。
//   ・初出主義 = 同じ面で一度ルビを振れば、その面の2回目以降は裸でよい。全7作の実測で
//     これが家の様式（「一度振った字は毎回振る」型は成立しない）。
//
// なぜ機械にするか: 章三〜章六で G8（ルビ漏れ）が連続して評価の最大の指摘だった＝人手では
// 毎章漏れる。面ごとに裸の漢字を列挙する使い捨てスクリプトが有効だったので、それを常設した。
//
// 対象外（silent cap にしないため明記する）: SVG `<text>` で描く面——地図ラベル・note・相関図の
// rel・席の図・習作ページ——は `<ruby>` を持てない契約なので検査しない（その面の守りは
// tests/ruby-render.test.ts と tests/svg-text-fields.test.ts）。UI 文字列（strings・meters）も
// エンジンの面で作品の本文ではない。
import type { Work, Scene } from '../src/engine/types';
import { isKanji, kanjiGrade } from './lib/kanji-grades';

/** 面: 読者が一度に見る1画面ぶんの HTML 断片（読む順）。 */
export interface Surface {
  /** 面の識別子（例 'ch3/3-b#deep'）。 */
  id: string;
  /** その面の HTML を読む順に並べたもの。 */
  parts: string[];
}

export interface RubyMiss {
  surface: string;
  /** ルビ無しで初出した漢字。 */
  char: string;
  /** その字を含む前後の抜粋（作者が現物を探せるように）。 */
  excerpt: string;
}

const ruby = (s?: string): string => (s ? `<ruby>${s}</ruby>` : '');

/**
 * Split a surface's HTML into characters tagged by whether furigana covers them.
 * `<rt>` readings are dropped; every other tag (`<b>`, `<face>`, …) is transparent.
 */
function readChars(html: string): { ch: string; covered: boolean }[] {
  const out: { ch: string; covered: boolean }[] = [];
  let covered = false;
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end < 0) break;
      const tag = html.slice(i + 1, end).toLowerCase();
      if (tag === 'ruby') covered = true;
      else if (tag === '/ruby') covered = false;
      else if (tag === 'rt') {
        const close = html.indexOf('</rt>', end);
        i = close < 0 ? html.length : close + 5;
        continue;
      }
      i = end + 1;
      continue;
    }
    out.push({ ch: html[i], covered });
    i++;
  }
  return out;
}

/** Characters of a surface, in reading order, with an excerpt for each position. */
export function auditSurface(surface: Surface): RubyMiss[] {
  const chars = surface.parts.flatMap((p) => readChars(p));
  const misses: RubyMiss[] = [];
  const seen = new Set<string>();
  chars.forEach(({ ch, covered }, idx) => {
    if (!isKanji(ch) || seen.has(ch)) return;
    seen.add(ch);
    if (covered || kanjiGrade(ch) > 0) return;
    const around = chars
      .slice(Math.max(0, idx - 8), idx + 9)
      .map((c) => c.ch)
      .join('');
    misses.push({ surface: surface.id, char: ch, excerpt: around });
  });
  return misses;
}

function sceneSurfaces(chId: number, sid: string, sc: Scene): Surface[] {
  const at = `ch${chId}/${sid}`;
  const out: Surface[] = [];
  // The scene screen itself: place → body → 内語 → え！？ → 問い → 選択肢.
  const main = [sc.place, sc.text, sc.monologue, sc.spark, sc.q, ...(sc.choices ?? []).map((c) => c.label)];
  if (sc.minigame?.type === 'sort')
    main.push(sc.minigame.title, sc.minigame.lead, ...sc.minigame.items, sc.minigame.outro);
  out.push({ id: at, parts: main.filter(Boolean) as string[] });
  // Panels: each is its own screen, reached only from this scene.
  if (sc.deep) out.push({ id: `${at}#deep`, parts: [sc.deep.q, sc.deep.body, sc.deep.cite ?? ''] });
  if (sc.creed) out.push({ id: `${at}#creed`, parts: [sc.creed.line, sc.creed.act] });
  if (sc.reveal) out.push({ id: `${at}#reveal`, parts: [sc.reveal.title, sc.reveal.caption] });
  if (sc.observe)
    out.push({
      id: `${at}#observe`,
      parts: [sc.observe.prompt, ...sc.observe.hotspots.map((h) => h.caption)],
    });
  (sc.choices ?? []).forEach((c, i) => {
    if (!c.hist) return;
    const h = c.hist;
    out.push({
      id: `${at}#hist${i}`,
      // The verdict/match line sits above the body; the source line under it.
      parts: [h.verdict, h.match, h.body, h.source?.name ?? '', h.source?.note ?? ''],
    });
  });
  return out;
}

/** Every reader-facing prose surface of a work, in the order a reader meets them. */
export function workSurfaces(work: Work): Surface[] {
  const out: Surface[] = [];
  for (const ch of work.story.chapters) {
    // Home screen chapter card, then the chapter's own lead.
    out.push({ id: `ch${ch.id}`, parts: [ch.title, ch.lead] });
    if (ch.teaser) out.push({ id: `ch${ch.id}#teaser`, parts: [ch.teaser] });
    for (const [sid, sc] of Object.entries(ch.scenes)) out.push(...sceneSurfaces(ch.id, sid, sc));
  }
  for (const [id, c] of Object.entries(work.cards)) {
    // The card's own 見出し carries its reading in `read`, which is furigana by another name.
    out.push({
      id: `card:${id}`,
      parts: [c.read ? ruby(c.name) : c.name, c.text, c.photo?.credit ?? ''],
    });
  }
  for (const [id, c] of Object.entries(work.clues)) out.push({ id: `clue:${id}`, parts: [c.text] });
  // The 年代記 pane is one scrolling screen, so one surface for the whole list.
  out.push({ id: 'timeline', parts: work.timeline.flatMap((e) => [e.t, e.d]) });
  for (const n of work.graph?.nodes ?? []) out.push({ id: `star:${n.id}`, parts: [n.caption] });
  out.push({ id: 'hidden', parts: [work.hidden.lockedText, work.hidden.body, work.hidden.completeText] });
  return out;
}

export function auditWork(work: Work): RubyMiss[] {
  return workSurfaces(work).flatMap(auditSurface);
}

/**
 * Where a writer works: one bucket per chapter, plus one per collection. The gate
 * (tests/ruby-furigana.test.ts) ratchets on these — a bucket with no baseline entry
 * must be clean, so a NEW chapter or a NEW work starts at zero.
 */
export function bucketOf(surfaceId: string): string {
  return surfaceId.startsWith('ch')
    ? surfaceId.split('/')[0].split('#')[0]
    : surfaceId.split(':')[0];
}

export function auditBuckets(work: Work): Record<string, number> {
  const out: Record<string, number> = {};
  for (const m of auditWork(work)) out[bucketOf(m.surface)] = (out[bucketOf(m.surface)] ?? 0) + 1;
  return out;
}

/**
 * Unclosed `<ruby>` per bucket. A missing `</ruby>` leaves coverage on for the rest of the
 * field, so every later kanji looks furigana'd and its miss is never reported — the audit
 * under-counts exactly where the tag is broken (hidenaga hid 75 misses this way).
 */
export function unclosedRuby(work: Work): Record<string, number> {
  const out: Record<string, number> = {};
  for (const s of workSurfaces(work))
    for (const p of s.parts) {
      const open = (p.match(/<ruby>/g) ?? []).length - (p.match(/<\/ruby>/g) ?? []).length;
      if (open > 0) out[bucketOf(s.id)] = (out[bucketOf(s.id)] ?? 0) + open;
    }
  return out;
}

// CLI entry (vite-node consumes the script path; under vitest argv[1] is the vitest bin).
if (process.argv[1]?.includes('vite-node')) {
  const { ALL_WORKS, resolveWork } = await import('./lib/works');
  const slug = process.argv[2];
  const targets = slug ? [resolveWork(slug)] : ALL_WORKS;
  for (const w of targets) {
    const misses = auditWork(w);
    console.log(`== ${w.id}: ${misses.length} 件 / ${workSurfaces(w).length} 面`);
    for (const m of misses) console.log(`  ${m.surface}  「${m.char}」  …${m.excerpt}…`);
  }
}
