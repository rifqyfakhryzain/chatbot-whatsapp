const fs = require("fs");
const path = require("path");

const messageLogPath = path.join(process.cwd(), "logs", "whatsapp-message.log");

function displayMessages() {
  if (!fs.existsSync(messageLogPath)) {
    console.log("WhatsApp message log not found.");
    return;
  }

  const messages = fs.readFileSync(messageLogPath, "utf8");

  console.clear();

  console.log("================================");
  console.log("     WhatsApp Incoming Messages");
  console.log("================================");
  console.log();

  console.log(messages);
}

displayMessages();

fs.watch(messageLogPath, () => {
  displayMessages();
});
