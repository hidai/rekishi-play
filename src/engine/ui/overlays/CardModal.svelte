<script lang="ts">
  import { useStores } from '../../stores';
  import { faceArt } from '../../art/face';
  import { scrollIcon } from '../../art/icons';

  const { work, session, crosswork } = useStores();
  const card = $derived(session.cardModalId ? work.cards[session.cardModalId] : null);
  const icon = $derived(
    card ? (card.type === 'person' ? faceArt(session.cardModalId!, work.faces) : scrollIcon()) : '',
  );
  // 他の作品にも出てくる人。本文は並べるだけで、地の文の説明は足さない
  // （docs/design/cross-work.md）。
  const peers = $derived(session.cardModalId ? crosswork.peers(work.id, session.cardModalId) : []);
  $effect(() => {
    if (session.cardModalId) void crosswork.prefetch(work.id, session.cardModalId);
  });
</script>

<!-- 背景クリックで閉じる（旧 modal-overlay の挙動）。 -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class="modal-overlay"
  class:show={!!card}
  onclick={(e) => {
    if (e.target === e.currentTarget) session.closeCard();
  }}
>
  {#if card}
    <div class="modal {card.type}">
      <div class="modal-top">{@html icon}</div>
      <div class="modal-kind">{card.type === 'person' ? '人物カード' : 'ことばカード'}</div>
      <div class="modal-name">{card.name}</div>
      {#if card.read}<div class="modal-read">{card.read}</div>{/if}
      <div class="modal-text">{@html card.text}</div>
      <!-- 橋は本文のすぐ下に置く。並置は隣り合っていて初めて効く（写真をはさむと別々の話に見える）。 -->
      {#each peers as peer (peer.workId)}
        <div class="modal-bridge">
          {#if peer.card}
            <!-- 「きみ」を相手作品の主人公に繋ぎ直す一行。相手のカード本文は相手の読者に
                 向けて書かれており（『政子』の頼朝＝「きみの 夫」）、ただ並べると二人称が
                 こちらの主人公を指してしまう。作品名＝主人公名なのでこの形で足りる。 -->
            <div class="bridge-work">きみが 『{@html peer.title}』だった なら</div>
            {#if peer.card.name !== card.name}
              <div class="bridge-name">{peer.card.name}</div>
              {#if peer.card.read}<div class="bridge-read">{peer.card.read}</div>{/if}
            {/if}
            <div class="bridge-text">{@html peer.card.text}</div>
          {:else}
            <div class="bridge-invite">この 人は 『{@html peer.title}』にも 出て くる。</div>
          {/if}
        </div>
      {/each}
      {#if card.photo}
        <figure class="card-photo">
          <img src={card.photo.src} alt={card.photo.alt} loading="lazy" />
          <figcaption>{@html card.photo.credit}</figcaption>
        </figure>
      {/if}
      <button class="btn btn-primary modal-close" onclick={() => session.closeCard()}>とじる</button>
    </div>
  {/if}
</div>
