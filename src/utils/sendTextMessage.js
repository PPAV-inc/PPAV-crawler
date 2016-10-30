import callSendAPI from './callSendAPI';

const sendTextMessage = (recipientId, messageText) => {
  return new Promise(resolve => {
    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    };
    callSendAPI(messageData).then(returnBool => {
      if (returnBool) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
};

export default sendTextMessage;
