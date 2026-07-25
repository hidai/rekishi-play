// ★S 習作ページ（手記）の SVG ジェネレータ。純粋な文字列生成関数。
//
// closeup / figure / 読み解き地図に続く4種目の主ビジュアル。顔でも人でも場所でもない
// 「自然を観るシーン」（洞窟・川・光・体）のための下敷き。`Scene.observe` のオーバーレイ
// （レンズ・✦＝art/observe.ts）は絵の上に重なるだけで絵を持たないので、顔の無い観察章には
// この手記ページが要る（davinci ch1 自然観察 / ch4）。
//
//   - 絵の語彙（渦・鳥・光と球・カール・洞窟）はここが持つ再利用可能なプリミティブで、
//     作品データ（StudyPage.subjects）は「どれを・どこに」置くかだけを与える——face の
//     鼻/髪や closeup の日輪/月と同じ分担（設計書 §11 の再利用可能 art）。
//   - 色は CSS 変数に依存しない固定パレット（似顔絵・closeup と同じ"絵"の扱い。テーマ非依存で
//     render-observe.ts / render-scene.ts の単体書き出しでもそのまま見える）。
//   - <defs> の id は `sp-<key>-` で接頭し、ページ間で衝突しない（シーン切替は {#key} で
//     DOM ごと再生成される前提）。
//   - viewBox は closeup と同じ 800x500（observe hotspot の正規化座標が両者で一致する）。
import type { StudyPage, StudySubject } from '../types';
import { esc } from '../util';

const W = 800;
const H = 500;

// Sepia notebook palette. The paper tone is the same 古紙 the observe veil dims to
// (#e8dcbe), so lens-off and lens-on read as one surface.
const PAL = {
  paper: '#ece0be',
  paperEdge: '#d6c393',
  ink: '#4a3a1e', // main hand-drawn line (matches the observe lens ring)
  inkSoft: '#6b5836', // shading / secondary strokes
  inkFaint: '#a8946a', // ledger lines, mirror-writing ghost
  cave: '#2c2213', // cave interior
};

const r2 = (n: number) => Math.round(n * 100) / 100;
const pts = (a: Array<[number, number]>) => a.map(([x, y]) => `${r2(x)} ${r2(y)}`).join(' L ');

/* ---- reusable nature-study primitives (drawn centered on the origin) ---- */

/** 水の渦（乱流）。中央の大渦＋剥がれ落ちる小渦＝レオナルドの turbulence 手記。 */
function eddy(): string {
  const spiral = (cx: number, cy: number, a: number, b: number, turns: number, dir: number) => {
    const p: Array<[number, number]> = [];
    const steps = Math.round(turns * 24);
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * 2 * Math.PI;
      const rr = a + b * t;
      p.push([cx + dir * rr * Math.cos(t), cy + rr * Math.sin(t)]);
    }
    return `<path d="M ${pts(p)}" fill="none" stroke="${PAL.ink}" stroke-width="2"` +
      ` stroke-linecap="round" opacity="0.9"/>`;
  };
  // Streaks feeding the eddy from the left (the current before it curls).
  const feed = [-58, -46, -34]
    .map((y) => `<path d="M -70 ${y} Q -30 ${y + 4} -8 ${y + 18}" fill="none"` +
      ` stroke="${PAL.inkSoft}" stroke-width="1.4" opacity="0.7"/>`)
    .join('');
  return (
    feed +
    spiral(0, 0, 3, 3.1, 2.6, 1) + // main vortex
    spiral(40, 34, 2, 1.7, 1.7, -1) + // shed vortex (small, counter-turning)
    spiral(-30, 40, 1.6, 1.3, 1.4, 1)
  );
}

/** 鳥（飛翔）＝側面プロフィールの滑空する鳥。手記の飛翔研究。 */
function birds(): string {
  // Side view (head + beak to the right, one raised wing, forked tail). A side profile reads as
  // "bird" far more reliably than a symmetric front/top view, which children read as an insect
  // (eval 2026-07-19: the front-view spread-wing was called "トンボかセミか虫、もしくは鳥").
  const body = `<path d="M -30 6 C -10 12 18 11 36 1 C 22 -4 -10 -2 -30 6 Z" fill="${PAL.ink}"/>`;
  const head = `<circle cx="32" cy="-1" r="6.5" fill="${PAL.ink}"/>` +
    `<path d="M 37 -3 L 50 0 L 37 4 Z" fill="${PAL.ink}"/>` + // beak, pointing forward (right)
    `<circle cx="34" cy="-2" r="1.4" fill="${PAL.paper}"/>`; // eye
  // One broad raised wing sweeping up-and-back, with two feather partings so it reads as a WING.
  // (Kept as a clean single sweep — a notched trailing edge read as rough; a deep forked TAIL, not
  // the wing, was the fish cue, and that is what got removed — eval 2026-07-19.)
  const wing = `<path d="M 2 1 C -12 -24 22 -34 46 -20 C 30 -13 14 -5 2 1 Z" fill="${PAL.ink}" opacity="0.94"/>` +
    `<path d="M 10 -6 Q 26 -18 42 -19" fill="none" stroke="${PAL.paper}" stroke-width="1.1" opacity="0.5"/>` +
    `<path d="M 6 -2 Q 20 -12 34 -15" fill="none" stroke="${PAL.paper}" stroke-width="1" opacity="0.4"/>`;
  // A simple pointed tail (NOT a deep fork) — a bird tail, not a fish tail.
  const tail = `<path d="M -30 6 L -55 1 L -52 7 L -55 12 Z" fill="${PAL.ink}" opacity="0.94"/>`;
  return tail + body + wing + head;
}

/** 光と球（明暗法）。上左に光、右下へ滑らかな曲面ハッチ、下に落ち影。 */
function sphere(uid: string): string {
  const R = 52;
  // The radial gradient (`-sph`, bright upper-left → dark rim) makes it read as a lit ball.
  // A few SMOOTH quadratic hatch strokes on the shaded (right) side add the hand-drawn texture;
  // each bows with the surface and stays inside the rim (chord half = sqrt(R^2 - x^2)).
  let hatch = '';
  for (let i = 1; i <= 4; i++) {
    const x = R * (0.34 + 0.15 * i);
    const half = Math.sqrt(Math.max(0, R * R - x * x)) * 0.94;
    hatch += `<path d="M ${r2(x - 4)} ${r2(-half)} Q ${r2(x + 5)} 0 ${r2(x - 4)} ${r2(half)}"` +
      ` fill="none" stroke="${PAL.inkSoft}" stroke-width="1.3" stroke-linecap="round"` +
      ` opacity="${r2(0.18 + 0.05 * i)}"/>`;
  }
  return (
    `<ellipse cx="24" cy="${R + 15}" rx="44" ry="9" fill="${PAL.inkSoft}" opacity="0.26"/>` + // cast shadow
    `<circle cx="0" cy="0" r="${R}" fill="url(#${uid}-sph)" stroke="${PAL.ink}" stroke-width="2"/>` +
    hatch +
    `<ellipse cx="-18" cy="-20" rx="12" ry="9" fill="#f6efd6" opacity="0.6"/>` // highlight
  );
}

/** 葉（植物観察）。とがった楕円の葉身＋主脈＋曲がる側脈＋葉柄＝一目で「葉」。 */
function leaf(): string {
  const outline = `M 0 -52 C 30 -36 34 22 0 52 C -34 22 -30 -36 0 -52 Z`;
  const midrib = `<path d="M 0 -46 L 0 60" fill="none" stroke="${PAL.ink}" stroke-width="1.8"/>`;
  let veins = '';
  for (let i = 0; i < 4; i++) {
    const y = -32 + i * 20;
    const reach = 22 - i * 2.5;
    veins +=
      `<path d="M 0 ${y} Q ${r2(reach * 0.6)} ${y - 2} ${r2(reach)} ${y + 10}" fill="none"` +
      ` stroke="${PAL.inkSoft}" stroke-width="1.2" opacity="0.75"/>` +
      `<path d="M 0 ${y} Q ${r2(-reach * 0.6)} ${y - 2} ${r2(-reach)} ${y + 10}" fill="none"` +
      ` stroke="${PAL.inkSoft}" stroke-width="1.2" opacity="0.75"/>`;
  }
  return (
    `<path d="${outline}" fill="#dfd2a8" stroke="${PAL.ink}" stroke-width="2"/>` +
    midrib +
    veins
  );
}

/** 洞窟の入口（岩のアーチ＋奥の闇＋地層の線）。 */
function arch(uid: string): string {
  const mouth = `M -60 60 L -54 -6 Q -30 -52 0 -54 Q 30 -52 54 -6 L 60 60 Z`;
  let strata = '';
  for (let i = 0; i < 4; i++) {
    const y = -30 + i * 20;
    strata += `<path d="M ${-56 + i * 3} ${y} Q 0 ${y - 8} ${56 - i * 3} ${y}" fill="none"` +
      ` stroke="${PAL.inkSoft}" stroke-width="1.4" opacity="0.6"/>`;
  }
  return (
    `<path d="${mouth}" fill="url(#${uid}-cave)" stroke="${PAL.ink}" stroke-width="2.4"/>` +
    // inner darkness gradient sits inside the mouth; strata ride the rock face outside it
    `<path d="M -40 60 L -36 6 Q -18 -30 0 -32 Q 18 -30 36 6 L 40 60 Z" fill="${PAL.cave}" opacity="0.9"/>` +
    strata
  );
}

/* ---- composition-study primitives (the 4th-visual vocabulary for 「絵を 組み立てる」 scenes) ---- */

/**
 * 一点透視の部屋。原点が消失点で、天井・床・壁のすべての線がそこへ収束する。
 * 奥の壁（原点を囲む矩形）から手前へ伸びる4本の稜線は、いずれも原点を通る直線の一部
 * ＝作図が絵の中に見えている「下絵」の状態（davinci ch4『最後の晩餐』の構図）。
 */
function perspective(uid: string): string {
  const BW = 130; // back wall half width
  const BT = -105; // back wall top
  const BB = 75; // back wall bottom
  const sC = 170 / -BT; // ceiling rail scale at the front edge (y = -170)
  const sF = 150 / BB; // floor rail scale at the front edge (y = 150)
  const line = (x1: number, y1: number, x2: number, y2: number, w = 2, o = 0.85) =>
    `<line x1="${r2(x1)}" y1="${r2(y1)}" x2="${r2(x2)}" y2="${r2(y2)}"` +
    ` stroke="${PAL.ink}" stroke-width="${w}" opacity="${o}"/>`;

  // Back wall + three arched windows (the far light the room is aimed at).
  let wall = `<rect x="${-BW}" y="${BT}" width="${BW * 2}" height="${BB - BT}"` +
    ` fill="url(#${uid}-wall)" stroke="${PAL.ink}" stroke-width="2"/>`;
  for (const cx of [-70, 0, 70]) {
    wall += `<path d="M ${cx - 24} 6 L ${cx - 24} -52 Q ${cx} -78 ${cx + 24} -52 L ${cx + 24} 6 Z"` +
      ` fill="#f4ecd4" stroke="${PAL.ink}" stroke-width="1.6"/>` +
      `<path d="M ${cx - 20} -6 Q ${cx - 6} -22 ${cx + 20} -10" fill="none"` +
      ` stroke="${PAL.inkFaint}" stroke-width="1.2" opacity="0.8"/>`; // distant hills
  }

  // The four rails from the back wall corners out to the front edge of the frame.
  const rails =
    line(-BW * sC, BT * sC, -BW, BT) + line(BW * sC, BT * sC, BW, BT) +
    line(-BW * sF, BB * sF, -BW, BB) + line(BW * sF, BB * sF, BW, BB);

  // Ceiling coffers + side-wall panels at three depths (same s ⇒ the edge stays vertical).
  let depth = '';
  for (const s of [1.16, 1.32, 1.5]) {
    depth += line(-BW * s, BT * s, BW * s, BT * s, 1.4, 0.55); // coffer transversal
    depth += line(-BW * s, BT * s, -BW * s, BB * s, 1.4, 0.5); // left wall panel edge
    depth += line(BW * s, BT * s, BW * s, BB * s, 1.4, 0.5); // right wall panel edge
  }

  // Construction rays: short dashed stubs radiating from the vanishing point — the draughtsman's
  // own lines, left in the sketch, so the convergence is a visible fact of the drawing. Kept short
  // (they stay on the back wall) so they read as "everything meets HERE", not as stray diagonals.
  let rays = '';
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 2 * Math.PI + Math.PI / 8;
    rays += `<line x1="0" y1="0" x2="${r2(Math.cos(a) * 86)}" y2="${r2(Math.sin(a) * 62)}"` +
      ` stroke="${PAL.inkSoft}" stroke-width="1.1" stroke-dasharray="6 5" opacity="0.6"/>`;
  }

  const vp = `<circle cx="0" cy="0" r="4" fill="none" stroke="${PAL.ink}" stroke-width="1.6"/>` +
    line(-13, 0, 13, 0, 1.2, 0.7) + line(0, -13, 0, 13, 1.2, 0.7);

  return wall + rails + depth + rays + vp;
}

/** 長い卓（手前へわずかに広がる天板＋垂れる布＋皿）。 */
function table(): string {
  const top = `<path d="M -200 -16 L 200 -16 L 224 12 L -224 12 Z" fill="#e6dab6"` +
    ` stroke="${PAL.ink}" stroke-width="2"/>`;
  const cloth = `<path d="M -224 12 L 224 12 L 224 40 Q 0 52 -224 40 Z" fill="#f0e7cb"` +
    ` stroke="${PAL.ink}" stroke-width="1.6"/>`;
  let folds = '';
  for (let x = -180; x <= 180; x += 60) {
    folds += `<path d="M ${x} 13 Q ${x + 4} 28 ${x} 44" fill="none" stroke="${PAL.inkFaint}"` +
      ` stroke-width="1.2" opacity="0.7"/>`;
  }
  let dishes = '';
  for (const x of [-150, -84, -18, 52, 120, 178]) {
    dishes += `<ellipse cx="${x}" cy="-4" rx="15" ry="5" fill="none" stroke="${PAL.inkSoft}"` +
      ` stroke-width="1.3" opacity="0.8"/>`;
  }
  return top + cloth + folds + dishes;
}

/** 人ひとり（頭・衣・両腕）。pose で腕の向きだけを替える＝群れの身ぶりを作る最小語彙。 */
function personShape(pose: number): string {
  const head = `<circle cx="0" cy="-42" r="16" fill="#e6dab6" stroke="${PAL.ink}" stroke-width="2"/>`;
  const robe = `<path d="M -24 -20 Q -34 8 -35 48 L 35 48 Q 34 8 24 -20 Q 0 -10 -24 -20 Z"` +
    ` fill="#e0d3ab" stroke="${PAL.ink}" stroke-width="2"/>`;
  // [start, elbow, hand] per arm, chosen so each pose reads as a different reaction.
  const ARMS: Array<Array<[number, number, number, number, number, number]>> = [
    [[-19, -18, -36, -30, -44, -46], [19, -18, 34, -26, 40, -42]], // 両手を上げる（おどろき）
    [[-20, -18, -36, -2, -48, 10], [20, -18, 36, -2, 48, 10]], // 両腕をひらく
    [[-19, -17, -4, -6, 14, -2], [20, -18, 34, -30, 41, -44]], // 片手は前、片手は上（問いかけ）
  ];
  let arms = '';
  for (const [sx, sy, ex, ey, hx, hy] of ARMS[pose % ARMS.length]) {
    arms += `<path d="M ${sx} ${sy} Q ${ex} ${ey} ${hx} ${hy}" fill="none" stroke="${PAL.ink}"` +
      ` stroke-width="4.5" stroke-linecap="round"/>` +
      `<circle cx="${hx}" cy="${hy}" r="7" fill="#e6dab6" stroke="${PAL.ink}" stroke-width="1.8"/>`;
  }
  return robe + arms + head;
}

/** ざわめく三人の群れ（身ぶりの違いで「心のうごき」を見せる）。 */
function figures(): string {
  const cluster: Array<[number, number, number, number]> = [
    [-38, 6, 0.94, 0],
    [0, 0, 1, 2],
    [38, 7, 0.92, 1],
  ];
  return cluster
    .map(([dx, dy, sc, pose]) =>
      `<g transform="translate(${dx} ${dy}) scale(${sc})">${personShape(pose)}</g>`)
    .join('');
}

const BASE_R = 60; // a subject at scale 1 spans ~120 across
function drawSubject(s: StudySubject, uid: string): string {
  const scale = (s.scale ?? 1) * (BASE_R / 60);
  let body: string;
  switch (s.kind) {
    case 'eddy': body = eddy(); break;
    case 'bird': body = birds(); break;
    case 'sphere': body = sphere(uid); break;
    case 'leaf': body = leaf(); break;
    case 'arch': body = arch(uid); break;
    case 'perspective': body = perspective(uid); break;
    case 'table': body = table(); break;
    case 'person': body = personShape(1); break;
    case 'figures': body = figures(); break;
  }
  const flip = s.flip ? ' scale(-1 1)' : '';
  return `<g transform="translate(${r2(s.x)} ${r2(s.y)}) scale(${r2(scale)})${flip}">${body}</g>`;
}

/** 隅の鏡文字の飾り（意味を持たない波状インク＝左利き・鏡文字の気配だけ）。 */
function mirrorScribble(): string {
  const lines: string[] = [];
  for (let i = 0; i < 4; i++) {
    const y = 402 + i * 20;
    const p: Array<[number, number]> = [];
    for (let k = 0; k <= 16; k++) {
      const x = 560 + k * 12;
      p.push([x, y + Math.sin(k * 1.3 + i) * 3]);
    }
    lines.push(`<path d="M ${pts(p)}" fill="none" stroke="${PAL.inkFaint}"` +
      ` stroke-width="1.3" opacity="0.5"/>`);
  }
  return lines.join('');
}

/**
 * 習作ページの SVG。主ビジュアルとして単独で描け、observe オーバーレイはこの viewBox の
 * 上にそのまま重なる（座標系が一致する）。
 */
export function buildStudyPage(key: string, page: StudyPage): string {
  const uid = `sp-${key}`;
  const defs =
    `<defs>` +
    `<radialGradient id="${uid}-page" cx="0.42" cy="0.36" r="0.75">` +
    `<stop offset="0" stop-color="${PAL.paper}"/>` +
    `<stop offset="1" stop-color="${PAL.paperEdge}"/>` +
    `</radialGradient>` +
    `<radialGradient id="${uid}-sph" cx="0.32" cy="0.3" r="0.85">` +
    `<stop offset="0" stop-color="#f3ead0"/>` +
    `<stop offset="0.62" stop-color="#d8c7a0"/>` +
    `<stop offset="1" stop-color="#a68f66"/>` +
    `</radialGradient>` +
    `<linearGradient id="${uid}-wall" x1="0" y1="0" x2="0" y2="1">` +
    `<stop offset="0" stop-color="#e4d7b0"/>` +
    `<stop offset="1" stop-color="#d3c39a"/>` +
    `</linearGradient>` +
    `<radialGradient id="${uid}-cave" cx="0.5" cy="0.85" r="0.9">` +
    `<stop offset="0" stop-color="#d8c79c"/>` +
    `<stop offset="1" stop-color="#8a744a"/>` +
    `</radialGradient>` +
    `</defs>`;

  // Faint ledger lines + a left margin rule (the manuscript grid the sketches sit on).
  let rules = `<line x1="70" y1="30" x2="70" y2="${H - 30}" stroke="${PAL.inkFaint}"` +
    ` stroke-width="1.2" opacity="0.5"/>`;
  for (let y = 92; y < H - 30; y += 46) {
    rules += `<line x1="30" y1="${y}" x2="${W - 30}" y2="${y}" stroke="${PAL.inkFaint}"` +
      ` stroke-width="1" opacity="0.28"/>`;
  }

  const title = page.title
    ? `<text x="88" y="58" font-family="'Yu Mincho','Hiragino Mincho ProN',serif"` +
      ` font-size="30" fill="${PAL.ink}" opacity="0.9" letter-spacing="4">${esc(page.title)}</text>`
    : '';

  const subjects = page.subjects.map((s) => drawSubject(s, uid)).join('');

  return (
    `<svg class="scene-study" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"` +
    ` role="img" aria-label="手記の ページ">` +
    defs +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#${uid}-page)"/>` +
    rules +
    (page.mirror ? mirrorScribble() : '') +
    title +
    subjects +
    `</svg>`
  );
}
