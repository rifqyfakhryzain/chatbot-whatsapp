const reminderRepository = require("../repositories/reminder.repository");
const userRepository = require("../repositories/user.repository");
const scheduleRepository = require("../repositories/schedule.repository");
const { calculateSchedule } = require("./schedule-calculator.service");

async function syncReminderForSchedule(schedule, travelDuration) {
  if (!schedule) {
    return null;
  }

  let scheduleWithShift = schedule;

  if (!schedule.shift && schedule.id) {
    const fetched = await scheduleRepository.findById(schedule.id);
    if (fetched) {
      scheduleWithShift = fetched;
    }
  }

  if (!scheduleWithShift.shift) {
    return null;
  }

  const duration = Number(travelDuration) || 30;
  const calc = calculateSchedule(scheduleWithShift, duration);

  // Jika hari libur (OFF) atau Half Day belum ditentukan jamnya:
  // Hapus reminder jika sebelumnya pernah ada
  if (
    calc.status === "OFF" ||
    (calc.status === "HALF_DAY" && !calc.isConfigured)
  ) {
    await reminderRepository.deleteByScheduleId(schedule.id);
    return null;
  }

  // Jika shift kerja memiliki waktu OTW yang valid:
  if (calc.otwDateTime) {
    return await reminderRepository.upsertByScheduleId(schedule.id, {
      userId: schedule.userId,
      scheduledAt: calc.otwDateTime,
      status: "PENDING",
    });
  }

  return null;
}

async function syncRemindersForSchedules(schedules, userId) {
  if (!Array.isArray(schedules) || schedules.length === 0) {
    return [];
  }

  const user = await userRepository.findById(userId);
  const travelDuration = user?.travelDuration ?? 30;

  const results = [];

  for (const schedule of schedules) {
    const reminder = await syncReminderForSchedule(schedule, travelDuration);
    if (reminder) {
      results.push(reminder);
    }
  }

  return results;
}

async function getTodayReminderForUser(userId) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await reminderRepository.findByUserAndDate(userId, today, tomorrow);
}

async function getDueReminders(currentTime = new Date()) {
  return await reminderRepository.findDueReminders(currentTime);
}

async function markReminderSent(reminderId, sentAt = new Date()) {
  return await reminderRepository.markAsSent(reminderId, sentAt);
}

async function markReminderFailed(reminderId, errorMessage) {
  return await reminderRepository.markAsFailed(reminderId, errorMessage);
}

module.exports = {
  syncReminderForSchedule,
  syncRemindersForSchedules,
  getTodayReminderForUser,
  getDueReminders,
  markReminderSent,
  markReminderFailed,
};
