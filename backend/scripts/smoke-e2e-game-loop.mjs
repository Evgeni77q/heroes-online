/**
 * Heroes Online — E2E smoke test for the first game loop.
 *
 * Prerequisites:
 *   docker compose up -d postgres
 *   cd backend && npx prisma db push
 *   GAME_LOOP_TICK_MS=1000 GAME_SMOKE_FAST_BUILD=true npm run start:dev
 *
 * Usage:
 *   node scripts/smoke-e2e-game-loop.mjs
 *   BACKEND_URL=http://localhost:8080 node scripts/smoke-e2e-game-loop.mjs
 */

import { io } from "socket.io-client";

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";
const WS_URL = process.env.WS_URL ?? BASE_URL;
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS ?? 30_000);

const email = `smoke+${Date.now()}@heroes-online.test`;
const username = `smoke_${Date.now().toString(36)}`;
const password = "SmokeTestPass12!";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const body = await response.json().catch(() => ({}));

  return { response, body };
}

function waitForSocketEvent(socket, eventName, timeoutMs) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.off(eventName, onEvent);
      reject(new Error(`Timeout waiting for ${eventName}`));
    }, timeoutMs);

    function onEvent(payload) {
      clearTimeout(timer);
      socket.off(eventName, onEvent);
      resolve(payload);
    }

    socket.on(eventName, onEvent);
  });
}

async function main() {
  console.log(`[smoke] target ${BASE_URL}`);

  const register = await request("/api/v1/account/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  assert(register.body.success === true, "register failed");
  console.log("[smoke] OK register + onboarding");

  const login = await request("/api/v1/account/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  assert(login.body.success === true, "login failed");
  const token = login.body.data.tokens.accessToken;
  console.log("[smoke] OK login");

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const dashboard = await request("/api/v1/dashboard", {
    headers: authHeaders,
  });
  assert(dashboard.body.success === true, "dashboard failed");
  const { player, resources, buildings, city } = dashboard.body.data;
  assert(player?.cityId, "missing player.cityId");
  assert(resources?.wood >= 0, "resources missing");
  assert(buildings?.length >= 3, "buildings missing");
  console.log("[smoke] OK dashboard (resources + buildings)");

  const farm = buildings.find((building) => building.type === "FARM");
  assert(farm?.id, "farm building not found");
  const initialLevel = farm.level;

  const socket = io(WS_URL, {
    autoConnect: false,
    transports: ["websocket"],
    auth: { token },
  });

  socket.connect();
  socket.emit("join_world", {
    playerId: player.id,
    worldId: player.worldId,
  });

  const updatedPromise = waitForSocketEvent(
    socket,
    "building.updated",
    TIMEOUT_MS,
  );

  const upgrade = await request("/api/v1/building/upgrade", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      buildingId: farm.id,
      cityId: player.cityId,
    }),
  });
  assert(upgrade.body.success === true, "upgrade failed");
  assert(upgrade.body.data.status === "UPGRADING", "expected UPGRADING");
  assert(upgrade.body.data.finishAt, "missing finishAt");
  console.log("[smoke] OK upgrade accepted");

  const dashboardUpgrading = await request("/api/v1/dashboard", {
    headers: authHeaders,
  });
  const farmUpgrading = dashboardUpgrading.body.data.buildings.find(
    (building) => building.id === farm.id,
  );
  assert(
    farmUpgrading?.status === "UPGRADING",
    "dashboard should show UPGRADING",
  );
  console.log("[smoke] OK dashboard shows UPGRADING");

  const realtimeEvent = await updatedPromise;
  assert(realtimeEvent?.event === "building.updated", "invalid ws event");
  assert(realtimeEvent?.version === 1, "invalid ws version");
  assert(
    realtimeEvent?.payload?.level === initialLevel + 1,
    "ws level not incremented",
  );
  assert(realtimeEvent?.payload?.status === "IDLE", "ws status not IDLE");
  console.log("[smoke] OK building.updated via WebSocket");

  const dashboardAfter = await request("/api/v1/dashboard", {
    headers: authHeaders,
  });
  const farmAfter = dashboardAfter.body.data.buildings.find(
    (building) => building.id === farm.id,
  );
  assert(farmAfter?.level === initialLevel + 1, "F5 level mismatch");
  assert(farmAfter?.status === "IDLE", "F5 status should be IDLE");
  console.log("[smoke] OK dashboard after refresh (F5 simulation)");

  const metrics = await request("/api/v1/admin/metrics");
  assert(metrics.body.gameLoop?.jobsCompleted >= 1, "metrics missing job");
  console.log("[smoke] OK game loop metrics", metrics.body.gameLoop);

  socket.disconnect();
  console.log("[smoke] ALL PASSED — ready for v0.1.0-alpha tag");
}

main().catch((error) => {
  console.error("[smoke] FAILED:", error.message);
  process.exit(1);
});
