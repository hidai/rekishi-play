<script lang="ts">
  import { useStores } from '../../stores';
  import GCard from '../GCard.svelte';

  const { work, save } = useStores();
  const cardIds = Object.keys(work.cards);
  const persons = cardIds.filter((id) => work.cards[id].type === 'person');
  const words = cardIds.filter((id) => work.cards[id].type === 'word');
  const total = cardIds.length;
  const got = $derived(save.active ? save.active.cards.length : 0);
</script>

<div class="tabpane active" id="pane-cards">
  <div class="collect-bar">
    <div class="collect-meter"><i style="width:{Math.round((got / total) * 100)}%"></i></div>
    <span class="collect-count">{got}/{total}</span>
  </div>
  <h4 style="font-family:var(--gothic);font-size:12.5px;letter-spacing:.1em;color:var(--ink-faint);margin:0 0 10px">人物カード</h4>
  <div class="card-grid">
    {#each persons as id (id)}<GCard {id} />{/each}
  </div>
  <h4 style="font-family:var(--gothic);font-size:12.5px;letter-spacing:.1em;color:var(--ink-faint);margin:22px 0 10px">ことばカード</h4>
  <div class="card-grid">
    {#each words as id (id)}<GCard {id} />{/each}
  </div>
</div>
