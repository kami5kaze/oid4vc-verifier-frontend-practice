# oid4vc-verifier-frontend-hono

## How to build

### Create .dev.vars

API_BASE_URL = "YOUR OWN ENDPOINT"
INIT_TRANSACTION_PATH = "/ui/presentations"
GET_WALLET_RESPONSE_PATH = "/ui/wallet/response"
WALLET_URL = "eudi-openid4vp://YOUR OWN ENDPOINT"
WALLET_RESPONSE_PATH = "/ui/presentations/:presentationId"
PUBLCI_URL = "http://localhost:8787"

### Install dependencies

npm install

### Run locally

npm run dev

### Deploy

npm run deploy

## How to emulate AWS Lambda　(localstack)

1. Clone or copy the following repositories into the `./build` directory:
   - [`oid4vc-core`](https://github.com/dentsusoken/oid4vc-core.git)
   - [`oid4vc-prex`](https://github.com/dentsusoken/oid4vc-prex.git)
   - [`mdoc-cbor-ts`](https://github.com/dentsusoken/mdoc-cbor-ts.git)

   ```bash
   # If cloning new repositories
   cd build
   git clone https://github.com/dentsusoken/oid4vc-core.git
   git clone https://github.com/dentsusoken/oid4vc-prex.git
   git clone https://github.com/dentsusoken/mdoc-cbor-ts.git
   
   # Or if copying existing local development repositories
   cp -r /path/to/local/oid4vc-core ./build/
   cp -r /path/to/local/oid4vc-prex ./build/
   cp -r /path/to/local/mdoc-cbor-ts ./build/
   ```
2. Create .env
    ```bash
   API_BASE_URL=YOUR OWN ENDPOINT
   INIT_TRANSACTION_PATH=/ui/presentations
   GET_WALLET_RESPONSE_PATH=/ui/wallet/response
   WALLET_URL=eudi-openid4vp://YOUR OWN ENDPOINT
   WALLET_RESPONSE_PATH=/ui/presentations/:presentationId
   PUBLCI_URL=http://localhost:8787
    ```

3. Rebuilding the Image and Starting the Container:
   ```bash
   docker-compose up --build
   ```

## How to deploy AWS Lambda

1. Clone or copy the following repositories into the `./build` directory:
   - [`oid4vc-core`](https://github.com/dentsusoken/oid4vc-core.git)
   - [`oid4vc-prex`](https://github.com/dentsusoken/oid4vc-prex.git)
   - [`mdoc-cbor-ts`](https://github.com/dentsusoken/mdoc-cbor-ts.git)

   ```bash
   # If cloning new repositories
   cd build
   git clone https://github.com/dentsusoken/oid4vc-core.git
   git clone https://github.com/dentsusoken/oid4vc-prex.git
   git clone https://github.com/dentsusoken/mdoc-cbor-ts.git
   
   # Or if copying existing local development repositories
   cp -r /path/to/local/oid4vc-core ./build/
   cp -r /path/to/local/oid4vc-prex ./build/
   cp -r /path/to/local/mdoc-cbor-ts ./build/
   ```

2. IAM Role Configuration:

   **Add to the IAM role you are using**

   * AWSLambdaBasicExecutionRole
   * AWSLambdaDynamoDBExecutionRole
   * dynamodb:GetItem
   * SecretsManagerReadWrite

3. Set Environment Variables for SecretsManager:
   ```bash
   API_BASE_URL=YOUR OWN ENDPOINT
   INIT_TRANSACTION_PATH=/ui/presentations
   GET_WALLET_RESPONSE_PATH=/ui/wallet/response
   WALLET_URL=eudi-openid4vp://YOUR OWN ENDPOINT
   WALLET_RESPONSE_PATH=/ui/presentations/:presentationId
   PUBLCI_URL=http://localhost:8787
   ```

4. Build:
   ```bash
   docker build -t verifier-frontend:latest .
   ```

5. Run:
   ```bash
   docker run --env-file ./.env verifier-frontend:latest
   ```