const common = require("./common");
const language = require("./language/english");

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

const getDateString = (timestamp, format = "DD-MM-YYYY") => {
  // Convert Unix timestamp to milliseconds if needed
  if (timestamp < 1e10) {
    timestamp *= 1000;
  }

  const date = new Date(timestamp);

  // Get date components
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  // Padded versions (as strings)
  const dayPadded = day < 10 ? `0${day}` : `${day}`;
  const monthPadded = month < 10 ? `0${month}` : `${month}`;
  const hoursPadded = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesPadded = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsPadded = seconds < 10 ? `0${seconds}` : `${seconds}`;

  // Get language-specific names
  const months = language.months;
  const monthsShort = language.monthsShort;
  const days = language.days;
  const daysShort = language.daysShort;
  const dayOfWeek = date.getDay();

  // Format tokens for replacement
  const tokens = {
    YYYY: year.toString(),
    YY: year.toString().slice(-2),
    MM: monthPadded,
    M: month.toString(),
    MMMM: months[month - 1],
    MMM: monthsShort[month - 1],
    DD: dayPadded,
    D: day.toString(),
    HH: hoursPadded,
    H: hours.toString(),
    mm: minutesPadded,
    m: minutes.toString(),
    ss: secondsPadded,
    s: seconds.toString(),
    dddd: days[dayOfWeek],
    ddd: daysShort[dayOfWeek],
  };

  // Handle predefined formats for backward compatibility
  if (format === "DD-MM-YYYY") return `${dayPadded}-${monthPadded}-${year}`;
  if (format === "MM-DD-YYYY") return `${monthPadded}-${dayPadded}-${year}`;
  if (format === "YYYY-MM-DD") return `${year}-${monthPadded}-${dayPadded}`;
  if (format === "DD-MM-YYYY HH:MM")
    return `${dayPadded}-${monthPadded}-${year} ${hoursPadded}:${minutesPadded}`;
  if (format === "MM-DD-YYYY HH:MM")
    return `${monthPadded}-${dayPadded}-${year} ${hoursPadded}:${minutesPadded}`;
  if (format === "YYYY-MM-DD HH:MM")
    return `${year}-${monthPadded}-${dayPadded} ${hoursPadded}:${minutesPadded}`;
  if (format === "DD-MM") return `${dayPadded}-${monthPadded}`;
  if (format === "Monday, January 1")
    return `${days[dayOfWeek]}, ${months[month - 1]} ${day}`;
  if (format === "Mon, Jan 1")
    return `${daysShort[dayOfWeek]}, ${monthsShort[month - 1]} ${day}`;
  if (format === "Jan 1") return `${monthsShort[month - 1]} ${day}`;
  if (format === "January 1") return `${months[month - 1]} ${day}`;

  // Custom format using tokens
  let result = format;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replace(new RegExp(token, "g"), value);
  }

  return result;
};

module.exports = {
  waitXSecond,
  howManySpace,
  getQuote,
  countDecimals,
  shortenNumber,
  findLongest,
  findCoinGeckoID,
  getDateString,
};
