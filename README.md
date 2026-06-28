# GovCompass 🛡️

> **Decentralized Government Complaint Management System on Stellar**

GovCompass solves a critical government accountability problem: departments receive thousands of citizen complaints but have no unified system to detect patterns, prioritize critical cases, or alert officers before deadlines are missed. Built on the Stellar blockchain for transparency, immutability, and decentralization.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js Frontend                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────┐ │
│  │ Landing  │  │Dashboard │  │ Officer  │  │Admin│ │
│  │   Page   │  │          │  │  Portal  │  │     │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────┘ │
│         │              │              │              │
│    ┌────┴──────────────┴──────────────┴────┐         │
│    │         hooks/contract.ts              │         │
│    │   (Freighter Wallet + Stellar SDK)     │         │
│    └────────────────┬───────────────────────┘         │
├─────────────────────┼─────────────────────────────────┤
│                     │                                 │
│    ┌────────────────┴────────────────────┐            │
│    │     Soroban Smart Contract          │            │
│    │         (GovCompass)                │            │
│    │   - submit / assign / resolve       │            │
│    │   - escalate / get / list           │            │
│    └────────────────┬────────────────────┘            │
│                     │                                 │
│    ┌────────────────┴────────────────────┐            │
│    │      Stellar Testnet/Mainnet        │            │
│    └─────────────────────────────────────┘            │
├──────────────────────────────────────────────────────┤
│              API Routes (Next.js)                     │
│  /api/config  /api/health  /api/departments           │
└──────────────────────────────────────────────────────┘
```

## Smart Contract

### GovCompass Contract

The Soroban smart contract at `contract/contracts/contract/src/lib.rs` provides:

| Function | Description | Auth |
|---|---|---|
| `init(admin)` | Initialize contract with admin | – |
| `submit(citizen, dept, title, desc, urgency, deadline)` | Submit a new complaint | Citizen |
| `assign(admin, id, officer)` | Assign an officer to a complaint | Admin |
| `resolve(officer, id)` | Mark a complaint as resolved | Officer |
| `escalate(admin, id)` | Escalate a complaint | Admin |
| `get(id)` | Get complaint details | None |
| `get_by_citizen(citizen)` | List citizen's complaints | None |
| `get_by_department(dept)` | List department complaints | None |
| `get_department_count(dept)` | Get complaint count | None |

### Complaint Lifecycle

```
Submitted → InReview → Resolved
    ↓          ↓
    └──→ Escalated ←──┘
       (when deadline missed)
```

## Tech Stack

- **Smart Contract**: Rust + Soroban SDK v25
- **Frontend**: Next.js 16 + React 19 + Tailwind CSS 4
- **Blockchain**: Stellar Testnet/Mainnet
- **Wallet**: Freighter Wallet
- **SDK**: @stellar/stellar-sdk v16, @stellar/freighter-api v6

## Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/) + Soroban CLI
- [Bun](https://bun.sh/) or Node.js
- [Freighter Wallet](https://www.freighter.app/) browser extension

### 1. Build & Test the Smart Contract

```bash
cd contract

# Run tests
cargo test

# Build WASM
stellar contract build

# Generate testnet identity (one-time)
stellar keys generate dev --network testnet --fund

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32v1-none/release/govcompass.wasm \
  --source-account dev --network testnet
```

Save the deployed contract address (starts with `C...`).

### 2. Initialize Contract

```bash
# Call init with your admin public key
stellar contract invoke \
  --id <CONTRACT_ADDRESS> \
  --source-account dev \
  --network testnet \
  -- \
  init \
  --admin <YOUR_PUBLIC_KEY>
```

### 3. Configure Frontend

```bash
cd client

# Copy environment config
cp .env.local.example .env.local

# Edit .env.local and set:
# NEXT_PUBLIC_CONTRACT_ADDRESS=<deployed_contract_address>

# Install dependencies
bun install

# Run development server
bun dev
```

### 4. Generate TypeScript Bindings (Optional)

```bash
cd client
stellar contract bindings typescript \
  --network testnet \
  --contract-id <CONTRACT_ADDRESS> \
  --output-dir packages/contract
```

## Features

### For Citizens 👤
- **Submit Complaints**: File complaints with urgency levels and deadlines
- **Track Status**: Real-time tracking of complaint lifecycle on-chain
- **Wallet Auth**: Secure authentication via Freighter wallet

### For Officers 👮
- **Case Management**: View and manage assigned complaints
- **Quick Resolution**: Mark complaints as resolved with one click
- **Priority Alerts**: Visual indicators for urgent and overdue cases

### For Administrators 🏛️
- **Pattern Detection**: Department-level analytics and trend visualization
- **Escalation Control**: Escalate complaints that miss deadlines
- **System Oversight**: Full visibility across all departments and complaints

### Blockchain Benefits
- **Immutability**: Complaints cannot be altered or deleted
- **Transparency**: Full audit trail for every complaint
- **Accountability**: Automatic escalation on missed deadlines
- **Decentralization**: No single point of failure

## API Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | System health check |
| `GET /api/config` | Network & contract configuration |
| `GET /api/departments` | Department statistics |

## Deployment

### Frontend (Vercel)

```bash
cd client
vercel --prod
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CONTRACT_ADDRESS`
- `NEXT_PUBLIC_RPC_URL`
- `NEXT_PUBLIC_NETWORK_PASSPHRASE`

### Smart Contract (Production)

For mainnet deployment:
```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/govcompass.wasm \
  --source-account prod --network mainnet
```

## Project Structure

```
project/
├── contract/                          # Soroban smart contract
│   ├── Cargo.toml                     # Workspace config
│   └── contracts/contract/
│       ├── Cargo.toml                 # Contract manifest
│       └── src/
│           ├── lib.rs                 # Contract logic (~120 lines)
│           └── test.rs                # Tests (9 passing)
├── client/                            # Next.js frontend
│   ├── src/
│   │   ├── app/                       # Pages & API routes
│   │   │   ├── page.tsx               # Landing page
│   │   │   ├── layout.tsx             # Root layout + Navbar
│   │   │   ├── dashboard/             # Citizen dashboard
│   │   │   ├── officer/               # Officer portal
│   │   │   ├── admin/                 # Admin dashboard
│   │   │   ├── submit/                # Complaint submission
│   │   │   └── api/                   # REST API endpoints
│   │   ├── components/                # React components
│   │   │   ├── Navbar.tsx
│   │   │   ├── WalletConnectButton.tsx
│   │   │   ├── ComplaintCard.tsx
│   │   │   └── SubmitForm.tsx
│   │   ├── hooks/contract.ts          # Contract + wallet integration
│   │   └── lib/utils.ts               # ScVal helpers & constants
│   ├── .env.local.example
│   └── package.json
└── README.md
```

## License

MIT


---
### Stellar Smart Contract Address
`CAIN3UH2KIVGAY55LSGRD5I37HI3N3OWXXL2B5PBNM4WWP22BWHLBM53`
