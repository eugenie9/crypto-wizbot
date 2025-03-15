const binanceLib = require("node-binance-api");
const common = require("./common");
const { databaseEngine } = require("./databaseEngine");
const markets = [];
const quotes = {};

const binance = new binanceLib({
  reconnect: true,
  log: (log) => {},
});

/**
 * Connects to the Binance API and fetches exchange info and trading pairs.
 */
const initExchangeInfo = async () => {
  try {
    const data = await binance.exchangeInfo();
    if (data.symbols) {
      for (const obj of data.symbols) {
        if (obj.status != "TRADING") {
          continue;
        }
        const filters = { status: obj.status };
        for (const filter of obj.filters) {
          if (filter.filterType == "MIN_NOTIONAL") {
            filters.minNotional = filter.minNotional;
          } else if (filter.filterType == "PRICE_FILTER") {
            filters.minPrice = filter.minPrice;
            filters.maxPrice = filter.maxPrice;
            filters.tickSize = filter.tickSize;
          } else if (filter.filterType == "LOT_SIZE") {
            filters.stepSize = filter.stepSize;
            filters.minQty = filter.minQty;
            filters.maxQty = filter.maxQty;
          }
        }
        filters.orderTypes = obj.orderTypes;
        filters.icebergAllowed = obj.icebergAllowed;

        common.pairsInfo[obj.symbol] = {};
        common.pairsInfo[obj.symbol].status = obj.status;
        common.pairsInfo[obj.symbol].tokenName = obj.baseAsset;
        common.pairsInfo[obj.symbol].marketName = obj.quoteAsset;

        if (!common.pairQuotes.includes(obj.quoteAsset)) {
          common.pairQuotes.push(obj.quoteAsset);
          databaseEngine.addPairQuote(obj.quoteAsset);
        }

        if (!quotes[obj.baseAsset]) {
          quotes[obj.baseAsset] = [];
        }

        quotes[obj.baseAsset].push(obj.quoteAsset);

        common.pairsInfo[obj.symbol].filters = filters;
        common.pairsInfo[obj.symbol].isMarginTradingAllowed =
          obj.isMarginTradingAllowed;
        common.pairsInfo[obj.symbol].ticks = [];
        common.pairsInfo[obj.symbol].bollinger = [];
        common.pairsInfo[obj.symbol].price = databaseEngine.priceDatabase
          .get(obj.symbol)
          .value();
      }
    }

    for (const pair in common.pairsInfo) {
      markets.push(pair);
    }

    return;
  } catch (e) {
    console.log(e);
    return e;
  }
};

/**
 * Fetches klines
 * Intervals: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
 * @param {string} pair
 * @param {string} interval
 * @param {Integer} limit
 */
const getTicks = async (pair, interval, limit) =>
  await binance.candlesticks(pair, interval, false, { limit });

/**
 * Returns price
 * @param {string} pair
 */
const getPrice = (pair) => common.pairsInfo[pair].price;

/**
 *
 * @param {string} pair
 * @returns {object} {lastUpdateId, bids, asks}
 */
const getDepth = async (pair) => await binance.depth(pair, "", 10000);

/**
 *
 * @param {string} pair
 * @returns
 */
const getPrevDay = async (pair) => await binance.prevDay(pair);

const getFundingRates = async () => await binance.futuresFundingRate();

/**
 * Returns boolean if pair exists
 * @param {string} pair
 */
const doesPairExist = (pair) => {
  for (const p of Object.values(common.pairsInfo)) {
    if (pair == p.tokenName + p.marketName) {
      return p.tokenName + p.marketName;
    }
  }
  if (quotes[pair]?.length > 0) {
    if (quotes[pair].includes("USDT")) {
      return pair + "USDT";
    }

    if (quotes[pair].includes("BTC")) {
      return pair + "BTC";
    }

    return pair + quotes[pair][0];
  }

  return false;
};

/**
 * Returns boolean if interval exists
 * @param {string} interval
 */
const doesIntervalExist = (interval) => {
  for (let i = 0; i < common.intervals.length; i++) {
    if (interval == common.intervals[i]) {
      return true;
    }
  }

  return false;
};

const startFetchingPrices = () => {
  binance.websockets.miniTicker((markets) => {
    for (const pair in markets) {
      common.pairsInfo[pair].price = parseFloat(markets[pair].close);
    }
  });
};

const binanceUtilities = {
  binance,
  initExchangeInfo,
  startFetchingPrices,
  getTicks,
  getPrice,
  getDepth,
  getPrevDay,
  getFundingRates,
  doesPairExist,
  doesIntervalExist,
};

module.exports.binanceUtilities = binanceUtilities;
