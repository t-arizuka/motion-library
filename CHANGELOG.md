# CHANGELOG

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