# TASK-003 Construction Send Lifecycle Characterization — Scope and Safety Plan

## Status

- Date: 2026-08-16
- Scope: construction-tooling Send lifecycle characterization planning only
- Additional browser observation: **NO**
- Disposable Chat creation or mutation: **NO**
- Long-100 / Long-200 construction: **NOT STARTED / NOT RESUMED**
- TV-005 / TV-006 Discovery: **NOT STARTED**
- Production implementation: **none**

```text
CHARACTERIZATION_SCOPE_PLAN: COMPLETE
CHARACTERIZATION_ROLE: CONSTRUCTION_TOOLING_ONLY
CHARACTERIZATION_ACTION_ORACLE: COMBINED
USER_INTERVENTION_REQUIRED: YES
ACTION_IDENTITY_CONTINUITY_LEDGER: PLANNED
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
CHARACTERIZATION_MUTATION_BUDGET: C1_ONE_DISPOSABLE_CHAT_ONE_USER_SUBMISSION
CHARACTERIZATION_EXECUTION: NOT_STARTED
```

## Review Basis

This Plan uses repository-current Source-of-Truth documents and chronological
TASK-003 Evidence through the Send-action Candidate Decision Reconciliation.
It preserves the current conclusions:

```text
SEND_ACTION_CANDIDATE_RELATION: INSUFFICIENT_EVIDENCE
POST_FILL_TRANSITION_RELATION_EVIDENCE: INSUFFICIENT
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
SUBMISSION_SUCCESS_SIGNAL: INSUFFICIENT_EVIDENCE
SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED: YES
ATTEMPT_4_READINESS: BLOCKED
CONFIRMED_SEND_FALLBACK: NONE
```

No new candidate, selector, event mechanism, success signal, or Production
behavior is adopted in this Planning Round.

## Characterization Purpose

The characterization exists only to establish Evidence for a future
construction-tooling contract covering:

1. actual application Send-action identity;
2. action dispatch acknowledgement;
3. positive User-submission transition;
4. positive generation-start transition; and
5. positive Assistant-completion transition.

```text
CHARACTERIZATION_ROLE: CONSTRUCTION_TOOLING_ONLY
```

It is not TV-005 / TV-006 Discovery, a Long-100 construction attempt, a PoC,
or Production implementation.

## Long-100 and Ground Truth Separation

The disposable characterization Chat is not a formal fixture. Every occurrence
created during characterization is excluded from:

- the Long-100 ledger;
- the Long-200 ledger;
- TV-005 Ground Truth;
- TV-006 Ground Truth; and
- any expected-count or completeness oracle.

Characterization output may label construction-tooling actions and lifecycle
events. It may not establish, repair, or consume Long-100 occurrence aliases.

The frozen Long-100 ledger remains independent and unchanged.

## Candidate Relation vs Action Oracle

Two layers are mandatory:

### Characterization Action Oracle

Independently labels which observed action occurrence represented the
human-intended actual Send operation in the disposable Chat.

### Future Candidate-only Runtime Relation

Must later resolve actual Send without user assistance, Ground Truth, raw text,
or the characterization alias.

Required evaluation order:

1. observe the complete pre/post characterization candidate inventory;
2. independently establish the Action Oracle;
3. evaluate each proposed candidate-only relation without using the oracle to
   select a candidate;
4. compare the relation result with the oracle-labeled action;
5. support or reject the proposed relation in Characterization Review; and
6. make any adoption decision in a later Send-action Candidate Decision.

The following circular flow is prohibited:

```text
harness selects candidate
-> harness activates candidate
-> an effect occurs
-> selected candidate is declared actual Send
```

## Characterization Action Oracle Options

| Oracle option | Independence | Feasibility / cost | Privacy | Decision |
|---|---|---|---|---|
| O1 — user-mediated actual Send action | strong human-intent grounding; avoids candidate self-selection | requires one coordinated user action and exact observation checkpoint | raw labels need not leave the page | ADOPT AS PRIMARY ORACLE INPUT |
| O2 — application event semantics only | potentially useful target/submitter relation, but event families are not yet observed | requires a safely armed observer; submit event existence cannot be assumed | safe aliases and booleans only | ADOPT AS CORRELATION LAYER, NOT SOLE ORACLE |
| O3 — harness-selected candidate action | circular; success would self-approve the candidate | easy to automate but invalid as independent grounding | privacy does not repair circularity | REJECT |
| O4 — other independent oracle | no Evidence-supported alternative currently established | would require a new reviewed mechanism | unknown | NOT ADOPTED |

## Recommended Action Oracle

```text
CHARACTERIZATION_ACTION_ORACLE: COMBINED
USER_INTERVENTION_REQUIRED: YES
```

The combined oracle consists of:

1. the user manually performing exactly one human-intended Send action in the
   disposable Chat after an explicit ready checkpoint; and
2. a pre-armed observer correlating that real interaction with exactly one
   preassigned safe action alias through event-target identity.

Application event material is correlation Evidence, not assumed behavior:

- the click event target or its uniquely inventoried action ancestor is
  mapped to one safe alias;
- submit-event presence is recorded as observed or not observed;
- submitter identity is recorded only if the application/browser supplies it;
- event propagation and cancellation classifications are recorded only when
  observable; and
- absence of a submit event does not invent a submitter or invalidate the
  independently user-grounded click target.

The oracle is established only if the user-action checkpoint was active and
the actual interaction maps to exactly one current action alias. Failure to
correlate the event target is Fail Closed.

## User-mediated Interaction Boundary

No user operation is requested in this Planning Round. A later explicitly
authorized execution divides responsibilities as follows.

### Browser harness operations

1. create exactly one disposable synthetic Standard Chat;
2. immediately bind its returned Runtime handle;
3. resolve the already approved editor relation;
4. capture the pre-fill action identity ledger;
5. perform exactly one synthetic fill;
6. capture the post-fill identity-continuity ledger;
7. arm the privacy-safe action/lifecycle observer;
8. expose a fixed safe `USER_ACTION_READY` checkpoint; and
9. after the manual action, read only safe event and lifecycle records.

### User operation

- after `USER_ACTION_READY`, manually activate the intended application Send
  control exactly once;
- perform no second action, retry, regenerate, edit, branch, navigation, or
  keyboard fallback; and
- indicate completion of the single manual action without disclosing raw UI
  text or locator material.

### Observer operations

- remain read-only with respect to application content;
- record only event/action alias identity and safe lifecycle transitions;
- never synthesize, replay, cancel, or redirect the user's action; and
- stop immediately if more than one candidate/event correlation is possible.

Exact checkpoints:

```text
CHECKPOINT_1: PRE_FILL_LEDGER_COMPLETE
CHECKPOINT_2: POST_FILL_LEDGER_COMPLETE
CHECKPOINT_3: ORACLE_OBSERVER_ARMED
CHECKPOINT_4: USER_ACTION_READY
CHECKPOINT_5: USER_ACTION_EVENT_CAPTURED
CHECKPOINT_6: DISPATCH_OBSERVATION_COMPLETE
CHECKPOINT_7: SUBMISSION_LIFECYCLE_OBSERVED
CHECKPOINT_8: GENERATION_START_OBSERVED
CHECKPOINT_9: ASSISTANT_COMPLETION_OBSERVED
```

No later checkpoint repairs an earlier missing one.

## Pre-fill / Post-fill Action Identity Ledger

```text
ACTION_IDENTITY_CONTINUITY_LEDGER: PLANNED
```

### Alias boundary

Each distinct action-capable element in the unique form receives a Runtime
safe occurrence alias such as `CHAR-A01`. Alias numbering is audit labeling
only. Its number, enumeration position, DOM order, and visual position have no
selection semantics.

Aliases remain scoped to the disposable characterization session and have no
relationship to Long-100 Message occurrence aliases.

### Pre-fill record

For each element identity, record only:

- safe action alias;
- action family membership classifications;
- distinct-element identity;
- visible / enabled / connected booleans;
- exact containing-form relation;
- form-associated / detached classification;
- native action-semantic class;
- explicit vs implicit submit-semantic class;
- safe application-semantic metadata class availability, without raw value;
- hidden / inert / pointer-interaction classifications; and
- competing-equivalence group classification, if supportable.

The unique editor/form relation must already be resolved. Incomplete action
inventory blocks fill.

### Post-fill record

Re-enumerate by actual element identity and classify:

- same identity still present;
- disappeared identity;
- newly appeared identity with a new safe alias;
- visibility transition;
- enabled transition;
- connected transition;
- form-association transition;
- native semantic transition;
- explicit/implicit submit transition;
- safe application-semantic-class transition; and
- candidate equivalence/cardinality transition.

Different elements must not be equated by matching attributes, family, form,
appearance, or position. Loss of identity continuity is a recorded result and
may block a future relation; it is not repaired by value similarity.

### Evidence-safe ledger schema

| Field | Safe type |
|---|---|
| `safeActionAlias` | characterization alias |
| `prePresent` / `postPresent` | boolean |
| `sameElementIdentity` | boolean |
| `familyClasses` | safe enum set |
| `visibilityTransition` | safe enum |
| `enabledTransition` | safe enum |
| `connectionTransition` | safe enum |
| `formRelationTransition` | safe enum |
| `nativeSemanticTransition` | safe enum |
| `applicationSemanticClassAvailable` | boolean |
| `candidateOnlyRelationMatch` | boolean / not evaluated |

## Oracle Correlation Schema

The observer may persist only:

```text
ACTION_ORACLE_ESTABLISHED:
YES / NO / NOT_REACHED

ORACLE_TARGET_SAFE_ALIAS:
CHAR-Axx / NOT_SET

ORACLE_TARGET_MATCH_COUNT:
0 / 1 / 2+

ORACLE_TARGET_WAS_UNIQUE_POST_FILL_CANDIDATE:
true / false / NOT_EVALUATED

ORACLE_EVENT_TARGET_MAPPED:
true / false

ORACLE_SUBMIT_EVENT_OBSERVED:
true / false

ORACLE_SUBMITTER_SAFE_ALIAS:
CHAR-Axx / NOT_OBSERVED / AMBIGUOUS

ORACLE_SUBMITTER_EQUAL_TARGET:
true / false / NOT_OBSERVED / AMBIGUOUS

ORACLE_CONTAINING_FORM_EQUALITY:
true / false / AMBIGUOUS
```

If the raw event target is a descendant of an inventoried action element, it
may be normalized only to its unique action ancestor by DOM element identity.
Zero or multiple such ancestors makes the oracle ambiguous.

Safe aliases label observations. The later Runtime relation must run without
reading `ORACLE_TARGET_SAFE_ALIAS` and is compared with it only afterward.

## Track A Characterization Acceptance Criteria

Characterization supplies reviewable Track A Evidence only if:

1. the combined Action Oracle is independently established;
2. the oracle target maps to exactly one safe action identity;
3. pre/post identity continuity is complete for all action candidates;
4. a proposed candidate-only relation can be evaluated without the oracle;
5. that relation returns exactly one current candidate;
6. the resolved candidate equals the oracle target after independent
   evaluation;
7. every competing control is excluded by the same candidate-only rule;
8. the candidate is visible, enabled, connected, and bound to the expected
   unique form;
9. no raw text, accessible string, localization, order, position, or Ground
   Truth participates; and
10. no unsupported semantic inference or fallback is required.

Characterization success does not adopt the candidate relation. Required
sequence remains:

```text
Characterization Execution
-> Characterization Review
-> Send-action Candidate Decision
-> separate Attempt 4 authorization
```

The Review may require another disposable characterization if one run does not
support reproducibility. It must not silently expand the mutation budget.

## Track B — Stage Contract Reuse

The adopted `ACTION_EXECUTION_ACK_CONTRACT` is reused unchanged. The execution
record must preserve:

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
```

Evidence-safe stage fields are:

| Stage material | Safe field |
|---|---|
| Candidate ready | `actionCandidateResolved` |
| Single manual action window opened | `actionDispatchRequested` |
| User action event boundary observed complete | `userActionEventAcknowledged` |
| Harness DOM-dispatch API returned | `domActionDispatchAcknowledged` |
| Post-action observer started separately | `postActionObservationStarted` |
| Post-action observer returned | `postActionObservationCompleted` |
| Highest completed stage | `actionExecutionStage` |
| Failed boundary | `actionExecutionFailureStage` |

For the recommended user-mediated oracle, the plan expects
`userActionEventAcknowledged`; it must not fabricate
`domActionDispatchAcknowledged`, because no harness click API is invoked.
The later Characterization Review must keep the actor distinction explicit.

Rules retained:

- dispatch/event acknowledgement and post-action observation use different
  failure boundaries;
- post-observation failure cannot erase an earlier acknowledged event stage;
- any raw exception becomes a fixed safe failure code;
- an acknowledgement says an action/event boundary completed, not that the
  application accepted a User submission; and
- no unknown stage authorizes a retry.

```text
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
```

## Track C — Positive User-submission Signal Plan

The observer captures identity-preserving transitions across:

- composer lifecycle;
- oracle-target action-control lifecycle;
- generation lifecycle;
- unique-form lifecycle;
- route/currentness lifecycle; and
- any other construction-UI lifecycle family discovered without Message DOM.

The Plan does not assume any family exists or is sufficient. For every family,
record the known pre-action state, immediate post-action state, element/form
identity relation, transition direction, and current-context equality.

A future `SUBMISSION_SUCCESS_SIGNAL` candidate must:

- be a positive transition;
- belong to the same action/form/current lifecycle;
- be impossible to satisfy solely through stale pre-action state;
- be independent from action/event dispatch acknowledgement;
- use candidate-only construction UI material;
- use no Message DOM, Message count, Ground Truth, or runtime Message identity;
- not depend only on absence or elapsed time; and
- remain separately observable from generation start and completion.

Characterization records:

```text
SUBMISSION_POSITIVE_TRANSITION:
OBSERVED / NOT_OBSERVED / AMBIGUOUS / NOT_REACHED
```

No signal is adopted until Characterization Review and a later Candidate
Decision.

## Generation-start Signal Plan

Generation start is evaluated after, and independently from, positive User
submission. Candidate families may include current generation-control state,
action-control lifecycle, composer lifecycle, or other construction-UI
material discovered during the authorized observation.

A positive generation-start candidate must:

- transition after the oracle action;
- be current to the same disposable Chat and lifecycle;
- not already be true in the pre-action state;
- not be inferred merely from submission acknowledgement or route change;
- not use Assistant Message DOM or body content; and
- return ambiguous when signal cardinality or identity is unclear.

```text
GENERATION_START_POSITIVE_TRANSITION:
OBSERVED / NOT_OBSERVED / AMBIGUOUS / NOT_REACHED
```

## Assistant-completion Signal Plan

Completion is a third independent lifecycle judgment. It requires an earlier
positive generation-start state and a later positive transition into a
construction-UI completion state.

Completion must not be inferred only from:

- disappearance or non-observation of a generation control;
- a quiet interval;
- editor availability alone;
- route stability;
- assumed response duration; or
- Assistant Message body/content.

The characterization inventories positive completion candidates and preserves
their identity/currentness relation to the observed generation lifecycle.

```text
COMPLETION_POSITIVE_TRANSITION:
OBSERVED / NOT_OBSERVED / AMBIGUOUS / NOT_REACHED
```

The lifecycle remains explicitly separated:

```text
ACTION_EVENT_ACKNOWLEDGED
!= USER_SUBMISSION_POSITIVE
!= GENERATION_STARTED_POSITIVE
!= ASSISTANT_COMPLETION_POSITIVE
```

## Mutation-budget Comparison

| Option | Mutation | Reproducibility | Fail Closed / provenance risk | Assessment |
|---|---|---|---|---|
| C1 — one disposable Chat / one User submission | one creation, one fill, one manual Send, at most one completion | one-run Evidence only | minimum; failure stops without retry | RECOMMENDED INITIAL ROUND |
| C2 — one disposable Chat / two cycles | one creation, two fills/actions/responses | same-chat repeatability | larger state and ambiguity surface | DEFER |
| C3 — two disposable Chats / one cycle each | two creations and two independent lifecycles | fresh-state repeatability | highest initial mutation and coordination cost | DEFER |

```text
CHARACTERIZATION_MUTATION_BUDGET: C1_ONE_DISPOSABLE_CHAT_ONE_USER_SUBMISSION
```

C1 is incremental. A partial or aborted result does not authorize C2/C3 or a
retry. Reproducibility needs are decided only in Characterization Review.

## Runtime Binding Plan

The disposable Chat binding contract is:

1. create exactly one fresh Standard Chat under separate explicit
   authorization;
2. bind the handle returned by that creation operation;
3. require created-handle and current-handle match cardinality exactly 1;
4. keep creation, fill, user checkpoint, action, and lifecycle observation in
   the same browser/tool session;
5. fail closed if the handle is lost, ambiguous, unreachable, or replaced;
6. never select a personal or historical tab by active state, order, title,
   approximate location, composer presence, or Message state;
7. persist no raw locator; and
8. require no cross-session continuation or disposable-tab reuse after the
   characterization stops.

Disposable cleanup is outside this Plan and is not automatically authorized.

## Characterization Result-state Model

```text
CHARACTERIZATION_EXECUTION:
NOT_STARTED / SUCCESS / PARTIAL / ABORTED

ACTION_ORACLE_ESTABLISHED:
YES / NO / NOT_REACHED

ACTION_IDENTITY_CONTINUITY:
PASS / FAIL / NOT_REACHED

ACTION_DISPATCH_ACK:
YES / NO / NOT_REACHED

SUBMISSION_POSITIVE_TRANSITION:
OBSERVED / NOT_OBSERVED / AMBIGUOUS / NOT_REACHED

GENERATION_START_POSITIVE_TRANSITION:
OBSERVED / NOT_OBSERVED / AMBIGUOUS / NOT_REACHED

COMPLETION_POSITIVE_TRANSITION:
OBSERVED / NOT_OBSERVED / AMBIGUOUS / NOT_REACHED
```

`SUCCESS` requires all required checkpoints to complete and every required
positive transition to be observed without ambiguity. `PARTIAL` preserves
safe completed stages but cannot adopt a relation or authorize Attempt 4.
`ABORTED` is used when a Fail Closed condition stops the run.

Even `SUCCESS` requires Characterization Review and a later Candidate Decision.

## Fail Closed Contract

Stop without retry for:

- fresh disposable target binding count other than 1;
- Runtime handle loss or currentness ambiguity;
- adopted editor relation failure;
- pre-fill action identity ledger incomplete;
- fill verification failure;
- post-fill identity continuity unavailable;
- observer not safely armed before user action;
- user action outside the ready checkpoint;
- Action Oracle not independently established;
- oracle target mapping count 0 or 2+;
- action candidate ambiguity;
- dispatch/event acknowledgement failure;
- dispatch stage unknown;
- post-action observation failure;
- positive submission transition unavailable or ambiguous;
- generation-start transition unavailable or ambiguous;
- completion transition unavailable or ambiguous;
- unexpected external mutation;
- second action, duplicate action, regenerate, edit, branch, or navigation;
- browser operation error; or
- any privacy-safe output boundary failure.

No result is repaired from later lifecycle stages or Message inventory.

## No-fallback Contract

Prohibited:

- first or last button;
- DOM order or visual position;
- raw labels, accessible strings, or localized text;
- keyboard Send fallback;
- direct form submission fallback;
- alternate event mechanism fallback;
- hidden control;
- second action after ambiguity;
- retry;
- Message DOM or Message count repair;
- runtime Message identity repair;
- characterization result self-approval; and
- Ground-Truth-assisted action selection.

```text
CONFIRMED_SEND_FALLBACK: NONE
```

## Privacy Boundary

The execution Evidence may contain only:

- disposable safe alias;
- safe action aliases;
- counts and booleans;
- element-identity equality and transition classes;
- safe structural semantic classes;
- operation stages and fixed safe errors;
- oracle classifications; and
- lifecycle result states.

Forbidden from Evidence, logs, and reports:

- raw synthetic prompt;
- Assistant content;
- identifying metadata or raw location;
- raw tab identity or locator;
- raw labels or accessible strings;
- DOM/HTML;
- Message identities;
- browser exception text; and
- authentication material.

The raw synthetic content and action/event objects may exist only in Runtime
memory for the minimum operation and comparison period.

## Long-100 Status Impact

This Plan changes no Long-100 construction state:

```text
LONG_100_CONSTRUCTION_STATE: BLOCKED
LONG_100_COMPLETED_CYCLES: 0
LONG_100_USER_SUBMISSIONS: 0
LONG_100_ASSISTANT_COMPLETIONS: 0
LONG_100_NEXT_EXPECTED_CYCLE: 1
LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED
```

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: unchanged; Conversation acquisition is not started.
- FR-008 / NFR-001 / NFR-002 / ADR-006: supported by independent oracle,
  stage separation, positive-signal requirements, and no retry/fallback.
- NFR-007 / TV-005 / TV-006: no loading or completeness validation occurs.
- AT-007 / AT-008: traceability only; no Production Acceptance Test runs.
- RISK-002: unchanged and open.
- Source-of-Truth semantics: unchanged.
- Production implementation: none.

## Repository / Security Check

- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan: **PASS** (`0` findings).
- Direct raw web-location scan: **PASS**.
- Direct UUID-like value scan: **PASS**.
- Direct raw synthetic marker scan: **PASS**.
- Direct DOM/HTML dump scan: **PASS**.
- Direct credential/cookie/token/secret value scan: **PASS**.
- Source-of-Truth and all historical Evidence hashes unchanged: **PASS**.
- Send-action Decision Reconciliation Evidence unchanged: **PASS**.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001/TASK-002 assets,
  and prior TASK-003 Evidence unchanged: **PASS**.
- Changed repository scope: this new Scope and Safety Plan Evidence only.
- Production implementation: none.

## Next Explicit Authorization Required

A future execution requires one new explicit authorization covering only:

1. creation of exactly one disposable Standard Chat;
2. exactly one synthetic editor fill;
3. arming the safe identity/event/lifecycle observer;
4. exactly one user-mediated manual Send action after `USER_ACTION_READY`;
5. at most one User submission and one Assistant completion; and
6. read-only post-action lifecycle observations within the same session.

It must explicitly exclude Long-100/Long-200 construction, retries, alternate
actions, Message enumeration, scrolling, TV-005/TV-006 Discovery, PoC, and
Production work.

## Final Status

```text
CHARACTERIZATION_SCOPE_PLAN: COMPLETE
CHARACTERIZATION_ACTION_ORACLE: COMBINED
USER_INTERVENTION_REQUIRED: YES
ACTION_IDENTITY_CONTINUITY_LEDGER: PLANNED
ACTION_EXECUTION_ACK_CONTRACT: ADOPTED
CHARACTERIZATION_MUTATION_BUDGET: C1_ONE_DISPOSABLE_CHAT_ONE_USER_SUBMISSION
CHARACTERIZATION_EXECUTION: NOT_STARTED

SEND_ACTION_CANDIDATE_RELATION: INSUFFICIENT_EVIDENCE
SUBMISSION_SUCCESS_SIGNAL: INSUFFICIENT_EVIDENCE
SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED: YES
ATTEMPT_4_READINESS: BLOCKED
CONFIRMED_SEND_FALLBACK: NONE

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

`TASK-003 Construction Send Lifecycle Characterization — C1 Execution Authorization`

Do not create the disposable Chat or request the manual user action until that
separate authorization is provided.
