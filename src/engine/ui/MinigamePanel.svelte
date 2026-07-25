<script lang="ts">
  import type { Minigame } from '../types';
  import SortPanel from './SortPanel.svelte';
  import MarchPanel from './MarchPanel.svelte';

  // ★M ミニゲームの dispatcher。型で分岐し、それぞれの実装へ委譲する。
  // どちらも {#key session.scene} の中に置かれるため、シーン再入場で初期状態に戻る。
  let { game, onDone }: { game: Minigame; onDone: () => void } = $props();
</script>

{#if game.type === 'sort'}
  <SortPanel {game} {onDone} />
{:else if game.type === 'march'}
  <MarchPanel {game} {onDone} />
{/if}
