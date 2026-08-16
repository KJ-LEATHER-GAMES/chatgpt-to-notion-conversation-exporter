# TASK-002 Project Chat DOM Spike — Discovery Round 3

## Status

- Observation date: 2026-08-16
- TASK-002 Discovery: **IN PROGRESS**
- TASK-002 Discovery Round 1: **COMPLETE**
- TASK-002 Discovery Round 2: **COMPLETE**
- TASK-002 Discovery Round 3: **COMPLETE**
- TV-004 Ground Truth: **PRE-ESTABLISHED**
- TV-004 Candidate Inventory: **PROJECT-A / PROJECT-B / STANDARD-CONTROL / DYNAMIC STATES OBSERVED**
- TV-004 Verdict: **NOT SET**
- TV-003 Project CID Ground Truth: **ESTABLISHED**
- TV-003 Project Coverage Candidate Inventory: **PROJECT-A / PROJECT-B INITIAL + DYNAMIC STATES OBSERVED**
- TV-003 Project Coverage Verdict: **NOT SET**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-002 Final Exit: **NOT SET**
- Phase 0 Exit: **NOT MET**
- Production implementation: none
- CANDIDATE_DECISION_READY: **YES**

## Scope and Method

This round observed dynamic behavior only. It did not decide Candidate roles, selectors, route grammar, ID format, fallback, Fail Closed acceptance, waiting behavior, or any Verdict.

- Runtime Ground Truth remained candidate-independent and pre-established.
- Raw Project Name, fixture Title, Conversation ID, URL, pathname, href, and canonical values remained Runtime-only.
- Browser host current-tab URL and page execution route were captured as separate inputs.
- Page snapshots contained only the Round 1 / Round 2 structural candidate families.
- Snapshot sampling was explicit and manual. No fixed sleep, polling loop, retry rule, timeout, MutationObserver, or Production settled algorithm was used.
- A later observation means only a subsequent explicit observation after the prior capture, not a duration contract.
- The Project-A / Project-B same-tab movements used the Runtime-held known fixture locations. No URL was constructed or guessed. The target Conversation anchor was not mounted in the source fixture DOM, so the observation did not claim a sidebar-click transition.
- Back / Forward used the history created by those same-tab movements.
- Direct Load used a new authenticated Chrome tab and a Runtime-held known Project-A location.

### Observation Harness Integrity

The initial draft capture scoped navigation to the first `nav` element and produced a false ABSENT result. A read-only check showed that the current anchor was in another navigation scope. Before the accepted matrix was executed:

- the snapshot scope was corrected to all navigation and header structural scopes;
- Project Navigation Name relation was restricted to the name root sharing the current anchor's navigation list item;
- inventory-wide exact text was not selected as the current Project Name;
- the invalid draft samples were discarded and are not used as Evidence;
- Project-A reload was rerun from a confirmed `CONSISTENT_TARGET` state.

No Candidate Decision, Production selector, or fallback was introduced by the harness correction.

## Relation and Matrix Notation

- `T`: `TARGET_GT`
- `P`: `PREVIOUS_GT`
- `N`: `NEITHER_GT`
- `0`: `ABSENT`
- `M`: `AMBIGUOUS`
- `CT`: `CONSISTENT_TARGET`
- `CP`: `CONSISTENT_PREVIOUS`
- `MR`: `MISSING_REQUIRED_MATERIAL`
- `DA p/e/n`: `data-active` present / empty-valued / non-empty-valued counts on current-route anchors
- `AC`: `aria-current` count on current-route anchors

The observation labels are not Production state enums or error codes.

## Operation Matrix Summary

### Project-A Reload

| Snapshot | Document | Nav Name | Header Name | Header Link | Host / Page | Active / Nested | Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|---|---|---|---|
| Pre confirmed | complete | T / group 1 | T / group 1 | T / count 1 | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |
| Earliest practical | loading | 0 | 0 | 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Reload return | interactive | 0 | 0 | 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Later | complete | T / group 1 | T / group 1 | T / count 1 | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |

Observed route structure remained segment lengths `[1, 36, 1, 36]`, with one target CID match at zero-based position 3 and no query or fragment.

### Project-B Reload

| Snapshot | Document | Nav Name | Header Name | Header Link | Host / Page | Active / Nested | Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|---|---|---|---|
| Pre confirmed | complete | T / group 1 | T / group 1 | T / count 1 | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |
| Earliest practical | loading | 0 | 0 | 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Reload return | interactive | 0 | 0 | 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Later | complete | T / group 1 | T / group 1 | T / count 1 | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |

Project-B reproduced the Project-A reload ordering. No foreign Project value was observed during either same-fixture reload.

### Project-A → Project-B

| Snapshot | Document | Nav Name | Header Name | Header Link | Host / Page | Active / Nested | Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|---|---|---|---|
| Pre confirmed | complete | P / bound group 1 | P / group 1 | P / count 1 | P / P | P / P | P / count 1 | 1; 1/1/0; 0 | CP |
| Earliest practical | complete | 0 | P / group 1 | P / count 1 | P / P | P / P | P / count 1 | 1; 1/1/0; 0 | MR |
| Route return | interactive | 0 | 0 | 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Later | complete | T / bound group 1 | T / group 1 | T / count 1 | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |

Before movement, the short Project-B name also appeared in the wider navigation inventory, but only the Project-A name group shared the current anchor's navigation list item. Inventory-wide exact text would therefore have been ambiguous; current-bound structural scoping resolved the observation without selecting a Production rule.

### Project-B → Project-A

| Snapshot | Document | Nav Name | Header Name | Header Link | Host / Page | Active / Nested | Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|---|---|---|---|
| Pre confirmed | complete | P / bound group 1 | P / group 1 | P / count 1 | P / P | P / P | P / count 1 | 1; 1/1/0; 0 | CP |
| Earliest practical | complete | 0 | P / group 1 | P / count 1 | P / P | P / P | P / count 1 | 1; 1/1/0; 0 | MR |
| Route return | interactive | 0 | 0 | 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Later | complete | T / bound group 1 | T / group 1 | T / count 1 | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |

The accepted A → B and B → A samples reproduced the same ordering. No source-group mismatch with target route plus previous header/canonical was observed in either direction.

### Back / Forward

#### Back to Project-B

| Snapshot | Nav / Header / Link | Host before → after | Page / Active / Nested / Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|
| Pre | P / P / P | P → P | P / P / P / P | 1; 1/1/0; 0 | CP |
| Earliest practical | T / T / T | P → T | T / T / T / T | 1; 1/1/0; 0 | CT after host change |
| Return | T / T / T | T → T | T / T / T / T | 1; 1/1/0; 0 | CT |

The Back earliest snapshot was not atomic at the browser-host boundary: the host value changed from previous to target while the two-phase snapshot was being collected. Page and DOM groups were already target by the time they were read.

#### Forward to Project-A

| Snapshot | Document | Nav / Header / Link | Host before → after | Page / Active / Nested / Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|---|
| Pre | complete | P / P / P | P → P | P / P / P / P | 1; 1/1/0; 0 | CP |
| Earliest practical | loading | 0 / 0 / 0 | P → T | T / 0 / 0 / T | 0; 0/0/0; 0 | MR |
| Return | interactive | 0 / 0 / 0 | T → T | T / 0 / 0 / T | 0; 0/0/0; 0 | MR |
| Later | complete | T / T / T | T → T | T / T / T / T | 1; 1/1/0; 0 | CT |

Back and Forward were not observationally symmetric. The API and page-cache behavior can hide or expose different portions of the transition; this does not prove that an unobserved transient cannot occur.

### Direct Load

| Snapshot | Document | Nav / Header / Link | Host / Page | Active / Nested | Canonical | Anchor count; DA p/e/n; AC | Cross-state |
|---|---|---|---|---|---|---|---|---|
| Earliest practical | complete, no main | 0 / 0 / 0 | N / N | 0 / 0 | 0 | 0; 0/0/0; 0 | MR |
| Navigation return | interactive | 0 / 0 / 0 | T / T | 0 / 0 | T / count 1 | 0; 0/0/0; 0 | MR |
| Later | complete | T / T / T | T / T | T / T | T / count 1 | 1; 1/1/0; 0 | CT |

The earliest Direct Load snapshot represented the new tab's non-Project starting document: one non-empty route segment of length 5, no target CID match, no canonical, and no Project candidate groups. Once the known Project route was current, host/page/canonical became target before Project Name and active navigation groups became available.

## Track A Dynamic Findings

- Both Project reloads reproduced the same sequence: route/canonical remained target while navigation name, header name, header link, and current Project binding were absent; later all Track A groups returned as target.
- Both Project movements reproduced a current-bound navigation-name disappearance before the previous header name/link disappeared.
- After the destination route became target, all Track A groups were temporarily absent before returning as target.
- Settled/current-candidate-established cardinality was navigation name root 1, header name root 1, and header Project-related link 1 in every final state.
- Observed transitional cardinality was 0, not 2+.
- Navigation and header were never observed with two different bound Project Ground Truth values. Observed disagreement was `navigation=ABSENT` with `header/link=PREVIOUS_GT`, or all Track A groups absent.
- An inventory-wide exact match for the short Project-B name existed while Project-A remained current. It was not bound to the current anchor's list item. This is direct false-positive material against selecting Project Name from unscoped navigation text inventory.
- Broad Project-token test-id / accessible markers were not used as Source Type proof and were not promoted by this round.
- Temporary generic/unknown Project Name: **NOT OBSERVED**.
- Project Name candidate ambiguity after current-bound grouping: **NOT OBSERVED**.

## Track B Dynamic Findings

- Browser host route and page route remained target through both same-fixture reloads.
- Canonical remained target through both reloads while active anchor and nested ID metadata were absent.
- For A → B and B → A, previous route/active/nested/canonical remained mutually previous in the earliest sample, then host/page/canonical became target while active anchor and nested ID were absent, then all Track B groups became target.
- Canonical=`PREVIOUS_GT` while page route=`TARGET_GT`: **NOT OBSERVED**.
- Browser/page whole-route mismatch at a completed page read: **NOT OBSERVED**.
- During Back and Forward, the host URL changed between the host-before and host-after reads of a single two-phase snapshot. This is a non-atomic capture observation, not a persisted browser/page mismatch.
- Settled/current-candidate-established active anchor cardinality was 1, scoped nested metadata cardinality was 1, and canonical cardinality was 1 in every final state.
- Active anchor 2+, scoped nested ID 2+, and canonical 2+: **NOT OBSERVED**.
- Anchor / nested internal mismatch: **NOT OBSERVED**.
- Active / page route mismatch in established states: **NOT OBSERVED**.
- Whenever the current anchor existed, `data-active` was present exactly once and empty-valued exactly once; non-empty-valued count was 0 and `aria-current` count was 0.
- Whenever the current anchor was absent, all four of those counts were 0.
- The observed Project route segment-length pattern `[1, 36, 1, 36]`, one target CID match at position 3, and absent query/fragment remained stable in every captured supported Project route state.
- The repeated route observation is not a Project route grammar, fixed-position contract, ID format, UUID semantic rule, or Product requirement.
- `og:url` remained present but `NEITHER_GT` in Project document states and absent in the new-tab starting document. It remained diagnostic-only.

## Transitional / Stale Findings

| Finding | Reproduction | Safe relation statement |
|---|---|---|
| Reload UI candidate gap | Project-A and Project-B | host/page/canonical=T; Project Name groups=0; active/nested=0 |
| Movement first unmount | A → B and B → A | navigation name=0; header/link=P; host/page/active/nested/canonical=P |
| Destination route before UI candidates | A → B and B → A | host/page/canonical=T; Project Name groups=0; active/nested=0 |
| Forward target route before UI candidates | Forward only | host changed P→T; page/canonical=T; Project Name groups=0; active/nested=0 |
| Direct Load initial non-Project state | Direct Load only | host/page=N; canonical=0; Project Name groups=0; active/nested=0 |
| Direct Load target route before UI candidates | Direct Load only | host/page/canonical=T; Project Name groups=0; active/nested=0 |
| Back host transition during snapshot | Back only | host changed P→T during capture; page/DOM/canonical=T when read |

Additional required finding classifications:

- Stale Project Name relative to the destination target: previous header/link values were observed while the browser/page route was still previous. Previous Project Name after the page route became target: **NOT OBSERVED**.
- Stale CID in active anchor after page route became target: **NOT OBSERVED**; the active candidate was absent instead.
- Stale canonical after page route became target: **NOT OBSERVED**.
- Missing current anchor: observed in both reloads, both movements after target route change, Forward, and Direct Load.
- Missing scoped nested metadata: same operations and snapshots as missing current anchor.
- Multiple current anchors: **NOT OBSERVED**.
- Route-shape change within supported Project route states: **NOT OBSERVED**.
- Query / fragment appearance within supported Project route states: **NOT OBSERVED**.

`NOT OBSERVED` does not mean the state cannot occur.

## Stable Final-State Findings

Every operation reached a later current-candidate-established observation:

| Operation | Track A all target | Host/page target and equal | Active/nested target and internally equal | Canonical target | Cross-state |
|---|---:|---:|---:|---:|---|
| Project-A Reload | true | true | true | true | CT |
| Project-B Reload | true | true | true | true | CT |
| Project-A → Project-B | true | true | true | true | CT |
| Project-B → Project-A | true | true | true | true | CT |
| Back to Project-B | true | true | true | true | CT |
| Forward to Project-A | true | true | true | true | CT |
| Project-A Direct Load | true | true | true | true | CT |

This table describes observed final-state agreement only. It is not the final Candidate Decision acceptance predicate.

## Cross-Operation Comparison

- Reload behavior was reproduced across both Projects.
- A → B and B → A ordering was reproduced in both directions.
- Back exposed an already-current page/DOM state while the host value changed during the two-phase capture; Forward exposed the target route/canonical before UI candidate availability.
- Direct Load uniquely began from a non-Project `NEITHER_GT` route before the known Project route became current.
- Route and canonical were available earlier than active navigation candidates in both reloads, both movements after route return, Forward, and Direct Load.
- No single captured source family was continuously sufficient across every transitional snapshot.
- Inventory-wide Project Name text is unsafe as current Project selection material because the non-current Project-B name appeared in Project-A navigation inventory.
- No material structural anomaly blocked Candidate Decision preparation. Missing/transitional states are Decision inputs, not reasons to invent fallback during Discovery.

## Directional Differences

- A → B versus B → A: no material ordering difference observed in the accepted samples.
- Back versus Forward: materially different sampling result. Back's earliest page/DOM read was already target; Forward exposed a target-route/missing-UI state.
- The difference may reflect browser history/cache and API completion behavior. It is not generalized into a direction-specific Product rule.

## Back / Forward Limitations

- Browser operations may substantially progress before the earliest practical capture.
- Host URL and page/DOM reads are sequential, not an atomic browser snapshot.
- Back's missing-UI transition, if any, was not observable in this run.
- No claim is made that Back has no transient state.
- No duration, retry, polling, or waiting contract was inferred.

## Direct Load Findings

- A new authenticated Chrome tab was used.
- The known Project-A location came from Runtime-held fixture state; it was not constructed from an inferred route grammar.
- Initial non-Project tab state was `NEITHER_GT` with all Project/current Conversation material absent.
- Target host/page/canonical became available before Track A and active navigation Track B candidates.
- Later all tracked candidate groups agreed with Project-A Ground Truth.
- The temporary tab was released after observation; the original Project fixture tabs were retained for handoff.

## Not Yet Decided

- Project Source Type detection strategy.
- Project Name Primary.
- Project Name required cross-check.
- Conversation ID Primary.
- Conversation ID required cross-check.
- Project route grammar.
- Project CID segment-position contract.
- Project Conversation ID format.
- Current binding predicate.
- Canonical role.
- Selector contract.
- Fallback.
- Fail Closed acceptance contract.
- Production state machine.
- Fixed sleep, polling interval, retry, timeout, or settled/waiting algorithm.
- Production behavior or error mapping.
- TV-004 Verdict.
- TV-003 Project Coverage Verdict.
- TV-003 Overall Final Verdict.
- TASK-002 Final Exit.
- Phase 0 Exit.

## Requirement / ADR / Risk Impact

- **FR-004**: Browser-host URL remained a separate input from page route. Current Project CID eventually matched the independent Ground Truth after reload, movement, Back / Forward, and Direct Load. No URL was guessed.
- **FR-006**: Both Projects reproduced Project-bound navigation/header structures and navigation behavior. Transitional absence and unscoped-name false-positive material must be considered by the later Candidate Decision.
- **FR-011**: Complete Project Name and Conversation ID candidates eventually returned after every operation, but route-only or canonical-only transitional states cannot by themselves establish all required metadata.
- **ADR-006**: Missing and mixed transition material was observed directly. This round did not accept those states or define the final Fail Closed contract.
- **ADR-014**: Conversation ID relation and navigation route remained separate concepts; raw URL was not treated as the identity value.
- **AT-002**: Multiple Projects, reload, movement, and final current Project Name agreement now have dynamic Evidence. Source Type decision remains pending.
- **AT-004**: Host/page/active/nested/canonical consistency can be evaluated dynamically. Production `CONVERSATION_ID_MISMATCH` mapping remains unimplemented and undecided.
- **AT-010**: Project Name absence was reproduced during valid transitions. Production `META_PROJECT_NAME_NOT_FOUND` mapping and waiting boundary remain deferred.
- **RISK-003**: Current Project UI exposes reproducible structures, but transitional unmounting and inventory-wide false positives remain UI-drift risks.
- **RISK-004**: Project Name becomes temporarily absent and cannot be safely taken from unscoped inventory. Later final-state exact equality reduces current-UI uncertainty but does not eliminate the risk.
- **RISK-029**: Project route, active navigation, nested metadata, and canonical eventually agree across dynamic operations. Source availability ordering and future route/format drift remain open risks.

Source-of-Truth documents were not modified.

## Known Limitations

- Two Project fixtures, current ChatGPT UI, authenticated Chrome, one primary viewport.
- Same-tab A/B movement used known fixture locations rather than a mounted target sidebar anchor.
- Browser/page/DOM capture is sequential, not atomic.
- Intermediate states can be missed between explicit captures.
- No UI-link-specific SPA transition conclusion is made.
- No malformed, duplicate, or mismatched live candidate was synthesized.
- No Production waiting or settled algorithm was tested.
- No Candidate Decision or PoC was implemented.

## Repository / Security Check

- Changed in this round: this new Round 3 Evidence file only.
- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan: **PASS**.
- Raw Project Name / fixture Title scan: **PASS; no raw fixture value persisted**.
- Raw Conversation ID / UUID-like literal scan: **PASS; no raw identifier persisted**.
- Raw ChatGPT URL / pathname / href / canonical value scan: **PASS; no raw route value persisted**.
- Raw Conversation body / DOM / HTML snapshot scan: **PASS; none persisted**.
- Credential / cookie / token / authorization-value scan: **PASS; none persisted**.
- Round 1 Evidence: unchanged from the pre-round SHA-256 reference.
- Round 2 Evidence: unchanged from the pre-round SHA-256 reference.
- `docs/`, `AGENTS.md`, `src/`, TASK-001 assets, existing TASK-002 Evidence, and Production files: unchanged by this round.
- Production implementation: none.

## Recommended Next Action

Proceed to **TASK-002 Candidate Decision** after review.

Candidate Decision should evaluate the observed current-bound Project Name grouping, route/page/active/nested/canonical consistency materials, transient missing states, unscoped navigation false-positive material, and the absence of any confirmed safe fallback. This round does not start that Decision.
