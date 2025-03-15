const { binanceUtilities } = require("../binanceEngine");
const { chartUtilities } = require("../chartEngine");
const { botUtilities } = require("../bot");

const _dictionary = {
  en: {
    pairDoesNotExist:
      "The coin/token you are trying to inquire is not available in the exchanges that I supported.",
  },
  tr: {
    pairDoesNotExist:
      "Sorgulamaya çalıştığınız koin/token, desteklemiş olduğum borsalarda bulunmuyor.",
  },
};

const execute = async (msg, args, edit = false) => {
  const chatId = msg.chat ? msg.chat.id : msg.message.chat.id;
  const dictionary = botUtilities.getDictionary(msg, _dictionary);

  let pair, interval;
  if (args.length == 1) args = ["/chart", "BTCUSDT", "1h"];
  if (args.length == 2) args[2] = "1h";

  if (edit && typeof edit === "object") {
    pair = edit.pair.toUpperCase();
    interval = edit.interval;
  } else {
    pair = args[1].toUpperCase();
    interval = args[2];
  }

  if (!binanceUtilities.doesPairExist(pair)) {
    botUtilities.sendMessage(chatId, dictionary.pairDoesNotExist);
    return;
  }

  if (!binanceUtilities.doesIntervalExist(interval)) {
    botUtilities.sendMessage(chatId, dictionary.intervalDoesNotExist);
  }

  const ticks = await binanceUtilities.getTicks(pair, interval, 200);
  const globalScale = 8;
  const candlestick = chartUtilities.getDataTable();
  const data = [];

  for (let i = 0; i < ticks.length; i++) {
    const color =
      parseFloat(ticks[i][1]) > parseFloat(ticks[i][4]) ? "#ff0000" : "#00ff00"; // volume bar colors

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

  const plotData = chartUtilities.getScaledData(data, globalScale);
  const maxVolume = chartUtilities.getMaxVolume(plotData);

  candlestick.addData(plotData);

  const chart = chartUtilities.getStockChart(3);
  const plot = chart.plot(0);

  // Volume bars
  const volume = candlestick.mapAs();
  volume.addField("value", 5);
  volume.addField("fill", 6);
  const volumeSeries = plot.column(volume);
  const extraYScale = chartUtilities.getLinearScale();
  extraYScale.minimum(0);
  extraYScale.maximum(maxVolume * 4);
  const extraYAxis = plot.yAxis(1);
  extraYAxis.orientation("right");
  extraYAxis.scale(extraYScale);
  volumeSeries.yScale(extraYScale);
  plot
    .yAxis(1)
    .labels()
    .format(function () {
      return "";
    });
  // Volume bars

  // RSI mapping
  const mapping_rsi20 = candlestick.mapAs();
  mapping_rsi20.addField("value", 7);
  const mapping_rsi30 = candlestick.mapAs();
  mapping_rsi30.addField("value", 8);
  const mapping_rsi70 = candlestick.mapAs();
  mapping_rsi70.addField("value", 9);
  const mapping_rsi80 = candlestick.mapAs();
  mapping_rsi80.addField("value", 10);
  // RSI mapping

  const mapping = candlestick.mapAs({ open: 1, high: 2, low: 3, close: 4 });

  // First Plot
  const ohlcSeries = plot.candlestick(mapping);
  ohlcSeries.risingFill("green");
  ohlcSeries.fallingFill("red");
  plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);
  const sma50 = plot.sma(mapping, 50).series();
  sma50.stroke("1 orange");
  const ema20 = plot.ema(mapping, 20).series();
  ema20.stroke("1 blue");
  chart.plot(0).xAxis().showHelperLabel(false);
  plot.yScale().stackMode("value");
  // First Plot

  // SMA-EMA legend
  const legend = plot.legend();
  legend.positionMode("inside");
  legend.title(false);
  legend.position("top");
  legend.align("middle");
  plot.legend().itemsFormatter(function () {
    return [
      {
        text: "SMA50",
        iconFill: "orange",
        fontFamily: "Arial",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: 12,
      },
      {
        text: "EMA20",
        iconFill: "blue",
        fontFamily: "Arial",
        fontWeight: "normal",
        fontStyle: "normal",
        fontSize: 12,
      },
    ];
  });

  const background = legend.background();
  background.fill(["#efeaea"]);
  background.enabled(true);
  // SMA-EMA legend

  const title = `${pair} - ${interval} ( @Crypto_WizBot )`;
  chart.title(title);

  // Second Plot
  const secondPlot = chart.plot(1);
  secondPlot.height("15%");
  const rsi_20 = secondPlot.line(mapping_rsi20);
  rsi_20.stroke("1 red");
  const rsi_30 = secondPlot.line(mapping_rsi30);
  rsi_30.stroke("1 green");
  const rsi_70 = secondPlot.line(mapping_rsi70);
  rsi_70.stroke("1 green");
  const rsi_80 = secondPlot.line(mapping_rsi80);
  rsi_80.stroke("1 red");
  const rsi = secondPlot.rsi(mapping, 14).series();
  rsi.stroke("3 #64b5f6");
  secondPlot.yAxis().title("RSI");
  secondPlot
    .yAxis()
    .title()
    .fontColor("Black")
    .fontFamily("Arial")
    .fontSize(13)
    .fontStyle("normal")
    .margin(-15)
    .useHtml(false);
  chart.plot(1).legend(false);
  chart.plot(1).xAxis().labels(false);
  chart.plot(1).xAxis().minorLabels(false);
  // Second Plot

  // Third Plot
  const thirdPlot = chart.plot(2);
  thirdPlot.height("15%");
  const macd_all_lines = thirdPlot.macd(
    mapping,
    12,
    26,
    9,
    "line",
    "line",
    "column"
  );
  macd_all_lines.macdSeries().stroke("2 blue");
  macd_all_lines.signalSeries().stroke("2 #f22495");
  chart.plot(2).legend(false);
  chart.plot(2).xAxis().labels(false);
  chart.plot(2).xAxis().minorLabels(false);
  thirdPlot.yAxis().title("MACD");
  thirdPlot
    .yAxis()
    .title()
    .fontColor("Black")
    .fontFamily("Arial")
    .fontSize(13)
    .fontStyle("normal")
    .margin(-15)
    .useHtml(false);
  // Third Plot

  // Unpadding for axis labels values
  chart
    .plot(0)
    .priceIndicator()
    .value("last-visible")
    .label()
    .format(function () {
      return chartUtilities.unpad(this.value, globalScale);
    });
  chart
    .plot(0)
    .yAxis()
    .labels()
    .format(function () {
      return chartUtilities.unpad(this.value, globalScale);
    });
  chart
    .plot(2)
    .yAxis()
    .labels()
    .format(function () {
      return chartUtilities.unpad(this.value, globalScale);
    });

  chartUtilities.sendChart(chatId, chart, "chart", pair, interval, edit);
};

const command = {
  execute,
};

module.exports.command = command;
