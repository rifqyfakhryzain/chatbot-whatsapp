const { logMessage } = require("../../utils/logger");
const { sendTextMessage } = require("./whatsapp.service");

function registerWhatsAppEvents(socket) {
  socket.ev.on("messages.upsert", async (event) => {
    if (event.type !== "notify") {
      return;
    }

    if (event.requestId) {
      return;
    }

    for (const message of event.messages) {
      if (message.key.fromMe) {
        continue;
      }

      const remoteJid = message.key.remoteJid;

      const text =
        message.message?.conversation ||
        message.message?.extendedTextMessage?.text;

      const messageLog = [
        "Incoming WhatsApp message",
        `From: ${remoteJid}`,
        `Text: ${text || "[non-text message]"}`,
      ].join("\n");

      logMessage(messageLog);

      if (!text) {
        continue;
      }

      await sendTextMessage(
        socket,
        remoteJid,
        "Halo! Pesan kamu sudah diterima.",
      );
    }
  });
}

module.exports = registerWhatsAppEvents;
