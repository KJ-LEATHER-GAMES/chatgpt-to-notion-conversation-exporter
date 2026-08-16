# TASK-003 Long-100 Prepared Fixture Binding Strategy Review

## Status

- Date: 2026-08-16
- Scope: construction-tooling Runtime prepared-fixture binding strategy only
- Browser observation: **NO**
- Fresh Conversation creation: **NO**
- Construction retry or mutation: **NO**
- TV-005 / TV-006 Discovery: **NOT STARTED**
- Production implementation: **none**

```text
PREPARED_FIXTURE_BINDING_STRATEGY: DECIDED
HISTORICAL_PREPARED_TAB_RECOVERY: NOT_RECOMMENDED
FRESH_CONTROLLED_TAB: RECOMMENDED
RUNTIME_REBINDING_METHOD: USER_MEDIATED_EXACT_RUNTIME_LOCATOR
USER_RUNTIME_INPUT_REQUIRED: YES
```

## Review Basis

The review uses the repository-current Requirements, ADR, Risk Register,
Acceptance Tests, Technical Validation Plan, Development Backlog, and all
chronological TASK-003 planning, Ground Truth, qualification, construction,
Failure Review, Composer Decision, and Attempt 2 Evidence.

The current Source-of-Truth scope remains unchanged:

- TASK-003 refs: TV-005 and TV-006;
- TASK-003 risk: RISK-002;
- TASK-003 exit: completeness judgment at the 200-Message class;
- raw fixture identifiers remain outside repository Evidence; and
- uncertain binding fails closed before construction mutation.

This is a Phase 0 construction-tooling Decision. It does not define Production
identity, a Production selector, Message identity, or a Completeness Signal.

## Historical Attempt Integrity

Historical attempt records remain immutable:

```text
LONG_100_ATTEMPT_1: ABORTED
LONG_100_ATTEMPT_2: ABORTED_BEFORE_FILL

LONG_100_CONSTRUCTION_STATE: BLOCKED
LONG_100_COMPLETED_CYCLES: 0
LONG_100_USER_SUBMISSIONS: 0
LONG_100_ASSISTANT_COMPLETIONS: 0
LONG_100_NEXT_EXPECTED_CYCLE: 1
```

No historical attempt is reclassified as retry or success. The frozen ledger,
ledger digest, expected count, aliases, and role rule remain unchanged.

## Current Binding Failure Recap

Attempt 2 established these safe facts:

- historical Runtime handle present: true;
- historical Runtime handle reachable: false;
- same-ID current-tab match count: 0;
- historical raw locator available: false;
- multiple current open tabs existed;
- no tab was selected by order, active state, composer presence, or Message
  state; and
- Attempt 2 stopped before prompt generation, fill, click, send, or Assistant
  generation.

The failure is loss of a usable Runtime re-binding locator across a session
boundary. It is not evidence that the historical tab was mutated, nor evidence
that any currently open tab is the historical prepared fixture.

## Historical Prepared-Tab Recovery Feasibility

Recovery is technically conditional on new candidate-independent external
input. At minimum, one of the following would be required at Runtime:

- a user-provided exact temporary locator that can be compared against current
  browser tabs;
- an explicit user-confirmed browser-tab handoff that identifies exactly one
  tab; or
- equivalent externally supplied exact binding material with one current
  match.

The raw input must remain Runtime-only. Exact match cardinality must be one.
Approximate title, route shape, composer presence, blank appearance, Message
content, or tab order cannot repair the missing locator.

Current Evidence does not contain such input. Because the historical tab has
zero constructed occurrences, recovering it provides no provenance benefit
over a fresh tab while retaining ambiguity and user-coordination cost.

Decision:

```text
HISTORICAL_PREPARED_TAB_RECOVERY: NOT_RECOMMENDED
```

This does not claim recovery is impossible. It remains conditional if the user
later supplies exact unambiguous Runtime binding material, but it is not the
recommended construction path.

## Fresh Controlled-Tab Feasibility

Abandoning the historical empty prepared tab does not damage Long-100 Ground
Truth or construction provenance:

- successful User submissions remain 0;
- Assistant completions remain 0;
- completed cycles remain 0;
- all frozen aliases remain unconsumed;
- the expected next cycle remains 1;
- the frozen ledger and digest can be reused unchanged;
- Attempts 1 and 2 remain historical failure records;
- a new construction run can be named Attempt 3; and
- fixture designation and Ground Truth establishment remain prohibited until
  all 50 cycles complete unambiguously.

No existing tab needs to be deleted or closed by this Decision. Fresh Chat
creation is an external mutation and requires a separate explicit user
authorization.

Decision:

```text
FRESH_CONTROLLED_TAB: RECOMMENDED
```

## Audit Identity vs Runtime Re-Binding

### Audit identity

An audit identity records that the same binding material was presented at two
times. A digest may serve this purpose without persisting the raw value when
its privacy and derivation are acceptable.

Audit identity does not by itself select a browser tab, prove currentness, or
prove that a candidate is the construction fixture.

### Runtime re-binding locator

A Runtime re-binding locator must enable the next session to enumerate current
tabs internally and identify exactly one tab by exact comparison. It therefore
requires either:

- the exact raw locator to be supplied again at Runtime; or
- a previously reviewed derived comparator that can be recomputed from every
  current candidate and has a stable, unique source relation.

A stored hash with no stable candidate source or no reproducible derivation is
audit-only. It cannot discover a tab merely because the historical hash exists.

The two responsibilities are not interchangeable.

## Candidate Binding Strategies

| Candidate | Classification | Session-boundary result | Privacy / ambiguity assessment | Decision |
|---|---|---|---|---|
| 1. Ephemeral browser handle only | execution handle | may expire; failed in Attempt 2 | raw value need not persist, but re-binding is unavailable after loss | REJECT AS SOLE METHOD |
| 2. User-provided Runtime-only exact locator | Runtime re-binding locator | reproducible when the user supplies the same exact material | raw value remains outside Evidence; exact-match cardinality can fail closed | ADOPT |
| 3. Newly established Runtime locator after fresh creation | locator establishment step | usable in later rounds only if retained by the user and supplied again | requires exact uniqueness and currentness check; no repository persistence | ADOPT AS ATTEMPT 3 LIFECYCLE STEP |
| 4. Safe derived fingerprint | possible audit identity | not yet proven as a re-binding locator | entropy, derivation, stability, collision, and currentness remain unvalidated | AUDIT-ONLY / DEFER |

### Candidate 1 — Ephemeral handle

An ephemeral handle is useful inside one uninterrupted browser session after
exact binding. It cannot be the only persistent construction relation because
Attempt 2 demonstrated that the handle may become unreachable and leave no
replacement locator.

### Candidate 2 — User-mediated exact Runtime locator

This is the adopted re-binding method. The user retains the exact locator
outside the repository and supplies or explicitly hands off the target at the
start of a later construction round. The harness compares raw values only in
memory and accepts the binding only when the match count is exactly one.

User involvement is an explicit construction input, not a tooling defect. It
prevents the harness from guessing among personal browser tabs.

### Candidate 3 — Locator establishment after fresh creation

Attempt 3 should establish an ephemeral handle immediately after creating the
fresh controlled tab. Before any session boundary, it should also determine
whether an exact, stable Runtime locator is available.

An unsent blank tab may not yet expose a unique durable locator; this has not
been established. Therefore Attempt 3 should keep creation and gated Cycle 1
within one explicitly authorized session. After the first unambiguous cycle,
it should capture a stable exact locator if one exists, keep the raw value
outside Evidence, and require the user to re-supply it for later cycles.

If no stable exact locator is available after Cycle 1, do not proceed across a
session boundary without a separate binding review.

### Candidate 4 — Derived fingerprint

A derived fingerprint is not adopted as the current Runtime locator because:

- a digest of low-entropy identifying material may be guessable or reversible
  by enumeration;
- cryptographic collision probability may be low while semantic non-uniqueness
  remains high, for example when multiple blank tabs share binding material;
- equality of a stale locator does not prove currentness;
- generating a fingerprint from whichever tab is active at re-binding time
  would be candidate self-approval; and
- current Evidence does not establish a stable raw source and derivation that
  can be recomputed across sessions.

If a later Round establishes a stable high-entropy locator and a privacy-safe
derivation, the fingerprint may be reconsidered as a comparator by hashing
every current candidate internally and requiring exactly one digest match. For
now it is audit-only and cannot replace user-supplied exact Runtime input.

## Persistent Construction-Tooling Binding Contract

The adopted minimum contract is:

1. **Creation authorization** — fresh Chat creation requires explicit user
   approval for a named attempt.
2. **Immediate handle binding** — the created tab must yield exactly one
   execution handle in the current session.
3. **Pre-mutation check** — handle reachability and session match cardinality
   must be exactly one before editor resolution or fill.
4. **No pre-first-send session gap** — if an unsent tab lacks a durable exact
   locator, create and execute the gated first cycle in one authorized session;
   loss of the handle before send fails closed.
5. **Exact locator establishment** — after an unambiguous first cycle, capture
   an exact browser-provided locator when available, verify one current match,
   and keep the raw value Runtime-only / user-held.
6. **User-mediated continuation** — before later cycles, the user re-supplies
   the exact locator or explicitly hands off the target tab.
7. **Internal exact comparison** — enumerate current tabs internally, compare
   exact locator material, and require match cardinality exactly one.
8. **Currentness check** — after re-binding, re-evaluate the approved composer
   relation and expected construction cycle before mutation.
9. **Evidence-safe output** — persist only availability, match counts, states,
   safe codes, and optional separately approved audit identity.
10. **No locator repair** — no title approximation, URL-shape inference,
    composer heuristic, Message state, tab order, or Ground Truth may create a
    match.

Safe classification:

```text
RUNTIME_REBINDING_METHOD: USER_MEDIATED_EXACT_RUNTIME_LOCATOR
USER_RUNTIME_INPUT_REQUIRED: YES
```

## Binding Fail Closed Contract

The following are prohibited:

- first open tab;
- tab order;
- active-tab preference;
- visible composer as identity;
- apparent empty Conversation as identity;
- Message count, content, or runtime Message identity as identity;
- approximate title match;
- route-shape-only inference;
- first candidate;
- heuristic selection from multiple candidates; and
- candidate-derived repair of expected binding material.

Safe non-success conditions include:

- `FIXTURE_RUNTIME_LOCATOR_MISSING`;
- `FIXTURE_RUNTIME_LOCATOR_MATCH_ZERO`;
- `FIXTURE_RUNTIME_LOCATOR_MATCH_MULTIPLE`;
- `FIXTURE_RUNTIME_HANDLE_UNREACHABLE`;
- `FIXTURE_RUNTIME_CURRENTNESS_UNESTABLISHED`;
- `FIXTURE_BINDING_RELATION_INCONSISTENT`; and
- `FIXTURE_USER_HANDOFF_NOT_ESTABLISHED`.

Any non-success condition blocks fill and send. It does not authorize creation
of a fresh tab unless that separate mutation was explicitly approved.

## Option Comparison

| Option | Ground Truth / provenance | Privacy | Reproducibility / robustness | Complexity | Ambiguous-binding risk | Long-200 reuse | Assessment |
|---|---|---|---|---|---|---|---|
| A. Continue historical recovery without new exact input | ledger unaffected, but no constructed provenance recovered | would require guessing current tabs | poor across sessions | high relative to zero progress | high | poor precedent | REJECT |
| B. Abandon empty historical tab and create fresh later | ledger and all aliases remain intact; starts Cycle 1 cleanly | raw identifiers can remain Runtime-only | good within creation session | low | low if creation handle is unique | reusable | RECOMMENDED BASE |
| C. User-mediated historical recovery | provenance remains zero; exact input can make recovery safe | acceptable when raw input stays Runtime-only | conditional on user retaining exact locator | medium | low only after exact match | reusable in principle | CONDITIONALLY SAFE, NOT PREFERRED |
| D. Fresh tab plus explicit handoff and later exact Runtime re-binding | same integrity as B, with cross-session contract | strongest practical boundary; no repo locator | best supported lifecycle | moderate | low with exactly-one gates | directly reusable | **RECOMMENDED** |

Option D is the selected strategy. It combines the clean-provenance benefit of
Option B with the explicit re-binding contract needed for Cycles 2–50.

## Recommended Binding Strategy

1. Preserve Attempts 1 and 2 as immutable failures.
2. Do not spend another Round heuristically recovering the historical empty
   tab.
3. Request separate authorization to create a fresh controlled Standard Chat
   as Attempt 3.
4. Create and uniquely bind it within that same authorized session.
5. Run only the separately authorized gated construction scope.
6. After the first successful cycle, establish an exact Runtime-only locator
   and return its custody to the user without persisting it.
7. Require user-mediated exact re-binding for every later session.
8. Fail closed whenever exact match cardinality is not one.

The historical empty tab is abandoned as a construction target, not deleted or
modified by this Decision.

## Long-100 Impact

- frozen ledger reuse: **YES**;
- ledger digest change: **NO**;
- aliases consumed: **0**;
- next expected cycle: **1**;
- Attempt 3 naming available: **YES**;
- fixture designation before 50 cycles: **PROHIBITED**;
- Ground Truth establishment before 50 cycles: **PROHIBITED**;
- current overall state: `BLOCKED` pending fresh-tab authorization.

Changing the prepared tab does not change expected count, role ledger,
first/last aliases, or construction provenance because no occurrence exists.

## Long-200 Reuse Impact

The same binding lifecycle should be reused for Long-200:

- separate frozen ledger and fixture alias;
- fresh creation in an explicitly authorized session;
- no session boundary before the first cycle unless a unique exact locator
  already exists;
- user-mediated exact locator for later cycles;
- exactly-one match and currentness gates; and
- no raw locator in Evidence.

This is tooling reuse only. It does not start Long-200 construction or add a
Formal TV criterion.

## Privacy / Security Evaluation

- Raw title, location, Conversation identifier, tab identifier, and browser
  inventory remain Runtime-only.
- The repository stores only method classification, availability, cardinality,
  booleans, and safe failure codes.
- User custody of the raw locator avoids repository persistence.
- Approximate or low-entropy derived material is not treated as safe merely
  because it is hashed.
- No Message content, DOM/HTML, authentication data, or browser exception text
  is used for binding.
- This Round performs no browser operation or external mutation.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: unchanged; no Conversation acquisition occurs.
- FR-008 / NFR-001 / NFR-002 / ADR-006: exactly-one re-binding and currentness
  gates preserve Fail Closed behavior.
- NFR-003: raw identifying material remains outside source, Evidence, and logs.
- NFR-007 / TV-005 / TV-006: unchanged and not evaluated.
- RISK-002: unchanged; no lazy-loading or completeness mitigation is tested.
- Requirements, ADRs, Acceptance Tests, Risk Register, Backlog, and AGENTS.md:
  unchanged.
- Production implementation: none.

## Repository / Security Check

- All historical TASK-003 Evidence hashes unchanged: **PASS**.
- Frozen ledger and digest unchanged: **PASS**.
- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan: **PASS**.
- Direct restricted-content scan: **PASS**.
- `docs/`, `AGENTS.md`, `src/`, TASK-001/TASK-002 assets, and Production files:
  unchanged.
- Changed scope: this new Binding Strategy Review Evidence only.
- Production implementation: none.

## Final Status

```text
PREPARED_FIXTURE_BINDING_STRATEGY: DECIDED
HISTORICAL_PREPARED_TAB_RECOVERY: NOT_RECOMMENDED
FRESH_CONTROLLED_TAB: RECOMMENDED
RUNTIME_REBINDING_METHOD: USER_MEDIATED_EXACT_RUNTIME_LOCATOR
USER_RUNTIME_INPUT_REQUIRED: YES

LONG_100_ATTEMPT_1: ABORTED
LONG_100_ATTEMPT_2: ABORTED_BEFORE_FILL

LONG_100_CONSTRUCTION_STATE: BLOCKED
LONG_100_COMPLETED_CYCLES: 0
LONG_100_NEXT_EXPECTED_CYCLE: 1

LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED

TASK-003 DISCOVERY: NOT_STARTED
TV-005 VERDICT: NOT_SET
TV-006 VERDICT: NOT_SET
```

## Recommended Next Action

`TASK-003 Long-100 Construction Attempt 3 — Fresh Tab Creation and Cycle 1
Gated Pilot Authorization`

That Round should explicitly authorize fresh Standard Chat creation and Cycle
1 only, keep creation and the gated first cycle in one browser session, and
stop after Cycle 1. Do not create the tab or restart construction in this
Strategy Review Round.
