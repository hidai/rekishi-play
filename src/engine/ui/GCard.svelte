<script lang="ts">
  import { useStores } from '../stores';
  import { faceArt } from '../art/face';
  import { scrollIcon } from '../art/icons';

  let { id, revealed = false }: { id: string; revealed?: boolean } = $props();
  const { work, save, session } = useStores();

  const c = $derived(work.cards[id]);
  const has = $derived(revealed || !!save.active?.cards.includes(id));
  const chLabel = $derived(c.ch === work.totalChapters ? '終' : String(c.ch));
  const icon = $derived(c.type === 'person' ? faceArt(id, work.faces) : scrollIcon());
</script>

{#if !has}
  <div class="gcard locked">
    <div class="gcard-top"><span class="gcard-lockicon">🎴</span></div>
    <div class="gcard-body">
      <div class="gcard-kind">？？？</div>
      <div class="gcard-name">？？？</div>
      <div class="gcard-ch">第{chLabel}章</div>
    </div>
  </div>
{:else}
  <button class="gcard {c.type}" onclick={() => session.openCard(id)}>
    <div class="gcard-top">{@html icon}</div>
    <div class="gcard-body">
      <div class="gcard-kind">{c.type === 'person' ? '人物' : 'ことば'}</div>
      <div class="gcard-name">{c.name}</div>
      <div class="gcard-ch">第{chLabel}章</div>
    </div>
  </button>
{/if}
