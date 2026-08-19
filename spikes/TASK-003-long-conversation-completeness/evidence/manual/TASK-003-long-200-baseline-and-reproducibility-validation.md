# TASK-003 Long-200 Baseline and Reproducibility Validation

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Related validations: TV-005, TV-006
- Fixture: Long-200
- Covered work:
  - Long-200 Formal Baseline Run
  - Long-200 Reload Reproducibility Run
- Historical Evidence replacement: **NO**
- Ground Truth used during runtime classification: **NO**
- Final TV-005 / TV-006 verdict: **NOT SET by this document**

This document records the formal Long-200 validation performed after the Long-100 method gate passed.

The purpose was twofold:

1. verify that the qualified 20%-viewport visible-only traversal scales from Long-100 to a 200-Message-class fixture; and
2. verify that the same method reproduces after an explicit reload with a fresh run-local accumulator.

---

# 2. Qualified Baseline Carried Forward from Long-100

The Long-200 method was intentionally restricted to the already qualified relation:

```text
Page visibility:
required

Start:
programmatic Top reset

Direction:
Top -> Bottom

Step:
20% of current viewport height

Settle:
scroll geometry + full mounted ordinal array stability

Acquisition:
fresh run-local runtime Message identity union

Cross-check:
ordinal / data-turn-id / role / DOM order

Stop:
Bottom geometry candidate

Forbidden stop conditions:
expected count
union count
local no-new-ID convergence

Candidate classification:
before Ground Truth comparison
```

The Long-200 run did not reintroduce the earlier 80% coarse traversal.

---

# 3. Long-200 Baseline — Run-local Accumulator

A fresh Long-200-specific accumulator was created:

```javascript
const KEY =
  "__TASK003_L200_BASELINE__";

const state = {
  version:
    "TASK003-L200-BASELINE-v1",

  runtimeMeta:
    new Map(),

  ordinalToRuntime:
    new Map(),

  turnToRuntime:
    new Map(),

  snapshots:
    [],

  scroller:
    establishedScroller,

  failed:
    false,

  blocked:
    false,

  blockedReason:
    null,

  sweepCompleted:
    false,

  sweepCaptureCount:
    0
};

window[KEY] = state;
```

This prevented contamination from the Long-100 runtime union.

---

# 4. Visibility Hard Precondition

The same qualified visibility relation was used:

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

The state was checked:

- before initialization;
- before each scroll;
- during settle;
- after each scroll;
- at capture.

Any hidden transition would block the run.

---

# 5. Full Ordinal-array Settle

The improved settle relation was retained:

```javascript
async function waitForStableVisibleDOM() {
  let previousSignature = null;
  let stableSamples = 0;

  const maxSamples = 50;
  const intervalMs = 250;
  const requiredStableSamples = 3;

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
        reason:
          "PAGE_BECAME_HIDDEN"
      };
    }

    const ordinals = [
      ...document.querySelectorAll(
        'section[data-testid^="conversation-turn-"]'
      )
    ]
      .map(section => {
        const match =
          section
            .getAttribute("data-testid")
            ?.match(
              /^conversation-turn-(\d+)$/
            );

        return match
          ? Number(match[1])
          : null;
      })
      .filter(Number.isSafeInteger);

    const signature =
      JSON.stringify({
        scrollTop:
          Math.round(
            state.scroller.scrollTop
          ),

        scrollHeight:
          state.scroller.scrollHeight,

        clientHeight:
          state.scroller.clientHeight,

        mountedOrdinals:
          ordinals
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
        stableSamples
      };
    }
  }

  return {
    settled: false,
    reason:
      "DOM_STABILITY_TIMEOUT"
  };
}
```

---

# 6. Baseline Capture Contract

Each accepted mounted Message unit required:

```text
exactly one data-message-id
exactly one data-turn-id
exactly one data-message-author-role
valid conversation-turn-N ordinal
strict DOM ordinal order
no duplicate runtime identity in snapshot
no duplicate ordinal in snapshot
no runtime / ordinal / turn contradiction
```

Representative capture relation:

```javascript
const previous =
  state.runtimeMeta.get(
    runtimeId
  );

if (
  previous &&
  (
    previous.ordinal !== ordinal ||
    previous.turnId !== turnId ||
    previous.role !== role
  )
) {
  state.failed = true;

  throw new Error(
    "Runtime identity relation changed."
  );
}

const byOrdinal =
  state.ordinalToRuntime.get(
    ordinal
  );

if (
  byOrdinal &&
  byOrdinal !== runtimeId
) {
  state.failed = true;

  throw new Error(
    "Ordinal/runtime contradiction."
  );
}

const byTurn =
  state.turnToRuntime.get(
    turnId
  );

if (
  byTurn &&
  byTurn !== runtimeId
) {
  state.failed = true;

  throw new Error(
    "Turn/runtime contradiction."
  );
}
```

---

# 7. Long-200 Baseline Initialization Result

Recorded initialization:

```text
protocol:
TASK003-L200-BASELINE-v1

initialization:
COMPLETE

pageVisible:
true

identityConflictCount:
0

groundTruthUsed:
false
```

Initial runtime state:

```text
mountedMessageCount:
18

mountedOrdinalMin:
183

mountedOrdinalMax:
200

scrollTop:
14776

atBottomCandidate:
true
```

After programmatic Top reset:

```text
mountedMessageCount:
23

mountedOrdinalMin:
1

mountedOrdinalMax:
200

scrollTop:
0

atTopCandidate:
true
```

This repeated the important Long-100 lesson:

```text
min=1
max=200
does not mean all intermediate ordinals are mounted
```

---

# 8. Baseline 20% Sweep Code

The formal step relation:

```javascript
const requestedStepPx =
  Math.max(
    1,
    Math.round(
      clientHeight * 0.20
    )
  );

const targetScrollTop =
  Math.min(
    maxScrollTop,
    beforeScrollTop +
      requestedStepPx
  );

scroller.scrollTo({
  top:
    targetScrollTop,

  behavior:
    "auto"
});
```

The union count was intentionally not read as a stop condition.

Termination was:

```javascript
if (
  result.atBottomCandidate
) {
  state.sweepCompleted =
    true;

  break;
}
```

---

# 9. Long-200 Baseline Result

Recorded result:

```text
completed:
true

blocked:
false

blockedReason:
null

sweepCaptureCount:
112

finalVisibilityState:
visible

finalDocumentHidden:
false

finalScrollTop:
20278

finalScrollHeight:
21188

finalClientHeight:
910

finalAtBottomCandidate:
true

finalRunLocalUnionRuntimeIdentityCount:
200

unionCountUsedAsStopCondition:
false
```

---

# 10. Union Reached 200 Before Bottom

The run-local identity union first reached:

```text
200
```

at:

```text
L200-S095
```

while:

```text
atBottomCandidate:
false
```

The scan continued:

```text
L200-S096
...
L200-S112
```

and only stopped at Bottom.

Therefore:

```text
union count:
not used as stop condition
```

was demonstrated by actual run behavior.

---

# 11. Baseline Candidate-only Summary

Recorded:

```text
sweepCompleted:
true

blocked:
false

observedOrdinalRanges:
1-200

observedOrdinalMin:
1

observedOrdinalMax:
200

observedInternalGapCount:
0

observedInternalGaps:
[]

anyCaptureRejected:
false

anyIdentityConflict:
false

candidateOnlyStatus:
CONTINUITY_CANDIDATE

groundTruthUsed:
false

groundTruthCountUsedAsStopCondition:
false

unionCountUsedAsStopCondition:
false
```

Candidate-only state was frozen as:

```text
LONG_200_CANDIDATE_ONLY_CLASSIFICATION:
CONTINUITY_CANDIDATE
```

Only after this freeze was the oracle consulted.

---

# 12. Baseline Candidate-only Summary Code

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

let candidateOnlyStatus;

if (state.blocked) {
  candidateOnlyStatus =
    "BLOCKED";

} else if (
  state.sweepCompleted &&
  ordinals.length > 0 &&
  ordinals[0] === 1 &&
  gaps.length === 0 &&
  !anyCaptureRejected &&
  !anyIdentityConflict
) {
  candidateOnlyStatus =
    "CONTINUITY_CANDIDATE";

} else if (
  state.sweepCompleted &&
  gaps.length > 0
) {
  candidateOnlyStatus =
    "INCOMPLETE_INTERNAL_GAP";

} else {
  candidateOnlyStatus =
    "UNKNOWN";
}
```

---

# 13. Baseline Ground Truth Comparison

After candidate freeze:

Runtime:

```text
run-local distinct runtime identities:
200

observed ordinal range:
1-200

internal gaps:
0
```

Frozen Long-200 oracle:

```text
expected distinct occurrences:
200
```

Comparison:

```text
MATCH
```

Therefore:

```text
LONG_200_BASELINE:
PASS
```

as a formal technical baseline observation.

---

# 14. Reload Reproducibility Objective

Candidate Decision later required one additional run before Final Verdict:

```text
explicit reload
+
fresh runtime session
+
fresh run-local accumulator
+
same 20% visible-only baseline
```

The purpose was to ensure the success did not depend on:

- previous mount history;
- the current `window` state;
- the previous run-local union;
- a traversal state created earlier in the same page lifetime.

---

# 15. Reload Evidence

The Repro Run used:

```javascript
const navigationEntry =
  performance.getEntriesByType(
    "navigation"
  )[0];

const navigationType =
  navigationEntry?.type ?? "unknown";

if (
  navigationType !== "reload"
) {
  throw new Error(
    "Expected navigationType='reload'."
  );
}
```

Recorded:

```text
navigationType:
reload

reloadEvidence:
true

documentReadyState:
complete

pageVisible:
true
```

Fresh accumulator:

```text
__TASK003_L200_REPRO1__
```

---

# 16. Reload Reproducibility Run

The same qualified method was reused without changing:

- visibility precondition;
- 20% step;
- full ordinal-array settle;
- Message-unit relation;
- runtime identity / turn / role invariants;
- Bottom-only termination;
- candidate-before-Ground-Truth order.

No tuning was introduced between baseline and reproducibility runs.

---

# 17. Reload Reproducibility Result

Recorded:

```text
completed:
true

blocked:
false

blockedReason:
null

sweepCaptureCount:
112

finalVisibilityState:
visible

finalDocumentHidden:
false

finalScrollTop:
20278

finalScrollHeight:
21188

finalClientHeight:
910

finalAtBottomCandidate:
true

finalRunLocalUnionRuntimeIdentityCount:
200

unionCountUsedAsStopCondition:
false
```

Again, the union first reached:

```text
200
```

at:

```text
REPRO1-S095
```

while Bottom was still false.

The run continued to:

```text
REPRO1-S112
```

and then reached Bottom.

---

# 18. Reload Candidate-only Summary

Recorded:

```text
navigationType:
reload

reloadEvidence:
true

sweepCompleted:
true

blocked:
false

runLocalUnionRuntimeIdentityCount:
200

runLocalUnionRoleCounts:
user = 100
assistant = 100
other = 0

observedOrdinalRanges:
1-200

observedOrdinalMin:
1

observedOrdinalMax:
200

observedInternalGapCount:
0

distinctObservedOrdinalCount:
200

identityOrdinalCardinalityMatch:
true

anyCaptureRejected:
false

anyIdentityConflict:
false

candidateOnlyStatus:
CONTINUITY_CANDIDATE

groundTruthUsed:
false

groundTruthCountUsedAsStopCondition:
false

unionCountUsedAsStopCondition:
false
```

Candidate state:

```text
LONG_200_REPRO1_CANDIDATE_ONLY_CLASSIFICATION:
CONTINUITY_CANDIDATE
```

After freeze:

```text
Ground Truth comparison:
MATCH
```

---

# 19. Baseline vs Reload Reproducibility

| Field | Baseline | Reload Repro |
|---|---:|---:|
| Sweep captures | 112 | 112 |
| First union=200 | S095 | S095 |
| Bottom | S112 | S112 |
| Final scrollTop | 20278 | 20278 |
| Final scrollHeight | 21188 | 21188 |
| clientHeight | 910 | 910 |
| Ordinal union | 1-200 | 1-200 |
| Internal gaps | 0 | 0 |
| Identity conflicts | 0 | 0 |
| Final run-local union | 200 | 200 |

This is stronger than merely observing two successful runs.

The traversal progression itself was highly reproducible under the same viewport/runtime conditions.

---

# 20. Safety Fields

## Baseline

```text
FIXTURE_ALIAS:
Long-200

RELOAD_PERFORMED:
false

MANUAL_SCROLL_OUTSIDE_COMMAND:
false

CHATGPT_CONVERSATION_KEPT_VISIBLE_DURING_SWEEP:
true

VISIBILITY_BLOCK_OCCURRED:
false

GROUND_TRUTH_COUNT_USED_AS_STOP_CONDITION:
false

GROUND_TRUTH_BOUNDARY_USED_FOR_TRAVERSAL:
false

GROUND_TRUTH_USED_FOR_RECOVERY:
false

OBSERVED_GAP_USED_AS_EXACT_NAVIGATION_TARGET:
false

UNION_COUNT_USED_AS_STOP_CONDITION:
false

RAW_RUNTIME_IDENTITY_PERSISTED:
false

RAW_MESSAGE_BODY_PERSISTED:
false

RAW_DOM_HTML_PERSISTED:
false
```

## Reload Reproducibility

```text
FIXTURE_ALIAS:
Long-200

REPRO_RUN:
1

EXPLICIT_RELOAD_PERFORMED:
true

RELOAD_COUNT_BEFORE_RUN:
1

SECOND_RELOAD_PERFORMED:
false

NAVIGATION_TYPE_REPORTED_AS_RELOAD:
true

FRESH_RUN_LOCAL_ACCUMULATOR_CREATED:
true

MANUAL_SCROLL_OUTSIDE_COMMAND:
false

CHATGPT_CONVERSATION_KEPT_VISIBLE_DURING_SWEEP:
true

VISIBILITY_BLOCK_OCCURRED:
false

GROUND_TRUTH_COUNT_USED_AS_STOP_CONDITION:
false

GROUND_TRUTH_BOUNDARY_USED_FOR_TRAVERSAL:
false

GROUND_TRUTH_USED_FOR_RECOVERY:
false

OBSERVED_GAP_USED_AS_EXACT_NAVIGATION_TARGET:
false

UNION_COUNT_USED_AS_STOP_CONDITION:
false

RAW_RUNTIME_IDENTITY_PERSISTED:
false

RAW_MESSAGE_BODY_PERSISTED:
false

RAW_DOM_HTML_PERSISTED:
false
```

---

# 21. Reproducibility Gate Decision

Decision:

```text
LONG_200_BASELINE:
PASS

LONG_200_RELOAD_REPRODUCIBILITY:
PASS

LONG_200_RELOAD_REPRODUCIBILITY_GATE:
PASS

ADDITIONAL_MANUAL_REPRO_RUN_REQUIRED:
NO
```

This gate authorized the project to stop repeating the same manual DOM scan and move toward contract codification in the Minimal PoC.

---

# 22. Scope of What Was Established

This document establishes strong positive Evidence that:

```text
the qualified 20% visible-only baseline
can traverse the Long-200 fixture
from Top to Bottom,
accumulate a consistent run-local identity union,
observe a contiguous ordinal union,
and reproduce after reload
```

It does **not** establish:

- that 20% is optimal;
- that 40/60/80% are safe;
- viewport-size invariance;
- Project Chat long-conversation behavior;
- production performance SLA;
- universal Chromium lifecycle behavior.

Those concerns are handled in the Candidate Decision / Deferred Items documents.
