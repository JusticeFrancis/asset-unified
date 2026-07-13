# Published content records

The generic `AssetUnionRecord` model stores flexible page data in `data`, while `resource`, `slug`, publication state and ordering remain indexed fields. This lets the current UI consume API data without redesigning its components.

## Property resources

### `rental-property`

The `data` object should follow `RentalPropertyRecord` in `src/app/dashboard/rental/data/rental-properties.ts`. Important purchase fields:

```json
{
  "asset": "USDT",
  "card": {
    "title": "Property title",
    "location": "Location",
    "imageLayers": ["https://..."],
    "badge": "rental",
    "rightColumn": "apr",
    "fundsCollected": "0%",
    "coOwners": "0",
    "aprPercent": "0%"
  },
  "detail": {
    "sharePrice": "50 USDT",
    "sharePriceValue": 50,
    "gallery": ["https://..."],
    "quickShareOptions": []
  }
}
```

### `construction-property`

Follow `ConstructionPropertyRecord` in `src/app/dashboard/construction/data/construction-properties.ts`. Set `detail.sharePriceValue` to a positive number for purchases.

## P2P and governance

- `p2p-offer` — published offer metadata, owner/seller ID, asset, fiat currency, limits and price.
- `governance-proposal` — property reference, choices, dates, quorum and proposal body.

## Marketing and legal resources

- `testimonial`
- `referral-testimonial`
- `referral-earning-scenario`
- `home-faq`
- `secondary-market-faq`
- `rental-market-faq`
- `construction-market-faq`
- `dao-llc-faq`
- `referral-faq`
- `knowledge-base-faq`
- `legal-document` with slugs `terms-of-use` and `privacy-policy`
- `marketing-section` with slugs such as `home-social-proof`, `home-platform-stats`, and `referral-testimonials`
- `rental-ownership-example` with slug `default`
- `dashboard-page` with slug `faq`

FAQ records accept `question` and `answer`. Knowledge-base FAQ records also accept `categoryId` and `categoryLabel`.

## Academy resources

- `academy-quest`
- `academy-faq`
- `academy-reward`

Only published active records appear in the authenticated academy response.

## Empty database

No fixture script is run automatically. Missing records produce empty lists, blank optional content, zero balances, or explicit configuration errors; the application does not substitute invented business data.
