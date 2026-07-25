<script lang="ts">
  import { useStores } from '../stores';
  import { startChapter } from '../nav';

  const { work, accounts, save, session } = useStores();
  const total = work.totalChapters;
  const totalCards = Object.keys(work.cards).length;

  // 章メタは STORY.chapters に一本化（旧 renderHome の meta 二重管理を解消）。
  const chapters = work.story.chapters;

  const lead = $derived(
    save.active
      ? `${accounts.active?.name ?? ''} の 冒険 — 手がかり ${save.active.clues.length}/${total}、カード ${save.active.cards.length}/${totalCards}`
      : '',
  );

  function status(i: number) {
    const done = !!save.active && save.active.progress[i] === 'done';
    const unlocked = i === 1 || (!!save.active && save.active.progress[i - 1] === 'done');
    const impl = !!work.story.chapters.find((c) => c.id === i);
    const canPlay = unlocked && impl;
    return { done, unlocked, impl, canPlay };
  }

  // ★N 再訪の引き：いま あそべる章に、前章クリア時の teaser（引き）を再掲する。
  // クリア画面を閉じたら消えてしまっていた「つづきが気になる」を、翌日のホームにも残す。
  function teaserFor(i: number): string | undefined {
    return work.story.chapters.find((c) => c.id === i - 1)?.teaser;
  }
</script>

<section class="screen active" id="home">
  <div class="wrap">
    <div class="screen-head">
      <h2 class="section-title">{work.strings.homeTitle}</h2>
      <p class="section-lead">{lead}</p>
    </div>
    <div class="chapter-track">
      {#each chapters as ch (ch.id)}
        {@const st = status(ch.id)}
        <div class="chapter-node {st.done ? 'done' : ''} {st.unlocked && !st.done ? 'current' : ''}">
          <div class="rail">
            <span class="line"></span>
            <span class="chapter-dot">{ch.id < total ? ch.id : '終'}</span>
          </div>
          <div class="chapter-body">
            <button class="chapter-btn" disabled={!st.canPlay} onclick={() => startChapter({ work, save, session }, ch.id)}>
              <span class="ct">
                <span class="chapter-num">{@html ch.num}</span>
                <span class="chapter-title-t">{@html ch.title}</span>
                <span class="chapter-years">{ch.years}</span>
                <!-- ★E 見せ場の予告：各章の lead を年代記に出し「あそこまで行きたい」を作る。 -->
                <span class="chapter-lead">{@html ch.lead}</span>
                {#if st.canPlay && !st.done && teaserFor(ch.id)}
                  <!-- ★N 前章クリアで見せた「つづく…」の引きを、いま あそべる章に再掲。 -->
                  <span class="chapter-tease">▶ {@html teaserFor(ch.id)}</span>
                {/if}
              </span>
              <span class="chapter-state {st.done ? 's-done' : st.canPlay ? 's-open' : 's-lock'}">
                {st.done ? '✓ クリア' : st.canPlay ? '▶ あそぶ' : st.impl ? '🔒 まだ' : '準備中'}
              </span>
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
