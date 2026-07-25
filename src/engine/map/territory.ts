// Shared territory-coloring logic for both map renderers (campaign map & scene
// maps), kept in its own module so neither renderer has to import the other.
import type { WorkMap } from '../types';

/**
 * Territory fill color active at view chapter `vc`: the last faction phase whose
 * fromCh <= vc, or null when no phase has been reached yet (nothing is owned, so
 * the null is never used to paint). Both maps call this so they color identically.
 */
export function activeFactionColor(map: WorkMap, vc: number): string | null {
  let color: string | null = null;
  for (const ph of map.factionPhases) if (ph.fromCh <= vc) color = ph.color;
  return color;
}

/**
 * Does the protagonist hold province `pid` at view chapter `vc`?
 *
 * Both renderers ask this instead of comparing chapters themselves, so a region can be
 * given up as well as gained (`WorkMap.territory`): transfer (移封) and confiscation (改易)
 * are the era's normal course — ieyasu hands 三河・遠江・駿河・甲斐・信濃 back in 1590 to be
 * moved to 関東, which a gain-only model paints as if he still held them.
 */
export function ownsAt(map: WorkMap, pid: string | number, vc: number): boolean {
  const v = map.territory[pid];
  if (v === undefined) return false;
  if (typeof v === 'number') return v > 0 && v <= vc;
  return v.some((s) => s.from > 0 && s.from <= vc && (s.to === undefined || vc < s.to));
}
