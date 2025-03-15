const { botUtilities } = require("../bot");
const { getOrFallback } = require("../cache");
const { coinGeckoUtilities } = require("../coingeckoEngine");
const utilities = require("../utilities");

const _dictionary = {
  en: {
    total: "TOTAL",
    volume: "VOLUME",
    dominance: "Dominance",
    top10: "TOP10",
    refresh: "Refresh",
  },
  tr: {
    total: "TOPLAM",
    volume: "HACİM",
    dominance: "Baskınlık",
    top10: "TOP10",
    refresh: "Yenile",
  },
};

const execute = async (msg, args, edit = false) => {
  const chatId = msg.chat ? msg.chat.id : msg.message.chat.id;
  const dictionary = botUtilities.getDictionary(msg, _dictionary);

  try {
    const data = await getOrFallback({
      key: "top10mcap",
      fallback: async () => coinGeckoUtilities.getTop10MarketCapPercentages(),
    });
    let { mcap, volume } = data;
    const percentages = data.dominance;
    let total = 0;

    mcap = mcap.toLocaleString(undefined, { maximumFractionDigits: 0 });
    volume = volume.toLocaleString(undefined, { maximumFractionDigits: 0 });

    const textKeys = [dictionary.total, dictionary.volume];
    const space = utilities.howManySpace;
    const longest = utilities.findLongest;
    const format = (text) => `${text}${space(text, longest(textKeys))}:`;

    const mcapValues = [mcap, volume];
    const formatMcap = (text) => `${space(text, longest(mcapValues))}${text}$`;

    let text = "<code>";
    text += `${format(dictionary.total)} ${formatMcap(mcap)}\n`;
    text += `${format(dictionary.volume)} ${formatMcap(volume)}\n\n`;
    text += `${space("", 6)} ${dictionary.dominance}\n`;

    for (const c in percentages) {
      total += percentages[c];
      const p = parseFloat(percentages[c]).toFixed(2);
      text += `${c.toUpperCase()}${space(c, 6)} ${space(p, 8)}${p}%\n`;
    }
    total = parseFloat(total).toFixed(2);
    text += `${format(dictionary.top10)}${space(total, 8)}${total}%</code>\n`;

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
        inline_keyboard: [[{ text: dictionary.refresh, callback_data }]],
      },
    };
    if (edit) {
      botUtilities.editMessage(chatId, edit.msgId, text, options);
      return;
    }
    botUtilities.sendMessage(chatId, text, options);
  } catch (e) {
    console.log(e);
    botUtilities.sendMessage(chatId, "error in mcap");
  }
};

const command = {
  execute,
};

module.exports.command = command;
