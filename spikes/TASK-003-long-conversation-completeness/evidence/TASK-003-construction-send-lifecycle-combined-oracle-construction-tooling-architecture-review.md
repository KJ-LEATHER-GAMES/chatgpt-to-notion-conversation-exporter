# TASK-003 Construction Send Lifecycle Characterization — Combined Oracle / Construction Tooling Architecture Review

## Status

- Review type: Architecture / Decision Review only
- Browser mutation: none
- Fixture construction: not performed
- Tool installation or implementation: none
- Historical Evidence changes: none
- TASK-003 Discovery: not started
- TV-005 Verdict: not set
- TV-006 Verdict: not set

This review separates the formal TASK-003 objective from the particular Codex / Chrome-control construction path. The reviewed Evidence supports replacing that blocked construction path with an out-of-band manual controlled construction architecture. This Decision does not itself construct or designate either long fixture.

## Review Basis

Repository-current sources reviewed:

- `AGENTS.md`
- `docs/01_product-requirements.md`
- `docs/02_adr.md`
- `docs/03_risk-register.md`
- `docs/04_acceptance-tests.md`
- `docs/05_technical-validation-plan.md`
- `docs/06_development-backlog.md`
- TASK-003 Evidence through `TASK-003-construction-send-lifecycle-h2-safe-test-surface-capability-review.md`, in chronological order

The current Backlog defines TASK-003 as the Long Conversation / Completeness Spike, references TV-005 and TV-006, associates RISK-002, and requires a successful completeness judgment at approximately 200 Messages. TV-005 requires 100- and 200-Message-class fixtures, top and bottom coverage, and agreement with fixture expected count. TV-006 requires that an incomplete state is not misclassified as Complete.

The relevant product boundary remains FR-007, FR-008, NFR-001, NFR-002, and NFR-007; ADR-005 and ADR-006; and the technical-feasibility scope represented by AT-007 and AT-008. None requires Codex itself to create the long fixtures or autonomously operate the ChatGPT Send action.

## Historical Capability-review Integrity

The following historical findings remain unchanged:

- H2 safe test surface candidate: none established
- H2 runtime capability: not established
- Interactive handoff mechanism: none established
- Interactive handoff capability: not established
- Characterization C1 readiness: blocked
- Send-action candidate relation: insufficient Evidence
- Action execution acknowledgement contract: adopted
- Submission success signal: insufficient Evidence
- Attempt 4 readiness on the Chrome-control path: blocked
- Long-100 completed cycles: 0
- Long-100 fixture and Ground Truth: not established

The prior reviews remain valid Evidence about the limitations of the current automation path. This review neither reinterprets those attempts as successful nor weakens their Fail Closed outcomes.

## Formal Necessity Separation

Four layers are distinct:

1. **Formal TASK-003 requirements** concern long-conversation loading, completeness judgment, expected-count agreement, boundary coverage, and false-complete prevention.
2. **Technical Spike Ground Truth requirements** concern exact, independent, pre-observation fixture oracles.
3. **Fixture-construction provenance requirements** concern proving that the controlled fixture actually contains the frozen sequence without ambiguity.
4. **Current Codex / Chrome-control tooling requirements** concern how one particular automation path identifies Send, dispatches it, and observes the resulting lifecycle.

The Send lifecycle work is required only by the fourth layer. The first three layers require exact accepted occurrences and independent provenance, but do not prescribe the actor or browser-control mechanism that creates them.

## Formal Necessity Matrix

| Requirement / material | Formal TASK-003 | Ground Truth / provenance | Current tooling only | Not required |
|---|---:|---:|---:|---:|
| Automated Send-action identification | No | No | Yes | — |
| Browser-driven Send dispatch | No | No | Yes | — |
| Independent Send-action oracle | No | No | Yes, for autonomous Chrome-control Send selection | — |
| Persistent event observer | No | No | Yes, for the reviewed Combined Oracle implementation | — |
| Automated submission lifecycle signal | No | No | Yes, for automated occurrence accounting | — |
| Automated Assistant-completion lifecycle signal | No | No | Yes, for automated occurrence accounting | — |
| Fifty-cycle automated construction | No | No | Yes, for the abandoned automation approach | Automation itself is not required |
| Exact confirmation of each User occurrence | No | Yes | No | — |
| Exact confirmation of each corresponding Assistant completion | No | Yes | No | — |
| Candidate-independent exact fixture ledger | No | Yes | No | — |
| Exact expected Message count | Yes | Yes | No | — |
| First / last boundary oracle | Yes | Yes | No | — |
| Complete per-ordinal role ledger | No | Yes | No | — |
| Exact distinct occurrence count | No | Yes | No | — |
| Frozen pre-observation provenance | No | Yes | No | — |
| Unique Runtime-only fixture binding | Supporting necessity | Yes | No | — |

“Formal TASK-003: No” does not make a Ground Truth item optional. It means the item is a Technical Spike oracle or provenance control rather than an independently stated TV-005 / TV-006 pass criterion.

## Original Fixture / Ground Truth Contract

A formally usable Long-100 or Long-200 fixture still requires:

- exact expected Message count;
- exact distinct occurrence count;
- first and last boundary oracle;
- complete per-ordinal role ledger;
- candidate-independent provenance;
- freeze before any candidate observation;
- unique Runtime-only fixture binding; and
- the established privacy boundary.

The contract does not require fixture creation by the Codex Chrome harness. Candidate-independent construction Evidence may instead be a contemporaneous user-maintained creation ledger or another independently established external construction record. A remembered or approximate count, including “100往復以上,” remains insufficient.

## Option A — Current Chrome-control Automated Construction

Formal validity would be possible if Send identity, dispatch acknowledgement, submission success, completion success, and exact cycle accounting were all independently established. The current path does not meet those prerequisites.

Its blocker chain now includes Send-action identity, Combined Oracle handoff, observer continuity, and safe observer-capable surface availability. Continuing this path would add substantial construction-tooling work without adding a formal TV-005 / TV-006 requirement. It is therefore not recommended for TASK-003 fixture preparation.

## Option B — Out-of-band Manual Controlled Construction

This option can satisfy the Ground Truth contract when the frozen ledger precedes construction and a contemporaneous construction record independently accounts for every occurrence. The human operator performs each controlled cycle; the construction record, not later DOM inspection, establishes the expected count and sequence.

Human visual confirmation alone, recalled after the fact, is not sufficient. The minimum contemporaneous per-cycle record is:

| Field | Required meaning |
|---|---|
| `CYCLE_ALIAS` | Frozen cycle identifier |
| `USER_ACTION_CONFIRMED` | Exactly one intended User submission was positively confirmed |
| `ASSISTANT_COMPLETION_CONFIRMED` | Exactly one corresponding completion was positively confirmed |
| `AMBIGUITY_FLAG` | Any uncertainty in occurrence accounting |
| `RETRY_OCCURRED` | Any retry that could affect count |
| `REGENERATE_OCCURRED` | Regenerate occurrence |
| `EDIT_OCCURRED` | Edit occurrence |
| `BRANCH_OCCURRED` | Branch occurrence |
| `INTERRUPTION_OCCURRED` | Interrupted generation or operation |
| `UNEXPECTED_EXTRA_OCCURRENCE` | Any unplanned visible occurrence |
| `CYCLE_ACCEPTED` | True only when all required confirmations are exact and all invalidating flags are false |

Any ambiguity invalidates the construction attempt. Later Message DOM enumeration, mounted count, scrolling, scan union, or Completeness Signal may not repair the record. This option has higher human cost but directly serves the formal goal with the least architecture expansion.

## Option C — Separate Event-capable Construction Tooling

This option is architecturally viable but is not selected now. A later Tooling Capability Review would need to establish:

- operation under explicit user authority;
- stable and exact tab binding;
- safe editor fill capability;
- stage-separated action execution acknowledgement;
- positive submission and completion observation;
- exact, Fail Closed cycle accounting;
- privacy-safe output;
- no dependency on undocumented or private ChatGPT APIs; and
- no use of TV-005 / TV-006 candidate material as construction Ground Truth.

No concrete tool or library is selected. Installation and implementation are outside this review.

## Option D — Hybrid Human Action and Automation Bookkeeping

This option does not automatically resolve the current blockers. If automation cannot positively establish the cycle outcome, a human Send action plus incomplete automated observation still leaves occurrence accounting unresolved.

If the human independently maintains the complete accepted-cycle record, the provenance model becomes materially the same as Option B. The additional automation then adds complexity without improving the Ground Truth contract, so Hybrid is not recommended as the current architecture.

## Option E — Existing Long Conversation Requalification

No new candidate-independent oracle was provided in this review. Existing-Long-01 therefore remains supplementary only. Its approximate size and absence of remembered branch-like events do not establish exact total occurrences, complete ordinal roles, first and last oracles, or frozen pre-observation provenance.

## Option F — Weaken Combined Oracle and Resume Attempt 4

Rejected. Implicit native submit semantics, post-action state alone, fixed waits, route stability, or absence of a generation control do not close the previously identified circularity and positive-signal gaps. Convenience does not justify weakening the construction provenance contract.

## TASK-003 Fixture-production Objective

TASK-003 needs an exact controlled 100- and 200-Message-class fixture with candidate-independent provenance. It does not need to solve how Codex autonomously sends ChatGPT messages.

The construction actor is an implementation detail so long as the frozen ledger, exact occurrence accounting, Fail Closed rules, unique binding, and privacy boundary remain intact.

## Construction-tooling Scope Assessment

The historical chain from Send candidate to Action Oracle, interactive handoff, H2 observer continuity, and safe test surface was legitimate supporting work for the chosen automated construction method. It established that the current method cannot yet meet its own safety contract.

After those findings, further expansion of that chain is disproportionate to the formal TASK-003 goal. This classification does not invalidate the work; it uses the work to bound the automation path and to select a simpler provenance-preserving architecture.

## Option Comparison

| Option | Formal validity | Ground Truth strength | Tooling blocker | Human cost | Automation cost | Privacy | Provenance risk | Recommended |
|---|---|---|---|---|---|---|---|---|
| A. Current Chrome-control automation | Possible only after unresolved contracts | Potentially strong | High / current blocker | Low | Very high | Controlled if harness remains safe | High while lifecycle is unresolved | No |
| B. Out-of-band manual controlled | Yes with contemporaneous exact ledger | Strong | Low | High | Low | Strong with safe ledger only | Controlled by per-cycle Fail Closed record | **Yes** |
| C. Separate event-capable tooling | Possible after capability review | Potentially strong | Separate review required | Medium | High setup cost | Conditional on tooling | Conditional until proven | Later alternative |
| D. Hybrid | Conditional | No stronger than its independent human record | Current lifecycle gaps remain | Medium | Medium | Conditional | High unless it reduces to Option B | No |
| E. Existing fixture requalification | No with current input | Insufficient | Exact oracle missing | Low | Low | Personal-content risk remains | High | Supplementary only |
| F. Weaken oracle | No | Weak / circular | Conceals rather than resolves blocker | Low | Low | Neutral | Unacceptable | No |

## Architecture Decision

Selected architecture:

`OUT_OF_BAND_MANUAL_CONTROLLED`

The existing frozen ledger is retained. A later, separately authorized protocol round must define the operator checkpoints, contemporaneous safe construction record, attempt invalidation rules, and Runtime-only fixture binding. Construction does not begin in this review.

## Combined Oracle Impact

The Combined Oracle remains a valid historical safety requirement for any future Codex-controlled autonomous Send path. It is not necessary for the selected manual controlled fixture-construction architecture and therefore is no longer a TASK-003 blocker.

No historical Action Oracle, H1, H2, C1, or Attempt status is rewritten.

## Send Lifecycle Characterization Impact

Send Lifecycle Characterization is deferred. “Deferred” means it is not required for the selected TASK-003 fixture construction architecture; it does not mean the preceding characterization Evidence was incorrect.

It may be resumed only if a later decision returns to autonomous Chrome-control construction or selects another event-capable automation path that needs the same contracts.

## Attempt 4 Impact

Historical Attempt 4 readiness remains `BLOCKED` within the Chrome-control Evidence chain. Under the current architecture, Attempt 4 is `SUPERSEDED_FOR_TASK_003` and is not the recommended next step.

No Attempt 4 operation is authorized or performed.

## Long-100 Frozen Ledger Reuse

The frozen Long-100 ledger is reusable unchanged:

- expected Message count: 100;
- expected distinct occurrence count: 100;
- first alias: `L100-M001`;
- last alias: `L100-M100`;
- odd ordinal: User;
- even ordinal: Assistant; and
- 50 controlled cycles.

All aliases remain unconsumed because accepted construction cycles remain 0. The manual record may attest construction outcomes but may not modify or repair this ledger from later candidate observation.

Reuse of the ledger does not itself establish the live fixture or Ground Truth.

## Long-200 Architecture Reuse

The selected architecture and provenance model are reusable for Long-200 without inventing a new Ground Truth model. Long-200 still requires its own independently frozen ledger, exact 200-occurrence design, per-cycle contemporaneous record, unique Runtime binding, separate authorization, and Fail Closed execution.

Architecture reuse is therefore `YES`; successful execution is not pre-judged and remains conditional on its own exact record.

## Source-of-Truth Impact

The selected construction method is a Phase 0 fixture-preparation implementation detail. It does not change the meaning or scope of the Source of Truth.

| Source | Change required | Reason |
|---|---:|---|
| Requirements | No | Whole-conversation and Fail Closed requirements remain unchanged |
| ADR | No | ADR-005 and ADR-006 remain intact |
| Risk Register | No | RISK-002 remains the relevant unresolved risk |
| Acceptance Tests | No | AT-007 / AT-008 remain Production acceptance boundaries, not executed here |
| Technical Validation Plan | No | TV-005 / TV-006 methods and pass criteria remain unchanged |
| Development Backlog | No | TASK-003 refs, risk, and exit remain unchanged |

## Privacy / Security Impact

The manual construction record must contain only safe aliases, counts, booleans, accepted states, and fixed safe failure codes. It must not persist raw synthetic or personal Message bodies, raw Title, URL, pathname, CID, Runtime Message identity, DOM / HTML, browser exception text, cookies, tokens, credentials, or authorization material.

Runtime-only exact binding material remains outside repository Evidence. The manual architecture must not use Message DOM, mounted counts, scroll results, or candidate Completeness Signals to create or repair Ground Truth.

## Repository Check

- Intended changed scope: this Architecture Review Evidence only
- `git diff --check`: PASS
- Direct whitespace check of this new untracked Evidence: PASS; the command's nonzero status represented the expected no-index file difference, and only the configured LF-to-CRLF normalization warning was emitted
- Direct privacy / security pattern scan of this new Evidence: PASS; no raw URL, UUID-like value, credential assignment, authorization value, HTML document marker, or non-HTTP document locator was found
- `git status --short`: only this new Evidence file was listed
- Repository-current Source-of-Truth hashes remained equal to the pre-review values
- Previously reviewed H2 characterization and safe-surface capability Evidence hashes remained equal to their pre-review values
- Production implementation: none
- `src/`: unchanged by this review
- Source-of-Truth files: unchanged by this review
- Historical TASK-003 Evidence: unchanged by this review
- Browser mutation or new tooling installation: none
- Privacy scan scope: this new Evidence file

## Recommended Next Action

`TASK-003 Long-100 Out-of-band Manual Controlled Construction Protocol / Authorization`

That round should freeze the operator procedure and the contemporaneous safe record schema, define exact invalidation and abort behavior, and obtain explicit authorization before any cycle begins. It must not begin TV-005 / TV-006 Discovery or use candidate observation to establish Ground Truth.

## Final Status

```text
SEND_LIFECYCLE_CHARACTERIZATION_FORMAL_NECESSITY:
TOOLING_SPECIFIC

CHROME_CONTROL_FIXTURE_CONSTRUCTION_FORMAL_REQUIREMENT:
NO

TASK_003_FIXTURE_PRODUCTION_OBJECTIVE:
EXACT_CONTROLLED_FIXTURE_PROVENANCE

CONSTRUCTION_TOOLING_SCOPE_STATUS:
DISPROPORTIONATE_TO_FORMAL_GOAL

TASK_003_FIXTURE_CONSTRUCTION_ARCHITECTURE:
OUT_OF_BAND_MANUAL_CONTROLLED

COMBINED_ORACLE_TASK_003_ROLE:
NO_LONGER_TASK_003_BLOCKER

SEND_LIFECYCLE_CHARACTERIZATION_REQUIRED:
DEFERRED

ATTEMPT_4_READINESS:
SUPERSEDED_FOR_TASK_003

LONG_100_FROZEN_LEDGER_REUSABLE:
YES

LONG_200_ARCHITECTURE_REUSABILITY:
YES

REQUIREMENT_CHANGE_REQUIRED:
NO

ADR_CHANGE_REQUIRED:
NO

RISK_CHANGE_REQUIRED:
NO

ACCEPTANCE_TEST_CHANGE_REQUIRED:
NO

TECHNICAL_VALIDATION_PLAN_CHANGE_REQUIRED:
NO

BACKLOG_CHANGE_REQUIRED:
NO

LONG_100_CONSTRUCTION_STATE:
BLOCKED

LONG_100_COMPLETED_CYCLES:
0

LONG_100_NEXT_EXPECTED_CYCLE:
1

LONG_100_FIXTURE:
NOT_DESIGNATED

LONG_100_GROUND_TRUTH:
NOT_ESTABLISHED

TASK-003 DISCOVERY:
NOT_STARTED

TV-005 VERDICT:
NOT_SET

TV-006 VERDICT:
NOT_SET
```
