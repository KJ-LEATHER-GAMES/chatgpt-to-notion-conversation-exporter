import assert from "node:assert/strict";

import {
  CANDIDATE_STATE,
  FORMAL_STEP_FRACTION,
  classifyCandidate,
  classifyRunAccumulator,
  compareWithGroundTruth,
  computeFormalNextScrollTop,
  createRunAccumulator,
  evaluateScrollProgress,
  evaluateTechnicalSpikeCase,
  evaluateTraversalTermination,
  findOrdinalGaps,
  mergeIntoRunAccumulator,
  resolveUniqueScroller,
  runTask003MinimalTraversal,
  validateMountedObservation,
  validateScrollerContinuity,
  visibleNow,
  waitForStableVisibleDOM,
} from "./tv005-tv006-long-conversation-poc.mjs";

function rawItem(ordinal, runtimeId = `r${ordinal}`, overrides = {}) {
  return {
    domIndex: ordinal - 1,
    ordinal,
    runtimeIdCount: 1,
    runtimeId,
    turnIdCount: 1,
    turnId: `t${ordinal}`,
    roleCount: 1,
    role: ordinal % 2 === 1 ? "user" : "assistant",
    ...overrides,
  };
}

function observation(ordinals, overrides = {}) {
  return {
    pageVisible: true,
    scroll: {
      top: 100,
      height: 1000,
      clientHeight: 100,
      atTopCandidate: false,
      atBottomCandidate: false,
    },
    mountedRaw: ordinals.map((ordinal) => rawItem(ordinal)),
    extractionViolations: [],
    ...overrides,
  };
}

function acceptedSnapshot(ordinals, overrides = {}) {
  return validateMountedObservation(observation(ordinals, overrides));
}

function candidate(overrides = {}) {
  return classifyCandidate({
    pageVisibleThroughout: true,
    topEstablished: true,
    bottomEstablished: true,
    observedOrdinals: [1, 2, 3, 4, 5],
    captureRejected: false,
    identityConflict: false,
    domOrderConsistent: true,
    blocked: false,
    ambiguous: false,
    ...overrides,
  });
}

function mergeSnapshot(state, ordinals, overrides = {}) {
  const validated = acceptedSnapshot(ordinals, overrides);
  return mergeIntoRunAccumulator(state, validated);
}

function setBoundary(snapshot, { top = false, bottom = false } = {}) {
  return {
    ...snapshot,
    scroll: {
      ...(snapshot.scroll ?? {}),
      atTopCandidate: top,
      atBottomCandidate: bottom,
    },
  };
}



function fakeAttrNode(attr, value) {
  return {
    getAttribute(name) {
      return name === attr ? value : null;
    },
  };
}

function makeFakeSection(ordinal, scroller) {
  const role = ordinal % 2 === 1 ? "user" : "assistant";
  const attrs = {
    "data-message-id": `runtime-${ordinal}`,
    "data-turn-id": `turn-${ordinal}`,
    "data-message-author-role": role,
  };
  return {
    parentElement: scroller,
    getAttribute(name) {
      if (name === "data-testid") return `conversation-turn-${ordinal}`;
      return null;
    },
    matches() {
      return false;
    },
    querySelectorAll(selector) {
      const match = selector.match(/^\[([^\]]+)\]$/);
      const attr = match?.[1] ?? null;
      return attr && attr in attrs ? [fakeAttrNode(attr, attrs[attr])] : [];
    },
  };
}

async function runSyntheticBrowserTraversal() {
  const scroller = {
    scrollTop: 0,
    scrollHeight: 500,
    clientHeight: 100,
    parentElement: null,
  };
  const currentOrdinals = () => {
    const band = Math.floor(scroller.scrollTop / 100);
    if (band <= 0) return [1, 2];
    if (band === 1) return [2, 3];
    if (band === 2) return [3, 4];
    if (band === 3) return [4, 5];
    return [4, 5];
  };
  const documentLike = {
    visibilityState: "visible",
    hidden: false,
    hasFocus() {
      return false;
    },
    querySelector(selector) {
      if (!selector.includes("conversation-turn-")) return null;
      return makeFakeSection(currentOrdinals()[0], scroller);
    },
    querySelectorAll(selector) {
      if (!selector.includes("conversation-turn-")) return [];
      return currentOrdinals().map((ordinal) => makeFakeSection(ordinal, scroller));
    },
  };
  const original = globalThis.getComputedStyle;
  globalThis.getComputedStyle = () => ({ overflowY: "auto" });
  try {
    return await runTask003MinimalTraversal({
      documentLike,
      sleep: async () => {},
      maxSettleSamples: 3,
      settleIntervalMs: 0,
      requiredStableSamples: 3,
    });
  } finally {
    globalThis.getComputedStyle = original;
  }
}

let assertionGroups = 0;
function group(_name, callback) {
  assertionGroups += 1;
  callback();
}

async function groupAsync(_name, callback) {
  assertionGroups += 1;
  await callback();
}

// PASS-001
group("PASS-001 contiguous complete candidate", () => {
  assert.equal(candidate(), CANDIDATE_STATE.COMPLETE);
});

// PASS-002
group("PASS-002 remount overlap deduplicates by runtime identity", () => {
  const state = createRunAccumulator();
  mergeIntoRunAccumulator(
    state,
    setBoundary(acceptedSnapshot([1, 2, 3]), { top: true }),
  );
  mergeSnapshot(state, [2, 3, 4]);
  mergeIntoRunAccumulator(
    state,
    setBoundary(acceptedSnapshot([4, 5]), { bottom: true }),
  );
  assert.equal(state.runtimeMeta.size, 5);
  assert.equal(state.remountDedupCount, 3);
  assert.equal(classifyRunAccumulator(state), CANDIDATE_STATE.COMPLETE);
});

// PASS-003
group("PASS-003 union convergence before Bottom does not terminate", () => {
  const beforeBottom = evaluateTraversalTermination({
    atBottomCandidate: false,
    blocked: false,
    unionCount: 200,
    newRuntimeIdentityCount: 0,
  });
  assert.equal(beforeBottom.stop, false);
  const atBottom = evaluateTraversalTermination({
    atBottomCandidate: true,
    blocked: false,
    unionCount: 200,
    newRuntimeIdentityCount: 0,
  });
  assert.equal(atBottom.stop, true);
  assert.equal(atBottom.reason, "BOTTOM_REACHED");
});

// FAIL-001
group("FAIL-001 page hidden before traversal => BLOCKED", () => {
  assert.equal(
    candidate({ pageVisibleThroughout: false }),
    CANDIDATE_STATE.BLOCKED,
  );
  assert.equal(visibleNow({ visibilityState: "hidden", hidden: true }), false);
});

// FAIL-002
await groupAsync("FAIL-002 page becomes hidden during settle => BLOCKED", async () => {
  let visible = true;
  const documentLike = {
    get visibilityState() {
      return visible ? "visible" : "hidden";
    },
    get hidden() {
      return !visible;
    },
  };
  let sleepCalls = 0;
  const result = await waitForStableVisibleDOM({
    documentLike,
    scroller: { scrollTop: 0, scrollHeight: 1000, clientHeight: 100 },
    getMountedOrdinals: () => [1, 2],
    sleep: async () => {
      sleepCalls += 1;
      if (sleepCalls === 2) visible = false;
    },
    maxSamples: 5,
    requiredStableSamples: 3,
  });
  assert.equal(result.settled, false);
  assert.equal(result.blocked, true);
  assert.equal(result.reason, "PAGE_BECAME_HIDDEN");
});

// FAIL-003
group("FAIL-003 missing Top => UNKNOWN", () => {
  assert.equal(candidate({ topEstablished: false }), CANDIDATE_STATE.UNKNOWN);
});

// FAIL-004
group("FAIL-004 missing Bottom => UNKNOWN", () => {
  assert.equal(candidate({ bottomEstablished: false }), CANDIDATE_STATE.UNKNOWN);
});

// FAIL-005
group("FAIL-005 internal ordinal gap => INCOMPLETE", () => {
  assert.equal(
    candidate({ observedOrdinals: [1, 2, 3, 5, 6] }),
    CANDIDATE_STATE.INCOMPLETE,
  );
});

// FAIL-006
group("FAIL-006 first ordinal not 1 => INCOMPLETE", () => {
  assert.equal(
    candidate({ observedOrdinals: [2, 3, 4, 5] }),
    CANDIDATE_STATE.INCOMPLETE,
  );
});

// FAIL-007
group("FAIL-007 duplicate ordinal in snapshot rejected", () => {
  const result = acceptedSnapshot([1, 2, 2, 3]);
  assert.equal(result.accepted, false);
  assert.ok(result.violations.includes("ORDINAL_DUPLICATE_IN_SNAPSHOT"));
});

// FAIL-008
group("FAIL-008 duplicate runtime identity in snapshot rejected", () => {
  const result = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "same"), rawItem(2, "same")],
  });
  assert.equal(result.accepted, false);
  assert.ok(result.violations.includes("RUNTIME_ID_DUPLICATE_IN_SNAPSHOT"));
});

// FAIL-009
group("FAIL-009 runtime identity changes ordinal => INCONSISTENT", () => {
  const state = createRunAccumulator();
  mergeSnapshot(state, [1]);
  const changed = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(2, "r1", { turnId: "t1", role: "user" })],
  });
  const merged = mergeIntoRunAccumulator(state, changed);
  assert.ok(merged.violations.includes("RUNTIME_ORDINAL_CONFLICT"));
  assert.equal(state.identityConflict, true);
  state.topEstablished = true;
  state.bottomEstablished = true;
  assert.equal(classifyRunAccumulator(state), CANDIDATE_STATE.INCONSISTENT);
});

// FAIL-010
group("FAIL-010 runtime identity changes turn => INCONSISTENT", () => {
  const state = createRunAccumulator();
  mergeSnapshot(state, [1]);
  const changed = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "r1", { turnId: "other-turn" })],
  });
  const merged = mergeIntoRunAccumulator(state, changed);
  assert.ok(merged.violations.includes("RUNTIME_TURN_CONFLICT"));
});

// FAIL-011
group("FAIL-011 runtime identity changes role => INCONSISTENT", () => {
  const state = createRunAccumulator();
  mergeSnapshot(state, [1]);
  const changed = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "r1", { role: "assistant" })],
  });
  const merged = mergeIntoRunAccumulator(state, changed);
  assert.ok(merged.violations.includes("RUNTIME_ROLE_CONFLICT"));
});

// FAIL-012
group("FAIL-012 one ordinal maps to two runtime identities", () => {
  const state = createRunAccumulator();
  mergeSnapshot(state, [1]);
  const changed = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "r-other", { turnId: "t-other" })],
  });
  const merged = mergeIntoRunAccumulator(state, changed);
  assert.ok(merged.violations.includes("ORDINAL_RUNTIME_CONFLICT"));
});

// FAIL-013
group("FAIL-013 one turn maps to two runtime identities", () => {
  const state = createRunAccumulator();
  mergeSnapshot(state, [1]);
  const changed = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(2, "r-other", { turnId: "t1" })],
  });
  const merged = mergeIntoRunAccumulator(state, changed);
  assert.ok(merged.violations.includes("TURN_RUNTIME_CONFLICT"));
});

// FAIL-014
group("FAIL-014 DOM ordinal order contradiction rejected", () => {
  const result = acceptedSnapshot([1, 3, 2, 4]);
  assert.equal(result.accepted, false);
  assert.equal(result.domOrderConsistent, false);
  assert.ok(result.violations.includes("DOM_ORDER_ORDINAL_CONTRADICTION"));
});

// FAIL-015
group("FAIL-015 Message identity cardinality invalid", () => {
  const missing = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "", { runtimeIdCount: 0, runtimeId: null })],
  });
  assert.equal(missing.accepted, false);
  assert.ok(missing.violations.includes("RUNTIME_ID_CARDINALITY_INVALID"));

  const multiple = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "x", { runtimeIdCount: 2 })],
  });
  assert.equal(multiple.accepted, false);
});

// FAIL-016
group("FAIL-016 turn identity cardinality invalid", () => {
  const result = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "r1", { turnIdCount: 0, turnId: null })],
  });
  assert.equal(result.accepted, false);
  assert.ok(result.violations.includes("TURN_ID_CARDINALITY_INVALID"));
});

// FAIL-017
group("FAIL-017 role cardinality invalid", () => {
  const result = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "r1", { roleCount: 2 })],
  });
  assert.equal(result.accepted, false);
  assert.ok(result.violations.includes("ROLE_CARDINALITY_INVALID"));
});

group("FAIL-017b unsupported role rejected", () => {
  const result = validateMountedObservation({
    ...observation([]),
    mountedRaw: [rawItem(1, "r1", { role: "system" })],
  });
  assert.equal(result.accepted, false);
  assert.ok(result.violations.includes("ROLE_INVALID"));
});

// FAIL-018
group("FAIL-018 scroll container missing => BLOCKED", () => {
  const result = resolveUniqueScroller([]);
  assert.equal(result.count, 0);
  assert.equal(result.blocked, true);
  assert.equal(result.reason, "SCROLL_CONTAINER_UNAVAILABLE");
});

// FAIL-019
group("FAIL-019 multiple scroll containers => BLOCKED", () => {
  const result = resolveUniqueScroller([{}, {}]);
  assert.equal(result.count, 2);
  assert.equal(result.blocked, true);
  assert.equal(result.reason, "SCROLL_CONTAINER_AMBIGUOUS");
});

// FAIL-020
group("FAIL-020 scroll container changes mid-run => BLOCKED", () => {
  const state = createRunAccumulator();
  const first = {};
  const second = {};
  assert.equal(validateScrollerContinuity(state, first), true);
  assert.equal(validateScrollerContinuity(state, second), false);
  assert.equal(state.blocked, true);
  assert.equal(state.blockedReason, "SCROLL_CONTAINER_CHANGED");
});

// FAIL-021
await groupAsync("FAIL-021 DOM settle timeout => BLOCKED", async () => {
  let sample = 0;
  const scroller = {
    get scrollTop() {
      sample += 1;
      return sample;
    },
    scrollHeight: 1000,
    clientHeight: 100,
  };
  const result = await waitForStableVisibleDOM({
    documentLike: { visibilityState: "visible", hidden: false },
    scroller,
    getMountedOrdinals: () => [1, sample],
    sleep: async () => {},
    maxSamples: 4,
    requiredStableSamples: 3,
  });
  assert.equal(result.settled, false);
  assert.equal(result.reason, "DOM_STABILITY_TIMEOUT");
});

// FAIL-022
group("FAIL-022 no scroll progress before Bottom => BLOCKED relation", () => {
  const result = evaluateScrollProgress({
    beforeTop: 100,
    afterTop: 100,
    atBottomCandidate: false,
  });
  assert.equal(result.ok, false);
  assert.equal(result.reason, "NO_SCROLL_PROGRESS_BEFORE_BOTTOM");
});

// ASA-001
group("ASA-001 expected count match cannot repair ordinal gap", () => {
  const result = classifyCandidate({
    pageVisibleThroughout: true,
    topEstablished: true,
    bottomEstablished: true,
    observedOrdinals: [1, 2, 3, 5, 6],
    captureRejected: false,
    identityConflict: false,
    domOrderConsistent: true,
    blocked: false,
    expectedCount: 5,
    capturedCount: 5,
  });
  assert.equal(result, CANDIDATE_STATE.INCOMPLETE);
});

// ASA-002
group("ASA-002 union reaching expected count before Bottom does not stop", () => {
  const result = evaluateTraversalTermination({
    atBottomCandidate: false,
    blocked: false,
    unionCount: 200,
    expectedCount: 200,
  });
  assert.equal(result.stop, false);
});

// ASA-003
group("ASA-003 one no-new-ID sample does not stop", () => {
  const result = evaluateTraversalTermination({
    atBottomCandidate: false,
    blocked: false,
    newRuntimeIdentityCount: 0,
  });
  assert.equal(result.stop, false);
});

// ASA-004
group("ASA-004 repeated local convergence does not stop", () => {
  for (let index = 0; index < 5; index += 1) {
    const result = evaluateTraversalTermination({
      atBottomCandidate: false,
      blocked: false,
      newRuntimeIdentityCount: 0,
      consecutiveNoNewIdSamples: index + 1,
    });
    assert.equal(result.stop, false);
  }
});

// ASA-005
group("ASA-005 first and last ordinal present with internal gap", () => {
  assert.equal(
    candidate({ observedOrdinals: [1, 2, 3, 9, 10] }),
    CANDIDATE_STATE.INCOMPLETE,
  );
});

// ASA-006
group("ASA-006 Top + Bottom with internal gap remains INCOMPLETE", () => {
  assert.equal(
    candidate({ observedOrdinals: [1, 2, 4, 5] }),
    CANDIDATE_STATE.INCOMPLETE,
  );
});

group("classifier source has no expectedCount/unionCount control", () => {
  const source = classifyCandidate.toString();
  assert.equal(source.includes("expectedCount"), false);
  assert.equal(source.includes("unionCount"), false);
});

group("termination source has no expectedCount/unionCount/no-new-ID control", () => {
  const source = evaluateTraversalTermination.toString();
  assert.equal(source.includes("expectedCount"), false);
  assert.equal(source.includes("unionCount"), false);
  assert.equal(source.includes("newRuntimeIdentityCount"), false);
  assert.equal(source.includes("ordinalMax"), false);
});

group("20 percent formal step is codified", () => {
  assert.equal(FORMAL_STEP_FRACTION, 0.2);
  assert.equal(
    computeFormalNextScrollTop({ scrollTop: 100, scrollHeight: 1000, clientHeight: 100 }),
    120,
  );
});

group("findOrdinalGaps detects exact internal hole", () => {
  const result = findOrdinalGaps([1, 2, 4, 5]);
  assert.deepEqual(result.ordinals, [1, 2, 4, 5]);
  assert.deepEqual(result.gaps, [
    { afterOrdinal: 2, beforeOrdinal: 4, missingOrdinalCount: 1 },
  ]);
});

group("ambiguous candidate fails closed", () => {
  assert.equal(candidate({ ambiguous: true }), CANDIDATE_STATE.AMBIGUOUS);
});

group("capture rejection fails closed as INCONSISTENT", () => {
  assert.equal(
    candidate({ captureRejected: true }),
    CANDIDATE_STATE.INCONSISTENT,
  );
});

group("identity conflict fails closed as INCONSISTENT", () => {
  assert.equal(
    candidate({ identityConflict: true }),
    CANDIDATE_STATE.INCONSISTENT,
  );
});

group("DOM order contradiction fails closed as INCONSISTENT", () => {
  assert.equal(
    candidate({ domOrderConsistent: false }),
    CANDIDATE_STATE.INCONSISTENT,
  );
});

group("Ground Truth comparison occurs after frozen candidate", () => {
  const state = createRunAccumulator();
  mergeIntoRunAccumulator(
    state,
    setBoundary(acceptedSnapshot([1, 2, 3]), { top: true, bottom: true }),
  );
  const runtimeSummaryBefore = {
    candidate: classifyRunAccumulator(state),
    union: state.runtimeMeta.size,
  };
  assert.equal(runtimeSummaryBefore.candidate, CANDIDATE_STATE.COMPLETE);

  const evaluation = evaluateTechnicalSpikeCase({
    state,
    groundTruth: { expectedDistinctOccurrences: 3 },
  });
  assert.equal(evaluation.casePass, true);
  assert.equal(evaluation.oracle.distinctRuntimeCountMatches, true);
  assert.equal(evaluation.oracle.ordinalBoundaryMatches, true);
});

group("Ground Truth mismatch cannot change frozen candidate", () => {
  const runtimeSummary = {
    distinctRuntimeCount: 5,
    observedOrdinalMin: 1,
    observedOrdinalMax: 5,
  };
  const oracle = compareWithGroundTruth({
    frozenCandidate: CANDIDATE_STATE.COMPLETE,
    runtimeSummary,
    groundTruth: { expectedDistinctOccurrences: 6 },
  });
  assert.equal(oracle.candidate, CANDIDATE_STATE.COMPLETE);
  assert.equal(oracle.distinctRuntimeCountMatches, false);
  assert.equal(oracle.ordinalBoundaryMatches, false);
});

group("non-complete candidate is not positive-oracle eligible", () => {
  const oracle = compareWithGroundTruth({
    frozenCandidate: CANDIDATE_STATE.INCOMPLETE,
    runtimeSummary: {
      distinctRuntimeCount: 5,
      observedOrdinalMin: 1,
      observedOrdinalMax: 5,
    },
    groundTruth: { expectedDistinctOccurrences: 5 },
  });
  assert.equal(oracle.candidateEligible, false);
  assert.equal(oracle.distinctRuntimeCountMatches, false);
  assert.equal(oracle.ordinalBoundaryMatches, false);
});

group("run-local accumulator instances do not share identity union", () => {
  const a = createRunAccumulator();
  const b = createRunAccumulator();
  mergeSnapshot(a, [1]);
  assert.equal(a.runtimeMeta.size, 1);
  assert.equal(b.runtimeMeta.size, 0);
});


await groupAsync("browser-facing synthetic traversal codifies Top->Bottom 20% baseline", async () => {
  const summary = await runSyntheticBrowserTraversal();
  assert.equal(summary.candidate, CANDIDATE_STATE.COMPLETE);
  assert.equal(summary.topEstablished, true);
  assert.equal(summary.bottomEstablished, true);
  assert.equal(summary.distinctRuntimeCount, 5);
  assert.equal(summary.observedOrdinalMin, 1);
  assert.equal(summary.observedOrdinalMax, 5);
  assert.equal(summary.ordinalGapCount, 0);
  assert.ok(summary.snapshotCount > 5);
  const serialized = JSON.stringify(summary);
  assert.equal(serialized.includes("runtime-1"), false);
  assert.equal(serialized.includes("turn-1"), false);
});

group("document focus is not a traversal/classifier precondition", () => {
  assert.equal(classifyCandidate.toString().includes("hasFocus"), false);
  assert.equal(runTask003MinimalTraversal.toString().includes("hasFocus"), false);
});

group("browser traversal source has no expectedCount or unionCount stop input", () => {
  const source = runTask003MinimalTraversal.toString();
  assert.equal(source.includes("expectedCount"), false);
  assert.equal(source.includes("unionCount"), false);
});


console.log(
  `TASK-003 TV-005/TV-006 Minimal PoC self-test: PASS (${assertionGroups} assertion groups)`,
);
