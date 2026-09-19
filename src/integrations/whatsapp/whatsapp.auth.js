const path = require("path");

async function createWhatsAppAuth() {
  const { useMultiFileAuthState } = await import("baileys");

  const authPath = path.join(process.cwd(), "auth", "whatsapp");

  const { state, saveCreds } = await useMultiFileAuthState(authPath);

  return {
    state,
    saveCreds,
  };
}

module.exports = createWhatsAppAuth;
