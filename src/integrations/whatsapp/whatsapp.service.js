async function sendTextMessage(socket, jid, text) {
  await socket.sendMessage(jid, {
    text,
  });
}

module.exports = {
  sendTextMessage,
};
