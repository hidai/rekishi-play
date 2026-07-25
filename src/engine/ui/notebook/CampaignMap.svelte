<script lang="ts">
  import { onDestroy } from 'svelte';
  import { useStores } from '../../stores';
  import { mapMaxCh, campaignSvg, applyMapView } from '../../map/campaignMap';

  const { work, save } = useStores();
  const maxCh = mapMaxCh(save.active);
  const svg = campaignSvg(work);

  let paneEl: HTMLElement;
  let viewCh = $state(maxCh);
  let playing = $state(false);
  let timer: ReturnType<typeof setInterval> | null = null;
  let startTO: ReturnType<typeof setTimeout> | null = null;

  const steps = Array.from({ length: maxCh }, (_, i) => i + 1);

  function setView(vc: number, animate: boolean) {
    viewCh = vc;
    applyMapView(paneEl, work, vc, animate);
  }
  function stop() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    playing = false;
  }
  function play() {
    stop();
    const mc = Math.max(1, maxCh);
    let vc = 1;
    setView(1, true);
    playing = true;
    timer = setInterval(() => {
      vc++;
      if (vc > mc) {
        stop();
        return;
      }
      setView(vc, true);
    }, 1150);
  }

  // マウント後に初期表示を適用し、条件を満たせば自動再生（getTotalLength は要マウント）。
  $effect(() => {
    setView(maxCh, false);
    if (maxCh >= 2 && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      startTO = setTimeout(play, 400);
    }
    return () => {
      stop();
      if (startTO) clearTimeout(startTO);
    };
  });

  // タブ離脱（コンポーネント unmount）でも再生を止める。
  onDestroy(stop);
</script>

<div class="tabpane active" id="pane-map" bind:this={paneEl}>
  {#if maxCh >= 1}
    <div class="map-toolbar">
      <button class="mplay" onclick={() => (playing ? stop() : play())}>
        {playing ? '■ 再生を とめる' : '▶ 領土の うつり変わりを 再生'}
      </button>
      <div class="msteps" role="group" aria-label="章を えらぶ">
        {#each steps as i (i)}
          <button class="mstep" class:on={viewCh === i} onclick={() => { stop(); setView(i, true); }}>
            {i < work.totalChapters ? i : '終'}
          </button>
        {/each}
      </div>
    </div>
  {/if}
  <div class="map-wrap">{@html svg}</div>
  <div class="map-caption"></div>
  <div class="map-legend"></div>
</div>
