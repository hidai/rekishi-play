<script lang="ts">
  import { useStores } from '../stores';
  import { monSvg } from '../art/icons';
  import { startChapter } from '../nav';

  const stores = useStores();
  const { work, save, session, exitToWorks, exitToAccounts } = stores;
  const s = work.strings;

  // The reader already chose who they are (App's account screen), so this button
  // only asks 「この作品を、いま はじめる／つづける」.
  const started = $derived(
    !!save.active && (Object.keys(save.active.progress).length > 0 || !!save.active.scene),
  );

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
    <!-- 入口のフック。謎より先に、知識ゼロで刺さる具体を置く（engagement.md §2・§14 型1）。 -->
    <p class="title-hook">{@html s.titleHook}</p>
    <p class="title-years">{s.years}</p>
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
