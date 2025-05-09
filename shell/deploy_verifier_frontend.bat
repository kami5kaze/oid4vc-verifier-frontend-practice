@echo off
setlocal enabledelayedexpansion


echo Verifier Frontendのデプロイを開始します。
echo Cloudflareにログインしていない場合、処理の途中でログインを求められます。
echo 続行するにはEnterキーを押してください。
pause > nul

:: 各モジュールのディレクトリを設定
set "CURRENT_DIR=%CD%"
set "BUILD_DIR=%CURRENT_DIR%\build"
set "CORE_DIR=%BUILD_DIR%\oid4vc-core"
set "PREX_DIR=%BUILD_DIR%\oid4vc-prex"
set "CBOR_DIR=%BUILD_DIR%\mdoc-cbor-ts"

:: エラーハンドリング関数
:handle_error
if errorlevel 1 (
    echo エラーが発生しました: %~1
    exit /b 1
)

:: クリーンアップ関数
:cleanup
echo クリーンアップを実行します...
if exist "%BUILD_DIR%" (
    rmdir /s /q "%BUILD_DIR%" || echo 警告: buildディレクトリの削除に失敗しました
)
 if errorlevel 1 (
    exit /b 0
)

:: build ディレクトリの存在確認と作成
if not exist "%BUILD_DIR%" (
    mkdir "%BUILD_DIR%" || (
        call :handle_error "buildディレクトリの作成に失敗"
    )
)

:: モジュールをクローン
cd "%BUILD_DIR%" || (
    call :handle_error "buildディレクトリへの移動に失敗"
)

echo oid4vc-coreをクローンしています...
git clone https://github.com/dentsusoken/oid4vc-core || (
    call :handle_error "oid4vc-coreのクローンに失敗"
)

echo oid4vc-prexをクローンしています...
git clone https://github.com/dentsusoken/oid4vc-prex || (
    call :handle_error "oid4vc-prexのクローンに失敗"
)

echo mdoc-cbor-tsをクローンしています...
git clone https://github.com/dentsusoken/mdoc-cbor-ts || (
    call :handle_error "mdoc-cbor-tsのクローンに失敗"
)

echo oid4vc-coreをビルドしています...
cd "%CORE_DIR%" || (
    call :handle_error "oid4vc-coreディレクトリへの移動に失敗"
)
call npm install
call npm run build || (
    call :handle_error "oid4vc-coreのビルドに失敗"
)
call npm link || (
    call :handle_error "oid4vc-coreのnpm linkに失敗"
)

echo oid4vc-prexをビルドしています...
cd "%PREX_DIR%" || (
    call :handle_error "oid4vc-prexディレクトリへの移動に失敗"
)
call npm install
call npm link oid4vc-core || (
    call :handle_error "oid4vc-coreのリンクに失敗"
)
call npm run build || (
    call :handle_error "oid4vc-prexのビルドに失敗"
)
call npm link || (
    call :handle_error "oid4vc-prexのnpm linkに失敗"
)

echo mdoc-cbor-tsをビルドしています...
cd "%CBOR_DIR%" || (
    call :handle_error "mdoc-cbor-tsディレクトリへの移動に失敗"
)
call npm install
call npm link oid4vc-core oid4vc-prex || (
    call :handle_error "依存モジュールのリンクに失敗"
)
call npm run build || (
    call :handle_error "mdoc-cbor-tsのビルドに失敗"
)
call npm link || (
    call :handle_error "mdoc-cbor-tsのnpm linkに失敗"
)

echo oid4vc-verifier-frontend-honoをビルドしています...
cd .. || (
    call :handle_error "oid4vc-verifier-frontend-honoディレクトリへの移動に失敗"
)
call npm install
call npm link oid4vc-core oid4vc-prex mdoc-cbor-ts || (
    call :handle_error "依存モジュールのリンクに失敗"
)
call npm i -g wrangler || (
    call :handle_error "wranglerのインストールに失敗"
)
call npx wrangler login || (
    call :handle_error "Cloudflareへのログインに失敗"
)
call npm run deploy || (
    call :handle_error "デプロイに失敗"
)

echo Verifier Frontendのデプロイが完了しました。

echo 終了するにはEnterキーを押してください。
pause > nul

exit /b 0 