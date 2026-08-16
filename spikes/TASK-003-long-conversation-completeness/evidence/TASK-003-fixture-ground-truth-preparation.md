# TASK-003 Fixture / Ground Truth Preparation

## Status

- Preparation date: 2026-08-16
- Scope: TASK-003 Fixture / Ground Truth Preparation only
- `TASK-003 Scope Planning: COMPLETE`
- `TASK-003 Fixture / Ground Truth Preparation: COMPLETE`
- `TASK-003 Discovery: NOT STARTED`
- `TV-005 Verdict: NOT SET`
- `TV-006 Verdict: NOT SET`
- `TASK-003 Final Exit: NOT SET`
- `Phase 0 Exit: NOT MET`
- Chrome / DOM observation, scrolling, and browser automation: **NO**
- Candidate Completeness Signal adopted: **NO**
- Loading algorithm selected: **NO**
- PoC / self-test / Production implementation: **none**

Preparation result:

```text
LONG_100_FIXTURE: NOT DESIGNATED
LONG_100_GROUND_TRUTH: NOT ESTABLISHED

LONG_200_FIXTURE: NOT DESIGNATED
LONG_200_GROUND_TRUTH: NOT ESTABLISHED

PRIVACY_SAFE_OBSERVATION_SCHEMA: READY

TASK-003 DISCOVERY ENTRY: BLOCKED
```

The Discovery gate is blocked by missing fixture designation and independent
Ground Truth input. This is a preparation/input gate, not a TV-005 or TV-006
failure.

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
- TASK-001 latest `TASK-001-final-exit-review.md` and
  `TV-001-validation-rounds.md`;
- TASK-002 latest `TASK-002-final-exit-review.md`.

Repository search found no designated Long-100 or Long-200 fixture, frozen
construction ledger, or user-provided independent oracle outside the historical
scope plan. No missing input was inferred from runtime material.

Current Source-of-Truth scope was confirmed without amendment:

- TASK-003 references TV-005 and TV-006;
- TASK-003 traces RISK-002;
- TASK-003 Exit requires a completeness determination at approximately the
  200-Message scale;
- TV-005 requires 100- and 200-Message-class validation including top and
  bottom, compared with fixture / expected count;
- TV-006 requires a safe condition that does not classify an incomplete state
  as Complete.

TASK-001 established mounted-message acquisition, scan-union accumulation, and
remount dedup principles for observed fixtures. It did not establish general
completeness, a general settled condition, viewport/step invariance, or
TV-005/TV-006 PASS. TASK-002 established Project-specific metadata feasibility,
not long-conversation completeness.

## Duplicate-Body Reconciliation

`DUPLICATE_BODY_COVERAGE: OPTIONAL_ADDITIONAL_VALIDATION`

The scope plan used two materially different phrases: one made an exact
duplicate-body pair required in at least one long fixture, while the discovery
sequence called it optional. The effective clarification for TASK-003 is:

- an exact duplicate-body, distinct-Message case is useful additional coverage;
- it is not stated in the TV-005 or TV-006 Formal Pass criteria;
- it is not mandatory for Long-100 / Long-200 Ground Truth establishment or
  Discovery Entry;
- absence of this case is not, by itself, TV-005 / TV-006 FAIL or a Discovery
  blocker;
- if included, its occurrence aliases, ordinals, roles, expected body-equality
  boolean, and expected distinct occurrence count must be frozen before
  candidate observation.

TASK-001 supports this distinction. It observed separate runtime identities for
same-marker occurrences and stable remount identity, but the latest review says
exact same-full-body equality was not pre-established or proven. That auxiliary
question was not a TV-001 Formal Pass condition. It therefore cannot be promoted
silently into a new TV-005 / TV-006 Formal Pass condition.

This clarification supersedes only the ambiguous mandatory/optional
interpretation for future TASK-003 work. The historical scope-plan file remains
unchanged. No Requirement, ADR, Acceptance Test, Risk, Validation, or Backlog
semantics change is required.

## Ground Truth Acceptance Contract

Long-100 and Long-200 must independently satisfy every mandatory row before
their Ground Truth can be marked `ESTABLISHED`.

| Ground Truth field | Acceptance condition | Candidate use prohibited |
|---|---|---|
| Fixture alias | Safe alias uniquely identifies one fixture | No alias inferred from page text |
| Source Type | Fixed before observation; Standard is the planned primary scope | No source type inferred from completeness candidates |
| Unique fixture binding | Exactly one Runtime-held fixture locator is bound to the alias | Raw locator is not persisted |
| Exact expected count | Long-100 = 100; Long-200 = 200 | Not derived from mounted/container/union counts |
| First boundary | One safe first-message alias bound to ordinal 1 | Not selected after a scan |
| Last boundary | One safe last-message alias bound to final ordinal | Not selected after a scan |
| Role ledger | Expected role recorded for every ordinal | Not repaired from captured roles |
| Distinct occurrence count | Long-100 = 100; Long-200 = 200 | Not derived from runtime identity inventory |
| Provenance | Dedicated construction ledger or complete independent user-provided oracle | Current DOM/scroll candidate is unacceptable provenance |
| Freeze | Entire oracle frozen before candidate observation | Candidate results cannot modify or approve it |
| Identification metadata | Available Runtime-only for unique binding | Raw Title, location, or identifier is not persisted |
| Privacy | Evidence stores only safe aliases/counts/ordinals/roles/booleans/status | No raw content or runtime identifiers |

The 50 User/Assistant pairs and 100 User/Assistant pairs are controlled-fixture
design rules, not new Formal Pass criteria. A valid construction ledger may use
the deterministic alternating rule while still preserving an explicit expected
role for every ordinal. Existing fixtures require an equivalent complete role
ledger; their roles must not be reconstructed from a DOM capture.

Ground Truth establishes a Technical Spike oracle only. It must not become the
Runtime completeness rule:

```text
Runtime scan
  -> candidate-only completeness evaluation
  -> COMPLETE_CANDIDATE / INCOMPLETE / UNKNOWN / other diagnostic state
  -> independent comparison with frozen fixture Ground Truth
```

`capturedCount == expectedCount` is an oracle comparison, not permission for the
Runtime candidate to declare Complete.

## Fixture Construction / Designation Options

| Option | Required preparation | Pros | Cons | Decision |
|---|---|---|---|---|
| A. Dedicated controlled fixtures | Construct exactly 100 and 200 occurrences from a frozen ledger; bind each fixture after construction without observing candidates | Strongest count, boundary, role, and occurrence provenance; deterministic alternating sequence; optional duplicate-body case can be planned safely | Requires user-controlled fixture construction and careful ledger/fixture binding | **RECOMMENDED** |
| B. Designate existing long Conversations | Provide a candidate-independent exact count, first/last aliases, complete role ledger, distinct occurrence count, provenance, and unique Runtime-only binding | Reuses existing Conversations; avoids creating new content | A complete independent oracle is often unavailable; current DOM/scroll counts cannot fill gaps; greater privacy/binding risk | **ACCEPTABLE IF COMPLETE** |
| C. Derive oracle by scrolling/current DOM | Use mounted counts, scan union, container count, scroll metrics, or a completeness candidate to create expected values | Operationally easy | Circular candidate self-approval; cannot validate false completeness | **REJECTED** |

Option A is recommended because it makes exact count, role order, boundaries,
and distinct occurrences construction facts before Discovery. This Round does
not construct or change any fixture.

### Dedicated construction ledger

For each fixture, the construction record must contain only Evidence-safe
validation material:

- fixture alias and planned Source Type;
- ordinal from first through final occurrence;
- safe occurrence alias for every ordinal;
- expected role for every ordinal;
- first/last boundary flags;
- exact total and exact distinct occurrence count;
- construction completion and unique-binding attestations;
- provenance classification and pre-observation freeze status;
- optional duplicate-body declaration and, only when included, the two safe
  aliases/ordinals/roles, equality expectation, and distinct count of 2.

Raw Message bodies are unnecessary for the base count/role/boundary oracle.
Fixture-identifying Title, location, and Conversation identifier remain
Runtime-only.

### Existing fixture oracle

An existing Conversation is acceptable only when the same complete oracle was
established independently of the candidate surfaces to be evaluated. A user
assertion containing only an approximate count, initial/final mounted items, or
a count obtained by scrolling is insufficient.

## Long-100 Preparation Result

| Field | Required value / status | Current result |
|---|---|---|
| Alias | `Long-100` | reserved planning alias only |
| Source Type | Standard planned | not fixture-bound |
| Unique binding | exactly 1 | not provided |
| Exact expected count | 100 | design target only; not attested for a fixture |
| First boundary alias | ordinal 1 | not established |
| Last boundary alias | ordinal 100 | not established |
| Per-ordinal role ledger | 100 entries; controlled design may use 50 alternating pairs | not provided |
| Expected distinct occurrence count | 100 | design target only; not attested for a fixture |
| Provenance | construction ledger or independent oracle | not provided |
| Frozen before observation | true | not established |
| Runtime-only identification metadata | uniquely available | not provided |
| Optional exact duplicate-body case | declaration plus details if included | not declared; non-blocking |

```text
LONG_100_FIXTURE: NOT DESIGNATED
LONG_100_GROUND_TRUTH: NOT ESTABLISHED
```

## Long-200 Preparation Result

| Field | Required value / status | Current result |
|---|---|---|
| Alias | `Long-200` | reserved planning alias only |
| Source Type | Standard planned | not fixture-bound |
| Unique binding | exactly 1 | not provided |
| Exact expected count | 200 | design target only; not attested for a fixture |
| First boundary alias | ordinal 1 | not established |
| Last boundary alias | ordinal 200 | not established |
| Per-ordinal role ledger | 200 entries; controlled design may use 100 alternating pairs | not provided |
| Expected distinct occurrence count | 200 | design target only; not attested for a fixture |
| Provenance | construction ledger or independent oracle | not provided |
| Frozen before observation | true | not established |
| Runtime-only identification metadata | uniquely available | not provided |
| Optional exact duplicate-body case | declaration plus details if included | not declared; non-blocking |

```text
LONG_200_FIXTURE: NOT DESIGNATED
LONG_200_GROUND_TRUTH: NOT ESTABLISHED
```

## Privacy / Evidence Boundary

`PRIVACY_SAFE_OBSERVATION_SCHEMA: READY`

The future observation schema is fixed before Discovery. Data allowed to leave
the Runtime observation boundary includes:

- fixture alias;
- expected/captured/mounted/union counts;
- safe occurrence aliases, ordinals, roles, and lengths;
- first/last boundary booleans;
- identity equality/dedup booleans without raw runtime identity;
- scan step number and non-identifying scroll metrics;
- candidate states, safe violation codes, and exact-match booleans;
- Ground Truth provenance/freeze classifications without raw locator values.

The following must remain Runtime-only and must not be stored in Evidence,
logs, fixtures, or source:

- raw Conversation or Message content;
- raw fixture Title;
- raw location, pathname, or Conversation identifier;
- raw runtime Message identity;
- DOM/HTML snapshots;
- cookies, tokens, credentials, or authorization material.

Future tooling must sanitize its output before it crosses the harness/tool
boundary. The schema being ready does not mean a capture harness or PoC has been
implemented.

## Discovery Entry Verdict

| Entry criterion | Result | Blocking? |
|---|---|---|
| Long-100 designated and uniquely bound | NO | YES |
| Long-200 designated and uniquely bound | NO | YES |
| Exact 100 / 200 expected counts independently attested | NO | YES |
| First/last boundary oracles established | NO | YES |
| Complete per-ordinal role ledgers established | NO | YES |
| Exact distinct occurrence counts independently attested | NO | YES |
| Candidate-independent provenance and freeze established | NO | YES |
| Runtime Candidate / Ground Truth separation fixed | YES | NO |
| TV-005 loading and TV-006 completeness Tracks separated | YES | NO |
| Candidate Completeness Signal not preselected | YES | NO |
| Privacy-safe observation format defined | YES | NO |
| Production waiting/orchestration assumed | NO | NO |
| Optional duplicate-body case supplied | NO | NO |

```text
TASK-003 DISCOVERY ENTRY: BLOCKED
BLOCKING: LONG_FIXTURE_GROUND_TRUTH_INPUT_NOT_ESTABLISHED
```

The blocked Entry is not evidence that TV-005 or TV-006 has failed. Neither
Validation has started.

## Minimum Blocking Input

The user must provide one complete, pre-observation Ground Truth package for
each of `Long-100` and `Long-200`. The minimum package is:

1. confirmation that the fixture exists and is uniquely bound, with its raw
   identifying metadata supplied Runtime-only;
2. Source Type confirmation;
3. exact expected count confirmation: 100 or 200 as applicable;
4. safe first and last boundary aliases bound to ordinals 1 and final;
5. a frozen per-ordinal alias/role ledger, or a frozen construction record that
   expands deterministically to every ordinal and role;
6. exact distinct Message occurrence count confirmation: 100 or 200;
7. provenance classification and attestation that the oracle was fixed before
   candidate observation and was not derived from DOM, scrolling, scan union,
   container counts, scroll metrics, or a completeness signal;
8. optional duplicate-body declaration (`included` or `not included`); when
   included, safe occurrence aliases/ordinals/roles, expected equality, and
   expected distinct occurrence count.

If the fixtures do not yet exist, the minimum next input is the user's choice
to construct the two dedicated controlled fixtures using the ledger contract.
Construction itself is outside this Round.

## Requirement / ADR / Acceptance / Risk Impact

- FR-007 and ADR-005 retain the whole-Conversation acquisition boundary.
- FR-008, NFR-001, NFR-002, and ADR-006 require Fail Closed behavior when
  completeness cannot be established. Blocking Discovery before a valid oracle
  is consistent with that boundary.
- NFR-007 supports the Long-200 design target without creating a strict SLA.
- AT-007 and AT-008 receive planning traceability only; no Production
  Acceptance Test was executed.
- RISK-002 remains open. No lazy-loading or completeness mitigation was
  validated in this preparation Round.
- Requirement change: **NO**.
- ADR change: **NO**.
- Acceptance Test change: **NO**.
- Risk Register change: **NO**.
- Development Backlog change: **NO**.

## Repository / Security Check

- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan of this new Evidence: **PASS**.
- Direct restricted-value/content scan of this new Evidence: **PASS**.
- Pre-existing `TASK-003-scope-plan.md`: **unchanged**.
- Changed in this Round: this new Fixture / Ground Truth Preparation Evidence
  only.
- `docs/`, `AGENTS.md`, `src/`, TASK-001 assets, TASK-002 assets, and Production
  files: **unchanged**.
- PoC / self-test files created: **none**.
- Production implementation: **none**.

## Status After Preparation

```text
TASK-001 Final Exit: PASS / COMPLETE
TASK-002 Final Exit: PASS / COMPLETE

TV-003 Overall Final Verdict: PASS
TV-004 Final Verdict: PASS

TASK-003 Scope Planning: COMPLETE
TASK-003 Fixture / Ground Truth Preparation: COMPLETE
TASK-003 Discovery: NOT STARTED

TV-005 Verdict: NOT SET
TV-006 Verdict: NOT SET

TASK-003 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

**TASK-003 Long-100 / Long-200 Fixture Construction and Ground Truth Input
Completion**

Use dedicated controlled construction ledgers unless complete independent
oracles already exist. After both packages are frozen and accepted, perform a
separate Discovery Entry review. Do not begin TV-005 / TV-006 observation until
the gate becomes READY.
