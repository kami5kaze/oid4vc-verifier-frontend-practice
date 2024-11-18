# Initiate

## 概要

検証フローを開始し、ウォレットへのリダイレクト URL または QR コードを表示するページを生成するエンドポイント。

## URL

https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/init

## リクエスト

### メソッド

- GET

### パラメータ

なし

## レスポンス

### フォーマット

- HTML

### レスポンスボディ

デバイスタイプに応じて以下の情報を含む HTML ページ：

#### モバイルデバイスの場合

- ウォレットへのリダイレクト URL とリンク

#### デスクトップデバイスの場合

- ウォレットへのリダイレクト URL とリンク
- リダイレクト URL を含む QR コード
- 結果表示ページへのリンク

### クッキー

| 名前      | 値     | 属性                                                             |
| --------- | ------ | ---------------------------------------------------------------- |
| sessionId | string | `Path=/`<br>`HttpOnly=true`<br>`SameSite=Lax`<br>`MaxAge=604800` |

## サンプルリクエスト

```sh
curl -v  https://oid4vc-verifier-frontend-hono.g-trustedweb.workers.dev/init
```

## サンプルレスポンス

```sh
<!doctype html>
<html>
...
</html>
```
