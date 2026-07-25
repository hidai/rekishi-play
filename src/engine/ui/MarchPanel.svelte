<script lang="ts">
  import { untrack } from 'svelte';
  import type { MarchMinigame, MarchPrep } from '../types';
  import { initMarch, togglePrep, startRun, playDay, retryMarch } from '../minigame';
  import { sfx } from '../sfx.svelte';

  // march ミニゲーム（「数字が反撃してくる」行軍）。準備→行軍→クリア/失敗→リトライを
  // 1画面で完結させる。{#key session.scene} 配下なので再入場で初期状態へ戻る（保存しない）。
  let { game, onDone }: { game: MarchMinigame; onDone: () => void } = $props();

  // game はマウント中は不変（シーン再入場で {#key} により再マウント）。初期値の取得を明示。
  let st = $state(untrack(() => initMarch(game)));
  // Track the last played pace + distance so the daily log can narrate cause->effect.
  let lastPaceId = $state('');
  let lastGain = $state(-1); // -1 = no day played yet

  const shielded = $derived(game.preps.some((p) => st.picked.includes(p.id) && !!p.fx.rainShield));
  const rainToday = $derived(game.rainDay != null && st.day === game.rainDay);
  // 転倒（休むしかない）判定は疲労で見る：プレイ前から UI に反映する必要があるため。
  const mustRest = $derived(st.phase === 'run' && st.fatigue >= game.collapseAt);
  const goalPct = $derived(Math.min(100, (st.km / game.goalKm) * 100));

  function toggle(id: string) {
    st = togglePrep(game, st, id);
    sfx.choice();
  }
  function start() {
    if (st.picked.length !== game.prepPicks) return;
    st = startRun(game, st);
    sfx.choice();
  }
  function retry() {
    st = retryMarch(game, st);
    lastPaceId = '';
    lastGain = -1;
    sfx.choice();
  }
  function choosePace(id: string) {
    const prev = st;
    const next = playDay(game, st, id);
    if (next === prev) return; // guard / rejected — no state change
    lastPaceId = id;
    lastGain = next.km - prev.km;
    st = next;
    const ev = st.lastEvents;
    if (st.phase === 'clear') {
      sfx.card();
      onDone(); // クリア時のみ「つづき」を解錠
    } else if (st.phase === 'fail') {
      sfx.wrong();
    } else if (ev.some((e) => e.startsWith('depot:'))) {
      sfx.card();
    } else if (ev.includes('collapse') || ev.includes('hungry')) {
      sfx.wrong();
    } else {
      sfx.choice();
    }
  }

  // --- route helpers (the labeled road shown in both prep and run) ---
  const pct = (at: number) => (at / game.goalKm) * 100;
  // Anchor middle labels centered, the first/last to the track ends.
  const anchor = (at: number) => (at <= 0 ? '0' : at >= game.goalKm ? '-100%' : '-50%');
  // Leading emoji of a prep label — used to badge its place/pace on the route & buttons.
  const prepEmoji = (label: string) => Array.from(label)[0] ?? '📦';
  /** Emoji of a picked depot prep whose depotAt sits on this landmark (empty if none). */
  function depotEmojiAt(at: number): string {
    const p = game.preps.find((x) => st.picked.includes(x.id) && x.fx.depotAt === at);
    return p ? prepEmoji(p.label) : '';
  }
  /** A picked prep that lowers this pace's fatigue (e.g. torches on the dash). */
  function paceBoostPrep(paceId: string): MarchPrep | undefined {
    return game.preps.find((p) => st.picked.includes(p.id) && (p.fx.paceFatigueDelta?.[paceId] ?? 0) < 0);
  }

  /** Rain-adjusted km for a pace button label (info is never hidden to make you lose). */
  function shownKm(km: number): number {
    return rainToday && !shielded ? Math.floor(km / 2) : km;
  }
  function depotPlace(prepId: string): string {
    const at = game.preps.find((p) => p.id === prepId)?.fx.depotAt;
    return game.landmarks?.find((l) => l.at === at)?.label ?? '拠点';
  }
  function depotHit(prepId: string): string {
    const p = game.preps.find((x) => x.id === prepId);
    return p?.hitLog ?? `📦 ${depotPlace(prepId)}で 兵糧を 満タンに！`;
  }
  /** One-line, always-present log for the day just played (makes every prep visible). */
  const logLine = $derived.by(() => {
    if (lastGain < 0) return '';
    const ev = st.lastEvents;
    const msgs: string[] = [];
    if (ev.includes('rain')) {
      const boat = game.preps.find((p) => st.picked.includes(p.id) && p.fx.rainShield);
      msgs.push(shielded ? (boat?.hitLog ?? '🚣 増水した 川を 舟で わたった！') : '🌊 雨で 川が 増水…遠回りで 歩みが にぶった');
    }
    for (const e of ev) if (e.startsWith('depot:')) msgs.push(depotHit(e.slice(6)));
    const boost = paceBoostPrep(lastPaceId);
    if (boost && !ev.includes('collapse')) msgs.push(boost.hitLog ?? '✨ 準備が 効いて つかれ 軽め');
    if (ev.includes('collapse')) msgs.push(`😵 兵が つかれで たおれた…（兵 −${game.collapseTroopLoss}）`);
    if (ev.includes('hungry')) msgs.push(`😖 腹ぺこで 兵が 弱った…（兵 −${game.hungryTroopLoss}）`);
    if (!msgs.length) msgs.push(lastGain > 0 ? `🏃 きょうは ${lastGain}km 進んだ` : '💤 ひと休みで つかれを とった');
    return msgs.join('　');
  });
  const failMessage = $derived(
    st.failReason === 'army' ? (game.failArmy ?? '軍が 崩れて しまった——。') : (game.failLate ?? '間に合わなかった——。'),
  );

  // The result verdict element. On win/lose we scroll it into view so the outcome
  // lands where the eye is, instead of the panel silently swapping under the player.
  let resultEl = $state<HTMLElement>();
  $effect(() => {
    if ((st.phase === 'clear' || st.phase === 'fail') && resultEl) {
      const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
      resultEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }
  });
</script>

<!-- 道のり（準備＝プレビュー／行軍＝走者つき）。地名ラベルと、準備した補給地の目印を出す。 -->
{#snippet route(running: boolean)}
  <div class="mc-route" class:prep={!running}>
    <div class="mc-track">
      {#if running}<div class="mc-fill" style="width:{goalPct}%"></div>{/if}
      {#each game.landmarks ?? [] as lm (lm.at)}
        <span class="mc-mark" class:reached={running && st.km >= lm.at} class:depot={!!depotEmojiAt(lm.at)} style="left:{pct(lm.at)}%"></span>
      {/each}
      {#if running}<span class="mc-runner" style="left:{goalPct}%" aria-hidden="true">🏃</span>{/if}
    </div>
    <div class="mc-mark-labels">
      {#each game.landmarks ?? [] as lm (lm.at)}
        {@const emoji = depotEmojiAt(lm.at)}
        <span class="mc-mark-label" class:armed={!!emoji} class:passed={running && st.km >= lm.at} style="left:{pct(lm.at)}%; transform:translateX({anchor(lm.at)})">
          {#if emoji}<span class="mc-mark-emoji" aria-hidden="true">{emoji}</span>{/if}{lm.label}
        </span>
      {/each}
    </div>
  </div>
{/snippet}

<div class="mg march" class:done={st.phase === 'clear'}>
  <div class="mg-head"><span aria-hidden="true">🧩</span>{@html game.title}</div>

  {#if st.phase === 'prep'}
    {#if game.lead}<p class="mg-lead">{@html game.lead}</p>{/if}
    {#if game.landmarks?.length}
      <div class="mc-plan-head">これから 走る 道 —— <b>兵糧を おく 場所</b>を 決めよう</div>
      {@render route(false)}
    {/if}
    <div class="mg-q">先に 打てる 手は {game.prepPicks}つ（いま {st.picked.length}/{game.prepPicks}）</div>
    <div class="mc-cards">
      {#each game.preps as p (p.id)}
        <button class="mc-card" class:on={st.picked.includes(p.id)} onclick={() => toggle(p.id)} aria-pressed={st.picked.includes(p.id)}>
          <span class="mc-card-top">
            <span class="mc-card-label">{@html p.label}</span>
            <span class="mc-check" aria-hidden="true">{st.picked.includes(p.id) ? '✓' : '＋'}</span>
          </span>
          {#if st.picked.includes(p.id) && p.desc}<span class="mc-card-desc">{@html p.desc}</span>{/if}
        </button>
      {/each}
    </div>
    <button class="btn btn-gold mc-go" disabled={st.picked.length !== game.prepPicks} onclick={start}>🏃 出発！</button>

  {:else if st.phase === 'run'}
    <div class="mc-day">
      <b>{st.day}日め</b>
      <span class="mc-weather" class:rain={rainToday}>
        {#if rainToday}☔️ 雨——川が 増水{#if shielded} <span class="mc-wx-ok">🚣</span>{/if}{:else}☀️ 晴れ{/if}
      </span>
    </div>

    <div class="mc-km">{st.km} / {game.goalKm}km</div>
    {@render route(true)}

    <!-- メーター -->
    <div class="mc-meters">
      <div class="mc-meter mc-fatigue">
        <span class="mc-meter-lb">つかれ</span>
        <span class="mc-bar"><span class="mc-bar-fill" class:warn={st.fatigue >= game.collapseAt} style="width:{Math.min(100, (st.fatigue / game.fatigueCap) * 100)}%"></span></span>
      </div>
      <div class="mc-meter mc-food">
        <span class="mc-meter-lb">兵糧</span>
        <span class="mc-food-icons" aria-label="兵糧 {st.food}/{game.foodMax}">
          {#each Array(game.foodMax) as _, i (i)}
            <span class="mc-onigiri" class:empty={i >= st.food} aria-hidden="true">🍙</span>
          {/each}
        </span>
      </div>
      <div class="mc-troops" class:low={st.troops <= game.minTroops + 10}>兵 <b>{st.troops}</b></div>
    </div>

    {#if mustRest}
      <div class="mc-banner">😵 兵が つかれきって いる——きょうは <b>ひと休み</b>しか ない</div>
    {/if}

    <div class="mg-q">きょうの 歩みは？</div>
    <div class="mc-paces">
      {#each game.paces as pace (pace.id)}
        {@const recovery = pace.fatigue < 0}
        {@const boost = paceBoostPrep(pace.id)}
        <button class="mc-pace" class:rest={recovery} disabled={mustRest && !recovery} onclick={() => choosePace(pace.id)}>
          <span class="mc-pace-label">{@html pace.label}{#if boost}<span class="mc-pace-boost" aria-hidden="true">{prepEmoji(boost.label)}</span>{/if}</span>
          <span class="mc-pace-sub">
            {#if recovery}つかれ 回復{:else if rainToday && !shielded}<s>{pace.km}</s>→{shownKm(pace.km)}km{:else}{pace.km}km{/if}
          </span>
        </button>
      {/each}
    </div>

    {#if logLine}<div class="mc-log">{@html logLine}</div>{/if}

  {:else if st.phase === 'clear'}
    <div class="mc-result-head win" bind:this={resultEl}>
      <div class="mc-verdict">🎉 クリア！</div>
      <div class="mc-verdict-sub">{game.landmarks?.at(-1)?.label ?? 'ゴール'}に 間に合った！ <b>{st.clearDay}日</b>で {game.goalKm}km</div>
    </div>
    {@render route(true)}
    {#if game.outro}<p class="mg-outro">{@html game.outro}</p>{/if}

  {:else if st.phase === 'fail'}
    <div class="mc-result-head lose" bind:this={resultEl}>
      <div class="mc-verdict">{st.failReason === 'army' ? '💥 軍が 崩れた…' : '⏰ 間に合わなかった…'}</div>
      <div class="mc-verdict-sub">{st.km} / {game.goalKm}km で 力つきた</div>
    </div>
    {@render route(true)}
    <div class="mc-fail">{@html failMessage}</div>
    <button class="btn btn-primary mc-retry" onclick={retry}>🔁 もう いちど、段取りから</button>
  {/if}
</div>
