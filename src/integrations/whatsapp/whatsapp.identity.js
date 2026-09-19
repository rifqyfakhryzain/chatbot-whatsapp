async function resolvePhoneNumber(socket, remoteJid) {
  if (!remoteJid) {
    return null;
  }

  if (remoteJid.endsWith("@s.whatsapp.net")) {
    return remoteJid.replace("@s.whatsapp.net", "");
  }

  if (remoteJid.endsWith("@lid")) {
    const phoneJid =
      await socket.signalRepository?.lidMapping?.getPNForLID(remoteJid);

    if (!phoneJid) {
      return null;
    }

    return phoneJid.replace("@s.whatsapp.net", "").split(":")[0];
  }

  return null;
}

module.exports = {
  resolvePhoneNumber,
};
