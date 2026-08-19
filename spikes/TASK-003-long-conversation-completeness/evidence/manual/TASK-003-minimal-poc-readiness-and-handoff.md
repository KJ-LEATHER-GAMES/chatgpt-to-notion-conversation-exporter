# TASK-003 Minimal PoC Readiness and Handoff

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Handoff target: Minimal PoC / Self-test
- Manual DOM Discovery: **COMPLETE**
- TV-005 Candidate Decision: **ADOPTED**
- TV-006 Candidate Decision: **ADOPTED**
- TV-005 Final Verdict: **NOT SET**
- TV-006 Final Verdict: **NOT SET**
- TASK-003 Final Exit: **NOT SET**
- Production implementation: **OUT OF SCOPE**
- Historical Evidence replacement: **NO**

This document is the final handoff from the completed manual Discovery phase into the Minimal PoC phase.

Its purpose is to ensure that the Minimal PoC:

1. codifies the already-adopted runtime relations;
2. does not reopen Discovery without a contradiction;
3. proves positive and Fail-Closed behavior through deterministic self-tests;
4. does not use Ground Truth to self-approve completeness;
5. remains a validation PoC rather than becoming Phase 1 Production implementation.

---

# 2. Source Documents for This Handoff

The Minimal PoC should be implemented against the consolidated TASK-003 evidence set:

1. `TASK-003-manual-discovery-scope-and-safety-plan.md`
2. `TASK-003-manual-fixture-construction-and-ground-truth.md`
3. `TASK-003-tv005-tv006-manual-discovery-protocol.md`
4. `TASK-003-tv005-tv006-observation-and-evidence-contract.md`
5. `TASK-003-long-100-initial-and-fixed-step-discovery.md`
6. `TASK-003-long-100-visibility-and-recovery-characterization.md`
7. `TASK-003-long-100-method-qualification.md`
8. `TASK-003-long-200-baseline-and-reproducibility-validation.md`
9. `TASK-003-tv005-tv006-candidate-decision.md`
10. `TASK-003-manual-discovery-final-review-and-deferred-items.md`
11. this document

Earlier detailed construction / send-lifecycle / failed-attempt documents remain Historical Evidence and are not replaced.

---

# 3. Minimal PoC Readiness Decision

Decision:

```text
MINIMAL_POC_READINESS:
READY
```

Reason:

```text
Long-100:
- incomplete candidate observed
- false-complete counterexample established
- visibility dependency characterized
- generic visible-only recovery succeeded
- method gate passed

Long-200:
- 20% visible-only baseline passed
- candidate-only continuity established
- Ground Truth matched after classification freeze
- explicit reload reproducibility passed

Candidate Decision:
- TV-005 relation adopted
- TV-006 relation adopted
- Fail Closed relation adopted
```

No additional manual DOM Discovery is required before PoC generation.

---

# 4. PoC Objective

The Minimal PoC must answer:

> Can the adopted TV-005 traversal relation and TV-006 completeness relation be represented in code and proven by self-tests without depending on Ground Truth for runtime approval?

The PoC is not intended to:

- export to Notion;
- implement popup UX;
- implement diff append;
- implement Production retry logic;
- optimize performance;
- optimize scroll percentage;
- support every browser lifecycle state;
- support Project Chat long-conversation coverage unless separately scoped;
- replace the Phase 1 production architecture.

---

# 5. Adopted Message-unit Relation

The PoC should use the validated mounted Message unit:

```text
section[data-testid^="conversation-turn-"]
```

Ordinal source:

```text
data-testid = conversation-turn-N
```

Runtime Message identity source:

```text
data-message-id
```

Cross-check identity source:

```text
data-turn-id
```

Role source:

```text
data-message-author-role
```

The Minimal PoC must preserve the established distinction:

```text
data-message-id
=
runtime capture / dedup identity

NOT:
canonical persistent OpenAI message ID
```

---

# 6. Adopted TV-005 Traversal Contract

The Minimal PoC must codify the following baseline relation.

```text
PRECONDITION
document.visibilityState === "visible"
AND
document.hidden === false

START
programmatic Top reset

DIRECTION
Top -> Bottom

STEP
20% current viewport height

SETTLE
scrollTop
+
scrollHeight
+
clientHeight
+
full ordered mounted ordinal array

CAPTURE
validated mounted Message units

ACCUMULATION
fresh run-local runtime identity union

CROSS-CHECK
ordinal
data-turn-id
role
DOM ordinal order

TERMINATION
Bottom geometry candidate

FORBIDDEN TERMINATION
expected count reached
union count reached
one no-new-ID observation
short local convergence
mounted count stable
scrollHeight stable alone
```

The 20% value is the TASK-003 Formal Technical Baseline.

It is not a Production constant.

---

# 7. Visibility Contract

Required helper:

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

The PoC traversal must check visibility:

```text
before run
before scroll
during settle
after scroll
at capture
```

If visibility becomes invalid:

```text
BLOCKED
```

The same run must not silently resume and later classify Complete.

`document.hasFocus()` is not a required precondition.

---

# 8. Scroll-container Contract

The PoC should require exactly one valid scroll container for the observed Message region.

Representative discovery relation:

```javascript
function findScroller(turnSelector) {
  const firstTurn =
    document.querySelector(
      turnSelector
    );

  let node =
    firstTurn?.parentElement ?? null;

  const candidates = [];

  while (node) {
    const style =
      getComputedStyle(node);

    const scrollable =
      node.scrollHeight >
        node.clientHeight + 1 &&
      (
        style.overflowY === "auto" ||
        style.overflowY === "scroll" ||
        style.overflowY === "overlay"
      );

    if (scrollable) {
      candidates.push(node);
    }

    node = node.parentElement;
  }

  return {
    count:
      candidates.length,

    element:
      candidates.length === 1
        ? candidates[0]
        : null
  };
}
```

Fail Closed if:

```text
count != 1
```

or the accepted container changes during the run.

---

# 9. Settle Contract

The Minimal PoC must not revert to count/min/max-only stability.

Required sampled signature:

```javascript
const signature =
  JSON.stringify({
    scrollTop:
      Math.round(
        scroller.scrollTop
      ),

    scrollHeight:
      scroller.scrollHeight,

    clientHeight:
      scroller.clientHeight,

    mountedOrdinals:
      getMountedOrdinals()
  });
```

Representative wait relation:

```javascript
async function waitForStableVisibleDOM({
  scroller,
  getMountedOrdinals,
  maxSamples = 50,
  intervalMs = 250,
  requiredStableSamples = 3
}) {
  let previousSignature = null;
  let stableSamples = 0;

  for (
    let i = 0;
    i < maxSamples;
    i++
  ) {
    await new Promise(resolve =>
      setTimeout(resolve, intervalMs)
    );

    if (!visibleNow()) {
      return {
        settled: false,
        blocked: true,
        reason:
          "PAGE_BECAME_HIDDEN"
      };
    }

    const signature =
      JSON.stringify({
        scrollTop:
          Math.round(
            scroller.scrollTop
          ),

        scrollHeight:
          scroller.scrollHeight,

        clientHeight:
          scroller.clientHeight,

        mountedOrdinals:
          getMountedOrdinals()
      });

    if (
      signature ===
      previousSignature
    ) {
      stableSamples++;
    } else {
      previousSignature =
        signature;

      stableSamples = 1;
    }

    if (
      stableSamples >=
      requiredStableSamples
    ) {
      return {
        settled: true,
        blocked: false
      };
    }
  }

  return {
    settled: false,
    blocked: true,
    reason:
      "DOM_STABILITY_TIMEOUT"
  };
}
```

A future Production implementation may improve this mechanism.

The Minimal PoC should codify the validated relation rather than redesign it.

---

# 10. Capture Contract

For each mounted Message section, the PoC must require:

```text
exactly one runtime Message identity
exactly one turn identity
exactly one role
valid positive ordinal
```

Representative helper:

```javascript
function exactlyOneWithin(
  section,
  attr
) {
  const nodes = [
    ...(section.matches(
      `[${attr}]`
    )
      ? [section]
      : []),

    ...section.querySelectorAll(
      `[${attr}]`
    )
  ];

  return {
    count:
      nodes.length,

    value:
      nodes.length === 1
        ? nodes[0]
            .getAttribute(attr)
            ?.trim() ?? ""
        : null
  };
}
```

Any cardinality ambiguity must reject the capture.

---

# 11. Run-local Accumulator Contract

The Minimal PoC should create a fresh accumulator per formal run.

```javascript
function createRunState() {
  return {
    runtimeMeta:
      new Map(),

    ordinalToRuntime:
      new Map(),

    turnToRuntime:
      new Map(),

    snapshots:
      [],

    failed:
      false,

    blocked:
      false,

    blockedReason:
      null,

    topEstablished:
      false,

    bottomEstablished:
      false
  };
}
```

No runtime identity set may be reused from an earlier Conversation scan.

---

# 12. Identity Invariants

The PoC must enforce:

```text
runtime ID -> exactly one ordinal
runtime ID -> exactly one turn ID
runtime ID -> exactly one role

ordinal -> exactly one runtime ID
turn ID -> exactly one runtime ID
```

Representative check:

```javascript
function validateIdentityRelation(
  state,
  item
) {
  const previous =
    state.runtimeMeta.get(
      item.runtimeId
    );

  if (
    previous &&
    (
      previous.ordinal !==
        item.ordinal ||
      previous.turnId !==
        item.turnId ||
      previous.role !==
        item.role
    )
  ) {
    return {
      ok: false,
      reason:
        "RUNTIME_METADATA_CONFLICT"
    };
  }

  const byOrdinal =
    state.ordinalToRuntime.get(
      item.ordinal
    );

  if (
    byOrdinal &&
    byOrdinal !==
      item.runtimeId
  ) {
    return {
      ok: false,
      reason:
        "ORDINAL_RUNTIME_CONFLICT"
    };
  }

  const byTurn =
    state.turnToRuntime.get(
      item.turnId
    );

  if (
    byTurn &&
    byTurn !==
      item.runtimeId
  ) {
    return {
      ok: false,
      reason:
        "TURN_RUNTIME_CONFLICT"
    };
  }

  return {
    ok: true
  };
}
```

---

# 13. DOM-order Invariant

Within each mounted snapshot, ordinals must be strictly increasing.

```javascript
function isStrictlyIncreasing(
  ordinals
) {
  return ordinals.every(
    (value, index) =>
      index === 0 ||
      value >
        ordinals[index - 1]
  );
}
```

Failure means:

```text
INCONSISTENT / FAIL CLOSED
```

not sorting and silently repairing the input.

---

# 14. TV-006 Ordinal Continuity Relation

After traversal, candidate completeness must evaluate the **distinct observed ordinal union**.

```javascript
function findOrdinalGaps(
  ordinalIterable
) {
  const ordinals = [
    ...new Set(
      ordinalIterable
    )
  ].sort((a, b) => a - b);

  const gaps = [];

  for (
    let i = 1;
    i < ordinals.length;
    i++
  ) {
    const previous =
      ordinals[i - 1];

    const current =
      ordinals[i];

    if (
      current >
      previous + 1
    ) {
      gaps.push({
        afterOrdinal:
          previous,

        beforeOrdinal:
          current,

        missingOrdinalCount:
          current -
          previous -
          1
      });
    }
  }

  return {
    ordinals,
    gaps
  };
}
```

Candidate continuity requires:

```text
first observed ordinal = 1
AND
internal gap count = 0
```

No expected fixture total is needed.

---

# 15. Candidate Classification Contract

The Minimal PoC should expose a pure classification function separate from DOM traversal.

Recommended shape:

```javascript
function classifyCandidate({
  pageVisibleThroughout,
  topEstablished,
  bottomEstablished,
  observedOrdinals,
  captureRejected,
  identityConflict,
  domOrderConsistent,
  blocked,
  ambiguous = false
}) {
  if (blocked) {
    return "BLOCKED";
  }

  if (ambiguous) {
    return "AMBIGUOUS";
  }

  if (
    captureRejected ||
    identityConflict ||
    !domOrderConsistent
  ) {
    return "INCONSISTENT";
  }

  if (
    !pageVisibleThroughout ||
    !topEstablished ||
    !bottomEstablished
  ) {
    return "UNKNOWN";
  }

  const {
    ordinals,
    gaps
  } = findOrdinalGaps(
    observedOrdinals
  );

  if (
    ordinals.length === 0 ||
    ordinals[0] !== 1 ||
    gaps.length > 0
  ) {
    return "INCOMPLETE";
  }

  return "COMPLETE_CANDIDATE";
}
```

The classifier must not accept:

```text
expectedCount
```

as an input.

---

# 16. Diagnostic States

The PoC should distinguish:

```text
COMPLETE_CANDIDATE
INCOMPLETE
UNKNOWN
AMBIGUOUS
INCONSISTENT
BLOCKED
```

Recommended interpretation:

| State | Meaning |
|---|---|
| `COMPLETE_CANDIDATE` | all adopted runtime evidence supports completeness candidate |
| `INCOMPLETE` | positive runtime evidence shows missing boundary or ordinal continuity |
| `UNKNOWN` | evidence is insufficient |
| `AMBIGUOUS` | multiple plausible runtime interpretations remain |
| `INCONSISTENT` | runtime relations contradict |
| `BLOCKED` | hard execution precondition failed |

Only `COMPLETE_CANDIDATE` may proceed to positive Ground Truth comparison during validation.

---

# 17. Ground Truth Must Be Outside Runtime Classifier

The PoC architecture must make this separation explicit.

Correct:

```javascript
const candidate =
  classifyCandidate(
    runtimeObservation
  );

freeze(candidate);

const oracleResult =
  compareWithGroundTruth(
    candidate,
    groundTruth
  );
```

Incorrect:

```javascript
function classifyCandidate(
  runtimeObservation,
  expectedCount
) {
  if (
    runtimeObservation.count ===
      expectedCount
  ) {
    return "COMPLETE_CANDIDATE";
  }
}
```

---

# 18. TV-005 Positive Self-test Cases

The PoC should include deterministic synthetic tests independent of live ChatGPT DOM where possible.

## PASS-001 — Contiguous complete candidate

Input:

```text
visible throughout:
true

Top:
true

Bottom:
true

observed ordinals:
1,2,3,4,5

capture rejected:
false

identity conflict:
false

DOM order:
consistent
```

Expected:

```text
COMPLETE_CANDIDATE
```

---

## PASS-002 — Remount / duplicate observation across snapshots

Example observation sequence:

```text
snapshot A:
1,2,3

snapshot B:
2,3,4

snapshot C:
4,5
```

Runtime identity relation remains stable.

Expected final union:

```text
1-5
```

Expected classification:

```text
COMPLETE_CANDIDATE
```

provided Top / Bottom and other invariants are valid.

Purpose:

> prove that virtualization remount overlap does not create duplicate occurrences.

---

## PASS-003 — Union reaches final value before Bottom

Synthetic traversal:

```text
step 8:
union stops growing

step 9:
no new IDs

step 10:
Bottom reached
```

Expected:

```text
traversal does not stop at step 8 or 9
```

Final candidate may become:

```text
COMPLETE_CANDIDATE
```

only after Bottom and continuity checks.

---

# 19. Required Fail-Closed / Negative Self-tests

## FAIL-001 — Page hidden before traversal

Input:

```text
visible:
false
```

Expected:

```text
BLOCKED
```

Never Complete.

---

## FAIL-002 — Page becomes hidden during settle

Expected:

```text
BLOCKED
reason:
PAGE_BECAME_HIDDEN
```

The same run must not continue to Complete.

---

## FAIL-003 — Missing Top

Input:

```text
Top:
false

Bottom:
true

ordinals:
50-100
```

Expected:

```text
UNKNOWN
or
INCOMPLETE
```

depending on the chosen final diagnostic policy.

Never Complete.

The Minimal PoC should freeze one deterministic choice.

Recommended:

```text
UNKNOWN
```

when the upper boundary itself was not authenticated.

---

## FAIL-004 — Missing Bottom

Input:

```text
Top:
true

Bottom:
false

ordinals:
1-100
```

Expected:

```text
UNKNOWN
```

Never Complete.

---

## FAIL-005 — Internal ordinal gap

Input:

```text
Top:
true

Bottom:
true

ordinals:
1,2,3,5,6
```

Expected:

```text
INCOMPLETE
```

This reproduces the Long-100 false-complete class.

---

## FAIL-006 — First observed ordinal is not 1

Input:

```text
Top:
true

Bottom:
true

ordinals:
2,3,4,5
```

Expected:

```text
INCOMPLETE
```

---

## FAIL-007 — Duplicate ordinal in one mounted snapshot

Example:

```text
1,2,2,3
```

Expected capture:

```text
REJECTED
```

Expected final state:

```text
INCONSISTENT
or
BLOCKED
```

Never Complete.

---

## FAIL-008 — Duplicate runtime identity in one snapshot

Expected:

```text
capture rejected
```

Never Complete.

---

## FAIL-009 — Runtime identity changes ordinal

Example:

```text
runtime A -> ordinal 5

later:
runtime A -> ordinal 6
```

Expected:

```text
INCONSISTENT
```

---

## FAIL-010 — Runtime identity changes turn identity

Expected:

```text
INCONSISTENT
```

---

## FAIL-011 — Runtime identity changes role

Example:

```text
runtime A -> user

later:
runtime A -> assistant
```

Expected:

```text
INCONSISTENT
```

---

## FAIL-012 — One ordinal maps to two runtime identities

Example:

```text
ordinal 10 -> runtime A

later:
ordinal 10 -> runtime B
```

Expected:

```text
INCONSISTENT
```

---

## FAIL-013 — One turn identity maps to two runtime identities

Expected:

```text
INCONSISTENT
```

---

## FAIL-014 — DOM ordinal order contradiction

Example mounted snapshot:

```text
1,3,2,4
```

Expected:

```text
capture rejected
INCONSISTENT
```

The PoC must not sort the input and hide the contradiction.

---

## FAIL-015 — Message identity cardinality invalid

Examples:

```text
no data-message-id
multiple data-message-id candidates
```

Expected:

```text
capture rejected
```

---

## FAIL-016 — Turn identity cardinality invalid

Expected:

```text
capture rejected
```

---

## FAIL-017 — Role cardinality invalid

Expected:

```text
capture rejected
```

---

## FAIL-018 — Scroll container missing

Expected:

```text
BLOCKED
```

---

## FAIL-019 — Multiple scroll-container candidates

Expected:

```text
BLOCKED
```

No heuristic fallback for the Minimal PoC.

---

## FAIL-020 — Scroll container changes mid-run

Expected:

```text
BLOCKED
```

---

## FAIL-021 — DOM settle timeout

Expected:

```text
BLOCKED
```

No Complete classification from the last known snapshot.

---

## FAIL-022 — No scroll progress before Bottom

Expected:

```text
BLOCKED
```

---

# 20. Mandatory Anti-self-approval Self-tests

These tests directly protect TV-006.

## ASA-001 — Count matches expected but ordinal gap exists

Synthetic:

```text
captured count:
5

expected count:
5

ordinals:
1,2,3,5,6
```

Expected runtime classifier:

```text
INCOMPLETE
```

The expected count must not affect classification.

---

## ASA-002 — Union reaches expected count before Bottom

Input:

```text
union count:
200

Bottom:
false
```

Expected:

```text
not Complete
continue traversal
```

---

## ASA-003 — One no-new-ID sample

Input:

```text
newRuntimeIdentityCount:
0

Bottom:
false
```

Expected:

```text
continue
```

---

## ASA-004 — Repeated local convergence

Input:

```text
several consecutive steps:
newRuntimeIdentityCount = 0

Bottom:
false
```

Expected:

```text
continue or remain UNKNOWN
```

Never Complete solely because of convergence.

---

## ASA-005 — First and last ordinal present with internal gap

Input:

```text
1,2,3,9,10
```

Expected:

```text
INCOMPLETE
```

---

## ASA-006 — Top and Bottom both observed with internal gap

Input:

```text
Top:
true

Bottom:
true

ordinals:
1,2,4,5
```

Expected:

```text
INCOMPLETE
```

This is the closest synthetic equivalent of the Long-100 Round 2 counterexample.

---

# 21. Recommended Self-test Structure

Suggested file layout only; exact repository placement should follow the existing PoC convention.

```text
poc/
  tv005-tv006-long-conversation-poc.mjs
  tv005-tv006-long-conversation-poc.selftest.mjs
```

If existing TASK-001 / TASK-002 conventions use different names, preserve repository consistency rather than introducing a new naming style.

The self-test should be runnable without requiring the live Long-200 fixture for every assertion.

---

# 22. Recommended Pure Functions

The Minimal PoC should isolate pure logic from browser DOM interaction.

Recommended boundaries:

```text
extractMountedObservation()
validateMountedObservation()
mergeIntoRunAccumulator()
findOrdinalGaps()
classifyCandidate()
evaluateTraversalTermination()
compareWithGroundTruth()
```

This allows the self-test to validate TV-006 logic deterministically.

---

# 23. Recommended Runtime Observation Shape

Example:

```javascript
{
  pageVisible: true,

  scroll: {
    top: 0,
    height: 10000,
    clientHeight: 900,
    atTopCandidate: true,
    atBottomCandidate: false
  },

  mounted: [
    {
      runtimeId: "...runtime only...",
      turnId: "...runtime only...",
      ordinal: 1,
      role: "user"
    }
  ]
}
```

Runtime identity strings may exist in memory during execution.

They must not be written into permanent Evidence.

---

# 24. Recommended Safe Snapshot Shape

Persistent Evidence should prefer:

```javascript
{
  snapshot: "S001",

  visibilityState:
    "visible",

  mountedMessageCount:
    23,

  mountedOrdinalRanges:
    "1-18,196-200",

  newRuntimeIdentityCount:
    7,

  runLocalUnionRuntimeIdentityCount:
    42,

  identityConflictCount:
    0,

  captureAccepted:
    true,

  atTopCandidate:
    false,

  atBottomCandidate:
    false
}
```

Do not persist raw runtime IDs in the integrated Evidence.

---

# 25. Required PoC Fail-Closed Behavior

The Minimal PoC must prefer:

```text
UNKNOWN / INCOMPLETE / INCONSISTENT / BLOCKED
```

over an optimistic fallback.

There must be no relation equivalent to:

```javascript
tryPrimaryMethod()
  ?? tryLooseFallback()
  ?? assumeComplete();
```

Completeness is safety-critical in this task because false Complete can cause silent Message loss.

---

# 26. Required Traversal Termination Function

Recommended explicit separation:

```javascript
function shouldTerminateTraversal({
  atBottomCandidate,
  blocked
}) {
  if (blocked) {
    return {
      stop: true,
      reason:
        "BLOCKED"
    };
  }

  if (atBottomCandidate) {
    return {
      stop: true,
      reason:
        "BOTTOM_REACHED"
    };
  }

  return {
    stop: false,
    reason:
      null
  };
}
```

Inputs that must **not** be accepted here:

```text
expectedCount
unionCount
newRuntimeIdentityCount
ordinalMax
```

---

# 27. Ground Truth Comparison Function

Oracle comparison belongs after freeze.

Representative shape:

```javascript
function compareWithGroundTruth({
  frozenCandidate,
  runtimeSummary,
  groundTruth
}) {
  return {
    candidate:
      frozenCandidate,

    distinctRuntimeCountMatches:
      runtimeSummary
        .distinctRuntimeCount ===
      groundTruth
        .expectedDistinctOccurrences,

    ordinalBoundaryMatches:
      runtimeSummary
        .observedOrdinalMin === 1 &&
      runtimeSummary
        .observedOrdinalMax ===
      groundTruth
        .expectedDistinctOccurrences
  };
}
```

This function may be used by the validation harness.

Its outputs must not retroactively alter how the runtime traversal was controlled.

---

# 28. Minimal PoC Acceptance Gate

The PoC should be considered ready for Final Review only if:

```text
all required positive tests:
PASS

all Fail-Closed tests:
PASS

all anti-self-approval tests:
PASS

classifier does not accept expectedCount:
PASS

termination function does not accept unionCount:
PASS

runtime identity / ordinal / turn conflict tests:
PASS

visibility BLOCKED tests:
PASS

ordinal gap test:
PASS

Top / Bottom insufficiency tests:
PASS
```

Any failing self-test prevents TV-005 / TV-006 Final Verdict.

---

# 29. What Must Not Change During Minimal PoC

The following Candidate Decisions are frozen unless the PoC exposes a direct contradiction:

```text
visibility is required

document focus is not required

ordinal continuity is required

Top is required but insufficient

Bottom is required but insufficient

identity union is required for acquisition

union convergence is not completeness

expected count is not runtime control input

Ground Truth is post-classification only

Fail Closed is mandatory

20% is the formal validation baseline
```

If the PoC needs to change one of these to pass tests, stop and reopen Candidate Decision rather than silently changing the rule.

---

# 30. Deferred Items — Do Not Pull into PoC

The Minimal PoC must not expand to solve:

```text
40/60/80% step optimization
viewport variation
performance timing
adaptive scrolling
MutationObserver production hardening
cross-browser lifecycle support
Project Chat long-conversation coverage
maximum Conversation size
Notion integration
production UI
```

These are outside the current handoff.

---

# 31. Expected PoC Deliverables

Minimum expected outputs:

```text
PoC implementation
self-test implementation
self-test execution result
short evidence/update note
```

The PoC should follow the existing repository conventions established by TASK-001 / TASK-002 where applicable.

---

# 32. Final Review Inputs After PoC

Final TV-005 / TV-006 review should consume:

```text
Source of Truth docs
+
the 11 integrated TASK-003 documents
+
Minimal PoC source
+
self-test results
```

Final review questions:

```text
TV-005:
Does the codified traversal relation match the proven manual baseline?

TV-006:
Does the codified classifier reject every demonstrated false-complete class?

TASK-003:
Does the complete Evidence package satisfy the formal 200-Message-class exit?
```

---

# 33. Current Handoff State

```text
TASK_003_MANUAL_DISCOVERY:
COMPLETE

LONG_100_METHOD_QUALIFICATION:
PASS

LONG_200_BASELINE:
PASS

LONG_200_RELOAD_REPRODUCIBILITY:
PASS

TV_005_CANDIDATE_DECISION:
ADOPTED

TV_006_CANDIDATE_DECISION:
ADOPTED

MINIMAL_POC_READINESS:
READY

MINIMAL_POC:
NEXT

TV_005_FINAL_VERDICT:
NOT_SET

TV_006_FINAL_VERDICT:
NOT_SET

TASK_003_FINAL_EXIT:
NOT_SET
```

---

# 34. Handoff Decision

The next implementation step is authorized:

```text
GENERATE MINIMAL POC
+
GENERATE SELF-TEST
```

under the frozen contracts in this document.

No further manual scrolling / DOM Discovery is required before that work begins.
