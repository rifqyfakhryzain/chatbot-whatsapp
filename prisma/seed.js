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
  // =========================
  // 1. Seed Shift
  // =========================

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

  // =========================
  // 2. Seed User
  // =========================

  const user = await prisma.user.upsert({
    where: {
      phoneNumber: "6281234567890",
    },
    update: {
      name: "User Test",
    },
    create: {
      name: "User Test",
      phoneNumber: "6281234567890",
    },
  });

  console.log("User seed berhasil!");

  // =========================
  // 3. Ambil Shift
  // =========================

  const shiftMap = {};

  for (const shift of shifts) {
    const data = await prisma.shift.findUnique({
      where: {
        code: shift.code,
      },
    });

    shiftMap[shift.code] = data;
  }

  // =========================
  // 4. Seed Schedule
  // =========================

  const schedules = [
    {
      date: new Date("2026-09-19T00:00:00.000Z"),
      shiftCode: "M",
    },
    {
      date: new Date("2026-09-20T00:00:00.000Z"),
      shiftCode: "M1",
    },
    {
      date: new Date("2026-09-21T00:00:00.000Z"),
      shiftCode: "O",
    },
    {
      date: new Date("2026-09-22T00:00:00.000Z"),
      shiftCode: "O2",
    },
    {
      date: new Date("2026-09-23T00:00:00.000Z"),
      shiftCode: "M2",
    },
    {
      date: new Date("2026-09-24T00:00:00.000Z"),
      shiftCode: "O1",
    },
    {
      date: new Date("2026-09-25T00:00:00.000Z"),
      shiftCode: "H",
    },
  ];

  for (const schedule of schedules) {
    const existingSchedule = await prisma.schedule.findFirst({
      where: {
        userId: user.id,
        date: schedule.date,
      },
    });

    if (existingSchedule) {
      await prisma.schedule.update({
        where: {
          id: existingSchedule.id,
        },
        data: {
          shiftId: shiftMap[schedule.shiftCode].id,
        },
      });
    } else {
      await prisma.schedule.create({
        data: {
          userId: user.id,
          shiftId: shiftMap[schedule.shiftCode].id,
          date: schedule.date,
        },
      });
    }
  }

  console.log("Schedule seed berhasil!");
  console.log("Semua development seed berhasil!");
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
