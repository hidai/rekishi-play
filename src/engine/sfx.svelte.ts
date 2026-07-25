// ★H 効果音（Web Audio でその場合成／音源アセット無し＝単一HTML制約に無害）。
// 子ども向け没入の最大レバー。決定・獲得・史実スタンプ・章クリア等に短い音を当てる。
// 方針: 温かい琴/マリンバ風の減衰音。全体は控えめ音量（家庭のタブレット/夜間配慮）。
// ⚠️ import 時に副作用なし。AudioContext は最初の呼び出し（＝ユーザー操作起点）で遅延生成。
// node/SSR/テストでは window/AudioContext が無いので、すべて typeof ガードで no-op。

type Note = {
  f: number; // 周波数(Hz)
  t?: number; // 開始オフセット(秒)
  d?: number; // 長さ(秒)
  type?: OscillatorType;
  g?: number; // ピーク音量(0-1, master 前)
  slideTo?: number; // 終端へ向けて周波数をスライド
};

const MUTE_KEY = 'rekishi_play_sfx_muted';

class Sfx {
  muted = $state(false);
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;

  constructor() {
    try {
      if (typeof localStorage !== 'undefined') this.muted = localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      /* noop */
    }
  }

  toggleMute(): void {
    this.muted = !this.muted;
    try {
      if (typeof localStorage !== 'undefined') localStorage.setItem(MUTE_KEY, this.muted ? '1' : '0');
    } catch {
      /* noop */
    }
  }

  /** 最初のユーザー操作で AudioContext を温める（自動再生ポリシー対策）。 */
  unlock(): void {
    this.ensure();
    this.ctx?.resume?.().catch(() => {});
  }

  private ensure(): boolean {
    if (this.ctx) return true;
    if (typeof window === 'undefined') return false;
    const AC = (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
    if (!AC) return false;
    try {
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5; // 全体を控えめに
      this.master.connect(this.ctx.destination);
      return true;
    } catch {
      return false;
    }
  }

  private play(notes: Note[]): void {
    if (this.muted) return;
    if (!this.ensure() || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    const now = ctx.currentTime + 0.001;
    for (const n of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = n.type ?? 'triangle';
      const start = now + (n.t ?? 0);
      const dur = n.d ?? 0.18;
      osc.frequency.setValueAtTime(n.f, start);
      if (n.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, n.slideTo), start + dur);
      const peak = n.g ?? 0.3;
      // 速いアタック＋指数減衰＝琴のはじきに近い自然な音。
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain).connect(this.master);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    }
  }

  // --- 意味づけされた効果音 ---

  /** 選択を決めた瞬間（上行の2音）。 */
  choice(): void {
    this.play([
      { f: 587, d: 0.12, g: 0.28 },
      { f: 784, t: 0.07, d: 0.16, g: 0.26 },
    ]);
  }

  /** 「つづき→」等のページ送り（ごく控えめ）。 */
  page(): void {
    this.play([{ f: 660, d: 0.09, g: 0.14, type: 'sine' }]);
  }

  /** カード獲得（琴のアルペジオ・ごほうび）。 */
  card(): void {
    this.play([
      { f: 523, d: 0.16, g: 0.24 },
      { f: 659, t: 0.06, d: 0.16, g: 0.24 },
      { f: 784, t: 0.12, d: 0.18, g: 0.24 },
      { f: 1047, t: 0.18, d: 0.28, g: 0.22 },
    ]);
  }

  /** 手がかり発見（なぞ解きのきらめき）。 */
  clue(): void {
    this.play([
      { f: 988, d: 0.14, g: 0.2, type: 'sine' },
      { f: 1319, t: 0.09, d: 0.22, g: 0.18, type: 'sine' },
    ]);
  }

  /** 「史実では」朱印スタンプ（低く沈む一撃＝ドン）。 */
  stamp(): void {
    this.play([
      { f: 210, d: 0.22, g: 0.36, type: 'sine', slideTo: 90 },
      { f: 140, t: 0.01, d: 0.16, g: 0.22, type: 'triangle', slideTo: 70 },
    ]);
  }

  /** クイズ不正解（やわらかい下行の「んー」＝叱らない外れ音）。 */
  wrong(): void {
    this.play([
      { f: 330, d: 0.14, g: 0.16, type: 'sine', slideTo: 247 },
      { f: 247, t: 0.1, d: 0.16, g: 0.13, type: 'sine', slideTo: 208 },
    ]);
  }

  /** クイズ正解（明るい上行の3音＝カードより軽い当たり音）。 */
  correct(): void {
    this.play([
      { f: 659, d: 0.12, g: 0.22 },
      { f: 880, t: 0.07, d: 0.16, g: 0.22 },
      { f: 1109, t: 0.14, d: 0.22, g: 0.2 },
    ]);
  }

  /** メーターが伸びた（上行の短いブリップ）。 */
  meter(): void {
    this.play([
      { f: 784, d: 0.1, g: 0.18, type: 'sine' },
      { f: 1047, t: 0.05, d: 0.14, g: 0.16, type: 'sine' },
    ]);
  }

  /** 人生ステージの見せ場（ひらく・成長のスウェル）。 */
  stage(): void {
    this.play([
      { f: 392, d: 0.5, g: 0.2 },
      { f: 587, t: 0.12, d: 0.5, g: 0.2 },
      { f: 784, t: 0.24, d: 0.6, g: 0.2 },
    ]);
  }

  /** ★N 急報（本能寺 等）。低く沈む不穏な二度打ち＝物語最大の激震を音でも立てる。 */
  crisis(): void {
    this.play([
      { f: 110, d: 0.5, g: 0.34, type: 'triangle', slideTo: 82 },
      { f: 165, t: 0.03, d: 0.42, g: 0.2, type: 'sine', slideTo: 124 },
      { f: 104, t: 0.42, d: 0.6, g: 0.3, type: 'triangle', slideTo: 73 },
    ]);
  }

  /** ★K 秀長の信条が刻まれる（筆を置くような、静かで確かな決意音）。 */
  creed(): void {
    this.play([
      { f: 392, d: 0.3, g: 0.22, type: 'triangle' },
      { f: 523, t: 0.11, d: 0.34, g: 0.2, type: 'triangle' },
      { f: 392, t: 0.22, d: 0.55, g: 0.1, type: 'sine' },
    ]);
  }

  /** 章クリアのファンファーレ（琴の上行＋余韻）。 */
  clear(): void {
    this.play([
      { f: 523, d: 0.2, g: 0.26 },
      { f: 659, t: 0.12, d: 0.2, g: 0.26 },
      { f: 784, t: 0.24, d: 0.24, g: 0.26 },
      { f: 1047, t: 0.38, d: 0.5, g: 0.26 },
      { f: 784, t: 0.42, d: 0.5, g: 0.14 },
    ]);
  }
}

export const sfx = new Sfx();
