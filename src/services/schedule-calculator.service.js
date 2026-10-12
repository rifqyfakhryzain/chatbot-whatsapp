const {
  addHoursToTime,
  calculateOtwDateTime,
  resolveDateString,
} = require("../utils/time-calculator");

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

function formatDateInfo(dateInput) {
  const dateStr = resolveDateString(dateInput);
  const [year, month, day] = dateStr.split("-").map(Number);

  // Gunakan jam tengah hari UTC untuk hindari pergeseran hari karena timezone
  const dateObj = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));

  const dayName = DAY_NAMES[dateObj.getUTCDay()];

  const dateText = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return {
    dateStr,
    dayName,
    dateText,
  };
}

function calculateSchedule(schedule, travelDuration = 30) {
  if (!schedule) {
    throw new Error("Data jadwal wajib diberikan.");
  }

  const shift = schedule.shift;

  if (!shift) {
    throw new Error("Data shift pada jadwal tidak ditemukan.");
  }

  const { dateStr, dayName, dateText } = formatDateInfo(schedule.date);
  const shiftCode = shift.code.toUpperCase();
  const duration = Number(travelDuration) || 30;

  // Kasus 1: Shift X (Free Day / Libur)
  if (shiftCode === "X") {
    return {
      scheduleId: schedule.id,
      date: dateStr,
      dayName,
      dateText,
      shiftCode: shift.code,
      shiftName: shift.name,
      status: "OFF",
      isOff: true,
      isHalfDay: false,
      isConfigured: true,
      startTime: null,
      endTime: null,
      workHours: 0,
      travelDuration: duration,
      otwTime: null,
      otwDateTime: null,
      notes: "Hari libur (Free Day)",
    };
  }

  // Kasus 2: Shift H (Half Day / 4 Jam Kerja)
  if (shiftCode === "H") {
    const customStart = schedule.customStartTime;

    if (customStart) {
      const endTime = addHoursToTime(customStart, 4);
      const { otwTime, otwDateTime } = calculateOtwDateTime(
        dateStr,
        customStart,
        duration
      );

      return {
        scheduleId: schedule.id,
        date: dateStr,
        dayName,
        dateText,
        shiftCode: shift.code,
        shiftName: shift.name,
        status: "HALF_DAY",
        isOff: false,
        isHalfDay: true,
        isConfigured: true,
        startTime: customStart,
        endTime,
        workHours: 4,
        travelDuration: duration,
        otwTime,
        otwDateTime,
        notes: "Half Day (4 jam kerja)",
      };
    }

    return {
      scheduleId: schedule.id,
      date: dateStr,
      dayName,
      dateText,
      shiftCode: shift.code,
      shiftName: shift.name,
      status: "HALF_DAY",
      isOff: false,
      isHalfDay: true,
      isConfigured: false,
      startTime: null,
      endTime: null,
      workHours: 4,
      travelDuration: duration,
      otwTime: null,
      otwDateTime: null,
      notes: "Jam masuk belum ditentukan",
    };
  }

  // Kasus 3: Shift Reguler (O, O1, O2, M, M1, M2, dll.)
  const startTime = shift.startTime;
  const endTime = shift.endTime;

  let otwTime = null;
  let otwDateTime = null;

  if (startTime) {
    const calculated = calculateOtwDateTime(dateStr, startTime, duration);
    otwTime = calculated.otwTime;
    otwDateTime = calculated.otwDateTime;
  }

  return {
    scheduleId: schedule.id,
    date: dateStr,
    dayName,
    dateText,
    shiftCode: shift.code,
    shiftName: shift.name,
    status: "WORKING",
    isOff: false,
    isHalfDay: false,
    isConfigured: true,
    startTime: startTime || null,
    endTime: endTime || null,
    workHours: shift.workHours || 9,
    travelDuration: duration,
    otwTime,
    otwDateTime,
    notes: null,
  };
}

function calculateSchedules(schedules, travelDuration = 30) {
  if (!Array.isArray(schedules)) {
    return [];
  }

  return schedules.map((schedule) =>
    calculateSchedule(schedule, travelDuration)
  );
}

module.exports = {
  calculateSchedule,
  calculateSchedules,
  formatDateInfo,
};
