# TASK-002 Project Conversation ID Ground Truth Establishment / Oracle Reconciliation

## Status

- Reconciliation date: 2026-08-16
- TASK-002 Scope Planning: **COMPLETE**
- TASK-002 Backlog Reconciliation: **COMPLETE**
- TASK-002 Fixture Designation / Ground Truth Preparation: **COMPLETE**
- TASK-002 Project CID Ground Truth Establishment: **INCOMPLETE**
- TASK-002 Discovery: **NOT STARTED**
- TV-004 Ground Truth: **PRE-ESTABLISHED**
- TV-004 Verdict: **NOT SET**
- TV-003 Project CID Ground Truth: **NOT YET ESTABLISHED**
- TV-003 Project Coverage: **NOT OBSERVED**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-002 Final Exit: **NOT SET**
- Phase 0 Exit: **NOT MET**
- Production implementation: none

`PROJECT_CID_GROUND_TRUTH: NOT YET ESTABLISHED`

`TASK-002 DISCOVERY ENTRY: BLOCKED`

Candidate observation performed: **NO**。

## Review Basis

次をreviewした。

1. FR-004のcurrent browser tab URL / Conversation ID consistency requirement。
2. ADR-006のFail ClosedとADR-014のConversation ID / URL responsibility separation。
3. TV-003のStandard / Project stability obligationとRISK-029。
4. Standard TV-003で採用・承認されたRuntime Ground Truth precedent。
5. TASK-002 Scope PlanningとFixture / Ground Truth Preparation contract。

Project Chatのbrowser URL、page route、DOM、sidebar、canonical、document metadata、candidate、selectorは観察していない。

## Standard TV-003 Precedent

Standard Coverageでは、次の運用によりexact Ground Truthをvalidation oracleとして成立させた。

- ユーザーがCID-A / CID-B exact expected valueをcandidate observation前に指定した。
- Expected valueをcandidate surfaceから生成または更新しなかった。
- Candidate surfaceをexpected valueの自己承認に使用しなかった。
- Raw expected valueはRuntime memoryだけで保持した。
- Evidenceへはalias、length、distinctness、exact comparison resultだけを保存した。
- Candidate capture resultがexpected Ground Truthと不一致なら、candidate値を新Ground Truthへ昇格しなかった。

Standard precedentは、expected valueの内部data-generation pathがすべてのcandidate sourceから完全に独立していることを証明していない。`independent validation oracle`は、validation process内でcandidateが自身のexpected valueを生成・修正・承認しないというoperational separationを表していた。

## Independence Reconciliation

| Concept | Operational meaning | Required for Project Ground Truth | Review result |
|---|---|---:|---|
| source-independent | Expected valueの由来となるdata source / generation pathが、評価対象candidate sourcesと完全に別である | No | Standard precedentにない追加条件。利用可能ならprovenance強化になるがmandatory化しない |
| candidate-independent | Expected valueをDiscoveryで評価するcandidate surfacesから生成、変更、修復、自己承認しない | Yes | Standard precedentとFail Closedに整合 |
| pre-established | Candidate observation開始前にexact valueとfixture bindingをfreezeする | Yes | Timing gate。candidate-independent contractと組み合わせて使用 |

Pre-establishedだけでは、candidateから事前に写した値を無条件に自己承認する根拠にはしない。User-provided exact value、fixture binding、non-empty、A / B distinctness、no candidate repair / self-approvalを一体のacceptance contractとして扱う。

## Recommended Operational Definition

`PROJECT_CID_GROUND_TRUTH_INDEPENDENCE`:

> Expected Conversation ID is fixed before Project candidate observation and is not generated, modified, repaired, or self-approved from the candidate surfaces being evaluated during Discovery.

このdefinitionを**ADOPT**する。

- Standard TV-003 precedentをProject coverageへ同じvalidation-oracle principleとして適用する。
- Full source-independenceを新しいFormal Pass条件に追加しない。
- Candidate observation前のuser-provided exact inputをRuntime Ground Truthとして受け入れる。
- Candidate capture後にcandidate値をexpected valueへ昇格しない。
- Requirement semantics change: **No**。
- ADR change required: **No**。

FR-004はcurrent tab URL / ID consistencyを検証することを要求するが、Ground Truthの供給sourceに完全独立性を追加要求していない。ADR-006 / ADR-014も上記operational definitionと矛盾しない。

## Previous Evidence Clarification

Fixture Preparation Evidenceの次の趣旨はhistoryとして変更しない。

- Provenanceが後続Discovery candidate sourcesから独立していること。
- Ground Truthをcandidate surfaceから生成、修正、自己承認しないこと。

本Round以降、前者の`独立`は次の意味で解釈する。

> Validation process上、expected valueがDiscovery中のcandidate observation resultに依存せず、candidateが自分自身のoracleにならないこと。

ChatGPT内部のdata-generation pathや、user-provided referenceの完全なsource-independenceを証明する追加条件ではない。このclarificationは過去Evidenceのhistoryを書き換えず、Standard precedentより強く読める表現をreconcileする。

## Option Comparison

| Option | Assessment | Reason |
|---|---|---|
| A: 完全なsource-independent exact IDをmandatoryに要求 | REJECT AS MANDATORY / OPTIONAL ENHANCEMENT | Standard precedentとSource of Truthにない追加条件。利用可能ならprovenanceを強化するが、ProjectだけのFormal gateにしない |
| B: Candidate observation前にuser-provided exact IDをfreezeし、candidate-independent Runtime Ground Truthとして採用 | ADOPT | Standard precedentを再現し、candidate self-approvalを防ぎ、Requirement semanticsを変更しない |
| C: Discovery中のbrowser URL / route / DOMから抽出したIDをexpectedへ昇格 | REJECT | Candidate self-approvalとなり、GT mismatchを検出できない |

`RECOMMENDED OPTION: B`

## Ground Truth Acceptance Contract

Project-A / Project-Bそれぞれについて、次をすべて満たす場合だけGround TruthをESTABLISHEDとする。

1. Exact expected Conversation IDがユーザーからcandidate observation前に提供される。
2. Valueはstringかつnon-emptyである。
3. Project-A / Project-Bのfixture aliasへ一意にboundされる。
4. Project-A / Project-B expected valuesはdistinctである。
5. Candidate observation resultから生成、変更、repair、normalizationされていない。
6. Candidate capture後にcandidate値でexpected valueを上書きしない。
7. Raw expected valuesはRuntime memory内だけで保持する。
8. Evidenceにはalias、present、length、distinctness、binding、provenance / independence statusだけを保存する。

ID format、route grammar、segment positionはGround Truth acceptance ruleに追加しない。これらはProject DiscoveryでObserved Factを得た後のCandidate Decision concernである。

## Ground Truth Establishment Result

| Fixture alias | Expected ID provided | Expected ID length | Fixture binding established | Independence classification |
|---|---:|---:|---:|---|
| Project-A | false | N/A | false | NOT EVALUATED — no expected value |
| Project-B | false | N/A | false | NOT EVALUATED — no expected value |

Common result:

- A / B distinctness: **NOT EVALUATED**。
- Provenance classification: **NOT AVAILABLE — exact user-provided input absent**。
- Candidate observation performed: **NO**。
- Browser / URL / DOM capture performed: **NO**。
- Ground Truth establishment status: **NOT YET ESTABLISHED**。

The existing Project fixture aliases、Source Type Ground Truth、Project Name Ground Truth remain valid. Project NameとConversation TitleはConversation ID oracleに使用していない。

## Blocking Status

`PROJECT_CID_GROUND_TRUTH: NOT YET ESTABLISHED`

`TASK-002 DISCOVERY ENTRY: BLOCKED`

Blocking reason:

- Project-A exact expected Conversation ID: not provided。
- Project-B exact expected Conversation ID: not provided。
- Fixture-specific ID binding: not established。
- A / B ID distinctness: not evaluated。

これはTV-003 Project CoverageのFAILではなく、candidate observation前のGround Truth preparation gateである。Chrome、URL、DOMを観察して不足値を補完しない。

Additional user-provided input required:

> Candidate observation前に、Project-AとProject-Bへ明示的にboundされたnon-emptyかつdistinctなexact Conversation IDを各1件提供する。

## Observation Boundary

- Chrome tab inspection: **NO**。
- Browser automation: **NO**。
- Current browser tab URL capture: **NO**。
- URL / pathname parsing: **NO**。
- Project route / ID candidate inventory: **NO**。
- DOM / sidebar / canonical / metadata observation: **NO**。
- Standard route grammar / ID Format v1 application: **NO**。
- Candidate Decision / PoC / self-test: **NO**。

## Source-of-Truth Boundary

- Product Requirements: unchanged。
- ADR: unchanged。
- Risk Register: unchanged。
- Acceptance Tests: unchanged。
- Technical Validation Plan: unchanged。
- Development Backlog: unchanged。
- AGENTS.md: unchanged。
- TASK-001 Evidence / PoC: unchanged。
- TASK-002 Scope Planning Evidence: unchanged。
- TASK-002 Fixture Preparation Evidence: unchanged。
- Production files / `src/`: unchanged。

## Repository / Security Check

- Check result: **PASS**。
- `git diff --check`: PASS。
- New Evidence direct trailing-whitespace scan: 0 findings。
- Raw Project Name pattern: 0 findings。
- Raw Conversation Title pattern: 0 findings。
- Raw ChatGPT URL / pathname pattern: 0 findings。
- Raw UUID / Conversation ID-like literal: 0 findings。
- Raw Project / Conversation / Message / Turn identifier assignment pattern: 0 findings。
- Conversation body / validation marker pattern: 0 findings。
- Credential / cookie / token / authorization assignment pattern: 0 findings。
- Product Requirements、ADR、Risk Register、Acceptance Tests、Technical Validation Plan、Development Backlog、AGENTS.md: unchanged。
- TASK-001 assets、TASK-002 existing Evidence: unchanged。
- `src/`, Production files: unchanged。
- Changed scope: this Project CID Ground Truth Establishment Evidence file only。

This Evidence was untracked during review; therefore `git diff --check` alone was not used as its content check. Direct whitespace and raw-value scans were run against the file itself。

## Status After This Round

```text
TASK-002 Scope Planning: COMPLETE
TASK-002 Backlog Reconciliation: COMPLETE
TASK-002 Fixture Designation / Ground Truth Preparation: COMPLETE
TASK-002 Project CID Ground Truth Establishment: INCOMPLETE
TASK-002 Discovery: NOT STARTED
TV-004 Ground Truth: PRE-ESTABLISHED
TV-004 Verdict: NOT SET
TV-003 Project CID Ground Truth: NOT YET ESTABLISHED
TV-003 Project Coverage: NOT OBSERVED
TV-003 Overall Final Verdict: PENDING
TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

Project-A / Project-Bのexact expected Conversation IDを、上記Option B contractに従ってcandidate observation前にユーザーが提供する。その入力をRuntime memory内だけでvalidationし、present、length、binding、distinctness、candidate-independenceをEvidence-safeに再評価する。

Project Chat Discovery、browser capture、candidate inventoryはまだ開始しない。
