<script lang="ts">
  import { useStores } from '../../stores';
  import { seal } from '../../art/icons';
  import { SOURCE_GRADES } from '../../source';
  import { sfx } from '../../sfx.svelte';

  const { hist } = useStores();
</script>

<!-- 史実オーバーレイ。背景では閉じない（旧: 誤操作防止）。 -->
<div class="hist-overlay" class:show={!!hist.current}>
  <div class="hist-panel">
    {#if hist.current}
      {@const h = hist.current.hist}
      <div class="hist-seal">{@html seal(h.seal || (h.moshimo ? 'もし' : '史実'))}</div>
      <div class="hist-scroll">
        <div class="hist-verdict">{h.moshimo ? '◇ もしもルート' : '● ' + (h.verdict || '史実では')}</div>
        <div class="hist-match {h.moshimo ? 'moshimo' : ''}">{@html h.match || ''}</div>
        <div class="hist-body">{@html h.body || ''}</div>
        {#if h.source}
          {@const g = SOURCE_GRADES[h.source.grade]}
          <div class="hist-source">
            <div class="hist-source-head">
              <span class="hist-source-icon" aria-hidden="true">📜</span>
              <ruby>出<rt>で</rt></ruby>どころ：{@html h.source.name}
              <span class="hist-source-grade grade-{h.source.grade}">〔{g.mark} {@html g.label}〕</span>
            </div>
            {#if h.source.note}<p class="hist-source-note">{@html h.source.note}</p>{/if}
          </div>
        {/if}
        {#if hist.current.gains.length}
          <div class="hist-reward">{@html hist.current.gains.join('')}</div>
        {/if}
        <div class="hist-actions">
          <button class="btn btn-primary" onclick={() => { sfx.page(); hist.settle(); }}>次へ →</button>
        </div>
      </div>
    {/if}
  </div>
</div>
