<script lang="ts">
  // 「だれで あそぶ？」。作品より上の面＝ここで選んだ名前が、どの作品へ入っても続く。
  // 作品ごとの store はまだ無いので、useStores() ではなく props で受け取る。
  import { accountSummary, type Account, type AccountStore } from '../save.svelte';
  import { applyAccountPrefs } from '../prefs';
  import { DialogService } from '../dialog.svelte';
  import DialogHost from './overlays/DialogHost.svelte';

  let {
    accounts,
    onPicked,
    onCancel,
  }: { accounts: AccountStore; onPicked: () => void; onCancel?: () => void } = $props();

  // This screen lives above the per-work store bundle, so it owns its dialog service.
  const dialog = new DialogService();

  const AVATARS = ['🦉', '🐯', '🐉', '🦊', '🐢', '🦅'];

  function avatar(id: string): string {
    return AVATARS[+id.slice(1) % 6];
  }
  function sub(a: Account): string {
    const s = accountSummary(a);
    if (!s.works) return 'まだ どの 作品も あそんでいないよ';
    const head = `${s.works}作で あそび中`;
    const chapters = s.chapters ? ` ・ ${s.chapters}章 クリア` : '';
    return `${head}${chapters} ・ カード ${s.cards}枚`;
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
        名前を えらぶと、どの 作品でも この 名前で つづきから あそべるよ。
      </p>
    </div>
    <div class="profile-list">
      {#each accounts.db.accounts as a (a.id)}
        <button class="profile-card" onclick={() => pick(a)}>
          <span class="profile-avatar">{avatar(a.id)}</span>
          <span class="profile-meta">
            <span class="profile-name">{a.name}</span>
            <span class="profile-sub">{sub(a)}</span>
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
  /* Two stacked lines (name / summary), like the work cards. */
  .profile-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
    text-align: left;
  }
</style>
