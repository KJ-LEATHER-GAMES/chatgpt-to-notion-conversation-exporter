# TASK-003 TV-005 / TV-006 Observation and Evidence Contract

## 1. Document Status

- Integrated document date: 2026-08-19
- Scope: runtime observation schema, evidence persistence boundary, operator provenance, and privacy rules for TASK-003 manual Discovery
- Related validation: TV-005 / TV-006
- Related requirements: FR-008, NFR-001, NFR-002, NFR-003
- Historical Evidence replacement: **NO**

## 2. Objective

TASK-003 needed enough runtime information to validate long-conversation loading and completeness without persisting raw Conversation content or turning the fixture oracle into a runtime self-approval signal.

The Evidence contract therefore separates:

```text
Runtime-only sensitive identity state
from
Persistent safe validation metadata
```

## 3. Runtime-only Data

The following may be read / held temporarily in JavaScript memory during one validation run:

- raw `data-message-id`;
- raw `data-turn-id`;
- the exact scroll-container object;
- Runtime-only fixture locator / binding material; and
- other ephemeral values required only to maintain in-run identity consistency.

These values must not be copied into repository Evidence or persistent logs produced for TASK-003.

## 4. Persistent Evidence — Allowed

Safe persistent Evidence may contain:

### Fixture / provenance

- `Long-100`, `Long-200` aliases;
- safe occurrence aliases such as `L100-M001`;
- cycle numbers;
- ordinals;
- roles;
- expected safe counts from the pre-established oracle;
- accepted / invalid booleans;
- fixed status / failure codes.

### Runtime observation

- mounted Message count;
- mounted ordinal list;
- compressed ordinal ranges;
- mounted User / Assistant counts;
- scrollTop;
- scrollHeight;
- clientHeight;
- top / bottom candidate booleans;
- number of new runtime identities in a snapshot;
- run-local union size;
- identity conflict count;
- acquisition/cardinality error counts;
- DOM-order consistency boolean;
- visibility state / hidden boolean;
- settle status;
- candidate-only classification; and
- Ground Truth comparison result after candidate classification freeze.

### Operator provenance

- whether reload occurred;
- whether manual scroll occurred outside the command;
- whether the page remained visible;
- whether Ground Truth was used to steer traversal;
- whether an observed gap was directly targeted;
- whether union count was used as a stop condition; and
- whether raw sensitive fields were persisted.

## 5. Persistent Evidence — Prohibited

Do not persist:

- raw User Message body;
- raw Assistant Message body;
- personal Conversation text;
- raw fixture Title;
- project name when not needed for the safe alias contract;
- URL;
- pathname;
- Conversation ID;
- raw `data-message-id`;
- raw `data-turn-id`;
- tab identifier;
- DOM outerHTML / innerHTML;
- full HTML document;
- cookies;
- tokens;
- authorization headers;
- credentials; or
- browser exception dumps that include restricted values.

## 6. Runtime Identity Storage Contract

Runtime identities are stored only in memory maps for the duration of a run.

Representative structure:

```javascript
const state = {
  runtimeMeta: new Map(),
  ordinalToRuntime: new Map(),
  turnToRuntime: new Map(),
  snapshots: []
};
```

Persistent snapshot summaries store **counts and contradiction flags**, not the raw keys.

Example safe summary fields:

```javascript
const safeSummary = {
  snapshot: label,
  mountedMessageCount: sections.length,
  mountedOrdinals: ordinals,
  newRuntimeIdentityCount,
  runLocalUnionRuntimeIdentityCount:
    state.runtimeMeta.size,
  identityConflictCount,
  domOrderOrdinalConsistent,
  scrollTop: Math.round(scroller.scrollTop),
  scrollHeight: scroller.scrollHeight,
  clientHeight: scroller.clientHeight,
  atTopCandidate,
  atBottomCandidate
};
```

No raw Map key is serialized.

## 7. Safe Visibility Diagnostic Used

The following command was used to compare hidden and visible mounted-state behavior while emitting only safe metadata:

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

  console.log(JSON.stringify(result, null, 2));
  return result;
})();
```

The second observation changed only:

```javascript
phase: "AFTER_VISIBLE_NO_SCROLL"
```

The output contained no raw Message ID, turn ID, body, URL, CID, or HTML.

## 8. Safe Ordinal Range Compression

For long result summaries, the following helper reduces large ordinal lists to safe range notation without losing gap information:

```javascript
function compressRanges(values) {
  if (!values.length) {
    return "";
  }

  const sorted =
    [...new Set(values)]
      .sort((a, b) => a - b);

  const ranges = [];

  let start = sorted[0];
  let previous = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];

    if (current === previous + 1) {
      previous = current;
      continue;
    }

    ranges.push(
      start === previous
        ? `${start}`
        : `${start}-${previous}`
    );

    start = current;
    previous = current;
  }

  ranges.push(
    start === previous
      ? `${start}`
      : `${start}-${previous}`
  );

  return ranges.join(",");
}
```

Example:

```text
1-75,77-100
```

preserves the fact that ordinal 76 is missing without persisting any Message content.

## 9. Safe Internal-gap Derivation

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

This output is safe because it describes ordinal continuity only.

## 10. Identity Conflict Evidence

Raw conflicting IDs are not needed in persistent Evidence.

Instead record counters / booleans such as:

```text
runtimeMetaConflict
ordinalRuntimeConflict
turnRuntimeConflict
identityConflictCount
```

A nonzero contradiction count is sufficient to trigger Fail Closed while preserving the raw values only in ephemeral runtime memory.

## 11. Capture Acceptance Evidence

A safe capture record must expose whether the mounted relation was usable without serializing the raw identity values.

Representative acceptance relation:

```javascript
const acquisitionErrorCount =
  messageIdError +
  turnIdError +
  roleError +
  ordinalError +
  ordinalDuplicate +
  runtimeDuplicate;

const captureAccepted =
  sections.length > 0 &&
  domOrderConsistent &&
  acquisitionErrorCount === 0 &&
  identityConflictCount === 0;
```

Persistent Evidence records the error counts and `captureAccepted` boolean.

## 12. Candidate-only vs Ground Truth Fields

Every candidate summary must make Ground Truth separation inspectable.

Recommended safe fields:

```text
groundTruthUsed: false
groundTruthCountUsedAsStopCondition: false
unionCountUsedAsStopCondition: false
```

For recovery runs also record:

```text
observedGapUsedAsExactNavigationTarget: false
```

This ensures the result can be reviewed for self-approval leakage.

## 13. Long-100 Round 3B Safety Fields

The controlled report used:

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

These fields complement runtime logs with operator provenance that cannot always be inferred from DOM output alone.

## 14. Long-200 Baseline Safety Fields

```text
FIXTURE_ALIAS:
Long-200

RUN_LOCAL_ACCUMULATOR_CREATED:
true

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

## 15. Long-200 Reload Reproducibility Safety Fields

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

## 16. Console Log Handling

Console logs may be retained as Technical Spike Evidence only when they follow the safe-output contract.

Before treating a log as Evidence, review for accidental inclusion of:

- raw runtime IDs;
- Message bodies;
- Title / URL / CID;
- DOM / HTML;
- credentials; and
- browser exception content containing restricted values.

Round-specific logs used in TASK-003 were designed to emit summarized fields rather than raw identity material.

## 17. Ground Truth Evidence Boundary

The pre-established oracle may persist safe expected values:

- 100 / 200 occurrence totals;
- safe first / last aliases;
- role ledger rules;
- accepted cycle counts; and
- fixture acceptance booleans.

However, those values must not appear inside traversal control logic.

Allowed:

```text
candidate classification freeze
then compare observed result with expected count
```

Forbidden:

```text
if union == 200 then stop
```

## 18. Observation-state Classification Evidence

Persistent classification strings are safe and encouraged:

```text
INCOMPLETE
UNKNOWN
AMBIGUOUS
INCONSISTENT
CONTINUITY_CANDIDATE
RECOVERY_CONTINUITY_CANDIDATE
BLOCKED
```

The label must be accompanied by the safe supporting fields needed to review how the classification was reached.

## 19. Fail Closed Evidence Principle

When a contradiction occurs, persistent Evidence should record the smallest safe information sufficient to prove why the run did not qualify.

For example:

```text
blocked: true
blockedReason: PAGE_HIDDEN_DURING_SETTLE
```

is preferable to dumping raw DOM / browser state.

## 20. Final Contract

```text
PERSIST_SAFE_METADATA:
YES

PERSIST_RAW_MESSAGE_CONTENT:
NO

PERSIST_RAW_RUNTIME_IDENTITIES:
NO

PERSIST_RAW_DOM_HTML:
NO

RUNTIME_IDENTITY_IN_MEMORY_FOR_DEDUP:
YES

OPERATOR_SAFETY_FIELDS_REQUIRED:
YES

GROUND_TRUTH_ALLOWED_AFTER_CANDIDATE_FREEZE:
YES

GROUND_TRUTH_ALLOWED_AS_RUNTIME_STOP_SIGNAL:
NO

FAIL_CLOSED_ON_MISSING_OR_CONTRADICTORY_EVIDENCE:
YES
```
