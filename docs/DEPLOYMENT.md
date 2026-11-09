# GitHub And Vercel Deployment

This project is independent of the original ChatGPT Sites deployment. Publishing or updating it does not modify or disconnect that original site.

## 1. Work With The Repository

The public source is [abelseb1/apex-f1](https://github.com/abelseb1/apex-f1), with `main` as the production branch. It excludes the original hosting history, deployment archives, runtime caches, and credentials.

For a fresh local checkout:

```bash
git clone https://github.com/abelseb1/apex-f1.git
cd apex-f1
npm ci
npm run dev
```

The original prepared standalone checkout uses the local branch `codex/vercel-ready`, tracking `origin/main`. From that checkout, commit changes and use `git push origin HEAD:main`. Fresh clones use `main` and can use `git push`. Authenticate through Git Credential Manager or GitHub Desktop; never put a token in the remote URL. Use your own Git author identity and a GitHub no-reply email when keeping your personal email private.

GitHub Desktop can also clone this repository or add the prepared `apex-f1-vercel` folder. Do not select the original hosted checkout. A ZIP export contains source files, not Git history; cloning is the preferred way to make future updates. For your own independent deployment, fork this repository first and review the third-party asset notes before redistribution.

## 2. Import Into Vercel

1. Visit https://vercel.com/new and connect your GitHub account. Grant access to the new repository.
2. Import `apex-f1` into a new Vercel project, independent of the current hosted app.
3. Confirm the settings below. The checked-in configuration supplies the install/build settings; Node.js is set by `package.json`.

| Setting | Value |
| --- | --- |
| Framework preset | Next.js |
| Root directory | Repository root (`.`) |
| Node.js version | 24.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | Leave the Next.js framework default |
| Production branch | `main` |

Do not configure a static export, custom Worker command, or `dist` output directory. Next.js API routes must run on the server.

4. Add any optional environment variables described below, then deploy.
5. Use the URL returned by Vercel. No custom domain purchase is required for the initial deployment. Leave the original site's hosting and domain settings unchanged.

## 3. Environment Variables

The first deployment can use the public provider defaults and needs no credentials. Add secrets under Vercel Project Settings > Environment Variables, scoped to the intended Production or Preview environment. Redeploy after changing values.

| Variable | When needed |
| --- | --- |
| `OPENF1_USERNAME`, `OPENF1_PASSWORD` | A suitable OpenF1 account for live-session access; the server obtains tokens |
| `OPENF1_ACCESS_TOKEN` | Optional short-lived token instead of username/password; takes precedence |
| `OPENF1_BASE_URL`, `OPENF1_AUTH_URL` | Optional endpoint overrides; defaults are in `.env.example` |
| `JOLPICA_BASE_URL` | Optional endpoint override; defaults to the public API |
| `NEWS_BASE_URL`, `NEWS_API_KEY` | Optional compatible news endpoint returning an `articles` array and accepting a Bearer token |

Never prefix secrets with `NEXT_PUBLIC_`. Do not upload `.env.local`. An OpenAI API key is not used by this app. Rotate any credential previously shared in chat or another public place before reuse.

## 4. Verify The Deployment

- Open `/`, `/drivers`, `/constructors`, `/calendar`, and `/live-timing`.
- Open `/api/data-status`: inspect `standings.status`, `fetchedAt`, and configuration booleans. The response intentionally contains no credential values.
- Open `/api/live-timing`: a historical session should say `Historical`, not `Live`. Confirm the capture timestamp if a saved snapshot is used.
- An HTTP 200 confirms that the route works, not that the upstream data is fresh. Check the returned status and source.
- Confirm all three supplemental portraits load and there are no image 404s.
- Check Vercel function logs for timeouts, rate limits, or provider authentication errors.

Vercel's Node runtime does not use Cloudflare's Cache API. Request caching and provider backoff here are process-local; new instances may make new provider requests. The dated snapshot keeps unavailable public feeds from being misrepresented as live data.

## 5. Portfolio Checklist

- Add the Vercel URL in GitHub's About > Website field.
- Add a short description and topics such as `nextjs`, `typescript`, `formula-1`, and `sports-data`.
- Add screenshots from the deployed app without private browser/account information.
- Pin the repository through Your profile > Customize your pins.
- Keep the API limitations, fan-project disclaimer, and third-party image credits visible.
- Choose an appropriate code license only after reviewing what you own. Do not apply it to third-party logos or photos.

## Official References

- https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- https://vercel.com/docs/frameworks/full-stack/nextjs
- https://vercel.com/docs/project-configuration
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/docs/environment-variables
- https://openf1.org/docs/
