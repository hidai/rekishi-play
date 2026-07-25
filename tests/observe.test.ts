// ★Q 観察ビューの純粋ロジックとオーバーレイ（DOM なし）。
// 出荷データにまだ observe は無いので、ここは合成 fixture で全分岐を踏ませる
// ——ゲートは「出荷データが踏むブランチ」しか守らない（2026-07-16 の学び）。
import { describe, it, expect } from 'vitest';
import { visibleHotspots, observeProgress, collectHotspot } from '../src/engine/observe';
import {
  buildObserveOverlay,
  hotspotAt,
  parseFrame,
  LENS_R,
  type ObserveFrame,
} from '../src/engine/art/observe';
import { observeErrors } from './helpers/work-structure';
import type { ObserveSpec, Work } from '../src/engine/types';

const SPEC: ObserveSpec = {
  prompt: 'なにが 見える？',
  hotspots: [
    { id: 'a', x: 0.25, y: 0.5, r: 0.06, caption: '<ruby>水<rt>みず</rt></ruby>の うず', essential: true },
    { id: 'b', x: 0.75, y: 0.5, r: 0.06, caption: 'とりの かたむき', essential: true },
    { id: 'c', x: 0.5, y: 0.8, r: 0.05, caption: 'あとから 見える もの', gatedOn: 'a' },
  ],
};

/** closeup と同じ 800x500（アスペクト 1.6＝y 補正が効いているか測れる形）。 */
const FRAME: ObserveFrame = { x: 0, y: 0, w: 800, h: 500 };
const ASPECT = FRAME.w / FRAME.h;

describe('observe: 可視性の gate', () => {
  it('gate が閉じた hotspot は存在ごと伏せる（ヒントも出さない）', () => {
    expect(visibleHotspots(SPEC, []).map((h) => h.id)).toEqual(['a', 'b']);
  });

  it('前提を見つけると gate が開く＝昔の絵に新しい発見が出る（§6-2）', () => {
    expect(visibleHotspots(SPEC, ['a']).map((h) => h.id)).toEqual(['a', 'b', 'c']);
  });

  it('発見済みの hotspot も可視のまま（再訪で読み直せる）', () => {
    expect(visibleHotspots(SPEC, ['a', 'b']).map((h) => h.id)).toContain('a');
  });
});

describe('observe: 「つづき」の gate', () => {
  it('essential が揃うまで done にならない', () => {
    expect(observeProgress(SPEC, [])).toEqual({ got: 0, need: 2, done: false });
    expect(observeProgress(SPEC, ['a'])).toEqual({ got: 1, need: 2, done: false });
    expect(observeProgress(SPEC, ['a', 'b'])).toEqual({ got: 2, need: 2, done: true });
  });

  it('essential でない hotspot は進捗に数えない', () => {
    expect(observeProgress(SPEC, ['c'])).toEqual({ got: 0, need: 2, done: false });
  });

  it('essential が無いシーン（任意の寄り道）は最初から done＝進行を止めない', () => {
    const optional: ObserveSpec = { prompt: 'ん？', hotspots: [{ id: 'x', x: 0.5, y: 0.5, r: 0.1, caption: 'あ' }] };
    expect(observeProgress(optional, [])).toEqual({ got: 0, need: 0, done: true });
  });

  it('他シーンの hotspot を見つけていても、このシーンの進捗は動かない', () => {
    expect(observeProgress(SPEC, ['other-scene-hotspot'])).toEqual({ got: 0, need: 2, done: false });
  });
});

describe('observe: 採集', () => {
  it('新しい hotspot は isNew:true で足される', () => {
    expect(collectHotspot([], 'a')).toEqual({ found: ['a'], isNew: true });
  });

  it('拾い直しは isNew:false で集合が増えない（採集音を二度鳴らさない）', () => {
    expect(collectHotspot(['a'], 'a')).toEqual({ found: ['a'], isNew: false });
  });

  it('元の配列を破壊しない（イミュータブル）', () => {
    const before = ['a'];
    collectHotspot(before, 'b');
    expect(before).toEqual(['a']);
  });
});

describe('observe: hitTest', () => {
  it('円の中は当たり、外は外れ', () => {
    expect(hotspotAt(SPEC, [], 0.25, 0.5, ASPECT)?.id).toBe('a');
    expect(hotspotAt(SPEC, [], 0.5, 0.2, ASPECT)).toBeNull();
  });

  it('gate が閉じた hotspot には当たらない', () => {
    expect(hotspotAt(SPEC, [], 0.5, 0.8, ASPECT)).toBeNull();
    expect(hotspotAt(SPEC, ['a'], 0.5, 0.8, ASPECT)?.id).toBe('c');
  });

  it('判定は絵の上で真円＝y 差がアスペクトで補正される', () => {
    // 幅 800・高さ 500 なら、正規化 y 0.08 と 正規化 x 0.05 は どちらも 40 単位。
    expect(hotspotAt(SPEC, [], 0.3, 0.5, ASPECT)?.id).toBe('a'); // dx=0.05 ＝ 縁
    expect(hotspotAt(SPEC, [], 0.25, 0.596, ASPECT)?.id).toBe('a'); // dy=0.096 ≒ 縁
    expect(hotspotAt(SPEC, [], 0.25, 0.62, ASPECT)).toBeNull(); // dy=0.12 ＝ 円の外
  });

  it('重なったら中心が近い方が勝つ（データの並び順に依存しない）', () => {
    const overlap: ObserveSpec = {
      prompt: 'p',
      hotspots: [
        { id: 'far', x: 0.5, y: 0.5, r: 0.3, caption: 'とおい' },
        { id: 'near', x: 0.56, y: 0.5, r: 0.3, caption: 'ちかい' },
      ],
    };
    expect(hotspotAt(overlap, [], 0.55, 0.5, ASPECT)?.id).toBe('near');
    const reversed: ObserveSpec = { ...overlap, hotspots: [...overlap.hotspots].reverse() };
    expect(hotspotAt(reversed, [], 0.55, 0.5, ASPECT)?.id).toBe('near');
  });
});

describe('observe: parseFrame', () => {
  it('主ビジュアルの viewBox を読む（closeup の固定枠／地図の content-fit 枠）', () => {
    expect(parseFrame('<svg viewBox="0 0 800 500" x>')).toEqual({ x: 0, y: 0, w: 800, h: 500 });
    expect(parseFrame('<svg viewBox="-12.5 40 1000 613.25">')).toEqual({ x: -12.5, y: 40, w: 1000, h: 613.25 });
  });

  it('読めない viewBox は null（呼び手が重ねずに済む）', () => {
    expect(parseFrame('<svg>')).toBeNull();
    expect(parseFrame('<svg viewBox="0 0 800">')).toBeNull();
    expect(parseFrame('<svg viewBox="0 0 0 500">')).toBeNull();
  });
});

describe('observe: 構造ゲート（negative fixture）', () => {
  // 出荷データにはまだ observe が無い＝全 WORKS を回してもこの述語は 1 分岐も踏まない。
  // ゲートが本当に落ちることは、ここで壊れた作品を合成して確かめるしかない。
  const workOf = (scenes: Record<string, { observe: ObserveSpec }>): Work =>
    ({ story: { chapters: [{ id: 1, scenes }] } }) as unknown as Work;
  const spot = (o: Partial<ObserveSpec['hotspots'][0]>) => ({
    id: 'h', x: 0.5, y: 0.5, r: 0.05, caption: 'あ', ...o,
  });
  const oneScene = (hotspots: ObserveSpec['hotspots']) => workOf({ '1-a': { observe: { prompt: 'p', hotspots } } });

  it('健全なデータは何も報告しない', () => {
    expect(observeErrors(oneScene([spot({ id: 'a', essential: true }), spot({ id: 'b', gatedOn: 'a' })]))).toEqual([]);
  });

  it('observe を持たない作品（＝いまの全 WORKS）は素通りする', () => {
    expect(observeErrors({ story: { chapters: [{ id: 1, scenes: { '1-a': {} } }] } } as unknown as Work)).toEqual([]);
  });

  it('id の重複を捕まえる（章をまたいだ gate が別物を指してしまう）', () => {
    const w = workOf({
      '1-a': { observe: { prompt: 'p', hotspots: [spot({ id: 'dup' })] } },
      '1-b': { observe: { prompt: 'p', hotspots: [spot({ id: 'dup' })] } },
    });
    expect(observeErrors(w).join()).toMatch(/"dup" が重複/);
  });

  it('gatedOn の dangling を捕まえる（打ち間違えた gate は永久に開かない）', () => {
    expect(observeErrors(oneScene([spot({ gatedOn: 'typo' })])).join()).toMatch(/gatedOn="typo" が解決しない/);
  });

  it('自分自身を gate する hotspot を捕まえる（永久に見えない）', () => {
    expect(observeErrors(oneScene([spot({ id: 'a', gatedOn: 'a' })])).join()).toMatch(/自分自身を gate/);
  });

  it('essential × gatedOn を捕まえる（「つづき」が出ず詰む）', () => {
    const w = oneScene([spot({ id: 'a' }), spot({ id: 'b', essential: true, gatedOn: 'a' })]);
    expect(observeErrors(w).join()).toMatch(/essential なのに gatedOn/);
  });

  it('枠からはみ出す hotspot・空の caption・空の prompt を捕まえる', () => {
    expect(observeErrors(oneScene([spot({ x: 0.97, r: 0.05 })])).join()).toMatch(/左右にはみ出す/);
    expect(observeErrors(oneScene([spot({ y: 1.2 })])).join()).toMatch(/y が絵の外/);
    expect(observeErrors(oneScene([spot({ r: 0 })])).join()).toMatch(/r が 0 以下/);
    expect(observeErrors(oneScene([spot({ r: 0.8, x: 0.5 })])).join()).toMatch(/半幅を超える/);
    expect(observeErrors(oneScene([spot({ caption: '  ' })])).join()).toMatch(/caption が空/);
    expect(observeErrors(workOf({ '1-a': { observe: { prompt: ' ', hotspots: [spot({})] } } })).join()).toMatch(
      /prompt が空/,
    );
    expect(observeErrors(workOf({ '1-a': { observe: { prompt: 'p', hotspots: [] } } })).join()).toMatch(
      /hotspots が空/,
    );
  });
});

describe('observe: オーバーレイ', () => {
  const clean = (svg: string) => {
    expect(svg).not.toMatch(/NaN|undefined|null/);
    expect(svg.startsWith('<svg')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
  };

  it('主ビジュアルと同じ viewBox で返す＝絶対配置で重ねて座標が合う', () => {
    const svg = buildObserveOverlay('1-a', SPEC, [], { x: -12.5, y: 40, w: 1000, h: 613.25 });
    expect(svg).toContain('viewBox="-12.5 40 1000 613.25"');
    clean(svg);
  });

  it('指が触れていない（lens なし）なら紗を敷かない＝絵が素で見える', () => {
    const svg = buildObserveOverlay('1-a', SPEC, [], FRAME);
    expect(svg).not.toContain('ob-veil');
    clean(svg);
  });

  it('レンズがあれば紗＋穴＋環を描く', () => {
    const svg = buildObserveOverlay('1-a', SPEC, [], FRAME, { x: 0.5, y: 0.5 });
    expect(svg).toContain('ob-veil');
    expect(svg).toContain('mask="url(#ob-1-a-hole)"');
    expect(svg).toContain('ob-lens');
    clean(svg);
  });

  it('id は ob-<sceneId>- で接頭する（シーン間で衝突しない＝closeup と同じ規律）', () => {
    const svg = buildObserveOverlay('3-b', SPEC, [], FRAME, { x: 0.5, y: 0.5 });
    for (const m of svg.matchAll(/id="([^"]+)"/g)) expect(m[1].startsWith('ob-3-b-')).toBe(true);
  });

  it('灯りの円は当たり判定と同じ大きさ（＝タップ標的が掃きの範囲と一致する）', () => {
    const svg = buildObserveOverlay('1-a', SPEC, [], FRAME, { x: 0.25, y: 0.5 });
    const hit = SPEC.hotspots[0];
    expect(svg).toContain(`<circle cx="${hit.x * FRAME.w}" cy="${hit.y * FRAME.h}" r="${hit.r * FRAME.w}"`);
  });

  it('未発見の hotspot は、レンズの下に来たときだけ ✦ が灯る（探す仕事を奪わない）', () => {
    const away = buildObserveOverlay('1-a', SPEC, [], FRAME, { x: 0.5, y: 0.15 });
    expect(away).not.toContain('ob-spark');
    const over = buildObserveOverlay('1-a', SPEC, [], FRAME, { x: 0.25, y: 0.5 });
    expect(over).toContain('ob-spark');
    expect(over).toContain('data-hid="a"');
    clean(over);
  });

  it('見つけた hotspot は lens なしでも印が残る（再訪で読み直せる）', () => {
    const svg = buildObserveOverlay('1-a', SPEC, ['a'], FRAME);
    expect(svg).toContain('data-hid="a"');
    expect(svg).toContain('obspot found');
    expect(svg).not.toContain('data-hid="b"'); // 未発見・レンズ外＝何も描かない
    clean(svg);
  });

  it('gate が閉じた hotspot は印も ✦ も出ない', () => {
    const svg = buildObserveOverlay('1-a', SPEC, [], FRAME, { x: 0.5, y: 0.8 });
    expect(svg).not.toContain('data-hid="c"');
  });

  it('キャプションを SVG に描かない（<text> は <ruby> を運べない・数字だけは可）', () => {
    // 見つけた印には「拾った順の番号」を描く（本文側の説明と同じ番号で対応づくのが目的＝
    // どの説明がいま押した印のものか分かる。家族の実プレイ 2026-07-22）。数字はルビを要さない
    // 唯一の文字ゆえ許すが、ことば（キャプション）は HTML 側の仕事のまま——だから <text> の
    // 中身が数字だけであることをここで固定する。
    const svg = buildObserveOverlay('1-a', SPEC, ['a', 'b'], FRAME, { x: 0.25, y: 0.5 });
    expect(svg).not.toContain('ruby');
    expect(svg).not.toContain('うず');
    for (const m of svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)) {
      expect(m[1], 'SVG の <text> はことばを運ばない（数字のみ）').toMatch(/^\d+$/);
    }
  });

  it('見つけた印の番号が「拾った順」（データの並び順ではない）', () => {
    // b→a の順に拾えば b が 1・a が 2。データ順で振ると、絵の番号と本文側の並びがずれる。
    const svg = buildObserveOverlay('1-a', SPEC, ['b', 'a'], FRAME);
    const order = [...svg.matchAll(/<g class="obspot found" data-hid="(\w+)"[\s\S]*?>(\d+)<\/text>/g)]
      .map((m) => [m[1], m[2]]);
    expect(Object.fromEntries(order)).toEqual({ b: '1', a: '2' });
  });

  it('正規化座標を frame の原点ごしに写す（読み解き地図の viewBox は 0 始まりではない）', () => {
    // 地図は content-fit ＝ viewBox の原点が負にもなる。原点を足し忘れると印が絵からずれる。
    const off: ObserveFrame = { x: -12.5, y: 40, w: 1000, h: 600 };
    const svg = buildObserveOverlay('1-a', SPEC, ['a'], off, { x: 0.5, y: 0.5 });
    // hotspot 'a' は (0.25, 0.5) → -12.5 + 250 = 237.5 / 40 + 300 = 340
    expect(svg).toContain('cx="237.5" cy="340"');
    // レンズは (0.5, 0.5) → 487.5 / 340、半径は幅に対する比（＝画面上で指の大きさが一定）
    expect(svg).toContain(`<circle class="ob-lens" cx="487.5" cy="340" r="${LENS_R * off.w}"`);
    // 紗は枠ぴったり（原点ごと）に敷く＝端に隙間を残さない。
    expect(svg).toContain('x="-12.5" y="40" width="1000" height="600"');
  });

  it('レンズは絵の端でははみ出してよい（指が端に触れているだけ＝クランプすると追従が嘘になる）', () => {
    const svg = buildObserveOverlay('1-a', SPEC, [], FRAME, { x: 0.02, y: 0.5 });
    expect(svg).toContain(`<circle class="ob-lens" cx="${0.02 * FRAME.w}"`);
    clean(svg);
  });
});
