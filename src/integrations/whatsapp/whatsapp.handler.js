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
const {
  calculateSchedule,
  calculateSchedules,
} = require("../../services/schedule-calculator.service");
const reminderService = require("../../services/reminder.service");
const {
  formatReminderStatus,
} = require("../../utils/reminder-formatter");
const {
  getTravelDuration,
  updateTravelDuration,
} = require("../../services/travel-duration.service");
const {
  updateHalfDayStartTime,
} = require("../../services/schedule-halfday.service");
const {
  parseHalfDayInput,
} = require("../../utils/schedule-halfday-parser");
const {
  formatDailySchedules,
  formatWeeklySchedulesSummary,
  formatTravelDurationInfo,
  formatTravelDurationSuccess,
  formatHalfDaySuccess,
} = require("../../utils/schedule-time-formatter");

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

  const travelDuration = await getTravelDuration(user.id);
  const subCommand = args[0]?.toLowerCase();

  if (
    !subCommand ||
    (subCommand === "hari" && args[1]?.toLowerCase() === "ini")
  ) {
    const schedules = await scheduleService.getTodaySchedule(user.id);
    const calculated = calculateSchedules(schedules, travelDuration);

    return formatDailySchedules(calculated, "Tidak ada jadwal untuk hari ini.");
  }

  if (subCommand === "besok") {
    const schedules = await scheduleService.getTomorrowSchedule(user.id);
    const calculated = calculateSchedules(schedules, travelDuration);

    return formatDailySchedules(calculated, "Tidak ada jadwal untuk besok.");
  }

  if (subCommand === "minggu") {
    const schedules = await scheduleService.getWeeklySchedules(user.id);
    const calculated = calculateSchedules(schedules, travelDuration);

    return formatWeeklySchedulesSummary(
      calculated,
      travelDuration,
      "Tidak ada jadwal untuk minggu ini."
    );
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

async function handleTravelDurationCommand(args, phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  if (!args || args.length === 0 || !args[0]) {
    const currentDuration = await getTravelDuration(user.id);
    return formatTravelDurationInfo(currentDuration);
  }

  try {
    const result = await updateTravelDuration(user.id, args[0]);
    return formatTravelDurationSuccess(result.travelDuration);
  } catch (error) {
    return error.message;
  }
}

async function handleHalfDayCommand(args, phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  try {
    const parsedInput = parseHalfDayInput(args);
    const result = await updateHalfDayStartTime(
      user.id,
      parsedInput,
      new Date()
    );

    return formatHalfDaySuccess(result);
  } catch (error) {
    return error.message;
  }
}

async function handleReminderCommand(phoneNumber) {
  const user = await getUserByPhoneNumber(phoneNumber);

  if (!user) {
    return "User belum terdaftar.";
  }

  const travelDuration = await getTravelDuration(user.id);
  const todaySchedules = await scheduleService.getTodaySchedule(user.id);

  if (!todaySchedules || todaySchedules.length === 0) {
    return "Tidak ada jadwal kerja untuk hari ini.";
  }

  const schedule = todaySchedules[0];
  const calculated = calculateSchedule(schedule, travelDuration);

  if (calculated.status === "OFF" || calculated.isOff) {
    return "🏖️ Hari ini LIBUR. Tidak ada pengingat kerja yang aktif.";
  }

  const reminder = await reminderService.getTodayReminderForUser(user.id);

  return formatReminderStatus(reminder, calculated);
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
      "/perjalanan [menit]",
      "/set-h <Hari> <Jam>",
      "/reminder",
      "/help",
    ].join("\n");
  }

  if (command === "jadwal") {
    return await handleScheduleCommand(args, phoneNumber);
  }

  if (command === "update") {
    return await handleUpdateScheduleCommand(args, phoneNumber);
  }

  if (command === "perjalanan" || command === "travel") {
    return await handleTravelDurationCommand(args, phoneNumber);
  }

  if (command === "set-h" || command === "seth") {
    return await handleHalfDayCommand(args, phoneNumber);
  }

  if (command === "reminder") {
    return await handleReminderCommand(phoneNumber);
  }

  return "Command tidak dikenali. Ketik /help untuk melihat daftar command.";
}

module.exports = {
  handleCommand,
  handleMessage,
};
