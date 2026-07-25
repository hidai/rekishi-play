<script lang="ts">
  import { useStores } from '../stores';
  import { meterRows } from '../meters';
  import { meterFx } from '../metersfx.svelte';

  // variant: 'hud'  = シーン上部の常時表示（横並び・コンパクト）
  //          'full' = 終章クリアの「育てた秀長」まとめ（縦・数値つき）
  let { variant = 'hud' }: { variant?: 'hud' | 'full' } = $props();

  const { work, save } = useStores();

  // 満杯とみなす目安値（全選択を一方向に寄せた場合の主要メーター上限に近い）。
  const CAP = 14;
  const rows = $derived(meterRows(work, save.active));
</script>

{#if work.meters}
  <div class="meterbar {variant}">
    <div class="mb-title">{work.meters.title}</div>
    <div class="mb-rows">
      {#each rows as r (r.def.key)}
        <div class="mb-row">
          <span class="mb-ico" aria-hidden="true">{r.def.icon}</span>
          <span class="mb-label">{@html r.def.label}</span>
          <span class="mb-track">
            <span
              class="mb-fill {r.def.key}"
              style="width:{Math.min(100, (r.value / CAP) * 100)}%"
            ></span>
          </span>
          <!-- ★I 伸びた瞬間の「＋N」。track の外（overflow:hidden 回避）で 1.2秒 弾ませる。 -->
          {#each meterFx.forKey(r.def.key) as p (p.id)}
            <span class="mb-pop {p.delta > 0 ? 'up' : 'down'}">{p.delta > 0 ? '＋' : '−'}{Math.abs(p.delta)}</span>
          {/each}
          {#if variant === 'full'}<span class="mb-val">{r.value}</span>{/if}
        </div>
      {/each}
    </div>
  </div>
{/if}
