# VERITAS Feature Checklist

Last updated: 2026-03-06
Audit scope: PRD v1.2 (FR-01 → FR-15) + runtime health check

## Overall Status

- Full feature completion: **NO**
- Fully working end-to-end: **NO**
- Critical blockers found:
  1. Web app does not start (`pnpm --filter web dev`) due to missing module `styled-jsx/package.json`.
  2. Dashboard settlement hooks call non-existent routes (`/api/shipments/settle`, `/api/shipments/dispute`).
  3. API response shapes are inconsistent across routes/hooks (`{ shipments }` vs expected `{ data: { ... } }`).

## Functional Requirements (PRD Section 3)

| ID | Feature | Status | Notes |
|---|---|---|---|
| FR-01 | zkLogin Authentication | ⚠️ Partial | Google login + nonce + callback exist; Slack SSO not implemented. |
| FR-02 | Digital Twin Object View | ⚠️ Partial | Shipment drawer includes provenance/custody/IPFS/escrow, but not fully matching full PRD detail spec. |
| FR-03 | PTB Settlement (atomic) | ⚠️ Partial | Move + PTB builder exist, but dashboard verify flow currently points to wrong API routes, so not fully operational from UI. |
| FR-04 | Escrow Vault Contract | ✅ Implemented | `escrow_vault.move` includes fund/lock/release and pause logic. |
| FR-05 | Sponsored Transactions | ⚠️ Partial | Server-side sponsor signing exists in `/api/settlements`; relayer architecture and full UX guarantees not complete. |
| FR-06 | Shipment State Machine | ✅ Implemented | Move state transitions and guards are present (`Created → InTransit → PendingVerification → Verified/Disputed`). |
| FR-07 | Compliance Dashboard | ⚠️ Partial | KPI/list/filter shell exists, but filter parity and real-time SUI event sync are incomplete (polling; websocket subscription is no-op). |
| FR-08 | Settlement Receipt Log | ⚠️ Partial | On-chain event type exists; UI surfaces tx digest in places, but not full dedicated receipt log experience from PRD. |
| FR-09 | CSV Export | ✅ Implemented | `/api/settlements/export` and dashboard export action exist. |
| FR-10 | Supplier Self-Onboarding | ⚠️ Partial | Invite + onboarding flow exists, but provider coverage and full profile flow are incomplete. |
| FR-11 | Rejection Flow | ⚠️ Partial | Reject modal + dispute PTB path exist, but current UI hook route mismatch blocks expected end-to-end path. |
| FR-12 | USDC via DeepBook | ❌ Missing | No concrete DeepBook swap execution found in PTB/API path. |
| FR-13 | Multi-Signature Approval | ❌ Missing | No implemented 2-of-N approval flow found. |
| FR-14 | Role-Based Access Control | ⚠️ Partial | Session + role checks + Move RoleRegistry exist; role semantics are inconsistent in parts (e.g., incident API requires role 4). |
| FR-15 | Supplier Payment Dashboard | ⚠️ Partial | Supplier dashboard/disputes pages exist, but PRD-complete capabilities are not fully present. |

## Product Surface Coverage (high-level)

- Landing page (8 sections): ⚠️ Partial
- Persistent nav + notifications + settings: ⚠️ Partial
- Compliance dashboard + drawer + verify/reject modals: ⚠️ Partial
- Supplier portal: ⚠️ Partial
- Admin console routes/pages: ⚠️ Partial

## Verification Checks Run

- `pnpm --filter web dev` → **failed** (`styled-jsx/package.json` not found).
- Static/IDE diagnostics (`apps/web`) show unresolved dependency/type issues in current environment.

## Priority Fix Queue (to reach “fully working”)

1. Fix startup/runtime dependency issue so app boots consistently.
2. Align settlement/dispute frontend hooks to actual API contract (or add missing routes).
3. Normalize API response envelopes across shipment/settlement endpoints.
4. Complete missing P0/P1 behavior gaps in dashboard + receipt log + onboarding.
5. Implement or explicitly defer FR-12 and FR-13 in roadmap.

## Status Legend

- ✅ Implemented
- ⚠️ Partial / Not fully working
- ❌ Missing
