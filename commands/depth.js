const { binanceUtilities } = require("../binanceEngine");
const { common } = require("../common");
const { botUtilities } = require("../bot");
const utilities = require("../utilities");
const code = "en";

const execute = async (chatId, args, edit = false) => {
  let pair = args.length == 1 ? "BTCUSDT" : args[1].toUpperCase();

  pair = binanceUtilities.doesPairExist(pair);

  if (!pair) {
    botUtilities.sendMessage(
      chatId,
      common.languages[code].errorMessages["pairDoesNotExist"]
    );
    return;
  }

  const price = parseFloat(await binanceUtilities.getPrice(pair));
  const depth = await binanceUtilities.getDepth(pair);
  const market = utilities.getQuote(pair);

  let total = 0;
  const asks = [
    { price: 0, total: 0 },
    { price: 0, total: 0 },
    { price: 0, total: 0 },
    { price: 0, total: 0 },
  ];
  const bids = [
    { price: 0, total: 0 },
    { price: 0, total: 0 },
    { price: 0, total: 0 },
    { price: 0, total: 0 },
  ];

  const percentages = [0, 10, 25, 50, 100];

  for (const a in depth.asks) {
    for (let i = 0; i < percentages.length - 1; i++) {
      if (
        parseFloat(a) / price > 1 + percentages[i] / 100 &&
        parseFloat(a) / price <= 1 + percentages[i + 1] / 100
      ) {
        for (let y = i; y < asks.length; y++) {
          asks[y].total += parseFloat(a) * parseFloat(depth.asks[a]);
        }
        asks[i].price = parseFloat(a);
      }
    }
  }

  for (const b in depth.bids) {
    for (let i = 0; i < percentages.length - 1; i++) {
      if (
        parseFloat(b) / price < 1 - percentages[i] / 100 &&
        parseFloat(b) / price >= 1 - percentages[i + 1] / 100
      ) {
        for (let y = i; y < bids.length; y++) {
          bids[y].total += parseFloat(b) * parseFloat(depth.bids[b]);
        }
        bids[i].price = parseFloat(b);
      }
    }
  }

  // To beautify
  let maxDepthLength = 0;
  let maxPriceLength = 0;

  for (let i = 0; i < asks.length; i++) {
    const a = utilities.shortenNumber(asks[i].total).length;
    const b = utilities.shortenNumber(bids[i].total).length;
    if (a > maxDepthLength) maxDepthLength = a;
    if (b > maxDepthLength) maxDepthLength = b;

    const aNum = utilities.countDecimals(asks[i].price);
    const bNum = utilities.countDecimals(bids[i].price);
    if (aNum > maxPriceLength) maxPriceLength = aNum;
    if (bNum > maxPriceLength) maxPriceLength = bNum;
  }

  let text = "<code>";
  // To store previous total

  const precision = market == "BTC" ? 2 : 0;
  for (let i = asks.length - 1; i >= 0; i--) {
    const percentage = parseFloat(
      (parseFloat(asks[i].price) / price) * 100 - 100
    ).toFixed(1);
    const total = utilities.shortenNumber(asks[i].total);
    if (percentage == "-100.0") {
      continue;
    }
    text +=
      `${utilities.howManySpace(percentage, 5)}${percentage}% ` +
      `${parseFloat(asks[i].price).toFixed(maxPriceLength)} ` +
      `${utilities.howManySpace(total, maxDepthLength)}${total} ` +
      `${market}\n`;
  }

  text += `\n❇️ ${pair} - ${price} ${market}\n\n`;

  let pt = 0;
  for (let i = 0; i < bids.length; i++) {
    const percentage = parseFloat(
      (parseFloat(bids[i].price) / price) * 100 - 100
    ).toFixed(1);
    const total = utilities.shortenNumber(bids[i].total);
    if (total == pt) {
      continue;
    }
    pt = total;
    text +=
      `${utilities.howManySpace(percentage, 5)}${percentage}% ` +
      `${parseFloat(bids[i].price).toFixed(maxPriceLength)} ` +
      `${utilities.howManySpace(total, maxDepthLength)}${total} ` +
      `${market}\n`;
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
