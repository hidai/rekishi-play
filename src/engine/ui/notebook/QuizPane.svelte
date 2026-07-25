<script lang="ts">
  import { onMount } from 'svelte';
  import { useStores } from '../../stores';
  import { faceArt } from '../../art/face';
  import { buildQuestion, personPool, type QuizQuestion } from '../../quiz';
  import { heroName } from '../../hero';
  import { sfx } from '../../sfx.svelte';

  const { work, save, session, toast } = useStores();

  let q = $state<QuizQuestion | null>(null);
  let wrong = $state<string[]>([]); // この問題で外した選択肢
  let solved = $state(false);
  let right = $state(0);
  let total = $state(0);
  let streak = $state(0);
  let best = $state(0);

  const poolCount = $derived(personPool(work, save.active?.cards).length);
  const heroShort = heroName(work);

  function next() {
    q = buildQuestion(
      work,
      save.active?.cards,
      Math.random,
      q?.answerId ?? undefined,
      save.active?.progress,
    );
    wrong = [];
    solved = false;
  }
  onMount(next);

  function answer(id: string) {
    if (!q || solved || wrong.includes(id)) return;
    if (id === q.answerId) {
      const firstTry = wrong.length === 0;
      solved = true;
      total += 1;
      if (firstTry) {
        right += 1;
        streak += 1;
        if (streak > best) best = streak;
        // 連続正解の節目をきちんと祝う（想起の反復に報酬を返す）。
        if (streak === 3) toast.show('🔥 3もん れんぞく！ その ちょうし！');
        else if (streak === 5) {
          toast.show('🔥🔥 5もん れんぞく！ おみごと！');
          sfx.clear();
        } else if (streak === 10) {
          toast.show('👑 10もん れんぞく！ でんせつ級！');
          sfx.clear();
        }
      } else {
        streak = 0;
      }
      sfx.correct();
    } else {
      wrong = [...wrong, id];
      streak = 0;
      sfx.wrong();
    }
  }

  // 章 id（文字列）→ 表示ラベル（信条あて用）。
  function chapterOf(id: string) {
    return work.story.chapters.find((c) => String(c.id) === id);
  }
  function chLabel(id: string): string {
    const n = Number(id);
    return n === work.totalChapters ? '終章' : '第' + n + '章';
  }

  const answerCard = $derived(q && work.cards[q.answerId] ? work.cards[q.answerId] : null);
  const isPersonAnswer = $derived(!!q && q.mode !== 'creedToChapter');
</script>

<div class="tabpane active quizpane" id="pane-quiz">
  {#if q === null}
    <div class="quiz-empty">
      <div class="quiz-empty-ico" aria-hidden="true">🎴</div>
      <p>人物カードを <b>2まい 以上</b> 集めると、<br /><b>クイズ</b>で あそべるよ。</p>
      <p class="quiz-empty-sub">いま {poolCount}まい。物語を すすめて、なかまを 集めよう。</p>
    </div>
  {:else}
    <div class="quiz-head">
      <span class="quiz-score">せいかい <b>{right}</b> / {total}</span>
      {#if streak >= 2}<span class="quiz-streak">🔥 {streak}れんぞく！</span>
      {:else if best >= 3}<span class="quiz-best">きろく {best}れんぞく</span>{/if}
    </div>

    {#if q.mode === 'faceToName'}
      <div class="quiz-prompt">この 顔は だれ？</div>
      <div class="quiz-face big">{@html faceArt(q.answerId, work.faces)}</div>
      <div class="quiz-options names">
        {#each q.optionIds as id (id)}
          <button
            class="quiz-opt name"
            class:correct={solved && id === q.answerId}
            class:wrong={wrong.includes(id)}
            disabled={solved || wrong.includes(id)}
            onclick={() => answer(id)}>{work.cards[id].name}</button>
        {/each}
      </div>
    {:else if q.mode === 'nameToFace'}
      <div class="quiz-prompt">「<b>{work.cards[q.answerId].name}</b>」の 顔は どれ？</div>
      <div class="quiz-options faces">
        {#each q.optionIds as id (id)}
          <button
            class="quiz-opt face"
            class:correct={solved && id === q.answerId}
            class:wrong={wrong.includes(id)}
            disabled={solved || wrong.includes(id)}
            onclick={() => answer(id)}>
            <span class="quiz-face">{@html faceArt(id, work.faces)}</span>
            <!-- 外した顔にも名前を開示：誤答をその場で学びに変える。 -->
            {#if solved && id === q.answerId}<span class="quiz-optname">{work.cards[id].name}</span>
            {:else if wrong.includes(id)}<span class="quiz-optname wrongname">{work.cards[id].name}</span>{/if}
          </button>
        {/each}
      </div>
    {:else if q.mode === 'creedToChapter'}
      <div class="quiz-prompt">この ことばを 心に きめたのは、どの 章？</div>
      <blockquote class="quiz-creed">{@html q.prompt}</blockquote>
      <div class="quiz-options names">
        {#each q.optionIds as id (id)}
          {@const c = chapterOf(id)}
          <button
            class="quiz-opt name chapter"
            class:correct={solved && id === q.answerId}
            class:wrong={wrong.includes(id)}
            disabled={solved || wrong.includes(id)}
            onclick={() => answer(id)}>{chLabel(id)}{#if c}<span class="quiz-opt-cht">{@html c.title}</span>{/if}</button>
        {/each}
      </div>
    {:else}
      <div class="quiz-prompt">きみ（{heroShort}）の 「<b>{q.prompt}</b>」に あたるのは だれ？</div>
      <div class="quiz-options faces">
        {#each q.optionIds as id (id)}
          <button
            class="quiz-opt face"
            class:correct={solved && id === q.answerId}
            class:wrong={wrong.includes(id)}
            disabled={solved || wrong.includes(id)}
            onclick={() => answer(id)}>
            <span class="quiz-face">{@html faceArt(id, work.faces)}</span>
            <!-- 外した顔にも名前を開示：誤答をその場で学びに変える。 -->
            {#if solved && id === q.answerId}<span class="quiz-optname">{work.cards[id].name}</span>
            {:else if wrong.includes(id)}<span class="quiz-optname wrongname">{work.cards[id].name}</span>{/if}
          </button>
        {/each}
      </div>
    {/if}

    {#if solved}
      <div class="quiz-result">
        {#if isPersonAnswer && answerCard}
          <div class="quiz-result-line">せいかい！ <b>{answerCard.name}</b>{#if answerCard.read}（{answerCard.read}）{/if}</div>
          <div class="quiz-result-actions">
            <button class="linklike" onclick={() => session.openCard(q!.answerId)}>この人を もっと 見る</button>
            <button class="btn btn-primary" onclick={next}>つぎへ →</button>
          </div>
        {:else}
          <div class="quiz-result-line">せいかい！ <b>{chLabel(q.answerId)}</b>{#if chapterOf(q.answerId)}「{@html chapterOf(q.answerId)!.title}」{/if}</div>
          <div class="quiz-result-actions">
            <button class="linklike" onclick={() => session.openNotebook('creeds')}>ことばを ぜんぶ 見る</button>
            <button class="btn btn-primary" onclick={next}>つぎへ →</button>
          </div>
        {/if}
      </div>
    {/if}
  {/if}
</div>
