let { databaseEngine } = require("./databaseEngine")
let intervals = ["1m","3m","5m","15m","30m","1h","2h","4h","6h","8h","12h","1d","3d","1w","1M"]
let pairQuotes = JSON.parse(JSON.stringify(databaseEngine.getCommonProperty("pairQuotes")))

let coingeckoIDs = []
let pairsInfo = []
let messageQueue = []
let editQueue = []
let photoQueue = []
let editPhotoQueue = []
let lastMessageTimestamp = Date.now()
let minIntervalSendMessage = 100 // ms

// Creates language array
let language = require("./language/index")
let languages = {}

for(let l of language) {
  let { language } = require(`./language/${l.path}`)
  languages[l.shortcut] = language
}

let common = {
  intervals,
  pairQuotes,
  pairsInfo,
  coingeckoIDs,
  messageQueue,
  editQueue,
  photoQueue,
  editPhotoQueue,
  lastMessageTimestamp,
  minIntervalSendMessage,
  languages
}

module.exports.common = common