<script lang="ts">
  import { useStores } from '../stores';
  import { monSvg } from '../art/icons';
  import { faceArt } from '../art/face';
  import { startChapter } from '../nav';

  const stores = useStores();
  const { work, save, session, toast, exitToWorks, exitToAccounts } = stores;
  const s = work.strings;

  // The reader already chose who they are (App's account screen), so this button
  // only asks 「この作品を、いま はじめる／つづける」.
  const started = $derived(
    !!save.active && (Object.keys(save.active.progress).length > 0 || !!save.active.scene),
  );

  // ★6 「見せてから問う」：だれもが 知る 顔を まず見せ、読む前に タップさせる。
  // 顔ぶれは作品データ（work.titleKnownFaces）。タップの報酬はトースト1行ではなく
  // 人物カードそのもの＝最初の操作で「ちゃんと 返ってくる」体験にする。
  const knownFaces = (work.titleKnownFaces ?? [])
    .filter((id) => !!work.faces?.[id] && !!work.cards[id])
    .map((id) => ({ id, name: work.cards[id].name }));
  const heroId = work.protagonistId;
  const showFaces = $derived(knownFaces.length > 0 && !!work.faces?.[heroId]);
  const facesLead = s.titleFacesLead ?? 'まず、この 顔を タップして みて——';

  function tapKnown(id: string) {
    session.openCard(id);
  }
  function tapHero() {
    const nm = work.cards[heroId]?.name ?? 'この人';
    toast.show(s.titleHeroTease ?? `そう、この人。${nm}。この 物語の 主人公だ。→ はじめて みよう`);
  }

  // 「はじめる」で年代記（＝7章の目次。6章はロック）を挟むと、物語の1文目より先に
  // 目次が出る（docs/design/engagement.md §2 A-3）。初見はそのまま第1章へ入れる。
  // 再訪（つづきから）は章を選び直せたほうがよいので年代記のまま。
  function start() {
    const first = work.story.chapters[0];
    if (!started && first) startChapter(stores, first.id);
    else session.show('home');
  }
</script>

<section class="screen active" id="title">
  <div class="title-inner">
    <div class="title-mon" id="title-mon">{@html monSvg(work.mon)}</div>
    <p class="title-eyebrow">{s.eyebrow}</p>
    <h1 class="title-main">{@html s.titleMain}</h1>
    <p class="title-sub">{s.titleSub}</p>
    {#if s.titleHook}
      <!-- 入口のフック。謎より先に、知識ゼロで刺さる具体を置く（engagement.md §2）。 -->
      <p class="title-hook">{@html s.titleHook}</p>
    {/if}
    <p class="title-years">{s.years}</p>
    {#if showFaces}
      <!-- ★6 見せてから問う。知ってる顔→謎の顔の順に並べ、読む前にタップさせる。 -->
      <div class="title-faces">
        <div class="tf-lead">{facesLead}</div>
        <div class="tf-row">
          {#each knownFaces as f (f.id)}
            <button class="tf-item known" onclick={() => tapKnown(f.id)} aria-label={f.name}>
              <span class="tf-face">{@html faceArt(f.id, work.faces)}</span>
              <span class="tf-name">{f.name}</span>
            </button>
          {/each}
          <span class="tf-vs">では…</span>
          <button class="tf-item hero" onclick={tapHero} aria-label="この人は だれ？">
            <span class="tf-face">{@html faceArt(heroId, work.faces)}</span>
            <span class="tf-name">この人は？</span>
          </button>
        </div>
      </div>
    {/if}
    <div class="title-riddle">
      <span class="lead">{s.riddleLead}</span>
      <p id="title-riddle-text">{@html work.riddle}</p>
      {#if s.riddleHeart}
        <!-- ★F 小5向けの情緒的な縦糸（抽象的な謎と併走させ、両学年に効かせる）。 -->
        <p class="riddle-heart">{@html s.riddleHeart}</p>
      {/if}
    </div>
    <div class="title-actions">
      <button class="btn btn-primary" onclick={start}>{started ? 'つづきから' : 'はじめる'}</button>
    </div>
    <p class="title-note">{@html s.titleNote}</p>
    <div class="title-back">
      {#if exitToWorks}
        <button class="linklike" onclick={exitToWorks}>← ほかの 作品を えらぶ</button>
      {:else}
        <button class="linklike" onclick={exitToAccounts}>← だれで あそぶ？</button>
      {/if}
    </div>
  </div>
</section>

<style>
  .title-back {
    margin-top: 20px;
  }
</style>
