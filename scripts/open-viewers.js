const { spawn } = require("child_process");

const projectPath = process.cwd();

function openTerminal(title, command) {
  spawn(
    "cmd.exe",
    [
      "/c",
      "start",
      title,
      "powershell.exe",
      "-NoExit",
      "-Command",
      `Set-Location -LiteralPath '${projectPath}'; ${command}`,
    ],
    {
      detached: true,
      stdio: "ignore",
    },
  );
}

openTerminal("WhatsApp QR", "node src/utils/qr-viewer.js");

openTerminal("WhatsApp Messages", "node src/utils/message-viewer.js");

openTerminal("WhatsApp Connection", "node src/utils/connection-viewer.js");
