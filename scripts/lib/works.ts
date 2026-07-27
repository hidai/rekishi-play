// The set of works that dev tools and content gates operate on: registered WORKS ＋ 未登録の
// 骨組み作品。
//
// なぜ WORKS だけでは足りないか: 骨組み段階の作品は「家族のビルドに準備中の章を出さない」ため
// src/works/index.ts には登録しない（kiyomori・katsu・ieyasu 骨組み-1 の先例）。だが WORKS だけを
// 回すゲート・ツールは、その未登録の期間をまるごと素通りする——**執筆はまさにその期間に進む**。
// とくに体験予算（tests/style-budget.test.ts）は「本文が説明に堕ちる」ドリフトを執筆の最中に
// 捕まえるための機械ゲートで（清盛はその執筆中に教科書化した＝docs/WRITING.md「成立の経緯」）、
// 登録を待ってから効かせるのでは遅い。レンダラも同じ——顔・シーン地図は登録前に書く。
//
// この一覧が **唯一の真実**。以前は render-faces / render-scene / render-campaign /
// render-relations / content-stats / visual-coverage / tests がそれぞれ作品を import して自前の
// Record を持っており、作品を足すたびに7箇所を手で直す必要があった（ieyasu 骨組み-1 では
// render-faces だけが直され、残りは ieyasu を見られないままだった）。
//
// とくに content-stats（体験予算の実測）と visual-coverage（主ビジュアル在庫）が WORKS しか
// 見なかったせいで、「登録を先に済ませないと執筆中の作品を測れない」という順序の制約が
// BACKLOG に発生していた。両者をここへ繋いだので、その制約は解けている。
//
// 骨組み作品を登録したら SKELETON_WORKS から外すこと。外し忘れは
// tests/ieyasu-skeleton.test.ts の「SKELETON_WORKS は WORKS と交わらない」が落とす。
import { WORKS } from '../../src/works/index';
import type { Work } from '../../src/engine/types';

/** 未登録（骨組み段階）の作品。登録したらここから外す。いまは空＝全7作が出荷済み。 */
export const SKELETON_WORKS: Work[] = [];

/** 登録済み＋骨組み。作品データの検査・開発用レンダラはこちらを回す。 */
export const ALL_WORKS: Work[] = [...WORKS, ...SKELETON_WORKS];

/** slug → Work（骨組みを含む）。未知の slug は「持っている slug」を挙げて落とす。 */
export function resolveWork(slug: string): Work {
  const work = ALL_WORKS.find((w) => w.id === slug);
  if (!work)
    throw new Error(`unknown work slug: ${slug} (have: ${ALL_WORKS.map((w) => w.id).join(', ')})`);
  return work;
}
