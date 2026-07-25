<script lang="ts">
  // Per-work application root. App mounts one WorkRoot per selected Work inside a
  // {#key work.id} block, so switching works fully re-creates the store bundle and
  // re-runs setStores/boot (context can only be set at component init in Svelte 5).
  // The account (who is playing) is owned by App and outlives every work; this root
  // only opens a SaveStore window onto that account's slice for this work.
  import type { Work, WorkCard } from '../types';
  import { SaveStore, type AccountStore } from '../save.svelte';
  import type { CrossWorkStore } from '../crosswork.svelte';
  import { Session } from '../session.svelte';
  import { DialogService } from '../dialog.svelte';
  import { ToastService } from '../toast.svelte';
  import { HistService } from '../hist.svelte';
  import { setStores } from '../stores';
  import { applyAccountPrefs } from '../prefs';
  import Topbar from './Topbar.svelte';
  import TitleScreen from './TitleScreen.svelte';
  import HomeScreen from './HomeScreen.svelte';
  import SceneScreen from './SceneScreen.svelte';
  import ClearScreen from './ClearScreen.svelte';
  import NotebookScreen from './notebook/NotebookScreen.svelte';
  import DialogHost from './overlays/DialogHost.svelte';
  import HistOverlay from './overlays/HistOverlay.svelte';
  import CardModal from './overlays/CardModal.svelte';
  import StageReveal from './overlays/StageReveal.svelte';
  import Toast from './overlays/Toast.svelte';
  import { stageReveal } from '../stagereveal.svelte';
  import { untrack } from 'svelte';

  let {
    work,
    workCards,
    accounts,
    crosswork,
    exitToWorks,
    exitToAccounts,
  }: {
    work: Work;
    workCards: WorkCard[];
    accounts: AccountStore;
    crosswork: CrossWorkStore;
    exitToWorks?: () => void;
    exitToAccounts: () => void;
  } = $props();

  // App remounts this root per work via {#key work.id}, so the store bundle binds
  // to the props' initial values on purpose (untrack silences the otherwise-correct
  // "only the initial value is captured" hint).
  const w = untrack(() => work);
  const acc = untrack(() => accounts);
  const save = new SaveStore(acc, w);
  const session = new Session();
  const dialog = new DialogService();
  const toast = new ToastService();
  const hist = new HistService();
  setStores({
    work: w,
    workCards: untrack(() => workCards),
    accounts: acc,
    crosswork: untrack(() => crosswork),
    save,
    session,
    dialog,
    toast,
    hist,
    exitToWorks: untrack(() => exitToWorks),
    exitToAccounts: untrack(() => exitToAccounts),
  });

  // boot: apply the account's prefs (furigana / theme), then show the title.
  applyAccountPrefs(acc.active);
  session.show('title');

  const topbarHidden = $derived(session.screen === 'title');

  // Freeze background scroll while any overlay is open (former body.style.overflow).
  // Reset on teardown so an in-flight lock never survives a work switch (exitToWorks
  // unmounts this root; without the cleanup, overflow:hidden could leak to the
  // work-select screen).
  $effect(() => {
    const open =
      !!dialog.current || !!hist.current || !!session.cardModalId || !!stageReveal.current;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<div id="app">
  {#if !topbarHidden}<Topbar />{/if}

  {#if session.screen === 'title'}
    <TitleScreen />
  {:else if session.screen === 'home'}
    <HomeScreen />
  {:else if session.screen === 'scene'}
    <SceneScreen />
  {:else if session.screen === 'clear'}
    <ClearScreen />
  {:else if session.screen === 'notebook'}
    <NotebookScreen />
  {/if}
</div>

<HistOverlay />
<CardModal />
<StageReveal />
<DialogHost />
<Toast />
