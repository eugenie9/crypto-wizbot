process.env.NTBA_FIX_350 = "1";
const { botUtilities } = require("../bot");
const puppeteer = require("puppeteer");
const axios = require("axios");
const intervals = ["1m", "5m", "15m", "1h", "4h", "1D", "1W", "1M"];
const { utilities } = require("../utilities");
const execute = async (chatId, args, edit = false) => {
  let pair = args.length < 2 ? "btcusdt" : args[1];

  let interval = "";
  args.forEach((a) => {
    intervals.forEach((i) => {
      if (a == i) interval = i;
    });
  });

  if (interval == "") interval = "1h";

  const response = await axios.get(
    `https://symbol-search.tradingview.com/symbol_search/?text=${pair.toLowerCase()}&hl=1&exchange`
  );
  let r;
  if (response.data.length) {
    r = response.data[0];
    r.symbol = r.symbol.replace("<em>", "");
    r.symbol = r.symbol.replace("</em>", "");
  } else {
    r = { symbol: "BTCUSDT", exchange: "BINANCE" };
  }

  const content = `<div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js" async>
    {
    "interval": "${interval}",
    "width": 425,
    "isTransparent": false,
    "height": 450,
    "symbol": "${r.exchange}:${r.symbol}",
    "showIntervalTabs": true,
    "locale": "en",
    "colorTheme": "dark"
  }
    </script>
  </div>`;

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({
    width: 441,
    height: 466,
    deviceScaleFactor: 1,
  });

  await page.setContent(content);
  await utilities.waitXSecond(2);
  const base = await page.screenshot({ encoding: "base64" });
  botUtilities.sendPhoto(chatId, Buffer.from(base, "base64"));
  await browser.close();
};

const command = {
  execute,
};

module.exports.command = command;
