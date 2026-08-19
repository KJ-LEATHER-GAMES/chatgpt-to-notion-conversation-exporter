# TASK-003 TV-005 / TV-006 Manual Discovery Protocol

## 1. Document Status

- Integrated document date: 2026-08-19
- Scope: manual runtime Discovery protocol for TV-005 / TV-006
- Primary fixtures: Long-100, Long-200
- Fixture Source Type: Standard
- Ground Truth prerequisite: established independently before candidate observation
- Historical round result replacement: **NO**
- Production algorithm: **NOT DEFINED by this document**

This document consolidates the manual Discovery protocol actually used and the final baseline relation that emerged from Long-100 qualification and Long-200 confirmation.

## 2. Validation Questions

### TV-005 — Loading / Traversal

Can a long virtualized Conversation be traversed so that previously unmounted Messages become observable and the complete occurrence set can be accumulated?

### TV-006 — Completeness

Can a runtime-only candidate relation determine whether acquisition is complete without reading the fixture Ground Truth, and without false-completing an incomplete observation?

## 3. Entry Preconditions

Discovery may begin only when:

```text
LONG_100_GROUND_TRUTH: ESTABLISHED
LONG_200_GROUND_TRUTH: ESTABLISHED
```

Additional preconditions:

- fixture is observation-only;
- no Message creation / edit / regenerate / branch operation;
- Ground Truth is frozen;
- raw runtime identifiers are not persisted;
- operator understands Safety Fields and manual-scroll restrictions.

## 4. Required Evaluation Order

```text
1. Observe runtime state
2. Acquire / union runtime identities
3. Evaluate candidate-only completeness relation
4. Freeze candidate classification
5. Compare with independent Ground Truth
```

Never reverse steps 3 and 5.

## 5. Runtime Message Relation

Each mounted Message unit is based on:

```text
section[data-testid^="conversation-turn-"]
```

Within a valid mounted Message unit, the Discovery relation expects:

- one runtime `data-message-id`;
- one `data-turn-id`;
- one `data-message-author-role`;
- an ordinal parsed from `conversation-turn-N`.

Interpretation:

```text
data-message-id
= runtime capture / dedup identity only

data-turn-id
= runtime cross-check identity

conversation-turn-N
= ordering / ordinal material
```

No claim is made that `data-message-id` is a canonical persistent OpenAI Message ID.

## 6. Discovery Phase Sequence

### Phase A — Long-100 Initial Inventory

Observe without broad traversal:

- current mounted count;
- current ordinal set;
- role count;
- runtime identity field cardinality;
- DOM ordinal order;
- scroll geometry;
- obvious loading / progress candidates.

The initial state must be classified candidate-only. Ground Truth count is not used.

### Phase B — Long-100 Fixed-step Traversal / False-complete Search

Use staged traversal while maintaining a run-local union.

The historical qualification run began from the bottom area and used a coarse 80%-viewport upward step. It reached the top while leaving an internal ordinal gap. This was preserved as a false-complete counterexample rather than repaired using Ground Truth.

### Phase C — Visibility Characterization

When programmatic scrolling changed geometry without changing mounted ordinals, characterize page visibility before changing the traversal method.

Required A/B:

```text
BEFORE_VISIBLE
vs
AFTER_VISIBLE_NO_SCROLL
```

Do not manually scroll between the two diagnostics.

### Phase D — Long-100 Visible Recovery / Method Qualification

Use a generic visible-only 20%-viewport Top-to-Bottom sweep.

Do not navigate to the known missing ordinal.

Do not stop when the runtime union happens to equal the Ground Truth count.

### Phase E — Long-200 Formal Baseline

Use a fresh Long-200 run-local accumulator and the same 20% visible-only baseline relation.

### Phase F — Long-200 Reload Reproducibility

Reload Long-200 once, create a completely fresh accumulator, and repeat the same baseline method without changing the algorithm.

## 7. Visibility Hard Precondition

After characterization, the following became mandatory for a valid formal traversal:

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

Required checks:

- before starting;
- before every scroll step;
- during settle polling;
- after every scroll step; and
- at capture.

If visibility becomes invalid:

```text
PAGE_HIDDEN
-> BLOCKED
-> do not resume the same formal run
-> do not claim COMPLETE_CANDIDATE
```

`document.hasFocus()` is diagnostic only and is not a required precondition.

## 8. Mounted Ordinal Acquisition Helper

The following helper was used in the visibility and baseline code family:

```javascript
const TURN_SELECTOR =
  'section[data-testid^="conversation-turn-"]';

function getMountedOrdinals() {
  return [
    ...document.querySelectorAll(TURN_SELECTOR)
  ]
    .map(section => {
      const match =
        section
          .getAttribute("data-testid")
          ?.match(/^conversation-turn-(\d+)$/);

      return match ? Number(match[1]) : null;
    })
    .filter(Number.isSafeInteger);
}
```

The complete ordinal array, not just min / max, is required for settle observation and continuity analysis.

## 9. Improved Settle Relation

The original coarse settle logic was found insufficient because min / max / count could remain stable while virtualization changed later.

The improved relation samples:

- `scrollTop`;
- `scrollHeight`;
- `clientHeight`; and
- the **full ordered mounted ordinal array**.

Shared implementation used by the baseline command family:

```javascript
async function waitForStableVisibleDOM() {
  let previousSignature = null;
  let stableSamples = 0;

  const maxSamples = 50;
  const intervalMs = 250;
  const requiredStableSamples = 3;

  for (let i = 0; i < maxSamples; i++) {
    await new Promise(resolve =>
      setTimeout(resolve, intervalMs)
    );

    if (!visibleNow()) {
      return {
        settled: false,
        reason: "PAGE_BECAME_HIDDEN"
      };
    }

    const ordinals = getMountedOrdinals();

    const signature = JSON.stringify({
      scrollTop: Math.round(state.scroller.scrollTop),
      scrollHeight: state.scroller.scrollHeight,
      clientHeight: state.scroller.clientHeight,
      mountedOrdinals: ordinals
    });

    if (signature === previousSignature) {
      stableSamples++;
    } else {
      previousSignature = signature;
      stableSamples = 1;
    }

    if (stableSamples >= requiredStableSamples) {
      return {
        settled: true,
        stableSamples
      };
    }
  }

  return {
    settled: false,
    reason: "DOM_STABILITY_TIMEOUT"
  };
}
```

`state.scroller` refers to the single previously established scroll container for the run.

## 10. Scroll Container Contract

The run must establish exactly one valid scrollable ancestor for the Conversation Message region.

During the run:

```text
same scroll container object
= required
```

If the container becomes missing, ambiguous, or changes identity:

```text
SCROLL_CONTAINER_CHANGED
-> BLOCKED / Fail Closed
```

## 11. Run-local Accumulator Contract

For each formal baseline run, use fresh in-memory maps:

```javascript
const state = {
  runtimeMeta: new Map(),
  ordinalToRuntime: new Map(),
  turnToRuntime: new Map(),
  snapshots: []
};
```

Required invariants:

- same runtime ID must retain the same ordinal / role / turn ID;
- same ordinal must not map to a different runtime ID;
- same turn ID must not map to a different runtime ID;
- duplicate runtime ID inside one mounted snapshot is invalid;
- duplicate ordinal inside one mounted snapshot is invalid; and
- DOM ordinal order must remain strictly increasing.

The union is runtime-only acquisition state. It is not by itself proof of completeness.

## 12. Traversal Baseline

The qualified conservative baseline is:

```text
START:
programmatic Top

DIRECTION:
Top -> Bottom

STEP:
20% of current viewport height

SETTLE:
full signature stability

CAPTURE:
after every settled step

STOP:
Bottom geometry candidate only
```

Step calculation:

```javascript
const requestedStepPx = Math.max(
  1,
  Math.round(scroller.clientHeight * 0.20)
);
```

Target:

```javascript
const targetScrollTop = Math.min(
  scroller.scrollHeight - scroller.clientHeight,
  Math.round(scroller.scrollTop) + requestedStepPx
);

scroller.scrollTo({
  top: targetScrollTop,
  behavior: "auto"
});
```

The 20% value is a Technical Validation baseline, not a Production requirement.

## 13. Top and Bottom Geometry

Top candidate:

```javascript
const atTopCandidate =
  Math.abs(scroller.scrollTop) <= 1;
```

Bottom candidate:

```javascript
const atBottomCandidate =
  Math.abs(
    scroller.scrollHeight -
    scroller.clientHeight -
    scroller.scrollTop
  ) <= 2;
```

Interpretation:

```text
Top / Bottom
= traversal boundary authentication

Top / Bottom alone
!= completeness proof
```

## 14. Forbidden Stop Conditions

Do not stop because:

- runtime union reached 100 / 200;
- expected count was reached;
- observed max ordinal matched expected count;
- one step produced zero new runtime IDs;
- several local snapshots looked stable;
- mounted count stopped changing; or
- first and last ordinals had both appeared.

A key anti-self-approval test is that the Long-200 baseline continued after the runtime union first reached the expected total and stopped only at Bottom.

## 15. Candidate-only Continuity Analysis

After traversal, derive the sorted distinct ordinal union from `ordinalToRuntime`.

Gap detection used by the command family:

```javascript
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
```

Candidate continuity requires the observed union to begin at ordinal 1 and have no internal gap through the maximum observed ordinal.

This logic does not read the expected total.

## 16. Candidate-only Classification

Planning diagnostic states:

```text
INCOMPLETE
UNKNOWN
AMBIGUOUS
INCONSISTENT
COMPLETE_CANDIDATE
```

Formal candidate decision adopted later requires all relevant conditions to agree before `COMPLETE_CANDIDATE` is allowed.

At minimum, an explicit internal ordinal gap is `INCOMPLETE`.

Missing evidence that prevents proof is `UNKNOWN` rather than guessed Complete.

Conflicting candidate families are `INCONSISTENT` / Fail Closed.

## 17. False-complete Observation Requirement

TV-006 Discovery must deliberately preserve observations where plausible superficial signals look complete but the runtime evidence is incomplete.

Long-100 provided a critical counterexample:

```text
initial bottom area observed
+
Top reached
+
first ordinal observed
+
last ordinal observed
+
identity relations consistent
+
final no-new-ID observation
+
internal ordinal gap remains

=> INCOMPLETE
```

This demonstrates why min/max, boundary reach, or convergence alone cannot be the completeness rule.

## 18. Visibility Characterization Code

The exact safe diagnostic used before and after making the page visible was:

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
    visibilityState: document.visibilityState,
    documentHidden: document.hidden,
    documentHasFocus: document.hasFocus(),
    scrollTop:
      scroller ? Math.round(scroller.scrollTop) : null,
    scrollHeight: scroller?.scrollHeight ?? null,
    clientHeight: scroller?.clientHeight ?? null,
    mountedMessageCount: sections.length,
    mountedOrdinals: ordinals,
    unionRuntimeIdentityCount:
      state?.runtimeMeta?.size ?? null
  };

  console.log(JSON.stringify(result, null, 2));
  return result;
})();
```

For the second observation only `phase` was changed to:

```text
AFTER_VISIBLE_NO_SCROLL
```

No scroll occurred between the two observations.

## 19. Reload Reproducibility Contract

For the final manual reproducibility gate:

1. reload Long-200 exactly once;
2. verify navigation entry reports `reload`;
3. use a fresh run-local accumulator;
4. keep the same 20% baseline method unchanged;
5. classify candidate-only before Ground Truth comparison.

Reload evidence helper:

```javascript
const navigationEntry =
  performance.getEntriesByType("navigation")[0];

const navigationType =
  navigationEntry?.type ?? "unknown";

if (navigationType !== "reload") {
  throw new Error(
    `Expected navigationType='reload', but observed '${navigationType}'.`
  );
}
```

## 20. Formal Run Safety Fields

Each run records operator provenance such as:

```text
RELOAD_PERFORMED
MANUAL_SCROLL_OUTSIDE_COMMAND
CHATGPT_CONVERSATION_KEPT_VISIBLE_DURING_SWEEP
VISIBILITY_BLOCK_OCCURRED
GROUND_TRUTH_COUNT_USED_AS_STOP_CONDITION
GROUND_TRUTH_BOUNDARY_USED_FOR_TRAVERSAL
GROUND_TRUTH_USED_FOR_RECOVERY
OBSERVED_GAP_USED_AS_EXACT_NAVIGATION_TARGET
UNION_COUNT_USED_AS_STOP_CONDITION
RAW_RUNTIME_IDENTITY_PERSISTED
RAW_MESSAGE_BODY_PERSISTED
RAW_DOM_HTML_PERSISTED
```

The baseline / reproducibility runs require the safety values to remain consistent with the protocol.

## 21. End-of-Discovery Baseline Contract

The candidate method passed Long-100 qualification and Long-200 baseline / reload confirmation with the following integrated relation:

```text
VISIBLE hard precondition
+
programmatic Top reset
+
20% viewport Top->Bottom traversal
+
full mounted-ordinal-array settle
+
run-local runtime identity union
+
ordinal / turn / role / DOM-order consistency
+
Bottom termination
+
post-traversal ordinal continuity evaluation
```

The final TV-005 / TV-006 Candidate Decision is documented separately in `TASK-003-tv005-tv006-candidate-decision.md`.

## 22. Deferred Optimization

This protocol does not establish:

- optimal scroll percentage;
- viewport-size invariance;
- performance SLA;
- Production retry / debounce / MutationObserver behavior; or
- Project Chat long-conversation coverage.

Those are not permitted to silently expand the current Formal Pass criteria.
