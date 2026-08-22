# TASK-004 Phase 3 — Manual DOM Discovery 実行手順

## 0. Status / Entry Decision

- Task: `TASK-004 Branch / Regenerate Spike`
- Primary Validation: `TV-007`
- Formal Source Type: `Standard Chat`
- Phase: `Phase 3 — Manual DOM Discovery`
- `TASK_004_CONTROLLED_FIXTURE: ESTABLISHED`
- `TASK_004_BASELINE_PREFIX_GROUND_TRUTH: ESTABLISHED`
- `TASK_004_BRANCH_VARIANT_GROUND_TRUTH: ESTABLISHED`
- `TASK_004_CANDIDATE_INDEPENDENT_GROUND_TRUTH: ESTABLISHED`
- `TASK_004_GATE_A: PASS`
- `TASK_004_DISCOVERY_ENTRY: OPEN`
- `TASK_004_MANUAL_DOM_DISCOVERY: IN_PROGRESS` at first live capture
- `TV_007_CANDIDATE_DECISION: NOT_SET`

Clarification:

- `E_A03_BASELINE_BODY` / `E_A03_EDITED_BODY` are the Assistant ordinal-6 bodies.
- Edited User ordinal 5 is frozen separately by the controlled fixture ledger.
- Therefore the supplied `TASK004-E` Ground Truth is internally consistent.

---

# 1. Phase 3の目的

Phase 3では、Ground TruthやExpected Matrixに合わせてselectorを選ぶのではなく、live ChatGPT DOMからBranch / Regenerate / Edit時の構造的事実を採取する。

このPhaseで確定させる対象は以下。

```text
- mounted Message unit relation
- ordinal / DOM order relation
- role relation
- visible-body candidate inventory
- runtime identity candidate behavior
- Branch control candidate behavior
- inactive sibling Branchのmount / visibility relation
- Branch Switch時のreplace / remount / mutation relation
```

このPhaseでは以下を決定しない。

```text
- PREFIX_MATCH / PREFIX_MISMATCH Final classification
- Product-level Branch identity
- persisted Branch ID
- final Sync Hash canonicalization
- TV-007 Final Verdict
```

---

# 2. 使用するコード

Chrome DevTools Consoleで以下を1回だけロードする。

```text
task004-tv007-phase3-dom-discovery-console.js
```

インストール後のglobal API:

```javascript
TASK004_TV007.status()
TASK004_TV007.capture(label)
TASK004_TV007.diff(labelA, labelB)
TASK004_TV007.get(label)
TASK004_TV007.list()
TASK004_TV007.exportJson()
TASK004_TV007.reset()
```

重要:

- `capture()` はDOM Evidenceのみを採取する。
- `diff()` はDOM構造差だけを比較する。
- `diff()` は `PREFIX_MATCH` / `PREFIX_MISMATCH` を返さない。
- `data-message-id` / `data-turn-id` の生値はExportしない。
- runtime identifiersはcapture内でfingerprint化する。

---

# 3. Preflight

各FixtureでCapture前に以下を確認する。

```text
[ ] 対象Fixtureを取り違えていない
[ ] 画面上で意図したBranchがvisible
[ ] Assistant生成中ではない
[ ] Edit UIが開いたままではない
[ ] Branch switch animation / loadingが終了している
[ ] document.visibilityState == "visible"
[ ] Ground Truthを変更していない
```

DevTools Consoleで:

```javascript
TASK004_TV007.status()
```

最低確認:

```text
pageVisibilityState: "visible"
pageHidden: false
readyState: "complete"
```

違う場合はCaptureしない。

---

# 4. Capture naming contract

以下のlabelを固定する。

```text
RS_BASELINE
RS_REGENERATED
RS_SWITCH_BASELINE
RS_SWITCH_REGENERATED
E_BASELINE
E_EDITED
```

Optional Reloadを行う場合のみ:

```text
RS_BASELINE_RELOAD
```

Boundary 4は新しいDOM stateではないため、Phase 3で専用Captureを作る必要はない。
`RS_REGENERATED` CaptureをPhase 4/5でboundary 4にも適用する。

---

# 5. D-1 — TASK004-RS Baseline Capture

## 5.1 UI状態

`TASK004-RS`を開き、visible BranchをBaselineへ切り替える。

画面上でBaseline Assistant bodyが以下であることを人間が確認する。

```text
TASK004-RS-A03-RND-482731
```

これはFixture binding確認であり、ConsoleコードへGround Truthとして入力しない。

## 5.2 Capture

```javascript
TASK004_TV007.capture("RS_BASELINE")
```

## 5.3 確認項目

Console tableから最低限以下を記録する。

```text
- mountedTurnCount
- ordinals
- strictAscending
- ordinalごとのrole
- sectionNodeToken
- messageIdFP candidate count / fingerprint
- turnIdFP candidate count / fingerprint
- markdown root-most candidate count
- plain root-most candidate count
- Branch signal control count
- rendered state
```

期待値との比較はまだ行わない。

---

# 6. D-2 — TASK004-RS Regenerated Capture

## 6.1 UI操作

画面操作でRegenerated Branchへ切り替える。

visible Assistant bodyがRegenerated variantであることだけをUIで確認する。

```text
TASK004-RS-A03-RND-583214
```

## 6.2 Capture

```javascript
TASK004_TV007.capture("RS_REGENERATED")
```

## 6.3 DOM-fact差分

```javascript
TASK004_TV007.diff("RS_BASELINE", "RS_REGENERATED")
```

このdiffで確認する。

```text
- mounted turn countが変わるか
- ordinal sequenceが変わるか
- ordinal 6 section nodeがreplace/remountされるか
- data-message-id fingerprintが変わるか
- data-turn-id fingerprintが変わるか
- Assistant content candidate fingerprintが変わるか
- Branch controlsがどう変わるか
```

ここで「MISMATCH」とは記録しない。
DOM factのみ記録する。

---

# 7. D-3 — Branch Switch往復

## 7.1 Regenerated -> Baseline

UIでBaselineへ戻す。

```javascript
TASK004_TV007.capture("RS_SWITCH_BASELINE")
TASK004_TV007.diff("RS_REGENERATED", "RS_SWITCH_BASELINE")
TASK004_TV007.diff("RS_BASELINE", "RS_SWITCH_BASELINE")
```

目的:

```text
A. branch switch操作時のreplace/remount/mutationを観察
B. 元のBaselineへ戻した時のDOM relationを観察
C. inactive sibling contaminationの有無を観察
```

## 7.2 Baseline -> Regenerated

UIでRegeneratedへ再度切り替える。

```javascript
TASK004_TV007.capture("RS_SWITCH_REGENERATED")
TASK004_TV007.diff("RS_SWITCH_BASELINE", "RS_SWITCH_REGENERATED")
TASK004_TV007.diff("RS_REGENERATED", "RS_SWITCH_REGENERATED")
```

ここでもExpected Matrixとは比較しない。

---

# 8. D-4 — Inactive sibling / Branch membership確認

RSの4 Captureについて、以下を確認する。

```javascript
TASK004_TV007.get("RS_BASELINE")
TASK004_TV007.get("RS_REGENERATED")
TASK004_TV007.get("RS_SWITCH_BASELINE")
TASK004_TV007.get("RS_SWITCH_REGENERATED")
```

主確認:

```text
1. 6個以外のMessage unitが同時mountされるか
2. 同一ordinalがduplicate mountされるか
3. rendered=falseのsibling Message candidateが存在するか
4. Branch controlがbranched Message section内にあるか
5. document-level Branch signal candidateがどこに存在するか
6. current visible BranchをMessage sequenceとして一意に絞れそうか
```

判断候補:

```text
VISIBLE_SEQUENCE_UNIQUE
INACTIVE_SIBLING_MOUNTED_BUT_EXCLUDABLE
AMBIGUOUS_BRANCH_MEMBERSHIP
UNKNOWN
```

このラベルはPhase 3 Observation用であり、まだTV-007 Candidate Decisionではない。

---

# 9. D-5 — TASK004-E Baseline Capture

RS fixtureから`TASK004-E`へ移動する。

注意:

ページ遷移によりConsole context/globalが失われた場合、同じJSを再度ロードする。
その場合、RS captureは新しいpage contextには残らないため、RS Evidenceは移動前にExportしておく。

## 9.1 E Baselineをvisibleにする

UI上でBaseline User ordinal 5 / Assistant ordinal 6が表示されていることを確認する。

## 9.2 Capture

```javascript
TASK004_TV007.capture("E_BASELINE")
```

---

# 10. D-6 — TASK004-E Edited Capture

UIでEdited Branchへ切り替える。

確認対象:

```text
ordinal 5 User = Edited version
ordinal 6 Assistant = Edited response branch
```

Capture:

```javascript
TASK004_TV007.capture("E_EDITED")
TASK004_TV007.diff("E_BASELINE", "E_EDITED")
```

確認:

```text
- count差
- ordinal sequence差
- ordinal 5 section node replacement
- ordinal 5 user candidate text fingerprint差
- ordinal 5 runtime identity fingerprint差
- ordinal 6 Assistantのbranch-induced差
- inactive sibling mountの有無
```

ここでもExpected Matrixとの比較はしない。

---

# 11. Optional D-7 — Reload Stability

必須ではない。

実施する場合はRS Baseline Branchをvisibleにした状態で、まず現在CaptureをExportする。
Reload後はConsole stateが失われるため、JSを再ロードする。

```javascript
TASK004_TV007.capture("RS_BASELINE_RELOAD")
```

Reload前後の自動`diff()`は同一JS runtimeでは行えないため、Export JSON同士を後で比較する。

ここで確認したいのは:

```text
semantic UI stateが同じでもruntime identities / node tokensが変化し得るか
```

Reload Evidenceは補助EvidenceでありFormal minimumには含めない。

---

# 12. Evidence Export

## 12.1 RS Fixture離脱前

```javascript
TASK004_TV007.list()
copy(TASK004_TV007.exportJson())
```

保存名推奨:

```text
TASK-004-phase3-rs-dom-captures.json
```

## 12.2 E Fixture離脱前

```javascript
TASK004_TV007.list()
copy(TASK004_TV007.exportJson())
```

保存名推奨:

```text
TASK-004-phase3-e-dom-captures.json
```

Raw Conversation URL / raw Conversation ID / raw `data-message-id` / raw `data-turn-id`をEvidence文書へ転記しない。

---

# 13. Phase 3 Observation Recordに必ず書く項目

各Fixtureごとに以下を文章化する。

```text
A. Message unit
- selector candidate
- count
- ordinal cardinality
- DOM order

B. Role
- role source candidate
- cardinality
- stability

C. Body
- User candidate inventory
- Assistant candidate inventory
- root-most cardinality
- Branch switch時のcontent candidate差

D. Runtime identity
- message-id candidate cardinality
- turn-id candidate cardinality
- sibling Branch間で変化するか
- switch-backで元へ戻るか / 新規になるか
- Product equalityには未採用であること

E. Branch UI
- control candidate location
- label/text/testid candidate
- current index表現の有無
- disabled state
- branched Messageとのcontainment relation

F. Branch membership
- inactive sibling mount有無
- hidden/rendered relation
- visible sequenceを一意に抽出できるか

G. Switch mechanics
- same section node mutation
- child replacement
- whole Message section remount
- unknown
```

---

# 14. Phase 3 Completion Gate

以下を満たしたらManual DOM Discoveryを`COMPLETE`候補とする。

```text
[ ] RS_BASELINE capture取得
[ ] RS_REGENERATED capture取得
[ ] RS_SWITCH_BASELINE capture取得
[ ] RS_SWITCH_REGENERATED capture取得
[ ] E_BASELINE capture取得
[ ] E_EDITED capture取得
[ ] RS Baseline <-> Regenerated DOM diff記録
[ ] Branch Switch往復DOM diff記録
[ ] E Baseline <-> Edited DOM diff記録
[ ] inactive sibling mount relation記録
[ ] visible Branch membership relation記録
[ ] runtime identity semanticsを事実として記録
[ ] Branch control candidate inventory記録
[ ] Ground Truth / Expected Matrixをselector選定に使用していない
[ ] PREFIX verdictをPhase 3 codeで自動生成していない
[ ] Evidence Export完了
```

全項目完了後:

```text
TASK_004_MANUAL_DOM_DISCOVERY: COMPLETE
TASK_004_PHASE_4_ENTRY: OPEN
TV_007_CANDIDATE_DECISION: NOT_SET
```

Phase 4では、ここで採取したDOM EvidenceだけからCandidate relationをFreezeする。
Expected Matrixとの最終比較はPhase 5まで行わない。

---

# 15. Stop / Abort条件

以下ではそのCaptureをFormal Evidenceにしない。

```text
PAGE_HIDDEN
WRONG_FIXTURE
WRONG_VISIBLE_BRANCH
GENERATION_IN_PROGRESS
EDIT_UI_OPEN
ORDINAL_PARSE_FAILURE
DUPLICATE_ORDINAL_UNEXPLAINED
AUTHOR_ROLE_CARDINALITY_AMBIGUOUS
DOM_STATE_TRANSITIONING
CAPTURE_CODE_ERROR
```

対応:

```text
1. Ground Truthは変更しない
2. UI状態を正しく戻す
3. DOMがsettleした後に新しいlabelで再Captureする
4. invalid captureを正式Evidenceへ混ぜない
```

候補DOMが期待どおりでなくてもFixtureを作り直さない。
それはDiscovery結果として保持する。
