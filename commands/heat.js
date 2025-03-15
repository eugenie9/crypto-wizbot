process.env.NTBA_FIX_350 = "1";
const { botUtilities } = require("../bot");
const { chromium } = require("playwright");

const _dictionary = {
  en: {
    heatmap: "Heatmap",
    "change|60": "1 Hour",
    "change|240": "4 Hours",
    change: "1 Day",
    "Perf.W": "1 Week",
    "Perf.1M": "1 Month",
    "Perf.3M": "3 Months",
    "Perf.6M": "6 Months",
    "Perf.1Y": "1 Year",
    "Perf.YTD": "Year to Date",
  },
  tr: {
    heatmap: "Isı Haritası",
    "change|60": "1 Saat",
    "change|240": "4 Saat",
    change: "1 Gün",
    "Perf.W": "1 Hafta",
    "Perf.1M": "1 Ay",
    "Perf.3M": "3 Ay",
    "Perf.6M": "6 Ay",
    "Perf.1Y": "1 Yıl",
    "Perf.YTD": "Yıl Başından Bugüne",
  },
};

const intervals = [
  ["1H", "change|60"],
  ["4H", "change|240"],
  ["1D", "change"],
  ["1W", "Perf.W"],
  ["1M", "Perf.1M"],
  ["3M", "Perf.3M"],
  ["6M", "Perf.6M"],
  ["1Y", "Perf.1Y"],
  ["YTD", "Perf.YTD"],
];

const execute = async (msg, args, edit = false) => {
  const chatId = msg.chat ? msg.chat.id : msg.message.chat.id;
  const dictionary = botUtilities.getDictionary(msg, _dictionary);

  // Default values
  let blockColor = "";
  let caption = "";
  const theme = args.includes("dark") ? "dark" : "light";

  // Process arguments
  args.forEach((arg) => {
    intervals.forEach((option) => {
      if (arg.toLowerCase() === option[0].toLowerCase()) {
        blockColor = option[1];
      }
    });
  });

  if (blockColor) {
    caption = `<b>${dictionary.heatmap} - ${dictionary[blockColor]}</b>`;
  } else {
    blockColor = "change";
    caption = `<b>${dictionary.heatmap} - ${dictionary.change}</b>`;
  }

  // Create the heatmap widget HTML
  const content = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }
      .tradingview-widget-container {
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <!-- TradingView Widget BEGIN -->
    <div class="tradingview-widget-container">
      <div class="tradingview-widget-container__widget"></div>
      <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js" async>
      {
        "dataSource": "CryptoWithoutStable",
        "blockSize": "market_cap_calc",
        "blockColor": "${blockColor}",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "${theme}",
        "hasTopBar": true,
        "isDataSetEnabled": false,
        "isZoomEnabled": false,
        "hasSymbolTooltip": false,
        "isMonoSize": false,
        "width": "100%",
        "height": "100%"
      }
      </script>
    </div>
    <!-- TradingView Widget END -->
  </body>
  </html>
  `;

  // Launch browser and take screenshot
  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({
    width: 1552,
    height: 1165,
  });

  await page.setContent(content);

  // Wait for the TradingView widget to be fully loaded
  try {
    await page.waitForSelector(".tradingview-widget-container__widget", {
      state: "attached",
      timeout: 2000,
    });
  } catch (error) {
    console.log(
      "Waiting for specific selector timed out, proceeding with screenshot anyway"
    );

    // Give the heatmap a moment to render
    await page.waitForTimeout(2000);
  }

  const screenshotPath = `./tvheat_${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath });
  botUtilities.sendPhoto(chatId, screenshotPath, {
    caption,
    parse_mode: "HTML",
  });
  await browser.close();
};

const command = {
  execute,
};

module.exports.command = command;
