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
  // Seed Shift

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

  // Seed User

  const users = [
    {
      name: "Marsha Ananda Darajat",
      phoneNumber: "6285719925638",
    },
    {
      name: "Ismutiar",
      phoneNumber: "6281321125584",
    },
    {
      name: "Ida Farida",
      phoneNumber: "6285295034040",
    },
    {
      name: "Alya Zulfa Latifah",
      phoneNumber: "6289676224685",
    },
  ];

  const userRecords = {};

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: {
        phoneNumber: userData.phoneNumber,
      },
      update: {
        name: userData.name,
      },
      create: {
        name: userData.name,
        phoneNumber: userData.phoneNumber,
      },
    });

    userRecords[userData.name] = user;
  }

  console.log("User seed berhasil!");

  // Ambil shift

  const shiftMap = {};

  for (const shift of shifts) {
    const data = await prisma.shift.findUnique({
      where: {
        code: shift.code,
      },
    });

    shiftMap[shift.code] = data;
  }

  // Seed Schedule

  const schedules = [
    {
      user: "Marsha Ananda Darajat",
      date: new Date("2026-09-19T00:00:00.000Z"),
      shiftCode: "M",
    },
    {
      user: "Marsha Ananda Darajat",
      date: new Date("2026-09-20T00:00:00.000Z"),
      shiftCode: "M1",
    },
    {
      user: "Marsha Ananda Darajat",
      date: new Date("2026-09-22T00:00:00.000Z"),
      shiftCode: "O",
    },
    {
      user: "Marsha Ananda Darajat",
      date: new Date("2026-09-24T00:00:00.000Z"),
      shiftCode: "O2",
    },

    {
      user: "Marsha Ananda Darajat",
      date: new Date("2026-09-26T00:00:00.000Z"),
      shiftCode: "M2",
    },
    {
      user: "Marsha Ananda Darajat",
      date: new Date("2026-09-27T00:00:00.000Z"),
      shiftCode: "O1",
    },

    {
      user: "Ismutiar",
      date: new Date("2026-09-19T00:00:00.000Z"),
      shiftCode: "O",
    },

    {
      user: "Ismutiar",
      date: new Date("2026-09-21T00:00:00.000Z"),
      shiftCode: "O1",
    },
    {
      user: "Ismutiar",
      date: new Date("2026-09-23T00:00:00.000Z"),
      shiftCode: "M",
    },
    {
      user: "Ismutiar",
      date: new Date("2026-09-25T00:00:00.000Z"),
      shiftCode: "M1",
    },
    {
      user: "Ismutiar",
      date: new Date("2026-09-27T00:00:00.000Z"),
      shiftCode: "O2",
    },

    {
      user: "Ida Farida",
      date: new Date("2026-09-20T00:00:00.000Z"),
      shiftCode: "M2",
    },

    {
      user: "Ida Farida",
      date: new Date("2026-09-22T00:00:00.000Z"),
      shiftCode: "O",
    },
    {
      user: "Ida Farida",
      date: new Date("2026-09-24T00:00:00.000Z"),
      shiftCode: "M1",
    },
    {
      user: "Ida Farida",
      date: new Date("2026-09-26T00:00:00.000Z"),
      shiftCode: "O1",
    },
  ];

  for (const schedule of schedules) {
    const user = userRecords[schedule.user];

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
