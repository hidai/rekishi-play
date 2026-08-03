<script lang="ts">
  import { useStores } from '../stores';
  import type { ObserveSpec } from '../types';
  import { buildObserveOverlay, hotspotAt, parseFrame, type ObserveLens } from '../art/observe';

  // {@html} で生成した SVG にはイベントが付かないため、ラッパーでクリック委譲する。
  //
  // ★Q 観察ビュー: observe を渡すと、主ビジュアルの「上に」オーバーレイ SVG をもう1枚重ねる
  // （絵は置き換えない＝engine/art/observe.ts のヘッダ）。2枚は同じ viewBox で描き、同じ
  // 内容ボックス（.scene-map と同じ 1px ボーダー・border-box）に敷くので座標が一致する。
  let {
    svg,
    observe,
    found = [],
    onFind,
    onSpark,
  }: {
    svg: string;
    /** これがある時だけレンズ・紗・印が出る。無いシーンの挙動は完全に元のまま。 */
    observe?: ObserveSpec;
    /** 作品全体で見つけた hotspot id（gate の判定に要る）。 */
    found?: readonly string[];
    /** 気づきを拾った（既得でも呼ぶ＝二重発火の抑止は save.observeFind 側の契約）。 */
    onFind?: (id: string) => void;
    /** 未発見の気づきがレンズ下に初めて入った（解像の音を鳴らす縁）。 */
    onSpark?: (id: string) => void;
  } = $props();
  const { session } = useStores();

  // レンズは指に追従する"はかない"状態＝セーブに乗せず、この層だけが持つ。
  let lens = $state<ObserveLens | null>(null);
  let visual: HTMLDivElement | undefined = $state();
  // 「同じ気づきの上をなで続けても解像音を鳴らし直さない」ための縁の記憶（描画に出ない＝非リアクティブ）。
  let sparkId: string | null = null;

  // 絵は幅 100% で敷かれるので、地図単位が何 CSS px になるかはこの幅でしか分からない。
  // 測って session に返し、次の描画で文字・印の大きさが端末非依存に決まる（map/sceneMap の f）。
  let visualW = $state(0);
  $effect(() => {
    session.setVisualW(visualW);
  });

  const frame = $derived(observe ? parseFrame(svg) : null);
  const overlay = $derived(
    observe && frame && session.scene
      ? buildObserveOverlay(session.scene, observe, found, frame, lens ?? undefined)
      : '',
  );

  function faceAt(target: EventTarget | null): string | null {
    const el = (target as HTMLElement | null)?.closest?.('.mapface[data-pid]');
    return el ? el.getAttribute('data-pid') : null;
  }
  function spotAt(target: EventTarget | null): string | null {
    const el = (target as HTMLElement | null)?.closest?.('.obspot[data-hid]');
    return el ? el.getAttribute('data-hid') : null;
  }
  function onClick(e: MouseEvent) {
    const pid = faceAt(e.target);
    if (pid) return session.openCard(pid);
    // 印そのもののタップ（発見済みの読み直し・キーボードの Enter/Space 経由）。掃いて指を離す
    // 拾い方は onPointerUp が受け持つ（掃き始めの要素が違うと click は印に届かないため）。
    const hid = spotAt(e.target);
    if (hid) onFind?.(hid);
  }
  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      const pid = faceAt(e.target);
      const hid = pid ? null : spotAt(e.target);
      if (pid || hid) {
        e.preventDefault();
        if (pid) session.openCard(pid);
        else if (hid) onFind?.(hid);
      }
    }
  }

  /** 画面座標 → 正規化座標（0..1）。hotspot の座標系（絵の枠に対する比）に合わせる唯一の入口。 */
  function norm(e: PointerEvent): ObserveLens | null {
    const r = visual?.getBoundingClientRect();
    if (!r?.width || !r.height) return null;
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }
  /** レンズ下の hotspot。当たり判定は必ず hotspotAt を通す（描画円を独自に読まない）。 */
  function under(p: ObserveLens) {
    return observe && frame ? hotspotAt(observe, found, p.x, p.y, frame.w / frame.h) : null;
  }
  function moveLens(e: PointerEvent) {
    const p = norm(e);
    if (!p) return;
    lens = p;
    const h = under(p);
    const id = h && !found.includes(h.id) ? h.id : null;
    if (id !== sparkId) {
      sparkId = id;
      if (id) onSpark?.(id);
    }
  }
  function onPointerDown(e: PointerEvent) {
    if (!observe) return;
    moveLens(e);
  }
  function onPointerMove(e: PointerEvent) {
    // マウスは押していなくても追従する（ホバーが使える）。指・ペンは触れている間だけ＝
    // `e.buttons`（接触中は 1）に直接訊く。押下中フラグを自前で持つと、指が絵の縁を一瞬でも
    // 出た時点で pointerleave がそれを倒し、指を戻しても掃きが二度と生き返らない
    // （＝端の hotspot ほど拾えない）。イベントが毎回運んでくる事実を、状態で持ち直さない。
    if (!observe || (e.pointerType !== 'mouse' && !e.buttons)) return;
    moveLens(e);
  }
  function onPointerUp(e: PointerEvent) {
    if (!observe) return;
    const p = norm(e);
    const h = p ? under(p) : null;
    if (h) onFind?.(h.id);
    // 指を離したら紗も消える（レンズがある間だけ絵が霞む＝離せば元の絵が無傷で残る）。
    if (e.pointerType !== 'mouse') {
      lens = null;
      sparkId = null;
    }
  }
  // 絵の外へ出たらレンズを消す（指を戻せば pointermove が buttons を見て復帰する＝死に状態を作らない）。
  function onPointerLeave() {
    lens = null;
    sparkId = null;
  }
</script>

<!-- 顔タップの委譲。実際の interactive 要素は SVG 内の .mapface[data-pid] / .obspot[data-hid]（role=button）。 -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
  class="scene-visual"
  class:ob-active={!!observe}
  bind:this={visual}
  bind:clientWidth={visualW}
  onclick={onClick}
  onkeydown={onKey}
  onpointerdown={onPointerDown}
  onpointermove={onPointerMove}
  onpointerup={onPointerUp}
  onpointerleave={onPointerLeave}
  onpointercancel={onPointerLeave}
>
  {@html svg}{@html overlay}
</div>
