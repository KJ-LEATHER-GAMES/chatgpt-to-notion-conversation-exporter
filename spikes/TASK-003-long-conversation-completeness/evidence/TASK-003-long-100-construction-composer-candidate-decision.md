# TASK-003 Long-100 Construction Composer Candidate Decision

## Status

- Decision date: 2026-08-16
- Scope: Phase 0 Long-100 fixture-construction composer/editor relation only
- Additional browser observation: **NO**
- Construction mutation or restart: **NO**
- TV-005 / TV-006 Discovery: **NOT STARTED**
- Production implementation: **none**

```text
CONSTRUCTION_COMPOSER_CANDIDATE_DECISION: COMPLETE
PRE_FILL_EDITOR_RELATION: ADOPTED
POST_FILL_SEND_RELATION: DEFERRED
CONFIRMED_FALLBACK: NONE
```

## Decision Basis

The Decision uses only repository-current Source-of-Truth documents and the
existing chronological TASK-001, TASK-002, and TASK-003 Evidence. No new live
observation was performed.

The relevant formal scope remains unchanged:

- TASK-003 refs: TV-005 and TV-006;
- TASK-003 risk: RISK-002;
- TASK-003 exit: completeness judgment at the 200-Message class;
- Long-100 construction is fixture preparation, not TV-005 / TV-006
  Discovery; and
- ambiguous construction tooling must fail closed under FR-008, NFR-001,
  NFR-002, and ADR-006.

## Historical Failure Integrity

The historical attempt remains immutable:

```text
LONG_100_CONSTRUCTION: ABORTED
LONG_100_USER_SUBMISSIONS: 0
LONG_100_ASSISTANT_COMPLETIONS: 0
LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED
```

The Failure Review remains authoritative:

```text
CONSTRUCTION_FAILURE_ROOT_CAUSE: HARNESS_SELECTION_DEFECT
CONSTRUCTION_HARNESS_REVIEW: DEVIATION_CONFIRMED
CONSTRUCTION_COMPOSER_DECISION_READY: YES
SAME_PREPARED_TAB_REUSE: ELIGIBLE
```

This Decision does not reinterpret the historical attempt as successful and
does not modify its frozen Long-100 ledger.

## Observed-Fact Input

| Evidence-safe observed material | Count / relation |
|---|---:|
| Textarea-like raw occurrences | 1 |
| Visible textarea-like occurrences | 0 |
| Contenteditable occurrences | 1 |
| Role-textbox occurrences | 1 |
| Contenteditable / role-textbox same element | true |
| Element-identity-collapsed editable elements | 2 |
| Candidate-bearing forms | 1 |
| All editable elements share the same form | true |
| Visible + editable + enabled elements | 1 |
| Nested editable pairs | 0 |
| Pre-fill send-like actions | 0 |
| Visible enabled generic buttons | 4 |

These observations support the pre-fill editor relation. They do not support a
specific post-fill send/action relation.

## Source Grouping Decision

| Candidate source family | Decision | Construction role | Boundary |
|---|---|---|---|
| Textarea-like | INCLUDE IN INVENTORY | editable representation / diagnostic | hidden occurrence is not a final editor and not fallback |
| Contenteditable | INCLUDE IN INVENTORY | editable representation | participates in element-identity collapse and final filtering |
| Role-textbox | INCLUDE IN INVENTORY | semantic editable representation | a second family label does not create a second occurrence when element identity is equal |
| Text-input-like | INCLUDE IN INVENTORY / UNOBSERVED | defensive editable-family inventory | observed count is 0; if later present, it participates in the same cardinality contract and is not preferred |
| Containing form | STRUCTURAL BINDING GROUP | candidate-only local scope | not an editor occurrence |
| Generic buttons | DIAGNOSTIC ONLY | action inventory | order and mere presence cannot select send |
| Send/action surface | SEPARATE POST-FILL GROUP | pre-send gate | exact relation is deferred because no post-fill Evidence exists |

Family labels classify candidate surfaces. They are not occurrence identity.
No family has priority, and no first-match rule is allowed.

## Element Identity Collapse Decision

`ELEMENT_IDENTITY_COLLAPSE: REQUIRED`

Evaluation must collapse the family union by actual DOM element identity before
any candidate or form cardinality is evaluated.

Required behavior:

- one element carrying contenteditable and role-textbox classifications counts
  as one candidate occurrence;
- two different elements remain two occurrences even when they share a form,
  parent, visibility, role, or value characteristics;
- no text, placeholder, accessible label, synthetic prompt, Ground Truth, or
  DOM order may act as identity;
- hidden and visible elements must not be inferred to be the same element;
- inability to compare element identity is Fail Closed.

The observed input therefore collapses three family memberships into two
distinct editable elements: one hidden textarea-like element and one visible
contenteditable / role-textbox element.

## Form Binding Decision

`UNIQUE_CANDIDATE_BEARING_FORM: REQUIRED`

The construction form is established solely from the identity-collapsed
editable candidate set:

1. obtain the nearest containing form relation for every distinct candidate;
2. reject any candidate without a containing form;
3. form the set of candidate-bearing form identities;
4. require that set cardinality to be exactly 1; and
5. require every collapsed editable candidate to be contained by that same
   form identity.

The single form satisfying this relation is the construction-scoped
candidate-bearing form. It is not selected by being the first form, by text, by
title, by Conversation location, by Ground Truth, by Message DOM, or by any
synthetic prompt value.

Observed Evidence supports this relation: both distinct editable elements were
contained by the same one form. Therefore no form-binding gap blocks this
Decision.

## Candidate Evaluation Order

The following order is adopted:

1. enumerate all relevant editable family memberships;
2. collapse memberships by DOM element identity;
3. require at least one distinct editable element;
4. obtain each element's nearest containing-form relation;
5. require exactly one candidate-bearing form shared by all elements;
6. scope evaluation to the distinct elements in that unique form;
7. classify visibility per element and require exactly one visible element;
8. require that sole visible element to be editable;
9. require that same element to be enabled; and
10. require final editor element cardinality exactly 1.

Form cardinality is evaluated before visibility. A second form cannot be hidden
from ambiguity merely because its candidate is currently non-visible.
Visibility, editability, and enabled checks are successive constraints on the
same element; they are not agreement filters used to pick one candidate from
multiple otherwise valid candidates.

## Hidden Representation Decision

`HIDDEN_EDITABLE_REPRESENTATION: DIAGNOSTIC_ONLY`

- hidden elements remain in the inventory and form-binding analysis;
- hidden elements are excluded from the final editor candidate set;
- a hidden occurrence in the same unique form does not, by itself, make the
  final editor ambiguous when exactly one other element is visible, editable,
  and enabled;
- a hidden textarea-like element must never be operated as editor fallback;
- if the visible editor is missing, a hidden representation cannot repair the
  zero-visible-candidate state; and
- if multiple distinct elements become visible, final cardinality is ambiguous
  even if one agrees with a prior observation.

## Final Editor Cardinality Contract

`PRE_FILL_EDITOR_RELATION: ADOPTED`

A pre-fill editor resolves only when all conditions hold in one evaluation:

- relevant family inventory is non-empty;
- element identity collapse succeeds;
- every distinct candidate has a containing form;
- candidate-bearing form cardinality is exactly 1;
- all candidates share that form identity;
- visible candidates inside that form: exactly 1;
- editable candidates within that one-element visible set: exactly 1;
- enabled candidates within that same surviving set: exactly 1; and
- final distinct editor element: exactly 1.

No raw text or Ground Truth comparison participates in editor resolution.

## Pre-Fill Action Decision

`PRE_FILL_SEND_ACTION_REQUIREMENT: NOT_ADOPTED`

The observed empty state had zero send-like action candidates and four generic
visible enabled buttons. Therefore:

- exactly one send action is not required for pre-fill editor acceptance;
- generic button presence, order, or first-match must not identify send;
- editor resolution and send-action resolution are separate lifecycle stages;
  and
- successful editor resolution does not authorize a click or imply successful
  send-action resolution.

## Post-Fill Action Decision

### Option A — Adopt a post-fill send relation now

**REJECTED / INSUFFICIENT EVIDENCE.** No post-fill state was observed. A
specific selector, button position, label relation, or form-action assumption
would be invented.

### Option B — Mutation-safe pre-send gate in the next attempt

**ADOPTED AS PROCEDURAL SAFETY BOUNDARY.** After a separately authorized fill,
the harness must stop before click/send and candidate-only evaluate the
post-fill action state. Sending is permitted only if that later gate can
establish an unambiguous supported action relation. If it cannot, no action is
clicked and the attempt fails closed.

This Option does not pre-adopt the missing action relation. It defines where
the unresolved question must be evaluated and prohibits send on uncertainty.

### Option C — Separate focused observation before construction

**NOT RECOMMENDED AS THE NEXT STEP.** A read-only observation cannot create the
required post-fill state. A mutation-only observation would duplicate the
state transition needed by the gated pilot while still requiring separate
construction authorization.

```text
POST_FILL_SEND_RELATION: DEFERRED
```

If the pre-send gate cannot establish the action relation without a new
unsupported assumption, it must emit a fixed safe failure code, perform no
send, and defer a dedicated Decision. It must not broaden or learn a selector
after failure within the same attempt.

## Fail Closed Contract

The following safe conditions are non-success:

| Safe violation | Required response |
|---|---|
| `EDITOR_FAMILY_INVENTORY_EMPTY` | no fill/send |
| `EDITOR_IDENTITY_COLLAPSE_UNAVAILABLE` | no fill/send |
| `EDITOR_CANDIDATE_WITHOUT_FORM` | no fill/send |
| `EDITOR_FORM_CARDINALITY_INVALID` | no fill/send |
| `EDITOR_FORM_RELATION_INCONSISTENT` | no fill/send |
| `EDITOR_VISIBLE_CARDINALITY_INVALID` | no fill/send |
| `EDITOR_NOT_EDITABLE` | no fill/send |
| `EDITOR_DISABLED` | no fill/send |
| `EDITOR_FINAL_CARDINALITY_INVALID` | no fill/send |
| `EDITOR_RELATION_CONTRADICTION` | no fill/send |
| `POST_FILL_SEND_RELATION_UNRESOLVED` | no click/send |
| `POST_FILL_SEND_RELATION_AMBIGUOUS` | no click/send |

The harness must not use:

- first candidate;
- first form;
- DOM order;
- generic button order;
- hidden textarea fallback;
- family preference fallback;
- label/value matching as identity; or
- Ground-Truth-assisted selection.

No failed relation may be repaired by Message enumeration, mounted counts,
scrolling, runtime Message identities, or Completeness Signal material.

## No-Fallback Decision

```text
CONFIRMED_FALLBACK: NONE
```

The visible contenteditable observed in the Failure Review is a candidate under
the adopted relation, not a hard-coded fallback. If it is missing, disabled,
non-editable, or not uniquely form-bound, the pre-fill result is non-success.
The hidden textarea-like representation is never an operational fallback.

## Same Prepared Tab Reuse

```text
SAME_PREPARED_TAB_REUSE: ELIGIBLE
```

The Failure Review established unique prepared-tab binding and no construction
mutation. This Decision performs no browser action and does not alter that
finding. Eligibility is an input to a later attempt; it is not authorization
to fill, click, or send.

## Construction Attempt 2 Sequencing

### Option A — Re-authorize all 50 cycles at once

- preserves the original total cycle target;
- exposes all remaining cycles to an editor/action harness whose post-fill
  action relation has not yet been observed; and
- has higher provenance risk if the first live mutation exposes another
  tooling defect.

Assessment: **NOT RECOMMENDED FOR ATTEMPT 2**.

### Option B — Cycle 1 gated pilot, then separately authorize cycles 2–50

- resolves the adopted pre-fill editor relation before mutation;
- fills only after editor success;
- evaluates the deferred post-fill action relation before any send;
- sends only if the pre-send gate is unambiguous;
- verifies exactly one User submission and one Assistant completion for Cycle
  1; and
- stops intentionally before Cycle 2 pending review and separate authorization.

Assessment: **RECOMMENDED**.

An unambiguous successful Cycle 1 followed by an intentional review pause is
not construction ambiguity. It is a precisely ledger-bound partial state:

- occurrence 1 maps to the frozen first User ordinal;
- occurrence 2 maps to the frozen first Assistant ordinal;
- next authorized cycle remains Cycle 2; and
- Long-100 Ground Truth remains not established until all 50 controlled cycles
  complete unambiguously.

Continuation after the pilot requires the same Runtime-only tab binding,
unchanged frozen ledger, exact Cycle 1 safe record, no external mutation, and
separate authorization for the remaining 49 cycles. If any of those cannot be
established, do not repair from DOM counts and do not continue.

If the post-fill gate fails before send, do not click, retry, clear, or select a
generic action within that attempt. Prepared-tab reuse after such a mutation
requires a separate review.

## Next Construction Attempt Entry Requirements

Before starting the gated pilot:

1. user explicitly authorizes Attempt 2 / Cycle 1 only;
2. the prepared tab remains uniquely Runtime-bound;
3. historical external submission count remains 0 by construction record;
4. the frozen ledger and digest remain unchanged;
5. the pre-fill editor resolver implements this Decision exactly;
6. candidate family memberships are collapsed by element identity;
7. unique shared-form and final editor cardinalities fail closed;
8. fill occurs only after `PRE_FILL_EDITOR_RELATION` resolves;
9. send occurs only after a separate post-fill candidate-only safety gate;
10. unresolved or ambiguous post-fill action material causes no send;
11. no retry, selector broadening, fallback, regenerate, edit, or branch occurs;
12. output is Evidence-safe and fixed errors contain no page metadata; and
13. no Message DOM enumeration, scrolling, or completeness observation occurs.

## Privacy Boundary

Only family aliases, counts, element-identity equality booleans, form
cardinality, visibility/editability/enabled states, Decision states, and fixed
safe codes may leave the construction harness.

Raw synthetic content, visible/accessible labels, placeholders, identifying
metadata, Conversation location/identifier, runtime Message identity, DOM/HTML,
browser exception text, and authentication data must remain outside Evidence
and logs.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: unchanged; whole-Conversation acquisition is later scope.
- FR-008 / NFR-001 / NFR-002 / ADR-006: supported by exact cardinality,
  pre-send gating, and no-fallback Fail Closed behavior.
- NFR-007 / TV-005: Long-100 construction preparation continues; no long-load
  validation is performed.
- TV-006: no Completeness Signal is selected or evaluated.
- AT-007 / AT-008: traceability only; no Production Acceptance Test executes.
- RISK-002: unchanged and open.
- Requirement, ADR, Acceptance Test, Risk, Backlog, and AGENTS.md semantics:
  unchanged.
- Production implementation: none.

## Repository / Security Check

- Historical construction Evidence unchanged: **PASS**.
- Failure Review Evidence unchanged: **PASS**.
- Frozen ledger and digest unchanged: **PASS**.
- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan of this Evidence: **PASS**.
- Direct restricted-content scan of this Evidence: **PASS**.
- `docs/`, `AGENTS.md`, `src/`, Production files, TASK-001/TASK-002 assets, and
  historical TASK-003 Evidence unchanged: **PASS**.
- Changed scope: this new Composer Candidate Decision Evidence only.
- Production implementation: none.

## Final Status

```text
CONSTRUCTION_COMPOSER_CANDIDATE_DECISION: COMPLETE
PRE_FILL_EDITOR_RELATION: ADOPTED
POST_FILL_SEND_RELATION: DEFERRED
CONFIRMED_FALLBACK: NONE
SAME_PREPARED_TAB_REUSE: ELIGIBLE

LONG_100_CONSTRUCTION: ABORTED
LONG_100_USER_SUBMISSIONS: 0
LONG_100_ASSISTANT_COMPLETIONS: 0
LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED

TASK-003 DISCOVERY: NOT_STARTED
TV-005 VERDICT: NOT_SET
TV-006 VERDICT: NOT_SET
```

## Recommended Next Action

`TASK-003 Long-100 Construction Attempt 2 — Cycle 1 Gated Pilot`

Request explicit authorization for Cycle 1 only. Do not start the pilot,
Long-200, TV-005 / TV-006 Discovery, or Production work in this Decision Round.
