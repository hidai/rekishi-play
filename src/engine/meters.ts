// ★1「きみの◯◯」メーターの純粋ヘルパー（localStorage 非依存・テスト可能）。
// 表示や締めの文言を、プロフィールの累積値から算出する。
import type { Work, MeterDef } from './types';
import type { WorkSave } from './save.svelte';

/** 累積値を取り出す。旧セーブは meters 未定義なので空オブジェクトへ。 */
export function metersOf(p: WorkSave | null | undefined): Record<string, number> {
  return p?.meters ?? {};
}

/** メーター def と現在値のペア（表示順）。 */
export function meterRows(
  work: Work,
  p: WorkSave | null | undefined,
): { def: MeterDef; value: number }[] {
  const vals = metersOf(p);
  return (work.meters?.defs ?? []).map((def) => ({ def, value: vals[def.key] ?? 0 }));
}

/** いずれかのメーターが動いているか（HUD 表示の判定用）。 */
export function metersActive(work: Work, p: WorkSave | null | undefined): boolean {
  return meterRows(work, p).some((r) => r.value > 0);
}

/** 最も高いメーター。全て 0、または最大値が引き分けなら null（→ balanced）。 */
export function topMeter(work: Work, p: WorkSave | null | undefined): MeterDef | null {
  const rows = meterRows(work, p);
  const max = rows.reduce((m, r) => Math.max(m, r.value), 0);
  if (max <= 0) return null;
  const leaders = rows.filter((r) => r.value === max);
  return leaders.length === 1 ? leaders[0].def : null;
}

/** 終章の締めの1文（選択履歴で変わる）。meters 未設定の作品では空文字。 */
export function meterSummary(work: Work, p: WorkSave | null | undefined): string {
  if (!work.meters) return '';
  const top = topMeter(work, p);
  return top ? top.summary : work.meters.balanced;
}

/**
 * ★C 各章クリアの"中間寸評"の1文（選択の積み上がりを途中で実感させる）。
 * 最も高いメーターの progress、引き分け/未加算なら progressBalanced。
 * どれも未設定なら空文字（呼び出し側は非表示にできる）。
 */
export function meterProgress(work: Work, p: WorkSave | null | undefined): string {
  if (!work.meters) return '';
  const top = topMeter(work, p);
  return (top ? top.progress : work.meters.progressBalanced) ?? '';
}
