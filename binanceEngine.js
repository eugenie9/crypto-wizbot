const binanceLib = require("node-binance-api")
let { common } = require("./common")
let { databaseEngine } = require("./databaseEngine")
let markets = []

let binance = new binanceLib({
  reconnect: true,
  log: (log) => {},
})

/**
 * Connects to the Binance API and fetches exchange info and trading pairs.
 */
let initExchangeInfo = async () => {
  try {
    let data = await binance.exchangeInfo()
    if (data.symbols) {
      for (let obj of data.symbols) {
        if(obj.status!="TRADING") {
          continue
        }
        let filters = { status: obj.status }
        for (let filter of obj.filters) {
          if (filter.filterType == "MIN_NOTIONAL") {
            filters.minNotional = filter.minNotional
          } else if (filter.filterType == "PRICE_FILTER") {
            filters.minPrice = filter.minPrice
            filters.maxPrice = filter.maxPrice
            filters.tickSize = filter.tickSize
          } else if (filter.filterType == "LOT_SIZE") {
            filters.stepSize = filter.stepSize
            filters.minQty = filter.minQty
            filters.maxQty = filter.maxQty
          }
        }
        filters.orderTypes = obj.orderTypes
        filters.icebergAllowed = obj.icebergAllowed

        common.pairsInfo[obj.symbol] = {}
        common.pairsInfo[obj.symbol].status = obj.status
        common.pairsInfo[obj.symbol].tokenName = obj.baseAsset
        common.pairsInfo[obj.symbol].marketName = obj.quoteAsset

        if(!common.pairQuotes.includes(obj.quoteAsset)) {
          common.pairQuotes.push(obj.quoteAsset)
          databaseEngine.addPairQuote(obj.quoteAsset)
        }

        common.pairsInfo[obj.symbol].filters = filters
        common.pairsInfo[obj.symbol].isMarginTradingAllowed = obj.isMarginTradingAllowed
        common.pairsInfo[obj.symbol].ticks = []
        common.pairsInfo[obj.symbol].bollinger = []
        common.pairsInfo[obj.symbol].price = databaseEngine.priceDatabase.get(obj.symbol).value()
      }
    }

    for (let pair in common.pairsInfo) {
      markets.push(pair)
    }
    
    return
  } catch (e) {
    console.log(e)
    return e
  }
}

/**
 * Fetches klines
 * Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
 * @param {string} pair   
 * @param {string} interval 
 * @param {Integer} limit 
 */
let getTicks = async (pair, interval, limit) => await binance.candlesticks(pair, interval, false, { limit })

/**
 * Returns price
 * @param {string} pair 
 */
let getPrice = (pair) => common.pairsInfo[pair].price

/**
 * 
 * @param {string} pair 
 * @returns {object} {lastUpdateId, bids, asks}
 */
let getDepth = async(pair) => await binance.depth(pair, "", 10000)

/**
 * 
 * @param {string} pair
 * @returns 
 */
let getPrevDay = async(pair) => await binance.prevDay(pair)

let getFundingRates = async() => await binance.futuresFundingRate()

/**
 * Returns boolean if pair exists
 * @param {string} pair 
 */
let doesPairExist = (pair) => {
  for (let p of Object.values(common.pairsInfo)) {
    if(pair == p.tokenName+p.marketName || pair+"BTC" == p.tokenName+p.marketName) {
      return p.tokenName+p.marketName
    }
  }

  return false
}

/**
 * Returns boolean if interval exists
 * @param {string} interval 
 */
let doesIntervalExist = (interval) => {
  for(let i=0; i<common.intervals.length; i++) {
    if(interval==common.intervals[i]) {
      return true
    }
  }

  return false
}

let startFetchingPrices = () => {
  binance.websockets.miniTicker((markets) => {
    for (let pair in markets) {
      common.pairsInfo[pair].price = parseFloat(markets[pair].close)
    }
  })
}

let binanceUtilities = {
  binance,
  initExchangeInfo,
  startFetchingPrices,
  getTicks,
  getPrice,
  getDepth,
  getPrevDay,
  getFundingRates,
  doesPairExist,
  doesIntervalExist
}

module.exports.binanceUtilities = binanceUtilities