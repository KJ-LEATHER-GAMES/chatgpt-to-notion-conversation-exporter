import assert from "node:assert/strict";

import {
  PROJECT_STATE,
  compareProjectCidGroundTruth,
  evaluateProjectConversationIdSnapshot,
  evaluateProjectMetadataSnapshot,
  evaluateTask002TechnicalSpikeCase,
  parseObservedProjectConversationRouteV1,
} from "./task002-project-chat-poc.mjs";

const SYNTHETIC_ORIGIN = "https://poc.invalid";
const SYNTHETIC_PROJECT_NAME = "synthetic-project-name-alpha";
const SYNTHETIC_CID = "cid-synthetic";

function route(cid = SYNTHETIC_CID) {
  return `${SYNTHETIC_ORIGIN}/scope/group/chat/${cid}`;
}

function anchor(cid = SYNTHETIC_CID, projectName = SYNTHETIC_PROJECT_NAME) {
  return {
    absoluteHref: route(cid),
    rawHrefDirect: true,
    fragmentOnly: false,
    dataActivePresent: true,
    dataActiveValue: "",
    dataActiveEmptyValued: true,
    dataActiveNonEmptyValued: false,
    navigationNameValues: [projectName],
    nestedIdValues: [cid],
  };
}

function validSnapshot(overrides = {}) {
  const currentRoute = route();
  return {
    browserHostUrl: currentRoute,
    pageLocationHref: currentRoute,
    pageLocationPathname: new URL(currentRoute).pathname,
    pageDocumentUrl: currentRoute,
    currentRouteAnchors: [anchor()],
    headerGroups: [
      {
        name: SYNTHETIC_PROJECT_NAME,
        linkTexts: [SYNTHETIC_PROJECT_NAME],
        linkCount: 1,
      },
    ],
    canonicalHrefs: [currentRoute],
    diagnostics: {
      broadProjectTestIdCount: 0,
      broadProjectAriaLabelCount: 0,
      globalNestedIdMetadataCount: 1,
      unscopedProjectNameCount: 0,
    },
    ...overrides,
  };
}

function cloneSnapshot(snapshot = validSnapshot()) {
  return structuredClone(snapshot);
}

function expectedGroundTruth(overrides = {}) {
  return {
    sourceType: "Project",
    projectName: SYNTHETIC_PROJECT_NAME,
    projectCid: SYNTHETIC_CID,
    ...overrides,
  };
}

let assertionGroups = 0;

function group(name, callback) {
  callback();
  assertionGroups += 1;
  if (!name) {
    throw new Error("Self-test group name is required");
  }
}

function expectTrackAFail(snapshot, state = null) {
  const result = evaluateProjectMetadataSnapshot(snapshot);
  assert.equal(result.accepted, false);
  assert.equal(result.failClosed, true);
  assert.equal(result.resolvedProjectName, null);
  assert.equal(result.resolvedSourceType, null);
  if (state !== null) assert.equal(result.state, state);
  return result;
}

function expectTrackBFail(snapshot, state = null) {
  const result = evaluateProjectConversationIdSnapshot(snapshot);
  assert.equal(result.accepted, false);
  assert.equal(result.failClosed, true);
  assert.equal(result.resolvedCid, null);
  if (state !== null) assert.equal(result.state, state);
  return result;
}

group("valid Track A and Track B", () => {
  assert.equal(
    evaluateProjectMetadataSnapshot(validSnapshot()).state,
    PROJECT_STATE.RESOLVED_CURRENT,
  );
  assert.equal(
    evaluateProjectConversationIdSnapshot(validSnapshot()).state,
    PROJECT_STATE.RESOLVED_CURRENT,
  );
});

group("combined Runtime success", () => {
  const result = evaluateTask002TechnicalSpikeCase(
    validSnapshot(),
    expectedGroundTruth(),
  );
  assert.equal(result.combinedRuntimeAccepted, true);
});

group("all Ground Truth exact", () => {
  const result = evaluateTask002TechnicalSpikeCase(
    validSnapshot(),
    expectedGroundTruth(),
  );
  assert.equal(result.casePass, true);
  assert.equal(result.comparisons.sourceType.exactMatch, true);
  assert.equal(result.comparisons.projectName.exactMatch, true);
  assert.equal(result.comparisons.projectCid.exactMatch, true);
});

group("non-UUID and non-36-character CID accepted", () => {
  const arbitraryCid = "x";
  const arbitraryRoute = route(arbitraryCid);
  const snapshot = validSnapshot({
    browserHostUrl: arbitraryRoute,
    pageLocationHref: arbitraryRoute,
    pageLocationPathname: new URL(arbitraryRoute).pathname,
    pageDocumentUrl: arbitraryRoute,
    currentRouteAnchors: [anchor(arbitraryCid)],
    canonicalHrefs: [arbitraryRoute],
  });
  const parsed = parseObservedProjectConversationRouteV1(arbitraryRoute);
  assert.equal(parsed.supportedRoute, true);
  assert.equal(parsed.cidLength, 1);
  const result = evaluateTask002TechnicalSpikeCase(
    snapshot,
    expectedGroundTruth({ projectCid: arbitraryCid }),
  );
  assert.equal(result.casePass, true);
});

group("Track A current anchor 0", () => {
  expectTrackAFail(validSnapshot({ currentRouteAnchors: [] }), PROJECT_STATE.UNRESOLVED);
});

group("Track A current anchor 2+", () => {
  expectTrackAFail(
    validSnapshot({ currentRouteAnchors: [anchor(), anchor()] }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Track A fragment-only anchor", () => {
  const item = anchor();
  item.rawHrefDirect = false;
  item.fragmentOnly = true;
  item.absoluteHref = "#synthetic-fragment";
  expectTrackAFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Track A data-active missing", () => {
  const item = anchor();
  item.dataActivePresent = false;
  item.dataActiveEmptyValued = false;
  expectTrackAFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Track A non-empty data-active not silently accepted", () => {
  const item = anchor();
  item.dataActiveValue = "synthetic-unexpected";
  item.dataActiveEmptyValued = false;
  item.dataActiveNonEmptyValued = true;
  const result = expectTrackAFail(
    validSnapshot({ currentRouteAnchors: [item] }),
    PROJECT_STATE.INCONSISTENT,
  );
  assert.ok(
    result.violations.includes(
      "TRACK_A_DATA_ACTIVE_REPRESENTATION_UNEXPECTED",
    ),
  );
});

group("Navigation Name 0", () => {
  const item = anchor();
  item.navigationNameValues = [];
  expectTrackAFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Navigation Name 2+", () => {
  const item = anchor();
  item.navigationNameValues = [SYNTHETIC_PROJECT_NAME, SYNTHETIC_PROJECT_NAME];
  expectTrackAFail(
    validSnapshot({ currentRouteAnchors: [item] }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Navigation Name empty", () => {
  const item = anchor();
  item.navigationNameValues = [""];
  expectTrackAFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Header Name 0", () => {
  expectTrackAFail(validSnapshot({ headerGroups: [] }));
});

group("Header Name 2+", () => {
  const header = validSnapshot().headerGroups[0];
  expectTrackAFail(
    validSnapshot({ headerGroups: [header, structuredClone(header)] }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Header Name empty", () => {
  expectTrackAFail(
    validSnapshot({ headerGroups: [{ name: "", linkTexts: [""] }] }),
  );
});

group("Header Link 0", () => {
  expectTrackAFail(
    validSnapshot({
      headerGroups: [{ name: SYNTHETIC_PROJECT_NAME, linkTexts: [] }],
    }),
  );
});

group("Header Link 2+", () => {
  expectTrackAFail(
    validSnapshot({
      headerGroups: [
        {
          name: SYNTHETIC_PROJECT_NAME,
          linkTexts: [SYNTHETIC_PROJECT_NAME, SYNTHETIC_PROJECT_NAME],
        },
      ],
    }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Header Link empty", () => {
  expectTrackAFail(
    validSnapshot({
      headerGroups: [{ name: SYNTHETIC_PROJECT_NAME, linkTexts: [""] }],
    }),
  );
});

group("Navigation Header mismatch", () => {
  const item = anchor();
  item.navigationNameValues = ["synthetic-other-name"];
  expectTrackAFail(
    validSnapshot({ currentRouteAnchors: [item] }),
    PROJECT_STATE.INCONSISTENT,
  );
});

group("Header Name Header Link mismatch", () => {
  expectTrackAFail(
    validSnapshot({
      headerGroups: [
        { name: SYNTHETIC_PROJECT_NAME, linkTexts: ["synthetic-other-name"] },
      ],
    }),
    PROJECT_STATE.INCONSISTENT,
  );
});

group("unscoped Project Name alone", () => {
  const snapshot = validSnapshot({ currentRouteAnchors: [], headerGroups: [] });
  snapshot.diagnostics.unscopedProjectNameCount = 1;
  expectTrackAFail(snapshot);
});

group("broad Project markers alone", () => {
  const snapshot = validSnapshot({ currentRouteAnchors: [], headerGroups: [] });
  snapshot.diagnostics.broadProjectTestIdCount = 9;
  snapshot.diagnostics.broadProjectAriaLabelCount = 35;
  expectTrackAFail(snapshot);
});

group("Standard-Control-like snapshot not Project", () => {
  const standardRoute = `${SYNTHETIC_ORIGIN}/c/standard-synthetic`;
  const snapshot = validSnapshot({
    browserHostUrl: standardRoute,
    pageLocationHref: standardRoute,
    pageLocationPathname: new URL(standardRoute).pathname,
    pageDocumentUrl: standardRoute,
    currentRouteAnchors: [],
    headerGroups: [],
    canonicalHrefs: [standardRoute],
  });
  expectTrackAFail(snapshot);
});

group("Browser host URL missing", () => {
  expectTrackBFail(validSnapshot({ browserHostUrl: null }), PROJECT_STATE.UNRESOLVED);
});

group("Browser host URL malformed", () => {
  expectTrackBFail(
    validSnapshot({ browserHostUrl: "synthetic malformed" }),
    PROJECT_STATE.UNSUPPORTED_ROUTE,
  );
});

group("segment count not 4", () => {
  const unsupported = `${SYNTHETIC_ORIGIN}/one/two/three`;
  expectTrackBFail(
    validSnapshot({ browserHostUrl: unsupported }),
    PROJECT_STATE.UNSUPPORTED_ROUTE,
  );
});

group("extra segment", () => {
  const unsupported = `${route()}/extra`;
  expectTrackBFail(
    validSnapshot({ browserHostUrl: unsupported }),
    PROJECT_STATE.UNSUPPORTED_ROUTE,
  );
});

group("query present", () => {
  expectTrackBFail(
    validSnapshot({ browserHostUrl: `${route()}?synthetic=1` }),
    PROJECT_STATE.UNSUPPORTED_ROUTE,
  );
});

group("fragment present", () => {
  expectTrackBFail(
    validSnapshot({ browserHostUrl: `${route()}#synthetic` }),
    PROJECT_STATE.UNSUPPORTED_ROUTE,
  );
});

group("page location missing", () => {
  expectTrackBFail(validSnapshot({ pageLocationHref: null }));
});

group("page location malformed", () => {
  expectTrackBFail(validSnapshot({ pageLocationHref: "synthetic malformed" }));
});

group("browser page route mismatch", () => {
  const other = route("cid-other");
  expectTrackBFail(
    validSnapshot({
      pageLocationHref: other,
      pageLocationPathname: new URL(other).pathname,
      pageDocumentUrl: other,
    }),
    PROJECT_STATE.INCONSISTENT,
  );
});

group("location href document URL mismatch", () => {
  expectTrackBFail(validSnapshot({ pageDocumentUrl: route("cid-other") }));
});

group("pathname mismatch", () => {
  expectTrackBFail(validSnapshot({ pageLocationPathname: "/synthetic/mismatch" }));
});

group("Active anchor 0", () => {
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [] }));
});

group("Active anchor 2+", () => {
  expectTrackBFail(
    validSnapshot({ currentRouteAnchors: [anchor(), anchor()] }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Active anchor route mismatch", () => {
  const item = anchor("cid-other");
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Active anchor fragment-only", () => {
  const item = anchor();
  item.rawHrefDirect = false;
  item.fragmentOnly = true;
  item.absoluteHref = "#synthetic-fragment";
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Track B data-active missing", () => {
  const item = anchor();
  item.dataActivePresent = false;
  item.dataActiveEmptyValued = false;
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Nested ID 0", () => {
  const item = anchor();
  item.nestedIdValues = [];
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Nested ID 2+", () => {
  const item = anchor();
  item.nestedIdValues = [SYNTHETIC_CID, SYNTHETIC_CID];
  expectTrackBFail(
    validSnapshot({ currentRouteAnchors: [item] }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Nested ID empty", () => {
  const item = anchor();
  item.nestedIdValues = [""];
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Anchor nested mismatch", () => {
  const item = anchor();
  item.nestedIdValues = ["cid-other"];
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Primary active mismatch", () => {
  const item = anchor("cid-other");
  item.nestedIdValues = ["cid-other"];
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [item] }));
});

group("Canonical 0", () => {
  expectTrackBFail(validSnapshot({ canonicalHrefs: [] }));
});

group("Canonical 2+", () => {
  expectTrackBFail(
    validSnapshot({ canonicalHrefs: [route(), route()] }),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Canonical malformed", () => {
  expectTrackBFail(validSnapshot({ canonicalHrefs: ["synthetic malformed"] }));
});

group("Canonical unsupported route", () => {
  expectTrackBFail(
    validSnapshot({ canonicalHrefs: [`${SYNTHETIC_ORIGIN}/one/two`] }),
  );
});

group("Canonical Primary mismatch", () => {
  expectTrackBFail(validSnapshot({ canonicalHrefs: [route("cid-other")] }));
});

group("Primary page canonical only", () => {
  expectTrackBFail(validSnapshot({ currentRouteAnchors: [] }));
});

group("Active only while host Primary missing", () => {
  expectTrackBFail(
    validSnapshot({
      browserHostUrl: null,
      canonicalHrefs: [],
    }),
  );
});

group("Canonical only", () => {
  expectTrackBFail(
    validSnapshot({
      browserHostUrl: null,
      pageLocationHref: null,
      pageLocationPathname: null,
      pageDocumentUrl: null,
      currentRouteAnchors: [],
    }),
  );
});

group("Page URL is not host fallback", () => {
  const result = expectTrackBFail(validSnapshot({ browserHostUrl: null }));
  assert.ok(result.violations.includes("TRACK_B_HOST_URL_MISSING"));
});

group("global nested inventory is not fallback", () => {
  const item = anchor();
  item.nestedIdValues = [];
  const snapshot = validSnapshot({ currentRouteAnchors: [item] });
  snapshot.diagnostics.globalNestedIdMetadataCount = 99;
  expectTrackBFail(snapshot);
});

group("Track A PASS Track B FAIL", () => {
  const snapshot = validSnapshot({ canonicalHrefs: [] });
  const result = evaluateTask002TechnicalSpikeCase(
    snapshot,
    expectedGroundTruth(),
  );
  assert.equal(result.trackA.accepted, true);
  assert.equal(result.trackB.accepted, false);
  assert.equal(result.casePass, false);
});

group("Track A FAIL Track B PASS", () => {
  const snapshot = validSnapshot({ headerGroups: [] });
  const result = evaluateTask002TechnicalSpikeCase(
    snapshot,
    expectedGroundTruth(),
  );
  assert.equal(result.trackA.accepted, false);
  assert.equal(result.trackB.accepted, true);
  assert.equal(result.casePass, false);
});

group("runtime wrong Project Name cannot pass Ground Truth", () => {
  const wrongName = "synthetic-wrong-project-name";
  const item = anchor(SYNTHETIC_CID, wrongName);
  const snapshot = validSnapshot({
    currentRouteAnchors: [item],
    headerGroups: [{ name: wrongName, linkTexts: [wrongName] }],
  });
  const result = evaluateTask002TechnicalSpikeCase(
    snapshot,
    expectedGroundTruth(),
  );
  assert.equal(result.trackA.accepted, true);
  assert.equal(result.comparisons.projectName.exactMatch, false);
  assert.equal(result.casePass, false);
});

group("runtime wrong CID cannot pass Ground Truth", () => {
  const wrongCid = "cid-wrong";
  const wrongRoute = route(wrongCid);
  const snapshot = validSnapshot({
    browserHostUrl: wrongRoute,
    pageLocationHref: wrongRoute,
    pageLocationPathname: new URL(wrongRoute).pathname,
    pageDocumentUrl: wrongRoute,
    currentRouteAnchors: [anchor(wrongCid)],
    canonicalHrefs: [wrongRoute],
  });
  const result = evaluateTask002TechnicalSpikeCase(
    snapshot,
    expectedGroundTruth(),
  );
  assert.equal(result.trackB.accepted, true);
  assert.equal(result.comparisons.projectCid.exactMatch, false);
  assert.equal(result.casePass, false);
});

group("Source Type Ground Truth mismatch", () => {
  const result = evaluateTask002TechnicalSpikeCase(
    validSnapshot(),
    expectedGroundTruth({ sourceType: "Standard" }),
  );
  assert.equal(result.comparisons.sourceType.exactMatch, false);
  assert.equal(result.casePass, false);
});

group("invalid Ground Truth input", () => {
  assert.throws(
    () =>
      evaluateTask002TechnicalSpikeCase(
        validSnapshot(),
        expectedGroundTruth({ projectName: "" }),
      ),
    (error) => error?.code === "GROUND_TRUTH_INPUT_ERROR",
  );
});

group("candidate result cannot repair Ground Truth", () => {
  const expected = expectedGroundTruth({ projectCid: "cid-independent" });
  const frozenCopy = structuredClone(expected);
  const result = evaluateTask002TechnicalSpikeCase(validSnapshot(), expected);
  assert.equal(result.comparisons.projectCid.exactMatch, false);
  assert.deepEqual(expected, frozenCopy);
  assert.equal(result.casePass, false);
});

group("standalone Ground Truth comparator rejects empty input", () => {
  assert.throws(
    () => compareProjectCidGroundTruth(SYNTHETIC_CID, ""),
    (error) => error?.code === "GROUND_TRUTH_INPUT_ERROR",
  );
});

group("parser rejects query and fragment as ID sources", () => {
  assert.equal(
    parseObservedProjectConversationRouteV1(`${route()}?id=other`)
      .supportedRoute,
    false,
  );
  assert.equal(
    parseObservedProjectConversationRouteV1(`${route()}#other`)
      .supportedRoute,
    false,
  );
});

group("parser does not ignore extra segment", () => {
  assert.equal(
    parseObservedProjectConversationRouteV1(`${route()}/extra`)
      .supportedRoute,
    false,
  );
});

assert.ok(assertionGroups >= 60);
process.stdout.write(
  `TASK-002 Minimal PoC self-test: PASS (${assertionGroups} assertion groups)\n`,
);
