const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function parseWeeklySchedule(input) {
  if (typeof input !== "string") {
    throw new Error("Input jadwal harus berupa text.");
  }

  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const schedules = [];
  const detectedDays = new Set();

  for (const line of lines) {
    const match = line.match(/^([^:]+)\s*:\s*(\S+)$/);

    if (!match) {
      throw new Error(
        `Format input tidak valid pada baris: "${line}". Gunakan format "Hari : SHIFT".`,
      );
    }

    const rawDay = match[1].trim();
    const shiftCode = match[2].trim().toUpperCase();

    const day = DAYS.find(
      (item) => item.toLowerCase() === rawDay.toLowerCase(),
    );

    if (!day) {
      throw new Error(`Nama hari tidak valid: "${rawDay}".`);
    }

    if (detectedDays.has(day)) {
      throw new Error(
        `Hari "${day}" tidak boleh dimasukkan lebih dari satu kali.`,
      );
    }

    detectedDays.add(day);

    schedules.push({
      day,
      shiftCode,
    });
  }

  return schedules;
}

module.exports = {
  parseWeeklySchedule,
};
