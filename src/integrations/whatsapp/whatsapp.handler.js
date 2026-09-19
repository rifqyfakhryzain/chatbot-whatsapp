function handleCommand(command, args) {
  if (command === "help") {
    return [
      "Daftar command:",
      "",
      "/jadwal",
      "/jadwal hariini",
      "/jadwal besok",
      "/jadwal minggu",
      "/reminder",
      "/settings",
      "/help",
    ].join("\n");
  }

  return "Command tidak dikenali. Ketik /help untuk melihat daftar command.";
}

module.exports = {
  handleCommand,
};
