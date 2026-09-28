import { hc } from "hono/client";

import type { HonoApp } from "@jobi/api-types";
import { isDevelopment } from "@jobi/constants";
import { log } from "@jobi/utils/log";

export const apiBaseUrl = isDevelopment
  ? `http://localhost:${process.env.PORT ?? 1981}`
  : process.env.NEXT_PUBLIC_API_URL ?? "https://api.jobtrack.fr";

//if (!apiBaseUrl) throw new Error("Missing API url environment.");

log("info", "Next Init", { apiBaseUrl });

export const honoClient = hc<HonoApp>(apiBaseUrl, {
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    return await fetch(input, { ...init, credentials: "include" });
  },
});
