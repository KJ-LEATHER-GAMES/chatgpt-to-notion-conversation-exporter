# TV-001 Minimal PoC v3

Revision: `tv001-minimal-poc-v3`

Phase 0のTASK-001 / TV-001専用PoC。Production Source Adapterではなく、`src/`へ流用することを前提としない。v1 / v2の失敗結果はEvidenceに履歴として保持し、v3はCandidate Decision v2とAssistant Candidate Decision v3だけを必要最小限反映する。

## Responsibilities

- 現在mountされているM-02 turn `section`のみcaptureする
- `data-message-id`でruntime dedupする
- `data-turn-id`でcross-checkする（fallbackにはしない）
- `data-testid="conversation-turn-N"`の`N`でorderingする
- `data-message-author-role`でroleを判定する
- 観察済み3種類のUser content shapeをdispatchする
- Collapsible plainではplain matchをcontainment-awareにroot-most filteringする
- Collapsible plainのselected rootとscoped contentを改行のみ正規化してwhole-body cross-checkする
- Assistant Markdown matchesをcontainment-awareにroot-most filteringする
- Assistantのselected rootとauthor role nodeを改行のみ正規化してwhole-body cross-checkする
- Candidate DecisionのFail Closed invariantを検査する
- Ground Truthのordinalは明示された場合だけexact comparisonする
- Runtime Ground Truthと匿名化summaryを分離する

M-01 outer container、general completeness、branch / edit、ContentBlock変換、本文subtree内UIの一般除外は対象外。

## v3 contracts

- Boundary Text Normalizationは`CRLF`から`LF`、単独`CR`から`LF`だけを行う。trim、whitespace collapse、space / tab normalization、line joiningは行わない。
- Collapsible MarkdownとShort plainはv1のcandidate cardinalityを維持する。
- Assistantはraw Markdown descendant countをroot cardinalityにせず、root-most candidateをexactly 1要求する。
- Assistantのnested partial Markdown matchはroot cardinalityに含めず、それだけではFail Closedしない。
- Assistant selected rootがturn-level operation groupを包含した場合はFail Closedするが、root内buttonの存在だけではroot selectionをFailさせない。
- `expectedOrdinals`未指定時はordinal sequenceを推測せず、`ordinalSequenceMatches=null`とする。
- 不正な`expectedOrdinals`は`GROUND_TRUTH_INPUT_ERROR`でvalidation input errorとして停止し、TV-001のFAILと混同しない。
- `runtimeOrderingValid`はruntime ordinalとmounted snapshot DOM orderの整合を表し、Conversation completenessを表さない。

## Files

- `tv001-poc.mjs`: browser captureとruntime accumulator / comparator
- `tv001-poc.selftest.mjs`: DOM非依存ロジックの最小self-test

## Local checks

```powershell
node --check spikes/TASK-001-standard-chat-dom/poc/tv001-poc.mjs
node spikes/TASK-001-standard-chat-dom/poc/tv001-poc.selftest.mjs
```

実画面検証では`captureMountedTurns`を認証済みChrome tab内でread-only実行し、返却されたraw content / runtime identifierはメモリ内比較後に破棄する。ファイルやGit Evidenceへ永続化しない。
