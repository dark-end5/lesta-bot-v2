module.exports = (sock, msg, command) => {
  const from = msg.key.remoteJid;

  if (command === "sticker") {
    sock.sendMessage(from, { text: "Send media for sticker feature" });
    return true;
  }

  if (command === "qr") {
    sock.sendMessage(from, { text: "QR generator coming soon" });
    return true;
  }

  if (command === "pp") {
    sock.sendMessage(from, { text: "Profile picture feature coming next update" });
    return true;
  }

  return false;
};
