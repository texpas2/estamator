# MASTER STRATEGY v3 — Estibill Core + Next Build

**Type:** Permanent master strategy. Table-first. Intended to be the single reference that tactical specifications, data models, and sprint backlogs are derived from.
**Supersedes:** Estibill Strategic Plan v1/v2, Next Build Master Task v1, Next Build Blueprint v2 — *for structure and depth only*. Every principle from those documents is retained; where this document changes a decision, the change is logged in Part M.
**Relationship to `01-analysis-and-improvements.md`:** that document explains *why* the additions below exist (findings F1–F15). This document is the *what* and *how*.
**Conventions:** Module IDs `M01–M21`, entity names in `PascalCase`, states in `UPPER_CASE`, findings referenced as `F#`, decisions as `D#`.

---

# PART A — FOUNDATIONS

## A1. Thesis

| Question | Answer |
|---|---|
| What are we building | One shared construction core with three faces: **Estibill** (contractor tool: estimate and run work), **Next Build** (property and network layer: describe a need, understand it, find the right pro), and the **Assistant** (conversational access to both). |
| For whom, in order | 1) Residential repair/remodel contractors, 1–20 people, US. 2) Realtors, investors, landlords, property managers. 3) Homeowners (mostly occasional, no-install). 4) GCs with subcontractor networks. 5) Licensed specialist trades. |
| Core problem on the supply side | Contractors lose money to omissions, unpriced scope changes, slow payment, and not knowing their real costs. They lose time to estimating, paperwork and marketing. |
| Core problem on the demand side | A property owner cannot turn "something is wrong / I want this changed" into a scope, a budget and the right professional without calling five people. |
| Why now | Voice, vision and document extraction are cheap enough to make zero-form intake and field capture real. Phones measure rooms. Payments are embeddable. Incumbent tools are form-driven and monolingual. |
| The moat (in order of durability) | 1) Per-contractor calibrated cost data from completed jobs. 2) Normalized, permissioned market benchmarks (quoted → awarded → invoiced → paid). 3) Verified work history and capability profiles. 4) Liquidity in local trade markets. 5) Property histories linked to work. |
| The one loop | Need → Scope → Compiled price → Right pro → Verified work → Paid → Calibrated data → Better next estimate and match. |
| What we refuse to be | A lead-selling board. A lowest-price auction. A pay-for-ranking directory. An AI that invents prices. A menu-driven construction ERP that users must learn. |

## A2. Doctrine — principles with enforcement

Principles that are not enforced are decoration. Each principle has a mechanism and a test.

| # | Principle | Meaning | Enforcement mechanism | Test that a spec must pass |
|---|---|---|---|---|
| P1 | Simplicity is the governing constraint | Open → do → leave. Complexity lives in the system, not the user's head. | Simplicity Gate (A6) is a mandatory section in every tactical spec. | Primary path stated with tap count and time-to-value; both under target for the module. |
| P2 | Automation before UI | Infer, default, reuse or calculate before adding a field or button. | Every new input field requires a written reason it cannot be inferred. | "Inferred automatically" list is non-empty for every input-heavy screen. |
| P3 | AI is an interface and extraction layer, never the source of truth for money | Prices, schedules, permissions, invoices, totals come from deterministic code. AI proposes scope, drafts text, asks questions. | All money-bearing values are produced by `EstimateCompiler` or ledger code, reachable only through typed tool calls. LLM output that contains a currency amount not traceable to a tool result is rejected at the API layer. | Any displayed number can be replayed from stored inputs and produce the same result. |
| P4 | Every fact carries evidence status and provenance | OBSERVED / USER_CONFIRMED / ASSUMED / UNKNOWN / CONTRACTOR_VERIFIED plus a pointer to its source. | `Fact` entity requires `status` and `provenance`; UI renders status. | No scope item or price line without status; unknowns are listed, not hidden. |
| P5 | Value before registration | Deliver the result before asking for an account whenever safe. | Anonymous session model with later claim; magic links for clients. | A homeowner completes intake and sees a range with zero accounts created. |
| P6 | Reuse everything known | Never ask twice. | Fact Store is the memory for every surface and the Assistant. | A repeated question about a known fact is a bug. |
| P7 | Task-first devices | Phone for camera/voice/field; desktop for documents/management; mobile web for zero-install entry; Assistant everywhere. | One backend; per-persona default surface; no feature exclusive to a device unless hardware requires it. | Every module lists its primary and secondary surfaces (A5). |
| P8 | Money buys tools and access; reputation earns trust; matching decides fit | Subscription never buys ranking. | Matching score has no subscription input. Audit query proves it. | Rank order for a Job is identical with subscription fields nulled. |
| P9 | Never a lowest-price race | Distribution mechanics are liquidity-aware and multi-variable. | Network state machine (G5) selects mechanics; price is never the sole ranking axis. | No UI sorts pros by price alone. |
| P10 | Private stays private; benchmarks are aggregated, thresholded, permissioned | Contractor A never sees Contractor B's identifiable quote. | Separate aggregate store fed by an eligibility pipeline with minimum sample thresholds. | Any benchmark shown has ≥ N observations from ≥ K companies (Part H thresholds). |
| P11 | Process inputs once, store facts, never resend history | Cost discipline. | Fact Store + retrieval; per-Job AI budget with alerts. | AI cost per qualified Job and per estimate within budget. |
| P12 | "I don't know" always works | The user can continue without measurements, terminology or a diagnosis. | Every question offers a "don't know" that switches to an evidence path (photo, default with ASSUMED, or pro verification). | No dead-end question in any flow. |
| P13 | Verified says what was verified | Identity, credential, completed work, review are separate badges. | `CredentialVerification`, `VerifiedWorkEvent` are separate entities with expiry. | No generic "Verified" badge in UI. |
| P14 | Multilingual by design | User's language in, client's language out. | Taxonomy is language-neutral; all generated documents carry `locale`. | Any voice flow works in the supported languages without a separate code path. |
| P15 | Offline-first in the field | Capture never waits for signal. | Local queue + sync + conflict rules (J2). | Photo, time entry, receipt, change-order draft succeed in airplane mode. |

## A3. Brand and product architecture

| Layer | Name | Audience | Promise | Owns | Does not own |
|---|---|---|---|---|---|
| Contractor tool | **Estibill** | Contractors, GCs, workers | Estimate and run work, simply | Estimates, proposals, projects, field, billing, company | Consumer intake, property intelligence, public discovery |
| Property + network | **Next Build** (working name; see M decision D9) | Homeowners, realtors, investors, PMs, pros seeking work | Describe a need; understand it; find the right pro | Intake, property intelligence, profiles, matching, network, portfolio, marketing | Company operations, accounting |
| Shared core | **Core** (internal) | Both | No duplicate entry; one truth | Identity, Property/Project/Job, Fact Store, taxonomy, Estimate Compiler, ledger, permissions, audit, benchmarks pipeline | Any UI |
| Conversational layer | **Assistant** | All | Ask, tell, show; it does the rest | Intent, tool orchestration, explanation | Any money computation, any permission decision |

## A4. Personas and jobs-to-be-done

| Persona | Situation | Jobs to be done | Primary surface | Frequency | Must never be forced to |
|---|---|---|---|---|---|
| **Solo contractor** | Truck, phone, evenings on laptop | Produce a credible estimate fast; get it signed; get deposit; bill; get paid; look professional | Mobile app + web | Daily | Configure a price book before first estimate; learn accounting |
| **Contractor owner (5–20 staff)** | Office + field | Run company: estimates, projects, crews, schedule, costs, margin, cash flow, subs | Web (company) + mobile (jobs, Assistant) | Daily | Re-enter data between estimate, schedule, invoice, accounting |
| **Estimator / PM** | Site visits, desk work | Takeoff, assemblies, options, revisions, change orders, sub bids | Web + mobile (capture) | Daily | Build assemblies from scratch; retype measurements |
| **Worker / crew lead** | On site, poor signal, maybe non-English | See today's job; clock in; photos; report an issue; receipts | Mobile only, offline-first | Daily | Navigate company screens; type long text |
| **Subcontractor / licensed trade** | Small firm, works for GCs and direct | Get suitable work; bid on packages; get paid; keep credentials current | Mobile + web | Weekly | Maintain a website; pay before seeing value |
| **GC** | Coordinates many subs | Split scope into packages; invite subs; compare bids; award; track; pay; keep COIs/W-9s | Web | Daily | Email PDFs to subs; manual bid tabulation |
| **Occasional homeowner** | Problem at home, on phone, no app | Explain the problem; know roughly what it costs; get the right pro; approve and pay | Mobile web (no install) | Once a year | Install an app; register; choose a trade category |
| **Repeat homeowner / landlord** | Multiple needs over time | Property history; maintenance; turnovers; fast reorder | Mobile app | Monthly | Re-describe the property |
| **Realtor** | Inspection report, deadline, several properties | Turn a report into repair exposure; get verification and bids; send to client | Desktop web + iPad; mobile for walkthroughs | Weekly | Call specialists per finding; read 80 pages |
| **Investor / property manager** | Portfolio | Turnovers, capex planning, vendor pool, budget vs actual across units | Desktop web | Weekly | Duplicate property data per job |
| **Client (of a contractor)** | Received a proposal | Understand it; compare options; sign; pay; approve changes; see progress | Magic-link portal, any device | Per project | Create an account |

## A5. Surface matrix

| Function | Mobile app (iOS/Android) | Mobile web (no install) | Desktop web | Assistant (chat/voice) | SMS / email |
|---|---|---|---|---|---|
| Consumer intake (Tell/Show/Upload) | Yes | **Primary** | Upload path | Yes | Entry link |
| Field capture (photos, voice, time, receipts) | **Primary**, offline | Fallback | No | Voice capture | No |
| Takeoff (LiDAR/AR, photo scale) | **Primary** | Limited | Plan takeoff **primary** | Trigger only | No |
| Estimate build / edit | Quick edits | No | **Primary** | Draft, edit by voice | No |
| Proposal, contract, e-sign (client side) | Portal | **Primary** | Portal | Q&A | Delivery |
| Payments (client pays) | Portal | **Primary** | Portal | Status | Reminders |
| Schedule / dispatch | Today view | No | **Primary** | Query, reschedule | Confirmations |
| Change orders | **Primary** (site) | Client approval | Review | Draft from voice | Approval link |
| Job costing / margin | Summary | No | **Primary** | Query | Alerts |
| Company admin, roles, price book | Limited | No | **Primary** | No | No |
| Realtor workspace | Walkthrough capture | Report share | **Primary** | Query | Client share |
| Pro profile / portfolio / marketing | Approve, capture | Public view | **Primary** | Suggestions | No |
| Opportunities / network response | **Primary** | No | Compare bids | Alerts, accept | Alerts |
| B2B package bidding | Respond | No | **Primary** | Query | Invites |

## A6. Simplicity Gate (mandatory spec section)

| Gate question | Required answer format |
|---|---|
| Single user outcome | One sentence |
| Simplest primary path | Numbered steps with tap count and target time-to-value |
| Minimum information truly required | List; each item marked infer / ask / default |
| Inferred automatically | List with source (fact store, property, media, history) |
| Hidden until needed | List of advanced controls and the trigger that reveals them |
| "I don't know" path | Per question: alternative evidence path |
| No-account path | Yes/No and how far the user gets |
| Mobile-web path | Yes/No |
| What is removed before adding | At least one thing |
| Data created and its class | Private / public / aggregate-eligible per entity |
| Trust and permission requirements | Roles, confirmations, audit |

---

# PART B — SYSTEM MAP

## B1. Modules

| ID | Module | Purpose | Primary personas | Key inputs | Key outputs | Depends on | Phase |
|---|---|---|---|---|---|---|---|
| M01 | Identity, Company, Permissions, Audit | Accounts, tenancy, roles, anonymous sessions, event log | All | — | Users, roles, events | — | 1 |
| M02 | Property / Project / Job backbone | Organizing spine for everything | All | Address, parcel data | Property, Project, Job | M01 | 1 |
| M03 | Fact Store & Evidence | Structured memory with status and provenance | All (via system) | Extractions, confirmations, measurements | Facts, contradictions, unknowns | M02 | 1 |
| M04 | Media & Extraction Pipeline | Transcribe, vision, parse PDFs once into facts | System | Voice, photo, video, PDF | Observations, findings | M03 | 1 |
| M05 | Scope & Taxonomy | Normalized work types and assemblies | Estimator, system | Facts | ScopeItems, Assemblies | M03 | 1 |
| M06 | Takeoff & Measurement | Quantities from LiDAR/AR, photos, plans, statements, defaults | Estimator, homeowner | Sensors, plans, speech | Measurements with tolerance | M03, M04 | 1–3 |
| M07 | Estimate Compiler & Pricing | Turn scope into priced ranges with provenance | Estimator, system | ScopeItems, quantities, price books, indices | Priced lines, ranges, drivers | M05, M06, M18 | 1 |
| M08 | Proposal, Contract & e-Sign | Client-ready documents, state clause library, signature | Contractor, client | Estimate | Proposal, Contract, Signature | M07 | 2 |
| M09 | Payments & Billing | Deposits, milestones, invoices, card/ACH, reminders, payouts, lien waivers, financing | Contractor, client | Contract, schedule | Invoices, Payments, LienWaivers | M08 | 2 |
| M10 | Client Portal | Magic-link view for the client: docs, schedule, photos, approvals, pay | Client | Project | Approvals, payments | M08, M09 | 2 |
| M11 | Schedule & Crew | Assignments, dependencies, inspections, confirmations | Owner, PM, worker | Project, estimate sections | Schedule, Tasks | M02 | 3 |
| M12 | Field Mode & Change Orders | Offline capture; photo + voice → priced CO → client approval | Worker, PM, client | Media, voice | ChangeOrders, TimeEntries, Receipts | M04, M07, M10 | 3 |
| M13 | Job Costing & Calibration | Budget vs actual; learn rates; feed benchmarks | Owner, system | Time, receipts, POs, sub invoices | Margin, CalibrationDeltas | M07, M12 | 3–4 |
| M14 | Pro Profile & Trade Bank | Free profiles, service area, capability, availability, credentials, auto mini-site | Pros | Registration, work history | ProfessionalProfile | M01 | 4 |
| M15 | Trust & Capability Engine | Verified work, reviews, credentials, reliability, fit scoring | System | Outcomes, reviews, responses | MatchScores, badges | M14, M13 | 4–7 |
| M16 | Network / Opportunity Engine | Qualified Jobs → best-fit pros; urgent/flexible/small/planned/B2B modes; liquidity states | Pros, homeowners, GCs | Jobs, profiles, market state | Opportunities, bids, awards | M15, M07 | 5–8 |
| M17 | Property Intelligence & Realtor Workspace | Inspection reports → findings → repair exposure; pre-listing, buyer packages, property history | Realtors, investors | PDFs, photos | Findings, packages, ranges | M04, M07 | 6 |
| M18 | Price Data & Market Intelligence | Reference catalog, location index, price book import, aggregate benchmarks | System, owner | Catalogs, price books, outcomes | UnitRates, benchmarks | M13 | 1 (seed), 10 (benchmarks) |
| M19 | Portfolio & Marketing Studio | Portfolio from field photos; auto mini-site; Shorts/Reels; approvals | Pros | Approved media, verified scope | PortfolioItems, SocialAssets | M14, M12 | 4, 10 |
| M20 | Compliance & Documents | Licenses, COIs, permits, inspections, W-9/1099, retention | Owner, GC | Uploads, registries | Records, reminders | M01 | 9 |
| M21 | Integrations | Accounting (QuickBooks/Xero), calendars, suppliers, e-sign, payments partner, SMS | Owner, system | APIs | Sync | M09, M13 | 9 |
| **AS** | **Assistant** | Conversational layer over all modules via typed tools | All | Speech, text, context | Actions, answers | M01–M21 | 1 (read), 3 (draft), 5+ (act) |

## B2. The core loop and handoffs

```
DEMAND SIDE                                     SUPPLY SIDE
Homeowner / Realtor                             Contractor / Trade
   │ Tell / Show / Upload (M04)                     │ Free profile (M14)
   ▼                                                ▼
Facts + Evidence (M03) ──► Scope (M05) ──► Compiled range (M07) ──► Qualified Job
                                                                     │
                                          Network match (M16) ◄──────┘
                                                │
                      Opportunity → Estibill draft estimate (M07) → Proposal + contract (M08)
                                                │
                    Deposit (M09) → Schedule (M11) → Field + change orders (M12) → Invoices (M09)
                                                │
                    Job costing (M13) → Calibration deltas → Price book + benchmarks (M18)
                                                │
                    Close-out → Review + verified work (M15) → Portfolio (M19) → Better next match
```

| Handoff | From → To | Payload | Rule |
|---|---|---|---|
| H1 | Intake → Job | Facts, media refs, location, timing, range | Job created at < 60 s; no account needed |
| H2 | Job → Qualified Job | Evidence completeness threshold met (G1) | Fee eligibility begins only here |
| H3 | Qualified Job → Opportunity | Match set per liquidity state | Never broadcast to all |
| H4 | Opportunity → Estibill Estimate | ScopeItems, quantities, facts copied into contractor's tenant | Contractor's price book applies; consumer range is not shown to the contractor as a target |
| H5 | Estimate → Contract → Schedule → Invoices | Sections → tasks; milestones → invoices | No re-entry |
| H6 | Completed Job → Calibration → Benchmarks | Deltas per work type | Company data private; aggregate only after eligibility pipeline |
| H7 | Completed Job → Profile | VerifiedWorkEvent, review, portfolio candidates | Publication is pro-approved and privacy-filtered |

---

# PART C — MODULE DEEP-DIVES

Each deep-dive follows the same table so specs can be derived mechanically.

## C1. M04 Conversational Intake and Extraction

| Aspect | Definition |
|---|---|
| Outcome | An unclear need becomes a structured Job with facts, evidence statuses, urgency, timing and a first range, in under 60 seconds. |
| Primary path | Open link → tap **Talk** (or Photos / Upload / Type) → speak 20–90 s → system shows "Here's what I understood" with 1–3 one-tap questions → Job + range. Taps: 3–5. Time: < 60 s to Job, < 3 min to range. |
| Inputs | Voice, text, photos, guided video, PDFs (inspection reports, quotes, repair lists), location (GPS or typed), optional public property data. |
| Extraction schema (per utterance/media) | `problem`, `desired_outcome`, `room_or_system`, `property_clues`, `urgency_signals`, `timing_window`, `budget_signals`, `quantities_mentioned`, `materials_mentioned`, `constraints`, `open_questions`. Each with confidence and provenance. |
| Photo guidance library | Per suspected scope: "show under the sink", "from the doorway", "the electrical panel", "farther back to see the whole wall", "the water heater label". Triggered only when the missing angle changes routing, scope or range materially. |
| Question policy | Ask only if the answer changes urgency, routing, scope or range width by more than a threshold. Prefer one-tap answers. Max 3 questions before showing a result. |
| "I don't know" path | Switch to evidence: request a photo, apply a default with ASSUMED, or mark UNKNOWN and note it as a range driver. |
| Inferred automatically | Trade(s), urgency, room type, approximate size (from photo/LiDAR), property attributes (from address), language. |
| Hidden until needed | Exact measurements, finish level, material brands, permit questions, access constraints. |
| Deterministic vs AI | AI: transcription, vision observations, extraction into schema, question phrasing. Deterministic: fact storage, completeness scoring, question selection thresholds, Job creation, range compilation. |
| Anonymous handling | Anonymous session with device token; result page has "Save this property" which creates the account and claims the session. |
| Entities | `IntakeSession`, `MediaAsset`, `Transcript`, `Observation`, `Fact`, `Question`, `Job` |
| Events | `intake.started`, `media.processed`, `fact.created`, `question.asked/answered`, `job.created`, `job.qualified` |
| Metrics | Time to Job; time to range; questions per Job; completion rate; AI cost per Job (abandoned vs qualified); extraction accuracy on the regression set. |
| Risks | Over-asking; hallucinated observations (mitigate: observations must cite a media region); cost blowup on video (mitigate: keyframe sampling). |

## C2. M03 Fact Store and Evidence

| Aspect | Definition |
|---|---|
| Outcome | Every surface and the Assistant read and write one structured memory per Property/Project/Job. Nothing is asked twice. |
| Fact record | `subject` (Property/Room/System/ScopeItem), `predicate` (e.g. `floor_area_sqft`, `leak_active`), `value`, `unit`, `status` (OBSERVED, USER_CONFIRMED, ASSUMED, UNKNOWN, CONTRACTOR_VERIFIED), `confidence`, `provenance` (media id + region, document id + page/line, utterance id, sensor reading, default rule id), `observed_at`, `staleness_policy`, `superseded_by`. |
| Status transitions | UNKNOWN → ASSUMED (default applied) → USER_CONFIRMED (user taps confirm) → OBSERVED (media shows it) → CONTRACTOR_VERIFIED (pro confirms, with method remote/on-site and credential). Higher status supersedes lower; contradictions are not auto-resolved. |
| Contradiction handling | Two facts on the same subject/predicate with incompatible values → `Contradiction` record → one-tap question or pro verification. Never silently pick one. |
| Staleness | Photos and observations age; rules per predicate (e.g. active leak stale after 7 days; room dimensions never stale). |
| Retrieval | Scoped by Property/Project/Job and by task; Assistant and compiler request facts by predicate set, not by conversation history. |
| Privacy class | Facts are private to the owning party; aggregate eligibility is a separate flag set by the pipeline (M18). |
| Metrics | Repeated-question rate (target 0); contradiction resolution time; % facts with provenance (target 100%). |

## C3. M06 Takeoff and Measurement

| Method | Device / input | Typical tolerance | Evidence status | When used |
|---|---|---|---|---|
| Room scan (LiDAR / RoomPlan / ARCore) | iPhone Pro, iPad Pro, Android AR | ±2–3% area | OBSERVED | Contractor site visit; realtor walkthrough; homeowner with capable phone |
| Photo-scale (reference object or known fixture dims) | Any phone camera | ±8–15% | OBSERVED (low confidence) | Consumer intake |
| Plan takeoff (PDF/CAD scale detection, polygons, counts) | Desktop web | ±1–2% | OBSERVED | Remodel, new construction, GC packages |
| Extracted from documents | Inspection report, listing, prior estimate | Varies | OBSERVED (document) | Realtor flows |
| Stated | Voice/text "about 12 by 14" | ±10% | USER_CONFIRMED | Anywhere |
| Default by room type and house era | Public property data | ±25–35% | ASSUMED | Nothing else available |

| Aspect | Definition |
|---|---|
| Output | `Measurement` with method, value, unit, tolerance, geometry reference, media reference. Tolerance flows into range width (Part F). |
| Primary path (contractor) | Open Job → tap **Measure** → walk the room → dimensions and openings saved to the room → assemblies pick quantities automatically. Taps: 2. |
| Primary path (homeowner) | Not asked to measure. If a photo allows scale estimation it is used; otherwise defaults with ASSUMED and the range says why it is wide. |
| Hidden until needed | Manual dimension editing, ceiling height, openings, waste factor override. |
| Metrics | % quantities measured vs stated vs defaulted; range width reduction after measurement. |

## C4. M05 Scope and Taxonomy

| Aspect | Definition |
|---|---|
| Taxonomy design | Residential-first hierarchical work-type tree, language-neutral codes, e.g. `FLOORING.LVP.INSTALL`, `BATH.TUB_TO_SHOWER.CONVERT`, `ELEC.PANEL.REPLACE_200A`, `ROOF.ASPHALT.REPLACE`. Each node maps to: CSI division (for commercial later), restoration category (for Xactimate compatibility later), default assemblies, co-occurrence rules, permit likelihood by jurisdiction class, credential requirement. |
| ScopeItem | `work_type`, `original_wording` (contractor/user text preserved), `room_or_area`, `quantity_ref` (Measurement), `finish_level`, `options`, `assumptions[]`, `exclusions[]`, `evidence_status`, `section` (trade package). |
| Assembly | `work_type` → components: labor tasks (`productivity_rate` hr/unit, `crew`), materials (`unit`, `waste_factor`), equipment, subcontract, permits/fees, disposal, protection. Three layers: platform default → company override → estimate edit. |
| Sections | Estimate sections align with trade packages so M16 B2B can lift a section as a subcontract package unchanged. |
| Seed catalog | v1: ~50 highest-frequency residential assemblies (kitchen, bath, flooring, paint, drywall, roofing, windows/doors, electrical panel/circuits, plumbing fixtures/water heater, HVAC replace, decks, fences, siding, insulation, demolition/haul-off, permits). Expand by usage. |
| AI role | Map extracted facts and free text to work types; propose ScopeItems; never set prices. |
| Metrics | % scope items mapped to taxonomy automatically; edit rate after AI proposal. |

## C5. M07 Estimate Compiler and Pricing

| Aspect | Definition |
|---|---|
| Outcome | A priced estimate with a range and provenance on every line, compiled deterministically from scope in seconds; the same engine serves consumer preliminary ranges and contractor estimates. |
| Pipeline | ScopeItems → assembly expansion → quantity resolution → unit-rate lookup (pricing stack) → adjustments (location, access, height, finish level, waste, minimum charge) → overhead and markup (company settings) → priced lines with P20/P50/P80 → documents (client view, cost view). |
| Pricing stack (contractor estimate) | 1 own actuals for this work type (M13) → 2 own price book → 3 local aggregate benchmark (M18, thresholded) → 4 reference catalog × location index → 5 AI prior (flagged, never silent). Provenance label per line. |
| Pricing stack (consumer range) | 3 → 4 → 5 only. Wider ranges; explicit assumptions. |
| Adjustments | Location index (metro/ZIP), access difficulty, story/height, occupied vs vacant, finish level, small-job minimums, urgency premium (network mode), material escalation window. |
| Options and structure | Options/alternates (good/better/best), optional add-on lines, allowances, exclusions, assumptions, sections, revisions with client-visible diff, price validity window. |
| Missing-Items Detector | Deterministic co-occurrence rules (e.g. tub-to-shower ⇒ waterproofing, plumbing rough-in change, drywall repair, glass door, permit, haul-off, floor protection) + AI review pass proposing candidate omissions as one-tap adds. Contractor decides; compiler prices. |
| Uncertainty | Inputs are min/likely/max; interval arithmetic in v1; uncertainty attribution names the top three drivers ("plumbing relocation unknown", "subfloor condition unseen", "quantity defaulted"). |
| Primary path (contractor) | Voice note or Quick form → compiled draft → review flagged omissions → send. Target: < 3 min from voice note to sendable proposal for common scopes. |
| Hidden until needed | Assembly components, productivity rates, markup per line, waste factors, location index override. |
| Deterministic vs AI | Compiler is 100% deterministic. AI: scope proposal, omission suggestions, explanation text. |
| Entities | `Estimate`, `EstimateRevision`, `EstimateSection`, `ScopeItem`, `PricedLine`, `Option`, `Allowance`, `Exclusion`, `Assumption`, `UncertaintyDriver`, `PriceBook`, `PriceBookEntry`, `UnitRate`, `LaborRate`, `ProductivityRate`, `LocationIndex` |
| Metrics | Time to sendable proposal; % lines by provenance priority; estimate accuracy vs actual (M13); omission suggestions accepted; range width by evidence completeness. |

## C6. M08 Proposal, Contract and e-Sign

| Aspect | Definition |
|---|---|
| Outcome | The client receives a clear proposal with options, signs a compliant contract and pays the deposit in one session. |
| Primary path (contractor) | Estimate → **Send proposal** → system attaches contract from clause library for the project's state and job type → SMS/email magic link. Taps: 2. |
| Primary path (client) | Open link → view options → select → **Approve & Sign** → deposit screen. No account. |
| Clause library | Per US state: payment schedule limits (e.g. deposit caps where regulated), right-to-cancel notices, license number display, mechanics lien notice, warranty terms, change-order procedure, dispute clause. Legal review per launch state. |
| Hidden until needed | Custom clauses, multiple signers, alternates comparison table, expiration date override. |
| Deterministic vs AI | Document generation deterministic from templates; AI drafts cover letter and plain-language scope summary only. |
| Entities | `Proposal`, `Contract`, `ContractClause`, `Signature`, `ProposalView` (analytics) |
| Metrics | Proposal viewed → signed rate; time from send to sign; deposit paid within 24 h of signing. |

## C7. M09 Payments and Billing

| Aspect | Definition |
|---|---|
| Outcome | Contractors get paid faster with less chasing; the platform gains a durable revenue line and reliable "paid" data. |
| Capabilities | Deposits, milestone/progress invoices generated from the payment schedule, retainage, partial payments, card/ACH via embedded payments partner, automated reminders, late fees per contract, instant payout option, lien waiver generated on payment, homeowner financing offers via partner for larger jobs, refunds and disputes. |
| Primary path (contractor) | Milestone reached → **Invoice** (1 tap; pre-filled from schedule) → client link. Reminders automatic. |
| Primary path (client) | Link → **Pay** → done. Receipt and lien waiver delivered automatically. |
| Hidden until needed | Retainage settings, custom schedules, late fee rules, payout timing. |
| Deterministic vs AI | Ledger fully deterministic; AI only drafts reminder wording. |
| Entities | `PaymentSchedule`, `Milestone`, `Invoice`, `Payment`, `Payout`, `Refund`, `LienWaiver`, `FinancingOffer`, `Deposit`, `Retainage` |
| Compliance | Payments partner handles KYC/AML; platform never holds funds beyond partner settlement rules; lien waiver templates per state. |
| Metrics | Days sales outstanding; % paid on-platform; % invoices paid within terms; processing revenue; dispute rate. |

## C8. M11 Schedule and Crew

| Aspect | Definition |
|---|---|
| Outcome | The whole company and every sub know what happens when; the worker sees only today. |
| Capabilities | Tasks generated from estimate sections; crew and sub assignment; simple dependencies (rough-in before drywall); inspection milestones; weather-sensitive flags; SMS confirmations to subs; reschedule propagation; capacity view (feeds Fill My Schedule). |
| Primary path | Contract signed → **Auto-plan** proposes a schedule from sections and typical durations → owner adjusts by drag → confirmations sent. |
| Worker view | Today's Jobs: address, tasks, photos required, clock-in, "Report issue" (starts a change-order draft). |
| Hidden until needed | Critical path view, resource leveling, multi-project Gantt. |
| Entities | `Schedule`, `Task`, `Assignment`, `Availability`, `Confirmation`, `InspectionEvent` |
| Metrics | Schedule adherence; sub confirmation rate; no-show rate (feeds M15); idle capacity (feeds M16). |

## C9. M12 Field Mode and Change Orders

| Aspect | Definition |
|---|---|
| Outcome | Discovered extra work becomes an approved, priced change order before the crew touches it; field data never gets lost. |
| Primary path (change order) | Worker/PM: photo + 10-second voice note → AI drafts scope lines → compiler prices them with the company's price book → PM taps **Send for approval** → client receives SMS → taps **Approve** → schedule and invoices update. Target: < 60 s from discovery to approval request. |
| Offline | Photos, voice, time entries, receipts and CO drafts queue locally; sync on connectivity; extraction runs after sync. |
| Time tracking | Clock in/out with optional geofence; per task; feeds job costing and productivity rates. |
| Receipts | Photo → OCR → vendor, amount, tax, items → cost code suggestion → attached to project. |
| Hidden until needed | CO pricing overrides, markup changes, multiple approvers. |
| Deterministic vs AI | AI: scope draft from voice/photo, receipt extraction. Deterministic: pricing, approval state, schedule and invoice updates. |
| Entities | `ChangeOrder`, `ChangeOrderLine`, `Approval`, `TimeEntry`, `Receipt`, `ReceiptExtraction`, `SyncQueueItem` |
| Metrics | CO capture rate (approved CO value ÷ actual extra work value); time to approval; offline sync failure rate. |

## C10. M13 Job Costing and Calibration

| Aspect | Definition |
|---|---|
| Outcome | Every job shows planned vs realized margin live; the company's rates get better with every completed job. |
| Cost capture | Labor from time entries × loaded labor rate; materials from receipts and purchase orders; subs from sub invoices; equipment and fees. Automatic cost coding via taxonomy. |
| Views | Budget vs actual per project, per section, per work type; company margin trend; alerts when a section exceeds budget before completion. |
| Calibration | On close-out: compare estimated vs actual hours per work type, material cost per unit, waste, duration → `CalibrationDelta` → one-tap "Update my rates from this job?" → price book and productivity rates updated. Patterns surfaced across jobs. |
| Network contribution | De-identified deltas and outcome prices enter the benchmark eligibility pipeline (M18) if the company has consented (default on for aggregates, always off for identifiable data). |
| Hidden until needed | Cost code editing, allocation rules, burden rates. |
| Entities | `CostCode`, `BudgetLine`, `ActualCost`, `CalibrationDelta`, `RateUpdate` |
| Metrics | Estimate accuracy (|est − actual| / actual) per work type; gross margin planned vs realized; % jobs with costing enabled; rate updates accepted. |

## C11. M10 Client Portal

| Aspect | Definition |
|---|---|
| Outcome | The client understands, approves and pays without ever creating an account or calling. |
| Contents | Proposal and options, contract, schedule (client-safe view), progress photos, change orders awaiting approval, invoices and payments, messages, warranty record after close-out. |
| Access | Magic link per client; optional PIN; expiring re-issue. |
| Hidden until needed | Document history, full revision diffs. |
| Metrics | Portal open rate; approval latency; support contacts per project. |

## C12. M14 Pro Profile and Trade Bank

| Aspect | Definition |
|---|---|
| Outcome | Any contractor or licensed trade becomes discoverable and matchable in minutes, with a professional page they never have to maintain. |
| Primary path | Enter company name and trade → system prefills from public license registries where available → confirm service area on a map → set availability and job-size band → mini-site live. Taps: ~6. Time: < 3 min. |
| Profile fields | Trades and specialties, service area and travel radius, availability windows, preferred job-size band, company vs individual, credentials (type, jurisdiction, number, expiry, verification status), insurance certificate (optional), subcontract preference, languages, verified work history, reviews. |
| Auto mini-site | Generated from profile; enriched by approved portfolio items and verified reviews; contractor-controlled publishing; customer identities and exact addresses never shown. |
| Hidden until needed | Custom branding, custom domain, marketing studio. |
| Entities | `ProfessionalProfile`, `Credential`, `CredentialVerification`, `InsuranceCertificate`, `ServiceArea`, `Availability`, `JobSizePreference`, `PublicPage` |
| Metrics | Profile completion; time to first opportunity; % profiles with verified credential. |

## C13. M15 Trust and Capability Engine

| Signal | Source | Use | Exposed publicly? |
|---|---|---|---|
| Scope fit | Verified completed work types (M13, M16) and declared trades | Hard filter + score | As "Completed N similar projects" |
| Size fit | Typical project values | Score | No |
| Geographic fit | Service area, travel radius | Hard filter | Service area only |
| Availability fit | Calendar capacity, response windows | Score, urgent hard filter | "Available this week" style |
| Credential fit | Jurisdiction-specific license/insurance requirement of the work type | Hard filter where required | Badge stating what was verified |
| Reliability | Response time, acceptance, cancellations, no-shows, schedule adherence | Score with decay | Never raw; summarized carefully |
| Reviews | Linked to real completed projects | Score | Yes, with project type |
| Engagement type | Direct vs subcontract preference, remote verification willingness | Hard filter | No |

| Aspect | Definition |
|---|---|
| Scoring rule | `eligible = all hard filters pass`; `fit_score = weighted sum of soft signals`; weights per job mode (urgent weights availability and response; planned weights scope fit and reviews). Subscription tier is **not** an input (P8, audited). |
| Verified badges | Identity verified; credential verified (with expiry); completed work verified (on-platform); reviews verified (linked to project). Never a generic "Verified". |
| Fairness | New pros get exploration slots in low-stakes modes (small jobs) so cold profiles can earn history. |
| Entities | `MatchScore`, `ReliabilitySignal`, `VerifiedWorkEvent`, `Review`, `Dispute` |
| Metrics | Match acceptance rate; award rate by fit-score decile; complaint rate by badge class. |

## C14. M16 Network and Opportunity Engine

| Job mode | Trigger | Distribution mechanic | Contractor economics |
|---|---|---|---|
| Urgent | Urgency facts (active leak, no heat, safety) | Small high-fit set, response-speed priority, sequential expansion every N minutes | Included in Pro or small fixed fee after acceptance; urgency premium allowed |
| Flexible / Fill My Schedule | Customer states a wide window | Match to pros with open capacity in window; possible price advantage | Pro feature; core subscription selling point |
| Small job | Compiled range under threshold | Route to pros whose job-size band includes it; exploration slots for new pros | Free or minimal |
| Planned project | Default | Controlled 2–3 proposals or bidding per liquidity state | Success fee on award where market state allows |
| Specialist verification | Scope needs a credential opinion | Credentialed pros; paid review | Fee split (pro / platform) |
| B2B subcontract | GC lifts a section | Private network first → open network | GC plan; sub free |

| Aspect | Definition |
|---|---|
| Qualified Job definition | Formal state (G1): evidence completeness score ≥ threshold, location resolved, timing stated, range width under limit for the scope class, contact verified, homeowner confirmation event recorded. Fees attach only to Qualified Jobs. |
| Liquidity states | Per ZIP/metro × trade × job-size band × time window (G5): SEED, THIN, BALANCED, PRO_SCARCE, LIQUID. Determines mechanic, proposal count and fee activation. |
| Anti-race-to-bottom | Never sort by price alone; proposal counts capped; homeowner sees fit signals with price; ties broken by fit, not price. |
| Anti-disintermediation | Payment protection, reviews, verified work and warranty records exist only for on-platform jobs; fees modest and capped. |
| Primary path (pro) | Push: "Bathroom remodel, 4.1 mi, $18–24k range, starts in 3 weeks, 2 photos" → **Interested** → structured Job lands as draft estimate in Estibill → **Send proposal**. Taps: 2 to express interest. |
| Primary path (homeowner) | "3 suitable pros invited" → receive proposals → compare (price, timeline, fit signals, reviews) → **Choose**. |
| Entities | `Opportunity`, `MatchCandidate`, `Invitation`, `Response`, `Bid`, `Award`, `MarketState`, `ContractorPreference` |
| Metrics | Qualified Job → response rate; response → proposal → award; time to first response (urgent); schedule fill rate; suitable pros per local trade; fee revenue per market state. |

## C15. M17 Property Intelligence and Realtor Workspace

| Workflow | Input | System output | Next action |
|---|---|---|---|
| Inspection Report Analysis | PDF (20–100 pages) | Findings extracted, grouped by system and urgency; each classified: enough info to range / needs photo / needs pro verification; preliminary exposure range | Add photos; request verification; get bids |
| Pre-Listing Repair Plan | Findings + photos | Three tracks: Sell As-Is / Essential Repairs / Prepare for Market with ranges | Choose track; source pros |
| Buyer Repair Exposure | Findings | Immediate/Safety, First Year, Optional buckets with ranges | Negotiate; budget |
| Can I Afford This Property | Exposure + desired renovations | First-year investment range | Plan |
| Quote Check / Second Opinion | Outside quote PDF | Normalized scope; omissions and ambiguities; comparison to eligible local benchmark | Request independent review |
| Rental Turnover | Room-by-room walkthrough | Paint/patch/flooring/cleaning/fixtures scope and range | Crew or Network |
| Damage Documentation | Photos, measurements | Structured damage record and repair scope (no coverage determination) | Share with insurer/contractor |
| Project Rescue | Original contract + current photos | Completed / remaining / uncertain scope | Find pros willing to finish |
| Property History | All above over time | Timeline of work, warranties, maintenance reminders | One-tap re-service |

| Aspect | Definition |
|---|---|
| Realtor workspace | Desktop-first: Properties list → property → reports, findings, photos, ranges, verification status, bids, client share link. Mobile for walkthrough capture with the same Fact Store. |
| Disclaimers | Preliminary analysis is not an appraisal, certified inspection, insurance determination or binding quote unless an authorized professional service provides it. |
| Entities | `InspectionReport`, `Finding`, `RepairPackage`, `ExposureBucket`, `PropertyTimelineEvent` |
| Metrics | Report → structured findings time; % findings rangeable without pro; verification requests per report; repeat realtor usage. |

## C16. M16-B B2B Subcontract Exchange

| Step | Actor | System behavior |
|---|---|---|
| Select package | GC | Chooses an estimate section (e.g. Electrical); system builds a package with scope, quantities, drawings, site constraints, schedule window |
| Choose audience | GC | Private known subs first; "Open to Network" if none accept within a window |
| Invite | System | Credential-eligible subs by service area, availability, similar work, subcontract preference |
| Propose | Sub | Structured proposal against the package lines (no PDF); questions thread |
| Compare | GC | Side-by-side tabulation, normalized; fit signals |
| Award | GC | Award creates the sub's Job in their own Estibill tenant; schedule linked |
| Track | Both | Tasks, photos, inspections, change orders flow through M11/M12 |
| Pay | GC → Sub | Invoices, lien waivers, W-9/1099 via M09/M20 |

| Metrics | Packages posted; sub join rate from invites; award rate; time to award; sub retention as users. |
|---|---|

## C17. M19 Portfolio and Marketing Studio

| Aspect | Definition |
|---|---|
| Outcome | Completed work becomes a portfolio, a public page and marketing content with near-zero contractor effort. |
| Capture | Field photo flow has one optional toggle: "Save for portfolio". Media grouped by project, room, work type. |
| Curation | System suggests before/progress/after sets, removes duplicates and poor frames, drafts neutral captions from verified scope. Contractor approves. |
| Publication safety | Never publish customer names, exact addresses, documents, conversations, sensitive metadata. Contractor-controlled. |
| Marketing studio (paid) | 15–30 s vertical Shorts/Reels, slideshows, branded highlights, review posts; platform-safe audio; Preview → Approve → Publish/Download; suggestions when the pro has not posted recently. |
| Entities | `PortfolioItem`, `BeforeAfterSet`, `PublicProjectSummary`, `SocialAsset`, `PublicationApproval` |
| Metrics | Portfolio completion per closed job; content approved; attributed leads. |

## C18. M18 Price Data and Market Intelligence

| Layer | Source | Day-one availability | Trust label |
|---|---|---|---|
| Reference catalog | Licensed residential cost database or curated in-house seed (~300 assemblies) | Yes (decision D2) | "Reference estimate" |
| Location index | Published construction cost indices by metro; refined by network data | Yes | Part of reference |
| Company price book | Onboarding import of past estimates (PDF/spreadsheet) via extraction; manual edits; calibration updates | From first import | "Your price book" |
| Company actuals | Job costing | After first closed jobs | "Your last N similar jobs" |
| Aggregate benchmarks | Eligible observations across companies: quoted, awarded, invoiced, paid; normalized by geography, work type, quantity, property type, date, finish level | After thresholds met | "Local market range" |
| AI prior | LLM suggestion when nothing else exists | Yes | "Low-confidence suggestion" (never silent) |

| Aspect | Definition |
|---|---|
| Eligibility pipeline | Observation → consent check → de-identification → normalization → bucket (metro × work type × size band × quarter) → threshold check (≥ 8 observations from ≥ 4 companies, configurable) → publishable aggregate. |
| Five price states | Estimated cost (internal), quoted, awarded, final invoiced, paid. |
| Products | Internal: pricing stack priority 3. Consumer: ranges with confidence. Contractor: "you are 12% above local median" in bid analytics. Never identifiable competitor data. |
| Metrics | % lines served by priority 1–3; benchmark coverage by market; observation eligibility rate. |

## C19. M20 Compliance and Documents

| Item | Capability | Trigger |
|---|---|---|
| Licenses | Store, verify against state registries where possible, expiry reminders, badge feed to M15 | Profile creation; 60/30/7-day reminders |
| Insurance certificates | Upload, expiry, GC visibility for subs | Package award |
| Permits and inspections | Permit likelihood by work type and jurisdiction class; permit record; inspection events on schedule | Estimate compile; schedule |
| Tax forms | W-9 collection from subs; 1099 export | Sub award; year end |
| Lien waivers | Conditional/unconditional, progress/final, per state | Payment events |
| Retention | Document retention rules, export | Company settings |

## C20. M21 Integrations

| Integration | Direction | Phase | Notes |
|---|---|---|---|
| Payments partner (embedded) | Bidirectional | 2 | KYC, card/ACH, payouts, disputes |
| E-signature | Outbound + webhook | 2 | Or native signature with audit trail |
| SMS / email | Outbound + inbound replies | 1 | TCPA-compliant consent |
| Accounting (QuickBooks Online, Xero) | Outbound sync of invoices, payments, expenses, customers | 9 | Cost codes → chart of accounts mapping |
| Calendar (Google, Microsoft) | Bidirectional | 3 | Availability feeds Fill My Schedule |
| Supplier pricing (pro accounts) | Inbound | 9 | Where APIs exist; receipt OCR fallback |
| Public property data | Inbound | 1 | Parcel, sqft, year built, stories |
| License registries | Inbound | 4 | Per state; scrape or API |
| Restoration line-item compatibility | Import/export mapping | 11 | Decision D6 |

---

# PART D — THE ASSISTANT

The Assistant is the conversational layer over the whole system. It is the same entity on every surface: a chat/voice panel on the right of the desktop, the central chat on the phone, the intake voice on mobile web. It is one product concept, not a feature per module.

## D1. What the Assistant is, and is not

| It is | It is not |
|---|---|
| An interface: understands intent in natural language, in the user's language | A database: it holds no facts; the Fact Store does |
| An extraction layer: turns speech, photos, documents into structured facts | A calculator: it never computes prices, totals, schedules or taxes |
| An orchestrator: calls typed tools in the right order and explains results | A permission authority: it inherits the invoking user's role and can do nothing that user cannot do |
| A questioner: picks the next high-information question | A salesperson: it never invents scope, prices or promises of work |
| An explainer: turns compiler output into plain language ("this range is wide because…") | A chatbot with memory of a long transcript: context is retrieved from facts, not from replaying history |

## D2. Architecture layers

| Layer | Responsibility | Implementation direction | Deterministic or AI |
|---|---|---|---|
| L1 Input | Speech-to-text, image/video intake, document parsing, language detection | Streaming transcription; keyframe sampling for video; PDF text + layout extraction; OCR fallback | AI (cheap models) |
| L2 Context assembly | Decide which facts, entities and permissions are relevant to this turn | Deterministic retrieval by persona, surface, current object (Property/Project/Job), and predicate sets; token budget enforced | Deterministic |
| L3 Intent and planning | Classify intent; choose tools; decide whether a question is needed | Model with a fixed tool catalog; intent taxonomy per persona; confidence threshold for acting vs asking | AI (mid-tier) |
| L4 Tools | Typed functions over the modules; the only way to read or change data | Function catalog (D4); every tool validates permissions and emits audit events | Deterministic |
| L5 Verification | Check the model's proposed response against tool results | Any currency amount, date or quantity in the reply must match a tool result field; otherwise regenerate or strip | Deterministic |
| L6 Response | Natural language in user's locale; UI cards for structured results | Template-first for money and status; free text for explanation | AI (cheap) + templates |
| L7 Confirmation and audit | Classify action risk; require confirmation where needed; log | Action classes (D6); `AssistantAction` records with inputs, tool calls, outputs | Deterministic |

## D3. Tool catalog (initial)

| Tool | Reads / writes | Used for | Risk class |
|---|---|---|---|
| `facts.get(scope, predicates)` | R | Answer questions; assemble context | Read |
| `facts.propose(fact[])` | W (status ≤ ASSUMED or USER_CONFIRMED after tap) | Extraction results | Low |
| `media.analyze(asset_id, purpose)` | R | Vision observations on new media only | Read (cost-gated) |
| `scope.propose(job_id, items[])` | W (draft) | Turn facts into ScopeItems | Low |
| `estimate.compile(estimate_id)` | R/W (derived) | Produce priced lines and ranges | Low |
| `estimate.explain(estimate_id)` | R | Uncertainty drivers, provenance summary | Read |
| `estimate.detect_omissions(estimate_id)` | R | Candidate missing items | Read |
| `estimate.revise(estimate_id, edits[])` | W (new revision) | Voice edits: "add glass door", "remove heated floor" | Medium |
| `proposal.send(estimate_id, channel)` | W (external) | Send to client | High (confirm) |
| `changeorder.draft(job_id, media, transcript)` | W (draft) | Field CO | Low |
| `changeorder.send(co_id)` | W (external) | Client approval request | High (confirm) |
| `schedule.query(...)` / `schedule.propose(...)` | R / W (draft) | "What's on Thursday", auto-plan | Low |
| `schedule.commit(...)` | W | Move tasks; notify subs | Medium (confirm if notifications) |
| `invoice.create(milestone_id)` | W | Bill a milestone | High (confirm) |
| `payments.status(project_id)` | R | Who owes what | Read |
| `costing.summary(project_id)` | R | Margin, budget vs actual | Read |
| `property.findings(property_id, filters)` | R | Realtor Q&A | Read |
| `network.opportunities(profile_id)` | R | "Anything for me this week?" | Read |
| `network.respond(opportunity_id, action)` | W (external) | Interested / decline | Medium (confirm) |
| `profile.update(fields)` | W | Availability, radius | Low |
| `document.generate(type, ids)` | W (derived) | Reports, packages | Low |
| `question.select(job_id)` | R | Next best question | Read |

Rules: no tool returns another tenant's private data; every tool enforces the caller's role; tools are versioned; tool results are the only source of numbers in replies.

## D4. Context assembly rules

| Context element | Source | Included when |
|---|---|---|
| Persona and role | Session | Always |
| Surface and device capabilities | Session | Always (decides whether to offer camera, measurement) |
| Current object (Property / Project / Job / Estimate) | Navigation state or explicit mention ("15 Maple Avenue") | Always when resolvable; ask to disambiguate otherwise |
| Relevant facts | Fact Store by predicate set for the intent | Per intent; bounded |
| Recent turns | Short window (last few turns) | Always; never the full transcript |
| Open questions and contradictions | Fact Store | When the intent touches scope or price |
| Permissions | M01 | Always |
| Cost budget remaining for this Job | Budget ledger | Always; degrades to cheaper behavior when low |

## D5. Action classes and confirmation

| Class | Examples | Behavior |
|---|---|---|
| Read | Answer questions, summarize, explain | Execute silently |
| Low | Create drafts, propose facts, update own preferences | Execute, show result, one-tap undo |
| Medium | Revise an estimate, move schedule with notifications, respond to an opportunity | Execute after an inline confirm ("Send Thursday's change to 3 subs?") |
| High | Send proposals, invoices, change orders to clients; payments; publish public content; delete | Explicit confirmation with a preview; audited; never batch-confirmed |
| Forbidden | Change prices without compiler; alter permissions; export another tenant's data; approve on behalf of a client | Not available as tools |

## D6. Per-persona example interactions

| Persona | Says | Assistant does (tools) | Replies |
|---|---|---|---|
| Solo contractor, on site | "New estimate for this address: remove tub, tile shower, new vanity top, LVP floor, done within a month" | `facts.propose` (location from GPS, timing), `scope.propose`, `estimate.compile`, `estimate.detect_omissions` | Shows compiled draft: 5 sections, range, "Usually also includes: waterproofing, glass door, permit — add?" |
| Owner, desktop | "Which jobs this month are under budget on labor?" | `costing.summary` for active projects | Table of projects with labor variance; offers to open the worst one |
| Worker, phone, Spanish | "Encontré tubería vieja de hierro detrás de la pared, hay que cambiarla" + photo | `changeorder.draft` with transcript and media; `estimate.compile` for CO lines | Draft CO in Spanish for the worker, English for the client; PM confirmation to send |
| Realtor, phone at property | "I'm at 15 Maple Avenue, let's look at the basement" | Resolve Property; open walkthrough capture; facts written as they speak | Guides photos: "show the sump pump, the panel, any staining on walls" |
| Realtor, desktop, evening | "Show me everything we found in the basement today and what fixing it would cost" | `property.findings` filtered by area and date; `estimate.compile` for a preliminary package | Findings list with statuses and a range with its top drivers |
| Homeowner, mobile web | "The ceiling is wet and it started today" + 2 photos | `media.analyze`, `facts.propose`, `question.select` → "Is water still coming in?" | One question; if yes → Job becomes URGENT; routing starts |
| GC | "Offer the electrical section of the Oak Street project to my usual subs" | Build package from section; `network.respond`-side invitations to private list | Confirmation preview: package summary, 4 subs, response window |
| Sub | "Anything for me this week within 15 miles?" | `network.opportunities` | Cards; "Interested" is one tap |

## D7. Surfaces

| Surface | Presentation | Special behavior |
|---|---|---|
| Desktop web | Persistent right-side panel "Ask Estibill" with cards that open the relevant screen | Context follows the open object |
| Mobile app | Central chat with voice button; cards for results; camera and measurement hand-offs | Offline: capture queued; Assistant replies "saved, will process when online" |
| Mobile web (consumer) | The intake itself; minimal chrome | No account; anonymous session |
| Voice-only (driving) | Read-back summaries; no High actions | Confirmation deferred to screen |

## D8. Cost control

| Control | Rule |
|---|---|
| Model routing | Cheap model for transcription clean-up, classification, extraction, phrasing; mid model for planning; strong model only for ambiguous scope synthesis or long-report synthesis |
| Media | Vision only on new or explicitly re-requested media; observations cached as facts |
| Context | Facts by predicate set; no transcript replay; strict token budget per turn |
| Budgets | Per-Job budget: abandoned intake ≤ a few cents; qualified Job and full report analysis capped; alerts on breach |
| Metrics | AI cost per qualified Job; per estimate; per Assistant turn by intent |

## D9. Evaluation and failure handling

| Item | Rule |
|---|---|
| Regression set | Fixed corpus of transcripts, photos, reports with gold facts and scope; run on every prompt/model change; release gate on accuracy and cost |
| Refusal and fallback | When intent confidence is low: ask one clarifying question or offer 2–3 tappable intents; never guess a High action |
| Hallucination guard | L5 verification strips or regenerates any number not backed by a tool result |
| Contradiction | Surface it; never resolve silently |
| Audit | Every action: who, what tools, inputs, outputs, confirmation; visible in company audit log |

---

# PART E — CANONICAL DATA MODEL

Property → Project → Job is the spine. All groups hang off it. One database per environment, multi-tenant by `company_id`, with an aggregate store fed only by the eligibility pipeline.

## E1. Identity and organization

| Entity | Key fields | Relationships |
|---|---|---|
| `User` | id, locale, auth identities, anonymous_device_tokens | many `Membership` |
| `Company` | id, legal name, type (contractor, realtor, GC, PM), tax ids (encrypted), settings, markup defaults | owns most private data |
| `Membership` / `Role` | user, company, role (owner, admin, estimator, PM, worker, accountant, viewer) | permission source |
| `ProfessionalProfile` | company or individual, trades[], languages[], job_size_band, subcontract_pref, public_page settings | `Credential`, `ServiceArea`, `Availability` |
| `Credential` | type, jurisdiction, number, issued, expires, verification_status, verified_at, source | `CredentialVerification` |
| `ServiceArea` | polygons or ZIP set, travel radius | |
| `Availability` | windows, capacity, exceptions | feeds M11, M16 |
| `Event` (audit) | actor, action, entity, before/after hash, timestamp | append-only |

## E2. Customer and property

| Entity | Key fields | Relationships |
|---|---|---|
| `Client` | company-scoped party (person or org), contact, locale, portal links | `Project` |
| `Lead` | source, status, qualified flag | may become `Client` + `Job` |
| `Property` | address (normalized), parcel data, type, year_built, stories, sqft, systems | `Room`, `PropertySystem`, `Project`, `PropertyTimelineEvent` |
| `Room` / `Area` | name, type, dimensions (Measurement refs) | `ScopeItem`, `Photo` |
| `PropertySystem` | electrical, plumbing, HVAC, roof, structure … with attributes | `Finding` |
| `InspectionReport` | document, inspector, date, pages | `Finding` |
| `Finding` | text, system, severity, urgency bucket, evidence status, rangeable flag | `ScopeItem` |

## E3. Evidence and facts

| Entity | Key fields |
|---|---|
| `MediaAsset` | type, storage ref, captured_at, geo, device, portfolio_eligible, privacy flags |
| `Transcript` | media ref, language, text, segments |
| `Observation` | media ref + region, predicate, value, confidence, model version |
| `Measurement` | method, value, unit, tolerance, geometry ref, media ref |
| `Fact` | subject, predicate, value, unit, status, confidence, provenance, observed_at, superseded_by |
| `Contradiction` | fact ids, resolution state |
| `Question` | job, predicate targeted, options, asked_at, answered_at |

## E4. Work and estimating

| Entity | Key fields |
|---|---|
| `Project` | property, client, company, status, sections, payment schedule |
| `Job` | project (optional at intake), mode (URGENT, FLEXIBLE, SMALL, PLANNED, VERIFICATION, B2B), state (G1), qualification score, timing window, location |
| `WorkType` | code, labels by locale, parent, CSI map, restoration map, credential requirement, permit likelihood class |
| `Assembly` / `AssemblyComponent` | work type, layer (platform, company, estimate), components with rates and factors |
| `Estimate` / `EstimateRevision` | project, revision number, status, validity window, totals (derived) |
| `EstimateSection` | trade package, order |
| `ScopeItem` | work type, original wording, room, quantity ref, finish level, evidence status, section |
| `PricedLine` | scope item, component, quantity, unit rate ref, provenance priority, low/likely/high, markup applied |
| `Option`, `Allowance`, `Exclusion`, `Assumption`, `UncertaintyDriver` | as named |
| `ChangeOrder` / `ChangeOrderLine` | job, origin media, status, approval, priced lines |
| `Task`, `Schedule`, `Assignment`, `InspectionEvent` | as named |

## E5. Commercial

| Entity | Key fields |
|---|---|
| `Proposal` | estimate revision, sent_at, viewed_at, accepted option |
| `Contract` / `ContractClause` / `Signature` | state, clause set, signer, evidence of signature |
| `PaymentSchedule` / `Milestone` | amounts or percentages, triggers |
| `Invoice` / `Payment` / `Payout` / `Refund` / `Deposit` / `Retainage` | ledger entries, partner references |
| `LienWaiver` | type, state form, payment ref |
| `PurchaseOrder` / `Supplier` / `SupplierPrice` | items, prices, dates |
| `FinancingOffer` | partner, terms, status |
| `PriceObservation` | work type, quantity, price state (estimated cost, quoted, awarded, invoiced, paid), date, location bucket, eligibility flag |
| `BidOutcome` | proposal, result, reason, competitor position if known |

## E6. Field and cost

| Entity | Key fields |
|---|---|
| `TimeEntry` | user, task, start/end, geo, approved |
| `Receipt` / `ReceiptExtraction` | media, vendor, amount, tax, items, cost code |
| `CostCode` | maps to work types and accounting accounts |
| `BudgetLine` / `ActualCost` | per section/work type |
| `CalibrationDelta` / `RateUpdate` | work type, estimated vs actual, accepted |
| `SyncQueueItem` | device, payload, state |

## E7. Network and trust

| Entity | Key fields |
|---|---|
| `MarketState` | metro/ZIP × trade × size band × window → liquidity state, counts |
| `Opportunity` / `MatchCandidate` / `Invitation` / `Response` / `Bid` / `Award` | as named, with timestamps and expiry |
| `MatchScore` | job, profile, hard filter results, soft score, explanation |
| `ReliabilitySignal` | profile, type, value, decay |
| `VerifiedWorkEvent` | profile, job, work types, size band, date |
| `Review` | project-linked, ratings by dimension, text |
| `Dispute` | subject, state, resolution |

## E8. Marketing and public

| Entity | Key fields |
|---|---|
| `PortfolioItem` / `BeforeAfterSet` / `PublicProjectSummary` | approved media, captions, privacy checks |
| `SocialAsset` / `PublicationApproval` | format, platform, approval state |
| `PublicPage` | profile, published sections |

## E9. Compliance and audit

| Entity | Key fields |
|---|---|
| `InsuranceCertificate`, `Permit`, `Inspection`, `TaxForm` | as named with expiry |
| `PermissionDecision`, `AssistantAction`, `Notification`, `DataUseEligibility` | as named |

---

# PART F — PRICING MATH

## F1. Formulas

| Quantity | Formula |
|---|---|
| Labor hours per component | `hours = quantity × productivity_rate × difficulty_factor` |
| Labor cost | `labor = hours × loaded_labor_rate(crew, company or index)` |
| Material cost | `material = quantity × (1 + waste_factor) × unit_material_price` |
| Component direct cost | `direct = labor + material + equipment + subcontract + fees + disposal` |
| Adjusted direct cost | `adjusted = direct × location_index × access_factor × height_factor × finish_factor` |
| Line price | `price = adjusted × (1 + overhead) × (1 + markup)`, floored by `minimum_charge` where defined |
| Range | Each input has (min, likely, max). v1: interval arithmetic on adjusted cost, then markup. Output P20 ≈ weighted toward min, P50 = likely, P80 ≈ weighted toward max (weights per input type; documented in the compiler spec). |
| Uncertainty attribution | For each input, contribution = range width with that input fixed at likely vs full width; report top three |
| Provenance | Each `unit_rate`, `productivity_rate`, `unit_material_price` carries priority 1–5 (C5) and source id |
| Qualification effect | Range width target for a scope class defines when a consumer Job is "rangeable" (G1) |

## F2. Worked example (illustrative numbers)

Scope: LVP flooring install, one room, measured 12 × 14 ft (168 sqft, tolerance ±3%), existing carpet, Midwest metro (index 0.96), company markup 25%, overhead 12%.

| Component | Quantity | Rate (likely) | Direct likely | Provenance |
|---|---|---|---|---|
| Remove carpet and pad | 168 sqft | 0.02 hr/sqft × $55/hr | $185 | Company actuals (P1) |
| Haul-off | 1 load | $120 | $120 | Price book (P2) |
| Subfloor prep | 168 sqft | 0.03 hr/sqft × $55/hr | $277 | Reference (P4) — driver: condition UNKNOWN |
| Underlayment | 168 × 1.08 | $0.45/sqft | $82 | Price book (P2) |
| LVP material (allowance) | 168 × 1.10 | $3.20/sqft | $591 | Allowance — client selection pending |
| LVP install labor | 168 sqft | 0.035 hr/sqft × $55/hr | $323 | Company actuals (P1) |
| Transitions | 2 | $38 | $76 | Price book (P2) |
| Baseboard remove/reinstall | 52 lf | 0.05 hr/lf × $55/hr | $143 | Reference (P4) |
| **Direct total** | | | **$1,797** | |
| Adjusted (×0.96) | | | $1,725 | |
| With overhead and markup (×1.12 × 1.25) | | | **$2,415** | |
| Range P20 / P50 / P80 | | | $2,150 / $2,415 / $2,890 | Drivers: subfloor condition (unknown), LVP selection (allowance), baseboard scope (assumed) |

Missing-Items Detector output: "Usually also includes: floor protection for adjacent areas, appliance/furniture moving, threshold at exterior door — add?"

---

# PART G — STATE MACHINES

## G1. Job lifecycle

| State | Entry condition | Exit |
|---|---|---|
| DRAFT | Intake started | Facts sufficient for a Job (< 60 s target) |
| CREATED | Problem, location or property, timing present | Qualification score computed |
| QUALIFIED | Completeness ≥ threshold; location resolved; timing; range width under class limit; contact verified; homeowner confirmation event | Routed |
| ROUTED | Match set generated per market state | Responses |
| PROPOSALS | ≥ 1 proposal received | Award or expiry |
| AWARDED | Homeowner/GC chose | Contract signed |
| CONTRACTED | Signature + deposit | Work starts |
| IN_PROGRESS | First task started | Close-out |
| CLOSED | Final invoice paid; punch list done | Review + verified work event |
| CANCELLED / EXPIRED | Any state | Reason recorded |

## G2. Estimate lifecycle

DRAFT → COMPILED → SENT → VIEWED → (REVISED → COMPILED …) → ACCEPTED | DECLINED | EXPIRED. Each revision is immutable once SENT.

## G3. Invoice lifecycle

SCHEDULED → ISSUED → VIEWED → PARTIALLY_PAID → PAID | OVERDUE → (reminders) → PAID | DISPUTED → RESOLVED.

## G4. Opportunity lifecycle (per pro)

INVITED → VIEWED → INTERESTED | DECLINED | EXPIRED → PROPOSAL_SENT → AWARDED | NOT_SELECTED. Response and outcome feed reliability and fit signals.

## G5. Market liquidity states (per metro/ZIP × trade × size band × window)

| State | Condition (rolling window) | Mechanic | Proposal cap | Fees active |
|---|---|---|---|---|
| SEED | Jobs very low | Opportunity feed + matching; no volume promises | 2 | No |
| THIN | Jobs low, pros many | Sequential precision match; expand ring on decline/no response | 3 | No |
| BALANCED | Jobs ≈ pros | Controlled 2–3 proposals | 3 | Yes (success fee) |
| PRO_SCARCE | Jobs many, pros few | Pros choose from feed; availability premium; urgent premium | n/a | Yes |
| LIQUID | Both high | Broader marketplace, controlled bidding; never price-only | 5 | Yes |

Transitions computed from rolling counts with hysteresis to avoid flapping; visible internally only.

---

# PART H — MONETIZATION

| Engine | Payer | Free layer | Paid layer (direction, not final) | Guardrail |
|---|---|---|---|---|
| Estibill Estimate | — | Full estimator, basic invoices/clients, basic profile, partial Network visibility | None. Never degraded. | Acquisition engine; never paywalled |
| Business OS | Contractor company | — | Business ~$39–79/mo; Business Pro ~$99–199+/mo (seats, automation, integrations, analytics, advanced Network) | Priced on company value, not on the right to estimate |
| Network | Contractor | Opportunities in SEED/THIN markets | Success fee on awarded Qualified Jobs, e.g. 2% capped (~$500), per-category rules; Network Pro ~$149/mo reduces or removes fees; Pro includes priority/urgent access and Fill My Schedule | Fees only on QUALIFIED Jobs and only in BALANCED+ markets; never sells ranking |
| Payments | Contractor (and client for financing) | — | Processing margin; instant payout fee; financing partner revenue share | Modest; on-platform payment is incentivized, not forced |
| Property services | Homeowner / realtor | Basic intake and range | Detailed report ~$29–49; contractor remote review ~$49–99 with split (e.g. 70/30); on-site verification at market price | Reviewing pro must hold the required credential |
| GC / procurement | GC | — | Team + procurement plan; private sub network; bid tabulation | Subs never pay to bid |
| Marketing | Contractor | Auto mini-site, basic portfolio | Marketing Studio subscription or credits | Preview → approve always |

Benchmark thresholds for anything shown to users: ≥ 8 observations from ≥ 4 companies per bucket (configurable per bucket class).

---

# PART I — ROADMAP

Two tracks run in parallel: **Track C** (contractor depth, Estibill) and **Track N** (Next Build supply and demand). Consumer intake lands after the compiler exists so ranges have a real engine behind them.

| Phase | Track | Objective | Deliverables | Exit criteria | Primary KPIs |
|---|---|---|---|---|---|
| 0 | C | Protect Estibill launch | Stabilize free estimate/invoice flow | Estibill live | Weekly active contractors |
| 1 | Core | Shared core + Estimate Compiler v1 | M01–M03 foundations; taxonomy + ~50 assemblies; price book import; reference catalog + location index; compiler with ranges, provenance, revisions, options/allowances/exclusions; missing-items rules; Assistant read + draft tools | Voice note → sendable estimate < 3 min on 10 common scopes; every line has provenance | Time to proposal; % lines P1–P3 |
| 2 | C | Get-paid loop | M08 proposal/contract/e-sign (2–3 launch states); M09 deposits, milestones, card/ACH, reminders, lien waivers; M10 portal | Client signs and pays deposit in one session with no account | Sign rate; DSO; % on-platform payments |
| 3 | C | Field loop | M12 offline capture, change orders, time, receipts; M11 schedule + worker Today; M13 budget vs actual | CO discovery → approval request < 60 s; offline capture reliable | CO capture rate; costing adoption |
| 4 | C + N | Calibration + supply | M13 rate learning, bid outcome analytics; M14 free profiles, auto mini-site, credentials; M19 portfolio foundation; M15 badges | Rates update from closed jobs; profile live < 3 min | Estimate accuracy trend; profiles created; time to first opportunity |
| 5 | N | Consumer intake MVP | M04 mobile-web Tell/Show/Upload; questions policy; Job creation; consumer ranges from compiler (P3–P5); anonymous sessions | Job < 60 s; range < 3 min; AI cost per abandoned intake ≤ cents | Time to Job; completion; cost per Job |
| 6 | N | Property intelligence + realtor | M17 report analysis, findings, exposure packages, realtor workspace, property history | 60-page report → structured findings with rangeable classification | Report processing time; % rangeable; repeat realtor use |
| 7 | N | Verification + matching + B2B | M15 fit scoring; M16 planned mode; verification flows; B2B package exchange | Qualified Job → 2–3 fit proposals; GC awards a package into a sub's tenant | Response and award rates; packages awarded |
| 8 | N | Network modes | Urgent, Flexible/Fill My Schedule, Small Jobs; liquidity state machine; fee activation per market | Urgent first response within target; schedule fill measurable | Urgent response time; fill rate |
| 9 | C | Materials, compliance, integrations | M18 supplier feeds; M20 licenses/COIs/permits/1099; M21 accounting sync | Invoices and expenses sync to accounting without re-entry | Integration adoption |
| 10 | N | Market intelligence + Marketing Studio | Benchmark pipeline live with thresholds; Shorts/Reels; multilingual expansion | Benchmarks serve P3 in first markets | Benchmark coverage; attributed leads |
| 11 | All | Scale | Advanced Assistant actions, consumer discovery, large-GC procurement, restoration compatibility decision | — | — |

---

# PART J — ARCHITECTURE AND TECHNICAL DIRECTION

| Area | Direction | Rationale |
|---|---|---|
| Tenancy | Single multi-tenant database per environment with `company_id` row scoping; separate aggregate store | One core (P10), simple ops early |
| Event model | Append-only domain events for every state change; audit derived from events | Auditability, calibration, analytics, sync |
| API | One typed API (GraphQL or REST + OpenAPI) consumed by all surfaces and by Assistant tools | No surface-specific backends |
| Compiler | Pure, deterministic service with versioned rule sets; replayable from stored inputs | P3; testability |
| Fact Store | Structured table with provenance; vector index only as a helper for retrieval, never as truth | P4, P6 |
| Media pipeline | Async workers; process once; store observations; keyframe sampling for video | P11 |
| Offline | Local store on mobile with queue and idempotent sync; last-writer-wins for capture, human resolution for money fields | P15 |
| Mobile | Cross-platform app with native modules for LiDAR/AR and camera; mobile web is a PWA sharing components | Task-first, one codebase where possible |
| Payments | Embedded partner (KYC, card/ACH, payouts) | Regulatory burden off-platform |
| AI | Provider-agnostic gateway; model routing by task; tool calling; per-Job budgets; evaluation harness as release gate | Cost and quality control |
| Localization | Language-neutral taxonomy; ICU messages; document templates per locale | P14 |
| Privacy | Field-level encryption for sensitive ids; eligibility pipeline for aggregates; retention policies | P10 |
| Observability | Cost per Job, per turn, per estimate as first-class telemetry | P11 |

---

# PART K — METRICS

| Group | Metric | Target / direction |
|---|---|---|
| Simplicity | Time to Job; time to range; taps per frequent task; repeated-question rate | < 60 s; < 3 min; ≤ 2; 0 |
| Contractor economics | Estimate accuracy; planned vs realized margin; CO capture rate; DSO; bid win rate; price position vs local median | Improve per company over time |
| Compiler | % lines by provenance priority; omission suggestions accepted; range width vs evidence completeness | P1–P3 share rising |
| Network | Suitable pros per local trade; Qualified Job → response → proposal → award; urgent first response; schedule fill rate | Per market state |
| Supply | Profiles created; time to first opportunity; free → Business conversion | |
| Property | Report → findings time; % rangeable; verification requests; repeat realtor use | |
| Data | Observation eligibility rate; benchmark coverage; quoted → awarded → invoiced → paid variance | |
| AI | Cost per qualified Job; per estimate; per Assistant turn; extraction accuracy on regression set | Within budget; non-regressing |
| Trust | Complaint rate by badge class; dispute rate; review linkage rate | |

---

# PART L — RISKS AND GUARDRAILS

| Risk | Guardrail | Owner module |
|---|---|---|
| Compiler scope explodes and delays everything | v1 = ~50 assemblies, interval arithmetic, one metro index; expand by usage | M07 |
| LLM leaks numbers into UI | L5 verification; API-level rejection of untraceable amounts | AS |
| Contractors distrust "AI pricing" | Provenance on every line; own price book first; calibration opt-in per job | M07, M13 |
| Payments regulatory burden | Embedded partner; no fund holding beyond partner rules; per-state lien templates reviewed | M09 |
| State contract law variance | Clause library; 2–3 launch states; legal review | M08 |
| Marketplace cold start | SEED/THIN states with matching and no fees; supply-first phases | M16 |
| Race to lowest price | No price-only sort; proposal caps; fit shown with price | M16 |
| Paid ranking accusations | Subscription absent from scoring; audit query published internally | M15 |
| Disintermediation | Protections and reputation only on-platform; modest capped fees | M09, M16 |
| Credential misuse | Jurisdiction- and scope-specific verification with expiry; hard filters | M15, M20 |
| Consumer friction | No-install mobile web; value before registration; max 3 questions | M04 |
| AI false certainty | Evidence statuses; unknowns listed; contradictions surfaced | M03 |
| Offline conflicts | Event log; LWW for capture; human resolution for money | M12 |
| Extraction drift | Regression set as release gate | AS |
| Privacy/regulatory (customer experience network) | Dropped (D8) | — |
| Brand confusion | Estibill stays contractor-facing; Next Build separate naming workstream | — |

---

# PART M — DECISION LOG AND OPEN QUESTIONS

| ID | Decision | Status | Note |
|---|---|---|---|
| D1 | Contractor depth (compiler, get-paid, field) precedes consumer intake in sequencing | Proposed | Changes Next Build phase order; Estibill launch unaffected |
| D2 | Reference cost data: license a residential cost database vs build a curated seed catalog | Open | Affects Phase 1 cost and timeline |
| D3 | Launch states for contract clause library | Open | Suggest 2–3 |
| D4 | On-platform payments and financing partner in scope for Phase 2 | Proposed | Revenue line and data quality |
| D5 | Qualified Job is a formal state with thresholds; fees attach only there and only in BALANCED+ markets | Proposed | |
| D6 | Restoration (Xactimate-style) compatibility | Deferred to Phase 11 | Segment decision |
| D7 | Languages: English, Spanish first; Ukrainian/Russian/Polish next | Proposed | |
| D8 | Contractor-to-customer experience network (Blueprint §20) | Recommend drop | Regulatory risk |
| D9 | Brand name for the property/network layer | Open | Function-neutral direction preferred; trademark screen required |
| D10 | Estimate sections align to trade packages so B2B lifts them unchanged | Proposed | Data model constraint |
| D11 | Mobile web is a PWA sharing components with the app | Proposed | |
| D12 | Subscription fields excluded from matching inputs, with audit | Adopted from prior docs | |

---

# PART N — GLOSSARY

| Term | Meaning |
|---|---|
| Assembly | Expansion of a work type into labor, material, equipment, sub, fees and disposal components with rates and factors |
| Calibration delta | Difference between estimated and actual for a work type on a closed job, used to update rates |
| Compiled estimate | Estimate produced deterministically from scope, quantities and the pricing stack, with provenance and range |
| Evidence status | OBSERVED / USER_CONFIRMED / ASSUMED / UNKNOWN / CONTRACTOR_VERIFIED |
| Fact Store | Structured, provenance-bearing memory per Property/Project/Job |
| Fill My Schedule | Matching flexible-timing jobs to a pro's open capacity |
| Liquidity state | Local market condition (SEED, THIN, BALANCED, PRO_SCARCE, LIQUID) that selects network mechanics |
| Magic link | Account-free authenticated access for clients and homeowners |
| Pricing stack | Ordered fallback of price sources: own actuals → price book → local benchmark → reference × index → AI prior |
| Provenance | The source of a fact or rate: media region, document line, utterance, sensor, rule, catalog |
| Qualified Job | Job meeting the evidence, location, timing, range-width and confirmation thresholds; the only unit that carries fees |
| Section | Estimate grouping aligned to a trade package |
| Simplicity Gate | Mandatory spec section (A6) |
| Uncertainty driver | Input whose range contributes most to the width of a compiled range |
