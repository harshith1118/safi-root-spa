# Root SPA — TACT-SPA-001

A standalone, configuration-driven single-page landing application for the SAFI Root SPA
statement of work (TACT-SPA-001). All page content comes from a validated **Initial
Context JSON** file; the React application is presentation only.

- **Published preview:** https://harshith1118.github.io/safi-root-spa/
- **Application directory:** `Root/`
- **Status:** Static front end only. No backend, authentication, CMS, or SAFI platform
  integration is implemented. See [Current limitations](#current-limitations-and-pending-safi-integration).

---

## Overview and current implementation scope

The app renders a single landing page from `Root/src/config/initial-context.json` and
validates that file against a JSON Schema at startup. If the configuration is invalid the
app fails fast with a readable error instead of rendering partial content.

Implemented:

- Configuration-driven rendering of four section types with dedicated components:
  `hero`, `features`, `text`, and `cta`.
- A generic renderer used for the remaining schema types (`testimonials`, `gallery`,
  `faq`) that outputs heading, description, and optional items.
- Service cards (`features` type) with an accessible "Learn more" disclosure that expands
  per-card detail lines.
- Header navigation generated from the configured sections, a mobile menu toggle, and a
  "skip to main content" link.
- JSON Schema (Draft 2020-12) plus Ajv validation with additional application-level rules.
- Responsive layout (breakpoints at `480px`, `768px`, and `1024px`) and reduced-motion
  support.
- A GitHub Actions workflow that lints, builds, and deploys `Root/dist` to GitHub Pages.

Not implemented: any server-side component, contact form or endpoint, authentication,
runtime content loading, routing/multi-page generation, analytics, or automated tests.

---

## Technology stack

Versions are the declared ranges in `Root/package.json`; `Root/package-lock.json`
(lockfile version 3) pins the installed tree.

| Area | Package / tool | Version |
| --- | --- | --- |
| UI runtime | `react`, `react-dom` | `^19.3.1` |
| Language | `typescript` | `~7.0.2` |
| Build tool / dev server | `vite` | `^8.3.6` |
| React plugin | `@vitejs/plugin-react` | `^6.1.2` |
| Schema validation | `ajv` (Draft 2020-12 build) | `^8.20.0` |
| Format validation | `ajv-formats` | `^3.0.1` |
| Linter | `oxlint` | `^1.90.0` |
| Node types | `@types/node` | `^24.19.2` |
| CI Node.js | GitHub Actions `setup-node` | `22` |

Deliberately absent: no test runner, no CSS framework (Tailwind), no component library, no
router, and no state-management library. Styling is plain CSS (`src/index.css`,
`src/App.css`).

---

## Repository structure

```text
safi-root-spa/
├─ .github/
│  └─ workflows/
│     └─ deploy-pages.yml        # lint → build → deploy Root/dist to GitHub Pages
├─ Root/                         # the application (run npm commands here)
│  ├─ index.html                 # HTML entry, fonts, favicon, <title>
│  ├─ package.json
│  ├─ package-lock.json          # npm lockfile v3
│  ├─ vite.config.ts             # base: '/safi-root-spa/'
│  ├─ tsconfig.json              # project references
│  ├─ tsconfig.app.json          # app compiler options
│  ├─ tsconfig.node.json         # Vite config compiler options
│  ├─ .oxlintrc.json             # oxlint plugins and rules
│  ├─ .gitattributes             # * text=auto eol=lf
│  ├─ public/
│  │  ├─ favicon.svg
│  │  └─ icons.svg
│  └─ src/
│     ├─ main.tsx                # entry; imports validation before rendering
│     ├─ App.tsx                 # section components, layout, nav, footer
│     ├─ App.css                 # component and layout styles
│     ├─ index.css               # design tokens, resets, global styles
│     ├─ assets/                 # hero.png and leftover template SVGs
│     ├─ config/
│     │  ├─ initial-context.json # the Initial Context content
│     │  ├─ types.ts             # TypeScript types mirroring the schema
│     │  ├─ validate.ts          # Ajv setup + application-level rules
│     │  └─ reserved-pathnames.ts# reserved PathName list (currently empty)
│     └─ schemas/
│        └─ root-spa.schema.json # JSON Schema Draft 2020-12
├─ AI_RULES.md                   # rules for contributors and AI agents
└─ README.md
```

Notes:

- The application is in `Root/`, not the repository root. Run `npm` commands from `Root/`.
- `Root/.git` is a separate nested Git repository that exists in the working copy. The
  authoritative repository is the project root; run `git` commands from `safi-root-spa/`.
- `Root/dist/` and `Root/node_modules/` are ignored by `Root/.gitignore` and are not
  committed. `.env` files are ignored as well.
- `src/assets/` (`hero.png`, `react.svg`, `vite.svg`) is not referenced by any component;
  page images are remote URLs declared in `App.tsx`.

---

## Prerequisites

- **Node.js 22.x** — the GitHub Actions workflow pins Node 22; use the same major locally.
- **npm** — ships with Node.js; `npm ci` requires the committed lockfile.
- **Git** — all work is tracked in this repository.
- No AWS, Cognito, or SAFI credentials are required to install, run, lint, or build the
  project.

---

## Installation and local development

```bash
cd Root
npm ci
npm run dev
```

Then open:

```text
http://localhost:5173/safi-root-spa/
```

`vite.config.ts` sets `base: '/safi-root-spa/'`, so the app is served under that path in
development and in the production build, matching the GitHub Pages project URL. The dev
server also answers on `/`, but `/safi-root-spa/` is the canonical path.

- Use `npm ci` for a clean install from `Root/package-lock.json`.
- Use `npm install <package>` only when intentionally adding a dependency, and commit the
  updated lockfile in the same change.

---

## Lint, type check, and production build

```bash
cd Root
npm run lint      # oxlint
npm run build     # tsc -b && vite build
```

| Script | Command | Purpose |
| --- | --- | --- |
| `npm run dev` | `vite` | Development server with HMR |
| `npm run build` | `tsc -b && vite build` | Type check via project references, then bundle to `Root/dist/` |
| `npm run lint` | `oxlint` | Lint with the `react`, `typescript`, and `oxc` plugins |
| `npm run preview` | `vite preview` | Serve an existing production build locally |

`npm run build` is also the type check: `tsc -b` runs the `tsconfig.app.json` and
`tsconfig.node.json` projects with `noEmit`. Build output goes to `Root/dist/`, which is
git-ignored. `npm run preview` requires a prior `npm run build` and serves the bundle at
`http://localhost:4173/safi-root-spa/`.

There is no `test` script in `package.json`. Verification currently means lint, build, and
manual browser checks.

---

## Initial Context configuration

The content file is `Root/src/config/initial-context.json`. It is imported at build time,
so content changes require a rebuild (or dev-server reload) to appear.

Abridged but schema-valid example:

```json
{
  "templateVersion": "1.0.0",
  "pathName": "sample-home-services",
  "displayName": "Sample Home Services",
  "title": "Home Services for Every Need",
  "subtitle": "Plumbing, electrical, and HVAC help for your home.",
  "theme": "clean",
  "sections": [
    {
      "id": "home",
      "type": "hero",
      "heading": "Welcome to Sample Home Services",
      "description": "Maintenance and repairs for your home."
    },
    {
      "id": "services",
      "type": "features",
      "heading": "Our Services",
      "description": "What we can help with.",
      "items": [
        {
          "title": "Plumbing",
          "description": "Repairs, installations, and maintenance.",
          "details": ["Leak detection", "Pipe installation"]
        }
      ]
    },
    {
      "id": "contact",
      "type": "cta",
      "heading": "Get Started Today",
      "description": "Browse our services to see how we can help.",
      "buttonText": "Explore Services",
      "buttonUrl": "#services"
    }
  ]
}
```

### Required top-level fields

| Field | Required | Constraint |
| --- | --- | --- |
| `templateVersion` | yes | Semantic version string, `^\d+\.\d+\.\d+$` |
| `pathName` | yes | `^[a-z0-9]+(?:-[a-z0-9]+)*$`; must not be in the reserved list |
| `displayName` | yes | 1–100 characters |
| `title` | yes | 1–200 characters |
| `subtitle` | yes | 1–300 characters |
| `theme` | yes | One of `clean`, `modern`, `classic`, `minimal` |
| `sections` | yes | Array with at least one section |

`additionalProperties` is `false` at the root, section, and item levels, so unknown keys
are rejected rather than silently ignored.

### Section fields

| Field | Required | Constraint |
| --- | --- | --- |
| `id` | yes | `^[a-z0-9-]+$`; must be unique across sections |
| `type` | yes | `hero`, `features`, `text`, `cta`, `testimonials`, `gallery`, `faq` |
| `heading` | yes | 1–150 characters |
| `description` | yes | 1–1000 characters |
| `items` | no | Non-empty array; required by the `features` rules |
| `buttonText` | no | 1–50 characters; must be paired with `buttonUrl` |
| `buttonUrl` | no | Absolute `http(s)` URL or same-page anchor `^#[a-z0-9-]+$` |

### Item fields

| Field | Required | Constraint |
| --- | --- | --- |
| `title` | yes | 1–100 characters |
| `description` | yes | 1–300 characters |
| `details` | no | 1–8 strings, each 1–120 characters |

### Fields that are validated but not currently rendered

- `title` and `subtitle` are validated and typed but are not read by the UI. The document
  `<title>` comes from `Root/index.html` (currently `root`).
- `theme` is applied to the root element as a `theme-<value>` class, but no per-theme CSS
  rules exist yet, so all four values currently render identically.

---

## JSON Schema Draft 2020-12 and Ajv validation

- Schema: `Root/src/schemas/root-spa.schema.json`, declaring
  `"$schema": "https://json-schema.org/draft/2020-12/schema"`. Its `$id` is a placeholder
  `example.com` namespace identifier only; it is never fetched at runtime and is not a
  link.
- Runtime validation: `Root/src/config/validate.ts` creates an Ajv instance with
  `strict: true`, `allErrors: true`, and `strictSchema: true`, registers `ajv-formats`, and
  compiles the schema with `ajv/dist/2020` (the Draft 2020-12 build).
- The validator runs at module load. `Root/src/main.tsx` imports `./config/validate`
  before rendering, so an invalid configuration throws immediately rather than rendering a
  partially configured page.
- `validatedConfig` is the validated, typed configuration used by `App.tsx`.
  `validateAndType(config)` exposes the same checks for any supplied object.

Rules enforced in addition to the JSON Schema:

1. **Unique section IDs** — duplicates are rejected (JSON Schema cannot express this).
2. **Reserved PathNames** — `pathName` is compared case-insensitively against
   `RESERVED_PATH_NAMES`. The list is intentionally empty until SAFI publishes the
   official reserved routes.
3. **Section-specific requirements** — `hero` and `text` require heading and description;
   `features` requires a non-empty `items` array, and every item needs a title and
   description; `cta` requires `buttonText` and `buttonUrl` together.
4. **Details consistency** — for a `features` section, either every item defines
   `details` or none do. Partial configuration is rejected so all cards behave the same.
5. **CTA URL safety** — same-page anchors must match `^#[a-z0-9-]+$`; otherwise the value
   must parse as a URL with an allowed protocol (`https:` or `http:`). Other schemes such
   as `javascript:` are rejected.

Errors are thrown as `Error` objects with the failing instance path, schema keyword, and a
readable message.

---

## How to add or modify sections

1. Edit `Root/src/config/initial-context.json`.
2. Choose an existing `type` (see below). Keep `id` unique and lowercase/hyphenated; the
   ID becomes both the DOM anchor and the navigation link target.
3. If you use `features`, supply at least one item, and add `details` to **all** items or
   to none. Each item should have a `title` that matches a key in `SERVICE_IMAGES`
   (`Plumbing`, `Electrical`, `HVAC`) in `App.tsx`, otherwise the Plumbing image is used
   as a fallback.
4. For `cta`, set `buttonText` and `buttonUrl` together. Use an `#anchor` for same-page
   navigation or an `https://` URL for external destinations (external URLs open in a new
   tab; anchors stay in the same tab).
5. Run the checks and reload the page:

   ```bash
   cd Root
   npm run lint
   npm run build
   npm run dev
   ```

Supported types and their rendering:

| Type | Renderer | Behavior |
| --- | --- | --- |
| `hero` | `HeroSection` | Heading, description, primary and secondary buttons, hero image |
| `features` | `FeaturesSection` → `ServiceCard` | Grid of cards with expandable detail lines |
| `text` | `AboutSection` | Heading, paragraph, and image |
| `cta` | `CtaSection` | Heading, description, optional button; hidden entirely if heading or description is missing |
| `testimonials`, `gallery`, `faq` | `GenericSection` | Heading, description, and optional plain items; no dedicated design |

Adding a new section **type** is not a content-only change: it requires a new component
(and styles) in `App.tsx`/`App.css`, a case in `RenderSection`, and matching updates to the
schema, `types.ts`, and `validate.ts`. Do not add a type to the schema that has no
renderer path.

---

## GitHub Actions and GitHub Pages

Workflow: `.github/workflows/deploy-pages.yml`.

- **Triggers:** push to `main`, plus manual `workflow_dispatch`.
- **Permissions:** `contents: read`, `pages: write`, `id-token: write` (OIDC for Pages).
- **Concurrency:** group `pages`, `cancel-in-progress: false`, so deployments serialize.
- **Build job:** checkout → Node 22 with npm cache keyed to `Root/package-lock.json` →
  `npm ci` → `npm run lint` → `npm run build` → `actions/configure-pages` →
  `actions/upload-pages-artifact` with `path: Root/dist`.
- **Deploy job:** depends on `build`, runs in the `github-pages` environment, and uses
  `actions/deploy-pages`.

One-time repository setup (a GitHub setting, not something the workflow can configure):
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

Preview URL: **https://harshith1118.github.io/safi-root-spa/**

Deployment behavior to keep in mind:

- Only committed content on `main` is published. Local commits are not public until
  pushed, and a failed lint or build step prevents deployment.
- The app is built with `base: '/safi-root-spa/'` to match the project-site subpath.
- Run status and logs are on the repository's **Actions** tab; the deployed URL is shown on
  the `github-pages` environment.
- The workflow does not create or use a `gh-pages` branch, and there is no manual artifact
  copy; Pages is fed only by the workflow.

---

## Current limitations and pending SAFI integration

- **No contact channel.** There is no contact form, email address, phone number, or API
  endpoint. The CTA button navigates to `#services`, and the hero primary button does the
  same.
- **No SAFI platform integration.** Cognito authentication, EFS publishing, native
  SafiChat operations, and rollback are not implemented. Nothing in this repository
  performs those actions.
- **Reserved PathNames pending.** `Root/src/config/reserved-pathnames.ts` is an empty array
  by design; the official reserved-route list must come from SAFI and must not be guessed.
- **Single page, no routing.** `pathName` is configuration metadata; it does not generate
  routes or additional pages. There is no router and no per-path build.
- **Configuration is bundled at build time.** Content is imported from JSON; there is no
  CMS, API, or runtime fetch, so content changes ship through a rebuild and redeploy.
- **No automated tests.** The current gate is oxlint plus the TypeScript build.
- **Theme is not visual yet.** All four `theme` values are accepted but no theme-specific
  CSS exists.
- **`title` / `subtitle` are unused** by the UI; the browser tab title comes from
  `index.html`.
- **External runtime dependencies.** Fonts load from Google Fonts, and section images are
  hotlinked from Unsplash and Pexels. If those hosts block or remove an asset, the page
  degrades to missing fonts or images.
- **Placeholder content.** Copy and images are sample landing-page content, not approved
  production marketing material.
- **Pages source must be set manually.** The repository cannot verify or change the Pages
  publishing source; it must be set to **GitHub Actions** in repository settings.

Pending SAFI work (blocked on SAFI-provided contracts, credentials, and route lists):
authentication integration, storage/publishing integration, SafiChat embedding, rollback
procedure, official reserved PathNames, and approved production content.

---

## Related documentation

`AI_RULES.md` defines the rules for changing this repository, including architecture,
validation, safety, and verification requirements.
