# Local Verification

Checked on 2026-11-09 using Node.js 24.16.0. These checks apply to the standalone copy, not a Vercel deployment.

| Check | Result |
| --- | --- |
| Dependency installation | Passed with the npm lockfile |
| Regression tests | 19 passed; 1 opt-in provider test skipped |
| TypeScript | `npm run typecheck` passed |
| Production build | `npm run build` passed |
| Production dependency audit | `npm audit --omit=dev` reported zero known vulnerabilities |
| Page smoke checks | HTTP 200 from `/`, `/drivers`, `/constructors`, `/calendar`, `/live-timing` |
| API smoke checks | HTTP 200 from `/api/data-status` and `/api/live-timing` |
| Supplemental portraits | All three local portrait URLs returned HTTP 200 and were referenced by `/drivers` |
| Source scan | No matches for the checked common credential patterns, previous hosted-site identifiers, or local absolute user paths |

The production server was started on a separate local port for these checks, then stopped. No deployment or remote push was performed. ESLint and a new visual browser regression pass were not run; the UI was preserved from the original project.

## Observed Provider State

- Jolpica standings reported `status: ok`, season 2026, round 20, fetched at `2026-11-09T04:57:24.672Z`.
- OpenF1 returned 22 rows for the Brazil Race with `status: Historical` and data timestamp `2026-11-08T18:43:45Z`.
- Live-session credentials and the optional news provider were not configured or tested.

Provider availability can change. A successful local request does not guarantee availability from Vercel, freshness of every field, or access during a live session. Check source timestamps and hosting logs after deployment. The dependency audit and source scan are point-in-time checks, not a guarantee that the project is free of all security issues.
