# TASK-003 Construction Send Lifecycle Characterization — Interactive Handoff Mechanism Review

## Status

- Scope: construction-tooling interactive handoff mechanism review only
- Browser mutation: none
- Browser live observation: none
- Characterization C1 re-execution: none
- Historical Evidence modified: false
- Long-100 state changed: false

```text
SAME_EXECUTION_REQUIREMENT: IMPLEMENTATION_SPECIFIC
H1_CAPABILITY: NOT_ESTABLISHED
H2_CAPABILITY: CONDITIONALLY_SUPPORTED
H3_CAPABILITY: INSUFFICIENT_FOR_ORACLE
INTERACTIVE_HANDOFF_MECHANISM: NONE_ESTABLISHED
COMBINED_ORACLE_COMPATIBILITY: CONDITIONAL
HANDOFF_MECHANISM_CHARACTERIZATION_REQUIRED: YES
INTERACTIVE_HANDOFF_CAPABILITY: NOT_ESTABLISHED
CHARACTERIZATION_C1_READINESS: BLOCKED
```

## Review Basis

This review uses the repository-current Source of Truth and chronological TASK-003 Evidence through the aborted C1 execution. It also reviews the available construction/browser-tool capability boundary without connecting to or mutating a real ChatGPT Chat.

The capability boundary establishes two relevant facts:

1. browser/runtime bindings may persist across later operations, but a tab binding is a separate, fallible binding; and
2. asynchronous callbacks cannot return a result after their tool operation has completed merely because a Runtime object still exists.

No formally supported user-input checkpoint primitive was established that pauses one active browser/tool execution, accepts an external manual action, and resumes that same execution with its observer result.

The absence of such a proven H1 primitive is not proof that every cross-operation handoff is impossible. H2 is therefore reviewed separately rather than rejected by inference.

## C1 Abort Integrity

The historical C1 result remains valid and unchanged:

```text
INTERACTIVE_HANDOFF_CAPABILITY: NOT_ESTABLISHED
CHARACTERIZATION_EXECUTION: ABORTED_BEFORE_MUTATION
```

No disposable Chat, fill, observer, manual-action request, User submission, or Assistant completion occurred. This review does not reinterpret that abort as an attempted characterization.

## Safety Objective

The safety invariant is not the identity of an agent turn or tool call. The required invariant is an independently current observation chain:

1. the intended disposable target is bound exactly once;
2. the independent observer is armed before the user action;
3. the observer and target remain current to the same characterization session;
4. exactly one later user action is captured by that observer;
5. its event buffer can be retrieved without replacement or heuristic re-binding;
6. stale, previous-session, other-tab, pre-arm, and second-action events are excluded; and
7. the oracle event maps to exactly one inventoried safe action alias.

This invariant may be implemented within one continuously live operation or across operations if the latter proves equivalent observer, target, context, ordering, and buffer continuity.

## Same-execution Requirement Classification

```text
SAME_EXECUTION_REQUIREMENT: IMPLEMENTATION_SPECIFIC
```

Strict same-execution pause/resume is a sufficient implementation strategy for the safety objective, but is not intrinsically the only possible strategy. A cross-operation mechanism can be equally safe only if it positively proves all continuity and currentness properties instead of assuming them.

This classification does not retroactively relax the historical C1 gate. The C1 Scope Plan selected H1-style same-session execution, and C1 correctly aborted because that selected mechanism was not established. C1 remains blocked until a reviewed replacement mechanism is established and incorporated in a later execution authorization.

## H1 — Strict Same-execution Pause / Resume

### Required properties

- one live browser/tool execution;
- exact Runtime and target handle retention;
- observer retention;
- visible safe ready checkpoint;
- external user action while execution waits;
- same execution resumes; and
- observer buffer is read before that execution ends.

### Assessment

The current capability surface does not establish a formal mid-operation user-input handshake with these guarantees. Persistent Runtime bindings across calls are not the same as a single live operation. A long-running call, delayed callback, or assumption that the user will act within an unspecified interval does not constitute a supported checkpoint contract.

```text
H1_CAPABILITY: NOT_ESTABLISHED
```

This is an evidence classification, not a claim that the platform can never provide such a primitive.

## H2 — Persistent In-page Observer Across Operation Boundary

### Conceptual viability

H2 can satisfy the safety objective in principle if operation A installs a non-interfering observer and current session marker into one exact document, the user acts after a separately established armed checkpoint, and operation B proves it is reading the same document, observer generation, session, and event sequence.

H2 does not require the same agent turn or same active tool call. It does require stronger explicit evidence about page/document and in-page state continuity.

### Current support boundary

- Persistent browser binding across later operations: supported as a general capability.
- Exact target tab re-binding across operation boundary: possible only through a separately proven exact locator; not established for this disposable target.
- Same page/document after the user action: not established.
- Same JavaScript execution context: not established.
- Same observer instance or generation: not established.
- In-page event-buffer survival and later read: not established.
- Stale-buffer exclusion: contract can be defined, but behavior is not yet characterized.
- Reload, navigation, context replacement, and SPA lifecycle effects: not characterized.

Therefore H2 is feasible enough to justify a focused mechanism characterization but not proven enough to authorize C1.

```text
H2_CAPABILITY: CONDITIONALLY_SUPPORTED
```

The condition is successful observer-continuity characterization plus exact Runtime re-binding.

## H3 — Re-bind After Manual Action Without Persistent Observer

H3 can inspect only a later UI state. It cannot independently capture which human-intended control received the action, correlate its event target to a pre-inventoried safe alias, or distinguish a stale/post-hoc state from the actual action boundary.

It therefore cannot preserve the current `COMBINED` oracle. Post-action UI inspection may later inform lifecycle diagnostics, but it cannot replace the missing independent event correlation.

```text
H3_CAPABILITY: INSUFFICIENT_FOR_ORACLE
```

## Other Supported Mechanisms

No documented or directly inspectable alternative handshake primitive is established in the current capability surface.

The following do not qualify as an alternative mechanism:

- ending an agent turn and heuristically selecting a tab later;
- relying on active tab, tab order, title approximation, composer presence, or Message state;
- assuming a delayed callback remains reportable after its tool operation ends;
- asking the user to act during an arbitrary fixed wait interval;
- inferring the action from later UI state; or
- replacing the independent oracle with a harness-selected action.

## Continuity-property Matrix

`Required` means the mechanism must preserve or prove that property. `Current` reports what is established for this characterization, not what may be technically possible in another environment.

| Continuity property | H1 | H2 | H3 | Current establishment |
|---|---|---|---|---|
| Same agent conversational turn | implementation artifact | not required | not required | available only while a turn is active |
| Same browser automation session | required | persistent binding or exact reconnect required | exact reconnect required | general binding persistence supported; target continuity not proven |
| Same target page/document | required | required | later target only | not established across user action |
| Same JavaScript execution context | required | required | not preserved | not established |
| Same in-page observer instance/generation | required | required | absent | not established |
| Same Runtime handle | required | optional if exact re-binding proves equivalence | optional if exact re-binding | prior Evidence proves ephemeral handle loss can occur |
| Same exact browser locator | supportive | required for re-binding | required for re-binding | user-mediated exact method is reviewed; no current disposable locator exists |
| Observer armed before action | required | required | impossible to prove without observer | not reached |
| Event buffer current after action | required | required | unavailable | not established |
| Event sequence after arm | required | required | unavailable | not established |
| Ready-before-action ordering | required | required | not independently provable | no supported cross-boundary handshake established |
| Exact oracle target correlation | required | required | unavailable | not reached |

The matrix intentionally distinguishes conversational, automation, document, JavaScript-context, observer, handle, and locator continuity. None is treated as a synonym for another.

## Minimum Observer Continuity Contract for H2

H2 may be eligible for later adoption only if a focused characterization proves all fields below without using raw identifying metadata.

| Contract field | Required result | Failure meaning |
|---|---|---|
| `OBSERVER_ARMED_BEFORE_USER_ACTION` | true | pre-arm or unknown event window |
| `TARGET_BINDING_EXACTLY_ONE` | true at arm and retrieval | ambiguous or replaced target |
| `CHARACTERIZATION_SESSION_IDENTITY_MATCH` | true | stale/other session |
| `OBSERVER_INSTANCE_OR_GENERATION_MATCH` | true | observer replacement or loss |
| `BUFFER_CURRENTNESS_ESTABLISHED` | true | stale or unbounded buffer |
| `EVENT_SEQUENCE_AFTER_ARM` | true | pre-arm event contamination |
| `EVENT_SEQUENCE_EXACT_INCREMENT` | exactly 1 | missing or multiple action events |
| `NO_RELOAD_OR_CONTEXT_REPLACEMENT` | true | document/JavaScript context invalidated |
| `NO_UNEXPECTED_NAVIGATION` | true | currentness boundary unresolved |
| `NO_SECOND_USER_ACTION` | true | oracle cardinality invalid |
| `ORACLE_EVENT_TARGET_MATCH_EXACTLY_ONE` | true | zero/multiple safe-alias correlation |

### Safe state design

A mechanism characterization may use Runtime-generated, content-independent safe material such as:

- one characterization-session alias;
- an observer generation number;
- an armed boolean;
- a pre-arm sequence value;
- an event sequence value;
- an exact event count;
- a page-context continuity boolean; and
- an invalidated/cleaned-up boolean.

The session alias must be generated independently of title, URL, Message body, action text, DOM order, or Ground Truth. It labels the mechanism session and does not identify a Conversation.

### Ordering and stale-event exclusion

1. create a fresh safe session alias and observer generation;
2. clear or reject any prior buffer before arm;
3. record the pre-arm sequence;
4. arm exactly one observer generation;
5. expose ready only after arm confirmation;
6. accept only an event with the same session/generation and a sequence strictly after arm;
7. require an exact single increment for the authorized action window;
8. invalidate on reload, context replacement, unexpected navigation, observer replacement, target mismatch, second action, or unknown ordering;
9. retrieve once; and
10. clean up or mark the session permanently closed.

Cleanup failure prevents reuse. No stale buffer may be interpreted as a later run.

## Runtime Re-binding Impact

Attempt 2 established that an ephemeral handle may become unreachable. H2 therefore cannot rely on a historical handle alone.

Any cross-operation H2 run must use:

```text
RUNTIME_REBINDING_METHOD: USER_MEDIATED_EXACT_RUNTIME_LOCATOR
```

or another exact method separately proven before adoption. The raw locator remains Runtime-only. Re-binding match cardinality must be exactly 1, followed by positive session, document/context, observer-generation, and buffer-currentness checks.

Exact locator equality is necessary but not sufficient: the same locator does not by itself prove the same page document, JavaScript context, observer instance, or buffer.

Forbidden re-binding inputs remain:

- tab order or first tab;
- active tab;
- title approximation;
- URL-shape inference;
- composer presence;
- empty-state inference;
- Message content/count/state; and
- heuristic selection among multiple candidates.

## Combined Oracle Compatibility

The current oracle remains:

```text
CHARACTERIZATION_ACTION_ORACLE: COMBINED
```

- H1: compatible in design, but capability is not established.
- H2: compatible only if the continuity contract is proven and the pre-armed observer captures the user action independently.
- H3: incompatible because no action event target is captured.

```text
COMBINED_ORACLE_COMPATIBILITY: CONDITIONAL
```

No mechanism may replace the user human-intended action plus independent event correlation with harness candidate self-selection.

## Mechanism Decision

| Mechanism | Safety objective | Circularity risk | Stale/binding risk | Current support | C1 suitability |
|---|---|---|---|---|---|
| H1 same execution | satisfies if supported | low | low | not established | blocked |
| H2 persistent in-page observer | can satisfy under full continuity contract | low | material until characterized | conditional | blocked pending characterization |
| H3 post-action re-bind only | does not preserve event oracle | post-hoc self-confirmation risk | high | technically inspectable but oracle-incomplete | rejected for C1 oracle |
| Other | no supported candidate | unknown | unknown | none established | blocked |

No mechanism currently satisfies both capability evidence and the Combined Oracle contract.

```text
INTERACTIVE_HANDOFF_MECHANISM: NONE_ESTABLISHED
INTERACTIVE_HANDOFF_CAPABILITY: NOT_ESTABLISHED
```

H2 is the only evidence-supported next mechanism candidate. It is not adopted by this review.

## Handoff Mechanism Characterization Need

```text
HANDOFF_MECHANISM_CHARACTERIZATION_REQUIRED: YES
```

A separate, non-Long-100 mechanism characterization is required before C1. Its scope must be limited to:

- same safe session/generation survival across operation boundaries;
- ready-after-arm ordering;
- exact target and page-context identity;
- event-buffer retrieval;
- exact one-event sequence accounting;
- stale-event rejection;
- invalidation on context replacement; and
- single-use cleanup.

It must not test Long-100 construction, Send-action candidate selection, Message acquisition, Message count, scrolling, TV-005/TV-006, or Production behavior. If proving H2 requires browser state mutation or a user action, that requires separate explicit authorization.

## Characterization C1 Readiness

```text
CHARACTERIZATION_C1_READINESS: BLOCKED
```

C1 may be reconsidered only after:

1. H2 mechanism characterization succeeds without ambiguity;
2. Characterization Review confirms every continuity property;
3. an updated C1 execution contract adopts the proven mechanism; and
4. the user separately authorizes the C1 mutation budget.

H2 conceptual feasibility alone is not readiness.

## Long-100 Impact

No Long-100 state changes:

```text
LONG_100_CONSTRUCTION_STATE: BLOCKED
LONG_100_COMPLETED_CYCLES: 0
LONG_100_NEXT_EXPECTED_CYCLE: 1
LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED
```

No occurrence was created or consumed. The frozen ledger and Ground Truth separation remain intact.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: unchanged; no Conversation capture or construction occurred.
- FR-008 / NFR-001 / NFR-002 / ADR-006: supported by distinguishing safety objectives from implementation assumptions and retaining Fail Closed while continuity is unproven.
- TV-005 / TV-006: no Discovery or validation occurred; Verdicts remain not set.
- RISK-002: unchanged and open.
- Source-of-Truth semantics: unchanged.
- Production implementation: none.

## Privacy Boundary

No real ChatGPT Chat, tab inventory, UI content, DOM, or event object was inspected. No browser mutation occurred.

Evidence contains only mechanism classifications, safe contract field names, booleans, lifecycle relationships, and fixed state codes. It contains no raw locator, URL/pathname, Conversation identifier, tab identifier, label, accessible string, DOM/HTML, synthetic content, Message identity/content, browser exception, cookie, token, credential, or authorization value.

## Repository / Security Check

- `git diff --check`: PASS
- new untracked Evidence whitespace check: PASS
- trailing-whitespace findings: 0
- direct prohibited-value pattern scan: PASS
- raw URL / UUID-like value / credential assignment detected: false
- raw Conversation/Message content, DOM/HTML, event object, or Runtime locator detected: false
- historical Source-of-Truth and Evidence hashes checked: 20
- historical hash mismatches: 0
- changed scope: this new Evidence file only
- `docs/`, `AGENTS.md`, `src/`, and Production files changed: false
- Production implementation: none

## Recommended Next Action

`TASK-003 Construction Send Lifecycle Characterization — H2 Observer Continuity Mechanism Characterization Scope / Authorization`

Do not re-run C1 until that separate mechanism characterization is reviewed and the H2 contract is explicitly adopted.

## Final Status

```text
SAME_EXECUTION_REQUIREMENT:
IMPLEMENTATION_SPECIFIC

H1_CAPABILITY:
NOT_ESTABLISHED

H2_CAPABILITY:
CONDITIONALLY_SUPPORTED

H3_CAPABILITY:
INSUFFICIENT_FOR_ORACLE

INTERACTIVE_HANDOFF_MECHANISM:
NONE_ESTABLISHED

COMBINED_ORACLE_COMPATIBILITY:
CONDITIONAL

HANDOFF_MECHANISM_CHARACTERIZATION_REQUIRED:
YES

INTERACTIVE_HANDOFF_CAPABILITY:
NOT_ESTABLISHED

CHARACTERIZATION_C1_READINESS:
BLOCKED

CHARACTERIZATION_EXECUTION:
ABORTED_BEFORE_MUTATION

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
