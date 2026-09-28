const pendingSchedules = new Map();

function setPendingSchedule(userId, draft) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  if (!draft || !Array.isArray(draft.schedules)) {
    throw new Error("Draft jadwal tidak valid.");
  }

  pendingSchedules.set(userId, draft);

  return draft;
}

function getPendingSchedule(userId) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  return pendingSchedules.get(userId) || null;
}

function clearPendingSchedule(userId) {
  if (!userId) {
    throw new Error("User ID wajib diberikan.");
  }

  pendingSchedules.delete(userId);
}

module.exports = {
  setPendingSchedule,
  getPendingSchedule,
  clearPendingSchedule,
};
