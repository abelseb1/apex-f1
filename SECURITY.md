# Security

- Store local secrets only in `.env.local`; store production secrets in Vercel environment variables. Never commit keys, tokens, passwords, or populated `.env` files.
- `.env.example` contains only public endpoint defaults and empty credential placeholders.
- Rotate any credential previously pasted into chat or otherwise exposed before reusing it.
- No OpenAI API key is required. The app reads optional OpenF1 and news provider credentials only on the server.
- Do not publish secrets in issue reports, screenshots, or function logs. If reporting a vulnerability, use the repository owner's private reporting channel when configured.
- The source snapshot excludes the original repository's Git history, deployment bundles, and runtime caches. A pattern scan cannot guarantee that every possible secret is absent; review staged files before publishing.
- Keep dependencies updated and review provider terms and asset permissions before public release.
