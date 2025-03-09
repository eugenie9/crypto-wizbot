const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("database.json");
const db = low(adapter);

const adapter2 = new FileSync("priceDatabase.json");
const priceDatabase = low(adapter2);

db.defaults({
  common: {
    pairQuotes: [],
  },
}).write();

const getCommonProperty = (property) => db.get("common").get(property).value();

const addPairQuote = (quote) => {
  db.get("common").get("pairQuotes").push(quote).write();
};

const databaseEngine = {
  db,
  getCommonProperty,
  addPairQuote,
  priceDatabase,
};

module.exports.databaseEngine = databaseEngine;
