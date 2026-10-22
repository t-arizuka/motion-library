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

## 配信URLと表示サイズ（010）

WordPressへ出力するiframeのURLには公開配信元が含まれます。GitHub Pagesのユーザー名を文字列だけ隠すことはできません。納品時は独自ドメイン等のHTTPS公開URLへ切り替えてください。GitHub Pages自体にも独自ドメインを設定できます。公開したJavaScriptから配信元・コードが見える点には注意が必要です。

編集画面で「最大幅（320〜2560px）」と「最大高さ（360〜1200px）」を指定できます。HTMLは`max-width`と`height:clamp(320px,70vh,最大高さ)`を出力し、画面幅に応じて縮みます。配色・速度は従来どおり。JSONには`layout`を追加し、旧ファイルにも互換性を維持しています。

## 011 幅100%の初期設定

最大幅は初期値 `100%`。編集ページの「最大幅」で「px指定」を選んだ場合のみ320〜2560pxで制限できます。最大高さは初期760px（`height: clamp(320px,70vh,760px)`）。表示プレビューはUI内に収めるため高さが別制限（PC最大770px、780px以下最大540px、430px以下320px）です。従来のJSON設定で`maxWidth:1440`の場合は明示的な固定幅として読み込みます。ブラウザの010版のデフォルト保存（1440px）に限り、新初期値100%へ移行します。

## 012 — 実寸プレビュー

編集画面の「表示サイズ」にある「実寸プレビュー」から別タブで `preview.html` を開きます。背景は本番と同じ `embed/v1/index.html` で描画し、画面幅・最大幅・画面高70%および最大高さのCSS指定を再現します。表示サイズはCSS pxで実測表示します。

「設定した最大高さで確認」をONにすると、表示高が画面高の70%ではなく設定値そのものになります。1200pxなどの縦長表示を点検するための機能であり、WordPress出力とは異なります。実際のWordPress側の親コンテナ幅・テーマCSSによる差は生じます。

## 013 — WordPress出力画面

編集画面の「WordPress用HTMLを取得」から「MVセット／背景のみ」を選び、公開HTTPSの配信URLと出力サイズを確認したうえで「WordPress用HTMLをコピー」を実行します。生成コードは「生成コードを見る」で展開するまで非表示です。実寸プレビューも同じ画面から開けます。HTMLコード自体は012版と同一の方式（WordPress側のHTML要素とiframe背景）です。
