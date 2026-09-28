const { parseWeeklySchedule } = require("../utils/weekly-schedule-parser");

const { resolveWeeklyDates } = require("../utils/weekly-date-resolver");

const {
  validateWeeklySchedule,
} = require("../utils/weekly-schedule-validator");

const shiftRepository = require("../repositories/shift.repository");

async function createWeeklyScheduleDraft(input, referenceDate) {
  const parsedSchedules = parseWeeklySchedule(input);

  validateWeeklySchedule(parsedSchedules);

  const weeklyDates = resolveWeeklyDates(referenceDate);

  const dateMap = new Map(weeklyDates.map((item) => [item.day, item.date]));

  const schedules = [];

  for (const schedule of parsedSchedules) {
    const shift = await shiftRepository.findByCode(schedule.shiftCode);

    if (!shift) {
      throw new Error(`Shift "${schedule.shiftCode}" tidak ditemukan.`);
    }

    schedules.push({
      day: schedule.day,
      date: dateMap.get(schedule.day),
      shiftCode: schedule.shiftCode,
      shiftId: shift.id,
    });
  }

  return {
    referenceDate,
    schedules,
  };
}

module.exports = {
  createWeeklyScheduleDraft,
};
