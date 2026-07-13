# Asset Union Architecture Guide

This document is the source of truth for contributors and coding agents working in this repository. It describes the project as it exists today, the intended direction, and the conventions that keep implementation consistent.

## 1) Project Scope and Product Areas

This repository currently contains two product surfaces:

1. **Marketing site** (active, primary)
   - Public-facing pages under `src/app/(marketing)`.
   - Home page is the most complete implementation and serves as the visual baseline.
2. **Admin dashboard demo** (reference-only)
   - Located under `src/app/admin`.
   - Built as a high-fidelity UI demo and **will be moved to a separate project**.
   - Use it as a style/UX reference for building the future user dashboard, not as a long-term architectural dependency.

## 2) Tech Stack and Runtime

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + `globals.css` CSS variables
- **Utilities**: `clsx`, `tailwind-merge`, `class-variance-authority`
- **State/data libs available**: `zustand`, `@tanstack/react-query`, `@tanstack/react-table`
- **Icons**: custom icons in `src/components/icons` + `lucide-react`
- **Package manager**: pnpm

Key commands:

- `pnpm dev`
- `pnpm build`
- `pnpm start`

## 3) High-Level Directory Intent

### App routes

- `src/app/layout.tsx`: global HTML/body shell and font setup.
- `src/app/globals.css`: global tokens and base element styling.
- `src/app/(marketing)`: marketing routes and route-group layout.
- `src/app/admin`: demo admin dashboard (to be extracted later).

### Shared implementation layers

- `src/components/ui`: reusable low-level primitives (`Card`, `Badge`, `DataTable`).
- `src/components/icons`: project-specific SVG icon components.
- `src/components/marketing`: emerging marketing abstraction layer (section/shell wrappers).
- `src/content/marketing`: content/config objects for marketing navigation and page copy.
- `src/lib`: utilities and asset exports (`cn`, static asset aliases).

### Static assets

- `public/images`: local static images.
- `src/lib/assets.ts`: centralized typed exports for image imports (e.g., logo, hero image).
- Some components currently use Figma MCP asset URLs directly (`https://www.figma.com/api/mcp/asset/...`) for design-accurate mock content.

## 4) Routing and Page Status

### Marketing routes (`src/app/(marketing)`)

- `/` -> home page (`HomePage`) composed from many section components.
- Additional routes exist for:
  - `academy`
  - `faq`
  - `refer-and-earn`
  - `marketplace/*`
  - `solutions/*`
  - `legal/*`
- Most non-home marketing routes are currently placeholders and should be implemented progressively using shared patterns.

### Admin routes (`src/app/admin`)

- Fully scaffolded multi-page dashboard demo with:
  - sidebar/top nav shell
  - tables/cards/forms
  - settings, notifications, user management, compliance, etc.
- Treated as **reference UX** for the future user dashboard implementation.
- Do not couple new long-term business logic to `admin` paths/modules.

## 5) Composition Patterns

### Marketing surface

- Primary composition pattern: page-level assembly from section components.
- Home page order and section granularity in `src/app/(marketing)/home/HomePage.tsx` is the canonical baseline for spacing, tone, and conversion flow.
- Shared section helpers currently live in `src/app/(marketing)/components/shared.tsx`:
  - `Container`
  - `SectionHeading`
  - `PrimaryButton`
  - `SecondaryButton`

### Admin demo surface

- Route pages mostly client components with static in-file demo datasets.
- Shared shell:
  - `AdminLayoutShell` for title/active nav detection from pathname.
  - `AdminSidebar`, `AdminTopNav` for frame UI.
- Shared presentational primitives:
  - `Card`, `Badge`, `DataTable`.

## 6) Styling System and Design Tokens

Primary token sources:

- `src/app/globals.css` (CSS custom properties)
- `tailwind.config.ts` (`theme.extend.colors`, `maxWidth.container`, font family, etc.)

Important conventions:

- Use semantic Tailwind color keys (`bg-background`, `text-foreground`, `text-brand`) over ad-hoc values when possible.
- Container width baseline: `max-w-container` (1240px).
- Default font family is DM Sans via CSS variable.
- Keep section IDs on marketing page sections for anchor navigation and `scroll-margin-top`.

## 7) Content and Copy Strategy

Two active approaches currently coexist:

1. **In-component copy/data** (common in `home/*` and admin demo pages).
2. **Content modules** in `src/content/marketing/*` (emerging pattern for scalable page copy).

Preferred direction for new marketing pages:

- Put page copy/config in `src/content/marketing/...`.
- Keep sections/components focused on rendering data structures.
- Avoid large hardcoded copy blocks directly inside JSX when building new pages.

## 8) Asset and Icon Conventions

- Use `next/image` for local bundle-managed images when practical.
- Use centralized imports from `src/lib/assets.ts` for shared brand assets.
- Keep custom SVG icons under `src/components/icons`.
- For JSX SVG attributes, use React-correct prop names (for example `strokeWidth`, `stopColor`, `maskType`) to avoid runtime/lint issues.

## 9) Path Aliases

From `tsconfig.json`:

- `@/*` -> `src/*`
- `@/public/*` -> `public/*`
- `@/images/*` -> `public/images/*`
- `@/icons/*` -> `src/components/icons/*`

Always prefer aliases over deep relative imports across domains.

## 10) Dashboard Direction (Important)

The `src/app/admin` implementation is a **visual and interaction reference only** for the upcoming user dashboard product area.

When implementing the real user dashboard:

- Reuse UI language (spacing, table behavior, chips, cards) from admin demo.
- Avoid introducing new feature logic under `src/app/admin`.
- Build dashboard-specific routes/components in their own dedicated route group/domain.
- Extract reusable primitives into `src/components/ui` (or a new dedicated dashboard component area) instead of duplicating page-local markup.

## 11) Figma MCP Workflow Guidance for Agents

This project is expected to receive Figma design links for page/component implementation.

When implementing from Figma:

1. Fetch design context from Figma MCP for the target node/file.
2. Treat generated code as a reference, not final output.
3. Adapt implementation to this repository's structure:
   - route in `src/app/(marketing)` (or future dashboard route area),
   - sections/components in `src/components/...` where appropriate,
   - copy/data in `src/content/marketing/...`,
   - assets through `public/images` + `src/lib/assets.ts`.
4. Match existing tokens and spacing scale before adding new values.
5. Preserve semantic HTML and accessibility (landmarks, heading order, button/link semantics, alt text).
6. Prefer consistency with current home page patterns over raw absolute positioning from design exports.

## 12) Known Transitional Areas

The codebase is in active refactor. Expect mixed patterns while migration continues.

Examples:

- Legacy home sections/components under `src/app/(marketing)/home/*`.
- Emerging wrappers under `src/components/marketing/*` that currently re-export legacy sections.

For now:

- Follow existing working imports in touched files.
- If refactoring, do it incrementally and keep routes functional.
- Avoid broad moves/renames unless explicitly requested.

## 13) Change Rules for Future Contributors/Agents

- Prioritize consistency with existing visual language and component patterns.
- Keep changes scoped; avoid speculative architecture rewrites.
- Do not use `src/app/admin` as a dependency anchor for future core app features.
- Prefer typed data models for repeated section content.
- Reuse `Container`, buttons, headings, and `cn()` utility patterns.
- Update this `architecture.md` when introducing a new canonical pattern or folder contract.
