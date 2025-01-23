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

## How to emulate AWS Lambda

### Prerequisites
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

3. Start the Dev Container:
   ```bash
   # Open in VS Code and click "Reopen in Container"
   # Or use the command palette: F1 -> "Dev Containers: Rebuild and Reopen in Container"
   ```

4. Inside the container, run the setup script:
   ```bash
   ./shell/setupLinks.sh
   ```

5. Start the Lambda emulator:
   ```bash
   npm run emulate:lambda
   ```