// This is for Coingecko API v3
// https://www.coingecko.com/en/api
const { common } = require("./common");
const axios = require("axios");
const base = "https://api.coingecko.com/api/v3/";

const inMemory = {};
inMemory.trending = { coins: {}, lastUpdated: 0 };

const fetchIDs = async () => {
  const response = await axios.get(base + "coins/list");
  for (const pair of response.data) {
    common.coingeckoIDs.push({ id: pair.id, symbol: pair.symbol });
  }
  return;
};

const getGlobalData = async () => {
  const response = await axios.get(base + "global");
  return response.data.data;
};

const getTop10MarketCapPercentages = async () => {
  const data = await getGlobalData();
  return {
    dominance: data.market_cap_percentage,
    mcap: data.total_market_cap.usd,
    volume: data.total_volume.usd,
  };
};

const getTrendingCoins = async () => {
  // Wait 15 minutes before fetching trending coins again
  if (Date.now() - inMemory.trending.lastUpdated > 15 * 60 * 1000) {
    const response = await axios.get(base + "search/trending");
    inMemory.trending.coins = response.data.coins;
    inMemory.trending.lastUpdated = Date.now();
    return { coins: response.data.coins };
  } else {
    return { coins: inMemory.trending.coins };
  }
};

const getPairData = async (id) => {
  const response = await axios.get(
    base +
      `/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  return response.data;
};

const getPrice = async (id) => {
  const response = await axios.get(
    base +
      `/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  );
  const data = response.data;
  const { symbol, name, market_data } = data;
  return { symbol, name, market_data };
};

const coinGeckoUtilities = {
  fetchIDs,
  getTop10MarketCapPercentages,
  getTrendingCoins,
  getPairData,
  getPrice,
};

module.exports.coinGeckoUtilities = coinGeckoUtilities;
