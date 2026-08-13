# Risk Register
## ChatGPT to Notion Conversation Exporter

- **Target**: MVP v1.0
- **Status**: Draft
- **Last Reviewed**: 2026-08-12

評価:
- Probability: Low / Medium / High
- Impact: Low / Medium / High / Critical

---

| ID | Risk | Probability | Impact | Detection | Prevention | Recovery / Response | Related |
|---|---|---|---|---|---|---|---|
| RISK-001 | ChatGPT DOM変更でParser不能 | High | High | Parser validation / fixture failure / Metadata欠落 | Adapter分離、Source別Parser、fixture tests | Adapter修正。保存はFail Closed | FR-005〜011 |
| RISK-002 | Lazy Load等で会話先頭/末尾が欠落 | Medium | Critical | Completeness validator | 自動load/scroll、boundary確認 | 保存停止、再取得 | FR-008 |
| RISK-003 | Project Chat DOMがStandardと大きく異なる | Medium | High | Technical Spike | Source detector + separate Adapter | Project Adapter独立修正 | FR-006 |
| RISK-004 | Project Nameを安定取得できない | Medium | High | Metadata validation | 複数画面fixture / 実機検証 | Must要件見直しまたは取得方式変更。勝手に推測しない | FR-011, TV-004 |
| RISK-005 | Branch変更により既存Prefixが変化 | Medium | High | Message Count / Sync Hash / Prefix compare | Visible branch前提、差分前検証 | Recovery Menu / Rebuild / New Version | FR-038, FR-039 |
| RISK-006 | 同一Conversationへの二重実行で重複追記 | Medium | High | Job lock / final sync recheck | Conversation lock、idempotency check | 不整合停止・Job recovery | FR-051, FR-052 |
| RISK-007 | Notion API書き込み途中で中断 | Medium | High | Pending Job / checkpoint | Batch単位、formal commit後置 | Resume検証、一致時のみ続行 | FR-053, FR-057〜059 |
| RISK-008 | MV3 Service Worker停止 | High | Medium | Job state remains incomplete | Persistent checkpoint、global state依存禁止 | Wake後に再検証・再開 | FR-057 |
| RISK-009 | Notion Rate Limit | Medium | Medium | HTTP 429 / error code | Request pacing / batching | Retry-After尊重、recoverable retry | FR-054, FR-055 |
| RISK-010 | Notion Schema変更 | Medium | High | Connection/schema diagnostics | Fixed schema、毎保存前重要項目検証 | 保存停止、具体的修正案表示 | FR-064, FR-065 |
| RISK-011 | Notion Databaseに複数Data Sourceがあり対象不明 | Low-Medium | High | DB/Data Source discovery | Technical Spikeで解決規則決定 | Fail Closed、設定方式変更をADR判断 | FR-067, ADR-022 |
| RISK-012 | Integration権限喪失 / Page削除 | Low-Medium | High | Page query/access error | 接続診断 | 自動再作成禁止。権限診断後にユーザー判断 | FR-049 |
| RISK-013 | 複数Current Version | Low | Critical | Queryで重複検出 | Version state transition、事前再確認 | 保存停止、Notion側修正後再診断 | FR-042 |
| RISK-014 | Version切替途中でPartial Failure | Low-Medium | High | PREPARING / ACTIVE invariant validation | 旧ACTIVE維持、新版PREPARINGから開始 | FAILED化 / Stale診断、旧ACTIVEを保持 | FR-043〜046 |
| RISK-015 | Formatting変換で意味が失われる | Medium | High | Unsupported detector | Content type別converter | Placeholder + Warning + user decision | FR-010, FR-027 |
| RISK-016 | Unsupported要素をSilent Drop | Medium | Critical | Parser unknown-node detection | Saved/Ignored/Unsupported classification | 保存Warning / block if incomplete | FR-010 |
| RISK-017 | Code blockのIndent/改行破損 | Low-Medium | High | fixture comparison | Code専用Normalization | Plain generic code fallback、warning | FR-016, FR-028 |
| RISK-018 | Citation / Source associationを誤る | Medium | Medium | Source fixture tests | Assistant message単位に関連付け | 取得不能なら本文保存、Sourceはwarning | FR-029 |
| RISK-019 | 添付ファイル本体も保存されたと誤認 | Medium | Medium | UI/placeholder表示 | 「Metadata only」を明示 | Notion本文に本体未転送表示 | FR-030 |
| RISK-020 | TokenがGit/Logへ漏洩 | Low | Critical | Code review / grep / log tests | Settings入力、log sanitizer、`.gitignore` | Token再発行、履歴除去 | FR-062, FR-069 |
| RISK-021 | `chrome.storage.local`を暗号Vaultと誤認 | Low | High | Security review | Threat model明記 | Token rotate、将来secure storage検討 | ADR-017 |
| RISK-022 | Chrome Storageに会話本文が残留 | Low-Medium | High | storage inspection test | body session-only、structured job metadata only | Clear storage、implementation fix | §7 |
| RISK-023 | Settings schema updateで旧設定が読めない | Medium | Medium | version mismatch | Settings schema version + migration | backward-compatible migration / reset guide | NFR |
| RISK-024 | Extension update後にDOM/Notion互換性が崩れる | Medium | High | post-update validation | settings migration + schema check + Adapter validation | 保存停止、修正Guide | NFR |
| RISK-025 | 200+ Messageで処理が極端に遅い | Medium | Medium | timing metrics | Parser/Network時間分離、batching | Warning / timeout / performance backlog | NFR-007 |
| RISK-026 | UserがManaged Area外の本文を編集し、それをExtensionが消す | Low | High | Block ID boundary check | Managed Areaのみwrite | 操作停止、block hierarchy再診断 | FR-025 |
| RISK-027 | UserがManaged Area内を手動編集しPrefix検証と矛盾 | Medium | High | Notion state/hash mismatch | Managed AreaはExtension管理と明記 | Recovery / Rebuild / New Version | FR-033, FR-047 |
| RISK-028 | ChatGPT UI上のTitle取得失敗 | Medium | High | metadata validator | multiple selector strategy in Adapter | 保存停止、Adapter修正 | FR-011 |
| RISK-029 | Conversation ID取得方式がUI変更で壊れる | Medium | Critical | URL/ID consistency validator |複数安定ソースのSpike | 保存停止、Adapter修正 | FR-004 |
| RISK-030 | 要件変更でADR/Testが古いまま残る | Medium | High | traceability review | change management rule | 影響分析し同期更新 | NFR-011 |

---

## Top Risks for Phase 0
優先検証対象:
1. RISK-001 DOM変更耐性
2. RISK-002 長大会話完全性
3. RISK-003 Project Chat構造差
4. RISK-004 Project Name取得
5. RISK-011 Notion Data Source解決
6. RISK-029 Conversation ID安定取得

---

## Risk Acceptance Rule
- Critical Impactかつ未軽減のRiskがMust要件へ影響する場合、次Phaseへ持ち越さない。
- Technical Spikeで不成立となった仮説は、要件を黙って変更せずADR / Requirement Changeとして扱う。
