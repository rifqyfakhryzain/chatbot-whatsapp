const fs = require("fs");
const path = require("path");

const logsDirectory = path.join(process.cwd(), "logs");

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory, {
    recursive: true,
  });
}

function writeLog(fileName, message) {
  const filePath = path.join(logsDirectory, fileName);

  const timestamp = new Date().toISOString();

  const logMessage = `[${timestamp}] ${message}\n`;

  fs.appendFileSync(filePath, logMessage);
}

function logServer(message) {
  writeLog("server.log", message);
}

function logQR(message) {
  writeLog("whatsapp-qr.log", message);
}

function logMessage(message) {
  writeLog("whatsapp-message.log", message);
}

function logConnection(message) {
  writeLog("whatsapp-connection.log", message);
}

function saveQR(qr) {
  const filePath = path.join(logsDirectory, "whatsapp-qr.txt");

  fs.writeFileSync(filePath, qr);
}

module.exports = {
  logServer,
  logQR,
  logMessage,
  logConnection,
  saveQR,
};
