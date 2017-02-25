import 'babel-polyfill';
import TelegramBot from 'node-telegram-bot-api';
import config from './config';
import t_receivedMessage from './utils/telegram_receivedMessage';

const token = config.TELEGRAM_TOKEN;
const port = process.env.PORT || 8443;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    //////////
    console.log(`Im not sure when this works.`);
    //////////

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"

    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
    if (msg) {
        t_receivedMessage(msg);
    }
});

export default bot;
