const { PrismaClient } = require("@prisma/client");
const { seedUser } = require("./seeds/user.seed");
const { seedProducts } = require("./seeds/product.seed");

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Seeding users...");
    await seedUser();

    console.log("Seeding products...");
    await seedProducts();

    console.log("Seeding Completed");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});
