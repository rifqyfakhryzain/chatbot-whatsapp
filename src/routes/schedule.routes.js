const express = require("express");
const scheduleController = require("../controllers/schedule.controller");

const router = express.Router();

router.get("/", scheduleController.getSchedules);

router.get("/:id", scheduleController.getScheduleById);

router.post("/", scheduleController.createSchedule);

router.put("/:id", scheduleController.updateSchedule);

router.delete("/:id", scheduleController.deleteSchedule);

module.exports = router;
