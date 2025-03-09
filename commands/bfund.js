const { binanceUtilities } = require("../binanceEngine");
const { botUtilities } = require("../bot");
const utilities = require("../utilities");
const axios = require("axios");

const execute = async (chatId, args, edit = false) => {
  let fundingRates = await axios.get(
    "https://fapi.binance.com/fapi/v1/premiumIndex"
  );

  fundingRates = fundingRates.data;

  fundingRates.sort((a, b) => b.lastFundingRate - a.lastFundingRate);

  if (args.length != 1) {
    const pairs = [];

    for (let i = 0; i < args.length; i++) {
      let pair = args[i].toUpperCase();
      pair = binanceUtilities.doesPairExist(pair);

      if (pair) {
        pairs.push(pair);
      }
    }
    const max = utilities.findLongest(pairs);
    let text = "<code>";

    for (let i = 0; i < pairs.length; i++) {
      for (let y = 0; y < fundingRates.length; y++) {
        const f = fundingRates[y];
        if (f.symbol == pairs[i]) {
          text += `${f.symbol}${utilities.howManySpace(
            f.symbol,
            max
          )} ${parseFloat(f.lastFundingRate * 100).toFixed(3)}%\n`;
        }
      }
    }

    text += `</code>`;

    botUtilities.sendMessage(chatId, text, { parse_mode: "HTML" });
    return;
  }

  const pairs = [];

  for (let i = 0; i < 10; i++) {
    const f = fundingRates[i];
    pairs.push(f.symbol);
  }
  let text = "<code>";

  const max = utilities.findLongest(pairs);

  for (let i = 0; i < 10; i++) {
    const f = fundingRates[i];
    text += `${f.symbol}${utilities.howManySpace(f.symbol, max)} ${parseFloat(
      f.lastFundingRate * 100
    ).toFixed(3)}%\n`;
  }

  text += `</code>`;

  botUtilities.sendMessage(chatId, text, { parse_mode: "HTML" });
  return;
};

const command = {
  execute,
};

module.exports.command = command;
