# Theater agent: Baritenor Casting Call

**Goal:** keep `apps/theater/data.json` current with upcoming **musical** auditions at **community theaters within about an hour's drive of Tampa, FL**, listing only roles that fit a **baritenor**.

## 1. Sweep the theaters

Check each group's audition page, plus local listing aggregators. Use WebSearch first, then WebFetch on URLs that came back in search results.

- Eight O'Clock Theatre (Largo): eightoclocktheatre.com/auditions
- Carrollwood Players Theatre (Tampa): carrollwoodplayers.org/auditions-2
- Carrollwood Cultural Center (Tampa)
- MAD Theatre of Tampa: madtheatre.com/auditions
- St. Petersburg City Theatre
- Francis Wilson Playhouse (Clearwater)
- Richey Suncoast Theatre (New Port Richey)
- Stage West Playhouse (Spring Hill): stagewestflorida.com/auditions
- Lakeland Community Theatre
- Theatre Winter Haven: theatrewinterhaven.com/auditions
- Manatee Performing Arts Center / Manatee Players (Bradenton)
- The Sarasota Players (Sarasota)
- Aggregators: hernandoarts.org, hillsborougharts.org, stpeteartsalliance.org, BroadwayWorld Tampa non-Equity listings, Backstage/StageAgent "Tampa Bay"

Add any other community theater you find within about an hour of Tampa to `groups_checked`. Skip professional Equity houses (American Stage, freeFall, Asolo, Straz) unless they hold an open non-Equity community call. Skip youth-only productions.

## 2. Decide what qualifies

- **Musicals only.** Plays, straight comedies and sketch revues are out.
- **Baritenor fit:** working range about G2/A2 to A4–B♭4, with the tessitura around C3–F4.
  - `strong`: a textbook baritenor sing, either with a posted range inside that band or a role universally cast that way (Edward Bloom, J.M. Barrie, Sky Masterson, Chris Alvaro, Joe Hardy, and so on).
  - `possible`: a high baritone or low tenor a baritenor could likely cover.
  - Exclude bass/bass-baritone roles (e.g. Tevye, Karl in Big Fish) and true high tenors that live above A4.
- Put the theater's posted range in `listed_range` verbatim. If the theater posted no breakdown, write "No breakdown posted; from the show's standard casting".

## 3. Update the JSON

- `auditions[]`: one object per production, with `audition_dates` as ISO dates (`YYYY-MM-DD`). Keep entries whose auditions ended within the last 30 days; the page greys them out. Drop anything older than that.
- `show_dates_text`, `show_start`, `show_end`: fill these in when known, otherwise use `"TBA"` and `null`.
- `watchlist[]`: musicals announced in a season whose audition call isn't posted yet. Name the likely baritenor roles. Remove an entry once its audition call appears in `auditions[]`.
- `notes`: one or two sentences on anything notable from the sweep, such as dropped listings, date conflicts between sources, or theaters you couldn't reach.
- When sources conflict, prefer the theater's own page and mention the conflict in `audition_text`.

## 4. Commit

`data(theater): refresh YYYY-MM-DD`. In the body, list new auditions, removed auditions, and date changes.
