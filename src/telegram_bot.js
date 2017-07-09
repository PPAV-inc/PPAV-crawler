import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import receivedMessage from './utils/telegram_receivedMessage';
import { saveUserInfo } from './models/users';

const token = config.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (message) => {
  const chatId = message.chat.id;

  await saveUserInfo(chatId);
});

bot.onText(/[#＃]\s*\+*\s*(\S+)/, async (message, match) => {
  const chatId = message.chat.id;
  const messageText = match[1];

  const strArr = await receivedMessage(message, messageText, 'code');

  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
});

bot.onText(/[%％]\s*\+*\s*(\S+)/, async (message, match) => {
  const chatId = message.chat.id;
  const messageText = match[1];

  const strArr = await receivedMessage(message, messageText, 'models');

  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
});

bot.onText(/[@＠]\s*\+*\s*(\S+)/, async (message, match) => {
  const chatId = message.chat.id;
  const messageText = match[1];

  const strArr = await receivedMessage(message, messageText, 'title');

  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
});

bot.onText(/^PPAV$/i, async (message) => {
  const chatId = message.chat.id;

  const strArr = await receivedMessage(message, 'PPAV');

  for (const str of strArr) {
    await bot.sendMessage(chatId, str);
  }
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (message) => {
  const chatId = message.chat.id;

  const str = `想看片請輸入 "PPAV"

    其他搜尋功能🔥
    1. 搜尋番號："# + 番號"
    2. 搜尋女優："% + 女優"
    3. 搜尋片名："@ + 關鍵字"`;

  await bot.sendMessage(chatId, str);
});

export default bot;
