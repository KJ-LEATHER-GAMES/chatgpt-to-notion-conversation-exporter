import assert from "node:assert/strict";

import {
  TITLE_STATE,
  compareTitleGroundTruth,
  evaluateTechnicalSpikeCase,
  evaluateTitleSnapshot,
} from "./tv002-title-poc.mjs";

const completeValue = "complete prototype title";

function validSnapshot(overrides = {}) {
  return {
    activeSidebarCount: 1,
    currentRouteBound: true,
    sidebarText: completeValue,
    sidebarAriaLabel: completeValue,
    headTitleTexts: [completeValue],
    documentTitle: completeValue,
    routeMatchingAnchorCount: 2,
    visualOnlyClipping: false,
    domValueKnownTruncated: false,
    ...overrides,
  };
}

const accepted = evaluateTitleSnapshot(validSnapshot());
assert.equal(accepted.state, TITLE_STATE.RESOLVED_CURRENT);
assert.equal(accepted.accepted, true);
assert.equal(accepted.failClosed, false);

const clippedButFull = evaluateTitleSnapshot(
  validSnapshot({ visualOnlyClipping: true }),
);
assert.equal(clippedButFull.state, TITLE_STATE.RESOLVED_CURRENT);
assert.equal(clippedButFull.accepted, true);

const failClosedCases = [
  {
    name: "active item 0",
    snapshot: validSnapshot({
      activeSidebarCount: 0,
      currentRouteBound: false,
      sidebarText: null,
      sidebarAriaLabel: null,
    }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "active item 2+",
    snapshot: validSnapshot({ activeSidebarCount: 2 }),
    state: TITLE_STATE.AMBIGUOUS,
  },
  {
    name: "sidebar text empty",
    snapshot: validSnapshot({ sidebarText: "" }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "aria-label empty",
    snapshot: validSnapshot({ sidebarAriaLabel: "" }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "sidebar internal mismatch",
    snapshot: validSnapshot({ sidebarAriaLabel: "different" }),
    state: TITLE_STATE.INCONSISTENT,
  },
  {
    name: "route binding false",
    snapshot: validSnapshot({ currentRouteBound: false }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "head title 0",
    snapshot: validSnapshot({ headTitleTexts: [] }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "head title 2+",
    snapshot: validSnapshot({
      headTitleTexts: [completeValue, completeValue],
    }),
    state: TITLE_STATE.AMBIGUOUS,
  },
  {
    name: "document title empty",
    snapshot: validSnapshot({ documentTitle: "" }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "document internal mismatch",
    snapshot: validSnapshot({ documentTitle: "different" }),
    state: TITLE_STATE.INCONSISTENT,
  },
  {
    name: "cross-source mismatch",
    snapshot: validSnapshot({
      documentTitle: "document value",
      headTitleTexts: ["document value"],
    }),
    state: TITLE_STATE.INCONSISTENT,
  },
  {
    name: "sidebar only resolved",
    snapshot: validSnapshot({ documentTitle: "", headTitleTexts: [] }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "document only resolved",
    snapshot: validSnapshot({
      activeSidebarCount: 0,
      currentRouteBound: false,
      sidebarText: null,
      sidebarAriaLabel: null,
    }),
    state: TITLE_STATE.UNRESOLVED,
  },
  {
    name: "known DOM truncation",
    snapshot: validSnapshot({ domValueKnownTruncated: true }),
    state: TITLE_STATE.UNRESOLVED,
  },
];

for (const testCase of failClosedCases) {
  const result = evaluateTitleSnapshot(testCase.snapshot);
  assert.equal(result.accepted, false, testCase.name);
  assert.equal(result.failClosed, true, testCase.name);
  assert.equal(result.state, testCase.state, testCase.name);
}

const identicalButWrongValue = "truncated";
const independentExpectedValue = "truncated plus missing suffix";
const identicalWrongSnapshot = validSnapshot({
  sidebarText: identicalButWrongValue,
  sidebarAriaLabel: identicalButWrongValue,
  headTitleTexts: [identicalButWrongValue],
  documentTitle: identicalButWrongValue,
});
const separatedChecks = evaluateTechnicalSpikeCase(
  identicalWrongSnapshot,
  independentExpectedValue,
);
assert.equal(separatedChecks.runtimeCurrentnessResolved, true);
assert.equal(separatedChecks.groundTruthExact, false);
assert.equal(separatedChecks.casePass, false);
assert.equal(separatedChecks.summary.state, TITLE_STATE.RESOLVED_CURRENT);
assert.equal(separatedChecks.summary.groundTruth.exactMatch, false);

const matchingGroundTruth = compareTitleGroundTruth(
  completeValue,
  completeValue,
);
assert.equal(matchingGroundTruth.exactMatch, true);
assert.equal(matchingGroundTruth.expectedLength, completeValue.length);
assert.equal(matchingGroundTruth.resolvedLength, completeValue.length);

assert.throws(
  () => compareTitleGroundTruth(completeValue, ""),
  (error) => error?.code === "GROUND_TRUTH_INPUT_ERROR",
);

process.stdout.write("TV-002 Minimal PoC v1 self-test: PASS\n");
