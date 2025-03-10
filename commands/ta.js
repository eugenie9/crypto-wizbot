process.env.NTBA_FIX_350 = "1";
const { botUtilities } = require("../bot");
const { chromium } = require("playwright");
const intervals = ["1m", "5m", "15m", "1h", "4h", "1D", "1W", "1M"];
const tradingviewEngine = require("../tradingviewEngine");

const execute = async (chatId, args, edit = false) => {
  let pair = args.length < 2 ? "btcusdt" : args[1];

  let interval = "";
  args.forEach((a) => {
    intervals.forEach((i) => {
      if (a == i) interval = i;
    });
  });

  if (interval == "") interval = "1h";

  const r = await tradingviewEngine.symbolSearch(pair);

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

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({
    width: 441,
    height: 466,
  });

  await page.setContent(content);
  await page.waitForTimeout(2000);

  const screenshotPath = `./ta_${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath });
  botUtilities.sendPhoto(chatId, screenshotPath);
  await browser.close();
};

const command = {
  execute,
};

module.exports.command = command;
