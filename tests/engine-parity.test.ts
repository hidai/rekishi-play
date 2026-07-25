// エンジン出力の検証。家紋・朱印・巻物アイコンは入力非依存の静的 SVG ゆえインラインスナップショットで
// 回帰固定する（かつては legacy/index.html とのバイト照合が黄金基準だったが、legacy 系統の撤去に伴い
// 現行出力のスナップショットへ置換。スナップショットの初期値は撤去時点の legacy 一致出力そのもの）。
// 似顔絵と読み解き地図は「人物像を刷り込む」カリカチュア化に伴い legacy 一致を卒業し、健全性検証に切替えた。
import { describe, it, expect } from 'vitest';
import { hidenaga } from '../src/works/hidenaga/index';
import { faceArt } from '../src/engine/art/face';
import { monSvg, monKiri, seal, scrollIcon } from '../src/engine/art/icons';
import { buildSceneMap } from '../src/engine/map/sceneMap';
import { buildRelationMap } from '../src/engine/map/relationMap';

// 似顔絵は legacy バイト一致を卒業し、「人物像を刷り込む」学習まんが・アニメ調へ作り直した。
// legacy 一致の代わりに「全員が識別可能・単一の妥当な SVG・未知 id はフォールバック」を検証する。
describe('似顔絵ジェネレータ（学習まんが・アニメ調）', () => {
  const ids = Object.keys(hidenaga.faces).filter((k) => k !== '_default');
  it('全人物の似顔絵がそれぞれ異なる（シルエットで見分けられる）', () => {
    const svgs = ids.map((id) => faceArt(id, hidenaga.faces));
    expect(new Set(svgs).size).toBe(svgs.length);
  });
  it('未知 id は _default にフォールバックする', () => {
    expect(faceArt('p-unknown-fallback', hidenaga.faces)).toBe(faceArt('_default', hidenaga.faces));
  });
  for (const id of ids) {
    it(`face(${id}) が単一の妥当な <svg>`, () => {
      const s = faceArt(id, hidenaga.faces);
      expect(s.startsWith('<svg')).toBe(true);
      expect(s.endsWith('</svg>')).toBe(true);
      expect((s.match(/<svg/g) || []).length).toBe(1);
    });
  }
  // faceSvg が複数の顔をひとつの地図 SVG へ転記し、カード図鑑も十数枚を同時に {@html} で
  // 描画するため、出力に静的 id があると DOM/SVG 内で衝突する。defs・id・url(#) 禁止を固定する。
  for (const id of ids) {
    it(`face(${id}) が <defs>・id 属性・url(#) を含まない（ID 衝突の回帰防止）`, () => {
      const s = faceArt(id, hidenaga.faces);
      expect(s).not.toContain('<defs');
      expect(s).not.toMatch(/\sid="/);
      expect(s).not.toContain('url(#');
    });
  }
  it('秀長の加齢派生は互いに異なりつつ「たれ目」の部品を共有する（同一人物の連続性）', () => {
    // eye:'gentle' を使う 本体/@child/@young が、同じ白目パス断片を共有していること。
    const gentleFragment = 'Q38.5 47.4 46.6 50.4';
    const gentleKeys = ['p-hidenaga', 'p-hidenaga@child', 'p-hidenaga@young'];
    const svgs = gentleKeys.map((k) => faceArt(k, hidenaga.faces));
    for (const s of svgs) expect(s).toContain(gentleFragment);
    expect(new Set(svgs).size).toBe(svgs.length);
  });
});

// 家紋・朱印・巻物アイコンは入力非依存の静的 SVG。子どもに刷り込む意匠なので、意図せぬ描画変更を
// スナップショットで検知する（値の初期化＝legacy 撤去時点のバイト一致出力）。意匠を変えたら -u で更新。
describe('家紋・朱印・巻物アイコンの静的スナップショット（回帰固定）', () => {
  it('monOmodaka（work.mon=omodaka）', () => {
    expect(monSvg('omodaka')).toMatchSnapshot();
  });
  it('monKiri', () => {
    expect(monKiri()).toMatchSnapshot();
  });
  it('seal（2文字）', () => {
    expect(seal('史実')).toMatchSnapshot();
  });
  it('scrollIcon', () => {
    expect(scrollIcon()).toMatchSnapshot();
  });
});

// 読み解き地図は似顔絵を内包するため legacy バイト一致は卒業。
// 代わりに「全シーンで単一の妥当な SVG を返し、未定義シーンでも落ちない」健全性を検証する。
describe('読み解き地図（buildSceneMap）の健全性', () => {
  const sceneIds = Object.keys(hidenaga.map.sceneMaps);
  for (const sid of sceneIds) {
    const ch = parseInt(sid, 10);
    it(`buildSceneMap(${ch}, ${sid}) が単一の妥当な <svg>`, () => {
      const svg = buildSceneMap(hidenaga, ch, sid);
      expect(svg).toContain('<svg');
      expect((svg.match(/<svg/g) || []).length).toBe(1);
      expect(svg.length).toBeGreaterThan(200);
    });
  }
  it('SCENE_MAPS に無いシーンでも落ちない（フォールバック）', () => {
    expect(buildSceneMap(hidenaga, 3, '3-nope')).toContain('<svg');
  });
});

// Mid-invasion territory: TERRITORY is chapter-granular (era <= viewCh → own color),
// so invasion scenes would contradict the text (playtest note: "land under attack is
// not territory yet"). SceneMapDef.contested overrides per scene with --map-contested.
describe('領地の「攻略中」（SceneMapDef.contested）', () => {
  const prefFill = (svg: string, pid: string) => {
    const d = hidenaga.map.geo.pref[pid].d;
    const i = svg.indexOf(`<path d="${d}" fill="`);
    expect(i, `pref ${pid} path`).toBeGreaterThanOrEqual(0);
    const rest = svg.slice(i + `<path d="${d}" fill="`.length);
    return rest.slice(0, rest.indexOf('"'));
  };
  it('5-a（四国上陸）: 四国・九州は敵地色、既得の播磨は自軍色のまま', () => {
    const svg = buildSceneMap(hidenaga, 5, '5-a');
    expect(prefFill(svg, '36')).toBe('var(--map-contested)'); // 阿波
    expect(prefFill(svg, '46')).toBe('var(--map-contested)'); // 薩摩
    expect(prefFill(svg, '28')).toBe('var(--map-faction-b)'); // 播磨（era3）
  });
  it('5-b（元親降伏）: 四国は自軍色に転じ、九州はまだ敵地色', () => {
    const svg = buildSceneMap(hidenaga, 5, '5-b');
    expect(prefFill(svg, '36')).toBe('var(--map-faction-b)');
    expect(prefFill(svg, '46')).toBe('var(--map-contested)');
  });
  it('5-d（島津降伏）以降は上書きなし＝九州も自軍色', () => {
    const svg = buildSceneMap(hidenaga, 5, '5-d');
    expect(prefFill(svg, '46')).toBe('var(--map-faction-b)');
  });
});

// 地図外の目的地（off:1）は、実座標の向きへ 端の矢印で示す（宋＝南西 / 小田原＝東）。
// 旧実装は常に右端・右向き固定だった。方向依存になったことと、ラベルが枠内に収まることを検証する。
describe('地図外マーカー（off）は 目的地の向きに矢印を出す', () => {
  const offArrow = (svg: string) => {
    // 端の矢印グループ: translate(ex,ey) rotate(ang) scale(sc)
    const m = svg.match(/translate\(([-\d.]+),([-\d.]+)\) rotate\(([-\d.]+)\) scale/);
    return m ? { ex: +m[1], ey: +m[2], ang: +m[3] } : null;
  };
  const viewBox = (svg: string) => {
    const m = svg.match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/)!;
    return { x0: +m[1], y0: +m[2], bw: +m[3], bh: +m[4] };
  };
  // 東の off（小田原 x=1000）: 矢印は右向き（角度は -90..90）で 視点中心より右に置かれる。
  it('東の目的地には 右向きの矢印（hidenaga 7-a 小田原）', () => {
    const svg = buildSceneMap(hidenaga, 7, '7-a');
    const a = offArrow(svg)!;
    expect(a).not.toBeNull();
    expect(Math.abs(a.ang)).toBeLessThan(90);
    const { x0, bw } = viewBox(svg);
    expect(a.ex).toBeGreaterThan(x0 + bw / 2); // 右半分
  });
  // 西の off を注入したシーンでは 矢印が左向き（|角度|>90）で 左半分に置かれる。
  const westWork = {
    ...hidenaga,
    map: {
      ...hidenaga.map,
      gaz: {
        ...hidenaga.map.gaz,
        zz_center: { x: 500, y: 345 },
        zz_west: { x: -400, y: 350 },
      },
      sceneMaps: {
        ...hidenaga.map.sceneMaps,
        'zz-west': {
          markers: [
            { at: 'zz_center', cur: 1, label: 'ここ' },
            { at: 'zz_west', off: 1, label: '宋', note: '海の むこう' },
          ],
        },
      },
    },
  };
  it('西の目的地には 左向きの矢印（合成シーン）', () => {
    const svg = buildSceneMap(westWork, 1, 'zz-west');
    const a = offArrow(svg)!;
    expect(a).not.toBeNull();
    expect(Math.abs(a.ang)).toBeGreaterThan(90); // 左を向く
    const { x0, bw } = viewBox(svg);
    expect(a.ex).toBeLessThan(x0 + bw / 2); // 左半分
  });
  // テキストは矢印の上下（ビュー中心側）に置かれ、矢印を覆わない。旧実装（レイ沿いに
  // 固定 30*sc 引き込み）は幅広ラベルの縁取りが矢じりを塗りつぶした（ラスタ自己点検で発見）。
  it('矢印のラベルは 矢印から 縦に離れて置かれる（矢じりを 覆わない）', () => {
    const svg = buildSceneMap(westWork, 1, 'zz-west');
    const a = offArrow(svg)!;
    const lb = svg.match(/class="smk-lb" x="([-\d.]+)" y="([-\d.]+)"[^>]*>宋</)!;
    const { bw } = viewBox(svg);
    const sc = bw / 1000; // hidenaga GEO vb width
    // arrow extent is ≤20*sc in any direction; the text baseline sits 40*sc away
    expect(Math.abs(+lb[2] - a.ey)).toBeGreaterThanOrEqual(30 * sc);
  });
  it('矢印のラベルは 枠内に収まる（どの端でも見切れない）', () => {
    const svg = buildSceneMap(westWork, 1, 'zz-west');
    const { x0, y0, bw, bh } = viewBox(svg);
    // 端の矢印のラベル「宋」の text 座標を取り出す
    const lb = svg.match(/class="smk-lb" x="([-\d.]+)" y="([-\d.]+)"[^>]*>宋</)!;
    const lx = +lb[1],
      ly = +lb[2];
    expect(lx).toBeGreaterThanOrEqual(x0);
    expect(lx).toBeLessThanOrEqual(x0 + bw);
    expect(ly).toBeGreaterThanOrEqual(y0);
    expect(ly).toBeLessThanOrEqual(y0 + bh);
  });
});

// ★D 人物相関図：表示専用（カード非追加）。取得状況で顔・名前・関係が現れる。
describe('人物相関図（buildRelationMap）の健全性', () => {
  const rels = hidenaga.relations!;
  it('相関図データがカードに存在する人物だけを指す（表示専用・整合）', () => {
    for (const e of rels.edges) {
      expect(hidenaga.cards[e.pid], `relation pid ${e.pid}`).toBeTruthy();
      expect(rels.cats.some((c) => c.key === e.cat), `relation cat ${e.cat}`).toBe(true);
    }
  });
  it('未取得なら顔・名前・関係を伏せる（？のみ・単一の妥当な svg）', () => {
    const svg = buildRelationMap(hidenaga, new Set());
    expect(svg.startsWith('<svg')).toBe(true);
    expect((svg.match(/<svg/g) || []).length).toBe(1);
    expect(svg).toContain('？');
    for (const e of rels.edges) expect(svg).not.toContain(`>${e.rel}<`);
  });
  it('取得済みの人物は名前と関係が現れる（線がつながる）', () => {
    const one = rels.edges[0];
    const svg = buildRelationMap(hidenaga, new Set([one.pid]));
    expect(svg).toContain(`>${one.rel}<`);
    expect(svg).toContain(`>${hidenaga.shortNames[one.pid]}<`);
  });
  it('relations 未定義の作品では空文字（タブ非表示）', () => {
    expect(buildRelationMap({ ...hidenaga, relations: undefined }, new Set())).toBe('');
  });
});

describe('faceSvg の clip-path 回避策が保たれている', () => {
  // 顔を含むシーン（1-a は なか の顔）で、ネスト svg を使わない
  // 「clip-path + 二重 g transform(-50,-51)」パターンが出力に残っていること。
  const svg = buildSceneMap(hidenaga, 1, '1-b');
  it('clip-path 参照を使っている', () => {
    expect(svg).toMatch(/<g clip-path="url\(#fc-1-b-\d+-\d+\)">/);
  });
  it('顔の中身を親座標系へ置く二重 transform を使っている', () => {
    expect(svg).toMatch(/translate\([^)]*\) scale\([^)]*\) translate\(-50,-51\)/);
  });
  it('顔部分にネストした <svg> を作っていない（回避策の要）', () => {
    // scene-map の外殻 <svg> は1つだけ。顔は <g> で描かれる。
    expect((svg.match(/<svg/g) || []).length).toBe(1);
  });
});

