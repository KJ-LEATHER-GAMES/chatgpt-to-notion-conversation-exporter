# ChatGPT to Notion Conversation Exporter
## 企画書兼要件定義書

- **日本語名称**: ChatGPT会話 Notion転送ツール
- **Repository**: `chatgpt-notion-exporter`
- **Target Version**: MVP v1.0
- **Status**: Draft
- **Last Reviewed**: 2026-08-12
- **Document Role**: 全体仕様の正本（Source of Truth）

---

## 1. 企画概要

### 1.1 背景
ChatGPT上で行った検討・相談・技術調査・意思決定は、その場では有用でも、後から体系的に検索・整理・再利用しにくい。  
本ツールは、現在開いているChatGPT会話をユーザーの明示操作でNotionへ転送し、会話を知識資産として蓄積するためのGoogle Chrome拡張機能である。

### 1.2 最上位目的
**ChatGPTで行った有用な会話を、Notion上で検索・整理・再利用可能な知識資産として蓄積する。**

バックアップ効果は副次的効果と位置づけ、本ツール自体を完全バックアップ製品とは定義しない。

### 1.3 対象利用者
- MVPは開発者本人による個人利用
- ローカル環境でのGoogle Chrome Desktop利用
- Windowsを公式サポート対象とする
- Chrome Web Store公開はMVP対象外

### 1.4 成功条件
MVPの成功判定は2段階とする。

#### Gate 1: 技術的完成
- Must要件がすべて実装済み
- Must要件に対応するAcceptance TestがすべてPass
- 正常系で重大な欠損・重複がない
- 主要異常系でFail Closedできる

#### Gate 2: 実用性確認
一定期間の個人利用を通じて以下を確認する。
- 通常会話とProject会話を実用的に保存できる
- 差分追記が安定して動作する
- 保存操作の負担が許容範囲である
- Notion上で会話を検索・再利用できる
- 致命的なデータ破損・意図しない上書きが発生しない

---

## 2. 用語・定義

| 用語 | 定義 |
|---|---|
| Conversation | ChatGPT上の1つの会話系列。Conversation IDで識別する |
| Message | UserまたはAssistantによる1発言。差分判定の主単位 |
| ContentBlock | 1 Message内の段落、見出し、リスト、コード、リンク等の意味単位 |
| Standard Chat | 通常のChatGPT会話 |
| Project Chat | ChatGPT Projects内の会話 |
| Source Type | `Standard` または `Project` |
| Conversation ID | ChatGPT会話を識別するシステムキー |
| Current Version | 同一Conversation ID系列で、通常の差分追記対象となる現在有効なNotionページ |
| Version | 同一Conversation ID内の版番号。新規版は `max(Version)+1` を候補とする |
| Version State | `PREPARING` / `ACTIVE` / `ARCHIVED` / `FAILED` |
| Sync | 本プロジェクトではChatGPT→Notion方向の状態整合を指す。双方向同期・完全自動同期を意味しない |
| Diff Append | ChatGPTから全Conversationを再取得し、保存済みPrefixと整合する場合に新規MessageのみNotionへ追記する方式 |
| Rebuild | 既存ページの管理領域を現在の会話全文から再構築する明示的な復旧操作 |
| Incomplete Capture | 本来存在する会話全体を完全に取得できた保証がない状態。保存禁止 |
| Unsupported Content | 会話自体は取得できたが、MVPで意味内容を完全変換できない要素。警告・Placeholder・ユーザー判断で保存可能 |
| Ignored Content | UIボタン等、会話本文ではないため意図的に保存しない要素 |
| Pending Job | Notion書き込みが正式Commit前に中断した処理状態 |
| Sync State | 正式保存済み状態を表すMessage Count、Sync Hash等のメタデータ |
| Managed Area | Notionページ内で拡張機能だけが管理する専用コンテナ領域 |
| Technical Spike | 未検証技術仮説を本実装前に検証する独立PoC |
| Baseline | Technical Spike後のレビューを経て実装基準として確定した文書状態 |

### 2.1 類似概念の使い分け
- `Incomplete Capture` は「取得完全性を保証できない」ため保存禁止。
- `Unsupported Content` は「存在は検出できたが完全変換できない」ため、内容を隠さず警告してユーザー判断。
- `Sync` は片方向の状態整合であり、双方向同期ではない。
- `Version` はConversation系列内の版であり、ChatGPT側のBranchそのものを保存する識別子ではない。

---

## 3. スコープ

### 3.1 Must
- Google Chrome Desktop / Windows
- Manifest V3 / TypeScript
- 現在開いているStandard Chatの保存
- Project Chatの保存
- Popup起点の明示的保存
- Conversation全体のDOM取得
- DOM取得完全性の検証
- ConversationModelへの正規化
- Notionへの新規保存
- 保存済みConversationへの差分追記
- Prefix不整合時の自動更新停止
- Version作成・Current管理
- タイトル、Category、Tags、ChatGPT URL、Conversation ID、Source Type、Project Name等の保存
- Notion側Schema診断
- Category / Tags候補をNotion Schemaから取得
- Unsupported Contentの警告
- 基本的なMarkdown相当構造の保存
- Code Block言語情報の保持（取得可能な場合）
- Sourcesリンクの保持（取得可能な場合）
- 添付ファイルのメタデータ保存
- Job State / Retry / Cancel / Recovery
- 構造化ローカルログ
- Fail Closed
- Acceptance Test
- Parser Fixture Test
- Technical Spike

### 3.2 Should
- 詳細Preview
- Icon Badge等による未同期件数表示
- より豊富なFormatting
- Settings Export（Token除外）
- ローカルSecret Detection + 警告
- 複数Notion DB対応
- Property Mapping

### 3.3 Could
- 選択Messageのみ保存
- 画像本体転送
- 添付ファイル本体転送
- 数式・特殊カード等の完全変換
- ChatGPT画面内UI挿入
- 自動保存・半自動通知
- Chrome Web Store公開
- 他Chromiumブラウザ対応
- DB間Migration
- 複数ユーザー利用
- 外部Telemetry

### 3.4 Non-Goals
| 非目標 | 理由 |
|---|---|
| 完全自動同期 | 意図しない保存、Branch競合、誤更新を避ける |
| 双方向同期 | MVPの知識資産化目的に不要 |
| Notion DB Schema自動修復 | ユーザー管理領域を勝手に変更しない |
| 添付ファイル本体転送 | 会話転記というMVP責務を超える |
| ChatGPT画面へのUI挿入 | DOM依存・保守リスクを増やさない |
| Chrome Web Store公開 | 個人ローカル利用を先に成立させる |
| Notion DB間Migration | 既存Conversationは元DBへBoundする |
| 会話の完全バックアップ製品化 | 本目的は知識資産化であり復元保証ではない |

Non-Goalを将来実装へ昇格させる場合は要件変更として扱う。

---

## 4. 主要ユースケース

### UC-001 新規会話を保存
1. ユーザーが保存対象のChatGPT会話を開く。
2. Extension Popupを開く。
3. Extensionが対象ページを検証する。
4. Content ScriptがDOMからConversation全体を取得する。
5. Parser / ValidatorがConversationModelを生成・検証する。
6. Popupにタイトル、Category、Tags、取得状態、Previewを表示する。
7. ユーザーが必要に応じてタイトル等を編集する。
8. Notion接続・Schemaを検証する。
9. 新規ページを作成し、Managed Areaへ本文を保存する。
10. Sync StateをCommitする。
11. 保存結果と「Open in Notion」を表示する。

### UC-002 保存済み会話を差分更新
1. Conversation IDからCurrent Versionを検索する。
2. Notion側Sync Stateを正とし、Chrome Cacheと照合する。
3. ChatGPT側Conversation全体を再取得する。
4. 保存済みPrefixの整合性を検証する。
5. 整合する場合、新規Messageのみ追記する。
6. 全書き込み成功後にMessage Count / Sync Hash / Last Sync At等を更新する。

### UC-003 不整合を復旧
Prefix不一致、Message Count減少、Current重複、Currentページ消失等を検出した場合、自動更新を停止し以下を提示する。
- 再チェック
- Rebuild
- 新Versionとして保存
- Cancel

### UC-004 Unsupported Contentを含む会話
- 会話取得自体が完全なら保存候補として扱う。
- 対応できない要素をPlaceholder表示し、警告件数を示す。
- ユーザーが保存可否を判断する。
- Incomplete Captureなら保存不可。

---

## 5. 機能要件

### 5.1 対象ページ・起動

#### FR-001 [Must] 対応ページ
Standard ChatおよびProject ChatをMVP対象とする。

#### FR-002 [Must] 保存起点
保存処理はExtension Popupからユーザーの明示操作で開始する。

#### FR-003 [Must] 非対応ページ
非ChatGPTページまたは対応Conversationページでない場合、保存ボタンを無効化し、ChatGPTトップを開く導線・Settings・Logsを表示する。

#### FR-004 [Must] URL取得
ChatGPT URLは現在のブラウザTabから取得し、対応URLであること、およびConversation IDとの整合性を検証する。URLを推測生成しない。

### 5.2 DOM取得・解析

#### FR-005 [Must] DOM責務分離
DOMセレクタはSource Adapterに閉じ込め、意味解析と分離する。

#### FR-006 [Must] Source別Adapter
Standard ChatとProject Chatを識別し、必要に応じて別Adapterで取得する。

#### FR-007 [Must] Conversation全体取得
差分更新時もChatGPTからConversation全体を再取得する。

#### FR-008 [Must] 長大会話
Lazy Load等がある場合は必要な読み込み操作を行い、取得完全性を検証する。完全性を確認できない場合は保存しない。

#### FR-009 [Must] Message抽出
意味のあるUser / Assistant Messageを抽出し、操作UIを除外する。

#### FR-010 [Must] Content分類
取得要素を `Saved` / `Ignored` / `Unsupported` に分類する。

#### FR-011 [Must] Metadata必須
取得対象として必須と定義したMetadataが取得できない場合は保存禁止とする。
- Standard Chat: Title、Conversation ID、URL等
- Project Chat: 上記 + Project Name
取得可否はTechnical Spikeで確定する。

#### FR-012 [Should] 発言日時
Message timestampは信頼できる場合のみ保持する。推測・補完しない。

### 5.3 ConversationModel

#### FR-013 [Must] 中間モデル
DOMから直接Notion Blockを作らず、DOM非依存のConversationModelを介する。

#### FR-014 [Must] Speaker構造
内部Modelは `role` を持ち、NotionではSpeaker名 + 本文 + Separatorとして描画する。

#### FR-015 [Must] ContentBlock
1 Messageを必要に応じて複数ContentBlockへ分解し、Notion側の1 Block制約とMessage境界を分離する。

#### FR-016 [Must] 正規化
Hash生成前にContent Type別のCanonical Normalizationを行う。
- Paragraph: 意味に影響しない前後空白を正規化
- Code: 改行・Indentを保持
- Link: 表示文字列 + URL
- Attachment: Name + Type
- Source: 表示情報 + URL
DOM Class、Notion Block ID、保存日時等はHash対象外とする。

#### FR-017 [Must] Hash
Canonical ModelからSHA-256ベースのHashを生成する。
- Message Hash
- Conversation Aggregate Sync Hash

### 5.4 Preview・入力

#### FR-018 [Must] Popup入力
タイトル、Category、TagsをPopupで確認・編集できる。

#### FR-019 [Must] 初回Title
初回保存時はChatGPT Titleを編集可能な初期値とする。

#### FR-020 [Must] 再保存Title
既存Conversationの再保存ではNotion側Titleを保持し、ChatGPT Titleで自動上書きしない。

#### FR-021 [Must] Category
Categoryは必須。設定可能なDefault Categoryを持ち、Notionの既存Select Optionのみ選択可能とする。

#### FR-022 [Must] Tags
Tagsは任意。Notion Multi-select既存Optionを候補表示し、新規Tag入力を許可する。

#### FR-023 [Must] Preview
通常は簡易Previewを表示する。
- Metadata
- Capture Status
- Unsupported Count
- First / Last Messageの概要
詳細Previewは必要時に開ける。

### 5.5 Notion新規保存

#### FR-024 [Must] 1 Conversation 1 Current Page
1つのConversation Versionにつき1 Notion Pageを作成する。

#### FR-025 [Must] Managed Area
ページ本文内に拡張機能専用のManaged Areaを設け、拡張機能はその配下のみ管理する。Managed Area外のユーザー追記を変更しない。

#### FR-026 [Must] Body Header
本文先頭に元ChatGPT会話へのリンクを配置する。DB Propertyと同内容のMetadataを本文へ過度に重複させない。

#### FR-027 [Must] Basic Formatting
MVPでは段落、見出し、リスト、引用、Code、Link等の基本構造を可能な範囲で保持する。

#### FR-028 [Must] Code Language
ChatGPT側からCode Languageが取得できる場合は保持し、Notion対応言語へMappingする。未知・非対応ならGeneric CodeへFallbackし、言語を推測しない。

#### FR-029 [Must] Sources
Assistant Messageに関連するCitation / Source Linkを取得可能な場合に保持する。取得不能でも会話本文保存自体は可能とする。

#### FR-030 [Must] Attachments
添付ファイル本体は転送せず、取得可能な範囲でName / Type等のMetadataと「本体未転送」を記録する。

### 5.6 差分追記

#### FR-031 [Must] 既存Conversation判定
Conversation ID + Current Versionを使って既存保存を判定する。

#### FR-032 [Must] Notion Truth
正式な保存状態はNotion側Sync Stateを正とし、Chrome側はCacheとして扱う。

#### FR-033 [Must] Prefix検証
差分追記前に、現在のConversationの保存済みPrefixが既存Sync Stateと整合することを検証する。

#### FR-034 [Must] Message Count減少
現在Message Countが保存済みCountより少ない場合、自動更新しない。

#### FR-035 [Must] Prefix不一致
保存済みPrefixに変更がある場合、自動差分追記を停止しRecoveryへ移行する。

#### FR-036 [Must] Diff Append
Prefixが一致する場合のみ新規MessageをManaged Areaへ追記する。

#### FR-037 [Must] Commit
すべての本文書き込み成功後にMessage Count、Sync Hash、Last Added Count、Last Sync At等の正式Sync Stateを更新する。

### 5.7 Branch・Version

#### FR-038 [Must] Visible Branch
ChatGPT上で現在表示されているBranchのみを保存対象とする。

#### FR-039 [Must] Branch変更
Regenerate / Edit等により既存Prefixが変わった場合、通常Diff Appendを停止する。

#### FR-040 [Must] Version系列
同一Conversation IDのVersion系列を管理する。

#### FR-041 [Must] Version採番
新Version候補は同一Conversation IDの最大Version + 1とし、作成直前に再確認する。競合時は自動再採番せず停止する。

#### FR-042 [Must] Current invariant
同一Conversation IDに `Is Current=true` が複数存在する場合は不整合として保存停止する。推測・自動修復しない。

#### FR-043 [Must] Version State
Versionは以下の状態を持つ。
- `PREPARING`
- `ACTIVE`
- `ARCHIVED`
- `FAILED`

#### FR-044 [Must] Version切替
新Versionは `PREPARING / Is Current=false` で作成し、本文・Metadata・Sync State準備完了後に新Versionを `ACTIVE / true`、旧Versionを `ARCHIVED / false` にする。

#### FR-045 [Must] Version失敗
新Version作成に失敗した場合は `FAILED / false` とし、既存ACTIVEを維持する。

#### FR-046 [Must] Stale PREPARING
対応するRunning Jobが存在せず、作成後30分超のPREPARINGをStale候補として扱う。30分は初期値であり実測により見直し可能。

### 5.8 Recovery

#### FR-047 [Must] Recovery Menu
不整合時に以下を提示する。
- Recheck
- Rebuild existing page
- Save as new version
- Cancel

#### FR-048 [Must] Rebuild確認
Rebuild等の破壊的操作は確認を要求する。

#### FR-049 [Must] Missing Page
保存済みPageが見つからない場合、自動再作成しない。権限・削除等を診断し、ユーザーの明示判断後に新規扱いを選択可能とする。

#### FR-050 [Must] Current重複
複数Currentを検出した場合はユーザーがNotion側を修正し、再診断するまで保存禁止。

### 5.9 Job・Retry・Cancel

#### FR-051 [Must] Job Lock
同一Conversation IDについて同時に1つのSave Jobのみ許可する。UI DisableだけでなくJob Lockを持つ。

#### FR-052 [Must] Final Idempotency Check
Notion書き込み直前にも最新Sync Stateを再確認し、重複追記を防ぐ。

#### FR-053 [Must] Batch Write
長大会話は複数Requestへ分割して書き込む。具体的なBatch SizeはNotion公式仕様に適合させ、ハードコード値は詳細設計で決定する。

#### FR-054 [Must] Retry
一時的・回復可能なエラーのみRetryする。認証、権限、Schema、DOM、データ整合性エラーは自動Retryしない。

#### FR-055 [Must] API Rate Limit
HTTP 429等のRate LimitではRetry-After等のAPI指示を尊重する。

#### FR-056 [Must] Popup独立
保存処理はPopupの表示ライフサイクルに依存しない。Popup再表示時に進行中または直近Jobの状態を復元する。

#### FR-057 [Must] Service Worker中断耐性
Manifest V3 Service Workerの停止を前提に、Job checkpointを永続化し、中断後に安全に再開または不整合停止できる。

#### FR-058 [Must] Pending Job
未Commit処理では以下を保持する。
- base saved count
- target count
- last written message index
- stage / result
- 必要なHash checkpoint
正式Sync Stateは全処理成功まで更新しない。

#### FR-059 [Must] Resume
再開時はChatGPT Conversationを再取得し、Committed領域・途中書き込み領域とJob Stateを検証する。一致時のみ次Messageから再開する。

#### FR-060 [Must] Cancel
Notion書き込み前は即時Cancel。書き込み中は安全なBatch境界で停止し、正式Sync StateをCommitしない。

### 5.10 Settings・診断

#### FR-061 [Must] Settings
Settingsで以下を入力する。
- Notion Integration Token
- Notion Database ID
- Default Category

#### FR-062 [Must] Credential Storage
TokenはChrome Extension Storageへ保存し、Source Code、Git、Log、Error Messageへ出力しない。

#### FR-063 [Must] Connection Test
Settingsに接続診断を設ける。
- Token認証
- Database access
- Data Source resolution
- Required Schema
- Category / Tags property type

#### FR-064 [Must] Fixed Schema
MVPは固定Standard Schemaを前提とする。Property Mappingは将来機能。

#### FR-065 [Must] Schema mismatch
Schema不足・型不一致の場合は保存停止し、具体的な修正内容を表示する。拡張機能はSchemaを自動変更しない。

#### FR-066 [Must] Database Binding
一度保存済みのConversationは元のDatabaseへBoundする。Default Database変更は未保存Conversationにのみ適用する。

#### FR-067 [Must] Notion Data Source compatibility
2025年以降のNotion APIにおけるDatabase / Data Source分離を考慮する。MVPのユーザー入力はDatabase IDを基本とし、対象Data Sourceの解決方式はTechnical Spikeで確定する。複数Data Source等で対象を一意に決定できない場合はFail Closedする。

### 5.11 Logging

#### FR-068 [Must] Structured Log
以下を例とする構造化Logを保存する。
- timestamp
- conversationId
- sourceType
- projectName
- stage
- counts
- result
- errorCode

#### FR-069 [Must] Log秘匿
会話本文、Token、Authorization Header等をLogに含めない。

#### FR-070 [Must] Log保持
Logは「30日以内」かつ「最大100件」を満たすよう自動Pruneする。

#### FR-071 [Must] Log操作
SettingsからLogの閲覧、Copy、全削除を可能とする。

### 5.12 UI Feedback

#### FR-072 [Must] 保存結果区分
以下を明確に区別する。
- New Save
- Incremental Update
- No Change
- Saved with Warnings
- Failed

#### FR-073 [Must] Count表示
保存後に追加Message数・現在Message数を表示する。

#### FR-074 [Must] Open in Notion
成功時に保存先Notion Pageを開く導線を提供する。

#### FR-075 [Must] Error UX
Popupには原因分類、Error Code、Retry可否、Log導線を表示し、詳細技術情報はLogへ分離する。

#### FR-076 [Must] State Machine
UI Job Stateは最低限以下を持つ。
`IDLE / PARSING / VALIDATING / WRITING / SUCCESS / WARNING / FAILED`

---

## 6. Notionデータ要件

### 6.1 Standard Schema
MVPは以下のPropertyを標準とする。

| Property | Type | Required | 用途 |
|---|---|---:|---|
| Title | Title | Yes | Notion上の会話タイトル |
| Category | Select | Yes | 主分類 |
| Tags | Multi-select | No | 横断タグ |
| ChatGPT URL | URL | Yes | 元会話リンク |
| Conversation ID | Rich text | Yes | システムキー |
| Source Type | Select | Yes | `Standard` / `Project` |
| Project Name | Rich text | Project時Yes | Project名 |
| Saved At | Date | Yes | 初回保存日時 |
| Message Count | Number | Yes | 正式保存済みMessage数 |
| Last Added Count | Number | Yes | 直近追加Message数 |
| Last Sync At | Date | Yes | 最終Commit日時 |
| Sync Hash | Rich text | Yes | 正式保存済みConversationのAggregate Hash |
| Version | Number | Yes | Version番号 |
| Is Current | Checkbox | Yes | Current Version |
| Version State | Select | Yes | PREPARING / ACTIVE / ARCHIVED / FAILED |
| Managed Block ID | Rich text | Yes | Managed Area識別子 |

### 6.2 Version invariant
原則として同一Conversation IDに対して:
- `ACTIVE` は最大1件
- `Is Current=true` は最大1件
- 正常状態では `ACTIVE ⇔ Is Current=true`
- PREPARING / ARCHIVED / FAILEDは `Is Current=false`

### 6.3 Current API compatibility note
現行Notion APIではDatabase配下にData Sourceが存在し、SchemaはData Sourceに属する。  
MVPではユーザーがDatabase IDを指定するUXを維持し、Data Source解決を内部処理とする案をTechnical Spikeで検証する。対象を一意に決められない場合は自動推測せず保存停止する。

---

## 7. Chrome側データ要件

### 7.1 Persistent
`chrome.storage.local`等へ以下を保存可能とする。
- Settings
- Token
- Database binding cache
- Job state / checkpoint
- Structured logs
- Settings schema version

### 7.2 Session only
Conversation本文等の大容量・機微データは原則Session-level temporary dataとし、通常のpersistent storageへ残さない。

### 7.3 Source of Truth
- 正式なSync State: Notion
- Chrome persistent state: Cache / Job recovery
- DOM: 現在のChatGPT表示状態
- ConversationModel: 1処理内のCanonical中間表現

---

## 8. 非機能要件

### NFR-001 [Must] Fail Closed
DOM完全性、必須Metadata、Sync State、Schema等の安全性を確認できない場合は書き込まない。

### NFR-002 [Must] Integrity
Silent Data Loss、Silent Duplicate Append、意図しない既存本文上書きを避ける。

### NFR-003 [Must] Security
- TokenをSource / Git / Logへ含めない
- 外部Telemetryなし
- 会話本文を永続Logへ保存しない
- 最小権限を原則とする

### NFR-004 [Must] Permissions
Chrome permissionは必要最小限とし、README等へ用途を記載する。
候補:
- `storage`
- `activeTab`
- `scripting` または必要なhost access
- ChatGPT対象host
- `api.notion.com`へのhost access

最終権限構成はTechnical Spike / 詳細設計で確定する。

### NFR-005 [Must] Maintainability
DOM Selector変更の影響をAdapter内へ局所化する。

### NFR-006 [Must] Testability
Parserは保存HTML fixture等で自動テスト可能な構造にする。

### NFR-007 [Must] Performance
約200 Messageを標準的な性能・テスト対象とする。厳密SLAではない。200超は必要に応じてWarning可能。DOM Parser処理とNotion API待ち時間を分けて測定する。

### NFR-008 [Must] Resilience
Service Worker中断、Popup close、Rate Limit、一時的Network errorから安全に復旧できる。

### NFR-009 [Must] Compatibility
MVP公式サポート:
- Google Chrome Desktop
- Windows
他OS / Edge / Brave等はMVP保証外。

### NFR-010 [Must] No External Telemetry
MVPでは外部Analytics / Crash送信を行わない。

### NFR-011 [Must] Change Management
Baseline要件を変更する場合:
1. 変更理由を記録
2. 影響範囲を分析
3. 関連Requirement / ADR / Risk / Acceptance Test / Non-Goalを確認
4. 必要な成果物を同時更新

### NFR-012 [Must] Documentation Language
説明本文は日本語、Requirement ID・型名・状態名・Error Code等は英語とする。

---

## 9. アーキテクチャ制約

### 9.1 Responsibility
- **Popup**: ユーザー操作、Preview、Metadata編集、状態表示
- **Content Script**: ChatGPT DOMへのアクセス、Lazy Load補助、Source Adapter実行
- **Service Worker**: Settings、Notion API、Schema診断、Job管理、Retry、Version / Sync制御
- **Parser / Domain**: DOM非依存のConversationModel生成、Normalization、Hash、Validation

### 9.2 Layering
```text
ChatGPT DOM
    ↓
Source Adapter
    ↓
Parser
    ↓
ConversationModel
    ↓
Validator / Normalizer / Hasher
    ↓
Sync UseCase
    ↓
Notion Gateway
```

### 9.3 Binding constraints
- DOM selectorをUseCaseへ漏らさない
- Notion Block形式をParserへ漏らさない
- 正式Sync Stateは全Write成功後のみCommit
- Popup life cycleをJob継続条件にしない
- Managed Area外を変更しない
- Conversation本文をpersistent logへ保存しない

---

## 10. Error Code方針

代表例:
- `DOM_MESSAGE_NOT_FOUND`
- `DOM_CAPTURE_INCOMPLETE`
- `META_TITLE_NOT_FOUND`
- `META_PROJECT_NAME_NOT_FOUND`
- `CONVERSATION_ID_MISMATCH`
- `MESSAGE_COUNT_DECREASED`
- `SYNC_PREFIX_MISMATCH`
- `SYNC_MULTIPLE_CURRENT`
- `SYNC_PAGE_NOT_FOUND`
- `NOTION_AUTH_FAILED`
- `NOTION_PERMISSION_DENIED`
- `NOTION_SCHEMA_MISMATCH`
- `NOTION_DATA_SOURCE_AMBIGUOUS`
- `NOTION_RATE_LIMITED`
- `JOB_CONFLICT`
- `JOB_RESUME_MISMATCH`
- `UNSUPPORTED_CONTENT_PRESENT`

Error Code詳細一覧は詳細設計で拡張する。

---

## 11. UIワイヤーフレーム（参考）

### 11.1 Normal / Incremental Update
```text
┌────────────────────────────────┐
│ ChatGPT → Notion               │
├────────────────────────────────┤
│ Source: Project Chat            │
│ Project: ChatGPTの会話をNotion… │
│                                │
│ タイトル *                      │
│ [ Chrome拡張 要件定義       ]  │
│                                │
│ Category *                     │
│ [ 個人開発                  ▼ ] │
│ Tags                           │
│ [Chrome] [Notion] [+]          │
│                                │
│ Status: 保存済み                │
│ Previous: 84 / Current: 100    │
│ Add: 16 messages               │
│ Capture: ✓ Complete            │
│ Unsupported: 0                 │
│                                │
│ [詳細Preview]                   │
│                                │
│ [     Notionへ更新          ]  │
└────────────────────────────────┘
```

### 11.2 Unsupported Warning
```text
┌────────────────────────────────┐
│ ⚠ Unsupported Content: 2       │
├────────────────────────────────┤
│ 会話の取得自体は完了しています。 │
│ 以下の内容はPlaceholderとして   │
│ 保存されます。                  │
│                                │
│ - Special Card x1              │
│ - Image Content x1             │
│                                │
│ [詳細] [Cancel] [警告付き保存]  │
└────────────────────────────────┘
```

### 11.3 Incomplete Capture
```text
┌────────────────────────────────┐
│ ✕ 保存できません                │
├────────────────────────────────┤
│ Error: DOM_CAPTURE_INCOMPLETE  │
│ 会話全体の取得を確認できません。 │
│                                │
│ [再取得] [ログ]                 │
└────────────────────────────────┘
```

### 11.4 Sync Mismatch
```text
┌────────────────────────────────┐
│ ⚠ Sync inconsistency           │
├────────────────────────────────┤
│ Error: SYNC_PREFIX_MISMATCH    │
│ 保存済み部分が現在の会話と       │
│ 一致しません。                  │
│                                │
│ [再チェック]                    │
│ [Rebuild]                      │
│ [新Versionとして保存]           │
│ [Cancel]                       │
└────────────────────────────────┘
```

### 11.5 Settings
```text
┌────────────────────────────────┐
│ Settings                       │
├────────────────────────────────┤
│ Notion Integration Token       │
│ [••••••••••••••••••••]        │
│                                │
│ Database ID                    │
│ [________________________]     │
│                                │
│ Default Category               │
│ [__________________________▼]  │
│                                │
│ [接続・Schema診断]              │
│                                │
│ Token: ✓                       │
│ Database: ✓                    │
│ Data Source: ✓                 │
│ Schema: ✓                      │
└────────────────────────────────┘
```

ワイヤーフレームはInformation Architectureの基準であり、色・余白・Font等のVisual Designを固定しない。

---

## 12. 推奨開発Phase

### Phase 0: Technical Spike
DOM / Notion APIの主要不確実性を独立PoCで検証する。

### Phase 1: Architecture Foundation
ConversationModel、Adapter / Parser interface、Validator、Normalizer、Hash、Storage、Job基盤。

### Phase 2: Minimum End-to-End
Standard Chat → ConversationModel → Notion新規Page → 本文保存を通す。

### Phase 3: MVP Core
Project対応、Category / Tags、差分追記、Sync State、Popup、Settings / Schema診断。

### Phase 4: Safety & Recovery
完全性、Lock、Batch、Retry、Pending Job、Version、Recovery。

### Phase 5: Acceptance
Parser fixture、自動テスト、正常系・異常系、Must Gate。

各PhaseにはExit Criteriaを持ち、Mustに影響する未解決事項は原則持ち越さない。

---

## 13. Technical Hypothesisの扱い

RequirementとTechnical Hypothesisを分離する。

例:
```text
Requirement:
Project ChatではProject Nameを保存する。

Technical Hypothesis:
Project Nameは現行ChatGPT DOMから安定して取得可能。

Spike:
複数Project Chat fixture / 実画面で取得安定性を確認。

Fail時:
要件を変えるのか、取得方式を変えるのかをADRで判断。
```

詳細は `05_technical-validation-plan.md` を正とする。

---

## 14. 要件変更管理

Baseline後の変更は以下を必須とする。

```text
Requirement Change
  ↓
Reason
  ↓
Impact Analysis
  ├─ Related Requirements
  ├─ ADR
  ├─ Risks
  ├─ Acceptance Tests
  └─ Non-Goals
  ↓
Update all affected artifacts
```

仕様変更を禁止するのではなく、波及影響の見落としを防ぐことを目的とする。

---

## 15. 文書管理

初版:
- `Target Version: MVP v1.0`
- `Status: Draft`

Phase 0 Technical Spike完了後にレビューし、成立した要件・仮説を反映して `Baseline` へ昇格する。

詳細変更履歴はGit Commit / Pull Request / ADRを正とし、本文へ詳細な二重履歴を持たせない。

---

## 16. 外部仕様確認メモ（2026-08-12時点）

本要件書の外部技術前提は、実装開始時にも公式ドキュメントで再確認する。

- Chrome Extensions: Manifest V3
- Chrome Extensions: Content Scripts
- Chrome Extensions: `activeTab`
- Chrome Extensions: `chrome.storage`
- Chrome Extensions: Extension Service Worker lifecycle
- Notion API: Database / Data Source model
- Notion API: Query a data source
- Notion API: Append block children
- Notion API: Request limits
- OpenAI Help: Projects in ChatGPT

特にChatGPT DOM構造は公開API契約ではないため、Technical SpikeとFixture Testを必須とする。

---

## 17. 関連成果物

- `02_adr.md`
- `03_risk-register.md`
- `04_acceptance-tests.md`
- `05_technical-validation-plan.md`
- `06_development-backlog.md`
