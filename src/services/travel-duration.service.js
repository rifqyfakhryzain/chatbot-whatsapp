const userRepository = require("../repositories/user.repository");

function parseTravelDurationInput(input) {
  if (input === undefined || input === null || String(input).trim() === "") {
    throw new Error("Durasi perjalanan tidak boleh kosong.");
  }

  const trimmed = String(input).trim();
  const parsed = Number(trimmed);

  if (!Number.isInteger(parsed) || !/^\d+$/.test(trimmed)) {
    throw new Error(
      "Durasi perjalanan harus berupa angka bulat dalam satuan menit (contoh: 45)."
    );
  }

  if (parsed < 1 || parsed > 300) {
    throw new Error(
      "Durasi perjalanan harus berada di antara 1 sampai 300 menit."
    );
  }

  return parsed;
}

async function getTravelDuration(userId) {
  if (!userId) {
    throw new Error("User ID wajib diisi.");
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  return user.travelDuration ?? 30;
}

async function updateTravelDuration(userId, minutesInput) {
  if (!userId) {
    throw new Error("User ID wajib diisi.");
  }

  const minutes = parseTravelDurationInput(minutesInput);

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new Error("User tidak ditemukan.");
  }

  const updatedUser = await userRepository.updateTravelDuration(
    userId,
    minutes
  );

  return {
    userId: updatedUser.id,
    travelDuration: updatedUser.travelDuration,
  };
}

module.exports = {
  parseTravelDurationInput,
  getTravelDuration,
  updateTravelDuration,
};
