# MentorLagbe — Client

Next.js (App Router) frontend for **MentorLagbe**, a tuition & mentorship marketplace (Programming Hero Assignment 9, Category 001). Students search approved tuitions and apply, tutors post and manage listings, admins moderate everything, and students/tutors can upgrade to Pro via Stripe.

- **Live site:** _add after deployment_
- **Server repository:** _add link_ · **Client repository:** _add link_
- Admin / tutor test credentials are provided in the submission form, not in this repository.

## Tech stack / npm packages
Next.js 16 (App Router, TypeScript), Tailwind CSS v4, Radix UI (dialog, dropdown, accordion), Motion, Lucide, Sonner, next-themes, React Hook Form + Zod, TanStack Query, Recharts, better-auth (client + JWT plugin), class-variance-authority, clsx, tailwind-merge.

## Features
- Public: animated home, server-side search/filter/sort/pagination on Browse Tuitions, tuition details with tutor summary, pricing, how it works, about.
- Auth: BetterAuth sign-up (student/tutor role) and sign-in, validated forms, toasts, session persistence across reloads.
- Student: overview stats, my applications (cancel while pending), saved tuitions (bookmarks), reviews after acceptance.
- Tutor: overview, post tuition with direct ImgBB banner upload (free plan: 2 posts), my tuitions (edit, delete, close/reopen), applicants (accept/reject).
- Admin: overview chart, user management (roles, tutor verification), tuition approval/rejection, transactions.
- Profile page with direct profile-picture upload; Stripe Checkout upgrade and success/cancel pages.
- Dark/light/system theme, responsive layouts, loading skeletons, error and 404 pages.

## How auth and the API work
The browser only talks to **its own origin**. `next.config.ts` rewrites `/api/*` to the Express server (`API_URL`), so BetterAuth cookies are first-party and there are no CORS or cross-site cookie problems. The dashboard layout resolves the session on the server (forwarding cookies to Express) and enforces the role; Express independently verifies the JWT and role for every protected API call. `src/proxy.ts` is only a fast pre-check for a session cookie.

## Setup
```bash
npm install
cp .env.example .env.local   # set API_URL to your running server
npm run dev                  # http://localhost:3000
```
Environment variables (`.env.local`): `API_URL` (server base URL, server-side only) and `NEXT_PUBLIC_SITE_URL`.

Scripts: `dev`, `build`, `start`, `lint`.

## Deployment (Vercel)
Set `API_URL` to the deployed API URL and `NEXT_PUBLIC_SITE_URL` to the site URL. On the server, `CLIENT_URL` must equal the site origin and `BETTER_AUTH_URL` the API URL.

## Known limitations
- Hero illustration is a simple original line drawing; replace with licensed artwork if desired.
- Tuitions without an uploaded banner show a subject-themed placeholder (no stock photos).
- Testimonials on the home page are clearly labelled sample content.
- Contact details in the footer (`src/lib/site.ts`) are placeholders.
- No end-to-end browser test suite yet; flows were checked manually in headless Firefox.
