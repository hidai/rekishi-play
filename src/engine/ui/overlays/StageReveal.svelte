<script lang="ts">
  import { useStores } from '../../stores';
  import { faceArt } from '../../art/face';
  import { stageReveal } from '../../stagereveal.svelte';

  const { work } = useStores();
</script>

<!-- ★G 人生ステージの見せ場。地図の小さな加齢に頼らず、変わり目を大きく1枚見せる。 -->
<!-- ★N tone:'crisis' は急報（本能寺 等）の緊迫した変種として同じ器を使い回す。 -->
<div
  class="stage-overlay"
  class:show={!!stageReveal.current}
  class:crisis={stageReveal.current?.tone === 'crisis'}
  role="button"
  tabindex="0"
  aria-label="つづける"
  onclick={() => stageReveal.dismiss()}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && stageReveal.dismiss()}
>
  {#if stageReveal.current}
    {@const m = stageReveal.current}
    <div class="stage-card">
      {#if m.faceKey}<div class="stage-face">{@html faceArt(m.faceKey, work.faces)}</div>{/if}
      <div class="stage-title">{@html m.title}</div>
      <p class="stage-caption">{@html m.caption}</p>
      <button class="btn btn-primary stage-btn" onclick={(e) => { e.stopPropagation(); stageReveal.dismiss(); }}>すすむ →</button>
    </div>
  {/if}
</div>
