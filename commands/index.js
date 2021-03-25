let commands = [
  {
    path: "chart.js",
    triggers: ["/chart","/c"],
    description: {
      "en": "'/c XRPBNB 4h' creates chart for given interval",
      "tr": "'/c XRPBNB 4h' belirtilen aralıkta grafik oluşturur."
    }
  },
  {
    path: "price.js",
    triggers: ["/price","/p"],
    description: {
      "en": "'/p BTCUSDT' returns the daily price information.",
      "tr": "'/p BTCUSDT' günlük fiyat bilgisini döndürür."
    }
  },
  {
    path: "depth.js",
    triggers: ["/depth", "/d"],
    description: {
      "en": "'/d GVTBTC' returns the market depth",
      "tr": "'/d GVTBTC' emir tablosunu döndürür."
    }
  },  
  {
    path: "mcap.js",
    triggers: ["/mcap", "/mcap"],
    description: {
      "en": "returns the top 10 market dominance",
      "tr": "ilk 10'un dominans değerini döndürür."
    }
  }, 
  {
    path: "help.js",
    triggers: ["/help", "/h"],
    description: {
      "en": "returns command list",
      "tr": "komut listesini döndürür."
    }
  }
]

module.exports = commands
