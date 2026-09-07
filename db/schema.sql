-- estamator — work catalog, regional cost factors and standard packages.
-- Target: PostgreSQL 14+. Load this file first, then dist/seed.sql from `npm run build`.

BEGIN;

-- ---------------------------------------------------------------------------
-- Reference data
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS unit (
  code        text PRIMARY KEY,
  name        text NOT NULL,
  system      text NOT NULL,
  base        text NOT NULL,
  to_base     numeric(12,6) NOT NULL
);
COMMENT ON TABLE unit IS 'Units of measure. `base` groups convertible units; `to_base` is the factor into that base.';

CREATE TABLE IF NOT EXISTS labor_rate (
  key             text PRIMARY KEY,
  name            text NOT NULL,
  usd_per_hour    numeric(10,2) NOT NULL CHECK (usd_per_hour > 0)
);
COMMENT ON TABLE labor_rate IS 'Fully-loaded billing rate per labor hour (man-hour) at the US national average (index 100).';

-- ---------------------------------------------------------------------------
-- Work catalog: trade > section > work_item
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS trade (
  id          serial PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  code        text NOT NULL UNIQUE,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS section (
  id          serial PRIMARY KEY,
  trade_id    integer NOT NULL REFERENCES trade(id) ON DELETE CASCADE,
  slug        text NOT NULL,
  name        text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  UNIQUE (trade_id, slug)
);

CREATE TABLE IF NOT EXISTS work_item (
  id                        serial PRIMARY KEY,
  code                      text NOT NULL UNIQUE,
  slug                      text NOT NULL UNIQUE,
  section_id                integer NOT NULL REFERENCES section(id) ON DELETE RESTRICT,
  name                      text NOT NULL,
  unit_code                 text NOT NULL REFERENCES unit(code),
  labor_hours_per_unit      numeric(10,4) NOT NULL CHECK (labor_hours_per_unit >= 0),
  crew_size                 smallint NOT NULL DEFAULT 1 CHECK (crew_size >= 0),   -- informational: duration, not price
  labor_rate_key            text NOT NULL REFERENCES labor_rate(key),
  material_cost_per_unit    numeric(12,4) NOT NULL DEFAULT 0 CHECK (material_cost_per_unit >= 0),
  waste_factor_pct          numeric(5,2) NOT NULL DEFAULT 0 CHECK (waste_factor_pct >= 0),
  min_charge                numeric(12,2) NOT NULL DEFAULT 0 CHECK (min_charge >= 0),
  permit_required           boolean NOT NULL DEFAULT false,
  notes                     text,
  is_active                 boolean NOT NULL DEFAULT true
);
COMMENT ON COLUMN work_item.labor_hours_per_unit IS
  'Total labor man-hours per unit of work at national-average productivity. Priced as hours * rate; crew_size is informational (it drives duration and scheduling, never the price).';
COMMENT ON COLUMN work_item.material_cost_per_unit IS 'Installed material cost per unit, USD, national average, before waste.';
COMMENT ON COLUMN work_item.min_charge IS 'Minimum billable amount for the item on its own, before regional adjustment.';

CREATE INDEX IF NOT EXISTS work_item_section_idx ON work_item (section_id);

CREATE TABLE IF NOT EXISTS work_item_tag (
  work_item_id  integer NOT NULL REFERENCES work_item(id) ON DELETE CASCADE,
  tag           text NOT NULL,
  PRIMARY KEY (work_item_id, tag)
);
CREATE INDEX IF NOT EXISTS work_item_tag_tag_idx ON work_item_tag (tag);

-- ---------------------------------------------------------------------------
-- Regional cost factors (RSMeans-style City Cost Index, base 100 = US average)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS region_factor (
  id                serial PRIMARY KEY,
  level             text NOT NULL CHECK (level IN ('national','state','metro')),
  code              text NOT NULL,               -- 'US', a state abbreviation, or a metro slug
  name              text NOT NULL,
  state             text,
  labor_index       numeric(6,2) NOT NULL CHECK (labor_index > 0),
  material_index    numeric(6,2) NOT NULL CHECK (material_index > 0),
  equipment_index   numeric(6,2) NOT NULL CHECK (equipment_index > 0),
  composite_index   numeric(6,2) NOT NULL CHECK (composite_index > 0),
  UNIQUE (level, code)
);
COMMENT ON TABLE region_factor IS
  'Location cost indexes, base 100 = US national average. Separate labor / material / equipment components, '
  'as in an RSMeans City Cost Index. Composite = 0.45*labor + 0.45*material + 0.10*equipment for residential work.';

CREATE TABLE IF NOT EXISTS zip3_region (
  zip3              char(3) PRIMARY KEY,
  state             text NOT NULL,
  region_factor_id  integer NOT NULL REFERENCES region_factor(id) ON DELETE RESTRICT,
  metro_name        text
);
COMMENT ON TABLE zip3_region IS
  'Resolved lookup: every assigned 3-digit ZIP prefix points at the factor row that governs it — '
  'a metro override where one exists, otherwise the state factor. Full 5-digit ZIPs resolve by their first 3 digits.';

CREATE INDEX IF NOT EXISTS zip3_region_state_idx ON zip3_region (state);

-- Resolve any 5-digit ZIP (or ZIP3) to its factor row. Falls back to the national
-- row when the prefix is unassigned (military/overseas ranges, new allocations).
CREATE OR REPLACE FUNCTION region_for_zip(p_zip text)
RETURNS region_factor
LANGUAGE sql STABLE AS $$
  SELECT rf.*
    FROM region_factor rf
    JOIN zip3_region z ON z.region_factor_id = rf.id
   WHERE z.zip3 = left(regexp_replace(p_zip, '\D', '', 'g'), 3)
   UNION ALL
  SELECT rf.* FROM region_factor rf WHERE rf.level = 'national'
   LIMIT 1;
$$;

-- ---------------------------------------------------------------------------
-- Standard packages
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS package (
  id            serial PRIMARY KEY,
  slug          text NOT NULL UNIQUE,
  name          text NOT NULL,
  category      text NOT NULL,
  tier          text NOT NULL CHECK (tier IN ('basic','standard','premium')),
  description   text,
  is_active     boolean NOT NULL DEFAULT true
);
COMMENT ON TABLE package IS 'A reusable scope template: an ordered set of work items with quantity formulas.';

CREATE TABLE IF NOT EXISTS package_variable (
  id            serial PRIMARY KEY,
  package_id    integer NOT NULL REFERENCES package(id) ON DELETE CASCADE,
  key           text NOT NULL,
  name          text NOT NULL,
  unit_code     text REFERENCES unit(code),
  default_value numeric(14,4) NOT NULL,
  sort_order    integer NOT NULL DEFAULT 0,
  UNIQUE (package_id, key)
);
COMMENT ON TABLE package_variable IS 'Inputs the estimator collects once per package (areas, counts, lengths).';

CREATE TABLE IF NOT EXISTS package_item (
  id            serial PRIMARY KEY,
  package_id    integer NOT NULL REFERENCES package(id) ON DELETE CASCADE,
  work_item_id  integer NOT NULL REFERENCES work_item(id) ON DELETE RESTRICT,
  qty_formula   text NOT NULL,
  is_optional   boolean NOT NULL DEFAULT false,
  note          text,
  sort_order    integer NOT NULL DEFAULT 0,
  UNIQUE (package_id, work_item_id)
);
COMMENT ON COLUMN package_item.qty_formula IS
  'Expression over the package variables. Grammar: numbers, variable keys, + - * / ( ), min/max/ceil/floor/round.';

CREATE INDEX IF NOT EXISTS package_item_package_idx ON package_item (package_id);
CREATE INDEX IF NOT EXISTS package_item_work_item_idx ON package_item (work_item_id);

-- ---------------------------------------------------------------------------
-- Pricing
-- ---------------------------------------------------------------------------

-- The catalog holds DIRECT cost. A quoted price adds these on top.
CREATE TABLE IF NOT EXISTS pricing_profile (
  slug                    text PRIMARY KEY,
  name                    text NOT NULL,
  description             text,
  overhead_pct            numeric(5,2) NOT NULL DEFAULT 0 CHECK (overhead_pct >= 0),
  profit_pct              numeric(5,2) NOT NULL DEFAULT 0 CHECK (profit_pct >= 0),
  contingency_pct         numeric(5,2) NOT NULL DEFAULT 0 CHECK (contingency_pct >= 0),
  material_sales_tax_pct  numeric(5,2) NOT NULL DEFAULT 0 CHECK (material_sales_tax_pct >= 0),
  permit_fee_pct          numeric(5,2) NOT NULL DEFAULT 0 CHECK (permit_fee_pct >= 0),
  is_default              boolean NOT NULL DEFAULT false
);
CREATE UNIQUE INDEX IF NOT EXISTS pricing_profile_one_default ON pricing_profile (is_default) WHERE is_default;

-- National-average unit cost of every work item, before any regional adjustment.
CREATE OR REPLACE VIEW work_item_national_cost AS
SELECT
  wi.id,
  wi.code,
  wi.name,
  t.slug                                             AS trade_slug,
  s.slug                                             AS section_slug,
  wi.unit_code,
  wi.labor_hours_per_unit * lr.usd_per_hour                             AS labor_cost_per_unit,
  wi.material_cost_per_unit * (1 + wi.waste_factor_pct / 100.0)         AS material_cost_per_unit,
  wi.labor_hours_per_unit * lr.usd_per_hour
    + wi.material_cost_per_unit * (1 + wi.waste_factor_pct / 100.0)     AS total_cost_per_unit,
  wi.min_charge
FROM work_item wi
JOIN section s    ON s.id = wi.section_id
JOIN trade t      ON t.id = s.trade_id
JOIN labor_rate lr ON lr.key = wi.labor_rate_key
WHERE wi.is_active;

-- Localized cost of one work item for one ZIP and quantity.
-- Labor and material are indexed independently, then the ZIP-adjusted minimum charge applies.
CREATE OR REPLACE FUNCTION price_work_item(p_code text, p_zip text, p_qty numeric)
RETURNS TABLE (
  code              text,
  zip3              char(3),
  region_name       text,
  qty               numeric,
  labor_cost        numeric,
  material_cost     numeric,
  subtotal          numeric,
  min_charge_applied boolean,
  total             numeric
)
LANGUAGE sql STABLE AS $$
  WITH r AS (SELECT * FROM region_for_zip(p_zip)),
       c AS (SELECT * FROM work_item_national_cost WHERE code = p_code)
  SELECT
    c.code,
    left(regexp_replace(p_zip, '\D', '', 'g'), 3)::char(3),
    r.name,
    p_qty,
    round(c.labor_cost_per_unit    * p_qty * r.labor_index    / 100.0, 2),
    round(c.material_cost_per_unit * p_qty * r.material_index / 100.0, 2),
    round((c.labor_cost_per_unit * r.labor_index + c.material_cost_per_unit * r.material_index)
          / 100.0 * p_qty, 2),
    (c.labor_cost_per_unit * r.labor_index + c.material_cost_per_unit * r.material_index)
      / 100.0 * p_qty < c.min_charge * r.composite_index / 100.0,
    round(greatest(
      (c.labor_cost_per_unit * r.labor_index + c.material_cost_per_unit * r.material_index)
        / 100.0 * p_qty,
      c.min_charge * r.composite_index / 100.0
    ), 2)
  FROM c CROSS JOIN r;
$$;

COMMIT;
