require("dotenv/config");

const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("../src/generated/prisma");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const shifts = [
    {
      code: "O",
      name: "Opening",
      startTime: "09:00",
      endTime: "18:00",
      workHours: 9,
    },
    {
      code: "O1",
      name: "Opening 1",
      startTime: "10:00",
      endTime: "19:00",
      workHours: 9,
    },
    {
      code: "O2",
      name: "Opening 2",
      startTime: "11:00",
      endTime: "20:00",
      workHours: 9,
    },
    {
      code: "M",
      name: "Middle",
      startTime: "12:00",
      endTime: "21:00",
      workHours: 9,
    },
    {
      code: "M1",
      name: "Middle 1",
      startTime: "13:00",
      endTime: "22:00",
      workHours: 9,
    },
    {
      code: "M2",
      name: "Middle 2",
      startTime: "14:00",
      endTime: "23:00",
      workHours: 9,
    },
    {
      code: "H",
      name: "Half Day",
      startTime: null,
      endTime: null,
      workHours: 4,
    },
  ];

  for (const shift of shifts) {
    await prisma.shift.upsert({
      where: {
        code: shift.code,
      },
      update: {
        name: shift.name,
        startTime: shift.startTime,
        endTime: shift.endTime,
        workHours: shift.workHours,
      },
      create: shift,
    });
  }

  console.log("Shift seed berhasil!");
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
