# TASK-003 Long-100 Initial and Fixed-step Discovery

## 1. Document Status

- Integrated document date: 2026-08-19
- Task: TASK-003 Long Conversation / Completeness Spike
- Related validations: TV-005, TV-006
- Fixture: Long-100
- Covered rounds: Round 1, Round 2
- Document role: integrated runtime Evidence for the initial inventory and the first staged traversal
- Historical Evidence replacement: **NO**
- Ground Truth use during runtime classification: **NO**
- Production implementation: **OUT OF SCOPE**

This document preserves the Long-100 observations that established two important facts before the visibility characterization:

1. the initial DOM only mounted a suffix of the Conversation; and
2. a staged traversal could reach the opposite boundary while still leaving an internal ordinal gap.

The latter became the primary false-complete counterexample for TV-006.

---

## 2. Evidence Sources

This integration is based on:

- `TASK-003-scope-plan.md`
- `TASK-003-tv005-tv006-manual-discovery-protocol.md`
- `TASK-003-tv005-tv006-observation-and-evidence-contract.md`
- retained Round 2 accumulator state reused by later Round 3 commands
- the recorded Round 2 snapshot values preserved in the TASK-003 review conversation
- later Round 3 preflight output proving the Round 2 terminal union state:
  - `existingSnapshotCount = 14`
  - `existingUnionRuntimeIdentityCount = 99`
  - observed ordinal gap after 75 / before 77

The full verbatim Round 2 Console transcript was not retained as a standalone log artifact. Therefore this document distinguishes:

- **recorded runtime output**: treated as direct Evidence;
- **Round 2 command logic**: reconstructed from the retained accumulator contract and later commands that reused the same state.

No runtime identity values are persisted here.

---

## 3. Preconditions

Long-100 Ground Truth had already been established independently before Discovery.

Frozen oracle properties relevant only for later comparison:

```text
FIXTURE_ALIAS:
Long-100

SOURCE_TYPE:
Standard

EXPECTED_MESSAGE_COUNT:
100

EXPECTED_DISTINCT_OCCURRENCE_COUNT:
100

FIRST_ALIAS:
L100-M001

LAST_ALIAS:
L100-M100
```

These values were prohibited from:

- deciding whether traversal should continue;
- choosing a scroll target;
- repairing missing runtime observations;
- classifying the runtime candidate as Complete.

The required order remained:

```text
runtime observation
-> runtime union
-> candidate-only classification
-> freeze
-> Ground Truth comparison
```

---

# 4. Round 1 — Initial Inventory

## 4.1 Objective

Round 1 observed the current Long-100 runtime state without broad traversal.

Questions:

- How many Message units are mounted initially?
- Which ordinals are mounted?
- Is Message identity material available?
- Is one scroll container observable?
- Does the current geometry indicate Top or Bottom?
- Are obvious loading indicators present?

---

## 4.2 Mounted Message Inventory — Recorded Result

The Message unit relation was:

```text
section[data-testid^="conversation-turn-"]
```

Recorded output:

```text
pageLoadState:
complete

mountedMessageCount:
18

mountedOrdinalMin:
83

mountedOrdinalMax:
100

mountedRoleUserCount:
9

mountedRoleAssistantCount:
9

dataMessageIdPresent:
true

dataTurnIdPresent:
true

turnOrdinalAvailable:
true

domOrderOrdinalConsistent:
true

invalid cardinality / identity counts:
0

mountedOrdinals:
83-100
```

### Observation

The complete document load state did **not** mean the entire Conversation was mounted.

The initial DOM exposed only:

```text
83-100
```

This was direct virtualization / lazy-mount Evidence.

---

## 4.3 Round 1 Inventory Code

The following is the retained command pattern used for Message-unit inventory.

```javascript
(() => {
  const sections = [
    ...document.querySelectorAll(
      'section[data-testid^="conversation-turn-"]'
    )
  ];

  const ordinals = [];
  let userCount = 0;
  let assistantCount = 0;

  let dataMessageIdPresent = true;
  let dataTurnIdPresent = true;
  let rolePresent = true;

  for (const section of sections) {
    const testId =
      section.getAttribute("data-testid");

    const match =
      testId?.match(
        /^conversation-turn-(\d+)$/
      );

    const ordinal =
      match ? Number(match[1]) : null;

    if (Number.isSafeInteger(ordinal)) {
      ordinals.push(ordinal);
    }

    const messageNodes = [
      ...(section.matches("[data-message-id]")
        ? [section]
        : []),
      ...section.querySelectorAll(
        "[data-message-id]"
      )
    ];

    const turnNodes = [
      ...(section.matches("[data-turn-id]")
        ? [section]
        : []),
      ...section.querySelectorAll(
        "[data-turn-id]"
      )
    ];

    const roleNodes = [
      ...(section.matches(
        "[data-message-author-role]"
      )
        ? [section]
        : []),
      ...section.querySelectorAll(
        "[data-message-author-role]"
      )
    ];

    dataMessageIdPresent &&=
      messageNodes.length === 1;

    dataTurnIdPresent &&=
      turnNodes.length === 1;

    rolePresent &&=
      roleNodes.length === 1;

    const role =
      roleNodes.length === 1
        ? roleNodes[0].getAttribute(
            "data-message-author-role"
          )
        : null;

    if (role === "user") userCount++;
    if (role === "assistant") assistantCount++;
  }

  const domOrderOrdinalConsistent =
    ordinals.every(
      (value, index) =>
        index === 0 ||
        value > ordinals[index - 1]
    );

  const result = {
    pageLoadState:
      document.readyState,

    mountedMessageCount:
      sections.length,

    mountedOrdinalMin:
      ordinals.length
        ? Math.min(...ordinals)
        : null,

    mountedOrdinalMax:
      ordinals.length
        ? Math.max(...ordinals)
        : null,

    mountedRoleUserCount:
      userCount,

    mountedRoleAssistantCount:
      assistantCount,

    dataMessageIdPresent,
    dataTurnIdPresent,
    rolePresent,

    turnOrdinalAvailable:
      ordinals.length ===
      sections.length,

    domOrderOrdinalConsistent,

    mountedOrdinals:
      ordinals
  };

  console.log(
    JSON.stringify(result, null, 2)
  );

  return result;
})();
```

The integrated document does not preserve raw runtime IDs.

---

# 5. Round 1 — Scroll Geometry

Recorded result:

```text
scrollContainerEstablished:
true

scrollableAncestorCount:
1

scrollTop:
7375

scrollHeight:
8286

clientHeight:
911

atTopCandidate:
false

atBottomCandidate:
true
```

The relation was therefore:

```text
initial runtime state
= Bottom geometry candidate
```

while the mounted ordinal set was only:

```text
83-100
```

---

## 5.1 Scroll Geometry Code

```javascript
(() => {
  const firstTurn =
    document.querySelector(
      'section[data-testid^="conversation-turn-"]'
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

  const scroller =
    candidates.length === 1
      ? candidates[0]
      : null;

  const result = {
    scrollContainerEstablished:
      Boolean(scroller),

    scrollableAncestorCount:
      candidates.length,

    scrollTop:
      scroller
        ? Math.round(scroller.scrollTop)
        : null,

    scrollHeight:
      scroller?.scrollHeight ?? null,

    clientHeight:
      scroller?.clientHeight ?? null,

    atTopCandidate:
      scroller
        ? Math.abs(
            scroller.scrollTop
          ) <= 1
        : null,

    atBottomCandidate:
      scroller
        ? Math.abs(
            scroller.scrollHeight -
            scroller.clientHeight -
            scroller.scrollTop
          ) <= 2
        : null
  };

  console.log(
    JSON.stringify(result, null, 2)
  );

  return result;
})();
```

---

# 6. Round 1 — Loading-semantic Inventory

The obvious loading/progress semantic checks returned zero candidates.

Recorded interpretation:

```text
obvious loading semantics:
ABSENT

actual virtualization/loading mechanism:
UNKNOWN
```

Absence of a loading spinner or progress element was **not** treated as proof that loading was complete.

---

# 7. Round 1 Candidate-only Classification

Ground Truth count was not consulted.

The runtime itself showed:

```text
atTopCandidate:
false
```

Therefore the current observation did not cover the upper Conversation boundary.

Candidate-only classification:

```text
LONG_100_ROUND_1:
PASS as observation round

INITIAL_STATE_CLASSIFICATION:
INCOMPLETE
```

Reason:

```text
Bottom observed
+
Top not observed
+
only mounted suffix visible
```

The reason was **not** “18 != 100”.

---

# 8. Round 2 — Fixed-step Traversal

## 8.1 Objective

Round 2 tested whether explicit staged traversal could:

- cause earlier Messages to mount;
- accumulate distinct runtime Message identities;
- preserve identity / ordinal / turn consistency;
- reach the Top boundary;
- support a candidate-only completeness decision.

The traversal direction was:

```text
Bottom -> Top
```

The historical coarse step was:

```text
80% of viewport height
```

This 80% value was exploratory, not a final baseline.

---

# 9. Round 2 Run-local Accumulator

The retained state relation later reused by Round 3 was:

```javascript
const state = {
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
    false
};
```

Required invariants:

```text
same runtime ID
-> same ordinal
-> same role
-> same turn ID

same ordinal
-> same runtime ID

same turn ID
-> same runtime ID
```

The runtime identity union existed in memory only.

---

## 9.1 Core Capture Relation

The Round 2 capture logic validated each mounted section before adding it to the union.

```javascript
function capture(label, action) {
  const sections = [
    ...document.querySelectorAll(
      'section[data-testid^="conversation-turn-"]'
    )
  ];

  const localRuntimeIds =
    new Set();

  const localOrdinals =
    new Set();

  const local = [];

  for (const section of sections) {
    const testId =
      section.getAttribute(
        "data-testid"
      );

    const match =
      testId?.match(
        /^conversation-turn-(\d+)$/
      );

    const ordinal =
      match ? Number(match[1]) : null;

    const messageNodes = [
      ...(section.matches("[data-message-id]")
        ? [section]
        : []),
      ...section.querySelectorAll(
        "[data-message-id]"
      )
    ];

    const turnNodes = [
      ...(section.matches("[data-turn-id]")
        ? [section]
        : []),
      ...section.querySelectorAll(
        "[data-turn-id]"
      )
    ];

    const roleNodes = [
      ...(section.matches(
        "[data-message-author-role]"
      )
        ? [section]
        : []),
      ...section.querySelectorAll(
        "[data-message-author-role]"
      )
    ];

    if (
      messageNodes.length !== 1 ||
      turnNodes.length !== 1 ||
      roleNodes.length !== 1 ||
      !Number.isSafeInteger(ordinal)
    ) {
      state.failed = true;

      throw new Error(
        "Capture cardinality / ordinal validation failed."
      );
    }

    const runtimeId =
      messageNodes[0].getAttribute(
        "data-message-id"
      );

    const turnId =
      turnNodes[0].getAttribute(
        "data-turn-id"
      );

    const role =
      roleNodes[0].getAttribute(
        "data-message-author-role"
      );

    if (
      localRuntimeIds.has(runtimeId) ||
      localOrdinals.has(ordinal)
    ) {
      state.failed = true;

      throw new Error(
        "Duplicate runtime identity or ordinal in mounted snapshot."
      );
    }

    localRuntimeIds.add(runtimeId);
    localOrdinals.add(ordinal);

    local.push({
      runtimeId,
      turnId,
      ordinal,
      role
    });
  }

  for (const item of local) {
    const previous =
      state.runtimeMeta.get(
        item.runtimeId
      );

    if (
      previous &&
      (
        previous.ordinal !== item.ordinal ||
        previous.turnId !== item.turnId ||
        previous.role !== item.role
      )
    ) {
      state.failed = true;

      throw new Error(
        "Runtime identity relation changed."
      );
    }

    const ordinalRuntime =
      state.ordinalToRuntime.get(
        item.ordinal
      );

    if (
      ordinalRuntime &&
      ordinalRuntime !== item.runtimeId
    ) {
      state.failed = true;

      throw new Error(
        "Ordinal/runtime contradiction."
      );
    }

    const turnRuntime =
      state.turnToRuntime.get(
        item.turnId
      );

    if (
      turnRuntime &&
      turnRuntime !== item.runtimeId
    ) {
      state.failed = true;

      throw new Error(
        "Turn/runtime contradiction."
      );
    }
  }

  let newRuntimeIdentityCount = 0;

  for (const item of local) {
    if (
      !state.runtimeMeta.has(
        item.runtimeId
      )
    ) {
      newRuntimeIdentityCount++;
    }

    state.runtimeMeta.set(
      item.runtimeId,
      {
        ordinal:
          item.ordinal,

        turnId:
          item.turnId,

        role:
          item.role
      }
    );

    state.ordinalToRuntime.set(
      item.ordinal,
      item.runtimeId
    );

    state.turnToRuntime.set(
      item.turnId,
      item.runtimeId
    );
  }

  const mountedOrdinals =
    local
      .map(x => x.ordinal)
      .sort((a, b) => a - b);

  const result = {
    snapshot:
      label,

    action,

    captureAccepted:
      !state.failed,

    newRuntimeIdentityCount,

    unionRuntimeIdentityCount:
      state.runtimeMeta.size,

    mountedOrdinals
  };

  state.snapshots.push(result);

  return result;
}
```

### Provenance note

The exact original Round 2 Console body was not separately retained. The code above is the integrated reconstruction of the capture contract proven by the retained state and later Round 3 reuse. Recorded snapshot values below are direct runtime Evidence.

---

# 10. Round 2 Traversal Pattern

The staged traversal used approximately:

```javascript
const requestedStepPx =
  Math.max(
    1,
    Math.round(
      scroller.clientHeight * 0.80
    )
  );

const targetScrollTop =
  Math.max(
    0,
    Math.round(
      scroller.scrollTop
    ) - requestedStepPx
  );

scroller.scrollTo({
  top:
    targetScrollTop,

  behavior:
    "auto"
});
```

Each step then waited for a provisional DOM settle and invoked `capture(...)`.

Ground Truth count and the eventual missing ordinal were not used to position the traversal.

---

# 11. Round 2 Recorded Snapshot Sequence

| Snapshot | Mounted ordinal material | New runtime IDs | Runtime union | Key geometry |
|---|---|---:|---:|---|
| S00 | 83-100 | 18 | 18 | `scrollTop=7375`, Bottom |
| S01 | 83-100 | 0 | 18 | `scrollTop=6646` |
| S02 | 77-100 | 6 | 24 | `scrollTop=5979` |
| S03 | 77-100 | 0 | 24 | intermediate |
| S04 | 77-100 | 0 | 24 | intermediate |
| S05 | 47-75, 96-100 | 29 | 53 | `scrollTop=3792`, `scrollHeight=9274` |
| S06 | 33-61, 96-100 | 14 | 67 | `scrollTop=3559`, `scrollHeight=9770` |
| S07 | 26-54, 96-100 | 7 | 74 | — |
| S08 | 19-47, 96-100 | 7 | 81 | — |
| S09 | 12-40, 96-100 | 7 | 88 | — |
| S10 | 5-33, 96-100 | 7 | 95 | — |
| S11 | 1-26, 96-100 | 4 | 99 | `scrollTop=860` |
| S12 | 1-26, 96-100 | 0 | 99 | `scrollTop=131` |
| S13 | 1-19, 96-100 | 0 | 99 | `scrollTop=0`, Top |

All accepted snapshots reported:

```text
captureAccepted:
true

failClosed:
false

identity/cardinality/order conflict counts:
0
```

A further post-Top traversal command was safely rejected because the Top geometry candidate had already been reached.

---

# 12. Important Virtualization Observation

Mounted sets were not necessarily contiguous.

For example:

```text
S11:
1-26,96-100
```

Therefore:

```text
mountedOrdinalMin = 1
mountedOrdinalMax = 100
```

did **not** imply that ordinals 1 through 100 were mounted.

This invalidated min/max-only completeness reasoning.

---

# 13. Candidate-only Ordinal Union Evaluation

After S13, the sorted distinct observed ordinal union was:

```text
1-75,77-100
```

The internal gap was:

```text
afterOrdinal:
75

beforeOrdinal:
77

missingOrdinalCount:
1
```

The retained Round 3 preflight later independently confirmed the same Round 2 terminal state:

```text
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

gap:
75 -> 77
```

---

## 13.1 Gap Detection Code

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

No Ground Truth total is read by this code.

---

# 14. Round 2 Candidate-only Classification

The candidate-only state was frozen as:

```text
LONG_100_ROUND_2_EXECUTION:
PASS

FIXED_80_PERCENT_TRAVERSAL:
INCOMPLETE

OBSERVED_ORDINAL_UNION:
1-75,77-100

OBSERVED_INTERNAL_GAP:
YES

CANDIDATE_ONLY_CLASSIFICATION:
INCOMPLETE
```

This classification was made **before** Ground Truth comparison.

---

# 15. Ground Truth Comparison — Only After Freeze

After candidate-only `INCOMPLETE` was frozen, the independent Long-100 oracle was compared.

Runtime:

```text
distinct runtime union:
99
```

Frozen oracle:

```text
expected distinct occurrences:
100
```

Comparison:

```text
MISMATCH
```

The Ground Truth confirmed the candidate-only incomplete decision. It did not create it.

---

# 16. False-complete Counterexample Established

Round 2 produced the key TV-006 counterexample:

```text
initial Bottom candidate observed
+
Top candidate eventually reached
+
first ordinal observed
+
last ordinal observed
+
identity relation consistent
+
final newRuntimeIdentityCount = 0
+
internal ordinal gap remains

=> INCOMPLETE
```

Therefore the following candidate rules were rejected:

```text
Top reached -> Complete
Bottom + Top observed -> Complete
min ordinal + max ordinal look complete -> Complete
no new runtime ID -> Complete
identity consistency alone -> Complete
```

---

# 17. Settle Limitation Identified Later

The original traversal settle logic was later found too coarse.

It relied on a signature equivalent to:

```text
scrollTop
scrollHeight
clientHeight
mounted count
min ordinal
max ordinal
```

Subsequent evidence showed layout / virtualization could continue changing after a snapshot had been declared settled.

Examples recorded during Round 2 included:

- a later snapshot beginning at a different `scrollTop` than the prior snapshot's reported post-scroll value; and
- `scrollHeight` changing after an earlier `domSettled:true`.

This limitation did not invalidate the recorded Round 2 observation. It became an explicit reason to improve the settle relation before the formal baseline.

---

# 18. Safety Record

Round 1 / Round 2 operated under:

```text
FIXTURE:
Long-100

Ground Truth count used as stop:
NO

Ground Truth boundary used for traversal:
NO

Observed missing ordinal targeted for repair:
NO

Raw runtime IDs persisted:
NO

Raw Message bodies persisted:
NO

Raw DOM HTML persisted:
NO
```

---

# 19. Round 2 Decision

The correct decision after Round 2 was **not** to authorize Long-200.

```text
LONG_100_FIXED_STEP_METHOD:
NOT YET QUALIFIED

LONG_200_DISCOVERY:
NOT AUTHORIZED
```

Required next work:

1. determine why coarse traversal could leave a runtime gap;
2. characterize the observed lack of mounted-range progress;
3. improve settle detection;
4. demonstrate generic recovery without targeting ordinal 76.

That work is documented in:

`TASK-003-long-100-visibility-and-recovery-characterization.md`
