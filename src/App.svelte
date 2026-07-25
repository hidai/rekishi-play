<script lang="ts">
  // App shell: owns who is playing (the account), which Work is active, and the
  // global audio unlock.
  //
  // The account sits ABOVE the works: the reader picks a name once and it carries
  // into every work, so the boot order is 「だれで あそぶ？」→ 作品えらび → 作品.
  // With a single work registered the middle step is skipped. Switching works
  // re-mounts WorkRoot inside {#key selected.id} so every per-work store is
  // re-created against the same AccountStore.
  import type { Work, WorkEntry } from './engine/types';
  import { WORK_ENTRIES } from './works/registry';
  import { PERSON_BRIDGES } from './works/bridges';
  import { AccountStore } from './engine/save.svelte';
  import { CrossWorkStore } from './engine/crosswork.svelte';
  import { applyAccountPrefs } from './engine/prefs';
  import WorkRoot from './engine/ui/WorkRoot.svelte';
  import WorkSelectScreen from './engine/ui/WorkSelectScreen.svelte';
  import AccountsScreen from './engine/ui/AccountsScreen.svelte';
  import { sfx } from './engine/sfx.svelte';

  const multiWork = WORK_ENTRIES.length > 1;
  const accounts = new AccountStore();
  // Outlives every work: the reader can meet the same person in either direction.
  const crosswork = new CrossWorkStore(PERSON_BRIDGES, WORK_ENTRIES, accounts);
  let selected = $state<Work | null>(null);
  /** Re-opening the account screen while an account is already active. */
  let switching = $state(false);

  applyAccountPrefs(accounts.active);

  function selectWork(entry: WorkEntry) {
    entry.load().then((w) => (selected = w));
  }
  function afterPick() {
    switching = false;
    // Single-work build has nothing to choose between: go straight in.
    if (!multiWork) selectWork(WORK_ENTRIES[0]);
  }
  if (accounts.active) afterPick();

  // Only offered when there is more than one work to choose between.
  const exitToWorks = multiWork ? () => (selected = null) : undefined;
  function switchAccount() {
    selected = null;
    switching = true;
  }

  // Warm up the AudioContext on the first user gesture (autoplay-policy workaround),
  // once. App lives for the whole session, so one warm-up survives work switches.
  $effect(() => {
    const warm = () => {
      sfx.unlock();
      window.removeEventListener('pointerdown', warm);
      window.removeEventListener('keydown', warm);
    };
    window.addEventListener('pointerdown', warm, { once: true });
    window.addEventListener('keydown', warm, { once: true });
    return () => {
      window.removeEventListener('pointerdown', warm);
      window.removeEventListener('keydown', warm);
    };
  });
</script>

{#if !accounts.active || switching}
  <AccountsScreen
    {accounts}
    workCards={WORK_ENTRIES.map((e) => e.card)}
    onPicked={afterPick}
    onCancel={accounts.active && multiWork ? () => (switching = false) : undefined} />
{:else if selected}
  {#key selected.id}
    <WorkRoot
      work={selected}
      workCards={WORK_ENTRIES.map((e) => e.card)}
      {accounts}
      {crosswork}
      {exitToWorks}
      exitToAccounts={switchAccount} />
  {/key}
{:else if multiWork}
  <WorkSelectScreen
    entries={WORK_ENTRIES}
    account={accounts.active}
    onSelect={selectWork}
    onSwitchAccount={switchAccount} />
{/if}
