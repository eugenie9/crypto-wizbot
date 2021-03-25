const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('database.json')
const db = low(adapter)

const adapter2 = new FileSync('priceDatabase.json')
const priceDatabase = low(adapter2)

db.defaults({
  common: {
    pairQuotes: []
  }
}).write()

let getCommonProperty = (property) => db.get("common").get(property).value()

let addPairQuote = (quote) => {
  db.get("common").get("pairQuotes").push(quote).write()
}

let databaseEngine = {
  db,
  getCommonProperty,
  addPairQuote,
  priceDatabase
}

module.exports.databaseEngine = databaseEngine