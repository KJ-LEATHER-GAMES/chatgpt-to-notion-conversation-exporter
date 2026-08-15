import assert from "node:assert/strict";

import {
  POC_VERSION,
  accumulateSnapshot,
  classifyUserContentCandidatesV2,
  compareGroundTruth,
  createAccumulator,
  evaluateAssistantContentCandidatesV3,
  evaluateCollapsiblePlainCandidatesV2,
  isRuntimeOrderingValid,
  normalizeBoundaryTextV2,
  orderAccumulatedMessages,
  summarizeAccumulator,
} from "./tv001-poc.mjs";

const message = ({ id, turn, ordinal, role, text = "same" }) => ({
  runtimeId: id,
  turnId: turn,
  ordinal,
  role,
  contentShape: role === "user" ? "user-short-plain" : "assistant-markdown",
  contentText: text,
  contentContainsTurnGroup: false,
  authorContainsTurnGroup: false,
  turnGroupCount: 1,
  userBoundary: null,
  structure: {},
  codeCopyFinding: {},
});

const snapshot = (messages, violations = []) => ({
  version: POC_VERSION,
  mountedTurnCount: messages.length,
  messages,
  violations,
  snapshot: {
    ordinals: messages.map((item) => item.ordinal),
    domOrderMatches: !violations.some(
      (item) => item.code === "DOM_ORDER_ORDINAL_MISMATCH",
    ),
    outerContainerUsed: false,
  },
});

const candidate = (name, innerText) => {
  const children = [];
  return {
    name,
    innerText,
    add(child) {
      children.push(child);
      return this;
    },
    contains(other) {
      return children.some(
        (child) => child === other || child.contains(other),
      );
    },
  };
};

assert.equal(
  normalizeBoundaryTextV2("  alpha\r\n\tbeta\rgamma  "),
  "  alpha\n\tbeta\ngamma  ",
);

const nestedPartial = candidate("nested-pre", "  code line");
const wholeBody = candidate("outer-div", "header\n  code line").add(
  nestedPartial,
);
const nestedPlainResult = evaluateCollapsiblePlainCandidatesV2({
  markdownCandidateCount: 0,
  plainCandidates: [wholeBody, nestedPartial],
  scopedVisibleText: "header\r\n  code line",
});
assert.equal(nestedPlainResult.accepted, true);
assert.equal(nestedPlainResult.selectedCandidate, wholeBody);
assert.equal(nestedPlainResult.rawPlainCandidateCount, 2);
assert.equal(nestedPlainResult.rootMostPlainCandidateCount, 1);
assert.equal(nestedPlainResult.boundaryTextMatches, true);

const independentRootResult = evaluateCollapsiblePlainCandidatesV2({
  markdownCandidateCount: 0,
  plainCandidates: [candidate("left", "left"), candidate("right", "right")],
  scopedVisibleText: "left\nright",
});
assert.equal(independentRootResult.accepted, false);
assert.equal(
  independentRootResult.code,
  "USER_COLLAPSIBLE_PLAIN_ROOT_CARDINALITY",
);
assert.equal(independentRootResult.rootMostPlainCandidateCount, 2);

const missingRootResult = evaluateCollapsiblePlainCandidatesV2({
  markdownCandidateCount: 0,
  plainCandidates: [],
  scopedVisibleText: "body",
});
assert.equal(missingRootResult.accepted, false);
assert.equal(
  missingRootResult.code,
  "USER_COLLAPSIBLE_PLAIN_ROOT_CARDINALITY",
);
assert.equal(missingRootResult.rootMostPlainCandidateCount, 0);

const boundaryMismatchResult = evaluateCollapsiblePlainCandidatesV2({
  markdownCandidateCount: 0,
  plainCandidates: [candidate("outer", "body")],
  scopedVisibleText: "body ",
});
assert.equal(boundaryMismatchResult.accepted, false);
assert.equal(
  boundaryMismatchResult.code,
  "USER_COLLAPSIBLE_PLAIN_BOUNDARY_MISMATCH",
);

const competingTypeResult = evaluateCollapsiblePlainCandidatesV2({
  markdownCandidateCount: 1,
  plainCandidates: [candidate("plain", "body")],
  scopedVisibleText: "body",
});
assert.equal(competingTypeResult.accepted, false);
assert.equal(competingTypeResult.code, "USER_CONTENT_AMBIGUOUS");

const markdownCandidate = candidate("markdown", "rich body");
const collapsibleMarkdownResult = classifyUserContentCandidatesV2({
  collapsible: true,
  markdownCandidates: [markdownCandidate],
  plainCandidates: [],
});
assert.equal(collapsibleMarkdownResult.accepted, true);
assert.equal(
  collapsibleMarkdownResult.contentShape,
  "user-collapsible-markdown",
);
assert.equal(collapsibleMarkdownResult.selectedCandidate, markdownCandidate);

const shortPlainCandidate = candidate("short", "short body");
const shortPlainResult = classifyUserContentCandidatesV2({
  collapsible: false,
  markdownCandidates: [],
  plainCandidates: [shortPlainCandidate],
});
assert.equal(shortPlainResult.accepted, true);
assert.equal(shortPlainResult.contentShape, "user-short-plain");
assert.equal(shortPlainResult.selectedCandidate, shortPlainCandidate);

const shortPlainNestedStillAmbiguous = classifyUserContentCandidatesV2({
  collapsible: false,
  markdownCandidates: [],
  plainCandidates: [wholeBody, nestedPartial],
});
assert.equal(shortPlainNestedStillAmbiguous.accepted, false);
assert.equal(shortPlainNestedStillAmbiguous.code, "USER_CONTENT_UNKNOWN");

const assistantSingleRoot = candidate("assistant-single", "assistant body");
const assistantSingleResult = evaluateAssistantContentCandidatesV3({
  markdownCandidates: [assistantSingleRoot],
  authorVisibleText: "assistant body",
});
assert.equal(assistantSingleResult.accepted, true);
assert.equal(assistantSingleResult.selectedCandidate, assistantSingleRoot);
assert.equal(assistantSingleResult.rawMarkdownCandidateCount, 1);
assert.equal(assistantSingleResult.rootMostMarkdownCandidateCount, 1);
assert.equal(assistantSingleResult.nestedMarkdownCandidateCount, 0);
assert.equal(assistantSingleResult.boundaryTextMatches, true);

const assistantNestedPartial = candidate(
  "assistant-nested-partial",
  "partial body",
);
const assistantWholeBody = candidate(
  "assistant-whole-body",
  "assistant header\npartial body",
).add(assistantNestedPartial);
const assistantNestedResult = evaluateAssistantContentCandidatesV3({
  markdownCandidates: [assistantWholeBody, assistantNestedPartial],
  authorVisibleText: "assistant header\r\npartial body",
});
assert.equal(assistantNestedResult.accepted, true);
assert.equal(assistantNestedResult.selectedCandidate, assistantWholeBody);
assert.notEqual(
  assistantNestedResult.selectedCandidate,
  assistantNestedPartial,
);
assert.equal(assistantNestedResult.rawMarkdownCandidateCount, 2);
assert.equal(assistantNestedResult.rootMostMarkdownCandidateCount, 1);
assert.equal(assistantNestedResult.nestedMarkdownCandidateCount, 1);

const assistantMissingResult = evaluateAssistantContentCandidatesV3({
  markdownCandidates: [],
  authorVisibleText: "assistant body",
});
assert.equal(assistantMissingResult.accepted, false);
assert.equal(assistantMissingResult.code, "ASSISTANT_CONTENT_CARDINALITY");
assert.equal(assistantMissingResult.rootMostMarkdownCandidateCount, 0);

const assistantCompetingResult = evaluateAssistantContentCandidatesV3({
  markdownCandidates: [
    candidate("assistant-left", "left"),
    candidate("assistant-right", "right"),
  ],
  authorVisibleText: "left\nright",
});
assert.equal(assistantCompetingResult.accepted, false);
assert.equal(
  assistantCompetingResult.code,
  "ASSISTANT_CONTENT_CARDINALITY",
);
assert.equal(assistantCompetingResult.rootMostMarkdownCandidateCount, 2);

const assistantBoundaryMismatchResult =
  evaluateAssistantContentCandidatesV3({
    markdownCandidates: [candidate("assistant-boundary", "assistant body")],
    authorVisibleText: "assistant body ",
  });
assert.equal(assistantBoundaryMismatchResult.accepted, false);
assert.equal(
  assistantBoundaryMismatchResult.code,
  "ASSISTANT_CONTENT_BOUNDARY_MISMATCH",
);
assert.equal(assistantBoundaryMismatchResult.boundaryTextMatches, false);

const assistantTurnGroup = candidate("assistant-turn-group", "");
const assistantRootWithTurnGroup = candidate(
  "assistant-root-with-turn-group",
  "assistant body",
).add(assistantTurnGroup);
const assistantTurnGroupResult = evaluateAssistantContentCandidatesV3({
  markdownCandidates: [assistantRootWithTurnGroup],
  authorVisibleText: "assistant body",
  turnLevelOperationGroups: [assistantTurnGroup],
});
assert.equal(assistantTurnGroupResult.accepted, false);
assert.equal(assistantTurnGroupResult.code, "CONTENT_CONTAINS_TURN_GROUP");
assert.equal(assistantTurnGroupResult.contentContainsTurnGroup, true);

const assistantInternalButton = candidate("assistant-internal-button", "");
const assistantRootWithInternalButton = candidate(
  "assistant-root-with-internal-button",
  "assistant body",
).add(assistantInternalButton);
const assistantInternalButtonResult = evaluateAssistantContentCandidatesV3({
  markdownCandidates: [assistantRootWithInternalButton],
  authorVisibleText: "assistant body",
  turnLevelOperationGroups: [],
});
assert.equal(assistantInternalButtonResult.accepted, true);
assert.equal(
  assistantInternalButtonResult.selectedCandidate,
  assistantRootWithInternalButton,
);

const accumulator = createAccumulator();
accumulateSnapshot(
  accumulator,
  snapshot([
    message({ id: "m1", turn: "t1", ordinal: 1, role: "user" }),
    message({ id: "m2", turn: "t2", ordinal: 2, role: "assistant" }),
  ]),
);
accumulateSnapshot(
  accumulator,
  snapshot([
    message({ id: "m1", turn: "t1", ordinal: 1, role: "user" }),
    message({ id: "m2", turn: "t2", ordinal: 2, role: "assistant" }),
    message({ id: "m3", turn: "t3", ordinal: 3, role: "user" }),
    message({ id: "m4", turn: "t4", ordinal: 4, role: "assistant" }),
  ]),
);

const ordered = orderAccumulatedMessages(accumulator);
assert.deepEqual(
  ordered.map((item) => item.ordinal),
  [1, 2, 3, 4],
);
assert.equal(accumulator.remountDedupCount, 2);
assert.equal(accumulator.messagesByRuntimeId.size, 4);
assert.equal(new Set(ordered.map((item) => item.runtimeId)).size, 4);
assert.equal(new Set(ordered.map((item) => item.contentText)).size, 1);
assert.equal(accumulator.violations.length, 0);
assert.equal(isRuntimeOrderingValid(accumulator), true);

const contiguousComparison = compareGroundTruth(
  ordered,
  {
    expectedCount: 4,
    expectedRoles: ["user", "assistant", "user", "assistant"],
    expectedMarkers: ["same", "same", "same", "same"],
    expectedOrdinals: [1, 2, 3, 4],
  },
  { runtimeOrderingValid: isRuntimeOrderingValid(accumulator) },
);
assert.deepEqual(contiguousComparison, {
  expectedCount: 4,
  capturedUnique: 4,
  countMatches: true,
  roleSequenceMatches: true,
  markerSequenceMatches: true,
  ordinalSequenceMatches: true,
  runtimeOrderingValid: true,
  missingCount: 0,
  unexpectedCount: 0,
});

const noOrdinalGroundTruthComparison = compareGroundTruth(
  ordered,
  {
    expectedCount: 4,
    expectedRoles: ["user", "assistant", "user", "assistant"],
    expectedMarkers: ["same", "same", "same", "same"],
  },
  { runtimeOrderingValid: true },
);
assert.equal(noOrdinalGroundTruthComparison.ordinalSequenceMatches, null);
assert.equal(noOrdinalGroundTruthComparison.roleSequenceMatches, true);
assert.equal(noOrdinalGroundTruthComparison.markerSequenceMatches, true);

const gappedMessages = [
  message({ id: "g1", turn: "gt1", ordinal: 1, role: "user" }),
  message({ id: "g2", turn: "gt2", ordinal: 3, role: "assistant" }),
];
const gappedComparison = compareGroundTruth(
  gappedMessages,
  {
    expectedCount: 2,
    expectedRoles: ["user", "assistant"],
    expectedOrdinals: [1, 3],
  },
  { runtimeOrderingValid: true },
);
assert.equal(gappedComparison.ordinalSequenceMatches, true);
assert.equal(gappedComparison.runtimeOrderingValid, true);
assert.equal(gappedComparison.markerSequenceMatches, null);

const invalidExpectedOrdinals = [
  { expectedCount: 2, expectedOrdinals: [1] },
  { expectedCount: 2, expectedOrdinals: [0, 2] },
  { expectedCount: 2, expectedOrdinals: [1, Number.MAX_SAFE_INTEGER + 1] },
  { expectedCount: 2, expectedOrdinals: [1, 1] },
  { expectedCount: 2, expectedOrdinals: [2, 1] },
];
for (const groundTruth of invalidExpectedOrdinals) {
  assert.throws(
    () => compareGroundTruth(gappedMessages, groundTruth),
    (error) =>
      error?.code === "GROUND_TRUTH_INPUT_ERROR" &&
      Array.isArray(error.reasons) &&
      error.reasons.length > 0,
  );
}

const orderingFailureAccumulator = createAccumulator();
accumulateSnapshot(
  orderingFailureAccumulator,
  snapshot(
    [message({ id: "o1", turn: "ot1", ordinal: 1, role: "user" })],
    [{ code: "DOM_ORDER_ORDINAL_MISMATCH", ordinal: null }],
  ),
);
assert.equal(isRuntimeOrderingValid(orderingFailureAccumulator), false);

const conflictAccumulator = createAccumulator();
accumulateSnapshot(
  conflictAccumulator,
  snapshot([
    message({ id: "m1", turn: "t1", ordinal: 1, role: "user" }),
  ]),
);
accumulateSnapshot(
  conflictAccumulator,
  snapshot([
    message({ id: "changed", turn: "t1", ordinal: 1, role: "user" }),
  ]),
);
assert.equal(
  summarizeAccumulator(conflictAccumulator).violationCounts
    .REMOUNT_RUNTIME_ID_CHANGED,
  1,
);

const identityConflictAccumulator = createAccumulator();
accumulateSnapshot(
  identityConflictAccumulator,
  snapshot([
    message({ id: "same-id", turn: "t1", ordinal: 1, role: "user" }),
  ]),
);
accumulateSnapshot(
  identityConflictAccumulator,
  snapshot([
    message({
      id: "same-id",
      turn: "t2",
      ordinal: 2,
      role: "assistant",
    }),
  ]),
);
assert.equal(
  summarizeAccumulator(identityConflictAccumulator).violationCounts
    .RUNTIME_ID_CROSS_SCAN_CONFLICT,
  1,
);

process.stdout.write("TV-001 Minimal PoC v3 self-test: PASS\n");
