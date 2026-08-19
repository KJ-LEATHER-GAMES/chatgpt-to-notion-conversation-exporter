# TASK-003 Manual Discovery Scope and Safety Plan

## 1. Document Status

- Integrated document date: 2026-08-19
- Project: ChatGPT to Notion Conversation Exporter
- Task: TASK-003 Long Conversation / Completeness Spike
- Related validations: TV-005, TV-006
- Related primary risk: RISK-002
- Document role: retrospective integration of the decision to stop pursuing Codex-controlled fixture construction and proceed with controlled manual fixture construction / manual DOM discovery
- Historical Evidence replacement: **NO**
- Production implementation: **OUT OF SCOPE**
- Minimal PoC: **NOT YET STARTED at the end of the covered period**

This document consolidates the planning and safety boundary that governed TASK-003 from the construction-tooling architecture decision through the end of manual Discovery. Historical Evidence remains authoritative for the exact state of each earlier attempt; this document provides the higher-level integrated contract used to proceed safely.

## 2. Source-of-Truth Traceability

TASK-003 remains governed by the repository Source of Truth without semantic change.

### Product Requirements

- `FR-007`: recapture the whole ChatGPT Conversation even for differential updates.
- `FR-008`: when lazy loading exists, perform the required loading operations, validate acquisition completeness, and do not save when completeness cannot be confirmed.
- `NFR-001`: Fail Closed when DOM completeness or other safety conditions cannot be confirmed.
- `NFR-002`: avoid Silent Data Loss and Silent Duplicate Append.
- `NFR-003`: do not persist tokens or Conversation bodies in logs.
- `NFR-007`: approximately 200 Messages is the standard performance / validation target, not a strict SLA.

### ADR

- `ADR-005`: acquire the whole ChatGPT Conversation before applying the Notion-side diff.
- `ADR-006`: Fail Closed when required consistency cannot be established.

### Technical Validation

- `TV-005 Long Conversation Lazy Loading`
  - prepare 100 / 200 Message-class fixtures;
  - verify acquisition including the top and bottom;
  - compare the captured result with the independently established fixture oracle.
- `TV-006 Completeness Signal`
  - define a safe candidate-only condition for deciding whether the full Conversation has been acquired;
  - an incomplete observation must not be misclassified as Complete.

### TASK-003 Backlog Exit

```text
TASK-003 Long Conversation / Completeness Spike
Refs: TV-005, TV-006
Risk: RISK-002
Exit: 200 Message級で完全取得判定が成立
```

No Requirement, ADR, Acceptance Test, Risk, Technical Validation Plan, or Backlog semantics were changed by the manual approach.

## 3. Starting Problem

TASK-003 originally needed exact controlled long fixtures before TV-005 / TV-006 Discovery could begin.

The required oracle could not be manufactured from the same runtime candidates that TV-005 / TV-006 were supposed to validate. In particular, the following were prohibited as construction or Ground Truth sources:

- mounted Message count;
- Conversation container count;
- scroll metrics;
- captured runtime union;
- runtime Message identity inventory;
- first/last Message candidates discovered by traversal; and
- a candidate Completeness Signal.

Therefore fixture construction required independent provenance.

Early Codex / Chrome-control construction attempts developed increasingly strict Send-lifecycle and observer contracts. Those reviews established a real safety result: the current automation path could not positively prove the required exact construction lifecycle without unresolved circularity / observer-continuity problems.

The resulting architecture review concluded that solving autonomous ChatGPT message submission was not a formal requirement of TASK-003.

## 4. Architecture Decision

The adopted fixture-construction architecture was:

```text
TASK_003_FIXTURE_CONSTRUCTION_ARCHITECTURE:
OUT_OF_BAND_MANUAL_CONTROLLED
```

Supporting decisions:

```text
SEND_LIFECYCLE_CHARACTERIZATION_FORMAL_NECESSITY:
TOOLING_SPECIFIC

CHROME_CONTROL_FIXTURE_CONSTRUCTION_FORMAL_REQUIREMENT:
NO

TASK_003_FIXTURE_PRODUCTION_OBJECTIVE:
EXACT_CONTROLLED_FIXTURE_PROVENANCE

COMBINED_ORACLE_TASK_003_ROLE:
NO_LONGER_TASK_003_BLOCKER

SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED:
DEFERRED

ATTEMPT_4_READINESS:
SUPERSEDED_FOR_TASK_003
```

### Why the manual architecture was selected

The manual path preserved the formal requirements while removing the automation-specific blocker:

- exact expected occurrence count could be established before candidate observation;
- one human operator could positively confirm each controlled User / Assistant cycle;
- a contemporaneous safe ledger could preserve occurrence provenance;
- ambiguity could invalidate the attempt immediately;
- candidate DOM observation remained strictly separated from the oracle; and
- raw Conversation content / identifiers did not need to be persisted.

The decision did **not** declare the earlier automation work incorrect. It classified that work as tooling-specific and disproportionate to the formal TASK-003 objective after its blockers were characterized.

## 5. Manual Construction Provenance Model

The governing construction-side proof model became:

```text
MANUAL_CONSTRUCTION_PROVENANCE_MODEL:
CONTEMPORANEOUS_CYCLE_LEDGER
```

The proof obligation was not:

> later inspect the Conversation and verify that it appears to contain the expected number of Messages.

It was:

> contemporaneously establish that exactly the accepted controlled User / Assistant cycles occurred in order, with no count-affecting ambiguity, and freeze that provenance before TV-005 / TV-006 candidate observation.

### Accepted cycle relation

For cycle `n`:

```text
User occurrence      -> ordinal 2n - 1
Assistant occurrence -> ordinal 2n
```

For Long-100 this yields 50 accepted cycles / 100 expected occurrences.

For Long-200 this yields 100 accepted cycles / 200 expected occurrences.

## 6. Actor Separation

### Human operator

The human operator was responsible for:

- operating exactly one designated construction target;
- intentionally issuing exactly one User submission per accepted cycle;
- positively observing the intended submission lifecycle;
- positively observing one corresponding Assistant completion;
- recording the cycle outcome contemporaneously;
- reporting any ambiguity immediately; and
- avoiding retries, regenerate, edit, branch, or count-repair behavior.

### Repository / review side

The review side could:

- define and freeze the alias / ordinal / role ledger;
- validate safe cycle records;
- verify deterministic mappings and totals;
- review provenance consistency; and
- create Evidence from safe operator attestations.

It could not use Message DOM or runtime candidate material to create or repair construction provenance.

## 7. Construction Fail Closed Boundary

Any event that could make the exact occurrence count or visible sequence ambiguous invalidated the controlled attempt.

Invalidating classes included:

- uncertain Send count;
- possible duplicate submission;
- uncertain Assistant generation/completion;
- unexpected additional response;
- regenerate;
- edit;
- branch creation / switching;
- interrupted generation where occurrence semantics were uncertain;
- wrong-chat risk;
- browser state ambiguity affecting the occurrence relation; and
- UI states such as version / branch indications that made the accepted visible sequence ambiguous.

No current-DOM count, scrolling, or later runtime identity inventory could repair such ambiguity.

## 8. Fixture / Ground Truth Gate

Manual Discovery was blocked until both formal fixtures satisfied the independent Ground Truth acceptance contract.

Mandatory properties included:

- fixed safe fixture alias;
- Source Type fixed as Standard;
- exact expected occurrence count;
- exact distinct occurrence count;
- deterministic ordinal / role ledger;
- first and last safe aliases;
- candidate-independent construction provenance;
- unique Runtime-only fixture binding;
- oracle freeze before candidate observation; and
- no raw locator / Message content persistence.

Only after Ground Truth was accepted could TV-005 / TV-006 Discovery begin.

## 9. Manual Discovery Scope

After Ground Truth establishment, the manual Discovery scope was limited to determining:

### TV-005

How can unmounted Messages be made observable and accumulated despite virtualization / mount-unmount behavior?

Observed candidate families included:

- initial mounted subset;
- staged traversal;
- run-local runtime identity union;
- Message ordinal progression;
- top / bottom geometry;
- scroll height / position;
- possible loading UI / sentinels / metadata; and
- reload reproducibility.

### TV-006

Can a runtime-only relation safely distinguish a Complete candidate from an incomplete / unknown observation without using fixture Ground Truth?

Candidate families included:

- boundary reach;
- ordinal continuity / gaps;
- identity consistency;
- convergence / no-new-ID observations;
- virtualization state;
- scroll geometry; and
- missing / contradictory candidate behavior.

## 10. Candidate vs Ground Truth Separation

The mandatory evaluation order was:

```text
Runtime observation
  -> run-local acquisition state
  -> candidate-only completeness classification
  -> freeze candidate classification
  -> independent Ground Truth comparison
```

Forbidden shortcuts included:

```text
capturedCount == expectedCount -> Complete
unionCount == expectedCount    -> Complete
maxOrdinal == expectedCount    -> Complete
```

The expected 100 / 200 counts were validation oracles only. They were never loading stop conditions or runtime self-approval inputs.

## 11. Runtime Identity Boundary

TASK-001 established that a stable observed runtime Message identity could deduplicate remounts during one runtime scan.

For TASK-003 the interpretation remained narrow:

- `data-message-id`: runtime capture / dedup identity;
- `data-turn-id`: cross-check relation;
- `conversation-turn-N`: ordinal / ordering material;
- role: `data-message-author-role`.

The runtime identity was **not** treated as a canonical persistent OpenAI Message ID.

## 12. Discovery Safety Rules

The following rules governed every manual Discovery run:

1. Do not modify the fixture.
2. No Message submit / regenerate / edit / branch.
3. No Ground Truth count as traversal input.
4. No exact observed gap used as a navigation target during generic recovery.
5. Preserve runtime IDs in memory only.
6. Persist only safe summarized metadata.
7. Fail Closed on identity / ordinal / cardinality contradictions.
8. Do not classify Complete from one stable-looking snapshot.
9. Do not classify Complete from one no-new-ID observation.
10. Do not classify Complete merely because top and bottom ordinals have both appeared.
11. Keep operator interventions explicitly recorded in Safety Fields.

## 13. Visibility Safety Discovery

A major Discovery result required promotion into the safety contract.

Long-100 observation showed:

```text
hidden state
-> programmatic scroll geometry advanced
-> mounted Message range did not progress
```

Then, without scrolling:

```text
document.visibilityState: hidden -> visible
scrollTop: unchanged
mounted Message range: changed materially
```

The page-focus flag remained false, therefore `document.hasFocus()` was not adopted as a required condition.

The resulting traversal precondition became:

```text
document.visibilityState === "visible"
AND
document.hidden === false
```

If visibility becomes invalid during a formal traversal:

```text
PAGE_HIDDEN
-> BLOCKED / UNKNOWN
-> COMPLETE_CANDIDATE prohibited
```

### Verification helper used

```javascript
function visibleNow() {
  return (
    document.visibilityState === "visible" &&
    document.hidden === false
  );
}
```

This helper later became a hard gate before / after traversal steps and at capture time.

## 14. Formal Technical Baseline Emerging from Discovery

By the end of manual Discovery, the candidate method selected for qualification was:

```text
Precondition:
page visible

Start:
programmatic Top reset

Direction:
Top -> Bottom

Step:
20% of viewport height

Settle observation:
scrollTop
scrollHeight
clientHeight
full mounted ordinal array

Acquisition:
run-local runtime identity union

Cross-check:
ordinal / data-turn-id / role / DOM order

Stop:
Bottom geometry candidate

Do not stop on:
expected count
union count
one no-new-ID snapshot
```

The 20% step was retained as a conservative Formal Technical Baseline, not a Production final value.

## 15. Privacy and Security Boundary

Allowed persistent Evidence:

- safe fixture aliases;
- cycle aliases;
- ordinals;
- roles;
- counts;
- booleans;
- safe fixed status / error codes;
- scroll geometry;
- mounted ordinal lists / compressed ranges;
- candidate classifications; and
- operator Safety Fields.

Prohibited persistent Evidence:

- raw User prompts;
- raw Assistant responses;
- raw personal Conversation content;
- raw Title;
- URL / pathname / Conversation ID;
- tab identifiers;
- raw runtime Message IDs;
- raw `data-turn-id` values;
- raw DOM / HTML;
- browser credentials / tokens / cookies; and
- authorization material.

## 16. Source-of-Truth Impact

```text
REQUIREMENT_CHANGE_REQUIRED: NO
ADR_CHANGE_REQUIRED: NO
RISK_CHANGE_REQUIRED: NO
ACCEPTANCE_TEST_CHANGE_REQUIRED: NO
TECHNICAL_VALIDATION_PLAN_CHANGE_REQUIRED: NO
BACKLOG_CHANGE_REQUIRED: NO
```

## 17. End State Covered by This Plan

By the end of the covered manual work:

```text
TASK_003_FIXTURE_CONSTRUCTION_ARCHITECTURE:
OUT_OF_BAND_MANUAL_CONTROLLED

LONG_100_GROUND_TRUTH:
ESTABLISHED

LONG_200_GROUND_TRUTH:
ESTABLISHED

TV_005_DISCOVERY:
COMPLETE

TV_006_DISCOVERY:
COMPLETE

TV_005_CANDIDATE_DECISION:
ADOPTED

TV_006_CANDIDATE_DECISION:
ADOPTED

LONG_200_RELOAD_REPRODUCIBILITY:
PASS

MANUAL_DOM_DISCOVERY:
COMPLETE

TV_005_FINAL_VERDICT:
NOT_SET

TV_006_FINAL_VERDICT:
NOT_SET

MINIMAL_POC:
NEXT
```

## 18. Historical Evidence Relationship

This integrated document should be read together with the historical chain, including at least:

- `TASK-003-scope-plan.md`
- `TASK-003-fixture-ground-truth-preparation.md`
- `TASK-003-existing-long-conversation-oracle-qualification.md`
- `TASK-003-long-100-fixture-construction-ground-truth-completion.md`
- `TASK-003-long-100-construction-failure-review.md`
- send-lifecycle characterization Evidence
- `TASK-003-construction-send-lifecycle-combined-oracle-construction-tooling-architecture-review.md`
- subsequent manual-construction attestations and manual Discovery logs

Historical statuses are not rewritten by this consolidation.
