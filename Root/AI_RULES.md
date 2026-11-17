# AI Rules

## Tech Stack
- **Build tool:** Vite (dev server, HMR, production builds)
- **Framework:** React 19 with TypeScript
- **Linting:** oxlint
- **Package manager:** npm (implied by package.json)

## Project Structure
- `src/App.tsx` — root component
- `src/main.tsx` — entry point
- `src/index.css` — global styles
- `src/App.css` — component styles
- `src/assets/` — static assets

## Library Usage Rules
- **Do not assume** Tailwind CSS, shadcn/ui, React Router, lucide-react, or Radix UI are installed. They are NOT in `package.json`. Add them only if explicitly required.
- Use **TypeScript** for all application code; no plain JavaScript.
- Keep the existing project structure unless there is a clear reason to change it.
- Use React components with reusable, maintainable architecture.
- Follow **TACT-SPA-001**: build a standalone Root SPA landing page with configuration-driven content.
- Keep the **Initial Context configuration** separate from presentation components.
- **Do not implement** fake Cognito authentication, AWS infrastructure, EFS publishing, or SafiChat integration. These require authorized SAFI access and will be handled later.
- **Never place secrets, credentials, or API keys** in frontend code or Git.