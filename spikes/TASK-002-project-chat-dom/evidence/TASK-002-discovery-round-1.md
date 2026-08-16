# TASK-002 Project Chat DOM Spike — Discovery Round 1

## Status

- Observation date: 2026-08-16
- Fixture: `Project-A`
- TASK-002 Discovery: **IN PROGRESS**
- TASK-002 Discovery Round 1: **COMPLETE**
- TV-004 Ground Truth: **PRE-ESTABLISHED**
- TV-004 Candidate Inventory: **INITIAL / PROJECT-A OBSERVED**
- TV-004 Verdict: **NOT SET**
- TV-003 Project CID Ground Truth: **ESTABLISHED**
- TV-003 Project Coverage Candidate Inventory: **INITIAL / PROJECT-A OBSERVED**
- TV-003 Project Coverage Verdict: **NOT SET**
- TV-003 Overall Final Verdict: **PENDING**
- TASK-002 Final Exit: **NOT SET**
- Phase 0 Exit: **NOT MET**
- Production implementation: none

Round result: **COMPLETE / OBSERVATION ONLY**。

Candidate Decision、Primary / cross-check、selector、route grammar、ID format、fallback、PoC、Verdictは決定していない。

## Review Basis

- TV-004: Project ChatをStandard Chatと識別し、complete Project Nameを取得できるかを検証する。
- TV-003 Project Coverage: Current browser tab URL等からProject ChatのConversation IDを一意に取得・検証できるかを検証する。
- FR-004、FR-006、FR-011、ADR-006、ADR-014、AT-002、AT-004、AT-010、RISK-003、RISK-004、RISK-029をtraceした。
- Track AのProject Name、Track BのConversation ID、fixture identification用Conversation Titleを相互のoracleに使用していない。
- Standard Chatのroute grammar、segment position、selector、ID Format v1をProject-Aへ適用していない。

## Setup

- Authenticated Chrome上でユーザー指定済みのProject-A tabをfixture identification metadataにより1件へ絞り込んだ。
- Fixture identification valueはcandidate oracleとして使用していない。
- Current browser tab URLはChrome host boundaryから取得し、page execution contextとは別inputとして保持した。
- Runtime Ground Truthはcandidate observation前に固定済みのSource Type、Project Name、Conversation IDを使用した。
- Raw Ground Truth、raw URL、raw pathname、raw href、raw canonical、raw DOM値はRuntime memory内だけで比較した。
- Page stateを変更する操作、reload、navigation、fixed sleep、polling、retry、timeoutは実施していない。

## Project-A Observation State

| Item | Result |
|---|---:|
| Fixture tab match | 1 |
| Fixture identification present in host title | true |
| Fixture identification expected length | 26 |
| Host title length | 49 |
| Browser / host URL capture performed | true |
| Page observation performed | true |
| Document ready state | complete |
| Body present | true |
| Main cardinality | 1 |
| Viewport | 1920 x 855 |
| Snapshot count | 1 |
| Transition observed | false |
| Current candidate state | available |

Environment: authenticated Chrome on Windows。Browser major versionはこのRoundで再取得していない。

`settled`はmanual observation時点の状態分類であり、Production waiting / settled algorithmではない。

## Track A — Project Name Candidate Inventory

Expected Project Name length: 20。Raw expected valueは保存していない。

| Alias | Source family | Raw cardinality | Underlying visible group count | Value present | Value length | GT exact | Binding / structural relation | Truncation observation | Observation-only assessment |
|---|---|---:|---:|---:|---:|---:|---|---|---|
| A-N01 | Project navigation exact text | 4 nested elements | 1 | true | 20 | true | `nav`内の1 containment chain。root-most name nodeのnearest `li`がcurrent-route Conversation anchorを包含 | Leaf nodeはCSS ellipsis / hidden。`clientWidth == scrollWidth`でactual horizontal clippingは未確認。DOM値はfull exact | Current Project binding候補としてmaterialあり。採用未決定 |
| A-N02 | Header exact text | 7 nested elements | 1 | true | 20 | true | `header`内の1 containment chain。chain内にProject-related anchorが1件 | Leaf nodeはCSS ellipsis / hidden。`clientWidth == scrollWidth`でactual horizontal clippingは未確認。DOM値はfull exact | Header Project Name候補。採用未決定 |
| A-N03 | Header Project-related anchor | 1 | 1 | true | 20 | true | A-N02 chain内。same-origin、current Conversation pathとは別。routeは3 segmentsでProject tokenを1件含む | Anchor textはfull exact。Accessible valueはwrapped | Project navigation / identity link候補。current Conversation bindingの規則は未決定 |
| A-N04 | Accessible name containing Project Name | 7 | 7 | true | 33–66 | false | `nav`に6件、`header`に1件。Project Nameはprefix / suffix付きvalueの部分文字列。current-route anchorとA-N03を含む | DOM accessible valueはnon-empty。Project Name単独値ではない | Cross-check材料だがnon-unique / wrapped。strip ruleなし |
| A-N05 | Project-token `data-testid` | 9 | 9 | true | 19 or 31 | false | `nav`、`header`、turn-level operation groupに分布 | N/A | Broad semantic marker。Source Type detectorとして未決定 |
| A-N06 | Project-token `aria-label` | 35 | 35 | true | 11–66 | false | `nav`、`header`、turn-level operation groupに分布。7件だけがGT nameを内包 | N/A | Broad semantic markerでcardinalityが高い。単独採用未決定 |
| A-N07 | Project-named `data-*` attribute | 0 | 0 | false | N/A | false | Not found | N/A | NOT AVAILABLE in Project-A initial snapshot |
| A-N08 | Document / head title | 1 document surface / 1 `title` | 1 | true | 49 | false | Conversation fixture identificationを内包。Project Nameとは不一致 | N/A | Project Name candidateとして不成立 |

### Project Name Containment

- Raw exact-name elements: 11。
- Root-most exact-name elements: 2。内訳は`nav` group 1、`header` group 1。
- Leaf-most exact-name elements: 2。内訳は`nav` group 1、`header` group 1。
- 11 elementsは独立した11 sourceではなく、2つのnested DOM groupsを形成した。
- Exact-name elementsはすべてvisibleだった。
- `title` attributeにProject Nameを含むcandidateは0件だった。
- Exact Project Nameである`aria-label` candidateは0件だった。

### Truncation Classification

- A-N01 / A-N02のleaf nodeにはellipsis-capable CSSが存在した。
- Project-A name length 20ではleaf nodeのhorizontal geometry overflowは観察されなかった。
- DOM textは両groupともGround Truth full valueへexact matchした。
- Classification: `FULL DOM VALUE / CSS_ELLIPSIS_CAPABLE / ACTUAL DISPLAY TRUNCATION NOT CONFIRMED`。
- General clipping detectorやtruncation recovery ruleは設計していない。

## Track A — Source Type Detection Candidate Inventory

| Alias | Candidate family | Availability / cardinality | Project-A observation | Observation-only assessment |
|---|---|---|---|---|
| A-S01 | Project navigation grouping | present / 1 structural group | Full Project Name groupとcurrent Conversation anchorが同じnearest `li` scopeに存在 | Project membership / current binding材料。detector未決定 |
| A-S02 | Header Project-related link | present / 1 | Full Project Name exact、wrapped accessible name、Project-token route segment 1 | Project context材料。canonical source未決定 |
| A-S03 | Current document route shape | present / 1 | 4 non-empty segments。Project literal token match 0 | Standard routeとは異なるshape materialだがgrammar未決定 |
| A-S04 | Project-token `aria-label` | present / 35 | 複数UI familyへ広く分布 | Non-unique。単独detectorとして未決定 |
| A-S05 | Project-token `data-testid` | present / 9 | `nav`、`header`、operation groupへ分布 | Semantic marker material。selector / detector未決定 |
| A-S06 | Project-named `data-*` attribute | absent / 0 | Not found | Not available in this snapshot |
| A-S07 | Document / head Project Name | absent / 0 exact | Document titleはConversation identification surface | Project detector / Project Name candidateとして不成立 |

Standard-ControlをこのRoundで観察していないため、false-positive / false-negativeは未評価である。

## Track B — Conversation ID Candidate Inventory

Expected Project-A Conversation ID length: 36。LengthはdiagnosticでありProject ID format requirementではない。

| Alias | Source family | Availability | Cardinality | Candidate length | CID GT exact | Binding / structural relation | Observation-only assessment |
|---|---|---:|---:|---:|---:|---|---|
| B-C01 | Browser host current tab URL | true | 1 | URL 97 / matching segment 36 | true | Chrome host boundaryから取得 | FR-004 primary boundary material。Primary decision未実施 |
| B-C02 | Page `location.href` / `document.URL` | true | 2 API surfaces / 1 route state | URL 97 / matching segment 36 | true | 両APIはexact equality。host URLともexact equality | Same underlying page route surface。fallback / independent oracleではない |
| B-C03 | Page `location.pathname` | true | 1 | pathname 78 / matching segment 36 | true | Parsed page pathnameとexact equality | B-C02のsource-internal surface |
| B-C04 | Current-route navigation anchor raw `href` | true | 1 | href 78 / matching segment 36 | true | Visible `nav` anchor。same-origin / same-path / same-query / same-fragment。whole current route exact | Current Conversation binding candidate。`data-active` semanticsは未決定 |
| B-C05 | Current anchor nested ID metadata | true | Scoped 1; global raw matches 33 | 36 | true | B-C04 subtree内の`data-conversation-options-trigger` exactly 1。global残り32はGT不一致 | Current-anchor scope material。inventory-wide selectionは未採用 |
| B-C06 | `link[rel="canonical"]` | true | 1 | URL 97 / matching segment 36 | true | page URLとsame-origin / same-path / whole URL exact | Head cross-check candidate。required role未決定 |
| B-C07 | `og:url` | true | 1 | 20 | false | same-origin、current pathではない、CID match 0 | Conversation ID candidateとして不成立 |
| B-C08 | Main Conversation `data-*` metadata | weak values only | 9 structural attrs / CID exact 0 | 0 | false | `main`内に8 empty screenshot-related attrsと1 empty footer-related attr。standalone CID metadataなし | Main standalone Conversation ID candidateはNOT AVAILABLE |
| B-C09 | Active/current state attributes | partial | `data-active` present 1 / true 0; `aria-current` 0 | empty / N/A | N/A | B-C04 anchorにempty `data-active` attribute。`aria-current` absent | Attribute presence / value semanticsは未決定 |
| B-C10 | Same-document fragment anchor | true | 1 | raw href 5 / direct ID absent | false | Resolved URLはcurrent pathnameをinheritするがraw href自身はCIDを含まない | Resolved URLだけを見るとfalse candidateになるmaterial |

### Route Observation

| Route item | Browser host | Page route |
|---|---:|---:|
| Parseable | true | true |
| Origin present | true | true |
| Origin length | 19 | 19 |
| Whole URL length | 97 | 97 |
| Pathname length | 78 | 78 |
| Non-empty segment count | 4 | 4 |
| Segment lengths | `[1, 36, 1, 36]` | `[1, 36, 1, 36]` |
| GT exact-match segment count | 1 | 1 |
| GT exact-match segment position, zero-based | 3 | 3 |
| Project-token segment count | 0 | 0 |
| Query present / param count | false / 0 | false / 0 |
| Query GT exact-match count | 0 | 0 |
| Fragment present | false | false |
| Fragment GT exact-match count | 0 | 0 |

Browser host URL、`location.href`、`document.URL`、`location.pathname`はsettled snapshotでconsistentだった。Segment values、route literals、ID grammarは保存・決定していない。

### Navigation / Metadata Detail

- Current route exact anchor: 1。
- Raw `href`自身にGT CIDを含むanchor: 1。B-C04と同一だった。
- Parsed resolved routeがGT CIDを含むanchor: 2。ただし1件はraw fragment-only valueであり、ID sourceではなかった。
- `data-conversation-options-trigger` raw matches: 33。
- Current route anchor scope内の同metadata: exactly 1、non-empty、length 36、GT exact=true。
- Global同metadataのGT exact count: 1。
- `data-active` attribute count: 1、value length 0、`true` count 0。
- `aria-current` count: 0。
- Canonical: exactly 1、current page whole URL exact、GT CID exact-match segment count 1。
- `og:url`: exactly 1、current path mismatch、GT CID match 0。
- Main standalone CID metadata: 0。
- Message ID、Turn ID、ordinalはConversation ID candidateとして使用していない。

## Source Grouping

| Source group | Candidate aliases | Structural relation | Independent source assertion | Currentness material | Ground Truth relation |
|---|---|---|---|---|---|
| G-A01 Project Navigation Surface | A-N01、A-N04のnav subset、A-S01、B-C04、B-C05、B-C09 | Project name groupとcurrent Conversation anchorが同じnearest `li` scope。Nested ID metadataはcurrent anchor subtree | No。same navigation subtree内surface | Current route exact anchor 1。`data-active=true` / `aria-current`は不成立 | Project Name exact、CID exact |
| G-A02 Project Header Surface | A-N02、A-N03、A-N04のheader subset、A-S02 | Header name chain内にsame-origin Project-related anchor | Structurally distinct DOM group。internal data-generation independenceは未証明 | Header placementとProject-related route link | Project Name exact。CID matchなし |
| G-A03 Project Semantic Marker Surface | A-N05、A-N06、A-S04、A-S05 | Project-token markersがnav / header / operation UIへ広く分布 | No independent oracle assertion | Broad availabilityのみ | Direct GT exact valueではない |
| G-A04 Document Title Surface | A-N08、A-S07 | `document.title`と`head > title`は同一document-title source | No | Conversation fixture currentness materialのみ | Project Name mismatch |
| G-B01 Browser Host Route Surface | B-C01 | Chrome host boundary | Structurally separate input。identity oracle independenceは主張しない | Current tab route | CID segment GT exact |
| G-B02 Current Document Route Surface | B-C02、B-C03 | `location.href`、`document.URL`、`location.pathname`は同一page route source | No。source-internal surfaces | Host routeとexact consistency | CID segment GT exact |
| G-B03 Active Conversation Navigation Surface | B-C04、B-C05、B-C09、B-C10 | Current-route anchor subtreeとnearby same-document navigation | G-A01と同じnavigation DOMのTrack B view | Route equalityとscoped metadata。active attribute semantics unresolved | Current anchor / scoped metadataはCID exact。fragment anchorはdirect ID absent |
| G-B04 Head Route Metadata Surface | B-C06、B-C07 | Head metadata内のcanonical / og surface | Structurally distinct DOM group。internal generation independenceは未証明 | Canonical current、og current path mismatch | Canonical CID exact、og mismatch |
| G-B05 Main Conversation Metadata Surface | B-C08 | Main subtreeのnon-Message / non-Turn data attributes | Structurally distinct DOM group | Standalone current CID bindingなし | CID exact candidate 0 |

同一group内の複数API / nested elementsをindependent sourceとして水増ししていない。Structurally distinctであることと内部data-generation pathが独立していることを区別する。

## Confirmed Observed Facts

### Track A

- Project-A initial snapshotでcomplete Project Nameとexact一致するDOM textが存在した。
- Raw exact-name elements 11は、`nav`と`header`の2つのnested source groupsへ集約された。
- `nav` Project Name groupのnearest `li`はcurrent-route Conversation anchorを包含した。
- `header` Project Name groupにはProject-related same-origin anchorが存在した。
- Project Name DOM値はfull exactだった。CSS ellipsis capabilityは存在したがactual horizontal truncationは未確認だった。
- Accessible valuesはProject Nameを含むがwrappedかつnon-uniqueだった。
- Project-token semantic markersは複数UI familyへ分布し、単独で一意ではなかった。
- Document title / head titleはProject Nameと一致しなかった。

### Track B

- Current browser tab URLをpage execution contextとは別inputとして取得した。
- Browser host route、`location.href`、`document.URL`、`location.pathname`はinitial snapshotでconsistentだった。
- Host / page pathnameは4 segmentsで、GT CID exact segmentが1件、zero-based position 3に存在した。
- Query / fragmentにGT CID matchはなかった。
- Current route exact anchorが1件存在し、raw href内CID、nested metadata、Ground Truthが一致した。
- Global nested metadataは33件あり、current anchor subtreeへscopeするとexactly 1だった。
- `data-active` attributeは存在したがemptyで、`data-active="true"`と`aria-current`は観察されなかった。
- Canonicalはexactly 1でcurrent route / GT CIDへ一致した。
- `og:url`とMain standalone metadataはCID candidateとして成立しなかった。
- Raw fragment-only anchorのresolved URLがcurrent CIDをinheritするため、resolved URLだけのscanはfalse candidateを生じ得る。

## Not Yet Decided

- Project Source Type detection strategy。
- Project Name Primary / cross-check / cardinality rule。
- Project Name accessible wrapperの扱い。
- Conversation ID Primary / required cross-check。
- Project route grammar、static literal、segment position contract。
- Project Conversation ID format。
- `data-active` empty attributeの意味。
- Current Project / Conversation binding predicate。
- Canonicalのrole。
- Selector、fallback、Fail Closed contract。
- Reload / navigation / Project-B / Standard-Controlでのreproducibility。
- Settled / waiting algorithm。
- Production behavior、Production error mapping。
- TV-004 / TV-003 Project Coverage / Overall verdict。

## Known Limitations

- Project-A initial settled snapshot 1件のみ。
- Project-B、Standard-Control、reload、navigation、Back / Forward、Direct Loadは未観察。
- Chrome on Windows、viewport 1920 x 855の1環境のみ。
- Browser major versionはこのRoundで再取得していない。
- CSS geometry observationはgeneral clipping detectorではない。
- Candidate currentnessはinitial stateだけであり、transition / stale behaviorは未評価。
- DOM source groupsのinternal generation independenceは未証明。

## Requirement / ADR / Risk Impact

- **FR-004 / AT-004 / RISK-029**: Host URL boundary、page route、current anchor metadata、canonicalというProject-Aのconsistency materialを確認した。Mismatch contract / Production error mappingは未決定。
- **FR-006 / AT-002 / RISK-003**: Project Nameを含むnavigation / header / semantic marker candidatesを確認したが、Project detectorは未決定。Standard-Control未観察のため誤認防止は未評価。
- **FR-011 / AT-010 / RISK-004**: Complete Project Nameにexact一致する2 structural groupsを確認した。Missing / ambiguous時のProduction behaviorは未実装。
- **ADR-006**: Missing / ambiguous / inconsistentをsuccess扱いするDecisionは行っていない。Fail Closed rulesはCandidate Decision後に定義する。
- **ADR-014**: Raw URL全体をidentityへ採用せず、Conversation ID candidateとnavigation routeを区別して観察した。

## Repository / Security Check

- Check result: **PASS**。
- `git diff --check`: PASS。
- Evidence direct trailing-whitespace scan: 0 matches。
- Raw ChatGPT URL / raw pathname pattern scan: 0 matches。
- Raw UUID / Conversation ID-like value scan: 0 matches。
- Raw identifier / name assignment scan: 0 matches。
- Raw page HTML / DOM snapshot pattern scan: 0 matches。
- Credential / cookie / token / authorization assignment scan: 0 matches。
- Raw Project Name、raw Conversation Title、raw Conversation body: direct content reviewで0 findings。
- Changed file: this new Discovery Round 1 Evidence only。
- Product Requirements / ADR / Risk Register / Acceptance Tests / Technical Validation Plan / Development Backlog / AGENTS.md: unchanged。
- TASK-001 assets / TASK-002 existing Evidence / `src/` / Production files: unchanged。
- This Evidence was untracked during review; direct whitespace and raw-value scans were used in addition to `git diff --check`。

## Status After Round 1

```text
TASK-002 Discovery: IN PROGRESS
TASK-002 Discovery Round 1: COMPLETE

TV-004 Ground Truth: PRE-ESTABLISHED
TV-004 Candidate Inventory: INITIAL / PROJECT-A OBSERVED
TV-004 Verdict: NOT SET

TV-003 Project CID Ground Truth: ESTABLISHED
TV-003 Project Coverage Candidate Inventory: INITIAL / PROJECT-A OBSERVED
TV-003 Project Coverage Verdict: NOT SET
TV-003 Overall Final Verdict: PENDING

TASK-002 Final Exit: NOT SET
Phase 0 Exit: NOT MET
Production implementation: none
```

## Recommended Next Action

`TASK-002 Discovery Round 2`

Round 2のscopeは別途明示してから開始する。このRoundではProject-B、Standard-Control、reload、navigation、Candidate Decision、PoCへ進まない。
