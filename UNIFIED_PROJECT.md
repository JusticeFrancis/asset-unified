# Asset Union unified Next.js project

This is one native Next.js application using MongoDB Atlas, Mongoose, Cloudinary, Gmail SMTP, Doola, and Bridge.xyz. It serves the client at `/dashboard` and the admin at `/admin`.

## Run locally

1. Copy `.env.example` to `.env.local` and fill the required values.
2. Add a MongoDB Atlas connection string, `MONGODB_DB_NAME=asset_union`, and Cloudinary credentials.
3. Run `npm install`, then `npm run dev`. Mongoose creates collections and indexes automatically.
4. Open `http://localhost:3000/dashboard` for the client or `http://localhost:3000/admin` for admin.

Admin published properties, governance proposals, notifications, users, and rent distributions are synchronized into the same live records used by the client dashboard.

## Bridge.xyz

Bridge sandbox is the default. Create a sandbox API key, set `BRIDGE_API_KEY`, then register `https://YOUR_DOMAIN/v1/webhooks/bridge` in Bridge. Store the returned webhook public key as `BRIDGE_WEBHOOK_PUBLIC_KEY` (newlines may be written as `\\n`).

Authenticated Bridge routes are available under `/v1/bridge`: KYC-link creation, transfers, transfer status, and customer virtual-account creation. Requests that create money movement accept an `Idempotency-Key` header.

Never commit `.env` or production credentials. Smart-contract deployment addresses must be provided by the blockchain engineer and audited before mainnet use.
