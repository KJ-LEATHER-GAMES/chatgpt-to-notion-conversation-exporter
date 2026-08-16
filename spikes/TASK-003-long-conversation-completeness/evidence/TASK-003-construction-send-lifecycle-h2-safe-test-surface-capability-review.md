# TASK-003 Construction Send Lifecycle Characterization — H2 Safe Test Surface Capability Review

## Status

- Scope: static H2 safe test-surface capability review only
- Browser connection or live probe: none
- Surface creation or navigation: none
- Script execution, DOM initialization, or observer arm: none
- User action request: none
- Characterization C1 / Long-100 / TV-005 / TV-006: not started
- Historical Evidence modified: false

```text
S1_FAILURE_SCOPE: NAVIGATION_ONLY
BROWSER_POLICY_BLOCK_CLASS: SYNTHETIC_NAVIGATION_DISALLOWED
H2_SAFE_TEST_SURFACE_CANDIDATE: NONE_ESTABLISHED
H2_SAFE_SURFACE_MICRO_PROBE_REQUIRED: NO
H2_SAFE_SURFACE_MICRO_PROBE_PHASE: NOT_APPLICABLE
```

## Review Basis

This review uses repository-current Source-of-Truth documents and chronological TASK-003 Evidence through the aborted H2 Observer Continuity Mechanism Characterization.

The current official browser documentation and the already-read Chrome control capability contract were reviewed statically. The relevant documented Chrome control primitives are limited to browser/tab management, navigation, interaction with an existing rendered page, read-only page-scope evaluation, exact agent-tab handoff marking, and tab cleanup. The contract does not expose a tool-native synthetic/sandbox document factory or a standard arbitrary event-observer installation primitive.

No capability gap was filled by experiment. Unknown capability remains `NOT_ESTABLISHED`.

## Historical H2 Characterization Integrity

The historical H2 run remains unchanged:

```text
H2_DESIGN_FEASIBILITY: SUPPORTED
H2_RUNTIME_CAPABILITY: NOT_ESTABLISHED
H2_TEST_SURFACE: BLOCKED
H2_MECHANISM_CHARACTERIZATION: ABORTED
```

Historical operation facts retained:

- test-surface creation attempt: 1;
- agent-owned blank tab creation: reached;
- attempted synthetic-document navigation: policy blocked;
- usable test document: not established;
- observer arm: 0;
- user action: 0;
- Operation B: not reached; and
- blank-tab cleanup: PASS.

This review does not reinterpret an untested capability as failed or successful.

## Historical Failure Scope

The policy block occurred at the attempted synthetic-document navigation boundary after an agent-owned blank tab handle had been created.

It directly establishes only:

- blank-tab creation was available; and
- the specific synthetic-document navigation class was rejected by browser policy.

It does not directly establish whether the blank document could support:

- mutation-capable script execution;
- DOM initialization;
- event-listener installation;
- a user-visible harmless target;
- cross-operation document/JavaScript-context survival;
- observer/buffer survival; or
- later exact context verification.

Those phases were not reached.

```text
S1_FAILURE_SCOPE: NAVIGATION_ONLY
```

`NAVIGATION_ONLY` limits the observed failure scope. It does not authorize a different navigation encoding or imply that an in-place strategy is supported.

## Browser-policy Classification

The highest supported safe classification is:

```text
BROWSER_POLICY_BLOCK_CLASS: SYNTHETIC_NAVIGATION_DISALLOWED
```

The Evidence does not justify the broader claims that all arbitrary navigation, every non-network document, all synthetic surfaces, or all page scripting are unsupported. No policy internals or raw rejected value are retained.

The policy response also prohibited workaround, indirect execution, alternate browser surfaces, or policy circumvention for the rejected operation. This review honors that boundary.

## S1 Definition Reconciliation

S1 is a capability relation, not a navigation format. It requires a surface that is simultaneously:

- non-application;
- non-personal;
- disposable;
- harmless and manually interactable;
- observer-capable;
- exactly bindable;
- persistent enough for the Operation A/B boundary; and
- safely cleanable.

Synthetic-document navigation was one attempted implementation of S1. Its policy block does not collapse the S1 definition into that implementation. Conversely, renaming another surface as S1 cannot waive any mandatory property.

## Candidate A — Tool-native Synthetic / Sandbox Surface

No tool-native synthetic page, sandbox fixture, or interaction-test-document primitive is present in the current Chrome control schema or official browser capability documentation.

| Capability | Assessment |
|---|---|
| Surface creation | `NOT_ESTABLISHED` |
| Document context | `NOT_ESTABLISHED` |
| Script execution | `NOT_ESTABLISHED` |
| DOM initialization | `NOT_ESTABLISHED` |
| Event observer | `NOT_ESTABLISHED` |
| User-visible interaction | `NOT_ESTABLISHED` |
| Cross-operation persistence | `NOT_ESTABLISHED` |
| Exact re-binding | `NOT_ESTABLISHED` |
| Cleanup | `NOT_ESTABLISHED` |

Candidate status: `NOT_ESTABLISHED`.

Theoretical availability in another product surface or future release is not current capability Evidence.

## Candidate B — Agent-owned Blank Surface Initialized In Place

Historical Evidence proves agent-owned blank-tab creation only. The documented page-scope evaluation API is expressly read-only. It can inspect an existing document but does not support adding the required target, installing a listener, or persisting a mutable H2 session/buffer.

| Capability | Assessment | Boundary |
|---|---|---|
| Surface creation | `SUPPORTED` | one blank agent tab can be created |
| Document context | `SUPPORTED` | a blank document exists, without H2 material |
| Script execution | `CONDITIONALLY_SUPPORTED` | read-only evaluation only |
| DOM initialization | `UNSUPPORTED` | no standard mutation primitive in the current contract |
| Event observer | `UNSUPPORTED` | no arbitrary listener-installation primitive in the current contract |
| User-visible interaction | `UNSUPPORTED` | no harmless target can be created through the supported contract |
| Cross-operation persistence | `NOT_ESTABLISHED` | tab survival does not prove document/JS/observer/buffer survival |
| Exact re-binding | `CONDITIONALLY_SUPPORTED` | agent-created handoff tab can be retained; H2 context equality remains unproven |
| Cleanup | `SUPPORTED` | agent-owned tab close is supported and historically passed |

Candidate status: `INSUFFICIENT`.

Blank-tab availability does not imply DOM or observer capability.

## Candidate C — Explicitly Supported Benign External Surface

The control contract supports ordinary website navigation subject to browser policy. A public, signed-out page can be non-personal and user-visible, but its application/content semantics are externally controlled and mutable. More importantly, the current standard contract cannot install the independent H2 observer/session/buffer into that page.

| Capability | Assessment | Boundary |
|---|---|---|
| Surface creation | `CONDITIONALLY_SUPPORTED` | ordinary navigation is policy- and site-dependent |
| Document context | `CONDITIONALLY_SUPPORTED` | depends on successful external navigation |
| Script execution | `CONDITIONALLY_SUPPORTED` | read-only evaluation only |
| DOM initialization | `UNSUPPORTED` | no supported initialization/mutation primitive |
| Event observer | `UNSUPPORTED` | no arbitrary listener-installation primitive |
| User-visible interaction | `SUPPORTED` | ordinary rendered controls can be manually used |
| Cross-operation persistence | `NOT_ESTABLISHED` | external navigation/lifecycle can replace context |
| Exact re-binding | `CONDITIONALLY_SUPPORTED` | exact tab locator is possible; document/observer equality is not |
| Cleanup | `SUPPORTED` | agent-owned tab cleanup is supported |

Candidate status: `INSUFFICIENT`.

Using a third-party page's own telemetry or semantics as the observer would create a new dependency and would not be the reviewed independent observer contract.

## Candidate D — Browser/tool-provided Internal Fixture

No officially documented internal interaction fixture is exposed in the current schema.

| Capability | Assessment |
|---|---|
| Surface creation | `NOT_ESTABLISHED` |
| Document context | `NOT_ESTABLISHED` |
| Script execution | `NOT_ESTABLISHED` |
| DOM initialization | `NOT_ESTABLISHED` |
| Event observer | `NOT_ESTABLISHED` |
| User-visible interaction | `NOT_ESTABLISHED` |
| Cross-operation persistence | `NOT_ESTABLISHED` |
| Exact re-binding | `NOT_ESTABLISHED` |
| Cleanup | `NOT_ESTABLISHED` |

Candidate status: `NOT_ESTABLISHED`.

## Candidate E — Local / File-backed / Embedded / Extension-like Surface

The official built-in-browser documentation describes local and file-backed preview workflows, but that is not proof that the selected Chrome-extension control contract supports the same surface class. The current task also prohibits alternate browser, local server, file-based probing, embedded-document probing, extension page creation, and policy workarounds.

The historical block does not prove every category unsupported. Nevertheless, no category is eligible because no explicit support in the current selected Chrome contract establishes the complete H2 relation.

| Capability | Assessment |
|---|---|
| Surface creation | `NOT_ESTABLISHED` |
| Document context | `NOT_ESTABLISHED` |
| Script execution | `NOT_ESTABLISHED` |
| DOM initialization | `NOT_ESTABLISHED` |
| Event observer | `NOT_ESTABLISHED` |
| User-visible interaction | `NOT_ESTABLISHED` |
| Cross-operation persistence | `NOT_ESTABLISHED` |
| Exact re-binding | `NOT_ESTABLISHED` |
| Cleanup | `NOT_ESTABLISHED` |

Candidate status: `REJECTED` for this workflow unless a future capability contract explicitly supports a normal approved category. Alternate encoding is not a micro-probe.

## Candidate F — Disposable Chat No-Send Boundary

S2 can provide a fresh user-visible application document without personal Conversation content and without Send. It remains application-specific, creates contamination/binding scope, and does not repair the missing observer-installation capability.

| Capability | Assessment | Boundary |
|---|---|---|
| Surface creation | `CONDITIONALLY_SUPPORTED` | fresh Chat creation is an external mutation requiring separate authority |
| Document context | `CONDITIONALLY_SUPPORTED` | application lifecycle may replace context |
| Script execution | `CONDITIONALLY_SUPPORTED` | read-only evaluation only |
| DOM initialization | `UNSUPPORTED` | arbitrary initialization is not exposed |
| Event observer | `UNSUPPORTED` | arbitrary persistent observer installation is not exposed |
| User-visible interaction | `CONDITIONALLY_SUPPORTED` | a harmless non-Send action needs a separate reviewed definition |
| Cross-operation persistence | `NOT_ESTABLISHED` | application route/context survival remains unproven |
| Exact re-binding | `CONDITIONALLY_SUPPORTED` | exact Runtime locator principle exists; no current disposable binding exists |
| Cleanup | `CONDITIONALLY_SUPPORTED` | requires separately scoped application/tab handling |

Candidate status: `INSUFFICIENT`.

S2 remains a later architecture option only. It is not an S1 fallback and is not authorized by this review.

## Consolidated Capability Decomposition

| Candidate | Surface | Document | Script | DOM init | Observer | User interaction | Cross-operation | Exact rebind | Cleanup |
|---|---|---|---|---|---|---|---|---|---|
| A — tool-native synthetic | NE | NE | NE | NE | NE | NE | NE | NE | NE |
| B — blank in place | S | S | CS | U | U | U | NE | CS | S |
| C — benign external | CS | CS | CS | U | U | S | NE | CS | S |
| D — internal fixture | NE | NE | NE | NE | NE | NE | NE | NE | NE |
| E — local/file/embedded/extension-like | NE | NE | NE | NE | NE | NE | NE | NE | NE |
| F — disposable Chat no-Send | CS | CS | CS | U | U | CS | NE | CS | CS |

Legend:

- `S`: `SUPPORTED`
- `CS`: `CONDITIONALLY_SUPPORTED`
- `NE`: `NOT_ESTABLISHED`
- `U`: `UNSUPPORTED` by the current documented standard API for the required operation

One supported capability does not imply another. In particular:

```text
tab creation != DOM initialization
read-only evaluation != observer installation
tab handoff survival != document/JS/observer/buffer continuity
```

## Required H2 Surface Properties

A usable H2 surface must provide all of:

1. exact surface binding;
2. stable document/context;
3. Runtime session marker;
4. observer generation;
5. mutable event buffer;
6. harmless visible user-action target;
7. user action after confirmed arm;
8. later exact re-binding;
9. same session/generation verification;
10. current event retrieval;
11. stale-event rejection; and
12. single-use cleanup.

Every reviewed candidate is missing or has not established at least one mandatory property. All currently fail H2 surface eligibility.

```text
H2_SURFACE_ELIGIBILITY: NO
```

## Manual Interaction Capability

Candidate C provides ordinary user-visible interaction, and F may provide an application-specific harmless interaction after a separate Decision. Neither is independently observer-capable.

B has no supported way to create a visible target. A and D expose no established surface primitive. E is outside the approved capability path.

No candidate currently establishes the full relation:

```text
visible
AND manually interactable
AND non-application-semantic
AND non-personal
AND harmless
AND one-action bounded
AND independently observer-capable
```

## Cross-operation Capability

The current contract distinguishes:

- browser-binding persistence: supported generally;
- agent-created tab handoff survival: supported;
- page/document survival: not established for an H2 candidate;
- JavaScript-context survival: not established;
- observer-instance survival: not established;
- buffer survival/currentness: not established; and
- exact observer/session retrieval after re-binding: not established.

Persistent tab identity is necessary for some candidates but cannot substitute for the other continuity layers.

## Candidate Comparison

| Candidate | Policy compliant | Non-personal | User interactable | Observer capable | Cross-operation candidate | Exact rebind candidate | Status |
|---|---|---|---|---|---|---|---|
| A — tool-native synthetic | unknown | yes by design | unknown | unknown | unknown | unknown | `NOT_ESTABLISHED` |
| B — blank in place | blank-tab creation yes | yes | no supported target | no | tab only | conditional | `INSUFFICIENT` |
| C — benign external | conditional | conditional | yes | no | not established | conditional | `INSUFFICIENT` |
| D — internal fixture | unknown | yes by design | unknown | unknown | unknown | unknown | `NOT_ESTABLISHED` |
| E — local/file/embedded/extension-like | not established for selected Chrome contract | potentially | unknown | unknown | unknown | unknown | `REJECTED` |
| F — disposable Chat no-Send | conditional | yes if fresh | conditional | no | not established | conditional | `INSUFFICIENT` |

No candidate is `ELIGIBLE_FOR_MICRO_PROBE` or `CONDITIONALLY_ELIGIBLE` under the complete mandatory relation.

## Safe Surface Decision

```text
H2_SAFE_TEST_SURFACE_CANDIDATE: NONE_ESTABLISHED
```

The decision is based on the missing observer-capable surface contract, not on the historical navigation block alone.

No theoretical candidate is promoted into a future probe merely because one subset of its capabilities exists.

## Micro-probe Requirement

```text
H2_SAFE_SURFACE_MICRO_PROBE_REQUIRED: NO
H2_SAFE_SURFACE_MICRO_PROBE_PHASE: NOT_APPLICABLE
```

A micro-probe is not justified until a documented, policy-compliant candidate supports at least surface creation, harmless target availability, and observer installation. Probing an unknown surface would repeat capability discovery through mutation and could become a policy workaround.

If the tool contract later adds such a candidate, the first separately authorized probe must be `SURFACE_SETUP_ONLY`: create/bind the surface, establish the target, install one observer/session generation, confirm zero pre-arm events, then clean up without requesting a manual action. A later reviewed authorization may separately test the handoff event.

## Architecture Options After No Surface

The following remain comparison options only:

| Option | Potential benefit | Material issue | Status this Round |
|---|---|---|---|
| Reconsider Combined Oracle | may remove persistent event-observer requirement | changes the independent-oracle Decision and circularity boundary | review candidate only |
| S2 disposable Chat no-Send | uses an available application surface | application coupling plus missing observer primitive | review candidate only |
| External/manual fixture construction process | may avoid in-browser send tooling | does not automatically provide candidate-independent action or occurrence proof | review candidate only |
| Other construction-tooling strategy | could use a separately supported event-capable harness | requires new authority and capability Evidence | review candidate only |

No oracle, construction strategy, or fallback is changed here.

## H2 Runtime Impact

```text
H2_DESIGN_FEASIBILITY: SUPPORTED
H2_RUNTIME_CAPABILITY: NOT_ESTABLISHED
H2_TEST_SURFACE: BLOCKED
H2_MECHANISM_CHARACTERIZATION: ABORTED
INTERACTIVE_HANDOFF_MECHANISM: NONE_ESTABLISHED
INTERACTIVE_HANDOFF_CAPABILITY: NOT_ESTABLISHED
```

The design remains coherent, but the selected Chrome control contract lacks an established safe, observer-capable test surface.

## Characterization C1 Readiness Impact

```text
CHARACTERIZATION_C1_READINESS: BLOCKED
SEND_ACTION_CANDIDATE_RELATION: INSUFFICIENT_EVIDENCE
SUBMISSION_SUCCESS_SIGNAL: INSUFFICIENT_EVIDENCE
ATTEMPT_4_READINESS: BLOCKED
```

This static review provides no Send identity, lifecycle, submission, or completion Evidence.

## Long-100 Impact

```text
LONG_100_CONSTRUCTION_STATE: BLOCKED
LONG_100_COMPLETED_CYCLES: 0
LONG_100_NEXT_EXPECTED_CYCLE: 1
```

No fixture, occurrence, ledger, or Ground Truth state changed.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: unchanged; no Conversation acquisition occurred.
- FR-008 / NFR-001 / NFR-002 / ADR-006: supported by rejecting unsupported surface assumptions and retaining Fail Closed.
- TV-005 / TV-006: no Discovery or validation occurred; Verdicts remain not set.
- RISK-002: unchanged and open.
- Production implementation: none.

## Privacy Boundary

No tab, page, Chat, DOM, user content, or browser state was inspected or mutated in this review.

Evidence contains only capability enums, candidate classes, booleans, safe policy classifications, and operation-stage names. It contains no raw URL, blocked navigation value, browser exception, DOM/page content, tab identifier, personal Chat metadata, Message data, credential, cookie, or token.

## Repository / Security Check

- `git diff --check`: PASS
- new untracked Evidence whitespace check: PASS
- trailing-whitespace findings: 0
- direct prohibited-value pattern scan: PASS
- raw URL/navigation value, UUID-like value, DOM/HTML, or credential assignment detected: false
- historical Source-of-Truth and Evidence files checked: 22
- tracked historical changes: 0
- prior untracked H2 characterization Evidence hash match: true
- this Round's added scope: this new capability-review Evidence only
- working tree also retains the pre-existing untracked H2 characterization Evidence from the prior Round
- `docs/`, `AGENTS.md`, `src/`, and Production files changed: false
- Production implementation: none

## Recommended Next Action

`TASK-003 Construction Send Lifecycle Characterization — Combined Oracle / Construction Tooling Architecture Review`

That Decision-preparation Round should compare the four deferred architecture options without executing C1, S2, fixture construction, or browser mutation. It should not weaken independent-oracle or Fail Closed requirements implicitly.

## Final Status

```text
S1_FAILURE_SCOPE:
NAVIGATION_ONLY

BROWSER_POLICY_BLOCK_CLASS:
SYNTHETIC_NAVIGATION_DISALLOWED

H2_SAFE_TEST_SURFACE_CANDIDATE:
NONE_ESTABLISHED

H2_SAFE_SURFACE_MICRO_PROBE_REQUIRED:
NO

H2_SAFE_SURFACE_MICRO_PROBE_PHASE:
NOT_APPLICABLE

H2_DESIGN_FEASIBILITY:
SUPPORTED

H2_RUNTIME_CAPABILITY:
NOT_ESTABLISHED

H2_TEST_SURFACE:
BLOCKED

H2_MECHANISM_CHARACTERIZATION:
ABORTED

INTERACTIVE_HANDOFF_MECHANISM:
NONE_ESTABLISHED

INTERACTIVE_HANDOFF_CAPABILITY:
NOT_ESTABLISHED

CHARACTERIZATION_C1_READINESS:
BLOCKED

SEND_ACTION_CANDIDATE_RELATION:
INSUFFICIENT_EVIDENCE

SUBMISSION_SUCCESS_SIGNAL:
INSUFFICIENT_EVIDENCE

ATTEMPT_4_READINESS:
BLOCKED

LONG_100_CONSTRUCTION_STATE:
BLOCKED

LONG_100_COMPLETED_CYCLES:
0

LONG_100_NEXT_EXPECTED_CYCLE:
1

TASK-003 DISCOVERY:
NOT_STARTED

TV-005 VERDICT:
NOT_SET

TV-006 VERDICT:
NOT_SET
```
