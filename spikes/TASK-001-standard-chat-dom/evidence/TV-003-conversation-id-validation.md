# TASK-001 / TV-003 Conversation ID Evidence

## Status

- Observation date: 2026-08-15
- Environment: Chrome 151 / ChatGPT current UI
- TV-001 Standard Chat Message DOM: **PASS**
- TV-002 Standard Chat Title: **PASS**
- TV-003 Standard Coverage Discovery: **COMPLETE**
- TV-003 Standard Coverage Candidate Decision: **NOT STARTED**
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
