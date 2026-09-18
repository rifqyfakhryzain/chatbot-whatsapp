const express = require("express");
const errorMiddleware = require("./middlewares/error.middleware");
const scheduleRoutes = require("./routes/schedule.routes");

const app = express();

app.use(express.json());

app.use("/api/schedules", scheduleRoutes);

app.use(errorMiddleware);

module.exports = app;
