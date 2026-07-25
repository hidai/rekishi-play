// レオナルド・ダ・ヴィンチ（第5作・初の外国人作品）の骨組み。
// 構造整合（遷移・参照・地図・章数・相関図・顔識別等）と体験予算は、tests/helpers/all-works.ts の
// ALL_WORKS 経由で work-integrity / style-budget / face-distinct が **未登録の骨組みにも** 回している。
// ここに残すのは、セーブの枠の分離（Account.works[id]）と davinci 固有の設計契約だけ。
import { describe, it, expect } from 'vitest';
import { davinci } from '../src/works/davinci/index';
import { WORKS } from '../src/works/index';
import { SKELETON_WORKS } from './helpers/all-works';
import { hidenaga } from '../src/works/hidenaga/index';
import { kiyomori } from '../src/works/kiyomori/index';
import { katsu } from '../src/works/katsu/index';
import { ieyasu } from '../src/works/ieyasu/index';
import { MON } from '../src/engine/art/icons';
import { GEO_EUROPE } from '../src/shared/geoWorld';

describe('davinci: セーブの枠の分離（Account.works[id]）', () => {
  it('新規 id で、既存 4作の 枠に 触れない', () => {
    for (const w of [hidenaga, kiyomori, katsu, ieyasu]) {
      expect(davinci.faceHintKey, `vs ${w.id}`).not.toBe(w.faceHintKey);
      expect(davinci.id, `vs ${w.id}`).not.toBe(w.id);
    }
  });
});

describe('davinci: 出荷（全7章 content-complete で登録）', () => {
  it('WORKS に davinci が入っている（章がぜんぶ書けたので出荷）', () => {
    // 骨組み期は「未登録」を pin していた（家族のビルドに準備中の章を出さないため）。
    // ch4「最後の晩餐」の完成＝全7章 content-complete で反転した。
    expect(WORKS.some((w) => w.id === 'davinci')).toBe(true);
  });

  it('準備中の骨組みシーンが 1つも残っていない（stub のまま出荷しない）', () => {
    for (const ch of davinci.story.chapters) {
      for (const [sid, sc] of Object.entries(ch.scenes)) {
        expect(sc.text.includes('（骨組み）'), `${sid} が骨組みのまま`).toBe(false);
      }
    }
  });
  it('SKELETON_WORKS は WORKS と交わらない（登録したら骨組みリストから外す）', () => {
    for (const s of SKELETON_WORKS) {
      expect(WORKS.some((w) => w.id === s.id), `${s.id} は登録済み＝SKELETON_WORKS から外す`).toBe(
        false,
      );
    }
  });
});

describe('davinci: 設計の契約（docs/design/davinci.md）', () => {
  it('人物カードは 10 人（design §4 の 9 人＋ch6 パイロットの リザ＝WRITING「人は絞る」16 人以下）', () => {
    // The ch6 pilot adds リザ (モナ・リザのモデル) as the 観察 closeup subject (research §3-4).
    const people = Object.values(davinci.cards).filter((c) => c.type === 'person');
    expect(people.length).toBe(10);
    expect(people.length).toBeLessThanOrEqual(16);
  });

  it('ch6 パイロットが 装置一式を通す（観察ビュー→つながり図鑑→発明カード）', () => {
    // design §7「一枚で見る 第六章」/ WRITING 10 パイロットシーン制: the register-fixing chapter.
    const ch6 = davinci.story.chapters.find((c) => c.id === 6)!;
    const observe = ch6.scenes['6-b']?.observe;
    expect(observe?.hotspots.some((h) => h.essential), '6-b に essential な観察 hotspot').toBe(true);
    // Every hotspot nodeId resolves to a graph star, and the sfumato invention grants a card.
    const nodeIds = new Set(davinci.graph?.nodes.map((n) => n.id));
    for (const h of observe?.hotspots ?? []) {
      if (h.nodeId) expect(nodeIds.has(h.nodeId), `hotspot ${h.id} の nodeId`).toBe(true);
    }
    const invention = davinci.graph?.nodes.find((n) => n.bornOf?.length);
    expect(invention?.card && davinci.cards[invention.card], '発明カードが解決').toBeTruthy();
  });

  it('★6 タイトルは「顔ならべ」を出さない（外国人＝主人公の顔以外は初見・grammar 反転）', () => {
    // design §3-4: レオナルドの known face は本人（自画像）ゆえ titleKnownFaces は空。
    expect(davinci.titleKnownFaces).toEqual([]);
    expect(davinci.faces[davinci.protagonistId], 'protagonist face').toBeTruthy();
    expect(davinci.cards[davinci.protagonistId]?.name?.trim(), 'protagonist card').toBeTruthy();
  });

  it('家紋 vinci が MON レジストリで解決する（一族紋なし＝個人エンブレム）', () => {
    // Leonardo had no family crest; vinci = the Vitruvian squared-circle. monSvg() は未知キーを
    // 黙って omodaka（秀長の紋）に落とすので、解決を pin する（ieyasu 骨組みの aoi 前例）。
    expect(davinci.mon).toBe('vinci');
    expect(MON[davinci.mon], 'vinci が MON に無い＝omodaka にフォールバックする').toBeTruthy();
  });

  it('初の海外ステージ: home geo が GEO_EUROPE（日本 GEO でない）', () => {
    // 秀長〜家康は Japan GEO。davinci は宮廷から宮廷への旅ゆえイタリア＋仏南部を焼いた欧州ステージ。
    expect(davinci.map.geo).toBe(GEO_EUROPE);
  });

  it('全 gaz が GEO_EUROPE の bbox 内（欧州の実 lon/lat・off-map px 点を作らない）', () => {
    // katsu ch3 の世界地図の脆弱性を持ちこまない pin（ieyasu の「海外の地点を持たない」の裏返し）。
    expect(GEO_EUROPE.bounds, 'GEO_EUROPE.bounds が無い').toBeDefined();
    const [lonmin, latmin, lonmax, latmax] = GEO_EUROPE.bounds!;
    for (const [id, p] of Object.entries(davinci.map.gaz)) {
      expect(p.lon, `${id} は lon/lat で置く（px 直書きの点を作らない）`).toBeDefined();
      expect(p.lon! >= lonmin && p.lon! <= lonmax, `${id} lon=${p.lon} が bbox 外`).toBe(true);
      expect(p.lat! >= latmin && p.lat! <= latmax, `${id} lat=${p.lat} が bbox 外`).toBe(true);
    }
  });

  it('章の既定地が すべて欧州の都市点（旅の一方通行・帰る円環を持たない）', () => {
    // ieyasu の駿府円環（ch1=ch7）とは対照的に、davinci は ch1≠ch7（ヴィンチ村→アンボワーズ）。
    expect(davinci.map.chapterPoints['1']).toBe('vinci');
    expect(davinci.map.chapterPoints['7']).toBe('amboise');
    expect(davinci.map.chapterPoints['1']).not.toBe(davinci.map.chapterPoints['7']);
  });
});
