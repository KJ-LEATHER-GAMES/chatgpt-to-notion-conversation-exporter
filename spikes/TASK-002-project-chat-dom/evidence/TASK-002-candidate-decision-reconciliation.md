# TASK-002 Candidate Decision Reconciliation

## Status

- Decision date: 2026-08-16
- Scope: Phase 0 Minimal PoC v2 candidate strategy only
- `CANDIDATE_DECISION_RECONCILIATION: COMPLETE`
- `EFFECTIVE_CANDIDATE_DECISION: v2`
- `POC_V2_ENTRY: READY`
- `CONFIRMED FALLBACK: NONE`
- Additional live observation: **NO**
- Minimal PoC v2 started: **NO**
- Candidate Decision v1: **COMPLETE / HISTORICAL / UNCHANGED**
- Minimal PoC v1: **COMPLETE / FAIL / UNCHANGED**
- Production implementation: none

This Decision supersedes only the Phase 0 candidate clauses identified in the
Supersession Matrix. Historical Discovery, Candidate Decision v1, Minimal PoC
v1, Failure Triage, and Focused Reconciliation Discovery remain immutable.

## Scope and Decision Basis

The reconciliation uses only existing Evidence. Priority and traceability are:

1. FR-004, FR-006, and FR-011.
2. ADR-006 and ADR-014.
3. AT-002, AT-004, and AT-010.
4. TV-003 Project Coverage and TV-004.
5. RISK-003, RISK-004, and RISK-029.
6. Candidate-independent, pre-established Runtime Ground Truth.
7. Discovery Rounds 1–3.
8. Candidate Decision v1 and Minimal PoC v1 historical behavior.
9. Minimal PoC Failure Triage and Focused Reconciliation Discovery.

The readiness inputs are accepted as reviewed Evidence:

- `ACTIVE_BINDING_RECONCILIATION_READY: YES`
- `NAV_NAME_RECONCILIATION_READY: YES`
- `RECONCILIATION_DECISION_READY: YES`

No Requirement, ADR, Acceptance Test, Risk Register, Backlog, Production, or
Verdict semantics are changed.

## Historical Decision Integrity

Candidate Decision v1 remains the contract under which Minimal PoC v1 was
built. Minimal PoC v1 remains `COMPLETE / FAIL`.

The following historical facts are preserved:

- Browser, Page, and Canonical exposed one supported Project route with four
  segments and a CID candidate at zero-based position 3.
- A unique direct Active Navigation anchor was inside navigation, carried
  empty-valued `data-active`, exposed a supported Project route, and contained
  exactly one scoped nested CID.
- Browser CID, Active CID, and Nested CID were equal.
- Browser/Active origin, query, and fragment agreed.
- Browser/Page/Canonical diagnostic segment lengths were `[1, 74, 1, 36]`.
- Active Navigation diagnostic segment lengths were `[1, 36, 1, 36]`.
- Complete pathname and whole-route equality between Browser and Active were
  false.

The later focused run did not reproduce that pathname difference, but it does
not invalidate or downgrade the historical counterexample. No semantic meaning
is assigned to the differing non-CID segment.

## Effective Source Grouping

The v1 source groups remain useful, with the following reconciled boundaries:

| Source group | Effective v2 role | Relationship |
|---|---|---|
| `BrowserHostRouteSurface` | Track B Primary URL input | Separate host/browser input required by FR-004 |
| `CurrentDocumentRouteSurface` | Required page-route internal consistency | Page APIs are one underlying page source and never host fallback |
| `ActiveConversationNavigationSurface` | Required Track B R-B2 identity cross-check and shared candidate-only currentness scope | Active route need not equal Browser non-CID pathname representation |
| `ProjectNavigationSurface` | Track A Project Name Primary under R-A1 | Project Name is independently enumerated from a sibling branch of the shared active scope |
| `ProjectHeaderSurface` | Required Track A cross-check | Header name and contained link remain one source group and never select Navigation name |
| `HeadRouteMetadataSurface` | Canonical required cross-check | Canonical validates the Browser/Page route layer and CID equality; it is not fallback |
| `ProjectSemanticMarkerSurface` | Diagnostic only globally; local material inside R-A1 only | Broad marker presence alone is rejected |
| `DocumentOrGlobalTextSurface` | Rejected | No current Project binding |
| `MainConversationMetadataSurface` | Not available | No inferred candidate or fallback |

Structural distinction does not prove independent internal ChatGPT
data-generation paths.

## Supersession Matrix

| Historical Decision Area | v1 Decision | Reconciliation Decision | Status | Evidence Basis |
|---|---|---|---|---|
| Active anchor whole-route equality | Browser whole route and Active whole route had to match | Retain as stronger-agreement diagnostic only; not an acceptance invariant | **SUPERSEDED** | Valid Project-A counterexample had equal CIDs and unequal non-CID pathname representation |
| Active current-binding relation | R-B1 exact origin/path/query/fragment binding | Adopt R-B2 Project Identity Equivalence | **SUPERSEDED** | R-B2 passed historical Project-A, both Projects, both reload later states, both movement later states, and failed Standard-Control |
| Canonical vs Active whole-route equality | Canonical whole route had to equal Primary and Active | Canonical whole route must equal Browser/Page; Canonical/Active relation is CID equality only | **SUPERSEDED** | Active can validly use a different non-CID pathname representation |
| Browser/Page/Canonical route equality | Browser and page whole-route equality; Canonical current-route equality required | Preserve exact whole-route equality inside the Browser/Page/Canonical route layer | **PRESERVED** | No contrary Evidence; Focused Discovery kept this layer mutually equal |
| Active/Nested/Primary CID equality | All three CIDs required equal | Preserve Browser CID === Active CID === Nested CID | **PRESERVED** | Reproduced across both Projects and required dynamic later states; maintains mismatch detection |
| Navigation Project Name enumeration | Same-list-item name candidate could be discovered using Header name equality in PoC v1 capture | Adopt R-A1 candidate-only sibling-branch enumeration; Header and Ground Truth cannot participate | **SUPERSEDED** | Focused Discovery reproduced one independent candidate in both Projects and none in Standard-Control |
| Header independence | Header was a required cross-check, but PoC v1 also used it to discover Navigation name | Keep Header required and make capture independence explicit | **REFINED** | Triage confirmed capture deviation; focused harness kept both raw candidates independently observable |
| Source Type strategy | Project-bound Navigation plus Header consistency, with Track B separately required for combined success | Require effective Track A and Track B to resolve in the same snapshot before successful Project result | **REFINED** | Standard-Control failed both combined candidate relations; partial transition states remained non-success |
| Route Shape v1 | Four non-empty segments; CID at position 3; no query/fragment | Unchanged | **PRESERVED** | No route-shape contradiction; segment lengths remain diagnostic only |
| Project ID format boundary | No UUID, character, hyphen, case, or length rule | Unchanged | **PRESERVED** | Character-level Project format was not validated |
| `data-active` rule | Attribute presence; empty-valued representation supported; non-empty not silently truthy | Unchanged | **PRESERVED** | Reproduced whenever the active Project anchor existed |
| Fallback | None | None | **PRESERVED** | Reconciliation requires no fallback |
| Ground Truth separation | Runtime resolution and Technical Spike oracle comparison separate | Unchanged and explicitly applied after R-B2/R-A1 selection | **PRESERVED** | Focused observations selected candidates without Ground Truth |
| Combined acceptance | Track A and Track B resolved; Source Type, Name, and CID GT exact for case PASS | Unchanged, with successful Project result explicitly gated on both Tracks | **REFINED** | Neither Track can substitute for the other |
| Privacy-safe PoC harness | Evidence-safe summary existed, but raw intermediate results could leave the v1 harness | Only safe summary or fixed safe error may cross the v2 harness boundary | **REFINED** | v1 risk was not controlled; focused harness demonstrated controlled output |

All unlisted v1 clauses remain effective unless this Evidence explicitly
refines them.

## Track B Decision

### Relation option decision

| Relation | Decision | Phase 0 role | Reason |
|---|---|---|---|
| R-B1 Exact Whole Route | **DIAGNOSTIC ONLY** | Report stronger Browser/Active agreement | Historical valid Project-A counterexample prevents universal requirement |
| R-B2 Project Identity Equivalence | **ADOPT FOR TASK-002 MINIMAL POC v2** | Required Active/current Conversation identity binding | Reproduced across required Project fixtures and dynamic later states; rejected Standard-Control without fallback or GT selection |
| R-B3 CID-only global match | **REJECT** | None | No active-currentness or scoped containment proof; global inventory is unsafe |
| R-B4 Ground-Truth-assisted binding | **REJECT** | None | Ground Truth cannot select a Runtime candidate |

### R-B2 candidate selection and binding

The v2 capture must first enumerate candidate-only Active Navigation material.
It must not begin with exact Browser pathname matching or Ground Truth matching.

Track B requires:

1. Direct anchors with `data-active` presence are enumerated across all
   navigation structural scopes.
2. Candidate cardinality is exactly 1 before route/CID equality filtering.
3. The selected candidate is inside navigation, directly route-bearing, and
   non-fragment.
4. Its route is present, parseable, and supported by Observed Project
   Conversation Route Shape v1.
5. Its origin equals Browser Host origin.
6. Its CID is non-empty and equals Browser Primary CID.
7. Its scoped nested machine-readable ID metadata cardinality is exactly 1.
8. The nested value is non-empty.
9. Nested CID === Active CID === Browser Primary CID.

Non-CID pathname equality between Browser and Active is not required. Query and
fragment remain absent because both routes must independently satisfy Route
Shape v1. Neither route is normalized, rewritten, or constructed from the
other.

R-B1 whole-route equality remains visible in the Evidence-safe diagnostics.
A false R-B1 value is not itself a violation when every R-B2 invariant holds.

### Browser / Page route layer

The following v1 boundary is preserved:

1. Browser Host current-tab URL is required as a separate input.
2. Browser route must be present, parseable, and supported.
3. Browser Primary CID must be non-empty.
4. `location.href` and `document.URL` are required, parseable, supported, and
   mutually equal.
5. Browser Host whole route === `location.href` === `document.URL`.
6. `location.pathname` is required and equals the parsed pathname of the
   Browser/Page route layer.
7. Browser and all page route surfaces resolve the same Primary CID.

Page APIs remain source-internal consistency surfaces. They never replace a
missing or unsupported Browser Host input.

### Canonical decision

Canonical remains **REQUIRED CROSS-CHECK**.

Require:

1. Canonical cardinality exactly 1.
2. Canonical present and parseable.
3. Canonical independently satisfies Observed Project Conversation Route
   Shape v1.
4. Canonical whole route === Browser Host whole route.
5. Canonical whole route === both Page whole-route surfaces.
6. Canonical CID === Browser Primary CID.
7. Canonical CID === Active CID === Nested CID.

Do not require Canonical whole route === Active whole route. Canonical remains
insufficient by itself and is never fallback. `og:url` remains rejected.

### Effective Track B Runtime currentness predicate

Track B is `RESOLVED_CURRENT` only when the Browser/Page route layer, R-B2, and
Canonical decision above all pass in one snapshot.

`resolvedCid` may be returned only in `RESOLVED_CURRENT`. Missing, unsupported,
ambiguous, or inconsistent Track B material returns no successful CID.

## Observed Project Conversation Route Shape v1

The Phase 0-only parser boundary is preserved:

1. URL is present and parseable.
2. Pathname has exactly 4 non-empty segments.
3. The CID candidate is the segment at zero-based position 3.
4. The candidate is non-empty.
5. Extra segments are unsupported and are not ignored.
6. Query is unsupported.
7. Fragment is unsupported.
8. Query and fragment are never CID sources.
9. No Standard route literal, grammar, selector, or CID position is imported.
10. No meaning is assigned to non-CID segments.

Diagnostic segment-length patterns, including `[1, 74, 1, 36]` and
`[1, 36, 1, 36]`, are not acceptance rules. No route normalization exists.

## Project ID Format Boundary

`PROJECT CHARACTER-LEVEL ID FORMAT: NOT ADOPTED / NOT REQUIRED FOR POC v2`

The effective Decision adds no:

- Project CID length requirement;
- UUID version or variant semantics;
- lowercase hexadecimal rule;
- fixed hyphen position rule;
- trimming, repair, normalization, or case conversion; or
- Standard ID Format v1 assumption.

Identity is validated through one non-empty route candidate, candidate-only
cross-source equality, and independent Ground Truth comparison.

## Track A Decision

### R-A1 adoption

`R-A1 ACTIVE-CONVERSATION LOCAL SIBLING PROJECT NAME:`
**ADOPT FOR TASK-002 MINIMAL POC v2**.

The v2 capture must begin from the same uniquely selected candidate-only Active
Navigation anchor used by R-B2. It must not use Header text, Header link text,
Project Name Ground Truth, Conversation Title, global exact text, or document
title to enumerate the Navigation Project Name.

Within the selected anchor's navigation list-item ancestor chain:

1. Identify exactly one outer active-conversation local list-item scope.
2. Enumerate its direct child branches without text-value matching.
3. Identify exactly one anchor-bearing child branch containing the selected
   Active Navigation anchor.
4. Enumerate sibling branches separately from the anchor-bearing branch.
5. A Project Name candidate branch must:
   - not contain the selected active anchor;
   - contain no descendant anchors;
   - be visible;
   - expose the observed accessible and Project-semantic local material; and
   - contain one non-empty candidate text root/group after nested same-value
     duplicates are collapsed structurally.
6. Exactly one branch and one resulting Project Name root/group must satisfy
   the relation.

The candidate value is compared with Ground Truth only after enumeration and
Runtime evaluation. The local Project-semantic material is insufficient by
itself and is not a broad marker detector.

### Header required cross-check

`ProjectHeaderSurface` remains **REQUIRED CROSS-CHECK**.

Capture Header independently of Navigation and require:

1. Header Project Name structural group cardinality exactly 1.
2. Header Project Name non-empty.
3. Project-related link cardinality exactly 1 within that Header group.
4. Header link text non-empty.
5. Header Name === Header Link text.
6. Navigation Name === Header Name.

Header cannot participate in R-A1 enumeration. Header-only success remains
prohibited. A Navigation/Header mismatch must reach the pure evaluator as two
independent candidate values and classify as inconsistent.

### Effective Track A Runtime currentness predicate

Track A is `RESOLVED_CURRENT` only when:

1. The shared Active Navigation candidate cardinality is exactly 1.
2. The candidate satisfies the direct, non-fragment, `data-active`, navigation
   scope, supported-route, and same-origin parts of R-B2.
3. R-A1 resolves exactly one non-empty Navigation Project Name.
4. Header resolves exactly one non-empty Project Name and one contained,
   non-empty Project-related link.
5. Navigation Name === Header Name === Header Link text.

`resolvedProjectName` may be returned only in `RESOLVED_CURRENT`. Broad markers,
global text, document title, route shape alone, or Header alone cannot resolve
Track A.

## Shared Active Navigation Scope

Track A and Track B may share the same underlying candidate-only Active
Navigation anchor as a structural current-Conversation scope. This is not an
oracle relationship.

- Track B validates the current Conversation identity through route/CID and
  scoped nested-ID relations.
- Track A acquires Project Name from an independently enumerated sibling
  structural candidate.
- CID does not prove Project Name correctness.
- Project Name does not prove CID correctness.
- Track B Ground Truth does not validate Track A.
- Track A Ground Truth does not validate Track B.

Required Runtime equalities remain:

```text
Navigation Name === Header Name === Header Link text
Browser CID === Active CID === Nested CID === Canonical CID
```

Independent Ground Truth comparisons are applied only after Runtime resolution.

## Source Type Strategy

A successful Project Runtime result requires in the same snapshot:

1. Track A = `RESOLVED_CURRENT` under R-A1 and independent Header consistency.
2. Track B = `RESOLVED_CURRENT` under Browser/Page consistency, R-B2, and
   Canonical consistency.

Only this combined result may report successful Source Type=`Project` for the
Technical Spike case. A Track-local diagnostic may report that its own
candidate structure resolved, but it is not combined Project success.

Broad Project-token markers, route shape alone, Header alone, global text, and
document title cannot identify Project. Standard-Control remains non-Project
because R-B2 and R-A1 did not both resolve.

## `data-active` Boundary

The evidence-backed v1 rule is preserved:

- currentness uses attribute presence;
- literal value `true` is not required;
- the observed empty-valued representation is the supported Phase 0
  representation;
- unexpected non-empty representation must not be interpreted as truthy or
  silently accepted; and
- `aria-current` remains diagnostic-only.

Candidate cardinality is measured before route/CID filtering so duplicate or
conflicting active material cannot be hidden by selecting only the agreeing
candidate.

## State Classification

The diagnostic states remain:

| State | Meaning | Accept |
|---|---|---:|
| `RESOLVED_CURRENT` | Every required Track predicate holds | Yes for that Track |
| `UNRESOLVED` | Required material is absent or empty | No |
| `AMBIGUOUS` | Required unique candidate cardinality is 2+ | No |
| `INCONSISTENT` | Required source-internal or cross-source relation fails | No |
| `UNSUPPORTED_ROUTE` | Required route is malformed or outside Route Shape v1 | No |

These are Phase 0 diagnostics, not Production error enums. A deterministic PoC
representative-state precedence may be retained only for self-tests, while all
violation codes remain available in the Evidence-safe summary.

## Fail Closed Contract

### Active / CID

No successful Track B result is returned when any of these applies:

- Browser Host missing, malformed, or unsupported;
- Browser/Page whole-route or page-internal mismatch;
- page pathname inconsistency;
- active candidate cardinality zero or 2+;
- active candidate is indirect, fragment-only, outside navigation, or lacks
  `data-active`;
- active route is missing, malformed, or unsupported;
- Active CID is empty or differs from Browser Primary CID;
- scoped nested metadata cardinality zero or 2+;
- scoped nested value is empty;
- Nested CID differs from Active CID or Browser Primary CID.

Active non-CID pathname inequality with Browser/Canonical is not a violation
when every R-B2 identity invariant passes. The whole-route relation remains a
diagnostic boolean.

### Canonical

No successful Track B result is returned when:

- Canonical cardinality is zero or 2+;
- Canonical is missing, malformed, or unsupported;
- Canonical whole route differs from the Browser/Page route layer;
- Canonical CID differs from Browser Primary CID, Active CID, or Nested CID.

Canonical whole-route inequality with Active is not independently a violation.

### Project Name

No successful Track A result is returned when:

- the active-conversation local outer list-item or anchor-bearing branch is
  missing or ambiguous;
- independent Navigation candidate cardinality is zero or 2+;
- Navigation candidate is empty;
- only an unscoped/global or broad-marker candidate exists;
- Header group cardinality is zero or 2+ or Header Name is empty;
- contained Header link cardinality is zero or 2+ or link text is empty;
- Navigation Name differs from Header Name; or
- Header Name differs from Header Link text.

### Transitional and protocol cases

Browser/Page/Canonical current with any of these remains non-success:

- active or nested material missing;
- Navigation Project Name missing; or
- Header group/link missing.

Ground Truth cannot repair or approve an unresolved candidate. No Production
error mapping, waiting rule, or settled algorithm is defined.

## Ground Truth Separation

Runtime Candidate Decision and Technical Spike oracle comparison remain
separate.

Ground Truth must never:

- enumerate or filter an active candidate;
- select the R-A1 branch or Navigation Name;
- repair or replace CID or Project Name;
- normalize, rewrite, or construct a route; or
- approve an otherwise unresolved, ambiguous, inconsistent, or unsupported
  state.

An internally consistent wrong candidate set may be Runtime-resolved, but its
Technical Spike case must fail the independent exact comparison. Invalid or
missing expected input is a Ground Truth input error, not a TV failure.

## Combined Acceptance

Minimal PoC v2 combined Runtime success requires in one snapshot:

```text
Track A = RESOLVED_CURRENT
AND
Track B = RESOLVED_CURRENT
```

Technical Spike case PASS additionally requires:

```text
Source Type Ground Truth exact
AND
Project Name Ground Truth exact
AND
Project CID Ground Truth exact
```

Neither Track substitutes for the other. Runtime equality and Ground Truth
exactness must remain separate Evidence-safe results.

## Fallback Decision

`CONFIRMED FALLBACK: NONE`

The effective v2 Decision introduces no:

- global CID or global nested metadata fallback;
- global Project Name fallback;
- Header-only fallback;
- Canonical-only fallback;
- Page URL fallback for missing Browser Host input;
- Ground Truth fallback;
- route rewriting or normalization fallback; or
- replacement of one required Track by the other.

## Privacy-Safe PoC v2 Entry Requirement

Minimal PoC v1 had `RAW_RUNTIME_OUTPUT_RISK: NOT CONTROLLED`. The focused
diagnostic harness demonstrated a controlled boundary. PoC v2 must enforce:

```text
raw capture
  -> internal Track evaluation
  -> internal Ground Truth comparison
  -> Evidence-safe summary
  -> only Evidence-safe summary or a fixed safe error crosses the harness boundary
```

Runtime processing may internally hold raw values, but no externally returned
or logged object may contain raw URL, pathname, href, Canonical value, CID,
Project Name, fixture Title, DOM, or metadata-bearing exception text.

The v2 harness must not expose raw capture, parser diagnostics, Track results,
Ground Truth values, or browser exception objects. This is a Phase 0 PoC safety
boundary, not a Production logging or sanitizer design.

## PoC v2 Entry Criteria

Minimal PoC v2 entry is READY only under all of these requirements:

1. Treat this Evidence as the effective Phase 0 Candidate Decision; retain v1
   as historical.
2. Implement R-B2 and keep R-B1 diagnostic-only.
3. Preserve Browser/Page whole-route and page-pathname consistency.
4. Preserve Canonical as required Browser/Page route and cross-CID check; do
   not require Canonical/Active whole-route equality.
5. Implement R-A1 without Header, Ground Truth, Title, or global-text
   participation in candidate enumeration.
6. Capture Header independently and preserve Header internal equality plus
   Navigation/Header equality.
7. Measure active and R-A1 cardinality before agreement filtering so mismatch
   or duplicates remain observable.
8. Preserve Route Shape v1 and the no-Project-format boundary.
9. Preserve `data-active` presence and empty-valued representation rules.
10. Require both Tracks in one snapshot and all three independent Ground Truth
    comparisons for Technical Spike case PASS.
11. Preserve every Fail Closed case and `CONFIRMED FALLBACK: NONE`.
12. Add pure synthetic tests for:
    - Browser/Active non-CID pathname difference with all R-B2 CIDs equal;
    - Browser/Active CID mismatch;
    - Active/Nested mismatch;
    - Canonical/Browser whole-route mismatch;
    - Canonical/Active whole-route difference with all required v2 relations
      satisfied;
    - independent Navigation/Header mismatch reaching the evaluator;
    - zero, duplicate, empty, unsupported, and partial-source states;
    - internally consistent wrong Name or CID failing Ground Truth; and
    - arbitrary non-UUID, non-fixed-length synthetic Project CID success.
13. Ensure only a safe summary or fixed safe error can leave the harness.
14. Persist no raw fixture, route, identity, DOM, body, or authentication data.
15. Keep code under the TASK-002 spike directory; do not modify `src/` or
    Production files.
16. Keep evaluation single-snapshot. Do not implement polling, retry, timeout,
    fixed sleep, debounce, or automated settled detection.

All entry questions are resolved by existing Evidence.

`POC_V2_ENTRY: READY`

## Known Limitations

- Two Project fixtures and one Standard-Control in the current ChatGPT UI.
- Authenticated Chrome on Windows and one primary viewport.
- The historical non-CID route difference was observed once and not reproduced
  in the focused run; it remains a valid counterexample.
- R-A1 describes a Phase 0 observed structural relation, not a Production
  selector.
- Browser/page/DOM capture remains sequential rather than atomic.
- Intermediate states may be missed between explicit captures.
- Internal data-generation independence of structurally distinct groups is not
  proven.
- No malformed, duplicate, or mismatch live state was synthesized.
- No Production route grammar, selector, validator, error mapping, fallback,
  or settled/waiting algorithm is decided or implemented.

These limitations do not add new Formal Pass conditions and do not block PoC
v2 entry.

## Requirement / ADR / Risk Impact

- **FR-004 / ADR-014 / AT-004 / RISK-029**: Browser Host remains Primary;
  Browser/Page/Canonical route equality is preserved; R-B2 validates current
  identity through Active/Nested CID equality without requiring non-CID path
  equality. Cross-CID mismatches remain observable and Fail Closed.
- **FR-006 / AT-002 / RISK-003**: R-A1 plus independent Header consistency and
  required Track B material form the Project candidate strategy. Broad markers
  and Standard-Control false-positive material remain excluded.
- **FR-011 / ADR-006 / AT-010 / RISK-004**: every required Project Name and CID
  surface remains mandatory; transitional absence and mismatch stay
  non-success with no fallback.
- Requirement, ADR, Acceptance Test, Risk Register, Backlog, and Production
  semantics are unchanged.

## Repository / Security Check

- `git diff --check`: PASS.
- New Evidence direct trailing-whitespace scan: PASS (0 findings).
- Raw Project Name / fixture Title scan: PASS (0 findings).
- Raw Conversation ID / real UUID-like fixture literal scan: PASS (0 findings).
- Raw URL / pathname / href / Canonical value scan: PASS (0 findings).
- Raw DOM / HTML / Conversation body scan: PASS (0 findings).
- Credential / cookie / token / authorization-value scan: PASS (0 findings).
- Changed scope: this new Candidate Decision Reconciliation Evidence only.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001 assets, TASK-002
  historical Evidence, Candidate Decision v1, Minimal PoC v1, and self-test v1:
  unchanged.
- Production implementation: none.

The new Evidence is untracked during review, so direct content scans are
required in addition to `git diff --check`.

## Status After Reconciliation

```text
TASK-002 Discovery: COMPLETE
TASK-002 Candidate Decision v1: COMPLETE / HISTORICAL
TASK-002 Candidate Decision Reconciliation: COMPLETE
TASK-002 Effective Candidate Decision: v2
TASK-002 Minimal PoC v1: COMPLETE / FAIL
TASK-002 Minimal PoC v2: NOT STARTED

TV-004 Candidate Decision: RECONCILED / v2
TV-004 Verdict: NOT SET

TV-003 Project Coverage Candidate Decision: RECONCILED / v2
TV-003 Project Coverage Verdict: NOT SET
TV-003 Overall Final Verdict: PENDING

TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

Proceed to **TASK-002 Minimal PoC v2**. Implement only this effective v2
Decision under the TASK-002 spike boundary, preserve the privacy-safe harness
contract, and keep automated waiting and all Verdicts out of scope.
