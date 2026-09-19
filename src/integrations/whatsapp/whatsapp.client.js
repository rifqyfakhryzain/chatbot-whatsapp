const qrcode = require("qrcode-terminal");
const pino = require("pino");

const createWhatsAppAuth = require("./whatsapp.auth");

async function createWhatsAppClient() {
  const { state, saveCreds } = await createWhatsAppAuth();

  const { default: makeWASocket } = await import("baileys");

  const logger = pino({
    level: "silent",
  });

  const socket = makeWASocket({
    auth: state,
    logger,
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", ({ connection, qr }) => {
    if (qr) {
      console.log("WhatsApp QR code received");

      qrcode.generate(qr, {
        small: true,
      });
    }

    if (connection === "open") {
      console.log("WhatsApp connected");
    }

    if (connection === "close") {
      console.log("WhatsApp connection closed");
    }
  });

  return socket;
}

module.exports = createWhatsAppClient;
