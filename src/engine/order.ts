// 選択肢の表示順シャッフル（純粋ロジック・DOM 非依存＝テスト可能）。
// 作品データの choices は「史実の選択肢が同じ位置に並びがち」なパターンを持ちやすく、
// 子どもは数章でそれを見抜いて考えるのをやめる。表示順だけをシーン入場ごとに
// シャッフルし、選ぶ瞬間の緊張感を保つ。データ・セーブには一切影響しない
// （chooseNext へは常に元 index を渡す）。
/** 0..n-1 の表示順を Fisher–Yates で並べ替えて返す。rnd は 0..1 を返す関数（テストで差し込み可）。 */
export function choiceOrder(n: number, rnd: () => number = Math.random): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
