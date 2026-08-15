# TASK-001 / TV-002 Standard Chat Title Evidence

## Status

- Phase: Phase 0 Technical Spike
- Scope: TASK-001 / TV-002 Discovery / Candidate Decision / Minimal PoC / Final Review
- Observation date: 2026-08-15 (Asia/Tokyo)
- TV-001 Standard Chat Message DOM: **PASS**
- TV-002 Standard Chat Title: **PASS**
- TV-002 Discovery: **COMPLETE**
- GT-A Reconciliation: **COMPLETE**
- Candidate Decision v1: **COMPLETE**
- Minimal PoC: **COMPLETE / PASS**
- TV-002 Final Verdict: **PASS**
- TV-003 Conversation ID: **NOT STARTED**
- TASK-001 Final Exit: **NOT YET MET**
- Production implementation: none
- Phase 0 PoC Primary / cross-check: **DECIDED**
- Phase 0 PoC revision: `tv002-title-minimal-poc-v1`
- Production canonical selector / fallback chain: **NOT DECIDED**
- Chrome Version: 151.0.7922.109
- ChatGPT UI build: not captured / unavailable

This file stores only aliases, lengths, counts, equality booleans, structural relationships, and state transitions. It does not store raw titles, raw Conversation URLs, Conversation IDs, Message IDs, turn IDs, page HTML, DOM snapshots, screenshots, cookies, tokens, authentication data, or browser storage.

## Formal Validation Scope

### Hypothesis

Current Standard Chat conversation titleを安定取得できる。

### Pass condition

Current conversationに結び付いた、truncatedされていない完全Titleがreload / navigation後も一致する。

### Traceability

- TV-002 Standard Chat Title
- FR-011: Standard Chat Titleは必須Metadata。取得不能時は保存禁止。
- AT-009: 必須Title欠落時は`META_TITLE_NOT_FOUND`相当で保存拒否。
- ADR-006: 必須Metadata欠落または不整合時はFail Closed。
- RISK-028: ChatGPT UI上のTitle取得失敗。
- TASK-001 Exit: Standard ChatのMessage / Title / Conversation ID取得方式をPASS判定。

### Out of scope

- Canonical source / final selector / suffix removal / fallback chainのDecision
- PoC / Production Adapter / `src/`実装
- TV-002 Final Verdict
- TV-003 Conversation IDの取得方式Decision
- Project Chat / Project Name
- Message DOM追加探索
- TitleのNotion保存 / Popup / Phase 1以降

## Runtime Ground Truth

| Alias | Length | Distinguishing property | Provenance / limitation |
|---|---:|---|---|
| GT-A | 48 | Long-title case | 既存の専用long-title validation tabをTitle-Aとしてdesignateし、そのvisible Chrome tab titleをDiscovery用Runtime GTとしてメモリ保持した。独立したexpected fixture / user-provided hashは未提供 |
| GT-B | 12 | Short, clearly different from GT-A | 以前のTASK-001 contextでユーザーから完全Titleを明示されたStandard ChatをTitle-Bとして使用 |

- GT-A / GT-Bは異なる。
- Raw valueはEvidenceへ保存しない。
- GT-Aのprovenanceは`document.title`系candidateから完全に独立していないため、Formal Validation / Candidate Decision前にレビュー対象とする。

## Candidate Inventory

| Alias | Source type | Present / count | Initial exact result | Structural observation |
|---|---|---|---|---|
| T-01 | `document.title` property | 1 value | GT-A / GT-B settled stateでexact | Prefix / suffixなし。reload / navigation中にgenericまたはprevious valueを一時保持した |
| T-02 | `head > title` element | exactly 1 | GT-A / GT-B settled stateでexact | T-01と同じdocument titleを表すため独立candidateとは限らない |
| T-03 | title-related head metadata | `og:title` meta exactly 1 | GT-A / GT-Bともexactではない | GT-A initialでlength 7。Conversation full Title sourceとしては不一致 |
| T-04 | current routeに対応するactive sidebar itemのDOM text | settled stateでexactly 1 active item | GT-A / GT-Bともexact | Current routeに対応するanchorは2件あったが、`data-active`を持つTitle itemは1件。exact text nodesはnested 7件、root-most text leafは1件 |
| T-05 | T-04の`aria-label` | exactly 1 | GT-A / GT-Bともexact | DOM textと同じ完全Titleを保持。`title` attributeはabsent |
| T-06 | Sidebar itemの`title` attribute | 0 | absent | Candidateとして利用可能な値を観察しなかった |
| T-07 | Main / headerのheading / title-like DOM | Full Title exact candidate 0 | absent | `h1` / `h2` / `role=heading`等は存在したがcurrent full Titleとのexact matchなし |
| T-08 | `data-testid`にtitleを含むDOM candidate | 0 in initial inventory | absent | 観察済みcurrent UIではcandidateなし |

Nested exact text nodesは同じsidebar item内のancestor / descendant chainであり、独立した7 candidatesとして扱わない。Canonical sourceは未決定。

## Initial Observation

### State A1 — Title-A initial

- Viewport: 1920 x 911 CSS px。
- T-01: present、length 48、GT-A exact、prefix / suffixなし。
- T-02: count 1、GT-A exact。
- T-03: count 1、length 7、GT-A exactではない。
- Current route matching links: 2。
- T-04 active sidebar item: count 1、DOM text length 48、GT-A exact。
- T-05 aria-label: length 48、GT-A exact。
- Sidebar itemのnested exact text nodes: 7、root-most / leaf exact text node: 1。
- T-07 Main / header exact candidate: 0。
- T-08: 0。

### Title-B settled observation

- T-01: length 12、GT-B exact、prefix / suffixなし。
- T-02: count 1、GT-B exact。
- T-03: count 1、GT-B exactではない。
- T-04 active sidebar item: count 1、DOM text length 12、GT-B exact。
- T-05 aria-label: length 12、GT-B exact。
- T-07 Main / header exact candidate: 0。

## Reload

### State A2 — Title-A reload

Reload直後の最初のreadでは、次のtransitional stateを観察した。

- T-01: presentだがlength 7、GT-A exactではない。
- T-02: count 1、GT-A exactではない。
- T-04 / T-05: active current Title candidate count 0。
- Body内のGT-A exact candidate: 0。

その後のcurrent candidate成立状態では次へ更新された。

- T-01 / T-02: GT-A exact、length 48。
- T-04: active item exactly 1、DOM text GT-A exact。
- T-05: aria-label GT-A exact。
- Previous GT-Bはcurrent `document.title` / active sidebar candidateとして残存しなかった。

Fixed sleep、duration estimate、Production settled conditionは決定していない。観察したのは「reload直後にgeneric / absent状態があり、後にcurrent full Titleへ更新された」というstate transitionだけである。

## A → B → A Navigation

### State B1 — client-side A → B

- Navigation開始後、route切替前のsamplingではT-01 / active sidebar itemは旧Aのままだった。
- Route切替確認直後に、T-01がGT-A / GT-Bのどちらでもなく、active current sidebar candidateが未確立のstateを観察した。
- Settled stateではT-01 / T-02 / T-04 / T-05がGT-Bへexact一致した。
- Settled stateでprevious GT-Aはcurrent candidateに残らなかった。

### State A3 — client-side B → A

Route切替確認直後に次のsequenceを観察した。

1. T-01はprevious GT-Bのまま（`STALE`）、T-04 / T-05 active current candidateは0。
2. T-04 / T-05はGT-A exactへ更新したが、T-01はlength 7のgeneric value。
3. T-01 / T-02もGT-A exactへ更新。

Settled stateではT-01 / T-02 / T-04 / T-05がGT-Aへ一致し、previous GT-Bはcurrent candidateとして残存しなかった。

このObservationは、`document.title`がnavigationの任意時点で必ずcurrentであるとは限らず、candidate間の不一致 / absenceがtransientに発生し得ることを示す。DurationやProduction waiting ruleは決定していない。

## Back / Forward

### Back: A → B

- Browser Back後、routeはTitle-Bへ戻った。
- Observation APIが返した時点ではT-01 / T-02 / T-04 / T-05がGT-B exact。
- Previous GT-Aのstale current candidateは観察しなかった。

### Forward: B → A

- Browser Forward後、routeはTitle-Aへ進んだ。
- Observation APIが返した時点ではT-01 / T-02 / T-04 / T-05がGT-A exact。
- Previous GT-Bのstale current candidateは観察しなかった。

Back / Forward APIがnavigation完了まで待つ可能性があるため、「transient stale stateが存在しない」とまでは一般化しない。Settled currentnessだけをConfirmed Factとする。

## Direct Load

Known Title-A locationを新しい認証済みChrome tabでdirect loadした。

- Direct navigation call直後のChrome tab titleはGT-A exactではなかった。
- Page candidate成立後はT-01 / T-02 / T-04 / T-05がGT-A exact。
- T-04 active item exactly 1。
- T-03はGT-A exactではない。
- T-07 Main / header exact candidateは0。
- Raw URL / route componentは保存せず、TV-003 Decisionへ使用しない。

## Truncation Findings

### Title-A long-title case

- Active sidebar itemをviewport内へ表示して目視・geometry確認した。
- T-04 DOM text: GT-A exact、length 48。
- T-05 aria-label: GT-A exact、length 48。
- Text chain内に`overflow-x: hidden`のclipping ancestorが存在した。
- Clipping node: client width 221、scroll width 316。
- 表示はfull Title末尾まで見えず、DOM text / aria-labelには完全値が残った。
- Classification: **FULL + DISPLAY_ONLY_TRUNCATED**。
- Literal ellipsisをDOM textへ追加した形ではなく、表示boxによるclipだった。

### Title-B short-title case

- DOM text / aria-labelともGT-B exact、length 12。
- Clippingを観察しなかった。
- Classification: **FULL**。

### Collapsed sidebar

- Sidebarをcollapsed表示にした場合もT-04 / T-05の完全値はDOMに残った。
- Active itemのbounding rectはviewport外で、画面上はTitle itemを確認できなかった。
- Classification: **FULL IN DOM + HIDDEN / OFF-VIEWPORT**。
- Sidebarをexpanded状態へ戻した。

Screenshotはruntime visual inspectionだけに使用し、Evidenceへ保存していない。

## Candidate Comparison

| Candidate | Completeness | Currentness | Reload / navigation | Truncation classification | Discovery assessment |
|---|---|---|---|---|---|
| T-01 `document.title` | Settled A / BでFULL、prefix / suffixなし | Settled stateでcurrent | reload / navigation / direct loadで追従。ただしgeneric / stale transitional stateあり | `FULL` settled、`STALE` / non-GT transient | 有望だが任意時点の単独readはunsafe。Canonical Decisionは未実施 |
| T-02 `head > title` | Settled A / BでFULL | T-01と同じ | T-01と同じ | T-01と同じ | T-01と同じunderlying document titleであり独立cross-checkとは未確認 |
| T-03 `og:title` | GT-A / GT-Bに不一致 | Current conversation追従を確認できない | Exact matchなし | `AMBIGUOUS / NON-MATCHING` | Current full Title candidateとして支持されない |
| T-04 active sidebar DOM text | A / BでFULL | Settled時にactive item exactly 1 | A → B → A、Back / Forward、Direct Loadで追従。transition中は0件あり | A=`DISPLAY_ONLY_TRUNCATED`、B=`FULL` | DOM値は有望。Visual stringだけを取得値にしてはならない |
| T-05 active sidebar aria-label | A / BでFULL | T-04と同じactive item | T-04と同じ | `FULL`; collapsed時はitemがoff-viewport | 有望だがT-04と同一elementのため独立sourceとは限らない |
| T-06 sidebar `title` attribute | ABSENT | not evaluated | absent | `ABSENT` | Candidateなし |
| T-07 Main / header full-title DOM | ABSENT | not evaluated | exact candidateなし | `ABSENT` | Candidateなし |
| T-08 title test-id DOM | ABSENT | not evaluated | candidateなし | `ABSENT` | Candidateなし |

No canonical source, selector, currentness invariant, suffix rule, or fallback chain was selected in this Discovery Round.

## Fail Closed Materials

| Failure candidate | Observed material | TV-002 implication candidate |
|---|---|---|
| Title candidate 0件 | Reload / navigation transition中にactive sidebar candidate 0件 | Current full Titleを確認できない時点では成功扱いしない |
| 複数candidateを一意化できない | Sidebar exact nodesはnested chainで、route-matching anchorsは2件だがactive Title itemは1件。Settled stateでindependent competing full rootsは未観察 | Containment / current markerを無視したraw countはambiguousになり得る |
| Ground Truth完全Titleと不一致 | T-03はA / Bとも不一致。T-01はtransition中にgeneric / stale | Non-matching candidateをTitleとして採用しない |
| Truncated candidateしかない | Title-A visual表示はtruncatedだがDOM text / aria-label / document titleはfull | 表示ellipsis / clipされた見た目を取得値として成功扱いしない |
| Previous Conversationのstale Title | B → A route切替後、T-01がprevious GT-Bを一時保持 | Stale T-01単独を成功扱いしない |
| Navigation後candidate間で不一致 | Sidebar active A / T-01 genericのstateを観察 | Candidate consistencyを満たさないstateはFail Closed材料 |
| Current Conversationへの追従未確認 | Transitional state、collapsed / off-viewport、GT-A provenance limitation | Currentnessを確認できなければ`META_TITLE_NOT_FOUND`相当で停止する材料 |

Confirmed safe fallbackはまだ決定していない。Candidateが0 / ambiguous / non-GT / stale / truncated-only / mutually inconsistentの場合に、推測で値を補わずFail Closedする方針はFR-011 / ADR-006 / AT-009と整合する。

## Known Limitations

- GT-Aは専用long-title test tabのvisible Chrome tab titleをDiscovery用GTとしてdesignateしたもので、独立fixture / expected hashがない。
- 2 Standard Chats、1 Chrome version、1920 x 911 viewportでのObservation。
- Responsive viewport variationは未実施。Expanded / collapsed sidebar stateのみ比較した。
- Back / Forwardのtransient stateはnavigation API待機後に観察したため、settled result以外を否定できない。
- A / B以外のTitle length、同名Conversation、Title rename中、sidebar itemがlist外 / unloadedのcaseは未観察。
- ChatGPT UI buildは取得できなかった。
- Internal API / React state / private network通信は調査していない。
- Canonical source、selector、settled/currentness invariant、fallback、Final Verdictは未決定。

## Requirement / ADR / Risk Impact

- **FR-011**: Settled stateでは完全Title candidateが複数surfaceで観察できた。一方、reload / navigation transition中は欠落・generic・staleが存在し、必須Metadata validatorがcurrentnessを検証する必要がある。
- **AT-009**: 0件、non-matching、stale、truncated-only、candidate不一致を`META_TITLE_NOT_FOUND`相当へ結び付けるDecision材料を得た。Error code実装はしていない。
- **ADR-006**: Transient stale `document.title`やunresolved candidateをsilent acceptせず、confirmed invariantなしではFail Closedする必要がある。
- **RISK-028**: Full Title自体はobserved surfacesに存在したが、candidate availability / currentness / display truncationに依存するriskを確認した。Multiple selector strategyはまだ決定していない。
- **TASK-001**: TV-002はDiscovery完了だがFinal Verdict未設定。TV-003も未開始のためTASK-001 Exitは未達。

## Remaining Questions

### Blocking before Candidate Decision / Formal Validation

1. GT-Aのraw valueをGitへ保存せず、ユーザー確認または独立length / hash fixtureでRuntime Ground Truthとして確定できるか。
2. T-01のstale / generic transitionとT-04 / T-05の一時absenceを踏まえ、どのcandidate consistencyをcurrentness invariantとして要求するか。
3. T-01 / T-02は同じdocument title、T-04 / T-05は同じsidebar itemである。独立sourceとcross-checkをどう区別するか。

### Non-blocking for Discovery completion

- Additional viewport / responsive breakpoint variation。
- Sidebar listからcurrent itemがunmounted / unloadedとなるcase。
- Same-title A / B conversationでのcurrentness判定（TV-003との境界を含む）。
- Longer / shorter / renamed Title variation。
- Product prefix / suffixは今回観察しなかったため、strip ruleを作らない。

## Recommended Next Action

GT-A provenanceとtransient currentness Findingをレビューする。Runtime Ground Truthを確定できた後、T-01〜T-05についてCandidate Decision materialsを整理し、Primary / cross-check / cardinality / currentness invariant / Fail Closed条件を審議する。追加DOM探索、PoC実装、canonical source、fallback chain、TV-002 Final Verdictは明示承認まで開始しない。

---

## TV-002 Ground Truth Reconciliation — 2026-08-15

### Reconciliation Status

- Result: **BLOCKED**
- Blocking code: `GT_A_GROUND_TRUTH_NOT_INDEPENDENT`
- TV-002 Candidate Decision v1: **NOT SET**
- TV-002 Final Verdict: **NOT SET**
- TV-002 PoC / Production implementation: none

### Ground Truth Provenance Audit

| Alias | Independent Runtime Ground Truth | Evidence-safe result |
|---|---|---|
| GT-A | No | Length 48。Discovery時のvisible Chrome tab titleだけに由来し、ユーザーが明示した完全Title、独立expected value、fixture、hashはRuntime context内に確認できない |
| GT-B | Yes | Length 12。Discoveryより前にユーザーが完全Titleを明示したため、candidateとは独立したRuntime Ground Truthとして扱える |

GT-Aを`document.title`、`head > title`、visible Chrome tab titleのいずれからも再生成していない。Raw TitleはこのEvidence、Git、logへ保存していない。

### Gate Result

`BLOCKING: GT_A_GROUND_TRUTH_NOT_INDEPENDENT`

指定されたGround Truth gateを満たさないため、このRoundではCandidate Decisionを確定しない。既存Discoveryに含まれるcandidate observationは履歴として維持するが、Ground Truthから独立した検証結果として再解釈したり、Decisionへ昇格させたりしない。

### Candidate Decision Impact

- Source Grouping: **NOT FINALIZED IN THIS ROUND**
- Primary candidate: **NOT SET**
- Independent cross-check: **NOT SET**
- Runtime currentness invariant: **NOT SET**
- Cardinality / consistency invariant: **NOT SET**
- Fail Closed invariant set: **NOT SET**
- Confirmed safe fallback: **NOT EVALUATED / NONE ADOPTED**
- PoC Entry: **BLOCKED**

T-01 / T-02およびT-04 / T-05のunderlying-source grouping、T-03 / T-06〜T-08のDecision、Primary / cross-check、cross-source equality、currentness predicateは、gate通過後のCandidate Decision Roundへ残す。未観察fallbackは推測しない。

### Requirement / ADR / Risk Impact

- **FR-011**: Titleは必須Metadataであり、独立Ground Truthなしに取得candidateを自己承認してはならない。
- **ADR-006**: Ground Truth provenanceが未解決の状態をsilent successとせず、Candidate DecisionをFail Closedで停止した。
- **AT-009**: Production error codeは実装していない。安全にTitleをresolveできない状態は将来の`META_TITLE_NOT_FOUND`相当の保存拒否材料となる。
- **RISK-028**: Candidate自身からexpected Titleを生成するとTitle取得失敗を検出できないため、validation oracleの独立性を維持する必要がある。
- **TV-002 / TASK-001**: TV-002 Final VerdictおよびTASK-001 Final Exitは未確定のまま。

### Blocking Question

GT-Aについて、candidate surfaceから取得していない完全TitleをユーザーがRuntime inputとして明示するか、独立に事前作成したexpected value / fixture / hashを提供できるか。

Raw Titleを提供する場合はRuntime comparisonだけに使用し、Evidenceへはalias、length、comparison booleanのみを残す。

### PoC Entry Criteria

1. GT-Aの独立Runtime Ground Truthが確定する。
2. そのGround Truthをcandidate surfaceから再生成していないことを確認する。
3. Candidate Decision Roundでsource grouping、Primary / independent cross-check、currentness、cardinality、consistency、Fail Closed条件を確定する。
4. Candidate DecisionがEvidenceから支持され、Blocking Questionが解消する。

### Recommended Next Action

ユーザーから独立GT-Aを受領後、追加DOM探索を原則行わず、既存Discovery Evidenceと独立GT-Aを用いてGround Truth comparisonをreconcileする。その後にのみTV-002 Candidate Decision v1を再開する。PoC、Production実装、TV-002 Final Verdict、TV-003は開始しない。

---

## TV-002 GT-A Ground Truth Reconciliation — 2026-08-15

### Status

- Result: **`GT_A_GROUND_TRUTH_RECONCILED`**
- Previous blocking code: `GT_A_GROUND_TRUTH_NOT_INDEPENDENT` — resolved by user-provided pre-established Runtime Ground Truth
- GT-A: independent Runtime Ground Truth、length 48
- GT-B: existing independent Runtime Ground Truth、length 12
- TV-002 Candidate Decision v1: completed below
- TV-002 Final Verdict: **NOT SET**
- TV-002 PoC / Production implementation: none

Raw GT-A / GT-BはRuntime comparisonだけに使用し、Evidence、Git、logへ保存していない。Candidate値からGround Truthを再生成または更新していない。

### Settled-state Recomparison

既知のTitle-A validation caseで、新candidateを探索せずT-01 / T-02 / T-04 / T-05だけを再比較した。

| Candidate | Cardinality | Candidate length | GT-A exact | Consistency |
|---|---:|---:|---|---|
| T-01 `document.title` | 1 value | 48 | true | T-02とexact equality |
| T-02 `head > title` | exactly 1 | 48 | true | T-01とexact equality |
| T-04 active sidebar item DOM text | active item exactly 1 | 48 | true | T-05とexact equality、current route binding=true |
| T-05 same active item `aria-label` | exactly 1 on T-04 item | 48 | true | T-04とexact equality |

- T-01 / T-02 source-internal consistency: true
- T-04 / T-05 source-internal consistency: true
- Active Sidebar / Document Title cross-source consistency: true
- Current route matching anchorは2件だったが、active Title itemはexactly 1だった。

Gate条件を満たしたため、Candidate Decision v1へ進む。

## TV-002 Candidate Decision v1

### Decision Scope

Phase 0 TASK-001 TV-002 PoCで検証するTitle acquisition strategyを定める。Production selector、Production fallback chain、waiting / retry / timeout、TV-002 Final Verdictは定めない。

### Source Grouping

| Underlying source | Surfaces | Grouping decision | Independence |
|---|---|---|---|
| `DocumentTitleSurface` | T-01 `document.title`、T-02 `head > title` | 同じunderlying document titleのproperty / element surfaceとしてgroup化 | T-01 / T-02は互いにindependent cross-checkではなくsource-internal consistency check |
| `ActiveSidebarTitleSurface` | T-04 active item DOM text、T-05 same item `aria-label` | 同じcurrent-route active sidebar itemのtext / accessible-name surfaceとしてgroup化 | T-04 / T-05は互いにindependent cross-checkではなくsource-internal consistency check |
| Head metadata | T-03 `og:title` | Document titleとは別surfaceだがcurrent full Titleと不一致 | Candidateとして不採用 |
| Sidebar `title` attribute | T-06 | Observed count 0 | Source not available |
| Main / header Title | T-07 | Full Title exact candidate 0 | Source not available |
| Title-related test-id | T-08 | Observed candidate 0 | Source not available |

### Candidate Decision Table

| Candidate | Decision | Role in TASK-001 TV-002 PoC | Evidence | Limitation |
|---|---|---|---|---|
| T-01 `document.title` | **CROSS-CHECK ONLY** | `DocumentTitleSurface` value | GT-A / GT-B settled stateでfull exact。reload / navigationに追従 | previous Titleの一時保持とgeneric valueを観察。単独readはcurrentnessを保証しない |
| T-02 `head > title` | **ADOPT AS SOURCE-INTERNAL CONSISTENCY SURFACE** | exactly 1とT-01 equalityを要求 | T-01と常に一致し、GT-A reconciliationでもcount 1 / exact | T-01と同一underlying sourceで、独立cross-checkではない |
| T-03 `og:title` | **REJECT** | 使用しない | GT-A / GT-Bの完全Titleと不一致、current conversation追従を支持するEvidenceなし | Fallbackへ転用しない |
| T-04 active sidebar item DOM text | **ADOPT FOR TASK-001 TV-002 POC** | `ActiveSidebarTitleSurface` Primary value | Settled A / Bでfull exact。current routeへboundしたactive item exactly 1。navigation / reload / Back / Forward / direct load後に追従 | transition中0件。current itemのProduction selectorは未決定 |
| T-05 same item `aria-label` | **ADOPT AS SOURCE-INTERNAL CONSISTENCY SURFACE** | T-04とnon-empty exact equalityを要求 | Settled A / Bでfull exact。visual clipping / collapsed時もfull valueを保持 | T-04と同一elementで、独立fallbackではない |
| T-06 sidebar `title` attribute | **NOT AVAILABLE** | 使用しない | Observed count 0 | Fallbackなし |
| T-07 Main / header Title | **NOT AVAILABLE** | 使用しない | Full Title exact candidate 0 | Fallbackなし |
| T-08 Title-related `data-testid` | **NOT AVAILABLE** | 使用しない | Observed candidate 0 | Fallbackなし |

### Primary / Independent Cross-check

**Option Aを採用する。**

- Primary: `ActiveSidebarTitleSurface` — **ADOPT FOR TASK-001 TV-002 POC**
- Independent cross-check: `DocumentTitleSurface` — **CROSS-CHECK ONLY、ただしaccept時は必須**
- Cross-source invariant: `ActiveSidebarTitleValue === DocumentTitleValue`

Option Aの採用理由:

1. Active sidebar itemはcurrent routeへのbindingを直接確認できる。
2. Settled stateではactive itemがexactly 1で、DOM text / `aria-label`がfull Titleとして一致した。
3. Long Titleのvisual clippingとcollapsed sidebarのoff-viewport状態でもDOM値はfullだった。
4. Transition中のactive item 0件は成功値を返さず、Fail Closedしやすい。
5. `document.title`にはprevious Conversation Titleの一時保持とgeneric valueが観察され、単独Primaryではstaleをacceptし得る。

Option Bは**REJECT AS PRIMARY**とする。Document Titleは有用なindependent sourceだがcurrent routeへのactive bindingを持たず、既知のstale / generic transitionがある。Option Bでも安全なcurrentnessにはActive Sidebarを必須とする必要があり、Primaryとしての優位性がEvidenceから支持されない。

Document Titleは任意fallbackではない。両underlying sourceがresolveし、内部一致とcross-source一致をすべて満たすstateだけをacceptする。

### Validation Invariant

Technical Spikeでは、Runtime Ground Truthが提供されたcaseごとに次を要求する。

1. `ActiveSidebarTitleSurface`がresolveする。
2. `DocumentTitleSurface`がresolveする。
3. 両source valueがexact equalityである。
4. Resolved valueがRuntime Ground Truthとexact equalityである。

GT-A reconciliationでは上記がすべてtrue。GT-Bは既存Discovery Evidenceでsettled stateのT-01 / T-02 / T-04 / T-05がGT-B exactだった。

### Runtime Currentness Invariant

Production runtimeにGround Truthまたはprevious Title値が存在しない場合でも、TASK-001 TV-002 PoC candidateとして次のstate predicateをすべて満たす場合だけTitleをaccept可能とする。

1. Current routeに対応するactive sidebar Title itemがexactly 1。
2. Active sidebar itemがcurrent routeへbindされている。
3. Sidebar DOM textがnon-empty。
4. Sidebar `aria-label`がnon-empty。
5. Sidebar DOM textと`aria-label`がexact equality。
6. `head > title`がexactly 1。
7. `document.title`がnon-empty。
8. `document.title`と`head > title` textがexact equality。
9. Active Sidebar valueとDocument Title valueがexact equality。

このpredicateはTitle文字列一致だけに依存せず、current routeへのactive bindingを必須とする。Same-title Conversation navigationはlive validation未実施だが、文字列だけではstale/currentを区別できないためroute bindingを省略しない。

Specific generic string、特定length、previous Title値、Runtime Ground TruthをProduction currentness ruleへハードコードしない。これはaccept可能なstate predicateであり、polling / timeout / settled algorithmではない。

### Transient State Classification

| Observed state | Classification | Accept |
|---|---|---|
| Document Titleがprevious Conversation Titleを保持 | `STALE` | No |
| Document Titleがgenericで、active sidebarが未解決 | `UNRESOLVED` | No |
| Active sidebar Title candidateが0 | `UNRESOLVED` | No |
| Active sidebarはcurrentだがDocument Titleがgeneric | `INCONSISTENT` | No |
| 両sourceがsource-internal consistency、route binding、cross-source equalityを満たしcurrent full Titleで一致 | `RESOLVED_CURRENT` | Yes |
| Visual displayだけtruncatedだが両DOM sourceがfullでpredicate成立 | `RESOLVED_CURRENT` + `DISPLAY_ONLY_TRUNCATED` | Yes |
| Sidebar collapsedでfull値がDOMに残るがoff-viewport、predicate成立 | `RESOLVED_CURRENT` + `HIDDEN_OR_OFF_VIEWPORT` | Yes |

Production runtimeではknown previous valueやspecific generic literalで分類せず、required predicateの欠落・不一致としてrejectする。Fixed sleep、polling interval、timeout、retry回数、settle durationは決定しない。

### Cardinality / Consistency

| Check | Required result | Otherwise |
|---|---|---|
| Active sidebar Title item | exactly 1 | 0=`UNRESOLVED`、2+=`AMBIGUOUS`; Fail Closed |
| Sidebar DOM text | non-empty | Fail Closed |
| Sidebar `aria-label` | non-empty | Fail Closed |
| Sidebar internal equality | DOM text === `aria-label` | mismatch=`INCONSISTENT`; Fail Closed |
| Current route binding | confirmed true | Fail Closed |
| `head > title` | exactly 1 | 0=`UNRESOLVED`、2+=`AMBIGUOUS`; Fail Closed |
| `document.title` | non-empty | Fail Closed |
| Document internal equality | `document.title` === head title text | mismatch=`INCONSISTENT`; Fail Closed |
| Cross-source equality | Sidebar value === Document Title value | mismatch=`INCONSISTENT`; Fail Closed |

### Fail Closed Invariants

次の場合はTitle取得成功とせず、Production実装時の`META_TITLE_NOT_FOUND`相当として保存禁止に結び付けるCandidate Decisionとする。

- Active sidebar Title itemが0または2+。
- Sidebar DOM textまたは`aria-label`がempty。
- Sidebar DOM textと`aria-label`が不一致。
- Active sidebar itemのcurrent route bindingを確認できない。
- `head > title`が0または2+。
- `document.title`がempty。
- `document.title`とhead title textが不一致。
- Active SidebarとDocument Titleが不一致。
- 一方のunderlying sourceだけがresolved。
- Previous Conversationのstale Titleを保持するstate。
- Generic / unresolved Titleでrequired predicateを満たさないstate。Specific generic literalは判定規則にしない。
- Current Conversationへの追従を一意に確認できないstate。
- DOM value自体がtruncated、またはliteral ellipsis等でfull Titleを復元できないstate。

Visual clippingだけでDOM text / accessible name / Document Titleにfull valueが残り、全predicateを満たす場合はFailureにしない。Truncated DOMから文字列を推測復元しない。

このDecisionはFR-011、ADR-006、AT-009と整合し、RISK-028のsilent metadata corruptionを抑止する。

### Fallback Decision

**`CONFIRMED FALLBACK: NONE`**

- T-01 / T-02は同じunderlying sourceであり、互いのfallbackではない。
- T-04 / T-05は同じactive sidebar itemであり、互いのindependent fallbackではない。
- `DocumentTitleSurface`はPrimary failure時のfallbackではなく、accept時に必須のindependent cross-checkである。
- T-03はRejected、T-06 / T-07 / T-08はNot Available。
- 一方のsourceだけでcurrentness invariantを満たさない状態をsilent successにしない。

### Blocking / Non-blocking Questions

#### Blocking for minimal PoC implementation

- **None.** GT-A / GT-Bの独立Ground Truth、source grouping、Primary、cross-check、accept predicate、Fail Closed条件が確定した。

#### Non-blocking / Deferred

- Fixed sleep、polling interval、timeout、retry回数、settle duration。
- Production selector / fallback chain。
- Same-title Conversation navigationのlive validation。
- Title rename中の挙動。
- Sidebar item unloaded / virtualized時の一般解。
- Additional viewport variation。
- Prefix / suffix / Product名除去。今回未観察のためstrip ruleを作らない。
- Project Chat / TV-003。

### PoC Entry Criteria

Minimal TV-002 PoCへ進む条件を次のとおり確定し、本Decision時点ですべて満たす。

1. GT-A / GT-Bをcandidateから独立したRuntime Ground Truthとして固定する。
2. Raw Title、raw URL、runtime identifierをEvidence / Git / logへ永続化しない。
3. `ActiveSidebarTitleSurface`をPrimary、`DocumentTitleSurface`を必須independent cross-checkとして実装する。
4. 各sourceのcardinality、non-empty、source-internal equality、current route binding、cross-source equalityを検証する。
5. Ground Truth comparisonとRuntime currentness predicateを別の結果として報告する。
6. Transient snapshotを成功扱いせず、`RESOLVED_CURRENT` predicate成立時だけacceptする。
7. Confirmed fallbackを実装せず、invariant違反時はFail Closedする。
8. Initial、reload、A → B → A、Back / Forward、Direct Loadで既存Validation Matrixを再現する。
9. Visual-only clippingとDOM value truncationを区別する。
10. Automated waitingを追加する場合は、実装・実行前にSpike専用のsampling / termination contractを別途明示する。Manual settled captureならProduction settled algorithmを設計しない。

### Known Limitations

- 2 Standard Chats、1 Chrome version、1 primary viewportでのEvidence。
- Same-title Conversation navigation、rename中、sidebar item unloaded / virtualizedはlive validationしていない。
- 両independent sourceが同じtruncated DOM値を返す未観察caseを一般的に検出する方式は確定していない。Technical SpikeではRuntime Ground Truth comparisonを維持する。
- Visual clipping / collapsed stateは観察済みだが、responsive breakpoint variationは未実施。
- State predicateだけを決定し、waiting / retry / timeout algorithmは決定していない。
- Production selector、fallback chain、prefix / suffix処理は未決定。

### Recommended Next Action

承認後、`spikes/TASK-001-standard-chat-dom/`配下だけでTV-002 Minimal PoCを計画・実装する。PoCはPrimary / cross-check / currentness predicate / Fail ClosedをA / Bの既存Validation Matrixで再現し、Raw TitleをEvidenceへ保存しない。TV-002 Final Verdict、TV-003、Production実装は開始しない。

---

## TV-002 Minimal PoC Result — 2026-08-15

### Status

- PoC revision: `tv002-title-minimal-poc-v1`
- Minimal PoC result: **PASS**
- TV-002 Final Verdict: **NOT SET**
- Blocking issue: none
- Production implementation: none

### Implementation Scope

追加したPhase 0専用file:

- `poc/tv002-title-poc.mjs`
  - Single-snapshot browser capture
  - Runtime currentness evaluator
  - Independent Runtime Ground Truth comparator
  - Evidence-safe summary
- `poc/tv002-title-poc.selftest.mjs`
  - Pure evaluator / comparatorのcontract test

TV-001 PoC、Production `src/`、docs、AGENTS.mdは変更していない。Polling、retry、timeout、fixed sleep、fallback、suffix stripping、Conversation ID extractionは実装していない。

### Current-route Binding Implementation

DiscoveryおよびGT-A Reconciliationで使用済みのpredicateだけを再現した。

1. Current locationのpathnameとanchor destinationのpathnameが一致するanchorをscopeとする。
2. そのscope内で`data-active`を持つitemをactive sidebar Title candidateとする。
3. Active candidateがexactly 1で、同じpathname equalityが成立する場合だけ`currentRouteBound=true`とする。

Raw href、pathname、Conversation IDは返却summary、Evidence、file logへ保存していない。ID extractionやroute componentの意味解釈は行っていない。

### Environment

- OS: Windows
- Browser: Chrome 151.0.7922.109
- ChatGPT UI build: not captured / unavailable
- Validation source: authenticated live Standard Chat tabs
- Ground Truth: GT-A length 48、GT-B length 12

### Self-test Result

- `node --check poc/tv002-title-poc.mjs`: PASS
- `node --check poc/tv002-title-poc.selftest.mjs`: PASS
- `node poc/tv002-title-poc.selftest.mjs`: PASS

Pure self-test coverage:

- All invariants true: `RESOLVED_CURRENT`
- Visual-only clipping diagnostic + full DOM values: accepted
- Active item 0 / 2+
- Sidebar text empty / `aria-label` empty / internal mismatch
- Current-route binding false
- `head > title` 0 / 2+
- Document Title empty / internal mismatch
- Cross-source mismatch
- Sidebar-only / Document-only resolution
- Known DOM-value truncation
- Both DOM sources agree on the same wrong or truncated value while independent Ground Truth mismatches
- Invalid empty Ground Truth input

Fail Closed contract cases: 14 / 14 PASS。Ground Truth separation caseではruntime currentnessが成立してもGT mismatchのためTechnical Spike caseはPASSにならなかった。

### Validation Matrix

同じ未変更PoCでsingle snapshot captureを実行した。Operation直後に自然に取得できたtransient snapshotと、明示的settled snapshotを分離した。

| Case | State | Route bound | Sidebar internal | Document internal | Cross-source | Resolved length | GT exact | Result |
|---|---|---|---|---|---|---:|---|---|
| Title-A initial settled | `RESOLVED_CURRENT` | true | true | true | true | 48 | true | PASS |
| Title-A reload settled | `RESOLVED_CURRENT` | true | true | true | true | 48 | true | PASS |
| Title-A direct load settled | `RESOLVED_CURRENT` | true | true | true | true | 48 | true | PASS |
| A → B settled | `RESOLVED_CURRENT` | true | true | true | true | 12 | true | PASS |
| B → A settled | `RESOLVED_CURRENT` | true | true | true | true | 48 | true | PASS |
| Back A → B | `RESOLVED_CURRENT` | true | true | true | true | 12 | true | PASS |
| Forward B → A | `RESOLVED_CURRENT` | true | true | true | true | 48 | true | PASS |

- Settled cases: 7
- Settled PASS: 7
- All settled runtime currentness: `RESOLVED_CURRENT`
- All settled Ground Truth comparison: exact=true
- A → B / Backでprevious GT-Aをcurrent resultとして返していない。
- B → A / Forwardでprevious GT-Bをcurrent resultとして返していない。

### Transient Snapshot Result

| Operation | State | Active sidebar count | Document Title length diagnostic | GT exact | Fail Closed |
|---|---|---:|---:|---|---|
| Reload直後 | `UNRESOLVED` | 0 | 7 | false | true |
| Direct Load直後 | `UNRESOLVED` | 0 | 7 | false | true |
| A → B直後 | `UNRESOLVED` | 0 | 48 | false | true |
| B → A直後 | `UNRESOLVED` | 0 | 12 | false | true |

- Transient snapshots: 4
- Fail Closed: 4 / 4
- `RESOLVED_CURRENT`誤accept: 0
- Specific generic literal、previous raw Title、特定lengthをruntime classification ruleに使用していない。

各transient後のsettled確認は別の明示的single captureとして行った。Polling loop、fixed sleep、retry count、timeout、Production settled algorithmは追加していない。

### Runtime Currentness Result

Candidate Decision v1の9 invariantsを実装し、全settled caseで成立した。

- Active sidebar Title item exactly 1
- Current route binding=true
- Sidebar DOM text non-empty
- Sidebar `aria-label` non-empty
- Sidebar internal exact equality=true
- `head > title` exactly 1
- `document.title` non-empty
- Document internal exact equality=true
- Cross-source exact equality=true

Runtime currentnessとGround Truth comparisonは別resultとして保持した。Technical Spike case PASSには両方を要求した。

### Ground Truth Comparison

- GT-A expected length: 48
- GT-A settled resolved length: 48
- GT-A exact: true in Initial / Reload / Direct Load / B → A / Forward
- GT-B expected length: 12
- GT-B settled resolved length: 12
- GT-B exact: true in A → B / Back
- Candidate値からGround Truthを生成または更新していない。

### Source Consistency

- T-01 / T-02 `DocumentTitleSurface` internal equality: 7 / 7 settled cases true
- T-04 / T-05 `ActiveSidebarTitleSurface` internal equality: 7 / 7 settled cases true
- Active Sidebar / Document Title cross-source equality: 7 / 7 settled cases true
- Confirmed fallback: none

### Truncation Result

- Title-Aは既存Discoveryで`DISPLAY_ONLY_TRUNCATED`と確認済み。
- 今回のTitle-A settled casesではSidebar DOM text、`aria-label`、Document Titleがすべてlength 48でGT-A exact。
- Visual-only clippingはFailureにしなかった。
- General clipping detectorは実装していない。
- DOM value自体がknown truncatedならpure evaluatorはFail Closedする。
- 両DOM sourceが同じ誤値で一致するcaseはruntime predicateだけではacceptし得るが、independent Ground Truth mismatchによりTechnical Spike caseはFAILとなることをself-testした。

### Fail Closed Result

- Pure fail-closed contract: PASS
- Live transient fail-closed: PASS
- Source-internal mismatch / cross-source mismatch: pure self-test PASS
- Candidate 0 / 2+: pure self-test PASS
- One-source-only resolution: pure self-test PASS
- Ground Truth mismatch: Technical Spike PASS禁止を確認
- `META_TITLE_NOT_FOUND`相当のProduction error codeは実装していない。

### Requirement / ADR / Risk Impact

- **FR-011**: Standard Chat必須Titleを、current route bindingと2 underlying sourceの一致を要求して取得できるEvidenceを得た。不成立snapshotは成功扱いしない。
- **ADR-006**: Missing、ambiguous、unbound、inconsistent、GT mismatchをFail ClosedするPoC contractを確認した。
- **AT-009**: `META_TITLE_NOT_FOUND`相当へ結び付く失敗条件をpure testとlive transientで再現した。Production error実装はscope外。
- **RISK-028**: Current Chrome / ChatGPT UIの2 Standard ChatsでPrimary / cross-check strategyを再現できた。UI変更risk自体は残る。
- **TV-002**: Minimal PoCはPASS。Final Review / Final Verdictは別ターンで実施するため`NOT SET`を維持する。

### Known Limitations

- 2 Standard Chats、1 Chrome version、1 primary viewportでのvalidation。
- Same-title Conversation navigation、Title rename中、sidebar item unloaded / virtualized、additional viewport variationは未検証。
- Back / Forward APIはtransition完了まで待つ可能性があり、transient state不存在は証明していない。
- Automated settled condition、polling、retry、timeoutは未設計。
- Production selector、Production fallback chain、prefix / suffix strippingは未決定。
- 両independent sourceが同じtruncated valueを返す未観察runtime caseの一般検知は未解決。Technical SpikeではIndependent Ground Truth comparisonで補足した。
- TV-003 Conversation ID、Project Chatは未開始。

### Recommended Next Action

PoC Resultのレビュー後、追加DOM探索やコード変更を行わずTV-002 Final Review / Final Verdictを別ターンで実施する。TV-003、Production Adapter、`src/`実装はまだ開始しない。

---

## TV-002 Final Review and Verdict — 2026-08-15

### Status

- Scope: TASK-001 / TV-002 Standard Chat Title Final Review
- Review basis: Technical Validation Plan TV-002、independent Runtime Ground Truth、Candidate Decision v1、Minimal PoC v1、self-test、live Evidence
- TV-002 Final Verdict: **PASS**
- Additional DOM exploration / live validation: not performed in this Final Review
- PoC / Candidate Decision / selector / fallback changes: none
- Production implementation: none
- TV-003: not started

### Review Basis

Evidence hierarchyを次の順に区別して評価した。

1. **Formal Technical Validation Criteria**
   - Hypothesis: Current conversation titleを安定取得できる。
   - Pass: reload / navigation後も一致する。
2. **Independent Runtime Ground Truth**
   - GT-A: length 48
   - GT-B: length 12
3. **Candidate Decision v1**
   - Primary: `ActiveSidebarTitleSurface`
   - Cross-source validation surface: `DocumentTitleSurface`
   - Confirmed fallback: none
4. **Minimal PoC v1 live result**
   - 7 / 7 settled cases PASS
   - 4 / 4 naturally captured transient snapshots Fail Closed
5. **Pure self-test**
   - Currentness predicate、Fail Closed、Ground Truth separation contractを検証
6. **Known Limitations / Deferred scope**
   - Formal Criteriaへ後付けせず、Verdictへのblocking relevanceを個別評価

Current conversationに結び付いたtruncatedされていない完全Titleを、reload / navigation後に再現できることをFormal Pass Criteriaの具体的評価対象とした。Production completeness、汎用waiting algorithm、long-term UI compatibility等を新しいPass条件として追加していない。

### Ground Truth Reconciliation

GT-A / GT-Bだけをcandidateから独立したvalidation oracleとして扱う。

#### GT-A history

1. Discovery時はvisible Chrome tab titleをDiscovery用GTとして使用しており、candidate familyから独立していなかった。
2. `GT_A_GROUND_TRUTH_NOT_INDEPENDENT`としてCandidate Decisionを一度停止した。
3. その後、ユーザーがcandidate取得前に独立expected valueとしてGT-Aを明示した。
4. Settled T-01 / T-02 / T-04 / T-05を再比較し、cardinality、length 48、exact equality、source-internal consistency、cross-source consistencyを確認した。
5. `GT_A_GROUND_TRUTH_RECONCILED`としてBlockingを解消した。

Discovery時のlimitationとBlocking記録は履歴として有効であり、削除または後付け変更していない。後続ReconciliationによってFormal Validationで使用できるindependent oracleが成立した。

#### GT-B history

GT-BはDiscovery以前にユーザーが完全Titleを明示したindependent Runtime Ground Truthであり、length 12として維持した。

Raw GT-A / GT-BはRuntime comparisonだけに使用し、Evidenceへ保存していない。

### Source Terminology Clarification

- `ActiveSidebarTitleSurface`と`DocumentTitleSurface`は、**structurally distinct DOM source groups**または**cross-source validation surfaces**と呼ぶ。
- 両者がChatGPT内部で完全に独立したデータ生成経路を持つことは、このTechnical Spikeでは証明していない。
- T-04 DOM text / T-05 `aria-label`は同じActive Sidebar source groupのinternal surfacesである。
- T-01 `document.title` / T-02 `head > title`は同じDocument Title source groupのinternal surfacesである。
- Candidateから独立したvalidation oracleはGT-A / GT-Bだけである。

このclarificationはCandidate Decision v1のPrimary、cross-source check、cardinality、currentness、Fail Closed decisionを変更しない。

### Formal Criteria Matrix

| Criterion / Evidence item | Result | Evidence | Formal relevance |
|---|---|---|---|
| Current full Title completeness | **PASS** | GT-A length 48、GT-B length 12。全settled source valuesが対応GTとexact | Current conversationの完全Title取得 |
| Initial settled | **PASS** | Title-A=`RESOLVED_CURRENT`、GT-A exact=true | Baseline acquisition |
| Reload settled | **PASS** | Title-A=`RESOLVED_CURRENT`、GT-A exact=true | TV-002 Formal Pass |
| A → B navigation | **PASS** | GT-B exact=true、resolved length 12、previous Aをcurrent resultとして返していない | TV-002 Formal Pass |
| B → A navigation | **PASS** | GT-A exact=true、resolved length 48、previous Bをcurrent resultとして返していない | TV-002 Formal Pass |
| Back A → B | **PASS** | `RESOLVED_CURRENT`、GT-B exact=true | Navigation reproducibility evidence |
| Forward B → A | **PASS** | `RESOLVED_CURRENT`、GT-A exact=true | Navigation reproducibility evidence |
| Direct Load | **PASS** | Title-A=`RESOLVED_CURRENT`、GT-A exact=true | Formal Criteriaを補強する追加Evidence |
| Current-route binding | **PASS** | 全7 settled casesでtrue | Current Conversation binding evidence |
| Sidebar source-internal equality | **PASS** | 全7 settled casesでDOM text === `aria-label` | Primary source consistency evidence |
| Document source-internal equality | **PASS** | 全7 settled casesで`document.title` === head title | Cross-source surface consistency evidence |
| Cross-source equality | **PASS** | 全7 settled casesでActive Sidebar value === Document Title value | Silent wrong / stale Title mitigation evidence |
| Visual-only clipping | **PASS** | Title-A表示はclippedだがSidebar DOM text、`aria-label`、Document Titleはlength 48、GT-A exact | Complete Title evidence |
| Transient safety | **PASS** | Reload、Direct Load、A → B、B → A直後の4 snapshotsはすべて`UNRESOLVED` / Fail Closed、誤accept 0 | FR-011 / ADR-006 supporting evidence |

Technical Validation Planで明示されたreload / navigation後の一致が成立した。Back / Forward、Direct Load、transient safetyはFormal Criteriaを補強する追加Evidenceであり、新しい必須条件へ昇格させない。

### Fail Closed Review

#### Pure self-test

次の14 caseがFail Closedすることを確認済みであり、14 / 14 PASSだった。

- Active candidate 0 / 2+
- Sidebar text empty
- Sidebar `aria-label` empty
- Sidebar internal mismatch
- Current-route binding false
- `head > title` 0 / 2+
- Document Title empty
- Document internal mismatch
- Cross-source mismatch
- Sidebar-only resolution
- Document-only resolution
- Known DOM-value truncation

#### Live transient result

- Reload直後: `UNRESOLVED` / Fail Closed
- Direct Load直後: `UNRESOLVED` / Fail Closed
- A → B直後: `UNRESOLVED` / Fail Closed
- B → A直後: `UNRESOLVED` / Fail Closed

Specific generic literal、previous raw Title、特定lengthをProduction currentness ruleへハードコードせず、required predicateの欠落としてrejectした。

#### Ground Truth separation

両DOM source groupsが同じ誤値またはtruncated valueで一致し、route bindingを含むRuntime currentness predicateだけなら成立するsynthetic caseでも、independent Runtime Ground Truthとのexact comparisonがfalseならTechnical Spike `casePass=false`となることをself-testした。

Runtime currentness predicateとindependent validation oracleを混同していない。

### Truncation Review

- Title-Aのvisual displayはclippedしていた。
- Sidebar DOM text、`aria-label`、Document Titleにはfull valueが存在した。
- 各valueはlength 48でGT-A exactだった。
- Raw visible clipping文字列からTitleを推測復元していない。
- `DISPLAY_ONLY_TRUNCATED`はTitle value truncation failureではない。
- DOM value自体がknown truncatedの場合はFail Closed contractを維持する。
- General clipping detectorは実装しておらず、実装済みとは評価しない。

### Known Limitations Classification

**BLOCKING for TV-002 Final Verdict: none**

| Known Limitation | Classification | Rationale |
|---|---|---|
| 2 Standard Chatsのみ | **NON-BLOCKING / DEFERRED** | Distinct long / short GTでFormal reload / navigation criteriaを満たした。追加件数はFormal条件ではない |
| Chrome 151の1 version | **NON-BLOCKING / DEFERRED** | Current Technical Spike environmentでの成立性を評価する。将来UI compatibilityはRISK-028として残す |
| 1 primary viewport | **NON-BLOCKING / DEFERRED** | Long Title clippingとcollapsed stateのEvidenceがあり、multi-viewportはFormal条件ではない |
| Same-title Conversation navigation未検証 | **NON-BLOCKING / DEFERRED** | Formal matrixの異なるA / B navigationは成立。Same-title live caseは追加risk test |
| Title rename中未検証 | **NON-BLOCKING / DEFERRED** | Rename transitionはTV-002 Formal Passに明示されていない |
| Sidebar unloaded / virtualized未検証 | **NON-BLOCKING / DEFERRED** | Current tested UIではPrimaryが成立。一般unmount解はProduction robustness scope |
| Additional viewport variation未検証 | **NON-BLOCKING / DEFERRED** | Formal reload / navigation後の一致を阻害するcurrent Evidenceなし |
| Back / Forward transient state非観察 | **NON-BLOCKING / DEFERRED** | Settled Back / ForwardはPASS。APIがtransitionを隠す可能性を維持し、transient不存在とは主張しない |
| Automated settled condition未設計 | **NON-BLOCKING / DEFERRED** | Explicit settled snapshotでFormal criteriaを評価済み。Production settled algorithmは別Decision |
| Polling / retry / timeout未設計 | **NON-BLOCKING / DEFERRED** | Formal Title candidate取得の成立性と別のruntime orchestration concern |
| Production selector未決定 | **NON-BLOCKING / DEFERRED** | Phase 0 Candidate / PoC validationのVerdictであり、Production実装完了を要求しない |
| Production fallback chain未決定 | **NON-BLOCKING / DEFERRED** | Confirmed fallbackなしでFail ClosedするDecisionが成立。Fallback実装はFormal Pass条件ではない |
| Prefix / suffix stripping未決定 | **NON-BLOCKING / DEFERRED** | Observed settled valuesにprefix / suffixなし。未観察strip ruleを作らない |
| 2 DOM source groupsが同一誤値を返す一般runtime検出未解決 | **NON-BLOCKING / DEFERRED** | Independent GTでcurrent test casesを検証済み。Residual runtime riskはRISK-028として維持 |
| TV-003未開始 | **NON-BLOCKING for TV-002 / BLOCKING for TASK-001 Exit** | Conversation IDは別Validation。TV-002 criteriaへ追加しない |

### Historical Scope Clarification

Earlier `Formal Validation Scope / Out of scope` represents the Discovery Round scope and is superseded for current status by the later approved Reconciliation, Candidate Decision, Minimal PoC, and this Final Review sections.

Discovery Round時点でPoC / Final VerdictをOut of scopeとした記録は、そのRoundの境界を示す履歴として保持する。その後、明示承認を受けてGT-A Reconciliation、Candidate Decision v1、Minimal PoC v1、Final Reviewへ順次進んだ。過去sectionの削除・書き換えは行っていない。

### Final Verdict

**TV-002 Final Verdict: PASS**

理由:

- Current conversationに結び付いたfull TitleをGT-A / GT-Bとexact comparisonして取得できた。
- Reload settled後にGT-Aへ一致した。
- A → B / B → A navigation settled後にそれぞれcurrent GTへ一致し、previous Titleをcurrent resultとして返さなかった。
- Back / ForwardおよびDirect Loadでもcurrent GTへ一致した。
- Stale / generic / absentを含むtransient snapshotsをsuccessful current Titleとしてacceptしなかった。
- Long Titleのvisual clipping時もfull DOM valueを取得し、推測復元を行わなかった。
- Current-route binding、各source-internal consistency、cross-source consistencyを全settled casesで確認した。
- Known LimitationsはTV-002 Formal Pass Criteriaを未成立にしない。

このVerdictはCurrent Chrome / ChatGPT UIに対するPhase 0 Technical Validationの結論であり、Production selector / fallback chain、automated settled algorithm、long-term DOM compatibilityの完成を意味しない。

### Requirement / ADR / Risk Impact

- **FR-011**: Standard Chatの必須Title MetadataをCurrent UIから完全値として取得できる技術成立性を確認した。Required predicateを満たさないsnapshotは保存可能なTitleとして扱わない。
- **ADR-006**: Missing、ambiguous、unbound、source-internal mismatch、cross-source mismatch、known DOM truncationをsilent acceptせずFail Closedするcontractと整合する。
- **AT-009**: `META_TITLE_NOT_FOUND`相当へ結び付くfailure conditionsをpure self-testとlive transient Evidenceで確認した。Production error code自体は実装していない。
- **RISK-028**: Current UIでのTitle acquisition failure / stale wrong-title riskは、route binding、structurally distinct DOM source groups、independent GT comparison、Fail Closed predicateによりTV-002範囲で軽減された。ChatGPT UI変更risk、同一誤値risk、Production orchestration riskは残存する。

### TASK-001 Impact

- TV-001 Standard Chat Message DOM: **PASS**
- TV-002 Standard Chat Title: **PASS**
- TV-003 Conversation ID: **NOT STARTED**
- TASK-001 Final Exit: **NOT YET MET**

TASK-001 ExitはStandard ChatのMessage / Title / Conversation ID取得方式をすべてPASS判定することを要求する。TV-002 PASSだけでTASK-001全体をPASSにしない。

### Next Action

TASK-001内の次Validationである**TV-003 Conversation ID — Standard coverage**へ進む。TV-003 Final VerdictはProject coverageを含むTASK-002完了までPENDINGとする既存方針を維持する。このFinal ReviewではTV-003の探索、PoC、Decision、Verdictを開始しない。
