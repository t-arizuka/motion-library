# CHANGELOG

## Silk Study 001.2 — Shader-specific GUI controls (2026-10-22)
- 既存Mesh/Grainと同じ編集パネル内に、Silk専用のカラー・素材調整を追加。
- Cascade: 奥/中/手前/背景の4色・光沢・布の重なり。Groove: 暗部/ゴールド/ハイライトの3色・ひだの深さ・光沢。
- GLSL uniformを更新し、入力時だけ静止WebGLを再描画。色変更でも陰影を維持する方式を採用。
- 作品別の編集値を保持し、大きいプレビューにも設定を引き継ぐ。速度やWordPress書き出しは未実装。
- WebGLモックによる受信値・再描画・同一オリジン制限は検査済み。実GPUによる画質判定は未実施。

## Silk Study 001.1 — Approved editor UI alignment (2026-10-22)
- Silk静止検証ページのUIを、承認済みMesh/Grain編集画面の共通CSS・ヘッダー・左右2カラム・操作系に統一。
- 作品の切り替え、PC/スマホ、文字表示/白黒、初期化、大きいプレビューを実装し操作ロジックを確認。
- 原作WebGLシェーダー、正式ギャラリー、WordPress用生成機能は変更なし。
- 実WebGL描画の品質検証とユーザー承認は引き続き保留。

## Silk Material Study 001 — Independent visual quality gate (2026-10-22)
- Radiant MIT sourceからSilk Cascade（優先）/Silk Groove（比較）の静止WebGL検証ページを追加。
- `studies/silk-material-001/` 内だけで、PC/スマホの画面比率と文字色の切り替えを比較可能にした。
- 原作の配色・材質の計算は保持、時間を固定し、ラベル・マウス操作・連続描画を停止。
- MIT LICENSE同梱。デザイン仕様・正式採用後の編集GUI・WordPress用レンダラー案は専用READMEに記録。
- **正式ギャラリーと既存embed/v1は変更していない。実GPU描画の品質承認は未取得。**

## 013 — Simplified WordPress export UI (2026-10-22)
- WordPress用HTMLの書き出し画面を整理。MVセット/背景のみの出力形式、配信元URL、現在の出力サイズと背景名を分かりやすく表示。
- コードコピーを主ボタンへ。長いHTMLコードは折りたたみ「生成コードを見る」の中へ移動。コード本体は変更なし。
- 「重ね表示をテスト」は、012で追加した「実寸プレビュー」に統一。出力形式に応じて文字表示を切り替える。
- github.io URLにユーザー名が含まれる旨の注意は維持。独自ドメイン等の実配信先がなければ個人名は解消しない。
- 生成ロジック・既存iframeレンダラー・アニメーション本体は変更なし。WordPress実サイト検証は未実施。

## 012 — Actual-size preview in a separate tab (2026-10-22)
- 「表示サイズ」に「実寸プレビュー」ボタンを追加。設定・配色を別タブへ引き継ぐ。
- `preview.html` は固定レンダラー `embed/v1/index.html` をiframeで使用し、WordPressと同じ「幅100%または上限px」「高さclamp(320px,70vh,設定上限)」を再現。
- プレビュー画面で実際のCSS pxを計測して表示。文字の表示切替と「設定した最大高さで確認」を追加。
- 最大高さの直接表示モードはWordPressの標準埋め込みとは異なるため、画面内で明確に区別。
- 編集画面の従来プレビュー・WordPress出力・描画シェーダーは変更せず。GitHub Pagesでの実描画検証は要確認。

## 011 — Default maximum width 100% (2026-10-22)
- 最大幅は標準で100%。必要なときだけpx指定に切り替えられるUIへ変更。
- WordPress出力HTMLのmax-widthも標準で100%。PC/スマホのレスポンシブ動作を維持。
- 010版の既存ブラウザ保存設定を移行。旧初期値の1440pxは100%に置き換え、明示的な他のpx値は保持。
- 高さは70vh基準・上限760pxを推奨初期値として維持。プレビュー上限はPC770px、タブレット540px、スマホ320pxのまま。
- 固定レンダラーには変更なし。実GPU表示とWordPress実サイトは別途検証が必要。

## 010 — Delivery URL clarity and sizing (2026-10-22)
- WordPressコードには公開URLが含まれることを明示し、GitHub Pages個人アカウントURLは社内テスト向けと注意を追加。
- 納品用は独自ドメイン等へ変更可能（単にURL文字列を隠す処理は行わない）。
- 最大幅/高さ（px）を簡易編集。WordPress HTML、プレビュー、重ね表示テスト、保存/復元に反映。
- Paper Shadersの固定レンダラー・既存配色プリセットは変更なし。実WordPress表示は未検証。

## 009 — Collapsed color presets (2026-10-21)
- Mesh GradientとGrain Gradientの編集画面に、各5色セットのカラープリセットを追加。
- 初期表示ではプリセット欄を閉じ、開いたときだけ一覧表示。
- 配色だけを切り替え、速度・動き・詳細調整は維持。HEX入力やWordPressコード出力にも反映。
- 公開先での実WebGL表示と画面操作はレビュー時に要確認。

## 008.1 — Public-facing footer cleanup (2026-10-21)
- 一覧・編集ページのフッターから「Paper Shaders ↗」への外部リンクを削除（通常版・単独HTML版）。
- `LICENSE_NOTES.md` 内の第三者ライブラリとライセンス情報は維持。
- 描画エンジン、編集操作、iframeレンダラーは変更なし。

## 008 — GitHub Pages packaging (2026-10-21)
- 007の一覧・編集・配色UIを維持。
- 生成するiframeのレンダラーを`embed/v1/index.html`へ固定（将来バージョン互換性用）。
- GitHub Pagesの公開URLを誤入力しないため、`github.com`と`raw.githubusercontent.com`を弾く。`index.html`等のURL入力はディレクトリに正規化。
- 配置確認用のWordPress HTMLサンプルと、公開手順・検証項目を追加。
- **GitHub実公開とWordPress実機テストはまだ実施していない。**