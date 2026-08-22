# TASK-004 Controlled Fixture / Candidate-Independent Ground Truth Preparation

## Status

- Preparation date: 2026-08-20
- Task: `TASK-004 Branch / Regenerate Spike`
- Primary Validation: `TV-007`
- Primary Risk: `RISK-005`
- Formal Source Type: `Standard Chat`
- `TASK-004 Scope Planning: COMPLETE`
- `TASK-004 Fixture Design: FROZEN`
- `TASK-004 Ground Truth Schema: FROZEN`
- `TASK-004 Manual Fixture Construction: NOT YET EXECUTED`
- `TASK-004 Controlled Fixture: NOT YET ESTABLISHED`
- `TASK-004 Candidate-Independent Ground Truth: NOT YET ESTABLISHED`
- `TASK-004 Manual DOM Discovery: NOT STARTED`
- `TV-007 Candidate Decision: NOT SET`
- `TV-007 Final Verdict: NOT SET`
- `TASK-004 Final Exit: NOT SET`
- `Phase 0 Exit: NOT MET`
- Chrome / DevTools / DOM observation in this preparation: **NO**
- Production implementation: **NO**

Current gate:

```text
TASK_004_FIXTURE_DEFINITION: FROZEN
TASK_004_GROUND_TRUTH_SCHEMA: FROZEN
TASK_004_MANUAL_FIXTURE_EXECUTION: REQUIRED
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_MANUAL_FIXTURE_EXECUTION
```

This is an input/construction gate, not a TV-007 validation failure.

---

## 1. Purpose

This artifact freezes the exact controlled fixture design and the candidate-independent Ground Truth protocol required before TASK-004 Manual DOM Discovery begins.

The Ground Truth is intentionally established from:

- exact user-controlled Message text;
- human-visible ChatGPT responses;
- explicit user-performed UI operations (`Regenerate`, `Edit`, Branch switch);
- fixed saved-prefix boundaries; and
- a Runtime-only unique fixture binding attestation.

It must **not** be established from:

- DOM selectors;
- `data-message-id`;
- `data-turn-id`;
- mounted Message counts;
- branch-control DOM attributes;
- parser output;
- comparator output;
- network/API internals; or
- Sync Hash candidates.

The goal is to know the expected branch/prefix relation **before** any candidate DOM evidence is inspected.

---

## 2. Design Decision — Two Controlled Standard Chats

TASK-004 uses two short Standard Chat fixtures rather than one deeply nested Branch tree.

| Fixture | Alias | Purpose |
|---|---|---|
| Fixture 1 | `TASK004-RS` | Regenerate positive mismatch, Branch Switch mismatch, same-count mismatch, post-prefix unchanged control |
| Fixture 2 | `TASK004-E` | User Edit positive mismatch, same-count mismatch |

Reason:

- Regenerate and User Edit both create branching behavior.
- Combining both mechanisms in one fixture would create a nested Branch tree before Manual DOM Discovery.
- A nested tree would make candidate observation harder to attribute to one operation.
- Two six-Message fixtures isolate causal behavior while remaining small enough to avoid TASK-003 long-conversation completeness concerns.

This is fixture decomposition only. It does not expand TV-007 scope.

---

## 3. Global Fixture Rules

Before creating either fixture:

```text
1. Use a new Standard Chat, not a Project Chat.
2. Do not open DevTools.
3. Do not inspect Elements / DOM / network traffic.
4. Do not run any PoC/parser against the fixture.
5. Use only the visible ChatGPT UI to construct and record Ground Truth.
6. Do not infer Ground Truth from Message IDs, Branch IDs, or DOM counts.
```

Each fixture must be uniquely bindable at Runtime.

The Evidence record stores only:

```text
fixture alias
unique-binding attestation = YES/NO
source type = Standard Chat
human-visible Message ledger
saved-prefix boundary
visible Branch alias
operation history
Ground Truth classification
```

The raw Conversation URL / Conversation ID may be used transiently to bind the fixture during execution, but should not be copied into the Evidence artifact.

Branch aliases in this document are test aliases only. They are not ChatGPT Product Branch identifiers.

---

# Part A — Fixture `TASK004-RS`

## 4. Fixture `TASK004-RS` Objective

`TASK004-RS` establishes all of the following with one short Conversation:

```text
C0: Baseline prefix -> PREFIX_MATCH
R1: Regenerated Assistant inside saved prefix -> PREFIX_MISMATCH
S1: Switch between baseline/regenerated Assistant Branches -> expected relation follows visible Branch
N1: Same Regenerate change evaluated against shorter saved boundary -> PREFIX_MATCH
P5: Message Count remains equal while prefix can differ
```

The fixture has exactly six visible Message occurrences in each qualified Branch state.

---

## 5. `TASK004-RS` Baseline Construction Ledger

Create a fresh Standard Chat.

### Message 1 — User

Send exactly:

```text
TASK004-RS-U01-BASE
Reply with exactly this one line and nothing else:
TASK004-RS-A01-BASE
```

### Message 2 — Assistant acceptance condition

The visible Assistant body must be exactly:

```text
TASK004-RS-A01-BASE
```

If the visible reply contains additional text or does not contain the exact marker as the complete reply, abandon this fixture and create a fresh Standard Chat. Do not use Regenerate to repair setup Messages because that would create an unnecessary early Branch.

### Message 3 — User

Send exactly:

```text
TASK004-RS-U02-BASE
Reply with exactly this one line and nothing else:
TASK004-RS-A02-BASE
```

### Message 4 — Assistant acceptance condition

The visible Assistant body must be exactly:

```text
TASK004-RS-A02-BASE
```

If not exact, abandon this fixture and create a fresh Standard Chat.

### Message 5 — User

Send exactly:

```text
TASK004-RS-U03-BASE
Reply with exactly one line in this form:
TASK004-RS-A03-RND-XXXXXX
Replace XXXXXX with any six digits of your choice.
Do not output anything else.
```

### Message 6 — Assistant baseline acceptance condition

The visible Assistant body must match:

```text
TASK004-RS-A03-RND-[six digits]
```

Example only — do not preselect this value:

```text
TASK004-RS-A03-RND-483726
```

The actual six-digit value is a candidate-independent human-visible Ground Truth input.

Record the complete actual visible line as:

```text
RS_A03_BASELINE_BODY = <actual visible line>
```

Do **not** obtain this value from DevTools or parser output.

---

## 6. `TASK004-RS` Baseline Ground Truth

After Message 6 is visibly complete, freeze the Baseline ledger before performing Regenerate.

| Ordinal | Role | Ground Truth body |
|---:|---|---|
| 1 | User | `TASK004-RS-U01-BASE\nReply with exactly this one line and nothing else:\nTASK004-RS-A01-BASE` |
| 2 | Assistant | `TASK004-RS-A01-BASE` |
| 3 | User | `TASK004-RS-U02-BASE\nReply with exactly this one line and nothing else:\nTASK004-RS-A02-BASE` |
| 4 | Assistant | `TASK004-RS-A02-BASE` |
| 5 | User | `TASK004-RS-U03-BASE\nReply with exactly one line in this form:\nTASK004-RS-A03-RND-XXXXXX\nReplace XXXXXX with any six digits of your choice.\nDo not output anything else.` |
| 6 | Assistant | `<RS_A03_BASELINE_BODY>` |

Freeze these two independent saved-state oracle boundaries:

```text
RS_PRIMARY_SAVED_PREFIX_BOUNDARY = 6
RS_SHORT_SAVED_PREFIX_BOUNDARY   = 4
```

Interpretation:

```text
Against boundary 6:
Baseline -> PREFIX_MATCH

Against boundary 4:
Baseline -> PREFIX_MATCH
```

Required Baseline attestations:

```text
RS_SOURCE_TYPE: Standard Chat
RS_UNIQUE_BINDING: YES
RS_VISIBLE_MESSAGE_COUNT: 6  # Ground Truth construction fact, not DOM-derived
RS_BASELINE_SEQUENCE_FROZEN: YES
RS_PRIMARY_BOUNDARY_FROZEN: YES
RS_SHORT_BOUNDARY_FROZEN: YES
```

`RS_VISIBLE_MESSAGE_COUNT = 6` is known from the controlled six-occurrence construction ledger. It is not a runtime completeness signal.

---

## 7. R1 — Regenerate Positive Variant

With `TASK004-RS` still showing the Baseline Branch, use ChatGPT's visible **Regenerate / Try again** operation on ordinal 6.

Do not edit Message 5.

The regenerated visible Assistant response qualifies only if:

```text
1. it is still the response to the unchanged ordinal-5 User Message;
2. the visible Conversation still contains six Message occurrences;
3. the complete visible Assistant line matches the controlled marker form; and
4. the complete visible body is different from RS_A03_BASELINE_BODY.
```

Record the first materially different qualified response as:

```text
RS_A03_REGENERATED_BODY = <actual visible line>
```

If one Regenerate produces the same visible body as Baseline, that attempt is **not** a positive mismatch Ground Truth. Regenerate again until a different qualified visible body is obtained.

Recommended construction safety limit:

```text
maximum additional Regenerate attempts = 5
```

If no materially different qualified response is obtained within five additional attempts:

```text
RS_REGENERATE_POSITIVE_VARIANT: NOT ESTABLISHED
TASK_004_DISCOVERY_ENTRY: REMAINS BLOCKED
```

Do not invent a difference and do not use DOM identity changes as a substitute.

Once a different visible body is obtained, freeze:

| Ordinal | Role | Regenerated Ground Truth body |
|---:|---|---|
| 1 | User | same as Baseline ordinal 1 |
| 2 | Assistant | same as Baseline ordinal 2 |
| 3 | User | same as Baseline ordinal 3 |
| 4 | Assistant | same as Baseline ordinal 4 |
| 5 | User | same as Baseline ordinal 5 |
| 6 | Assistant | `<RS_A03_REGENERATED_BODY>` |

Required relation:

```text
RS_A03_REGENERATED_BODY != RS_A03_BASELINE_BODY
```

Expected classification against the primary boundary:

```text
saved boundary = 6
changed ordinal = 6
message count = 6 before and after
=> PREFIX_MISMATCH
```

This is the required same-count positive mismatch case.

Freeze alias:

```text
RS_BRANCH_BASELINE    = visible state containing RS_A03_BASELINE_BODY
RS_BRANCH_REGENERATED = visible state containing RS_A03_REGENERATED_BODY
```

These aliases are Ground Truth test names only.

---

## 8. S1 — Branch Switch Ground Truth

After both `RS_BRANCH_BASELINE` and `RS_BRANCH_REGENERATED` visibly exist, use the visible ChatGPT Branch navigation control associated with the branched Assistant response.

Ground Truth is established only from the visible response text after each switch.

### S1-A — Switch to Baseline

Human-visible confirmation:

```text
ordinal 6 body == RS_A03_BASELINE_BODY
```

Expected classification against `RS_PRIMARY_SAVED_PREFIX_BOUNDARY = 6`:

```text
PREFIX_MATCH
```

### S1-B — Switch to Regenerated

Human-visible confirmation:

```text
ordinal 6 body == RS_A03_REGENERATED_BODY
```

Expected classification against `RS_PRIMARY_SAVED_PREFIX_BOUNDARY = 6`:

```text
PREFIX_MISMATCH
```

### S1 safety meaning

The expected result follows the **currently visible Message sequence**, not the historical fact that another Branch exists.

Required relation:

```text
visible Baseline Branch    -> PREFIX_MATCH
visible Regenerated Branch -> PREFIX_MISMATCH
```

Branch-control DOM attributes are not part of this Ground Truth.

---

## 9. N1 — Post-Prefix Branch Change Control

Use the same `TASK004-RS` Baseline and Regenerated Branches, but evaluate them against:

```text
RS_SHORT_SAVED_PREFIX_BOUNDARY = 4
```

The Branch difference is at ordinal 6, which is strictly after the saved boundary.

Human-visible Ground Truth for ordinals 1 through 4 is identical in both states.

Required expected classification:

```text
visible Baseline Branch    + boundary 4 -> PREFIX_MATCH
visible Regenerated Branch + boundary 4 -> PREFIX_MATCH
```

This case rejects an overbroad rule such as:

```text
if a Branch exists or a Branch operation occurred:
    PREFIX_MISMATCH
```

The operation may change history **after** the saved boundary without invalidating the saved prefix.

---

## 10. Optional C1 — Reload Stability Control

After freezing `RS_BRANCH_BASELINE`, optionally reload/revisit that exact visible Branch before DOM Discovery.

If the human-visible ordered bodies remain identical through ordinal 6:

```text
expected classification = PREFIX_MATCH
```

A changed runtime identity after remount is not Ground Truth evidence of mismatch.

C1 is useful stability evidence but is not required to establish the minimum fixture if C0, R1, S1, and N1 are already frozen.

---

# Part B — Fixture `TASK004-E`

## 11. Fixture `TASK004-E` Objective

`TASK004-E` isolates User Edit from Regenerate branching.

It establishes:

```text
E0: Baseline -> PREFIX_MATCH
E1: edited User Message inside saved prefix -> PREFIX_MISMATCH
E1 same-count relation -> six visible Message occurrences before and after
```

---

## 12. `TASK004-E` Baseline Construction Ledger

Create a second fresh Standard Chat.

### Message 1 — User

Send exactly:

```text
TASK004-E-U01-BASE
Reply with exactly this one line and nothing else:
TASK004-E-A01-BASE
```

### Message 2 — Assistant acceptance condition

Must visibly equal:

```text
TASK004-E-A01-BASE
```

If not exact, abandon and create a fresh Standard Chat.

### Message 3 — User

Send exactly:

```text
TASK004-E-U02-BASE
Reply with exactly this one line and nothing else:
TASK004-E-A02-BASE
```

### Message 4 — Assistant acceptance condition

Must visibly equal:

```text
TASK004-E-A02-BASE
```

If not exact, abandon and create a fresh Standard Chat.

### Message 5 — User Baseline

Send exactly:

```text
TASK004-E-U03-BASE
Reply with exactly this one line and nothing else:
TASK004-E-A03-BASE
```

### Message 6 — Assistant Baseline

Preferred visible body:

```text
TASK004-E-A03-BASE
```

If the reply contains additional text, record the actual complete human-visible Assistant body as Ground Truth. The User Edit positive case remains valid because ordinal 5 itself is deterministically changed. However, exact compliance is preferred to keep the fixture simple.

Freeze:

```text
E_PRIMARY_SAVED_PREFIX_BOUNDARY = 6
```

Baseline expected classification:

```text
PREFIX_MATCH
```

---

## 13. `TASK004-E` Baseline Ground Truth

Freeze the visible six-Message ledger before Edit.

| Ordinal | Role | Ground Truth body |
|---:|---|---|
| 1 | User | `TASK004-E-U01-BASE\nReply with exactly this one line and nothing else:\nTASK004-E-A01-BASE` |
| 2 | Assistant | `TASK004-E-A01-BASE` |
| 3 | User | `TASK004-E-U02-BASE\nReply with exactly this one line and nothing else:\nTASK004-E-A02-BASE` |
| 4 | Assistant | `TASK004-E-A02-BASE` |
| 5 | User | `TASK004-E-U03-BASE\nReply with exactly this one line and nothing else:\nTASK004-E-A03-BASE` |
| 6 | Assistant | `<actual visible E baseline Assistant body>` |

Required attestations:

```text
E_SOURCE_TYPE: Standard Chat
E_UNIQUE_BINDING: YES
E_VISIBLE_MESSAGE_COUNT: 6  # construction fact, not DOM-derived
E_BASELINE_SEQUENCE_FROZEN: YES
E_PRIMARY_BOUNDARY_FROZEN: YES
```

---

## 14. E1 — User Edit Positive Variant

Using ChatGPT's visible Edit control, edit ordinal 5 only.

Replace the complete User Message with exactly:

```text
TASK004-E-U03-EDITED
Reply with exactly this one line and nothing else:
TASK004-E-A03-EDITED
```

Submit the edit and allow the visible Assistant response to complete.

Record the complete visible Assistant response as:

```text
E_A03_EDITED_BODY = <actual visible body>
```

Preferred exact body:

```text
TASK004-E-A03-EDITED
```

The positive mismatch Ground Truth does not depend on Assistant compliance because ordinal 5 is already explicitly different.

Freeze edited ledger:

| Ordinal | Role | Edited Ground Truth body |
|---:|---|---|
| 1 | User | same as Baseline ordinal 1 |
| 2 | Assistant | same as Baseline ordinal 2 |
| 3 | User | same as Baseline ordinal 3 |
| 4 | Assistant | same as Baseline ordinal 4 |
| 5 | User | `TASK004-E-U03-EDITED\nReply with exactly this one line and nothing else:\nTASK004-E-A03-EDITED` |
| 6 | Assistant | `<E_A03_EDITED_BODY>` |

Required relation:

```text
Baseline ordinal 5 != Edited ordinal 5
```

Expected classification against `E_PRIMARY_SAVED_PREFIX_BOUNDARY = 6`:

```text
PREFIX_MISMATCH
```

Expected same-count relation:

```text
Baseline Message Count = 6
Edited visible Message Count = 6
AND saved prefix changed
=> PREFIX_MISMATCH
```

If the Edit operation produces a visibly different occurrence count for an unexpected UI reason, record the actual Ground Truth and stop fixture establishment for review. Do not repair the count from DOM evidence.

---

# Part C — Ground Truth Freeze Record

## 15. Candidate-Independent Ground Truth Recording Schema

Before opening DevTools, complete the following record from human-visible UI only.

```text
TASK004-RS
  Source Type: Standard Chat
  Unique Runtime Binding Attested: YES / NO
  Baseline Message Count: 6
  Primary Saved Prefix Boundary: 6
  Short Saved Prefix Boundary: 4
  RS_A03_BASELINE_BODY: <fill from visible UI>
  RS_A03_REGENERATED_BODY: <fill from visible UI>
  Baseline body != Regenerated body: YES / NO
  Baseline sequence frozen: YES / NO
  Regenerated sequence frozen: YES / NO
  Branch switch to Baseline visibly confirmed: YES / NO
  Branch switch to Regenerated visibly confirmed: YES / NO

TASK004-E
  Source Type: Standard Chat
  Unique Runtime Binding Attested: YES / NO
  Baseline Message Count: 6
  Primary Saved Prefix Boundary: 6
  Baseline ordinal-5 body frozen: YES / NO
  Edited ordinal-5 body frozen: YES / NO
  E_A03_BASELINE_BODY: <fill from visible UI>
  E_A03_EDITED_BODY: <fill from visible UI>
  Baseline ordinal 5 != Edited ordinal 5: YES / NO
  Baseline sequence frozen: YES / NO
  Edited sequence frozen: YES / NO
```

No candidate selector or runtime Message identity is allowed in this record.

---

## 16. Frozen Expected Classification Matrix

Once the Ground Truth record is complete, freeze this expected matrix **before** Manual DOM Discovery.

| Case | Fixture / Visible state | Saved boundary | Human-visible change inside boundary? | Expected classification |
|---|---|---:|---|---|
| C0-RS | `RS_BRANCH_BASELINE` | 6 | No | `PREFIX_MATCH` |
| R1 | `RS_BRANCH_REGENERATED` | 6 | Yes, Assistant ordinal 6 | `PREFIX_MISMATCH` |
| S1-A | switch visible state to `RS_BRANCH_BASELINE` | 6 | No | `PREFIX_MATCH` |
| S1-B | switch visible state to `RS_BRANCH_REGENERATED` | 6 | Yes, Assistant ordinal 6 | `PREFIX_MISMATCH` |
| N1-A | `RS_BRANCH_BASELINE` | 4 | No | `PREFIX_MATCH` |
| N1-B | `RS_BRANCH_REGENERATED` | 4 | No; change is after boundary | `PREFIX_MATCH` |
| C0-E | `TASK004-E` Baseline | 6 | No | `PREFIX_MATCH` |
| E1 | `TASK004-E` Edited | 6 | Yes, User ordinal 5 | `PREFIX_MISMATCH` |

This matrix is the candidate-independent oracle against which later Manual DOM Discovery / Minimal PoC results are compared.

---

## 17. Why This Ground Truth Is Independent

The oracle is independent because the expected result is known from controlled visible content and the frozen saved boundary alone.

Example R1:

```text
saved baseline ordinal 6 body = RS_A03_BASELINE_BODY
current visible ordinal 6 body = RS_A03_REGENERATED_BODY
RS_A03_BASELINE_BODY != RS_A03_REGENERATED_BODY
saved boundary = 6
=> expected PREFIX_MISMATCH
```

No DOM identity is needed to know the answer.

Example N1:

```text
saved boundary = 4
ordinals 1..4 are visibly identical
only ordinal 6 differs
=> expected PREFIX_MATCH
```

This distinction is critical because Branch existence is not itself a Product-level mismatch condition.

---

## 18. Ground Truth Establishment Gate

`TASK-004 Controlled Fixture` and `Candidate-Independent Ground Truth` may be marked `ESTABLISHED` only when **all** mandatory rows are true.

| Gate | Required |
|---|---|
| `TASK004-RS` exists as a uniquely bound Standard Chat | YES |
| RS Baseline six-Message ledger frozen | YES |
| RS primary saved boundary 6 frozen | YES |
| RS short saved boundary 4 frozen | YES |
| Different Regenerated Assistant body obtained and frozen | YES |
| Baseline ↔ Regenerated visible Branch switching confirmed | YES |
| `TASK004-E` exists as a uniquely bound Standard Chat | YES |
| E Baseline six-Message ledger frozen | YES |
| E primary saved boundary 6 frozen | YES |
| Edited ordinal-5 User body frozen | YES |
| E Edited visible six-Message ledger frozen | YES |
| Expected classification matrix frozen before DevTools | YES |
| No candidate DOM evidence used to create/repair the oracle | YES |

When all rows are true:

```text
TASK_004_CONTROLLED_FIXTURE: ESTABLISHED
TASK_004_BASELINE_PREFIX_GROUND_TRUTH: ESTABLISHED
TASK_004_BRANCH_VARIANT_GROUND_TRUTH: ESTABLISHED
TASK_004_CANDIDATE_INDEPENDENT_GROUND_TRUTH: ESTABLISHED
TASK_004_DISCOVERY_ENTRY: OPEN
```

Until then:

```text
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_GROUND_TRUTH
```

---

## 19. Failure / Restart Rules

### Restart a fixture from a fresh Standard Chat when

- one of the deterministic setup replies at ordinals 2 or 4 is not exact;
- the intended six-Message baseline structure becomes contaminated by an accidental extra User Message;
- the fixture cannot be uniquely identified at Runtime;
- the user accidentally performs Edit/Regenerate before the Baseline ledger is frozen; or
- the visible state cannot be reconstructed confidently from human-visible UI.

### Do not restart merely because

- Regenerate returns the same ordinal-6 body once;
- runtime IDs appear to have changed;
- Branch control UI has a different label than expected; or
- a later DOM candidate has unexpected structure.

A same-body Regenerate attempt is simply not the positive mismatch variant. Up to five additional attempts may be tried.

### Stop for review when

- Regenerate never produces a materially different controlled body within the safety limit;
- User Edit unexpectedly changes the visible occurrence count;
- Branch switch cannot return to both frozen human-visible states;
- inactive Branch content appears simultaneously visible in the normal UI; or
- any Ground Truth field would need DOM evidence to resolve.

---

## 20. Manual DOM Discovery Entry Protocol

After the Ground Truth gate is fully satisfied:

```text
1. Freeze this Evidence artifact with all runtime Ground Truth fields filled.
2. Do not modify the fixture Messages further.
3. Begin Manual DOM Discovery on TASK004-RS Baseline first.
4. Observe candidates without changing the frozen expected matrix.
5. Observe RS Regenerated.
6. Observe Branch Switch in both directions.
7. Evaluate both boundary-6 and boundary-4 oracle relations.
8. Observe TASK004-E Baseline.
9. Observe TASK004-E Edited.
10. Only after all observations, classify candidate behavior.
```

Manual DOM Discovery must answer candidate questions; it must not rewrite Ground Truth.

---

## 21. Relationship to TASK-003 and TV-020

This fixture deliberately contains six visible Message occurrences and simple plain text.

Therefore:

- it does not require reopening TASK-003 long-conversation completeness;
- Message Count is a construction fact for the oracle, not a runtime completeness rule;
- it does not define Production canonicalization;
- exact plain-text equality is fixture-only validation semantics; and
- final Sync Hash / canonical representation remains `TV-020 / TASK-008`.

A concrete contradiction discovered later may trigger review under the frozen TASK-004 Scope Plan reopen rules.

---

## 22. Current Result of This Preparation

The design and oracle schema are now frozen, but the live Standard Chat fixtures have not yet been manually constructed in this artifact round.

Therefore the truthful status is:

```text
TASK_004_FIXTURE_DESIGN: FROZEN
TASK_004_GROUND_TRUTH_SCHEMA: FROZEN
TASK_004_RS_FIXTURE: NOT_YET_CONSTRUCTED
TASK_004_E_FIXTURE: NOT_YET_CONSTRUCTED
TASK_004_CONTROLLED_FIXTURE: NOT_YET_ESTABLISHED
TASK_004_CANDIDATE_INDEPENDENT_GROUND_TRUTH: NOT_YET_ESTABLISHED
TASK_004_MANUAL_DOM_DISCOVERY: NOT_STARTED
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_MANUAL_FIXTURE_EXECUTION
TV_007_FINAL_VERDICT: NOT_SET
TASK_004_FINAL_EXIT: NOT_SET
TASK_003_REOPEN_REQUIRED: NO
PHASE_0_EXIT: NOT_MET
```

No technical failure is implied.

---

## 23. Immediate Next Action

Construct `TASK004-RS` and `TASK004-E` manually in Standard Chat using the exact scripts above, without DevTools.

Then fill only the following runtime Ground Truth values from the visible UI:

```text
RS_A03_BASELINE_BODY
RS_A03_REGENERATED_BODY
RS_UNIQUE_BINDING attestation
RS Branch-switch confirmations

E_A03_BASELINE_BODY
E_A03_EDITED_BODY
E_UNIQUE_BINDING attestation
E Edit / six-occurrence confirmations
```

Once those values are supplied and the mandatory gate is satisfied, this artifact can be updated from `NOT YET ESTABLISHED` to `ESTABLISHED`, and TASK-004 Manual DOM Discovery can begin.
