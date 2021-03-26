let config = require("./config")

if(config.BOT_API_TOKEN.length<37) {
  throw "Please configure a proper API Token for the bot."
}

let { common } = require("./common")
let commands = require("./commands/index")

const TelegramBot = require("node-telegram-bot-api");
const token = config.BOT_API_TOKEN
const bot = new TelegramBot(token, { polling: true });

bot.on("text", async(msg) => {
  if(msg.text.startsWith("/")) {
    let args = msg.text.split(" ");

    for(let c of commands) {
      if(c.triggers.includes(args[0])) {
        let { command } = require(`./commands/${c.path}`)
        command.execute(msg.chat.id, args)
        return
      }
    }
  }
})

bot.on("callback_query", async function onCallbackQuery(callbackQuery) {
  const actDifferently = ["chartUpdate"]

  const action = callbackQuery.data;

  let args = action.split(" ");
  if(!actDifferently.includes(args[0])) {
    const msg = callbackQuery;
    let chatId = msg.message.chat.id;
    let msgId = msg.message.message_id;
  
    for(let c of commands) {
      if(c.triggers.includes(`${args[0]}`)) {
        let { command } = require(`./commands/${c.path}`)
        command.execute(chatId, args, {msgId})
        return
      }
    }
  }

  if (action.startsWith("chartUpdate")) {
    let args = action.split(" ");
    const msg = callbackQuery;
    let chatId = msg.message.chat.id;
    let msgId = msg.message.message_id;

    // If current and asked intervals are different
    if(args[3] != args[4]) {
      for(let c of commands) {
        if(c.triggers.includes(`/${args[1]}`)) {
          let { command } = require(`./commands/${c.path}`)
          command.execute(chatId, args, {msgId, pair: args[2], interval: args[4]})
          return
        }
      }
    }
    return
  }
})

let sendMessage = (chatId, msg, form={}) => {
  if (Date.now() - common.lastMessageTimestamp < common.minIntervalSendMessage || common.messageQueue.length) {
    if (!common.messageQueue.length) {
      let interval = setInterval(function () {
        try {
          let chatIdToSend = common.messageQueue[0][0];
          let msgToSend = common.messageQueue[0][1];
          let formToSend = common.messageQueue[0][2];
          bot.sendMessage(chatIdToSend, msgToSend, formToSend);
          common.lastMessageTimestamp = Date.now();
          common.messageQueue.shift();
          if (!common.messageQueue.length) clearInterval(interval);
        } catch (e) {
          console.log(e);
        }
      }, common.minIntervalSendMessage);
    }
    common.messageQueue.push([chatId, msg, form]);
  } else {
    bot.sendMessage(chatId, msg, form);
    common.lastMessageTimestamp = Date.now();
  }
}

let editMessage = (chatId, msgId, text, form={}) => {
  if (Date.now() - common.lastMessageTimestamp < common.minIntervalSendMessage || common.editQueue.length) {
    if (!common.editQueue.length) {
      let interval = setInterval(function () {
        try {
          let chat = common.editQueue[0][0];
          let msgIdToEdit = common.editQueue[0][1];
          let newText = common.editQueue[0][2];
          let formToEdit = common.editQueue[0][3];
          bot.editMessageText(newText, { chat_id: chat, message_id: msgIdToEdit, ...formToEdit})
          common.lastMessageTimestamp = Date.now();
          common.editQueue.shift();
          if (!common.editQueue.length) clearInterval(interval);
        } catch (e) {
          console.log(e);
        }
      }, common.minIntervalSendMessage);
    }
    common.editQueue.push([chatId, msgId, text, form]);
  } else {
    bot.editMessageText(text, { chat_id: chatId, message_id: msgId, ...form })
    common.lastMessageTimestamp = Date.now();
  }
}

let sendPhoto = (chatId, photo, form={}) => {
  if (Date.now() - common.lastMessageTimestamp < common.minIntervalSendMessage || common.photoQueue.length) {
    if (!common.photoQueue.length) {
      let interval = setInterval(function () {
        try {
          let chat = common.photoQueue[0][0];
          let photoToSend = common.photoQueue[0][1];
          let formToSend = common.photoQueue[0][2];
          bot.sendPhoto(chat, photoToSend, formToSend);
          common.lastMessageTimestamp = Date.now();
          common.photoQueue.shift();
          if (!common.photoQueue.length) clearInterval(interval);
        } catch (e) {
          console.log(e);
        }
      }, common.minIntervalSendMessage);
    }
    common.photoQueue.push([chatId, photo, form]);
  } else {
    bot.sendPhoto(chatId, photo, form);
    common.lastMessageTimestamp = Date.now();
  }
}

let editPhoto = (chatId, msgId, photo, form) => {
  if (Date.now() - common.lastMessageTimestamp < common.minIntervalSendMessage || common.editPhotoQueue.length) {
    if (!common.editPhotoQueue.length) {
      let interval = setInterval(function () {
        try {
          let chat = common.editPhotoQueue[0][0];
          let msgIdToEdit = common.editPhotoQueue[0][1];
          let newPhoto = common.editPhotoQueue[0][2];
          let formToSend = common.editPhotoQueue[0][3];
          bot.editMessageMedia({type: "photo", media: newPhoto, fileOptions: {filename: Math.floor(Math.random()*10+1)}}, {chat_id: chat, message_id: msgIdToEdit, ...formToSend})
          common.lastMessageTimestamp = Date.now();
          common.editPhotoQueue.shift();
          if (!common.editPhotoQueue.length) clearInterval(interval);
        } catch (e) {
          console.log(e);
        }
      }, common.minIntervalSendMessage);
    }
    common.editQueue.push([chatId, msgId, photo, form]);
  } else {
    bot.editMessageMedia({type: "photo", media: photo, fileOptions: {filename: Math.floor(Math.random()*10+1)}}, {chat_id: chatId, message_id: msgId, ...form})
    common.lastMessageTimestamp = Date.now();
  }
}

let botUtilities = { 
  sendMessage,
  editMessage,
  sendPhoto,
  editPhoto
}

module.exports.botUtilities = botUtilities
