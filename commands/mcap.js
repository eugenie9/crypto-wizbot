let { botUtilities } = require("../bot")
let { coinGeckoUtilities } = require("../coingeckoEngine")

let howManySpace = (text, limit) => {
  let space = ""
  for(let i=0; i<limit-text.length; i++) {
    space += " "
  }

  return space
}

let execute = async(chatId, args, edit=false) => {
  try {
    let data = await coinGeckoUtilities.getTop10MarketCapPercentages()
    let {mcap, volume} = data 
    let percentages = data.dominance
    let total = 0

    mcap = mcap.toLocaleString(undefined, {maximumFractionDigits: 0})
    volume = volume.toLocaleString(undefined, {maximumFractionDigits: 0})

    let text = "<code>"
    text += `TOTAL  ${howManySpace(mcap,17)}${mcap}$\n`
    text += `VOLUME ${howManySpace(volume,17)}${volume}$\n\n`
    text += `${howManySpace("",6)} Dominance\n`

    for(let c in percentages) {
      total += percentages[c]
      let p = parseFloat(percentages[c]).toFixed(2)
      text += `${c.toUpperCase()}${howManySpace(c,6)} ${howManySpace(p, 8)}${p}%\n`
    }
    total = parseFloat(total).toFixed(2)
    text += `TOP10${howManySpace("TOP10",6)} ${howManySpace(total,8)}${total}%</code>\n`

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
  } catch (e) {
    botUtilities.sendMessage(chatId, "error in mcap");
  }
}

let command = {
  execute
}

module.exports.command = command
