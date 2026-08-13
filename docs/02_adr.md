# Architecture Decision Records
## ChatGPT to Notion Conversation Exporter

- **Target**: MVP v1.0
- **Status**: Draft
- **Last Reviewed**: 2026-08-12

ADRは「なぜその方針を選んだか」を残す。詳細な実装方法ではなく、変更時に再評価すべき主要判断を記録する。

---

## ADR-001: 個人ローカル利用をMVPとする
**Status**: Accepted  
**Decision**: Google ChromeのUnpacked Extensionとして本人がローカル利用する。Chrome Web Store公開はMVP対象外。  
**Why**: 公開審査、配布、Telemetry、複数ユーザーSecurity等を切り離し、目的機能の成立を優先する。  
**Consequences**: Windows + Chromeのみ公式サポート。

---

## ADR-002: 保存操作はPopupから明示的に開始する
**Status**: Accepted  
**Decision**: 自動保存せず、ユーザーの明示操作で保存する。  
**Why**: 意図しない保存、Branch競合、ChatGPT編集中の不安定状態を避ける。  
**Rejected**: 完全自動同期。  
**Related**: FR-002, NFR-002

---

## ADR-003: 1 Conversation Version = 1 Notion Page
**Status**: Accepted  
**Decision**: Conversation単位でNotion Pageを作成し、全文はPage bodyに保存する。  
**Why**: 会話の文脈を保った閲覧・知識再利用に適する。  
**Related**: FR-024

---

## ADR-004: DOM取得と意味解析をAdapter / Parserで分離する
**Status**: Accepted  
**Decision**: DOM selectorをSource Adapterへ閉じ込め、ParserはConversationModelを生成する。  
**Why**: ChatGPT DOM変更の影響範囲を局所化する。  
**Related**: FR-005, FR-006, NFR-005

---

## ADR-005: DOM全取得 + Notion差分追記方式を採用する
**Status**: Accepted  
**Decision**: 再保存時もChatGPT側はConversation全体を取得し、既存保存済みPrefixと比較して新規Messageのみ追記する。  
**Why**: ChatGPT DOM上で増分だけを直接取得するより整合性検証がしやすく、Notion側の不要な全文置換を避けられる。  
**Rejected**: 通常時の全文置換。  
**Related**: FR-007, FR-033, FR-036

---

## ADR-006: 不整合時はFail Closedする
**Status**: Accepted  
**Decision**: Message Count減少、Prefix不一致、Current重複、必須Metadata欠落等で自動書き込みしない。  
**Why**: Silent Data Loss / Duplicateを防ぐ。  
**Related**: FR-034, FR-035, FR-042, NFR-001

---

## ADR-007: Notionを正式Sync StateのSource of Truthとする
**Status**: Accepted  
**Decision**: 正式なMessage Count / Sync Hash / Current Version等はNotion側を正とし、Chrome StorageはCache / Pending Job用とする。  
**Why**: Browser Cache削除や複数起動による状態ずれに耐える。  
**Related**: FR-032

---

## ADR-008: Managed Area方式を採用する
**Status**: Accepted  
**Decision**: Notion Page内に拡張機能専用の親Blockを設け、その配下のみ変更する。  
**Why**: ユーザーがPage外側へ追記した内容を壊さない。  
**Related**: FR-025

---

## ADR-009: Version State Machineを持つ
**Status**: Accepted  
**Decision**: `PREPARING / ACTIVE / ARCHIVED / FAILED` と `Is Current` を管理する。  
**Why**: 新Version構築途中の失敗でCurrentを失わない。  
**Invariant**: 正常状態では同一Conversation IDにACTIVE/Currentは最大1件。  
**Related**: FR-040〜FR-046

---

## ADR-010: Popup / Content Script / Service Workerを責務分離する
**Status**: Accepted  
**Decision**:
- Popup: UI
- Content Script: DOM
- Service Worker: Notion API / Job / Settings
- Domain: Model / Validation / Hash
**Why**: Manifest V3の実行コンテキストと責務を整合させ、Testabilityを確保する。  
**Related**: Architecture §9

---

## ADR-011: Service Worker停止を通常事象として扱う
**Status**: Accepted  
**Decision**: PopupやService Workerの継続生存を前提にせず、Job checkpointを保存して復旧可能にする。  
**Why**: Manifest V3 Extension Service Workerは停止・再起動され得るため。  
**Related**: FR-056〜FR-059

---

## ADR-012: Basic FormattingをMVPとする
**Status**: Accepted  
**Decision**: Paragraph / Heading / List / Quote / Code / Linkを優先する。  
**Why**: 意味構造を保ちつつ、特殊表現への依存を抑える。  
**Fallback**: Formatting-only failureはPlain textへ安全にFallback + Warning。意味喪失はUnsupported扱い。  
**Related**: FR-027

---

## ADR-013: Unsupported ContentをSilent Dropしない
**Status**: Accepted  
**Decision**: Unsupportedを検出し、Placeholder・Warningを出してユーザー判断とする。  
**Why**: 「保存できたように見える欠損」を防ぐ。  
**Related**: FR-010

---

## ADR-014: Conversation IDをシステムキー、URLを人間向け導線とする
**Status**: Accepted  
**Decision**: IdentityはConversation IDを中心に扱い、URLは元Conversationへのnavigationに用いる。  
**Why**: URL文字列だけへの依存を避ける。  
**Related**: FR-004, FR-031

---

## ADR-015: Category / Tagsの候補はNotion Schemaを正とする
**Status**: Accepted  
**Decision**: CategoryはSelect既存Optionのみ、TagsはMulti-select既存Option + 新規入力。  
**Why**: Notion上の管理語彙とExtension内マスタの二重管理を避ける。  
**Related**: FR-021, FR-022

---

## ADR-016: 固定Notion Schemaから開始する
**Status**: Accepted  
**Decision**: MVPは標準Property名・型を固定し、Property Mappingは将来機能。Schema不一致は診断・保存停止。  
**Why**: Mapping UIと設定複雑性をMVPから外す。  
**Related**: FR-064, FR-065

---

## ADR-017: Tokenは設定入力 + Chrome Storage
**Status**: Accepted  
**Decision**: TokenはSource Codeに含めず、Settingsから入力してExtension Storageに保存する。  
**Why**: GitへのSecret混入を防ぐ。  
**Security note**: ローカルStorageを暗号化Vaultとして扱わない。端末自体の信頼を前提とするMVP。  
**Related**: FR-061, FR-062, NFR-003

---

## ADR-018: 外部Telemetryを導入しない
**Status**: Accepted  
**Decision**: MVPはLocal structured logsのみ。  
**Why**: 個人利用のため外部送信の必要性がない。  
**Related**: NFR-010

---

## ADR-019: TypeScript + Manifest V3 + Lightweight UI
**Status**: Accepted  
**Decision**: TypeScriptを採用し、PopupはHTML/CSS/TSを基本とする。React等はMVP必須としない。  
**Why**: 小規模ExtensionでのBuild / Type safety / 責務分離を優先する。  
**Related**: NFR-009

---

## ADR-020: HashはCanonical ConversationModelから生成する
**Status**: Accepted  
**Decision**: DOMそのものではなく正規化済みModelのstable representationからSHA-256 Hashを生成する。  
**Why**: DOM class変更等の表示実装差分をSync差分として誤認しない。  
**Related**: FR-016, FR-017

---

## ADR-021: per-message Hashは比較単位、Aggregate HashはCommitted状態識別子とする
**Status**: Draft / Detailed Design Candidate  
**Decision candidate**: per-message Hashは処理中の比較・再開判定に利用し、Notionの正式PropertyにはAggregate Sync Hashを保存する。必要なcheckpoint HashはPending Jobへ保存する。  
**Why**: 全Message Hashを単一Notion Propertyへ永続化するとサイズ・管理が複雑になるため。  
**Note**: Q79で「per-message + aggregate」を採用済みだが、永続化位置は詳細設計で確定する。  
**Related**: FR-017, FR-058

---

## ADR-022: Notion Database入力を維持し、Data Source解決を内部化する
**Status**: Draft / Technical Validation Required  
**Context**: 現行Notion APIではDatabaseが1つ以上のData Sourceを持ち、SchemaはData Sourceに属する。  
**Decision candidate**: ユーザー入力はDatabase IDのままとし、Extensionが対象Data Sourceを解決する。  
**Fail-safe**: 複数Data Source等で一意に決定できない場合は保存停止する。  
**Related**: FR-063, FR-067, TV-013

---

## ADR-023: 初版文書はDraft、Technical Spike後にBaseline化する
**Status**: Accepted  
**Decision**: Phase 0終了後に要件・仮説をレビューしてBaselineへ昇格する。  
**Why**: ChatGPT DOMの技術成立性を未検証のまま確定仕様扱いしない。  

---

## ADR-024: 文書本文は日本語、Technical Identifierは英語
**Status**: Accepted  
**Decision**: 説明は日本語。Requirement ID、型、State、Error Code、Code identifierは英語。  
**Why**: 人間の読みやすさとCodex / GitHub / Codeの対応を両立する。  

---

## ADR-025: Product名にSyncを使わない
**Status**: Accepted  
**Decision**:
- Product: `ChatGPT to Notion Conversation Exporter`
- Repository: `chatgpt-notion-exporter`
**Why**: MVPは双方向同期でも完全自動同期でもないため、製品名による過大表現を避ける。
