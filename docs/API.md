# API reference

All responses are JSON unless the status is `204 No Content`. Authenticated client routes require `Authorization: Bearer <access-token>`. Admin routes require `x-admin-api-key`.

## Authentication

- `POST /v1/auth/login/otp/send` — send a Gmail OTP.
- `POST /v1/auth/login/otp/verify` — verify `{ otpSessionId, code, referralCode? }` and create the user/session.
- `GET|PATCH /v1/auth/me` — read or update the authenticated profile.
- `POST /v1/auth/refresh` — rotate refresh tokens.
- `POST /v1/auth/logout` — revoke the current refresh token.

## Published records

Create records with:

```json
{
  "slug": "record-slug",
  "title": "Visible title",
  "status": "active",
  "published": true,
  "featured": false,
  "sortOrder": 10,
  "data": {}
}
```

Routes:

- `GET /v1/records/:resource?status=active&featured=true&page=1&limit=20`
- `GET /v1/records/:resource/:slug`
- `GET|POST /v1/admin/records/:resource`
- `GET|PATCH|DELETE /v1/admin/records/:resource/:slug`

## Wallet and investments

- `GET /v1/wallet`
- `POST /v1/wallet/deposits`
- `POST /v1/wallet/withdrawals`
- `POST /v1/wallet/claims`
- `GET|POST /v1/investments`

Investment payload:

```json
{
  "propertySlug": "property-slug",
  "propertyKind": "rental",
  "shares": 2,
  "couponCode": "OPTIONAL"
}
```

The purchase checks the published property share price and authenticated wallet balance, reserves an available coupon, debits atomically, writes the investment/ledger/notification, and rolls back funds and coupon state if persistence fails.

Admin wallet configuration:

- `GET|PATCH /v1/admin/wallets/:userId`
- `POST /v1/admin/wallets/:userId/transactions`

## Coupons

- `GET /v1/coupons`
- `POST /v1/coupons/redeem`
- `GET|POST /v1/admin/coupons`
- `PATCH|DELETE /v1/admin/coupons/:id`

## Referrals, notifications and support

- `GET|POST /v1/referrals`
- `GET|PATCH /v1/notifications`
- `PATCH /v1/notifications/:id`
- `GET|POST /v1/support/messages`
- `POST /v1/admin/notifications`
- `GET|POST /v1/admin/support/messages`

## Governance

- `GET|POST /v1/governance/proposals`
- `GET /v1/governance/proposals/:slug`
- `POST /v1/governance/proposals/:slug/vote`

Voting is limited to one vote per user and weighted from completed ownership records.

## P2P and academy

- `GET /v1/p2p/offers`
- `POST /v1/p2p/orders`
- `GET|POST /v1/academy`

## Uploads and webhooks

- `POST /v1/uploads` — authenticated multipart upload to Cloudinary.
- `POST /v1/webhooks/bridge` — Bridge event endpoint protected by `BRIDGE_WEBHOOK_SECRET`.
