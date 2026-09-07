# How a ZIP code changes the price

This is the part of the model that answers "why does the same bathroom cost $32k in Manhattan
and $19.5k in Jackson, Mississippi". It follows the method every serious cost database uses,
including homewyse.

## The industry method, in one paragraph

Cost data is authored **once** at a national average, then multiplied by a **location factor**
for the job's area. The reference implementation is the RSMeans **City Cost Index (CCI)**:
roughly 970 locations, each with an index where **100 = US national average**. An index of 112
means costs run 12% above national; 88 means 12% below. RSMeans publishes location factors for
**over 900 three-digit ZIP prefixes** — the ZIP3, not the full 5-digit ZIP — because that is the
granularity at which labor markets actually differ. Critically, the index is **split into labor,
material and equipment components**, because they do not move together.

homewyse works the same way: it builds unit costs from BLS wage and overhead statistics plus
material pricing, then adjusts that nationally-derived data to the ZIP you type in, using the
Unit Cost Method (a job is decomposed into components; each gets material + labor + equipment;
the components are summed). Its own FAQ notes the limit of the approach: it captures broad
geographic differences, not the hyper-local supply and demand of one neighborhood.

## Why labor and material must be indexed separately

This is the single most important thing to get right, and it is where naive "multiply everything
by 1.3" models break.

| Component | Spread across the US | Why |
|---|---|---|
| **Labor** | ~55 to ~153 (a 2.8x range) | Wages, union density, prevailing-wage rules, benefit loads, licensing, and local trade scarcity. This is nearly all of the variance. |
| **Material** | ~95 to ~135 (a 1.4x range) | Lumber, drywall and fixtures are nationally distributed commodities. Only freight distance, local sales tax and island/remote logistics move them. |
| **Equipment** | ~91 to ~145 | Rental markets track labor loosely; remote areas pay mobilization. |

So a drywall job (labor-heavy) swings enormously by ZIP, while a package dominated by appliances
and fixtures (material-heavy) barely moves. A single blended multiplier gets both wrong. In this
repo:

```
line_cost = qty × (labor_hours × rate × labor_index/100
                 + material_unit_cost × (1 + waste) × material_index/100)
```

Run it and watch the split — 800 SF of drywall hanging:

```
$ node scripts/price.mjs --item DRY-010 --qty 800 --compare 94110,39201
San Francisco Bay Area, CA  labor 153 / material 110    labor $915.55  material $658.24
Mississippi                 labor  66 / material  96    labor $394.94  material $574.46
```

Labor is **2.32x** between the two. Material is **1.15x**. Blending them would overstate Mississippi
and understate San Francisco.

## How the lookup resolves

Three levels, most specific wins:

1. **Metro override** — `data/regions/metro_factors.json`. 66 metros claiming 268 ZIP3 prefixes.
   A metro is where the state average lies about the job: Chicago city is 136 labor while downstate
   Illinois is 118; Manhattan is 152 while upstate New York is 112.
2. **State factor** — `data/regions/state_factors.json`. 53 entries (50 states, DC, PR, VI).
3. **National** — index 100, the fallback for unassigned prefixes (military/overseas ranges
   090–098, 962–966, 969, and any prefix the USPS allocates later).

`data/regions/zip3_state_ranges.json` maps USPS ZIP3 prefix ranges to states (`010–027 → MA`,
`900–961 → CA`, and so on). The build script expands ranges + overrides into **948 flat ZIP3 rows**,
one per assigned prefix, so a runtime lookup is a single indexed read:

```sql
SELECT * FROM region_for_zip('94110');   -- takes the first 3 digits, returns the factor row
```

The composite index, used only for things that are neither purely labor nor purely material
(minimum charges, mobilization, allowances), is:

```
composite = 0.45 × labor + 0.45 × material + 0.10 × equipment
```

Weights live in `state_factors.json` under `basis.weights`, so a different mix (heavier labor for
service work, heavier material for supply-and-install) is a data change, not a code change.

## Where prices rise and where they fall

Ranked by composite index. The pattern is not "big city expensive" — it is **union density,
prevailing-wage law, licensing friction, and shipping distance**.

**Highest** — dense union markets and logistics-constrained islands:

| Area | Labor | Material | Composite |
|---|---|---|---|
| Rural / remote Alaska | 118 | 148 | 134.2 |
| Honolulu, HI | 124 | 135 | 129.55 |
| San Francisco Bay Area, CA | 153 | 110 | 130.15 |
| San Jose / Silicon Valley, CA | 149 | 109 | 127.7 |
| New York, NY — Manhattan | 152 | 110 | 129.7 |
| Chicago, IL — city | 136 | 102 | 118.0 |
| Boston, MA — core | 141 | 106 | 122.35 |
| Seattle / Bellevue, WA | 127 | 104 | 114.85 |

**Lowest** — non-union, right-to-work, low cost of living, close to distribution:

| Area | Labor | Material | Composite |
|---|---|---|---|
| Puerto Rico | 55 | 104 | 81.55 |
| Mississippi | 66 | 96 | 82.1 |
| Alabama | 70 | 96 | 83.9 |
| Arkansas | 70 | 95 | 83.35 |
| South Carolina | 71 | 97 | 85.0 |
| Raleigh / Durham, NC | 81 | 98 | 90.15 |
| Tennessee | 78 | 96 | 87.8 |
| Oklahoma | 78 | 96 | 87.8 |

Note Hawaii and remote Alaska get there **through material**, not labor — the opposite mechanism
from San Francisco. Puerto Rico is the inverse again: cheap labor, imported material above national.
A model that only indexes labor would price all three wrong.

Whole-package effect, same scope, `bathroom-remodel-standard`:

```
$ node scripts/price.mjs --package bathroom-remodel-standard --compare 10001,94110,60607,39201,282,967
10001   direct $20,331   quoted $32,096   +32.8% vs national   New York, NY - Manhattan
94110   direct $20,414   quoted $32,224   +33.3% vs national   San Francisco Bay Area, CA
60607   direct $18,442   quoted $29,130   +20.4% vs national   Chicago, IL - City
39201   direct $12,209   quoted $19,499   -20.3% vs national   Mississippi
282     direct $13,677   quoted $21,773   -10.7% vs national   Charlotte, NC
967     direct $19,299   quoted $30,675   +26.0% vs national   Hawaii
```

## Accuracy, honestly stated

The **structure** here matches the industry method exactly. The **numbers** are calibrated
estimates, not licensed RSMeans data and not scraped from homewyse — both are proprietary. They
are anchored on public BLS occupational wage patterns and known regional cost-of-construction
spreads, and they are in the right band, but they are a starting point.

Calibrate them the cheap way: for each of five or six markets you actually bid in, price two or
three real jobs with `scripts/price.mjs`, compare to what you charged, and move that market's
`labor` index until it lands. Labor is the only index worth tuning first — it carries almost all
the variance. Material rarely needs more than a nudge unless you are shipping to an island.

Two limits worth stating to a client:

- ZIP3 is a **market**, not a street. Two neighborhoods in the same ZIP3 can differ by more than
  the ZIP3 differs from its neighbor, and the model cannot see that.
- Indexes are **stable but not static**. A market with a construction boom or a hurricane repricing
  its labor pool moves within months. Re-check the states you work in yearly.
