# TASK-002 Minimal PoC v2

## Status

- Date: 2026-08-16
- Scope: Phase 0 Minimal PoC v2 only
- Effective Candidate Decision: v2
- Candidate Decision Reconciliation: COMPLETE
- `PRIVACY_SAFE_HARNESS_V2: PASS`
- `RAW_RUNTIME_OUTPUT_RISK_V2: CONTROLLED`
- `MINIMAL_POC_V2_RESULT: PASS`
- `CONFIRMED FALLBACK: NONE`
- TV-004 Verdict: NOT SET
- TV-003 Project Coverage Verdict: NOT SET
- TV-003 Overall Final Verdict: PENDING
- TASK-002 Final Exit: NOT SET
- Phase 0 Exit: NOT MET
- Production implementation: none

Historical Candidate Decision v1, Minimal PoC v1, and its FAIL result remain
unchanged. This Evidence records only implementation and validation of the
reconciled Phase 0 contract.

## Effective Candidate Decision

The PoC implements the effective v2 Decision from
`TASK-002-candidate-decision-reconciliation.md`:

- Browser Host URL is the Track B Primary input and is supplied outside the
  page capture.
- Browser, page URL APIs, pathname, and Canonical form the required route
  layer.
- Active Navigation uses R-B2 candidate-only Project identity equivalence.
- Browser/Active whole-route equality is diagnostic R-B1 material only.
- scoped Nested CID and Canonical remain required cross-checks.
- Track A uses R-A1 active-conversation local sibling enumeration without
  Header, Ground Truth, Title, CID, or global-text selection.
- Header Name and contained Header Link are captured independently and remain
  required cross-checks.
- Track A and Track B must both resolve in the same snapshot.
- Ground Truth is compared only after Runtime resolution.
- no fallback, repair, normalization, waiting algorithm, or Production error
  mapping is implemented.

## Implementation Scope

Created Phase 0-only files:

- `spikes/TASK-002-project-chat-dom/poc/task002-project-chat-poc-v2.mjs`
- `spikes/TASK-002-project-chat-dom/poc/task002-project-chat-poc-v2.selftest.mjs`

The implementation separates these concerns inside one safe execution
boundary:

1. raw browser/page capture;
2. shared candidate-only Active Navigation enumeration;
3. Track A evaluation;
4. Track B evaluation;
5. post-resolution Ground Truth comparison;
6. combined Technical Spike evaluation; and
7. Evidence-safe summary generation.

It is not a Production Adapter, selector contract, route grammar, fallback
chain, or settled-state algorithm.

## Privacy Boundary Implementation

The live entry point exposes only an Evidence-safe summary or a fixed safe
error code. Raw capture, route parser results, resolved values, Ground Truth,
and browser exception text cannot cross that entry point.

```text
raw capture
  -> internal evaluation
  -> internal Ground Truth comparison
  -> Evidence-safe summary
  -> harness output
```

The public live path does not return raw Browser URL, page URL, pathname,
anchor href, Canonical, Conversation ID, Project Name, fixture Title, DOM,
HTML, Conversation body, or raw Ground Truth. Browser errors are reduced to a
fixed safe code without returning exception text.

Self-tests also verified that serialized safe output contains none of its raw
synthetic URL, Project Name, or CID inputs.

## Static / Self-Test Result

| Check | Result |
|---|---|
| `node --check` PoC v2 | PASS |
| `node --check` self-test v2 | PASS |
| pure self-test execution | PASS |
| Assertion groups | 81 |
| Real fixture values in self-test | none |

The matrix covers the required positive, Track A, Track B, combined, Ground
Truth, privacy, and v2 reconciliation categories. Candidate cardinalities are
measured before agreement filters.

## Synthetic Reconciliation Cases

| Case | Expected protection | Actual | Result |
|---|---|---|---|
| arbitrary non-UUID and non-36-character CID | supported when all v1 route-shape and source equalities hold | Track B and case resolved | PASS |
| Browser/Active non-CID pathname differs | R-B1 false; R-B2 true; Track B may resolve | reproduced synthetically | PASS |
| Canonical/Active whole route differs | diagnostic difference only; required CID equalities hold | reproduced synthetically | PASS |
| two Active candidates, only one agreeing | cardinality measured first | AMBIGUOUS | PASS |
| two R-A1 siblings, only one agreeing | cardinality measured first | AMBIGUOUS | PASS |
| Navigation/Header mismatch | two independently captured values reach evaluator | INCONSISTENT | PASS |
| Runtime-consistent wrong Project Name | Runtime may resolve; GT comparison fails | case PASS=false | PASS |
| Runtime-consistent wrong CID | Runtime may resolve; GT comparison fails | case PASS=false | PASS |
| invalid or empty Ground Truth | input error, not TV failure | fixed `GROUND_TRUTH_INPUT_ERROR` | PASS |
| Ground Truth mutation | prohibited | input unchanged | PASS |

## Project-A Initial

| Field | Actual | Result |
|---|---:|---|
| Active candidate count | 1 | PASS |
| R-A1 candidate count | 1 | PASS |
| Header group / link counts | 1 / 1 | PASS |
| Navigation / Header / Link equality | true | PASS |
| Route segment count | 4 | PASS |
| Diagnostic segment-length pattern | `[1, 36, 1, 36]` | observed only |
| CID candidate position | 3 | PASS |
| R-B1 whole-route equality | true | diagnostic |
| R-B2 identity equivalence | true | PASS |
| Browser/Page/Canonical route equality | true | PASS |
| Browser/Active/Nested/Canonical CID equality | true | PASS |
| Track A / Track B | `RESOLVED_CURRENT` / `RESOLVED_CURRENT` | PASS |
| Source Type / Project Name / CID GT exact | true / true / true | PASS |
| Combined Runtime / Technical Spike case | true / PASS | PASS |

Expected Project Name and CID lengths were 20 and 36 respectively. These are
diagnostics only and were not used as selection or format requirements.

## Project-B Initial

| Field | Actual | Result |
|---|---:|---|
| Active candidate count | 1 | PASS |
| R-A1 candidate count | 1 | PASS |
| Header group / link counts | 1 / 1 | PASS |
| Navigation / Header / Link equality | true | PASS |
| Route segment count | 4 | PASS |
| Diagnostic segment-length pattern | `[1, 36, 1, 36]` | observed only |
| CID candidate position | 3 | PASS |
| R-B1 whole-route equality | true | diagnostic |
| R-B2 identity equivalence | true | PASS |
| Browser/Page/Canonical route equality | true | PASS |
| Browser/Active/Nested/Canonical CID equality | true | PASS |
| Track A / Track B | `RESOLVED_CURRENT` / `RESOLVED_CURRENT` | PASS |
| Source Type / Project Name / CID GT exact | true / true / true | PASS |
| Combined Runtime / Technical Spike case | true / PASS | PASS |

Expected Project Name and CID lengths were 5 and 36 respectively. These are
diagnostics only and were not used as selection or format requirements.

## Standard-Control Negative

| Field | Actual | Result |
|---|---|---|
| Active candidate count | 1 | observation only |
| Project Route Shape v1 | unsupported | PASS |
| R-A1 candidate count | 0 | PASS |
| Header group / link counts | 0 / 0 | PASS |
| Track A | `UNSUPPORTED_ROUTE` | Fail Closed |
| Track B | `UNSUPPORTED_ROUTE` | Fail Closed |
| Combined Project Runtime | false | PASS |
| successful Source Type=`Project` | false | PASS |
| successful Project Name | false | PASS |
| negative-control case | PASS | PASS |

Broad Project-token markers were present in the negative control, but they did
not participate in success. Existing Standard Coverage status was not changed.

## Project-A Reload

- first two immediately available snapshots: fixed
  `FIXTURE_BINDING_ERROR`, `casePass=false`;
- later explicit snapshot: Track A and Track B `RESOLVED_CURRENT`;
- all candidate equalities and Ground Truth comparisons: true;
- final case: PASS.

## Project-B Reload

- first two immediately available snapshots: fixed
  `FIXTURE_BINDING_ERROR`, `casePass=false`;
- later explicit snapshot: Track A and Track B `RESOLVED_CURRENT`;
- all candidate equalities and Ground Truth comparisons: true;
- final case: PASS.

The fixed safe errors show that the live fixture identity had not yet become
available to the harness. They were not treated as Runtime success and did not
expose browser metadata.

## A -> B

- first two immediately available snapshots: fixed
  `FIXTURE_BINDING_ERROR`, `casePass=false`;
- later B snapshot: both Tracks `RESOLVED_CURRENT`;
- current Project Name and CID GT comparisons: exact;
- final case: PASS.

## B -> A

- first two immediately available snapshots: fixed
  `FIXTURE_BINDING_ERROR`, `casePass=false`;
- later A snapshot: both Tracks `RESOLVED_CURRENT`;
- current Project Name and CID GT comparisons: exact;
- final case: PASS.

## Back / Forward

| Operation | Earliest practical observation | Final result | Transient limitation |
|---|---|---|---|
| Back | already `RESOLVED_CURRENT` for target | PASS | intermediate state not observable in this PoC v2 run |
| Forward | fixed `FIXTURE_BINDING_ERROR`, non-success | PASS at later explicit observation | inner candidate transition was not sampled before fixture binding |

The browser operation API can return after substantial navigation work. No
claim is made that an unobserved intermediate state cannot occur.

## Direct Load

- used a Runtime-held known fixture location; no route was constructed;
- first two immediately available snapshots: fixed
  `FIXTURE_BINDING_ERROR`, `casePass=false`;
- later explicit snapshot: both Tracks `RESOLVED_CURRENT`;
- all required equality and GT comparisons: true;
- final case: PASS.

## Naturally Captured Fail Closed States

The naturally available incomplete reload, movement, Forward, and Direct Load
snapshots returned only a fixed `FIXTURE_BINDING_ERROR` and
`casePass=false`. No partial route, Header, Name, Active, Nested, or Canonical
material could be promoted to success through that gate.

No fixed sleep, polling loop, retry count, timeout, debounce,
MutationObserver, or automated settled-state algorithm was added. Later states
were separate explicit observations.

## Historical Pathname Mismatch Handling

`HISTORICAL_ACTIVE_PATH_MISMATCH: NOT OBSERVED IN THIS POC V2 RUN`

All live final states in this run had R-B1=true. This is not a failure. The
mandatory synthetic case reproduced the historical relationship with:

- Browser/Page/Canonical route layer mutually equal;
- Active non-CID pathname representation different;
- R-B1=false;
- R-B2=true;
- all required CID equalities true; and
- Track B and the combined Technical Spike case PASS.

The PoC does not normalize, rewrite, construct, or assign semantic meaning to
either route representation.

## Ground Truth Separation

- Source Type, Project Name, and CID Ground Truth were supplied separately from
  capture.
- Active and R-A1 enumeration occurred without Ground Truth.
- Header did not enumerate Navigation Name.
- Ground Truth was compared only after Runtime resolution.
- candidates did not generate, repair, or mutate expected values.
- raw Ground Truth remained Runtime-only.

`GROUND_TRUTH_SEPARATION: PASS`

## Fallback Result

`CONFIRMED FALLBACK: NONE`

No global CID, global Name, Header, Canonical, page URL, Ground Truth, route
normalization, or guessed fallback was implemented.

## Known Limitations

- two Project fixtures and one Standard negative control;
- authenticated Chrome on Windows, current ChatGPT UI, one primary viewport;
- sequential rather than atomic Browser/page/DOM capture;
- incomplete states may occur between explicit captures and remain unobserved;
- fixture-binding gating prevented deeper candidate classification in several
  earliest snapshots, while still preventing success;
- historical non-CID pathname mismatch did not recur live in this run;
- observed lengths remain diagnostic, not Project ID or route format rules;
- no Production selector, Adapter, parser, validator, fallback, error mapping,
  polling, retry, timeout, or settled algorithm;
- pure synthetic tests cover malformed, missing, duplicate, mismatch, and
  internally-consistent-wrong-value states not created in live DOM.

These limitations do not weaken the Minimal PoC v2 result and are not Final
Verdict decisions.

## Requirement / ADR / Risk Impact

- **FR-004 / ADR-014 / AT-004 / RISK-029**: Browser Host remains an
  independent required Primary; Browser/Page/Canonical route consistency and
  Browser/Active/Nested/Canonical CID equality passed. Mismatches fail closed.
- **FR-006 / AT-002 / RISK-003**: R-A1 plus the independently captured Header
  and Track B material resolved both Projects and did not classify the Standard
  control as Project.
- **FR-011 / ADR-006 / AT-010 / RISK-004**: required Project Name and CID
  material cannot be missing, ambiguous, or inconsistent; naturally incomplete
  states were non-success and no fallback exists.
- Requirement, ADR, Acceptance Test, Risk Register, Backlog, and Production
  semantics are unchanged.

## Repository / Security Check

- `git diff --check`: PASS
- direct trailing-whitespace scan of all new v2 files: PASS
- raw Project Name / fixture Title scan: PASS; no live values persisted
- raw Conversation ID / real UUID-like value scan: PASS; no live values
  persisted
- raw Browser URL / pathname / href / Canonical scan: PASS; no live values
  persisted
- raw DOM / HTML / Conversation body scan: PASS
- credential / cookie / token / authorization scan: PASS
- changed scope: PoC v2, self-test v2, and this Evidence only
- docs, AGENTS.md, src, Production, TASK-001 assets, historical TASK-002
  Evidence, Candidate Decision v1, Minimal PoC v1, v1 self-test, and effective
  Candidate Decision Reconciliation: unchanged
- Production implementation: none

## Status After Minimal PoC v2

```text
TASK-002 Discovery: COMPLETE
TASK-002 Candidate Decision v1: COMPLETE / HISTORICAL
TASK-002 Candidate Decision Reconciliation: COMPLETE
TASK-002 Effective Candidate Decision: v2

TASK-002 Minimal PoC v1: COMPLETE / FAIL
TASK-002 Minimal PoC v2: COMPLETE / PASS

TV-004 Candidate Decision: RECONCILED / v2
TV-004 Minimal PoC v2: COMPLETE / PASS
TV-004 Verdict: NOT SET

TV-003 Project Coverage Candidate Decision: RECONCILED / v2
TV-003 Project Coverage Minimal PoC v2: COMPLETE / PASS
TV-003 Project Coverage Verdict: NOT SET
TV-003 Overall Final Verdict: PENDING

TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

Proceed to **TASK-002 Final Review — TV-004 + TV-003 Project Coverage**.
Do not begin Final Review from this PoC Round.
