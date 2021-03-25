let { botUtilities } = require("../bot")

let execute = async(chatId, args, edit=false) => {
  // Default: english
  let lang  = args.length<2 ? "en" : args[1]

  let languages = require("../language/index")
  let allowedLanguages = []
  for(let l of languages) {
    allowedLanguages.push(l.shortcut)
  }

  // If user sends an invalid shortcut, english is set as a language.
  lang = allowedLanguages.includes(lang) ? lang : "en"

  let commands = require("./index")
  let text = ""

  if(allowedLanguages.includes(lang)) {
    for(let c of commands) {
      text += `${c.triggers[0]} - ${c.description[lang]}\n`
    }
  } 

  botUtilities.sendMessage(chatId, text)
}

let command = {
  execute
}

module.exports.command = command

