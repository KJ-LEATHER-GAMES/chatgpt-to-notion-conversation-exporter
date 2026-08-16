/**
 * TASK-002 Project Chat DOM Minimal PoC.
 *
 * Phase 0 validation only. This implements the approved Candidate Decision as
 * a one-snapshot capture/evaluation contract. It is not a Production adapter,
 * selector abstraction, fallback chain, or settled-state algorithm.
 */

export const POC_VERSION = "task002-project-chat-minimal-poc-v1";

export const PROJECT_STATE = Object.freeze({
  RESOLVED_CURRENT: "RESOLVED_CURRENT",
  UNSUPPORTED_ROUTE: "UNSUPPORTED_ROUTE",
  UNRESOLVED: "UNRESOLVED",
  AMBIGUOUS: "AMBIGUOUS",
  INCONSISTENT: "INCONSISTENT",
});

function isNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function addViolation(violations, code) {
  if (!violations.includes(code)) {
    violations.push(code);
  }
}

function emptyRouteResult(present, parseable) {
  return {
    present,
    parseable,
    supportedRoute: false,
    segmentCount: null,
    segmentLengths: [],
    cidCandidateCount: 0,
    cidCandidatePosition: null,
    cid: null,
    cidPresent: false,
    cidLength: null,
    queryPresent: false,
    fragmentPresent: false,
    origin: null,
    pathname: null,
    search: null,
    hash: null,
    href: null,
  };
}

/**
 * Pure Phase 0 parser for Observed Project Conversation Route Shape v1.
 *
 * No Standard route literal, UUID rule, character format, fixed length,
 * normalization, trim, or repair is applied.
 */
export function parseObservedProjectConversationRouteV1(rawUrl) {
  if (!isNonEmptyString(rawUrl)) {
    return emptyRouteResult(false, false);
  }

  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return emptyRouteResult(true, false);
  }

  const segments = parsed.pathname.split("/").filter(Boolean);
  const queryPresent = parsed.search.length > 0;
  const fragmentPresent = parsed.hash.length > 0;
  const supportedRoute =
    segments.length === 4 && !queryPresent && !fragmentPresent;
  const cid = supportedRoute ? segments[3] : null;

  return {
    present: true,
    parseable: true,
    supportedRoute: supportedRoute && isNonEmptyString(cid),
    segmentCount: segments.length,
    segmentLengths: segments.map((segment) => segment.length),
    cidCandidateCount: supportedRoute && isNonEmptyString(cid) ? 1 : 0,
    cidCandidatePosition: supportedRoute && isNonEmptyString(cid) ? 3 : null,
    cid,
    cidPresent: isNonEmptyString(cid),
    cidLength: typeof cid === "string" ? cid.length : null,
    queryPresent,
    fragmentPresent,
    origin: parsed.origin,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
    href: parsed.href,
  };
}

function sameRouteComponents(leftRaw, rightRaw) {
  if (!isNonEmptyString(leftRaw) || !isNonEmptyString(rightRaw)) {
    return false;
  }
  try {
    const left = new URL(leftRaw);
    const right = new URL(rightRaw);
    return (
      left.origin === right.origin &&
      left.pathname === right.pathname &&
      left.search === right.search &&
      left.hash === right.hash
    );
  } catch {
    return false;
  }
}

/**
 * Capture one page snapshot. Browser-host URL is intentionally absent and
 * must be supplied independently by the Chrome host harness.
 *
 * Raw values in the returned object are Runtime-only. Never log or persist
 * this object; pass it through the pure evaluators and Evidence-safe summary.
 */
export function captureProjectPageSnapshot() {
  const valueOf = (element) => {
    if (typeof element?.innerText === "string") {
      return element.innerText;
    }
    return typeof element?.textContent === "string"
      ? element.textContent
      : null;
  };

  const isDirectHref = (anchor) => {
    const rawHref = anchor?.getAttribute?.("href");
    return (
      typeof rawHref === "string" &&
      rawHref.length > 0 &&
      !rawHref.startsWith("#")
    );
  };

  const sameRoute = (leftRaw, rightRaw) => {
    try {
      const left = new URL(leftRaw);
      const right = new URL(rightRaw);
      return (
        left.origin === right.origin &&
        left.pathname === right.pathname &&
        left.search === right.search &&
        left.hash === right.hash
      );
    } catch {
      return false;
    }
  };

  const pageLocationHref = location.href;
  const pageLocationPathname = location.pathname;
  const pageDocumentUrl = document.URL;

  const headerLinkCandidates = Array.from(
    document.querySelectorAll("header a[href]"),
  ).filter((anchor) => isDirectHref(anchor) && valueOf(anchor)?.length > 0);

  const headerGroupEntries = [];
  for (const anchor of headerLinkCandidates) {
    const linkText = valueOf(anchor);
    const matchingDivAncestors = [];
    let current = anchor.parentElement;
    while (current !== null && current.closest("header") !== null) {
      if (
        current.tagName.toLowerCase() === "div" &&
        valueOf(current) === linkText
      ) {
        matchingDivAncestors.push(current);
      }
      if (current.tagName.toLowerCase() === "header") {
        break;
      }
      current = current.parentElement;
    }

    const root = matchingDivAncestors.at(-1) ?? null;
    if (root === null) {
      continue;
    }

    const existing = headerGroupEntries.find((entry) => entry.root === root);
    if (existing === undefined) {
      headerGroupEntries.push({ root, links: [anchor] });
    } else if (!existing.links.includes(anchor)) {
      existing.links.push(anchor);
    }
  }

  const headerGroups = headerGroupEntries.map(({ root, links }) => ({
    name: valueOf(root),
    linkTexts: links.map((link) => valueOf(link)),
    linkCount: links.length,
  }));

  const completeCurrentRouteAnchors = Array.from(
    document.querySelectorAll("nav a[href]"),
  ).filter(
    (anchor) =>
      isDirectHref(anchor) && sameRoute(anchor.href, pageLocationHref),
  );

  const currentRouteAnchors = completeCurrentRouteAnchors.map((anchor) => {
    const ancestorListItems = [];
    let current = anchor.parentElement;
    while (current !== null) {
      if (current.tagName.toLowerCase() === "li") {
        ancestorListItems.push(current);
      }
      if (current.tagName.toLowerCase() === "nav") {
        break;
      }
      current = current.parentElement;
    }

    const candidateElements = [];
    for (const headerGroup of headerGroups) {
      if (!isNonEmptyStringLocal(headerGroup.name)) {
        continue;
      }
      for (const listItem of ancestorListItems) {
        for (const element of listItem.querySelectorAll("div")) {
          if (
            valueOf(element) !== headerGroup.name ||
            element.contains(anchor) ||
            anchor.contains(element)
          ) {
            continue;
          }

          let sameValueAncestor = element.parentElement;
          let nestedUnderSameValue = false;
          while (sameValueAncestor !== null && sameValueAncestor !== listItem) {
            if (
              sameValueAncestor.tagName.toLowerCase() === "div" &&
              valueOf(sameValueAncestor) === headerGroup.name
            ) {
              nestedUnderSameValue = true;
              break;
            }
            sameValueAncestor = sameValueAncestor.parentElement;
          }

          if (!nestedUnderSameValue && !candidateElements.includes(element)) {
            candidateElements.push(element);
          }
        }
      }
    }

    const nestedIdValues = Array.from(
      anchor.querySelectorAll("[data-conversation-options-trigger]"),
      (element) => element.getAttribute("data-conversation-options-trigger"),
    );

    const rawHref = anchor.getAttribute("href");
    const dataActiveValue = anchor.getAttribute("data-active");
    return {
      absoluteHref: anchor.href,
      rawHrefDirect:
        typeof rawHref === "string" &&
        rawHref.length > 0 &&
        !rawHref.startsWith("#"),
      fragmentOnly:
        typeof rawHref === "string" && rawHref.startsWith("#"),
      dataActivePresent: anchor.hasAttribute("data-active"),
      dataActiveValue,
      dataActiveEmptyValued:
        anchor.hasAttribute("data-active") && dataActiveValue === "",
      dataActiveNonEmptyValued:
        anchor.hasAttribute("data-active") &&
        typeof dataActiveValue === "string" &&
        dataActiveValue.length > 0,
      navigationNameValues: candidateElements.map((element) =>
        valueOf(element),
      ),
      nestedIdValues,
    };
  });

  const canonicalHrefs = Array.from(
    document.head.querySelectorAll('link[rel="canonical"]'),
    (element) => element.href,
  );

  let broadProjectTestIdCount = 0;
  let broadProjectAriaLabelCount = 0;
  try {
    broadProjectTestIdCount = document.querySelectorAll(
      '[data-testid*="project" i]',
    ).length;
    broadProjectAriaLabelCount = document.querySelectorAll(
      '[aria-label*="project" i]',
    ).length;
  } catch {
    broadProjectTestIdCount = 0;
    broadProjectAriaLabelCount = 0;
  }

  function isNonEmptyStringLocal(value) {
    return typeof value === "string" && value.length > 0;
  }

  return {
    pageLocationHref,
    pageLocationPathname,
    pageDocumentUrl,
    currentRouteAnchors,
    headerGroups,
    canonicalHrefs,
    diagnostics: {
      broadProjectTestIdCount,
      broadProjectAriaLabelCount,
      documentTitleLength:
        typeof document.title === "string" ? document.title.length : null,
      globalNestedIdMetadataCount: document.querySelectorAll(
        "[data-conversation-options-trigger]",
      ).length,
    },
  };
}

export function evaluateProjectMetadataSnapshot(snapshot) {
  const anchors = Array.isArray(snapshot?.currentRouteAnchors)
    ? snapshot.currentRouteAnchors
    : [];
  const headers = Array.isArray(snapshot?.headerGroups)
    ? snapshot.headerGroups
    : [];
  const anchor = anchors.length === 1 ? anchors[0] : null;
  const header = headers.length === 1 ? headers[0] : null;
  const navigationNames = Array.isArray(anchor?.navigationNameValues)
    ? anchor.navigationNameValues
    : [];
  const headerLinks = Array.isArray(header?.linkTexts)
    ? header.linkTexts
    : [];

  const navigationName =
    navigationNames.length === 1 ? navigationNames[0] : null;
  const headerName = header?.name ?? null;
  const headerLinkText = headerLinks.length === 1 ? headerLinks[0] : null;

  const checks = {
    currentAnchorCardinality: anchors.length === 1,
    currentAnchorDirect:
      anchor?.rawHrefDirect === true && anchor?.fragmentOnly !== true,
    currentRouteBound:
      anchor !== null &&
      sameRouteComponents(anchor.absoluteHref, snapshot?.pageLocationHref),
    dataActivePresent: anchor?.dataActivePresent === true,
    dataActiveRepresentationExpected:
      anchor?.dataActivePresent === true &&
      anchor?.dataActiveEmptyValued === true &&
      anchor?.dataActiveNonEmptyValued !== true,
    navigationNameCardinality: navigationNames.length === 1,
    navigationNamePresent: isNonEmptyString(navigationName),
    headerGroupCardinality: headers.length === 1,
    headerNamePresent: isNonEmptyString(headerName),
    headerLinkCardinality: headerLinks.length === 1,
    headerLinkPresent: isNonEmptyString(headerLinkText),
    navigationHeaderEquality:
      isNonEmptyString(navigationName) &&
      isNonEmptyString(headerName) &&
      navigationName === headerName,
    headerInternalEquality:
      isNonEmptyString(headerName) &&
      isNonEmptyString(headerLinkText) &&
      headerName === headerLinkText,
  };

  const violations = [];
  if (!checks.currentAnchorCardinality) {
    addViolation(violations, "TRACK_A_CURRENT_ANCHOR_CARDINALITY");
  }
  if (anchor !== null && !checks.currentAnchorDirect) {
    addViolation(violations, "TRACK_A_CURRENT_ANCHOR_NOT_DIRECT");
  }
  if (anchor !== null && !checks.currentRouteBound) {
    addViolation(violations, "TRACK_A_CURRENT_ROUTE_BINDING_MISMATCH");
  }
  if (anchor !== null && !checks.dataActivePresent) {
    addViolation(violations, "TRACK_A_DATA_ACTIVE_MISSING");
  }
  if (
    anchor !== null &&
    checks.dataActivePresent &&
    !checks.dataActiveRepresentationExpected
  ) {
    addViolation(violations, "TRACK_A_DATA_ACTIVE_REPRESENTATION_UNEXPECTED");
  }
  if (!checks.navigationNameCardinality) {
    addViolation(violations, "TRACK_A_NAVIGATION_NAME_CARDINALITY");
  }
  if (checks.navigationNameCardinality && !checks.navigationNamePresent) {
    addViolation(violations, "TRACK_A_NAVIGATION_NAME_EMPTY");
  }
  if (!checks.headerGroupCardinality) {
    addViolation(violations, "TRACK_A_HEADER_NAME_CARDINALITY");
  }
  if (checks.headerGroupCardinality && !checks.headerNamePresent) {
    addViolation(violations, "TRACK_A_HEADER_NAME_EMPTY");
  }
  if (!checks.headerLinkCardinality) {
    addViolation(violations, "TRACK_A_HEADER_LINK_CARDINALITY");
  }
  if (checks.headerLinkCardinality && !checks.headerLinkPresent) {
    addViolation(violations, "TRACK_A_HEADER_LINK_EMPTY");
  }
  if (
    checks.navigationNamePresent &&
    checks.headerNamePresent &&
    !checks.navigationHeaderEquality
  ) {
    addViolation(violations, "TRACK_A_NAVIGATION_HEADER_MISMATCH");
  }
  if (
    checks.headerNamePresent &&
    checks.headerLinkPresent &&
    !checks.headerInternalEquality
  ) {
    addViolation(violations, "TRACK_A_HEADER_INTERNAL_MISMATCH");
  }

  const ambiguous =
    anchors.length > 1 ||
    navigationNames.length > 1 ||
    headers.length > 1 ||
    headerLinks.length > 1;
  const unresolved =
    anchors.length === 0 ||
    !checks.currentAnchorDirect ||
    !checks.currentRouteBound ||
    !checks.dataActivePresent ||
    navigationNames.length === 0 ||
    !checks.navigationNamePresent ||
    headers.length === 0 ||
    !checks.headerNamePresent ||
    headerLinks.length === 0 ||
    !checks.headerLinkPresent;
  const inconsistent =
    !checks.dataActiveRepresentationExpected ||
    !checks.navigationHeaderEquality ||
    !checks.headerInternalEquality;

  let state = PROJECT_STATE.RESOLVED_CURRENT;
  if (ambiguous) {
    state = PROJECT_STATE.AMBIGUOUS;
  } else if (unresolved) {
    state = PROJECT_STATE.UNRESOLVED;
  } else if (inconsistent) {
    state = PROJECT_STATE.INCONSISTENT;
  }

  const accepted = state === PROJECT_STATE.RESOLVED_CURRENT;
  return {
    state,
    accepted,
    failClosed: !accepted,
    resolvedSourceType: accepted ? "Project" : null,
    resolvedProjectName: accepted ? navigationName : null,
    checks,
    violations,
  };
}

export function evaluateProjectConversationIdSnapshot(snapshot) {
  const violations = [];
  let unsupported = false;
  let ambiguous = false;
  let unresolved = false;
  let inconsistent = false;

  const violate = (code, category) => {
    addViolation(violations, code);
    if (category === "unsupported") unsupported = true;
    if (category === "ambiguous") ambiguous = true;
    if (category === "unresolved") unresolved = true;
    if (category === "inconsistent") inconsistent = true;
  };

  const host = parseObservedProjectConversationRouteV1(
    snapshot?.browserHostUrl,
  );
  const pageHref = parseObservedProjectConversationRouteV1(
    snapshot?.pageLocationHref,
  );
  const documentUrl = parseObservedProjectConversationRouteV1(
    snapshot?.pageDocumentUrl,
  );

  if (!host.present) {
    violate("TRACK_B_HOST_URL_MISSING", "unresolved");
  } else if (!host.parseable || !host.supportedRoute) {
    violate("TRACK_B_HOST_ROUTE_UNSUPPORTED", "unsupported");
  }
  if (host.supportedRoute && !host.cidPresent) {
    violate("TRACK_B_PRIMARY_CID_EMPTY", "unresolved");
  }

  if (!pageHref.present || !documentUrl.present) {
    violate("TRACK_B_PAGE_URL_MISSING", "unresolved");
  } else if (
    !pageHref.parseable ||
    !documentUrl.parseable ||
    !pageHref.supportedRoute ||
    !documentUrl.supportedRoute
  ) {
    violate("TRACK_B_PAGE_ROUTE_INVALID", "inconsistent");
  }

  const hostPageWholeEquality =
    isNonEmptyString(snapshot?.browserHostUrl) &&
    snapshot.browserHostUrl === snapshot?.pageLocationHref &&
    snapshot.browserHostUrl === snapshot?.pageDocumentUrl;
  const pageInternalWholeEquality =
    isNonEmptyString(snapshot?.pageLocationHref) &&
    snapshot.pageLocationHref === snapshot?.pageDocumentUrl;
  const pathnameEquality =
    isNonEmptyString(snapshot?.pageLocationPathname) &&
    pageHref.parseable &&
    documentUrl.parseable &&
    snapshot.pageLocationPathname === pageHref.pathname &&
    snapshot.pageLocationPathname === documentUrl.pathname &&
    (!host.parseable || snapshot.pageLocationPathname === host.pathname);
  const pageCidEquality =
    host.cidPresent &&
    pageHref.cidPresent &&
    documentUrl.cidPresent &&
    host.cid === pageHref.cid &&
    host.cid === documentUrl.cid;

  if (!hostPageWholeEquality) {
    violate("TRACK_B_BROWSER_PAGE_ROUTE_MISMATCH", "inconsistent");
  }
  if (!pageInternalWholeEquality) {
    violate("TRACK_B_PAGE_URL_INTERNAL_MISMATCH", "inconsistent");
  }
  if (!pathnameEquality) {
    violate("TRACK_B_PATHNAME_MISMATCH", "inconsistent");
  }
  if (
    host.cidPresent &&
    pageHref.cidPresent &&
    documentUrl.cidPresent &&
    !pageCidEquality
  ) {
    violate("TRACK_B_PAGE_CID_MISMATCH", "inconsistent");
  }

  const anchors = Array.isArray(snapshot?.currentRouteAnchors)
    ? snapshot.currentRouteAnchors
    : [];
  if (anchors.length === 0) {
    violate("TRACK_B_ACTIVE_ANCHOR_MISSING", "unresolved");
  } else if (anchors.length > 1) {
    violate("TRACK_B_ACTIVE_ANCHOR_AMBIGUOUS", "ambiguous");
  }

  const anchor = anchors.length === 1 ? anchors[0] : null;
  const anchorRoute = parseObservedProjectConversationRouteV1(
    anchor?.absoluteHref,
  );
  const nestedValues = Array.isArray(anchor?.nestedIdValues)
    ? anchor.nestedIdValues
    : [];

  if (anchor !== null) {
    if (anchor.rawHrefDirect !== true || anchor.fragmentOnly === true) {
      violate("TRACK_B_ACTIVE_ANCHOR_NOT_DIRECT", "inconsistent");
    }
    if (anchor.dataActivePresent !== true) {
      violate("TRACK_B_DATA_ACTIVE_MISSING", "unresolved");
    } else if (
      anchor.dataActiveEmptyValued !== true ||
      anchor.dataActiveNonEmptyValued === true
    ) {
      violate("TRACK_B_DATA_ACTIVE_REPRESENTATION_UNEXPECTED", "inconsistent");
    }
    if (!anchorRoute.parseable || !anchorRoute.supportedRoute) {
      violate("TRACK_B_ACTIVE_ANCHOR_ROUTE_INVALID", "inconsistent");
    }
    if (
      host.parseable &&
      !sameRouteComponents(anchor.absoluteHref, snapshot?.browserHostUrl)
    ) {
      violate("TRACK_B_ACTIVE_ROUTE_MISMATCH", "inconsistent");
    }
    if (
      host.cidPresent &&
      anchorRoute.cidPresent &&
      host.cid !== anchorRoute.cid
    ) {
      violate("TRACK_B_ACTIVE_PRIMARY_CID_MISMATCH", "inconsistent");
    }
  }

  if (nestedValues.length === 0) {
    violate("TRACK_B_NESTED_ID_MISSING", "unresolved");
  } else if (nestedValues.length > 1) {
    violate("TRACK_B_NESTED_ID_AMBIGUOUS", "ambiguous");
  }
  const nestedId = nestedValues.length === 1 ? nestedValues[0] : null;
  if (nestedValues.length === 1 && !isNonEmptyString(nestedId)) {
    violate("TRACK_B_NESTED_ID_EMPTY", "unresolved");
  }
  if (
    isNonEmptyString(nestedId) &&
    anchorRoute.cidPresent &&
    nestedId !== anchorRoute.cid
  ) {
    violate("TRACK_B_ANCHOR_NESTED_CID_MISMATCH", "inconsistent");
  }
  if (
    isNonEmptyString(nestedId) &&
    host.cidPresent &&
    nestedId !== host.cid
  ) {
    violate("TRACK_B_NESTED_PRIMARY_CID_MISMATCH", "inconsistent");
  }

  const canonicalHrefs = Array.isArray(snapshot?.canonicalHrefs)
    ? snapshot.canonicalHrefs
    : [];
  if (canonicalHrefs.length === 0) {
    violate("TRACK_B_CANONICAL_MISSING", "unresolved");
  } else if (canonicalHrefs.length > 1) {
    violate("TRACK_B_CANONICAL_AMBIGUOUS", "ambiguous");
  }
  const canonicalHref =
    canonicalHrefs.length === 1 ? canonicalHrefs[0] : null;
  const canonical = parseObservedProjectConversationRouteV1(canonicalHref);
  if (
    canonicalHrefs.length === 1 &&
    (!canonical.parseable || !canonical.supportedRoute)
  ) {
    violate("TRACK_B_CANONICAL_ROUTE_INVALID", "inconsistent");
  }
  if (
    canonical.supportedRoute &&
    host.supportedRoute &&
    canonicalHref !== snapshot?.browserHostUrl
  ) {
    violate("TRACK_B_CANONICAL_ROUTE_MISMATCH", "inconsistent");
  }
  if (
    canonical.cidPresent &&
    host.cidPresent &&
    canonical.cid !== host.cid
  ) {
    violate("TRACK_B_CANONICAL_PRIMARY_CID_MISMATCH", "inconsistent");
  }
  if (
    canonical.cidPresent &&
    anchorRoute.cidPresent &&
    canonical.cid !== anchorRoute.cid
  ) {
    violate("TRACK_B_CANONICAL_ACTIVE_CID_MISMATCH", "inconsistent");
  }
  if (
    canonical.cidPresent &&
    isNonEmptyString(nestedId) &&
    canonical.cid !== nestedId
  ) {
    violate("TRACK_B_CANONICAL_NESTED_CID_MISMATCH", "inconsistent");
  }

  let state = PROJECT_STATE.RESOLVED_CURRENT;
  if (unsupported) {
    state = PROJECT_STATE.UNSUPPORTED_ROUTE;
  } else if (ambiguous) {
    state = PROJECT_STATE.AMBIGUOUS;
  } else if (unresolved) {
    state = PROJECT_STATE.UNRESOLVED;
  } else if (inconsistent) {
    state = PROJECT_STATE.INCONSISTENT;
  }

  const accepted = state === PROJECT_STATE.RESOLVED_CURRENT;
  return {
    state,
    accepted,
    failClosed: !accepted,
    resolvedCid: accepted ? host.cid : null,
    checks: {
      hostRouteSupported: host.supportedRoute,
      hostPageWholeEquality,
      pageInternalWholeEquality,
      pathnameEquality,
      pageCidEquality,
      activeAnchorCardinality: anchors.length === 1,
      activeRouteBound:
        anchor !== null &&
        sameRouteComponents(anchor.absoluteHref, snapshot?.browserHostUrl),
      dataActivePresent: anchor?.dataActivePresent === true,
      dataActiveRepresentationExpected:
        anchor?.dataActivePresent === true &&
        anchor?.dataActiveEmptyValued === true &&
        anchor?.dataActiveNonEmptyValued !== true,
      nestedCardinality: nestedValues.length === 1,
      activeInternalEquality:
        anchorRoute.cidPresent &&
        isNonEmptyString(nestedId) &&
        anchorRoute.cid === nestedId,
      activePrimaryEquality:
        host.cidPresent &&
        anchorRoute.cidPresent &&
        isNonEmptyString(nestedId) &&
        host.cid === anchorRoute.cid &&
        host.cid === nestedId,
      canonicalCardinality: canonicalHrefs.length === 1,
      canonicalPrimaryEquality:
        canonical.cidPresent &&
        host.cidPresent &&
        canonical.cid === host.cid,
      crossGroupEquality:
        host.cidPresent &&
        pageCidEquality &&
        anchorRoute.cidPresent &&
        isNonEmptyString(nestedId) &&
        canonical.cidPresent &&
        host.cid === anchorRoute.cid &&
        host.cid === nestedId &&
        host.cid === canonical.cid,
    },
    diagnostics: {
      host,
      pageHref,
      documentUrl,
      anchorRoute,
      canonical,
      anchorCount: anchors.length,
      nestedCount: nestedValues.length,
      canonicalCount: canonicalHrefs.length,
    },
    violations,
  };
}

function groundTruthInputError(message) {
  const error = new Error(message);
  error.code = "GROUND_TRUTH_INPUT_ERROR";
  return error;
}

export function compareSourceTypeGroundTruth(resolvedValue, expectedValue) {
  if (!isNonEmptyString(expectedValue)) {
    throw groundTruthInputError("Expected Source Type must be non-empty");
  }
  return {
    expectedPresent: true,
    resolvedPresent: isNonEmptyString(resolvedValue),
    exactMatch: resolvedValue === expectedValue,
  };
}

function compareStringGroundTruth(resolvedValue, expectedValue, label) {
  if (!isNonEmptyString(expectedValue)) {
    throw groundTruthInputError(`Expected ${label} must be non-empty`);
  }
  return {
    expectedLength: expectedValue.length,
    resolvedLength:
      typeof resolvedValue === "string" ? resolvedValue.length : null,
    exactMatch:
      typeof resolvedValue === "string" && resolvedValue === expectedValue,
  };
}

export function compareProjectNameGroundTruth(resolvedValue, expectedValue) {
  return compareStringGroundTruth(
    resolvedValue,
    expectedValue,
    "Project Name",
  );
}

export function compareProjectCidGroundTruth(resolvedValue, expectedValue) {
  return compareStringGroundTruth(resolvedValue, expectedValue, "Project CID");
}

export function summarizeTask002Result(
  snapshot,
  trackA,
  trackB,
  comparisons = null,
) {
  const anchors = Array.isArray(snapshot?.currentRouteAnchors)
    ? snapshot.currentRouteAnchors
    : [];
  const headers = Array.isArray(snapshot?.headerGroups)
    ? snapshot.headerGroups
    : [];
  const selectedAnchor = anchors.length === 1 ? anchors[0] : null;
  const selectedHeader = headers.length === 1 ? headers[0] : null;
  const nestedValues = Array.isArray(selectedAnchor?.nestedIdValues)
    ? selectedAnchor.nestedIdValues
    : [];
  const navigationNames = Array.isArray(selectedAnchor?.navigationNameValues)
    ? selectedAnchor.navigationNameValues
    : [];
  const headerLinks = Array.isArray(selectedHeader?.linkTexts)
    ? selectedHeader.linkTexts
    : [];
  const host = trackB.diagnostics.host;

  return {
    revision: POC_VERSION,
    trackA: {
      state: trackA.state,
      accepted: trackA.accepted,
      failClosed: trackA.failClosed,
      violationCodes: [...trackA.violations],
      currentAnchorCount: anchors.length,
      currentRouteBound: trackA.checks.currentRouteBound,
      dataActiveAttributePresent: selectedAnchor?.dataActivePresent === true,
      dataActiveEmptyValued: selectedAnchor?.dataActiveEmptyValued === true,
      dataActiveNonEmptyValued:
        selectedAnchor?.dataActiveNonEmptyValued === true,
      navigationNameCount: navigationNames.length,
      navigationNameLengths: navigationNames.map((value) =>
        typeof value === "string" ? value.length : null,
      ),
      headerGroupCount: headers.length,
      headerNameLengths: headers.map((group) =>
        typeof group?.name === "string" ? group.name.length : null,
      ),
      headerLinkCount: headerLinks.length,
      headerLinkLengths: headerLinks.map((value) =>
        typeof value === "string" ? value.length : null,
      ),
      navigationHeaderEquality: trackA.checks.navigationHeaderEquality,
      headerInternalEquality: trackA.checks.headerInternalEquality,
    },
    trackB: {
      state: trackB.state,
      accepted: trackB.accepted,
      failClosed: trackB.failClosed,
      violationCodes: [...trackB.violations],
      hostRoutePresent: host.present,
      hostRouteParseable: host.parseable,
      hostRouteSupported: host.supportedRoute,
      routeSegmentCount: host.segmentCount,
      routeSegmentLengths: [...host.segmentLengths],
      cidCandidateCount: host.cidCandidateCount,
      cidCandidatePosition: host.cidCandidatePosition,
      cidLength: host.cidLength,
      queryPresent: host.queryPresent,
      fragmentPresent: host.fragmentPresent,
      hostPageWholeEquality: trackB.checks.hostPageWholeEquality,
      pageInternalWholeEquality: trackB.checks.pageInternalWholeEquality,
      pathnameEquality: trackB.checks.pathnameEquality,
      activeAnchorCount: anchors.length,
      activeRouteBound: trackB.checks.activeRouteBound,
      dataActiveAttributePresent: selectedAnchor?.dataActivePresent === true,
      dataActiveEmptyValued: selectedAnchor?.dataActiveEmptyValued === true,
      dataActiveNonEmptyValued:
        selectedAnchor?.dataActiveNonEmptyValued === true,
      nestedIdCount: nestedValues.length,
      nestedIdLengths: nestedValues.map((value) =>
        typeof value === "string" ? value.length : null,
      ),
      activeInternalEquality: trackB.checks.activeInternalEquality,
      activePrimaryEquality: trackB.checks.activePrimaryEquality,
      canonicalCount: trackB.diagnostics.canonicalCount,
      canonicalPrimaryEquality: trackB.checks.canonicalPrimaryEquality,
      crossGroupEquality: trackB.checks.crossGroupEquality,
    },
    combinedRuntimeAccepted: trackA.accepted && trackB.accepted,
    groundTruth:
      comparisons === null
        ? null
        : {
            sourceTypeExact: comparisons.sourceType.exactMatch,
            projectName: { ...comparisons.projectName },
            projectCid: { ...comparisons.projectCid },
          },
    diagnostics: {
      broadProjectTestIdCount: Number(
        snapshot?.diagnostics?.broadProjectTestIdCount ?? 0,
      ),
      broadProjectAriaLabelCount: Number(
        snapshot?.diagnostics?.broadProjectAriaLabelCount ?? 0,
      ),
      globalNestedIdMetadataCount: Number(
        snapshot?.diagnostics?.globalNestedIdMetadataCount ?? 0,
      ),
    },
  };
}

export function evaluateTask002TechnicalSpikeCase(snapshot, expected) {
  if (expected === null || typeof expected !== "object") {
    throw groundTruthInputError("Expected Ground Truth object is required");
  }

  const trackA = evaluateProjectMetadataSnapshot(snapshot);
  const trackB = evaluateProjectConversationIdSnapshot(snapshot);
  const sourceType = compareSourceTypeGroundTruth(
    trackA.resolvedSourceType,
    expected.sourceType,
  );
  const projectName = compareProjectNameGroundTruth(
    trackA.resolvedProjectName,
    expected.projectName,
  );
  const projectCid = compareProjectCidGroundTruth(
    trackB.resolvedCid,
    expected.projectCid,
  );
  const comparisons = { sourceType, projectName, projectCid };
  const combinedRuntimeAccepted = trackA.accepted && trackB.accepted;
  const casePass =
    combinedRuntimeAccepted &&
    sourceType.exactMatch &&
    projectName.exactMatch &&
    projectCid.exactMatch;

  return {
    casePass,
    combinedRuntimeAccepted,
    trackA,
    trackB,
    comparisons,
    summary: {
      ...summarizeTask002Result(snapshot, trackA, trackB, comparisons),
      casePass,
    },
  };
}
