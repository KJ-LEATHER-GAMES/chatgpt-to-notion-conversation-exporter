# TASK-003 Long-100 Visibility and Recovery Characterization

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Related validations: TV-005, TV-006
- Fixture: Long-100
- Covered work:
  - Round 3A / original reverse fine-grained sweep
  - Visibility A/B characterization
  - Round 3B visible-only recovery sweep
- Document role: Evidence and characterization of page visibility as a traversal precondition
- Historical Evidence replacement: **NO**
- Ground Truth used for recovery navigation: **NO**

This document records the discovery that programmatic scroll geometry could advance while ChatGPT's mounted Message range remained stale when the document was hidden, and that making the page visible caused the mounted set to recompute without any additional scroll.

It then records the successful visible-only 20%-viewport recovery sweep.

---

# 2. Entry State from Round 2

Round 3 began with the existing Long-100 runtime accumulator preserved.

Recorded preflight:

```text
round:
3

method:
REVERSE_FINE_GRAINED_SWEEP

viewportFraction:
0.2

accumulatorReused:
true

startAtTopCandidate:
true

existingSnapshotCount:
14

existingUnionRuntimeIdentityCount:
99

observedOrdinalMin:
1

observedOrdinalMax:
100

observedInternalGapCount:
1

observedInternalGap:
after 75 / before 77 / missing 1

groundTruthUsed:
false

exactGapUsedAsNavigationTarget:
false
```

The known runtime gap was **not** used as a navigation target.

---

# 3. Round 3A — Original 20% Reverse Fine-grained Sweep

## 3.1 Objective

Round 3A attempted to recover additional runtime identities generically by reversing direction:

```text
Top -> Bottom
```

with:

```text
20% viewport step
```

while reusing the Round 2 accumulator.

This was intended to test whether a finer sweep could recover a missed occurrence without directly navigating to the known gap.

---

## 3.2 Exact Preflight Command

The retained Console log contains the exact preflight command:

```javascript
(() => {
  const KEY = "__TASK003_R2__";
  const state = window[KEY];

  if (!state) {
    throw new Error(
      "Round 2 accumulator not found. Do not continue."
    );
  }

  if (state.failed) {
    throw new Error(
      "Accumulator is FAIL-CLOSED. Do not continue."
    );
  }

  if (!state.scroller) {
    throw new Error(
      "Scroll container unavailable. Do not continue."
    );
  }

  if (state.round3) {
    throw new Error(
      "Round 3 is already initialized. Do not initialize twice."
    );
  }

  const scroller = state.scroller;

  const atTop =
    Math.abs(scroller.scrollTop) <= 1;

  if (!atTop) {
    throw new Error(
      "Round 3 must start from the current Top geometry candidate. Do not manually reposition."
    );
  }

  const ordinals = [
    ...state.ordinalToRuntime.keys()
  ].sort((a, b) => a - b);

  const gaps = [];

  for (let i = 1; i < ordinals.length; i++) {
    const previous = ordinals[i - 1];
    const current = ordinals[i];

    if (current > previous + 1) {
      gaps.push({
        afterOrdinal: previous,
        beforeOrdinal: current,
        missingOrdinalCount:
          current - previous - 1
      });
    }
  }

  state.round3 = {
    version: "TASK003-R3-v1",
    method:
      "REVERSE_FINE_GRAINED_SWEEP",
    viewportFraction: 0.20,
    started: true,
    completed: false,
    blocked: false,
    captureCount: 0,
    startAtTopConfirmed: true
  };

  const result = {
    round: 3,
    method:
      state.round3.method,
    viewportFraction:
      state.round3.viewportFraction,
    accumulatorReused: true,
    startAtTopCandidate: atTop,
    existingSnapshotCount:
      state.snapshots.length,
    existingUnionRuntimeIdentityCount:
      state.runtimeMeta.size,
    observedOrdinalMin:
      ordinals.length
        ? ordinals[0]
        : null,
    observedOrdinalMax:
      ordinals.length
        ? ordinals[ordinals.length - 1]
        : null,
    observedInternalGapCount:
      gaps.length,
    observedInternalGaps:
      gaps,
    groundTruthUsed:
      false,
    exactGapUsedAsNavigationTarget:
      false
  };

  console.log(
    JSON.stringify(result, null, 2)
  );

  return result;
})();
```

---

# 4. Round 3A Exact Step Command

The retained log also contains the exact repeated step command.

```javascript
(async () => {
  const KEY = "__TASK003_R2__";
  const state = window[KEY];

  if (!state) {
    throw new Error(
      "Round 2 accumulator not found."
    );
  }

  if (state.failed) {
    throw new Error(
      "Accumulator is FAIL-CLOSED. Stop."
    );
  }

  if (!state.round3?.started) {
    throw new Error(
      "Round 3 is not initialized. Run the Round 3 Preflight command first."
    );
  }

  if (state.round3.completed) {
    throw new Error(
      "Round 3 Bottom geometry candidate has already been reached. Do not continue."
    );
  }

  if (state.round3.blocked) {
    throw new Error(
      "Round 3 is BLOCKED. Stop and report the previous result."
    );
  }

  const scroller = state.scroller;

  if (!scroller) {
    state.round3.blocked = true;

    throw new Error(
      "Scroll container unavailable. Stop."
    );
  }

  const beforeScrollTop =
    Math.round(scroller.scrollTop);

  const beforeScrollHeight =
    scroller.scrollHeight;

  const clientHeight =
    scroller.clientHeight;

  const beforeMaxScrollTop =
    Math.max(
      0,
      beforeScrollHeight - clientHeight
    );

  const alreadyAtBottom =
    Math.abs(
      beforeMaxScrollTop -
      beforeScrollTop
    ) <= 2;

  if (alreadyAtBottom) {
    state.round3.completed = true;

    throw new Error(
      "Bottom geometry candidate is already reached. Round 3 is complete."
    );
  }

  const requestedStepPx =
    Math.max(
      1,
      Math.round(clientHeight * 0.20)
    );

  const requestedTargetScrollTop =
    Math.min(
      beforeMaxScrollTop,
      beforeScrollTop + requestedStepPx
    );

  scroller.scrollTo({
    top: requestedTargetScrollTop,
    behavior: "auto"
  });

  async function waitForStableDOM() {
    let previousSignature = null;
    let stableSamples = 0;

    for (let i = 0; i < 24; i++) {
      await new Promise(resolve =>
        setTimeout(resolve, 200)
      );

      const sections = [
        ...document.querySelectorAll(
          'section[data-testid^="conversation-turn-"]'
        )
      ];

      const ordinals = sections
        .map(section => {
          const testId =
            section.getAttribute(
              "data-testid"
            );

          const match =
            testId?.match(
              /^conversation-turn-(\d+)$/
            );

          return match
            ? Number(match[1])
            : null;
        })
        .filter(Number.isSafeInteger);

      const signature = [
        Math.round(scroller.scrollTop),
        scroller.scrollHeight,
        scroller.clientHeight,
        sections.length,
        ordinals.length
          ? Math.min(...ordinals)
          : "null",
        ordinals.length
          ? Math.max(...ordinals)
          : "null"
      ].join("|");

      if (signature === previousSignature) {
        stableSamples++;
      } else {
        previousSignature = signature;
        stableSamples = 0;
      }

      if (stableSamples >= 2) {
        return {
          settled: true,
          stableSamples:
            stableSamples + 1
        };
      }
    }

    return {
      settled: false,
      stableSamples
    };
  }

  const settleResult =
    await waitForStableDOM();

  if (!settleResult.settled) {
    state.round3.blocked = true;

    throw new Error(
      "DOM did not reach a stable observation state. Round 3 BLOCKED; stop and report."
    );
  }

  const afterScrollTop =
    Math.round(scroller.scrollTop);

  const movementObserved =
    afterScrollTop > beforeScrollTop;

  const label =
    `R3-${String(
      state.round3.captureCount + 1
    ).padStart(2, "0")}`;

  const result =
    state.capture(label, {
      type:
        "RECOVERY_SCROLL_DOWN",

      method:
        "REVERSE_FINE_GRAINED_SWEEP",

      requestedViewportFraction:
        0.20,

      requestedStepPx,

      requestedTargetScrollTop,

      beforeScrollTop,

      beforeScrollHeight,

      afterScrollTop,

      actualMovedPx:
        afterScrollTop -
        beforeScrollTop,

      movementObserved,

      domSettled:
        settleResult.settled,

      exactGapUsedAsNavigationTarget:
        false,

      groundTruthUsed:
        false
    });

  state.round3.captureCount++;

  if (!result.captureAccepted) {
    state.round3.blocked = true;
  }

  if (
    !movementObserved &&
    !result.atBottomCandidate
  ) {
    state.round3.blocked = true;
  }

  if (result.atBottomCandidate) {
    state.round3.completed = true;
  }

  return result;
})();
```

---

# 5. Round 3A Recorded Behavior

R3-01 through R3-13 all reported:

```text
captureAccepted:
true

failClosed:
false

identity conflicts:
0

movementObserved:
true

domSettled:
true

newRuntimeIdentityCount:
0

unionRuntimeIdentityCount:
99
```

The scroll geometry moved approximately 182 px per step:

```text
R3-01:
0 -> 182

...

R3-13:
2184 -> 2366
```

But the mounted Message set remained unchanged:

```text
mountedMessageCount:
23

mountedOrdinals:
1-18,96-100
```

The geometry remained:

```text
scrollHeight:
10716

clientHeight:
911
```

and Bottom had not yet been reached.

### Critical observation

```text
scroll geometry progressed
BUT
mounted Message range did not progress
```

The run was intentionally paused before Bottom.

---

# 6. Why Round 3A Was Not Accepted as a Valid Recovery Sweep

At this point two possible problems existed:

1. the page/window visibility state might be suppressing or delaying ChatGPT virtualization updates;
2. the current settle logic might declare `domSettled:true` too early because its signature only tracked count/min/max, not the full mounted set.

Therefore:

```text
ROUND_3A:
PAUSED

REVERSE_20_PERCENT_METHOD:
NOT YET JUDGED
```

The correct next action was a visibility characterization, not continued scrolling.

---

# 7. Visibility A/B Characterization

## 7.1 Test Design

No reload.

No accumulator reset.

No manual scroll.

No exact-gap targeting.

Measure the current DOM once while the page is not displayed, then make the Conversation visible and measure again **without scrolling**.

---

## 7.2 Exact Diagnostic Code

```javascript
(() => {
  const state = window.__TASK003_R2__;
  const scroller = state?.scroller;

  const sections = [
    ...document.querySelectorAll(
      'section[data-testid^="conversation-turn-"]'
    )
  ];

  const ordinals = sections
    .map(section => {
      const match =
        section
          .getAttribute("data-testid")
          ?.match(/^conversation-turn-(\d+)$/);

      return match ? Number(match[1]) : null;
    })
    .filter(Number.isSafeInteger);

  const result = {
    phase: "BEFORE_VISIBLE",

    visibilityState:
      document.visibilityState,

    documentHidden:
      document.hidden,

    documentHasFocus:
      document.hasFocus(),

    scrollTop:
      scroller
        ? Math.round(scroller.scrollTop)
        : null,

    scrollHeight:
      scroller?.scrollHeight ?? null,

    clientHeight:
      scroller?.clientHeight ?? null,

    mountedMessageCount:
      sections.length,

    mountedOrdinals:
      ordinals,

    unionRuntimeIdentityCount:
      state?.runtimeMeta?.size ?? null
  };

  console.log(
    JSON.stringify(result, null, 2)
  );

  return result;
})();
```

For the second observation only:

```text
phase = AFTER_VISIBLE_NO_SCROLL
```

was changed.

---

# 8. Visibility A/B Recorded Result

## BEFORE_VISIBLE

```text
visibilityState:
hidden

documentHidden:
true

documentHasFocus:
false

scrollTop:
2366

scrollHeight:
10716

clientHeight:
911

mountedMessageCount:
23

mountedOrdinals:
1-18,96-100

unionRuntimeIdentityCount:
99
```

## AFTER_VISIBLE_NO_SCROLL

```text
visibilityState:
visible

documentHidden:
false

documentHasFocus:
false

scrollTop:
2366

scrollHeight:
10700

clientHeight:
911

mountedMessageCount:
34

mountedOrdinals:
13-41,96-100

unionRuntimeIdentityCount:
99
```

---

# 9. Visibility Finding

The key controlled relation was:

```text
scrollTop:
2366 -> 2366
```

No scroll occurred.

Yet:

```text
mounted set:
1-18,96-100
->
13-41,96-100
```

Therefore this fixture directly demonstrated:

```text
hidden -> visible transition
can cause the mounted Message range to recompute
without an additional scroll
```

`document.hasFocus()` remained `false` both before and after.

Therefore:

```text
DOCUMENT_VISIBILITY_RELEVANT:
OBSERVED

DOCUMENT_FOCUS_REQUIRED:
NOT SUPPORTED
```

The broader claim:

```text
"DOM never updates unless physically displayed"
```

was **not** adopted.

The narrower safe conclusion was:

> ChatGPT long-conversation virtualization progress can depend on effective page visibility / render activity; hidden-state traversal cannot be trusted as equivalent to visible traversal.

---

# 10. Visibility Precondition Candidate

The characterization promoted the following condition:

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

If false during formal traversal:

```text
BLOCKED
-> do not continue the same run
-> do not claim Complete
```

`document.hasFocus()` remained diagnostic only.

---

# 11. Improved Settle Relation

Round 3A's coarse signature:

```text
scrollTop
scrollHeight
clientHeight
mounted count
min ordinal
max ordinal
```

was replaced.

The improved signature included the full mounted ordinal array.

```javascript
async function waitForStableVisibleDOM() {
  let previousSignature = null;
  let consecutiveStableSamples = 0;

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

    if (
      document.visibilityState !==
        "visible" ||
      document.hidden
    ) {
      return {
        settled: false,
        blockedByVisibility: true,
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
      consecutiveStableSamples++;
    } else {
      previousSignature =
        signature;

      consecutiveStableSamples = 1;
    }

    if (
      consecutiveStableSamples >=
      requiredStableSamples
    ) {
      return {
        settled: true,
        blockedByVisibility: false
      };
    }
  }

  return {
    settled: false,
    blockedByVisibility: false,
    reason:
      "DOM_STABILITY_TIMEOUT"
  };
}
```

---

# 12. Round 3B — Visible-only Recovery Sweep

## 12.1 Method

Round 3B retained the same Round 2 accumulator and performed a generic:

```text
programmatic Top reset
+
visible hard precondition
+
20% viewport Top -> Bottom sweep
+
full ordinal-array settle
```

The missing ordinal 76 was **not** used as a target.

The union count was **not** used as a stop condition.

---

## 12.2 Round 3B Top Capture

Recorded S00:

```text
snapshot:
R3B-S00

captureAccepted:
true

failClosed:
false

mountedMessageCount:
23

mountedOrdinals:
1-18,96-100

newRuntimeIdentityCount:
0

unionRuntimeIdentityCount:
99

scrollTop:
0

scrollHeight:
10716

clientHeight:
910

atTopCandidate:
true

identityConflictCount:
0
```

---

# 13. Round 3B Scroll Core

The formal step relation was:

```javascript
const requestedStepPx =
  Math.max(
    1,
    Math.round(
      scroller.clientHeight *
      0.20
    )
  );

const targetScrollTop =
  Math.min(
    scroller.scrollHeight -
      scroller.clientHeight,

    Math.round(
      scroller.scrollTop
    ) +
      requestedStepPx
  );

scroller.scrollTo({
  top:
    targetScrollTop,

  behavior:
    "auto"
});
```

Before and after every scroll:

```javascript
if (
  document.visibilityState !==
    "visible" ||
  document.hidden
) {
  state.round3b.blocked = true;

  throw new Error(
    "Page hidden during Round 3B."
  );
}
```

After settle, the existing validated `state.capture(...)` relation was called.

---

# 14. Generic Recovery of the Missing Runtime Occurrence

The decisive snapshot was:

```text
R3B-S34

scrollTop:
6172

mountedMessageCount:
34

mountedOrdinals:
49-77,96-100

newRuntimeIdentityCount:
1

unionRuntimeIdentityCount:
100

identityConflictCount:
0

atBottomCandidate:
false
```

This snapshot contained ordinal 76.

Crucially:

```text
exactGapUsedAsNavigationTarget:
false
```

The ordinal was recovered naturally by the generic visible-only sweep.

Therefore:

```text
recovery:
GENERAL TRAVERSAL

not:
GROUND-TRUTH / GAP TARGETED REPAIR
```

---

# 15. Union Count Did Not Terminate the Run

The runtime union first reached:

```text
100
```

at:

```text
R3B-S34
```

But:

```text
atBottomCandidate:
false
```

The sweep continued through:

```text
R3B-S35 ... R3B-S54
```

Final snapshot:

```text
R3B-S54

mountedOrdinals:
83-100

scrollTop:
9790

scrollHeight:
10700

clientHeight:
910

unionRuntimeIdentityCount:
100

atBottomCandidate:
true
```

Thus:

```text
UNION_COUNT_USED_AS_STOP_CONDITION:
false
```

was demonstrated by behavior, not only operator attestation.

---

# 16. Round 3B Final Summary

Recorded:

```text
completed:
true

blocked:
false

blockedReason:
null

captureCount:
54

finalVisibilityState:
visible

finalDocumentHidden:
false

finalScrollTop:
9790

finalScrollHeight:
10700

finalClientHeight:
910

finalUnionRuntimeIdentityCount:
100

unionCountUsedAsStopCondition:
false
```

Candidate-only summary:

```text
round3bSnapshotCount:
55

observedOrdinalRanges:
1-100

observedOrdinalMin:
1

observedOrdinalMax:
100

observedInternalGapCount:
0

observedInternalGaps:
[]

anyCaptureRejected:
false

anyIdentityConflict:
false

candidateOnlyRecoveryStatus:
RECOVERY_CONTINUITY_CANDIDATE

groundTruthUsed:
false
```

---

# 17. Candidate-only Summary Code

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

let candidateOnlyRecoveryStatus;

if (
  state.round3b?.blocked
) {
  candidateOnlyRecoveryStatus =
    "BLOCKED";

} else if (
  state.round3b?.completed &&
  gaps.length === 0 &&
  !anyCaptureRejected &&
  !anyIdentityConflict
) {
  candidateOnlyRecoveryStatus =
    "RECOVERY_CONTINUITY_CANDIDATE";

} else if (
  state.round3b?.completed
) {
  candidateOnlyRecoveryStatus =
    "INCOMPLETE";

} else {
  candidateOnlyRecoveryStatus =
    "NOT_COMPLETE";
}
```

---

# 18. Ground Truth Comparison After Candidate Freeze

Only after:

```text
RECOVERY_CONTINUITY_CANDIDATE
```

was frozen was the Long-100 oracle consulted.

Runtime:

```text
ordinal union:
1-100

runtime identity union:
100

internal gaps:
0
```

Frozen oracle:

```text
expected distinct occurrences:
100
```

Comparison:

```text
MATCH
```

---

# 19. Round 3B Safety Fields

Recorded operator provenance:

```text
FIXTURE_ALIAS:
Long-100

RELOAD_PERFORMED:
false

ACCUMULATOR_REINITIALIZED:
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

# 20. Characterization Decision

The evidence supports:

```text
PAGE_VISIBILITY_AFFECTS_MOUNTED_RANGE:
OBSERVED

VISIBLE_STATE_AS_TRAVERSAL_PRECONDITION:
STRONGLY_SUPPORTED

DOCUMENT_FOCUS_PRECONDITION:
NOT REQUIRED

FULL_ORDINAL_ARRAY_SETTLE:
REQUIRED FOR BASELINE

20_PERCENT_VISIBLE_SWEEP:
SUCCESSFUL ON LONG_100

TARGETED_GAP_REPAIR:
NOT USED
```

The exact claim that visibility caused the original Round 2 miss of ordinal 76 remained:

```text
LIKELY
NOT PROVEN FOR THE EXACT ROUND 2 TRANSITION
```

because Round 2 snapshots did not record visibility at every step.

The method itself, however, was now ready for qualification review.
