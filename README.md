# Routely — Client

The Next.js front end for Routely, an intercity travel booking platform for
Bangladesh. Travellers search and book bus, train, launch and flight tickets;
vendors publish inventory and handle reservations; admins moderate the
catalogue and manage accounts.

The Express/MongoDB API lives in a separate repository
([`routely-server`](https://github.com/Greedzz-cmd/routely-server)) and is
reached over HTTP, so this app can be deployed independently.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS 4, CSS custom properties for theming |
| Components | HeroUI, Lucide icons |
| Auth | Better Auth (email + password, optional Google), JWT via the `jwtClient` plugin |
| Data | MongoDB through the Better Auth Mongo adapter |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The app runs on <http://localhost:3000>. It expects the API on
`http://localhost:5000`; start that repository first if you need live data.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | This app's own base URL. Keep it identical to `BETTER_AUTH_URL`. |
| `NEXT_PUBLIC_API_URL` | Base URL of the Express API. Must be reachable from the browser. |
| `BETTER_AUTH_URL` | Base URL Better Auth issues cookies and tokens against. |
| `MONGODB_URI` | MongoDB Atlas connection string for the auth collections. |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional. Leave blank to hide Google sign-in. |

`BETTER_AUTH_SECRET` is also required, and is deliberately absent from the
template so a placeholder can never be committed by accident.

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint over the project |

## How the data layer works

- **Server components** fetch the public catalogue with
  `cache: "no-store"`, so a page never serves a stale ticket list.
- **Authenticated calls** go through `authenticatedFetch()` in
  `src/lib/api-client.js`, which asks Better Auth for a short-lived JWT and
  attaches it as a bearer token. Plain `fetch` is only correct for routes the
  API exposes to anonymous visitors.
- `readJson()` in the same module raises the API's own error message, so a
  rejected request never looks like a silent success.
- Privileged reads use their own endpoints. `/tickets` only ever returns
  approved tickets, so dashboards load `/tickets/me` or `/tickets/manage`
  instead of filtering a public response client-side.

## Roles

| Role | Sees |
| --- | --- |
| Traveller | Ticket search, bookings, Pay Now checkout, transaction history |
| Vendor | Own listings, booking requests, revenue, ticket submission with image upload |
| Admin | Moderation queue, advertisement slots, user roles, fraud flags |

Role changes are made at `/onboarding/role` and enforced server-side by the
API. Hiding a dashboard link is not the access control.

## Theming

Colours live in `src/app/globals.css` as custom properties (surfaces, text
tones, hairlines, brand ink) with a dark default and a light variant.
`ThemeProvider` reads the stored preference, applies it before paint, and
`ThemeToggle` switches it. Components should reference the tokens rather than
hard-coded colours so both themes stay legible.

## Project layout

```
src/
  app/
    (auth)/            sign-in, get-started
    (main)/            public pages, tickets, dashboards
    api/auth/          Better Auth route handlers
  components/          shared UI, including dashboard clients
  lib/
    auth.js            Better Auth server instance
    auth-client.js     browser auth client
    api-client.js      authenticated fetch helpers
```

## Deployment

Deploy to Vercel or any Node host. Set the environment variables above in the
host's dashboard, point `NEXT_PUBLIC_API_URL` at the deployed API, and set the
API's `AUTH_BASE_URL` and `CLIENT_URLS` to this app's URL. `BETTER_AUTH_URL`
must match the public URL exactly or sign-in will be rejected.
