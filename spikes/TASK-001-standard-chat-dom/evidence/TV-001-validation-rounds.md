# TASK-001 / TV-001 Standard Chat Message DOM Evidence

## Status

- Phase: Phase 0 Technical Spike
- Scope: TASK-001 / TV-001 only
- Validation state: TV-001 Final Review complete
- TV-001 Final Verdict: **PASS**
- Production implementation: none
- Phase 0 PoC: v1 / v2 / v3 implemented
- Observation dates: 2026-08-14 and S3 reload recheck on 2026-08-15 (Asia/Tokyo)
- Runtime context: user-provided current Chrome / ChatGPT UI; observed viewport 958 x 854 CSS px
- Chrome Version: 151.0.7922.109 (single ProductVersion reported by the running Chrome processes on 2026-08-15)
- ChatGPT UI build: not captured / unavailable

This evidence contains aliases, counts, structural relationships, and comparison results only. It does not contain conversation URLs, Conversation IDs, Message IDs, turn IDs, titles, raw conversation text, page HTML, DOM snapshots, cookies, tokens, or browser storage.

## Traceability

| Validation item | Requirement / Acceptance Test | ADR | Risk | Scope note |
|---|---|---|---|---|
| TV-001: Message enumeration | FR-005, FR-009; AT-005 | ADR-004 | RISK-001 | S2 Runtime Ground Truthとの比較まで |
| TV-001: Message content boundary | FR-005, FR-009 | ADR-004 | RISK-001 | turn-level operation UIと本文branchの境界を含む |
| Related Finding / TASK-005 handoff | FR-010; AT-006; TV-008 | - | RISK-016 | 本文subtree内UIの一般分類とContentBlock変換は未実施 |
| TASK-003 handoff | FR-007, FR-008, NFR-001; TV-005, TV-006; AT-007, AT-008 | ADR-005, ADR-006 | RISK-002 | TASK-001では追加検証しない |
| TASK-004 handoff | FR-038, FR-039; TV-007 | - | RISK-005 | branch / regenerate / edited Messageは未検証 |

Traceability indicates relevance and impact; it does not mean the deferred validation items have passed.

---

## Validation Round 1: S2 Message Enumeration

### Hypothesis

20+ MessageのStandard Chatで、Conversationに存在する全Messageを順序・role・identityを保って列挙できる。

### Setup

- S2 Expected Message Count: 24
- Expected roles: `user, assistant` の12組
- Expected marker sequence: `U01, A01, ... U07, A07, U08, A08, U08, A08, U09, A09, U10, A10, U11, A11`
- `U08` / `A08` は意図的に同じ入力・応答を2回生成したRuntime Ground Truth
- States observed: Initial, Top, staged top-to-bottom scan, Bottom, Reload + rescan

### Result

| State | Outer containers | Mounted turn sections | Mounted range / notes |
|---|---:|---:|---|
| Initial (near bottom) | 25 | 5 | turns 20-24 |
| Top settled | 25 | 11 | turns 1-6 and 20-24 |
| Staged scan | 25 | 5-15 | viewport位置に応じてmount / unmount |
| Full scan union | 25 | 24 unique | turns 1-24を累積取得 |
| Reload + full rescan | 25 | 24 unique | Ground Truthと再一致 |

- Outer index 0はMessageを持たないcontainerだった。
- Mounted Message数はConversationの全Message数と一致しなかった。
- Outer container数もExpected Message Countと一致しなかった。
- スクロール中にscroll heightが動的に変化した。
- 一度のDOM queryではなく、スクロール中の累積unionで24 Messageを取得した。
- 1回目とreload後の両方で、marker coverage、role sequence、turn orderはGround Truthと完全一致した。
- Ground Truthにないmissing / duplicateはなかった。

### Model classification

**Model B — 現在のChrome / ChatGPT UIにおけるS2で確認された挙動。**

Viewport等に応じてMessageがmount / unmountされるため、S2の全Message取得にはスクロールしながらの累積取得が必要だった。この判定をChatGPT UI全般、他のConversation長、他のviewportへ一般化しない。

### Message identity finding

> 同一role・同一本文内容を持つ複数のMessageが存在し得るため、本文内容そのものをMessage identityとして使用してはならない。

Confirmed in S2:

- 同一markerを持つMessageが異なるturnとして存在した。
- それぞれ異なるturn identity / Message identityを持った。
- 同一Messageのscroll後のremountは、観察したstable identity値の一致によってdeduplicateできた。
- 同一本文を持つ別Messageは、異なるidentityとして保持できた。
- 観察したturn / message identity候補はscan中とreload後に対応関係を維持した。

Canonical Message identityおよび最終selectorは未決定。

### Verdict

- Validation Round 1 result: **APPROVED by user**
- Model classification for this S2/runtime: **Model B**
- TV-001 Final Verdict: **NOT SET**

### Known Limitations / TASK-003 Finding

以下はTASK-003（TV-005 / TV-006）へ引き継ぎ、TASK-001では追加検証しない。

- DOM virtualization / mount-unmount behavior
- mounted Message数はConversation全Message数と一致しない
- outer container数はMessage Countと一致しない
- dynamic scrollHeight
- Ground Truthなしでのcomplete判定条件が未確定
- general settled conditionが未確定
- 50 / 100 / 200 Message級
- viewport variation
- scroll step variation
- general completeness signal
- Ground Truthなしでの完全取得判定

Branch / regenerate / edited MessageはTASK-004へ引き継ぐ。

### Requirement / ADR / Risk Impact

- FR-009 / ADR-004 / RISK-001: Message identityとDOM取得方式はAdapter側で局所化し、本文同一性をidentityに使わない必要がある。
- Related Finding / TASK-003 handoff:
  - FR-007 / ADR-005: Conversation全体取得には、現時点のmounted DOMの一括列挙だけでは不十分。
  - FR-008 / NFR-001 / ADR-006 / RISK-002: Ground Truthなしの完全性判定は未確定。一般解はTASK-003へ移管。

### Next Action

TASK-003でTV-005 / TV-006を検証する。TASK-001内では一般的なCompleteness Signalの追加検証を行わない。

---

## Validation Round 2: S3 Message Content Boundary

### Hypothesis

各Messageに属する本文範囲を欠損なく特定し、turn-level Message操作UIを本文へ混入させず境界付けできる。

### Setup

- S3 Expected Message Count: 8
- Expected roles: `user, assistant, user, assistant, user, assistant, user, assistant`
- Rich Assistant: 匿名化したSTART / END marker pair
- Long User: 匿名化したSTART / END marker pair
- Rich Assistant expected structures: paragraph, bullet list, numbered list, quote, fenced code block, link, bold, italic, inline code
- ContentBlockへの意味変換はTV-008 / TASK-005のため未実施

### Mount and role result

| State | Outer containers | Mounted turn sections | Role result |
|---|---:|---:|---|
| Initial (near bottom) | 14 | 5 | turns 4-8 |
| Top settled | 17 | 8 | turns 1-8、Ground Truthと一致 |

S3でもouter container数はMessage Countと一致せず、スクロール状態で変化した。Content boundaryの観察はTop settledで全8 turnがmountされた状態で実施した。

### S3 Reload Recheck

2026-08-15に同じS3を1回reloadし、reload直前とreload後に同じ匿名化・構造化スナップショットを比較した。class文字列の完全一致は比較条件に含めず、本文取得に必要なsemantic / structural relationshipだけを比較した。reload後は追加scanなしで8 turnがmountされていた。

| Check | Before reload | After reload | Result |
|---|---|---|---|
| Expected Message Count | 8 | 8 | MATCH |
| Role sequence | `U,A,U,A,U,A,U,A` | `U,A,U,A,U,A,U,A` | MATCH |
| Short plain User | 1 unique candidate | 1 unique candidate | MATCH |
| Collapsible plain User | 2 turns、各1 unique candidate | 2 turns、各1 unique candidate | MATCH |
| Collapsible Markdown User | 1 unique candidate | 1 unique candidate | MATCH |
| Assistant content root | 4 turns、各1 Markdown root | 4 turns、各1 Markdown root | MATCH |
| Rich Assistant START / END | unique rootの先頭 / 末尾 | unique rootの先頭 / 末尾 | MATCH |
| Rich structures | 全expected structureを包含 | 全expected structureを包含 | MATCH |
| Turn operation group | 各turn 1、author / content外 | 各turn 1、author / content外 | MATCH |
| Code Copy button | 1、`pre` / content root内、code element外 | 同じ関係 | MATCH |

Rich structuresの比較対象はparagraph、bullet list、numbered list、quote、fenced code、link、bold、italic、inline code。全比較項目を含むnormalized structural snapshotはreload前後で完全一致した。

### Result: turn-level operation UI boundary

- 全8 turnで、Message author nodeは`data-message-author-role`を持った。
- 全8 turnで、turn-level operation UIの`role=group` branchを1つ観察した。
- User / Assistant双方で、turn sectionはauthor nodeとoperation groupの両方を含むが、author nodeはoperation groupを含まなかった。
- 本文候補rootもturn-level operation groupを含まなかった。
- User側groupにはCopy / Share / Edit系action、Assistant側groupにはCopy / feedback / Share / model / more系actionを観察した。これらは本文branch外だった。

### Result: User Message candidates

Observed User body shapes were not uniform:

1. Short plain User
   - author node配下のplain text `div`に本文が存在した。
   - `p`要素やcollapsible metadataは存在しなかった。
   - author / plain text candidate内にbuttonはなかった。
2. Rich User prompt
   - `collapsible-user-message-content`の内側にMarkdown rootが存在した。
   - Markdown semantic elementsを含んだ。
   - collapsible toggleはcontent candidate外だった。
3. Long plain User
   - `collapsible-user-message-content`の内側にplain text `div`が存在した。
   - START markerからEND markerまでが同じplain text candidate内にあり、candidateの先頭・末尾と一致した。
   - collapsible rootはcontentとtoggleの両方を含むが、contentはtoggleを含まなかった。
   - toggleはauthor node内・本文candidate外、turn-level operation groupはauthor node外だった。

したがって、`data-message-author-role=user`全体はrole判定には有望だが、User本文だけの境界としては広すぎるケースがある。また、collapsible content候補はshort plain Userには存在しない。

### Result: Assistant Message candidates

- Normal AssistantではMarkdown rootの配下にparagraphを観察した。
- Rich Assistantはexpected roleのturnで特定した。marker文字列はテスト指示側User Messageにも存在したため、ページ全体でmarkerだけを検索すると一意ではなかった。
- Rich AssistantのMarkdown rootはSTART markerで始まり、END markerで終わった。
- 同じroot内で以下をすべて観察した。

| Expected structure | Observed DOM evidence |
|---|---|
| paragraph | `p` present |
| bullet list | `ul` present |
| numbered list | `ol` present |
| quote | `blockquote` present |
| fenced code block | `pre` present |
| link | `a` present |
| bold | `strong` present |
| italic | `em` present |
| inline code | `pre`外の`code` present |

Current UI-specific code observation:

- Rich Assistantのfenced code blockは`pre`として存在した。
- この`pre`内に`code` descendantはなく、inline codeだけが`code`要素だった。
- `pre`内には`aria-label=Copy`のbuttonがあり、Markdown rootの内側だった。
- このbuttonはcode content elementの内側ではなかった。
- buttonのvisible textは空だったが、button element自体は本文subtree内に存在した。

したがって、Assistant Markdown rootは本文範囲候補としてexpected structuresを欠損なく包含し、turn-level operation groupを除外できた。一方、本文subtreeのDOMを無条件に保存・直列化すると、code block内の操作buttonも対象になり得る。すべてのbuttonを一律に本文外とみなすことも、semantic contentを持つ将来のinteractive subtreeを誤除外する可能性があるため、このRoundでは最終除外規則を決定しない。

### Candidate assessment (not final selectors)

| Candidate | Strength observed | Limitation observed |
|---|---|---|
| `data-message-author-role` node | roleをmachine-readableに判定可能。本文branchを包含 | User toggle等も含み得る。本文rootとしては広い |
| Assistant Markdown root | Rich AssistantのSTART〜ENDと全expected structureを包含。turn groupを除外 | CSS class候補。code block内Copy buttonを包含 |
| User collapsible content | Long / rich Userの本文を包含し、toggleとturn groupを除外 | Short plain Userには存在しない |
| User plain text leaf | Short / long plain Userの本文を限定可能 | class依存候補。Rich Userには適用できない |
| Semantic descendants (`p`, `ul`, `ol`, `blockquote`, `pre`, `a`, `strong`, `em`, `code`) | Rich contentの存在と範囲を確認可能 | Message rootやidentityを単独では決められない。表現はUI実装依存 |

No canonical source, selector, identity, or fallback chain was selected.

### Confirmed Facts

- Top settled状態で8 Messageとexpected role sequenceを確認した。
- User / Assistant双方でturn-level operation groupはauthor /本文candidate外だった。
- Rich Assistantの1つのMarkdown rootがSTART〜ENDと全expected structureを包含した。
- Long Userの1つのplain text candidateがSTART〜ENDを包含し、toggleを除外した。
- User本文DOMにはshort plain、collapsible plain、collapsible Markdownの複数shapeが存在した。
- Assistant本文root内のcode blockに操作buttonが存在した。
- markerはページ全体では一意でなく、期待role / turnとの組み合わせが必要だった。

### Remaining Unknown / Known Limitations

- Canonical Message content rootとfinal selector / fallback chain
- CSS class変更に対する各candidateの安定性
- code block等の本文subtree内UIを一般的に除外する規則
- interactive contentを`Saved` / `Ignored` / `Unsupported`へ分類する規則（FR-010 / TASK-005）
- 別Standard Chatや将来のChatGPT UI buildでも同じcontent shapeが維持されるか
- branch / regenerate / edited Message（TASK-004）
- Ground TruthなしのConversation completeness（TASK-003）

### Verdict

- Validation Round 2 observation: **COMPLETE for the supplied S3 runtime case**
- TV-001 Final Verdict: **NOT SET**

### Requirement / ADR / Risk Impact

- Primary Traceability — FR-005 / FR-009 / ADR-004 / RISK-001:
  - User / Assistantで本文shapeが異なるため、DOM固有の分岐はSource Adapterへ閉じ込める必要がある。
  - turn-level operation groupは本文branch外として識別可能だった。この境界関係はTV-001 Evidenceとして保持する。
- Related Finding / TASK-005 handoff — FR-010 / AT-006 / RISK-016 / TV-008:
  - code block内Copy buttonは本文subtree内に存在する。
  - 単純なsubtree直列化では操作UI混入の可能性がある。
  - 一般的なUI除外、Saved / Ignored / Unsupported分類、ContentBlock変換規則はTASK-005で決定する。
  - semantic structureの存在だけを観察しており、TV-008のPASS / FAILには使用しない。

### Next Action

追加のDOM探索は行わず、以下のCandidate Decision Materialsを使ってTASK-001のCandidate Decisionをレビューする。ContentBlock変換はTASK-005、一般的Completeness SignalはTASK-003、branch / regenerate / edited MessageはTASK-004で扱う。

---

## Candidate Decision Materials

Primary TraceabilityはTV-001 / FR-005 / FR-009 / ADR-004 / RISK-001。以下は観察済み候補の比較材料であり、final selector、canonical Message identity、Production fallback chainの決定ではない。

### Candidate comparison

| Decision target | Provisional primary candidate | Fallback / cross-check candidate | Evidence supporting candidate | Limitation / unresolved point |
|---|---|---|---|---|
| Message container | M-02: mounted conversation turn `section` | M-01: outer `data-turn-id-container`はplaceholder / mount signalとしてのみ評価 | M-02はauthor role nodeとturn-level groupを構造的に分離し、S2 scan unionで24 turn、S3で8 turnを表した | M-02はmounted Messageだけ。M-01にはempty containerがあり、個数もMessage Countと一致しない |
| Message identity | `data-message-id` candidate | `data-turn-id` candidate、turn ordinalでcross-check | S2でremount / reload後も対応が維持され、同一本文の別Messageは異なるidentityだった | canonical identityは未決定。branch / edit時の挙動はTASK-004 |
| Role source | M-03: `data-message-author-role` | Confirmed fallbackなし | S2 / S3で各mounted turnに1 node、値とGround TruthのUser / Assistant列が一致 | 欠落・複数・未知値の場合の代替sourceは未確認 |
| Ordering | uniqueなturn ordinalによる累積結果の整列 | 各mounted snapshotのDOM orderでcross-check | S2でordinal 1-24とmarker orderが一致し、S3で1-8とrole orderがreload後も一致 | ordinal sourceの長期安定性は未確定。DOM orderだけではvirtualized unionを一意に並べられる保証がない |
| User content acquisition | role node内でshapeを判別し、uniqueなshort plain / collapsible plain / collapsible Markdown candidateを取得 | author role nodeは境界anchorとしてのみ使用し、content fallbackにはしない | S3の3 shapeすべてで候補が一意。collapsible contentはtoggleとturn groupを除外 | 全User content shapeの網羅性は未確認。shape未解決時のsafe fallbackなし |
| Assistant content acquisition | role node内のunique Markdown content root | Confirmed fallbackなし。author role nodeは境界anchorとしてのみ使用 | S3の全4 Assistant turnで1 root。Rich AssistantのSTART〜ENDと全expected structuresを包含し、turn groupを除外 | root内にcode Copy buttonが存在。一般的UI除外 / Content分類はTASK-005 |
| Primary / Fallback policy | semantic / machine-readable attributeと構造関係を優先し、CSS class候補はshape認識の補助に限定する案 | fallbackが一意かつ同じinvariantを検証できない場合はFail Closed | role、turn、content、operation groupの包含関係がS3 reload前後で維持された | Production fallback chainは未決定 |

### Uniqueness / cardinality expectations

| Scope | Candidate expectation | Failure signal candidate |
|---|---|---|
| Mounted turn | 1 turn section → 1 author role node | 0 / 2+ author nodes |
| Message identity | 各Messageに1 non-empty identity、異なるMessage間でunique、remount時は同一 | missing、同一identityの競合、remount時のidentity不一致 |
| Role | exactly 1、`user`または`assistant` | missing、複数、未知値 |
| Turn ordinal | Conversation内でuniqueかつtotal orderを構成 | missing、duplicate、non-orderable、DOM orderとの矛盾 |
| User content | 認識したshape branchでexactly 1 content candidate | 0、複数、unknown shape、candidateがturn groupを包含 |
| Assistant content | exactly 1 content root | 0、複数、rootがturn-level groupを包含 |
| Outer container | Message cardinalityとして使用しない | outer countをMessage Countとして扱うこと自体がfailure |

### Failure detection / Fail Closed candidates

次はCandidate Decisionで採否を判断するFail Closed候補。まだProduction仕様として確定していない。

- mounted turnからauthor role node、role、identity、order、content candidateのいずれかを一意に解決できない
- identityがmissing / duplicate、または同一Messageのremountでidentityが維持されない
- 同一identityに異なるrole / orderの観察結果が対応する
- DOM orderとturn ordinalが矛盾し、順序を一意に再構築できない
- User content shapeが未認識、またはcontent candidateが0 / 複数
- Assistant content rootが0 / 複数
- content candidateがturn-level operation groupを包含する
- Conversation全体取得のcomplete判定が得られない（判定方式はTASK-003）

本文subtree内のcode Copy buttonはRelated Findingとして保持するが、その一般的な除外 / Content分類をTV-001のFail Closed規則として確定しない。TASK-005で判断する。

### Open questions before Candidate Decision

- `data-message-id`と`data-turn-id`のどちらをcanonical identityとし、どちらをcross-check / fallbackにするか
- turn ordinalをprimary ordering sourceにするか、DOM orderとの二重検証を必須にするか
- M-01 outer containerをplaceholder検知へ使用するか、Message acquisitionから完全に除外するか
- User content shape dispatchでCSS class以外に利用できる安定した構造条件をどこまで必須化するか
- Assistant content rootが0 / 複数の場合にsafe fallbackを持たせるか、即Fail Closedにするか
- Candidateごとの変更耐性を、現在のS2 / S3観察だけでTASK-001 Decisionへ進める十分なEvidenceとみなすか

### Deferred, not open within TASK-001

- General completeness / settled condition / viewport and 50-200 Message variation: TASK-003
- Branch / regenerate / edited Message identity: TASK-004
- 本文subtree内UIのSaved / Ignored / Unsupported分類とContentBlock変換: TASK-005

---

## TV-001 Candidate Decision — 2026-08-15

### Status and terminology

- Scope: TASK-001の最小PoCで使用するStandard Chat Message取得戦略
- Primary Traceability: TV-001 / FR-005 / FR-009 / ADR-004 / RISK-001
- Fail Closed alignment: ADR-006 / NFR-001
- TV-001 Final Verdict: **NOT SET**
- Production selector / Production fallback chain: **NOT DECIDED**

このDecisionで`data-message-id`に与える役割は、scrollによるunmount / remountのdeduplicationと、同一role・同一本文を持つ別Messageの区別に限定した**Runtime capture / dedup identity**である。Domain上のcanonical Message identityではない。Branch / edit時のidentity semanticsはTASK-004へ延期する。前節の`Candidate Decision Materials`にあるcanonical identityという表現はDecision前の論点記録であり、この節の用語とDecisionが後続PoCを拘束する。

### Decision Summary

- M-02 mounted conversation turn `section`: `ADOPT FOR TASK-001 POC`
- `data-message-id`: Runtime capture / dedup identityとして`ADOPT FOR TASK-001 POC`
- `data-turn-id`: identity cross-checkとして`CROSS-CHECK ONLY`。fallbackにはしない
- M-02 `section`の`data-testid="conversation-turn-N"`にある数値`N`: ordering sourceとして`ADOPT FOR TASK-001 POC`
- mounted snapshot内のturn `section`のDOM order: ordering cross-checkとして`CROSS-CHECK ONLY`
- `data-message-author-role`: role sourceとして`ADOPT FOR TASK-001 POC`
- User content: role nodeをboundary anchorとし、観察済み3 shapeをFail Closed dispatchする
- Assistant content: role node内のunique Markdown rootを採用し、confirmed fallbackは持たない
- M-01 outer `data-turn-id-container`: Message acquisition unitとして`REJECT`。TASK-003 Findingとしてのみ保持

### Decision Table

| Target | Candidate | Decision | Role in PoC | Evidence | Limitation |
|---|---|---|---|---|---|
| Mounted Message acquisition unit | M-02 mounted conversation turn `section` | `ADOPT FOR TASK-001 POC` | mount中の1 Messageを表す取得単位。scan中は取得済みMessageを累積する | S2 scan unionでturn 1-24、S3でturn 1-8をGround Truthどおり表した。author branchとturn-level groupを分離した | mount中のみ存在する。Conversation completenessの判定には使用しない |
| Runtime capture / dedup identity | 観察済み`data-message-id` | `ADOPT FOR TASK-001 POC` | 累積mapのprimary key。remountをdeduplicateし、同一本文の別Messageを区別する | S2で同一Messageのremount / reload時に維持され、同一markerの別Messageでは異なる値だった | S2 / 現行UIでのRuntime evidenceのみ。Domain canonical identityではなく、branch / edit semanticsは未確認 |
| Identity cross-check | 観察済み`data-turn-id` | `CROSS-CHECK ONLY` | `data-message-id`とturnの対応を検証し、remount時の不一致を検出する | S2でscan / reloadを通じてstableで、同一本文の別turnを区別した | `data-message-id`欠落時のfallbackとしては未検証。fallback利用しない |
| Runtime identity fallback | Confirmed candidateなし | `UNRESOLVED` | fallbackせずFail Closed | `data-turn-id`はcross-checkとしてのみ確認され、`data-message-id`欠落時の代替試験は未実施 | TASK-001 PoC開始は妨げない |
| Runtime identity alternative | `data-testid="conversation-turn-N"`のordinal | `REJECT` | Runtime identityには使わない。orderingにのみ使う | Ground Truthの順序とは一致した | ordering identifierであり、Runtime dedup identityのprimary / fallbackとしては採用しない |
| Runtime identity alternative | role + 本文内容 / marker | `REJECT` | 使用しない | S2では同一role・同一本文markerの別Messageが存在した | distinct Messageを衝突させる |
| Role | author nodeの`data-message-author-role` | `ADOPT FOR TASK-001 POC` | `user` / `assistant`判定 | S2 / S3で各mounted turnに1 node、Ground Truth role列と一致。S3 reload後も維持 | confirmed fallbackなし。missing / duplicate / unknownはFail Closed |
| Role fallback | Confirmed candidateなし | `UNRESOLVED` | fallbackせずFail Closed | 代替role sourceを実画面で確認していない | TASK-001 PoC開始は妨げない |
| Ordering | M-02 `section`の`data-testid="conversation-turn-N"`から取得する数値`N` | `ADOPT FOR TASK-001 POC` | 累積結果のprimary ordering key | S2で1-24とmarker順が一致。S3で1-8とrole順が一致し、reload後も維持 | 将来UIでの長期安定性は未確認。snapshot内のgapをcomplete / incomplete判定に使わない |
| Ordering cross-check | mounted snapshot内のM-02 `section`のDOM order | `CROSS-CHECK ONLY` | 同時にmountされたturn ordinalがstrictly ascendingか検証する | S2 / S3でDOM orderとturn ordinalが整合 | virtualizationによりsnapshotにはgapがあるため、DOM order単独ではConversation全体を整列しない |
| User short plain content | User role node内のunique plain text `div`（観察済み`.whitespace-pre-wrap` class tokenを補助利用） | `ADOPT FOR TASK-001 POC` | collapsible structureがないUser Messageのcontent candidate | S3 turn 1で一意、button / toggle / turn groupを含まず、reload後も同shape | semantic content専用attributeは未観察。class-assisted recognitionであり、confirmed fallbackなし |
| User collapsible plain content | unique `data-testid="collapsible-user-message-content"`内のunique plain text `div` | `ADOPT FOR TASK-001 POC` | collapsible plain Userのcontent candidate | S3 turns 5 / 7で一意。Long User START / ENDを包含し、toggle / turn groupを除外。reload後も維持 | plain leaf認識は観察済みclass tokenの補助を要する。別shapeの網羅性は未確認 |
| User collapsible Markdown content | unique `data-testid="collapsible-user-message-content"`内のunique Markdown root | `ADOPT FOR TASK-001 POC` | collapsible Markdown Userのcontent candidate | S3 turn 3で一意。toggle / turn groupを除外し、reload後も維持 | Markdown root認識は観察済み`.markdown` class tokenを補助利用。confirmed fallbackなし |
| User unknown-shape fallback | Confirmed candidateなし | `UNRESOLVED` | fallbackせずFail Closed | 観察済み3 shape以外のsafe content rootは未確認 | TASK-001 PoC開始は妨げない |
| Assistant content root | Assistant role node内のunique Markdown root | `ADOPT FOR TASK-001 POC` | Assistant本文のcontent candidate | S3の全4 Assistant turnで各1 root。Rich Assistant START〜ENDと全期待構造を包含し、reload後も維持 | root内にcode Copy buttonが存在。一般的UI分類はTASK-005。confirmed fallbackなし |
| Assistant content fallback | Confirmed candidateなし | `UNRESOLVED` | fallbackせずFail Closed | Markdown rootが0 / 複数のcaseで代替rootを確認していない | TASK-001 PoC開始は妨げない |
| M-01 outer container | outer `data-turn-id-container` | `REJECT` | TASK-001 Message acquisitionでは使用しない | S2でMessage Countと不一致かつempty containerあり。S3ではscroll状態でouter数自体が変化 | virtualization / placeholder構造を示すFindingとしてTASK-003へ延期 |

### Mounted Message acquisition boundary

M-02は、**現在mountされているMessageを取得する単位**としてのみ採用する。各scan stateで取得したM-02を`data-message-id`で累積deduplicateし、ordering keyで並べる。M-02の現在数、M-01の数、ordinalのgapをConversation completenessの判定へ流用しない。

TASK-001 PoCは「観察したmounted Messageを正しく取得・累積できるか」を検証する。Ground Truthなしに全Conversationを取得済みと判断する条件、settled condition、scroll strategyの一般解はTASK-003の責務とする。

### User Content Dispatch

共通前提:

1. M-02内にexactly 1のUser role nodeを要求し、boundary anchorとする。
2. role node内に観察済みcollapsible root / content / toggle構造があるかを先に判定する。
3. content candidateはrole nodeのdescendantであり、turn-level operation groupを含まないことを要求する。
4. 観察済みclass tokenは、roleと`data-testid`でscopeを限定した後のshape recognition補助としてのみ使う。

Dispatch:

1. **Collapsible structureあり**
   - `data-testid="collapsible-user-message-content"`をexactly 1要求する。
   - 同じ観察済みcollapsible root配下のtoggleがcontentの外側にあることを要求する。
   - content内のMarkdown root候補とplain text候補を両方数える。
   - Markdown=1 / plain=0ならCollapsible Markdownとして採用する。
   - Markdown=0 / plain=1ならCollapsible plainとして採用する。
   - 両方存在、両方0、いずれか複数ならunknown / ambiguous shapeとしてFail Closedする。優先順位で片方を黙って選ばない。
2. **Collapsible structureなし**
   - role node内のplain text candidateをexactly 1要求し、Short plainとして採用する。
   - Markdown candidate、collapsible content、toggleが混在する場合は観察済みShort plain shapeと一致しないためFail Closedする。
3. **Unknown shape**
   - confirmed fallbackなし。User role node全体を本文fallbackにせずFail Closedする。

### Assistant Content Acquisition

1. M-02内にexactly 1のAssistant role nodeを要求し、boundary anchorとする。
2. role node内のMarkdown content rootをexactly 1要求する。
3. content rootがturn-level operation groupを含まないことを要求する。
4. rootが0 / 複数の場合はconfirmed fallbackがないためFail Closedする。Assistant role node全体を本文fallbackにしない。

Code block内Copy buttonはcontent rootと`pre`の内側、semantic code content elementの外側に存在したFindingを維持する。単純なsubtree直列化では操作UIが混入し得るが、一般的な除外、Saved / Ignored / Unsupported分類、ContentBlock変換はTASK-005へ延期する。

### Fail Closed Invariants for TASK-001 PoC

次のいずれかに該当するmounted captureは成功扱いにしない。

1. M-02にauthor role nodeが0または複数ある。
2. `data-message-author-role`がmissing、複数、または`user` / `assistant`以外である。
3. Runtime capture / dedup identityの`data-message-id`がmissing / empty / 複数である。
4. 異なるturn cross-check（`data-turn-id`またはturn ordinal）に同じ`data-message-id`が対応する。
5. 同じ`data-turn-id`およびturn ordinalで識別されるremount Messageに、異なる`data-message-id`が対応する。
6. cross-checkに採用した`data-turn-id`がmissing / empty / 複数で、identity整合性を検証できない。
7. ordering sourceの`data-testid`が`conversation-turn-N`としてparse不能、`N`がmissing / duplicate / non-orderableである。
8. 同じmounted snapshot内でM-02のDOM orderとordinalのascending orderが矛盾する。ordinalのgap自体はTASK-001 failureにしない。
9. User content shapeがShort plain / Collapsible plain / Collapsible Markdownのいずれにも一意に分類できない。
10. User content candidateが0 / 複数、またはcompeting candidateが同時に存在する。
11. Assistant Markdown content rootが0 / 複数である。
12. User / Assistant content candidateがturn-level operation groupを包含する。
13. 同じruntime identityへ累積したrole、ordinal、`data-turn-id`の観察値がscan間で矛盾する。

これらはmounted Message captureのinvariantである。General Conversation completenessを判定する新しいsignalや、ordinalの連続性 / first / lastを使ったcomplete判定はTASK-001へ追加しない。

### Deferred Findings

#### TASK-003

- Decision: `DEFER`
- general completeness
- general settled condition
- virtualization / mount-unmountの一般解
- dynamic scrollHeight
- viewport / scroll step variation
- 50 / 100 / 200 Message級
- M-01 outer / placeholder構造の意味

#### TASK-004

- Decision: `DEFER`
- branch
- regenerate
- edited Message
- branch / edit時のRuntime capture / dedup identity semantics

#### TASK-005

- Decision: `DEFER`
- code block内Copy等、本文subtree内UIの分類・除外
- Saved / Ignored / Unsupported
- ContentBlock変換
- semantic element単位の抽出 / serialization

### Remaining Open Questions

#### Blocking for TASK-001 PoC entry

- None. S2 / S3で観察済みの候補だけを使用し、未確認fallbackを持たずFail Closedする最小PoCを開始できる。

#### Non-blocking for TASK-001 PoC entry

- `data-message-id` / `data-turn-id` / turn ordinalの将来ChatGPT UI buildにおける長期安定性
- 観察済み3種類以外のUser content shape
- Assistant Markdown rootが0 / 複数になる別Standard Chat caseとsafe fallbackの有無
- CSS class tokenを使わないshape recognition sourceの有無
- General completenessとscroll / settled strategy（TASK-003）
- Branch / edit時のidentity semantics（TASK-004）
- 本文subtree内UIとContent分類（TASK-005）

### PoC Entry Criteria

最小PoCへ進むには、次をすべて満たすことを開始条件とする。

1. PoCは`spikes/`配下に限定し、`src/`、Production architecture、既存Requirement / ADR / Risk / Acceptance Test / Backlogを変更しない。
2. 上記Decision Tableの`ADOPT FOR TASK-001 POC`と`CROSS-CHECK ONLY`だけを使用し、未観察fallbackを実装しない。
3. Runtime capture / dedup identityをDomain canonical identityまたは永続identityとして扱わない。
4. 上記Fail Closed invariantをPoCの観察結果に対して検証し、ambiguous / missing状態を成功扱いしない。
5. S2 Runtime Ground Truthの24 Message、role / marker order、同一本文別Message、remount dedupを再現確認対象とする。
6. S3 Runtime Ground Truthの8 Message、3 User shape、4 Assistant root、START / END boundary、turn-level group境界を再現確認対象とする。
7. PoC結果とConversation completenessを分離し、TASK-001 PoC単独でgeneral completeを宣言しない。
8. Runtime Ground TruthとGit commit可能な匿名化Evidenceを分離し、raw本文、URL、Conversation / Message / turn IDを永続化しない。
9. 実装開始は別途明示承認を受ける。今回のCandidate Decisionではコードを書かない。

### Decision limitations and deferred scope

このDecisionは現在のChrome / ChatGPT UIで観察したS2 / S3とS3 reload recheckに限定したPhase 0 PoC strategyである。Production互換性、general completeness、branch / edit semantics、ContentBlock変換を保証せず、TV-001 Final Verdictを確定しない。

---

## TV-001 Minimal PoC Result — 2026-08-15

### Status

- Execution status: **STOPPED ON BLOCKING ISSUE**
- Candidate Decision v1: **FAIL**
- Minimal PoC v1: **FAIL**
- TV-001 Final Verdict: **NOT SET**
- TV-001 Final Verdict recommendation: `INSUFFICIENT EVIDENCE`
- Current execution labels:
  - S1: 24 Message case（過去EvidenceではS2と呼称）
  - S2: short Standard Chat
  - S3: User shape / Rich Assistant boundary case

### PoC implementation scope

実装は`spikes/TASK-001-standard-chat-dom/poc/`に限定した。

- `tv001-poc.mjs`
  - mounted M-02 capture
  - `data-message-id` runtime dedup
  - `data-turn-id` cross-check
  - `conversation-turn-N` ordering
  - `data-message-author-role` validation
  - 3種類のUser shape dispatch
  - Assistant unique Markdown root capture
  - Fail Closed violations
  - in-memory accumulator / Ground Truth comparator
- `tv001-poc.selftest.mjs`
  - remount dedup
  - ordering
  - same-content / distinct runtime identity保持
  - runtime identity conflict detection
  - Ground Truth comparison
- `README.md`
  - Scope、禁止事項、実行方法

Production Source Adapter、`src/`、Production fallback、general completeness、ContentBlock変換は実装していない。

### Environment

- Date: 2026-08-15 (Asia/Tokyo)
- OS / Browser scope: Windows / connected Google Chrome Desktop
- Chrome Version: 151.0.7922.109
- ChatGPT UI build: not captured / unavailable
- PoC runtime: Node.js v24.14.1 + authenticated Chrome tab read-only DOM capture

### Executed commands / checks

| Command / action | Result |
|---|---|
| `node --check spikes/TASK-001-standard-chat-dom/poc/tv001-poc.mjs` | PASS |
| `node spikes/TASK-001-standard-chat-dom/poc/tv001-poc.selftest.mjs` | PASS |
| S3 preflight `captureMountedTurns` | 8 mounted / 8 captured / violations 0 |
| S1 initial `captureMountedTurns` | 5 mounted / 4 captured / violations 1 |

S3 preflightはbrowser capture関数の実画面実行確認であり、S3 Ground Truth validation完了とは扱わない。

### Blocking Issue

- Code: `USER_CONTENT_AMBIGUOUS`
- Case: S1
- Location alias: observed turn ordinal 23（raw Message / turn IDは保存していない）
- Evidence:
  - initial mounted turn count: 5
  - successfully captured Message count: 4
  - Fail Closed violation count: 1
  - exactly 1 collapsible content branchまでは認識したが、Candidate Decisionが要求するMarkdown=1/plain=0またはMarkdown=0/plain=1のどちらにも一意にdispatchできなかった
- No workaround applied:
  - User role node全体へfallbackしていない
  - 未観察selector / attributeを追加していない
  - ambiguous candidateを優先順位で選択していない
  - Blocking検出後の追加DOM探索を行っていない

### S1 Result

- Result: `FAIL`
- Expected Count: 24
- Initial capture: 5 mounted / 4 valid captured
- Fail Closed violations: 1 (`USER_CONTENT_AMBIGUOUS`)
- Full known scan: NOT EXECUTED due Blocking Issue
- Captured unique 24 comparison: NOT EXECUTED
- Missing / unexpected duplicate / role sequence / ordinal order: NOT EVALUATED
- Same-content distinct Message: NOT RE-EVALUATED in live run
- Remount dedup: NOT RE-EVALUATED in live run

S1の1 User Messageを承認済みUser dispatchで取得できなかったため、FR-009 / TV-001のPoC成功条件を満たさない。

### S2 Result

- Result: `NOT EXECUTED`
- Reason 1: S1 Blocking Issue検出後に実画面検証を停止した
- Reason 2: 今回の依頼にはshort S2の独立したExpected Count / role sequence / marker Ground Truthが明記されておらず、DOM観察値をGround Truthとして自己承認しない

### S3 Result

- Result: `NOT EXECUTED`
- Preflight only: 8 mounted / 8 captured / violations 0
- Full Ground Truth comparison、shape count、Rich boundary assertion: NOT EXECUTED after S1 Blocking Issue

### Fail Closed results

- Detected blocking invariant: PASS
  - ambiguous User contentを成功扱いせず停止した
  - confirmed fallbackなしの方針を維持した
- Candidate Decisionの全14 invariantに対するlive negative-path coverage: NOT EXECUTED
- General Conversation completeness: NOT EVALUATED / TASK-003

### Requirement / ADR / Risk impact

- FR-005 / ADR-004: DOM固有ロジックをSpike moduleへ限定し、Production codeへ漏らしていない。
- FR-009: 現行Candidate DecisionではS1の全User / Assistant Messageを抽出できず、PoC成功条件未達。
- ADR-006 / NFR-001: ambiguous User shapeでFail Closedし、Silent omissionを回避した。
- RISK-001: Standard Chat内でも観察済み3-shape dispatchと一致しないUser DOMが現れ、DOM変更 / shape variation riskが実在化した。

### Known limitations

- `USER_CONTENT_AMBIGUOUS`の詳細subcondition（Markdown / plainの双方存在、双方0、またはいずれか複数）は、停止指示に従い追加観察していない。
- S1 full scan、S2、S3 full validationを完了していない。
- Runtime accumulatorのpure self-testはPASSしたが、S1 live accumulationには到達していない。
- TV-001 Final Verdictは正式変更していない。

### Deferred findings

#### TASK-003

- general completeness / settled condition
- virtualization一般解
- viewport / scroll variation
- 50 / 100 / 200 Message級

#### TASK-004

- branch / regenerate / edited Message
- branch / edit時のRuntime capture / dedup identity semantics

#### TASK-005

- code Copy等の本文subtree内UI分類
- Saved / Ignored / Unsupported
- ContentBlock変換

### TV-001 Final Verdict recommendation

`INSUFFICIENT EVIDENCE`

Reason: Candidate Decision v1 / Minimal PoC v1は、S1のmounted User Message 1件を一意に取得できずFAILした。Fail Closed自体はADR-006に整合するが、S1 / S2 / S3 full validationは未完了であり、focused observationに基づくCandidate Decision修正余地が残る。このためTV-001自体のPASS / FAILを推奨するにはEvidenceが不足している。Evidence上の正式な`TV-001 Final Verdict: NOT SET`を維持する。

### Next Action

1. Blocking Issueをレビューする。
2. 明示承認後、S1 ordinal 23だけを対象に匿名化したfocused structural observationを行い、`USER_CONTENT_AMBIGUOUS`のsubconditionを特定する。
3. Evidenceに基づいてUser Content Candidate Decisionを再審議する。fallbackを推測追加しない。
4. short S2のRuntime Ground Truthを明示する。
5. Candidate Decision / PoCを必要最小限修正後、S1 / S2 / S3を最初から再実行する。

---

## TV-001 Focused Observation — S1 ordinal 23 — 2026-08-15

### Scope and security

- Scope: S1 ordinal 23のUser Messageのみ
- Purpose: Minimal PoC v1の`USER_CONTENT_AMBIGUOUS` subconditionを匿名化したstructural observationで特定する
- Persisted data: count、tag、parent / child / ancestor関係、本文全体包含の比較結果、匿名markerのboundary比較結果のみ
- Not persisted: raw本文、raw URL、Conversation ID、Message ID、turn ID、page HTML、DOM snapshot、cookie、token、browser storage
- Selector / fallback / User dispatch implementation: **NOT CHANGED**

### Observed structure

| Observation | Result |
|---|---|
| Target turn / role | ordinal 23 / Userを一意に特定 |
| Collapsible root count | 1 |
| Collapsible content count | 1 |
| Collapsible toggle count | 1 |
| Root / content / toggle boundary | rootはcontentとtoggleを包含。contentはtoggleを包含しない |
| `.markdown` candidate count | 0 |
| `.whitespace-pre-wrap` candidate count | 2 |
| Root-most plain candidate count | 1 |

Plain candidateの匿名化した比較:

| Candidate alias | Tag | Position | Whole body coverage | Anonymous marker relation |
|---|---|---|---|---|
| P0 | `div` | collapsible contentのdirect child、depth 1 | normalized textがcollapsible content全体と一致。本文全体を包含 | 既知U11 markerを包含。marker自体はcandidate先頭 / 末尾ではない |
| P1 | `pre` | P0のdirect child、collapsible contentからdepth 2 | normalized textがcollapsible content全体と不一致。本文全体は包含しない | 既知U11 markerを包含しない |

Candidate間の関係:

- P0とP1は別elementである。
- P0はP1を包含し、P1はP0を包含しない。
- P0とP1はdirect parent / childであり、同じparentを持つsiblingsではない。
- `.markdown` candidateは存在しないため、「Markdown root内部にplain candidateがある」caseではない。
- `.whitespace-pre-wrap`に一致する2 elementは存在するが、本文全体を表す競合rootが2つ存在するcaseではない。本文全体を包含する外側P0と、その一部を表す内側P1のnested matchである。

Ground Truth boundary:

- S1 ordinal 23には、S3 Long Userのようなpaired START / END markerはRuntime Ground Truthとして提供されていない。
- 既知U11 markerはcollapsible contentとP0に存在したが、content / P0の先頭または末尾そのものではなかった。
- P1には既知U11 markerが存在しなかった。

### Impact on Candidate Decision v1

- `USER_CONTENT_AMBIGUOUS`のsubconditionは`Markdown=0 / plain=2`であった。
- Minimal PoC v1は、collapsible content配下の`.whitespace-pre-wrap` descendantをすべて同格candidateとして数えたためFail Closedした。
- Fail Closed動作はADR-006 / NFR-001に整合し、ambiguousな候補を黙って採用しなかった。
- 一方、S1 ordinal 23ではplain class tokenが本文全体rootだけでなくnested `pre`にも付与されるため、Candidate Decision v1の「plain candidate exactly 1」をdescendant countで実装する戦略はFR-009 / RISK-001に対してfalse negativeを生じる。
- Observationはroot-most / containment-awareなcandidate scopingを再検討する材料になるが、このRoundでは新しいselector、fallback、dispatch優先順位を採用しない。
- Candidate Decision v1: **FAIL**
- Minimal PoC v1: **FAIL**
- TV-001 Final Verdict: **NOT SET**
- TV-001 Final Verdict recommendation: `INSUFFICIENT EVIDENCE`

S1 / S2 / S3 full validationは再実行していない。Focused observationはCandidate Decision修正材料であり、TV-001の最終結果ではない。

### Ground Truth comparator review

Current implementation:

- `compareGroundTruth`は`expectedOrdinals`が未指定の場合、`expectedCount`から暗黙に`1..N`を生成する。
- 生成したsequenceとaccumulated Messageのordinalをexact matchで比較する。

Decisionとの整合性:

- Candidate Decisionはordinalのunique / orderableとDOM orderとの整合を要求するが、ordinal gap自体はfailureにしない。
- したがって、`expectedOrdinals`未指定時に`expectedCount`だけから`1..N`を合成する現在のdefaultはCandidate Decisionと**矛盾する**。
- このdefaultは、Message countとrelative orderが正しくてもordinalにgapがあるcaseを誤ってorder failureにし、ordering検証とConversation completenessを混同する可能性がある。
- 明示的なRuntime Ground Truthとして`expectedOrdinals`が提供されたcaseでexact sequenceを比較すること自体は、このFindingの対象外である。
- 今回のS1停止はcapture時の`USER_CONTENT_AMBIGUOUS`で発生し、comparator実行前だったため、この不整合は既報S1 FAILの直接原因ではない。

Impact / next decision material:

- PoC comparatorは次のrevision前に、(a) exact ordinal comparisonには明示的な`expectedOrdinals`を必須とする、または(b)未指定時はunique / strictly ascendingだけを検証しexact sequence comparisonを`NOT EVALUATED`とする、のいずれかをDecisionとして選ぶ必要がある。
- General completenessやgap意味論はTASK-003へ残し、`expectedCount`からordinal continuityを推定しない。
- このRoundではcomparator実装を変更していない。

### Next Action

1. Focused observationを基にUser Content Candidate Decision v2をレビューする。
2. Comparatorの`expectedOrdinals`未指定時の契約を決定する。
3. 明示承認後にCandidate Decision / Minimal PoCを必要最小限修正する。未観察fallbackを追加しない。
4. 修正版PoCでS1 / S2 / S3 full validationを最初から実行する。

---

## TV-001 Candidate Decision v2 — 2026-08-15

### Status and traceability

- Scope: TASK-001 / TV-001 Phase 0 PoCのUser content candidate scopeとGround Truth comparator contract
- Primary Traceability: TV-001 / FR-005 / FR-009 / AT-005 / ADR-004 / RISK-001
- Fail Closed alignment: ADR-006 / NFR-001
- Candidate Decision v1: **FAIL**
- Minimal PoC v1: **FAIL**
- TV-001 Final Verdict: **NOT SET**
- TV-001 Final Verdict recommendation: `INSUFFICIENT EVIDENCE`
- PoC v2 implementation / execution: **NOT PERFORMED IN THIS DECISION ROUND**

このDecisionはFocused Observationで確認したS1 ordinal 23のcollapsible plain構造を直接反映する。新しいfallback、未観察attribute、Production selectorは追加しない。S1 / S2 / S3の名称はCurrent Test Labelsを維持する。

### Root Cause Summary

Minimal PoC v1は、collapsible content配下で`querySelectorAll(".whitespace-pre-wrap")`に一致した全descendantを同格content rootとして数えた。S1 ordinal 23では、本文全体を持つ外側P0 `div`と、その一部だけを持つ内側P1 `pre`が同じclass tokenに一致したため、`Markdown=0 / Plain=2`となった。

P0 / P1はsiblingsでもcompeting content rootsでもなく、P0がP1を直接包含するwhole-body root / nested partial matchである。したがって、v1のfalse negativeはFail Closed方針ではなく、plain candidate cardinalityをcontainment非依存のraw descendant countとして定義したことに起因する。Fail Closed方針自体は維持する。

### Candidate Decision v2

| Target | v1 | v2 Decision | Evidence | Fail Closed Rule | Limitation |
|---|---|---|---|---|---|
| Collapsible plain candidate scoping | scoped content内の全`.whitespace-pre-wrap` descendantを同格candidateとしてcount | `ADOPT FOR TASK-001 POC v2`: 同じcollapsible content内でcontainment-awareにplain root candidateを定義する | S1 ordinal 23のP0 / P1はwhole-body root / nested partialの親子関係 | raw match数だけでambiguous判定しない。root-most candidateを一意に決められなければFail Closed | 現行UIのS1 / S3 Evidenceに限定。Production selectorではない |
| Root-most plain filtering | なし | `ADOPT FOR TASK-001 POC v2`: 他のplain match ancestorを同一scope内に持たないplain matchだけをroot cardinality対象にする | S1 ordinal 23ではP0がroot-most、P1はP0配下。root-most countは1 | root-most count 0または2+でFail Closed | 同classのnested partial matchについてのみ直接Evidenceがある |
| Nested partial plain match | raw countを増やしambiguous扱い | `ADOPT FOR TASK-001 POC v2`: selected root-most plain candidate配下のnested plain matchは、それだけを理由にambiguousとしない | P1はP0のdirect childで本文の一部のみ。P0は本文全体を包含 | nested matchが存在してもselected rootのboundary cross-checkを必須とする | nested elementのContent分類は行わない。TASK-005へ越境しない |
| Whole-body boundary cross-check | collapsible plain dispatchの独立invariantなし | `CROSS-CHECK ONLY`: selected root-most plain candidateのnormalized textがscoped collapsible content全体と一致することを必須確認する | P0は一致、P1は不一致。S3 Long Userではselected plain candidateがSTARTからENDまでを包含した | selected candidateがwhole-body cross-checkを満たさなければFail Closed | text equalityはcandidate selection fallbackではない。非表示elementやsemantic変換の一般保証ではない |
| Collapsible Markdown | `.markdown` exactly 1 / plain exactly 0 | `KEEP FROM v1` | S3でunique Markdown rootがreload前後に維持され、今回のS1 Findingでは`.markdown` 0 | Markdown 0 / 2+、またはplain matchとの共存はFail Closed | Markdown内部のplain-class nested caseは未観察。推測で除外しない |
| Short plain | non-collapsible scopeでMarkdown 0 / plain exactly 1 | `KEEP FROM v1` | S3 Short plainはunique candidateとしてreload前後に成立。Focused Observationはcollapsible Userのみ | v1どおり0 / 2+、Markdownやcollapsible metadata混在でFail Closed | Short plainへroot-most ruleを一般化する直接Evidenceはない |
| Markdown / plain competing roots | 両方存在でambiguous | `KEEP FROM v1`: priorityを付けずFail Closed | Focused ObservationはMarkdown / plain競合ではなくplain同士のnested matchだった | Markdownとplainの両root候補が存在する場合はFail Closed | cross-type nested matchも未観察のunknown shapeとしてFail Closedする |
| Unknown shape fallback | confirmed fallbackなし | `KEEP FROM v1` | safe fallbackは実画面で確認されていない | User role node全体へfallbackせずFail Closed | 観察済みshape以外は取得できない可能性がある |

#### Candidate definitions

- **Root-most plain candidate**: 同じscoped content内のplain matchesのうち、別のplain match ancestorを持たないelement。
- **Nested partial match**: root-most whole-body candidateのdescendantであり、scoped content全体を表さない同class match。存在だけではambiguousとしない。
- **Ambiguous / competing roots**: root-most candidateが2件以上あり、互いを包含せず本文rootとして競合する状態。Fail Closedする。
- Root-most filteringは同じ観察済みplain class tokenのcandidate scopeを精密化するものであり、新しいfallbackではない。

### User Content Dispatch v2

共通invariantはv1を維持する。M-02内のexactly 1 User role nodeをboundary anchorとし、content candidateはturn-level operation groupを包含してはならない。

Pseudo logic:

1. User role node内のcollapsible root / content / toggle cardinalityを確認する。
2. **Collapsible contentがexactly 1の場合**:
   1. collapsible root=1、toggle=1、rootがcontentとtoggleを包含し、contentがtoggleを包含しないことを要求する。
   2. scoped collapsible content内でMarkdown raw matchesとplain raw matchesを取得する。
   3. plain raw matchesから、別plain match ancestorを持つnested matchesをroot cardinality対象外とし、root-most plain candidatesを得る。
   4. Markdown raw matches=1かつplain raw matches=0なら、v1どおりCollapsible Markdownとして採用する。
   5. Markdown raw matches=0かつroot-most plain candidates=1なら、Collapsible plain候補とする。
   6. 選択したplain candidateについて、scoped contentのdescendantであることとnormalized text equalityをwhole-body cross-checkする。一致しなければFail Closedする。
   7. Markdownとplainが共存、Markdownが2+、root-most plainが0 / 2+、またはcross-type containmentしか説明できない場合はFail Closedする。
3. **Collapsible contentが0の場合**:
   - v1のShort plain dispatchを維持する。collapsible root / toggleなし、Markdown=0、plain raw match=1を要求する。
   - root-most filteringやcollapsible whole-body equalityをShort plainへ一般化しない。
4. **その他**:
   - unknown / ambiguous shapeとしてFail Closedする。
   - User role node全体、nested partial match、または別shapeをfallbackとして選ばない。

### Ground Truth Comparator Contract v2

#### Contract inputs

- `expectedCount`: Runtime Ground Truthとして明示されたMessage count。count comparisonにのみ使用し、ordinal sequence生成へ使用しない。
- `expectedRoles`: 提供された場合、runtime ordering sourceで整列したMessage列のrole sequenceとexact comparisonする。
- `expectedMarkers`: 提供された場合、同じ整列済みMessage列のmarker sequenceとexact comparisonする。未提供時はmarker comparisonを`NOT EVALUATED`とする。
- `expectedOrdinals`: optionalなRuntime Ground Truth。提供時だけordinal sequenceをexact comparisonする。

`expectedOrdinals`を提供する場合、PoC validation inputとしてexpected countと同数、positive safe integer、unique、strictly ascendingを要求する。gapは許容する。入力自体がこのcontractを満たさない場合はGround Truth input errorとして検証を停止し、TV-001 DUTのFAILと混同しない。

#### Comparator outputs

単一の`orderMatches` booleanはexact ordinal comparison、relative Message order、未評価を混同するため、PoC v2 contractでは`REJECT`する。次の独立状態へ分離する。

| Output | Type / states | Meaning |
|---|---|---|
| `countMatches` | `true / false` | captured unique countと`expectedCount`の一致 |
| `roleSequenceMatches` | `true / false / null` | expected rolesとのexact sequence比較。未提供なら`null` |
| `markerSequenceMatches` | `true / false / null` | expected markersとのexact sequence比較。未提供なら`null` |
| `ordinalSequenceMatches` | `true / false / null` | expected ordinalsとのexact sequence比較。未提供なら`null` |
| `runtimeOrderingValid` | `true / false` | ordinalがunique / orderableで、各mounted snapshotのDOM order cross-checkと矛盾しないこと |

`null`は`NOT EVALUATED`を意味し、PASSとして扱わない。PoC caseのMessage sequence結果は、caseで明示されたrole / marker Ground Truthの各比較結果と`runtimeOrderingValid`を個別に示す。単一aggregate booleanから不足したGround Truthを推測しない。

#### expectedOrdinals provided

- 明示sequenceと、primary runtime ordering sourceで整列したMessage ordinal sequenceをexact comparisonする。
- 一致なら`ordinalSequenceMatches=true`、不一致なら`false`。
- 例としてgapを含む明示sequenceが双方で一致した場合は`true`であり、gap自体をfailureにしない。

#### expectedOrdinals not provided

- `expectedCount`から`1..N`を生成しない。
- `ordinalSequenceMatches=null`、Evidence表現は`NOT EVALUATED`とする。
- runtime ordinalはMessageのsort keyとidentity / order cross-checkに使うが、continuity、first / last、general completenessを推定しない。

#### Message sequence and completeness boundary

- Relative Message orderは、runtime ordinalで整列した列に対するrole sequence / marker sequence comparisonと、各mounted snapshotのDOM-order cross-checkで評価する。
- `countMatches=true`は提供されたRuntime Ground Truth countとの一致だけを意味し、Ground Truthなしのgeneral completenessを意味しない。
- ordinal gap、continuity、settled condition、Ground Truthなしのcomplete判定はTASK-003へ残す。

### Fail Closed v2

#### Changed for collapsible plain User

- root-most plain candidate=0: Fail Closed。
- root-most plain candidate=2+: competing rootsとしてFail Closed。
- selected root-most plain candidateがscoped contentのdescendantでない、またはwhole-body normalized text equalityを満たさない: Fail Closed。
- nested partial plain matchがselected whole-body root内に存在するだけではFail Closedしない。
- Markdown / plainの両root候補が存在する: Fail Closed。
- cross-type nested matchは未観察のunknown shapeとしてFail Closed。

#### Kept from v1

- User role node、collapsible root / content / toggle、role、runtime identity、turn cross-check identity、ordinal、DOM orderの既存cardinality / consistency invariantを維持する。
- Collapsible MarkdownはMarkdown exactly 1 / plain 0を要求する。
- Short plainはv1の非collapsible cardinality規則を維持する。
- content candidateはturn-level operation groupを包含してはならない。
- unknown shapeはFail Closedし、User role node全体へfallbackしない。
- General Conversation completenessをUser content dispatchやordinal continuityから推定しない。

### Blocking / Non-blocking Questions

#### Blocking for PoC v2 implementation start

- None. S1 Focused Observationはcollapsible plainのroot-most filteringとwhole-body cross-checkをPoC v2で実装するのに十分な直接Evidenceを持つ。Markdown / Short plainは変更しないため、未観察一般化を必要としない。

#### Blocking before full S1 / S2 / S3 validation completion

- S2 short Standard ChatのExpected Message Count、Expected role sequence、必要な匿名marker / boundary Ground TruthがEvidence上で未確定である。S2を自己観察値でPASSにしないため、S2実行前にRuntime Ground Truthを明示する必要がある。

#### Non-blocking

- Short plainにもnested same-class matchが存在し得るかは未確認。v2ではv1を維持し、発生時はFail Closedする。
- Markdown内部またはplain内部にcross-type class matchが存在するcaseは未確認。priorityや除外規則を推測追加しない。
- normalized text equalityはPhase 0 plain boundary cross-checkであり、Canonical Normalization、ContentBlock変換、本文subtree内UI分類を保証しない。
- class tokenとDOM構造の将来ChatGPT UI buildにおける長期安定性は未確定。

### PoC v2 Entry Criteria

1. 次の実装ターンで明示承認を受け、変更を`spikes/TASK-001-standard-chat-dom/poc/`へ限定する。
2. User content変更はcollapsible plainのroot-most filteringとwhole-body cross-checkだけに限定し、Collapsible Markdown / Short plainへ未観察一般化を行わない。
3. Comparator変更は暗黙の`1..N`生成を除去し、comparison statesを上記contractどおり分離することに限定する。
4. self-testへ少なくとも以下を追加してから実画面を再実行する。
   - outer whole-body plain + nested partial plainを一意にaccept
   - root-most plain 0 / 2+をFail Closed
   - selected plainのwhole-body cross-check mismatchをFail Closed
   - Collapsible Markdown / Short plainのv1 behaviorを維持
   - explicit gapped `expectedOrdinals`のexact match
   - `expectedOrdinals`未指定時の`ordinalSequenceMatches=null`
5. S1 / S3は既存Runtime Ground Truthを使用し、S2は実行前に独立したRuntime Ground Truthを明示する。
6. S1 / S2 / S3を修正版PoCで最初から再実行し、v1結果を上書きせずPoC v2 resultとして追記する。
7. Runtime Ground TruthとCommit Evidenceを分離し、raw本文、raw URL、Conversation / Message / turn IDを永続化しない。
8. TV-001 Final VerdictはPoC v2結果レビューまで`NOT SET`、Recommendationは`INSUFFICIENT EVIDENCE`を維持する。

### Decision limitations

Candidate Decision v2は現在のChrome / ChatGPT UIで観察したS1 ordinal 23と既存S3 Evidenceに限定したPhase 0 PoC strategyである。Production fallback chain、general completeness、branch / edit identity semantics、本文subtree内UI分類、ContentBlock変換を決定しない。

## TV-001 Minimal PoC v2 Result — 2026-08-15

### Status

- Execution status: **STOPPED ON NEW BLOCKING ISSUE**
- Candidate Decision v2: **APPROVED**
- Minimal PoC v2: **FAIL**
- TV-001 Final Verdict: **NOT SET**
- TV-001 Final Verdict Recommendation: **INSUFFICIENT EVIDENCE**

S2で新しいFail Closed violationを検出したため、Stop Conditionsに従って未観察fallbackやselectorを追加せず、S1 / S3のfull scanを開始する前に実画面検証を停止した。S1 / S3のinitial captureはpreflight evidenceとしてのみ記録し、full validationのPASSには使用しない。

### Implementation diff summary

- PoC revisionを`tv001-minimal-poc-v2`へ更新した。
- Collapsible plain Userについて、raw `.whitespace-pre-wrap` matchesから、別のplain match ancestorを持たないroot-most candidatesだけをroot cardinality対象とした。
- selected root-most plain candidateとscoped collapsible contentのvisible textを、CRLFからLFおよび単独CRからLFへの変換だけで比較するwhole-body boundary invariantを追加した。
- Collapsible MarkdownおよびShort plain Userのv1 dispatchは変更していない。
- Comparatorから`expectedCount`を使った暗黙の`1..N` ordinal生成を削除し、comparison stateを`countMatches`、`roleSequenceMatches`、`markerSequenceMatches`、`ordinalSequenceMatches`、`runtimeOrderingValid`へ分離した。
- `expectedOrdinals`が指定された場合だけexact ordinal comparisonを行い、input validation違反を`GROUND_TRUTH_INPUT_ERROR`としてDUT failureと分離した。
- Production abstraction、general scroll / settled / completeness algorithm、fallback chainは追加していない。

### Environment

- Date: 2026-08-15 (Asia/Tokyo)
- OS / Browser scope: Windows / connected Google Chrome Desktop
- Chrome Version: 151.0.7922.109
- ChatGPT UI build: not captured / unavailable
- PoC runtime: Node.js v24.14.1 + authenticated Chrome tab read-only DOM capture

### Self-test result

- Result: **PASS**
- Command: `node spikes/TASK-001-standard-chat-dom/poc/tv001-poc.selftest.mjs`
- Syntax checks: both PoC modules **PASS** with `node --check`.
- Confirmed root-most behavior:
  - outer whole-body plain + nested partial plain: root-most 1, accepted
  - independent root-most plain candidates 2: Fail Closed
  - root-most plain candidates 0: Fail Closed
  - selected rootとscopeのboundary text mismatch: Fail Closed
  - boundary normalizationは改行コードだけを変換し、space、tab、末尾空白を保持
- Existing behavior regression: remount dedup、same-content distinct Message、runtime identity conflict、ordering checksを維持。
- Comparator coverage: explicit contiguous ordinals、explicit gapped ordinals、expectedOrdinals未指定、invalid expectedOrdinals、role sequence、marker sequenceを確認。

### S1 result — 20+ Message / 24 Message case

- Case result: **NOT EXECUTED — FULL VALIDATION STOPPED**
- Runtime Ground Truth: Expected Count 24、User / Assistant 12組、既存marker sequence、同一内容の別Messageあり。
- Preflight initial captureのみ実施:
  - mounted M-02 turns: 5
  - captured without violation: 5
  - observed ordinal aliases: 20–24
  - Fail Closed violations: 0
  - ordinal 23: Candidate Decision v2で安全にcaptureできた
- 24 unique Messageの累積、role / marker sequence、remount dedup、same-content distinct Messageのfull comparisonは、新しいS2 Blocking Issue検出後のStop Conditionにより実施していない。
- General completenessは判定していない。

### S2 result — short Standard Chat

- Case result: **FAIL**
- Runtime Ground Truth:
  - Expected Count: 8
  - Expected Roles: `user, assistant, user, assistant, user, assistant, user, assistant`
  - Expected Markers: not provided; marker comparisonは`NOT EVALUATED`
  - Expected Ordinals: not provided; exact ordinal sequence comparisonは`NOT EVALUATED`
- Initial mounted snapshot:
  - mounted M-02 turns: 5
  - captured before Fail Closed exclusion: 3
  - captured ordinal aliases: 5, 7, 8
  - Fail Closed violations: 2
- Repeat captureでも同じ2 violationsを再現した。

#### Blocking Issue

- Error / Violation Code: `ASSISTANT_CONTENT_CARDINALITY`
- Case / ordinal aliases: S2 ordinal 4 and S2 ordinal 6
- Anonymous structural evidence for each affected turn:
  - mounted M-02 section: present
  - author role node count: 1
  - observed role: assistant
  - author node visible text: non-empty
  - `.markdown` candidate count inside the author role node: 2
  - candidate tags: `div`, `div`
  - turn-level operation group count: 1
  - author role node does not contain the turn-level operation group
- Candidate Decision v2 impact: Assistant content rootの`exactly 1` invariantを満たさず、confirmed fallbackなしのためFail Closedした。現Evidenceだけでは、2 candidatesがnested duplicate matchか、互いに競合するcontent rootsかを判定できない。Candidate Decisionをその場で変更する根拠はない。
- Recommended focused observation: S2 ordinal 4 / 6だけを対象に、2つの`.markdown` candidatesのtag、parent / child / ancestor / sibling関係、各candidateのwhole-body包含、turn-level operation groupとの境界を匿名化して確認する。
- S2のcount、role sequence、runtime marker sequenceのfull comparisonはcapture failureにより完了していない。

### S3 result — Rich Content / Content Boundary case

- Case result: **NOT EXECUTED — FULL VALIDATION STOPPED**
- Runtime Ground Truth: Expected Count 8、role sequence `U,A,U,A,U,A,U,A`、観察済み3 User shapes、4 Assistant Markdown roots、Rich Assistant START / ENDおよび各rich structure。
- Preflight initial captureのみ実施:
  - mounted M-02 turns: 8
  - captured without violation: 8
  - observed ordinal aliases: 1–8
  - Fail Closed violations: 0
- Short plain、Collapsible plain、Collapsible Markdown、Rich Assistant content boundary、operation UI boundaryのfull Ground Truth comparisonは、新しいS2 Blocking Issue検出後のStop Conditionにより再実行していない。
- ContentBlock変換と本文subtree内UIの一般的除外は行っていない。

### Comparator v2 result

- Contract self-test: **PASS**
- `expectedOrdinals` provided:
  - contiguous exact sequence: evaluated
  - gapped exact sequence: evaluated; gap自体をfailureにしない
  - invalid length、non-positive / unsafe integer、duplicate、non-ascending input: `GROUND_TRUTH_INPUT_ERROR`
- `expectedOrdinals` not provided: `ordinalSequenceMatches=null` / `NOT EVALUATED`; `expectedCount`からordinalを生成しない。
- role / marker Ground Truthが未提供の場合、それぞれ`null` / `NOT EVALUATED`とし、PASS扱いしない。
- `runtimeOrderingValid`はruntime ordinalのparse、uniqueness、orderability、mounted snapshot DOM-order cross-checkだけを表し、general completenessを表さない。
- S1 / S2 / S3のlive full comparisonは、S2 captureがFail Closedしたため完了していない。

### Fail Closed result

- Result: **PASS** for the intended Fail Closed behavior.
- S2のAssistant Markdown content rootが2件であった2 turnsをsilent selectionせず、いずれも`ASSISTANT_CONTENT_CARDINALITY`として停止した。
- 未観察fallback、候補priority、追加selector、User / Assistant role node全体へのfallbackは追加していない。
- S1 preflightのordinal 23では、nested partial plain matchをroot cardinalityから除外しつつwhole-body boundaryをcross-checkし、安全にcaptureできた。
- General Conversation completeness failureとは扱っていない。

### Repository and security checks

- Changes are limited to the four approved files under `spikes/TASK-001-standard-chat-dom/`.
- Production `src/`: no changes.
- Source-of-Truth `docs/`: no changes.
- `git diff --check`: PASS.
- Evidence / PoC scan for raw ChatGPT URL、UUID-shaped runtime IDs、known Conversation IDs、cookie、token、authorization data: no match.
- Raw Message / turn identifiers、raw本文、page HTML、DOM snapshot、browser storageをEvidenceへ保存していない。

### Known limitations

- S1 / S3はpreflight snapshotだけで、full scan / Ground Truth comparisonを完了していない。
- S2 Assistantに観察された2つのMarkdown candidatesのcontainment関係とwhole-body coverageは未確認。
- PoCのclass tokenとstructural candidatesは現在のChrome / ChatGPT UIで観察した範囲に限定され、長期安定性を保証しない。
- S2 markersおよび全casesのexpected ordinalsは提供されていないため、該当comparisonは`NOT EVALUATED`である。
- Ground Truthなしのgeneral completenessは解決していない。

### Deferred findings

#### TASK-003

- general completeness、settled condition、virtualization一般解、dynamic scroll height、viewport / scroll-step variation、50–200 Message級。

#### TASK-004

- branch、regenerate、edited Message、branch / edit時のruntime identity semantics。

#### TASK-005

- code block内Copy等の本文subtree内UI分類、Saved / Ignored / Unsupported、ContentBlock変換、一般的UI除外。

### TV-001 Final Verdict Recommendation

- Recommendation: **INSUFFICIENT EVIDENCE**
- TV-001 Final Verdict: **NOT SET**

Minimal PoC v2はS2の観察済みAssistant candidate strategyを再現できずFAILした。一方、S1 / S3 full validationはStop Conditionにより未完了であり、S2の2 Markdown matchesがnested relationshipかtrue competing rootsかも未確定である。FR-005 / FR-009およびRISK-001に対するTV-001の最終評価には、focused observationとEvidenceに基づくCandidate Decisionの再審議後、S1 / S2 / S3を最初から再実行する必要がある。正式Verdictは変更しない。

### Next Action

S2 ordinal 4 / 6のMarkdown candidatesだけをfocused observationし、containmentとwhole-body boundaryを匿名化Evidenceとして確認する。その結果からAssistant content candidate scopingのDecisionを再審議する。推測fallbackを追加せず、承認後にMinimal PoCの次revisionとS1 / S2 / S3 full validationを行う。

---

## TV-001 Focused Observation — S2 Assistant Markdown Candidates — 2026-08-15

### Scope and security

- Scope: S2 ordinal 4 / ordinal 6のAssistant Messageのみ
- Purpose: 各turnで観察された2つの`.markdown` matchesがnested matches、competing roots、duplicate equivalent roots、またはその他のいずれかを匿名化した構造観察で分類する
- Normalization: `CRLF`から`LF`、単独`CR`から`LF`だけを変換。trim、whitespace collapse、space / tab normalization、line joining、semantic normalizationは行っていない
- Persisted data: ordinal / candidate alias、count、tag、depth、containment、normalized text comparison、semantic element count、UI containment booleanのみ
- Not persisted: raw本文、raw URL、Conversation ID、Message ID、turn ID、page HTML、DOM snapshot、cookie、token、browser storage
- Selector / Candidate Decision / fallback / PoC implementation: **NOT CHANGED**
- S1 / S2 / S3 full validation: **NOT EXECUTED**

### S2 ordinal 4 structure

#### Candidate cardinality and relationship

| Observation | Result |
|---|---|
| Role | assistant |
| Author role node count | 1 |
| `.markdown` raw match count | 2 |
| Root-most `.markdown` candidate count | 1 |
| M0 contains M1 | true |
| M1 contains M0 | false |
| Direct parent / child between candidates | neither; M1 is a non-direct descendant of M0 |
| Relative depth from M0 to M1 | 5 ancestor steps |
| Same direct parent | false |
| Siblings | false |
| Independent roots | false |

| Candidate | Tag | Depth from author role node | Direct parent tag | Root-most | Visible text non-empty | Text equals author node | Text equals other candidate | Text coverage relationship |
|---|---|---:|---|---|---|---|---|---|
| M0 | `div` | 2 | `div` | true | true | true | false | whole-author visible text candidate; contains M1 |
| M1 | `div` | 7 | `div` | false | true | false | false | normalized visible text is contained in M0 and represents only part of M0 |

#### Semantic structure coverage

| Candidate | `p` | `ul` | `ol` | `blockquote` | `pre` | `a` | `strong` | `em` | inline `code` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| M0 | 142 | 11 | 8 | 0 | 4 | 0 | 4 | 0 | 1 |
| M1 | 130 | 11 | 8 | 0 | 0 | 0 | 0 | 0 | 1 |

#### UI boundary

| Observation | M0 | M1 |
|---|---|---|
| Contains turn-level operation group | false | false |
| Contains button | true | false |
| Contains other observed form / `role=button` control | false | false |

Turn section内のturn-level operation group countは1で、author role node外に存在した。M0内のbuttonの存在だけを記録し、本文UIの一般分類・除外規則は決定していない。

### S2 ordinal 6 structure

#### Candidate cardinality and relationship

| Observation | Result |
|---|---|
| Role | assistant |
| Author role node count | 1 |
| `.markdown` raw match count | 2 |
| Root-most `.markdown` candidate count | 1 |
| M0 contains M1 | true |
| M1 contains M0 | false |
| Direct parent / child between candidates | neither; M1 is a non-direct descendant of M0 |
| Relative depth from M0 to M1 | 5 ancestor steps |
| Same direct parent | false |
| Siblings | false |
| Independent roots | false |

| Candidate | Tag | Depth from author role node | Direct parent tag | Root-most | Visible text non-empty | Text equals author node | Text equals other candidate | Text coverage relationship |
|---|---|---:|---|---|---|---|---|---|
| M0 | `div` | 2 | `div` | true | true | true | false | whole-author visible text candidate; contains M1 |
| M1 | `div` | 7 | `div` | false | true | false | false | normalized visible text is contained in M0 and represents only part of M0 |

#### Semantic structure coverage

| Candidate | `p` | `ul` | `ol` | `blockquote` | `pre` | `a` | `strong` | `em` | inline `code` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| M0 | 320 | 27 | 0 | 1 | 3 | 0 | 4 | 0 | 27 |
| M1 | 291 | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 26 |

#### UI boundary

| Observation | M0 | M1 |
|---|---|---|
| Contains turn-level operation group | false | false |
| Contains button | true | false |
| Contains other observed form / `role=button` control | false | false |

Turn section内のturn-level operation group countは1で、author role node外に存在した。M0内のbuttonの存在だけを記録し、本文UIの一般分類・除外規則は決定していない。

### Cross-case comparison

| Comparison | S2 ordinal 4 | S2 ordinal 6 | Result |
|---|---|---|---|
| Raw `.markdown` matches | 2 | 2 | MATCH |
| Root-most matches | 1 | 1 | MATCH |
| Containment | M0 contains M1 | M0 contains M1 | MATCH |
| Direct relationship | non-direct ancestor / descendant | non-direct ancestor / descendant | MATCH |
| Candidate depth | M0=2, M1=7 | M0=2, M1=7 | MATCH |
| Whole-body pattern | M0 equals author; M1 partial | M0 equals author; M1 partial | MATCH |
| Candidate text equality | M0 != M1 | M0 != M1 | MATCH |
| Turn-level group boundary | outside M0 / M1 | outside M0 / M1 | MATCH |
| Button pattern | M0=true, M1=false | M0=true, M1=false | MATCH |

Semantic elementの具体的countはMessage内容に応じて異なるが、両turnともM0がM1より広いsemantic structureを包含した。特に両turnでM0に`pre`と`strong`が存在し、M1では0だった。ordinal 6ではM0だけが`blockquote`を包含した。

### Root Cause Classification

- S2 ordinal 4: **A. NESTED MATCH**
- S2 ordinal 6: **A. NESTED MATCH**

両turnともM0がM1を包含し、M0のnormalized visible textがauthor role node全体と一致した。M1はM0内のnon-direct descendantで、normalized visible textはM0の一部に含まれるがauthor全体とは一致せず、semantic coverageもM0より狭かった。したがって、互いに独立したcompeting rootsでも、独立したduplicate equivalent rootsでもない。

### Candidate Decision Impact

- Assistant candidate cardinalityをauthor role node配下のraw `.markdown` descendant countだけで定義すると、S2 ordinal 4 / 6のようなwhole-body outer root + nested partial matchをambiguousとして扱い、FR-009 / RISK-001に対するfalse negativeを生じる。
- 両turnでroot-most Markdown countが1、同一のcontainment pattern、M0 whole-author / M1 partial patternを確認したため、Assistant candidate scopeをcontainment-awareに再審議する直接Evidenceが得られた。
- 現行Assistant Decisionのraw descendant `exactly 1`規則を、次のPoC revisionでも無変更で維持することは、このS2 Evidenceと両立しない。
- Assistant Candidate Decision revisionの検討が必要である。ただし、このRoundではroot-most Markdown filtering、whole-body invariant、candidate priority、fallbackのいずれも採用していない。
- M0内にbuttonが存在するFindingは維持する。本文subtree内UIの一般的な分類・除外はTASK-005であり、Assistant root selectionのfocused observationから越境して決定しない。
- Candidate Decision v2の履歴、Minimal PoC v2のFAIL、TV-001 Final Verdict `NOT SET`、Recommendation `INSUFFICIENT EVIDENCE`は変更しない。

### Traceability impact

- TV-001 / FR-005 / FR-009 / ADR-004 / RISK-001: Assistant content root candidateのDOM固有scopingをAdapter側で再審議するEvidence。
- ADR-006 / NFR-001: PoC v2がraw candidate複数をsilent selectionせずFail Closedしたことは引き続き妥当。
- FR-010 / AT-006 / RISK-016: M0内buttonはRelated Findingのみ。一般分類はTASK-005へ維持する。

### Recommended Next Action

別の実装・観察を追加せず、今回のFocused Observationを正本としてAssistant Content Candidate Decision revisionを独立したDecision Roundで審議する。最低限、raw Markdown matches、root-most matches、whole-body boundary cross-check、0 / 2+ root-most時のFail Closed、nested partial matchの扱いを比較する。Decision承認前にPoCコードやfallbackを変更しない。

---

## TV-001 Candidate Decision v3 — Assistant Content — 2026-08-15

### Status and scope

- Scope: TASK-001 / TV-001 Phase 0 PoCのAssistant content candidate scopingのみ
- Observed Fact source: `TV-001 Focused Observation — S2 Assistant Markdown Candidates`
- Primary Traceability: TV-001 / FR-005 / FR-009 / AT-005 / ADR-004 / RISK-001
- Fail Closed alignment: ADR-006 / NFR-001
- Related Finding only: FR-010 / AT-006 / RISK-016 / TASK-005
- Candidate Decision v3: **DECIDED FOR TASK-001 POC v3**
- PoC v3 implementation / execution: **NOT PERFORMED IN THIS DECISION ROUND**
- TV-001 Final Verdict: **NOT SET**
- TV-001 Final Verdict Recommendation: **INSUFFICIENT EVIDENCE**

User Short plain、User Collapsible plain、User Collapsible Markdown、Comparator Contract v2、Runtime identity、Role source、Ordering、M-01 decisionは変更しない。新selector、fallback、Production strategyは追加しない。

### Root Cause Summary

Minimal PoC v2はAssistant author role node配下の`.markdown` raw descendantsをすべて同格content rootsとして数え、raw countがexactly 1でない場合に`ASSISTANT_CONTENT_CARDINALITY`でFail Closedした。

S2 ordinal 4 / 6では、raw matchesは各2件だったが、M0がM1を包含し、root-most matchはM0の1件だけだった。M0のnormalized visible textはauthor role node全体と一致し、M1はM0のnon-direct descendantとして本文の一部と狭いsemantic structureだけを含んだ。両turnは`A. NESTED MATCH`であり、competing rootsでもduplicate equivalent rootsでもない。

したがって、v2のfalse negativeはFail Closed方針ではなく、Assistant content root cardinalityをcontainment非依存のraw descendant countで定義したことに起因する。Fail Closed方針は維持し、cardinality scopeをcontainment-awareに改訂する。

### Assistant Candidate Decision v3

| Target | v2 | v3 Decision | Evidence | Fail Closed Rule | Limitation |
|---|---|---|---|---|---|
| Raw Markdown match count | author role node配下のraw `.markdown` countをcontent root cardinalityとし、exactly 1を要求 | `REJECT`: raw descendant count単独をroot cardinalityとして使用しない。raw setはroot-most filteringのinputと診断countとしてのみ保持 | S2 ordinal 4 / 6はraw=2だがroot-most=1で、M0 whole-body / M1 nested partial | raw=0は結果としてroot-most=0でFail Closed。raw>1だけではFail Closedしない | 観察済みclass tokenをcandidate scopeに使用するPhase 0 strategyであり、Production selectorではない |
| Root-most Markdown filtering | なし | `ADOPT FOR TASK-001 POC v3`: 同じAssistant author role node scope内の`.markdown` matchesのうち、別の`.markdown` match ancestorを持たないelementだけをroot cardinality対象にする | 両S2 turnでM0=root-most、M1=nested、root-most count=1 | root-most countはexactly 1を要求し、0 / 2+でFail Closed | S2 ordinal 4 / 6と既存S3 Evidenceに限定。別Assistant shapeの網羅性は未確認 |
| Nested partial Markdown match | raw countを増やしambiguous扱い | `ADOPT FOR TASK-001 POC v3`: selected root-most candidate配下のnested Markdown matchは、それだけを理由にambiguousとしない | M1はM0のnon-direct descendantで、author全体とは不一致、M0本文の一部、semantic coverageも狭い | nested matchの存在だけではFail Closedしない。selected rootのwhole-body / UI boundary invariantは別途必須 | nested elementを別Message、fallback root、ContentBlockとして扱わない |
| Whole-body boundary cross-check | Assistant専用のauthor text equality invariantなし | `CROSS-CHECK ONLY`: selected root-most candidateとAssistant author role nodeのvisible textをBoundary Text Normalization v2でexact comparisonする必須invariant | S2 ordinal 4 / 6でM0はauthor全体と一致し、M1は不一致 | 不一致ならFail Closed。別candidateへのfallbackやpriority selectionは行わない | S3全4 Assistantでこのexact equalityを過去Evidenceとして明示比較していない。PoC v3で再検証が必要 |
| Turn-level operation group | selected rootが包含した場合にFail Closed | `KEEP FROM v2` | S2 ordinal 4 / 6とS3でturn-level operation groupはAssistant content root外 | selected rootがturn-level operation groupを1つでも包含すればFail Closed | 本文subtree内UIの一般分類は扱わない |
| Internal button | Assistant root内code Copy buttonを既知Findingとして保持 | Root selection failureとして`REJECT`。Saved / Ignored / Unsupportedと一般除外は`DEFER` | S2 ordinal 4 / 6のM0にbutton、M1にはなし。S3 Rich Assistant root内にもcode Copy button | selected root内にbuttonが存在することだけではFail Closedしない | button等の意味分類・除外・ContentBlock変換はTASK-005 |
| Competing roots | raw Markdown count 2+でFail Closed | `ADOPT FOR TASK-001 POC v3`: root-most Markdown count 2+をtrue competing rootsの可能性としてFail Closed | S2のM0 / M1はcontainment関係がありroot-most=1で、competing rootsとの区別が可能 | root-most=2+ではpriorityで選択せずFail Closed | root-most=2+の実画面caseは未観察。negative-path contractとして採用 |
| Assistant fallback | confirmed fallbackなし | `KEEP FROM v2`: fallbackなし | 実画面で同じboundary invariantを満たす代替sourceを確認していない | root-most 0 / 2+、whole-body mismatch、turn-group containment時はFail Closed | author role node全体やnested matchへfallbackしない |

#### Root-most Markdown candidate definition

同じAssistant author role node scope内の`.markdown` matchesのうち、別の`.markdown` match ancestorを持たないelementをroot-most Markdown candidateとする。

- raw `.markdown` matchesはcandidate setを構成する。
- root-most filteringはそのcandidate setのcardinality scopeをcontainment-awareにする。
- 新selector、新attribute、新fallback、candidate priorityを追加するものではない。

#### Boundary Text Normalization v3

PoC v2 contractを変更しない。

- 許可: `CRLF`から`LF`、単独`CR`から`LF`
- 禁止: trim、whitespace collapse、space / tab normalization、line joining、semantic normalization

Whole-body comparisonはcandidate selection fallbackではなく、selected rootがAssistant author role nodeのwhole-body visible-text boundaryを表すことを検証するinvariantである。

### Assistant Dispatch v3

Pseudo logic:

1. M-02内のAssistant author role nodeをexactly 1要求する。role sourceその他のv2 invariantは変更しない。
2. Assistant author role node scope内のraw `.markdown` matchesを取得する。
3. 各raw matchについて、同じraw match集合内の別`.markdown` ancestorを持たないものだけをroot-most candidatesとする。
4. root-most candidate countを評価する。
   - 0: Assistant content rootを解決できないためFail Closed。
   - 1: そのcandidateだけをselected Assistant content root候補とする。
   - 2+: competing rootsの可能性があるためFail Closed。priorityで選ばない。
5. selected rootとAssistant author role nodeのvisible textをBoundary Text Normalization v3でexact comparisonする。不一致ならFail Closedし、別candidateへfallbackしない。
6. selected rootがturn-level operation groupを包含していないことを要求する。包含する場合はFail Closed。
7. selected root配下のnested `.markdown` matchesはroot cardinalityに含めず、別Message、fallback root、ContentBlockとして扱わない。
8. selected root内のbutton等の存在だけではroot selectionをFailさせない。存在Findingを維持し、分類・除外・変換はTASK-005へ延期する。
9. すべてのinvariantを満たしたselected rootをPoC v3のAssistant content candidateとする。

### Fail Closed v3

#### Changed for Assistant content

- raw Markdown match count単独をcontent root cardinalityとして使用しない。
- raw matchesが1件以上ある場合はcontainment-aware root-most filteringを行う。
- root-most count=0: Fail Closed。
- root-most count=2+: Fail Closed。
- root-most count=1: whole-body boundary cross-checkへ進む。
- selected rootのnormalized visible textがAssistant author role node全体と不一致: Fail Closed。
- nested partial Markdown matchの存在だけ: Fail Closedしない。
- selected root内buttonの存在だけ: Fail Closedしない。

#### Kept from v2

- Assistant author role nodeはexactly 1、roleは`assistant`を要求する。
- selected rootがturn-level operation groupを包含した場合はFail Closed。
- confirmed fallbackなし。author role node全体、nested match、別candidateへfallbackしない。
- raw match / root-most cardinalityやboundary mismatchをsilent selectionで回避しない。
- Runtime identity、turn cross-check identity、ordering、role、User dispatch、Comparator Contract v2のinvariantは変更しない。
- General Conversation completenessをAssistant root selectionから推定しない。

### S3 Compatibility Assessment

- Existing S3 Evidenceでは全4 Assistant Messageでunique Markdown content rootが観察され、reload前後で維持された。
- raw `.markdown` matchが1の場合、その1件は別Markdown ancestorを持たないためroot-most countも1となる。したがって、v3 root-most cardinalityはS3の既存unique-root strategyと論理的に矛盾しない。
- S3 Rich Assistant rootはSTART / ENDと全expected semantic structuresを包含し、turn-level operation groupを包含しなかった。このboundary関係はv3と整合する。
- S3 root内のcode Copy buttonはv3ではroot selection Failureにしないため、既存成功caseをその理由で壊さない。
- ただし、selected Markdown rootとAssistant author role nodeのnormalized visible text equalityは、既存S3 Evidenceで独立したexact comparisonとして記録されていない。既知の矛盾はないが、PoC v3のS3再実行で確認する必要がある。
- このAssessmentのための新しい実画面観察は行っていない。

### Blocking / Non-blocking Questions

#### Blocking for Minimal PoC v3 implementation start

- None. Root-most definition、cardinality、normalization、whole-body invariant、UI boundary、fallback禁止はS2 Focused Observationと既存Decisionから実装可能なレベルで確定している。

#### Non-blocking

- S3全4 Assistantでwhole-body normalized text equalityが成立するか。PoC v3のGround Truth validation対象であり、事前にPASSとは扱わない。
- S1の全Assistant turnsがraw=1またはroot-most=1となるか。PoC v3 full validationで確認し、未知shapeはFail Closedする。
- root-most=2+の実画面caseは未観察。safe priority / fallbackは推測せずFail Closed contractを維持する。
- class tokenとcontainment patternの将来ChatGPT UI buildにおける長期安定性。
- selected root内button等のSaved / Ignored / Unsupported分類と一般除外。TASK-005へ延期する。

### PoC v3 Entry Criteria

1. 次の実装ターンで明示承認を受け、変更を`spikes/TASK-001-standard-chat-dom/poc/`へ限定する。
2. PoC revisionを新しいv3として明示し、v1 / v2 Evidenceと結果を変更・削除しない。
3. 実装変更をAssistant content branchのroot-most filtering、whole-body boundary invariant、診断summaryに必要な最小差分へ限定する。
4. User Short plain、User Collapsible plain、User Collapsible Markdown、Comparator Contract v2、Runtime identity、Role source、Ordering、M-01 decisionを変更しない。
5. self-testへ少なくとも以下を追加してから実画面検証する。
   - raw=1 / root-most=1 / whole-body matchをaccept
   - outer whole-body Markdown + nested partial Markdownでraw=2 / root-most=1をaccept
   - root-most=0をFail Closed
   - independent root-most=2をFail Closed
   - selected rootのwhole-body mismatchをFail Closed
   - nested partialを別Message / fallback rootとして扱わない
   - selected rootがturn-level operation groupを包含した場合にFail Closed
   - selected root内buttonの存在だけではroot selectionをFailさせない
6. syntax checkとself-testがPASSした後、S1 / S2 / S3を既存Runtime Ground Truthで最初からfull validationする。新しいBlocking Issueでは未観察fallbackを追加せず停止する。
7. S2ではordinal 4 / 6がroot-most=1かつwhole-body matchとしてcaptureされることを確認する。
8. S3では全4 Assistantのroot-most cardinality、whole-body equality、START / END、expected structures、turn-level group boundaryを確認する。internal button分類は行わない。
9. S1 / S2 / S3の結果とgeneral completenessを分離し、TASK-003へ越境しない。
10. Runtime Ground TruthとGit commit可能な匿名化Evidenceを分離し、raw本文、URL、Conversation / Message / turn IDを永続化しない。
11. TV-001 Final Verdictは正式レビューまで`NOT SET`、Recommendationは`INSUFFICIENT EVIDENCE`を維持する。

### Decision limitations

Candidate Decision v3は現在のChrome / ChatGPT UIで観察したS2 ordinal 4 / 6のnested Markdown patternと既存S3 Evidenceに限定したPhase 0 PoC strategyである。Production selector / fallback chain、別Assistant shapeの網羅性、general completeness、branch / edit semantics、本文subtree内UI分類、ContentBlock変換を決定しない。

---

## TV-001 Minimal PoC v3 Result — 2026-08-15

### Status

- Candidate Decision v3: **APPROVED**
- Minimal PoC v3 implementation: **COMPLETE**
- Minimal PoC v3 validation: **PARTIALLY EVALUATED**
- TV-001 Final Verdict: **NOT SET**
- TV-001 Final Verdict Recommendation: **INSUFFICIENT EVIDENCE**
- Current Test Labels:
  - S1: 20+ Message / 24 Message case
  - S2: short Standard Chat
  - S3: Rich Content / Content Boundary case

S1 / S2 / S3は独立した新しいaccumulatorで最初から実行した。1 CaseのFindingで他Caseを自動中止せず、同じ未変更PoC v3で全CaseのEvidenceを収集した。harness instability、security issue、Ground Truth input corruptionは検出しなかった。

### Implementation diff summary

- PoC revisionを`tv001-minimal-poc-v3`へ更新した。
- Assistant author role node内のraw `.markdown` matchesをdiagnosticとroot-most filtering inputとして保持し、raw count exactly 1規則を廃止した。
- Candidate Decision v2と同じcontainment-aware helper定義でAssistant root-most Markdown candidatesを算出し、exactly 1を要求した。
- selected rootとAssistant author role nodeのvisible textを、`CRLF`から`LF`、単独`CR`から`LF`への変換だけでexact comparisonするwhole-body invariantを追加した。
- whole-body mismatch専用violation codeとして`ASSISTANT_CONTENT_BOUNDARY_MISMATCH`を追加した。
- nested Markdown matchはroot cardinality、別Message、fallback root、ContentBlockへ使用しない。
- selected Assistant rootがturn-level operation groupを包含する場合はFail Closedを維持し、internal buttonの存在だけではroot selectionをFailさせない。
- User dispatch、Comparator Contract v2、Runtime identity、`data-turn-id` cross-check、Role、Ordering、M-01 rejectionは変更していない。
- Production fallback、general completeness algorithm、ContentBlock変換、一般UI除外は追加していない。

### Environment

- Date: 2026-08-15 (Asia/Tokyo)
- OS / Browser scope: Windows / connected Google Chrome Desktop
- Chrome Version: 151.0.7922.109
- ChatGPT UI build: not captured / unavailable
- PoC runtime: Node.js v24.14.1 + authenticated Chrome tab read-only DOM capture
- S1 / S3 tabs were restored from the known validation Conversation locations in the authenticated Chrome session; raw locations were not persisted.

### Self-test result

- Result: **PASS**
- Syntax: `tv001-poc.mjs` and `tv001-poc.selftest.mjs` both **PASS** with `node --check`.
- Command result: `TV-001 Minimal PoC v3 self-test: PASS`
- Assistant v3 coverage:
  - raw=1 / root-most=1 / whole-body match: ACCEPT
  - outer whole-body Markdown + nested partial Markdown: raw=2 / root-most=1 / ACCEPT
  - raw=0 / root-most=0: Fail Closed
  - independent root-most=2: Fail Closed
  - whole-body mismatch: `ASSISTANT_CONTENT_BOUNDARY_MISMATCH`
  - nested partialはselected root / Messageを増やさない
  - selected rootがturn-level operation groupを包含: Fail Closed
  - selected root内internal buttonのみ: root selection ACCEPT
- Regression coverage:
  - User v2 root-most / boundary tests
  - remount dedup
  - same-content distinct runtime identities in the synthetic test
  - runtime identity conflicts
  - ordering
  - Comparator v2 contiguous / gapped ordinals
  - Ground Truth input errors

### S1 result — 20+ Message / 24 Message case

- Case result: **PARTIALLY EVALUATED**
- Technical Spike scan: initial、top、段階的top-to-bottom、bottomを同じPoC v3でcaptureし、8 snapshotsを累積した。Production general scroll / settled / completeness algorithmは実装していない。

| Check | Result |
|---|---|
| Expected Count | 24 |
| Captured unique | 24 |
| Count comparison | MATCH |
| Role sequence | MATCH |
| Approved marker sequence | MATCH |
| Runtime ordering valid | true |
| Exact ordinal sequence | NOT EVALUATED; Ground Truth未提供 |
| Missing | 0 |
| Unexpected | 0 |
| Fail Closed violations | 0 |
| Remount dedup | PASS; 50 remount observations deduplicated |
| Ordinal 23 User | CAPTURED; collapsible plain、raw plain=2、root-most=1、whole-body=true、toggle outside content |
| All 12 Assistant turns | CAPTURED; raw Markdown=1、root-most=1、whole-body=true、turn-level group outside |

#### Repeated-marker / same-content Ground Truth finding

- Repeated User alias instances: 2; runtime identities were distinct。
- Repeated Assistant alias instances: 2; runtime identities were distinct。
- Same-marker distinct Message / identity behavior: **PASS**。
- 改行だけを正規化したselected visible textのexact equality:
  - User pair: **NOT MATCH**; anonymous normalized lengths 179 / 298
  - Assistant pair: **NOT MATCH**; anonymous normalized lengths 121 / 249
- 各Messageのmarker coverage、role、ordinal、boundary invariantは成立した。
- Runtime Ground Truthは「同一内容の別Message」を期待しているが、今回のexact visible-text comparisonとは一致しなかった。marker同一性をfull-body equalityへ読み替えず、S1全体をPASSにしない。
- Raw本文をEvidenceへ保存していないため、Ground Truthがmarker equivalenceを意味するのか、full normalized visible-text equalityを意味するのかのレビューが必要である。Candidate v3のAssistant root selection failureとは判定しない。

### S2 result — short Standard Chat

- Case result: **PASS**
- Technical Spike scanで9 snapshotsを累積した。

| Check | Result |
|---|---|
| Expected Count | 8 |
| Captured unique | 8 |
| Count comparison | MATCH |
| Role sequence | MATCH (`U,A,U,A,U,A,U,A`) |
| Marker sequence | NOT EVALUATED; Ground Truth未提供 |
| Exact ordinal sequence | NOT EVALUATED; Ground Truth未提供 |
| Runtime ordering valid | true |
| Missing / unexpected | 0 / 0 |
| Fail Closed violations | 0 |
| Remount dedup | PASS; 45 remount observations deduplicated |

Focused Assistant turns:

| Ordinal alias | Raw Markdown | Root-most | Nested partial | Whole-body equality | Turn group contained | Capture |
|---:|---:|---:|---:|---|---|---|
| 4 | 2 | 1 | 1 | true | false | PASS |
| 6 | 2 | 1 | 1 | true | false | PASS |

- Internal code-related buttons were present inside both selected roots。存在だけではroot selectionをFailさせなかった。
- User content: 4 Short plain User、User boundary violations 0。

### S3 result — Rich Content / Content Boundary case

- Case result: **PASS**
- Initial and top statesの2 snapshotsを累積した。top stateでは8 turnsが同時にmountされた。

| Check | Result |
|---|---|
| Expected Count | 8 |
| Captured unique | 8 |
| Count comparison | MATCH |
| Role sequence | MATCH (`U,A,U,A,U,A,U,A`) |
| Runtime ordering valid | true |
| Marker sequence comparator | NOT EVALUATED; full sequence Ground Truth未提供 |
| Exact ordinal sequence | NOT EVALUATED; Ground Truth未提供 |
| Missing / unexpected | 0 / 0 |
| Fail Closed violations | 0 |
| User shapes | Short plain=1、Collapsible Markdown=1、Collapsible plain=2 |
| Assistant roots | 4 / 4 captured |
| Assistant root-most | 全4 turnsで1 |
| Assistant whole-body equality | 全4 turnsでtrue |
| Turn-level operation group | 全8 turnsでcontent candidate外 |

Rich Assistant boundary:

- Anonymous START / END pair: present and selected rootの先頭 / 末尾に一致。
- paragraph、bullet list、numbered list、quote、fenced code、link、bold、italic、inline code: すべてpresent。
- Code Copy button: 1。selected root / `pre`内、semantic code element外。root selectionはPASSし、一般UI分類は実施していない。

Long User boundary:

- Anonymous START / END pair: present and selected candidateの先頭 / 末尾に一致。
- Collapsible root / content / toggle: each 1。
- raw plain=1、root-most=1、whole-body=true。
- toggleはcontent candidate外。turn-level operation groupもcontent candidate外。

### Assistant v3 aggregate result

| Case | Assistant count | Raw Markdown distribution | Root-most exactly 1 | Whole-body all true | Turn group excluded | Internal-button Messages |
|---|---:|---|---|---|---|---:|
| S1 | 12 | raw=1: 12 | PASS | PASS | PASS | 5 |
| S2 | 4 | raw=1: 2、raw=2: 2 | PASS | PASS | PASS | 4 |
| S3 | 4 | raw=1: 4 | PASS | PASS | PASS | 1 |

- Total Assistant Messages evaluated: 20。
- `ASSISTANT_CONTENT_CARDINALITY`: 0 live violations。
- `ASSISTANT_CONTENT_BOUNDARY_MISMATCH`: 0 live violations。
- `CONTENT_CONTAINS_TURN_GROUP`: 0 live violations。
- S2のnested Markdown matchesは別Message、fallback root、ContentBlockとして扱っていない。

### User / Comparator regression

#### User v2

| Case | User shape distribution | User boundary violations |
|---|---|---:|
| S1 | Collapsible Markdown=2、Collapsible plain=10 | 0 |
| S2 | Short plain=4 | 0 |
| S3 | Short plain=1、Collapsible Markdown=1、Collapsible plain=2 | 0 |

- S1 ordinal 23のnested partial plain caseはv2どおりroot-most=1 / whole-body=trueでcaptureされた。
- S3 Long User toggle boundaryも維持された。

#### Comparator v2

- Self-test regression: PASS。
- S1: count / role / marker / runtime ordering evaluated and MATCH。exact ordinal sequenceは`null / NOT EVALUATED`。
- S2: count / role / runtime ordering evaluated and MATCH。marker / exact ordinal sequenceは`null / NOT EVALUATED`。
- S3: count / role / runtime ordering evaluated and MATCH。full marker sequence / exact ordinal sequenceは`null / NOT EVALUATED`。
- `null`をPASSとして扱っていない。
- `expectedCount`からordinal sequenceを生成していない。

### Fail Closed result

- Pure helper negative-path self-tests: **PASS**。
- Live S1 / S2 / S3 Fail Closed violations: 0。
- root-most 0 / 2+、whole-body mismatch、turn-group containmentのlive negative caseは発生していないため、live negative-path PASSとは主張しない。
- 未観察fallback、candidate priority、author role node全体へのfallback、nested root fallbackは追加していない。
- Internal buttonはroot selection Failureにせず、TASK-005 Findingとして保持した。

### Security / repository checks

- Production implementation: none。
- Changes are limited to the four approved files under `spikes/TASK-001-standard-chat-dom/`。
- `src/`: no changes。
- `docs/`: no changes。
- `AGENTS.md`: no changes。
- Raw Conversation URL / ID、Message ID、turn ID、raw本文、page HTML、DOM snapshot、cookie、token、authorization、browser storageをEvidenceへ保存していない。
- `git diff --check`: PASS。未追跡の承認対象4ファイルはdirect trailing-whitespace scanでもPASS。
- Repository statusでは承認対象4ファイルだけが変更対象として検出され、禁止対象pathのstatusはempty。
- Raw ChatGPT Conversation URL、UUID / 既知Conversation ID、credential assignment patternのdirect scan: no matches。

### Known limitations

- S1のrepeated-marker pairsはdistinct runtime identityを確認したが、selected visible textのexact equalityがprovided same-content Ground Truthと一致しない。S1をPASSへ変更する前にGround Truth semanticsのレビューが必要。
- S2 / S3のmarker sequenceと全Caseのexpected ordinal sequenceは未提供のため、該当Comparator項目は`NOT EVALUATED`。
- Technical Spike用scanはRuntime Ground Truthとの比較専用で、Ground Truthなしのgeneral completeness / settled conditionを解決しない。
- Candidateは現在のChrome / ChatGPT UIと観察済みclass / containment structureに限定され、Production互換性を保証しない。
- S3 reload後のstructural stabilityは既存承認済みEvidenceを使用し、このRoundで追加reloadは行っていない。

### Deferred scope

#### TASK-003

- general completeness、settled condition、virtualization一般解、dynamic scroll height、viewport / scroll-step variation、50–200 Message級。

#### TASK-004

- branch、regenerate、edited Message、branch / edit時のruntime identity semantics。

#### TASK-005

- 本文subtree内button等のSaved / Ignored / Unsupported、一般UI除外、ContentBlock変換。

### TV-001 Final Verdict Recommendation

- Recommendation: **INSUFFICIENT EVIDENCE**
- TV-001 Final Verdict: **NOT SET**

Candidate Decision v3はS2 nested Markdown caseを安全に取得し、S1 / S2 / S3のMessage count、role、ordering、content boundary、Assistant whole-body、S3 rich structuresを再現した。short Standard Chat、20+ Message、code / list / quote等、既存reload Evidenceの主要Method coverageは揃った。

一方、S1のprovided same-content Ground Truthとruntime selected visible-text equalityが一致せず、S1をPASSにできない。これはCandidate v3のroot-most / whole-body failureではなく、同一markerとfull-body equalityのGround Truth semanticsに関する未解決差異である。推測でmarker一致をsame-content PASSへ読み替えないため、正式Verdictを変更せずRecommendationを`INSUFFICIENT EVIDENCE`に維持する。

### Next Action

S1 repeated-marker pairのRuntime Ground Truthが、(a)同一markerを持つ別Message、または(b)改行だけを正規化したfull visible bodyのexact equality、のどちらを要求するかレビューする。前者であれば今回のdistinct identity / marker EvidenceをS1 PASS材料として再評価できる。後者であればraw本文をGitへ保存せず、ユーザー提供のRuntime Ground Truthと対象pairだけをfocused comparisonして差異原因を確認する。PoCやfallbackはこのレビュー前に変更しない。

---

## TV-001 Final Review and Verdict — 2026-08-15

### Status

- Scope: TASK-001 / TV-001 Standard Chat Message DOMのFinal Review
- Review basis: Technical Validation PlanのTV-001、AT-005、承認済みMinimal PoC v3 / reload Evidence
- TV-001 Final Verdict: **PASS**
- Production implementation: none
- Phase 0 PoC: v1 / v2 / v3 implemented
- Additional DOM exploration / live validation: not performed in this Final Review
- PoC / selector / fallback changes: none

### Ground Truth Reconciliation

S1で実行前に定義されていたRuntime Ground Truthは次に限定される。

- Expected Message Count: 24
- Expected role sequence
- Expected marker sequence
- repeated User marker / repeated Assistant markerがそれぞれ2回存在すること

Repeated pairのselected visible bodyについて、改行だけを正規化したfull-body exact value、hash、fixture、またはexact equality expectationは実行前に定義されていなかった。Minimal PoC v3のfull visible-text equality comparisonは、事前Ground Truth comparisonではなく追加diagnosticとして扱う。

Reconciled result:

- Same-marker distinct Messages: **CONFIRMED**
- Distinct runtime identities: **CONFIRMED**
- Same Messageのremountでruntime identity維持: **CONFIRMED**
- Count / role / marker sequence / relative order: **MATCH**
- Repeated pairのfull normalized visible body exact equality: **NOT MATCHED by the additional diagnostic**
- Exact same-full-body distinct Messages in the current S1 live runtime: **NOT PROVEN**

事前定義されていないfull-body equalityをTV-001のPass条件へ後付けしない。このreconciliationにより、Minimal PoC v3節のS1 `PARTIALLY EVALUATED`と`INSUFFICIENT EVIDENCE` recommendationはFinal Review前の履歴として保持し、TV-001 Formal Criteriaに対するS1 resultを**PASS**として再評価する。

### Superseding Identity Finding Clarification

Validation Round 1およびCandidate Decisionの過去記録にある「同一本文を持つ別Messageをlive確認した」「同一role・同一本文の別MessageをS1で区別した」という趣旨の記載について、次のclarificationが後続解釈をsupersedeする。過去本文は履歴保持のため変更しない。

#### Confirmed live Evidence

- 同じmarkerを持つ別Messageが存在した。
- それぞれ異なるruntime identityを持った。
- 同一Messageのscroll後のremountではruntime identityが維持された。
- role、marker、orderを維持してdistinct Messageとして取得・deduplicateできた。

#### Not proven by current live Evidence

- Repeated pairのfull normalized visible body exact equality。
- Exact same-full-body distinct MessagesをS1実画面で実証した、という主張。

したがって、過去Evidence中のexact same-full-body live proofとして読める表現は**SUPERSEDED / NOT PROVEN**とする。PoC self-testのsame-content distinct runtime identity caseはsynthetic contract testであり、live DOM proofとは区別する。

`data-message-id`をRuntime capture / dedup identityとして採用したDecisionは変更しない。これはDomain canonical identityではなく、次の観察済み責務に限定される。

- 同一Messageのunmount / remountをdeduplicateする。
- same-markerの別Messageを異なるruntime identityとして保持する。
- role / ordinal / `data-turn-id`とのcross-scan矛盾をFail Closedする。

Message bodyをruntime identityへ採用しない方針も維持する。ユーザーが同じ内容を再入力し得るというdomain semantics上、body identityは安全でない。ただしこのdomain rationaleを、S1がexact same-full-body collisionをlive実証したというObserved Factへ読み替えない。Branch / edit時のidentity semanticsはTASK-004のままdeferする。

### Formal Criteria Matrix

TV-001 Source of Truth:

- Hypothesis: Standard ChatでUser / Assistant Messageを安定して列挙できる。
- Method: short conversation、20+ Message、code / list / quote含有、reload後のDOM比較。
- Pass: Message順序・role・本文を再現可能。
- Related: FR-005、FR-009、RISK-001。
- AT-005: Message Count、role、順序がfixture / Runtime Ground Truthと一致。

| Criterion / Evidence item | Result | Evidence | Formal relevance |
|---|---|---|---|
| Short Standard Chat | **PASS** | S2で8 / 8 Message、role sequence MATCH、runtime ordering valid、violations 0 | TV-001 Method |
| 20+ Message | **PASS** | S1で24 / 24 unique Message、missing / unexpected 0 | TV-001 Method |
| Message count | **PASS** | S1=24 / 24、S2=8 / 8、S3=8 / 8 | AT-005 / body reproduction support |
| Role | **PASS** | 全Caseでexpected User / Assistant sequenceと一致 | TV-001 Pass / AT-005 |
| Order | **PASS** | S1 marker / role sequenceとruntime ordinal orderが整合。S2 / S3もrole sequenceとruntime orderingが整合 | TV-001 Pass / AT-005。未提供のexact ordinal sequence自体は要求しない |
| Body root / boundary | **PASS** | User shape dispatchとAssistant root-most selectionが一意。START / ENDおよびwhole-body boundaryが成立 | TV-001 Pass |
| User Short plain | **PASS** | S2 / S3で一意にcapture | Body reproduction evidence |
| User Collapsible plain | **PASS** | S1 ordinal 23を含めroot-most filteringとwhole-body invariantが成立 | Body reproduction evidence |
| User Collapsible Markdown | **PASS** | S1 / S3で観察済みshapeを一意にcapture | Body reproduction evidence |
| Assistant root | **PASS** | S1=12、S2=4、S3=4の全20 Assistantでroot-most exactly 1 | Body reproduction evidence |
| Assistant nested Markdown | **PASS** | S2 ordinal aliases 4 / 6でraw=2、root-most=1、nested partialを別rootにしない | Candidate reproducibility evidence |
| Assistant whole-body | **PASS** | 全20 Assistantでselected root textとauthor node textがboundary normalization後に一致 | Body reproduction evidence |
| code / list / quote等 | **PASS** | S3 Rich Assistantでparagraph、bullet / numbered list、quote、fenced code、link、bold、italic、inline codeを同一root内に確認 | TV-001 Method。ContentBlock変換は含まない |
| Turn-level operation UI exclusion | **PASS** | S1 / S2 / S3でselected content candidateがturn-level operation groupを包含しない | FR-009 / body boundary evidence |
| Reload reproducibility | **PASS** | S3 reload前後でCount、role、3 User shapes、4 Assistant roots、rich structures、START / END、operation boundaryがMATCH | TV-001 Method |
| Remount dedup | **PASS** | S1 / S2 scanでstable runtime identityによりremountをdeduplicateし、cross-scan violation 0 | Enumeration stability evidence |
| Same-marker distinct Message handling | **PASS** | Repeated User / Assistant marker pairsをdistinct runtime identity / orderで保持 | Auxiliary identity evidence supporting enumeration |
| Exact same-full-body distinct Message evidence | **NOT EVALUATED / NOT PROVEN** | 事前exact body Ground Truthなし。追加diagnosticはNOT MATCH | Auxiliary Finding。TV-001 Formal Pass Criteriaではない |

S2 / S3のmarker sequenceおよび全Caseのexact expected ordinal sequenceはGround Truth未提供のため、その個別Comparator項目は`NOT EVALUATED`のまま維持する。一方、TV-001のorderは、S1のexpected marker / role sequenceと全Caseのruntime ordering / mounted DOM-order cross-checkによって再現可能と確認した。Ordinal gap / continuityやConversation completenessへ意味を拡張しない。

### Final Verdict

**TV-001 Final Verdict: PASS**

理由:

- short Standard ChatのS2、20+ MessageのS1、rich contentのS3で、事前定義されたCount / role / markerまたはboundary Ground Truthを再現した。
- Message order、role、本文root / boundaryを、観察済みcandidate strategyで一意に取得できた。
- code / list / quote等を含む本文範囲とturn-level operation UIの境界を再現した。
- S3 reload前後で本文取得に必要なsemantic / structural relationshipが維持された。
- virtualization下のremountをstable runtime identityでdeduplicateでき、same-markerの別Messageをdistinctに保持できた。
- Candidate v1 / Minimal PoC v1およびMinimal PoC v2のFail Closedは履歴として有効であり、Focused Observationに基づくv2 / v3修正後に全Formal Method coverageが成立した。

Repeated pairのexact same-full-body live evidenceは`NOT PROVEN`だが、事前Ground TruthでもTV-001 Formal Pass CriteriaでもないためVerdictをBlockしない。General completeness、branch / edit、ContentBlock / general UI classificationも別Validationの責務であり、TV-001へ追加条件として要求しない。

### Requirement / ADR / Risk Impact

- **FR-005 / ADR-004**: DOM取得candidateをPhase 0 PoCのcapture boundaryへ閉じ込め、意味比較・Ground Truth comparatorと分離できる見込みを確認した。Production Source Adapter実装完了を意味しない。
- **FR-009**: User / Assistant Messageのrole、順序、本文rootを取得し、turn-level operation UIを本文boundaryから除外できた。
- **AT-005**: S1 / S2 / S3でExpected Message Count、role、順序の一致を確認し、整合する。
- **ADR-006 / NFR-001 alignment**: candidate cardinality、identity、role、ordering、boundary矛盾はconfirmed fallbackなしでFail Closedするcontractをself-testし、live validationではsilent fallback / violationがなかった。
- **RISK-001**: 現在のChrome / ChatGPT UIに対するStandard Chat DOM取得不能riskは、観察済みcandidate、reload comparison、Fail Closed invariant、PoC self-testによりTV-001範囲で軽減された。将来DOM変更risk自体は継続する。
- **FR-010 / AT-006 / RISK-016**: code block内Copy等の本文subtree内UIはRelated Findingであり、一般分類 / 除外はTASK-005へdeferする。TV-001ではturn-level operation groupの分離までをEvidenceとする。

### Known Limitations

- Candidate strategyはChrome 151.0.7922.109と当該ChatGPT UIで観察したDOM / class-assisted shape recognitionに限定され、長期互換性を保証しない。
- Confirmed runtime identityはPhase 0 capture / dedup用途であり、Domain canonical / persistent Message identityではない。
- Exact same-full-body distinct Message collisionはcurrent live Evidenceで未実証。synthetic self-testおよびdomain rationaleとは区別する。
- S2 / S3のfull marker sequenceと全Caseのexact ordinal Ground Truthは未提供。該当Comparator項目は`NOT EVALUATED`。
- S3 reload evidenceは1回の同一environment comparisonである。
- 本文subtree内部のbutton等を一般的に分類・除外していない。
- Production implementation、Production selector / fallback chain、fixture suiteは未実装。

### Deferred Scope

#### TASK-003 / TV-005 / TV-006

- General completeness signal、settled condition、virtualization一般解、dynamic scroll height、viewport / scroll-step variation、50–200 Message級。

#### TASK-004 / TV-007

- Branch、regenerate、edited Message、branch / edit時のruntime identity semantics。

#### TASK-005 / TV-008〜TV-012

- 本文subtree内button等のSaved / Ignored / Unsupported、一般UI除外、ContentBlock変換、code language、sources、attachments、timestamp。

### Next Action

TASK-001内の次Validationである**TV-002 Standard Chat Title**へ進む。Canonical expectationはcurrent conversationのtruncatedされていない完全Titleとし、canonical sourceを事前決定せず、承認済みDiscovery Evidenceと計画に従って評価する。このFinal ReviewではTV-002のDOM探索、PoC実装、Verdict変更を開始しない。
