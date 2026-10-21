# Motion Library

WordPressのメインビジュアル向け抽象アニメーション背景ライブラリ。Mesh Gradient / Grain Gradient の一覧・編集・iframe埋め込み用HTMLを収録します。

## 現状

- 008版の**試験用ソース**。描画品質の実GPU検証、実際のWordPressクラシックエディタへの設置、公開URLでの動作は**未検証**です。
- リポジトリは **Private** です。デプロイ先は未決定で、Netlify / Vercel / Railway 等の静的ホスティングを検討します。
- WordPress専用プラグイン不要。背景はiframe、文字・ボタンはWordPress側のHTMLで編集します。ただしiframeを許可する権限・テーマ側の位置調整が必要です。
- アニメーションは外部CDNの `@paper-design/shaders@0.0.78` に依存し、WebGL2対応ブラウザが必要です。シェーダー自体は同梱していません。

## ファイル

- `index.html` — アニメーション一覧
- `editor.html?template=mesh` / `?template=grain` — 編集画面
- `src/app.js`, `src/style.css` — ソースコード
- `embed/v1/index.html` — WordPress用背景レンダラー（バージョン固定）
- `open.html`, `edit.html` — 単体HTML版
- `WP_CLASSIC_TEST_CHECKLIST.md` — WordPress確認項目
- `LICENSE_NOTES.md` — 外部シェーダーのライセンス

## 公開・検証

配信前に必ず実ブラウザでWebGL描画、設定反映、iframe重ね表示、クラシックエディタ保存後のHTML維持、スマホ表示を検証してください。公開されたJavaScriptはブラウザから取得可能です。ソースのGitHubリポジトリがPrivateでも、**配信したフロントエンドコードが秘密になるわけではありません**。

公開先を決めてから公開設定を行います。誤配信防止のため、本リポジトリにはデプロイ設定や認証情報を含めません。
