# Home

## 概要

検証フローを開始するためのトップページを提供するエンドポイント。

## URL

https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/home

## リクエスト

### メソッド

- GET

### パラメータ

なし

## レスポンス

### フォーマット

- HTML

### レスポンスボディ

以下の要素を含む HTML ページ：

- 検証フロー開始ボタン（`/init`へのリンク

## サンプルリクエスト

```sh
curl -v  https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/home
```

## サンプルレスポンス

```sh
<!doctype html>
<html>
...
</html>
```
