const scheduleRepository = require("../repositories/schedule.repository");
const shiftRepository = require("../repositories/shift.repository");
const scheduleService = require("./schedule.service");

const { resolveWeeklyDates } = require("../utils/weekly-date-resolver");

async function updateWeeklySchedule(userId, updateData, referenceDate) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  if (!updateData || typeof updateData !== "object") {
    throw new Error("Data update jadwal tidak valid.");
  }

  const { day, shiftCode } = updateData;

  if (!day) {
    throw new Error("Hari wajib diberikan.");
  }

  if (!shiftCode) {
    throw new Error("Shift wajib diberikan.");
  }

  const weeklyDates = resolveWeeklyDates(referenceDate);

  const targetDay = weeklyDates.find((item) => item.day === day);

  if (!targetDay) {
    throw new Error(`Hari "${day}" tidak ditemukan.`);
  }

  const shift = await shiftRepository.findByCode(shiftCode);

  if (!shift) {
    throw new Error(`Shift "${shiftCode}" tidak ditemukan.`);
  }

  const targetDate = new Date(targetDay.date);

  const existingSchedule = await scheduleRepository.findByUserAndDate(
    userId,
    targetDate,
  );

  if (!existingSchedule) {
    throw new Error(`Jadwal untuk ${day} (${targetDay.date}) belum ada.`);
  }

  const updatedSchedule = await scheduleService.updateSchedule(
    existingSchedule.id,
    {
      userId,
      shiftId: shift.id,
      date: targetDay.date,
    },
  );

  return {
    day,
    date: targetDay.date,
    shiftCode: shift.code,
    schedule: updatedSchedule,
  };
}

module.exports = {
  updateWeeklySchedule,
};
