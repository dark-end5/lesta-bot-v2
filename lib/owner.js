module.exports = (sock, msg, command) => {
  const from = msg.key.remoteJid;

  if (command === "autobio") {
    sock.updateProfileStatus("✨ Lesta Bot v2 Active");
    sock.sendMessage(from, { text: "Bio updated ✔️" });
    return true;
  }

  return false;
};
