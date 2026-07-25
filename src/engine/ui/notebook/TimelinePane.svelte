<script lang="ts">
  import { useStores } from '../../stores';
  import EraBand from '../EraBand.svelte';
  import { eraBand } from '../../chrono';

  const { work, workCards, save } = useStores();
  // A single-work build has no one to compare with — then the band, and its rule, are gone.
  const hasBand = $derived(!!eraBand(workCards));
  // クリア済み最大章。1つ先まで薄く見せる（旧 renderTimeline）。
  const maxCh = $derived(
    save.active
      ? Math.max(
          0,
          ...Object.keys(save.active.progress)
            .filter((k) => save.active!.progress[k] === 'done')
            .map(Number),
        )
      : 0,
  );
</script>

<div class="tabpane active" id="pane-timeline">
  <!-- この作品の年表の前に、ほかの作品の主人公と同じ西暦軸で並べる（いまの作品を強調）。 -->
  {#if hasBand}
    <div class="era-here">
      <h3 class="era-here-title">この 人は、いつの 人？</h3>
      <EraBand cards={workCards} activeId={work.id} />
    </div>
  {/if}
  <div class="timeline">
    {#each work.timeline as t, i (i)}
      <div class="tl-item {t.key ? 'key' : ''} {t.death ? 'death' : ''} {t.ch > maxCh + 1 ? 'locked' : ''}">
        <div class="tl-year">{@html t.y}</div>
        <div class="tl-title">{@html t.t}</div>
        <div class="tl-desc">{@html t.d}</div>
      </div>
    {/each}
  </div>
</div>

<style>
  .era-here {
    margin: 4px 0 22px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--line);
  }
  .era-here-title {
    font-family: var(--serif);
    font-size: 15px;
    letter-spacing: 0.06em;
    margin: 0 0 8px;
    color: var(--ink);
  }
</style>
