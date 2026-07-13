# Asset Union

A single Next.js application with the original client UI preserved at `/dashboard` and the original admin UI mounted at `/admin`. Both sides use the same MongoDB database.

## Requirements

- Node.js 20+
- MongoDB Atlas or a local MongoDB instance
- Bridge.xyz credentials for live wallet deposits and withdrawals
- Cloudinary credentials for uploads
- Gmail account with an App Password for OTP email

## Setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Populate every blank value in `.env.local`. Never commit `.env.local` or real credentials.

The application starts at `http://localhost:3000`.

- Client dashboard: `/dashboard`
- Admin dashboard: `/admin`
- Client API: `/v1`
- Admin API used by the admin UI: `/api/admin`

Keep `NEXT_PUBLIC_API_URL=/v1` for the client and `NEXT_PUBLIC_ADMIN_API_URL=/api` for the admin. The admin login posts to `/api/admin/auth/login`, not `/v1/admin/auth/login`.

## Verification

```bash
npm run check-types
npm run build
npm start
```

## Data behavior

The project does not seed fake properties, users, balances, transactions, votes, testimonials, FAQs, rewards, or support messages. A new database therefore shows real empty states until records are created.

Admin-created property listings are stored as admin properties first. When an admin publishes a property, the app syncs it into the client `AssetUnionRecord` collection so `/dashboard/rental`, `/dashboard/construction`, and the related marketing sections read live published data. If a published admin property is edited, paused, resumed, rejected, or deleted, the client-facing record is updated or removed.

Admin user management reads and writes the same `AssetUnionUser` collection used by client login. Admin governance proposals sync into the client governance records, admin in-app notifications create user notifications, and distributed rent submissions create rent accrual transactions for investors who hold completed shares in that rental property.

See [`docs/API.md`](docs/API.md) and [`docs/CONTENT_RECORDS.md`](docs/CONTENT_RECORDS.md) for the lower-level client API payloads.

## Integrations

### Bridge.xyz

Wallet deposits and withdrawals use Bridge directly. Requests fail explicitly when `BRIDGE_API_KEY` is absent or Bridge rejects the request. Configure Bridge webhooks to:

```text
POST /v1/webhooks/bridge
x-bridge-webhook-secret: <BRIDGE_WEBHOOK_SECRET>
```

The webhook updates provider IDs, wallet status, addresses, deposit instructions, transaction states, and confirmed balances. It is idempotent for already-completed credits.

### Gmail OTP

Set `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `EMAIL_FROM`. Use a Google App Password, never the account password.

### Cloudinary

Uploads use `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.

## Security notes

- Rotate any credentials that were present in an earlier copy of this project.
- Use long random values for `JWT_SECRET`, `AUTH_SECRET`, `ADMIN_API_KEY`, `WALLET_ENCRYPTION_KEY`, and `BRIDGE_WEBHOOK_SECRET`.
- Set `SUPER_ADMIN_EMAIL` and `SUPER_ADMIN_PASSWORD` before the first admin login so the first super-admin account can be bootstrapped.
- If you already created a wrong admin in the same database, set `SUPER_ADMIN_FORCE_RESET=true` for one login attempt, sign in successfully, then set it back to `false`.
