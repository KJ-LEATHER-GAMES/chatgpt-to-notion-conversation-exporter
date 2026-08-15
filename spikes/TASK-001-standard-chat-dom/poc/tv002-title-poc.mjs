/**
 * TASK-001 / TV-002 Standard Chat Title Minimal PoC.
 *
 * Prototype question:
 * Can Candidate Decision v1 resolve a current, complete Standard Chat title
 * from two independent DOM source groups while failing closed on ambiguous,
 * missing, or inconsistent snapshots?
 *
 * This is Phase 0 throwaway validation code, not a Production Source Adapter.
 * It intentionally implements one snapshot only: no polling, retry, timeout,
 * fixed sleep, fallback, suffix stripping, or Conversation ID extraction.
 */

export const POC_VERSION = "tv002-title-minimal-poc-v1";

export const TITLE_STATE = Object.freeze({
  RESOLVED_CURRENT: "RESOLVED_CURRENT",
  UNRESOLVED: "UNRESOLVED",
  AMBIGUOUS: "AMBIGUOUS",
  INCONSISTENT: "INCONSISTENT",
});

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/**
 * Read one browser snapshot using only the route-binding relationship observed
 * during TV-002 Discovery. Raw strings remain runtime-only and must not be
 * logged or persisted by the caller.
 */
export function captureTitleSnapshot() {
  const headTitleTexts = Array.from(
    document.head.querySelectorAll(":scope > title"),
    (element) => element.textContent,
  );

  const currentRouteAnchors = Array.from(
    document.querySelectorAll("a[href]"),
  ).filter((anchor) => {
    try {
      return new URL(anchor.href, location.href).pathname === location.pathname;
    } catch {
      return false;
    }
  });

  const activeSidebarItems = currentRouteAnchors.filter((anchor) =>
    anchor.hasAttribute("data-active"),
  );
  const activeSidebarItem =
    activeSidebarItems.length === 1 ? activeSidebarItems[0] : null;

  let currentRouteBound = false;
  if (activeSidebarItem !== null) {
    try {
      currentRouteBound =
        new URL(activeSidebarItem.href, location.href).pathname ===
        location.pathname;
    } catch {
      currentRouteBound = false;
    }
  }

  return {
    activeSidebarCount: activeSidebarItems.length,
    currentRouteBound,
    sidebarText:
      activeSidebarItem === null ? null : activeSidebarItem.textContent,
    sidebarAriaLabel:
      activeSidebarItem === null
        ? null
        : activeSidebarItem.getAttribute("aria-label"),
    headTitleTexts,
    documentTitle: document.title,
    routeMatchingAnchorCount: currentRouteAnchors.length,
    visualOnlyClipping: false,
    domValueKnownTruncated: false,
  };
}

/**
 * Pure implementation of Candidate Decision v1's accept predicate.
 */
export function evaluateTitleSnapshot(snapshot) {
  const activeSidebarCount = Number(snapshot?.activeSidebarCount ?? 0);
  const headTitleTexts = Array.isArray(snapshot?.headTitleTexts)
    ? snapshot.headTitleTexts
    : [];
  const sidebarText = snapshot?.sidebarText ?? null;
  const sidebarAriaLabel = snapshot?.sidebarAriaLabel ?? null;
  const documentTitle = snapshot?.documentTitle ?? null;

  const checks = {
    activeSidebarCardinality: activeSidebarCount === 1,
    currentRouteBound: snapshot?.currentRouteBound === true,
    sidebarTextPresent: isNonEmptyString(sidebarText),
    sidebarAriaLabelPresent: isNonEmptyString(sidebarAriaLabel),
    sidebarInternalEquality:
      isNonEmptyString(sidebarText) &&
      isNonEmptyString(sidebarAriaLabel) &&
      sidebarText === sidebarAriaLabel,
    headTitleCardinality: headTitleTexts.length === 1,
    documentTitlePresent: isNonEmptyString(documentTitle),
    documentInternalEquality:
      headTitleTexts.length === 1 &&
      isNonEmptyString(documentTitle) &&
      documentTitle === headTitleTexts[0],
    crossSourceEquality:
      isNonEmptyString(sidebarText) &&
      isNonEmptyString(documentTitle) &&
      sidebarText === documentTitle,
    domValueNotKnownTruncated: snapshot?.domValueKnownTruncated !== true,
  };

  const violations = [];
  if (!checks.activeSidebarCardinality) {
    violations.push("ACTIVE_SIDEBAR_CARDINALITY");
  }
  if (!checks.currentRouteBound) {
    violations.push("CURRENT_ROUTE_BINDING_NOT_CONFIRMED");
  }
  if (!checks.sidebarTextPresent) {
    violations.push("SIDEBAR_TEXT_EMPTY");
  }
  if (!checks.sidebarAriaLabelPresent) {
    violations.push("SIDEBAR_ARIA_LABEL_EMPTY");
  }
  if (
    checks.sidebarTextPresent &&
    checks.sidebarAriaLabelPresent &&
    !checks.sidebarInternalEquality
  ) {
    violations.push("SIDEBAR_INTERNAL_MISMATCH");
  }
  if (!checks.headTitleCardinality) {
    violations.push("HEAD_TITLE_CARDINALITY");
  }
  if (!checks.documentTitlePresent) {
    violations.push("DOCUMENT_TITLE_EMPTY");
  }
  if (
    checks.headTitleCardinality &&
    checks.documentTitlePresent &&
    !checks.documentInternalEquality
  ) {
    violations.push("DOCUMENT_INTERNAL_MISMATCH");
  }
  if (
    checks.sidebarTextPresent &&
    checks.documentTitlePresent &&
    !checks.crossSourceEquality
  ) {
    violations.push("CROSS_SOURCE_MISMATCH");
  }
  if (!checks.domValueNotKnownTruncated) {
    violations.push("DOM_VALUE_TRUNCATED");
  }

  let state = TITLE_STATE.RESOLVED_CURRENT;
  if (activeSidebarCount > 1 || headTitleTexts.length > 1) {
    state = TITLE_STATE.AMBIGUOUS;
  } else if (
    !checks.activeSidebarCardinality ||
    !checks.currentRouteBound ||
    !checks.sidebarTextPresent ||
    !checks.sidebarAriaLabelPresent ||
    !checks.headTitleCardinality ||
    !checks.documentTitlePresent ||
    !checks.domValueNotKnownTruncated
  ) {
    state = TITLE_STATE.UNRESOLVED;
  } else if (
    !checks.sidebarInternalEquality ||
    !checks.documentInternalEquality ||
    !checks.crossSourceEquality
  ) {
    state = TITLE_STATE.INCONSISTENT;
  }

  const accepted = state === TITLE_STATE.RESOLVED_CURRENT;
  return {
    state,
    accepted,
    failClosed: !accepted,
    resolvedValue: accepted ? sidebarText : null,
    checks,
    violations,
  };
}

/**
 * Runtime Ground Truth comparison. The returned object is Evidence-safe.
 */
export function compareTitleGroundTruth(resolvedValue, expectedTitle) {
  if (!isNonEmptyString(expectedTitle)) {
    const error = new Error("Expected Title must be a non-empty string");
    error.code = "GROUND_TRUTH_INPUT_ERROR";
    throw error;
  }

  return {
    expectedLength: expectedTitle.length,
    resolvedLength:
      typeof resolvedValue === "string" ? resolvedValue.length : null,
    exactMatch:
      typeof resolvedValue === "string" && resolvedValue === expectedTitle,
  };
}

/**
 * Convert runtime-only raw values into an Evidence-safe result.
 */
export function summarizeTitleResult(
  snapshot,
  evaluation,
  groundTruthComparison = null,
) {
  const headTitleTexts = Array.isArray(snapshot?.headTitleTexts)
    ? snapshot.headTitleTexts
    : [];

  return {
    revision: POC_VERSION,
    state: evaluation.state,
    accepted: evaluation.accepted,
    failClosed: evaluation.failClosed,
    violationCodes: [...evaluation.violations],
    activeSidebarCandidateCount: Number(snapshot?.activeSidebarCount ?? 0),
    routeMatchingAnchorCount: Number(
      snapshot?.routeMatchingAnchorCount ?? 0,
    ),
    currentRouteBound: snapshot?.currentRouteBound === true,
    sidebarTextPresent: isNonEmptyString(snapshot?.sidebarText),
    sidebarTextLength:
      typeof snapshot?.sidebarText === "string"
        ? snapshot.sidebarText.length
        : null,
    sidebarAriaLabelPresent: isNonEmptyString(snapshot?.sidebarAriaLabel),
    sidebarAriaLabelLength:
      typeof snapshot?.sidebarAriaLabel === "string"
        ? snapshot.sidebarAriaLabel.length
        : null,
    sidebarInternalEquality: evaluation.checks.sidebarInternalEquality,
    headTitleCount: headTitleTexts.length,
    headTitleLengths: headTitleTexts.map((value) =>
      typeof value === "string" ? value.length : null,
    ),
    documentTitlePresent: isNonEmptyString(snapshot?.documentTitle),
    documentTitleLength:
      typeof snapshot?.documentTitle === "string"
        ? snapshot.documentTitle.length
        : null,
    documentInternalEquality: evaluation.checks.documentInternalEquality,
    crossSourceEquality: evaluation.checks.crossSourceEquality,
    visualOnlyClipping: snapshot?.visualOnlyClipping === true,
    domValueKnownTruncated: snapshot?.domValueKnownTruncated === true,
    groundTruth:
      groundTruthComparison === null
        ? null
        : { ...groundTruthComparison },
  };
}

/**
 * Technical Spike case PASS requires both runtime currentness and an
 * independent Runtime Ground Truth match.
 */
export function evaluateTechnicalSpikeCase(snapshot, expectedTitle) {
  const evaluation = evaluateTitleSnapshot(snapshot);
  const groundTruth = compareTitleGroundTruth(
    evaluation.resolvedValue,
    expectedTitle,
  );
  return {
    casePass: evaluation.accepted && groundTruth.exactMatch,
    runtimeCurrentnessResolved: evaluation.accepted,
    groundTruthExact: groundTruth.exactMatch,
    summary: summarizeTitleResult(snapshot, evaluation, groundTruth),
  };
}
