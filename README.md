# estamator — work catalog, ZIP-based pricing and standard packages

A homewyse-style database of construction work: what the trades are, what each unit of work costs
in labor and material, how that cost changes with the job's ZIP code, and reusable **packages** that
assemble those work items into standard scopes an estimator can quote.

```
406 work items   28 trades   93 sections
 36 packages     518 package lines
120 region factors (national + 53 states/territories + 66 metros)
948 ZIP3 rows covering every assigned US 3-digit ZIP prefix
```

## Quick start

```bash
npm run validate     # structural + referential checks over data/
npm run build        # -> dist/catalog.json and dist/seed.sql

# price a single work item, two markets side by side
node scripts/price.mjs --item DRY-010 --qty 800 --compare 94110,39201

# price a whole package
node scripts/price.mjs --zip 10001 --package bathroom-remodel-standard

# same scope, six markets
node scripts/price.mjs --package kitchen-remodel-standard --compare 10001,94110,60607,39201,282,967

# override a measurement
node scripts/price.mjs --zip 30301 --package roof-replacement-asphalt --var roof_squares=34
```

Load into Postgres:

```bash
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f dist/seed.sql
psql "$DATABASE_URL" -c "SELECT * FROM price_work_item('TIL-110', '94110', 120);"
```

No dependencies — plain Node 18+ ESM and plain SQL.

## Layout

```
data/
  units.json                  units of measure
  labor_rates.json            27 trade rates, USD per man-hour, national average
  pricing_profiles.json       overhead / profit / contingency / tax / permit profiles
  trades.json                 28 trades and their 93 sections
  work_items/<trade>.json     406 work items, one file per trade
  packages/<group>.json       36 standard packages with quantity formulas
  regions/
    state_factors.json        labor / material / equipment index per state, base 100
    metro_factors.json        66 metro overrides keyed by ZIP3
    zip3_state_ranges.json    USPS ZIP3 prefix ranges -> state
db/schema.sql                 PostgreSQL schema, views and pricing functions
scripts/
  validate.mjs                fails the build on any structural or referential error
  build.mjs                   emits dist/catalog.json and dist/seed.sql
  price.mjs                   CLI pricing, no database required
  lib/formula.mjs             quantity-formula parser (no eval)
docs/
  DATA_MODEL.md               tables, fields, conventions, how to extend
  REGIONAL_PRICING.md         how ZIP changes the price, and where it rises or falls
```

## The three ideas worth knowing

**1. Cost is authored once, nationally, then indexed by location.** Every work item is priced at a
US national average. A ZIP code resolves to a location factor with **separate labor, material and
equipment indexes**, because labor varies ~2.8x across the country while material varies ~1.4x.
Blending them into one multiplier gets both ends wrong. Details in
[docs/REGIONAL_PRICING.md](docs/REGIONAL_PRICING.md).

**2. A package is a scope template, not a fixed bundle.** It declares the few numbers an estimator
measures (`floor_area_sf`, `cabinet_run_lf`, `roof_squares`) and derives every line quantity from
them by formula. Change one measurement and the whole scope re-quantifies.

**3. The catalog is direct cost.** Overhead, profit, contingency, sales tax and permit fees live in
`pricing_profile` and apply on top, so the same catalog serves a handyman, a GC and an insurance
restoration job without forking the data.

## Provenance

This is an original catalog built to the same **structure** the industry uses — the Unit Cost Method
plus RSMeans-style City Cost Index location factors, which is also how homewyse operates. It is not
scraped from homewyse and it is not licensed RSMeans data; both are proprietary. The labor hours,
material costs and location indexes are calibrated estimates anchored on public wage and
cost-of-construction patterns. They are in the right band and ready to quote from, but they are a
starting point — see the calibration note at the end of
[docs/REGIONAL_PRICING.md](docs/REGIONAL_PRICING.md).
