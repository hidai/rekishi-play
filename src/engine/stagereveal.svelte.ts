// ★G 人生ステージの見せ場の"表示合図"。SceneScreen が stageMoment を検出したら show()、
// StageReveal.svelte が大きな顔＋見出し＋ひとことを1枚出す。import 時副作用なし。
import type { StageMoment } from './stage';

class StageRevealService {
  current = $state<StageMoment | null>(null);

  show(m: StageMoment): void {
    this.current = m;
  }
  dismiss(): void {
    this.current = null;
  }
}

export const stageReveal = new StageRevealService();
