const { botUtilities } = require("../bot");
const { coinGeckoUtilities } = require("../coingeckoEngine");
const utilities = require("../utilities");
const code = "tr";

const execute = async (chatId, args, edit = false) => {
  const data = await coinGeckoUtilities.getTrendingCoins();
  const names = [];
  const symbols = [];

  for (const c of data.coins) {
    names.push(c.item.name);
    symbols.push(c.item.symbol);
  }

  const maxN = utilities.findLongest(names);
  const maxS = utilities.findLongest(symbols);

  let text = "<code>🔥Trending Coins\n\n";

  for (let c of data.coins) {
    c = c.item;
    text += `${c.name}${utilities.howManySpace(c.name, maxN)} (${
      c.symbol
    }) ${utilities.howManySpace(c.symbol, maxS)}#${c.market_cap_rank}\n`;
  }

  text += "</code>";

  botUtilities.sendMessage(chatId, text, { parse_mode: "HTML" });
};

const command = {
  execute,
};

module.exports.command = command;
