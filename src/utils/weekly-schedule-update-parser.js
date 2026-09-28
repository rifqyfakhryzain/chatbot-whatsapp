const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function parseWeeklyScheduleUpdate(input) {
  if (typeof input !== "string") {
    throw new Error("Input update jadwal harus berupa text.");
  }

  const normalizedInput = input.trim();

  const match = normalizedInput.match(/^\/update\s+jadwal\s+(\S+)\s+(\S+)$/i);

  if (!match) {
    throw new Error(
      'Format update tidak valid. Gunakan format "/update jadwal Hari SHIFT".',
    );
  }

  const rawDay = match[1].trim();
  const shiftCode = match[2].trim().toUpperCase();

  const day = DAYS.find((item) => item.toLowerCase() === rawDay.toLowerCase());

  if (!day) {
    throw new Error(`Nama hari tidak valid: "${rawDay}".`);
  }

  if (!shiftCode) {
    throw new Error("Shift wajib diisi.");
  }

  return {
    day,
    shiftCode,
  };
}

module.exports = {
  parseWeeklyScheduleUpdate,
};
