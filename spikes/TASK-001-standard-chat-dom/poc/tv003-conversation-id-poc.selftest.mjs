import assert from "node:assert/strict";

import {
  CONVERSATION_ID_STATE,
  POC_VERSION,
  compareConversationIdGroundTruth,
  evaluateConversationIdSnapshot,
  evaluateTechnicalSpikeCase,
  isObservedConversationIdFormatV1,
  parseObservedStandardConversationRouteV1,
} from "./tv003-conversation-id-poc.mjs";

function syntheticId(character) {
  return [8, 4, 4, 4, 12]
    .map((length) => character.repeat(length))
    .join("-");
}

const expectedId = syntheticId("a");
const otherId = syntheticId("b");

function routeFor(id, origin = "https://example.test") {
  return `${origin}/c/${id}`;
}

function validPageSnapshot(id = expectedId, overrides = {}) {
  const route = routeFor(id);
  return {
    pageLocationHref: route,
    pageLocationPathname: `/c/${id}`,
    pageDocumentUrl: route,
    sameRouteAnchorCount: 2,
    activeAnchorCount: 1,
    activeAnchorHref: route,
    activeNestedIdValues: [id],
    canonicalHrefs: [route],
    ...overrides,
  };
}

let assertionGroups = 0;

function passGroup() {
  assertionGroups += 1;
}

function assertFailClosed(name, browserUrl, snapshot, expectedState = null) {
  const result = evaluateConversationIdSnapshot(browserUrl, snapshot);
  assert.equal(result.accepted, false, name);
  assert.equal(result.failClosed, true, name);
  assert.equal(result.resolvedId, null, name);
  if (expectedState !== null) {
    assert.equal(result.state, expectedState, name);
  }
  passGroup();
  return result;
}

// 1-4: positive runtime, Ground Truth, and Technical Spike contract.
const validBrowserUrl = routeFor(expectedId);
const validSnapshot = validPageSnapshot();
const validRuntime = evaluateConversationIdSnapshot(
  validBrowserUrl,
  validSnapshot,
);
assert.equal(validRuntime.state, CONVERSATION_ID_STATE.RESOLVED_CURRENT);
assert.equal(validRuntime.accepted, true);
assert.equal(validRuntime.resolvedId, expectedId);
passGroup();

assert.equal(validRuntime.checks.browserLocationExact, true);
assert.equal(validRuntime.checks.browserDocumentExact, true);
assert.equal(validRuntime.checks.activeInternalEquality, true);
assert.equal(validRuntime.checks.canonicalPrimaryEquality, true);
passGroup();

const validGroundTruth = compareConversationIdGroundTruth(
  validRuntime.resolvedId,
  expectedId,
);
assert.deepEqual(validGroundTruth, {
  expectedLength: 36,
  resolvedLength: 36,
  exactMatch: true,
});
passGroup();

const passingCase = evaluateTechnicalSpikeCase(
  validBrowserUrl,
  validSnapshot,
  expectedId,
);
assert.equal(passingCase.casePass, true);
assert.equal(passingCase.runtimeCurrentnessResolved, true);
assert.equal(passingCase.groundTruthExact, true);
assert.equal(passingCase.summary.revision, POC_VERSION);
passGroup();

// 5: unsupported route.
assertFailClosed(
  "browser tab unsupported route",
  "https://example.test/",
  validPageSnapshot(),
  CONVERSATION_ID_STATE.UNSUPPORTED_ROUTE,
);

// 6-11: Primary / page route failures.
assertFailClosed(
  "browser tab URL missing",
  null,
  validPageSnapshot(),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "browser tab URL malformed",
  "not a URL",
  validPageSnapshot(),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "primary ID missing",
  "https://example.test/c/",
  validPageSnapshot(),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "primary ID malformed",
  routeFor("short"),
  validPageSnapshot("short"),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "page URL mismatch",
  validBrowserUrl,
  validPageSnapshot(otherId),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "pathname mismatch",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    pageLocationPathname: `/c/${otherId}`,
  }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);

// Extra path segments are not silently ignored.
const extraSegmentParse = parseObservedStandardConversationRouteV1(
  `${validBrowserUrl}/extra`,
);
assert.equal(extraSegmentParse.supportedRoute, false);
assert.equal(extraSegmentParse.idCandidateCount, 2);
assertFailClosed(
  "primary route ambiguous extra segment",
  `${validBrowserUrl}/extra`,
  validPageSnapshot(),
  CONVERSATION_ID_STATE.AMBIGUOUS,
);

// 12-22: Active item failures.
assertFailClosed(
  "active anchor 0",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeAnchorCount: 0,
    activeAnchorHref: null,
    activeNestedIdValues: [],
  }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "active anchor 2+",
  validBrowserUrl,
  validPageSnapshot(expectedId, { activeAnchorCount: 2 }),
  CONVERSATION_ID_STATE.AMBIGUOUS,
);
assertFailClosed(
  "active binding false",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeAnchorHref: routeFor(expectedId, "https://other.example.test"),
  }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "anchor ID missing",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeAnchorHref: "https://example.test/c/",
  }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "anchor ID malformed",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeAnchorHref: routeFor("short"),
  }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "nested ID 0",
  validBrowserUrl,
  validPageSnapshot(expectedId, { activeNestedIdValues: [] }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "nested ID 2+",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeNestedIdValues: [expectedId, expectedId],
  }),
  CONVERSATION_ID_STATE.AMBIGUOUS,
);
assertFailClosed(
  "nested ID empty",
  validBrowserUrl,
  validPageSnapshot(expectedId, { activeNestedIdValues: [""] }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "nested ID malformed",
  validBrowserUrl,
  validPageSnapshot(expectedId, { activeNestedIdValues: ["short"] }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "anchor nested mismatch",
  validBrowserUrl,
  validPageSnapshot(expectedId, { activeNestedIdValues: [otherId] }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "active primary mismatch",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeAnchorHref: routeFor(otherId),
    activeNestedIdValues: [otherId],
  }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);

// 23-26: Canonical failures.
assertFailClosed(
  "canonical 0",
  validBrowserUrl,
  validPageSnapshot(expectedId, { canonicalHrefs: [] }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "canonical 2+",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    canonicalHrefs: [validBrowserUrl, validBrowserUrl],
  }),
  CONVERSATION_ID_STATE.AMBIGUOUS,
);
assertFailClosed(
  "canonical malformed",
  validBrowserUrl,
  validPageSnapshot(expectedId, { canonicalHrefs: ["not a URL"] }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);
assertFailClosed(
  "canonical primary mismatch",
  validBrowserUrl,
  validPageSnapshot(expectedId, { canonicalHrefs: [routeFor(otherId)] }),
  CONVERSATION_ID_STATE.INCONSISTENT,
);

// 27-31: Observed Format v1 failures without repair or normalization.
const formatFailures = [
  { name: "wrong length", value: expectedId.slice(1) },
  { name: "uppercase hex", value: expectedId.toUpperCase() },
  {
    name: "wrong hyphen position",
    value: `${expectedId.slice(0, 7)}-${expectedId[7]}${expectedId.slice(9)}`,
  },
  { name: "invalid character", value: `g${expectedId.slice(1)}` },
  { name: "empty", value: "" },
];
for (const formatFailure of formatFailures) {
  assert.equal(
    isObservedConversationIdFormatV1(formatFailure.value),
    false,
    formatFailure.name,
  );
  passGroup();
}
assert.equal(isObservedConversationIdFormatV1(expectedId), true);

// 32-35: no required-source fallback.
assertFailClosed(
  "primary only resolved",
  validBrowserUrl,
  validPageSnapshot(expectedId, {
    activeAnchorCount: 0,
    activeAnchorHref: null,
    activeNestedIdValues: [],
    canonicalHrefs: [],
  }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "active only resolved",
  null,
  validPageSnapshot(expectedId, { canonicalHrefs: [] }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "canonical only resolved",
  null,
  validPageSnapshot(expectedId, {
    activeAnchorCount: 0,
    activeAnchorHref: null,
    activeNestedIdValues: [],
  }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);
assertFailClosed(
  "one required group missing",
  validBrowserUrl,
  validPageSnapshot(expectedId, { canonicalHrefs: [] }),
  CONVERSATION_ID_STATE.UNRESOLVED,
);

// 36-37: all runtime sources can agree on a wrong ID; GT still blocks PASS.
const internallyConsistentWrongCase = evaluateTechnicalSpikeCase(
  routeFor(otherId),
  validPageSnapshot(otherId),
  expectedId,
);
assert.equal(internallyConsistentWrongCase.runtimeCurrentnessResolved, true);
assert.equal(
  internallyConsistentWrongCase.evaluation.state,
  CONVERSATION_ID_STATE.RESOLVED_CURRENT,
);
assert.equal(internallyConsistentWrongCase.groundTruthExact, false);
passGroup();
assert.equal(internallyConsistentWrongCase.casePass, false);
assert.equal(
  internallyConsistentWrongCase.summary.groundTruth.exactMatch,
  false,
);
passGroup();

// 38: invalid independent Ground Truth input.
for (const invalidGroundTruth of [null, "", "invalid"] ) {
  assert.throws(
    () => compareConversationIdGroundTruth(expectedId, invalidGroundTruth),
    (error) => error?.code === "GROUND_TRUTH_INPUT_ERROR",
  );
}
passGroup();

process.stdout.write(
  `TV-003 Minimal PoC v1 self-test: PASS (${assertionGroups} groups)\n`,
);
