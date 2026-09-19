const userService = require("../../services/user.service");
const scheduleService = require("../../services/schedule.service");

function formatSchedule(schedule) {
  const date = new Date(schedule.date);

  const dateText = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const shift = schedule.shift;

  return [
    `📅 ${dateText}`,
    `Shift: ${shift.code} - ${shift.name}`,
    `Jam: ${shift.startTime || "-"} - ${shift.endTime || "-"}`,
  ].join("\n");
}

function formatSchedules(schedules, emptyMessage) {
  if (!schedules || schedules.length === 0) {
    return emptyMessage;
  }

  return schedules.map(formatSchedule).join("\n\n");
}

async function handleScheduleCommand(args, phoneNumber) {
  if (!phoneNumber) {
    return "Nomor WhatsApp tidak dapat dikenali.";
  }

  const user = await userService.getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  const subCommand = args[0]?.toLowerCase();

  if (
    !subCommand ||
    (subCommand === "hari" && args[1]?.toLowerCase() === "ini")
  ) {
    const schedules = await scheduleService.getTodaySchedule(user.id);

    return formatSchedules(schedules, "Tidak ada jadwal untuk hari ini.");
  }

  if (subCommand === "besok") {
    const schedules = await scheduleService.getTomorrowSchedule(user.id);

    return formatSchedules(schedules, "Tidak ada jadwal untuk besok.");
  }

  if (subCommand === "minggu") {
    const schedules = await scheduleService.getWeeklySchedules(user.id);

    return formatSchedules(schedules, "Tidak ada jadwal untuk minggu ini.");
  }

  return [
    "Format command /jadwal tidak dikenali.",
    "",
    "/jadwal",
    "/jadwal hari ini",
    "/jadwal besok",
    "/jadwal minggu",
  ].join("\n");
}

async function handleCommand(command, args, phoneNumber) {
  if (command === "help") {
    return [
      "Daftar command:",
      "",
      "/jadwal",
      "/jadwal hari ini",
      "/jadwal besok",
      "/jadwal minggu",
      "/reminder",
      "/settings",
      "/help",
    ].join("\n");
  }

  if (command === "jadwal") {
    return await handleScheduleCommand(args, phoneNumber);
  }

  return "Command tidak dikenali. Ketik /help untuk melihat daftar command.";
}

module.exports = {
  handleCommand,
};
