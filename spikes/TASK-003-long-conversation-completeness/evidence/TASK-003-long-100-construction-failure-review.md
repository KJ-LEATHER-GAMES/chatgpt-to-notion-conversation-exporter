# TASK-003 Long-100 Construction Failure Review

## Status

- Scope: composer target cardinality / binding review only
- Review mode: static historical review plus read-only composer observation
- Historical construction result: `ABORTED`
- Historical successful cycles: 0
- Historical User submissions: 0
- Historical Assistant completions: 0
- Message acquisition / scrolling / completeness observation: **NOT PERFORMED**
- TV-005 / TV-006 Discovery: **NOT STARTED**

```text
CONSTRUCTION_FAILURE_ROOT_CAUSE: HARNESS_SELECTION_DEFECT
CONSTRUCTION_HARNESS_REVIEW: DEVIATION_CONFIRMED
CONSTRUCTION_COMPOSER_DECISION_READY: YES
SAME_PREPARED_TAB_REUSE: ELIGIBLE
```

## Review Basis

The review used the repository-current Requirements, ADR, Risk Register,
Acceptance Tests, Technical Validation Plan, Development Backlog, TASK-001 and
TASK-002 handoff Evidence, and the chronological TASK-003 planning,
qualification, and construction Evidence.

The current Source-of-Truth scope remains:

- TASK-003 refs: TV-005 and TV-006
- TASK-003 risk: RISK-002
- TASK-003 exit: completeness judgment at the 200-Message class

This review concerns only the fixture-construction UI harness. It is not
TV-005 loading observation, TV-006 Completeness Signal observation, or Message
acquisition Discovery.

## Historical Abort Integrity

The historical construction Evidence remains authoritative and unchanged:

- abort code: `CONSTRUCTION_UI_CARDINALITY_INVALID_BEFORE_SUBMISSION`
- Cycle 1 stopped before fill/send
- successful cycles: 0
- User submissions: 0
- Assistant completions: 0
- retry / regenerate / edit / branch: not performed
- Message enumeration, mounted count, scrolling, and scan union: not performed

The frozen Long-100 ledger is unchanged. The construction failure did not
establish a live fixture or Ground Truth.

## Prepared Tab Binding

| Safe binding material | Result |
|---|---:|
| Runtime prepared-tab handle present | true |
| Matching tab identifier count in the active Chrome session | 1 |
| Composer-only observation reachable | true |
| Binding classification | `PREPARED_TAB_BINDING_UNIQUE` |

No tab inventory, identifying title, location, or Conversation identifier was
emitted. The construction record, rather than Message DOM inspection, remains
the basis for the zero-submission state.

## Previous Harness Selection Logic — Static Review

The prior ephemeral construction operation used this family-level sequence:

1. enumerate the global textarea-like family;
2. apply its visible filter;
3. require exactly one result before fill/send;
4. abort if the result is not exactly one.

The operation did not enumerate the contenteditable / role-textbox family as
an alternative editable representation. It also did not first establish a
unique containing composer form or collapse overlapping family labels by
element identity. It therefore could not observe the actual visible editor in
the prepared state.

The Fail Closed abort itself conformed to the construction safety contract.
The acquisition relation used before that abort did not conform to the
available composer structure.

## Composer Candidate Inventory — Live Read-Only Observation

The document state was `COMPLETE`. Only composer-related controls and their
local containment relations were inventoried.

| Source family | Global raw | Structurally contained in the unique form | Visible | Enabled | Editable | Visible + enabled + editable |
|---|---:|---:|---:|---:|---:|---:|
| Textarea-like representation | 1 | 1 | 0 | 1 | 1 | 0 |
| Contenteditable representation | 1 | 1 | 1 | 1 | 1 | 1 |
| Role-textbox representation | 1 | 1 | 1 | 1 | 1 | 1 |
| Text-input representation | 0 | 0 | 0 | 0 | 0 | 0 |
| Element-identity-collapsed editable union | 2 | 2 | 1 | 2 | 2 | 1 |

The contenteditable and role-textbox labels refer to the same element. The
textarea-like and contenteditable elements are different representations with
a common parent and the same containing form. Neither contains the other.

| Structural material | Count / result |
|---|---:|
| Unique containing form established | true |
| Candidate representations inside that form | 2 |
| Visible enabled editable representations inside that form | 1 |
| Candidate-bearing direct child branches | 1 |
| Native form-associated elements | 6 |
| Textarea-like representation is native form-associated | true |
| Contenteditable representation is native form-associated | false |
| Nested editable pairs | 0 |
| Editable candidates with an editable ancestor | 0 |
| Editable candidates with an editable descendant | 0 |

The prepared empty state had four visible enabled generic buttons in the
containing form and zero send/submit-classified action surfaces. Generic
buttons are therefore not a unique send relation, and an exactly-one
send/action condition cannot be imposed at this pre-fill observation point.

## Cardinality Waterfall

### Historical harness family

| Stage | Count |
|---|---:|
| Global textarea-like candidates | 1 |
| Visible textarea-like candidates | 0 |
| Historical final composer targets | 0 |

### Composer candidate union

| Stage | Count |
|---|---:|
| Distinct editable elements across relevant families | 2 |
| Inside the unique containing form | 2 |
| Visible | 1 |
| Editable | 1 |
| Enabled | 1 |
| Visible + editable + enabled final candidate | 1 |

The waterfall establishes that the prior cardinality failure was not caused by
multiple visible editors. It was caused by restricting acquisition to a family
whose only representation was hidden while omitting the separately represented
visible editor.

## Visibility, Editability, and Containment Findings

Confirmed observations:

- exactly one visible enabled editable element existed in the unique containing
  form;
- the hidden textarea-like representation and visible contenteditable
  representation shared a local branch and form;
- the contenteditable and role-textbox families overlapped on one element and
  must not be double-counted;
- no nested editable representation caused the historical result;
- a send-like action was unavailable before fill, while multiple generic action
  controls were present;
- Message region material was not queried.

## Root Cause Classification

```text
CONSTRUCTION_FAILURE_ROOT_CAUSE: HARNESS_SELECTION_DEFECT
```

More specifically, the harness used a visible textarea-like candidate as the
only composer acquisition family. The prepared UI exposed that representation
as hidden and exposed a separate visible contenteditable / role-textbox editor.
The harness therefore converted a uniquely available visible editor into a
zero-candidate result.

Rejected cause classifications:

- `MULTIPLE_VISIBLE_EDITABLE_CANDIDATES`: rejected; visible union count was 1.
- `HIDDEN_DUPLICATE_INCLUDED`: rejected as the final cause; the hidden
  representation was removed by the visible filter rather than counted.
- `NESTED_REPRESENTATION_DOUBLE_COUNTED`: rejected; nested pair count was 0.
- `NO_EDITABLE_CANDIDATE`: rejected; one visible enabled editable existed.
- `TAB_BINDING_AMBIGUOUS`: rejected; prepared-tab match count was 1.

## Harness Conformance Finding

```text
CONSTRUCTION_HARNESS_REVIEW: DEVIATION_CONFIRMED
```

The safety response was correct: the harness failed closed before mutation.
The selection relation deviated because it:

- omitted a live editable family;
- used a global family before establishing the local composer form;
- had no element-identity collapse across contenteditable and role-textbox
  labels;
- could not distinguish hidden form-associated representation from the visible
  editor;
- had no supported pre-fill unique send/action relation.

No existing harness or construction Evidence was modified in this review.

## Candidate Relation Options for Review

### Option A — Preserve textarea-like-only acquisition

- Result in observed prepared state: 0 visible candidates
- Assessment: reject as the next-attempt input relation

### Option B — Broad global editable union only

- Raw distinct elements: 2
- Visible enabled editable elements: 1
- Assessment: useful diagnostic, but global scope alone is weaker than the
  observed local form relation

### Option C — Local form plus collapsed visible editor relation

Candidate relation to evaluate in the next Decision Round:

1. establish exactly one containing composer form from candidate-only
   structure;
2. enumerate textarea-like, contenteditable, text-input, and role-textbox
   representations inside that form;
3. collapse overlapping family labels by element identity before cardinality;
4. require exactly one visible, editable, enabled element;
5. retain hidden representations as diagnostics only;
6. do not require an exactly-one send-like action before fill because the
   observed empty state exposes none;
7. re-resolve action material only under a separately reviewed construction
   operation; do not infer an action from the four generic buttons.

Option C is supported as a Candidate Decision input, not adopted here.

```text
CONSTRUCTION_COMPOSER_DECISION_READY: YES
```

No further read-only composer inventory is required to explain the historical
failure. The action phase remains a Decision/next-attempt concern and was not
silently specified by this review.

## Same Prepared Tab Reuse Evaluation

```text
SAME_PREPARED_TAB_REUSE: ELIGIBLE
```

Basis:

- prepared-tab binding remained unique;
- historical external submissions remain 0 by construction record;
- this review performed no fill, input, click, send, retry, regenerate, edit,
  branch, navigation, or Conversation creation;
- the composer cardinality failure is attributable to harness selection rather
  than fixture mutation;
- the frozen ledger remains unchanged.

Eligibility does not authorize or start construction. A reviewed composer
Candidate Decision and separate authorization remain required.

## Privacy Boundary

`PRIVACY_SAFE_FAILURE_REVIEW: PASS`

Only aliases, counts, booleans, containment relations, and fixed safe codes
left the browser harness. No identifying metadata, Message content, synthetic
prompt, raw label/placeholder, Conversation location/identifier, runtime
Message identity, DOM/HTML, browser exception text, or authentication data was
emitted or persisted.

## Requirement / ADR / Risk Impact

- FR-008 / NFR-001 / NFR-002 / ADR-006: the ambiguous pre-submission target
  continued to fail closed; no guessed repair or mutation was performed.
- TV-005 / TV-006: unchanged and not evaluated.
- RISK-002: unchanged; no long-conversation loading or completeness mitigation
  was observed.
- Requirements, ADRs, Acceptance Tests, Risk Register, Backlog, and AGENTS.md:
  no semantic change.
- Production implementation: none.

## Repository / Security Check

- Historical construction Evidence SHA-256 before review:
  `39E9D734ECFBCFBDBBF30797F502399E550F000E444EB905559747D3D7C751EB`.
- Historical construction Evidence unchanged after review: **PASS**.
- Frozen ledger unchanged: **PASS**.
- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan: **PASS**.
- Direct restricted-content scan: **PASS**.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001/TASK-002 assets,
  and historical TASK-003 Evidence unchanged: **PASS**.
- Changed task scope: this new Failure Review Evidence only.
- A pre-existing unrelated untracked archive was not modified.

## Final Status

```text
LONG_100_CONSTRUCTION: ABORTED
LONG_100_USER_SUBMISSIONS: 0
LONG_100_ASSISTANT_COMPLETIONS: 0
LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED

CONSTRUCTION_FAILURE_ROOT_CAUSE: HARNESS_SELECTION_DEFECT
CONSTRUCTION_HARNESS_REVIEW: DEVIATION_CONFIRMED
CONSTRUCTION_COMPOSER_DECISION_READY: YES
SAME_PREPARED_TAB_REUSE: ELIGIBLE

TASK-003 DISCOVERY: NOT_STARTED
TV-005 VERDICT: NOT_SET
TV-006 VERDICT: NOT_SET
```

## Recommended Next Action

`TASK-003 Long-100 Construction Composer Candidate Decision`

Do not restart construction in this review Round.
