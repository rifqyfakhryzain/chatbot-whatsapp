const fs = require("fs");
const path = require("path");

const connectionLogPath = path.join(
  process.cwd(),
  "logs",
  "whatsapp-connection.log",
);

function clearTerminal() {
  process.stdout.write("\x1Bc");
}

function showConnectionLogs() {
  if (!fs.existsSync(connectionLogPath)) {
    fs.writeFileSync(connectionLogPath, "");
  }

  const logs = fs.readFileSync(connectionLogPath, "utf8").trim();

  clearTerminal();

  console.log("===============================");
  console.log("   WhatsApp Connection Logs");
  console.log("===============================");
  console.log("");

  if (!logs) {
    console.log("Waiting for WhatsApp connection logs...");
    return;
  }

  console.log(logs);
}

showConnectionLogs();

fs.watchFile(
  connectionLogPath,
  {
    interval: 500,
  },
  () => {
    showConnectionLogs();
  },
);
