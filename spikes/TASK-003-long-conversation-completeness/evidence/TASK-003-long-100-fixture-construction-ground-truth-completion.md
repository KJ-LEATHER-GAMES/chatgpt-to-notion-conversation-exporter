# TASK-003 Long-100 Fixture Construction / Ground Truth Completion

## Status

- Date: 2026-08-16
- Scope: Long-100 controlled Standard Chat construction and Ground Truth
  completion only
- Long-200 construction: **NOT STARTED**
- TV-005 / TV-006 Discovery: **NOT STARTED**
- Candidate Completeness Signal observation: **NO**
- Scrolling / Message enumeration / scan union: **NO**
- PoC / Production implementation: **none**

Pre-construction state:

```text
LONG_100_CONSTRUCTION: NOT_STARTED
LONG_100_FIXTURE: NOT_DESIGNATED
LONG_100_GROUND_TRUTH: NOT_ESTABLISHED
```

## Review Basis

Repository-current sources reviewed before fixture construction:

- `AGENTS.md`;
- `docs/01_product-requirements.md`;
- `docs/02_adr.md`;
- `docs/03_risk-register.md`;
- `docs/04_acceptance-tests.md`;
- `docs/05_technical-validation-plan.md`;
- `docs/06_development-backlog.md`;
- `TASK-003-scope-plan.md`;
- `TASK-003-fixture-ground-truth-preparation.md`;
- TASK-001 latest Final Exit and TV-001 Evidence; and
- TASK-002 Final Exit Evidence.

No Requirement, ADR, Acceptance Test, Risk, Validation, or Backlog
contradiction was found. The current TASK-003 scope remains TV-005 / TV-006,
RISK-002, and the 200-Message-class Exit. This Round prepares only Long-100 and
does not set a Validation Verdict.

## Privacy Wording Reconciliation

`PRIVACY_WORDING_RECONCILIATION: PASS`

The following interpretation is consistent with repository-current FR-069,
NFR-003, Chrome-side data requirements, AGENTS.md, and the prior TASK-003
Evidence:

- raw user Conversation content must not be written to repository Evidence,
  source, persistent fixture artifacts, or diagnostic logs;
- the live ChatGPT Conversation used as a controlled fixture may contain the
  synthetic test content needed to construct it;
- synthetic test content must not be transcribed into repository Evidence;
- composer submission and response-completion UI operations are fixture
  construction, not TV-005 / TV-006 candidate observation; and
- mounted counts, Message DOM enumeration, scroll union, scroll metrics,
  runtime Message identity, and Completeness Signal candidates must not create,
  repair, or approve Ground Truth.

This is a privacy-boundary clarification, not a Requirement semantics change.
No personal Conversation content is used to construct Long-100.

## Frozen Long-100 Construction Ledger

The following deterministic record was frozen and expanded before any browser
construction operation. This section is not modified from browser or candidate
results.

```text
FIXTURE_ALIAS: Long-100
SOURCE_TYPE: Standard
EXPECTED_MESSAGE_COUNT: 100
EXPECTED_DISTINCT_OCCURRENCE_COUNT: 100

FIRST_ALIAS: L100-M001
LAST_ALIAS: L100-M100

ROLE_RULE:
- odd ordinal = User
- even ordinal = Assistant

ALIAS_RULE:
- ordinal n => L100-M{3-digit ordinal}

TURN_COUNT:
- 50 User turns
- 50 Assistant turns

DUPLICATE_BODY_COVERAGE: NOT_INCLUDED
```

Pre-browser expansion validation:

| Check | Result |
|---|---|
| Ordinal coverage | exactly 1 through 100 |
| Expanded ledger rows | 100 |
| Unique aliases | 100 |
| User roles | 50 |
| Assistant roles | 50 |
| First expansion | `L100-M001`, User |
| Last expansion | `L100-M100`, Assistant |
| Arbitrary ordinal determinism | PASS |
| Ledger rule digest | `776C97C5BA8DA442AF4E459BC878231F4E6C38B275CB7F4F05934D766A02067D` |
| Freeze before browser construction | true |
| Freeze before candidate observation | true |

The digest represents the Evidence-safe sequence of ordinal, alias, and role;
it contains no Message body or browser locator. The frozen ledger is a
construction oracle. It is not a Runtime Completeness Signal.

## Construction Protocol

The approved protocol is:

1. create one new Standard Chat dedicated to `Long-100`;
2. execute cycles 1 through 50 in order;
3. for each cycle, submit exactly one short synthetic User prompt generated in
   Runtime memory;
4. request one short cycle-distinct Assistant response;
5. establish submission and response completion from construction UI state,
   without enumerating Conversation Messages;
6. record only the safe cycle success/failure state;
7. proceed only after the current cycle is unambiguous; and
8. bind the completed live fixture to `Long-100` using Runtime-only browser
   locator material.

Construction provenance is:

```text
50 unambiguous controlled construction cycles
x 2 expected Message occurrences per cycle
= 100 expected distinct Message occurrences
```

The protocol does not use current mounted count, container count, Message DOM,
scrolling, captured union, first/last candidate discovery, runtime Message
identity, or Completeness Signal material.

## Fail Closed Protocol

The attempt must be marked `ABORTED` and cannot establish Ground Truth if any
cycle has ambiguous submission/completion, a possible duplicate, regenerate,
edit, branch, unexpected extra response, interrupted generation, browser error,
or a retry that may change the exact occurrence count.

No uncertain attempt may be repaired with DOM counting or by adding a guessed
missing Message. A new fixture must be constructed from cycle 1 in a later
attempt if this attempt becomes ambiguous.

## Construction Result

Pending browser construction.

## Ambiguous / Failure Events

Pending browser construction.

## Fixture Binding Result

Pending browser construction. Raw Title, URL, pathname, Conversation ID, and
other locator values will remain Runtime-only.

## Ground Truth Acceptance Evaluation

Pending browser construction.

## Final Status

Pending browser construction.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: whole-Conversation acquisition remains a later Discovery
  concern; this construction does not prove capture completeness.
- FR-008 / NFR-001 / NFR-002 / ADR-006: ambiguous construction fails closed and
  cannot be repaired from candidate material.
- NFR-007: Long-100 supplies the 100-Message method fixture; Long-200 remains
  required separately.
- AT-007 / AT-008: traceability only; no Production Acceptance Test executed.
- RISK-002: remains open; no loading/completeness mitigation validated.
- Requirement / ADR / Acceptance Test / Risk / Backlog change: **NO**.

## Repository / Security Check

Pending completion and direct checks.

## Recommended Next Action

Pending construction outcome. Long-200 remains outside this Round.
