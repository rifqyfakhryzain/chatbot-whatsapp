const prisma = require("../config/prisma");

async function upsertByScheduleId(scheduleId, data) {
  return await prisma.reminder.upsert({
    where: {
      scheduleId,
    },
    update: {
      scheduledAt: data.scheduledAt,
      status: data.status || "PENDING",
      sentAt: null,
      errorMessage: null,
    },
    create: {
      scheduleId,
      userId: data.userId,
      scheduledAt: data.scheduledAt,
      status: data.status || "PENDING",
    },
    include: {
      schedule: {
        include: {
          shift: true,
        },
      },
      user: true,
    },
  });
}

async function findByScheduleId(scheduleId) {
  return await prisma.reminder.findUnique({
    where: {
      scheduleId,
    },
    include: {
      schedule: {
        include: {
          shift: true,
        },
      },
      user: true,
    },
  });
}

async function findDueReminders(currentTime = new Date()) {
  return await prisma.reminder.findMany({
    where: {
      status: "PENDING",
      scheduledAt: {
        lte: currentTime,
      },
    },
    include: {
      schedule: {
        include: {
          shift: true,
        },
      },
      user: true,
    },
    orderBy: {
      scheduledAt: "asc",
    },
  });
}

async function markAsSent(id, sentAt = new Date()) {
  return await prisma.reminder.update({
    where: {
      id,
    },
    data: {
      status: "SENT",
      sentAt,
      errorMessage: null,
    },
  });
}

async function markAsFailed(id, errorMessage) {
  return await prisma.reminder.update({
    where: {
      id,
    },
    data: {
      status: "FAILED",
      errorMessage,
    },
  });
}

async function deleteByScheduleId(scheduleId) {
  return await prisma.reminder.deleteMany({
    where: {
      scheduleId,
    },
  });
}

async function findByUserAndDate(userId, startOfDay, endOfDay) {
  return await prisma.reminder.findFirst({
    where: {
      userId,
      scheduledAt: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
    include: {
      schedule: {
        include: {
          shift: true,
        },
      },
      user: true,
    },
  });
}

module.exports = {
  upsertByScheduleId,
  findByScheduleId,
  findDueReminders,
  markAsSent,
  markAsFailed,
  deleteByScheduleId,
  findByUserAndDate,
};
