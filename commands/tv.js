process.env.NTBA_FIX_350 = "1";
const { botUtilities } = require("../bot");
const { chromium } = require("playwright");

const tradingviewEngine = require("../tradingviewEngine");
const intervals = [
  ["1m", 1],
  ["3m", 3],
  ["5m", 5],
  ["15m", 15],
  ["30m", 30],
  ["1h", 60],
  ["2h", 120],
  ["3h", 180],
  ["4h", 240],
  ["1d", "D"],
  ["1w", "W"],
  ["1W", "W"],
  ["1M", "M"],
];

const indicators = [
  ["accd", "ACCD"],
  ["adr", "studyADR"],
  ["aroon", "AROON"],
  ["atr", "ATR"],
  ["awesome", "AwesomeOscillator"],
  ["bb", "BB"],
  ["bbsr", "BollingerBandsR"],
  ["bbw", "BollingerBandsWidth"],
  ["cmf", "CMF"],
  ["chaikino", "ChaikinOscillator"],
  ["chandemo", "chandeMO"],
  ["chop", "ChoppinessIndex"],
  ["cci", "CCI"],
  ["crsi", "CRSI"],
  ["corr", "CorrelationCoefficient"],
  ["detrendedprice", "DetrendedPriceOscillator"],
  ["dm", "DM"],
  ["donch", "DONCH"],
  ["dema", "DoubleEMA"],
  ["eom", "EaseOfMovement"],
  ["efi", "EFI"],
  ["env", "ENV"],
  ["fisher", "FisherTransform"],
  ["hv", "HV"],
  ["hullma", "hullMA"],
  ["cloud", "IchimokuCloud"],
  ["kltnr", "KLTNR"],
  ["kst", "KST"],
  ["lr", "LinearRegression"],
  ["macd", "MACD"],
  ["mom", "MOM"],
  ["mf", "MF"],
  ["moon", "MoonPhases"],
  ["ma", "MASimple"],
  ["maexp", "MAExp"],
  ["maw", "MAWeighted"],
  ["obv", "OBV"],
  ["psar", "PSAR"],
  ["pivothl", "PivotPointsHighLow"],
  ["pivot", "PivotPointsStandard"],
  ["posc", "PriceOsc"],
  ["pvol", "PriceVolumeTrend"],
  ["roc", "ROC"],
  ["rsi", "RSI"],
  ["vigor", "VigorIndex"],
  ["volat", "VolatilityIndex"],
  ["smiergodicindicator", "SMIErgodicIndicator"],
  ["smiergodicoscillator", "SMIErgodicOscillator"],
  ["stochastic", "Stochastic"],
  ["stoch", "StochasticRSI"],
  ["tema", "TripleEMA"],
  ["trix", "Trix"],
  ["ultimate", "UltimateOsc"],
  ["vstop", "VSTOP"],
  ["vol", "Volume"],
  ["vwap", "VWAP"],
  ["mav", "MAVolumeWeighted"],
  ["wr", "WilliamR"],
  ["wa", "WilliamsAlligator"],
  ["wf", "WilliamsFractal"],
  ["zigzag", "ZigZag"],
];

const types = [
  "bars",
  "candles",
  "line",
  "area",
  "renko",
  "kagi",
  "pointandfigure",
  "linebreak",
  "heikin",
  "hellow",
];

const execute = async (chatId, args, edit = false) => {
  let pair = args.length < 2 ? "btcusdt" : args[1];
  const theme = args.includes("dark") ? "dark" : "light";
  const details = args.includes("details") ? `"details": true,` : "";

  let interval = "";
  let type = -1;

  for (let i = 0; i < args.length; i++) {
    if (types.includes(args[i])) {
      type = i;
    }
  }

  args.forEach((a) => {
    intervals.forEach((i) => {
      if (a == i[0]) {
        interval = String(i[1]);
      }
    });
  });

  if (interval == "") interval = "60";
  if (type == -1) type = 1;

  const r = await tradingviewEngine.symbolSearch(pair);

  //<style>#wizbot {color:white; position: fixed; z-index: 200; top: 30; right: 230}</style>
  // <div id="wizbot">@Crypto_WizBot</div>
  let content = `<div class="tradingview-widget-container">
  <div id="tradingview_53b38"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
  <script type="text/javascript">
  new TradingView.widget(
  {
  "width": 1536,
  "height": 1149,
  "symbol": "${r.exchange}:${r.symbol}",
  "interval": "${String(interval)}",
  "timezone": "Etc/UTC",
  "theme": "${theme}",
  "style": "${String(type)}",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "hide_top_toolbar": true,
  "hide_side_toolbar": true, 
  ${details}
  "studies": [`;

  for (let y = 0; y < args.length; y++) {
    const a = args[y];
    for (let i = 0; i < indicators.length; i++) {
      const ind = indicators[i];
      if (a == ind[0]) {
        content += `"${ind[1]}@tv-basicstudies",\n`;
      }
    }
  }

  content += `],
  "container_id": "tradingview_53b38"
  }
  );
  </script>
  </div>`;

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.setViewportSize({
    width: 1552,
    height: 1165,
  });

  await page.setContent(content);
  // Wait for the TradingView widget to be fully loaded
  await page.waitForSelector("#tradingview_53b38", {
    state: "attached",
    timeout: 5000,
  });
  // Give the chart a moment to render
  await page.waitForTimeout(2000);

  const screenshotPath = `./tv_${Date.now()}.png`;
  await page.screenshot({ path: screenshotPath });
  botUtilities.sendPhoto(chatId, screenshotPath);
  await browser.close();
};

const command = {
  execute,
};

module.exports.command = command;
