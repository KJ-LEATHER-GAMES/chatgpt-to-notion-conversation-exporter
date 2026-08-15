# TASK-002 Project Chat DOM Spike — Scope Planning / Traceability Reconciliation

## Current Status

- Planning date: 2026-08-15
- TASK-001 Final Exit: **PASS**
- TASK-001 Status: **COMPLETE**
- TASK-002 Scope Planning / Traceability Reconciliation: **COMPLETE**
- TASK-002 Discovery: **NOT STARTED**
- TV-004 Verdict: **NOT SET**
- TV-003 Project Coverage: **NOT OBSERVED / OUT OF SCOPE TO DATE**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-002 Final Exit: **NOT SET**
- Phase 0 Exit: **NOT MET**
- Production implementation: none
- Source-of-Truth amendment: **PROPOSED / NOT APPLIED**

TASK-001のcurrent statusは`TASK-001-final-exit-review.md`をlatest authorityとした。Project Chat DOM observation、browser automation、live validation、candidate discovery、PoC実装は行っていない。

## Review Basis

次をSource of Truthと既存handoffとしてreviewした。

1. Product Requirements、ADR、Risk Register、Acceptance Tests。
2. Technical Validation PlanのTV-003、TV-004、Phase 0 Required PASS。
3. Development BacklogのTASK-002とBacklog Change Rule。
4. TASK-001 Final Exit handoff。
5. TV-003 Standard Coverage Final ReviewとProject Coverage handoff。

## Source-of-Truth Findings

### Development Backlog

Current TASK-002:

- Task: `TASK-002 Project Chat DOM Spike`
- Refs: TV-004
- Risks: RISK-003、RISK-004
- Depends On: TASK-001
- Exit: Source detectionとProject Name取得をPASS

Backlog Change Ruleは、Task追加・分割を許可し、Requirementの意味を変える場合だけRequirement Changeとして扱う。

### Technical Validation Plan

- TV-003はCurrent tab URL等からConversation IDを一意に取得・検証するValidationであり、Formal PassはStandard / Project双方での安定性を要求する。
- TV-004はProject ChatをStandard Chatと識別し、Project Nameを取得するValidationである。
- TV-004 Formal Passは複数Project、reload、Project間移動での誤認なしを要求する。
- Phase 0 Required PASSにはTV-003とTV-004の両方が含まれる。

TASK-001はTV-003 Standard CoverageだけをPASSとしてcloseした。TV-003 Project Coverageは未観察で、Overall Final VerdictはPENDINGである。

## Traceability Gap

Current BacklogにはTV-003 Project Coverageのformal Task assignmentがない。

- TASK-001はStandard Chat限定Exitで完了済み。
- TASK-002はProject Chat surfaceを扱うがRefsはTV-004だけ。
- TV-003 Overall Passには未完了のProject Coverageが必要。
- Phase 0 ExitにはTV-003とTV-004の双方がRequired。

このgapはRequirement meaningの矛盾ではないが、Phase 0 closureとTask ownershipに対してmaterialである。未修正のままではTV-003 Project Coverageがunassignedとなり、Overall TV-003とPhase 0 Exitをcloseできない。

Backlog Change Ruleにより、既存Requirementを変えずTask assignment / traceabilityを修正できる。

## TV-004 Scope — Track A

Validation question:

> Project ChatをStandard Chatと誤認せず識別し、current Project Nameを安定取得できるか。

Primary concerns:

- Source Type=`Project`。
- Standard / Project source detection。
- Current ConversationとProjectのbinding。
- Truncatedされていないcomplete Project Name。
- Multiple Projectsでのdistinctness。
- Reload stability。
- A → B / B → A Project movementでのcurrentness。
- Missing、empty、multiple、ambiguous、stale、inconsistent stateのFail Closed材料。

TV-004はConversation IDをProject Nameの代替oracleにせず、Source Type / Project Nameの独立Ground Truthに対して評価する。

## TV-003 Project Coverage Scope — Track B

Validation question:

> Project ChatでCurrent Conversation IDを一意に取得・検証できるか。

Primary concerns:

- Host/browser current tab URL boundary。
- Project Conversation route candidate inventory。
- Conversation IDの一意分離。
- URL / ID consistency。
- Reload、Project Conversation間navigation、Back / Forward、Direct Loadでのcurrentness。
- Candidate source cardinality、binding、cross-source consistency。
- Missing、ambiguous、unsupported、stale、mismatch stateのFail Closed材料。
- URL、route、IDを推測生成しないこと。

Project NameをConversation ID oracleとして使用しない。Conversation IDからProject Nameを推測しない。TV-004と同じ操作matrixを共有できるが、oracle、candidate、verdictは別に保持する。

## Requirement Boundary

| Requirement | Planning interpretation | Track |
|---|---|---|
| FR-001 | Standard ChatとProject ChatはMVP Must対象 | A / B共通scope根拠 |
| FR-004 | Current browser tab URL、supported URL、Conversation ID consistency。Project Chatにも適用 | Track B |
| FR-006 | Standard / Projectを識別し、必要に応じて別Adapterを用いる | Track A |
| FR-011 | Project Chat必須MetadataはTitle、Conversation ID、URL等に加えProject Name | A: Project Name、B: Conversation ID / URL |

Conversation IDとProject Nameは別々のrequired metadata concernである。本PlanningはRequirementの意味、Must level、metadata定義を変更しない。

## Acceptance Test Boundary

| Acceptance Test | Responsibility | Planning trace |
|---|---|---|
| AT-002 Project Chat認識 | Source Type=`Project`、Project Name取得 | Track A / TV-004 |
| AT-004 URL / Conversation ID mismatch | Mismatch検出と保存停止 | Track B / TV-003 Project Coverage |
| AT-010 Project Name欠落 | Missing Project Nameの保存拒否 | Track A / TV-004 |

TV-004はAT-002 / AT-010中心、TV-003 Project CoverageはAT-004中心という分離がFR-004、FR-006、FR-011から支持される。Production error enum / mappingは実装せず、Acceptance Test文言も変更しない。

## Risk Boundary

| Risk | Concern | Track |
|---|---|---|
| RISK-003 | Project Chat DOMがStandard Chatと大きく異なる | Track A中心、shared surface inventory |
| RISK-004 | Project Nameを安定取得できない | Track A |
| RISK-029 | Conversation ID取得方式がUI変更で壊れる | Track B |

TV-003 Project CoverageをTASK-002へassignする場合、RISK-029をTASK-002 planning / Backlog traceへ追加する必要がある。Risk status、probability、impact、acceptanceは変更しない。

## Standard TV-003 Reuse Boundary

### Reusable as Validation Principle

- Current browser tab URLをhost/browser boundaryから取得する。
- Browser sourceとpage execution contextを分離する。
- Candidate observation前にindependent Ground Truthを固定する。
- Candidateをunderlying source group単位で整理する。
- Cardinality、binding、source-internal consistency、cross-source consistencyを評価する。
- Missing、ambiguous、unsupported、inconsistentなstateをFail Closed材料とする。
- Confirmed evidenceのないfallbackを作らない。
- Candidate valueをGround Truthへ昇格しない。
- Raw URL / pathname / IDをEvidenceへpersistしない。

### Not Automatically Reusable as Project Fact

- Standard route grammar / route literal / ID segment position。
- Standard active sidebar structureとbinding attribute。
- Standard `data-conversation-options-trigger`。
- Standard canonical availability / transition behavior。
- Standard ID Format v1。
- Standard selector、source cardinality、primary / cross-check assignment。

これらはProject Chatで未観察である。Discovery前にProject fact、selector、route parser、format contractとしてコピーしない。

## Option Comparison

| Option | Pros | Cons | Phase 0 / traceability impact | Assessment |
|---|---|---|---|---|
| A: Current Backlogのまま | TASK-002の既存TV-004 scopeを維持。文書変更なし | TV-003 Project Coverageがunassigned。Project setupを別Roundで重複。Overall TV-003をcloseできない | Required validation ownershipが不完全 | REJECT |
| B: TASK-002へTV-003 Project Coverageを追加 | 同じProject surface、test fixtures、navigation matrixを共有しつつTrackを分離。Task ownershipとPhase 0 sequenceが明確 | TASK-002のRefs / Risks / Exit amendmentが必要。Track混同を防ぐ計画が必要 | TV-003 / TV-004双方のRequired PASSへ直接接続 | RECOMMEND |
| C: Dedicated additional Phase 0 Task | Conversation ID責務が明示的に独立。RISK-029を単独管理可能 | Project setup、navigation、Evidence運用が重複。Task numbering / dependency追加。現時点で分割必須のEvidenceなし | Traceabilityは満たすがunnecessary fragmentation | DEFER / NOT PREFERRED |

## Recommended Assignment

`RECOMMENDED OPTION: B — Include TV-003 Project Coverage in TASK-002`

理由:

- TV-003 Formal PassはProject coverageを明示的に要求する。
- TASK-002は未検証のProject Chat technical surfaceを扱う既存Phase 0 Taskである。
- TV-003 Project CoverageとTV-004は同じProject fixturesとnavigation operationsを利用できる。
- Track A / Bを分離すればProject NameとConversation IDのoracle、candidate、verdictを混同しない。
- Backlog Change RuleによりRequirement意味を変えずassignmentを修正できる。
- Dedicated taskへ分割する必要を示すSource-of-Truth根拠やobserved incompatibilityはない。

| Decision question | Answer |
|---|---|
| Requirement semantics change? | No |
| Backlog task assignment change? | Yes |
| ADR change required before Discovery? | No |
| Requirement Change required? | No |
| Acceptance Test change required? | No |
| Risk traceability update required? | Yes — add RISK-029 to TASK-002 trace |

Source-of-TruthからOption Bを支持でき、Blocking / Decision Required conditionはない。Backlog amendment自体は本Roundで適用せず、ユーザー承認を待つ。

## Proposed Backlog Amendment

次Roundで承認後、`docs/06_development-backlog.md`のTASK-002だけを次の意味へ更新することを提案する。

```text
TASK-002 Project Chat DOM Spike

Refs:
- TV-003 Project Coverage
- TV-004

Risks:
- RISK-003
- RISK-004
- RISK-029

Depends On:
- TASK-001

Exit:
- Project Source detection PASS
- Project Name acquisition PASS
- TV-003 Project Coverage PASS
```

これはvalidation assignment / traceability correctionであり、Requirement、ADR、Acceptance Test、TV-003 / TV-004の意味を変更しない。

## Discovery Ground Truth Plan

### Test Fixture Designation

Candidate observation前に、ユーザーが既知の検証専用Project Chatを少なくとも2つdesignateする。

- `Project-A`
- `Project-B`
- 必要に応じて既存Standard Chatを`Standard-Control`として再利用する。

Project-A / Project-Bは異なるProjectに属し、異なるProject NameとConversation IDを持つことを事前expectationとして固定する。AliasはEvidence用であり、raw valueではない。

### Independent Source Type Ground Truth

- ユーザーが候補surface観察前に、各test chatが既知のProjectへ所属する検証fixtureであることを明示する。
- Expected Source Type=`Project`をsetup factとして固定する。
- DOM、route、Project Name candidateの見た目からSource Type Ground Truthを生成しない。
- Standard-Controlは既存TASK-001のknown Standard fixtureとして事前指定し、Project detectorのfalse-positive materialに使用する。

### Independent Project Name Ground Truth

- ユーザーが候補取得前にProject-A / Project-Bのcomplete expected Project Nameを明示する。
- Raw expected namesはRuntime memory内だけで保持する。
- Candidate DOM text、accessible name、document metadataからexpected valueを生成または更新しない。
- Evidenceへはalias、expected length、exact equality、currentness、cardinalityだけを保存する。

### Independent Project Conversation ID Ground Truth

- ユーザーがcandidate capture前にProject-A / Project-B Conversationのexact expected ID、または同等の独立comparison inputを明示する。
- Browser URL、page route、canonical、active item metadata、DOM candidateからexpected IDを生成しない。
- Raw expected / resolved IDはRuntime memory内だけで保持する。
- Evidenceへはalias、length、format classification、equality / distinctness booleanだけを保存する。
- Independent exact oracleを用意できなければ、candidateを自己承認せず`BLOCKING: PROJECT_CID_GROUND_TRUTH_NOT_INDEPENDENT`としてCandidate Decision前に停止する。

## Discovery Validation Matrix

### Track A — TV-004

| State | Primary validation questions | Formal role |
|---|---|---|
| Project-A initial settled | Source Type Projectか。Complete NameがGT-A exactか。Current bindingを確認可能か | Core |
| Project-A reload settled | Source / Nameが同一GTへ戻るか。stale / absent材料があるか | Formal Pass |
| Project-A → Project-B settled | Source Typeを維持し、NameがGT-Bへ更新するか。Aをcurrentとして返さないか | Formal Pass |
| Project-B → Project-A settled | NameがGT-Aへ戻るか。Bをcurrentとして返さないか | Formal Pass |
| Back / Forward settled | Current Projectへ追従するか | Supporting currentness evidence |
| Direct Load settled, if relevant | Source / Name / bindingがcurrent GTへ一致するか | Supporting evidence |
| Standard-Control | Projectとして誤認しないか | Source detection negative control |

Multiple Projects、reload、Project間movementをTV-004 Formal Passへ直接対応させる。Back / Forward、Direct Load、Standard-Controlは成立性を補強するが、Technical Validation Planへ新しいFormal Pass条件を追加しない。

### Track B — TV-003 Project Coverage

| State | Primary validation questions | Formal role |
|---|---|---|
| Project-A Conversation initial settled | Current browser tab sourceからID candidateを一意に分離・検証可能か。GT exactか | Core |
| Project-A reload settled | Same Conversationでsame IDか。required candidatesがcurrentへ戻るか | Stability evidence |
| Project-A Direct Load settled, if relevant | Current Project Conversation IDへ追従するか | Supporting evidence |
| Project-A → Project-B Conversation settled | IDがdistinct GT-Bへ更新するか | Stability / distinctness evidence |
| Project-B → Project-A Conversation settled | IDがGT-Aへ戻るか | Stability evidence |
| Back / Forward settled | Current Conversationへ追従するか | Supporting currentness evidence |
| Standard-Control / unsupported boundary | Project routeを推測せず、scope / sourceを混同しないか | Negative boundary material |

Track BではCandidate Decision前にroute grammar、ID position、format、primary、cross-check、fallbackを決めない。Discoveryはcandidate inventory、source grouping、cardinality、binding、currentness、consistency materialの収集に限定する。

## Source Detection Discovery Questions

- Project / Standardを示す候補surfaceは何か。
- 各surfaceはSource Type、Project membership、Project Nameのどの意味を直接表すか。
- Candidateはcurrent Conversationへ一意にbindするか。
- Project-A / B、reload、navigationでcurrentnessを維持するか。
- Standard-Controlでfalse positiveにならないか。
- Candidate間で不一致、stale、absent、duplicateが発生するか。
- Semantic / machine-readable attribute、accessible relationship、document metadata、visible DOMの候補が存在するか。

Project Name、URL shape、単一DOM selectorのいずれも事前canonical sourceにしない。Observed Factを得た後にCandidate Decisionを行う。

## Fail Closed Questions

### Track A — TV-004 candidate failures

- Project detector 0 / multiple / contradictory。
- Standard / Project ambiguous。
- Current Project bindingを確認不能。
- Project Name missing / empty / multiple / DOM-truncated。
- Source indicatorsとProject Name candidateがinconsistent。
- Navigation中にprevious Project Nameを保持。
- Project-A / Project-B Ground Truth mismatch。

### Track B — TV-003 Project candidate failures

- Project Conversation route unsupported / ambiguous。
- Conversation ID missing / empty / multiple。
- Browser tab URLとpage route mismatch。
- Required candidate source間のID mismatch。
- Candidateがprevious Conversation IDを保持。
- 一方のsource groupだけresolved。
- Current Conversation bindingを確認不能。
- Observed format contractが後続Decisionで成立した場合のformat mismatch。

このPlanningではfailure materialだけを定義し、Production error mapping、route / ID format、selector、candidate priority、fallbackを決定しない。

## Discovery Entry Criteria

1. Proposed Backlog Amendmentまたは同等のTASK-002 execution assignmentがユーザー承認済みである。
2. Source-of-Truth reconciliationを行う場合はDiscovery前の別Roundで実施済みである。
3. Track A / Track Bを別Validation resultとして扱うことが明示されている。
4. Project-A / Project-BとStandard-Controlのfixture designationがcandidate observation前に完了している。
5. Expected Source Type、complete Project Name、Project Conversation IDのindependent Runtime Ground Truthが準備されている。
6. Raw Ground TruthをEvidence / logへpersistしない運用が準備されている。
7. Discovery matrixと操作順が固定されている。
8. Candidate inventory前にcanonical selector、route grammar、ID format、fallbackを決めない。
9. Chromeの認証済み検証環境とユーザー操作準備が整っている。
10. Production implementation、polling / retry / timeout、Phase 1設計へ越境しない。

## Deferred / Out of Scope

- Project Chat DOM observation / live validation。
- Selector、route、Project Name / ID candidate discovery。
- Candidate Decision、PoC、self-test、Verdict。
- TV-003 Overall Final Verdict、TASK-002 Final Exit、Phase 0 Exit。
- Production ProjectChatAdapter、dispatch、parser、validator、error mapping、fallback。
- Polling、retry、timeout、settled algorithm。
- `src/` implementation。
- Requirement、ADR、Acceptance Test、Risk status変更。
- Proposed Backlog Amendmentの適用。

## Repository / Security Check

- Check result: **PASS**。
- `git diff --check`: PASS。
- New Evidence direct trailing-whitespace scan: 0 findings。
- Raw ChatGPT URL / pathname pattern: 0 findings。
- Raw UUID / Conversation ID-like literal: 0 findings。
- Raw Project / Conversation / Message / Turn identifier assignment pattern: 0 findings。
- Known raw Project Name / Title pattern: 0 findings。
- Raw validation marker / conversation content pattern: 0 findings。
- Credential / cookie / token / authorization assignment pattern: 0 findings。
- TASK-001 assets: unchanged。
- `src/`, `docs/`, `AGENTS.md`, Production files: unchanged。
- Changed scope: this TASK-002 Planning Evidence file only。

This Evidence was untracked during review; therefore `git diff --check` alone was not used as its content check. Direct whitespace and security scans were run against the file itself。Raw value leak review confirmed that only aliases、references、counts / booleans、planning states are recorded。

## Recommended Next Action

Proposed Backlog Amendmentをユーザーがreview / approveした後、別Roundで`docs/06_development-backlog.md`のTASK-002 assignmentをreconcileする。

Reconciliation後、承認済みTrack A / Track B scopeとindependent Ground Truthを準備して、TASK-002 Discovery Roundを開始する。本RoundではSource-of-Truth変更、Project Chat observation、PoC実装へ進まない。
