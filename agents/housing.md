# Housing agent: Brandon 3/2 Watch

**Goal:** each Monday, refresh `apps/housing/data.json` with a generic market read for a **3 bed / 2 bath in Brandon, FL**. The page works out the mortgage at the fixed **4.5%** rate itself, so you only maintain the inputs.

## Steps

1. **Rent.** Get the latest 3-bedroom average rent for Brandon, FL from at least four of: RentHop, Zumper, Trulia, RentCafe, Apartments.com, Rentometer, PadMapper. Record each in `rent.observations` with its as-of month. Set `rent.headline` to the **mean** of the observations, rounded to the nearest dollar. Update `rent.trend_note` with year-over-year direction.
2. **Price.** Get the latest median **sold** price for Brandon, from MLS-based sources (Momentum/MLS, Redfin, TopHap 33510/33511, local brokerage reports). If a source gives a 3-bedroom-specific median, prefer it and say so in `price.basis`. Set `price.headline` to the most recent MLS median sold price. Update `price.trend_note` (YoY change, days to contract, months of supply).
3. **Assumptions.** Leave `rate_pct` at **4.5** and `term_years` at 30 unless Jonathan asks otherwise. Check whether Hillsborough's total millage, the homestead exemption amount, or the Citizens average premium for the county has changed. If so, update the value and its note's URL.
4. **History.** Append `{ "week": "<this Monday's date>", "rent": <headline>, "price": <headline> }` to `history`. Keep the last 104 entries.
5. Validate the JSON, then commit `data(housing): refresh YYYY-MM-DD` with the new rent, price and P&I in the body. Compute P&I as `P·r/(1−(1+r)^−360)`, where P = price × 0.8 and r = 0.045/12.

Don't change the page's math. If a source is unreachable, keep its last observation and note the staleness in its `as_of` (e.g. "May 2026 (not refreshed)").
