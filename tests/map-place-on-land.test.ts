// Guards the base coastline against the failure a family playtest found: 「地図に佐渡島が無い？」
// (observation memo 2026-08-05). masako pins 佐渡 (順徳上皇の配所) and 隠岐 (後鳥羽上皇), kiyomori pins
// 厳島 and 鬼界ヶ島 — and every one of those islands was missing from the silhouette, because the
// generator kept only each prefecture's largest ring (scripts/build-japan-coastline.mjs). The label
// sat on blank sea, which reads to a child as "there is no island there".
//
// Two questions, because either one alone passes while the map is wrong:
//   1. do the islands exist in the asset at all (a regeneration can silently drop them again), and
//   2. is every place a work pins standing on drawn land?
// (2) is the general form: it catches an island the works have not needed yet, and a coordinate typo
// that drops a town into the bay. Sea places that are genuinely sea — a strait, a battle between
// ships, an off-map anchor that only supplies an arrow's direction — are listed in SEA_ON_PURPOSE
// with their reason, and the list is checked for rot in both directions.
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { GEO } from '../src/shared/geoJapan';
import type { Geo, Work } from '../src/engine/types';

/** Is [lon,lat] inside any land ring of this geo? Ray casting on the raw [lon,lat] rings. */
function onLand(geo: Geo, lon: number, lat: number): boolean {
  // A wrapping geo stores its land unwrapped east of the antimeridian (see Geo.proj.wrap), so a
  // real western longitude has to be asked about in that geo's own convention too.
  const lons = geo.proj.wrap ? [lon, lon + 360] : [lon];
  for (const ring of geo.land ?? []) {
    const n = ring.length / 2;
    for (const x of lons) {
      let hit = false;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = ring[i * 2],
          yi = ring[i * 2 + 1],
          xj = ring[j * 2],
          yj = ring[j * 2 + 1];
        if (yi > lat !== yj > lat && x < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) hit = !hit;
      }
      if (hit) return true;
    }
  }
  return false;
}

/** Every stage this work can draw a place in: its home geo plus any world a scene names. */
function geosOf(work: Work): Geo[] {
  return [work.map.geo, ...Object.values(work.map.geos ?? {})];
}

// `${work}:${gaz key}` → why this place is water. Only these may miss the land.
const SEA_ON_PURPOSE: Record<string, string> = {
  'kiyomori:ondo': '音戸の瀬戸＝海の道そのもの（切り開いたと伝わる瀬戸）',
  'kiyomori:dannoura': '壇ノ浦＝船どうしの戦い（海上）',
  'kiyomori:song': '宋（寧波）＝枠外の方角だけを指すアンカー',
  'davinci:venezia': 'ヴェネツィア＝潟の上の街（簡略化した海岸線には載らない。岸から約5km＝2px）',
  'katsu:taiheiyo': '太平洋のまん中＝海そのもの（咸臨丸の航海）',
  'shibusawa:taiheiyo': '太平洋のまん中＝海そのもの（帰りの航路）',
};

describe('地図に置いた地名は陸の上に立つ', () => {
  // The islands the shipped works stand on. A drift guard: point counts or byte sizes pass even when
  // a rebuild drops every island again, because the mainland dominates both.
  it('作品が使う島が silhouette に実在する（生成の取りこぼしを捕まえる）', () => {
    expect(onLand(GEO, 138.3667, 38.0333), '佐渡（順徳上皇の配所）が海になっている').toBe(true);
    expect(onLand(GEO, 132.322, 34.293), '厳島（清盛の社）が海になっている').toBe(true);
    expect(onLand(GEO, 130.31, 30.79), '鬼界ヶ島（俊寛の流刑地）が海になっている').toBe(true);
    expect(onLand(GEO, 134.85, 34.4), '淡路島が海になっている').toBe(true);
    expect(onLand(GEO, 133.3, 36.25), '隠岐（島後）が海になっている').toBe(true);
    // …and the sea between them is still sea: an island layer that swallowed the Seto Inland Sea
    // would pass every assertion above.
    expect(onLand(GEO, 132.6, 34.05), '安芸灘（島の無い海）が陸になっている').toBe(false);
    expect(onLand(GEO, 137.5, 38.5), '佐渡沖の日本海が陸になっている').toBe(false);
  });

  it('どの作品の gaz も海に浮いていない（SEA_ON_PURPOSE を除く）', () => {
    const floating: string[] = [];
    for (const work of WORKS) {
      const geos = geosOf(work);
      for (const [key, g] of Object.entries(work.map.gaz)) {
        if (typeof g.lon !== 'number' || typeof g.lat !== 'number') continue; // legacy px anchor
        if (geos.some((geo) => onLand(geo, g.lon!, g.lat!))) continue;
        const id = `${work.id}:${key}`;
        if (!(id in SEA_ON_PURPOSE)) floating.push(`${id} (${g.lon},${g.lat})`);
      }
    }
    expect(floating, `陸の無い場所に地名が置かれている: ${floating.join(' / ')}`).toEqual([]);
  });

  it('SEA_ON_PURPOSE が腐っていない（存在する・いまも海）', () => {
    const stale: string[] = [];
    for (const [id, why] of Object.entries(SEA_ON_PURPOSE)) {
      const [workId, key] = id.split(':');
      const work = WORKS.find((w) => w.id === workId);
      const g = work?.map.gaz[key];
      if (!g || typeof g.lon !== 'number' || typeof g.lat !== 'number') {
        stale.push(`${id}: gaz に無い（${why}）`);
        continue;
      }
      if (geosOf(work!).some((geo) => onLand(geo, g.lon!, g.lat!))) {
        stale.push(`${id}: いまは陸の上＝免除が不要（${why}）`);
      }
    }
    expect(stale, `SEA_ON_PURPOSE の古い行: ${stale.join(' / ')}`).toEqual([]);
  });
});
