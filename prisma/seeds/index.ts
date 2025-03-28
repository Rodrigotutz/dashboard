require("ts-node").register({
  transpileOnly: true,
  compilerOptions: JSON.parse(process.env.TS_NODE_COMPILER_OPTIONS || "{}"),
});

import { seedThemes } from "./themes.seed";
import { seedUsers } from "./users.seed";
import { seedRooms } from "./rooms.seed";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await seedThemes();
  await seedUsers();
  await seedRooms();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
