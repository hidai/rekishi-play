// ★R つながり図鑑の純粋ロジックと幾何（DOM なし）。
// 出荷データにまだ graph は無いので、ここは合成 fixture で全分岐を踏ませる
// ——ゲートは「出荷データが踏むブランチ」しか守らない（2026-07-16 の学び）。
import { describe, it, expect } from 'vitest';
import {
  bornNodes,
  canLink,
  coachTargets,
  graphProgress,
  knownNodeIds,
  linkBetween,
  litLinks,
  makeLink,
  newlyBorn,
  observedNodeIds,
  readerChapter,
} from '../src/engine/graph';
import {
  STAR_R,
  VH,
  VW,
  buildConstellation,
  hitStar,
  layoutStars,
  starBox,
  starLabelWidth,
} from '../src/engine/art/constellation';
import { graphErrors } from './helpers/work-structure';
import type { Work, WorkGraph } from '../src/engine/types';

/**
 * 水 ── 髪（似た かたち）／水 ── 心臓 で「渦」が生まれる、という最小の星座。
 * 発明（uzu）は2本の辺から生まれる＝bornOf の複数形と重心の両方を踏む。
 */
const GRAPH: WorkGraph = {
  coachUntilChapter: 2,
  fields: [
    { key: 'water', label: '<ruby>水<rt>みず</rt></ruby>の こと', color: '#2A4A6B' },
    { key: 'body', label: 'からだの こと', color: '#B23A2E' },
  ],
  nodes: [
    { id: 'mizu', star: 'みずの うず', caption: '<ruby>水<rt>みず</rt></ruby>は まわる', field: 'water', x: 0.2, y: 0.25 },
    { id: 'kami', star: 'かみの カール', caption: 'かみも まわる', field: 'body', x: 0.8, y: 0.25 },
    { id: 'shinzo', star: 'しんぞう', caption: '<ruby>血<rt>ち</rt></ruby>も まわる', field: 'body', x: 0.5, y: 0.8 },
    {
      id: 'uzu',
      star: 'うずの ちから',
      caption: 'まわる ものは にている',
      field: 'water',
      bornOf: ['l-mizu-kami', 'l-mizu-shinzo'],
      card: 'c-uzu',
    },
  ],
  links: [
    { id: 'l-mizu-kami', a: 'mizu', b: 'kami', caption: 'にた かたち' },
    { id: 'l-mizu-shinzo', a: 'mizu', b: 'shinzo', caption: 'にた ながれ' },
  ],
};

/** hotspot が星に化ける道（Scene.observe.nodeId）まで含んだ作品。 */
const WORK = {
  cards: { 'c-uzu': { type: 'word', name: 'うず', text: 'あ', ch: 1 } },
  graph: GRAPH,
  story: {
    chapters: [
      {
        id: 1,
        scenes: {
          '1-a': {
            observe: {
              prompt: 'なにが 見える？',
              hotspots: [
                { id: 'h-mizu', x: 0.3, y: 0.5, r: 0.06, caption: 'うず', nodeId: 'mizu' },
                { id: 'h-kami', x: 0.7, y: 0.5, r: 0.06, caption: 'カール', nodeId: 'kami' },
                // 星にならない気づき（nodeId 無し）＝拾えるが つなげない。
                { id: 'h-plain', x: 0.5, y: 0.2, r: 0.05, caption: 'ただの 気づき' },
              ],
            },
          },
          '2-a': {
            observe: {
              prompt: 'ここは？',
              hotspots: [{ id: 'h-shinzo', x: 0.5, y: 0.5, r: 0.06, caption: 'しんぞう', nodeId: 'shinzo' }],
            },
          },
        },
      },
    ],
  },
} as unknown as Work;

const known = (...ids: string[]) => new Set(ids);

describe('graph: 見つけた気づきが星になる', () => {
  it('hotspot id → nodeId を作品全体から引く（章をまたぐ）', () => {
    expect([...observedNodeIds(WORK, ['h-mizu', 'h-shinzo'])]).toEqual(['mizu', 'shinzo']);
  });

  it('見つけていない hotspot の星は出ない', () => {
    expect([...observedNodeIds(WORK, [])]).toEqual([]);
  });

  it('nodeId を持たない気づきは星にならない（拾えるが つなげない）', () => {
    expect([...observedNodeIds(WORK, ['h-plain'])]).toEqual([]);
  });
});

describe('graph: 盤上の星', () => {
  it('気づきの星は見つけたものだけ、発明は辺が揃うまで出ない', () => {
    expect([...knownNodeIds(GRAPH, known('mizu', 'kami'), [])].sort()).toEqual(['kami', 'mizu']);
  });

  it('発明は bornOf の辺が すべて灯って生まれる（一部では出ない）', () => {
    expect(bornNodes(GRAPH, ['l-mizu-kami']).map((n) => n.id)).toEqual([]);
    expect(bornNodes(GRAPH, ['l-mizu-kami', 'l-mizu-shinzo']).map((n) => n.id)).toEqual(['uzu']);
  });

  it('生まれた発明も盤上の星になる（次の辺の端点になれる）', () => {
    const k = knownNodeIds(GRAPH, known('mizu', 'kami', 'shinzo'), ['l-mizu-kami', 'l-mizu-shinzo']);
    expect(k.has('uzu')).toBe(true);
  });

  it('見つけていない気づきは、辺が灯っていても盤上に出ない', () => {
    expect([...knownNodeIds(GRAPH, known(), ['l-mizu-kami'])]).toEqual([]);
  });
});

describe('graph: 線を引く', () => {
  it('辺は順不同（どちらから重ねても同じ1本）', () => {
    expect(linkBetween(GRAPH, 'kami', 'mizu')?.id).toBe('l-mizu-kami');
    expect(linkBetween(GRAPH, 'mizu', 'kami')?.id).toBe('l-mizu-kami');
  });

  it('書かれた連関だけが灯る', () => {
    const k = known('mizu', 'kami', 'shinzo');
    expect(canLink(GRAPH, k, [], 'mizu', 'kami')?.id).toBe('l-mizu-kami');
    // 髪と心臓は「にている」かもしれないが、作品が書いていない＝まだ つながらない。
    expect(canLink(GRAPH, k, [], 'kami', 'shinzo')).toBeNull();
  });

  it('盤上に無い星・同じ星・灯り済みの辺は、すべて同じ「何も起きない」で返る', () => {
    expect(canLink(GRAPH, known('mizu'), [], 'mizu', 'kami')).toBeNull();
    expect(canLink(GRAPH, known('mizu'), [], 'mizu', 'mizu')).toBeNull();
    expect(canLink(GRAPH, known('mizu', 'kami'), ['l-mizu-kami'], 'mizu', 'kami')).toBeNull();
  });

  it('灯すのは一度きり（二度目は集合が不変＝アニメも鳴らない）', () => {
    expect(makeLink([], 'l-mizu-kami')).toEqual({ links: ['l-mizu-kami'], isNew: true });
    expect(makeLink(['l-mizu-kami'], 'l-mizu-kami')).toEqual({ links: ['l-mizu-kami'], isNew: false });
  });

  it('litLinks は作品の並び順で返し、消えた id は落とす（データが変わったセーブ）', () => {
    expect(litLinks(GRAPH, ['l-mizu-shinzo', 'l-mizu-kami', 'gone']).map((l) => l.id)).toEqual([
      'l-mizu-kami',
      'l-mizu-shinzo',
    ]);
  });

  it('序盤のコーチは「いま灯る相手」だけを返す', () => {
    const k = known('mizu', 'kami', 'shinzo');
    expect(coachTargets(GRAPH, k, [], 'mizu', 1)).toEqual(['kami', 'shinzo']);
    expect(coachTargets(GRAPH, k, ['l-mizu-kami'], 'mizu', 1)).toEqual(['shinzo']);
    // 相手がまだ盤上に無ければ、コーチも何も指せない。
    expect(coachTargets(GRAPH, known('kami', 'shinzo'), [], 'kami', 1)).toEqual([]);
  });

  it('★コーチの窓は引数で閉じる（外では誰が呼んでも答えを返さない）', () => {
    const k = known('mizu', 'kami', 'shinzo');
    expect(coachTargets(GRAPH, k, [], 'mizu', 2)).toEqual(['kami', 'shinzo']);
    expect(coachTargets(GRAPH, k, [], 'mizu', 3)).toEqual([]);
  });

  it('★coachUntilChapter を書かない作品は一度もコーチされない（既定は安全側）', () => {
    const g = { ...GRAPH, coachUntilChapter: undefined };
    expect(coachTargets(g, known('mizu', 'kami'), [], 'mizu', 1)).toEqual([]);
  });

  it('★生きた章が無い（null）ときもコーチしない＝窓の外と同じ扱い（ホーム・再訪・読了）', () => {
    expect(coachTargets(GRAPH, known('mizu', 'kami', 'shinzo'), [], 'mizu', null)).toEqual([]);
  });
});

describe('graph: 読者は今どの章か（コーチの窓を開ける源）', () => {
  it('再開地点の章を返す（scene.ch）', () => {
    expect(readerChapter({ ch: 3 })).toBe(3);
  });

  it('再開地点が無ければ null（＝コーチしない安全側。読了で scene=null／ホームで未設定）', () => {
    expect(readerChapter(null)).toBeNull();
    expect(readerChapter(undefined)).toBeNull();
  });
});

describe('graph: 発明が生まれた瞬間（ペインが祝う対象）', () => {
  it('最後の1本を灯した時だけ生まれる（それまでは何も生まれない）', () => {
    expect(newlyBorn(GRAPH, [], ['l-mizu-kami'])).toEqual([]);
    expect(newlyBorn(GRAPH, ['l-mizu-kami'], ['l-mizu-kami', 'l-mizu-shinzo']).map((n) => n.id)).toEqual(['uzu']);
  });

  it('もう生まれている発明は、二度は生まれない（音もカードも二度は出ない）', () => {
    const both = ['l-mizu-kami', 'l-mizu-shinzo'];
    expect(newlyBorn(GRAPH, both, [...both, 'gone'])).toEqual([]);
  });

  it('生まれた星はカードを連れてくる（ペインが grant する id）', () => {
    expect(newlyBorn(GRAPH, ['l-mizu-kami'], ['l-mizu-kami', 'l-mizu-shinzo'])[0].card).toBe('c-uzu');
  });
});

describe('graph: 進み具合', () => {
  it('数えるのは灯した数だけ（辺の総数は出さない＝穴埋めにしない）', () => {
    expect(graphProgress(GRAPH, known('mizu', 'kami', 'shinzo'), [])).toEqual({
      stars: 3,
      links: 0,
      inventions: 0,
    });
    expect(graphProgress(GRAPH, known('mizu', 'kami', 'shinzo'), ['l-mizu-kami', 'l-mizu-shinzo'])).toEqual({
      stars: 4, // 発明が1つ生まれて星が増える
      links: 2,
      inventions: 1,
    });
  });
});

describe('constellation: 幾何', () => {
  it('気づきの星は作品が置いた場所（正規化 → 枠）', () => {
    expect(layoutStars(GRAPH).get('mizu')).toEqual({ x: 0.2 * VW, y: 0.25 * VH });
  });

  it('発明は、それを生んだ辺の端点の重心に立つ', () => {
    // mizu(200,175) / kami(800,175) / shinzo(500,560) の重心
    const p = layoutStars(GRAPH).get('uzu')!;
    expect(p.x).toBeCloseTo(500);
    expect(p.y).toBeCloseTo((175 + 175 + 560) / 3);
  });

  it('居場所は盤上の状態に依らない（＝検査は完成形を一度で測れる）', () => {
    expect(layoutStars(GRAPH).size).toBe(4);
  });

  it('発明が発明から生まれても解ける（不動点まで回す）', () => {
    const g: WorkGraph = {
      fields: GRAPH.fields,
      nodes: [
        ...GRAPH.nodes,
        { id: 'far', star: 'その さき', caption: 'さらに さき', field: 'water', bornOf: ['l-uzu-shinzo'] },
      ],
      links: [...GRAPH.links, { id: 'l-uzu-shinzo', a: 'uzu', b: 'shinzo', caption: 'その さき' }],
    };
    expect(layoutStars(g).has('far')).toBe(true);
  });

  it('解けない星（辺が dangling・循環）は返さない＝ゲートが落とす', () => {
    const g: WorkGraph = {
      fields: GRAPH.fields,
      nodes: [GRAPH.nodes[0], { id: 'x', star: 'わ', caption: 'あ', field: 'water', bornOf: ['nope'] }],
      links: [],
    };
    expect(layoutStars(g).has('x')).toBe(false);
  });

  it('見出しの幅は字数でなく墨で測る（半角は半字）', () => {
    expect(starLabelWidth('みず')).toBeCloseTo(48);
    expect(starLabelWidth('ab')).toBeCloseTo(24);
  });

  it('見出しの箱は星の下（当たり円と重ならない）', () => {
    const b = starBox('みず', { x: 500, y: 350 });
    expect(b.label.y0).toBeGreaterThan(b.cy + b.r * 0.5);
  });
});

describe('constellation: 指の当たり判定', () => {
  const pos = layoutStars(GRAPH);
  const k = known('mizu', 'kami', 'shinzo');

  it('星の環の中なら当たる（環＝描く円と同じ半径＝見えているものがそのまま標的）', () => {
    expect(hitStar(GRAPH, pos, k, 200, 175)).toBe('mizu');
    expect(hitStar(GRAPH, pos, k, 200 + STAR_R - 1, 175)).toBe('mizu');
    expect(hitStar(GRAPH, pos, k, 200 + STAR_R + 2, 175)).toBeNull();
  });

  it('盤上に無い星には当たらない（伏せ札はつかめない）', () => {
    expect(hitStar(GRAPH, pos, known('kami'), 200, 175)).toBeNull();
  });

  it('重なったら中心が近い方が勝つ（データの並び順で変わらない）', () => {
    const g: WorkGraph = {
      fields: GRAPH.fields,
      nodes: [
        { id: 'p', star: 'あ', caption: 'あ', field: 'water', x: 0.5, y: 0.5 },
        { id: 'q', star: 'い', caption: 'い', field: 'water', x: 0.55, y: 0.5 },
      ],
      links: [],
    };
    const p2 = layoutStars(g);
    expect(hitStar(g, p2, known('p', 'q'), 0.54 * VW, 0.5 * VH)).toBe('q');
    expect(hitStar(g, p2, known('p', 'q'), 0.51 * VW, 0.5 * VH)).toBe('p');
  });
});

describe('constellation: SVG', () => {
  const k = known('mizu', 'kami', 'shinzo');

  it('灯っていない辺は描かない（可能な辺を先に見せない＝穴埋めにしない）', () => {
    const svg = buildConstellation(GRAPH, k, []);
    expect(svg).not.toContain('staredge');
    expect(svg).toContain('data-nid="mizu"');
  });

  it('灯った辺だけが線になる', () => {
    const svg = buildConstellation(GRAPH, k, ['l-mizu-kami']);
    expect(svg).toContain('data-eid="l-mizu-kami"');
    expect(svg).not.toContain('data-eid="l-mizu-shinzo"');
  });

  it('未発見の気づきは伏せ札、未誕生の発明は伏せ札すら出ない（生まれる驚きを食わない）', () => {
    const svg = buildConstellation(GRAPH, known('mizu'), []);
    expect((svg.match(/star-slot/g) ?? []).length).toBe(2); // kami / shinzo
    expect(svg).not.toContain('data-nid="uzu"');
  });

  it('発明が生まれると星が増える', () => {
    const svg = buildConstellation(
      GRAPH,
      knownNodeIds(GRAPH, k, ['l-mizu-kami', 'l-mizu-shinzo']),
      ['l-mizu-kami', 'l-mizu-shinzo'],
    );
    expect(svg).toContain('class="starnode invention"');
    expect(svg).toContain('data-nid="uzu"');
  });

  it('綱は指まで伸び、重ねた相手と両方が浮く', () => {
    const svg = buildConstellation(GRAPH, k, [], { from: 'mizu', x: 800, y: 175 });
    expect(svg).toContain('star-tether');
    expect(svg).toContain('x2="800"');
    expect((svg.match(/class="starnode lifted"/g) ?? []).length).toBe(2);
  });

  it('綱が どこも指していないときは、持った星だけが浮く（非連関は罰でなく空振り）', () => {
    const svg = buildConstellation(GRAPH, k, [], { from: 'mizu', x: 500, y: 60 });
    expect((svg.match(/class="starnode lifted"/g) ?? []).length).toBe(1);
  });

  it('★指が星の上にあるあいだは綱を引かない＝二タップで持ち上げても浮くだけ', () => {
    // 二タップ（a11y 代替）は指の位置が星そのもの＝離れが無い。UI 側の分岐でなく、
    // 「綱は星と指の離れを描くもの」という定義から そうなる（mizu は 200,175）。
    const held = buildConstellation(GRAPH, k, [], { from: 'mizu', x: 200, y: 175 });
    expect(held).not.toContain('star-tether');
    expect(held).toContain('class="starnode lifted"');
    // 環の中で指が少し動いただけでも まだ引かない（STAR_R=60）。
    expect(buildConstellation(GRAPH, k, [], { from: 'mizu', x: 250, y: 175 })).not.toContain('star-tether');
    // 環を出たら綱が生まれる。
    expect(buildConstellation(GRAPH, k, [], { from: 'mizu', x: 280, y: 175 })).toContain('star-tether');
  });

  it('★辺は控えであって、押すものではない（指では狙えない偽ボタンを tab 順に置かない）', () => {
    const svg = buildConstellation(GRAPH, k, ['l-mizu-kami']);
    const edge = svg.slice(svg.indexOf('<g class="staredge'), svg.indexOf('</g>'));
    expect(edge).not.toContain('role="button"');
    expect(edge).not.toContain('tabindex');
    // 星は押すもの＝role と名前を持つ（キーボードは この標的を Enter で拾う）。
    expect(svg).toContain('data-nid="mizu"');
    expect(svg).toMatch(/class="starnode"[^>]*role="button"[^>]*aria-label="みずの うず"/);
  });

  it('★序盤コーチは「いま灯る相手」だけを脈動で指す（持った星・非相手は脈動しない）', () => {
    // mizu を持ち上げ、kami/shinzo が灯る相手（coachTargets）＝その2つだけに脈動リング。
    // 指はまだ どの星の上でもない（x=200,y=60）＝lifted は持った mizu だけ。
    const coach = new Set(['kami', 'shinzo']);
    const svg = buildConstellation(GRAPH, k, [], { from: 'mizu', x: 200, y: 60 }, coach);
    // 脈動リングは相手2つぶんだけ（持った星 mizu は coach 集合に無い＝脈動しない）。
    expect((svg.match(/class="star-pulse"/g) ?? []).length).toBe(2);
    expect(svg).toContain('class="starnode lifted" data-nid="mizu"'); // 持った星＝環だけ
    // 相手は脈動を持ち、まだ環は持たない（指が その上に無い）。
    expect(svg).toContain('class="starnode coach" data-nid="kami"');
    expect(svg).toContain('class="starnode coach" data-nid="shinzo"');
  });

  it('★脈動と環は同時に立てる（相手の上に指が来た＝環＝指の下・脈動＝つながる）', () => {
    // 指を kami（800,175）へ運ぶ＝over=kami で lifted、かつ coach の相手＝両方の語彙が乗る。
    const svg = buildConstellation(GRAPH, k, [], { from: 'mizu', x: 800, y: 175 }, new Set(['kami', 'shinzo']));
    expect(svg).toContain('class="starnode lifted coach"');
  });

  it('★コーチ集合が空なら脈動は一切出ない（窓の外・持っていないとき＝ペインが空集合を渡す）', () => {
    const svg = buildConstellation(GRAPH, k, [], { from: 'mizu', x: 200, y: 60 }, new Set());
    expect(svg).not.toContain('star-pulse');
    expect(svg).not.toContain(' coach"');
  });

  it('見出しはテキストとして描く（ruby は運べない＝star の契約）', () => {
    expect(buildConstellation(GRAPH, k, [])).toContain('>みずの うず</text>');
  });

  it('id / defs を持たない（同じ面に他の SVG が居ても衝突しない）', () => {
    const svg = buildConstellation(GRAPH, k, ['l-mizu-kami']);
    expect(svg).not.toContain('<defs');
    expect(svg).not.toContain(' id=');
  });
});

describe('graph: 構造ゲート（negative fixture）', () => {
  // 出荷データに graph はまだ無い＝全 WORKS を回してもこの述語は 1 分岐も踏まない。
  const workOf = (g: WorkGraph, hotspotNodeIds: (string | undefined)[] = ['mizu', 'kami', 'shinzo']): Work =>
    ({
      cards: { 'c-uzu': {} },
      totalChapters: 3,
      graph: g,
      story: {
        chapters: [
          {
            id: 1,
            scenes: {
              '1-a': {
                observe: {
                  prompt: 'p',
                  hotspots: hotspotNodeIds.map((nid, i) => ({
                    id: `h${i}`,
                    x: 0.5,
                    y: 0.5,
                    r: 0.05,
                    caption: 'あ',
                    nodeId: nid,
                  })),
                },
              },
            },
          },
        ],
      },
    }) as unknown as Work;
  /** GRAPH を1箇所だけ壊す。 */
  const broken = (mut: (g: WorkGraph) => void, hotspots?: (string | undefined)[]): string => {
    const g = structuredClone(GRAPH);
    mut(g);
    return graphErrors(workOf(g, hotspots)).join();
  };

  it('健全なデータは何も報告しない', () => {
    expect(graphErrors(workOf(structuredClone(GRAPH)))).toEqual([]);
  });

  it('graph を持たない作品（＝いまの全 WORKS）は素通りする', () => {
    expect(graphErrors({ story: { chapters: [] } } as unknown as Work)).toEqual([]);
  });

  it('graph が無いのに hotspot が nodeId を持つ＝星に化けない気づきを捕まえる', () => {
    const w = {
      story: {
        chapters: [
          { id: 1, scenes: { '1-a': { observe: { prompt: 'p', hotspots: [{ id: 'h', nodeId: 'mizu' }] } } } },
        ],
      },
    } as unknown as Work;
    expect(graphErrors(w).join()).toMatch(/work.graph が無い/);
  });

  it('★コーチの窓が章の範囲を外れているのを捕まえる（無言で効かない／最後まで効き続ける）', () => {
    expect(broken((g) => (g.coachUntilChapter = 0))).toMatch(/coachUntilChapter=0 が章の範囲外/);
    expect(broken((g) => (g.coachUntilChapter = 9))).toMatch(/coachUntilChapter=9 が章の範囲外/);
    expect(graphErrors(workOf({ ...structuredClone(GRAPH), coachUntilChapter: undefined }))).toEqual([]);
  });

  it('id の重複を捕まえる（node / link / field）', () => {
    expect(broken((g) => g.nodes.push({ ...g.nodes[0] })).length).toBeGreaterThan(0);
    expect(broken((g) => g.nodes.push({ ...g.nodes[0] }))).toMatch(/"mizu" が重複/);
    expect(broken((g) => g.links.push({ ...g.links[0], a: 'shinzo', b: 'kami' }))).toMatch(/"l-mizu-kami" が重複/);
    expect(broken((g) => g.fields.push({ ...g.fields[0] }))).toMatch(/"water" が重複/);
  });

  it('dangling を捕まえる（辺の端点・field・card・bornOf・hotspot の nodeId）', () => {
    expect(broken((g) => (g.links[0].a = 'typo'))).toMatch(/a="typo" が解決しない/);
    expect(broken((g) => (g.nodes[0].field = 'typo'))).toMatch(/field="typo" が解決しない/);
    expect(broken((g) => (g.nodes[3].card = 'typo'))).toMatch(/card="typo" が解決しない/);
    expect(broken((g) => (g.nodes[3].bornOf = ['typo']))).toMatch(/bornOf="typo" が解決しない/);
    expect(broken((g) => g, ['mizu', 'kami', 'shinzo', 'typo'])).toMatch(/nodeId="typo" が node に解決しない/);
  });

  it('★盤上に出る道の無い星を捕まえる（どの hotspot も指していない＝永久に伏せ札）', () => {
    expect(broken((g) => g, ['mizu', 'kami'])).toMatch(/"shinzo" を指す hotspot が無い/);
  });

  it('★発明が hotspot からも見つかる二重の生まれ方を捕まえる', () => {
    expect(broken((g) => g, ['mizu', 'kami', 'shinzo', 'uzu'])).toMatch(/生まれ方が二重/);
  });

  it('居場所の矛盾を捕まえる（発明が x/y を持つ・気づきが x/y を持たない・枠の外）', () => {
    expect(broken((g) => ((g.nodes[3].x = 0.5), (g.nodes[3].y = 0.5)))).toMatch(/発明なのに x\/y/);
    expect(broken((g) => delete g.nodes[0].x)).toMatch(/"mizu" に x\/y が無い/);
    expect(broken((g) => (g.nodes[0].x = 1.4))).toMatch(/x\/y が枠の外/);
  });

  it('★循環を捕まえる（自分を端点とする辺から生まれる発明）', () => {
    expect(
      broken((g) => {
        g.links.push({ id: 'l-self', a: 'uzu', b: 'mizu', caption: 'あ' });
        g.nodes[3].bornOf = ['l-self'];
      }),
    ).toMatch(/循環/);
  });

  it('居場所が決まらない星を捕まえる（bornOf の辺が どれも解決しない）', () => {
    expect(broken((g) => (g.nodes[3].bornOf = ['typo']))).toMatch(/"uzu" の居場所が決まらない/);
  });

  it('同じ2星に2本目の辺を捕まえる（どちらが灯るかが並び順で決まってしまう）', () => {
    expect(broken((g) => g.links.push({ id: 'l-dup', a: 'kami', b: 'mizu', caption: 'あ' }))).toMatch(
      /既にある組み合わせ/,
    );
  });

  it('同じ星をつなぐ辺を捕まえる', () => {
    expect(broken((g) => (g.links[0].b = 'mizu'))).toMatch(/同じ星をつないでいる/);
  });

  it('空欄を捕まえる（star / caption）', () => {
    expect(broken((g) => (g.nodes[0].star = ' '))).toMatch(/star が空/);
    expect(broken((g) => (g.nodes[0].caption = ' '))).toMatch(/caption が空/);
    expect(broken((g) => (g.links[0].caption = ''))).toMatch(/link "l-mizu-kami" の caption が空/);
  });

  it('★star の <ruby> を捕まえる（SVG text はタグを生で出す＝家族が踏んだ事故と同じクラス）', () => {
    expect(broken((g) => (g.nodes[0].star = '<ruby>水<rt>みず</rt></ruby>'))).toMatch(/star に <ruby>/);
  });

  it('★星の重なりを捕まえる（どちらへ落としたか決まらない）', () => {
    expect(broken((g) => (g.nodes[1].x = 0.28))).toMatch(/"mizu" と "kami" の星が重なる/);
  });

  it('★見出しの重なりを捕まえる（星は離れていても字が食い合う）', () => {
    // 環（半径 60）は触れないが、長い見出しどうしは重なる距離。
    expect(
      broken((g) => {
        g.nodes[0].star = 'ながい みだしの ほし';
        g.nodes[1].star = 'これも ながい みだし';
        g.nodes[1].x = 0.35;
      }),
    ).toMatch(/見出しが重なる/);
  });

  it('★枠からのはみ出しを捕まえる（星・見出しの両方）', () => {
    expect(broken((g) => (g.nodes[0].x = 0.02))).toMatch(/"mizu" の星が枠からはみ出す/);
    expect(broken((g) => ((g.nodes[0].x = 0.09), (g.nodes[0].star = 'とても ながい みだし')))).toMatch(
      /見出し「とても ながい みだし」が枠からはみ出す/,
    );
    expect(broken((g) => (g.nodes[2].y = 0.98))).toMatch(/"shinzo" の星が枠からはみ出す/);
  });
});
