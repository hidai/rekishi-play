// Custom dialog UI: browser prompt/confirm/alert give poor UX (and are blocked
// in some sandboxed contexts), so name input and delete confirmation use this.
// Replaces the legacy showDialog/showConfirm with a Promise API (same behavior).
export interface DialogOpts {
  title: string;
  desc?: string;
  input?: boolean;
  placeholder?: string;
  maxlength?: number;
  value?: string;
  ok?: string;
  cancel?: string;
}

interface ActiveDialog extends DialogOpts {
  resolve: (v: string | null) => void;
}

export class DialogService {
  current = $state<ActiveDialog | null>(null);

  /** 汎用。OK なら入力値（input なし時は空文字）、キャンセル/閉で null を解決。 */
  open(opts: DialogOpts): Promise<string | null> {
    return new Promise((resolve) => {
      this.current = { ...opts, resolve };
    });
  }

  /** 入力プロンプト（旧 showDialog input:true）。 */
  prompt(opts: DialogOpts): Promise<string | null> {
    return this.open({ ...opts, input: true });
  }

  /** 確認（旧 showConfirm）。OK=true / キャンセル=false。 */
  confirm(title: string, desc?: string, ok?: string): Promise<boolean> {
    return this.open({ title, desc, ok: ok || 'OK', cancel: 'やめる', input: false }).then(
      (v) => v !== null,
    );
  }

  /** DialogHost から呼ぶ。value=null はキャンセル。 */
  settle(value: string | null): void {
    const c = this.current;
    this.current = null;
    c?.resolve(value);
  }
}
