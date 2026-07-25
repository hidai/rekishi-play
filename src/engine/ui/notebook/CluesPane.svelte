<script lang="ts">
  import { useStores } from '../../stores';

  const { work, save } = useStores();
  const total = work.totalChapters;

  const got = $derived(save.active ? save.active.clues.length : 0);
  const finalDone = $derived(!!save.active && save.active.progress[total] === 'done');

  function has(i: number): boolean {
    return !!save.active?.clues.includes('clue-' + i);
  }
  function chLabel(i: number): string {
    return i === total ? '終章' : '第' + i + '章';
  }
</script>

<div class="tabpane active" id="pane-clues">
  <div class="riddle-box">
    <span class="riddle-lead">{work.strings.riddleLead}</span>
    <p>{@html work.riddle}</p>
  </div>
  <div class="collect-bar">
    <div class="collect-meter"><i style="width:{Math.round((got / total) * 100)}%"></i></div>
    <span class="collect-count">{got}/{total}</span>
  </div>
  <div class="clue-list">
    {#each Array.from({ length: total }, (_, k) => k + 1) as i (i)}
      {#if has(i)}
        <div class="clue-item">
          <div class="clue-ic">🔑</div>
          <div>
            <div class="clue-n">手がかり {i}<span class="clue-ch">（{chLabel(i)}）</span></div>
            <p class="clue-tx">{@html work.clues['clue-' + i].text}</p>
          </div>
        </div>
      {:else}
        <div class="clue-item locked">
          <div class="clue-ic">🔒</div>
          <div>
            <div class="clue-n">？？？</div>
            <p class="clue-tx">{chLabel(i)}で 見つかる 手がかり</p>
          </div>
        </div>
      {/if}
    {/each}
  </div>
  {#if finalDone}
    <p class="muted center" style="margin-top:18px">
      7つの 手がかりから、きみは どんな 答えを 出した？<br />（終章を もう一度 あそぶと、答えを 選びなおせるよ）
    </p>
  {:else}
    <p class="muted center" style="margin-top:18px">章を すすめて、7つの 手がかりを 集めよう。</p>
  {/if}
</div>
