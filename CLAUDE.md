# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

歴史人物の一生を「なりきって」遊ぶ小5・中1向けインタラクティブ教材集（Svelte 5 + Vite + TypeScript）。第1作は豊臣秀長で、以後 作品を増やしている。ビルド成果物を GitHub Pages で配信する。作品一覧・共通装置の概要は README.md、大目標は docs/VISION.md を参照。

## 自律開発

このリポジトリは AI（Claude Code）による自律開発を前提に運用する。判断の拠り所は次の順:

- `docs/VISION.md` — 憲法（大目標・設計原則・アンチゴール・役割分担）。**AI は改訂しない**（改訂案の提案まで）
- `docs/CRITERIA.md` — マージ可否の評価ルーブリック。コンテンツ変更は `/eval-work` で評価する
- `docs/WRITING.md` — 執筆規律（シーンの書法と体験予算）。コンテンツ執筆はこれに従う。予算は `tests/style-budget.test.ts` が機械検査する
- `docs/BACKLOG.md` — タスク待ち行列。自律サイクルは `/auto-dev` で回す（1サイクル1タスク）
- `docs/JOURNAL.md` — セッション間の申し送り帳（**AI→AI 専用**）。自律セッションの最後に追記する
- `docs/REVIEW.md` — 人間が週1レビューで読む唯一の面。ループが毎サイクル上書き集約する。人間宛のお願いを JOURNAL/BACKLOG に細粒度で散らさず、ここ1枚に畳む

ガードレール（**単一ゲート原則**）: 無人の自律開発ループで運用する。**ループの途中に人間の判断は入らない。** 人間の判断は **main の commit 群を upstream に push（＝デプロイ）するか否か**の1点だけ。ゆえに AI は「判断待ち」で止めず、自律に決めて commit まで進める（push はしない）。

作業は **main で直接行う（feature ブランチは作らない）**。AI が自律で越えない**ハード境界**は次の3つだけ（＝判断ゲートではなく固定制約。該当タスクは AI が実装せず、**ループを止めずに**他の着手可能タスクへ進む。人間が push 前レビューで最終確認する）: ①**セーブ互換・セーブスキーマを壊す変更**（`rekishi_play_account_v1`。家族の実セーブを守る非可逆リスク） ②**VISION / CRITERIA 本文の改訂**（AI は改訂案を提案するまで） ③**体験予算の緩和**（`docs/WRITING.md` の予算表・`tests/style-budget.test.ts` のしきい値と EXEMPT リストを緩める変更。厳格化・計測追加は自律で可）。

**課題は型で直す**（場当たり禁止・2026-08-01 人間指示）: 指摘を1件ずつ潰さない。**同じ型が他の章・他の作品にも無いかを数えてから**、直す場所を選ぶ（データ／規律／エンジン／**計器**）。**成果物だけ直して計器を直さないのは禁止**。

**AI が新たに作る停止条件は、AI が自力で解除できるものに限る**（人間の入力を待つ停止は上の3つだけ）。ゲートの厳格化・テスト追加は自律で可＝どれも AI が直せるから。**⛔ の内容をスキル・テストへ「先行導入」しない**（書く場所を変えても改訂は改訂）。

### 規則の在り処（規則は1か所にだけ書く）

**運用規則はこの節が唯一の真実**。憲法＝VISION／評価基準＝CRITERIA／執筆規律＝WRITING／運用規則＝ここ。**`.claude/skills/*/SKILL.md` は手順（どうやるか・モデル選択・技法）だけを書き、規則を再掲しない**——参照する。規則の経緯・理由は git と JOURNAL に置く（規則本文に書かない＝**ルールは短く**）。

## コマンド

- コミット前に必ず通す: `npm run check`（svelte-check）と `npm test`（vitest）
- `npm run verify` — build ＋ 全テスト（build は `dist/` を生成）
- ビジュアル確認（`src/engine/art/`・`src/engine/map/`・`faces.ts`・`map.ts` のシーン地図・story の closeup/figure を新規執筆・変更したら実行して目視する。描画の破綻も「初見の子どもに伝わらない絵」も型チェック・テストでは検知できない）:
  - `npx vite-node scripts/render-faces.ts <出力ディレクトリ>` — 全人物の似顔絵コンタクトシート
  - `npx vite-node scripts/render-scene.ts <出力.svg> [章] [シーンid]` — シーンのメインビジュアル（closeup があれば対面の場、なければ読み解き地図）。例: `... /tmp/scene.svg 7 7-a2`
  - `npx vite-node scripts/visual-coverage.ts [作品slug]` — 全シーンの主ビジュアル在庫レポート（フォールバック地図のまま＝未執筆のシーンを可視化。fail はしない。完成作品の回帰は `tests/visual-coverage.test.ts` が担保）
- `npx vite-node scripts/ruby-audit.ts [作品slug]` — ふりがなの棚卸し（面ごとの未ルビ初出を抜粋つきで列挙）。ゲート＝`tests/ruby-furigana.test.ts`（新章・新作品は 0 件）
- `npx vite-node scripts/premise-audit.ts [作品slug]` — 前提知識の棚卸し（既知前提マーカーと反転型 spark の列挙）。ゲート＝`tests/known-premise.test.ts`（新章・新作品は 0 件）

## アーキテクチャ上の制約

- **配信の契約**（`tests/deploy-contract.test.ts`）: 制約は①**base path 非依存**（`base: './'`。サブパスでもドメイン直下でも動く）②**外部リソース読込ゼロ**の2つだけ。実装はチャンク分割ビルド（`dist/index.html` ＋ `dist/assets/*`）＝**単一ファイルは要件ではない**（経緯は JOURNAL）。名前入力・削除確認はブラウザの `prompt`/`confirm`/`alert` を使わず自前ダイアログ UI（`src/engine/dialog.svelte.ts`）で行う。
- **エンジンと作品データの分離**: `src/engine/` は汎用エンジンで、作品固有の定数（章数・主人公 ID 等）をハードコードしない。作品固有データは `src/works/hidenaga/`。両者の契約は `src/engine/types.ts` の `Work` / `WorkEntry` 型。作品追加は「`src/works/<作品>/` を追加 ＋ 登録先2つに1件ずつ」——`registry.ts`（アプリの入口＝軽量 `card` ＋ 遅延 `load()`）と `index.ts` の `WORKS`（ツール・ゲート用）。ズレは `tests/work-registry.test.ts` が落とす。
- **作品データは信頼済み HTML（`{@html}` の信頼境界）**: シーン本文・カード/手がかりテキスト・`protagonistRuby`・凡例ラベル・`hidden.body` 等（`Work` 型で「ruby HTML allowed」と注記した欄）は `{@html}` で描画し、エンジンは無害化しない。小5・中1 向けの `<ruby>` ふりがなはエスケープに耐えないための意図的契約。ゆえに**作品オーサーは Work データに信頼できない/実行時外部入力（URL・ユーザー文字列・fetch したテキスト）を混ぜてはならない**——新作品は静的な手書きデータファイルの集合に留める。読者由来の唯一の文字列（セーブ枠の名前）はエンジン側のダイアログ UI が扱い、Work データには還流しない。詳細は `src/engine/types.ts` の `Work` 型ヘッダ。
- **Svelte 5 runes ストア**: ストアは `.svelte.ts` のクラスで、`App.svelte` が生成し context（`engine/stores.ts` の `setStores`/`useStores`）で配布する。runes（`$state` 等）を使うモジュールは `.svelte.ts` 拡張子が必須。
- **`$state` プロキシの罠**: 生オブジェクトを `$state` 配下に代入したら、以後は必ずプロキシから読み直す。`(obj[key] ??= [])` パターンは壊れる。この不具合はブラウザでのみ再現し、vitest（node 環境）では検知できない。詳細は `src/engine/save.svelte.ts` のコメント。
- **セーブは作品横断の1アカウント**: キーは `rekishi_play_account_v1` の1本。名前・ふりがな・昼夜は `Account`（App の `AccountStore`）、進みぐあいは `Account.works[work.id]`（`SaveStore` はその枠を見る窓）。`$effect` 自動保存はせず、明示的に `persist()` を呼ぶ。

## データの由来（手編集の可否）

`src/works/*/` の全データファイル（cards・clues・timeline・faces・story・map 等）と `src/shared/geoJapan.ts` は**手書き管理**（編集してよい）——新作品も同じ、静的な手書きデータの集合。第1作 hidenaga は旧 vanilla 実装からの逐語抽出が起源だが、抽出パイプラインも `legacy/` 系統も撤去済み（家紋等の黄金基準は `tests/__snapshots__/engine-parity.test.ts.snap` へ置換）。経緯は git / JOURNAL-archive。

## 規約

- コミットメッセージは英語1行で書く（過去の日本語コミットには合わせない）。過去コミットの `★A`〜`★O` マーカーは廃止済みで、新規コミットには付けない
- コードコメントは英語で書く（過去の日本語コメントには合わせない。既存コメントの一括翻訳は不要だが、編集した箇所のコメントは英語に置き換える）
- 教材コンテンツ（シーン本文・UI 文言・カードのテキスト等）は日本語のまま
- `dist/` はコミットしない（.gitignore 済み）
- シーン本文はふりがな（`<ruby>`）付き HTML。対象読者は小5・中1
- 公開は main への push で GitHub Actions（`.github/workflows/deploy.yml`）が build して GitHub Pages に自動デプロイする（配信 URL は固定なので localStorage セーブは引き継がれる）
