# CHANGELOG

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