const errorMessages = {
  pairDoesNotExist:
    "Sorgulamaya çalıştığınız koin/token, desteklemiş olduğum borsalarda bulunmuyor.",
  intervalDoesNotExist:
    "Sorgulamaya çalıştığınız zaman aralığı bulunmuyor. Geçerli zaman aralıkları: 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M",
};

const months = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const monthsShort = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];

const days = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const daysShort = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

const language = {
  errorMessages,
  months,
  monthsShort,
  days,
  daysShort,
};

module.exports.language = language;
