function formatWeeklySchedulePreview(draft) {
  if (!draft || !Array.isArray(draft.schedules)) {
    throw new Error("Draft jadwal tidak valid.");
  }

  const lines = ["Preview Jadwal Kerja Mingguan", ""];

  for (const schedule of draft.schedules) {
    lines.push(`${schedule.day} (${schedule.date}) : ${schedule.shiftCode}`);
  }

  lines.push("");
  lines.push("Apakah jadwal ini sudah benar?");
  lines.push("Balas YES untuk menyimpan.");
  lines.push("Balas NO untuk membatalkan.");

  return lines.join("\n");
}

module.exports = {
  formatWeeklySchedulePreview,
};
