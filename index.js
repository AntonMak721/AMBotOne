const TelegramApi = require("node-telegram-bot-api");
const options = require("./options");
const {gameOptions, againOptions} = require('./options')
const token = "5875733951:AAFDDJO18w7gqOdlG40svsGQQDBxey-pvPE";

const bot = new TelegramApi(token, { polling: true });

const chats = {};


const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    "Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать"
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Твой ход.", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/11.webp"
      );
      return bot.sendMessage(
        chatId,
        "Добро пожаловать в телеграм бот разработчика Антон Макатахина!"
      );
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}.`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }

    return bot.sendMessage(chatId, "Я тебя не понимаю попробуй еще раз!)");
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data == "/again") {
      return startGame(chatId);
    }
    if (data == "chat[ChatId]") {
      return await bot.sendMessage(
        chatId,
        `Поздравляем ты угадал цифру ${chats[chatId]}.`,
        againOptions
      );
    } else {
      return await bot.sendMessage(
        chatId,
        `К сожалению, бот загадал цифру ${chats[chatId]}.`,
        againOptions
      );
    }
  });
};

start();
