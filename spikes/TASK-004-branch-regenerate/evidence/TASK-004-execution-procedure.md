# TASK-004 Branch / Regenerate Spike — 実行手順書

## 0. Document Status

- Date: 2026-08-20
- Task: `TASK-004 Branch / Regenerate Spike`
- Primary Validation: `TV-007`
- Primary Risk: `RISK-005`
- Formal Source Type: `Standard Chat`
- Scope Planning: `COMPLETE`
- Fixture Design: `FROZEN`
- Ground Truth Schema: `FROZEN`
- Controlled Fixture: `NOT_YET_ESTABLISHED`
- Candidate-Independent Ground Truth: `NOT_YET_ESTABLISHED`
- Manual DOM Discovery: `NOT_STARTED`
- TV-007 Candidate Decision: `NOT_SET`
- Minimal PoC / Self-test: `NOT_STARTED`
- TV-007 Final Verdict: `NOT_SET`
- TASK-004 Final Exit: `NOT_SET`
- Phase 0 Exit: `NOT_MET`

Current gate:

```text
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_MANUAL_FIXTURE_EXECUTION
```

This document is the execution-level procedure derived from:

- `TASK-004-scope-plan.md`
- `TASK-004-controlled-fixture-ground-truth-preparation.md`
- `docs/05_technical-validation-plan.md`
- `docs/06_development-backlog.md`

TASK-003 remains closed unless TASK-004 produces a concrete contradiction against an adopted TASK-003 contract.

---

# 1. 目的

TASK-004では、ChatGPTの現在表示Branchから得られるMessage列について、保存済みPrefixが以前と同じかを安全に判定できることを検証する。

検証対象はBranch UIイベントそのものではない。

```text
current visible branch Message sequence
        |
        v
current prefix corresponding to saved boundary
        |
        v
compare with frozen saved-prefix Ground Truth
        |
        +--> PREFIX_MATCH
        +--> PREFIX_MISMATCH
        +--> UNKNOWN / AMBIGUOUS / INVALID_CAPTURE
              -> Fail Closed
```

Primary operations:

```text
Regenerate
User Edit
Branch Switch
```

必須Safety Control:

```text
same Message CountでもPrefix変更を検出できる
Branch変更がsaved boundaryより後ならPrefixを壊さない
Branch UIやruntime identity変更だけでMismatchにしない
曖昧状態をMatchにフォールバックしない
```

---

# 2. TASK-004 全体フロー

以下の順序を変更しない。

```text
Phase 1  Controlled Fixture構築
    |
Phase 2  Candidate-independent Ground Truth確立
    |
    |  GATE-A
    v
Phase 3  Manual DOM Discovery
    |
Phase 4  Candidate Decision Freeze
    |
Phase 5  Candidate結果とGround Truth比較
    |
    |  GATE-B
    v
Phase 6  Minimal PoC
    |
Phase 7  Deterministic Self-test
    |
    |  GATE-C
    v
Phase 8  TV-007 Final Review
    |
Phase 9  TASK-004 Final Exit Review / Backlog更新
```

禁止される順序:

```text
DOMを見る -> Ground Truthを決める
PoC結果を見る -> Ground Truthを修正する
Ground Truthに合うようCandidateを選ぶ
Self-testを通すためFrozen Contractを緩める
```

---

# 3. 役割分担

## 3.1 人間操作が必要な工程

以下はlive ChatGPT UI / Chromeを使うため、手動で実施する。

```text
- TASK004-RS Fixture作成
- TASK004-E Fixture作成
- Regenerate操作
- User Edit操作
- Branch Switch操作
- 人間可視UIからGround Truth記録
- DevToolsを使ったManual DOM Discovery
```

## 3.2 コード / Agentで実施可能な工程

Ground TruthとManual DOM Evidenceが確立した後は、以下をコード側で実施できる。

```text
- Evidence整理
- Candidate Decision文書化
- Minimal PoC実装
- Self-test実装・実行
- Final Review
- Backlog / Validation文書更新
```

Minimal PoC / Self-testはlive Chrome Evidenceではない。

---

# 4. Phase 1 — Controlled Fixture構築

## 4.1 共通ルール

Fixture構築中は以下を厳守する。

```text
1. 新しいStandard Chatを使う
2. Project Chatは使わない
3. DevToolsを開かない
4. Elements / DOM / Networkを見ない
5. Parser / PoCを実行しない
6. Ground Truthは画面に見えているMessage本文だけから記録する
7. data-message-id / data-turn-id / Branch DOM属性をOracleに使わない
```

Fixtureは2会話作る。

| Fixture | 用途 |
|---|---|
| `TASK004-RS` | Regenerate / Branch Switch / same-count mismatch / post-prefix control |
| `TASK004-E` | User Edit mismatch |

---

# 5. Phase 1-A — `TASK004-RS` Fixture作成

## Step RS-1 — 新しいStandard Chatを作る

新規Standard Chatを開く。

Runtime上でこの会話を他のFixtureと取り違えないことを確認する。

記録:

```text
RS_SOURCE_TYPE: Standard Chat
RS_UNIQUE_BINDING: YES
```

Conversation URL / Conversation IDは、その場でFixtureを特定するために使ってよいが、Ground Truth Oracleの根拠にはしない。

---

## Step RS-2 — Message 1を送信

以下をそのまま送る。

```text
TASK004-RS-U01-BASE
Reply with exactly this one line and nothing else:
TASK004-RS-A01-BASE
```

Assistantの画面表示が完全に以下なら続行する。

```text
TASK004-RS-A01-BASE
```

一致しなければ、このFixtureは破棄し、新しいStandard Chatからやり直す。

Regenerateで修復しない。

---

## Step RS-3 — Message 3を送信

```text
TASK004-RS-U02-BASE
Reply with exactly this one line and nothing else:
TASK004-RS-A02-BASE
```

Assistantの画面表示が完全に以下なら続行する。

```text
TASK004-RS-A02-BASE
```

一致しなければFixtureを破棄し、新規Chatから再構築する。

---

## Step RS-4 — Message 5を送信

```text
TASK004-RS-U03-BASE
Reply with exactly one line in this form:
TASK004-RS-A03-RND-XXXXXX
Replace XXXXXX with any six digits of your choice.
Do not output anything else.
```

Assistantの表示が次の形式であることを確認する。

```text
TASK004-RS-A03-RND-[six digits]
```

実際に表示された完全な1行を記録する。

```text
RS_A03_BASELINE_BODY = <visible UIの実値>
```

---

## Step RS-5 — BaselineをFreeze

この時点で会話は6 Message occurrenceである。

```text
1 User
2 Assistant
3 User
4 Assistant
5 User
6 Assistant
```

Freeze:

```text
RS_VISIBLE_MESSAGE_COUNT: 6
RS_PRIMARY_SAVED_PREFIX_BOUNDARY: 6
RS_SHORT_SAVED_PREFIX_BOUNDARY: 4
RS_BASELINE_SEQUENCE_FROZEN: YES
RS_PRIMARY_BOUNDARY_FROZEN: YES
RS_SHORT_BOUNDARY_FROZEN: YES
```

Baseline expected relation:

```text
boundary 6 -> PREFIX_MATCH
boundary 4 -> PREFIX_MATCH
```

このFreeze完了前にRegenerateしない。

---

## Step RS-6 — Regenerate Variantを作る

ordinal 6のAssistant responseに対して、ChatGPT UIのRegenerate / Try againを実行する。

Message 5は編集しない。

新しいresponseが以下をすべて満たすことを確認する。

```text
- ordinal 5へのresponseである
- visible Message occurrenceは6のまま
- TASK004-RS-A03-RND-[six digits]形式
- RS_A03_BASELINE_BODYと完全なvisible bodyが異なる
```

異なるbodyを取得したら記録する。

```text
RS_A03_REGENERATED_BODY = <visible UIの実値>
```

必須:

```text
RS_A03_REGENERATED_BODY != RS_A03_BASELINE_BODY
```

同じbodyが出た場合、その試行はpositive mismatchとして扱わない。

追加Regenerateは最大5回まで。

5回以内に異なるqualified bodyを取得できなければ停止する。

```text
RS_REGENERATE_POSITIVE_VARIANT: NOT_ESTABLISHED
TASK_004_DISCOVERY_ENTRY: BLOCKED
```

DOM identity差を内容差の代替にしない。

---

## Step RS-7 — Branch aliasをFreeze

```text
RS_BRANCH_BASELINE
= ordinal 6がRS_A03_BASELINE_BODYのvisible state

RS_BRANCH_REGENERATED
= ordinal 6がRS_A03_REGENERATED_BODYのvisible state
```

これはテスト用aliasであり、ChatGPT内部Branch IDではない。

---

## Step RS-8 — Branch Switch確認

visible Branch navigationを使って両方へ切り替える。

### Baseline側

画面上のordinal 6が:

```text
RS_A03_BASELINE_BODY
```

と一致することを確認。

記録:

```text
RS_BRANCH_SWITCH_TO_BASELINE_CONFIRMED: YES
```

期待値:

```text
boundary 6 -> PREFIX_MATCH
```

### Regenerated側

画面上のordinal 6が:

```text
RS_A03_REGENERATED_BODY
```

と一致することを確認。

記録:

```text
RS_BRANCH_SWITCH_TO_REGENERATED_CONFIRMED: YES
```

期待値:

```text
boundary 6 -> PREFIX_MISMATCH
```

---

## Step RS-9 — Post-prefix ControlをFreeze

同じ2 Branchを`boundary = 4`で評価する。

Branch差はordinal 6なのでsaved prefix外である。

期待値:

```text
RS_BRANCH_BASELINE    + boundary 4 -> PREFIX_MATCH
RS_BRANCH_REGENERATED + boundary 4 -> PREFIX_MATCH
```

このCaseは次の誤実装を排除するための必須Controlである。

```text
branch exists / branch changed
=> always PREFIX_MISMATCH   # 禁止
```

---

# 6. Phase 1-B — `TASK004-E` Fixture作成

## Step E-1 — 2つ目の新しいStandard Chatを作る

記録:

```text
E_SOURCE_TYPE: Standard Chat
E_UNIQUE_BINDING: YES
```

---

## Step E-2 — Message 1を送信

```text
TASK004-E-U01-BASE
Reply with exactly this one line and nothing else:
TASK004-E-A01-BASE
```

Assistantが完全に以下なら続行する。

```text
TASK004-E-A01-BASE
```

違う場合は新しいChatからやり直す。

---

## Step E-3 — Message 3を送信

```text
TASK004-E-U02-BASE
Reply with exactly this one line and nothing else:
TASK004-E-A02-BASE
```

Assistantが完全に以下なら続行する。

```text
TASK004-E-A02-BASE
```

違う場合は新しいChatからやり直す。

---

## Step E-4 — Message 5を送信

```text
TASK004-E-U03-BASE
Reply with exactly this one line and nothing else:
TASK004-E-A03-BASE
```

Assistant responseを記録する。

Preferred:

```text
TASK004-E-A03-BASE
```

実際の完全なvisible bodyを:

```text
E_A03_BASELINE_BODY = <visible UIの実値>
```

としてFreezeする。

---

## Step E-5 — E BaselineをFreeze

```text
E_VISIBLE_MESSAGE_COUNT: 6
E_PRIMARY_SAVED_PREFIX_BOUNDARY: 6
E_BASELINE_SEQUENCE_FROZEN: YES
E_PRIMARY_BOUNDARY_FROZEN: YES
```

期待値:

```text
Baseline + boundary 6 -> PREFIX_MATCH
```

---

## Step E-6 — User Editを実行

ordinal 5だけをChatGPT UIのEdit機能で編集する。

Message全体を以下へ置換する。

```text
TASK004-E-U03-EDITED
Reply with exactly this one line and nothing else:
TASK004-E-A03-EDITED
```

送信後、Assistant response完了まで待つ。

記録:

```text
E_A03_EDITED_BODY = <visible UIの実値>
```

必須relation:

```text
Baseline ordinal 5 != Edited ordinal 5
```

期待値:

```text
boundary 6 -> PREFIX_MISMATCH
```

visible occurrence countが6のままであることも確認する。

想定外にcountが変化した場合は停止してレビューする。

DOM Evidenceでcountを補正しない。

---

# 7. Phase 2 — Candidate-Independent Ground Truth確立

## Step GT-1 — Runtime Ground Truth Recordを完成

DevToolsを開く前に以下を埋める。

```text
TASK004-RS
  Source Type: Standard Chat
  Unique Runtime Binding Attested: YES
  Baseline Message Count: 6
  Primary Saved Prefix Boundary: 6
  Short Saved Prefix Boundary: 4
  RS_A03_BASELINE_BODY: <実値>
  RS_A03_REGENERATED_BODY: <実値>
  Baseline body != Regenerated body: YES
  Baseline sequence frozen: YES
  Regenerated sequence frozen: YES
  Branch switch to Baseline visibly confirmed: YES
  Branch switch to Regenerated visibly confirmed: YES

TASK004-E
  Source Type: Standard Chat
  Unique Runtime Binding Attested: YES
  Baseline Message Count: 6
  Primary Saved Prefix Boundary: 6
  Baseline ordinal-5 body frozen: YES
  Edited ordinal-5 body frozen: YES
  E_A03_BASELINE_BODY: <実値>
  E_A03_EDITED_BODY: <実値>
  Baseline ordinal 5 != Edited ordinal 5: YES
  Baseline sequence frozen: YES
  Edited sequence frozen: YES
```

---

## Step GT-2 — Expected MatrixをFreeze

以下を候補DOMを見る前に確定する。

| Case | Visible state | Boundary | Expected |
|---|---|---:|---|
| C0-RS | `RS_BRANCH_BASELINE` | 6 | `PREFIX_MATCH` |
| R1 | `RS_BRANCH_REGENERATED` | 6 | `PREFIX_MISMATCH` |
| S1-A | switch -> `RS_BRANCH_BASELINE` | 6 | `PREFIX_MATCH` |
| S1-B | switch -> `RS_BRANCH_REGENERATED` | 6 | `PREFIX_MISMATCH` |
| N1-A | `RS_BRANCH_BASELINE` | 4 | `PREFIX_MATCH` |
| N1-B | `RS_BRANCH_REGENERATED` | 4 | `PREFIX_MATCH` |
| C0-E | E Baseline | 6 | `PREFIX_MATCH` |
| E1 | E Edited | 6 | `PREFIX_MISMATCH` |

---

## Step GT-3 — GATE-A判定

以下がすべてYESならGround Truth確立完了。

- [ ] `TASK004-RS` uniquely bound Standard Chat
- [ ] RS Baseline six-Message ledger frozen
- [ ] RS boundary 6 frozen
- [ ] RS boundary 4 frozen
- [ ] materially different Regenerated body frozen
- [ ] Baseline ↔ Regenerated Branch switch confirmed
- [ ] `TASK004-E` uniquely bound Standard Chat
- [ ] E Baseline six-Message ledger frozen
- [ ] E boundary 6 frozen
- [ ] Edited User ordinal 5 frozen
- [ ] E Edited six-Message ledger frozen
- [ ] Expected classification matrix frozen
- [ ] Oracle作成にDOM Evidenceを一切使用していない

全てYES:

```text
TASK_004_CONTROLLED_FIXTURE: ESTABLISHED
TASK_004_BASELINE_PREFIX_GROUND_TRUTH: ESTABLISHED
TASK_004_BRANCH_VARIANT_GROUND_TRUTH: ESTABLISHED
TASK_004_CANDIDATE_INDEPENDENT_GROUND_TRUTH: ESTABLISHED
TASK_004_DISCOVERY_ENTRY: OPEN
```

1つでも未達:

```text
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_GROUND_TRUTH
```

Manual DOM Discoveryへ進まない。

---

# 8. Phase 3 — Manual DOM Discovery

## 8.1 Discovery開始時の原則

GATE-A通過後に初めてDevToolsを開く。

以降はGround Truthを変更しない。

評価順序:

```text
1. Runtime DOMを観察
2. Candidate relationを記録
3. Candidate-only classificationを決める
4. Candidate結果をFreeze
5. 最後にGround Truthと比較
```

Ground Truthを見ながらCandidate selectorを調整して期待結果へ合わせない。

---

## 8.2 初期Candidate Inventory

まず既存のStandard Chat Message acquisition baselineを起点に観察する。

確認候補:

```text
section[data-testid^="conversation-turn-"]
data-testid ordinal
data-message-author-role
human-visible body candidate
DOM order

data-message-id
data-turn-id

Branch navigation control
branch position indicator
aria-label / accessible name
disabled state
branched Messageとのcontainer relation
```

`data-message-id` / `data-turn-id`はruntime Evidenceとして観察してよいが、Prefix equality semanticsとして即採用しない。

---

## 8.3 Discoveryで回答する質問

最低限、以下を回答する。

1. 現在表示Branchは1本のordered Message sequenceとして取得できるか。
2. inactive sibling Branch MessageはDOMに存在するか。
3. siblingが同時mountされる場合、visible sequenceを安全に区別できるか。
4. DOM orderは現在表示Conversation順序として利用できるか。
5. Branch switch時にMessage unitはreplace / remount / attribute mutationのどれか。
6. ordinalはBranch switch前後で安定するか。
7. `data-message-id` / `data-turn-id`はBranch sibling間でどう変化するか。
8. Branch UI情報は補助Evidenceとして安定しているか。
9. Branch identifierを永続Product stateにせずvisible sequenceを判定できるか。
10. visible Branch membershipが曖昧な場合にFail Closedできるか。

質問10の必須答え:

```text
UNKNOWN / AMBIGUOUS
-> Fail Closed
```

---

## 8.4 Observation順序

### D-1 — `TASK004-RS` Baseline

`RS_BRANCH_BASELINE`をvisibleにする。

記録:

```text
- mounted Message unit数
- ordered ordinal
- role
- human-visible body candidate
- runtime identity candidates
- Branch control candidates
- inactive siblingのmount有無
- visible sequence判別可能性
```

Ground Truth comparisonはまだ行わない。

Candidate-only classificationをFreezeする。

---

### D-2 — `TASK004-RS` Regenerated

`RS_BRANCH_REGENERATED`へ切り替える。

同じ観察項目を記録する。

特に確認:

```text
saved Message Countと同じ6 occurrenceでも
ordinal 6内容差をruntime candidateが表現できるか
```

Candidate-only classificationをFreezeする。

---

### D-3 — Branch Switch往復

```text
Regenerated -> Baseline
Baseline -> Regenerated
```

を実施し、visible sequenceが期待どおり切り替わるcandidate relationを確認する。

確認:

```text
inactive sibling contaminationがないか
switch後にCandidateが現在表示Branchだけを表すか
```

---

### D-4 — Boundary 4 Control

同じRegenerated stateを使い、saved boundaryを4としてcandidate-onlyに評価する。

Branch operationの存在ではなく、ordinals 1..4のrelationから判定する。

---

### D-5 — `TASK004-E` Baseline

E Baseline stateを観察する。

RSと同じMessage sequence candidateが成立するか確認する。

---

### D-6 — `TASK004-E` Edited

Edited stateを観察する。

確認:

```text
ordinal 5 User bodyの変更をcandidateが検出可能か
same-count状態でも変更を表現できるか
```

---

### D-7 — Optional Reload Stability

必要な場合のみ、同じvisible BranchをReload / revisitする。

semantic prefixが同じならruntime identity変更だけを理由にMismatchとしてはならない。

C1は補助Evidenceであり、最低Fixture成立条件ではない。

---

# 9. Phase 4 — Candidate Decision Freeze

全Observation後、Ground Truthとの最終比較前にCandidate DecisionをFreezeする。

Candidate Decisionには最低限以下を記載する。

```text
1. adopted Message unit relation
2. adopted visible-body relation
3. role acquisition relation
4. ordinal / ordering relation
5. visible Branch membership relation
6. inactive sibling exclusion rule
7. runtime identity fieldの位置付け
8. PREFIX_MATCH判定条件
9. PREFIX_MISMATCH判定条件
10. UNKNOWN条件
11. AMBIGUOUS条件
12. INVALID_CAPTURE条件
13. fallback禁止条件
```

Classification model:

```text
PREFIX_MATCH
PREFIX_MISMATCH
UNKNOWN
AMBIGUOUS
INVALID_CAPTURE
```

Safety relation:

```text
UNKNOWN
AMBIGUOUS
INVALID_CAPTURE
!= PREFIX_MATCH
```

Only proven `PREFIX_MATCH` may later be eligible for normal Diff Append.

---

# 10. Phase 5 — Ground Truth Comparison

Candidate Decision Freeze後に初めてExpected Matrixと比較する。

必須比較:

| Case | Required Candidate Result |
|---|---|
| C0-RS | `PREFIX_MATCH` |
| R1 | `PREFIX_MISMATCH` |
| S1-A | `PREFIX_MATCH` |
| S1-B | `PREFIX_MISMATCH` |
| N1-A | `PREFIX_MATCH` |
| N1-B | `PREFIX_MATCH` |
| C0-E | `PREFIX_MATCH` |
| E1 | `PREFIX_MISMATCH` |

結果が合わない場合:

```text
1. Ground Truthを書き換えない
2. Candidate-only Evidenceの誤りか確認
3. Candidate relationを再検討
4. 必要なら追加Manual Discovery
5. Candidateを再Freezeしてから再比較
```

期待値に合わせるためのad-hoc fallbackは禁止。

---

# 11. GATE-B — TV-007 Candidate Adoption条件

以下をすべて満たすCandidateのみ`ADOPTED`候補とする。

### P1 — Visible Branch acquisition
現在表示Branchをinactive sibling混入なしでordered Message sequenceとして表現できる。

### P2 — Regenerate mismatch
saved prefix内のAssistant Regenerate差を`PREFIX_MISMATCH`にできる。

### P3 — User Edit mismatch
saved prefix内のUser Edit差を`PREFIX_MISMATCH`にできる。

### P4 — Branch Switch mismatch
異なるsaved-prefix Branchへ切り替えた時に`PREFIX_MISMATCH`にできる。

### P5 — Same-count mismatch
Message Countが同じでもMismatchを検出できる。

### P6 — Unchanged-prefix control
Branch UI存在やruntime identity remountだけでFalse Mismatchにしない。

### P7 — Post-prefix control
saved boundaryより後だけのBranch差ならPrefixをMatchとして扱える。

### P8 — Fail Closed
Missing / ambiguous / inconsistent stateをMatchへフォールバックしない。

### P9 — Candidate / Ground Truth separation
Candidate Decision Freeze後にGround Truth比較を行っている。

### P10 — Hash boundary preserved
最終Canonicalization / Sync Hash semanticsをTV-007で確定したと主張しない。

全て満たす場合:

```text
TV_007_CANDIDATE_DECISION: ADOPTED
MANUAL_DOM_DISCOVERY: COMPLETE
MINIMAL_POC_ENTRY: OPEN
```

満たさない場合:

```text
TV_007_CANDIDATE_DECISION: NOT_ADOPTED / PENDING
MINIMAL_POC_ENTRY: BLOCKED
```

---

# 12. Phase 6 — Minimal PoC

Candidate Decision採用後に実施する。

## 12.1 推奨ファイル

```text
spikes/TASK-004-branch-regenerate/
  poc/
    tv007-branch-regenerate-poc.mjs
    tv007-branch-regenerate-poc.selftest.mjs
  evidence/
    TASK-004-scope-plan.md
    TASK-004-controlled-fixture-ground-truth-preparation.md
    TASK-004-execution-procedure.md
    TASK-004-tv007-candidate-decision.md
    TASK-004-tv007-final-review.md
    TASK-004-final-exit-review.md
```

既存repository conventionが異なる場合は、命名規則に合わせてよい。

## 12.2 PoCの責務

PoCは狭く保つ。

```text
visible Message-sequence extraction contract
+
controlled prefix comparator
+
Fail Closed classifier
```

PoCでやらないこと:

```text
- live Chrome接続
- fixture自動構築
- Notion API
- Production Diff Append
- Recovery UI
- final Sync Hash canonicalization
- Project Chat coverage主張
- TASK-003 long-conversation再検証
```

最終Canonicalizationは`TV-020 / TASK-008`へ残す。

---

# 13. Phase 7 — Deterministic Self-test

最低限、以下をテストする。

```text
ST-001 baseline match
ST-002 same-count changed prefix -> mismatch
ST-003 changed User Message -> mismatch
ST-004 changed Assistant Message -> mismatch
ST-005 changed Message after saved boundary -> match
ST-006 runtime identity changed but semantic prefix same -> not automatic mismatch
ST-007 hidden/inactive sibling contamination -> not match
ST-008 missing body/role/ordinal -> Fail Closed
ST-009 ambiguous visible Branch membership -> Fail Closed
ST-010 UNKNOWN/AMBIGUOUSからMATCHへのfallbackなし
```

Self-test assertion group数は事前固定しない。

重要なのは上記Contractを漏れなくdeterministicに検証すること。

---

## 13.1 実行コマンド例

Repository Rootで実行する。

PowerShell:

```powershell
node --check spikes/TASK-004-branch-regenerate/poc/tv007-branch-regenerate-poc.mjs
node --check spikes/TASK-004-branch-regenerate/poc/tv007-branch-regenerate-poc.selftest.mjs
node spikes/TASK-004-branch-regenerate/poc/tv007-branch-regenerate-poc.selftest.mjs
```

追加確認:

```powershell
git status --short
git diff --check
```

---

## 13.2 GATE-C — PoC / Self-test PASS条件

全て満たす場合のみPASS。

- [ ] PoC syntax check PASS
- [ ] Self-test syntax check PASS
- [ ] Self-test正常終了
- [ ] ST-001〜ST-010相当Contract PASS
- [ ] Frozen Candidate Contractをテスト通過のために変更していない
- [ ] live Chrome EvidenceとSynthetic test Evidenceを混同していない

記録:

```text
MINIMAL_POC_RESULT: PASS / FAIL
SELF_TEST_RESULT: PASS / FAIL
SELF_TEST_ASSERTION_GROUPS: <actual>
CANDIDATE_DECISION_CONTRADICTION: NONE_FOUND / FOUND
```

Candidate Contractを正しくコード化すると成立しない場合は、Self-testを弱めない。

```text
CANDIDATE_DECISION_CONTRADICTION: FOUND
```

としてCandidate Decisionへ戻る。

---

# 14. Phase 8 — TV-007 Final Review

Final Reviewでは、Manual DOM EvidenceとPoC/Self-testの役割を分離して判定する。

## Live Evidence

```text
Controlled Fixture
Candidate-independent Ground Truth
Manual DOM Discovery
Candidate Decision
Ground Truth comparison
```

## Deterministic implementation evidence

```text
Minimal PoC
Self-test
```

PoC/Self-testだけでlive Chrome behaviorを証明したことにはしない。

---

## 14.1 TV-007 PASS条件

P1〜P10が全てEvidenceで満たされ、Minimal PoC / Self-testでもFrozen Candidate Contractを再現できる場合:

```text
TV_007_FINAL_VERDICT: PASS
```

1つでも重大条件を満たさない場合:

```text
TV_007_FINAL_VERDICT: FAIL / PENDING
```

Fail ClosedしかできないCaseがあること自体は必ずしもFAILではない。

危険なのは、曖昧状態を安全に区別できず`PREFIX_MATCH`へ通してしまうことである。

---

# 15. Phase 9 — TASK-004 Final Exit Review

Development Backlog Exit:

```text
Branch変更でPrefix mismatch検出
```

TV-007 PASSかつScope内のEvidenceが揃った場合:

```text
TASK_004_FINAL_EXIT: PASS
TASK_004_STATUS: COMPLETE
```

その後、少なくとも以下を更新する。

```text
- TASK-004 Final Review Evidence
- TASK-004 Final Exit Review
- docs/06_development-backlog.md
```

`docs/05_technical-validation-plan.md`にValidation result/status欄を持つrepository運用であれば、TV-007の結果をそこにも反映する。

TASK-004完了だけではPhase 0全体のExitを満たしたことにはしない。

```text
PHASE_0_EXIT: NOT_MET
```

後続Technical Validationが残っている限り維持する。

---

# 16. Stop / Restart Rules

## Fixtureを最初から作り直す

以下の場合:

```text
- deterministic setup reply（ordinal 2 / 4）が不一致
- Baseline Freeze前に誤ってEdit / Regenerateした
- accidental User Messageで6-occurrence構造を壊した
- Fixtureを一意に識別できない
- visible stateを人間UIだけで再構成できない
```

## Fixtureを作り直さず続行できる

```text
- Regenerateが一度Baselineと同じbodyを返した
- runtime IDが変化したように見える
- Branch UI labelが想定と異なる
- DOM candidateが想定外だった
```

## 停止してレビューする

```text
- Regenerateで異なるbodyを安全limit内に取得できない
- User Editでvisible occurrence countが予期せず変化
- frozenしたBaseline / Regeneratedの両Branchへ戻れない
- normal UI上でinactive Branch本文が同時visibleになる
- Ground Truth確定にDOM Evidenceが必要になった
- Candidate ambiguityをFail Closedできない
```

---

# 17. TASK-003 Reopen Rule

TASK-004中にTASK-003 long-conversation completenessを再検証しない。

再オープン条件は、TASK-004 EvidenceからTASK-003 adopted contractに対する具体的矛盾が見つかった場合のみ。

```text
TASK_003_REOPEN_REQUIRED: NO
```

をDefaultとする。

---

# 18. TASK-004で実施しないこと

```text
- Long-100 / Long-200再検証
- TASK-003 traversal再評価
- completeness contract再設計
- Production Chrome Extension実装
- Notion API / Notion write
- Recovery UI実装
- Version切替実装
- final Sync Hash canonicalization
- Rich Content全体の正規化
- ChatGPT内部API解析
- Network通信解析
- Project ChatをTV-007 Formal PASS条件へ追加
```

---

# 19. 実行用マスター・チェックリスト

## A. Fixture / Ground Truth

- [ ] `TASK004-RS`新規Standard Chat作成
- [ ] RS ordinal 2 exact reply確認
- [ ] RS ordinal 4 exact reply確認
- [ ] `RS_A03_BASELINE_BODY`記録
- [ ] RS Baseline six-message ledger Freeze
- [ ] boundary 6 Freeze
- [ ] boundary 4 Freeze
- [ ] materially different Regenerated body取得
- [ ] `RS_A03_REGENERATED_BODY`記録
- [ ] Baseline Branchへswitch確認
- [ ] Regenerated Branchへswitch確認
- [ ] `TASK004-E`新規Standard Chat作成
- [ ] E ordinal 2 exact reply確認
- [ ] E ordinal 4 exact reply確認
- [ ] `E_A03_BASELINE_BODY`記録
- [ ] E Baseline Freeze
- [ ] ordinal 5 User Edit実施
- [ ] `E_A03_EDITED_BODY`記録
- [ ] E Edited ledger Freeze
- [ ] Expected Matrix Freeze
- [ ] Candidate-independent Ground Truth `ESTABLISHED`

## B. Manual DOM Discovery

- [ ] RS Baseline観察
- [ ] RS Regenerated観察
- [ ] Branch switch往復観察
- [ ] boundary 4 Control評価
- [ ] E Baseline観察
- [ ] E Edited観察
- [ ] inactive sibling contamination確認
- [ ] visible Branch membership relation確認
- [ ] ambiguity / invalid capture Fail Closed確認
- [ ] Candidate-only classifications Freeze

## C. Candidate Decision

- [ ] adopted Message relation Freeze
- [ ] visible body relation Freeze
- [ ] role / ordinal / order relation Freeze
- [ ] inactive Branch exclusion rule Freeze
- [ ] runtime identity semantics Freeze
- [ ] Match / Mismatch / Unknown / Ambiguous / Invalid rules Freeze
- [ ] Ground Truth Matrixと比較
- [ ] P1〜P10確認
- [ ] `TV_007_CANDIDATE_DECISION: ADOPTED`

## D. PoC / Self-test

- [ ] Minimal PoC実装
- [ ] ST-001〜ST-010相当Self-test実装
- [ ] PoC syntax PASS
- [ ] Self-test syntax PASS
- [ ] Self-test PASS
- [ ] assertion group数記録
- [ ] Candidate contradictionなし

## E. Final Review

- [ ] `TV_007_FINAL_VERDICT: PASS`
- [ ] `TASK_004_FINAL_EXIT: PASS`
- [ ] `TASK_004_STATUS: COMPLETE`
- [ ] `docs/06_development-backlog.md`更新
- [ ] 必要なら`docs/05_technical-validation-plan.md`更新
- [ ] `TASK_003_REOPEN_REQUIRED: NO`確認
- [ ] `PHASE_0_EXIT: NOT_MET`確認

---

# 20. 現在地と直近アクション

現在:

```text
TASK_004_SCOPE_PLANNING: COMPLETE
TASK_004_FIXTURE_DESIGN: FROZEN
TASK_004_GROUND_TRUTH_SCHEMA: FROZEN
TASK_004_CONTROLLED_FIXTURE: NOT_YET_ESTABLISHED
TASK_004_CANDIDATE_INDEPENDENT_GROUND_TRUTH: NOT_YET_ESTABLISHED
TASK_004_MANUAL_DOM_DISCOVERY: NOT_STARTED
TASK_004_DISCOVERY_ENTRY: BLOCKED_BY_MANUAL_FIXTURE_EXECUTION
```

したがって直近で実行するのは:

```text
Step 1: TASK004-RSを手動構築
Step 2: RS Baseline / Regenerated / Branch Switch Ground TruthをFreeze
Step 3: TASK004-Eを手動構築
Step 4: E Baseline / Edited Ground TruthをFreeze
Step 5: Expected MatrixをFreeze
Step 6: GATE-A判定
```

GATE-Aを通過するまでDevToolsは開かない。
