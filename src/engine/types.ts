// エンジン ⇄ 作品 の契約。
// エンジンは Work オブジェクトのコンシューマであり、作品固有定数はすべてここで定義した
// 型を通して Work / WorkMap に集約する。enum 的なフィールドは、逐語移植したデータ literal を
// 追加変換なしに受け入れるため string のままにしている。

/* ---------------- 物語 ---------------- */

/**
 * ★"Sureness marks" (たしかさマーク ◎○△☆). Work-agnostic grading of how strongly records
 * support a claim: ◎ = solid record / ○ = mostly sure / △ = scholars disagree / ☆ = only a
 * telling, unverifiable. Puts source criticism (how far to trust a told history) in the
 * child's hands; carries only the generic meaning "degree of not-knowing", no work-specific
 * value (G4). Where Hist's source.grade (contemporary/later/tale) measures how CLOSE a source
 * is, this measures how sure the CLAIM opened in spark/deep is. Labels: engine/confidence.ts.
 */
export type Confidence = '◎' | '○' | '△' | '☆';

export interface Deep {
  q: string;
  body: string;
  cite?: string;
  /** ★Sureness mark of the claim this deep examines. Omitted = no badge. */
  confidence?: Confidence;
}

/**
 * ★K 秀長の「信条」＝ 決め台詞＋象徴アクション。
 * 物語は主人公を「記録に残らない裏方」という"負の定義"で描く。だが子どもに人物像を
 * 刷り込むには、その対に「秀長は こういう時 こう動く人だ」という"正の定義"が要る。
 * 各章の山場に一人称の決め台詞を1つ立て、集めると手帳「秀長のことば」に肖像として積み上がる
 * （手がかり＝"なぜ記録に残らないか"の謎に対する、"秀長とはどんな人か"の答え）。
 */
export interface Creed {
  /** 秀長の一人称の決め台詞（「」つき・ruby 可）。章に1つが目安。 */
  line: string;
  /** その台詞が名指す象徴アクションを述べる一文（「——そして…」）。 */
  act: string;
}

/**
 * ★M 段取りミニゲーム（sort型）：ばらばらの手順を「つぎは どれ？」のタップで
 * 正しい順に組み上げる。読むだけだった「段取り・裏方のすごさ」を、手で体感させる装置。
 * items は正しい順で書く（表示はシャッフルされる）。どの作品でも「出来事の順番」
 * 「作業手順」の学びに使い回せる汎用機構。
 */
export interface SortMinigame {
  type: 'sort';
  /** 見出し（例「城づくりの 段取り」）。ruby HTML allowed */
  title: string;
  /** 導入の一文（何をするか）。ruby HTML allowed */
  lead?: string;
  /** 正しい順の項目（3〜6個目安。絵文字＋短文推奨）。ruby HTML allowed */
  items: string[];
  /** 完成後に見せる学びの一文。ruby HTML allowed */
  outro?: string;
}

/**
 * march minigame ("the numbers fight back" forced march). Fatigue, food, and distance
 * respond to the player's plan (prep cards + daily pace), so failure is common; clearing
 * shows a history-comparison outro. The engine holds no proper nouns or fixed numbers —
 * only the fx-key semantics — so all specifics come from the work data.
 */

/** Generic prep-card effects. Engine implements only these semantics. */
export interface MarchPrepFx {
  /** Refill food to max when the km position is crossed. */
  depotAt?: number;
  /** Negate the rain-day distance penalty. */
  rainShield?: boolean;
  /** Per-pace fatigue adjustment (pace id -> delta). */
  paceFatigueDelta?: Record<string, number>;
  /** Fatigue adjustment applied on marching days (km > 0). */
  dailyFatigueDelta?: number;
}

export interface MarchPrep {
  id: string;
  label: string; // emoji + short text, ruby allowed
  desc?: string; // one-line effect description shown on the card
  /** Log line shown on a day this prep's effect fires (makes an abstract buff visible). */
  hitLog?: string;
  fx: MarchPrepFx;
}

export interface MarchPace {
  id: string; // 'slow' | 'normal' | 'hard' | 'rest' etc. — work-defined
  label: string;
  km: number;
  fatigue: number; // negative = recovery
}

export interface MarchMinigame {
  type: 'march';
  /** ruby HTML allowed */
  title: string;
  /** ruby HTML allowed */
  lead?: string;
  goalKm: number;
  days: number;
  rainDay?: number; // 1-based; omit for no weather event
  foodStart: number;
  foodMax: number;
  troopsStart: number;
  minTroops: number;
  collapseAt: number;
  fatigueCap: number;
  collapseTroopLoss: number;
  hungryTroopLoss: number;
  hungryFatigueMul: number;
  prepPicks: number; // 3
  preps: MarchPrep[];
  paces: MarchPace[];
  /**
   * Route landmarks for the progress bar (km -> label), e.g. depots & goal.
   * Plain text only (no ruby): the bar renders labels as text and has no room for <rt>.
   */
  landmarks?: { at: number; label: string }[];
  /** ruby HTML allowed. Shown on clear (history comparison). */
  outro?: string;
  /** ruby HTML allowed */
  failLate?: string;
  /** ruby HTML allowed */
  failArmy?: string;
}

/** ★M シーンに置けるミニゲーム（将来 'findOnMap' 等を union に追加）。 */
export type Minigame = SortMinigame | MarchMinigame;

export interface OnEnter {
  card?: string;
  cards?: string[];
  clue?: string;
  clues?: string[];
}

/**
 * Source attribution for a Hist panel. Shifts the epistemology from
 * "the truth, kept somewhere" to "a record someone wrote for a reason".
 * Attach only to factual (canon) panels — never to moshimo/answer/'心' panels,
 * where the absence of records is itself the point.
 */
export interface HistSource {
  /**
   * How close the record is to the events:
   * 'contemporary' = written at the time (◎), 'later' = written within
   * a generation or two (○), 'tale' = later storytelling (△).
   */
  grade: 'contemporary' | 'later' | 'tale';
  /** Source name shown to the reader (ruby HTML allowed), e.g. 『信長公記』. */
  name: string;
  /** One line on who wrote it / when / why it matters (ruby HTML allowed). */
  note?: string;
}

export interface Hist {
  verdict: string;
  match: string;
  body: string;
  moshimo?: boolean;
  /**
   * ★N 朱印の文字の上書き（既定: moshimo なら「もし」、それ以外は「史実」）。
   * 「記録に残っていない場面」（例: 兄弟の最後の会話）など、史実とも もしもとも
   * 言い切れないパネルに使う（例: '心'）。
   */
  seal?: string;
  card?: string;
  clue?: string;
  /** Source attribution line shown under the body. Omit when none applies. */
  source?: HistSource;
}

export interface Choice {
  label: string;
  to: string;
  hist?: Hist;
  /** 選択肢直付けのカード/手がかり（旧 afterChoice の c.card||h.card）。実データは hist 側。 */
  card?: string;
  clue?: string;
  /** 終章の「答え」選択肢番号（0-3）。 */
  answer?: number;
  /**
   * ★L この選択肢が「史実で実際に起きた道」なら true。
   * クリア画面の「きみの読み（史実一致 N/M）」の判定に使う。1つの分かれ道で
   * 複数 true も可（どちらも史実と言える場合）。どの選択肢にも無い分かれ道
   * （終章の「きみの答え」等）は一致率の集計対象外。
   */
  canon?: boolean;
  /**
   * ★1「きみの秀長」メーターの増減。メーター key → 増分。
   * 正解/不正解ではなく、選択で"人物像の色"を少しずつ変える。
   * ⚠️ ローカル保存（WorkSave.meters）のみ。
   */
  effect?: Record<string, number>;
}

/**
 * ★O 対面の場（クローズアップ）の登場人物。
 * face は顔スペックキー（'p-hideyoshi@grief' のような感情・加齢派生も可）。
 * pid は face の '@' より前から導出し、カードがある人物はタップでカードが開く。
 * name 省略時はカード名（cards[pid].name）→ peopleExtra の順で解決する。
 */
export interface CloseupCast {
  face: string;
  name?: string;
}

/**
 * ★O 対面の場（クローズアップ）。「どこ」でなく「だれ・想い」が主語のシーンで、
 * 読み解き地図に代えて人物のバストアップを大きく見せる、シーンのメインビジュアル。
 * reveal（一度きりのインタースティシャル）と違い、シーンの間ずっと表示され、
 * 再訪でも出る。顔タップで人物カードが開く（地図と同じ文法）。
 * tone: warm=旅立ちの朝 / tense=威圧 / solemn=降伏・静粛 / serene=茶室 / grief=死の床。
 */
export interface SceneCloseup {
  tone: string; // warm|tense|solemn|serene|grief
  /** 左から順に置く 1〜2 人。主人公は（きみ）付きの name 上書きを推奨。 */
  cast: CloseupCast[];
}

/**
 * ★Q One findable detail in the scene's main visual (observation view).
 *
 * Coordinates are NORMALIZED to the picture's frame (0..1 of its width / height),
 * not viewBox units: main visuals disagree on their coordinate system — a closeup
 * is a fixed 800x500 while a scene map is content-fit and its viewBox changes per
 * scene — so work data cannot name viewBox coordinates. `r` is a fraction of the
 * frame's WIDTH and the drawn circle stays round; the overlay corrects for aspect.
 * Author these against `scripts/render-observe.ts`, the way gaz points are authored.
 */
export interface ObserveHotspot {
  id: string;
  x: number;
  y: number;
  r: number;
  /**
   * The one line that surfaces when this is found. ruby HTML allowed — which is
   * why the UI renders it as HTML and the SVG overlay never draws it (`<text>`
   * cannot carry `<ruby>`; the same constraint the map's `note` lives under).
   */
  caption: string;
  /**
   * The star this becomes in the connection graph (`WorkGraph.nodes`). Finding the
   * hotspot is what puts that star on the reader's board; without one the detail is
   * noticed and read, but never becomes something they can connect.
   */
  nodeId?: string;
  /**
   * Hotspot id — anywhere in the work — that must be found before this one is
   * visible at all. This is what makes the eye "grow": an old picture yields new
   * detail once a later chapter taught the reader what to look for (davinci §6-2).
   */
  gatedOn?: string;
  /** Required to unlock 「つづき」. Cannot be `gatedOn` (that would deadlock the scene). */
  essential?: boolean;
}

/**
 * ★Q 観察ビュー。シーンのメインビジュアルの上に重ねる「気づき」の層。
 *
 * 読者はレンズで絵をなで、その人物が気づくものを拾う。読み解き地図が「どこ」に
 * 答えるのに対し、この装置は「よく見る」こと自体を体験させる——情報でなく、
 * 気づくという行為が主題（VISION 原則5「体感 > 情報」）。
 *
 * メインビジュアルを置き換えない: closeup / figure / sceneMap が「何を描くか」を
 * 決め、observe は「その中に何が見つかるか」だけを足す。ゆえに observe を持つ
 * シーンも主ビジュアルの分類はそのままで、エンジンが描ける絵はすべて hotspot を
 * 載せられる（エンジンは絵の語彙を持たない＝作品固有の絵を持ち込まない）。
 */
export interface ObserveSpec {
  /** 探しにいかせる問い。UI が本文側に HTML で出す。ruby HTML allowed。 */
  prompt: string;
  hotspots: ObserveHotspot[];
}

export interface Scene {
  /** @deprecated 未使用の遺物（旧 Scene.art）。保持のみ。 */
  art?: string;
  place: string;
  text: string;
  /**
   * ★3 主人公・秀長の「内心のひとこと」（一人称の内語）。
   * 周囲の `.speak`（「」台詞）とは別スタイルで、なりきりの主役に感情を持たせる。章に 1 つが目安。
   */
  monologue?: string;
  /**
   * ★4「えっ！？」の 露出。畳まれた deep の目玉を本文横に 1 つだけ出し、
   * 「もっと深く」を開かせる引き。章に 1 つが目安。
   */
  spark?: string;
  /** 選択肢の直前に示す問い。 */
  q?: string;
  deep?: Deep;
  /**
   * ★K 秀長の「信条」。その章の山場で、負の定義（記録に残らない裏方）と対に
   * "正の定義"を1枚立てる。手帳「秀長のことば」に collectedCreeds で集約される。
   */
  creed?: Creed;
  onEnter?: OnEnter;
  /**
   * ★M このシーンに置くミニゲーム。next を持つシーンでは、完成するまで
   * 「つづき」ボタンがロックされる（「とばして 進む」の逃げ道つき）。
   */
  minigame?: Minigame;
  /**
   * ★N 山場の全画面インタースティシャル（プロフィール×シーンで一度きり）。
   * 本能寺の「急報」など、通常レイアウトでは立たない"感情の山"を1枚立てる。
   * tone:'crisis' で緊急の見た目＋専用効果音（既定は ★G と同じ金の見た目）。
   */
  reveal?: { face?: string; title: string; caption: string; tone?: string };
  /**
   * ★O 対面の場。このシーンのメインビジュアルを、読み解き地図に代えて
   * 人物のクローズアップにする（「だれ・想い」が主語のシーン用）。
   */
  closeup?: SceneCloseup;
  /** ★P 人の図（席の図 / 血の縁の図）を主ビジュアルにする。work.figures のキー。closeup があればそちらが優先。 */
  figure?: string;
  /** ★S 習作ページ（手記）を主ビジュアルにする。work.studies のキー。closeup / figure があればそちらが優先。 */
  study?: string;
  /**
   * ★Q 観察ビュー。主ビジュアル（closeup / figure / 地図のいずれでも）の上に
   * 「気づき」の hotspot 層を重ねる。next を持つシーンでは essential な hotspot が
   * 揃うまで「つづき」がロックされる（★M と同じ「とばして 進む」の逃げ道つき）。
   */
  observe?: ObserveSpec;
  /**
   * Person ids named in this scene's text who get no other face (no closeup cast,
   * no map marker) — shown as small tappable face chips AFTER the body as a
   * post-read index. Each id must resolve in both `faces` and `cards`. Prefer the
   * inline `<face pid="…">名前</face>` markup inside `text` (engine/inlineFaces),
   * which anchors the face AT the name; keep `mentions` for people named only in
   * a `.speak`/deep panel where an inline chip has no clean spot.
   */
  mentions?: string[];
  /**
   * ★N 終章の答え合わせ等で、集めた「手がかり」をシーン内にチップ表示する。
   * 手帳を開かなくても、推論の材料が選択肢の直前に並ぶ。
   */
  showClues?: boolean;
  next?: string;
  choices?: Choice[];
  end?: boolean;
}

export interface Chapter {
  id: number;
  num: string;
  title: string;
  years: string;
  lead: string;
  start: string;
  scenes: Record<string, Scene>;
  /** ★4 章間クリフハンガー。この章クリア時に「次章の未解決の謎」を 1 つ見せる。 */
  teaser?: string;
}

export interface Story {
  chapters: Chapter[];
}

/* ---------------- 収集要素 ---------------- */

/**
 * A real photograph/scan shown on a card ("本物の絵の写真が見たい" — family play 2026-07-22).
 *
 * `src` is a data URI: the delivery contract forbids loading external resources (a CDN would also
 * break offline play and pin us to someone else's uptime), so the picture ships inside the build.
 * Keep them small (≈560px, tens of KB) — every image is carried by every reader.
 *
 * `credit` is not decoration: it names the work, holder and licence in the child's own reading
 * language, and it is the same lesson the game teaches about texts — a picture also comes from
 * somewhere. Only public-domain reproductions may be used (see each work's photos.ts header).
 */
export interface CardPhoto {
  /** data:image/...;base64,... */
  src: string;
  /** Alt text (plain, no ruby — screen readers and the img tag). */
  alt: string;
  /** Source line shown under the picture (ruby HTML allowed). */
  credit: string;
}

export interface Card {
  type: string; // 'person' | 'word'
  ch: number;
  tone?: string;
  name: string;
  read?: string;
  text: string;
  /** ★T 本物の写真（あれば図鑑カードに出る）。 */
  photo?: CardPhoto;
}

export interface Clue {
  ch: number;
  text: string;
}

export interface TimelineEntry {
  y: string;
  ch: number;
  key?: boolean;
  death?: boolean;
  t: string;
  d: string;
}

/* ---------------- メーター（★1「きみの◯◯」の色） ---------------- */

export interface MeterDef {
  /** Choice.effect / WorkSave.meters のキー。 */
  key: string;
  /** 見出しの絵文字。 */
  icon: string;
  /** 短いラベル（例「兄との 絆」）。 */
  label: string;
  /**
   * このメーターが最も高いとき、終章の締めに出す1文（末尾の句点なし）。
   * 例「とりわけ 兄・秀吉との 絆を 大切に する、兄思いの 弟に 育った」
   */
  summary: string;
  /**
   * ★C このメーターが最も高いとき、各章クリアで出す"中間寸評"の1文（末尾の句点なし）。
   * 終章の summary を待たず、選択の積み上がりを途中で実感させる。
   * 例「だんだん 兄思いの 弟に なってきた」
   */
  progress?: string;
}

export interface MetersConfig {
  /** HUD 見出し（例「きみの 秀長」）。 */
  title: string;
  /** メーター定義（表示順）。 */
  defs: MeterDef[];
  /** どのメーターも突出しない（引き分け/未加算）ときの締めの1文。 */
  balanced: string;
  /** ★C どのメーターも突出しないときの、各章クリアの中間寸評の1文。 */
  progressBalanced?: string;
}

/* ---------------- 似顔絵 ---------------- */

/**
 * Continuous face-morph offsets (face-engine slice 2). All optional; omitted = the
 * classic coordinates. Units are the 100x100 face coordinate system. Unlike the
 * discrete part keys, these channels are not exhausted by era/status/age, so they
 * carry identity between same-era casts. Documented ranges are enforced by
 * tests/face-distinct.test.ts (out-of-range values distort the face geometry).
 */
export interface FaceMorph {
  /** Vertical eye offset (+ = lower). Range -2..2. */
  eyeY?: number;
  /** Uniform eye scale about the eye center (50, 52.5). Range 0.9..1.12.
   *  Not allowed on age:'child' faces — it MULTIPLIES the legacy 1.11 child eye
   *  boost and the composed scale leaves the documented range (gate-enforced). */
  eyeScale?: number;
  /** Vertical brow offset (+ = lower, closer to the eyes). Range -2..2. */
  browY?: number;
  /** Vertical mouth offset (+ = lower). Moves the mustache with it. Range -2..2. */
  mouthY?: number;
  /** Horizontal mouth width scale about x=50. Range 0.88..1.12. */
  mouthScale?: number;
  /** Whole-face horizontal width scale about x=50 (face-engine slice 4): + = broader,
   *  - = narrower/leaner. Scales the entire face (outline, features, hair, shoulders)
   *  as one group, so proportions stay coherent. A continuous refinement of the discrete
   *  `shape` axis that the era does not exhaust. Range 0.92..1.08. */
  faceW?: number;
}

export interface FaceSpec {
  tone: string;
  /** 髪・かぶりもの。語彙は face.ts の HEAD_KINDS（未知の値は既定の髪で黙って描かれる＝tests が落とす）。 */
  head: string;
  hair: string;
  brow: string; // stern|calm|soft|angry|worried
  /** 眉の太さ。'fine'=細く高い眉（表情 `brow` はそのまま）。省略＝太い塗りの眉。
   *  太い眉はこの画風でいちばん強い「男の顔」の合図なので、表情とは別のチャネルにしてある。 */
  browWeight?: string;
  eye: string; // calm|sharp|gentle|closed|narrow|lively|cry|wide
  mouth: string; // smile|grin|flat|frown|soft|laugh
  beard: string;
  skin?: string;
  /** 虹彩の色。省略時は温かい茶。冷徹な人物は暗色にする等、人物の個性付け。 */
  iris?: string;
  /** 輪郭シルエット。oval(既定)|round|long|square|gaunt。人物の見分けの要。 */
  shape?: string;
  /** 'big' で大きな耳（秀吉の猿相など）。 */
  ears?: string;
  /** 頬の演出。'monkey'=笑いじわ＋赤み / 'sunken'=こけた頬 / 'blush'=赤みだけ。 */
  cheek?: string;
  /** ★A 年齢の演出。'old'=額・ほうれいの しわ（晩年のやつれ） / 'child'=大きな瞳。 */
  age?: string;
  /** Shoulders/collar garment. 'western'=19c suit + shirt + cravat / 'navy'=stand-collar
   *  uniform with gold buttons / 'houe'=monastic robe over a white inner collar (pairs with
   *  head:'ama') / 'kosode'=女性の小袖（なで肩＋広い襟合わせ）/ 'uchiki'=袿（襲の色目＝重ね襟）/
   *  'gown'=16c ヨーロッパの女性の衣（四角い襟ぐり＋締めた身頃）。
   *  Omitted = kimono (default; earlier works unchanged). */
  garb?: string;
  /** Nose variant — the biggest identity gap (all 74 pre-slice-2 faces shared one nose).
   *  'tall'=long straight bridge / 'round'=dango tip / 'thin'=fine and narrow /
   *  'wide'=broad base with nostril hooks. Omitted = the classic standard nose. */
  nose?: string;
  /** Continuous micro-offsets (eyes/brow/mouth). See FaceMorph. */
  morph?: FaceMorph;
}

/* ---------------- 人物相関図（★D 表示専用） ---------------- */

export interface RelationCat {
  /** カテゴリキー（色分け・凡例）。 */
  key: string;
  /** 凡例ラベル（例「家臣・補佐」）。 */
  label: string;
  /** エッジ／凡例の色（CSS 色。FACE_TONES 相当の落ち着いた色）。 */
  color: string;
}

export interface Relation {
  /** 相手の人物 id（＝カード id。faces / cards で解決）。 */
  pid: string;
  /**
   * 主人公から見た関係の短いラベル（例「兄」「家臣」）。
   * ⚠️ ruby 不可（テキストとして描く）: 相関図が SVG の `<text>` で描くので `<ruby>` を
   * 運べない（地図の note と同じ制約）。手帳のクイズもこの欄をテキストで出す。
   * `tests/ruby-render.test.ts` が機械で守る。
   */
  rel: string;
  /** RelationCat.key。色分け・グループ。 */
  cat: string;
}

/** ★D 人物相関図（既存カードの"関係の網"を描く表示専用データ。新カードは足さない）。 */
export interface WorkRelations {
  cats: RelationCat[];
  edges: Relation[];
}

/* ---------------- ★R つながり図鑑（graph collection） ---------------- */

/**
 * ★R A field the observations belong to (design/davinci.md §5) — colour and legend only.
 * The relation map's `cats` play the same part for people.
 */
export interface GraphField {
  key: string;
  /** Legend label. ruby HTML allowed — the pane draws the legend as HTML. */
  label: string;
  /** Star / edge colour (a literal CSS colour, the way relations.ts writes them). */
  color: string;
}

/**
 * ★R One star in the constellation: something the reader noticed (an observation), or
 * something their links gave birth to (an invention).
 *
 * An observation star is authored at a fixed place in the field and appears once the
 * reader finds the hotspot that names it (`ObserveHotspot.nodeId`). An invention star
 * has no place of its own: it is born at the heart of the links that made it (`bornOf`),
 * so it cannot be drawn — or hinted at — before those links are lit.
 */
export interface GraphNode {
  id: string;
  /**
   * The short heading drawn beside the star.
   * ⚠️ ruby 不可（no ruby）: the constellation draws this as SVG `<text>`, which cannot
   * carry `<ruby>` — the same constraint `Relation.rel` and the map's `note` live under.
   * Keep it short and readable on its own (kana where a kanji would need furigana).
   * `graphErrors()` guards both the ruby ban and the width.
   */
  star: string;
  /** The one line the reader gets when they tap the star. ruby HTML allowed. */
  caption: string;
  /** GraphField.key. */
  field: string;
  /**
   * Where the star sits, NORMALIZED to the field (0..1) — the same contract as
   * `ObserveHotspot`, and for the same reason: work data cannot name viewBox units.
   * Observation stars must have one; invention stars (`bornOf`) must not.
   */
  x?: number;
  y?: number;
  /**
   * Invention star: the links (`GraphLink.id`) that must ALL be lit before it is born.
   * Its place is derived from theirs, so it stays invisible — not even an empty slot —
   * until the reader's own links call it into being (davinci §5-4「線の中点に bloom」).
   */
  bornOf?: string[];
  /** Card (a `cards` key) that opens when this star is born. */
  card?: string;
}

/**
 * ★R A real connection between two stars — authored, never generated. Everything not
 * written here is a "not yet…?" (davinci §5-5): the cost of authoring is the number of
 * true connections, so it never grows as N².
 */
export interface GraphLink {
  id: string;
  /** The two stars it joins. Unordered — dragging either onto the other lights it. */
  a: string;
  b: string;
  /** The line that surfaces when it lights. ruby HTML allowed — the pane draws it. */
  caption: string;
}

/** ★R つながり図鑑（気づきの星と、子どもが引いた線でできる網）。 */
export interface WorkGraph {
  fields: GraphField[];
  nodes: GraphNode[];
  links: GraphLink[];
  /**
   * Last chapter that coaches the drag (the one star that would light pulses while the
   * reader holds another — davinci §5-3「序盤だけ」). Omitted = never.
   *
   * This is a per-work pacing call, so it lives in the work's data rather than in the
   * pane: past the window the reader is meant to be forming their own hypotheses, and
   * being shown the answer is the game taken away. `coachTargets()` reads it, so the
   * window holds however the UI calls it.
   */
  coachUntilChapter?: number;
}

/* ---------------- 人の図（★P 表示専用・章進行） ---------------- */

/** 図の勢力（色分け・凡例）。key を fill.faction / node.house / node.ring / dais.faction が参照。 */
export interface FigureFaction {
  key: string;
  label: string;
  /** literal 色を推奨（render-scene で忠実に出る。relations.ts と同じ流儀）。 */
  color: string;
}

/** 席の図の1席。座標は図の viewBox 座標系。 */
export interface FigureSeat {
  id: string;
  x: number;
  y: number;
  /** 席の役職ラベル（任意・未使用でも可）。 */
  role?: string;
}

/** 席への章キー割当。「見ている章 >= fromCh」で有効（同席は fromCh 最大が勝つ＝last-wins）。 */
export interface FigureFill {
  seat: string;
  fromCh: number;
  faction: string;
  /** 顔＋カードのある人物なら小さな顔を置きタップでカードが開く。無ければ色タイルのみ。 */
  pid?: string;
  /** 席の脇に出す短い名前（省略時は shortNames[pid]）。 */
  label?: string;
}

/** 装置1・席の図。公卿の席が章で染まる。帝（dais）は不変の文脈。 */
export interface AssemblyFigure {
  kind: 'assembly';
  /** viewBox サイズ（省略時 [300, 310]）。 */
  vb?: [number, number];
  title?: string;
  /** 題の下に出す説明の一文（SVG text＝ルビ不可。地図ラベルと同じ分かち書きで短く）。 */
  caption?: string;
  /** この faction key の席数を「n/総席数」で凡例に添える（章進行で自動更新）。 */
  tally?: string;
  /** 割当の無い席の既定 faction key（例 'court'）。 */
  base?: string;
  factions: FigureFaction[];
  seats: FigureSeat[];
  fills: FigureFill[];
  /** 上座（帝）。色は変わらない文脈として置く。 */
  dais?: { x: number; y: number; label?: string; faction?: string };
}

/** 血の縁の図のノード（人物）。 */
export interface LineageNode {
  id: string;
  x: number;
  y: number;
  /** 顔＋カードのある人物なら顔＋タップ。 */
  pid?: string;
  /** ノードの家（fill 色の faction key）。例 'heike' | 'imperial'。 */
  house: string;
  /** ふち色の faction key（省略時 house と同色）。安徳＝house:'imperial'・ring:'heike' で「帝に平家の血」。 */
  ring?: string;
  /** このノードが現れる章（省略時 1）。 */
  fromCh?: number;
  /** 顔が無い場合に円内へ出す短いラベル。 */
  label?: string;
}

/** 血の縁の図のエッジ。descent=親子（細線・かぎ折れ）／marriage=婚姻（金の二重線）。 */
export interface LineageEdge {
  from: string;
  to: string;
  kind: 'descent' | 'marriage';
  fromCh: number;
  /** descent の第2の親（夫婦のもう一方）。指定すると線は from×from2 の婚姻線の中点から子へ降りる（系図の文法）。 */
  from2?: string;
  /** この章から縁が「切れた線」（点線＋系図の二重斜線）で描かれる。両端の人は図に残る——
   *  図から人を消しても読者は消えたことに気づけない（欠如は絵で名指せない）。喪失は
   *  「無くなった物」でなく「残った物の変化」が運ぶ。 */
  cutCh?: number;
}

/** 装置2・血の縁の図（系図・接ぎ木）。 */
export interface LineageFigure {
  kind: 'lineage';
  /** viewBox サイズ（省略時 [300, 250]）。 */
  vb?: [number, number];
  title?: string;
  /** 題の下に出す説明の一文（SVG text＝ルビ不可。地図ラベルと同じ分かち書きで短く）。 */
  caption?: string;
  factions: FigureFaction[];
  nodes: LineageNode[];
  edges: LineageEdge[];
}

/** 戦場の図の1部隊。座標は図の viewBox 座標系。 */
export interface BattleUnit {
  id: string;
  x: number;
  y: number;
  /** 勢力 key（色分け・凡例）。 */
  faction: string;
  /** 顔＋カードのある大将なら顔チップを置きタップでカードが開く。 */
  pid?: string;
  /** 顔の無い部隊のラベル（省略時 shortNames[pid]）。 */
  label?: string;
  /** 部隊の下に出す地名など（松尾山 等・SVG text＝ルビ不可＝本文が教える語）。 */
  role?: string;
  /** 指定すると「軍勢」を表す旗の群れを本数ぶん描く（顔なし＝軍勢の文法）。 */
  troops?: number;
  /** 旗の向き（+1=右/東・-1=左/西。省略時 +1）。谷で対峙する二軍は互いに向く。 */
  facing?: number;
  /** 真なら高地（丘）の上に据える＝見おろす。丘の hump を下に描く。 */
  hill?: boolean;
}

/** 装置3・戦場の図（谷で対峙する軍と、高地に構える伏兵）。地図の投影床（顔遮蔽圏 ~40u）
 * より小さい合戦——盆地1つが山場の章——に使う。勝敗・寝返りの時刻は解像しない（WRITING 地図書法2）。 */
export interface BattlefieldFigure {
  kind: 'battlefield';
  /** viewBox サイズ（省略時 [1000, 340]）。 */
  vb?: [number, number];
  title?: string;
  /** 題の下に出す説明の一文（SVG text＝ルビ不可。地図ラベルと同じ分かち書きで短く）。 */
  caption?: string;
  /** ぶつかる最前線（谷の中央の点線＝どちらが勝つかを解像しない。矢印は引かない）。 */
  seam?: { x: number; label?: string };
  factions: FigureFaction[];
  units: BattleUnit[];
}

/** ★P 人の図（kind で判別する主ビジュアルの型）。 */
export type Figure = AssemblyFigure | LineageFigure | BattlefieldFigure;

/**
 * ★S 習作ページ（手記）＝ closeup / figure / 地図に続く4種目の主ビジュアル。
 *
 * 顔でも人でも場所でもない「自然を観るシーン」（洞窟・川・光・体）のための下敷き。
 * `Scene.observe` のオーバーレイ（レンズ・✦）は絵の上に重なるだけで絵を持たないので、
 * 顔の無いシーンにはこの手記ページが要る（davinci ch1 自然観察 / ch4 最後の晩餐）。
 *
 * 絵の語彙（渦・鳥・光と球・カール…）はエンジンが持つ再利用可能なプリミティブで、
 * 作品は「どれを・どこに」置くかだけを与える——face の鼻/髪や closeup の日輪/月と同じ
 * 分担（設計書 §11「将来の科学者・職人作品にも効く習作ページ art」）。純 SVG・固定
 * パレット・`<defs>` id は `sp-<key>-` 接頭（closeup と同じ規律）。
 */
export type StudyPrimitive =
  | 'eddy'
  | 'bird'
  | 'sphere'
  | 'leaf'
  | 'arch'
  /** 一点透視の部屋（消失点＝この subject の中心に天井・床・壁の線が集まる）。 */
  | 'perspective'
  /** 長い卓（布が垂れ、皿が並ぶ）。 */
  | 'table'
  /** 人ひとり（両腕をひらく姿）。 */
  | 'person'
  /** 身ぶりでざわめく三人の群れ。 */
  | 'figures';

export interface StudySubject {
  /** どの自然観察プリミティブを描くか（エンジンの再利用語彙）。 */
  kind: StudyPrimitive;
  /** 中心（viewBox 800x500 単位）。observe の hotspot 正規化座標はこの絵に対して置く。 */
  x: number;
  y: number;
  /** 基準サイズに対する倍率（1 ≈ 直径120）。 */
  scale?: number;
  /** 左右反転（左利きの手記＝主役が右から左へ描く並びを崩さないための微調整）。 */
  flip?: boolean;
}

export interface StudyPage {
  /** ページ上端の見出し（SVG text＝ルビ不可。分かち書きで短く）。 */
  title?: string;
  subjects: StudySubject[];
  /**
   * 手記の隅に薄く走る「鏡文字」の飾り（意味を持たない波状のインク＝左利き・鏡文字の
   * 気配だけを出す。読ませない＝ルビ不要）。true でエンジンの既定飾りを敷く。
   */
  mirror?: boolean;
}

/* ---------------- 地図 ---------------- */

export interface GazPoint {
  /**
   * A place either in REAL [lon,lat] (preferred — the engine projects it via Geo.proj at render,
   * so it lands correctly even east of the legacy frame, and the model generalizes overseas) or in
   * pre-projected px [x,y] (legacy; still supported). Give lon/lat OR x/y. A far-off-frame point
   * that only supplies an edge-arrow *direction* (e.g. San Francisco across the Pacific, which this
   * Japan projection cannot place by its true longitude) stays as a hand-set px [x,y].
   */
  x?: number;
  y?: number;
  lon?: number;
  lat?: number;
}

/**
 * A numbered footprint on the campaign map (手帳「進軍の地図」). Position follows GazPoint:
 * REAL [lon,lat] (preferred) or pre-projected px [x,y] (legacy) — the engine projects it at render,
 * so a work whose gaz is in lon/lat can write its footprints the same way.
 */
export interface MapPoint extends GazPoint {
  n: number;
  ch: number;
  id: string;
  label: string;
  sub: string;
  /**
   * Where the label sits relative to the dot (default 'above'). Two footprints a day's march apart
   * land a few pixels apart while their labels keep one on-screen size, so the upper one's label is
   * painted over by the lower one's dot. Same escape as `Marker.lpos`: move the drawing of the name,
   * never the place.
   */
  lpos?: 'above' | 'below' | 'left' | 'right';
}

export interface Marker {
  at: string;
  cur?: number;
  kind?: string; // village|castle|town|siege|battle|mine|crisis|death|shrine|flag|sea|person
  label?: string;
  note?: string;
  people?: string[];
  enemy?: number | boolean;
  off?: number | boolean;
  /**
   * ラベルの逃がし先。既定はアイコンの下。'above' は顔の上へ、'left'/'right' は横へ逃がす
   * （真北・真南に近い2地点が実座標で数kmしか離れていないとき、上下だけでは列が重なる）。
   */
  lpos?: 'above' | 'left' | 'right';
}

export interface SceneMapDef {
  markers?: Marker[];
  route?: string;
  allDots?: number | boolean;
  /**
   * Pref ids drawn in the contested/enemy fill (`--map-contested`) for this scene,
   * overriding chapter-granularity territory. `WorkMap.territory` only knows the
   * chapter a region becomes owned, so during that chapter's invasion scenes the
   * map would claim land the text says the enemy still holds (hidenaga ch5:
   * Shikoku Toyotomi-colored while landing on it). List the prefs on the attack
   * scenes; drop them from the pacification scene onward.
   */
  contested?: (string | number)[];
  /**
   * Stage this scene in a different world: a key of `WorkMap.geos`. Omitted = the work's home
   * `WorkMap.geo`. The scene's markers, base coastline, framing and locator all follow the named
   * geo, and every `gaz` place it pins is projected through THAT geo — so a place is written once in
   * real [lon,lat] and lands correctly in any world able to hold it.
   *
   * A scene declares its own stage because the stage is a fact about the SCENE's subject, not about
   * the work: katsu is a Japan story whose ch3 subject is an ocean. Framing it on the home geo is
   * what left a Tokyo map behind the whole Pacific crossing (family observation memo 2026-07-15) —
   * off-map markers are excluded from framing by design, so the far shore could only ever be an edge
   * arrow. VISION 設計原則5「体感 > 情報」: the crossing's meaning is its distance, and only a frame
   * holding both shores can show it.
   */
  geo?: string;
}

export interface RouteDef {
  d: string;
}

/**
 * A route drawn on the campaign map (手帳「進軍の地図」). Hidenaga: 中国大返し /
 * 美濃大返し; a sea-based work reuses the same shape for trade & sea-lane paths.
 * Rendered in array order (later = drawn on top) and revealed once the viewed
 * chapter reaches `revealCh`. The engine holds no route names — every label,
 * color and reveal chapter comes from the work data.
 */
export interface CampaignRoute {
  /** Path key in `WorkMap.routes` (the same key a scene may cite via SceneMapDef.route). */
  key: string;
  /** Stroke color (CSS var or color). */
  color: string;
  /** Viewed chapter from which this route (and its legend line) appears. */
  revealCh: number;
  /** Legend line HTML (ruby / `<b>` allowed). Omit to draw the route without a legend entry. */
  legend?: string;
  /**
   * If set, an animated runner marker + this label travel along the route
   * (hidenaga's 中国大返し dash). At most one route per map should set this.
   */
  runnerLabel?: string;
}

/**
 * One span a province is held for: owned from chapter `from`, and — when `to` is set —
 * no longer owned from chapter `to` onward (`from <= vc < to`). A province held twice
 * lists two spans. Omit `to` for "and never gives it back".
 *
 * The plain-number shorthand covers the common monotone case; spans exist because giving
 * land back is normal in this era (transfer 移封, confiscation 改易) and a map that can
 * only add color says the opposite of what the text says.
 */
export interface TerritorySpan {
  from: number;
  to?: number;
}

/**
 * A territory-coloring phase on the campaign / scene map. As the viewed chapter
 * advances the protagonist's owned territory can change color (hidenaga:
 * Oda gold → Toyotomi indigo at ch4). Phases are ordered by `fromCh`; the engine
 * colors owned territory with the last phase whose `fromCh <= viewCh`, and lists
 * every active phase in the legend. An empty array = no territory coloring.
 */
export interface FactionPhase {
  /** From this viewed chapter onward this phase is active (the first entry is the initial phase). */
  fromCh: number;
  /** Fill color for owned territory in this phase (CSS var or color). */
  color: string;
  /** Legend label for this phase's territory (ruby / plain HTML). */
  legend: string;
}

/**
 * One projected world a map can be staged in. Usually the shared Japan `GEO`, but a scene may name
 * another (`SceneMapDef.geo` → `WorkMap.geos`) when its subject is bigger than the home stage — the
 * Pacific crossing needs Japan AND North America in one frame, which no Japan-scale view can hold.
 */
export interface Geo {
  vb: number[];
  proj: {
    lonmin: number;
    latmax: number;
    k: number;
    s: number;
    /**
     * 1 = this view crosses the antimeridian, so a longitude WEST of `lonmin` is read as its
     * eastward continuation (+360): San Francisco (-122.42) projects to the far side of the Pacific
     * instead of far off the west edge. Leave it off for a view inside one hemisphere — Japan's geo
     * needs Okinawa (127.6°E, west of lonmin=128.6°E) to keep its negative x, and wrapping would
     * fling it a full turn east. Kept as a projection property, not a global rule, because it is a
     * fact about the view's longitude domain: [lonmin, lonmin+360).
     */
    wrap?: number;
  };
  /**
   * Base landmass silhouette in REAL [lon,lat] (each entry = one flat ring
   * [lon,lat,lon,lat,...]), projected at render via `proj`. Drawn UNDER `pref` as a
   * complete land layer so regions with no old-province overlay (Tohoku/Hokkaido/Okinawa)
   * are land, not sea, and so seams between mismatched province polygons reveal land
   * instead of a sea-colored double-line. Generated by scripts/build-japan-coastline.mjs.
   * Optional: a work whose geo has no base silhouette simply omits it.
   */
  land?: number[][];
  /**
   * Inland water in REAL [lon,lat], drawn over `land`: `rivers` are OPEN polylines
   * ([lon,lat,lon,lat,...]), `lakes` are closed rings. Generated by scripts/build-water-lines.mjs.
   *
   * They exist because a silhouette-only stage (an overseas asset with no province overlay) reads
   * as flat land + flat sea — "情報が無さすぎ" (family play 2026-07-22, davinci のイタリア). Japan gets
   * its texture from 令制国; Renaissance Italy has no honest province layer (borders moved yearly —
   * WRITING 地図書法2), and water carries no political claim while being stable over the centuries a
   * work covers. Optional: a geo without them simply draws none.
   */
  rivers?: number[][];
  lakes?: number[][];
  /**
   * Smallest frame width (projected units) a scene on this stage may zoom to. The default floor
   * (392 ≈ 380km on the Japan stage) frames a Japanese scene tightly on purpose — its province
   * overlays give a tight frame plenty to read. A silhouette-only overseas stage has no such
   * texture, so the same floor yields a field of flat land where a child cannot tell which country
   * they are in (family play 2026-07-22, davinci のイタリア). Raising it pulls the camera back until
   * coast, rivers and shape return. Omit to keep the default floor.
   */
  minFrameW?: number;
  /**
   * The [W, E, S, N] degree box `land` was CLIPPED to, when it was clipped — an overseas stage is a
   * slice cut out of a continent, and along that cut the rings are not coastline but the cut itself.
   * A frame that crosses it draws a dead-straight coast through the middle of the picture, so the
   * asset carries the domain it is honest inside and `tests/geo-projection.test.ts` checks every
   * frame against it. Longitudes match `land`'s own convention (unwrapped east for a `wrap` geo).
   * Omitted by an asset that was never clipped (Japan: its rings are real coastline the whole way
   * round, and a frame may run off into open sea harmlessly).
   */
  bounds?: number[];
  /** Old-province (令制国) polygons for territory coloring. `d` is pre-projected px. */
  pref: Record<string, { n: string; c: number; x: number; y: number; d: string }>;
}

export interface WorkMap {
  /** The home stage — the world a scene is drawn in unless it names another via `SceneMapDef.geo`. */
  geo: Geo;
  /**
   * Extra stages this work can put a scene in, by key (see `SceneMapDef.geo`). Optional: a work
   * whose every scene fits the home geo omits it. Keys are the work's own vocabulary; the engine
   * holds no geo names.
   */
  geos?: Record<string, Geo>;
  /**
   * pref id → いつ主人公の領地だったか。数値 = その章から以後ずっと（旧 TERRITORY）、
   * 配列 = 保有区間（返上・改易を描ける）。判定は engine の `ownsAt` に集約する。
   */
  territory: Record<string, number | TerritorySpan[]>;
  /** 章 → その章で主人公の直轄領となる pref id 群。旧 HIDENAGA_DOMAIN。 */
  protagonistDomains: Record<string, (string | number)[]>;
  /** Route paths by key (path `d` only). Cited by campaignRoutes and SceneMapDef.route. 旧 ROUTES。 */
  routes: Record<string, RouteDef>;
  /** Campaign-map route overlays (ordered; later = on top). Empty = no routes drawn. */
  campaignRoutes: CampaignRoute[];
  /** pref id → 地図上ラベル。旧 MAPLABELS。 */
  mapLabels: Record<string, string>;
  /** 手帳「進軍の地図」の足あと点。旧 MAPPOINTS。 */
  mapPoints: MapPoint[];
  /** 地名 → 座標辞書。旧 GAZ。 */
  gaz: Record<string, GazPoint>;
  /** シーン → 地図定義。旧 SCENE_MAPS。 */
  sceneMaps: Record<string, SceneMapDef>;
  /** 章 → 既定の現在地（GAZ キー）。旧 CH_PT。 */
  chapterPoints: Record<string, string>;
  /** 章 → 手帳地図キャプション。旧 capText。 */
  chapterCaptions: Record<string, string>;
  /** Territory-coloring phases (ordered by fromCh). Empty = no territory coloring. */
  factionPhases: FactionPhase[];
}

/* ---------------- 作品文言・家紋 ---------------- */

export interface WorkStrings {
  /** トップバー左のロゴ名。 */
  topbarName: string;
  eyebrow: string;
  /** ruby HTML allowed — the big title/select-card name carries 漢字＋ふりがな. */
  titleMain: string;
  titleSub: string;
  /**
   * 主人公の生没年（西暦）。作品を選ぶ画面とタイトルに出す——「いつの人か」が
   * 分からないまま人を選ばせない（観察メモ 2026-07-25「西暦がわかるようにしたい」）。
   * 生年が確かでない人は、その作品の年表と同じ書き方でぼかす（例「1540ごろ〜1591」）。
   */
  years: string;
  riddleLead: string;
  /**
   * ★6 タイトル「見せてから問う」の誘い文（例「まず、この 顔を タップして みて——」）。
   * 未定義ならエンジン既定文。titleKnownFaces がある作品でのみ使われる。
   */
  titleFacesLead?: string;
  /**
   * ★6 タイトルで主人公の顔（「この人は？」）をタップしたときの返し。
   * 「知ってる顔のすぐそばにいたのに、知らない」の驚きを一言で返し、「はじめる」へ誘う。
   * 未定義ならエンジンが主人公名から汎用文を組み立てる。
   */
  titleHeroTease?: string;
  /**
   * 入口のフック（ruby 可・改行 <br> 可）。**その人を知らない読者が、読む理由を持つための一行**。
   * 謎（riddle）は「なぜ〜なのか」＝すでにその人を知っている読者への問いになりやすく、初見の
   * 小5には遠い（docs/design/engagement.md §2）。ここには通説でも評価でもなく、**知識ゼロで
   * 刺さる具体的な行為**を置く（例「十七で『百姓のくせに』と笑われた」）。未定義なら出さない。
   */
  titleHook?: string;
  /**
   * ★K 信条まわりの見出しで使う主人公名（ruby 可。例「<ruby>秀長<rt>ひでなが</rt></ruby>」）。
   * 未定義なら shortNames[protagonistId] のプレーン表記で代用する。
   */
  protagonistRuby?: string;
  /**
   * ★F 小さい子（小5）向けの"情緒的な縦糸"。抽象的な riddle（なぜ名が残らない？）は
   * 中1に刺さるが小5には枠組みが遠い。具体的で感情に寄せた一言を併走させ、両学年に効かせる。
   * 未定義なら出さない。
   */
  riddleHeart?: string;
  titleNote: string;
  homeTitle: string;
  notebookName: string;
  notebookLead: string;
}

/** 隠しページ（最終章クリアで開放。旧 renderHidden）。 */
export interface Hidden {
  lockedText: string;
  badge: string;
  body: string;
  completeText: string;
  incompleteText: string;
}

/* ---------------- 作品 ---------------- */

/**
 * TRUST BOUNDARY — work data is trusted HTML.
 *
 * Fields marked "ruby HTML allowed" (scene body, card/clue text, protagonistRuby,
 * legend labels, hidden.body, …) are rendered with Svelte `{@html}`; the engine
 * does NOT sanitize or escape them. This is intentional: `<ruby>` furigana markup
 * for 小5/中1 readers is authored by hand and can't survive escaping. The contract
 * is therefore that ALL Work data is trusted, author-controlled HTML.
 *
 * Rule for work authors: never interpolate untrusted / runtime-external input
 * (URLs, user-supplied strings, fetched text) into any Work field. The only
 * reader-supplied string in the app — the save-slot name — is handled by the
 * engine's own dialog UI and never flows back into Work data. Keep it that way:
 * a new work must be a set of static, hand-written data files, nothing dynamic.
 */
export interface Work {
  /** セーブ上の作品の枠のキーでもある（Account.works[id]）。 */
  id: string;
  /** 顔ヒント表示済みフラグの localStorage キー。旧 'hd_facehint'。 */
  faceHintKey: string;
  /**
   * Prefix for one-time UI flag keys in localStorage (stage/scene reveals).
   * Defaults to `id`. Hidenaga keeps its historical 'hd' so existing devices
   * don't replay reveals.
   */
  flagPrefix?: string;
  /** 全章数。旧 TOTAL_CHAPTERS。 */
  totalChapters: number;
  /** 主人公の人物 id。旧 'p-hidenaga' 直書き。 */
  protagonistId: string;
  /**
   * ★A 主人公の「加齢」。章番号(文字列) → 地図の"きみ"に使う顔スペックのキー。
   * 未定義なら常に protagonistId の顔。名前・カードタップは protagonistId のまま、
   * 見た目（faceSvg）だけを章に応じて差し替える（子ども→若武者→大納言→晩年）。
   */
  protagonistFacesByChapter?: Record<string, string>;
  /**
   * ★G 人生ステージの"見せ場"。顔スペックキー → その姿になった瞬間の見出し・ひとこと。
   * protagonistFacesByChapter の顔が前章から変わる章の冒頭で、地図の小さな顔に頼らず
   * 大きく1枚見せる（子ども→若武者→大納言→晩年）。未定義なら演出しない。
   */
  protagonistStages?: Record<string, { title: string; caption: string }>;
  /**
   * ★B 山場の"感情"演出。シーンID → (人物 id → 顔スペックキー)。
   * 指定シーンでだけ地図の顔を差し替える（本能寺で号泣する兄・秀吉 など）。
   * 名前・カードは元の人物 id のまま、見た目（faceSvg）だけを上書きする。
   */
  sceneFaceOverrides?: Record<string, Record<string, string>>;
  /**
   * ★6 タイトル「見せてから問う」：誰もが知る顔の人物 id 列（cards/faces にあること）。
   * 「知ってる顔 → 知らない主人公の顔」の順に並べ、読む前にタップさせる。
   * タップでその人物カードが開く。未定義・空なら顔ならべ自体を出さない。
   */
  titleKnownFaces?: string[];
  /** 家紋 SVG の種別キー（engine/art/icons.ts のレジストリ）。 */
  mon: string;
  /** Crest key for the final-chapter clear screen (e.g. hidenaga's Toyotomi kiri). Falls back to `mon`. */
  finalMon?: string;
  riddle: string;
  story: Story;
  cards: Record<string, Card>;
  clues: Record<string, Clue>;
  timeline: TimelineEntry[];
  faces: Record<string, FaceSpec>;
  /** 人物 id → 地図用略称。旧 SHORT。 */
  shortNames: Record<string, string>;
  /** 顔があるがカードに無い人物の表示名。旧 PEOPLE_EXTRA。 */
  peopleExtra: Record<string, string>;
  map: WorkMap;
  strings: WorkStrings;
  hidden: Hidden;
  /** ★1「きみの◯◯」メーター設定。未定義なら機能オフ。 */
  meters?: MetersConfig;
  /** ★D 人物相関図（表示専用）。未定義なら相関図タブを出さない。 */
  relations?: WorkRelations;
  /** ★R つながり図鑑。未定義なら図鑑タブを出さない（`Scene.observe` と対で使う）。 */
  graph?: WorkGraph;
  /** ★P 人の図（席の図 / 血の縁の図）。未定義なら機能オフ。 */
  figures?: Record<string, Figure>;
  /** ★S 習作ページ（手記）。未定義なら機能オフ（`Scene.study` と対で使う）。 */
  studies?: Record<string, StudyPage>;
}

/** 作品選択画面が Work 本体を読まずに 1 件を描くのに要る最小情報。 */
export interface WorkCard {
  id: string;
  protagonistId: string;
  faces: Record<string, FaceSpec>;
  /** ruby HTML allowed */
  titleMain: string;
  titleSub: string;
  /** 主人公の生没年（西暦）。WorkStrings.years と同じ値。 */
  years: string;
  /** Work.totalChapters と同じ値。作品えらびで「3/7章」を出すため card 側にも要る。 */
  totalChapters: number;
}

/**
 * 作品レジストリの 1 件。本体を `() => Promise<Work>` 越しにしてあるのは、作品ごとに
 * ビルドを分割する余地を契約側に残すため（現在のビルドは単一 HTML なので実際には遅れない）。
 */
export interface WorkEntry {
  card: WorkCard;
  load: () => Promise<Work>;
}
