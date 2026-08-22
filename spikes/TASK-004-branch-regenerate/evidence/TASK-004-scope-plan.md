# TASK-004 Branch / Regenerate Spike — Scope Planning

## Status

- Planning date: 2026-08-20
- Task: `TASK-004 Branch / Regenerate Spike`
- Scope: TASK-004 Scope Planning / Ground Truth / Discovery plan only
- `TASK-004 Scope Planning: COMPLETE`
- `TASK-004 Fixture / Ground Truth: NOT STARTED`
- `TASK-004 Manual DOM Discovery: NOT STARTED`
- `TV-007 Candidate Decision: NOT SET`
- `Minimal PoC / Self-test: NOT STARTED`
- `TV-007 Final Verdict: NOT SET`
- `TASK-004 Final Exit: NOT SET`
- `Phase 0 Exit: NOT MET`
- New Chrome observation in this Planning: **NO**
- New DOM Discovery in this Planning: **NO**
- Production implementation: **NOT STARTED**
- Notion write / Recovery implementation: **OUT OF SCOPE**

Discovery gate:

```text
TASK-004 DISCOVERY ENTRY: BLOCKED_BY_GROUND_TRUTH
TASK-004 CONTROLLED_FIXTURE: NOT YET ESTABLISHED
TASK-004 BASELINE_PREFIX_GROUND_TRUTH: NOT YET ESTABLISHED
TASK-004 BRANCH_VARIANT_GROUND_TRUTH: NOT YET ESTABLISHED
```

This is a preparation gate, not a TV-007 validation failure.

---

## 1. Review Basis

Repository-current sources reviewed for this Planning:

- `TASK-003-completion-handoff.md`
- `TASK-003-final-exit-review.md`
- `TASK-003-tv005-tv006-final-review.md`
- `TASK-003-minimal-poc-technical-overview.md`
- `docs/01_product-requirements.md`
- `docs/02_adr.md`
- `docs/03_risk-register.md`
- `docs/04_acceptance-tests.md`
- `docs/05_technical-validation-plan.md`
- `docs/06_development-backlog.md`

This Planning does not reopen TASK-003 and does not perform new live browser validation.

TASK-003 remains frozen at:

```text
LONG_100_GROUND_TRUTH: ESTABLISHED
LONG_200_GROUND_TRUTH: ESTABLISHED
MANUAL_DOM_DISCOVERY: COMPLETE
LONG_100_METHOD_GATE: PASS
LONG_200_BASELINE: PASS
LONG_200_RELOAD_REPRODUCIBILITY: PASS
TV_005_CANDIDATE_DECISION: ADOPTED
TV_006_CANDIDATE_DECISION: ADOPTED
MINIMAL_POC_RESULT: PASS
SELF_TEST_RESULT: PASS
SELF_TEST_ASSERTION_GROUPS: 47
TV_005_FINAL_VERDICT: PASS
TV_006_FINAL_VERDICT: PASS
TASK_003_FINAL_EXIT: PASS
TASK_003_STATUS: COMPLETE
PHASE_0_EXIT: NOT_MET
```

TASK-003 long-conversation completeness must not be reopened unless TASK-004 produces a concrete contradiction against an adopted TASK-003 contract.

---

## 2. Source-of-Truth Scope

The current Development Backlog defines:

```text
TASK-004 Branch / Regenerate Spike
Refs: TV-007
Risk: RISK-005
Exit: Branch変更でPrefix mismatch検出
```

The Technical Validation Plan defines:

```text
TV-007 Branch / Regenerate / Edited Message
Hypothesis:
現在表示BranchのMessage列を取得でき、Branch変更時にPrefix mismatchを検出できる。

Method:
regenerate、user edit、branch switch。

Pass:
既存保存状態と異なる場合に通常Diffを止められる。

Related:
FR-038, FR-039
```

No Source-of-Truth mismatch was found.

### Formal Objective

TASK-004 must establish whether the current visible ChatGPT branch can be represented as an ordered Message sequence and whether a change inside the already-saved prefix can be detected safely enough to stop normal Diff Append.

The core relation is:

```text
current visible branch Message sequence
        |
        v
current prefix corresponding to saved boundary
        |
        v
compare with independently frozen saved-prefix Ground Truth
        |
        +--> PREFIX_MATCH
        |
        +--> PREFIX_MISMATCH
        |
        +--> UNKNOWN / AMBIGUOUS -> Fail Closed
```

The task is not to detect that a branch operation happened merely as a UI event.

The task is to detect whether the **already-saved prefix is still the same** after Regenerate / User Edit / Branch Switch.

---

## 3. Source Type Boundary

### Formal PASS scope

Standard Chat is the primary and sufficient Source Type for TASK-004 Formal TV-007 validation.

Reasoning:

- TV-007 does not define a Standard + Project coverage matrix.
- TASK-004 Backlog Exit is expressed only as Branch-change Prefix mismatch detection.
- Adding mandatory Project coverage would expand the formal Exit beyond the current Backlog and Technical Validation Plan.
- TASK-001 / TASK-003 already provide the Standard Chat Message acquisition baseline needed to isolate Branch behavior.

Therefore:

```text
TASK-004 FORMAL SOURCE TYPE: Standard Chat
```

### Project Chat

Project Chat is not claimed by Standard-only TV-007 Evidence.

This Planning does not assert that Branch DOM behavior is identical in Project Chat.

Project applicability remains a follow-up coverage question unless:

1. a later requirement explicitly adds Project coverage to TV-007; or
2. TASK-004 Discovery reveals a Source-independent contract whose Project applicability is separately validated.

TASK-002 is not reopened by this Planning.

---

## 4. Requirement / ADR / Acceptance Traceability

| Source | TASK-004 implication | Boundary |
|---|---|---|
| FR-033 Prefix検証 | Diff Append前に保存済みPrefixとの整合確認が必要 | Production Prefix Compare itself is TASK-304 |
| FR-035 Prefix不一致 | 保存済みPrefix変更時は通常Diff Append停止 | TASK-004 validates detection feasibility only |
| FR-038 Visible Branch | 保存対象は現在表示されているBranchのみ | Hidden / inactive sibling Branch must not be merged into the current sequence |
| FR-039 Branch変更 | Regenerate / Edit等で既存Prefixが変われば通常Diff停止 | Core TV-007 concern |
| ADR-005 | ChatGPT側Conversation全取得後に保存済みPrefixと比較 | No Notion append implementation in TASK-004 |
| ADR-006 | Prefix不一致や曖昧状態はFail Closed | `UNKNOWN` / `AMBIGUOUS` must never become Match |
| AT-028 | 保存済みPrefix変更時に通常追記しない | Production acceptance test remains future work |
| AT-029 | Branch変更を通常更新せずRecoveryへ移行 | Recovery UI itself is out of scope |
| RISK-005 | Branch変更により既存Prefixが変化 | Primary task risk |
| TV-020 | Canonical representation / Hash rules | Final canonicalization is explicitly deferred to TASK-008 |

No Production Acceptance Test is set to PASS by TASK-004 Scope Planning.

---

## 5. RISK-005 Boundary

RISK-005 is:

```text
Branch変更により既存Prefixが変化
```

The risk is not simply “multiple branches exist.”

The failure mode is that normal Diff Append could incorrectly treat a changed historical prefix as unchanged and append new Messages onto an incompatible saved history.

A dangerous false-negative example is:

```text
saved count == current count
AND
current visible branch differs inside saved prefix
AND
runtime logic approves normal Diff Append
```

TASK-004 must therefore demonstrate that Message Count equality does not imply Prefix equality.

A dangerous false-positive example is:

```text
branch operation occurred only after saved boundary
AND
saved prefix is unchanged
AND
runtime logic reports PREFIX_MISMATCH only because a branch exists
```

TASK-004 must also avoid treating the existence of a Branch or a changed runtime identity as sufficient proof of Prefix mismatch.

---

## 6. Branch Identity vs Prefix Equality

The Product Requirements explicitly state:

```text
Version is not an identifier for the ChatGPT-side Branch itself.
```

TASK-004 therefore does not define persisted Branch identity.

The following are candidate Evidence and may be useful during Discovery:

```text
data-message-id
data-turn-id
branch index / branch navigation UI
accessible branch-control labels
DOM order
Message ordinal
```

However, none of these is automatically the Product-level Prefix equality rule.

In particular:

```text
data-message-id changed
!=
automatically PREFIX_MISMATCH
```

and:

```text
branch index changed
!=
automatically PREFIX_MISMATCH
```

TASK-004 Prefix mismatch is about a change in the saved Message prefix represented by the currently visible Branch.

If two Branch states are semantically equivalent under the later canonical representation, Branch identity alone must not force a mismatch.

Final semantic equivalence and Sync Hash normalization remain TV-020 / TASK-008 work.

---

## 7. TASK-003 Contract Reuse

TASK-004 may reuse the following adopted TASK-003 acquisition baseline unless live Evidence contradicts it:

```text
Message unit:
section[data-testid^="conversation-turn-"]

Ordinal:
data-testid = conversation-turn-N

Run-local acquisition / dedup identity:
data-message-id

Cross-check identity:
data-turn-id

Role:
data-message-author-role
```

Important boundaries:

- `data-message-id` remains a run-local acquisition identity, not persisted Ground Truth.
- `data-turn-id` remains a cross-check identity, not persisted Branch identity.
- strict long-conversation traversal is not automatically required for the short controlled TASK-004 fixture.
- TASK-003 completeness logic remains valid and is not part of TV-007 unless the Branch fixture itself reveals a concrete contradiction.

For TASK-004, the fixture should deliberately remain short enough that Branch semantics can be isolated from long-conversation virtualization.

---

## 8. TV-007 Boundary

### In scope

TV-007 Discovery includes:

- current visible Branch Message sequence;
- whether inactive sibling Branch content is absent, hidden, or concurrently mounted;
- Regenerate behavior;
- User Edit behavior;
- Branch Switch behavior;
- Message ordinal behavior across Branch changes;
- role stability across Branch changes;
- run-local identity behavior across Branch changes;
- body-content behavior across Branch changes;
- Branch navigation/control candidate material;
- same-count / different-prefix cases;
- unchanged-prefix control cases;
- post-prefix Branch-change control cases;
- ambiguity and Fail Closed behavior; and
- reload of an unchanged visible Branch as a stability control if needed.

### Out of scope

TASK-004 does not include:

- Production Chrome Extension implementation;
- Notion API access;
- Notion Sync State implementation;
- Production Diff Append;
- Recovery Menu / Rebuild / New Version implementation;
- Version state transition implementation;
- final Sync Hash algorithm;
- final ContentBlock canonicalization;
- Rich Content normalization beyond what is necessary for the simple controlled fixture;
- long-conversation completeness revalidation;
- Project Chat Formal coverage;
- ChatGPT internal network / API reverse engineering;
- hidden Branch history export; or
- saving all Branches.

---

## 9. Prefix Comparison Boundary for This Spike

TASK-004 must not preempt TV-020.

Therefore the Spike uses deliberately simple plain-text fixture Messages with explicit human-visible markers.

The Technical Validation comparison may use a temporary fixture-only representation such as:

```text
Message ordinal
+ role
+ exact controlled plain-text body
```

This representation exists only to prove TV-007 behavior in a controlled fixture.

It is not the Production Sync Hash contract.

The formal separation is:

```text
TASK-004
controlled plain-text equality / inequality
-> prove Branch-induced prefix mismatch detection feasibility

TASK-008 / TV-020
canonical representation
-> define Production semantic normalization and hash rules
```

TASK-004 must not claim that whitespace, Markdown, citations, code, links, rich formatting, or unsupported content have final equality semantics.

---

## 10. Ground Truth Independence Contract

Ground Truth must be established before candidate DOM classification is used to decide whether a Branch state differs.

Ground Truth must be based on the human-visible controlled fixture, not on candidate selectors or runtime identities.

### Acceptable Ground Truth provenance

For each controlled state, record independently:

```text
fixture alias
Conversation ID / URL identity for fixture binding
Source Type
visible Branch alias
saved-prefix boundary ordinal
ordered Message ordinal
role
exact human-visible plain-text marker/body
operation used to produce the state
```

Branch aliases such as:

```text
BASELINE
REGENERATED_A
EDITED_USER_B
SWITCHED_ORIGINAL
```

are test aliases only. They are not Product Branch IDs.

### Unacceptable Ground Truth provenance

Ground Truth must not be created or repaired from:

```text
data-message-id
data-turn-id
branch-control DOM attributes
candidate selector counts
DOM mounted count
runtime parser output
runtime prefix comparator output
Sync Hash candidate
network response internals
```

Candidate Evidence may later be compared with frozen Ground Truth but cannot define it.

---

## 11. Controlled Fixture Plan

A short Standard Chat fixture is preferred.

The fixture should use simple plain-text Messages and explicit markers so the changed ordinal is unambiguous without requiring Rich Content canonicalization.

Recommended conceptual shape:

```text
1  User       TASK004-U01-BASE
2  Assistant  TASK004-A01-BASE
3  User       TASK004-U02-BASE
4  Assistant  TASK004-A02-BASE
5  User       TASK004-U03-BASE
6  Assistant  TASK004-A03-BASE
```

The exact text may differ, but every controlled Message must be independently recognizable.

### Saved-prefix boundary

At least one saved-prefix boundary must be frozen before Branch variants are evaluated.

Example:

```text
SAVED_PREFIX_BOUNDARY = ordinal 6
```

A second shorter boundary may be used for the post-prefix negative control, for example:

```text
SHORT_SAVED_PREFIX_BOUNDARY = ordinal 4
```

The fixture must not infer these boundaries from DOM counts.

They are test-oracle inputs representing a previously saved state.

---

## 12. Required Operation Matrix

The following cases define the minimum TV-007 Discovery matrix.

| Case | Operation | Saved-prefix relation | Expected technical classification |
|---|---|---|---|
| C0 | Baseline, no Branch change | Same | `PREFIX_MATCH` |
| R1 | Regenerate an Assistant response inside saved prefix and obtain materially different visible content | Changed | `PREFIX_MISMATCH` |
| E1 | Edit a User Message inside saved prefix with an explicit changed marker | Changed | `PREFIX_MISMATCH` |
| S1 | Switch from one established Branch to another where saved-prefix content differs | Changed | `PREFIX_MISMATCH` |
| N1 | Branch operation occurs strictly after the saved-prefix boundary | Saved prefix unchanged | `PREFIX_MATCH` |
| C1 | Reload / revisit the same visible Branch without semantic prefix change | Same | `PREFIX_MATCH` or, if stable comparison cannot be established, Fail Closed; never false mismatch solely from remount identity |

### R1 — Regenerate

The Regenerate case must not assume regeneration always produces different content.

The case becomes valid only after human-visible Ground Truth confirms that the regenerated Branch materially differs inside the saved prefix.

If regeneration produces semantically identical controlled content, it is not usable as the positive mismatch example and must not be forced into one.

### E1 — User Edit

The User Edit case should deliberately change an explicit marker inside a saved User Message so that the positive mismatch Ground Truth is deterministic.

### S1 — Branch Switch

The Branch Switch case must switch between two already-established visible Branch states whose frozen Ground Truth differs inside the saved prefix.

The test must determine whether the Message acquisition candidate returns only the current visible Branch or accidentally includes inactive sibling content.

### N1 — Post-prefix Branch change

This is a required safety control.

A Branch operation after the saved boundary must not cause `PREFIX_MISMATCH` when all Messages inside the saved prefix remain unchanged.

This prevents an overbroad implementation equivalent to:

```text
if branch exists or branch changed:
    mismatch
```

---

## 13. Same-Count Mismatch Requirement

At least one positive mismatch case must preserve the same Message Count as the saved state.

Required relation:

```text
saved Message Count == current Message Count
AND
saved prefix content != current visible prefix content
=> PREFIX_MISMATCH
```

This case prevents Message Count from acting as a substitute for Prefix comparison.

Message Count may be diagnostic Evidence but cannot establish Prefix equality.

---

## 14. Visible Branch Contract

FR-038 requires only the currently visible Branch to be saved.

TASK-004 must therefore answer the following Discovery questions:

1. Does the adopted Message selector expose only the visible Branch?
2. Are inactive sibling Messages absent from the DOM, hidden, or concurrently mounted?
3. If sibling Messages are concurrently mounted, what candidate relation distinguishes the visible sequence safely?
4. Does DOM order remain a valid representation of the currently visible Conversation sequence?
5. Does Branch switching replace Message units, remount them, or mutate attributes in place?
6. Do ordinals remain stable across Branch switches?
7. Do `data-message-id` and `data-turn-id` change across sibling Branches?
8. Can a Branch control/index be observed reliably enough to act as auxiliary Evidence?
9. Can the visible sequence be classified without relying on a Branch identifier as Product state?
10. What state must be returned when visible-Branch membership is ambiguous?

The required safety answer to question 10 is:

```text
UNKNOWN / AMBIGUOUS
-> Fail Closed
```

No guessed visible-Branch fallback is allowed.

---

## 15. Candidate Evidence Inventory

The initial Candidate Inventory is observational only.

No item is adopted by this Scope Plan.

### Message-sequence candidates

```text
section[data-testid^="conversation-turn-"]
data-testid ordinal
data-message-author-role
human-visible body candidate inherited from TASK-001
DOM order
```

### Runtime identity candidates

```text
data-message-id
data-turn-id
```

These may help characterize Branch replacement/remount behavior but are not persisted equality semantics.

### Branch-control candidates

Examples to inspect if present:

```text
previous / next Branch buttons
branch position indicators
accessible names / aria-labels
button disabled state
nearest Message relation
container relation to the branched Message
```

Exact selectors must not be invented in Planning. They are Manual DOM Discovery outputs.

---

## 16. Planning-Only Classification Model

The following states are useful for Technical Validation reasoning:

```text
PREFIX_MATCH
PREFIX_MISMATCH
UNKNOWN
AMBIGUOUS
INVALID_CAPTURE
```

### `PREFIX_MATCH`

Eligible only when the current visible sequence can be compared with the frozen saved-prefix boundary and all Messages inside that boundary match under the controlled fixture representation.

### `PREFIX_MISMATCH`

Eligible only when at least one Message inside the frozen saved-prefix boundary is demonstrably different in the current visible Branch.

### `UNKNOWN`

Used when required Evidence is unavailable or the saved boundary cannot be evaluated.

### `AMBIGUOUS`

Used when multiple competing visible-sequence interpretations remain possible, for example if hidden sibling Branch content cannot be safely excluded.

### `INVALID_CAPTURE`

Used when Message order, role, ordinal, body, or required capture structure is inconsistent.

Fail Closed relation:

```text
UNKNOWN
AMBIGUOUS
INVALID_CAPTURE
!= PREFIX_MATCH
```

Only proven `PREFIX_MATCH` is eligible for normal Diff Append in later Production logic.

---

## 17. TV-007 Pass Criteria

TV-007 may receive `PASS` only if all required conditions below are satisfied by Evidence.

### P1 — Visible Branch acquisition

The current visible Branch can be represented as one ordered Message sequence without silently merging inactive sibling Branch content.

### P2 — Regenerate mismatch

A Regenerate case with a confirmed change inside the saved prefix is classified as `PREFIX_MISMATCH`.

### P3 — User Edit mismatch

A User Edit case with a controlled change inside the saved prefix is classified as `PREFIX_MISMATCH`.

### P4 — Branch Switch mismatch

Switching to an established Branch whose saved prefix differs is classified as `PREFIX_MISMATCH`.

### P5 — Same-count mismatch

At least one case proves that equal Message Count does not prevent mismatch detection.

### P6 — Unchanged-prefix control

A state with an unchanged saved prefix is not classified as mismatch solely because runtime identities remounted or a Branch UI exists.

### P7 — Post-prefix Branch control

A Branch change strictly after the saved boundary does not invalidate an otherwise unchanged saved prefix.

### P8 — Fail Closed ambiguity

Missing, ambiguous, internally inconsistent, or unsafe Branch membership cannot become `PREFIX_MATCH` through fallback logic.

### P9 — Candidate / Ground Truth separation

Candidate classification is frozen before final comparison with independently frozen Ground Truth.

### P10 — Hash boundary preserved

The TV-007 result does not claim final Production canonicalization or Sync Hash semantics.

If any required positive case cannot be distinguished from the saved prefix, or any ambiguity can silently become Match, TV-007 is not PASS.

---

## 18. Minimal PoC / Self-test Boundary

After Manual DOM Discovery and Candidate Decision, a Minimal PoC is recommended to encode the adopted TV-007 relation deterministically.

The PoC should be narrow:

```text
visible Message-sequence extraction contract
+
controlled prefix comparator
+
Fail Closed classifier
```

Self-test should include at minimum:

```text
ST-001 baseline match
ST-002 same-count changed prefix -> mismatch
ST-003 changed User Message -> mismatch
ST-004 changed Assistant Message -> mismatch
ST-005 changed Message after saved boundary -> match
ST-006 runtime identity changed but controlled semantic prefix same -> not automatic mismatch
ST-007 hidden/inactive sibling contamination -> not match
ST-008 missing body/role/ordinal -> Fail Closed
ST-009 ambiguous visible Branch membership -> Fail Closed
ST-010 no fallback from UNKNOWN/AMBIGUOUS to MATCH
```

Synthetic Self-test is not live Chrome Evidence.

As in TASK-003, live browser claims must come from Manual DOM Discovery; PoC/Self-test only verifies that the adopted relation can be expressed as deterministic code.

---

## 19. Recommended Discovery Sequence

The recommended sequence is:

```text
1. Scope Plan freeze
2. Controlled Standard Chat fixture construction
3. Baseline saved-prefix Ground Truth freeze
4. Regenerate / Edit / Branch variants creation
5. Variant Ground Truth freeze from human-visible UI
6. Manual DOM Discovery protocol freeze
7. Baseline candidate observation
8. R1 Regenerate observation
9. E1 User Edit observation
10. S1 Branch Switch observation
11. N1 post-prefix negative control
12. C1 unchanged/reload stability control if needed
13. Candidate classification decision
14. Freeze candidate decision
15. Compare candidate results with Ground Truth
16. Minimal PoC
17. Deterministic Self-test
18. TV-007 Final Review
19. TASK-004 Final Exit Review
```

No Codex-driven autonomous fixture creation is required by this plan.

Fixture construction may be manually controlled, consistent with the safety and oracle-separation lessons from TASK-003.

---

## 20. Discovery Entry Criteria

Manual DOM Discovery must not begin until all of the following are true:

```text
TASK-004 Scope Planning: COMPLETE
Controlled Standard Chat fixture: ESTABLISHED
Baseline visible Message sequence: FROZEN
Saved-prefix boundary: FROZEN
At least one Regenerate positive variant: FROZEN
At least one User Edit positive variant: FROZEN
At least two switchable Branch states: FROZEN
Post-prefix negative-control boundary/state: FROZEN
Ground Truth provenance: candidate-independent
```

If any state is created but its visible Message sequence cannot be recorded independently, that state is not qualified Ground Truth.

---

## 21. Reopen Rules

### TASK-003

Do not reopen TASK-003 for:

- ordinary Branch remounting;
- changed runtime Message identities;
- Message Count equality;
- short-fixture Branch switching; or
- a need to compare two visible prefixes.

Reopen or issue a contradiction review only if TASK-004 demonstrates a concrete conflict with an adopted TASK-003 fact, for example:

```text
Message selector no longer represents Message units safely
or
role / ordinal acquisition contract is directly contradicted
or
completeness contract becomes invalid for a reason exposed by Branch state
```

### TASK-008

Do not pull TV-020 into TASK-004 merely because a comparator is needed.

Escalate to TASK-008 early only if TV-007 cannot be evaluated even with deliberately simple controlled plain-text Messages without resolving canonicalization semantics.

---

## 22. Repository / Security Boundary

TASK-004 requires no secret material.

Do not add:

- Notion token;
- browser profile secrets;
- cookies;
- authentication headers;
- private network captures; or
- Conversation body data unrelated to the controlled fixture.

Evidence should contain only the minimum controlled fixture content required to reproduce the Branch relation.

No Production network calls are required.

---

## 23. Blocking Status

Current state after this Scope Plan:

```text
TASK_004_SCOPE_PLANNING: COMPLETE
TASK_004_DISCOVERY: NOT_STARTED
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_GROUND_TRUTH
TV_007_CANDIDATE_DECISION: NOT_SET
TV_007_FINAL_VERDICT: NOT_SET
TASK_004_FINAL_EXIT: NOT_SET
TASK_003_REOPEN_REQUIRED: NO
PHASE_0_EXIT: NOT_MET
```

There is no technical failure at this stage.

The only next gate is controlled fixture / Ground Truth establishment.

---

## 24. Final Scope Decision

TASK-004 is frozen as a narrow Technical Spike with the following central question:

> Can the Message sequence for the currently visible Branch be acquired safely enough to determine whether the already-saved prefix has changed after Regenerate, User Edit, or Branch Switch, while avoiding false mismatch from Branch existence or runtime identity change alone?

Formal boundaries:

```text
Primary Validation: TV-007
Primary Risk: RISK-005
Formal Source Type: Standard Chat
Required operations: Regenerate / User Edit / Branch Switch
Required safety controls: unchanged prefix / same-count mismatch / post-prefix Branch change
Comparison basis: controlled fixture-only plain-text representation
Final Hash canonicalization: deferred to TV-020 / TASK-008
Production Diff / Recovery / Version handling: out of scope
TASK-003: remain closed absent concrete contradiction
```

TASK-004 Scope Planning is complete.

---

## 25. Recommended Next Action

Proceed to:

```text
TASK-004 Controlled Fixture / Ground Truth Preparation
```

The next artifact should define:

- exact Standard Chat fixture messages;
- baseline saved-prefix boundary;
- Branch state aliases;
- Regenerate case;
- User Edit case;
- Branch Switch case;
- post-prefix negative control;
- Ground Truth recording format; and
- the gate for beginning Manual DOM Discovery.
