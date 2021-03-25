// This is for Coingecko API v3
// https://www.coingecko.com/en/api
const axios = require('axios');
let base = "https://api.coingecko.com/api/v3/"

let getGlobalData = async() => {
  let response = await axios.get(base+'global')
  response = response.data.data
  return response
}

let getTop10MarketCapPercentages = async() => {
  let data = await getGlobalData()
  return {dominance: data.market_cap_percentage, mcap:data.total_market_cap.usd, volume: data.total_volume.usd}
}

let coinGeckoUtilities = {
  getTop10MarketCapPercentages
}

module.exports.coinGeckoUtilities = coinGeckoUtilities