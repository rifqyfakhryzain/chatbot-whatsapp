const cron = require("node-cron");
const { getDueReminders, markReminderSent, markReminderFailed } = require("./reminder.service");
const { calculateSchedule } = require("./schedule-calculator.service");
const { formatOtwReminderMessage } = require("../utils/reminder-formatter");
const { sendTextMessage } = require("../integrations/whatsapp/whatsapp.service");
const { logMessage, logServer } = require("../utils/logger");

let cronTask = null;
let socketGetter = null;

function setSocketGetter(getterFn) {
  socketGetter = getterFn;
}

async function checkAndSendReminders() {
  const currentTime = new Date();

  let dueReminders = [];
  try {
    dueReminders = await getDueReminders(currentTime);
  } catch (error) {
    console.error("Gagal memeriksa due reminders:", error.message);
    return { processed: 0, error: error.message };
  }

  if (dueReminders.length === 0) {
    return { processed: 0 };
  }

  const socket = socketGetter ? socketGetter() : null;

  if (!socket) {
    console.warn("Scheduler: WhatsApp socket belum siap, menunda pengiriman reminder.");
    return { processed: 0, warning: "Socket not ready" };
  }

  let sentCount = 0;

  for (const reminder of dueReminders) {
    const user = reminder.user;
    const schedule = reminder.schedule;

    if (!user || !user.phoneNumber || !schedule) {
      await markReminderFailed(reminder.id, "Data user atau schedule tidak lengkap.");
      continue;
    }

    try {
      const cleanPhone = user.phoneNumber.replace(/\D/g, "");
      const jid = `${cleanPhone}@s.whatsapp.net`;

      const calculated = calculateSchedule(schedule, user.travelDuration || 30);
      const textMessage = formatOtwReminderMessage(reminder, calculated, user.name);

      await sendTextMessage(socket, jid, textMessage);

      await markReminderSent(reminder.id, new Date());

      const logText = `[REMINDER OTW] Terkirim ke ${user.name || cleanPhone} (${jid}) untuk Shift ${calculated.shiftCode}`;
      console.log(logText);
      logMessage(logText);

      sentCount++;
    } catch (sendError) {
      console.error(`Gagal mengirim reminder (${reminder.id}):`, sendError.message);
      await markReminderFailed(reminder.id, sendError.message);
    }
  }

  return { processed: sentCount };
}

function startScheduler() {
  if (cronTask) {
    return cronTask;
  }

  cronTask = cron.schedule("* * * * *", async () => {
    try {
      await checkAndSendReminders();
    } catch (err) {
      console.error("Error pada cron runner reminder:", err.message);
    }
  });

  const msg = "Scheduler service started: pengecekan reminder aktif setiap menit.";
  console.log(msg);
  logServer(msg);

  return cronTask;
}

function stopScheduler() {
  if (cronTask) {
    cronTask.stop();
    cronTask = null;
    console.log("Scheduler service stopped.");
  }
}

module.exports = {
  setSocketGetter,
  checkAndSendReminders,
  startScheduler,
  stopScheduler,
};
