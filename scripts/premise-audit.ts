// 前提知識の棚卸し（面ごとの既知前提マーカーを抜粋つきで列挙＋反転型 spark の worklist）。
// ゲートは tests/known-premise.test.ts。設計は docs/design/known-premise.md。
//   npx vite-node scripts/premise-audit.ts [作品slug]
import { auditWork, reversalSparks, sparkCount } from './lib/premise-audit';
import { ALL_WORKS, resolveWork } from './lib/works';

const slug = process.argv[2];
for (const w of slug ? [resolveWork(slug)] : ALL_WORKS) {
  const hits = auditWork(w);
  const open = hits.filter((h) => !h.allowed);
  const sparks = reversalSparks(w);
  console.log(`== ${w.id}: 既知前提マーカー ${open.length}件（審査ずみ 許可 ${hits.length - open.length}件）/ 反転型 spark ${sparks.length}件（spark 総数 ${sparkCount(w)}）`);
  for (const h of hits)
    console.log(`  ${h.allowed ? '[許可]' : '      '} ${h.surface}  「${h.marker}」  …${h.excerpt}…${h.allowed ? `\n            ↳ ${h.allowed}` : ''}`);
  for (const s of sparks) console.log(`  [A型?] ${s.scene}  ${s.excerpt.slice(0, 56)}…`);
}
