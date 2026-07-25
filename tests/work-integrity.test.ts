// 作品データの内部整合性。逐語移植・手書きのデータが「壊れていない」ことを DOM なしで保証する。
// 全 WORKS 共通の構造整合は tests/helpers/work-structure.ts に汎用化し、ここから全作品に回す
// （作品を1つ足すと構造検証が自動で付いてくる）。この面には
//   (1) WORKS レジストリ横断の不変条件（id・各種キーの一意）
//   (2) hidenaga 固有の richness（章ごとの monologue/spark/creed）と名指しシーンの assertion
// だけを残す。
import { describe, it, expect } from 'vitest';
import { WORKS } from '../src/works/index';
import { ALL_WORKS } from './helpers/all-works';
import { hidenaga } from '../src/works/hidenaga/index';
import { MON } from '../src/engine/art/icons';
import { registerWorkStructure, danglingSceneMapKeys } from './helpers/work-structure';
import type { Work } from '../src/engine/types';

// キーの一意性は ALL_WORKS（登録済み＋骨組み）で見る: 未登録の作品が既存の id を
// 名乗っていたら、登録した瞬間に その作品を遊んでいる子のセーブの枠（Account.works[id]）を
// 別作品が上書きする。骨組みのうちに落とす。
describe('WORKS レジストリ', () => {
  it('少なくとも 1 作品を含む', () => {
    expect(WORKS.length).toBeGreaterThanOrEqual(1);
  });
  it('id が一意（骨組み作品を含む）', () => {
    const ids = ALL_WORKS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it('faceHintKey / flagPrefix も作品間で衝突しない（骨組み作品を含む）', () => {
    const hintKeys = ALL_WORKS.map((w) => w.faceHintKey);
    expect(new Set(hintKeys).size).toBe(hintKeys.length);
    // flagPrefix defaults to id when omitted; id is already unique.
    const prefixes = ALL_WORKS.map((w) => w.flagPrefix ?? w.id);
    expect(new Set(prefixes).size).toBe(prefixes.length);
  });
  it('kiyomori が登録済み（第2作）', () => {
    expect(WORKS.some((w) => w.id === 'kiyomori')).toBe(true);
  });
  it('katsu が登録済み（第3作）', () => {
    expect(WORKS.some((w) => w.id === 'katsu')).toBe(true);
  });
  it('ieyasu が登録済み（第4作）', () => {
    expect(WORKS.some((w) => w.id === 'ieyasu')).toBe(true);
  });
  it('各作品の mon が MON レジストリで解決する（骨組み作品を含む）', () => {
    // monSvg() は未知のキーを黙って monOmodaka（秀長の紋）に落とす。型もテストも見ていないので、
    // 家紋の実装漏れ・キーの打ち間違いは「他作品の紋が出ている画面」としてしか現れない
    // （ieyasu 骨組み-1 の mon:'aoi' は実際にこの状態で1サイクル過ごした）。
    for (const w of ALL_WORKS) {
      expect(MON[w.mon], `${w.id}: mon='${w.mon}' が MON に無い＝omodaka にフォールバックする`)
        .toBeTruthy();
      if (w.finalMon)
        expect(MON[w.finalMon], `${w.id}: finalMon='${w.finalMon}' が MON に無い`).toBeTruthy();
    }
  });
});

// 全作品の構造整合を汎用ヘルパーで回す（遷移・参照・地図・章数・相関図・reveal・hist.source 等）。
// 骨組み（未登録）の作品も対象＝dangling 参照・袋小路は書いた その サイクルで落とす。
for (const w of ALL_WORKS) {
  describe(`構造整合: ${w.id}`, () => registerWorkStructure(w));
}

// 出荷データが踏まないブランチは、合成 fixture で踏ませて初めてゲートになる（2026-07-15 の学び）。
// 実データは全キーが実在シーンなので、上のループだけでは「キーを打ち間違えた地図」の検知を
// 一度も実行しない。
describe('構造整合ゲート自身の検査（合成 fixture）', () => {
  it('SCENE_MAPS のキーを打ち間違えた作品を検出する', () => {
    const base = ALL_WORKS[0];
    const real = Object.keys(base.story.chapters[0].scenes)[0];
    const typo = {
      ...base,
      map: {
        ...base.map,
        sceneMaps: { [real]: { markers: [] }, '1-typo': { markers: [] } },
      },
    } as unknown as Work;
    expect(danglingSceneMapKeys(typo)).toEqual(['1-typo']);
    expect(danglingSceneMapKeys(base)).toEqual([]);
  });
});

describe('hidenaga: ★6 タイトルの「見せてから問う」顔', () => {
  it('信長・秀吉・主人公の顔スペックがある（顔の列が成立する）', () => {
    for (const id of ['p-nobunaga', 'p-hideyoshi', hidenaga.protagonistId]) {
      expect(hidenaga.faces[id], `title face ${id}`).toBeTruthy();
    }
  });
  it('主人公カードに名前があり、タップ時の文言が出せる', () => {
    expect(hidenaga.cards[hidenaga.protagonistId]?.name?.trim()).toBeTruthy();
  });
});

describe('hidenaga: ★3 秀長の内心のひとこと（monologue）', () => {
  it('全章に 秀長の内語（monologue）が 1 つ以上ある', () => {
    for (const ch of hidenaga.story.chapters) {
      const monos = Object.values(ch.scenes).filter((s) => !!s.monologue?.trim());
      expect(monos.length, `ch${ch.id} に monologue がない`).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('hidenaga: ★4 露出（spark）', () => {
  it('全章に「えっ！？」露出（spark）が 1 つ以上ある', () => {
    for (const ch of hidenaga.story.chapters) {
      const sparks = Object.values(ch.scenes).filter((s) => !!s.spark?.trim());
      expect(sparks.length, `ch${ch.id} に spark がない`).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('hidenaga: ★K 秀長の信条（creed）＝正の定義', () => {
  it('全章に 秀長の信条（creed）が 1 つ以上ある', () => {
    for (const ch of hidenaga.story.chapters) {
      const creeds = Object.values(ch.scenes).filter((s) => !!s.creed?.line?.trim());
      expect(creeds.length, `ch${ch.id} に creed がない`).toBeGreaterThanOrEqual(1);
    }
  });
  it('各 creed は line（決め台詞）と act（象徴アクション）を持つ', () => {
    for (const ch of hidenaga.story.chapters) {
      for (const sc of Object.values(ch.scenes)) {
        if (!sc.creed) continue;
        expect(sc.creed.line?.trim(), `ch${ch.id} creed.line`).toBeTruthy();
        expect(sc.creed.act?.trim(), `ch${ch.id} creed.act`).toBeTruthy();
      }
    }
  });
});

describe('hidenaga: 名指しシーンの演出', () => {
  it('本能寺（4-a）に crisis の reveal がある', () => {
    const sc = hidenaga.story.chapters.find((c) => c.id === 4)!.scenes['4-a'];
    expect(sc.reveal?.tone).toBe('crisis');
  });

  it('終章の答え合わせ（7-c）で手がかりをその場表示する', () => {
    const sc = hidenaga.story.chapters.find((c) => c.id === 7)!.scenes['7-c'];
    expect(sc.showClues).toBe(true);
  });

  // Playtest note "land under attack is not territory yet": invasion scenes override
  // the fill to the contested color. The ch5 progression (5-a/5-b/5-d) is covered by
  // the engine test; this pins that 6-b (a 1586 episode — Shimazu on the offensive)
  // keeps all seven Kyushu prefs contested.
  it('大友宗麟の訪問（6-b）：九州 7 県が「攻略中」扱い', () => {
    expect(hidenaga.map.sceneMaps['6-b'].contested).toEqual([40, 41, 42, 43, 44, 45, 46]);
  });

  it('兄弟の別れ（7-a2）：兄の台詞と悲しみの顔オーバーライドがある', () => {
    const sc = hidenaga.story.chapters.find((c) => c.id === 7)!.scenes['7-a2'];
    expect(sc, '7-a2 が存在する').toBeTruthy();
    expect(sc.text).toContain('class="speak"');
    expect(sc.choices?.length).toBeGreaterThanOrEqual(2);
    expect(hidenaga.sceneFaceOverrides?.['7-a2']?.['p-hideyoshi']).toBe('p-hideyoshi@grief');
  });
});

describe('hidenaga: march ミニゲーム（4-b 中国大返し）の整合', () => {
  const mg = hidenaga.story.chapters.find((c) => c.id === 4)!.scenes['4-b'].minigame;

  it('4-b は march 型で、勝敗・準備・ペースの整合が取れている', () => {
    expect(mg?.type).toBe('march');
    if (mg?.type !== 'march') throw new Error('expected march');
    // 準備・ペースの id 重複なし
    const prepIds = mg.preps.map((p) => p.id);
    expect(new Set(prepIds).size).toBe(prepIds.length);
    const paceIds = mg.paces.map((p) => p.id);
    expect(new Set(paceIds).size).toBe(paceIds.length);
    // 選べる枚数は手札以下
    expect(mg.prepPicks).toBeGreaterThanOrEqual(1);
    expect(mg.prepPicks).toBeLessThanOrEqual(mg.preps.length);
    // 拠点はゴール手前、休息（回復）ペースが1つ以上ある
    for (const p of mg.preps) {
      if (p.fx.depotAt != null) expect(p.fx.depotAt).toBeLessThan(mg.goalKm);
    }
    expect(mg.paces.some((p) => p.fatigue < 0)).toBe(true);
    // outro に史学的誠実さの一文（deep への橋）が残っている
    expect(mg.outro).toContain('もっと深く');
    expect(hidenaga.story.chapters.find((c) => c.id === 4)!.scenes['4-b'].deep).toBeTruthy();
  });
});
