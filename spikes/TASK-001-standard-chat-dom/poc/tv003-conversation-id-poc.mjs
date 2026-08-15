/**
 * TASK-001 / TV-003 Standard Coverage Conversation ID Minimal PoC.
 *
 * Phase 0 only. This validates Candidate Decision v1 using one browser/page
 * snapshot. It is not a Production parser, validator, selector abstraction,
 * fallback chain, or settled-state algorithm.
 */

export const POC_VERSION = "tv003-conversation-id-minimal-poc-v1";

export const CONVERSATION_ID_STATE = Object.freeze({
  RESOLVED_CURRENT: "RESOLVED_CURRENT",
  UNSUPPORTED_ROUTE: "UNSUPPORTED_ROUTE",
  UNRESOLVED: "UNRESOLVED",
  AMBIGUOUS: "AMBIGUOUS",
  INCONSISTENT: "INCONSISTENT",
});

const OBSERVED_ROUTE_LITERAL = "c";
const OBSERVED_ID_LENGTH = 36;
const OBSERVED_HYPHEN_POSITIONS = new Set([8, 13, 18, 23]);

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

/**
 * Candidate Decision's Phase 0-only format predicate.
 * It intentionally performs no trim, case normalization, repair, UUID
 * version check, or UUID variant check.
 */
export function isObservedConversationIdFormatV1(value) {
  if (typeof value !== "string" || value.length !== OBSERVED_ID_LENGTH) {
    return false;
  }

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (OBSERVED_HYPHEN_POSITIONS.has(index)) {
      if (character !== "-") {
        return false;
      }
      continue;
    }

    const isLowerHex =
      (character >= "0" && character <= "9") ||
      (character >= "a" && character <= "f");
    if (!isLowerHex) {
      return false;
    }
  }

  return true;
}

/**
 * Pure parser for Observed Standard Conversation Route Shape v1.
 * Query and fragment values are never ID sources. Extra pathname segments
 * are retained as ambiguity diagnostics and are never silently ignored.
 */
export function parseObservedStandardConversationRouteV1(rawUrl) {
  if (!isNonEmptyString(rawUrl)) {
    return {
      present: false,
      parseable: false,
      routeLiteralMatches: false,
      supportedRoute: false,
      segmentCount: null,
      idCandidateCount: 0,
      id: null,
      idPresent: false,
      idLength: null,
      idFormatValid: false,
      origin: null,
      pathname: null,
    };
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return {
      present: true,
      parseable: false,
      routeLiteralMatches: false,
      supportedRoute: false,
      segmentCount: null,
      idCandidateCount: 0,
      id: null,
      idPresent: false,
      idLength: null,
      idFormatValid: false,
      origin: null,
      pathname: null,
    };
  }

  const segments = parsedUrl.pathname.split("/").filter(Boolean);
  const routeLiteralMatches = segments[0] === OBSERVED_ROUTE_LITERAL;
  const idCandidateCount = routeLiteralMatches
    ? Math.max(segments.length - 1, 0)
    : 0;
  const supportedRoute = routeLiteralMatches && segments.length === 2;
  const id = supportedRoute ? segments[1] : null;

  return {
    present: true,
    parseable: true,
    routeLiteralMatches,
    supportedRoute,
    segmentCount: segments.length,
    idCandidateCount,
    id,
    idPresent: isNonEmptyString(id),
    idLength: typeof id === "string" ? id.length : null,
    idFormatValid: isObservedConversationIdFormatV1(id),
    origin: parsedUrl.origin,
    pathname: parsedUrl.pathname,
  };
}

/**
 * Browser-page capture only. The current browser tab URL is intentionally not
 * read here; the host/browser harness must provide it independently.
 *
 * Raw runtime values returned here must stay in memory and must not be logged
 * or persisted. Call summarizeConversationIdResult for Evidence-safe output.
 */
export function captureConversationIdPageSnapshot() {
  const pageLocationHref = location.href;
  const pageLocationPathname = location.pathname;
  const pageDocumentUrl = document.URL;

  let currentLocationUrl = null;
  try {
    currentLocationUrl = new URL(pageLocationHref);
  } catch {
    currentLocationUrl = null;
  }

  const sameRouteAnchors = Array.from(
    document.querySelectorAll("a[href]"),
  ).filter((anchor) => {
    if (currentLocationUrl === null) {
      return false;
    }
    try {
      const anchorUrl = new URL(anchor.href, pageLocationHref);
      return (
        anchorUrl.origin === currentLocationUrl.origin &&
        anchorUrl.pathname === currentLocationUrl.pathname
      );
    } catch {
      return false;
    }
  });

  const activeAnchors = sameRouteAnchors.filter((anchor) =>
    anchor.hasAttribute("data-active"),
  );
  const selectedActiveAnchor =
    activeAnchors.length === 1 ? activeAnchors[0] : null;
  const nestedIdValues =
    selectedActiveAnchor === null
      ? []
      : Array.from(
          selectedActiveAnchor.querySelectorAll(
            "[data-conversation-options-trigger]",
          ),
          (element) =>
            element.getAttribute("data-conversation-options-trigger"),
        );

  const canonicalHrefs = Array.from(
    document.head.querySelectorAll('link[rel="canonical"]'),
    (element) => element.href,
  );

  return {
    pageLocationHref,
    pageLocationPathname,
    pageDocumentUrl,
    sameRouteAnchorCount: sameRouteAnchors.length,
    activeAnchorCount: activeAnchors.length,
    activeAnchorHref:
      selectedActiveAnchor === null ? null : selectedActiveAnchor.href,
    activeNestedIdValues: nestedIdValues,
    canonicalHrefs,
  };
}

function addViolation(violations, code) {
  if (!violations.includes(code)) {
    violations.push(code);
  }
}

/**
 * Pure runtime currentness evaluator. Ground Truth is deliberately absent.
 */
export function evaluateConversationIdSnapshot(browserTabUrl, pageSnapshot) {
  const snapshot = pageSnapshot ?? {};
  const violations = [];

  const primary = parseObservedStandardConversationRouteV1(browserTabUrl);
  const pageLocation = parseObservedStandardConversationRouteV1(
    snapshot.pageLocationHref,
  );
  const pageDocument = parseObservedStandardConversationRouteV1(
    snapshot.pageDocumentUrl,
  );

  if (!primary.present) {
    addViolation(violations, "BROWSER_TAB_URL_MISSING");
  } else if (!primary.parseable) {
    addViolation(violations, "BROWSER_TAB_URL_MALFORMED");
  } else if (!primary.routeLiteralMatches) {
    addViolation(violations, "BROWSER_TAB_ROUTE_UNSUPPORTED");
  } else if (primary.idCandidateCount === 0) {
    addViolation(violations, "PRIMARY_ID_MISSING");
  } else if (primary.idCandidateCount > 1) {
    addViolation(violations, "PRIMARY_ID_AMBIGUOUS");
  } else if (!primary.supportedRoute) {
    addViolation(violations, "BROWSER_TAB_ROUTE_UNSUPPORTED");
  } else if (!primary.idFormatValid) {
    addViolation(violations, "PRIMARY_ID_FORMAT_INVALID");
  }

  if (!pageLocation.present) {
    addViolation(violations, "PAGE_LOCATION_URL_MISSING");
  } else if (!pageLocation.parseable) {
    addViolation(violations, "PAGE_LOCATION_URL_MALFORMED");
  } else if (!pageLocation.supportedRoute) {
    addViolation(violations, "PAGE_LOCATION_ROUTE_UNSUPPORTED");
  } else if (!pageLocation.idFormatValid) {
    addViolation(violations, "PAGE_LOCATION_ID_FORMAT_INVALID");
  }

  if (!pageDocument.present) {
    addViolation(violations, "DOCUMENT_URL_MISSING");
  } else if (!pageDocument.parseable) {
    addViolation(violations, "DOCUMENT_URL_MALFORMED");
  } else if (!pageDocument.supportedRoute) {
    addViolation(violations, "DOCUMENT_ROUTE_UNSUPPORTED");
  } else if (!pageDocument.idFormatValid) {
    addViolation(violations, "DOCUMENT_ID_FORMAT_INVALID");
  }

  const browserLocationExact =
    isNonEmptyString(browserTabUrl) &&
    isNonEmptyString(snapshot.pageLocationHref) &&
    browserTabUrl === snapshot.pageLocationHref;
  const browserDocumentExact =
    isNonEmptyString(browserTabUrl) &&
    isNonEmptyString(snapshot.pageDocumentUrl) &&
    browserTabUrl === snapshot.pageDocumentUrl;
  const locationPathnameExact =
    pageLocation.parseable &&
    typeof snapshot.pageLocationPathname === "string" &&
    snapshot.pageLocationPathname === pageLocation.pathname;
  const pageIdsMatchPrimary =
    primary.idPresent &&
    pageLocation.idPresent &&
    pageDocument.idPresent &&
    primary.id === pageLocation.id &&
    primary.id === pageDocument.id;

  if (primary.present && pageLocation.present && !browserLocationExact) {
    addViolation(violations, "BROWSER_LOCATION_URL_MISMATCH");
  }
  if (primary.present && pageDocument.present && !browserDocumentExact) {
    addViolation(violations, "BROWSER_DOCUMENT_URL_MISMATCH");
  }
  if (pageLocation.parseable && !locationPathnameExact) {
    addViolation(violations, "LOCATION_PATHNAME_MISMATCH");
  }
  if (
    primary.idPresent &&
    pageLocation.idPresent &&
    pageDocument.idPresent &&
    !pageIdsMatchPrimary
  ) {
    addViolation(violations, "PAGE_PRIMARY_ID_MISMATCH");
  }

  const activeAnchorCount = Number(snapshot.activeAnchorCount ?? 0);
  const active = parseObservedStandardConversationRouteV1(
    activeAnchorCount === 1 ? snapshot.activeAnchorHref : null,
  );
  const nestedValues = Array.isArray(snapshot.activeNestedIdValues)
    ? snapshot.activeNestedIdValues
    : [];
  const nestedId = nestedValues.length === 1 ? nestedValues[0] : null;
  const nestedIdPresent = isNonEmptyString(nestedId);
  const nestedIdFormatValid = isObservedConversationIdFormatV1(nestedId);
  const activeCurrentRouteBound =
    primary.parseable &&
    active.parseable &&
    primary.origin === active.origin &&
    primary.pathname === active.pathname;
  const activeInternalEquality =
    active.idPresent && nestedIdPresent && active.id === nestedId;
  const activePrimaryEquality =
    primary.idPresent && active.idPresent && primary.id === active.id;

  if (activeAnchorCount === 0) {
    addViolation(violations, "ACTIVE_ANCHOR_MISSING");
  } else if (activeAnchorCount > 1) {
    addViolation(violations, "ACTIVE_ANCHOR_AMBIGUOUS");
  } else {
    if (!active.parseable) {
      addViolation(violations, "ACTIVE_ANCHOR_URL_MALFORMED");
    } else if (!active.supportedRoute) {
      addViolation(violations, "ACTIVE_ANCHOR_ROUTE_UNSUPPORTED");
    } else if (!active.idPresent) {
      addViolation(violations, "ACTIVE_ANCHOR_ID_MISSING");
    } else if (!active.idFormatValid) {
      addViolation(violations, "ACTIVE_ANCHOR_ID_FORMAT_INVALID");
    }
    if (!activeCurrentRouteBound) {
      addViolation(violations, "ACTIVE_ROUTE_BINDING_MISMATCH");
    }
  }

  if (nestedValues.length === 0) {
    addViolation(violations, "NESTED_ID_MISSING");
  } else if (nestedValues.length > 1) {
    addViolation(violations, "NESTED_ID_AMBIGUOUS");
  } else if (!nestedIdPresent) {
    addViolation(violations, "NESTED_ID_EMPTY");
  } else if (!nestedIdFormatValid) {
    addViolation(violations, "NESTED_ID_FORMAT_INVALID");
  }

  if (
    active.idPresent &&
    nestedIdPresent &&
    !activeInternalEquality
  ) {
    addViolation(violations, "ACTIVE_INTERNAL_ID_MISMATCH");
  }
  if (
    primary.idPresent &&
    active.idPresent &&
    !activePrimaryEquality
  ) {
    addViolation(violations, "ACTIVE_PRIMARY_ID_MISMATCH");
  }

  const canonicalHrefs = Array.isArray(snapshot.canonicalHrefs)
    ? snapshot.canonicalHrefs
    : [];
  const canonical = parseObservedStandardConversationRouteV1(
    canonicalHrefs.length === 1 ? canonicalHrefs[0] : null,
  );
  const canonicalPrimaryEquality =
    canonical.idPresent &&
    primary.idPresent &&
    canonical.id === primary.id;
  const canonicalActiveEquality =
    canonical.idPresent && active.idPresent && canonical.id === active.id;

  if (canonicalHrefs.length === 0) {
    addViolation(violations, "CANONICAL_MISSING");
  } else if (canonicalHrefs.length > 1) {
    addViolation(violations, "CANONICAL_AMBIGUOUS");
  } else if (!canonical.parseable) {
    addViolation(violations, "CANONICAL_URL_MALFORMED");
  } else if (!canonical.supportedRoute) {
    addViolation(violations, "CANONICAL_ROUTE_UNSUPPORTED");
  } else if (!canonical.idPresent) {
    addViolation(violations, "CANONICAL_ID_MISSING");
  } else if (!canonical.idFormatValid) {
    addViolation(violations, "CANONICAL_ID_FORMAT_INVALID");
  }

  if (
    canonical.idPresent &&
    primary.idPresent &&
    !canonicalPrimaryEquality
  ) {
    addViolation(violations, "CANONICAL_PRIMARY_ID_MISMATCH");
  }
  if (
    canonical.idPresent &&
    active.idPresent &&
    !canonicalActiveEquality
  ) {
    addViolation(violations, "CANONICAL_ACTIVE_ID_MISMATCH");
  }

  const checks = {
    primaryPresent: primary.present,
    primaryParseable: primary.parseable,
    primarySupportedRoute: primary.supportedRoute,
    primaryIdPresent: primary.idPresent,
    primaryIdFormatValid: primary.idFormatValid,
    browserLocationExact,
    browserDocumentExact,
    locationPathnameExact,
    pageIdsMatchPrimary,
    activeAnchorCardinality: activeAnchorCount === 1,
    activeCurrentRouteBound,
    activeSupportedRoute: active.supportedRoute,
    activeIdFormatValid: active.idFormatValid,
    nestedIdCardinality: nestedValues.length === 1,
    nestedIdPresent,
    nestedIdFormatValid,
    activeInternalEquality,
    activePrimaryEquality,
    canonicalCardinality: canonicalHrefs.length === 1,
    canonicalSupportedRoute: canonical.supportedRoute,
    canonicalIdFormatValid: canonical.idFormatValid,
    canonicalPrimaryEquality,
    canonicalActiveEquality,
  };

  const primaryUnsupported =
    primary.parseable && !primary.routeLiteralMatches;
  const ambiguous =
    (primary.routeLiteralMatches && primary.idCandidateCount > 1) ||
    activeAnchorCount > 1 ||
    nestedValues.length > 1 ||
    canonicalHrefs.length > 1;
  const unresolved =
    !primary.present ||
    !primary.parseable ||
    (primary.routeLiteralMatches && primary.idCandidateCount === 0) ||
    !pageLocation.present ||
    !pageLocation.parseable ||
    !pageDocument.present ||
    !pageDocument.parseable ||
    activeAnchorCount === 0 ||
    nestedValues.length === 0 ||
    !nestedIdPresent ||
    canonicalHrefs.length === 0;

  let state = CONVERSATION_ID_STATE.RESOLVED_CURRENT;
  if (primaryUnsupported) {
    state = CONVERSATION_ID_STATE.UNSUPPORTED_ROUTE;
  } else if (ambiguous) {
    state = CONVERSATION_ID_STATE.AMBIGUOUS;
  } else if (unresolved) {
    state = CONVERSATION_ID_STATE.UNRESOLVED;
  } else if (violations.length > 0) {
    state = CONVERSATION_ID_STATE.INCONSISTENT;
  }

  const accepted = state === CONVERSATION_ID_STATE.RESOLVED_CURRENT;
  return {
    state,
    accepted,
    failClosed: !accepted,
    resolvedId: accepted ? primary.id : null,
    violations,
    checks,
    diagnostics: {
      primary,
      pageLocation,
      pageDocument,
      active,
      activeAnchorCount,
      nestedIdCount: nestedValues.length,
      nestedIdLength: typeof nestedId === "string" ? nestedId.length : null,
      canonical,
      canonicalCount: canonicalHrefs.length,
      sameRouteAnchorCount: Number(snapshot.sameRouteAnchorCount ?? 0),
    },
  };
}

/**
 * Independent Ground Truth comparison. Output is Evidence-safe.
 */
export function compareConversationIdGroundTruth(resolvedId, expectedId) {
  if (!isNonEmptyString(expectedId) || !isObservedConversationIdFormatV1(expectedId)) {
    const error = new Error(
      "Expected Conversation ID must satisfy Observed Format v1",
    );
    error.code = "GROUND_TRUTH_INPUT_ERROR";
    throw error;
  }

  return {
    expectedLength: expectedId.length,
    resolvedLength: typeof resolvedId === "string" ? resolvedId.length : null,
    exactMatch: typeof resolvedId === "string" && resolvedId === expectedId,
  };
}

/**
 * Remove every raw URL, pathname, and ID from a runtime result.
 */
export function summarizeConversationIdResult(
  browserTabUrl,
  pageSnapshot,
  evaluation,
  groundTruthComparison = null,
) {
  const snapshot = pageSnapshot ?? {};
  const primary = evaluation.diagnostics.primary;
  const pageLocation = evaluation.diagnostics.pageLocation;
  const pageDocument = evaluation.diagnostics.pageDocument;
  const active = evaluation.diagnostics.active;
  const canonical = evaluation.diagnostics.canonical;

  return {
    revision: POC_VERSION,
    state: evaluation.state,
    accepted: evaluation.accepted,
    failClosed: evaluation.failClosed,
    violationCodes: [...evaluation.violations],
    currentDocumentRoute: {
      browserTabUrlPresent: isNonEmptyString(browserTabUrl),
      browserTabUrlParseable: primary.parseable,
      supportedRoute: primary.supportedRoute,
      segmentCount: primary.segmentCount,
      idCandidateCount: primary.idCandidateCount,
      idPresent: primary.idPresent,
      idLength: primary.idLength,
      idFormatValid: primary.idFormatValid,
      pageLocationUrlPresent: pageLocation.present,
      pageLocationUrlParseable: pageLocation.parseable,
      documentUrlPresent: pageDocument.present,
      documentUrlParseable: pageDocument.parseable,
      browserLocationExact: evaluation.checks.browserLocationExact,
      browserDocumentExact: evaluation.checks.browserDocumentExact,
      locationPathnameExact: evaluation.checks.locationPathnameExact,
      pageIdsMatchPrimary: evaluation.checks.pageIdsMatchPrimary,
    },
    activeConversationItem: {
      sameRouteAnchorCount: Number(snapshot.sameRouteAnchorCount ?? 0),
      activeAnchorCount: evaluation.diagnostics.activeAnchorCount,
      currentRouteBound: evaluation.checks.activeCurrentRouteBound,
      supportedRoute: active.supportedRoute,
      anchorIdPresent: active.idPresent,
      anchorIdLength: active.idLength,
      anchorIdFormatValid: active.idFormatValid,
      nestedIdCount: evaluation.diagnostics.nestedIdCount,
      nestedIdLength: evaluation.diagnostics.nestedIdLength,
      nestedIdFormatValid: evaluation.checks.nestedIdFormatValid,
      internalEquality: evaluation.checks.activeInternalEquality,
      primaryEquality: evaluation.checks.activePrimaryEquality,
    },
    canonical: {
      count: evaluation.diagnostics.canonicalCount,
      supportedRoute: canonical.supportedRoute,
      idPresent: canonical.idPresent,
      idLength: canonical.idLength,
      idFormatValid: canonical.idFormatValid,
      primaryEquality: evaluation.checks.canonicalPrimaryEquality,
      activeEquality: evaluation.checks.canonicalActiveEquality,
    },
    resolvedIdLength:
      typeof evaluation.resolvedId === "string"
        ? evaluation.resolvedId.length
        : null,
    groundTruth:
      groundTruthComparison === null
        ? null
        : { ...groundTruthComparison },
  };
}

/**
 * Technical Spike case PASS requires both runtime currentness and independent
 * Ground Truth exact equality.
 */
export function evaluateTechnicalSpikeCase(
  browserTabUrl,
  pageSnapshot,
  expectedId,
) {
  const evaluation = evaluateConversationIdSnapshot(
    browserTabUrl,
    pageSnapshot,
  );
  const groundTruth = compareConversationIdGroundTruth(
    evaluation.resolvedId,
    expectedId,
  );
  const casePass = evaluation.accepted && groundTruth.exactMatch;

  return {
    casePass,
    runtimeCurrentnessResolved: evaluation.accepted,
    groundTruthExact: groundTruth.exactMatch,
    evaluation,
    groundTruth,
    summary: summarizeConversationIdResult(
      browserTabUrl,
      pageSnapshot,
      evaluation,
      groundTruth,
    ),
  };
}
