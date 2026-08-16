/**
 * TASK-002 Project Chat DOM Minimal PoC v2.
 *
 * Phase 0 validation only. The only public execution boundary returns an
 * Evidence-safe summary (or a fixed safe error code). Raw browser/page/DOM and
 * Ground Truth values remain private to this one invocation.
 */

export const POC_V2_VERSION = "task002-project-chat-minimal-poc-v2";

export const PROJECT_STATE = Object.freeze({
  RESOLVED_CURRENT: "RESOLVED_CURRENT",
  UNSUPPORTED_ROUTE: "UNSUPPORTED_ROUTE",
  UNRESOLVED: "UNRESOLVED",
  AMBIGUOUS: "AMBIGUOUS",
  INCONSISTENT: "INCONSISTENT",
});

/**
 * Run a single-snapshot TASK-002 v2 evaluation.
 *
 * This function is intentionally self-contained so the same safe boundary can
 * be serialized into an authenticated browser execution context. Callers can
 * supply a syntheticSnapshot for DOM-independent tests. No raw result object
 * is ever returned.
 */
export function runTask002PrivacySafeHarnessV2(input) {
  const REVISION = "task002-project-chat-minimal-poc-v2";
  const STATE = {
    RESOLVED_CURRENT: "RESOLVED_CURRENT",
    UNSUPPORTED_ROUTE: "UNSUPPORTED_ROUTE",
    UNRESOLVED: "UNRESOLVED",
    AMBIGUOUS: "AMBIGUOUS",
    INCONSISTENT: "INCONSISTENT",
  };

  const isNonEmptyString = (value) =>
    typeof value === "string" && value.length > 0;

  const addViolation = (violations, code) => {
    if (!violations.includes(code)) violations.push(code);
  };

  const safeError = (code) => ({
    revision: REVISION,
    safeErrorCode: code,
    privacyBoundaryEnforced: true,
    casePass: false,
  });

  const routeEmpty = (present, parseable) => ({
    present,
    parseable,
    supported: false,
    segmentCount: null,
    segmentLengths: [],
    cidPosition: null,
    cid: null,
    cidPresent: false,
    cidLength: null,
    queryPresent: false,
    fragmentPresent: false,
    origin: null,
    pathname: null,
    href: null,
  });

  const parseProjectRoute = (rawUrl) => {
    if (!isNonEmptyString(rawUrl)) return routeEmpty(false, false);
    let parsed;
    try {
      parsed = new URL(rawUrl);
    } catch {
      return routeEmpty(true, false);
    }

    const segments = parsed.pathname.split("/").filter(Boolean);
    const queryPresent = parsed.search.length > 0;
    const fragmentPresent = parsed.hash.length > 0;
    const shapeSupported =
      segments.length === 4 && !queryPresent && !fragmentPresent;
    const cid = shapeSupported ? segments[3] : null;

    return {
      present: true,
      parseable: true,
      supported: shapeSupported && isNonEmptyString(cid),
      segmentCount: segments.length,
      segmentLengths: segments.map((segment) => segment.length),
      cidPosition: shapeSupported && isNonEmptyString(cid) ? 3 : null,
      cid,
      cidPresent: isNonEmptyString(cid),
      cidLength: typeof cid === "string" ? cid.length : null,
      queryPresent,
      fragmentPresent,
      origin: parsed.origin,
      pathname: parsed.pathname,
      href: parsed.href,
    };
  };

  const chooseState = ({ unsupported, ambiguous, unresolved, inconsistent }) => {
    if (unsupported) return STATE.UNSUPPORTED_ROUTE;
    if (ambiguous) return STATE.AMBIGUOUS;
    if (unresolved) return STATE.UNRESOLVED;
    if (inconsistent) return STATE.INCONSISTENT;
    return STATE.RESOLVED_CURRENT;
  };

  const captureLiveSnapshot = () => {
    const textOf = (element) => {
      if (typeof element?.innerText === "string") return element.innerText;
      return typeof element?.textContent === "string"
        ? element.textContent
        : null;
    };

    const directHref = (anchor) => {
      const raw = anchor?.getAttribute?.("href");
      return (
        typeof raw === "string" && raw.length > 0 && !raw.startsWith("#")
      );
    };

    const isVisible = (element) => {
      if (!(element instanceof Element)) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") !== 0 &&
        (rect.width > 0 || rect.height > 0)
      );
    };

    const hasAccessibleMaterial = (element) =>
      element.matches("[aria-label],[role],button") ||
      element.querySelector("[aria-label],[role],button") !== null;

    const hasLocalProjectSemanticMaterial = (element) =>
      element.matches(
        '[data-testid*="project" i],[aria-label*="project" i],[data-project],[data-project-id]',
      ) ||
      element.querySelector(
        '[data-testid*="project" i],[aria-label*="project" i],[data-project],[data-project-id]',
      ) !== null;

    const headerLinkCandidates = Array.from(
      document.querySelectorAll("header a[href]"),
    ).filter((anchor) => directHref(anchor) && isNonEmptyString(textOf(anchor)));

    const headerGroupEntries = [];
    for (const anchor of headerLinkCandidates) {
      const linkText = textOf(anchor);
      const matchingDivAncestors = [];
      let current = anchor.parentElement;
      while (current !== null && current.closest("header") !== null) {
        if (
          current.tagName.toLowerCase() === "div" &&
          textOf(current) === linkText
        ) {
          matchingDivAncestors.push(current);
        }
        if (current.tagName.toLowerCase() === "header") break;
        current = current.parentElement;
      }
      const root = matchingDivAncestors.at(-1) ?? null;
      if (root === null) continue;
      const existing = headerGroupEntries.find((entry) => entry.root === root);
      if (existing === undefined) {
        headerGroupEntries.push({ root, links: [anchor] });
      } else if (!existing.links.includes(anchor)) {
        existing.links.push(anchor);
      }
    }

    const headerGroups = headerGroupEntries.map(({ root, links }) => ({
      name: textOf(root),
      linkTexts: links.map((link) => textOf(link)),
    }));

    const activeAnchors = Array.from(
      document.querySelectorAll("nav a[href][data-active]"),
    ).map((anchor) => {
      const rawHref = anchor.getAttribute("href");
      const dataActiveValue = anchor.getAttribute("data-active");
      const listItemAncestors = [];
      let current = anchor.parentElement;
      while (current !== null) {
        if (current.tagName.toLowerCase() === "li") {
          listItemAncestors.push(current);
        }
        if (current.tagName.toLowerCase() === "nav") break;
        current = current.parentElement;
      }

      const outerLocalScope = listItemAncestors.at(-1) ?? null;
      const directBranches =
        outerLocalScope === null ? [] : Array.from(outerLocalScope.children);
      const anchorBearingBranches = directBranches.filter((branch) =>
        branch.contains(anchor),
      );
      const rA1Branches = directBranches
        .filter((branch) => {
          const value = textOf(branch);
          return (
            branch.tagName.toLowerCase() === "div" &&
            !branch.contains(anchor) &&
            branch.querySelectorAll("a").length === 0 &&
            isVisible(branch) &&
            isNonEmptyString(value) &&
            hasAccessibleMaterial(branch) &&
            hasLocalProjectSemanticMaterial(branch)
          );
        })
        .map((branch) => ({
          value: textOf(branch),
          visible: isVisible(branch),
          containsActiveAnchor: branch.contains(anchor),
          descendantAnchorCount: branch.querySelectorAll("a").length,
          accessibleMaterialPresent: hasAccessibleMaterial(branch),
          projectSemanticLocalMaterialPresent:
            hasLocalProjectSemanticMaterial(branch),
          textRootGroupCount: isNonEmptyString(textOf(branch)) ? 1 : 0,
        }));

      return {
        insideNavigation: anchor.closest("nav") !== null,
        absoluteHref: anchor.href,
        rawHrefDirect:
          typeof rawHref === "string" &&
          rawHref.length > 0 &&
          !rawHref.startsWith("#"),
        fragmentOnly:
          typeof rawHref === "string" && rawHref.startsWith("#"),
        dataActivePresent: anchor.hasAttribute("data-active"),
        dataActiveEmptyValued:
          anchor.hasAttribute("data-active") && dataActiveValue === "",
        dataActiveNonEmptyValued:
          anchor.hasAttribute("data-active") &&
          typeof dataActiveValue === "string" &&
          dataActiveValue.length > 0,
        nestedIdValues: Array.from(
          anchor.querySelectorAll("[data-conversation-options-trigger]"),
          (element) => element.getAttribute("data-conversation-options-trigger"),
        ),
        rA1: {
          listItemAncestorCount: listItemAncestors.length,
          localScopeCount: outerLocalScope === null ? 0 : 1,
          directChildBranchCount: directBranches.length,
          anchorBearingBranchCount: anchorBearingBranches.length,
          candidateBranches: rA1Branches,
        },
      };
    });

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

    return {
      browserHostUrl: input?.browserHostUrl,
      pageLocationHref: location.href,
      pageDocumentUrl: document.URL,
      pageLocationPathname: location.pathname,
      activeAnchors,
      headerGroups,
      canonicalHrefs: Array.from(
        document.head.querySelectorAll('link[rel="canonical"]'),
        (element) => element.href,
      ),
      fixtureAliasMatched:
        isNonEmptyString(input?.fixtureTitle) &&
        typeof document.title === "string" &&
        document.title.includes(input.fixtureTitle),
      diagnostics: {
        documentReadyState:
          document.readyState === "loading"
            ? "LOADING"
            : document.readyState === "interactive"
              ? "INTERACTIVE"
              : document.readyState === "complete"
                ? "COMPLETE"
                : "OTHER",
        mainCount: document.querySelectorAll("main").length,
        navElementCount: document.querySelectorAll("nav").length,
        navAnchorCount: document.querySelectorAll("nav a[href]").length,
        globalNestedIdMetadataCount: document.querySelectorAll(
          "[data-conversation-options-trigger]",
        ).length,
        broadProjectTestIdCount,
        broadProjectAriaLabelCount,
      },
    };
  };

  const evaluateSharedActive = (snapshot, host) => {
    const candidates = Array.isArray(snapshot?.activeAnchors)
      ? snapshot.activeAnchors
      : [];
    const active = candidates.length === 1 ? candidates[0] : null;
    const route = parseProjectRoute(active?.absoluteHref);
    const nested = Array.isArray(active?.nestedIdValues)
      ? active.nestedIdValues
      : [];
    const nestedValue = nested.length === 1 ? nested[0] : null;
    const sameOrigin =
      host.parseable && route.parseable && host.origin === route.origin;
    const direct =
      active?.rawHrefDirect === true && active?.fragmentOnly !== true;
    const dataActiveExpected =
      active?.dataActivePresent === true &&
      active?.dataActiveEmptyValued === true &&
      active?.dataActiveNonEmptyValued !== true;
    const activeCidPrimaryEquality =
      host.cidPresent && route.cidPresent && host.cid === route.cid;
    const nestedNonEmpty = isNonEmptyString(nestedValue);
    const activeNestedEquality =
      route.cidPresent && nestedNonEmpty && route.cid === nestedValue;
    const primaryNestedEquality =
      host.cidPresent && nestedNonEmpty && host.cid === nestedValue;
    const rB1WholeRouteEquality =
      isNonEmptyString(snapshot?.browserHostUrl) &&
      isNonEmptyString(active?.absoluteHref) &&
      snapshot.browserHostUrl === active.absoluteHref;
    const rB2 =
      candidates.length === 1 &&
      active?.insideNavigation === true &&
      direct &&
      dataActiveExpected &&
      route.supported &&
      sameOrigin &&
      route.cidPresent &&
      activeCidPrimaryEquality &&
      nested.length === 1 &&
      nestedNonEmpty &&
      activeNestedEquality &&
      primaryNestedEquality;

    return {
      candidates,
      active,
      route,
      nested,
      nestedValue,
      checks: {
        cardinality: candidates.length === 1,
        insideNavigation: active?.insideNavigation === true,
        direct,
        dataActivePresent: active?.dataActivePresent === true,
        dataActiveExpected,
        routeSupported: route.supported,
        sameOrigin,
        activeCidPresent: route.cidPresent,
        activeCidPrimaryEquality,
        nestedCardinality: nested.length === 1,
        nestedNonEmpty,
        activeNestedEquality,
        primaryNestedEquality,
        rB1WholeRouteEquality,
        rB2,
      },
    };
  };

  const evaluateTrackA = (snapshot, host, shared) => {
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

    const { candidates, active, route } = shared;
    if (candidates.length === 0) {
      violate("TRACK_A_ACTIVE_ANCHOR_MISSING", "unresolved");
    } else if (candidates.length > 1) {
      violate("TRACK_A_ACTIVE_ANCHOR_AMBIGUOUS", "ambiguous");
    }
    if (active !== null) {
      if (active.insideNavigation !== true) {
        violate("TRACK_A_ACTIVE_NOT_IN_NAVIGATION", "inconsistent");
      }
      if (!shared.checks.direct) {
        violate("TRACK_A_ACTIVE_NOT_DIRECT", "inconsistent");
      }
      if (active.dataActivePresent !== true) {
        violate("TRACK_A_DATA_ACTIVE_MISSING", "unresolved");
      } else if (!shared.checks.dataActiveExpected) {
        violate("TRACK_A_DATA_ACTIVE_REPRESENTATION_UNEXPECTED", "inconsistent");
      }
      if (!route.parseable || !route.supported) {
        violate("TRACK_A_ACTIVE_ROUTE_UNSUPPORTED", "unsupported");
      }
      if (!shared.checks.sameOrigin) {
        violate("TRACK_A_ACTIVE_ORIGIN_MISMATCH", "inconsistent");
      }
    }

    const rA1 = active?.rA1 ?? {};
    const localScopeCount = Number(rA1.localScopeCount ?? 0);
    const anchorBearingBranchCount = Number(
      rA1.anchorBearingBranchCount ?? 0,
    );
    const candidateBranches = Array.isArray(rA1.candidateBranches)
      ? rA1.candidateBranches
      : [];
    const candidate = candidateBranches.length === 1 ? candidateBranches[0] : null;
    const navigationName = candidate?.value ?? null;

    if (localScopeCount === 0) {
      violate("TRACK_A_LOCAL_SCOPE_MISSING", "unresolved");
    } else if (localScopeCount > 1) {
      violate("TRACK_A_LOCAL_SCOPE_AMBIGUOUS", "ambiguous");
    }
    if (anchorBearingBranchCount === 0) {
      violate("TRACK_A_ANCHOR_BRANCH_MISSING", "unresolved");
    } else if (anchorBearingBranchCount > 1) {
      violate("TRACK_A_ANCHOR_BRANCH_AMBIGUOUS", "ambiguous");
    }
    if (candidateBranches.length === 0) {
      violate("TRACK_A_R_A1_CANDIDATE_MISSING", "unresolved");
    } else if (candidateBranches.length > 1) {
      violate("TRACK_A_R_A1_CANDIDATE_AMBIGUOUS", "ambiguous");
    }
    if (candidate !== null) {
      if (!isNonEmptyString(navigationName)) {
        violate("TRACK_A_NAVIGATION_NAME_EMPTY", "unresolved");
      }
      if (
        candidate.visible !== true ||
        candidate.containsActiveAnchor === true ||
        Number(candidate.descendantAnchorCount ?? 0) !== 0 ||
        candidate.accessibleMaterialPresent !== true ||
        candidate.projectSemanticLocalMaterialPresent !== true ||
        Number(candidate.textRootGroupCount ?? 0) !== 1
      ) {
        violate("TRACK_A_R_A1_STRUCTURE_INVALID", "inconsistent");
      }
    }

    const headers = Array.isArray(snapshot?.headerGroups)
      ? snapshot.headerGroups
      : [];
    const header = headers.length === 1 ? headers[0] : null;
    const headerName = header?.name ?? null;
    const headerLinks = Array.isArray(header?.linkTexts)
      ? header.linkTexts
      : [];
    const headerLink = headerLinks.length === 1 ? headerLinks[0] : null;

    if (headers.length === 0) {
      violate("TRACK_A_HEADER_GROUP_MISSING", "unresolved");
    } else if (headers.length > 1) {
      violate("TRACK_A_HEADER_GROUP_AMBIGUOUS", "ambiguous");
    }
    if (header !== null && !isNonEmptyString(headerName)) {
      violate("TRACK_A_HEADER_NAME_EMPTY", "unresolved");
    }
    if (headerLinks.length === 0) {
      violate("TRACK_A_HEADER_LINK_MISSING", "unresolved");
    } else if (headerLinks.length > 1) {
      violate("TRACK_A_HEADER_LINK_AMBIGUOUS", "ambiguous");
    }
    if (headerLinks.length === 1 && !isNonEmptyString(headerLink)) {
      violate("TRACK_A_HEADER_LINK_EMPTY", "unresolved");
    }
    if (
      isNonEmptyString(navigationName) &&
      isNonEmptyString(headerName) &&
      navigationName !== headerName
    ) {
      violate("TRACK_A_NAVIGATION_HEADER_MISMATCH", "inconsistent");
    }
    if (
      isNonEmptyString(headerName) &&
      isNonEmptyString(headerLink) &&
      headerName !== headerLink
    ) {
      violate("TRACK_A_HEADER_LINK_MISMATCH", "inconsistent");
    }

    const state = chooseState({
      unsupported,
      ambiguous,
      unresolved,
      inconsistent,
    });
    const accepted = state === STATE.RESOLVED_CURRENT;
    return {
      state,
      accepted,
      violations,
      resolvedProjectName: accepted ? navigationName : null,
      resolvedSourceType: accepted ? "Project" : null,
      diagnostics: {
        localScopeCount,
        listItemAncestorCount: Number(rA1.listItemAncestorCount ?? 0),
        directChildBranchCount: Number(rA1.directChildBranchCount ?? 0),
        anchorBearingBranchCount,
        candidateCount: candidateBranches.length,
        navigationNameLength:
          typeof navigationName === "string" ? navigationName.length : null,
        headerGroupCount: headers.length,
        headerNameLength:
          typeof headerName === "string" ? headerName.length : null,
        headerLinkCount: headerLinks.length,
        headerLinkLength:
          typeof headerLink === "string" ? headerLink.length : null,
        navigationHeaderEquality:
          isNonEmptyString(navigationName) && navigationName === headerName,
        headerLinkEquality:
          isNonEmptyString(headerName) && headerName === headerLink,
      },
    };
  };

  const evaluateTrackB = (snapshot, host, shared) => {
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

    const pageHref = parseProjectRoute(snapshot?.pageLocationHref);
    const documentUrl = parseProjectRoute(snapshot?.pageDocumentUrl);
    if (!host.present) {
      violate("TRACK_B_HOST_URL_MISSING", "unresolved");
    } else if (!host.parseable || !host.supported) {
      violate("TRACK_B_HOST_ROUTE_UNSUPPORTED", "unsupported");
    }
    if (host.supported && !host.cidPresent) {
      violate("TRACK_B_PRIMARY_CID_EMPTY", "unresolved");
    }
    if (!pageHref.present || !documentUrl.present) {
      violate("TRACK_B_PAGE_URL_MISSING", "unresolved");
    } else if (
      !pageHref.parseable ||
      !documentUrl.parseable ||
      !pageHref.supported ||
      !documentUrl.supported
    ) {
      violate("TRACK_B_PAGE_ROUTE_UNSUPPORTED", "inconsistent");
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
      host.parseable &&
      pageHref.parseable &&
      documentUrl.parseable &&
      snapshot.pageLocationPathname === host.pathname &&
      snapshot.pageLocationPathname === pageHref.pathname &&
      snapshot.pageLocationPathname === documentUrl.pathname;
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
    if (!pageCidEquality) {
      violate("TRACK_B_PAGE_CID_MISMATCH", "inconsistent");
    }

    const { candidates, active, route, nested, nestedValue } = shared;
    if (candidates.length === 0) {
      violate("TRACK_B_ACTIVE_ANCHOR_MISSING", "unresolved");
    } else if (candidates.length > 1) {
      violate("TRACK_B_ACTIVE_ANCHOR_AMBIGUOUS", "ambiguous");
    }
    if (active !== null) {
      if (active.insideNavigation !== true) {
        violate("TRACK_B_ACTIVE_NOT_IN_NAVIGATION", "inconsistent");
      }
      if (!shared.checks.direct) {
        violate("TRACK_B_ACTIVE_NOT_DIRECT", "inconsistent");
      }
      if (active.dataActivePresent !== true) {
        violate("TRACK_B_DATA_ACTIVE_MISSING", "unresolved");
      } else if (!shared.checks.dataActiveExpected) {
        violate("TRACK_B_DATA_ACTIVE_REPRESENTATION_UNEXPECTED", "inconsistent");
      }
      if (!route.parseable || !route.supported) {
        violate("TRACK_B_ACTIVE_ROUTE_UNSUPPORTED", "unsupported");
      }
      if (!shared.checks.sameOrigin) {
        violate("TRACK_B_ACTIVE_ORIGIN_MISMATCH", "inconsistent");
      }
      if (!route.cidPresent) {
        violate("TRACK_B_ACTIVE_CID_EMPTY", "unresolved");
      }
      if (!shared.checks.activeCidPrimaryEquality) {
        violate("TRACK_B_ACTIVE_PRIMARY_CID_MISMATCH", "inconsistent");
      }
    }
    if (nested.length === 0) {
      violate("TRACK_B_NESTED_ID_MISSING", "unresolved");
    } else if (nested.length > 1) {
      violate("TRACK_B_NESTED_ID_AMBIGUOUS", "ambiguous");
    }
    if (nested.length === 1 && !isNonEmptyString(nestedValue)) {
      violate("TRACK_B_NESTED_ID_EMPTY", "unresolved");
    }
    if (isNonEmptyString(nestedValue) && !shared.checks.activeNestedEquality) {
      violate("TRACK_B_ACTIVE_NESTED_CID_MISMATCH", "inconsistent");
    }
    if (isNonEmptyString(nestedValue) && !shared.checks.primaryNestedEquality) {
      violate("TRACK_B_PRIMARY_NESTED_CID_MISMATCH", "inconsistent");
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
    const canonical = parseProjectRoute(canonicalHref);
    if (
      canonicalHrefs.length === 1 &&
      (!canonical.parseable || !canonical.supported)
    ) {
      violate("TRACK_B_CANONICAL_ROUTE_UNSUPPORTED", "inconsistent");
    }
    const canonicalBrowserEquality =
      canonicalHrefs.length === 1 &&
      isNonEmptyString(snapshot?.browserHostUrl) &&
      canonicalHref === snapshot.browserHostUrl;
    const canonicalPageEquality =
      canonicalHrefs.length === 1 &&
      canonicalHref === snapshot?.pageLocationHref &&
      canonicalHref === snapshot?.pageDocumentUrl;
    const canonicalPrimaryCidEquality =
      canonical.cidPresent && host.cidPresent && canonical.cid === host.cid;
    const canonicalActiveCidEquality =
      canonical.cidPresent && route.cidPresent && canonical.cid === route.cid;
    const canonicalNestedCidEquality =
      canonical.cidPresent &&
      isNonEmptyString(nestedValue) &&
      canonical.cid === nestedValue;
    if (canonicalHrefs.length === 1 && !canonicalBrowserEquality) {
      violate("TRACK_B_CANONICAL_BROWSER_ROUTE_MISMATCH", "inconsistent");
    }
    if (canonicalHrefs.length === 1 && !canonicalPageEquality) {
      violate("TRACK_B_CANONICAL_PAGE_ROUTE_MISMATCH", "inconsistent");
    }
    if (canonical.cidPresent && !canonicalPrimaryCidEquality) {
      violate("TRACK_B_CANONICAL_PRIMARY_CID_MISMATCH", "inconsistent");
    }
    if (canonical.cidPresent && route.cidPresent && !canonicalActiveCidEquality) {
      violate("TRACK_B_CANONICAL_ACTIVE_CID_MISMATCH", "inconsistent");
    }
    if (
      canonical.cidPresent &&
      isNonEmptyString(nestedValue) &&
      !canonicalNestedCidEquality
    ) {
      violate("TRACK_B_CANONICAL_NESTED_CID_MISMATCH", "inconsistent");
    }

    const canonicalActiveWholeRouteEquality =
      isNonEmptyString(canonicalHref) &&
      isNonEmptyString(active?.absoluteHref) &&
      canonicalHref === active.absoluteHref;
    const state = chooseState({
      unsupported,
      ambiguous,
      unresolved,
      inconsistent,
    });
    const accepted = state === STATE.RESOLVED_CURRENT;
    return {
      state,
      accepted,
      violations,
      resolvedCid: accepted ? host.cid : null,
      diagnostics: {
        host,
        activeCount: candidates.length,
        nestedCount: nested.length,
        canonicalCount: canonicalHrefs.length,
        hostPageWholeEquality,
        pageInternalWholeEquality,
        pathnameEquality,
        pageCidEquality,
        rB1WholeRouteEquality: shared.checks.rB1WholeRouteEquality,
        rB2: shared.checks.rB2,
        sameOrigin: shared.checks.sameOrigin,
        activeCidPrimaryEquality: shared.checks.activeCidPrimaryEquality,
        activeNestedEquality: shared.checks.activeNestedEquality,
        primaryNestedEquality: shared.checks.primaryNestedEquality,
        canonicalBrowserEquality,
        canonicalPageEquality,
        canonicalPrimaryCidEquality,
        canonicalActiveCidEquality,
        canonicalNestedCidEquality,
        canonicalActiveWholeRouteEquality,
      },
    };
  };

  const summarize = (snapshot, trackA, trackB, gt, casePass) => ({
    revision: REVISION,
    safeErrorCode: null,
    privacyBoundaryEnforced: true,
    fixtureAliasMatched: snapshot?.fixtureAliasMatched === true,
    validationKind:
      input?.validationKind === "STANDARD_NEGATIVE"
        ? "STANDARD_NEGATIVE"
        : "PROJECT",
    trackA: {
      state: trackA.state,
      accepted: trackA.accepted,
      failClosed: !trackA.accepted,
      violationCodes: [...trackA.violations],
      activeCandidateCount: Number(trackB.diagnostics.activeCount),
      localScopeCount: trackA.diagnostics.localScopeCount,
      listItemAncestorCount: trackA.diagnostics.listItemAncestorCount,
      directChildBranchCount: trackA.diagnostics.directChildBranchCount,
      anchorBearingBranchCount: trackA.diagnostics.anchorBearingBranchCount,
      rA1CandidateCount: trackA.diagnostics.candidateCount,
      navigationNameLength: trackA.diagnostics.navigationNameLength,
      headerGroupCount: trackA.diagnostics.headerGroupCount,
      headerNameLength: trackA.diagnostics.headerNameLength,
      headerLinkCount: trackA.diagnostics.headerLinkCount,
      headerLinkLength: trackA.diagnostics.headerLinkLength,
      navigationHeaderEquality: trackA.diagnostics.navigationHeaderEquality,
      headerLinkEquality: trackA.diagnostics.headerLinkEquality,
      headerIndependentEnumeration: true,
      rA1CardinalityMeasuredBeforeAgreement: true,
    },
    trackB: {
      state: trackB.state,
      accepted: trackB.accepted,
      failClosed: !trackB.accepted,
      violationCodes: [...trackB.violations],
      hostRoutePresent: trackB.diagnostics.host.present,
      hostRouteParseable: trackB.diagnostics.host.parseable,
      hostRouteSupported: trackB.diagnostics.host.supported,
      routeSegmentCount: trackB.diagnostics.host.segmentCount,
      routeSegmentLengths: [...trackB.diagnostics.host.segmentLengths],
      cidCandidatePosition: trackB.diagnostics.host.cidPosition,
      cidLength: trackB.diagnostics.host.cidLength,
      queryPresent: trackB.diagnostics.host.queryPresent,
      fragmentPresent: trackB.diagnostics.host.fragmentPresent,
      activeCandidateCount: trackB.diagnostics.activeCount,
      activeCardinalityMeasuredBeforeAgreement: true,
      nestedIdCount: trackB.diagnostics.nestedCount,
      canonicalCount: trackB.diagnostics.canonicalCount,
      hostPageWholeEquality: trackB.diagnostics.hostPageWholeEquality,
      pageInternalWholeEquality: trackB.diagnostics.pageInternalWholeEquality,
      pathnameEquality: trackB.diagnostics.pathnameEquality,
      pageCidEquality: trackB.diagnostics.pageCidEquality,
      rB1WholeRouteEquality: trackB.diagnostics.rB1WholeRouteEquality,
      rB2ProjectIdentityEquivalence: trackB.diagnostics.rB2,
      sameOrigin: trackB.diagnostics.sameOrigin,
      browserActiveCidEquality: trackB.diagnostics.activeCidPrimaryEquality,
      activeNestedCidEquality: trackB.diagnostics.activeNestedEquality,
      browserNestedCidEquality: trackB.diagnostics.primaryNestedEquality,
      canonicalBrowserWholeEquality:
        trackB.diagnostics.canonicalBrowserEquality,
      canonicalPageWholeEquality: trackB.diagnostics.canonicalPageEquality,
      canonicalBrowserCidEquality:
        trackB.diagnostics.canonicalPrimaryCidEquality,
      canonicalActiveCidEquality:
        trackB.diagnostics.canonicalActiveCidEquality,
      canonicalNestedCidEquality:
        trackB.diagnostics.canonicalNestedCidEquality,
      canonicalActiveWholeEqualityDiagnostic:
        trackB.diagnostics.canonicalActiveWholeRouteEquality,
    },
    combinedRuntimeAccepted: trackA.accepted && trackB.accepted,
    sourceTypeProjectResolved: trackA.accepted && trackB.accepted,
    groundTruth: gt,
    casePass,
    diagnostics: {
      documentReadyState:
        snapshot?.diagnostics?.documentReadyState ?? "SYNTHETIC",
      mainCount: Number(snapshot?.diagnostics?.mainCount ?? 0),
      navElementCount: Number(snapshot?.diagnostics?.navElementCount ?? 0),
      navAnchorCount: Number(snapshot?.diagnostics?.navAnchorCount ?? 0),
      globalNestedIdMetadataCount: Number(
        snapshot?.diagnostics?.globalNestedIdMetadataCount ?? 0,
      ),
      broadProjectTestIdCount: Number(
        snapshot?.diagnostics?.broadProjectTestIdCount ?? 0,
      ),
      broadProjectAriaLabelCount: Number(
        snapshot?.diagnostics?.broadProjectAriaLabelCount ?? 0,
      ),
    },
  });

  try {
    if (input === null || typeof input !== "object") {
      return safeError("HARNESS_INPUT_ERROR");
    }
    const synthetic =
      input.syntheticSnapshot !== null &&
      typeof input.syntheticSnapshot === "object";
    const snapshot = synthetic ? input.syntheticSnapshot : captureLiveSnapshot();
    if (!synthetic && snapshot.fixtureAliasMatched !== true) {
      return safeError("FIXTURE_BINDING_ERROR");
    }

    const host = parseProjectRoute(snapshot?.browserHostUrl);
    const shared = evaluateSharedActive(snapshot, host);
    const trackA = evaluateTrackA(snapshot, host, shared);
    const trackB = evaluateTrackB(snapshot, host, shared);
    const combinedRuntimeAccepted = trackA.accepted && trackB.accepted;

    if (input.validationKind === "STANDARD_NEGATIVE") {
      const standardInputValid = input?.expected?.sourceType === "Standard";
      if (!standardInputValid) return safeError("GROUND_TRUTH_INPUT_ERROR");
      const negativePass = !combinedRuntimeAccepted && !trackA.accepted;
      return summarize(
        snapshot,
        trackA,
        trackB,
        {
          inputValid: true,
          sourceTypeExact: negativePass,
          projectNameExact: null,
          projectCidExact: null,
          expectedProjectNameLength: null,
          expectedProjectCidLength: null,
          resolvedProjectNameLength: null,
          resolvedProjectCidLength: null,
        },
        negativePass,
      );
    }

    const expected = input.expected;
    if (
      expected === null ||
      typeof expected !== "object" ||
      !isNonEmptyString(expected.sourceType) ||
      !isNonEmptyString(expected.projectName) ||
      !isNonEmptyString(expected.projectCid)
    ) {
      return safeError("GROUND_TRUTH_INPUT_ERROR");
    }

    const sourceTypeExact =
      combinedRuntimeAccepted && trackA.resolvedSourceType === expected.sourceType;
    const projectNameExact =
      trackA.accepted && trackA.resolvedProjectName === expected.projectName;
    const projectCidExact =
      trackB.accepted && trackB.resolvedCid === expected.projectCid;
    const casePass =
      combinedRuntimeAccepted &&
      sourceTypeExact &&
      projectNameExact &&
      projectCidExact;
    return summarize(
      snapshot,
      trackA,
      trackB,
      {
        inputValid: true,
        sourceTypeExact,
        projectNameExact,
        projectCidExact,
        expectedProjectNameLength: expected.projectName.length,
        expectedProjectCidLength: expected.projectCid.length,
        resolvedProjectNameLength:
          typeof trackA.resolvedProjectName === "string"
            ? trackA.resolvedProjectName.length
            : null,
        resolvedProjectCidLength:
          typeof trackB.resolvedCid === "string"
            ? trackB.resolvedCid.length
            : null,
      },
      casePass,
    );
  } catch {
    return safeError("HARNESS_INTERNAL_ERROR");
  }
}
