// This is for Coingecko API v3
// https://www.coingecko.com/en/api
let { common } = require("./common")
const axios = require('axios');
let base = "https://api.coingecko.com/api/v3/"

let inMemory = {}
inMemory.trending = {coins: {}, lastUpdated:0}

let fetchIDs = async() => {
  let response = await axios.get(base+'coins/list')
  for(let pair of response.data) {
    common.coingeckoIDs.push({id: pair.id, symbol: pair.symbol})
  }
  return
}

let getGlobalData = async() => {
  let response = await axios.get(base+'global')
  response = response.data.data
  return response
}

let getTop10MarketCapPercentages = async() => {
  let data = await getGlobalData()
  return {dominance: data.market_cap_percentage, mcap:data.total_market_cap.usd, volume: data.total_volume.usd}
}

let getTrendingCoins = async() => {
  // Wait 15 minutes before fetching trending coins again
  if(Date.now() - inMemory.trending.lastUpdated > 15*60*1000) {
    let response = await axios.get(base+'search/trending') 
    inMemory.trending.coins = response.data.coins
    inMemory.trending.lastUpdated = Date.now()
    return {coins: response.data.coins}
  } else {
    return {coins: inMemory.trending.coins}
  }
}

let getPairData = async(id) => {
  let response = await axios.get(base+`/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
  return response.data
}

let getPrice = async(id) => {
  let response = await axios.get(base+`/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`)
  let data = response.data
  let {symbol,name,market_data} = data
  return {symbol,name,market_data}
}

let coinGeckoUtilities = {
  fetchIDs,
  getTop10MarketCapPercentages,
  getTrendingCoins,
  getPairData,
  getPrice
}


module.exports.coinGeckoUtilities = coinGeckoUtilities