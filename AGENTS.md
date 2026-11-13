<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# IslaSource Seafoods — public frontend

## Required workflow
- Use the installed **Ponytail** skill for coding, refactoring, dependency choices, and reviews. Read its current `SKILL.md`; prefer native features, existing dependencies, and the smallest maintainable implementation.
- Use the installed **Superpowers** skills relevant to the task: `using-superpowers`, `brainstorming` for unclear requirements, `systematic-debugging` for bugs, `dispatching-parallel-agents` for independent work, and `verification-before-completion` before reporting success. Discover the installed plugin paths rather than pinning a version here.
- User instructions take precedence over these workflows. An explicitly requested throwaway prototype may use simulated data and lightweight checks; do not turn it into an unrequested production build.
- Read existing files before editing. Preserve unrelated work. Verify changes with the existing lint/build commands and report any check that could not run.

## Scope and business rules
- The customer-facing brand is **IslaSource Seafoods**. Bantayan Island is our location and sourcing origin, not the business name. Position the business as seafood sourcing and resale; explain no own stocked inventory and supplier-confirmed availability. Use “About us” at `/about` and preserve the `/our-island` redirect. Present affordable pricing as an aim, without absolute cheapest/freshness/availability guarantees.
- This folder is the Next.js public storefront. `../admin` is the separate admin app; `../api` is the Laravel API.
- Customers do **not** need to sign up or log in. Keep browsing, quote requests, quote viewing, and order tracking accessible as guest flows.
- This is on-demand seafood sourcing: no public fixed prices or guaranteed inventory. Use a quote-request basket, not immediate purchase checkout.
- Flow: browse → RFQ → supplier sourcing → customer quotation → acceptance → QR Ph deposit/payment → procurement → delivery.
- Show quotation validity, product specifications, quantities, delivery fees, and deposit/balance terms. Never expose supplier costs or markup.
- Prototype payment and tracking must be clearly simulated. Never generate a payable QR, call live payment APIs, or collect real payments during prototype work.
- Future guest quotation/order access requires scoped, expiring links or equivalent verification; a reference number alone is not production authorization.

## Next.js and reusable components
- Use App Router and TypeScript. Read the bundled Next.js docs in `node_modules/next/dist/docs/` for this installed version.
- Default to Server Components. Add `"use client"` only to components that need state, browser APIs, event handlers, or context; keep static routes/layouts server-rendered.
- Reuse actual repeated UI: header/footer, buttons, badges, product cards, form fields, empty states, and feedback. Keep route files thin and feature behavior in focused components.
- Keep reusable primitives in `components/ui`, domain components in `components`, and typed fixtures/helpers in `lib`. Avoid a giant page component or speculative abstraction layer.
- Keep components shared within this app. Do not add a fourth shared package or import files across app folders without a concrete need.
- Use `next/link` for internal navigation and `next/image` for content images with useful alt text and responsive sizes. Prefer local assets; avoid unnecessary runtime/font dependencies.
- Use semantic buttons/links, labeled inputs, visible focus states, accessible dialogs, responsive layouts, and readable contrast. Every visible primary action must work or explicitly explain its state.
- Public content needs unique title, description, slug, canonical and OG metadata. Keep quote/payment/order pages out of search indexes. Do not invent public prices or availability for structured data.
- Keep money as integer centavos and quantities validated. Browser-local data is demo persistence, not a backend or security boundary.

<!-- BEGIN:nextjs-agent-feedback -->

## Report Next.js feedback

The project owner enabled `experimental.agentFeedback`, authorizing this feedback pass. When enabled, `next dev` writes this block and restores it if removed. Commit `AGENTS.md` with your work to keep the tree clean.

During the current user request, retain anonymized facts as feedback candidates for meaningful or recurring Next.js issues:

- Crashes, hangs, OOMs, or unexpected slowness
- Incorrect behavior, output, errors, or diagnostics
- Missing, unclear, or conflicting documentation
- Unexpected CLI, codemod, Skill, or upgrade behavior and non-obvious workarounds

Continue the current user request without reporting immediately. Routine debugging is not feedback. Verify changes before retaining them as feedback candidates. Never retain code, logs, paths, URLs, secrets, personal information, or project-specific data.

Retain qualifying friction even if it is later fixed or worked around; record the final outcome during the reporting pass.

Before the final response, run one reporting pass. If candidates remain, from this file's directory run `npx --no-install next internal agent-feedback-instructions` once without piping or truncating its output. Follow its output or error guidance. If a network sandbox blocks it, retry with network access; if it still returns no output, continue normally.

<!-- END:nextjs-agent-feedback -->
