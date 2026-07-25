// Report (not a gate): which scenes' main visual is still the bare fallback map.
// Playtest note 2026-07-13 root cause (B): unwritten visuals were invisible to every
// check because "nothing is broken". This report makes them visible each eval cycle
// without failing — a work being authored (e.g. katsu) may legitimately have scenes
// whose visuals aren't written yet. Completed works are additionally hard-asserted
// by tests/visual-coverage.test.ts.
// usage: npx vite-node scripts/visual-coverage.ts [work-slug]
// ALL_WORKS, not WORKS: an unregistered skeleton is exactly when this report is worth reading —
// it is authoring that fills the visuals in, and authoring happens before registration.
import { ALL_WORKS, resolveWork } from './lib/works';
import { summarize } from './lib/visual-coverage';

const slug = process.argv[2];
const works = slug ? [resolveWork(slug)] : ALL_WORKS;

for (const work of works) {
  const s = summarize(work);
  const authored = s.total - s.unwritten.length;
  console.log(
    `${s.workId}: ${authored}/${s.total} シーンに執筆済み主ビジュアル` +
      `（closeup ${s.closeup}・figure ${s.figure}・study ${s.study}・地図 ${s.map}）`,
  );
  if (s.unwritten.length === 0) {
    console.log('  未執筆なし');
    continue;
  }
  console.log(`  ★未執筆（フォールバック地図のまま）${s.unwritten.length} シーン:`);
  for (const r of s.unwritten) {
    const why = r.kind === 'map-fallback' ? 'SCENE_MAPS なし' : `マーカー${r.markers}・note なし`;
    console.log(`    ch${r.ch} ${r.sceneId} — ${why}`);
  }
}
