function parseCommand(text) {
  if (!text || !text.startsWith("/")) {
    return null;
  }

  const parts = text.trim().split(/\s+/);

  const command = parts[0].slice(1).toLowerCase();

  const args = parts.slice(1);

  return {
    command,
    args,
  };
}

module.exports = {
  parseCommand,
};
