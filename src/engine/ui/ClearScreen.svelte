<script lang="ts">
  import { onMount } from 'svelte';
  import { useStores } from '../stores';
  import { monSvg } from '../art/icons';
  import { heroName, heroRubyHtml } from '../hero';
  import { meterSummary, meterProgress, metersActive } from '../meters';
  import { canonStat, hasCanon } from '../canon';
  import { branchesSeenCount } from '../branches';
  import { chapterCreed } from '../creeds';
  import { personPool } from '../quiz';
  import { sfx } from '../sfx.svelte';
  import GCard from './GCard.svelte';
  import MeterBar from './MeterBar.svelte';

  const { work, save, session } = useStores();

  // ★H 章クリアのファンファーレ（この画面に来た一度だけ）。
  onMount(() => sfx.clear());
  const total = work.totalChapters;
  const totalCards = Object.keys(work.cards).length;

  const chId = $derived(session.ch ?? 0);
  const chapter = $derived(work.story.chapters.find((c) => c.id === chId));
  const isFinal = $derived(chId === total);
  const newcards = $derived(
    Object.keys(work.cards).filter(
      (id) => work.cards[id].ch === chId && !!save.active?.cards.includes(id),
    ),
  );
  // ★J 集めた人物が2人以上なら、章クリアから顔あてクイズへ誘える。
  const canQuiz = $derived(personPool(work, save.active?.cards).length >= 2);
  // ★K この章で見えた「秀長の信条」（正の定義）。手帳「秀長のことば」に積み上がる。
  const creed = $derived(chapterCreed(work, chId));
  // Protagonist display names via the canonical engine helpers (see engine/hero.ts).
  const heroShort = heroName(work);
  const heroRuby = heroRubyHtml(work);
  // ★1: 選択履歴で終章の締めが 1 文変わる。
  const summary = $derived(meterSummary(work, save.active));
  // ★C: 各章クリアで出す"中間寸評"（終盤を待たず選択の積み上がりを実感させる）。
  const progress = $derived(meterProgress(work, save.active));
  // ★L きみの読み（史実一致）。外れは失敗ではなく「史実では」のおどろき＝学びの入口として提示。
  const yomi = $derived(hasCanon(work) ? canonStat(work, save.active?.choices) : null);
  const branchCount = $derived(branchesSeenCount(work, save.active?.choices));

  function next() {
    session.show('home');
  }
</script>

<section class="screen active" id="clear">
  <div class="wrap">
    {#if chapter}
      <div class="clear-mon">{@html monSvg(isFinal ? (work.finalMon ?? work.mon) : work.mon)}</div>
      <div class="clear-badge">{isFinal ? '物語 かんりょう' : '第' + chId + '章 クリア'}</div>
      <h3 class="clear-title">{@html chapter.title}</h3>
      <p class="clear-sub">
        手がかり {save.active ? save.active.clues.length : 0}/{total} ・ カード {save.active ? save.active.cards.length : 0}/{totalCards}
      </p>

      {#if newcards.length}
        <div class="clear-box">
          <h4>▼ この章で 手に入れた カード</h4>
          <div class="newcards">
            {#each newcards as id (id)}
              <GCard {id} revealed />
            {/each}
          </div>
        </div>
      {/if}

      {#if isFinal && work.meters && metersActive(work, save.active)}
        <div class="clear-box grew">
          <h4>▼ きみが 育てた「{@html heroRuby}」</h4>
          <MeterBar variant="full" />
          <p class="grew-line">きみが 旅の あいだに 育てた {@html heroRuby}は、{@html summary}。</p>
        </div>
      {:else if work.meters && metersActive(work, save.active) && progress}
        <!-- ★C 中間寸評：終章を待たず、章ごとに選択の積み上がりを1文で見せる。 -->
        <div class="clear-box grew">
          <h4>▼ きみの {@html heroRuby}は いま…</h4>
          <MeterBar variant="full" />
          <p class="grew-line">きみの {@html heroRuby}は、{@html progress}。</p>
        </div>
      {/if}

      {#if yomi && yomi.total > 0}
        <!-- ★L きみの読み。初回の選択が史実と一致した数。外れ＝学びの入口、と前向きに枠づける。 -->
        <div class="clear-box yomi">
          <h4>▼ きみの 読み</h4>
          <p class="yomi-line">
            人生の 分かれ道で、<b>史実と 同じ 道</b>を えらんだのは——
            <span class="yomi-count">{yomi.matched}<span class="yomi-total">/{yomi.total}</span></span>
          </p>
          <p class="yomi-sub">
            ちがう 道を えらんだ ときこそ、「史実では」の おどろきが 待っている。
            {#if branchCount.seen < branchCount.total}まだ 見ていない 道が {branchCount.total - branchCount.seen}本。章を あそび直すと ひらくよ。{/if}
          </p>
          <button class="linklike" onclick={() => session.openNotebook('branches')}>🔀 分かれ道図鑑を 見る</button>
        </div>
      {/if}

      {#if creed}
        <!-- ★K この章で見えた「秀長の信条」。負の定義に対する"正の定義"をクリアでも念押し。 -->
        <div class="creed creed-clear">
          <div class="creed-head"><span class="creed-brush" aria-hidden="true">🖋</span>この章で 見えた {@html heroRuby}の <ruby>信条<rt>しんじょう</rt></ruby></div>
          <p class="creed-line">{@html creed.line}</p>
          <p class="creed-act">{@html creed.act}</p>
        </div>
      {/if}

      {#if !isFinal && chapter.teaser}
        <!-- ★4 章間クリフハンガー。次章の未解決の謎で「引き」をつくる。 -->
        <div class="teaser-box">
          <div class="th">▶ つづく…</div>
          <p>{@html chapter.teaser}</p>
        </div>
      {/if}

      <div class="clear-actions">
        {#if isFinal}
          <button class="btn btn-gold" onclick={() => session.openNotebook('hidden')}>隠しページを ひらく ✦</button>
        {/if}
        <button class="btn btn-primary" onclick={next}>{isFinal ? '年代記に もどる' : '次の 章へ すすむ →'}</button>
        {#if canQuiz}
          <button class="linklike" onclick={() => session.openNotebook('quiz')}>🎴 クイズで たしかめる</button>
        {/if}
        <button class="linklike" onclick={() => session.openNotebook('creeds')}>🖋 {heroShort}のことばを 見る</button>
        <button class="linklike" onclick={() => session.openNotebook('cards')}>ひでなが手帳を ひらく</button>
      </div>
    {/if}
  </div>
</section>
