const { logMessage } = require("../../utils/logger");
const { sendTextMessage } = require("./whatsapp.service");
const { parseCommand } = require("./whatsapp.command");
const { handleCommand } = require("./whatsapp.handler");

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

      const parsedCommand = parseCommand(text);

      const messageLog = [
        "Incoming WhatsApp message",
        `From: ${remoteJid}`,
        `Text: ${text || "[non-text message]"}`,
      ].join("\n");

      logMessage(messageLog);

      if (!parsedCommand) {
        continue;
      }

      logMessage(
        `Command detected: ${parsedCommand.command}\nArgs: ${JSON.stringify(
          parsedCommand.args,
        )}`,
      );

      const responseText = handleCommand(
        parsedCommand.command,
        parsedCommand.args,
      );

      if (responseText) {
        await sendTextMessage(socket, remoteJid, responseText);
      }
    }
  });
}

module.exports = registerWhatsAppEvents;
