# Zalaltor Platform — Phase 1 (Foundation)

This is the **foundation layer** of the Rs. 150,000+ enterprise rebuild: database-driven
content, dynamic file-based routing, a protected admin dashboard, SEO plumbing, and a
lead-qualification intake flow. It is a real, working Next.js 14 App Router project — not a
mockup — but it is **phase 1 of 4**. CRM sync, transactional email, the store, and the AI
chatbot are stubbed with clear TODOs (see "Next phases" below) because each needs real
credentials (HubSpot/Zoho, Resend/SendGrid, Stripe/JazzCash, Anthropic API) that only you can
provide, and wiring them with fake keys would just produce code that silently fails.

## What's built

| Requirement (from brief) | Status |
|---|---|
| 1. Dynamic multi-page routing (`/services/[slug]`, `/work/[slug]`, `/blog/[slug]`) | ✅ Built — add rows to the DB, no redeploy needed |
| 2. Admin dashboard (`/admin`, protected) | ✅ Built — leads table, blog publish/edit, basic stats |
| 3. Postgres via Prisma (Supabase/Neon-ready) | ✅ Built — `prisma/schema.prisma` |
| 4. CRM integration | 🔲 Stubbed — `src/app/api/contact/route.ts` has the TODO hook |
| 5. Email automation | 🔲 Stubbed — same file, same hook |
| 6. E-commerce (`/store`) | 🔲 Not started — `Product`/`Order` models exist in schema, no UI yet |
| 7. AI chatbot | 🔲 Not started |
| 8. Multi-step lead qualification | ✅ Built — `src/app/contact/QualificationForm.tsx` + scoring logic |
| 9. SEO (SSR, JSON-LD, sitemap, robots) | ✅ Built |
| 10. Performance/monitoring (Sentry, Lighthouse) | 🔲 Not started — needs a Sentry account + DSN |
| 11. Docs / staging | ✅ This README + instructions below |

## Getting started

```bash
npm install
cp .env.example .env    # fill in DATABASE_URL and NEXTAUTH_SECRET
npm run db:push         # creates tables from prisma/schema.prisma
npm run db:seed         # creates admin@zalaltor.com / changeme123 + one sample service
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin/login`
for the dashboard (log in with the seeded credentials, then change the password immediately —
there's no self-service password change UI yet, update it via `npm run db:studio`).

## Database

Use [Supabase](https://supabase.com) or [Neon](https://neon.tech) — both give you a free
Postgres instance and a `DATABASE_URL` connection string. Paste it into `.env`, run
`npm run db:push`, done. `npm run db:studio` opens a GUI to browse/edit data directly.

## Deployment

- **Recommended:** Vercel (zero-config for Next.js). Add `DATABASE_URL`, `NEXTAUTH_URL`,
  `NEXTAUTH_SECRET` as environment variables in the Vercel project settings.
- Point `zalaltor.com` at the Vercel project under Project → Settings → Domains, then add a
  redirect rule in `next.config.js` from the old `.vercel.app` URL (template already there).
- **Staging:** create a second Vercel project (or a preview branch) pointing at a separate
  Postgres database, so content edits and code changes can be tested before hitting
  production.

## Next phases (in the order the brief recommends)

**Phase 2 — CRM + email automation**
- In `src/app/api/contact/route.ts`, after `db.lead.create(...)`, add:
  - `syncToCrm(lead)` — POST to HubSpot/Zoho's contact API using the lead's fields.
  - `sendAutoReply(lead)` — call Resend/SendGrid to send the instant confirmation email.
  - A scheduled job (Vercel Cron or a queue) for the 3–5 day nurture sequence on leads
    still in `NURTURE` status.
  - Internal Slack/email notification to the team on every new lead.

**Phase 3 — Store**
- `Product` and `Order` models already exist in the schema.
- Build `/store`, `/store/[slug]`, and a checkout route using Stripe (or JazzCash/Easypaisa
  for local payment methods), plus an admin `/admin/orders` page.

**Phase 4 — AI chatbot**
- A floating widget component calling `/api/chat`, which forwards messages to the Anthropic
  API and, when it detects contact info in the conversation, POSTs to `/api/contact` with
  `source: "chatbot"` so it flows into the same Lead table and CRM sync.

**Ongoing — performance & monitoring**
- `npm install @sentry/nextjs` and run `npx @sentry/wizard@latest -i nextjs` for error
  monitoring.
- Add an uptime monitor (UptimeRobot, Better Uptime) pointed at `/`.
- Run Lighthouse in Chrome DevTools after each phase to catch regressions early.

## Project structure

```
src/
  app/
    page.tsx                 # home
    services/, services/[slug]/
    work/, work/[slug]/
    blog/, blog/[slug]/
    about/, pricing/, contact/
    admin/
      login/                 # public
      (protected)/           # route group — everything here requires auth
        page.tsx              # dashboard overview
        leads/                # leads table
        blog/                 # CMS publish/edit
    api/
      contact/route.ts       # lead intake + scoring
      auth/[...nextauth]/    # login
    sitemap.ts, robots.ts
  lib/
    db.ts      # Prisma client
    auth.ts    # NextAuth config
    seo.ts     # JSON-LD builders
  components/
prisma/
  schema.prisma
  seed.ts
```
