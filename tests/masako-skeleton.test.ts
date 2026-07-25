// 北条政子（第6作・女性主人公1号）の骨組み。
// 構造整合（遷移・参照・地図・章数・相関図・顔識別等）と体験予算は、tests/helpers/all-works.ts の
// ALL_WORKS 経由で work-integrity / style-budget / face-distinct が **未登録の骨組みにも** 回している。
// ここに残すのは、セーブの枠の分離（Account.works[id]）と masako 固有の設計契約だけ。
import { describe, it, expect } from 'vitest';
import { masako } from '../src/works/masako/index';
import { WORKS } from '../src/works/index';
import { SKELETON_WORKS } from './helpers/all-works';
import { hidenaga } from '../src/works/hidenaga/index';
import { kiyomori } from '../src/works/kiyomori/index';
import { MON } from '../src/engine/art/icons';
import { GEO } from '../src/shared/geoJapan';

describe('masako: セーブの枠の分離（Account.works[id]）', () => {
  it('新規 id で、既存 5作の 枠に 触れない', () => {
    for (const w of WORKS) {
      if (w.id === masako.id) continue; // masako is now registered in WORKS; don't compare to self
      expect(masako.faceHintKey, `vs ${w.id}`).not.toBe(w.faceHintKey);
      expect(masako.id, `vs ${w.id}`).not.toBe(w.id);
    }
  });
});

describe('masako: 出荷（全7章 content-complete・30/30 で登録）', () => {
  it('WORKS に 入っている（30/30 で 反転済み）', () => {
    expect(WORKS.some((w) => w.id === 'masako')).toBe(true);
  });
  it('SKELETON_WORKS は WORKS と交わらない（登録したら骨組みリストから外す）', () => {
    // 外し忘れると ALL_WORKS に重複が残る。登録の同じサイクルで掃除させる pin。
    for (const s of SKELETON_WORKS) {
      expect(WORKS.some((w) => w.id === s.id), `${s.id} は登録済み＝SKELETON_WORKS から外す`).toBe(
        false,
      );
    }
  });
});

describe('masako: 設計の契約（docs/design/masako.md）', () => {
  it('人物カードは 16人ちょうど（WRITING「人は絞る」の 上限）', () => {
    // design §5: 牧の方・一幡・平賀朝雅・一条実雅は 役割語で 流す。執筆中に 人を 増やしたく
    // なったら、誰かを 役割語に 落とす（上限は 増やさない）。
    const people = Object.values(masako.cards).filter((c) => c.type === 'person');
    expect(people.length).toBe(16);
  });

  it('主人公は 2 variant——御台所（垂髪）と 尼形（出家後）', () => {
    // research §4B: 政子の像は いずれも 尼形の 坐像。ch1-2 だけが 御台所で、ch3 以降は 尼。
    expect(masako.faces['p-masako'].head).toBe('ama');
    expect(masako.faces['p-masako'].garb).toBe('houe');
    expect(masako.faces['p-masako@wife'].head).toBe('suberakashi');
    const byCh = masako.protagonistFacesByChapter!;
    expect([byCh[1], byCh[2]]).toEqual(['p-masako@wife', 'p-masako@wife']);
    for (const ch of [3, 4, 5, 6, 7]) expect(byCh[ch], `ch${ch}`).toBe('p-masako');
  });

  it('頼朝の顔は kiyomori と同一（同じ人は 作品をまたいで 同じ顔）', () => {
    // tests/face-distinct.test.ts の cross-work 契約を、当事者の側でも 明示しておく。
    const { tone: _a, ...here } = masako.faces['p-yoritomo'];
    const { tone: _b, ...there } = kiyomori.faces['p-yoritomo'];
    expect(here).toEqual(there);
  });

  it('家紋 mitsuuroko が MON レジストリで解決する（三つ鱗＝北条）', () => {
    // monSvg() は未知キーを黙って omodaka（秀長の紋）に落とす（ieyasu 骨組みの aoi 前例）。
    expect(masako.mon).toBe('mitsuuroko');
    expect(MON[masako.mon], 'mitsuuroko が MON に無い＝omodaka にフォールバックする').toBeTruthy();
  });

  it('地図は主装置でない: 進軍地図の層を 持たない（手帳の進軍タブを 出さない）', () => {
    // design §0-4 / research §5: 鎌倉の主要地点は互いに 1〜2km ＝ 最小フレームに 2桁足りない。
    // 力は 土地でなく 縁と家に 宿る＝主装置は 人の図。
    expect(masako.map.mapPoints).toEqual([]);
    expect(masako.map.territory).toEqual({});
    expect(masako.map.campaignRoutes).toEqual([]);
    expect(masako.map.geo).toBe(GEO);
  });

  it('章の既定地が 円環を持つ（鎌倉に 戻る）のに、始まりは 伊豆', () => {
    // 流人の 地から 武家の 都へ。ch1 だけが 伊豆で、以後は 鎌倉（ch5 の 上洛だけ 京）。
    expect(masako.map.chapterPoints['1']).toBe('izu');
    expect(masako.map.chapterPoints['5']).toBe('kyoto');
    expect(masako.map.chapterPoints['7']).toBe('kamakura');
  });

  it('★6 タイトルの 顔ならべは 夫と 敵（この人 自身の 顔は 誰も 知らない）', () => {
    expect(masako.titleKnownFaces).toEqual(['p-yoritomo', 'p-gotoba']);
    for (const pid of masako.titleKnownFaces!) {
      expect(masako.faces[pid], `${pid} の顔`).toBeTruthy();
      expect(masako.cards[pid]?.name?.trim(), `${pid} のカード`).toBeTruthy();
    }
    // 秀長と違い 主人公も カードを持つ（card-reachability の 恒久ゲートに 乗る前提）。
    expect(masako.cards[masako.protagonistId]?.name).toBe('北条政子');
    expect(hidenaga.id).toBe('hidenaga'); // 較正元の 存在を pin（import の 意図を 明示）
  });
});
