# TASK-001 / TV-003 Conversation ID Evidence

## Status

- Observation date: 2026-08-15
- Environment: Chrome 151 / ChatGPT current UI
- TV-001 Standard Chat Message DOM: **PASS**
- TV-002 Standard Chat Title: **PASS**
- TV-003 Standard Coverage Discovery: **COMPLETE**
- TV-003 Standard Coverage Candidate Decision: **COMPLETE**
- TV-003 Standard Coverage Minimal PoC: **COMPLETE / PASS**
- TV-003 Standard Coverage Final Review: **COMPLETE**
- TV-003 Standard Coverage Verdict: **PASS**
- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-001 Final Exit: **NOT YET MET**
- Production implementation: none

Phase 0 Candidate Decision and Minimal PoC are complete. Production parser / validator implementation remains none.

## Formal Validation Scope

### Hypothesis

Current tab URL等からConversation IDを一意に取得・検証できる。

### Standard Coverage observation basis

1. Standard ChatのConversation IDを一意に分離できること。
2. Same Conversation reloadで同一ID関係を維持すること。
3. 異なるStandard ChatではIDが異なること。
4. Conversation navigation後にcurrent IDへ更新すること。
5. Back / Forward後にcurrent Conversationへ追従すること。
6. Conversation route以外からIDを推測生成しない材料を得ること。
7. URL / ID不一致を検出できるcandidate structureを観察すること。

Primary traceability: FR-004、FR-011、ADR-014、ADR-006、RISK-029、AT-004。FR-031へのidentity利用は将来impactとしてのみ扱い、差分保存は検証していない。

## Scope Split: Standard Coverage vs Overall TV-003

- `TV-003 Standard Coverage`: このEvidenceの対象。
- `TV-003 Project Coverage`: このRoundでは対象外。
- `TV-003 Overall Final Verdict`: Technical Validation PlanのFormal PassがStandard / Project双方を要求するため **PENDING**。
- TASK-001 Exit: Standard CoverageのResult Review後に別途判断する。今回確定しない。

Project coverageをTASK-002へ引き継ぐ既承認方針と、Technical Validation Plan上のTV-003全体表現との対応はTraceability gapとして残る。Source-of-Truth文書は変更していない。

## Runtime Ground Truth

### Provenance

- CID-A / CID-Bは、今回のcandidate observationより前にユーザーが指定した2つの既知Standard Chat。
- ユーザー提供のConversation referenceから得たexact expected IDはRuntime memory内だけで保持した。
- Candidateからexpected valueを生成または更新していない。
- Raw expected ID、raw URL、raw pathnameはEvidence、file log、fixtureへ保存していない。

`GROUND_TRUTH EXACT VALUE INDEPENDENCE: ESTABLISHED`

### Expected identity relations

| Check | Predefined expectation | Result |
|---|---:|---:|
| CID-A expected ID length | 36 | MATCH |
| CID-B expected ID length | 36 | MATCH |
| CID-A / CID-B | distinct | true |
| CID-A reload | same as CID-A | true |
| A → B | current becomes CID-B | true at settled state |
| B → A | current returns to CID-A | true at settled state |
| Back A → B | current becomes CID-B | true |
| Forward B → A | current becomes CID-A | true |
| CID-A direct load | current is CID-A | true at settled state |

The independent validation oracle is the user-provided CID-A / CID-B Runtime Ground Truth. DOM candidate surfaces are not treated as their own oracle.

## Candidate Inventory

| Alias | Observed surface | Availability / cardinality | Exact GT relation at settled CID-A / CID-B | Observation-only assessment |
|---|---|---|---|---|
| C-01 | Current browser tab URL | 1 | exact / exact | Current-tab route surface required by FR-004; raw URL was not persisted |
| C-02 | `location.href` | 1 | exact / exact | Same current document route state as C-01 |
| C-03 | `location.pathname` | 1 | unique observed ID segment | Route-component surface; raw pathname was not persisted |
| C-04 | `document.URL` | 1 | exact / exact | Same current document route state as C-01 / C-02 |
| C-05 | current-route active sidebar anchor `href` | same-path anchors=2、`data-active` anchor=1 | exact / exact | Current item binding candidate |
| C-06 | active anchor内の`data-conversation-options-trigger` | active item内exactly 1 | exact / exact | URL文字列ではないmachine-readable ID candidate。Active anchorのdescendantとして観察 |
| C-07 | `link[rel="canonical"]` | exactly 1 | exact / exact at settled state | Head route metadata candidate; transition中にstaleを観察 |
| C-08 | `og:url` | exactly 1 | Conversation route / IDなし | NOT AVAILABLE as Conversation ID candidate |
| C-09 | `data-conversation-screenshot-content` | 8 observed、values empty | exact candidate 0 | NOT AVAILABLE as Conversation ID candidate |
| C-10 | Main Conversation DOMのstandalone ID metadata | not found | not evaluated | NOT AVAILABLE in observed DOM |

Message / Turn scoped `data-message-id`、`data-turn-id`、`conversation-turn-N`はConversation identity candidateから明示的に除外した。

### Active item structural observation

- Unique current-route active anchorは、exact expected IDを持つ`data-conversation-options-trigger` elementを包含した。
- Triggerはactive anchorのnon-direct descendantで、active anchorからのobserved descendant depthは3。
- Active anchor内のtrigger countは1、trigger ID lengthは36、active anchor route IDとのexact equalityはtrue。
- Settled CID-A snapshotではvisible sidebar inventory上のtrigger count 28、distinct value count 28、empty count 0、CID-A exact count 1だった。これはcurrent candidate cardinalityではなくinventory diagnosticである。
- Sidebar inventory内の任意のtriggerをcurrent IDとして選ぶことは安全ではない。Current active anchorへのstructural bindingが必要なcandidate materialである。

## Source Grouping

### `CurrentDocumentRouteSurface`

- C-01 browser tab URL
- C-02 `location.href`
- C-03 `location.pathname`
- C-04 `document.URL`

Settled全stateで同一current routeを表した。API surfaceは複数だが、identity source数を水増しせず同一underlying current-document route groupとして扱う。

### `ActiveConversationItemSurface`

- C-05 current-route active sidebar anchor `href`
- C-06 same active item subtreeの`data-conversation-options-trigger`

C-05 / C-06は同じactive sidebar itemに由来するsource-internal route / ID surfacesであり、互いを独立oracleとは数えない。このgroup自体は`CurrentDocumentRouteSurface`とはstructurally distinctなDOM groupとして観察した。

### `HeadRouteMetadataSurface`

- C-07 canonical link
- C-08 `og:url`

Canonical linkはsettled時にConversation route / expected IDと一致した。`og:url`は同じhead metadata familyに存在したがConversation route / IDを保持しなかった。ChatGPT内部のdata-generation pathが他groupから独立していることは証明していない。

### `ConversationMainMetadataSurface`

Main Conversation DOM上のstandalone Conversation ID candidateは見つからなかった。C-09はemptyでcandidate不成立。

`STRUCTURALLY DISTINCT DOM ID CROSS-CHECK CANDIDATE: FOUND`

具体的には`CurrentDocumentRouteSurface`、`ActiveConversationItemSurface`、settled時の`HeadRouteMetadataSurface`を相互比較できる。ただし、内部data-generation originの独立性は未証明であり、independent validation oracleはCID-A / CID-B Ground Truthだけである。

## Initial Observation

### CID-A — initial settled

| Observation | Result |
|---|---:|
| Browser tab / `location.href` / `document.URL` equality | true |
| Observed Conversation route shape | present、ID segment exactly 1 |
| Route ID exact GT-A | true |
| Same-path anchors | 2 |
| Current-route `data-active` anchor | exactly 1 |
| Active anchor route ID exact GT-A | true |
| Active anchor内ID metadata | exactly 1、exact GT-A |
| Canonical link | exactly 1、exact GT-A |
| Cross-group equality | true |

### CID-B — initial settled after A → B navigation

| Observation | Result |
|---|---:|
| Browser tab / page route equality | true |
| Route ID exact GT-B | true |
| Current-route active item | exactly 1、exact GT-B |
| Active item内ID metadata | exactly 1、exact GT-B |
| Canonical link | exactly 1、exact GT-B |
| Cross-group equality | true |

CID-A / CID-B exact expected IDs were distinct before candidate capture, and both settled observations matched their respective independent expected values.

## Reload

### CID-A reload return snapshot

- Current browser / page route: exact GT-A。
- Canonical link: exact GT-A。
- Current-route active item: 0。
- Active item内ID candidate: 0。
- Sidebar ID inventory: not mounted in this snapshot。
- Classification material: `UNRESOLVED`; success扱い不可。

### CID-A reload settled

- Current browser / page route、active item route、active item内ID metadata、canonical linkはすべてexact GT-A。
- Browser tab URL / `location.href` / `document.URL` equality=true。
- Cross-group equality=true。
- Same Conversation reload stability=true。

## A → B → A Navigation

### A → B immediate

- Browser tab / page routeはtarget CID-Bへ更新済み。
- Current-route active itemは0。
- Canonical linkはtarget CID-Bと不一致。
- Focused relation comparisonでcanonical linkがprevious CID-Aを保持していたことを確認。
- Sidebar inventoryにはCID-B exact candidateが1存在したが、current active bindingがないためcurrent IDとしてacceptできない。
- Classification material: `STALE / INCONSISTENT / UNRESOLVED`; success扱い不可。

### A → B settled

- Current document route、active item route、active item内ID metadata、canonical linkがすべてexact CID-B。
- Previous CID-Aをcurrent resultとして保持しなかった。

### B → A immediate

- Browser tab / page routeはtarget CID-Aへ更新済み。
- Current-route active itemは0。
- Canonical linkはtarget CID-Aと不一致。
- このsnapshotではcanonical valueがprevious CID-Bそのものかの追加exact relation comparisonは行っていない。
- Classification material: `INCONSISTENT / UNRESOLVED`; success扱い不可。

### B → A settled

- Current document route、active item route、active item内ID metadata、canonical linkがすべてexact CID-A。
- Previous CID-Bをcurrent resultとして保持しなかった。

No fixed sleep、polling interval、retry algorithm、timeout contract、settled algorithm was designed.

## Back / Forward

| State | Browser / page route | Active item / ID metadata | Canonical | Independent GT relation |
|---|---:|---:|---:|---:|
| Back A → B | consistent | exact CID-B | exact CID-B | MATCH |
| Forward B → A | consistent | exact CID-A | exact CID-A | MATCH |

Back / Forward API return直後のsampleもすでにcross-group一致していた。Transient stateが存在しないとは一般化しない。

## Direct Load

### CID-A direct-load return snapshot

- Browser tab / page route: exact CID-A。
- Canonical link: exact CID-A。
- Current-route active item: 0。
- Active item内ID metadata: 0。
- Classification material: `UNRESOLVED`; success扱い不可。

### CID-A direct-load settled

- Current document route、active item route、active item内ID metadata、canonical linkがすべてexact CID-A。
- Browser tab URL / page URL consistency=true。
- Cross-group equality=true。

## Unsupported / Non-conversation Observation

### ChatGPT home / no selected Conversation

- Browser tab URL、`location.href`、`document.URL`は相互一致した。
- Observed Standard Conversation route shape=false。
- Conversation ID segment count=0。
- Canonical link count=1だがConversation route / IDなし。
- `data-active` linkは1存在したがConversation ID segmentなし、nested Conversation ID metadata count=0。
- Conversation IDを生成または推測しなかった。

Settings route: `NOT OBSERVED`。

New ChatでID未確定のdistinct state: `NOT OBSERVED`。Message送信による新規ID生成は行っていない。

## ID Format Findings

CID-A / CID-Bで観察した範囲だけを記録する。

- ID segment length: 36。
- Observed character classification: lowercase hexadecimal characters and hyphens only。
- Observed hyphen positions: 8、13、18、23（zero-based）。
- A / Bともsame observed shape、かつexact expected valueはdistinct。

これは2 caseにおけるObserved Factであり、UUID一般、未観察length、未観察character set、Production validation regexを許可または決定するものではない。

## URL / ID Consistency Findings

1. `CurrentDocumentRouteSurface`からobserved route componentを一意に分離できた。
2. Settled stateではbrowser current-tab URL、`location.href`、`document.URL`が一致した。これらは同じsource groupでありindependent oracleではない。
3. `ActiveConversationItemSurface`ではcurrent-route active anchorがexactly 1となり、そのanchor href route IDとnested `data-conversation-options-trigger` IDがexact equalityだった。
4. `HeadRouteMetadataSurface`のcanonical linkはsettled stateでroute / active-item IDと一致した。
5. Reload / direct load return snapshotではroute / canonicalがcurrentでもactive itemが0だった。
6. A → B transitionではrouteがtargetへ先行し、active itemが0、canonicalがprevious IDを保持するcross-group mismatchを観察した。
7. Sidebar inventory中にtarget IDが存在するだけではcurrent bindingを証明しない。

AT-004の`CONVERSATION_ID_MISMATCH`相当を検出するstructurally distinct cross-check materialは存在する。ただしPrimary、cross-check、cardinality、state predicate、error mappingはCandidate Decision Roundで審議し、このRoundでは確定しない。

## Fail Closed Materials

以下はCandidate Decision前の「success扱いしてはいけない」材料であり、正式validator contractではない。

| Condition | Observed / synthetic status | Discovery treatment |
|---|---|---|
| Conversation routeではない | homeでobserved | IDを生成せずunresolved |
| ID segment missing / empty | homeでmissing observed | unresolved |
| Path structure ambiguous | not observed | success扱い不可候補 |
| Multiple route ID candidates | not observed | success扱い不可候補 |
| Browser tab URLとpage URL不一致 | not observed | success扱い不可候補 |
| URL routeとactive item route / ID不一致 | transitionでavailability / canonical mismatch observed | unresolved / inconsistent |
| Active current item 0 | reload、navigation、direct-load transitionでobserved | unresolved |
| Active current item 2+ | not observed | ambiguous candidate |
| Active item内ID candidate 0 / 2+ | 0 observed in transition、2+ not observed | success扱い不可候補 |
| Active item href IDとnested ID metadata不一致 | not observed | success扱い不可候補 |
| Canonical candidate 0 / 2+ | not observed | success扱い不可候補 |
| Canonicalがprevious Conversationを保持 | A → B transitionでobserved | stale; success扱い不可 |
| Candidate currentnessを確認できない | transitionでobserved | unresolved |
| Observed formatと異なる | not observed | success扱い不可候補; ruleは未決定 |
| IDを一意に分離できない | not observed | success扱い不可候補 |

Confirmed safe fallbackはこのDiscoveryでは決定していない。未観察fallbackを追加していない。

## Known Limitations

- Standard Chat 2 case、Chrome 151、current ChatGPT UI、1 primary viewportでのObservation。
- Project Chatは未観察であり、TV-003 Overall VerdictはPENDING。
- Internal API、private network request、React private stateは観察していない。
- DOM source groupsがChatGPT内部で異なるdata-generation pathを持つことは証明していない。
- Sidebar unloaded / virtualized時の一般解は未検証。
- Settings route、新規Chat ID未確定state、malformed / ambiguous routeは未観察。
- Additional viewport、same-route edge cases、browser/page URL mismatch synthetic stateは未検証。
- Transition中にcandidate更新順差を観察したが、general settled condition、polling、retry、timeoutは未設計。
- Observed formatをProduction一般仕様へ拡張していない。

## Requirement / ADR / Risk Impact

- **FR-004**: Browser current-tab URLとpage URLを区別して比較でき、settled Standard Chatでは一致した。Raw URL全体をidentityとして採用していない。
- **FR-011**: Required Conversation IDをcurrent route / active item / metadataの整合で検証できるcandidate materialを得た。Production保存可否は未実装。
- **ADR-014**: Conversation IDをsystem identity key、URLをnavigation / current-tab sourceとして区別した。Message / Turn identityを流用していない。
- **ADR-006**: Transition中のmissing / stale / inconsistent stateをsuccess扱いしないFail Closed材料を得た。
- **AT-004**: URL / Conversation ID mismatch検出に利用可能なstructurally distinct surfacesを確認した。`CONVERSATION_ID_MISMATCH`実装と正式validator contractは未着手。
- **RISK-029**: Current UIでは複数surfaceのcomparisonが可能と確認した。UI変更、sidebar availability、format drift、Production orchestration riskは残る。
- **FR-031**: 将来の差分保存identityに関係するが、このRoundではidentity persistence semanticsや差分保存を検証していない。

## Blocking Questions

### Blocking for this Discovery completion

None。

- Current Standard Chat IDを独立expected valueに対して一意に分離できた。
- A / B distinctness、reload stability、navigation / Back / Forward / direct-load trackingを確認した。
- Structurally distinct URL / DOM consistency candidateを確認した。
- Raw identifierを永続化せず検証できた。

### Open before Candidate Decision / PoC

1. `CurrentDocumentRouteSurface`、`ActiveConversationItemSurface`、`HeadRouteMetadataSurface`のPrimary / cross-check役割。
2. Active item anchor hrefとnested ID metadataを同一group内でどうcardinality / consistency評価するか。
3. Transition中のmissing / stale / inconsistent stateをrejectするaccept-state predicate。
4. Observed route shape / ID formatのうち、TASK-001 PoCでどこまでvalidation contractへ採用できるか。
5. Canonical linkをcross-checkへ採用するか、transition lag limitationをどう扱うか。
6. AT-004相当failureをどのcross-group mismatchへ対応付けるか。
7. Project coverageとTV-003 Overall Verdictのtraceability handoff。

## Recommended Next Action

追加探索や実装へ進まず、次Roundで`TV-003 Standard Coverage Candidate Decision`を実施する。

Candidate Decisionでは、Primary extraction source、structurally distinct cross-check、route / ID cardinality、observed-format boundary、currentness predicate、Fail Closed invariants、confirmed fallbackの有無、PoC Entry CriteriaをEvidenceから決める。Standard Coverage Final Verdict、TV-003 Overall Final Verdict、Project coverage、Production parser / validatorはまだ開始しない。

## TV-003 Standard Coverage Candidate Decision — 2026-08-15

### Status / Scope

- TV-003 Standard Coverage Discovery: **COMPLETE**
- TV-003 Standard Coverage Candidate Decision: **COMPLETE**
- TV-003 Standard Coverage Verdict: **NOT SET**
- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-001 Final Exit: **NOT YET MET**
- PoC implementation: not started
- Production implementation: none

このDecisionは、TASK-001 Phase 0 Minimal PoCで検証するStandard Chat acquisition strategyだけを確定する。Production canonical source、Production selector / fallback chain、Project Chat strategy、TV-003 Final Verdictは確定しない。

Technical Validation PlanはTV-003 Formal PassをStandard / Project双方に設定し、Development BacklogのTASK-001 ExitはStandard Chat Message / Title / Conversation IDを対象とする。このTraceability gapは維持し、Source-of-Truth文書を変更していない。

### Decision Basis

このDecisionは、このファイルのDiscovery Observed Factsだけに基づく。追加DOM探索、追加live observation、未観察candidate / attribute / fallback、Internal API、private network、React private stateは使用していない。

Primary traceability: FR-004、FR-011、ADR-014、ADR-006、AT-004、RISK-029。FR-031は将来impactだけであり、差分保存identity semanticsは決定しない。

### Ground Truth Status

`GROUND_TRUTH EXACT VALUE INDEPENDENCE: ESTABLISHED`

- CID-A / CID-B exact expected IDはcandidate observation前のuser-provided validation oracle。
- Both observed lengths: 36。
- CID-A / CID-B distinctness: true。
- Candidate surfaceからGround Truthを生成、変更、自己承認しない。
- Raw ID、raw URL、raw pathnameをEvidence、log、fixtureへ永続化しない。

### Source Grouping and Decision Roles

#### `CurrentDocumentRouteSurface`

- C-01 browser tab URL: Primary URL source。
- C-02 `location.href`: same source groupのrequired consistency surface。
- C-03 `location.pathname`: observed route / ID parsingとpathname consistency surface。
- C-04 `document.URL`: same source groupのrequired consistency surface。

C-01〜C-04は4 independent sourcesではない。C-02〜C-04をC-01 unavailable / unsupported時のfallbackにしない。

#### `ActiveConversationItemSurface`

- C-05 current-route active sidebar anchor `href`: required current-binding / ID cross-check。
- C-06 same active item subtreeの`data-conversation-options-trigger`: required source-internal machine-readable ID cross-check。

C-05 / C-06は同じactive item由来であり、互いをindependent fallbackとは数えない。このgroupはPrimary route groupとはstructurally distinctなrequired validation surfaceとして扱う。

#### `HeadRouteMetadataSurface`

- C-07 canonical link: required cross-check。
- C-08 `og:url`: Conversation route / IDを保持しなかったためreject。

Canonicalが他groupと異なるinternal data-generation pathを持つことは証明していない。それでも、A → B transitionでprevious IDを保持しPrimary targetと不一致になったObserved Factがあるため、Phase 0 PoC accept predicateのrequired cross-checkとして有効である。

#### `ConversationMainMetadataSurface`

- C-09 screenshot-related metadata: emptyでID candidate不成立。
- C-10 standalone ID metadata: not found。

未観察Main DOM fallbackは追加しない。

### Candidate Decision Table

| Candidate | Source group | Decision | Role in TASK-001 TV-003 PoC | Evidence / limitation |
|---|---|---|---|---|
| C-01 Current browser tab URL | `CurrentDocumentRouteSurface` | **ADOPT FOR TASK-001 TV-003 POC** | Primary URL source。Observed Standard routeからIDを一意に分離 | FR-004がcurrent browser tabを要求。A / B、reload、navigation、Back / Forward、direct loadでGT exact |
| C-02 `location.href` | `CurrentDocumentRouteSurface` | **SOURCE-INTERNAL CONSISTENCY** | C-01 / C-04とのcurrent route equalityをrequired検証 | Same source group。C-01欠落時fallbackではない |
| C-03 `location.pathname` | `CurrentDocumentRouteSurface` | **SOURCE-INTERNAL CONSISTENCY** | Observed route shapeとsingle ID segmentのparse surface | Production route grammarではなくPhase 0 observed shape限定 |
| C-04 `document.URL` | `CurrentDocumentRouteSurface` | **SOURCE-INTERNAL CONSISTENCY** | C-01 / C-02とのcurrent route equalityをrequired検証 | Same source group。independent oracleではない |
| C-05 active sidebar anchor `href` | `ActiveConversationItemSurface` | **REQUIRED CROSS-CHECK** | Current-route `data-active` binding、anchor route ID、Primary equality | Settled時exactly 1。transition中0を観察 |
| C-06 active item nested ID metadata | `ActiveConversationItemSurface` | **REQUIRED CROSS-CHECK** | Active item内exactly 1、non-empty、anchor ID / Primary ID equality | C-05と同じactive item。Inventory fallbackではない |
| C-07 canonical link | `HeadRouteMetadataSurface` | **REQUIRED CROSS-CHECK** | Exactly 1、single valid ID、Primary / Active equality | Settled時GT exact。A → B immediateでprevious IDを保持しmismatch検出に寄与 |
| C-08 `og:url` | `HeadRouteMetadataSurface` | **REJECT** | None | Observed elementはConversation route / IDを保持しなかった |
| C-09 screenshot-related empty metadata | `ConversationMainMetadataSurface` | **REJECT** | None | Observed values empty、expected candidate 0 |
| C-10 main standalone ID metadata | `ConversationMainMetadataSurface` | **NOT AVAILABLE** | None | Observed DOMでnot found。未観察fallbackを作らない |

Message / Turn scoped identity、Title、本文、sidebar inventory全体はConversation ID acquisition sourceとして使用しない。

### Primary Decision

**Option A — `CurrentDocumentRouteSurface` PrimaryをADOPT FOR TASK-001 TV-003 POC。**

1. Current browser tab URLをPrimary URL sourceとする。
2. Raw URL文字列全体をConversation identityにはしない。
3. Browser tab URLのobserved Standard Conversation routeから、exactly 1のID segmentを分離した値をPrimary resolved IDとする。
4. `location.href` / `location.pathname` / `document.URL`はsame source groupのrequired consistency surfacesでありfallbackではない。
5. ActiveConversationItemとcanonicalはPrimaryをrequired cross-checkする。

Rationale:

- FR-004はURLをcurrent browser tabから取得することをMustとしている。
- CID-A / CID-Bでindependent GT exact、same Conversation reloadでstable、A / B navigation、Back / Forward、direct loadでcurrent targetへ追従した。
- Routeはtransition中にactive item / canonicalより先行することがあるが、Primary単独acceptを禁止しrequired cross-checkを満たすまでFail Closedできる。

**Option B — ActiveConversationItem PrimaryはREJECT as Primary。**

Active itemはcurrent bindingを確認するrequired cross-checkとして重要だが、reload、direct load、A / B transitionで0件のsnapshotを観察した。またFR-004のcurrent browser tab URL requirementを置き換えない。Active item unavailable時にPrimary routeだけでsilent successすることも、active itemだけでsuccessすることも禁止する。

### Browser Tab URL Contract

1. Current browser tab URLはrequired、present、parseableでなければならない。
2. Observed Standard Conversation route shape v1として、pathnameのnon-empty segmentsがexactly 2、first segmentがobserved literal `c`、second segmentがsingle Conversation ID candidateであることを要求する。
3. IDはpathnameのobserved position以外から推測しない。Query、fragment、Title、Message、Turn metadataをID sourceにしない。
4. Browser tab URL、`location.href`、`document.URL`はcurrent routeとしてexact consistencyを要求する。
5. `location.pathname`は各parsed URLのpathnameと一致し、same observed route shape / IDを表すことを要求する。
6. Browser tab URL unavailable / unsupported / page URL mismatchではFail Closedする。
7. `location.href` / `document.URL`をBrowser tab URL欠落時のfallbackにしない。

このcontractはPhase 0 PoC strategyであり、Production永久route grammarではない。Unobserved query / fragment variationをalternate ID sourceとして許可しない。

### ActiveConversationItem Decision

PoC accept時に以下をすべてrequiredとする。

1. Primary current routeにsame-origin / same-pathでbindするsidebar anchor scopeを使用する。
2. そのscope内で`data-active`を持つcurrent-route anchorがexactly 1。
3. Active anchor `href`がobserved Standard Conversation route shapeで、IDをexactly 1分離できる。
4. Active anchor subtree内の`data-conversation-options-trigger` candidateがexactly 1。
5. Nested ID metadataがnon-emptyかつObserved Format v1に一致する。
6. Active anchor route ID === nested ID metadata。
7. Active anchor route ID === Primary route ID。

Sidebar inventory全体からexpected-looking valueを探索・選択する方式は**REJECT**。Current active bindingがないinventory candidateをfallbackにしない。

### Canonical Decision

**Option C1 — C-07 canonicalをREQUIRED CROSS-CHECKとしてADOPT FOR TASK-001 TV-003 POC。**

Accept時に以下を要求する。

1. `link[rel="canonical"]` count exactly 1。
2. Canonicalがobserved Standard Conversation route shapeである。
3. CanonicalからIDをexactly 1分離できる。
4. Canonical IDがObserved Format v1に一致する。
5. Canonical ID === Primary route ID === ActiveConversationItem ID。

Option C2 diagnostic-onlyはrejectする。A → B immediateでcanonicalがprevious CID-Aを保持し、target CID-B Primaryと不一致になるstateを実観察したため、required化によりnot-settled / stale stateのacceptを追加防止できる。Canonicalはfallbackでもindependent Ground Truthでもない。

### Observed Format Decision

`Observed Standard Conversation ID Format v1`を**ADOPT FOR TASK-001 TV-003 POC**する。

Required predicate:

- String length exactly 36。
- Hyphen positions exactly 8、13、18、23（zero-based）。
- Hyphen以外のpositionsはlowercase hexadecimal charactersだけ。
- Empty、uppercase、別length、別hyphen position、その他characterはPoC v1でFail Closed。

このpredicateはID sourceではなくmalformed / unexpected valueを検出するPhase 0補助validationである。UUID version / variant semantics、UUID library一般validation、Project Chat format、Production永久仕様を意味しない。

### Runtime Currentness Predicate

Ground Truthやprevious IDを知らないruntimeでは、次をすべて満たすsnapshotだけを`RESOLVED_CURRENT`としてacceptする。

1. Current browser tab URLがpresent / parseable。
2. Browser tab URLがObserved Standard Conversation Route Shape v1。
3. Primary ID segmentをexactly 1分離可能、non-empty、Observed Format v1一致。
4. Browser tab URL / `location.href` / `document.URL`がcurrent routeとしてexact consistency。
5. `location.pathname`がsame pathname / route / Primary IDを表す。
6. Current-route `data-active` sidebar anchor exactly 1。
7. Active anchorがPrimary current routeへsame-origin / same-pathでbind。
8. Active anchor route IDをexactly 1分離可能、non-empty、Observed Format v1一致。
9. Active anchor subtree内nested ID metadata exactly 1、non-empty、Observed Format v1一致。
10. Active anchor route ID === nested ID metadata === Primary route ID。
11. Canonical link exactly 1、observed Standard routeからID exactly 1、non-empty、Observed Format v1一致。
12. Canonical ID === Primary ID === ActiveConversationItem ID。
13. Required source groupのいずれにもmissing、ambiguous、unsupported、inconsistent stateがない。

Required conditionsの一部だけがresolvedしてもacceptしない。Specific generic literal、previous raw ID、GT、fixed sleep、elapsed durationはruntime predicateへ使用しない。

### State Classification

| State | Meaning | Accept |
|---|---|---:|
| `RESOLVED_CURRENT` | 全required cardinality、route binding、format、source-internal / cross-group equalityが成立 | Yes |
| `UNSUPPORTED_ROUTE` | Browser tab URLがobserved Standard Conversation route shapeではない | No |
| `UNRESOLVED` | Required source / IDがmissing、empty、またはcurrentnessを証明不能 | No |
| `AMBIGUOUS` | Required candidate / IDを2+検出し一意解決不能 | No |
| `INCONSISTENT` | Required surfacesは存在するがroute binding、URL、ID、format、cross-group valueが矛盾 | No |
| `STALE` | Independent GTまたはknown navigation relationでprevious value保持を証明できるSpike diagnostic | No。Production runtimeではraw previous valueに依存せず`INCONSISTENT` / `UNRESOLVED`でreject |

Production error enum / precedence / mappingは実装・確定しない。Cross-group ID mismatchはfuture `CONVERSATION_ID_MISMATCH` candidateとしてAT-004へtraceする。

### Transient Classification

| Observed snapshot | Runtime classification | Accept |
|---|---|---:|
| Reload return: route current、canonical current、active item 0 | `UNRESOLVED` | No |
| Direct Load return: route current、canonical current、active item 0 | `UNRESOLVED` | No |
| A → B immediate: route target B、active item 0、canonical previous A | `INCONSISTENT` + `UNRESOLVED`; `STALE` diagnostic | No |
| B → A immediate: route target A、active item 0、canonical != target | `INCONSISTENT` + `UNRESOLVED` | No |
| Settled A / B: all required surfaces current and equal | `RESOLVED_CURRENT` candidate | Yes only after runtime predicate; Spike PASS additionally requires GT exact |

No polling / retry / timeout / fixed sleep / settled algorithm is defined by this Decision。

### Cardinality / Consistency Contract

| Scope | Required cardinality / consistency |
|---|---|
| Browser tab URL | exactly 1 runtime value、present、parseable、supported observed route |
| Page route surfaces | `location.href` exactly 1、`document.URL` exactly 1、`location.pathname` present、Primary current routeとconsistent |
| Primary route ID | exactly 1、non-empty、Observed Format v1 |
| Current-route active anchor | exactly 1 with `data-active` binding |
| Active anchor route ID | exactly 1、non-empty、Observed Format v1、Primary ID exact |
| Nested ID metadata | exactly 1 within active anchor、non-empty、Observed Format v1、anchor / Primary ID exact |
| Canonical | exactly 1、single non-empty valid ID、Primary / Active ID exact |
| Cross-group | Primary === Active anchor === Nested metadata === Canonical |

### Fail Closed Invariants

| Condition | Decision treatment |
|---|---|
| Browser tab URL unavailable / empty / unparseable | Fail Closed: `UNRESOLVED` |
| Unsupported / non-Conversation route | Fail Closed: `UNSUPPORTED_ROUTE` |
| Primary ID segment 0 / empty | Fail Closed: `UNRESOLVED` |
| Primary ID segment 2+ / path ambiguous | Fail Closed: `AMBIGUOUS` |
| Any resolved ID observed-format mismatch | Fail Closed: `INCONSISTENT` / invalid candidate |
| Browser tab URL / page URL mismatch | Fail Closed: `INCONSISTENT` |
| Active item 0 | Fail Closed: `UNRESOLVED` |
| Active item 2+ | Fail Closed: `AMBIGUOUS` |
| Active anchor current-route binding false | Fail Closed: `INCONSISTENT` |
| Active anchor route ID missing / empty | Fail Closed: `UNRESOLVED` |
| Active anchor route ID ambiguous | Fail Closed: `AMBIGUOUS` |
| Nested ID metadata 0 / empty | Fail Closed: `UNRESOLVED` |
| Nested ID metadata 2+ | Fail Closed: `AMBIGUOUS` |
| Active href ID / nested ID mismatch | Fail Closed: `INCONSISTENT` |
| Primary route ID / ActiveConversationItem ID mismatch | Fail Closed: `INCONSISTENT`; future AT-004 error candidate |
| Canonical 0 / ID missing / empty | Fail Closed: `UNRESOLVED` |
| Canonical 2+ / multiple ID candidates | Fail Closed: `AMBIGUOUS` |
| Canonical ID invalid / Primary mismatch | Fail Closed: `INCONSISTENT`; future AT-004 error candidate |
| 一方のrequired source groupだけresolved | Fail Closed: `UNRESOLVED` / `INCONSISTENT` |
| Currentnessを一意に確認不能 | Fail Closed |

Silent selection、previous ID利用、sidebar inventory fallback、canonical-only success、Active-only success、Message / Turn identity流用、Title / body inference、URL推測生成を禁止する。

### Ground Truth vs Runtime Currentness Separation

#### Runtime currentness

Runtime currentnessはrequired sourceのcardinality、route binding、Observed Format v1、source-internal consistency、cross-group equalityだけで判定する。Ground Truthやprevious raw IDを使用しない。

#### Technical Spike Ground Truth comparison

Minimal PoC case PASSには次の両方を要求する。

1. Runtime currentness result = `RESOLVED_CURRENT`。
2. Resolved ID === independent CID-A / CID-B expected ID。

すべてのruntime sourceが同じwrong / truncated / stale IDで一致しruntime predicateだけを満たすsynthetic caseでも、independent Ground Truth exact=falseならTechnical Spike caseはPASSにしない。Candidate surfaceをoracleにしない。

### Fallback Decision

`CONFIRMED FALLBACK: NONE`

- Browser tab URL欠落 / unsupported時に`location.href` / `document.URL`へfallbackしない。
- Active bindingのないsidebar inventoryからIDを選ばない。
- Canonicalだけ、Active itemだけ、Primaryだけでsuccessにしない。
- Message ID、Turn ID、ordinalをConversation IDへ流用しない。
- Title、body、observed formatからIDを推測しない。
- Raw URL全体をidentityにしない。URLを推測生成しない。
- Required source欠落 / ambiguity / mismatchはFail Closedする。

### Blocking / Non-blocking Questions

#### Blocking for Minimal PoC entry

None。

- Primary、required cross-check、Browser tab URL requirement、route / active binding、cardinality、cross-group equality、format、currentness、Fail Closed、Ground Truth separation、fallbackを既存Evidenceから確定できた。
- AT-004 mismatch detection materialとしてPrimary / Active / canonicalのcross-group equalityが成立する。
- Project coverageへ越境せずStandard strategyを決定できた。

#### Non-blocking / deferred

- Production error enum / mapping / precedence。
- Production selector / canonical source / fallback chain。
- Polling / retry / timeout / general settled algorithm。
- Unobserved query / fragment variation、Settings、New Chat ID未確定、malformed live route、browser/page mismatch live case。
- Sidebar unloaded / virtualized一般解、additional viewport。
- DOM source groupsのinternal generation independence。
- Project Chat route / ID format / strategy。
- TV-003 Standard Coverage Verdict、TV-003 Overall Final Verdict、TASK-001 Exit。

### PoC Entry Criteria

| Entry criterion | Status |
|---|---:|
| 1. Primary source確定 | MET — C-01 / Option A |
| 2. Required cross-check確定 | MET — ActiveConversationItem + canonical C1 |
| 3. Browser tab URL requirement確定 | MET — required、no fallback |
| 4. Current route binding contract確定 | MET |
| 5. Route / ID cardinality確定 | MET |
| 6. Source-internal consistency確定 | MET |
| 7. Cross-group equality確定 | MET |
| 8. Observed-format contract採否確定 | MET — Observed Standard Conversation ID Format v1 |
| 9. Runtime currentness predicate確定 | MET |
| 10. Ground Truth comparator分離 | MET |
| 11. Fail Closed invariants確定 | MET |
| 12. Confirmed fallback有無確定 | MET — NONE |
| 13. A / B independent Ground Truth available | MET |
| 14. Raw URL / ID persistence禁止 | MET |
| 15. PoC scopeを`spikes/`配下に限定 | REQUIRED |

Minimal PoCはsingle snapshot capture / evaluator / independent GT comparatorへ分離できる。Automated waitingを追加する場合は、PoC実装前にsampling / termination contractを別途明示する。このDecisionはwaiting algorithmを含まない。

### Known Limitations

- Standard Chat 2 cases。
- Chrome 151、current ChatGPT UI、1 primary viewport。
- Project Chat未観察。
- Settings未観察。
- New Chat ID未確定state未観察。
- Malformed / ambiguous live route未観察。
- Browser tab URL / page URL mismatch live case未観察。
- Sidebar unloaded / virtualized一般解未検証。
- Additional viewport未検証。
- DOM source groupsのinternal generation independence未証明。
- General settled condition、polling、retry、timeout未設計。
- Production selector / fallback chain未決定。

これらをTV-003 Standard Coverageの新しいFormal Pass条件へ昇格させない。

### Requirement / ADR / Risk Impact

- **FR-004**: Current browser tab URLをPhase 0 Primaryとし、supported observed route / ID consistencyをrequired化した。URL全体をidentityにせず、URL推測生成を禁止した。
- **FR-011**: Conversation ID / URL required metadataを一意に解決・整合確認できないsnapshotはFail ClosedするDecisionとなった。Production保存処理は未実装。
- **ADR-014**: URLはcurrent-tab / navigation source、分離したConversation IDはsystem identity candidateとして区別する。Message / Turn identityを流用しない。
- **ADR-006**: Missing、ambiguous、unsupported、format invalid、cross-group mismatch、stale transitionをsilent acceptしない。
- **AT-004**: Primary / Active / canonical ID mismatchをfuture `CONVERSATION_ID_MISMATCH` candidateへtraceできる。Production error mapping自体は未決定。
- **RISK-029**: Structurally distinct surfacesとstrict Fail Closed predicateをPoCで検証可能になった。ChatGPT UI変更、availability、format drift、Production orchestration riskは残る。
- **FR-031**: 将来Conversation identity利用に関係するが、persistence / diff-save semanticsは未決定。

### Recommended Next Action

次Roundで`TV-003 Standard Coverage Minimal PoC`を、`spikes/TASK-001-standard-chat-dom/`配下だけに必要最小限実装する。

PoCは、Browser tab URL capture、same-group page route consistency、ActiveConversationItem required cross-check、canonical required cross-check、Observed Format v1、Runtime Currentness evaluator、independent Ground Truth comparator、Fail Closed self-testを分離する。追加live探索、Production selector / fallback、Project coverage、Final Verdictへは進まない。

## TV-003 Standard Coverage Minimal PoC Result — 2026-08-15

### Status

- TV-003 Standard Coverage Discovery: **COMPLETE**
- TV-003 Standard Coverage Candidate Decision: **COMPLETE**
- TV-003 Standard Coverage Minimal PoC: **COMPLETE / PASS**
- TV-003 Standard Coverage Verdict: **NOT SET**
- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-001 Final Exit: **NOT YET MET**
- Production implementation: none

このResultはPhase 0 Minimal PoCの実装・self-test・Standard Chat live validationだけを記録する。Candidate Decision、Standard Coverage Final Verdict、Overall Final Verdictは変更しない。

### PoC Revision

`tv003-conversation-id-minimal-poc-v1`

### Implementation Scope

Created:

- `spikes/TASK-001-standard-chat-dom/poc/tv003-conversation-id-poc.mjs`
- `spikes/TASK-001-standard-chat-dom/poc/tv003-conversation-id-poc.selftest.mjs`

PoC responsibilities were separated into:

1. Browser-independent page snapshot capture。
2. Pure Observed Route Shape v1 parser。
3. Pure Observed ID Format v1 validator。
4. Pure runtime currentness evaluator。
5. Independent Runtime Ground Truth comparator。
6. Evidence-safe summary generator。
7. Technical Spike case evaluator。

Current browser tab URLはChrome harnessから取得し、page execution contextの`location.href` / `document.URL`を複製して代用していない。Browser tab URL、page raw URL、pathname、resolved ID、expected IDはRuntime memory内だけで使用した。

Implemented neither Production Adapter / parser / validator / error enum / selector abstraction / fallback chain nor Project Chat support。

### Evidence Provenance Gate

**PASS**

- `Route Shape v1 provenance: confirmed from pre-existing observation`。
  - Candidate Decision作成前のRuntime observation logicはpathname non-empty segments exactly 2、first segmentがobserved literal `c`であることを判定していた。
  - CID-A / CID-Bのpre-existing resultは両方`routeShape=true`、single ID segmentを記録していた。
- `Active route origin binding provenance: confirmed from pre-existing observation`。
  - Candidate Decision作成前のRuntime observation logicはactive anchor candidateをcurrent page routeとsame-origin / same-pathに限定していた。
  - Settled CID-A / CID-Bでcurrent-route active anchor exactly 1、current binding=trueを記録していた。

Candidate Decision自身をObserved Factのoracleとして使用していない。新しいroute grammar、attribute、fallbackを推測していない。

### Environment

- Date: 2026-08-15
- Browser: Chrome 151
- UI: ChatGPT current UI
- Cases: two user-designated Standard Chats, CID-A / CID-B
- Viewport coverage: one primary viewport
- Automated settled detection: **NOT IMPLEMENTED**
- Polling / retry / timeout / fixed sleep / debounce / MutationObserver settle logic: none

### Self-test Result

Commands:

- `node --check spikes/TASK-001-standard-chat-dom/poc/tv003-conversation-id-poc.mjs` — PASS
- `node --check spikes/TASK-001-standard-chat-dom/poc/tv003-conversation-id-poc.selftest.mjs` — PASS
- `node spikes/TASK-001-standard-chat-dom/poc/tv003-conversation-id-poc.selftest.mjs` — PASS, 39 assertion groups

Coverage included:

- Valid complete snapshot / same-source equality / GT exact / Technical Spike PASS。
- Unsupported route、missing / malformed browser URL、missing / malformed / ambiguous Primary ID、page URL / pathname mismatch。
- Active anchor 0 / 2+、binding false、anchor ID missing / malformed、nested ID 0 / 2+ / empty / malformed、internal / Primary mismatch。
- Canonical 0 / 2+ / malformed / Primary mismatch。
- Format v1 wrong length、uppercase、wrong hyphen position、invalid character、empty without repair。
- Primary-only / Active-only / canonical-only / one-required-group-missing no-fallback behavior。
- All runtime sources agreeing on one valid but wrong ID while independent GT differs。
- Invalid Ground Truth input。

The required negative case passed:

- Runtime currentness: `RESOLVED_CURRENT`
- Runtime sources: internally equal
- Independent GT exact: false
- Technical Spike `casePass`: false

### Route / Format Contract Result

#### Observed Standard Conversation Route Shape v1

- URL parseable: required。
- Pathname non-empty segments exactly 2: enforced。
- First segment observed literal `c`: enforced。
- Second segment exactly 1 ID candidate: enforced。
- Extra pathname segment: not ignored; ambiguous / Fail Closed in self-test。
- Query / fragment: not used as an ID source。
- Browser tab URL / page URL whole-string exact consistency: enforced。
- `location.pathname` / parsed pathname exact consistency: enforced。

#### Observed Standard Conversation ID Format v1

- Length exactly 36: enforced。
- Zero-based hyphen positions 8 / 13 / 18 / 23: enforced。
- All other positions lowercase hexadecimal only: enforced。
- No trim、lowercase normalization、repair、UUID version / variant semantics、UUID library generalization。

All resolved live IDs satisfied both Phase 0 contracts。

### Validation Matrix

| Case | Runtime state | Browser / page route consistency | Active anchor | Active binding / internal equality | Canonical | Cross-group equality | Resolved length | GT exact | Case result |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| CID-A Initial settled | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |
| CID-A Reload settled | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |
| CID-A Direct Load settled, independent run | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |
| A → B settled | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |
| B → A settled | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |
| Back A → B settled | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |
| Forward B → A settled | `RESOLVED_CURRENT` | true | 1 | true / true | 1 | true | 36 | true | PASS |

Settled result: **7 / 7 PASS**。

CID-A InitialとCID-A Direct Loadは別runとして実行した。DOM candidateからexpected IDを生成していない。

### Transient Snapshot Result

Natural single snapshotsだけを取得した。Transient capture用のsleep / polling / retryは使用していない。

| Snapshot | State | Active count | Canonical / Primary | Violation codes | Erroneous accept |
|---|---|---:|---:|---|---:|
| CID-A Direct Load return, independent run | `UNRESOLVED` | 0 | equal | `ACTIVE_ANCHOR_MISSING`, `NESTED_ID_MISSING` | No |
| CID-A Reload return | `UNRESOLVED` | 0 | equal | `ACTIVE_ANCHOR_MISSING`, `NESTED_ID_MISSING` | No |
| A → B immediate | `UNRESOLVED` | 0 | mismatch | above + `CANONICAL_PRIMARY_ID_MISMATCH` | No |
| B → A immediate | `UNRESOLVED` | 0 | mismatch | above + `CANONICAL_PRIMARY_ID_MISMATCH` | No |

- Captured transient snapshots: 4。
- Erroneous `RESOLVED_CURRENT`: 0。
- Resolved ID returned in Fail Closed states: 0。

The runtime evaluator does not require or compare a previous raw ID. Discovery-only `STALE` relations remain diagnostic; runtime rejection was based on missing / inconsistent required surfaces。

### Runtime Currentness Result

- All 7 settled snapshots satisfied required Primary, page consistency, ActiveConversationItem, canonical, binding, cardinality, format, and cross-group equality invariants。
- All 7 returned `RESOLVED_CURRENT` and non-null runtime ID internally。
- Every captured transient violated required invariants, returned Fail Closed state, and exposed `resolvedId=null` internally。
- Primary-only route current、canonical-only current、Active missing、partial cross-group agreement were not accepted。
- Confirmed fallback remained `NONE`。

### Ground Truth Comparison

- CID-A / CID-B expected IDs remained the pre-observation user-provided independent oracle。
- Expected lengths: 36 / 36。
- Distinctness: true。
- Settled exact comparisons: 7 / 7 true。
- Transient resolved length: null; exact=false。
- Candidate values were not promoted into expected values。
- Evidence-safe summaries contained no raw expected / resolved ID or raw URL value。

Technical Spike case PASS required both `RESOLVED_CURRENT` and independent GT exact=true。

### Source Consistency

Settled live results:

- Browser tab URL present / parseable / supported: 7 / 7。
- Browser tab URL === `location.href`: 7 / 7。
- Browser tab URL === `document.URL`: 7 / 7。
- `location.pathname` === parsed page pathname: 7 / 7。
- Page IDs === Primary ID: 7 / 7。
- Current-route active anchor exactly 1: 7 / 7。
- Active same-origin / same-path binding=true: 7 / 7。
- Active anchor ID === nested ID === Primary ID: 7 / 7。
- Canonical exactly 1 and Canonical ID === Primary / Active ID: 7 / 7。

The surfaces are structurally distinct validation groups; their internal ChatGPT data-generation independence remains unproven。

### Fail Closed Result

**PASS**

- 39 self-test groups covered missing、ambiguous、unsupported、malformed、format-invalid、binding mismatch、cross-group mismatch、required-source partial resolution、invalid GT input。
- Live direct-load / reload transition with active item 0: Fail Closed。
- Live A → B / B → A transition with active item 0 and canonical mismatch: Fail Closed。
- Runtime-equal but GT-wrong synthetic case: Technical Spike FAIL。
- Silent selection、inventory fallback、canonical-only、Active-only、page-URL fallback、Message / Turn identity reuse: not implemented。

### Requirement / ADR / Risk Impact

- **FR-004**: Current browser tab URLをhost/browser boundaryから取得し、page URLs、active route、nested ID、canonicalとのconsistencyを検証できた。URL全体をidentityにせず、URL推測生成なし。
- **FR-011**: Required Conversation ID / URL surfaceがmissing、ambiguous、invalid、inconsistentなsnapshotはsuccessful IDを返さなかった。Production save guardは未実装。
- **ADR-014**: URL navigation sourceと分離したConversation ID system-key candidateを区別した。Message / Turn identityは流用していない。
- **ADR-006**: Pure self-testと4 live transient snapshotsでFail Closedを再現した。
- **AT-004**: Primary / Active / canonical mismatchを検出し、future `CONVERSATION_ID_MISMATCH` candidateへtrace可能。Production error mappingは未実装。
- **RISK-029**: Current UIの2 Standard ChatsでCandidate strategyを再現し、stale / missing transitionをrejectできた。UI drift、source availability、format change、Production orchestration riskは残る。
- **FR-031**: Future identity useに関係するが、persistence / diff-save identity semanticsは未検証。

### Known Limitations

- Standard Chat 2 cases。
- Chrome 151、current ChatGPT UI、1 primary viewport。
- Project Chat未観察。TV-003 Overall VerdictはPENDING。
- Settings、New Chat ID未確定state、malformed / ambiguous live route、browser/page mismatch live caseは未観察。
- Sidebar unloaded / virtualized一般解、additional viewport未検証。
- DOM source groupsのinternal generation independence未証明。
- Automated settled detection: **NOT IMPLEMENTED**。
- Polling / retry / timeout / fixed sleep / debounce / MutationObserver settle logicなし。
- Production selector / parser / validator / error mapping / fallback chain未決定・未実装。

これらをStandard Coverage Formal Passへ新規追加せず、Final Reviewで既存Formal CriteriaとEvidenceを評価する。

### Repository / Security Checks

- `node --check` PoC: PASS。
- `node --check` self-test: PASS。
- Self-test execution: PASS, 39 groups。
- `git diff --check`: PASS。
- Direct trailing-whitespace scan: 0 findings。
- Raw ChatGPT URL pattern: 0 findings。
- Raw Conversation pathname pattern: 0 findings。
- UUID / raw Conversation ID-like literal: 0 findings。
- Credential / cookie / token / authorization pattern: 0 findings。
- Evidence-safe runtime summary raw-value leak check: false。
- `src/`, `docs/`, `AGENTS.md`: unchanged。
- TV-001 Evidence / PoC: unchanged。
- TV-002 Evidence / PoC: unchanged。
- Changed scope: two new TV-003 PoC files and this TV-003 Evidence file only。

### Recommended Next Action

別Roundで`TV-003 Standard Coverage Final Review / Verdict`を実施する。

Formal Criteria、independent GT、7 settled case results、4 transient Fail Closed results、self-test、Known Limitationsをレビューし、Standard CoverageだけのVerdictを決定する。TV-003 Overall Final Verdict、Project Coverage、TASK-001 Final Exitはまだ確定しない。

## TV-003 Standard Coverage Final Review and Verdict — 2026-08-15

### Status

- Final Review scope: TV-003 Standard Coverage only。
- TV-003 Standard Coverage Discovery: **COMPLETE**。
- TV-003 Standard Coverage Candidate Decision: **COMPLETE**。
- TV-003 Standard Coverage Minimal PoC: **COMPLETE / PASS**。
- TV-003 Standard Coverage Verdict: **PASS**。
- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE**。
- TV-003 Overall Final Verdict: **PENDING**。
- TASK-001 Final Exit: **NOT YET MET**。
- Production implementation: none。

### Review Basis

Evidence hierarchyは次の順で区別した。

1. `docs/05_technical-validation-plan.md`のFormal Technical Validation Plan。
2. このEvidenceで事前定義したStandard Coverage scope。
3. Candidate surfaceから独立したRuntime Ground Truth。
4. 承認済みCandidate Decision。
5. Minimal PoCのlive validation result。
6. Pure self-test result。
7. Known Limitations / Deferred scope。

TV-003全体のHypothesisは、Current tab URL等からConversation IDを一意に取得・検証できることである。Formal overall PassはStandard / Project双方での安定性を要求する。本Reviewは、そのうちStandard Chat coverageだけを評価し、Final Review時に新しいPass条件を追加していない。

### Ground Truth Review

`GROUND_TRUTH EXACT VALUE INDEPENDENCE: ESTABLISHED`

- CID-A / CID-Bのexact expected IDはcandidate observation前にユーザーが指定した。
- Candidate surfaceからexpected IDを生成または更新していない。
- CID-A / CID-Bはdistinctで、双方のexpected lengthは36だった。
- Raw expected IDはRuntime memory内だけで比較し、Evidenceへ永続化していない。
- Settled 7 caseすべてでresolved IDは対応するindependent Ground Truthへexact matchした。

Ground Truth provenanceにStandard Coverage Verdictを妨げるBlockingはない。

### Provenance Gate Review

- Route Shape v1 provenance: **PASS**。Pathのnon-empty segment count、observed route literal、ID segment位置はCandidate Decision前のRuntime observationで確認されていた。
- Active same-origin / same-path binding provenance: **PASS**。Active anchorとcurrent routeのbinding関係はCandidate Decision前のRuntime observationで確認されていた。
- Candidate Decision自身をObservation oracleとして自己参照していない。
- Final Reviewで再観察やroute grammarの拡張は行っていない。

### Candidate Decision Conformance

| Decision area | Approved decision | Minimal PoC conformance | Result |
|---|---|---|---|
| Primary | Current browser tab URL | Chrome host/browser harnessから取得しPrimaryへ渡した | PASS |
| Page source consistency | `location.href` / `location.pathname` / `document.URL` | Primaryとは別のin-page captureとして比較した | PASS |
| Active required cross-check | Active current-route anchor + nested ID metadata | Cardinality、binding、format、内部一致、Primary一致を必須化した | PASS |
| Head required cross-check | Canonical link | Cardinality、route、format、Primary / Active一致を必須化した | PASS |
| Format | Observed Standard Conversation ID Format v1 | 修復・normalizationなしでPhase 0限定contractを適用した | PASS |
| Fallback | `CONFIRMED FALLBACK: NONE` | Page URL、inventory、canonical-only、Active-onlyへfallbackしなかった | PASS |

Option BのActiveConversationItem Primary、canonical diagnostic-only、sidebar inventory fallback、Message / Turn identity流用へのsilent changeはなかった。

Browser tab URLはChrome host/browser harnessから取得され、page execution contextの`location.href` / `document.URL`とは別入力だった。同一page APIを複製した自己比較ではなく、FR-004のcurrent browser tab boundaryを維持している。

### Formal Criteria Matrix

| Criterion | Expected | Actual | Result |
|---|---|---|---|
| CID-A initial | current GT-A | `RESOLVED_CURRENT`、GT exact=true | PASS |
| CID-A reload | same CID-A | `RESOLVED_CURRENT`、GT exact=true | PASS |
| CID-A direct load | CID-A | `RESOLVED_CURRENT`、GT exact=true | PASS |
| A → B | current CID-B | `RESOLVED_CURRENT`、GT exact=true | PASS |
| B → A | current CID-A | `RESOLVED_CURRENT`、GT exact=true | PASS |
| Back A → B | current CID-B | `RESOLVED_CURRENT`、GT exact=true | PASS |
| Forward B → A | current CID-A | `RESOLVED_CURRENT`、GT exact=true | PASS |
| CID-A / CID-B distinct | true | confirmed | PASS |
| Browser / page consistency settled | true | 7 / 7 consistent | PASS |
| Active current binding settled | true | 7 / 7 confirmed | PASS |
| Nested ID equality settled | true | 7 / 7 equal to Active / Primary | PASS |
| Canonical equality settled | true | 7 / 7 equal to Primary / Active | PASS |
| Non-conversation ID inference | none | Home observationでunsupported route、ID生成なし | PASS |
| Raw identifier persistence | none | Evidence-safe summaryとsecurity checksで0 findings | PASS |

Settled live validationは7 / 7 PASSで、すべて`RESOLVED_CURRENT`、Ground Truth exact=true、resolved length=36だった。Same Conversation reload、different Conversation distinctness、navigation、Back / Forward、Direct LoadのStandard Coverage basisを満たした。

### Runtime Currentness Review

PoCは次をすべてrequired invariantとして評価した。

- Browser tab URL present / parseable、observed Standard route、Primary ID exactly 1、Format v1 valid。
- Browser tab URL、`location.href`、`document.URL`のcurrent-route consistencyとpathname consistency。
- Active anchor exactly 1、current-route binding、anchor IDの一意取得とFormat v1、nested ID exactly 1 / non-empty / Format v1。
- Active anchor ID、nested ID、Primary IDの一致。
- Canonical exactly 1、supported route、ID exactly 1 / Format v1、Primary / Active IDとの一致。

全required predicate成立時だけ`RESOLVED_CURRENT`とnon-null resolved IDを返した。Fail Closed stateでは`resolvedId=null`であり、required sourceの一部だけがresolvedしたstateをsuccess扱いしていない。

実装stateは`RESOLVED_CURRENT`、`UNSUPPORTED_ROUTE`、`UNRESOLVED`、`AMBIGUOUS`、`INCONSISTENT`。Transition snapshotはstate precedenceにより`UNRESOLVED`と分類されたが、canonical mismatch等のinconsistency violationも保持し、successful resultを返さなかった。Exact diagnostic labelはFormal Pass条件へ追加していない。

### Transient Fail Closed Review

| Review item | Actual | Result |
|---|---:|---|
| Natural transient snapshots | 4 | EVALUATED |
| Fail Closed | 4 / 4 | PASS |
| Erroneous `RESOLVED_CURRENT` | 0 | PASS |
| Fail Closed時のresolved ID | none | PASS |
| Confirmed fallback使用 | none | PASS |

Direct Load return、Reload return、A → B immediate、B → A immediateはいずれもactive item欠落等によりFail Closedした。A → B / B → A immediateではcanonical mismatchも検出した。Previous raw ID、elapsed time、fixed sleepはruntime accept ruleへ使用していない。Transient evidenceはStandard CoverageのcurrentnessとADR-006を補強するが、すべてのtransition捕捉を新たなPass条件にはしていない。

### Self-test Review

- `node --check` PoC / self-test: PASS。
- Pure self-test: PASS、39 assertion groups。
- Positive complete state、GT exact、Technical Spike case PASSを確認した。
- Unsupported、missing、ambiguous、malformed、Format invalid、page/path mismatch、binding mismatch、Active / nested / Primary mismatch、canonical mismatch、一方のrequired sourceだけresolvedするstateをFail Closedした。
- All runtime sourcesが同じvalid wrong IDで一致するsynthetic caseでも、independent GT exact=falseのためTechnical Spike `casePass=false`だった。
- Invalid Ground Truth inputは`GROUND_TRUTH_INPUT_ERROR`としてcandidate failureと区別した。

Candidate DecisionのFail Closed contractとRuntime currentness / independent oracle separationを十分に再現している。

### URL / ID Consistency Review

Observed Standard Conversation ID Format v1は、length 36、zero-based hyphen positions 8 / 13 / 18 / 23、その他lowercase hexadecimalというPhase 0 Standard Chat限定contractとして使用された。UUID version / variant semantics、uppercase normalization、trim、repair、Project Chatへの一般化、Production永久仕様化は行っていない。

Primary route ID、Active anchor route ID、nested ID metadata、canonical IDのcross-group equalityをrequiredとし、mismatchをFail Closedできた。これはAT-004のfuture `CONVERSATION_ID_MISMATCH` candidateを支持する。Production validatorとerror mappingは未実装であり、Standard CoverageのTechnical Spike成立性と混同していない。

### Known Limitations Classification

| Limitation | Classification | Review rationale |
|---|---|---|
| Standard Chat 2 cases | NON-BLOCKING / DEFERRED | 事前定義したA / B、reload、navigation matrixを満たす |
| Chrome 151 / current ChatGPT UI | NON-BLOCKING / DEFERRED | 現在の検証環境におけるSpike結果として限定済み |
| One primary viewport / additional viewport not tested | NON-BLOCKING / DEFERRED | Standard CoverageのFormal basisへ追加しない |
| Project Chat not observed | BLOCKING only for TV-003 Overall Final Verdict | Formal overall PassはStandard / Project双方を要求する |
| Settings not observed | NON-BLOCKING / DEFERRED | Home non-conversation routeは観察済み。Settings追加観察はFormal basis外 |
| New Chat ID-unassigned state not observed | NON-BLOCKING / DEFERRED | Formal Standard matrixの追加条件ではない |
| Malformed / ambiguous live route not observed | NON-BLOCKING / DEFERRED | Pure self-testでFail Closed contractを確認済み |
| Browser / page mismatch live case not observed | NON-BLOCKING / DEFERRED | Pure self-testでmismatch rejectionを確認済み |
| Sidebar unloaded / virtualized general case not tested | NON-BLOCKING / DEFERRED | General UI availability / settled orchestrationは未設計として限定済み |
| DOM source internal-generation independence not proven | NON-BLOCKING / DEFERRED | Source groupsを構造的cross-checkとして扱い、independent GTをoracleとした |
| Automated settled detection not implemented | NON-BLOCKING / DEFERRED | Manual explicit settled captureでFormal matrixを検証した |
| Polling / retry / timeout / fixed sleep not implemented | NON-BLOCKING / DEFERRED | PoC scope外であり、currentness predicateの成立性とは分離済み |
| Production selector / parser / validator / error mapping / fallback chain未決定・未実装 | NON-BLOCKING / DEFERRED | Phase 0 Technical SpikeはProduction実装を要求しない |

Standard Coverage VerdictをBlockするKnown Limitationはない。Project Chat未観察だけがTV-003 Overall Final VerdictをBlockする。

### Requirement / ADR / Risk Impact

- **FR-004**: Current browser tab URLをhost/browser boundaryから取得し、supported route、page route、Active route、canonicalとのconsistencyを検証した。Raw URL全体をidentityにせず、URLを推測生成していない。
- **FR-011**: Standard ChatのConversation ID / URL required metadataを一意にresolveでき、unresolved / ambiguous / inconsistent時はsilent successしなかった。Production save guardは未実装。
- **ADR-014**: Conversation IDをsystem identity candidate、URLをnavigation / current-tab sourceとして分離した。Message / Turn runtime identityは流用していない。
- **ADR-006**: Missing、unsupported、ambiguous、malformed、format invalid、binding / source mismatch、one-source-only、GT mismatchでFail Closedした。
- **AT-004**: URL / ID mismatch detection strategyの技術成立性を確認した。Production error mappingはdeferred。
- **RISK-029**: Current UIのStandard Chatでは複数の構造的surfaceとindependent GTにより誤ID・stale stateを検出できた。UI drift、source availability、format driftのriskは残存する。
- **FR-031**: Future identity利用への関連のみ。Persistence / differential-save identity semanticsは本Reviewで検証していない。

### Standard Coverage Final Verdict

`TV-003 Standard Coverage Verdict: PASS`

理由:

- Current Standard Chat Conversation IDをindependent Ground Truthに対して一意に取得できた。
- Same Conversation reloadでsame ID、CID-A / CID-Bでdistinct IDを確認した。
- A → B / B → A、Back / Forward、Direct Load後にcurrent Ground Truthへ一致した。
- Browser tab URLとpage route、ActiveConversationItem、nested metadata、canonicalのrequired consistencyがsettled 7 / 7 caseで成立した。
- Transition中のmissing / inconsistent required surfaceをsuccessful IDとしてacceptしなかった。
- Non-conversation routeからIDを推測せず、confirmed fallbackなしでFail Closedした。

このVerdictはStandard Coverageだけに適用し、Project Chatを含むTV-003全体のVerdictではない。

### Overall TV-003 Status

- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE**。
- TV-003 Overall Final Verdict: **PENDING**。

Technical Validation PlanのFormal PassはStandard / Project双方を要求するため、Standard Coverage PASSをOverall PASSへ昇格していない。Traceability gapはSource-of-Truth docsを変更せず維持する。

### TASK-001 Status

`TASK-001 Final Exit: NOT YET MET`

TV-001 / TV-002はPASSし、本ReviewでTV-003 Standard CoverageをPASSとした。Development Backlog上の3 Standard Chat validationをまとめたTASK-001 Final Exit判定は、次の独立Review Roundで行う。

### Recommended Next Action

`TASK-001 Final Exit Review`
