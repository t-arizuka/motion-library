# Silk Material Study 001 — 品質検証・実装設計

更新日: 2026-10-22
状態: **静止ビジュアルの実装済み／品質承認待ち**（正式ライブラリ未収録）

## 1. 方針と優先順位
第一候補 **Silk Cascade**、比較対象 **Silk Groove**。
Mesh Gradient / Grain Gradient にない「布の陰影・反射・半透明の重なり」を主な採用理由とする。
**ビジュアル品質 > 汎用性 > 操作の簡単さ > テンプレート数。**

## 2. 今回実装したこと（静止ビジュアル検証）
- **001.2 素材調整GUI:** 作品ごとに適切な色と素材のスライダーを追加し、GLSLのuniformを実際に変更して静止WebGLを再描画。Cascadeは4色・光沢・布の重なり、Grooveは3色・ひだの深さ・光沢。作品を切り替えても調整値を保持し、大きいプレビューにも引き継ぐ。
- **001.1 UI統一:** 現行エディタの `../../src/style.css` を参照し、メインプレビュー＋右操作パネル・PC/スマホ・文字ON/OFF・白黒・初期化・大きく確認を同じデザインで実装。内部品質検証版のためアニメーション・WordPress書き出しは未搭載。
- `index.html` に2作品の切り替え、PC/スマホ比率、白文字・黒文字・文字なしの表示切替を実装。
- WebGLの実シェーダー描画を埋め込む（画像生成した参考図ではない）。
- Radiant原作の照明/布のシェーディングを基礎に、色と反射/ひだ/重なりのuniformを追加し、時間値は0に固定。ラベルとマウスインタラクションを無効化。
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

## 4. 調整GUIの実装状況と次の段階
### Silk Cascade（静止検証版で実装済み）
- 4色: **奥のシルク／中間のシルク／手前のシルク／背景**
- 光沢の強さ: `SHEEN_INTENSITY` 相当（0.3〜2.0、初期1.0）
- 布の重なり: `u_layerOpacity`（0.55〜1.35、初期1.0）

### Silk Groove（静止検証版で実装済み）
- 3色: **布の暗部／布のゴールド／ハイライト**
- ひだの深さ: `FOLD_DEPTH`（0.5〜1.6、初期1.0）。陰影の変化を確かにするため、法線方向にも強さを反映。
- 光沢の強さ: `u_gloss`（0.3〜1.8、初期1.0）

### 共通の実装済み項目
- 色選択、HEX入力、スライダー、作品ごとの設定保持、現在の作品だけ初期化。
- PC/スマホ、白文字/黒文字、文字ON/OFF、大きいプレビューへの設定引き継ぎ。
- 各調整は `motion-silk-study-settings` メッセージで子iframeに送信。子は親window・同一オリジン・入力形式と範囲を検証し、必要な1フレームだけ再描画。
- 原作に埋め込まれた色定数をGLSL uniform経由で調整しており、CSS色相フィルターは使用しない。

### 静止ビジュアルの品質承認後
- 動きの速度: Cascade `FLOW_SPEED` 0.1–1.5（原作初期0.4）／Groove `FLOW_SPEED` 0.2–2.0（原作初期0.8）
- プリセット、JSON設定保存・読込、最大幅100%・最大高さ760px、実寸プレビュー、WordPress用コード生成。
- 今回の色・反射・ひだの調整が複数配色で美しく成立するかの実機検証。

**実装注意:** RadiantのSilk Grooveメタデータには `WAVE_AMPLITUDE` とあるが、公開HTMLの制御名は `FOLD_DEPTH`。本検証版は公開シェーダーのGLSL変数 `u_foldDepth` を使用した。

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
- モックWebGLを用いてCascade/Groove両方の色・マテリアルuniformの転送・1回の再描画・外部オリジンからの変更拒否を検証。

未実施／未確認:
- 当環境からGitHub Pages上の **実GPU描画・スクリーンショット** の取得。
- 実機PC/スマホでのGLSLコンパイル・描画品質・端末負荷計測。
- 文字可読性と色変更後の視覚品質評価。
- 本番アニメーション／WordPress用コード生成への接続。
- ユーザーの静止ビジュアル品質承認。

**品質承認を受ける前に、上記未実装段階へ進めない。**
