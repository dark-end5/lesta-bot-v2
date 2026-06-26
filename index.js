const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const chalk = require("chalk");
const figlet = require("figlet");

const { prefix } = require("./config");

const menu = require("./lib/menu");
const owner = require("./lib/owner");
const group = require("./lib/group");
const download = require("./lib/download");
const tools = require("./lib/tools");
const fun = require("./lib/fun");

// ---------- BANNER ----------
function showBanner() {
  console.clear();

  const box = `
╔════════════════════════════════════╗
║        0101 LESTA SYSTEM 101       ║
║   🤖 LESTA BOT v2 INITIALIZING     ║
║   ⚡ WHATSAPP AUTOMATION BOT       ║
╚════════════════════════════════════╝
`;

  console.log(chalk.cyan(box));

  console.log(
    chalk.green(
      figlet.textSync("LESTA BOT v2", { font: "Slant" })
    )
  );

  console.log(chalk.yellow("⚡ STATUS: ONLINE"));
  console.log(chalk.magenta("👑 MODE: TERMUX BOT"));
  console.log(chalk.blue("────────────────────────────\n"));
}

// ---------- START BOT ----------
async function startBot() {
  showBanner();

  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: P({ level: "silent" })
  });

  // Pairing Code
  if (!sock.authState.creds.registered) {
    const phoneNumber = "254706519089";
    const code = await sock.requestPairingCode(phoneNumber);
    console.log("PAIRING CODE:", code);
  }
  //fix pairing code 
  sock.ev.on("connection.update", async (update) => {
  const { connection } = update

  if (connection === "open") {
    const code = await sock.requestPairingCode("254706519089")
    console.log(code)
  }
})
  
  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;

    const body =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text || "";

    if (!body.startsWith(prefix)) return;

    const command = body.slice(prefix.length).trim().split(" ")[0].toLowerCase();
    const args = body.split(" ").slice(1);

    if (command === "menu") return menu(sock, from, prefix);
    if (owner(sock, msg, command, args)) return;
    if (group(sock, msg, command, args)) return;
    if (download(sock, msg, command, args)) return;
    if (tools(sock, msg, command, args)) return;
    if (fun(sock, msg, command, args)) return;
  });

  // Group Welcome
  sock.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (action === "add") {
      for (let user of participants) {
        sock.sendMessage(id, {
          text: `👋 Welcome @${user.split("@")[0]} to ✨ Lesta Bot v2`,
          mentions: [user]
        });
      }
    }
  });

  console.log("🤖 Lesta Bot v2 Running...");
}

startBot();
    
