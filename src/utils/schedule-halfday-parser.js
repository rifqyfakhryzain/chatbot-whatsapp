const { isValidTimeFormat } = require("./time-calculator");

const VALID_DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

function normalizeDay(inputDay) {
  if (!inputDay || typeof inputDay !== "string") {
    return null;
  }

  const clean = inputDay.trim().toLowerCase();

  return (
    VALID_DAYS.find((day) => day.toLowerCase() === clean) || null
  );
}

function parseHalfDayInput(input) {
  if (!input) {
    throw new Error(
      "Format command tidak valid. Gunakan: /set-h <Hari> <Jam> (contoh: /set-h Kamis 10:00)"
    );
  }

  let dayPart = "";
  let timePart = "";

  if (Array.isArray(input)) {
    dayPart = input[0] || "";
    timePart = input[1] || "";
  } else if (typeof input === "string") {
    // Menghapus command prefix jika ada
    const cleaned = input.replace(/^\/set-h\s+/i, "").trim();
    const parts = cleaned.split(/\s+/);
    dayPart = parts[0] || "";
    timePart = parts[1] || "";
  }

  if (!dayPart || !timePart) {
    throw new Error(
      "Format command tidak valid. Gunakan: /set-h <Hari> <Jam> (contoh: /set-h Kamis 10:00)"
    );
  }

  const normalizedDay = normalizeDay(dayPart);

  if (!normalizedDay) {
    throw new Error(
      `Hari "${dayPart}" tidak valid. Pilihan hari: ${VALID_DAYS.join(", ")}.`
    );
  }

  if (!isValidTimeFormat(timePart)) {
    throw new Error(
      `Format waktu "${timePart}" tidak valid. Format yang diharapkan adalah HH:mm (contoh: 10:00).`
    );
  }

  return {
    day: normalizedDay,
    time: timePart.trim(),
  };
}

module.exports = {
  VALID_DAYS,
  normalizeDay,
  parseHalfDayInput,
};
