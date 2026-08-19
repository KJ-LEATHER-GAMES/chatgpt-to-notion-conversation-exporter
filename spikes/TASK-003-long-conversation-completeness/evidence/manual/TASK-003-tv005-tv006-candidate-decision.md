# TASK-003 TV-005 / TV-006 Candidate Decision

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Validation targets:
  - TV-005 Long Conversation Loading / Traversal
  - TV-006 Completeness Signal
- Decision type: Candidate Decision
- Final Verdict: **NOT SET**
- Production implementation: **NOT PERFORMED**
- Historical Evidence replacement: **NO**

This document freezes the candidate relations selected from the completed manual Discovery.

The decision is based on:

- Long-100 initial and fixed-step Discovery;
- Long-100 false-complete counterexample;
- hidden / visible characterization;
- visible-only recovery;
- Long-100 method qualification;
- Long-200 formal baseline;
- Long-200 reload reproducibility.

---

# 2. Candidate Decision Summary

```text
TASK_003_CANDIDATE_DECISION_REVIEW:
COMPLETE

TV_005_LOADING_TRAVERSAL_RELATION:
ADOPTED

TV_006_COMPLETENESS_RELATION:
ADOPTED

VISIBILITY_PRECONDITION:
REQUIRED

DOCUMENT_FOCUS_PRECONDITION:
NOT REQUIRED

ORDINAL_CONTINUITY:
REQUIRED

TOP_BOUNDARY:
REQUIRED_NOT_SUFFICIENT

BOTTOM_BOUNDARY:
REQUIRED_NOT_SUFFICIENT

RUN_LOCAL_IDENTITY_UNION:
REQUIRED_FOR_ACQUISITION_AND_CONSISTENCY

UNION_CONVERGENCE_AS_COMPLETENESS_SIGNAL:
REJECTED

EXPECTED_COUNT_AS_RUNTIME_SIGNAL:
PROHIBITED

GROUND_TRUTH_ROLE:
POST_CLASSIFICATION_ORACLE_ONLY

FAIL_CLOSED:
REQUIRED

FALLBACK_TO_COMPLETE:
NONE

FORMAL_VALIDATION_BASELINE_STEP:
20_PERCENT_VIEWPORT

STEP_SIZE_OPTIMIZATION:
DEFERRED

VIEWPORT_VARIATION:
DEFERRED

LONG_200_RELOAD_REPRODUCIBILITY:
COMPLETED_AND_PASS

TV_005_FINAL_VERDICT:
NOT_SET

TV_006_FINAL_VERDICT:
NOT_SET

TASK_003_FINAL_EXIT:
NOT_SET
```

---

# 3. TV-005 Loading / Traversal Contract

## Decision

```text
ADOPT
```

Qualified contract:

```text
Source:
Standard Chat

Precondition:
document.visibilityState === "visible"
AND
document.hidden === false

Start:
programmatic Top reset

Direction:
Top -> Bottom

Step:
20% current viewport height

After each step:
wait for stable visible DOM candidate

Settle signature:
- scrollTop
- scrollHeight
- clientHeight
- full mounted ordinal array

Acquisition:
accumulate run-local runtime Message identities

Dedup:
runtime identity

Cross-check:
- Message ordinal
- data-turn-id
- role
- DOM ordinal ordering

Termination:
Bottom geometry candidate

Forbidden termination:
- expected count reached
- union count reached
- one no-new-ID observation
- short local union convergence
- mounted count stable
- scrollHeight stable alone
```

---

# 4. Formal Visibility Precondition

## Decision

```text
REQUIRED
```

Code relation:

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

Evidence:

```text
hidden:
scrollTop advanced
mounted range stayed stale

hidden -> visible:
mounted range changed
without an additional scroll
```

Therefore a hidden traversal is not considered equivalent to a visible traversal.

If the page becomes hidden:

```text
BLOCKED
```

The same formal run is not resumed as if uninterrupted.

---

# 5. Focus Precondition

## Decision

```text
NOT REQUIRED
```

Evidence:

```text
documentHasFocus:
false
```

both before and after the visibility A/B transition.

Mounted range still recomputed after becoming visible.

Therefore:

```text
document.hasFocus()
```

may be retained as diagnostic metadata but is not part of the candidate hard precondition.

---

# 6. TV-006 Completeness Relation

## Decision

```text
ADOPT
```

Candidate state:

```text
COMPLETE_CANDIDATE
```

requires all of the following:

```text
1. page remained visible for the valid traversal

AND

2. traversal started from an authenticated Top geometry candidate

AND

3. traversal reached an authenticated Bottom geometry candidate

AND

4. observed ordinal union starts at ordinal 1

AND

5. observed ordinal union is strictly contiguous
   from 1 through the maximum observed ordinal

AND

6. runtime identity <-> ordinal relation is consistent

AND

7. runtime identity <-> turn identity relation is consistent

AND

8. role and DOM-order relations remain valid

AND

9. no capture was rejected

AND

10. no acquisition / identity / currentness contradiction occurred
```

Expected fixture count is **not** one of these conditions.

---

# 7. Candidate Classification Function

Representative logic:

```javascript
function classifyCandidate({
  pageVisibleThroughout,
  topEstablished,
  bottomEstablished,
  observedOrdinals,
  captureRejected,
  identityConflict,
  domOrderConsistent,
  blocked
}) {
  if (blocked) {
    return "UNKNOWN";
  }

  if (
    !pageVisibleThroughout ||
    !topEstablished ||
    !bottomEstablished
  ) {
    return "UNKNOWN";
  }

  if (
    captureRejected ||
    identityConflict ||
    !domOrderConsistent
  ) {
    return "INCONSISTENT";
  }

  const sorted = [
    ...new Set(observedOrdinals)
  ].sort((a, b) => a - b);

  if (
    sorted.length === 0 ||
    sorted[0] !== 1
  ) {
    return "INCOMPLETE";
  }

  for (
    let i = 1;
    i < sorted.length;
    i++
  ) {
    if (
      sorted[i] !==
      sorted[i - 1] + 1
    ) {
      return "INCOMPLETE";
    }
  }

  return "COMPLETE_CANDIDATE";
}
```

This function does not read Ground Truth count.

---

# 8. Ordinal Continuity

## Decision

```text
REQUIRED
```

Evidence:

Round 2 produced:

```text
observed:
1-75,77-100
```

while also having:

```text
Top reached
Bottom previously observed
first ordinal present
last ordinal present
identity conflicts = 0
```

Therefore without internal continuity checking, a false Complete decision was possible.

Required runtime relation:

```text
observed minimum ordinal = 1
AND
every successive distinct ordinal increments by exactly 1
```

through the maximum observed ordinal.

---

# 9. Top Boundary

## Decision

```text
REQUIRED_NOT_SUFFICIENT
```

Role:

> authenticate that the traversal includes the Conversation's upper boundary.

A Top candidate alone cannot prove completeness.

---

# 10. Bottom Boundary

## Decision

```text
REQUIRED_NOT_SUFFICIENT
```

Role:

> authenticate that the traversal reached the lower boundary and provides the formal termination point.

A Bottom candidate alone cannot prove completeness.

---

# 11. Top + Bottom Together

## Decision

```text
STILL NOT SUFFICIENT
```

Long-100 Round 2 demonstrated that both boundary regions can be represented across the run while an internal ordinal gap remains.

Therefore:

```text
Top + Bottom
must be combined with
ordinal continuity + consistency
```

---

# 12. Run-local Identity Union

## Decision

```text
REQUIRED
```

Uses:

- dedup across mount / unmount;
- acquisition progress;
- distinct occurrence tracking;
- identity consistency;
- ordinal consistency;
- later oracle comparison.

The union is an **acquisition state**, not the canonical completeness proof.

---

# 13. Union Convergence

## Decision

```text
REJECT AS COMPLETENESS SIGNAL
```

Rejected rules:

```text
new IDs == 0 once -> Complete
new IDs == 0 several times -> Complete
union stopped growing locally -> Complete
union reached expected count -> stop
```

Evidence:

- Long-100 had zero-new-ID steps followed by later discoveries.
- Long-100 Round 3B continued after union reached 100.
- Long-200 baseline continued from S095 to S112 after union reached 200.
- Reload reproducibility repeated the same behavior.

---

# 14. Expected Count

## Decision

```text
PROHIBITED AS RUNTIME CONTROL SIGNAL
```

Forbidden:

```javascript
if (
  state.runtimeMeta.size ===
  expectedCount
) {
  return "COMPLETE";
}
```

Forbidden uses:

- stop traversal;
- select navigation target;
- repair a gap;
- classify Complete.

Allowed use:

```text
after candidate-only classification freeze
-> compare with frozen Ground Truth
```

---

# 15. Ground Truth Role

## Decision

```text
POST_CLASSIFICATION_ORACLE_ONLY
```

Required order:

```text
runtime observation
-> candidate-only classification
-> classification freeze
-> Ground Truth comparison
```

This prevents self-approval.

---

# 16. Fail Closed Conditions

Any of the following prohibits `COMPLETE_CANDIDATE`.

## Visibility

```text
document.visibilityState != visible
document.hidden == true
```

## Traversal

```text
Top not established
Bottom not established
scroll progress fails before Bottom
settle timeout
scroll container unavailable
scroll container ambiguous
scroll container changed
```

## Ordinal

```text
invalid ordinal
duplicate ordinal in snapshot
internal ordinal gap
DOM ordinal order contradiction
```

## Identity

```text
data-message-id missing / ambiguous
duplicate runtime identity in snapshot
runtime ID -> different ordinal
runtime ID -> different turn
runtime ID -> different role
ordinal -> different runtime ID
turn -> different runtime ID
```

## Capture / State

```text
capture rejected
candidate interpretation ambiguous
runtime state inconsistent
currentness cannot be established
```

---

# 17. Diagnostic State Vocabulary

Adopted candidate diagnostic states:

```text
COMPLETE_CANDIDATE
INCOMPLETE
UNKNOWN
AMBIGUOUS
INCONSISTENT
BLOCKED
```

Interpretation:

```text
INCOMPLETE:
runtime evidence positively shows missing continuity / boundary

UNKNOWN:
insufficient evidence to decide

AMBIGUOUS:
multiple plausible candidate interpretations

INCONSISTENT:
observed relations contradict

BLOCKED:
hard precondition or execution contract failed
```

Only:

```text
COMPLETE_CANDIDATE
```

may proceed to Ground Truth comparison as a positive candidate.

---

# 18. Formal 20% Baseline

## Decision

```text
KEEP
```

Formal label:

```text
TASK_003_FORMAL_VALIDATION_BASELINE_STEP:
20_PERCENT_VIEWPORT
```

Meaning:

```text
Technical Validation baseline
```

Not:

```text
Production final constant
```

Evidence:

```text
Long-100:
PASS candidate recovery

Long-200:
PASS baseline

Long-200 reload:
PASS reproducibility
```

---

# 19. Step-size Optimization

## Decision

```text
DEFER
```

Not part of TASK-003 correctness exit.

Potential future characterization:

```text
20% baseline
40%
60%
80%
```

while holding all other conditions fixed.

The optimization goal should not be “maximum possible percentage”.

It should balance:

- reliability;
- overlap margin;
- DOM-change tolerance;
- scan count;
- performance.

---

# 20. Viewport Variation

## Decision

```text
DEFER
```

Current qualification is for the observed desktop Chrome viewport.

Known limitation:

> viewport-size invariance has not been established.

This does not invalidate the present candidate relation.

---

# 21. Reload Reproducibility

## Decision

Originally:

```text
REQUIRED BEFORE FINAL VERDICT
```

Current status:

```text
COMPLETED
PASS
```

The same Long-200 baseline reproduced after explicit reload with a fresh run-local accumulator.

No additional identical manual reproducibility run is required.

---

# 22. Candidate Decision Record

```text
TV_005_LOADING_TRAVERSAL_CONTRACT:
ADOPTED

TV_006_COMPLETENESS_RELATION:
ADOPTED

VISIBILITY:
REQUIRED

FOCUS:
NOT REQUIRED

ORDINAL_CONTINUITY:
REQUIRED

TOP:
REQUIRED_NOT_SUFFICIENT

BOTTOM:
REQUIRED_NOT_SUFFICIENT

TOP_PLUS_BOTTOM:
NOT_SUFFICIENT

RUN_LOCAL_IDENTITY_UNION:
REQUIRED

UNION_CONVERGENCE:
NOT A COMPLETENESS SIGNAL

EXPECTED_COUNT:
RUNTIME USE PROHIBITED

GROUND_TRUTH:
POST-CLASSIFICATION ONLY

FAIL_CLOSED:
REQUIRED

20_PERCENT_BASELINE:
RETAINED

STEP_OPTIMIZATION:
DEFERRED

VIEWPORT_VARIATION:
DEFERRED

RELOAD_REPRODUCIBILITY:
PASS
```

---

# 23. What Remains Before Final Verdict

Manual Discovery itself is complete.

Remaining work:

```text
Minimal PoC / self-test
-> Final TV-005 Review
-> Final TV-006 Review
-> TASK-003 Final Exit Review
```

The PoC must codify the adopted relation without broadening the scope.
