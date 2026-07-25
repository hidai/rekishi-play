// 検査の対象となる「作品」の全集合＝登録済み WORKS ＋ 未登録の骨組み作品。
// 一覧の実体と、なぜ WORKS だけでは足りないかの理由は scripts/lib/works.ts にある
// （開発用レンダラとゲートが同じ集合を見るための単一の真実）。ここはテストからの入口。
export { ALL_WORKS, SKELETON_WORKS } from '../../scripts/lib/works';
