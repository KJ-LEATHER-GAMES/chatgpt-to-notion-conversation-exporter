# TASK-003 Manual Discovery Final Review and Deferred Items

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Purpose: final review of the manual Discovery phase and explicit separation of completed work from deferred optimization
- Historical Evidence replacement: **NO**
- Manual DOM Discovery status: **COMPLETE**
- Minimal PoC status: **NOT STARTED in this document**
- TV-005 Final Verdict: **NOT SET**
- TV-006 Final Verdict: **NOT SET**

This document closes the manual Discovery phase that began after automated fixture construction / send-lifecycle approaches were abandoned.

It does not close TASK-003 itself.

---

# 2. Manual Discovery Scope Reviewed

The completed manual work includes:

```text
Manual fixture construction
Ground Truth establishment
Long-100 initial inventory
Long-100 80% fixed-step traversal
False-complete counterexample
Round 3A hidden-state traversal characterization
Visibility A/B characterization
Visible-only 20% recovery sweep
Long-100 method qualification
Long-200 20% formal baseline
Long-200 explicit-reload reproducibility run
TV-005 / TV-006 Candidate Decision
```

---

# 3. Why Manual Discovery Was Necessary

Earlier attempts to construct / control the test fixture through automated browser interaction did not produce an acceptable controlled construction relation.

The project therefore adopted:

```text
TASK_003_FIXTURE_CONSTRUCTION_ARCHITECTURE:
OUT_OF_BAND_MANUAL_CONTROLLED
```

The manual approach deliberately separated:

```text
fixture construction
from
runtime candidate observation
```

and:

```text
Ground Truth
from
candidate classification
```

This separation was essential for TV-006.

---

# 4. Fixture Preparation Status

## Long-100

```text
Ground Truth:
ESTABLISHED

Expected distinct occurrences:
100

Construction:
50 accepted User/Assistant cycles

Fixture:
frozen for observation
```

## Long-200

Attempt 1:

```text
INVALIDATED
```

due to construction ambiguity / `See Versions`.

Attempt 2:

```text
100 accepted cycles
200 expected distinct occurrences
unique fixture binding confirmed
Ground Truth established
fixture frozen
```

No aborted Attempt 1 content was allowed into the accepted oracle.

---

# 5. Key Discovery Findings

## 5.1 Virtualization is operationally relevant

Long-100 initial state:

```text
mounted:
83-100
```

Long-200 initial state:

```text
mounted:
183-200
```

Therefore the runtime DOM may mount only a suffix even when the document itself is fully loaded.

---

## 5.2 Explicit traversal is required

Staged traversal exposed Messages not present in the initial mounted subset.

This supports the TV-005 premise that long-conversation acquisition requires explicit runtime traversal / loading behavior.

---

## 5.3 Boundary-only logic is unsafe

Long-100 Round 2 produced:

```text
observed:
1-75,77-100

Top reached:
yes

Bottom observed:
yes

identity contradiction:
none
```

Therefore:

```text
Top
Bottom
first ordinal
last ordinal
```

cannot by themselves prove completeness.

---

## 5.4 Internal ordinal continuity is high-value evidence

The Round 2 gap allowed the candidate runtime to classify:

```text
INCOMPLETE
```

without using Ground Truth count.

This became a required TV-006 signal.

---

## 5.5 Union convergence is not completeness

Observed:

- zero-new-ID steps followed by later discoveries;
- union 100 before Long-100 Bottom;
- union 200 before Long-200 Bottom;
- union 200 before reload-run Bottom.

Therefore identity union is acquisition state, not terminal completeness evidence.

---

## 5.6 Visibility matters

Observed controlled A/B:

```text
hidden
-> mounted range stale

hidden -> visible
without scroll
-> mounted range recomputed
```

Therefore formal traversal now requires:

```javascript
document.visibilityState === "visible" &&
document.hidden === false
```

Focus is not required.

---

## 5.7 Coarse settle logic was insufficient

The early settle relation tracked count/min/max and could declare stability before virtualization/layout had fully settled.

The formal baseline therefore uses:

```text
scrollTop
scrollHeight
clientHeight
full mounted ordinal array
```

---

## 5.8 Generic recovery was demonstrated

Long-100 Round 3B did not navigate directly to missing ordinal 76.

The general 20% visible-only sweep naturally recovered the missing occurrence.

Therefore recovery did not depend on Ground Truth-guided repair.

---

## 5.9 Long-200 scaled successfully

Formal baseline:

```text
112 sweep captures
ordinal union 1-200
internal gaps 0
run-local union 200
identity conflicts 0
Bottom reached
```

---

## 5.10 Reload reproducibility established

After explicit reload:

```text
fresh accumulator
same 20% method
112 sweep captures
union 200 at S095
Bottom at S112
ordinal union 1-200
gaps 0
identity conflicts 0
```

The progression was highly consistent with the baseline run.

---

# 6. Manual Discovery Exit Decision

Decision:

```text
MANUAL_DOM_DISCOVERY:
COMPLETE
```

Rationale:

1. incomplete runtime behavior was observed;
2. false-complete risk was concretely demonstrated;
3. a safer candidate relation was derived;
4. the candidate relation recovered Long-100 without targeted repair;
5. the same relation scaled to Long-200;
6. the Long-200 result reproduced after reload;
7. the remaining work is relation codification and self-test, not additional exploratory DOM observation.

---

# 7. Additional Manual Runs

Decision:

```text
ADDITIONAL_IDENTICAL_MANUAL_RUNS:
NOT REQUIRED
```

Repeating the same Long-200 20% visible-only scan again is unlikely to add enough new information to justify the manual cost.

A new manual run should only be opened if:

- Minimal PoC behavior contradicts retained Evidence;
- the DOM relation changes;
- a new failure mode appears;
- a deferred optimization is intentionally brought back into scope.

---

# 8. Formal Baseline Retained

Decision:

```text
FORMAL_TECHNICAL_BASELINE:
20_PERCENT_VIEWPORT
```

This value is retained only for:

```text
TASK-003 validation reproducibility
```

It is not frozen as a Production constant.

---

# 9. Deferred — Step-size Optimization

Status:

```text
DEFERRED
```

Not required to prove TASK-003 correctness.

Potential future experiment:

```text
20% reference
40%
60%
80%
```

with all other variables held constant:

- same fixture;
- same visibility gate;
- same settle relation;
- same identity invariants;
- same Bottom termination;
- no expected-count stop.

Decision criterion should include:

- continuity;
- conflicts;
- capture rejection;
- visibility behavior;
- execution cost;
- safety margin.

---

# 10. Deferred — Viewport Variation

Status:

```text
DEFERRED
```

The current formal baseline was observed on the current desktop Chrome viewport.

Not yet established:

- narrower viewport;
- taller viewport;
- browser zoom variation;
- responsive layout boundary effects.

Known limitation should remain explicit until separately characterized.

---

# 11. Deferred — Performance Optimization

Status:

```text
DEFERRED
```

TASK-003 established correctness evidence, not a production timing SLA.

Deferred examples:

- minimum safe settle delay;
- adaptive step size;
- dynamic overlap;
- reducing capture frequency;
- performance under larger-than-200 Conversations.

---

# 12. Deferred — Production Settle Mechanism

The formal validation uses sampled stability over:

```text
geometry
+
full mounted ordinal array
```

Potential Production hardening may use:

- MutationObserver;
- longer quiet-period logic;
- container-specific relevant mutation filtering;
- adaptive wait.

These are implementation choices, not required to invalidate the current manual baseline.

---

# 13. Deferred — Broader Browser Lifecycle Characterization

The current finding is intentionally narrow:

> hidden-state traversal cannot be trusted as equivalent to visible-state traversal for the tested ChatGPT Long-100 fixture.

Not established:

- every Chrome occlusion state;
- minimized vs covered window equivalence;
- all tab lifecycle states;
- non-Windows behavior;
- browser-vendor equivalence.

Production should preserve the safe visibility gate unless later Evidence supports relaxation.

---

# 14. Deferred — Project Chat Long-conversation Coverage

TASK-003's formal long-conversation fixture work documented here used Standard Chat.

Project Chat long-conversation scaling is not silently inferred from this result.

If required by a later validation, it must be separately scoped.

---

# 15. Deferred — Maximum Supported Conversation Size

The completed formal fixtures were:

```text
Long-100
Long-200
```

This establishes 200-Message-class technical evidence.

It does not establish an unbounded or maximum Conversation size.

---

# 16. Candidate Contract Now Frozen for PoC

The Minimal PoC should codify, not redesign, the following:

```text
Message unit:
section[data-testid^="conversation-turn-"]

Visibility:
visible && !hidden

Traversal:
programmatic Top -> Bottom

Baseline step:
20% viewport

Settle:
geometry + full mounted ordinal array

Identity:
data-message-id runtime union

Cross-check:
data-turn-id
ordinal
role
DOM order

Completeness candidate:
Top + Bottom + ordinal continuity + consistency

Expected count:
not runtime control input

Ground Truth:
post-classification only

Failure:
Fail Closed
```

---

# 17. Required Minimal PoC Positive Case

At minimum:

```text
visible
Top established
Bottom established
ordinal 1..N contiguous
identity consistency
turn consistency
role consistency
DOM order consistency
no rejected capture
```

Expected candidate:

```text
COMPLETE_CANDIDATE
```

No expected fixture count may be required by this self-test relation.

---

# 18. Required Minimal PoC Negative / Fail-closed Cases

The self-test must include at least:

```text
page hidden
internal ordinal gap
missing Top
missing Bottom
duplicate ordinal
duplicate runtime identity
runtime -> ordinal conflict
runtime -> turn conflict
runtime -> role conflict
ordinal -> runtime conflict
turn -> runtime conflict
DOM order contradiction
capture rejection
settle timeout / traversal interruption
```

Expected outcome:

```text
never COMPLETE_CANDIDATE
```

---

# 19. Required Anti-self-approval Tests

The PoC must explicitly prove that the following do **not** create Complete:

```text
captured count == expected count

union count reaches expected count

union stops growing

one no-new-ID sample

first and last ordinal present

Top and Bottom both observed
without continuity
```

This is a key TV-006 safety requirement.

---

# 20. Final Verdict Work Remaining

After Minimal PoC / self-test:

```text
TV-005 Final Review
TV-006 Final Review
TASK-003 Final Exit Review
```

The final review should compare:

```text
Source of Truth criteria
+
manual Evidence
+
PoC/self-test Evidence
```

It should not reopen deferred optimization unless a contradiction is discovered.

---

# 21. Manual Discovery Final Status

```text
TASK_003_FIXTURE_PREPARATION:
COMPLETE

LONG_100_GROUND_TRUTH:
ESTABLISHED

LONG_200_GROUND_TRUTH:
ESTABLISHED

TV_005_MANUAL_DISCOVERY:
COMPLETE

TV_006_MANUAL_DISCOVERY:
COMPLETE

LONG_100_METHOD_GATE:
PASS

LONG_200_BASELINE:
PASS

LONG_200_RELOAD_REPRODUCIBILITY:
PASS

TV_005_CANDIDATE_DECISION:
ADOPTED

TV_006_CANDIDATE_DECISION:
ADOPTED

MANUAL_DOM_DISCOVERY:
COMPLETE

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

# 22. Final Manual Discovery Decision

The manual phase is considered sufficiently complete to hand off to Minimal PoC implementation.

No further exploratory scrolling or manual DOM probing is required before PoC generation.

Deferred optimization remains explicitly outside the current correctness gate.
