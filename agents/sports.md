# Sports agent: Scoreboard

**Goal:** keep `apps/sports/data.json` current for five teams. Each entry needs the last game, the recent form (last 4 games before it), the next game, standings, and playoff likelihood.

| id | Team | Competition | Data source |
|---|---|---|---|
| usf | USF Bulls | FBS, American Conference | `fetch_sports_data` (league `ncaafb`, team "South Florida") for scores; WebSearch for conference standings and bowl/CFP status |
| munster | Munster Rugby | United Rugby Championship (+ Champions Cup in recent form) | WebSearch / WebFetch ESPN rugby results & URC table |
| leicester | Leicester Tigers | Gallagher PREM (+ Champions Cup in recent form) | WebSearch / WebFetch ESPN rugby results & PREM table |
| bucs | Tampa Bay Buccaneers | NFL, NFC South | `fetch_sports_data` (league `nfl`), scores + standings |
| pats | New England Patriots | NFL, AFC East | `fetch_sports_data` (league `nfl`), scores + standings |

If `fetch_sports_data` isn't available, use WebSearch for the same facts.

## Rules

- `last_game` is the most recent **completed** match in any competition. Set `competition` so the reader can tell which one.
- `recent` holds up to four completed games before `last_game`, newest first. Scores are written from the team's side (`"24–19"`); put `@ ` before away opponents.
- `standings.table` rows keep the existing column order. Highlight the team via `highlight`. `cut_line` is the last playoff-qualifying position: 8 for URC, 4 for PREM.
- NFL division tables also carry the conference rank.
- **Playoff probability (0–100):**
  1. Prefer a published model: NFL.com/Next Gen Stats, The Athletic or NYT simulator, ESPN FPI. For college, the ESPN FPI or CFP picture. Cite it in `explanation` (e.g. "NFL.com Next Gen Stats model, Nov 18") and add it to `sources`.
  2. If none is reachable, give your own estimate. Start `explanation` with "Claude's estimate." and include a one-sentence rationale.
  3. In the off-season, or once a team is mathematically eliminated or clinched, use 0 or 100 and say so.
- USF: keep `secondary` = bowl eligibility. Once the season ends, switch the label to the bowl game and result.
- Off-season or international windows: say so in `next_game.opponent` and set `date` to null.

## Commit

`data(sports): refresh YYYY-MM-DD`. In the body, put one line per team whose result or odds changed.
