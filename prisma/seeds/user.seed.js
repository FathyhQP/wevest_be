const { PrismaClient } = require('@prisma/client');
const {faker} = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const seedUser = async () => {
  for (let i = 0; i < 20; i++) {

    const user = await prisma.user.create({
      data: {
        user_code: `USR_${new Date().getTime()}`,
        fullname: faker.person.fullName(),
        username: faker.internet.userName().toLowerCase(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        job_status: faker.helpers.arrayElement(['Bekerja', 'Tidak Bekerja', 'Mahasiswa']),
        field: faker.person.jobArea(),
        role: faker.helpers.arrayElement(['ADMIN', 'CUSTOMER']),
        password: await bcrypt.hash('Admin123#', 10)
      }
    });

    console.log(`User ${i + 1} created without a picture:`, user);
  }
};

module.exports = { seedUser };
