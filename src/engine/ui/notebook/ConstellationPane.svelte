<script lang="ts">
  import { useStores } from '../../stores';
  import {
    VH,
    VW,
    buildConstellation,
    hitStar,
    layoutStars,
    type ConstellationDrag,
  } from '../../art/constellation';
  import {
    canLink,
    coachTargets,
    graphProgress,
    knownNodeIds,
    litLinks,
    newlyBorn,
    observedNodeIds,
    readerChapter,
  } from '../../graph';
  import { sfx } from '../../sfx.svelte';

  // ★R つながり図鑑の手帳ペイン。engine/graph.ts が「何が灯るか」、art/constellation.ts が
  // 「どこに描くか」を持ち、ここは指と目のあいだだけを持つ（ドラッグの綱・選んだ星・
  // ふりがなの要る文字列）。星の見出しは SVG の <text>（ruby 不可）だが、一言（caption）は
  // ruby を運ぶのでこちら側が HTML で描く——観察ビューが引いたのと同じ分界線。
  const { work, save, session, toast } = useStores();
  const graph = work.graph!;
  // 星の居場所は盤上の状態に依らない（art/constellation.ts）＝一度だけ解けばよい。
  const pos = layoutStars(graph);
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));

  const observed = $derived(observedNodeIds(work, save.active?.observed ?? []));
  const made = $derived(save.active?.links ?? []);
  const known = $derived(knownNodeIds(graph, observed, made));
  const prog = $derived(graphProgress(graph, observed, made));
  const lit = $derived(litLinks(graph, made));

  let board: HTMLDivElement | undefined = $state();
  /** 指が引いている綱＝はかない状態。セーブに乗せず、この層だけが持つ（レンズと同じ）。 */
  let drag = $state<ConstellationDrag | null>(null);
  /** 二タップで持ち上げている星（§5-2 の a11y 第一級代替）。 */
  let sel = $state<string | null>(null);
  /** いま灯ったばかりの辺（控えの一行を光らせるだけ。再訪では光らない＝タブ離脱で消える）。 */
  let litId = $state<string | null>(null);

  // ドラッグと二タップは「星が浮く」を共有する。二タップには指の位置が無いので星自身を
  // 指の位置として渡す＝綱は「星と指の離れ」が無いので引かれない（constellation.ts）。
  const held = $derived<ConstellationDrag | undefined>(
    drag ?? (sel && pos.has(sel) ? { from: sel, x: pos.get(sel)!.x, y: pos.get(sel)!.y } : undefined),
  );
  // 序盤コーチ（§5-3）＝持ち上げている星に「いま重ねれば灯る相手」を脈動で指す。窓の判定は
  // まるごとエンジンの純関数に委ねる（章は再開地点 scene.ch から readerChapter が導く・窓は
  // coachTargets が graph.coachUntilChapter で閉じる）＝ここは「持っているとき算出する」だけを持つ。
  // ホーム／再訪では scene が古い章を指さず（story.ts）、答えを配り続ける事故が UI に漏れない。
  const coach = $derived<Set<string>>(
    held
      ? new Set(coachTargets(graph, known, made, held.from, readerChapter(save.active?.scene)))
      : new Set(),
  );
  const svg = $derived(buildConstellation(graph, known, made, held, coach));
  // 一言は「盤の上で浮いている星」から引く（sel からではなく）。指は手より速いので、指が
  // べつの星を持った瞬間に sel はまだ前の星のまま——2つの状態から別々に描くと、盤は新しい星を
  // 浮かせながら 文は前の星を語る。浮きも文も同じ held から出せば、食い違いようがない。
  const heldNode = $derived(held ? (nodeById.get(held.from) ?? null) : null);

  const starOf = (id: string) => nodeById.get(id)?.star ?? '';

  /** 読者が灯した辺だけを見る（＝書かれた辺の一覧は誰にも訊かない）。 */
  function alreadyLit(a: string, b: string): boolean {
    return lit.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a));
  }

  function tryLink(a: string, b: string): void {
    sel = null;
    const l = canLink(graph, known, made, a, b);
    if (!l) {
      // 灯り済みは「何も起きない」でよい——線はもう目の前にある。声をかけるのは
      // 「まだ つながらない」ときだけ（§5-5 罰なし・カウンタ不変）。
      if (!alreadyLit(a, b)) toast.show('まだ、つながらない…かも？');
      return;
    }
    const before = [...made];
    if (!save.graphLink(l.id)) return;
    litId = l.id;
    sfx.clue();
    // 発明の誕生。「灯した後」はセーブから直に読む（この場で押した1本が要る＝派生の再計算を
    // 待たない）。カードは既存の収集の語彙で知らせる（engine/story.ts の onEnter と同じ）。
    const born = newlyBorn(graph, before, save.active?.links ?? []);
    for (const n of born) {
      if (n.card && save.grant('card', n.card)) {
        toast.show('🎴 カード「' + work.cards[n.card].name + '」を 手に入れた');
      }
    }
    if (born.length) setTimeout(() => sfx.card(), 320);
  }

  /** 星をひとつ タップした＝持ち上げる／置く／もう ひとつの星に重ねる（二タップ）。 */
  function tapStar(id: string): void {
    if (sel === id) {
      sel = null;
      return;
    }
    if (sel) {
      tryLink(sel, id);
      return;
    }
    sel = id;
  }

  /** 画面座標 → 枠の単位（0..VW / 0..VH）。当たり判定に入る唯一の入口。 */
  function at(e: PointerEvent): { x: number; y: number } | null {
    const r = board?.getBoundingClientRect();
    if (!r?.width || !r.height) return null;
    return { x: ((e.clientX - r.left) / r.width) * VW, y: ((e.clientY - r.top) / r.height) * VH };
  }
  const starAt = (p: { x: number; y: number }) => hitStar(graph, pos, known, p.x, p.y);

  function onPointerDown(e: PointerEvent) {
    const p = at(e);
    const id = p ? starAt(p) : null;
    if (id && p) drag = { from: id, x: p.x, y: p.y };
  }
  function onPointerMove(e: PointerEvent) {
    if (!drag) return;
    // 押下中フラグを自前で持たない（観察ビューのレンズと同じ理由＝SceneMap のコメント）。
    // 指・ペンは接触中だけ buttons が 1。マウスで枠の外まで持って行って離すと pointerup は
    // ここへ来ないが、戻ってきた最初の move の buttons=0 が「もう離した」を教えてくれる
    // ＝綱が死んだまま指に付いてくる状態を作らない。逆に pointerleave で綱を切ってはいけない
    // （枠の縁をかすめただけで持ち物が落ち、指を戻しても生き返らなくなる）。
    if (!e.buttons) {
      drag = null;
      return;
    }
    const p = at(e);
    if (p) drag = { from: drag.from, x: p.x, y: p.y };
  }
  function onPointerUp(e: PointerEvent) {
    const d = drag;
    drag = null;
    if (!d) return;
    const p = at(e);
    const over = p ? starAt(p) : null;
    if (over && over !== d.from) tryLink(d.from, over);
    // その場で離した＝タップ（＝二タップの片割れ）。click は聞かない——押した星と離した星が
    // 違うと click は共通の親に上がるうえ、指の click の行き先は実機で当てにならない。
    else if (over === d.from) tapStar(d.from);
  }
  function onPointerCancel() {
    drag = null;
  }
  function onKey(e: KeyboardEvent) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const el = (e.target as HTMLElement | null)?.closest?.('.starnode[data-nid]');
    const id = el?.getAttribute('data-nid');
    if (!id) return;
    e.preventDefault();
    tapStar(id);
  }
</script>

<div class="tabpane active" id="pane-graph">
  <div class="st-bar">
    <span class="st-stat">つながり <b>{prog.links}</b> / ?</span>
    <span class="st-stat">星 <b>{prog.stars}</b></span>
    {#if prog.inventions}<span class="st-stat st-inv">✦ 生まれた もの <b>{prog.inventions}</b></span>{/if}
  </div>
  <p class="st-lead">
    絵の 中で 見つけた 気づきが、星に なって ここに ならぶ。星を つかんで、べつの 星に
    かさねて みよう。ほんとうに つながって いれば、線が 出る。
  </p>

  <!-- 星タップの委譲。実際の interactive 要素は SVG 内の .starnode[data-nid]（role=button）。 -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="stmap-wrap">
    <div
      class="stmap"
      bind:this={board}
      onkeydown={onKey}
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
      onpointercancel={onPointerCancel}
    >
      {@html svg}
    </div>
  </div>
  <p class="st-how">タップして 持ち上げ、もう ひとつを タップしても いい</p>

  <div class="st-legend">
    {#each graph.fields as f (f.key)}
      <span class="rel-chip"><i style="background:{f.color}"></i>{@html f.label}</span>
    {/each}
  </div>

  {#if heldNode}
    <div class="st-read" role="status">
      <span class="st-read-star">✦ {heldNode.star}</span>
      <span class="st-read-text">{@html heldNode.caption}</span>
    </div>
  {/if}

  {#if lit.length}
    <ul class="st-tray">
      {#each lit as l (l.id)}
        <li class="st-item" class:is-new={l.id === litId}>
          <span class="st-item-pair">{starOf(l.a)} ── {starOf(l.b)}</span>
          <span class="st-item-text">{@html l.caption}</span>
        </li>
      {/each}
    </ul>
  {/if}
</div>
