const scheduleRepository = require("../repositories/schedule.repository");
const userRepository = require("../repositories/user.repository");
const reminderService = require("./reminder.service");
const { resolveWeeklyDates } = require("../utils/weekly-date-resolver");
const { calculateSchedule } = require("./schedule-calculator.service");

async function updateHalfDayStartTime(
  userId,
  parsedInput,
  referenceDate = new Date()
) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  if (!parsedInput || typeof parsedInput !== "object") {
    throw new Error("Data input Half Day tidak valid.");
  }

  const { day, time } = parsedInput;

  if (!day || !time) {
    throw new Error("Hari dan jam masuk wajib diberikan.");
  }

  const weeklyDates = resolveWeeklyDates(referenceDate);
  const targetDay = weeklyDates.find((item) => item.day === day);

  if (!targetDay) {
    throw new Error(`Hari "${day}" tidak ditemukan pada minggu berjalan.`);
  }

  const targetDate = new Date(targetDay.date);

  const existingSchedule = await scheduleRepository.findByUserAndDate(
    userId,
    targetDate
  );

  if (!existingSchedule) {
    throw new Error(
      `Tidak ditemukan jadwal untuk hari ${day} (${targetDay.date}).`
    );
  }

  if (existingSchedule.shift.code.toUpperCase() !== "H") {
    throw new Error(
      `Jadwal hari ${day} bukan shift Half Day (H), melainkan shift ${existingSchedule.shift.code} (${existingSchedule.shift.name}). Perubahan jam masuk hanya berlaku untuk shift Half Day.`
    );
  }

  await scheduleRepository.updateById(existingSchedule.id, {
    customStartTime: time,
  });

  const fullSchedule = await scheduleRepository.findByUserAndDate(
    userId,
    targetDate
  );

  const user = await userRepository.findById(userId);
  const travelDuration = user?.travelDuration ?? 30;

  const calculated = calculateSchedule(fullSchedule, travelDuration);

  await reminderService.syncReminderForSchedule(fullSchedule, travelDuration);

  return {
    day,
    date: targetDay.date,
    calculated,
  };
}

module.exports = {
  updateHalfDayStartTime,
};
