process.env.NTBA_FIX_350 = '1'
let { botUtilities } = require("../bot")
const puppeteer = require("puppeteer")
const axios = require("axios")
const { utilities } = require("../utilities")

const intervals = [["1m",1],["3m",3],["5m",5],["15m",15],["30m",30],["1h",60],["2h",120],["3h",180],["4h",240],["1d","D"],["1w","W"], ["1W", "W"], ["1M", "M"]]

const indicators = [["accd","ACCD"],["adr","studyADR"],["aroon","AROON"],["atr","ATR"],
["awesome","AwesomeOscillator"],["bb","BB"],["bbsr","BollingerBandsR"],["bbw","BollingerBandsWidth"],
["cmf","CMF"],["chaikino","ChaikinOscillator"],["chandemo","chandeMO"],["chop","ChoppinessIndex"],
["cci","CCI"],["crsi","CRSI"],["corr","CorrelationCoefficient"],["detrendedprice","DetrendedPriceOscillator"],
["dm","DM"],["donch","DONCH"],["dema","DoubleEMA"],["eom","EaseOfMovement"],
["efi","EFI"],["env","ENV"],["fisher","FisherTransform"],["hv","HV"],
["hullma","hullMA"],["cloud","IchimokuCloud"],["kltnr","KLTNR"],["kst","KST"],
["lr","LinearRegression"],["macd","MACD"],["mom","MOM"],["mf","MF"],
["moon","MoonPhases"],["ma","MASimple"],["maexp","MAExp"],["maw","MAWeighted"],
["obv","OBV"],["psar","PSAR"],["pivothl","PivotPointsHighLow"],["pivot","PivotPointsStandard"],
["posc","PriceOsc"],["pvol","PriceVolumeTrend"],["roc","ROC"],["rsi","RSI"],
["vigor","VigorIndex"],["volat","VolatilityIndex"],["smiergodicindicator","SMIErgodicIndicator"],["smiergodicoscillator","SMIErgodicOscillator"],
["stochastic","Stochastic"],["stoch","StochasticRSI"],["tema","TripleEMA"],["trix","Trix"],
["ultimate","UltimateOsc"],["vstop","VSTOP"],["vol","Volume"],["vwap","VWAP"],
["mav","MAVolumeWeighted"],["wr","WilliamR"],["wa","WilliamsAlligator"],["wf","WilliamsFractal"],["zigzag","ZigZag"]]

const types = ["bars", "candles", "line", "area", "renko", "kagi", "pointandfigure", "linebreak", "heikin", "hellow"]

let execute = async(chatId, args, edit=false) => {
  let pair = args.length<2 ? "btcusdt" : args[1]
  let theme = args.includes("light") ? "light" : "dark"
  let details = args.includes("details") ? `"details": true,` : ""

  let interval = ""
  let type = -1

  for(let i=0; i<args.length; i++) {
    if(types.includes(args[i])) {
      type = i
    }
  }

  args.forEach(a => {
    intervals.forEach(i => {
      if(a==i[0]) {
        interval = i[1]
      }
    })
  })

  if(interval=="") interval = 60
  if(type==-1) type = 1

  let response = await axios.get(`https://symbol-search.tradingview.com/symbol_search/?text=${pair.toLowerCase()}&hl=1&exchange`)
  
  let r 
  for(let i=0; i<response.data.length; i++) {
    r = response.data[i]
    if(r.type=="crypto") {
      r.symbol = r.symbol.replace("<em>", "")
      r.symbol = r.symbol.replace("</em>", "")
      i=response.data.length
    }

    if(i==response.data.length-1) {
      r = response.data[0]
      r.symbol = r.symbol.replace("<em>", "")
      r.symbol = r.symbol.replace("</em>", "")
    }
  }

  if(!response.data.length) {
    r = {symbol: "BTCUSDT", exchange: "BINANCE"}
  }

  //<style>#wizbot {color:white; position: fixed; z-index: 200; top: 30; right: 230}</style>
  // <div id="wizbot">@Crypto_WizBot</div>
  let content = `<div class="tradingview-widget-container">
  <div id="tradingview_53b38"></div>
  <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
  <script type="text/javascript">
  new TradingView.widget(
  {
  "width": 1025,
  "height": 767,
  "symbol": "${r.exchange}:${r.symbol}",
  "interval": "${interval}",
  "timezone": "Etc/UTC",
  "theme": "${theme}",
  "style": "${type}",
  "locale": "en",
  "toolbar_bg": "#f1f3f6",
  "enable_publishing": false,
  "hide_top_toolbar": true,
  "hide_side_toolbar": true, 
  ${details}
  "studies": [`

  for(let y=0; y<args.length; y++) {
    let a = args[y]
    for(let i=0; i<indicators.length; i++) {
      let ind = indicators[i]
      if(a==ind[0]){
        content += `"${ind[1]}@tv-basicstudies",\n`
      }
    }
  }

  content += `],
  "container_id": "tradingview_53b38"
  }
  );
  </script>
  </div>`

  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.setViewport({
      width: 1041,
      height: 783,
      deviceScaleFactor: 1,
  });            

  await page.setContent(content);
  await utilities.waitXSecond(2)
  const base = await page.screenshot({encoding: "base64"});
  botUtilities.sendPhoto(chatId, Buffer.from(base, 'base64'))
  await browser.close();
}

let command = {
  execute
}

module.exports.command = command

