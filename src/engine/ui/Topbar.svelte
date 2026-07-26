<script lang="ts">
  // Left = where you are (breadcrumb, shallow → deep). Right = tools: the 手帳 and,
  // behind ⚙, the settings that are not places at all. See engine/trail.ts.
  import { useStores } from '../stores';
  import { monSvg } from '../art/icons';
  import { toggleTheme, toggleFurigana } from '../prefs';
  import { accountAvatar, accountLabel, NAME_MAX } from '../save.svelte';
  import { sfx } from '../sfx.svelte';
  import { buildTrail, type CrumbTarget } from '../trail';

  const { work, accounts, session, dialog, toast, exitToWorks, exitToAccounts } = useStores();

  const trail = $derived(
    buildTrail(
      work,
      {
        screen: session.screen,
        ch: session.ch,
        scene: session.scene,
        notebookFrom: session.notebookFrom,
      },
      !!exitToWorks,
    ),
  );
  /** Distance from the current location: 0 = here, 1 = one level up. */
  const depth = (i: number) => trail.length - 1 - i;

  function go(to: CrumbTarget) {
    if (to.kind === 'works') exitToWorks?.();
    else if (to.kind === 'title') session.show('title');
    else if (to.kind === 'home') session.show('home');
    else session.goScene(to.ch, to.scene);
  }

  let menuOpen = $state(false);
  let menuWrap = $state<HTMLElement | null>(null);

  // Who is playing: the name used to appear only on the work-select screen, so inside
  // a work nobody could tell which child's save was open (observation 2026-07-25).
  // Reader-supplied string → plain interpolation only, never {@html} (trust boundary).
  const who = $derived(accountLabel(accounts.active));
  const avatar = $derived(accountAvatar(accounts.active?.id ?? ''));

  // Naming is deferred to whenever the reader wants it (observation 2026-07-26), so the
  // one place that always shows who is playing is also where the name is given.
  async function renameMe() {
    const a = accounts.active;
    if (!a) return;
    menuOpen = false;
    const name = await dialog.prompt({
      title: a.name ? 'なまえを かえる' : 'なまえを つける',
      desc: 'ニックネームでOK。あとから いつでも かえられるよ。',
      placeholder: '例：たろう',
      value: a.name,
      maxlength: NAME_MAX,
      ok: 'きめる',
    });
    if (name === null) return;
    accounts.rename(a.id, name);
    const now = accounts.active?.name;
    toast.show(now ? `${now} で あそぶよ` : 'なまえを けしたよ');
  }

  const furiganaOn = $derived(!!accounts.active?.furigana);
  const dark = $derived(
    accounts.active?.theme
      ? accounts.active.theme === 'dark'
      : window.matchMedia('(prefers-color-scheme:dark)').matches,
  );

  $effect(() => {
    session.screen;
    menuOpen = false;
  });

  $effect(() => {
    if (!menuOpen) return;
    const onDown = (e: Event) => {
      if (!menuWrap?.contains(e.target as Node)) menuOpen = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') menuOpen = false;
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  });

  function toggleSound() {
    sfx.toggleMute();
    toast.show(sfx.muted ? '音 OFF' : '音 ON');
  }
</script>

<div id="topbar">
  <nav class="tb-trail" aria-label="いまいる ところ">
    {#each trail as c, i (c.id)}
      {#if i > 0}
        <span class="crumb-sep" class:far={depth(i) >= 1} aria-hidden="true">›</span>
      {/if}
      {#if c.to}
        {@const to = c.to}
        <button
          class="crumb"
          class:far={depth(i) >= 2}
          title="{c.label}へ もどる"
          onclick={() => go(to)}>
          {#if depth(i) === 1}<span class="crumb-up" aria-hidden="true">←</span>{/if}
          {#if c.mon}<span class="mon">{@html monSvg(work.mon)}</span>{:else if c.icon}<span
              class="crumb-icon"
              aria-hidden="true">{c.icon}</span>{/if}
          <span class="crumb-label">{c.label}</span>
        </button>
      {:else}
        <span class="crumb crumb-now" aria-current="page">
          {#if c.mon}<span class="mon">{@html monSvg(work.mon)}</span>{:else if c.icon}<span
              class="crumb-icon"
              aria-hidden="true">{c.icon}</span>{/if}
          <span class="crumb-label">{c.label}</span>
        </span>
      {/if}
    {/each}
  </nav>

  <div class="tb-tools">
    {#if session.screen !== 'notebook'}
      <button
        class="navpill"
        title="{work.strings.notebookName}を ひらく"
        aria-label="手帳をひらく"
        onclick={() => session.openNotebook('cards')}>🗂 <span class="np-label">手帳</span></button>
    {/if}
    <span class="tb-div" aria-hidden="true"></span>
    <div class="tb-settings" bind:this={menuWrap}>
      <button
        class="tb-who"
        class:on={menuOpen}
        title="いま あそんでいるのは {who}（ほかの 子に かわる・せってい）"
        aria-label="{who} で あそんでいる。ほかの 子に かわる・せってい"
        aria-haspopup="true"
        aria-expanded={menuOpen}
        onclick={() => (menuOpen = !menuOpen)}>
        <span class="who-av" aria-hidden="true">{avatar}</span>
        <span class="who-name">{who}</span>
        <span class="who-gear" aria-hidden="true">⚙</span>
      </button>
      {#if menuOpen}
        <div class="tb-menu">
          <!-- The pill's name can ellipsize on a narrow phone; the header always
               spells it out in full, right above the one button that changes it. -->
          <p class="tb-mh">
            <span class="mi-icon" aria-hidden="true">{avatar}</span>
            <span class="mi-label"
              >{#if accounts.active?.name}あそんでいるのは <b>{who}</b>{:else}この 記録には まだ なまえが
                ないよ{/if}</span>
          </p>
          <button class="tb-mi" onclick={renameMe}>
            <span class="mi-icon" aria-hidden="true">✎</span>
            <span class="mi-label">なまえを {accounts.active?.name ? 'かえる' : 'つける'}</span>
          </button>
          <button class="tb-mi" onclick={exitToAccounts}>
            <span class="mi-icon" aria-hidden="true">⇄</span>
            <span class="mi-label">ほかの 子に かわる</span>
          </button>
          <span class="tb-msep" aria-hidden="true"></span>
          <button class="tb-mi" onclick={() => toggleFurigana(accounts, toast)}>
            <span class="mi-icon">あ<small>ぁ</small></span>
            <span class="mi-label">ふりがな</span>
            <span class="mi-state" class:on={furiganaOn}>{furiganaOn ? 'ON' : 'OFF'}</span>
          </button>
          <button class="tb-mi" onclick={() => toggleTheme(accounts, toast)}>
            <span class="mi-icon">◐</span>
            <span class="mi-label">がめんの あかるさ</span>
            <span class="mi-state on">{dark ? 'よる' : 'ひる'}</span>
          </button>
          <button class="tb-mi" onclick={toggleSound}>
            <span class="mi-icon">{sfx.muted ? '🔇' : '🔊'}</span>
            <span class="mi-label">おと</span>
            <span class="mi-state" class:on={!sfx.muted}>{sfx.muted ? 'OFF' : 'ON'}</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</div>
