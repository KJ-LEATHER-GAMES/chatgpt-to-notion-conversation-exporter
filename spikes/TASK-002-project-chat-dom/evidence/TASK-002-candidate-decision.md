# TASK-002 Project Chat DOM Spike — Candidate Decision

## Status

- Decision date: 2026-08-16
- TASK-002 Discovery: **COMPLETE**
- TASK-002 Candidate Decision: **COMPLETE**
- TASK-002 Minimal PoC: **NOT STARTED**
- TV-004 Ground Truth: **PRE-ESTABLISHED**
- TV-004 Candidate Decision: **COMPLETE**
- TV-004 Verdict: **NOT SET**
- TV-003 Project CID Ground Truth: **ESTABLISHED**
- TV-003 Project Coverage Candidate Decision: **COMPLETE**
- TV-003 Project Coverage Verdict: **NOT SET**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-002 Final Exit: **NOT SET**
- Phase 0 Exit: **NOT MET**
- Production implementation: none
- `CANDIDATE_DECISION: COMPLETE`
- `POC_ENTRY: READY`

## Decision Scope

This Decision defines only the candidate strategy to validate in the TASK-002 Phase 0 Minimal PoC.

It decides source grouping, PoC roles, cardinality, current binding, source-internal and cross-group consistency, the observed Project route-shape boundary, single-snapshot currentness, Fail Closed behavior, fallback status, and PoC Entry Criteria.

It does not decide a Production selector, Production canonical source, Production fallback chain, waiting / polling / retry / timeout behavior, Production error mapping, `ProjectChatAdapter`, `src/` implementation, or any Verdict.

No additional browser observation, DOM exploration, candidate capture, or live validation was performed. The Decision uses only Discovery Round 1 / 2 / 3 Observed Facts.

## Decision Basis

Priority and traceability:

1. Product Requirements: FR-004, FR-006, FR-011.
2. ADR: ADR-006, ADR-014.
3. Acceptance Tests: AT-002, AT-004, AT-010.
4. Technical Validation: TV-003 Project Coverage and TV-004.
5. Risks: RISK-003, RISK-004, RISK-029.
6. Candidate-independent, pre-established Runtime Ground Truth.
7. TASK-002 Discovery Round 1 / 2 / 3.
8. TV-002 / TV-003 Standard Coverage decisions as validation principles only, not as Project Observed Facts.

The current Backlog assigns both TV-003 Project Coverage and TV-004 to TASK-002. Requirement, ADR, Acceptance Test, Risk Register, and Backlog semantics are unchanged by this Decision.

## Ground Truth Status and Separation

| Validation concern | Oracle status | Candidate separation |
|---|---|---|
| Source Type | Pre-established for Project-A / Project-B and Standard-Control | Not generated from route, DOM, Project Name, or Title candidate |
| Complete Project Name | Pre-established exact values for Project-A / Project-B | Not generated or repaired from Navigation / Header candidates |
| Project Conversation ID | Established exact values for Project-A / Project-B | Candidate-independent and pre-established; not generated or repaired from URL / route / DOM / canonical candidates |

Raw Ground Truth remains Runtime-only. Conversation Title remains fixture-identification metadata only and is not an oracle for either Track.

Runtime currentness and Technical Spike Ground Truth comparison remain separate:

- Runtime currentness uses only candidate cardinality, structural binding, route support, and source consistency.
- Technical Spike comparison checks the resolved Project Name and Conversation ID against the independent Runtime Ground Truth.
- A candidate disagreement never modifies Ground Truth.
- If all Runtime sources agree on the same wrong value, Runtime currentness may resolve, but the Technical Spike case must fail its Ground Truth comparison.

## Source Grouping

The following grouping is finalized for the Phase 0 PoC. Structurally distinct groups are validation surfaces; their internal ChatGPT data-generation paths are not proven independent.

| Source group | Contained Discovery material | Grouping / role boundary |
|---|---|---|
| `ProjectNavigationSurface` | Current-route navigation anchor, `data-active` presence, same-list-item full Project Name group, scoped nested ID metadata | One navigation subtree. Track A Project Name Primary and Track B active-navigation cross-check share this underlying DOM group; they are not independent from each other |
| `ProjectHeaderSurface` | Header full Project Name group and its contained Project-related link | One Header source group. Name and link are source-internal surfaces, structurally distinct from Navigation |
| `ProjectSemanticMarkerSurface` | Broad Project-token test-id / accessible markers | Non-unique diagnostic material only; counts are not invariants |
| `DocumentOrGlobalTextSurface` | Document title and unscoped/global text inventory | Not current-Project-bound; rejected for Project Name acquisition and detection |
| `BrowserHostRouteSurface` | Current browser tab URL acquired at the host/browser boundary | Track B Primary URL input required by FR-004 |
| `CurrentDocumentRouteSurface` | `location.href`, `document.URL`, `location.pathname` | One page-route source group with multiple source-internal API surfaces; not independent fallbacks |
| `ActiveConversationNavigationSurface` | Current-route anchor, its direct route value, `data-active` presence, scoped nested ID metadata | Track B view of the same underlying navigation subtree as `ProjectNavigationSurface`; required current-binding / ID cross-check |
| `HeadRouteMetadataSurface` | Canonical and `og:url` | Canonical is a required validation surface; `og:url` is rejected as CID material |
| `MainConversationMetadataSurface` | Standalone Conversation-level ID search result | No candidate available in the observed Project states |

## Track A Candidate Decision Table

| Candidate / source group | Decision | Phase 0 role | Required cardinality | Current-binding rule | Required consistency | Evidence basis | Known limitation |
|---|---|---|---|---|---|---|---|
| Current-bound full name in `ProjectNavigationSurface` | **ADOPT FOR TASK-002 POC** | Project Name Primary and required Source Type structural material | Current-route anchor exactly 1; same-list-item name root/group exactly 1 | Search all navigation structural scopes. The complete route-bearing anchor must equal the current route and share one navigation list item with the name group | Name non-empty; the selected structural group is unique | Both Projects reproduced one current-bound full-name group; Standard-Control did not. Inventory-wide exact search produced false-positive material | Production selector not decided; candidate temporarily disappears |
| `ProjectHeaderSurface` full name | **REQUIRED CROSS-CHECK** | Structurally distinct Project Name / Source Type validation surface | Header name root/group exactly 1 | No direct current-Conversation binding is claimed; currentness is inherited only through required equality with the Navigation Primary | Header name non-empty and equal to Navigation name | Both Projects reproduced one full-name Header group; Standard-Control did not | Header can retain the previous Project while Navigation is absent during movement |
| Project-related link inside `ProjectHeaderSurface` | **SOURCE-INTERNAL CONSISTENCY** | Confirms the selected Header group structure | Exactly 1 inside the Header name group | Must be contained by the selected Header group | Link text non-empty and equal to Header name and Navigation name | Both Projects reproduced one contained full-name link; Standard-Control did not | Link destination is not a CID source or Project identity oracle |
| Wrapped accessible names in Navigation / Header | **DIAGNOSTIC ONLY** | Structural diagnostics within the selected groups | No global cardinality invariant | Must not select a Project by broad accessible-name search | No prefix / suffix stripping; not used as resolved name | Observed values wrapped the name and were non-unique | Exact Project Name was not an accessible-name value |
| Broad Project-token test-id / aria-label markers | **REJECT AS DETECTOR / DIAGNOSTIC ONLY** | Optional diagnostics only | None | None | None | Present in both Project fixtures and Standard-Control with varying counts | False-positive material; counts are UI-state-dependent |
| Document title | **REJECT** | None | None | None | None | Did not equal Project Name Ground Truth | Conversation-title surface, not Project Name |
| Inventory-wide / document-wide exact text search | **REJECT** | None | None | None | None | A non-current Project name occurred in another Project's wider navigation inventory | Short or repeated names can false-positive; current binding absent |
| Project-named data attribute | **NOT AVAILABLE** | None | N/A | N/A | N/A | Count 0 in both Projects | No inferred fallback |

## Track A Source Type and Project Name Strategy

**Source Type Option C is adopted for the Phase 0 PoC.**

Source Type=`Project` is accepted only when all of the following Runtime candidate conditions hold in one snapshot:

1. A current-route navigation anchor is uniquely resolved across all navigation structural scopes.
2. The anchor is directly route-bearing, is bound to the current document route, and carries the observed active-attribute presence material.
3. Exactly one non-empty full Project Name structural group shares that anchor's navigation list item.
4. Exactly one non-empty Header Project Name structural group exists.
5. Exactly one Project-related link is contained by that Header group.
6. Navigation name, Header name, and Header link text are exact equals.

The broad semantic-marker option is rejected because Standard-Control contains those markers. Route shape alone is not selected as the Source Type detector because current-route material is shared by Standard and Project, and route/canonical can become current while Project UI material is absent. Track B route validation remains separately required for combined PoC success.

`ProjectNavigationSurface` is the Project Name Primary because it directly binds the name group to the current Conversation anchor. `ProjectHeaderSurface` is required but is not Primary because it has no direct current-Conversation binding and can retain the previous Project while the Navigation name has already disappeared.

## Track A Runtime Currentness Predicate

Track A is `RESOLVED_CURRENT` only when all conditions below are true:

1. Current route is available from the separately validated route inputs.
2. A complete, non-fragment-only current-route navigation anchor is exactly 1.
3. The selected anchor has `data-active` attribute presence; no `data-active="true"` value is required.
4. A same-list-item Navigation Project Name root/group is exactly 1 and non-empty.
5. A Header Project Name root/group is exactly 1 and non-empty.
6. A Project-related Header link inside that group is exactly 1 and has non-empty text.
7. Navigation name === Header name === Header link text.

The semantic currentness test for `data-active` is attribute presence. The observed empty-valued representation remains a PoC diagnostic expectation; a new non-empty representation is not interpreted as `true` and must not be silently accepted without review. `aria-current` is diagnostic-only because its observed count was 0.

## Track B Candidate Decision Table

| Candidate / source group | Decision | Phase 0 role | Required cardinality | Required consistency | Evidence basis | Known limitation |
|---|---|---|---:|---|---|---|
| Current browser tab URL / `BrowserHostRouteSurface` | **ADOPT FOR TASK-002 POC** | Primary URL source; parse one Project CID candidate from Observed Project Conversation Route Shape v1 | Exactly 1 host input | Present, parseable, supported route; Primary CID non-empty | Separate host/browser input; current GT after initial, reload, movement, Back / Forward, Direct Load | Production browser boundary and route parser not decided |
| `location.href` | **SOURCE-INTERNAL CONSISTENCY** | Page whole-route check | 1 | Exact whole-route equality with host and `document.URL` | Consistent in all completed reads | Not a host-URL fallback |
| `document.URL` | **SOURCE-INTERNAL CONSISTENCY** | Page whole-route check | 1 | Exact whole-route equality with host and `location.href` | Consistent in all completed reads | Same page-route source group |
| `location.pathname` | **SOURCE-INTERNAL CONSISTENCY** | Page pathname / route-shape parse surface | 1 non-empty value | Equals pathname parsed from page URL and host route; resolves the same Primary CID candidate | Reproduced across both Projects and all supported Project states | Not an independent source or fallback |
| Current-route anchor in `ActiveConversationNavigationSurface` | **REQUIRED CROSS-CHECK** | Current Conversation binding and anchor-route CID check | Exactly 1 | Direct complete route, same origin/path/query/fragment as Primary; anchor CID === Primary CID | Settled/final states: 1 and GT exact; transitions: 0 | Global or resolved-fragment inventory is unsafe |
| `data-active` attribute presence | **SOURCE-INTERNAL CURRENTNESS MATERIAL** | Binding material on the selected current-route anchor | Present on exactly the selected anchor | Use `hasAttribute`; do not require value `true`; `aria-current` is not required | Present exactly 1 whenever current anchor existed; all related counts 0 when absent | Attribute semantics beyond observed presence are not generalized |
| Scoped nested machine-readable ID metadata | **SOURCE-INTERNAL CONSISTENCY** | Active-navigation internal ID check | Exactly 1 within the selected anchor | Non-empty; nested CID === anchor CID === Primary CID | Both Projects and all final states: exactly 1 and GT exact | Global inventory has many unrelated entries and is rejected |
| Canonical in `HeadRouteMetadataSurface` | **REQUIRED CROSS-CHECK** | Required head route / CID validation surface | Exactly 1 | Parseable supported Project route; whole route and CID equal Primary / Active / Nested | Settled/final states current and exact across all operations | Canonical follows route earlier than UI; canonical alone does not prove full current metadata |
| `og:url` | **REJECT** | None | None | None | Present but not current CID in Project document states | No fallback role |
| Main standalone CID metadata | **NOT AVAILABLE** | None | N/A | N/A | No standalone candidate found | No inferred fallback |
| Global nested ID inventory | **REJECT** | None | None | None | Global counts varied and included unrelated values | Never select expected-looking inventory value |
| Same-document fragment-only anchor | **REJECT** | None | None | None | Resolved route can inherit current path although raw anchor does not contain CID | Resolved-URL-only scans can false-positive |

## Track B Primary and Cross-check Decision

`BrowserHostRouteSurface` is **ADOPT FOR TASK-002 POC** as the Primary because FR-004 requires the current browser tab URL and the host input remained separate from page execution context.

`CurrentDocumentRouteSurface` is required source-internal consistency material. Page URL APIs do not replace a missing or unsupported browser-host URL and are not fallbacks.

`ActiveConversationNavigationSurface` is a required current-binding / ID cross-check. The selected anchor must be a direct complete route value, not a fragment-only value whose resolved URL inherits the current pathname. The scoped nested metadata is required within that same anchor. Global inventory selection is rejected.

Canonical is a required cross-check, not a fallback. Discovery did not show canonical lagging behind the route, but it did show route and canonical becoming target while active navigation and all Project Name material were absent. Consequently, canonical cannot independently prove that required Project metadata is current.

## Observed Project Conversation Route Shape v1

The following Phase 0-only parsing boundary is adopted from the repeated Project-A / Project-B observations:

1. URL must be present and parseable.
2. Pathname must have exactly 4 non-empty segments.
3. The single Project Conversation ID candidate is the segment at zero-based position 3.
4. Extra pathname segments are not ignored.
5. Query and fragment were absent in every supported observation; a route containing either is unsupported for this PoC and is not normalized or stripped into success.
6. Query or fragment is never an ID source.
7. No Standard route literal, Standard grammar, Standard selector, or Standard ID position is imported.
8. No semantic meaning is assigned to the other segment values.

The repeated segment-length pattern `[1, 36, 1, 36]` is retained as an Evidence diagnostic, not an acceptance rule. In particular, length 36 is not promoted to a Project CID format requirement.

This is `Observed Project Conversation Route Shape v1` for the Phase 0 PoC, not a Production Project route grammar.

## Project ID Format Boundary

**Project character-level ID format: NOT ADOPTED / NOT REQUIRED FOR POC.**

The PoC requires only one non-empty candidate at the adopted route position plus required cross-group equality and independent Ground Truth comparison. It does not apply UUID version / variant semantics, lowercase hexadecimal rules, fixed hyphen positions, normalization, repair, or Standard ID Format v1.

Reason: the Discovery recorded lengths only as diagnostics and did not formally validate Project character-level format. Promoting length or character shape would create an unobserved requirement. Unexpected lengths remain reportable diagnostics and cannot modify Ground Truth.

## Track B Runtime Currentness Predicate

Track B is `RESOLVED_CURRENT` only when all conditions below are true in one snapshot:

1. Browser-host current-tab URL is present, parseable, and satisfies Observed Project Conversation Route Shape v1.
2. The Primary CID candidate is exactly 1 and non-empty.
3. `location.href` and `document.URL` are present, parseable, mutually equal, and exactly equal to the browser-host whole route.
4. `location.pathname` equals the pathname parsed from the page and host routes.
5. Every page-route surface resolves the same Primary CID candidate.
6. A direct complete current-route navigation anchor is exactly 1 across all navigation scopes.
7. The selected anchor has `data-active` attribute presence and exactly matches the Primary route by origin, path, query, and fragment.
8. The anchor route resolves exactly one non-empty CID equal to the Primary CID.
9. Scoped nested ID metadata is exactly 1, non-empty, and equal to anchor CID and Primary CID.
10. Canonical is exactly 1, parseable, satisfies the same observed route boundary, and its whole route and CID equal Primary / Active / Nested.

`resolvedCid` may be returned only for `RESOLVED_CURRENT`. All other states return no successful CID.

## Combined Acceptance and Validation Invariant

Track A and Track B remain separate required-metadata validations.

- Project Name does not manufacture or validate CID.
- CID does not manufacture or validate Project Name.
- Conversation Title validates neither.
- Track A resolution cannot substitute for Track B failure.
- Track B resolution cannot substitute for Track A failure.

TASK-002 Minimal PoC Runtime success requires, in the same snapshot:

1. Track A Runtime state = `RESOLVED_CURRENT`.
2. Track B Runtime state = `RESOLVED_CURRENT`.

Technical Spike case PASS additionally requires:

3. Runtime Source Type result matches the pre-established Source Type Ground Truth.
4. Resolved Project Name exactly matches the fixture's independent Project Name Ground Truth.
5. Resolved CID exactly matches the fixture's independent Project CID Ground Truth.

All five conditions are mandatory. Runtime candidate agreement and Ground Truth exactness are separate results in the Evidence-safe summary.

## State Classification

The PoC may report the following diagnostic states. They are not Production error enums.

| State | Meaning | Accept |
|---|---|---:|
| `RESOLVED_CURRENT` | Every required Track predicate holds; resolved value is available | Yes for that Track |
| `UNRESOLVED` | Required candidate is absent or empty, including a valid route/canonical with missing Project UI or active navigation | No |
| `AMBIGUOUS` | A required unique structural group or candidate has cardinality 2+ | No |
| `INCONSISTENT` | Required source-internal, cross-source, route-binding, or cross-Track structural equality fails | No |
| `UNSUPPORTED_ROUTE` | Browser route is present but malformed or outside Observed Project Conversation Route Shape v1 | No |

If multiple violations occur, the Evidence-safe evaluator should preserve all violation booleans. A representative diagnostic state may use `UNSUPPORTED_ROUTE`, then `AMBIGUOUS`, then `UNRESOLVED`, then `INCONSISTENT`, then `RESOLVED_CURRENT` precedence solely to make self-tests deterministic. That precedence is not a Production error priority or mapping.

`STALE` may be added as a Technical Spike diagnostic when the known previous / target Ground Truth relation proves it. Runtime acceptance must still be determined by availability, binding, and consistency without requiring a previous raw value.

## Observed Transient Classification

| Observed material | Classification | Accept |
|---|---|---:|
| Header previous while current-bound Navigation name is absent | `UNRESOLVED`; `STALE` diagnostic for Header in known transition context | No |
| Host / page / canonical target while all Project Name groups are absent | `UNRESOLVED` | No |
| Host / page / canonical target while active anchor / nested CID are absent | `UNRESOLVED` | No |
| New-tab non-Project starting route with all Project candidates absent | `UNSUPPORTED_ROUTE` or `UNRESOLVED` material; never Project success | No |
| All required Track A / B groups present, uniquely bound, and mutually consistent | `RESOLVED_CURRENT` | Yes, subject to separate Ground Truth comparison |

No fixed sleep, polling interval, retry count, timeout, debounce, or settled duration is decided.

## Cardinality and Consistency Contract

| Check | Required result | Otherwise |
|---|---|---|
| Current-route navigation anchor | exactly 1 direct complete route candidate | 0=`UNRESOLVED`; 2+=`AMBIGUOUS` |
| Navigation Project Name group | exactly 1 in the current anchor's navigation list item; non-empty | 0/empty=`UNRESOLVED`; 2+=`AMBIGUOUS` |
| Header Project Name group | exactly 1; non-empty | 0/empty=`UNRESOLVED`; 2+=`AMBIGUOUS` |
| Header Project-related link | exactly 1 inside Header group; non-empty text | 0/empty=`UNRESOLVED`; 2+=`AMBIGUOUS` |
| Project Name equality | Navigation === Header === Header link | mismatch=`INCONSISTENT` |
| Browser-host URL | exactly 1 present and parseable | missing=`UNRESOLVED`; malformed / unsupported=`UNSUPPORTED_ROUTE` |
| Page route APIs | one value per required API and one underlying current route | missing=`UNRESOLVED`; mismatch=`INCONSISTENT` |
| Project route CID candidate | exactly 1 at position 3; non-empty | missing=`UNRESOLVED`; extra / unsupported structure=`UNSUPPORTED_ROUTE` |
| Active anchor binding | whole route equals Primary and `data-active` present | false=`INCONSISTENT` |
| Scoped nested ID metadata | exactly 1 and non-empty | 0/empty=`UNRESOLVED`; 2+=`AMBIGUOUS` |
| Active internal equality | Anchor CID === Nested CID | mismatch=`INCONSISTENT` |
| Active / Primary equality | Anchor CID === Nested CID === Primary CID | mismatch=`INCONSISTENT` |
| Canonical | exactly 1 supported complete route | 0=`UNRESOLVED`; 2+=`AMBIGUOUS`; malformed=`INCONSISTENT` |
| Canonical equality | Canonical route / CID === Primary / Active route / CID | mismatch=`INCONSISTENT` |

## Fail Closed Invariants

The snapshot is not successful if any required invariant fails. Specifically, the PoC must not return successful Project metadata when any of the following applies:

- Required candidate cardinality is 0 or 2+.
- Project Name is empty, available only as unscoped/global text, or differs between Navigation and Header surfaces.
- Header holds a previous value while current-bound Navigation material is absent.
- Browser-host URL is unavailable, malformed, unsupported, or inconsistent with page route surfaces.
- Page URL APIs are used as a silent replacement for a missing browser-host URL.
- Project route has an unsupported segment count, extra segments, query, or fragment.
- Active anchor is missing, multiple, not current-route-bound, fragment-only, or lacks observed active-attribute presence.
- Nested ID metadata is missing, multiple, empty, unscoped, or mismatched with anchor / Primary.
- Canonical is missing, multiple, malformed, or mismatched with Primary / Active.
- Route / canonical are target but Project UI candidates or active / nested CID candidates are absent.
- Only one required source group resolves.
- A stale, ambiguous, inconsistent, or unsupported candidate would otherwise be returned.
- A candidate value is used to generate, repair, normalize, replace, or self-approve Ground Truth.

The last item is a Technical Spike validation-protocol violation, not a new Production error code. The expected value remains unchanged and the case cannot PASS.

This decision aligns missing Project Name material with future AT-010 / FR-011 handling and ID mismatch material with future AT-004 handling. Production `META_PROJECT_NAME_NOT_FOUND` / `CONVERSATION_ID_MISMATCH` mapping is not implemented or finalized here.

## Fallback Decision

**`CONFIRMED FALLBACK: NONE`**

- Page route is not a fallback for unavailable browser-host URL.
- Header alone is not a fallback for missing current-bound Navigation Project Name.
- Navigation alone is not a fallback for missing Header validation.
- Route or canonical alone is not success when Project UI or active-navigation metadata is absent.
- Global Project Name text and global nested ID inventories are not fallbacks.
- Broad semantic markers, document title, `og:url`, fragment-only anchors, and main weak metadata are not fallbacks.
- Project Name, CID, and Conversation Title are not substitutes for one another.

## Blocking / Non-blocking Questions

### Blocking for Minimal PoC

- **None.** Existing Evidence supports the source grouping, Primary / required cross-check roles, current binding, cardinality, route-shape boundary, Ground Truth separation, combined acceptance, Fail Closed behavior, and no-fallback decision.

### Non-blocking / Deferred

- Production selectors and canonical source assignment.
- Production route grammar, ID parser, ProjectChatAdapter, and error mapping.
- Character-level Project CID format and length requirements.
- Browser/page/DOM atomic snapshot mechanism.
- Fixed sleep, polling, retry, timeout, debounce, and settled/waiting algorithm.
- Sidebar unloaded / virtualized general solution.
- Additional Project fixtures, Standard negative controls, Chrome versions, and viewports.
- Live malformed, duplicate, ambiguous, and cross-source mismatch mutation cases; these belong in pure PoC self-tests where safe.
- Internal data-generation independence of structurally distinct DOM groups.
- All Verdicts, TASK-002 Final Exit, and Phase 0 Exit.

## PoC Entry Criteria

The Minimal PoC may start only under the following contract; all entry conditions are satisfied by this Decision:

1. Keep Project-A / Project-B Source Type, Project Name, and CID Ground Truth candidate-independent, pre-established, and Runtime-only.
2. Keep Track A and Track B capture, pure evaluation, Ground Truth comparison, Evidence-safe summary, and Technical Spike case evaluation separately testable.
3. Use `ProjectNavigationSurface` Primary and `ProjectHeaderSurface` required cross-check for Track A.
4. Scope Navigation across all navigation structures by the unique complete current-route anchor and same-list-item name binding; never use first-navigation or inventory-wide first-match logic.
5. Require Header name / link source-internal equality and Navigation / Header cross-group equality.
6. Use browser-host URL as Track B Primary; keep page URL APIs as required internal consistency surfaces and never as fallback.
7. Implement Observed Project Conversation Route Shape v1 exactly as the Phase 0-only boundary above, without Standard grammar or Project character-format assumptions.
8. Require one direct current-route anchor, `data-active` presence, one scoped nested ID, Active internal equality, and Active / Primary equality.
9. Require exactly one canonical and canonical equality with Primary / Active / Nested; never treat canonical alone as success.
10. Return resolved values only when the corresponding Track state is `RESOLVED_CURRENT`.
11. Require both Track A and Track B `RESOLVED_CURRENT` for combined Runtime success.
12. Require separate exact Source Type, Project Name, and CID Ground Truth comparisons for Technical Spike case PASS.
13. Implement pure synthetic Fail Closed cases for zero, duplicate, empty, mismatch, unsupported route, one-source-only, and all-sources-same-wrong-value scenarios.
14. Implement no fallback. Preserve every required violation in Evidence-safe diagnostics.
15. Persist no raw Project Name, fixture Title, CID, URL, pathname, href, canonical, DOM, body, Message / Turn identity, or authentication data.
16. Keep PoC code under `spikes/TASK-002-project-chat-dom/`; do not modify `src/` or Production files.
17. Use single-snapshot evaluation. Automated waiting requires a separately approved sampling / termination contract and is not part of this Decision.

## Known Limitations

- Two Project fixtures and one Standard-Control in the current ChatGPT UI.
- Authenticated Chrome on Windows and one primary viewport.
- Same-tab A / B movement used Runtime-held known fixture locations rather than a mounted target sidebar anchor.
- Host and page / DOM capture was sequential, not atomic.
- Intermediate states can occur between explicit observations and may be missed.
- No malformed, duplicate, or mismatched live DOM candidate was synthesized.
- Project route literals and the meanings of non-CID segments remain unspecified.
- Segment-length pattern and Project CID length remain diagnostics only.
- Project CID character-level format remains unvalidated.
- Structurally distinct validation surfaces are not proven to have independent internal data-generation paths.
- Production selector, parser, validator, fallback chain, error mapping, and waiting algorithm remain undecided and unimplemented.

These limitations do not create a new TV-003 / TV-004 Formal Pass condition and do not block the Minimal PoC entry.

## Requirement / ADR / Risk Impact

- **FR-004**: Browser-host current-tab URL is required as the Track B Primary, page route is a consistency surface, and URL is not guessed. Project CID is extracted as identity rather than treating the whole raw URL as identity.
- **FR-006**: Project Source Type uses the Project-bound Navigation structure plus structurally distinct Header consistency; broad markers that false-positive on Standard-Control are rejected.
- **FR-011**: Project Name and CID are separate required metadata. Missing either Track prevents combined success.
- **ADR-006**: Missing, ambiguous, unsupported, stale, and inconsistent snapshots Fail Closed; transitional route/canonical-only states are not accepted.
- **ADR-014**: CID remains the identity candidate and URL remains the current-tab navigation source; the two are compared but not conflated.
- **AT-002**: Phase 0 Source Type and Project Name strategy is ready for PoC validation; Production adapter behavior remains unimplemented.
- **AT-004**: Cross-group route / CID mismatch is detectable material for future `CONVERSATION_ID_MISMATCH`; Production mapping is deferred.
- **AT-010**: Missing / ambiguous / inconsistent Project Name is detectable material for future `META_PROJECT_NAME_NOT_FOUND`; Production mapping is deferred.
- **RISK-003**: Reproduced Project structural groups and Standard negative control reduce current-UI uncertainty; UI drift remains.
- **RISK-004**: Current-bound scoping and required Header equality reduce wrong-name acceptance; transient absence and future UI change remain risks.
- **RISK-029**: Host / page / active / nested / canonical consistency reduces wrong-CID acceptance; route, availability, and format drift remain risks.

Source-of-Truth documents are not modified.

## Repository / Security Check

- Check result: **PASS**.
- `git diff --check`: **PASS**.
- New Evidence direct trailing-whitespace scan: **0 findings**.
- Raw Project Name / fixture Title exact-value scan: **0 findings**.
- Raw ChatGPT URL / pathname / href / canonical-value scan: **0 findings**.
- Raw UUID-like / Conversation ID-like literal scan: **0 findings**.
- Raw DOM / HTML payload and Conversation body scan: **0 findings**.
- Credential / cookie / token / authorization-value assignment scan: **0 findings**.
- Product Requirements, ADR, Risk Register, Acceptance Tests, Technical Validation Plan, Development Backlog, and `AGENTS.md`: unchanged.
- TASK-001 Evidence / PoC, TASK-002 existing Evidence, `src/`, and Production files: unchanged by this Decision.
- Changed in this Decision Round: this new Candidate Decision Evidence file only.
- Round 3 Evidence was already untracked at the start of this Round; its pre-round integrity reference remained unchanged.
- Production implementation: none.

Because the new Evidence and the pre-existing Round 3 Evidence are untracked, `git diff --check` was not treated as a content check for them. Direct whitespace and raw-value scans were performed against the Candidate Decision file.

## Status After Candidate Decision

```text
TASK-002 Discovery: COMPLETE
TASK-002 Candidate Decision: COMPLETE
TASK-002 Minimal PoC: NOT STARTED

TV-004 Ground Truth: PRE-ESTABLISHED
TV-004 Candidate Decision: COMPLETE
TV-004 Verdict: NOT SET

TV-003 Project CID Ground Truth: ESTABLISHED
TV-003 Project Coverage Candidate Decision: COMPLETE
TV-003 Project Coverage Verdict: NOT SET
TV-003 Overall Final Verdict: PENDING

TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

Proceed to **TASK-002 Minimal PoC** after review. The next Round should implement the unchanged Track A / Track B pure evaluators, independent Ground Truth comparisons, combined case contract, and synthetic Fail Closed matrix under `spikes/` only.

This Decision does not start the Minimal PoC.
