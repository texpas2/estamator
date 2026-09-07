# Data model

Everything is authored as JSON under `data/`. That is the source of truth; `db/schema.sql` and
`dist/seed.sql` are derived. Edit JSON, run `npm run build`, reload the seed.

## Layers

```
unit ──────────┐
labor_rate ────┤
               ├── work_item ──┬── work_item_tag
trade ─ section┘               │
                               └── package_item ── package ── package_variable
region_factor ── zip3_region
pricing_profile
```

## Work catalog

`trade` → `section` → `work_item`, three levels, mirroring how a homewyse-style catalog browses.
28 trades, 93 sections, 406 work items.

A `work_item` is one priceable unit of work:

| Field | Meaning |
|---|---|
| `code` | Stable identifier, `TRD-###`. Packages and estimates reference this, never the name. |
| `unit` | SF, LF, EA, SQ, CY, HR, DAY, JOB … from `data/units.json`. |
| `labor_hours_per_unit` | **Total man-hours** per unit at national-average productivity. |
| `crew_size` | Informational — drives schedule duration, **never** the price. |
| `labor_rate_key` | Which trade rate applies, from `data/labor_rates.json`. |
| `material_cost_per_unit_usd` | Installed material, national average, **before** waste. |
| `waste_factor_pct` | Applied to material only. Tile 12-15%, drywall 10%, sheet vinyl 15%. |
| `min_charge_usd` | Minimum for the item **sold standalone**. See the note below. |
| `permit_required` | Flags scope that needs a pulled permit. |
| `tags` | Free-form facets for filtering (`kitchen`, `rough`, `demolition`, `energy`, …). |

Direct cost of a line:

```
labor    = qty × labor_hours_per_unit × rate
material = qty × material_cost_per_unit × (1 + waste_factor_pct/100)
```

### The minimum charge trap

`min_charge_usd` is a **trip charge for that item sold on its own** — nobody hangs 20 SF of drywall
for $15. It must not be applied to every line of a package: a 33-line bathroom would then bill 33
mobilizations. `scripts/price.mjs` applies minimums for `--item` and ignores them for `--package`
(`--apply-minimums` opts back in). The SQL function `price_work_item()` is the standalone case, so
it does apply the minimum.

## Packages

A `package` is a reusable scope template — the answer to "what does a standard bathroom remodel
consist of". 36 packages across kitchen, bathroom, interior, exterior, systems, energy and
maintenance, in three tiers (`basic` / `standard` / `premium`).

Each package declares `variables` (the handful of numbers an estimator measures on site) and lists
`items` whose quantities are **formulas over those variables**:

```json
{ "code": "DRY-110", "qty": "wall_area_sf + floor_area_sf" },
{ "code": "TRM-010", "qty": "floor_area_sf / 3" },
{ "code": "INS-010", "qty": "wall_area_sf * 0.4", "optional": true }
```

Grammar: numbers, variable keys, `+ - * / ( )`, and `min max ceil floor round`. Parsed by a
recursive-descent parser in `scripts/lib/formula.mjs` — **no `eval`**, so a malformed or hostile
formula fails at validation instead of running. `npm run validate` parses and evaluates every
formula against the declared defaults, and rejects undeclared variables, negative quantities and
unused variables.

`optional: true` marks a line the estimator offers but does not include by default (an upgrade, or
a condition discovered on site).

## Regions

See [REGIONAL_PRICING.md](REGIONAL_PRICING.md) for the method. Structurally:

- `region_factor` — 120 rows: national + 53 states/territories + 66 metros. Each carries separate
  `labor_index`, `material_index`, `equipment_index` and a derived `composite_index`, base 100.
- `zip3_region` — 948 rows, one per assigned 3-digit ZIP prefix, each pointing at the factor row
  that governs it (metro override where one exists, otherwise state).
- `region_for_zip(text)` — resolves any 5-digit ZIP or ZIP3, falling back to national.

## Pricing profiles

The catalog holds **direct cost**. `pricing_profile` carries what turns direct cost into a quoted
price: overhead, profit, contingency, material sales tax and permit fees. Four profiles ship
(`handyman`, `general-contractor` (default), `design-build`, `insurance-restoration`). Order of
application:

```
direct → + tax on the material share → × contingency → × overhead → × profit → × permit fee
```

Per-job overrides belong on the estimate record, not in this table.

## Adding to the catalog

1. Add the item to the right `data/work_items/<trade>.json`, using the trade's code prefix and the
   next free number in that section's band (`010`, `020`, … per section, `110`+ for the second
   section, and so on).
2. `npm run validate` — it checks the code prefix, the section reference, the unit, the labor rate
   key, numeric ranges, and slug/code uniqueness.
3. `npm run build` — regenerates `dist/catalog.json` and `dist/seed.sql`.
4. Reload: `psql -f db/schema.sql && psql -f dist/seed.sql`. The seed is idempotent
   (`ON CONFLICT DO UPDATE`), so it is safe to re-run over an existing database.
