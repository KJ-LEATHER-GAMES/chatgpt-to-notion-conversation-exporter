# TASK-002 Minimal PoC Failure Triage

## Review Verdict

- Review date: 2026-08-16
- Scope: Project-A Navigation binding, Minimal PoC v1 conformance, and
  privacy-safe diagnostic boundary only
- TASK-002 Minimal PoC v1: **COMPLETE / FAIL**
- `POC_CAPTURE_CONFORMANCE: DEVIATION_CONFIRMED`
- `PRIVACY_SAFE_DIAGNOSTIC: PASS`
- `RAW_RUNTIME_OUTPUT_RISK: NOT CONTROLLED`
- `CANDIDATE_DECISION_IMPACT: RECONCILIATION_REQUIRED`
- `POC_V2_ENTRY: BLOCKED_BY_CANDIDATE_RECONCILIATION`
- Candidate Decision changed: **NO**
- Minimal PoC v1 changed: **NO**
- Final Review started: **NO**
- Production implementation: none

Two separate findings were confirmed:

1. Minimal PoC v1 couples Navigation Project Name capture to the Header name,
   so the two Candidate Decision source groups are not independently observable
   in the live capture.
2. This capture deviation does not cause the Project-A anchor count of zero.
   Project-A currently has one direct, active, `nav`-scoped anchor containing
   the exact Ground Truth CID, but its complete pathname differs from the
   browser/page pathname. The approved exact-complete-route predicate therefore
   excludes it.

## Minimal PoC v1 Result Integrity

The Minimal PoC v1 FAIL classification remains valid.

- The required Project-A initial case did not satisfy the approved
  complete-route Active Navigation invariant.
- Triage confirmed that the PoC correctly returned no successful Project Name
  or CID for that Candidate Decision state.
- The same incomplete result was not repaired with global inventory, Header,
  canonical, or Ground Truth fallback.
- Project-B still reproduces the expected exact-route binding under the same
  privacy-safe diagnostic logic.
- Correct Fail Closed behavior does not convert a required live-case failure
  into a PoC PASS.

The prior `PROJECT_A_ACTIVE_NAVIGATION_REQUIRED_MATERIAL_MISSING` label remains
an accurate description of the evaluator input. Triage refines the cause: the
required material was filtered out by the approved complete-route relationship,
not absent from the entire navigation DOM.

## PoC Capture Conformance Review

`POC_CAPTURE_CONFORMANCE: DEVIATION_CONFIRMED`

| Contract area | Static review | Result |
|---|---|---|
| Project Navigation Primary | Current-route anchors are found first across all literal `nav` scopes, but Navigation name candidates are subsequently selected by equality with `headerGroup.name` | DEVIATION for name-source independence |
| Project Header required cross-check | Header group and contained link are captured and evaluated, but Header name also participates in discovering the Navigation Primary name | DEVIATION |
| Current-route anchor selection | Direct, non-fragment `nav a[href]` values are compared to the full page route by origin, pathname, query, and fragment | CONFORMS to approved predicate |
| `data-active` | Attribute presence is captured; empty and non-empty representations are distinct; non-empty is not silently accepted | CONFORMS |
| Scoped nested ID | Captured only below the selected exact current-route anchor; global inventory is diagnostic-only | CONFORMS |
| Browser/page/canonical | Host URL is a separate harness input; page APIs and canonical are required equality surfaces and not fallbacks | CONFORMS |
| Route parser | Exactly four non-empty segments, candidate at position 3, no query/fragment, no length/UUID/Standard grammar | CONFORMS |
| Ground Truth separation | Source Type, Project Name, and CID comparators are separate from Runtime currentness | CONFORMS |
| Fail Closed | Unresolved, ambiguous, inconsistent, and unsupported states return no successful resolved value | CONFORMS |
| Evidence-safe summary | Summary contains counts, lengths, booleans, states, and violation codes only | CONFORMS |
| Privacy/logging boundary | Raw intermediate objects remain externally returnable even though the safe summary is available | DEVIATION at harness boundary |

### Header-derived Navigation capture deviation

`captureProjectPageSnapshot()` creates Header groups before Navigation Project
Name candidates. Within each current-route anchor's list-item ancestors, a
Navigation element is retained only when its value equals a captured Header
group name.

Consequences:

- A live Navigation Name / Header Name mismatch cannot reach the pure evaluator
  as two independently observed values.
- A real mismatch can be converted into Navigation name cardinality 0.
- A valid Navigation name with a missing Header can also be converted into
  Navigation name cardinality 0 before evaluation.
- Navigation name cardinality is therefore not captured independently of the
  Header required cross-check.
- The pure self-test constructs snapshots manually and can test an explicit
  Navigation/Header mismatch, but that bypasses the browser capture limitation.

This is a PoC implementation conformance defect. It affects live mismatch,
Header-missing, and independent Navigation cardinality diagnostics.

It cannot explain Project-A `currentAnchorCount=0`: current-route anchor
selection is completed before the Header-derived Navigation-name loop and does
not depend on any Header value.

## Privacy Boundary Review

`PRIVACY_SAFE_DIAGNOSTIC: PASS`

The triage established and used this boundary before live diagnostics:

1. Tab inventory remained inside browser-process memory.
2. Fixture titles were compared inside Runtime memory; only match counts and
   booleans left the harness.
3. Host URL and Ground Truth values were passed only as Runtime inputs to page
   evaluation.
4. Page evaluation returned a pre-sanitized object containing only counts,
   lengths, booleans, and classifications.
5. Browser exceptions were caught and mapped to fixed safe diagnostic codes;
   exception messages and raw tab metadata were not emitted.
6. No raw capture, evaluator result, tab inventory, DOM, URL, or identifier was
   printed or persisted.

### Minimal PoC v1 raw-output architecture

`RAW_RUNTIME_OUTPUT_RISK: NOT CONTROLLED`

The following Runtime-only raw values are present in intermediate v1 objects:

- `captureProjectPageSnapshot()` returns page URL, pathname, anchor href,
  Project Name, nested ID, and canonical values.
- `parseObservedProjectConversationRouteV1()` returns the candidate CID and
  parsed route components, including pathname and whole href.
- `evaluateProjectMetadataSnapshot()` may return a raw resolved Project Name.
- `evaluateProjectConversationIdSnapshot()` may return a raw resolved CID and
  raw parsed-route objects under diagnostics.
- `evaluateTask002TechnicalSpikeCase()` returns the full Track results in
  addition to the safe summary.

Those values are necessary for Runtime processing and are not themselves a
repository-persistence violation. However, the module does not enforce that only
the safe summary may leave the validation harness. The prior stale-tab tool
diagnostic demonstrated that instruction-only containment is insufficient.

Recommended PoC v2 boundary, without implementing it in this Round:

```text
raw browser/page capture
  -> internal Track evaluation
  -> internal Ground Truth comparison
  -> Evidence-safe summary
  -> only the safe summary or a fixed safe error code leaves the harness
```

The raw capture, parser diagnostics, Track results, and browser exception object
must not be returned by the externally invoked diagnostic operation. This is a
PoC harness boundary, not a Production logging or sanitizer design.

## Project-A Binding Diagnostic

### Fixture gate

| Check | Result |
|---|---:|
| Fixture alias uniquely bound | true |
| Fixture match count | 1 |
| Expected Source Type known | true |
| Project Name Ground Truth available | true |
| CID Ground Truth available | true |

No raw identifying value was returned.

### Document and route

| Material | Result |
|---|---|
| Document ready state | COMPLETE |
| Main count | 1 |
| Host/page equality | true |
| Page internal equality | true |
| Pathname API consistency | true |
| Route Shape v1 supported | true |
| Segment count | 4 |
| Segment lengths | `[1, 74, 1, 36]` |
| CID candidate position | 3 |
| CID Ground Truth exact | true |
| Query present | false |
| Fragment present | false |
| Canonical count | 1 |
| Canonical current-route equality | true |

### Current-route anchor waterfall

| Filter stage | Count |
|---|---:|
| Navigation elements | 2 |
| All navigation anchors | 40 |
| Navigation anchors with href | 40 |
| Direct non-fragment href | 40 |
| Same current origin | 40 |
| Same current pathname | 0 |
| Same current query after pathname filter | 0 |
| Same current fragment after query filter | 0 |
| Exact complete current route in navigation | 0 |
| Exact complete current route document-wide | 0 |
| Exact complete current route outside navigation | 0 |
| Exact current-route anchor with `data-active` | 0 |
| Exact current-route scoped nested metadata | 0 |

Additional route-relation counts:

- Same-path but different query/fragment anchors: 0.
- Fragment-only anchors inheriting the current path: 0.
- Document-wide exact current anchor outside `nav`: 0.

This rules out the specific `POC_FILTER_ASSUMPTION_CONTRADICTION` case where an
exact complete current-route anchor exists outside a literal `nav` scope.

### Active / nested material outside the exact-route result

| Material | Result |
|---|---:|
| Global active navigation anchors | 1 |
| Empty-valued active attribute | 1 |
| Non-empty-valued active attribute | 0 |
| Global nested metadata count | 33 |
| Ground Truth-exact nested nodes | 1 |
| GT-exact node with ancestor anchor | 1 |
| GT-exact ancestor inside navigation | 1 |
| GT-exact ancestor equals current complete route | 0 |

The single GT-exact ancestor anchor was:

- direct and non-fragment;
- inside `nav`;
- active-attribute present and empty-valued;
- same origin, query, and fragment as the current route;
- different pathname from the current route;
- four segments with diagnostic lengths `[1, 36, 1, 36]`;
- exact GT CID match count 1 at zero-based position 3;
- scoped nested metadata count 1.

No semantic meaning is inferred for either differing non-CID segment.
The GT-exact global node was diagnostic only and was not used as a fallback.

## Project-A Reload Recheck

One controlled reload was performed. No fixed sleep, polling, retry, timeout,
or settled algorithm was used.

### Earliest practical post-reload summary

| Material | Result |
|---|---|
| Browser reload call | PASS |
| Document ready state | COMPLETE |
| Fixture identification available | false |
| Main count | 1 |
| Host/page/canonical current equality | true |
| Route segments / lengths | 4 / `[1, 74, 1, 36]` |
| Navigation elements / anchors | 2 / 6 |
| Exact current-route anchor | 0 |
| Global active anchor / GT nested node | 0 / 0 |
| Header group / link | 0 / 0 |

This was an incomplete, naturally captured mount/currentness state and is not a
success observation.

### Later explicit summary

| Material | Result |
|---|---|
| Document ready state | COMPLETE |
| Fixture identification available | true |
| Main count | 1 |
| Host/page/canonical current equality | true |
| Navigation elements / anchors | 2 / 40 |
| Exact complete current-route anchor | 0 |
| Global active anchor | 1 |
| GT-exact nested node / ancestor | 1 / 1 |
| Ancestor inside navigation / active | true / true |
| Ancestor complete pathname equals current | false |
| Ancestor scoped nested count | 1 |
| Header group / link | 1 / 1 |

The active/nested material appeared later, confirming a mount-state dependency
for availability. It reappeared with the same pathname mismatch, so transient
unmounting is not the sole explanation for the final Project-A failure.

## Project-B Control

The same privacy-safe diagnostic harness observed:

| Material | Result |
|---|---|
| Fixture alias bound | true |
| Document ready state / main | COMPLETE / 1 |
| Host/page/canonical current equality | true |
| Route segment count / lengths | 4 / `[1, 36, 1, 36]` |
| CID candidate position / GT exact | 3 / true |
| Query / fragment | false / false |
| Navigation elements / anchors | 2 / 40 |
| Exact complete current-route anchor document-wide | 1 |
| Exact complete current-route anchor in navigation | 1 |
| Current-route active anchor | 1 |
| Current-route scoped nested metadata | 1 |
| GT-exact active ancestor complete-path equality | true |
| Header group / link | 1 / 1 |

This control confirms that the safe diagnostic still detects the previously
working exact-route binding. The Project-A result is not explained by a general
failure of the diagnostic harness.

## Root Cause Classification

### Confirmed findings

| Classification | Confidence | Finding |
|---|---|---|
| `CURRENT_ANCHOR_EXISTS_BUT_POC_FILTER_EXCLUDES_IT` | High | One direct active navigation anchor with exact GT nested CID exists, but it fails the approved complete-path equality predicate |
| `UI_STRUCTURE_DRIFT` | High for structural relation; internal cause unknown | Project-A host/page route and its active navigation anchor now expose different pathname structures than the equal-path relation recorded in Discovery |
| `CANDIDATE_SURFACE_STABILITY_CONTRADICTION` | High | The required exact host/page/active whole-route relationship holds for Project-B but not Project-A in a complete later state |
| `POC_IMPLEMENTATION_DEFECT` | High | Header name is used to discover Navigation name, preventing independent live mismatch/cardinality observation |
| `TRANSIENT_OR_STALE_PAGE_STATE` | High as a secondary reload finding | The earliest reload summary lacked active, nested, Header, and fixture-identification material; those returned later |

### Ruled out as primary explanation

- `FIXTURE_OR_TAB_BINDING_PROBLEM`: fixture match count was exactly 1 and later
  identification, Ground Truth, host/page route, and canonical were consistent.
- `NAVIGATION_SUBTREE_NOT_MOUNTED`: true for the early reload snapshot only;
  the navigation subtree and active/nested material returned later while the
  complete-path mismatch remained.
- Exact current anchor outside literal `nav`: not observed document-wide.

### Not determinable

The semantic meaning or internal ChatGPT generation cause of the differing
non-CID path segment is not determinable from this Evidence and is not inferred.

## Candidate Decision Impact

`CANDIDATE_DECISION_IMPACT: RECONCILIATION_REQUIRED`

The implementation correctly enforced the approved exact complete-route
binding. The live Project-A state demonstrates that this required relationship
is not currently reproduced across both required Project fixtures. Fixing only
the Header-derived Navigation-name implementation would not make Track B or the
combined contract resolve for Project-A.

Focused reconciliation questions for a later Round:

1. What observed, candidate-only relationship establishes that an active
   navigation anchor is bound to the browser-host Project Conversation when the
   two supported pathname representations differ?
2. How can that relationship preserve FR-004 / AT-004 mismatch detection without
   using Ground Truth as a Runtime selector or adding an unobserved fallback?
3. Is the differing route relationship reproducible across reload, both Project
   fixtures, movement, and Standard negative-control states?
4. Independently, how should a corrected capture enumerate Navigation Project
   Name cardinality without using the Header required cross-check as its
   discovery value?

No answer or contract change is applied in this Triage.

## Minimal PoC v2 Readiness

`POC_V2_ENTRY: BLOCKED_BY_CANDIDATE_RECONCILIATION`

The privacy-safe output design is feasible, and the Header-derived Navigation
capture defect has a bounded implementation concern. However, a v2 that merely
fixes capture independence would still fail the unchanged exact-route Candidate
Decision for Project-A. Candidate Decision reconciliation must precede a v2
implementation.

## Route Diagnostic Update

- Project-A host/page route: segment count 4, diagnostic lengths
  `[1, 74, 1, 36]`, CID candidate position 3, GT exact, no query, no fragment.
- Project-A active GT-exact ancestor route: segment count 4, diagnostic lengths
  `[1, 36, 1, 36]`, GT match position 3, no query, no fragment.
- Project-B host and active routes: segment count 4, diagnostic lengths
  `[1, 36, 1, 36]`, position 3, no query, no fragment.

The 74-length finding remains diagnostic only. It does not change Observed
Project Conversation Route Shape v1, create a length rule, create an identifier
format, or assign meaning to the non-CID segment.

## Requirement / ADR / Risk Impact

- FR-004 / ADR-014 / AT-004 / RISK-029: host/page/canonical consistency remains
  observable, but exact active-anchor whole-route equality is not stable across
  the two Project fixtures. The mismatch must remain Fail Closed until the
  candidate relationship is reconciled.
- FR-006 / AT-002 / RISK-003: Project-B structural detection remains observable;
  Project-A cannot resolve under the current combined Track A binding because
  the Primary navigation anchor is not selected by the approved route relation.
- FR-011 / ADR-006 / AT-010 / RISK-004: missing or unbound required Project Name
  and CID material remains non-success. No fallback was introduced.
- Requirement, ADR, Acceptance Test, Risk Register, and Backlog semantics are
  unchanged.

## Repository / Security Check

- `git diff --check`: PASS.
- New Evidence direct trailing-whitespace scan: PASS (0 findings).
- Raw ChatGPT URL / URL literal scan: PASS (0 findings).
- Raw pathname / href / canonical value persistence review: PASS.
- Raw Conversation ID / UUID-like literal scan: PASS (0 findings).
- Raw Project Name / fixture Title scan: PASS (0 findings).
- Raw body / HTML / DOM dump scan: PASS (0 findings).
- Credential / cookie / token / authorization-value scan: PASS (0 findings).
- Line endings: LF; no mixed CRLF/LF condition found.
- Changed scope: this new Triage Evidence file only.
- Candidate Decision, Minimal PoC v1 Evidence, PoC module, and self-test hashes
  remained identical to their pre-Evidence references.
- `docs/`, `AGENTS.md`, `src/`, TASK-001 assets, existing TASK-002 Evidence,
  and Production files: unchanged.
- Live diagnostics emitted only pre-sanitized counts, lengths, booleans, and
  classifications.
- No temporary diagnostic helper was persisted.
- Production implementation: none

## Status After Triage

```text
TASK-002 Discovery: COMPLETE
TASK-002 Candidate Decision: COMPLETE
TASK-002 Minimal PoC v1: COMPLETE / FAIL
TASK-002 Minimal PoC Failure Triage: COMPLETE

TV-004 Verdict: NOT SET
TV-003 Project Coverage Verdict: NOT SET
TV-003 Overall Final Verdict: PENDING

TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

Proceed to a focused **Candidate Decision Reconciliation** Round covering the
Project-A host-route / active-navigation route relationship and the independent
Navigation Project Name capture requirement. The Round must preserve Fail
Closed, Ground Truth separation, and `CONFIRMED FALLBACK: NONE`, and must define
the privacy-safe harness boundary before any Minimal PoC v2.

Do not start Minimal PoC v2 or Final Review from this Triage.
