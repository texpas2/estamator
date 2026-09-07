#!/usr/bin/env node
/** Structural and referential checks over data/. Exits non-zero on any error. */
import { loadCatalog, resolveZip3, regionFactorRows } from './lib/load.mjs';
import { parse, variablesUsed, evaluate } from './lib/formula.mjs';

const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const { units, laborRates, trades, pricingProfiles, workItems, packages, regions } = loadCatalog();

// --- reference data ---------------------------------------------------------
const unitCodes = new Set(units.map((u) => u.code));
if (unitCodes.size !== units.length) err('units.json: duplicate unit codes');

const rateKeys = new Set(laborRates.rates.map((r) => r.key));
if (rateKeys.size !== laborRates.rates.length) err('labor_rates.json: duplicate rate keys');

const profileSlugs = new Set();
let defaults = 0;
for (const p of pricingProfiles) {
  if (profileSlugs.has(p.slug)) err(`pricing_profiles.json: duplicate slug ${p.slug}`);
  profileSlugs.add(p.slug);
  if (p.is_default) defaults++;
  for (const f of ['overhead_pct', 'profit_pct', 'contingency_pct', 'material_sales_tax_pct', 'permit_fee_pct'])
    if (typeof p[f] !== 'number' || p[f] < 0) err(`pricing_profiles.json ${p.slug}: ${f} must be a number >= 0`);
}
if (defaults !== 1) err(`pricing_profiles.json: exactly one profile must be is_default (found ${defaults})`);

// --- taxonomy ---------------------------------------------------------------
const sectionKeys = new Set();
const tradeSlugs = new Set();
const tradeCodes = new Set();
for (const t of trades) {
  if (tradeSlugs.has(t.slug)) err(`trades.json: duplicate trade slug ${t.slug}`);
  if (tradeCodes.has(t.code)) err(`trades.json: duplicate trade code ${t.code}`);
  tradeSlugs.add(t.slug); tradeCodes.add(t.code);
  const seen = new Set();
  for (const s of t.sections) {
    if (seen.has(s.slug)) err(`trades.json: duplicate section ${t.slug}/${s.slug}`);
    seen.add(s.slug);
    sectionKeys.add(`${t.slug}/${s.slug}`);
  }
}

// --- work items -------------------------------------------------------------
const byCode = new Map();
const slugs = new Set();
const usedSections = new Set();
for (const w of workItems) {
  const where = `${w.sourceFile} ${w.code}`;
  if (byCode.has(w.code)) err(`${where}: duplicate code (also in ${byCode.get(w.code).sourceFile})`);
  byCode.set(w.code, w);
  if (slugs.has(w.slug)) err(`${where}: duplicate slug ${w.slug}`);
  slugs.add(w.slug);

  if (!tradeSlugs.has(w.trade)) err(`${where}: unknown trade ${w.trade}`);
  const key = `${w.trade}/${w.section}`;
  if (!sectionKeys.has(key)) err(`${where}: unknown section ${key}`);
  usedSections.add(key);

  const tradeCode = trades.find((t) => t.slug === w.trade)?.code;
  if (tradeCode && !w.code.startsWith(`${tradeCode}-`)) err(`${where}: code prefix should be ${tradeCode}-`);
  if (!unitCodes.has(w.unit)) err(`${where}: unknown unit ${w.unit}`);
  if (!rateKeys.has(w.labor_rate_key)) err(`${where}: unknown labor rate ${w.labor_rate_key}`);

  for (const [field, min] of [['labor_hours_per_unit', 0], ['crew_size', 0],
                              ['material_cost_per_unit_usd', 0], ['waste_factor_pct', 0], ['min_charge_usd', 0]]) {
    const v = w[field];
    if (typeof v !== 'number' || Number.isNaN(v)) err(`${where}: ${field} must be a number`);
    else if (v < min) err(`${where}: ${field} must be >= ${min}`);
  }
  if (typeof w.permit !== 'boolean') err(`${where}: permit must be boolean`);
  if (!Array.isArray(w.tags)) err(`${where}: tags must be an array`);
  if (w.labor_hours_per_unit === 0 && w.material_cost_per_unit_usd === 0)
    warn(`${where}: neither labor nor material cost — priced only by its minimum charge`);
}
for (const key of sectionKeys) if (!usedSections.has(key)) warn(`section ${key} has no work items`);

// --- regions ----------------------------------------------------------------
const stateCodes = new Set(regions.states.states.map((s) => s.state));
const w = regions.states.basis.weights;
if (Math.abs(w.labor + w.material + w.equipment - 1) > 1e-9) err('state_factors.json: weights must sum to 1');

let prevTo = -1;
for (const r of regions.zip3Ranges) {
  if (!/^\d{3}$/.test(r.from) || !/^\d{3}$/.test(r.to)) err(`zip3 range ${r.from}-${r.to}: not 3-digit`);
  if (Number(r.from) > Number(r.to)) err(`zip3 range ${r.from}-${r.to}: reversed`);
  if (Number(r.from) <= prevTo) err(`zip3 range ${r.from}-${r.to}: overlaps the previous range`);
  prevTo = Number(r.to);
  if (!stateCodes.has(r.state)) err(`zip3 range ${r.from}-${r.to}: unknown state ${r.state}`);
}

const metroZip3 = new Map();
for (const m of regions.metros) {
  if (!stateCodes.has(m.state)) err(`metro ${m.metro}: unknown state ${m.state}`);
  for (const z of m.zip3) {
    if (!/^\d{3}$/.test(z)) err(`metro ${m.metro}: bad zip3 ${z}`);
    if (metroZip3.has(z)) err(`zip3 ${z} claimed by both "${metroZip3.get(z)}" and "${m.metro}"`);
    metroZip3.set(z, m.metro);
  }
  for (const f of ['labor', 'material', 'equipment'])
    if (!(m[f] > 0)) err(`metro ${m.metro}: ${f} index must be > 0`);
}

const zip3Rows = resolveZip3(regions);
for (const [z, metro] of metroZip3)
  if (!zip3Rows.some((r) => r.zip3 === z)) err(`metro "${metro}" claims zip3 ${z}, which no state range covers`);

// --- packages ---------------------------------------------------------------
const pkgSlugs = new Set();
for (const p of packages) {
  const where = `${p.sourceFile} ${p.slug}`;
  if (pkgSlugs.has(p.slug)) err(`${where}: duplicate package slug`);
  pkgSlugs.add(p.slug);
  if (!['basic', 'standard', 'premium'].includes(p.tier)) err(`${where}: bad tier ${p.tier}`);

  const scope = {};
  const varKeys = new Set();
  for (const v of p.variables ?? []) {
    if (varKeys.has(v.key)) err(`${where}: duplicate variable ${v.key}`);
    varKeys.add(v.key);
    if (typeof v.default !== 'number') err(`${where}: variable ${v.key} needs a numeric default`);
    scope[v.key] = v.default;
  }

  const seenItems = new Set();
  const usedVars = new Set();
  for (const it of p.items) {
    if (!byCode.has(it.code)) { err(`${where}: unknown work item ${it.code}`); continue; }
    if (seenItems.has(it.code)) err(`${where}: work item ${it.code} listed twice`);
    seenItems.add(it.code);
    let ast;
    try { ast = parse(it.qty); } catch (e) { err(`${where} ${it.code}: ${e.message}`); continue; }
    for (const v of variablesUsed(ast)) {
      usedVars.add(v);
      if (!varKeys.has(v)) err(`${where} ${it.code}: formula uses undeclared variable ${v}`);
    }
    let qty;
    try { qty = evaluate(ast, scope); } catch (e) { err(`${where} ${it.code}: ${e.message}`); continue; }
    if (!Number.isFinite(qty)) err(`${where} ${it.code}: formula does not evaluate to a finite number`);
    else if (qty < 0) err(`${where} ${it.code}: negative quantity ${qty} at default inputs`);
    else if (qty === 0 && !it.optional) warn(`${where} ${it.code}: evaluates to 0 at defaults but is not optional`);
  }
  for (const v of varKeys) if (!usedVars.has(v)) warn(`${where}: variable ${v} is declared but never used`);
}

// --- report -----------------------------------------------------------------
const regionRows = regionFactorRows(regions);
console.log(`trades ${trades.length}  sections ${sectionKeys.size}  work items ${workItems.length}`);
console.log(`packages ${packages.length}  package lines ${packages.reduce((a, p) => a + p.items.length, 0)}`);
console.log(`region factors ${regionRows.length}  zip3 rows ${zip3Rows.length}  (${metroZip3.size} metro-overridden)`);
for (const m of warnings) console.warn(`warn: ${m}`);
for (const m of errors) console.error(`error: ${m}`);
if (errors.length) { console.error(`\n${errors.length} error(s)`); process.exit(1); }
console.log(`\nOK — ${warnings.length} warning(s), 0 errors`);
