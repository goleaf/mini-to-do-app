## Project Assessment Summary

### Project Context

- **Architecture**: Next.js 16 app-router project with client-heavy pages (`app/page.tsx`, `app/new/page.tsx`, `app/categories/page.tsx`) that consume server actions from `lib/actions.ts`. UI built with Tailwind CSS utility classes and Radix UI primitives. Local state managed via React hooks; data persisted in process memory only.
- **Data layer**: In-memory `Map` stores simulate persistence inside server actions. No API routes or database integration; task/category IDs generated on the fly. Lacks multi-user separation and persistence across deploys.
- **Requirements & constraints**: User-provided rules demand Tailwind-only styling, no Blade templates (none exist), no CDN assets, multi-language support through JSON dictionaries, local JS/CSS bundling via npm, avoidance of auth/user management, and prohibition on Docker or Livewire. Tests required for all controllers/actions with regular execution.
- **Tooling**: TypeScript, Tailwind 4 (via `@tailwindcss/postcss`), Radix UI, Lucide icons, Vitest + Testing Library. Build via `next build`; lint via ESLint. No Storybook or Playwright present. Analytics integration via `@vercel/analytics`.

### Upgrade Goals

- **Dependencies**: Pin Radix packages (remove `latest` tags), align Tailwind plugin versions, introduce i18n packages (e.g., `next-intl` or custom JSON loader), and add persistence layer (SQLite/Prisma or Supabase) while keeping client bundle lean.
- **UX**: Maintain Tailwind usage while modularising shared layouts, introduce responsive accessibility improvements (focus states, reduced motion), and ensure multi-language string extraction into JSON dictionaries loaded through a translation context.
- **Performance**: Replace in-memory stores with persistent storage using server components/actions, add caching for read-heavy queries, lazy-load analytics/pomodoro modules, and evaluate tree-shaking for unused Radix components.
- **Testing**: Extend Vitest suite to cover server actions (CRUD, validation), hooks (favorites/search/filters), and component interactions. Configure CI to run `npm run lint`, `npm run test`, and `npm run build`. Introduce contract tests for future API endpoints.
- **Internationalisation**: Build JSON locale files in `public/locales/<lang>.json`, wrap UI in translation provider, and ensure all strings use translation keys; add fallback and language switcher without relying on Blade templates.

### Execution Roadmap

1. **Discovery & Alignment (Week 0)**
   - Confirm functional scope, non-negotiable constraints (Tailwind-only, no auth), and data persistence requirements with stakeholders.
   - Inventory all UI strings and component usage; outline existing gaps vs. rules (e.g., missing multi-language system).

2. **Foundation Setup (Week 1)**
   - Introduce persistent storage layer (e.g., Prisma + SQLite/PostgreSQL) with migration scripts.
   - Establish shared layout (`app/layout.tsx`) enhancements (theme provider, translation context) and verify Tailwind config.
   - Create locale JSON structure and translation utilities (Context7 integration still undefined—clarify expectation).

3. **Feature Refactors (Weeks 2-3)**
   - Refactor server actions into dedicated modules with validation schemas (Zod) per user rule about request validation.
   - Migrate all UI text to locale keys; implement language selector and persistence (cookie or URL prefix).
   - Modularise pages/components to minimise duplication while keeping component count manageable per rule.
   - Replace any residual inline styles/scripts with imports from `resources` equivalents (interpretation for Next.js: `app`/`styles`).

4. **Quality Assurance (Week 4)**
   - Expand Vitest coverage (components, hooks, actions); add integration tests for multi-language toggling and persistence workflows.
   - Run performance audits (Lighthouse) and address findings (bundle splitting, memoisation).
   - Execute accessibility checks (axe) and cross-browser smoke tests.

5. **Stakeholder Review & Launch Prep (Week 5)**
   - Review roadmap outcomes with stakeholders; confirm acceptance criteria met.
   - Finalise documentation (migration notes, testing strategy, environment setup) and prepare release checklist.
   - Run `npm run build` and full test suite; verify deployment process.

### Stakeholder Validation Items

- **Context7 Clarification**: Determine what “use Context7” entails (framework, library, environment) and required integration points.
- **Data Persistence Expectations**: Confirm acceptable storage (in-browser vs. server DB) and multi-user needs given current single-tenant implementation.
- **Internationalisation Requirements**: Agree on supported locales, translation workflow, and ownership of JSON dictionaries.
- **Testing Scope**: Validate that Vitest-based coverage satisfies “tests for all controllers/functions” or whether end-to-end coverage is required.
- **Deployment Constraints**: Verify hosting environment, analytics requirements, and whether `@vercel/analytics` remains acceptable.

Document prepared 2025-11-02 to fulfil `todo.md` priorities.

