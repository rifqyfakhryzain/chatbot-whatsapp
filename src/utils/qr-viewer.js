const fs = require("fs");
const path = require("path");
const qrcode = require("qrcode-terminal");

const qrFilePath = path.join(process.cwd(), "logs", "whatsapp-qr.txt");

function clearTerminal() {
  process.stdout.write("\x1Bc");
}

function showQRCode() {
  if (!fs.existsSync(qrFilePath)) {
    return;
  }

  const qr = fs.readFileSync(qrFilePath, "utf8").trim();

  if (!qr) {
    return;
  }

  clearTerminal();

  console.log("===============================");
  console.log("       WhatsApp QR Code");
  console.log("===============================");
  console.log("");

  qrcode.generate(qr, {
    small: true,
  });

  console.log("");
  console.log("Scan this QR code using WhatsApp.");
}

showQRCode();

fs.watchFile(
  qrFilePath,
  {
    interval: 500,
  },
  () => {
    showQRCode();
  },
);
