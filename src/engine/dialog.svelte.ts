// Custom dialog UI: browser prompt/confirm/alert give poor UX (and are blocked
// in some sandboxed contexts), so name input and delete confirmation use this.
// Replaces the legacy showDialog/showConfirm with a Promise API (same behavior).
export interface DialogOpts {
  title: string;
  /**
   * エンジンの固定文言。`{@html}` で描く（`<br />` 等を置ける）＝**可変文字列を混ぜない**。
   * 読者が打った文字列（セーブ枠の名前）は subject に渡す（`tests/dialog-trust.test.ts` が強制）。
   */
  desc?: string;
  /** 読者が打った文字列（名前など）。必ずテキストとして描く＝信頼境界のこちら側。 */
  subject?: string;
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
  confirm(opts: Omit<DialogOpts, 'input' | 'placeholder' | 'maxlength' | 'value'>): Promise<boolean> {
    return this.open({ ...opts, ok: opts.ok || 'OK', cancel: 'やめる', input: false }).then(
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
