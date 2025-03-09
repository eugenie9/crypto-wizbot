const { common } = require("./common");

const waitXSecond = async (x) => {
  await new Promise((done) => setTimeout(done, x * 1000));
};

const howManySpace = (text, limit) => {
  let space = "";
  for (let i = 0; i < limit - text.length; i++) {
    space += " ";
  }

  return space;
};

const getQuote = (pair) => {
  for (let i = 0; i < common.pairQuotes.length; i++) {
    if (pair.endsWith(common.pairQuotes[i])) {
      return common.pairQuotes[i];
    }
  }
};

const countDecimals = (num) => {
  const text = num.toString();
  const index = text.indexOf(".");
  return text.length - index - 1;
};

// Taken from https://stackoverflow.com/questions/36734201/how-to-convert-numbers-to-million-in-javascript/36734774
const shortenNumber = (labelValue) => {
  // Nine Zeroes for Billions
  return Math.abs(Number(labelValue)) >= 1.0e6
    ? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
    : // Three Zeroes for Thousands
    Math.abs(Number(labelValue)) >= 1.0e3
    ? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
    : Math.abs(Number(labelValue)).toFixed(2);
};

const findLongest = (pairs) => {
  let max = 0;

  for (let i = 0; i < pairs.length; i++) {
    max = pairs[i].length > max ? pairs[i].length : max;
  }

  return max;
};

const findCoinGeckoID = (symbol) => {
  for (const pair of common.coingeckoIDs) {
    if (pair.symbol == symbol) {
      return pair.id;
    }
  }

  return false;
};

const utilities = {
  waitXSecond,
  howManySpace,
  getQuote,
  countDecimals,
  shortenNumber,
  findLongest,
  findCoinGeckoID,
};

module.exports.utilities = utilities;
