# HANDOFF.md — 防犯ラボ 完全版引き継ぎ

更新日: 2026-10-14 JST

このファイルは、防犯ラボの次セッション開始用の引き継ぎです。
現在状態の正本は GitHub の current code / PR / Actions / Commit です。
このファイルは「次に何を確認して、どこから再開するか」をまとめる目的で使います。

## 1. Project

- Repository: `oosaka0123-sudo/bouhan-lab`
- Production: `https://bouhan.rss7.net/`
- Deploy bridge: `oosaka0123-sudo/web-de-nandemo-dekiru`
- Master: `oosaka0123-sudo/ai-master`

起動時は以下の順で確認する。

1. `ai-master/README.md`
2. `ai-master/AGENTS.md`
3. `ai-master/CONNECT.md`
4. `ai-master/PROJECTS.md`
5. `bouhan-lab/README.md`
6. Open PR / Latest Actions / current code
7. この `HANDOFF.md`

## 2. 現在の重要方針

防犯ラボは、訪問者に「どの商品を選べばよいか」を分かりやすくする比較メディアとして設計する。

主要導線:

カテゴリ / 比較ページ
→ 防犯ラボ内の商品詳細ページ
→ 購入モールへ送客

メーカー公式ページは仕様確認の出典として使い、購入導線の主リンクにはしない。
理由は、メーカー公式ページ内にAmazon / 楽天等の別モール導線が存在する場合があり、防犯ラボ側で設計した収益導線が分散するため。

実機未検証の商品について、実機レビュー表現は禁止。
メーカー公表仕様と確認済み公開情報に基づく比較として明示する。

## 3. 防犯カメラ比較ページ

Production URL:

`https://bouhan.rss7.net/security-camera-compare.html`

PR #3:
`Redesign camera comparison for 3 or 5 products`

Merge SHA:
`9d43742ee1e146bfebf60051c2d0dd6f70c48f22`

Deploy run:
`38111229679`

Deploy result:
SUCCESS

### 採用した比較設計

ChatGPT・Claude・Gemini 3.1 Pro High（Antigravity CLI経由）でクロスチェック済み。

3者統合の結論:

- 最初は3商品を表示
- 必要な人だけ「さらに2機種を比較する」
- 最大5商品まで同じ比較テンプレートで対応
- 順位付けではなく用途別で選ばせる
- モバイルは比較表の横スクロールを前提にする
- 比較項目を重要項目へ絞る
- 実機レビューと誤解されない表記を入れる
- 商品詳細ページと購入CTAは次工程

### 現在の5候補

標準表示3商品:

1. Tapo C530WS — 高画質・広範囲
2. Tapo C425 — 配線不要
3. Kashimura KJ-200 — シンプル導入

追加比較2商品:

4. Tapo C520WS — 2Kバランス型
5. Tapo C500 — ベーシック型

### 比較項目

- 電源
- 画質
- 夜間撮影
- 撮影範囲
- 防水・防塵
- 録画
- 向いている人

価格は変動が大きいため、比較ページの固定値として主軸にしない。
価格・購入導線は商品詳細ページ側で扱う方針。

## 4. ValueCommerce / Yahoo!ショッピング

ValueCommerce LinkSwitchの基盤は実装済み。

`bouhan-lab` 側:
- LinkSwitch runtime loaderあり
- Runtime PIDは公開Repositoryへ直接保存しない
- Yahoo用placeholderは未承認 / 未稼働状態で残している
- LinkSwitch対象CTAが実際に描画される場合のみloaderを使う設計

Deploy bridge側:
- Deploy時にValueCommerce runtimeを注入する構成
- Secret値はGitHub側で管理
- Productionでruntime JSONとloaderの動作確認済み

重要:
- Yahoo!ショッピングの検索結果URLをLinkSwitchで使う案は以前検討したが、現在は「比較 → 商品詳細 → 購入」の構造へ方針変更済み。
- Yahooの購入リンクを本番有効化する前に、実URLでLinkSwitch変換 / 計測が成立することを実検証する。
- 未確認URLを成果計測可能として断定しない。

## 5. Amazonアソシエイト

Amazonアソシエイト導線は一部本番実装済み。

現在の実装:
- Amazon Associates tagは公開Repositoryへ直書きしない
- Deploy bridgeのGitHub Actions Secretから `data/amazon.runtime.json` を生成
- 商品ページのJavaScriptがruntimeを読み、ASINからAmazon購入CTAを生成
- Yahoo!ショッピング導線は既存ValueCommerce LinkSwitch構成を維持
- Amazon CTA実装済み: Tapo C530WS / Tapo C425 / Tapo C520WS
- C500 / Kashimura KJ-200 は同一商品のASINを一次確認できるまで未追加

直近Evidence:
- bouhan-lab PR #10 merged
- deploy bridge PR #29 merged
- Amazon runtime generation: SUCCESS
- production deploy / Verify production: SUCCESS
- 最新Pages build: SUCCESS
- Open PR / Open Issue: なし（2026-10-14確認）

注意:
- Amazonの商品URL / ASINを推測で追加しない
- C500はAmazon.co.jpで販売されていること自体は外部比較サイトで確認できるが、ASINはAmazon画面で直接確認してから追加する
- KJ-200はAmazon掲載有無の外部情報が一致していないため、Amazon側で直接確認してから判断する
- Amazon公式画像・価格は無断固定コピーしない

## 6. PC04 / PC03

現在のユーザー明示指定では PC04（ks04）を優先する。

PC04:
- Remote Desktop Commander接続「いんふぉ０４」
- 2026-10-14に Online / ping成功を再確認
- Chrome local DevTools `127.0.0.1:9222` 応答200を確認
- Amazon / ValueCommerce / A8のブラウザタブ存在を確認
- Amazonアソシエイトは現在ログイン承認画面まで進んでおり、本人承認待ち

PC03:
- Master上のPrimary Local Windows Nodeは引き続き ks-03
- ユーザーが「04で進めて」と明示した現在TaskではPC04を使う
- 「03に戻して」でPC03へ戻す
- 利用上限による自動切替はしない

Operaは現行の既定ブラウザ自動化から除外する。

## 7. Claude / Gemini クロスチェック実行方法

PC03で、Claude / Geminiへ同じEvidenceを渡して独立レビューする。

Claude Code:
- promptはstdinで渡す
- `claude -p --output-format text --permission-prompts none`
- 日本語promptがRemote PowerShell経由で文字化けする場合、英語promptで依頼して日本語要約する

Gemini:
- Antigravity CLI `agy`
- Gemini 3.1 Pro Highを使用
- promptはstdinで渡す
- `--output-format text`
- 必要に応じて `--print-timeout`

重要:
- 「3人でクロスチェック」は実Providerによる独立レビューを意味する
- 擬似的な3役レビューを実施済み扱いにしない

## 8. 次にやる作業

優先順:

1. Amazonアソシエイトの運用方法をPC03のChrome方針に沿って確認
2. AmazonのアソシエイトID / SiteStripe / 商品リンク作成方式を確認
3. 防犯カメラの個別商品ページの共通テンプレートを設計
4. 商品詳細ページからYahoo!ショッピング購入CTAを実装
5. Amazonを追加する場合はAmazonアソシエイトCTAを実装
6. 商品画像の利用ルールを確認し、メーカー / モール画像を無断利用しない
7. モバイル表示・SEO・リンク切れ・計測を確認
8. Branch → PR → CI → Merge → Deploy → Live Verification

## 9. 個別商品ページの想定構成

まだ未実装。

推奨構成:

- 商品名
- どんな人向けか
- 主な仕様
- 良い点
- 注意点
- 設置条件
- 比較ページへ戻る
- Yahoo!ショッピングで買う
- 将来: Amazonで買う
- メーカー公式仕様への出典リンク

メーカー公式ページは購入CTAではなく、仕様出典として記事下部等に配置する。

## 10. 禁止 / 注意

- 個別商品の販売URLを推測で作らない
- LinkSwitch計測を未確認のまま「成果計測できる」と断定しない
- Amazonアソシエイト通常URLをトラッキング付きと誤認しない
- Amazon / 楽天 / Yahooの商品画像を権利確認なしで転載しない
- 実機未確認の商品を実機レビュー扱いしない
- 「売れ筋1位」「No.1」等を根拠なく表示しない
- Secret / PID / Tracking ID等の秘密値をPublic Repositoryやチャットへ書かない
- 個人Chrome profileを安全ルールを無視してCDP公開しない

## 11. 再開時の最初の一言

次セッションでは:

「ai-master と bouhan-lab/HANDOFF.md を読み、Amazonアソシエイト確認から再開」

で復元できる状態を目指す。


## 9. ValueCommerceホームセキュリティ導線（2026-10-18）

防犯ラボのValueCommerceサイトは `防犯ラボ|住まいの防犯対策ガイド` を使用する。

提携確認済み:
- Yahoo!ショッピング
- eBEST
- サンワダイレクト
- アイリスプラザ
- ALSOK
- セコム・ホームセキュリティ

2026-10-18実装:
- `secom.html` / `alsok.html` / `home-security-compare.html` / `secom-vs-alsok.html` にProvider固定CTAスロットを追加
- `data-ad-id="vc-secom-home"` / `data-ad-id="vc-alsok-home"` で広告主を固定
- Provider固定広告は `pinnedOnly` とし、汎用広告枠から誤選択されない
- URL未設定時はCTAを非表示のfail-closed
- PR表記あり
- 直接広告URLは公開Repositoryへ保存せず、Deploy bridgeのSecretsから `data/ads.runtime.json` へ注入
- Secrets: `VC_SECOM_HOME_URL` / `VC_ALSOK_HOME_URL`
- Secret未設定時も `{"ads":[]}` を毎回本番へ上書きし、古いruntime URLを残さない
- Runtime URLはHTTPS必須。SECOM/ALSOKの広告主ドメイン一致をdeploy時とproduction verify時の双方で検証

Evidence:
- bouhan-lab PR #12 merged: `17b90d37cc3127d6fe1e04a832c02fc5ee17ad95`
- deploy bridge PR #30 merged: `413424e0200f3805833251addacdf6abda1d6a60`
- stale-runtime fix PR #31 merged: `cccec14cb2ca1314642b160758acfefa4fa10887`
- disclosure verify fix PR #32 merged: `a1ea8a710787ca6d09572d34cfc880dcd751a2ce`
- Deploy Bouhan Lab run #34 / run id `39095023535`: SUCCESS
- production verify: SUCCESS
- production `data/ads.runtime.json` currently empty (`ads: []`) until actual SECOM/ALSOK ValueCommerce URLs are securely registered

Pending:
- ValueCommerceへ再ログイン
- SECOM / ALSOK の正式なValueCommerce広告URLを取得
- URLを公開せずGitHub Secretsへ登録
- 再deploy後、各CTAが正しいProviderへ遷移することをlive verify
