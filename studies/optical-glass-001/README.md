# Optical Glass — Three.js 静止WebGL試作 001

- 実装: studies/optical-glass-001/scene.js
- 実WebGL確認ページ: https://t-arizuka.github.io/motion-library/studies/optical-glass-001/
- 段階: 静止ビジュアルの品質検証（**未承認**）
- 公開形態: 開発中のGitHub Pagesのみ。最終的な会社Vercelへの移行・納品用収録は行っていない。
- 参考: 2026-11-18の会話で制作した「透明ガラスリボン」のAI生成イメージ。
  **参考画像はThree.jsの出力ではない。** GitHub内のプレビューはCanvasへThree.jsで実描画する別の成果物である。

## 制作目的

4番目のカテゴリ候補「Optical Glass」の適否を判断する。Silkを色違いで増やすのではなく、厚みを持つ光学ガラスという独立した素材カテゴリを目指す。先行したLuminous Linesのチープさを繰り返さないよう、**素材感 > 汎用性 > 編集容易性 > 収録数**を適用。

## 今回のThree.js実装

1. 3つのカーブを基に、表と裏、左右の厚み・端面を持つ自作ジオメトリを生成。2Dの線エフェクトや単なる平面ではない。
2. Three.js MeshPhysicalMaterial で transmission / ior / thickness / attenuationColor / clearcoat を使用。
3. 自前のスタジオ用環境テクスチャを生成し、PMREMGenerator でプリフィルタした反射環境として使用。Bloomは未使用。
4. 深いネイビー背景と、控えめな下部の光の近似表現。光の近似表現は**厳密なレイトレーシング・カオスティクスではない**。
5. PC横長16:9、スマホ390:844の表示比率切り替え。左側に仮キャッチコピーを置いて文字の読みやすさを確認できる。
6. 時間による変化なし。起動時とサイズ切替時だけレンダリングする静止試作。GUIとWordPress書き出しは未実装。
7. Three.jsのバージョンは **0.181.2** で固定。CDNからモジュールを読み込む。インターネット接続が必要。

### 性能に関する設計上の対策（実機計測ではない）

- アニメーションループなし。
- レンダリング画素倍率は min(devicePixelRatio, 1.65)。
- renderer.transmissionResolutionScale = 0.82。
- 軽量化のため曲面の分割数を制限。
- 画像生成したテクスチャは使用せず、反射環境もコード生成。

## 品質判定 — 承認ゲート

- [ ] 反射・屈折・輪郭が硬質ガラスとして自然に見える
- [ ] 透けた面の厚み・重なりに説得力がある
- [ ] 16:9で右側に主役、左側に文字余白が十分
- [ ] スマホ縦長でも美しい
- [ ] 発光線や安っぽい3D帯に見えない
- [ ] スタジオ照明の映り込みが自然
- [ ] Chrome / Safari / 実AndroidまたはiOS端末でGPU描画・負荷を検証した
- [ ] ユーザーからビジュアル品質の承認を得た

**一項目でも重大な品質不足なら不合格。** その場合は静止形状・環境光・材質などの制作方法から見直す。アニメーション、GUI、WordPress埋め込み実装には進まない。

## 現在の検証事実

実施済み:
- GitHubで静止試作ソースと専用プレビューを作成・保存。
- JavaScriptの構文、Three.jsライブラリ参照、物理透明材質、3Dジオメトリ処理、画面比率切り替えの静的構造を確認。

未実施・未確認:
- ユーザーのWindows/Chromeでの実表示。
- この作業環境からCDN上のThree.jsを読み込んだ**実ブラウザのGPUレンダリング・スクリーンショット取得**。作業用コンテナでは外部ネットワークへの接続ができず、ここでは実映像の描画確認ができていない。
- 材質の再現性と美的品質、スマホ端末負荷と透明描画品質。
- 元のAI生成イメージとのビジュアル一致度。

**実装済み ≠ 品質合格、コード検査済み ≠ ブラウザ描画確認済み。**

## 依存・ライセンス

- Three.js: MIT License / Three.js Authors
- 参照: https://threejs.org/docs/pages/MeshPhysicalMaterial / https://threejs.org/docs/pages/WebGLRenderer
- CDN: https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js

## 位置づけ

このディレクトリは研究用。正式ギャラリー（Mesh / Grain / Silk Cascade）と既存WordPress配信エンジンには変更しない。品質を見てから採否を決める。
