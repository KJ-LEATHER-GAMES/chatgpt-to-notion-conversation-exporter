# TASK-003 Long-100 Construction Send-action Candidate Decision Reconciliation

## Status

- Date: 2026-08-16
- Scope: Phase 0 construction-tooling Decision for Send-action identity,
  action acknowledgement, and positive submission observation
- Additional browser observation: **NO**
- Construction mutation or Attempt 4: **NOT STARTED**
- TV-005 / TV-006 Discovery: **NOT STARTED**
- Production implementation: **none**

```text
SEND_ACTION_CANDIDATE_RELATION: INSUFFICIENT_EVIDENCE
POST_FILL_TRANSITION_RELATION_EVIDENCE: INSUFFICIENT
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
SUBMISSION_SUCCESS_SIGNAL: INSUFFICIENT_EVIDENCE

SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED: YES
ATTEMPT_4_READINESS: BLOCKED
CONFIRMED_SEND_FALLBACK: NONE
```

## Review Basis

This Decision uses repository-current Source-of-Truth documents and the
chronological TASK-003 Evidence through the Attempt 3 Post-fill Send Relation
Failure Review. It introduces no new observed fact and does not reinterpret a
construction-tooling result as TV-005 or TV-006 Evidence.

The review keeps three independent questions separate:

1. **Track A — Send-action Candidate Identity**: which current candidate is
   the actual application Send action;
2. **Track B — Action Execution Acknowledgement**: whether an action dispatch
   operation returned successfully; and
3. **Track C — Submission Lifecycle Observation**: whether one controlled
   User occurrence was positively established.

Success in one Track cannot repair another Track.

## Historical Attempt Integrity

Historical Evidence remains unchanged:

```text
LONG_100_ATTEMPT_1: ABORTED
LONG_100_ATTEMPT_2: ABORTED_BEFORE_FILL
LONG_100_ATTEMPT_3: ABORTED_AFTER_SEND

POST_FILL_SEND_GATE: PASS
ACTION_CLICK_ATTEMPT_COUNT: 1
ACTION_EXECUTION_ESTABLISHED: false
USER_SUBMISSION_ESTABLISHED: false
ATTEMPT_3_SUBMISSION_STATE: UNRESOLVED
```

The historical gate result reports the relation applied during Attempt 3. It
is not the effective Send-action Decision after Failure Review.

The stopped Attempt 3 tab remains `NOT_ELIGIBLE` for construction reuse.

## Candidate Relation Evidence

### Pre-fill observed material

| Safe material | Result |
|---|---:|
| Unique candidate-bearing form | 1 |
| Visible enabled generic controls | 4 |
| Reviewed Send-action relation | none established |

### Post-fill observed material

| Safe material | Result |
|---|---:|
| Unique candidate-bearing form | 1 |
| Action-capable controls | 4 |
| Native submit-semantic candidates | 1 |
| Visible enabled native submit-semantic candidates | 1 |
| Competing equivalent native-submit candidates | 0 |
| Other visible enabled non-submit controls | 3 |
| Candidate exact form association | true |
| Candidate detached from the form | false |
| Candidate explicitly declares submit type | false |
| Candidate receives implicit default submit semantics | true |
| Candidate connected / visible / enabled | true |
| Candidate inside inert subtree | false |
| Candidate pointer events enabled | true |

These facts establish a unique browser-native default-submit candidate. They
do not establish that it is the application's actual Send action.

## Pre-fill / Post-fill Lifecycle Relation Assessment

Candidate A2 requires an identity-preserving relation showing that one action
candidate was absent or non-qualifying before fill and became uniquely
qualifying after the editor transitioned to non-empty.

The Evidence does establish:

- the editor was empty before fill and non-empty after fill;
- the pre-fill review did not establish a Send action;
- the post-fill inventory had one implicit native-submit candidate; and
- post-fill action cardinalities were recorded.

The Evidence does not establish:

- element-identity continuity for every pre-fill and post-fill action control;
- that the candidate appeared only after fill;
- that an existing control changed type;
- that an existing control changed enabled state;
- that the implicit native-submit candidate was absent pre-fill;
- that another control did not become the actual application Send action; or
- a supported currentness relation tying the state transition to application
  Send semantics.

Pre-fill `send-like count = 0` and post-fill `native-submit count = 1` were not
captured as the same identity-preserving candidate family transition. They
cannot be converted into an inferred appearance or state change.

```text
POST_FILL_TRANSITION_RELATION_EVIDENCE: INSUFFICIENT
```

## Send-action Candidate Option Comparison

| Option | Evidence support | Decision | Reason |
|---|---|---|---|
| A1 — native submit semantics only | one implicit default candidate | DO NOT ADOPT | native form behavior does not independently establish application Send identity |
| A2 — post-fill structural transition | partial aggregate before/after counts | INSUFFICIENT | no element-identity-preserving transition Evidence |
| A3 — explicit application-send semantics | no Evidence-safe structural semantic class established | INSUFFICIENT | raw/localized strings and order are prohibited; no approved alternative was observed |
| A4 — multi-signal structural relation | A1 plus unsupported or missing A2/A3 material | INSUFFICIENT | combining dependent or absent signals cannot create independent proof |

The four-count action inventory cannot select one of its controls by DOM order,
visual position, label, accessible string, or first-match. Nor can the native
default candidate be retained merely because Attempt 3 attempted it once.

## Track A — Send-action Candidate Decision

```text
SEND_ACTION_CANDIDATE_RELATION: INSUFFICIENT_EVIDENCE
```

No effective relation is adopted. A future relation requires focused observed
Evidence for all of the following before Long-100 construction resumes:

1. enumerate action candidates inside the already unique construction form;
2. collapse overlapping family representations by element identity;
3. preserve candidate identity across empty-editor and post-fill states;
4. establish an Evidence-supported application-send semantic or structural
   transition that is independent of order and raw text;
5. require exactly one current visible enabled connected candidate;
6. exclude competing equivalent candidates before dispatch; and
7. fail closed if any identity, transition, semantic, or cardinality relation
   is absent, ambiguous, or inconsistent.

These are characterization questions and acceptance boundaries, not a newly
adopted selector or relation.

## Track B — Stage-separated Action Execution Contract

The Attempt 3 combined operation is superseded for future tooling. Candidate
resolution, action dispatch, and post-action observation must have distinct
safe stages and failure boundaries.

### Required stages

| Stage | Entry condition | Successful completion material |
|---|---|---|
| `ACTION_CANDIDATE_RESOLVED` | adopted Track A relation returns exactly one Runtime-bound element | candidate cardinality and currentness remain valid |
| `ACTION_DISPATCH_REQUESTED` | separate authorization and resolved candidate are present | harness records one dispatch request before invocation |
| `ACTION_DISPATCH_RETURNED` | dispatch operation is invoked once | browser/tool operation returns without dispatch-stage failure |
| `POST_ACTION_OBSERVATION_STARTED` | dispatch return was acknowledged | a separate read-only lifecycle observation begins |
| `POST_ACTION_OBSERVATION_COMPLETED` | observation operation starts | safe lifecycle state is returned without observation-stage failure |

### Safe result contract

The future harness must return at least:

```text
ACTION_EXECUTION_STAGE:
NONE /
CANDIDATE_RESOLVED /
DISPATCH_REQUESTED /
DISPATCH_RETURNED /
POST_OBSERVATION_STARTED /
POST_OBSERVATION_COMPLETED

ACTION_EXECUTION_FAILURE_STAGE:
NONE /
CANDIDATE_RESOLUTION /
DISPATCH /
POST_OBSERVATION /
UNKNOWN

DOM_ACTION_DISPATCH_ACKNOWLEDGED:
true / false
```

Rules:

- `ACTION_EXECUTION_STAGE` is the highest successfully completed stage.
- The dispatch operation has its own safe error boundary.
- Post-action observation occurs in a separate read-only operation and has a
  different safe error boundary.
- Dispatch acknowledgement is true only when the dispatch operation returns
  successfully through its supported browser/tool boundary.
- A dispatch error remains unacknowledged even if the application might have
  processed an event before the error.
- Post-observation failure must not erase an already acknowledged dispatch.
- Dispatch acknowledgement does not establish User submission.
- Any failure returns only a fixed stage/code; raw exception text is forbidden.
- No failure authorizes retry, second dispatch, keyboard send, alternate
  action, or ledger repair.

```text
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
```

This is a construction-tooling safety contract. The concrete action mechanism
and candidate must still be supported by characterization Evidence.

## Track C — Submission Lifecycle Signal Inventory

| Candidate signal family | Existing Evidence | Positive success established? | Assessment |
|---|---|---:|---|
| Composer state transition | editor remained non-empty post-attempt | false | neither success nor adopted positive failure proof |
| Action-control transition | no identity-preserving transition ledger | false | insufficient |
| Generation lifecycle | generation-state controls observed as 0 | false | start transition not observed |
| Route/currentness transition | route change false | false | not a positive submission signal |
| Other construction-UI lifecycle state | none established | false | unavailable |

No existing signal is both positive and independently current. The absence of
a transition after an uncertain dispatch does not establish successful
submission and does not establish definitive non-submission.

## Track C — Submission Success Signal Decision

```text
SUBMISSION_SUCCESS_SIGNAL: INSUFFICIENT_EVIDENCE
```

A future success signal may be adopted only after focused observation proves
that it:

- is a positive state transition from a known pre-action state;
- is current to the same candidate/form lifecycle;
- cannot be satisfied by a stale pre-action or unrelated UI state;
- is independent from `DOM_ACTION_DISPATCH_ACKNOWLEDGED`;
- uses candidate-only construction UI material;
- does not use Ground Truth, Message DOM, Message count, or runtime Message
  identity; and
- can separately support generation-start and later completion observation.

No fixed wait, timeout, or absence-only rule is adopted in this Decision.

## Combined Construction Gate

Attempt 4 entry requires all three effective decisions in advance:

```text
SEND_ACTION_CANDIDATE_RELATION: ADOPTED
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
SUBMISSION_SUCCESS_SIGNAL: ADOPTED
```

Current state:

| Required decision | Result |
|---|---|
| Send-action identity | INSUFFICIENT_EVIDENCE |
| Action execution acknowledgement | ADOPTED |
| Positive submission signal | INSUFFICIENT_EVIDENCE |

```text
ATTEMPT_4_READINESS: BLOCKED
```

## Fail Closed and No-fallback Contract

The future construction harness must not dispatch or increment the ledger for:

- action candidate count 0 or 2+;
- candidate identity discontinuity across required lifecycle states;
- implicit native semantics without independently supported application-send
  identity;
- missing or ambiguous post-fill transition Evidence;
- missing, disabled, hidden, detached, stale, or competing candidates;
- dispatch failure or unknown highest completed stage;
- post-observation failure without a positive success signal;
- absent, stale, ambiguous, or inconsistent submission lifecycle material; or
- dispatch acknowledgement without independent submission success.

Prohibited repair and fallback:

- first/last button or DOM order;
- visual position;
- raw label, accessible string, or localized text matching;
- keyboard send;
- direct form submission or alternate event mechanism;
- hidden control;
- blind reuse of the Attempt 3 candidate;
- retry after an ambiguous dispatch;
- Message DOM, count, scrolling, or runtime Message identity repair; and
- Ground-Truth-assisted candidate or submission selection.

```text
CONFIRMED_SEND_FALLBACK: NONE
```

## Disposable Send Lifecycle Characterization

Existing read-only Evidence cannot establish Track A or Track C. A separate,
explicitly authorized characterization is required before Attempt 4:

```text
SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED: YES
```

The characterization must use a disposable synthetic Standard Chat that is
not Long-100 and whose occurrences never enter the Long-100 ledger. Its narrow
purpose is to observe safely:

1. all relevant action candidate identities in a known empty-editor state;
2. the same identities and state relations after one authorized synthetic fill;
3. an actual application Send-action relation without text/order fallback;
4. a stage-separated single dispatch acknowledgement;
5. a positive candidate-only submission lifecycle transition;
6. a positive generation-start transition; and
7. completion-state material needed by construction tooling.

The characterization must preserve raw-content and locator privacy, perform no
Message enumeration, and require separate user authorization before any
mutation. It is tooling characterization, not TV-005 / TV-006 Discovery and
not Long-100 Ground Truth.

## Long-100 Ground Truth Impact

- Attempt 1 remains `ABORTED`.
- Attempt 2 remains `ABORTED_BEFORE_FILL`.
- Attempt 3 remains `ABORTED_AFTER_SEND` with unresolved submission state.
- Completed cycles remain 0.
- Successfully established User / Assistant occurrences remain 0 / 0.
- The next expected cycle remains 1 for a future fresh controlled attempt.
- The frozen ledger and digest remain unchanged.
- No occurrence alias is consumed by a successful construction record.
- Long-100 fixture designation remains prohibited.
- Long-100 Ground Truth remains not established.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: unchanged; whole-Conversation acquisition did not start.
- FR-008 / NFR-001 / NFR-002 / ADR-006: supported by blocking Attempt 4 until
  identity, acknowledgement, and positive submission are independently safe.
- NFR-007 / TV-005 / TV-006: no loading or completeness validation occurred.
- AT-007 / AT-008: traceability only; no Production Acceptance Test ran.
- RISK-002: unchanged and open.
- Requirements, ADRs, risks, acceptance tests, backlog, and AGENTS.md: unchanged.
- Production implementation: none.

## Privacy Boundary

`PRIVACY_SAFE_SEND_ACTION_DECISION: PASS`

Only counts, booleans, action family aliases, structural semantic classes,
lifecycle states, safe stages, fixed codes, and Decision results are persisted.
Raw prompts, Assistant content, identifying metadata, location, tab identity,
labels, accessible strings, DOM/HTML, Message identities, exception text, and
authentication material are absent.

## Repository / Security Check

- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan: **PASS** (`0` findings).
- Direct raw web-location scan: **PASS**.
- Direct UUID-like value scan: **PASS**.
- Direct raw synthetic marker scan: **PASS**.
- Direct DOM/HTML dump scan: **PASS**.
- Direct credential/cookie/token/secret value scan: **PASS**.
- Source-of-Truth and all historical Evidence hashes unchanged: **PASS**.
- Attempt 3 and its Failure Review Evidence unchanged: **PASS**.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001/TASK-002 assets,
  and prior TASK-003 Evidence unchanged: **PASS**.
- Changed repository scope: this new Decision Reconciliation Evidence only.
- Production implementation: none.

## Final Status

```text
SEND_ACTION_CANDIDATE_RELATION: INSUFFICIENT_EVIDENCE
POST_FILL_TRANSITION_RELATION_EVIDENCE: INSUFFICIENT
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
SUBMISSION_SUCCESS_SIGNAL: INSUFFICIENT_EVIDENCE

SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED: YES
ATTEMPT_4_READINESS: BLOCKED
CONFIRMED_SEND_FALLBACK: NONE

LONG_100_ATTEMPT_1: ABORTED
LONG_100_ATTEMPT_2: ABORTED_BEFORE_FILL
LONG_100_ATTEMPT_3: ABORTED_AFTER_SEND

LONG_100_CONSTRUCTION_STATE: BLOCKED
LONG_100_COMPLETED_CYCLES: 0
LONG_100_USER_SUBMISSIONS: 0
LONG_100_ASSISTANT_COMPLETIONS: 0
LONG_100_NEXT_EXPECTED_CYCLE: 1

LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED

TASK-003 DISCOVERY: NOT_STARTED
TV-005 VERDICT: NOT_SET
TV-006 VERDICT: NOT_SET
```

## Recommended Next Action

`TASK-003 Construction Send Lifecycle Characterization — Scope and Safety Plan`

Do not create a disposable Chat or perform characterization mutation until a
separate Round defines its exact scope and receives explicit user authorization.
