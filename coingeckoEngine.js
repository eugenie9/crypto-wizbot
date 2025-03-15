// This is for Coingecko API v3
// https://www.coingecko.com/en/api
const common = require("./common");
const axios = require("axios");
const base = "https://api.coingecko.com/api/v3/";

const fetchIDs = async () => {
  try {
    const response = await axios.get(base + "coins/list");
    for (const pair of response.data) {
      common.coingeckoIDs.push({ id: pair.id, symbol: pair.symbol });
    }
    return;
  } catch (error) {
    console.error("Error fetching IDs:", error);
    return;
  }
};

const getGlobalData = async () => {
  try {
    const response = await axios.get(base + "global");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching global data:", error);
    return null;
  }
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
  try {
    const response = await axios.get(base + "search/trending");
    return { coins: response.data.coins };
  } catch (error) {
    console.error("Error fetching trending coins:", error);
    return { coins: [] };
  }
};

const getPairData = async (id) => {
  try {
    const response = await axios.get(
      base +
        `/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching pair data:", error);
    return null;
  }
};

const getPrice = async (id) => {
  try {
    const response = await axios.get(
      base +
        `/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    const data = response.data;
    const { symbol, name, market_data } = data;
    return { symbol, name, market_data };
  } catch (error) {
    console.error("Error fetching price:", error);
    return null;
  }
};

const coinGeckoUtilities = {
  fetchIDs,
  getTop10MarketCapPercentages,
  getTrendingCoins,
  getPairData,
  getPrice,
};

module.exports.coinGeckoUtilities = coinGeckoUtilities;
