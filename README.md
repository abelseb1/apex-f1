# Apex F1

[Live demo](https://apex-f1-puce.vercel.app) | [Source](https://github.com/abelseb1/apex-f1) | [Build checks](https://github.com/abelseb1/apex-f1/actions)

A responsive Formula 1 race centre built with Next.js, React and TypeScript. Explore the calendar, championship standings, driver and constructor profiles, qualifying results, and session timing in one application.

This standalone version runs on standard Node.js and is hosted on Vercel. It has no ChatGPT Sites account, deployment, or authentication dependency.

## Features

- Race calendar and weekend session schedules.
- Championship tables and season statistics calculated from paginated results.
- Driver and constructor pages with team imagery and responsive portrait cards.
- Timing table with laps, sectors, tyres, pit stops, race-control messages, and retired/non-starting entries when the provider supplies them.
- Explicit live, historical, delayed, and unavailable states, with source timestamps.
- Optional news integration with attribution rather than fabricated headlines.

## Stack

Next.js 16 App Router, React 19, TypeScript, Tailwind CSS, Recharts, Lucide, Zod, and Vitest. Public data integrations use Jolpica and OpenF1. No database is required for the default setup.

## Local Development

Use Node.js 24 and npm. The committed lockfile makes installs reproducible.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. API credentials are optional for the initial launch. To configure them locally, create `.env.local` using `.env.example` as a reference; never commit the populated file.

| Command | Purpose |
| --- | --- |
| `npm test` | Deterministic regression tests; no provider credentials required |
| `npm run typecheck` | Generate route types and check TypeScript |
| `npm run build` | Production Next.js build |
| `npm start` | Serve the production build locally |
| `npm run lint` | ESLint CLI with the Next.js flat configuration |
| `npm run data:refresh` | Refresh the bundled verified historical snapshot |

GitHub Actions runs tests, type checking, and the production build on pushes and pull requests. Real-provider smoke tests are opt-in: set `API_SMOKE=1` before running `npm test`.

## Deploy

Follow [the GitHub and Vercel guide](docs/DEPLOYMENT.md). `vercel.json` selects Next.js, `npm ci`, and `npm run build`; `package.json` pins the Node.js major to 24. No Worker adapter or static export is needed.

The live demo is deployed from this repository's `main` branch. Updates pushed to `main` trigger a new Vercel production build; pull requests can receive preview deployments. See [verification notes](docs/VERIFICATION.md) for the checks performed.

## Architecture

```text
app/             Server-rendered pages and API routes
components/      Shared navigation, cards, tables, charts, and states
lib/api/         Provider clients, adapters, types, and request caching
lib/ui/          Team colors and presentation helpers
public/          Driver, team, flag, and branding assets
scripts/         Verified public-data snapshot refresh
tests/           Adapter, outage, pagination, and deployment regression tests
docs/            Deployment, security, and asset notes
```

Server components fetch normalized provider data. The client timing board polls `/api/live-timing`, and `/api/data-status` reports provider availability and fetch times. `mockData.ts` remains an image/profile catalog; mock scores are not used as live results.

## Data Limitations

- Historical OpenF1 data is public; in-session access requires the appropriate [OpenF1 subscription and credentials](https://openf1.org/docs/). No OpenAI API key is needed.
- Jolpica and OpenF1 may rate-limit hosted requests. Requests have timeouts, request coalescing, and Retry-After backoff. These caches are process-local on Vercel and are not shared across serverless instances. A shared cache would be a separate future integration.
- During outages, the app can show its saved verified snapshot, explicitly marked delayed or historical and retaining the capture timestamp. It is not a live-feed substitute. Refreshing the bundled snapshot requires a source update and redeployment.
- The UI's visual catalog is tailored to the 2026 season. Provider fields can be incomplete; unavailable values are not invented.
- News remains empty until a compatible provider is configured. Moving to Vercel does not remove provider rate limits or grant live-data access.

## Attribution And Security

This is an unofficial fan project, not affiliated with Formula 1 or its teams. Third-party photos, logos, and trademarks are not covered by an implied open-source license. Review [asset and rights notes](docs/ASSETS.md) before publishing or redistributing them.

See [SECURITY.md](SECURITY.md) for credential handling. No repository-wide license has been assigned; choose one for code you have the rights to license, without including third-party assets in that grant.
