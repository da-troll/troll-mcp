#!/usr/bin/env node
/**
 * Live-contract test for the agent endpoint (HIVE-275).
 *
 * The agent_query defect (HIVE-240) was invisible for 8+ days because nothing
 * exercised the route: the generated types said one thing, the deployed
 * worker + function said another. This test probes the LIVE deployment and
 * fails when the route or the body-field contract drifts again.
 *
 * All probes are token-free by design: none of them causes an LLM call on the
 * Trollspace side. A malformed body is rejected by the handler (400, ~250ms)
 * before the agent runs, vs ~3-5s and a gpt-5.4 call for a real prompt.
 *
 * Layers proven by one authenticated 400:
 *   - worker prefix routing (a 404 here = the route is gone again)
 *   - the auth layer (a 401 with a valid key = auth contract changed)
 *   - the handler's body contract (the 400 message names the expected field)
 *
 * NOTE: we assert on the error MESSAGE text, not just the status code. A 400
 * alone would false-pass if a future handler accepted a different field while
 * emitting a generic message; today the message names `prompt` explicitly,
 * which is what makes the probe discriminating. If this assertion starts
 * failing on message WORDING alone (still names prompt, phrased differently),
 * loosen the match — the load-bearing check is that the named field is still
 * `prompt`.
 *
 * Usage: TROLLSPACE_API_KEY=... node scripts/test-live-contract.mjs
 * Exit: 0 = live contract matches; 1 = drift detected (details on stdout).
 */

const BASE = "https://api.trollefsen.com";
const ROUTE = "/agent/chat";
const API_KEY = process.env.TROLLSPACE_API_KEY;

if (!API_KEY) {
  console.error("TROLLSPACE_API_KEY environment variable is required");
  process.exit(1);
}

async function probe(name, { auth, body }) {
  const headers = { "Content-Type": "application/json" };
  if (auth) headers.Authorization = `Bearer ${API_KEY}`;
  const res = await fetch(`${BASE}${ROUTE}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  return { name, status: res.status, text };
}

const failures = [];
function expect(result, wantStatus, wantSubstring) {
  const okStatus = result.status === wantStatus;
  const okText =
    wantSubstring === undefined || result.text.includes(wantSubstring);
  const pass = okStatus && okText;
  console.log(
    `${pass ? "PASS" : "FAIL"} ${result.name}: HTTP ${result.status}` +
      (wantSubstring ? ` (expect ${wantStatus} containing ${JSON.stringify(wantSubstring)})` : ` (expect ${wantStatus})`),
  );
  if (!pass) {
    failures.push(`${result.name}: got HTTP ${result.status} body ${result.text.slice(0, 300)}`);
  }
}

// 1. Route + handler contract: empty body must 400 with an error naming `prompt`.
//    404 here = worker routing regressed (the HIVE-240 failure shape).
expect(await probe("empty body", { auth: true, body: {} }), 400, "prompt");

// 2. Regression to the pre-fix contract: the old `message` field must NOT be
//    accepted — same 400 naming `prompt`. If this ever returns 200, the live
//    handler changed its contract and src/index.ts + openapi.yaml are stale.
expect(
  await probe("legacy message field", { auth: true, body: { message: "x" } }),
  400,
  "prompt",
);

// 3. Auth layer + routing discrimination: unauthenticated must 401 (routed,
//    rejected by auth) — NOT 404 (would mean the route itself is gone).
expect(await probe("unauthenticated", { auth: false, body: {} }), 401);

if (failures.length) {
  console.log(`\nLIVE CONTRACT DRIFT (${failures.length}):`);
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log("\nLive agent contract matches.");
