// 家紋・朱印・巻物などの汎用アート（旧 ART.monKiri/monOmodaka/seal/scrollIcon,
// index.html 722-810 逐語）。作品の家紋は work.mon（キー）→ MON レジストリで解決。

// 五七桐（豊臣）— 簡略化した象徴図
export function monKiri(c?: { leaf: string; flower: string }): string {
  c = c || { leaf: 'var(--midori)', flower: 'var(--gold)' };
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="0">
      ${[0, 1, 2]
        .map((i) => {
          const x = 50 + (i - 1) * 26;
          const h = i === 1 ? 60 : 48;
          return `<g transform="translate(${x},${58})">
          <path d="M0,4 C-13,0 -13,-${h * 0.7} 0,-${h} C13,-${h * 0.7} 13,0 0,4 Z" fill="${c!.leaf}" opacity="${i === 1 ? 1 : 0.9}"/>
          ${[0, 1, 2].map((j) => `<rect x="-2" y="${-h + 6 + j * 7}" width="4" height="${(i === 1 ? 5 : 4) - j * 0}" rx="2" fill="${c!.flower}"/>`).join('')}
        </g>`;
        })
        .join('')}
      </g>
    </svg>`;
}
// Agehacho (swallowtail butterfly) — the Taira/Heike crest (for Kiyomori).
// Symmetric butterfly mirrored about x=50.
export function monAgehacho(): string {
  // Right-half wings (forewing + swallowtail hindwing); mirrored to the left for symmetry.
  const wing = `<path d="M50,33 C58,21 74,17 84,25 C91,32 87,43 74,47 C64,50 54,48 50,42 Z"/>
    <path d="M50,45 C61,44 74,50 76,61 C78,71 70,75 64,71 L67,81 L60,72 C55,66 52,56 50,52 Z" opacity=".9"/>`;
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="var(--accent)">
        <g>${wing}</g>
        <g transform="matrix(-1,0,0,1,100,0)">${wing}</g>
        <path d="M50,26 C47,29 46,40 47,53 C47,63 49,70 50,75 C51,70 53,63 53,53 C54,40 53,29 50,26 Z"/>
        <circle cx="50" cy="25" r="4"/>
        <path d="M50,24 Q58,16 67,13" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"/>
        <path d="M50,24 Q42,16 33,13" fill="none" stroke="var(--accent)" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="67" cy="13" r="2"/>
        <circle cx="33" cy="13" r="2"/>
      </g>
    </svg>`;
}
// 沢瀉（おもだか）— 秀長の替紋のイメージ
export function monOmodaka(): string {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g transform="translate(50,52)" fill="var(--accent)">
        <path d="M0,-34 C16,-20 24,-2 0,20 C-24,-2 -16,-20 0,-34 Z"/>
        <path d="M0,-6 C22,-2 30,10 22,26 C10,20 2,10 0,-6 Z" opacity=".85"/>
        <path d="M0,-6 C-22,-2 -30,10 -22,26 C-10,20 -2,10 0,-6 Z" opacity=".85"/>
      </g>
    </svg>`;
}
// Ken-hanabishi within a ring (丸に剣花菱) — the Katsu family crest (for Kaishu).
// Four SEPARATE hanabishi petals pointing N/E/S/W (each with a two-lobed outer edge and a
// pointed inner tip), a small diamond core, and four sword blades in the diagonal gaps,
// enclosed in a ring. Four-fold symmetric about (50,50); all geometry within [16,84].
export function monKenhanabishi(): string {
  const petal = `<path d="M50,45.5 L41.5,33.5 Q44,25 50,28.8 Q56,25 58.5,33.5 Z"/>`;
  const blade = `<path d="M78,50 L66,46.6 L58.5,50 L66,53.4 Z"/>`;
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="var(--accent)">
        <circle cx="50" cy="50" r="34" fill="none" stroke="var(--accent)" stroke-width="4"/>
        ${[0, 90, 180, 270].map((a) => `<g transform="rotate(${a} 50 50)">${petal}</g>`).join('')}
        <path d="M50,44 L56,50 L50,56 L44,50 Z"/>
        ${[45, 135, 225, 315].map((a) => `<g transform="rotate(${a} 50 50)">${blade}</g>`).join('')}
      </g>
    </svg>`;
}
// Mitsuba-aoi within a ring (丸に三つ葉葵) — the Tokugawa crest (for Ieyasu).
// Three futaba-aoi leaves radiating from a small hub at 0/120/240°: each leaf is cordate with
// its point at the hub and its cleft on the ring side, so the heart reads outward. Veins are cut
// as negative space in --bg (the crest sits on the page/topbar background, never on --panel).
// Three-fold symmetric about (50,50); all geometry within the ring's inner radius (32).
export function monAoi(): string {
  // Right half of one leaf pointing up; mirrored about x=50, which closes the cleft at (50,28)
  // and gives the blade a blunt base at y=45. The base is blunt rather than pointed on purpose:
  // a pointed base meets the hub in a single point, so the leaf reads as floating free of it.
  const half = `<path d="M50,45 C55,44.5 62,40 65.5,32 C68,25.5 62,20.5 56,22.5 C51.5,24 50,25.5 50,28 Z"/>`;
  // Veins fan from (50,46) — under the hub, which is painted last and hides every origin, so the
  // veins read as emanating from the hub's rim instead of notching it.
  // THREE veins per leaf, not the five a formal aoi carries: the veins converge, so their density
  // peaks exactly at the middle, where the crest most needs solid ink. At the topbar's real 22px
  // (app.css .tb-logo .mon) a 1.6u vein is 0.35px, so five of them do not vanish — they
  // anti-alias into a ~65% wash over each leaf base and the crest reads as an EMPTY ring.
  // Three hold the center dark at 22px (raster-checked against 丸に剣花菱 via scripts/render-mon.ts)
  // and read *more* like an aoi at 96px, because a dense fan flattens the cordate lobes into a
  // shell. Adding veins back trades the topbar away for detail only the title screen can show.
  const veins = `<g fill="none" stroke="var(--bg)" stroke-width="1.6" stroke-linecap="round">
        <path d="M50,46 L50,30"/>
        <path d="M50,46 Q57,38 62,31"/>
        <path d="M50,46 Q43,38 38,31"/>
      </g>`;
  const leaf = `<g>${half}<g transform="matrix(-1,0,0,1,100,0)">${half}</g>${veins}</g>`;
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="var(--accent)">
        <circle cx="50" cy="50" r="34" fill="none" stroke="var(--accent)" stroke-width="4"/>
        ${[0, 120, 240].map((a) => `<g transform="rotate(${a} 50 50)">${leaf}</g>`).join('')}
        <circle cx="50" cy="50" r="6"/>
      </g>
    </svg>`;
}
// Vitruvian "squared circle" — a personal emblem for Leonardo (davinci), who had no family crest.
// The circle-and-square is his most iconic geometry (the Vitruvian proportion study inscribes a man
// in both a circle and a square). A bold ring (r=34, matching the 丸に crests) with an upright square
// inscribed so its corners just touch the ring (half-side 24 → corner distance 24√2 ≈ 34), plus a
// center point (the compass origin of proportion). No thin detail: reads as concentric shapes at the
// topbar's real 22px, unlike a dense knot (the aoi lesson — 1.6u strokes anti-alias away at 22px).
export function monVinci(): string {
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="var(--accent)" stroke-width="4" stroke-linejoin="round">
        <circle cx="50" cy="50" r="34"/>
        <rect x="26" y="26" width="48" height="48"/>
      </g>
      <circle cx="50" cy="50" r="4.5" fill="var(--accent)"/>
    </svg>`;
}
// Mitsu-uroko (三つ鱗) — the Hojo crest (for Masako). Three solid triangles ("scales") stacked in
// a pyramid: one on top, two below. No ring (the Hojo crest is drawn bare), no thin detail — solid
// wedges survive the topbar's real 22px, the failure mode the aoi veins taught (see monAoi).
export function monMitsuuroko(): string {
  // One equilateral-ish scale, apex up, drawn about its own center then translated.
  const scale = (cx: number, cy: number, w: number, h: number) =>
    `<path d="M${cx},${cy - h / 2} L${cx + w / 2},${cy + h / 2} L${cx - w / 2},${cy + h / 2} Z"/>`;
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="var(--accent)">
        ${scale(50, 36, 40, 34)}
        ${scale(30, 72, 40, 34)}
        ${scale(70, 72, 40, 34)}
      </g>
    </svg>`;
}
// 朱印
/**
 * Vermilion seal stamped on a Hist panel. Takes 1〜2 glyphs (`Hist.seal`, else 史実/もし).
 *
 * A one-glyph seal is centered, NOT top-aligned with a filler underneath. The old per-glyph
 * fallback (`txt[0] || '史'` / `txt[1] || '実'`) reached for the DEFAULT's second glyph whenever
 * the caller passed a single character, so hidenaga/kiyomori 終章 — `seal:'心'`, the panel over
 * the brothers' unrecorded last words — had been stamping 「心実」 in production. A default is only
 * a default when there is no input at all; per-character fallback silently mixes caller text with
 * house text. Splitting with `[...]` (code points, not UTF-16 units) also keeps a surrogate pair
 * whole rather than stamping half of one.
 */
export function seal(txt: string): string {
  const g = [...(txt || '史実')].slice(0, 2);
  const glyph = (s: string, y: number, size: number) =>
    `<text x="50" y="${y}" text-anchor="middle" font-family="serif" font-weight="700" font-size="${size}" fill="#fff">${s}</text>`;
  // The two-glyph path stays byte-identical to legacy (engine-parity holds it); only the
  // one-glyph path — the broken one — is new.
  const body =
    g.length > 1
      ? [glyph(g[0], 42, 30), glyph(g[1], 76, 30)].join('\n      ')
      : glyph(g[0], 63, 44);
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="6" y="6" width="88" height="88" rx="10" fill="var(--seal)"/>
      <rect x="12" y="12" width="76" height="76" rx="6" fill="none" stroke="#fff" stroke-width="2.5" opacity=".9"/>
      ${body}
    </svg>`;
}
// ことばカードの意匠（巻物）
export function scrollIcon(): string {
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="20" y="24" width="60" height="52" rx="4" fill="color-mix(in srgb,var(--gold) 22%,var(--panel))" stroke="var(--gold-deep)" stroke-width="2"/>
    <rect x="14" y="20" width="72" height="8" rx="4" fill="var(--gold-deep)"/>
    <rect x="14" y="72" width="72" height="8" rx="4" fill="var(--gold-deep)"/>
    <line x1="30" y1="38" x2="70" y2="38" stroke="var(--gold-deep)" stroke-width="2" opacity=".6"/>
    <line x1="30" y1="48" x2="64" y2="48" stroke="var(--gold-deep)" stroke-width="2" opacity=".6"/>
    <line x1="30" y1="58" x2="68" y2="58" stroke="var(--gold-deep)" stroke-width="2" opacity=".6"/>
  </svg>`;
}

export function monSoroban(): string {
  // 算盤 (abacus) = shibusawa's spine, 論語と算盤. A thematic emblem, NOT a family crest — the
  // Shibusawa family crest is 要出典確認 and stamping an unconfirmed crest onto the topbar is the
  // 藍リング trap (WRITING 地図・図の書法: 符号化前に典拠). Follows the davinci `vinci` precedent
  // (a non-samurai work takes a thematic mark). Bold frame + reckoning beam + solid diamond beads
  // so it survives the topbar's real 22px (the aoi lesson).
  const bead = (cx: number, cy: number, w = 12, h = 13) =>
    `<path d="M${cx},${cy - h / 2} L${cx + w / 2},${cy} L${cx},${cy + h / 2} L${cx - w / 2},${cy} Z"/>`;
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <g fill="none" stroke="var(--accent)" stroke-width="6" stroke-linejoin="round">
        <rect x="18" y="22" width="64" height="56" rx="5"/>
        <line x1="18" y1="43" x2="82" y2="43"/>
      </g>
      <g fill="var(--accent)">
        ${bead(37, 35)}${bead(63, 35)}
        ${bead(32, 64)}${bead(50, 64)}${bead(68, 64)}
      </g>
    </svg>`;
}

/** work.mon（キー）→ 家紋 SVG ジェネレータ。 */
export const MON: Record<string, () => string> = {
  omodaka: monOmodaka,
  kiri: () => monKiri(),
  agehacho: monAgehacho,
  kenhanabishi: monKenhanabishi,
  aoi: monAoi,
  vinci: monVinci,
  mitsuuroko: monMitsuuroko,
  soroban: monSoroban,
};

export function monSvg(kind: string): string {
  return (MON[kind] || monOmodaka)();
}
