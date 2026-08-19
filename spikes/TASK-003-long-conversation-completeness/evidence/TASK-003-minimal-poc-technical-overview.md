# TASK-003 Minimal PoC Technical Overview

## Status

- Document date: 2026-08-20
- Task: TASK-003 Long Conversation / Completeness Spike
- Scope: Minimal PoC / deterministic Self-test technical explanation
- Audience: repository maintainer / future implementer / non-specialist reviewer
- New browser observation: **NO**
- New DOM Discovery: **NO**
- New implementation: **NO**

Current PoC result:

```text
MINIMAL_POC_RESULT: PASS
SELF_TEST_RESULT: PASS
SELF_TEST_ASSERTION_GROUPS: 47
CANDIDATE_DECISION_CONTRADICTION: NONE_FOUND
```

## 1. Purpose of This Document

This document explains what the TASK-003 Minimal PoC and Self-test actually do.

The most important boundary is:

```text
Manual DOM Discovery
= real Chrome / real ChatGPT observations

Minimal PoC
= the adopted Discovery contract expressed as code

Self-test
= deterministic verification using synthetic / fake browser objects
```

The Minimal PoC round itself did **not** access Chrome or a live ChatGPT Conversation.

The real Long-100 / Long-200 browser validation had already been completed during Manual DOM Discovery.

## 2. Why a Minimal PoC Was Needed

Manual Discovery established that long ChatGPT Conversations are virtualized.

A Conversation can contain far more Messages than are mounted in the DOM at one time.

Therefore a reliable acquisition method cannot assume:

```text
currently mounted Messages
==
full Conversation
```

Manual Discovery established a traversal and completeness relation.

The Minimal PoC had one narrow objective:

> Can the already-adopted TV-005 traversal relation and TV-006 completeness relation be represented as deterministic code without using Ground Truth to self-approve runtime completeness?

The PoC was not intended to rediscover the DOM.

It was intended to convert proven observations into an implementation contract.

## 3. Three Evidence Layers

TASK-003 should be understood as three distinct layers.

### Layer A — Live browser Evidence

Manual DOM Discovery used real Chrome / ChatGPT fixtures.

It established facts such as:

- only a subset of Messages may be mounted initially;
- mounted ranges change as the page is traversed;
- the Long-100 incomplete state could contain both Top and Bottom while still containing an internal ordinal gap;
- a visible-only 20%-viewport traversal recovered the complete Long-100 sequence;
- the same baseline acquired Long-200 ordinals 1-200;
- the Long-200 result reproduced after reload; and
- union count reached 200 before Bottom, proving that count must not be a runtime stop condition.

### Layer B — Minimal PoC

The PoC translates the adopted relation into JavaScript functions.

It contains browser-facing code paths, but in the Self-test they are executed against synthetic objects rather than a real browser.

### Layer C — Deterministic Self-test

The Self-test creates fake document / scroller / Message objects and verifies the PoC contract under controlled positive and negative cases.

This allows the implementation logic to be tested repeatedly without depending on live ChatGPT UI state.

## 4. PoC Files

```text
spikes/TASK-003-long-conversation-completeness/
  poc/
    tv005-tv006-long-conversation-poc.mjs
    tv005-tv006-long-conversation-poc.selftest.mjs
  evidence/
    TASK-003-minimal-poc.md
```

Responsibilities:

### `tv005-tv006-long-conversation-poc.mjs`

Contains the Minimal PoC implementation.

It includes:

- mounted Message extraction logic;
- observation validation;
- run-local identity accumulation;
- ordinal-gap detection;
- completeness classification;
- traversal termination;
- 20% step computation;
- scroll-container validation;
- DOM-settle handling;
- safe runtime summary creation; and
- post-classification Ground Truth comparison.

### `tv005-tv006-long-conversation-poc.selftest.mjs`

Contains deterministic contract tests.

It verifies:

- positive complete cases;
- remount deduplication;
- Fail Closed cases;
- identity consistency failures;
- ordinal continuity failures;
- traversal / settle failures;
- visibility failures;
- anti-self-approval cases; and
- a synthetic browser-facing Top-to-Bottom traversal.

### `TASK-003-minimal-poc.md`

Records:

- the frozen contract;
- the files created;
- Self-test coverage;
- PoC result; and
- the boundary between this PoC and prior live Manual Discovery.

## 5. Frozen DOM / Acquisition Contract

The PoC codifies the already-adopted relation.

Message unit:

```text
section[data-testid^="conversation-turn-"]
```

Ordinal:

```text
data-testid = conversation-turn-N
```

Run-local acquisition / dedup identity:

```text
data-message-id
```

Cross-check identity:

```text
data-turn-id
```

Role:

```text
data-message-author-role
```

Important distinction:

```text
data-message-id
```

is used as a run-local acquisition identity.

It is not Ground Truth and it is not a persisted Product identity.

## 6. Traversal Contract

The validated Technical Validation baseline is:

```text
visibility:
page must remain visible

start:
Top

direction:
Top -> Bottom

step:
20% current viewport height

settle signature:
scrollTop
+ scrollHeight
+ clientHeight
+ full mounted ordinal array

normal stop:
Bottom geometry candidate

failure stop:
BLOCKED
```

The PoC intentionally does **not** terminate because:

```text
union count reached expected count
no new IDs appeared once
union stopped growing locally
mounted count became stable
scrollHeight became stable alone
```

This is central to TV-005 and TV-006 safety.

## 7. Core PoC Processing Flow

The implementation is structured approximately as:

```text
extractMountedObservation()
        |
        v
validateMountedObservation()
        |
        v
mergeIntoRunAccumulator()
        |
        v
findOrdinalGaps()
        |
        v
classifyCandidate()
        |
        v
evaluateTraversalTermination()
        |
        v
summarizeRun()
        |
        v
freeze runtime candidate
        |
        v
compareWithGroundTruth()
```

Each stage has a separate responsibility.

## 8. `extractMountedObservation()`

Conceptual responsibility:

> Read the currently mounted Message units from a document-like object and convert them into an Evidence-safe observation structure.

The browser-facing implementation uses DOM relations corresponding to the adopted Message unit and attributes.

Typical information collected per mounted occurrence includes:

```text
ordinal
runtime Message identity
turn identity
role
DOM order
```

Raw Conversation Message bodies are not required for the completeness relation.

## 9. `validateMountedObservation()`

Conceptual responsibility:

> Decide whether the current mounted snapshot is structurally trustworthy enough to enter the accumulator.

Examples of invalid conditions:

```text
duplicate ordinal in one snapshot
duplicate runtime identity in one snapshot
runtime identity cardinality invalid
turn identity cardinality invalid
role cardinality invalid
unsupported role
DOM ordinal order contradiction
```

Invalid observations are not silently repaired.

They become Fail Closed material.

## 10. `mergeIntoRunAccumulator()`

Conceptual responsibility:

> Accumulate unique Message occurrences observed across multiple virtualized mounted windows.

Example:

```text
Snapshot A: 1,2,3
Snapshot B:   2,3,4
Snapshot C:       4,5
```

A correct run-local union becomes:

```text
1,2,3,4,5
```

The overlapping remounted Messages are deduplicated by stable run-local runtime identity.

The accumulator also cross-checks mappings such as:

```text
runtime ID -> ordinal
runtime ID -> turn ID
runtime ID -> role
ordinal -> runtime ID
turn ID -> runtime ID
```

Contradictory mappings fail closed.

## 11. `findOrdinalGaps()`

Conceptual responsibility:

> Detect missing ordinals inside the accumulated Conversation sequence.

Example:

```text
1,2,3,5,6
```

contains:

```text
gap = 4
```

This is a decisive completeness check.

The Long-100 live false-complete counterexample demonstrated why this matters:

```text
1-75,77-100
```

had Top, Bottom, first and last Message presence, but was still incomplete.

## 12. `classifyCandidate()`

Conceptual responsibility:

> Classify runtime completeness using candidate-only evidence.

The effective diagnostic vocabulary is:

```text
COMPLETE_CANDIDATE
INCOMPLETE
UNKNOWN
AMBIGUOUS
INCONSISTENT
BLOCKED
```

A result may become `COMPLETE_CANDIDATE` only when required conditions are satisfied.

Core positive conditions:

```text
page visible throughout
Top established
Bottom established
ordinal sequence begins at 1
strict ordinal continuity
runtime identity consistency
turn identity consistency
role consistency
DOM-order consistency
no rejected capture
no unresolved ambiguity / inconsistency
```

Important:

```text
expected count
```

is not an input to this runtime classifier.

## 13. `evaluateTraversalTermination()`

Conceptual responsibility:

> Decide whether traversal should stop.

Normal stop:

```text
Bottom reached
```

Failure stop:

```text
BLOCKED
```

The function intentionally does not stop because of:

```text
unionCount
expectedCount
newRuntimeIdentityCount
ordinalMax
```

This prevents circular approval.

A live Long-200 run demonstrated why this is necessary:

```text
union reached 200
before
Bottom was reached
```

The traversal correctly continued.

## 14. Ground Truth Separation

The Technical Spike has an independent expected fixture oracle.

However, Ground Truth is used only **after** runtime candidate classification is frozen.

Required order:

```text
runtime traversal
-> candidate-only classification
-> freeze candidate
-> Ground Truth comparison
```

Forbidden order:

```text
captured count == expected count
-> declare Complete
```

This prevents the validation fixture from teaching the runtime algorithm what answer it should produce.

## 15. What the Self-test Uses Instead of Chrome

The Self-test constructs synthetic JavaScript objects that behave like the subset of browser objects required by the PoC.

Examples include:

```text
fake document
fake scroller
fake conversation-turn sections
fake Message attributes
```

A simplified fake section can expose:

```text
data-testid
data-message-id
data-turn-id
data-message-author-role
```

without opening ChatGPT.

The synthetic scroller can change mounted ordinal windows based on `scrollTop`.

Example:

```text
Top:
1,2

scroll:
2,3

scroll:
3,4

scroll:
4,5
```

This allows the actual browser-facing traversal entry point to be exercised deterministically.

## 16. Synthetic Browser-facing Traversal

The Self-test includes a small end-to-end synthetic traversal.

It calls the PoC browser-facing traversal function using:

```text
fake document
+
fake scroller
```

rather than Chrome.

Expected result:

```text
Top established: true
Bottom established: true
distinct runtime union: 5
observed ordinal range: 1-5
ordinal gaps: 0
candidate: COMPLETE_CANDIDATE
```

This proves that the browser-facing orchestration and pure classifier can work together.

It does **not** prove the live ChatGPT DOM relation by itself.

That relation was already proven separately by Manual Discovery.

## 17. 47 Assertion Groups

The Self-test completed:

```text
PASS (47 assertion groups)
```

The number is best understood as a group count, not simply 47 individual `assert()` calls.

The groups cover several categories.

### Positive behavior

Examples:

- contiguous complete candidate;
- remount overlap deduplication;
- union convergence before Bottom does not terminate;
- synthetic Top-to-Bottom browser-facing traversal.

### Visibility Fail Closed

Examples:

- page hidden before traversal;
- page becomes hidden during settle.

### Completeness Fail Closed

Examples:

- missing Top;
- missing Bottom;
- first ordinal not 1;
- internal ordinal gap.

### Identity / consistency Fail Closed

Examples:

- duplicate ordinal;
- duplicate runtime identity;
- runtime ID changes ordinal;
- runtime ID changes turn ID;
- runtime ID changes role;
- ordinal maps to another runtime ID;
- turn ID maps to another runtime ID;
- DOM order contradiction.

### Structural / traversal Fail Closed

Examples:

- scroll container missing;
- scroll container ambiguous;
- scroll container identity changes;
- DOM settle timeout;
- no scroll progress before Bottom.

## 18. Anti-self-approval Tests

These are among the most important TV-006 tests.

The Self-test explicitly verifies that the following do not create Complete.

### ASA-001

```text
captured count == expected count
BUT
internal ordinal gap exists
```

Expected:

```text
not Complete
```

### ASA-002

```text
union reaches expected count
BUT
Bottom not reached
```

Expected:

```text
continue traversal
```

### ASA-003

```text
one no-new-ID observation
```

Expected:

```text
do not stop
```

### ASA-004

```text
repeated local no-new-ID convergence
```

Expected:

```text
do not use as completeness proof
```

### ASA-005

```text
first and last ordinals present
BUT
internal gap exists
```

Expected:

```text
not Complete
```

### ASA-006

```text
Top and Bottom established
BUT
internal gap exists
```

Expected:

```text
not Complete
```

These tests directly encode lessons from the live Long-100 / Long-200 validation.

## 19. Static Contract Tests

The Self-test also checks implementation boundaries.

Examples:

```text
classifier must not read expectedCount
classifier must not read unionCount
termination must not read expectedCount
termination must not read unionCount
termination must not read newRuntimeIdentityCount
termination must not read ordinalMax
browser traversal must not require document.hasFocus()
```

These tests reduce the risk that a future refactor silently reintroduces a forbidden self-approval rule.

## 20. What Was Actually Executed Locally

The local execution consisted of:

```powershell
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.mjs

node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs

node spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
```

Observed result:

```text
TASK-003 TV-005/TV-006 Minimal PoC self-test: PASS (47 assertion groups)
```

During these commands:

```text
Chrome access: NO
live ChatGPT access: NO
live DOM acquisition: NO
live Long-100 traversal: NO
live Long-200 traversal: NO
```

The test process ran under Node.js.

## 21. What the PoC Proves

The Minimal PoC + Self-test establishes:

1. the adopted Manual Discovery contract can be expressed as executable code;
2. the classifier can represent the required completeness states;
3. the traversal termination relation can exclude expected-count / union-count shortcuts;
4. the main observed and anticipated false-complete classes fail closed;
5. the runtime / Ground Truth separation can be preserved in code; and
6. the implementation does not require a Candidate Decision redesign.

Current result:

```text
CANDIDATE_DECISION_CONTRADICTION: NONE_FOUND
```

## 22. What the PoC Does Not Prove by Itself

The Node Self-test does not independently prove:

- that the current ChatGPT DOM still exposes the same mounted Message relation;
- that the current Chrome build behaves identically to the Manual Discovery environment;
- that the live Long-200 fixture can still be traversed today;
- that every viewport size behaves identically;
- that 20% is performance-optimal;
- that Project Chat has identical long-conversation behavior;
- that Production retry / timeout / recovery is safe; or
- that Notion writes are correctly blocked in Production.

Those claims require separate live / Production evidence where applicable.

The reason TASK-003 could still reach Final PASS is that the required live Evidence was already established before the Minimal PoC round.

## 23. Evidence Relationship

The overall proof structure is:

```text
Controlled Ground Truth
        |
        v
Manual DOM Discovery
(real Chrome / ChatGPT)
        |
        v
TV-005 / TV-006 Candidate Decision
        |
        v
Minimal PoC
(code representation)
        |
        v
Deterministic Self-test
(fake document / fake scroller)
        |
        v
TV-005 / TV-006 Final Review
        |
        v
TASK-003 Final Exit Review
```

No single layer replaces all other layers.

The strength of the TASK-003 result comes from their separation.

## 24. Why This Architecture Is Useful

Separating live browser observation from pure contract logic provides several benefits.

### Reproducibility

The Self-test can be run repeatedly without depending on:

- ChatGPT login state;
- live Conversation state;
- network timing;
- virtualization timing; or
- browser viewport position.

### Failure diagnosis

A failure can be classified more precisely.

For example:

```text
Manual live behavior changed
```

is different from:

```text
pure classifier regression
```

### Safety

Ground Truth cannot silently leak into runtime approval when the classifier and Ground Truth comparator are separate functions.

### Future implementation reuse

Production code can reuse the validated conceptual boundary:

```text
browser acquisition
vs
pure completeness classification
vs
post-classification validation / diagnostics
```

without turning the Phase 0 PoC itself into Production code.

## 25. Production Handoff Boundary

The Minimal PoC is validation code, not the finished Chrome extension implementation.

Production work still needs to decide:

- where the browser acquisition logic lives;
- how traversal is orchestrated;
- timeout / retry behavior;
- MutationObserver or equivalent lifecycle handling;
- user-visible errors;
- how unknown completeness blocks save;
- how Project Chat long-conversation support is handled; and
- how AT-007 / AT-008 are executed.

Production should reuse the validated contract, not blindly copy the PoC as final architecture.

## 26. Technical Summary

The Minimal PoC can be summarized as:

```text
Read currently mounted Message occurrences
        |
        v
Validate snapshot consistency
        |
        v
Accumulate unique run-local occurrences
        |
        v
Traverse Top -> Bottom at validated 20% baseline
        |
        v
Require full ordinal continuity and consistency
        |
        v
Fail Closed on unknown / ambiguous / inconsistent states
        |
        v
Freeze candidate-only result
        |
        v
Compare to independent Ground Truth only afterward
```

The Self-test validates this contract without Chrome.

Final result:

```text
MINIMAL_POC_RESULT: PASS
SELF_TEST_RESULT: PASS
SELF_TEST_ASSERTION_GROUPS: 47
TV_005_FINAL_VERDICT: PASS
TV_006_FINAL_VERDICT: PASS
TASK_003_FINAL_EXIT: PASS
```
