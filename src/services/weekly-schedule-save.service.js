const scheduleRepository = require("../repositories/schedule.repository");
const scheduleService = require("./schedule.service");

async function saveConfirmedWeeklySchedule(userId, draft) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  if (!draft || !Array.isArray(draft.schedules)) {
    throw new Error("Draft jadwal tidak valid.");
  }

  const savedSchedules = [];

  for (const schedule of draft.schedules) {
    const date = new Date(schedule.date);

    if (Number.isNaN(date.getTime())) {
      throw new Error(
        `Tanggal jadwal tidak valid untuk hari "${schedule.day}".`,
      );
    }

    const existingSchedule = await scheduleRepository.findByUserAndDate(
      userId,
      date,
    );

    if (existingSchedule) {
      throw new Error(
        `Jadwal untuk ${schedule.day} (${schedule.date}) sudah ada.`,
      );
    }

    const savedSchedule = await scheduleService.createSchedule({
      userId,
      shiftId: schedule.shiftId,
      date: schedule.date,
    });

    savedSchedules.push(savedSchedule);
  }

  return savedSchedules;
}

module.exports = {
  saveConfirmedWeeklySchedule,
};
