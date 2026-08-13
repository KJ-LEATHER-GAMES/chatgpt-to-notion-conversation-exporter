# Acceptance Tests
## ChatGPT to Notion Conversation Exporter

- **Target**: MVP v1.0
- **Status**: Draft
- **Last Reviewed**: 2026-08-12

MVP Gate 1では、Must要件に対応するAcceptance TestをすべてPassする。

---

## A. Page / Source Detection

### AT-001 Standard Chatを認識できる
**Given** 対応Standard Chatを開いている  
**When** Popupを開く  
**Then** 保存可能状態になり、Source Type=`Standard`となる  
**Refs** FR-001, FR-003

### AT-002 Project Chatを認識できる
**Given** 対応Project Chatを開いている  
**When** Popupを開く  
**Then** Source Type=`Project`、Project Nameが取得される  
**Refs** FR-001, FR-006, FR-011

### AT-003 非対応ページでは保存できない
**Then** 保存ボタンが無効、ChatGPTへの導線がある  
**Refs** FR-003

### AT-004 URL / Conversation ID不一致を拒否
**Then** `CONVERSATION_ID_MISMATCH` で保存停止  
**Refs** FR-004

---

## B. DOM Capture / Parser

### AT-005 User / Assistant Messageを順序通り取得
**Then** Message Count、role、順序がfixtureと一致  
**Refs** FR-009

### AT-006 UI操作要素を本文に混入しない
Copy、thumb、regenerate、share、navigation等が保存対象外  
**Refs** FR-009, FR-010

### AT-007 長大会話を完全取得
標準性能対象の約200 Messageで先頭・末尾を含む全Messageを取得  
**Refs** FR-008, NFR-007

### AT-008 完全性不明なら保存拒否
**Then** `DOM_CAPTURE_INCOMPLETE`、Notion write 0件  
**Refs** FR-008, NFR-001

### AT-009 必須Title欠落で保存拒否
**Then** `META_TITLE_NOT_FOUND`  
**Refs** FR-011

### AT-010 Project Name欠落で保存拒否
**Then** `META_PROJECT_NAME_NOT_FOUND`  
**Refs** FR-011

### AT-011 Unknown conversation elementをSilent Dropしない
**Then** `Unsupported`として検出される  
**Refs** FR-010

---

## C. ConversationModel / Formatting

### AT-012 DOM class差分がHashへ不要影響しない
意味内容が同一でDOM classのみ異なるfixtureのAggregate Hashが一致  
**Refs** FR-016, FR-017

### AT-013 Code blockの改行・Indentを保持
**Refs** FR-016, FR-028

### AT-014 未知Code LanguageはGenericへFallback
言語を推測しない  
**Refs** FR-028

### AT-015 Linkは表示文字列とURLを保持
**Refs** FR-016, FR-027

### AT-016 Sources取得可能時にAssistant Messageと関連付けて保存
**Refs** FR-029

### AT-017 Source取得不能でも本文保存は可能
警告は可能だが本文保存自体を止めない  
**Refs** FR-029

### AT-018 AttachmentはMetadataのみ保存
本体がNotionへUploadされず、「本体未転送」が判別可能  
**Refs** FR-030

---

## D. New Save

### AT-019 新規ConversationをNotionへ保存
1 Page作成、Standard Schema Metadata、Managed Area、全文が存在  
**Refs** FR-024〜030

### AT-020 初回Title編集を反映
Popupで編集したTitleがNotion Titleとなる  
**Refs** FR-018, FR-019

### AT-021 Category必須
Category未確定なら保存不可  
**Refs** FR-021

### AT-022 Tags任意
Tagsなしでも保存可能  
**Refs** FR-022

### AT-023 Managed Area外を変更しない
外側に置いたユーザーBlockが保存・更新後も不変  
**Refs** FR-025

---

## E. Incremental Update

### AT-024 追加Messageのみ追記
保存済み84、現在100なら16 Message分のみ追記しMessage Count=100  
**Refs** FR-033〜037

### AT-025 変更なし
Message Count / Hash一致時はNo Changeとなり本文を追記しない  
**Refs** FR-072

### AT-026 再保存でNotion Titleを維持
ChatGPT側Titleが変わっていても自動上書きしない  
**Refs** FR-020

### AT-027 Message Count減少を拒否
**Then** `MESSAGE_COUNT_DECREASED`  
**Refs** FR-034

### AT-028 保存済みPrefix変更を拒否
**Then** `SYNC_PREFIX_MISMATCH`、通常追記なし  
**Refs** FR-035

### AT-029 Branch変更を通常更新しない
Recovery UIへ移行  
**Refs** FR-038, FR-039

---

## F. Version / Recovery

### AT-030 New Versionをmax+1で作成
作成直前再確認を含む  
**Refs** FR-041

### AT-031 Current重複時に保存停止
**Then** `SYNC_MULTIPLE_CURRENT`  
**Refs** FR-042, FR-050

### AT-032 Version切替成功
新: ACTIVE/true、旧: ARCHIVED/false  
**Refs** FR-044

### AT-033 新Version失敗時に旧ACTIVEを維持
新: FAILED/false  
**Refs** FR-045

### AT-034 Stale PREPARINGを検出
Running Jobなし + 30分超でStale候補表示  
**Refs** FR-046

### AT-035 Rebuildは確認を要求
誤操作で即実行されない  
**Refs** FR-048

### AT-036 Saved Page missing時に自動再作成しない
診断とユーザー選択を要求  
**Refs** FR-049

---

## G. Job / Concurrency / Retry

### AT-037 同一Conversation二重SaveをLock
2つ目Jobは開始しない  
**Refs** FR-051

### AT-038 最終Recheckで競合を検出
Write直前にSync Stateが変化していたら停止  
**Refs** FR-052

### AT-039 Rate LimitをRetry-Afterに従い再試行
**Refs** FR-054, FR-055

### AT-040 Auth Errorを自動Retryしない
**Refs** FR-054

### AT-041 Popup Close後にJob状態を復元
Popup再open時に進行中/失敗/成功状態を表示  
**Refs** FR-056

### AT-042 Service Worker中断後に安全にResume
Checkpointと現在状態が一致する場合のみ次Messageから再開  
**Refs** FR-057〜059

### AT-043 Resume mismatchで停止
途中書き込みとJob Stateが不一致なら `JOB_RESUME_MISMATCH`  
**Refs** FR-059

### AT-044 Cancel before write
Notion writeなし、Job終了  
**Refs** FR-060

### AT-045 Cancel during write
安全なBatch境界で停止し、formal Sync StateをCommitしない  
**Refs** FR-060

---

## H. Settings / Notion Schema

### AT-046 Valid Token / DBで診断Pass
Token、DB、Data Source、Schemaが正常  
**Refs** FR-061〜064

### AT-047 Invalid Token
`NOTION_AUTH_FAILED`、保存不可  
**Refs** FR-063

### AT-048 Schema type mismatch
`NOTION_SCHEMA_MISMATCH` と必要修正内容を表示  
**Refs** FR-065

### AT-049 Schemaを自動変更しない
診断時にNotion Property追加・型変更を行わない  
**Refs** FR-065

### AT-050 Default DB変更後も既存Conversationは元DBへ更新
**Refs** FR-066

### AT-051 Data Sourceを一意に解決できない場合は保存停止
**Then** `NOTION_DATA_SOURCE_AMBIGUOUS`  
**Refs** FR-067

---

## I. Logging / Security

### AT-052 LogにTokenが出ない
**Refs** FR-069

### AT-053 LogにConversation本文が出ない
**Refs** FR-069

### AT-054 Log retention
30日超または100件超をPruneし、残存データが両条件を満たす  
**Refs** FR-070

### AT-055 Log Copy / Clear
**Refs** FR-071

### AT-056 SourceにSecretを含めない
Repository scanで実Tokenが存在しない  
**Refs** FR-062

### AT-057 Persistent Storageに会話本文を残さない
正常終了後のStorage inspectionで本文なし  
**Refs** §7

---

## J. UX

### AT-058 New / Update / No Change / Warning / Failedを区別
**Refs** FR-072

### AT-059 保存後Countを表示
追加数・現在数が正しい  
**Refs** FR-073

### AT-060 Open in Notion
保存先Pageを開ける  
**Refs** FR-074

### AT-061 Error CodeとRecovery導線
主要Errorで原因分類・Code・Retry/Log等を表示  
**Refs** FR-075

---

# Requirement Traceability Summary

| Requirement Group | Primary AT |
|---|---|
| Source / DOM | AT-001〜011 |
| Model / Formatting | AT-012〜018 |
| New Save | AT-019〜023 |
| Diff Sync | AT-024〜029 |
| Version / Recovery | AT-030〜036 |
| Job / Retry | AT-037〜045 |
| Settings / Schema | AT-046〜051 |
| Security / Logging | AT-052〜057 |
| UX | AT-058〜061 |

## Gate Rule
- Mustに紐づくATが1件でもFailならMVP Gate 1はPassしない。
- Testを一時的にSkipする場合は、関連Riskと持ち越し理由を明示する。
