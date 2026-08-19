# TASK-003 Manual Fixture Construction and Ground Truth

## 1. Document Status

- Integrated document date: 2026-08-19
- Scope: Long-100 / Long-200 manual controlled fixture construction and Ground Truth acceptance
- Architecture: `OUT_OF_BAND_MANUAL_CONTROLLED`
- Historical Evidence replacement: **NO**
- TV-005 / TV-006 candidate observation used to create Ground Truth: **NO**
- Raw Message / locator persistence: **NO**

This document consolidates the manual fixture-construction path selected after the automated Chrome-control construction path was superseded for TASK-003.

## 2. Ground Truth Objective

The fixture oracle had to be established independently of the DOM candidates later evaluated by TV-005 / TV-006.

The governing rule was:

```text
Construction provenance first
-> freeze exact oracle
-> uniquely bind the completed fixture at Runtime
-> only then begin TV-005 / TV-006 candidate observation
```

Ground Truth was not allowed to be inferred or repaired from:

- mounted Message count;
- Conversation DOM enumeration;
- scrolling;
- scroll height;
- runtime Message identity union;
- observed ordinal gaps; or
- Completeness Signal candidates.

## 3. Construction Provenance Contract

```text
MANUAL_CONSTRUCTION_PROVENANCE_MODEL:
CONTEMPORANEOUS_CYCLE_LEDGER
```

An accepted cycle represented exactly:

```text
1 intended User occurrence
+
1 corresponding Assistant occurrence
```

The operator maintained contemporaneous safe occurrence provenance and did not rely on later recollection or DOM recounting.

### Safe cycle record

The manual protocol tracked, in safe form, fields equivalent to:

```text
CYCLE_NUMBER
USER_ORDINAL
USER_OCCURRENCE_ALIAS
ASSISTANT_ORDINAL
ASSISTANT_OCCURRENCE_ALIAS
USER_ACTION_CONFIRMED
ASSISTANT_COMPLETION_CONFIRMED
AMBIGUITY_FLAG
RETRY_OCCURRED
REGENERATE_OCCURRED
EDIT_OCCURRED
BRANCH_OCCURRED
INTERRUPTION_OCCURRED
UNEXPECTED_EXTRA_OCCURRENCE
CYCLE_ACCEPTED
RECORDED_CONTEMPORANEOUSLY
```

No raw User or Assistant Message body was required in Evidence.

## 4. Attempt Invalidation Contract

Count-affecting ambiguity invalidated the controlled attempt rather than the operator guessing or repairing it.

Examples:

- uncertain whether Send occurred once or twice;
- uncertain Assistant occurrence;
- unexpected extra response;
- regenerate / edit / branch;
- wrong target Chat;
- uncertain interrupted generation;
- version / branch UI indicating visible-sequence ambiguity; and
- any retry whose occurrence effect was not independently certain.

The invalid attempt was excluded from the formal fixture oracle.

## 5. Construction Batching and Ledger Custody

Construction was performed in controlled batches with contemporaneous ledger review.

The practical structure used for the successful manual path was:

```text
BATCH_SIZE:
10 cycles

Long-100:
5 accepted batches

Long-200:
10 accepted batches
```

A pause between reviewed batches did not by itself change occurrence provenance, provided target continuity and ledger continuity remained exact.

Candidate observation remained prohibited during construction.

## 6. Long-100 Frozen Ledger

The Long-100 oracle design was frozen before construction:

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

ROLE_RULE:
odd ordinal = User
even ordinal = Assistant

CONTROLLED_CYCLES:
50

USER_OCCURRENCES:
50

ASSISTANT_OCCURRENCES:
50
```

The frozen alias / ordinal / role relation was not modified from later DOM observations.

## 7. Historical Automated Long-100 Attempts

Before the manual architecture was adopted, automated construction attempts were explored and safely aborted.

Historical findings included:

- an initial pre-submission composer-cardinality failure with zero submissions;
- subsequent attempts that could fill a composer but could not establish the exact Send / completion relation required by the strict construction oracle; and
- an `ABORTED_AFTER_SEND` case where post-action state was insufficient to prove the exact accepted occurrence lifecycle.

These attempts remain Historical Evidence and were **not** reclassified as accepted construction cycles.

The architecture review then selected manual controlled construction rather than weakening the oracle.

## 8. Long-100 Manual Construction Result

The later out-of-band manual controlled construction completed the frozen Long-100 design.

Final accepted construction facts:

```text
LONG_100_ACCEPTED_CYCLES:
50

LONG_100_EXPECTED_OCCURRENCES:
100

LONG_100_USER_OCCURRENCES:
50

LONG_100_ASSISTANT_OCCURRENCES:
50

LONG_100_INVALIDATING_EVENT:
NONE

LONG_100_LEDGER_BATCH_REVIEW:
PASS
```

The operator maintained one controlled target and no count-affecting retry / regenerate / edit / branch event was accepted into the fixture provenance.

## 9. Long-100 Binding and Ground Truth Acceptance

After construction, the completed fixture was uniquely bound Runtime-only to the safe alias `Long-100`.

Persistent Evidence did not store the raw fixture locator.

The final acceptance relation was:

```text
CONSTRUCTION_COMPLETED:
true

TARGET_CHAT_CONTINUITY_CONFIRMED:
true

UNIQUE_FIXTURE_IDENTIFICATION_CONFIRMED:
true

RAW_LOCATOR_PERSISTED_IN_EVIDENCE:
false

FROZEN_LEDGER_UNCHANGED:
true

CANDIDATE_OBSERVATION_USED_FOR_REPAIR:
false
```

Result:

```text
LONG_100_FIXTURE:
DESIGNATED

LONG_100_GROUND_TRUTH:
ESTABLISHED
```

## 10. Long-200 Frozen Ledger

The same provenance model was reused independently for Long-200.

The Long-200 oracle design was frozen before candidate observation:

```text
FIXTURE_ALIAS:
Long-200

SOURCE_TYPE:
Standard

EXPECTED_MESSAGE_COUNT:
200

EXPECTED_DISTINCT_OCCURRENCE_COUNT:
200

FIRST_ALIAS:
L200-M001

LAST_ALIAS:
L200-M200

ROLE_RULE:
odd ordinal = User
even ordinal = Assistant

CONTROLLED_CYCLES:
100

USER_OCCURRENCES:
100

ASSISTANT_OCCURRENCES:
100
```

Long-200 used its own ledger and fixture binding. Long-100 runtime observations were not used to construct or approve it.

## 11. Long-200 Attempt 1 — Invalidated

The first manual Long-200 attempt was invalidated during Cycle 6 after a `See Versions` UI state was observed.

The significance was provenance ambiguity: version / branch semantics could affect the visible occurrence sequence, so exact construction provenance could no longer be guaranteed safely.

The required Fail Closed action was taken:

```text
LONG_200_ATTEMPT_1:
INVALIDATED

INVALIDATION_POINT:
CYCLE_6

INVALIDATION_REASON:
SEE_VERSIONS / VISIBLE_SEQUENCE_AMBIGUITY

ATTEMPT_1_USED_FOR_FORMAL_GROUND_TRUTH:
false
```

No later DOM enumeration or count repair was used to salvage the attempt.

## 12. Long-200 Attempt 2 — Successful Construction

A fresh controlled attempt restarted from Cycle 1.

Final accepted construction facts:

```text
LONG_200_ATTEMPT_2_ACCEPTED_CYCLES:
100

LONG_200_EXPECTED_OCCURRENCES:
200

LONG_200_USER_OCCURRENCES:
100

LONG_200_ASSISTANT_OCCURRENCES:
100

BATCH_REVIEWS:
PASS

INVALIDATING_FLAGS:
NONE

ABORTED_ATTEMPT_1_INCLUDED:
false
```

All 100 accepted cycles were accounted for by contemporaneous manual construction records.

## 13. Long-200 Binding Confirmation

The post-construction binding confirmation established:

```text
CONSTRUCTION_COMPLETED:
true

TARGET_CHAT_CONTINUITY_CONFIRMED:
true

UNIQUE_FIXTURE_IDENTIFICATION_CONFIRMED:
true

EXACT_RUNTIME_LOCATOR_AVAILABLE_TO_OPERATOR:
true

RAW_LOCATOR_PERSISTED_IN_EVIDENCE:
false

FROZEN_LEDGER_UNCHANGED:
true

CANDIDATE_OBSERVATION_USED_FOR_REPAIR:
false

ABORTED_ATTEMPT_1_EXCLUDED:
true
```

Result:

```text
LONG_200_FIXTURE:
DESIGNATED

LONG_200_GROUND_TRUTH:
ESTABLISHED
```

## 14. Ground Truth Acceptance Matrix

| Acceptance condition | Long-100 | Long-200 |
|---|---:|---:|
| Source Type fixed as Standard | PASS | PASS |
| Exact expected count frozen before Discovery | 100 | 200 |
| Exact distinct occurrence count | 100 | 200 |
| Deterministic ordinal / alias ledger | PASS | PASS |
| Complete role rule | PASS | PASS |
| Controlled cycle provenance | 50 cycles | 100 cycles |
| Invalidating ambiguity in accepted attempt | none | none |
| Failed / aborted attempts excluded | PASS | PASS |
| Unique Runtime fixture binding | PASS | PASS |
| Raw locator persisted | NO | NO |
| Candidate DOM used to repair oracle | NO | NO |
| Frozen ledger modified after observation | NO | NO |
| Formal Ground Truth | ESTABLISHED | ESTABLISHED |

## 15. Existing Long Conversation

The previously available existing long Conversation remained:

```text
EXISTING_LONG_CONVERSATION_ROLE:
SUPPLEMENTARY_ONLY
```

Its approximate size and operator recollection could not independently establish the exact full occurrence ledger required for Formal Ground Truth.

It did not replace Long-100 / Long-200.

## 16. Discovery Entry Gate

After both manual fixtures were accepted:

```text
LONG_100_GROUND_TRUTH:
ESTABLISHED

LONG_200_GROUND_TRUTH:
ESTABLISHED

TASK_003_DISCOVERY_ENTRY:
AUTHORIZED
```

Only at this point could TV-005 / TV-006 candidate observation begin.

## 17. Candidate Separation

Even after fixture acceptance, the runtime Discovery process was prohibited from using Ground Truth to steer acquisition.

The required sequence remained:

```text
candidate observation
-> candidate-only classification
-> freeze
-> Ground Truth comparison
```

Construction provenance and runtime completeness remained separate concerns.

## 18. Privacy Boundary

Construction / binding Evidence persisted only safe values such as:

- fixture aliases;
- cycle / occurrence aliases;
- ordinals;
- roles;
- counts;
- accepted / invalid flags; and
- fixed safe status codes.

The following remained Runtime-only or unpersisted:

- raw synthetic prompt;
- raw Assistant response;
- raw Title;
- URL / pathname / CID;
- tab identifier;
- runtime Message IDs;
- DOM / HTML;
- credentials / tokens / cookies.

## 19. Verification Code Boundary

Fixture construction itself intentionally did **not** use Message-enumeration code to establish Ground Truth.

The only code allowed at the construction / Ground Truth boundary was schema / ledger validation that operated on safe aliases, ordinals, roles, counts, and booleans. Message DOM enumeration was deferred until after the Discovery Entry gate.

A representative deterministic ordinal mapping used by the ledger can be expressed as:

```javascript
function occurrenceForCycle(cycle) {
  if (!Number.isInteger(cycle) || cycle < 1) {
    throw new Error("Invalid cycle");
  }

  const userOrdinal = cycle * 2 - 1;
  const assistantOrdinal = cycle * 2;

  return {
    cycle,
    userOrdinal,
    assistantOrdinal,
    userAlias: `M${String(userOrdinal).padStart(3, "0")}`,
    assistantAlias: `M${String(assistantOrdinal).padStart(3, "0")}`
  };
}
```

In formal Evidence the fixture prefix (`L100-` / `L200-`) was fixed by the frozen ledger; no runtime Message body was needed for this mapping.

## 20. Final Integrated Status

```text
TASK_003_FIXTURE_CONSTRUCTION_ARCHITECTURE:
OUT_OF_BAND_MANUAL_CONTROLLED

LONG_100_FIXTURE:
DESIGNATED

LONG_100_GROUND_TRUTH:
ESTABLISHED

LONG_200_ATTEMPT_1:
INVALIDATED_AND_EXCLUDED

LONG_200_ATTEMPT_2:
ACCEPTED

LONG_200_FIXTURE:
DESIGNATED

LONG_200_GROUND_TRUTH:
ESTABLISHED

EXISTING_LONG_CONVERSATION_ROLE:
SUPPLEMENTARY_ONLY

CANDIDATE_DERIVED_GROUND_TRUTH:
NO

TASK_003_DISCOVERY_ENTRY:
AUTHORIZED
```
