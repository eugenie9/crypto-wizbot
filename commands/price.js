let { binanceUtilities } = require("../binanceEngine")
let { common } = require("../common")
let { botUtilities } = require("../bot")
let { utilities } = require("../utilities")
let code = "tr"

let execute = async(chatId, args, edit=false) => {
  let pair = args.length == 1 ? "BTCUSDT" : args[1].toUpperCase()
  pair = binanceUtilities.doesPairExist(pair)

  if(!pair) {
    botUtilities.sendMessage(chatId, common.languages[code].errorMessages["pairDoesNotExist"])
    return
  }

  let data = await binanceUtilities.getPrevDay(pair)
  let market = utilities.getQuote(pair)
  let text = `<code>${pair}${utilities.howManySpace(pair,7)}: ${data.lastPrice}\n\n`
  
  text += `Change : ${parseFloat(data.priceChangePercent).toFixed(2)}%\n`
  text += `High   : ${data.highPrice}\n`
  text += `Average: ${data.weightedAvgPrice}\n`
  text += `Low    : ${data.lowPrice}\n`
  text += `Volume : ${parseFloat(data.quoteVolume).toLocaleString()} ${market}\n`
  text += `</code>`

  let callback_data = ""
  for(let i = 0; i<args.length; i++) {
    if(i==args.length-1) {
      callback_data += args[i]; 
      break
    }
    callback_data += args[i] + " "
  }

  let options = { parse_mode:"HTML", reply_markup: { inline_keyboard: [[{text: "Refresh", callback_data: callback_data}]] } };
  if(edit) { botUtilities.editMessage(chatId, edit.msgId, text, options); return }
  
  botUtilities.sendMessage(chatId, text, options)
}

let command = {
  execute
}

module.exports.command = command
