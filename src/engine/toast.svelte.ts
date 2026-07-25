// トースト通知（旧 toast）。1.8 秒で自動的に消える。
export class ToastService {
  msg = $state('');
  shown = $state(false);
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(msg: string): void {
    this.msg = msg;
    this.shown = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.shown = false;
    }, 1800);
  }
}
