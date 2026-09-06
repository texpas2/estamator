# Estibill / Next Build — Strategic Analysis & Improvement Proposal

**Status:** Working analysis, v0.1 — September 2026
**Inputs reviewed:** Estibill Strategic Plan v1, Estibill Strategic Plan v2 (Simplicity First), Next Build Master Strategic Task v1, Next Build Strategic Blueprint v2 (Full), plus the device-strategy note (task-first: mobile / web / assistant).
**Purpose:** Answer one question honestly: *what is missing from these documents for the "complexity program" to actually solve the contractor's pain points and be materially stronger than Estibill?* Then propose what to add, what to change, and in what order.

This document does not replace the four strategy documents. Everything already agreed stays. New material is added and linked; conflicts are flagged explicitly (see §2).

---

## 0. Executive summary

The four documents are strong on **demand-side vision** (Tell / Show / Upload intake, evidence model, property intelligence, realtor workflows), **network design** (best-fit matching, liquidity-aware distribution, B2B subcontracting), **growth loops** (free profile, auto portfolio, auto marketing) and **doctrine** (simplicity, AI is not the source of truth for money, privacy separation).

They are weak in exactly the place the user has now asked to go deep: **the contractor's day-to-day economics.** Specifically:

1. **The estimating engine is never designed.** Every document says "deterministic scope/rules/pricing" and none says how a number is produced. Without this, the LLM *will* become the source of truth for money, which violates the documents' own principle.
2. **The contractor pain-point map is incomplete.** Getting paid, change-order discipline, omissions in bids, job costing, material volatility, contracts/lien law, permits and scheduling are the top pain points in every industry survey. The documents mention some as entity names only.
3. **The self-calibration loop is absent.** The single strongest feature a "complex estimator" can have is: *learn this contractor's real productivity and costs from their own completed jobs, and correct their next estimate.* Market benchmarks are mentioned; per-contractor calibration is not.
4. **Sequencing puts demand before the data that makes demand credible.** Preliminary budgets without real contractor actuals are just a national catalog with a ZIP multiplier. Anyone can build that. The moat is contractor actuals, so supply-side depth should come first.

Recommendation: keep Estibill as the simple wedge, and define the new program as **one shared core with an "Estimate Compiler" at its center**. Estibill's Quick Estimate and the full complex estimate are two views of the same compiled data. The roadmap below (§9) moves contractor depth (assemblies, calibration, change orders, payments, job costing) ahead of consumer intake, without delaying Estibill's launch.

---

## 1. What the documents get right (keep unchanged)

| Area | Why it is right |
|---|---|
| Simplicity as an architectural constraint, not a UI polish step | Correct and rare. The Simplicity Gate (§13A / §23 / §29) should be enforced on every spec, including everything proposed here. |
| Evidence statuses (OBSERVED / USER CONFIRMED / ASSUMED / UNKNOWN / CONTRACTOR VERIFIED) | This is the right primitive. Extend it (see §4.5), do not replace it. |
| "AI is an interface and extraction layer, not the accounting system" | Correct. This document exists largely to make that principle *implementable*. |
| One core, multiple interfaces; Property → Project → Job backbone | Correct. The device-strategy note (task-first: mobile / web / assistant on one cloud) is the right refinement. |
| Best-fit matching instead of star ratings; paid tier never buys ranking | Correct and defensible against Angi/Thumbtack-style distrust. |
| Liquidity-aware network mechanics | Correct. It is also the right answer to cold start. |
| Four price states (quoted / awarded / invoiced / paid) | Correct, and more sophisticated than most competitors. Needs a fifth: **estimated internal cost** (see §4.3). |
| Process media once, store facts, never resend the conversation | Correct; this is the difference between a viable and a bankrupt AI product. |
| Value before registration; zero-install mobile web for occasional homeowners | Correct. The SMS-link → mobile web → 60-second intake → result flow should be the canonical consumer entry. |
| B2B subcontractor exchange as an acquisition engine | Strong insight. GCs bring subs; subs become users. |
| Auto portfolio / auto marketing as by-products of normal work | Strong. "Work once, reuse it everywhere." |

---

## 2. Gaps, weaknesses and contradictions (findings)

Numbered so later documents can reference them.

**F1. No pricing/estimating engine design.** "Deterministic core" is asserted ~12 times across the documents and never specified. There is no taxonomy design, no assembly model, no quantity/takeoff model, no unit-rate structure, no location-index design, no uncertainty model. Risk: the team ships an LLM that emits "$24,000–$34,000" with no provenance. See §4.

**F2. Contractor pain points covered by name only.** Change Orders, Time, Expenses, Receipts, Invoices, Payments appear in entity lists. There is no workflow, no doctrine, and no phase for: progress billing, deposits, retainage, late payment, lien waivers, contracts with state-required clauses, permits/inspections, warranty/callbacks, material procurement, supplier price volatility, bid win/loss tracking. See §3.

**F3. No per-contractor calibration loop.** Market intelligence (aggregate) is designed; self-learning (this company's productivity rates, waste factors, markup effectiveness, typical omissions) is not. See §4.7.

**F4. Missing-items detection is absent.** Omission is the #1 cause of lost margin on residential jobs (forgotten dumpster, permit, drywall patching after plumbing, disposal, protection, transitions). Nothing in the documents catches omissions. See §4.6.

**F5. Takeoff/measurement is hand-waved.** "Ask approximate bathroom size if needed" is the only mention. Phones now provide LiDAR/RoomPlan, photo-scale measurement and PDF plan takeoff. This is a major differentiator and a direct simplicity win (measure instead of ask). See §4.2.

**F6. Options, allowances, exclusions and assumptions are not modeled.** Good/better/best options, optional add-ons, allowances for undecided finishes, and explicit exclusions raise average ticket, reduce disputes and are how professional contractors actually sell. Not present in any entity list. See §4.8.

**F7. Payments are not a product.** The documents treat payment as a record. On-platform payment (card/ACH, deposits, milestone draws, homeowner financing partners) is a monetization lever, an anti-disintermediation lever and a data-quality lever (the "paid" price state only exists if payment happens on-platform). See §5.5.

**F8. Offline field use is not addressed.** Basements, new builds and rural sites have no signal. Field capture (photos, time, receipts, change-order voice notes) must be offline-first with sync. The device-strategy note is right about task-first; it needs this addition.

**F9. Language is not addressed.** A large share of US trade labor and many small-contractor owners are Spanish-speaking; the founding team itself works across Ukrainian/Russian/English. Voice intake and Assistant in the user's language, output documents in the client's language, is a genuine wedge that incumbents handle badly.

**F10. Two documents, two roadmaps, one missing owner.** Estibill Plan v2 says Estibill Business is "simple". Next Build docs say the deep contractor OS lives in Estibill. Neither roadmap has a phase that builds change orders, payments, job costing or scheduling in depth. The "complexity program" the user is asking for is that missing phase set.

**F11. Metrics have no contractor-economics metrics.** No estimate accuracy (estimated vs actual cost), no gross margin per job, no bid win rate, no days-sales-outstanding, no change-order capture rate. If the product's promise to contractors is "make more money with less pain", these must be first-class.

**F12. Cold-start pricing data has no plan.** Where does the first reference price come from on day one, before any contractor has completed a job? See §10.

**F13. Insurance-restoration segment ignored.** "Damage Documentation" is listed as a use case but restoration contractors live inside Xactimate line items. Compatibility (import/export line-item mapping) would unlock a large, high-volume segment. Decision needed; not a phase-1 item.

**F14. Regulatory surface understated.** US home-improvement contracts have state-specific mandatory clauses (e.g. right-to-cancel, lien notices, license number display); SMS outreach falls under TCPA; contractor license verification varies by state board; the proposed "customer experience network" (Blueprint §20) risks FCRA-like treatment. Recommend: contract-clause library by state as a product feature; defer §20 indefinitely.

**F15. Minor inconsistencies.** Estibill Plan v2 still carries the "v1.0" header. Phase numbering differs between the Estibill plan (Business OS = Phase 2) and Next Build (Supply profiles = Phase 2). Harmless, but a canonical roadmap (§9) should supersede both.

---

## 3. The contractor pain-point map

"Cover everything" needs a definition of everything. The table below lists the recurring pain points of US residential contractors (1–20 people), what causes each, which module must own it, and whether the existing documents already cover it.

| # | Pain point | Root cause | Owning module (proposed) | Covered today? |
|---|---|---|---|---|
| P1 | Underbidding / forgetting items | No assemblies, no checklists, estimating from memory | Estimate Compiler + Missing-Items Detector (§4.6) | No (F1, F4) |
| P2 | Unpaid estimating time; low bid win rate | No qualification, no reuse, no win/loss data | Templates/Assemblies, Bid Outcome analytics (§4.9), Network qualification | Partly (intake qualifies leads) |
| P3 | Scope creep without payment | Verbal change orders, no evidence, no client approval flow | Change Order Engine (§5.3) | Name only |
| P4 | Getting paid late / not at all | No deposits, no milestone billing, paper invoices, no reminders | Payments & Billing (§5.5) | Name only (F7) |
| P5 | Not knowing if a job made money | No job costing, receipts in a shoebox, labor untracked | Job Costing (§5.6) | Name only |
| P6 | Material price volatility | Quotes valid 30 days, prices move weekly | Price Book with supplier feeds, price-validity window, escalation clause (§5.4) | No |
| P7 | Scheduling chaos, sub no-shows | No shared schedule, no dependencies, no confirmations | Schedule (§5.2) + Network reliability signals | Partly |
| P8 | Labor shortage / finding subs | No network | B2B Subcontractor Exchange | Yes |
| P9 | Paperwork: contracts, lien waivers, COIs, W-9/1099, permits | Legal complexity per state | Contracts & Compliance (§5.1, §5.7) | No (F14) |
| P10 | Client communication and expectations | No client portal, texts scattered | Client Portal (§5.8) | Vague |
| P11 | Callbacks / warranty work | No close-out record, no punch list | Close-out & Warranty (§5.9) | No |
| P12 | Marketing and reviews take time | No system | Auto Portfolio / Auto Marketing / Reviews | Yes |
| P13 | Finding work | No demand access | Network, Free Profile | Yes |
| P14 | Bookkeeping / taxes | Data not structured | Job Costing export, accounting integrations (QuickBooks) | No |
| P15 | Field data lost (photos, receipts, hours) | No offline capture | Field Mode, offline-first (§7.4) | No (F8) |
| P16 | Language barriers with crew or clients | Monolingual tools | Multilingual Assistant & documents (§7.5) | No (F9) |
| P17 | Measuring and site visits cost time | No remote takeoff | Takeoff (§4.2), remote verification | Partly |

The "complexity program" is complete when every row has an owner, a spec and a phase.

---

## 4. The Estimate Compiler: how a number is actually produced

This is the center of the complex program. The principle: **a price is compiled from structured scope by deterministic code, with provenance and a confidence range on every line.** AI produces and edits the *scope*; it never produces the *price*.

```
Scope (ScopeItems with quantities and evidence)
   → Assembly expansion (work type → components)
   → Quantity resolution (takeoff, defaults, assumptions)
   → Unit-rate lookup (pricing stack, §4.3)
   → Adjustments (location, access, height, finish level, waste)
   → Markup & overhead (company settings)
   → Priced lines with provenance + P20/P50/P80 range
   → Estimate document (client view) + Cost view (internal)
```

### 4.1 Work-type taxonomy and assemblies

* **Taxonomy:** a residential-first normalized work-type tree (e.g. `FLOORING.LVP.INSTALL`, `BATH.TUB_TO_SHOWER.CONVERSION`, `ELEC.PANEL.REPLACE_200A`). Map to CSI MasterFormat divisions for commercial and to Xactimate categories for restoration later; do not adopt either as the primary UX taxonomy (both are hostile to users).
* **Assembly:** a work type expands into components: labor tasks (with productivity rates, e.g. 0.35 hr/sqft), materials (with waste factor), equipment, subcontract, permits/fees, disposal. Example: `FLOORING.LVP.INSTALL` → demo existing floor, haul-off, subfloor prep, underlayment, LVP material, transitions, baseboard remove/reinstall or new, labor.
* **Three layers of assemblies:** platform default catalog → company overrides (their prices, their crews' rates) → per-estimate edits. Contractor edits at any layer are captured as calibration data (§4.7).
* **Every ScopeItem stores both** the normalized work type *and* the contractor's original wording. The client never sees the code.

### 4.2 Quantities and takeoff

Quantities are the largest uncertainty driver and the most annoying thing to ask for. Order of preference:

1. **Measured:** iPhone LiDAR / RoomPlan, Android ARCore room scan, photo-scale measurement with a reference object, PDF floor-plan takeoff (scale detection, polygon tools on desktop).
2. **Extracted:** from inspection reports, prior estimates, listing data (sqft, year built, stories, roof type from public records).
3. **Stated:** voice/text ("about twelve by fourteen") → USER CONFIRMED.
4. **Defaulted:** typical room sizes by room type and house era → ASSUMED, wide range.

Each quantity carries source, evidence status and a tolerance. The compiler propagates tolerance into the price range.

### 4.3 The pricing stack (fallback order for a contractor's own estimate)

| Priority | Source | Provenance label |
|---|---|---|
| 1 | This company's own historical actuals for this work type (from job costing) | "Your last 6 similar jobs" |
| 2 | This company's price book / overrides | "Your price book" |
| 3 | Network aggregated benchmarks for this ZIP/metro and work type (privacy-thresholded) | "Local market range" |
| 4 | Reference catalog × location index | "Reference estimate" |
| 5 | AI prior (LLM-suggested when nothing else exists) | "Low-confidence suggestion" — always flagged, never silent |

For a consumer preliminary budget, priority 1–2 are unavailable, so 3 → 4 → 5 apply. This is why supply-side data must come first: without priority 3, consumer budgets are only as good as any competitor's.

Add a fifth price state to the existing four (quoted / awarded / invoiced / paid): **estimated cost** (internal). Quoted minus estimated cost is planned margin; invoiced minus actual cost is realized margin. Margin is the metric contractors actually care about.

### 4.4 Uncertainty and ranges

* Every unit rate and quantity is a distribution (min / likely / max), not a point.
* Compile ranges with simple interval arithmetic for v1 (fast, explainable); Monte Carlo later if needed.
* Output **P20 / P50 / P80**. Client view shows a range; contractor view shows P50 plus the drivers.
* **Uncertainty attribution:** the compiler must be able to say which three inputs contribute most to range width. This directly powers the "what would narrow this" explanation already required in the documents, but now it is computed rather than written by an LLM.

### 4.5 Evidence model extensions

Keep the five statuses. Add:

* **Provenance pointer:** which photo, which page/line of which document, which utterance, which sensor measurement.
* **Contradiction detection:** user says 10×10, LiDAR says 11.5×13; report says "no active leak", photo shows staining. Contradictions are surfaced as one-tap questions, never silently resolved.
* **Staleness:** observations age (a photo from 8 months ago is weaker evidence than one from today).
* **Verification depth:** CONTRACTOR VERIFIED should record *how* (remote photo review vs. on-site) and *by whom* (credential).

### 4.6 Missing-Items Detector

Two complementary mechanisms:

* **Deterministic co-occurrence rules:** "tub-to-shower conversion" almost always implies plumbing rough-in change, drywall repair, waterproofing, glass door, permit in most jurisdictions, dumpster/haul-off, floor protection. Rules ship with the default catalog and learn from the network (what did contractors add after the first draft?).
* **AI review pass:** an inexpensive model reads the compiled estimate and the scope facts and proposes candidate omissions, phrased as questions with one-tap add. The model proposes; the contractor decides; the compiler prices.

Output on every estimate: "Estimates like this usually also include: … (add / not needed)". Measured by change-order rate on jobs that used the detector vs. those that did not.

### 4.7 Calibration loop (the moat)

For each completed job with job costing enabled:

* Compare estimated vs. actual **labor hours per work type**, **material cost per unit**, **waste**, **duration**.
* Update the company's productivity rates and price book (with the contractor's approval, one tap: "Update my rates from this job?").
* Surface patterns: "Your tile labor estimates average 18% under actual across 7 jobs."
* Feed de-identified deltas to the network benchmark pipeline (permissioned, thresholded).

This is what makes the tenth estimate better than the first. No incumbent small-contractor tool does this well.

### 4.8 Estimate structure the documents lack

* **Options / alternates** (good / better / best), optional add-on lines, **allowances** for undecided selections, **exclusions** and **assumptions** rendered explicitly in the client document.
* **Revisions:** every estimate is versioned; the client sees a clean diff ("v3: added glass door +$1,450; removed heated floor −$2,100").
* **Sections** aligned to trade packages so the B2B subcontract exchange can lift a section directly (this is already implied in Blueprint §18; it needs the data model to support it).
* **Price validity window** and material escalation clause tied to the price book date.

### 4.9 Bid outcome analytics

Track sent → viewed → accepted / declined / expired, with a one-tap "why lost" (price, timing, went elsewhere, no response). Combine with network benchmark position ("you were 12% above local median") to learn the company's win-rate curve versus markup. This converts P2 from a complaint into a dial.

---

## 5. Beyond the estimate: the contractor operating loop

The estimate is one node in a loop. Each stage below needs an owner module and a simplicity-gated primary path. Descriptions are deliberately short; each becomes its own tactical spec.

```
Lead → Estimate → Proposal/Contract + e-sign → Deposit → Schedule → Field work
  → Change orders → Progress billing → Job costing → Close-out/Warranty → Review/Portfolio → Data
```

### 5.1 Proposal & contract
Generate a client-ready proposal from the compiled estimate. Attach a **contract from a state-aware clause library** (payment schedule, right-to-cancel where required, license number, lien notice, warranty terms, change-order procedure). E-signature built in. Primary path: *Send → client taps Approve & Sign → deposit screen.*

### 5.2 Schedule
Crew and sub assignment, simple dependencies (rough-in before drywall), inspection milestones, weather-sensitive tasks flagged. Confirmations to subs by SMS; no-show/late signals feed reliability scores. Worker's mobile shows only *Today's Jobs* (per device-strategy note).

### 5.3 Change Order Engine
The single highest-ROI feature after the compiler. Primary path on site: *photo + 10-second voice note → AI drafts change order lines → compiler prices them → client gets SMS → taps Approve → invoice schedule updates.* Target: under 60 seconds from discovery to client approval request. Metric: change-order capture rate (approved CO value ÷ actual extra work value).

### 5.4 Materials & price book
Estimate → shopping list / purchase order by supplier. Supplier price feeds where APIs exist (pro accounts at big-box and trade suppliers); receipt OCR fallback. Price-lock window on quotes; escalation clause auto-inserted when the window is exceeded.

### 5.5 Payments & billing (make it a product)
Deposits, milestone/progress invoices, retainage, partial payments, card/ACH, automated reminders, late fees per contract, instant payout option. **Homeowner financing** via partner for larger jobs (raises close rate). Lien waiver generated on payment. Payments on-platform is also what makes the *paid* price state and *verified completed work* real, and it is the natural anti-disintermediation incentive (protection and reviews only for on-platform jobs). Monetization: processing margin plus optional instant payout fee.

### 5.6 Job costing
Every cost flows to a project and a cost code automatically: time entries (mobile clock-in with geofence), receipts (OCR → vendor, amount, cost code), sub invoices, materials from POs. Live **budget vs. actual** per project and per work type. This is the data source for calibration (§4.7). Export to QuickBooks/Xero.

### 5.7 Compliance
License and insurance certificate storage with expiry reminders; sub W-9 collection and 1099 export; permit tracking with inspection dates on the schedule. Credential verification against state boards where APIs or scrapeable registries exist (feeds Network trust).

### 5.8 Client portal (no login required via magic link)
Client sees: estimate/proposal, contract, schedule, photos/progress, change orders to approve, invoices to pay, messages. One link, no account. This is the homeowner-side mirror of the zero-install consumer intake.

### 5.9 Close-out & warranty
Punch list from photos, final walkthrough sign-off, warranty record on the Property, callback tracking. Close-out triggers the review request and the portfolio suggestion (already in the documents), so reputation grows as a by-product.

---

## 6. Data model additions

Add to the canonical entity groups already defined in Blueprint §5:

| Group | New entities |
|---|---|
| Estimating | `WorkType` (taxonomy node), `Assembly`, `AssemblyComponent`, `UnitRate`, `LaborRate`, `ProductivityRate`, `WasteFactor`, `LocationIndex`, `PriceBook` (per company, versioned), `PriceBookEntry`, `EstimateRevision`, `Option/Alternate`, `Allowance`, `Exclusion`, `Assumption`, `UncertaintyDriver` |
| Takeoff | `Measurement` (with method: lidar / photo-scale / plan / stated / default), `PlanDocument`, `TakeoffPolygon` |
| Commercial | `Contract`, `ContractClause`, `Signature`, `PaymentSchedule`, `Milestone`, `Retainage`, `Deposit`, `PayoutAccount`, `LienWaiver`, `PurchaseOrder`, `Supplier`, `SupplierPrice`, `FinancingOffer` |
| Field & cost | `TimeEntry`, `CostCode`, `ActualCost`, `BudgetLine`, `ReceiptExtraction` |
| Compliance | `License`, `InsuranceCertificate`, `Permit`, `Inspection`, `TaxForm` |
| Outcome | `BidOutcome` (won/lost/reason), `CalibrationDelta`, `PunchItem`, `WarrantyRecord`, `Callback` |
| Localization | `Locale` on User and on each generated document |

Everything above hangs off the existing Property → Project → Job backbone. No new database, no new surface-specific store, consistent with the "one core" principle.

---

## 7. AI architecture refinements

The documents' pipeline (media → facts → deterministic core → next question) is correct. Additions:

### 7.1 AI calls deterministic tools; it does not compute
Expose the compiler, the price book, the schedule and the fact store as **tools/functions**. The model's job is: extract facts, propose scope items, propose questions, draft text, propose omissions. Every number the user sees came from a tool call that can be replayed. This makes "AI is not the source of truth for money" enforceable in code review, not just in a principles list.

### 7.2 Fact store as the conversation memory
Per Property/Project: a structured fact table with evidence status and provenance (§4.5). The Assistant retrieves the relevant facts for the current task instead of re-reading history. The same fact store is what makes the Assistant "the same everywhere" (device-strategy note): the realtor's basement walkthrough on the phone at noon and the desktop question at 9 pm read the same facts.

### 7.3 Cost budget per job, enforced
Set a per-Job AI budget (cents for abandoned intake, a few dollars for a full report analysis). Route by task: cheap model for extraction/classification/phrasing, vision only on new media, strong model only for ambiguous synthesis. Track "AI cost per qualified Job" and "AI cost per estimate" as first-class metrics (already listed; make them alertable).

### 7.4 Offline-first field mode
Photos, voice notes, time entries, receipts and change-order drafts queue locally and sync when online. Extraction runs after sync. The worker never sees a spinner on a job site.

### 7.5 Multilingual by design
Voice intake, Assistant and crew-facing screens in the user's language (English, Spanish, Ukrainian, Russian, Polish, Portuguese as early candidates). Client-facing documents generated in the client's language. Normalized work types make this cheap: the taxonomy is language-neutral, only labels are localized.

### 7.6 Evaluation harness
A fixed regression set of voice transcripts, photos and inspection reports with gold-standard extracted scope. Every prompt or model change must not regress extraction accuracy or increase cost. Without this, quality drifts silently.

---

## 8. How a complex program stays simple

The documents' central worry is that complexity leaks into the user's head. The resolution:

* **One compiler, two views.** Estibill Quick Estimate = a short form or a voice note that produces a compiled estimate with defaults. The full estimator = the same compiled estimate with every layer exposed (assemblies, options, revisions, cost view). Users move between them without re-entry. Nothing is "upgraded"; more is *revealed*.
* **Personas set the default surface**, not a settings screen: owner (web: company), estimator (web + mobile: estimates), worker (mobile: today), client (magic link), realtor (web/iPad: properties), occasional homeowner (mobile web, no install).
* **Automation before UI, applied to estimating:** measure instead of ask (§4.2), detect instead of remind (§4.6), calibrate instead of configure (§4.7), default instead of prompt (assumptions carried with ASSUMED status).
* **Every proposed module passes the existing Simplicity Gate** with a stated primary path, tap count and time-to-value. Suggested targets: change order under 60 s to approval request; estimate from voice note under 3 min to sendable proposal; invoice from milestone in 1 tap.

---

## 9. Revised sequencing (proposal)

Rationale: supply-side depth generates the actuals that make every downstream promise (preliminary budgets, benchmarks, matching) credible. Consumer intake is still early, but not before the compiler.

| Phase | Objective | Delivers pain points |
|---|---|---|
| 0 | Protect Estibill launch (unchanged) | — |
| 1 | **Shared core + Estimate Compiler v1**: taxonomy, default assemblies, price book, location index, ranges with provenance, revisions, options/allowances/exclusions, missing-items rules | P1, P2, P6 (partial) |
| 2 | **Get-paid loop**: proposal + state-aware contract + e-sign, deposits, milestone billing, card/ACH, reminders, client portal via magic link | P3 (portal), P4, P10 |
| 3 | **Field loop**: mobile offline-first capture, Change Order Engine, time tracking, receipts OCR, job costing budget vs actual, worker "Today" | P3, P5, P15 |
| 4 | **Calibration + free profiles**: rate learning from actuals, bid outcome analytics; contractor/trade bank, auto mini-site, portfolio/review foundation (Next Build Phase 2) | P2, P12, P13 |
| 5 | **Consumer intake MVP** (Next Build Phase 3) using the same compiler for preliminary ranges, now with early network benchmarks | P13 (demand) |
| 6 | Property intelligence: inspection report analysis, evidence/confidence UI, realtor workspace | P13, P17 |
| 7 | Verification & matching; B2B subcontract exchange (lifting estimate sections) | P8, P17 |
| 8 | Network modes (urgent / flexible / small / planned), liquidity rules | P13 |
| 9 | Materials & supplier feeds, compliance (licenses, COIs, permits, 1099), accounting integrations | P6, P9, P14 |
| 10 | Market intelligence (privacy-safe benchmarks), Auto Marketing, multilingual expansion | P12, P16 |
| 11 | Scale, advanced Assistant, restoration (Xactimate compatibility) decision, larger-GC procurement | — |

Phases 1–3 are the "complexity program" the user asked for. They can run as one workstream while Next Build's supply-profile work proceeds in parallel.

---

## 10. Cold-start pricing data plan

Day-one sources, in order of trust, all labeled with provenance:

1. **Licensed reference cost data** (evaluate RSMeans-class and Craftsman-class residential databases; licensing cost vs. building a curated seed catalog of ~300 residential assemblies in-house).
2. **Location index** from published construction cost indices by metro, refined over time with network data.
3. **Early-adopter price books**: onboarding imports a contractor's existing spreadsheet/PDF estimates via the extraction pipeline and builds their price book automatically (also a great acquisition hook: "upload your last 10 estimates; we'll build your price book").
4. **Public permit valuations** where municipalities publish them (rough calibration for large scopes).
5. **LLM priors**, flagged "low-confidence suggestion", never silent.

Benchmark publication requires a minimum sample threshold per ZIP/metro × work type (e.g. ≥ 8 observations from ≥ 4 companies) before any aggregate is shown to anyone.

---

## 11. Additional risks and guardrails

| Risk | Guardrail |
|---|---|
| Compiler complexity delays everything | Ship v1 with ~50 highest-frequency residential assemblies and interval arithmetic; expand by usage data. |
| Contractors distrust "AI pricing" | Never show a number without provenance; default to *their* price book; make calibration opt-in per job. |
| Payments introduce regulatory burden | Use a payments partner with embedded KYC; do not hold funds longer than required; lien waiver templates reviewed by counsel per state. |
| State contract law variance | Clause library with per-state review; start with a small set of launch states. |
| Disintermediation after first match | Payments protection, reviews and warranty records exist only for on-platform jobs; fees stay modest (already in docs). |
| Offline conflicts | Last-writer-wins for field capture with full event log; conflicts on money fields require human resolution. |
| Extraction drift after model updates | Evaluation harness (§7.6) as a release gate. |

---

## 12. Metrics to add

Contractor economics (new):

* Estimate accuracy: |estimated cost − actual cost| ÷ actual cost, per work type and company.
* Gross margin per job (planned vs realized).
* Change-order capture rate.
* Bid win rate and price position vs local median.
* Days sales outstanding; % of invoices paid within terms; % paid on-platform.
* Time from estimate request to sent proposal.
* % of estimates flagged by Missing-Items Detector where the contractor accepted at least one suggestion.
* % of price lines with provenance priority 1–3 (own data or network) vs 4–5 (reference / AI).

Keep all existing metrics from the documents.

---

## 13. Assumptions made and decisions needed from you

Assumptions used above (change any of them and parts of §9 shift):

* **Market:** United States, residential repair and remodel, contractors with 1–20 people, plus realtors/investors as the second audience. Commercial and new-construction GCs are later.
* **Brand:** Estibill stays contractor-facing; Next Build (working name) is the property/network brand; both share one core. The "complexity program" is a core capability, not a third brand.
* **Restoration / Xactimate:** deferred to Phase 11 pending a decision.
* **Payments:** on-platform payments are in scope and are a revenue line.
* **Languages:** English first; Spanish second; Ukrainian/Russian/Polish as the founding team judges.

Decisions needed:

1. Confirm the reordering in §9 (contractor depth before consumer intake).
2. Reference cost data: license vs. build a curated seed catalog.
3. Launch states for the contract-clause library (suggest 2–3).
4. Whether payments/financing partners are acceptable in v1.
5. Whether to permanently drop the contractor-to-customer experience network (Blueprint §20). Recommendation: drop.

---

## 14. Documents to write next (decomposition)

Each should open with the Simplicity Gate answers and the "Simplest Primary Path" section required by the existing strategy.

1. **Estimate Compiler Specification** — taxonomy, assembly schema, pricing stack, range math, provenance, revision model. (§4)
2. **Change Order Engine Specification** — field flow, pricing, client approval, billing update. (§5.3)
3. **Payments & Billing Specification** — deposits, milestones, retainage, partner selection, lien waivers. (§5.5)
4. **Job Costing & Calibration Specification** — cost codes, capture, budget vs actual, rate learning, network deltas. (§5.6, §4.7)
5. **Takeoff & Measurement Specification** — LiDAR/AR, photo scale, plan takeoff, tolerance model. (§4.2)
6. **Contract & Compliance Clause Library** — per-state requirements, e-sign, licenses/COIs/permits. (§5.1, §5.7)
7. **Field Mode (offline-first) Specification** — sync model, conflict rules, worker "Today". (§7.4)
8. **Canonical Data Model v2** — Blueprint §5 plus §6 above, with the Estibill ⇄ Next Build handoff contract.
9. **AI Tools & Fact Store Specification** — function catalog, fact schema, cost budgets, evaluation harness. (§7)
10. **Cold-Start Data Plan** — sourcing, licensing, import flow, benchmark thresholds. (§10)
11. **Unified Roadmap v3** — reconcile the Estibill and Next Build phase lists into one (§9, F10, F15).

---

## 15. Monetization and network mechanics — consolidated from the working notes, with critique

The working conversation contains a more concrete monetization model than any of the four documents. Recorded here so it is not lost, then critiqued.

### 15.1 The model as stated

| Engine | Payer | Mechanism (direction, not final pricing) |
|---|---|---|
| Free Estimator | nobody | Estimate + basic invoices/clients + basic profile + partial Network visibility. Never degraded; it is the supply acquisition engine. |
| Business OS | contractor company | Business ~$39–79/mo (company, workers, projects, calendar, photos, receipts, time, chats, Assistant). Business Pro ~$99–199+ (more seats, automation, accounting integrations, analytics, advanced Network). |
| Network | contractor | Ordinary leads are never sold. A **Qualified Job Opportunity** (photos + measurements + scope + location + dates + preliminary budget + homeowner confirmed) carries a small success fee only on work actually won, e.g. 2% capped at $500, with per-category rules. Pro subscribers get included opportunities or priority access. **Network Pro ~$149/mo** removes or reduces success fees, pulling active contractors onto subscription. |
| Urgent jobs | contractor | Instant access included in Pro, or a small fixed fee after an accepted/completed urgent job. |
| Fill My Schedule | contractor (via Pro) | Contractor sets availability, radius, trades, job-size band; Network fills open days. Sold as "Pro doesn't only manage your work, it fills your schedule." |
| Property analysis | homeowner / realtor | Basic analysis free. Detailed Repair Budget Report ~$29–49. Contractor-verified remote review ~$49–99 with a split (e.g. $70 contractor / $29 platform). On-site verification at market price. |
| Larger GC | GC | Higher plan for Estimate → split scope → invite subs → bids → award → schedule → track → invoice, with a **Private Contractor Network** first and "Open to Network" as fallback. |

Governing rule, unchanged: **money buys tools and access; reputation earns trust; matching decides fit.** Paid position in ranking is never sold.

### 15.2 Critique and additions

* **"Qualified Job Opportunity" should be a formal state, not a marketing phrase.** Define it in the data model as an evidence-completeness threshold on the Job (e.g. ≥ N scope facts OBSERVED or USER CONFIRMED, location resolved, timing stated, preliminary range width under X%, homeowner confirmation event recorded). The success fee attaches only to Jobs that reached that state. This also gives the intake a target to optimize toward and makes "we do not sell junk leads" auditable.
* **Add payments as a fifth engine** (see §5.5). Processing margin on on-platform payments is likely the largest and least resented revenue line at scale, and it is what makes the *paid* price state and verified completion real.
* **Success fee cap needs modeling before launch.** 2% capped at $500 means the platform earns the same on a $25k and a $250k job. That is fine for trust and probably right early; revisit with per-category caps once the B2B exchange carries large packages.
* **Do not charge contractors for opportunities before local liquidity exists.** In a ZIP/trade with few jobs, opportunities should be free and framed as a bonus of the Business OS. Switch on fees per local market when the liquidity state (§15.3) reaches "balanced". The documents already say this in principle; make it a configuration per market, not a global flag.
* **Verification services are a marketplace transaction with a clear value exchange.** Keep the split transparent to the contractor. Require the reviewing contractor to hold the relevant credential when the scope demands one (electrical, plumbing, structural), and record the verification depth (§4.5).
* **Pricing band sanity.** The stated subscription bands sit in the same range as incumbent field-service and remodeling tools, which is appropriate. Differentiate on the calibration loop, change orders and schedule-fill, not on price.

### 15.3 Liquidity-aware mechanics — confirmed and formalized

The conversation restates the four-state model already in the documents. Formalize it as a per-market state machine keyed on **ZIP/metro × trade × job-size band × time window**:

| State | Condition | Mechanic |
|---|---|---|
| Seed | very few jobs | Opportunity feed + matching; no fees; no promise of volume |
| Thin | few jobs, many pros | Sequential precision match to 2–3 best-fit; expand ring on decline/no response |
| Balanced | jobs ≈ pros | Controlled 2–3 proposals; success fee active |
| Pro-scarce | many jobs, few pros | Pros choose from a feed; availability commands price; urgent premium |
| Liquid | many jobs, many pros | Broader marketplace, controlled bidding, never lowest-price-wins |

Matching optimizes five variables: scope, location, capability, time/availability, and price expectation, with price never the sole ranking axis. Flexible timing routes to Fill My Schedule; urgent timing prioritizes verified availability and response speed. State transitions are computed from rolling counts and are visible internally, never to users.

## 16. Naming

The conversation rejects any BuildLink-derived name and lists directions in three groups: explicit construction (Buildora, Buildry), jobs/network (Workora, Worksy, Jobora, Joblio), and function-neutral coined brands (Nestro, Veyro, Nuvora, Homiq …). Shortlisted directions: **Buildora** (explicitly construction), **Workora** (jobs/network), **Nestro** (independent property + work brand).

Recommendation: prefer the function-neutral group. The strategy explicitly expects the product to outgrow "build" and "estimate" within five years, and the Blueprint already says naming must not be confined to "estimate", "bill" or a copied name. Treat naming as its own workstream: generate ~30 candidates, screen for US trademark conflicts, domains, App Store / Google Play collisions and pronunciation across English, Spanish and Slavic languages, and return 5–7 viable options. Nothing in this document depends on the final name.

---

*One need → one simple path → right scope → **compiled** price with provenance → right pro → verified outcome → **calibrated** next estimate.*
