<script lang="ts">
  import { untrack } from 'svelte';
  import type { ObserveSpec } from '../types';
  import { foundInOrder, observeProgress } from '../observe';

  // ★Q 観察ビューの本文側。レンズと印は絵の上（SceneMap のオーバーレイ）、問い・進捗・
  // 拾ったものはここ。キャプションを SVG に描けない（<text> は <ruby> を運べない）ので、
  // ふりがなの要る文字列はすべてこちら側が HTML で描く（engine/art/observe.ts のヘッダ）。
  let { spec, found }: { spec: ObserveSpec; found: readonly string[] } = $props();

  // 「この訪問で見つけたもの」＝入場時の集合との差。本体は {#key session.scene} の中に
  // 置かれるので、シーンを移ればここも作り直される＝リセット処理は要らない
  // （MinigamePanel と同じ前提）。再訪時に全部が"いま見つけた"風に光るのを防ぐ。
  // untrack ＝「入場時の一枚」を撮るのが目的で、追従させないことが仕様（後から found が
  // 伸びても atEntry は動かない）。
  const atEntry = new Set(untrack(() => found));

  const prog = $derived(observeProgress(spec, found));
  // トレイはこのシーンの hotspot を「拾った順」で並べる（found は作品全体の集合なので絞る）。
  // 番号は絵の上の印と同じ（engine/observe.ts の foundInOrder が唯一の物差し）＝いま押した印の
  // 説明がどれかが、順番と番号の両方で分かる。最後の1件は「いま」バッジで名指しする。
  const tray = $derived(foundInOrder(spec, found));
</script>

<div class="observe">
  <div class="ob-head">
    <span class="ob-ic" aria-hidden="true">🔎</span>
    <span class="ob-prompt">{@html spec.prompt}</span>
  </div>
  <p class="ob-how">絵を ゆびで なでて、光った ところを タップ</p>

  {#if prog.need}
    <div class="ob-dots" role="status" aria-label="気づき {prog.got} / {prog.need}">
      {#each Array.from({ length: prog.need }) as _, i (i)}
        <span class="ob-dot" class:on={i < prog.got} aria-hidden="true"></span>
      {/each}
      <span class="ob-count">{prog.got} / {prog.need}</span>
    </div>
  {/if}

  {#if tray.length}
    <ul class="ob-tray">
      {#each tray as h, i (h.id)}
        <li class="ob-item" class:is-new={!atEntry.has(h.id)} class:is-latest={i === tray.length - 1 && !atEntry.has(h.id)}>
          <span class="ob-item-no" aria-hidden="true">{i + 1}</span>
          <span class="ob-item-text">
            {@html h.caption}{#if i === tray.length - 1 && !atEntry.has(h.id)}<span class="ob-now">いま 見つけた</span>{/if}
          </span>
        </li>
      {/each}
    </ul>
  {/if}
</div>
