// Suppress noisy internal libsignal logs (Closing session, Opening session, etc.)
const originalConsoleInfo = console.info;
console.info = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Closing session") ||
      args[0].includes("Opening session") ||
      args[0].includes("Migrating session") ||
      args[0].includes("Removing old closed session"))
  ) {
    return;
  }
  originalConsoleInfo(...args);
};

const originalConsoleWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("Session already closed") ||
      args[0].includes("Session already open") ||
      args[0].includes("Closing open session") ||
      args[0].includes("Decrypted message with closed session"))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

const app = require("./app");
const createWhatsAppClient = require("./integrations/whatsapp/whatsapp.client");
const { logServer } = require("./utils/logger");

const PORT = 3000;

app.listen(PORT, async () => {
  const message = `ChatBot WhatsApp server is running on port ${PORT}`;

  console.log(message);
  logServer(message);

  await createWhatsAppClient();
});
