# Result

## 概要

ウォレットからの応答を受け取り、VP トークンを検証して結果を表示するエンドポイント。

## URL

https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/result

## リクエスト

### メソッド

- GET

### パラメータ

| パラメータ名  | データ型 | 必須 | 説明                             |
| ------------- | -------- | ---- | -------------------------------- |
| response_code | string   | Yes  | ウォレットからのレスポンスコード |

### Cookie

| 名前      | 説明                              |
| --------- | --------------------------------- |
| sessionId | 初期化時に発行されたセッション ID |

## レスポンス

### フォーマット

- HTML

### レスポンスボディ

検証結果を表示する HTML ページ：

- 検証されたドキュメントデータ
  - 各ドキュメントタイプごとの属性情報
  - 属性のキー/値ペア
- 検証された`VP`トークンの内容

## サンプルリクエスト

```sh
curl -v  https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/result?response_code={RESPONSE_CODE} \
     -H "Cookie: {sessionId} \
```

## サンプルレスポンス

```sh
<!doctype html>
<html>
...
</html>
```
