// ふりがなの棚卸し（面ごとの未ルビ初出を抜粋つきで列挙）。ゲートは tests/ruby-furigana.test.ts。
//   npx vite-node scripts/ruby-audit.ts [作品slug]
import { auditWork, workSurfaces } from './lib/ruby-audit';
import { ALL_WORKS, resolveWork } from './lib/works';

const slug = process.argv[2];
for (const w of slug ? [resolveWork(slug)] : ALL_WORKS) {
  const misses = auditWork(w);
  console.log(`== ${w.id}: ${misses.length} 件 / ${workSurfaces(w).length} 面`);
  for (const m of misses) console.log(`  ${m.surface}  「${m.char}」  …${m.excerpt}…`);
}
