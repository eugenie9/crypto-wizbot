const axios = require("axios");

const symbolSearch = async (symbol) => {
  const response = await axios.get(
    `https://symbol-search.tradingview.com/symbol_search/?text=${symbol.toLowerCase()}&hl=1&exchange`,
    {
      headers: {
        Origin: "https://www.tradingview.com",
      },
    }
  );

  let r;
  for (let i = 0; i < response.data.length; i++) {
    r = response.data[i];
    if (r.type == "crypto") {
      r.symbol = r.symbol.replace("<em>", "");
      r.symbol = r.symbol.replace("</em>", "");
      i = response.data.length;
    }

    if (i == response.data.length - 1) {
      r = response.data[0];
      r.symbol = r.symbol.replace("<em>", "");
      r.symbol = r.symbol.replace("</em>", "");
    }
  }

  return r;
};

const tradingviewEngine = {
  symbolSearch,
};

module.exports = tradingviewEngine;
