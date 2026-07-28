// ★前提知識の機械検査。tests/known-premise.test.ts（ゲート）と
// scripts/premise-audit.ts（CLI）が共用する。
//
// The rule (docs/WRITING.md 11): a work may only overturn what it made the reader
// believe inside the work. Leaning on 「有名な」「世にいう」「教科書」 assumes a reader who
// already knows the person — the 10-14 year old meeting them for the first time gets a
// lecture from outside the story instead (docs/design/known-premise.md).
//
// Markers are a PROXY, not the defect: they are the cheap, total-scan shadow of it.
// Prose that quotes the received story without a marker is invisible here — the audit's
// floor is the gate, the ceiling stays with /eval-work personas. Surfaces reviewed and
// deliberately kept move to ALLOWED_PREMISE below, with a one-line reason each.
//
// Two ledgers, two homes: ALLOWED_PREMISE lives here because "this is not the defect" is
// part of what the audit MEANS (and the CLI must show it, or every cycle re-reviews the
// same lines), while tests/known-premise.test.ts keeps BASELINE = "a defect not yet fixed".
//
// Surfaces come from ruby-audit (the same "one screen a reader meets" model), plus the
// spine — riddle / title copy — which has no furigana surface of its own but is where a
// premise does the most damage: it is the first thing read and it frames all 7 chapters.
import type { Work } from '../../src/engine/types';
import { plainText } from './content-stats';
import { workSurfaces, bucketOf, type Surface } from './ruby-audit';

/** Phrases that hand the reader a received story instead of building one. */
export const PREMISE_MARKERS = [
  '有名',
  '名高い',
  '世にいう',
  'だれもが',
  '誰もが',
  'よく言われ',
  'よくいわれ',
  'と思うかも',
  '教科書',
  'おなじみ',
  '語られてきた',
];

/**
 * Reviewed and deliberately kept, keyed `作品|面|マーカー` → 審査した件数と理由。
 *
 * The ratchet only knows how to say "fewer", so it pushes on correct prose too: 「長く、そう
 * 語られて きた」 is a marker AND the G6 hedge that attributes a later legend to its tellers.
 * Stripping it would turn 諸説 into assertion — the rule is "do not lean on what the reader
 * already knows", not "delete every hedge". A hedge that NAMES the teller and then meets it
 * with the record is the WRITING 11 pattern (着せてから裏返す), not a violation of it.
 *
 * `n` is what makes an exemption stay reviewed: a surface can carry the same marker twice
 * (a #deep's body and cite, say), and a key alone would wave the second one through on the
 * first one's reason. Only the first `n` hits are excused; the rest stay open, and the test
 * requires n to equal the live count — so a newly written occurrence goes red, not quiet.
 */
export const ALLOWED_PREMISE: Record<string, { n: number; why: string }> = {
  // ieyasu: 後代伝承の帰属ヘッジ 5件。どれも「だれが語ってきたか」を名指した直後に記録を突き合わせる形で、
  // 読者の既知には寄りかかっていない（reveal の一枚は、着せる装置そのもの）。
  'ieyasu|ch2/2-d#reveal|語られてきた': { n: 1, why: '絵を見せて伝承を着せる reveal——次の本文が「記録は無かった」で裏返す当の前提' },
  'ieyasu|ch4/4-d#deep|語られてきた': { n: 1, why: '学説史（旧説→近年の見直し）の記述。削ると旧説を無主体の断定にしてしまう' },
  'ieyasu|ch6/6-c#deep|語られてきた': { n: 1, why: '淀殿犯人説の帰属ヘッジ。直後に「たしかめられる紙はとぼしい」（△）が続く' },
  'ieyasu|card:p-yodo|語られてきた': { n: 1, why: '同上をカード裏で。「勝った側の世で貼られたラベル」と出どころまで名指す' },
  'ieyasu|card:w-shikamizo|語られてきた': { n: 1, why: 'しかみ像の伝承の帰属ヘッジ。直後に2015年の記録簿調査が続く' },
};

/** Live hit counts per ALLOWED_PREMISE key — the ledger's reconciliation input. */
export function allowKeyCounts(works: Work[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const w of works)
    for (const h of premiseSurfaces(w).flatMap(auditSurface)) {
      const key = `${w.id}|${h.surface}|${h.marker}`;
      if (key in ALLOWED_PREMISE) out[key] = (out[key] ?? 0) + 1;
    }
  return out;
}

export interface PremiseHit {
  surface: string;
  marker: string;
  /** Surrounding plain text, so the author can find the spot. */
  excerpt: string;
  /** Set when reviewed and kept — the reason from ALLOWED_PREMISE. */
  allowed?: string;
}

/** Title-screen copy and the riddle: the frame every chapter is read through. */
export function spineSurface(work: Work): Surface {
  const s = work.strings;
  return {
    id: 'spine',
    parts: [work.riddle, s.titleSub, s.riddleLead, s.riddleHeart, s.titleHeroTease, s.titleFacesLead, s.titleNote]
      .filter(Boolean) as string[],
  };
}

export function premiseSurfaces(work: Work): Surface[] {
  return [spineSurface(work), ...workSurfaces(work)];
}

export function auditSurface(surface: Surface): PremiseHit[] {
  const hits: PremiseHit[] = [];
  for (const part of surface.parts) {
    const t = plainText(part);
    for (const marker of PREMISE_MARKERS)
      for (let i = t.indexOf(marker); i >= 0; i = t.indexOf(marker, i + marker.length))
        hits.push({
          surface: surface.id,
          marker,
          excerpt: t.slice(Math.max(0, i - 10), i + marker.length + 10),
        });
  }
  return hits;
}

/** Every hit, with reviewed-and-kept ones tagged (not dropped — the CLI lists them). */
export function auditWork(work: Work): PremiseHit[] {
  const seen: Record<string, number> = {};
  return premiseSurfaces(work)
    .flatMap(auditSurface)
    .map((h) => {
      const key = `${work.id}|${h.surface}|${h.marker}`;
      const entry = ALLOWED_PREMISE[key];
      const nth = (seen[key] = (seen[key] ?? 0) + 1);
      return entry && nth <= entry.n ? { ...h, allowed: entry.why } : h;
    });
}

/** Counts per bucket, excluding reviewed-and-kept hits — this is what the ratchet gates. */
export function auditBuckets(work: Work): Record<string, number> {
  const out: Record<string, number> = {};
  for (const h of auditWork(work))
    if (!h.allowed) out[bucketOf(h.surface)] = (out[bucketOf(h.surface)] ?? 0) + 1;
  return out;
}

/**
 * A-type sparks (docs/design/known-premise.md §4): 「え！？」 panels that overturn a
 * received story. Not gated — a reversal is legitimate once the work has dressed the
 * reader in the belief — but this is the worklist for the per-work triage slices.
 */
export function reversalSparks(work: Work): { scene: string; excerpt: string }[] {
  const out: { scene: string; excerpt: string }[] = [];
  for (const ch of work.story.chapters)
    for (const [sid, sc] of Object.entries(ch.scenes)) {
      const t = plainText(sc.spark ?? '');
      if (/じつは|実は|ちがう|違う/.test(t)) out.push({ scene: `ch${ch.id}/${sid}`, excerpt: t });
    }
  return out;
}
export function sparkCount(work: Work): number {
  return work.story.chapters.flatMap((ch) => Object.values(ch.scenes)).filter((sc) => sc.spark).length;
}
