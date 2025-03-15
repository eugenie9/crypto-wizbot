const { botUtilities } = require("../bot");
const commands = require("./index");
const code = "tr";

/**
 * Execute the help command
 * @param {Object} msg - The full message object from Telegram
 * @param {Array} args - The command arguments
 * @param {Object|null} options - Additional options
 */
const execute = async (msg, args, options = null) => {
  // Extract chatId from the message object
  const chatId = msg.chat ? msg.chat.id : msg.message.chat.id;

  let text = "<b>Commands</b>\n";
  for (const c of commands) {
    text += `${c.triggers[0]} - ${c.description[code]}\n`;
  }

  botUtilities.sendMessage(chatId, text, { parse_mode: "HTML" });
};

const command = {
  execute,
};

module.exports.command = command;
