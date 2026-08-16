# TASK-002 Project Chat DOM Spike — Final Exit Review

## Status

- Review date: 2026-08-16
- Scope: TV-004, TV-003 Project Coverage, TV-003 Overall, and TASK-002
  Final Exit review only
- Additional Discovery or live observation: **NO**
- PoC or self-test change: **NO**
- Source-of-Truth change: **NO**
- Production implementation: none

Final status:

```text
TV-004 Final Verdict: PASS
TV-003 Standard Coverage Verdict: PASS
TV-003 Project Coverage Final Verdict: PASS
TV-003 Overall Final Verdict: PASS
TASK-002 Final Exit: PASS
TASK-002 Status: COMPLETE
Phase 0 Exit: NOT MET
Production implementation: none
```

## Review Basis

This review used only repository-current Source-of-Truth and existing
Evidence. It did not inspect Chrome or create new runtime observations.

Source-of-Truth reviewed:

- `docs/01_product-requirements.md`
- `docs/02_adr.md`
- `docs/03_risk-register.md`
- `docs/04_acceptance-tests.md`
- `docs/05_technical-validation-plan.md`
- `docs/06_development-backlog.md`

TASK-001 handoff reviewed:

- `TASK-001-final-exit-review.md`
- `TV-003-conversation-id-validation.md`

TASK-002 Evidence was reviewed in chronological order from Scope Planning and
Ground Truth preparation through Discovery Rounds 1–3, Candidate Decision v1,
Minimal PoC v1, Failure Triage, Focused Reconciliation Discovery, Candidate
Decision Reconciliation, and Minimal PoC v2. The PoC v2 implementation and
self-test were read as static references only.

The current Development Backlog was confirmed to assign TASK-002:

- Refs: `TV-003`, `TV-004`
- Risks: `RISK-003`, `RISK-004`, `RISK-029`
- Exit:
  - TV-004 Source detection and Project Name acquisition PASS
  - TV-003 Project Coverage PASS

No Backlog mismatch or Task-scope blocking conflict was found.

## Evidence Hierarchy

The review kept these layers separate:

1. current Formal Technical Validation criteria;
2. candidate-independent, pre-established Runtime Ground Truth;
3. Discovery Observed Facts;
4. the reconciled effective Candidate Decision v2;
5. Minimal PoC v2 pure self-tests;
6. Minimal PoC v2 authenticated live results; and
7. known limitations and deferred Production concerns.

Ground Truth was used as a post-resolution oracle. Discovery facts determined
candidate feasibility. The effective v2 Decision defined the Phase 0 contract,
and PoC v2 tested that contract. Limitations were assessed for relevance to the
existing Formal Pass wording and were not promoted to new criteria.

## Historical v1 / Reconciliation Integrity

Candidate Decision v1 remains the historical contract for Minimal PoC v1, and
`MINIMAL_POC_RESULT: FAIL` remains valid. The failure exposed two material v1
issues:

- exact Browser/Active whole-route equality excluded an otherwise consistent
  Project-A Active identity relation when non-CID path representations differed;
- live capture used Header Name to discover Navigation Name, preventing the two
  source groups from being independently observed on mismatch.

Failure Triage and Focused Reconciliation did not reinterpret v1 as PASS. They
provided additional Evidence for a separately reviewed Decision. Candidate
Decision Reconciliation then:

- superseded Active whole-route equality as an acceptance condition with R-B2
  Project Identity Equivalence;
- retained R-B1 whole-route equality as diagnostic only;
- adopted R-A1 candidate-only local Navigation Project Name enumeration;
- preserved Header as an independently captured required cross-check;
- preserved Browser/Page/Canonical route-layer equality, CID equality checks,
  Fail Closed, Ground Truth separation, and no fallback; and
- added the privacy-safe PoC harness entry requirement.

Minimal PoC v2 implemented this effective v2 Decision and passed. There is no
remaining material contradiction between the preserved historical v1 failure
and the reconciled v2 result.

## TV-004 Formal Criteria

Hypothesis:

> Project ChatをStandardと識別し、Project Nameを取得できる。

Formal Pass:

> 複数Project、reload、Project間移動で誤認なし。

The review did not add Production selectors, a general waiting algorithm,
future-UI durability, extra fixtures, or extra viewport coverage as new Formal
Pass conditions.

## TV-004 Evidence Matrix

| Formal material | Evidence | Result | Blocking gap |
|---|---|---|---|
| Multiple Projects | Project-A and Project-B are pre-established distinct Project fixtures with distinct Project Name Ground Truth; each initial v2 case resolved Track A and combined Project Runtime with exact Source Type and Name Ground Truth | PASS | none |
| Standard distinction | Standard-Control did not resolve Track A, combined Project Runtime, Source Type=`Project`, or a successful Project Name; broad semantic markers did not participate in success | PASS | none |
| Project-A reload | Later explicit state resolved the current Project Name and both Tracks with exact Ground Truth | PASS | none |
| Project-B reload | Later explicit state resolved the current Project Name and both Tracks with exact Ground Truth | PASS | none |
| A to B movement | Later Project-B state resolved its current Name and CID; the prior Project was not accepted as current | PASS | none |
| B to A movement | Later Project-A state resolved its current Name and CID; the prior Project was not accepted as current | PASS | none |
| Navigation Name integrity | R-A1 enumerated exactly one local Navigation candidate structurally, without Header, Ground Truth, Title, CID, or global-text selection | PASS | none |
| Header cross-check | Header Name and contained link were captured independently; Navigation Name, Header Name, and Header Link were equal in successful states | PASS | none |
| Ground Truth integrity | Project Name Ground Truth was compared only after Runtime resolution | PASS | none |
| Fail Closed | Missing, duplicate, empty, mismatch, broad-marker-only, unscoped/global-only, and Standard-like cases were non-success in pure tests; live incomplete states were not allowed to succeed | PASS | none |

The two Project fixtures meet the Formal criterion's plural Project coverage.
The two directed movements separately demonstrate current binding in both
directions. No prior Project value was returned as successful current metadata.

## TV-004 Known Limitations

| Limitation | Classification | Review |
|---|---|---|
| Two Project fixtures | NON-BLOCKING / DEFERRED | The Formal Pass requires multiple Projects; two distinct pre-established Projects were validated. Broader sampling was not specified. |
| One Standard negative fixture | NON-BLOCKING / DEFERRED | It directly tested the observed false-positive material; arbitrary additional negatives were not a Formal criterion. |
| One primary viewport | NON-BLOCKING / DEFERRED | No viewport matrix is part of TV-004 Formal Pass. |
| Current ChatGPT UI in authenticated Chrome on Windows | NON-BLOCKING / DEFERRED | This is a current-UI Technical Spike result; future UI drift remains a residual risk. |
| Sequential, non-atomic capture | NON-BLOCKING / DEFERRED | Required final/later states resolved consistently; partially observed states are not accepted. |
| Unobserved transient windows | NON-BLOCKING / DEFERRED | The review makes no claim that they cannot occur. Observed transients and pure tests support Fail Closed. |
| Fixture-binding gate masked candidate detail in several early v2 snapshots | NON-BLOCKING / DEFERRED | The gate prevented success. Candidate-level transient absence/staleness was already observed in Discovery Round 3, and pure tests cover missing, ambiguous, and mismatch states. |
| No automated settled/waiting algorithm | NON-BLOCKING / DEFERRED | TV-004 validates technical feasibility, not Production orchestration. |
| No Production selector or Project Adapter | NON-BLOCKING / DEFERRED | Production implementation is outside Phase 0 TASK-002 Exit. |
| No general completeness proof | BELONGS TO ANOTHER TASK | General completeness and settled scan behavior belong to TASK-003 / TV-005 / TV-006. |

No limitation is `BLOCKING FOR TV-004`.

## TV-004 Final Verdict

The existing Evidence demonstrates correct Project Source Type and complete
Project Name acquisition for two distinct Projects, both reloads, and movement
in both directions, while the Standard negative did not false-positive. The
effective v2 strategy preserves independent Navigation/Header observation,
post-resolution Ground Truth, Fail Closed, and no fallback.

`TV-004 Final Verdict: PASS`

## TV-003 Project Coverage Formal Criteria

Hypothesis:

> Current tab URL等からConversation IDを一意に取得・検証できる。

TV-003 Formal Pass:

> Standard / Projectで安定。

This section assesses the Project half only. Standard Coverage was already
finalized as PASS by TASK-001 Evidence.

## TV-003 Project Coverage Evidence Matrix

| Validation material | Evidence | Result | Blocking gap |
|---|---|---|---|
| Browser Host Primary | Browser current-tab URL remained a separately supplied, required Primary; missing host input was non-success and Page APIs were not fallback | PASS | none |
| Project-A initial | Supported Project Route Shape v1; one Active candidate; R-B2 true; one scoped Nested value; Browser/Page/Canonical route layer and Browser/Active/Nested/Canonical CID equalities true; independent CID Ground Truth exact; Track B resolved | PASS | none |
| Project-B initial | Same required Track B relationships and independent Ground Truth comparison resolved | PASS | none |
| Project-A reload | Later explicit state resolved Track B and exact current CID Ground Truth | PASS | none |
| Project-B reload | Later explicit state resolved Track B and exact current CID Ground Truth | PASS | none |
| A to B movement | Later Project-B state resolved the target current CID | PASS | none |
| B to A movement | Later Project-A state resolved the target current CID | PASS | none |
| Back | Resulting current Project state passed | PASS | none |
| Forward | Early fixture gate remained non-success; later resulting current Project state passed | PASS | none |
| Direct Load | Runtime-held known location was used without route construction; early fixture gate remained non-success and later current state passed | PASS | none |
| Route boundary | Project Route Shape v1 requires four non-empty segments, CID candidate at position 3, and no query or fragment; extra segments are unsupported | PASS | none |
| CID format boundary | Arbitrary non-UUID and non-fixed-length synthetic CID passed when required relations agreed; no character, case, hyphen, UUID, or length format was inferred | PASS | none |
| Mismatch detection | Pure tests cover Browser/Page, Active, Nested, and Canonical missing, ambiguous, unsupported, origin, route, and CID mismatch states | PASS | none |
| No fallback | Page, Canonical, global metadata, Ground Truth, normalization, and guessed route/ID paths cannot substitute for a missing required source | PASS | none |

Final/later state success is supported by actual authenticated live Evidence
for both initial fixtures and all listed stability operations. This review does
not claim that unobserved transient states cannot occur.

## TV-003 Historical Path Mismatch Reconciliation

The historical Project-A counterexample remains valid: Browser/Page/Canonical
and Active routes exposed different non-CID pathname representations while
origin and all required CID identities agreed.

The effective v2 contract handles this without normalization or guessed route
construction:

- R-B1 exact Browser/Active whole-route equality is diagnostic only;
- R-B2 is the required candidate-only current Active identity relation;
- Browser/Page/Canonical whole-route equality remains required within that
  route layer;
- Browser, Active, Nested, and Canonical CIDs must remain equal; and
- Canonical/Active whole-route equality is diagnostic, not acceptance.

Minimal PoC v2 did not reproduce the live mismatch. That does not invalidate
the historical observation and is not required by Formal TV-003 criteria. Its
pure synthetic test explicitly demonstrated R-B1=false, R-B2=true, all required
CID relations equal, and Track B resolved. No semantic meaning was assigned to
the differing non-CID segment and neither route was rewritten.

## TV-003 Project Coverage Known Limitations

| Limitation | Classification | Review |
|---|---|---|
| Two Project fixtures | NON-BLOCKING / DEFERRED | Both distinct Projects and all required stability operations passed; the Formal criterion does not specify a larger sample. |
| One primary viewport and current authenticated Chrome/Windows UI | NON-BLOCKING / DEFERRED | Current technical feasibility is established; future surface drift remains residual. |
| Sequential, non-atomic Browser/page/DOM capture | NON-BLOCKING / DEFERRED | Required sources must agree in one evaluated snapshot; partial snapshots are non-success. |
| Unobserved transient windows | NON-BLOCKING / DEFERRED | No absence claim is made; pure tests and earlier Discovery cover partial and inconsistent material. |
| Fixture-binding gate masked detailed early candidate state | NON-BLOCKING / DEFERRED | It prevented success rather than proving candidate-level behavior. Discovery Round 3 supplies candidate-level transient Evidence. |
| Historical pathname mismatch not reproduced live in v2 | NON-BLOCKING / DEFERRED | Historical Evidence remains valid and the effective relation is covered by a mandatory pure synthetic case. |
| Project Route Shape v1 is Phase 0-only | NON-BLOCKING / DEFERRED | It is an observed candidate boundary, not a Production route grammar. |
| No automated settled/waiting algorithm | NON-BLOCKING / DEFERRED | Production orchestration is not a TV-003 Formal Pass condition. |
| No Production selector, parser, validator, or error mapping | NON-BLOCKING / DEFERRED | Production implementation is outside this Technical Spike. |
| No general completeness proof | BELONGS TO ANOTHER TASK | Completeness and settled scan behavior belong to TASK-003 / TV-005 / TV-006. |

No limitation is `BLOCKING FOR TV-003 PROJECT COVERAGE`.

## TV-003 Project Coverage Final Verdict

The Browser Host Primary, required Page and Canonical route consistency,
candidate-only R-B2 Active identity, scoped Nested equality, independent
Ground Truth, all required stability final states, Fail Closed, and absence of
fallback together satisfy the Project portion of TV-003.

`TV-003 Project Coverage Final Verdict: PASS`

## TV-003 Standard + Project Overall Reconciliation

| Coverage | Authority | Final Verdict | Material contradiction |
|---|---|---|---|
| Standard | TASK-001 TV-003 Standard Coverage Final Review | PASS | none |
| Project | This Final Review, based on effective v2 Evidence | PASS | none |

The Technical Validation Plan's `Standard / Projectで安定` condition is now
covered by both finalized scopes. Production implementation, general waiting,
TASK-003 completeness, and future UI drift are separate concerns and do not
keep this completed validation PENDING.

## TV-003 Overall Final Verdict

`TV-003 Overall Final Verdict: PASS`

## Fail Closed Review

Pure and live Evidence have different roles and are stated separately.

### Pure self-test Evidence

The 81 assertion groups passed. Coverage includes:

- Browser Host and Page URL missing, malformed, unsupported, and mismatched;
- Active count zero or multiple, with cardinality measured before CID agreement;
- indirect, fragment-only, missing or unexpected `data-active`, unsupported
  route, origin mismatch, empty CID, and Primary/Active mismatch;
- scoped Nested count zero or multiple, empty value, and CID mismatch;
- Canonical count zero or multiple, malformed/unsupported route, whole-route
  mismatch within the Browser/Page/Canonical layer, and CID mismatches;
- R-A1 local scope, anchor branch, candidate count, structure, empty value,
  Header, link, Navigation/Header, and Header/Link failures;
- Standard-like and broad-marker-only negative structures;
- neither Track substituting for the other;
- internally consistent but Ground-Truth-wrong Name or CID; and
- invalid Ground Truth input and non-mutation.

No global value, Page URL, Header, Canonical, Ground Truth, or normalization
fallback could turn a missing required source into success.

### Authenticated live Evidence

- All required initial and final/later Project states passed.
- Standard-Control did not false-positive.
- Several early v2 snapshots stopped at fixed `FIXTURE_BINDING_ERROR` and
  `casePass=false`; they did not allow success before fixture binding.
- Those fixture-gated snapshots did not directly exercise every Track A/B
  candidate evaluator, and this review does not claim otherwise.
- Discovery Round 3 separately observed candidate-level transient missing and
  stale material; those states were not treated as established current state.

`CONFIRMED FALLBACK: NONE`

## Ground Truth Separation

Project Source Type, Project Name, and CID Ground Truth were fixed before
candidate observation and remained Runtime-only. Runtime selection did not use
Ground Truth to enumerate Active candidates, choose R-A1 branches, select
Navigation Name, repair metadata, normalize routes, or approve unresolved
states.

The Technical Spike comparison occurred only after Runtime Track resolution.
Pure tests confirmed that internally consistent but wrong candidate values may
resolve Runtime yet cannot make the Technical Spike case pass, invalid Ground
Truth produces a fixed input error, and candidate evaluation does not mutate
Ground Truth.

`GROUND_TRUTH_SEPARATION: PASS`

## Privacy Boundary Review

Static reference review and Minimal PoC v2 Evidence support this boundary:

```text
raw capture
-> internal evaluation
-> internal Ground Truth comparison
-> Evidence-safe summary
-> safe summary or fixed safe error only
```

The v2 module exposes one execution boundary whose returned summary contains
only safe version/state labels, counts, lengths, booleans, violation codes,
Ground Truth equality booleans, and fixed safe error codes. Raw parser, capture,
resolved candidate, and Ground Truth objects remain inside the invocation.
Exception text is not returned. Synthetic privacy tests confirmed serialized
safe output omitted raw inputs.

This supports a Phase 0 PoC harness safety conclusion only; it is not a
Production logging verdict.

```text
PRIVACY_SAFE_HARNESS_V2: PASS
RAW_RUNTIME_OUTPUT_RISK_V2: CONTROLLED
```

## Acceptance Test Traceability

Production Acceptance Tests were not executed in TASK-002.

| Acceptance Test | TASK-002 Evidence impact | Status wording |
|---|---|---|
| AT-002 | Project Source Type and Project Name resolved across two Projects, reload, movement, and a Standard negative | technical feasibility supported |
| AT-004 | Browser Primary and Page/Active/Nested/Canonical consistency plus mismatch Fail Closed were demonstrated | technical feasibility supported |
| AT-010 | Missing, ambiguous, empty, and inconsistent Project Name material remains non-success with no fallback | technical feasibility supported |

No Production Acceptance Test is declared PASS by this review.

## Requirement / ADR Impact

- FR-004: technical feasibility is supported for current browser-tab URL as a
  required Primary with CID and route consistency checks.
- FR-006: technical feasibility is supported for distinguishing Project Chat
  from the Standard negative through the combined Track A/Track B contract.
- FR-011: technical feasibility is supported for required Project Name, CID,
  and URL metadata with missing required metadata remaining non-success.
- ADR-006: the Phase 0 contract remains Fail Closed; no silent fallback was
  confirmed.
- ADR-014: the current Conversation identity is validated without guessed URL
  construction or route normalization.

Requirement semantics and ADRs are unchanged. This review does not establish a
Production Adapter, selector, parser, validator, error mapping, or waiting
algorithm.

## Risk Status

### RISK-003 — Project Chat DOM structure differs

TASK-002 establishes a current-UI Phase 0 strategy using Project-specific R-A1
Navigation structure, an independent Header cross-check, and required Track B
currentness. The Standard negative did not satisfy the combined strategy.
Future DOM and structural drift remains a residual risk; the risk is not
eliminated or globally accepted.

### RISK-004 — Project Name acquisition instability

The observed UI supports independent R-A1 Navigation acquisition, Header/Link
cross-checks, exact Ground Truth for two Projects, reload, and bidirectional
movement. Future DOM drift and Production orchestration remain residual. The
risk is not eliminated or globally accepted.

### RISK-029 — Conversation ID acquisition breakage

TV-003 Standard Coverage PASS and this Project Coverage PASS establish the
current-UI technical strategy across both scopes. The Project strategy requires
Browser/Page/Canonical route consistency and Browser/Active/Nested/Canonical
CID equality under R-B2. Future UI, route, source-availability, and format drift
remain residual. The risk is not eliminated or globally accepted.

Risk acceptance and global Phase 0 risk closure are outside this Task.

## TASK-002 Exit Matrix

| TASK-002 Exit Component | Validation Evidence | Verdict | Blocking Gap |
|---|---|---|---|
| Source detection and Project Name acquisition | TV-004 | PASS | none |
| Project Conversation ID acquisition and validation | TV-003 Project Coverage | PASS | none |

This matrix maps directly to the repository-current TASK-002 Exit wording. No
Production or TASK-003 condition was added.

## TASK-002 Final Exit Verdict

Both Backlog Exit components are PASS and no Task-specific material
contradiction remains.

```text
TASK-002 Final Exit: PASS
TASK-002 Status: COMPLETE
```

## Deferred Scope

The following remain outside TASK-002 completion:

- long-conversation completeness, scan completion, and settled loading under
  TASK-003 / TV-005 / TV-006;
- branch, regenerate, and edited-message behavior under TASK-004;
- ContentBlock and rich UI classification under TASK-005;
- Production Project/Standard adapters, selectors, parser, validator, error
  mapping, dispatch, fallback chain, and waiting orchestration;
- additional viewport, fixture, and future-UI robustness coverage; and
- remaining Phase 0 Required PASS validations.

TASK-003 and later Task statuses are unchanged. TASK-002 completion is a
Technical Spike result and does not authorize Phase 1 or imply Production
requirement implementation.

## Repository / Security Check

- `git diff --check`: PASS.
- New Final Review Evidence direct trailing-whitespace scan: PASS.
- Raw Project Name / fixture Title scan: PASS; no raw values persisted.
- Raw Conversation ID / real UUID-like fixture literal scan: PASS; no raw
  values persisted.
- Raw Browser URL / pathname / href / Canonical value scan: PASS; no raw values
  persisted.
- Raw DOM / HTML / Conversation body scan: PASS.
- Credential / cookie / token / authorization-value scan: PASS.
- Changed scope: this new Final Review Evidence only.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001 assets, all TASK-002
  historical Evidence, both Candidate Decisions, both PoCs, and both self-tests:
  unchanged from the start of this Review.
- Production implementation: none.

## Handoff

```text
TV-001 Final Verdict: PASS
TV-002 Final Verdict: PASS

TV-003 Standard Coverage Verdict: PASS
TV-003 Project Coverage Final Verdict: PASS
TV-003 Overall Final Verdict: PASS

TV-004 Final Verdict: PASS

TASK-001 Final Exit: PASS / COMPLETE
TASK-002 Final Exit: PASS / COMPLETE

Phase 0 Exit: NOT MET
Production implementation: none
TASK-003+: not changed
```

Recommended Next Action:

`TASK-003 Long Conversation / Completeness Spike`

Do not start TASK-003 from this Final Review Round.
