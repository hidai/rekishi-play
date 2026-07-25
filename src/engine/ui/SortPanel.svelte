<script lang="ts">
  import type { SortMinigame } from '../types';
  import { sortDisplayOrder, initSort, pickSort, type SortState } from '../minigame';
  import { sfx } from '../sfx.svelte';

  // ★M 段取りミニゲーム（sort型）。{#key session.scene} の中に置かれるので
  // シーン再入場ごとに自動で初期状態から始まる。
  let { game, onDone }: { game: SortMinigame; onDone: () => void } = $props();

  const order = $derived(sortDisplayOrder(game.items.length));
  let st = $state<SortState>(initSort());
  let wrongIdx = $state<number | null>(null);

  function pick(idx: number) {
    if (st.done) return;
    const r = pickSort(st, idx, game.items.length);
    st = r.state;
    if (r.correct) {
      sfx.correct();
      wrongIdx = null;
      if (st.done) {
        setTimeout(() => sfx.card(), 300);
        onDone();
      }
    } else {
      sfx.wrong();
      wrongIdx = idx;
      setTimeout(() => (wrongIdx = null), 450);
    }
  }
</script>

<div class="mg" class:done={st.done}>
  <div class="mg-head"><span aria-hidden="true">🧩</span>{@html game.title}</div>
  {#if game.lead && !st.done}<p class="mg-lead">{@html game.lead}</p>{/if}

  {#if st.placed > 0}
    <ol class="mg-placed">
      {#each game.items.slice(0, st.placed) as it, i (i)}
        <li>{@html it}</li>
      {/each}
    </ol>
  {/if}

  {#if !st.done}
    <div class="mg-q">{st.placed === 0 ? 'さいしょに やるのは どれ？' : 'つぎに やるのは どれ？'}</div>
    <div class="mg-opts">
      {#each order.filter((i) => i >= st.placed) as idx (idx)}
        <button class="mg-opt" class:wrong={wrongIdx === idx} onclick={() => pick(idx)}>{@html game.items[idx]}</button>
      {/each}
    </div>
  {:else}
    <div class="mg-result">{st.miss === 0 ? '🎉 かんぺきな 段取り！' : '✅ 段取り 完成！'}</div>
    {#if game.outro}<p class="mg-outro">{@html game.outro}</p>{/if}
  {/if}
</div>
