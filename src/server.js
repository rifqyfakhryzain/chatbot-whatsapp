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
