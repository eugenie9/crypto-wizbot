const { binanceUtilities } = require("../binanceEngine");
const { botUtilities } = require("../bot");
const { utilities } = require("../utilities");
const code = "tr";

const execute = async (chatId, args, edit = false) => {
  if (args.length == 1) {
    return;
  }

  let text = "<code>";
  const pairs = [];

  for (let i = 0; i < args.length; i++) {
    let pair = args[i].toUpperCase();
    pair = binanceUtilities.doesPairExist(pair);

    if (pair) {
      pairs.push(pair);
    }
  }

  const max = utilities.findLongest(pairs);

  for (let i = 0; i < pairs.length; i++) {
    const pair = pairs[i];
    const price = binanceUtilities.getPrice(pair);
    text += `${pair}${utilities.howManySpace(pair, max)}: ${price}\n`;
  }

  text += "</code>";

  let callback_data = "";
  for (let i = 0; i < args.length; i++) {
    if (i == args.length - 1) {
      callback_data += args[i];
      break;
    }
    callback_data += args[i] + " ";
  }

  const options = {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [[{ text: "Refresh", callback_data: callback_data }]],
    },
  };
  if (edit) {
    botUtilities.editMessage(chatId, edit.msgId, text, options);
    return;
  }

  botUtilities.sendMessage(chatId, text, options);
};

const command = {
  execute,
};

module.exports.command = command;
