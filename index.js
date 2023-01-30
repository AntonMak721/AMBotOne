const TelegramApi = require("node-telegram-bot-api");
// const options = require("./options");
const { gameOptions, againOptions } = require("./options");
const sequelize = require("./db");
const UserModel = require("./models");
const token = "5875733951:AAGUxk_C_9mYXSqeqiVpuFNQntIF8Okg7L8";

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

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
  } catch (e) {
    console.log("Подключение к бд сломалось!", e);
  }

  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра угадай цифру" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    try {
      if (text === "/start") {
        await UserModel.create({ chatId });
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
        const user = await UserModel.findOne({ chatId });
        return bot.sendMessage(
          chatId,
          `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}. В игре у тебя правильных ответов ${user.right}, а неправильных ${user.wrong}`
        );
      }

      if (text === "/game") {
        return startGame(chatId);
      }

      return bot.sendMessage(chatId, "Я тебя не понимаю попробуй еще раз!)");
    } catch (e) {
      return bot.sendMessage(chatId, "Произошла какая-то ошибка!");
    }
  });

  bot.on("callback_query", async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }

    const user = await UserModel.findOne({ chatId });
    if (data == chats[chatId]) {
      user.right += 1;
      await bot.sendMessage(
        chatId,
        `Поздравляем ты угадал цифру ${chats[chatId]}.`,
        againOptions
      );
    } else {
      user.wrong += 1;
      await bot.sendMessage(
        chatId,
        `К сожалению, бот загадал цифру ${chats[chatId]}.`,
        againOptions
      );
    }
    await user.save();
  });
};

start();
