// 渋沢栄一（第7作・近代経済の主人公1号）の骨組み。
// 構造整合（遷移・参照・地図・章数・相関図・顔識別等）と体験予算は、tests/helpers/all-works.ts の
// ALL_WORKS 経由で work-integrity / style-budget / face-distinct が **未登録の骨組みにも** 回している。
// ここに残すのは、セーブの枠の分離（Account.works[id]）と shibusawa 固有の設計契約だけ。
import { describe, it, expect } from 'vitest';
import { shibusawa } from '../src/works/shibusawa/index';
import { WORKS } from '../src/works/index';
import { katsu } from '../src/works/katsu/index';
import { MON } from '../src/engine/art/icons';

describe('shibusawa: セーブの枠の分離（Account.works[id]）', () => {
  it('新規 id で、既存 6作の 枠に 触れない', () => {
    for (const w of WORKS) {
      expect(shibusawa.faceHintKey, `vs ${w.id}`).not.toBe(w.faceHintKey);
      expect(shibusawa.id, `vs ${w.id}`).not.toBe(w.id);
    }
  });
});

describe('shibusawa: 骨組み段階（家族のビルドに 準備中の章を 出さない）', () => {
  it('WORKS には まだ 入っていない（全7章 content-complete で 反転する）', () => {
    expect(WORKS.some((w) => w.id === 'shibusawa')).toBe(false);
  });
});

describe('shibusawa: 設計の契約（docs/design/shibusawa.md）', () => {
  it('人物カードは 16人以下（design §5: 余裕を 残し 私生活側で 枠を 使わない）', () => {
    // masako（16人ちょうど）と違い、渋沢は上限に余裕を残す設計（§5）。私生活の女性・多数の庶子は
    // 役割語/非登場（§0-3温度）。執筆中に人を増やしたくなったら誰かを役割語に落とす。
    const people = Object.values(shibusawa.cards).filter((c) => c.type === 'person');
    expect(people.length).toBeLessThanOrEqual(16);
    expect(people.length).toBeGreaterThanOrEqual(10);
  });

  it('主人公は 3 variant——若き志士（月代）/ 壮年（ざんぎり洋装）/ 晩年（白髭和装＝一万円札）', () => {
    // research §4B / design §4①: 近代の顔語彙は勝海舟で導入済み＝engine 拡張ゼロ。
    expect(shibusawa.faces['p-eiichi@young'].head).toBe('chonmage');
    expect(shibusawa.faces['p-eiichi@prime'].head).toBe('sangiri');
    expect(shibusawa.faces['p-eiichi@prime'].garb).toBe('western');
    // 晩年（base）= 一万円札の顔: 白髭（mustache）・白髪・和装（garb 省略）。
    expect(shibusawa.faces['p-eiichi'].beard).toBe('mustache');
    expect(shibusawa.faces['p-eiichi'].garb).toBeUndefined();
    const byCh = shibusawa.protagonistFacesByChapter!;
    expect([byCh[1], byCh[2]]).toEqual(['p-eiichi@young', 'p-eiichi@young']);
    for (const ch of [3, 4, 5]) expect(byCh[ch], `ch${ch}`).toBe('p-eiichi@prime');
    for (const ch of [6, 7]) expect(byCh[ch], `ch${ch}`).toBe('p-eiichi');
  });

  it('慶喜の顔は katsu と同一（同じ人は 作品をまたいで 同じ顔）', () => {
    // tests/face-distinct.test.ts の cross-work 契約を、当事者の側でも 明示しておく（tone を除く）。
    const { tone: _a, ...here } = shibusawa.faces['p-yoshinobu'];
    const { tone: _b, ...there } = katsu.faces['p-yoshinobu'];
    expect(here).toEqual(there);
  });

  it('家紋でなく 主題エンブレム soroban（算盤）が MON レジストリで解決する', () => {
    // 渋沢家の紋は 要出典確認＝不確実な紋を topbar に焼くのは 藍リングの罠。davinci `vinci` の
    // 非武家＝主題エンブレム先例に倣う。monSvg() は未知キーを黙って omodaka に落とすので、解決を pin。
    expect(shibusawa.mon).toBe('soroban');
    expect(MON[shibusawa.mon], 'soroban が MON に無い＝omodaka にフォールバックする').toBeTruthy();
  });

  it('近代は 面で 塗らない: territory も 進軍地図の層も 持たない', () => {
    // design §0-4 / §3-4: 力は 藩の 面でなく 会社・人・港の点に 宿る。territory を塗らず、
    // 会社の点は 章四執筆時に MapPoint（revealCh）で足す。骨組みでは空。
    expect(shibusawa.map.territory).toEqual({});
    expect(shibusawa.map.campaignRoutes).toEqual([]);
    expect(shibusawa.map.mapPoints).toEqual([]);
  });

  it('章の既定地が 円環を持つ: 血洗島 → 世界 → 東京へ 戻る', () => {
    // 一人の百姓が パリまで 出て 日本へ 戻る（design §2 円環）。ch3 の fallback は 出発港・横浜
    // （base stage が Japan geo ゆえ Paris は scene map 側。WRITING 地図書法6 = 係争地を置かない）。
    expect(shibusawa.map.chapterPoints['1']).toBe('chiharajima');
    expect(shibusawa.map.chapterPoints['3']).toBe('yokohama');
    expect(shibusawa.map.chapterPoints['7']).toBe('tokyo');
  });

  it('★6 タイトルの 顔ならべは 旧主・慶喜と 好敵手・岩崎（栄一 自身の 顔は 知られていない）', () => {
    expect(shibusawa.titleKnownFaces).toEqual(['p-yoshinobu', 'p-yataro']);
    for (const pid of shibusawa.titleKnownFaces!) {
      expect(shibusawa.faces[pid], `${pid} の顔`).toBeTruthy();
      expect(shibusawa.cards[pid]?.name?.trim(), `${pid} のカード`).toBeTruthy();
    }
    // 主人公も カードを持つ（card-reachability の 恒久ゲートに 乗る前提）。
    expect(shibusawa.cards[shibusawa.protagonistId]?.name).toBe('渋沢栄一');
  });
});
