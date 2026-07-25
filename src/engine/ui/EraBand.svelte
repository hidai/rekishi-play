<script lang="ts">
  // 「時代の ものさし」——登録されている作品の主人公を、1本の西暦軸に並べる。
  // 説明の代わりに間隔で語る装置: 清盛と政子は重なり、そこから秀長まで 300年 以上あく。
  // 位置と目盛りの計算は engine/chrono.ts（純関数）が持ち、ここは描くだけ。
  import type { WorkCard } from '../types';
  import { eraBand, type EraBar } from '../chrono';

  let {
    cards,
    activeId,
    onPick,
  }: { cards: WorkCard[]; activeId?: string; onPick?: (id: string) => void } = $props();

  const band = $derived(eraBand(cards));
</script>

{#if band}
  <div class="era">
    <div class="era-plot">
      {#each band.ticks as t (t)}
        <span class="era-grid" style="left:{((t - band.from) / (band.to - band.from)) * 100}%"
        ></span>
      {/each}
      {#snippet row(b: EraBar)}
        <div class="era-cap" style="text-align:{b.capAlign};padding-{b.capAlign}:{b.capPad}%">
          <span class="era-name">{@html b.label}</span>
          <span class="era-years">{b.years}</span>
        </div>
        <div class="era-track">
          <span
            class="era-bar"
            class:fade-l={b.approxBorn}
            class:fade-r={b.approxDied}
            style="left:{b.leftPct}%;width:{b.widthPct}%"></span>
        </div>
      {/snippet}
      {#each band.bars as b (b.id)}
        {#if onPick}
          <button class="era-row pick" class:active={b.id === activeId} onclick={() => onPick(b.id)}>
            {@render row(b)}
          </button>
        {:else}
          <div class="era-row" class:active={b.id === activeId}>{@render row(b)}</div>
        {/if}
      {/each}
    </div>
    <div class="era-axis">
      {#each band.ticks as t, i (t)}
        <span
          class="era-tick"
          class:first={i === 0}
          class:last={i === band.ticks.length - 1}
          style="left:{((t - band.from) / (band.to - band.from)) * 100}%">{t}</span>
      {/each}
    </div>
    <!-- 凡例の3つは、小5 が実際に読み違えた順（長さの意味 → 端のぼかし → 読み）。 -->
    <p class="era-note">
      よこの ものさしは <ruby>西暦<rt>せいれき</rt></ruby>（年）。おびの 長さは、その 人が 生きた
      年数。ぼやけた <ruby
        >端<rt>はし</rt></ruby
      >は「はっきり わからない」しるし。
    </p>
  </div>
{/if}

<style>
  .era-plot {
    position: relative;
    padding-top: 2px;
  }
  /* 目盛りの縦線は帯の下に敷く（帯は position:relative の行の中で上に重なる）。 */
  .era-grid {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: var(--line);
  }
  /* Bottom padding is the gap to the NEXT name, so it must beat the 2px that ties a
     name to its own bar — otherwise every bar reads as belonging to the row below. */
  .era-row {
    position: relative;
    padding: 2px 0 12px;
    border-radius: var(--r-s);
  }
  /* The pickable variant is a real <button>; strip the chrome so both variants match. */
  .era-row.pick {
    display: block;
    width: 100%;
    background: none;
    border: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  /* Keep the global button:focus-visible ring (app.css) — the tint alone is too faint. */
  .era-row.pick:hover,
  .era-row.pick:focus-visible {
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }
  .era-cap {
    font-size: 12px;
    line-height: 1.5;
    color: var(--ink-soft);
  }
  .era-name {
    font-family: var(--serif);
  }
  .era-years {
    font-size: 11px;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
  }
  .era-track {
    position: relative;
    height: 8px;
    margin-top: 2px;
  }
  .era-bar {
    position: absolute;
    top: 1px;
    height: 6px;
    border-radius: 3px;
    background: var(--ink-faint);
  }
  /* 「〜ごろ」の端はぼかす（細い帯でも消えないよう、ぼかし幅は帯の 40% を上限にする）。 */
  .era-bar.fade-l {
    -webkit-mask-image: linear-gradient(to right, transparent 0, #000 min(16px, 40%));
    mask-image: linear-gradient(to right, transparent 0, #000 min(16px, 40%));
  }
  .era-bar.fade-r {
    -webkit-mask-image: linear-gradient(to left, transparent 0, #000 min(16px, 40%));
    mask-image: linear-gradient(to left, transparent 0, #000 min(16px, 40%));
  }
  .era-bar.fade-l.fade-r {
    -webkit-mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 min(16px, 40%),
      #000 calc(100% - min(16px, 40%)),
      transparent 100%
    );
    mask-image: linear-gradient(
      to right,
      transparent 0,
      #000 min(16px, 40%),
      #000 calc(100% - min(16px, 40%)),
      transparent 100%
    );
  }
  .era-row.active .era-cap {
    color: var(--ink);
    font-weight: 700;
  }
  .era-row.active .era-years {
    color: var(--ink-soft);
  }
  .era-row.active .era-bar {
    background: var(--accent);
    height: 8px;
    top: 0;
    border-radius: 4px;
  }
  .era-axis {
    position: relative;
    height: 16px;
    margin-top: 2px;
    border-top: 1px solid var(--line);
  }
  .era-tick {
    position: absolute;
    top: 2px;
    transform: translateX(-50%);
    font-size: 10px;
    letter-spacing: 0.04em;
    color: var(--ink-faint);
  }
  .era-tick.first {
    transform: none;
  }
  .era-tick.last {
    transform: translateX(-100%);
  }
  .era-note {
    margin: 6px 0 0;
    font-size: 11px;
    color: var(--ink-faint);
  }
</style>
