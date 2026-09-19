const scheduleRepository = require("../repositories/schedule.repository");
const { scheduleSchema } = require("../validations/schedule.schema");

const getSchedules = async () => {
  return await scheduleRepository.findAll();
};

const getScheduleById = async (id) => {
  const schedule = await scheduleRepository.findById(id);

  if (!schedule) {
    const error = new Error("Schedule not found");
    error.statusCode = 404;
    throw error;
  }

  return schedule;
};

const getTodaySchedule = async (userId) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);

  tomorrow.setDate(tomorrow.getDate() + 1);

  return await scheduleRepository.findByUserAndDateRange(
    userId,
    today,
    tomorrow,
  );
};

const getTomorrowSchedule = async (userId) => {
  const tomorrow = new Date();

  tomorrow.setHours(0, 0, 0, 0);

  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date(tomorrow);

  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

  return await scheduleRepository.findByUserAndDateRange(
    userId,
    tomorrow,
    dayAfterTomorrow,
  );
};

const getWeeklySchedules = async (userId) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const dayOfWeek = today.getDay();

  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const startOfWeek = new Date(today);

  startOfWeek.setDate(startOfWeek.getDate() - daysSinceMonday);

  const startOfNextWeek = new Date(startOfWeek);

  startOfNextWeek.setDate(startOfNextWeek.getDate() + 7);

  return await scheduleRepository.findByUserAndDateRange(
    userId,
    startOfWeek,
    startOfNextWeek,
  );
};

const createSchedule = async (data) => {
  const validatedData = scheduleSchema.parse(data);

  return await scheduleRepository.create(validatedData);
};

const updateSchedule = async (id, data) => {
  const validatedData = scheduleSchema.parse(data);

  try {
    return await scheduleRepository.updateById(id, validatedData);
  } catch (error) {
    if (error.code === "P2025") {
      const notFoundError = new Error("Schedule not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
};

const deleteSchedule = async (id) => {
  try {
    return await scheduleRepository.deleteById(id);
  } catch (error) {
    if (error.code === "P2025") {
      const notFoundError = new Error("Schedule not found");
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw error;
  }
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getTodaySchedule,
  getTomorrowSchedule,
  getWeeklySchedules,
};
