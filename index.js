const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const P = require("pino");
const chalk = require("chalk");

const { prefix } = require("./config");

const menu = require("./lib/menu");
const owner = require("./lib/owner");
const group = require("./lib/group");
const download = require("./lib/download");
const tools = require("./lib/tools");
const fun = require("./lib/fun");

// ================= BANNER =================
function showBanner() {
  console.clear();
  console.log(chalk.cyan("╔════════════════════════════╗"));
  console.log(chalk.cyan("║      LESTA BOT v2          ║"));
  console.log(chalk.cyan("║   WhatsApp Automation      ║"));
  console.log(chalk.cyan("╚════════════════════════════╝\n"));
}

// ================= START BOT =================
async function startBot() {
  showBanner();

  const { state, saveCreds } = await useMultiFileAuthState("session");
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: true, // IMPORTANT for Termux stability
    logger: P({ level: "silent" })
  });

  // ================= PAIRING / QR FLOW =================
  let pairingDone = false;

  if (!state.creds.registered) {
    sock.ev.on("connection.update", async (update) => {
      const { connection } = update;

      if (connection === "open" && !pairingDone) {
        pairingDone = true;

        try {
          const code = await sock.requestPairingCode("254706519089");
          console.log(chalk.green("\nPAIRING CODE: " + code + "\n"));
        } catch (err) {
          console.log(chalk.red("Pairing failed"));
          console.error(err);
        }
      }

      if (connection === "close") {
        console.log(chalk.red("Connection closed"));

        const shouldReconnect =
          update.lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;

        if (shouldReconnect) {
          startBot();
        }
      }
    });
  }

  // ================= SAVE SESSION =================
  sock.ev.on("creds.update", saveCreds);

  // ================= MESSAGE HANDLER =================
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

  // ================= GROUP WELCOME =================
  sock.ev.on("group-participants.update", async (update) => {
    const { id, participants, action } = update;

    if (action === "add") {
      for (let user of participants) {
        sock.sendMessage(id, {
          text: `👋 Welcome @${user.split("@")[0]} to Lesta Bot v2`,
          mentions: [user]
        });
      }
    }
  });

  console.log(chalk.green("🤖 Lesta Bot v2 Running..."));
}

startBot();
      
