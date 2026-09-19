const fs = require("fs/promises");
const path = require("path");
const pino = require("pino");

const createWhatsAppAuth = require("./whatsapp.auth");
const registerWhatsAppEvents = require("./whatsapp.events");
const { logQR, saveQR, logConnection } = require("../../utils/logger");

async function createWhatsAppClient() {
  const { state, saveCreds } = await createWhatsAppAuth();

  const { default: makeWASocket, DisconnectReason } = await import("baileys");

  const logger = pino({
    level: "silent",
  });

  const socket = makeWASocket({
    auth: state,
    logger,
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", ({ connection, qr, lastDisconnect }) => {
    if (qr) {
      logConnection("WhatsApp QR code received");

      logQR("WhatsApp QR code received");
      saveQR(qr);
    }

    if (connection === "open") {
      logConnection("WhatsApp connected");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;

      logConnection("WhatsApp connection closed");
      logConnection(`Disconnect status code: ${statusCode}`);

      if (statusCode === DisconnectReason.restartRequired) {
        logConnection("WhatsApp requires connection restart.");

        createWhatsAppClient().catch((error) => {
          logConnection(`Failed to restart WhatsApp: ${error.message}`);
        });

        return;
      }

      if (statusCode === DisconnectReason.loggedOut) {
        logConnection("WhatsApp session was logged out.");
        logConnection("Clearing old WhatsApp session...");

        const authPath = path.join(process.cwd(), "auth", "whatsapp");

        fs.rm(authPath, {
          recursive: true,
          force: true,
        })
          .then(() => {
            logConnection("Old WhatsApp session cleared.");
            logConnection("Starting new WhatsApp authentication...");

            return createWhatsAppClient();
          })
          .catch((error) => {
            logConnection(`Failed to clear WhatsApp session: ${error.message}`);
          });

        return;
      }

      logConnection("WhatsApp connection closed for another reason.");
    }
  });

  registerWhatsAppEvents(socket);

  return socket;
}

module.exports = createWhatsAppClient;
