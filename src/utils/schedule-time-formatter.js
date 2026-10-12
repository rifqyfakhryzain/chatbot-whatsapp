function formatSingleCalculatedSchedule(calc) {
  if (!calc) {
    return "";
  }

  // Kasus 1: Hari Libur (Shift X)
  if (calc.status === "OFF" || calc.isOff) {
    return [
      `📅 ${calc.dateText}`,
      `Shift: ${calc.shiftCode} - ${calc.shiftName}`,
      "🏖️ Hari ini LIBUR. Selamat beristirahat!",
    ].join("\n");
  }

  // Kasus 2: Shift Half Day (H)
  if (calc.status === "HALF_DAY" || calc.isHalfDay) {
    if (!calc.isConfigured || !calc.startTime) {
      return [
        `📅 ${calc.dateText}`,
        `Shift: ${calc.shiftCode} - ${calc.shiftName} (4 Jam Kerja)`,
        "⚠️ Jam masuk belum ditentukan.",
        `Ketik: /set-h ${calc.dayName} 10:00 untuk mengatur jam masuk.`,
      ].join("\n");
    }

    return [
      `📅 ${calc.dateText}`,
      `Shift: ${calc.shiftCode} - ${calc.shiftName} (4 Jam Kerja)`,
      `Jam: ${calc.startTime} - ${calc.endTime}`,
      `🚗 Durasi Perjalanan: ${calc.travelDuration} menit`,
      `⏰ Waktu OTW: ${calc.otwTime} WIB`,
    ].join("\n");
  }

  // Kasus 3: Shift Reguler (WORKING)
  const lines = [
    `📅 ${calc.dateText}`,
    `Shift: ${calc.shiftCode} - ${calc.shiftName}`,
    `Jam: ${calc.startTime || "-"} - ${calc.endTime || "-"}`,
    `🚗 Durasi Perjalanan: ${calc.travelDuration} menit`,
  ];

  if (calc.otwTime) {
    lines.push(`⏰ Waktu OTW: ${calc.otwTime} WIB`);
  }

  return lines.join("\n");
}

function formatDailySchedules(calculatedList, emptyMessage) {
  if (!calculatedList || calculatedList.length === 0) {
    return emptyMessage || "Tidak ada jadwal.";
  }

  return calculatedList.map(formatSingleCalculatedSchedule).join("\n\n");
}

function formatDateShort(dateStr) {
  // dateStr format: YYYY-MM-DD
  if (!dateStr || typeof dateStr !== "string") {
    return "";
  }

  const parts = dateStr.split("-");
  if (parts.length < 3) {
    return dateStr;
  }

  const day = parts[2];
  const monthNum = parseInt(parts[1], 10);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const monthName = monthNames[monthNum - 1] || parts[1];

  return `${day} ${monthName}`;
}

function formatWeeklySchedulesSummary(
  calculatedList,
  travelDuration = 30,
  emptyMessage
) {
  if (!calculatedList || calculatedList.length === 0) {
    return emptyMessage || "Tidak ada jadwal untuk minggu ini.";
  }

  const lines = ["📅 Jadwal Minggu Ini", ""];

  for (const item of calculatedList) {
    const shortDate = formatDateShort(item.date);
    const dayLabel = `${item.dayName} (${shortDate})`.padEnd(17, " ");

    if (item.status === "OFF" || item.isOff) {
      lines.push(`${dayLabel} : ${item.shiftCode} (LIBUR)`);
    } else if (item.status === "HALF_DAY") {
      if (!item.isConfigured || !item.startTime) {
        lines.push(`${dayLabel} : ${item.shiftCode} (Jam belum diatur)`);
      } else {
        lines.push(
          `${dayLabel} : ${item.shiftCode} (${item.startTime}) ➔ OTW ${item.otwTime}`
        );
      }
    } else {
      const timeInfo = item.startTime
        ? `(${item.startTime}) ➔ OTW ${item.otwTime || "-"}`
        : "-";
      lines.push(`${dayLabel} : ${item.shiftCode} ${timeInfo}`);
    }
  }

  lines.push("");
  lines.push(`🚗 Durasi perjalanan: ${travelDuration} menit`);

  return lines.join("\n");
}

function formatTravelDurationInfo(duration) {
  return [
    "🚗 Durasi Perjalanan",
    `Saat ini: ${duration} menit`,
    "",
    "Untuk mengubah, ketik:",
    "/perjalanan <menit> (contoh: /perjalanan 45)",
  ].join("\n");
}

function formatTravelDurationSuccess(duration) {
  return `✅ Durasi perjalanan berhasil diubah menjadi ${duration} menit.`;
}

function formatHalfDaySuccess(result) {
  const calc = result.calculated;

  return [
    "✅ Jam masuk Half Day berhasil diatur!",
    "",
    `📅 ${calc.dateText}`,
    `Shift: ${calc.shiftCode} - ${calc.shiftName} (4 Jam Kerja)`,
    `Jam: ${calc.startTime} - ${calc.endTime}`,
    `🚗 Durasi Perjalanan: ${calc.travelDuration} menit`,
    `⏰ Waktu OTW: ${calc.otwTime} WIB`,
  ].join("\n");
}

module.exports = {
  formatSingleCalculatedSchedule,
  formatDailySchedules,
  formatWeeklySchedulesSummary,
  formatTravelDurationInfo,
  formatTravelDurationSuccess,
  formatHalfDaySuccess,
};
