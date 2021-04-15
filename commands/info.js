let { binanceUtilities } = require("../binanceEngine")
let { botUtilities } = require("../bot")
let { coinGeckoUtilities } = require("../coingeckoEngine")
let { utilities } = require("../utilities")
let code = "tr"

let execute = async(chatId, args, edit=false) => {

  let text = "<code>"
  let symbol = args.length==1 ? "btc" : args[1].toLowerCase() 
  let id = utilities.findCoinGeckoID(symbol)
  let data = await coinGeckoUtilities.getPairData(id)

  text += `${data.name} (${data.symbol.toUpperCase()}) #${data.market_cap_rank}\n`
  let m = data.market_data
  text += `Circ. Supply: ${parseFloat(m.circulating_supply).toFixed(0)}\n`
  text += `Total Supply: ${parseFloat(m.total_supply).toFixed(0)}\n`
  m.max_supply = m.max_supply == null ? "Infinity" : m.max_supply
  text += `Max Supply: ${parseFloat(m.max_supply).toFixed(0)}\n`
  let prices = m.current_price
  text += `💵: $${prices.usd} | ${prices.btc}₿\n`
  text += `24h: $${m.low_24h.usd} | $${m.high_24h.usd}\n`
  text += `24h: ${m.low_24h.btc}₿|${m.high_24h.btc}₿\n`
  let ath = m.ath
  let atl = m.atl
  let ath_date = m.ath_date
  let atl_date = m.atl_date
  if(m.ath && m.atl) {
    text += `ATH $: $${ath.usd} (${ath_date.usd.slice(0, ath_date.usd.indexOf("T"))})\n`
    text += `ATL $: $${atl.usd} (${atl_date.usd.slice(0, atl_date.usd.indexOf("T"))})\n`
    text += `ATH ₿: ${ath.btc}₿ (${ath_date.btc.slice(0, ath_date.btc.indexOf("T"))})\n`
    text += `ATL ₿: ${atl.btc}₿ (${atl_date.btc.slice(0, atl_date.btc.indexOf("T"))})\n`
  }

  if(m.roi) {
    text += `ROI: ${parseFloat(m.roi.percentage).toFixed(2)}% in ${m.roi.currency.toUpperCase()}\n`
  }

  text += `24h: ${parseFloat(m.price_change_percentage_24h).toFixed(2)}% | 7d: ${parseFloat(m.price_change_percentage_7d).toFixed(2)}%\n`
  text += `30d: ${parseFloat(m.price_change_percentage_30d).toFixed(2)}% | 1y: ${parseFloat(m.price_change_percentage_1y).toFixed(2)}%\n`

  text += "</code>"

  let options = { parse_mode:"HTML" };
  
  botUtilities.sendMessage(chatId, text, options)
}

let command = {
  execute
}

module.exports.command = command
