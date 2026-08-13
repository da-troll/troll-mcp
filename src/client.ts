import createClient from "openapi-fetch";
import type { paths } from "./types/api.js";

const API_KEY = process.env.TROLLSPACE_API_KEY;
if (!API_KEY) {
  console.error("TROLLSPACE_API_KEY environment variable is required");
  process.exit(1);
}

export const client = createClient<paths>({
  baseUrl: "https://api.trollefsen.com",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
  },
});

// HIVE-240: the typed client can't reach the agent endpoint. The deployed
// api-proxy worker only routes slash-suffixed prefixes (bare "/agent" 404s),
// and the live agent function expects POST /agent/chat with a `prompt` field.
// The openapi spec's bare "/agent" + `message` shape is stale, so this one
// operation bypasses the generated types until the spec is regenerated.
export async function agentChat(
  prompt: string,
): Promise<{ ok: boolean; data: unknown }> {
  const res = await fetch("https://api.trollefsen.com/agent/chat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });
  const data = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
  return { ok: res.ok, data };
}
