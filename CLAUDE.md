# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev       # Start development server at localhost:3000
pnpm build     # Production build
pnpm start     # Start production server
```

No test runner or linter is configured yet.

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss`)
- **TypeScript**
- Package manager: **pnpm**

## Architecture

This is a fresh Next.js App Router project. All routes and layouts live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up Geist font variables and wraps all pages. Global styles are in `src/app/globals.css`.

## Asset And Icon Conventions

- Download design images from Figma into `public/images/` (use nested folders like `public/images/home/...` for section assets).
- Export image paths from `src/lib/assets.ts` and consume those exports in components instead of hardcoded remote URLs.
- For SVG logos/images in `public/images/`, export string paths (for example `"/images/home/endorsements/nasdaq.svg"`) from `src/lib/assets.ts`.
- Extract UI icons as SVG React components in `src/components/icons/index.tsx` and import icons from there across the app.

## Marketing Responsive Conventions

The `(marketing)` route group is mobile-first. Always design for the smallest viewport first and let things scale up — never the other way around.

### Breakpoints (Tailwind defaults)

| Prefix | Min width | Used for                                |
| ------ | --------- | --------------------------------------- |
| _none_ | 0–639 px  | Phones (design target: 360 px)          |
| `sm:`  | 640 px    | Large phones / very small tablets       |
| `md:`  | 768 px    | Tablets — desktop nav becomes visible   |
| `lg:`  | 1024 px   | Small laptops — multi-column layouts    |
| `xl:`  | 1280 px   | Desktops — full marketing canvas        |
| `2xl:` | 1536 px   | Wide desktops                           |

Avoid one-off arbitrary breakpoints (`min-[864px]:`, etc.). If a layout needs an in-between breakpoint, it almost always means the layout itself should be reworked.

### Type Tokens

Defined in `tailwind.config.ts`. They use `clamp()` so the size scales fluidly between phone and desktop — **prefer these to ad-hoc `text-[44px] md:text-[64px]` pairs.**

| Class           | Range          | Use for                                          |
| --------------- | -------------- | ------------------------------------------------ |
| `text-display`  | 36 → 64 px     | Hero `<h1>` headlines                            |
| `text-h1`       | 30 → 48 px     | Section headings (`<h2>` inside `SectionHeading`) |
| `text-h2`       | 24 → 34 px     | Sub-section / card titles                        |
| `text-h3`       | 20 → 24 px     | Minor headings                                   |
| `text-eyebrow`  | 12 → 18 px     | Uppercase labels above headings                  |
| `text-body-lg`  | 16 → 20 px     | Lede / supporting paragraphs                     |

Plain body copy uses Tailwind's defaults (`text-sm` / `text-base`).

### Spacing Tokens

- `pt-header` — top padding on the first section of every page so it clears the absolute `Header`. Mobile = 80 px, md+ = 120 px (driven by `--header-offset` in `globals.css`). Use this **instead of** any per-page `pt-[120px] / pt-[138px]` value.
- `min-h-tap` / `size-tap` — 44 px minimum tap target. Apply to any interactive element below that size (icon buttons, switch chips, etc.).

### Shared Primitives (`src/app/(marketing)/components/shared.tsx`)

- `Container` — mobile-first horizontal padding (`px-4 sm:px-6 lg:px-8`) and the 1240 px max width. **Do not** put your own `px-*` on a `Container`.
- `Section` — vertical rhythm wrapper. `tone="default" | "surface" | "brand" | "footer"` and `spacing="default" | "compact" | "flush"`. Wrap each marketing section in this rather than hand-rolling `<section className="py-X">`.
- `SectionHeading` — eyebrow + title + description. Defaults to centered. Pass `align="left"` for split layouts and `tone="light"` over dark backgrounds.
- `PrimaryButton` / `SecondaryButton` — full-width below `sm`, content-sized at `sm+`, with a 44 px minimum height. Buttons no longer hard-code `w-[171px]` — pass `sm:w-[171px]` only when a fixed pill is required.

### Hero Sections

Use `MarketingHero` from `src/app/(marketing)/components/MarketingHero.tsx` for any hero. It handles the header offset, type tokens, button stacking, and provides slots for `eyebrow`, `title`, `body`, `actions`, `media`, `background`, and `floating` stat pills. The `background` and `media` slots are automatically hidden / restacked at small viewports — pages should not need to manage those breakpoints themselves.

For brand-coloured rounded-card heroes (Independent Agent, Partners, Referral) use `MarketingBrandHero` instead. Same slot model, but the title sits inside a brand-purple rounded card and the layout collapses to a single column below `lg+` (no more `lg:absolute` positioning that broke between md and lg).

### Section Primitives

| Primitive            | Use for                                                       |
| -------------------- | ------------------------------------------------------------- |
| `MarketingHero`      | Standard page hero (text + optional media + decorative bg)    |
| `MarketingBrandHero` | Brand-purple rounded-card hero variant                        |
| `MarketingSplit`     | Generic two-column section (text + media). Always 1-col ≤ md  |
| `MarketingCtaCard`   | Closing "join us" CTA card with optional decorations          |
| `SolutionsConsultationCta` | The "Need Help in Cutting…" brand card shared by every `solutions/*` page. Hides the chat illustration below `lg`. |
| `StepList`           | Numbered steps. `direction="vertical" \| "grid"` and 3 sizes  |
| `StatList`           | Label/value rows with hairline dividers; stacks below sm      |
| `MarketingCard`      | Property / project / market cards with image, pills, stats    |
| `StatusPill`         | Image-overlay badges (12–14 px tall). Min text size `text-xs` |
| `FloatingStatPill`   | Floating stat overlay for hero illustrations (lg+ only)       |
| `CopyLinkInput`      | Read-only URL input with a Copy button; stacks below sm       |
| `FaqList`            | Accordion FAQ list. `min-h-tap` rows, fluid type, arbitrary `idPrefix` |

All of these are mobile-first: cards, badges, and inline stat rows shrink and reflow correctly down to a 360 px viewport without per-page tweaks. Pass page-specific design overrides via the `className` prop only — never re-implement the responsive behaviour inline.

### Icon Sizing Scale

Use one of these standard sizes for any icon. Avoid arbitrary values (`size-[35px]`, `size-[37px]`, etc.) unless an icon is decoration only.

| Class    | Pixels | Use for                                                       |
| -------- | ------ | ------------------------------------------------------------- |
| `size-3` | 12 px  | _Avoid for solo icons._ Only paired with `text-xs` labels.    |
| `size-4` | 16 px  | Inline accent icons next to body text                          |
| `size-5` | 20 px  | Button icons, list bullets, status indicators                  |
| `size-6` | 24 px  | Primary action icons, social icons, mobile hamburger / close   |
| `size-8` | 32 px  | Feature card icons, dropdown menu accents                      |
| `size-tap` | 44 px | Tap target wrapper (the icon inside is usually `size-5`/`size-6`) |
| `size-12` / `size-14` | 48–56 px | Numbered step badges (small/medium)            |

Icons sit on a `size-tap` clickable wrapper whenever they're the entire interactive element (header hamburger, mobile sheet close, copy buttons in tight rows). Decorative spheres, polygons, and large brand illustrations are exempt from this scale — they live in the hero `background` / `media` slots.

### Mobile Navigation

The `Header` collapses to a hamburger below `md` and opens a full-screen accordion sheet (`MobileNavSheet` inside `Header.tsx`) that contains the same nav items, language switcher, and Sign In CTA as desktop. The sheet locks body scroll via the `body[data-scroll-locked]` rule in `globals.css`.

### Recurring Anti-patterns To Fix On Sight

1. Decorative `absolute` images without an `sm:`+ guard — wrap in `hidden sm:block`.
2. Two-column grids like `lg:grid-cols-[1fr_597px]` — replace with `lg:grid-cols-2` or fractional units.
3. Floating stat pills with negative offsets (`-left-4 -top-4`) — only apply at `lg+` (`lg:absolute lg:-left-4 lg:-top-4`).
4. Status pills smaller than `text-xs` — bump to `text-xs` minimum.
5. Hard-coded `<br />` inside hero / section titles — let text wrap, or hide with `hidden lg:inline`.
6. Hand-rolled FAQ accordions — use `FaqList` with a unique `idPrefix` so multiple lists on one page don't clash on `aria-controls`.
7. Fixed-pixel two-column grids (`lg:grid-cols-[1fr_597px]`) where one side is a card — switch to `lg:grid-cols-[minmax(0,1fr)_minmax(0,597px)]` so the card has a max width but the text side stays fluid.
8. Brand-coloured CTA cards with `h-[455px]` and `<button class="h-[53px] w-[224px] bg-white">` markup — use `MarketingCtaCard` instead and pass `<PrimaryButton className="bg-white text-brand sm:w-[224px]">` for the white pill.
9. Repeated "Need Help in Cutting down Marketing Cost?" brand cards across the four `solutions/*` pages — use `SolutionsConsultationCta` and pass per-page `buttonIcon` + `illustration` only.
10. Hero illustrations using `lg:absolute lg:left-[…] lg:top-[…]` to position polygons / orbs around an image — use `MarketingBrandHero` (or `MarketingHero`) and put the visual in `media`, the stat card in `floating`. The wrapper handles stacking below `lg` so polygons don't escape their container.
11. Cards / pill rows that overflow at 360 px because they use a fixed-width flex row (`flex gap-* w-[122px]…`) — wrap in `-mx-* overflow-x-auto px-*` on mobile and switch to `sm:justify-center sm:overflow-visible` once the parent has room. Same pattern for tab rows (FAQ category pills) so long category names never wrap into ragged lines.
12. Section testimonials / cards that "float" up into the next section via `lg:absolute lg:-translate-x-1/2 top-[-180px]` — replace with a normal flow card group inside the same section. The visual relationship (white panel on top of brand) survives without the breakpoint hole between md and lg.
