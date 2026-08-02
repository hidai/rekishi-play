// 体験予算（docs/WRITING.md 予算表）の実測レポート。ゲートは tests/style-budget.test.ts。
//   npx vite-node scripts/content-stats.ts [作品slug]
// ALL_WORKS, not WORKS: measuring the experience budget matters most while a work is still an
// unregistered skeleton being written — that is the drift this report exists to catch.
import { chapterStats, personCardCount } from './lib/content-stats';
import { ALL_WORKS, resolveWork } from './lib/works';

const slug = process.argv[2];
for (const w of slug ? [resolveWork(slug)] : ALL_WORKS) {
  console.log(`== ${w.id} (person cards: ${personCardCount(w)})`);
  console.log('  ch | text | maxScene | glosses | hedges | maxDeep | maxGrants | maxLoad*');
  for (const st of chapterStats(w)) {
    console.log(
      `  ${String(st.chapterId).padStart(2)} | ${String(st.textTotal).padStart(4)} | ${String(st.maxSceneText).padStart(8)} | ${String(st.glosses).padStart(7)} | ${String(st.hedges).padStart(6)} | ${String(st.maxDeepBody).padStart(7)} | ${String(st.maxPersonGrants).padStart(9)} | ${st.maxSceneLoad}`,
    );
  }
  console.log(
    '  * maxLoad = 1シーンを抜けるのに読む最大量（本文＋内語＋spark＋問い＋信条＋選んだ枝の hist）。診断のみ・予算なし',
  );
}
