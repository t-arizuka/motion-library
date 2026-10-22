# Motion Library

WordPressのメインビジュアル向け抽象WebGLアニメーション背景ライブラリ。
現在の収録作品：**Mesh Gradient / Grain Gradient / Silk Cascade**（3種類）。

## 現状（2026-10-22）

- 開発・レビューの公開先：**GitHub Pages**、リポジトリは**Public**。Vercelへの移行は会社の承認待ちのため行わない。
- **Silk Cascadeの静止ビジュアルとアニメーション品質はユーザーが承認済み**。正式エディタとWordPress出力機能を追加済み。
- ブラウザ上の最終WebGL表示・実際のWordPressクラシックエディタでの設置・保存・スマホ表示は**この実装作業からは未検証**。納品品質の運用検証は別途必要。
- 背景はiframe、文字とボタンはWordPress側の通常HTMLで編集。WordPressがiframeを許可する権限・設定であることが必要。

## 入口

- [ギャラリー](https://t-arizuka.github.io/motion-library/)
- [Mesh Gradient エディタ](https://t-arizuka.github.io/motion-library/editor.html?template=mesh)
- [Grain Gradient エディタ](https://t-arizuka.github.io/motion-library/editor.html?template=grain)
- [Silk Cascade エディタ](https://t-arizuka.github.io/motion-library/silk.html)
- [Silk Cascade / Silk Groove 比較研究](https://t-arizuka.github.io/motion-library/studies/silk-material-001/)

## ファイル

- `index.html` — 正式ギャラリー（3作品）
- `editor.html`, `src/app.js`, `src/style.css` — Mesh / Grainの既存エディタと共通スタイル
- `silk.html` — Silk Cascadeの正式編集画面。同じヘッダー・2カラム・HTML書き出しUI。
- `embed/v1/index.html` — Mesh / Grain用の互換性維持レンダラー。**既存仕様は変更しない。**
- `embed/silk/v1/index.html` — Silk Cascade用のバージョン固定レンダラー。設定を検証しiframe描画。
- `embed/silk/v1/shader.html` — 配信版SilkのWebGLシェーダー。原作Radiant（MIT）を改変。
- `embed/silk/v1/LICENSE-RADIANT.txt` — Silkの上流MITライセンス。
- `WP_CLASSIC_TEST_CHECKLIST.md` — WordPress現場検証手順
- `LICENSE_NOTES.md` — 外部ライブラリと著作権表記

## Silk CascadeのWordPress利用

1. `silk.html` を開き、4色の布と背景、光沢、重なり、速度、揺れ幅、なめらかさを調整。
2. 表示サイズは標準で幅100%・高さ最大760px（CSS `clamp(320px,70vh,760px)`）。必要なら幅320〜2560px・高さ360〜1200pxを指定。
3. 「WordPress用HTMLを取得」を開き、「MVセット」または「背景のみ」を選択。公開HTTPSの配信元URLを確認。
4. 「WordPress用HTMLをコピー」→ クラシックエディタの「テキスト」タブに貼り付け。WordPressの保存後もiframeが残るか必ず確認。
5. 原作のライセンスは `embed/silk/v1/LICENSE-RADIANT.txt` を同梱。正式運用時も保持。

Silk Cascadeの設定は `schemaVersion:1` + `template:"silk-cascade"` + `settings:{colors,material,motion}` でベース64URL符号化され、バージョン固定レンダラーに渡されます。レンダラーは数値・カラーを検証し、無効な設定を拒否します。編集プレビューとWordPress表示は同じ原理の描画ですが、サイズや配信先が異なるため最終の実画面確認が必要です。

## 公開・運用上の注意

- GitHub Pagesを開発用として継続。個人名を含む `.github.io` のURLが出力コードに入ります。将来Vercel等へ移す場合は出力ダイアログで配信先を変更し、レンダラーのファイル一式を同じ構成で配信してください。
- `@paper-design/shaders@0.0.78` はMesh/Grainでのみ使用。**Silk Cascadeは自己完結WebGLで追加ライブラリを読み込まない。**
- iframe配信先がCSP・セキュリティプラグイン・広告ブロック等によりブロックされないか確認。
- 公開するフロントエンドJavaScriptは利用者から読めます。GitHubをPrivateにしても配信コードは隠せません。

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
