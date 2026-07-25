// ★I 選択の"手ざわり"。メーターが伸びた瞬間を HUD 上で可視化する合図。
// afterChoice が pulse(effect) を呼び、MeterB(HUD) が該当キーに「＋N」を一瞬弾ませる。
// バー自体の伸長は CSS の width transition が担う（このモジュールは"＋N"バッジ専用）。
// import 時副作用なし。setTimeout は node でも安全（テストからは未 import）。

interface Pulse {
  id: number;
  key: string;
  delta: number;
}

class MeterFx {
  pulses = $state<Pulse[]>([]);
  private n = 0;

  /** 選択の effect（key→増減）を受け、キーごとに一時的な「＋N」を積む。 */
  pulse(effect: Record<string, number> | undefined): void {
    if (!effect) return;
    for (const [key, delta] of Object.entries(effect)) {
      if (!delta) continue;
      const id = ++this.n;
      this.pulses = [...this.pulses, { id, key, delta }];
      setTimeout(() => {
        this.pulses = this.pulses.filter((p) => p.id !== id);
      }, 1200);
    }
  }

  /** 指定キーに今出ている pulse（複数同時も一応許容）。 */
  forKey(key: string): Pulse[] {
    return this.pulses.filter((p) => p.key === key);
  }
}

export const meterFx = new MeterFx();
