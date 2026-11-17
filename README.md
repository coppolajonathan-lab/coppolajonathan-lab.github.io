# coppolajonathan-lab.github.io

Jonathan Coppola's site: **https://coppolajonathan-lab.github.io/**

| Path | What | Edit |
|---|---|---|
| `/` | About: resume, stage, table | `data/profile.json` |
| `/now/` | What I'm Up To: work, upcoming and past shows with photos, campaigns | `now/content.json` + `now/images/` |
| `/apps/` | Apps hub | `apps/index.html` |
| `/apps/theater/` | Baritenor Casting Call (refreshed daily by a scheduled agent) | `apps/theater/data.json` |
| `/apps/sports/` | Scoreboard (refreshed daily) | `apps/sports/data.json` |
| `/apps/housing/` | Brandon 3/2 Watch (refreshed Mondays) | `apps/housing/data.json` |
| `/apps/campaign-forge/` | Campaign Forge chatbot (via the Cloudflare Worker in `worker/`) | `apps/campaign-forge/` |

- Every page shares one nav and footer: `assets/site.js` + `assets/site.css`. Add a nav link in one place and it appears everywhere.
- The apps share `assets/apps.css`.
- `agents/` holds the instructions the scheduled update agents follow.
- `worker/` is the Campaign Forge proxy source. It is deployed in Cloudflare, not served from here.
- Pushing to `main` deploys via `.github/workflows/pages.yml`, which validates the data files and shrinks oversized photos for the web.

## Adding show or campaign photos
Upload them to `now/images/shows/<show>/` or `now/images/campaigns/<campaign>/`, then list them in `now/content.json`:
```json
"cover": "images/shows/come-from-away-2026/cover.jpg",
"photos": [{ "src": "images/shows/come-from-away-2026/01-bows.jpg", "caption": "Closing night bows" }]
```
Paths in `content.json` are relative to `now/` and must match the file name exactly (capitals and `.jpg` vs `.jpeg` count). Upcoming shows accept `cover` or `poster`, and `dates` or `dates_text`. Add `"start"`/`"end"` as `YYYY-MM-DD` so a show drops off Upcoming after it closes. Resize photos to about 1600–2000 px on the long edge before uploading. Paths are case-sensitive.

Run locally: `python3 -m http.server 8000`, then open http://localhost:8000

## Cache-busting
GitHub Pages caches files for about 10 minutes. After editing anything in `assets/`, bump the `?v=` number on the `assets/...` links in every `index.html` so visitors get the new version right away:
`grep -rl --include=index.html "assets/" . | xargs sed -i -E "s#\?v=[0-9]+#?v=$(date +%Y%m%d%H%M)#g"`
