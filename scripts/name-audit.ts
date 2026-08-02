// 主人公の名の棚卸し（前の名と結ばれずに初出する名を、面ごとに抜粋つきで列挙）。
// ゲートは tests/name-continuity.test.ts。規則は docs/WRITING.md 13、型の由来は
// docs/design/engagement.md §14 型4。
//   npx vite-node scripts/name-audit.ts [作品slug]
import { RENAMED_PEOPLE, auditWork } from './lib/name-audit';
import { ALL_WORKS, resolveWork } from './lib/works';

const slug = process.argv[2];
for (const w of slug ? [resolveWork(slug)] : ALL_WORKS) {
  const names = (RENAMED_PEOPLE[w.id] ?? []).flat();
  const breaks = auditWork(w);
  console.log(`== ${w.id}: 名の鎖が切れた面 ${breaks.length}件（見る名: ${names.join('・') || 'なし'}）`);
  for (const b of breaks)
    console.log(
      `  ${b.allowed ? '[許可]' : '      '} ${b.surface.padEnd(12)} 「${b.name}」  …${b.excerpt}…\n            ↳ その面までに 読者が 持っている名: ${b.bound.join('・') || '（なし）'}${b.allowed ? `\n            ↳ ${b.allowed}` : ''}`,
    );
}
