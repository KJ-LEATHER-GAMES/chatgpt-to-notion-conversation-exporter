# TASK-003 Long-100 Method Qualification

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Fixture: Long-100
- Related validations: TV-005, TV-006
- Purpose: determine whether the Long-100 manual Discovery method was sufficiently qualified to authorize Long-200 formal baseline validation
- Historical Evidence replacement: **NO**
- Final TV-005 verdict: **NOT SET by this document**
- Final TV-006 verdict: **NOT SET by this document**

This document evaluates the Long-100 evidence as a method gate.

It does not promote the Long-100 result directly into a final TASK-003 verdict. Its purpose is to decide whether the candidate method is safe and informative enough to test at Long-200 scale.

---

# 2. Reviewed Long-100 Evidence

The qualification uses:

1. Round 1 initial inventory;
2. Round 2 coarse fixed-step traversal;
3. Round 2 false-complete counterexample;
4. Round 3A hidden / stale-mounted-range behavior;
5. Visibility A/B characterization;
6. Round 3B visible-only generic recovery;
7. candidate-only classification freeze;
8. post-freeze Ground Truth comparison.

Primary integrated Evidence documents:

- `TASK-003-long-100-initial-and-fixed-step-discovery.md`
- `TASK-003-long-100-visibility-and-recovery-characterization.md`

---

# 3. Facts Established Before Qualification

## 3.1 Initial virtualization exists

Initial mounted set:

```text
83-100
```

with Bottom geometry reached.

Therefore full document readiness did not imply full Message mounting.

---

## 3.2 Explicit traversal can expose previously unmounted Messages

Round 2 changed the runtime union from:

```text
18
```

to:

```text
99
```

while traversing from Bottom to Top.

Therefore explicit loading / traversal is operationally relevant to TV-005.

---

## 3.3 Boundary reach is not sufficient for completeness

At the end of Round 2:

```text
Top reached:
YES

Bottom had been observed:
YES

first ordinal observed:
YES

last ordinal observed:
YES

identity conflicts:
0

runtime union:
99

observed ordinal union:
1-75,77-100

internal gap:
YES
```

Therefore a plausible superficial “complete-looking” state was still incomplete.

This is the required false-complete evidence for TV-006.

---

## 3.4 Min/max are not sufficient

Mounted snapshots such as:

```text
1-26,96-100
```

had:

```text
min = 1
max = 100
```

while most intermediate ordinals were not mounted.

Therefore candidate logic must use the **distinct ordinal union**, not only mounted min/max.

---

## 3.5 Local convergence is not sufficient

Multiple steps produced:

```text
newRuntimeIdentityCount:
0
```

followed by later steps that discovered new identities.

Therefore:

```text
one no-new-ID sample
```

or short local convergence cannot mean Complete.

---

## 3.6 Hidden-state traversal is unsafe as a formal baseline

Round 3A observed:

```text
scroll geometry progresses
+
mounted Message set remains unchanged
```

while the page was later confirmed hidden.

The A/B visibility test then showed:

```text
hidden -> visible
+
no scroll
+
mounted set changes
```

Therefore visibility must be controlled.

---

## 3.7 Focus is not required

The visibility A/B test retained:

```text
documentHasFocus:
false
```

before and after.

Mounted state still changed after the page became visible.

Therefore:

```text
document.hasFocus():
diagnostic only
```

---

## 3.8 Full mounted ordinal array is required in settle observation

The earlier coarse settle relation was insufficient.

The qualified baseline therefore observes:

```text
scrollTop
scrollHeight
clientHeight
full ordered mounted ordinal array
```

rather than:

```text
count + min + max
```

only.

---

# 4. Candidate Baseline Relation Emerging from Long-100

The qualified candidate traversal relation became:

```text
Precondition:
page visible

Start:
programmatic Top

Direction:
Top -> Bottom

Step:
20% viewport

Settle:
geometry + full mounted ordinal array

Capture:
validated runtime Message units

Acquisition:
run-local unique runtime identity union

Cross-check:
ordinal / turn ID / role / DOM order

Stop:
Bottom geometry candidate

Post-traversal:
evaluate ordinal continuity

Ground Truth:
compare only after candidate classification freeze
```

The 20% value is a conservative Technical Validation baseline.

It is not a Production requirement.

---

# 5. Visibility Gate Code

The precondition carried forward to Long-200 was:

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

Required check points:

```text
before run
before scroll
during settle
after scroll
at capture
```

If invalid:

```text
PAGE_HIDDEN
-> BLOCKED
-> do not resume same formal run
-> do not claim Complete
```

---

# 6. Ordinal Continuity Gate Code

The candidate-only continuity relation carried forward was:

```javascript
const ordinals = [
  ...state.ordinalToRuntime.keys()
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
```

A candidate continuity state requires:

```text
observed first ordinal = 1
AND
internal gap count = 0
```

through the maximum observed ordinal.

The expected total is not read here.

---

# 7. Identity Consistency Gate

Required invariants:

```text
runtime ID -> one ordinal
runtime ID -> one turn ID
runtime ID -> one role

ordinal -> one runtime ID
turn ID -> one runtime ID

mounted snapshot:
no duplicate runtime ID
no duplicate ordinal

DOM ordinal sequence:
strictly increasing
```

Any contradiction means:

```text
Fail Closed
```

not fallback.

---

# 8. Boundary Role

Long-100 established the following interpretation.

```text
Top:
required traversal-start boundary

Bottom:
required traversal-end boundary

Top alone:
not Complete

Bottom alone:
not Complete

Top + Bottom alone:
not Complete
```

The boundaries authenticate the traversal envelope.

Ordinal continuity and consistency evidence are still required.

---

# 9. Union Role

The runtime identity union is required for:

- dedup across mount / unmount;
- acquisition progress;
- distinct occurrence tracking;
- identity / ordinal consistency;
- later oracle comparison.

It is **not** the canonical completeness signal.

Rejected rules:

```text
union reached expected count -> stop
union stopped growing -> Complete
one step added 0 -> Complete
```

Round 3B explicitly continued after the union reached the frozen fixture total and stopped only at Bottom.

---

# 10. Long-100 Round 3B Qualification Result

Round 3B candidate-only summary:

```text
completed:
true

blocked:
false

pageVisibility:
visible

round3bSnapshotCount:
55

observedOrdinalRanges:
1-100

observedInternalGapCount:
0

anyCaptureRejected:
false

anyIdentityConflict:
false

candidateOnlyRecoveryStatus:
RECOVERY_CONTINUITY_CANDIDATE

groundTruthUsed:
false

unionCountUsedAsStopCondition:
false
```

After candidate freeze:

```text
Ground Truth comparison:
MATCH
```

---

# 11. Qualification Matrix

| Gate | Long-100 Evidence | Decision |
|---|---|---|
| Virtualization / partial mount observable | initial `83-100` only | PASS |
| One Message-unit relation usable | `section[data-testid^="conversation-turn-"]` | PASS |
| Runtime identity available | one `data-message-id` per valid mounted unit | PASS |
| Turn cross-check available | one `data-turn-id` | PASS |
| Role available | one `data-message-author-role` | PASS |
| Ordinal available | `conversation-turn-N` | PASS |
| Run-local union works | 18 -> 99 -> 100 | PASS |
| Identity contradictions detected / absent | conflict counts 0 in accepted run | PASS |
| Explicit traversal loads additional units | observed | PASS |
| Top boundary observable | observed | PASS |
| Bottom boundary observable | observed | PASS |
| False-complete state obtained | Round 2 internal gap | PASS |
| Candidate-only INCOMPLETE possible without GT | Round 2 | PASS |
| Visibility dependency characterized | hidden/visible A-B | PASS |
| Visibility Fail Closed candidate justified | yes | PASS |
| Generic recovery without exact-gap target | R3B recovered 76 | PASS |
| Full ordinal continuity recovered | `1-100` | PASS |
| Candidate freeze before GT | observed | PASS |
| GT comparison matches candidate | yes | PASS |
| Raw IDs / body / raw DOM not persisted | Safety Fields | PASS |

---

# 12. Long-100 Method Gate Decision

The method gate is:

```text
LONG_100_METHOD_GATE:
PASS
```

Meaning:

> The manual Discovery method has shown enough safety, diagnostic power, false-complete resistance, and successful generic recovery to be tested on Long-200 without changing the core relation.

This does **not** mean:

```text
TV-005 FINAL:
PASS
```

or:

```text
TV-006 FINAL:
PASS
```

Those remained unset.

---

# 13. Long-200 Authorization

Decision:

```text
LONG_200_DISCOVERY:
AUTHORIZED
```

The authorized Long-200 method was restricted to the qualified baseline:

```text
fresh run-local accumulator
+
visible hard precondition
+
programmatic Top
+
20% viewport Top -> Bottom
+
full ordinal-array settle
+
identity consistency checks
+
Bottom termination
+
candidate-only continuity classification
+
post-freeze Ground Truth comparison
```

The earlier 80% coarse method was **not** promoted.

---

# 14. Why Long-200 Did Not Need to Reproduce Every Long-100 Failure Mode

Long-100 already established:

- partial initial mounting;
- false-complete boundary conditions;
- local convergence insufficiency;
- hidden-state mount stagnation;
- visibility A/B response;
- coarse settle insufficiency;
- generic recovery.

Therefore Long-200's purpose was not to repeat each failure characterization.

Long-200's purpose was:

> test whether the qualified safe baseline scales to the formal 200-Message-class fixture.

---

# 15. Step-size Decision at Qualification Time

Decision:

```text
20_PERCENT:
FORMAL TECHNICAL BASELINE CANDIDATE

40/60/80_PERCENT:
NOT YET TESTED AS FORMAL BASELINE
```

The 20% step was retained because it provided substantial overlap and successfully recovered continuity.

Optimization was deliberately separated from correctness.

---

# 16. Known Limitations Carried Forward

The Long-100 gate did not establish:

- optimal scroll percentage;
- viewport-size invariance;
- MutationObserver-based Production settle behavior;
- strict performance timing;
- Project Chat long-conversation coverage;
- universal browser/window occlusion semantics.

These were not allowed to silently become TASK-003 blockers unless already required by the Source of Truth.

---

# 17. Fail Closed Relation Carried Forward

Long-200 was required to stop / block on:

```text
page hidden
scroll container missing / ambiguous / changed
settle timeout
capture rejection
Message identity cardinality invalid
turn identity cardinality invalid
role cardinality invalid
invalid / duplicate ordinal
duplicate runtime identity in snapshot
runtime -> metadata conflict
ordinal -> runtime conflict
turn -> runtime conflict
DOM ordinal order contradiction
no scroll progress away from Bottom
```

No fallback could promote such a state to Complete.

---

# 18. Method Qualification Conclusion

Long-100 produced both:

```text
a real incomplete traversal
```

and:

```text
a successful generic recovery traversal
```

under a clearly improved runtime contract.

This combination was stronger than a single successful scan because it demonstrated that the candidate relation could distinguish:

```text
INCOMPLETE
```

from:

```text
RECOVERY_CONTINUITY_CANDIDATE
```

without reading the Ground Truth first.

Final qualification:

```text
LONG_100_METHOD_QUALIFICATION:
PASS

LONG_200_BASELINE_TEST:
AUTHORIZED

MANUAL_DISCOVERY:
CONTINUE TO LONG_200
```

The subsequent Long-200 result is documented separately in:

`TASK-003-long-200-baseline-and-reproducibility-validation.md`
