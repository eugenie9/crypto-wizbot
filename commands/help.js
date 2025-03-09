const { botUtilities } = require("../bot");

const execute = async (chatId, args, edit = false) => {
  // Default: english
  let lang = args.length < 2 ? "en" : args[1];

  const languages = require("../language/index");
  const allowedLanguages = [];
  for (const l of languages) {
    allowedLanguages.push(l.shortcut);
  }

  // If user sends an invalid shortcut, english is set as a language.
  lang = allowedLanguages.includes(lang) ? lang : "en";

  const commands = require("./index");
  let text = "";

  if (allowedLanguages.includes(lang)) {
    for (const c of commands) {
      text += `${c.triggers[0]} - ${c.description[lang]}\n`;
    }
  }

  botUtilities.sendMessage(chatId, text);
};

const command = {
  execute,
};

module.exports.command = command;
