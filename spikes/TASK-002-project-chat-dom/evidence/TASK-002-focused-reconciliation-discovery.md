# TASK-002 Focused Reconciliation Discovery

## Status

- Observation date: 2026-08-16
- Scope: Active Navigation identity binding and independent Navigation Project
  Name capture only
- `TASK-002 Focused Reconciliation Discovery: COMPLETE`
- `PRIVACY_SAFE_DIAGNOSTIC: PASS`
- `ACTIVE_BINDING_RECONCILIATION_READY: YES`
- `NAV_NAME_RECONCILIATION_READY: YES`
- `RECONCILIATION_DECISION_READY: YES`
- Candidate Decision changed: **NO**
- Minimal PoC v1 changed: **NO**
- Minimal PoC v2 started: **NO**
- `CONFIRMED FALLBACK: NONE`
- Production implementation: none

This Result means that the two contradiction areas have enough focused
observation material for a reviewed Candidate Decision Reconciliation. It does
not itself revise the historical Candidate Decision or convert Minimal PoC v1
from FAIL.

## Scope

The Round used only Project-A, Project-B, and Standard-Control. It observed:

- one later/current snapshot for each Project fixture;
- one naturally available early snapshot and one later snapshot after each
  Project reload;
- one naturally available early snapshot and one later snapshot for each
  directed Project movement; and
- one Standard-Control negative snapshot.

Back, Forward, Direct Load, broad DOM discovery, selector selection, Candidate
Decision changes, PoC v2, and all Verdicts were outside scope.

## Privacy Boundary

The privacy-safe boundary was established before browser observation:

1. Fixture locators, expected Project Names, expected CIDs, and complete routes
   remained in Runtime memory.
2. Active candidates and structural Project Name candidates were selected
   inside the page evaluation.
3. Ground Truth comparisons occurred only after candidate-only selection.
4. Only counts, lengths, booleans, safe relation names, and aliases left the
   browser harness.
5. Browser exceptions were mapped to a fixed safe diagnostic result without
   returning exception text.
6. No raw capture, evaluator object, tab inventory, DOM, route, name, or
   identifier was printed or persisted.

`RAW_RUNTIME_OUTPUT_RISK (focused harness): CONTROLLED`

The historical Minimal PoC v1 raw-output boundary remains `NOT CONTROLLED`.
This Round did not modify that implementation.

## Historical Contradiction

The Failure Triage established one complete Project-A state with:

- Browser/Page/Canonical segment lengths `[1, 74, 1, 36]`;
- Active Navigation segment lengths `[1, 36, 1, 36]`;
- equal origin, query, fragment, CID candidate, and scoped nested CID; and
- unequal complete pathname and whole route.

This provided a counterexample to exact whole-route binding. No semantic
meaning is assigned to the differing non-CID segment.

In this focused run, Project-A later/current states exposed `[1, 36, 1, 36]`
for both Browser and Active routes, so the complete-path mismatch was **NOT
REPRODUCED IN THIS RUN**. The historical observation remains valid. The
candidate-only Project identity relation described as R-B2 was satisfied by
both the historical mismatch material and the current equal-route material.

## Track B Candidate Relation Matrix

`N/A` means that no unique supported active candidate existed in that
snapshot. R-B1 is exact whole-route equality. R-B2 is the candidate-only
Project identity relation under observation; neither uses Ground Truth to
select a Runtime candidate.

| Operation | Fixture | Active count | Active route shape | Whole-route equality | Same origin | Browser / Active CID | Nested count | Active / Nested | Browser / Nested | R-B1 | R-B2 |
|---|---|---:|---|---|---|---|---:|---|---|---|---|
| Historical Triage complete | Project-A | 1 | supported | false | true | equal | 1 | equal | equal | false | true |
| Current later | Project-A | 1 | supported | true | true | equal | 1 | equal | equal | true | true |
| Current | Project-B | 1 | supported | true | true | equal | 1 | equal | equal | true | true |
| Reload early | Project-A | 0 | unavailable | N/A | N/A | N/A | 0 | N/A | N/A | false | false |
| Reload later | Project-A | 1 | supported | true | true | equal | 1 | equal | equal | true | true |
| Reload early | Project-B | 0 | unavailable | N/A | N/A | N/A | 0 | N/A | N/A | false | false |
| Reload later | Project-B | 1 | supported | true | true | equal | 1 | equal | equal | true | true |
| A to B early | Project-B | 0 | unavailable | N/A | N/A | N/A | 0 | N/A | N/A | false | false |
| A to B later | Project-B | 1 | supported | true | true | equal | 1 | equal | equal | true | true |
| B to A early | Project-A | 0 | unavailable | N/A | N/A | N/A | 0 | N/A | N/A | false | false |
| B to A later | Project-A | 1 | supported | true | true | equal | 1 | equal | equal | true | true |
| Current negative | Standard-Control | 1 | unsupported | true | true | N/A | 1 | N/A | N/A | false | false |

For every Project later/current row:

- the active candidate was direct, non-fragment, inside navigation, and the
  only direct anchor carrying `data-active`;
- the attribute was present and empty-valued; non-empty-valued and
  `aria-current` counts were zero;
- Browser, Page, and Canonical were present, supported, mutually equal, and
  had equal CID candidates;
- query and fragment were absent;
- the active CID and one non-empty scoped nested CID were equal to the Browser
  CID; and
- all three candidate CIDs matched independent Ground Truth after selection.

## Track B Cross-Operation Findings

### R-B1 — Exact whole route

R-B1 was true in every later/current Project snapshot in this focused run, but
the established Project-A Triage state remains a direct counterexample. R-B1
therefore cannot, by itself, reconcile the Candidate Decision.

### R-B2 — Project identity equivalence

The observed R-B2 relation requires one candidate-only active navigation
anchor with all of these relationships:

- direct and non-fragment;
- `data-active` present;
- supported Project Route Shape v1;
- same origin as the Browser route;
- Active CID equal to Browser Primary CID;
- exactly one non-empty scoped nested ID; and
- Nested CID equal to both Active CID and Browser Primary CID.

Non-CID pathname segment equality is not part of this observation relation.
R-B2 was true for both Project fixtures, both reload later states, both
movement later states, and the historical Project-A mismatch material. It was
false for every naturally captured incomplete state and for Standard-Control.

Browser/Active, Active/Nested, and Browser/Nested comparisons remain separate,
so each mismatch remains detectable. R-B2 requires no fallback and uses no
Ground Truth during candidate selection.

### Reload and movement lifecycle

Both reload early snapshots and both directed-movement early snapshots had:

- Browser/Page/Canonical already supported and mutually current;
- active candidate count zero;
- scoped nested count zero;
- independent Navigation Name relation count zero; and
- Header group count zero.

These snapshots did not satisfy R-B1 or R-B2 and were not treated as success.
Later explicit observations restored all required candidate relations. No
fixed sleep, polling, retry, timeout, or settled algorithm was used or defined.

## Standard-Control Track B Negative Findings

Standard-Control had one direct, empty-valued active anchor and one scoped
nested metadata node. The active route had two non-empty segments and was not
supported by Project Route Shape v1. A Project CID candidate was therefore not
available under the Project parser.

Consequently:

- R-B1 was false despite Browser/Active whole-route equality;
- R-B2 was false;
- Project-global supported-route CID match count was zero; and
- Track B did not create Project-currentness success.

This negative observation does not revise Standard TV-003.

## Track A Independent Navigation Inventory

Navigation enumeration began from the unique direct active navigation anchor.
It did not use Header text, Project Name Ground Truth, Conversation Title, or a
global exact-text search.

In both Project fixtures the active anchor had two navigation list-item
ancestors. The outer active-conversation list item contained two direct child
branches:

| Fixture | Direct outer children | Candidate branch count | Candidate tag | Contains active anchor | Descendant anchors | Accessible wrapper | Project-semantic marker | Candidate length | GT exact |
|---|---:|---:|---|---|---:|---|---|---:|---|
| Project-A | 2 | 1 | `DIV` | false | 0 | true | present | 20 | true |
| Project-B | 2 | 1 | `DIV` | false | 0 | true | present | 5 | true |
| Standard-Control | 1 | 0 | N/A | N/A | N/A | N/A | N/A | N/A | N/A |

The other Project child branch contained the active anchor and multiple
descendant anchors. It was therefore structurally distinct from the one
non-anchor Project Name branch. Project-semantic markers alone were not used;
they were observed only inside this active-conversation-bound local structure.

## Track A Structural Candidate Comparison

The candidate-only structural relation under observation was:

1. select exactly one direct, non-fragment active navigation anchor by
   `data-active` presence;
2. walk its navigation list-item ancestor chain;
3. use the outer active-conversation list item as the local scope;
4. enumerate direct child branches without text-value matching; and
5. identify one visible, non-empty, accessible, Project-semantic `DIV` sibling
   branch that does not contain the active anchor and contains no descendant
   anchors.

The relation yielded exactly one candidate in Project-A and Project-B and no
candidate in Standard-Control. Only after enumeration did the Technical Spike
oracle confirm the two Project candidates exactly matched their respective
pre-established Project Name Ground Truth values.

This is an observation candidate for the next reconciliation Round, not a
Production selector or an applied Candidate Decision.

## Navigation / Header Independence Findings

Header capture was performed separately from Navigation capture. It found in
every Project later/current state:

- Header Project Name structural group count exactly 1;
- contained Project-related link count exactly 1;
- Header name / link internal equality true; and
- independently captured Navigation / Header equality true.

Standard-Control had Header group count zero and Header link count zero.

Because Navigation candidate enumeration does not consume Header values, a
future capture using this relation can deliver independent Navigation and
Header raw candidates to the pure evaluator. A Navigation/Header mismatch
would remain representable rather than being converted into Navigation
cardinality zero. No live mismatch was synthesized in this Round.

Navigation Project Name cardinality was therefore observable independently of
Header cardinality and value.

## Reload / Movement Findings

| Operation | Fixture | Early Navigation candidate | Later Navigation candidate | Later GT exact | Later Header group/link | Later Nav/Header equality |
|---|---|---:|---:|---|---|---|
| Reload | Project-A | 0 | 1 | true | 1 / 1 | true |
| Reload | Project-B | 0 | 1 | true | 1 / 1 | true |
| A to B | Project-B | 0 | 1 | true | 1 / 1 | true |
| B to A | Project-A | 0 | 1 | true | 1 / 1 | true |

The same independent Navigation structural relationship returned in all four
later states. The early absence remained non-success material.

## Candidate Relation Option Assessment

| Option | Focused observation result | Assessment for reconciliation review |
|---|---|---|
| R-B1 exact whole route | Current run true; historical Project-A counterexample remains | Insufficient as the sole binding relation |
| R-B2 Project identity equivalence | Reproduced across both Projects, both reload later states, both movement later states; false on Standard-Control | Supported candidate-only relation |
| R-B3 CID-only global match | Current Project count 1, incomplete/Standard count 0; provides no active or scoped currentness binding | Unsafe; do not adopt |
| R-B4 Ground-Truth-assisted binding | Not used | Reject as Runtime relation |
| R-A1 outer-list-item sibling Project Name group | Unique and GT exact in both Projects and all required later states; absent in Standard-Control | Supported candidate-only relation |

R-B3 remains unsafe even where a count happens to be one. It cannot prove
active currentness, scoped containment, or source-internal equality, and prior
Discovery already established that global inventory is not a safe current
candidate source.

## Fail Closed Preservation

`CONFIRMED FALLBACK: NONE`

This Round did not use or propose global CID search, global Project Name search,
Header-only name success, Canonical-only CID success, Page URL fallback,
Ground Truth selection, route rewriting, or segment normalization.

The focused candidates preserve non-success for:

- active candidate count zero or more than one;
- missing `data-active`;
- unsupported active route;
- missing Active CID;
- scoped nested count zero or more than one, empty nested value, or internal
  CID mismatch;
- Browser/Active or Browser/Nested CID mismatch;
- missing or ambiguous independent Navigation Project Name;
- missing or ambiguous Header group/link; and
- Navigation/Header mismatch.

The naturally captured incomplete snapshots exercised the zero/missing cases
without silent success. No Production state or error mapping was created.

## Ground Truth Separation

Runtime candidate relations and Technical Spike oracle comparisons were kept
separate:

```text
Runtime candidate relation:
Browser CID === Active CID === scoped Nested CID
Navigation Name === Header Name === Header Link text

Technical Spike oracle comparison:
resolved candidate === independent pre-established Ground Truth
```

Expected CIDs and Project Names were not used to enumerate, select, repair, or
approve Runtime candidates. Conversation Title was used only for a safe fixture
binding boolean. Standard-Control received no Project CID or Project Name
oracle. Raw Ground Truth and candidate values remained Runtime-only.

## Reconciliation Readiness

### Track B

`ACTIVE_BINDING_RECONCILIATION_READY: YES`

R-B2 is supported as a reconciliation candidate because it:

- works for Project-A and Project-B;
- reproduces after both reloads and in both directed-movement later states;
- is false for Standard-Control;
- retains independent Browser/Active/Nested mismatch checks;
- requires no fallback; and
- uses no Ground Truth during Runtime selection.

### Track A

`NAV_NAME_RECONCILIATION_READY: YES`

R-A1 is supported as a reconciliation candidate because it:

- enumerates Navigation Project Name independently of Header value;
- yields exactly one GT-exact candidate in each Project fixture;
- reproduces after both reloads and both directed movements;
- yields no candidate and no Header analogue in Standard-Control; and
- keeps Navigation/Header mismatch independently observable.

### Overall

`RECONCILIATION_DECISION_READY: YES`

Readiness does not apply either relation to the historical Candidate Decision.
A separate reviewed Candidate Decision Reconciliation is still required before
Minimal PoC v2.

## Requirement / ADR / Risk Impact

- **FR-004 / ADR-014 / AT-004 / RISK-029**: R-B2 provides observed material
  for candidate-only active binding when non-CID path representations differ,
  while preserving distinct Browser/Active/Nested equality checks. It does not
  infer or construct a URL.
- **FR-006 / AT-002 / RISK-003**: the active-conversation-bound Navigation
  structure plus separate Header structure reproduced across both Projects and
  did not reproduce in Standard-Control. Broad semantic markers remain
  insufficient by themselves.
- **FR-011 / ADR-006 / AT-010 / RISK-004**: missing Navigation, Header, active,
  or nested material remained non-success in all early snapshots. No fallback
  was introduced.
- Requirement, ADR, Acceptance Test, Risk Register, Backlog, and Production
  semantics are unchanged.

## Repository / Security Check

- `git diff --check`: PASS.
- New Evidence direct trailing-whitespace scan: PASS (0 findings).
- Raw Project Name / fixture Title scan: PASS (0 findings).
- Raw Conversation ID / UUID-like fixture literal scan: PASS (0 findings).
- Raw URL / pathname / href / Canonical value scan: PASS (0 findings).
- Exact comparison against 10 Runtime-held fixture/name/CID/location values:
  PASS (0 matches; raw values not emitted).
- Raw Conversation body / HTML / DOM dump scan: PASS (0 findings).
- Credential / cookie / token / authorization-value scan: PASS (0 findings).
- Line endings: LF; no mixed line-ending condition found.
- Changed scope: this new Focused Reconciliation Discovery Evidence only.
- Repository status also contains the pre-existing untracked Failure Triage
  Evidence; it was present before this Round and was not modified here.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001 assets, prior
  TASK-002 Evidence, Candidate Decision, Minimal PoC v1, and its self-test:
  unchanged.
- No diagnostic helper was persisted.
- Production implementation: none.

## Status After Focused Discovery

```text
TASK-002 Discovery: COMPLETE
TASK-002 Candidate Decision: COMPLETE
TASK-002 Minimal PoC v1: COMPLETE / FAIL
TASK-002 Minimal PoC Failure Triage: COMPLETE
TASK-002 Focused Reconciliation Discovery: COMPLETE

TV-004 Verdict: NOT SET
TV-003 Project Coverage Verdict: NOT SET
TV-003 Overall Final Verdict: PENDING

TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

Candidate Decision remains historical and unchanged.

## Recommended Next Action

Proceed to **TASK-002 Candidate Decision Reconciliation**. Review R-B2 and R-A1
against the existing Fail Closed and cross-source contracts before authorizing
any Minimal PoC v2. Do not start PoC v2 or Final Review from this Round.
