import assert from "node:assert/strict";

import {
  PROJECT_STATE,
  runTask002PrivacySafeHarnessV2,
} from "./task002-project-chat-poc-v2.mjs";

const SYNTHETIC_NAME = "Synthetic Project Alpha";
const SYNTHETIC_CID = "cid-alpha";
const SYNTHETIC_URL =
  "https://synthetic.invalid/a/browser-scope/b/cid-alpha";

function activeCandidate(overrides = {}) {
  return {
    insideNavigation: true,
    absoluteHref: SYNTHETIC_URL,
    rawHrefDirect: true,
    fragmentOnly: false,
    dataActivePresent: true,
    dataActiveEmptyValued: true,
    dataActiveNonEmptyValued: false,
    nestedIdValues: [SYNTHETIC_CID],
    rA1: {
      listItemAncestorCount: 2,
      localScopeCount: 1,
      directChildBranchCount: 2,
      anchorBearingBranchCount: 1,
      candidateBranches: [
        {
          value: SYNTHETIC_NAME,
          visible: true,
          containsActiveAnchor: false,
          descendantAnchorCount: 0,
          accessibleMaterialPresent: true,
          projectSemanticLocalMaterialPresent: true,
          textRootGroupCount: 1,
        },
      ],
    },
    ...overrides,
  };
}

function baseSnapshot(overrides = {}) {
  return {
    browserHostUrl: SYNTHETIC_URL,
    pageLocationHref: SYNTHETIC_URL,
    pageDocumentUrl: SYNTHETIC_URL,
    pageLocationPathname: "/a/browser-scope/b/cid-alpha",
    activeAnchors: [activeCandidate()],
    headerGroups: [{ name: SYNTHETIC_NAME, linkTexts: [SYNTHETIC_NAME] }],
    canonicalHrefs: [SYNTHETIC_URL],
    fixtureAliasMatched: true,
    diagnostics: {
      documentReadyState: "SYNTHETIC",
      mainCount: 1,
      navElementCount: 2,
      navAnchorCount: 3,
      globalNestedIdMetadataCount: 1,
      broadProjectTestIdCount: 0,
      broadProjectAriaLabelCount: 0,
    },
    ...overrides,
  };
}

function expected(overrides = {}) {
  return {
    sourceType: "Project",
    projectName: SYNTHETIC_NAME,
    projectCid: SYNTHETIC_CID,
    ...overrides,
  };
}

function evaluate(snapshot = baseSnapshot(), gt = expected()) {
  return runTask002PrivacySafeHarnessV2({
    syntheticSnapshot: snapshot,
    expected: gt,
    validationKind: "PROJECT",
  });
}

function clone(value) {
  return structuredClone(value);
}

function failClosedTrackA(result, state = null) {
  assert.equal(result.trackA.accepted, false);
  assert.equal(result.trackA.failClosed, true);
  if (state !== null) assert.equal(result.trackA.state, state);
  assert.equal(result.combinedRuntimeAccepted, false);
  assert.equal(result.casePass, false);
}

function failClosedTrackB(result, state = null) {
  assert.equal(result.trackB.accepted, false);
  assert.equal(result.trackB.failClosed, true);
  if (state !== null) assert.equal(result.trackB.state, state);
  assert.equal(result.combinedRuntimeAccepted, false);
  assert.equal(result.casePass, false);
}

function hasViolation(result, track, code) {
  assert.ok(result[track].violationCodes.includes(code), code);
}

let assertionGroups = 0;
function group(_name, callback) {
  assertionGroups += 1;
  callback();
}

group("valid v2 runtime and GT", () => {
  const result = evaluate();
  assert.equal(result.trackA.state, PROJECT_STATE.RESOLVED_CURRENT);
  assert.equal(result.trackB.state, PROJECT_STATE.RESOLVED_CURRENT);
  assert.equal(result.combinedRuntimeAccepted, true);
  assert.equal(result.groundTruth.sourceTypeExact, true);
  assert.equal(result.groundTruth.projectNameExact, true);
  assert.equal(result.groundTruth.projectCidExact, true);
  assert.equal(result.casePass, true);
});

group("arbitrary non-UUID non-36-character CID is accepted", () => {
  const cid = "x";
  const url = "https://synthetic.invalid/a/s/b/x";
  const snapshot = baseSnapshot({
    browserHostUrl: url,
    pageLocationHref: url,
    pageDocumentUrl: url,
    pageLocationPathname: "/a/s/b/x",
    activeAnchors: [
      activeCandidate({ absoluteHref: url, nestedIdValues: [cid] }),
    ],
    canonicalHrefs: [url],
  });
  const result = evaluate(snapshot, expected({ projectCid: cid }));
  assert.equal(result.trackB.accepted, true);
  assert.equal(result.trackB.routeSegmentLengths.at(-1), 1);
  assert.equal(result.casePass, true);
});

group("historical non-CID path mismatch passes R-B2", () => {
  const activeUrl = "https://synthetic.invalid/a/nav-scope/b/cid-alpha";
  const snapshot = baseSnapshot({
    activeAnchors: [activeCandidate({ absoluteHref: activeUrl })],
  });
  const result = evaluate(snapshot);
  assert.equal(result.trackB.rB1WholeRouteEquality, false);
  assert.equal(result.trackB.rB2ProjectIdentityEquivalence, true);
  assert.equal(result.trackB.accepted, true);
  assert.equal(result.casePass, true);
});

group("canonical and active whole routes may differ", () => {
  const activeUrl = "https://synthetic.invalid/a/other-scope/b/cid-alpha";
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [activeCandidate({ absoluteHref: activeUrl })],
    }),
  );
  assert.equal(result.trackB.canonicalActiveWholeEqualityDiagnostic, false);
  assert.equal(result.trackB.accepted, true);
});

group("safe summary contains no raw synthetic metadata", () => {
  const serialized = JSON.stringify(evaluate());
  assert.equal(serialized.includes(SYNTHETIC_URL), false);
  assert.equal(serialized.includes(SYNTHETIC_NAME), false);
  assert.equal(serialized.includes(SYNTHETIC_CID), false);
  assert.equal(evaluate().privacyBoundaryEnforced, true);
});

group("active zero", () => {
  const result = evaluate(baseSnapshot({ activeAnchors: [] }));
  failClosedTrackA(result, PROJECT_STATE.UNRESOLVED);
  failClosedTrackB(result, PROJECT_STATE.UNRESOLVED);
});

group("active two", () => {
  const result = evaluate(
    baseSnapshot({ activeAnchors: [activeCandidate(), activeCandidate()] }),
  );
  failClosedTrackA(result, PROJECT_STATE.AMBIGUOUS);
  failClosedTrackB(result, PROJECT_STATE.AMBIGUOUS);
});

group("active cardinality precedes CID agreement", () => {
  const otherUrl = "https://synthetic.invalid/a/other/b/cid-other";
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate(),
        activeCandidate({
          absoluteHref: otherUrl,
          nestedIdValues: ["cid-other"],
        }),
      ],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.AMBIGUOUS);
  assert.equal(result.trackB.activeCandidateCount, 2);
});

group("active outside navigation", () => {
  const result = evaluate(
    baseSnapshot({ activeAnchors: [activeCandidate({ insideNavigation: false })] }),
  );
  failClosedTrackA(result, PROJECT_STATE.INCONSISTENT);
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("active indirect", () => {
  const result = evaluate(
    baseSnapshot({ activeAnchors: [activeCandidate({ rawHrefDirect: false })] }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
  hasViolation(result, "trackB", "TRACK_B_ACTIVE_NOT_DIRECT");
});

group("active fragment-only", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({ rawHrefDirect: false, fragmentOnly: true }),
      ],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("data-active missing", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({
          dataActivePresent: false,
          dataActiveEmptyValued: false,
        }),
      ],
    }),
  );
  failClosedTrackA(result, PROJECT_STATE.UNRESOLVED);
  failClosedTrackB(result, PROJECT_STATE.UNRESOLVED);
});

group("unexpected non-empty data-active", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({
          dataActiveEmptyValued: false,
          dataActiveNonEmptyValued: true,
        }),
      ],
    }),
  );
  failClosedTrackA(result, PROJECT_STATE.INCONSISTENT);
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("R-A1 local scope zero", () => {
  const anchor = activeCandidate();
  anchor.rA1.localScopeCount = 0;
  failClosedTrackA(evaluate(baseSnapshot({ activeAnchors: [anchor] })));
});

group("R-A1 local scope ambiguous", () => {
  const anchor = activeCandidate();
  anchor.rA1.localScopeCount = 2;
  failClosedTrackA(
    evaluate(baseSnapshot({ activeAnchors: [anchor] })),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("R-A1 anchor-bearing branch zero", () => {
  const anchor = activeCandidate();
  anchor.rA1.anchorBearingBranchCount = 0;
  failClosedTrackA(evaluate(baseSnapshot({ activeAnchors: [anchor] })));
});

group("R-A1 anchor-bearing branch ambiguous", () => {
  const anchor = activeCandidate();
  anchor.rA1.anchorBearingBranchCount = 2;
  failClosedTrackA(
    evaluate(baseSnapshot({ activeAnchors: [anchor] })),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("R-A1 sibling candidate zero", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches = [];
  failClosedTrackA(evaluate(baseSnapshot({ activeAnchors: [anchor] })));
});

group("R-A1 sibling candidate two", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches.push(clone(anchor.rA1.candidateBranches[0]));
  failClosedTrackA(
    evaluate(baseSnapshot({ activeAnchors: [anchor] })),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("R-A1 cardinality precedes Header agreement", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches.push({
    ...clone(anchor.rA1.candidateBranches[0]),
    value: "Synthetic Other Name",
  });
  const result = evaluate(baseSnapshot({ activeAnchors: [anchor] }));
  failClosedTrackA(result, PROJECT_STATE.AMBIGUOUS);
  assert.equal(result.trackA.rA1CandidateCount, 2);
});

group("Navigation Name empty", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches[0].value = "";
  failClosedTrackA(evaluate(baseSnapshot({ activeAnchors: [anchor] })));
});

for (const [label, property, value] of [
  ["R-A1 invisible", "visible", false],
  ["R-A1 contains active", "containsActiveAnchor", true],
  ["R-A1 descendant anchor", "descendantAnchorCount", 1],
  ["R-A1 accessible missing", "accessibleMaterialPresent", false],
  ["R-A1 semantic missing", "projectSemanticLocalMaterialPresent", false],
  ["R-A1 text group ambiguous", "textRootGroupCount", 2],
]) {
  group(label, () => {
    const anchor = activeCandidate();
    anchor.rA1.candidateBranches[0][property] = value;
    const result = evaluate(baseSnapshot({ activeAnchors: [anchor] }));
    failClosedTrackA(result, PROJECT_STATE.INCONSISTENT);
    hasViolation(result, "trackA", "TRACK_A_R_A1_STRUCTURE_INVALID");
  });
}

group("Header group zero", () => {
  failClosedTrackA(evaluate(baseSnapshot({ headerGroups: [] })));
});

group("Header group two", () => {
  const header = { name: SYNTHETIC_NAME, linkTexts: [SYNTHETIC_NAME] };
  failClosedTrackA(
    evaluate(baseSnapshot({ headerGroups: [header, clone(header)] })),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Header Name empty", () => {
  failClosedTrackA(
    evaluate(baseSnapshot({ headerGroups: [{ name: "", linkTexts: [""] }] })),
  );
});

group("Header link zero", () => {
  failClosedTrackA(
    evaluate(
      baseSnapshot({
        headerGroups: [{ name: SYNTHETIC_NAME, linkTexts: [] }],
      }),
    ),
  );
});

group("Header link two", () => {
  failClosedTrackA(
    evaluate(
      baseSnapshot({
        headerGroups: [
          { name: SYNTHETIC_NAME, linkTexts: [SYNTHETIC_NAME, SYNTHETIC_NAME] },
        ],
      }),
    ),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("Header link empty", () => {
  failClosedTrackA(
    evaluate(
      baseSnapshot({
        headerGroups: [{ name: SYNTHETIC_NAME, linkTexts: [""] }],
      }),
    ),
  );
});

group("Navigation/Header mismatch is preserved", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches[0].value = "Synthetic Navigation Name";
  const result = evaluate(baseSnapshot({ activeAnchors: [anchor] }));
  failClosedTrackA(result, PROJECT_STATE.INCONSISTENT);
  assert.equal(result.trackA.rA1CandidateCount, 1);
  assert.equal(result.trackA.headerGroupCount, 1);
  hasViolation(result, "trackA", "TRACK_A_NAVIGATION_HEADER_MISMATCH");
});

group("Header/Link mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      headerGroups: [
        { name: SYNTHETIC_NAME, linkTexts: ["Synthetic Link Name"] },
      ],
    }),
  );
  failClosedTrackA(result, PROJECT_STATE.INCONSISTENT);
});

group("global Project markers cannot substitute", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches = [];
  const snapshot = baseSnapshot({ activeAnchors: [anchor] });
  snapshot.diagnostics.broadProjectTestIdCount = 9;
  snapshot.diagnostics.broadProjectAriaLabelCount = 9;
  failClosedTrackA(evaluate(snapshot));
});

group("global unscoped Project Name cannot substitute", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches = [];
  const snapshot = baseSnapshot({ activeAnchors: [anchor] });
  snapshot.globalUnscopedProjectNameValues = [SYNTHETIC_NAME];
  failClosedTrackA(evaluate(snapshot));
});

group("browser host missing", () => {
  const result = evaluate(baseSnapshot({ browserHostUrl: null }));
  failClosedTrackB(result);
  hasViolation(result, "trackB", "TRACK_B_HOST_URL_MISSING");
});

group("page URL cannot fallback for missing host", () => {
  const result = evaluate(baseSnapshot({ browserHostUrl: null }));
  assert.equal(result.trackB.hostPageWholeEquality, false);
  failClosedTrackB(result);
});

group("browser host malformed", () => {
  failClosedTrackB(
    evaluate(baseSnapshot({ browserHostUrl: "not a url" })),
    PROJECT_STATE.UNSUPPORTED_ROUTE,
  );
});

for (const [label, url] of [
  ["segment count not four", "https://synthetic.invalid/a/b/cid-alpha"],
  ["extra segment", "https://synthetic.invalid/a/b/c/cid-alpha/extra"],
  ["query unsupported", `${SYNTHETIC_URL}?q=synthetic`],
  ["fragment unsupported", `${SYNTHETIC_URL}#synthetic`],
]) {
  group(label, () => {
    const result = evaluate(
      baseSnapshot({
        browserHostUrl: url,
        pageLocationHref: url,
        pageDocumentUrl: url,
        pageLocationPathname: new URL(url).pathname,
        canonicalHrefs: [url],
      }),
    );
    failClosedTrackB(result, PROJECT_STATE.UNSUPPORTED_ROUTE);
  });
}

group("page URL missing", () => {
  const result = evaluate(baseSnapshot({ pageLocationHref: null }));
  failClosedTrackB(result);
  hasViolation(result, "trackB", "TRACK_B_PAGE_URL_MISSING");
});

group("page URL malformed", () => {
  failClosedTrackB(
    evaluate(baseSnapshot({ pageLocationHref: "not a url" })),
    PROJECT_STATE.INCONSISTENT,
  );
});

group("Browser/Page whole-route mismatch", () => {
  const page = "https://synthetic.invalid/a/page-scope/b/cid-alpha";
  const result = evaluate(
    baseSnapshot({
      pageLocationHref: page,
      pageDocumentUrl: page,
      pageLocationPathname: "/a/page-scope/b/cid-alpha",
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("location.href/document.URL mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      pageDocumentUrl: "https://synthetic.invalid/a/doc-scope/b/cid-alpha",
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("pathname inconsistency", () => {
  const result = evaluate(
    baseSnapshot({ pageLocationPathname: "/a/wrong/b/cid-alpha" }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("active route malformed", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [activeCandidate({ absoluteHref: "not a url" })],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.UNSUPPORTED_ROUTE);
});

group("active route unsupported", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({ absoluteHref: "https://synthetic.invalid/a/b/c" }),
      ],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.UNSUPPORTED_ROUTE);
});

group("active origin mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({
          absoluteHref: "https://other.invalid/a/browser-scope/b/cid-alpha",
        }),
      ],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("Active/Browser CID mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({
          absoluteHref: "https://synthetic.invalid/a/nav/b/cid-other",
          nestedIdValues: ["cid-other"],
        }),
      ],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("active CID empty", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({ absoluteHref: "https://synthetic.invalid/a/b/c/" }),
      ],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.UNSUPPORTED_ROUTE);
});

group("nested zero", () => {
  failClosedTrackB(
    evaluate(
      baseSnapshot({ activeAnchors: [activeCandidate({ nestedIdValues: [] })] }),
    ),
  );
});

group("nested two", () => {
  failClosedTrackB(
    evaluate(
      baseSnapshot({
        activeAnchors: [
          activeCandidate({ nestedIdValues: [SYNTHETIC_CID, SYNTHETIC_CID] }),
        ],
      }),
    ),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("nested empty", () => {
  failClosedTrackB(
    evaluate(
      baseSnapshot({ activeAnchors: [activeCandidate({ nestedIdValues: [""] })] }),
    ),
  );
});

group("Active/Nested mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [activeCandidate({ nestedIdValues: ["cid-other"] })],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
});

group("global nested inventory cannot substitute", () => {
  const snapshot = baseSnapshot({
    activeAnchors: [activeCandidate({ nestedIdValues: [] })],
  });
  snapshot.diagnostics.globalNestedIdMetadataCount = 10;
  failClosedTrackB(evaluate(snapshot));
});

group("canonical zero", () => {
  failClosedTrackB(evaluate(baseSnapshot({ canonicalHrefs: [] })));
});

group("canonical two", () => {
  failClosedTrackB(
    evaluate(baseSnapshot({ canonicalHrefs: [SYNTHETIC_URL, SYNTHETIC_URL] })),
    PROJECT_STATE.AMBIGUOUS,
  );
});

group("canonical malformed", () => {
  failClosedTrackB(
    evaluate(baseSnapshot({ canonicalHrefs: ["not a url"] })),
    PROJECT_STATE.INCONSISTENT,
  );
});

group("canonical unsupported", () => {
  failClosedTrackB(
    evaluate(
      baseSnapshot({ canonicalHrefs: ["https://synthetic.invalid/a/b/c"] }),
    ),
    PROJECT_STATE.INCONSISTENT,
  );
});

group("Canonical/Browser whole-route mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      canonicalHrefs: ["https://synthetic.invalid/a/canon/b/cid-alpha"],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
  hasViolation(result, "trackB", "TRACK_B_CANONICAL_BROWSER_ROUTE_MISMATCH");
});

group("Canonical/Page whole-route mismatch", () => {
  const canonical = "https://synthetic.invalid/a/canon/b/cid-alpha";
  const result = evaluate(baseSnapshot({ canonicalHrefs: [canonical] }));
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
  hasViolation(result, "trackB", "TRACK_B_CANONICAL_PAGE_ROUTE_MISMATCH");
});

group("Canonical/Browser CID mismatch", () => {
  const canonical = "https://synthetic.invalid/a/browser-scope/b/cid-other";
  const result = evaluate(baseSnapshot({ canonicalHrefs: [canonical] }));
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
  hasViolation(result, "trackB", "TRACK_B_CANONICAL_PRIMARY_CID_MISMATCH");
});

group("Canonical/Active CID mismatch", () => {
  const activeUrl = "https://synthetic.invalid/a/nav/b/cid-other";
  const canonical = "https://synthetic.invalid/a/browser-scope/b/cid-alpha";
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [
        activeCandidate({ absoluteHref: activeUrl, nestedIdValues: ["cid-other"] }),
      ],
      canonicalHrefs: [canonical],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
  hasViolation(result, "trackB", "TRACK_B_CANONICAL_ACTIVE_CID_MISMATCH");
});

group("Canonical/Nested CID mismatch", () => {
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [activeCandidate({ nestedIdValues: ["cid-other"] })],
    }),
  );
  failClosedTrackB(result, PROJECT_STATE.INCONSISTENT);
  hasViolation(result, "trackB", "TRACK_B_CANONICAL_NESTED_CID_MISMATCH");
});

group("canonical-only cannot pass", () => {
  failClosedTrackB(evaluate(baseSnapshot({ activeAnchors: [] })));
});

group("Track A PASS Track B FAIL", () => {
  const result = evaluate(baseSnapshot({ canonicalHrefs: [] }));
  assert.equal(result.trackA.accepted, true);
  assert.equal(result.trackB.accepted, false);
  assert.equal(result.casePass, false);
});

group("Track A FAIL Track B PASS", () => {
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches = [];
  const result = evaluate(baseSnapshot({ activeAnchors: [anchor] }));
  assert.equal(result.trackA.accepted, false);
  assert.equal(result.trackB.accepted, true);
  assert.equal(result.casePass, false);
});

group("runtime-consistent wrong Project Name fails GT", () => {
  const wrong = "Synthetic Runtime Name";
  const anchor = activeCandidate();
  anchor.rA1.candidateBranches[0].value = wrong;
  const result = evaluate(
    baseSnapshot({
      activeAnchors: [anchor],
      headerGroups: [{ name: wrong, linkTexts: [wrong] }],
    }),
  );
  assert.equal(result.trackA.accepted, true);
  assert.equal(result.groundTruth.projectNameExact, false);
  assert.equal(result.casePass, false);
});

group("runtime-consistent wrong CID fails GT", () => {
  const wrongCid = "cid-runtime-wrong";
  const wrongUrl = `https://synthetic.invalid/a/browser-scope/b/${wrongCid}`;
  const result = evaluate(
    baseSnapshot({
      browserHostUrl: wrongUrl,
      pageLocationHref: wrongUrl,
      pageDocumentUrl: wrongUrl,
      pageLocationPathname: `/a/browser-scope/b/${wrongCid}`,
      activeAnchors: [
        activeCandidate({
          absoluteHref: wrongUrl,
          nestedIdValues: [wrongCid],
        }),
      ],
      canonicalHrefs: [wrongUrl],
    }),
  );
  assert.equal(result.trackB.accepted, true);
  assert.equal(result.groundTruth.projectCidExact, false);
  assert.equal(result.casePass, false);
});

group("Source Type GT mismatch fails", () => {
  const result = evaluate(baseSnapshot(), expected({ sourceType: "Standard" }));
  assert.equal(result.trackA.accepted, true);
  assert.equal(result.groundTruth.sourceTypeExact, false);
  assert.equal(result.casePass, false);
});

for (const [label, gt] of [
  ["missing GT object", null],
  ["empty Source Type GT", expected({ sourceType: "" })],
  ["empty Project Name GT", expected({ projectName: "" })],
  ["empty Project CID GT", expected({ projectCid: "" })],
]) {
  group(label, () => {
    const result = runTask002PrivacySafeHarnessV2({
      syntheticSnapshot: baseSnapshot(),
      expected: gt,
      validationKind: "PROJECT",
    });
    assert.equal(result.safeErrorCode, "GROUND_TRUTH_INPUT_ERROR");
    assert.equal(result.casePass, false);
  });
}

group("candidate evaluation does not mutate Ground Truth", () => {
  const gt = expected();
  const before = clone(gt);
  evaluate(baseSnapshot(), gt);
  assert.deepEqual(gt, before);
});

group("Standard-Control-like structure is negative", () => {
  const snapshot = baseSnapshot({ activeAnchors: [], headerGroups: [] });
  snapshot.diagnostics.broadProjectTestIdCount = 4;
  snapshot.diagnostics.broadProjectAriaLabelCount = 4;
  const result = runTask002PrivacySafeHarnessV2({
    syntheticSnapshot: snapshot,
    expected: { sourceType: "Standard" },
    validationKind: "STANDARD_NEGATIVE",
  });
  assert.equal(result.trackA.accepted, false);
  assert.equal(result.sourceTypeProjectResolved, false);
  assert.equal(result.casePass, true);
});

group("invalid Standard negative GT is input error", () => {
  const result = runTask002PrivacySafeHarnessV2({
    syntheticSnapshot: baseSnapshot({ activeAnchors: [], headerGroups: [] }),
    expected: { sourceType: "Project" },
    validationKind: "STANDARD_NEGATIVE",
  });
  assert.equal(result.safeErrorCode, "GROUND_TRUTH_INPUT_ERROR");
});

assert.ok(assertionGroups >= 60);
process.stdout.write(
  `TASK-002 Minimal PoC v2 self-test: PASS (${assertionGroups} assertion groups)\n`,
);
