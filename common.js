const { databaseEngine } = require("./databaseEngine");
const intervals = [
  "1m",
  "3m",
  "5m",
  "15m",
  "30m",
  "1h",
  "2h",
  "4h",
  "6h",
  "8h",
  "12h",
  "1d",
  "3d",
  "1w",
  "1M",
];
const pairQuotes = JSON.parse(
  JSON.stringify(databaseEngine.getCommonProperty("pairQuotes"))
);

// These arrays need to be mutable, so we keep them as let
let coingeckoIDs = [];
let pairsInfo = [];
let messageQueue = [];
let editQueue = [];
let photoQueue = [];
let editPhotoQueue = [];
let lastMessageTimestamp = Date.now();
const minIntervalSendMessage = 100; // ms
let heatMapGenerated = 0;

// Creates language array
const language = require("./language/index");
const languages = {};

for (const l of language) {
  const { language } = require(`./language/${l.path}`);
  languages[l.shortcut] = language;
}

const common = {
  intervals,
  pairQuotes,
  pairsInfo,
  coingeckoIDs,
  messageQueue,
  editQueue,
  photoQueue,
  editPhotoQueue,
  lastMessageTimestamp,
  minIntervalSendMessage,
  languages,
  heatMapGenerated,
};

module.exports.common = common;
