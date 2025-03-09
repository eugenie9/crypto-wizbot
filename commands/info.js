const { binanceUtilities } = require("../binanceEngine");
const { botUtilities } = require("../bot");
const { coinGeckoUtilities } = require("../coingeckoEngine");
const { utilities } = require("../utilities");
const code = "tr";

const execute = async (chatId, args, edit = false) => {
  let text = "<code>";
  const symbol = args.length == 1 ? "btc" : args[1].toLowerCase();
  const id = utilities.findCoinGeckoID(symbol);
  const data = await coinGeckoUtilities.getPairData(id);

  text += `${data.name} (${data.symbol.toUpperCase()}) #${
    data.market_cap_rank
  }\n`;
  const m = data.market_data;
  text += `Circ. Supply: ${parseFloat(m.circulating_supply).toFixed(0)}\n`;
  text += `Total Supply: ${parseFloat(m.total_supply).toFixed(0)}\n`;
  m.max_supply = m.max_supply == null ? "Infinity" : m.max_supply;
  text += `Max Supply: ${parseFloat(m.max_supply).toFixed(0)}\n`;
  const prices = m.current_price;
  text += `💵: $${prices.usd} | ${prices.btc}₿\n`;
  text += `24h: $${m.low_24h.usd} | $${m.high_24h.usd}\n`;
  text += `24h: ${m.low_24h.btc}₿|${m.high_24h.btc}₿\n`;
  const ath = m.ath;
  const atl = m.atl;
  const ath_date = m.ath_date;
  const atl_date = m.atl_date;
  if (m.ath && m.atl) {
    text += `ATH $: $${ath.usd} (${ath_date.usd.slice(
      0,
      ath_date.usd.indexOf("T")
    )})\n`;
    text += `ATL $: $${atl.usd} (${atl_date.usd.slice(
      0,
      atl_date.usd.indexOf("T")
    )})\n`;
    text += `ATH ₿: ${ath.btc}₿ (${ath_date.btc.slice(
      0,
      ath_date.btc.indexOf("T")
    )})\n`;
    text += `ATL ₿: ${atl.btc}₿ (${atl_date.btc.slice(
      0,
      atl_date.btc.indexOf("T")
    )})\n`;
  }

  if (m.roi) {
    text += `ROI: ${parseFloat(m.roi.percentage).toFixed(
      2
    )}% in ${m.roi.currency.toUpperCase()}\n`;
  }

  text += `24h: ${parseFloat(m.price_change_percentage_24h).toFixed(
    2
  )}% | 7d: ${parseFloat(m.price_change_percentage_7d).toFixed(2)}%\n`;
  text += `30d: ${parseFloat(m.price_change_percentage_30d).toFixed(
    2
  )}% | 1y: ${parseFloat(m.price_change_percentage_1y).toFixed(2)}%\n`;

  text += "</code>";

  const options = { parse_mode: "HTML" };

  botUtilities.sendMessage(chatId, text, options);
};

const command = {
  execute,
};

module.exports.command = command;
