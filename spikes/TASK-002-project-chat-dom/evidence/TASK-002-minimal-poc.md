# TASK-002 Minimal PoC

## Status

- Review date: 2026-08-16
- PoC revision: `task002-project-chat-minimal-poc-v1`
- Candidate Decision conformance: IMPLEMENTED WITHOUT CONTRACT CHANGE
- POC_IMPLEMENTATION_BLOCKED: NO
- MINIMAL_POC_RESULT: FAIL
- Failure finding: `PROJECT_A_ACTIVE_NAVIGATION_REQUIRED_MATERIAL_MISSING`
- Security finding: `RAW_RUNTIME_METADATA_EXPOSED_BY_STALE_TAB_DIAGNOSTIC`
- Confirmed fallback: NONE
- TV-004 Verdict: NOT SET
- TV-003 Project Coverage Verdict: NOT SET
- TV-003 Overall Final Verdict: PENDING

The pure Candidate Decision contract was implementable. The required Project-A
initial live case did not resolve in two explicit snapshots, so the Minimal PoC
PASS criteria were not met. No selector, candidate family, or fallback was
changed to adapt to the result.

## Implementation Scope

- Phase 0-only browser/page snapshot capture
- Observed Project Conversation Route Shape v1 parser
- Pure Track A evaluator for Project source detection and Project Name
- Pure Track B evaluator for Project Conversation ID currentness
- Independent Source Type, Project Name, and Conversation ID Ground Truth
  comparators
- Combined Technical Spike case evaluator
- Evidence-safe summary generator
- DOM-independent synthetic self-test
- Read-only live checks for the designated Project-A, Project-B, and
  Standard-Control tabs
- Automated settled detection: NOT IMPLEMENTED
- Production implementation: none

The implementation is limited to `spikes/TASK-002-project-chat-dom/poc/`.

## PoC Contract

### Route boundary

Observed Project Conversation Route Shape v1 requires a present and parseable
URL, exactly four non-empty pathname segments, a non-empty candidate at
zero-based position 3, and no query or fragment. Extra segments are rejected.
Query and fragment are never identifier sources.

The parser does not require a 36-character value, UUID semantics, UUID
version/variant, lowercase hexadecimal characters, fixed hyphen positions, or
any Standard Chat route literal.

### Track A

Track A resolves only when all approved current-bound Navigation and Header
invariants hold in the same snapshot. It requires exactly one direct complete
current-route navigation anchor, empty-valued `data-active` attribute presence,
exactly one non-empty Navigation Project Name group in the same list-item,
exactly one non-empty Header Project Name group, exactly one non-empty contained
Header Project link, and equality across the three name values.

Broad Project-token markers, document title, and unscoped/global Project Name
text do not participate in success. `resolvedProjectName` and Source Type
`Project` are returned only for `RESOLVED_CURRENT`.

### Track B

The browser-host current-tab URL is a harness input separate from page capture.
Page route APIs are required consistency surfaces and are not fallbacks. Track B
requires browser/page whole-route equality, pathname equality, exactly one
current-route navigation anchor with the supported `data-active` representation,
exactly one non-empty scoped nested identifier, exactly one supported canonical,
and identifier equality across Primary, Active, Nested, and Canonical surfaces.

Canonical is a required cross-check only. `og:url`, global nested metadata,
and unobserved standalone metadata do not participate in success. `resolvedCid`
is returned only for `RESOLVED_CURRENT`.

### Combined acceptance

Combined Runtime success requires Track A and Track B to both be
`RESOLVED_CURRENT` in the same snapshot. Technical Spike case PASS additionally
requires independent exact Ground Truth matches for Source Type, Project Name,
and Conversation ID. Neither Track may compensate for the other.

## Static / Self-Test Result

| Check | Result |
|---|---|
| PoC `node --check` | PASS |
| Self-test `node --check` | PASS |
| Pure self-test execution | PASS |
| Assertion groups | 64 |

The self-test covers the approved positive, Track A Fail Closed, Track B Fail
Closed, combined-track, Ground Truth separation, invalid Ground Truth, and
no-repair categories. A non-UUID, non-36-character synthetic identifier resolves
when the route shape and all required source equalities are valid. All test data
is synthetic.

## Project-A Result

The designated fixture binding was confirmed without persisting its identifying
metadata. Two explicit snapshots were evaluated with the same unchanged PoC.

| Observation | First snapshot | Confirmation snapshot |
|---|---:|---:|
| Track A state | UNRESOLVED | UNRESOLVED |
| Current-route anchor count | 0 | 0 |
| Scoped Navigation Project Name count | 0 | 0 |
| Header Project Name group count | 1 | 1 |
| Header Project link count | 1 | 1 |
| Track B state | UNRESOLVED | UNRESOLVED |
| Host/page/canonical route consistency | true | true |
| Supported four-segment route | true | true |
| Active anchor count | 0 | 0 |
| Scoped nested identifier count | 0 | 0 |
| Canonical count | 1 | 1 |
| Combined Runtime success | false | false |
| Technical Spike case PASS | false | false |

The observed segment-length pattern was `[1, 74, 1, 36]`; this remains a
diagnostic only and was accepted by the route parser. The failure was caused by
missing required current-bound Navigation/Active material, not by an imported
identifier format rule. No inventory fallback or first-navigation workaround
was introduced.

Result: FAIL for the required Project-A initial live case.

## Project-B Result

The designated fixture binding was confirmed without persisting its identifying
metadata.

| Material | Result |
|---|---|
| Track A | RESOLVED_CURRENT |
| Current-route anchor count | 1 |
| `data-active` present / empty / non-empty | 1 / 1 / 0 |
| Navigation Project Name count | 1 |
| Header Project Name group / link count | 1 / 1 |
| Navigation / Header / Link equality | true |
| Track B | RESOLVED_CURRENT |
| Browser/page route consistency | true |
| Active / Nested / Primary equality | true |
| Canonical count and equality | 1 / true |
| Combined Runtime success | true |
| Source Type Ground Truth exact | true |
| Project Name Ground Truth exact | true |
| Conversation ID Ground Truth exact | true |
| Technical Spike case PASS | true |

The observed segment-length pattern was `[1, 36, 1, 36]` and remains diagnostic
only.

Result: PASS for the Project-B initial live case.

## Standard-Control Negative Result

The designated Standard fixture binding was confirmed without persisting its
identifying metadata.

| Material | Result |
|---|---|
| Track A | UNRESOLVED |
| Successful Project Name returned | false |
| Source Type resolved as Project | false |
| Project route parser | UNSUPPORTED_ROUTE |
| Combined Project Runtime success | false |

The negative control did not false-positive as Project. Shared active/nested
navigation structure alone was insufficient because the Project route and
Project-bound name structures did not resolve.

## Reload Results

- Project-A reload: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE
- Project-B reload: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE

## A → B / B → A Results

- Project-A → Project-B: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE
- Project-B → Project-A: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE

## Back / Forward Results

- Back resulting state: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE
- Forward resulting state: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE

## Direct Load Result

- Direct Load: NOT EXECUTED AFTER REQUIRED INITIAL CASE FAILURE

Continuing the operation matrix could not make the Minimal PoC meet its required
Project-A initial criterion and risked adapting the approved contract during a
contradictory run. The remaining live cases are therefore not claimed as PASS or
FAIL.

## Naturally Captured Fail Closed Results

The two Project-A snapshots were incomplete required-source states:

- host/page/canonical route material was current and mutually consistent;
- Header Project material was present;
- current-bound Navigation Project Name material was absent;
- Active Conversation anchor and scoped nested identifier were absent;
- Track A and Track B both returned `UNRESOLVED`;
- no Project Name or Conversation ID was returned as successfully resolved;
- combined Runtime success was false;
- confirmed fallback remained NONE.

This demonstrates Fail Closed behavior for the observed partial state, but does
not satisfy the required Project-A current-state success criterion.

## Ground Truth Separation Result

- Project-A/B Ground Truth was supplied independently before this PoC run and
  remained Runtime-only.
- Project-B comparisons were exact for Source Type, Project Name, and
  Conversation ID.
- Project-A candidate output did not repair or replace Ground Truth; unresolved
  runtime state produced no successful exact comparison.
- Pure self-tests confirm that internally consistent wrong Project Name or wrong
  Conversation ID values cannot produce Technical Spike PASS.
- Invalid Ground Truth produces `GROUND_TRUTH_INPUT_ERROR` rather than a product
  validation result.

## Known Limitations

- The required live matrix stopped after the reproducible Project-A initial
  failure; reload, movement, Back/Forward, and Direct Load were not evaluated in
  this PoC run.
- No automated settled detection, polling, retry, timeout, debounce, fixed-delay
  contract, or MutationObserver waiting algorithm was implemented.
- The PoC evaluates the current ChatGPT UI and the designated fixtures only.
- Project route character-level identifier format remains deliberately
  unspecified.
- Production selectors, parser/validator, dispatch, error mapping, fallback
  chain, and waiting behavior remain undecided and unimplemented.
- Browser tooling returned a stale-tab diagnostic containing raw runtime
  metadata before the live tabs were rebound. The values were not copied into
  repository files or this Evidence, but the run did not satisfy the intended
  no-raw-runtime-log boundary.

## Requirement / ADR / Risk Impact

- FR-004 / ADR-014: the independent browser-host input and page-route consistency
  contract was implemented; it resolved for Project-B and remained current for
  Project-A, but was insufficient when required active navigation material was
  missing.
- FR-006 / AT-002: the combined structural Project detector avoided the
  Standard-Control false positive and resolved Project-B, but Project-A did not
  resolve in this run.
- FR-011 / ADR-006: required missing metadata failed closed with no fallback.
- AT-004: cross-surface mismatch/missing conditions are detectable in pure tests;
  Production error mapping is not implemented.
- AT-010: missing/ambiguous/inconsistent Project Name paths fail closed in pure
  tests; Production error mapping is not implemented.
- RISK-003 / RISK-004 / RISK-029: Project-B supports technical feasibility, while
  the Project-A contradiction and browser-tool privacy finding leave these risks
  open for review. No risk is marked accepted or eliminated.

## Repository / Security Check

- `git diff --check`: PASS
- New-file direct trailing-whitespace scan: PASS (0 findings)
- Raw ChatGPT URL scan: PASS (0 findings)
- Raw Conversation ID / UUID-like literal scan: PASS (0 findings)
- Raw Project Name / fixture Title scan: PASS (0 findings)
- Raw pathname / href / canonical persistence review: PASS
- Raw body / HTML / DOM dump scan: PASS (0 findings)
- Credential / cookie / token / authorization-value scan: PASS (0 findings)
- The only URL literal in the new files is a clearly synthetic self-test origin.
- Line endings: LF for all three new files; no mixed CRLF/LF condition found.
- Changed scope: the new PoC module, its new self-test, and this new Evidence
  file only.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001 assets, existing
  TASK-002 Discovery Evidence, and Candidate Decision Evidence: unchanged.
- The stale-tab diagnostic privacy finding described above was limited to the
  browser tool output; repository scans confirmed that its raw metadata was not
  persisted in the new files.
- Production implementation: none

## Status After Minimal PoC

- TASK-002 Discovery: COMPLETE
- TASK-002 Candidate Decision: COMPLETE
- TASK-002 Minimal PoC: COMPLETE / FAIL
- TV-004 Ground Truth: PRE-ESTABLISHED
- TV-004 Candidate Decision: COMPLETE
- TV-004 Minimal PoC: COMPLETE / FAIL
- TV-004 Verdict: NOT SET
- TV-003 Project CID Ground Truth: ESTABLISHED
- TV-003 Project Coverage Candidate Decision: COMPLETE
- TV-003 Project Coverage Minimal PoC: COMPLETE / FAIL
- TV-003 Project Coverage Verdict: NOT SET
- TV-003 Overall Final Verdict: PENDING
- TASK-002 Final Exit: NOT SET
- Phase 0 Exit: NOT MET
- Production implementation: none

Recommended next action: review the Project-A required
ActiveConversationNavigation/Navigation binding contradiction and the
privacy-safe Chrome harness diagnostic boundary before deciding whether focused
Discovery or Candidate Decision reconciliation is required. Do not start Final
Review from this failed Minimal PoC result.
