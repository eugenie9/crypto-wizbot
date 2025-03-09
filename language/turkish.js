const languages = require(".");

const errorMessages = {
  pairDoesNotExist:
    "Sorgulamaya çalıştığınız koin/token, desteklemiş olduğum borsalarda bulunmuyor.",
  intervalDoesNotExist:
    "Sorgulamaya çalıştığınız zaman aralığı bulunmuyor. Geçerli zaman aralıkları: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M",
};

const language = {
  errorMessages,
};

module.exports.language = language;
