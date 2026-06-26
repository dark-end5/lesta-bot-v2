module.exports = (sock, msg, command) => {
  const from = msg.key.remoteJid;

  if (command === "tagall") {
    sock.groupMetadata(from).then(meta => {
      const users = meta.participants.map(p => p.id);

      sock.sendMessage(from, {
        text: users.map(u => `@${u.split("@")[0]}`).join(" "),
        mentions: users
      });
    });

    return true;
  }

  if (command === "antilink") {
    sock.sendMessage(from, { text: "Antilink toggled (basic)" });
    return true;
  }

  return false;
};
      
