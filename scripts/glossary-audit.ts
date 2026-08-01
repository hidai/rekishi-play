// 「読めるが、意味が分からない語」の棚卸し（診断レポート。ゲートではない）。
//
// ふりがなの帳簿は「その字が**読めるか**」だけを見ている。読めても意味が分からない語
// （攘夷・幕臣・一橋・御用金…）は、どのゲートも見ていない——2026-08-01 の実プレイで
// 『渋沢』第二章が「攘夷って何？」「慶喜は徳川なの？」で止まった（engagement.md §12）。
//
// 判定: **本文でルビを振った語が、その画面までに（カード／もっと深くで）説明されているか。**
//
// ⚠️ **これはゲートにできない**（作ってみて分かった）。ルビが付くのは「**漢字が難しい**」語で、
// 「**概念が難しい**」語ではないので、出力は地名（飛鳥山・兜町）と日常語（椅子・値段）に
// 埋もれる——実測 73語のうち、実際に読者が止まった語（攘夷・一橋）は上位に出てこない。
// **機械はここまで。「筋が追えるか」を見るのは読者役の仕事**（engagement.md §12）。
// この棚卸しは、その読者役に渡す **候補リスト** として使う（人が選り分ける前提）。
//
// 使い方: npx vite-node scripts/glossary-audit.ts [作品slug]
import { WORKS } from '../src/works/index';
import { resolveWork } from './lib/works';
import type { Work } from '../src/engine/types';

/** <ruby>語<rt>よみ</rt></ruby> の「語」を集める。 */
function rubyTerms(html: string): string[] {
  return [...String(html || '').matchAll(/<ruby>([^<]+)<rt>/g)].map((m) => m[1]);
}
const plain = (s: unknown) =>
  String(s ?? '').replace(/<rt>.*?<\/rt>/g, '').replace(/<[^>]+>/g, '');

/** 人名・地名は「語の意味」ではなく「だれ・どこ」なので対象外（顔と地図が受け持つ）。 */
function namesOf(work: Work): Set<string> {
  const out = new Set<string>();
  for (const c of Object.values(work.cards)) {
    if (c.type !== 'person') continue;
    for (const t of rubyTerms(c.text)) out.add(t);
    out.add(c.name);
    // 「渋沢栄一」→「渋沢」「栄一」も名前として扱う
    for (const part of c.name.split(/[\s・]/)) if (part) out.add(part);
  }
  for (const v of Object.values(work.shortNames ?? {})) out.add(v);
  for (const m of Object.values(work.map?.sceneMaps ?? {}))
    for (const mk of m.markers ?? []) if (mk.label) out.add(plain(mk.label));
  return out;
}

/**
 * 読む順（章 → シーン定義順）に並べた面。説明が**あと**から来るのは説明にならない
 * （初出で意味が分からなければ、読者はそこで置いていかれる）ので、順序で判定する。
 */
function readingOrder(work: Work): Array<{ at: string; i: number; scene: Record<string, any> }> {
  const out: Array<{ at: string; i: number; scene: Record<string, any> }> = [];
  let i = 0;
  for (const ch of work.story.chapters)
    for (const [sid, sc] of Object.entries(ch.scenes))
      out.push({ at: `${ch.id}/${sid}`, i: i++, scene: sc as Record<string, any> });
  return out;
}

function audit(work: Work) {
  const names = namesOf(work);
  const order = readingOrder(work);

  // 語 → その語を説明する面が現れる最も早い位置（カードは渡された場面／deep はその場面）。
  const introAt = new Map<string, number>();
  const note = (term: string, i: number) => {
    const prev = introAt.get(term);
    if (prev == null || i < prev) introAt.set(term, i);
  };
  for (const { i, scene } of order) {
    const oe = scene.onEnter;
    const cards = ([] as string[]).concat(oe?.card ?? [], oe?.cards ?? []);
    for (const cid of cards) {
      const c = work.cards[cid];
      if (!c) continue;
      for (const t of [c.name, ...rubyTerms(c.text)]) note(t, i);
      for (const t of rubyTerms(plain(c.text))) note(t, i);
      // カード本文に素の語で書かれている場合も説明とみなす
      const body = plain(c.text);
      for (const t of rubyTerms(String(c.text))) if (body.includes(t)) note(t, i);
    }
    const d = scene.deep;
    if (d) {
      const txt = plain(d.q) + plain(d.body) + plain(d.cite);
      for (const t of new Set([...rubyTerms(String(d.q ?? '')), ...rubyTerms(String(d.body ?? ''))])) note(t, i);
      for (const t of txt.match(/[一-龥]{2,}/g) ?? []) note(t, i);
    }
  }

  const hits = new Map<string, { first: string; at: string[]; late: boolean }>();
  for (const { at, i, scene } of order) {
    const body = [scene.text, scene.monologue, scene.place].map((x) => String(x ?? '')).join('');
    for (const term of rubyTerms(body)) {
      if (term.length < 2) continue; // 一字の難読は「読み」の問題＝ふりがなの帳簿の担当
      if (names.has(term)) continue;
      const intro = introAt.get(term);
      if (intro != null && intro <= i) continue; // その場面までに説明されている
      const row = hits.get(term) ?? { first: at, at: [], late: intro != null };
      if (!row.at.includes(at)) row.at.push(at);
      hits.set(term, row);
    }
  }
  return [...hits.entries()].sort((a, b) => b[1].at.length - a[1].at.length);
}

const only = process.argv[2];
const works = only ? [resolveWork(only)] : WORKS;

console.log('■ 本文でルビを振った語のうち、その画面までに説明が無いもの（候補リスト・要選り分け）\n');
let total = 0;
for (const w of works) {
  const rows = audit(w);
  total += rows.length;
  console.log(`【${w.id}】 ${rows.length} 語`);
  for (const [term, r] of rows.slice(0, 14)) {
    console.log(`   ${term.padEnd(6)} ${String(r.at.length).padStart(2)}か所 初出 ${r.first.padEnd(7)}${r.late ? '（説明はもっと後の面）' : '（どこにも説明が無い）'}`);
  }
  if (rows.length > 12) console.log(`   …ほか ${rows.length - 12} 語`);
  console.log('');
}
console.log(`合計 ${total} 語`);
