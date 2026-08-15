# TASK-001 / TV-003 Conversation ID Evidence

## Status

- Observation date: 2026-08-15
- Environment: Chrome 151 / ChatGPT current UI
- TV-001 Standard Chat Message DOM: **PASS**
- TV-002 Standard Chat Title: **PASS**
- TV-003 Standard Coverage Discovery: **COMPLETE**
- TV-003 Standard Coverage Candidate Decision: **COMPLETE**
- TV-003 Standard Coverage Verdict: **NOT SET**
- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-001 Final Exit: **NOT YET MET**
- Production implementation: none

No Candidate Decision, PoC, Production parser, or validator was implemented in this round.

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
