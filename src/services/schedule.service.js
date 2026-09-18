const scheduleRepository = require("../repositories/schedule.repository");
const { scheduleSchema } = require("../validations/schedule.schema");

const getSchedules = async () => {
  return await scheduleRepository.findAll();
};

const getScheduleById = async (id) => {
  return await scheduleRepository.findById(id);
};

const createSchedule = async (data) => {
  const validatedData = scheduleSchema.parse(data);

  return await scheduleRepository.create(validatedData);
};

const updateSchedule = async (id, data) => {
  const validatedData = scheduleSchema.parse(data);

  return await scheduleRepository.updateById(id, validatedData);
};

const deleteSchedule = async (id) => {
  return await scheduleRepository.deleteById(id);
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
