const { coinGeckoUtilities } = require("../coingeckoEngine");
const { binanceUtilities } = require("../binanceEngine");
const { common } = require("../common");
const { botUtilities } = require("../bot");
const utilities = require("../utilities");
const code = "tr";

const execute = async (chatId, args, edit = false) => {
  let pair = args.length == 1 ? "BTCUSDT" : args[1].toUpperCase();
  pair = binanceUtilities.doesPairExist(pair);

  if (!pair) {
    const id = utilities.findCoinGeckoID(args[1].toLowerCase());
    if (id) {
      const data = await coinGeckoUtilities.getPairData(id);
      let text = "<code>";
      text += `${data.name} (${data.symbol.toUpperCase()})\n`;
      const m = data.market_data;
      text += `$${m.current_price.usd} | ${m.current_price.btc}\n`;
      text += `L|H: $${m.low_24h.usd}|$${m.high_24h.usd}\n`;

      const arr = [
        { type: "1h", data: m.price_change_percentage_1h_in_currency },
        { type: "24h", data: m.price_change_percentage_24h_in_currency },
        { type: "7d", data: m.price_change_percentage_7d_in_currency },
        { type: "30d", data: m.price_change_percentage_30d_in_currency },
      ];

      const percentages = [];
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].data.usd) {
          percentages.push(parseFloat(arr[i].data.usd).toFixed(2));
        }
      }

      const max = utilities.findLongest(percentages);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].data.usd) {
          const p = parseFloat(arr[i].data.usd).toFixed(2);
          text += `${arr[i].type}${utilities.howManySpace(
            arr[i].type,
            4
          )} ${utilities.howManySpace(p, max)}${p}%\n`;
        }
      }

      text += `Cap: #${data.market_cap_rank}`;
      text += "</code>";
      botUtilities.sendMessage(chatId, text, { parse_mode: "HTML" });
      return;
    }
    botUtilities.sendMessage(
      chatId,
      common.languages[code].errorMessages["pairDoesNotExist"]
    );
    return;
  }

  const data = await binanceUtilities.getPrevDay(pair);
  const market = utilities.getQuote(pair);
  let text = `<code>${pair}${utilities.howManySpace(pair, 7)}: ${
    data.lastPrice
  }\n\n`;

  text += `Change : ${parseFloat(data.priceChangePercent).toFixed(2)}%\n`;
  text += `High   : ${data.highPrice}\n`;
  text += `Average: ${data.weightedAvgPrice}\n`;
  text += `Low    : ${data.lowPrice}\n`;
  text += `Volume : ${parseFloat(
    data.quoteVolume
  ).toLocaleString()} ${market}\n`;
  text += `</code>`;

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
