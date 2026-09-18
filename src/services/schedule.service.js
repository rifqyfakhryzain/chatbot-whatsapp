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
};
