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
