module.exports = (sock, from, prefix) => {
  const text = `
╔══════════════════════╗
║ ✨ LESTA BOT v2 MENU ║
╠══════════════════════╣
║ 👑 OWNER
║ ${prefix}autobio
║ ${prefix}botmode
║
║ 👥 GROUP
║ ${prefix}antilink
║ ${prefix}tagall
║
║ 📥 DOWNLOAD
║ ${prefix}play
║ ${prefix}ytmp3
║
║ 🧰 TOOLS
║ ${prefix}sticker
║ ${prefix}qr
║ ${prefix}pp
║
║ 🎮 FUN
║ ${prefix}joke
║ ${prefix}quote
╚══════════════════════╝
`;

  sock.sendMessage(from, { text });
};
