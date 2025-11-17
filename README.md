## AdLoom X Ultra · WaveHack Edition

AdLoom X Ultra is a Linera-native attention economy that pays viewers, creators, developers, and advertisers in real time. The repo contains:

- `adloom-x-ultra/` &mdash; a Linera smart-contract + GraphQL service that manages viewer attention scores, advertiser budgets, and automated credit lines (A-Fi).
- `src/` &mdash; a Vite + React dashboard that renders live telemetry from the GraphQL endpoint (with graceful fallbacks when the endpoint is offline).

The build satisfies the WaveHack criteria: a fully on-chain Linera contract, GraphQL service for real-time UX, a deployable frontend, documentation, and a changelog-friendly structure.

---

### 1. Prerequisites

| Tool                                                      | Why                                               | Install command (PowerShell)                                                                                                                                               |
| --------------------------------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Node.js 18+ & npm                                         | Frontend build/dev server                         | https://nodejs.org                                                                                                                                                         |
| Rust (stable) + wasm target                               | Compile Linera Wasm modules                       | `winget install -e --id Rustlang.Rustup`<br>`rustup target add wasm32-unknown-unknown`                                                                                     |
| Visual Studio Build Tools + C++ workload + Windows 11 SDK | MSVC linker & system libs for cargo               | `winget install -e --id Microsoft.VisualStudio.2022.BuildTools --override "--add Microsoft.VisualStudio.Workload.VCTools --includeRecommended --quiet --wait --norestart"` |
| protoc                                                    | Required by `prost` in Linera SDK                 | `winget install -e --id Google.Protobuf`                                                                                                                                   |
| LLVM / libclang                                           | Used by `bindgen` when compiling `linera-service` | `winget install -e --id LLVM.LLVM`                                                                                                                                         |
| Linera CLI (service + storage)                            | Deploy/test contracts                             | `cargo install --locked linera-storage-service@0.15.6`<br>`cargo install --locked linera-service@0.15.6`                                                                   |

> **Tip:** Add `%USERPROFILE%\.cargo\bin`, `%ProgramFiles(x86)%\Microsoft Visual Studio\2022\BuildTools\VC\Tools\MSVC\<version>\bin\Hostx64\x64`, `%ProgramFiles(x86)%\Windows Kits\10\Lib\10.0.26100.0\um\x64`, and the protoc/LLVM paths to your `PATH` for future shells.

---

### 2. Frontend setup

```bash
npm install
npm run dev     # local dev server
npm run build   # production build → dist/
```

Configure the GraphQL endpoint via `.env.local`:

```env
VITE_LINERA_GRAPHQL_URL=http://localhost:8080/graphql
```

If the env var is unset the UI automatically falls back to synthetic data so design reviews still work offline.

---

### 3. Smart contract & service

Project layout generated with `linera project new adloom-x-ultra` and extended to include viewer/creator/advertiser ledgers, attention events, and automated credit logic.

#### Build & test

```bash
cd adloom-x-ultra
cargo fmt
cargo test
cargo build --release --target wasm32-unknown-unknown
```

Compilation produces `target/wasm32-unknown-unknown/release/adloom_x_ultra_{contract,service}.wasm`.

#### Local Linera devnet

```bash
# New terminal: start a local validator + faucet
linera net up --with-faucet --faucet-port 8080

# Another terminal: init wallet + chain against local faucet
linera wallet init --faucet http://localhost:8080
linera wallet request-chain --faucet http://localhost:8080
```

Deploy locally:

```bash
linera project publish-and-create adloom-x-ultra \
  --wasm-path target/wasm32-unknown-unknown/release \
  --json-argument "{}"
```

Serve GraphQL locally:

```bash
linera service --port 8080 --with-wallet default
# GraphiQL available at http://localhost:8080/graphql
```

Example query:

```graphql
{
  global {
    viewers
    advertisers
    totalImpressions
  }
  leaderboard(limit: 3) {
    handle
    attentionScore
    totalEarned
  }
}
```

#### Testnet Conway deployment

```bash
linera wallet init --faucet https://faucet.testnet-conway.linera.net
linera wallet request-chain --faucet https://faucet.testnet-conway.linera.net

linera project publish-and-create adloom-x-ultra \
  --json-argument "{}" \
  --faucet https://faucet.testnet-conway.linera.net
```

Grab the GraphQL service URL from `linera service --public-host ...` and feed it to the frontend env var for the live demo.

---

### 4. Submission checklist

- ✅ Working contract + service (attention ledger, advertiser budgets, automated credit).
- ✅ Tests (`cargo test`, `linera project test`, `npm run build`).
- ✅ Public frontend with live Linera telemetry (`VITE_LINERA_GRAPHQL_URL` configurable for Testnet Conway).
- ✅ README with setup, deploy, and submission steps.
- ✅ WaveHack-required metadata (team, changelog, repo) ready to drop into Akindo submission form.

---

### 5. Suggested next steps

1. **Deploy the Wasm modules** to the Conway testnet with your builder wallet.
2. **Run `linera service`** on a small VM (or locally via `ngrok`) and point the Vite app at the public GraphQL URL.
3. **Publish the frontend** (Netlify/Vercel/Cloudflare). Build output lives in `dist/`.
4. **Update the submission** with:
   - Project name + short description (copy from hero section).
   - This GitHub repo URL + commit hash.
   - Live demo link (deployed frontend hitting live GraphQL).
   - Notes on Linera features used (microchains, GraphQL service, attention ledger).
   - Team + wallet contacts.
   - Changelog for the current wave (reference this README and commit list).

Fire away if you need help wiring wallets, deploying to Conway, or shaping the final pitch deck. ⚡
