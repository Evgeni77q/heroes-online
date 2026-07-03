/**
 * Fails when timed jobs are expired but still active (Game Loop did not complete them).
 *
 * Usage:
 *   node scripts/check-stuck-jobs.mjs
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const now = new Date();
  const stuck = await prisma.buildingUpgradeQueue.findMany({
    where: {
      status: { in: ["PENDING", "RUNNING"] },
      finishAt: { lte: now },
    },
    select: {
      id: true,
      buildingId: true,
      status: true,
      finishAt: true,
    },
  });

  if (stuck.length > 0) {
    console.error("[stuck-jobs] expired but not completed:", stuck);
    process.exit(1);
  }

  console.log("[stuck-jobs] OK — no expired active jobs");
}

main()
  .catch((error) => {
    console.error("[stuck-jobs] FAILED:", error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
