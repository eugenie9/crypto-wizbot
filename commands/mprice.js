let { binanceUtilities } = require("../binanceEngine")
let { botUtilities } = require("../bot")
let { utilities } = require("../utilities")
let code = "tr"

let execute = async(chatId, args, edit=false) => {
  if(args.length==1) { return }

  let text = "<code>"
  let pairs = []

  for(let i=0; i<args.length; i++) {
    let pair = args[i].toUpperCase()
    pair = binanceUtilities.doesPairExist(pair)

    if(pair) { pairs.push(pair) }
  }

  let max = utilities.findLongest(pairs)

  for(let i=0; i<pairs.length; i++) {
    let pair = pairs[i]
    let price = binanceUtilities.getPrice(pair)
    text += `${pair}${utilities.howManySpace(pair,max)}: ${price}\n`
  }

  text += "</code>"

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
