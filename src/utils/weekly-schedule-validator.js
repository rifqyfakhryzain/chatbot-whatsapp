const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function validateWeeklySchedule(schedules) {
  if (!Array.isArray(schedules)) {
    throw new Error("Data jadwal harus berupa array.");
  }

  if (schedules.length !== 7) {
    throw new Error(
      `Jadwal mingguan harus berisi tepat 7 hari. Ditemukan ${schedules.length} hari.`,
    );
  }

  const detectedDays = new Set();

  for (const schedule of schedules) {
    if (!schedule || typeof schedule !== "object") {
      throw new Error("Format data jadwal tidak valid.");
    }

    const { day, shiftCode } = schedule;

    if (!day) {
      throw new Error("Nama hari wajib diisi.");
    }

    if (!DAYS.includes(day)) {
      throw new Error(`Nama hari tidak valid: "${day}".`);
    }

    if (detectedDays.has(day)) {
      throw new Error(
        `Hari "${day}" tidak boleh dimasukkan lebih dari satu kali.`,
      );
    }

    detectedDays.add(day);

    if (!shiftCode || typeof shiftCode !== "string") {
      throw new Error(`Shift untuk hari "${day}" wajib diisi.`);
    }

    if (!shiftCode.trim()) {
      throw new Error(`Shift untuk hari "${day}" wajib diisi.`);
    }
  }

  for (const day of DAYS) {
    if (!detectedDays.has(day)) {
      throw new Error(`Hari "${day}" belum dimasukkan.`);
    }
  }

  return true;
}

module.exports = {
  validateWeeklySchedule,
};
