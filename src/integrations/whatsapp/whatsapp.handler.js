const userService = require("../../services/user.service");
const scheduleService = require("../../services/schedule.service");
const {
  createWeeklyScheduleDraft,
} = require("../../services/weekly-schedule.service");
const {
  saveConfirmedWeeklySchedule,
} = require("../../services/weekly-schedule-save.service");
const {
  updateWeeklySchedule,
} = require("../../services/weekly-schedule-update.service");
const {
  setPendingSchedule,
  getPendingSchedule,
  clearPendingSchedule,
} = require("../../services/pending-weekly-schedule.service");
const {
  parseWeeklyScheduleUpdate,
} = require("../../utils/weekly-schedule-update-parser");
const {
  formatWeeklySchedulePreview,
} = require("../../utils/weekly-schedule-preview");
const {
  parseScheduleConfirmation,
} = require("../../utils/weekly-schedule-confirmation");

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

async function getUserByPhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return null;
  }

  return await userService.getUserByPhoneNumber(phoneNumber);
}

async function handleScheduleCommand(args, phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

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

async function handleUpdateScheduleCommand(args, phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  const input = `/update ${args.join(" ")}`;

  try {
    const updateData = parseWeeklyScheduleUpdate(input);

    const result = await updateWeeklySchedule(user.id, updateData, new Date());

    return [
      "Jadwal berhasil diperbarui.",
      "",
      `${result.day} (${result.date}) : ${result.shiftCode}`,
    ].join("\n");
  } catch (error) {
    return error.message;
  }
}

async function handleWeeklyScheduleInput(text, phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  try {
    const draft = await createWeeklyScheduleDraft(text, new Date());

    setPendingSchedule(user.id, draft);

    return formatWeeklySchedulePreview(draft);
  } catch (error) {
    return error.message;
  }
}

async function handleScheduleConfirmation(text, phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  const confirmation = parseScheduleConfirmation(text);

  if (confirmation.confirmed === null) {
    return null;
  }

  const pendingSchedule = getPendingSchedule(user.id);

  if (!pendingSchedule) {
    return "Tidak ada draft jadwal yang menunggu konfirmasi.";
  }

  if (!confirmation.confirmed) {
    clearPendingSchedule(user.id);

    return "Draft jadwal dibatalkan.";
  }

  try {
    await saveConfirmedWeeklySchedule(user.id, pendingSchedule);

    clearPendingSchedule(user.id);

    return "Jadwal mingguan berhasil disimpan.";
  } catch (error) {
    return error.message;
  }
}

async function handleMessage(text, phoneNumber) {
  if (!text || !text.trim()) {
    return null;
  }

  const normalizedText = text.trim();

  const confirmation = parseScheduleConfirmation(normalizedText);

  if (confirmation.confirmed !== null) {
    return await handleScheduleConfirmation(normalizedText, phoneNumber);
  }

  if (normalizedText.includes("\n")) {
    return await handleWeeklyScheduleInput(normalizedText, phoneNumber);
  }

  return null;
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
      "/update jadwal Hari SHIFT",
      "/reminder",
      "/settings",
      "/help",
    ].join("\n");
  }

  if (command === "jadwal") {
    return await handleScheduleCommand(args, phoneNumber);
  }

  if (command === "update") {
    return await handleUpdateScheduleCommand(args, phoneNumber);
  }

  return "Command tidak dikenali. Ketik /help untuk melihat daftar command.";
}

module.exports = {
  handleCommand,
  handleMessage,
};
