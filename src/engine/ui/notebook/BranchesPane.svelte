<script lang="ts">
  import { useStores } from '../../stores';
  import { collectedBranches, branchesSeenCount } from '../../branches';
  import { startChapter } from '../../nav';

  const stores = useStores();
  const { work, save } = stores;

  const entries = $derived(collectedBranches(work, save.active?.choices));
  const count = $derived(branchesSeenCount(work, save.active?.choices));

  function chLabel(ch: number): string {
    return ch === work.totalChapters ? '終章' : '第' + ch + '章';
  }

  // ★N 図鑑から章の再プレイへ直行（「あそび直すとひらく」を文言でなくボタンにする）。
  function chipLabel(o: { canon: boolean; moshimo: boolean }): string {
    return o.canon ? '史実' : o.moshimo ? 'もしも' : '答え';
  }
</script>

<!-- ★L 分かれ道図鑑：選んだ枝の「史実では」見出しがたまる。まだ見ていない枝は
     「えらぶと ひらく」＝章の再プレイ（＝同じ史実の再読）の動機になる。 -->
<div class="tabpane active" id="pane-branches">
  <div class="riddle-box">
    <span class="riddle-lead">分かれ道図鑑</span>
    <p>
      物語で 出会った 人生の 分かれ道。えらんだ 道には「史実では」の しるしが つく。
      <b>えらばなかった 道</b>は、章を あそび直すと ひらくよ。
    </p>
  </div>
  <div class="collect-bar">
    <div class="collect-meter"><i style="width:{count.total ? Math.round((count.seen / count.total) * 100) : 0}%"></i></div>
    <span class="collect-count">{count.seen}/{count.total}</span>
  </div>
  <div class="clue-list">
    {#each entries as e (e.ch + ':' + e.sceneId)}
      {#if e.anySeen}
        <div class="clue-item branch-item" class:complete={e.complete}>
          <div class="clue-ic">{e.complete ? '🔀' : '🚪'}</div>
          <div class="branch-body">
            <div class="clue-n">
              {@html e.q}<span class="clue-ch">（{chLabel(e.ch)}{#if e.place}・{@html e.place}{/if}）</span>
              {#if e.complete}<span class="branch-comp">✓ ぜんぶ 見た</span>{/if}
            </div>
            {#each e.options as o (o.idx)}
              {#if o.seen}
                <div class="branch-opt seen">
                  <span class="branch-chip {o.canon ? 'canon' : 'if'}">{chipLabel(o)}</span>
                  <span class="branch-label">{@html o.label}</span>
                  {#if o.match}<span class="branch-match">→ {@html o.match}</span>{/if}
                </div>
              {:else}
                <div class="branch-opt locked">
                  <span class="branch-chip locked">？</span>
                  <span class="branch-label">{@html o.label}</span>
                  <span class="branch-match">→ えらぶと ひらく</span>
                </div>
              {/if}
            {/each}
            {#if !e.complete}
              <button class="linklike branch-replay" onclick={() => startChapter(stores, e.ch)}>
                ▶ {chLabel(e.ch)}を あそび直して、ちがう 道を えらぶ
              </button>
            {/if}
          </div>
        </div>
      {:else}
        <div class="clue-item locked">
          <div class="clue-ic">🔒</div>
          <div>
            <div class="clue-n">？？？</div>
            <p class="clue-tx">{chLabel(e.ch)}の 分かれ道</p>
          </div>
        </div>
      {/if}
    {/each}
  </div>
  {#if count.total > 0 && count.seen >= count.total}
    <p class="muted center" style="margin-top:18px">
      すべての 道を 見とどけた！ どの 道にも、それぞれの「なるほど」が あったはず。
    </p>
  {:else}
    <p class="muted center" style="margin-top:18px">クリアした 章も、もう一度 あそべる。ちがう 道を えらんで みよう。</p>
  {/if}
</div>
