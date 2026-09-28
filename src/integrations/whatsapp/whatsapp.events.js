const { logMessage } = require("../../utils/logger");
const { sendTextMessage } = require("./whatsapp.service");
const { parseCommand } = require("./whatsapp.command");
const { handleCommand, handleMessage } = require("./whatsapp.handler");
const { resolvePhoneNumber } = require("./whatsapp.identity");

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

      const parsedCommand = parseCommand(text);

      const phoneNumber = await resolvePhoneNumber(socket, remoteJid);

      logMessage(`Resolved phone number: ${phoneNumber || "[not found]"}`);

      let responseText = null;

      if (parsedCommand) {
        logMessage(
          `Command detected: ${parsedCommand.command}\nArgs: ${JSON.stringify(
            parsedCommand.args,
          )}`,
        );

        responseText = await handleCommand(
          parsedCommand.command,
          parsedCommand.args,
          phoneNumber,
        );
      } else {
        logMessage("Non-command message detected.");

        responseText = await handleMessage(text, phoneNumber);
      }

      if (responseText) {
        await sendTextMessage(socket, remoteJid, responseText);
      }
    }
  });
}

module.exports = registerWhatsAppEvents;
