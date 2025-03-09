const { botUtilities } = require("../bot");
const puppeteer = require("puppeteer");
const { utilities } = require("../utilities");
const { common } = require("../common");
const FileSync = require("lowdb/adapters/FileSync");

const execute = async (chatId, args, edit = false) => {
  if (Date.now() - common.heatMapGenerated < 5 * 60 * 1000) {
    botUtilities.sendPhoto(chatId, "./heat.png");
    return;
  }

  common.heatMapGenerated = Date.now();
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await page.goto("https://coin360.com");
  await utilities.waitXSecond(3);
  const base = await page.screenshot({
    encoding: "base64",
    clip: { x: 0, y: 80, width: 1920, height: 975 },
  });
  botUtilities.sendPhoto(chatId, Buffer.from(base, "base64"));

  require("fs").writeFile("./heat.png", base, "base64", function (err) {
    if (err) console.log(err);
  });

  await browser.close();
  return;
};

const command = {
  execute,
};

module.exports.command = command;
