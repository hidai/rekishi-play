// Report: for each work, how many cards/clues are defined vs grantable on a REACHABLE path, plus any
// UNGRANTED (defined but no path grants) / DANGLING (grant → nonexistent id) / ORPHAN (scene no path
// leads to). Non-failing (the gate lives in tests/card-reachability.test.ts) — run this to see which
// cards a work-in-progress still needs to wire to a grant path.
//   npx vite-node scripts/card-reachability.ts
import { WORKS } from '../src/works/index';
import {
  grantedCardIds,
  grantedClueIds,
  ungrantedCards,
  ungrantedClues,
  danglingGrants,
  danglingClueGrants,
  orphanScenes,
} from './lib/card-reachability';

for (const work of WORKS) {
  console.log(`\n=== ${work.id} (${work.strings.titleMain}) ===`);
  console.log(`  cards: ${Object.keys(work.cards).length} defined, ${grantedCardIds(work).size} grantable`);
  console.log(`  UNGRANTED cards: ${ungrantedCards(work).join(', ') || '(none)'}`);
  console.log(`  clues: ${Object.keys(work.clues).length} defined, ${grantedClueIds(work).size} grantable`);
  console.log(`  UNGRANTED clues: ${ungrantedClues(work).join(', ') || '(none)'}`);
  console.log(`  ORPHAN scenes (no path leads there): ${orphanScenes(work).join(', ') || '(none)'}`);
  const dangling = [...danglingGrants(work), ...danglingClueGrants(work)];
  if (dangling.length) console.log(`  DANGLING GRANTS: ${dangling.join(', ')}`);
}
