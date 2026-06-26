module.exports = (sock, msg, command) => {
  const from = msg.key.remoteJid;

  if (command === "joke") {
    sock.sendMessage(from, { text: "😂 Why did the bot go offline? It needed coffee!" });
    return true;
  }

  if (command === "quote") {
    sock.sendMessage(from, { text: "⚡ Stay consistent, not perfect." });
    return true;
  }

  return false;
};
