const fs = require("fs")
let JSDOM = require('jsdom').JSDOM;
let jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'});
let window = jsdom.window;
let anychart = require('anychart')(window);
let anychartExport = require('anychart-nodejs')(anychart);
let { botUtilities } = require("./bot")

let getDataTable = () => anychart.data.table();

let getLinearScale = () => anychart.scales.linear();

/**
 * Specify how many chart you want 
 * @param {Integer} axis 
 */
let getStockChart = (axis) => {
  let chart = anychart.stock(true);
  chart.scroller().enabled(false);

  for(let i=0; i<axis; i++) {
    chart.plot(i).dataArea().background().enabled(true);
    chart.plot(i).dataArea().background().stroke("2 black");
  }

  return chart
}

/**
 * Generates JPG image and saves it to a file, sends, and deletes it
 * @param {chart} chart 
 */
let sendChart = (chatId, chart, type, pair, interval, edit=false, stock=true) => {
  chart.margin(0, 0, 0, 15);
  chart.bounds(0, 0, 960, 720);
  chart.container("container");
  chart.draw();

  if(stock) {
    let ranges = [["1m", "minute", 120], ["3m", "minute", 3*120], ["5m", "minute", 5*120], ["15m", "minute", 15*120], ["30m", "minute", 30*120], ["1h", "hour", 120], ["2h", "hour", 2*120], ["4h", "hour", 4*120], ["6h", "hour", 6*120], ["8h", "hour", 8*120], ["12h", "hour", 12*120], ["1d", "day", 120], ["3d", "day", 3*120], ["1w", "day", 7*120]]

    for(let i=0; i<ranges.length; i++) {
      if(interval == ranges[i][0]) {
        chart.selectRange(ranges[i][1], ranges[i][2], true);
      }
    }
  }

  anychartExport.exportTo(chart, "png").then(
    function (image) {
      let keyboard = []
      let intervals = ["1m,1h,4h,1d"]
      for(let i=0; i<intervals.length; i++) {
        keyboard.push({ text: `${intervals[i]}`, callback_data: `chartUpdate ${type} ${pair} ${interval} ${intervals[i]}`})
      }


      if(edit) {
        botUtilities.editPhoto(chatId, edit.msgId, image, { caption: "*Hey*", parse_mode: "Markdown", reply_markup: { inline_keyboard: [keyboard] } })
      } else {
        botUtilities.sendPhoto(chatId, image, { caption: "*Hey*", parse_mode: "Markdown", reply_markup: { inline_keyboard: [keyboard] } });
      }
      return
      // "\n\n[Join WizScalp to get free signals](https://t.me/WizScalp)";
    },
    function (generationError) {
      console.log(generationError);
    }
  );

  function deleteChart(rand) {
    fs.unlink(rand, function (err) {
      if (err && err.code == "ENOENT") {
        // file doesn't exist
        console.info("File doesn't exist, won't remove it.");
      } else if (err) {
        // other errors, e.g. maybe we don't have enough permission
        console.error("Error occurred while trying to remove file");
      } else {
        console.info(`removed`);
      }
    });
  }
}

// -----> @scratis
let getScaledData = (data, globalScale) => {
  if (isArray(data))
    for (let i = 0; i < data.length; i++)
      if (isArray(data[i]))
        for (let j = 1; j < 5; j++)
          data[i][j] = parseInt(pad(data[i][j], globalScale));
  return data;
}
// --> new
let getScaledData_new = (data) => {
  let result = {
    maxVolume: 0,
    data: data,
  };

  if (isArray(data))
    for (let i = 0; i < data.length; i++)
      if (isArray(data[i]) && data[i].length >= 5) {
        for (let j = 1; j < 5; j++)
          data[i][j] = parseInt(pad(data[i][j], globalScale));

        if (data[i].length > 5 && data[i][5] > result.maxVolume)
          result.maxVolume = data[i][5];
      }
  return result;
}
let getMaxVolume = (data) => {
  let maxVolume = 1;
  if (isArray(data))
    for (let i = 0; i < data.length; i++)
      if (
        isArray(data[i]) &&
        data[i].length > 5 &&
        data[i][5] > maxVolume
      )
        maxVolume = data[i][5];

  return maxVolume;
}
let getMaxPrice = (data) => {
  let maxPrice = 0;
  let startIndex = 0;
  if (isArray(data)) {
    if (data.length > 120) {
      startIndex = data.length - 120;
    }
    for (let i = startIndex; i < data.length; i++) {
      if (
        isArray(data[i]) &&
        data[i].length > 5 &&
        data[i][1] > maxPrice
      ) {
        maxPrice = data[i][1];
      }
    }
  }

  return maxPrice;
}
let getMinPrice = (data) => {
  let minPrice = 1000000000000000000000000000;
  let startIndex = 0;
  if (isArray(data)) {
    if (data.length > 120) {
      startIndex = data.length - 120;
    }
    for (let i = startIndex; i < data.length; i++) {
      if (
        isArray(data[i]) &&
        data[i].length > 5 &&
        data[i][2] < minPrice
      ) {
        minPrice = data[i][2];
      }
    }
  }

  return minPrice;
}
// <-- new
let toStr = (n) => {
  let nStr = n.toString().toLowerCase();

  if (nStr.indexOf("e-") > -1) {
    let arr = nStr.split("e-");
    let p1 = arr[0];
    let p2 = parseInt(arr[1]);

    let buffer = "0.";
    for (let i = 0; i < p2 - 1; i++) buffer += "0";

    for (let i = 0; i < p1.length; i++)
      if (p1[i] !== ".") buffer += p1[i];

    nStr = buffer;
  } else if (nStr.indexOf("e") > -1) {
    let arr = null;
    if (nStr.indexOf("e+") > -1) arr = nStr.split("e+");
    else arr = nStr.split("e");

    let p1 = arr[0];
    let p2 = parseInt(arr[1]);
    let arr2 = p1.split(".");
    let p11 = arr2[0];
    let p12 = arr2[1];

    if (p12 && p12.length < p2) {
      for (let i = 0; i < p12.length; i++) {
        buffer += p12[i];
        if (i == p2) buffer += ".";
      }
    } else {
      let buffer = p11;

      if (!p12) p12 = "";

      if (!!p12) buffer += p12;

      for (let i = 0; i < p2 - p12.length; i++) buffer += "0";
    }

    nStr = buffer;
  }

  return nStr;
}
let pad = (n, len) => {
  let nStr = toStr(n);
  let periodPos = nStr.indexOf(".");
  let intPart = nStr;
  let floatPart = "";

  if (periodPos > -1) {
    intPart = nStr.slice(0, periodPos);
    floatPart = nStr.slice(periodPos + 1);
  }

  for (let i = floatPart.length; i < len; i++) floatPart += "0";
  return parseInt(intPart + floatPart);
}
let unpad = (n, len) => {
  let s = n.toString();
  let parts = s.split(".");
  s = parts[0];
  f = parts[1];
  let q = "";

  for (let i = 0, j = s.length - 1; i < len || j > -1; i++, j--)
    if (j > -1) {
      if (i == len) q = "." + q;

      q = s[j] + q;
    } else q = "0" + q;

  if (q.length <= len) q = "0." + q;

  if (!!f) q += f;

  let result = "";
  if (q) {
    if (q.indexOf(".") < 0) result = q;
    else {
      let qParts = q.split(".");
      let qInt = qParts[0];
      let qFloat = qParts[1];
      let qResultFloat = "";

      if (!!qFloat) {
        let notZero = false;
        for (let i = qFloat.length - 1; i > -1; i--) {
          let digit = qFloat[i];
          if (notZero || (notZero = digit != "0"))
            qResultFloat = digit + qResultFloat;
        }
      }

      result = qInt + (qResultFloat.length > 0 ? "." + qResultFloat : "");
    }
  }

  return result;
}
let isArray = (input) => {
  return ( input && Object.prototype.toString.call(input) === "[object Array]");
}
// <----- @scratis

let chartUtilities = {
  getDataTable,
  getLinearScale,
  getStockChart,
  sendChart,
  toStr,
  pad,
  unpad,
  isArray,
  getScaledData,
  getMaxVolume,
  getMaxPrice,
  getMinPrice
}

module.exports.chartUtilities = chartUtilities  