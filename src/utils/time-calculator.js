const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

function isValidTimeFormat(timeStr) {
  if (typeof timeStr !== "string") {
    return false;
  }

  return TIME_REGEX.test(timeStr.trim());
}

function parseTime(timeStr) {
  if (!isValidTimeFormat(timeStr)) {
    throw new Error(
      `Format waktu tidak valid: "${timeStr}". Format yang diharapkan adalah HH:mm (contoh: 13:00).`
    );
  }

  const [hours, minutes] = timeStr.trim().split(":").map(Number);

  return { hours, minutes };
}

function formatTime(hours, minutes) {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function addHoursToTime(timeStr, hoursToAdd) {
  const { hours, minutes } = parseTime(timeStr);
  const totalMinutes = hours * 60 + minutes + Math.round(hoursToAdd * 60);

  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const newHours = Math.floor(normalizedMinutes / 60);
  const newMinutes = normalizedMinutes % 60;

  return formatTime(newHours, newMinutes);
}

function subtractMinutesFromTime(timeStr, minutesToSubtract) {
  const { hours, minutes } = parseTime(timeStr);
  const totalMinutes = hours * 60 + minutes - minutesToSubtract;

  const normalizedMinutes = ((totalMinutes % 1440) + 1440) % 1440;
  const newHours = Math.floor(normalizedMinutes / 60);
  const newMinutes = normalizedMinutes % 60;

  return formatTime(newHours, newMinutes);
}

function resolveDateString(dateInput) {
  if (!dateInput) {
    throw new Error("Tanggal tidak boleh kosong.");
  }

  if (typeof dateInput === "string") {
    // Jika format YYYY-MM-DD
    const match = dateInput.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return match[0];
    }
  }

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Format tanggal tidak valid.");
  }

  return date.toISOString().split("T")[0];
}

function calculateOtwDateTime(dateInput, startTimeStr, travelDurationMinutes = 30) {
  const dateStr = resolveDateString(dateInput);
  const { hours, minutes } = parseTime(startTimeStr);

  const startDateTime = new Date(
    `${dateStr}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+07:00`
  );

  const otwDateTime = new Date(
    startDateTime.getTime() - travelDurationMinutes * 60 * 1000
  );

  const otwTime = subtractMinutesFromTime(startTimeStr, travelDurationMinutes);

  return {
    dateStr,
    startTime: startTimeStr,
    otwTime,
    startDateTime,
    otwDateTime,
  };
}

module.exports = {
  isValidTimeFormat,
  parseTime,
  formatTime,
  addHoursToTime,
  subtractMinutesFromTime,
  resolveDateString,
  calculateOtwDateTime,
};
