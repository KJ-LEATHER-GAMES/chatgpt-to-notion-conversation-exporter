# AGENTS.md

## Project

ChatGPT to Notion Conversation Exporter

Chrome + Windows向けの個人ローカル利用Chrome Extension。
TypeScript / Manifest V3を使用する。

現在はMVP v1.0 Draft。
Phase 0 Technical Spike実施中。

## Source of Truth

仕様・設計判断は以下を参照する。

- docs/01_product-requirements.md
- docs/02_adr.md
- docs/03_risk-register.md
- docs/04_acceptance-tests.md
- docs/05_technical-validation-plan.md
- docs/06_development-backlog.md

矛盾がある場合は、推測で変更せず指摘すること。

## Current Development Phase

現在はPhase 0 Technical Spike。

Baseline化前はPhase 0以外の製品実装を確定作業として行わない。

Technical Spikeのコードは `spikes/` 以下へ配置する。

Production用 `src/` を作成したり、
Phase 1以降のArchitectureを先行実装したりしない。

## Architecture Constraints

将来の本実装では以下を維持する。

DOM
→ Source Adapter
→ Parser
→ ConversationModel

ChatGPT側はConversation全文を取得する。

Notion側は既存保存済みPrefixを検証し、
新規Messageのみ差分追記する。

以下の場合はFail Closedとする。

- Message Count decrease
- Prefix mismatch
- required metadata missing
- invalid Current Version state

Notionを正式なSync StateのSource of Truthとする。

Managed Area以外のNotion BlockをExtensionから変更しない。

Version State:

- PREPARING
- ACTIVE
- ARCHIVED
- FAILED

Manifest V3 Service Workerが停止することを前提とする。

## Technical Spike Rules

Technical Spikeでは「動いた」だけではPASSにしない。

各Validationについて以下を記録する。

- Hypothesis
- Setup
- Result
- Verdict: PASS / CONDITIONAL / FAIL
- Evidence
- Known Limitations
- Requirement Impact
- ADR Impact
- Risk Impact
- Next Action

DOM selectorを選定する場合、
CSS class名だけに依存する方法を安易に採用しない。

取得方式の安定性とFallback可能性を評価する。

## Security / Privacy

以下をGitへCommitしない。

- ChatGPT authentication data
- cookies
- session tokens
- Notion integration token
- 個人Conversationのraw HTML
- 個人情報を含むraw DOM snapshot

Fixtureへ保存する場合は匿名化・最小化する。

Secretをsource codeへ直接記述しない。

## Working Rules

変更前に関連するRequirement / ADR / Risk / Validationを読む。

Taskのscope外変更を行わない。

新しい設計判断が必要な場合は、
既存ADRを書き換える前にDecision Candidateとして報告する。

Spike結果によってRequirement変更が必要な場合は、
独断で変更せずRequirement Impactとして報告する。

## Definition of Done

TaskのExit Criteriaを満たすこと。

関連Validationについて
PASS / CONDITIONAL / FAILを明確にすること。

Evidenceを残すこと。

実行したtest / verificationを報告すること。

未確認事項をPASS扱いしないこと。

## AGENTS.md Maintenance

Do not modify AGENTS.md solely at your own discretion.

If work reveals a durable repository-wide rule that should apply
to future tasks, report it as an "AGENTS.md Update Candidate".

For each candidate, explain:

- Proposed rule
- Reason
- Scope
- Evidence
- Impact on future tasks

Modify AGENTS.md only when explicitly requested.