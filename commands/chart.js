let { binanceUtilities } = require("../binanceEngine")
let { chartUtilities } = require("../chartEngine")
let { common } = require("../common")
let { botUtilities } = require("../bot")
let code = "tr"

let execute = async(chatId, args, edit=false) => {
  let pair, interval
  if(args.length==1) args=["/chart", "BTCUSDT", "1h"]
  if(args.length==2) args[2]="1h"
  
  if(edit) {
    pair = (edit.pair).toUpperCase()
    interval = edit.interval
  } else {
    pair = args[1].toUpperCase()
    interval = args[2]
  }

  if(!binanceUtilities.doesPairExist(pair)) {
    botUtilities.sendMessage(chatId, common.languages[code].errorMessages["pairDoesNotExist"])
    return
  }

  if(!binanceUtilities.doesIntervalExist(interval)) {
    botUtilities.sendMessage(chatId, common.languages[code].errorMessages["intervalDoesNotExist"])
  }

  let ticks = await binanceUtilities.getTicks(pair, interval, 200)
  let globalScale = 8;
  let candlestick = chartUtilities.getDataTable()
  let data = [];

  for (i = 0; i < ticks.length; i++) {
    color = parseFloat(ticks[i][1]) > parseFloat(ticks[i][4]) ? "#ff0000" : "#00ff00"; // volume bar colors

    data.push([
      parseFloat(ticks[i][0]),
      parseFloat(ticks[i][1]),
      parseFloat(ticks[i][2]),
      parseFloat(ticks[i][3]),
      parseFloat(ticks[i][4]),
      parseFloat(ticks[i][7]),
      color,
      20,
      30,
      70,
      80,
    ]);
  }

  let plotData = chartUtilities.getScaledData(data, globalScale);
  let maxVolume = chartUtilities.getMaxVolume(plotData);

  candlestick.addData(plotData);

  let chart = chartUtilities.getStockChart(3)
  let plot = chart.plot(0)

  // Volume bars
  let volume = candlestick.mapAs();
  volume.addField("value", 5);
  volume.addField("fill", 6);
  let volumeSeries = plot.column(volume);
  let extraYScale = chartUtilities.getLinearScale()
  extraYScale.minimum(0);
  extraYScale.maximum(maxVolume * 4);
  let extraYAxis = plot.yAxis(1);
  extraYAxis.orientation("right");
  extraYAxis.scale(extraYScale);
  volumeSeries.yScale(extraYScale);
  plot.yAxis(1).labels().format(function () { return ""; });
  // Volume bars

  // RSI mapping
  mapping_rsi20 = candlestick.mapAs();
  mapping_rsi20.addField("value", 7);
  mapping_rsi30 = candlestick.mapAs();
  mapping_rsi30.addField("value", 8);
  mapping_rsi70 = candlestick.mapAs();
  mapping_rsi70.addField("value", 9);
  mapping_rsi80 = candlestick.mapAs();
  mapping_rsi80.addField("value", 10);
  // RSI mapping

  let mapping = candlestick.mapAs({open: 1, high: 2, low: 3, close: 4});

  // First Plot
  let ohlcSeries = plot.candlestick(mapping);
  ohlcSeries.risingFill("green");
  ohlcSeries.fallingFill("red");
  plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
  let sma50 = plot.sma(mapping, 50).series();
  sma50.stroke("1 orange");
  let ema20 = plot.ema(mapping, 20).series();
  ema20.stroke("1 blue");
  chart.plot(0).xAxis().showHelperLabel(false);
  plot.yScale().stackMode("value");
  // First Plot

  // SMA-EMA legend
  let legend = plot.legend();
  legend.positionMode("inside");
  legend.title(false);
  legend.position("top");
  legend.align("middle");
  plot.legend().itemsFormatter(function () {
    return [
      { text: "SMA50", iconFill: "orange" },
      { text: "EMA20", iconFill: "blue" },
    ];
  });

  let background = legend.background();
  background.fill(["#efeaea"]);
  background.enabled(true);
  // SMA-EMA legend

  let title = `${pair} - ${interval} ( @Crypto_WizBot )`;
  chart.title(title);

  // Second Plot
  let secondPlot = chart.plot(1)
  secondPlot.height("15%");
  let rsi_20 = secondPlot.line(mapping_rsi20);
  rsi_20.stroke("1 red");
  let rsi_30 = secondPlot.line(mapping_rsi30);
  rsi_30.stroke("1 green");
  let rsi_70 = secondPlot.line(mapping_rsi70);
  rsi_70.stroke("1 green");
  let rsi_80 = secondPlot.line(mapping_rsi80);
  rsi_80.stroke("1 red");
  let rsi = secondPlot.rsi(mapping, 14).series();
  rsi.stroke("3 #64b5f6");
  secondPlot.yAxis().title("RSI");
  secondPlot.yAxis().title().fontColor("Black").fontFamily("Arial")
    .fontSize(13).fontStyle("normal").margin(-15).useHtml(false);
  chart.plot(1).legend(false);
  chart.plot(1).xAxis().labels(false);
  chart.plot(1).xAxis().minorLabels(false);
  // Second Plot

  // Third Plot
  let thirdPlot = chart.plot(2);
  thirdPlot.height("15%");
  let macd_all_lines = thirdPlot.macd(mapping, 12, 26, 9, "line", "line", "column");
  macd_all_lines.macdSeries().stroke("2 blue");
  macd_all_lines.signalSeries().stroke("2 #f22495");
  chart.plot(2).legend(false);
  chart.plot(2).xAxis().labels(false);
  chart.plot(2).xAxis().minorLabels(false);
  thirdPlot.yAxis().title("MACD");
  thirdPlot.yAxis().title().fontColor("Black").fontFamily("Arial")
    .fontSize(13).fontStyle("normal").margin(-15).useHtml(false);
  // Third Plot

  // Unpadding for axis labels values
  chart.plot(0).priceIndicator().value("last-visible").label().format(function () { return chartUtilities.unpad(this.value, globalScale); })
  chart.plot(0).yAxis().labels().format(function () { return chartUtilities.unpad(this.value, globalScale) });
  chart.plot(2).yAxis().labels().format(function () { return chartUtilities.unpad(this.value, globalScale) });
  
  chartUtilities.sendChart(chatId, chart, "chart", pair, interval, edit)
}

let command = {
  execute
}

module.exports.command = command


