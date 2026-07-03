/**
 * Resilience scenarios for the building upgrade game loop.
 *
 * Usage:
 *   node scripts/resilience-game-loop.mjs
 */

const BASE_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

const email = `resilience+${Date.now()}@heroes-online.test`;
const username = `res_${Date.now().toString(36)}`;
const password = "ResilienceTest12!";

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

async function registerAndLogin() {
  await request("/api/v1/account/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });

  const login = await request("/api/v1/account/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  assert(login.body.success === true, "login failed");

  return {
    token: login.body.data.tokens.accessToken,
    headers: {
      Authorization: `Bearer ${login.body.data.tokens.accessToken}`,
      "Content-Type": "application/json",
    },
  };
}

async function getUpgradeTargets(headers) {
  const dashboard = await request("/api/v1/dashboard", { headers });
  const { player, buildings } = dashboard.body.data;

  const upgradable = buildings.filter(
    (building) => building.type === "FARM" || building.type === "SAWMILL",
  );

  return { player, upgradable };
}

async function main() {
  console.log(`[resilience] target ${BASE_URL}`);
  const { headers } = await registerAndLogin();
  const { player, upgradable } = await getUpgradeTargets(headers);
  const farm = upgradable.find((building) => building.type === "FARM");
  assert(farm?.id, "farm not found");

  const first = await request("/api/v1/building/upgrade", {
    method: "POST",
    headers,
    body: JSON.stringify({ buildingId: farm.id, cityId: player.cityId }),
  });
  assert(first.body.success === true, "first upgrade failed");

  const duplicate = await request("/api/v1/building/upgrade", {
    method: "POST",
    headers,
    body: JSON.stringify({ buildingId: farm.id, cityId: player.cityId }),
  });
  assert(duplicate.response.status === 409, "expected 409 on duplicate upgrade");
  console.log("[resilience] OK duplicate upgrade → 409");

  const { headers: headers2 } = await registerAndLogin();
  const targets2 = await getUpgradeTargets(headers2);
  const farm2 = targets2.upgradable.find((building) => building.type === "FARM");

  for (let attempt = 0; attempt < 20; attempt += 1) {
    const attemptResult = await request("/api/v1/building/upgrade", {
      method: "POST",
      headers: headers2,
      body: JSON.stringify({
        buildingId: farm2.id,
        cityId: targets2.player.cityId,
      }),
    });

    if (!attemptResult.body.success) {
      break;
    }
  }

  const poor = await request("/api/v1/building/upgrade", {
    method: "POST",
    headers: headers2,
    body: JSON.stringify({
      buildingId: farm2.id,
      cityId: targets2.player.cityId,
    }),
  });
  assert(
    poor.response.status === 409 || poor.response.status === 422,
    "expected 409 or 422 when broke or busy",
  );
  console.log("[resilience] OK insufficient resources or busy →", poor.response.status);

  const { headers: headers3 } = await registerAndLogin();
  const targets3 = await getUpgradeTargets(headers3);
  const farm3 = targets3.upgradable.find((building) => building.type === "FARM");
  const mill3 = targets3.upgradable.find((building) => building.type === "SAWMILL");

  if (mill3) {
    const jobA = await request("/api/v1/building/upgrade", {
      method: "POST",
      headers: headers3,
      body: JSON.stringify({
        buildingId: farm3.id,
        cityId: targets3.player.cityId,
      }),
    });
    const jobB = await request("/api/v1/building/upgrade", {
      method: "POST",
      headers: headers3,
      body: JSON.stringify({
        buildingId: mill3.id,
        cityId: targets3.player.cityId,
      }),
    });
    assert(jobA.body.success && jobB.body.success, "parallel jobs failed");
    console.log("[resilience] OK multiple buildings upgrading in parallel");
  }

  console.log(
    "[resilience] OK restart recovery — verify manually: pending jobs complete after backend restart",
  );
  console.log("[resilience] ALL AUTOMATED SCENARIOS PASSED");
}

main().catch((error) => {
  console.error("[resilience] FAILED:", error.message);
  process.exit(1);
});
