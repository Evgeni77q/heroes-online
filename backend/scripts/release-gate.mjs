/**
 * Standard release gate — backend must already be running.
 *
 * Flow:
 *   GET /health == 200 → seed:dev → smoke:e2e → smoke:resilience → check-stuck-jobs
 *
 * Usage:
 *   node scripts/release-gate.mjs
 *   BACKEND_URL=http://localhost:8080 node scripts/release-gate.mjs
 */

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const HEALTH_RETRIES = Number(process.env.HEALTH_RETRIES ?? 30);
const HEALTH_INTERVAL_MS = Number(process.env.HEALTH_INTERVAL_MS ?? 1000);
const scriptsDir = path.dirname(fileURLToPath(import.meta.url));
const backendDir = path.resolve(scriptsDir, "..");

function log(step, message) {
  console.log(`[release-gate] ${step}: ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function sleep(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForHealth() {
  log("health", `waiting for ${BASE_URL}/health`);

  for (let attempt = 1; attempt <= HEALTH_RETRIES; attempt += 1) {
    try {
      const response = await fetch(`${BASE_URL}/health`);

      if (response.status === 200) {
        const body = await response.json();
        assert(body.status === "ok", `health status is ${body.status}`);
        log("health", `OK (${body.version})`);
        return body;
      }
    } catch {
      // retry until backend is up
    }

    await sleep(HEALTH_INTERVAL_MS);
  }

  throw new Error(`health check failed after ${HEALTH_RETRIES} attempts`);
}

function runCommand(step, command, args) {
  return new Promise((resolve, reject) => {
    log(step, `running ${command} ${args.join(" ")}`);

    const child = spawn(command, args, {
      cwd: backendDir,
      stdio: "inherit",
      shell: process.platform === "win32",
      env: {
        ...process.env,
        BACKEND_URL: BASE_URL,
        WS_URL: process.env.WS_URL ?? BASE_URL,
      },
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${step} exited with code ${code}`));
    });
  });
}

async function main() {
  console.log(`[release-gate] target ${BASE_URL}`);

  await waitForHealth();
  await runCommand("seed", "npm", ["run", "seed:dev"]);
  await runCommand("smoke:e2e", "npm", ["run", "smoke:e2e"]);
  await runCommand("smoke:resilience", "npm", ["run", "smoke:resilience"]);
  await runCommand("stuck-jobs", "node", ["scripts/check-stuck-jobs.mjs"]);

  console.log("[release-gate] ALL PASSED — release is ready");
}

main().catch((error) => {
  console.error("[release-gate] FAILED:", error.message);
  process.exit(1);
});
