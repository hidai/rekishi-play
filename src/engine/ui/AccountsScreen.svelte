<script lang="ts">
  // 「だれで あそぶ？」。作品より上の面＝ここで選んだ名前が、どの作品へ入っても続く。
  // 作品ごとの store はまだ無いので、useStores() ではなく props で受け取る。
  import {
    accountStandings,
    type Account,
    type AccountStore,
    type AccountStandings,
  } from '../save.svelte';
  import type { WorkCard } from '../types';
  import { applyAccountPrefs } from '../prefs';
  import { DialogService } from '../dialog.svelte';
  import DialogHost from './overlays/DialogHost.svelte';

  let {
    accounts,
    workCards,
    onPicked,
    onCancel,
  }: {
    accounts: AccountStore;
    workCards: WorkCard[];
    onPicked: () => void;
    onCancel?: () => void;
  } = $props();

  // This screen lives above the per-work store bundle, so it owns its dialog service.
  const dialog = new DialogService();

  const AVATARS = ['🦉', '🐯', '🐉', '🦊', '🐢', '🦅'];

  function avatar(id: string): string {
    return AVATARS[+id.slice(1) % 6];
  }
  /** 表の上の1行＝「いくつの作品に足あとがあるか」。数の内訳は表と合計行が持つ。 */
  function sub(s: AccountStandings): string {
    if (!s.works) return 'まだ どの 作品も あそんでいないよ';
    return `${s.rows.length}作の うち ${s.works}作で あそび中`;
  }
  function pick(a: Account) {
    accounts.setActive(a.id);
    applyAccountPrefs(accounts.active);
    onPicked();
  }
  async function del(a: Account) {
    const ok = await dialog.confirm(
      '記録を 消す？',
      `「${a.name}」の 進みぐあいと カードが、ぜんぶの 作品ぶん 消えます。もとに もどせません。`,
      'けす',
    );
    if (ok) accounts.deleteAccount(a.id);
  }
  async function add() {
    const name = await dialog.prompt({
      title: 'あたらしく はじめる',
      desc: '名前を いれてね（ニックネームでOK）。',
      placeholder: '例：たろう',
      maxlength: 10,
      ok: 'はじめる',
    });
    if (name === null) return;
    accounts.newAccount((name || 'なまえ').slice(0, 10));
    applyAccountPrefs(accounts.active);
    onPicked();
  }
</script>

<section class="screen active" id="accounts">
  <div class="wrap">
    <div class="screen-head">
      <h2 class="section-title">だれで あそぶ？</h2>
      <p class="section-lead">
        名前を えらぶと、どの 作品でも この 名前で つづきから あそべるよ。<br />
        下の ならびは 作品ごとの 進みぐあい。ぜんぶの 章を クリアすると ✓ が つくよ。
      </p>
    </div>
    <div class="profile-list">
      {#each accounts.db.accounts as a (a.id)}
        {@const st = accountStandings(a, workCards)}
        <button class="profile-card" onclick={() => pick(a)}>
          <span class="profile-avatar">{avatar(a.id)}</span>
          <span class="profile-meta">
            <span class="profile-name">{a.name}</span>
            <span class="profile-sub">{sub(st)}</span>
            <span class="ach">
              {#each st.rows as r (r.id)}
                <span class="ach-row" class:played={r.played} class:done={r.complete}>
                  <span class="ach-name">{@html r.label}</span>
                  <!-- 未プレイは欠落（「まだ」）でなく、これから会う人として書く
                       ＝この画面は宿題の チェックリストではない（VISION アンチゴール）。 -->
                  <span class="ach-num"
                    >{#if r.played}{r.done}/{r.total}章 ・ {r.cards}枚{:else}まだ 会っていない{/if}</span>
                  <span class="ach-mark" aria-hidden="true">{r.complete ? '✓' : ''}</span>
                </span>
              {/each}
              <span class="ach-row total">
                <span class="ach-name">ぜんぶで</span>
                <span class="ach-num">{st.chapters}/{st.totalChapters}章 ・ {st.cards}枚</span>
                <span class="ach-mark"></span>
              </span>
            </span>
          </span>
          <span
            class="profile-del"
            title="消す"
            role="button"
            tabindex="0"
            onclick={(e) => {
              e.stopPropagation();
              del(a);
            }}
            onkeydown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                e.stopPropagation();
                del(a);
              }
            }}>✕</span>
        </button>
      {/each}
      {#if !accounts.db.accounts.length}
        <p class="muted center" style="padding:14px">まだ 誰も いないよ。下の ボタンで はじめよう。</p>
      {/if}
    </div>
    <button class="btn btn-ghost" style="width:100%" onclick={add}>＋ あたらしく はじめる</button>
    {#if onCancel}
      <div class="backbar mt-l"><button class="linklike" onclick={onCancel}>← 作品えらびへ もどる</button></div>
    {/if}
  </div>
</section>

<DialogHost {dialog} />

<style>
  /* Name / summary / per-work standings, stacked like the work cards. */
  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
  }
  /* One row per work, in registry order — three columns that line up down the card,
     so「どこまで 進んだか」は数字の位置で比べられる（表として読める最小の形）。
     Rows are display:contents so every row's cells share these columns. */
  .ach {
    display: grid;
    /* The name column shrinks first (long names ellipsize) so the table never
       pushes into the delete ✕ on a narrow phone. */
    grid-template-columns: minmax(0, max-content) max-content 1.1em;
    justify-content: start;
    min-width: 0;
    /* No column gap: the cells carry their own padding so the 合計 row's rule runs
       unbroken across the three columns. */
    column-gap: 0;
    margin-top: 6px;
    font-size: 11.5px;
    /* Roomy enough that the <rt> reading fits inside the row's own line box
       (the names carry furigana here — this screen is above the furigana toggle). */
    line-height: 1.9;
  }
  .ach-row {
    display: contents;
    color: var(--ink-faint);
  }
  .ach-name,
  .ach-num,
  .ach-mark {
    color: var(--ink-faint);
    white-space: nowrap;
  }
  .ach-name {
    font-family: var(--serif);
    padding-right: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Untouched works stay on the list (they are the invitation) but recede. */
  .ach-row:not(.played, .total) .ach-name,
  .ach-row:not(.played, .total) .ach-num {
    opacity: 0.5;
  }
  .ach-num {
    letter-spacing: 0.02em;
    padding-right: 8px;
  }
  .ach-mark {
    color: var(--accent);
    font-weight: 700;
  }
  .ach-row.played .ach-name,
  .ach-row.played .ach-num {
    color: var(--ink-soft);
  }
  .ach-row.done .ach-name {
    color: var(--ink);
  }
  /* The 通し line: the only row that adds the works together. */
  .ach-row.total > * {
    margin-top: 3px;
    padding-top: 3px;
    border-top: 1px solid var(--line);
    color: var(--ink-soft);
  }
</style>
