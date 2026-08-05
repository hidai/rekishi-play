// 人物への評価語（レッテル）の棚卸し（帰属を持たない評価語を、面ごとに抜粋つきで列挙）。
// ゲートは tests/epithet-attribution.test.ts。規則は docs/WRITING.md 4、型の由来は
// docs/design/engagement.md §20-5。
//   npx vite-node scripts/epithet-audit.ts [作品slug]
import { auditWork } from './lib/epithet-audit';
import { ALL_WORKS, resolveWork } from './lib/works';

const slug = process.argv[2];
for (const w of slug ? [resolveWork(slug)] : ALL_WORKS) {
  const hits = auditWork(w);
  const open = hits.filter((h) => !h.allowed);
  console.log(`== ${w.id}: 帰属の無い評価語 ${open.length}件（審査ずみ ${hits.length - open.length}件）`);
  for (const h of hits)
    console.log(
      `  ${h.allowed ? '[許可]' : h.strict ? '[ラベル]' : '        '} ${h.surface.padEnd(16)} 「${h.term}」  …${h.excerpt}…${h.allowed ? `\n            ↳ ${h.allowed}` : ''}`,
    );
}
