// Dump reader-facing chapter text in play order, for eval personas (/eval-work).
// Ruby renders as 漢字《かな》; design comments in source never reach this output.
//   Usage: npx vite-node scripts/extract-story.ts [work-slug] [ch,ch,...]
import { resolveWork } from './lib/works';

const slug = process.argv[2] ?? 'ieyasu';
const chFilter = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const work = resolveWork(slug);

function txt(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<ruby>([^<]*)<rt>([^<]*)<\/rt><\/ruby>/g, '$1《$2》')
    .replace(/<p[^>]*class="speak"[^>]*>/g, '\n〔声〕')
    .replace(/<p[^>]*>/g, '\n')
    .replace(/<br\s*\/?\s*>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

for (const ch of work.story.chapters) {
  if (chFilter && !chFilter.includes(ch.id)) continue;
  console.log(`\n━━━ 第${ch.num}章「${txt(ch.title)}」（${txt(ch.years)}） ━━━`);
  console.log(`リード: ${txt(ch.lead)}`);
  // walk scenes in play order from ch.start
  let id: string | undefined = ch.start;
  const seen = new Set<string>();
  while (id && !seen.has(id)) {
    seen.add(id);
    const s: any = ch.scenes[id];
    if (!s) break;
    console.log(`\n── シーン ${id}〔場所: ${txt(s.place)}〕`);
    if (s.monologue) console.log(`（きみの内心）${txt(s.monologue)}`);
    console.log(txt(s.text));
    if (s.q) console.log(`\n【選択】${txt(s.q)}`);
    for (const c of s.choices ?? []) {
      console.log(` ▶ ${txt(c.label)}`);
      if (c.hist) console.log(`   〔${txt(c.hist.verdict)}${c.hist.seal ? ' ' + c.hist.seal : ''}〕${txt(c.hist.match)}\n   ${txt(c.hist.body)}`);
    }
    if (s.spark) console.log(`\n【え！？】${txt(s.spark)}`);
    if (s.deep) console.log(`\n【もっと深く】Q: ${txt(s.deep.q)}\n${txt(s.deep.body)}\n${txt(s.deep.cite ?? '')}${s.deep.confidence ? `〔たしかさマーク: ${s.deep.confidence}〕` : ''}`);
    if (s.closeup) console.log(`\n【絵: 対面の場】${(s.closeup.cast ?? []).map((c: any) => c.name).join(' × ')}`);
    if (s.reveal) console.log(`\n【絵: reveal】${txt(s.reveal.title)}: ${txt(s.reveal.caption)}`);
    if (s.creed) console.log(`\n【${work.shortNames?.[work.protagonistId] ?? work.protagonistId}のことば】${txt(s.creed.line)}\n${txt(s.creed.act)}`);
    id = s.next ?? (s.choices?.[0]?.to);
  }
}
