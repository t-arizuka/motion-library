# CHANGELOG

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