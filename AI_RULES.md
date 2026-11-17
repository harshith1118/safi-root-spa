# AI Rules — Root SPA (TACT-SPA-001)

Rules for anyone — human or AI agent — changing this repository. Read `README.md` for the
verified project facts; this file defines how changes must be made.

## Purpose

This repository implements a standalone, configuration-driven Root SPA landing page for
SAFI TACT-SPA-001. It is a **static front end**: content lives in Initial Context JSON,
the React app renders it, and GitHub Pages hosts the build. It is not a SAFI platform
integration and must not pretend to be one.

## Fixed technology stack

Do not replace or substitute these without an explicit decision recorded in the repository:

- React 19 + TypeScript, built with Vite.
- Plain CSS in `src/index.css` (tokens, resets) and `src/App.css` (components).
- `ajv` + `ajv-formats` with the Draft 2020-12 build (`ajv/dist/2020`).
- `oxlint` for linting; `tsc -b` for type checking as part of `npm run build`.
- npm with the committed `Root/package-lock.json`.
- GitHub Actions + GitHub Pages for preview deployment.

Not present and not to be assumed: Tailwind, shadcn/ui, a component library, React Router,
a state-management library, a test runner, or any backend SDK.

## Preserve the architecture

- The application lives in `Root/`; run all npm commands from `Root/`.
- Keep the separation between:
  - `src/config/initial-context.json` — content data,
  - `src/config/types.ts` — types mirroring the schema,
  - `src/config/validate.ts` — schema and rule enforcement,
  - `src/schemas/root-spa.schema.json` — the JSON Schema contract,
  - `src/App.tsx` / `src/App.css` — presentation.
- Section components (`HeroSection`, `FeaturesSection`, `ServiceCard`, `AboutSection`,
  `CtaSection`, `GenericSection`) are dispatched by `RenderSection`. Add behavior there,
  not by duplicating layout logic in new entry points.
- `src/main.tsx` must keep importing `./config/validate` before rendering so validation
  fails fast at startup.
- Do not introduce a second app entry, a server, a proxy layer, or a parallel styling
  system.

## Follow existing code style and patterns

- TypeScript only for application code; no plain JavaScript files in `src/`.
- Function components with explicit prop types, as in the existing components.
- Use `import type` for type-only imports (`verbatimModuleSyntax` is enabled).
- No semicolons, single quotes, two-space indentation — match the surrounding files.
- `noUnusedLocals` and `noUnusedParameters` are on: no dead variables or props.
- `erasableSyntaxOnly` is on: no enums, namespaces, or parameter properties.
- Prefer small, local components and CSS classes over inline styles.
- Add a comment only where the reason for the code is not obvious.
- Do not reformat unrelated files or rename existing exports/classes as drive-by cleanup.

## Keep content configuration-driven

- All page copy and section structure belong in `Root/src/config/initial-context.json`.
- Do not hardcode new headings, paragraphs, or CTA labels into JSX when the config can
  express them. Existing exceptions are presentational strings such as the eyebrow labels
  and the hero button label; if you add content, prefer the config.
- `id` values become DOM anchors and navigation links. Keep them unique, lowercase, and
  hyphenated.
- Keep the browser-visible content consistent with the configuration; do not let JSX and
  JSON drift.
- If you rename a `features` item title, update the `SERVICE_IMAGES` map in `App.tsx`
  (unknown titles fall back to the Plumbing image).

## Never bypass validation

- Components must consume the validated export (`validatedConfig`), not import
  `initial-context.json` directly.
- Do not remove, weaken, or skip the Ajv compile/validate step to make content "work".
- Do not relax `strict`, `allErrors`, or `strictSchema`, and do not drop `ajv-formats`.
- When extending the format, update **all four** in the same change: the JSON Schema, the
  TypeScript types, the section rules in `validate.ts`, and `initial-context.json` if a
  default is needed.
- Existing non-schema rules that must keep working: unique section IDs, reserved PathName
  rejection, `hero`/`text` heading+description requirements, `features` non-empty items,
  all-or-none `details`, `cta` button text/URL pairing, and CTA URL protocol checks.
- Never add `additionalProperties: true` or permissive catch-all schemas to accept
  malformed content.

## Configuration must stay data, not code

Do not introduce any of the following into Initial Context JSON or the schema:

- Executable JavaScript, `<script>` content, `eval`, `Function`, event handlers, or HTML
  fragments intended for injection.
- Secrets, API keys, tokens, credentials, connection strings, or `.env` values.
- IAM policies, role definitions, account IDs, or cloud resource identifiers.
- Arbitrary routes, redirects, or path generation. `pathName` is metadata; it does not
  create routes.
- Remote URLs beyond the already-supported fields; do not add a "fetch from URL" or
  "remote config" field.

Content is rendered as React text. Do not add `dangerouslySetInnerHTML` or equivalent.

## PathName and URL safety

- `pathName` must match `^[a-z0-9]+(?:-[a-z0-9]+)*$` and must not be a reserved name.
- `RESERVED_PATH_NAMES` in `src/config/reserved-pathnames.ts` is intentionally empty
  because SAFI has not published the official list. Do not invent or guess reserved names;
  wait for SAFI's list and add it with a reference.
- CTA `buttonUrl` must be an absolute `https:`/`http:` URL or a same-page anchor matching
  `^#[a-z0-9-]+$`. Never allow `javascript:`, `data:`, `file:`, or `mailto:` by loosening
  the validator.
- Keep in-page anchors in the same tab; open external URLs with
  `target="_blank" rel="noopener noreferrer"`. Use the existing `externalLinkProps` helper
  instead of re-implementing the check.

## Responsive design and accessibility

Preserve and extend the current behavior; do not regress it:

- Layout must work at mobile, tablet, and desktop widths. Existing breakpoints are
  `480px`, `768px`, and `1024px`; use the CSS custom properties in `index.css` instead of hardcoded
  colors, spacing, or the `72px` header height (`--header-height`).
- `section[id]` has a scroll margin so anchors are not hidden behind the fixed header. Keep
  it working when changing header height.
- Keep the skip link, semantic landmarks (`header`, `nav`, `main`, `footer`), and a single
  `h1`.
- Disclosure controls keep `aria-expanded` and `aria-controls`; collapsed detail regions
  stay out of the accessibility tree (`aria-hidden`), and interactive elements must be real
  `button`/`a` elements with visible focus.
- Every image needs descriptive `alt` text; decorative icons use `aria-hidden="true"`.
- Respect `prefers-reduced-motion` for any new animation or transition.
- Do not remove focus styles or trap keyboard focus in the mobile menu.

## Dependencies and scope

- Do not add a dependency unless the task cannot be met with the existing stack, and state
  the reason in the change.
- Do not swap Vite for another bundler, React for another framework, or CSS for a
  framework.
- Keep changes scoped to the request. Do not touch `App.css`, images, or unrelated sections
  when the task is content-only.
- Never commit `Root/dist/`, `Root/node_modules/`, `.env` files, or editor/OS artifacts.

## Required verification after code changes

Run these from `Root/` before declaring work done:

```bash
npm run lint
npm run build
```

- `npm run build` includes the TypeScript check (`tsc -b`); a passing lint alone is not
  enough.
- For content or behavior changes, load the app at `http://localhost:5173/safi-root-spa/`
  and check the affected section, keyboard focus, and a narrow viewport.
- If a command fails, report the actual error and the next action; never describe a failing
  check as passing.

## Git workflow

- Review `git diff` and `git status` before committing. Confirm the change set contains only
  the intended files and no unrelated edits.
- Run `git diff --check` to catch whitespace errors.
- Stage files explicitly; do not use blanket `git add -A` when a curated set is expected.
- Commit atomically with a clear message. Do not commit or push unless the task authorizes
  it, and never force-push or rewrite history.
- Run Git from the repository root (`safi-root-spa/`). `Root/.git` is a separate nested
  repository that exists in the working copy; it is not the source of truth.
- Git is the source of truth. If documentation, chat history, or a summary disagrees with
  the repository, the repository wins — update the docs rather than the facts.

## Honesty about integrations

Never state that any of the following is complete, configured, or working unless it is
actually implemented in this repository and verified:

- SAFI platform integration.
- Cognito authentication or any auth flow.
- EFS publishing or storage integration.
- Native SafiChat operations or embedding.
- Rollback or recovery tooling.
- A successful GitHub Pages deployment for a commit that has not been pushed and observed
  in a successful workflow run.

Describe these as pending or unimplemented, exactly as `README.md` does. Do not invent SAFI
infrastructure details, endpoints, account identifiers, or reserved routes. When something
is unverified, say it is unverified.

## When in doubt

Prefer the smaller change, the existing pattern, and the validated data path. If a request
requires breaking an architectural rule above, stop and ask rather than silently changing
the contract.
