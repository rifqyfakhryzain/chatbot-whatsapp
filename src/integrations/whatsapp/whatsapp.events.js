const { logMessage } = require("../../utils/logger");

function registerWhatsAppEvents(socket) {
  socket.ev.on("messages.upsert", (event) => {
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
    }
  });
}

module.exports = registerWhatsAppEvents;
