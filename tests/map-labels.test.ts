// Guards map legibility across all WORKS — scene maps below, the notebook campaign map at the
// bottom of the file: no two labels may overlap, and none may
// fall outside the frame. Places live in REAL [lon,lat], so two towns that are a morning's walk
// apart land a few pixels apart — and the labels, which keep a constant on-screen size at every
// zoom, collide. That failure is invisible to a type check and to every other test; before this
// gate it was only ever caught by rendering a raster and looking (JOURNAL 2026-07-23). An author
// resolves a collision with lpos ('above' / 'below' / 'left' / 'right') or by choosing a place the
// map can actually hold — never by moving a coordinate away from where the place is.
import { describe, it, expect } from "vitest";
import { WORKS } from "../src/works/index";
import { hidenaga } from "../src/works/hidenaga/index";
import { buildSceneMap, ICON_BOX } from "../src/engine/map/sceneMap";
import { campaignStaticSvg, campaignViewBox } from "../src/engine/map/campaignMap";
import { textW } from "../src/engine/util";

// Estimated ink box of a <text>. Serif CJK sits almost entirely above the baseline.
const ASCENT = 0.88,
  DESCENT = 0.22;
// Stacked lines of one marker (label above its own note) are drawn tighter than these generous
// ink boxes, so a small bleed is the intended house spacing, not a collision.
const BLEED = 0.3;

interface Box {
  s: string;
  fs: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

const TEXT_RE =
  /<text class="(?:smk-lb|smk-note|smk-name[^"]*)" x="([-\d.]+)" y="([-\d.]+)" text-anchor="([a-z]+)" font-size="([\d.]+)"[^>]*>([^<]*)<\/text>/g;

function labelBoxes(svg: string): Box[] {
  const out: Box[] = [];
  for (const m of svg.matchAll(TEXT_RE)) {
    const [x, y, anchor, fs, s] = [+m[1], +m[2], m[3], +m[4], m[5]];
    const w = textW(s, fs);
    const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
    out.push({
      s,
      fs,
      x0,
      x1: x0 + w,
      y0: y - fs * ASCENT,
      y1: y + fs * DESCENT,
    });
  }
  return out;
}

function authoredScenes(work: (typeof WORKS)[number]) {
  return work.story.chapters.flatMap((c) =>
    Object.keys(c.scenes)
      .filter((id) => work.map.sceneMaps[id])
      .map((id) => ({ ch: c.id, id })),
  );
}

// Labels hold one CSS px size on every screen, so a narrow phone draws them LARGER relative to the
// map than the reference width does, while two towns stay exactly as far apart. Collisions are
// therefore a phone-first failure: the gate has to run at the narrow end too (a 360px Android minus
// the 16px .wrap padding), or it only guards the widest screen anybody plays on.
const WIDTHS = [undefined, 328] as const;

describe("シーン地図のラベル配置（全作品）", () => {
  for (const work of WORKS) {
    it(`${work.id}: マーカーのラベルが重ならない`, () => {
      for (const { ch, id } of authoredScenes(work)) for (const dw of WIDTHS) {
        const boxes = labelBoxes(buildSceneMap(work, ch, id, dw));
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i],
              b = boxes[j];
            const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
            const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
            expect(
              ox <= 2 || oy <= BLEED * Math.min(a.fs, b.fs),
              `${work.id} ${id}（表示幅 ${dw ?? '既定'}）: 「${a.s}」と「${b.s}」が重なる（${ox.toFixed(1)}x${oy.toFixed(1)}）— lpos で逃がす`,
            ).toBe(true);
          }
        }
      }
    });

    // The other half of the same defect family: a face disc painted over a neighbour's icon. The
    // engine already slides a face row aside, so this pins that it worked — and that no new marker
    // sits somewhere no dodge can free (then the scene needs a place the map can actually hold).
    it(`${work.id}: 顔ディスクが となりのアイコンを 隠さない`, () => {
      for (const { ch, id } of authoredScenes(work)) {
        const svg = buildSceneMap(work, ch, id);
        const faces = [
          ...svg.matchAll(/<circle class="smk-face" cx="([-\d.]+)" cy="([-\d.]+)" r="([\d.]+)"/g),
        ].map((m) => ({ x: +m[1], y: +m[2], r: +m[3] }));
        const icons = [
          ...svg.matchAll(
            /<g class="smk-icon" data-kind="([a-z]+)" transform="translate\(([-\d.]+),([-\d.]+)\) scale\(([\d.]+)\)"/g,
          ),
        ];
        for (const ic of icons) {
          const [kind, x, y, sc] = [ic[1], +ic[2], +ic[3], +ic[4]];
          const b = ICON_BOX[kind];
          expect(b, `${kind} の ink box が ICON_BOX に無い`).toBeDefined();
          const [bx0, by0, bx1, by1] = [x + b[0] * sc, y + b[1] * sc, x + b[2] * sc, y + b[3] * sc];
          for (const f of faces) {
            const qx = Math.max(bx0, Math.min(f.x, bx1)),
              qy = Math.max(by0, Math.min(f.y, by1));
            // 1.5 units of slack for the disc's own white stroke, drawn outside r.
            expect(
              Math.hypot(f.x - qx, f.y - qy) >= f.r + 1.5 * sc,
              `${work.id} ${id}: 顔が「${kind}」のアイコンに かぶる`,
            ).toBe(true);
          }
        }
      }
    });

    it(`${work.id}: ラベルが枠からはみ出さない`, () => {
      for (const { ch, id } of authoredScenes(work)) for (const dw of WIDTHS) {
        const svg = buildSceneMap(work, ch, id, dw);
        const [vx, vy, vw, vh] = svg
          .match(/viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/)!
          .slice(1)
          .map(Number);
        for (const b of labelBoxes(svg)) {
          expect(
            b.x0 >= vx && b.x1 <= vx + vw && b.y0 >= vy && b.y1 <= vy + vh,
            `${work.id} ${id}（表示幅 ${dw ?? '既定'}）: 「${b.s}」が枠外`,
          ).toBe(true);
        }
      }
    });
  }
});

// The half of the row layout no shipped scene exercises yet: names are centred over their own face
// and are often wider than the disc, so a row spaced at the disc pitch can hold faces that clear
// each other under names that do not (davinci 5-a, which the author worked around by dropping a
// face). Every shipped pair is short enough that the disc pitch already wins, so this pins the
// engine's own answer with names as long as an author may plausibly write.
describe('顔の行の間隔は 名前の幅からも決まる', () => {
  const longNamed = {
    ...hidenaga,
    shortNames: { ...hidenaga.shortNames, 'p-hideyoshi': '羽柴筑前守', 'p-sorin': '大友宗麟' },
  } as typeof hidenaga;

  it('長い名前どうしでも 重ならない', () => {
    const boxes = labelBoxes(buildSceneMap(longNamed, 6, '6-b')).filter((b) =>
      ['羽柴筑前守', '大友宗麟'].includes(b.s),
    );
    expect(boxes.length, '長い名前の2枚が出ている').toBe(2);
    const [a, b] = boxes;
    expect(
      Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0) <= 2,
      `「${a.s}」と「${b.s}」が重なる — 顔の行の間隔が 名前の幅を見ていない`,
    ).toBe(true);
  });
});

// The same defect family on the OTHER map every work ships — the notebook's campaign map. Here a
// province name is anchored at its polygon's centroid, which no author chose and which moves
// whenever the polygons are redrawn: splitting 愛知 into 尾張/三河 dropped 尾張's centroid straight
// under the 中村 footprint and the name vanished (JOURNAL 2026-07-23(8)). Writing this gate then
// found four more, all of them shipped since the first work: labels and dots painting over each
// other in the crowded 畿内 and 九州. Sizes come from CSS here (app.css .mplabel / .mk-lb / .mk-dot),
// not from the markup, so they are mirrored as constants — keep the two in step.
describe("進軍の地図のラベル配置（全作品）", () => {
  const PREF_FS = 15,
    MK_FS = 16,
    DOT_R = 14;
  // A dot is opaque ink painted after the labels, so any real overlap eats a name; 2 units of slack
  // for the generous ink boxes, matching the scene-map gate above.
  const SLACK = 2;

  // `own` pairs a footprint's label with its own dot by position in the markup, not by its text:
  // two footprints may legitimately share a name, and only the pairing tells them apart.
  interface Mark {
    s: string;
    x: number;
    y: number;
  }

  function campaignBoxes(svg: string) {
    const boxes: (Box & { own?: number })[] = [];
    const at = (s: string, x: number, y: number, fs: number, anchor: string) => {
      const w = textW(s, fs);
      const x0 = anchor === "middle" ? x - w / 2 : anchor === "end" ? x - w : x;
      return { s, fs, x0, x1: x0 + w, y0: y - fs * ASCENT, y1: y + fs * DESCENT };
    };
    for (const m of svg.matchAll(
      /<text class="mplabel" x="([-\d.]+)" y="([-\d.]+)" text-anchor="middle">([^<]*)</g,
    ))
      boxes.push(at(m[3], +m[1], +m[2], PREF_FS, "middle"));
    const dots: Mark[] = [];
    for (const m of svg.matchAll(
      /<g class="mmark show" transform="translate\(([-\d.]+),([-\d.]+)\)">\s*<text class="mk-lb"(?: x="([-\d.]+)")? y="([-\d.]+)" text-anchor="([a-z]+)">([^<]*)</g,
    )) {
      const [x, y, lx, ly, anchor, s] = [+m[1], +m[2], +(m[3] ?? 0), +m[4], m[5], m[6]];
      boxes.push({ ...at(s, x + lx, y + ly, MK_FS, anchor), own: dots.length });
      dots.push({ s, x, y });
    }
    return { boxes, dots };
  }

  for (const work of WORKS) {
    it(`${work.id}: 国名と足あとの ラベル・点が 重ならない`, () => {
      // vc=99 = every footprint revealed: the strictest view, and the one a reader reaches.
      const { boxes, dots } = campaignBoxes(campaignStaticSvg(work, 99));
      // The markup is matched by regex, so pin that every label was actually seen — a silently
      // empty match set would make this gate green for a map full of collisions.
      expect(dots.length, `${work.id}: 足あとの取りこぼし`).toBe(work.map.mapPoints.length);
      expect(boxes.length - dots.length, `${work.id}: 国名の取りこぼし`).toBe(
        Object.keys(work.map.mapLabels).filter((pid) => work.map.geo.pref[pid]).length,
      );
      for (let i = 0; i < boxes.length; i++) {
        for (let j = i + 1; j < boxes.length; j++) {
          const a = boxes[i],
            b = boxes[j];
          const ox = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0);
          const oy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
          expect(
            ox <= SLACK || oy <= SLACK,
            `${work.id}: 「${a.s}」と「${b.s}」が重なる（${ox.toFixed(1)}x${oy.toFixed(1)}）`,
          ).toBe(true);
        }
      }
      // Bounds are the LIVE frame (the twin's viewBox is taller by its baked legend band).
      const [vx, vy, vw, vh] = campaignViewBox(work);
      for (const b of boxes) {
        expect(
          b.x0 >= vx && b.x1 <= vx + vw && b.y0 >= vy && b.y1 <= vy + vh,
          `${work.id}: 「${b.s}」が枠外`,
        ).toBe(true);
        for (let di = 0; di < dots.length; di++) {
          if (b.own === di) continue; // a footprint's own label is placed against its own dot
          const d = dots[di];
          const qx = Math.max(b.x0, Math.min(d.x, b.x1)),
            qy = Math.max(b.y0, Math.min(d.y, b.y1));
          expect(
            Math.hypot(d.x - qx, d.y - qy) >= DOT_R - SLACK,
            `${work.id}: 「${b.s}」が 足あと「${d.s}」の 点に かぶる`,
          ).toBe(true);
        }
      }
    });
  }
});

// The migration this file was born with: hidenaga / kiyomori were authored in pre-projected px
// (legacy) and now carry REAL [lon,lat] like the later works. Four hidenaga places stay in px on
// purpose — a documented cartographic displacement, because at a zoom where Japan is still
// recognizable they would otherwise be one dot with their neighbour. That exception is the kind
// of thing that quietly spreads, so it is pinned to exactly those four.
describe("gaz の実座標化（第1作・第2作）", () => {
  const PX_BY_DESIGN: Record<string, string[]> = {
    hidenaga: ["kiyosu", "gifu", "ikuno", "izushi"],
    kiyomori: [],
  };
  for (const work of WORKS.filter((w) => PX_BY_DESIGN[w.id])) {
    it(`${work.id}: ずらし指定の4点以外は実 lon/lat`, () => {
      for (const [id, p] of Object.entries(work.map.gaz)) {
        if (PX_BY_DESIGN[work.id].includes(id)) {
          expect(p.x, `${id} は意図的な px ずらし`).toBeDefined();
          continue;
        }
        expect(p.lon, `${id} は lon/lat で置く`).toBeDefined();
        expect(p.lon! > 118 && p.lon! < 146, `${id} lon=${p.lon}`).toBe(true);
        expect(p.lat! > 28 && p.lat! < 46, `${id} lat=${p.lat}`).toBe(true);
      }
    });
  }
});
