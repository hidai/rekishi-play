// 作品横断の「構造整合」検査ヘルパー。
// TypeScript は型を見るが、文字列キーの dangling 参照（face/card/clue/gaz id）や
// 章遷移の袋小路は見ないので、ここで DOM なしに全 WORKS 共通で担保する。
// 対象は「壊れていない」ことの構造保証のみ——本文の充実（monologue/spark/creed/
// confidence 等の存在）は完成作品だけの richness で、骨組み作品には無いため、
// ここには含めず各作品固有のテストに残す（skeleton 作品もこのヘルパーを通せる）。
// 作品固有 assertion（hidenaga の 4-a crisis・katsu の people≤14・saveKey 分離など）も
// 各作品のテストに局所化する。作品を1つ足すと、このヘルパーで構造検証が自動で付いてくる。
import { it, expect } from 'vitest';
import type { Work } from '../../src/engine/types';
import { sceneGeo } from '../../src/engine/map/sceneMap';
import { VH, VW, layoutStars, starBox } from '../../src/engine/art/constellation';

/**
 * Scene-map keys that point at no scene in the work. `sceneMaps` is keyed by scene id across the
 * whole work (same contract as `sceneFaceOverrides`), and a mistyped key raises nothing: the map is
 * simply never drawn and the scene falls back to its chapter's default location. Exported as a plain
 * predicate so the gate below and its negative fixture run the same code.
 */
export function danglingSceneMapKeys(work: Work): string[] {
  const sceneIds = new Set(work.story.chapters.flatMap((c) => Object.keys(c.scenes)));
  return Object.keys(work.map.sceneMaps).filter((sid) => !sceneIds.has(sid));
}

/**
 * ★Q 観察ビューの構造エラー（人が読める文字列の配列。空＝健全）。
 *
 * hotspot id は作品全体で一意でなければならない——gate（`gatedOn`）は章をまたいで引く
 * ので（「昔の絵に、今の目で新しい発見が出る」）、シーン内で閉じた検査では足りない。
 * ゲート本体と negative fixture が同じコードを走るよう、素の述語として export する
 * （danglingSceneMapKeys と同じ理由。出荷データに observe がまだ無い間、この述語の
 * ブランチを踏ませるのは tests/observe.test.ts の合成 fixture だけ）。
 */
export function observeErrors(work: Work): string[] {
  const errs: string[] = [];
  const withObserve = work.story.chapters.flatMap((c) =>
    Object.entries(c.scenes).flatMap(([sid, sc]) => (sc.observe ? [[sid, sc.observe] as const] : [])),
  );
  const all = new Set(withObserve.flatMap(([, spec]) => spec.hotspots.map((h) => h.id)));
  const seen = new Set<string>();

  for (const [sid, spec] of withObserve) {
    if (!spec.prompt.trim()) errs.push(`${sid}: observe.prompt が空`);
    if (spec.hotspots.length === 0) errs.push(`${sid}: observe.hotspots が空`);
    for (const h of spec.hotspots) {
      if (seen.has(h.id)) errs.push(`${sid}: hotspot id "${h.id}" が重複（gate は作品全体で引く）`);
      seen.add(h.id);
      if (!h.caption.trim()) errs.push(`${sid}: hotspot "${h.id}" の caption が空`);
      // 正規化座標（0..1）。円が絵からはみ出す＝なでても届かない hotspot を作らない。
      // x は r と同じ「幅に対する比」ゆえ端まで厳密に測れるが、y は高さに対する比で、
      // 円の縦の伸び（= r × アスペクト）は絵の viewBox を見ないと決まらない
      // （closeup は 800x500 固定・地図は content-fit）。ここでは中心が枠内かまでを見て、
      // 実際の収まりは overlay を建てて測る（tests/observe.test.ts）。
      if (!(h.r > 0)) errs.push(`${sid}: hotspot "${h.id}" の r が 0 以下`);
      if (h.r > 0.5) errs.push(`${sid}: hotspot "${h.id}" の r が絵の半幅を超える`);
      if (h.x - h.r < 0 || h.x + h.r > 1) errs.push(`${sid}: hotspot "${h.id}" が絵の左右にはみ出す`);
      if (h.y < 0 || h.y > 1) errs.push(`${sid}: hotspot "${h.id}" の y が絵の外`);
      if (h.gatedOn) {
        if (h.gatedOn === h.id) errs.push(`${sid}: hotspot "${h.id}" が自分自身を gate している`);
        else if (!all.has(h.gatedOn)) errs.push(`${sid}: hotspot "${h.id}" の gatedOn="${h.gatedOn}" が解決しない`);
        // gate された essential は永久に拾えない＝「つづき」が出ないままシーンが詰む。
        if (h.essential) errs.push(`${sid}: hotspot "${h.id}" は essential なのに gatedOn を持つ（詰む）`);
      }
    }
  }
  return errs;
}

/**
 * ★R つながり図鑑の構造エラー（人が読める文字列の配列。空＝健全）。
 *
 * observeErrors と同じ理由で素の述語として export する（出荷データに graph がまだ無い間、
 * このコードのブランチを踏ませるのは tests/graph.test.ts の合成 fixture だけ＝実データが
 * 踏まないブランチは、fixture が踏ませない限り誰も検査していない）。
 *
 * この装置は「静かに壊れる」面が多い: 星は id で引き合うので、綴りを間違えた辺は例外も
 * 型エラーも出さずに**ただ灯らない**——読者には「連関が無かった」と区別が付かない。
 */
export function graphErrors(work: Work): string[] {
  const errs: string[] = [];
  const graph = work.graph;
  const hotspots = work.story.chapters.flatMap((c) =>
    Object.values(c.scenes).flatMap((sc) => sc.observe?.hotspots ?? []),
  );
  if (!graph) {
    for (const h of hotspots) {
      if (h.nodeId) errs.push(`hotspot "${h.id}" が nodeId="${h.nodeId}" を持つが work.graph が無い`);
    }
    return errs;
  }

  // 章番号なので範囲を外れれば無言で効かない（0 以下＝一度もコーチしない・章数超＝最後まで
  // コーチし続ける＝仮説を立てる遊びが最後まで穴埋めのまま）。省略は「コーチ無し」の明示。
  const coach = graph.coachUntilChapter;
  if (coach != null && (coach < 1 || coach > work.totalChapters)) {
    errs.push(`coachUntilChapter=${coach} が章の範囲外（省略＝コーチ無し）`);
  }

  const fieldKeys = new Set<string>();
  for (const f of graph.fields) {
    if (fieldKeys.has(f.key)) errs.push(`field "${f.key}" が重複`);
    fieldKeys.add(f.key);
  }

  const nodeIds = new Set<string>();
  for (const n of graph.nodes) {
    if (nodeIds.has(n.id)) errs.push(`node "${n.id}" が重複`);
    nodeIds.add(n.id);
    if (!n.star.trim()) errs.push(`node "${n.id}" の star が空`);
    // star は SVG <text>＝<ruby> を運べない（types.ts の契約）。混ぜるとタグが生で出る。
    if (n.star.includes('<ruby>')) errs.push(`node "${n.id}" の star に <ruby>（SVG text は運べない）`);
    if (!n.caption.trim()) errs.push(`node "${n.id}" の caption が空`);
    if (!fieldKeys.has(n.field)) errs.push(`node "${n.id}" の field="${n.field}" が解決しない`);
    if (n.card && !work.cards[n.card]) errs.push(`node "${n.id}" の card="${n.card}" が解決しない`);
    if (n.bornOf?.length) {
      if (n.x != null || n.y != null) errs.push(`node "${n.id}" は発明なのに x/y を持つ（居場所は辺から導く）`);
      for (const id of n.bornOf) {
        const l = graph.links.find((k) => k.id === id);
        if (!l) errs.push(`node "${n.id}" の bornOf="${id}" が解決しない`);
        else if (l.a === n.id || l.b === n.id) errs.push(`node "${n.id}" が自分を端点とする辺 "${id}" から生まれる（循環）`);
      }
    } else if (n.x == null || n.y == null) {
      errs.push(`node "${n.id}" に x/y が無い（bornOf を持たない星は作品が置く）`);
    } else if (n.x < 0 || n.x > 1 || n.y < 0 || n.y > 1) {
      errs.push(`node "${n.id}" の x/y が枠の外（正規化 0..1）`);
    }
  }

  const linkIds = new Set<string>();
  const pairs = new Set<string>();
  for (const l of graph.links) {
    if (linkIds.has(l.id)) errs.push(`link "${l.id}" が重複`);
    linkIds.add(l.id);
    if (!l.caption.trim()) errs.push(`link "${l.id}" の caption が空`);
    if (!nodeIds.has(l.a)) errs.push(`link "${l.id}" の a="${l.a}" が解決しない`);
    if (!nodeIds.has(l.b)) errs.push(`link "${l.id}" の b="${l.b}" が解決しない`);
    if (l.a === l.b) errs.push(`link "${l.id}" が同じ星をつないでいる`);
    // 辺は順不同で引かれる（linkBetween）。同じ2星に2本あると、どちらが灯るかが並び順で決まる。
    const key = [l.a, l.b].sort().join(' ');
    if (pairs.has(key)) errs.push(`link "${l.id}" が既にある組み合わせをもう一度つないでいる`);
    pairs.add(key);
  }

  // 気づきの星は、観察ビューで見つけてもらう以外に盤上へ出る道が無い。
  const named = new Set(hotspots.map((h) => h.nodeId).filter(Boolean) as string[]);
  for (const id of named) {
    if (!nodeIds.has(id)) errs.push(`hotspot の nodeId="${id}" が node に解決しない`);
  }
  for (const n of graph.nodes) {
    if (n.bornOf?.length) {
      if (named.has(n.id)) errs.push(`node "${n.id}" は発明なのに hotspot からも見つかる（生まれ方が二重）`);
    } else if (!named.has(n.id)) {
      errs.push(`node "${n.id}" を指す hotspot が無い（盤上に出る道が無い星）`);
    }
  }

  // 星座の完成形で測る（位置は状態に依らない＝一度で全部の重なり・はみ出しが見える）。
  const pos = layoutStars(graph);
  for (const n of graph.nodes) {
    if (!pos.has(n.id)) {
      errs.push(`node "${n.id}" の居場所が決まらない（bornOf の辺が解決しない・循環している）`);
    }
  }
  const boxes = graph.nodes.filter((n) => pos.has(n.id)).map((n) => ({ n, b: starBox(n.star, pos.get(n.id)!) }));
  for (const { n, b } of boxes) {
    if (b.cx - b.r < 0 || b.cx + b.r > VW || b.cy - b.r < 0 || b.cy + b.r > VH) {
      errs.push(`node "${n.id}" の星が枠からはみ出す`);
    }
    if (b.label.x0 < 0 || b.label.x1 > VW || b.label.y1 > VH) {
      errs.push(`node "${n.id}" の見出し「${n.star}」が枠からはみ出す`);
    }
  }
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const [p, q] = [boxes[i], boxes[j]];
      // 環が重なる＝どちらへ落としたか決まらない（ドラッグの標的が食い合う）。
      if (Math.hypot(p.b.cx - q.b.cx, p.b.cy - q.b.cy) < p.b.r + q.b.r) {
        errs.push(`node "${p.n.id}" と "${q.n.id}" の星が重なる`);
      }
      const [lp, lq] = [p.b.label, q.b.label];
      if (lp.x0 < lq.x1 && lq.x0 < lp.x1 && lp.y0 < lq.y1 && lq.y0 < lp.y1) {
        errs.push(`node "${p.n.id}" と "${q.n.id}" の見出しが重なる`);
      }
    }
  }
  return errs;
}

/**
 * Register the generic structural-integrity assertions for one Work.
 * Call inside a `describe` block: `describe(w.id, () => registerWorkStructure(w))`.
 * Every check is guarded for optional fields so skeleton works pass too.
 */
export function registerWorkStructure(work: Work): void {
  const faceIds = new Set(Object.keys(work.faces));
  const cardIds = new Set(Object.keys(work.cards));
  const clueIds = new Set(Object.keys(work.clues));
  const gaz = work.map.gaz;
  const routes = work.map.routes;
  const allSceneIds = new Set(
    work.story.chapters.flatMap((c) => Object.keys(c.scenes)),
  );
  const knownPerson = (pid: string) =>
    cardIds.has(pid) || faceIds.has(pid) || !!work.peopleExtra[pid];

  /* --- 章・主人公 --- */
  it('totalChapters が story の章数と一致し、章 id が 1..totalChapters', () => {
    expect(work.story.chapters.length).toBe(work.totalChapters);
    const ids = work.story.chapters.map((c) => c.id).sort((a, b) => a - b);
    expect(ids).toEqual(
      Array.from({ length: work.totalChapters }, (_, i) => i + 1),
    );
  });

  it('各章に title/lead があり、start が実在シーンを指す', () => {
    for (const ch of work.story.chapters) {
      expect(ch.title.trim(), `ch${ch.id} title`).toBeTruthy();
      expect(ch.lead.trim(), `ch${ch.id} lead`).toBeTruthy();
      expect(Object.keys(ch.scenes), `ch${ch.id} start`).toContain(ch.start);
    }
  });

  it('最終章をのぞく各章に teaser がある', () => {
    for (const ch of work.story.chapters) {
      if (ch.id === work.totalChapters) continue;
      expect(!!ch.teaser?.trim(), `ch${ch.id} teaser`).toBe(true);
    }
  });

  it('protagonistId が cards と faces に存在', () => {
    expect(work.cards[work.protagonistId], 'protagonist card').toBeTruthy();
    expect(work.faces[work.protagonistId], 'protagonist face').toBeTruthy();
  });

  /* --- 遷移（袋小路なし） --- */
  it('scene.next / choice.to が同じ章内のシーンを指す', () => {
    for (const ch of work.story.chapters) {
      const ids = new Set(Object.keys(ch.scenes));
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        if (sc.next) expect(ids.has(sc.next), `ch${ch.id} ${sid}.next → ${sc.next}`).toBe(true);
        for (const c of sc.choices ?? []) {
          expect(ids.has(c.to), `ch${ch.id} ${sid} choice.to → ${c.to}`).toBe(true);
        }
      }
    }
  });

  it('末端シーンは end / next / choices のいずれかを持つ', () => {
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        const terminal = sc.end || sc.next || (sc.choices && sc.choices.length > 0);
        expect(terminal, `ch${ch.id} ${sid} は行き先なし`).toBeTruthy();
      }
    }
  });

  /* --- カード --- */
  it('全カードが type(person|word)・name/text を持ち、ch が範囲内', () => {
    for (const [id, c] of Object.entries(work.cards)) {
      expect(['person', 'word'].includes(c.type), `${id} type=${c.type}`).toBe(true);
      expect(c.name?.trim(), `${id} name`).toBeTruthy();
      expect(c.text?.trim(), `${id} text`).toBeTruthy();
      expect(c.ch >= 1 && c.ch <= work.totalChapters, `${id} ch=${c.ch}`).toBe(true);
    }
  });

  // ★T 本物の写真（カード）。外部読込ゼロの契約ゆえ data URI 同梱で、重さは全読者が毎回運ぶ。
  it('カードの写真が data URI・alt/credit つき・1枚が重すぎない', () => {
    for (const [id, c] of Object.entries(work.cards)) {
      if (!c.photo) continue;
      expect(c.photo.src.startsWith('data:image/'), `${id} の写真が data URI でない（外部読込ゼロ）`).toBe(true);
      expect(c.photo.alt?.trim(), `${id} の写真に alt が無い`).toBeTruthy();
      // 出どころを名指すのは本作群の作法そのもの（絵にも「だれの・どこの」を付ける）。
      expect(c.photo.credit?.trim(), `${id} の写真に credit が無い`).toBeTruthy();
      expect(c.photo.src.length, `${id} の写真が重い（1枚 ≤120KB）`).toBeLessThanOrEqual(120_000);
    }
  });

  it('全 person カードに faces がある', () => {
    for (const [id, c] of Object.entries(work.cards)) {
      if (c.type === 'person') expect(faceIds.has(id), `person face ${id}`).toBe(true);
    }
  });

  /* --- 参照（card/clue） --- */
  it('onEnter / choice / hist の card 参照がすべて cards に存在', () => {
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        const refs: string[] = [];
        if (sc.onEnter?.card) refs.push(sc.onEnter.card);
        for (const c of sc.onEnter?.cards ?? []) refs.push(c);
        for (const c of sc.choices ?? []) {
          if (c.card) refs.push(c.card);
          if (c.hist?.card) refs.push(c.hist.card);
        }
        for (const id of refs) expect(cardIds.has(id), `ch${ch.id} ${sid} card ${id}`).toBe(true);
      }
    }
  });

  it('onEnter / choice / hist の clue 参照がすべて clues に存在', () => {
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        const refs: string[] = [];
        if (sc.onEnter?.clue) refs.push(sc.onEnter.clue);
        for (const c of sc.onEnter?.clues ?? []) refs.push(c);
        for (const c of sc.choices ?? []) {
          if (c.clue) refs.push(c.clue);
          if (c.hist?.clue) refs.push(c.hist.clue);
        }
        for (const id of refs) expect(clueIds.has(id), `ch${ch.id} ${sid} clue ${id}`).toBe(true);
      }
    }
  });

  it('mentions の pid が faces と cards に解決する', () => {
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        for (const pid of sc.mentions ?? []) {
          expect(faceIds.has(pid) && cardIds.has(pid), `ch${ch.id} ${sid} mentions ${pid}`).toBe(true);
        }
      }
    }
  });

  /* --- 顔・タイトル・主人公顔 --- */
  // 入口の型（docs/design/engagement.md §14 型1）。読み通し検査で 7/7 の読者が
  // 「知らない顔が ならんで いるだけ」と答えた顔ならべ装置を廃したので、その代わりに
  // ①知識ゼロで刺さる具体（titleHook）が必ずある ②謎は行為を並べてから問う、を要求する。
  it('入口: titleHook があり、謎は「なぜ」から始めない（行為を並べてから問う）', () => {
    const hook = work.strings.titleHook;
    expect(hook?.trim(), 'titleHook').toBeTruthy();
    expect(hook, 'titleHook は副題の言い換えでない').not.toBe(work.strings.titleSub);
    expect(work.riddle.startsWith('なぜ'), 'riddle が「なぜ」始まり').toBe(false);
    expect(work.riddle.includes('？'), 'riddle に問いが残っている').toBe(true);
  });

  it('protagonistFacesByChapter の値・protagonistStages のキーが faces に解決する', () => {
    for (const key of Object.values(work.protagonistFacesByChapter ?? {})) {
      expect(faceIds.has(key), `byChapter ${key}`).toBe(true);
    }
    for (const key of Object.keys(work.protagonistStages ?? {})) {
      expect(faceIds.has(key), `stage ${key}`).toBe(true);
    }
  });

  /* --- 相関図 --- */
  it('相関図の pid が card/face/peopleExtra に解決し、cat が cats に存在', () => {
    const catKeys = new Set(work.relations?.cats.map((c) => c.key) ?? []);
    for (const e of work.relations?.edges ?? []) {
      expect(knownPerson(e.pid), `edge pid ${e.pid}`).toBe(true);
      expect(catKeys.has(e.cat), `edge cat ${e.cat}`).toBe(true);
    }
  });

  /* --- 地図 --- */
  // sceneMaps は sceneFaceOverrides と同じ契約（作品全体で一意なシーン id をキーにする）だが、
  // キーの実在検査は override 側にしかなかった。キーを打ち間違えた地図は例外も型エラーも出さず、
  // ただ描かれない（そのシーンは章の既定地図にフォールバックする）＝全検査 green のまま
  // 執筆したはずのビジュアルが消える。visual-coverage レポートには「未執筆」として現れるが、
  // 執筆中の作品ではそれが正常な状態なので、レポートを読む人間の目にも紛れる。
  it('SCENE_MAPS のキーが実在シーンを指す', () => {
    expect(danglingSceneMapKeys(work), 'sceneMaps に実在しないシーン id のキーがある').toEqual([]);
  });

  it('CHAPTER_POINTS / MAPPOINTS / marker.at がすべて GAZ に存在', () => {
    for (const [ch, at] of Object.entries(work.map.chapterPoints)) {
      expect(gaz[at], `ch${ch} point=${at}`).toBeTruthy();
    }
    for (const p of work.map.mapPoints) expect(gaz[p.id], `mappoint ${p.id}`).toBeTruthy();
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      for (const m of def.markers ?? []) expect(gaz[m.at], `${sid} marker.at=${m.at}`).toBeTruthy();
    }
  });

  // Same silent-failure shape as a dangling scene key, one level deeper: `geo` names a stage in
  // `geos`, and a mistyped name raises nothing — the scene just falls back to the home geo and the
  // map is drawn in the wrong world. It still renders, still has all its markers, and still looks
  // like a map; katsu ch3 would quietly go back to being the Tokyo map this stage exists to replace.
  it('SCENE_MAPS の geo が geos のキーに解決する', () => {
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      if (!def.geo) continue;
      expect(work.map.geos?.[def.geo], `${sid} geo=${def.geo} が geos にない`).toBeTruthy();
    }
  });

  // A gaz place is written once in real [lon,lat] and projected by whichever geo the scene is staged
  // in — and a projection only spans 360° of longitude ONCE. A place more than half a turn from
  // `lonmin` is not off the edge, it is on the FAR SIDE: San Francisco's real -122.42°E is 251° west
  // of Japan's lonmin (128.6°E), so the Japan geo puts it ~24,000 units west of Kyushu, and katsu's
  // ch1 arrow — which borrowed sf purely to mean "east" — silently swung round to point due west at
  // Kyushu the moment sf became a real coordinate. Nothing else noticed: the marker resolves, the
  // arrow draws, the tests were green. (A `wrap` geo has no far side within its own band, since a
  // western-hemisphere lon normalizes to its eastward continuation first — see Geo.proj.wrap.)
  it('marker の gaz が、そのシーンの geo の経度ドメインの「近い側」にある', () => {
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      const proj = sceneGeo(work, sid).proj;
      for (const m of def.markers ?? []) {
        const g = gaz[m.at];
        if (!g || g.lon == null) continue; // px placeholders (headings) carry no longitude
        let d = g.lon - proj.lonmin;
        if (proj.wrap && d < 0) d += 360;
        expect(
          Math.abs(d) <= 180,
          `${sid} marker ${m.at} (lon=${g.lon}) は geo(lonmin=${proj.lonmin}) の地球の裏側にある` +
            `＝方角が反転する。方角だけが要る地点は px プレースホルダにする`,
        ).toBe(true);
      }
    }
  });

  // Both are pre-projected px in the HOME geo's coordinate space (`mapPoints`, `routes[].d`), so a
  // scene staged elsewhere would draw them at meaningless positions — silently, since px is px.
  it('別の geo にステージしたシーンは route / allDots を持たない（座標系が home 固定のため）', () => {
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      if (!def.geo) continue;
      expect(def.route, `${sid} は geo=${def.geo} なのに route を持つ`).toBeFalsy();
      expect(def.allDots, `${sid} は geo=${def.geo} なのに allDots を持つ`).toBeFalsy();
    }
  });

  it('SCENE_MAPS の contested pref id がすべてシーンの GEO に存在', () => {
    // Checked against the scene's own stage: a silhouette-only overseas geo has no 令制国 at all, so
    // a `contested` written there resolves against nothing and quietly does nothing at render.
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      for (const pid of def.contested ?? []) {
        expect(sceneGeo(work, sid).pref[pid], `${sid} contested pref=${pid}`).toBeTruthy();
      }
    }
  });

  it('campaignRoutes / sceneMaps の route がすべて ROUTES に存在', () => {
    for (const r of work.map.campaignRoutes) {
      expect(routes[r.key], `campaignRoute ${r.key}`).toBeTruthy();
    }
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      if (def.route) expect(routes[def.route], `${sid} route=${def.route}`).toBeTruthy();
    }
  });

  it('SCENE_MAPS marker.people が faces / cards / peopleExtra に解決する', () => {
    for (const [sid, def] of Object.entries(work.map.sceneMaps)) {
      for (const m of def.markers ?? []) {
        for (const pid of m.people ?? []) {
          expect(knownPerson(pid), `${sid} people ${pid}`).toBe(true);
        }
      }
    }
  });

  /* --- 収集・メーター --- */
  it('手がかりが各章に 1 つ以上あり、ch が範囲内', () => {
    for (const [id, c] of Object.entries(work.clues)) {
      expect(c.ch >= 1 && c.ch <= work.totalChapters, `clue ${id} ch=${c.ch}`).toBe(true);
    }
    const covered = new Set(Object.values(work.clues).map((c) => c.ch));
    for (let ch = 1; ch <= work.totalChapters; ch++) {
      expect(covered.has(ch), `ch${ch} に手がかりがない`).toBe(true);
    }
  });

  it('年表の ch がすべて範囲内', () => {
    for (const t of work.timeline) {
      expect(t.ch >= 1 && t.ch <= work.totalChapters, `timeline ${t.y} ch=${t.ch}`).toBe(true);
    }
  });

  it('メーターの key が一意', () => {
    const keys = work.meters?.defs.map((d) => d.key) ?? [];
    expect(new Set(keys).size).toBe(keys.length);
  });

  /* --- ★N 表情オーバーライド・reveal・figure --- */
  it('sceneFaceOverrides のシーン id が実在し、顔キー・pid が解決する', () => {
    for (const [sid, m] of Object.entries(work.sceneFaceOverrides ?? {})) {
      expect(allSceneIds.has(sid), `override scene ${sid}`).toBe(true);
      for (const [pid, key] of Object.entries(m)) {
        expect(work.faces[key], `${sid} ${pid} → ${key}`).toBeTruthy();
        expect(work.cards[pid] || work.peopleExtra[pid], `${sid} pid ${pid}`).toBeTruthy();
      }
    }
  });

  it('Scene.reveal は title/caption を持ち、face が解決する', () => {
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        if (!sc.reveal) continue;
        expect(sc.reveal.title.trim(), `${sid} reveal.title`).toBeTruthy();
        expect(sc.reveal.caption.trim(), `${sid} reveal.caption`).toBeTruthy();
        if (sc.reveal.face) expect(work.faces[sc.reveal.face], `${sid} reveal.face`).toBeTruthy();
      }
    }
  });

  it('Scene.figure が work.figures のキーに解決する', () => {
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        if (sc.figure) expect(work.figures?.[sc.figure], `${sid} figure=${sc.figure}`).toBeTruthy();
      }
    }
  });

  /* --- ★Q 観察ビュー --- */
  it('Scene.observe の hotspot が構造健全（id 一意・枠内・gate 解決・essential が詰まない）', () => {
    expect(observeErrors(work)).toEqual([]);
  });

  /* --- ★R つながり図鑑 --- */
  it('work.graph が構造健全（id 一意・参照が解決・星が重ならない・盤上に出る道がある）', () => {
    expect(graphErrors(work)).toEqual([]);
  });

  /* --- 出どころ（hist.source）の設計ルール --- */
  it('hist.source は grade 3値・name 非空で、moshimo/answer/「心」には付かない', () => {
    const GRADES = new Set(['contemporary', 'later', 'tale']);
    for (const ch of work.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        for (const c of sc.choices ?? []) {
          const src = c.hist?.source;
          if (!src) continue;
          expect(GRADES.has(src.grade), `${sid} source.grade=${src.grade}`).toBe(true);
          expect(src.name?.trim(), `${sid} source.name`).toBeTruthy();
          const forbidden = c.hist?.moshimo === true || c.answer != null || c.hist?.seal === '心';
          expect(forbidden, `${sid} は source を付けてはいけないパネル`).toBe(false);
        }
      }
    }
  });
}
