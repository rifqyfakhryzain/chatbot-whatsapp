const app = require("./app");
const createWhatsAppClient = require("./integrations/whatsapp/whatsapp.client");

const PORT = 3000;

async function startServer() {
  try {
    await createWhatsAppClient();

    app.listen(PORT, () => {
      console.log(`ChatBot WhatsApp server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start ChatBot WhatsApp:", error);
    process.exit(1);
  }
}

startServer();
