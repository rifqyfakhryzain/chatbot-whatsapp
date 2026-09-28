const DAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

function resolveWeeklyDates(referenceDate) {
  if (!referenceDate) {
    throw new Error("Tanggal acuan wajib diberikan.");
  }

  const date = new Date(referenceDate);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Tanggal acuan tidak valid.");
  }

  const dayIndex = (date.getDay() + 6) % 7;

  const monday = new Date(date);
  monday.setDate(date.getDate() - dayIndex);

  return DAYS.map((day, index) => {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + index);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(currentDate.getDate()).padStart(2, "0");

    return {
      day,
      date: `${year}-${month}-${dayOfMonth}`,
    };
  });
}

module.exports = {
  resolveWeeklyDates,
};
