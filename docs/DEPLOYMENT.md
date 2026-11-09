# GitHub And Vercel Deployment

This folder is an independent copy. Publishing it does not modify or disconnect the existing ChatGPT Sites deployment. No Git remote, Vercel project, or production domain has been configured for this copy.

## 1. Publish The Source

The prepared folder has a freshly initialized local Git repository on `codex/vercel-ready`. It does not include the old repository's commits, deployment archives, runtime caches, or credentials. The first commit is left to you because no Git author identity was configured; your portfolio commit should use your own identity.

1. Create an empty repository named `apex-f1` at https://github.com/new. Public visibility makes it visible in your portfolio. Do not initialize the remote with a README, license, or gitignore.
2. Open a terminal in this project folder and authenticate with your own GitHub account. Never paste a personal access token into the remote URL.
3. Set your commit name and GitHub-associated email (or your GitHub-provided private noreply email). These settings apply only to this repository. Replace the placeholders below, then run:

```bash
git config user.name "YOUR_NAME"
git config user.email "YOUR_GITHUB_EMAIL"
git add .
git commit -m "Initial standalone Apex F1 app"
git remote add origin https://github.com/YOUR_USERNAME/apex-f1.git
git push -u origin HEAD:main
```

For later updates from the prepared local branch, commit your changes and use `git push origin HEAD:main`. A normal fresh clone from GitHub will use `main`.

Alternatively, GitHub Desktop can add this existing local repository, create the first commit using your configured account identity, and publish it. Rename the local branch to `main` before publishing, or select the actual published branch as Vercel's production branch. Check the selected folder carefully: use `apex-f1-vercel`, not the original hosted checkout. Review the files before making the repository public. If starting from the ZIP instead of the prepared folder, run `git init -b codex/vercel-ready` first; ZIP exports do not include `.git`.

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
