/**
 * Standard release gate — backend must already be running.
 *
 * Flow:
 *   GET /health == 200 → seed:dev → smoke:e2e → smoke:resilience → check-stuck-jobs
 *
 * Expected output contract (on success):
 *   release gate result:
 *   ✔ health
 *   ✔ seed
 *   ✔ e2e
 *   ✔ resilience
 *   ✔ no stuck jobs
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

const GATE_STEPS = [
  { id: "health", label: "health" },
  { id: "seed", label: "seed" },
  { id: "e2e", label: "e2e" },
  { id: "resilience", label: "resilience" },
  { id: "stuck-jobs", label: "no stuck jobs" },
];

const results = Object.fromEntries(GATE_STEPS.map((step) => [step.id, false]));

function log(step, message) {
  console.log(`[release-gate] ${step}: ${message}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function markPassed(stepId) {
  results[stepId] = true;
  const step = GATE_STEPS.find((item) => item.id === stepId);
  console.log(`[release-gate] ✔ ${step?.label ?? stepId}`);
}

function printSummary(failedStep) {
  console.log("");
  console.log("release gate result:");
  for (const step of GATE_STEPS) {
    const icon = results[step.id] ? "✔" : failedStep === step.id ? "✘" : "○";
    console.log(`  ${icon} ${step.label}`);
  }
  console.log("");
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
        markPassed("health");
        return body;
      }
    } catch {
      // retry until backend is up
    }

    await sleep(HEALTH_INTERVAL_MS);
  }

  throw new Error(`health check failed after ${HEALTH_RETRIES} attempts`);
}

function runCommand(stepId, command, args) {
  return new Promise((resolve, reject) => {
    log(stepId, `running ${command} ${args.join(" ")}`);

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
        markPassed(stepId);
        resolve();
        return;
      }

      reject(new Error(`${stepId} exited with code ${code}`));
    });
  });
}

async function main() {
  console.log(`[release-gate] target ${BASE_URL}`);
  let failedStep = null;

  try {
    await waitForHealth();
    await runCommand("seed", "npm", ["run", "seed:dev"]);
    await runCommand("e2e", "npm", ["run", "smoke:e2e"]);
    await runCommand("resilience", "npm", ["run", "smoke:resilience"]);
    await runCommand("stuck-jobs", "node", ["scripts/check-stuck-jobs.mjs"]);
  } catch (error) {
    failedStep =
      GATE_STEPS.find((step) => !results[step.id])?.id ?? "unknown";
    printSummary(failedStep);
    throw error;
  }

  printSummary(null);
  console.log("[release-gate] ALL PASSED — release is ready");
}

main().catch((error) => {
  console.error("[release-gate] FAILED:", error.message);
  process.exit(1);
});
