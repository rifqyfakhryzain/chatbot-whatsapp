const scheduleService = require("../services/schedule.service");

const getSchedules = async (req, res, next) => {
  try {
    const schedules = await scheduleService.getSchedules();

    return res.status(200).json({
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

const getScheduleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await scheduleService.getScheduleById(id);

    return res.status(200).json({
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

const createSchedule = async (req, res, next) => {
  try {
    const schedule = await scheduleService.createSchedule(req.body);

    return res.status(201).json({
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

const updateSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await scheduleService.updateSchedule(id, req.body);

    return res.status(200).json({
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSchedule = async (req, res, next) => {
  try {
    const { id } = req.params;

    const schedule = await scheduleService.deleteSchedule(id);

    return res.status(200).json({
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSchedules,
  getScheduleById,
  createSchedule,
  updateSchedule,
  deleteSchedule,
};
