const CONFIRMATION_YES = ["YES", "Y"];
const CONFIRMATION_NO = ["NO", "N"];

function parseScheduleConfirmation(input) {
  if (typeof input !== "string") {
    throw new Error("Input konfirmasi harus berupa text.");
  }

  const normalizedInput = input.trim().toUpperCase();

  if (CONFIRMATION_YES.includes(normalizedInput)) {
    return {
      confirmed: true,
    };
  }

  if (CONFIRMATION_NO.includes(normalizedInput)) {
    return {
      confirmed: false,
    };
  }

  return {
    confirmed: null,
  };
}

module.exports = {
  parseScheduleConfirmation,
};
