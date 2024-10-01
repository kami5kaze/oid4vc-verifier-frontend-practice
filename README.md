# How to build

## Create .dev.vars

API_BASE_URL = "YOUR OWN ENDPOINT"
INIT_TRANSACTION_PATH = "/ui/presentations"
GET_WALLET_RESPONSE_PATH = "/ui/wallet/response"
WALLET_URL = "eudi-openid4vp://YOUR OWN ENDPOINT"
WALLET_RESPONSE_PATH = "/ui/presentations/:presentationId"
PUBLCI_URL = "http://localhost:8787"

## Install dependencies

npm install

## Run locally

npm run dev

## Deploy

npm run deploy
