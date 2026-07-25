// 史実オーバーレイ（旧 showHist）。選択後に「史実では…」パネルを出し、
// 「次へ」で解決する Promise API（旧 onContinue コールバックの置換）。
import type { Hist } from './types';

interface ActiveHist {
  hist: Hist;
  gains: string[]; // 表示する reward-chip の HTML 片
  resolve: () => void;
}

export class HistService {
  current = $state<ActiveHist | null>(null);

  show(hist: Hist, gains: string[]): Promise<void> {
    return new Promise((resolve) => {
      this.current = { hist, gains, resolve };
    });
  }

  settle(): void {
    const c = this.current;
    this.current = null;
    c?.resolve();
  }
}
