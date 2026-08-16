# TASK-002 Fixture Designation / Ground Truth Preparation

## Status

- Preparation date: 2026-08-16
- TASK-001 Final Exit: **PASS / COMPLETE**
- TASK-002 Scope Planning: **COMPLETE**
- TASK-002 Backlog Reconciliation: **COMPLETE**
- TASK-002 Fixture Designation / Ground Truth Preparation: **COMPLETE**
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

Candidate observation performed: **NO**。

## Preparation Scope

ユーザーがcandidate observation前に指定した3つの検証fixtureをaliasへ固定し、Source TypeとProject NameのRuntime Ground Truth provenanceを記録した。

このRoundではChrome tab、URL、pathname、DOM、sidebar、canonical、document metadata、selector、route grammar、ID formatを取得・観察・解析していない。ユーザーが認証済みChrome tabとしてopen済みであることだけをsetup declarationとして扱う。

## Fixture Designation Result

| Fixture alias | Fixture designated | Declared Chrome state | Expected Source Type | Project Name present | Project Name length | Identification Title present | Identification Title length |
|---|---:|---|---|---:|---:|---:|---:|
| Project-A | true | authenticated tab open | Project | true | 20 | true | 26 |
| Project-B | true | authenticated tab open | Project | true | 5 | true | 11 |
| Standard-Control | true | authenticated tab open | Standard | N/A | N/A | true | 48 |

Raw Project Nameとraw Conversation TitleはこのEvidenceへ保存していない。

## Fixture Relationship Ground Truth

| Relationship | Pre-candidate expectation | Result |
|---|---|---:|
| Project-A source type | Project | established |
| Project-B source type | Project | established |
| Standard-Control source type | Standard | established |
| Project-A / Project-B membership | different known Projects | established |
| Project-A expected Project Name | non-empty | true |
| Project-B expected Project Name | non-empty | true |
| Project-A / Project-B expected Project Names | distinct | true |
| Identification Titles | fixture locator only | confirmed |

## Ground Truth Provenance

### Source Type Ground Truth

`SOURCE_TYPE_GROUND_TRUTH: ESTABLISHED`

- Project-A / Project-Bは、ユーザーがcandidate observation前に異なる既知Projectへ所属するProject Chatとして指定した。
- Standard-Controlは、ユーザーがcandidate observation前にProject Chatではない既知Standard Chatとして指定した。
- DOM、URL、Project Name candidate、Conversation TitleからSource Typeを導出していない。
- Provenance classification: **user-provided pre-candidate fixture designation / setup fact**。

### Project Name Ground Truth

`PROJECT_NAME_GROUND_TRUTH: ESTABLISHED`

- Project-A / Project-Bのcomplete expected Project Nameは、ユーザーがcandidate observation前に明示した。
- Raw expected valuesはRuntime context内だけで保持し、このEvidenceへ保存していない。
- Candidate DOM、accessible name、route、document metadataからexpected valueを生成または更新していない。
- 両expected namesはnon-emptyかつdistinctである。
- Provenance classification: **user-provided exact expected value before candidate observation**。

### Conversation Title Classification

`CONVERSATION_TITLE_ROLE: FIXTURE IDENTIFICATION ONLY`

- Conversation TitleはProject-A / Project-B / Standard-Controlを人間とCodexが取り違えないためのlocator metadataに限定する。
- Source Type oracleとして使用しない。
- Project Name oracleとして使用しない。
- Conversation ID oracleとして使用しない。
- Raw TitleはこのEvidenceへ保存していない。

### Project Conversation ID Ground Truth

`PROJECT_CID_GROUND_TRUTH: NOT YET ESTABLISHED`

- Raw Project Conversation IDを取得していない。
- Current browser tab URL、page URL、pathname、canonical、sidebar、active item、DOM metadataを取得していない。
- Standard route grammar、route literal、ID position、Standard active item metadata、canonical behavior、Standard ID Format v1をProject Chatへ適用していない。
- Candidate valueからexpected IDを生成していない。
- Project NameまたはConversation TitleからConversation IDを推測していない。

Provenance classification: **not available / must be established independently in a later round**。

## Project CID Ground Truth Establishment Contract

次Roundではcandidate observationより前に、Project-A / Project-Bそれぞれのexact expected Conversation IDをcandidate-independentに固定する方法を決定する。

Acceptable planning requirements:

1. Expected valueはProject route / DOM candidate captureを開始する前にユーザーが明示する。
2. Provenanceが、後続Discoveryで評価するbrowser URL、page route、canonical、sidebar、DOM metadataから独立していることを説明できる。
3. Candidate surfaceからexpected valueを再生成、修正、自己承認しない。
4. Project-A / Project-Bのexpected valuesが各fixtureへ一意にboundし、distinctness expectationを事前固定する。
5. Raw expected valuesはRuntime memory内だけで保持する。
6. Evidenceへはalias、length、exact equality、distinctness、provenance statusだけを保存する。
7. Candidate-independent exact oracleを確立できない場合はTrack B candidate observationへ進まない。

Candidate-independent inputの具体的な提供方法は次Roundで決定する。現時点でURL、route、DOM、formatに基づく方法を推測採用しない。

## Track Separation

### Track A — TV-004 Project Chat Detection / Project Name

- Source Type Ground Truth: established。
- Complete Project Name Ground Truth: established。
- Project-A / Project-B distinct Project relationship: established。
- Standard-Control negative fixture: established。
- Candidate inventory / observation: not started。
- Verdict: not set。

Track Aは将来のDiscoveryでSource Type / Project Name candidatesを独立Ground Truthへ比較する。Conversation IDはTrack Aのoracleに使用しない。

### Track B — TV-003 Conversation ID Project Coverage

- Project fixture aliases: established。
- Source Type setup fact: established。
- Project Conversation ID Ground Truth: not yet established。
- Browser / URL / DOM candidate observation: not started。
- Project Coverage: not observed。
- Verdict: not set。

Project NameとConversation TitleをTrack BのConversation ID oracleに使用しない。

## Browser / URL Boundary

- Browser automation performed: **NO**。
- Chrome tab inspection performed: **NO**。
- Current browser tab URL captured: **NO**。
- URL / pathname parsing performed: **NO**。
- Project route inventory performed: **NO**。
- Conversation ID candidate extraction performed: **NO**。
- Standard route grammar applied to Project Chat: **NO**。

User-provided Chrome tab stateはfixture availability declarationだけであり、routeまたはidentity Evidenceではない。

## Blocking Status

| Scope | Status | Reason |
|---|---|---|
| Track A fixture / Ground Truth preparation | READY FOR FUTURE DISCOVERY | Source Type、Project Name、fixture aliasesがpre-established |
| Track B fixture designation | COMPLETE | Project-A / Project-B aliasesとTrack separationは固定済み |
| Track B candidate observation | BLOCKED | Project CID Ground Truthがcandidate-independently確立されていない |
| TASK-002 Discovery | NOT STARTED / ENTRY INCOMPLETE | Combined Track scopeではTrack B Ground Truth preparationが残る |

`BLOCKING FOR TRACK B DISCOVERY: PROJECT_CID_GROUND_TRUTH_NOT_ESTABLISHED`

これはValidation failureではなく、candidate observation前のGround Truth preparation gateである。

## Source-of-Truth Boundary

- Product Requirements: unchanged。
- ADR: unchanged。
- Risk Register: unchanged。
- Acceptance Tests: unchanged。
- Technical Validation Plan: unchanged。
- Development Backlog: unchanged in this Round。
- AGENTS.md: unchanged。
- TASK-001 Evidence / PoC: unchanged。
- TASK-002 Scope Planning Evidence: unchanged。
- Production files / `src/`: unchanged。

Scope Planning Evidenceの`Source-of-Truth amendment: PROPOSED / NOT APPLIED`は当時のPlanning historyとして遡及修正していない。Current Backlog Reconciliation statusは本EvidenceのStatusで別に記録する。

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
- `src/`, Production files: unchanged。
- Product Requirements、ADR、Risk Register、Acceptance Tests、Technical Validation Plan、Development Backlog、AGENTS.md: unchanged。
- TASK-001 assets、TASK-002 Scope Planning Evidence: unchanged。
- Changed scope: this Fixture / Ground Truth Preparation Evidence file only。

This Evidence was untracked during review; therefore `git diff --check` alone was not used as its content check. Direct whitespace and raw-value scans were run against the file itself。

## Recommended Next Action

`TASK-002 Project Conversation ID Ground Truth Establishment`

次Roundではcandidate surface、browser URL、Project route、DOM metadataを観察する前に、Project-A / Project-BのConversation ID Runtime Ground Truthをcandidate-independentに固定する方法とprovenanceを確定する。Project Chat DOM Discovery、browser capture、candidate inventoryはまだ開始しない。
