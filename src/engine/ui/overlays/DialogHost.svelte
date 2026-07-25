<script lang="ts">
  import { tick } from 'svelte';
  import { useStores } from '../../stores';
  import type { DialogService } from '../../dialog.svelte';

  // Screens above the per-work store bundle (account selection) pass their own
  // service; inside a work it comes from context.
  let { dialog: own }: { dialog?: DialogService } = $props();
  const dialog = own ?? useStores().dialog;
  let inputEl = $state<HTMLInputElement | null>(null);
  let value = $state('');

  // 入力ダイアログが開いたら初期値を入れてフォーカス（旧 setTimeout focus）。
  $effect(() => {
    const c = dialog.current;
    if (c?.input) {
      value = c.value ?? '';
      tick().then(() => {
        try {
          inputEl?.focus();
        } catch {
          /* noop */
        }
      });
    }
  });

  function ok() {
    dialog.settle(dialog.current?.input ? value.trim() : '');
  }
  function cancel() {
    dialog.settle(null);
  }
</script>

<!-- 背景クリックで閉じる（旧挙動と同一）。キーボード利用者はボタンで操作する。 -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class="dialog-overlay"
  class:show={!!dialog.current}
  onclick={(e) => {
    if (e.target === e.currentTarget) cancel();
  }}
>
  {#if dialog.current}
    <div class="dialog">
      <div class="dlg-title">{dialog.current.title}</div>
      {#if dialog.current.desc}<p class="dlg-desc">{@html dialog.current.desc}</p>{/if}
      {#if dialog.current.input}
        <input
          class="field dlg-input"
          bind:this={inputEl}
          bind:value
          placeholder={dialog.current.placeholder ?? ''}
          maxlength={dialog.current.maxlength ?? 40}
          autocomplete="off"
          autocapitalize="off"
          onkeydown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              ok();
            }
          }}
        />
      {/if}
      <div class="dlg-actions">
        <button class="btn btn-ghost" onclick={cancel}>{dialog.current.cancel ?? 'やめる'}</button>
        <button class="btn btn-primary" onclick={ok}>{dialog.current.ok ?? 'OK'}</button>
      </div>
    </div>
  {/if}
</div>
