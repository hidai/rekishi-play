<script lang="ts">
  import { useStores } from '../../stores';

  const { work, save } = useStores();
  const total = work.totalChapters;
  const totalCards = Object.keys(work.cards).length;

  const finalDone = $derived(!!save.active && save.active.progress[total] === 'done');
  const allCards = $derived(!!save.active && save.active.cards.length >= totalCards);
</script>

<div class="tabpane active" id="pane-hidden">
  {#if !finalDone}
    <div class="hidden-locked">
      <div class="lk">🔒</div>
      <p class="section-lead" style="margin-top:14px">{work.hidden.lockedText}</p>
    </div>
  {:else}
    <div class="hidden-scroll">
      <div class="clear-badge" style="color:var(--gold-deep)">{work.hidden.badge}</div>
      <div class="scene-text" style="max-width:none;margin-top:12px">{@html work.hidden.body}</div>
      {#if allCards}
        <p class="muted center" style="margin-top:16px">{work.hidden.completeText}</p>
      {:else}
        <p class="muted center" style="margin-top:16px">{work.hidden.incompleteText}</p>
      {/if}
    </div>
  {/if}
</div>
