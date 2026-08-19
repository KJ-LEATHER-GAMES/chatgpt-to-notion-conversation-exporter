/**
 * TASK-003 Long Conversation / Completeness Minimal PoC
 *
 * Phase 0 validation code only. This module codifies the adopted TV-005 / TV-006
 * candidate contracts. It is not a Production adapter, retry policy, popup,
 * Notion integration, or generalized browser lifecycle implementation.
 */

export const POC_VERSION = "task003-tv005-tv006-minimal-poc-v1";
export const TURN_SELECTOR = 'section[data-testid^="conversation-turn-"]';
export const FORMAL_STEP_FRACTION = 0.2;
export const DEFAULT_BOTTOM_TOLERANCE_PX = 1;

export const CANDIDATE_STATE = Object.freeze({
  COMPLETE: "COMPLETE_CANDIDATE",
  INCOMPLETE: "INCOMPLETE",
  UNKNOWN: "UNKNOWN",
  AMBIGUOUS: "AMBIGUOUS",
  INCONSISTENT: "INCONSISTENT",
  BLOCKED: "BLOCKED",
});

export const TERMINATION_REASON = Object.freeze({
  BOTTOM_REACHED: "BOTTOM_REACHED",
  BLOCKED: "BLOCKED",
});

const VALID_ROLES = new Set(["user", "assistant"]);

function addUnique(list, code) {
  if (!list.includes(code)) list.push(code);
}

export function visibleNow(documentLike = globalThis.document) {
  return (
    documentLike?.visibilityState === "visible" &&
    documentLike?.hidden === false
  );
}

export function parseTurnOrdinal(testId) {
  const match = String(testId ?? "").match(/^conversation-turn-(\d+)$/);
  if (!match) return null;
  const ordinal = Number(match[1]);
  return Number.isSafeInteger(ordinal) && ordinal > 0 ? ordinal : null;
}

export function isStrictlyIncreasing(ordinals) {
  return ordinals.every(
    (value, index) => index === 0 || value > ordinals[index - 1],
  );
}

export function findOrdinalGaps(ordinalIterable) {
  const ordinals = [...new Set(ordinalIterable)].sort((a, b) => a - b);
  const gaps = [];

  for (let index = 1; index < ordinals.length; index += 1) {
    const previous = ordinals[index - 1];
    const current = ordinals[index];
    if (current > previous + 1) {
      gaps.push({
        afterOrdinal: previous,
        beforeOrdinal: current,
        missingOrdinalCount: current - previous - 1,
      });
    }
  }

  return { ordinals, gaps };
}

export function exactlyOneWithin(section, attr) {
  const selfMatches = section.matches?.(`[${attr}]`) ? [section] : [];
  const descendants = [...(section.querySelectorAll?.(`[${attr}]`) ?? [])];
  const nodes = [...selfMatches, ...descendants];

  return {
    count: nodes.length,
    value:
      nodes.length === 1
        ? (nodes[0].getAttribute?.(attr)?.trim() ?? "")
        : null,
  };
}

/**
 * Browser-facing raw extraction. Raw identities remain in memory only.
 * Validation is delegated to validateMountedObservation so deterministic
 * self-tests can exercise the same contract without a live ChatGPT page.
 */
export function extractMountedObservation({
  documentLike = globalThis.document,
  scroller,
  turnSelector = TURN_SELECTOR,
  bottomTolerancePx = DEFAULT_BOTTOM_TOLERANCE_PX,
} = {}) {
  if (!documentLike) {
    return {
      pageVisible: false,
      scroll: null,
      mountedRaw: [],
      extractionViolations: ["DOCUMENT_UNAVAILABLE"],
    };
  }

  const sections = [...documentLike.querySelectorAll(turnSelector)];
  const mountedRaw = sections.map((section, domIndex) => {
    const runtime = exactlyOneWithin(section, "data-message-id");
    const turn = exactlyOneWithin(section, "data-turn-id");
    const role = exactlyOneWithin(section, "data-message-author-role");

    return {
      domIndex,
      ordinal: parseTurnOrdinal(section.getAttribute("data-testid")),
      runtimeIdCount: runtime.count,
      runtimeId: runtime.value,
      turnIdCount: turn.count,
      turnId: turn.value,
      roleCount: role.count,
      role: role.value,
    };
  });

  const scroll = scroller
    ? getScrollGeometry(scroller, bottomTolerancePx)
    : null;

  return {
    pageVisible: visibleNow(documentLike),
    scroll,
    mountedRaw,
    extractionViolations: [],
  };
}

/**
 * Pure capture validator. It does not sort or repair DOM order.
 */
export function validateMountedObservation(rawObservation) {
  const observation = rawObservation ?? {};
  const mountedRaw = Array.isArray(observation.mountedRaw)
    ? observation.mountedRaw
    : [];
  const violations = [...(observation.extractionViolations ?? [])];
  const items = [];
  const ordinals = [];
  const ordinalsInSnapshot = new Set();
  const runtimeIdsInSnapshot = new Set();

  mountedRaw.forEach((rawItem, domIndex) => {
    const itemIndex = Number.isSafeInteger(rawItem.domIndex)
      ? rawItem.domIndex
      : domIndex;
    const ordinal = rawItem.ordinal;

    if (!Number.isSafeInteger(ordinal) || ordinal <= 0) {
      addUnique(violations, "ORDINAL_INVALID");
      return;
    }
    ordinals.push(ordinal);

    if (ordinalsInSnapshot.has(ordinal)) {
      addUnique(violations, "ORDINAL_DUPLICATE_IN_SNAPSHOT");
    } else {
      ordinalsInSnapshot.add(ordinal);
    }

    if (rawItem.runtimeIdCount !== 1 || !String(rawItem.runtimeId ?? "").trim()) {
      addUnique(violations, "RUNTIME_ID_CARDINALITY_INVALID");
      return;
    }
    if (rawItem.turnIdCount !== 1 || !String(rawItem.turnId ?? "").trim()) {
      addUnique(violations, "TURN_ID_CARDINALITY_INVALID");
      return;
    }
    if (rawItem.roleCount !== 1 || !String(rawItem.role ?? "").trim()) {
      addUnique(violations, "ROLE_CARDINALITY_INVALID");
      return;
    }
    if (!VALID_ROLES.has(rawItem.role)) {
      addUnique(violations, "ROLE_INVALID");
      return;
    }

    const runtimeId = String(rawItem.runtimeId).trim();
    const turnId = String(rawItem.turnId).trim();

    if (runtimeIdsInSnapshot.has(runtimeId)) {
      addUnique(violations, "RUNTIME_ID_DUPLICATE_IN_SNAPSHOT");
    } else {
      runtimeIdsInSnapshot.add(runtimeId);
    }

    items.push({
      domIndex: itemIndex,
      ordinal,
      runtimeId,
      turnId,
      role: rawItem.role,
    });
  });

  const domOrderConsistent = isStrictlyIncreasing(ordinals);
  if (!domOrderConsistent) {
    addUnique(violations, "DOM_ORDER_ORDINAL_CONTRADICTION");
  }

  return {
    accepted: violations.length === 0,
    pageVisible: observation.pageVisible === true,
    scroll: observation.scroll ?? null,
    items,
    ordinals,
    domOrderConsistent,
    violations,
  };
}

export function createRunAccumulator() {
  return {
    version: POC_VERSION,
    runtimeMeta: new Map(),
    ordinalToRuntime: new Map(),
    turnToRuntime: new Map(),
    observedOrdinals: new Set(),
    snapshots: [],
    remountDedupCount: 0,
    failed: false,
    blocked: false,
    blockedReason: null,
    ambiguous: false,
    captureRejected: false,
    identityConflict: false,
    domOrderConsistent: true,
    pageVisibleThroughout: true,
    topEstablished: false,
    bottomEstablished: false,
    scroller: null,
  };
}

export function validateIdentityRelation(state, item) {
  const previous = state.runtimeMeta.get(item.runtimeId);
  if (previous) {
    if (previous.ordinal !== item.ordinal) {
      return { ok: false, reason: "RUNTIME_ORDINAL_CONFLICT" };
    }
    if (previous.turnId !== item.turnId) {
      return { ok: false, reason: "RUNTIME_TURN_CONFLICT" };
    }
    if (previous.role !== item.role) {
      return { ok: false, reason: "RUNTIME_ROLE_CONFLICT" };
    }
  }

  const byOrdinal = state.ordinalToRuntime.get(item.ordinal);
  if (byOrdinal && byOrdinal !== item.runtimeId) {
    return { ok: false, reason: "ORDINAL_RUNTIME_CONFLICT" };
  }

  const byTurn = state.turnToRuntime.get(item.turnId);
  if (byTurn && byTurn !== item.runtimeId) {
    return { ok: false, reason: "TURN_RUNTIME_CONFLICT" };
  }

  return { ok: true, reason: null };
}

export function blockRun(state, reason) {
  state.blocked = true;
  state.failed = true;
  state.blockedReason ??= reason;
  return state;
}

export function validateScrollerContinuity(state, scroller) {
  if (!scroller) {
    blockRun(state, "SCROLL_CONTAINER_UNAVAILABLE");
    return false;
  }
  if (state.scroller === null) {
    state.scroller = scroller;
    return true;
  }
  if (state.scroller !== scroller) {
    blockRun(state, "SCROLL_CONTAINER_CHANGED");
    return false;
  }
  return true;
}

/**
 * Merge one accepted/rejected mounted snapshot into a fresh run-local union.
 * Runtime Message identity is acquisition/dedup state, never a terminal oracle.
 */
export function mergeIntoRunAccumulator(state, validatedSnapshot) {
  const snapshot = validatedSnapshot ?? {
    accepted: false,
    pageVisible: false,
    items: [],
    ordinals: [],
    domOrderConsistent: false,
    violations: ["SNAPSHOT_MISSING"],
  };

  if (!snapshot.pageVisible) {
    state.pageVisibleThroughout = false;
    blockRun(state, "PAGE_NOT_VISIBLE_AT_CAPTURE");
  }

  if (!snapshot.accepted) {
    state.captureRejected = true;
    state.failed = true;
  }
  if (!snapshot.domOrderConsistent) {
    state.domOrderConsistent = false;
  }

  let newRuntimeIdentityCount = 0;
  const mergeViolations = [...snapshot.violations];

  if (snapshot.accepted) {
    for (const item of snapshot.items) {
      const relation = validateIdentityRelation(state, item);
      if (!relation.ok) {
        state.identityConflict = true;
        state.failed = true;
        addUnique(mergeViolations, relation.reason);
        continue;
      }

      const previous = state.runtimeMeta.get(item.runtimeId);
      if (previous) {
        state.remountDedupCount += 1;
      } else {
        newRuntimeIdentityCount += 1;
        state.runtimeMeta.set(item.runtimeId, {
          ordinal: item.ordinal,
          turnId: item.turnId,
          role: item.role,
        });
        state.ordinalToRuntime.set(item.ordinal, item.runtimeId);
        state.turnToRuntime.set(item.turnId, item.runtimeId);
      }
      state.observedOrdinals.add(item.ordinal);
    }
  }

  if (snapshot.scroll?.atTopCandidate && snapshot.accepted) {
    state.topEstablished = true;
  }
  if (snapshot.scroll?.atBottomCandidate && snapshot.accepted) {
    state.bottomEstablished = true;
  }

  const safeSnapshot = createSafeSnapshotSummary({
    snapshotIndex: state.snapshots.length + 1,
    validatedSnapshot: snapshot,
    newRuntimeIdentityCount,
    runLocalUnionRuntimeIdentityCount: state.runtimeMeta.size,
    identityConflictCount: state.identityConflict ? 1 : 0,
  });
  state.snapshots.push(safeSnapshot);

  return {
    accepted: snapshot.accepted && mergeViolations.length === 0,
    newRuntimeIdentityCount,
    runLocalUnionRuntimeIdentityCount: state.runtimeMeta.size,
    violations: mergeViolations,
    safeSnapshot,
  };
}

export function classifyCandidate({
  pageVisibleThroughout,
  topEstablished,
  bottomEstablished,
  observedOrdinals,
  captureRejected,
  identityConflict,
  domOrderConsistent,
  blocked,
  ambiguous = false,
}) {
  if (blocked || !pageVisibleThroughout) {
    return CANDIDATE_STATE.BLOCKED;
  }

  if (ambiguous) {
    return CANDIDATE_STATE.AMBIGUOUS;
  }

  if (captureRejected || identityConflict || !domOrderConsistent) {
    return CANDIDATE_STATE.INCONSISTENT;
  }

  if (!topEstablished || !bottomEstablished) {
    return CANDIDATE_STATE.UNKNOWN;
  }

  const { ordinals, gaps } = findOrdinalGaps(observedOrdinals);
  if (ordinals.length === 0 || ordinals[0] !== 1 || gaps.length > 0) {
    return CANDIDATE_STATE.INCOMPLETE;
  }

  return CANDIDATE_STATE.COMPLETE;
}

export function classifyRunAccumulator(state) {
  return classifyCandidate({
    pageVisibleThroughout: state.pageVisibleThroughout,
    topEstablished: state.topEstablished,
    bottomEstablished: state.bottomEstablished,
    observedOrdinals: state.observedOrdinals,
    captureRejected: state.captureRejected,
    identityConflict: state.identityConflict,
    domOrderConsistent: state.domOrderConsistent,
    blocked: state.blocked,
    ambiguous: state.ambiguous,
  });
}

/**
 * Traversal stop relation. Expected count, union count, no-new-ID count,
 * ordinal max, mounted count, and scroll-height convergence are intentionally
 * absent from the signature and logic.
 */
export function evaluateTraversalTermination({ atBottomCandidate, blocked }) {
  if (blocked) {
    return { stop: true, reason: TERMINATION_REASON.BLOCKED };
  }
  if (atBottomCandidate) {
    return { stop: true, reason: TERMINATION_REASON.BOTTOM_REACHED };
  }
  return { stop: false, reason: null };
}

export function getScrollGeometry(
  scroller,
  bottomTolerancePx = DEFAULT_BOTTOM_TOLERANCE_PX,
) {
  const top = Number(scroller?.scrollTop ?? 0);
  const height = Number(scroller?.scrollHeight ?? 0);
  const clientHeight = Number(scroller?.clientHeight ?? 0);
  const maxTop = Math.max(0, height - clientHeight);
  return {
    top,
    height,
    clientHeight,
    atTopCandidate: top <= bottomTolerancePx,
    atBottomCandidate: top >= maxTop - bottomTolerancePx,
  };
}

export function computeFormalNextScrollTop({ scrollTop, scrollHeight, clientHeight }) {
  const current = Number(scrollTop);
  const height = Number(scrollHeight);
  const viewport = Number(clientHeight);
  if (![current, height, viewport].every(Number.isFinite) || viewport <= 0) {
    return null;
  }
  const maxTop = Math.max(0, height - viewport);
  return Math.min(maxTop, current + viewport * FORMAL_STEP_FRACTION);
}

export function evaluateScrollProgress({ beforeTop, afterTop, atBottomCandidate }) {
  if (atBottomCandidate) return { ok: true, reason: null };
  if (!Number.isFinite(beforeTop) || !Number.isFinite(afterTop)) {
    return { ok: false, reason: "SCROLL_GEOMETRY_INVALID" };
  }
  if (afterTop <= beforeTop) {
    return { ok: false, reason: "NO_SCROLL_PROGRESS_BEFORE_BOTTOM" };
  }
  return { ok: true, reason: null };
}

export function settleSignature(scroller, mountedOrdinals) {
  return JSON.stringify({
    scrollTop: Math.round(Number(scroller.scrollTop)),
    scrollHeight: Number(scroller.scrollHeight),
    clientHeight: Number(scroller.clientHeight),
    mountedOrdinals: [...mountedOrdinals],
  });
}

export async function waitForStableVisibleDOM({
  documentLike = globalThis.document,
  scroller,
  getMountedOrdinals,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  maxSamples = 50,
  intervalMs = 250,
  requiredStableSamples = 3,
} = {}) {
  let previousSignature = null;
  let stableSamples = 0;

  for (let index = 0; index < maxSamples; index += 1) {
    await sleep(intervalMs);

    if (!visibleNow(documentLike)) {
      return {
        settled: false,
        blocked: true,
        reason: "PAGE_BECAME_HIDDEN",
      };
    }

    const signature = settleSignature(scroller, getMountedOrdinals());
    if (signature === previousSignature) {
      stableSamples += 1;
    } else {
      previousSignature = signature;
      stableSamples = 1;
    }

    if (stableSamples >= requiredStableSamples) {
      return { settled: true, blocked: false, reason: null };
    }
  }

  return {
    settled: false,
    blocked: true,
    reason: "DOM_STABILITY_TIMEOUT",
  };
}

export function resolveUniqueScroller(candidates) {
  const distinct = [...new Set(candidates.filter(Boolean))];
  return {
    count: distinct.length,
    element: distinct.length === 1 ? distinct[0] : null,
    blocked:
      distinct.length === 0
        ? true
        : distinct.length !== 1,
    reason:
      distinct.length === 0
        ? "SCROLL_CONTAINER_UNAVAILABLE"
        : distinct.length === 1
          ? null
          : "SCROLL_CONTAINER_AMBIGUOUS",
  };
}

export function findScroller(
  turnSelector = TURN_SELECTOR,
  documentLike = globalThis.document,
) {
  const firstTurn = documentLike?.querySelector?.(turnSelector) ?? null;
  let node = firstTurn?.parentElement ?? null;
  const candidates = [];

  while (node) {
    const style = globalThis.getComputedStyle?.(node);
    const overflowY = style?.overflowY ?? "";
    const scrollable =
      Number(node.scrollHeight) > Number(node.clientHeight) + 1 &&
      ["auto", "scroll", "overlay"].includes(overflowY);
    if (scrollable) candidates.push(node);
    node = node.parentElement;
  }

  return resolveUniqueScroller(candidates);
}

function ordinalRanges(ordinals) {
  const sorted = [...new Set(ordinals)].sort((a, b) => a - b);
  if (sorted.length === 0) return "";
  const ranges = [];
  let start = sorted[0];
  let previous = sorted[0];

  for (let index = 1; index <= sorted.length; index += 1) {
    const current = sorted[index];
    if (current === previous + 1) {
      previous = current;
      continue;
    }
    ranges.push(start === previous ? `${start}` : `${start}-${previous}`);
    start = current;
    previous = current;
  }

  return ranges.join(",");
}

export function createSafeSnapshotSummary({
  snapshotIndex,
  validatedSnapshot,
  newRuntimeIdentityCount,
  runLocalUnionRuntimeIdentityCount,
  identityConflictCount,
}) {
  return {
    snapshot: `S${String(snapshotIndex).padStart(3, "0")}`,
    visibilityState: validatedSnapshot.pageVisible ? "visible" : "blocked",
    mountedMessageCount: validatedSnapshot.items.length,
    mountedOrdinalRanges: ordinalRanges(validatedSnapshot.ordinals),
    newRuntimeIdentityCount,
    runLocalUnionRuntimeIdentityCount,
    identityConflictCount,
    captureAccepted: validatedSnapshot.accepted,
    atTopCandidate: validatedSnapshot.scroll?.atTopCandidate === true,
    atBottomCandidate: validatedSnapshot.scroll?.atBottomCandidate === true,
  };
}

export function summarizeRun(state) {
  const { ordinals, gaps } = findOrdinalGaps(state.observedOrdinals);
  return {
    version: state.version,
    candidate: classifyRunAccumulator(state),
    blocked: state.blocked,
    blockedReason: state.blockedReason,
    pageVisibleThroughout: state.pageVisibleThroughout,
    topEstablished: state.topEstablished,
    bottomEstablished: state.bottomEstablished,
    captureRejected: state.captureRejected,
    identityConflict: state.identityConflict,
    domOrderConsistent: state.domOrderConsistent,
    distinctRuntimeCount: state.runtimeMeta.size,
    distinctOrdinalCount: ordinals.length,
    observedOrdinalMin: ordinals.length ? ordinals[0] : null,
    observedOrdinalMax: ordinals.length ? ordinals.at(-1) : null,
    ordinalGapCount: gaps.length,
    snapshotCount: state.snapshots.length,
    remountDedupCount: state.remountDedupCount,
    snapshots: [...state.snapshots],
  };
}

/**
 * Ground Truth is intentionally a separate, post-classification oracle.
 * It cannot change traversal state or candidate classification.
 */
export function compareWithGroundTruth({ frozenCandidate, runtimeSummary, groundTruth }) {
  const candidateEligible = frozenCandidate === CANDIDATE_STATE.COMPLETE;
  const expected = groundTruth ?? {};
  const summary = runtimeSummary ?? {};

  return {
    candidate: frozenCandidate,
    candidateEligible,
    distinctRuntimeCountMatches:
      candidateEligible &&
      Number.isSafeInteger(expected.expectedDistinctOccurrences) &&
      summary.distinctRuntimeCount === expected.expectedDistinctOccurrences,
    ordinalBoundaryMatches:
      candidateEligible &&
      Number.isSafeInteger(expected.expectedDistinctOccurrences) &&
      summary.observedOrdinalMin === 1 &&
      summary.observedOrdinalMax === expected.expectedDistinctOccurrences,
  };
}

/**
 * Validation-harness helper. Candidate is frozen before the oracle call.
 */
export function evaluateTechnicalSpikeCase({ state, groundTruth }) {
  const runtimeSummary = summarizeRun(state);
  const frozenCandidate = runtimeSummary.candidate;
  const oracle = compareWithGroundTruth({
    frozenCandidate,
    runtimeSummary,
    groundTruth,
  });
  return {
    runtimeSummary,
    oracle,
    casePass:
      frozenCandidate === CANDIDATE_STATE.COMPLETE &&
      oracle.distinctRuntimeCountMatches &&
      oracle.ordinalBoundaryMatches,
  };
}

/**
 * Browser-facing Phase-0 traversal. No expected count is accepted. Termination
 * is Bottom geometry or BLOCKED only. This function intentionally exposes no
 * Production retry/resume/fallback behavior.
 */
export async function runTask003MinimalTraversal({
  documentLike = globalThis.document,
  sleep,
  maxSettleSamples = 50,
  settleIntervalMs = 250,
  requiredStableSamples = 3,
  onSafeSnapshot = null,
} = {}) {
  const state = createRunAccumulator();

  if (!visibleNow(documentLike)) {
    blockRun(state, "PAGE_NOT_VISIBLE_BEFORE_RUN");
    state.pageVisibleThroughout = false;
    return summarizeRun(state);
  }

  const scrollerResult = findScroller(TURN_SELECTOR, documentLike);
  if (scrollerResult.count !== 1 || !scrollerResult.element) {
    blockRun(state, scrollerResult.reason ?? "SCROLL_CONTAINER_UNAVAILABLE");
    return summarizeRun(state);
  }

  const scroller = scrollerResult.element;
  validateScrollerContinuity(state, scroller);

  scroller.scrollTop = 0;
  while (true) {

    if (!visibleNow(documentLike)) {
      state.pageVisibleThroughout = false;
      blockRun(state, "PAGE_BECAME_HIDDEN");
      break;
    }

    const currentScroller = findScroller(TURN_SELECTOR, documentLike);
    if (
      currentScroller.count !== 1 ||
      !validateScrollerContinuity(state, currentScroller.element)
    ) {
      if (!state.blocked) {
        blockRun(state, currentScroller.reason ?? "SCROLL_CONTAINER_CHANGED");
      }
      break;
    }

    const settle = await waitForStableVisibleDOM({
      documentLike,
      scroller,
      getMountedOrdinals: () =>
        [...documentLike.querySelectorAll(TURN_SELECTOR)]
          .map((section) => parseTurnOrdinal(section.getAttribute("data-testid")))
          .filter((ordinal) => ordinal !== null),
      sleep,
      maxSamples: maxSettleSamples,
      intervalMs: settleIntervalMs,
      requiredStableSamples,
    });

    if (!settle.settled) {
      blockRun(state, settle.reason);
      if (settle.reason === "PAGE_BECAME_HIDDEN") {
        state.pageVisibleThroughout = false;
      }
      break;
    }

    if (!visibleNow(documentLike)) {
      state.pageVisibleThroughout = false;
      blockRun(state, "PAGE_BECAME_HIDDEN_AFTER_SETTLE");
      break;
    }

    const raw = extractMountedObservation({ documentLike, scroller });
    const validated = validateMountedObservation(raw);
    const merge = mergeIntoRunAccumulator(state, validated);
    if (typeof onSafeSnapshot === "function") {
      onSafeSnapshot(merge.safeSnapshot);
    }

    const termination = evaluateTraversalTermination({
      atBottomCandidate: raw.scroll?.atBottomCandidate === true,
      blocked: state.blocked,
    });
    if (termination.stop) break;

    if (state.captureRejected || state.identityConflict || !state.domOrderConsistent) {
      state.failed = true;
      break;
    }

    if (!visibleNow(documentLike)) {
      state.pageVisibleThroughout = false;
      blockRun(state, "PAGE_BECAME_HIDDEN_BEFORE_SCROLL");
      break;
    }

    const before = getScrollGeometry(scroller);
    const nextTop = computeFormalNextScrollTop({
      scrollTop: before.top,
      scrollHeight: before.height,
      clientHeight: before.clientHeight,
    });
    if (nextTop === null) {
      blockRun(state, "SCROLL_GEOMETRY_INVALID");
      break;
    }

    scroller.scrollTop = nextTop;
    const afterTop = Number(scroller.scrollTop);
    const progress = evaluateScrollProgress({
      beforeTop: before.top,
      afterTop,
      atBottomCandidate: getScrollGeometry(scroller).atBottomCandidate,
    });
    if (!progress.ok) {
      blockRun(state, progress.reason);
      break;
    }
  }

  return summarizeRun(state);
}
