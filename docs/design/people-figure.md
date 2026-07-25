# 人の図（席の図 ＋ 血の縁の図）— 実装 spec

清盛の主ビジュアル装置。BACKLOG「エンジン: 「人の図」の主ビジュアル装置」の実装合意文書。
**この spec は無人サイクル（`/auto-dev`）で、実装担当のモデル/effort が一段低くても完走できるよう、逐語コード・逐語 Edit・スライスごとの機械検証をすべて書き下してある。** 迷ったら「## 迷ったら」を見る。設計の経緯とビジュアル目標は設計モック（`scratchpad/hitonozu.html` を Artifact 公開したもの）を参照。

## 何を作るか（1段落）

「土地に宿らない権力」を2つの独立した図で見せる。**装置1＝席の図**（`assembly`）: 朝廷の公卿の席が章を追って平家色（藍）に染まる。帝（紫）は不変。「もうだれも、平氏の力を無視できない」を一枚で語る。**装置2＝血の縁の図**（`lineage`）: 平家の枝が皇統の幹へ、婚姻の線（徳子入内）→外孫・安徳の即位、で接ぎ木されるさまを章進行で描く。安徳は帝（紫）に平家の血（藍のふち）＝玉座を藍に塗りつぶさない（簒奪の誤読を避ける）。両者は別の絵・別のレンダラだが、エンジン配管は共有し `kind` で判別する union。

## 触ってはいけないもの（ハード境界・厳守）

- **セーブ**（`hidenaga_save_v1` / `kiyomori` の saveKey・スキーマ）に一切触れない。この装置は story text と表示専用データのみ（非セーブ）。
- **VISION.md / CRITERIA.md 本文を改訂しない**。
- **体験予算を緩めない**（`docs/WRITING.md` の予算表・`tests/style-budget.test.ts` のしきい値/EXEMPT を緩める変更は禁止）。この装置はむしろ予算を**減らす**（本文を絵に返す）。厳格化・計測追加は可。
- **既存の手帳の放射状相関図（`buildRelationMap` / `RelationsPane.svelte` / `relations.ts`）を変更しない**。役割が別（収集索引）。
- **既存の closeup / 地図を持つシーンを書き換えない**（下の割当は closeup 衝突を避けて選んである）。

以上に触れなければ、この作業は AI 自律で commit まで進めてよい（push はしない＝人間の単一ゲート）。**ただしビジュアル改修なので、スライス2以降は必ず `npx vite-node scripts/render-scene.ts` で目視（visual-check）する。**

## 設計の要点（実装前に頭に入れる）

- **主ビジュアル選択（★O）**は `src/engine/ui/SceneScreen.svelte` の `svg = $derived(...)`。現状 `closeup ? … : map` の2分岐。ここに `figure` を第3分岐で足す（`closeup` があれば closeup 優先）。
- **タップはただ乗り**。`SceneMap.svelte` が任意の SVG 内 `.mapface[data-pid]` のクリックを `session.openCard(pid)` に委譲する。figure が `.mapface[data-pid]` を出せば、SceneScreen 改修なしでカードが開く。
- **章進行は `fromCh` の last-wins**（`FactionPhase` / `CampaignRoute.revealCh` と同じ作法）。状態管理もアニメ管理も不要。`buildFigure(work, key, viewCh)` に `session.ch` を渡すだけ。**章単位の粒度**（章内シーンでは同じ状態）。
- **色はテーマ非依存**。`closeup.ts` と同じく chrome（背景・線・文字）は固定 literal パレット、faction 色は作品データの literal（`relations.ts` と同じく `#31608c` 等）。→ `render-scene.ts` の単体書き出しでも忠実に出る（CSS 変数に依存しない）。
- **`.mapface` は「顔＋カードあり」の人物だけ**に付ける（`work.cards[pid] && work.faces[pid]`）。顔なしの席はただの色タイル。
- **`clipPath` の id は `fg-<figureKey>-...` で接頭**しシーン内で衝突させない（SceneScreen は `{#key session.scene}` で DOM ごと再生成するので、1画面に同一 figure は1つ）。

## シーン割当（closeup 衝突を回避済み・確定）

| 章 | シーン | 主ビジュアル | 状態（viewCh） |
|---|---|---|---|
| 三 | **3-b**（娘を、帝に） | `bloodline` | 婚姻の線が入る（徳子＝高倉） |
| 三 | **3-d**（むすび） | `court` | 5席が藍（ch3 の到達状態を むすびで見晴らす） |
| 五 | **5-a**（栄華） | `court` | 11席が藍（栄華の頂を開幕で見せる） |
| 六 | **6-a**（安徳即位） | `bloodline` | 外孫・安徳が接ぐ |

> closeup を持つシーン（1-c/2-c/**3-c**/5-c/7-a2）と、カスタム地図（4-a〜4-d/6-b）は避けてある。3-c は「無視できない」の本文があるが closeup（清盛×後白河）持ちなので figure は隣の **3-d（むすび）** に置く。3-c の本文削減はスライス6（任意）で扱う。

---

# スライス（各スライスで独立に commit・必ず green）

各スライスの最後で必ず: `npm run check`（0エラー）と `npm test`（全通過）。スライス2以降は visual-check も。

## スライス1: 型を足す（挙動変化ゼロ）

`src/engine/types.ts` の `WorkRelations` インターフェイス定義の**直後**（`/* ---------------- 地図 ---------------- */` コメントの直前）に、次を貼る:

```ts
/* ---------------- 人の図（★P 表示専用・章進行） ---------------- */

/** 図の勢力（色分け・凡例）。key を fill.faction / node.house / node.ring / dais.faction が参照。 */
export interface FigureFaction {
  key: string;
  label: string;
  /** literal 色を推奨（render-scene で忠実に出る。relations.ts と同じ流儀）。 */
  color: string;
}

/** 席の図の1席。座標は図の viewBox 座標系。 */
export interface FigureSeat {
  id: string;
  x: number;
  y: number;
  /** 席の役職ラベル（任意・未使用でも可）。 */
  role?: string;
}

/** 席への章キー割当。「見ている章 >= fromCh」で有効（同席は fromCh 最大が勝つ＝last-wins）。 */
export interface FigureFill {
  seat: string;
  fromCh: number;
  faction: string;
  /** 顔＋カードのある人物なら小さな顔を置きタップでカードが開く。無ければ色タイルのみ。 */
  pid?: string;
  /** 席の脇に出す短い名前（省略時は shortNames[pid]）。 */
  label?: string;
}

/** 装置1・席の図。公卿の席が章で染まる。帝（dais）は不変の文脈。 */
export interface AssemblyFigure {
  kind: 'assembly';
  /** viewBox サイズ（省略時 [300, 310]）。 */
  vb?: [number, number];
  title?: string;
  /** 割当の無い席の既定 faction key（例 'court'）。 */
  base?: string;
  factions: FigureFaction[];
  seats: FigureSeat[];
  fills: FigureFill[];
  /** 上座（帝）。色は変わらない文脈として置く。 */
  dais?: { x: number; y: number; label?: string; faction?: string };
}

/** 血の縁の図のノード（人物）。 */
export interface LineageNode {
  id: string;
  x: number;
  y: number;
  /** 顔＋カードのある人物なら顔＋タップ。 */
  pid?: string;
  /** ノードの家（fill 色の faction key）。例 'heike' | 'imperial'。 */
  house: string;
  /** ふち色の faction key（省略時 house と同色）。安徳＝house:'imperial'・ring:'heike' で「帝に平家の血」。 */
  ring?: string;
  /** このノードが現れる章（省略時 1）。 */
  fromCh?: number;
  /** 顔が無い場合に円内へ出す短いラベル。 */
  label?: string;
}

/** 血の縁の図のエッジ。descent=親子（細線・かぎ折れ）／marriage=婚姻（金の二重線）。 */
export interface LineageEdge {
  from: string;
  to: string;
  kind: 'descent' | 'marriage';
  fromCh: number;
}

/** 装置2・血の縁の図（系図・接ぎ木）。 */
export interface LineageFigure {
  kind: 'lineage';
  /** viewBox サイズ（省略時 [300, 250]）。 */
  vb?: [number, number];
  title?: string;
  factions: FigureFaction[];
  nodes: LineageNode[];
  edges: LineageEdge[];
}

/** ★P 人の図（kind で判別する主ビジュアルの第3型）。 */
export type Figure = AssemblyFigure | LineageFigure;
```

同ファイルの `Scene` インターフェイスの `closeup?: SceneCloseup;` の**直後**に足す:

```ts
  /** ★P 人の図（席の図 / 血の縁の図）を主ビジュアルにする。work.figures のキー。closeup があればそちらが優先。 */
  figure?: string;
```

同ファイルの `Work` インターフェイスの `relations?: WorkRelations;` の**直後**に足す:

```ts
  /** ★P 人の図（席の図 / 血の縁の図）。未定義なら機能オフ。 */
  figures?: Record<string, Figure>;
```

**検証**: `npm run check`（0エラー）／`npm test`（全通過）。挙動変化なし。**commit**: `Add Figure (assembly/lineage) types for the 人の図 device`

## スライス2: エンジンのレンダラ ＋ render-scene 対応

新規ファイル `src/engine/map/figure.ts` を、次の内容そのままで作成:

```ts
// ★P 「人の図」= 章進行する表示専用の主ビジュアル（席の図 / 血の縁の図）。純粋な文字列生成関数。
// closeup.ts と同じく、色は CSS 変数に依存しない固定パレット＋作品データの faction 色（literal）で
// 描く（テーマ非依存＝render-scene.ts の単体書き出しでもそのまま見える）。faceSvg / clip の作法は
// sceneMap.ts・relationMap.ts と同じ。章進行は FactionPhase/CampaignRoute と同じ「fromCh の last-wins」。
import type { Work, AssemblyFigure, LineageFigure, FigureFill } from '../types';
import { faceSvg } from './sceneMap';
import { esc } from '../util';

// Fixed, theme-independent chrome palette (faction colors come from the work data).
const PAL = {
  ground: '#efe7d4',
  panel: '#f6efdf',
  line: '#cbbb98',
  ink: '#2a251c',
  gold: '#c9a23e',
};

const strip = (s: string) => s.replace(/<[^>]+>/g, '');
function nameOf(work: Work, pid: string): string {
  return work.shortNames[pid] || strip(work.cards[pid]?.name || work.peopleExtra[pid] || '');
}

export function buildFigure(work: Work, key: string, viewCh: number): string {
  const fig = work.figures?.[key];
  if (!fig) return '';
  return fig.kind === 'lineage'
    ? buildLineage(work, key, fig, viewCh)
    : buildAssembly(work, key, fig, viewCh);
}

// Last-wins: the fill for this seat with the largest fromCh that is <= viewCh.
function activeFill(fills: FigureFill[], seatId: string, viewCh: number): FigureFill | null {
  let best: FigureFill | null = null;
  for (const f of fills) {
    if (f.seat === seatId && f.fromCh <= viewCh && (!best || f.fromCh >= best.fromCh)) best = f;
  }
  return best;
}

function buildAssembly(work: Work, key: string, fig: AssemblyFigure, viewCh: number): string {
  const [VW, VH] = fig.vb ?? [300, 310];
  const colorOf = (fk: string) => fig.factions.find((f) => f.key === fk)?.color || PAL.line;
  const uid = `fg-${key}`;
  const defs: string[] = [];
  const body: string[] = [
    `<rect x="6" y="6" width="${VW - 12}" height="${VH - 12}" rx="10" fill="${PAL.ground}" stroke="${PAL.line}"/>`,
  ];
  if (fig.dais) {
    const dc = colorOf(fig.dais.faction || '');
    body.push(
      `<circle cx="${fig.dais.x}" cy="${fig.dais.y}" r="14" fill="${dc}" stroke="${dc}" stroke-width="1.6"/>`,
    );
    if (fig.dais.label)
      body.push(
        `<text x="${fig.dais.x}" y="${fig.dais.y + 5}" text-anchor="middle" font-family="serif" font-size="13" font-weight="700" fill="#fff">${esc(fig.dais.label)}</text>`,
      );
  }
  const W = 46,
    H = 20;
  fig.seats.forEach((s, i) => {
    const fill = activeFill(fig.fills, s.id, viewCh);
    const c = colorOf(fill?.faction || fig.base || '');
    const isYou = !!fill?.pid && fill.pid === work.protagonistId;
    body.push(
      `<rect x="${(s.x - W / 2).toFixed(1)}" y="${(s.y - H / 2).toFixed(1)}" width="${W}" height="${H}" rx="4" fill="${c}" opacity="${fill ? 0.95 : 0.5}" stroke="${isYou ? PAL.gold : fill ? c : PAL.line}" stroke-width="${isYou ? 2.4 : 1}"/>`,
    );
    if (fill?.pid && work.cards[fill.pid] && work.faces[fill.pid]) {
      const r = 9,
        cx = s.x - W / 2 + 12,
        cy = s.y,
        cid = `${uid}-s${i}`;
      defs.push(`<clipPath id="${cid}"><circle cx="${cx}" cy="${cy}" r="${r - 1.2}"/></clipPath>`);
      const nm = fill.label || nameOf(work, fill.pid);
      const face =
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${PAL.panel}" stroke="${isYou ? PAL.gold : c}" stroke-width="1.6"/>` +
        faceSvg(fill.pid, cx - r, cy - r, r * 2, cid, work.faces) +
        (nm
          ? `<text x="${cx + 13}" y="${cy + 3.6}" font-family="serif" font-size="11" font-weight="700" fill="${PAL.ink}">${esc(nm)}</text>`
          : '');
      body.push(
        `<g class="mapface" data-pid="${esc(fill.pid)}" role="button" tabindex="0" aria-label="${esc(nameOf(work, fill.pid) || '人物')}の カードを ひらく">${face}</g>`,
      );
    } else if (fill?.label) {
      body.push(
        `<text x="${s.x}" y="${s.y + 4}" text-anchor="middle" font-family="serif" font-size="10.5" font-weight="700" fill="#fff">${esc(fill.label)}</text>`,
      );
    }
  });
  return `<svg class="scene-map scene-figure" viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(fig.title || '席の図')}"><defs>${defs.join('')}</defs>${body.join('')}</svg>`;
}

function buildLineage(work: Work, key: string, fig: LineageFigure, viewCh: number): string {
  const [VW, VH] = fig.vb ?? [300, 250];
  const colorOf = (fk: string) => fig.factions.find((f) => f.key === fk)?.color || PAL.line;
  const uid = `fg-${key}`;
  const byId: Record<string, LineageFigure['nodes'][number]> = {};
  fig.nodes.forEach((n) => (byId[n.id] = n));
  const vis = (n?: LineageFigure['nodes'][number]) => !!n && (n.fromCh ?? 1) <= viewCh;
  const defs: string[] = [];
  const edges: string[] = [
    `<rect x="6" y="6" width="${VW - 12}" height="${VH - 12}" rx="10" fill="${PAL.ground}" stroke="${PAL.line}"/>`,
  ];
  fig.edges.forEach((e) => {
    const a = byId[e.from],
      b = byId[e.to];
    if (!vis(a) || !vis(b) || e.fromCh > viewCh) return;
    if (e.kind === 'marriage') {
      const y = a.y;
      edges.push(
        `<line x1="${a.x + 17}" y1="${y - 3}" x2="${b.x - 17}" y2="${y - 3}" stroke="${PAL.gold}" stroke-width="2.2"/>` +
          `<line x1="${a.x + 17}" y1="${y + 3}" x2="${b.x - 17}" y2="${y + 3}" stroke="${PAL.gold}" stroke-width="2.2"/>`,
      );
    } else {
      const my = (a.y + b.y) / 2;
      edges.push(
        `<path d="M${a.x} ${a.y + 17} L${a.x} ${my} L${b.x} ${my} L${b.x} ${b.y - 17}" fill="none" stroke="${PAL.line}" stroke-width="2.4"/>`,
      );
    }
  });
  const nodes: string[] = [];
  fig.nodes.forEach((n, i) => {
    if (!vis(n)) return;
    const fillC = colorOf(n.house);
    const strokeC = n.ring ? colorOf(n.ring) : fillC;
    const sw = n.ring ? 3.4 : 1.8;
    const r = 17;
    let g = '';
    if (n.pid && work.faces[n.pid]) {
      const cid = `${uid}-n${i}`;
      defs.push(`<clipPath id="${cid}"><circle cx="${n.x}" cy="${n.y}" r="${r - 1.4}"/></clipPath>`);
      g +=
        `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fillC}" stroke="${strokeC}" stroke-width="${sw}"/>` +
        faceSvg(n.pid, n.x - r, n.y - r, r * 2, cid, work.faces);
    } else {
      g += `<circle cx="${n.x}" cy="${n.y}" r="${r}" fill="${fillC}" stroke="${strokeC}" stroke-width="${sw}"/>`;
      if (n.label)
        g += `<text x="${n.x}" y="${n.y + 5}" text-anchor="middle" font-family="serif" font-size="14" font-weight="700" fill="#fff">${esc(n.label)}</text>`;
    }
    const nm = n.label || (n.pid ? nameOf(work, n.pid) : '');
    if (nm)
      g += `<text x="${n.x}" y="${n.y + r + 13}" text-anchor="middle" font-family="serif" font-size="10" font-weight="700" fill="${PAL.ink}">${esc(nm)}</text>`;
    nodes.push(
      n.pid && work.cards[n.pid]
        ? `<g class="mapface" data-pid="${esc(n.pid)}" role="button" tabindex="0" aria-label="${esc(nameOf(work, n.pid) || '人物')}の カードを ひらく">${g}</g>`
        : `<g>${g}</g>`,
    );
  });
  return `<svg class="scene-map scene-figure" viewBox="0 0 ${VW} ${VH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(fig.title || '血の縁の図')}"><defs>${defs.join('')}</defs>${edges.join('')}${nodes.join('')}</svg>`;
}
```

`scripts/render-scene.ts` を編集。`import { buildCloseup } from '../src/engine/art/closeup';` の直後に:

```ts
import { buildFigure } from '../src/engine/map/figure';
```

同ファイルの末尾の描画ロジックを、次の**旧→新**で置換:

旧:
```ts
const cu = work.story.chapters.find((c) => c.id === ch)?.scenes[scene]?.closeup;
const svg = cu ? buildCloseup(work, scene, cu) : buildSceneMap(work, ch, scene);
writeFileSync(out, svg);
console.log('wrote', out, `(${slug} ch${ch} ${scene}${cu ? ' closeup' : ''}, ${svg.length} bytes)`);
```
新:
```ts
const s = work.story.chapters.find((c) => c.id === ch)?.scenes[scene];
const svg = s?.closeup
  ? buildCloseup(work, scene, s.closeup)
  : s?.figure
    ? buildFigure(work, s.figure, ch)
    : buildSceneMap(work, ch, scene);
writeFileSync(out, svg);
console.log('wrote', out, `(${slug} ch${ch} ${scene}${s?.closeup ? ' closeup' : s?.figure ? ' figure' : ''}, ${svg.length} bytes)`);
```

**検証**: `npm run check`／`npm test`。挙動変化なし（呼び出し元がまだ無い）。**commit**: `Add buildFigure renderer (assembly/lineage) + render-scene support`

## スライス3: 主ビジュアル選択に figure を足す（挙動変化ゼロ）

`src/engine/ui/SceneScreen.svelte`。`import { buildCloseup } from '../art/closeup';` の直後に:

```ts
  import { buildFigure } from '../map/figure';
```

`const svg = $derived(...)` を**旧→新**で置換:

旧:
```ts
  const svg = $derived(
    session.ch != null && session.scene
      ? sc?.closeup
        ? buildCloseup(work, session.scene, sc.closeup)
        : buildSceneMap(work, session.ch, session.scene)
      : '',
  );
```
新:
```ts
  const svg = $derived(
    session.ch != null && session.scene
      ? sc?.closeup
        ? buildCloseup(work, session.scene, sc.closeup)
        : sc?.figure
          ? buildFigure(work, sc.figure, session.ch)
          : buildSceneMap(work, session.ch, session.scene)
      : '',
  );
```

同ファイルの `maybeFaceHint` を**旧→新**で置換（figure/closeup のシーンでは地図が出ないので「地図の顔をタップ」ヒントを抑止）:

旧:
```ts
  function maybeFaceHint(ch: number, scene: string) {
    const s = buildSceneMap(work, ch, scene);
    if (!s.includes('class="mapface"')) return;
```
新:
```ts
  function maybeFaceHint(ch: number, scene: string) {
    const s0 = work.story.chapters.find((c) => c.id === ch)?.scenes[scene];
    if (s0?.closeup || s0?.figure) return; // no map shown → the "tap the map face" hint would mislead
    const s = buildSceneMap(work, ch, scene);
    if (!s.includes('class="mapface"')) return;
```

**検証**: `npm run check`／`npm test`。どのシーンもまだ `figure` を持たないので出力は従来と同一。**commit**: `Wire figure as the third main-visual type in SceneScreen (behavior unchanged until data)`

## スライス4: kiyomori の figures データ ＋ 参照整合テスト

新規ファイル `src/works/kiyomori/figures.ts` を、次の内容そのままで作成:

```ts
// ★P 「人の図」データ（表示専用・章進行）。エンジン: src/engine/map/figure.ts。
// 席の図（court）＝公卿の席が章で藍に染まる／血の縁の図（bloodline）＝婚姻の線が皇統へ。
// 色は literal（テーマ非依存＝render-scene で忠実に出る）。手書き管理。
/* eslint-disable */

import type { Figure } from '../../engine/types';

const HEIKE = '#31608c'; // 藍：平家一門
const COURT = '#b6ab93'; // 石：藤原・その他の公卿
const IMPERIAL = '#8a5a86'; // 紫：帝・院（不変）

export const FIGURES: Record<string, Figure> = {
  // 装置1：朝廷の席の図。帝（紫）は不変、公卿の席だけが章で藍に染まる。
  // 3-d（ch3 むすび）=5席、5-a（ch5 栄華）=11席。席は象徴として14。
  court: {
    kind: 'assembly',
    title: '朝廷の 席の 図',
    vb: [300, 310],
    base: 'court',
    factions: [
      { key: 'heike', label: '平家一門', color: HEIKE },
      { key: 'court', label: '藤原・その他', color: COURT },
      { key: 'imperial', label: '帝・院', color: IMPERIAL },
    ],
    dais: { x: 150, y: 54, label: '帝', faction: 'imperial' },
    seats: [
      { id: 'L0', x: 92, y: 108 }, { id: 'L1', x: 92, y: 135 }, { id: 'L2', x: 92, y: 162 },
      { id: 'L3', x: 92, y: 189 }, { id: 'L4', x: 92, y: 216 }, { id: 'L5', x: 92, y: 243 },
      { id: 'L6', x: 92, y: 270 },
      { id: 'R0', x: 208, y: 108 }, { id: 'R1', x: 208, y: 135 }, { id: 'R2', x: 208, y: 162 },
      { id: 'R3', x: 208, y: 189 }, { id: 'R4', x: 208, y: 216 }, { id: 'R5', x: 208, y: 243 },
      { id: 'R6', x: 208, y: 270 },
    ],
    fills: [
      // ch3（1167 太政大臣）：清盛が最上席、嫡男・重盛、一門3席 = 5席が藍。
      { seat: 'L0', fromCh: 3, faction: 'heike', pid: 'p-kiyomori', label: '清盛' },
      { seat: 'L1', fromCh: 3, faction: 'heike', pid: 'p-shigemori', label: '重盛' },
      { seat: 'L2', fromCh: 3, faction: 'heike' },
      { seat: 'R0', fromCh: 3, faction: 'heike' },
      { seat: 'R1', fromCh: 3, faction: 'heike' },
      // ch5（1180 栄華）：一門がさらに席を占め = 11席が藍。知盛の顔が新たに現れる。
      { seat: 'R0', fromCh: 5, faction: 'heike', pid: 'p-tomomori', label: '知盛' },
      { seat: 'L3', fromCh: 5, faction: 'heike' },
      { seat: 'L4', fromCh: 5, faction: 'heike' },
      { seat: 'R2', fromCh: 5, faction: 'heike' },
      { seat: 'R3', fromCh: 5, faction: 'heike' },
      { seat: 'R4', fromCh: 5, faction: 'heike' },
      { seat: 'R5', fromCh: 5, faction: 'heike' },
    ],
  },
  // 装置2：血の縁の図。平家（左）が皇統（右）へ、徳子入内(ch3)で婚姻線、外孫・安徳の即位(ch6)で接ぐ。
  bloodline: {
    kind: 'lineage',
    title: '血の 縁の 図',
    vb: [300, 250],
    factions: [
      { key: 'heike', label: '平家の 血', color: HEIKE },
      { key: 'imperial', label: '皇統', color: IMPERIAL },
    ],
    nodes: [
      { id: 'kiyomori', x: 74, y: 58, pid: 'p-kiyomori', house: 'heike' },
      { id: 'goshirakawa', x: 226, y: 58, pid: 'p-goshirakawa', house: 'imperial' },
      { id: 'tokuko', x: 74, y: 138, pid: 'p-tokuko', house: 'heike' },
      { id: 'takakura', x: 226, y: 138, pid: 'p-takakura', house: 'imperial' },
      // 安徳＝帝（紫）に平家の血（藍のふち）。章6で現れる。
      { id: 'antoku', x: 150, y: 214, pid: 'p-antoku', house: 'imperial', ring: 'heike', fromCh: 6 },
    ],
    edges: [
      { from: 'kiyomori', to: 'tokuko', kind: 'descent', fromCh: 1 },
      { from: 'goshirakawa', to: 'takakura', kind: 'descent', fromCh: 1 },
      { from: 'tokuko', to: 'takakura', kind: 'marriage', fromCh: 3 },
      { from: 'tokuko', to: 'antoku', kind: 'descent', fromCh: 6 },
    ],
  },
};
```

`src/works/kiyomori/index.ts` を編集。`import { RELATIONS } from './relations';` の直後に:

```ts
import { FIGURES } from './figures';
```
Work オブジェクトの `relations: RELATIONS,` の直後に:

```ts
  figures: FIGURES,
```

新規テスト `tests/scene-figure.test.ts` を、次の内容そのままで作成（全 WORKS 横断の参照整合＋描画健全性）:

```ts
// Guards the 人の図 device across all WORKS: every figure references only resolvable
// pids / faction keys / seat ids / node ids, every Scene.figure points at a real figure,
// and buildFigure emits a clean, self-consistent svg (valid viewBox, no undefined/NaN,
// every rendered data-pid opens a real card) at every chapter. A low-effort authoring
// mistake (typo'd pid, wrong faction key, dangling seat/edge, bad figure key) fails here
// instead of only in a manual visual-check.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { buildFigure } from '../src/engine/map/figure';

for (const work of WORKS) {
  const figures = work.figures;
  if (!figures) continue;
  describe(`figures: ${work.id}`, () => {
    const keysOf = (fig: any) => new Set(fig.factions.map((x: any) => x.key));

    it('every figure references only resolvable pids / factions / seats / nodes', () => {
      for (const [key, fig] of Object.entries<any>(figures)) {
        const fk = keysOf(fig);
        if (fig.kind === 'assembly') {
          const seatIds = new Set(fig.seats.map((s: any) => s.id));
          if (fig.base) expect(fk.has(fig.base), `${key} base`).toBe(true);
          if (fig.dais?.faction) expect(fk.has(fig.dais.faction), `${key} dais.faction`).toBe(true);
          for (const f of fig.fills) {
            expect(seatIds.has(f.seat), `${key} fill.seat ${f.seat}`).toBe(true);
            expect(fk.has(f.faction), `${key} fill.faction ${f.faction}`).toBe(true);
            if (f.pid) {
              expect(work.faces[f.pid], `${key} fill.pid face ${f.pid}`).toBeTruthy();
              expect(work.cards[f.pid], `${key} fill.pid card ${f.pid}`).toBeTruthy();
            }
          }
        } else {
          const nodeIds = new Set(fig.nodes.map((n: any) => n.id));
          for (const n of fig.nodes) {
            expect(fk.has(n.house), `${key} node.house ${n.house}`).toBe(true);
            if (n.ring) expect(fk.has(n.ring), `${key} node.ring ${n.ring}`).toBe(true);
            if (n.pid) {
              expect(work.faces[n.pid], `${key} node.pid face ${n.pid}`).toBeTruthy();
              expect(work.cards[n.pid], `${key} node.pid card ${n.pid}`).toBeTruthy();
            }
          }
          for (const e of fig.edges) {
            expect(nodeIds.has(e.from), `${key} edge.from ${e.from}`).toBe(true);
            expect(nodeIds.has(e.to), `${key} edge.to ${e.to}`).toBe(true);
          }
        }
      }
    });

    it('every Scene.figure references an existing figure key', () => {
      for (const ch of work.story.chapters) {
        for (const [sid, sc] of Object.entries<any>(ch.scenes)) {
          if (sc.figure) expect(figures[sc.figure], `scene ${sid} figure ${sc.figure}`).toBeTruthy();
        }
      }
    });

    it('buildFigure emits a valid, self-consistent svg at each chapter', () => {
      for (const key of Object.keys(figures)) {
        for (let ch = 1; ch <= work.totalChapters; ch++) {
          const svg = buildFigure(work, key, ch);
          expect(svg.startsWith('<svg'), `${key}@${ch} is svg`).toBe(true);
          expect(svg, `${key}@${ch} viewBox`).toMatch(/viewBox="0 0 [\d.]+ [\d.]+"/);
          expect(svg.includes('undefined') || svg.includes('NaN'), `${key}@${ch} clean`).toBe(false);
          for (const m of svg.matchAll(/data-pid="([^"]+)"/g)) {
            expect(work.cards[m[1]], `${key}@${ch} data-pid ${m[1]}`).toBeTruthy();
          }
        }
      }
    });
  });
}
```

**検証**: `npm run check`／`npm test`（新テスト含め全通過）。**visual-check**（両装置を各章状態で目視。破綻＝はみ出し・重なり・顔の切れ・色の取り違えが無いか）:

```
npx vite-node scripts/render-scene.ts /tmp/f-court-3.svg 3 3-d kiyomori   # ← まだ figure 未配線なので次スライス後に本番確認。ここでは下の直接描画で見る
```

> スライス4時点ではシーンに `figure` を付けていないので `render-scene` はまだ地図を出す。データ単体の目視は、一時的に確認用シーンへ付けるか、次のスライス5で実シーンに付けてから行う。**必ず見るのはスライス5**。

**commit**: `Add kiyomori 人の図 data (court seats + bloodline) with cross-work integrity test`

## スライス5: シーンへ配線（figure を出す・visual-check 必須）

`src/works/kiyomori/story/index.ts` を4か所編集。各シーンの `place: …,` の直後に `figure:` を足す（**旧→新**、いずれも一意にマッチ）:

1. 3-b（血の縁）
   - 旧: `'3-b': { place: '娘を、<ruby>帝<rt>みかど</rt></ruby>に',`
   - 新: `'3-b': { place: '娘を、<ruby>帝<rt>みかど</rt></ruby>に', figure: 'bloodline',`
2. 3-d（席の図）
   - 旧: `'3-d': { place: '第3章 むすび',`
   - 新: `'3-d': { place: '第3章 むすび', figure: 'court',`
3. 5-a（席の図）
   - 旧: `'5-a': { place: '京・<ruby>六波羅<rt>ろくはら</rt></ruby>',`
   - 新: `'5-a': { place: '京・<ruby>六波羅<rt>ろくはら</rt></ruby>', figure: 'court',`
4. 6-a（血の縁）
   - 旧: `'6-a': { place: '<ruby>福原<rt>ふくはら</rt></ruby>',`
   - 新: `'6-a': { place: '<ruby>福原<rt>ふくはら</rt></ruby>', figure: 'bloodline',`

**検証**: `npm run check`／`npm test`（style-budget 含む＝本文未変更なので緑のまま）。**visual-check（必須・4枚）**:

```
npx vite-node scripts/render-scene.ts /tmp/f-3b.svg 3 3-b kiyomori   # 血の縁：徳子＝高倉の婚姻線（安徳なし）
npx vite-node scripts/render-scene.ts /tmp/f-3d.svg 3 3-d kiyomori   # 席の図：5席が藍
npx vite-node scripts/render-scene.ts /tmp/f-5a.svg 5 5-a kiyomori   # 席の図：11席が藍・知盛の顔
npx vite-node scripts/render-scene.ts /tmp/f-6a.svg 6 6-a kiyomori   # 血の縁：安徳が接ぐ（藍のふち）
```

各 SVG を目で見て、破綻（席のはみ出し・顔の切れ・線の交差ミス・名前の重なり・色の取り違え）が無いか確認。**あれば figures.ts の座標を微調整**（エンジンは変えない）。**commit**: `Show 人の図 at kiyomori 3-b/3-d/5-a/6-a (bloodline & court seats)`

## スライス6（任意・本文削減）: 3-c の説明過多を絵に返す

席の図が章内（3-d）で「席が藍」を語るので、3-c 本文の**列挙**「見わたせば、…また 顔。」を削る（体験予算の純減。払拭される文は列挙のみ、決め台詞「もう だれも、平家の 力を 無視できない。」は残す）。`src/works/kiyomori/story/index.ts` の 3-c `text` を**旧→新**:

- 旧（`text:` の値の該当部分）: `役に つく。見わたせば、<ruby>大臣<rt>だいじん</rt></ruby>の 席にも、<ruby>帝<rt>みかど</rt></ruby>の すぐ そばにも、平家 <ruby>一門<rt>いちもん</rt></ruby>の 顔、また 顔。もう だれも、`
- 新: `役に つく。もう だれも、`

**検証**: `npm run check`／`npm test`（style-budget が緑のまま＝字数・注釈が減る方向）。純粋な描写1文の削除で史実主張は不変（`/eval-work`・code-reviewer は非該当＝過去の「語彙のみの言い換え」判断と同種）。**commit**: `Trim ch3 court-survey prose now that the 席の図 carries it (budget reduction)`

---

## 迷ったら（失敗回避チェックリスト）

- **エンジンは作品非依存に保つ**。`figure.ts` に固有名詞・章番号・pid をハードコードしない（全部データ側）。G4。
- **`.mapface` は `work.cards[pid] && work.faces[pid]` の人物だけ**。カードの無い pid に付けると、タップで何も開かず無意味。
- **色は figures.ts の literal**（`var(--…)` を書かない＝render-scene で消える）。chrome の固定色は `figure.ts` の `PAL`。
- **座標が図の外に出ない**。`vb` の範囲（席 [300,310]／系図 [300,250]）に収める。調整はデータ側の x/y のみ。
- **章粒度**。同じ章のシーンは同じ状態になる（3-a と 3-d は同じ ch3 状態）。だから席の図は「章の到達状態を見せる」シーン（むすび・章頭）に置く。
- **closeup 優先**。closeup を持つシーンに figure を足しても出ない（★O 順）。上の割当は衝突回避済み。増やす時は closeup（1-c/2-c/3-c/5-c/7-a2）とカスタム地図（4-a〜4-d/6-b）を避ける。
- **`npm run verify`**（build＋全テスト）を最後に1回通す（単一 HTML ビルドが壊れていないこと）。
- **push しない**。commit まで。人間が push 前レビューで受否を決める（単一ゲート）。

## 完了時（auto-dev 慣習）

- `docs/BACKLOG.md` の「エンジン: 「人の図」の主ビジュアル装置」タスクを完了スタブ化（コミット列を添えて DONE へ）。この spec の分離判断（席の図＝位／血の縁＝縁・玉座は染めない）を1行で残す。
- `docs/JOURNAL.md` に当セッションを追記（やったこと・結果・visual-check の所見・**人間にしてほしいこと＝実機で「無視できない」が席の図で伝わるか／安徳の藍のふちが「簒奪でなく縁」に読めるかを家族プレイで観察**）。
- push 前レビュー観点として「席の図・血の縁の図の DOM+実 CSS での見た目（render-scene は SVG 単体・実機は `.scene-map` コンテナ内）」を残す。

## 将来の拡張（この spec の範囲外・やらない）

- 章内粒度（3-a=1席 → 3-c=5席 の段階表示）。今は章粒度で十分。
- 接ぎ木線を平家藍の破線で強調（モックの演出）。今は安徳のふち色で足りる。
- 勝海舟への転用（`assembly` = 幕府の評定席、`lineage` = 家/派閥）。契約は既に汎用。

## 追補（2026-07-13・観察メモ対応＝実装済み）

家族プレイ観察「系図は父×母→子の文法で」を受けて以下を追加（この spec 本文の図・コード例は初版のまま＝現行実装は追補が優先）:

- **`LineageEdge.from2`**（第2の親）: descent 線は `from×from2` の**婚姻線の中点**から子へ降りる（from2 未指定・不可視時は従来どおり from 直下）。
- **kiyomori bloodline に時子・滋子ノードを追加**: 上段が 清盛×時子｜滋子×後白河 の2夫婦、徳子・高倉は各夫婦の中点から、安徳は徳子×高倉の中点から降下。滋子（建春門院・時子の妹）は顔・カードなしの名前ノード（観察メモ「名前や顔は必須でない」）。
- **高倉にも `ring:'heike'`**: 母・滋子＝平家の血ゆえ、安徳と同じ「紫地に藍ふち」の文法で一貫させる（藍の母から降りた子にふちが無いと図の文法が自己矛盾する）。
- **顔なしノードのラベルは円内のみ**（円下の重複描画を廃止＝同名2人に見える誤読を回避）。

## 追補（2026-07-18・観察メモ対応＝装置3「戦場の図」を新設）

家族プレイ観察「家康の合戦図がイマイチ。何を伝えたいのか／それが伝わっているか。既存の再利用は良いが、新エンジンで他でも再利用可能な良いものを」（2026-07-18）を受けて、**装置3＝戦場の図（`kind:'battlefield'`）**を新設。ch5 関ヶ原の主ビジュアルを装置1（席の図）から差し替えた。

**なぜ新設か**: 関ヶ原は元は装置1（色タイル2段の名簿）で描いていたが、席の図には**地形・対峙・高地が無い**ので「名簿」に読まれた（＝観察の「イマイチ」・清盛型事故＝eval 通過・家族に不達）。合戦は名簿でなく「場」がある——①谷で二軍が前線を挟んで対峙し ②高地に伏兵が構える。それを絵そのものに語らせる装置。

**プリミティブ（`BattlefieldFigure` / `BattleUnit`・`src/engine/map/figure.ts` の `buildBattlefield`）**:
- `units[]`: 各部隊 `{x,y,faction,pid?/label?,role?,troops?,facing?,hill?}`。`pid`＝大将の顔チップ（タップでカード）／`label`＝顔なしブロック（＝軍勢・合議体。ch6「顔なし＝軍勢」の文法）／`troops`＝旗の群れ（大将の前方 seam 方向へ扇状）／`hill:true`＝丘の hump を下に描き部隊を上に据える（見おろす＝席の図に描けない高低差）。名前は旗の反対側（`nameLeft = troops && facing>0`）。
- `seam?{x,label?}`: ぶつかる前線。**点線・矢印にしない**（勝敗と寝返りの時刻を解像しない＝WRITING 地図書法2）。
- chrome（title/caption/legend/fit-gate）と `faceSvg` は装置1/2と共有。色は literal（テーマ非依存）。fit-gate は `BLOCK`（顔なしブロック）を追加。

**再利用マップ（他作品の合戦・人間の「他でも再利用可能」への答え）**: 地図の投影床（顔遮蔽圏 ~40u ≈ 380km）より小さい合戦がすべて対象——
- ieyasu: 三方ヶ原（ch2）・大坂（ch6）。
- kiyomori: 保元/平治の乱（京の局所戦）・壇ノ浦（海戦＝facing を海峡に）。
- hidenaga: 四国/九州/小田原の局地戦（広域の推移は campaign map が担う）。
広い戦域はシーン地図が正しい（battlefield は「盆地1つが山場」の章の装置）。

**検証（本サイクル）**: check 0・scene-figure.test 21件（battlefield の参照整合・shape-fit・no-seam/非hill role の合成 fixture を追加）＋全697件緑。初見読解 eval（小5・関ヶ原伝説を知らない前提）＝「谷で対峙＋高地の二勢力」が読める・NEW は旧 roster より明確に改善・ファクトチェック クリーン（勝敗/寝返り時刻を断定せず）。code-reviewer（sonnet）＝正しさの不具合ゼロ。ラスタ目視で破綻なし。
