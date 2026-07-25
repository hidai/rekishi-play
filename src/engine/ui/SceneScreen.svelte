<script lang="ts">
  import { untrack } from 'svelte';
  import { useStores } from '../stores';
  import { buildSceneMap } from '../map/sceneMap';
  import { buildMainVisual } from '../mainVisual';
  import { faceArt } from '../art/face';
  import { inlineFaces } from '../inlineFaces';
  import { confidenceInfo } from '../confidence';
  import { observeProgress } from '../observe';
  import { applySceneEnter, chooseNext, gotoScene, finishChapter } from '../story';
  import { choiceOrder } from '../order';
  import { stageMoment } from '../stage';
  import { heroRubyHtml } from '../hero';
  import { stageReveal } from '../stagereveal.svelte';
  import { sfx } from '../sfx.svelte';
  import SceneMap from './SceneMap.svelte';
  import MeterBar from './MeterBar.svelte';
  import MinigamePanel from './MinigamePanel.svelte';
  import ObservePanel from './ObservePanel.svelte';

  const stores = useStores();
  const { work, session, save, toast } = stores;

  const chapter = $derived(work.story.chapters.find((c) => c.id === session.ch));
  const sc = $derived(chapter && session.scene ? chapter.scenes[session.scene] : null);
  // ★O メインビジュアルはシーンの主語で選ぶ：「だれ・想い」の場面（Scene.closeup）は
  // 対面の場（人物のクローズアップ）、それ以外は読み解き地図。顔タップの委譲は共通。
  const svg = $derived(
    session.ch != null && session.scene && sc
      ? buildMainVisual(work, session.ch, session.scene, sc)
      : '',
  );
  // 選択肢の表示順（シーン入場ごとにシャッフル）。「正解が同じ位置に並ぶ」パターンを消し、
  // 選ぶ瞬間の緊張感を保つ。chooseNext へは元 index を渡すのでデータ・セーブは不変。
  const order = $derived(sc?.choices ? choiceOrder(sc.choices.length) : []);
  // Body text with `<face pid>` markup expanded into inline face chips (engine/inlineFaces).
  const sceneTextHtml = $derived(sc ? inlineFaces(sc.text, work.faces, work.cards) : '');

  // Delegated taps for inline face chips: one listener on .scene-text catches clicks
  // on any [data-face-pid] child (the chips come from {@html}, so per-element Svelte
  // handlers cannot attach). The inner <button> keeps keyboard/focus for free.
  function faceTaps(node: HTMLElement) {
    const onClick = (e: Event) => {
      const el = (e.target as HTMLElement).closest?.('[data-face-pid]') as HTMLElement | null;
      const pid = el?.dataset.facePid;
      if (pid) session.openCard(pid);
    };
    node.addEventListener('click', onClick);
    return { destroy: () => node.removeEventListener('click', onClick) };
  }
  // Protagonist display name via the canonical engine helper (see engine/hero.ts).
  const heroRuby = $derived(heroRubyHtml(work));
  // ★M ミニゲームを完了したシーン id（next のロック解除）。
  // フラグでなく「どのシーンで完了したか」を持つことで、シーン切替時のリセット処理と
  // 描画→$effect の順序による一瞬のロック抜けの両方を不要にする。
  let mgDoneScene = $state<string | null>(null);
  const mgDone = $derived(mgDoneScene === session.scene);

  // ★Q 観察ビュー。見つけたものはセーブに載る（作品全体・章をまたぐ gate の材料）が、
  // 「とばした」は mgDoneScene と同じくシーン id で持つ（真偽フラグだとシーン切替の一瞬に
  // ロックが抜ける）。
  let obSkipScene = $state<string | null>(null);
  const obFound = $derived(save.active?.observed ?? []);
  const obProg = $derived(sc?.observe ? observeProgress(sc.observe, obFound) : null);
  const obDone = $derived(!obProg || obProg.done || obSkipScene === session.scene);

  function obFind(id: string) {
    const spec = sc?.observe;
    if (!spec) return;
    const before = observeProgress(spec, save.active?.observed ?? []);
    if (!save.observeFind(id)) return; // 既得＝掃きと印タップの二重発火。音は鳴らさない。
    sfx.card();
    const after = observeProgress(spec, save.active?.observed ?? []);
    // 必須が揃った瞬間だけ、拾い音のあとに解錠の一声を重ねる（SortPanel の完成音と同じ語彙）。
    if (!before.done && after.done) setTimeout(() => sfx.correct(), 300);
  }

  // シーンに入るたびに副作用（付与・保存・トースト・facehint）。
  // untrack で ch/scene の変化だけをトリガにする（付与による db 変化で再発火させない）。
  $effect(() => {
    const ch = session.ch;
    const scene = session.scene;
    if (ch == null || scene == null) return;
    untrack(() => {
      applySceneEnter(stores, ch, scene);
      maybeFaceHint(ch, scene);
      maybeStageReveal(ch, scene);
      maybeSceneReveal(ch, scene);
      maybeCreedSound(ch, scene);
    });
    try {
      window.scrollTo({ top: 0 });
    } catch {
      /* noop */
    }
  });

  // ★G 人生ステージの見せ場。章冒頭で顔が前章と変わったら大きく1枚出す。
  // 遊んでいる子×章で一度きり（戻る/再開での再表示を防ぐ）。
  // One-time UI flag key in localStorage, namespaced per work (flagPrefix keeps
  // hidenaga's historical 'hd_*' keys). Single derivation for all one-time reveals.
  function flagKey(kind: string, suffix: string | number): string {
    return `${work.flagPrefix ?? work.id}_${kind}_${stores.accounts.active?.id ?? '?'}_${suffix}`;
  }

  function maybeStageReveal(ch: number, scene: string) {
    const m = stageMoment(work, ch, scene);
    if (!m) return;
    const key = flagKey('stage', ch);
    let seen = false;
    try {
      seen = !!localStorage.getItem(key);
    } catch {
      /* noop */
    }
    if (seen) return;
    try {
      localStorage.setItem(key, '1');
    } catch {
      /* noop */
    }
    setTimeout(() => {
      stageReveal.show(m);
      sfx.stage();
    }, 260);
  }

  // ★N シーン付きの全画面インタースティシャル（Scene.reveal）。急報など"感情の山"を
  // 通常レイアウトの外で一度だけ立てる。プロフィール×シーンで一度きり。
  function maybeSceneReveal(ch: number, scene: string) {
    const r = work.story.chapters.find((c) => c.id === ch)?.scenes[scene]?.reveal;
    if (!r) return;
    const key = flagKey('reveal', `${ch}_${scene}`);
    let seen = false;
    try {
      seen = !!localStorage.getItem(key);
    } catch {
      /* noop */
    }
    if (seen) return;
    try {
      localStorage.setItem(key, '1');
    } catch {
      /* noop */
    }
    setTimeout(() => {
      stageReveal.show({ faceKey: r.face ?? '', title: r.title, caption: r.caption, tone: r.tone });
      if (r.tone === 'crisis') sfx.crisis();
      else sfx.stage();
    }, 260);
  }

  // ★K 秀長の信条が出るシーンでは、筆を置くような決意音を少し遅れて鳴らす。
  function maybeCreedSound(ch: number, scene: string) {
    const s = work.story.chapters.find((c) => c.id === ch)?.scenes[scene];
    if (s?.creed) setTimeout(() => sfx.creed(), 420);
  }

  function maybeFaceHint(ch: number, scene: string) {
    const s0 = work.story.chapters.find((c) => c.id === ch)?.scenes[scene];
    if (s0?.closeup || s0?.figure || s0?.study) return; // no map shown → the "tap the map face" hint would mislead
    const s = buildSceneMap(work, ch, scene);
    if (!s.includes('class="mapface"')) return;
    let seen = false;
    try {
      seen = !!localStorage.getItem(work.faceHintKey);
    } catch {
      /* noop */
    }
    if (!seen) {
      setTimeout(() => toast.show('地図の 顔を タップすると その人を もっと 知れる'), 2300);
      try {
        localStorage.setItem(work.faceHintKey, '1');
      } catch {
        /* noop */
      }
    }
  }
</script>

<section class="screen active" id="scene">
  <div class="wrap">
    <div class="scene-stage">
      <!-- ★1 メーター HUD。{#key} の外に置き、シーンをまたいで幅を滑らかに変化させる。 -->
      <!-- ★C/★F 最初のシーンから"育てる"枠組みを見せる（未加算でも枠だけ表示）。 -->
      {#if work.meters}
        <MeterBar variant="hud" />
      {/if}
      {#if sc && session.ch != null && session.scene}
        <!-- シーン切替は {#key} で DOM を完全再生成し、clipPath id 衝突を防ぐ。 -->
        {#key session.scene}
          <div class="scene-artwrap">
            <SceneMap {svg} observe={sc.observe} found={obFound} onFind={obFind} onSpark={() => sfx.clue()} />
          </div>
          <!-- 「いつ・どこ」の宣言。年は章の years（西暦）＝今どのあたりを生きているかを常に見せる。 -->
          <div class="scene-place">
            {#if chapter?.years}
              <span class="scene-when"><ruby>西暦<rt>せいれき</rt></ruby> {chapter.years}</span>
            {/if}
            {#if sc.place}<span class="scene-where">{@html sc.place}</span>{/if}
          </div>
          {#if sc.observe}
            <!-- ★Q 観察ビュー。絵に触れる装置なので本文より前＝絵のすぐ下に置く（見てから読む）。 -->
            <ObservePanel spec={sc.observe} found={obFound} />
          {/if}
          <div class="scene-text" use:faceTaps>{@html sceneTextHtml}</div>

          {#if sc.mentions?.length}
            <!-- Face chips for people named in the text but with no other visual anchor this scene. -->
            <div class="scene-mentions">
              {#each sc.mentions as pid (pid)}
                {#if work.faces[pid] && work.cards[pid]}
                  <button class="scene-mention" onclick={() => session.openCard(pid)}>
                    <span class="scene-mention-face">{@html faceArt(pid, work.faces)}</span>
                    <span class="scene-mention-name">{work.cards[pid].name}</span>
                  </button>
                {/if}
              {/each}
            </div>
          {/if}

          {#if sc.monologue}
            <!-- ★3 秀長の内心のひとこと。主役に感情を持たせ「自分ごと」感を上げる。 -->
            <div class="monologue"><span class="mono-mark" aria-hidden="true">💭</span><span class="mono-text">{@html sc.monologue}</span></div>
          {/if}

          <!-- ★Sureness mark (◎○△☆): how strongly records support the claim, label always attached. -->
          {#snippet confBadge(info: NonNullable<ReturnType<typeof confidenceInfo>>)}
            <span class="conf-badge" data-mark={info.mark} title="{info.mark} {info.label}：{info.blurb}">
              <span class="conf-mark">{info.mark}</span><span class="conf-label">{info.label}</span>
            </span>
          {/snippet}

          {#if sc.spark}
            {@const info = confidenceInfo(sc.deep?.confidence)}
            <!-- ★4「えっ！？」露出。畳まれた諸説・史料の目玉を本文横に出し、深掘りへ誘う。 -->
            <div class="spark">
              <span class="spark-badge">えっ！？</span>
              <div class="spark-body">
                <p class="spark-text">{@html sc.spark}</p>
                {#if info}<p class="spark-conf">{@render confBadge(info)}</p>{/if}
                {#if sc.deep}<p class="spark-hint">🔍 下の「もっと深く」で たしかめて みよう</p>{/if}
              </div>
            </div>
          {/if}

          {#if sc.deep}
            {@const info = sc.spark ? undefined : confidenceInfo(sc.deep.confidence)}
            <details class="deep">
              <summary>🔍 もっと深く{#if info}{@render confBadge(info)}{/if}<span class="chev">›</span></summary>
              <div class="deep-body">
                {#if sc.deep.q}<span class="q">{@html sc.deep.q}</span>{/if}{@html sc.deep.body}{#if sc.deep.cite}<cite>{@html sc.deep.cite}</cite>{/if}
              </div>
            </details>
          {/if}

          {#if sc.minigame}
            <!-- ★M 段取りミニゲーム。「読む」だけの段取りを、手で組み上げて体感する。 -->
            <MinigamePanel game={sc.minigame} onDone={() => (mgDoneScene = session.scene)} />
          {/if}

          {#if sc.creed}
            <!-- ★K 秀長の「信条」＝負の定義（記録に残らない）に対する"正の定義"を1枚立てる。 -->
            <div class="creed">
              <div class="creed-head"><span class="creed-brush" aria-hidden="true">🖋</span>{@html heroRuby}の <ruby>信条<rt>しんじょう</rt></ruby></div>
              <p class="creed-line">{@html sc.creed.line}</p>
              <p class="creed-act">{@html sc.creed.act}</p>
            </div>
          {/if}

          {#if sc.showClues}
            <!-- ★N 集めた手がかりをその場に並べる（終章の答え合わせ等）。手帳を開かずに推論の材料を見せる。 -->
            <div class="scene-clues">
              {#each Object.entries(work.clues).filter(([id]) => save.active?.clues.includes(id)) as [id, clue] (id)}
                <div class="scene-clue"><span class="scene-clue-ic" aria-hidden="true">🔑</span><span>{@html clue.text}</span></div>
              {/each}
            </div>
          {/if}

          {#if sc.choices}
            <div class="choices">
              <div class="choices-q">{@html sc.q || 'きみなら どうする？'}</div>
              {#each order as oi, i (oi)}
                {@const c = sc.choices[oi]}
                <button class="choice" onclick={() => chooseNext(stores, session.ch!, session.scene!, oi)}>
                  <span class="num">{i + 1}</span>{@html c.label}
                </button>
              {/each}
            </div>
          {:else if sc.end}
            <div class="scene-next">
              <button class="btn btn-gold" onclick={() => finishChapter(stores, session.ch!)}>この章を おえる →</button>
            </div>
          {:else if sc.minigame && !mgDone}
            <!-- ★M ミニゲーム完成まで「つづき」をロック（とばす逃げ道つき）。 -->
            <div class="scene-next mg-gate">
              <button class="btn btn-primary" disabled>「{@html sc.minigame.title}」が できたら 進める</button>
              <button class="linklike mg-skip" onclick={() => (mgDoneScene = session.scene)}>とばして 進む</button>
            </div>
          {:else if sc.observe && !obDone}
            <!-- ★Q 必須の気づきが揃うまで「つづき」をロック（★M と同じ、とばす逃げ道つき）。 -->
            <div class="scene-next mg-gate">
              <button class="btn btn-primary" disabled>
                気づきを あと {(obProg?.need ?? 0) - (obProg?.got ?? 0)} つ 見つけると 進める
              </button>
              <button class="linklike mg-skip" onclick={() => (obSkipScene = session.scene)}>とばして 進む</button>
            </div>
          {:else}
            <div class="scene-next">
              <button class="btn btn-primary" onclick={() => { sfx.page(); sc.next && gotoScene(session, sc.next); }}>つづき →</button>
            </div>
          {/if}
        {/key}
      {/if}
    </div>
  </div>
</section>
