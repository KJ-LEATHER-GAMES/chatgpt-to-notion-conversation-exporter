# Development Backlog
## ChatGPT to Notion Conversation Exporter

- **Target**: MVP v1.0
- **Status**: Draft
- **Last Reviewed**: 2026-08-12

Codexへは原則としてTask単位で依頼する。  
Baseline化前はPhase 0以外の実装を確定作業として扱わない。

---

# Phase 0 - Technical Spike

## TASK-001 Standard Chat DOM Spike
- **Refs**: TV-001, TV-002, TV-003
- **Risk**: RISK-001, RISK-028, RISK-029
- **Exit**: Standard ChatのMessage / Title / Conversation ID取得方式をPASS判定

## TASK-002 Project Chat DOM Spike
- **Refs**: TV-004
- **Risk**: RISK-003, RISK-004
- **Depends On**: TASK-001
- **Exit**: Source detectionとProject Name取得をPASS

## TASK-003 Long Conversation / Completeness Spike
- **Refs**: TV-005, TV-006
- **Risk**: RISK-002
- **Exit**: 200 Message級で完全取得判定が成立

## TASK-004 Branch / Regenerate Spike
- **Refs**: TV-007
- **Risk**: RISK-005
- **Exit**: Branch変更でPrefix mismatch検出

## TASK-005 Rich Content Spike
- **Refs**: TV-008〜012
- **Exit**: Basic formatting、Code、Sources、Attachment、Timestampの可否を分類

## TASK-006 Notion API Model Spike
- **Refs**: TV-013〜016
- **Risk**: RISK-009〜011
- **Exit**: Database/Data Source、Schema診断、Managed Area、Batch方針確定

## TASK-007 Chrome Lifecycle / Permission Spike
- **Refs**: TV-017〜019
- **Risk**: RISK-008, RISK-022
- **Exit**: Worker中断時復旧とMinimum permission方針確定

## TASK-008 Hash Normalization Spike
- **Refs**: TV-020
- **Exit**: Canonical representation / Hashルール確定

## TASK-009 Phase 0 Review
- **Depends On**: TASK-001〜008
- **Exit**:
  - Must関連TV PASS
  - ADR / Risk更新
  - Requirements Baseline可否判断

---

# Phase 1 - Architecture Foundation

## TASK-101 Project Skeleton
- TypeScript
- Manifest V3
- build to `dist/`
- lint / test foundation
- **Refs**: ADR-019

## TASK-102 Domain Model
- `ConversationModel`
- `Message`
- `ContentBlock`
- `SourceType`
- **Refs**: FR-013〜015

## TASK-103 Source Adapter Interfaces
- `ChatSourceAdapter`
- `StandardChatAdapter`
- `ProjectChatAdapter`
- **Refs**: FR-005, FR-006

## TASK-104 Parser / Content Classification
- Saved / Ignored / Unsupported
- role detection
- **Refs**: FR-009, FR-010
- **Tests**: AT-005, AT-006, AT-011

## TASK-105 Validator
- Metadata
- Completeness
- URL / ID consistency
- **Refs**: FR-004, FR-008, FR-011
- **Tests**: AT-004, AT-008〜010

## TASK-106 Normalizer / Hasher
- content-type normalization
- per-message hash
- aggregate hash
- **Refs**: FR-016, FR-017
- **Tests**: AT-012〜015

## TASK-107 Storage Foundation
- settings schema version
- local/session abstraction
- log store
- job store
- **Refs**: §7, FR-068〜071

## TASK-108 Phase 1 Gate
- Interfaces fixed
- fixture tests runnable
- no UI dependency in Parser

---

# Phase 2 - Minimum End-to-End

## TASK-201 Content Script Standard Capture
- Current tab Standard Chat → ConversationModel
- **Refs**: FR-007〜011

## TASK-202 Notion Gateway Basic
- auth
- database/data source resolution
- create page
- append blocks
- **Refs**: FR-061〜067

## TASK-203 Notion Renderer
- speaker header
- paragraph / list / quote / code / link
- Managed Area
- **Refs**: FR-014, FR-025〜030

## TASK-204 Minimal Popup
- target validation
- title/category/tags
- save action
- result
- **Refs**: FR-018〜023, FR-072〜075

## TASK-205 New Save UseCase
- Standard Chat new save
- sync metadata commit
- **Refs**: FR-024, FR-037

## TASK-206 Phase 2 Acceptance
- **Tests**: AT-019〜023
- **Exit**: Standard Chat → Notion new page end-to-end PASS

---

# Phase 3 - MVP Core

## TASK-301 Project Chat Implementation
- **Refs**: FR-001, FR-006, FR-011
- **Tests**: AT-002, AT-010

## TASK-302 Settings / Diagnostic UI
- token
- database
- default category
- data source/schema diagnostics
- **Refs**: FR-061〜067
- **Tests**: AT-046〜051

## TASK-303 Existing Conversation Lookup
- Conversation ID
- Current Version
- Notion truth + cache
- **Refs**: FR-031, FR-032

## TASK-304 Prefix Compare
- full recapture
- saved prefix validation
- message count decrease
- **Refs**: FR-033〜035
- **Tests**: AT-027, AT-028

## TASK-305 Diff Append
- append only new Messages
- commit after full success
- **Refs**: FR-036, FR-037
- **Tests**: AT-024, AT-025

## TASK-306 Metadata Carry-over
- preserve Notion title/category/tags
- **Refs**: FR-020〜022
- **Tests**: AT-026

## TASK-307 Unsupported Warning UX
- Placeholder
- warning
- save decision
- **Refs**: FR-010
- **Tests**: AT-011

## TASK-308 Source / Attachment Renderer
- **Refs**: FR-029, FR-030
- **Tests**: AT-016〜018

## TASK-309 Phase 3 Gate
- Standard + Project
- New + Diff update
- schema diagnostics
- core UI state

---

# Phase 4 - Safety & Recovery

## TASK-401 Conversation Job Lock
- **Refs**: FR-051
- **Tests**: AT-037

## TASK-402 Final Idempotency Check
- **Refs**: FR-052
- **Tests**: AT-038

## TASK-403 Batch / Rate Limit / Retry
- **Refs**: FR-053〜055
- **Tests**: AT-039, AT-040

## TASK-404 Pending Job Checkpoint
- **Refs**: FR-057, FR-058

## TASK-405 Resume Logic
- reparse / verify / resume
- **Refs**: FR-059
- **Tests**: AT-042, AT-043

## TASK-406 Cancel Logic
- before write
- batch-boundary cancellation
- **Refs**: FR-060
- **Tests**: AT-044, AT-045

## TASK-407 Version State Machine
- PREPARING / ACTIVE / ARCHIVED / FAILED
- Is Current invariant
- **Refs**: FR-040〜046
- **Tests**: AT-030〜034

## TASK-408 Recovery UI
- Recheck
- Rebuild
- New Version
- Cancel
- **Refs**: FR-047〜050
- **Tests**: AT-035, AT-036

## TASK-409 Popup Reopen State
- **Refs**: FR-056
- **Tests**: AT-041

## TASK-410 Structured Logging
- prune
- copy
- clear
- sanitization
- **Refs**: FR-068〜071
- **Tests**: AT-052〜055

## TASK-411 Phase 4 Gate
- concurrency
- partial failure
- worker interruption
- recovery all PASS

---

# Phase 5 - Acceptance / Hardening

## TASK-501 Parser Fixture Suite
Fixtures:
- standard
- project
- code
- list/quote
- source
- attachment
- unsupported
- broken/incomplete
- branch-changed
- long conversation

## TASK-502 Security Tests
- no token in source/log
- no conversation body in persistent storage
- **Tests**: AT-052〜057

## TASK-503 Full Acceptance Run
- AT-001〜AT-061
- **Exit**: all Must-linked AT PASS

## TASK-504 Performance Measurement
- 50 / 100 / 200 Message
- parser time
- normalization time
- Notion network time
- batch count
- **Refs**: NFR-007

## TASK-505 MVP Gate 1 Review
- Must complete
- Risks reviewed
- Non-Goals unchanged or formally changed
- **Exit**: Technical MVP Complete

## TASK-506 Real-use Pilot
- 個人利用
- Standard / Project
- New / Diff / Recovery
- usability gapsをbacklog化
- **Exit**: Gate 2実用性評価

---

# Suggested Codex Task Prompt Pattern

```text
TASK-305を実装してください。

参照:
- Requirements: FR-033〜FR-037
- ADR: ADR-005, ADR-006, ADR-007
- Tests: AT-024〜AT-029
- Risks: RISK-005, RISK-006, RISK-007

制約:
- Baseline要件を勝手に変更しない
- 要件変更が必要なら実装前に理由と影響範囲を提示する
- DOM selectorをUseCaseへ漏らさない
- Formal Sync Stateは全write成功後のみcommitする

完了条件:
- 関連Acceptance TestがPass
- lint/test Pass
- 変更した設計判断があればADR候補を提示
```

---

# Backlog Change Rule
Task追加・分割は自由だが、Requirementの意味を変える場合はTask変更ではなくRequirement Changeとして扱う。
