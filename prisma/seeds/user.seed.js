const { PrismaClient } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const seedUser = async () => {
  const adminUser = await prisma.user.create({
    data: {
      user_code: `USR_${new Date().getTime()}`,
      fullname: "Zein Irfansyah",
      username: "zeinirfansyah",
      email: "zein.admin@wevest.com",
      phone: "08123456789",
      job_status: "Bekerja",
      field: "Software Development",
      role: "ADMIN",
      password: await bcrypt.hash("Admin123#", 10),
    },
  });

  console.log("Admin user created successfully:", adminUser);

  for (let i = 0; i < 20; i++) {
    const user = await prisma.user.create({
      data: {
        user_code: `USR_${new Date().getTime()}`,
        fullname: faker.person.fullName(),
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        job_status: faker.helpers.arrayElement([
          "Bekerja",
          "Tidak Bekerja",
          "Mahasiswa",
        ]),
        field: faker.person.jobArea(),
        role: faker.helpers.arrayElement(["ADMIN", "CUSTOMER"]),
        password: await bcrypt.hash("Admin123#", 10),
      },
    });

    console.log(`User ${i + 1} created without a picture:`, user);
  }
};

module.exports = { seedUser };
