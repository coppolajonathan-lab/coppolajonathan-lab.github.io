# Campaign Forge proxy (Cloudflare Worker)

This Worker keeps your Anthropic API key **off the public site**. Campaign Forge sends each request to the Worker along with a passphrase. The Worker checks the passphrase, adds your key, and forwards the request to Claude.

What it enforces:
- The correct passphrase (compared in constant time)
- Requests only from `coppolajonathan-lab.github.io` (plus localhost for testing)
- Only the Claude Sonnet, Opus and Haiku 5.5 models
- At most 4,096 output tokens per reply and 60 messages per conversation
- Only the fields Campaign Forge needs are forwarded to Claude

## Deploy it (about 5 minutes, free tier)

1. Sign up or log in at **dash.cloudflare.com**.
2. Go to **Workers & Pages → Create → Create Worker**. Name it `campaign-forge` and click **Deploy**.
3. Click **Edit code**, delete the sample, paste in all of `worker.js` from this folder, and click **Deploy**.
4. Go to the Worker's **Settings → Variables and Secrets** and add two variables, both with type **Secret**:
   - `ANTHROPIC_API_KEY`: your `sk-ant-…` key
   - `FORGE_PASSPHRASE`: a passphrase for your table (something like `owlbear-nachos-42`)
5. Copy the Worker's URL, which looks like `https://campaign-forge.<you>.workers.dev`.
6. Put that URL into `campaign-forge/config.js` as `proxyUrl` and push, or send it to Claude to do it.

## Strongly recommended

In **console.anthropic.com → Settings → Limits**, set a **monthly spend limit** on the account or workspace this key belongs to. That caps your cost even if the passphrase leaks. If it does leak, change `FORGE_PASSPHRASE` in the Worker; you don't need a new API key.

## Changing things

- New passphrase: edit the `FORGE_PASSPHRASE` secret. It takes effect immediately.
- Testing from another site: add a plain variable `ALLOWED_ORIGINS` (comma-separated).
