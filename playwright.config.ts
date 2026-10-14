import { defineConfig } from "@playwright/test";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const runtimeDir = mkdtempSync(join(tmpdir(), "english-it-e2e-"));
const dataDir = process.env.E2E_DATA_DIR || "data/units";
const baseURL = process.env.E2E_BASE_URL || "http://localhost:3106";
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  reporter: "list",
  use: {
    baseURL,
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    launchOptions: {
      args: [
        "--use-fake-device-for-media-stream",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command:
          "node -e \"require('node:fs').cpSync('.next/static','.next/standalone/.next/static',{recursive:true})\" && node .next/standalone/server.js",
        url: "http://localhost:3106",
        reuseExistingServer: false,
        env: {
          PORT: "3106",
          HOSTNAME: "127.0.0.1",
          ACCESS_CODE: "local-e2e-code",
          AI_MOCK: "1",
          EXAM_DATA_DIR: resolve(dataDir),
          RATE_LIMIT_DB: join(runtimeDir, "quota.sqlite"),
          TRUST_PROXY: "0",
          AI_API_KEY: "e2e-never-expose-this-key",
        },
      },
});
