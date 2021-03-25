let { common } = require("./common")

let waitXSecond = async (x) => {
  await new Promise((done) => setTimeout(done, x * 1000));
};

let howManySpace = (text, limit) => {
  let space = ""
  for(let i=0; i<limit-text.length; i++) {
    space += " "
  }

  return space
}

let getQuote = (pair) => {
  for(let i=0; i<common.pairQuotes.length; i++) {
    if(pair.endsWith(common.pairQuotes[i])) {
      return common.pairQuotes[i]
    }
  }
}

let countDecimals = (num) => {
  let text = num.toString();
  let index = text.indexOf(".");
  return text.length - index - 1;
}

// Taken from https://stackoverflow.com/questions/36734201/how-to-convert-numbers-to-million-in-javascript/36734774
let shortenNumber = (labelValue) => {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+6

    ? (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3

    ? (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K"

    : Math.abs(Number(labelValue)).toFixed(2);
}

let utilities = {
  waitXSecond,
  howManySpace,
  getQuote,
  countDecimals,
  shortenNumber
}

module.exports.utilities = utilities