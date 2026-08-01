// 制度語の棚卸し（主線で言い換え無しに初出する制度語を、面ごとに抜粋つきで列挙）。
// ゲートは tests/institution-gloss.test.ts。規則は docs/WRITING.md 13、型の由来は
// docs/design/engagement.md §14 型3。
//   npx vite-node scripts/institution-audit.ts [作品slug]
import { auditWork } from './lib/institution-audit';
import { ALL_WORKS, resolveWork } from './lib/works';

const slug = process.argv[2];
for (const w of slug ? [resolveWork(slug)] : ALL_WORKS) {
  const hits = auditWork(w);
  const open = hits.filter((h) => !h.allowed);
  console.log(
    `== ${w.id}: 言い換え無しの制度語 ${open.length}件（審査ずみ ${hits.length - open.length}件）`,
  );
  for (const h of hits)
    console.log(
      `  ${h.allowed ? '[許可]' : '      '} ${h.surface.padEnd(10)} 「${h.term}」  …${h.excerpt}…${h.allowed ? `\n            ↳ ${h.allowed}` : ''}`,
    );
}
