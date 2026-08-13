# Technical Validation Plan
## ChatGPT to Notion Conversation Exporter

- **Target**: MVP v1.0
- **Status**: Draft
- **Phase**: Phase 0 - Technical Spike
- **Last Reviewed**: 2026-08-12

目的は「きれいな製品コード」を作ることではなく、要件を成立させるための技術仮説を早期に検証すること。  
PoCコードは製品コードと分離し、そのまま本実装へ流用することを前提にしない。

---

## 1. PoC成果物
推奨:
```text
spikes/
└─ chatgpt-dom/
   ├─ standard-chat/
   ├─ project-chat/
   ├─ long-chat/
   ├─ sources/
   ├─ attachments/
   └─ notion-api/

docs/
└─ 05_technical-validation-plan.md
```

検証ごとに以下を記録する。
- Validation ID
- Hypothesis
- Setup
- Result
- Verdict: PASS / CONDITIONAL / FAIL
- Evidence
- Requirement impact
- ADR / Risk impact

---

## 2. Validation Items

### TV-001 Standard Chat Message DOM
**Hypothesis**: Standard ChatでUser / Assistant Messageを安定して列挙できる。  
**Method**:
- 短い会話
- 20+ Message
- code / list / quote含有
- reload後
でDOMを比較。  
**Pass**: Message順序・role・本文を再現可能。  
**Related**: FR-005, FR-009, RISK-001

### TV-002 Standard Chat Title
**Hypothesis**: Current conversation titleを安定取得できる。  
**Pass**: reload / navigation後も一致。  
**Fail impact**: FR-011のMust成立性。  
**Related**: RISK-028

### TV-003 Conversation ID
**Hypothesis**: Current tab URL等からConversation IDを一意に取得・検証できる。  
**Pass**: Standard / Projectで安定。  
**Fail impact**: Identity設計再検討。  
**Related**: FR-004, RISK-029

### TV-004 Project Chat Detection / Project Name
**Hypothesis**: Project ChatをStandardと識別し、Project Nameを取得できる。  
**Pass**: 複数Project、reload、Project間移動で誤認なし。  
**Fail impact**: Project NameのMust要件または取得方式をADR再検討。  
**Related**: FR-006, FR-011, RISK-003, RISK-004

### TV-005 Long Conversation Lazy Loading
**Hypothesis**: 長大会話で過去MessageをDOMへ読み込ませられる。  
**Method**: 100 / 200 Message級を用意し、上端・下端を含む取得を検証。  
**Pass**: fixture / expected countと一致。  
**Fail impact**: FR-008の成立方式再検討。  
**Related**: RISK-002

### TV-006 Completeness Signal
**Hypothesis**: 「全Conversation取得済み」を判定する安全な条件を定義できる。  
**Pass**: 不完全状態をCompleteと誤判定しない。  
**Fail impact**: MVPをBlockする可能性。  
**Related**: NFR-001

### TV-007 Branch / Regenerate / Edited Message
**Hypothesis**: 現在表示BranchのMessage列を取得でき、Branch変更時にPrefix mismatchを検出できる。  
**Method**: regenerate、user edit、branch switch。  
**Pass**: 既存保存状態と異なる場合に通常Diffを止められる。  
**Related**: FR-038, FR-039

### TV-008 Formatting Structure
**Hypothesis**: paragraph / heading / list / quote / code / linkを意味単位で取得できる。  
**Pass**: DOM構造からContentBlockへ安定変換可能。  
**Related**: FR-015, FR-027

### TV-009 Code Language
**Hypothesis**: Code blockのlanguage hintを取得可能なケースを識別できる。  
**Pass**: 取得可能時は保持、不能時はunknownとして扱える。  
**Related**: FR-028

### TV-010 Sources / Citations
**Hypothesis**: Assistant Messageに紐づくSource URL / labelを取得できる。  
**Pass**: Message associationを誤らない。  
**Conditional**: 一部UI種のみ取得可でも可。取得不能はWarning。  
**Related**: FR-029, RISK-018

### TV-011 Attachments
**Hypothesis**: 添付Name / Typeを取得可能な場合を識別できる。  
**Pass**: 本体を取得せずMetadataのみ抽出。  
**Related**: FR-030

### TV-012 Message Timestamp
**Hypothesis**: Message timestampがDOMに信頼できる形で存在する。  
**Pass**: 表示・内部値から確定できる。  
**Fail**: MVPでは保存しない。推測禁止。  
**Related**: FR-012

### TV-013 Notion Database → Data Source Resolution
**Context**: 現行Notion APIではDatabaseがData Sourceを持ち、SchemaはData Source側にある。  
**Hypothesis**: ユーザーがDatabase IDだけを指定しても、MVP対象を安全に一意解決できる。  
**Cases**:
- 1 Database / 1 Data Source
- 1 Database / multiple Data Sources
- integration access不足
- Data Source rename
**Pass candidate**:
- 1件なら自動解決可能
- 複数ならFail Closed、またはSettingsへData Source選択を追加するADRを起票
**Related**: FR-063, FR-067, ADR-022, RISK-011

### TV-014 Notion Schema Diagnostics
**Hypothesis**: Data Source propertiesからRequired Property Name / Typeを検証できる。  
**Pass**: 不足・型違いを具体的に指摘できる。  
**Related**: FR-064, FR-065

### TV-015 Notion Managed Area
**Hypothesis**: 子Blockを持てる親BlockをManaged Areaとして安定利用でき、配下へ継続appendできる。  
**Pass**: Managed Area外Blockを変更せず追記可能。  
**Related**: FR-025

### TV-016 Notion Append limits / rate control
**Hypothesis**: APIのBlock append上限・Rate Limitを尊重したBatch戦略を実装できる。  
**Pass**: 長文を複数Requestで保存し、429時に安全にretryできる。  
**Related**: FR-053, FR-055

### TV-017 Popup / Service Worker Lifecycle
**Hypothesis**: Popup closeやService Worker stop後でもJob Stateを復元できる。  
**Method**: 書き込み途中にPopup close / worker停止を再現。  
**Pass**: Global variable依存なし。Resumeまたは安全停止。  
**Related**: FR-056〜059, RISK-008

### TV-018 `chrome.storage.session` suitability
**Hypothesis**: Conversation本文の一時保持にsession storageを利用可能で、persistent localへ本文を残さず処理できる。  
**Pass**: Content Script / Service Worker間のaccess設計と容量実測がMVP用途に適する。  
**Conditional**: 容量・context制約が不適ならin-memory + reparse等へ変更。  
**Related**: §7

### TV-019 Permission Minimum Set
**Hypothesis**: `storage` + `activeTab` + 必要最小host / scriptingで機能成立する。  
**Pass**: 不要な広範host permissionなしでStandard / Project / Notion APIを扱える。  
**Related**: NFR-004

### TV-020 Hash Canonicalization
**Hypothesis**: DOM表現差を吸収し、意味変更を検出できるCanonical representationを定義できる。  
**Method**:
- class-only change
- whitespace-only paragraph change
- code indent change
- URL change
- Message text change
**Pass**: 意味上の変更のみHash差として検出。  
**Related**: FR-016, FR-017

---

## 3. Phase 0 Exit Criteria

Phase 1へ進むには最低限以下を満たす。

### Required PASS
- TV-001 Standard Chat Message DOM
- TV-002 Title
- TV-003 Conversation ID
- TV-004 Project Detection / Project Name
- TV-005 Long Conversation loading
- TV-006 Completeness Signal
- TV-007 Branch mismatch detection
- TV-013 Data Source resolution方針確定
- TV-014 Schema diagnostics
- TV-015 Managed Area
- TV-017 Worker lifecycle recovery
- TV-019 Minimum permissions
- TV-020 Hash canonicalization

### Conditional / Carry Allowed
Must機能を壊さない範囲で以下はConditional/Failでも次Phaseへ持ち越し可。
- TV-009 Code language detail
- TV-010 Sources
- TV-011 Attachment detail
- TV-012 Message timestamp
- TV-018 session storage具体方式

ただし持ち越す場合はRiskとFallbackを明示する。

---

## 4. PoC結果テンプレート

```markdown
### TV-XXX Title
- Date:
- Environment:
- Chrome Version:
- ChatGPT UI condition:
- Hypothesis:
- Result:
- Verdict: PASS / CONDITIONAL / FAIL
- Evidence:
- Known Limitations:
- Requirement Impact:
- ADR Impact:
- Risk Impact:
- Next Action:
```

---

## 5. Baseline Review
Phase 0終了時:
1. 各TV結果をレビュー
2. 未成立仮説を特定
3. Requirementを変えるのかHowだけ変えるのかを判断
4. ADR / Risk / Acceptance Testを更新
5. `01_product-requirements.md` をDraft→Baselineへ昇格可否判断
