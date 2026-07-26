<script lang="ts">
  // Work selection (shown after the account is chosen, when more than one work is
  // registered). Self-contained: no per-work stores exist yet, so it takes the
  // registry, the active account and callbacks from App rather than using useStores().
  import type { WorkCard, WorkEntry } from '../types';
  import { faceArt } from '../art/face';
  import { doneChapters, type Account } from '../save.svelte';
  import EraBand from './EraBand.svelte';
  import { eraBand } from '../chrono';

  let {
    entries,
    account,
    onSelect,
    onSwitchAccount,
  }: {
    entries: WorkEntry[];
    account: Account;
    onSelect: (e: WorkEntry) => void;
    onSwitchAccount: () => void;
  } = $props();

  /** その子がその作品でどこまで進んだか（未着手なら空文字）。 */
  function progress(card: WorkCard): string {
    const w = account.works[card.id];
    if (!w) return '';
    const done = doneChapters(account, card.id);
    if (done >= card.totalChapters) return `✓ ぜんぶ クリア ・ カード ${w.cards.length}枚`;
    if (!done && !w.cards.length) return '';
    const head = done ? `${done}/${card.totalChapters}章` : 'あそび中';
    return `${head} ・ カード ${w.cards.length}枚`;
  }

  const cards = $derived(entries.map((e) => e.card));
  // No band when there is no one to compare with (or nobody's years parse).
  const hasBand = $derived(!!eraBand(cards));

  function pickById(id: string) {
    const e = entries.find((x) => x.card.id === id);
    if (e) onSelect(e);
  }
</script>

<section class="screen active" id="work-select">
  <div class="wrap">
    <div class="screen-head">
      <h2 class="section-title">なりきる 人を えらぶ</h2>
      <p class="section-lead">
        だれに なって 歴史を 生きて みる？ 進みぐあいは 作品ごとに 分かれて 残るよ。
      </p>
    </div>
    <div class="profile-list">
      {#each entries as e (e.card.id)}
        {@const done = progress(e.card)}
        <button class="profile-card" onclick={() => onSelect(e)}>
          <span class="tf-face work-face">{@html faceArt(e.card.protagonistId, e.card.faces)}</span>
          <span class="profile-meta">
            <span class="profile-name">{@html e.card.titleMain}</span>
            <span class="profile-sub">{e.card.titleSub}</span>
            <span class="profile-years">{e.card.years}</span>
            {#if done}<span class="work-progress">{done}</span>{/if}
          </span>
          <span class="work-go" aria-hidden="true">→</span>
        </button>
      {/each}
    </div>
    {#if hasBand}
      <div class="plate era-plate">
        <h3 class="era-title">みんな、いつの 人？</h3>
        <!-- 帯が押せることは見た目からは伝わらなかった（小5 ペルソナ）＝一行で言う。 -->
        <p class="era-hint">おびを おすと、その 人から はじめられるよ。</p>
        <EraBand {cards} onPick={pickById} />
      </div>
    {/if}
    <div class="who">
      <span
        >{#if account.name}いま あそんでいるのは <b>{account.name}</b>{:else}なまえを つけなくても
          あそべるよ{/if}</span>
      <button class="linklike" onclick={onSwitchAccount}
        >{account.name ? 'ほかの 子に かわる' : 'なまえ・ほかの 子'}</button>
    </div>
  </div>
</section>

<style>
  /* Slightly larger face than the .tf-face default and a chevron on the right. */
  .work-face {
    flex: 0 0 auto;
  }
  /* Three stacked lines here (name / subtitle / years); the save-slot cards that
     share .profile-meta keep their inline two-line flow. */
  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .profile-years {
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--ink-faint);
  }
  .work-progress {
    font-size: 12px;
    color: var(--ink-soft);
  }
  .work-go {
    color: var(--ink-faint);
    font-size: 20px;
    padding-left: 6px;
  }
  .era-plate {
    padding: 16px 18px 14px;
  }
  .era-title {
    font-family: var(--serif);
    font-size: 15px;
    letter-spacing: 0.06em;
    margin: 0 0 2px;
    color: var(--ink);
  }
  .era-hint {
    margin: 0 0 8px;
    font-size: 11.5px;
    color: var(--ink-faint);
  }
  /* Who is playing — the only place to swap accounts, since this screen has no topbar. */
  .who {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 18px;
    font-size: 13px;
    color: var(--ink-faint);
  }
</style>
