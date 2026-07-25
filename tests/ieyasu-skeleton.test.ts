// 徳川家康（第4作）の骨組み。
// 構造整合（遷移・参照・地図・章数・相関図等）と体験予算は、tests/helpers/all-works.ts の
// ALL_WORKS 経由で work-integrity / style-budget が **未登録の骨組みにも** 回している。
// ここに残すのは、セーブの枠の分離（Account.works[id]）と家康固有の設計契約だけ。
import { describe, it, expect } from 'vitest';
import { ieyasu } from '../src/works/ieyasu/index';
import { WORKS } from '../src/works/index';
import { SKELETON_WORKS } from './helpers/all-works';
import { hidenaga } from '../src/works/hidenaga/index';
import { kiyomori } from '../src/works/kiyomori/index';
import { katsu } from '../src/works/katsu/index';

describe('ieyasu: セーブの枠の分離（Account.works[id]）', () => {
  it('新規 id で、既存 3作の 枠に 触れない', () => {
    for (const w of [hidenaga, kiyomori, katsu]) {
      expect(ieyasu.faceHintKey, `vs ${w.id}`).not.toBe(w.faceHintKey);
      expect(ieyasu.id, `vs ${w.id}`).not.toBe(w.id);
    }
  });
});

describe('ieyasu: 骨組み-2 で登録済み', () => {
  it('SKELETON_WORKS は WORKS と交わらない（登録したら骨組みリストから外す）', () => {
    // 外し忘れると ALL_WORKS に重複が残る。登録の同じサイクルで掃除させる pin。
    for (const s of SKELETON_WORKS) {
      expect(WORKS.some((w) => w.id === s.id), `${s.id} は登録済み＝SKELETON_WORKS から外す`).toBe(
        false,
      );
    }
  });
});

describe('ieyasu: 設計の契約（docs/design/ieyasu.md）', () => {
  // 14 = design §4 が挙げる顔ぶれ。15 人目は 2026-07-25 に足した cross-work の橋 p-hidenaga
  // （docs/design/cross-work.md §4）＝設計の顔ぶれではなく「他作品の主人公が脇役で出る」1枚。
  // 作品の上限そのもの（WRITING「人は絞る」の 16人/作品）は tests/style-budget.test.ts が持つ。
  it('人物カードは 15 人以下（design §4 の顔ぶれ 14 ＋ 橋 1）', () => {
    const people = Object.values(ieyasu.cards).filter((c) => c.type === 'person');
    expect(people.length).toBeLessThanOrEqual(15);
  });

  it('家紋は 三つ葉葵（徳川家）', () => {
    // レジストリに実在するかは work-integrity の「mon が MON レジストリで解決する」が全作品で見る。
    expect(ieyasu.mon).toBe('aoi');
  });

  it('★6 タイトルの「見せてから問う」顔が成立する（信長・秀吉 → 家康）', () => {
    expect(ieyasu.titleKnownFaces).toEqual(['p-nobunaga', 'p-hideyoshi']);
    for (const id of [...(ieyasu.titleKnownFaces ?? []), ieyasu.protagonistId]) {
      expect(ieyasu.faces[id], `title face ${id}`).toBeTruthy();
      expect(ieyasu.cards[id]?.name?.trim(), `title card ${id}`).toBeTruthy();
    }
  });

  it('駿府の円環: 章一と終章の 既定地が 同じ 一点（人質として 来て、天下人として 帰り 死ぬ）', () => {
    // research §5 / design §6 の地図文法の核。ここが割れたら円環が消える。
    expect(ieyasu.map.chapterPoints['1']).toBe('sunpu');
    expect(ieyasu.map.chapterPoints['7']).toBe('sunpu');
  });

  it('海外の 地点を 持たない（研究§5＝全地点が国内＝新規 海外海岸線 art は不要）', () => {
    // katsu ch3 の世界地図の脆弱性を持ちこまないことの pin。日本の投影の枠に収まる経度・緯度のみ。
    for (const [id, p] of Object.entries(ieyasu.map.gaz)) {
      expect(p.lon, `${id} は lon/lat で置く（px 直書きの off-map 点を作らない）`).toBeDefined();
      expect(p.lon! > 128 && p.lon! < 146, `${id} lon=${p.lon}`).toBe(true);
      expect(p.lat! > 30 && p.lat! < 46, `${id} lat=${p.lat}`).toBe(true);
    }
  });
});
