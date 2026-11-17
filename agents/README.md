# Update agents

Each data app is refreshed by a scheduled Claude task. Each task's prompt tells the agent to read the matching file here and follow it, so you can change how an update works by editing these files.

| App | File | Schedule (America/New_York) |
|---|---|---|
| Baritenor Casting Call | `theater.md` | Daily, 12:00 AM |
| Scoreboard | `sports.md` | Daily, 12:00 AM |
| Brandon 3/2 Watch | `housing.md` | Mondays, 12:00 AM |

## Rules for every agent

1. Work in a fresh clone of `coppolajonathan-lab/coppolajonathan-lab.github.io` on `main`.
2. Change only the app's `data.json` (plus this folder, if you're fixing the procedure itself).
3. Keep the JSON schema exactly as it is: same keys, same types. The pages render whatever is there, so a renamed key breaks them.
4. Set `"updated"` to the current time in ISO 8601 with the Eastern offset.
5. Validate before committing: `python3 -c "import json,sys; json.load(open(sys.argv[1]))" apps/<app>/data.json`.
6. Never invent facts. If a source can't be reached, keep the previous value and say so in the commit message.
7. Commit as `data(<app>): refresh YYYY-MM-DD`, with one line per notable change in the body, then push to `main`. GitHub Pages redeploys on its own.
8. If nothing changed except the timestamp, still commit (the timestamp shows the agent ran).
