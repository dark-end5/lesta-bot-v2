module.exports = (sock, msg, command) => {
  const from = msg.key.remoteJid;

  if (command === "play") {
    sock.sendMessage(from, { text: "🎵 Searching song..." });
    return true;
  }

  return false;
};
