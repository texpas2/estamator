import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const DATA = join(ROOT, 'data');

const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const readDir = (dir) =>
  readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => [f, readJson(join(dir, f))]);

export function loadCatalog() {
  const units = readJson(join(DATA, 'units.json')).units;
  const laborRates = readJson(join(DATA, 'labor_rates.json'));
  const trades = readJson(join(DATA, 'trades.json')).trades;
  const pricingProfiles = readJson(join(DATA, 'pricing_profiles.json')).profiles;

  const workItems = [];
  for (const [file, doc] of readDir(join(DATA, 'work_items'))) {
    for (const item of doc.items) workItems.push({ ...item, trade: doc.trade, sourceFile: `work_items/${file}` });
  }

  const packages = [];
  for (const [file, doc] of readDir(join(DATA, 'packages'))) {
    for (const pkg of doc.packages) packages.push({ ...pkg, sourceFile: `packages/${file}` });
  }

  const regions = {
    states: readJson(join(DATA, 'regions', 'state_factors.json')),
    zip3Ranges: readJson(join(DATA, 'regions', 'zip3_state_ranges.json')).ranges,
    metros: readJson(join(DATA, 'regions', 'metro_factors.json')).metros,
  };

  return { units, laborRates, trades, pricingProfiles, workItems, packages, regions };
}

/** Composite index from its three components, using the weights declared in state_factors.json. */
export function composite(f, weights) {
  return +(f.labor * weights.labor + f.material * weights.material + f.equipment * weights.equipment).toFixed(2);
}

/**
 * Expand ZIP3 ranges + metro overrides into one row per assigned 3-digit prefix.
 * A metro override wins over the state factor for the prefixes it lists.
 */
export function resolveZip3(regions) {
  const weights = regions.states.basis.weights;
  const stateByCode = new Map(regions.states.states.map((s) => [s.state, s]));
  const metroByZip3 = new Map();
  for (const m of regions.metros) for (const z of m.zip3) metroByZip3.set(z, m);

  const rows = [];
  for (const range of regions.zip3Ranges) {
    for (let n = Number(range.from); n <= Number(range.to); n++) {
      const zip3 = String(n).padStart(3, '0');
      const metro = metroByZip3.get(zip3);
      const state = stateByCode.get(range.state);
      if (!state) throw new Error(`zip3 range ${range.from}-${range.to} names unknown state ${range.state}`);
      const src = metro ?? state;
      rows.push({
        zip3,
        state: range.state,
        level: metro ? 'metro' : 'state',
        regionCode: metro ? metroSlug(metro) : range.state,
        regionName: metro ? metro.metro : state.name,
        labor: src.labor,
        material: src.material,
        equipment: src.equipment,
        composite: composite(src, weights),
      });
    }
  }
  return rows;
}

export const metroSlug = (m) =>
  m.metro.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Region factor rows for the `region_factor` table: national + every state + every metro. */
export function regionFactorRows(regions) {
  const weights = regions.states.basis.weights;
  const rows = [{ level: 'national', code: 'US', name: 'US National Average', state: null,
                  labor: 100, material: 100, equipment: 100, composite: 100 }];
  for (const s of regions.states.states)
    rows.push({ level: 'state', code: s.state, name: s.name, state: s.state,
                labor: s.labor, material: s.material, equipment: s.equipment, composite: composite(s, weights) });
  for (const m of regions.metros)
    rows.push({ level: 'metro', code: metroSlug(m), name: m.metro, state: m.state,
                labor: m.labor, material: m.material, equipment: m.equipment, composite: composite(m, weights) });
  return rows;
}
