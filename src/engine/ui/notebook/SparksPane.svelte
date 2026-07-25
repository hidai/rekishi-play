<script lang="ts">
  import { useStores } from '../../stores';
  import { collectedSparks } from '../../sparks';
  import { CONFIDENCE_LEGEND, confidenceInfo } from '../../confidence';

  const { work, save } = useStores();

  const entries = $derived(collectedSparks(work, save.active?.progress));
  const got = $derived(entries.filter((e) => e.unlocked).length);
  const total = $derived(entries.length);
  // Show the confidence legend only once an UNLOCKED spark carries a mark (作品非依存)：
  // 未解錠章のみ marked のときに凡例だけ先出しされるのを避ける（可視バッジと歩調を合わせる）。
  const hasConfidence = $derived(entries.some((e) => e.unlocked && confidenceInfo(e.confidence)));

  function chLabel(ch: number): string {
    return ch === work.totalChapters ? '終章' : '第' + ch + '章';
  }
</script>

<!-- 「えっ！？図鑑」：旅で出会った「実は よく わかっていない」を集める。
     "歴史＝たったひとつの正解を覚える暗記ではなく、謎とき"という主題のコレクション。 -->
<div class="tabpane active" id="pane-sparks">
  <div class="riddle-box">
    <span class="riddle-lead">えっ！？図鑑</span>
    <p>
      歴史には、「実は よく わかっていない！」ことが たくさん ある。旅の 途中で 出会った
      「えっ！？」を、ここに 集めよう。わからない ことこそ、なぞときの 入口だ。
    </p>
  </div>
  {#if hasConfidence}
    <!-- ★Sureness-mark legend. "Not knowing (△・☆) is treasure = room to investigate". -->
    <div class="conf-legend">
      <span class="conf-legend-lead">たしかさマーク＝その 話は どれだけ たしか？</span>
      <ul>
        {#each CONFIDENCE_LEGEND as c (c.mark)}
          <li>
            <span class="conf-badge" data-mark={c.mark}>
              <span class="conf-mark">{c.mark}</span><span class="conf-label">{c.label}</span>
            </span>
            <span class="conf-blurb">{c.blurb}</span>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
  <div class="collect-bar">
    <div class="collect-meter"><i style="width:{total ? Math.round((got / total) * 100) : 0}%"></i></div>
    <span class="collect-count">{got}/{total}</span>
  </div>
  <div class="clue-list">
    {#each entries as e, i (i)}
      {#if e.unlocked}
        {@const info = confidenceInfo(e.confidence)}
        <div class="clue-item">
          <div class="clue-ic">❗</div>
          <div>
            <div class="clue-n">えっ！？ その{i + 1}<span class="clue-ch">（{chLabel(e.ch)}{#if e.place}・{@html e.place}{/if}）</span>{#if info}<span class="conf-badge" data-mark={info.mark} title="{info.mark} {info.label}：{info.blurb}"><span class="conf-mark">{info.mark}</span><span class="conf-label">{info.label}</span></span>{/if}</div>
            <p class="clue-tx">{@html e.text}</p>
            {#if e.deepQ}<p class="spark-deepq">🔍 {@html e.deepQ}</p>{/if}
          </div>
        </div>
      {:else}
        <div class="clue-item locked">
          <div class="clue-ic">🔒</div>
          <div>
            <div class="clue-n">？？？</div>
            <p class="clue-tx">{chLabel(e.ch)}で 出会う 「えっ！？」</p>
          </div>
        </div>
      {/if}
    {/each}
  </div>
  {#if total > 0 && got >= total}
    <p class="muted center" style="margin-top:18px">
      ぜんぶ 集めた！ 「わからない」に 出会ったら、それは なぞときの はじまりだ。
    </p>
  {:else}
    <p class="muted center" style="margin-top:18px">章を クリアすると、その章の 「えっ！？」が ひらくよ。</p>
  {/if}
</div>
