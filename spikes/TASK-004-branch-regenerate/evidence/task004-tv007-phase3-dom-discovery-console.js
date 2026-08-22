/*
 * TASK-004 / TV-007 Phase 3 Manual DOM Discovery helper
 * Version: phase3-discovery-v1
 *
 * PURPOSE
 * - Observe the live ChatGPT DOM after candidate-independent Ground Truth is frozen.
 * - Capture DOM facts for Regenerate / Branch Switch / User Edit states.
 * - Compare captures structurally without producing PREFIX_MATCH / PREFIX_MISMATCH.
 *
 * NON-GOALS
 * - No Ground Truth lookup.
 * - No expected-matrix lookup.
 * - No persisted Branch identity.
 * - No Production parser / Sync Hash implementation.
 * - No automatic TV-007 verdict.
 *
 * PRIVACY / EVIDENCE SAFETY
 * - data-message-id and data-turn-id are fingerprinted in memory.
 * - Raw runtime identifier values are intentionally not returned by capture/export.
 *
 * USAGE
 * 1) Paste this whole file once into the DevTools Console for a qualified fixture.
 * 2) Run: TASK004_TV007.status()
 * 3) Capture a visible state, e.g.:
 *      TASK004_TV007.capture("RS_BASELINE")
 * 4) Perform one manual UI operation, wait until the visible UI settles, then capture again:
 *      TASK004_TV007.capture("RS_REGENERATED")
 * 5) Compare DOM facts only:
 *      TASK004_TV007.diff("RS_BASELINE", "RS_REGENERATED")
 * 6) Export when done:
 *      copy(TASK004_TV007.exportJson())
 */

(() => {
  "use strict";

  const VERSION = "task004-tv007-phase3-discovery-v1";
  const TURN_SELECTOR = 'section[data-testid^="conversation-turn-"]';
  const AUTHOR_SELECTOR = "[data-message-author-role]";

  const state = {
    version: VERSION,
    installedAt: new Date().toISOString(),
    captures: new Map(),
    nodeTokens: new WeakMap(),
    nextNodeToken: 1,
  };

  function tokenFor(node) {
    if (!(node instanceof Node)) return null;
    if (!state.nodeTokens.has(node)) {
      state.nodeTokens.set(node, `N${state.nextNodeToken++}`);
    }
    return state.nodeTokens.get(node);
  }

  function fnv1a32(value) {
    const text = String(value ?? "");
    let hash = 0x811c9dc5;
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, "0");
  }

  function fingerprint(value) {
    const text = String(value ?? "");
    if (!text) return null;
    return `fp:${fnv1a32(text)}/len:${text.length}`;
  }

  function normalizeText(value) {
    return String(value ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .trim();
  }

  function textSummary(node, limit = 240) {
    if (!(node instanceof Element)) {
      return {
        length: 0,
        fingerprint: null,
        preview: "",
      };
    }
    const text = normalizeText(node.innerText ?? "");
    return {
      length: text.length,
      fingerprint: fingerprint(text),
      preview: text.length > limit ? `${text.slice(0, limit)}…` : text,
    };
  }

  function rootMost(nodes) {
    return nodes.filter(
      (candidate) =>
        !nodes.some(
          (other) => other !== candidate && other.contains(candidate),
        ),
    );
  }

  function allSelfAndDescendants(root, selector) {
    const items = [];
    if (root instanceof Element && root.matches(selector)) items.push(root);
    if (root instanceof Element) items.push(...root.querySelectorAll(selector));
    return items;
  }

  function hiddenAncestor(node) {
    if (!(node instanceof Element)) return null;
    return node.closest('[hidden], [aria-hidden="true"]');
  }

  function renderedState(node) {
    if (!(node instanceof Element)) {
      return {
        connected: false,
        rendered: false,
        reason: "NOT_ELEMENT",
      };
    }

    if (!node.isConnected) {
      return {
        connected: false,
        rendered: false,
        reason: "DISCONNECTED",
      };
    }

    const hidden = hiddenAncestor(node);
    if (hidden) {
      return {
        connected: true,
        rendered: false,
        reason: hidden.hasAttribute("hidden")
          ? "HIDDEN_ANCESTOR"
          : "ARIA_HIDDEN_ANCESTOR",
      };
    }

    const style = getComputedStyle(node);
    if (style.display === "none") {
      return {
        connected: true,
        rendered: false,
        reason: "DISPLAY_NONE",
      };
    }
    if (style.visibility === "hidden" || style.visibility === "collapse") {
      return {
        connected: true,
        rendered: false,
        reason: "VISIBILITY_HIDDEN",
      };
    }

    const rects = node.getClientRects();
    if (rects.length === 0) {
      return {
        connected: true,
        rendered: false,
        reason: "NO_CLIENT_RECTS",
      };
    }

    return {
      connected: true,
      rendered: true,
      reason: "RENDERED",
    };
  }

  function elementDescriptor(node) {
    if (!(node instanceof Element)) return null;
    return {
      nodeToken: tokenFor(node),
      tag: node.tagName.toLowerCase(),
      id: node.id || null,
      classFingerprint: fingerprint(node.className || ""),
      testid: node.getAttribute("data-testid"),
      role: node.getAttribute("role"),
      ariaLabel: node.getAttribute("aria-label"),
      title: node.getAttribute("title"),
      ariaHidden: node.getAttribute("aria-hidden"),
      hidden: node.hasAttribute("hidden"),
      rendered: renderedState(node),
      text: textSummary(node),
    };
  }

  function runtimeIdentityInventory(section) {
    const messageIdNodes = allSelfAndDescendants(section, "[data-message-id]");
    const turnIdNodes = allSelfAndDescendants(section, "[data-turn-id]");

    return {
      messageIdCandidateCount: messageIdNodes.length,
      messageIdCandidates: messageIdNodes.map((node) => ({
        nodeToken: tokenFor(node),
        valueFingerprint: fingerprint(node.getAttribute("data-message-id")),
      })),
      turnIdCandidateCount: turnIdNodes.length,
      turnIdCandidates: turnIdNodes.map((node) => ({
        nodeToken: tokenFor(node),
        valueFingerprint: fingerprint(node.getAttribute("data-turn-id")),
      })),
    };
  }

  function contentCandidateInventory(authorNode) {
    if (!(authorNode instanceof Element)) {
      return {
        markdownRawCount: 0,
        markdownRootMostCount: 0,
        markdownRootMost: [],
        plainRawCount: 0,
        plainRootMostCount: 0,
        plainRootMost: [],
        collapsibleContentCount: 0,
        collapsibleContents: [],
      };
    }

    const markdownRaw = [...authorNode.querySelectorAll(".markdown")];
    const markdownRootMost = rootMost(markdownRaw);
    const plainRaw = [...authorNode.querySelectorAll(".whitespace-pre-wrap")];
    const plainRootMost = rootMost(plainRaw);
    const collapsibleContents = [
      ...authorNode.querySelectorAll(
        '[data-testid="collapsible-user-message-content"]',
      ),
    ];

    return {
      markdownRawCount: markdownRaw.length,
      markdownRootMostCount: markdownRootMost.length,
      markdownRootMost: markdownRootMost.map(elementDescriptor),
      plainRawCount: plainRaw.length,
      plainRootMostCount: plainRootMost.length,
      plainRootMost: plainRootMost.map(elementDescriptor),
      collapsibleContentCount: collapsibleContents.length,
      collapsibleContents: collapsibleContents.map(elementDescriptor),
    };
  }

  function controlInventory(root) {
    if (!(root instanceof Element || root instanceof Document)) return [];
    const controls = [
      ...root.querySelectorAll(
        'button, [role="button"], input[type="button"], input[type="submit"]',
      ),
    ];

    return controls.map((control, index) => {
      const text = normalizeText(control.innerText ?? control.value ?? "");
      const ariaLabel = control.getAttribute("aria-label") ?? "";
      const title = control.getAttribute("title") ?? "";
      const testid = control.getAttribute("data-testid") ?? "";
      const combined = `${text} ${ariaLabel} ${title} ${testid}`.trim();
      const branchSignal =
        /(?:branch|response|regenerate|try again|previous|next)/i.test(combined) ||
        /^\s*\d+\s*\/\s*\d+\s*$/.test(text) ||
        /^\s*\d+\s+(?:of|\/)[ ]*\d+\s*$/i.test(text);

      return {
        index,
        nodeToken: tokenFor(control),
        tag: control.tagName.toLowerCase(),
        text,
        ariaLabel: ariaLabel || null,
        title: title || null,
        testid: testid || null,
        disabled:
          "disabled" in control ? Boolean(control.disabled) : null,
        ariaDisabled: control.getAttribute("aria-disabled"),
        rendered: renderedState(control),
        branchSignal,
      };
    });
  }

  function captureTurn(section, domIndex) {
    const testid = section.getAttribute("data-testid");
    const ordinalMatch = testid?.match(/^conversation-turn-(\d+)$/) ?? null;
    const ordinal = ordinalMatch ? Number(ordinalMatch[1]) : null;

    const authorNodes = [...section.querySelectorAll(AUTHOR_SELECTOR)];
    const authorRoleValues = authorNodes.map((node) =>
      node.getAttribute("data-message-author-role"),
    );
    const selectedAuthorNode = authorNodes.length === 1 ? authorNodes[0] : null;

    const sectionControls = controlInventory(section);

    return {
      domIndex,
      sectionNodeToken: tokenFor(section),
      testid,
      ordinal,
      rendered: renderedState(section),
      sectionText: textSummary(section),
      authorNodeCount: authorNodes.length,
      authorRoleValues,
      authorNodeToken: selectedAuthorNode ? tokenFor(selectedAuthorNode) : null,
      authorText: selectedAuthorNode ? textSummary(selectedAuthorNode) : null,
      runtimeIdentity: runtimeIdentityInventory(section),
      contentCandidates: contentCandidateInventory(selectedAuthorNode),
      controlCount: sectionControls.length,
      controls: sectionControls,
      branchSignalControls: sectionControls.filter((item) => item.branchSignal),
    };
  }

  function snapshot(label) {
    if (typeof label !== "string" || label.trim() === "") {
      throw new Error("capture label must be a non-empty string");
    }

    const sections = [...document.querySelectorAll(TURN_SELECTOR)];
    const turns = sections.map(captureTurn);
    const ordinals = turns.map((turn) => turn.ordinal);
    const safeOrdinals = ordinals.filter(Number.isSafeInteger);
    const strictAscending = safeOrdinals.every(
      (value, index) => index === 0 || value > safeOrdinals[index - 1],
    );
    const duplicateOrdinals = safeOrdinals.filter(
      (value, index, arr) => arr.indexOf(value) !== index,
    );

    const docControls = controlInventory(document);
    const docBranchSignals = docControls.filter((item) => item.branchSignal);

    return {
      schemaVersion: VERSION,
      label: label.trim(),
      capturedAt: new Date().toISOString(),
      page: {
        visibilityState: document.visibilityState,
        hidden: document.hidden,
        readyState: document.readyState,
        urlPathFingerprint: fingerprint(location.pathname),
      },
      turnSelector: TURN_SELECTOR,
      mountedTurnCount: turns.length,
      ordinals,
      strictAscending,
      duplicateOrdinals: [...new Set(duplicateOrdinals)],
      turns,
      documentControlCount: docControls.length,
      documentBranchSignalCount: docBranchSignals.length,
      documentBranchSignals: docBranchSignals,
    };
  }

  function conciseTurnRows(capture) {
    return capture.turns.map((turn) => {
      const messageIds = turn.runtimeIdentity.messageIdCandidates
        .map((item) => item.valueFingerprint)
        .filter(Boolean)
        .join(", ");
      const turnIds = turn.runtimeIdentity.turnIdCandidates
        .map((item) => item.valueFingerprint)
        .filter(Boolean)
        .join(", ");
      const markdown = turn.contentCandidates.markdownRootMost
        .map((item) => item.text.fingerprint)
        .filter(Boolean)
        .join(", ");
      const plain = turn.contentCandidates.plainRootMost
        .map((item) => item.text.fingerprint)
        .filter(Boolean)
        .join(", ");

      return {
        domIndex: turn.domIndex,
        ordinal: turn.ordinal,
        role: turn.authorRoleValues.join("|") || "?",
        sectionNode: turn.sectionNodeToken,
        rendered: turn.rendered.rendered,
        messageIdFP: messageIds || null,
        turnIdFP: turnIds || null,
        markdownRootMost: turn.contentCandidates.markdownRootMostCount,
        markdownTextFP: markdown || null,
        plainRootMost: turn.contentCandidates.plainRootMostCount,
        plainTextFP: plain || null,
        branchControls: turn.branchSignalControls.length,
      };
    });
  }

  function capture(label) {
    const result = snapshot(label);
    state.captures.set(result.label, result);

    console.group(`TASK004 TV-007 capture: ${result.label}`);
    console.log({
      schemaVersion: result.schemaVersion,
      capturedAt: result.capturedAt,
      visibilityState: result.page.visibilityState,
      hidden: result.page.hidden,
      mountedTurnCount: result.mountedTurnCount,
      ordinals: result.ordinals,
      strictAscending: result.strictAscending,
      duplicateOrdinals: result.duplicateOrdinals,
      documentBranchSignalCount: result.documentBranchSignalCount,
    });
    console.table(conciseTurnRows(result));
    if (result.documentBranchSignals.length > 0) {
      console.log("Document-level branch/control candidates:");
      console.table(result.documentBranchSignals);
    }
    console.log(
      "Full capture is stored in-memory. Use TASK004_TV007.get(label) or exportJson().",
    );
    console.groupEnd();

    return result;
  }

  function firstCandidateTextFingerprint(turn, kind) {
    const list =
      kind === "markdown"
        ? turn.contentCandidates.markdownRootMost
        : turn.contentCandidates.plainRootMost;
    if (list.length !== 1) return null;
    return list[0].text.fingerprint;
  }

  function firstRuntimeFingerprint(turn, kind) {
    const list =
      kind === "message"
        ? turn.runtimeIdentity.messageIdCandidates
        : turn.runtimeIdentity.turnIdCandidates;
    if (list.length !== 1) return null;
    return list[0].valueFingerprint;
  }

  function turnDiff(before, after) {
    return {
      ordinal: before?.ordinal ?? after?.ordinal ?? null,
      beforeSectionNode: before?.sectionNodeToken ?? null,
      afterSectionNode: after?.sectionNodeToken ?? null,
      sectionNodeReplaced:
        before && after
          ? before.sectionNodeToken !== after.sectionNodeToken
          : null,
      beforeRole: before?.authorRoleValues?.join("|") ?? null,
      afterRole: after?.authorRoleValues?.join("|") ?? null,
      beforeMessageIdFP: before
        ? firstRuntimeFingerprint(before, "message")
        : null,
      afterMessageIdFP: after
        ? firstRuntimeFingerprint(after, "message")
        : null,
      messageIdChanged:
        before && after
          ? firstRuntimeFingerprint(before, "message") !==
            firstRuntimeFingerprint(after, "message")
          : null,
      beforeTurnIdFP: before ? firstRuntimeFingerprint(before, "turn") : null,
      afterTurnIdFP: after ? firstRuntimeFingerprint(after, "turn") : null,
      turnIdChanged:
        before && after
          ? firstRuntimeFingerprint(before, "turn") !==
            firstRuntimeFingerprint(after, "turn")
          : null,
      beforeMarkdownTextFP: before
        ? firstCandidateTextFingerprint(before, "markdown")
        : null,
      afterMarkdownTextFP: after
        ? firstCandidateTextFingerprint(after, "markdown")
        : null,
      markdownCandidateTextChanged:
        before && after
          ? firstCandidateTextFingerprint(before, "markdown") !==
            firstCandidateTextFingerprint(after, "markdown")
          : null,
      beforePlainTextFP: before
        ? firstCandidateTextFingerprint(before, "plain")
        : null,
      afterPlainTextFP: after
        ? firstCandidateTextFingerprint(after, "plain")
        : null,
      plainCandidateTextChanged:
        before && after
          ? firstCandidateTextFingerprint(before, "plain") !==
            firstCandidateTextFingerprint(after, "plain")
          : null,
      beforeBranchControlCount: before?.branchSignalControls?.length ?? null,
      afterBranchControlCount: after?.branchSignalControls?.length ?? null,
    };
  }

  function diff(labelA, labelB) {
    const a = state.captures.get(labelA);
    const b = state.captures.get(labelB);
    if (!a) throw new Error(`unknown capture label: ${labelA}`);
    if (!b) throw new Error(`unknown capture label: ${labelB}`);

    const aByOrdinal = new Map(a.turns.map((turn) => [turn.ordinal, turn]));
    const bByOrdinal = new Map(b.turns.map((turn) => [turn.ordinal, turn]));
    const ordinals = [...new Set([...aByOrdinal.keys(), ...bByOrdinal.keys()])]
      .filter((value) => value !== null)
      .sort((x, y) => x - y);

    const rows = ordinals.map((ordinal) =>
      turnDiff(aByOrdinal.get(ordinal), bByOrdinal.get(ordinal)),
    );

    const result = {
      schemaVersion: VERSION,
      from: labelA,
      to: labelB,
      comparedAt: new Date().toISOString(),
      mountedTurnCountChanged: a.mountedTurnCount !== b.mountedTurnCount,
      beforeMountedTurnCount: a.mountedTurnCount,
      afterMountedTurnCount: b.mountedTurnCount,
      ordinalSequenceChanged:
        JSON.stringify(a.ordinals) !== JSON.stringify(b.ordinals),
      beforeOrdinals: a.ordinals,
      afterOrdinals: b.ordinals,
      documentBranchSignalCountChanged:
        a.documentBranchSignalCount !== b.documentBranchSignalCount,
      rows,
      note:
        "DOM-fact diff only. This function intentionally does not classify PREFIX_MATCH/PREFIX_MISMATCH.",
    };

    console.group(`TASK004 TV-007 DOM diff: ${labelA} -> ${labelB}`);
    console.log({
      beforeMountedTurnCount: result.beforeMountedTurnCount,
      afterMountedTurnCount: result.afterMountedTurnCount,
      mountedTurnCountChanged: result.mountedTurnCountChanged,
      ordinalSequenceChanged: result.ordinalSequenceChanged,
      beforeOrdinals: result.beforeOrdinals,
      afterOrdinals: result.afterOrdinals,
      documentBranchSignalCountChanged:
        result.documentBranchSignalCountChanged,
    });
    console.table(rows);
    console.log(result.note);
    console.groupEnd();

    return result;
  }

  function get(label) {
    const value = state.captures.get(label);
    if (!value) throw new Error(`unknown capture label: ${label}`);
    return value;
  }

  function list() {
    const rows = [...state.captures.values()].map((capture) => ({
      label: capture.label,
      capturedAt: capture.capturedAt,
      mountedTurnCount: capture.mountedTurnCount,
      ordinals: capture.ordinals.join(","),
      documentBranchSignalCount: capture.documentBranchSignalCount,
    }));
    console.table(rows);
    return rows;
  }

  function exportObject() {
    return {
      schemaVersion: VERSION,
      exportedAt: new Date().toISOString(),
      note:
        "Phase 3 DOM Evidence only. No Ground Truth, expected matrix, prefix verdict, or raw runtime IDs are included by this helper.",
      captures: [...state.captures.values()],
    };
  }

  function exportJson(space = 2) {
    return JSON.stringify(exportObject(), null, space);
  }

  function status() {
    const result = {
      version: VERSION,
      installedAt: state.installedAt,
      pageVisibilityState: document.visibilityState,
      pageHidden: document.hidden,
      readyState: document.readyState,
      captureCount: state.captures.size,
      captureLabels: [...state.captures.keys()],
      turnSelector: TURN_SELECTOR,
    };
    console.log(result);
    return result;
  }

  function reset() {
    state.captures.clear();
    console.log("TASK004 TV-007 in-memory captures cleared.");
  }

  const api = Object.freeze({
    version: VERSION,
    status,
    capture,
    diff,
    get,
    list,
    exportObject,
    exportJson,
    reset,
  });

  Object.defineProperty(globalThis, "TASK004_TV007", {
    configurable: true,
    enumerable: false,
    writable: false,
    value: api,
  });

  console.log(
    `[TASK004 TV-007] Phase 3 discovery helper installed: ${VERSION}`,
  );
  console.log("Run TASK004_TV007.status() to verify installation.");
})();
