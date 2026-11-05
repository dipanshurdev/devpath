/**
 * Seed achievement definitions into the database.
 * Run with: npx tsx scripts/seed-achievements.ts
 */

import { PrismaClient } from "@prisma/client";
import { ACHIEVEMENT_DEFINITIONS } from "../lib/achievements";

const prisma = new PrismaClient();

async function main() {
  console.log("🏆 Seeding achievements...");

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    await prisma.achievement.upsert({
      where: { key: def.key },
      update: {
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category,
        points: def.points,
        rarity: def.rarity,
        requirement: def.requirement,
      },
      create: {
        key: def.key,
        name: def.name,
        description: def.description,
        icon: def.icon,
        category: def.category,
        points: def.points,
        rarity: def.rarity,
        requirement: def.requirement,
      },
    });
    console.log(`  ✓ ${def.name} (${def.rarity})`);
  }

  const count = await prisma.achievement.count();
  console.log(`\n✅ Done! ${count} achievements in database.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
