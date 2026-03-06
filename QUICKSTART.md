# VERITAS Development Quick Start

This guide will get you up and running with the VERITAS codebase in 10 minutes.

## 1. Prerequisites

```bash
# Check Node.js version (need >= 18.0.0)
node --version

# Check pnpm (need >= 8.11.0)
pnpm --version

# If pnpm is not installed:
npm install -g pnpm@8
```

## 2. Clone & Install Dependencies

```bash
# Clone the repository (if not already done)
git clone https://github.com/xyrille1/Veritas.git
cd Veritas

# Install all dependencies
pnpm install

# If you encounter issues, clean and reinstall:
pnpm clean
rm -rf node_modules
pnpm install
```

## 3. Environment Setup

```bash
# Copy the template file
cp apps/web/.env.example apps/web/.env.local

# Edit with your configuration
# For development, these minimum values are needed:
# - NEXT_PUBLIC_SUI_RPC_URL=https://fullnode.testnet.sui.io
# - MONGODB_URI=mongodb://localhost/veritas (or MongoDB Atlas cluster)
# - GOOGLE_CLIENT_ID=your_oauth_client_id (from Google Cloud Console)
```

## 4. Start Development Server

```bash
# From repo root, start all services:
pnpm dev

# This will start:
# - Next.js dev server (http://localhost:3000)
# - TypeScript type checking
# - Vitest unit tests in watch mode

# Or run individual services:
pnpm --filter @veritas/web dev     # Just the web app
cd packages/move && sui move build  # Just Move contracts
```

## 5. Explore the Project

### Landing Page

Visit `http://localhost:3000` and click **"Sign In"** to test the authentication flow.

### Dashboard (After Login)

- `/dashboard` — Compliance officer workspace
- Sample shipments are pre-loaded for testing

### Admin Console

- `/admin` — System overview (requires role_level 2–3)
- View system health, gas treasury, live settlement feed

### API Examples

```bash
# List shipments
curl -X GET http://localhost:3000/api/shipments \
  -H "Authorization: Bearer <session_jwt>"

# Create a test shipment
curl -X POST http://localhost:3000/api/shipments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <session_jwt>" \
  -d '{
    "supplier_addr": "0x...",
    "escrow_amount": "1000000000",
    "cargo_description": "Coffee Beans (Grade A)"
  }'
```

## 6. Key npm Scripts

```bash
# From repo root:
pnpm build          # Build all apps & packages
pnpm test           # Run all tests
pnpm lint           # Lint all code
pnpm type-check     # TypeScript type checking

# From apps/web:
pnpm dev            # Start Next.js dev server
pnpm build          # Build for production
pnpm test           # Run tests
pnpm lint           # Lint Next.js code

# From packages/move:
sui move build      # Compile Move contracts
sui move test       # Run Move unit tests
sui move lint       # Lint Move code
```

## 7. Database Setup (MongoDB)

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Create free cluster at [mongodb.com](https://www.mongodb.com)
2. Copy connection string
3. Add to `.env.local`:
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/veritas
   ```

### Option B: Local MongoDB

```bash
# Install MongoDB Community (platform-specific)
# macOS:
brew install mongodb-community

# Start MongoDB:
mongod --config /usr/local/etc/mongod.conf

# Connection string:
MONGODB_URI=mongodb://localhost:27017/veritas
```

## 8. SUI Testnet Setup

### Get SUI on Testnet

```bash
# Install SUI CLI (if not already installed)
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui

# Check version
sui --version

# Create a new keypair (or import existing)
sui keytool generate ed25519

# Request testnet SUI from faucet
# Visit: https://discord.gg/sui
# In #testnet-faucet channel: !faucet <your_address>
```

### Configure SUI CLI

```bash
# Set active network to testnet
sui client new

# Verify connection
sui client call --network testnet --function 0x1::sui::SUI_module_documentation
```

## 9. Testing the Settlement Flow

1. **Create a shipment**
   - Navigate to `/dashboard`
   - Click "Create Shipment" (button not yet visible—feature in progress)
   - Fill in supplier address, cargo details, escrow amount

2. **Simulate state transitions**
   - Warehouse worker scans departure QR → state: `InTransit`
   - Receiver scans arrival QR → state: `PendingVerification`

3. **Verify & settle**
   - Compliance officer reviews digital twin (provenance, custody chain)
   - Clicks "Verify & Settle" → PTB executes on SUI
   - Settlement receipt appears in real-time

## 10. Useful Developer Resources

### Documentation

- [Full Architecture Guide](docs/architecture.md)
- [API Route Handler Examples](docs/api-reference.md)
- [Move Smart Contract Docs](docs/move-contracts.md)
- [zkLogin Flow Diagram](docs/zklogin-flow.md)

### Debug Tools

```bash
# View Next.js server logs
tail -f .next/logs/build.log

# View MongoDB queries (if using local instance)
mongo veritas --eval "db.setLogLevel(1)"

# Watch TypeScript compilation errors
pnpm --filter @veritas/web type-check --watch

# Inspect SUI RPC calls
NEXT_PUBLIC_LOG_LEVEL=debug pnpm dev
```

### IDE Extensions (Recommended)

- **VS Code**:
  - Tailwind CSS IntelliSense
  - Move Analyzer (for Move contracts)
  - Thunder Client (REST API testing)

## 11. Troubleshooting

### Issue: "Cannot find module '@mysten/sui'"

```bash
pnpm install @mysten/sui
```

### Issue: MongoDB connection timeout

```bash
# Check your .env.local has correct MONGODB_URI
# If using Atlas, ensure your IP is whitelisted
# https://www.mongodb.com/docs/atlas/security/ip-access-list/
```

### Issue: SUI RPC rate limiting

```bash
# Add exponential backoff in lib/sui/client.ts (line ~23)
# Or wait a minute and try again
```

### Issue: Tailwind CSS not applying styles

```bash
# Rebuild Tailwind cache:
npx tailwindcss -i ./app/globals.css -o ./output.css

# Or restart the dev server:
pnpm dev
```

## 12. Next Steps

- Read the full [PRD](README.md)
- Implement missing features (see TODO list in codebase)
- Write tests for new components (Vitest + React Testing Library)
- Submit PR to main branch (requires CI pass + code review)

---

**Questions?** Check the full docs folder or ask @ARIA on Slack.
