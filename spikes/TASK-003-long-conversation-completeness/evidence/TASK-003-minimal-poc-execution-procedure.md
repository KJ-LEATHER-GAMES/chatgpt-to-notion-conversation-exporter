# TASK-003 Minimal PoC + Self-test 実行手順

## 1. 目的

TASK-003で採用済みのTV-005 / TV-006 Contractが、Minimal PoCとして正しくコード化され、deterministic Self-testで再現可能にPASSすることを確認する。

本手順では新しいDOM Discoveryは行わない。Long-100 / Long-200のライブ再走査も実施しない。現在のHandoffでは、Minimal PoCの実行結果とSelf-test結果をFinal Reviewの入力とする。

## 2. 対象ファイル

リポジトリRootから以下が存在することを確認する。

```text
spikes/TASK-003-long-conversation-completeness/
  poc/
    tv005-tv006-long-conversation-poc.mjs
    tv005-tv006-long-conversation-poc.selftest.mjs
  evidence/
    TASK-003-minimal-poc.md
```

## 3. 前提条件

- リポジトリRootでコマンドを実行する。
- Node.jsで `.mjs` を実行できること。
- PoC / Self-testの内容を実行前に変更しないこと。
- 採用済みCandidate Decisionや20% baselineを、テストを通す目的で変更しないこと。

## 4. 実行前確認

### 4.1 現在位置を確認

PowerShell:

```powershell
Get-Location
```

必要であればリポジトリRootへ移動する。

```powershell
cd <repository-root>
```

### 4.2 対象ファイルを確認

```powershell
Test-Path "spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.mjs"
Test-Path "spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs"
Test-Path "spikes/TASK-003-long-conversation-completeness/evidence/TASK-003-minimal-poc.md"
```

期待結果:

```text
True
True
True
```

1つでも `False` の場合は実行を止め、配置を修正する。

### 4.3 Node.jsを確認

```powershell
node --version
```

バージョン番号が返り、Node.jsを実行できることを確認する。

## 5. Step 1 — PoC本体の構文チェック

```powershell
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.mjs
```

### PASS条件

- 終了コードが成功。
- SyntaxErrorが出ない。

### FAIL時

- Self-testへ進まない。
- 単純な構文ミスか、生成時のファイル破損かを確認する。
- 採用済みContractそのものを変更して修正しない。

## 6. Step 2 — Self-testの構文チェック

```powershell
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
```

### PASS条件

- 終了コードが成功。
- SyntaxErrorが出ない。

### FAIL時

- Self-test実行へ進まない。
- テストコードの構文・参照先・ファイル配置を確認する。

## 7. Step 3 — Deterministic Self-test実行

```powershell
node spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
```

### 期待する最終出力

```text
TASK-003 TV-005/TV-006 Minimal PoC self-test: PASS (47 assertion groups)
```

## 8. Self-testのPASS判定

以下をすべて満たした場合のみPASSとする。

1. PoC本体の `node --check` が成功。
2. Self-testの `node --check` が成功。
3. Self-test実行が異常終了しない。
4. 最終結果が次と一致する。

```text
PASS (47 assertion groups)
```

5. テストを通すためにFrozen Contractを変更していない。

## 9. Self-testで確認している主要Contract

Self-testは少なくとも次を確認する。

- Standard Chatのmounted Message unit relation。
- 20% current viewport height step。
- Top → Bottom traversal。
- full mounted ordinal arrayを含むsettle relation。
- `data-message-id` のrun-local acquisition / dedup。
- ordinal / `data-turn-id` / role / DOM order consistency。
- Bottom geometryまたはBLOCKEDだけがterminationになること。
- expected countをruntime classifierまたはstop条件に使わないこと。
- union countをstop条件に使わないこと。
- no-new-ID / local convergenceだけでCompleteにしないこと。
- Top + BottomだけでCompleteにしないこと。
- internal ordinal gapを `INCOMPLETE` とすること。
- visibility失敗、identity矛盾、scroll container異常等をFail Closedにすること。
- Ground Truth比較がcandidate classification freeze後だけ行われること。
- Ground Truth mismatchがruntime candidateを遡って変更しないこと。

## 10. FAIL時の判断ルール

Self-testがFAILした場合、まず次のどちらかに分類する。

### A. 実装 / Self-test defect

例:

- typo / SyntaxError
- import path不整合
- assertion expected valueの誤り
- Frozen Contractを正しくコード化できていない

この場合はContractを維持したまま修正し、全テストを再実行する。

### B. Candidate Decision contradiction

PoCを正しく実装すると、採用済みTV-005 / TV-006 Contractそのものでは成立しない場合。

この場合はテストを通すためにContractを緩めない。

```text
CANDIDATE_DECISION_CONTRADICTION:
FOUND
```

としてCandidate Decision再オープンが必要。

## 11. 実行結果の記録

PASS時はEvidenceへ最低限以下を記録する。

```text
MINIMAL_POC_RESULT:
PASS

SELF_TEST_RESULT:
PASS

SELF_TEST_ASSERTION_GROUPS:
47

CANDIDATE_DECISION_CONTRADICTION:
NONE_FOUND
```

実行したコマンド:

```text
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.mjs
node --check spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
node spikes/TASK-003-long-conversation-completeness/poc/tv005-tv006-long-conversation-poc.selftest.mjs
```

## 12. 任意のRepository Check

実リポジトリへ配置した後は、変更内容に問題がないことを追加確認する。

```powershell
git status --short
git diff --check
```

`git diff --check` で問題が出た場合は、whitespace等を修正してから完了扱いとする。

## 13. PoC実行でやらないこと

本手順では以下を実施しない。

- 新しいDOM Discovery
- 40 / 60 / 80% step optimization
- viewport variation
- adaptive scrolling
- MutationObserver Production hardening
- Project Chat long-conversation coverage
- Production retry / timeout / recovery
- Notion integration
- Production UI
- Phase 1 adapter / parser実装
- expected countやunion countをruntime Complete判定へ追加

## 14. 完了後の状態

正常終了後:

```text
MANUAL_DOM_DISCOVERY:
COMPLETE

LONG_100_METHOD_GATE:
PASS

LONG_200_BASELINE:
PASS

LONG_200_RELOAD_REPRODUCIBILITY:
PASS

TV_005_CANDIDATE_DECISION:
ADOPTED

TV_006_CANDIDATE_DECISION:
ADOPTED

MINIMAL_POC:
COMPLETE

MINIMAL_POC_RESULT:
PASS

SELF_TEST_RESULT:
PASS

TV_005_FINAL_VERDICT:
NOT_SET

TV_006_FINAL_VERDICT:
NOT_SET

TASK_003_FINAL_EXIT:
NOT_SET
```

## 15. 次の作業

PoC / Self-testがPASSしたら、新しいライブ走査を追加せず、次へ進む。

```text
TASK-003 Final Review
  -> TV-005 Final Review
  -> TV-006 Final Review
  -> TASK-003 Final Exit Review
```

Final ReviewではSource-of-Truth、統合済みTASK-003 Evidence、Minimal PoC source、Self-test PASS結果を合わせて評価する。
