# TASK-003 Existing Long Conversation Oracle Qualification

## Status

- Date: 2026-08-16
- Scope: existing long Standard Chat oracle qualification only
- Safe fixture alias: `Existing-Long-01`
- Browser / DOM observation: **NO**
- Scrolling / mounted count / scan union: **NO**
- Long-100 controlled construction actions: **NO**
- Long-200 construction: **NO**
- TV-005 / TV-006 Discovery: **NOT STARTED**
- Candidate Decision / PoC / Production implementation: **none**

Qualification result:

```text
EXISTING_LONG_CONVERSATION_FORMAL_ELIGIBILITY: NOT_READY
EXISTING_LONG_CONVERSATION_ROLE: SUPPLEMENTARY_ONLY

LONG_100_CONSTRUCTION: NOT_STARTED
LONG_100_CURRENT_SEND_COUNT: 0

TASK-003 DISCOVERY: NOT_STARTED
TV-005 VERDICT: NOT_SET
TV-006 VERDICT: NOT_SET
```

`SUPPLEMENTARY_ONLY` is the role supported by currently available input. It
does not prevent a later Formal requalification when a complete,
candidate-independent oracle is provided.

## Review Basis

Repository-current sources reviewed:

- `AGENTS.md`;
- `docs/01_product-requirements.md`;
- `docs/02_adr.md`;
- `docs/03_risk-register.md`;
- `docs/04_acceptance-tests.md`;
- `docs/05_technical-validation-plan.md`;
- `docs/06_development-backlog.md`;
- `TASK-003-scope-plan.md`;
- `TASK-003-fixture-ground-truth-preparation.md`;
- `TASK-003-long-100-fixture-construction-ground-truth-completion.md`;
- TASK-001 latest TV-001 and Final Exit Evidence; and
- TASK-002 Final Exit Evidence.

The current Formal boundary remains:

- TV-005: 100 / 200 Message-class fixtures, top and bottom included, with
  captured result compared to fixture / expected count;
- TV-006: an incomplete state must not be misclassified as Complete;
- TASK-003 Exit: completeness determination at the 200-Message class; and
- RISK-002: missing the beginning or end of a lazy-loaded Conversation remains
  Critical-impact material.

No additional Chrome inspection was performed. User-provided identification
metadata remains Runtime-only and is not reproduced here.

## Current Candidate-Independent Input

| Input | Available safe fact | Qualification use |
|---|---|---|
| Safe alias | `Existing-Long-01` | Evidence reference only |
| Source Type | User states Standard | Candidate-independent input; no browser verification in this Round |
| Browser location | User states the Conversation is already open | Potential Runtime binding input; uniqueness not established |
| Identification metadata | Provided by user | Runtime-only; raw values not persisted |
| Size statement | Approximate 100-plus round-trip range | Context only; not an exact Message-occurrence oracle |
| Exact Message occurrence count | Not provided | Formal blocker |
| Exact distinct occurrence count | Not provided | Formal blocker |
| First occurrence oracle | Not provided | Formal blocker |
| Last occurrence oracle | Not provided | Formal blocker |
| Complete per-ordinal role ledger | Not provided | Formal blocker |
| Regenerate/edit/branch recollection | User recalls none | Risk input only; not a construction ledger or exact-count proof |
| Pre-observation oracle freeze | No complete oracle exists to freeze | Formal blocker |

## Existing Conversation Qualification Contract

Formal designation requires all of the following before candidate observation:

1. Source Type fixed independently;
2. exactly one Runtime-only fixture binding;
3. exact total visible Message occurrence count;
4. exact distinct occurrence count;
5. safe first occurrence alias bound to ordinal 1;
6. safe last occurrence alias bound to the final ordinal;
7. complete per-ordinal role ledger;
8. candidate-independent provenance;
9. complete oracle frozen before observation; and
10. no Ground Truth generated or repaired from current DOM, scrolling,
    mounted/container counts, scan union, runtime Message identity, or a
    Completeness Signal candidate.

An approximate number of round trips is insufficient. A Formal fixture needs
an exact ledger of visible Message occurrences, not a memory-based magnitude
estimate.

## Exact-Count Issue

The current controlled design uses exact Message occurrence counts:

- Long-100: exactly 100 Message occurrences;
- Long-200: exactly 200 Message occurrences.

The user-provided existing-Conversation estimate is expressed in round trips,
not exact visible Message occurrences. It must not be multiplied by two and
promoted to an exact count because that would assume, without a ledger:

- exactly one User and one Assistant occurrence per round trip;
- no interrupted or absent completion;
- no extra Assistant occurrence;
- no branch, edit, or regenerate effect on the visible sequence; and
- no counting ambiguity in the estimate itself.

Therefore the existing Conversation is not currently exact Long-100 or
Long-200. It must not be renamed, truncated, or treated as a prefix fixture.

If a candidate-independent oracle later proves an exact count other than 100 or
200, the Conversation may be evaluated as `LONG_OTHER` under a separate fixture
design reconciliation. A count at or above the 200-Message class may be
relevant to TV-005 and TASK-003 Exit, but it does not silently replace the
planned exact Long-100 / Long-200 method fixtures. No Requirement or Formal TV
criterion is changed by considering that option.

## Candidate-Independent Oracle Options

| Oracle source | Qualification | Minimum conditions |
|---|---|---|
| User-maintained creation ledger | **ACCEPTABLE** | One occurrence per ordinal, exact role, boundaries, distinct count, branch/edit/regenerate events, and provenance fixed before observation |
| Controlled construction record | **ACCEPTABLE** | Exact successful operation sequence with no ambiguous cycle or count-affecting retry |
| User-provided complete transcript with known generation provenance | **CONDITIONALLY ACCEPTABLE** | Completeness and visible-sequence provenance are independently demonstrated; parsing requires separate explicit approval and privacy-safe handling |
| Pre-existing external record | **CONDITIONALLY ACCEPTABLE** | It predates candidate observation and independently establishes the complete visible occurrence ledger and binding |
| Other non-DOM construction evidence | **REVIEW REQUIRED** | Must establish every Formal contract field without circular candidate use |
| User recollection of approximate size | **REJECT AS FORMAL ORACLE** | May describe stress magnitude only |
| Current ChatGPT DOM / mounted or container count | **REJECT** | Candidate self-approval |
| Scrolling / captured union | **REJECT** | TV-005 result cannot manufacture its own expected count |
| Runtime Message identity inventory | **REJECT** | Candidate data; not Ground Truth provenance |
| Completeness Signal candidate | **REJECT** | TV-006 candidate cannot approve its own oracle |

No transcript or external record was requested, acquired, or parsed in this
Round.

## Branch / Regenerate Risk

The user recalls no regenerate, edit, or branch activity. This is useful risk
context but does not establish the exact visible occurrence ledger.

Formal qualification must explicitly account for:

- regenerate;
- user edit;
- branch creation or switching;
- interrupted generation;
- unexpected extra Assistant occurrence; and
- any retry or UI uncertainty affecting exact occurrence count.

If any of these is unknown or may have changed the visible sequence, Formal
Ground Truth remains blocked. Current DOM observation cannot repair the
uncertainty. TASK-004 remains the authority for general branch/edit semantics;
this qualification asks only whether the fixture oracle is unambiguous.

## Option Comparison

| Option | Assessment | Current decision |
|---|---|---|
| A. Build exact controlled Long-100 / Long-200 | Strongest construction-side provenance and preserves the reviewed plan | **RECOMMENDED FORMAL PATH** |
| B. Designate existing Conversation when exact count is 100 or 200 | Valid only with every oracle field and pre-observation freeze | **CONDITIONAL** |
| C. Reconcile an exact non-100/200 existing Conversation as 200-Message-class `LONG_OTHER` | Potentially valid when exact independent oracle exists; requires a separate fixture-plan reconciliation without changing Formal criteria | **CONDITIONAL / NOT READY** |
| D. Use existing Conversation as supplementary stress material | Useful for scale/robustness observations but cannot support Formal count/completeness claims | **CURRENT ROLE** |

The existing Conversation is not classified as unusable. It lacks the oracle
needed for Formal status, but it can remain useful as supplementary stress
material. Supplementary results must be clearly separated from Formal TV-005 /
TV-006 Evidence.

## Formal Fixture Eligibility

| Contract field | Current result |
|---|---|
| Source Type | AVAILABLE as user-provided Standard classification |
| Unique Runtime-only binding | NOT ESTABLISHED |
| Exact total visible occurrence count | NOT AVAILABLE |
| Exact distinct occurrence count | NOT AVAILABLE |
| First occurrence oracle | NOT AVAILABLE |
| Last occurrence oracle | NOT AVAILABLE |
| Complete per-ordinal role ledger | NOT AVAILABLE |
| Candidate-independent provenance | INSUFFICIENT |
| Branch/regenerate/edit certainty | USER RECOLLECTION ONLY |
| Pre-observation complete freeze | NOT POSSIBLE YET |

`EXISTING_LONG_CONVERSATION_FORMAL_ELIGIBILITY: NOT_READY`

Current A/B/C Formal designation is blocked. The block is a Ground Truth input
gap, not TV-005 or TV-006 FAIL.

## Supplementary Fixture Eligibility

`EXISTING_LONG_CONVERSATION_ROLE: SUPPLEMENTARY_ONLY`

The Conversation may be used later as supplementary stress material after a
safe unique binding is confirmed and the user separately authorizes that
observation. It may support observations about scale or candidate behavior, but
it must not:

- establish Formal expected count;
- make a Runtime Completeness Signal true;
- replace exact Long-100 / Long-200 coverage;
- supply first/last Formal boundary oracles; or
- determine a TV-005 / TV-006 Verdict.

## Privacy Boundary

Allowed Evidence is limited to safe alias, user-stated Source Type,
availability booleans, independently established counts if later supplied,
safe boundary aliases, role-ledger availability, provenance classification,
branch/regenerate knowledge status, binding availability, and qualification
status.

This Evidence does not persist raw Message content, fixture Title, project
label, URL/pathname, Conversation ID, runtime Message identity, DOM/HTML, or
credentials. The existing Conversation may contain personal content; any later
transcript use or browser observation requires a separately approved,
privacy-safe process.

## Impact on Current Long-100 Construction

The existing controlled Long-100 attempt remains unchanged:

```text
FROZEN_LONG_100_LEDGER: READY
LONG_100_CONSTRUCTION: NOT_STARTED
LONG_100_CURRENT_SEND_COUNT: 0
```

No synthetic prompt was sent. No browser construction state, frozen ledger,
or historical Evidence was modified. The current recommendation to retain
controlled fixtures as the Formal path remains in force unless a later
qualification supplies a complete oracle and explicitly reconciles the fixture
role.

## User Input Required for Formal Requalification

Provide, without using current DOM/scroll candidates:

1. an exact visible Message occurrence count, explicitly distinguished from a
   round-trip estimate;
2. the exact distinct occurrence count;
3. safe first and last occurrence aliases with their ordinals;
4. a complete per-ordinal alias/role ledger;
5. oracle provenance, including how completeness was known before candidate
   observation;
6. confirmation that exactly one Runtime-only fixture binding is available;
7. a ledger-backed or otherwise authoritative status for regenerate, edit,
   branch, interrupted generation, and unexpected extra Assistant occurrences;
   and
8. confirmation that the full oracle is frozen before any TASK-003 candidate
   observation.

If the proposed oracle is a complete transcript or external record, first
request a separate approval Round defining how it will be supplied and
processed without persisting personal content. If no such independent oracle
exists, retain `SUPPLEMENTARY_ONLY` and proceed with controlled Formal fixture
construction in a later approved Round.

## Requirement / ADR / Risk Impact

- FR-007 / ADR-005: full Conversation acquisition remains required; an
  approximate existing-Conversation size does not prove it.
- FR-008 / NFR-001 / NFR-002 / ADR-006: missing oracle material fails closed and
  cannot be repaired from candidate observations.
- NFR-007: an independently proven 200-Message-class fixture may be relevant;
  it is not a strict SLA or permission to use an estimate.
- AT-007 / AT-008: technical traceability only; no Production Acceptance Test
  was run.
- RISK-002 remains open. No loading or completeness validation occurred.
- Requirement / ADR / Acceptance Test / Risk / Backlog change: **NO**.

## Repository / Security Check

- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan of this new Evidence: **PASS**.
- Direct restricted-value/content scan: **PASS**.
- Existing TASK-003 Evidence, including the Long-100 frozen ledger: unchanged.
- `docs/`, `AGENTS.md`, `src/`, TASK-001/TASK-002 assets, and Production files:
  unchanged.
- Browser / DOM / scrolling operations: **none**.
- Production implementation: **none**.

## Final Status

```text
EXISTING_LONG_CONVERSATION_FORMAL_ELIGIBILITY: NOT_READY
EXISTING_LONG_CONVERSATION_ROLE: SUPPLEMENTARY_ONLY

LONG_100_CONSTRUCTION: NOT_STARTED
LONG_100_CURRENT_SEND_COUNT: 0

TASK-003 DISCOVERY: NOT_STARTED
TV-005 VERDICT: NOT_SET
TV-006 VERDICT: NOT_SET
```

## Recommended Next Action

Choose one of two explicit paths in a later Round:

1. provide a complete candidate-independent oracle package for
   `Existing-Long-01`, then perform a focused Formal requalification; or
2. retain it as `SUPPLEMENTARY_ONLY` and separately resume the controlled
   Long-100 / Long-200 construction plan when approved.

Do not observe the existing Conversation or resume construction in this Round.
