# TASK-004 Phase 3 — Manual DOM Discovery Observation Record

## 0. Status

- Task: `TASK-004`
- Validation: `TV-007`
- Source Type: `Standard Chat`
- Ground Truth: `FROZEN BEFORE DISCOVERY`
- Expected Matrix: `FROZEN BEFORE DISCOVERY`
- Manual DOM Discovery: `IN_PROGRESS`
- Candidate Decision: `NOT_SET`

---

# 1. RS Fixture — Baseline

Capture label: `RS_BASELINE`

```text
mountedTurnCount:
ordinals:
strictAscending:
duplicateOrdinals:
```

## Message Unit / Role / Body Inventory

| Ordinal | Role candidate | Section node | Message ID FP | Turn ID FP | Markdown root-most | Plain root-most | Branch controls |
|---:|---|---|---|---|---:|---:|---:|
| 1 | | | | | | | |
| 2 | | | | | | | |
| 3 | | | | | | | |
| 4 | | | | | | | |
| 5 | | | | | | | |
| 6 | | | | | | | |

Observation:

```text

```

---

# 2. RS Fixture — Regenerated

Capture label: `RS_REGENERATED`

```text
mountedTurnCount:
ordinals:
strictAscending:
duplicateOrdinals:
```

## Baseline -> Regenerated DOM Diff

```text
count changed:
ordinal sequence changed:
ordinal 6 section replaced:
ordinal 6 message-id FP changed:
ordinal 6 turn-id FP changed:
ordinal 6 body candidate FP changed:
branch control relation changed:
```

Observation:

```text

```

---

# 3. RS Fixture — Switch Regenerated -> Baseline

Capture label: `RS_SWITCH_BASELINE`

```text
section replacement/remount:
runtime identity behavior:
content candidate behavior:
branch control behavior:
inactive sibling contamination:
```

Comparison with original `RS_BASELINE`:

```text

```

---

# 4. RS Fixture — Switch Baseline -> Regenerated

Capture label: `RS_SWITCH_REGENERATED`

```text
section replacement/remount:
runtime identity behavior:
content candidate behavior:
branch control behavior:
inactive sibling contamination:
```

Comparison with original `RS_REGENERATED`:

```text

```

---

# 5. RS Branch Membership Characterization

```text
inactive sibling Message mounted: YES / NO / UNKNOWN
inactive sibling rendered: YES / NO / N/A / UNKNOWN
same ordinal duplicated in DOM: YES / NO
visible Branch sequence uniquely distinguishable: YES / NO / UNKNOWN
branch control located inside branched Message section: YES / NO / MIXED
branch index / position candidate:
```

Evidence-based notes:

```text

```

---

# 6. E Fixture — Baseline

Capture label: `E_BASELINE`

```text
mountedTurnCount:
ordinals:
strictAscending:
duplicateOrdinals:
ordinal 5 role candidate:
ordinal 5 body candidate relation:
```

Observation:

```text

```

---

# 7. E Fixture — Edited

Capture label: `E_EDITED`

## Baseline -> Edited DOM Diff

```text
count changed:
ordinal sequence changed:
ordinal 5 section replaced:
ordinal 5 message-id FP changed:
ordinal 5 turn-id FP changed:
ordinal 5 body candidate FP changed:
ordinal 6 section/runtime relation changed:
inactive sibling contamination:
```

Observation:

```text

```

---

# 8. Runtime Identity Characterization

`data-message-id`:

```text
candidate cardinality per Message:
changes on Regenerate:
changes on Branch Switch:
changes on User Edit:
switch-back behavior:
provisional semantic role: runtime observation / dedup only
```

`data-turn-id`:

```text
candidate cardinality per Message:
changes on Regenerate:
changes on Branch Switch:
changes on User Edit:
switch-back behavior:
provisional semantic role: cross-check only
```

No persisted Branch identity claim is made in Phase 3.

---

# 9. Branch Control Candidate Inventory

```text
candidate location:
tag / role:
aria-label:
text / position indicator:
data-testid:
disabled / aria-disabled behavior:
relation to branched Message section:
stability across switch:
```

---

# 10. Switch Mechanics

Choose only from observed facts.

```text
RS Regenerate:
- SAME_SECTION_MUTATION / SECTION_REMOUNT / CHILD_REPLACEMENT / MIXED / UNKNOWN

RS Branch switch:
- SAME_SECTION_MUTATION / SECTION_REMOUNT / CHILD_REPLACEMENT / MIXED / UNKNOWN

E User Edit branch switch:
- SAME_SECTION_MUTATION / SECTION_REMOUNT / CHILD_REPLACEMENT / MIXED / UNKNOWN
```

Evidence:

```text

```

---

# 11. Discovery Questions

| Question | Observation-only answer |
|---|---|
| Current visible Branch can form one ordered Message sequence? | |
| Inactive sibling Branch Messages mounted? | |
| If mounted, safely excludable? | |
| DOM order usable as current Conversation order? | |
| Branch switch mechanism characterized? | |
| Ordinal stable across Branch switch? | |
| Runtime identities change across sibling Branches? | |
| Branch UI useful as auxiliary Evidence? | |
| Persisted Branch identity avoidable? | |
| Ambiguous membership can Fail Closed? | |

---

# 12. Phase 3 Completion Checklist

- [ ] Six required captures complete
- [ ] Three primary diff groups recorded
- [ ] Message unit relation recorded
- [ ] role relation recorded
- [ ] body candidate inventory recorded
- [ ] runtime identity behavior recorded
- [ ] Branch control candidates recorded
- [ ] inactive sibling relation recorded
- [ ] switch mechanics recorded
- [ ] no Ground Truth-driven selector tuning
- [ ] no Expected Matrix comparison
- [ ] no PREFIX verdict produced by Phase 3 code
- [ ] RS Evidence exported
- [ ] E Evidence exported

If all YES:

```text
TASK_004_MANUAL_DOM_DISCOVERY: COMPLETE
TASK_004_PHASE_4_ENTRY: OPEN
TV_007_CANDIDATE_DECISION: NOT_SET
```
