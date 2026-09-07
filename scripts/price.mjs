#!/usr/bin/env node
/**
 * Price a work item or a whole package for a ZIP code, without a database.
 *
 *   node scripts/price.mjs --zip 94110 --item DRY-010 --qty 800
 *   node scripts/price.mjs --zip 94110 --package bathroom-remodel-standard
 *   node scripts/price.mjs --zip 94110 --package bathroom-remodel-standard --var floor_area_sf=60
 *   node scripts/price.mjs --zip 39201 --compare 94110,10001,60607
 */
import { loadCatalog, resolveZip3 } from './lib/load.mjs';
import { evalFormula } from './lib/formula.mjs';

const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const flags = (name) => argv.reduce((acc, a, i) => (a === `--${name}` ? [...acc, argv[i + 1]] : acc), []);

const { laborRates, trades, pricingProfiles, workItems, packages, regions } = loadCatalog();
const zip3Index = new Map(resolveZip3(regions).map((r) => [r.zip3, r]));
const rateByKey = new Map(laborRates.rates.map((r) => [r.key, r]));
const itemByCode = new Map(workItems.map((w) => [w.code, w]));
const NATIONAL = { zip3: '---', regionName: 'US National Average', state: 'US', labor: 100, material: 100, equipment: 100, composite: 100 };

const regionFor = (zip) => zip3Index.get(String(zip).replace(/\D/g, '').slice(0, 3)) ?? NATIONAL;
const usd = (v) => `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** National unit cost, split into labor and material. Labor hours are man-hours; waste applies to material only. */
function unitCost(item) {
  const rate = rateByKey.get(item.labor_rate_key);
  return {
    labor: item.labor_hours_per_unit * rate.usd_per_hour,
    material: item.material_cost_per_unit_usd * (1 + item.waste_factor_pct / 100),
  };
}

/**
 * Localized line total. Labor and material are indexed independently, and the
 * minimum charge moves with the composite index. `applyMinimum` is false for a
 * line inside a package: a per-item minimum represents a standalone trip charge,
 * so applying it to every line of a larger job double-counts mobilization.
 */
function priceItem(item, qty, region, applyMinimum = true) {
  const { labor, material } = unitCost(item);
  const laborCost = labor * qty * region.labor / 100;
  const materialCost = material * qty * region.material / 100;
  const subtotal = laborCost + materialCost;
  const floor = applyMinimum ? item.min_charge_usd * region.composite / 100 : 0;
  return { laborCost, materialCost, subtotal, floor, total: Math.max(subtotal, floor), minApplied: subtotal < floor };
}

function priceRow(item, qty, region, applyMinimum) {
  const p = priceItem(item, qty, region, applyMinimum);
  return `  ${item.code}  ${item.name.slice(0, 44).padEnd(44)} ${String(+qty.toFixed(2)).padStart(9)} ${item.unit.padEnd(4)} ` +
         `${usd(p.laborCost).padStart(12)} ${usd(p.materialCost).padStart(12)} ${usd(p.total).padStart(12)}${p.minApplied ? '  (min)' : ''}`;
}

function header(region) {
  const label = region.regionName.includes(`, ${region.state}`) || region.state === 'US'
    ? region.regionName
    : `${region.regionName}, ${region.state}`;
  return `${label}  [ZIP3 ${region.zip3}]  labor ${region.labor} / material ${region.material} / equipment ${region.equipment} / composite ${region.composite}`;
}

const profile = (() => {
  const want = flag('profile');
  const found = want ? pricingProfiles.find((p) => p.slug === want) : pricingProfiles.find((p) => p.is_default);
  if (want && !found) { console.error(`unknown pricing profile ${want}`); process.exit(1); }
  return found;
})();

/** Direct cost -> quoted price. Sales tax lands on material only; the rest compound on the marked-up base. */
function applyProfile(direct, materialShare, p) {
  const tax = direct * materialShare * (p.material_sales_tax_pct / 100);
  const base = direct + tax;
  const withContingency = base * (1 + p.contingency_pct / 100);
  const withOverhead = withContingency * (1 + p.overhead_pct / 100);
  const withProfit = withOverhead * (1 + p.profit_pct / 100);
  return { tax, quoted: withProfit * (1 + p.permit_fee_pct / 100) };
}

const zip = flag('zip');
const compare = flag('compare');
const itemCode = flag('item');
const pkgSlug = flag('package');

if (!itemCode && !pkgSlug) {
  console.error('usage: price.mjs --zip <zip> (--item <CODE> [--qty n] | --package <slug> [--var key=value ...])' +
                ' [--with-optional] [--apply-minimums] [--profile slug] [--compare zip,zip,...]');
  process.exit(2);
}

const overrides = Object.fromEntries(flags('var').map((s) => {
  const [k, v] = String(s).split('=');
  return [k, Number(v)];
}));

function totalForPackage(pkg, region, includeOptional, applyMinimums = false) {
  const scope = Object.fromEntries((pkg.variables ?? []).map((v) => [v.key, overrides[v.key] ?? v.default]));
  let total = 0, material = 0;
  const lines = [];
  for (const it of pkg.items) {
    if (it.optional && !includeOptional) continue;
    const item = itemByCode.get(it.code);
    const qty = evalFormula(it.qty, scope);
    if (qty <= 0) continue;
    const p = priceItem(item, qty, region, applyMinimums);
    total += p.total;
    material += p.materialCost;
    lines.push(priceRow(item, qty, region, applyMinimums));
  }
  return { total, lines, scope, materialShare: total > 0 ? material / total : 0 };
}

const zips = compare ? compare.split(',').map((s) => s.trim()) : [zip ?? '00000'];

if (itemCode) {
  const item = itemByCode.get(itemCode);
  if (!item) { console.error(`unknown work item ${itemCode}`); process.exit(1); }
  const qty = Number(flag('qty', '1'));
  console.log(`\n${item.code}  ${item.name}   ${qty} ${item.unit}`);
  for (const z of zips) {
    const region = regionFor(z);
    const p = priceItem(item, qty, region);
    console.log(`\n${header(region)}`);
    console.log(`  labor ${usd(p.laborCost)}   material ${usd(p.materialCost)}   total ${usd(p.total)}${p.minApplied ? '  (minimum charge)' : ''}`);
  }
} else {
  const pkg = packages.find((p) => p.slug === pkgSlug);
  if (!pkg) { console.error(`unknown package ${pkgSlug}`); process.exit(1); }
  const includeOptional = argv.includes('--with-optional');
  const applyMinimums = argv.includes('--apply-minimums');
  const first = regionFor(zips[0]);
  const { lines, scope, total, materialShare } = totalForPackage(pkg, first, includeOptional, applyMinimums);

  console.log(`\n${pkg.name}  [${pkg.slug}, tier ${pkg.tier}]`);
  console.log(`inputs: ${Object.entries(scope).map(([k, v]) => `${k}=${v}`).join('  ')}`);
  console.log(`\n${header(first)}\n`);
  console.log(`  CODE     ${'WORK'.padEnd(44)} ${'QTY'.padStart(9)} UNIT ${'LABOR'.padStart(12)} ${'MATERIAL'.padStart(12)} ${'TOTAL'.padStart(12)}`);
  lines.forEach((l) => console.log(l));
  console.log(`\n  ${lines.length} lines${includeOptional ? ' (incl. optional)' : ' (optional excluded)'}` +
              `${applyMinimums ? ', item minimums applied' : ', item minimums ignored (one mobilization for the whole job)'}` +
              `   DIRECT COST ${usd(total)}`);

  const { tax, quoted } = applyProfile(total, materialShare, profile);
  console.log(`\n  Profile "${profile.name}": +${profile.contingency_pct}% contingency, +${profile.overhead_pct}% overhead, ` +
              `+${profile.profit_pct}% profit, ${profile.material_sales_tax_pct}% tax on material (${usd(tax)}), +${profile.permit_fee_pct}% permit`);
  console.log(`  QUOTED PRICE ${usd(quoted)}`);

  if (zips.length > 1) {
    console.log('\nSame package by ZIP:');
    const base = totalForPackage(pkg, NATIONAL, includeOptional, applyMinimums).total;
    for (const z of zips) {
      const region = regionFor(z);
      const r = totalForPackage(pkg, region, includeOptional, applyMinimums);
      const delta = ((r.total / base - 1) * 100).toFixed(1);
      const q = applyProfile(r.total, r.materialShare, profile).quoted;
      console.log(`  ${String(z).padEnd(7)} direct ${usd(r.total).padStart(12)}  quoted ${usd(q).padStart(12)}  ` +
                  `${(delta >= 0 ? '+' : '') + delta}% vs national   ${region.regionName}`);
    }
  }
}
