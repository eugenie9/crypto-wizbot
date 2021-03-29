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
    path: "mprice.js",
    triggers: ["/mprice", "/mp"],
    description: {
      "en": "/mp BTCUSDT ETHUSDT' returns the price of both",
      "tr": "/mp BTCUSDT ETHUSDT' her ikisinin de fiyatını döndürür."
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
    path: "trending.js",
    triggers: ["/trending", "/trend"],
    description: {
      "en": "returns the trending coins on CoinGecko",
      "tr": "CoinGecko üzerinde en popüler koinleri döndürür."
    }
  },
  {
    path: "info.js",
    triggers: ["/info", "/i"],
    description: {
      "en": "'/info GVT' returns information about GVT",
      "tr": "'/info GVT' GVT hakkında bilgiler döndürür."
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
