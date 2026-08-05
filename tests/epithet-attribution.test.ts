// ★人物への評価語（レッテル）のゲート。規則は docs/WRITING.md 4「評価語は だれがそう呼ぶかで持つ」
// （検査の実装と面の定義は scripts/lib/epithet-audit.ts のヘッダ、型の由来は
// docs/design/engagement.md §20-5）。
//
// なぜ要るか: davinci 5 の岐路で、小5・中1・VISION 監査の3軸が独立に同じ語を指した
// （中1「選ぶ前に採点表を渡された」）。⚠️ **他6作は同じ規律をすでに守っていた**——kiyomori 24件・
// katsu 11件が全件「」＋帰属で、davinci だけが15件すべて地の文の断定だった。known-premise の
// ときと同じ形＝**名前を持たない規律は次作で必ず再発する**ので、名前と計器を与える。
//
// ラチェットの帳簿を持たない（name-continuity と同じ）＝**全作 0 で入れられたから**。
// 審査して裸のまま残すと決めた出現は ALLOWED_EPITHET へ理由つきで（＝逃し口は出現ごと）。
//
// **0 件は「英雄化していない」ではない**: 語は手で選んだリストで、リストの外の語（「江戸を 救った」
// のような**行為での持ち上げ**）は見えない。床＝ここ、天井＝/eval-work の VISION 監査。
import { describe, it, expect } from 'vitest';
import { ALL_WORKS } from './helpers/all-works';
import {
  ALLOWED_EPITHET,
  allowedKeysInUse,
  auditWork,
  epithetSurfaces,
} from '../scripts/lib/epithet-audit';

describe('epithet-attribution: 人物への評価語は だれがそう呼ぶかで持つ', () => {
  for (const work of ALL_WORKS) {
    it(`${work.id}: 帰属の無い評価語 0件`, () => {
      const hits = auditWork(work).filter((h) => !h.allowed);
      expect(
        hits.length,
        `語り手が人物を断じている（「」＋だれがそう呼ぶか に直す・現物は npx vite-node scripts/epithet-audit.ts ${work.id}）:\n${hits
          .map((h) => `  ${h.strict ? '[ラベル面]' : ''}${h.surface} 「${h.term}」 …${h.excerpt}…`)
          .join('\n')}`,
      ).toBe(0);
    });
  }

  it('ALLOWED_EPITHET が実データと合う（消えた許可を赤にする）', () => {
    expect(Object.keys(ALLOWED_EPITHET).sort()).toEqual(allowedKeysInUse(ALL_WORKS));
  });

  // 空回りの防止（ruby ゲートの初版はキーの prefix 欠落で何も守っていなかった／§20-5 の
  // CONDITIONAL は 19件の較正が分岐を1文字も踏んでいなかった）。守りたい違反ごとに1本。
  it('注入した評価語を検出する（裸／帰属／札／長い引用／複合語）', () => {
    const bare = ALL_WORKS[0];
    const hitsOf = (text: string) => {
      const w = {
        ...bare,
        id: 'x',
        strings: { ...bare.strings, titleMain: '', titleSub: '', titleHook: '', titleNote: '' },
        riddle: '',
        cards: {},
        clues: {},
        timeline: [],
        relations: undefined,
        graph: undefined,
        map: { ...bare.map, sceneMaps: {}, mapPoints: [], chapterCaptions: {} },
        hidden: { lockedText: '', body: '', completeText: '' },
        story: {
          chapters: [
            { id: 9, num: '', title: '', lead: '', start: '9-z', scenes: { '9-z': { text } } },
          ],
        },
      } as unknown as (typeof ALL_WORKS)[number];
      return auditWork(w).map((h) => h.term);
    };
    // 裸の断定＝赤
    expect(hitsOf('きみは <ruby>暴君<rt>ぼうくん</rt></ruby>に 仕えた')).toEqual(['暴君']);
    // だれがそう呼ぶか＝緑
    expect(hitsOf('この 男を「暴君」と 呼ぶ 人も いる')).toEqual([]);
    expect(hitsOf('西郷は 逆賊と された')).toEqual([]);
    // 札として掲げた（かっこの中が語ほぼそのもの）＝緑
    expect(hitsOf('それが「天下の 悪女」の 話の もとに なる')).toEqual([]);
    // 長い引用でも、閉じかっこの直後に帰属があれば緑
    expect(hitsOf('「天下の 悪女が 家を ほろぼした」という 話の 形は')).toEqual([]);
    // 語り手がレッテルを引き受けない形＝緑
    expect(hitsOf('「信長と 渡り合う 英雄」では まだ なく')).toEqual([]);
    // ⚠️ §20-5 の欠陥そのもの: **読者自身の台詞**に語り手の判定を入れた形は緑にしない
    expect(hitsOf('きみは 言った。「暴君の 手つだいは しない」')).toEqual(['暴君']);
    // 人物に貼る札でない複合語は拾わない
    expect(hitsOf('<ruby>英雄<rt>えいゆう</rt></ruby>物語に しすぎないのが、正しい')).toEqual([]);
    // かっこ無しの否定（この分岐だけ較正が踏んでいなかった）＝緑
    expect(hitsOf('この 男は 英雄では ない')).toEqual([]);
    // 一度着せたら、そのあとの散文は裸で使える（読者が背負った代償）
    expect(hitsOf('「暴君」と 呼ばれた 男だ。<p>暴君の ための 地図。</p>')).toEqual([]);
  });

  // ⚠️ 面は place・本文・内語…を SEP で連ねた1本の文字列＝**帰属の窓が欄をまたぐと見逃す**
  // （前の欄の裸の評価語が、次の欄の先頭の帰属語を拾う）。見逃しは件数が減る方向にしか
  // 現れないので、0件運用では気づけない。走査面の取りこぼしも同じ形なので一緒に張る。
  it('欄をまたいだ帰属を拾わない／ミニゲーム・出典名・写真クレジットも読者面', () => {
    const bare = ALL_WORKS[0];
    const sceneWork = (scene: Record<string, unknown>, extra: Record<string, unknown> = {}) =>
      ({
        ...bare,
        id: 'x',
        strings: { ...bare.strings, titleMain: '', titleSub: '', titleHook: '', titleNote: '' },
        riddle: '',
        cards: {},
        clues: {},
        timeline: [],
        relations: undefined,
        graph: undefined,
        map: { ...bare.map, sceneMaps: {}, mapPoints: [], chapterCaptions: {} },
        hidden: { lockedText: '', body: '', completeText: '' },
        story: {
          chapters: [
            { id: 9, num: '', title: '', lead: '', start: '9-z', scenes: { '9-z': scene } },
          ],
        },
        ...extra,
      }) as unknown as (typeof ALL_WORKS)[number];
    const terms = (w: (typeof ALL_WORKS)[number]) => auditWork(w).map((h) => h.term);
    // 「暴君」は place の中で裸。次の欄（内語）の「呼ばれた」は別の画面部品＝帰属にしない
    expect(terms(sceneWork({ place: 'ここは 暴君', monologue: '呼ばれた 場所らしい' }))).toEqual(['暴君']);
    // ミニゲーム・hist の出典名・カードの写真クレジットも読者が開かずに読む面
    expect(
      terms(sceneWork({ text: 'x', minigame: { type: 'sort', title: '暴君の 段取り', items: ['a'] } })),
    ).toEqual(['暴君']);
    expect(
      terms(
        sceneWork({
          text: 'x',
          choices: [{ label: 'y', to: '9-z', hist: { verdict: '', match: '', body: '', source: { name: '暴君記' } } }],
        }),
      ),
    ).toEqual(['暴君']);
    expect(
      terms(
        sceneWork({ text: 'x' }, { cards: { c: { type: 'person', ch: 9, name: 'n', text: 't', photo: { credit: '暴君の 肖像' } } } }),
      ),
    ).toEqual(['暴君']);
  });

  // ラベル面＝短くて文脈を持てない面。ここは「着せ済み」でも裸を通さない（岐路の問いと
  // 選択肢ラベルが入るのが §20-5 の中身）。面が走査に載っていること自体も直に確かめる。
  it('ラベル面は 着せ済みでも裸を通さない（問い・選択肢・relations・地図・年表・手帳）', () => {
    const bare = ALL_WORKS[0];
    const w = {
      ...bare,
      id: 'x',
      strings: { ...bare.strings, titleMain: '', titleSub: '', titleHook: '', titleNote: '' },
      riddle: '',
      cards: {},
      clues: {},
      graph: undefined,
      hidden: { lockedText: '', body: '', completeText: '' },
      timeline: [{ y: '1502', ch: 5, t: '', d: '暴君ボルジアに 従う' }],
      relations: { cats: [], edges: [{ pid: 'p', rel: '仕えた 暴君', cat: 'patron' }] },
      map: {
        ...bare.map,
        sceneMaps: { '9-z': { markers: [{ at: 'x', kind: 'castle', label: 'イモラ', note: '暴君の 陣' }] } },
        mapPoints: [],
        chapterCaptions: { 9: '暴君ボルジアの 軍事技師に' },
      },
      story: {
        chapters: [
          {
            id: 9,
            num: '',
            title: '',
            lead: '',
            start: '9-z',
            scenes: {
              '9-z': {
                text: 'この 男を「暴君」と 呼ぶ 人も いる',
                q: 'きみは この 暴君に 力を 貸す？',
                choices: [{ label: '暴君に 従う', to: '9-z' }],
              },
            },
          },
        ],
      },
    } as unknown as (typeof ALL_WORKS)[number];
    expect(auditWork(w).map((h) => h.surface)).toEqual([
      'ch9/9-z#q',
      'ch9/9-z#label0',
      'timeline:0',
      'relation:p',
      'map:9-z',
      'notebook:map9',
    ]);
    // 実データでも面が空でない（面はあるのに中身を渡していない、を防ぐ）
    for (const work of ALL_WORKS) {
      const ids = new Set(epithetSurfaces(work).map((s) => s.id.split(':')[0].split('#')[0]));
      expect(ids.has('entry'), `${work.id} の入口が走査に無い`).toBe(true);
      expect(
        epithetSurfaces(work).filter((s) => s.strict).length,
        `${work.id} のラベル面が空`,
      ).toBeGreaterThan(10);
    }
  });
});
