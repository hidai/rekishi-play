// 作品をまたいで「同じ人」を名寄せする表。作品集の層（registry.ts と同じ高さ）に1枚だけ置く
// ——作品データ側に相手作品を書くと、作品が他作品を知る依存が組合せで増える。
//
// allowlist にしているのは、id の偶然一致を橋にしないためと、表記揺れを吸収するため
// （`p-hideyoshi` は『秀長』で「羽柴秀吉」、『家康』で「豊臣秀吉」＝改姓それ自体が素材になる）。
// 表に無い同 id が複数作品に現れたら tests/cross-work.test.ts が落とす。
import type { PersonBridge } from '../engine/crosswork.svelte';

export const PERSON_BRIDGES: PersonBridge[] = [
  { pid: 'p-hideyoshi', works: ['hidenaga', 'ieyasu'] },
  { pid: 'p-nobunaga', works: ['hidenaga', 'ieyasu'] },
  { pid: 'p-yoritomo', works: ['kiyomori', 'masako'] },
  // 主人公の相互出演 S2（design §4）。『秀長』の主人公が『家康』では 4-c の宿の主として出る
  // ——並置すると相手の本文が「きみ 自身。大和大納言…」で始まり、S1 のアンカー
  // 「きみが『豊臣秀長』だった なら」がそのまま繋がる。
  { pid: 'p-hidenaga', works: ['hidenaga', 'ieyasu'] },
  // 『栄一』は骨組み段階（未登録）。読者のビルドに無い作品には橋が架からない（engine 側で無視）。
  { pid: 'p-yoshinobu', works: ['katsu', 'shibusawa'] },
];
