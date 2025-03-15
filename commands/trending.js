const { botUtilities } = require("../bot");
const { getOrFallback } = require("../cache");
const { coinGeckoUtilities } = require("../coingeckoEngine");
const utilities = require("../utilities");

const _dictionary = {
  en: {
    trending: "🔥Trending Coins",
  },
  tr: {
    trending: "🔥Popüler Koinler",
  },
};

const execute = async (msg, args, edit = false) => {
  const chatId = msg.chat ? msg.chat.id : msg.message.chat.id;
  const dictionary = botUtilities.getDictionary(msg, _dictionary);

  const data = await getOrFallback({
    key: "trending",
    fallback: async () => coinGeckoUtilities.getTrendingCoins(),
    ttl: 15 * 60 * 1000,
  });
  const names = [];
  const symbols = [];

  for (const c of data.coins) {
    names.push(c.item.name);
    symbols.push(c.item.symbol);
  }

  const maxN = utilities.findLongest(names);
  const maxS = utilities.findLongest(symbols);

  const formatName = (name) => `${name}${utilities.howManySpace(name, maxN)}`;
  const formatSymbol = (symbol) =>
    `(${symbol}) ${utilities.howManySpace(symbol, maxS)}`;

  let text = `<code>${dictionary.trending}\n\n`;

  for (let c of data.coins) {
    c = c.item;
    text += `${formatName(c.name)} ${formatSymbol(c.symbol)} #${
      c.market_cap_rank
    }\n`;
  }

  text += "</code>";

  botUtilities.sendMessage(chatId, text, { parse_mode: "HTML" });
};

const command = {
  execute,
};

module.exports.command = command;
