let { botUtilities } = require("../bot")
const { coinGeckoUtilities } = require("../coingeckoEngine")
let { utilities } = require("../utilities")
let code = "tr"

let execute = async(chatId, args, edit=false) => {

  let data = await coinGeckoUtilities.getTrendingCoins()
  let names = []
  let symbols = []

  for(let c of data.coins) {
    names.push(c.item.name)
    symbols.push(c.item.symbol)
  }

  let maxN = utilities.findLongest(names)
  let maxS = utilities.findLongest(symbols)

  let text = "<code>🔥Trending Coins\n\n"

  for(let c of data.coins) {
    c = c.item
    text += `${c.name}${utilities.howManySpace(c.name,maxN)} (${c.symbol}) ${utilities.howManySpace(c.symbol, maxS)}#${c.market_cap_rank}\n`
  }

  text += "</code>"
  
  botUtilities.sendMessage(chatId, text, {parse_mode: "HTML"})
}

let command = {
  execute
}

module.exports.command = command
