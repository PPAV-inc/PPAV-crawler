import * as logs from '../models/logs';
import * as videos from '../models/videos';
import bot from '../telegram_bot';

const receivedMessage = async (message) => {
    const chatId = message.chat.id,
        messageText = message.text,
        timeOfMessage = message.date;          


    console.log(`收到訊息：'${messageText}'，從 id '${chatId}' at ${timeOfMessage}`);

    if (messageText === 'PPAV' || messageText === 'ppav' || messageText === 'Ppav') {
        const returnArr = await videos.getRandomThreeVideos();
        const promises = await sendArrMessages(chatId, returnArr);

        Promise.all(promises).then((values) => {
            logs.saveLogData(true, {
                senderID: chatId,
                messageText: messageText,
                result: 'PPAV',
            }); 
        }, (err) => {
            console.log(err);
        }); 
    } else {
        bot.sendMessage(chatId, 'Hi, I am back.');
    }   
  
};

const sendArrMessages = (chatId, returnArr) => {
    return returnArr.map((each_msg) => {
        return new Promise((resolve, reject) => {
            // send a message to the chat acknowledging receipt of their message
            bot.sendMessage(chatId, each_msg.url).then((msg_return) => {
                resolve(msg_return);
            }).catch((err) => {
                reject(err);
            }); 
        });
    });
} 

export default receivedMessage;
