# Silk Material Study 001 — 品質検証・実装設計

更新日: 2026-10-22
状態: **静止ビジュアルの実装済み／品質承認待ち**（正式ライブラリ未収録）

## 1. 方針と優先順位
第一候補 **Silk Cascade**、比較対象 **Silk Groove**。
Mesh Gradient / Grain Gradient にない「布の陰影・反射・半透明の重なり」を主な採用理由とする。
**ビジュアル品質 > 汎用性 > 操作の簡単さ > テンプレート数。**

## 2. 今回実装したこと（静止ビジュアル検証）
- `index.html` に2作品の切り替え、PC/スマホ比率、白文字・黒文字・文字なしの表示切替を実装。
- WebGLの実シェーダー描画を埋め込む（画像生成した参考図ではない）。
- Radiant原作の色と照明/布のシェーディングを保持し、時間値だけ0に固定。ラベルとマウスインタラクションを無効化。
- 常時アニメーションループを停止。サイズ変更時は再描画する静止検証版。
- ギャラリー本体・WordPress埋め込み・`embed/v1` は変更していない。
- MITライセンスの原文を同梱した。

プレビュー: https://t-arizuka.github.io/motion-library/studies/silk-material-001/

### 原作とライセンス
Radiant (MIT); Copyright (c) 2025 Paul Bakaus.
- Original Cascade: https://github.com/pbakaus/radiant/blob/main/static/silk-cascade.html
- Original Groove: https://github.com/pbakaus/radiant/blob/main/static/silk-groove.html
- Official collection: https://radiant-shaders.com
- ライセンスの同梱: `LICENSE-RADIANT.txt`
- 参照元ファイルのGit blob SHA:
  - Cascade: `70741edbdff44f8d9af20a25d82be8fdb53ce2f5`
  - Groove: `59603820d5ebf6cda0ac316211a37962d16dca9c`

## 3. 比較基準と合格ゲート
| 観点 | Silk Cascade | Silk Groove | 判定 |
| --- | --- | --- | --- |
| 布としての陰影 | 層状＋異方性反射 | リボン状＋鏡面反射 | 未評価 |
| 文字の読みやすさ | 白/黒文字を重ねて目視 | 同条件 | 未評価 |
| 素材の説得力 | 薄い層の重なり・奥行き | 折り目と反射の連続性 | 未評価 |
| 独創性・汎用性 | 既存Mesh/Grainとの差別化 | 同左 | 未評価 |
| スマホ構図 | 390 × 844相当 | 同左 | 未評価 |
| PC構図 | 1920 × 1080相当 | 同左 | 未評価 |

ユーザーが「素材の説得力が弱い」「安っぽい」「文字を重ねづらい」と評価した作品は不合格とし、アニメーション実装へ進めない。

## 4. 正式採用後の編集機能案（現時点では未実装）
### Silk Cascade
**基本UI:** 
- 3つの布レイヤーの色＋背景色（計4色）を個別編集
- 動きの速度（原作: `FLOW_SPEED`, 0.1–1.5、初期0.4）
- 光沢の強さ（原作: `SHEEN_INTENSITY`, 0.3–2.0、初期1.0）

**詳細UI（初期は閉じる）:**
- 重なりの透明度・陰影差・文字可読性を補助する明るさ
- 素材の形を崩さない範囲のゆっくりした揺れ
- 必要ならプリセット4〜5種類、初期閉じ

### Silk Groove
**基本UI:**
- 背景・布地・照明の配色（実装前にシェーダーへの色の渡し方を設計）
- 動きの速度（原作: `FLOW_SPEED`, 0.2–2.0、初期0.8）
- ひだの強さ（実シェーダー: `FOLD_DEPTH`、初期1.0）

**重要な実装注意:** Radiantのメタデータ上は `WAVE_AMPLITUDE` と表示されているが、公開HTMLのメッセージ受信は `FOLD_DEPTH`。現段階では公開HTMLを正とし、GUIとの接続時に実際の動作を検証する。

### 共通UI
- 最大幅: **100% 初期値**（必要に応じてpx指定）
- 最大高さ: **760px 初期値**、画面高70%基準
- 実寸プレビュー（PC・スマホ表示）／白・黒文字の表示確認
- カラープリセットは初期閉じ、リセット、JSON入出力
- WordPressクラシックエディタ向けコードをコピー

**色編集はGLSL側の変更が必要。** Radiant原作に多数の色定数が埋め込まれているため、CSS色相フィルターでは「各色の個別指定」と同等にならない。元の反射・影の美しさを保つGLSL uniform設計と、その都度の視覚品質検証が必要。

## 5. 採用後の実装構造案
- 既存 `embed/v1/index.html` は変更せず、従来Mesh/Grainの互換性を維持。
- 新しいシルク系は `embed/v2` などバージョン管理された独立レンダラーへ。
- Radiant由来の自己完結型WebGLは、無理にThree.jsへ書き換えず、独立iframe・postMessageの制御インターフェイスを検討。
- アニメーションの再開/停止、画面外停止、prefers-reduced-motion、デバイスpixel ratio、コンテキストロス回復、色変更を検証。
- WordPress側にはレンダラーをiframeで読み込み、文字・ボタンはWordPressのHTMLとして別レイヤーに置く。
- Vercel移行は保留。今はGitHub Pagesの検証専用ディレクトリで開発。

## 6. 検証状況と未解決事項
確認済み:
- 上流のソースコード（Cascade / Groove）とMITライセンスを取得。
- GitHubへ独立した静止WebGL検証ページとライセンスを保存。
- コード構造・HTML/JavaScript構文・静止状態用の変更点は静的確認。

未実施／未確認:
- 当環境からGitHub Pages上の **実GPU描画・スクリーンショット** の取得。
- 実機PC/スマホでのGLSLコンパイル・描画品質・端末負荷計測。
- 文字可読性と色変更後の視覚品質評価。
- 本番アニメーション／GUI色編集／WordPress用コード生成への接続。
- ユーザーの静止ビジュアル品質承認。

**品質承認を受ける前に、上記未実装段階へ進めない。**
