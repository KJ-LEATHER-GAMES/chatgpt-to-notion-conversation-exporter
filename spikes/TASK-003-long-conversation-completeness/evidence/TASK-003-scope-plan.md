# TASK-003 Long Conversation / Completeness Spike — Scope Planning

## Status

- Planning date: 2026-08-16
- Scope: TASK-003 Scope Planning / Ground Truth Plan only
- `TASK-003 Scope Planning: COMPLETE`
- `TASK-003 Discovery: NOT STARTED`
- `TV-005 Verdict: NOT SET`
- `TV-006 Verdict: NOT SET`
- `TASK-003 Final Exit: NOT SET`
- `Phase 0 Exit: NOT MET`
- Chrome observation / scrolling / browser automation: **NO**
- Candidate Completeness Signal adopted: **NO**
- PoC / self-test / Production implementation: none

Discovery gate:

```text
TASK-003 DISCOVERY ENTRY: BLOCKED_BY_GROUND_TRUTH
LONG_100_GROUND_TRUTH: NOT YET ESTABLISHED
LONG_200_GROUND_TRUTH: NOT YET ESTABLISHED
```

This is a preparation gate, not a TV-005 or TV-006 validation failure.

## Review Basis

Repository-current sources reviewed:

- `AGENTS.md`
- `docs/01_product-requirements.md`
- `docs/02_adr.md`
- `docs/03_risk-register.md`
- `docs/04_acceptance-tests.md`
- `docs/05_technical-validation-plan.md`
- `docs/06_development-backlog.md`
- `TASK-001-final-exit-review.md`
- `TV-001-validation-rounds.md`
- `TASK-002-final-exit-review.md`

This Planning uses only repository Evidence. It did not inspect Chrome, open a
fixture, scroll, capture DOM, create a long Conversation, or derive a count from
runtime candidate material.

## Source-of-Truth Scope

The current Development Backlog defines:

```text
TASK-003 Long Conversation / Completeness Spike
Refs: TV-005, TV-006
Risk: RISK-002
Exit: 200 Message級で完全取得判定が成立
```

This matches the requested scope; no Source-of-Truth mismatch was found.

The Technical Validation Plan defines:

- TV-005: prepare 100 / 200 Message-class fixtures and validate acquisition
  including the top and bottom; pass when the captured result matches fixture /
  expected count.
- TV-006: define a safe condition for declaring the full Conversation acquired;
  pass only if an incomplete state is not misclassified as Complete.
- Both TV-005 and TV-006 are Required PASS items for Phase 0 Exit.

TASK-003 planning does not modify the Backlog, Formal criteria, Requirements,
ADRs, Risks, or Acceptance Tests.

### Source Type scope

Standard Chat is recommended as the primary fixture scope for TASK-003:

- TASK-001 already established Standard Chat Message acquisition and runtime
  scan/dedup principles, allowing TASK-003 to isolate long-loading and
  completeness questions.
- TV-005 and TV-006 do not state a Standard + Project coverage matrix.
- TASK-003 Backlog Exit is expressed by the 200 Message-class completeness
  result, not by Source Type coverage.
- Project-specific route and Project Name facts from TASK-002 do not establish
  completeness behavior and will not be reused as such.

FR-001 makes both Standard and Project Chat MVP product targets, but that does
not silently add Project long-chat coverage to the current TV-005 / TV-006
Formal Pass. Applicability to a future Project Adapter remains a follow-up and
known limitation. No claim about Project long-conversation completeness will be
made from Standard-only Evidence.

## TASK-001 Handoff

The following are reusable Observed Facts or validation principles:

- Mounted Message count did not equal the Conversation-wide Message count.
- DOM virtualization with mount/unmount behavior was observed.
- The mounted range changed with viewport/scroll position.
- Outer container count did not equal Message count and is not a completeness
  oracle.
- Scroll height changed dynamically during traversal.
- The 24-Message control reached a union of 24 unique Messages through staged
  top-to-bottom capture and matched again after reload/rescan.
- A stable observed runtime identity deduplicated remounts of the same Message.
- Same-marker Message occurrences remained distinct runtime identities.
- General candidate-only completeness, a general settled/scan-finish condition,
  viewport variation, scroll-step variation, and 50–200 Message coverage remain
  unvalidated.

TV-001 PASS is limited to Message acquisition, role, order, and observed body
boundaries. It is not TV-005 or TV-006 PASS.

### Identity clarification from latest TASK-001 Evidence

The latest TV-001 Final Review supersedes earlier wording that could be read as
live proof of exact same-full-body distinct Messages:

- live proof: same-marker distinct Messages and stable remount identity;
- synthetic contract proof: same-content values can remain distinct when
  runtime identities differ;
- exact same-full-body distinct Messages in the live 24-Message fixture:
  **NOT PROVEN**.

Therefore TASK-003 must not claim that exact duplicate-body behavior is already
live-established. If duplicate-body coverage is used, it must be deliberately
specified in the new fixture Ground Truth before candidate observation.

The historical fixture is called S2 in early Evidence and S1 after label
normalization. This Planning uses the unambiguous alias `Small-Control-24`.

## TV-005 Boundary

TV-005 asks whether long-conversation loading operations can make previously
unmounted Messages appear so that the complete fixture is acquired.

In scope for Discovery:

- initial mounted subset;
- top, bottom, and intermediate virtualization behavior;
- explicit staged traversal and accumulated unique identity union;
- top and bottom boundary candidate material;
- load progress, sentinel, spacer, and virtualization metadata candidates;
- scroll metrics as observations;
- remount dedup and distinct Message preservation;
- Long-100 versus Long-200 comparison;
- reload reproducibility; and
- viewport / scroll-step sensitivity as validation material.

Formal TV-005 comparison occurs after capture:

```text
captured unique union
vs
pre-established expected count and first/last boundary oracle
```

The expected count may validate the Technical Spike result. It must not decide
that the runtime scan is complete.

Out of scope for this Planning:

- choosing scroll direction, step size, sweep count, or an automated loading
  algorithm;
- Production polling, retry, timeout, debounce, or MutationObserver behavior;
- Production selector or Source Adapter implementation; and
- a Verdict.

## TV-006 Boundary

TV-006 asks whether a candidate-only condition can safely classify a runtime
scan without using fixture Ground Truth.

The central obligation is preventing false Complete, not merely finding a
state that looks stable. Candidate families must be tested against both
complete and intentionally incomplete observations.

In scope for Discovery:

- candidate-only Runtime completeness signals and combinations;
- false-complete material from partial traversal;
- distinction between `INCOMPLETE` and `UNKNOWN`;
- cardinality, consistency, and missing-signal behavior;
- whether a scan-ending relation can be defined without a Production waiting
  algorithm; and
- Fail Closed behavior when Complete cannot be demonstrated.

Not adopted in this Planning:

- a single canonical count;
- scroll height stabilization;
- one no-new-ID observation;
- top or bottom reach alone;
- stable mounted count;
- one sweep completion; or
- any other Completeness Signal.

## Requirement / ADR / Acceptance Traceability

| Source | TASK-003 planning implication | Boundary |
|---|---|---|
| FR-007 | Diff update still requires full ChatGPT Conversation recapture | No Notion diff implementation in TASK-003 |
| FR-008 | Required loading operations and completeness validation must be technically feasible; unknown completeness blocks save | Core TV-005 / TV-006 concern |
| NFR-001 | Unknown DOM completeness must remain non-write / Fail Closed | Runtime `UNKNOWN` cannot be accepted as Complete |
| NFR-002 | False Complete is Silent Data Loss material | Negative/false-complete Evidence is mandatory |
| NFR-007 | About 200 Messages is the standard performance/test target, not a strict SLA | Long-200 is required; timing may be diagnostic only |
| ADR-005 | ChatGPT-side full Conversation acquisition is required before diff append | This Spike validates acquisition feasibility only |
| ADR-006 | Unproven completeness must Fail Closed | No guessed fallback or Ground Truth-assisted runtime approval |
| AT-007 | About 200 Messages, including first and last, must eventually be acquired | TASK-003 may support technical feasibility; it does not execute Production AT-007 |
| AT-008 | Unknown completeness maps to write refusal and zero Notion writes | TASK-003 may support Fail Closed feasibility; no Production write/error flow is implemented |

No Production Acceptance Test is set to PASS by this Planning.

## Risk Boundary

### RISK-002 — Lazy Load may omit Conversation boundaries

- Impact: Critical.
- Detection concern: candidate completeness validator and post-evaluation
  Ground Truth comparison.
- Prevention candidate space: explicit loading/traversal plus independent
  first/last and full-union validation.
- Required response when completeness is not established: stop and do not save.

This Planning does not reduce, accept, or close RISK-002. It defines the
Evidence needed to evaluate it.

RISK-025 and performance timing are adjacent to NFR-007, but TASK-003 is not a
strict performance-SLA task. Timing and scan-step counts may be recorded as
diagnostics without replacing completeness. Formal performance measurement
remains a later backlog concern.

## Loading vs Completeness Separation

| Concern | Question | Inputs | Output in this Spike | Forbidden substitution |
|---|---|---|---|---|
| A. Loading Mechanism / TV-005 | How can currently unmounted Messages be made observable? | explicit scroll/traversal operations and runtime DOM observations | mounted snapshots and accumulated identity union | loading activity alone cannot prove Complete |
| B. Runtime Completeness Signal / TV-006 | May the current scan be classified Complete without fixture Ground Truth? | candidate-only boundaries, stability, convergence, metadata, and consistency | diagnostic candidate state | expected count cannot be a runtime signal |
| C. Technical Spike Ground Truth | Did the candidate strategy actually acquire the whole controlled fixture? | pre-established count, boundary aliases, roles, and distinct occurrence ledger | post-runtime MATCH / MISMATCH | candidate result cannot create or repair expected values |

The loading mechanism may supply observations to the completeness evaluator,
but it is not itself the completeness proof. A runtime candidate may classify
the scan before Technical Spike Ground Truth is compared.

## Runtime Candidate vs Ground Truth Separation

Required evaluation order:

```text
explicit runtime scan
-> candidate-only completeness evaluation
-> COMPLETE_CANDIDATE / INCOMPLETE / UNKNOWN / AMBIGUOUS / INCONSISTENT
-> separate Technical Spike Ground Truth comparison
-> validation result
```

The following shortcut is prohibited:

```text
capturedCount == expectedCount
-> Runtime COMPLETE
```

Expected count, first/last aliases, roles, and duplicate-body expectations may
be used only after candidate-only classification. Ground Truth must not:

- select a loading operation;
- select or repair a completeness signal;
- decide when to stop scanning;
- choose a Message candidate;
- repair the captured union;
- suppress missing/ambiguous signal material; or
- approve an otherwise `UNKNOWN` scan.

Candidate-only `COMPLETE_CANDIDATE` is not a Formal PASS by itself. It must be
evaluated against independent Ground Truth across positive and false-complete
cases.

## Fixture Plan

| Fixture alias | Source Type | Size role | Expected count | First / last boundary alias | Role sequence | Duplicate-body plan | Expected distinct Message occurrences | Current designation |
|---|---|---|---|---|---|---|---|---|
| `Long-100` | Standard | TV-005 100 Message-class | design target exactly 100; fixture GT not yet established | planned `L100-M001` / `L100-M100` | planned 50 alternating User/Assistant pairs | required in at least one long fixture; occurrence ordinals must be fixed before observation | design target 100 | NOT DESIGNATED |
| `Long-200` | Standard | TASK-003 Exit / TV-005 200 Message-class | design target exactly 200; fixture GT not yet established | planned `L200-M001` / `L200-M200` | planned 100 alternating User/Assistant pairs | required in at least one long fixture; occurrence ordinals must be fixed before observation | design target 200 | NOT DESIGNATED |
| `Small-Control-24` | Standard | Prior virtualization/control material only | 24 | planned control aliases `SC-M001` / `SC-M024`, bound to the existing anonymous sequence | 12 alternating User/Assistant pairs | same-marker distinct pair exists; exact same-full-body live case not proven | 24 | REUSABLE CONTROL CANDIDATE |

The exact 100 / 200 counts and aliases above are fixture design targets, not a
claim that corresponding runtime fixtures have already been created or bound.
They become Ground Truth only when the next Round records their construction or
designation provenance before candidate observation.

For Long-100 and Long-200, fixture identification metadata will be Runtime-only.
Evidence may record alias, title-present boolean, title length, and unique
binding boolean, but not a raw Title, URL, CID, or Conversation body.

### Duplicate-body design

Fixture preparation should deliberately include two distinct Message
occurrences with exactly equal controlled synthetic bodies in at least one long
fixture. Before observation it must record, without the raw body:

- occurrence aliases and ordinals;
- role;
- `expectedBodyEquality=true`;
- expected distinct occurrence count = 2; and
- equal body-length boolean or diagnostic length if safe.

Runtime identity values remain candidate data and are not part of fixture
Ground Truth. This case tests that body equality cannot collapse distinct
Messages.

## Ground Truth Plan

### Acceptable provenance

Use a fixture-construction ledger fixed before candidate observation. The
preferred source is the human-authored sequence used to create or designate the
controlled Conversation, not a count recovered from the current DOM.

The ledger should establish:

- exact total Message count;
- one row/ordinal per expected Message occurrence;
- expected role for each occurrence;
- anonymous first and last boundary aliases;
- duplicate-body pair aliases and equality expectation, if included;
- expected distinct occurrence count;
- fixture Source Type;
- fixture alias and Runtime-only locator binding; and
- provenance statement confirming the values precede candidate observation.

Raw bodies and locators do not enter Git Evidence. Runtime comparisons may hold
them only in memory. Evidence stores aliases, counts, ordinals, role classes,
lengths, booleans, and status.

### Unacceptable provenance

Do not derive or update expected values from:

- current mounted Message count;
- staged captured union count;
- outer container count;
- scroll height or its stabilization;
- candidate total-count metadata;
- first/last candidate boundaries;
- no-new-ID observations; or
- the candidate Completeness Signal result.

If an existing long Conversation has no independent construction ledger, it
cannot be self-certified by scrolling it during Discovery. It needs a separate
pre-observation user-provided oracle or must not be used as a Formal fixture.

### Current Ground Truth status

No repository Evidence designates Long-100 or Long-200 or pre-establishes their
exact counts and boundary oracles. Ground Truth cannot be completed from the
current Planning input alone.

## Discovery Questions — TV-005

Candidate Decision must be preceded by observation addressing:

1. How many Message candidates are mounted in the initial viewport?
2. What mounts and unmounts after explicit movement to the top?
3. What mounts and unmounts after explicit movement to the bottom?
4. How does the mounted range behave at intermediate positions?
5. Does staged traversal produce a unique identity union equal to independent
   Ground Truth?
6. Can remounts of the same Message be deduplicated without collapsing distinct
   Message occurrences?
7. Can an exact duplicate-body pair remain two distinct Messages?
8. How does scroll height change during the scan?
9. Are top and bottom reach observable through candidate-only DOM/scroll
   relationships?
10. Are loading indicators, sentinels, spacers, virtualization metadata, or
    other loading surfaces present?
11. Do Long-100 and Long-200 expose the same loading relationships?
12. Does reload reproduce the same full-union result and candidate material?
13. Do viewport and scroll-step variations change the captured union or the
    apparent stopping conditions?

These are questions, not adopted facts or algorithms.

## Completeness Candidate Inventory — TV-006

Discovery should inventory, group, and test at least these signal families:

| Signal family | Observation questions | Planning status |
|---|---|---|
| Top scroll boundary | Can top reach be observed consistently, and can it occur while content remains missing elsewhere? | INVENTORY ONLY |
| Bottom scroll boundary | Can bottom reach be observed consistently, and can it occur before a full union? | INVENTORY ONLY |
| Scroll-height behavior | Does height grow, shrink, oscillate, or temporarily stabilize? | INVENTORY ONLY |
| New-identity convergence | How many repeated observation points or traversals yield no new unique identities? | INVENTORY ONLY |
| Repeated top-bottom sweeps | Does the union converge across sweeps and reverse direction? | INVENTORY ONLY |
| Mounted-range boundary | Can first/last currently mounted positions be identified without assuming global completeness? | INVENTORY ONLY |
| First structural Conversation boundary | Is a candidate first boundary present and unambiguous? | INVENTORY ONLY |
| Last/current Conversation boundary | Is a candidate last boundary present and unambiguous? | INVENTORY ONLY |
| Loading indicator/state | Is loading, idle, missing, or ambiguous state exposed? | INVENTORY ONLY |
| Virtualization spacer/sentinel | Are spacer dimensions or sentinels correlated with unmounted ranges? | INVENTORY ONLY |
| Total-count metadata | Does any candidate count exist, and is its provenance/currentness independently assessable? | INVENTORY ONLY |
| Message ordinal/position metadata | Are ordinal, position, start, end, gap, or continuity materials available? | INVENTORY ONLY |
| Multi-signal combination | Can structurally distinct signals jointly exclude known incomplete states? | INVENTORY ONLY |

No single family is canonical. Multiple APIs reflecting one underlying source
must not be inflated into independent proof.

## Negative / False-Complete Observation Plan

For each controlled fixture, capture Evidence-safe candidate states before and
during explicit traversal, then compare candidate classification to Ground
Truth only afterward.

| Negative state | Candidate-only question | Post-evaluation oracle question |
|---|---|---|
| Initial bottom-only state | Does any candidate wrongly report Complete before top/middle traversal? | Is captured union below the pre-established fixture? |
| Top-only state | Does reaching top wrongly imply full Conversation? | Are bottom or middle occurrences absent? |
| Bottom-only state | Does reaching bottom wrongly imply full Conversation? | Are top or middle occurrences absent? |
| Traversal in progress | Do partial boundaries or stable-looking metrics cause Complete? | Is the union still missing expected occurrences? |
| Scan intentionally stopped | Does an interrupted scan stay `UNKNOWN` or `INCOMPLETE`? | Was the expected union not reached? |
| Immediately after viewport change | Are stale mounted range/signals rejected? | Does the union omit known occurrences? |
| Immediately after reload | Are temporarily sparse or stale surfaces rejected? | Is the full fixture not yet captured? |
| Lazy loading active | Does loading state prevent Complete? | Is additional expected material still pending? |
| One sweep ended but Messages are missing | Is one sweep insufficient without supporting signals? | Which expected aliases remain absent? |
| Scroll height appears stable while incomplete | Is stabilization alone rejected? | Does the union remain below Ground Truth? |
| One no-new-ID snapshot while incomplete elsewhere | Is one local convergence event rejected? | Are expected occurrences still missing in another range? |

Ground Truth labels a candidate outcome as true or false complete after the
runtime rule runs; it does not participate in the runtime rule.

### Planning-only diagnostic state model

- `COMPLETE_CANDIDATE`: all currently adopted candidate-only conditions hold;
  not yet Technical Spike PASS.
- `INCOMPLETE`: candidate material positively shows loading or missing range.
- `UNKNOWN`: completeness cannot be demonstrated and incompleteness is not
  positively proven.
- `AMBIGUOUS`: cardinality or multiple interpretations prevent one result.
- `INCONSISTENT`: candidate groups disagree or lifecycle/currentness conflicts.

These are Phase 0 diagnostic candidates, not Production enums or Product error
codes. `UNKNOWN`, `AMBIGUOUS`, and `INCONSISTENT` must Fail Closed. The final
Candidate Decision may refine names and precedence only after Discovery.

## Message Identity / Dedup Reuse Boundary

Reusable validation principle from TV-001:

- accumulate Message observations across staged snapshots;
- deduplicate a remount only when the observed runtime identity and required
  role/order cross-checks remain consistent;
- preserve distinct runtime identities as distinct Messages even when marker
  or controlled body content is equal; and
- Fail Closed on identity reuse with conflicting role/order/content boundary
  material.

Not established by TASK-003 Planning:

- Production canonical Message ID;
- persistent cross-session Message identity;
- content/body-based identity;
- branch-aware identity;
- edit/regenerate identity semantics; or
- a Production dedup selector.

TASK-003 needs only scan-union identity sufficient to avoid double-counting the
same remount and avoid collapsing distinct occurrences. Branch, regenerate,
and edit remain TASK-004 scope.

`Small-Control-24` is useful for regression/control planning because its staged
union and reload rescan reached 24 unique occurrences. It cannot satisfy the
100 / 200 Method or TV-006 general completeness requirement by itself.

## Privacy Boundary

Allowed Evidence:

- fixture aliases;
- expected, mounted, captured, and union counts;
- safe first/last aliases;
- ordinal and role classifications;
- lengths and equality booleans;
- scan step numbers and source-group aliases;
- non-identifying scroll metrics;
- candidate states and safe violation codes; and
- Ground Truth provenance/status classifications.

Forbidden Evidence:

- raw Conversation or Message body;
- raw full Message text;
- raw Title, URL, pathname, href, or Conversation ID;
- raw Message/turn identity values;
- raw DOM, HTML, or screenshots;
- browser storage, cookies, session/token/credential material; and
- browser exceptions containing fixture metadata.

Any future observation harness must sanitize inside the browser/runtime
boundary so only counts, lengths, booleans, aliases, states, and fixed safe
errors leave. A raw snapshot must not be printed and then sanitized afterward.

## Option Comparison

| Option | Description | Advantages | Disadvantages / risk | Assessment |
|---|---|---|---|---|
| A | Immediately implement automated scrolling PoC | Quickly exercises one guessed mechanism | Ground Truth is absent; loading and completeness become conflated; guessed stop conditions can self-approve false Complete; violates the current planning boundary | REJECT FOR NEXT ROUND |
| B | Fixture / Ground Truth preparation, then observation-only Discovery, Candidate Decision, and Minimal PoC | Preserves candidate/GT independence, exposes false-complete states before choosing a rule, and matches Phase 0 validation discipline | Requires deliberate fixture preparation and more than one review round | **RECOMMENDED** |
| C | Reuse only `Small-Control-24` | Existing safe Evidence and known virtualization behavior | Does not cover Formal 100 / 200 Method, TASK-003 200 Message Exit, or general completeness | INSUFFICIENT |

Option B is most consistent with TV-005, TV-006, ADR-006, RISK-002, and the
Technical Spike rules. It changes no Requirement or ADR.

## Recommended Discovery Sequence

1. **Fixture / Ground Truth Preparation**
   - designate Long-100 and Long-200;
   - fix exact count, ordinal/role ledger, first/last aliases, optional exact
     duplicate-body pair, Source Type, and Runtime-only fixture binding;
   - save only Evidence-safe summaries.
2. **Discovery Round 1 — Initial / Candidate Inventory**
   - observe initial mounted subsets and loading/completeness signal families;
   - do not scroll broadly or adopt a signal before the inventory contract is
     reviewed.
3. **Discovery Round 2 — Explicit Loading / Traversal Matrix**
   - observe top, bottom, intermediate positions, staged union, remounts,
     scroll metrics, and boundary material for Long-100 and Long-200.
4. **Discovery Round 3 — False-Complete / Variation Matrix**
   - exercise the planned partial states, reload, viewport variation, and
     scroll-step variation; keep candidate states independent of Ground Truth.
5. **Candidate Decision**
   - select or reject loading and completeness relations from Observed Facts;
   - define Fail Closed and no-fallback behavior;
   - keep expected counts as post-resolution oracle only.
6. **Minimal PoC**
   - implement pure malformed/partial/self-approval tests and authenticated
     validation of the approved Phase 0 contract.
7. **Final Review**
   - review TV-005, TV-006, and TASK-003 Exit without adding Production criteria.

The exact Discovery round split may be refined after fixture preparation, but
Candidate Decision and PoC cannot precede sufficient negative-state Evidence.

## Discovery Entry Criteria

Before any TASK-003 live observation:

1. Long-100 fixture is designated and uniquely bound.
2. Long-200 fixture is designated and uniquely bound.
3. Each exact expected Message count is pre-established independently.
4. Each first and last boundary oracle is pre-established.
5. Per-ordinal role sequence and expected distinct occurrence count are fixed.
6. Any duplicate-body case and its two distinct occurrence aliases are fixed.
7. Raw body, Title, URL, CID, and runtime identities need not enter Evidence.
8. No candidate Completeness Signal is preselected.
9. Runtime Candidate and Technical Spike Ground Truth separation is accepted.
10. TV-005 loading and TV-006 completeness are evaluated as separate Tracks.
11. A privacy-safe observation output schema is fixed.
12. No Production waiting/polling/retry/timeout algorithm is assumed.

Current result:

```text
Long-100 designated: NO
Long-100 independent count/boundaries: NOT ESTABLISHED
Long-200 designated: NO
Long-200 independent count/boundaries: NOT ESTABLISHED
TASK-003 DISCOVERY ENTRY: NOT READY
```

## Blocking Status

`TASK-003 DISCOVERY ENTRY: BLOCKED_BY_GROUND_TRUTH`

Missing preparation:

> User-provided or construction-ledger-backed Long-100 and Long-200 fixture
> designations, exact expected counts, first/last boundary aliases, role rules,
> expected distinct occurrence counts, and provenance must be fixed before any
> candidate observation.

This does not set TV-005 or TV-006 to FAIL. It prevents Discovery from using
candidate DOM observations to manufacture their own oracle.

## Repository / Security Check

- `git diff --check`: PASS.
- New Planning Evidence direct trailing-whitespace scan: PASS.
- Raw Conversation / Message body scan: PASS; no raw value persisted.
- Raw Title / URL / pathname / CID / runtime Message identity scan: PASS; no
  raw value persisted.
- Raw DOM / HTML / screenshot scan: PASS.
- Cookie / token / credential / authorization-value scan: PASS.
- Changed scope: this new TASK-003 Scope Planning Evidence only.
- `AGENTS.md`, `docs/`, `src/`, TASK-001 assets, TASK-002 assets, PoC files,
  self-tests, and Production files: unchanged.
- PoC or fixture body file created: none.
- Production implementation: none.

## Recommended Next Action

`TASK-003 Fixture / Ground Truth Preparation`

That Round should designate Long-100 and Long-200 and complete the Evidence-safe
Ground Truth ledger. Do not start Chrome observation, scrolling, Candidate
Decision, or PoC until the Discovery Entry gate is reviewed as READY.

Status after Planning:

```text
TASK-001 Final Exit: PASS / COMPLETE
TASK-002 Final Exit: PASS / COMPLETE

TV-003 Overall Final Verdict: PASS
TV-004 Final Verdict: PASS

TASK-003 Scope Planning: COMPLETE
TASK-003 Discovery: NOT STARTED

TV-005 Verdict: NOT SET
TV-006 Verdict: NOT SET

TASK-003 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```
