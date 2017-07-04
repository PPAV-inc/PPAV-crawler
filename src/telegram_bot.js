import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import telegramReceivedMessage from './utils/telegram_receivedMessage';

const token = config.TELEGRAM_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
  telegramReceivedMessage(msg);
});

export default bot;
