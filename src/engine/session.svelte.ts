// 画面遷移の状態（旧 show / cur / screen）。Svelte5 runes ストア。
// Account selection and work selection live above the per-work session (App owns
// both), so neither is a Session screen.
export type Screen =
  | 'title'
  | 'home'
  | 'scene'
  | 'clear'
  | 'notebook';

/** 手帳のタブ。どのタブが実際に出るかは作品データが決める（NotebookScreen の TABS）。 */
export type NotebookPane =
  | 'cards'
  | 'relations'
  | 'timeline'
  | 'map'
  | 'quiz'
  | 'creeds'
  | 'clues'
  | 'sparks'
  | 'branches'
  | 'graph'
  | 'hidden';

export class Session {
  screen = $state<Screen>('title');
  /** 現在プレイ中の章・シーン（旧 cur）。 */
  ch = $state<number | null>(null);
  scene = $state<string | null>(null);
  /** 手帳を開くときの初期タブ（旧 openNotebook の pane 引数）。 */
  notebookPane = $state<NotebookPane>('cards');
  /** 手帳を開いた場所。シーン中に開いたら「もどる」でそのシーンへ帰す（engine/trail）。 */
  notebookFrom = $state<{ ch: number; scene: string } | null>(null);
  /** 開いている人物/ことばカードモーダルの id（旧 openCardModal/closeModal）。 */
  cardModalId = $state<string | null>(null);

  openCard(id: string): void {
    this.cardModalId = id;
  }
  closeCard(): void {
    this.cardModalId = null;
  }

  /** 手帳を開く（旧 openNotebook）。 */
  openNotebook(pane: NotebookPane = 'cards'): void {
    this.notebookPane = pane;
    // Tab switches inside the notebook must not forget where it was opened from.
    if (this.screen !== 'notebook') {
      this.notebookFrom =
        this.screen === 'scene' && this.ch != null && this.scene
          ? { ch: this.ch, scene: this.scene }
          : null;
    }
    this.show('notebook');
  }

  /** 手帳から一段上がる＝開いた場所（シーン）へ、なければ年代記へ。 */
  leaveNotebook(): void {
    const from = this.notebookFrom;
    this.notebookFrom = null;
    if (from) this.goScene(from.ch, from.scene);
    else this.show('home');
  }

  goScene(ch: number, scene: string): void {
    this.ch = ch;
    this.scene = scene;
    this.show('scene');
  }

  /** 画面遷移（旧 show）。スクロールを先頭へ戻す。 */
  show(screen: Screen): void {
    this.screen = screen;
    try {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? ('instant' as ScrollBehavior) : 'auto' });
    } catch {
      /* noop */
    }
  }
}
