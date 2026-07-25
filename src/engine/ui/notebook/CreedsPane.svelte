<script lang="ts">
  import { useStores } from '../../stores';
  import { collectedCreeds, creedsUnlockedCount } from '../../creeds';
  import { heroName, heroRubyHtml } from '../../hero';

  const { work, save } = useStores();
  const total = work.totalChapters;

  // ★K 全章の「信条」を、進捗で解錠しながら章順に。負の定義（手がかり）と対の"正の定義"。
  const entries = $derived(collectedCreeds(work, save.active?.progress));
  const got = $derived(creedsUnlockedCount(work, save.active?.progress));
  const finalDone = $derived(!!save.active && save.active.progress[total] === 'done');
  // Protagonist display names via the canonical engine helpers (see engine/hero.ts).
  const heroShort = heroName(work);
  const heroRuby = heroRubyHtml(work);
  const heroFull = work.cards[work.protagonistId]?.name ?? heroShort;

  function chLabel(i: number): string {
    return i === total ? '終章' : '第' + i + '章';
  }
</script>

<div class="tabpane active" id="pane-creeds">
  <div class="creed-intro">
    <span class="creed-intro-lead">🖋 {heroShort}の ことば</span>
    <p>
      「手がかり」が 物語を つらぬく <em>謎</em>への みちしるべなら、こちらは
      <b>{heroShort}とは どんな 人か</b> の <em>答え</em>。<br />章を こえるたびに 1つずつ、決めごとが
      刻まれる。集めるほど、きみの 中に {@html heroRuby}という 人が 立ちあがる。
    </p>
  </div>

  <div class="collect-bar">
    <div class="collect-meter"><i style="width:{Math.round((got / total) * 100)}%"></i></div>
    <span class="collect-count">{got}/{total}</span>
  </div>

  <div class="creed-list">
    {#each entries as e (e.ch)}
      {#if e.unlocked}
        <div class="creed creed-item">
          <div class="creed-head">
            <span class="creed-brush" aria-hidden="true">🖋</span>{e.ch === total ? 'さいごの 信条' : e.ch + 'つめ の 信条'}<span class="creed-ch">（{chLabel(e.ch)}）</span>
          </div>
          <p class="creed-line">{@html e.creed.line}</p>
          <p class="creed-act">{@html e.creed.act}</p>
        </div>
      {:else}
        <div class="creed creed-item locked">
          <div class="creed-head"><span class="creed-brush" aria-hidden="true">🔒</span>？？？<span class="creed-ch">（{chLabel(e.ch)}）</span></div>
          <p class="creed-line muted">{chLabel(e.ch)}を こえると、{heroShort}の 信条が 1つ 刻まれる。</p>
        </div>
      {/if}
    {/each}
  </div>

  {#if finalDone}
    <p class="muted center" style="margin-top:18px">
      {got}つの ことばが、ひとりの 人を かたちづくる。<br />——これが、きみが 出会った {heroFull}だ。
    </p>
  {:else}
    <p class="muted center" style="margin-top:18px">章を すすめて、{heroShort}の 生き方を 集めよう。</p>
  {/if}
</div>
