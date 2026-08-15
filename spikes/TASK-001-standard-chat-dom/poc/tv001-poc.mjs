/**
 * TASK-001 / TV-001 Phase 0 spike only.
 *
 * This module is intentionally not a Production Source Adapter. The exported
 * browser capture function is self-contained so it can be serialized into the
 * currently authenticated ChatGPT tab. Raw content and runtime identifiers are
 * returned only to the in-memory validation harness and must not be persisted.
 */

export const POC_VERSION = "tv001-minimal-poc-v3";

export function normalizeBoundaryTextV2(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
}

export function filterRootMostCandidates(candidates) {
  return candidates.filter(
    (candidate) =>
      !candidates.some(
        (other) => other !== candidate && other.contains(candidate),
      ),
  );
}

export function evaluateCollapsiblePlainCandidatesV2({
  markdownCandidateCount,
  plainCandidates,
  scopedVisibleText,
}) {
  const rootMostPlainCandidates = filterRootMostCandidates(plainCandidates);

  if (markdownCandidateCount !== 0) {
    return {
      accepted: false,
      code: "USER_CONTENT_AMBIGUOUS",
      rawPlainCandidateCount: plainCandidates.length,
      rootMostPlainCandidateCount: rootMostPlainCandidates.length,
      boundaryTextMatches: null,
    };
  }

  if (rootMostPlainCandidates.length !== 1) {
    return {
      accepted: false,
      code: "USER_COLLAPSIBLE_PLAIN_ROOT_CARDINALITY",
      rawPlainCandidateCount: plainCandidates.length,
      rootMostPlainCandidateCount: rootMostPlainCandidates.length,
      boundaryTextMatches: null,
    };
  }

  const selectedCandidate = rootMostPlainCandidates[0];
  const boundaryTextMatches =
    normalizeBoundaryTextV2(selectedCandidate.innerText) ===
    normalizeBoundaryTextV2(scopedVisibleText);

  if (!boundaryTextMatches) {
    return {
      accepted: false,
      code: "USER_COLLAPSIBLE_PLAIN_BOUNDARY_MISMATCH",
      rawPlainCandidateCount: plainCandidates.length,
      rootMostPlainCandidateCount: 1,
      boundaryTextMatches: false,
    };
  }

  return {
    accepted: true,
    code: null,
    selectedCandidate,
    rawPlainCandidateCount: plainCandidates.length,
    rootMostPlainCandidateCount: 1,
    boundaryTextMatches: true,
  };
}

export function classifyUserContentCandidatesV2({
  collapsible,
  markdownCandidates,
  plainCandidates,
  scopedVisibleText = "",
}) {
  if (collapsible) {
    if (markdownCandidates.length === 1 && plainCandidates.length === 0) {
      return {
        accepted: true,
        code: null,
        selectedCandidate: markdownCandidates[0],
        contentShape: "user-collapsible-markdown",
      };
    }

    const plainResult = evaluateCollapsiblePlainCandidatesV2({
      markdownCandidateCount: markdownCandidates.length,
      plainCandidates,
      scopedVisibleText,
    });
    return {
      ...plainResult,
      contentShape: plainResult.accepted
        ? "user-collapsible-plain"
        : null,
    };
  }

  if (markdownCandidates.length === 0 && plainCandidates.length === 1) {
    return {
      accepted: true,
      code: null,
      selectedCandidate: plainCandidates[0],
      contentShape: "user-short-plain",
    };
  }

  return {
    accepted: false,
    code: "USER_CONTENT_UNKNOWN",
    contentShape: null,
  };
}

export function evaluateAssistantContentCandidatesV3({
  markdownCandidates,
  authorVisibleText,
  turnLevelOperationGroups = [],
}) {
  const rootMostMarkdownCandidates =
    filterRootMostCandidates(markdownCandidates);
  const resultBase = {
    rawMarkdownCandidateCount: markdownCandidates.length,
    rootMostMarkdownCandidateCount: rootMostMarkdownCandidates.length,
    nestedMarkdownCandidateCount:
      markdownCandidates.length - rootMostMarkdownCandidates.length,
  };

  if (rootMostMarkdownCandidates.length !== 1) {
    return {
      ...resultBase,
      accepted: false,
      code: "ASSISTANT_CONTENT_CARDINALITY",
      boundaryTextMatches: null,
      contentContainsTurnGroup: null,
    };
  }

  const selectedCandidate = rootMostMarkdownCandidates[0];
  const boundaryTextMatches =
    normalizeBoundaryTextV2(selectedCandidate.innerText) ===
    normalizeBoundaryTextV2(authorVisibleText);

  if (!boundaryTextMatches) {
    return {
      ...resultBase,
      accepted: false,
      code: "ASSISTANT_CONTENT_BOUNDARY_MISMATCH",
      selectedCandidate,
      boundaryTextMatches: false,
      contentContainsTurnGroup: null,
    };
  }

  const contentContainsTurnGroup = turnLevelOperationGroups.some((group) =>
    selectedCandidate.contains(group),
  );
  if (contentContainsTurnGroup) {
    return {
      ...resultBase,
      accepted: false,
      code: "CONTENT_CONTAINS_TURN_GROUP",
      selectedCandidate,
      boundaryTextMatches: true,
      contentContainsTurnGroup: true,
    };
  }

  return {
    ...resultBase,
    accepted: true,
    code: null,
    selectedCandidate,
    boundaryTextMatches: true,
    contentContainsTurnGroup: false,
  };
}

export class GroundTruthInputError extends Error {
  constructor(reasons) {
    super(`Invalid Ground Truth input: ${reasons.join(", ")}`);
    this.name = "GroundTruthInputError";
    this.code = "GROUND_TRUTH_INPUT_ERROR";
    this.reasons = reasons;
  }
}

/**
 * Capture only currently mounted M-02 turn sections.
 *
 * This function must not reference module-scope values because the browser
 * harness serializes the function body into the page execution context.
 */
export function captureMountedTurns() {
  const violation = (code, domIndex, ordinal = null) => ({
    code,
    domIndex,
    ordinal,
  });

  const allMatchingSelfAndDescendants = (root, selector) => {
    const matches = [];
    if (root.matches(selector)) {
      matches.push(root);
    }
    matches.push(...root.querySelectorAll(selector));
    return matches;
  };

  // captureMountedTurns is serialized into the page, so these two v2 helpers
  // intentionally remain self-contained here as well as being exported above
  // for DOM-independent contract tests.
  const normalizeBoundaryText = (value) =>
    String(value ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
  const filterRootMost = (candidates) =>
    candidates.filter(
      (candidate) =>
        !candidates.some(
          (other) => other !== candidate && other.contains(candidate),
        ),
    );

  const structuralSummary = (root) => ({
    paragraph: root.querySelectorAll("p").length,
    bulletList: root.querySelectorAll("ul").length,
    numberedList: root.querySelectorAll("ol").length,
    quote: root.querySelectorAll("blockquote").length,
    fencedCode: root.querySelectorAll("pre").length,
    link: root.querySelectorAll("a").length,
    bold: root.querySelectorAll("strong").length,
    italic: root.querySelectorAll("em").length,
    inlineCode: [...root.querySelectorAll("code")].filter(
      (node) => node.closest("pre") === null,
    ).length,
  });

  const sections = [
    ...document.querySelectorAll(
      'section[data-testid^="conversation-turn-"]',
    ),
  ];
  const messages = [];
  const violations = [];
  const snapshotOrdinals = [];
  const runtimeIdsInSnapshot = new Map();
  const ordinalsInSnapshot = new Map();

  sections.forEach((section, domIndex) => {
    const testId = section.getAttribute("data-testid");
    const ordinalMatch = testId?.match(/^conversation-turn-(\d+)$/) ?? null;
    const ordinal = ordinalMatch ? Number(ordinalMatch[1]) : null;
    const validOrdinal =
      Number.isSafeInteger(ordinal) && ordinal !== null && ordinal > 0;

    if (!validOrdinal) {
      violations.push(violation("ORDERING_SOURCE_INVALID", domIndex));
    } else {
      snapshotOrdinals.push(ordinal);
      if (ordinalsInSnapshot.has(ordinal)) {
        violations.push(
          violation("ORDINAL_DUPLICATE_IN_SNAPSHOT", domIndex, ordinal),
        );
      } else {
        ordinalsInSnapshot.set(ordinal, domIndex);
      }
    }

    const authorNodes = [
      ...section.querySelectorAll("[data-message-author-role]"),
    ];
    if (authorNodes.length !== 1) {
      violations.push(
        violation("AUTHOR_ROLE_NODE_CARDINALITY", domIndex, ordinal),
      );
      return;
    }

    const authorNode = authorNodes[0];
    const role = authorNode.getAttribute("data-message-author-role");
    if (role !== "user" && role !== "assistant") {
      violations.push(violation("ROLE_INVALID", domIndex, ordinal));
      return;
    }

    const messageIdNodes = allMatchingSelfAndDescendants(
      section,
      "[data-message-id]",
    );
    const turnIdNodes = allMatchingSelfAndDescendants(
      section,
      "[data-turn-id]",
    );

    if (messageIdNodes.length !== 1) {
      violations.push(
        violation("RUNTIME_ID_CARDINALITY", domIndex, ordinal),
      );
      return;
    }
    if (turnIdNodes.length !== 1) {
      violations.push(
        violation("TURN_CROSS_CHECK_CARDINALITY", domIndex, ordinal),
      );
      return;
    }

    const runtimeId = messageIdNodes[0].getAttribute("data-message-id")?.trim();
    const turnId = turnIdNodes[0].getAttribute("data-turn-id")?.trim();
    if (!runtimeId) {
      violations.push(violation("RUNTIME_ID_EMPTY", domIndex, ordinal));
      return;
    }
    if (!turnId) {
      violations.push(
        violation("TURN_CROSS_CHECK_EMPTY", domIndex, ordinal),
      );
      return;
    }

    const duplicateRuntimeId = runtimeIdsInSnapshot.get(runtimeId);
    if (duplicateRuntimeId) {
      violations.push(
        violation("RUNTIME_ID_DUPLICATE_IN_SNAPSHOT", domIndex, ordinal),
      );
    } else {
      runtimeIdsInSnapshot.set(runtimeId, { ordinal, turnId });
    }

    const turnGroups = [...section.querySelectorAll('[role="group"]')];
    let contentRoot = null;
    let contentShape = null;
    let userBoundary = null;
    let assistantBoundary = null;

    if (role === "user") {
      const collapsibleRoots = [
        ...authorNode.querySelectorAll(
          '[data-testid="collapsible-user-message-root"]',
        ),
      ];
      const collapsibleContents = [
        ...authorNode.querySelectorAll(
          '[data-testid="collapsible-user-message-content"]',
        ),
      ];
      const toggles = [
        ...authorNode.querySelectorAll(
          '[data-testid="collapsible-user-message-toggle"]',
        ),
      ];

      if (collapsibleContents.length === 1) {
        const collapsibleContent = collapsibleContents[0];
        const markdownCandidates = [
          ...collapsibleContent.querySelectorAll(".markdown"),
        ];
        const plainCandidates = [
          ...collapsibleContent.querySelectorAll(".whitespace-pre-wrap"),
        ];
        const rootMostPlainCandidates = filterRootMost(plainCandidates);
        let collapsiblePlainBoundaryTextMatches = null;
        const boundaryValid =
          collapsibleRoots.length === 1 &&
          toggles.length === 1 &&
          collapsibleRoots[0].contains(collapsibleContent) &&
          collapsibleRoots[0].contains(toggles[0]) &&
          !collapsibleContent.contains(toggles[0]);

        if (!boundaryValid) {
          violations.push(
            violation("USER_COLLAPSIBLE_BOUNDARY_INVALID", domIndex, ordinal),
          );
        }

        if (markdownCandidates.length === 1 && plainCandidates.length === 0) {
          contentRoot = markdownCandidates[0];
          contentShape = "user-collapsible-markdown";
        } else if (markdownCandidates.length === 0) {
          if (rootMostPlainCandidates.length !== 1) {
            violations.push(
              violation(
                "USER_COLLAPSIBLE_PLAIN_ROOT_CARDINALITY",
                domIndex,
                ordinal,
              ),
            );
          } else {
            const selectedPlainCandidate = rootMostPlainCandidates[0];
            const boundaryTextMatches =
              normalizeBoundaryText(selectedPlainCandidate.innerText) ===
              normalizeBoundaryText(collapsibleContent.innerText);
            collapsiblePlainBoundaryTextMatches = boundaryTextMatches;

            if (!boundaryTextMatches) {
              violations.push(
                violation(
                  "USER_COLLAPSIBLE_PLAIN_BOUNDARY_MISMATCH",
                  domIndex,
                  ordinal,
                ),
              );
            } else {
              contentRoot = selectedPlainCandidate;
              contentShape = "user-collapsible-plain";
            }
          }
        } else {
          violations.push(
            violation("USER_CONTENT_AMBIGUOUS", domIndex, ordinal),
          );
        }

        userBoundary = {
          collapsibleRootCount: collapsibleRoots.length,
          collapsibleContentCount: collapsibleContents.length,
          toggleCount: toggles.length,
          toggleOutsideContent:
            toggles.length === 1 && !collapsibleContent.contains(toggles[0]),
          rawPlainCandidateCount: plainCandidates.length,
          rootMostPlainCandidateCount: rootMostPlainCandidates.length,
          boundaryTextMatches: collapsiblePlainBoundaryTextMatches,
        };
      } else if (collapsibleContents.length === 0) {
        const markdownCandidates = [
          ...authorNode.querySelectorAll(".markdown"),
        ];
        const plainCandidates = [
          ...authorNode.querySelectorAll(".whitespace-pre-wrap"),
        ];
        const shortPlainValid =
          collapsibleRoots.length === 0 &&
          toggles.length === 0 &&
          markdownCandidates.length === 0 &&
          plainCandidates.length === 1;

        if (shortPlainValid) {
          contentRoot = plainCandidates[0];
          contentShape = "user-short-plain";
        } else {
          violations.push(
            violation("USER_CONTENT_UNKNOWN", domIndex, ordinal),
          );
        }

        userBoundary = {
          collapsibleRootCount: collapsibleRoots.length,
          collapsibleContentCount: 0,
          toggleCount: toggles.length,
          toggleOutsideContent: null,
        };
      } else {
        violations.push(
          violation("USER_COLLAPSIBLE_CONTENT_CARDINALITY", domIndex, ordinal),
        );
      }
    } else {
      const markdownCandidates = [
        ...authorNode.querySelectorAll(".markdown"),
      ];
      const rootMostMarkdownCandidates = filterRootMost(markdownCandidates);
      assistantBoundary = {
        rawMarkdownCandidateCount: markdownCandidates.length,
        rootMostMarkdownCandidateCount: rootMostMarkdownCandidates.length,
        nestedMarkdownCandidateCount:
          markdownCandidates.length - rootMostMarkdownCandidates.length,
        boundaryTextMatches: null,
      };

      if (rootMostMarkdownCandidates.length !== 1) {
        violations.push(
          violation("ASSISTANT_CONTENT_CARDINALITY", domIndex, ordinal),
        );
      } else {
        const selectedAssistantRoot = rootMostMarkdownCandidates[0];
        const boundaryTextMatches =
          normalizeBoundaryText(selectedAssistantRoot.innerText) ===
          normalizeBoundaryText(authorNode.innerText);
        assistantBoundary.boundaryTextMatches = boundaryTextMatches;

        if (!boundaryTextMatches) {
          violations.push(
            violation(
              "ASSISTANT_CONTENT_BOUNDARY_MISMATCH",
              domIndex,
              ordinal,
            ),
          );
        } else {
          contentRoot = selectedAssistantRoot;
          contentShape = "assistant-markdown";
        }
      }
    }

    if (!contentRoot || !contentShape || !validOrdinal) {
      return;
    }

    const contentContainsTurnGroup = turnGroups.some((group) =>
      contentRoot.contains(group),
    );
    if (contentContainsTurnGroup) {
      violations.push(
        violation("CONTENT_CONTAINS_TURN_GROUP", domIndex, ordinal),
      );
      if (role === "assistant") {
        return;
      }
    }

    const codeCopyButtons = [
      ...contentRoot.querySelectorAll('pre button[aria-label="Copy"]'),
    ];

    messages.push({
      runtimeId,
      turnId,
      ordinal,
      role,
      contentShape,
      contentText: contentRoot.innerText ?? "",
      contentContainsTurnGroup,
      authorContainsTurnGroup: turnGroups.some((group) =>
        authorNode.contains(group),
      ),
      turnGroupCount: turnGroups.length,
      userBoundary,
      assistantBoundary,
      structure: structuralSummary(contentRoot),
      codeCopyFinding: {
        count: codeCopyButtons.length,
        insideContentRoot: codeCopyButtons.every((button) =>
          contentRoot.contains(button),
        ),
        insidePre: codeCopyButtons.every((button) =>
          button.closest("pre") !== null,
        ),
        insideCodeElement: codeCopyButtons.some(
          (button) => button.closest("code") !== null,
        ),
      },
    });
  });

  const parsedOrdinalsInDomOrder = sections
    .map((section) => {
      const match = section
        .getAttribute("data-testid")
        ?.match(/^conversation-turn-(\d+)$/);
      return match ? Number(match[1]) : null;
    })
    .filter((ordinal) => ordinal !== null);
  const domOrderMatches = parsedOrdinalsInDomOrder.every(
    (ordinal, index) =>
      index === 0 || ordinal > parsedOrdinalsInDomOrder[index - 1],
  );
  if (!domOrderMatches) {
    violations.push(violation("DOM_ORDER_ORDINAL_MISMATCH", -1));
  }

  return {
    version: "tv001-minimal-poc-v3",
    mountedTurnCount: sections.length,
    messages,
    violations,
    snapshot: {
      ordinals: snapshotOrdinals,
      domOrderMatches,
      outerContainerUsed: false,
    },
  };
}

export function createAccumulator() {
  return {
    version: POC_VERSION,
    snapshots: 0,
    messagesByRuntimeId: new Map(),
    runtimeIdByTurnKey: new Map(),
    runtimeIdByOrdinal: new Map(),
    remountDedupCount: 0,
    violations: [],
  };
}

const runtimeSafeViolation = (code, ordinal = null) => ({ code, ordinal });

export function accumulateSnapshot(accumulator, capture) {
  accumulator.snapshots += 1;
  accumulator.violations.push(...capture.violations);

  for (const message of capture.messages) {
    const existing = accumulator.messagesByRuntimeId.get(message.runtimeId);
    if (existing) {
      const stable =
        existing.turnId === message.turnId &&
        existing.ordinal === message.ordinal &&
        existing.role === message.role;
      if (!stable) {
        accumulator.violations.push(
          runtimeSafeViolation(
            "RUNTIME_ID_CROSS_SCAN_CONFLICT",
            message.ordinal,
          ),
        );
      } else {
        accumulator.remountDedupCount += 1;
      }
      continue;
    }

    const turnKey = JSON.stringify([message.turnId, message.ordinal]);
    const runtimeIdForTurn = accumulator.runtimeIdByTurnKey.get(turnKey);
    if (runtimeIdForTurn && runtimeIdForTurn !== message.runtimeId) {
      accumulator.violations.push(
        runtimeSafeViolation("REMOUNT_RUNTIME_ID_CHANGED", message.ordinal),
      );
      continue;
    }

    const runtimeIdForOrdinal = accumulator.runtimeIdByOrdinal.get(
      message.ordinal,
    );
    if (runtimeIdForOrdinal && runtimeIdForOrdinal !== message.runtimeId) {
      accumulator.violations.push(
        runtimeSafeViolation("ORDINAL_IDENTITY_CONFLICT", message.ordinal),
      );
      continue;
    }

    accumulator.messagesByRuntimeId.set(message.runtimeId, message);
    accumulator.runtimeIdByTurnKey.set(turnKey, message.runtimeId);
    accumulator.runtimeIdByOrdinal.set(message.ordinal, message.runtimeId);
  }

  return accumulator;
}

export function orderAccumulatedMessages(accumulator) {
  return [...accumulator.messagesByRuntimeId.values()].sort(
    (left, right) => left.ordinal - right.ordinal,
  );
}

export function isRuntimeOrderingValid(accumulator) {
  const orderingViolationCodes = new Set([
    "ORDERING_SOURCE_INVALID",
    "ORDINAL_DUPLICATE_IN_SNAPSHOT",
    "DOM_ORDER_ORDINAL_MISMATCH",
    "ORDINAL_IDENTITY_CONFLICT",
  ]);
  if (
    accumulator.violations.some((item) =>
      orderingViolationCodes.has(item.code),
    )
  ) {
    return false;
  }

  const orderedMessages = orderAccumulatedMessages(accumulator);
  return orderedMessages.every(
    (message, index) =>
      Number.isSafeInteger(message.ordinal) &&
      message.ordinal > 0 &&
      (index === 0 || message.ordinal > orderedMessages[index - 1].ordinal),
  );
}

const validateExpectedOrdinals = (groundTruth) => {
  if (groundTruth.expectedOrdinals == null) {
    return;
  }

  const expectedOrdinals = groundTruth.expectedOrdinals;
  const reasons = [];
  if (!Array.isArray(expectedOrdinals)) {
    reasons.push("expectedOrdinals must be an array");
  } else {
    if (expectedOrdinals.length !== groundTruth.expectedCount) {
      reasons.push("expectedOrdinals length must equal expectedCount");
    }
    if (
      expectedOrdinals.some(
        (ordinal) => !Number.isSafeInteger(ordinal) || ordinal <= 0,
      )
    ) {
      reasons.push("expectedOrdinals must contain positive safe integers");
    }
    if (new Set(expectedOrdinals).size !== expectedOrdinals.length) {
      reasons.push("expectedOrdinals must be unique");
    }
    if (
      expectedOrdinals.some(
        (ordinal, index) => index > 0 && ordinal <= expectedOrdinals[index - 1],
      )
    ) {
      reasons.push("expectedOrdinals must be strictly ascending");
    }
  }

  if (reasons.length > 0) {
    throw new GroundTruthInputError(reasons);
  }
};

export function compareGroundTruth(
  orderedMessages,
  groundTruth,
  { runtimeOrderingValid = false } = {},
) {
  validateExpectedOrdinals(groundTruth);

  const expectedRoles = groundTruth.expectedRoles ?? null;
  const expectedMarkers = groundTruth.expectedMarkers ?? null;
  const expectedOrdinals = groundTruth.expectedOrdinals ?? null;

  const roleSequenceMatches =
    expectedRoles === null
      ? null
      : orderedMessages.length === expectedRoles.length &&
        orderedMessages.every(
          (message, index) => message.role === expectedRoles[index],
        );
  const markerSequenceMatches =
    expectedMarkers === null
      ? null
      : orderedMessages.length === expectedMarkers.length &&
        orderedMessages.every((message, index) =>
          message.contentText.includes(expectedMarkers[index]),
        );
  const ordinalSequenceMatches =
    expectedOrdinals === null
      ? null
      : orderedMessages.length === expectedOrdinals.length &&
        orderedMessages.every(
          (message, index) => message.ordinal === expectedOrdinals[index],
        );

  const orderedOrdinalSequenceValid = orderedMessages.every(
    (message, index) =>
      Number.isSafeInteger(message.ordinal) &&
      message.ordinal > 0 &&
      (index === 0 || message.ordinal > orderedMessages[index - 1].ordinal),
  );

  return {
    expectedCount: groundTruth.expectedCount,
    capturedUnique: orderedMessages.length,
    countMatches: orderedMessages.length === groundTruth.expectedCount,
    roleSequenceMatches,
    markerSequenceMatches,
    ordinalSequenceMatches,
    runtimeOrderingValid:
      runtimeOrderingValid === true && orderedOrdinalSequenceValid,
    missingCount: Math.max(
      0,
      groundTruth.expectedCount - orderedMessages.length,
    ),
    unexpectedCount: Math.max(
      0,
      orderedMessages.length - groundTruth.expectedCount,
    ),
  };
}

export function countContentShapes(orderedMessages) {
  const result = {};
  for (const message of orderedMessages) {
    result[message.contentShape] = (result[message.contentShape] ?? 0) + 1;
  }
  return result;
}

export function summarizeAccumulator(accumulator, comparison = null) {
  const orderedMessages = orderAccumulatedMessages(accumulator);
  const violationCounts = {};
  for (const item of accumulator.violations) {
    violationCounts[item.code] = (violationCounts[item.code] ?? 0) + 1;
  }

  return {
    version: accumulator.version,
    snapshots: accumulator.snapshots,
    capturedUnique: orderedMessages.length,
    remountDedupCount: accumulator.remountDedupCount,
    roles: orderedMessages.map((message) => message.role),
    ordinals: orderedMessages.map((message) => message.ordinal),
    contentShapes: countContentShapes(orderedMessages),
    violationCount: accumulator.violations.length,
    violationCounts,
    comparison,
  };
}
