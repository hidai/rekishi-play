<script lang="ts">
  import { useStores } from '../../stores';
  import CardsPane from './CardsPane.svelte';
  import ConstellationPane from './ConstellationPane.svelte';
  import RelationsPane from './RelationsPane.svelte';
  import TimelinePane from './TimelinePane.svelte';
  import CampaignMap from './CampaignMap.svelte';
  import CluesPane from './CluesPane.svelte';
  import CreedsPane from './CreedsPane.svelte';
  import SparksPane from './SparksPane.svelte';
  import BranchesPane from './BranchesPane.svelte';
  import HiddenPane from './HiddenPane.svelte';
  import QuizPane from './QuizPane.svelte';
  import { heroName } from '../../hero';
  import { chapterLabel } from '../../trail';
  import type { NotebookPane as Pane } from '../../session.svelte';

  const { work, session } = useStores();

  // Mirrors the topbar breadcrumb: up from the 手帳 is wherever it was opened from.
  const backLabel = $derived(
    session.notebookFrom ? chapterLabel(work, session.notebookFrom.ch) : '年代記',
  );

  const hasCreeds = $derived(work.story.chapters.some((c) => Object.values(c.scenes).some((s) => !!s.creed)));
  const hasSparks = $derived(work.story.chapters.some((c) => Object.values(c.scenes).some((s) => !!s.spark)));
  const hasBranches = $derived(work.story.chapters.some((c) => Object.values(c.scenes).some((s) => !!s.choices?.length)));
  const hasCampaignMap = $derived(
    !!work.map.mapPoints.length ||
      !!work.map.campaignRoutes.length ||
      !!Object.keys(work.map.territory).length,
  );
  // Protagonist display name via the canonical engine helper (see engine/hero.ts).
  const heroShort = $derived(heroName(work));
  const TABS: { pane: Pane; label: string }[] = $derived([
    { pane: 'cards', label: 'カード図鑑' },
    ...(work.relations ? [{ pane: 'relations' as Pane, label: '相関図' }] : []),
    // ★R つながり図鑑: only for works that authored a graph (davinci §5). Without one the
    // board is an empty field — the same gating as 進軍の地図 below.
    ...(work.graph ? [{ pane: 'graph' as Pane, label: 'つながり図鑑' }] : []),
    { pane: 'timeline', label: '年表' },
    // 進軍の地図: only for works with actual campaign content (marks / routes / territory). Without
    // it the map is a blank silhouette (e.g. katsu, whose story lives in the scene maps, not here).
    ...(hasCampaignMap ? [{ pane: 'map' as Pane, label: '進軍の地図' }] : []),
    { pane: 'quiz', label: 'クイズ' },
    ...(hasCreeds ? [{ pane: 'creeds' as Pane, label: heroShort + 'のことば' }] : []),
    { pane: 'clues', label: '手がかり' },
    ...(hasSparks ? [{ pane: 'sparks' as Pane, label: 'えっ！？図鑑' }] : []),
    ...(hasBranches ? [{ pane: 'branches' as Pane, label: '分かれ道' }] : []),
    { pane: 'hidden', label: '？？？' },
  ]);
</script>

<section class="screen active" id="notebook">
  <div class="wrap">
    <div class="backbar" style="padding-top:16px">
      <button class="linklike" onclick={() => session.leaveNotebook()}>← {backLabel}へ もどる</button>
    </div>
    <div class="screen-head" style="padding-top:8px">
      <h2 class="section-title">{work.strings.notebookName}</h2>
      <p class="section-lead">{work.strings.notebookLead}</p>
    </div>
    <div class="tabs" id="nb-tabs">
      {#each TABS as t (t.pane)}
        <button
          class="tab"
          class:active={session.notebookPane === t.pane}
          onclick={() => (session.notebookPane = t.pane)}>{t.label}</button>
      {/each}
    </div>

    <!-- 開いているタブのペインだけをマウント（地図タブ離脱で再生が止まる）。 -->
    {#if session.notebookPane === 'cards'}
      <CardsPane />
    {:else if session.notebookPane === 'relations'}
      <RelationsPane />
    {:else if session.notebookPane === 'graph'}
      <ConstellationPane />
    {:else if session.notebookPane === 'timeline'}
      <TimelinePane />
    {:else if session.notebookPane === 'map'}
      <CampaignMap />
    {:else if session.notebookPane === 'quiz'}
      <QuizPane />
    {:else if session.notebookPane === 'creeds'}
      <CreedsPane />
    {:else if session.notebookPane === 'clues'}
      <CluesPane />
    {:else if session.notebookPane === 'sparks'}
      <SparksPane />
    {:else if session.notebookPane === 'branches'}
      <BranchesPane />
    {:else if session.notebookPane === 'hidden'}
      <HiddenPane />
    {/if}
  </div>
</section>
