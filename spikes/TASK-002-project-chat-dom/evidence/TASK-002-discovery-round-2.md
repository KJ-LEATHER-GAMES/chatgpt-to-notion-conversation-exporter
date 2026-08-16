# TASK-002 Project Chat DOM Spike — Discovery Round 2

## Status

- TASK-002 Discovery: **IN PROGRESS**
- TASK-002 Discovery Round 1: **COMPLETE**
- TASK-002 Discovery Round 2: **COMPLETE**
- TV-004 Ground Truth: **PRE-ESTABLISHED**
- TV-004 Candidate Inventory: **PROJECT-A / PROJECT-B / STANDARD-CONTROL OBSERVED**
- TV-004 Verdict: **NOT SET**
- TV-003 Project CID Ground Truth: **ESTABLISHED**
- TV-003 Project Coverage Candidate Inventory: **PROJECT-A / PROJECT-B INITIAL STATES OBSERVED**
- TV-003 Project Coverage Verdict: **NOT SET**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-002 Final Exit: **NOT SET**
- Phase 0 Exit: **NOT MET**
- Production implementation: none

## Scope

This round is observation-only. It compares the initial current state of Project-B with the Project-A Round 1 observations and uses Standard-Control as a negative control for Project classification material.

- Observed: Project-B initial current state; Standard-Control initial current state.
- Not executed: reload, Project-to-Project navigation, Back / Forward, Direct Load.
- Not decided: Candidate Decision, Primary, required cross-check, selector, route grammar, CID position contract, ID format, fallback, Fail Closed contract, settled algorithm, Production behavior, or any Verdict.
- Track separation maintained:
  - Track A: TV-004 Project detection / Project Name.
  - Track B: TV-003 Conversation ID — Project Coverage.
- Project Name, Conversation ID, and fixture-identification Title were not used as one another's oracle.

## Runtime Ground Truth Discipline

- Project-B Expected Source Type: **Project**; pre-established before candidate observation.
- Project-B complete Project Name: present in Runtime memory; length **5**; raw value not persisted.
- Project-B exact Conversation ID: present in Runtime memory; length **36**; raw value not persisted.
- Standard-Control Expected Source Type: **Standard**; pre-established known Standard fixture.
- Conversation Title was used only to locate the designated already-open fixture tab.
- Candidate values did not generate, modify, repair, or self-approve Ground Truth.

## Environment and Observation State

- Date: 2026-08-16
- Browser: authenticated Chrome
- Project-B fixture: confirmed by runtime-only fixture identification metadata.
- Standard-Control fixture: confirmed by runtime-only fixture identification metadata.
- Browser/host current-tab URL capture: performed separately from each page execution context.
- Page observation: read-only.
- Project-B document state: complete; main surface present exactly 1.
- Standard-Control document state: complete; main surface present exactly 1.
- Primary viewport during both Round 2 observations: 1920 x 911.
- Transition state observed: **NO**.
- Current initial candidate state available: **YES** for both fixtures.
- Page state mutation: none beyond claiming the already-open tabs for read-only observation.

## Project-B Track A Candidate Inventory — Project Name

Exact Ground Truth equality was evaluated in Runtime memory. Because the expected Project Name is short, broad substring matches were not counted as independent Project Name candidates. Exact matches outside the structurally scoped navigation and header groups were **0**.

| Alias | Source family | Raw cardinality | Structural groups | Value present | Value length | GT exact | Binding / structural relation | Truncation observation | Observation-only assessment |
|---|---|---:|---:|---|---:|---|---|---|---|
| R2-A01 | Project navigation text group | 4 | 1 | true | 5 | true | Root group is under a navigation list item that also contains the current-route Conversation anchor | CSS supports ellipsis; actual horizontal overflow false; DOM value full | Reproduces Project-A navigation name group |
| R2-A02 | Header text group | 7 | 1 | true | 5 | true | Root group contains one Project-related header anchor | CSS supports ellipsis; actual horizontal overflow false; DOM value full | Reproduces Project-A header name group |
| R2-A03 | Header Project-related link text | 1 | 1 | true | 5 | true | Same-origin Project-related route; not the current Conversation path | No observed DOM truncation | Reproduces Project-A header-link relationship |
| R2-A04 | Project-Name-containing accessible names | 7 | 2 scoped name groups | true | 18–44 | false | Wrapped labels distributed across the navigation and header groups | Not evaluated as a clipping source | Source-internal accessible surfaces, not independent full-name candidates |
| R2-A05 | Project-Name-containing `title` values | 0 | 0 | false | N/A | false | Not available | N/A | NOT AVAILABLE |
| R2-A06 | Project-named data attributes | 0 | 0 | false | N/A | false | Not available | N/A | NOT AVAILABLE |
| R2-A07 | Document title surface | 1 underlying document-title group | 1 | true | 19 | false | Document-level, not bound as a Project Name surface | N/A | REJECT material for exact Project Name in this state |

Project-B exact Project Name element totals:

- Raw exact elements: **11**.
- Root-most exact structural groups: **2**.
- Leaf exact elements: **2**.
- Underlying full-name groups: navigation **1**, header **1**.
- Exact matches outside those scoped groups: **0**.

## Project-B Track A Candidate Inventory — Source Type Materials

| Alias | Candidate family | Present | Cardinality / distribution | Structural relation | Project-A reproducible | Observation-only assessment |
|---|---|---:|---|---|---:|---|
| R2-S01 | Project navigation name/current-Conversation grouping | true | 1 group | Full Project Name group and current-route anchor share one navigation list item | true | Project-bound structural material |
| R2-S02 | Header Project-related link | true | 1 | Header full-name group contains the link | true | Project-related structural material |
| R2-S03 | Project-related current document route material | true | Current route has 4 non-empty segments | Browser host and page route agree; exact CID occurs once | true | Project candidate material; no route contract decided |
| R2-S04 | Project-token test-id markers | true | 7 total: header 1, main 1, navigation 5 | Broad markers across regions | true, cardinality differs | Non-unique semantic material; unsafe alone |
| R2-S05 | Project-token accessible markers | true | 38 total: header 1, main 1, navigation 36 | Broad markers across regions; 7 also wrap Project Name | true, cardinality differs | Non-unique semantic material; unsafe alone |
| R2-S06 | Project-specific named data attributes | false | 0 | Not available | true | NOT AVAILABLE in both Projects |

## Project-B Track B Candidate Inventory

| Alias | Source family | Available | Cardinality | CID candidate length | Project-B CID GT exact | Binding / structural relation | Observation-only assessment |
|---|---|---:|---:|---:|---:|---|---|
| R2-B01 | Browser host current-tab route | true | 1 | 36 | true | Host boundary input, separate from page execution | Current candidate surface |
| R2-B02 | Page `location.href` route | true | 1 | 36 | true | Whole current route agrees with host input | Same document-route source group as other page URL APIs |
| R2-B03 | Page `location.pathname` | true | 1 | 36 | true | Equals parsed page pathname | Page route consistency surface |
| R2-B04 | Page `document.URL` route | true | 1 | 36 | true | Whole current route agrees with host input and `location.href` | Page route consistency surface |
| R2-B05 | Current-route navigation anchor href | true | 1 | 36 | true | Located in navigation and exactly matches the current document route | Current-Conversation-bound candidate surface |
| R2-B06 | Scoped nested machine-readable ID metadata | true | 1 within current anchor | 36 | true | Nested under R2-B05; equals the anchor route candidate | Same active-item source group; internal cross-surface material |
| R2-B07 | Canonical route metadata | true | 1 | 36 | true | Whole route and extracted candidate agree with current route | Head metadata candidate surface |
| R2-B08 | `og:url` metadata | true | 1 | N/A | false | Does not represent the current Conversation route | REJECT material as Project CID in this state |
| R2-B09 | Main standalone Conversation ID metadata | false | 0 | N/A | false | No exact CID-bearing standalone main metadata found | NOT AVAILABLE |
| R2-B10 | Active/current state attributes | partial | `data-active` present on 1 current anchor; true-valued count 0; `aria-current` count 0 | N/A | N/A | Empty-valued `data-active` belongs to R2-B05 | Binding diagnostic only; semantics not decided |
| R2-B11 | Same-document fragment anchor | true | 1 | N/A | false | Fragment-only anchor does not contain the CID | REJECT material as CID source |

Additional inventories:

- Global nested machine-readable ID metadata count: **38**.
- Exact Project-B CID metadata matches globally: **1**.
- Exact Project-B CID metadata matches within the current anchor: **1**.
- Main weak conversation-related attributes: **16**, all empty-valued and not standalone Conversation ID candidates.
- Current-route anchors by resolved same-document route: **2**; only **1** is the scoped current navigation anchor used above.
- Inventory-wide matches were not used to select a current Conversation ID.

### Project-B Generic Route Observation

| Item | Result |
|---|---|
| Browser host URL present | true |
| Browser/page whole-route equality | true |
| Page URL API internal equality | true |
| Browser/page origin equality | true |
| Browser/page pathname equality | true |
| Pathname segment count | 4 |
| Segment length pattern | [1, 36, 1, 36] |
| CID GT exact-match segment count | 1 |
| CID GT exact-match zero-based position | 3 |
| Query present | false |
| Query CID GT match count | 0 |
| Fragment present | false |
| Fragment CID GT match count | 0 |
| Project-related header route segment count | 3 |
| Project-related header route segment length pattern | [1, 46, 7] |
| Project-related header route CID GT matches | 0 |

These are Observed Facts for Project-B only and comparison material for Project-A. No Project route grammar, CID segment contract, or ID format is established by this round.

## Project-A / Project-B Track B Pattern Comparison

| Material | Project-A Round 1 | Project-B Round 2 | Reproduced |
|---|---|---|---:|
| Pathname segment count | 4 | 4 | true |
| Segment length pattern | [1, 36, 1, 36] | [1, 36, 1, 36] | true |
| CID GT exact-match position | 3 | 3 | true |
| Browser/page whole-route equality | true | true | true |
| Current-route navigation anchor count | 1 | 1 | true |
| Scoped nested ID metadata count | 1 | 1 | true |
| Anchor / nested / CID GT equality | true | true | true |
| Canonical count and current-route equality | 1 / true | 1 / true | true |
| Global nested metadata cardinality | 33 | 38 | false; inventory-dependent |
| Main standalone CID metadata | 0 | 0 | true |

This is a repeated observed pattern, not a Candidate Decision.

## Standard-Control Negative Observation

Standard-Control was observed only to assess whether Project candidate families could false-positive on a known Standard Chat. No Project Name or Project CID Ground Truth was applied to Standard-Control.

### Source Type Negative-Control Checks

| Candidate family | Present / count | Structural analogue | False-positive material | Observation-only assessment |
|---|---|---|---|---|
| Project navigation full-name/current-Conversation group | absent / 0 | absent within current Conversation list item | none observed | Project-A/B grouping not reproduced |
| Header full Project Name group | absent / 0 | absent | none observed | Project-A/B grouping not reproduced |
| Header Project-related link | absent / 0 | absent | none observed | Project-A/B header-link material not reproduced |
| Project-related route anchor | absent / 0 | absent in header, navigation, and global anchor inventory | none observed | Project-A/B Project-route link material not reproduced |
| Project-token test-id markers | present / 5 | all in navigation; 0 within current Conversation list item | yes | Global marker presence is not Project-unique |
| Project-token accessible markers | present / 25 | all in navigation; 0 within current Conversation list item | yes | Global marker presence is not Project-unique |
| Project-specific named data attributes | absent / 0 | absent | none observed | Not available as a discriminator |
| Project-semantic ancestor of current anchor | absent / 0 | absent | none observed | Current Conversation binding to Project material not reproduced |

### Standard-Control Route / Shared Surface Comparison

| Item | Standard-Control observation | Relation to Project-A/B |
|---|---|---|
| Browser/page whole-route equality | true | Shared current-route material |
| Pathname segment count | 2 | Project-A/B observed count 4 not reproduced |
| Segment length pattern | [1, 36] | Project-A/B observed pattern not reproduced |
| Project route token position | none | Project-A/B route structural material absent |
| Current-route navigation anchor | present exactly 1 | Shared Standard/Project current-Conversation surface |
| Scoped nested ID metadata | present exactly 1 | Shared Standard/Project active-item surface |
| Canonical current-route equality | true, count 1 | Shared Standard/Project head surface |
| `data-active` representation | present empty-valued on current anchor | Shared observation; detector semantics not established |
| `aria-current` | absent | Shared absence in observed fixtures |
| `og:url` current-route equality | false | Shared non-current head metadata behavior |
| Main standalone Conversation ID metadata | absent | Shared absence |

Standard-Control's current-route anchor, scoped nested metadata, canonical equality, and empty-valued `data-active` demonstrate that these materials are Conversation-currentness candidates but are not, by themselves, Project Source Type discriminators.

## Cross-Fixture Comparison Matrix

| Material | Project-A | Project-B | Standard-Control | Classification |
|---|---|---|---|---|
| Navigation full Project Name group | present; 1 group | present; 1 group | Project-bound analogue absent | Reproduced Project pattern |
| Header full Project Name group | present; 1 group | present; 1 group | absent | Reproduced Project-only candidate material |
| Project-related header link | present; 1 | present; 1 | absent | Reproduced Project-only candidate material |
| Project navigation/current Conversation binding | same navigation list item | same navigation list item | Project-semantic binding absent | Reproduced Project pattern |
| Project-token test-id markers | present; 9 | present; 7 | present; 5 | Shared non-unique semantic marker |
| Project-token accessible markers | present; 35 | present; 38 | present; 25 | Shared non-unique semantic marker |
| Pathname segment count | 4 | 4 | 2 | Reproduced Project pattern; no grammar decision |
| Segment length pattern | [1, 36, 1, 36] | [1, 36, 1, 36] | [1, 36] | Reproduced Project pattern; no ID-format decision |
| CID GT match position | 3 | 3 | N/A | Reproduced Project pattern against independent fixture GT |
| Current-route anchor | present; 1 | present; 1 | present; 1 | Shared Standard/Project material |
| Scoped nested ID metadata | present; 1 | present; 1 | present; 1 | Shared Standard/Project material |
| Canonical current-route equality | true; count 1 | true; count 1 | true; count 1 | Shared Standard/Project material |
| Main standalone CID metadata | absent | absent | absent | Unavailable candidate |

## Source Grouping Review

No claim is made that structurally separate DOM groups have independent internal data-generation paths.

| Round 1 group | Project-B analogue | Standard-Control analogue | Cross-fixture reproducibility | Viable Candidate Decision input |
|---|---|---|---|---|
| G-A01 Project Navigation Surface | present; same full-name/current-anchor grouping | Project-bound grouping absent | reproduced across both Projects; not reproduced as Project binding in Standard | **YES**, as Track A input; not selected |
| G-A02 Project Header Surface | present; full-name group and one Project-related link | absent | reproduced across both Projects only | **YES**, as Track A input; not selected |
| G-A03 Project Semantic Marker Surface | present with varying counts | present with varying counts | broadly shared and non-unique | **LIMITED**, contextual diagnostic only |
| G-A04 Document Title Surface | present but Project Name GT mismatch | present but no Project Name oracle applied | not a full Project Name surface in Project-A/B | **NO** for exact Project Name based on current evidence |
| G-B01 Browser Host Route Surface | present and GT exact | present as Standard current-route source | shared route source; Project structure differs | **YES**, as Track B input; not selected |
| G-B02 Current Document Route Surface | present and host-consistent | present and host-consistent | shared source-internal route surfaces | **YES**, as Track B consistency input; not independent source count inflation |
| G-B03 Active Conversation Navigation Surface | present; scoped anchor and nested metadata agree with GT | present with analogous current anchor and nested metadata | shared Standard/Project currentness structure | **YES**, as Track B input; not a Project detector alone |
| G-B04 Head Route Metadata Surface | canonical current; `og:url` non-current | same structural behavior | shared across Project-B and Standard-Control; Project-A same | **YES** for later Track B decision input; role undecided |
| G-B05 Main Conversation Metadata Surface | no standalone CID candidate | no standalone CID candidate | unavailable across compared fixtures | **NO / NOT AVAILABLE** |

## Discovery Findings

### Confirmed Cross-Project Facts

- Project-A and Project-B each expose two underlying exact full Project Name structural groups: one navigation group and one header group.
- In both Projects, the navigation name group shares a navigation list item with the current-route Conversation anchor.
- In both Projects, the header name group contains exactly one Project-related link whose text equals the independent Project Name Ground Truth.
- Visual ellipsis-capable CSS did not produce actual horizontal overflow in either observed Project; the DOM values remained complete and exact.
- Both Projects have the same observed current-route segment count and segment-length pattern, with exactly one independent CID Ground Truth match at the same zero-based position.
- In both Projects, browser-host and page route surfaces agree in the initial current state.
- In both Projects, exactly one current navigation anchor, one scoped nested machine-readable ID, and one canonical candidate agree with independent CID Ground Truth.
- Both Projects have broad Project-token test-id and accessible marker families, but their global cardinalities differ.
- Neither Project exposes a Project-named data attribute, an exact Project Name in the document-title surface, or a standalone main Conversation ID candidate in the observed state.

### Project-A-only Facts

- No material candidate family remains uniquely supported only by Project-A after Project-B comparison.
- Project-A-only numeric observations remain historical diagnostics: viewport height, broad semantic-marker cardinalities, global nested metadata count, and weak main-attribute count. They are not cross-Project invariants.

### Project-B-only / New Facts

- The short Project-B Project Name produced **0** accidental exact matches outside the scoped navigation and header groups, reducing the broad-substring false-positive concern for this fixture without proving a general rule.
- Project-B introduced no new candidate source family beyond the Project-A Round 1 inventory.
- Project-B global marker, nested metadata, and weak main-attribute counts differ from Project-A, confirming that those inventory totals are not stable identity invariants.

### Standard-Control Negative-Control Facts

- The Project navigation/full-name binding and Project header-link structures observed in both Project fixtures were absent from Standard-Control.
- Global Project-token test-id and accessible markers were present in Standard-Control, so their mere presence is false-positive material and cannot independently prove Source Type=`Project`.
- No Project-token marker or Project-semantic ancestor was found within Standard-Control's current Conversation list item.
- Standard-Control did not reproduce the observed four-segment Project route pattern.
- Current-route anchor, scoped nested ID metadata, canonical current-route equality, and empty-valued `data-active` are shared Standard/Project materials and do not independently detect Project Source Type.

### Not Yet Decided

- Project Source Type detection strategy.
- Project Name Primary candidate.
- Project Name required cross-check.
- Conversation ID Primary candidate.
- Conversation ID required cross-check.
- Project route grammar.
- Project CID segment position contract.
- Project Conversation ID format.
- Current Project / Conversation binding predicate.
- Canonical role.
- Selector contract.
- Fallback.
- Fail Closed contract.
- Settled / waiting algorithm.
- Production behavior.
- TV-004 Verdict, TV-003 Project Coverage Verdict, TV-003 Overall Final Verdict, TASK-002 Final Exit, and Phase 0 Exit.

## Known Limitations

- Initial current states only; reload and navigation currentness are not evaluated in this round.
- Two Project fixtures and one Standard negative control in the current ChatGPT UI.
- Chrome, one primary viewport.
- Broad marker inventories are UI-state dependent and were not treated as stable cardinality contracts.
- Structural-source observations do not prove independent internal data-generation paths.
- No selector, route grammar, ID format, fallback, or Production contract has been selected.

## Requirement / ADR / Risk Impact

- FR-006 / TV-004: cross-Project structural Project materials and Standard negative-control differences now exist as Candidate Decision input; detection strategy remains unset.
- FR-011 / TV-004: two complete Project Name surface groups match independent Ground Truth in both Projects; required-metadata behavior remains undecided and unimplemented.
- FR-004 / TV-003 Project Coverage: host/page route, current anchor, scoped metadata, and canonical candidate structures reproduce in both Projects and match independent CID Ground Truth in initial current states.
- ADR-006: no unresolved or ambiguous-state contract is decided in this round; no candidate was silently promoted to Production success.
- ADR-014: raw URL was not treated as identity; Conversation ID and navigation route remained distinct concepts.
- AT-002 / AT-010: Project detection and Project Name evidence was expanded; Production error behavior is not implemented.
- AT-004: URL/ID consistency surfaces are observed across two Projects; mismatch handling remains for later Decision and PoC.
- RISK-003 / RISK-004: comparative Project structure and name evidence reduces uncertainty for the current UI but does not eliminate UI-drift risk.
- RISK-029: repeated Project CID candidate structure reduces initial-state uncertainty; transition/currentness and format risks remain open.

## Repository / Security Check

- Changed in this round: this new Round 2 Evidence file only.
- `git diff --check`: **PASS**.
- Direct trailing-whitespace scan: **PASS**.
- Raw Project Name / fixture Title scan: **PASS; no raw fixture values persisted**.
- Raw Conversation ID / UUID-like literal scan: **PASS; no raw identifier persisted**.
- Raw ChatGPT URL / pathname / href / canonical value scan: **PASS; no raw route value persisted**.
- Raw body / DOM / HTML snapshot scan: **PASS; none persisted**.
- Credential / cookie / token / authorization-value scan: **PASS; none persisted**.
- Round 1 Evidence: unchanged from the pre-round integrity reference.
- `docs/`, `AGENTS.md`, `src/`, TASK-001 assets, existing TASK-002 Evidence, and Production files: unchanged by this round.
- Production implementation: none.

## Recommended Next Action

Proceed to **TASK-002 Discovery Round 3 — Reload / Navigation / Currentness Matrix** after review. Do not infer Candidate Decision terms from this round alone.
