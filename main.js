let { botUtilities } = require("./bot")
let { binanceUtilities } = require("./binanceEngine")
let { databaseEngine } = require("./databaseEngine")
let { coinGeckoUtilities } = require("./coingeckoEngine")
let { common } = require("./common")
let config = require("./config")

// This is just to ensure prices are almost up-to date when system is restarted.
let updatePriceDatabaseXSecond = (x) => {
  setInterval(() => {
    for (let pair in common.pairsInfo) {
      databaseEngine.priceDatabase.set(pair, parseFloat(common.pairsInfo[pair].price)).write()
    }
  }, x*1000)
}

let start = async() => {
  try {
    if(config.superuser==0 || isNaN(config.superuser)) {
      console.log('\x1b[31m%s\x1b[0m', "Please configure a valid Telegram Id number.")
      return
    }
  
    await binanceUtilities.initExchangeInfo()
    binanceUtilities.startFetchingPrices()
    await coinGeckoUtilities.fetchIDs()
    botUtilities.sendMessage(config.superuser, "*System started*", { parse_mode: "Markdown" })
    
    updatePriceDatabaseXSecond(30)
  } catch(e) {
    console.log(e)
  }
}

start()