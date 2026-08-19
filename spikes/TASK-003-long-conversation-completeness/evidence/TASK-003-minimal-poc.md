# TASK-003 Long Conversation / Completeness Spike — Minimal PoC

## Status

- Date: 2026-08-19
- Scope: Phase 0 Minimal PoC + deterministic Self-test only
- Manual DOM Discovery: **COMPLETE before this round**
- TV-005 Candidate Decision: **ADOPTED / unchanged**
- TV-006 Candidate Decision: **ADOPTED / unchanged**
- `MINIMAL_POC_RESULT: PASS`
- `SELF_TEST_RESULT: PASS`
- TV-005 Final Verdict: **NOT SET**
- TV-006 Final Verdict: **NOT SET**
- TASK-003 Final Exit: **NOT SET**
- Production implementation: **none**
- New DOM Discovery: **none**
- Live Long-100 / Long-200 fixture execution in this PoC round: **not performed**

This round codifies the frozen TASK-003 manual-Discovery contract and proves it
with deterministic self-tests. It does not reopen candidate discovery or set a
Final Verdict.

## Review Basis

The effective implementation contract was taken from:

- `TASK-003-minimal-poc-readiness-and-handoff.md`
- `TASK-003-tv005-tv006-candidate-decision.md`
- `TASK-003-long-200-baseline-and-reproducibility-validation.md`

Repository conventions were compared with TASK-001 and TASK-002 Minimal PoC /
self-test assets.

## Created Files

```text
spikes/TASK-003-long-conversation-completeness/
  poc/
    tv005-tv006-long-conversation-poc.mjs
    tv005-tv006-long-conversation-poc.selftest.mjs
  evidence/
    TASK-003-minimal-poc.md
```

## Frozen Contract Codified

The PoC retains these adopted decisions without redesign:

```text
Source:
Standard Chat

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

Visibility:
document.visibilityState === "visible"
AND
document.hidden === false

Focus:
not required

Traversal:
programmatic Top -> Bottom

Formal validation step:
20% current viewport height

Settle signature:
scrollTop
+ scrollHeight
+ clientHeight
+ full ordered mounted ordinal array

Termination:
Bottom geometry candidate
or Fail-Closed BLOCKED state

Forbidden runtime control:
expected count
union count
no-new-ID sample
local union convergence
mounted count stability
scrollHeight stability alone

Completeness candidate:
Top
+ Bottom
+ ordinal union begins at 1
+ strict ordinal continuity
+ runtime identity consistency
+ turn identity consistency
+ role consistency
+ DOM order consistency
+ no rejected capture
+ no blocked / ambiguous / inconsistent state

Ground Truth:
post-classification oracle only

Fallback to Complete:
none
```

## PoC Architecture

The implementation keeps browser interaction and pure logic separate:

```text
extractMountedObservation()
-> validateMountedObservation()
-> mergeIntoRunAccumulator()
-> findOrdinalGaps()
-> classifyCandidate()
-> evaluateTraversalTermination()
-> summarizeRun()
-> freeze candidate
-> compareWithGroundTruth()
```

Supporting browser-facing functions codify:

- unique scroll-container resolution;
- scroll-container identity continuity;
- 20% viewport stepping;
- sampled visible-DOM settle;
- no-progress Fail Closed behavior; and
- Evidence-safe snapshot summaries without raw runtime identities.

## Diagnostic State Contract

The PoC returns only the adopted diagnostic vocabulary:

```text
COMPLETE_CANDIDATE
INCOMPLETE
UNKNOWN
AMBIGUOUS
INCONSISTENT
BLOCKED
```

Only `COMPLETE_CANDIDATE` is eligible for positive Ground Truth comparison.

## Deterministic Self-test Coverage

The self-test executes without a live Long-200 fixture and covers 47 assertion
groups.

### Required positive cases

- contiguous complete candidate;
- remount overlap deduplicated by stable runtime identity;
- union convergence before Bottom does not terminate traversal; and
- browser-facing synthetic Top-to-Bottom traversal using the 20% baseline.

### Required Fail-Closed cases

- page hidden before traversal;
- page becomes hidden during settle;
- missing Top;
- missing Bottom;
- internal ordinal gap;
- first observed ordinal not 1;
- duplicate ordinal in one snapshot;
- duplicate runtime identity in one snapshot;
- runtime ID -> different ordinal;
- runtime ID -> different turn ID;
- runtime ID -> different role;
- ordinal -> different runtime ID;
- turn ID -> different runtime ID;
- DOM ordinal-order contradiction;
- runtime Message identity cardinality invalid;
- turn identity cardinality invalid;
- role cardinality invalid;
- unsupported role;
- scroll container missing;
- scroll container ambiguous;
- scroll container changes mid-run;
- DOM settle timeout; and
- no scroll progress before Bottom.

### Mandatory anti-self-approval cases

- captured count equals expected count while an ordinal gap exists;
- run-local union reaches expected count before Bottom;
- one no-new-ID sample;
- repeated local no-new-ID convergence;
- first and last ordinal both present with an internal gap; and
- Top and Bottom both present with an internal gap.

The self-test also verifies that:

- the classifier source does not read `expectedCount` or `unionCount`;
- the traversal termination function does not read `expectedCount`,
  `unionCount`, `newRuntimeIdentityCount`, or `ordinalMax`;
- the browser traversal does not use `document.hasFocus()`;
- the browser traversal does not use expected count or union count as a stop
  condition;
- run-local accumulators do not share identity state; and
- Ground Truth mismatch cannot retroactively change the frozen runtime
  candidate.

## Synthetic Browser-facing Traversal Test

A deterministic fake document/scroller was used to exercise the browser-facing
PoC entry point without opening a real ChatGPT Conversation.

The synthetic mounted windows overlap across the traversal and preserve stable
run-local identities. The test confirms:

```text
Top established: true
Bottom established: true
distinct runtime union: 5
observed ordinal range: 1-5
ordinal gaps: 0
candidate: COMPLETE_CANDIDATE
```

The returned safe summary was checked to ensure synthetic runtime and turn
identity strings were not serialized.

This is a code-contract test. It is not new TASK-003 DOM Discovery and does not
replace the already-established Long-200 manual baseline / reload Evidence.

## Self-test Execution Result

Commands:

```text
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.mjs
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
node spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
```

Result:

```text
TASK-003 TV-005/TV-006 Minimal PoC self-test: PASS (47 assertion groups)
```

Both JavaScript syntax checks passed.

## Candidate-decision Contradiction Check

```text
CANDIDATE_DECISION_CONTRADICTION:
NONE_FOUND
```

The PoC did not require changing any frozen decision to pass its tests.
No Candidate Decision reopening is required from this result.

## Ground Truth Separation

Runtime classification and validation oracle remain explicitly ordered:

```text
runtime observation
-> candidate-only classification
-> candidate freeze
-> Ground Truth comparison
```

`compareWithGroundTruth()` may compare the frozen candidate's runtime summary
with the independently frozen expected distinct occurrence count. Its result
cannot modify traversal, repair a gap, or promote a non-complete runtime state.

## Scope / Deferred Work Integrity

Not implemented:

- 40/60/80% step optimization;
- viewport variation;
- performance timing or optimization;
- adaptive scrolling;
- MutationObserver Production hardening;
- generalized browser lifecycle handling;
- Project Chat long-conversation coverage;
- maximum Conversation size;
- Notion integration;
- Production UI;
- Production retry / timeout / recovery policy; or
- Phase 1 adapter / parser implementation.

## Privacy / Security Check

Checks on the new PoC and self-test:

- raw HTTP/HTTPS URL literal scan: PASS / none;
- UUID-like literal scan: PASS / none;
- credential/cookie/token/secret assignment scan: PASS / none;
- trailing-whitespace scan: PASS / none;
- Evidence-safe traversal summary contains no runtime Message ID or turn ID;
- raw DOM / HTML dump persistence: none;
- raw Conversation body persistence: none; and
- real ChatGPT fixture metadata persistence: none.

A Git repository was not present in the assembled execution workspace, so
`git diff --check` is not reported for this generated package. Direct syntax,
whitespace, and restricted-value scans were used instead.

## Requirement / ADR / Risk Impact

- Requirements: **no change**.
- ADRs: **no change**.
- Acceptance Tests: **no change**.
- Technical Validation Plan: **no change**.
- Development Backlog: **no change**.
- RISK-002: remains the relevant TASK-003 risk; Final Review is still required.
- Production semantics: **no change**.

## Status After Minimal PoC

```text
MANUAL_DOM_DISCOVERY:
COMPLETE

LONG_100_METHOD_GATE:
PASS

LONG_200_BASELINE:
PASS

LONG_200_RELOAD_REPRODUCIBILITY:
PASS

TV_005_CANDIDATE_DECISION:
ADOPTED

TV_006_CANDIDATE_DECISION:
ADOPTED

MINIMAL_POC:
COMPLETE

MINIMAL_POC_RESULT:
PASS

SELF_TEST_RESULT:
PASS

TV_005_FINAL_VERDICT:
NOT_SET

TV_006_FINAL_VERDICT:
NOT_SET

TASK_003_FINAL_EXIT:
NOT_SET
```

## Recommended Next Action

Proceed to:

```text
TASK-003 Final Review — TV-005 + TV-006 + TASK-003 Final Exit
```

The Final Review should consume the Source-of-Truth documents, the integrated
TASK-003 manual Evidence set, this Minimal PoC source, and the PASS self-test
result. Do not reopen deferred optimization unless the Final Review finds a
direct contradiction.
